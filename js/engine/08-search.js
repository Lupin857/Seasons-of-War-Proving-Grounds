/* ===================== SEARCH: planning ahead by chance of winning the game =====================
   Every option is judged by one number: the chance of winning the whole game afterward.
   - This round's battle: both armies' good orders (each side's best few, found by test battles) are fought against
     each other, and each result counts as win, tie or loss. Ties are not half a win: what a tie is worth depends
     on the score, which the game-win math below works out.
   - Later rounds: the edge from this battle carries forward, fading (G.shr per round), plus the money each side
     will have to spend by then (leftover money plus income every shop, G.kp per $ of difference). That is how a
     Field or Windmill, or saving money, is weighed against a unit that helps right now.
   - The game-win math follows the real rules: first to the target, ties score nothing, a Cathedral's point needs a
     battle win to finish the game.
   The shop search looks ahead like a chess engine: my option, then the opponent's best replies (they are assumed to
   play well), then my next buy, and so on, finishing the shop with quick greedy buys once deep enough. It deepens
   one step at a time (iterative deepening) and stops as soon as more thinking won't change its choice: the best
   option stayed best and leads clearly, or every option left is about equal, or the next step won't fit in its
   time or work budget. Options that clearly can't catch up are dropped between steps, so deeper steps only
   separate the real contenders. */
const SEARCH_SKIP = new Set(['log', 'rec', '_why', '_mobWhy', '_mobLevel', '_es', '_qsD', 'battles', 'lastBattle']);
function dcopy(v){
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(dcopy);
  if (v instanceof Set) return new Set(v);
  if (v instanceof Map) return new Map(v);
  const o = {}; for (const k in v) o[k] = k === 'genome' || k === 'skill' ? v[k] : dcopy(v[k]); return o;
}
function simClone(g){
  const o = {};
  for (const k in g){ if (SEARCH_SKIP.has(k)) continue; const v = g[k]; o[k] = typeof v === 'function' ? v : dcopy(v); }
  o.log = []; return o;
}
const sig = x => 1 / (1 + Math.exp(-x));
const logit = q => { q = Math.max(0.1, Math.min(0.9, q)); return Math.log(q / (1 - q)); };   // one battle never makes the game a certainty
// money a player will have per later shop: income, plus about $0.8 a shop from Carpenter's Guild's discount
const projIncome = p => Math.max(0, income(p)) + (p.city["Carpenter's Guild"] ? 0.8 : 0);
// Chance that player i wins the game after this round's battle ends in a win, a tie or a loss for i.
// s0: i's edge in this battle (log-odds); later battles use the faded edge plus the money gap.
// sF: the edge that carries into later battles, measured without this round's Mercenaries and bought Recruits
// (they are discarded after the battle, so they must not count as lasting strength). Defaults to s0.
function roundValues(g, i, G, s0, sF){
  if (sF == null) sF = s0;
  const me = g.players[i], op = g.players[1 - i], T = g.target;
  const ca = me.city.Cathedral ? 1 : 0, cb = op.city.Cathedral ? 1 : 0;
  const kp = G.kp ?? 0.15, shr = G.shr ?? 0.6, tie = G.tie ?? 0.12;
  const m0 = me.money - op.money, dI = projIncome(me) - projIncome(op), maxK = Math.min(8, Math.max(1, RULES.maxRounds - g.round));
  const pk = k => { const q = sig(sF * Math.pow(shr, k) + kp * (m0 + k * dI)); return [(1 - tie) * q, tie, (1 - tie) * (1 - q)]; };
  const P = []; for (let k = 1; k <= maxK; k++) P.push(pk(k));
  const memo = new Map();
  // after a battle with result o (0 win, 1 tie, 2 loss for i) the score is (a, b): is the game over?
  const done = (a, b, o) => {
    const ta = a + ca, tb = b + cb;
    if (Math.max(ta, tb) >= T && ta !== tb){
      if (ta > tb){ if (!ca || o === 0) return 1; }
      else if (!cb || o === 2) return 0;
    }
    return null;
  };
  const f = (a, b, k) => {   // value before later battle k (1-based)
    if (k > maxK) { const d = (a + ca) - (b + cb); return d > 0 ? 0.75 : d < 0 ? 0.25 : 0.5; }
    const key = a * 1e4 + b * 100 + k; if (memo.has(key)) return memo.get(key);
    const p = P[k - 1]; let v = 0;
    for (let o = 0; o < 3; o++){ if (!p[o]) continue; const a2 = a + (o === 0), b2 = b + (o === 2), e = done(a2, b2, o); v += p[o] * (e != null ? e : f(a2, b2, k + 1)); }
    memo.set(key, v); return v;
  };
  const after = o => { const a2 = me.score + (o === 0), b2 = op.score + (o === 2), e = done(a2, b2, o); return e != null ? e : f(a2, b2, 1); };
  return {w:after(0), t:after(1), l:after(2)};
}
// The few best orders player j could field, found by test battles against `vs` (the other side's plain order)
function goodDecks(g, j, P, K, vs, cfgJ, cfgO){
  const pl = g.players[j], a = buildArmy(pl);
  if (!a.core.length && !a.recs) return [[]];
  const perms = [a.core.slice(), synOrder(a.core), a.core.slice().reverse()];
  while (perms.length < P) perms.push(shuffle(a.core.slice(), g.rnd));
  const out = [], seen = new Set();
  for (const perm of perms) for (const rf of (a.recs ? [true, false] : [true])) for (const af of (a.arm ? [true, false] : [false])){
    const d = assemble(perm, a.recs, a.arm, rf, af, a.sh, a.gear), key = deckKey(d); if (seen.has(key)) continue; seen.add(key);
    out.push({d, s:battleScore(d, vs, j, cfgJ, cfgO)});
  }
  out.sort((x, y) => y.s - x.s);
  return out.slice(0, K).map(x => x.d);
}
const plainDeck = p => { const a = buildArmy(p); return (!a.core.length && !a.recs) ? [] : assemble(a.core, a.recs, a.arm, true, false, a.sh, a.gear); };
/* ---------- Playouts: the rest of the game ----------
   After this round's battle, what is my chance of winning the game? Play the rest of it out many times and count.
   Each playout starts from this position after a win, a tie or a loss, shuffles the cards nobody has seen yet (the
   AI doesn't know the deck order), and plays every later round to the end with a fast imagined player on both sides
   (the quick shop formula and a light Mobilize). That imagined player is only the AI's picture of how the game might
   go; every real decision is a comparison of these game-win chances. The same random seeds are used for every option
   in one decision, so options are compared on the same imagined futures and the differences aren't luck. */
const PO_SKIP = new Set(['offers', 'states', 'mirDecide', 'mixInfo', 'omPending']);
function poClone(g){
  const o = {};
  for (const k in g){ if (SEARCH_SKIP.has(k) || PO_SKIP.has(k)) continue; const v = g[k]; o[k] = typeof v === 'function' ? v : dcopy(v); }
  o.log = []; o._po = true; return o;
}
// battle bookkeeping without fighting it (the same steps doBattle takes after a result)
function applyOutcome(c, w){
  c.lastBattle = {w};
  c.players.forEach((p, k) => { p.wonLast = w === k; });
  if (w >= 0) c.players[w].score++;
  for (const k of [0,1]) if (c.decks && c.decks[k]) c.players[k].prevDeck = c.decks[k].map(u => ({...u}));
  for (const p of c.players){ delete p.hand.Recruit; delete p.hand.Mercenary; }
  const t = c.players.map(total), mx = Math.max(t[0], t[1]);
  if (mx >= c.target && t[0] !== t[1]){ const L = t[0] > t[1] ? 0 : 1; if (!c.players[L].city.Cathedral || c.players[L].wonLast){ c.winner = L; c.over = true; } }
  if (!c.over && c.round >= RULES.maxRounds){ c.over = true; c.winner = t[0] === t[1] ? -1 : (t[0] > t[1] ? 0 : 1); }
  c.phase = c.over ? 'over' : 'shop';
}
function poRound(c){
  startShop(c);
  for (let guard = 0; c.phase === 'shop' && guard < 40; guard++){ c._esPo = null; aiShopTurn(c, cur(c), null); }
  if (c.phase === 'shop'){ c.passed = [true, true]; endShop(c); }
  for (const i of [0,1]) setDeck(c, i, plainDeck(c.players[i]));
  finishMobilize(c);
  doBattle(c, false);
}
// [win, tie, loss] for player i: chance of winning the game after this round's battle goes each way.
// g: the shop is over. decks (optional): the orders expected in this battle, so Farmhand/Arsonist money is counted.
// need (optional): which of win/tie/loss can actually happen; the others aren't played out (their value is never used)
function outcomeValues(g, i, n, decks, need){
  const base = poClone(g);
  if (decks){ base.decks = decks.map(d => (d || []).map(u => ({...u}))); finishMobilize(base); }
  else if (!base.decks || !base.decks[0]) base.decks = [[], []];
  const seed = g._poSeed != null ? g._poSeed : 0x5eed, out = [0, 0, 0];
  for (let o = 0; o < 3; o++){
    if (need && !need[o]){ out[o] = NaN; continue; }
    const w = o === 0 ? i : o === 1 ? -1 : 1 - i;
    for (let k = 0; k < n; k++){
      const c = poClone(base); c.rnd = mulberry32(seed + 7919 * k);
      c.uDeck = shuffle(c.uDeck, c.rnd); c.bDeck = shuffle(c.bDeck, c.rnd);
      applyOutcome(c, w);
      for (let r = 0; !c.over && r < 40; r++) poRound(c);
      out[o] += c.over ? scoreFor(c.winner, i) : 0.5;
    }
  }
  // A handful of playouts is a noisy count (one playout is a 0 or a 1), so each estimate starts from the short-sighted
  // view (later battles even, money ignored) worth PO_PRIOR playouts, and the playouts pull it toward what they found.
  const M = myopicValues(g, i, g.players[i].genome), sh = x => (x + PO_PRIOR * x0) / (n + PO_PRIOR);
  let x0;
  x0 = M.w; const w = sh(out[0]); x0 = M.t; const t = sh(out[1]); x0 = M.l; const l = sh(out[2]);
  return inOrder({w, t, l});
}
const PO_PRIOR = 2;
// Obvious knowledge the playouts can miss by luck (Brian, Nov 24): winning a battle is never worse than a draw, and a
// draw never worse than a loss. When the noisy estimates come out in the wrong order, the ones out of order are
// averaged together (the standard fix for noisy estimates that must be ordered), so they become equal and the battle's
// tiebreak (units left alive) prefers the better result. Values not played out (NaN) are left alone.
function inOrder(v){
  const ks = ['w', 't', 'l'].filter(k => Number.isFinite(v[k])), B = [];
  for (const k of ks){
    B.push({s:v[k], n:1, ks:[k]});
    while (B.length > 1 && B[B.length - 2].s / B[B.length - 2].n < B[B.length - 1].s / B[B.length - 1].n){
      const b = B.pop(), a = B[B.length - 1]; a.s += b.s; a.n += b.n; a.ks.push(...b.ks);
    }
  }
  const o = {...v}; for (const b of B) for (const k of b.ks) o[k] = b.s / b.n;
  return o;
}
// Short-sighted levels in the shop: this battle counts in full, but later battles are seen only dimly. Money and the
// army you keep still matter a little, as they would to any new player (cards carry over, money buys things later),
// so a card that does nothing now is never 'free' and selling a unit you need is never a coin flip. They just don't
// project how far that edge carries, which is where their mistakes come from.
function shortSightValues(g, i, G, s0, sF){
  G = G || {};
  return roundValues(g, i, {kp:(G.kp ?? 0.15) * 0.5, shr:(G.shr ?? 0.6) * 0.5, tie:G.tie ?? 0.12}, s0, sF);
}
// Short-sighted levels: what a win, tie or loss here is worth if every later battle were a coin flip and money
// didn't matter (only the score math: first to the target, ties score nothing, a Cathedral needs a win)
function myopicValues(g, i, G){ return roundValues(g, i, {kp:0, shr:0, tie:(G && G.tie) ?? 0.12}, 0, 0); }
// Mercenaries and bought Recruits last one battle (Barracks Recruits come back every round, so they stay)
const hasTemps = p => !!(p.hand.Mercenary || p.hand.Recruit);
function withoutTemps(g, fn){
  const h0 = g.players.map(p => p.hand);
  for (const p of g.players){ if (!hasTemps(p)) continue; const h = {...p.hand}; delete h.Mercenary; delete h.Recruit; p.hand = h; }
  try{ return fn(); } finally { g.players.forEach((p, k) => { p.hand = h0[k]; }); }
}
// Both sides' good orders fought against each other; q is my best order's average result (a tie counts half)
function edgeRes(g, i, S, cI, cO){
  const me = g.players[i], op = g.players[1 - i];
  const mine = goodDecks(g, i, S.P, S.K, plainDeck(op), cI, cO), theirs = goodDecks(g, 1 - i, S.P, S.K, plainDeck(me), cO, cI);
  const res = mine.map(d => theirs.map(od => {
    const cfgs = [{...cI, units:d}, {...cO, units:od}]; if (i === 1) cfgs.reverse();
    const r = runBattle(cfgs, false), w = r.result.w;
    return {o:w === i ? 0 : w < 0 ? 1 : 2, m:r.left[i] - r.left[1 - i]};
  }));
  let q = 0; for (const row of res){ const s = row.reduce((a, c) => a + (c.o === 0 ? 1 : c.o === 1 ? 0.5 : 0), 0) / row.length; if (s > q) q = s; }
  return {res, q, mine, theirs};
}
// Chance player i wins the game from this position (the shop is over, or treated as over)
function evalState(g, i, G, S, cache, stats){
  const me = g.players[i], op = g.players[1 - i];
  // everything the result depends on: both sides' cards, money, score and miracles, what's left on display and in
  // Discard (the next shop starts from them), the playout budget and seed, and whose judgment imagines the future
  const key = JSON.stringify([i, S.po || 0, g._poSeed, genomeKey(G), g.round, me.hand, me.city, me.money, me.score, me.mir, op.hand, op.city, op.money, op.score, op.mir,
    g.disp.u.map(c => c.name + (c.side ? '*' : '')), g.disp.b.map(c => c.name + (c.side ? '*' : '')), g.muster]);
  if (cache.has(key)) return cache.get(key);
  stats.evals++;
  const cI = battleCfgOf(me), cO = battleCfgOf(op);
  const {res, q, mine, theirs} = edgeRes(g, i, S, cI, cO);
  // the edge that lasts: the same test without either side's Mercenaries and bought Recruits, which are discarded
  // after this battle. Only worth the extra battles when someone is holding one.
  const qF = S.po ? q : (hasTemps(me) || hasTemps(op)) ? withoutTemps(g, () => edgeRes(g, i, S, cI, cO).q) : q;
  // what a win, tie or loss in this battle is worth for the whole game: played out (or the quick projection without a budget)
  const need = [0, 1, 2].map(o => res.some(row => row.some(c => c.o === o)));   // only the results these battles can produce
  const V = S.myopic ? shortSightValues(g, i, G, logit(q), logit(qF)) : S.po ? outcomeValues(g, i, S.po, i === 0 ? [mine[0], theirs[0]] : [theirs[0], mine[0]], need) : roundValues(g, i, G, logit(q), logit(qF));
  const rob = G.rob ?? 0.25, vv = [V.w, V.t, V.l];
  let best = -1, bestRow = null;
  for (const row of res){
    let sum = 0, mn = 1, mg = 0; for (const c of row){ const x = vv[c.o]; sum += x; if (x < mn) mn = x; mg += c.m; }
    const v = (1 - rob) * sum / row.length + rob * mn + 0.0005 * mg / row.length;
    if (v > best){ best = v; bestRow = row; }
  }
  const n = bestRow.length, out = {v:best, w:bestRow.filter(c => c.o === 0).length / n, t:bestRow.filter(c => c.o === 1).length / n};
  cache.set(key, out); return out;
}
// Options for player j in the shop, best first by the quick formula, at most `width` of them, plus passing
const ECON_CARDS = new Set(['Field', 'Windmill', "Carpenter's Guild", 'Chapel', 'War College']);
function shopMoves(g, j, G, width, econ){
  const p = g.players[j], mE = Math.min(1, expShops(g, j)), out = [];
  // the deciding player's own options (econ = root): every legal buy and sale is judged by game-win chance, so none is cut here
  if (econ){
    const list = [], seen = new Set();
    // a sale only makes sense to pay for something: a card I'm a little short for, or one my full city has no room for
    let blocked = false;
    const soldNow = (g.sold && g.sold[j]) || [];
    for (const o of aiShopOptions(g, j)){
      const info = buyInfo(g, j, o.name, o.kind, o.src, o.idx);
      if (!info.ok){
        if (o.name !== "Mason's Guild" && !soldNow.includes(o.name) && (info.why === 'City is full' || (info.price != null && info.price - p.money <= SELL_PRICE * (2 - soldNow.length)))) blocked = true;
        continue;
      }
      if (o.name === "Mason's Guild" && !aiMasonTarget(g, j)) continue;
      if (soldNow.includes(o.name)) continue;   // buying back what I just sold only loses money
      const k = o.name + '|' + (o.src === 'du' || o.src === 'db' ? 'd' : o.src); if (seen.has(k)) continue; seen.add(k);
      list.push({act:'buy', src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price});
    }
    // A sale is only weighed together with the buy it pays for (a card I'm $1 short for, or one my full city has no
    // room for): the cheapest few cards to part with, times the best few cards they'd unlock. Selling on its own,
    // with nothing to spend the dollar on, is never a sensible move.
    if (blocked && soldNow.length < 2){
      const sellables = [];
      for (const n in p.hand) if (aiCanSell(g, j, 'u', n)) sellables.push({kind:'u', name:n});
      for (const n in p.city) if (aiCanSell(g, j, 'b', n)) sellables.push({kind:'b', name:n});
      for (const x of sellables) x.r = aiValue(g, j, x.name, x.kind);
      sellables.sort((a, b) => a.r - b.r);
      const pairs = [];
      for (const x of sellables.slice(0, 3)){
        const c = simClone(g); c.rnd = g.rnd; if (!sell(c, j, x.kind, x.name)) continue;
        for (const o of aiShopOptions(c, j)){
          if (o.name === x.name || soldNow.includes(o.name)) continue;
          if (buyInfo(g, j, o.name, o.kind, o.src, o.idx).ok) continue;   // affordable anyway: no sale needed for it
          const info = buyInfo(c, j, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
          if (o.name === "Mason's Guild" && !aiMasonTarget(c, j)) continue;
          pairs.push({act:'sellbuy', sk:x.kind, sn:x.name, src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price - SELL_PRICE, r:aiValue(c, j, o.name, o.kind) - x.r});
        }
      }
      pairs.sort((a, b) => b.r - a.r);
      const seenP = new Set();
      for (const m of pairs){ const k = m.sn + '>' + m.name; if (seenP.has(k)) continue; seenP.add(k); list.push(m); if (seenP.size >= 6) break; }
    }
    // Freeze: setting aside each display card (as this turn) is weighed against buying and passing
    if (canFreeze(g, j)){
      const fseen = new Set();
      for (const [src, row] of [['du', g.disp.u], ['db', g.disp.b]]) row.forEach((c, idx) => { if (fseen.has(c.name)) return; fseen.add(c.name); list.push({act:'freeze', src, idx, name:c.name}); });
    }
    list.push({act:'pass', name:'pass'});
    return list;
  }
  for (const o of aiShopOptions(g, j)){
    const info = buyInfo(g, j, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
    if (o.name === "Mason's Guild" && !aiMasonTarget(g, j)) continue;
    const f = aiValue(g, j, o.name, o.kind) - info.price * G.m * mE + mirValue(g, j, mirOf(g, o), G, mE, pairOf(g, o), o.kind);
    out.push({act:'buy', src:o.src, idx:o.idx, name:o.name, kind:o.kind, price:info.price, f});
  }
  out.sort((a, b) => b.f - a.f);
  const seen = new Set(), list = [];
  for (const m of out){
    const k = m.name + '|' + (m.src === 'du' || m.src === 'db' ? 'd' : m.src); if (seen.has(k)) continue;
    if (list.length >= width && !(econ && ECON_CARDS.has(m.name))) continue;   // at the root, economy is always weighed
    seen.add(k); list.push(m);
  }
  list.push({act:'pass', name:'pass', f:G.thresh * mE});
  return list;
}
function doMove(g, j, m){
  if (m.act === 'sell'){ sell(g, j, m.kind, m.name); return; }
  if (m.act === 'freeze'){ if (useFreeze(g, j, m.src, m.idx)) return; if (g.phase === 'shop' && cur(g) === j) pass(g, j); return; }
  if (m.act === 'sellbuy'){
    if (sell(g, j, m.sk, m.sn) && buy(g, j, m.src, m.idx, m.name === "Mason's Guild" ? aiMasonTarget(g, j) : undefined)) return;
    if (g.phase === 'shop' && cur(g) === j) pass(g, j); return;
  }
  if (m.act === 'buy' && buy(g, j, m.src, m.idx, m.name === "Mason's Guild" ? aiMasonTarget(g, j) : undefined)) return;
  if (g.phase === 'shop' && cur(g) === j) pass(g, j);
}
// finish the shop quickly: each side takes its best formula pick while it beats passing
function rollout(g, G){
  for (let n = 0; n < 30 && g.phase === 'shop'; n++){
    const j = cur(g), m = shopMoves(g, j, G, 1)[0];
    doMove(g, j, m.act === 'buy' && m.f > G.thresh * Math.min(1, expShops(g, j)) ? m : {act:'pass'});
  }
}
function searchVal(g, i, G, S, depth, cache, stats){
  if (g.phase !== 'shop') return evalState(g, i, G, S, cache, stats).v;
  if (depth <= 0){ rollout(g, G); return evalState(g, i, G, S, cache, stats).v; }
  const j = cur(g), moves = shopMoves(g, j, G, S.inner);
  let best = j === i ? -1 : 2;
  for (const m of moves){
    const c = simClone(g); doMove(c, j, m);
    const v = searchVal(c, i, G, S, depth - 1, cache, stats);
    if (j === i ? v > best : v < best) best = v;
  }
  return best;
}
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
// Results kept across shop turns: on my next turn many of the positions I'd judge are ones I already played out
// (their actual reply was in my look-ahead). Cleared when it grows large.
function genomeKey(G){ if (!G || typeof G !== 'object') return ''; const cache = ENGINE_STATE.searchGenomeKeys; let k = cache.get(G); if (k == null){ k = JSON.stringify(G); cache.set(G, k); } return k; }
// One seed per player per shop, from public facts only, so every turn of a shop uses the same imagined futures
function shopSeed(g, i){
  const s = `${g.round}|${g.first1}|${g.target}|${g.players[0].score}|${g.players[1].score}|${g.uDeck.length}|${g.bDeck.length}|${i}`;
  let x = 2166136261; for (let k = 0; k < s.length; k++){ x ^= s.charCodeAt(k); x = Math.imul(x, 16777619); }
  return x >>> 0;
}
// a player's lasting opinion of a card: a standard normal draw fixed by (player seed, card name)
function misjudge(seed, name){
  let h = (seed ^ 2166136261) >>> 0;
  for (let k = 0; k < name.length; k++){ h ^= name.charCodeAt(k); h = Math.imul(h, 16777619); }
  const r = mulberry32(h >>> 0); return gauss(r);
}
function planShop(g, i, G, S){
  if (ENGINE_STATE.searchEvalCache.size > 4000) ENGINE_STATE.searchEvalCache.clear();
  const t0 = nowMs(), cache = ENGINE_STATE.searchEvalCache, stats = {evals:0, iters:0};
  const root = simClone(g); root.players[1 - i].genome = G;   // I model the opponent with my own judgment
  root._poSeed = shopSeed(g, i);   // every option (and every turn of this shop) is played out on the same imagined futures
  let opts = shopMoves(root, i, G, S.width, true), why = 'deepest search allowed', lastIter = 0, prevBest = null, stable = 0;
  for (let d = 1; d <= S.maxDepth; d++){
    const ti = nowMs();
    // a deeper step that runs past the time budget stops part-way: options it didn't reach keep their last value
    let cut = false;
    // early, wide steps play out each option a few times to drop the clear losers; from minDepth on, the full budget
    const Sd = S.po && d < S.minDepth ? {...S, po:Math.max(1, Math.ceil(S.po / 2))} : S;
    for (const o of opts){
      if (d > 1 && S.ms && nowMs() - t0 > S.ms){ cut = true; break; }
      const c = simClone(root); doMove(c, i, o); o.v = searchVal(c, i, G, Sd, d - 1, cache, stats);
    }
    opts.sort((a, b) => b.v - a.v); stats.iters = d; lastIter = nowMs() - ti;
    if (cut){ why = 'time budget'; break; }
    const top = opts[0], gap = opts.length > 1 ? top.v - opts[1].v : 1;
    if (prevBest === top) stable++; else stable = 0; prevBest = top;
    if (opts.length === 1){ why = 'only one sensible option'; break; }
    if (d >= S.minDepth && stable >= 1 && gap > S.settle){ why = 'best option stayed best and leads clearly'; break; }
    if (d >= S.minDepth && opts[opts.length - 1].v > top.v - 0.004){ why = 'remaining options are about equal'; break; }
    // racing: drop options that can't catch up (generous early, when the look-ahead is still shallow), keeping a few
    const keep = d === 1 ? 3 : 2, margin = S.drop * (d === 1 ? 3 : d === 2 ? 1.5 : 1);
    opts = opts.filter((x, k) => k < keep || x.v >= top.v - margin);
    // will the next, deeper step fit? each step costs roughly (inner) times the last
    if (stats.evals * (S.inner + 0.5) > S.evals){ why = 'work budget'; break; }
    if (S.ms && nowMs() - t0 + lastIter * (S.inner + 0.5) > S.ms){ why = 'time budget'; break; }
  }
  // Gut sense of each card: the search compares where each move leads, but a short look often can't tell moves
  // apart (a unit and a building can lead to the same position once the rest of the shop is played out). Then a
  // person goes by what the card itself is worth to them right now, so every level adds a small nudge for that.
  // Weaker levels lean on it more, and misjudge it: each player rates each card a bit too high or too low and keeps
  // that opinion all game. It's a matter of degree only, so a card that does nothing for them never looks good,
  // and a card they just bought doesn't suddenly look worth selling.
  {
    const me = g.players[i], mE = Math.min(1, expShops(g, i)), lam = 0.0005 + (S.blur || 0) * 0.08;
    if (S.blur && me._mj == null) me._mj = Math.floor(g.rnd() * 2147483647);
    const rate = o => { const raw = aiValue(g, i, o.name, o.kind); return S.blur ? raw * Math.exp(S.blur * 5 * misjudge(me._mj, o.name)) : raw; };
    for (const o of opts){
      if (!Number.isFinite(o.v)) continue;
      if (o.act === 'buy') o.v += lam * (rate(o) - o.price * G.m * mE);
      else if (o.act === 'sell') o.v -= lam * (rate(o) - SELL_PRICE * G.m * mE);
      else if (o.act === 'sellbuy') o.v += lam * (rate(o) - (o.price + SELL_PRICE) * G.m * mE) - lam * (rate({name:o.sn, kind:o.sk}) - SELL_PRICE * G.m * mE);
    }
    opts.sort((a, b) => b.v - a.v);
  }
  if (opts.length > 1 && opts[0].v < opts[1].v) opts.sort((a, b) => b.v - a.v);
  return {opts, stats:{...stats, ms:Math.round(nowMs() - t0)}, why};
}
// battle results as game values while choosing a Mobilize order: [player 0's {w,t,l}, player 1's]
function mobilizeValues(g, G, D){
  if (D && D.search && D.search.myopic){ const v = [0, 1].map(j => myopicValues(g, j, g.players[j].genome || G)); v.myopic = true; return v; }
  if (D && D.search && D.search.po){
    if (g._poSeed == null) g._poSeed = Math.floor(g.rnd() * 2147483647);
    try{ const v = [0, 1].map(j => outcomeValues(g, j, D.search.po, null)); v.po = D.search.po; return v; } finally { delete g._poSeed; }
  }
  return [0, 1].map(j => { const Gj = g.players[j].genome || G; return roundValues(g, j, Gj, logit(battleOdds(g, j))); });
}
/* ---------- Novice: plays like a new player ----------
   The lowest offered rung and the default opponent. Each decision it rolls how much care it takes:
   - shallow: the short-sighted search ('s1'), but it never sells or freezes and doesn't like passing
   - lazy: it compares only the 2-3 cards it happens to notice, by a quick card score
   - gut: it picks what looks good to a beginner (big power numbers, abilities, a higher price), not what is good
   It undervalues economy, rarely looks at the discard pile, and forgets miracles when it isn't thinking.
   Each game it also gets a mild personality, so its habits stay consistent within the game.
   Every number here can be changed in NOVICE. */
const NOVICE = {
  shop:{shallow:0.65, lazy:0.25, gut:0.10},   // how often each kind of shop decision happens
  mob:{shallow:0.3, strong:0.45, bought:0.25},   // Mobilize: think a little, strongest first, or the order it bought them
  notice:[2, 3],   // a lazy decision compares this many cards
  econ:0.04,   // shallow: win chance it ignores on economy cards (it undervalues them)
  passSlack:0.04,   // shallow: it buys the best card instead of passing if that's at most this much worse
  discard:0.2,   // chance it even considers a discard-pile card on a lazy or gut decision
};
const isEcon = (n, kind) => kind === 'b' && !BATTLE_BLDGS.has(n) && !(BDEFS[n] && BDEFS[n].gear) && n !== "Mason's Guild" || ECON_CARDS.has(n) || n === 'Conscripted Farmhand';
function novicePersona(g, i){
  const p = g.players[i];
  if (!p._nov){ const r = g.rnd; p._nov = {greed:0.5 + r(), flash:0.5 + r(), lazy:0.7 + 0.6 * r()}; }   // likes buying, likes flashy cards, how lazy
  return p._nov;
}
// how good a card looks to someone who just learned the game
function noviceAppeal(g, i, name, kind){
  const per = novicePersona(g, i);
  if (kind === 'u'){
    if (name === 'Recruit') return 0.8;
    const d = DEFS[name]; if (!d) return 0.5;
    const have = g.players[i].hand[name] || 0, pw = d.p[Math.min(have, d.p.length - 1)] || d.p[0];
    return 0.6 + 0.35 * pw + (d.t ? 0.6 * per.flash : 0) + 0.25 * (d.c || 0);
  }
  if (name === 'Field') return 0.5;
  const b = BDEFS[name]; if (!b) return 0.4;
  if (b.gear) return 1.1 + 0.4 * per.flash;
  if (BATTLE_BLDGS.has(name)) return 1.0;
  return 0.6;
}
function noviceBuy(g, i, o, depth){
  if (!buy(g, i, o.src, o.idx, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined)){ pass(g, i); return null; }
  if (o.src === 'mu' && cur(g) === i && g.phase === 'shop') return aiShopTurnSeen(g, i, depth);
  return o.name;
}
// a lazy or gut shop decision; returns undefined for a shallow one (the caller runs the short-sighted search)
function noviceShop(g, i, depth){
  const r = g.rnd(), per = novicePersona(g, i), W = NOVICE.shop;
  const lazyW = W.lazy * per.lazy, tot = W.shallow + lazyW + W.gut;
  const u = r * tot;
  if (u < W.shallow) return undefined;
  const mode = u < W.shallow + lazyW ? 'lazy' : 'gut';
  const opts = aiShopOptions(g, i).filter(o => (o.src !== 'mu' || g.rnd() < NOVICE.discard) && buyInfo(g, i, o.name, o.kind, o.src, o.idx).ok);
  if (g.rec) g._why = {level:'Novice', mode};
  if (!opts.length){ pass(g, i); return null; }
  if (mode === 'gut'){
    // a weighted pick by looks; it only passes now and then, more often when it isn't greedy
    if (g.rnd() < 0.12 / per.greed){ pass(g, i); return null; }
    const w = opts.map(o => Math.pow(noviceAppeal(g, i, o.name, o.kind), 2));
    let x = g.rnd() * w.reduce((a, b) => a + b, 0);
    for (let k = 0; k < opts.length; k++){ x -= w[k]; if (x <= 0){ if (g.rec) g._why.chose = opts[k].name; return noviceBuy(g, i, opts[k], depth); } }
    return noviceBuy(g, i, opts[opts.length - 1], depth);
  }
  // lazy: the first cards it notices (the display comes first, then the rest), judged by the quick card score
  const G = g.players[i].genome || baseGenome(), [a, b] = NOVICE.notice;
  const n = a + Math.floor(g.rnd() * (b - a + 1));
  const seen = shuffle(opts.slice(0, Math.max(n + 1, Math.ceil(opts.length / 2))), g.rnd).slice(0, n);
  let best = null;
  for (const o of seen){
    const price = buyInfo(g, i, o.name, o.kind, o.src, o.idx).price;
    const v = aiValue(g, i, o.name, o.kind) * (isEcon(o.name, o.kind) ? 0.5 : 1) - price * G.m * 0.5;
    if (!best || v > best.v) best = {o, v};
  }
  if (g.rec){ g._why.noticed = seen.map(o => o.name); g._why.chose = best && best.o.name; }
  if (best && best.v > -per.greed) return noviceBuy(g, i, best.o, depth);
  pass(g, i); return null;
}
// Mobilize: strongest first, or the order it bought them, now and then a short-sighted search
function noviceMobilize(g, i, K){
  const W = NOVICE.mob, u = g.rnd() * (W.shallow + W.strong + W.bought);
  if (u < W.shallow){ if (g.rec) g._mobLevel = 'Novice (thinking a little)'; return aiMobilizeAt(g, i, K, DEPTH.s1); }
  const p = g.players[i], a = buildArmy(p); if (!a.core.length && !a.recs) return [];
  let order = a.core.slice();   // buildArmy lists them strongest first
  if (u >= W.shallow + W.strong){
    const pos = n => { const k = (p.bought || []).indexOf(n); return k < 0 ? 999 : k; };
    order.sort((x, y) => pos(x.name) - pos(y.name));
    if (g.rec) g._mobLevel = 'Novice (order bought)';
  } else if (g.rec) g._mobLevel = 'Novice (strongest first)';
  const d = assemble(order, a.recs, a.arm, g.rnd() < 0.5, true, a.sh, a.gear);   // Might on the first unit; gear on its biggest units
  d._nov = true;
  return d;
}
function aiShopTurn(g, i, depth){ return asSeenBy(g, i, () => aiShopTurnSeen(g, i, depth)); }
function aiShopTurnSeen(g, i, depth){
  const rung = g._po ? null : rungFor(g, i);
  if (rung && rung.random){
    // random buyer: any affordable card, or pass, with equal chance
    const opts = aiShopOptions(g, i).filter(o => buyInfo(g, i, o.name, o.kind, o.src, o.idx).ok);
    const k = Math.floor(g.rnd() * (opts.length + 1));
    if (k < opts.length){ const o = opts[k]; buy(g, i, o.src, o.idx, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); if (o.src === 'mu' && cur(g) === i && g.phase === 'shop') return aiShopTurnSeen(g, i, depth); return o.name; }
    pass(g, i); return null;
  }
  const nov = !!(rung && rung.novice);
  if (nov){ const r = noviceShop(g, i, depth); if (r !== undefined) return r; }
  if (rung) depth = rungDepth(rung);
  const p = g.players[i], G = p.genome || baseGenome(), D = typeof depth === 'object' ? depth : (depth ? DEPTH.play : null);
  if (bVal(p, 'Black Market') && !g.bmUsed[i]) useBM(g, i, aiBMKind(g, i));
  // commitment test: this AI always takes the chosen card when it can, then shops normally
  if (p.force && !(p.forceOnce && (p.bought.includes(p.force) || (g.mirGot && g.mirGot[i].includes(p.force))))){
    const o = aiShopOptions(g, i).find(x => (x.name === p.force || (MIRS[p.force] && mirOf(g, x).includes(p.force))) && buyInfo(g, i, x.name, x.kind, x.src, x.idx).ok);
    if (o){ buy(g, i, o.src, o.idx, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return o.name; }
  }
  // Money only matters if there's a later shop to spend it in: near the end (2-2, say) a purchase is nearly free
  // and passing to save is pointless, so the price weight and the buy-or-pass bar fade with the shops likely left.
  const mE = Math.min(1, expShops(g, i));
  const TH = G.thresh * mE;
  aiUseMiracles(g, i, G, mE, TH);
  const cands = [];
  for (const o of aiShopOptions(g, i)){
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx); if (!info.ok) continue;
    const c0 = {...o, price:info.price, v:aiValue(g, i, o.name, o.kind) - info.price * G.m * mE + mirValue(g, i, mirOf(g, o), G, mE, pairOf(g, o), o.kind)};
    // Discard patience: a discard-pile copy the opponent can't take (they own none) will still be there next shop, so it's
    // worth a little less than a display card that may be gone; fades out when few shops are left
    if (o.src === 'mu' && !(ownsCard(g.players[1-i], o.name) > 0)) c0.v -= (G.mpat ?? 0.5) * mE;
    cands.push(c0);
  }
  if (D && D.search){
    const R = planShop(g, i, G, D.search);
    if (nov){
      // a new player doesn't sell or freeze, undervalues economy, and would rather buy something than pass
      R.opts = R.opts.filter(o => o.act === 'buy' || o.act === 'pass').map(o => o.act === 'buy' && isEcon(o.name, o.kind || cardKind(o.name)) ? {...o, v:(o.v ?? 0) - NOVICE.econ} : o).sort((a, b) => (b.v ?? 0) - (a.v ?? 0));
      if (!R.opts.length) R.opts = [{act:'pass', v:0}];
      if (R.opts[0].act === 'pass'){ const b = R.opts.find(o => o.act === 'buy'); if (b && (b.v ?? 0) >= (R.opts[0].v ?? 0) - NOVICE.passSlack) R.opts = [b].concat(R.opts.filter(o => o !== b)); }
    }
    let pick = R.opts[0];
    if (rung && rung.sharp < 1) pick = softPick(R.opts.map(o => ({o, s:o.v ?? 0})), rung.sharp, 0.08, g.rnd).o;
    if (g.rec) g._why = {level:rung ? rung.label : 'full search', search:{steps:R.stats.iters, positionsJudged:R.stats.evals, ms:R.stats.ms, stopped:R.why},
      options:R.opts.slice(0, 8).map(o => ({move:o.act === 'pass' ? 'pass' : o.act === 'sell' ? 'sell ' + o.name : o.act === 'sellbuy' ? `sell ${o.sn} to buy ${o.name}` : o.name + (o.src === 'mu' ? ' (Discard)' : o.src === 'bm' ? ' (Black Market)' : o.src === 'vis' ? ' (Vision)' : ''), price:o.price, winChance:+(o.v ?? 0).toFixed(3)})),
      chose:pick.act === 'pass' ? 'pass' : pick.act === 'sell' ? 'sell ' + pick.name : pick.act === 'sellbuy' ? `sell ${pick.sn} to buy ${pick.name}` : pick.name};
    if (pick.act === 'sell' && sell(g, i, pick.kind, pick.name)) return aiShopTurnSeen(g, i, depth);   // a sale is free: then shop on
    if (pick.act === 'sellbuy' && sell(g, i, pick.sk, pick.sn)){
      if (buy(g, i, pick.src, pick.idx, pick.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined)) return pick.name;
      return aiShopTurnSeen(g, i, depth);   // shouldn't happen; shop on with the money
    }
    if (pick.act === 'buy' && buy(g, i, pick.src, pick.idx, pick.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined)) return pick.name;
    if (pick.act === 'freeze' && useFreeze(g, i, pick.src, pick.idx)) return 'freeze ' + pick.name;
    pass(g, i); return null;
  }
  let target = aiSaveTarget(g, i, G, mE);
  let deepCtx = null;
  if (D && (cands.length || target)){
    const opp = g.players[1-i], deny = G.deny ?? 0.3;
    let read = G.read ?? 0.4;
    g._qsD = D;
    // My side: does this card help me beat the army they'll have at the battle? That's the army they have now plus
    // what I expect them to buy with the rest of this shop.
    const fut = predictOppBuys(g, i, G, null);
    const view0 = oppView(g, i, D, fut && fut.fake), {guesses, oppCfg} = view0;
    let pred = view0.pred;
    ({pred, read} = omPick(g, i, G, D, guesses, pred));
    const base = quickStrength(g, i, {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}, guesses, oppCfg, pred, read);
    deepCtx = {guesses, oppCfg, pred, read, base, fut};
    // a card I'd take that they were going to buy changes what they end up with: re-predict their buys without it
    const inFut = c => !!fut && (c.src === 'du' || c.src === 'db') && fut.picks.some(k => k.src === c.src && k.idx === c.idx);
    // This round's battle already won against every army they could field? Then buying more strength only helps
    // in later battles: count that share of a unit's value, and let economy compete for the rest.
    if (base >= 0.95){
      const E = expShops(g, i), later = E / (1 + E);
      for (const c of cands) if (c.kind === 'u' || BATTLE_BLDGS.has(c.name)){ const raw = c.v + c.price * G.m * mE; c.v = raw * later - c.price * G.m * mE; }
    }
    // Their side: how much would this card help them against me? (denial)
    const myGuesses = oppGuessSet(g, 1 - i, D.shopGuesses), myCfgPub = battleCfgOf(p);
    const theirBase = deny > 0 ? quickStrength(g, 1 - i, {hand:{...opp.hand}, city:{...opp.city}, gear:{...(opp.gear || {})}}, myGuesses, myCfgPub, null, 0) : 0;
    let relevant = cands.filter(c => c.kind === 'u' || BATTLE_BLDGS.has(c.name) || c.name === "Mason's Guild")
                          .sort((a, b) => b.v - a.v).slice(0, D.shopCands);
    // battle buildings always get the battle test: their flat score says nothing about my army, so it shouldn't filter them out
    for (const c of cands) if (c.kind === 'b' && BATTLE_BLDGS.has(c.name) && !relevant.includes(c)) relevant.push(c);
    for (const c of relevant){
      const mine = withCard(p, c, c.name === "Mason's Guild" ? aiMasonTarget(g, i) : null);
      if (mine){
        if (inFut(c)){
          const f2 = predictOppBuys(g, i, G, {src:c.src, idx:c.idx}), v2 = oppView(g, i, D, f2 ? f2.fake : null), o2 = omPick(g, i, G, D, v2.guesses, v2.pred);
          c.delta = quickStrength(g, i, mine, v2.guesses, v2.oppCfg, o2.pred, o2.read, c.kind === 'u' ? c.name : null) - base;
          c.denied = true;   // taking it from them is already in this number
        } else c.delta = quickStrength(g, i, mine, guesses, oppCfg, pred, read, c.kind === 'u' ? c.name : null) - base;
        // Study lasts all game: also test it on the army I'm likely to have soon (today's army plus the two units I'd most
        // likely buy from this display), weighted by how many shops are likely left to grow into it
        if (c.name === 'Study'){
          const soon = cands.filter(x => x.kind === 'u' && x.name !== 'Recruit').sort((a, b) => b.v - a.v).slice(0, 2);
          if (soon.length){
            const later = {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}; for (const x of soon) later.hand[x.name] = (later.hand[x.name] || 0) + 1;
            const laterS = {hand:later.hand, gear:later.gear, city:{...later.city, Study:(later.city.Study || 0) + 1}};
            const d2 = quickStrength(g, i, laterS, guesses, oppCfg, pred, read) - quickStrength(g, i, later, guesses, oppCfg, pred, read);
            c.delta = Math.max(c.delta, d2 * Math.min(1, expShops(g, i) / 2));
          }
        }
        c.v += 8 * G.s * c.delta;
      }
      // denial: any display card, and a discard-pile card the opponent owns a copy of (only they could muster it)
      if (deny > 0 && !c.denied && (c.src === 'du' || c.src === 'db' || (c.src === 'mu' && ownsCard(opp, c.name) > 0))){
        const ok = c.name !== "Mason's Guild" && !cantAcquire(opp, c.name, c.kind);
        const theirs = ok ? withCard(opp, c, null) : null;
        if (theirs){ c.denial = quickStrength(g, 1 - i, theirs, myGuesses, myCfgPub, null, 0, c.kind === 'u' ? c.name : null) - theirBase; c.v += 8 * G.s * deny * Math.max(0, c.denial); }
      }
    }
  }
  // match recorder: what this decision looked like to the AI (only when a game is being recorded)
  if (g.rec) g._why = {level:rung ? rung.label : (D ? 'full search' : 'quick'), bar:+TH.toFixed(2),
    winOddsNow:deepCtx ? +deepCtx.base.toFixed(3) : undefined,
    expectsOppToBuy:deepCtx && deepCtx.fut ? deepCtx.fut.picks.map(k => k.name) : undefined,
    savingFor:target ? target.name : undefined,
    top:cands.slice().sort((a, b) => b.v - a.v).slice(0, 8).map(c => ({card:c.name, price:c.price, score:+c.v.toFixed(2),
      battleGain:c.delta != null ? +c.delta.toFixed(3) : undefined, helpsOpp:c.denial != null ? +c.denial.toFixed(3) : undefined, takesFromOpp:c.denied || undefined}))};
  let best = null;
  for (const c of cands) if (!best || c.v > best.v) best = c;
  if (rung && rung.sharp < 1 && best && best.v > TH)
    best = softPick(cands.filter(c => c.v > TH).sort((a, b) => b.v - a.v).slice(0, 4).map(c => ({c, s:c.v})), rung.sharp, 4, g.rnd).c;
  // Selling: would selling one card (for $1, or to free a city slot) let me buy something worth more than my best plain buy?
  const sp = g._po ? null : aiSellPlan(g, i, G, mE, deepCtx, best && best.v > TH ? best.v : TH);
  if (sp && g._why) g._why.plan = `sell ${sp.s.name} to buy ${sp.o.name}`;
  if (sp){
    sell(g, i, sp.s.kind, sp.s.name);
    if (buyInfo(g, i, sp.o.name, sp.o.kind, sp.o.src, sp.o.idx).ok){ buy(g, i, sp.o.src, sp.o.idx, sp.o.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return sp.o.name; }
    return aiShopTurn(g, i, depth);   // shouldn't happen; shop again with the new money
  }
  // Saving up: a card in the display that I can't afford yet will still be there next round (unless the opponent takes it).
  // Compare "buy the best card now" with "buy only what still leaves enough for it next round, then buy it".
  // If I expect the opponent to buy it this shop, there's nothing to save for.
  const fut0 = deepCtx && deepCtx.fut;
  if (target && fut0 && fut0.picks.some(k => k.name === target.name)) target = null;
  if (target && best && best.v > TH){
    if (deepCtx && (target.kind === 'u' || BATTLE_BLDGS.has(target.name))){
      const mine = withCard(p, target, null);
      if (mine) target.v += 8 * G.s * (quickStrength(g, i, mine, deepCtx.guesses, deepCtx.oppCfg, deepCtx.pred, deepCtx.read, target.kind === 'u' ? target.name : null) - deepCtx.base);
    }
    const later = (G.save ?? 0.3) * target.v, inc = Math.max(0, income(p));
    const keeps = c => p.money - c.price + inc >= target.cost;
    if (!keeps(best)){
      let nb = null; for (const c of cands) if (keeps(c) && (!nb || c.v > nb.v)) nb = c;
      const nbv = nb && nb.v > TH ? nb.v : 0;
      if (later + nbv > best.v){
        if (g._why) g._why.plan = `save for ${target.name} instead of buying ${best.name}`;
        if (nb && nb.v > TH){ buy(g, i, nb.src, nb.idx, nb.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return nb.name; }
        pass(g, i); return null;
      }
    }
  }
  if (best && best.v > TH){ buy(g, i, best.src, best.idx, best.name === "Mason's Guild" ? aiMasonTarget(g, i) : undefined); return best.name; }
  pass(g, i); return null;
}
// Hand miracles on a shop turn. Vision: when it still has a buy and money to use it, at whichever deck it expects
// more from. Divine Favor: once its normal buys are gone, if the favour would buy something clearly worth it.
function aiUseMiracles(g, i, G, mE, TH){
  const p = g.players[i], b = g.buys[i], mir = p.mir || [];
  if (!mir.length || g.passed[i]) return;
  if (!p.discArm && mirDisc(p)) useDisc(g, i, true);
  if (!g._po && mir.includes('Vision') && !peekOf(g, i, 'vis') && p.money >= 1 && baseLeft(b) > 0){
    const gu = g.uDeck.some(n => !isMir(n)) ? bmPeekGain(g, i, MIRS.Vision.vis, 'u') : -1;
    const gb = g.bDeck.some(n => !isMir(n)) ? bmPeekGain(g, i, MIRS.Vision.vis, 'b') : -1;
    if (Math.max(gu, gb) > 0.3) useVision(g, i, gb > gu ? 'b' : 'u');
  }
  // Upheaval: when a fresh display is expected to beat this one by more than holding the miracle is worth
  if (!g._po && p.mir.some(n => MIRS[n] && MIRS[n].rdl) && baseLeft(b) > 0 && p.money >= 1 && aiRedealGain(g, i, G, mE) > 0.5 * G.m * Math.max(0.5, mE)) useRedeal(g, i);
  if (p.mir.includes('Divine Favor') && !b.fav && baseLeft(b) <= 0 && p.money >= 1){
    b.fav = 1; let worth = false;
    for (const o of aiShopOptions(g, i)){
      const inf = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
      if (inf.ok && inf.slot === 'fav' && aiValue(g, i, o.name, o.kind) - inf.price * G.m * mE + mirValue(g, i, mirOf(g, o), G, mE, pairOf(g, o), o.kind) > TH + 1){ worth = true; break; }
    }
    b.fav = 0;
    if (worth) useFavor(g, i);
  }
}
// Sell-to-buy: for the best few cards I can't buy right now only because I'm $1 short or my city is full, try
// selling each of my weakest cards. A plan counts the card I'd get (plus how it changes my battles), the $1 back,
// and what I lose by selling (its value to me, plus how much weaker my army gets). Up to 2 sales per shop.
function aiSellPlan(g, i, G, mE, deepCtx, bar){
  const p = g.players[i];
  if (g.sold && g.sold[i] && g.sold[i].length >= 2) return null;
  const blocked = [];
  for (const o of aiShopOptions(g, i)){
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
    if (info.ok) continue;
    if (info.why === 'City is full' || (info.price != null && info.price - p.money <= SELL_PRICE)) blocked.push(o);
  }
  if (!blocked.length) return null;
  const sellables = [];
  for (const n in p.hand) if (aiCanSell(g, i, 'u', n)) sellables.push({kind:'u', name:n});
  for (const n in p.city) if (aiCanSell(g, i, 'b', n)) sellables.push({kind:'b', name:n});
  for (const n in (p.gear || {})) if (aiCanSell(g, i, 'b', n)) sellables.push({kind:'b', name:n});
  if (!sellables.length) return null;
  // apply / undo a sale on the player only (no deck, log or money bookkeeping beyond the sale price)
  const sp = SELL_PRICE + bVal(p, 'The Bazaar');
  const tbl = s => s.kind === 'u' ? p.hand : isGear(s.name) ? p.gear : p.city;
  const strip = s => { const t = tbl(s); if (!--t[s.name]) delete t[s.name]; p.money += sp; };
  const unstrip = s => { const t = tbl(s); t[s.name] = (t[s.name] || 0) + 1; p.money -= sp; };
  const clean = o => { const h = {}, c = {}, gr = {}; for (const k in o.hand) if (o.hand[k]) h[k] = o.hand[k]; for (const k in o.city) if (o.city[k]) c[k] = o.city[k]; for (const k in (o.gear || {})) if (o.gear[k]) gr[k] = o.gear[k]; return {hand:h, city:c, gear:gr}; };
  const battle = c => c.kind === 'u' || BATTLE_BLDGS.has(c.name);
  const str = (st, must) => deepCtx ? quickStrength(g, i, st, deepCtx.guesses, deepCtx.oppCfg, deepCtx.pred, deepCtx.read, must) : 0;
  // what each sale costs me, cheapest first
  for (const s of sellables){
    strip(s);
    s.loss = aiValue(g, i, s.name, s.kind) - SELL_PRICE * G.m * mE;
    if (deepCtx && battle(s)) s.loss += 8 * G.s * Math.max(0, deepCtx.base - str(clean(p)));
    unstrip(s);
  }
  sellables.sort((a, b) => a.loss - b.loss);
  const tryS = sellables.slice(0, 4);
  const opts = blocked.map(o => ({...o, raw:aiValue(g, i, o.name, o.kind)})).sort((a, b) => b.raw - a.raw).slice(0, 3);
  let plan = null, top = bar + 0.5 * G.m;   // a sale has to beat the plain choice by a little, so it isn't done on a whim
  for (const o of opts) for (const s of tryS){
    if (o.kind === s.kind && o.name === s.name) continue;
    strip(s);
    const info = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
    if (info.ok){
      let v = aiValue(g, i, o.name, o.kind) - info.price * G.m * mE - s.loss;
      if (deepCtx && battle(o)){
        const now = clean(p), withO = withCard(now, o, o.name === "Mason's Guild" ? aiMasonTarget(g, i) : null);
        if (withO) v += 8 * G.s * (str(withO, o.kind === 'u' ? o.name : null) - str(now));
      }
      if (v > top){ top = v; plan = {s, o}; }
    }
    unstrip(s);
  }
  return plan;
}
// The best card in the display I can't afford now but could next round (cards bought this round stay one more round).
function aiSaveTarget(g, i, G, mE){
  if ((mE != null ? mE < 0.8 : roundsLeft(g) <= 1.2) || (G.save ?? 0.3) <= 0) return null;
  const p = g.players[i], next = p.money + Math.max(0, income(p));
  let t = null;
  for (const [src, arr, kind] of [['du', g.disp.u, 'u'], ['db', g.disp.b, 'b']]) arr.forEach((c, idx) => {
    if (c.side || c.name === "Mason's Guild") return;            // leaving the shop after this round
    const info = buyInfo(g, i, c.name, kind, src, idx);
    if (info.ok || !/^Needs/.test(info.why || '')) return;     // affordable now, or blocked for another reason
    const cost = (kind === 'u' ? DEFS : BDEFS)[c.name].c + mirSur(c.mir);
    if (cost > next) return;
    const v = aiValue(g, i, c.name, kind) - (cost + pairCost(c.pair, kind)) * G.m + mirValue(g, i, c.mir, G, 1, c.pair, kind);
    if (v > 0 && (!t || v > t.v)) t = {name:c.name, kind, cost, v, src, idx};
  });
  return t;
}
// Different choices of which units to field and where Study's Training goes
function armyVariants(p){
  const cap = deckCap(p);
  const all = Object.keys(p.hand).filter(n => n !== 'Recruit').map(n => ({name:n, copies:p.hand[n], arm:0, sh:0, tr:0}));
  const ex = all.filter(u => exemptUnit(u.name)), reg = all.filter(u => !exemptUnit(u.name));
  const st = u => strengthU(u.name, Math.min(u.copies, uMax(u.name)));
  reg.sort((a, b) => st(b) - st(a));
  const subsets = [reg.slice(0, cap)];
  if (reg.length > cap){
    const inn = reg.slice(0, cap), outs = reg.slice(cap);
    for (const o of outs) for (let j = inn.length - 1; j >= 0; j--){ const s2 = inn.slice(); s2[j] = o; subsets.push(s2); }
  }
  const recs = recAllow(p), arm = armAllow(p), study = trAllow(p), sh = shAllow(p), gear = gearList(p);
  const variants = [];
  for (const sub of subsets.slice(0, 12)){
    const core = sub.concat(ex).map(u => ({...u}));
    const targets = study ? core.filter(u => u.copies < uMax(u.name)) : [];
    if (!targets.length){ variants.push({core, recs, arm, sh, gear}); continue; }
    for (const t of targets.slice(0, 5)){
      const c2 = core.map(u => ({...u})), tt = c2.find(u => u.name === t.name);
      let left = study;
      while (left > 0 && tt.copies + tt.tr < uMax(tt.name)){ tt.tr++; left--; }
      while (left-- > 0){ const o = c2.find(u => u.copies + u.tr < uMax(u.name)); if (o) o.tr++; }
      variants.push({core:c2, recs, arm, sh, gear});
    }
  }
  return variants;
}
/* ---------- Mixed mobilize ----------
   Mobilize is a secret, simultaneous choice, so always fielding the single "best" order lets an opponent who learns
   the AI's habits counter it every time. Instead the AI keeps its top few orders, takes the opponent's top few
   orders (from the same search it runs to predict them) plus its other guesses, scores every pairing with the battle
   sim, and solves that small zero-sum grid by regret matching for an unexploitable mix. It then trusts its read of
   the opponent as before: with probability `read` it plays its single best counter, otherwise it draws from the mix.
   D.mix = how many orders per side go in the grid; G.mix = 0 turns it off for that AI. */
function mobilizeMix(A, iters){
  const R = A.length, C = A[0].length, rr = new Array(R).fill(0), rc = new Array(C).fill(0);
  const sx = new Array(R).fill(0), sy = new Array(C).fill(0);
  const norm = r => { const pos = r.map(v => Math.max(0, v)), t = pos.reduce((a, b) => a + b, 0); return t > 0 ? pos.map(v => v / t) : r.map(() => 1 / r.length); };
  for (let t = 1; t <= iters; t++){
    const x = norm(rr), y = norm(rc);
    const ur = A.map(row => row.reduce((a, v, c) => a + v * y[c], 0));            // my payoff for each row against their mix
    const uc = Array.from({length:C}, (_, c) => A.reduce((a, row, r) => a + row[c] * x[r], 0));   // my payoff for each column against my mix
    const v = ur.reduce((a, u, r) => a + u * x[r], 0);
    // regret matching+ (regrets floored at 0), later iterations weighted more
    for (let r = 0; r < R; r++){ rr[r] = Math.max(0, rr[r] + ur[r] - v); sx[r] += t * x[r]; }
    for (let c = 0; c < C; c++){ rc[c] = Math.max(0, rc[c] + v - uc[c]); sy[c] += t * y[c]; }
  }
  const tx = sx.reduce((a, b) => a + b, 0), ty = sy.reduce((a, b) => a + b, 0);
  return {x:sx.map(v => v / tx), y:sy.map(v => v / ty)};
}
const deckKey = d => d.map(u => u.name + (u.copies > 1 ? '*' + u.copies : '') + (u.arm ? 'a' : '') + (u.sh ? 's' : '') + (u.tr ? 't' + u.tr : '')).join('|');
// Mobilize scores each battle result by the chance of winning the game after it (a tie can be worth a lot when
// ahead, or little when a win is needed), instead of counting a tie as half a win.
function deepMobilize(g, i, D){
  if (ENGINE_STATE.battleVM || !D.search) return deepMobilize0(g, i, D);
  ENGINE_STATE.battleVM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
  try{ return deepMobilize0(g, i, D); } finally { ENGINE_STATE.battleVM = null; }
}
function deepMobilize0(g, i, D){
  const r = mobilizeSearch(g, i, D, D.mix && (g.players[i].genome || {}).mix !== 0 ? D.mix : 1);
  if (!r) return [];
  const {cands, ctx} = r;
  const note = (pick, how, x) => {
    if (!g.rec) return pick;
    const dk = d => d.map(u => u.name + (u.copies > 1 ? ' x' + u.copies : '') + (u.arm ? ' +arm' + u.arm : '') + (u.tr ? ' +train' + u.tr : '')).join(', ');
    g._mobWhy = g._mobWhy || [null, null];
    g._mobWhy[i] = {how, trustInRead:+ctx.read.toFixed(2), predictedOpp:ctx.oppCands.length ? dk(ctx.oppCands[0]) : null,
      oppAlternatives:ctx.oppCands.slice(1).map(dk), guessesAtOpp:ctx.guesses.length,
      top:cands.map((c, k) => ({order:dk(c.d), score:+c.s.toFixed(3), mixWeight:x ? +x[k].toFixed(2) : undefined}))};
    return pick;
  };
  if (cands.length > 1 && D.search && D.search.blur){   // a weaker level misjudges close orders
    let best = null, bs = -Infinity;
    for (const c of cands){ const s = c.s + D.search.blur * gauss(g.rnd); if (s > bs){ bs = s; best = c; } }
    return note(best.d, 'best order as it judged it (blurred)');
  }
  if (cands.length < 2 || !ctx.oppCands.length) return note(cands[0].d, 'best order (no mix)');
  const cols = [], seen = new Set();
  for (const d of ctx.oppCands.concat(ctx.guesses)){ const k = deckKey(d); if (!seen.has(k)){ seen.add(k); cols.push(d); } }
  const A = cands.map(c => cols.map(od => battleScore(c.d, od, i, ctx.myCfg, ctx.oppCfg)));
  const {x} = mobilizeMix(A, 400);
  const keep = x.map(v => v >= 0.04 ? v : 0), tot = keep.reduce((a, b) => a + b, 0);
  g.mixInfo = g.mixInfo || [null, null];
  g.mixInfo[i] = {n:keep.filter(v => v > 0).length, top:+(keep[0] / tot).toFixed(2), read:+ctx.read.toFixed(2)};
  if (g.rnd() < ctx.read) return note(cands[0].d, 'trusted its read: best counter to the predicted order', x);
  let u = g.rnd() * tot;
  for (let k = 0; k < cands.length; k++){ u -= keep[k]; if (u <= 0 && keep[k] > 0) return note(cands[k].d, `drew order #${k + 1} from its mix`, x); }
  return note(cands[0].d, 'drew order #1 from its mix', x);
}
// The mobilize search: returns the K best distinct decks found ({d, s}, best first) and what it decided with.
function mobilizeSearch(g, i, D, K){
  const p = g.players[i], opp = g.players[1-i], G = p.genome || baseGenome(), read = G.read ?? 0.4;
  const vars = armyVariants(p);
  if (!vars.length || (!vars[0].core.length && !vars[0].recs)) return null;
  const guesses = oppGuessSet(g, i, D.guesses), myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  // Predict their order with a lighter copy of the same search they'll run (thinking through units, Training and
  // order against my likely orders), rather than a handful of random shuffles.
  // When mixing, keep their top K orders too: they are the columns of the grid.
  let pred = null, oppCands = [];
  if (!D.predictDeep) pred = predictOpp(g, i, D.predictK);
  else { const o = mobilizeSearch(g, 1 - i, D.predictDeep, K); oppCands = o ? o.cands.map(c => c.d) : []; pred = o ? o.cands[0].d : []; }
  if (!oppCands.length && pred && pred.length) oppCands = [pred];
  if (D.predictDeep){   // remember these guesses to check against what they actually field
    g.omPending = g.omPending || [null, null];
    g.omPending[i] = {pred:omSeq(pred), strong:omSeq(guesses[0]), [opp.prevDeck ? 'last' : 'weak']:omSeq(guesses[1])};
  }
  const om = omPick(g, i, G, D, guesses, pred);
  const sc = d => scoreDeck(d, i, myCfg, oppCfg, guesses, om.pred, om.read);
  // Stage A: rough test of each unit selection / Training choice
  const top = vars.map(v => {
    let best = -Infinity;
    for (let k = 0; k < D.stageA; k++){
      const perm = k === 0 ? v.core.slice() : shuffle(v.core.slice(), g.rnd);
      const s2 = sc(assemble(perm, v.recs, v.arm, g.rnd() < 0.5, g.rnd() < 0.5, v.sh, v.gear));
      if (s2 > best) best = s2;
    }
    return {v, s:best};
  }).sort((a, b) => b.s - a.s).slice(0, D.top);
  // Stage B: every order (or a large sample) of the best selections; keep the K best distinct decks
  // (ties keep the one found first, so K = 1 picks exactly what a plain best-so-far search would)
  const cands = [], keys = new Set();
  for (const {v} of top){
    const perms = (D.perms === 'all' && v.core.length <= 5) ? permutations(v.core)
      : [v.core.slice()].concat(Array.from({length: D.perms === 'all' ? 120 : D.perms}, () => shuffle(v.core.slice(), g.rnd)));
    for (const perm of perms) for (const rf of (v.recs ? [true,false] : [true])) for (const af of (v.arm ? [true,false] : [false])){
      const d = assemble(perm, v.recs, v.arm, rf, af, v.sh, v.gear);
      const s2 = sc(d);
      if (cands.length >= K && s2 <= cands[cands.length - 1].s) continue;
      const key = K > 1 ? deckKey(d) : '';
      if (K > 1 && keys.has(key)) continue;
      let at = cands.length; while (at > 0 && s2 > cands[at - 1].s) at--;
      cands.splice(at, 0, {d, s:s2, key}); keys.add(key);
      if (cands.length > K) keys.delete(cands.pop().key);
    }
  }
  if (!cands.length) return null;
  return {cands, ctx:{guesses, oppCands, myCfg, oppCfg, read:om.read}};
}
// depth: undefined/false = fast, true = play, or a DEPTH preset object
function aiMobilize(g, i, K, depth){ return asSeenBy(g, i, () => { const d = aiMobilizeSeen(g, i, K, depth); const r = g._po ? null : rungFor(g, i); return aiPlaceSpells(g, i, (r && r.random) || (d && d._nov) ? d : tuneGear(g, i, d)); }); }
/* Battle miracles: once the AI has its units' order, it tries each spell in hand at every spot in that order (best
   spells first) and keeps a spot only when the gain in this battle's win chance, times how much this battle decides the
   game, beats G.mu, the same bar as for the Mobilize miracles, since a spell is used up either way. The opponent's
   battle miracles in hand are assumed to wait right behind their Vanguard. The random level places them at random. */
function aiPlaceSpells(g, i, deck){
  const p = g.players[i], hand = (p.mir || []).filter(isBat);
  if (!deck || !g.battleMir || !hand.length) return deck;
  const units = deck.filter(u => !isBat(u.name)); if (!units.length) return units;
  const rung = g._po ? null : rungFor(g, i);
  if (rung && rung.random) return withSpells(units, hand.filter(() => g.rnd() < 0.5).map(n => ({name:n, at:Math.floor(g.rnd() * (units.length + 1))})));
  if (deck._nov) return withSpells(units, hand.filter(() => g.rnd() < 0.6).map(n => ({name:n, at:Math.min(units.length, Math.floor(g.rnd() * 2))})));   // Novice: plays some spells early
  const opp = g.players[1-i], guesses = oppGuessSet(g, i, 6).filter(d => d.length);   // its reads plus a few shuffles
  if (!guesses.length) return units;
  const oppSp = (opp.mir || []).filter(isBat).map(n => ({name:n, at:1}));
  const myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  const ev = sp => { let s = 0;
    for (const gd of guesses){ const cfgs = [{...myCfg, units, spells:sp}, {...oppCfg, units:gd, spells:oppSp}]; if (i === 1) cfgs.reverse();
      const r = runBattle(cfgs, false); s += scoreFor(r.result.w, i) + 0.02 * (r.left[i] - r.left[1-i]); }
    return s / guesses.length; };
  const G = p.genome || baseGenome(), stakes = battleStakes(g, i), bar = G.mu ?? 0.06;
  const sp = []; let now = ev(sp);
  for (const n of hand.slice().sort((a, b) => (MIRS[b].bv || 0) - (MIRS[a].bv || 0))){
    let best = null;
    for (let at = 0; at <= units.length; at++){ const v = ev(sp.concat([{name:n, at}])); if (!best || v > best.v) best = {at, v}; }
    if (best && (best.v - now) * stakes > bar){ sp.push({name:n, at:best.at}); now = best.v; }
  }
  if (sp.length && g.rec) (g.mirDecide = g.mirDecide || []).push({i, round:g.round, spells:sp.map(x => `${x.name}@${x.at}`)});
  return withSpells(units, sp);
}
// a deck list with spells put back between the units ({name, at}: at = units ahead of it)
function withSpells(units, sp){
  const out = [];
  units.forEach((u, k) => { for (const x of sp) if (x.at === k) out.push({name:x.name}); out.push(u); });
  for (const x of sp) if (x.at >= units.length) out.push({name:x.name});
  return out;
}
// the AI's best few distinct orders, best first (the same searches as aiMobilizeAt)
// A looser level's choice: usually its best, sometimes a worse option, with mistakes that cost little far more likely
// than ones that cost a lot (chance shrinks with the gap to the best: exp(-gap / T), T = (1 - sharp) * scale).
function softPick(list, sharp, scale, rnd){
  if (!list.length || sharp >= 1) return list[0];
  const T = Math.max(1e-6, (1 - sharp) * scale), b = list[0].s;
  const w = list.map(x => Math.exp(-(b - x.s) / T)), tot = w.reduce((a, c) => a + c, 0);
  let u = rnd() * tot; for (let k = 0; k < list.length; k++){ u -= w[k]; if (u <= 0) return list[k]; }
  return list[0];
}
function rankedMobilize(g, i, K, D){
  if (D){
    const own = !ENGINE_STATE.battleVM && D.search;
    if (own) ENGINE_STATE.battleVM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
    try{ const r = mobilizeSearch(g, i, D, 4); return r ? r.cands.map(c => ({deck:c.d, s:c.s})) : []; } finally { if (own) ENGINE_STATE.battleVM = null; }
  }
  const p = g.players[i], a = buildArmy(p);
  if (!a.core.length && !a.recs) return [];
  const perms = [a.core.slice(), a.core.slice().reverse()];
  for (let k = 0; k < K; k++) perms.push(shuffle(a.core.slice(), g.rnd));
  const guesses = oppGuesses(g, i), oppCfg = battleCfgOf(g.players[1-i]), myCfg = battleCfgOf(p), seen = new Map();
  for (const perm of perms) for (const recFront of (a.recs ? [true,false] : [true])) for (const armFirst of (a.arm ? [true,false] : [false])){
    const deck = assemble(perm, a.recs, a.arm, recFront, armFirst, a.sh, a.gear), key = deckKey(deck);
    if (!seen.has(key)) seen.set(key, {deck, s:scoreDeck(deck, i, myCfg, oppCfg, guesses)});
  }
  return [...seen.values()].sort((x, y) => y.s - x.s).slice(0, 4);
}
function aiMobilizeSeen(g, i, K, depth){
  const rung = g._po ? null : rungFor(g, i);
  if (rung){
    if (rung.random){
      const a = buildArmy(g.players[i]); if (!a.core.length && !a.recs) return [];
      return assemble(shuffle(a.core.slice(), g.rnd), a.recs, a.arm, g.rnd() < 0.5, g.rnd() < 0.5, a.sh, a.gear);
    }
    if (rung.novice) return noviceMobilize(g, i, K);
    if (g.rec) g._mobLevel = rung.label;
    // a looser level sometimes fields its 2nd or 3rd best order (a misjudgment, not a random blunder)
    if (rung.sharp < 1){ const list = rankedMobilize(g, i, K, rungDepth(rung)); if (list.length) return softPick(list, rung.sharp, 0.25, g.rnd).deck; }
    return aiMobilizeAt(g, i, K, rungDepth(rung));
  }
  return aiMobilizeAt(g, i, K, depth);
}
// Recruit and Armament miracles are single use, so the AI holds them unless spending them now is worth it: it plans
// its best army with and without them, test-battles both against its guesses at the opponent, and spends them only
// when the gain in this battle's win chance, times how much this battle decides the game, beats G.mu (learned in
// training). So it saves them for battles it would otherwise lose and that matter: a match point, a must-win.
function battleStakes(g, i){
  if (ENGINE_STATE.battleVM && ENGINE_STATE.battleVM[i]) return Math.max(0, ENGINE_STATE.battleVM[i].w - ENGINE_STATE.battleVM[i].l);   // played out
  const p = g.players[i], o = g.players[1-i], q = battleOdds(g, i), cath = !!p.city.Cathedral;
  return Math.max(0, gameWinChance(p.score + 1, total(o), cath, q, g.target) - gameWinChance(p.score, total(o) + 1, cath, q, g.target));
}
function mobilizeWithMiracles(g, i, plan){
  const p = g.players[i];
  if (!mirHeld(p, 'rec') && !mirHeld(p, 'arm') && !mirHeld(p, 'tr')) return plan();
  p._noMir = true; let without; try{ without = plan(); } finally { delete p._noMir; }
  const withM = plan();
  if (!withM || !withM.length) return without;
  if (!without || !without.length) return withM;
  const G = p.genome || baseGenome(), opp = g.players[1-i];
  const guesses = oppGuesses(g, i), myCfg = battleCfgOf(p), oppCfg = battleCfgOf(opp);
  if (!guesses.length) return without;
  // played out: spending and keeping are each judged by the game-win chance that follows, with the miracles used up
  // in the first case and still in hand in the second, so a miracle is saved exactly when keeping it is worth more
  if (ENGINE_STATE.battleVM && (ENGINE_STATE.battleVM.po || ENGINE_STATE.battleVM.myopic)){
    const seed0 = g._poSeed; g._poSeed = Math.floor(g.rnd() * 2147483647);
    try{
      const evp = d => {
        const V = ENGINE_STATE.battleVM.myopic ? ENGINE_STATE.battleVM[i] : outcomeValues(g, i, ENGINE_STATE.battleVM.po, i === 0 ? [d, guesses[0]] : [guesses[0], d]);
        let s = 0;
        for (const gd of guesses){
          const cfgs = [{...myCfg, units:d}, {...oppCfg, units:gd}]; if (i === 1) cfgs.reverse();
          const w = runBattle(cfgs, false).result.w; s += w === i ? V.w : w < 0 ? V.t : V.l;
        }
        return s / guesses.length;
      };
      const a = evp(withM), b = evp(without);
      g.mirDecide = g.mirDecide || [];
      g.mirDecide.push({i, round:g.round, withMiracles:+a.toFixed(3), keepingThem:+b.toFixed(3), spend:a > b});
      return a > b ? withM : without;
    } finally { if (seed0 == null) delete g._poSeed; else g._poSeed = seed0; }
  }
  const ev = d => { let sum = 0; for (const gd of guesses) for (let k = 0; k < 3; k++) sum += battleScore(d, gd, i, myCfg, oppCfg); return sum / (guesses.length * 3); };
  const gain = ev(withM) - ev(without), stakes = battleStakes(g, i);
  // with played-out values, ev() is already game-win chance (and keeping a miracle has worth in later rounds, which
  // the playouts don't see yet), so the bar G.mu stays as the price of using it up
  const spend = (ENGINE_STATE.battleVM ? gain : gain * stakes) > (G.mu ?? 0.06);
  g.mirDecide = g.mirDecide || [];
  g.mirDecide.push({i, round:g.round, gain:+gain.toFixed(3), stakes:+stakes.toFixed(3), spend});
  return spend ? withM : without;
}
function aiMobilizeAt(g, i, K, depth){
  const D = typeof depth === 'object' && depth ? depth : (depth ? DEPTH.play : null);
  if (D && D.search && (D.search.po || D.search.myopic) && !ENGINE_STATE.battleVM){
    ENGINE_STATE.battleVM = mobilizeValues(g, g.players[i].genome || baseGenome(), D);
    try{ return mobilizeWithMiracles(g, i, () => aiMobilizePlan(g, i, K, depth)); } finally { ENGINE_STATE.battleVM = null; }
  }
  return mobilizeWithMiracles(g, i, () => aiMobilizePlan(g, i, K, depth));
}
function aiMobilizePlan(g, i, K, depth){
  const D = typeof depth === 'object' && depth ? depth : (depth ? DEPTH.play : null);
  if (D) return deepMobilize(g, i, D);
  const p = g.players[i], a = buildArmy(p);
  if (!a.core.length && !a.recs) return [];
  const perms = [a.core.slice(), a.core.slice().reverse()];
  for (let k = 0; k < K; k++) perms.push(shuffle(a.core.slice(), g.rnd));
  const guesses = oppGuesses(g, i), opp = g.players[1-i];
  const oppCfg = battleCfgOf(opp), myCfg = battleCfgOf(p);
  let best = null, bs = -Infinity;
  for (const perm of perms){
    for (const recFront of (a.recs ? [true,false] : [true])){
      for (const armFirst of (a.arm ? [true,false] : [false])){
        const deck = assemble(perm, a.recs, a.arm, recFront, armFirst, a.sh, a.gear);
        const s2 = scoreDeck(deck, i, myCfg, oppCfg, guesses);
        if (s2 > bs){ bs = s2; best = deck; }
      }
    }
  }
  return best;
}
// Ratings from head-to-head results: logistic (Elo) model fit by gradient ascent, one virtual draw per pair
// so lopsided pairs stay finite. results: [{a, b, wa, wb, d}]; rung 0 is pinned at 400.
function fitElo(results, n){
  const r = new Array(n).fill(0), LN = Math.LN10 / 400;
  for (let it = 0; it < 4000; it++){
    const grad = new Array(n).fill(0), hess = new Array(n).fill(1e-9);
    for (const x of results){
      const games = x.wa + x.wb + x.d + 1, sa = x.wa + 0.5 * x.d + 0.5;
      const e = 1 / (1 + Math.pow(10, (r[x.b] - r[x.a]) / 400));
      grad[x.a] += sa - games * e; grad[x.b] -= sa - games * e;
      const h = games * e * (1 - e) * LN; hess[x.a] += h; hess[x.b] += h;
    }
    let move = 0;
    for (let k = 1; k < n; k++){ const st = Math.max(-60, Math.min(60, grad[k] / hess[k])); r[k] += st; move = Math.max(move, Math.abs(st)); }
    if (move < 0.01) break;
  }
  return r.map(v => Math.round(400 + v - r[0]));
}
const stableKey = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).sort().reduce((o, kk) => (o[kk] = x[kk], o), {}) : x);
// one game between two rungs (indices into RUNGS), both using the same genome; returns the winner (0, 1, or -1 for a draw)
function ladderGame(a, b, genome, seed){
  const g = newGame({genomes:[genome, genome], rnd: seed != null ? mulberry32(seed) : undefined});
  g.players[0].skill = {lo:RUNGS[a]}; g.players[1].skill = {lo:RUNGS[b]};
  while (!g.over) autoRound(g, 24, null);
  return g.winner;
}
function playAIGame(Ga, Gb, K, depth){
  const g = newGame({genomes:[Ga, Gb]});
  while (!g.over) autoRound(g, K, depth);
  return g;
}
