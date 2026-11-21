// Delete dead CSS in place: rules whose every selector part names a class found in no JS string or HTML and that never
// matched in the recordings; dead parts of selector lists too. Empty @media blocks go as well.
const fs = require('fs'), path = require('path'), postcss = require('postcss');
const R = process.argv[2];
const { rules, matches } = require('./load.cjs')(__dirname + '/rules.json', ['/home/claude/work/p1/m-desk', '/home/claude/work/p1/m-phone']);
// reuse dead.cjs's string corpus by asking it per single-part pseudo-rule
const deadOf = require('./dead.cjs');
const partsDead = new Map();   // rule id -> Set(part index) dead
const probe = []; rules.forEach(r => { if (r.file.startsWith('index.html')) return; r.selector.split(/,(?![^(]*\))/).forEach((p, pi) => probe.push({ id: probe.length, file: r.file, selector: p, ctx: [], decls: [], rid: r.id, pi })); });
const pm = probe.map(p => { const m = matches[p.rid]; let hit = false; for (const parts of m.values()) if (parts.has(p.pi)) { hit = true; break; } return new Map(hit ? [['x', new Set([0])]] : []); });
for (const id of deadOf(R, probe, pm)){ const p = probe[id]; if (!partsDead.has(p.rid)) partsDead.set(p.rid, new Set()); partsDead.get(p.rid).add(p.pi); }
let removedRules = 0, removedParts = 0;
const byFile = new Map(); for (const r of rules) if (partsDead.has(r.id)){ if (!byFile.has(r.file)) byFile.set(r.file, []); byFile.get(r.file).push(r); }
for (const [f, list] of byFile){
  const root = postcss.parse(fs.readFileSync(path.join(R, f), 'utf8'), { from: f });
  const want = new Map(list.map(r => [r.line + '|' + r.selector, r]));
  root.walkRules(n => { if (n.parent && n.parent.type === 'atrule' && n.parent.name === 'keyframes') return;
    const r = want.get(n.source.start.line + '|' + n.selector); if (!r) return;
    const parts = n.selector.split(/,(?![^(]*\))/), dead = partsDead.get(r.id);
    if (dead.size === parts.length){ n.remove(); removedRules++; }
    else { n.selector = parts.filter((p, i) => !dead.has(i)).map((p, i) => i ? p.replace(/^\s*/, '') : p.trim()).join(','); removedParts += dead.size; } });
  root.walkAtRules('media', a => { if (!a.nodes || !a.nodes.some(x => x.type !== 'comment')) a.remove(); });
  fs.writeFileSync(path.join(R, f), root.toString());
}
console.log('removed rules', removedRules, 'removed selector parts', removedParts);
