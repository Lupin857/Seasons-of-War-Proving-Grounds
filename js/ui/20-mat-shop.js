/* ===================== THE SHOP ON THE MAT (one-screen dev, phones) =====================
   With the rug world on (js/rug.js), the phone shop is one screen with no scrolling, laid out like the real table:
   the rival's bar under the top bar, the market on the mat in the middle, your bar above the bottom bar. The mat tips
   back with the rug camera's tilt (--ostilt), so the far side reads further away.
   - Middle: two cloth trays, Units and Support & gear (Brian, Nov 24: "Oasis fixed Caravan bar mock-up"), each with its
     shop deck (in the Oasis card back) tucked at its top left corner like a dealer's shoe, and the face-up discard pile
     between them. Each market is a 3-wide grid: the always-for-sale pile (Drifter, Moisture Harvester) first (top left),
     then its 5 display cards. The rows are the market's own (marketRow, marketCard), so deals, buys and the card sheet
     work as before.
   - Each player's bar (matSeatHTML): flat, fixed, the same in the shop, Mobilize and the battle, so the Caravan never
     moves between phases: the Caravan (supports, one card each; every Moisture Harvester copy takes its own spot) with
     empty spots up to the limit; in the shop and Mobilize also the hand spot (gear waiting for Mobilize) and the deck
     pile (units: the top card face up, the copies as edges under it; tap: the deck view); the rival's bar also holds
     their water as medallion coins with a count pill. Whoever's turn it is, their bar glows (no turn chip).
   - Your purse, buys left, Miracles and Pass sit in the bottom bar (matDockHTML).
   Off: the rug's switch (localStorage.oasisRug = '0') brings back the scrolling phone shop. Desktop never uses this. */
function matShopOn(){
  return !!G && G.phase === 'shop' && !ui.battle && !G.over && compact() && typeof rugWanted === 'function' && rugWanted();
}
// the coins and the count pill: up to 6 medallions in a little heap, then the exact count and next shop's income
function matPurseHTML(i){
  const B = boardSnap(), n = Math.max(0, MATOPP.shown[i] ?? B.money[i]), inc = Math.max(0, B.inc[i]);
  const heap = [[0,0],[10,-5],[19,2],[5,8],[15,10],[24,-6]].slice(0, Math.min(6, n))
    .map(([x, y], k) => `<img class="osmed" src="art/medallion.png" alt="" style="--x:${x};--y:${y};--r:${(k * 53) % 40 - 20}deg">`).join('');
  const who = PP() || G.net ? nm(i) : i === seat() ? 'You' : 'AI';
  return `<span class="ospurse s${VS(i)}"><span class="osheap" aria-hidden="true">${heap}</span><span class="ospill" aria-label="${esc(who)}: ${n} water, +${inc} next shop"><img src="art/medallion.png" alt=""><b>${n}</b><i>+${inc}</i></span></span>`;
}
// the unit on top of a deck pile: the one bought most recently
function matPileTop(p, hand){
  const order = p.bought || [];
  return Object.keys(hand).filter(n => hand[n] > 0).sort((a, b) => order.lastIndexOf(a) - order.lastIndexOf(b)).pop() || null;
}
// mode: 'shop', 'mob' (Mobilize: the deck pile shows only while it lifts) or 'battle' (the Caravan alone)
function matSeatHTML(i, mode = 'shop'){
  const S = seat(), mine = i === S, p = G.players[i], hand = mine ? p.hand : pubHand(p), deckOn = mode !== 'battle';
  // your Caravan and hand cards carry their Sell button (hidden in the bar; it shows when the card is lifted to read)
  const canSell = mine && mode === 'shop' && G.phase === 'shop' && !ui.battle && cur(G) === S && !G.passed[S], sell = (n, k) => canSell ? shopSellBtnHTML(n, k) : '';
  const who = PP() || G.net ? esc(nm(i)) : mine ? 'Your' : 'Enemy';
  // the Caravan: one card per support; each Moisture Harvester copy fills a spot of its own (as the limit counts them)
  const car = [];
  for (const n in p.city){ const c = p.city[n]; if (!(c > 0) || !BDEFS[n]) continue; if (n === 'Field') for (let k = 0; k < c; k++) car.push(['Field', 1]); else car.push([n, c]); }
  car.sort((a, b) => (a[0] === 'Field') - (b[0] === 'Field'));
  const cap = citySlots(p), spots = Math.max(cap, car.length);
  const fw = matWaitN(i, 'Field'), fields = car.filter(c => c[0] === 'Field').length;
  const hid = (n, k) => (n === 'Field' ? k >= car.length - fw && k >= car.length - fields : matWaitN(i, n) > 0) ? ' style="visibility:hidden"' : '';
  const carHTML = Array.from({length:spots}, (_, k) => car[k]
    ? `<div class="mcard b oscar" data-b="${esc(car[k][0])}"${hid(car[k][0], k)}>${cardFace(car[k][0], 'b', car[k][1], true)}${sell(car[k][0], 'b')}</div>`
    : `<span class="osslot" aria-hidden="true"></span>`).join('');
  let rest = '';
  if (deckOn){
    const copies = Object.values(hand).reduce((t, c) => t + Math.max(0, c), 0), top = matPileTop(p, hand);
    const uc = deckCap(p), uu = uniqueUnits(hand === p.hand ? p : {...p, hand});
    const edges = Array.from({length:Math.min(3, Math.max(0, copies - 1))}, (_, k) => `<i class="osedge" style="--k:${k + 1}"></i>`).join('');
    const pile = `<button type="button" class="ospile deckbtn s${VS(i)}${ui.deckView === i ? ' on' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(deckName(i))}: ${copies} unit card${copies === 1 ? '' : 's'}, units ${uu} of ${uc}, tap to view">
      ${edges}${top ? `<span class="mcard u ostop"${matWaitN(i, 'pile') ? ' style="visibility:hidden"' : ''}>${cardFace(top, 'u', hand[top], true)}</span>` : '<span class="osslot">Deck</span>'}
      ${G.phase === 'mobilize' && !mine ? '<span class="oback osbackcover" aria-hidden="true"></span>' : ''}<span class="oscount" aria-hidden="true">${uu}/${uc}</span></button>`;
    // the hand spot: gear bought this shop waits here face up for Mobilize (your empty spot shows as an outline)
    const gear = Object.keys(p.gear || {}).filter(n => p.gear[n] > 0);
    const handHTML = gear.map(n => `<div class="mcard b oshand"${matWaitN(i, n) ? ' style="visibility:hidden"' : ''}>${cardFace(n, 'b', p.gear[n], true)}${sell(n, 'b')}</div>`).join('');
    const handRow = gear.length || mine ? `<div class="fcards oshandrow" aria-label="${who} hand">${handHTML || '<span class="osslot oshandslot" aria-hidden="true">Hand</span>'}</div>` : '';
    rest = `<i class="osbardiv" aria-hidden="true"></i>${handRow}${pile}${mine ? '' : matPurseHTML(i)}`;
  }
  const act = mode === 'shop' && G.phase === 'shop' && !G.passed[i] && cur(G) === i;   // whose turn it is: their bar glows
  return `<section class="osseat osbar ${mine ? 'me' : 'opp'} s${VS(i)} osbar-${mode}${act ? ' osact' : ''}${mode === 'mob' && MATMOB.lift ? ' oslifting' : ''}" aria-label="${who} side${act ? ', shopping now' : ''}">
    <div class="fcards oscarrow" style="--n:${spots}" aria-label="${who} Caravan, ${slotsUsed(p)} of ${cap}">${carHTML}</div>${rest}
  </section>`;
}
// renderPlay's step: the bars (and the mat between them) start right where the top bar ends on screen (--gtb), so the
// rival's bar is at the same place in every phase whatever the page's scroll (the battle can scroll a little)
function matBarsAfterDraw(){
  if (!document.querySelector('#view-play .osbar')) return;
  if (window.scrollY && !matBarsAfterDraw.busy){ matBarsAfterDraw.busy = true; window.scrollTo(0, 0); matBarsAfterDraw.busy = false; }   // the page sits at its top in every phase on the mat, so nothing shifts between them
  const g = $('gtop'), b = g && g.offsetHeight ? Math.round(g.getBoundingClientRect().bottom) : null;
  if (b != null && document.documentElement.style.getPropertyValue('--gtb') !== b + 'px') document.documentElement.style.setProperty('--gtb', b + 'px');
}
window.addEventListener('scroll', () => { if (document.querySelector('#view-play .osbar')) matBarsAfterDraw(); }, {passive:true});
// the two trays and the discard pile between them (deck: the tray's shop deck, row: its market row)
function matTraysHTML(deck, row, extra){
  return `<div class="osmid"><div class="mktp osmkt">${extra[0] || ''}
      <div class="ostray" data-k="u">${deck('u')}<div class="msec" data-k="u"><span class="oslbl">Units</span><div class="market">${row('u', 'du')}</div></div></div>
      <div class="osdisc">${musterPileHTML()}</div>
      <div class="ostray" data-k="b">${deck('b')}<div class="msec" data-k="b"><span class="oslbl">Support &amp; gear</span><div class="market">${row('b', 'db')}</div></div></div>
      ${extra[1] || ''}
    </div></div>`;
}
function matShopHTML(){
  const S = seat();
  return `${matSeatHTML(1 - S)}${matSeatHTML(S)}<div class="osshop"><div class="osplane"><div class="osinner">
    ${matTraysHTML(k => deckPileHTML(k, false, true), marketRow, [writBarHTML(), frozenHTML(S)])}
  </div></div></div>
  ${mirTrayHTML()}${mirModalHTML()}`;
}
// the bottom bar on the mat: your purse, buys left, then Miracles and Pass (the same buttons the phone shop bar uses)
function matDockHTML(mine, mirBtn, acts){
  const S = seat();
  return `<div class="dock osdock${mine ? ' mine' : ''} ph-shop" id="dock">${matPurseHTML(S)}${tileSlotsHTML(S)}<span class="grow"></span><div class="dbtns dact">${ui.visArm ? '' : mirBtn}${acts}</div></div><div class="dockspace" aria-hidden="true"></div>`;
}

/* ---------- tap to read: a card lifts off the mat ----------
   Tap any card on the mat and it lifts out of the tilt in an arc, its crop opening to the full card, flat in the
   middle with the mat dimmed (the shop model's lift: 650 ms out, 520 ms back). It is the one large card (cardPop) with
   its own button under it: Buy (greyed with the reason when it can't be bought) on shop cards, Sell on your Caravan and
   hand cards, none on the rival's; then the keywords it prints, and any miracles behind it above. Tap anywhere to put
   it back. Pressing Buy or Sell keeps it up (MATLIFT.held): the move's flight takes it from there (matBuyFlight,
   matSellFlight) and lands it in the tilt where it goes (matLand). openPeek and closePeek hand mat cards to
   matLiftOpen / matLiftClose; the bottom sheet stays for everything else. */
const MATLIFT = {src:null, ck:null, held:null};
const MAT_EASE = 'cubic-bezier(.45,.05,.25,1)';
function matLiftWanted(card){ return (matShopOn() && !!card.closest('#view-play .osshop')) || (matMobOn() && !!card.closest('#view-play .osmob')) || (compact() && !!card.closest('#view-play .osbar')); }
// where a lifted card starts and ends: a mat card in the tilt (its flat rect), a Mobilize card flat where it lies;
// crop: it sits cropped there (mat cards, the bench), so the crop opens as it lifts
function matLiftFrom(el){
  if (!el || !el.isConnected) return null;
  if (el.closest('.osplane')){ const r = matFlatRect(el); return r && {r, tilt:1, crop:true}; }
  return {r:el.getBoundingClientRect(), tilt:0, crop:!el.closest('#mz-deck')};
}
// the card that was lifted, as it is on the page now (a redraw may have replaced its element)
function matLiftSrc(){
  const c = MATLIFT.src;
  if (c && c.isConnected) return c;
  return MATLIFT.ck ? ckEl(MATLIFT.ck) : null;
}
function matLiftShow(){ document.querySelectorAll('.oslifted').forEach(e => e.classList.remove('oslifted')); MATLIFT.src = null; MATLIFT.ck = null; }
// The mat's projection in screen coordinates: .osshop's perspective and .osplane's tilt both pivot on the shop's
// bottom middle, so one matrix takes a point on the flat mat to where it shows.
// a: how much of the tilt (1 = the mat's own; less = part way out of it, as a card lifts off). q: matTiltOf() taken once.
function matTiltOf(){
  const shop = document.querySelector('#view-play .osshop'); if (!shop) return null;
  const r = shop.getBoundingClientRect(), cs = getComputedStyle(shop);
  return {d:parseFloat(cs.perspective) || 1000, t:parseFloat(cs.getPropertyValue('--ostilt')) || 0, ox:r.left + r.width / 2, oy:r.bottom};
}
function matTiltMatrix(a = 1, q = matTiltOf()){
  if (!q) return null;
  const P = new DOMMatrix(); P.m34 = -a / q.d;
  return new DOMMatrix().translate(q.ox, q.oy).multiply(P).rotate(q.t * a, 0, 0).translate(-q.ox, -q.oy);
}
/* One flight as keyframes, for an element with layout box b (origin top left): from end A to end B along one smooth
   arc (a curve bowed up by o.arc px, so the card never changes speed or direction with a jerk). An end is {r, tilt}: r is
   the rect the box sits on (left, top, width), tilt 1 means r is a flat mat spot and the box lies in the mat's tilt
   there (matPose), 0 flat on the screen. The tilt comes off (or on) over the half of the flight nearest the mat.
   o.bump: the card grows by that much of its size at the top of the arc. The last step is exactly the end.
   Both ends on the mat (tilt 1 and 1): the card slides across the mat in its tilt all the way (the sweep, a card dealt back). */
const MAT_STEPS = 24;
function matArc(b, A, B, o = {}){
  const q = matTiltOf(); if (!q) return null;
  const ax = A.r.left, ay = A.r.top, bx = B.r.left, by = B.r.top, aw = A.r.width, bw = B.r.width;
  const cx = (ax + bx) / 2, cy = (ay + by) / 2 - 2 * (o.arc ?? 50);
  const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const out = [];
  for (let k = 0; k <= MAT_STEPS; k++){
    const u = k / MAT_STEPS, v = 1 - u;
    const x = v * v * ax + 2 * v * u * cx + u * u * bx, y = v * v * ay + 2 * v * u * cy + u * u * by;
    const w = aw + (bw - aw) * u + (o.bump || 0) * Math.sin(Math.PI * u) * Math.max(aw, bw);
    const a = A.tilt && B.tilt ? 1 : A.tilt ? 1 - sm(u / .5) : B.tilt ? sm((u - .5) / .5) : 0;   // both on the mat: the whole flight stays in the tilt
    out.push({transform:new DOMMatrix().translate(-b.left, -b.top).multiply(matTiltMatrix(a, q)).translate(x, y).scale(w / b.width).toString()});
  }
  return out;
}
// where an element on the mat would sit if the mat lay flat (the plane keeps its shrink back from --osres)
function matFlatRect(el){
  const plane = el && el.closest('.osplane'); if (!plane) return null;
  const t = plane.style.transform; plane.style.transform = 'scale(calc(1 / var(--osres)))';
  const r = el.getBoundingClientRect();
  plane.style.transform = t;
  return r;
}
// where an element sits for a flight: on the mat, its flat rect in the tilt (tilt 1); in a bar, its rect on the screen (tilt 0)
function matSpotRect(el){
  if (!el || !el.isConnected) return null;
  if (el.closest('.osplane')){ const r = matFlatRect(el); return r && r.width ? {r, tilt:1} : null; }
  const r = el.getBoundingClientRect(); return r.width ? {r, tilt:0} : null;
}
// the transform (origin top left) that puts a flat element with box b exactly over mat spot r (a flat rect), in the tilt
function matPose(b, r){
  const M = matTiltMatrix(); if (!M || !r) return null;
  return new DOMMatrix().translate(-b.left, -b.top).multiply(M).translate(r.left, r.top).scale(r.width / b.width).toString();
}
const MAT_CROP = 728 / 750;   // the crop's height for its width (the phone card boxes' ratio)
/* The crop opening or closing without repainting the card on every frame (a changing clip-path is redrawn each frame
   by the page itself, and falls behind the move when the phone is busy). The card pk is the window: its clip is one
   fixed shape, the crop's bottom (tab and all) with the top running far up, and pk slides down by t while each of its
   children slides back up by t (the translate property, which the graphics chip moves on its own), so the cards
   stay put and only the window's bottom edge moves: t = 0 is the crop, t = open shows the whole card and what is under
   it. The card's own rounded top corners match the crop's. pk must sit inside the box that carries the move (.osfly).
   keys: [[offset, 'crop' | 'open'], ...]. Returns {anims, done}: done() drops the clip (call it as the move ends). */
const MAT_TABTOP = .89354;   // where the crop's bottom corners start, of its height (from the #tabclip path)
function matCrop(pk, keys, opt){
  const face = pk.querySelector(':scope > .cface'), d = (document.querySelector('#tabclip path') || {getAttribute:() => null}).getAttribute('d');
  if (!face || !d) return {anims:[], done:() => {}};
  const w = face.offsetWidth, cH = w * MAT_CROP, y0 = face.offsetTop, H = pk.offsetHeight, open = H - y0 - MAT_TABTOP * cH + 2, top = -(H + open + 40);
  const X = x => (x * w).toFixed(2), Y = y => (y > .06 ? y0 + y * cH : top).toFixed(2);
  pk.style.clipPath = 'path("' + d.replace(/([MQLHV])([^MQLHVZ]*)/g, (m, c, a) => {
    const n = a.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === 'H') return `H ${X(n[0])} `;
    if (c === 'V') return `V ${Y(n[0])} `;
    const pts = []; for (let i = 0; i + 1 < n.length; i += 2) pts.push(`${X(n[i])},${Y(n[i + 1])}`);
    return `${c} ${pts.join(' ')} `;
  }).trim() + '")';
  const T = (s, sg) => `0 ${s === 'open' ? sg * open : 0}px`;
  const anims = [pk.animate(keys.map(([o, s]) => ({offset:o, translate:T(s, 1)})), opt),
    ...[...pk.children].map(c => c.animate(keys.map(([o, s]) => ({offset:o, translate:T(s, -1)})), opt))];
  return {anims, done:() => { anims.forEach(a => a.cancel()); pk.style.clipPath = ''; }};
}
// the box that carries a flying card's move (.osfly), made around pk where pk is now
function matFlyBox(pk){
  if (pk.parentElement && pk.parentElement.classList.contains('osfly')) return pk.parentElement;
  const f = document.createElement('div'); f.className = 'osfly';
  if (pk.parentNode) pk.parentNode.insertBefore(f, pk);
  f.appendChild(pk);
  return f;
}
function matLiftOpen(card, pk, wrap){
  wrap.classList.add('osliftwrap');
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
  const col = document.createElement('div'); col.className = 'oslift';
  const mw = card.parentElement && card.parentElement.classList.contains('mirwrap') ? card.parentElement.querySelector('.mirhover') : null;
  if (mw){ const m = mw.cloneNode(true); try{ kwDecorate(m); }catch(e){} m.className = 'sheetmir osliftmir'; m.removeAttribute('aria-hidden'); col.appendChild(m); }
  pk.removeAttribute('aria-hidden');
  pk.querySelectorAll('button[aria-label]').forEach(b => { if (b.textContent.trim().length <= 2) b.textContent = b.getAttribute('aria-label'); });
  col.appendChild(pk); const F = matFlyBox(pk); wrap.appendChild(col); document.body.appendChild(wrap);
  document.documentElement.classList.add('sheet-open');
  MATLIFT.src = card; MATLIFT.ck = card.dataset.ck || null; MATLIFT.held = null;
  const fr = matLiftFrom(card), r = fr && fr.r;
  card.classList.add('peeked', 'oslifted');
  peekEl = wrap; peekReady = false;
  setTimeout(() => { if (peekEl === wrap) peekReady = true; }, 0);
  wirePeek(card, wrap);
  wrap.addEventListener('click', e => { if (peekReady && peekEl === wrap && !e.target.closest('button')) closePeek(); });   // tap anywhere, the card too
  sfx.pick(); if (navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
  if (reduceMotion() || !r || !r.width) return;
  const b = F.getBoundingClientRect(), kf = matArc(b, {r, tilt:fr.tilt}, {r:b, tilt:0}, {arc:50, bump:.06});
  if (!kf) return;
  F.animate(kf, {duration:650, easing:MAT_EASE, fill:'both'});
  if (fr.crop){ const cr = matCrop(pk, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration:650, easing:'ease-in-out', fill:'forwards'});   // then no clip: the card's own corners
    if (cr.anims[0]) cr.anims[0].onfinish = cr.done; }
  wrap.animate([{backgroundColor:'rgba(12,8,5,0)'}, {backgroundColor:getComputedStyle(wrap).backgroundColor}], {duration:450, easing:'ease-out'});
  const extra = [...pk.querySelectorAll(':scope > button, :scope > .kwgloss, :scope > .stamps'), ...col.querySelectorAll('.osliftmir')];
  extra.forEach(e => e.animate([{opacity:0, transform:'translateY(8px)'}, {opacity:1, transform:'none'}], {duration:260, delay:450, easing:'ease-out', fill:'backwards'}));
}
// closePeek's step for a lifted mat card. after: a button was pressed, so the card stays up for the move's flight.
function matLiftClose(w, now, after){
  const pk = w.querySelector('.mcard.peek');
  if (after && !now && pk){ matLiftHold(w, pk); after(); matLiftUnheld(); return; }
  const done = () => { w.remove(); matLiftShow(); if (after) after(); };
  const src = matLiftSrc(), fr = matLiftFrom(src), r = fr && fr.r;
  if (now || reduceMotion() || !pk || !r || !r.width){ done(); return; }
  w.style.pointerEvents = 'none';
  const F = matFlyBox(pk);
  F.getAnimations().forEach(a => a.cancel()); pk.getAnimations({subtree:true}).forEach(a => a.cancel()); pk.style.clipPath = '';
  const b = F.getBoundingClientRect(), kf = matArc(b, {r:b, tilt:0}, {r, tilt:fr.tilt}, {arc:50, bump:.06});
  if (!kf){ done(); return; }
  const a = F.animate(kf, {duration:520, easing:MAT_EASE, fill:'forwards'});
  if (fr.crop) matCrop(pk, [[0, 'open'], [.7, 'crop'], [1, 'crop']], {duration:520, easing:'ease-in-out', fill:'forwards'});
  w.animate([{backgroundColor:getComputedStyle(w).backgroundColor}, {backgroundColor:'rgba(12,8,5,0)'}], {duration:520, fill:'forwards'});
  [...pk.querySelectorAll(':scope > button, :scope > .kwgloss, :scope > .stamps'), ...w.querySelectorAll('.osliftmir')]
    .forEach(e => e.animate([{opacity:1}, {opacity:0}], {duration:160, fill:'forwards'}));
  a.onfinish = done;
}
// Buy or Sell was pressed: the card (face only) stays where it is, above the page, and the pop-up fades from under it
function matLiftHold(w, pk){
  const F = matFlyBox(pk);
  F.getAnimations().forEach(a => a.cancel()); pk.getAnimations({subtree:true}).forEach(a => a.cancel()); pk.style.clipPath = '';
  pk.querySelectorAll('button, .kwgloss, .stamps, .pkdrag').forEach(x => x.remove());
  const b = pk.getBoundingClientRect();
  pk.classList.add('osheld'); pk.setAttribute('aria-hidden', 'true');
  F.style.cssText = `position:fixed;left:${b.left}px;top:${b.top}px;width:${b.width}px;margin:0;z-index:${LAYER.cardPop + 1};pointer-events:none`;   // above the fading pop-up
  document.body.appendChild(F);
  MATLIFT.held = {g:F};
  w.style.pointerEvents = 'none';
  if (reduceMotion()){ w.remove(); return; }
  w.animate([{opacity:1}, {opacity:0}], {duration:300, fill:'forwards'}).onfinish = () => w.remove();
}
// nothing took the held card (a move that waits for a pick, a refused move, an online move still on its way): back it goes
function matLiftUnheld(){
  const h = MATLIFT.held; if (!h) { matLiftShow(); return; }
  MATLIFT.held = null;
  matLand(h.g, matLiftSrc(), {dur:520, arc:50, done:matLiftShow});
}
// A flat card above the page (g: fixed, transform origin top left) flies in an arc and settles onto `to` on the mat,
// in the tilt and cropped like it, then `to` shows and g goes.
// o.s: g is held scaled by s (transform scale(s), origin top left), as a rival's bought card is
// o.find: finds the spot again (a redraw during the flight replaces it: the new one stays hidden until the card lands)
const MATLANDS = new Set();
function matLand(g, to, o = {}){
  const L = {find:o.find || null, to};
  const spot = () => { const t = L.find ? L.find() : null; return t && t.isConnected ? t : L.to; };
  const fin = () => { MATLANDS.delete(L); g.remove(); const t = spot(); if (t) t.style.visibility = ''; if (L.to && L.to !== t) L.to.style.visibility = ''; if (o.done) o.done(); return t; };
  const sp = matSpotRect(to), r = sp && sp.r;
  if (!r || !r.width || reduceMotion()){ fin(); return; }
  to.style.visibility = 'hidden';
  g.getAnimations({subtree:true}).forEach(a => a.cancel());
  const s = o.s || 1, bb = g.getBoundingClientRect(), b = {left:bb.left, top:bb.top, width:bb.width / s, height:bb.height / s};
  const kf = matArc(b, {r:{left:b.left, top:b.top, width:b.width * s}, tilt:0}, {r, tilt:sp.tilt}, {arc:o.arc ?? 60});
  if (!kf){ fin(); return; }
  MATLANDS.add(L);
  const dur = o.dur || 850;
  g.animate(kf, {duration:dur, easing:MAT_EASE, fill:'forwards'}).onfinish = () => { const t = fin(); if (t) bumpEl(t); };
  const pk = g.classList.contains('osfly') && g.firstElementChild;   // a market card copy is already cut to the crop
  if (pk) matCrop(pk, [[0, 'open'], [.7, 'crop'], [1, 'crop']], {duration:dur, easing:'ease-in-out', fill:'forwards'});
}
// renderPlay step: spots that cards in flight are landing on stay hidden in the redrawn mat
function matLandAfterDraw(){
  for (const L of MATLANDS){ const t = L.find && L.find(); if (t && t.isConnected){ t.style.visibility = 'hidden'; L.to = t; } }
}
// For flights that stay on the mat (a card dealt out of a shop deck, an unbought card going to the discard pile): the
// flat rects of the card (r) and of where it goes (d), and pre(g): the tilt as a transform to put in front of the flight's
// own, for the flying copy g pinned at r (by its own transform origin), so the whole flight happens in the mat's tilt and
// starts and ends exactly on the tilted spots. null off the mat, or when either end isn't on it.
function matFlightFrame(el, dest){
  if (!matShopOn() || !el || !el.closest || !el.closest('#view-play .osplane') || !dest || !dest.closest || !dest.closest('#view-play .osplane')) return null;
  const r = matFlatRect(el), d = matFlatRect(dest), M = matTiltMatrix();
  if (!r || !r.width || !d || !d.width || !M) return null;
  return {r, d, pre:g => {
    const o = getComputedStyle(g).transformOrigin.split(' ').map(parseFloat), x = r.left + (o[0] || 0), y = r.top + (o[1] || 0);
    return new DOMMatrix().translate(-x, -y).multiply(M).translate(x, y).toString();
  }};
}
// where a card just bought sits on side i's part of the mat (yours by default): units on the deck pile's top card,
// gear in the hand spot, supports in the Caravan (the card it levels, or its new spot)
function matSpotOf(n, k, i = seat()){
  const me = document.querySelector(`#view-play .osseat.${i === seat() ? 'me' : 'opp'}`); if (!me) return null;
  if (k === 'u') return me.querySelector('.ospile .ostop');
  const named = sel => [...me.querySelectorAll(sel)].filter(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === n; }).pop();
  return named('.oshand') || named('.oscar') || null;
}
// buyFlight's step for your buys on the mat: the card flies from where you lifted it (else from its market spot) and
// lands on your side; Covenant cards come along from the market spot. Returns true when it handled the flight.
function matBuyFlight(i, ev, src, j){
  if (i !== seat() || !document.querySelector('#view-play .osshop')) return false;
  const list = [{n:ev.on || ev.n, look:ev.n, el:src && src.el}, ...(ev.pair || []).map(n => ({n, look:n, el:null}))];
  list.forEach((x, m) => {
    const to = matSpotOf(x.n, ev.k);
    let g = null;
    if (m === 0 && MATLIFT.held){ g = MATLIFT.held.g; MATLIFT.held = null; }
    else if (src && src.r && src.r.width){ const f = flyer(x.el || x.look, ev.k); g = f.g; flyEl(g, src.r, src.r.width, src.r.height, LAYER.flight, f.ctx); g.style.overflow = ''; }
    if (!g) return;
    const go = () => matLand(g, to, {done:m === 0 ? matLiftShow : null, find:() => matSpotOf(x.n, ev.k, i)});
    if (m === 0 && !j) go(); else { g.style.opacity = '0'; setTimeout(() => { g.style.opacity = ''; go(); }, (j + m) * 220); }
  });
  return true;
}
// where a sold card goes: the discard pile (a Moisture Harvester back to its shop pile)
function matDiscardSpot(name){
  const pile = name === 'Field' ? fieldCardEl() : $('muster-pile');
  return pile && pile.id === 'muster-pile' ? (pile.querySelector('.mpcards') || pile) : pile;
}
// flySell's step: a card you sold from the lift flies on into the discard pile (a Moisture Harvester back to its shop pile)
function matSellFlight(i, name){
  const h = MATLIFT.held; if (!h || i !== seat()) return false;
  MATLIFT.held = null;
  matLand(h.g, matDiscardSpot(name), {done:matLiftShow, find:() => matDiscardSpot(name)});
  return true;
}

/* ---------- the rival's buys and sells on the mat ----------
   oppBuyStep / oppSellStep hand their card to matOppBuy / matOppSell (the opponent queue, OPQ, still plays one move
   at a time and holds the turn banner). A bought card lifts off its market spot (from its pose in the tilt, matPose),
   its crop opening to the full card, and holds flat in the middle of the mat at 1.5x a market card for MAT_OPP_HOLD
   with the queue's tag under it (oppHold: a tap ends it early); the coins it cost leave their purse as it rises.
   Then it lands on their side in the tilt (matLand): units on the deck pile's top card, supports in the Caravan,
   gear in the hand spot. A sale lifts off their side the same way and lands on the discard pile (a Moisture
   Harvester on its shop pile), and its coin drops into their purse. While their moves wait in the queue, their purse
   shows the count from before them (MATOPP.shown) and the spots their buys will take stay hidden (MATOPP.wait). */
const MATOPP = {shown:[null, null], wait:new Map(), idle:false, money:null};
const MAT_OPP_HOLD = 900, MAT_OPP_RISE = 520;
const matWaitN = (i, n) => MATOPP.wait.get(i + ':' + n) || 0;
function matWaitAdd(i, n, d){ const k = i + ':' + n, v = (MATOPP.wait.get(k) || 0) + d; if (v > 0) MATOPP.wait.set(k, v); else MATOPP.wait.delete(k); }
// snapNow's step: flat rects of the mat's cards (one layout with the tilt off), keyed like SPOTS, plus each seat's
// cards ('os:<side>:<name>', 'os:<side>:pile'), and the purses as they were
function matSnapFlat(m){
  const shop = matShopOn() && document.querySelector('#view-play .osshop'), plane = shop && shop.querySelector('.osplane');
  if (!plane) return;
  MATOPP.money = G.players.map(p => p.money);
  const t = plane.style.transform; plane.style.transform = 'scale(calc(1 / var(--osres)))';
  for (const [ck, s] of m) if (s.el && plane.contains(s.el)) s.fr = s.el.getBoundingClientRect();
  plane.style.transform = t;
  // the bars are flat on the screen (flat:true: a flight from there starts out of the tilt)
  const S = seat();
  for (const st of document.querySelectorAll('#view-play .osbar')){
    const i = st.classList.contains('me') ? S : 1 - S;
    for (const el of st.querySelectorAll('.oscar, .oshand')){ const f = el.querySelector('.cfm'); if (f && f.dataset.n) m.set(`os:${i}:${f.dataset.n}`, {el:null, r:null, fr:el.getBoundingClientRect(), n:f.dataset.n, flat:true}); }
    const top = st.querySelector('.ospile .ostop') || st.querySelector('.ospile');
    if (top) m.set(`os:${i}:pile`, {el:null, r:null, fr:top.getBoundingClientRect(), flat:true});
  }
}
// motionFrom's step when the rival's moves go on the queue: their purse keeps showing what they had, and the new
// spots their buys take stay hidden until each card lands
function matOppQueued(i, evs){
  if (!matShopOn() || !document.querySelector('#view-play .osshop')) return;
  if (MATOPP.shown[i] == null && MATOPP.money) MATOPP.shown[i] = MATOPP.money[i];
  for (const ev of evs){ if (ev.a === 'buy'){ const w = matOppWaitKey(i, ev); if (w) matWaitAdd(i, w, 1); ev._matWait = w; ev._matStand = matOppStand(ev); } }
  if (!MATOPP.idle){ MATOPP.idle = true; OPQ.idle.push(matOppIdle); }   // their steps go on the queue right after this
}
// A bought card stays in its market spot until its turn in the queue comes and it rises: the redraw right after the
// move takes it out of the market, so a copy of it (.osstand, the market card's own look) is laid over its spot in the
// tilt now and taken away the moment it lifts (matOppBuy), or when the queue is done (matOppIdle).
function matOppStand(ev){
  const s = SPOTS.get(evKey(ev));
  if (!s || !s.el || !s.el.isConnected || !s.fr || !s.fr.width) return null;
  const {g, ctx} = flyer(s.el, ev.k);
  flyEl(g, s.fr, s.fr.width, s.fr.height, LAYER.flight, ctx);
  g.style.overflow = ''; g.classList.add('osstand'); g.classList.remove('peeked', 'oslifted', 'canbuy', 'cant');
  const pose = matPose(s.fr, s.fr); if (!pose){ g.remove(); return null; }
  g.style.transform = pose;
  return g;
}
// the spot a buy will take that isn't on the mat yet: a unit changes the pile's top card; a new support or gear card
// (or any Moisture Harvester copy) adds a spot; a level-up or Mason's Guild shows on a card that is already there
function matOppWaitKey(i, ev){
  if (ev.on) return null;
  if (ev.k === 'u') return 'pile';
  return ev.n === 'Field' || !SPOTS.has(`os:${i}:${ev.n}`) ? ev.n : null;
}
// the queue has played out: the purses and spots show the game as it is
function matOppIdle(){
  MATOPP.idle = false; MATOPP.shown = [null, null]; MATOPP.wait.clear();
  document.querySelectorAll('.osstand').forEach(e => e.remove());
  const v = document.querySelector('#view-play .osshop'); if (!v) return;
  document.querySelectorAll('#view-play .osbar .mcard[style*="visibility"]').forEach(e => { if (!e.getAnimations().length) e.style.visibility = ''; });
  for (const i of [0, 1]) matPurseSet(i, 0);
}
// where the sold card sat (taken when the sale goes on the queue, as the seat is redrawn without it right after)
function matSellSrc(i, ev){
  if (!matShopOn()) return null;
  const s = SPOTS.get(ev.k === 'u' ? `os:${i}:pile` : `os:${i}:${ev.n}`);
  return s && s.fr ? {el:null, r:null, fr:s.fr, flat:!!s.flat} : null;
}
// redraw side i's purse on their seat with the shown count moved by d: coins paid rise toward `at` and fade, coins
// gained drop in from above
function matPurseSet(i, d, at){
  if (d && MATOPP.shown[i] != null) MATOPP.shown[i] += d;
  const old = document.querySelector(`#view-play .osseat.opp .ospurse.s${VS(i)}`); if (!old) return;
  const meds = [...old.querySelectorAll('.osmed')], rs = meds.map(e => e.getBoundingClientRect());
  const tmp = document.createElement('div'); tmp.innerHTML = matPurseHTML(i);
  const nu = tmp.firstElementChild; old.replaceWith(nu);
  if (!d || reduceMotion()) return;
  const pill = nu.querySelector('.ospill'); if (pill) pill.animate([{transform:'scale(1)'}, {transform:'scale(1.18)'}, {transform:'none'}], {duration:360, delay:d < 0 ? 120 : 380, easing:'ease-out'});
  const top = rs[rs.length - 1] || (pill && pill.getBoundingClientRect()); if (!top) return;
  const n = Math.min(Math.abs(d), 5);
  for (let k = 0; k < n; k++){
    const r = rs[rs.length - 1 - k] || top, c = document.createElement('img');
    c.src = 'art/medallion.png'; c.alt = ''; c.setAttribute('aria-hidden', 'true'); c.className = 'osflycoin';
    Object.assign(c.style, {left:r.left + 'px', top:r.top + 'px', width:r.width + 'px', height:r.height + 'px', zIndex:LAYER.popup});
    document.body.appendChild(c);
    const dx = at ? at.left + at.width / 2 - (r.left + r.width / 2) : 0, dy = at ? at.top + at.height / 2 - (r.top + r.height / 2) : 0;
    const kf = d < 0
      ? [{transform:'none', opacity:1}, {transform:`translate(${dx * .35}px,${dy * .35 - 26}px) scale(1.15)`, opacity:1, offset:.4}, {transform:`translate(${dx * .7}px,${dy * .7}px) scale(.8)`, opacity:0}]
      : [{transform:'translateY(-34px) scale(1.15)', opacity:0}, {transform:'translateY(-34px) scale(1.15)', opacity:1, offset:.3}, {transform:'none', opacity:1}];
    c.animate(kf, {duration:d < 0 ? 560 : 420, delay:k * 70, easing:'cubic-bezier(.4,.1,.3,1)', fill:'both'}).onfinish = () => c.remove();
  }
}
// the held card: the shared pop-up card at the tap-to-read width, shown at 1.5x a market card (scale s), flat over
// the middle of the mat. Returns {g, s, at} (at: its rect on screen), or null when the mat isn't up.
function matOppCard(name, k, el){
  const shop = document.querySelector('#view-play .osshop'); if (!shop) return null;
  let card = el && el.querySelector && el.querySelector('.cfm') ? el : null;
  if (!card){ card = document.createElement('div'); card.className = `mcard ${k}`; try{ card.innerHTML = cardFace(name, k, 0, true); }catch(e){ return null; } }
  const g = cardPop(card);
  g.querySelectorAll('button, .kwgloss, .pkdrag, .stamps').forEach(x => x.remove());
  const ref = shop.querySelector('.mktp .market .mcard:not(.ghost)'), fr = ref && matFlatRect(ref);
  const W = Math.min(290, window.innerWidth - 72), s = Math.min(1, ((fr && fr.width) || 99) * 1.5 / W);
  g.classList.add('osheld'); g.setAttribute('aria-hidden', 'true');
  g.style.cssText = 'width:100%;margin:0;font-size:1.05rem';
  const F = matFlyBox(g);
  F.style.cssText = `position:fixed;left:0;top:0;width:${W}px;margin:0;z-index:${LAYER.popup};pointer-events:none;visibility:hidden`;
  document.body.appendChild(F);
  // in the middle of what you can see of the mat (the shop between the bars, inside the visual viewport), card and tag together
  const h = F.getBoundingClientRect().height, sr = shop.getBoundingClientRect(), vv = window.visualViewport;
  const vt = Math.max(sr.top, vv ? vv.offsetTop : 0), vb = Math.min(sr.bottom, vv ? vv.offsetTop + vv.height : window.innerHeight);
  const vl = vv ? vv.offsetLeft : 0, vw = vv ? vv.width : window.innerWidth, TAG = 30;
  const at = {left:vl + (vw - W * s) / 2, top:Math.max(vt + 8, vt + (vb - vt - h * s - TAG) / 2), width:W * s, height:h * s};
  F.style.left = at.left + 'px'; F.style.top = at.top + 'px'; F.style.transform = `scale(${s})`; F.style.visibility = '';
  return {g:F, s, at, W, h};
}
// the held card rises from flat mat spot fr (its pose in the tilt, cropped) to where it is held, its crop opening
function matOppRise(c, fr, flat){
  const {g, s, at, W, h} = c, b = {left:at.left, top:at.top, width:W, height:h};
  if (reduceMotion()) return Promise.resolve();
  if (!fr || !fr.width){
    return g.animate([{opacity:0, transform:`scale(${s * .9})`}, {opacity:1, transform:`scale(${s})`}], {duration:260, easing:'ease-out'}).finished.catch(() => {});
  }
  const kf = matArc(b, {r:fr, tilt:flat ? 0 : 1}, {r:at, tilt:0}, {arc:30, bump:.04});
  if (!kf) return Promise.resolve();
  const cr = matCrop(g.firstElementChild, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration:MAT_OPP_RISE, easing:'ease-in-out', fill:'forwards'});
  const a = g.animate(kf, {duration:MAT_OPP_RISE, easing:MAT_EASE, fill:'backwards'});
  return a.finished.then(cr.done, cr.done).catch(() => {});
}
// after a card lands where it waited hidden: that spot shows (a redraw during the flight made a new, hidden one)
function matOppShow(i, w, n, k){
  if (!w) return;
  matWaitAdd(i, w, -1);
  const to = matSpotOf(n, k, i); if (to && !matWaitN(i, w)) to.style.visibility = '';
}
// oppBuyStep's step on the mat. Returns the step's promise, or null to play today's motion.
function matOppBuy(i, ev, src){
  if (i === seat() || !matShopOn()) return null;
  const fr = src && src.fr ? src.fr : (() => { const d = deckEl(ev.k); return d && d.closest('.osplane') ? matFlatRect(d) : null; })();
  const c = matOppCard(ev.n, ev.k, src && src.el);
  if (ev._matStand){ ev._matStand.remove(); ev._matStand = null; }   // it lifts from here on: the copy over its spot goes
  if (!c) return null;
  try{ sfx.pick(); }catch(e){}
  matPurseSet(i, -(ev.price || 0), fr && fr.width ? fr : c.at);
  const tag = `${oppWho(i)} bought · $${ev.price}${ev.on ? ` · leveled ${dispName(ev.on)}` : ''}`;
  const n = ev.on || ev.n, w = ev._matWait;
  return matOppRise(c, src && src.fr ? fr : null)
    .then(() => oppHold(c.g, c.at, c.W, c.h, tag, i, MAT_OPP_HOLD))
    .then(() => new Promise(res => {
      // Covenant cards come along from the market spot, without a hold
      (ev.pair || []).forEach((pn, m) => {
        if (!src || !src.r || !src.r.width) return;
        const f = flyer(pn, ev.k); flyEl(f.g, src.r, src.r.width, src.r.height, LAYER.flight, f.ctx); f.g.style.overflow = ''; f.g.style.opacity = '0';
        setTimeout(() => { f.g.style.opacity = ''; matLand(f.g, matSpotOf(pn, ev.k, i)); }, (m + 1) * 220);
      });
      const to = matSpotOf(n, ev.k, i);
      if (to) to.style.visibility = 'hidden';
      matLand(c.g, to, {s:c.s, find:() => matSpotOf(n, ev.k, i), done:() => { matOppShow(i, w, n, ev.k); try{ sfx.coin(0.35); }catch(e){} res(); }});
    }));
}
// oppSellStep's step on the mat: the sold card lifts off their side, holds, and lands on the discard pile (a Moisture
// Harvester on its shop pile); its coin drops into their purse
function matOppSell(i, ev, src){
  if (i === seat() || !matShopOn()) return null;
  const c = matOppCard(ev.n, ev.k, null); if (!c) return null;
  const gain = SELL_PRICE + (typeof bVal === 'function' ? bVal(G.players[i], 'The Bazaar') || 0 : 0);
  return matOppRise(c, src && src.fr, src && src.flat)
    .then(() => oppHold(c.g, c.at, c.W, c.h, `${oppWho(i)} sold · +$1`, i, MAT_OPP_HOLD))
    .then(() => new Promise(res => {
      matLand(c.g, matDiscardSpot(ev.n), {s:c.s, find:() => matDiscardSpot(ev.n), done:() => { matPurseSet(i, gain); try{ sfx.coin(0.35); }catch(e){} res(); }});
    }));
}

/* ===================== MOBILIZE ON THE MAT (one-screen dev, phones) =====================
   The shop flows into Mobilize without a screen change (the shop model's motion, Nov 23):
   1. The sweep (matSweep): once both have passed and the rival's last moves have played out, every card left in the
      market slides across the mat in its tilt: unbought cards face up onto the top of their own deck, cards that
      were already sideways (unbought twice) into the discard pile, and the always-for-sale piles off the left edge. The rules are the same as before; only the motion
      is new (the engine keeps the leftovers in the display, sideways; on the mat they wait on their decks, and the next
      round's deal brings them back out: matReturnFly).
   2. The lift (matMobLift): the mat dims, your deck lifts off its pile flat into a cascade column (card 1 in full at
      the bottom, the cards behind it showing their names above it; Brian, Nov 24), the bench beside it fills from where things are on the mat (gear from your
      hand spot, tokens off the Caravan card that makes them, units your deck can't hold from the pile), and the
      rival's deck turns face down and rises off the top edge.
   3. Mobilize itself is the usual one (js/ui/10-mobilize.js: its drawing pieces, its moves and its one input
      controller), laid out over the dimmed mat (.osmob): card 1 in full at the bottom as everywhere, units over the
      deck's limit stay on the bench, and Suggest and Lock in sit in the bottom bar.
   While the sweep and the lift play, redraws wait (matMobGate) and Mobilize takes no input (matMobBusy), then one
   redraw catches up. On every phone this is the Mobilize screen (the old one is only on desktop now); pass and play's
   hand-over screen and an online deck already locked in keep their panels. */
const MATMOB = {busy:false, lift:false, queued:false, cells:null, flyers:[]};
const MAT_SWEEP = 700, MAT_SWEEP_GAP = 95, MAT_MOB_LIFT = 1250;
// every phone Mobilize is this one (Brian, Nov 24: the old Mobilize screen is gone on phones, rug switch or not);
// the pass-and-play hand-over and the online "Deck locked in" panels come before it, as before. Desktop keeps its own.
function matMobOn(){
  return !!G && G.phase === 'mobilize' && !ui.battle && !G.over && !ui.start && !ui.roll && compact()
    && !(PP() && ui.handoff != null) && !(G.net && NET && NET.acts.length > NET.applied[NET.seat]);
}
function matMobBusy(){ return MATMOB.busy; }
// a shop deck in Mobilize: last shop's leftovers lie face up on top of it (they come back out at the next deal)
function matSweptDeck(k){
  const left = (G.disp[k] || []).filter(c => c && c.name), top = left[0];
  const edges = Array.from({length:Math.min(3, Math.max(0, left.length - 1))}, (_, j) => `<i class="osswedge" style="--k:${j + 1}"></i>`).join('');
  return `<div class="osswept" data-k="${k}">${deckPileHTML(k, false, true)}${top ? `<span class="osswstack" aria-hidden="true">${edges}<span class="mcard ${k} osswtop">${cardFace(top.name, k, 0, true)}</span></span>` : ''}</div>`;
}
// The always-for-sale piles (Drifter, Moisture Harvester) lead each row in the shop; for Mobilize they slide off the
// left edge of the screen, in the mat's tilt, and come back from there at the next deal. Their spot: el's flat rect
// moved out past the left edge (Brian, Nov 24).
function matSupplyOff(fr){ return fr && fr.width ? {left:-fr.width * 1.6, top:fr.top, width:fr.width, height:fr.height} : null; }
// a market row in Mobilize: the same grid as in the shop (so nothing on the mat moves), its display spots empty
function matMobRow(k, src){
  const n = (G.disp[k] || []).length + ghostList(k).length, want = MATMOB.cells && MATMOB.cells[k] != null ? MATMOB.cells[k] : 5;
  return marketRow(k, src) + '<span class="osmkgap" aria-hidden="true"></span>'.repeat(Math.max(0, want - n));
}
function matMobHTML(){
  const S = seat(), me = G.players[S], d = mzIds(ui.draft || []);
  let k = 0; const nos = d.map(u => isBat(u.name) ? 0 : ++k);
  const rows = d.map((u, i) => mzDeckCard(u, nos[i])).reverse().join('');   // drawn back (top) to front: card 1, in full, at the bottom
  const items = mzBenchItems(me, d), bench = items.map(mzBenchCard).join('');
  const who = PP() && !G.net ? `${esc(nm(S))}'s deck` : 'Your deck';
  return `${matSeatHTML(1 - S, 'mob')}${matSeatHTML(S, 'mob')}<div class="osshop osmobmat${MATMOB.lift ? ' oslifting' : ''}" aria-hidden="true"><div class="osplane"><div class="osinner">
    ${matTraysHTML(matSweptDeck, matMobRow, ['', frozenHTML(S)])}
  </div></div></div>
  <div class="osmob"><div class="osmobdim" aria-hidden="true"></div>
    <div class="forces mz osmz" style="--n:${Math.max(1, d.length)};--tt:${d.reduce((t, u) => t + (u.gear ? 1 : 0) + (u.arm || 0) + (u.tr || 0) + (u.sh || 0), 0)};--bn:${Math.max(1, items.length)}">
      <section class="mz-deck" aria-label="${who}"><div class="osmzhd">${who}</div>${mzLimitsHTML(me, d)}
        <div class="mzstack" id="mz-deck">${rows || '<div class="mzempty">Drag units here from the bench</div>'}</div>
        ${ui.err ? `<p class="err" role="alert">${esc(ui.err)}</p>` : ''}
      </section>
      <div class="mobright">
        <section class="mz-bench" aria-label="Bench"><div class="osmzhd">Bench</div>
          <div class="mzstack" id="mz-bench">${bench || '<div class="mzempty">Everything is in your deck</div>'}</div>
        </section>
        ${mobMirHTML(me)}
      </div>
    </div>
  </div>${mirModalHTML()}`;
}
// the bottom bar in Mobilize on the mat: Suggest a deck, then Lock in (same height as the shop's bar, so the mat stays put)
function matMobDockHTML(acts){
  return `<div class="dock osdock osmobdock${ui.planning ? '' : ' mine'} ph-mobilize" id="dock"><button type="button" class="act" data-act="suggest">Suggest</button><div class="dbtns dact">${acts}</div></div><div class="dockspace" aria-hidden="true"></div>`;
}
// renderPlay's first step: the shop is still on the mat and the game has moved on to Mobilize. Wait for the rival's
// last moves to play, then sweep the market and draw Mobilize. Returns true when this redraw should wait.
function matMobGate(){
  if (MATMOB.busy){ MATMOB.redraw = true; return true; }
  if (MATMOB.lift || !G || G.phase !== 'mobilize' || !matMobOn()) return false;   // lift: the sweep is done, draw Mobilize
  const shop = document.querySelector('#view-play .osshop:not(.osmobmat)');
  if (!shop || reduceMotion()) return false;   // nothing on screen to sweep: draw Mobilize as it is
  if (oppBusy()){
    if (!MATMOB.queued){ MATMOB.queued = true; oppOnIdle(() => { MATMOB.queued = false; renderPlay(); }); }
    return true;
  }
  MATMOB.busy = true; MATMOB.redraw = false;
  try{ if (peekEl) closePeek(); }catch(e){}
  dismissTurnFlash();
  matSweep(shop).then(() => {
    MATMOB.busy = false; MATMOB.lift = true;
    renderPlay();   // draws Mobilize; matMobAfterDraw lifts the deck
    const fl = MATMOB.flyers.splice(0);
    requestAnimationFrame(() => requestAnimationFrame(() => fl.forEach(g => g.remove())));   // the swept cards now lie on their decks
  });
  return true;
}
// 1. the sweep, on the shop as it is on screen. Resolves when the last card has landed.
function matSweep(shop){
  return new Promise(res => {
    const live = new Set(['u', 'b'].flatMap(k => (G.disp[k] || []).map(c => 'c' + c.id)));
    const deck = k => shop.querySelector(`.ostray .sdeck[data-k="${k}"] .dealdeck`);
    const pile = shop.querySelector('#muster-pile .mpcards') || shop.querySelector('#muster-pile');
    MATMOB.cells = {};
    const list = [];
    for (const sec of shop.querySelectorAll('.osmkt .msec[data-k]')){
      const k = sec.dataset.k === 'b' ? 'b' : 'u', all = [...sec.querySelectorAll('.market > .mcard')], cards = all.filter(e => e.dataset.ck && !e.classList.contains('ghost'));
      MATMOB.cells[k] = all.length;
      // the always-for-sale pile (Drifter, Moisture Harvester) slides off the left edge for Mobilize
      const sup = sec.querySelector('.alwaysw .astack > .mcard'), sfr = sup && matFlatRect(sup), sto = matSupplyOff(sfr);
      if (sfr && sfr.width && sto) list.push({el:sup, k, fr:sfr, to:'supply', dest:sto, hide:sup.closest('.alwaysw')});
      for (const el of cards){ const fr = matFlatRect(el); if (fr && fr.width && getComputedStyle(el).visibility !== 'hidden' && el.style.opacity !== '0') list.push({el, k, fr, to:live.has(el.dataset.ck) ? 'deck' : 'pile'}); }
    }
    list.reverse();   // the last card first, so each row's first card lands last, on top of its deck
    // what goes away with the shop: the bottom bar's buttons and purse, the turn glow
    document.querySelectorAll('#view-play .osbar.osact').forEach(b => b.classList.remove('osact'));
    for (const e of document.querySelectorAll('#dock .dbtns, #dock .ospurse, #dock .tslots'))
      if (e) e.animate([{opacity:1}, {opacity:0}], {duration:250, fill:'forwards'});
    const n = {u:0, b:0, p:0}, tot = {u:0, b:0, p:0}; let end = 0;
    for (const x of list) if (!x.dest) tot[x.to === 'deck' ? x.k : 'p']++;
    list.forEach((x, j) => {
      const t = x.to === 'deck' ? deck(x.k) : pile, tr = x.dest || (t && matFlatRect(t));
      if (!tr || !tr.width) return;
      const w = x.to === 'deck' ? x.k : 'p', h = x.dest ? 0 : n[w]++;
      const dest = x.dest || {left:tr.left, top:tr.top + Math.min(3, tot[w] - 1 - h) * 2, width:tr.width};   // each a little lower than the next: the last lands on the spot itself
      const {g, ctx} = flyer(x.el, x.k, {exact:true});
      g.classList.remove('canbuy', 'cant', 'peeked', 'oslifted');
      flyEl(g, x.fr, x.fr.width, x.fr.height, LAYER.flight, ctx); g.style.overflow = '';
      const kf = matArc(x.fr, {r:x.fr, tilt:1}, {r:dest, tilt:1}, {arc:22, bump:.06});
      if (!kf){ g.remove(); return; }
      const delay = j * MAT_SWEEP_GAP;
      g.animate(kf, {duration:MAT_SWEEP, delay, easing:MAT_EASE, fill:'both'});
      (x.hide || x.el).style.visibility = 'hidden';
      MATMOB.flyers.push(g);
      try{ sfx.flick(delay / 1000 + .02); }catch(e){}
      end = Math.max(end, delay + MAT_SWEEP);
    });
    setTimeout(res, end ? end + 120 : 0);
  });
}
// renderPlay's step: Mobilize was just drawn after the sweep, so the deck lifts off the mat
function matMobAfterDraw(){
  if (!MATMOB.lift) return;
  MATMOB.lift = false;
  if (!matMobOn() || !document.querySelector('#view-play .osmobmat')) return;
  MATMOB.busy = true; MATMOB.redraw = false;
  matMobLift().then(() => { MATMOB.busy = false; renderPlay(); });   // one redraw catches up (and puts the piles away)
}
// where a bench item comes from on the mat: gear from your hand spot, tokens off the Caravan card that makes them,
// units (and anything else) from your deck pile
const MAT_TOK_FROM = {arm:'Smithy', sh:'Armory', tr:'Study'};
function matBenchFrom(el, me){
  const named = (sel, n) => [...me.querySelectorAll(sel)].find(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === n; });
  const t = el.dataset.mz, src = t === 'bgear' ? named('.oshand', el.dataset.name) : t === 'btok' ? named('.oscar', MAT_TOK_FROM[el.dataset.tok]) : null;
  return src || me.querySelector('.ospile .ostop') || me.querySelector('.ospile');
}
// 2. the lift. Resolves when Mobilize is ready to use.
function matMobLift(){
  const mat = document.querySelector('#view-play .osmobmat'), mob = document.querySelector('#view-play .osmob');
  if (!mat || !mob || reduceMotion()) return Promise.resolve();
  const me = document.querySelector('#view-play .osbar.me'), opp = document.querySelector('#view-play .osbar.opp');
  const myPile = me && me.querySelector('.ospile'), top = me && (me.querySelector('.ospile .ostop') || myPile), ps = matSpotRect(top), pr = ps && ps.r;
  let end = 0;
  const run = (el, kf, o) => { if (!kf) return; el.style.transformOrigin = '0 0'; el.animate(kf, o); end = Math.max(end, (o.delay || 0) + o.duration); };
  const dim = mob.querySelector('.osmobdim');
  if (dim) dim.animate([{opacity:0}, {opacity:1}], {duration:900, easing:'ease-out', fill:'backwards'});
  // the deck: off the pile's top card, in the tilt, out to its place in the column, its crop opening to the full card
  const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];
  rows.forEach((el, i) => {
    if (!pr || !pr.width) return;
    const b = el.getBoundingClientRect(), o = {duration:MAT_MOB_LIFT, delay:(rows.length - 1 - i) * 80, easing:MAT_EASE, fill:'backwards'};   // card 1 first
    run(el, matArc(b, {r:pr, tilt:ps.tilt}, {r:b, tilt:0}, {arc:50, bump:.06}), o);
    const face = el.querySelector(':scope > .mzface');
    if (face && face.querySelector(':scope > .cface')){ const cr = matCrop(face, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration:o.duration, delay:o.delay, easing:'ease-in-out', fill:'both'}); if (cr.anims[0]) cr.anims[0].onfinish = cr.done; }
    for (const x of el.querySelectorAll(':scope > .mzpow, :scope > .mztags, :scope > .mztk'))
      x.animate([{opacity:0}, {opacity:0, offset:.6}, {opacity:1}], {duration:o.duration, delay:o.delay, fill:'backwards'});
  });
  if (myPile) myPile.style.visibility = 'hidden';
  // the bench: each item from where it is on the mat
  [...mob.querySelectorAll('#mz-bench > .mzc')].forEach((el, i) => {
    const s = me && matBenchFrom(el, me), ss = matSpotRect(s); if (!ss) return;
    const b = el.getBoundingClientRect();
    run(el, matArc(b, {r:ss.r, tilt:ss.tilt}, {r:b, tilt:0}, {arc:40, bump:.05}), {duration:MAT_MOB_LIFT * .8, delay:200 + i * 90, easing:MAT_EASE, fill:'backwards'});
    if (s.classList.contains('oshand')) s.style.visibility = 'hidden';
  });
  // the rival's deck turns face down and rises off the top edge
  const op = opp && opp.querySelector('.ospile'), ofr = op && op.getBoundingClientRect();
  if (op && ofr){
    const up = -(ofr.top + ofr.height + 40), cover = op.querySelector('.osbackcover');
    op.animate([{transform:'none'}, {transform:'scaleX(0)', offset:.22}, {transform:'scaleX(1)', offset:.44}, {transform:`translateY(${up}px)`}], {duration:1000, delay:150, easing:'ease-in-out', fill:'forwards'});
    if (cover) cover.animate([{opacity:0}, {opacity:0, offset:.22}, {opacity:1, offset:.2201}, {opacity:1}], {duration:1000, delay:150, fill:'forwards'});
  }
  // fight-order numbers pop on, then the headings, limits and the bottom bar
  [...mob.querySelectorAll('#mz-deck > .mzc > .mzno')].reverse().forEach((b, i) => b.animate([{opacity:0, transform:'scale(0)'}, {opacity:1, transform:'scale(1.15)', offset:.7}, {opacity:1, transform:'none'}], {duration:280, delay:1400 + i * 70, easing:'ease-out', fill:'backwards'}));
  [...mob.querySelectorAll('.osmzhd, .mzlim, .mzempty, .err'), ...document.querySelectorAll('#dock .act, #dock .dbtns')].forEach((e, j) =>
    e.animate([{opacity:0, transform:'translateY(6px)'}, {opacity:1, transform:'none'}], {duration:350, delay:1450 + j * 40, fill:'backwards'}));
  try{ sfx.rustle(); }catch(e){}
  return new Promise(res => setTimeout(res, Math.max(end, 1750)));
}
// The next round's deal on the mat: last shop's leftovers come back out of the top of their deck (where the sweep left
// them), face up, sliding across the mat to their spot; the real card shows when its copy lands. Returns when it lands.
function matReturnFly(el, deck, delay, dur){
  if (!matShopOn() || !el || !deck || !el.closest('#view-play .osplane')) return 0;
  const fr = matFlatRect(el), dr = deck.nodeType ? matFlatRect(deck) : deck;   // deck: an element, or a flat rect (matSupplyOff)
  if (!fr || !fr.width || !dr || !dr.width) return 0;
  const {g, ctx} = flyer(el, null, {exact:true});
  g.classList.remove('canbuy', 'cant', 'peeked');
  flyEl(g, fr, fr.width, fr.height, LAYER.flight, ctx); g.style.overflow = '';
  const kf = matArc(fr, {r:dr, tilt:1}, {r:fr, tilt:1}, {arc:22, bump:.06}); if (!kf){ g.remove(); return 0; }
  el.animate([{opacity:0}, {opacity:0}], {duration:delay + dur});   // the real card waits, invisible, until the copy lands
  const a = g.animate(kf, {duration:dur, delay, easing:MAT_EASE, fill:'both'});
  a.onfinish = a.oncancel = () => g.remove();
  try{ sfx.flick(delay / 1000 + .02); }catch(e){}
  return delay + dur;
}

/* ===================== MOBILIZE → BATTLE ON THE MAT (one-screen dev, phones) =====================
   Lock in (against the AI; it set its deck while you set yours, aiMobStart) flows into the battle in clear beats
   (Brian, Nov 24, after dev27: "Oasis design notes", Into battle):
   1. Gather: your cascade gathers into one stack of full cards on card 1 (bench items you didn't use go back to your hand
      spot); numbers and headings fade.
   2. Crop: the stack, now gathered, turns into its cropped version, in place.
      Meanwhile, under the dim, everything on the mat that isn't in the battle (shop decks, discard pile, market words,
      coins) has already gone, so:
   3. The dim lifts on a clear table: the battle board's own surface, with nothing on it.
   4. The zone words (Deck, Charge, Defeated) fade in. The Caravans stay put in their bars (they never move between
      phases).
   5. Both decks slam down on their spots at the same moment, each with the sand puff: yours from the stack, the rival's
      from off the top edge, face up. Then the battle's step line and buttons come up and the first step plays as before.
   How: matBatGate pins the mat and Mobilize where they are and takes them out of the page (the view's redraw reshapes
   the nodes it finds, morphInto); the same redraw draws the battle; matBatAfterDraw puts them back on top inside a
   screen-sized frame and plays matBatFold then matBatLand. The decks that slam are the board's own deck spots, so the
   battle starts with no swap. Redraws and autoplay wait while it plays. Pass and play, online, desktop, the rug switch
   off and reduced motion keep the hard cut. */
const MATBAT = {busy:false, land:null, redraw:false};
const MAT_GATHER = 320, MAT_GATHER_GAP = 30, MAT_CROP_T = 300, MAT_CLEAR = 420, MAT_DIM = 380, MAT_WORDS = 360, MAT_TIP = 460, MAT_SLAM = 520;
function matBatBusy(){ return MATBAT.busy; }
function matBatWanted(){
  return !!G && !!ui.battle && ui.frame === 0 && !ui.battle.matIn && !PP() && !G.net && !reduceMotion()
    && typeof labMatZones === 'function' && labMatZones() && !!document.querySelector('#view-play .osmobmat .osplane');
}
// renderPlay's step (before drawing): a battle has just started over Mobilize on the mat. The mat and Mobilize are
// pinned where they are and taken out of the page, then this same redraw draws the battle underneath.
function matBatGate(){
  if (MATBAT.busy){ MATBAT.redraw = true; return true; }
  if (!matBatWanted()) return false;
  ui.battle.matIn = true;
  try{ if (peekEl) closePeek(); }catch(e){}
  const mat = document.querySelector('#view-play .osmobmat'), mob = document.querySelector('#view-play .osmob');
  const home = document.querySelector('#view-play .osbar.me .oshandrow') || document.querySelector('#view-play .osbar.me .ospile');
  MATBAT.land = {mat:matPin(mat), mob:matPin(mob), home:home ? matRect(home) : null};
  for (const n of [MATBAT.land.mat, MATBAT.land.mob]) if (n) n.remove();   // the view's redraw must not take these
  return false;
}
// the screen rect of an element's box, and a node pinned where it is now (fixed), so it can outlive a redraw
const matRect = el => { const r = el.getBoundingClientRect(); return {left:r.left, top:r.top, width:r.width, height:r.height}; };
function matPin(el){
  if (!el) return null;
  el.getAnimations({subtree:true}).forEach(a => { try{ a.commitStyles(); }catch(e){} a.cancel(); });   // bake where the animations left things
  const r = el.getBoundingClientRect();
  el.style.position = 'fixed'; el.style.left = r.left + 'px'; el.style.top = r.top + 'px'; el.style.width = r.width + 'px'; el.style.height = r.height + 'px';
  el.style.margin = '0'; el.style.pointerEvents = 'none'; el.setAttribute('aria-hidden', 'true'); el.classList.add('matbatpin');
  return el;
}
// renderPlay's step (after drawing): the battle board was just drawn; Mobilize goes back on top of it and the move plays
function matBatAfterDraw(){
  const L = MATBAT.land; if (!L) return;
  MATBAT.land = null;
  const view = $('view-play'), line = view.querySelector('.stage .line.table.matz');
  if (!line || !L.mob){ return; }
  toGame();   // the page settles on the battle now, so the decks slam where they live
  const cam = document.createElement('div'); cam.className = 'matbatcam'; cam.setAttribute('aria-hidden', 'true');
  for (const n of [L.mat, L.mob]) if (n) cam.appendChild(n);   // (a screen-sized frame that clips: nothing makes the page grow)
  view.appendChild(cam);
  line.classList.add('matbat', 'matbatpre');   // the board's cards wait hidden; its words, Caravans and decks wait for their beat
  const late = [...document.querySelectorAll('#gtop .pbhint, #dock .act, #dock .dbtns')];
  late.forEach(e => { e.style.opacity = '0'; });
  MATBAT.busy = true; MATBAT.redraw = false;
  matBatFold(L).then(() => matBatLand(line, L)).then(() => {
    late.forEach(e => { e.style.opacity = ''; if (e.isConnected) e.animate([{opacity:0}, {opacity:1}], {duration:260, easing:'ease-out'}); });
    line.classList.remove('matbat');
    cam.remove();
    MATBAT.busy = false;
    if (MATBAT.redraw){ MATBAT.redraw = false; renderPlay(); }
    if (autoOn()) startAuto(400);
  });
}
// 1 + 2 (and the clearing under the dim). Resolves when the stack is cropped and the mat under the dim is clear.
function matBatFold(L){
  return new Promise(res => {
    const mob = L.mob, mat = L.mat;
    const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];
    const one = L.one = rows[rows.length - 1];   // drawn back to front: card 1 is the last row
    const at = one && one.getBoundingClientRect();
    const go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'forwards', easing:MAT_EASE, ...o}) : null;
    // 1. the cascade gathers into one stack of full cards on card 1, the last card first
    rows.slice(0, -1).forEach((el, i) => {
      const r = el.getBoundingClientRect(); if (!at) return;
      el.style.transformOrigin = '0 0';
      go(el, [{transform:'none'}, {transform:`translate(${at.left - r.left}px,${at.top - r.top}px) scale(${at.width / r.width})`}], {duration:MAT_GATHER, delay:i * MAT_GATHER_GAP});
    });
    const gathered = MAT_GATHER + Math.max(0, rows.length - 2) * MAT_GATHER_GAP;
    for (const e of mob.querySelectorAll('.mzno, .mzpow, .mztags, .mztk, .osmzhd, .mzlim, .mzempty, .err, .mobmir')) go(e, [{opacity:1}, {opacity:0}], {duration:220});
    // bench items you didn't use go back to your hand spot (or your deck pile) in your bar, where it was, and fade there
    const hr = L.home;
    [...mob.querySelectorAll('#mz-bench > .mzc')].forEach((el, i) => {
      const b = el.getBoundingClientRect(), o = {duration:MAT_GATHER + 120, delay:i * 50};
      if (hr && hr.width && b.width){ el.style.transformOrigin = '0 0'; go(el, matArc(b, {r:b, tilt:0}, {r:{left:hr.left, top:hr.top, width:Math.min(hr.width, hr.height * b.width / b.height)}, tilt:0}, {arc:30}), o); }
      go(el, [{opacity:1}, {opacity:1, offset:.7}, {opacity:0}], {...o, easing:'linear'});
    });
    // 2. once gathered, the stack turns into its cropped version, in place (the cards under card 1 go with it)
    rows.slice(0, -1).forEach(el => go(el, [{opacity:1}, {opacity:0}], {duration:1, delay:gathered}));
    const face = one && one.querySelector(':scope > .mzface');
    if (face && face.querySelector(':scope > .cface')) matCrop(face, [[0, 'open'], [1, 'crop']], {duration:MAT_CROP_T, delay:gathered, easing:'ease-in-out', fill:'forwards'});
    // under the dim, the whole mat leaves (shop decks, discard, market words): the battle has its own table
    if (mat) go(mat, [{opacity:1}, {opacity:0}], {duration:MAT_CLEAR, delay:80, easing:'ease-in'});
    try{ sfx.rustle(); }catch(e){}
    setTimeout(res, Math.max(gathered + MAT_CROP_T, 80 + MAT_CLEAR) + 40);
  });
}
// 3–5. the dim lifts on a clear table, the words and Caravans come, the decks slam. Resolves when the board is the board.
function matBatLand(line, L){
  return new Promise(res => {
    const mob = L.mob;
    const mine = line.querySelector('.trow.s0 > .deckz > .tzc'), theirs = line.querySelector('.trow.s1 > .deckz > .tzc');
    const face = el => el && el.querySelector('.card:not(.mini)');
    const go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'backwards', easing:'cubic-bezier(.2,.7,.25,1)', ...o}) : null;
    let t = 0;
    // 3. the dim lifts (the stack stays, held above the table)
    const dim = mob.querySelector('.osmobdim'); if (dim) dim.animate([{opacity:1}, {opacity:0}], {duration:MAT_DIM, easing:'ease-out', fill:'forwards'});
    t += MAT_DIM - 80;
    // 4. the zone words fade in (the Caravans stay where they were, in the bars)
    for (const w of line.querySelectorAll('.zl, .labslot')) go(w, [{opacity:0}, {opacity:1}], {duration:MAT_WORDS, delay:t, easing:'ease-out'});
    // (your deck starts tipping as the words come, and lands once they're in: MAT_TIP > MAT_WORDS)
    // 5. your deck takes over from the cropped stack where it is, flat, the same size, then tips into the board's tilt
    // while it moves to the spot it drops from, right above its place; then both decks slam down together (the rival's
    // from off the top edge, face up), a squash and the puff on each
    const squash = [{k:'translate(0,-10px) scale(1.04)', o:.72}, {k:'scale(1.07,.88)', o:.84}, {k:'scale(.99,1.02)', o:.93}, {k:'none', o:1}];
    const dust = (el, at) => setTimeout(() => { const q = face(el) ? face(el).getBoundingClientRect() : el.getBoundingClientRect(); try{ labDust(q.left + q.width / 2, q.bottom - 4, q.width * 1.3); }catch(e){} }, at);
    const slam = (el, from) => {   // (the rival's: from off the top edge)
      if (!el) return;
      const r = el.getBoundingClientRect(), f = face(el) ? face(el).getBoundingClientRect() : r, cos = Math.cos(14 * Math.PI / 180);
      el.style.transformOrigin = `${f.left - r.left + f.width / 2}px ${(f.bottom - r.top) / cos}px`;
      go(el, [{transform:`translate(0,${-(f.bottom + 40) / cos}px) scale(1.12)`, offset:0}, ...squash.map(q => ({transform:q.k, offset:q.o}))], {duration:MAT_SLAM, delay:t + MAT_TIP, easing:'ease-in'});
      dust(el, t + MAT_TIP + MAT_SLAM * .82);
      for (const hp of el.querySelectorAll('.hprow, .tk')) go(hp, [{opacity:0}, {opacity:1}], {duration:200, delay:t + MAT_TIP + MAT_SLAM});
    };
    const oneF = L.one && L.one.querySelector(':scope > .mzface');
    const fl = mine && oneF ? matBatTip(line, mine, face(mine), matRect(oneF), squash) : null;
    line.classList.remove('matbatpre');   // (every piece now has its beat's animation holding it back)
    if (mine && fl){
      // the stack itself (still the sharp, big card) tips and moves; your deck takes over at the drop spot, same pose
      oneF.style.transformOrigin = '0 0';
      oneF.animate(fl.tip, {duration:MAT_TIP, delay:t, easing:'linear', fill:'forwards'});
      oneF.animate([{opacity:1}, {opacity:0}], {duration:1, delay:t + MAT_TIP + 16, fill:'forwards'});
      mine.style.transformOrigin = '0 0';
      go(mine, fl.drop, {duration:MAT_SLAM, delay:t + MAT_TIP, easing:'linear'});
      go(mine, [{opacity:0}, {opacity:1}], {duration:1, delay:t + MAT_TIP, easing:'linear'});
      dust(mine, t + MAT_TIP + MAT_SLAM * .82);
      for (const hp of mine.querySelectorAll('.hprow, .tk')) go(hp, [{opacity:0}, {opacity:1}], {duration:200, delay:t + MAT_TIP + MAT_SLAM});
    } else if (mine){ go(mine, [{opacity:0}, {opacity:1}], {duration:60, delay:t + MAT_TIP, easing:'linear'}); slam(mine, null); if (oneF) oneF.animate([{opacity:1}, {opacity:0}], {duration:60, delay:t + MAT_TIP, fill:'forwards'}); }
    if (theirs) go(theirs, [{opacity:0}, {opacity:1}], {duration:1, delay:t + MAT_TIP, easing:'linear'});
    slam(theirs, null);
    t += MAT_TIP;
    setTimeout(() => { try{ sfx.lock(); }catch(e){} }, t + MAT_SLAM * .82);
    setTimeout(() => {
      for (const el of [mine, theirs]) if (el) el.style.transformOrigin = '';
      res();
    }, t + MAT_SLAM + 60);
  });
}

/* Your deck's flight in two parts (transform origin top left on both).
   tip: the cropped stack (flat on the screen at rect R, sharp because it is drawn big) tips into the board's tilt while
   it moves to the spot your deck drops from (straight above its place, a little bigger). drop: your deck itself, from
   that same pose down onto its spot with the squash. The board (.line.table) tips back by the mat's camera,
   perspective(1000px) rotateX(14deg) from its bottom edge (css/11-rug.css). The stack's pose is the deck's pose in the
   board, seen through that camera at an angle that grows from 0 to 14°, so at the end the two match exactly. */
function matBatTip(line, el, cardEl, R, squash){
  if (!cardEl || !R || !R.width) return null;
  line.style.setProperty('transform', 'none', 'important');
  const Lr = line.getBoundingClientRect(), D = el.getBoundingClientRect(), F = cardEl.getBoundingClientRect();
  line.style.removeProperty('transform');
  if (!F.width) return null;
  const ox = Lr.left + Lr.width / 2, oy = Lr.bottom, deg = 14, P = 1000;
  const cam = a => new DOMMatrix().translate(ox, oy).multiply(new DOMMatrix(`perspective(${P}px) rotateX(${a}deg)`)).translate(-ox, -oy);
  const fx = F.left - D.left, fy = F.top - D.top, fw = F.width, fh = F.height;
  // the deck's own transform (in the board's flat plane): k0/t0 puts its card over R, k1/t1 is the drop pose
  const k0 = R.width / fw, t0x = R.left - D.left - k0 * fx, t0y = R.top - D.top - k0 * fy;
  const k1 = 1.12, cx = fx + fw / 2, cy = fy + fh, lift = fh * .42, t1x = cx - k1 * cx, t1y = cy - k1 * cy - lift;
  const sm = x => x * x * (3 - 2 * x), N = 18, tip = [];
  for (let i = 0; i <= N; i++){
    const u = i / N, e = sm(u), th = deg * sm(Math.min(1, u * 1.15));
    const k = k0 + (k1 - k0) * e, tx = t0x + (t1x - t0x) * e, ty = t0y + (t1y - t0y) * e - Math.sin(Math.PI * u) * fh * .12;
    // on screen: the board's camera at th, of the deck's spot moved by (tx, ty, k); the stack's own box maps onto the deck's card
    const S = cam(th).translate(D.left, D.top).translate(tx, ty).scale(k).translate(fx, fy).scale(fw / R.width);
    tip.push({transform:new DOMMatrix().translate(-R.left, -R.top).multiply(S).toString(), offset:u});
  }
  const drop = [{transform:new DOMMatrix().translate(t1x, t1y).scale(k1).toString(), offset:0, easing:'ease-in'}];
  for (const q of squash.slice(0, -1)) drop.push({transform:new DOMMatrix().translate(cx, cy).multiply(new DOMMatrix(q.k)).translate(-cx, -cy).toString(), offset:q.o, easing:'ease-out'});
  drop.push({transform:'none', offset:1});
  return {tip, drop};
}
