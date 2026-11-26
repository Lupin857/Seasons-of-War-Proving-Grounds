// Shared by the tools: find the page's scripts in load order, whether inline or in their own files.
// Since the Nov 2026 split, index.html loads css/*.css and js/**/*.js by relative path; older copies had
// everything inline. Both layouts work here.
import fs from 'node:fs';
import path from 'node:path';

// [{ id, file, src, line }] for every <script> that holds code (JSON and cubes.js are skipped), in load order.
// file is the path relative to the page (null for inline code); line is where the tag sits in the page.
export function pageScripts(htmlPath, { vendor = true } = {}){
  const html = fs.readFileSync(htmlPath, 'utf8');
  const dir = path.dirname(htmlPath);
  const out = [];
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
    const attrs = m[1];
    if (/type="application\/json"/.test(attrs)) continue;
    const srcAttr = ((/\bsrc="([^"]+)"/.exec(attrs) || [])[1] || '').split('?')[0] || undefined;   // (a ?v= build stamp is not part of the file name)
    if (srcAttr && /(^|\/)cubes\.js$/.test(srcAttr)) continue;
    if (!vendor && srcAttr && /vendor\//.test(srcAttr)) continue;
    const line = html.slice(0, m.index).split('\n').length;
    const id = (/id="([^"]+)"/.exec(attrs) || [])[1] || srcAttr || `inline block at line ${line}`;
    const src = srcAttr ? fs.readFileSync(path.join(dir, srcAttr), 'utf8') : m[2];
    const engineModule = (/\bdata-engine-module="([^"]+)"/.exec(attrs) || [])[1] || null;
    out.push({ id, file: srcAttr || null, src, line, engineModule });
  }
  return out;
}

// The engine's source text (rules + AI, no DOM code).
export function engineSource(htmlPath){
  const blocks = pageScripts(htmlPath);
  const modules = blocks.filter(b => b.engineModule);
  if (modules.length) return modules.map(b => b.src).join('\n;\n');
  const s = blocks.find(b => b.id === 'engine');
  if (!s){ console.error(`No engine script found in ${htmlPath}`); process.exit(2); }
  return s.src;
}
