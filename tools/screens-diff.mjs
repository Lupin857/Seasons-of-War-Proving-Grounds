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
console.log(worst < 0.5 ? 'SAME (within glow/pulse noise)' : 'DIFFERENT: look at the files above 0.5%');
