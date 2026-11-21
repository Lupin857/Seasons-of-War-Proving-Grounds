/* ===================== KEEP SCROLL ON RE-RENDER ===================== */
// The Train, Card stats and Lab views redraw while jobs run. Redrawing replaces their HTML, which resets every
// scrolled table to the top and can nudge the page. Remember the page and each scroll box's position, and put them back.
function keepScroll(id){
  const root = $(id); if (!root) return () => {};
  const sel = '.stickywrap, .tablewrap, .opinions, .linewrap, .chron, .log, .colpick';
  const y = window.scrollY, x = window.scrollX;
  const boxes = [...root.querySelectorAll(sel)].map(el => [el.scrollTop, el.scrollLeft]);
  const h = root.offsetHeight;
  root.style.minHeight = h + 'px';   // hold the height while the new HTML goes in, so the page can't shrink and jump
  return () => {
    [...root.querySelectorAll(sel)].forEach((el, k) => { const b = boxes[k]; if (b){ el.scrollTop = b[0]; el.scrollLeft = b[1]; } });
    root.style.minHeight = '';
    if (window.scrollY !== y || window.scrollX !== x) window.scrollTo(x, y);
  };
}
for (const [name, id] of [['renderStats','view-stats'], ['renderTrain','view-train'], ['renderLab','view-lab']]){
  const f = window[name];
  window[name] = function(){ const done = keepScroll(id); try{ return f.apply(this, arguments); } finally { done(); } };
}

/* ===================== SHARE WITH CLAUDE (db) ===================== */
// Saves this browser's stats, AI and lab state to the artifact's database so Claude can read the same numbers.
// Everything is stored as JSON text in a few documents under "sync/".
let dbns = null, syncState = {ready:false, last:LS.get('sow-sync-last'), busy:false, err:null};
// The startup sync (sign-in, stats, AI) runs at the end of js/ui/17-card-peek-tooltips.js, after every UI file has loaded.
function syncBarHTML(){
  if (!syncState.ready || isPlayer()) return '';
  if (!dbns) return `<p class="note">Sharing with Claude isn't available in this view. Open the page in claude.ai while signed in.</p>`;
  const when = syncState.last ? new Date(syncState.last).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : 'never';
  return `<div class="row syncbar"><button type="button" data-act="sync" ${syncState.busy ? 'disabled' : ''}>${syncState.busy ? 'Sharing…' : 'Share data with Claude'}</button>
    <span class="note">${syncState.err ? `<span class="err">Couldn't share: ${esc(syncState.err)}.</span> ` : ''}Last shared: ${esc(when)}. Shares automatically after each training, stat or lab run, so Claude can read the same numbers you see.</span></div>`;
}
async function shareWithClaude(){
  if (!dbns || syncState.busy || isPlayer()) return;
  syncState.busy = true; syncState.err = null; refreshViews();
  try{
    // the server copy is the backup: a browser with fewer games (empty storage, another device) doesn't overwrite it
    let skipStats = false;
    try{
      const m = await dbns.doc(syncPath('meta', LEN)).get(), theirs = m.exists && m.data().sheet === SHEET_VER ? (m.data().games || 0) : 0, mine = stats.__games || 0;
      const cleared = LS.get(lenKey('sow-stats-cleared', LEN)) || 0;
      if (mine < theirs && !(cleared > ((m.exists && m.data().at) || 0))) skipStats = true;
    }catch(e){}
    const base = {}; for (const k in stats) if (!['__pairs','__adj','__vs'].includes(k)) base[k] = stats[k];
    const parts = {
      stats: base, pairs: stats.__pairs || {}, adj: stats.__adj || {}, vs: stats.__vs || {},
      brain: {...brain, ctxEv:undefined},   // the raw pairing evidence is too big to share; ctx below summarizes it
      ctx: Object.fromEntries(Object.entries(ctxEdges(brain.ctxEv || {})).filter(([k, e]) => e.n >= 50).map(([k, e]) => [k, [Math.round(e.n), +e.edge.toFixed(4), +e.z.toFixed(2)]])),
      balance: {overrides:OV, changes:describeOverrides(OV), labResults, comboTableStale:synStale()},
    };
    if (skipStats) for (const k of ['stats', 'pairs', 'adj', 'vs']) delete parts[k];
    for (const [k, v] of Object.entries(parts)){
      const json = JSON.stringify(v);
      if (json.length > 240000){ syncState.err = `the ${k} data is too large to share`; continue; }
      await dbns.doc(syncPath(k, LEN)).set({json, at:Date.now()});
    }
    if (!skipStats) await dbns.doc(syncPath('meta', LEN)).set({at:Date.now(), games:stats.__games || 0, gens:brain.gens, length:LEN, page:'SOW Proving Grounds', sheet:SHEET_VER});
    syncState.last = Date.now(); LS.set('sow-sync-last', syncState.last);
  }catch(e){ syncState.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'unknown error'; }
  syncState.busy = false; refreshViews();
}
document.addEventListener('click', e => { const t = e.target.closest('[data-act="sync"]'); if (t && !t.disabled) shareWithClaude(); });

/* ===================== ONE AI EVERYWHERE (db: ai/brain[-t<L>] + aibrain/[t<L>]c<k>) ===================== */
// Each length's trained AI lives on the server so every device uses the same one. The meta document holds
// {at, gens, games, n, by}; the AI itself (weights, card opinions, evidence) is JSON text split across n chunk
// documents, each tagged with the same "at" so a half-written save is never read. First to 3 keeps its original paths.
const AI_CHUNK = 150000, AI_TAB = Math.random().toString(36).slice(2);
const metaPath = L => L === 3 ? 'ai/brain' : `ai/brain-t${L}`;
const chunkPath = (L, k) => L === 3 ? 'aibrain/c' + k : `aibrain/t${L}c${k}`;
let aiSync = {ready:false, busy:false, err:null, at:null, pendingPush:false};
let aiPushTimer = null, aiUnsub = null;
function queueBrainPush(){
  if (!dbns) return;
  clearTimeout(aiPushTimer);
  aiPushTimer = setTimeout(function go(){
    if (job){ aiPushTimer = setTimeout(go, 2000); return; }   // training saves every step; send once it finishes
    pushBrain();
  }, 1500);
}
async function pushBrain(){
  if (!dbns || isPlayer()) return;
  if (aiSync.busy){ aiSync.pendingPush = true; return; }
  aiSync.busy = true; aiSync.err = null;
  const L = LEN, b = brain;
  try{
    if (!b.at) b.at = Date.now();
    // each server document holds at most 256 KB once stored, and quotes inside the text take extra room there,
    // so cut the AI into pieces by their stored size rather than by a fixed number of characters
    const at = b.at, json = JSON.stringify(b), chunks = [];
    for (let i = 0; i < json.length; ){
      let len = Math.min(AI_CHUNK, json.length - i);
      while (len > 1000 && JSON.stringify(json.slice(i, i + len)).length > AI_CHUNK) len = Math.floor(len * 0.8);
      chunks.push(json.slice(i, i + len)); i += len;
    }
    const n = chunks.length;
    if (n > 60) throw {code:'the AI is too large to store'};
    for (let k = 0; k < n; k++) await dbns.doc(chunkPath(L, k)).set({at, k, n, json:chunks[k]});
    await dbns.doc(metaPath(L)).set({at, n, gens:b.gens || 0, games:b.games || 0, by:AI_TAB});
    if (L === LEN) aiSync.at = at;
    LS.set(brainKey(L), b);
  }catch(e){ aiSync.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'unknown error'; }
  aiSync.busy = false; refreshViews();
  if (aiSync.pendingPush){ aiSync.pendingPush = false; pushBrain(); }
}
// read the server copy described by a meta document; null if it's missing or mid-save
async function readServerBrain(meta, L){
  const parts = await Promise.all(Array.from({length:meta.n}, (_, k) => dbns.doc(chunkPath(L, k)).get()));
  if (parts.some(p => !p.exists || p.data().at !== meta.at)) return null;
  const b = jparse(parts.map(p => p.data().json).join(''));
  return b && b.champ ? b : null;
}
function adoptBrain(b, at, L){
  const nb = cardFresh({...b, at});
  brains[L] = nb; LS.set(brainKey(L), nb);
  if (L !== LEN) return;
  brain = nb; aiSync.at = at;
  if (typeof gameIsFresh === 'function' && gameIsFresh() && !G.opp) newPlay(null); else refreshStart();
  refreshViews();
}
async function startAiSync(){
  brainLive = !isPlayer();
  const L = LEN;
  if (aiUnsub){ try{ aiUnsub(); }catch(e){} aiUnsub = null; }
  aiSync = {ready:false, busy:false, err:null, at:null, pendingPush:false};
  if (!dbns){ aiSync.ready = true; return; }
  try{
    const snap = await dbns.doc(metaPath(L)).get();
    if (L !== LEN) return;   // the length changed while this was loading; that switch started its own sync
    if (isPlayer()){
      // players never send anything; they take the server's AI when it is newer than what they have
      if (snap.exists){ const meta = snap.data(); if (!brain.at || meta.at > brain.at){ const b = await readServerBrain(meta, L); if (b) adoptBrain(b, meta.at, L); } else aiSync.at = brain.at; }
    } else if (snap.exists){
      const meta = snap.data();
      if (brain.at && brain.at === meta.at) aiSync.at = meta.at;
      // this browser has changes newer than the server, or an older-style save with more training: it wins
      else if ((brain.at && brain.at > meta.at) || (!brain.at && (brain.gens || 0) > (meta.gens || 0))) await pushBrain();
      else { const b = await readServerBrain(meta, L); if (b) adoptBrain(b, meta.at, L); }
    } else {
      // first time for this length: start from the most-trained AI available
      if (L === 3){
        let shared = null;
        try{ const s = await dbns.doc('sync/brain').get(); if (s.exists){ const b = jparse(s.data().json); if (b && b.champ) shared = b; } }catch(e){}
        if (shared && (shared.gens || 0) > (brain.gens || 0)){ brain = cardFresh({...shared}); brains[3] = brain; }
      }
      brain.at = brain.at || Date.now();
      await pushBrain();
    }
  }catch(e){ aiSync.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'unknown error'; }
  if (L !== LEN) return;
  aiSync.ready = true; refreshViews();
  // follow the server copy live: training on another device shows up here
  aiUnsub = dbns.doc(metaPath(L)).onSnapshot(async snap => {
    if (!snap.exists || L !== LEN) return;
    const meta = snap.data();
    if (meta.by === AI_TAB || job || aiSync.busy || (brain.at && meta.at <= brain.at)) return;
    try{
      const b = await readServerBrain(meta, L);
      if (b && L === LEN && (!brain.at || meta.at > brain.at)){ adoptBrain(b, meta.at, L); showToast(`The first-to-${L} AI was updated from another device.`); }
    }catch(e){}
  }, e => { aiSync.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'lost connection'; aiUnsub = null; refreshViews(); });
}
function aiSyncHTML(){
  if (!aiSync.ready) return '<p class="note">Connecting to the shared AI…</p>';
  if (!dbns) return `<p class="note">This view can't reach the server, so the AI here is this browser's own copy. Open the page in claude.ai while signed in to use the shared AI.</p>`;
  if (aiSync.err) return `<p class="note"><span class="err">Couldn't save the AI to the server: ${esc(aiSync.err)}.</span> <button type="button" class="small" data-act="ai-retry">Try again</button></p>`;
  const when = aiSync.at ? fmtWhen(aiSync.at) : '';
  return `<p class="note">${aiSync.busy ? 'Saving the AI to the server…' : `Shared first-to-${LEN} AI · saved on the server${when ? ' ' + esc(when) : ''}. Every device uses this one.`}</p>`;
}
/* switching length: swap in that length's AI, and follow its server copy instead */
function lenSegHTML(){
  return `<div class="row lenrow"><span class="eyebrow">Game length</span><div class="seg" role="group" aria-label="Game length">${LENS.map(L =>
    `<button type="button" data-len="${L}" aria-pressed="${L === LEN}" ${job || calState.busy ? 'disabled' : ''}>First to ${L}</button>`).join('')}</div>${mirToggleHTML()}</div>`;
}
function setLen(L){
  if (job || calState.busy || L === LEN || !LENS.includes(L)) return;
  if (G && !G.over && G.opp && G.opp.rated && !G.ratedDone){ showToast('Finish or resign your rated game before changing the game length.'); return; }
  brains[LEN] = brain; LEN = L; LS.set('sow-len', L);
  brain = getBrain(L); brainLen = L;
  // this length's card stats, rating ladder and your rating
  stats = statsFresh(isPlayer() ? (L === 3 && SNAP && SNAP.stats ? clone(SNAP.stats) : {}) : (LS.get(lenKey('sow-stats-v1', L)) || {})); statsLen = L;
  CAL = LS.get(lenKey('sow-cal-v1', L)) || (L === 3 && SNAP && SNAP.cal) || null;
  ME = LS.get(lenKey('sow-elo-v2', L)) || newMe(); meLen = L; oppPick = null;
  if (calUnsub){ try{ calUnsub(); }catch(e){} calUnsub = null; }
  if (syncState.ready){ watchCal(); startAiSync(); if (isPlayer()) loadPlayerStats(); else restoreOwnerStats(); }
  if (!G || ui.start) renderPlay();
  refreshViews();
}
document.addEventListener('click', e => { const t = e.target.closest('[data-len]'); if (t && !t.disabled) setLen(+t.dataset.len); });

/* ===================== PLAYER MODE ===================== */
// Players see the owner's card stats: the copy saved on the server after each training or stat run if it's newer
// than the one built into the page.
async function loadPlayerStats(){
  if (!dbns) return;
  try{
    const L = LEN, meta = await dbns.doc(syncPath('meta', L)).get();
    if (!meta.exists || meta.data().sheet !== SHEET_VER || (meta.data().at || 0) <= ((L === 3 && SNAP && SNAP.statsAt) || 0) || L !== LEN) return;
    const [s, pr, ad, vs] = await Promise.all(['stats','pairs','adj','vs'].map(k => dbns.doc(syncPath(k, L)).get()));
    if (L !== LEN) return;
    if (!s.exists) return;
    const out = jparse(s.data().json);
    if (pr.exists) out.__pairs = jparse(pr.data().json);
    if (ad.exists) out.__adj = jparse(ad.data().json);
    if (vs.exists) out.__vs = jparse(vs.data().json);
    stats = out;
    if (!$('view-stats').hidden) renderStats();
  }catch(e){}
}
// The owner's stats live in this browser. If it has fewer games than the server's backup or the copy built into the
// page (storage cleared, another device, a save the browser refused), take the bigger one.
async function restoreOwnerStats(){
  const L = LEN, mine = stats.__games || 0;
  let best = null, bestN = mine;
  try{
    if (dbns){
      const meta = await dbns.doc(syncPath('meta', L)).get(), n = meta.exists && meta.data().sheet === SHEET_VER ? (meta.data().games || 0) : 0;
      if (n > bestN){
        const [s, pr, ad, vs] = await Promise.all(['stats','pairs','adj','vs'].map(k => dbns.doc(syncPath(k, L)).get()));
        if (s.exists){ const out = jparse(s.data().json); if ((out.__games || 0) > bestN){
          if (pr.exists) out.__pairs = jparse(pr.data().json); if (ad.exists) out.__adj = jparse(ad.data().json); if (vs.exists) out.__vs = jparse(vs.data().json);
          best = out; bestN = out.__games || 0; } }
      }
    }
  }catch(e){}
  const cleared = LS.get(lenKey('sow-stats-cleared', L)) || 0;
  if (L === 3 && SNAP && SNAP.stats && SNAP.stats.__sheet === SHEET_VER && (SNAP.stats.__games || 0) > bestN && !(cleared > (SNAP.statsAt || 0))){ best = clone(SNAP.stats); bestN = best.__games || 0; }
  if (!best || L !== LEN) return;
  stats = best; saveStats();
  showToast(`Card stats restored: ${bestN.toLocaleString()} games (this browser had ${mine.toLocaleString()}).`);
  if (!$('view-stats').hidden) renderStats();
}
function applyRole(){
  const player = isPlayer();
  $('tab-train').hidden = player; $('tab-stats').textContent = player ? 'Card stats' : 'Balance & stats';
  if (player && !$('view-train').hidden) $('tab-play').click();
  if (player) $('view-lab').hidden = true;
  if (player) $('subline').textContent = 'Play full games of SOW against a trained AI. The rules and card win rates are in the other tabs.';
  const bar = $('rolebar');
  bar.hidden = !canAdmin;
  if (canAdmin) bar.innerHTML = playerPreview
    ? `<span class="note"><b>Previewing as a player.</b> This is what people you share the page with see.</span><button type="button" class="small" data-act="preview-off">Back to designer view</button>`
    : `<span class="note">Designer view. People you share this page with can play and see the rules and card stats, but can't train the AI or balance cards.</span><button type="button" class="small" data-act="preview-on">Preview as a player</button>`;
}
document.addEventListener('click', e => { if (e.target.closest('[data-act="ai-retry"]')) pushBrain(); });
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act="preview-on"],[data-act="preview-off"]'); if (!t) return;
  LS.set('sow-preview', t.dataset.act === 'preview-on'); location.reload();
});
applyRole();

/* ===================== FINALIZED BALANCE (db: balance/final) ===================== */
// One document holds the current balance: json (the overrides on the sheet), changes (readable list), at (time of
// the last push) and patches (every push, newest first: {at, items:[old → new lines], json, back?}). The newest
// PATCH_KEEP patches keep their json so they can be rolled back to; older ones keep just their lines. Claude can edit it too.
const PATCH_KEEP = 40;
const safeJSON = t => { try{ const v = jparse(t || '{}'); return v && typeof v === 'object' ? v : {}; }catch(e){ return {}; } };
const hasFinal = () => describeOverrides(FINAL.ov || {}, SHEET).length > 0;
const fmtWhen = t => t ? new Date(t).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'}) : '';
// take a server document as the finalized balance; returns true when the numbers changed
function applyFinal(d){
  if (d && d.sheet !== SHEET_VER){ const f = finalFresh({patches:seedPatches(d)}); const same = !Object.keys(FINAL.ov || {}).length; FINAL = f; LS.set('sow-final-v1', FINAL); if (!same){ setBaseline(FINAL.ov); loadSyn(); } return !same; }
  const ov = d ? safeJSON(d.json) : {};
  const same = JSON.stringify(ov) === JSON.stringify(FINAL.ov || {});
  FINAL = {ov, at:d ? d.at || null : null, patches:seedPatches(d), sheet:SHEET_VER};
  LS.set('sow-final-v1', FINAL);
  if (same) return false;
  setBaseline(FINAL.ov); loadSyn();
  return true;
}
function gameIsFresh(){ return G && !ui.start && !ui.battle && (ui.roll || G.round === 1 && G.phase === 'shop') && G.players.every(p => !p.bought.length); }
// push a new balance as a patch; back = the time of the patch being rolled back to, if this is a rollback
async function finalizeBalance(nextOv, back){
  if (!dbns || finalState.busy || isPlayer()) return;
  const items = patchDiff(FINAL.ov || {}, nextOv);
  if (!items.length){ showToast('Nothing to push: these numbers match the current balance.'); return; }
  finalState.busy = true; finalState.err = null; renderLab();
  try{
    const at = Date.now(), patch = {at, items, json:JSON.stringify(nextOv)};
    if (back) patch.back = back;
    const patches = [patch].concat(FINAL.patches || []).map((p, i) => i < PATCH_KEEP ? p : {at:p.at, items:p.items, back:p.back});
    const doc = {json:JSON.stringify(nextOv), changes:describeOverrides(nextOv, SHEET), at, patches:patches.filter(p => !p.old), sheet:SHEET_VER};
    await dbns.doc('balance/final').set(doc);
    OV = {}; LS.set('sow-ov-v1', OV);
    applyFinal(doc); setBaseline(FINAL.ov); loadSyn();
    if (gameIsFresh()) newPlay(G.opp); else renderPlay();
    showToast(back ? `Rolled back to the ${fmtWhen(back)} patch.` : `Patch pushed: ${items.length} ${plural(items.length, 'change')}.`);
  }catch(e){ finalState.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'unknown error'; }
  finalState.busy = false; renderLab();
}
let patchOpen = new Set();   // patches expanded in the history list (by time)
function finalBoxHTML(){
  const busy = !!job || finalState.busy, pats = FINAL.patches || [];
  const where = !syncState.ready ? '' : !dbns ? `<p class="note">Pushing needs the page open in claude.ai while signed in. Until then it uses the last balance this browser saw.</p>` : '';
  const row = (p, i) => {
    const open = patchOpen.has(p.at), n = (p.items || []).length;
    return `<details class="patch" data-at="${p.at}" ${open ? 'open' : ''}>
      <summary><b>${esc(fmtWhen(p.at))}</b>${i === 0 ? ' <span class="tag">current</span>' : ''}<span class="note"> · ${p.back ? `rollback to ${esc(fmtWhen(p.back))} · ` : ''}${n} ${plural(n, 'change')}</span></summary>
      <ul class="patchlist">${(p.items || []).map(l => { const k = l.indexOf(': '); return `<li><b>${esc(l.slice(0, k))}</b>: ${esc(l.slice(k + 2))}</li>`; }).join('')}</ul>
      ${i > 0 && p.json && dbns ? `<div class="row"><span class="grow"></span><button type="button" class="small" data-act="restore" data-i="${i}" ${busy?'disabled':''}>Roll back to this patch</button></div>` : ''}
    </details>`;
  };
  return `<div class="finalbox">
    <div class="row"><span class="eyebrow">Patch history · saved on the server</span><span class="grow"></span>${FINAL.at ? `<span class="note">Last push ${esc(fmtWhen(FINAL.at))}</span>` : ''}</div>
    ${pats.length ? `<div class="patches">${pats.map(row).join('')}</div>` : '<p class="note">No patches yet. Push your changes to start the history.</p>'}
    ${where}
  </div>`;
}
// follow the server copy live, so a change made elsewhere (another device, or Claude) shows up here
let finalUnsub = null;
function watchFinal(){
  if (!dbns || finalUnsub) return;
  finalUnsub = dbns.doc('balance/final').onSnapshot(snap => {
    finalState.loaded = true;
    if (finalState.busy) return;   // our own write; finalizeBalance applies it
    if (applyFinal(snap.exists ? snap.data() : null)){
      if (gameIsFresh()) newPlay(G.opp); else renderPlay();
      showToast('The finalized balance changed on the server. New games use it.');
    }
    refreshViews();
  }, e => { finalState.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'lost connection'; finalUnsub = null; refreshViews(); });
}

/* ===================== RATINGS (db: calibration/ladder; your rating stays in this browser) ===================== */
// CAL: {rungs:[{id,label,elo}], results:[{a,b,wa,wb,d}], genome, balanceKey, at, games}
let CAL = LS.get(lenKey('sow-cal-v1', LEN));
if (LEN === 3 && SNAP && SNAP.cal && (!CAL || (SNAP.cal.at || 0) > (CAL.at || 0))) CAL = SNAP.cal;
let calState = {busy:false, done:0, total:0, err:null};
const BRACKETS = ['Beginner', 'Intermediate', 'Hard', 'Expert', 'Master'];
const newMe = () => ({rating:null, placement:[], games:0, history:[]});
// v2: ratings started over when the ladder changed from deliberate mistakes to thinking budgets
let ME = LS.get(lenKey('sow-elo-v2', LEN)) || newMe(), meLen = LEN;
const saveMe = () => LS.set(lenKey('sow-elo-v2', meLen), ME);
const PLACEMENT_GAMES = 3;
// rungs in rating order (a rung that measured weaker than the one before it is skipped)
function ladder(){
  if (!CAL || !Array.isArray(CAL.rungs)) return [];
  const out = [];
  CAL.rungs.forEach(r => {
    const k = RUNGS.findIndex(x => x.id === r.id);
    if (k <= 0 || !Number.isFinite(r.elo)) return;   // the random buyer anchors the ratings but isn't an opponent
    if (!out.length || r.elo > out[out.length - 1].elo) out.push({...r, k, label:RUNGS[k].label});
  });
  // the deepest level isn't in older calibrations: put it on top with an estimated rating until the ladder is recalibrated
  const mk = RUNGS.findIndex(r => r.id === 'm100');
  if (mk >= 0 && !CAL.rungs.some(r => r.id === 'm100') && out.length >= 2){
    const a = out[out.length - 2], b = out[out.length - 1];
    out.push({id:'m100', label:RUNGS[mk].label, elo:b.elo + Math.max(40, b.elo - a.elo), k:mk, provisional:true});
  }
  return out;
}
const ratingRange = () => { const L = ladder(); return L.length ? [L[0].elo, L[L.length - 1].elo] : [400, 400]; };
function bracketOf(R){
  const [lo, hi] = ratingRange(), w = Math.max(1, (hi - lo) / 5);
  const k = Math.max(0, Math.min(4, Math.floor((R - lo) / w)));
  return {k, name:BRACKETS[k], from:Math.round(lo + k * w), to:Math.round(lo + (k + 1) * w)};
}
// which AI level(s) a rating plays as, in words
function levelText(R){
  const s = skillFor(R); if (!s) return '';
  const L = ladder(), top = L[L.length - 1], est = top && top.provisional && (s.lo === RUNGS[top.k] || s.hi === RUNGS[top.k]) ? ' (its rating is an estimate until the ladder is recalibrated)' : '';
  if (!s.hi || s.t >= 0.995) return `Plays as: ${(s.hi && s.t >= 0.995 ? s.hi : s.lo).label}${est}`;
  if (s.t <= 0.005) return `Plays as: ${s.lo.label}${est}`;
  return `Thinks with a budget ${Math.round(s.t * 100)}% of the way from ${s.lo.label} to ${s.hi.label}${est}`;
}
function skillFor(R){
  const L = ladder(); if (!L.length) return null;
  if (R <= L[0].elo) return {lo:RUNGS[L[0].k]};
  for (let j = 1; j < L.length; j++) if (R <= L[j].elo){
    const a = L[j - 1], b = L[j];
    return {lo:RUNGS[a.k], hi:RUNGS[b.k], t:(R - a.elo) / Math.max(1, b.elo - a.elo)};
  }
  return {lo:RUNGS[L[L.length - 1].k]};
}
const expected = (me, opp) => 1 / (1 + Math.pow(10, (opp - me) / 400));
const calStale = () => !!CAL && CAL.balanceKey !== stableKey(effOV());
function placementOpp(){ const [lo, hi] = ratingRange(); return Math.round((lo + hi) / 2 / 10) * 10; }
// a finished game moves your rating (or counts toward placement)
function recordResult(forfeit){
  if (!G || !G.opp || !G.opp.rated || G.ratedDone) return;
  G.ratedDone = true;
  const s = forfeit ? 0 : G.winner === 0 ? 1 : G.winner === 1 ? 0 : 0.5, opp = G.opp.rating, before = ME.rating;
  if (G.opp.placement){
    ME.placement.push({opp, s});
    if (ME.placement.length >= PLACEMENT_GAMES){
      const n = ME.placement.length, avg = ME.placement.reduce((a, x) => a + x.opp, 0) / n, sc = ME.placement.reduce((a, x) => a + x.s, 0);
      const [lo, hi] = ratingRange();
      ME.rating = Math.round(Math.max(lo - 100, Math.min(hi + 300, avg + 400 * (2 * sc - n) / n)));
    }
  } else {
    const K = ME.games < 10 ? 48 : 32;
    ME.rating = Math.round(ME.rating + K * (s - expected(ME.rating, opp)));
    ME.games++;
  }
  ME.history.unshift({at:Date.now(), opp, s, before, after:ME.rating, placement:!!G.opp.placement, forfeit:!!forfeit, first:G.first1 === 0 ? true : G.first1 === 1 ? false : null});
  ME.history = ME.history.slice(0, 50);
  G.ratingChange = {before, after:ME.rating, placement:!!G.opp.placement};
  saveMe();
}
function ratingNoteHTML(){
  const c = G && G.ratingChange; if (!c) return '';
  if (c.placement) return `<span class="note">${ME.rating == null ? `Placement game ${ME.placement.length} of ${PLACEMENT_GAMES} done` : `Placement done: your rating is <b>${ME.rating}</b>`}</span>`;
  const d = c.after - c.before;
  return `<span class="note">Your rating ${c.before} → <b>${c.after}</b> <span class="${d >= 0 ? 'up' : 'down'}">(${d >= 0 ? '+' : '−'}${Math.abs(d)})</span></span>`;
}
