
/* Safety net: if drawing a tab or starting the page hits an error, show it (with a way to copy it to Claude)
   instead of leaving the tab blank. */
function errBoxHTML(where, err){
  const msg = String((err && err.stack) || err || 'unknown error').slice(0, 1500);
  return `<div class="panel"><p class="err">Something went wrong drawing ${where}.</p><p class="note">Copy this and paste it to Claude so it can be fixed. Reloading the page may help in the meantime.</p>
    <textarea readonly style="min-height:120px">${msg.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</textarea></div>`;
}
window.addEventListener('error', ev => {
  try{ const v = document.getElementById('view-play'); if (v && !v.innerHTML.trim()) v.innerHTML = errBoxHTML('the page', ev.error || ev.message); }catch(e){}
});
/* ===================== SHARED UI HELPERS ===================== */
// Source for a Web Worker that runs the engine plus one main function (the AI or the self-play pool).
// The engine lives in js/engine.js; the worker loads it by URL, so there is only ever one copy of it.
function engineWorkerURL(main){
  const eng = new URL('js/engine.js', document.baseURI).href;
  return URL.createObjectURL(new Blob([`importScripts(${JSON.stringify(eng)});\n(${main.toString()})();`], {type:'text/javascript'}));
}
const $ = id => document.getElementById(id);

/* ===================== SOUND ===================== */
// Small synthesized effects (no audio files): quiet, short, and off with one click.
const sfx = (() => {
  let ac = null, out = null, noiseBuf = null, on = true, lastTick = 0;
  try{ on = localStorage.getItem('sow-sfx') !== 'off'; }catch(e){}
  const ctx = () => {
    if (!on) return null;
    if (!ac){
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ac = new AC();
      const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
      out = ac.createGain(); out.gain.value = 0.22; out.connect(comp); comp.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  // a pitched blip: osc type, start/end frequency, length, volume, delay
  const tone = (type, f0, f1, dur, vol, at = 0) => {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02);
  };
  // a filtered noise burst: filter type, frequency (start→end), q, length, volume, delay
  const noise = (ft, f0, f1, q, dur, vol, at = 0) => {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + at, src = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noiseBuf; fl.type = ft; fl.Q.value = q; fl.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(out); src.start(t, Math.random() * 0.3); src.stop(t + dur + 0.02);
  };
  const jit = (x, p = 0.06) => x * (1 + (Math.random() * 2 - 1) * p);   // tiny pitch variation so repeats don't feel robotic
  /* Coin sounds are real recordings: "handleCoins" from Kenney's RPG Audio pack (kenney.nl, CC0 public domain),
     trimmed and levelled. Each play nudges the speed a little so repeats don't sound identical. */
  const COIN_MP3 = {
    buy: ['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E1bce3HWlxKBsrW8dO671tW0qCR4SBBRc/mo/uUlLsSqiSTkQUbVORATXawK4kJXEiPI5OoGqzvWn/9DOWBo80O3SyoqfMqkdjL9uUMaaUWUWYTQXUs7O0lFXFqSInAZ6C83Kk44uLjco12uN/7vmzRpwkUBE1JS2zTP/8o0UBHmHxeb//mKFBHVJVf2lECwxIMSlBqkpQclK0zN7BqxP/TU///6pn/pLayWkSDQ0RKb+TJSsR/8r3VMQU1FMy4xMDBVVVVVVVVVVVVVVVX/+3LERQPOjQLmARhTyAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ=='],
    sell: ['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'],
  };
  let coinBufs = null, coinLoad = null;
  const loadCoins = () => coinLoad || (coinLoad = Promise.all(Object.entries(COIN_MP3).map(([k, list]) => Promise.all(list.map(b64 => {
      const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      return new Promise((res, rej) => ac.decodeAudioData(u8.buffer, res, rej));
    })).then(bufs => [k, bufs]))).then(e => { coinBufs = Object.fromEntries(e); }).catch(() => { coinLoad = null; }));
  const playSample = (kind, vol) => {
    if (!ctx()) return;
    const go = () => {
      if (!coinBufs) return;
      const list = coinBufs[kind], src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = list[Math.floor(Math.random() * list.length)]; src.playbackRate.value = 0.94 + Math.random() * 0.13;
      g.gain.value = vol; src.connect(g); g.connect(out); src.start();
    };
    if (coinBufs) go(); else loadCoins().then(go);
  };
  const S = {
    get on(){ return on; },
    set(v){ on = !!v; try{ localStorage.setItem('sow-sfx', on ? 'on' : 'off'); }catch(e){} if (on) S.tick(); },
    unlock(){ if (on && ctx()) loadCoins(); },
    tick(){ const n = performance.now(); if (n - lastTick < 28) return; lastTick = n; noise('bandpass', jit(3200, .15), 2600, 1.2, 0.035, 0.35); },
    soft(){ noise('bandpass', jit(1800, .1), 1400, 1, 0.05, 0.25); },
    turnMine(){ tone('sine', 659.25, 659.25, 0.16, 0.16); tone('sine', 987.77, 987.77, 0.26, 0.16, 0.13); },
    turnTheirs(){ tone('sine', 440, 392, 0.18, 0.07); },
    flick(at = 0){ noise('highpass', jit(2400, .1), 5000, 0.7, 0.07, 0.18, at); },
    pick(){ tone('sine', jit(620), jit(760), 0.05, 0.18); noise('bandpass', 2600, 2000, 1, 0.03, 0.15); },
    drop(){ tone('sine', jit(420), jit(300), 0.07, 0.25); noise('bandpass', 1500, 900, 1, 0.04, 0.2); },
    // a real coin: a sharp contact click plus a few inharmonic metal partials that die fast; it lands, bounces, settles
    coin(vol = 1){ playSample('buy', 1.6 * vol); },
    sell(){ playSample('sell', 1.4); },
    wood(){ tone('sine', jit(540), jit(470), 0.08, 0.3); tone('triangle', jit(1080), 900, 0.03, 0.08); },
    rustle(){ for (let k = 0; k < 3; k++) noise('bandpass', jit(2800, .2), 1800, 0.9, 0.09, 0.14, k * 0.06); },
    die(){ tone('sine', jit(300), jit(160), 0.09, 0.35); noise('lowpass', 1200, 400, 0.7, 0.06, 0.25); },
    clash(){ noise('bandpass', jit(3400, .1), 2200, 4, 0.16, 0.22); tone('triangle', jit(880), 700, 0.12, 0.05); },
    hit(){ tone('sine', jit(150), 55, 0.16, 0.5); noise('lowpass', 900, 250, 0.8, 0.09, 0.3); },
    ko(){ tone('sine', jit(120), 40, 0.32, 0.55); noise('lowpass', 700, 150, 0.8, 0.22, 0.32); tone('triangle', 330, 220, 0.25, 0.05, 0.05); },
    lock(){ tone('sine', 110, 60, 0.22, 0.5); noise('lowpass', 600, 200, 0.8, 0.12, 0.25); tone('sine', 220, 220, 0.1, 0.06, 0.02); },
    err(){ tone('square', 140, 130, 0.07, 0.05); tone('square', 120, 110, 0.09, 0.05, 0.09); },
    // battle and game results: soft bell-ish notes
    win(big){ const ns = big ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
              ns.forEach((f, k) => { tone('triangle', f, f, big ? 0.7 : 0.45, 0.16, k * 0.09); tone('sine', f * 2, f * 2, 0.3, 0.04, k * 0.09); }); },
    lose(big){ const ns = big ? [392, 349.23, 293.66, 261.63] : [392, 311.13];
               ns.forEach((f, k) => tone('triangle', f, f, big ? 0.6 : 0.4, 0.14, k * 0.14)); },
    draw(){ tone('triangle', 440, 440, 0.35, 0.13); tone('triangle', 440, 440, 0.35, 0.1, 0.16); },
  };
  return S;
})();
const sndIcon = on => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/>${on ? '<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>' : '<path d="m22 9-6 6"/><path d="m16 9 6 6"/>'}</svg><span class="lbl">${on ? 'Sound on' : 'Sound off'}</span>`;
function paintSnd(){ const b = $('snd-toggle'); if (!b) return; b.innerHTML = sndIcon(sfx.on); b.setAttribute('aria-pressed', String(sfx.on)); b.setAttribute('aria-label', sfx.on ? 'Turn sound effects off' : 'Turn sound effects on'); }
paintSnd();
$('snd-toggle').addEventListener('click', () => { sfx.set(!sfx.on); paintSnd(); });
// browsers only allow audio after a gesture; warm the engine on the first one
document.addEventListener('pointerdown', () => sfx.unlock(), {once:true, capture:true});
// light click feedback for ordinary buttons (specific actions below play their own sounds)
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled || b.id === 'snd-toggle') return;
  if (b.closest('#view-play') && b.dataset.act) return;
  sfx.soft();
}, true);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// cards and miracles that were renamed: older saves and shared data are read with the new name
const RENAMED = {'Muster Writ':'Discard Writ'};
function renameRevive(k, v){
  if (typeof v === 'string') return RENAMED[v] || v;
  if (v && typeof v === 'object' && !Array.isArray(v)) for (const o in RENAMED) if (Object.prototype.hasOwnProperty.call(v, o)){ if (!(RENAMED[o] in v)) v[RENAMED[o]] = v[o]; delete v[o]; }
  return v;
}
const jparse = t => JSON.parse(t, renameRevive);
const LS = {
  get(k){ try{ return jparse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const pct = x => `${Math.round(x * 100)}%`;
const clone = o => JSON.parse(JSON.stringify(o));
/* ===================== WHO IS VIEWING ===================== */
// The owner (and anyone with edit access) gets every tab. Everyone else is a player: Play, Card stats and Rules,
// using the owner's AI, balance and stats, with no training, balancing or stat runs. The last answer is remembered
// so the page opens in the right mode; if it turns out wrong, the page reloads once in the right one.
let canAdmin = !!LS.get('sow-admin'), playerPreview = !!LS.get('sow-preview');
const isPlayer = () => !canAdmin || playerPreview;
// The owner's AI, finalized balance, ratings and card stats as of the last publish, for viewers who can't reach the server.
let SNAP = null; try{ SNAP = jparse((document.getElementById('snapshot') || {}).textContent || 'null'); }catch(e){ SNAP = null; }

let OV = LS.get('sow-ov-sheet') === SHEET_VER ? (LS.get('sow-ov-v1') || {}) : {};
if (LS.get('sow-ov-sheet') !== SHEET_VER){ LS.set('sow-ov-v1', OV); LS.set('sow-ov-sheet', SHEET_VER); }
// Finalized balance lives on the server (db doc balance/final); this is the last copy seen, so the page starts with it.
// A balance made for an older sheet keeps its history for reference, but its numbers don't apply.
const finalFresh = F => F && F.sheet === SHEET_VER ? F : {ov:{}, at:null, patches:((F && F.patches) || []).map(p => ({at:p.at, items:p.items, old:true})), sheet:SHEET_VER};
let FINAL = finalFresh(LS.get('sow-final-v1'));
if (SNAP && SNAP.final && SNAP.final.sheet === SHEET_VER && (SNAP.final.at || 0) > (FINAL.at || 0)) FINAL = clone(SNAP.final);
if (!Array.isArray(FINAL.patches)) FINAL.patches = seedPatches({at:FINAL.at, json:JSON.stringify(FINAL.ov || {}), history:FINAL.history});
let finalState = {loaded:false, busy:false, err:null};
// sheet + finalized + this browser's unfinalized changes, as one set of overrides on the sheet (what workers apply)
function effOV(){
  const F = FINAL.ov || {}, out = {};
  for (const g of ['units', 'bldgs', 'mirs']){
    const names = new Set(Object.keys(F[g] || {}).concat(Object.keys(OV[g] || {})));
    if (!names.size) continue;
    out[g] = {};
    for (const n of [...names].sort()) out[g][n] = Object.assign({}, (F[g] || {})[n], (OV[g] || {})[n]);
  }
  if (F.rules || OV.rules) out.rules = Object.assign({}, F.rules, OV.rules);
  return out;
}
function copyInto(dst, src){ for (const k of Object.keys(dst)) delete dst[k]; Object.assign(dst, JSON.parse(JSON.stringify(src))); }
// make the finalized numbers the baseline, then put this browser's unfinalized changes back on top
function setBaseline(fin){
  for (const n in SHEET.DEFS) copyInto(ORIG.DEFS[n], SHEET.DEFS[n]);
  for (const n in SHEET.BDEFS) copyInto(ORIG.BDEFS[n], SHEET.BDEFS[n]);
  copyInto(ORIG.RULES, SHEET.RULES);
  for (const n in SHEET.MIRS) copyInto(ORIG.MIRS[n], SHEET.MIRS[n]);
  OV_KEY = ''; applyOverrides(fin || {});
  for (const n in ORIG.DEFS) copyInto(ORIG.DEFS[n], DEFS[n]);
  for (const n in ORIG.BDEFS) copyInto(ORIG.BDEFS[n], BDEFS[n]);
  copyInto(ORIG.RULES, RULES);
  for (const n in ORIG.MIRS) copyInto(ORIG.MIRS[n], MIRS[n]);
  // drop unfinalized changes that now match the baseline
  let pruned = false;
  for (const [g, src] of [['units', ORIG.DEFS], ['bldgs', ORIG.BDEFS], ['mirs', ORIG.MIRS]]){
    for (const n in (OV[g] || {})){
      for (const k in OV[g][n]) if (!src[n] || JSON.stringify(OV[g][n][k]) === JSON.stringify(src[n][k])){ delete OV[g][n][k]; pruned = true; }
      if (!Object.keys(OV[g][n]).length) delete OV[g][n];
    }
    if (OV[g] && !Object.keys(OV[g]).length) delete OV[g];
  }
  for (const k in (OV.rules || {})) if (OV.rules[k] === ORIG.RULES[k]){ delete OV.rules[k]; pruned = true; }
  if (OV.rules && !Object.keys(OV.rules).length) delete OV.rules;
  if (pruned) LS.set('sow-ov-v1', OV);
  OV_KEY = ''; applyOverrides(OV);
}
setBaseline(FINAL.ov);
// combo table: the built-in one matches the sheet; a recomputed one is kept per set of changes
function loadSyn(){
  const saved = LS.get('sow-syn-v2');
  if (saved && saved.key === JSON.stringify(effOV())) SYN = saved.tab;
  else SYN = SYN_DEFAULT;
}
const synStale = () => { const e = effOV(), saved = LS.get('sow-syn-v2'); return Object.keys(e).length > 0 && !(saved && saved.key === JSON.stringify(e)); };
loadSyn();
const LENS = [3, 4, 5];
let LEN = LENS.includes(LS.get('sow-len')) ? LS.get('sow-len') : 3;
MIRACLES_ON = LS.get('sow-mir') === true;   // default off
BATTLE_MIR_ON = LS.get('sow-bmir') !== false;
REFILL_ON = LS.get('sow-refill') !== false;   // default on
// the Miracles checkbox: applies to the next game you start (and to AI training and stat games)
function mirToggleHTML(){
  const live = G && !G.over && G.round > 0;
  const bOn = MIRACLES_ON && BATTLE_MIR_ON;
  return `<label class="mirtog note"><input type="checkbox" data-mir-toggle ${MIRACLES_ON ? 'checked' : ''}> <b>Miracles</b> in the shop decks${live && G.miracles !== MIRACLES_ON ? ' (from your next game)' : ''}</label>`
    + `<label class="mirtog note${MIRACLES_ON ? '' : ' off'}" title="Ambush, Divine Shield, Second Wind, Silence and Sabotage: placed in your deck, they resolve in battle. Mill and Restock leave the decks to make room."><input type="checkbox" data-bmir-toggle ${BATTLE_MIR_ON ? 'checked' : ''} ${MIRACLES_ON ? '' : 'disabled'}> <b>Battle miracles</b>${live && !!G.battleMir !== bOn ? ' (from your next game)' : ''}</label>`
    + `<label class="mirtog note" title="A bought shop card is replaced right away from its own deck, so the shop stays full all round."><input type="checkbox" data-refill-toggle ${REFILL_ON ? 'checked' : ''}> <b>Automatic shop refills</b>${live && !!G.refill !== REFILL_ON ? ' (from your next game)' : ''}</label>`;
}
document.addEventListener('change', e => {
  if (e.target.matches && e.target.matches('[data-refill-toggle]')){
    REFILL_ON = !!e.target.checked; LS.set('sow-refill', REFILL_ON);
    for (const el of document.querySelectorAll('[data-refill-toggle]')) el.checked = REFILL_ON;
    renderPlay(); refreshViews(); return;
  }
  if (e.target.matches && e.target.matches('[data-bmir-toggle]')){
    BATTLE_MIR_ON = !!e.target.checked; LS.set('sow-bmir', BATTLE_MIR_ON);
    for (const el of document.querySelectorAll('[data-bmir-toggle]')) el.checked = BATTLE_MIR_ON;
    renderPlay(); refreshViews(); return;
  }
  if (!e.target.matches || !e.target.matches('[data-mir-toggle]')) return;
  MIRACLES_ON = !!e.target.checked; LS.set('sow-mir', MIRACLES_ON);
  for (const el of document.querySelectorAll('[data-mir-toggle]')) el.checked = MIRACLES_ON;
  for (const el of document.querySelectorAll('[data-bmir-toggle]')){ el.disabled = !MIRACLES_ON; el.closest('.mirtog').classList.toggle('off', !MIRACLES_ON); }
  renderPlay(); refreshViews();
});
const brainKey = L => L === 3 ? 'sow-brain-v1' : `sow-brain-t${L}-v1`;
// every length keeps its own card stats, rating ladder and player rating; first to 3 keeps the original names
const lenKey = (base, L) => L === 3 ? base : base.replace(/-v1$/, `-t${L}-v1`);
const calPath = L => L === 3 ? 'calibration/ladder' : `calibration/ladder-t${L}`;
const syncPath = (k, L) => L === 3 ? 'sync/' + k : `sync/${k}-t${L}`;
let brains = null, brainLen = 3;   // brainLen: the length `brain` belongs to (3 until the length is switched below)
let brain = LS.get('sow-brain-v1') || {champ:baseGenome(), gens:0, games:0, history:[]};
delete brain.ctxEv;   // retired pairing evidence: no longer kept or saved
if (SNAP && SNAP.brain && SNAP.brain.champ && (!LS.get('sow-brain-v1') || (isPlayer() && (SNAP.brain.at || 0) > (brain.at || 0)))) brain = clone(SNAP.brain);
// one-time: Barber-Surgeon became a new card (saves a dying unit), so drop old tuning and the AI's opinion of the old version
if (!LS.get('sow-mig-barber2')){
  if (OV.units && OV.units['Barber-Surgeon']){ delete OV.units['Barber-Surgeon']; if (!Object.keys(OV.units).length) delete OV.units; LS.set('sow-ov-v1', OV); applyOverrides(OV); loadSyn(); }
  if (brain.champ && brain.champ.bias) delete brain.champ.bias['Barber-Surgeon'];
  LS.set('sow-brain-v1', brain); LS.set('sow-mig-barber2', 1);
}
// one-time: Cathedral is now valued by how much it raises the AI's chance to win, so the old appetite and opinion no longer fit
if (!LS.get('sow-mig-cath2')){
  if (brain.champ){ brain.champ.cath = 0.5; if (brain.champ.bias) delete brain.champ.bias.Cathedral; }
  LS.set('sow-brain-v1', brain); LS.set('sow-mig-cath2', 1);
}
/* ===================== GAME LENGTHS ===================== */
// Games can be first to 3, 4 or 5. Each length has its own AI (first to 4 and 5 start as copies of the first-to-3 AI),
// saved in this browser under its own key and on the server under its own documents. `brain` is always the AI
// for the length currently chosen.
brains = {3: brain};
function getBrain(L){
  if (!brains[L]){
    let b = LS.get(brainKey(L));
    const sb = SNAP && SNAP.brains && SNAP.brains[L];
    if (sb && sb.champ && (!b || (isPlayer() && (sb.at || 0) > (b.at || 0)))) b = clone(sb);
    brains[L] = cardFresh(b) || {champ:clone(brains[3].champ), gens:0, games:0, history:[], algo:'es1', deep:brains[3].deep, seededFrom:3, sheet:SHEET_VER};
  }
  return brains[L];
}
// workers play at the chosen length; the length rides along with the card numbers they're sent
const ovLen = (ov, L) => ({...ov, rules:{...((ov && ov.rules) || {}), target:L}});
if (LEN !== 3){ brain = getBrain(LEN); brainLen = LEN; }
const statsFresh = s => s && s.__sheet === SHEET_VER ? s : {__sheet:SHEET_VER};
let stats = statsFresh(isPlayer() ? (SNAP && SNAP.stats && LEN === 3 ? clone(SNAP.stats) : {}) : (LS.get(lenKey('sow-stats-v1', LEN)) || {})), statsLen = LEN;
// brainLive turns on once the page has finished loading, so only real changes (training, forgetting, loading, reset)
// stamp the AI with a time and send it to the server; the one-time load-up fixes below don't count as changes.
function cardFresh(b){
  if (!b || !b.champ || b.sheet === SHEET_VER) return b;
  b.champ = {...b.champ, bias:{}}; delete b.champ.ctx; delete b.ctxEv;
  if (b.ckpt) b.ckpt = {...b.ckpt, bias:{}, ctx:undefined};
  b.sheet = SHEET_VER; return b;
}
cardFresh(brain); if (brains) for (const L in brains) cardFresh(brains[L]);
let brainLive = false;
const saveBrain = () => { delete brain.ctxEv; if (brainLive) brain.at = Date.now(); if (brains) brains[brainLen] = brain; LS.set(brainKey(brainLen), brain); if (brainLive) queueBrainPush(); };
// one-time: switch to the evolution-strategies trainer. The old trainer's card opinions were mostly noise (several
// stuck at the ±6 limit, some pointing the wrong way), so the new one starts without them. The old champion is kept
// in brain.legacy and can be restored from the Train tab.
if (brain.algo !== 'es1'){
  brain.legacy = {champ:brain.champ, gens:brain.gens, history:brain.history || []};
  brain.champ = {...brain.champ, bias:{}};
  brain.gens = 0; brain.history = []; brain.ckpt = null; brain.mom = null; brain.lastGate = null; brain.reverts = 0;
  delete brain.lastChange; brain.algo = 'es1'; saveBrain();
}
// forget the AI's learned like/dislike for cards (it keeps everything else it has learned)
// forget learned pairings (and their evidence) that involve any of these cards; with no names, forget them all
function forgetPairings(names){
  const hit = k => { if (!names) return true; const m = /^(.*?)([+~*])(.*)$/.exec(k); const parts = m ? [m[1], m[3]] : [k]; return parts.some(x => names.includes(x)); };
  let n = 0;
  if (brain.champ && brain.champ.ctx) for (const k of Object.keys(brain.champ.ctx)) if (hit(k)){ delete brain.champ.ctx[k]; n++; }
  if (brain.ctxEv) for (const k of Object.keys(brain.ctxEv)) if (k !== '*' && hit(k)) delete brain.ctxEv[k];
  if (!names) brain.ctxEv = {};
  saveBrain(); return n;
}
function forgetOpinions(names){ const b = brain.champ && brain.champ.bias; if (!b) return; let n = 0; for (const k of names) if (k in b){ delete b[k]; n++; } if (n) saveBrain(); return n; }
let statsSaveFailed = false;
const saveStats = () => {
  if (isPlayer()) return;
  const k = lenKey('sow-stats-v1', statsLen);
  stats.__sheet = SHEET_VER;
  try{ localStorage.setItem(k, JSON.stringify(stats)); statsSaveFailed = false; }catch(e){ statsSaveFailed = true; }
};

document.querySelector('.tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]'); if (!b) return;
  for (const t of document.querySelectorAll('.tabs button')) t.setAttribute('aria-selected', String(t === b));
  // the balance lab and the card stats share one tab: the lab on top (designers only), the stats below
  for (const v of ['play','cards','train','stats','lab','rules']) $('view-' + v).hidden = v === 'lab' ? (b.dataset.tab !== 'stats' || isPlayer()) : v !== b.dataset.tab;
  if (b.dataset.tab === 'stats' && !isPlayer()) renderLab();
  if (b.dataset.tab === 'train') renderTrain();
  if (b.dataset.tab === 'stats') renderStats();
  if (b.dataset.tab === 'play') toGame();
  if (b.dataset.tab === 'cards' && typeof renderCards === 'function') renderCards();
});

