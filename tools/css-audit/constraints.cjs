// Ordering constraints between CSS rules: edge a -> b means rule a must stay before rule b, because some element could
// match both, they set the same property (family) with the same importance and equal specificity.
const fs = require('fs'), zlib = require('zlib'), path = require('path');
const { calculate } = require('specificity');
const SH = ['margin','padding','border-radius','border','background','font','grid','flex','transition','animation','outline','list-style','columns','text-decoration','mask','container','overscroll-behavior','scroll-margin','scroll-padding','place','overflow','gap','inset'];
function family(prop){
  if (prop.startsWith('--')) return prop;
  let p = prop.replace(/^-(webkit|moz|ms)-/, '');
  if (['top','right','bottom','left'].includes(p) || p.startsWith('inset')) return 'inset';
  if (['row-gap','column-gap','gap','grid-gap','grid-row-gap','grid-column-gap'].includes(p)) return 'gap';
  if (p === 'line-height') return 'font';
  if (/^(align|justify)-(items|content|self)$/.test(p)) return 'place';
  for (const s of SH) if (p === s || p.startsWith(s + '-')) return s;
  return p;
}
// width ranges of a rule's @media context ([lo, hi] px), and reduced-motion state
function ctxInfo(ctx){
  let lo = 0, hi = Infinity, rm = null, dark = null;
  for (const c of ctx){ if (!c.startsWith('@media')) continue; const q = c.slice(7);
    if (q.includes(',')) continue;   // "a, b": treat as unconstrained
    for (const m of q.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)){ if (m[1] === 'min') lo = Math.max(lo, +m[2]); else hi = Math.min(hi, +m[2]); }
    if (/prefers-reduced-motion:\s*reduce/.test(q)) rm = true; if (/prefers-reduced-motion:\s*no-preference/.test(q)) rm = false;
    if (/prefers-color-scheme:\s*dark/.test(q)) dark = true; }
  return { lo, hi, rm, dark };
}
const exclusive = (a, b) => a.hi < b.lo || b.hi < a.lo || (a.rm != null && b.rm != null && a.rm !== b.rm);
function rightmost(part){
  const s = part.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '').replace(/::?[\w-]+(\((?:[^()]|\([^()]*\))*\))?/g, m => /^::?(before|after)$/.test(m) ? m : '');
  const comp = s.trim().split(/\s*[\s>+~]\s*/).pop() || '';
  return { classes: [...comp.matchAll(/\.([\w-]+)/g)].map(m => m[1]), tag: (comp.match(/^[a-z][\w-]*/) || [null])[0], id: (comp.match(/#([\w-]+)/) || [null, null])[1] };
}
module.exports = function build(rules, dead, classSets, wildcard, tagsOf){
  const live = rules.filter(r => !dead.has(r.id));
  // co-occurrence: classes seen together on an element
  const co = new Map(); const add = (a, b) => { if (!co.has(a)) co.set(a, new Set()); co.get(a).add(b); };
  for (const set of classSets){ const cs = [...set]; for (const a of cs) for (const b of cs) add(a, b); }
  const coOk = (a, b) => a === b || wildcard.has(a) || wildcard.has(b) || !co.has(a) || !co.has(b) || co.get(a).has(b);
  const info = live.map(r => {
    const parts = r.selector.split(/,(?![^(]*\))/).map(p => { let sp; try { const c = calculate(p.trim()); const x = Array.isArray(c) ? c[0] : c; sp = [x.A, x.B, x.C].join('.'); } catch(e){ sp = '?'; }
      return { sp, pe: (p.match(/::?(before|after)\b/) || ['', ''])[1], ...rightmost(p) }; });
    const fam = new Map(); for (const d of r.decls){ const f = family(d.prop) + (d.important ? '!' : ''); fam.set(f, true); }
    return { r, parts, fam: new Set(fam.keys()), ctx: ctxInfo(r.ctx) };
  });
  const overlap = (p, q) => {
    if (p.pe !== q.pe) return false;
    if (p.sp !== q.sp && p.sp !== '?' && q.sp !== '?') return false;
    if (p.tag && q.tag && p.tag !== q.tag) return false;
    // a class only ever seen on certain tags can't match a selector that requires another tag (classes never seen with a
    // tag in the recordings stay open)
    const tagOk = (cls, tag) => !tag || wildcard.has(cls) || !tagsOf.has(cls) || tagsOf.get(cls).has(tag);
    for (const c of p.classes) if (!tagOk(c, q.tag)) return false;
    for (const c of q.classes) if (!tagOk(c, p.tag)) return false;
    if (p.id && q.id && p.id !== q.id) return false;
    for (const a of p.classes) for (const b of q.classes) if (!coOk(a, b)) return false;
    return true;
  };
  const edges = [];
  for (let i = 0; i < info.length; i++) for (let j = i + 1; j < info.length; j++){
    const A = info[i], B = info[j];
    let share = false; for (const f of A.fam) if (B.fam.has(f)){ share = true; break; }
    if (!share || exclusive(A.ctx, B.ctx)) continue;
    if (A.parts.some(p => B.parts.some(q => overlap(p, q)))) edges.push([A.r.id, B.r.id]);
  }
  return edges;
};
module.exports.family = family;
