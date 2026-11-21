#!/usr/bin/env node
// Compares two folders of screenshots from tools/screens.mjs, file by file.
//   node tools/screens-diff.mjs <before dir> <after dir>
// Prints the share of pixels that differ visibly. Anything above ~0.5% is worth a look (open both images).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const sharp = createRequire(execSync('npm root -g').toString().trim() + '/')('sharp');
const [A, B] = process.argv.slice(2);
if (!A || !B){ console.log('usage: node tools/screens-diff.mjs <before dir> <after dir>'); process.exit(2); }
let worst = 0;
for (const f of fs.readdirSync(A).filter(f => f.endsWith('.png')).sort()){
  if (!fs.existsSync(path.join(B, f))){ console.log(`${f.padEnd(26)} missing in ${B}`); worst = 100; continue; }
  const [a, b] = await Promise.all([A, B].map(d => sharp(path.join(d, f)).raw().toBuffer({ resolveWithObject: true })));
  if (a.info.width !== b.info.width || a.info.height !== b.info.height){ console.log(`${f.padEnd(26)} different size`); worst = 100; continue; }
  let d = 0; const c = a.info.channels;
  for (let i = 0; i < a.data.length; i += c) if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]) > 24) d++;
  const pct = 100 * d / (a.info.width * a.info.height); worst = Math.max(worst, pct);
  console.log(`${f.padEnd(26)} ${pct.toFixed(3)}% pixels differ`);
}
for (const f of fs.readdirSync(B).filter(f => f.endsWith('.png'))) if (!fs.existsSync(path.join(A, f))) console.log(`${f.padEnd(26)} only in ${B}`);
// computed styles (from screens.mjs --styles): every element must have exactly the same computed style
const zlib = await import('node:zlib');
let styleFiles = 0, styleBad = 0;
for (const f of fs.readdirSync(A).filter(f => f.endsWith('.styles.json.gz')).sort()){
  if (!fs.existsSync(path.join(B, f))) continue;
  const [a, b] = [A, B].map(d => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(d, f)))));
  styleFiles++;
  const keys = new Set([...Object.keys(a.els), ...Object.keys(b.els)]);
  const diffs = [];
  for (const k of keys){
    const sa = a.table[a.els[k]], sb = b.table[b.els[k]];
    if (sa === sb) continue;
    if (sa == null || sb == null){ diffs.push(`${k}: only in ${sa == null ? B : A}`); continue; }
    const pa = Object.fromEntries(sa.split('\u0001').map(x => x.split('\u0002')));
    const pb = Object.fromEntries(sb.split('\u0001').map(x => x.split('\u0002')));
    const props = [...new Set([...Object.keys(pa), ...Object.keys(pb)])].filter(q => pa[q] !== pb[q]);
    diffs.push(`${k}: ${props.slice(0, 4).map(q => `${q} ${pa[q]} -> ${pb[q]}`).join('; ')}${props.length > 4 ? ` (+${props.length - 4})` : ''}`);
  }
  if (diffs.length){ styleBad++; worst = 100; console.log(`${f.padEnd(26)} ${diffs.length} elements styled differently, e.g.\n    ${diffs.slice(0, 6).join('\n    ')}`); }
}
if (styleFiles) console.log(`computed styles            ${styleBad ? styleBad + ' of ' + styleFiles + ' moments differ' : 'same in all ' + styleFiles + ' moments'}`);

// match records: the same seeded game must record the same events (ids and times aside)
const mr = d => { const f = path.join(d, 'match-record.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const clean = r => JSON.stringify(r, (k, v) => ['id', 'at', 'date', 'time', 'started', 'updated', 'ended', 'ms', 'build'].includes(k) ? undefined : v);
const ra = mr(A), rb = mr(B);
if (ra || rb){
  const same = ra && rb && clean(ra) === clean(rb);
  console.log(`match-record.json          ${same ? 'same' : 'DIFFERENT'} (${ra ? (ra.events || []).length : 0} vs ${rb ? (rb.events || []).length : 0} shop events, ${ra ? (ra.battles || []).length : 0} vs ${rb ? (rb.battles || []).length : 0} battles)`);
  if (!same) worst = 100;
}
console.log(worst < 0.5 ? 'SAME (within glow/pulse noise)' : 'DIFFERENT: look at the files above 0.5%');
