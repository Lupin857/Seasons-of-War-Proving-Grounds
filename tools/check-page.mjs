#!/usr/bin/env node
// Fast safety check for the page and its script files (a few seconds, no installs). Run it before every publish.
//
//   node tools/check-page.mjs [path/to/index.html]
//
// 1. Syntax: every script (inline or js/ file) must parse on its own.
// 2. Name clashes: all scripts share one global scope. Two `function foo` in different files don't raise an error
//    in the browser: the later one silently replaces the earlier one for ALL callers (this is how the screen's
//    doMove once hijacked the engine's AI search). Clashes between let/const/class and another file's names stop
//    the later file from loading at all. The check joins all scripts and parses them as one ES module, where any
//    repeated top-level name is an error, then reports which two files declared it.
// 3. Load order: code that RUNS while a file loads (not inside a function) must not use a name declared in a
//    LATER file: inside one big script that worked (function declarations are hoisted), across files it throws.
//    Wrapping a function (`const f = renderPlay; renderPlay = ...`) counts: put the wrapper after the file that
//    declares it. Needs the TypeScript parser (global in Claude's workspace).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { pageScripts } from './page-files.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(process.argv[2] || path.join(here, '..', 'index.html'));
const blocks = pageScripts(HTML);
const where = (b, idx) => `${b.file || b.id}:${b.src.slice(0, idx).split('\n').length}`;
let failed = false;

// 1. each script parses on its own
for (const b of blocks){
  try { new Function(b.src); }
  catch (e){ failed = true; console.log(`SYNTAX  ${b.file || b.id}: ${e.message}`); }
}

// 2. repeated top-level names across scripts
if (!failed){
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oasis-check-'));
  const file = path.join(tmp, 'all.mjs');
  let joined = blocks.map(b => b.src + '\n;\n').join('');
  const seen = new Set();
  for (let round = 0; round < 50; round++){
    fs.writeFileSync(file, joined);
    let out = '';
    try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); break; }
    catch (e){ out = String(e.stderr || e.message); }
    const name = (/Identifier '([^']+)' has already been declared/.exec(out) || [])[1];
    const at = +((new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':(\\d+)').exec(out) || [])[1] || 0);
    if (!name){ console.log('Could not finish the name check (module parse error that is not a name clash):\n' + out.split('\n').slice(0, 6).join('\n')); break; }
    if (seen.has(name + at)) break;
    seen.add(name + at);
    failed = true;
    const esc = name.replace(/\$/g, '\\$');
    const decl = new RegExp(`^(?:async\\s+)?(?:function\\s*\\*?|class|const|let|var)\\s+${esc}\\b`, 'gm');
    const hits = blocks.flatMap(b => [...b.src.matchAll(decl)].map(x => where(b, x.index)));
    console.log(`CLASH   '${name}' is declared more than once: ${hits.length ? hits.join('  AND  ') : 'see line ' + at + ' of the joined scripts'}`);
    const lines = joined.split('\n'); lines[at - 1] = lines[at - 1].replace(new RegExp(`\\b${esc}\\b`), `__dup${round}_${name}`); joined = lines.join('\n');
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

// 3. load order, with the TypeScript parser (installed globally in Claude's workspace; skipped if missing).
//    Code at the top level of a file runs at load; function bodies run later unless invoked right away.
let ts = null;
try { ts = createRequire(execFileSync('npm', ['root', '-g']).toString().trim() + '/')('typescript'); } catch (e){ ts = null; }
if (!ts) console.log('NOTE    load-order check skipped (TypeScript not found: npm i -g typescript)');
else {
  const sfs = blocks.map(b => ts.createSourceFile(b.file || b.id, b.src, ts.ScriptTarget.Latest, true));
  const firstDecl = new Map();
  sfs.forEach((sf, k) => {
    const add = nm => { if (!firstDecl.has(nm)) firstDecl.set(nm, k); };
    for (const st of sf.statements){
      if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name) add(st.name.text);
      if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) add(d.name.text);
    }
  });
  const isFn = n => ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n) || ts.isMethodDeclaration(n) || ts.isGetAccessor(n) || ts.isSetAccessor(n) || ts.isConstructorDeclaration(n);
  const invokedNow = n => { let p = n.parent; while (p && ts.isParenthesizedExpression(p)){ n = p; p = p.parent; } return p && ts.isCallExpression(p) && p.expression === n; };
  const notARef = (n, p) => (ts.isPropertyAccessExpression(p) && p.name === n) || (ts.isPropertyAssignment(p) && p.name === n) || (ts.isVariableDeclaration(p) && p.name === n) || ts.isParameter(p) || ts.isBindingElement(p) || ((ts.isFunctionDeclaration(p) || ts.isClassDeclaration(p) || ts.isMethodDeclaration(p)) && p.name === n);
  const seenU = new Set();
  sfs.forEach((sf, k) => {
    const visit = n => {
      if (isFn(n) && !invokedNow(n)) return;   // runs later, when every file has loaded
      if (ts.isIdentifier(n) && !notARef(n, n.parent)){
        const at = firstDecl.get(n.text);
        if (at != null && at > k){
          const msg = `${blocks[k].file || blocks[k].id}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} uses ${n.text} while loading, but it is declared later, in ${blocks[at].file || blocks[at].id}`;
          if (!seenU.has(msg)){ seenU.add(msg); failed = true; console.log('ORDER   ' + msg); }
        }
      }
      ts.forEachChild(n, visit);
    };
    sf.statements.forEach(visit);
  });
}

console.log(failed ? 'FAIL' : `PASS  ${blocks.length} scripts parse, no repeated global names, nothing at load uses a later file`);
process.exit(failed ? 1 : 0);
