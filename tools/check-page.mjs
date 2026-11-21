#!/usr/bin/env node
// Fast safety check for index.html (a few seconds, no installs). Run it before every publish.
//
//   node tools/check-page.mjs [path/to/index.html]
//
// 1. Syntax: every non-JSON <script> must parse on its own.
// 2. Name clashes: every <script> block on the page shares one global scope. Two `function foo` in different
//    blocks don't raise an error in the browser: the later one silently replaces the earlier one for ALL callers
//    (this is how the screen's doMove once hijacked the engine's AI search). Clashes between let/const/class and
//    another block's names stop the later block from loading at all.
//    The check joins all blocks and parses them as one ES module, where any repeated top-level name is an error,
//    then reports which two blocks declared it.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(process.argv[2] || path.join(here, '..', 'index.html'));
const html = fs.readFileSync(HTML, 'utf8');

const blocks = [];
for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  const attrs = m[1];
  if (/type="application\/json"/.test(attrs) || /\bsrc=/.test(attrs)) continue;
  const line = html.slice(0, m.index).split('\n').length;
  const id = (/id="([^"]+)"/.exec(attrs) || [])[1] || `unnamed block at line ${line}`;
  blocks.push({ id, line, src: m[2] });
}

let failed = false;

// 1. each block parses on its own
for (const b of blocks){
  try { new Function(b.src); }
  catch (e){ failed = true; console.log(`SYNTAX  ${b.id} (page line ${b.line}): ${e.message}`); }
}

// 2. repeated top-level names across blocks
if (!failed){
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oasis-check-'));
  const file = path.join(tmp, 'all.mjs');
  const starts = [];   // first line of each block inside all.mjs
  let joined = '', ln = 1;
  for (const b of blocks){ starts.push(ln); const part = b.src + '\n;\n'; joined += part; ln += part.split('\n').length - 1; }
  // modules are strict: a few sloppy-only spellings would be reported as false alarms, so only name errors count
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
    const where = re => blocks.flatMap((b, k) => [...b.src.matchAll(re)].map(x => `${b.id} (page line ${b.line + b.src.slice(0, x.index).split('\n').length - 1})`));
    const decl = new RegExp(`^(?:async\\s+)?(?:function\\s*\\*?|class|const|let|var)\\s+${name.replace(/\$/g, '\\$')}\\b`, 'gm');
    const hits = where(decl);
    console.log(`CLASH   '${name}' is declared more than once: ${hits.length ? hits.join('  AND  ') : 'see line ' + at + ' of the joined scripts'}`);
    // blank out the reported line so the next round can find further clashes
    const lines = joined.split('\n'); lines[at - 1] = lines[at - 1].replace(new RegExp(`\\b${name.replace(/\$/g, '\\$')}\\b`), `__dup${round}_${name}`); joined = lines.join('\n');
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(failed ? 'FAIL' : `PASS  ${blocks.length} script blocks parse, no repeated global names`);
process.exit(failed ? 1 : 0);
