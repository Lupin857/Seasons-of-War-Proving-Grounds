#!/usr/bin/env node
// Rebuilds the page's built-in snapshot (<script type="application/json" id="snapshot">) from a dump of the
// artifact's server database, so the GitHub Pages site (which can't reach the server) plays with the same
// balance, AI, ratings and card stats as the artifact.
//
// 1. Dump the database (Claude does this with ArtifactData list + out_dir, one call per collection):
//      balance, ai, aibrain, calibration, sync   ->  <db>/<collection>/<doc>.json
// 2. node tools/refresh-snapshot.mjs --db <db dir> [--html index.html]
//
// Prints a one-line summary per part. Only first-to-3 data goes in the snapshot (that's what players load).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, def) => { const k = args.indexOf('--' + name); return k >= 0 ? args[k + 1] : def; };
const DB = opt('db');
const HTML = path.resolve(opt('html', path.join(here, '..', 'index.html')));
if (!DB){ console.error('usage: node tools/refresh-snapshot.mjs --db <dump dir> [--html index.html]'); process.exit(1); }

// a dumped document: ArtifactData writes {id, data, version, ...} or the bare fields
const doc = (coll, id) => {
  const f = path.join(DB, coll, id + '.json');
  if (!fs.existsSync(f)) return null;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  return d && d.data && typeof d.data === 'object' ? d.data : d;
};

let html = fs.readFileSync(HTML, 'utf8');
const re = /(<script type="application\/json" id="snapshot">)([\s\S]*?)(<\/script>)/;
const m = html.match(re);
if (!m){ console.error('no snapshot block in ' + HTML); process.exit(1); }
const snap = JSON.parse(m[2]);
const done = [];

// balance: {ov, at, patches}; patches rebuilt from older saved versions if the doc predates them
const fin = doc('balance', 'final');
if (fin){
  let patches = fin.patches;
  if (!Array.isArray(patches)){
    const eng = html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
    const ctx = vm.createContext({ Math, console });
    vm.runInContext(eng + '\n;globalThis.__seed = seedPatches;', ctx);
    patches = ctx.__seed(fin);
  }
  snap.final = { ov: JSON.parse(fin.json || '{}'), at: fin.at, patches };
  done.push(`balance: pushed ${new Date(fin.at).toISOString()}, ${patches.length} patches`);
}

// AI: meta ai/brain says how many chunks (aibrain/c0..c{n-1}), all saved at the same time
const meta = doc('ai', 'brain');
if (meta){
  const parts = [];
  for (let k = 0; k < meta.n; k++){
    const c = doc('aibrain', 'c' + k);
    if (!c || c.at !== meta.at){ console.error(`aibrain/c${k} missing or from a different save; skipping the AI`); parts.length = 0; break; }
    parts.push(c.json);
  }
  if (parts.length){
    const b = JSON.parse(parts.join(''));
    b.at = meta.at;
    snap.brain = b;
    done.push(`AI: ${b.gens || 0} generations, ${b.games || 0} games, saved ${new Date(meta.at).toISOString()}`);
  }
}

// ratings ladder
const cal = doc('calibration', 'ladder');
if (cal){ snap.cal = JSON.parse(cal.json); done.push(`ratings: ${snap.cal.rungs ? snap.cal.rungs.length : 0} levels`); }

// card stats, pairs, front→behind, counters
const st = doc('sync', 'stats'), sm = doc('sync', 'meta');
if (st && sm){
  const s = JSON.parse(st.json);
  for (const [k, id] of [['__pairs', 'pairs'], ['__adj', 'adj'], ['__vs', 'vs']]){ const d = doc('sync', id); if (d) s[k] = JSON.parse(d.json); }
  snap.stats = s; snap.statsAt = +sm.at;
  done.push(`stats: ${s.__games || 0} games`);
}

if (!done.length){ console.error('nothing found under ' + DB); process.exit(1); }
const txt = JSON.stringify(snap).replace(/<\//g, '<\\/');
html = html.slice(0, m.index) + m[1] + txt + m[3] + html.slice(m.index + m[0].length);
fs.writeFileSync(HTML, html);
for (const l of done) console.log(l);
console.log(`snapshot ${(txt.length / 1024).toFixed(0)} KB written to ${HTML}`);
