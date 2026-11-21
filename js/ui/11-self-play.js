/* ===================== SELF-PLAY (worker pool) ===================== */
// Each worker plays matches between two AI genomes; the evolution loop runs here and farms matches out.
function workerMain(){
  // one game that hits an error is skipped and reported, and every request always gets an answer
  let errs = 0, lastErr = null;
  const safe = (fn, fallback) => { try{ return fn(); }catch(err){ errs++; lastErr = String((err && err.stack) || err).slice(0, 800); return fallback; } };
  self.onmessage = e => {
    const m = e.data; errs = 0; lastErr = null;
    try{ handle(m); }catch(err){ postMessage({id:m.id, score:null, stats:{}, games:0, errs:errs + 1, err:String((err && err.stack) || err).slice(0, 800)}); }
  };
  const postMessage = msg => self.postMessage(errs ? {...msg, errs, err:lastErr} : msg);
  const handle = m => {
    applyOverrides(m.ov);
    if (m.syn) SYN = m.syn;
    // the page's Miracles / Battle miracles checkboxes (a worker starts with both on)
    if (m.mo !== undefined){ MIRACLES_ON = !!m.mo; BATTLE_MIR_ON = !!m.bmo; REFILL_ON = !!m.rf; }
    if (m.cmd === 'syn'){ postMessage({id:m.id, score:synRows(m.as, m.n, m.seed), stats:{}, games:0}); return; }
    if (m.cmd === 'forced'){ postMessage({id:m.id, score:forcedCardGames(m.card, m.n, m.depth, m.once), stats:{}, games:0}); return; }
    if (m.cmd === 'free'){ postMessage({id:m.id, score:freeBuildingGames(m.b, m.l, m.n, m.depth) / m.n, stats:{}, games:0}); return; }
    if (m.cmd === 'slot'){ const r = slotBattles(m.a, m.b, m.l, m.n); postMessage({id:m.id, score:[r[0] / m.n, r[1] / m.n], stats:{}, games:0}); return; }
    if (m.cmd === 'ladder'){
      let wa = 0, wb = 0, d = 0;
      for (let k = 0; k < m.n; k++){
        const flip = (m.seed + k) % 2 === 1, w = safe(() => flip ? ladderGame(m.b, m.a, m.genome, m.seed + k) : ladderGame(m.a, m.b, m.genome, m.seed + k), null);
        if (w === null) continue;
        if (flip ? w === 1 : w === 0) wa++; else if (flip ? w === 0 : w === 1) wb++; else d++;
      }
      postMessage({id:m.id, score:{wa, wb, d}, stats:{}, games:0}); return;
    }
    if (m.cmd === 'pairs'){
      const st = {}; let s = 0; const each = [];
      for (const sd of m.seeds){ const one = {}; const v = safe(() => pairGames(m.A, m.B, sd, 8, m.depth, one), 0.5); s += v; each.push(v);
        postMessage({id:m.id, part:true, stats:one, games:2}); }
      postMessage({id:m.id, score:m.each ? each : s / m.seeds.length, stats:st, games:0}); return;
    }
    if (m.cmd !== 'match') return;
    const st = {}; let w = 0;
    for (let k = 0; k < m.n; k++){
      const sw = k % 2, g = safe(() => playAIGame(sw ? m.B : m.A, sw ? m.A : m.B, 8, m.depth), null);
      if (!g){ w += 0.5; postMessage({id:m.id, part:true, stats:{}, games:1}); continue; }
      const one = {}; recordStats(one, g);
      const my = sw ? 1 : 0; w += scoreFor(g.winner, my);
      postMessage({id:m.id, part:true, stats:one, games:1});
    }
    postMessage({id:m.id, score:w / m.n, stats:st, games:0});
  };
}
const POOL_SIZE = Math.max(1, Math.min(6, (navigator.hardwareConcurrency || 2) - 1));
let pool = [], queue = [], pending = new Map(), nextId = 1, job = null, poolErr = null;
let poolUrl = null;
function ensurePool(){
  if (pool.length) return;
  for (let k = 0; k < POOL_SIZE; k++) pool.push(makeWorker());
}
// a finished game's stats count right away, whether or not the rest of its batch ever finishes
function takeGames(d, t){
  mergeStats(d.stats || {}); brain.games += d.games || 0;
  if (d.stats && d.stats.__ctx) brain.ctxEv = deepAdd(brain.ctxEv || {}, d.stats.__ctx);
  if (t && t.job && t.job === job && job.win && t.msg && t.msg.win) mergeStats(d.stats || {}, job.win);
  if (t && t.job && t.job === job && job.kind === 'sim' && d.games){ job.done += d.games; if (!$('view-stats').hidden) renderStats(); if (!$('view-train').hidden) renderTrain(); }
}
function makeWorker(){
  if (!poolUrl) poolUrl = engineWorkerURL(workerMain);
  {
    const w = new Worker(poolUrl); w.busy = false;
    w.onerror = ev => {
      if (ev && ev.preventDefault) ev.preventDefault();
      poolErr = {n:(poolErr ? poolErr.n : 0) + 1, msg:(ev && ev.message) || 'a background worker failed', at:Date.now()}; console.error('SOW worker error', ev && ev.message);
      const t = pending.get(w.taskId); if (t){ pending.delete(w.taskId); t.resolve(null); }
      w.busy = false; pump();
    };
    w.onmessage = e => {
      if (e.data.errs){ poolErr = {n:(poolErr ? poolErr.n : 0) + e.data.errs, msg:e.data.err, at:Date.now()}; console.error('SOW game error', e.data.err); }
      if (e.data.part){ const t = pending.get(e.data.id); if (t) takeGames(e.data, t); return; }
      const t = pending.get(e.data.id); pending.delete(e.data.id); w.busy = false;
      if (!t){ pump(); return; }
      takeGames(e.data, t);
      t.resolve(e.data.score); pump();
    };
    return w;
  }
}
function pump(){
  for (const w of pool){
    if (w.busy || !queue.length) continue;
    const t = queue.shift(), id = nextId++;
    pending.set(id, t); w.busy = true; w.taskId = id;
    w.postMessage(t.msg ? {mo:MIRACLES_ON, bmo:BATTLE_MIR_ON, rf:REFILL_ON, ...t.msg, id, ov:t.ov, syn:SYN} : {cmd:'match', id, A:t.A, B:t.B, n:t.n, depth:t.depth, ov:ovLen(effOV(), LEN), syn:SYN, mo:MIRACLES_ON, bmo:BATTLE_MIR_ON, rf:REFILL_ON});
  }
}
function task(msg, ov){ return new Promise(resolve => { queue.push({msg, ov: ov === undefined ? ovLen(effOV(), LEN) : ov, resolve, job}); pump(); }); }
function match(A, B, n){ return new Promise(resolve => { queue.push({A, B, n, depth:job ? job.depth : null, resolve, job}); pump(); }); }
// split a long match across workers (chunks of 4 games, alternating seats)
async function matchN(A, B, n){
  const chunks = []; for (let k = 0; k < n; k += 4) chunks.push(match(A, B, Math.min(4, n - k)));
  const r = await Promise.all(chunks); return r.reduce((s, x) => s + x, 0) / r.length;
}
function deepAdd(a, b){
  for (const k in b){ if (typeof b[k] === 'number') a[k] = (a[k] || 0) + b[k]; else a[k] = deepAdd(a[k] || {}, b[k]); }
  return a;
}
function mergeStats(st, T){
  T = T || stats;
  for (const k in st){
    if (k === '__games'){ T.__games = (T.__games || 0) + st[k]; continue; }
    if (k === '__ctx') continue;   // buy context goes to the pairing evidence (brain.ctxEv), not the card stats
    if (k === '__first'){ T.__first = deepAdd(T.__first || {}, st[k]); continue; }
    if (k === '__mir'){ T.__mir = deepAdd(T.__mir || {}, st[k]); continue; }
    if (k === '__offer' || k === '__lead' || k === '__base'){ T[k] = deepAdd(T[k] || {}, st[k]); continue; }
    if (k === '__pairs' || k === '__adj' || k === '__units' || k === '__vs' || k === '__sold'){
      const tbl = T[k] || (T[k] = {});
      for (const kk in st[k]){ const s = tbl[kk] || (tbl[kk] = {n:0, w:0}); s.n += st[k][kk].n; s.w += st[k][kk].w; }
      continue;
    }
    const s = T[k] || (T[k] = {n:0, w:0}); s.n += st[k].n; s.w += st[k].w;
  }
}
// Orders suggested to a player are the single best order, never a draw from the AI's mix
const DEPTH_HINT = {...DEPTH.play, mix:0};
/* ---------- Progress bars for training and calibration ----------
   Training: overall steps (with the current step's games), what it's doing now, and for a safety check a meter showing
   where the evidence sits between "roll back" and "keep" (the check ends when the marker reaches either end).
   Calibration: weighted by how long each match-up takes (a game between the deepest AIs takes about 50 times as long
   as two quick ones), so the bar moves at an even pace instead of racing ahead and then stalling on the slow games. */
const fmtDur = ms => { const s = Math.round(ms / 1000); return s < 60 ? `${s} s` : s < 3600 ? `${Math.round(s / 60)} min` : `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`; };
const pbar = (f, sub) => `<div class="pbar${sub ? ' sub' : ''}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(f * 100)}"><i style="width:${(Math.max(0, Math.min(1, f)) * 100).toFixed(1)}%"></i></div>`;
function sprtMeter(m){
  if (!m) return '';
  const pos = Math.max(0, Math.min(1, (m.llr - m.lo) / (m.hi - m.lo))), lean = pos > 0.6 ? 'leaning keep' : pos < 0.4 ? 'leaning roll back' : 'undecided';
  return `<div class="note">${esc(m.label)}: ${m.n} game pairs so far, ${pct(m.v)} score, ${lean}</div>
    <div class="smeter" aria-hidden="true"><i style="left:${(pos * 100).toFixed(1)}%"></i></div><div class="smeter-l"><span>roll back</span><span>keep</span></div>`;
}
function trainProgHTML(){
  if (!job || job.kind !== 'train' || !job.t0) return '';
  const per = ES.dirs * ES.pairs * 2, inStep = job.phase === 'learn' ? Math.min(1, (job.gd || 0) / per) : 1;
  const f = (job.done + (job.phase === 'learn' ? inStep * 0.85 : 0.85 + 0.15 * Math.min(1, (job.chkN || 0) / 80))) / job.total;
  const learn = job.learnMs.length ? job.learnMs.reduce((a, b) => a + b, 0) / job.learnMs.length : null;
  const chk = job.chkMs.length ? job.chkMs.reduce((a, b) => a + b, 0) / job.chkMs.length : null;
  const left = job.total - job.done, checksLeft = Math.floor((brain.gens + left) / ES.every) - Math.floor(brain.gens / ES.every);
  const eta = learn != null ? learn * left + (chk ?? learn * 4) * checksLeft : null;
  const now = job.phase === 'learn' ? `Learning: ${Math.min(per, job.gd || 0)} of ${per} games this step` : job.phase === 'check' ? 'Checks (every ' + ES.every + ' steps)' : 'Saving';
  return `<div class="prog">
    <div class="top"><span>Step <b>${Math.min(job.total, job.done + 1)}</b> of <b>${job.total}</b></span><span class="note">${esc(now)}</span><span class="grow"></span>
      <span class="note">${fmtDur(performance.now() - job.t0)} so far${eta != null ? ` · about ${fmtDur(eta)} left` : ''}</span></div>
    ${pbar(f)}
    ${job.phase === 'learn' ? pbar(inStep, true) : ''}
    ${job.phase === 'check' && !(job.sprt && job.sprt.gate) ? `<div class="note">Safety check: playing the first batch of game pairs…</div>` : ''}
    ${job.phase === 'check' ? sprtMeter(job.sprt && job.sprt.gate) + sprtMeter(job.sprt && job.sprt.hof) + (job.progN != null ? `<div class="note">Progress check for the chart: ${job.progN} of ${ES.progPairs * 2} games</div>` : '') : ''}
  </div>`;
}
let progRaf = 0;
function paintProg(){
  if (progRaf) return;
  progRaf = requestAnimationFrame(() => { progRaf = 0;
    const t = $('trainprog'); if (t) t.innerHTML = trainProgHTML();
    const c = $('calprog'); if (c) c.innerHTML = calProgHTML();
  });
}
// how long a calibration game between two levels takes, roughly (in units of a quick game)
const RUNG_COST = r => r.random ? 0.5 : r.novice ? 0.8 : ({s1:1, s2:1.5, g1:3, fast:6, train:12, t2:20, play:40, master:120})[r.depth] || 10;
function calProgHTML(){
  if (!calState.busy || !calState.plan) return '';
  const P = calState.plan, W = P.reduce((s, x) => s + x.w * x.batches, 0), D = P.reduce((s, x) => s + x.w * x.done, 0);
  const el = performance.now() - calState.t0, eta = D > 0 ? el * (W - D) / D : null;
  const games = P.reduce((s, x) => s + x.done * x.per, 0), totalGames = P.reduce((s, x) => s + x.batches * x.per, 0);
  return `<div class="prog">
    <div class="top"><span><b>${pct(W ? D / W : 0)}</b> calibrated</span><span class="note">${games} of ${totalGames} games</span><span class="grow"></span>
      <span class="note">${fmtDur(el)} so far${eta != null && D / W > 0.02 ? ` · about ${fmtDur(eta)} left` : ''}</span></div>
    ${pbar(W ? D / W : 0)}
    <details><summary class="note">Match-ups</summary><div class="rows" style="margin-top:6px">${P.map(x => `<span>${esc(RUNGS[x.a].label)} vs ${esc(RUNGS[x.b].label)}</span><span class="mono">${x.done * x.per}/${x.batches * x.per}</span>`).join('')}</div></details>
    ${poolErr ? `<p class="note err">${poolErr.n} game${poolErr.n === 1 ? '' : 's'} hit an error and ${poolErr.n === 1 ? 'was' : 'were'} skipped. Copy this to Claude: ${esc(String(poolErr.msg).split('\n').slice(0, 3).join(' | '))}</p>` : ''}
  </div>`;
}
const thinkDepth = () => DEPTH.train;   // training and stat games always use the thinking AI
function refreshViews(){ if (!$('view-train').hidden) renderTrain(); if (!$('view-stats').hidden) renderStats(); if (!$('view-lab').hidden) renderLab(); }
// Training (evolution strategies). Each step tests ES.dirs random directions: the AI nudged one way plays the AI
// nudged the opposite way on seeded, seat-swapped game pairs, and the weights move toward whichever side did better,
// averaged over all directions and smoothed with momentum. Every ES.every steps: card opinions update from the
// trainer's own card stats, the AI is tested against the last checkpoint (and rolled back if clearly worse), and
// against the untrained AI for the progress chart.
const newSeed = () => (Math.random() * 2147483647) | 0;
// Seat-swapped pairs, played in batches until the SPRT decides. Returns {v (mean score), n (pairs), llr, verdict}.
async function sprtTask(A, B, R, onBatch){
  R = R || SPRT;
  const xs = [], batch = Math.max(R.minPairs, POOL_SIZE * 8);
  let verdict = null;
  while (!verdict){
    const want = Math.min(batch, R.maxPairs - xs.length), chunks = [];
    for (let k = 0; k < want; k += 4){ const seeds = Array.from({length:Math.min(4, want - k)}, newSeed); chunks.push(task({cmd:'pairs', A, B, seeds, depth:job ? job.depth : null, each:true})); }
    const rs = await Promise.all(chunks);
    if (job && job.stop) return null;
    for (const r of rs) if (Array.isArray(r)) xs.push(...r);
    verdict = sprtDecide(xs, R);
    if (onBatch){ const b = sprtBounds(R); onBatch({n:xs.length, v:xs.reduce((a, c) => a + c, 0) / xs.length, llr:sprtLLR(xs, R), lo:b.lo, hi:b.hi}); }
  }
  return {v:xs.reduce((a, b) => a + b, 0) / xs.length, n:xs.length, llr:+sprtLLR(xs, R).toFixed(2), verdict};
}
function pairsTask(A, B, n, win){
  const chunks = [];
  for (let k = 0; k < n; k += 4){ const seeds = Array.from({length:Math.min(4, n - k)}, newSeed); chunks.push(task({cmd:'pairs', A, B, seeds, depth:job ? job.depth : null, win:!!win}).then(s => { if (job && job.onGames) job.onGames(seeds.length * 2, win); return (s == null ? 0.5 : s) * seeds.length; })); }
  return Promise.all(chunks).then(r => r.reduce((a, x) => a + x, 0) / n);
}
async function startTrain(steps){
  if (job || isPlayer()) return;
  ensurePool();
  job = {kind:'train', total:steps, done:0, stop:false, depth:thinkDepth(), win:{}, t0:performance.now(), phase:'learn', gd:0, learnMs:[], chkMs:[], sprt:{}};
  TKEYS = job.depth ? TKEYS_SEARCH : TKEYS_ALL;
  job.onGames = (n, learning) => { if (learning) job.gd += n; else if (job.progN != null) job.progN += n; paintProg(); };
  refreshViews();
  let G = brain.champ, x = toVec(G), mom = (brain.mom && brain.mom.length === x.length) ? brain.mom : x.map(() => 0);
  for (let s = 1; s <= steps && !job.stop; s++){
    job.phase = 'learn'; job.gd = 0; const tStep = performance.now(); paintProg();
    const dirs = Array.from({length:ES.dirs}, () => ({eps:randDir(x.length, Math.random)}));
    const fs = await Promise.all(dirs.map(d => pairsTask(
      fromVec(x.map((v, i) => v + ES.sigma * d.eps[i]), G), fromVec(x.map((v, i) => v - ES.sigma * d.eps[i]), G), ES.pairs, true)));
    if (job.stop) break;
    dirs.forEach((d, k) => { d.f = fs[k]; });
    const g = esGrad(dirs, ES.sigma);
    mom = mom.map((m, i) => ES.mom * m + (1 - ES.mom) * g[i]);
    x = esApply(x, mom, ES.lr, ES.maxStep); G = fromVec(x, G);
    brain.gens++; job.learnMs.push(performance.now() - tStep);
    if (brain.gens % ES.every === 0){
      G = {...G, bias:biasStep(G.bias || {}, job.win), ctx:{}}; job.win = {};   // learned pairings retired: a head-to-head showed no effect

      const ck = brain.ckpt || brain.champ, hof = brain.hof || [];
      const hm = hof.length ? hof[(brain.hofNext || 0) % hof.length] : null;
      const prog = brain.gens % ES.progEvery === 0, tChk = performance.now();
      job.phase = 'check'; job.sprt = {}; job.progN = prog ? 0 : null; job.chkN = 0; paintProg();
      const onB = key => m => { job.sprt[key] = {...m, label:key === 'gate' ? 'Safety check against the last checkpoint' : `Hall of fame check against the step-${hm.g} champion`}; job.chkN = Math.max(job.chkN, m.n); paintProg(); };
      const [gate, hg, vb] = await Promise.all([sprtTask(G, ck, SPRT, onB('gate')), hm ? sprtTask(G, hm.G, HOF_SPRT, onB('hof')) : null, prog ? pairsTask(G, baseGenome(), ES.progPairs) : null]);
      if (job.stop || !gate || (hm && !hg)) break;
      if (hm) brain.hofNext = ((brain.hofNext || 0) + 1) % hof.length;
      const lg = {g:brain.gens, v:gate.v, n:gate.n};
      if (hm) lg.hof = {g:hm.g, v:hg.v, n:hg.n, pass:hg.verdict === 'keep'};
      if (gate.verdict === 'revert' || (hg && hg.verdict === 'revert')){
        lg.reverted = true; lg.why = gate.verdict === 'revert' ? 'ckpt' : 'hof';
        // the same past champion keeps winning: it was simply better, so bring it back
        const st = brain.hofStrikes && hm && brain.hofStrikes.g === hm.g ? brain.hofStrikes.k + 1 : 1;
        brain.hofStrikes = lg.why === 'hof' ? {g:hm.g, k:st} : null;
        if (lg.why === 'hof' && st >= HOF.strikes){ G = clone(hm.G); brain.ckpt = G; brain.hofStrikes = null; lg.restored = hm.g; }
        else G = clone(ck);
        x = toVec(G); mom = x.map(() => 0); brain.reverts = (brain.reverts || 0) + 1;
      } else {
        brain.ckpt = G; brain.hofStrikes = null;
        if (!hof.length || brain.gens - hof[hof.length - 1].g >= HOF.every){
          brain.hof = hof.concat([{g:brain.gens, G:clone(G)}]).slice(-HOF.keep);
          lg.added = true;
        }
      }
      brain.lastGate = lg; job.chkMs.push(performance.now() - tChk);
      if (prog && vb != null) brain.history.push({g:brain.gens, v:vb, n:ES.progPairs});
    }
    brain.champ = G; brain.mom = mom;
    saveBrain(); saveStats(); job.done = s; refreshViews();
  }
  saveBrain(); saveStats(); job = null; refreshViews(); shareWithClaude();
}
async function startSim(n){
  if (job || isPlayer()) return;
  ensurePool();
  job = {kind:'sim', total:n, done:0, stop:false, depth:thinkDepth()};
  refreshViews();
  const tasks = []; for (let k = 0; k < n; k += 10) tasks.push(match(brain.champ, brain.champ, Math.min(10, n - k)));
  await Promise.all(tasks);
  saveBrain(); saveStats(); job = null; refreshViews(); shareWithClaude();
}
function stopJob(){
  if (!job || job.kind === 'lab') return;
  const J = job; J.stop = true;
  queue = queue.filter(t => { if (t.job !== J) return true; t.resolve(null); return false; });
  pool = pool.map(w => {
    const t = w.busy ? pending.get(w.taskId) : null;
    if (!t || t.job !== J) return w;
    w.terminate(); pending.delete(w.taskId); t.resolve(null);
    return makeWorker();
  });
  saveStats(); saveBrain(); refreshViews(); pump();
}

