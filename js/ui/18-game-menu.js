/* GAME MENU
   While a game is on screen, the Oasis title, the sound button and the tabs are hidden so the screen starts with the
   game (css/10-game-menu.css). The ☰ button at the left end of the game's top bar (pbarHTML, the same bar on every
   screen) opens them instead: the same tabs (it clicks the real tab buttons, so switching views works as before) and
   the sound toggle (it clicks the real #snd-toggle) and, during a battle, Board settings (it opens the panel in
   js/board-settings.js with labShow). Opening another tab brings the title and tabs back, so Play is
   there to return to the game. The bar is redrawn often, so the button is found fresh each time; the menu itself
   lives outside the game view and survives redraws. */
(function(){
  const pop = document.createElement('div');
  pop.className = 'gmenu-pop'; pop.id = 'gmenu-pop'; pop.setAttribute('role', 'menu'); pop.hidden = true;
  document.body.append(pop);

  const btn = () => document.querySelector('#gtop [data-gmenu]');
  const snd = () => document.getElementById('snd-toggle');
  const soundOn = () => { const s = snd(); return !s || s.getAttribute('aria-pressed') !== 'false'; };

  function build(){
    const tabs = [...document.querySelectorAll('.tabs button[data-tab]')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none');
    const items = tabs.map(b => {
      const on = b.getAttribute('aria-selected') === 'true';
      return `<button type="button" role="menuitem" class="gmenu-item${on ? ' on' : ''}" data-gtab="${b.dataset.tab}">${b.textContent.trim()}${on ? '<span class="gmenu-here">this game</span>' : ''}</button>`;
    }).join('');
    const s = snd() ? `<div class="gmenu-sep"></div><button type="button" role="menuitemcheckbox" aria-checked="${soundOn()}" class="gmenu-item gmenu-snd" data-gsnd="1">Sound effects<span class="gmenu-sw${soundOn() ? ' on' : ''}" aria-hidden="true"><i></i></span></button>` : '';
    const bs = document.body.classList.contains('lab-inbattle') && typeof labShow === 'function'
      ? `<button type="button" role="menuitem" class="gmenu-item" data-gboard="1" aria-haspopup="dialog">Board settings</button>` : '';
    // battle codes: copy the battle on screen, load one, or leave the one being watched
    const bc = (ui.battle && ui.battle.cfgs ? `<button type="button" role="menuitem" class="gmenu-item" data-gcode="copy">Copy battle code</button>` : '') +
      (G && G.replay ? `<button type="button" role="menuitem" class="gmenu-item" data-gcode="leave">Back to your game</button>` : '') +
      (G && !G.net ? `<button type="button" role="menuitem" class="gmenu-item" data-gcode="load" aria-haspopup="dialog">Load battle code…</button>` : '');
    pop.innerHTML = items + s + (bs ? (s ? '' : '<div class="gmenu-sep"></div>') + bs : '') + (bc ? '<div class="gmenu-sep"></div>' + bc : '');
  }
  function mark(){ const b = btn(); if (b) b.setAttribute('aria-expanded', String(!pop.hidden)); }
  function place(){
    const b = btn(); if (!b){ close(); return; }
    const r = b.getBoundingClientRect();
    pop.style.top = Math.round(r.bottom + 6) + 'px';
    pop.style.left = Math.round(Math.max(8, r.left)) + 'px';
  }
  function open(){ build(); pop.hidden = false; place(); mark(); }
  function close(){ if (pop.hidden) return; pop.hidden = true; mark(); }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-gmenu]');
    if (b){ e.stopPropagation(); try { sfx.soft(); } catch(_){} pop.hidden ? open() : close(); return; }
    if (!pop.hidden && !pop.contains(e.target)) close();
  }, true);
  pop.addEventListener('click', e => {
    const t = e.target.closest('[data-gtab]'), s = e.target.closest('[data-gsnd]'), bd = e.target.closest('[data-gboard]'), gc = e.target.closest('[data-gcode]');
    if (gc){
      close(); try { sfx.soft(); } catch(_){}
      const k = gc.dataset.gcode;
      if (k === 'copy') bcodeCopy();
      else if (k === 'leave') replayEnd();
      else { popShut(); ui.codeWin = true; ui.codeErr = ''; stopAuto(); renderPlay(); setTimeout(() => { const ta = document.getElementById('bcode-in'); if (ta) ta.focus(); }, 50); }
      return;
    }
    if (t){
      const real = document.querySelector(`.tabs button[data-tab="${t.dataset.gtab}"]`);
      close();
      if (real && real.getAttribute('aria-selected') !== 'true'){ real.click(); try { scrollTo({top:0}); } catch(_){} }
    } else if (bd){
      close(); labShow(true);
    } else if (s){
      const real = snd(); if (real) real.click();
      build();   // show the new state, keep the menu open
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden){ close(); const b = btn(); if (b) b.focus(); } });
  // the game scrolls and redraws by itself: keep the menu under its button, and close it if the bar goes away
  addEventListener('resize', () => { if (!pop.hidden) place(); });
  addEventListener('scroll', () => { if (!pop.hidden) place(); }, {passive:true});
  const vp = document.getElementById('view-play');
  if (vp) new MutationObserver(() => { if (!pop.hidden) requestAnimationFrame(() => { place(); mark(); }); }).observe(vp, {childList:true, subtree:true});
})();

/* ===================== BATTLE CODES =====================
   Battles have no luck in them, so both armies as they went in (runBattle keeps a copy on recorded battles: res.cfgs)
   rebuild the whole fight. "Copy battle code" in the game menu turns the battle on screen into one line of text,
   OASIS-BATTLE:<base64 JSON>, to paste to Claude (or a friend); "Load battle code…" plays one back in the normal battle
   view. The replay runs in its own throwaway game: the real game (G and ui) waits in G.replay, isn't saved over
   (saveNow skips a replay) and comes back as it was with "Back to your game". The code carries the build, round,
   score, names and the winner, so a code from a build with different card numbers is flagged when it plays out
   differently. Online, the guest's code is flipped so they are the bottom side when it is loaded. */
const BCODE_TAG = 'OASIS-BATTLE:';
const bcodeB64 = s => { let b = ''; new TextEncoder().encode(s).forEach(x => { b += String.fromCharCode(x); }); return btoa(b); };
const bcodeUnB64 = s => new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0)));
function bcodeOf(res){
  if (!res || !res.cfgs) return null;
  const flip = !!(G.net && typeof NET !== 'undefined' && NET && NET.seat === 1), f = a => flip ? a.slice().reverse() : a.slice();
  const tot = ui.battle === res && ui.pre ? ui.pre.tot : G.players.map(p => total(p));
  const w = res.result.w, d = {v:1, b:OASIS_BUILD, r:G.round, t:G.target, l:f(G.labels), p:f(tot), c:f(res.cfgs), w:flip && w >= 0 ? 1 - w : w};
  return BCODE_TAG + bcodeB64(JSON.stringify(d));
}
function bcodeCopy(){
  const c = bcodeOf(ui.battle);
  if (!c){ showToast('This battle has no code (it was fought before battle codes existed).'); return; }
  copyText(c, 'Copy this battle code', 'Battle code copied. Paste it to Claude.');
}
// text → the code's data, or a sentence saying what's wrong with it
function bcodeParse(text){
  const m = String(text || '').replace(/\s+/g, '').match(/OASIS-BATTLE:([A-Za-z0-9+/=]+)/);
  if (!m) return {err:'That isn’t a battle code. It should start with OASIS-BATTLE:'};
  let d; try{ d = JSON.parse(bcodeUnB64(m[1])); }catch(e){ return {err:'That battle code is incomplete. Copy the whole line and try again.'}; }
  if (!d || d.v !== 1 || !Array.isArray(d.c) || d.c.length !== 2 || !d.c.every(x => x && Array.isArray(x.units))) return {err:'That battle code is from a version of the game this one can’t read.'};
  const unknown = [...new Set(d.c.flatMap(x => x.units.map(u => u.name)).filter(n => !DEFS[n]))];
  if (unknown.length) return {err:`This build doesn’t have ${unknown.join(', ')}, so it can’t replay that battle.`};
  return {d};
}
function bcodeWinHTML(){
  const body = `<div class="bcode"><h3 class="bcodeh">Load battle code</h3><p class="note">Paste a battle code (it starts with OASIS-BATTLE:). The battle plays here; your game waits and comes back as it was.</p>
    <textarea id="bcode-in" rows="5" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Battle code" placeholder="OASIS-BATTLE:…">${esc(ui.codeText || '')}</textarea>
    ${ui.codeErr ? `<p class="err" role="alert">${esc(ui.codeErr)}</p>` : ''}
    <div class="row"><span class="grow"></span><button type="button" class="primary" data-act="bc-load">Watch battle</button></div></div>`;
  return popWinHTML('Load battle code', 'bcodewin', '', body, 'Codes come from “Copy battle code” in this menu during a battle.');
}
document.addEventListener('input', e => {
  if (!e.target || e.target.id !== 'bcode-in') return;
  ui.codeText = e.target.value;
  if (ui.codeErr){ ui.codeErr = ''; const er = e.target.parentNode.querySelector('.err'); if (er) er.remove(); }   // a new paste clears the old complaint
});
function bcodeLoad(text){
  const r = bcodeParse(text);
  if (r.err){ ui.codeErr = r.err; renderPlay(); return false; }
  if (G && G.net){ ui.codeErr = 'Finish the online game before watching a battle code.'; renderPlay(); return false; }
  if (ui.planning){ ui.codeErr = 'Wait for the AI to finish setting its deck, then try again.'; renderPlay(); return false; }
  replayStart(r.d);
  return true;
}
function replayStart(d){
  if (typeof saveT !== 'undefined' && saveT) saveNow();   // the real game's last change is saved before it steps aside
  const keep = G && G.replay ? G.replay : {G, ui};   // loading a code while watching one still returns to the real game
  keep.ui.codeWin = false; keep.ui.codeErr = ''; keep.ui.codeText = '';
  stopTimers(); stopAuto(); stopAnim();
  try{ window.OasisCubes && OasisCubes.clear(); }catch(e){}
  G = newGame({genomes:[null, null], labels:(d.l || ['You', 'AI']).slice(0, 2), target:d.t || 3});
  G.replay = keep; G.replayCode = d; G.pp = false; G.opp = null;
  G.round = d.r || 1; G.phase = 'battle';
  G.players.forEach((p, i) => { p.score = +(d.p || [])[i] || 0; });
  G.decks = d.c.map(x => clone(x.units)); G.spells = d.c.map(x => clone(x.spells || []));
  ui = freshUI();
  ui.pre = boardSnap();
  const res = runBattle(clone(d.c), true), w = res.result.w;
  G.lastBattle = {w, res}; if (w >= 0) G.players[w].score++;
  showBattle(res);
  renderPlay(); startAuto();
  if (d.w != null && d.w !== w) showToast(`This build plays the battle out differently (the code is from ${d.b || 'an older build'}).`);
  else if (d.b && d.b !== OASIS_BUILD) showToast(`Battle code from ${d.b}; this is ${OASIS_BUILD}.`);
}
function replayEnd(){
  const k = G && G.replay; if (!k) return;
  stopTimers(); stopAuto(); stopAnim();
  try{ window.OasisCubes && OasisCubes.clear(); }catch(e){}
  G = k.G; ui = k.ui;
  renderPlay();
  if (ui.battle) startAuto(); else scheduleAI();
}
