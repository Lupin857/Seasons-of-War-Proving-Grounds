/* ===================== FULL GAME ===================== */
const unitPool = () => Object.entries(DEFS).filter(([k,d]) => !d.token).flatMap(([k,d]) => Array(Math.max(0, d.n|0)).fill(k));
const bldPool = () => Object.entries(BDEFS).filter(([k,d]) => !d.always && d.n > 0).flatMap(([k,d]) => Array(Math.max(0, d.n|0)).fill(k));
const RULES = {target:3, buysPerShop:3, fieldsPerShop:1, citySlots:5, deckCap:5, baseIncome:3, unitDisplay:5, bldgDisplay:5, maxRounds:20, startFields:1};
/* Game setup: the starting conditions and limits of one game, chosen on the setup screen. A missing value means the
   rule above. Shared: deckCap, city (Caravan slots), uDisp/bDisp (shop display sizes), catchup (the player behind on
   points gets +$catchup at the start of each shop). Per player (pl[0], pl[1]): water (extra water at the start),
   fields (Moisture Harvesters owned at the start), drift (Drifters in hand for the first battle), inc (base income),
   buys (buys per shop), fps (Harvester buys per shop). */
function suDefault(){
  return {deckCap:RULES.deckCap, city:RULES.citySlots, uDisp:RULES.unitDisplay, bDisp:RULES.bldgDisplay, catchup:0,
    pl:[0,1].map(() => ({water:0, fields:RULES.startFields, drift:0, inc:RULES.baseIncome, buys:RULES.buysPerShop, fps:RULES.fieldsPerShop}))};
}
// a player's own copy of the rules that can differ per game (or per player)
const ruleOf = (p, k, d) => p && p.su && p.su[k] != null ? p.su[k] : d;
const buyCap = p => ruleOf(p, 'buys', RULES.buysPerShop);
const buysOf = b => b && b.cap != null ? b.cap : RULES.buysPerShop;
const citySlots = p => ruleOf(p, 'city', RULES.citySlots);
const dispSize = (g, k) => k === 'u' ? (g && g.su && g.su.uDisp) || RULES.unitDisplay : (g && g.su && g.su.bDisp) || RULES.bldgDisplay;


function shuffle(a, rnd){ for (let i = a.length-1; i > 0; i--){ const j = Math.floor(rnd()*(i+1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
const uMax = n => DEFS[n].p.length;
const uLvl = (n, c) => Math.min(c, uMax(n));
// a fielded unit's level: its copies plus any Training, capped at the card's highest level
const armyLvl = u => uLvl(u.name, u.copies + (u.tr || 0));
// a result as points for player i: 1 for a win, 0.5 for a draw (w === -1), 0 for a loss
const scoreFor = (w, i) => w === i ? 1 : w === -1 ? 0.5 : 0;
// "Armament" / "Armaments": plural only above 1, as the log has always worded it
const plural = (n, word) => n > 1 ? word + 's' : word;
function bLvl(p, n){ const c = p.city[n] || 0; return Math.min(c, BDEFS[n].lv.length); }
function bVal(p, n){ const l = bLvl(p, n); return l ? BDEFS[n].lv[l-1] : 0; }
function slotsUsed(p){ let s = 0; for (const k in p.city){ if (!p.city[k]) continue; s += k === 'Field' ? p.city[k] : 1; } return s; }
function deckCap(p){ if (p.raidRoster) return RAID.deck; return ruleOf(p, 'deckCap', RULES.deckCap) + bVal(p, 'Reserve Encampment'); }
const exemptUnit = n => n === 'Mercenary' || n === 'Recruit';
function uniqueUnits(p){ return Object.keys(p.hand).filter(n => p.hand[n] > 0 && !exemptUnit(n)).length; }
function hiredBladeCost(c){ if (!c) return 0; const v = DEFS['Hired Blade'].v || [1]; return v[Math.min(c, DEFS['Hired Blade'].p.length, v.length) - 1]; }
function income(p){ return ruleOf(p, 'inc', RULES.baseIncome) + (p.city.Field || 0) + bVal(p, 'Windmill') + farmhandIncome(p) - hiredBladeCost(p.hand['Hired Blade'] || 0) + bVal(p, 'Altar of Blood'); }
// Conscripted Farmhand: more income while you own it and at least one Field
function farmhandIncome(p){ const c = (p.hand && p.hand['Conscripted Farmhand']) || 0, v = DEFS['Conscripted Farmhand'].v; return c && (p.city.Field || 0) > 0 ? v[Math.min(uLvl('Conscripted Farmhand', c), v.length) - 1] : 0; }
function total(p){ return p.score + (p.city.Cathedral ? 1 : 0); }
function masonTargets(p){ return Object.keys(p.city).filter(n => n !== 'Field' && p.city[n] > 0 && p.city[n] < BDEFS[n].lv.length); }

function newGame(o){
  o = o || {};
  const g = newGame0(o);
  applySetup(g, o.su);
  if (o.raid) raidInit(g);
  return g;
}
function newGame0(o){
  const rnd = o.rnd || Math.random, mo = !o.raid && (o.miracles ?? MIRACLES_ON), bmo = !!(mo && (o.battleMir ?? BATTLE_MIR_ON)), rf = !!(o.refill ?? REFILL_ON);
  return {rnd, miracles:mo, battleMir:bmo, refill:rf, spells:[[], []], salvMir:[], target:o.target || RULES.target, round:0, phase:'shop', winner:null, over:false,
    uDeck:shuffle(unitPool().concat(mo ? mirPool('u', bmo) : []), rnd), bDeck:shuffle(bldPool().concat(mo ? mirPool('b', bmo) : []), rnd), mirShown:{},
    disp:{u:[], b:[]}, muster:[], log:[], labels:o.labels || ['Azure','Gules'],
    players:[0,1].map(i => ({id:i, money:0, score:0, hand:{}, city:{}, gear:{}, equip:{}, mir:[], prevDeck:null, genome:(o.genomes||[])[i] || null, bought:[], wonLast:false})),
    su:null,
    order:[0,1], turnIdx:0, passed:[false,false], buys:null, frozen:[[], []], peek:[[], []], bmUsed:[false,false], mirGot:[[], []], decks:[null,null], lastBattle:null,
    om:o.om || [null,null], omPending:[null,null]};
}
// put a setup's starting conditions and limits on a new game (newGame without a setup plays by RULES)
function applySetup(g, su){
  const d = suDefault(); su = su || d;
  const num = (v, dv) => Number.isFinite(+v) && v !== null && v !== '' ? +v : dv;
  g.su = {uDisp:num(su.uDisp, d.uDisp), bDisp:num(su.bDisp, d.bDisp), catchup:num(su.catchup, 0)};
  g.players.forEach((p, i) => {
    const q = (su.pl && su.pl[i]) || {}, dq = d.pl[i];
    p.su = {inc:num(q.inc, dq.inc), buys:num(q.buys, dq.buys), fps:num(q.fps, dq.fps), deckCap:num(su.deckCap, d.deckCap), city:num(su.city, d.city)};
    const w = num(q.water, 0), f = num(q.fields, dq.fields), r = num(q.drift, 0);
    p.money = w;
    if (f > 0) p.city.Field = f;
    if (r > 0) p.hand.Recruit = r;
  });
  return g;
}
const cur = g => g.order[g.turnIdx];

function startShop(g){
  g.round++; g.phase = 'shop';
  if (g.raid) raidResetRound(g);
  for (const p of g.players) p.money += Math.max(0, income(p));
  // catch-up (a setup option): the player behind on points gets extra water
  let catchMsg = null;
  const cu = (g.su && g.su.catchup) || 0;
  if (cu > 0 && g.round > 1){
    const [t0, t1] = g.players.map(p => g.raid ? p.health : total(p));
    if (t0 !== t1){ const j = t0 < t1 ? 0 : 1; g.players[j].money += cu; catchMsg = {t:`Catch-up: ${g.labels[j]} ${g.labels[j] === 'You' ? 'are' : 'is'} behind and ${g.labels[j] === 'You' ? 'get' : 'gets'} +$${cu}.`, side:j}; }
  }
  for (const k of ['u','b']){
    const size = dispSize(g, k), deck = k === 'u' ? g.uDeck : g.bDeck;
    // each display card has a fixed slot (at); cards that stay keep theirs and new cards fill the empty ones in order
    const used = new Set(g.disp[k].filter(c => c.at != null).map(c => c.at));
    const free = () => { let a = 0; while (used.has(a)) a++; used.add(a); return a; };
    for (const c of g.disp[k]) if (c.at == null) c.at = free();
    while (g.disp[k].length < size){ const c = dealCard(g, k); if (!c) break; c.at = free(); g.disp[k].push(c); }
  }
  let first;
  if (g.round === 1){ first = g.firstOverride != null ? g.firstOverride : g.rnd() < 0.5 ? 0 : 1; g.first1 = first; }
  else if (g.raid) first = g.players[0].health === g.players[1].health ? 1 - g.order[0]
    : g.players[0].health < g.players[1].health ? 0 : 1;
  else if (g.lastBattle && g.lastBattle.w >= 0) first = 1 - g.lastBattle.w;
  else first = g.order[1];
  g.order = [first, 1 - first]; g.turnIdx = 0; g.passed = [false,false];
  g.buys = [0,1].map(i => ({u:0, b:0, carp:0, fav:0, favN:0, fld:0, wc:0, cap:buyCap(g.players[i])}));
  g.peek = [[], []]; g.bmUsed = [false,false];
  g.seen = [new Set(), new Set()]; g.shopBought = [[], []]; g.buyTags = [{}, {}];
  g.mirSeen = [new Set(), new Set()]; g.mirShop = [[], []];
  // Altar of Blood: each owner discards one copy of their most expensive unit (a person picks among ties on their first turn)
  g.altarPend = [null, null];
  for (const i of [0,1]){ const opts = altarOpts(g.players[i]); if (!opts.length) continue;
    if (opts.length === 1 || g.players[i].genome || g._po) altarDiscard(g, i, opts.length === 1 ? opts[0] : aiAltarPick(g.players[i], opts)); else g.altarPend[i] = opts; }
  // position at the start of the shop (before anyone buys a Cathedral), used by the card stats
  g.shopLead = [0,1].map(i => total(g.players[i]) - total(g.players[1-i]));
  g.log.push({t:`Round ${g.round}. ${g.labels[first]} ${g.labels[first] === 'You' ? 'shop' : 'shops'} first.`});
  if (catchMsg) g.log.push(catchMsg);
}
// Altar of Blood: the units tied for most expensive (by cost), or [] if the player has no Altar or no units
function altarOpts(p){
  if (!p.city || !p.city['Altar of Blood']) return [];
  const own = Object.keys(p.hand).filter(n => p.hand[n] > 0 && DEFS[n] && !DEFS[n].token);
  if (!own.length) return [];
  const top = Math.max(...own.map(n => DEFS[n].c));
  return own.filter(n => DEFS[n].c === top).sort();
}
// the AI loses the copy that costs it the least strength (a lone copy costs the whole unit)
function aiAltarPick(p, opts){
  let best = opts[0], bl = Infinity;
  for (const n of opts){ const c = p.hand[n], l = strengthU(n, uLvl(n, c)) - strengthU(n, uLvl(n, c - 1)); if (l < bl){ bl = l; best = n; } }
  return best;
}
function altarDiscard(g, i, name){
  const p = g.players[i]; if (!p.hand[name]) return false;
  if (!--p.hand[name]){ delete p.hand[name]; if (p.raidRoster) delete p.raidRoster[name]; }
  (g.muster || (g.muster = [])).push(name);
  if (g.altarPend) g.altarPend[i] = null;
  g.log.push({t:`Altar of Blood: ${g.labels[i]} ${g.labels[i]==='You'?'discard':'discards'} ${name}.`, side:i, ev:{a:'altar', n:name}});
  return true;
}
// a person's pick among tied units (a shop move: ['a', name])
function altarPick(g, i, name){
  if (g.phase !== 'shop' || cur(g) !== i || !g.altarPend || !g.altarPend[i] || !g.altarPend[i].includes(name)) return false;
  return altarDiscard(g, i, name);
}
const altarWaiting = (g, i) => !!(g.altarPend && g.altarPend[i]);
// cards a player could have taken on one of its turns (always-available Fields and Recruits are left out)
function noteSeen(g, i){
  if (!g.seen) return;
  for (const c of g.disp.u) g.seen[i].add(c.name);
  for (const c of g.disp.b) g.seen[i].add(c.name);
  if (g.mirSeen) for (const c of g.disp.u.concat(g.disp.b)) for (const m of c.mir || []) g.mirSeen[i].add(m);
  for (const by of PEEK_BY){ const pk = peekOf(g, i, by); if (pk) for (const n of pk.cards) g.seen[i].add(n); }
}
// Discard pile holds units and buildings by name; a card's kind and whether a player owns it

// one full round with both players automated (used for training / sims)
function autoRound(g, K, depth){
  startShop(g);
  for (let guard = 0; g.phase === 'shop' && guard < 60; guard++) aiShopTurn(g, cur(g), depth);
  if (g.phase === 'shop'){ g.passed = [true,true]; endShop(g); }
  const decks = [0,1].map(i => aiMobilize(g, i, K, depth) || []);
  for (const i of [0,1]) setDeck(g, i, decks[i]);
  finishMobilize(g);
  return doBattle(g, false);
}
