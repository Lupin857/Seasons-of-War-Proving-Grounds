// One global order that keeps every constraint, grouping rules by component as much as possible (Kahn's algorithm,
// always taking the available rule with the earliest component, then the earliest original position).
const fs = require('fs');
const rules = require('./rules.json'), E = require('./edges.json'), dead = new Set(require('./dead.json'));
const { ORDER, bucketOf } = require('./buckets.cjs');
const order = process.argv[2] ? process.argv[2].split(',') : ORDER;
const live = rules.filter(r => !dead.has(r.id) && !r.file.startsWith('index.html'));
const comp = new Map(live.map(r => [r.id, order.indexOf(bucketOf(r))]));
// within one original rule list, rules with no constraint between them can swap; everything else keeps its order
const indeg = new Map(live.map(r => [r.id, 0])), succ = new Map();
for (const [a, c] of E){ if (!comp.has(a) || !comp.has(c)) continue; (succ.get(a) || succ.set(a, []).get(a)).push(c); indeg.set(c, indeg.get(c) + 1); }
const avail = live.filter(r => indeg.get(r.id) === 0).map(r => r.id);
const key = id => comp.get(id) * 1e5 + id;
const out = [];
while (avail.length){ let bi = 0; for (let i = 1; i < avail.length; i++) if (key(avail[i]) < key(avail[bi])) bi = i;
  const id = avail.splice(bi, 1)[0]; out.push(id); for (const c of succ.get(id) || []){ indeg.set(c, indeg.get(c) - 1); if (!indeg.get(c)) avail.push(c); } }
if (out.length !== live.length) throw new Error('cycle?');
// runs of one component
const runs = []; for (const id of out){ const c = comp.get(id); if (runs.length && runs[runs.length - 1].c === c) runs[runs.length - 1].n++; else runs.push({ c, n: 1 }); }
console.log('runs', runs.length); console.log(runs.map(r => order[r.c] + ':' + r.n).join(' '));
fs.writeFileSync('order4.json', JSON.stringify({ order, out }));
