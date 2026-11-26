/* ===================== BALANCE OVERRIDES ===================== */
// The sheet's numbers are kept in ORIG; overrides are applied on top so every change can be undone.
// Card text templates: {v} {x} {p} print a value ("2", or "1/2/3" if it changes by level); {$v} adds $ signs;
// {v|one|many} picks wording: "one" when the value is 1 at every level, otherwise "many" with # replaced by the value
// (a third part is used when the value is 0 at every level).
function fillText(tt, d){
  const fmt = (a, $) => { a = a || [0]; const s = $ ? '$' : ''; return a.every(x => x === a[0]) ? s + a[0] : a.map(x => s + x).join('/'); };
  return tt.replace(/\{(\$?)(lv|[vxp])(?:\|([^|}]*)\|([^|}]*)(?:\|([^|}]*))?)?\}/g, (m, $, k, one, few, zero) => {
    const a = d[k] || [0];
    if (one === undefined) return fmt(a, $);
    if (zero !== undefined && a.every(x => x === 0)) return zero;
    return (a.every(x => x === 1) ? one : few).replace('#', fmt(a, $));
  });
}
for (const n in DEFS) if (DEFS[n].tt) DEFS[n].t = fillText(DEFS[n].tt, DEFS[n]);
for (const n in BDEFS) if (BDEFS[n].tt) BDEFS[n].t = fillText(BDEFS[n].tt, BDEFS[n]);
const ORIG = JSON.parse(JSON.stringify({DEFS, BDEFS, RULES, MIRS}));
// SHEET never changes. ORIG is the baseline the lab edits against: the sheet plus the finalized balance.
const SHEET = JSON.parse(JSON.stringify(ORIG));
// a stored balance change only applies to numbers the card still has (Farmhand's old Mobilize money is dropped)
function ovKeep(o, sheet){ if (!o) return {}; const r = {}; for (const k in o) if (!sheet || k in sheet) r[k] = o[k]; return r; }
function applyOverrides(ov){
  ov = ov || {};
  const key = JSON.stringify(ov); if (key === OV_KEY) return; OV_KEY = key;
  for (const n in ORIG.DEFS){ for (const k of Object.keys(DEFS[n])) delete DEFS[n][k]; Object.assign(DEFS[n], JSON.parse(JSON.stringify(ORIG.DEFS[n])), ovKeep((ov.units || {})[n], SHEET.DEFS[n])); }
  for (const n in ORIG.BDEFS){ for (const k of Object.keys(BDEFS[n])) delete BDEFS[n][k]; Object.assign(BDEFS[n], JSON.parse(JSON.stringify(ORIG.BDEFS[n])), (ov.bldgs || {})[n] || {}); }
  Object.assign(RULES, ORIG.RULES, ov.rules || {});
  for (const n in ORIG.MIRS){ for (const k of Object.keys(MIRS[n])) delete MIRS[n][k]; Object.assign(MIRS[n], JSON.parse(JSON.stringify(ORIG.MIRS[n])), (ov.mirs || {})[n] || {}); mirRetext(n); }
  // rewrite card text so it shows the current numbers
  const swap = (t, from, to) => {
    if (!from || !to || JSON.stringify(from) === JSON.stringify(to)) return t;
    const a = from.join('/'), b = to.join('/'), a$ = '$' + from.join('/$'), b$ = '$' + to.join('/$');
    if (t.includes(a$)) return t.replace(a$, b$);
    return t.replace(a, b);
  };
  for (const n in ORIG.DEFS){ if (ORIG.DEFS[n].tt){ DEFS[n].t = fillText(ORIG.DEFS[n].tt, DEFS[n]); continue; } let t = ORIG.DEFS[n].t; t = swap(t, ORIG.DEFS[n].v, DEFS[n].v); t = swap(t, ORIG.DEFS[n].m, DEFS[n].m); DEFS[n].t = t; }
  for (const n in ORIG.BDEFS) BDEFS[n].t = ORIG.BDEFS[n].tt ? fillText(ORIG.BDEFS[n].tt, BDEFS[n]) : swap(ORIG.BDEFS[n].t, ORIG.BDEFS[n].lv, BDEFS[n].lv);
}
function describeOverrides(ov, base){
  base = base || ORIG;
  const out = [], f = a => Array.isArray(a) ? a.join('/') : a;
  const lbl = {c:'cost', n:'copies', p:'power', v:'ability', x:'ability 2', m:'money', lv:'levels'};
  for (const [grp, src] of [['units', base.DEFS], ['bldgs', base.BDEFS]]) for (const n in (ov[grp] || {})){
    if (!src[n]) continue;
    const ch = Object.entries(ov[grp][n]).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(src[n][k])).map(([k, v]) => `${lbl[k] || k} ${k === 'c' ? '$' + v : f(v)}`);
    if (ch.length) out.push(`${n}: ${ch.join(', ')}`);
  }
  for (const n in (ov.mirs || {})){
    const src = (base.MIRS || ORIG.MIRS)[n]; if (!src) continue;
    const ch = Object.entries(ov.mirs[n]).filter(([k, v]) => v !== src[k]).map(([k, v]) => k === 's' ? `surcharge +$${v}` : k === 'u' ? `unit-deck copies ${v}` : k === 'b' ? `building-deck copies ${v}` : `effect ${v}`);
    if (ch.length) out.push(`${n} (miracle): ${ch.join(', ')}`);
  }
  const rl = {target:'winning score', buysPerShop:'buys per shop', fieldsPerShop:'Fields per shop', citySlots:'city slots', deckCap:'deck size', baseIncome:'base income', unitDisplay:'unit display', bldgDisplay:'building display', maxRounds:'round limit', startFields:'starting Harvesters'};
  for (const k in (ov.rules || {})) if (ov.rules[k] !== base.RULES[k]) out.push(`${rl[k] || k}: ${ov.rules[k]}`);
  return out;
}
// Balance patches ---------------------------------------------------------
// One line per card (or rule) that differs between two override sets, both measured from the sheet:
// "Infirmary: cost $4 → $3". Values a set doesn't mention are the sheet's.
function patchDiff(a, b, base){
  base = base || SHEET; a = a || {}; b = b || {};
  const out = [], f = v => v === undefined || v === null ? '—' : Array.isArray(v) ? v.join('/') : String(v);
  const lbl = {c:'cost', n:'copies', p:'power', v:'ability', x:'ability 2', m:'money', lv:'levels'};
  const mlbl = {s:'surcharge', u:'unit-deck copies', b:'building-deck copies'};
  const keysOf = (g, n) => [...new Set(Object.keys(((a[g] || {})[n]) || {}).concat(Object.keys(((b[g] || {})[n]) || {})))];
  const namesOf = g => [...new Set(Object.keys(a[g] || {}).concat(Object.keys(b[g] || {})))].sort();
  for (const [g, src, kind] of [['units', base.DEFS, ''], ['bldgs', base.BDEFS, ''], ['mirs', base.MIRS, ' (miracle)']]){
    for (const n of namesOf(g)){
      if (!src[n]) continue;
      const ch = [];
      for (const k of keysOf(g, n)){
        const va = ((a[g] || {})[n] || {})[k] ?? src[n][k], vb = ((b[g] || {})[n] || {})[k] ?? src[n][k];
        if (JSON.stringify(va) === JSON.stringify(vb)) continue;
        const money = k === 'c' || (g === 'mirs' && k === 's');
        const fm = v => money && v !== undefined ? (g === 'mirs' ? '+$' : '$') + f(v) : f(v);
        ch.push(`${g === 'mirs' ? (mlbl[k] || 'effect') : (lbl[k] || k)} ${fm(va)} → ${fm(vb)}`);
      }
      if (ch.length) out.push(`${n}${kind}: ${ch.join(', ')}`);
    }
  }
  const rl = {target:'winning score', buysPerShop:'buys per shop', fieldsPerShop:'Fields per shop', citySlots:'city slots', deckCap:'deck size', baseIncome:'base income', unitDisplay:'unit display', bldgDisplay:'building display', maxRounds:'round limit', startFields:'starting Harvesters'};
  for (const k of [...new Set(Object.keys(a.rules || {}).concat(Object.keys(b.rules || {})))]){
    if (!(k in base.RULES)) continue;
    const va = (a.rules || {})[k] ?? base.RULES[k], vb = (b.rules || {})[k] ?? base.RULES[k];
    if (va !== vb) out.push(`Rules: ${rl[k] || k} ${va} → ${vb}`);
  }
  return out;
}
// A balance document saved before patches existed: rebuild its patches from the saved versions, oldest first,
// each measured against the one before it (the first against the sheet). Newest first, like doc.patches.
function seedPatches(d){
  if (!d) return [];
  if (Array.isArray(d.patches)) return d.patches;
  const vers = (Array.isArray(d.history) ? d.history.slice().reverse() : []).concat(d.json ? [{at:d.at, json:d.json}] : []);
  const out = []; let prev = {};
  for (const v of vers){
    let ov = {}; try{ ov = JSON.parse(v.json || '{}') || {}; }catch(e){ ov = {}; }
    const items = patchDiff(prev, ov);
    if (items.length) out.unshift({at:v.at, items, json:v.json});
    prev = ov;
  }
  return out;
}
// Lab tests --------------------------------------------------------------
// One side starts with a building already in its city; identical AIs otherwise.
function freeBuildingGames(b, lvl, n, depth){
  let w = 0;
  for (let k = 0; k < n; k++){
    const me = k % 2, g = newGame({genomes:[baseGenome(), baseGenome()]});
    if (isGear(b)) g.players[me].gear[b] = lvl;   // gear starts in hand (lvl copies)
    else g.players[me].city[b] = lvl;
    while (!g.over) autoRound(g, 8, depth);
    w += scoreFor(g.winner, me);
  }
  return w;
}
// One AI must buy the card every time it is offered and affordable (paying full price and using its buys);
// the other AI shops normally. Returns wins plus how often and how early the committed AI got the card.
function forcedCardGames(card, n, depth, once){
  let w = 0, got = 0, gw = 0, rsum = 0;
  for (let k = 0; k < n; k++){
    const me = k % 2, g = newGame({genomes:[baseGenome(), baseGenome()], miracles:MIRS[card] ? true : undefined, battleMir:isBat(card) ? true : undefined});
    g.players[me].force = card; g.players[me].forceOnce = !!once;
    let first = 0;
    while (!g.over){ autoRound(g, 8, depth); if (!first && (g.players[me].bought.includes(card) || (g.mirGot && g.mirGot[me].includes(card)))) first = g.round; }
    const r = scoreFor(g.winner, me);
    w += r; if (first){ got++; gw += r; rsum += first; }
  }
  return {w, got, gw, rsum};
}
// Same random deck and enemy, with unit A vs unit B in one random slot. Returns [winsA, winsB].
function slotBattles(a, b, lvl, n){
  const pool = Object.keys(DEFS).filter(x => !DEFS[x].token && x !== 'Jester' && DEFS[x].n > 0);
  const rnd = Math.random, deck = s => shuffle(pool.slice(), rnd).slice(0, s).map(x => ({name:x, copies:1 + (rnd() < 0.3 ? 1 : 0)}));
  let wa = 0, wb = 0;
  for (let k = 0; k < n; k++){
    const mine = deck(4), enemy = deck(5), at = Math.floor(rnd() * 5);
    const A = mine.slice(), B = mine.slice();
    A.splice(at, 0, {name:a, copies:lvl}); B.splice(at, 0, {name:b, copies:lvl});
    const ra = runBattle([{units:A}, {units:enemy}], false).result.w, rb = runBattle([{units:B}, {units:enemy}], false).result.w;
    wa += scoreFor(ra, 0); wb += scoreFor(rb, 0);
  }
  return [wa, wb];
}
