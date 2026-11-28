/* ===================== AI ===================== */
const ABIL = {
  'Pikeman':[1.5,2,2.5], 'Royal Watchman':[0.8,1.5,2.2], 'Monk':[1.8,2.6,3.2], 'Desperate Infantry':[1,2,3], 'Slinger':[0.9,1.8,2.7],
  'Dutiful Squire':[1,2,3], 'Veteran Knight':[0.8,1.6,2.4], 'Cowardly Squire':[1.2,1.5,1.8], 'Assassin':[0.8,0.8,0.8],
  'Marksman':[1.6,2.4,3.2], 'Studious Squire':[1.5,3,3], 'Aging Master':[1,2,2], 'Barber-Surgeon':[2,2.5,3],
  'Pigeon Hunter':[2.5,2.5,2.5], 'Brawler':[1.5,2,2.5], 'Fencer':[1.5,1.5,1.5], 'Sleepy Guard':[1.2,1.8,1.8], 'Musketeer':[1.6,3.2,6.4],
  'Dark Knight':[-0.6,-0.6,-0.6], 'Knight':[2.1,2.1,2.1], 'Jester':[2,2.5,3], 'Cannon':[2.7,4.5,6.3],
  'Grave-Robber':[1,1.5,2], 'Lancer':[1.5,2,2.5], 'White Knight':[2.5,2.5,4], 'Dowser Oracle':[1.5,3,4.5], 'Recruiter':[2,3,4],
  'Scholar':[3,5,5], 'Executioner':[3,3,3], 'Man-at-arms':[2.5,2.5,4], 'Halberd Knight':[3,4,5], 'Armored Knight':[2,2,3],
};
const ALL_CARDS = Object.keys(DEFS).concat(Object.keys(BDEFS));
const OPINION_KEYS = ALL_CARDS.concat(Object.keys(MIRS));   // cards and miracles the AI forms opinions about
function baseGenome(){ return {kp:0.15, shr:0.6, tie:0.12, rob:0.25, s:1, e:1, m:1, thresh:0, slot:0.7, pair:0.5, cath:0.5, read:0.4, deny:0.3, combo:1, save:0.3, hb:1, bmk:1, lu2:0.35, omk:1.5, mir:1, mu:0.06, mpat:0.5, bias:{}}; }
// How hard the AI thinks. 'play' is used against you; 'train' is a lighter version of the same reasoning for self-play.
const DEPTH = {
  fast:  {search:{evals:20, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:4, K:2, settle:0.03, drop:0.1, po:2}, guesses:3, top:1, stageA:3, perms:12, shopPerms:4, shopCands:2, shopGuesses:3, predictK:4},
  train: {search:{evals:40, ms:0, minDepth:2, maxDepth:2, width:5, inner:2, P:6, K:3, settle:0.02, drop:0.08, po:3}, guesses:5, top:2, stageA:5, perms:24, shopPerms:8, shopCands:3, shopGuesses:4, predictK:6, predictDeep:{guesses:3, top:1, stageA:3, perms:12, predictK:4}},
  play:  {search:{evals:700, ms:2500, minDepth:3, maxDepth:5, width:7, inner:3, P:10, K:4, settle:0.015, drop:0.08, po:8}, mix:6, guesses:12, top:3, stageA:12, perms:'all', shopPerms:16, shopCands:6, shopGuesses:8, predictK:16, predictDeep:{guesses:6, top:1, stageA:6, perms:24, predictK:8}},
  master:{search:{evals:4000, ms:8000, minDepth:4, maxDepth:7, width:9, inner:3, P:12, K:5, settle:0.01, drop:0.06, po:16}, mix:8, guesses:18, top:4, stageA:16, perms:'all', shopPerms:24, shopCands:8, shopGuesses:12, predictK:24, predictDeep:{guesses:8, top:2, stageA:8, perms:48, predictK:12}},
  // Ladder-only levels (weaker than 'fast'): short-sighted ones judge only this battle's stakes (no playouts) and blur
  // their estimates a little; the 'glimpse' level plays out once. t2 sits between training and 'play'.
  s1:    {search:{evals:12, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:2, K:1, settle:0.03, drop:0.12, po:0, myopic:true, blur:0.10}, guesses:2, top:1, stageA:2, perms:6, shopPerms:2, shopCands:1, shopGuesses:2, predictK:2},
  s2:    {search:{evals:16, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:3, K:2, settle:0.03, drop:0.1, po:0, myopic:true, blur:0.05}, guesses:3, top:1, stageA:3, perms:10, shopPerms:3, shopCands:2, shopGuesses:3, predictK:3},
  g1:    {search:{evals:16, ms:0, minDepth:1, maxDepth:1, width:99, inner:1, P:3, K:2, settle:0.03, drop:0.1, po:1, blur:0.02}, guesses:3, top:1, stageA:3, perms:12, shopPerms:4, shopCands:2, shopGuesses:3, predictK:4},
  t2:    {search:{evals:200, ms:1500, minDepth:2, maxDepth:3, width:7, inner:2, P:8, K:3, settle:0.015, drop:0.08, po:5}, mix:4, guesses:8, top:2, stageA:8, perms:48, shopPerms:12, shopCands:4, shopGuesses:6, predictK:10, predictDeep:{guesses:4, top:1, stageA:4, perms:16, predictK:6}},
};
/* ---------- Rated strength ladder ----------
   Each rung is a thinking budget (a DEPTH key): how far ahead it looks (this battle only, or the rest of the game
   played out), how many playouts and test battles it runs, and how far it looks ahead in the shop. Weaker rungs see
   less, so their mistakes are misjudged close calls and short-sightedness, never deliberately thrown choices. The two
   short-sighted rungs also blur their estimates a little. Rung 0 buys at random: it only anchors the ratings at 400
   and isn't offered as an opponent. A rating between two rungs plays with a budget part-way between them.
   The Novice rung is the one exception to "no thrown choices": it plays like a new player (see NOVICE below). */
const RUNGS = [
  {id:'random', label:'Random buyer', random:true},
  {id:'novice', label:'Novice',               novice:true, depth:'s1'},
  {id:'s1',   label:'Short-sighted, hasty', depth:'s1'},
  {id:'s2',   label:'Short-sighted',        depth:'s2'},
  {id:'g1',   label:'Glimpses ahead',       depth:'g1'},
  {id:'f100', label:'Quick',                depth:'fast'},
  {id:'t100', label:'Thinks',               depth:'train'},
  {id:'t2',   label:'Thinks harder',        depth:'t2'},
  {id:'p100', label:'Thinks deeply',        depth:'play'},
  {id:'m100', label:'Thinks deepest',       depth:'master'},
];
const AI_DIFFICULTY_RUNGS = ['novice', 'f100', 't100', 'p100', 'm100'];
// a budget part-way between two levels: counts are interpolated and rounded, blur and time limits are interpolated
function blendDepth(A, B, t){
  if (!A || !B) return A || B;
  if (t <= 0) return A; if (t >= 1) return B;
  const lerp = (x, y) => x + (y - x) * t;
  const mix = (x, y) => {
    const o = {};
    for (const k of new Set(Object.keys(x).concat(Object.keys(y)))){
      const u = x[k], v = y[k];
      if (k === 'ms' && (!u || !v)) o[k] = u || v;   // 0 means no time limit: keep the other level's limit
      else if (typeof u === 'number' && typeof v === 'number') o[k] = Number.isInteger(u) && Number.isInteger(v) ? Math.round(lerp(u, v)) : lerp(u, v);
      else if (u && v && typeof u === 'object') o[k] = mix(u, v);
      else o[k] = t < 0.5 ? (u ?? v) : (v ?? u);
    }
    return o;
  };
  const S = mix({blur:0, po:0, ...A.search}, {blur:0, po:0, ...B.search});
  S.myopic = !(S.po > 0); if (!S.myopic) delete S.myopic;
  if (!(S.blur > 0.001)) delete S.blur;
  return {...mix(A, B), search:S};
}
function rungFor(g, i){
  const s = g.players[i].skill; if (!s) return null;
  if (!s.hi || !(s.t > 0)) return s.lo;
  if (s.lo.random || s.hi.random) return g.rnd() < s.t ? s.hi : s.lo;   // never offered, but keep it well defined
  if (s.lo.novice || s.hi.novice) return g.rnd() < s.t ? s.hi : s.lo;   // between Novice and the next rung: each decision is one or the other
  return {id:s.lo.id + '>' + s.hi.id, label:`between ${s.lo.label} and ${s.hi.label}`, cfg:blendDepth(DEPTH[s.lo.depth], DEPTH[s.hi.depth], s.t)};
}
const rungDepth = r => r.cfg || DEPTH[r.depth] || null;
// pick among options ranked best-first: k-th best with weight (1 - sharp)^k
function sharpPick(list, sharp, rnd){
  if (!list.length || sharp >= 1) return list[0];
  const q = 1 - sharp, w = list.map((_, k) => Math.pow(q, k)), tot = w.reduce((a, b) => a + b, 0);
  let r = rnd() * tot; for (let k = 0; k < list.length; k++){ r -= w[k]; if (r <= 0) return list[k]; }
  return list[list.length - 1];
}
function abilScale(n, L){ const v = DEFS[n].v, o = ORIG.DEFS[n] && ORIG.DEFS[n].v; if (!v || !o) return 1; const a = v[Math.min(L, v.length)-1], b = o[Math.min(L, o.length)-1]; return b ? a / b : 1; }
function strengthU(n, L){ if (L <= 0) return 0; const d = DEFS[n]; const a = ABIL[n]; return d.p[Math.min(L, d.p.length)-1] + (a ? a[Math.min(L, a.length)-1] * abilScale(n, L) : 0); }
// How many more shops this game is likely to have after the current one, from my side's view.
// Each future battle I win with chance q (my army vs theirs); the game ends as soon as someone reaches the target while ahead.
// At 0-0 in a first-to-3 game that's at least 2 more shops (if one side sweeps), more if it's close;
// it shrinks as either side nears the target, and shrinks faster when one army is clearly stronger.
function expShops(g, i){
  if (g.raid) return Math.min(RULES.maxRounds - g.round, Math.max(0, roundsLeft(g) - 1));
  if (g._po){ const m = g._esPo || (g._esPo = {}); if (m[i] == null){ g._po = false; try{ m[i] = expShops(g, i); } finally { g._po = true; } } return m[i]; }
  const T = g.target, a0 = total(g.players[i]), b0 = total(g.players[1-i]), cap = Math.max(0, RULES.maxRounds - g.round);
  const q0 = Math.round(battleOdds(g, i) * 50) / 50, G = g.players[i].genome || {};
  // this round's battle is fought with today's armies; after that the other side rebuilds, so later battles lean back toward even
  const qf = 0.5 + 0.35 * (q0 - 0.5);
  const key = `${i}|${g.round}|${a0}|${b0}|${q0}|${qf}|${T}`;
  if (g._es && g._es.key === key) return g._es.v;
  const memo = new Map();
  const over = (a, b) => Math.max(a, b) >= T && a !== b;
  const f = (a, b, d) => {
    if (d >= cap) return 0;
    const k = a * 1000 + b * 10 + d; if (memo.has(k)) return memo.get(k);
    const q = d === 0 ? q0 : qf;
    const v = q * (over(a + 1, b) ? 0 : 1 + f(a + 1, b, d + 1)) + (1 - q) * (over(a, b + 1) ? 0 : 1 + f(a, b + 1, d + 1));
    memo.set(k, v); return v;
  };
  const v = f(a0, b0, 0);
  g._es = {key, v}; return v;
}
// Black Market: what a peek at k unit cards is worth in one shop, measured against the best unit I could
// otherwise buy (the display, a Recruit, or nothing). A card in the peek counts at the discount for that level
// ($1/$2/$3 off, so cheap cards can be free);
// second and third copies of units I own score high because they level them up. Averaged over random peeks
// from the cards still in the unit deck.
// kind 'b' does the same for a peek at the building deck, against the building display and a Field.
function bmPeekGain(g, i, k, kind){
  if (!k) return 0;
  const U = kind !== 'b';
  const p = g.players[i], G = p.genome || baseGenome(), deck = (U ? g.uDeck : g.bDeck).filter(n => !isMir(n));
  if (!deck.length) return 0;
  const key = g._po ? `${U ? 'u' : 'b'}|${i}|${g.round}|${k}`
    : `${U ? 'u' : 'b'}|${i}|${g.round}|${g.turnIdx}|${k}|${deck.length}|${p.money}|${JSON.stringify(U ? p.hand : p.city)}`;
  g._bmg = g._bmg || {}; if (g._bmg[key] != null) return g._bmg[key];
  // valuing a building peek values Black Market itself, which would peek again: count nested peeks as nothing
  if (g._bmIn) return 0;
  g._bmIn = true;
  try{ return (g._bmg[key] = bmPeekCalc(g, i, k, U, p, G, deck)); } finally { g._bmIn = false; }
}
function bmPeekCalc(g, i, k, U, p, G, deck){
  // a typical shop's spending money and buys of this kind
  const budget = Math.max(p.money, Math.max(0, income(p))), buys = buyCap(p);
  const Dk = U ? DEFS : BDEFS, free = U ? 'Recruit' : 'Field';
  const blocked = n => !!cantAcquire(p, n, U ? 'u' : 'b');
  const opt = (n, price) => blocked(n) || price > budget ? null
    : {n, price, v:aiValue(g, i, n, U ? 'u' : 'b') - price * G.m};
  const disp = [opt(free, Dk[free].c), ...(U ? g.disp.u : g.disp.b).map(c => opt(c.name, Dk[c.name].c))].filter(o => o && o.v > 0);
  const off = Math.max(1, BDEFS['Black Market'].lv.indexOf(k) + 1);
  const peekOpt = new Map(); for (const n of new Set(deck)) peekOpt.set(n, opt(n, Math.max(0, Dk[n].c - off)));
  // best total value of up to `buys` different cards within the budget (at most one from the peek)
  const bestSet = (list, extra) => {
    let best = 0;
    const all = extra ? list.concat(extra) : list;
    for (let a = 0; a < all.length; a++){
      if (all[a].price <= budget) best = Math.max(best, all[a].v);
      if (buys < 2) continue;
      for (let b = a + 1; b < all.length; b++){
        const A = all[a], B = all[b];
        if (A.n === B.n && A.n !== free) continue;
        if (A.price + B.price <= budget) best = Math.max(best, A.v + B.v);
      }
    }
    return best;
  };
  const base = bestSet(disp);
  const S = g._po ? 12 : 120, take = Math.min(k, deck.length), idx = deck.map((_, j) => j); let tot = 0;
  for (let t = 0; t < S; t++){
    const peek = [];
    for (let j = 0; j < take; j++){   // a random k-card peek
      const r = j + Math.floor((g.rnd || Math.random)() * (idx.length - j)); const x = idx[j]; idx[j] = idx[r]; idx[r] = x;
      const o = peekOpt.get(deck[idx[j]]); if (o && o.v > 0) peek.push(o);
    }
    let best = base;
    for (const o of peek) best = Math.max(best, bestSet(disp, [o]));
    tot += best - base;
  }
  return tot / S;
}
// Mercenary in the quick formula: chance of winning the game it adds through this round's battle alone.
// Battle odds come from army power (as battleOdds), the stakes from the game-win math the search uses.
const MERC_K = 20;
function mercSwing(g, i, G, held, gain){
  const a = armyPower(g.players[i]) + held, b = armyPower(g.players[1 - i]);
  const od = x => x + b <= 0 ? 0.5 : Math.max(0.1, Math.min(0.9, x * x / (x * x + b * b)));
  const q0 = od(a), dq = od(a + gain) - q0;
  if (dq <= 0) return 0;
  const V = roundValues(g, i, G, logit(q0), logit(battleOdds(g, i)));
  return dq * Math.max(0, V.w - V.l);
}
function roundsLeft(g){
  if (g.raid) return Math.max(1, Math.min(6, Math.min(...g.players.map(p => p.health)) / 2));
  const lead = Math.max(total(g.players[0]), total(g.players[1])); return Math.max(1, Math.min(6, (g.target - lead) * 1.6 + 0.5)); }

function aiValue(g, i, name, kind){
  const p = g.players[i], G = p.genome || baseGenome(), rL = roundsLeft(g), rf = Math.min(rL, 4)/2 + 0.5, bias = (G.bias[name] || 0) ;
  // rE: how many future shops an income or discount card is likely to pay out in
  // (older saved AIs kept a separate income-horizon weight hk; it only ever multiplied e and hb, so it now lives inside them)
  const rE = expShops(g, i) * (G.hk ?? 1);
  if (kind === 'u'){
    if (name === 'Recruit') return G.s * 0.6 * (1 + 0.8 * bVal(p, 'Muster Hall')) + bias;   // a trained Recruit hits harder
    const c = p.hand[name] || 0, L = Math.min(c + 1, uMax(name));
    let gain = strengthU(name, L) - strengthU(name, c);
    // Mercenary fights one battle and is discarded: it's worth what it adds to this battle's chances, times what
    // this battle's point is worth at the current score (little at 0-0, everything at match point)
    if (name === 'Mercenary') return G.s * MERC_K * mercSwing(g, i, G, strengthU(name, c), gain) + bias;
    if (c === 0){
      const cap = deckCap(p);
      if (uniqueUnits(p) >= cap){
        let weak = Infinity; for (const n in p.hand) if (!exemptUnit(n)) weak = Math.min(weak, strengthU(n, uLvl(n, p.hand[n])));
        gain -= G.slot * weak;
      }
    } else gain += G.pair;
    let v = G.s * gain * rf;
    // combos: a new unit is worth more when it pairs well with something already owned
    if (c === 0) v += G.s * (G.combo ?? 1) * 8 * comboBonus(p, name) * rf;
    // level-ups: the pairing already counted when the first copy came in; a stronger copy makes it pay off more,
    // in proportion to how much stronger the unit gets
    else if (G.lu2 !== 0){ const s0 = strengthU(name, c), up = strengthU(name, L) - s0; if (s0 > 0 && up > 0) v += G.s * (G.combo ?? 1) * 8 * comboBonus(p, name) * rf * Math.min(1, up / s0) * (G.lu2 ?? 0.35); }
    // Hired Blade's drawback has its own weight, so learning to ignore it can't drag down how much the AI values income
    if (name === 'Hired Blade') v -= (G.hb ?? 0.5) * rE * (hiredBladeCost(c + 1) - hiredBladeCost(c));
    const d = DEFS[name];
    // Conscripted Farmhand: income like a Windmill, but only once I own a Field (likely soon if I don't yet)
    if (name === 'Conscripted Farmhand' && d.v){ const inc = d.v[Math.min(L, d.v.length)-1] - (c ? d.v[Math.min(c, d.v.length)-1] : 0); v += G.e * rE * inc * ((p.city.Field || 0) > 0 ? 1 : 0.6); }
    if (d.m){
      const inc = d.m[L-1] - (c ? d.m[Math.min(c, 3)-1] : 0);
      v += G.e * 0.8 * rE * inc * (name === 'Arsonist' ? (g.players[1-i].city.Field || 0) : 1);
    }
    return v + bias;
  }
  if (name === "Mason's Guild"){ const t = aiMasonTarget(g, i); return t ? aiValue(g, i, t, 'b') + bias : -99; }
  // gear: worth about this much power on one unit, and little once every unit already has a piece
  if (isGear(name)){
    const units = Object.keys(p.hand).filter(n => p.hand[n] > 0 && !exemptUnit(n)).length, held = gearList(p).length;
    const room = Math.min(units, deckCap(p)) - held;
    return G.s * rf * (GEAR_VAL[name] || 1) * (room > 0 ? 1 : 0.15) + bias;
  }
  const c = p.city[name] || 0, lv = BDEFS[name].lv;
  if (name !== 'Field' && c >= lv.length) return -99;
  const nl = Math.min(c + 1, lv.length);
  const inc = lv[nl-1] - (c ? lv[Math.min(c, lv.length)-1] : 0);
  let v = 0;
  switch (name){
    case 'Field': v = G.e * rE; break;
    case 'Windmill': v = G.e * rE * inc; break;
    case 'Smithy': v = G.s * rf * 1.0 * inc; break;
    case 'Barracks': v = G.s * rf * 0.7 * inc; break;
    case 'Study': v = G.s * rf * 1.6 * inc; break;
    case 'Armory': v = G.s * rf * 2.5 * inc; break;
    case 'Training Yard': v = G.s * rf * (2.5 * inc + (c ? 0 : 1.0)); break;   // the Armament comes with the first level only
    case 'Trebuchet': v = G.s * rf * 0.8 * inc; break;
    case 'Reserve Encampment': v = G.s * rf * (uniqueUnits(p) > deckCap(p) ? 3 : 0.4) * inc; break;
    case 'Infirmary': v = G.s * rf * 2.5; break;
    case 'Muster Hall': { const n = (p.hand.Recruit || 0) + bVal(p, 'Barracks') + (p.hand.Recruiter ? 2 : 0) + (p.hand['Cowardly Squire'] ? 1 : 0) + 1; v = G.s * rf * 0.5 * inc * Math.max(0.5, n) + (c ? 0 : G.e * rE * 0.5); break; }   // trained Recruits, plus $1 saved on each Recruit from the first level
    case 'Black Market': {
      // what the bigger peek finds (at whichever deck is better to look at), over this shop (if I still have a buy) and the shops likely left
      if (!(G.bmk ?? 1)){ v = 0; break; }   // training set this weight to 0: skip the simulated peeks it would multiply
      const lv = BDEFS['Black Market'].lv, b = g.buys && g.buys[i];
      const shops = (b && baseLeft(b) > 0 ? 1 : 0) + expShops(g, i);
      const peek = n => n ? Math.max(bmPeekGain(g, i, n, 'u'), bmPeekGain(g, i, n, 'b')) : 0;
      v = (G.bmk ?? 1) * shops * (peek(lv[nl-1]) - (c ? peek(lv[Math.min(c, lv.length)-1]) : 0));
      break;
    }
    case "Carpenter's Guild": { const spare = Math.max(0, (Math.max(0, income(p)) - 3) / 2); v = G.e * rE * (0.8 * Math.min(inc, spare) + (c === 0 ? 0.8 : 0)); break; }   // extra building buys need spare money; $1 off buildings from the first level   // extra building buys, plus $1 off buildings from the first level
    case 'Cathedral': v = G.cath * 20 * cathedralGain(g, i); break;
    // Chapel: money saved a shop: about how many cards with miracles under them I buy a shop (the share of shop cards that carry them)
    case 'Chapel': { const all = g.uDeck.concat(g.bDeck), m = g.miracles ? all.filter(isMir).length : 0, n = all.length - m; v = G.e * rE * inc * (n ? Math.min(1.5, buyCap(p) * 0.5 * m / n) : 0); break; }
    // War College: money saved a shop on discard-pile copies of my cards (more likely the more of them are already there)
    // War College: free duplicates of my units from the discard pile (more likely the more of them are already there)
    case 'War College': { const sal = (g.muster || []).filter(x => ownsCard(p, x) > 0 && !cantAcquire(p, x, cardKind(x))).length; v = G.s * rf * Math.min(3, 0.6 + 1.2 * sal); break; }
    // The Bazaar: $1 more per card sold (the AI sells now and then)
    case 'The Bazaar': v = G.e * rE * 0.3 * (BDEFS['The Bazaar'].lv[0] || 0); break;
    // Altar of Blood: $4 a shop, less a copy of my priciest unit every shop
    case 'Altar of Blood': { const o = altarOpts({...p, city:{...p.city, 'Altar of Blood':1}}); const loss = o.length ? strengthU(o[0], uLvl(o[0], p.hand[o[0]])) - strengthU(o[0], uLvl(o[0], p.hand[o[0]] - 1)) : 0; v = G.e * rE * (BDEFS['Altar of Blood'].lv[0] || 0) - G.s * rf * Math.max(0.5, loss) * Math.min(rE, 3); break; }
  }
  return v + bias;
}
// Cathedral: how much owning it would raise my chance of winning the game, given the score and how my army
// compares with theirs. Its point only counts once I win a battle, so it's worth most when I'm close and favored.
function armyPower(p){
  const s = Object.keys(p.hand).filter(n => n !== 'Recruit' && !exemptUnit(n)).map(n => strengthU(n, uLvl(n, p.hand[n]))).sort((a, b) => b - a);
  return s.slice(0, deckCap(p)).reduce((a, b) => a + b, 0) + recAllow(p) + mirHeld(p, 'arm');
}
function battleOdds(g, i){
  const a = armyPower(g.players[i]), b = armyPower(g.players[1-i]);
  if (a + b <= 0) return 0.5;
  return Math.max(0.1, Math.min(0.9, a * a / (a * a + b * b)));
}
function gameWinChance(a, b, cath, q, T){
  // a = my battle points, b = their total; I win each battle with chance q; a Cathedral adds 1 but I must win a battle to finish
  const memo = new Map();
  const f = (a, b, wonLast, depth) => {
    const ta = a + (cath ? 1 : 0), tb = b;
    if (Math.max(ta, tb) >= T && ta !== tb){
      if (ta > tb){ if (!cath || wonLast) return 1; }
      else return 0;
    }
    if (depth >= 12) return 0.5;
    const k = a + ',' + b + ',' + wonLast + ',' + depth;
    if (memo.has(k)) return memo.get(k);
    const r = q * f(a + 1, b, true, depth + 1) + (1 - q) * f(a, b + 1, false, depth + 1);
    memo.set(k, r); return r;
  };
  return f(a, b, false, 0);
}
function cathedralGain(g, i){
  const p = g.players[i], o = g.players[1-i];
  if (o.city.Cathedral) return 0;
  const q = battleOdds(g, i), T = g.target, b = total(o);
  return Math.max(0, gameWinChance(p.score, b, true, q, T) - gameWinChance(p.score, b, false, q, T));
}
// What the miracles under a card are worth to player i, on the same scale as aiValue minus price.
// Money back cancels price; Recruits and Armaments are valued like a bought Recruit each, a Training token like two;
// Discard Writ by the display units it would move plus the extra turn; Divine Favor like a
// spare extra buy; Vision like a 3-card Black Market peek. G.mir scales the lot (learned in training; 1 = neutral).
function mirValue(g, i, list, G, mE, pair, kind){
  let v = 0;
  // Covenant: each card on top is worth what it's worth to me, less its price (the price is already in the quote)
  for (const n of pair || []) v += aiValue(g, i, n, kind || cardKind(n)) - ((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c * G.m * (mE ?? 1);
  if (!list || !list.length) return v;
  for (const n of list){
    const m = MIRS[n];
    if (m.cash) v += m.cash * G.m * mE;
    if (m.disc) v += m.disc * G.m * mE * 0.9;   // like money back, a little less: it needs a next buy that costs that much
    if (m.rec) v += m.rec * G.s * 0.6;
    if (m.arm) v += m.arm * G.s * 0.6;
    if (m.tr) v += m.tr * G.s * 1.0;   // a level is worth about two Armaments
    if (m.writ) v += writPick(g, i, null).reduce((s, x) => s + x.v, 0) * 0.5 + 0.8 * G.m * Math.max(0.5, mE);   // + shopping again before the opponent
    if (m.fav) v += m.fav * 1.2 * G.m * Math.max(0.5, mE);
    if (m.vis && !g._po) v += Math.max(bmPeekGain(g, i, m.vis, 'u'), bmPeekGain(g, i, m.vis, 'b'));
    // Restock: one more card to choose from, measured like a one-card Black Market peek (the opponent sees it too)
    if (m.rst && !g._po) v += 0.5 * m.rst * Math.max(0, bmPeekGain(g, i, 1, kind || 'u'));
    // Freeze: a held card to set aside later, worth a little like a spare buy; Mill only shapes what's left (learned opinion)
    if (m.frz) v += 0.4 * G.m * Math.max(0.5, mE);
    // Upheaval: a fresh display when this one has nothing for me, worth a little like a spare buy
    if (m.rdl) v += 0.5 * G.m * Math.max(0.5, mE);
    // battle miracles: a rough worth in Armaments, until the learned opinion of each one takes over
    if (m.bat && g.battleMir) v += (m.bv || 1) * G.s * 0.6;
  }
  let op = 0; for (const n of list) op += (G.bias && G.bias[n]) || 0;   // learned opinion of each miracle
  return v * (G.mir ?? 1) + op;
}
const GEAR_VAL = {'Poison Oil':3, 'Lance':2.5, 'Heirloom Blade':2.4, 'Zweihander':1.8, 'War Banner':1.8, 'Battle Axe':1.4, 'Healing Balm':1.2, 'War Horn':1.5, 'War Drums':1.4};
function aiMasonTarget(g, i){
  const ts = masonTargets(g.players[i]); let best = null, bv = -Infinity;
  for (const t of ts){ const v = aiValue(g, i, t, 'b'); if (v > bv){ bv = v; best = t; } }
  return best;
}
function aiShopOptions(g, i){
  const opts = [];
  g.disp.u.forEach((c, idx) => opts.push({src:'du', idx, name:c.name, kind:'u'}));
  g.disp.b.forEach((c, idx) => opts.push({src:'db', idx, name:c.name, kind:'b'}));
  opts.push({src:'field', name:'Field', kind:'b'}, {src:'recruit', name:'Recruit', kind:'u'});
  const pbm = peekOf(g, i, 'bm'); if (pbm) pbm.cards.forEach((n, idx) => opts.push({src:'bm', idx, name:n, kind:pbm.k}));
  const me = g.players[i];
  (g.muster || []).forEach((n, idx) => { if (ownsCard(me, n) > 0 && !opts.some(o => o.src === 'mu' && o.name === n)) opts.push({src:'mu', idx, name:n, kind:cardKind(n)}); });
  const pvis = peekOf(g, i, 'vis'); if (pvis) pvis.cards.forEach((n, idx) => opts.push({src:'vis', idx, name:n, kind:pvis.k}));
  if (g.frozen && g.frozen[i]) g.frozen[i].forEach((c, idx) => opts.push({src:'fz', idx, who:i, name:c.name, kind:c.kind}));
  return opts;
}
const BATTLE_BLDGS = new Set(['Smithy','Barracks','Study','Armory','Training Yard','Trebuchet','Infirmary','Reserve Encampment','Muster Hall']);
for (const n in BDEFS) if (BDEFS[n].gear) BATTLE_BLDGS.add(n);   // gear is judged by test battles, like the battle buildings
/* ---------- Gear for the AI ----------
   gearList: the gear in a player's hand, best first. placeGear: a quick, sensible spot for each piece in a lined-up
   deck (used by every order the search tries, and by the imagined players). tuneGear then improves the real choice
   with test battles against the AI's guesses at the enemy deck. */
const GEAR_RANK = ['Poison Oil','Lance','Heirloom Blade','Zweihander','War Banner','Battle Axe','Healing Balm','War Horn','War Drums'];
const DRUM_FIT = new Set(['Slinger','Dutiful Squire','Musketeer','Cannon','Dowser Oracle','Scholar','Jester','Halberd Knight','Dark Knight']);   // units with a Reveal ability
const DRUM_CHARGE = new Set(['Knight','Dark Knight','Scholar','Man-at-arms','Recruiter']);   // units with a Charge ability
function gearList(p){ const out = []; const gh = (p && p.gear) || {}; for (const n of GEAR_RANK) for (let k = 0; k < (gh[n] || 0); k++) out.push(n); for (const n in gh) if (!GEAR_RANK.includes(n)) for (let k = 0; k < gh[n]; k++) out.push(n); return out; }
const unitStr = u => u.name === 'Recruit' ? Math.min(1 + (u.tr || 0), 3) + (u.arm || 0) : strengthU(u.name, armyLvl(u)) + (u.arm || 0);
function placeGear(full, gear){
  if (!gear || !gear.length || !full.length) return full;
  const free = () => full.filter(u => !u.gear);
  const strongest = list => list.reduce((b, u) => !b || unitStr(u) > unitStr(b) ? u : b, null);
  for (const n of gear){
    let t = null;
    if (n === 'War Banner'){ let bv = -1; full.forEach((u, k) => { if (k > 0 && !u.gear && unitStr(full[k-1]) > bv){ bv = unitStr(full[k-1]); t = u; } }); }
    else if (n === 'Zweihander') t = strongest(free().filter(u => !u.arm && !u.sh));
    // War Drums: right behind a unit with a Charge ability. War Horn: right in front of a unit with a Reveal ability.
    else if (n === 'War Drums'){ full.forEach((u, k) => { if (!t && k > 0 && !u.gear && DRUM_CHARGE.has(full[k-1].name)) t = u; }); if (!t) t = strongest(free()); }
    else if (n === 'War Horn'){ full.forEach((u, k) => { if (!t && k + 1 < full.length && !u.gear && DRUM_FIT.has(full[k+1].name)) t = u; }); if (!t) t = strongest(free()); }
    else t = strongest(free().filter(u => u.name !== 'Recruit')) || strongest(free());
    if (t) t.gear = n;
  }
  return full;
}
// Improve where the gear goes with test battles: move one piece at a time to the spot (or off) that scores best
function tuneGear(g, i, deck){
  const p = g.players[i], have = gearList(p);
  if (!deck || !deck.length || !have.length) return deck;
  const guesses = oppGuessSet(g, i, 6).filter(d => d.length); if (!guesses.length) return deck;
  const myCfg = battleCfgOf(p), oppCfg = battleCfgOf(g.players[1-i]);
  const units = deck.filter(u => !isBat(u.name)).map(u => ({...u}));
  const sc = d => scoreDeck(d, i, myCfg, oppCfg, guesses);
  // pieces: what's equipped plus what's left in hand
  const used = {}; for (const u of units) if (u.gear) used[u.gear] = (used[u.gear] || 0) + 1;
  const spare = []; for (const n of have){ if (used[n] > 0) used[n]--; else spare.push(n); }
  let best = sc(units);
  for (let pass = 0; pass < 2; pass++){
    let moved = false;
    const pieces = units.map((u, k) => u.gear ? {n:u.gear, at:k} : null).filter(Boolean).concat(spare.map(n => ({n, at:-1})));
    for (const pc of pieces){
      for (let k = -1; k < units.length; k++){
        if (k === pc.at || (k >= 0 && units[k].gear) || (k >= 0 && pc.n === 'Zweihander' && (units[k].arm || units[k].sh))) continue;
        if (pc.at >= 0) units[pc.at].gear = null; if (k >= 0) units[k].gear = pc.n;
        const s = sc(units);
        if (s > best + 1e-9){ best = s; if (pc.at < 0) spare.splice(spare.indexOf(pc.n), 1); else if (k < 0) spare.push(pc.n); pc.at = k; moved = true; }
        else { if (k >= 0) units[k].gear = null; if (pc.at >= 0) units[pc.at].gear = pc.n; }
      }
    }
    if (!moved) break;
  }
  // put the battle miracles back where they were
  let k = 0; return deck.map(u => isBat(u.name) ? u : units[k++]);
}
function permutations(a){
  if (a.length <= 1) return [a.slice()];
  const out = [];
  a.forEach((x, k) => { for (const r of permutations(a.slice(0,k).concat(a.slice(k+1)))) out.push([x].concat(r)); });
  return out;
}
function buildArmy(p, extraTrain, must){
  // choose units + tokens for a player, independent of order
  // must: a unit that has to make the army even if it's weak on its own (a combo piece being tested in the shop)
  const cap = deckCap(p);
  const units = Object.keys(p.hand).filter(n => n !== 'Recruit').map(n => ({name:n, copies:p.hand[n], arm:0, sh:0, tr:0}));
  const lv = armyLvl;
  units.sort((a, b) => strengthU(b.name, lv(b)) - strengthU(a.name, lv(a)));
  const plain = units.filter(u => !exemptUnit(u.name)), top = plain.slice(0, cap);
  if (must && cap > 0 && !top.some(u => u.name === must)){ const m = plain.find(u => u.name === must); if (m) top[top.length - 1] = m; }
  const core = top.concat(units.filter(u => exemptUnit(u.name)));
  let tr = trAllow(p) + (extraTrain || 0);
  while (tr-- > 0 && core.length){
    let best = null, bg = 0;
    for (const u of core){ if (lv(u) >= uMax(u.name)) continue; const gn = strengthU(u.name, lv(u) + 1) - strengthU(u.name, lv(u)); if (gn > bg){ bg = gn; best = u; } }
    if (best) best.tr++;
  }
  const recs = recAllow(p);
  return {core, recs, arm:armAllow(p), sh:shAllow(p), gear:gearList(p)};
}
function assemble(order, recs, arm, recFront, armFirst, sh, gear){
  const deck = order.map(u => ({...u}));
  const r = Array.from({length:recs}, () => ({name:'Recruit', copies:1, arm:0, sh:0, tr:0}));
  const full = recFront ? r.concat(deck) : deck.concat(r);
  if (arm && deck.length){
    let t;
    if (armFirst) t = deck[0];
    else { t = deck[0]; for (const u of deck) if (strengthU(u.name, armyLvl(u)) > strengthU(t.name, armyLvl(t))) t = u; }
    t.arm += arm;
  }
  if (sh && full.length) full[0].sh = (full[0].sh || 0) + sh;   // Armory's Shields: on the Vanguard
  return placeGear(full, gear);
}
function battleCfgOf(p){ return {treb:bLvl(p,'Trebuchet'), yard:bVal(p,'Training Yard'), drill:bVal(p,'Muster Hall'), infirmary:!!p.city.Infirmary}; }
// Two "reads" of the enemy deck: strongest-first, and the order they used last battle (or weakest-first in round 1)
function oppGuesses(g, i){
  const opp = g.players[1-i], a = buildArmy(opp), guesses = [];
  if (!a.core.length && !a.recs) return guesses;
  guesses.push(assemble(a.core, a.recs, a.arm, true, false, a.sh, a.gear));
  if (opp.prevDeck){
    const seen = opp.prevDeck.filter(u => u.name !== 'Recruit').map(u => a.core.find(c => c.name === u.name)).filter(Boolean);
    const rest = a.core.filter(c => !seen.includes(c));
    guesses.push(assemble(seen.concat(rest), a.recs, a.arm, opp.prevDeck.length > 0 && opp.prevDeck[0].name === 'Recruit', false, a.sh, a.gear));
  } else guesses.push(assemble(a.core.slice().reverse(), a.recs, a.arm, false, false, a.sh, a.gear));
  return guesses;
}
// Reads plus random shuffles, so a plan also holds up against surprises
function oppGuessSet(g, i, n){
  const out = oppGuesses(g, i), a = buildArmy(g.players[1-i]);
  if (!a.core.length && !a.recs){
    // no army yet: they field nothing, or (if they can still shop) the one unit they could still afford
    const opp = g.players[1-i];
    out.push([]);
    if (g.phase === 'shop' && !g.passed[1-i] && g.buys && baseLeft(g.buys[1-i]) > 0){
      const names = new Set(['Recruit', ...g.disp.u.map(c => c.name)]);
      for (const nm of names) if (DEFS[nm].c <= opp.money) out.push([{name:nm, copies:1, arm:0, sh:0, tr:0}]);
    }
    return out;
  }
  while (out.length < n) out.push(assemble(shuffle(a.core.slice(), g.rnd), a.recs, a.arm, g.rnd() < 0.5, g.rnd() < 0.5, a.sh, a.gear));
  return out;
}
function battleScore(deck, gd, i, myCfg, oppCfg){
  const cfgs = [{...myCfg, units:deck}, {...oppCfg, units:gd}];
  if (i === 1) cfgs.reverse();
  const r = runBattle(cfgs, false), vm = ENGINE_STATE.battleVM && ENGINE_STATE.battleVM[i];
  if (vm){ const w = r.result.w; return (w === i ? vm.w : w < 0 ? vm.t : vm.l) + 0.002 * (r.left[i] - r.left[1-i]); }
  return (scoreFor(r.result.w, i)) + 0.02 * (r.left[i] - r.left[1-i]);
}
// Robust score (70% average, 30% worst case) across guesses, blended with the result against the predicted deck
function scoreDeck(deck, i, myCfg, oppCfg, guesses, pred, read){
  let sum = 0, mn = Infinity;
  for (const gd of guesses){ const s = battleScore(deck, gd, i, myCfg, oppCfg); sum += s; if (s < mn) mn = s; }
  const robust = guesses.length ? 0.7 * sum / guesses.length + 0.3 * mn : 0;
  if (!pred || !pred.length) return robust;
  return read * battleScore(deck, pred, i, myCfg, oppCfg) + (1 - read) * robust;
}
// Run fn with the opponent's units and buildings temporarily replaced by a predicted version (then put back).
function withOpp(g, i, fake, fn){
  if (!fake) return fn();
  const o = g.players[1 - i], h0 = o.hand, c0 = o.city;
  o.hand = fake.hand; o.city = fake.city;
  try{ return fn(); } finally { o.hand = h0; o.city = c0; }
}
// What will the opponent still buy this shop? They take turns with me, so when I'm choosing they usually have buys
// left. Predict them greedily with my own judgment as the model of theirs (I can't see their weights): the card they'd
// value most that they can afford, then the next, within their remaining buys and money.
// excl {src, idx}: a display card I'm about to take, so it isn't there for them. Returns {picks, fake} or null.
function predictOppBuys(g, i, G, excl){
  const o = 1 - i, opp = g.players[o];
  if (g.phase !== 'shop' || !g.buys || g.passed[o]) return null;
  // their buys and money as they'd stand after each predicted purchase, priced by the real rules
  const b = {...g.buys[o]};
  const opts = [];
  g.disp.u.forEach((c, idx) => { if (!(excl && excl.src === 'du' && excl.idx === idx)) opts.push({name:c.name, kind:'u', src:'du', idx}); });
  g.disp.b.forEach((c, idx) => { if (!(excl && excl.src === 'db' && excl.idx === idx) && c.name !== "Mason's Guild") opts.push({name:c.name, kind:'b', src:'db', idx}); });
  opts.push({name:'Recruit', kind:'u', src:'recruit'}, {name:'Field', kind:'b', src:'field'});
  const fake = {hand:{...opp.hand}, city:{...opp.city}, gear:{...(opp.gear || {})}, money:opp.money}, picks = [];
  const g0 = opp.genome, h0 = opp.hand, c0 = opp.city;
  opp.genome = G; opp.hand = fake.hand; opp.city = fake.city;
  try{
    for (let k = 0; k < 6; k++){
      let best = null;
      for (const c of opts){
        if (c.taken) continue;
        const q = buyQuote(fake, b, c.name, c.kind, c.src, mirSur(mirOf(g, c)), pairOf(g, c), mirOf(g, c).length); if (!q.ok) continue;
        const v = aiValue(g, o, c.name, c.kind) - q.price * G.m + mirValue(g, o, mirOf(g, c), G, 1, pairOf(g, c), c.kind);
        if (v > G.thresh && (!best || v > best.v)) best = {...c, v, price:q.price, slot:q.slot};
      }
      if (!best) break;
      picks.push(best); fake.money -= best.price; useSlot(b, best.kind, best.slot, best.name);
      if (best.kind === 'u') fake.hand[best.name] = (fake.hand[best.name] || 0) + 1;
      else if (isGear(best.name)) fake.gear[best.name] = (fake.gear[best.name] || 0) + 1;
      else fake.city[best.name] = (fake.city[best.name] || 0) + 1;
      if (best.src === 'du' || best.src === 'db'){ const x = opts.find(c => c.src === best.src && c.idx === best.idx); if (x) x.taken = true; }
    }
  } finally { opp.genome = g0; opp.hand = h0; opp.city = c0; }
  return picks.length ? {picks, fake} : null;
}
// The opponent's army as I should expect to face it this battle: guesses at their order, their battle buildings, and
// my prediction of the deck they'd field, all for a given (possibly predicted) set of their cards.
function oppView(g, i, D, fake){
  return withOpp(g, i, fake, () => ({guesses:oppGuessSet(g, i, D.shopGuesses), oppCfg:battleCfgOf(g.players[1 - i]), pred:predictOpp(g, i, D.predictK)}));
}
/* ---------- Opponent model: learning how this opponent orders their army ----------
   At Mobilize the AI makes several guesses at the opponent's order: its search prediction ("pred"), strongest unit
   first ("strong"), the order they used last battle ("last"; weakest first, "weak", before there is one). After the
   battle it checks each guess against the order they really fielded (front positions count most) and keeps a running
   accuracy per guess. Next time it leans on whichever guess has been most accurate, and trusts it more (or less) than
   usual by how accurate it has been: a predictable opponent gets countered harder, an unpredictable one hedged against.
   The trust shift is G.omk per point of accuracy above the 30% starting assumption. */
const OM_PRIOR = 0.3, OM_W = 1.5, OM_POS = [3, 2, 1.5];
const omAcc = (m, k) => ((m.s[k] || 0) + OM_PRIOR * OM_W) / ((m.c[k] || 0) + OM_W);
const omSeq = d => d && d.length ? d.filter(u => u.name !== 'Recruit').map(u => u.name) : null;
function omScore(pred, actual){ let s = 0, t = 0; actual.forEach((n, k) => { const w = OM_POS[k] ?? 1; t += w; if (pred[k] === n) s += w; }); return t ? s / t : 0; }
function omObserve(g){
  if (!g.omPending) return;
  for (const i of [0,1]){
    const P = g.omPending[i]; if (!P) continue;
    const actual = omSeq(g.decks[1 - i]);
    if (!actual || actual.length < 2) continue;   // one unit: nothing to learn about order
    const m = g.om[i] || (g.om[i] = {n:0, s:{}, c:{}});
    m.n++;
    for (const k in P){ if (!P[k]) continue; m.s[k] = (m.s[k] || 0) + omScore(P[k], actual); m.c[k] = (m.c[k] || 0) + 1; }
  }
  g.omPending = [null, null];
}
// The guess to lean on and how far to trust it, from what this opponent has done so far (only for the thinking AI's
// own decisions, not inside its prediction of the opponent).
function omPick(g, i, G, D, guesses, pred){
  const read0 = G.read ?? 0.4, m = g.om && g.om[i];
  if (!D || !D.predictDeep || !m || !m.n) return {pred, read:read0};
  const opp = g.players[1 - i];
  let best = null;
  for (const [k, d] of [['pred', pred], ['strong', guesses[0]], [opp.prevDeck ? 'last' : 'weak', guesses[1]]]){
    if (!d || !d.length) continue;
    const a = omAcc(m, k); if (!best || a > best.a) best = {k, d, a};
  }
  if (!best) return {pred, read:read0};
  return {pred:best.d, read:Math.max(0.05, Math.min(0.95, read0 + (G.omk ?? 1.5) * (best.a - OM_PRIOR))), k:best.k, a:best.a};
}
// Think ahead: what would the opponent field if they planned against my visible army?
function predictOpp(g, i, K){ return aiMobilizeAt(g, 1 - i, K) || null; }   // a quick guess, never the opponent's own rung

// How well a (possibly hypothetical) army does against the enemy
// How well a (possibly hypothetical) army does: try several orderings (strength order, one built from the combo
// table, and random ones), screen them against one guess of the enemy, then fully score the best few.
// must: the card being tested, kept in the army even if it's weak on its own.
function quickStrength(g, i, fake, guesses, oppCfg, pred, read, must){
  const a = buildArmy(fake, 0, must);
  if (!a.core.length && !a.recs) return 0;
  const myCfg = battleCfgOf(fake), nP = (g._qsD && g._qsD.shopPerms) || 8;
  const perms = [a.core.slice(), synOrder(a.core)];
  while (perms.length < nP) perms.push(shuffle(a.core.slice(), g.rnd));
  const decks = [];
  for (const perm of perms) for (const rf of (a.recs ? [true,false] : [true])) for (const af of (a.arm ? [true,false] : [false]))
    decks.push(assemble(perm, a.recs, a.arm, rf, af, a.sh, a.gear));
  const screen = guesses.length ? guesses[0] : null;
  if (screen && decks.length > 3){
    for (const d of decks) d._s = battleScore(d, screen, i, myCfg, oppCfg);
    decks.sort((x, y) => y._s - x._s); decks.length = 3;
  }
  let best = -Infinity;
  for (const d of decks){ const s = scoreDeck(d, i, myCfg, oppCfg, guesses, pred, read); if (s > best) best = s; }
  return best;
}
// a line-up built from the combo table: start from the strongest unit and keep adding whichever unit pairs best
// with the ends of the line (in front of the first or behind the last)
function synOrder(core){
  if (core.length < 3) return core.slice();
  const rest = core.slice(1), line = [core[0]];
  while (rest.length){
    let bi = 0, bv = -Infinity, back = true;
    rest.forEach((u, k) => {
      const v1 = SYN[line[line.length - 1].name + '>' + u.name] || 0, v2 = SYN[u.name + '>' + line[0].name] || 0;
      if (v1 > bv){ bv = v1; bi = k; back = true; }
      if (v2 > bv){ bv = v2; bi = k; back = false; }
    });
    const u = rest.splice(bi, 1)[0]; if (back) line.push(u); else line.unshift(u);
  }
  return line;
}
function withCard(pl, c, masonT){
  const f = {hand:{...pl.hand}, city:{...pl.city}, gear:{...(pl.gear || {})}};
  if (c.kind === 'u') f.hand[c.name] = (f.hand[c.name] || 0) + 1;
  else if (isGear(c.name)) f.gear[c.name] = (f.gear[c.name] || 0) + 1;
  else if (c.name === "Mason's Guild"){ if (!masonT) return null; f.city[masonT] = (f.city[masonT] || 0) + 1; }
  else f.city[c.name] = (f.city[c.name] || 0) + 1;
  return f;
}
