/* Turning a market card over to see (or hide) the miracles behind it: a real 3D flip in perspective. The card turns
   away to edge-on (the face foreshortens as it goes), the view switches, and the other side turns in from the far edge,
   so neither side is ever mirrored. Clicks during the half-second turn are ignored. */
function mirTurn(el, k, apply){
  const done = () => { apply(); renderPlay(); };
  if (!el || !el.animate || reduceMotion() || ui.mirTurning) { if (!ui.mirTurning) done(); return; }
  ui.mirTurning = true;
  const P = Math.max(360, el.offsetWidth * 3.4), T = (a, s) => `perspective(${P}px) rotateY(${a}deg) scale(${s})`;
  const a = el.animate([{transform:T(0, 1), filter:'brightness(1)'}, {transform:T(90, 1.06), filter:'brightness(.78)'}],
    {duration:160, easing:'cubic-bezier(.45,0,.75,.6)', fill:'forwards'});
  a.oncancel = () => { ui.mirTurning = false; };
  a.onfinish = () => {
    done(); a.cancel();
    const n = $('view-play').querySelector(`.mcard.hasmir[data-k="${CSS.escape(k)}"]`);
    if (n) n.animate([{transform:T(-90, 1.06), filter:'brightness(.78)'}, {transform:T(0, 1), filter:'brightness(1)'}],
      {duration:220, easing:'cubic-bezier(.25,.5,.4,1)'});
  };
}
// A card that dies: a copy of it turns over the edge nearest the graveyard, landing face down on the pile.
// delay (ms): the copy waits where the card was, and its spot in the graveyard stays hidden until it lands
// where an element sits in the battle table's own coordinates: its offsets up to the table, before any transform (the
// table's tilt, a lunge), so a copy placed there inside the table sits exactly on it and tilts with the table
function tableXY(el, line){
  let x = 0, y = 0, n = el;
  while (n && n !== line){ x += n.offsetLeft || 0; y += n.offsetTop || 0; n = n.offsetParent; }
  return n === line ? {left:x, top:y, width:el.offsetWidth, height:el.offsetHeight} : null;
}
function deathFly(r0, nameEl, delay = 0, leave = false){
  const g = r0.clone, uid = g.dataset.uid, line = $('view-play').querySelector('.stage .line.table');
  // it flies inside the tilted table, like the cards (on the page it would fly flat), in the table's own coordinates
  const a0 = r0.loc && {...r0.loc}, aim0 = line && a0 && tableXY(nameEl, line);
  if (!aim0) return;
  g.classList.remove('shake', 'lunge0', 'lunge1'); g.classList.add('deathfly');
  g.removeAttribute('data-uid'); g.dataset.fly = uid; g.setAttribute('data-keep', ''); g.setAttribute('aria-hidden', 'true');   // (a redraw mid-flight leaves it alone)
  for (const f of g.querySelectorAll('.float, .trigglow, .hprow')) f.remove();   // (its health row would show through, mirrored, on the back)
  Object.assign(g.style, {position:'absolute', left:a0.left + 'px', top:a0.top + 'px', width:a0.width + 'px', height:a0.height + 'px'});
  g.style.setProperty('margin', '0', 'important');   // (a charging card's reserved room above it is an !important margin: the copy must not keep it)
  const back = document.createElement('span'); back.className = 'dfback gcard';   // the same layers (edges, back, light) and phone crop as the pile's cards, so nothing changes as it lands
  back.innerHTML = `<span class="labsh" aria-hidden="true">${labEdges(0)}<i></i></span><span class="oback" aria-hidden="true"></span><span class="lablt" aria-hidden="true"></span>`; g.appendChild(back);
  line.appendChild(g);
  if (leave) for (const t of arriveKeeps(g)) t.remove();   // its tokens and gear stay for the card taking its place
  delay = labSplayOut(g, delay);   // its copies, gear and tokens tuck in behind it first, then it flies
  // the redraw can move the whole table (its rows resize): start from where the card really was on screen, not from its
  // old place in the table, so the copy doesn't jump as it takes off
  { const gr = g.getBoundingClientRect(), kx = gr.width / a0.width || 1, ky = gr.height / a0.height || 1;
    const ox = (r0.left - gr.left) / kx, oy = (r0.top - gr.top) / ky;
    if (Math.abs(ox) > .5 || Math.abs(oy) > .5){ a0.left += ox; a0.top += oy; g.style.left = a0.left + 'px'; g.style.top = a0.top + 'px'; } }
  const T = DEATH_FLY_MS;
  // perspective goes first so the turn reads as 3D: the near edge grows, the far edge and the face's text foreshorten
  const P = Math.max(360, a0.width * 3.4), pf = `perspective(${P}px) `;
  // it turns over the edge nearest the graveyard, like a card flipped onto a pile by hand: that edge stays put while the
  // far edge rises toward you and over (the back shows from 90°, offset .5), and the card lands face down on the pile;
  // the pile's top card is a card back too, so the copy simply hands over to it. (rotateY(+) lifts the left edge, so the
  // turn's sign follows which side the graveyard is on; e: from the card's middle to the edge it turns on)
  const path = r1 => { const dx = (r1.left + r1.width / 2) - (a0.left + a0.width / 2), dy = (r1.top + r1.height / 2) - (a0.top + a0.height / 2);
    const sx = Math.max(0.1, r1.width / a0.width), sy = Math.max(0.05, r1.height / a0.height), mx = (1 + sx) / 2, my = (1 + sy) / 2;
    const dir = dx >= 0 ? 1 : -1, e0 = dir * a0.width / 2, em = e0 * mx, e1 = e0 * sx;
    const k = (px, py, deg, e, kx, ky) => pf + `translate(${px}px,${py}px) rotateY(${dir * deg}deg) translate(${-e}px,0px) scale(${kx},${ky})`;
    return [
    {transform:k(e0, 0, 0, e0, 1, 1), offset:0, easing:'cubic-bezier(.45,0,.55,1)'},
    {transform:k((e0 + dx - e1) / 2, dy / 2, 90, em, mx, my), offset:.5, easing:'cubic-bezier(.45,0,.55,1)'},
    {transform:k(dx - e1, dy, 180, e1, sx, sy), opacity:1, offset:.93},
    {transform:k(dx - e1, dy, 180, e1, sx, sy), opacity:0, offset:1}
  ]; };
  const a = g.animate(path(aim0), {duration:T, delay, fill:'both'});
  let aim = aim0;
  back.animate([{opacity:0}, {opacity:0, offset:.5}, {opacity:1, offset:.501}, {opacity:1}], {duration:T, delay, fill:'both'});
  // the card in the pile is fully there under the copy as it lands (.93), before the copy fades, so nothing flickers
  nameEl.animate([{opacity:0}, {opacity:0, offset:.88}, {opacity:1, offset:.93}, {opacity:1}], {duration:T, delay, fill:'backwards'});
  // until the copy lands, the unit's card in the graveyard stays hidden, also when the board is redrawn mid-flight (the step
  // landing replaces the pile, and a staggered second unit is still in the air then): otherwise the card shows on the pile
  // early and the copy lands on top of it and flickers out
  const hold = () => {
    if (!g.isConnected){ for (const el of document.querySelectorAll(`.gyhold[data-uid="${uid}"], .gyhold[data-guid="${uid}"]`)) el.classList.remove('gyhold'); return; }
    const t = (a.currentTime || 0) - delay, landed = t >= T * .88;   // from .88 the card fades in under the copy, as above
    const st = $('view-play').querySelector('.stage');
    // the redraw can also move the card's place in the pile: the copy re-aims at where it is now
    const live = st && (st.querySelector(`.gcard[data-guid="${uid}"]`) || (nameEl.isConnected ? nameEl : null)), r = live && !landed && tableXY(live, line);
    if (r && r.width && (Math.abs(r.left - aim.left) > 1 || Math.abs(r.top - aim.top) > 1 || Math.abs(r.width - aim.width) > 1)){ aim = r; a.effect.setKeyframes(path(r)); }
    if (st) for (const el of st.querySelectorAll(`.line [data-uid="${uid}"], .gcard[data-guid="${uid}"]`)) if (el !== nameEl) el.classList.toggle('gyhold', !landed);
    requestAnimationFrame(hold);
  };
  if (uid) requestAnimationFrame(hold);
  a.onfinish = a.oncancel = () => g.remove();
}
// The card moves the engine recorded for a step (see mvs in runBattle)
const frameMoves = f => f ? f.lines.flatMap(l => l.mv || []) : [];
// A saved unit goes back into its deck instead of vanishing: it slides straight from where it was into its deck,
// under the top card (the deck is held face up, so the bottom of the deck is under the pile). The copy moves inside
// the deck zone itself, beneath the top card the whole way, so it never crosses over the pile.
function bDeckEl(side){
  const row = document.querySelector(`#view-play .stage .trow.s${VS(side)}`), dz = row && row.querySelector('.deckz');
  return dz && (dz.querySelector(`.tzc > .card[data-side="${side}"]:not(.mini):not(.deckfly)`) || dz.querySelector('.tzc > .slot'));
}
// out: a unit moving itself to the back of its deck (Sand Sailor) first slides a full card width out of the deck, over
// the new top card (to the left for yours, to the right for the opponent's), then back in under it
function deckFly(r0, side, out){
  const tgt = bDeckEl(side), dz = tgt && tgt.closest('.deckz'), box = tgt && tgt.parentNode;
  if (!tgt || !dz || !box || !r0.clone || !tgt.animate) return;
  const g = r0.clone, W = tgt.offsetWidth, H = tgt.offsetHeight;
  g.removeAttribute('data-uid'); g.removeAttribute('id');
  g.classList.remove('shake', 'lunge0', 'lunge1', 'tokanim'); g.classList.add('deckfly');
  for (const f of g.querySelectorAll('.float, .trigglow, .hprow')) f.remove();   // (its health bar stays behind: the deck has its own)
  g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-keep', '');   // a redraw mid-slide leaves it alone
  const prev = {pos:dz.style.position, z:dz.style.zIndex, iso:box.style.isolation, bpos:box.style.position};
  dz.style.position = 'relative'; dz.style.zIndex = 20; box.style.isolation = 'isolate';
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';   // before reading offsets: they're from here
  const rt = tgt.getBoundingClientRect();
  if (!rt.width || !W){ dz.style.position = prev.pos; dz.style.zIndex = prev.z; box.style.isolation = prev.iso; box.style.position = prev.bpos; return; }
  for (const [k, v] of [['position', 'absolute'], ['margin', '0'], ['left', tgt.offsetLeft + 'px'], ['top', tgt.offsetTop + 'px'],
    ['width', W + 'px'], ['height', H + 'px'], ['pointer-events', 'none'], ['transform-origin', '50% 50%'], ['z-index', '-1']]) g.style.setProperty(k, v, 'important');
  // screen px to the zone's own px (the table is tilted and zoomed)
  const kx = W / rt.width, ky = H / rt.height;
  const dx = ((r0.left + r0.width / 2) - (rt.left + rt.width / 2)) * kx, dy = ((r0.top + r0.height / 2) - (rt.top + rt.height / 2)) * ky;
  const s0 = Math.max(.5, Math.min(2, r0.width / rt.width));
  box.insertBefore(g, tgt);   // before the top card, and under it
  const T = out ? 760 : 620, wait = labSplayOut(g, 0);   // its copies, gear and tokens tuck in behind it first, then it slides
  let a;
  if (out){
    // out over the new top card, then back in under it (it changes layers at the far end, out of the deck's way)
    const ox = (VS(side) === 0 ? -1 : 1) * W * 1.06, oy = 0;
    g.style.setProperty('z-index', '3', 'important');
    a = g.animate([
      {transform:`translate(${dx}px,${dy}px) scale(${s0})`},
      {transform:`translate(${ox}px,${oy}px) scale(1)`, offset:.48, easing:'cubic-bezier(.4,0,.3,1)'},
      {transform:'translate(0px,0px) scale(1)'}
    ], {duration:T, delay:wait, easing:'cubic-bezier(.3,0,.3,1)', fill:'both'});
    setTimeout(() => g.style.setProperty('z-index', '-1', 'important'), wait + T * .5);
  } else a = g.animate([
    {transform:`translate(${dx}px,${dy}px) scale(${s0})`, filter:'brightness(1)'},
    {transform:'translate(0px,0px) scale(1)', filter:'brightness(.85)'}
  ], {duration:T, delay:wait, easing:'cubic-bezier(.5,0,.2,1)', fill:'both'});
  setTimeout(() => { try{ sfx.flick(); }catch(e){} }, wait + T * .7);   // as it slips under the pile
  a.onfinish = a.oncancel = () => { g.remove(); dz.style.position = prev.pos; dz.style.zIndex = prev.z; box.style.isolation = prev.iso; box.style.position = prev.bpos; };
}
// A revealed unit buried under new cards put on top of its deck (a Recruiter's Drifters): a copy of it stays in the
// deck spot, under the new top card, while its copies, gear and tokens tuck in behind it, and goes once the new top
// card is in view (it may wait for its ability to play before it fades in)
function buryTuck(r0, side){
  const tgt = bDeckEl(side), box = tgt && tgt.parentNode;
  if (!tgt || !box || !r0.clone || !tgt.animate) return;
  const g = r0.clone;
  g.removeAttribute('data-uid'); g.removeAttribute('id');
  g.classList.remove('shake', 'lunge0', 'lunge1', 'tokanim'); g.classList.add('deckfly');
  for (const f of g.querySelectorAll('.float, .trigglow, .hprow')) f.remove();
  g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-keep', '');   // a redraw leaves it alone
  const prev = {iso:box.style.isolation, bpos:box.style.position};
  box.style.isolation = 'isolate';
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
  for (const [k, v] of [['position', 'absolute'], ['margin', '0'], ['left', tgt.offsetLeft + 'px'], ['top', tgt.offsetTop + 'px'],
    ['width', tgt.offsetWidth + 'px'], ['height', tgt.offsetHeight + 'px'], ['pointer-events', 'none'], ['z-index', '-1']]) g.style.setProperty(k, v, 'important');
  box.insertBefore(g, tgt);
  const t0 = performance.now(), tucked = labSplayOut(g, 0);
  const tick = () => {
    const top = bDeckEl(side), shown = top && top.classList.contains('card') && +getComputedStyle(top).opacity >= .99
      && getComputedStyle(top).visibility === 'visible' && !top.getAnimations().some(x => x.playState === 'running');
    const t = performance.now() - t0;
    if (!g.isConnected || (t > tucked && shown) || t > 4000){ g.remove(); box.style.isolation = prev.iso; box.style.position = prev.bpos; return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
// Cards an ability brings into a battle (Recruiter's Drifters, the Drifter taking Cowardly Squire's place) slide in from
// the edge of the board on their owner's side, as if taken from the supply beside the table. The ink layer's tick times
// them by the ability (arrivals in stepPlan): until then the card is hidden, except the tokens and gear it keeps from the
// unit whose place it takes, which stay in view where that unit stood; the card then slides in under them.
const ARRIVE_T = 560, ARRIVE_GAP = 170;
function arriveKeeps(el){ return el.querySelectorAll(':scope > .tk.gtk, :scope > .tk.pk'); }
function arriveShow(el, a, mode){
  if (mode === 'wait'){ el.style.visibility = 'hidden'; if (a.place) for (const t of arriveKeeps(el)) t.style.visibility = 'visible'; return; }
  el.style.visibility = ''; for (const t of arriveKeeps(el)) t.style.visibility = '';
  if (mode === 'slide' && a && !a.done){ a.done = true; arriveSlide(el, a.side, !!a.place, 0); }
  else if (a) a.done = true;
}
function arriveSlide(el, side, keep, delay){
  if (!el.animate || reduceMotion()) return;
  const st = el.closest('.stage'), r = el.getBoundingClientRect(), sr = st ? st.getBoundingClientRect() : r;
  const dy = side === 0 ? Math.max(sr.bottom, r.bottom) - r.top + 14 : -(r.bottom - Math.min(sr.top, r.top) + 14);
  const o = {duration:ARRIVE_T / (autoFast() ? 2 : 1), delay, easing:'cubic-bezier(.15,.75,.3,1)', fill:'backwards'};
  el.animate([{translate:`0px ${dy}px`}, {translate:'0px 0px'}], o);
  if (keep) for (const t of arriveKeeps(el)) t.animate([{translate:`0px ${-dy}px`}, {translate:'0px 0px'}], o);   // they stay put
  setTimeout(() => { try{ sfx.flick(); }catch(e){} }, delay + o.duration * .75);
}
// an arriving card that isn't drawn (it ends up under the top card): a copy of the top card slides in for it, then
// stays under the top card until that one has slid in too
function arriveGhost(stage, a){
  const top = bDeckEl(a.side), box = top && top.parentNode;
  if (!top || !box || !top.classList.contains('card')) return;
  const g = top.cloneNode(true);
  g.removeAttribute('data-uid'); g.removeAttribute('id'); g.style.visibility = '';
  for (const f of g.querySelectorAll('.tk, .float, .trigglow, .hprow')) f.remove();
  g.classList.add('deckfly'); g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-keep', '');
  const prev = {iso:box.style.isolation, bpos:box.style.position};
  box.style.isolation = 'isolate';
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
  for (const [k, v] of [['position', 'absolute'], ['margin', '0'], ['left', top.offsetLeft + 'px'], ['top', top.offsetTop + 'px'],
    ['width', top.offsetWidth + 'px'], ['height', top.offsetHeight + 'px'], ['pointer-events', 'none'], ['z-index', '-1']]) g.style.setProperty(k, v, 'important');
  box.insertBefore(g, top);
  arriveSlide(g, a.side, false, 0);
  const t0 = performance.now();
  const tick = () => {
    const t = bDeckEl(a.side), landed = t && getComputedStyle(t).visibility === 'visible' && !t.getAnimations().some(x => x.playState === 'running');
    if (!g.isConnected || (performance.now() - t0 > ARRIVE_T / (autoFast() ? 2 : 1) && landed) || performance.now() - t0 > 4000){ g.remove(); box.style.isolation = prev.iso; box.style.position = prev.bpos; return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
// Ability notes for a save (Infirmary Tent, Field Medic, Second Wind) point into the deck the unit went back into
const abIsSave = g => g.lines.some(l => (l.mv || []).some(m => m.k === 'save'));
// New tokens slide out from behind their card one at a time (yours and the AI's in the order they were given),
// right after the step lands; no extra clicks. Each token's own touch (Might's flex, a Shield's effect: juiceTokenLand)
// plays together with its slide, every time, the second Might token as much as the first (Brian, Nov 25)
function animateTokens(prevF, curF){
  clearTimeout(ui.tokT); if (!prevF || !curF || reduceMotion()) return;
  const counts = u => ({arm:u.arm || 0, tr:u.tr || 0, sh:u.sh || 0});
  const before = new Map();
  prevF.snap.forEach((sd, side) => { for (const u of [sd.charge, ...sd.deck]) if (u) before.set(`${side}-${u.uid}`, counts(u)); });
  const queue = [];
  curF.snap.forEach((sd, side) => {
    for (const u of [sd.charge, ...sd.deck]){
      if (!u) continue;
      const id = `${side}-${u.uid}`, b = before.get(id); if (!b) continue;
      const now = counts(u), kept = {cp:u.cp || 0}, added = [];
      for (const k of ['arm', 'tr', 'sh']){ kept[k] = Math.min(b[k], now[k]); for (let n = b[k]; n < now[k]; n++) added.push(k); }
      if (!added.length) continue;
      const el = $('view-play').querySelector(`.stage .card:not(.mini)[data-uid="${id}"]`); if (!el) continue;
      const order = tokenList(kept).concat(added).slice(0, el.classList.contains('hasart') ? 99 : pokeCap()), start = Math.min(tokenList(kept).length, order.length);
      if (start >= order.length) continue;
      const set = (n, pop) => {
        const ua = (el.querySelector(':scope > .ctk img') || {}).src || (typeof artURL === 'function' ? artURL(u.name.replace(/^Jester → .*/, 'Jester'), 'u') : null);
        const art = el.classList.contains('hasart') ? {...artInfo(u), unitArt:ua} : null;
        const pp = pokeParts(order.slice(0, n), VS(side), 0, art);
        el.style.boxShadow = pp.shadow;
        if (art) applyRoom(el, pp.room); else Object.assign(el.style, {marginLeft:'', marginRight:'', marginTop:'', marginBottom:''}, n ? pp.room : {});
        const k = order[n - 1], had = pop && art ? el.querySelector(`:scope > .pk.tk[data-k="${k}"]:not(.pkfly)`) : null;
        if (pop) juiceTokenLand(el, k, 1, 0);   // this token's touch, as it slides in
        if (had){
          const cp = had.cloneNode(true); cp.classList.add('pkfly'); cp.classList.remove('shhit'); const c = cp.querySelector('.tkn'); if (c) c.remove();
          had.after(cp);
          labSplayIn(el, 0, [cp], () => { cp.remove(); draw(); });
          return;
        }
        draw();
        if (pop){ const nw = art ? el.querySelector(`:scope > .pk.tk[data-k="${k}"]:not(.pkfly)`) : [...el.querySelectorAll(':scope > .pk')].pop();
          if (nw){ if (art) labSplayIn(el, 0, [nw]); else nw.classList.add('pknew'); } }
        function draw(){
          for (const x of el.querySelectorAll(':scope > .pk:not(.pkfly):not(.pkcrack), :scope > .gtk, :scope > .ctk')) x.remove();
          const bg = el.querySelector(':scope > .cartbg');
          bg ? bg.insertAdjacentHTML('afterend', pp.html) : el.insertAdjacentHTML('afterbegin', pp.html);
        }
      };
      set(start, false);              // back to how it looked before this step...
      void el.offsetWidth; el.classList.add('tokanim');
      for (let n = start + 1; n <= order.length; n++) queue.push(() => set(n, true));   // ...then each new one slides in
    }
  });
  let i = 0;
  const next = () => { if (i >= queue.length) return; queue[i++](); try{ sfx.tick(); }catch(e){} ui.tokT = setTimeout(next, 240); };
  if (queue.length) ui.tokT = setTimeout(next, 140);
  ui.tokUntil = performance.now() + (queue.length ? 140 + 240 * queue.length + 520 : 0);   // when the last token has slid in (auto-play waits for it)
}
// Moving on from a step where a Shield blocked a hit: the shield (its token card peeking out behind the unit, and its
// icon) cracks, splits and falls away. Measured from the board before it is redrawn without that shield.
function shieldsToBreak(){ return [...$('view-play').querySelectorAll('.stage .card > .pk.shhit')].map(tokenBreakInfo).filter(Boolean); }
// what breaking one token takes: measured from the board before it is redrawn without that token (a Shield that blocked a
// hit, Might a Fencer discards)
function tokenBreakInfo(pk){   // (el is a copy: the in-place redraw can reuse the token's element for something else)
  const card = pk.parentElement, cr = card.getBoundingClientRect(), pr = pk.getBoundingClientRect(); if (!cr.width) return null;
  const cs = getComputedStyle(card), px = parseFloat(cs.getPropertyValue('--px')) || 12, py = parseFloat(cs.getPropertyValue('--py')) || 8;
  const j = +pk.style.getPropertyValue('--j') || 0, side = +card.dataset.side, sg = side === 1 ? -1 : 1, kind = pk.dataset.k;
  if (pk.classList.contains('tk')){ const ty = parseFloat(cs.getPropertyValue('--tky')) || 26, tl = parseFloat(cs.getPropertyValue('--tkl')) || 5;
    return {art:true, el:pk.cloneNode(true), cr, pr, ty, tl, side, kind, rad:cs.borderRadius, uid:card.dataset.uid, z:+(pk.style.zIndex || -1)}; }
  return {cr, pr, dx:sg * px * (j + 1), dy:-sg * py * (j + 1), sx:sg * px, sy:-sg * py, side, kind, icon:pk.innerHTML, rad:cs.borderRadius};
}
function breakTokens(list){
  if (reduceMotion()) return;
  try{ sfx.tick(); }catch(e){}
  for (const b of list){
    if (b.art){ breakArtToken(b); continue; }
    const {cr, dx, dy, sx, sy} = b, W = cr.width, H = cr.height;
    // the visible sliver of the shield's token card: the one-token-wide edge that sticks out past the card (or token)
    // just inside it, an L shape
    const L = sx > 0 ? [[0,0],[W,0],[W,H],[W-sx,H],[W-sx,-sy],[0,-sy]] : [[0,0],[-sx,0],[-sx,H-sy],[W,H-sy],[W,H],[0,H]];
    const wrap = document.createElement('div'); wrap.className = 'shbreak'; wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = `left:${cr.left + dx}px;top:${cr.top + dy}px;width:${W}px;height:${H}px`;
    // the sliver splits along a crack into two pieces that fall away
    const mid = W / 2, cut = H / 2;
    const half = (keepLeft) => L.map(([x, y]) => [keepLeft ? Math.min(x, mid + (y < cut ? 6 : -6)) : Math.max(x, mid + (y < cut ? 6 : -6)), y]);
    for (const [keepLeft, rot, tx] of [[true, -14, -16], [false, 12, 16]]){
      const pc = document.createElement('div'); pc.className = 'shpiece s' + b.side; pc.style.borderRadius = b.rad;
      pc.style.clipPath = `polygon(${half(keepLeft).map(([x, y]) => `${x}px ${y}px`).join(',')})`;
      wrap.appendChild(pc);
      pc.animate([{transform:'none', opacity:1}, {transform:'translateX(0) rotate(0)', opacity:1, offset:.25},
                  {transform:`translate(${tx}px, 34px) rotate(${rot}deg)`, opacity:0}], {duration:620, delay:120, easing:'cubic-bezier(.5,0,.75,.4)', fill:'forwards'});
    }
    // the icon cracks: a jolt, then its two halves fly apart
    const ic = b.pr, iw = ic.width, ih = ic.height;
    for (const [clip, tx, rot] of [[`polygon(0 0,55% 0,40% 45%,58% 60%,45% 100%,0 100%)`, -10, -30], [`polygon(55% 0,100% 0,100% 100%,45% 100%,58% 60%,40% 45%)`, 10, 30]]){
      const h = document.createElement('span'); h.className = 'shicon'; h.innerHTML = b.icon;
      h.style.cssText = `left:${ic.left - cr.left - dx}px;top:${ic.top - cr.top - dy}px;width:${iw}px;height:${ih}px;clip-path:${clip}`;
      wrap.appendChild(h);
      h.animate([{transform:'scale(1)', opacity:1}, {transform:'scale(1.35)', opacity:1, offset:.18}, {transform:'scale(1.2)', opacity:1, offset:.3},
                 {transform:`translate(${tx}px, 22px) rotate(${rot}deg) scale(1)`, opacity:0}], {duration:640, easing:'ease-in', fill:'forwards'});
    }
    const crack = document.createElement('span'); crack.className = 'shflash';
    crack.style.cssText = `left:${ic.left - cr.left - dx + iw / 2}px;top:${ic.top - cr.top - dy + ih / 2}px`;
    wrap.appendChild(crack);
    crack.animate([{transform:'translate(-50%,-50%) scale(.2)', opacity:.9}, {transform:'translate(-50%,-50%) scale(1.6)', opacity:0}], {duration:360, easing:'ease-out', fill:'forwards'});
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 900);
  }
}
// a Shield token card tucked behind an art card: its visible part (the banner strip and the sliver down the left)
// jolts, cracks, and the two halves tumble up and away from behind the card. The halves are copies of the token
// itself, so it looks the same until it cracks.
function breakArtToken(b){
  const {el, ty, tl, pr} = b, W = pr.width, H = pr.height;
  const card = b.uid && document.querySelector(`#view-play .card[data-uid="${b.uid}"]:not(.mini)`); if (!card || !el) return;
  const L = [[0,0],[W,0],[W,ty],[tl,ty],[tl,H],[0,H]], mid = W * .45;
  const half = keepLeft => L.map(([x, y]) => [keepLeft ? Math.min(x, mid + (y < ty / 2 ? 8 : -8)) : Math.max(x, mid + (y < ty / 2 ? 8 : -8)), y]);
  const cr = card.getBoundingClientRect(), x0 = pr.left - cr.left, y0 = pr.top - cr.top;   // where it was, inside the card
  for (const g of card.querySelectorAll(':scope > .tkglow')) g.remove();   // (a glow still going goes with it)
  for (const [keepLeft, rot, tx, ty2] of [[true, -16, -20, -10], [false, 14, 12, -18]]){
    const pc = el.cloneNode(true); pc.classList.remove('shhit');   // same classes and place as the token, so it looks the same
    pc.classList.add('pkcrack');
    // only the part that was showing breaks off (important: some board looks force their own clip on tokens)
    pc.style.setProperty('clip-path', `polygon(${half(keepLeft).map(([x, y]) => `${x}px ${y}px`).join(',')})`, 'important');
    card.appendChild(pc);
    // (translate/rotate/scale, not transform: a fanned stack already uses transform to place the token)
    const a = pc.animate([{scale:1, translate:'0px 0px', rotate:'0deg', opacity:1}, {scale:1.04, opacity:1, offset:.14}, {scale:1, translate:'0px 0px', rotate:'0deg', opacity:1, offset:.24},
                          {scale:1, translate:`${tx}px ${ty2}px`, rotate:`${rot}deg`, opacity:0}], {duration:640, easing:'cubic-bezier(.4,0,.7,.5)', fill:'forwards'});
    a.onfinish = a.oncancel = () => pc.remove();
  }
  const wrap = document.createElement('div'); wrap.className = 'shbreak'; wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = `position:absolute;left:${x0}px;top:${y0}px;width:${W}px;height:${H}px;z-index:7`;
  const crack = document.createElement('span'); crack.className = 'shflash';
  crack.style.cssText = `left:${mid}px;top:${ty / 2}px`;
  wrap.appendChild(crack); card.appendChild(wrap);
  const c = crack.animate([{transform:'translate(-50%,-50%) scale(.2)', opacity:.9}, {transform:'translate(-50%,-50%) scale(1.6)', opacity:0}], {duration:360, easing:'ease-out', fill:'forwards'});
  c.onfinish = c.oncancel = () => wrap.remove();
}
// break the shields now and redraw those cards without them (the next step's arrows then aim at the board as it is)
function breakShieldsNow(){
  const list = shieldsToBreak(); if (!list.length) return;
  breakTokens(list);
  const units = unitsOf(ui.battle.frames[ui.frame], ['charge', 'deck']);
  for (const card of new Set([...$('view-play').querySelectorAll('.stage .card > .pk.shhit')].map(x => x.parentElement))){
    const u = units.get(card.dataset.uid), side = +card.dataset.side; if (!u) continue;
    const ua = (card.querySelector(':scope > .ctk img') || {}).src || null;
    const art = card.classList.contains('hasart') ? {...artInfo(u), unitArt:ua} : null;
    const t = art ? tokenList(u) : tokenList(u).slice(0, pokeCap()), pp = pokeParts(t, side, 0, art);
    card.style.boxShadow = t.length || art ? pp.shadow : '';
    // the card eases into its new spot as the stack behind it shrinks, instead of jumping
    if (art) setTimeout(() => { card.classList.add('tokanim'); applyRoom(card, pp.room); setTimeout(() => card.classList.remove('tokanim'), 480); try{ window.OasisCubes && OasisCubes.afterRender(); }catch(e){} }, reduceMotion() ? 0 : 160);
    for (const x of card.querySelectorAll(':scope > .pk:not(.pkcrack), :scope > .gtk, :scope > .ctk')) x.remove();
    const bg = card.querySelector(':scope > .cartbg');
    bg ? bg.insertAdjacentHTML('afterend', pp.html) : card.insertAdjacentHTML('afterbegin', pp.html);
  }
}
function stepForward(){
  if (!ui.battle) return;
  const last = ui.battle.frames.length - 1;
  // a click while a step is still animating finishes that step at once and goes straight on to the next one,
  // so every click moves exactly one step however fast you click
  if (ui.animT) goFrame(ui.pendingFrame);
  if (ui.frame >= last) return;
  juiceRinse();   // an Interceptor's ink wash from the last step rinses out as this one starts
  breakShieldsNow();   // a shield that blocked a hit in the step on screen breaks as soon as you move on
  const prev = ui.battle.frames[ui.frame], next = ui.battle.frames[ui.frame + 1], to = ui.frame + 1;
  ui.inkStart = to;   // the battle ink starts drawing this step now, as it begins (js/ui/19-battle-ink.js)
  try{ glowStep(next); ui.abFrame = to; mountAbWin(); }catch(e){}   // abilities firing this step glow, and their notes show, as it begins
  if (reduceMotion()){ goFrame(to, true); return; }
  const before = unitsOf(prev, ['charge', 'deck']), after = unitsOf(next, ['charge', 'deck']), grave = unitsOf(next, ['grave']);
  const hits = [], saved = new Set(frameMoves(next).filter(m => m.to === 'deck-bottom').map(m => m.u));   // saves and Sand Sailor: back under the deck
  for (const [id, u] of before){
    const hpOf = v => Math.max(0, Math.min(100, (v.pow - v.dmg) / Math.max(1, v.pow) * 100));
    if (saved.has(id)) hits.push({id, t:'Saved', ko:true, save:true, hp:100, d:0});   // its cubes lift off as it goes back into the deck
    else if (after.has(id)){ const v = after.get(id), ev = (next.hits || []).filter(x => `${id}`.endsWith('-' + x.uid)), heal = ev.reduce((a, x) => a + x.heal, 0), d = v.dmg + heal - u.dmg;
      if (d > 0){ const pre = {...v, dmg:v.dmg + heal}; hits.push({id, t:`−${d}`, hp:hpOf(pre), cur:Math.max(0, pre.pow - pre.dmg), max:v.pow, heal, after:hpOf(v), d}); } }
    else if (grave.has(id)) hits.push({id, t:'Defeated', ko:true, hp:0, d:Math.max(1, u.pow - u.dmg)});
  }
  const fought = next.lines.some(l => / fight\.$/.test(l.t));
  const lethal = LAB.kwLethal && !reduceMotion() && next.lines.some(l => /\bLethal\b/.test(l.t));   // keyword juice (juice lab)
  const arrows = next.lines.filter(l => l.to);
  const heals = (next.hits || []).some(x => x.heal > 0);
  if (!fought && !hits.length && !arrows.length && !heals && !juiceWants(next)){ goFrame(to, true); return; }   // (juiceWants: an Interceptor's Silence with nothing else to show)
  const root = $('view-play');
  const hitT = fought ? labClash(root) : juiceAbilityWind(root, next, hits);   // the charging units rush in and collide (or an ability winds up and stamps); hits land at the impact
  if (!fought && !hits.length) sfx.tick();
  if (fought) setTimeout(() => sfx.clash(), Math.max(0, hitT - 30));
  ui.pendingFrame = to;
  ui.animT = setTimeout(() => {
    for (const l of arrows) if (l.to && l.from && !l.tok && !l.sil && !l.cut && l.amt === 0) cubeGlow('sh:' + l.to);   // a Shield stops this hit
    juiceSilenceStep(root, next, prev);   // Interceptor: the ink wash floods the cards its strokes reach
    const koOnly = hits.length && hits.every(h => h.ko) && !fought && !heals;   // a casualty step: nothing lands, cards just leave
    if (lethal) juiceLethal(hits);   // Lethal: a seal, the sound drops out for a silent beat, then one low thud
    else if (hits.some(h => !h.ko)) sfx.hit(); else if (hits.some(h => !h.save) && !koOnly) sfx.ko();
    juiceKeywords(root, next, prev, hits);   // Overrun nudge, a Shield's clang
    for (const h of hits){
      const el = root.querySelector(`.card[data-uid="${h.id}"]`); if (!el) continue;
      // health bar drains to its new level
      const bar = el.querySelector('.hp i'); if (bar){ bar.style.transition = 'width .6s cubic-bezier(.3,.6,.3,1) .12s'; bar.style.width = h.hp + '%'; }
      // the hp readout ticks down to its new value
      if (h.cur != null){
        const hn = el.querySelector('.hpn');
        if (hn){ hn.classList.add('hurt'); hn.innerHTML = `<b>${h.cur}</b>/${h.max}<span class="hpu"> hp</span>`;
          hn.animate([{opacity:0, transform:'scale(1.3)'}, {opacity:1, transform:'none'}], {duration:450, delay:150, easing:'ease-out', fill:'backwards'}); }
      }
    }
    juiceImpact(root, hits, fought);   // impact juice: table thump, recoil (Board settings switches)
    const tokOnly = arrows.length && arrows.every(a => a.tok) && !hits.length && !fought;
    const cubeT = cubeStep(next, hits, prev);   // drops, heals and the defeat sweep; a defeated card waits until its cubes are off
    // defeats with nothing else to watch go almost at once (the KO sound plays as the card starts to fly), instead of
    // sitting through the hit timer with an empty board; token arrows from a defeat still get time to read
    const wait = lethal ? juiceLethalT() : koOnly ? (arrows.length ? 1000 : 150) : (tokOnly ? 520 : arrows.length ? 1000 : hits.length ? 720 : 260);
    ui.animT = setTimeout(() => { ui.animT = null; if (koOnly && !lethal && !hits.every(h => h.save)) sfx.ko(); goFrame(to, true); }, Math.max(wait, cubeT));
  }, hitT);
}
/* Reminders: before you pass with money you could still spend, or lock in a deck with things left on the bench */
function shopLeftovers(){
  if (!G || G.phase !== 'shop' || cur(G) !== seat() || G.passed[seat()]) return null;
  const S = seat(), me = G.players[S], names = [];
  for (const o of aiShopOptions(G, S)){ const info = buyInfo(G, S, o.name, o.kind, o.src, o.idx); if (info.ok && !names.includes(o.name)) names.push(o.name); }
  const bm = bVal(me, 'Black Market') && !G.bmUsed[S];
  if (!names.length && !bm) return null;
  const items = [];
  if (names.length) items.push(`You still have <b>$${me.money}</b>, enough for ${names.length > 4 ? `${names.slice(0, 4).map(esc).join(', ')} and ${names.length - 4} more` : names.map(esc).join(', ').replace(/, ([^,]*)$/, ' or $1')}.`);
  if (bm) items.push(`You haven't looked at your <b>Black Market</b> this shop (tap the glowing unit or building deck).`);
  return items;
}
function mobilizeLeftovers(){
  if (!G || G.phase !== 'mobilize' || !ui.draft) return null;
  const me = G.players[seat()], d = ui.draft, items = [];
  const arm = bVal(me, 'Smithy') - d.reduce((s, u) => s + (u.arm||0), 0);
  const tr = bVal(me, 'Study') - d.reduce((s, u) => s + (u.tr||0), 0);
  const shl = shAllow(me) - d.reduce((s, u) => s + (u.sh||0), 0);
  const recLeft = recBase(me) - d.filter(u => u.name === 'Recruit').length;   // miracle Recruits can wait in hand
  const bench = Object.keys(me.hand).filter(n => n !== 'Recruit' && !d.some(u => u.name === n));
  const room = deckCap(me) - d.filter(u => !exemptUnit(u.name) && !isBat(u.name)).length;
  const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
  if (arm > 0 && d.length) items.push(`<b>${plural(arm, 'Armament', 'Armaments')}</b> not placed (+1 power each).`);
  if (shl > 0 && d.length) items.push(`<b>${plural(shl, 'Shield', 'Shields')}</b> not placed (each blocks a hit).`);
  if (tr > 0 && d.some(u => !tokBlock('tr', u))) items.push(`<b>${plural(tr, 'Training token', 'Training tokens')}</b> not placed (+1 level each).`);
  const gl = gearLeft(me, d), gn = Object.keys(gl).filter(n => gl[n] > 0 && isGear(n));
  if (gn.length && d.some(u => !isBat(u.name) && !u.gear)) items.push(`<b>${gn.map(n => esc(n) + (gl[n] > 1 ? ` ×${gl[n]}` : '')).join(', ')}</b> not equipped. Gear only works on a unit in your deck.`);
  if (recLeft > 0) items.push(`<b>${plural(recLeft, 'Recruit', 'Recruits')}</b> left on the bench. ${recLeft === 1 ? "It's" : "They're"} discarded after this battle either way.`);
  const merc = bench.filter(exemptUnit);
  if (merc.length) items.push(`<b>${merc.map(esc).join(', ')}</b> on the bench. ${merc.length === 1 ? "It doesn't" : "They don't"} count toward your unit limit.`);
  const reg = bench.filter(n => !exemptUnit(n));
  if (room > 0 && reg.length) items.push(`Room for <b>${plural(Math.min(room, reg.length), 'more unit', 'more units')}</b>, and ${reg.length > 3 ? `${reg.slice(0, 3).map(esc).join(', ')} and ${reg.length - 3} more are` : reg.map(esc).join(', ').replace(/, ([^,]*)$/, ' and $1') + (reg.length === 1 ? ' is' : ' are')} on the bench.`);
  return items.length ? items : null;
}
function remindHTML(){
  const r = ui.remind; if (!r) return '';
  const pass = r.kind === 'pass';
  return `<div class="remind" role="dialog" aria-modal="true" aria-labelledby="remind-h"><div class="remindbox">
    <h3 id="remind-h">${pass ? 'Pass with money left?' : 'Lock in with things left over?'}</h3>
    <ul>${r.items.map(t => `<li>${t}</li>`).join('')}</ul>
    <label class="row note"><input type="checkbox" id="remind-off"> Don't remind me again this game</label>
    <div class="row"><button type="button" data-act="remind-back">${pass ? 'Keep shopping' : 'Go back'}</button><span class="grow"></span><button type="button" class="primary" data-act="remind-go">${pass ? 'Pass anyway' : 'Lock in anyway'}</button></div>
  </div></div>`;
}

/* Turn reminders: whenever the shop turn changes hands, a banner sweeps across the screen ("Your turn" in your
   color, "Opponent's turn" in theirs) with a chime, and the tab title says so too. The deck buttons on the scoreboard
   carry a standing "Your turn" / "Their turn" / "Passed" chip and the active player's button glows. */
let turnKey = null, turnBase = null, turnMarks = [null, null];
function turnNewsCard(ev, side){
  const d = ev.k === 'u' ? DEFS[ev.n] : BDEFS[ev.n]; if (!d) return '';
  const what = ev.a === 'buy' ? `Bought · $${ev.price}` : 'Sold · +$1';
  // the same card as in the shop (cardFace), with a stamp for what happened to it
  let face = ''; try{ face = cardFace(ev.n, ev.k, 0, true); }catch(e){}
  if (face) return `<div class="tfwrap"><div class="mcard ${ev.k} tfm ${ev.a}">${face}</div><span class="tftag ${ev.a} s${VS(side)}">${what}${ev.on ? ` · ${esc(ev.on)}` : ''}</span></div>`;
  return `<div class="tfcard ${ev.k} ${ev.a} s${VS(side)}"><span class="tfn">${esc(ev.n)}</span><span class="tfa">${what}${ev.on ? ` · leveled ${esc(ev.on)}` : ''}</span><span class="tft">${kwText(d.t.replace(/\{[^}]*\}/g, '…'))}</span></div>`;
}
function turnWatch(){
  if (turnBase === null) turnBase = document.title.replace(/^● [^·]+· /, '');
  const shop = G && !ui.start && !ui.roll && !ui.battle && !G.over && G.phase === 'shop';
  const S = shop ? seat() : 0, who = shop ? cur(G) : -1;
  const mine = shop && who === S && !G.passed[S];
  document.title = shop ? `● ${mine ? 'Your turn' : PP() && !G.net ? `${nm(who)}’s turn` : 'Opponent’s turn'} · ${turnBase}` : turnBase;
  const key = shop ? `${G.round}|${who}` : null;
  const first = turnKey === null; if (first) turnKey = '';
  if (!shop) dismissTurnFlash();   // the shop is over (Mobilize, battle, game over): a leftover turn banner goes away
  if (!shop || key === turnKey) return;
  turnKey = key;
  if (first){ turnMarks = [G.log.length, G.log.length]; return; }   // a reload or a resumed game: no announcement
  const otherPassed = G.passed[1 - who];
  // a player who ran out of buys was passed automatically: say so instead of the usual line
  const ap = ui.autoPass && ui.autoPass.round === G.round && !ui.autoPass.shown ? ui.autoPass : null;
  const oppOut = otherPassed && noBuysLeft(G, 1 - who, true);
  let big, small = '', side = who, sticky = false;
  if (PP() && !G.net){ big = `${nm(who)}’s turn`; small = ap && ap.who === 1 - who ? `${nm(1 - who)} has no buys left this round and passes. Pass the device.` : otherPassed ? `${nm(1 - who)} has passed` : 'Pass the device'; if (ap) ap.shown = true; }
  else if (who === S){ big = 'Your turn'; small = otherPassed ? `${PP() || G.net ? nm(1 - S) : 'Opponent'} ${oppOut ? 'is out of buys and passed' : 'passed'}. Keep shopping or pass.` : 'Buy a card or pass'; }
  else if (ap && ap.who === S){ ap.shown = true; big = 'Out of buys'; small = 'You have no buys left this round and pass your turn.'; side = S; sticky = true; }
  else { big = G.net ? `${nm(who)}’s turn` : 'Opponent’s turn'; small = G.passed[S] ? 'You passed. They’re finishing up.' : 'Wait for them to buy or pass'; }
  // what the other player bought and sold since this player last had the turn
  let news = '';
  if (who === S || (PP() && !G.net)){
    const from = turnMarks[who] == null ? G.log.length : turnMarks[who];
    const evs = G.log.slice(from).filter(l => l.ev && l.side === 1 - who);
    turnMarks[who] = G.log.length;
    if (evs.length) news = `<div class="tfnews"><span class="eyebrow">Since ${who === S && !(PP() && !G.net) ? 'your' : 'their'} last turn, ${esc(PP() || G.net ? nm(1 - who) : 'Opponent')}:</span><div class="tfcards mktp">${evs.map(l => turnNewsCard(l.ev, 1 - who)).join('')}</div></div>`;
  }
  if (who === S && noBuysLeft(G, S)){ autoNews = news; return; }   // out of buys: the auto-pass banner says so, with this news
  if (sticky && !news){ news = autoNews; autoNews = ''; }   // the opponent's buys from just before, shown with the auto-pass
  const show = () => {
    turnFlash(big, small, side === S || (PP() && !G.net) ? 'mine' : 'theirs', side, news, sticky);
    flashedNow = true;
    if (who === S || (PP() && !G.net)){ sfx.turnMine(); if (navigator.vibrate) try{ navigator.vibrate([18, 60, 18]); }catch(e){} }
    else sfx.turnTheirs();
  };
  // the opponent's cards are still playing out: the banner comes once they've all landed (if it's still this turn)
  if (oppBusy()){
    pendingFlash = show;
    oppOnIdle(() => { if (pendingFlash !== show) return; pendingFlash = null; if (turnKey !== key || !G || G.phase !== 'shop' || ui.battle) return; show(); shopNotes(); flashedNow = false; });
  } else { pendingFlash = null; show(); }
}
var pendingFlash = null;

