/* ===================== COMBO (SYNERGY) TABLE ===================== */
// syn['A>B'] = how much better a deck does with A directly in front of B than you'd expect from A and B separately
// (interaction contrast against a Strong Villager reference, measured on the same random battles for every pair).
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function synPool(){ return Object.keys(DEFS).filter(x => !DEFS[x].token && x !== 'Jester' && DEFS[x].n > 0); }
function synContexts(N, seed){
  const r = mulberry32(seed), pool = synPool();
  const deck = s => shuffle(pool.slice(), r).slice(0, s).map(x => ({name:x, copies:1 + (r() < 0.3 ? 1 : 0)}));
  return Array.from({length:N}, () => ({mine:deck(3), en:deck(5), at:Math.floor(r() * 4)}));
}
function pairWin(a, b, ctx){
  let w = 0;
  for (const c of ctx){
    const d = c.mine.filter(u => u.name !== a && u.name !== b);
    d.splice(Math.min(c.at, d.length), 0, {name:a, copies:1}, {name:b, copies:1});
    const r = runBattle([{units:d}, {units:c.en}], false).result.w;
    w += scoreFor(r, 0);
  }
  return w / ctx.length;
}
function synRows(as, N, seed){
  const ctx = synContexts(N, seed), names = synPool(), V = 'Strong Villager';
  const vv = pairWin(V, V, ctx), vb = {};
  for (const b of names) vb[b] = pairWin(V, b, ctx);
  const out = {};
  for (const a of as){
    const av = pairWin(a, V, ctx);
    for (const b of names){
      if (a === b) continue;
      const s = pairWin(a, b, ctx) - av - vb[b] + vv;
      if (Math.abs(s) >= 0.03) out[a + '>' + b] = +s.toFixed(3);
    }
  }
  return out;
}
const SYN_DEFAULT = {"Hired Blade>Slinger":0.032,"Hired Blade>Marksman":0.086,"Hired Blade>Studious Squire":0.051,"Hired Blade>Barber-Surgeon":0.074,"Hired Blade>Musketeer":0.032,"Hired Blade>White Knight":0.099,"Hired Blade>Scholar":0.052,"Pikeman>Dark Knight":-0.055,"Pikeman>White Knight":0.066,"Pikeman>Scholar":-0.041,"Slinger>Pigeon Hunter":0.076,"Slinger>Musketeer":0.035,"Slinger>Scholar":-0.043,"Slinger>Halberd Knight":0.031,"Dutiful Squire>Pigeon Hunter":0.078,"Dutiful Squire>Scholar":-0.048,"Conscripted Farmhand>Scholar":-0.038,"Cowardly Squire>Dutiful Squire":0.033,"Cowardly Squire>Marksman":0.087,"Cowardly Squire>Studious Squire":0.057,"Cowardly Squire>Musketeer":0.041,"Cowardly Squire>Scholar":-0.055,"Assassin>Studious Squire":0.034,"Assassin>Barber-Surgeon":0.057,"Assassin>White Knight":0.099,"Assassin>Halberd Knight":0.054,"Marksman>Barber-Surgeon":0.112,"Marksman>Pigeon Hunter":0.179,"Marksman>White Knight":0.033,"Marksman>Man-at-arms":0.031,"Marksman>Halberd Knight":0.034,"Studious Squire>Marksman":0.037,"Studious Squire>Barber-Surgeon":0.068,"Studious Squire>Pigeon Hunter":0.103,"Studious Squire>Cannon":0.04,"Studious Squire>Grave-Robber":0.039,"Studious Squire>White Knight":0.05,"Studious Squire>Scholar":-0.037,"Aging Master>Hired Blade":0.047,"Aging Master>Pikeman":-0.052,"Aging Master>Conscripted Farmhand":-0.053,"Aging Master>Studious Squire":0.052,"Aging Master>Barber-Surgeon":-0.042,"Aging Master>Pigeon Hunter":0.133,"Aging Master>Brawler":0.255,"Aging Master>Fencer":0.062,"Aging Master>Dark Knight":0.043,"Aging Master>Knight":-0.049,"Aging Master>Cannon":0.038,"Aging Master>Lancer":0.165,"Aging Master>White Knight":0.117,"Aging Master>Executioner":-0.067,"Aging Master>Scholar":0.163,"Aging Master>Man-at-arms":0.114,"Aging Master>Halberd Knight":0.088,"Aging Master>Armored Knight":0.047,"Barber-Surgeon>Aging Master":0.035,"Barber-Surgeon>Pigeon Hunter":0.107,"Barber-Surgeon>Scholar":-0.035,"Pigeon Hunter>Marksman":0.048,"Pigeon Hunter>Studious Squire":0.039,"Pigeon Hunter>Barber-Surgeon":0.076,"Pigeon Hunter>Musketeer":0.031,"Pigeon Hunter>White Knight":0.068,"Brawler>Dutiful Squire":0.059,"Brawler>Marksman":0.05,"Brawler>Studious Squire":0.03,"Brawler>Barber-Surgeon":0.061,"Brawler>Musketeer":0.034,"Brawler>White Knight":0.057,"Brawler>Scholar":0.161,"Fencer>Slinger":0.033,"Fencer>Assassin":0.037,"Fencer>Marksman":0.059,"Fencer>Studious Squire":0.038,"Fencer>Barber-Surgeon":0.071,"Fencer>Brawler":0.034,"Fencer>Musketeer":0.047,"Fencer>White Knight":0.091,"Fencer>Scholar":0.04,"Fencer>Man-at-arms":0.031,"Fencer>Halberd Knight":0.047,"Sleepy Guard>Scholar":-0.031,"Musketeer>Barber-Surgeon":0.079,"Musketeer>Pigeon Hunter":0.138,"Musketeer>Cannon":0.047,"Musketeer>White Knight":0.033,"Musketeer>Scholar":-0.078,"Musketeer>Man-at-arms":0.03,"Musketeer>Halberd Knight":0.047,"Dark Knight>Pikeman":-0.063,"Dark Knight>Marksman":0.087,"Dark Knight>Studious Squire":0.045,"Dark Knight>Barber-Surgeon":0.046,"Dark Knight>Pigeon Hunter":-0.083,"Dark Knight>Brawler":0.038,"Dark Knight>Musketeer":0.051,"Dark Knight>White Knight":0.087,"Dark Knight>Recruiter":-0.072,"Dark Knight>Executioner":-0.075,"Dark Knight>Scholar":-0.068,"Knight>Marksman":0.039,"Knight>Studious Squire":0.033,"Knight>Barber-Surgeon":0.036,"Knight>Pigeon Hunter":0.038,"Knight>Grave-Robber":0.033,"Knight>White Knight":0.035,"Knight>Scholar":-0.032,"Cannon>Barber-Surgeon":0.106,"Cannon>Pigeon Hunter":0.171,"Cannon>Musketeer":0.043,"Cannon>Scholar":-0.034,"Cannon>Halberd Knight":0.036,"Lancer>Dutiful Squire":0.068,"Lancer>Marksman":0.051,"Lancer>Studious Squire":0.031,"Lancer>Barber-Surgeon":0.122,"Lancer>Musketeer":0.035,"Lancer>White Knight":0.137,"Lancer>Scholar":0.117,"Lancer>Halberd Knight":0.033,"White Knight>Marksman":0.048,"White Knight>Studious Squire":0.03,"White Knight>Barber-Surgeon":0.135,"White Knight>Pigeon Hunter":0.118,"White Knight>Musketeer":0.065,"White Knight>Scholar":0.03,"White Knight>Man-at-arms":0.033,"White Knight>Halberd Knight":0.048,"Recruiter>Slinger":0.062,"Recruiter>Dutiful Squire":0.035,"Recruiter>Sleepy Guard":0.038,"Recruiter>Musketeer":0.117,"Recruiter>Cannon":0.149,"Recruiter>Scholar":-0.044,"Executioner>Dark Knight":-0.068,"Executioner>White Knight":0.063,"Executioner>Scholar":-0.052,"Scholar>Hired Blade":0.058,"Scholar>Pikeman":-0.031,"Scholar>Conscripted Farmhand":-0.032,"Scholar>Cowardly Squire":-0.032,"Scholar>Aging Master":0.044,"Scholar>Pigeon Hunter":0.267,"Scholar>Brawler":0.16,"Scholar>Fencer":0.039,"Scholar>Musketeer":0.047,"Scholar>Dark Knight":0.056,"Scholar>Knight":-0.033,"Scholar>Cannon":0.065,"Scholar>Lancer":0.138,"Scholar>White Knight":0.031,"Scholar>Executioner":-0.043,"Scholar>Man-at-arms":0.093,"Scholar>Halberd Knight":0.078,"Man-at-arms>Marksman":0.146,"Man-at-arms>Studious Squire":0.09,"Man-at-arms>Barber-Surgeon":0.121,"Man-at-arms>Pigeon Hunter":0.154,"Man-at-arms>Fencer":0.042,"Man-at-arms>Musketeer":0.063,"Man-at-arms>Dark Knight":-0.073,"Man-at-arms>Cannon":0.041,"Man-at-arms>White Knight":0.087,"Man-at-arms>Scholar":0.062,"Man-at-arms>Halberd Knight":0.057,"Halberd Knight>Slinger":0.045,"Halberd Knight>Marksman":0.076,"Halberd Knight>Studious Squire":0.047,"Halberd Knight>Barber-Surgeon":0.117,"Halberd Knight>Pigeon Hunter":0.101,"Halberd Knight>Musketeer":0.053,"Halberd Knight>Cannon":0.038,"Halberd Knight>White Knight":0.115,"Halberd Knight>Scholar":-0.035,"Armored Knight>Slinger":0.038,"Armored Knight>Dutiful Squire":0.058,"Armored Knight>Marksman":0.094,"Armored Knight>Studious Squire":0.073,"Armored Knight>Barber-Surgeon":0.126,"Armored Knight>Dark Knight":0.037,"Armored Knight>White Knight":0.076};
let SYN = SYN_DEFAULT;   // replaced by a recomputed table when card numbers change
function comboBonus(p, name){
  // In a line a unit has one neighbour in front and one behind, so it can use at most two pairings, with different
  // partners: the best "partner in front of me" plus the best "me in front of partner". Bad pairings are left out,
  // since Mobilize can keep those units apart.
  let i1 = 0, i1n = null, i2 = 0, o1 = 0, o1n = null, o2 = 0;   // top two partners on each side
  for (const y in p.hand){
    if (y === name || exemptUnit(y)) continue;
    const a = Math.max(0, SYN[y + '>' + name] || 0), b = Math.max(0, SYN[name + '>' + y] || 0);
    if (a > i1){ i2 = i1; i1 = a; i1n = y; } else if (a > i2) i2 = a;
    if (b > o1){ o2 = o1; o1 = b; o1n = y; } else if (b > o2) o2 = b;
  }
  return i1n !== null && i1n === o1n ? Math.max(i1 + o2, i2 + o1) : i1 + o1;
}

/* ===================== LEARNING ===================== */
function gauss(rnd){ let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v); }
const GKEYS = {kp:[0,0.6,0.03], shr:[0,1,0.05], tie:[0,0.3,0.02], rob:[0,0.6,0.04], s:[0.2,3,0.15], e:[0,8,0.4], m:[0.3,2,0.1], thresh:[-3,4,0.4], slot:[0,2,0.15], pair:[-1,3,0.3], cath:[0,3,0.3], read:[0,1,0.1], deny:[0,1.5,0.12], combo:[0,3,0.2], save:[0,1.5,0.1], hb:[0,7,0.35], bmk:[0,3,0.15], lu2:[0,1.5,0.1], omk:[0,3,0.2], mir:[0,3,0.15], mu:[0,0.4,0.03], mpat:[0,2,0.12]};
// Fold a legacy income-horizon weight (hk) into e and hb: same AI, one fewer knob
function foldHK(G){ if (!G || G.hk == null) return G; const {hk, ...r} = G; return {...r, e:(G.e ?? 0.5) * hk, hb:(G.hb ?? 0.5) * hk}; }
function mutate(G, rnd, strength){
  G = foldHK(G);
  strength = strength || 1;
  const n = {...G, bias:{...G.bias}};
  for (const k in GKEYS){ const [lo, hi, sd] = GKEYS[k]; if (n[k] === undefined) n[k] = baseGenome()[k]; if (rnd() < 0.5) n[k] = Math.max(lo, Math.min(hi, n[k] + gauss(rnd) * sd * strength)); }
  for (const c of OPINION_KEYS) if (rnd() < 0.12) n.bias[c] = Math.max(-6, Math.min(6, (n.bias[c] || 0) + gauss(rnd) * 0.8 * strength));
  return n;
}
/* ===================== TRAINING: evolution strategies ===================== */
// The trainer tunes the AI's weights as one vector, each weight scaled to 0..1 by its range in GKEYS, so a single
// step size fits them all. Card opinions (bias) are learned separately, from the games' card stats (biasStep).
// Weights trained. With thinking AIs every real decision is a game-win comparison, and only three weights take part:
// rob (average vs worst case over their orders), read and omk (trust in, and learning of, the read of their order).
// The rest only shape the imagined players in playouts, where a game result says little about them, and several
// share one scale (strength, economy, money, the pass bar and card opinions can all double without changing a choice).
const TKEYS_ALL = Object.keys(GKEYS).filter(k => !['deny', 'save', 'mpat'].includes(k));   // the formula levels
const TKEYS_SEARCH = ['rob', 'read', 'omk'];
let TKEYS = TKEYS_ALL;
function toVec(G){ G = foldHK(G); return TKEYS.map(k => { const [lo, hi] = GKEYS[k]; const v = G[k] ?? baseGenome()[k]; return Math.max(0, Math.min(1, (v - lo) / (hi - lo))); }); }
function fromVec(x, like){
  like = foldHK(like);
  const G = {...(like || baseGenome()), bias:{...((like && like.bias) || {})}};
  TKEYS.forEach((k, j) => { const [lo, hi] = GKEYS[k]; G[k] = lo + Math.max(0, Math.min(1, x[j])) * (hi - lo); });
  return G;
}
// One seed, played twice with the seats swapped: both AIs get the same deck order and the same first-turn roll,
// so that luck cancels out of the comparison. Returns A's score (0..1). st, if given, collects card stats.
function pairGames(A, B, seed, K, depth, st){
  let s = 0;
  for (const sw of [0,1]){
    const g = newGame({genomes: sw ? [B, A] : [A, B], rnd: mulberry32(seed)});
    while (!g.over) autoRound(g, K, depth);
    if (st) recordStats(st, g);
    s += scoreFor(g.winner, sw);
  }
  return s / 2;
}
// Antithetic evolution strategies. Each direction eps was tested as (x + sigma*eps) against (x - sigma*eps) on the
// same seeds; f is the plus side's score. (f - 0.5) says which way along eps is better, and averaging over all the
// directions estimates the uphill direction while using every game played.
function esGrad(dirs, sigma){
  const g = dirs[0].eps.map(() => 0);
  for (const d of dirs) d.eps.forEach((e, j) => { g[j] += (d.f - 0.5) * e / (dirs.length * sigma); });
  return g;
}
// Move along the (momentum-averaged) estimate, capped so one unlucky batch can't throw the weights far.
function esApply(x, g, lr, maxStep){
  const len = Math.sqrt(g.reduce((a, v) => a + v * v, 0)) * lr, k = len > maxStep ? maxStep / len : 1;
  return x.map((v, j) => Math.max(0, Math.min(1, v + lr * k * g[j])));
}
// Settings for one training step: directions tested, seed pairs per direction, probe size, step size, momentum,
// and how often card opinions update and the checkpoint test runs (in steps).
const ES = {dirs:6, pairs:3, sigma:0.1, lr:0.03, maxStep:0.04, mom:0.8, every:10, gatePairs:200, progPairs:24, progEvery:20, revertBelow:0.46};   // progress check: chart only, so small and every 20 steps
/* ---------- Safety check by SPRT (sequential probability ratio test, as Stockfish's Fishtest uses) ----------
   Instead of a fixed number of game pairs, the check plays pairs in batches and stops as soon as the evidence is
   clear. It weighs two hypotheses about the AI's true score against the opponent: mu0 ("clearly worse", roll back)
   and mu1 ("no worse", keep). After each batch it adds up the log-likelihood ratio (normal approximation, with the
   pair-to-pair variance measured from the games themselves) and stops when it crosses either bound. alpha is the
   chance of keeping an AI that is really at mu0; beta, the chance of rolling back one that is really at mu1. If it
   reaches maxPairs undecided, it keeps the AI when the score is above the midpoint. Clear results stop in a few
   dozen pairs; a close call runs about as long as the old fixed check, with known error rates. */
const SPRT = {mu0:0.45, mu1:0.5, alpha:0.05, beta:0.05, minPairs:24, maxPairs:400, varFloor:0.04};
function sprtLLR(xs, R){
  const n = xs.length; if (n < 2) return 0;
  const sum = xs.reduce((a, b) => a + b, 0), m = sum / n;
  const v = Math.max(R.varFloor, xs.reduce((a, x) => a + (x - m) * (x - m), 0) / (n - 1));
  return (R.mu1 - R.mu0) / v * (sum - n * (R.mu0 + R.mu1) / 2);
}
function sprtBounds(R){ return {lo:Math.log(R.beta / (1 - R.alpha)), hi:Math.log((1 - R.beta) / R.alpha)}; }
// Decide from pair scores so far: 'keep', 'revert', or null (keep playing)
function sprtDecide(xs, R){
  const {lo, hi} = sprtBounds(R), llr = sprtLLR(xs, R);
  if (xs.length >= R.minPairs && llr >= hi) return 'keep';
  if (xs.length >= R.minPairs && llr <= lo) return 'revert';
  if (xs.length >= R.maxPairs) return xs.reduce((a, b) => a + b, 0) / xs.length >= (R.mu0 + R.mu1) / 2 ? 'keep' : 'revert';
  return null;
}
/* ---------- Hall of fame ----------
   Every HOF.every steps a passing champion is saved; the last HOF.keep are kept. Each safety check also plays one
   past champion (taking turns through the list), so the AI can't drift into beating only its latest self while
   forgetting how to beat styles it used to handle (rock-paper-scissors cycling). Clearly losing to a past champion
   rolls back like failing the checkpoint test; if the same past champion wins HOF.strikes checks in a row, it was
   simply better, so it becomes the champion again. */
const HOF = {every:50, keep:6, strikes:3};
// Past champions are usually weaker, so this check stops quickly; it only flags a clear loss (scoring around 43%).
const HOF_SPRT = {...SPRT, mu0:0.43};
// how far one check can swing from luck alone (about two standard deviations), in percentage points
const swingPts = pairs => Math.round(100 / Math.sqrt(2 * pairs));
function randDir(n, rnd){ return Array.from({length:n}, () => gauss(rnd)); }
// Card opinions from evidence: for every card bought often enough in the recent games, compare its buyers with
// players who were in the same position (behind, tied, ahead) and nudge the opinion toward that edge, a capped amount
// per update. Every opinion also fades a little toward 0, so a card the AI stopped buying gets tried again and its
// opinion is re-earned rather than stuck. Returns the new bias table.
const BIAS_RULE = {minN:120, rate:4, cap:0.4, lim:4, decay:0.05};
function biasStep(bias, st, R){
  R = {...BIAS_RULE, ...(R || {})};
  const base = st.__base || {}, L = st.__lead || {}, edge = {};
  let tn = 0, ts = 0;
  for (const c of OPINION_KEYS){
    let n = 0, s = 0;
    const lead = L[c] || {};
    for (const z of ['b','t','a']){ const q = lead[z], bq = base[z]; if (!q || !bq || !bq.n) continue; n += q.n; s += q.w - q.n * bq.w / bq.n; }
    if (n >= R.minN){ edge[c] = s / n; tn += n; ts += s; }
  }
  // Players who buy anything tend to beat players who pass (they have more money), so every card looks a little
  // good. Measure each card against the average purchase instead, so opinions rank cards against each other and
  // don't just make the AI spend more.
  const mean = tn ? ts / tn : 0, out = {};
  for (const c of OPINION_KEYS){
    let v = (bias[c] || 0) * (1 - R.decay);
    if (c in edge) v += Math.max(-R.cap, Math.min(R.cap, R.rate * (edge[c] - mean)));
    v = Math.max(-R.lim, Math.min(R.lim, v));
    if (Math.abs(v) >= 0.01) out[c] = v;
  }
  return out;
}
/* ---------- Learned pairings (contextual card opinions) ----------
   A pairing is an opinion about buying a card given one unit already in play: one the buyer owns ('Cannon+Recruiter',
   synergy) or one the opponent is known to own ('Cannon~Man-at-arms', counter). Evidence is every purchase in the
   AI's games. For each pairing it compares how those buyers finished with what you'd expect from the card alone and
   the unit alone (in the same score position), so a strong unit doesn't make every card bought next to it look good.
   An opinion only forms once the evidence is substantial: at least minN purchases AND a gap of at least z standard
   errors (z = 3 keeps chance findings rare across the ~2,000 pairings tested). Evidence fades slowly (decay per
   update) so it tracks the AI as it changes. */
const CTX_RULE = {minN:400, z:3, rate:4, cap:1, fade:0.05, decay:0.03, total:2.5};
function ctxEdges(ev){
  const out = {}, rt = (k, z) => { const q = ev[k] && ev[k][z]; return q && q.n >= 1 ? q.w / q.n : null; };
  for (const k in ev){
    const m = /^(.+?)([+~@])(.+)$/.exec(k); if (!m || !m[1]) continue;
    const [, c, sep, y] = m;
    let n = 0, s = 0, v = 0;
    for (const z of ['b','t','a']){
      const q = ev[k][z]; if (!q || !q.n) continue;
      const rc = rt(c, z), ry = rt(sep + y, z), ra = rt('*', z);
      if (rc == null || ry == null || ra == null) continue;
      const e = Math.max(0.02, Math.min(0.98, rc + ry - ra));
      n += q.n; s += q.w - q.n * e; v += q.n * e * (1 - e);
    }
    if (n > 0) out[k] = {c, y, vs:sep === '~', sit:sep === '@', n, edge:s / n, z:v > 0 ? s / Math.sqrt(v) : 0};
  }
  return out;
}
function ctxStep(prev, ev, R){
  const R0 = {...CTX_RULE, ...(R || {})};
  const E = ctxEdges(ev || {}), out = {};
  for (const k of new Set([...Object.keys(E), ...Object.keys(prev || {})])){
    const e = E[k], old = (prev || {})[k] || 0, R = k.includes('@') ? {...R0, ...SIT_RULE} : R0;
    let v;
    if (e && e.n >= R.minN && Math.abs(e.z) >= R.z) v = Math.max(-R.cap, Math.min(R.cap, R.rate * e.edge));   // substantial: set from the evidence
    else if (e && e.n >= R.minN) v = old * 0.5;            // plenty of games, but the gap isn't clear any more: back off
    else v = old * (1 - R.fade);                           // not enough recent games: keep it, fading slowly
    if (Math.abs(v) >= 0.02) out[k] = +v.toFixed(3);
  }
  return out;
}
// let old evidence count a little less each update; drop what has faded away
function ctxDecay(ev, d){
  const out = {};
  for (const k in ev){ const e = {}; for (const z in ev[k]){ const q = ev[k][z], n = q.n * (1 - d); if (n >= 0.5) e[z] = {n:+n.toFixed(2), w:+(q.w * (1 - d)).toFixed(2)}; } if (Object.keys(e).length) out[k] = e; }
  return out;
}
/* ---------- Situational opinions ----------
   A card's worth depends on the moment, so its opinion is adjusted for each fact about the situation it's bought in:
   how far into the game it is (shops likely left), the score, the money on hand, and whose income is higher.
   Learned the same way as pairings: buyers in that situation are compared with what the card's usual result and the
   situation's usual result predict, and a correction only forms on clear evidence. The card's final opinion is its
   starting value plus the corrections for every fact that holds right now, so it changes as the game does. */
const SIT_RULE = {minN:300, z:2.5};
const SIT_LABEL = {'st:early':'early in the game', 'st:mid':'mid-game', 'st:late':'late in the game',
  'sc:b':'when behind on points', 'sc:t':'when tied on points', 'sc:a':'when ahead on points',
  '$:lo':'with $0–1 on hand', '$:mid':'with $2–3 on hand', '$:hi':'with $4 or more on hand',
  'in:b':'when your income is lower', 'in:e':'with equal income', 'in:a':'when your income is higher'};
function sitTags(g, i){
  const p = g.players[i], o = g.players[1-i];
  const sl = expShops(g, i), lead = total(p) - total(o), di = income(p) - income(o), m = p.money;
  return ['st:' + (sl >= 2.5 ? 'early' : sl >= 1.5 ? 'mid' : 'late'), 'sc:' + (lead < 0 ? 'b' : lead > 0 ? 'a' : 't'),
          '$:' + (m <= 1 ? 'lo' : m <= 3 ? 'mid' : 'hi'), 'in:' + (di < 0 ? 'b' : di > 0 ? 'a' : 'e')];
}
function sitBonus(G, g, i, name){
  const T = G.ctx; if (!T) return 0;
  let s = 0;
  for (const t of sitTags(g, i)) s += T[name + '@' + t] || 0;
  return Math.max(-CTX_RULE.total, Math.min(CTX_RULE.total, s));
}
// the learned pairings that apply to buying `name` for player p, given the enemy hand p can see
function ctxBonus(G, p, opp, name){
  const T = G.ctx; if (!T) return 0;
  let s = 0;
  for (const y of ctxUnits(p.hand)) if (y !== name) s += T[name + '+' + y] || 0;
  for (const y of ctxUnits(opp.hand)) s += T[name + '~' + y] || 0;
  return Math.max(-CTX_RULE.total, Math.min(CTX_RULE.total, s));
}
function crossover(A, B, rnd){
  A = foldHK(A); B = foldHK(B);
  const n = {bias:{}, ctx:A.ctx || B.ctx || {}};
  for (const k in GKEYS) n[k] = (rnd() < 0.5 ? A[k] : B[k]) ?? baseGenome()[k];
  for (const c of OPINION_KEYS){ const v = rnd() < 0.5 ? A.bias[c] : B.bias[c]; if (v) n.bias[c] = v; }
  return n;
}
function recordStats(stats, g){
  for (const i of [0,1]){
    const won = scoreFor(g.winner, i);
    for (const c of new Set(g.players[i].bought)){
      const s = stats[c] || (stats[c] = {n:0, w:0}); s.n++; s.w += won;
    }
  }
  stats.__games = (stats.__games || 0) + 1;
  // miracles count as bought by whoever bought the card covering them (once per game, like cards)
  for (const i of [0,1]) for (const n of new Set((g.mirGot || [[], []])[i])){ const s = stats[n] || (stats[n] = {n:0, w:0}); s.n++; s.w += scoreFor(g.winner, i); }
  // miracles: how often each one was shown, bought, and how its buyer did
  if (g.miracles){
    const M = stats.__mir || (stats.__mir = {});
    M.__games = (M.__games || 0) + 1;
    for (const n in g.mirShown || {}){ const q = M[n] || (M[n] = {sh:0, n:0, w:0}); q.sh += g.mirShown[n]; }
    for (const i of [0,1]) for (const n of (g.mirGot || [[], []])[i]){ const q = M[n] || (M[n] = {sh:0, n:0, w:0}); q.n++; q.w += scoreFor(g.winner, i); }
  }
  // first-turn advantage: result for whoever shopped first in round 1 (draws count half)
  if (g.first1 === 0 || g.first1 === 1){
    const F = stats.__first || (stats.__first = {n:0, w:0, d:0, rounds:0});
    F.n++; F.rounds += g.round;
    if (g.winner === -1){ F.d++; F.w += 0.5; } else if (g.winner === g.first1) F.w++;
  }
  // sales: how many copies of each card were sold, and whether the seller went on to win
  if (g.sold){ const S = stats.__sold || (stats.__sold = {});
    for (const i of [0,1]) for (const c of g.sold[i] || []){ const s = S[c] || (S[c] = {n:0, w:0}); s.n++; s.w += scoreFor(g.winner, i); } }
  // offers: each time a card was available to a player in a shop phase, did they take it, and did they win?
  const won = i => scoreFor(g.winner, i);
  const bucket = lead => lead < 0 ? 'b' : lead > 0 ? 'a' : 't';
  const O = stats.__offer || (stats.__offer = {}), L = stats.__lead || (stats.__lead = {}), B = stats.__base || (stats.__base = {});
  for (const s of (g.states || [])){ const q = B[bucket(s.lead)] || (B[bucket(s.lead)] = {n:0, w:0}); q.n++; q.w += won(s.i); }
  for (const o of (g.offers || [])){
    const r = won(o.i), q = O[o.name] || (O[o.name] = {bn:0, bw:0, pn:0, pw:0});
    if (o.bought){ q.bn++; q.bw += r;
      const l = L[o.name] || (L[o.name] = {}), z = l[bucket(o.lead)] || (l[bucket(o.lead)] = {n:0, w:0}); z.n++; z.w += r; }
    else { q.pn++; q.pw += r; }
  }
  // buy context, for learned pairings: every purchase is counted under the card ('Cannon'), under each unit its
  // buyer owned ('Cannon+Recruiter') and each enemy unit it could see ('Cannon~Man-at-arms'), plus the matching
  // baselines for any purchase ('*', '+Recruiter', '~Man-at-arms'), split by score position. ctxStep compares them.
  // (learned pairings are retired, so their buy-context evidence is no longer collected)
  // battle-level pair stats: units fielded in the same deck, and units directly in front of another
  const bump = (tbl, k, r) => { const s = tbl[k] || (tbl[k] = {n:0, w:0}); s.n++; s.w += r; };
  const P = stats.__pairs || (stats.__pairs = {}), A = stats.__adj || (stats.__adj = {}), U = stats.__units || (stats.__units = {});
  const V = stats.__vs || (stats.__vs = {});
  for (const b of (g.battles || [])){
    for (const i of [0,1]){
      const r = scoreFor(b.w, i), d = b.d[i];
      // buildings in the city count as part of that side's deck for pairs and counters (not for front → behind)
      const cit = (b.c && b.c[i]) || [], citO = (b.c && b.c[1-i]) || [];
      for (const n of new Set(d.concat(cit))) bump(U, n, r);
      const names = [...new Set(d.concat(cit))].sort();
      for (let x = 0; x < names.length; x++) for (let y = x + 1; y < names.length; y++) bump(P, names[x] + '|' + names[y], r);
      for (let x = 0; x + 1 < d.length; x++) bump(A, d[x] + '>' + d[x+1], r);
      // counters: every card on this side against every card on the enemy side
      const mine = [...new Set(d.concat(cit))], theirs = [...new Set(b.d[1-i].concat(citO))];
      for (const m of mine) for (const t of theirs) bump(V, m + '~' + t, r);
    }
  }
}
