/* ===================== MATCH RECORDER =====================
   Games against the AI are recorded: the board before every shop action, every action, the AI's reasoning for its
   own choices, both armies each battle and the result. Kept in this browser (the last MATCH_KEEP games) so a game
   can be copied and pasted to Claude for review. */
const MATCH_KEY = 'sow-matches-v1', MATCH_KEEP = 12;
const recDeck = d => (d || []).map(u => u.name + (u.copies > 1 ? ' x' + u.copies : '') + (u.arm ? ' +arm' + u.arm : '') + (u.tr ? ' +train' + u.tr : '') + (u.sh ? ' +shield' + u.sh : ''));
const recSide = (g, i) => { const p = g.players[i]; const o = {money:p.money, points:total(p), income:income(p), units:{...p.hand}, buildings:{...p.city}}; if (p.mir && p.mir.length) o.miracles = clone(p.mir); return o; };
function recSnap(g){
  return {round:g.round, you:recSide(g, 0), ai:recSide(g, 1),
    market:{units:g.disp.u.map(c => c.mir && c.mir.length ? {card:c.name, miracles:clone(c.mir)} : c.name), buildings:g.disp.b.map(c => c.mir && c.mir.length ? {card:c.name, miracles:clone(c.mir)} : c.name)},
    muster:g.muster && g.muster.length ? clone(g.muster) : undefined,
    buysLeft:g.buys ? {you:{...g.buys[0]}, ai:{...g.buys[1]}} : undefined};
}
function recStart(g, opp){
  const sk = g.players[1].skill;
  g.rec = {format:'SOW match record v1', id:Date.now(), started:new Date().toISOString(), firstTo:g.target,
    opponent:opp ? `${opp.rated ? 'rated' : 'unrated'} opponent ${opp.rating}` : 'full-strength AI (unrated)', rules:g.suLines || 'Default',
    aiLevel:sk ? (sk.hi ? `budget ${Math.round((sk.t || 0) * 100)}% of the way from ${sk.lo.label} to ${sk.hi.label}` : sk.lo.label) : 'Thinks deepest (full strength, unrated)',
    cards:{units:clone(DEFS), buildings:clone(BDEFS)}, events:[], battles:[]};
}
function recSave(g){
  if (!g || !g.rec) return;
  const r = g.rec; r.updated = new Date().toISOString();
  r.result = g.over ? (g.winner === 0 ? 'you won' : g.winner === 1 ? 'AI won' : 'draw') : 'unfinished';
  r.finalPoints = {you:total(g.players[0]), ai:total(g.players[1])};
  let all = LS.get(MATCH_KEY) || [];
  all = [r].concat(all.filter(x => x.id !== r.id)).slice(0, MATCH_KEEP);
  LS.set(MATCH_KEY, all);
  const back = LS.get(MATCH_KEY);
  if (!back || !back.length || back[0].id !== r.id) LS.set(MATCH_KEY, all.slice(0, 3));   // storage full: keep fewer
}
function recBattle(g){
  if (!g.rec) return;
  const lb = g.lastBattle || {}, mw = g._mobWhy && g._mobWhy[1];
  g.rec.battles.push({round:g.round, you:recDeck(g.decks[0]), ai:recDeck(g.decks[1]),
    winner:lb.w === 0 ? 'you' : lb.w === 1 ? 'AI' : 'draw', why:lb.res && lb.res.result ? lb.res.result.why : undefined,
    pointsAfter:{you:total(g.players[0]), ai:total(g.players[1])},
    aiThinking:mw ? {level:g._mobLevel || 'full search', ...mw} : undefined});
  g._mobWhy = null; g._mobLevel = null;
  recSave(g);
}
// every shop action (yours and the AI's) is recorded with the board as it was just before (the engine's SHOP_WATCH)
const REC_ACT = {buy:'buy', sell:'sell', pass:'pass', useBM:'black market', useFavor:'divine favor', useVision:'vision', useDisc:'patronage', useWrit:'salvage writ', useFreeze:'freeze', useRedeal:'upheaval'};
SHOP_WATCH = {
  before(g, i, name){
    if (!g || !g.rec) return null;
    const before = recSnap(g), n0 = g.log.length, why = i === 1 ? g._why : null;
    if (i === 1) g._why = null;
    return {g, i, name, before, n0, why};
  },
  after(t, r){
    if (!t || r === false) return;
    const ev = {round:t.before.round, who:t.i === 0 ? 'you' : 'AI', act:REC_ACT[t.name] || t.name, text:t.g.log.slice(t.n0).map(x => x.t).join(' '), before:t.before};
    if (t.why) ev.aiThinking = t.why;
    t.g.rec.events.push(ev);
  }
};
function recText(r){ return 'SOW match record. Paste this to Claude to review the game.\n' + JSON.stringify(r); }
function copyMatch(r){
  if (!r){ showToast('No recorded game yet.'); return; }
  copyText(recText(r), 'Copy this match', 'Match copied. Paste it to Claude.');
}
// Copies text to the clipboard; where the browser won't allow it, shows the text in a box to select and copy by hand
// (match records, battle codes)
function copyText(text, title, done){
  const fallback = () => {
    const w = document.createElement('div'); w.className = 'remind';
    w.innerHTML = `<div class="remindbox"><h3>${esc(title)}</h3><p class="note">Select all of the text below, copy it, and paste it to Claude.</p><textarea readonly style="min-height:200px"></textarea><div class="row"><span class="grow"></span><button type="button" class="primary">Done</button></div></div>`;
    const ta = w.querySelector('textarea'); ta.value = text;
    w.querySelector('button').onclick = () => w.remove();
    document.body.appendChild(w); ta.focus(); ta.select();
  };
  try{ navigator.clipboard.writeText(text).then(() => showToast(done), fallback); }catch(e){ fallback(); }
}
function matchesHTML(){
  const all = LS.get(MATCH_KEY) || [];
  if (!all.length) return '';
  return `<details><summary class="note">Recorded games (${all.length}): copy one to paste to Claude</summary><div class="list" style="margin-top:6px">${all.map(r => `<div class="li"><span class="nm" style="font-weight:400">${esc(new Date(r.id).toLocaleString())} · ${esc(r.result || 'unfinished')}${r.finalPoints ? ` ${r.finalPoints.you}–${r.finalPoints.ai}` : ''} · ${esc(r.aiLevel || '')}</span><button type="button" class="small" data-act="rec-copy" data-id="${r.id}">Copy</button></div>`).join('')}</div></details>`;
}
function newPlay(opp){
  stopTimers();
  const custom = !suIsDefault(), su = setupForGame();
  if (opp && custom) opp = {...opp, rated:false, placement:false};   // custom rules are never rated
  const genome = opp && CAL ? clone(CAL.genome) : clone(brain.champ);
  G = newGame({genomes:[null, genome], labels:['You','AI'], om:[null, loadOm()], target:gameTarget(), su});
  G.suLines = custom ? suLines(su, gameTarget(), {mir:MIRACLES_ON, bmir:MIRACLES_ON && BATTLE_MIR_ON, rf:REFILL_ON}, ['You', 'AI']) : null;
  G.opp = opp || null;
  if (opp && CAL){ G.players[1].skill = skillFor(opp.rating); novicePersona(G, 1); }   // Novice: its personality is rolled once per game, here
  recStart(G, opp);
  ui = freshUI({roll:newRoll()});
  renderPlay();
}
// What the AI has learned about how you order your army, carried between games in this browser. Older games count
// half as much each time a new game starts, so it keeps up if you change your habits.
function loadOm(){
  const m = LS.get('sow-om-v1'); if (!m || !m.n) return null;
  const s = {}, c = {}; for (const k in m.c){ s[k] = (m.s[k] || 0) * 0.5; c[k] = m.c[k] * 0.5; }
  return {n:m.n * 0.5, s, c};
}
const OM_SAY = {strong:'lead with your strongest units', last:'field your units in the same order as last battle', weak:'lead with your weakest units'};
function noteOm(){
  const m = G.om && G.om[1]; if (!m) return;
  LS.set('sow-om-v1', m);
  let best = null; for (const k in OM_SAY){ if (!m.c[k]) continue; const a = omAcc(m, k); if (!best || a > best.a) best = {k, a}; }
  if (best && best.a >= 0.6 && m.n >= 2 && G.omSaid !== best.k){ G.omSaid = best.k; G.log.push({t:`The AI has noticed you tend to ${OM_SAY[best.k]}.`, side:1}); }
}
/* Opening roll: each side rolls 2d6, high total shops first, ties roll again. */
const PIPS = {1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8]};
const dieHTML = (v, side) => `<span class="die s${side}" data-v="${v || ''}">${[...Array(9)].map((_, k) => `<i${v && PIPS[v].includes(k) ? ' class="on"' : ''}></i>`).join('')}</span>`;
const d6 = () => 1 + Math.floor(Math.random() * 6);
function rollHTML(){
  const r = ui.roll, sum = a => a ? a[0] + a[1] : null;
  const pair = (who, side, vals) => `<div class="rollside s${side}"><span class="who">${who}</span><div class="dice" id="dice-${side}">${dieHTML(vals && vals[0], side)}${dieHTML(vals && vals[1], side)}</div><span class="rtot">${vals && !r.rolling ? sum(vals) : '&nbsp;'}</span></div>`;
  let msg;
  if (r.rolling) msg = 'Rolling…';
  else if (r.first != null) msg = PP() ? `${esc(nm(r.first))} rolled higher and shops first.` : r.first === 0 ? 'You rolled higher. You shop first.' : 'The AI rolled higher. It shops first.';
  else if (r.tie) msg = `Tie at ${sum(r.you)}. Roll again.`;
  else msg = 'Roll two dice. The higher total shops first in round 1.';
  const btn = r.first != null
    ? `<button type="button" class="primary big" data-act="roll-go">Go to the round 1 shop</button>`
    : `<button type="button" class="primary big" data-act="roll" ${r.rolling ? 'disabled' : ''}>${r.tie ? 'Roll again' : 'Roll the dice'}</button>`;
  return `<div class="panel rollp">
    <h2>Who goes first?</h2>
    <div class="rollrow">${pair(PP() ? esc(nm(0)) : 'You', 0, r.you)}<span class="rvs" aria-hidden="true">vs</span>${pair(PP() ? esc(nm(1)) : 'AI', 1, r.ai)}</div>
    <p class="rmsg${r.first === 0 ? ' a' : r.first === 1 ? ' b' : ''}" role="status">${msg}</p>
    ${btn}
  </div>`;
}
function doRoll(){
  const r = ui.roll; if (!r || r.rolling) return;
  const you = [d6(), d6()], ai = [d6(), d6()];
  let first = null; if (you[0] + you[1] !== ai[0] + ai[1]) first = you[0] + you[1] > ai[0] + ai[1] ? 0 : 1;
  const finish = () => { Object.assign(r, {you, ai, rolling:false, tie:first == null, first}); if (G) G.firstOverride = first; renderPlay();
    if (first === 0 || (PP() && first != null)) setTimeout(() => sfx.coin(0.6), 120); };
  if (reduceMotion()){ finish(); return; }
  r.rolling = true; r.you = [d6(), d6()]; r.ai = [d6(), d6()]; renderPlay();
  // tumble: faces flicker and slow down, yours land a beat before the AI's
  const t0 = performance.now(), YOU_MS = 750, AI_MS = 1150;
  let next = 0; const landed = [false, false];
  const tick = now => {
    if (ui.roll !== r) return;
    const t = now - t0;
    if (t >= next){
      next = t + 45 + t * 0.12;
      let ticked = false;
      for (const side of [0, 1]){
        const done = t >= (side ? AI_MS : YOU_MS), vals = side ? ai : you;
        const box = $('dice-' + side); if (!box) continue;
        if (done && !landed[side]){ landed[side] = true; sfx.die(); setTimeout(() => sfx.die(), 70); }
        else if (!done && !ticked){ ticked = true; sfx.tick(); }
        box.classList.toggle('tumbling', !done);
        box.innerHTML = (done ? vals : [d6(), d6()]).map(v => dieHTML(v, side)).join('');
      }
    }
    if (t < AI_MS + 120) requestAnimationFrame(tick); else finish();
  };
  requestAnimationFrame(tick);
}
/* ===================== AI THINKING IN THE BACKGROUND =====================
   The AI's shop turns and Mobilize choices run in their own worker, so the page stays responsive while it thinks.
   The worker gets a copy of the game, decides, and sends back the actions it took (buy, pass, Black Market...) in
   order; the page then makes exactly those moves on the real game. If the worker can't be used, the AI thinks here. */
let aiW = null, aiWSeq = 0, aiBusy = false;
const aiWPending = new Map();
function aiWorkerMain(){
  let ROOT = null, LOG = null;
  // report the actions the AI takes on the game it was sent (not the copies it searches with)
  SHOP_WATCH = { before(g, i, name, args){ if (g === ROOT && LOG) LOG.push({fn:name, args:[i, ...args], why:g._why || null}); }, after(){} };
  self.onmessage = e => {
    const m = e.data;
    try{
      applyOverrides(m.ov); if (m.syn) SYN = m.syn;
      const g = m.g; g.rnd = mulberry32(m.seed); g.log = []; if (m.rec) g.rec = true;
      ROOT = g; LOG = [];
      if (m.cmd === 'shop'){ aiShopTurn(g, m.i, m.depth); postMessage({id:m.id, acts:LOG}); }
      else { const deck = aiMobilize(g, m.i, m.K, m.depth) || []; postMessage({id:m.id, deck, omPending:g.omPending, mobWhy:g._mobWhy || null, mobLevel:g._mobLevel || null}); }
    }catch(err){ postMessage({id:m.id, error:String((err && err.message) || err)}); }
    finally { ROOT = null; LOG = null; }
  };
}
function aiWorker(){
  if (aiW !== null) return aiW;
  try{
    aiW = new Worker(engineWorkerURL(aiWorkerMain));
    aiW.onmessage = e => { const t = aiWPending.get(e.data.id); if (t){ aiWPending.delete(e.data.id); t(e.data); } };
    aiW.onerror = () => { aiW = false; for (const t of aiWPending.values()) t(null); aiWPending.clear(); };
  }catch(e){ aiW = false; }
  return aiW;
}
function gameForWorker(g){
  const o = {};
  for (const k in g){ const v = g[k]; if (typeof v === 'function' || k === 'rec' || k === 'log' || k === '_why' || k === '_mobWhy' || k === 'battles' || k === 'lastBattle' || k === '_es') continue; o[k] = v; }
  return o;
}
function aiThink(cmd, extra){
  return new Promise(res => {
    const w = aiWorker(); if (!w){ res(null); return; }
    const id = ++aiWSeq; aiWPending.set(id, res);
    try{ w.postMessage({id, cmd, g:gameForWorker(G), i:1, seed:(Math.random() * 2147483647) | 0, rec:!!G.rec, ov:ovLen(effOV(), LEN), syn:SYN, ...extra}); }
    catch(e){ aiWPending.delete(id); res(null); }
  });
}
// Against the AI, it sets its Mobilize deck while you set yours (Brian, Nov 24): the thinking starts as soon as
// Mobilize is on screen (a renderPlay step), from the same public information as before (your deck is never sent), and
// Lock in uses the answer (lockDeck), waiting for it with "Waiting for other player…" if it isn't in yet.
let AIMOB = null;   // {g, round, p (the promise), r (the answer once in)}
function aiMobStart(){
  if (!G || PP() || G.net || G.over || G.phase !== 'mobilize' || ui.battle || ui.start || ui.roll || ui.planning) return;
  if (AIMOB && AIMOB.g === G && AIMOB.round === G.round) return;
  const a = AIMOB = {g:G, round:G.round, r:undefined};
  a.p = aiThink('mob', {K:60, depth:AI_DEPTH()}).then(r => (a.r = r));
}
function aiMobResult(){
  if (!(AIMOB && AIMOB.g === G && AIMOB.round === G.round)){ AIMOB = null; aiMobStart(); }
  return AIMOB ? AIMOB.p : aiThink('mob', {K:60, depth:AI_DEPTH()});
}
// the depth the AI plays at when no rated level is set (today's full-strength AI)
const AI_DEPTH = () => DEPTH.master;
function scheduleAI(){
  if (aiTimer || aiBusy || !G || PP() || G.phase !== 'shop' || cur(G) !== 1) return;
  aiTimer = setTimeout(async () => { aiTimer = null; if (!G || G.phase !== 'shop' || cur(G) !== 1) return;
    if (oppBusy()){ oppOnIdle(scheduleAI); return; }   // let its last moves finish playing out first
    const g0 = G, before = {u:G.disp.u.map(c => c.name), b:G.disp.b.map(c => c.name), at:{u:G.disp.u.map(c => c.at), b:G.disp.b.map(c => c.at)}}, m0 = G.players[1].money, n0 = G.log.length;
    aiBusy = true; let r = null;
    try{ r = await aiThink('shop', {depth:AI_DEPTH()}); } finally { aiBusy = false; }
    if (G !== g0 || G.phase !== 'shop' || cur(G) !== 1) return;   // the game moved on while it thought
    snapNow();   // where every card sits before the AI moves, so its buys fly from the right spot
    if (r && !r.error && r.acts){
      for (const a of r.acts){ if (a.why) G._why = a.why; const f = window[a.fn]; if (typeof f === 'function') f(G, ...a.args); }
    }
    if (G.log.length === n0 && G.phase === 'shop' && cur(G) === 1) aiShopTurn(G, 1, AI_DEPTH());   // no worker, or nothing usable came back
    const queued = motionFrom(1, n0);
    noteAIMoves(before, m0, n0, queued); afterAction();
  }, Math.max(650, (ui.dealUntil || 0) - performance.now() + 350));
}
