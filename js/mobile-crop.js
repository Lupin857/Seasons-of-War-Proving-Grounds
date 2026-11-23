
/* Phones: the shape cards are cut to, as an inline clip path (0-1 units, so it scales with any card). An inline clip
   applies at once; an external mask file is fetched after each redraw, and Safari hides the card until it arrives. */
document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute;width:0;height:0" aria-hidden="true" focusable="false"><clipPath id="tabclip" clipPathUnits="objectBoundingBox"><path d="M 0,0.05495 Q 0,0 0.05333,0 H 0.94667 Q 1,0 1,0.05495 V 0.89354 Q 1,0.9375 0.95733,0.9375 H 0.68733 L 0.684,0.9478 L 0.676,0.96154 L 0.668,0.97527 L 0.66,0.98901 L 0.65867,0.99176 H 0.38733 L 0.38267,0.98626 L 0.37467,0.97527 L 0.36533,0.96154 L 0.356,0.9478 L 0.35267,0.9375 H 0.04267 Q 0,0.9375 0,0.89354 Z"/></clipPath></svg>');
/* Every redraw rebuilds the Play view. Put the card pictures that were already on screen back in place of their new
   copies, so a card that stays put keeps its decoded picture instead of blinking while it decodes again. The old
   card gets the new copy in exchange: flights copy the old card (a card just bought), so it must keep its picture. */
// (steps of renderPlay: playArtBefore runs before the redraw, playArtAfter after it)
function playArtBefore(){
  const v = document.getElementById('view-play'), sel = 'img.cart, .pkhit.tuck > img', pool = new Map();
  if (v) v.querySelectorAll(sel).forEach(i => { const k = i.getAttribute('src'); if (!pool.has(k)) pool.set(k, []); pool.get(k).push(i); });
  return {v, sel, pool};
}
function playArtAfter({v, sel, pool}){
    if (v && pool.size) v.querySelectorAll(sel).forEach(n => {
      const a = pool.get(n.getAttribute('src'));
      if (!a || !a.length) return;
      const o = a.shift();
      if (o === n || o.isConnected) return;
      o.className = n.className; o.alt = n.alt;
      if (n.hasAttribute('aria-hidden')) o.setAttribute('aria-hidden', n.getAttribute('aria-hidden')); else o.removeAttribute('aria-hidden');
      const ph = document.createTextNode(''); n.replaceWith(ph); o.replaceWith(n); ph.replaceWith(o);
    });
}
/* Card pop-ups: the picture loads at once (not lazily: the sheet starts below the screen, so a lazy picture waited),
   and on phones the pop-up opens once the art is decoded, or after 150 ms at most, so it never shows a blank card. */
// (called by cardPop and openPeek in js/ui/17-card-peek-tooltips.js once this file has loaded)
function popArtEager(pk){
  pk.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; const c = artCanvas(i); if (c) i.replaceWith(c); });
}
let peekWaiting = null;
function peekWhenDecoded(card, self, args){
  if (!compact()) return openPeek0.apply(self, args);
  let srcs = [];
  try{ srcs = [...cardPop0(card).querySelectorAll('img')].filter(i => !artReady(i.getAttribute('src'))).map(i => i.src).filter(Boolean); }catch(e){}
  if (!srcs.length) return openPeek0.apply(self, args);
  const me = peekWaiting = {};
  let done = false;
  const go = () => { if (done) return; done = true; if (peekWaiting === me) peekWaiting = null; else return; if (card.isConnected) openPeek0.apply(self, args); };
  Promise.all(srcs.map(src => { const im = new Image(); im.src = src; return im.decode ? im.decode().catch(() => {}) : null; })).then(go);
  setTimeout(go, 150);
}

/* ---- damage cubes (cubes.js draws them): which card gets what in a step ---- */
function cubeStep(next, hits, prev){
  const C = window.OasisCubes; if (!C || !C.ok) return 0;
  const by = new Map();
  for (const x of (next.hits || [])){
    const el = document.querySelector(`#view-play .card[data-uid$="-${x.uid}"]:not(.mini)`); if (!el) continue;
    const id = el.dataset.uid, e = by.get(id) || {id, drops:[], moves:[], heal:0, ko:false};
    const src = x.from != null && document.querySelector(`#view-play .card[data-uid$="-${x.from}"]:not(.mini)`);
    if (src) e.moves.push({from:src.dataset.uid, n:x.a}); else e.drops.push(x.a);
    e.heal += x.heal; by.set(id, e);
  }
  for (const h of hits) if (h.ko){ const e = by.get(h.id) || {id:h.id, drops:[], moves:[], heal:0}; e.ko = true; e.heal = 0; by.set(h.id, e); }
  const speed = typeof autoFast === 'function' && autoFast() && autoOn() ? 2 : 1;
  for (const e of by.values()) e.speed = speed;
  ui.refill = hits.filter(h => h.heal > 0).map(h => ({id:h.id, from:h.hp, to:h.after}));
  // heals with no damage this step (Brawler in the casualty step): refill from where the bar was
  if (prev){ const pu = unitsOf(prev, ['charge', 'deck']), nu = unitsOf(next, ['charge', 'deck']), pct = v => Math.max(0, Math.min(100, (v.pow - v.dmg) / Math.max(1, v.pow) * 100));
    for (const e of by.values()) if (e.heal > 0 && !e.drops.some(n => n > 0) && pu.has(e.id) && nu.has(e.id)) ui.refill.push({id:e.id, from:pct(pu.get(e.id)), to:pct(nu.get(e.id))}); }
  return C.step([...by.values()]) / speed;
}
function cubeSync(){
  const C = window.OasisCubes; if (!C || !C.ok) return;
  C.afterRender();
  for (const id of [...GLOW.keys()]) glowPaint(id);
  if (!ui.battle){ return; }
  const f = ui.battle.frames[ui.frame], units = [];
  f.snap.forEach((sd, side) => { for (const u of [sd.charge, ...sd.deck]) if (u) units.push({id:`${side}-${u.uid}`, dmg:u.cubes ?? u.dmg}); });
  C.sync(units);
}
// (steps of renderPlay)
function playNotesBefore(){ return abSnap(document.querySelector('#view-play .stage')); }   // measured before the redraw replaces the stage
function playNotesAfter(snap){
  try{ cubeSync(); }catch(e){ console.error(e); }
  // the redraw replaced the notes: if they changed (or went away), let the old ones fade out
  try{ if (snap){ const nw = document.querySelector('#view-play .stage .abwin');
    if (nw && nw.dataset.key === snap.key){ snap.win.classList.add('kept'); nw.replaceWith(snap.win); }   // same notes: keep the very same boxes
    else abFade(snap); } }catch(e){}
}
// (steps of goFrame)
function cubesBeforeStep(glide){
  ui.abFrame = null;
  if (glide && window.OasisCubes) try{ OasisCubes.koNow(); }catch(e){}   // a defeated card's cubes lift off as it flips away
  else if (window.OasisCubes && OasisCubes.settle) try{ OasisCubes.settle(); }catch(e){}   // a jump (back, start, end): finish any cube still moving, so the redraw can match the cubes to the step
}
// a heal: the bar shows the hit first, then refills as the cubes are swept off
function healRefillAfterStep(glide){
  const rf = ui.refill; ui.refill = null;
  if (rf && glide) for (const x of rf){ const bar = document.querySelector(`#view-play .card[data-uid="${x.id}"] .hp i`); if (!bar) continue;
    bar.style.transition = 'none'; bar.style.width = x.from + '%'; void bar.offsetWidth;
    bar.style.transition = 'width .6s cubic-bezier(.3,.6,.3,1) .1s'; bar.style.width = x.to + '%'; }
}
// the ability glow lives on its own layer inside the card, so a lunge can't override it; when the board redraws, it
// picks up where it was (negative delay) instead of starting over or vanishing
const GLOW = new Map(), GLOW_MS = 900;
function glowPaint(id){
  const t0 = GLOW.get(id); if (t0 == null) return true;
  // 'sh:<unit>' glows that unit's Shield token (a Shield stopping a hit); anything else is the unit itself
  const sh = id.startsWith('sh:'), card = document.querySelector(`#view-play .card[data-uid="${sh ? id.slice(3) : id}"]:not(.mini)`); if (!card) return false;
  const tk = sh && (card.querySelector(':scope > .pk.shhit') || card.querySelector(':scope > .pk[data-k="sh"]')); if (sh && !tk) return false;
  const left = GLOW_MS - (performance.now() - t0); if (left <= 0){ GLOW.delete(id); return true; }
  let g = card.querySelector(`:scope > .trigglow[data-glow="${id}"]`);
  if (!g){ g = document.createElement('span'); g.className = 'trigglow' + (sh ? ' tkglow' : ''); g.dataset.glow = id; g.setAttribute('aria-hidden', 'true'); card.appendChild(g); }
  // a Shield's glow sits just behind its token, same place and size (the token clips anything drawn inside it)
  if (sh){ const cs = getComputedStyle(tk);
    Object.assign(g.style, {left:tk.offsetLeft + 'px', top:tk.offsetTop + 'px', width:tk.offsetWidth + 'px', height:tk.offsetHeight + 'px', zIndex:(parseInt(tk.style.zIndex) || -1) - 1 + '', transform:cs.transform, transformOrigin:cs.transformOrigin, borderRadius:cs.borderRadius}); }
  g.style.animationDelay = `-${GLOW_MS - left}ms`;
  return true;
}
window.cubeGlow = id => { GLOW.set(id, performance.now()); glowPaint(id); setTimeout(() => { for (const g of document.querySelectorAll(`#view-play .trigglow[data-glow="${id}"]`)) g.remove(); GLOW.delete(id); }, GLOW_MS + 50); };
function glowStep(f){   // every unit whose ability fires in this step
  // (an Executioner's attack carries its tag too, but Lethal only fires in the casualty step)
  const ids = new Set(f.lines.filter(l => l.ab && l.ab.u && !l.ab.g && !(l.ab.n === 'Executioner' && !/Lethal/.test(l.t))).map(l => `${l.ab.u}`));
  for (const id of ids) cubeGlow(id);
}
window.__cubesReady = () => { try{ cubeSync(); }catch(e){} };
