const fs = require('fs');
const { rules, matches } = require('./load.cjs')('rules.json', ['/home/claude/work/p1/m-desk', '/home/claude/work/p1/m-phone']);
const { calculate } = require('specificity'); const family = require('./constraints.cjs').family;
const dead = new Set(require('./dead.json')); const E = new Set(require('./edges.json').map(e => e.join('>')));
const spec = rules.map(r => r.selector.split(/,(?![^(]*\))/).map(p => { try { const c = calculate(p.trim()); const x = Array.isArray(c) ? c[0] : c; return [x.A, x.B, x.C].join('.'); } catch(e){ return '?'; } }));
// target -> list of [rule, spec]
const byT = new Map();
rules.forEach((r, i) => { for (const [t, parts] of matches[i]){ let best = null; for (const pi of parts){ const s = spec[i][pi]; if (best == null || s > best) best = s; } if (!byT.has(t)) byT.set(t, []); byT.get(t).push([i, best]); } });
let missing = 0, checked = 0; const ex = [];
for (const [t, list] of byT){
  const groups = new Map();
  for (const [i, s] of list) for (const d of rules[i].decls){ const k = family(d.prop) + (d.important ? '!' : '') + '|' + s; if (!groups.has(k)) groups.set(k, new Set()); groups.get(k).add(i); }
  for (const g of groups.values()){ const ids = [...g].sort((a, b) => a - b); for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++){ checked++;
    if (!E.has(ids[a] + '>' + ids[b])){ missing++; if (ex.length < 8) ex.push(`${rules[ids[a]].selector.slice(0, 50)}  <  ${rules[ids[b]].selector.slice(0, 50)}  (${t.split('|').slice(0, 2).join('|')})`); } } }
}
console.log('dynamic conflict pairs', checked, 'missing from static edges', missing); ex.forEach(x => console.log('  ' + x));
