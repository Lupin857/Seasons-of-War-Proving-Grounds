const fs = require('fs'), zlib = require('zlib'), path = require('path');
const { rules, matches } = require('./load.cjs')('rules.json', ['/home/claude/work/p1/m-desk', '/home/claude/work/p1/m-phone']);
const R = '/home/claude/seasons-of-war-proving-grounds';
const dead = new Set(require('./dead.cjs')(R, rules, matches));
// class sets: captured elements + class="..." templates in the code; classes added with classList count as wildcards
const classSets = [], wildcard = new Set();
for (const d of ['/home/claude/work/p1/m-desk', '/home/claude/work/p1/m-phone']) for (const f of fs.readdirSync(d).filter(f => f.endsWith('.matches.json.gz'))){
  const x = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(d, f)))); for (const c of x.cls) if (c && c.trim()) classSets.push(new Set(c.trim().split(/\s+/))); }
const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
const js = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => !/vendor|cubes/.test(f)).map(f => fs.readFileSync(path.join(R, f), 'utf8')).join('\n') + html;
const vocab = new Set(); for (const r of rules) for (const m of r.selector.matchAll(/\.([\w-]+)/g)) vocab.add(m[1]);
// class attribute values (to the closing quote, skipping ${...}), and short plain strings like 'dslot on'
for (const m of js.matchAll(/class(?:Name)?\s*=\s*(\\?["'`])/g)){ const q = m[1].slice(-1); let i = m.index + m[0].length, depth = 0, out = '';
  while (i < js.length && out.length < 600){ const ch = js[i]; if (depth === 0 && ch === q) break; if (ch === '$' && js[i + 1] === '{'){ depth++; i += 2; out += ' '; continue; } if (ch === '}' && depth){ depth--; i++; out += ' '; continue; } out += ch; i++; }
  const w = (out.match(/[a-zA-Z][\w-]*/g) || []).filter(x => vocab.has(x)); if (w.length) classSets.push(new Set(w)); }
for (const m of js.matchAll(/'([^'\\\n<=]{1,60})'|"([^"\\\n<=]{1,60})"/g)){ const t = m[1] || m[2]; const w = (t.match(/[a-zA-Z][\w-]*/g) || []); if (w.length && w.length <= 4 && w.every(x => vocab.has(x))) classSets.push(new Set(w)); }
const tagsOf = new Map();
for (const d of ['/home/claude/work/p1/m-desk', '/home/claude/work/p1/m-phone']) for (const f of fs.readdirSync(d).filter(f => f.endsWith('.matches.json.gz'))){
  const x = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(d, f)))); x.keys.forEach((k, i) => { const tag = k.split('/').pop().replace(/\d+$/, ''); for (const c of (x.cls[i] || '').split(/\s+/)) if (c){ if (!tagsOf.has(c)) tagsOf.set(c, new Set()); tagsOf.get(c).add(tag); } }); }
for (const m of js.matchAll(/classList\.(?:add|toggle|replace)\(([^)]*)\)/g)) for (const t of (m[1].match(/['"`]([\w-]+)['"`]/g) || [])) wildcard.add(t.slice(1, -1));
console.log('class sets', classSets.length, 'wildcards', wildcard.size, [...wildcard].slice(0, 40).join(' '));
fs.writeFileSync("cls.json", JSON.stringify({sets: classSets.map(s => [...s]), wildcard: [...wildcard]}));
const t0 = Date.now(); const edges = require("./constraints.cjs")(rules, dead, classSets, process.env.NOWILD ? new Set() : wildcard, tagsOf);
console.log('edges', edges.length, 'in', Date.now() - t0, 'ms');
fs.writeFileSync('edges.json', JSON.stringify(edges)); fs.writeFileSync('dead.json', JSON.stringify([...dead]));
// sanity: every dynamic conflict (same target, same family, same importance, same spec, in captured states) must be an edge
