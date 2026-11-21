/* Tap play for Mobilize. A single tap waits a moment in case it's the first half of a double-tap (which opens the
   card to read). A single tap moves the card: deck → bench, bench → end of deck. A deck card with tokens first gives back its newest token, one per tap. */
let mobTapT = null, mobTapK = null, mobTapAt = 0, mobTapRef = null;
const mobKey = card => card.classList.contains('drow') ? 'd' + card.dataset.i : 'b' + card.dataset.name;   // deck rows and bench units only
function mobTap(card){
  const k = mobKey(card), now = performance.now();
  if (mobTapT && mobTapK === k && now - mobTapAt < 330){
    clearTimeout(mobTapT); mobTapT = null; mobTapK = null; mobTapRef = null;
    card.classList.remove('tapping'); openPeek(card, true); return;
  }
  if (mobTapT){ clearTimeout(mobTapT); mobTapT = null; const r = mobTapRef; mobTapRef = null; mobSingle(r); }   // a quick tap on another card: settle the first one now
  card.classList.add('tapping');
  mobTapK = k; mobTapAt = now;
  mobTapRef = card.classList.contains('drow') ? {zone:'deck', i:+card.dataset.i} : {zone:'bench', name:card.dataset.name};
  mobTapT = setTimeout(() => { mobTapT = null; const r = mobTapRef; mobTapRef = null; mobSingle(r); }, 300);
}
function mobSingle(ref){
  if (!ref || !G || G.phase !== 'mobilize' || ui.battle || !ui.draft) return;
  const d = ui.draft, s = ui.sel;
  let changed = false;
  ui.sel = null; ui.err = '';
  if (ref.zone === 'deck'){
    const u = d[ref.i]; if (!u) return;
    if ((u.arm || 0) + (u.tr || 0) + (u.sh || 0)){
      sfx.soft(); popTokAnim(ref.i);
      return;
    }
    d.splice(ref.i, 1); changed = true; sfx.soft();
  } else if (ref.zone === 'bench' && ref.name){
    if (!benchHas(ref.name)) return;
    d.push({name:ref.name, arm:0, tr:0}); changed = true; sfx.drop();
  }
  if (changed) ui.err = '';
  if (!changed){ renderPlay(); return; }
  return mobSlide();
}
function mobSlide(){
  // slide every card from where it was to where it is now (matched by name: a card that changed zones slides across)
  const rects = new Map();
  for (const r of document.querySelectorAll('#deck-list .drow, #bench-list .bcard')){ const n = r.dataset.uname || r.dataset.name; if (n && !rects.has(n)) rects.set(n, r.getBoundingClientRect()); }
  renderPlay();
  const nd = $('deck-list'); if (!nd || reduceMotion()) return;
  for (const el of document.querySelectorAll('#deck-list .drow, #bench-list .bcard')){
    const n = el.dataset.uname || el.dataset.name, r0 = rects.get(n); if (!r0) continue;
    rects.delete(n);
    const r1 = el.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:240, easing:SLIDE});
  }
}
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && (e.target.classList.contains('tokchip') || e.target.classList.contains('tcard'))){ e.preventDefault(); e.target.click(); return; }
  if (!ui.battle || $('view-play').hidden || e.target.closest('input,select,textarea')) return;
  if (e.key === 'ArrowRight'){ stepForward(); e.preventDefault(); }
  if (e.key === 'ArrowLeft'){ goFrame(Math.max(0, ui.frame - 1)); e.preventDefault(); }
});
/* Drag and drop while mobilizing: pointer events, so it works with a mouse, a pen or a finger.
   Mouse drags from anywhere on a row; touch drags from the ⠿ grip so the page can still scroll. */
let drag = null;
const SLIDE = 'cubic-bezier(.22,.9,.3,1)';
// FLIP: animate elements from where they were to where they are now
function slideFrom(rects, els, ms){
  if (reduceMotion()) return;
  for (const el of els){
    const r0 = rects.get(el); if (!r0) continue;
    const r1 = el.getBoundingClientRect(), dy = r0.top - r1.top, dx = r0.left - r1.left;
    if (Math.abs(dy) < 1 && Math.abs(dx) < 1) continue;
    el.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:ms || 220, easing:SLIDE});
  }
}
const deckRows = zone => [...zone.querySelectorAll('.drow')].filter(r => !drag || r !== drag.src);
// the deck is laid out back (top) to front (bottom), so deck position `at` goes just above the card now at `at - 1`
function placeGap(zone, at){
  const list = $('deck-list'), rows = deckRows(list), rects = new Map(rows.map(r => [r, r.getBoundingClientRect()]));
  if (zone){ const m = rows.length, ref = at > 0 ? rows[m - at] : null; if (ref) list.insertBefore(drag.line, ref); else list.appendChild(drag.line); }
  else if (drag.line.parentNode) drag.line.remove();
  slideFrom(rects, rows);
}
// Next step goes on the press, not the click: the button is redrawn when a step's animation ends, and a click whose
// press and release land on different copies of it is lost, so fast clicking used to drop steps
let nextDownAt = -1e9;
$('view-play').addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  const b = e.target.closest('[data-act="b-next"]'); if (!b || b.disabled) return;
  nextDownAt = performance.now(); stepForward();
});
$('view-play').addEventListener('pointerdown', e => {
  if (!drag || !drag.on) clearGhosts();   // any tap sweeps away a stranded card, in any phase
  if (!G || G.phase !== 'mobilize' || ui.battle || ui.planning || e.button > 0) return;
  // one card at a time: a second finger (or a stray touch) while a card is lifted doesn't start another drag
  if (drag && drag.on) return;
  clearGhosts();
  const src = e.target.closest('[data-drag]'); if (!src || e.target.closest('button,select,input')) return;
  // a finger picks a card up by holding it still for a moment (a quick swipe still scrolls the page); tokens and the mouse go right away
  const hold = false;
  if (drag && drag.t) clearTimeout(drag.t);
  drag = {pid:e.pointerId, src, kind:src.dataset.drag, tok:src.dataset.tok, i:+src.dataset.i, name:src.dataset.name, x0:e.clientX, y0:e.clientY, on:false, ghost:null, line:null, at:-1, zone:null, row:-1, hold, armed:!hold, t:null};
  if (hold) drag.t = setTimeout(() => {
    if (!drag || drag.on || drag.src !== src) return;
    drag.armed = true; drag.t = null; src.classList.add('lifted'); sfx.pick();
    if (navigator.vibrate) try{ navigator.vibrate(12); }catch(err){}
  }, 200);
});
// once a card is held, moving the finger drags it instead of scrolling the page
document.addEventListener('touchmove', e => { if (drag && (drag.armed && drag.hold || drag.on)) e.preventDefault(); }, {passive:false});
// drop any lifted-card copy left floating on the page (the one being dragged right now stays)
function clearGhosts(){ for (const n of document.querySelectorAll('body > .dragwrap, body > .dragghost')) if (!drag || n !== drag.ghost) n.remove(); }
function dragMove(e){
  if (!drag || e.pointerId !== drag.pid) return;
  if (!drag.on){
    const dist = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0);
    if (!drag.armed){ if (dist > 8){ clearTimeout(drag.t); drag = null; } return; }   // moved before the hold: it's a scroll
    if (dist < (drag.hold ? 3 : 6)) return;
    drag.on = true; drag.src.classList.remove('lifted', 'tapping'); if (!drag.hold) sfx.pick();
    if (mobTapT){ clearTimeout(mobTapT); mobTapT = null; mobTapRef = null; }
    const r = drag.src.getBoundingClientRect();
    drag.dx = drag.x0 - r.left; drag.dy = drag.y0 - r.top;
    // the card being dragged is the same square card as in the stacks: it rides in a stand-in stack, so every rule
    // that draws a Mobilize card (size, text, hidden buttons, card color) applies to it unchanged
    let g = solidArt(drag.src.cloneNode(true), r.width); g.classList.add('dragghost'); g.classList.remove('lifted', 'tapping', 'sel', 'cansel', 'target', 'notarget', 'dragging', 'isvan'); g.removeAttribute('hidden');
    // a deck card carries its attached tokens: the token cards tucked behind it and their name tabs ride along
    if (drag.kind === 'deck' && drag.src.dataset.room && drag.src.style.boxShadow)
      g.style.setProperty('box-shadow', drag.src.style.boxShadow + ',0 14px 32px rgba(0,0,0,.3)', 'important');
    if (g.classList.contains('mcard')){
      const host = document.createElement('div'); host.className = 'dgrid stack dragwrap'; host.setAttribute('aria-hidden', 'true');
      host.style.setProperty('--sc', r.width + 'px'); host.appendChild(g); g = host;
    } else g.style.width = r.width + 'px';
    g.style.left = r.left + 'px'; g.style.top = r.top + 'px';
    document.body.appendChild(g); drag.ghost = g;
    drag.line = document.createElement('div'); drag.line.className = 'dropgap';
    const ref = document.querySelector('#deck-list .drow'); drag.line.style.height = (drag.kind === 'deck' ? r.height : ref ? ref.getBoundingClientRect().height : 200) + 'px';
    document.body.classList.add('is-dragging');
    if (drag.kind === 'tok' || drag.kind === 'ton'){ drag.src.classList.add('dragging'); ui.pick = null; for (const r of document.querySelectorAll('#deck-list .drow')){ const u = ui.draft[+r.dataset.i]; r.classList.add(u && !tokBlock(drag.tok, u) ? 'target' : 'notarget'); } }
    else if (drag.kind === 'deck'){
      // the row lifts out and an empty slot of the same size stays behind
      // the slot left behind keeps the room the tokens' tabs took, so the column doesn't jump
      drag.line.style.marginTop = (+drag.src.dataset.room || 0) + 'px'; drag.line.dataset.room = drag.src.dataset.room || 0;
      drag.src.parentNode.insertBefore(drag.line, drag.src); drag.src.hidden = true; drag.src.remove();
      drag.zone = 'deck'; drag.at = drag.i;
    } else drag.src.classList.add('dragging');
  }
  e.preventDefault();
  drag.cx = e.clientX; drag.cy = e.clientY;
  drag.ghost.style.left = (e.clientX - drag.dx) + 'px'; drag.ghost.style.top = (e.clientY - drag.dy) + 'px';
  if (!drag.scrollT) autoScroll();
  dragHover();
}
// while dragging near the top or bottom of the screen, scroll the page so far-off rows can be reached
function autoScroll(){
  if (!drag || !drag.on){ return; }
  const edge = 70, y = drag.cy, h = window.innerHeight;
  const v = y < edge ? -(edge - y) / 3 : y > h - edge ? (y - (h - edge)) / 3 : 0;
  if (v){ window.scrollBy(0, Math.max(-24, Math.min(24, v))); dragHover(); }
  drag.scrollT = requestAnimationFrame(autoScroll);
}
function dragHover(){
  if (!drag || !drag.on) return;
  drag.ghost.hidden = true; const under = document.elementFromPoint(drag.cx, drag.cy); drag.ghost.hidden = false;
  if (drag.kind === 'tok' || drag.kind === 'ton'){
    const row = under && under.closest('#deck-list .drow');
    const ok = row && !row.classList.contains('notarget') ? +row.dataset.i : -1;
    for (const r of document.querySelectorAll('#deck-list .drow')) r.classList.toggle('tokover', +r.dataset.i === ok);
    drag.row = ok;
    const z = under && under.closest('[data-zone="bench"]');
    for (const zz of document.querySelectorAll('.dropzone')) zz.classList.toggle('over', drag.kind === 'ton' && zz === z);
    drag.zone = z ? 'bench' : null;
    return;
  }
  const e = {clientX:drag.cx, clientY:drag.cy};
  const zone = under && under.closest('[data-zone]');
  for (const z of document.querySelectorAll('.dropzone')) z.classList.toggle('over', z === zone && zone.dataset.zone !== 'deck');
  const zn = zone ? zone.dataset.zone : null;
  if (zn === 'deck'){
    // every card shows a strip of the same height, the front card sits at the bottom, and the column's top never
    // moves, so the drop spot comes straight from how far down the pointer is: steady while cards slide aside
    const list = $('deck-list'), rows = deckRows(list), cs = getComputedStyle(list);
    const strip = parseFloat(cs.getPropertyValue('--strip')) || 58, top = list.getBoundingClientRect().top + parseFloat(cs.paddingTop || 0);
    // each card's strip starts below its own token tabs; walk down the column adding them up
    let y = top, v = 0;
    for (const r of rows){ const h = (+r.dataset.room || 0) + strip; if (e.clientY < y + h) break; y += h; v++; }
    const N = rows.length + 1; v = Math.min(v, N - 1);
    const at = N - 1 - v;
    if (at !== drag.at || drag.zone !== 'deck') placeGap(list, at);
    drag.at = at;
  } else if (drag.zone === 'deck'){ placeGap(null); drag.at = -1; }
  drag.zone = zn;
}
function dragEnd(){
  if (!drag) return;
  const d = drag;
  if (d.t) clearTimeout(d.t);
  if (!d.on){ d.src.classList.remove('lifted'); drag = null; return; }
  ui.sel = null;
  if (d.zone || d.row >= 0) sfx.drop(); else sfx.soft();
  if (d.scrollT) cancelAnimationFrame(d.scrollT);
  const deck = ui.draft;
  if (d.kind === 'tok' || d.kind === 'ton'){
    const gc = d.ghost.querySelector('.mcard') || d.ghost, gr = gc.getBoundingClientRect();
    drag = null; d.ghost.remove();
    document.body.classList.remove('is-dragging');
    document.body.classList.add('just-dragged'); setTimeout(() => document.body.classList.remove('just-dragged'), 0);
    ui.err = '';
    if (d.row >= 0 && d.kind === 'tok'){ attachTokAnim(d.tok, d.row, gr); return; }
    if (d.row >= 0) placeTok(d.tok, d.row, d.kind === 'ton' ? d.i : null);
    else if (d.kind === 'ton' && deck[d.i]) popTok(deck[d.i], TOKN[d.tok] ? d.tok : 'tr');
    renderPlay();
    return;
  }
  let moved = null;
  if (d.zone === 'deck' && d.at >= 0){
    const u = d.kind === 'deck' ? deck.splice(d.i, 1)[0] : {name:d.name, arm:0, tr:0};
    deck.splice(Math.min(d.at, deck.length), 0, u); moved = u;
  } else if (d.zone === 'bench' && d.kind === 'deck') deck.splice(d.i, 1);
  // remember where everything is, re-render, then slide each row from there
  const rects = new Map(), deckEl = $('deck-list');
  if (deckEl) for (const r of deckEl.querySelectorAll('.drow')) if (!r.hidden) rects.set(r.dataset.key, r.getBoundingClientRect());
  let movedKey = null;
  if (moved){ let c = 0; for (const u of deck){ if (u.name === moved.name) c++; if (u === moved) break; } movedKey = `${moved.name}#${c}`; rects.set(movedKey, d.ghost.getBoundingClientRect()); }
  drag = null;
  d.ghost.remove();
  document.body.classList.remove('is-dragging');
  document.body.classList.add('just-dragged'); setTimeout(() => document.body.classList.remove('just-dragged'), 0);
  ui.err = ''; renderPlay();
  const nd = $('deck-list'); if (!nd || reduceMotion()) return;
  for (const el of nd.querySelectorAll('.drow')){
    const r0 = rects.get(el.dataset.key); if (!r0) continue;
    const r1 = el.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    const landing = el.dataset.key === movedKey;
    el.animate(landing
      ? [{transform:`translate(${dx}px,${dy}px) rotate(-1.5deg)`, boxShadow:'0 10px 30px rgba(0,0,0,.25)'}, {transform:'none', boxShadow:'0 0 0 rgba(0,0,0,0)'}]
      : [{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}],
      {duration: landing ? 260 : 220, easing:SLIDE});
  }
}
window.addEventListener('pointermove', dragMove, {passive:false});
window.addEventListener('pointerup', e => { if (drag && e.pointerId !== drag.pid) return; dragEnd(); });
// a cancelled drag (the browser took the touch, the app went to the background) puts the card back where it was
const cancelDrag = () => { if (drag && drag.on){ drag.zone = null; drag.at = -1; drag.row = -1; } dragEnd(); clearGhosts(); };
window.addEventListener('pointercancel', e => { if (drag && e.pointerId !== drag.pid) return; cancelDrag(); });
window.addEventListener('blur', cancelDrag);
document.addEventListener('visibilitychange', () => { if (document.hidden) cancelDrag(); });
// a drag that ends on a row must not also count as a click on it
$('view-play').addEventListener('click', e => { if (document.body.classList.contains('just-dragged')) e.stopPropagation(); }, true);
$('view-play').addEventListener('toggle', e => { if (e.target.id === 'chron-panel') ui.chronOpen = e.target.open; }, true);

