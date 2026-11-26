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
   Off: the rug's switch (localStorage.oasisRug = '0') brings back the scrolling phone shop. The desktop table is the
   default too; designers can turn it off in the game menu (localStorage.oasisMatDesk = '0', matOn, js/rug.js). */
function matShopOn(){
  return !!G && G.phase === 'shop' && !ui.battle && !G.over && typeof matOn === 'function' && matOn();
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
  const desk = matDesk();   // desktop: one row on the mat (matDeskPilesHTML), not a fixed bar; in the battle, a strip of cropped cards
  const strip = desk && mode === 'battle';
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
    if (desk) rest = `<i class="osbardiv" aria-hidden="true"></i>${matDeskPilesHTML(i, hand, mode)}${matPurseHTML(i)}`;
  }
  const act = mode === 'shop' && G.phase === 'shop' && !G.passed[i] && cur(G) === i;   // whose turn it is: their bar glows
  const side = desk ? `<span class="osside" aria-hidden="true">${PP() || G.net ? esc(nm(i)) : mine ? 'You' : 'Enemy'}</span>` : '';
  if (strip) rest = `<i class="osbardiv" aria-hidden="true"></i>${matDeskPilesHTML(i, hand, 'battle')}${matPurseHTML(i)}`;
  return `<section class="osseat ${strip ? 'osrow osstrip' : desk ? 'osrow' : 'osbar'} ${mine ? 'me' : 'opp'} s${VS(i)} osbar-${mode}${act ? ' osact' : ''}${mode === 'mob' && MATMOB.lift ? ' oslifting' : ''}" aria-label="${who} side${act ? ', shopping now' : ''}">
    ${side}<div class="fcards oscarrow" style="--n:${spots}" aria-label="${who} Caravan, ${slotsUsed(p)} of ${cap}">${carHTML}</div>${rest}
  </section>`;
}
/* Desktop row (Oasis desktop shop brief): after the Caravan, the deck pile (units and gear from before this shop), the
   "Bought this shop" pile (units and gear bought this shop, with the buys left; supports go straight into the
   Caravan), the Miracles pile, then the water. Each pile: the top card face up, the copies as edges under it, a tag. */
function matDeskPilesHTML(i, hand, mode = 'shop'){
  const S = seat(), mine = i === S, p = G.players[i], gear = p.gear || {}, got = (G.shopBought && G.shopBought[i]) || [];
  const isGear = n => !!(BDEFS[n] && BDEFS[n].gear), kindOf = n => DEFS[n] ? 'u' : 'b';
  const bought = {}; for (const n of got) if (DEFS[n] || isGear(n)) bought[n] = (bought[n] || 0) + 1;
  const deck = {}, nb = {};
  for (const n in hand) if (hand[n] > 0) deck[n] = hand[n];
  for (const n in gear) if (gear[n] > 0) deck[n] = (deck[n] || 0) + gear[n];
  for (const n in bought){ const k = Math.min(bought[n], deck[n] || 0); if (k > 0){ nb[n] = k; deck[n] -= k; if (!deck[n]) delete deck[n]; } }
  const count = o => Object.values(o).reduce((t, c) => t + c, 0);
  const edges = n => Array.from({length:Math.min(3, Math.max(0, n - 1))}, (_, k) => `<i class="osedge" style="--k:${k + 1}"></i>`).join('');
  const canSell = mine && G.phase === 'shop' && !ui.battle && cur(G) === S && !G.passed[S];   // (its Sell button is pressed by a drag to the discard)
  // (the deck pile is itself a button, and a button can't hold another: there the Sell control is a span with the same data-act)
  const sellCtl = (n, inBtn) => { const h = canSell ? shopSellBtnHTML(n, kindOf(n)) : ''; return inBtn ? h.replace(/<button\b/g, '<span').replace(/<\/button>/g, '</span>') : h; };
  const top = (n, hide, inBtn) => `<span class="mcard ${kindOf(n)} ostop"${hide ? ' style="visibility:hidden"' : ''}>${cardFace(n, kindOf(n), kindOf(n) === 'u' ? (hand[n] || 1) : gear[n] || 1, true)}${sellCtl(n, inBtn)}</span>`;
  // the deck pile: the most recently bought card on top, as on the phone
  const dn = count(deck), du = Object.keys(deck).filter(n => DEFS[n]).reduce((t, n) => t + deck[n], 0), dtop = matPileTop(p, deck);
  const dtag = dn ? `Deck · ${du} unit${du === 1 ? '' : 's'}${dn - du ? ` + ${dn - du} gear` : ''}` : 'Deck';
  const deckPile = `<button type="button" class="ospile osdeck deckbtn s${VS(i)}${ui.deckView === i ? ' on' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(deckName(i))}: ${esc(dtag)}, units ${uniqueUnits(hand === p.hand ? p : {...p, hand})} of ${deckCap(p)}, click to view">
    ${edges(dn)}${dtop ? top(dtop, false, true) : '<span class="osslot" aria-hidden="true"></span>'}<span class="ostag">${esc(dtag)}</span></button>`;
  // bought this shop: the latest buy on top (it hides while a rival's buy is still on its way to it)
  const bn = count(nb), btop = got.filter(n => nb[n]).pop() || null, b = G.buys && G.buys[i], left = b ? Math.max(0, baseLeft(b)) : 0, of = b ? buysOf(b) : 3;
  const bhide = btop && (matWaitN(i, 'pile') || matWaitN(i, btop));
  const boughtPile = `<div class="ospile osbought s${VS(i)}" aria-label="Bought this shop: ${bn} card${bn === 1 ? '' : 's'}, ${left} of ${of} buys left">
    ${edges(bn)}${btop ? top(btop, bhide) : '<span class="osslot" aria-hidden="true"></span>'}<span class="ostag osgold">Bought this shop<br>${left}/${of} buys left</span></div>`;
  // Miracles: face down with the count (yours opens the miracles tray, as the phone's Miracles button does)
  let mir = '';
  // Mobilize: both decks are lifted off the mat (the bought pile joined the deck at the end of the shop)
  const gone = tag => `<div class="ospile osgone s${VS(i)}"><span class="osslot" aria-hidden="true"></span><span class="ostag">${tag}</span></div>`;
  if (G.miracles){
    const mn = (p.mir || []).length, live = mine && shopMirLive();
    const inner = `${edges(mn)}<span class="osmirback${mn ? '' : ' osempty'}" aria-hidden="true">✶</span><span class="ostag osmirtag">Miracles · ${mn}</span>`;
    mir = mine ? `<button type="button" class="ospile osmirp${live ? ' glow' : ''}${ui.mirTray ? ' on' : ''}" data-act="mir-tray" aria-expanded="${!!ui.mirTray}" aria-label="Miracles (${mn})">${inner}</button>`
      : `<div class="ospile osmirp" aria-label="${esc(nm(i))}'s miracles: ${mn}">${inner}</div>`;
  }
  if (mode === 'mob') return gone('Deck · lifted').replace('ospile osgone', 'ospile osdeck osgone') + gone('Bought · joined deck') + mir;
  if (mode === 'battle') return mir;   // the battle's strip: the Caravan, Miracles and the water
  return deckPile + boughtPile + mir;
}
// renderPlay's step: the bars (and the mat between them) start right where the top bar ends on screen (--gtb), so the
// rival's bar is at the same place in every phase whatever the page's scroll (the battle can scroll a little)
function matBarsAfterDraw(){
  const desk = document.querySelector('#view-play .osshop.osdesk');
  if (!document.querySelector('#view-play .osbar') && !desk) return;
  if (window.scrollY && !matBarsAfterDraw.busy){ matBarsAfterDraw.busy = true; window.scrollTo(0, 0); matBarsAfterDraw.busy = false; }   // the page sits at its top in every phase on the mat, so nothing shifts between them
  const g = $('gtop'), b = g && g.offsetHeight ? Math.round(g.getBoundingClientRect().bottom) : null;
  if (b != null && document.documentElement.style.getPropertyValue('--gtb') !== b + 'px') document.documentElement.style.setProperty('--gtb', b + 'px');
  if (desk){ if (g && !MATBARS_SEEN.has(g)){ MATBARS_SEEN.add(g); MATBARS_RO.observe(g, {box:'border-box'}); } if (MATHOV.card && !MATHOV.card.isConnected) matHoverEnd(true); matFitDesk(desk); matDeskMobLayout(); matShopInspectCards(desk); return; }
  // your bar sits on the dock's real top edge: measured, so the home-bar padding or a dock that grows after the
  // first draw (fonts, a second row) can never cover it (Brian's iPhone, v89)
  const dk = $('dock'), dh = dk && dk.offsetHeight ? Math.max(0, Math.round(window.innerHeight - dk.getBoundingClientRect().top)) : null;
  if (dh != null && document.documentElement.style.getPropertyValue('--dockh') !== dh + 'px') document.documentElement.style.setProperty('--dockh', dh + 'px');
  for (const e of [g, dk]) if (e && !MATBARS_SEEN.has(e)){ MATBARS_SEEN.add(e); MATBARS_RO.observe(e, {box:'border-box'}); }   // border box: the home-bar room is padding
  matFitMat();
}
// the shop's cards fit between the two bars on any screen: if the trays still reach under a bar (a short or odd-sized
// phone), the card width (--mw) shrinks in proportion until they fit. Measured on screen, so the tilt is included.
function matFitMat(){
  const V = $('view-play'), shop = V && V.querySelector('.osshop'), me = V && V.querySelector('.osbar.me'), opp = V && V.querySelector('.osbar.opp');
  if (!shop || !me || !opp) return;
  shop.style.removeProperty('--mw');
  const cards = [...shop.querySelectorAll('.osmkt .mcard')];
  const span = () => { let t = 1e9, b = -1e9; for (const c of cards){ const r = c.getBoundingClientRect(); if (r.height){ t = Math.min(t, r.top); b = Math.max(b, r.bottom); } } return b > t ? {t, b} : null; };
  const top = opp.getBoundingClientRect().bottom + 2, lim = me.getBoundingClientRect().top - 4;
  const fits = () => { const sp = span(); return !sp || (sp.t >= top && sp.b <= lim); };
  const w0 = cards.length ? cards[0].offsetWidth : 0;
  if (!w0 || fits()) return;
  // the mat's open space above the trays grows twice as fast as below, so a shrink frees less room at the bottom than
  // it saves: search for the widest card that fits (7 layouts at most, only on a screen that needs it)
  let lo = 40, hi = w0;
  for (let i = 0; i < 7 && hi - lo > 0.5; i++){
    const m = (lo + hi) / 2; shop.style.setProperty('--mw', m + 'px');
    if (fits()) lo = m; else hi = m;
  }
  shop.style.setProperty('--mw', Math.floor(lo * 10) / 10 + 'px');
}
// desktop: the card width (--mw) that fits the whole mat (both rows and the trays) in the window, in its tilt, rows
// anchored to the bottom; about 173 px at 1920x1080 (the mock-up). Searched on screen, so the tilt is included.
function matFitDesk(shop){
  const inner = shop.querySelector('.osinner'); if (!inner) return;
  const box = shop.getBoundingClientRect();
  const fits = () => { for (const c of inner.children){ const r = c.getBoundingClientRect(); if (r.height && (r.top < box.top || r.left < box.left || r.right > box.right)) return false; } return true; };
  let lo = 60, hi = 320;
  for (let i = 0; i < 10 && hi - lo > 0.5; i++){ const m = (lo + hi) / 2; shop.style.setProperty('--mw', m + 'px'); if (fits()) lo = m; else hi = m; }
  const mw = Math.floor(lo * 10) / 10 + 'px';
  shop.style.setProperty('--mw', mw); document.documentElement.style.setProperty('--deskmw', mw);   // (the battle's Caravan strips keep this size)
  const mob = document.querySelector('#view-play .osdeskmob'); if (mob) mob.style.setProperty('--mw', mw);   // Mobilize's cards are the board's size
}
const MATBARS_SEEN = new WeakSet();
const matBarsHere = () => !!document.querySelector('#view-play :is(.osbar, .osshop.osdesk)');
const MATBARS_RO = new ResizeObserver(() => { if (matBarsHere()) matBarsAfterDraw(); });
window.addEventListener('scroll', () => { if (matBarsHere()) matBarsAfterDraw(); }, {passive:true});
for (const t of [window, window.visualViewport]) if (t) t.addEventListener('resize', () => { if (matBarsHere()) matBarsAfterDraw(); });
// the two trays and the discard pile between them (deck: the tray's shop deck, row: its market row)
// side (desktop): the discard pile and Pass go in a column right of the trays instead
function matTraysHTML(deck, row, extra, side){
  const disc = `<div class="osdisc">${musterPileHTML()}</div>`;
  return `<div class="osmid"><div class="mktp osmkt">${extra[0] || ''}
      <div class="ostray" data-k="u">${deck('u')}<div class="msec" data-k="u"><span class="oslbl">Units</span><div class="market">${row('u', 'du')}</div></div></div>
      ${side ? '' : disc}
      <div class="ostray" data-k="b">${deck('b')}<div class="msec" data-k="b"><span class="oslbl">Support &amp; gear</span><div class="market">${row('b', 'db')}</div></div></div>
      ${extra[1] || ''}
    </div>${side ? `<div class="osright">${disc}${side}</div>` : ''}</div>`;
}
function matShopHTML(){
  const S = seat();
  // desktop: both rows and the trays on one tilted mat, the discard and Pass on the right, no bottom bar
  if (matDesk()) return `<div class="osshop osdesk"><div class="osplane"><div class="osinner">
    ${matSeatHTML(1 - S)}
    ${matTraysHTML(k => deckPileHTML(k, false, true), marketRow, [writBarHTML(), frozenHTML(S)], `<div class="dbtns ospass">${shopActsHTML()}</div>`)}
    ${matSeatHTML(S)}
  </div></div></div>
  ${mirTrayHTML()}${mirModalHTML()}`;
  return `${matSeatHTML(1 - S)}${matSeatHTML(S)}<div class="osshop"><div class="osplane"><div class="osinner">
    ${matTraysHTML(k => deckPileHTML(k, false, true), marketRow, [writBarHTML(), frozenHTML(S)])}
  </div></div></div>
  ${mirTrayHTML()}${mirModalHTML()}`;
}
// the bottom bar on the mat: your purse, buys left, then Miracles and Pass (the same buttons the phone shop bar uses)
function matDockHTML(mine, mirBtn, acts){
  if (matDesk()) return '';   // desktop: no bottom bar (the water, buys left and Miracles are on your row, Pass by the discard)
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
  if (el.closest('.osplane')){ const pose = matPoseOf(el); return pose && {...pose, crop:compact()}; }
  if (el.closest('.osdeskmob')) return matPoseOf(el);
  return {r:el.getBoundingClientRect(), tilt:0, crop:compact() && !el.closest('#mz-deck')};
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
   Both ends on the mat (tilt 1 and 1): the card slides across the mat in its tilt all the way (the sweep, a card dealt back).
   An end may also be turned: rot, in degrees about the card's centre (a card in a fan, matFanPoses); the turn eases
   from one end's to the other's. The box b must then have its height. */
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
    let m = new DOMMatrix().translate(-b.left, -b.top).multiply(matTiltMatrix(a, q)).translate(x, y).scale(w / b.width);
    if (A.rot || B.rot){ const r = (A.rot || 0) + ((B.rot || 0) - (A.rot || 0)) * sm(u); m = m.translate(b.width / 2, b.height / 2).rotate(r).translate(-b.width / 2, -b.height / 2); }
    out.push({transform:m.toString()});
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
  if (!compact()) return {anims:[], done:() => {}};   // desktop mat: full cards, nothing to crop (a card just unflattens)
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
function matShopInspectSide(card, pk, miracles){
  const side = document.createElement('aside'); side.className = 'osinspect-side';
  const close = document.createElement('button'); close.className = 'osinspect-close'; close.type = 'button';
  close.setAttribute('aria-label', 'Close card'); close.textContent = '×';
  const head = document.createElement('div'); head.className = 'osinspect-head';
  const title = document.createElement('h2'); title.id = 'osinspect-title';
  const name = card.querySelector('.cfm')?.dataset.n;
  title.textContent = name ? dispName(name) : card.querySelector('.nm')?.textContent.trim() || 'Card';
  head.append(title, close); side.append(head);
  const actions = document.createElement('div'); actions.className = 'osinspect-actions';
  actions.append(...pk.querySelectorAll(':scope > button'));
  if (actions.childElementCount) side.append(actions);
  for (const notes of [pk.querySelector(':scope > .stamps'), pk.querySelector(':scope > .kwgloss'), miracles]) if (notes) side.append(notes);
  return {side, close};
}
function matLiftOpen(card, pk, wrap){
  const desktopShop = !!matDeskShopCard(card), desktopMob = !!card.closest('.osdeskmob');
  const hovered = desktopMob && MATHOV.card === card.closest('.mzc') && MATHOV.g;
  const from = hovered ? {r:hovered.getBoundingClientRect(), tilt:0} : matLiftFrom(card);
  if (desktopMob) matHoverEnd(true);
  wrap.classList.add('osliftwrap');
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
  const col = document.createElement('div'); col.className = 'oslift';
  const mw = card.parentElement && card.parentElement.classList.contains('mirwrap') ? card.parentElement.querySelector('.mirhover') : null;
  const miracles = mw && mw.cloneNode(true);
  if (miracles){ try{ kwDecorate(miracles); }catch(e){} miracles.className = 'sheetmir osliftmir'; miracles.removeAttribute('aria-hidden'); }
  pk.removeAttribute('aria-hidden');
  pk.querySelectorAll('button[aria-label]').forEach(b => { if (b.textContent.trim().length <= 2) b.textContent = b.getAttribute('aria-label'); });
  if (miracles && !desktopShop) col.append(miracles);
  col.appendChild(pk); const F = matFlyBox(pk);
  const inspect = desktopShop && matShopInspectSide(card, pk, miracles);
  if (inspect){
    wrap.classList.add('osshopinspect'); wrap.setAttribute('aria-labelledby', 'osinspect-title');
    col.append(inspect.side);
  }
  wrap.appendChild(col); document.body.appendChild(wrap);
  document.documentElement.classList.add('sheet-open');
  MATLIFT.src = card; MATLIFT.ck = card.dataset.ck || null; MATLIFT.held = null;
  const fr = from, r = fr && fr.r;
  card.classList.add('peeked', 'oslifted');
  peekEl = wrap; peekReady = false;
  setTimeout(() => { if (peekEl === wrap) peekReady = true; }, 0);
  wirePeek(card, wrap);
  if (inspect){
    wrap._cardFocus = card.matches('[tabindex]') ? card : card.closest('button');
    inspect.close.focus({preventScroll:true});
    wrap.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const controls = [...col.querySelectorAll('button:not(:disabled)')], first = controls[0], last = controls.at(-1);
      if (e.shiftKey && e.target === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && e.target === last){ e.preventDefault(); first.focus(); }
    });
  } else wrap.addEventListener('click', e => { if (peekReady && peekEl === wrap && !e.target.closest('button')) closePeek(); });   // tap anywhere, the card too
  sfx.pick(); if (navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
  if (reduceMotion() || !r || !r.width) return;
  const duration = desktopShop ? 230 : desktopMob ? 300 : 650;
  const b = F.getBoundingClientRect(), kf = matArc(b, fr, {r:b, tilt:0}, {arc:desktopShop ? 14 : hovered ? 0 : desktopMob ? 24 : 50, bump:desktopShop || desktopMob ? 0 : .06});
  if (!kf) return;
  const opening = F.animate(kf, {duration, easing:MAT_EASE, fill:'both'});
  if (desktopShop) F._inspectOpen = opening;
  if (fr.crop){ const cr = matCrop(pk, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration:650, easing:'ease-in-out', fill:'forwards'});   // then no clip: the card's own corners
    if (cr.anims[0]) cr.anims[0].onfinish = cr.done; }
  wrap.animate([{backgroundColor:'rgba(12,8,5,0)'}, {backgroundColor:getComputedStyle(wrap).backgroundColor}], {duration:desktopShop ? 155 : desktopMob ? 200 : 450, easing:'ease-out'});
  const extra = inspect ? [inspect.side] : [...pk.querySelectorAll(':scope > button, :scope > .kwgloss, :scope > .stamps'), ...col.querySelectorAll('.osliftmir')];
  extra.forEach(e => e.animate([{opacity:0, transform:'translateY(8px)'}, {opacity:1, transform:'none'}], {duration:desktopShop ? 140 : desktopMob ? 150 : 260, delay:desktopShop ? 55 : desktopMob ? 130 : 450, easing:'ease-out', fill:'backwards'}));
}
// closePeek's step for a lifted mat card. after: a button was pressed, so the card stays up for the move's flight.
function matLiftClose(w, now, after){
  const pk = w.querySelector('.mcard.peek');
  if (after && !now && pk){ matLiftHold(w, pk); after(); matLiftUnheld(); return; }
  const src = matLiftSrc(), fr = matLiftFrom(src), r = fr && fr.r;
  const owner = MATLIFT.src, desktopShop = w.classList.contains('osshopinspect');
  const done = () => {
    w.remove();
    if (MATLIFT.src === owner){
      matLiftShow();
      if (!now) w._cardFocus?.focus({preventScroll:true});
    } else if (src && src !== MATLIFT.src) src.classList.remove('oslifted');
    if (after) after();
  };
  if (now || reduceMotion() || !pk || !r || !r.width){ done(); return; }
  w.style.pointerEvents = 'none';
  const F = matFlyBox(pk);
  const desktopMob = !!src?.closest('.osdeskmob');
  const from = desktopMob ? F.getBoundingClientRect() : null;
  const duration = desktopShop ? 190 : desktopMob ? 230 : 520;
  const opening = desktopShop && F._inspectOpen;
  if (opening && opening.playState === 'running'){
    // A quick dismissal reverses the actual lift, including whatever turn it had reached.
    opening.reverse();
    opening.onfinish = opening.oncancel = done;
    matInspectFadeOut(w, duration);
    return;
  }
  F.getAnimations().forEach(a => a.cancel()); pk.getAnimations({subtree:true}).forEach(a => a.cancel()); pk.style.clipPath = '';
  const b = F.getBoundingClientRect(), kf = matArc(b, {r:from || b, tilt:0}, fr, {arc:desktopShop ? 12 : desktopMob ? 18 : 50, bump:desktopShop || desktopMob ? 0 : .06});
  if (!kf){ done(); return; }
  const a = F.animate(kf, {duration, easing:MAT_EASE, fill:'forwards'});
  if (fr.crop) matCrop(pk, [[0, 'open'], [.7, 'crop'], [1, 'crop']], {duration:520, easing:'ease-in-out', fill:'forwards'});
  if (desktopShop) matInspectFadeOut(w, duration);
  else {
    w.animate([{backgroundColor:getComputedStyle(w).backgroundColor}, {backgroundColor:'rgba(12,8,5,0)'}], {duration, fill:'forwards'});
    [...pk.querySelectorAll(':scope > button, :scope > .kwgloss, :scope > .stamps'), ...w.querySelectorAll('.osliftmir')]
      .forEach(e => e.animate([{opacity:1}, {opacity:0}], {duration:160, fill:'forwards'}));
  }
  a.onfinish = a.oncancel = done;
}
function matInspectFadeOut(w, duration){
  const side = w.querySelector('.osinspect-side'), bg = getComputedStyle(w).backgroundColor, opacity = getComputedStyle(side).opacity;
  for (const el of [w, side]) el.getAnimations().forEach(a => a.cancel());
  w.animate([{backgroundColor:bg}, {backgroundColor:'transparent'}], {duration, fill:'forwards'});
  side.animate([{opacity}, {opacity:0}], {duration:Math.min(120, duration), fill:'forwards'});
}
// Buy or Sell was pressed: the card (face only) stays where it is, above the page, and the pop-up fades from under it
function matLiftHold(w, pk){
  const F = matFlyBox(pk);
  const desktopShop = w.classList.contains('osshopinspect');
  const opening = desktopShop && F._inspectOpen;
  const inFlight = opening?.playState === 'running';
  const transform = inFlight && getComputedStyle(F).transform;
  F.getAnimations().forEach(a => a.cancel()); pk.getAnimations({subtree:true}).forEach(a => a.cancel()); pk.style.clipPath = '';
  pk.querySelectorAll('button, .kwgloss, .stamps, .pkdrag').forEach(x => x.remove());
  const b = pk.getBoundingClientRect();
  pk.classList.add('osheld'); pk.setAttribute('aria-hidden', 'true');
  if (desktopShop) F.classList.add('osshopheld');
  F.style.cssText = `position:fixed;left:${b.left}px;top:${b.top}px;width:${b.width}px;margin:0;z-index:${LAYER.cardPop + 1};pointer-events:none`;   // above the fading pop-up
  document.body.appendChild(F);
  if (inFlight) F._shopLift = F.animate([{transform}, {transform:'none'}], {duration:110, easing:MAT_EASE});
  MATLIFT.held = {g:F};
  w.style.pointerEvents = 'none';
  if (reduceMotion()){ w.remove(); return; }
  w.animate([{opacity:1}, {opacity:0}], {duration:desktopShop ? 160 : 300, fill:'forwards'}).onfinish = () => w.remove();
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
  if (g._shopLift && (g._shopLift.pending || g._shopLift.playState === 'running')){
    const land = () => matLand(g, o.find?.() || to, o);
    g._shopLift.finished.then(land, land);
    return;
  }
  const L = {find:o.find || null, to};
  const spot = () => { const t = L.find ? L.find() : null; return t && t.isConnected ? t : L.to; };
  const fin = () => { MATLANDS.delete(L); g.remove(); const t = spot(); if (t) t.style.visibility = ''; if (L.to && L.to !== t) L.to.style.visibility = ''; if (o.done) o.done(); return t; };
  const sp = matPoseOf(to), r = sp && sp.r;
  if (!r || !r.width || reduceMotion()){ fin(); return; }
  to.style.visibility = 'hidden';
  g.getAnimations({subtree:true}).forEach(a => a.cancel());
  const s = o.s || 1, bb = g.getBoundingClientRect(), b = {left:bb.left, top:bb.top, width:bb.width / s, height:bb.height / s};
  const shop = !!to.closest('#view-play .osdesk:not(.osmobmat)');
  const kf = matArc(b, {r:{left:b.left, top:b.top, width:b.width * s}, tilt:0}, sp, {arc:o.arc ?? (shop ? 36 : 60)});
  if (!kf){ fin(); return; }
  MATLANDS.add(L);
  const dur = o.dur || (shop ? 560 : 850);
  const flight = g.animate(kf, {duration:dur, easing:MAT_EASE, fill:'forwards'});
  flight.oncancel = fin;
  flight.onfinish = () => {
    const t = fin();
    if (!t?.isConnected) return;
    if (sp.rot) t.animate([{scale:1}, {scale:1.035, offset:.32}, {scale:1}], {duration:190, easing:'ease-out'});
    else bumpEl(t);
  };
  const pk = g.classList.contains('osfly') && g.firstElementChild;   // a market card copy is already cut to the crop
  if (pk && !shop) matCrop(pk, [[0, 'open'], [.7, 'crop'], [1, 'crop']], {duration:dur, easing:'ease-in-out', fill:'forwards'});
}
const MATDEALS = new Map();
function matMarkDeal(el){
  el.inert = true;
  el.classList.add('osarriving');
}
// Tie reveal and interactivity to the flight. Keep the slot covered when a draw replaces its card node.
function matTrackDeal(el, flyer, flight){
  const key = el.dataset.ck;
  if (!key || !el.matches('#view-play .osdesk:not(.osmobmat) .osmkt .market > .mcard')) return false;
  const deal = {el, flight, finish:null};
  MATDEALS.set(key, deal);
  matMarkDeal(el);
  const finish = () => {
    flyer.remove();
    if (MATDEALS.get(key) !== deal) return;
    MATDEALS.delete(key);
    deal.el.inert = false;
    deal.el.classList.remove('osarriving');
  };
  deal.finish = flight.onfinish = flight.oncancel = finish;
  return true;
}
// renderPlay step: spots that cards in flight are landing on stay hidden in the redrawn mat
function matLandAfterDraw(){
  for (const L of MATLANDS){ const t = L.find && L.find(); if (t && t.isConnected){ t.style.visibility = 'hidden'; L.to = t; } }
  for (const [key, deal] of MATDEALS){
    const el = document.querySelector(`#view-play .osdesk:not(.osmobmat) .osmkt .market > .mcard[data-ck="${CSS.escape(key)}"]`);
    if (el){ deal.el = el; matMarkDeal(el); }
    else deal.flight.cancel();
  }
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
  const bought = me.querySelector('.osbought .ostop');   // desktop: units and gear land on the "Bought this shop" pile
  if (k === 'u') return bought || me.querySelector('.ospile .ostop');
  const named = sel => [...me.querySelectorAll(sel)].filter(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === n; }).pop();
  return named('.oshand') || named('.oscar') || (BDEFS[n] && BDEFS[n].gear ? bought : null) || null;
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

/* ---------- the desktop mat: hover to read, drag to buy and sell (Oasis desktop shop brief, stage 2) ----------
   Hover: rest on any card on the desktop mat for MAT_HOVER_DELAY and a flat copy rises out of the tilt to
   MAT_HOVER_SCALE times its size (matArc, MAT_HOVER_GROW), kept on screen; moving off shrinks it back. No buttons, no dim.
   Drag: press a market card (or one of yours: Caravan, deck or bought pile) and move it MAT_DRAG_PX; a flat copy follows
   the cursor. A market card you can buy lights your row: let go in it and the card's own Buy button is pressed, so the
   usual buy path, its picks (Mason's Guild, Discard Writ) and the landing run (matBuyFlight takes the copy from
   MATLIFT.held). Your own card lights the discard: let go there and its Sell button is pressed (matSellFlight). When it
   can't go, the reason shows under the cursor and nothing lights. Let go anywhere else, or press Esc: it flies back
   (matLiftUnheld). The phone keeps tap to lift. (The Mobilize drag, js/ui/10-mobilize.js, reorders a list in place;
   this one carries a card to a target and hands it to the buy and sell flights.) */
const MAT_HOVER_DELAY = 100, MAT_HOVER_GROW = 150, MAT_HOVER_SCALE = 1.8, MAT_DRAG_PX = 6, MAT_DRAG_LIFT = 120;
const MATHOV = {card:null, pend:null, t:0, g:null};
const MATDRAG = {p:null, eat:false};
// Shop cards are selected in place. The enlarged hover is only used for the Mobilize cascade and bench.
const MAT_INSPECT_CARDS = '.osmkt .mcard, .osseat .mcard.oscar, .osseat .mcard.ostop';
const matShopCardCanInspect = card => !card.matches('.writtgt, .writoff, .masonpick, .writsrc');
function matDeskShopCard(el){
  if (!el?.closest || !matDesk() || !matShopOn()) return null;
  const card = el.closest('.osinspectable');
  return card && !card.inert && card.closest('#view-play .osdesk:not(.osmobmat)') && matShopCardCanInspect(card) ? card : null;
}
function matShopInspectCards(shop){
  if (!matShopOn() || shop.classList.contains('osmobmat')) return;
  for (const card of shop.querySelectorAll(MAT_INSPECT_CARDS)){
    if (!matShopCardCanInspect(card)) continue;
    card.classList.add('osinspectable');
    if (card.closest('button')) continue;   // the deck's button still opens the whole pile with the keyboard
    const name = card.querySelector('.cfm')?.dataset.n;
    card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', name ? `Inspect ${dispName(name)}` : 'Inspect card');
  }
}
const matMzDragging = () => typeof mzP !== 'undefined' && !!mzP && !!mzP.drag;
function matHoverEnd(now){
  clearTimeout(MATHOV.t); MATHOV.t = 0; MATHOV.pend = null;
  const {g, card} = MATHOV; MATHOV.g = null; MATHOV.card = null;
  if (!g) return;
  const done = () => { g.remove(); if (card && card !== MATHOV.card) card.classList.remove('oshover'); };
  if (now || reduceMotion() || !g._kf){ done(); return; }
  const frames = [{transform:getComputedStyle(g).transform}, g._kf[0]];
  g.getAnimations().forEach(a => a.cancel());
  const a = g.animate(frames, {duration:MAT_HOVER_GROW * .8, easing:MAT_EASE, fill:'forwards'});
  a.onfinish = a.oncancel = done;
}
function matHoverStart(card){
  if (MATDRAG.p || matMzDragging() || !card.isConnected || !matDesk() || card.inert) return;
  if (!card.closest('.osdeskmob') || !mzActive()) return;
  const from = matPoseOf(card), sr = card.getBoundingClientRect(); if (!from) return;   // where it rests: on the mat, in the fan, or flat
  const fr = from.r, w = fr.width * MAT_HOVER_SCALE, h = (fr.height || fr.width * 1.3827) * MAT_HOVER_SCALE;
  const top = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gtb')) || 0) + 8;   // near an edge it grows inwards
  const x = Math.max(8, Math.min(innerWidth - 8 - w, sr.left + sr.width / 2 - w / 2));
  const y = Math.max(top, Math.min(innerHeight - 8 - h, sr.top + sr.height / 2 - h / 2));
  const face = card.querySelector(':scope > .mzface') || card;   // Mobilize: the card itself, not its tokens and numbers
  const {g, ctx} = flyer(face, face.classList.contains('u') ? 'u' : 'b');
  // (a Mobilize card's copy is styled from the Mobilize box, not its own card: the copy's styling shells take their
  // ancestors' attributes, and a second element with the card's data-key would confuse Mobilize's slides)
  flyEl(g, {left:x, top:y}, w, h, LAYER.cardPop, face === card ? ctx : card.closest('.osmz') || ctx); g.style.overflow = ''; g.classList.add('oshov');
  card.classList.add('oshover'); MATHOV.g = g; MATHOV.card = card;
  if (reduceMotion()) return;
  const b = g.getBoundingClientRect(), kf = matArc(b, from, {r:b, tilt:0}, {arc:0});
  if (kf){ g._kf = kf; g.animate(kf, {duration:MAT_HOVER_GROW, easing:MAT_EASE, fill:'both'}); }
}
document.addEventListener('mouseover', e => {
  if (matMzDragging()){ if (MATHOV.card || MATHOV.t) matHoverEnd(true); return; }   // hover stays off while a card is dragged
  if (MATDRAG.p && MATDRAG.p.drag) return;
  const c = e.target.closest?.('#view-play .osdeskmob .mzc:not(.mzslot)');
  if (c && (c === MATHOV.card || c === MATHOV.pend)) return;
  if (MATHOV.card || MATHOV.t) matHoverEnd();
  if (!c) return;
  MATHOV.pend = c;
  MATHOV.t = setTimeout(() => { MATHOV.t = 0; MATHOV.pend = null; if (c.matches(':hover')) matHoverStart(c); }, MAT_HOVER_DELAY);   // a sweep across the board sets nothing off
});
document.addEventListener('mouseout', e => { if (!e.relatedTarget && (MATHOV.card || MATHOV.t)) matHoverEnd(); });
// what dragging this card can do: a market card is bought with its Buy button, your own card sold with its Sell button
function matDragWhat(card){
  const S = seat(), turn = G.passed[S] ? 'You passed' : cur(G) !== S ? 'Not your turn' : '';
  if (card.closest('.osmkt')){
    const buy = card.querySelector(':scope > button[data-act="buy"]'); if (!buy) return null;
    return {buy, ok:!buy.disabled, why:buy.disabled ? turn || buy.textContent.trim() : ''};
  }
  if (!card.closest('.osseat.me') || !card.matches('.oscar, .ostop')) return null;
  const sell = card.querySelector(':scope > [data-act^="sell-"]'), why = turn || (sell ? '' : "Can't be sold");
  return {sell, ok:!why, why};
}
function matDragStart(p, e){
  const card = p.card, from = matPoseOf(card);
  if (!from) return;
  p.drag = true; MATDRAG.eat = true; matHoverEnd(true);
  const r = from.r, point = matGrabPoint(from, p.x0, p.y0);
  p.left = p.x0 - point.x; p.top = p.y0 - point.y;
  const {g, ctx} = flyer(card, card.classList.contains('u') ? 'u' : 'b');
  flyEl(g, {left:p.left, top:p.top}, r.width, r.height, LAYER.cardPop, ctx);
  g.style.overflow = ''; g.style.transformOrigin = '0 0'; g.classList.add('osdrag');
  p.g = g; MATLIFT.src = card; MATLIFT.ck = card.dataset.ck || null; MATLIFT.held = null; card.classList.add('oslifted');
  document.body.classList.add('osdragging');
  p.target = p.w.ok ? document.querySelector(p.w.buy ? '#view-play .osdesk .osseat.me' : '#view-play .osdesk .osdisc') : null;
  if (p.target) p.target.classList.add('osdrop');
  if (!p.w.ok && p.w.why){ p.tag = document.createElement('div'); p.tag.className = 'osdragwhy'; p.tag.textContent = p.w.why; p.tag.style.zIndex = LAYER.cardPop + 1; document.body.appendChild(p.tag); }
  sfx.pick();
  if (!reduceMotion()){
    const b = g.getBoundingClientRect(), kf = matArc(b, from, {r:b, tilt:0}, {arc:0});
    if (kf) g._shopLift = g.animate(kf, {duration:MAT_DRAG_LIFT, easing:MAT_EASE});
  }
  matDragMove(p, e);
  return true;
}
// Unproject the mouse onto the plane, then undo the card's turn to find the point on its face.
function matGrabPoint(pose, x, y){
  const m = pose.tilt && matTiltMatrix(), r = pose.r;
  if (m){
    const a = m.m11 - x * m.m14, b = m.m21 - x * m.m24, c = x * m.m44 - m.m41;
    const d = m.m12 - y * m.m14, e = m.m22 - y * m.m24, f = y * m.m44 - m.m42;
    const det = a * e - b * d;
    if (Math.abs(det) > 1e-6){ x = (c * e - b * f) / det; y = (a * f - c * d) / det; }
  }
  const w = r.width / 2, h = r.height / 2, p = new DOMPoint(x - r.left - w, y - r.top - h)
    .matrixTransform(new DOMMatrix().rotate(-(pose.rot || 0)));
  return {x:p.x + w, y:p.y + h};
}
function matDragOver(p, e){
  if (!p.target || !p.target.isConnected) return false;
  const r = p.target.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
}
function matDragMove(p, e){
  p.x = e.clientX; p.y = e.clientY;
  if (!p.frame) p.frame = requestAnimationFrame(() => matDragPaint(p));
}
function matDragPaint(p){
  p.frame = 0;
  if (p !== MATDRAG.p) return;
  if (!p.card.isConnected){ const c = matDragFind(p); if (c){ p.card = c; MATLIFT.src = c; c.classList.add('oslifted'); } }   // redrawn: keep its spot empty
  const over = matDragOver(p, {clientX:p.x, clientY:p.y});
  p.g.style.translate = `${p.x - p.x0}px ${p.y - p.y0}px`;
  if (p.tag) p.tag.style.translate = `${p.x + 14}px ${p.y + 20}px`;
  if (p.target) p.target.classList.toggle('osover', over);
}
// the dragged card as it is on the page now: a redraw (a toast, a timer) may have replaced its element since the press
function matDragFind(p){
  if (p.card.isConnected) return p.card;
  if (p.ck) return ckEl(p.ck);
  const me = document.querySelector('#view-play .osdesk .osseat.me'); if (!me || !p.name) return null;
  return [...me.querySelectorAll(p.sel)].find(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === p.name; }) || null;
}
// let go: on its target the card's own button makes the move (its flight takes the copy); else the copy flies home
function matDragDrop(p, ok){
  if (p.frame) cancelAnimationFrame(p.frame);
  MATDRAG.p = null; document.body.classList.remove('osdragging');
  if (p.tag) p.tag.remove();
  if (p.target) p.target.classList.remove('osdrop', 'osover');
  if (!p.g) return;
  p.g.style.setProperty('left', (p.left + p.x - p.x0) + 'px', 'important');
  p.g.style.setProperty('top', (p.top + p.y - p.y0) + 'px', 'important');
  p.g.style.translate = '';
  MATLIFT.held = {g:p.g};
  const c = matDragFind(p), w = c && matDragWhat(c);
  if (c && c !== p.card){ MATLIFT.src = c; c.classList.add('oslifted'); }
  if (ok && w && w.ok && G && G.phase === 'shop'){ const b = w.buy || w.sell; MATDRAG.eat = false; b.click(); MATDRAG.eat = true; }
  matLiftUnheld();   // nothing took it (refused, or a pick to make first): back to its spot
}
$('view-play').addEventListener('pointerdown', e => {
  if (e.button > 0 || MATDRAG.p) return;
  const card = matDeskShopCard(e.target); if (!card || e.target.closest('.ostag, .osright button')) return;
  const w = matDragWhat(card); if (!w) return;
  const f = card.querySelector('.cfm');
  MATDRAG.p = {card, w, pid:e.pointerId, x0:e.clientX, y0:e.clientY, drag:false, ck:card.dataset.ck || null, name:f ? f.dataset.n : null,
    sel:card.classList.contains('oscar') ? '.oscar' : card.closest('.osbought') ? '.osbought .ostop' : '.osdeck .ostop'};
});
window.addEventListener('pointermove', e => {
  const p = MATDRAG.p; if (!p || e.pointerId !== p.pid) return;
  if (!p.drag){
    if (Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < MAT_DRAG_PX) return;   // under it: a plain click (it does nothing)
    const c = matDesk() && matDragFind(p), w = c && matDragWhat(c);
    if (!w || c.inert){ MATDRAG.p = null; return; }
    p.card = c; p.w = w;
    if (!matDragStart(p, e)){ MATDRAG.p = null; return; }
  }
  e.preventDefault(); matDragMove(p, e);
}, {passive:false});
window.addEventListener('pointerup', e => {
  const p = MATDRAG.p; if (!p || e.pointerId !== p.pid) return;
  if (!p.drag){ MATDRAG.p = null; return; }
  p.x = e.clientX; p.y = e.clientY;
  matDragDrop(p, matDragOver(p, e)); setTimeout(() => { MATDRAG.eat = false; }, 0);
});
window.addEventListener('pointercancel', () => { const p = MATDRAG.p; if (p && p.drag) matDragDrop(p, false); else MATDRAG.p = null; MATDRAG.eat = false; });
document.addEventListener('keydown', e => { const p = MATDRAG.p; if (e.key === 'Escape' && p && p.drag){ e.stopImmediatePropagation(); matDragDrop(p, false); MATDRAG.eat = false; } }, true);
window.addEventListener('click', e => { if (MATDRAG.eat){ MATDRAG.eat = false; e.stopPropagation(); e.preventDefault(); } }, true);   // the click that ends a drag
$('view-play').addEventListener('dragstart', e => { if (matDeskShopCard(e.target)) e.preventDefault(); });

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
  for (const s of m.values()) if (s.el && plane.contains(s.el)){
    const pose = matTablePose(s.el, s.el.getBoundingClientRect());
    s.fr = pose.r; s.rot = pose.rot;
  }
  // the seats: the phone's bars are flat on the screen (flat:true: a flight from there starts out of the tilt); the
  // desktop rows lie on the mat, measured here with the tilt off like the market
  const S = seat();
  for (const st of document.querySelectorAll('#view-play .osseat')){
    const i = st.classList.contains('me') ? S : 1 - S, flat = !plane.contains(st);
    for (const el of st.querySelectorAll('.oscar, .oshand')){ const f = el.querySelector('.cfm'); if (f && f.dataset.n) m.set(`os:${i}:${f.dataset.n}`, {el:null, r:null, fr:el.getBoundingClientRect(), n:f.dataset.n, flat}); }
    const top = st.querySelector('.osbought .ostop') || st.querySelector('.ospile .ostop') || st.querySelector('.ospile');
    if (top) m.set(`os:${i}:pile`, {el:null, r:null, fr:top.getBoundingClientRect(), flat});
  }
  plane.style.transform = t;
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
  g.style.transform = s.rot ? pose + ' ' + matRotTf(s.rot, s.fr.width, s.fr.height) : pose;
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
  document.querySelectorAll('#view-play .osseat .mcard[style*="visibility"]').forEach(e => { if (!e.getAnimations().length) e.style.visibility = ''; });
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
function matOppRise(c, fr, flat, rot = 0){
  const {g, s, at, W, h} = c, b = {left:at.left, top:at.top, width:W, height:h};
  if (reduceMotion()) return Promise.resolve();
  if (!fr || !fr.width){
    return g.animate([{opacity:0, transform:`scale(${s * .9})`}, {opacity:1, transform:`scale(${s})`}], {duration:260, easing:'ease-out'}).finished.catch(() => {});
  }
  const desk = matDesk(), duration = desk ? 340 : MAT_OPP_RISE;
  const kf = matArc(b, {r:fr, tilt:flat ? 0 : 1, rot}, {r:at, tilt:0}, {arc:30, bump:.04});
  if (!kf) return Promise.resolve();
  const cr = desk ? null : matCrop(g.firstElementChild, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration, easing:'ease-in-out', fill:'forwards'});
  const a = g.animate(kf, {duration, easing:MAT_EASE, fill:'backwards'});
  return a.finished.then(() => cr?.done(), () => cr?.done());
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
  return matOppRise(c, src && src.fr ? fr : null, false, src?.rot)
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
const MAT_SWEEP = 700, MAT_SWEEP_GAP = 95, MAT_MOB_LIFT = 1250, MAT_MERGE = 300;
// every phone Mobilize is this one (Brian, Nov 24: the old Mobilize screen is gone on phones, rug switch or not; desktop
// too behind localStorage.oasisMatDesk, matWidthOn in js/rug.js);
// the pass-and-play hand-over and the online "Deck locked in" panels come before it, as before. Desktop keeps its own.
function matMobOn(){
  return !!G && G.phase === 'mobilize' && !ui.battle && !G.over && !ui.start && !ui.roll && matWidthOn()
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
  if (matDesk()) return matMobDeskHTML(S, me, d, rows, items, who);
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
/* ===================== DESKTOP MOBILIZE ON THE MAT (stage 3; mock-up "Mobilize B", #artboard-MobUpright) =====================
   The mat stays as the shop left it, under a dim over the whole screen below the top bar. Over it: your deck as the
   upright cascade (the phone's shape: card 1 in full at the bottom, the cards behind showing their name strips), and
   beside it the bench, fanned out like a hand (Brian, Nov 25) so more items fit. The AI's deck waits face down near the
   top edge; Suggest and Lock in stand where Pass was. Mobilize's own controller (js/ui/10-mobilize.js) does the dragging.

   SHAPES, kept in one place each so they can change without breaking any motion:
   - the bench fan: MAT_FAN and matFanPoses. Every bench card's resting place (matDeskMobLayout), its flight in from the
     mat (matMobLiftDesk), its slide when the bench changes (matFanFlip), its flight back after a refused drop and the
     hover read (matPoseOf) all ask matFanPoses; nothing else knows the shape. A pose is a card's untilted box (x, y from
     the fan's top left) and its turn about its centre (rot, degrees); matArc flies to and from turned cards.
   - the cascade: --mzsr (each card's name strip, as a share of its width) on #mz-deck in css/12-mat-shop.css; the
     drag reads the same value (mzStripR in js/ui/10-mobilize.js), and every flight measures where the cards lie. */
const MAT_FAN = {gap:.46, span:4.2, step:6, drop:.03};   // gap: card widths between cards; span: widest fan, in card widths; step: degrees per card; drop: the arc
const MAT_AIDECK_ROT = -5;
const MATFAN = {cur:new Map(), prev:new Map()};   // each bench card's turn (by data-key) now and at the last layout, for matFanFlip
function matFanPoses(n, w, h){
  const F = MAT_FAN, mid = (n - 1) / 2, gap = n > 1 ? Math.min(F.gap, (F.span - 1) / (n - 1)) * w : 0;
  const P = Array.from({length:n}, (_, i) => { const d = i - mid; return {x:d * gap, y:F.drop * d * d * w, rot:d * F.step}; });
  // the box round them all, turns included; poses are measured from its top left
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of P){
    const a = p.rot * Math.PI / 180, c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)), hw = (w * c + h * s) / 2, hh = (w * s + h * c) / 2, cx = p.x + w / 2, cy = p.y + h / 2;
    x0 = Math.min(x0, cx - hw); x1 = Math.max(x1, cx + hw); y0 = Math.min(y0, cy - hh); y1 = Math.max(y1, cy + hh);
  }
  for (const p of P){ p.x -= x0; p.y -= y0; }
  return {poses:P, w:n ? x1 - x0 : 0, h:n ? y1 - y0 : 0};
}
// the transforms (origin top left) that turn a w x h box about its centre, and put a fan card in its pose
const matRotTf = (rot, w, h) => `translate(${w / 2}px, ${h / 2}px) rotate(${rot}deg) translate(${-w / 2}px, ${-h / 2}px)`;
const matFanTf = (p, w, h) => `translate(${p.x}px, ${p.y}px) ${matRotTf(p.rot, w, h)}`;
// where a card rests, for a flight or the hover read: on the mat its flat rect in the tilt; in the fan its pose; else its box
function matPoseOf(el){
  if (!el || !el.isConnected) return null;
  if (el.closest('.osplane')){
    const r = matFlatRect(el); if (!r || !r.width) return null;
    return matTablePose(el, r);
  }
  const slot = el.closest('.osfanslot'), p = slot && slot._pose;
  if (p){ const f = slot.parentElement.getBoundingClientRect(), c = slot.firstElementChild || el;
    return {r:{left:f.left + p.x, top:f.top + p.y, width:c.offsetWidth, height:c.offsetHeight}, tilt:0, rot:p.rot}; }
  const r = el.getBoundingClientRect(); return r.width ? {r, tilt:0, rot:0} : null;
}
function matTablePose(el, r){
  const sideways = el.matches('#view-play .osdesk .osmkt .market > .mcard.leaving, #view-play .osdesk .osdisc .mpcards');
  if (!sideways) return {r, tilt:1, rot:0};
  return {r:{left:r.left + (r.width - r.height) / 2, top:r.top + (r.height - r.width) / 2, width:r.height, height:r.width}, tilt:1, rot:90};
}
// a bench card slides from where it was (r0, a screen box, e.g. where it was dropped) to its pose, turning as it goes
function matFanFlip(el, r0, land){
  const slot = el.closest('.osfanslot'), p = slot && slot._pose; if (!p || !r0 || reduceMotion()) return;
  const w = el.offsetWidth, h = el.offsetHeight, f = slot.parentElement.getBoundingClientRect();
  if (land && r0.rot != null && w && h){
    const from = `translate(${r0.left - f.left}px,${r0.top - f.top}px) rotate(${r0.rot}deg) scale(${r0.width / w},${r0.height / h})`;
    slot.animate([{transform:from}, {transform:matFanTf(p, w, h)}], {duration:190, easing:SLIDE});
    return;
  }
  const dx = r0.left + r0.width / 2 - (f.left + p.x + w / 2), dy = r0.top + r0.height / 2 - (f.top + p.y + h / 2);
  const rot0 = land ? 0 : MATFAN.prev.has(el.dataset.key) ? MATFAN.prev.get(el.dataset.key) : p.rot;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && rot0 === p.rot) return;
  slot.animate([{transform:`translate(${dx}px, ${dy}px) ${matFanTf({...p, rot:rot0}, w, h)}`}, {transform:`translate(0px, 0px) ${matFanTf(p, w, h)}`}], {duration:land ? 180 : MZ_MS, easing:SLIDE});
}
function matMobDeskHTML(S, me, d, rows, items, who){
  const bench = items.map((it, i) => `<div class="osfanslot" style="z-index:${i + 1}">${mzBenchCard(it)}</div>`).join('');
  const ai = !PP() && !G.net ? 'AI planning its deck…' : `${esc(nm(1 - S))}'s deck`;
  return `<div class="osshop osdesk osmobmat${MATMOB.lift ? ' oslifting' : ''}" aria-hidden="true"><div class="osplane"><div class="osinner">
    ${matSeatHTML(1 - S, 'mob')}
    ${matTraysHTML(matSweptDeck, matMobRow, ['', frozenHTML(S)], '<div class="dbtns ospass" aria-hidden="true"></div>')}
    ${matSeatHTML(S, 'mob')}
  </div></div></div>
  <div class="osmob osdeskmob"><div class="osmobdim" aria-hidden="true"></div>
    <div class="forces mz osmz" style="--n:${Math.max(1, d.length)};--tt:${d.reduce((t, u) => t + (u.gear ? 1 : 0) + (u.arm || 0) + (u.tr || 0) + (u.sh || 0), 0)}">
      <section class="mz-deck" aria-label="${who}"><div class="osmzhd">${who} · 1 at the bottom fights first</div>${mzLimitsHTML(me, d)}
        <div class="mzstack" id="mz-deck">${rows || '<div class="mzempty">Drag units here from the bench</div>'}</div>
        ${ui.err ? `<p class="err" role="alert">${esc(ui.err)}</p>` : ''}
      </section>
      <div class="mobright">
        <section class="mz-bench" aria-label="Bench"><div class="osmzhd">Bench</div>
          <div class="mzstack osfan" id="mz-bench">${bench || '<div class="mzempty">Everything is in your deck</div>'}</div>
        </section>
        ${mobMirHTML(me)}
      </div>
    </div>
    <div class="osaideck" aria-hidden="true"><span class="oback osaicard"></span><span class="osaitxt">${ai}</span></div>
    <div class="osmobacts">${mzSuggestHTML('Suggest', 'act')}${mobLockHTML()}</div>
  </div>${mirModalHTML()}`;
}
// renderPlay's step on the desktop: the fan, Lock in and the AI's deck take their places (after the mat is fitted)
function matDeskMobLayout(){
  const mob = document.querySelector('#view-play .osdeskmob'); if (!mob) return;
  const fan = mob.querySelector('#mz-bench.osfan'), slots = fan ? [...fan.querySelectorAll(':scope > .osfanslot')] : [];
  const c = slots[0] && slots[0].firstElementChild;
  MATFAN.prev = MATFAN.cur; MATFAN.cur = new Map();
  if (c){
    const w = c.offsetWidth, h = c.offsetHeight, L = matFanPoses(slots.length, w, h);
    fan.style.width = L.w + 'px'; fan.style.height = L.h + 'px';
    slots.forEach((s, i) => { s._pose = L.poses[i]; s.style.transform = matFanTf(L.poses[i], w, h); MATFAN.cur.set(s.firstElementChild.dataset.key, L.poses[i].rot); });
  } else if (fan){ fan.style.width = ''; fan.style.height = ''; }
  // Suggest and Lock in where Pass was (right of the trays, under the discard)
  const pass = document.querySelector('#view-play .osdesk.osmobmat .ospass'), acts = mob.querySelector('.osmobacts');
  if (pass && acts){ const r = pass.getBoundingClientRect(), m = mob.getBoundingClientRect(); acts.style.left = (r.left - m.left) + 'px'; acts.style.top = (r.top - m.top) + 'px'; acts.style.width = r.width + 'px'; }
  const ai = mob.querySelector('.osaicard'); if (ai) ai.style.transform = matRotTf(MAT_AIDECK_ROT, ai.offsetWidth, ai.offsetHeight);
}
// the bottom bar in Mobilize on the mat: Suggest a deck, then Lock in (same height as the shop's bar, so the mat stays put)
function matMobDockHTML(acts){
  if (matDesk()) return '';   // desktop: Suggest and Lock in stand on the mat where Pass was (matMobDeskHTML)
  return `<div class="dock osdock osmobdock${ui.planning ? '' : ' mine'} ph-mobilize" id="dock">${mzSuggestHTML('Suggest', 'act')}<div class="dbtns dact">${acts}</div></div><div class="dockspace" aria-hidden="true"></div>`;
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
  for (const deal of MATDEALS.values()){ deal.flight.cancel(); deal.finish(); }
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
    const desk = shop.classList.contains('osdesk'), motion = [];
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
      for (const el of cards){
        const pose = matPoseOf(el);
        if (pose && getComputedStyle(el).visibility !== 'hidden' && el.style.opacity !== '0')
          list.push({el, k, fr:pose.r, rot:pose.rot, to:live.has(el.dataset.ck) ? 'deck' : 'pile'});
      }
    }
    list.reverse();   // the last card first, so each row's first card lands last, on top of its deck
    // what goes away with the shop: the bottom bar's buttons and purse, the turn glow
    document.querySelectorAll('#view-play .osseat.osact').forEach(b => b.classList.remove('osact'));
    for (const e of document.querySelectorAll('#dock .dbtns, #dock .ospurse, #dock .tslots, #view-play .osdesk .ospass'))
      motion.push(e.animate([{opacity:1}, {opacity:0}], {duration:250, fill:'forwards'}));
    const duration = desk ? 500 : MAT_SWEEP;
    const gap = desk ? Math.min(58, 330 / Math.max(1, list.length - 1)) : MAT_SWEEP_GAP;
    const n = {u:0, b:0, p:0}, tot = {u:0, b:0, p:0}; let end = 0;
    for (const x of list) if (!x.dest) tot[x.to === 'deck' ? x.k : 'p']++;
    list.forEach((x, j) => {
      const target = x.dest ? null : matPoseOf(x.to === 'deck' ? deck(x.k) : pile);
      const tr = x.dest || target?.r;
      if (!tr || !tr.width) return;
      const w = x.to === 'deck' ? x.k : 'p', h = x.dest ? 0 : n[w]++;
      const dest = x.dest || {left:tr.left, top:tr.top + Math.min(3, tot[w] - 1 - h) * 2, width:tr.width};   // each a little lower than the next: the last lands on the spot itself
      const {g, ctx} = flyer(x.el, x.k, {exact:true});
      g.classList.remove('canbuy', 'cant', 'peeked', 'oslifted');
      flyEl(g, x.fr, x.fr.width, x.fr.height, LAYER.flight, ctx); g.style.overflow = '';
      const kf = matArc(x.fr, {r:x.fr, tilt:1, rot:x.rot}, {r:dest, tilt:1, rot:target?.rot}, {arc:22, bump:.06});
      if (!kf){ g.remove(); return; }
      const delay = j * gap;
      motion.push(g.animate(kf, {duration, delay, easing:MAT_EASE, fill:'both'}));
      (x.hide || x.el).style.visibility = 'hidden';
      MATMOB.flyers.push(g);
      try{ sfx.flick(delay / 1000 + .02); }catch(e){}
      end = Math.max(end, delay + duration);
    });
    // On desktop the bought piles merge into the players' decks as the last shop cards reach their own decks.
    const t1 = Math.max(0, end - 160);
    if (desk) for (const st of shop.querySelectorAll('.osseat')){
      const top = st.querySelector('.osbought .ostop'), to = st.querySelector('.osdeck .ostop, .osdeck .osslot');
      const fr = top && matFlatRect(top), tr = to && matFlatRect(to); if (!fr || !fr.width || !tr || !tr.width) continue;
      const {g, ctx} = flyer(top, top.classList.contains('u') ? 'u' : 'b', {exact:true});
      flyEl(g, fr, fr.width, fr.height, LAYER.flight, ctx); g.style.overflow = '';
      const kf = matArc(fr, {r:fr, tilt:1}, {r:tr, tilt:1}, {arc:14, bump:.04}); if (!kf){ g.remove(); continue; }
      motion.push(g.animate(kf, {duration:MAT_MERGE, delay:t1, easing:MAT_EASE, fill:'both'}));
      setTimeout(() => { for (const e of st.querySelectorAll('.osbought > :not(.ostag)')) e.style.visibility = 'hidden'; }, t1);
      MATMOB.flyers.push(g);
    }
    if (desk) Promise.allSettled(motion.map(a => a.finished)).then(res);
    else setTimeout(res, end ? end + 120 : 0);
  });
}
// renderPlay's step: Mobilize was just drawn after the sweep, so the deck lifts off the mat
function matMobAfterDraw(){
  if (!MATMOB.lift) return;
  MATMOB.lift = false;
  if (!matMobOn() || !document.querySelector('#view-play .osmobmat')) return;
  MATMOB.busy = true; MATMOB.redraw = false;
  matMobLift().catch(err => console.error('Mobilize entrance', err)).finally(() => {
    const mob = document.querySelector('#view-play .osdeskmob'); if (mob) mob.inert = false;
    MATMOB.busy = false;
    renderPlay();   // one redraw catches up (and puts the piles away)
  });
}
// where a bench item comes from on the mat: gear from your hand spot, tokens off the Caravan card that makes them,
// units (and anything else) from your deck pile
const MAT_TOK_FROM = {arm:'Smithy', sh:'Armory', tr:'Study'};
function matBenchFrom(el, me){
  const named = (sel, n) => [...me.querySelectorAll(sel)].find(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === n; });
  const t = el.dataset.mz, src = t === 'bgear' ? named('.oshand', el.dataset.name) : t === 'btok' ? named('.oscar', MAT_TOK_FROM[el.dataset.tok]) : null;
  return src || me.querySelector('.osdeck .ostop, .osdeck .osslot') || me.querySelector('.ospile .ostop') || me.querySelector('.ospile');
}
// 2. the lift. Resolves when Mobilize is ready to use.
function matMobLift(){
  if (document.querySelector('#view-play .osdeskmob')) return matMobLiftDesk();
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
// 2 on the desktop (Brian, Nov 25): the dim comes down; your deck lifts off its spot, flat out of the tilt, to the middle
// and fans up into the cascade, card 1 settling last at the bottom; gear and tokens fly to their places in the bench fan;
// the AI's deck lifts face down towards the top edge. Labels and controls settle during the last part of the lift.
async function matMobLiftDesk(){
  const mob = document.querySelector('#view-play .osdeskmob');
  if (!mob || reduceMotion()) return;
  mob.inert = true;
  const me = document.querySelector('#view-play .osdesk .osseat.me'), opp = document.querySelector('#view-play .osdesk .osseat.opp');
  const ps = matSpotRect(me && me.querySelector('.osdeck .osslot, .osdeck .ostop'));
  const motion = [];
  const play = (el, frames, options) => motion.push(el.animate(frames, {fill:'backwards', easing:MAT_EASE, ...options}));
  const flight = (el, frames, options) => {
    if (!frames) return;
    el.style.transformOrigin = '0 0';
    play(el, frames, options);
  };
  const dim = mob.querySelector('.osmobdim');
  if (dim) play(dim, [{opacity:0}, {opacity:1}], {duration:340, easing:'ease-out'});
  const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];   // back to front: card 1 (at the bottom) is the last
  const gap = Math.min(48, 160 / Math.max(1, rows.length - 1));
  rows.forEach((el, i) => {
    const delay = 100 + i * gap, duration = 780;
    if (ps){
      const b = el.getBoundingClientRect();
      flight(el, matArc(b, ps, {r:b, tilt:0}, {arc:50, bump:.06}), {duration, delay});
      for (const x of el.querySelectorAll(':scope > .mzpow, :scope > .mztags, :scope > .mztk'))
        play(x, [{opacity:0}, {opacity:1}], {duration:200, delay:delay + duration - 220, easing:'ease-out'});
    }
    const number = el.querySelector(':scope > .mzno');
    if (number) play(number, [{opacity:0, transform:'scale(.72)'}, {opacity:1, transform:'scale(1.10)', offset:.72}, {opacity:1, transform:'none'}],
      {duration:200, delay:ps ? delay + duration - 180 : 420 + i * gap, easing:'ease-out'});
  });
  const fan = mob.querySelector('#mz-bench.osfan'), fb = fan && fan.getBoundingClientRect();
  const slots = [...mob.querySelectorAll('#mz-bench > .osfanslot')], fanGap = Math.min(55, 180 / Math.max(1, slots.length - 1));
  slots.forEach((slot, i) => {
    const c = slot.firstElementChild, p = slot._pose, ss = matSpotRect(me && c && matBenchFrom(c, me)); if (!ss || !p || !fb) return;
    const w = c.offsetWidth, h = c.offsetHeight;
    flight(slot, matArc({left:fb.left, top:fb.top, width:w, height:h}, ss, {r:{left:fb.left + p.x, top:fb.top + p.y, width:w}, tilt:0, rot:p.rot}, {arc:40, bump:.05}),
      {duration:650, delay:150 + i * fanGap});
  });
  // the AI's deck: face down off its spot up towards the top edge
  const ai = mob.querySelector('.osaicard'), os = matSpotRect(opp && opp.querySelector('.osdeck .osslot, .osdeck .ostop'));
  if (ai && os){ const pr = ai.offsetParent.getBoundingClientRect(), b = {left:pr.left + ai.offsetLeft, top:pr.top + ai.offsetTop, width:ai.offsetWidth, height:ai.offsetHeight};
    flight(ai, matArc(b, os, {r:b, tilt:0, rot:MAT_AIDECK_ROT}, {arc:30}), {duration:670, delay:150}); }
  [...mob.querySelectorAll('.osmzhd, .mzlim, .mzempty, .err, .osaitxt, .osmobacts')].forEach((e, i) =>
    play(e, [{opacity:0, transform:'translateY(6px)'}, {opacity:1, transform:'none'}], {duration:230, delay:535 + Math.min(i * 25, 125)}));
  try{ sfx.rustle(); }catch(e){}
  await Promise.allSettled(motion.map(a => a.finished));
}
// The next round's deal on the mat: last shop's leftovers come back out of the top of their deck (where the sweep left
// them), face up, sliding across the mat to their spot; the real card shows when its copy lands. Returns when it lands.
function matReturnFly(el, deck, delay, dur){
  if (!matShopOn() || !el || !deck || !el.closest('#view-play .osplane')) return 0;
  const to = matPoseOf(el), from = deck.nodeType ? matPoseOf(deck) : {r:deck, tilt:1};   // or a flat rect off the left edge
  const fr = to?.r;
  if (!fr?.width || !from?.r.width) return 0;
  const {g, ctx} = flyer(el, null, {exact:true});
  g.classList.remove('canbuy', 'cant', 'peeked');
  if (to.rot) g.querySelector('.hgtok')?.remove();   // hours stamp the card in the tray after the handoff
  flyEl(g, fr, fr.width, fr.height, LAYER.flight, ctx); g.style.overflow = '';
  const kf = matArc(fr, from, to, {arc:22, bump:.06}); if (!kf){ g.remove(); return 0; }
  const a = g.animate(kf, {duration:dur, delay, easing:MAT_EASE, fill:'both'});
  if (!matTrackDeal(el, g, a)){
    const wait = el.animate([{opacity:0}, {opacity:0}], {duration:delay + dur});
    a.onfinish = a.oncancel = () => { g.remove(); wait.cancel(); };
  }
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
   off and reduced motion keep the hard cut.
   Desktop (stage 4, Brian Nov 25; mock-up "Battle on the mat"): the same flow on the big mat, with one more beat. Unused
   bench cards leave the fan for your deck pile; the trays, decks, discard and purses fade under the dim but the two
   Caravan rows stay; when the dim lifts, each Caravan card folds to its crop and slides out to its strip at the top or
   bottom edge (matBatStrips); then the words, then both decks slam: yours from the gathered stack, the AI's from where
   its card back waited near the top. Every place is measured from the page when its beat starts, a beat with a missing
   piece is skipped, and all the timings are the constants below. */
const MATBAT = {busy:false, land:null, redraw:false};
const MAT_GATHER = 320, MAT_GATHER_GAP = 30, MAT_CROP_T = 300, MAT_CLEAR = 420, MAT_DIM = 380, MAT_WORDS = 360, MAT_TIP = 460, MAT_SLAM = 520;
const MAT_FOLD = 240, MAT_SLIDE = 520, MAT_SLIDE_GAP = 45, MAT_STRIP_IN = 300;   // desktop: the Caravans fold to their crops, slide to the strips; the strips' other parts come in
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
  try{ matHoverEnd(true); }catch(e){}   // (desktop: a card held up by the hover goes now)
  const mat = document.querySelector('#view-play .osmobmat'), mob = document.querySelector('#view-play .osmob');
  const home = matDesk() ? document.querySelector('#view-play .osmobmat .osseat.me .osdeck') || document.querySelector('#view-play .osmobmat .osseat.me .ospile')
    : document.querySelector('#view-play .osbar.me .oshandrow') || document.querySelector('#view-play .osbar.me .ospile');
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
  L.strips = matDesk() ? [...view.querySelectorAll('.osbars .osstrip')] : [];
  L.stripBg = L.strips.map(st => getComputedStyle(st).backgroundColor);   // (their shade, to fade back in to)
  L.strips.forEach(st => st.classList.add('matbatpre'));   // desktop: the strips wait empty until their Caravans slide in
  const late = [...document.querySelectorAll('#gtop .pbhint, #dock .act, #dock .dbtns')];
  late.forEach(e => { e.style.opacity = '0'; });
  MATBAT.busy = true; MATBAT.redraw = false;
  matBatFold(L).then(() => matBatLand(line, L)).then(() => {
    late.forEach(e => { e.style.opacity = ''; if (e.isConnected) e.animate([{opacity:0}, {opacity:1}], {duration:260, easing:'ease-out'}); });
    line.classList.remove('matbat');
    (L.strips || []).forEach(st => { st.classList.remove('matbatpre'); st.getAnimations({subtree:true}).forEach(a => a.cancel()); });
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
    const desktop = !!L.strips?.length;
    const gather = desktop ? 260 : MAT_GATHER, crop = desktop ? 220 : MAT_CROP_T, clear = desktop ? 300 : MAT_CLEAR;
    const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];
    const one = L.one = rows[rows.length - 1];   // drawn back to front: card 1 is the last row
    const at = one && one.getBoundingClientRect();
    const go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'forwards', easing:MAT_EASE, ...o}) : null;
    // 1. the cascade gathers into one stack of full cards on card 1, the last card first
    rows.slice(0, -1).forEach((el, i) => {
      const r = el.getBoundingClientRect(); if (!at) return;
      el.style.transformOrigin = '0 0';
      go(el, [{transform:'none'}, {transform:`translate(${at.left - r.left}px,${at.top - r.top}px) scale(${at.width / r.width})`}], {duration:gather, delay:i * MAT_GATHER_GAP});
    });
    const gathered = gather + Math.max(0, rows.length - 2) * MAT_GATHER_GAP;
    for (const e of mob.querySelectorAll('.mzno, .mzpow, .mztags, .mztk, .osmzhd, .mzlim, .mzempty, .err, .mobmir, .osmobacts')) go(e, [{opacity:1}, {opacity:0}], {duration:220});
    // bench items you didn't use go back to your hand spot (or your deck pile) in your bar, where it was, and fade there
    const hr = L.home;
    [...mob.querySelectorAll('#mz-bench > .mzc')].forEach((el, i) => {
      const b = el.getBoundingClientRect(), o = {duration:MAT_GATHER + 120, delay:i * 50};
      if (hr && hr.width && b.width){ el.style.transformOrigin = '0 0'; go(el, matArc(b, {r:b, tilt:0}, {r:{left:hr.left, top:hr.top, width:Math.min(hr.width, hr.height * b.width / b.height)}, tilt:0}, {arc:30}), o); }
      go(el, [{opacity:1}, {opacity:1, offset:.7}, {opacity:0}], {...o, easing:'linear'});
    });
    // desktop: the fan's cards keep their own pose (matFanTf) and move from it to the deck pile, shrinking as they go
    const fan = [...mob.querySelectorAll('#mz-bench > .osfanslot')], gap = Math.min(40, 125 / Math.max(1, fan.length - 1));
    fan.forEach((el, i) => {
      const b = el.getBoundingClientRect(), o = {duration:gather + 85, delay:i * gap};
      const base = el.style.transform || getComputedStyle(el).transform; const tf = base && base !== 'none' ? base : '';
      if (hr && hr.width && b.width){
        const dx = hr.left + hr.width / 2 - (b.left + b.width / 2), dy = hr.top + hr.height / 2 - (b.top + b.height / 2), k = Math.min(1, hr.width / b.width);
        go(el, [{transform:`translate(0,0) ${tf}`}, {transform:`translate(${dx / 2}px,${dy / 2 - 40}px) ${tf} scale(${(1 + k) / 2})`, offset:.5}, {transform:`translate(${dx}px,${dy}px) ${tf} scale(${k})`}], o);
      }
      go(el, [{opacity:1}, {opacity:1, offset:.7}, {opacity:0}], {...o, easing:'linear'});
    });
    // 2. once gathered, the stack turns into its cropped version, in place (the cards under card 1 go with it)
    rows.slice(0, -1).forEach(el => go(el, [{opacity:1}, {opacity:0}], {duration:1, delay:gathered}));
    const face = one && one.querySelector(':scope > .mzface');
    if (face && face.querySelector(':scope > .cface')) matCrop(face, [[0, 'open'], [1, 'crop']], {duration:crop, delay:gathered, easing:'ease-in-out', fill:'forwards'});
    // under the dim, the whole mat leaves (shop decks, discard, market words): the battle has its own table
    // (desktop: all of it but the two Caravan rows, which fold into the strips once the dim lifts)
    if (mat && L.strips && L.strips.length){
      const out = [...mat.querySelectorAll('.osinner > :not(.osseat), .osinner > .osseat > :not(.oscarrow), .osinner > .osseat > .oscarrow > .osslot')];
      out.forEach(e => go(e, [{opacity:1}, {opacity:0}], {duration:clear, delay:80, easing:'ease-in'}));
      for (const e of [mat, ...mat.querySelectorAll('.osplane, .osinner, .osinner > .osseat')])
        go(e, [{}, {backgroundColor:'transparent', backgroundImage:'none', boxShadow:'none', borderColor:'transparent'}], {duration:clear, delay:80, easing:'ease-in'});
    } else if (mat) go(mat, [{opacity:1}, {opacity:0}], {duration:clear, delay:80, easing:'ease-in'});
    try{ sfx.rustle(); }catch(e){}
    setTimeout(res, Math.max(gathered + crop, 80 + clear) + 40);
  });
}
// 3–5. the dim lifts on a clear table, the words and Caravans come, the decks slam. Resolves when the board is the board.
function matBatLand(line, L){
  return new Promise(res => {
    const mob = L.mob;
    const desktop = !!L.strips?.length;
    const dimMs = desktop ? 300 : MAT_DIM, tipMs = desktop ? 340 : MAT_TIP, slamMs = desktop ? 410 : MAT_SLAM;
    const mine = line.querySelector('.trow.s0 > .deckz > .tzc'), theirs = line.querySelector('.trow.s1 > .deckz > .tzc');
    const face = el => el && el.querySelector('.card:not(.mini)');
    const go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'backwards', easing:'cubic-bezier(.2,.7,.25,1)', ...o}) : null;
    let t = 0;
    // 3. the dim lifts (the stack stays, held above the table)
    const dim = mob.querySelector('.osmobdim'); if (dim) dim.animate([{opacity:1}, {opacity:0}], {duration:dimMs, easing:'ease-out', fill:'forwards'});
    t += dimMs - (desktop ? 190 : 80);
    // (desktop) the Caravans fold to their crops and slide out to the strips; the strips' other parts come in
    if (L.strips && L.strips.length) t += matBatStrips(L, t);
    // 4. the zone words fade in (the Caravans stay where they were, in the bars)
    for (const w of line.querySelectorAll('.zl, .labslot')) go(w, [{opacity:0}, {opacity:1}], {duration:desktop ? 280 : MAT_WORDS, delay:t, easing:'ease-out'});
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
      go(el, [{transform:`translate(0,${-(f.bottom + 40) / cos}px) scale(1.12)`, offset:0}, ...squash.map(q => ({transform:q.k, offset:q.o}))], {duration:slamMs, delay:t + tipMs, easing:'ease-in'});
      dust(el, t + tipMs + slamMs * .82);
      for (const hp of el.querySelectorAll('.hprow, .tk')) go(hp, [{opacity:0}, {opacity:1}], {duration:200, delay:t + tipMs + slamMs});
    };
    const oneF = L.one && L.one.querySelector(':scope > .mzface');
    const fl = mine && oneF ? matBatTip(line, mine, face(mine), matRect(oneF), squash) : null;
    line.classList.remove('matbatpre');   // (every piece now has its beat's animation holding it back)
    if (mine && fl){
      // the stack itself (still the sharp, big card) tips and moves; your deck takes over at the drop spot, same pose
      oneF.style.transformOrigin = '0 0';
      oneF.animate(fl.tip, {duration:tipMs, delay:t, easing:'linear', fill:'forwards'});
      oneF.animate([{opacity:1}, {opacity:0}], {duration:1, delay:t + tipMs + 16, fill:'forwards'});
      mine.style.transformOrigin = '0 0';
      go(mine, fl.drop, {duration:slamMs, delay:t + tipMs, easing:'linear'});
      go(mine, [{opacity:0}, {opacity:1}], {duration:1, delay:t + tipMs, easing:'linear'});
      dust(mine, t + tipMs + slamMs * .82);
      for (const hp of mine.querySelectorAll('.hprow, .tk')) go(hp, [{opacity:0}, {opacity:1}], {duration:200, delay:t + tipMs + slamMs});
    } else if (mine){ go(mine, [{opacity:0}, {opacity:1}], {duration:60, delay:t + tipMs, easing:'linear'}); slam(mine, null); if (oneF) oneF.animate([{opacity:1}, {opacity:0}], {duration:60, delay:t + tipMs, fill:'forwards'}); }
    if (theirs) go(theirs, [{opacity:0}, {opacity:1}], {duration:1, delay:t + tipMs, easing:'linear'});
    // the rival's deck: on the desktop its card back waited near the top (.osaicard) and tips in the same way as yours;
    // otherwise (or if that card is gone) it slams from off the top edge
    const aiB = L.strips && L.strips.length ? mob.querySelector('.osaideck .osaicard') : null;
    const fa = theirs && aiB && aiB.getBoundingClientRect().width ? matBatTip(line, theirs, face(theirs), matRect(aiB), squash) : null;
    if (fa){
      aiB.style.transformOrigin = '0 0';
      aiB.animate(fa.tip, {duration:tipMs, delay:t, easing:'linear', fill:'forwards'});
      aiB.animate([{opacity:1}, {opacity:0}], {duration:1, delay:t + tipMs + 16, fill:'forwards'});
      const tx = mob.querySelector('.osaideck .osaitxt'); if (tx) go(tx, [{opacity:1}, {opacity:0}], {duration:200, delay:t, fill:'forwards'});
      theirs.style.transformOrigin = '0 0';
      go(theirs, fa.drop, {duration:slamMs, delay:t + tipMs, easing:'linear'});
      dust(theirs, t + tipMs + slamMs * .82);
      for (const hp of theirs.querySelectorAll('.hprow, .tk')) go(hp, [{opacity:0}, {opacity:1}], {duration:200, delay:t + tipMs + slamMs});
    } else slam(theirs, null);
    t += tipMs;
    setTimeout(() => { try{ sfx.lock(); }catch(e){} }, t + slamMs * .82);
    setTimeout(() => {
      for (const el of [mine, theirs]) if (el) el.style.transformOrigin = '';
      res();
    }, t + slamMs + 60);
  });
}

/* Desktop: the Caravan rows on the mat become the strips. Each card on the mat folds to its crop (the bottom of its face
   rolls up to the crop line), then the strip's own card for that spot takes over from that same place and slides out to
   the strip; empty spots, the side word, Miracles, the purse and the strip's shade fade in after. The strip cards are
   matched by spot (the n-th card of a row goes to the n-th card of its strip); a card with no partner just fades, and a
   strip card with no partner fades in. Returns how long the beat takes from t. */
function matBatStrips(L, t){
  const cos = Math.cos(14 * Math.PI / 180), go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'backwards', easing:'cubic-bezier(.3,.6,.25,1)', ...o}) : null;
  let n = 0, end = 0;
  for (const st of L.strips){
    const side = st.classList.contains('me') ? 'me' : 'opp';
    const from = L.mat ? [...L.mat.querySelectorAll(`.osinner > .osseat.${side} > .oscarrow > .oscar`)] : [];
    const to = [...st.querySelectorAll(':scope > .oscarrow > .oscar')];
    to.forEach((c, j) => {
      const m = from[j], mf = m && (m.querySelector(':scope > .cface') || m), d = t + MAT_FOLD + n * MAT_SLIDE_GAP;
      if (m && mf.getBoundingClientRect().width){
        const fh = mf.offsetHeight, fw = mf.offsetWidth, cut = fh && fw ? Math.max(0, Math.min(60, (1 - fw * MAT_CROP / fh) * 100)) : 29.8;
        mf.animate([{clipPath:'inset(0 0 0 0)'}, {clipPath:`inset(0 0 ${cut.toFixed(2)}% 0)`}], {duration:MAT_FOLD, delay:t + n * MAT_SLIDE_GAP, easing:'ease-in-out', fill:'forwards'});
        m.animate([{opacity:1}, {opacity:0}], {duration:1, delay:d, fill:'forwards'});
        const a = mf.getBoundingClientRect(), b = c.getBoundingClientRect(), k = b.width ? a.width / b.width : 1;
        const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = (a.top - b.top) / cos;
        c.style.transformOrigin = '50% 0';
        go(c, [{transform:`translate(${dx}px,${dy}px) scale(${k})`}, {transform:`translate(${dx * .45}px,${dy * .45 - 24}px) scale(${(k + 1) / 2})`, offset:.5}, {transform:'none'}], {duration:MAT_SLIDE, delay:d});
        c.animate([{opacity:1}, {opacity:1}], {duration:1, delay:d, fill:'forwards'});   // (hidden until it takes over)
        end = Math.max(end, MAT_FOLD + n * MAT_SLIDE_GAP + MAT_SLIDE);
      } else {
        go(c, [{opacity:0}, {opacity:1}], {duration:MAT_STRIP_IN, delay:t + MAT_FOLD, easing:'ease-out', fill:'both'});
        end = Math.max(end, MAT_FOLD + MAT_STRIP_IN);
      }
      n++;
    });
    from.slice(to.length).forEach(m => m.animate([{opacity:1}, {opacity:0}], {duration:MAT_FOLD, delay:t, fill:'forwards'}));
  }
  // the rest of each strip comes in as the cards arrive
  const at = t + MAT_FOLD + Math.max(0, n - 1) * MAT_SLIDE_GAP + MAT_SLIDE * .5;
  L.strips.forEach((st, i) => {
    for (const e of st.querySelectorAll(':scope > :not(.oscarrow), :scope > .oscarrow > :not(.oscar)')) go(e, [{opacity:0}, {opacity:1}], {duration:MAT_STRIP_IN, delay:at, easing:'ease-out', fill:'both'});
    const bg = L.stripBg && L.stripBg[i]; if (bg) go(st, [{backgroundColor:'transparent'}, {backgroundColor:bg}], {duration:MAT_STRIP_IN, delay:at, easing:'ease-out', fill:'both'});
  });
  end = Math.max(end, at - t + MAT_STRIP_IN);
  try{ setTimeout(() => sfx.rustle(), t + MAT_FOLD); }catch(e){}
  return end - 120;   // the words start as the last cards settle
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
  const ox = Lr.left + Lr.width / 2, oy = Lr.bottom, deg = 14, P = parseFloat(getComputedStyle(line).getPropertyValue('--matP')) || 1000;   // the board's camera (css/11-rug.css)
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
