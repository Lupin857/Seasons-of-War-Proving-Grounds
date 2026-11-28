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
  const carHTML = Array.from({length:spots}, (_, k) => {
    if (!car[k]) return '<span class="osslot" aria-hidden="true"></span>';
    const [name, count] = car[k];
    const html = `<div class="mcard b oscar" data-b="${esc(name)}"${hid(name, k)}>${cardFace(name, 'b', count, true)}${sell(name, 'b')}</div>`;
    return desk ? `<div class="oscar-stock">${html}</div>` : html;
  }).join('');
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
  if (strip) rest = `<i class="osbardiv" aria-hidden="true"></i><div class="ospile osbattle-pile">${mine ? matBattleBenchHTML() : ''}</div>
    <div class="ospile osbattle-pile" aria-hidden="true"></div>${matDeskPilesHTML(i, hand, 'battle')}${matPurseHTML(i)}`;
  return `<section class="osseat ${strip ? 'osrow osstrip' : desk ? 'osrow' : 'osbar'} ${mine ? 'me' : 'opp'} s${VS(i)} osbar-${mode}${act ? ' osact' : ''}${mode === 'mob' && MATMOB.lift ? ' oslifting' : ''}" aria-label="${who} side${act ? ', shopping now' : ''}">
    ${side}<div class="fcards oscarrow" style="--n:${spots}" aria-label="${who} Caravan, ${slotsUsed(p)} of ${cap}">${carHTML}</div>${rest}
  </section>`;
}
// Inventory before and during this Shop. Keeping a chronological list also distinguishes prior copies of a
// card from a new copy with the same name when choosing the top of the deck.
function matDeskInventory(i, hand){
  const p = G.players[i], gear = p.gear || {}, got = G.shopBought?.[i] || [];
  const bought = {}; for (const n of got) if (DEFS[n] || isGear(n)) bought[n] = (bought[n] || 0) + 1;
  const deck = {}, nb = {};
  for (const n in hand) if (hand[n] > 0) deck[n] = hand[n];
  for (const n in gear) if (gear[n] > 0) deck[n] = (deck[n] || 0) + gear[n];
  for (const n in bought){ const k = Math.min(bought[n], deck[n] || 0); if (k > 0){ nb[n] = k; deck[n] -= k; if (!deck[n]) delete deck[n]; } }
  const remaining = {...deck}, history = p.bought || [], recent = [];
  for (let j = history.length - 1; j >= 0; j--){
    const n = history[j];
    if (bought[n] > 0){ bought[n]--; continue; }
    if (remaining[n] > 0){ remaining[n]--; recent.push(n); }
  }
  const initial = Object.entries(remaining).flatMap(([n, count]) => Array(count).fill(n));
  const pending = {...nb}, purchases = [];
  for (let j = got.length - 1; j >= 0; j--){
    const n = got[j];
    if (pending[n] > 0){ pending[n]--; purchases.push(n); }
  }
  return {deck, purchases:matShopPileOrder(i, 'bought', purchases.reverse()),
    order:matShopPileOrder(i, 'deck', initial.concat(recent.reverse()))};
}
function matShopPileOrder(i, pile, cards){
  const saved = ui.shopPileOrder?.[i]?.[pile];
  if (!saved || (pile === 'bought' && saved.round !== G.round)) return cards;
  const remaining = [...cards], order = [];
  for (const name of saved.cards){
    const next = remaining.indexOf(name);
    if (next >= 0) order.push(...remaining.splice(next, 1));
  }
  return order.concat(remaining);
}
/* Desktop row: the deck (from before this Shop), this Shop's purchases, Miracles, and water. */
function matDeskPilesHTML(i, hand, mode = 'shop'){
  const S = seat(), mine = i === S, p = G.players[i], gear = p.gear || {}, kindOf = n => DEFS[n] ? 'u' : 'b';
  const {deck, purchases, order} = matDeskInventory(i, hand);
  const count = o => Object.values(o).reduce((t, c) => t + c, 0);
  const edges = (n, faceDown = false) => Array.from({length:Math.min(3, Math.max(0, n - 1))}, (_, k) =>
    `<i class="osedge${faceDown ? ' oback' : ''}" style="--k:${k + 1}" aria-hidden="true"></i>`).join('');
  const canSell = mine && G.phase === 'shop' && !ui.battle && cur(G) === S && !G.passed[S];   // (its Sell button is pressed by a drag to the discard)
  // (the deck pile is itself a button, and a button can't hold another: there the Sell control is a span with the same data-act)
  const sellCtl = (n, inBtn) => { const h = canSell ? shopSellBtnHTML(n, kindOf(n)) : ''; return inBtn ? h.replace(/<button\b/g, '<span').replace(/<\/button>/g, '</span>') : h; };
  const face = n => cardFace(n, kindOf(n), kindOf(n) === 'u' ? (hand[n] || 1) : gear[n] || 1, true);
  const top = (n, hide, inBtn) =>
    `<span class="mcard ${kindOf(n)} ostop"${hide ? ' style="visibility:hidden"' : ''}>${face(n)}${sellCtl(n, inBtn)}</span>`;
  const layers = cards => cards.slice(-4, -1).reverse().map((n, k) =>
    `<span class="mcard ${kindOf(n)} osedge oslayer" style="--k:${k + 1}" aria-hidden="true">${face(n)}</span>`).join('');
  // The newest card from an earlier Shop is on top.
  const dn = count(deck), du = Object.keys(deck).filter(n => DEFS[n]).reduce((t, n) => t + deck[n], 0), dtop = order.at(-1);
  const dtag = dn ? `Deck · ${du} unit${du === 1 ? '' : 's'}${dn - du ? ` + ${dn - du} gear` : ''}` : 'Deck';
  const deckPile = `<button type="button" class="ospile osdeck deckbtn s${VS(i)}${ui.deckView === i ? ' on' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(deckName(i))}: ${esc(dtag)}, units ${uniqueUnits(hand === p.hand ? p : {...p, hand})} of ${deckCap(p)}, click to view">
    <span class="ospile-stock">${edges(dn, true)}${dtop ? top(dtop, false, true) : '<span class="osslot" aria-hidden="true"></span>'}</span><span class="ostag">${esc(dtag)}</span></button>`;
  // bought this shop: the latest buy on top (it hides while a rival's buy is still on its way to it)
  const bn = purchases.length, btop = purchases.at(-1), b = G.buys && G.buys[i], left = b ? Math.max(0, baseLeft(b)) : 0, of = b ? buysOf(b) : 3;
  const bonus = b ? Math.max(0, bVal(p, "Carpenter's Guild") - b.carp) + (b.fav || 0) : 0;
  const buysLabel = `${left} of ${of} regular buys left${bonus ? `, ${bonus} bonus ${bonus === 1 ? 'buy' : 'buys'} left` : ''}`;
  const bhide = btop && (matWaitN(i, 'pile') || matWaitN(i, btop));
  const pileTag = mine ? 'button' : 'div';
  const pileAction = mine ? ` type="button" data-act="deck-open" data-p="${i}" aria-haspopup="dialog"` : '';
  const boughtPile = `<${pileTag} class="ospile osbought s${VS(i)}"${pileAction} aria-label="Bought this shop: ${bn} card${bn === 1 ? '' : 's'}, ${buysLabel}">
    <span class="ospile-stock">${layers(purchases)}${btop ? top(btop, bhide, mine) : '<span class="osslot" aria-hidden="true"></span>'}</span><span class="ostag osgold">Bought this shop<br>${left}/${of} buys left${bonus ? ` · +${bonus} bonus` : ''}</span></${pileTag}>`;
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
const MATDESK_BOUNDS = new WeakMap();
// Choose one printed card width from the room available for the entire desktop tabletop.
const MAT_DESK_CAMERA = {d:2100, t:14};
let matDeskLayout;
function matDesktopLayout(){
  const w = innerWidth, h = innerHeight;
  const previous = matDeskLayout?.game === G ? matDeskLayout : null;
  const slots = Math.max(previous?.slots || 0, ...G.players.map(p => Math.max(citySlots(p), slotsUsed(p))));
  if (previous?.w === w && previous.h === h && previous.slots === slots) return previous;
  const offers = Math.max(dispSize(G, 'u'), dispSize(G, 'b'));
  // Market: two sources, sideways offer slots, and a sideways discard. Seats: keep room for both
  // inventory slots and the bank, even when the inventory is off the tabletop during Battle.
  const marketWidth = (w - 188) / (2.6 + 1.4 * offers);
  const seatCards = slots + 2 + Number(G.miracles);
  const seatWidth = (w - 218 - (G.miracles ? 12 : 0)) / (seatCards + (seatCards + 2) * .07);
  const width = Math.max(24, Math.floor(Math.min(173, marketWidth, seatWidth, (h - 104) / 5.55) * 10) / 10);
  const camera = {...MAT_DESK_CAMERA, ox:w / 2, oy:h};
  const a = camera.t * Math.PI / 180;
  const flatY = y => {
    const dy = y - h;
    return h + dy / (Math.cos(a) + dy * Math.sin(a) / camera.d);
  };
  const style = document.documentElement.style;
  style.setProperty('--deskmw', width + 'px');
  style.setProperty('--desk-far-top', flatY(18) + 'px');
  style.setProperty('--desk-caravan-slots', String(slots));
  return matDeskLayout = {game:G, w, h, slots, width, camera, flatY};
}
function matBarsAfterDraw(geometryOnly = false){
  const desk = document.querySelector('#view-play .osshop.osdesk');
  if (matDesk()) matDesktopLayout();
  if (!document.querySelector('#view-play .osbar') && !desk) return;
  if (window.scrollY && !matBarsAfterDraw.busy){ matBarsAfterDraw.busy = true; window.scrollTo(0, 0); matBarsAfterDraw.busy = false; }   // the page sits at its top in every phase on the mat, so nothing shifts between them
  const g = $('gtop'), b = g && g.offsetHeight ? Math.round(g.getBoundingClientRect().bottom) : null;
  if (b != null && document.documentElement.style.getPropertyValue('--gtb') !== b + 'px') document.documentElement.style.setProperty('--gtb', b + 'px');
  if (desk){
    if (g && !MATBARS_SEEN.has(g)){ MATBARS_SEEN.add(g); MATBARS_RO.observe(g, {box:'border-box'}); }
    const box = desk.getBoundingClientRect(), previous = MATDESK_BOUNDS.get(desk);
    if (geometryOnly && previous && box.top === previous.top && box.left === previous.left &&
        box.width === previous.width && box.height === previous.height) return;
    MATDESK_BOUNDS.set(desk, box);
    matFitDesk(desk);
    matDeskMobLayout();
    if (!geometryOnly) matShopInspectCards(desk);
    return;
  }
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
// Center the rug between the projected caravans. The seat anchors belong to the shared tabletop.
function matFitDesk(shop){
  const market = shop.querySelector('.osmkt');
  if (!market) return;
  const {flatY} = matDesktopLayout();
  const farRow = shop.querySelector('.osseat.opp .oscarrow'), nearRow = shop.querySelector('.osseat.me .oscarrow');
  const far = farRow.getBoundingClientRect(), near = nearRow.getBoundingClientRect();
  const r = market.getBoundingClientRect();
  const current = parseFloat(shop.style.getPropertyValue('--shop-middle-offset')) || 0;
  const offset = flatY((far.bottom + near.top) / 2) - flatY((r.top + r.bottom) / 2);
  if (Math.abs(offset) > .02) shop.style.setProperty('--shop-middle-offset', current + offset + 'px');
  const rug = market.querySelector('.osbazaar');
  if (rug){
    const centered = market.getBoundingClientRect();
    const farTags = [...farRow.closest('.osseat').querySelectorAll('.ospile > .ostag')];
    const nearTags = [...nearRow.closest('.osseat').querySelectorAll('.ospile > .ostag')];
    const clearance = Math.max(12,
      ...farTags.map(tag => tag.getBoundingClientRect().bottom - far.bottom + 6),
      ...nearTags.map(tag => near.top - tag.getBoundingClientRect().top + 6));
    const gap = Math.max(0, Math.min(clearance, centered.top - far.bottom, near.top - centered.bottom));
    rug.style.setProperty('--rug-top', flatY(far.bottom + gap) - flatY(centered.top) + 'px');
    rug.style.setProperty('--rug-bottom', flatY(centered.bottom) - flatY(near.top - gap) + 'px');
  }
  const discard = shop.querySelector('.osdisc')?.getBoundingClientRect();
  if (discard){
    const style = document.documentElement.style;
    style.setProperty('--desk-score-x', Math.max(106, Math.min(innerWidth - 106, discard.left + discard.width / 2)) + 'px');
    style.setProperty('--desk-score-y', Math.max(48, discard.top - 12) + 'px');
  }
  bazaarFitRug(shop);
}
const MATBARS_SEEN = new WeakSet();
const matBarsHere = () => !!document.querySelector('#view-play :is(.osbar, .osshop.osdesk)');
const MATBARS_RO = new ResizeObserver(() => { if (matBarsHere()) matBarsAfterDraw(true); });
window.addEventListener('scroll', () => { if (matBarsHere()) matBarsAfterDraw(true); }, {passive:true});
for (const t of [window, window.visualViewport]) if (t) t.addEventListener('resize', () => { if (matBarsHere()) matBarsAfterDraw(true); });
// the two trays and the discard pile between them (deck: the tray's shop deck, row: its market row)
// side (desktop): the discard pile and Pass go in a column right of the trays instead
function matTraysHTML(deck, row, extra, side, bazaar = false){
  const disc = `<div class="osdisc">${musterPileHTML(bazaar)}</div>`;
  return `<div class="osmid"><div class="mktp osmkt">${bazaar ? '<div class="osbazaar" aria-hidden="true"></div>' : ''}${extra[0] || ''}
      <div class="ostray" data-k="u">${deck('u')}<div class="msec" data-k="u"><span class="oslbl">Units</span><div class="market">${row('u', 'du')}</div></div></div>
      ${side ? '' : disc}
      <div class="ostray" data-k="b">${deck('b')}<div class="msec" data-k="b"><span class="oslbl">Support &amp; gear</span><div class="market">${row('b', 'db')}</div></div></div>
      ${extra[1] || ''}
    </div>${side ? `<div class="osright">${disc}${side}</div>` : ''}</div>`;
}
function matShopTraysHTML(S){
  return matTraysHTML(k => deckPileHTML(k, false, true), (k, src) => marketRow(k, src, true),
    [writBarHTML(), frozenHTML(S)], `<div class="dbtns ospass">${shopActsHTML()}</div>`, true);
}
function matShopHTML(){
  const S = seat();
  // desktop: both rows and the trays on one tilted mat, the discard and Pass on the right, no bottom bar
  if (matDesk()) return `<div class="osshop osdesk"><div class="osplane"><div class="osinner">
    ${matSeatHTML(1 - S)}
    ${matShopTraysHTML(S)}
    ${matSeatHTML(S)}
  </div></div></div>
  ${mirTrayHTML()}${mirModalHTML()}`;
  return `${matSeatHTML(1 - S)}${matSeatHTML(S)}<div class="osshop"><div class="osplane"><div class="osinner">
    ${matTraysHTML(k => deckPileHTML(k, false, true), marketRow, [writBarHTML(), frozenHTML(S)])}
  </div></div></div>
  ${mirTrayHTML()}${mirModalHTML()}`;
}
// An ordinary purchase updates the stock, which side is active, and both rows' buy controls.
// Keep the surrounding board and its fitted geometry in place.
function matRefreshPurchase(){
  if (!matShopOn() || !matDesk() || !morphOn() || PP() || G.net || G.miracles ||
      ui.deckView != null || ui.pkWin || ui.remind) return false;
  const view = $('view-play'), desk = view.querySelector('.osshop.osdesk:not(.osmobmat)');
  const score = view.querySelector('#gtop .pbsc .sc'), layout = matDeskLayout;
  if (!desk || !score || view.querySelector('.osdeckfan, .pkwin, .remind') ||
      !layout || matDesktopLayout() !== layout || !MATDESK_BOUNDS.has(desk)) return false;
  const S = seat(), template = document.createElement('template');
  template.innerHTML = matSeatHTML(1 - S) + matShopTraysHTML(S) + matSeatHTML(S);
  const selectors = ['.osseat.opp', '.ostray[data-k="u"]', '.ostray[data-k="b"]', '.osright', '.osseat.me'];
  const regions = selectors.map(selector => [desk.querySelector(selector), template.content.querySelector(selector)]);
  if (regions.some(([current, next]) => !current || !next)) return false;
  for (const [current, next] of regions){
    if (current.matches('.osseat.opp')) mAttrs(current, next);
    else mNode(current, next);
  }
  const points = boardSnap().tot, left = points[VS(0)], right = points[VS(1)];
  const a = score.querySelector('.a'), b = score.querySelector('.b');
  if (a.textContent !== String(left)) a.textContent = left;
  if (b.textContent !== String(right)) b.textContent = right;
  const label = `Score ${left} to ${right}`;
  if (score.getAttribute('aria-label') !== label) score.setAttribute('aria-label', label);
  matShopInspectCards(desk);
  return true;
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
function matDeskPileCard(card){
  return matDesk() && matShopOn() && card.matches('#view-play :is(.osdeckfan-card, .pkwin :is(.pkgrid,.dsheet .fcards) .mcard)');
}
function matLiftWanted(card){ return matDeskPileCard(card) || (matShopOn() && !!card.closest('#view-play .osshop')) || (matMobOn() && !!card.closest('#view-play .osmob')) || (compact() && !!card.closest('#view-play .osbar')); }
// where a lifted card starts and ends: a mat card in the tilt (its flat rect), a Mobilize card flat where it lies;
// crop: it sits cropped there (mat cards, the bench), so the crop opens as it lifts
function matLiftFrom(el){
  if (!el || !el.isConnected) return null;
  if (el.closest('.osplane')){ const pose = matPoseOf(el); return pose && {...pose, crop:compact()}; }
  if (el.closest('.osdeskmob,.osdeckfan')) return matPoseOf(el);
  return {r:el.getBoundingClientRect(), tilt:0, crop:compact() && !el.closest('#mz-deck')};
}
// the card that was lifted, as it is on the page now (a redraw may have replaced its element)
function matLiftSrc(){
  const c = MATLIFT.src;
  if (c && c.isConnected) return c;
  return MATLIFT.ck ? ckEl(MATLIFT.ck) : null;
}
function matLiftShow(){
  document.querySelectorAll('.oslifted').forEach(e => e.classList.remove('oslifted'));
  MATLIFT.src = null; MATLIFT.ck = null;
  matRefreshShopFan();
  if (MATMOB.layoutPending && !MATMOB.busy && !mzP) matDeskMobLayout();
}
function matLiftDone(owner){
  if (MATLIFT.src === owner) matLiftShow();
  else owner?.classList.remove('oslifted');
}
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
   there (matPose), 0 flat on the screen. The tilt comes off (or on) over the half of the flight nearest the mat,
   or through the full flight when o.levelThroughout is set.
   o.bump: the card grows by that much of its size at the top of the arc. The last step is exactly the end.
   Both ends on the mat (tilt 1 and 1): the card slides across the mat in its tilt all the way (the sweep, a card dealt back).
   An end may also be turned: rot, in degrees about the card's centre (a card in a fan, matFanPoses); the turn eases
   from one end's to the other's. The box b must then have its height. */
const MAT_STEPS = 24;
function matArc(b, A, B, o = {}){
  const q = o.projection || matTiltOf(); if (!q) return null;
  const ax = A.r.left, ay = A.r.top, bx = B.r.left, by = B.r.top, aw = A.r.width, bw = B.r.width;
  const cx = (ax + bx) / 2, cy = (ay + by) / 2 - 2 * (o.arc ?? 50);
  const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const out = [];
  for (let k = 0; k <= MAT_STEPS; k++){
    const progress = k / MAT_STEPS, u = o.easeTravel ? sm(progress) : progress, v = 1 - u;
    const x = v * v * ax + 2 * v * u * cx + u * u * bx, y = v * v * ay + 2 * v * u * cy + u * u * by;
    const w = aw + (bw - aw) * u + (o.bump || 0) * Math.sin(Math.PI * u) * Math.max(aw, bw);
    const a = o.levelThroughout ? A.tilt + (B.tilt - A.tilt) * sm(u)
      : A.tilt && B.tilt ? 1 : A.tilt ? 1 - sm(u / .5) : B.tilt ? sm((u - .5) / .5) : 0;
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
// Read a whole batch in the flat plane before restoring its tilt.
function matFlatRects(plane, elements){
  const transform = plane.style.transform;
  plane.style.transform = 'scale(calc(1 / var(--osres)))';
  try { return new Map([...new Set(elements.filter(Boolean))].map(el => [el, el.getBoundingClientRect()])); }
  finally { plane.style.transform = transform; }
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
   it. The downward crop lets the art follow the window so the printed bottom edge keeps its table position.
   The card's own rounded top corners match the crop's. pk sits inside the box that carries the move (.osfly).
   keys: [[offset, 'crop' | 'open'], ...]. Returns {anims, done}: done() drops the clip (call it as the move ends). */
const MAT_TABTOP = .89354;   // where the crop's bottom corners start, of its height (from the #tabclip path)
// Measure fractional card dimensions for the desktop handoff. The crop and the live strip share this anchor.
function matCropMetrics(pk){
  const face = pk.querySelector(':scope > .cface') || pk;
  const css = getComputedStyle(face);
  const width = parseFloat(css.width) || face.offsetWidth, height = parseFloat(css.height) || face.offsetHeight;
  return {width, height, drop:Math.max(0, height - width * MAT_CROP)};
}
function matCrop(pk, keys, opt, direction){
  if (!compact() && !direction) return {anims:[], done:() => {}};
  const art = pk.querySelector(':scope > .cface'), face = art || (direction ? pk : null);
  const d = document.querySelector('#tabclip path')?.getAttribute('d');
  if (!face || !d) return {anims:[], done:() => {}};
  const geometry = direction ? matCropMetrics(pk) : null;
  const w = geometry?.width ?? face.offsetWidth, cH = w * MAT_CROP, y0 = art?.offsetTop || 0, H = pk.offsetHeight;
  const open = H - y0 - MAT_TABTOP * cH + 2, top = -(H + open + 40);
  const X = x => (x * w).toFixed(2), Y = y => (y > .06 ? y0 + y * cH : top).toFixed(2);
  pk.style.clipPath = 'path("' + d.replace(/([MQLHV])([^MQLHVZ]*)/g, (m, c, a) => {
    const n = a.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === 'H') return `H ${X(n[0])} `;
    if (c === 'V') return `V ${Y(n[0])} `;
    const pts = []; for (let i = 0; i + 1 < n.length; i += 2) pts.push(`${X(n[i])},${Y(n[i + 1])}`);
    return `${c} ${pts.join(' ')} `;
  }).trim() + '")';
  const T = (s, sg) => `0 ${s === 'open' ? sg * open : sg === 1 && direction === 'down' ? geometry.drop : 0}px`;
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
  if (card.classList.contains('leaving')){
    const note = document.createElement('p');
    note.className = 'osinspect-last-chance';
    note.textContent = 'Last chance to buy';
    side.append(note);
  }
  const actions = document.createElement('div'); actions.className = 'osinspect-actions';
  actions.append(...pk.querySelectorAll(':scope > button'));
  if (actions.childElementCount) side.append(actions);
  for (const notes of [pk.querySelector(':scope > .stamps'), pk.querySelector(':scope > .kwgloss'), miracles]) if (notes) side.append(notes);
  return {side, close};
}
function matLiftOpen(card, pk, wrap){
  const desktopShop = !!matDeskShopCard(card) || matDeskPileCard(card);
  const desktop = desktopShop || !!card.closest('.osdeskmob');
  const from = matLiftFrom(card);
  wrap.classList.add('osliftwrap');
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
  const col = document.createElement('div'); col.className = 'oslift';
  const mw = card.parentElement && card.parentElement.classList.contains('mirwrap') ? card.parentElement.querySelector('.mirhover') : null;
  const miracles = mw && mw.cloneNode(true);
  if (miracles){ try{ kwDecorate(miracles); }catch(e){} miracles.className = 'sheetmir osliftmir'; miracles.removeAttribute('aria-hidden'); }
  pk.removeAttribute('aria-hidden');
  pk.querySelectorAll('button[aria-label]').forEach(b => { if (b.textContent.trim().length <= 2) b.textContent = b.getAttribute('aria-label'); });
  if (miracles && !desktop) col.append(miracles);
  col.appendChild(pk); const F = matFlyBox(pk);
  if (card.matches('.osdeskmob #mz-deck > .mzc.unit') && from?.r.width){
    const attachments = card.querySelectorAll(':scope > .mztk'), width = from.r.width;
    if (attachments.length) F.classList.add('osinspect-unit');
    for (const attachment of attachments){
      const copy = attachment.cloneNode(true);
      copy.removeAttribute('data-mz');
      copy.setAttribute('aria-hidden', 'true');
      copy.style.left = (100 * attachment.offsetLeft / width) + '%';
      copy.style.top = (100 * attachment.offsetTop / width) + 'cqw';
      F.append(copy);
    }
  }
  const inspect = desktop && matShopInspectSide(card, pk, miracles);
  if (inspect){
    wrap.classList.add('osshopinspect'); wrap.setAttribute('aria-labelledby', 'osinspect-title');
    col.style.setProperty('--inspect-width', bazaarTiming.inspectWidth + 'px');
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
    F.addEventListener('pointerdown', e => {
      if (e.target.closest('button, a')) return;
      if (desktopShop) matDragArm(e, card, wrap, F);
      else {
        const unit = card.closest('[data-mz]');
        if (unit) mzArm(e, unit, wrap, F);
      }
    });
    F.addEventListener('dragstart', e => e.preventDefault());
    wrap.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const controls = [...col.querySelectorAll('button:not(:disabled)')], first = controls[0], last = controls.at(-1);
      if (e.shiftKey && e.target === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && e.target === last){ e.preventDefault(); first.focus(); }
    });
  } else wrap.addEventListener('click', e => { if (peekReady && peekEl === wrap && !e.target.closest('button')) closePeek(); });   // tap anywhere, the card too
  sfx.pick(); if (navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
  if (reduceMotion() || !r || !r.width) return;
  const duration = desktop ? bazaarTiming.inspectOpen : 650;
  const b = F.getBoundingClientRect();
  const flight = desktop ? {arc:0, levelThroughout:true} : {arc:50, bump:.06};
  const kf = matArc(b, fr, {r:b, tilt:0}, flight);
  if (!kf) return;
  const fan = matFanInspectPath(b, fr, duration, true, matFanInspectRoom(card));
  const opening = fan ? matFanInspectFlight(F, b, fan) : F.animate(kf, {duration, easing:MAT_EASE, fill:'both'});
  if (desktop) F._inspectOpen = opening;
  if (fr.crop){ const cr = matCrop(pk, [[0, 'crop'], [.3, 'crop'], [1, 'open']], {duration:650, easing:'ease-in-out', fill:'forwards'});   // then no clip: the card's own corners
    if (cr.anims[0]) cr.anims[0].onfinish = cr.done; }
  wrap.animate([{backgroundColor:'rgba(12,8,5,0)'}, {backgroundColor:getComputedStyle(wrap).backgroundColor}], {duration:desktop ? bazaarTiming.inspectDim : 450, delay:fan?.switchAt ?? 0, easing:'ease-out', fill:'backwards'});
  if (inspect){
    inspect.side.animate([{opacity:0}, {opacity:1}], {duration:bazaarTiming.inspectPanelFade, delay:Math.max(bazaarTiming.inspectPanelDelay, fan?.switchAt ?? 0), easing:'ease-out', fill:'backwards'});
  } else {
    const extra = [...pk.querySelectorAll(':scope > button, :scope > .kwgloss, :scope > .stamps'), ...col.querySelectorAll('.osliftmir')];
    extra.forEach(e => e.animate([{opacity:0, transform:'translateY(8px)'}, {opacity:1, transform:'none'}], {duration:260, delay:450, easing:'ease-out', fill:'backwards'}));
  }
}
// closePeek's step for a lifted mat card. after: a button was pressed, so the card stays up for the move's flight.
function matLiftClose(w, now, after){
  const pk = w.querySelector('.mcard.peek');
  if (after && !now && pk && !MATLIFT.src?.closest('.osdeskmob')){ matLiftHold(w, pk); after(); matLiftUnheld(); return; }
  const src = matLiftSrc(), fr = matLiftFrom(src), r = fr && fr.r;
  const owner = MATLIFT.src, desktopShop = w.classList.contains('osshopinspect');
  const done = () => {
    matFanReleaseInspectRoom(w.querySelector('.osfly'));
    w.remove();
    if (MATLIFT.src === owner){
      matLiftShow();
      if (!now) w._cardFocus?.focus({preventScroll:true});
    } else if (src && src !== MATLIFT.src) src.classList.remove('oslifted');
    if (after) after();
  };
  if (now || reduceMotion() || !pk || !r || !r.width){ done(); return; }
  if (!src?.closest('.osdeckfan,.osdeskmob')) w.style.pointerEvents = 'none';
  const F = matFlyBox(pk);
  const duration = desktopShop ? bazaarTiming.inspectClose : 520;
  const opening = desktopShop && F._inspectOpen;
  if (opening && opening.playState === 'running'){
    // A quick dismissal reverses the glide from its current place and angle.
    const fan = F._fanInspect;
    const returnTime = duration + (fan ? bazaarTiming.pileRoomClose : 0);
    const rate = -opening.effect.getTiming().duration / Math.max(1, returnTime);
    const untilTuck = fan ? Math.max(0, opening.currentTime - fan.switchAt) / -rate : duration;
    for (const animation of [opening, ...(fan?.parts || [])]){
      animation.reverse();
      animation.updatePlaybackRate(rate);
    }
    opening.onfinish = opening.oncancel = done;
    matInspectFadeOut(w, untilTuck);
    return;
  }
  F.getAnimations().forEach(a => a.cancel()); pk.getAnimations({subtree:true}).forEach(a => a.cancel()); pk.style.clipPath = '';
  const b = F.getBoundingClientRect();
  const flight = desktopShop ? {arc:0, levelThroughout:true} : {arc:50, bump:.06};
  const kf = matArc(b, {r:b, tilt:0}, fr, flight);
  if (!kf){ done(); return; }
  const fan = matFanInspectPath(b, fr, duration, false, F._fanRoom);
  const a = fan ? matFanInspectFlight(F, b, fan) : F.animate(kf, {duration, easing:MAT_EASE, fill:'forwards'});
  if (fr.crop) matCrop(pk, [[0, 'open'], [.7, 'crop'], [1, 'crop']], {duration:520, easing:'ease-in-out', fill:'forwards'});
  if (desktopShop) matInspectFadeOut(w, fan?.switchAt ?? duration);
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
  matFanReleaseInspectRoom(F);
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
  const h = MATLIFT.held; if (!h) return;
  MATLIFT.held = null;
  const source = matLiftSrc(), owner = MATLIFT.src, done = () => matLiftDone(owner);
  if (h.g.classList.contains('osdrag')) matSettleDragged(h.g, source, done);
  else matLand(h.g, source, {dur:520, arc:50, done});
}
function matSettleDragged(g, to, done){
  matLand(g, to, {dur:520, arc:0, settleOnly:true, done});
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
  let contact, closeRoom;
  const fin = () => { MATLANDS.delete(L); contact?.remove(); g._osGripShadow?.remove(); g.remove(); const t = spot(); if (t) t.style.visibility = ''; if (L.to && L.to !== t) L.to.style.visibility = ''; closeRoom?.(); if (o.done) o.done(); return t; };
  const sp = matPoseOf(to), r = sp && sp.r;
  if (!r || !r.width || reduceMotion()){ fin(); return; }
  to.style.visibility = 'hidden';
  g.getAnimations({subtree:true}).forEach(a => a.cancel());
  const drag = g._osDragPose, s = o.s || 1;
  const bb = drag ? drag.box : g.getBoundingClientRect();
  const b = {left:bb.left, top:bb.top, width:bb.width / s, height:bb.height / s};
  const shop = !!to.closest('#view-play .osdesk:not(.osmobmat)');
  const kf = matArc(b, {r:{left:b.left, top:b.top, width:b.width * s}, tilt:0}, sp,
    {arc:o.arc ?? (shop ? 36 : 60), levelThroughout:o.settleOnly});
  if (!kf){ fin(); return; }
  if (drag){
    const identity = new DOMMatrix();
    kf.forEach((key, i) => {
      const t = Math.min(1, i / (kf.length - 1) * 2.4);
      const pose = matDragMix(drag.matrix, identity, t * t * (3 - 2 * t));
      key.transform = new DOMMatrix(key.transform).multiply(pose).toString();
    });
  }
  if (o.settleOnly){
    // Level the card on the way back while its projected center follows a straight line.
    const center = new DOMPoint(b.width/2, b.height/2);
    const points = kf.map(({transform}) => center.matrixTransform(new DOMMatrix(transform)));
    const first = points[0], last = points.at(-1);
    kf.forEach((key, i) => {
      const t = i / (kf.length-1), p = points[i];
      const x = (1-t)*first.x/first.w + t*last.x/last.w;
      const y = (1-t)*first.y/first.w + t*last.y/last.w;
      key.transform = new DOMMatrix().translate(x-p.x/p.w, y-p.y/p.w).multiply(new DOMMatrix(key.transform)).toString();
    });
  }
  MATLANDS.add(L);
  const dur = o.dur || (shop ? 560 : 850);
  const cast = g._osGripShadow;
  if (cast){
    const duration = Math.min(160, dur), fade = {duration, delay:dur - duration, fill:'forwards'};
    const timing = {duration:dur, easing:MAT_EASE, fill:'both'};
    const light = kf.map((key, i) => matCastLight(new DOMMatrix(key.transform), b, 1 - i / (kf.length - 1)));
    cast.style.left = b.left + 'px';
    cast.style.top = b.top + 'px';
    cast.animate(light.map(({x, y, blur}) => ({translate:`${x}px ${y}px`, filter:`blur(${blur}px)`})), timing);
    cast.firstElementChild.animate(light.map(({transform}) => ({transform})), timing);
    cast.animate([{opacity:bazaarShadow(1).opacity}, {opacity:0}], fade);
    contact = matContactShadow(to, sp);
    contact?.animate([{opacity:0}, {opacity:1}], {...fade, fill:'both'});
  }
  const flight = g.animate(kf, {duration:dur, easing:MAT_EASE, fill:'forwards'});
  if (o.settleOnly) closeRoom = matFanLandingRoom(to, dur);
  flight.oncancel = fin;
  flight.onfinish = () => {
    const t = fin();
    if (o.settleOnly || !t?.isConnected) return;
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
  if (!key || !el.matches('#view-play .osdesk:not(.osmobmat) .osmkt .market > .mcard, #view-play .osdesk:not(.osmobmat) .osmkt .market > .mirwrap > .mcard')) return false;
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
  const p = MATDRAG.p;
  if (p?.drag){
    const card = matDragFind(p);
    if (card){ p.card = MATLIFT.src = card; card.classList.add('oslifted'); }
  }
  for (const L of MATLANDS){ const t = L.find && L.find(); if (t && t.isConnected){ t.style.visibility = 'hidden'; L.to = t; } }
  for (const [key, deal] of MATDEALS){
    const el = document.querySelector(`#view-play .osdesk:not(.osmobmat) .osmkt .market .mcard[data-ck="${CSS.escape(key)}"]`);
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
  return matFlightGeometry(matFlatRect(el), matFlatRect(dest), matTiltMatrix());
}
function matFlightGeometry(r, d, M){
  if (!r?.width || !d?.width || !M) return null;
  return {r, d, pre:(g, origin) => {
    const o = origin || getComputedStyle(g).transformOrigin.split(' ').map(parseFloat);
    const x = r.left + (o[0] || 0), y = r.top + (o[1] || 0);
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
  const pay = ev.price > 0 && shopCoinEnabled();
  if (!document.querySelector('#view-play .osshop') || (i !== seat() && !(pay && PP() && !G.net))) return false;
  const list = [{n:ev.on || ev.n, look:ev.n, el:src && src.el}, ...(ev.pair || []).map(n => ({n, look:n, el:null}))];
  list.forEach((x, m) => {
    const find = () => matSpotOf(x.n, ev.k, i), to = find();
    let g = null, done = null;
    if (m === 0 && MATLIFT.held){
      g = MATLIFT.held.g; MATLIFT.held = null;
      const owner = MATLIFT.src;
      done = () => matLiftDone(owner);
    }
    else if (src && src.r && src.r.width){ const f = flyer(x.el || x.look, ev.k); g = f.g; flyEl(g, src.r, src.r.width, src.r.height, LAYER.flight, f.ctx); g.style.overflow = ''; }
    if (!g){ if (!m && pay) shopCoinPay(i, ev, to); return; }
    const land = () => matLand(g, find() || to, {done, find});
    const go = () => {
      g.style.opacity = '';
      if (m || !pay){ land(); return; }
      const pending = {find, to};
      if (to) to.style.visibility = 'hidden';
      MATLANDS.add(pending);
      const game = G, round = G.round;
      // Wait until an early click's inspection glide stops, so the payment hits the resting card.
      Promise.resolve(g._shopLift?.finished).catch(() => {}).then(() => shopCoinPay(i, ev, g)).then(() => {
        MATLANDS.delete(pending);
        if (G === game && G.round === round && matShopOn()) land();
        else { g._osGripShadow?.remove(); g.remove(); if (pending.to) pending.to.style.visibility = ''; done?.(); }
      });
    };
    if (m === 0 && !j) go(); else { g.style.opacity = '0'; setTimeout(go, (j + m) * 220); }
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
  const owner = MATLIFT.src;
  const done = () => {
    matLiftDone(owner);
    if (h.fanPile && !document.querySelector('#view-play .osdeckfan')){
      const pile = document.querySelector(h.fanPile === 'bought' ? '#view-play .osseat.me .osbought' : '#view-play .osseat.me .osdeck');
      matOpenOwnPile(pile);
    }
  };
  matLand(h.g, matDiscardSpot(name), {done, find:() => matDiscardSpot(name)});
  return true;
}

/* ---------- the desktop mat: inspect shop cards and preview Mobilize cards ----------
   The shop highlights on hover and opens an inspector on click. In Mobilize, a brief hover lifts a readable copy;
   neighboring deck cards make room, then return when the mouse leaves.
   Drag: press a market card (or one of yours: Caravan, deck or bought pile) and move it MAT_DRAG_PX; a flat copy follows
   the cursor. A market card you can buy lights your row: let go in it and the card's own Buy button is pressed, so the
   usual buy path, its picks (Mason's Guild, Discard Writ) and the landing run (matBuyFlight takes the copy from
   MATLIFT.held). Your own card lights the discard: let go there and its Sell button is pressed (matSellFlight). When it
   can't go, the reason shows under the cursor and nothing lights. Let go anywhere else, or press Esc: it flies back
   (matLiftUnheld). The phone keeps tap to lift. (The Mobilize drag, js/ui/10-mobilize.js, reorders a list in place;
   this one carries a card to a target and hands it to the buy and sell flights.) */
const MAT_DRAG_PX = 6, MAT_DRAG_LIFT = 120, MAT_DRAG_TURN = 280;
const MATDRAG = {p:null, eat:false};
// Shop cards and Mobilize cards are selected in place.
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
function matDragWhat(card){
  const S = seat(), turn = G.passed[S] ? 'You passed' : cur(G) !== S ? 'Not your turn' : '';
  if (card.closest('.osmkt')){
    const buy = card.querySelector(':scope > button[data-act="buy"]'); if (!buy) return null;
    return {buy, ok:!buy.disabled, why:buy.disabled ? turn || buy.textContent.trim() : ''};
  }
  if (!card.matches('.osdeckfan-card') && (!card.closest('.osseat.me') || !card.matches('.oscar, .ostop'))) return null;
  const sell = card.querySelector(':scope > [data-act^="sell-"]'), why = turn || (sell ? '' : "Can't be sold");
  return {sell, ok:!why, why};
}
function matDragPlanePose({r, tilt, rot}, left, top){
  const x = r.width / 2, y = r.height / 2;
  return new DOMMatrix().translate(-left, -top).multiply(matTiltMatrix(tilt))
    .translate(r.left + x, r.top + y).rotate(rot || 0).translate(-x, -y);
}
function matContactShadow(card, pose){
  // A stack's lowest card already casts a stationary shadow.
  if (card.matches('.ospile-stock:has(>.osedge)>.ostop')) return null;
  const {left, top, width, height} = pose.r;
  const contact = document.createElement('div');
  contact.className = 'osbazaar-contact-fade';
  contact.setAttribute('aria-hidden', 'true');
  const slot = card.closest('.osdeckfan-row > .osfanslot, .osmob-fan-row > .osfanslot');
  if (slot){
    Object.assign(contact.style, {position:'absolute', left:'0', top:'0', width:width+'px', height:height+'px'});
    slot.append(contact);
    return contact;
  }
  Object.assign(contact.style, {left:left+'px', top:top+'px', width:width+'px', height:height+'px',
    zIndex:LAYER.cardPop-2, transform:matDragPlanePose(pose, left, top).toString()});
  document.body.appendChild(contact);
  return contact;
}
function matDragStart(p, e){
  const card = p.card, from = p.inspectorPose || matPoseOf(card);
  if (!from) return;
  if (p.inspector) closePeek(true);
  p.drag = true; MATDRAG.eat = true;
  const r = from.r, point = from.point || matGrabPoint(from, p.x0, p.y0);
  p.size = {width:r.width, height:r.height};
  p.left = p.x0 - point.x; p.top = p.y0 - point.y;
  const {g, ctx} = flyer(card, card.classList.contains('u') ? 'u' : 'b');
  flyEl(g, {left:p.left, top:p.top}, r.width, r.height, LAYER.cardPop, ctx);
  g.style.overflow = ''; g.style.transformOrigin = '0 0'; g.classList.add('osdrag');
  g.querySelector(':scope > .cface')?.style.setProperty('box-shadow', 'none');
  p.g = g; MATLIFT.src = card; MATLIFT.ck = card.dataset.ck || null; MATLIFT.held = null; card.classList.add('oslifted');
  const fan = card.closest('.osdeckfan')?._cardLayout;
  if (fan?.slots.length > 1){
    const box = card.getBoundingClientRect();
    p.reorder = {fan, original:[...fan.slots], held:card.parentElement,
      dx:p.inspector ? 0 : box.left + box.width/2 - p.x0,
      dy:p.inspector ? 0 : box.top + box.height/2 - p.y0};
  }
  document.body.classList.add('osdragging');
  const shadowEl = g._osGripShadow = matGripShadow(p, LAYER.cardPop - 1);
  const raised = bazaarShadow(1), physical = !reduceMotion();
  const turn = from.rot || 0;
  const pickup = physical ? bazaarTiming.dragPickup : MAT_DRAG_LIFT;
  const turnTime = turn ? Math.max(MAT_DRAG_TURN, pickup * 1.5) : pickup;
  shadowEl.style.opacity = raised.opacity;
  if (!reduceMotion()){
    const fade = {duration:pickup, easing:'ease-out'};
    shadowEl.animate([{opacity:0}, {opacity:raised.opacity}], {...fade, fill:'backwards'});
    if (!p.inspector){
      const contact = p.contact = matContactShadow(card, from);
      if (contact) contact.animate([{opacity:1}, {opacity:0}], {...fade, fill:'forwards'}).onfinish = () => contact.remove();
    }
  }
  p.target = p.w.ok ? document.querySelector(p.w.buy ? '#view-play .osdesk .osseat.me' : '#view-play .osdesk .osdisc') : null;
  if (p.fanPile && p.target){
    const r = p.target.getBoundingClientRect();
    const cue = document.createElement('div');
    cue.className = 'osdeckfan-discard';
    cue.textContent = 'Discard';
    Object.assign(cue.style, {left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px',
      zIndex:LAYER.cardPop-1});
    document.body.appendChild(cue);
    p.target = p.discardCue = cue;
  }
  if (p.target) p.target.classList.add('osdrop');
  if (!p.reorder && !p.w.ok && p.w.why){ p.tag = document.createElement('div'); p.tag.className = 'osdragwhy'; p.tag.textContent = p.w.why; p.tag.style.zIndex = LAYER.cardPop + 1; document.body.appendChild(p.tag); }
  sfx.pick();
  if (physical){
    const initial = from.matrix || matDragPlanePose({...from, rot:0}, p.left, p.top);
    p.physical = {initial, point, width:r.width, height:r.height, turn, turnTime, began:performance.now(),
      x:p.x0, y:p.y0, pitch:0, yaw:0, roll:0};
    matDragPhysicalPaint(p, p.physical.began);
    try{ $('view-play').setPointerCapture(p.pid); }catch(e){}
  } else {
    if (!reduceMotion()){
      const b = g.getBoundingClientRect(), kf = from.matrix ?
        [{transform:from.matrix.toString()}, {transform:'none'}] : matArc(b, from, {r:b, tilt:0}, {arc:0});
      if (kf){
        if (turn) kf.forEach(key => { key.transform = matPinGrab(new DOMMatrix(key.transform), point).toString(); });
        g._shopLift = g.animate(kf, {duration:turnTime, easing:turn ? 'ease-in-out' : MAT_EASE});
      }
    }
    matDragShadowPaint(p, from.matrix || (reduceMotion() ? new DOMMatrix() : matDragPlanePose(from, p.left, p.top)));
  }
  matDragMove(p, e);
  return true;
}
function matUnprojectPoint(m, x, y){
  const a = m.m11 - x * m.m14, b = m.m21 - x * m.m24, c = x * m.m44 - m.m41;
  const d = m.m12 - y * m.m14, e = m.m22 - y * m.m24, f = y * m.m44 - m.m42;
  const det = a * e - b * d;
  return Math.abs(det) > 1e-6 ? {x:(c * e - b * f) / det, y:(a * f - c * d) / det} : {x, y};
}
function matScreenMatrix(el){
  const transform = getComputedStyle(el).transform;
  return new DOMMatrix(transform === 'none' ? undefined : transform);
}
function matInspectGrip(face, x, y){
  const width = face.offsetWidth, height = face.offsetHeight;
  if (!width || !height) return null;
  const pose = matScreenMatrix(face), box = face.getBoundingClientRect();
  const corners = [[0, 0], [width, 0], [0, height], [width, height]]
    .map(([x, y]) => new DOMPoint(x, y).matrixTransform(pose));
  const left = box.left - Math.min(...corners.map(p => p.x / p.w));
  const top = box.top - Math.min(...corners.map(p => p.y / p.w));
  const point = matUnprojectPoint(pose, x - left, y - top);
  const matrix = new DOMMatrix().translate(left - x + point.x, top - y + point.y).multiply(pose);
  return {r:{left, top, width, height}, point, matrix};
}
// Unproject the mouse onto the plane, then undo the card's turn to find the point on its face.
function matGrabPoint(pose, x, y){
  const m = pose.tilt && matTiltMatrix(), r = pose.r;
  if (m) ({x, y} = matUnprojectPoint(m, x, y));
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
  if (!p.frame) p.frame = requestAnimationFrame(now => matDragPaint(p, now));
}
function matDragPaint(p, now){
  p.frame = 0;
  if (p !== MATDRAG.p) return;
  if (!p.card.isConnected){ const c = matDragFind(p); if (c){ p.card = c; MATLIFT.src = c; c.classList.add('oslifted'); } }   // redrawn: keep its spot empty
  const over = matDragOver(p, {clientX:p.x, clientY:p.y});
  if (!over) matPlaceShopFanCard(p);
  p.g.style.translate = `${p.x - p.x0}px ${p.y - p.y0}px`;
  let moving;
  if (p.physical) moving = matDragPhysicalPaint(p, now);
  else {
    matDragShadowPaint(p, matScreenMatrix(p.g));
    moving = p.g._shopLift?.playState === 'running';
  }
  if (moving) p.frame = requestAnimationFrame(next => matDragPaint(p, next));
  if (p.tag) p.tag.style.translate = `${p.x + 14}px ${p.y + 20}px`;
  if (p.target) p.target.classList.toggle('osover', over);
}
function matDragMix(a, b, t){
  const end = b.toFloat64Array();
  return new DOMMatrix(a.toFloat64Array().map((value, i) => value + (end[i] - value) * t));
}
function matPinGrab(matrix, point){
  const anchor = new DOMPoint(point.x, point.y).matrixTransform(matrix);
  return new DOMMatrix().translate(point.x - anchor.x / anchor.w, point.y - anchor.y / anchor.w).multiply(matrix);
}
// Reproject the exact grabbed pixel after applying perspective so only the free edges swing.
function matDragPhysicalPaint(p, now){
  const d = p.physical, t = bazaarTiming, {point} = d;
  const dt = Math.max(1, Math.min(48, d.last == null ? 16 : now - d.last));
  const x = p.x ?? p.x0, y = p.y ?? p.y0;
  const velocity = delta => Math.max(-1, Math.min(1, delta / dt / .92));
  const sideways = velocity(x - d.x), vertical = velocity(y - d.y);
  const damping = 1 - Math.exp(-dt * 3 / Math.max(1, t.dragSettle));
  d.pitch += (vertical * t.dragLean * .74 - d.pitch) * damping;
  d.yaw += (-sideways * t.dragLean - d.yaw) * damping;
  d.roll += (sideways * t.dragLean * .48 - d.roll) * damping;
  d.last = now; d.x = x; d.y = y;
  const rise = Math.max(0, Math.min(1, (now - d.began) / Math.max(1, t.dragPickup)));
  const lift = 1 - (1 - rise) ** 3;
  const perspective = new DOMMatrix(); perspective.m34 = -1 / Math.max(460, d.width * 4);
  const held = new DOMMatrix().translate(point.x, point.y).multiply(perspective)
    .rotate(7 + d.pitch, d.yaw, d.roll).scale(p.inspector ? 1 : 1+t.dragGrow/100).translate(-point.x, -point.y);
  const matrix = matDragMix(d.initial, held, lift);
  const turnProgress = Math.min(1, (now - d.began) / Math.max(1, d.turnTime));
  if (d.turn){
    const angle = d.turn * (1 - turnProgress ** 2 * (3 - 2 * turnProgress));
    const cx = d.width / 2, cy = d.height / 2;
    matrix.translateSelf(cx, cy).rotateSelf(angle).translateSelf(-cx, -cy);
  }
  d.matrix = matPinGrab(matrix, point);
  p.g.style.transform = d.matrix.toString();
  matDragShadowPaint(p, d.matrix);
  return rise < 1 || turnProgress < 1 || Math.max(Math.abs(d.pitch), Math.abs(d.yaw), Math.abs(d.roll)) > .04;
}
function matCastLight(pose, {width, height}, lift = 1){
  const center = new DOMPoint(width / 2, height / 2).matrixTransform(pose);
  const edge = new DOMPoint(width, height / 2).matrixTransform(pose);
  const scale = 2 * Math.hypot(edge.x / edge.w - center.x / center.w, edge.y / edge.w - center.y / center.w) / 150;
  const rest = bazaarShadow(0), raised = bazaarShadow(1);
  const blend = (contact, elevated) => contact + (elevated * scale - contact) * lift;
  // The raised projection flattens onto the card's own plane before the contact shadow takes over.
  const projection = new DOMMatrix();
  projection.m31 = .55 * lift; projection.m32 = .75 * lift;
  projection.m41 = -projection.m31 * center.z / center.w;
  projection.m42 = -projection.m32 * center.z / center.w;
  return {transform:projection.multiply(pose).toString(),
    x:blend(1, raised.offset * .55), y:blend(rest.offset, raised.offset), blur:blend(rest.blur, raised.blur)};
}
function matGripShadow(p, zIndex){
  const el = document.createElement('div');
  el.className = 'osbazaar-grip-shadow';
  el.setAttribute('aria-hidden', 'true');
  el.append(document.createElement('div'));
  Object.assign(el.style, {left:p.left+'px', top:p.top+'px', width:p.size.width+'px',
    height:p.size.height+'px', zIndex, opacity:bazaarShadow(1).opacity});
  document.body.appendChild(el);
  return p.shadowEl = el;
}
function matDragShadowPaint(p, pose){
  const {transform, x, y, blur} = matCastLight(pose, p.size), el = p.shadowEl;
  el.firstElementChild.style.transform = transform;
  el.style.translate = `${(p.x ?? p.x0)-p.x0+x}px ${(p.y ?? p.y0)-p.y0+y}px`;
  el.style.filter = `blur(${blur}px)`;
}
// the dragged card as it is on the page now: a redraw (a toast, a timer) may have replaced its element since the press
function matDragFind(p){
  if (p.card.isConnected && (p.ck ? p.card.dataset.ck === p.ck : (p.card.querySelector('.cfm')?.dataset.n ?? null) === p.name)) return p.card;
  if (p.fanPile) return null;
  if (p.ck) return ckEl(p.ck);
  const me = document.querySelector('#view-play .osdesk .osseat.me'); if (!me || !p.name) return null;
  return [...me.querySelectorAll(p.sel)].find(e => { const f = e.querySelector('.cfm'); return f && f.dataset.n === p.name; }) || null;
}
// let go: on its target the card's own button makes the move (its flight takes the copy); else the copy flies home
function matDragDrop(p, ok, {reset = false, cancel = false} = {}){
  if (p.frame) cancelAnimationFrame(p.frame);
  MATDRAG.p = null; document.body.classList.remove('osdragging');
  if (p.tag) p.tag.remove();
  p.discardCue?.remove();
  if (p.target) p.target.classList.remove('osdrop', 'osover');
  if (p.physical && $('view-play').hasPointerCapture(p.pid)) $('view-play').releasePointerCapture(p.pid);
  if (p.reorder?.fan.overlay.isConnected){
    const {fan, original, held} = p.reorder;
    const keep = !reset && !cancel && !ok && matPlaceShopFanCard(p);
    if (!keep) matArrangeShopFan(fan, original, held);
    else if (fan.slots.some((slot, i) => slot !== original[i])){
      const piles = (ui.shopPileOrder ??= {});
      (piles[fan.player] ??= {})[fan.pile] = {round:G.round, cards:fan.slots.map(slot => slot.firstElementChild.querySelector('.cfm').dataset.n)};
      fan.dirty = true;
    }
  }
  if (reset){
    p.shadowEl?.remove(); p.contact?.remove();
    if (p.g) p.g.remove();
    MATDRAG.eat = false;
    matLiftShow();
    return;
  }
  if (!p.g) return;
  const matrix = p.physical?.matrix || matScreenMatrix(p.g);
  p.g._shopLift?.cancel();
  p.g.style.transform = matrix.toString();
  matDragShadowPaint(p, matrix);
  const left = p.left + p.x - p.x0, top = p.top + p.y - p.y0;
  p.g.style.setProperty('left', left + 'px', 'important');
  p.g.style.setProperty('top', top + 'px', 'important');
  p.g.style.translate = '';
  p.g._osDragPose = {matrix, box:{left, top, ...p.size}};
  MATLIFT.held = {g:p.g, fanPile:p.fanPile};
  const c = matDragFind(p), w = c && matDragWhat(c);
  if (c && c !== p.card){ MATLIFT.src = c; c.classList.add('oslifted'); }
  if (ok && w && w.ok && G && G.phase === 'shop'){ const b = w.buy || w.sell; MATDRAG.eat = false; b.click(); MATDRAG.eat = true; }
  matLiftUnheld();   // nothing took it (refused, or a pick to make first): back to its spot
}
function matDragArm(e, card, inspector, face){
  if (e.button > 0 || MATDRAG.p) return;
  const inspectorPose = face && matInspectGrip(face, e.clientX, e.clientY);
  if (inspector && !inspectorPose) return;
  const w = matDragWhat(card) || (inspector && {ok:false}); if (!w) return;
  const f = card.querySelector('.cfm');
  const fanPile = card.closest('.osdeckfan')?.dataset.pile;
  MATDRAG.p = {card, w, fanPile, inspector, inspectorPose, pid:e.pointerId, x0:e.clientX, y0:e.clientY, drag:false, ck:card.dataset.ck || null, name:f ? f.dataset.n : null,
    sel:card.classList.contains('oscar') ? '.oscar' : fanPile === 'bought' || card.closest('.osbought') ? '.osbought .ostop' : '.osdeck .ostop'};
}
$('view-play').addEventListener('pointerdown', e => {
  const card = matDeskShopCard(e.target) || e.target.closest('.osdeckfan-card');
  if (card && !e.target.closest('.ostag, .osright button')) matDragArm(e, card);
});
window.addEventListener('pointermove', e => {
  const p = MATDRAG.p; if (!p || e.pointerId !== p.pid) return;
  if (!p.drag){
    if (Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < MAT_DRAG_PX) return;   // under it: a plain click (it does nothing)
    const c = matDesk() && matDragFind(p), w = c && (matDragWhat(c) || (p.inspector && {ok:false}));
    if (!w || c.inert || (p.inspector && p.inspector !== peekEl)){ MATDRAG.p = null; return; }
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
window.addEventListener('pointercancel', () => { const p = MATDRAG.p; if (p && p.drag) matDragDrop(p, false, {cancel:true}); else MATDRAG.p = null; MATDRAG.eat = false; });
document.addEventListener('keydown', e => { const p = MATDRAG.p; if (e.key === 'Escape' && p && p.drag){ e.stopImmediatePropagation(); matDragDrop(p, false, {cancel:true}); MATDRAG.eat = false; } }, true);
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
  if (!d || reduceMotion() || shopCoinEnabled()) return;
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
  const pay = shopCoinEnabled();
  if (!pay) matPurseSet(i, -(ev.price || 0), fr && fr.width ? fr : c.at);
  const tag = `${oppWho(i)} bought · $${ev.price}${ev.on ? ` · leveled ${dispName(ev.on)}` : ''}`;
  const n = ev.on || ev.n, w = ev._matWait;
  return matOppRise(c, src && src.fr ? fr : null, false, src?.rot)
    .then(() => oppHold(c.g, c.at, c.W, c.h, tag, i, MAT_OPP_HOLD))
    .then(() => {
      if (!pay) return;
      matPurseSet(i, -(ev.price || 0));
      return shopCoinPay(i, ev, c.g);
    })
    .then(() => new Promise(res => {
      // Covenant cards come along from the market spot, without a hold
      (ev.pair || []).forEach((pn, m) => {
        if (!src || !src.r || !src.r.width) return;
        const f = flyer(pn, ev.k); flyEl(f.g, src.r, src.r.width, src.r.height, LAYER.flight, f.ctx); f.g.style.overflow = ''; f.g.style.opacity = '0';
        setTimeout(() => { f.g.style.opacity = ''; matLand(f.g, matSpotOf(pn, ev.k, i)); }, (m + 1) * 220);
      });
      const to = matSpotOf(n, ev.k, i);
      if (to) to.style.visibility = 'hidden';
      matLand(c.g, to, {s:c.s, find:() => matSpotOf(n, ev.k, i), done:() => { matOppShow(i, w, n, ev.k); if (!pay) try{ sfx.coin(0.35); }catch(e){} res(); }});
    }));
}
// oppSellStep's step on the mat: the sold card lifts off their side, holds, and lands on the discard pile (a Moisture
// Harvester on its shop pile); its coin drops into their purse
function matOppSell(i, ev, src){
  if (i === seat() || !matShopOn()) return null;
  const c = matOppCard(ev.n, ev.k, null); if (!c) return null;
  const gain = ev.gain ?? SELL_PRICE, coins = shopCoinEnabled();
  return matOppRise(c, src && src.fr, src && src.flat)
    .then(() => oppHold(c.g, c.at, c.W, c.h, `${oppWho(i)} sold · +$${gain}`, i, MAT_OPP_HOLD))
    .then(() => new Promise(res => {
      if (coins) shopCoinSale(i, ev, c.g);
      matLand(c.g, matDiscardSpot(ev.n), {s:c.s, find:() => matDiscardSpot(ev.n), done:() => { matPurseSet(i, gain); if (!coins) try{ sfx.coin(0.35); }catch(e){} res(); }});
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
  const who = PP() && !G.net && !ui.bazaarMobilize ? `${esc(nm(S))}'s deck` : 'Your deck';
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
function matFanPoses(n, w, h, F = MAT_FAN){
  const mid = (n - 1) / 2, gap = n > 1 ? Math.min(F.gap, (F.span - 1) / (n - 1)) * w : 0;
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
function matPileFanShape(){
  const gap = bazaarTiming.pileCardSpacing / 100, step = bazaarTiming.pileFanAngle;
  return {gap, step, drop:MAT_FAN.drop * step / MAT_FAN.step, span:Math.max(MAT_FAN.span, 1 + 7 * gap)};
}
function matPileFanColumns(n, w, h, width, shape){
  let columns = Math.min(8, Math.max(1, n));
  while (columns > 1 && matFanPoses(columns, w, h, shape).w > width) columns--;
  return columns;
}
function matPileMotion(n, opening){
  const total = opening ? bazaarTiming.pileOpen : bazaarTiming.pileClose;
  const spread = Math.min(opening ? Infinity : total * .42, bazaarTiming.pileGap * 5);
  const gap = spreadGap(n, spread, bazaarTiming.pileGap);
  return {gap, duration:opening ? total : total - Math.max(0, n - 1) * gap};
}
// the transforms (origin top left) that turn a w x h box about its centre, and put a fan card in its pose
const matRotTf = (rot, w, h) => `translate(${w / 2}px, ${h / 2}px) rotate(${rot}deg) translate(${-w / 2}px, ${-h / 2}px)`;
const matFanTf = (p, w, h) => `translate(${p.x}px, ${p.y}px) ${matRotTf(p.rot, w, h)}`;
// where a card rests, for a flight or the hover read: on the mat its flat rect in the tilt; in the fan its pose; else its box
function matPoseOf(el, flat){
  if (!el || !el.isConnected) return null;
  if (el.closest('.osplane')){
    const r = flat ? flat.get(el) : matFlatRect(el); if (!r || !r.width) return null;
    return matTablePose(el, r);
  }
  const slot = el.closest('.osfanslot'), p = slot && slot._pose;
  if (p){ const f = slot.parentElement.getBoundingClientRect(), c = slot.firstElementChild || el;
    return {r:{left:f.left + p.x, top:f.top + p.y, width:c.offsetWidth, height:c.offsetHeight}, tilt:0, rot:p.rot}; }
  const r = el.getBoundingClientRect(); return r.width ? {r, tilt:0, rot:0} : null;
}
function matTablePose(el, r){
  const sideways = el.matches('#view-play .osdesk .osmkt .market .mcard.leaving, #view-play .osdesk .osdisc .mpcards');
  if (!sideways) return {r, tilt:1, rot:0};
  return {r:{left:r.left + (r.width - r.height) / 2, top:r.top + (r.height - r.width) / 2, width:r.height, height:r.width}, tilt:1, rot:90};
}
const MAT_FAN_SHIFT_EASE = 'cubic-bezier(.28,.62,.27,1)';
// Measure the gap before shifting any cards. The return uses the same positions.
function matFanInspectRoom(card){
  const slot = card?.closest('.osdeckfan-row > .osfanslot, .osmob-fan-row > .osfanslot, .osdeskmob #mz-deck > .mzc');
  const vertical = !!slot?.matches('.mzc');
  const face = card?.querySelector('.cface');
  if (!slot?.nextElementSibling || !face || (vertical && slot !== card)) return null;
  const slots = [...slot.parentElement.children];
  const faces = slots.slice(slots.indexOf(slot) + 1).map(neighbor => vertical ? neighbor : neighbor.firstElementChild);
  const bounds = faces.map(face => face.getBoundingClientRect()), here = card.getBoundingClientRect();
  const neighbors = faces.map(face => ({face, translate:face.style.translate}));
  if (vertical){
    // Clear the lower cards sideways without disturbing their fight order.
    const attached = card.querySelector('.mztk');
    const edge = Math.min(here.left, attached?.getBoundingClientRect().left ?? here.left);
    const left = Math.min(...bounds.map(r => r.left)) - here.right - 6;
    const right = Math.max(...bounds.map(r => r.right)) - here.left + 6;
    const dx = edge + left >= 8 ? left : right;
    const roomBelow = Math.max(0, innerHeight - 12 - Math.max(...bounds.map(r => r.bottom)));
    return {slot, face, dx, dy:0, apart:roomBelow ? `0px ${Math.min(roomBelow, here.width * .14)}px` : null, neighbors, vertical};
  }
  const gap = here.right - Math.min(...bounds.map(r => r.left)) + 5;
  if (gap <= 0) return null;
  const right = Math.max(0, innerWidth - 10 - Math.max(...bounds.map(r => r.right)));
  const shift = Math.min(gap * .65, right);
  let dx = shift - gap, dy = 0;
  if (here.left + dx < 8){
    const up = Math.min(...bounds.map(r => r.top)) - here.bottom - 5;
    const down = Math.max(...bounds.map(r => r.bottom)) - here.top + 5;
    dx = 0;
    dy = here.top + up >= 8 || here.bottom + down > innerHeight - 8 ? up : down;
  }
  return {slot, face, dx, dy, apart:!dy && shift ? shift + 'px 0' : null, neighbors};
}
// Slide along the row, then swap layers once the cards' edges clear.
function matFanInspectPath(box, home, glideTime, opening, room){
  if (!room?.slot.isConnected || !glideTime) return null;
  const {left, top, width, height} = home.r;
  const clear = {...home, r:{left:left + room.dx, top:top + room.dy, width, height}};
  const center = {r:box, tilt:0};
  const slideTime = opening ? bazaarTiming.pileRoomOpen : bazaarTiming.pileRoomClose;
  const duration = glideTime + slideTime;
  const switchAt = opening ? slideTime : glideTime;
  const seam = switchAt / duration;
  const options = {arc:0, levelThroughout:true, easeTravel:true};
  const glide = matArc(box, opening ? clear : center, opening ? center : clear, options);
  if (!glide) return null;
  const rest = matArc(box, home, home, options)[0];
  const steps = glide.map((key, i) => ({...key, offset:(opening ? seam : 0) + (opening ? 1 - seam : seam) * i / (glide.length-1)}));
  if (opening) steps.unshift({...rest, offset:0, easing:MAT_FAN_SHIFT_EASE});
  else {
    steps.at(-1).easing = MAT_FAN_SHIFT_EASE;
    steps.push({...rest, offset:1});
  }
  return {room, frames:steps, opening, seam, switchAt, duration};
}
function matFanReleaseInspectRoom(front){
  front?._fanInspect?.clean();
  const room = front?._fanRoom;
  if (!room) return;
  if (room.apart) for (const {face, translate} of room.neighbors) face.style.translate = translate;
  front._fanRoom = null;
}
function matFanInspectFlight(front, box, {room, frames, opening, seam, switchAt, duration}){
  const {slot, neighbors, apart} = room;
  front._fanRoom = room;
  const below = document.createElement('div');
  below.className = 'osfan-flight-depth';
  below.setAttribute('aria-hidden', 'true');
  Object.assign(below.style, {width:box.width+'px', height:box.height+'px'});
  below.append(room.face.cloneNode(true));
  slot.append(below);
  const row = (room.vertical ? slot : slot.parentElement).getBoundingClientRect();
  const local = (room.vertical ? new DOMMatrix() : matScreenMatrix(slot).inverse())
    .translate(box.left - row.left, box.top - row.top);
  const timing = {duration, fill:'both'};
  const visibility = (before, after) => [
    {visibility:before, offset:0, easing:'steps(1, end)'},
    {visibility:after, offset:seam},
    {visibility:after, offset:1}
  ];
  const motion = front.animate(frames, timing);
  const parts = [
    front.animate(visibility(opening ? 'hidden' : 'visible', opening ? 'visible' : 'hidden'), timing),
    below.animate(visibility(opening ? 'visible' : 'hidden', opening ? 'hidden' : 'visible'), timing),
    below.animate(frames.map(key => ({...key, transform:local.multiply(new DOMMatrix(key.transform)).toString()})), timing)
  ];
  if (apart) for (const {face, translate} of neighbors){
    const rest = translate || '0px 0';
    parts.push(face.animate([
      {translate:opening ? rest : apart, offset:0, easing:MAT_FAN_SHIFT_EASE},
      {translate:apart, offset:seam, easing:MAT_FAN_SHIFT_EASE},
      {translate:opening ? apart : rest, offset:1}
    ], timing));
  }
  const sync = document.timeline.currentTime;
  for (const animation of [motion, ...parts]) animation.startTime = sync;
  const clean = () => {
    parts.forEach(animation => animation.cancel());
    below.remove();
    if (front._fanInspect?.clean === clean) front._fanInspect = null;
  };
  front._fanInspect = {parts, seam, switchAt, clean};
  motion.addEventListener('finish', () => {
    if (front._fanRoom === room && apart){
      const keepGap = opening && motion.playbackRate > 0;
      for (const {face, translate} of neighbors) face.style.translate = keepGap ? apart : translate;
    }
    clean();
  }, {once:true});
  motion.addEventListener('cancel', clean, {once:true});
  return motion;
}
// Keep the returning card above the fan. Move only the cards that would cover its slot.
function matFanLandingRoom(card, duration){
  const slot = card.closest('.osdeckfan-row > .osfanslot, .osmob-fan-row > .osfanslot');
  if (!slot?.nextElementSibling) return;
  const slots = [...slot.parentElement.children];
  const foreground = slots.slice(slots.indexOf(slot) + 1);
  const {w, h} = slot.closest('.osdeckfan,#mz-bench')._cardLayout;
  const halfWidth = ({rot}) => {
    const angle = rot * Math.PI / 180;
    return (Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle))) / 2;
  };
  const rowLeft = slot.parentElement.getBoundingClientRect().left;
  const edge = rowLeft + slot._pose.x + w / 2 + halfWidth(slot._pose);
  const bounds = foreground.map(neighbor => {
    const {x, rot} = neighbor._pose, center = rowLeft + x + w / 2, half = halfWidth({rot});
    return {left:center - half, right:center + half};
  });
  const shift = Math.min(edge + 3 - Math.min(...bounds.map(b => b.left)),
    innerWidth - 10 - Math.max(...bounds.map(b => b.right)));
  return matLandingSpace(foreground.map(slot => slot.firstElementChild), shift, duration);
}
const MAT_LANDING_SPACE = new WeakMap();
function matLandingSpace(faces, shift, duration){
  if (shift <= 0 || !faces.length) return;
  const translate = shift + 'px 0';
  const openTime = Math.min(duration, bazaarTiming.pileRoomOpen);
  const moves = faces.map(face => {
    const from = getComputedStyle(face).translate;
    MAT_LANDING_SPACE.get(face)?.cancel();
    const open = face.animate([{translate:from}, {translate}], {duration:openTime,
      delay:Math.max(0, duration - openTime - 100), easing:MAT_FAN_SHIFT_EASE, fill:'both'});
    MAT_LANDING_SPACE.set(face, open);
    return {face, open};
  });
  return () => {
    for (const {face, open} of moves){
      if (MAT_LANDING_SPACE.get(face) !== open) continue;
      const from = getComputedStyle(face).translate;
      open.cancel();
      if (!face.isConnected) continue;
      const close = face.animate([{translate:from}, {translate:'0px 0'}],
        {duration:bazaarTiming.pileRoomClose, easing:MAT_FAN_SHIFT_EASE});
      MAT_LANDING_SPACE.set(face, close);
      close.onfinish = () => { if (MAT_LANDING_SPACE.get(face) === close) MAT_LANDING_SPACE.delete(face); };
    }
  };
}
function matPlaceShopFanCard(p){
  if (!p.reorder?.fan.overlay.isConnected) return false;
  const {fan, held, dx, dy} = p.reorder, {rows, positions, slots, w, h} = fan;
  const bounds = (rows.matches('#mz-bench') ? rows.parentElement : rows).getBoundingClientRect(), margin = 20;
  if (p.x < bounds.left - margin || p.x > bounds.right + margin ||
      p.y < bounds.top - margin || p.y > bounds.bottom + margin) return false;
  const boundsByRow = new Map([...rows.children].map(row => [row, row.getBoundingClientRect()]));
  const centers = positions.map(({row, pose}) => {
    const at = boundsByRow.get(row);
    return {x:at.left + pose.x + w/2, y:at.top + pose.y + h/2};
  });
  const current = slots.indexOf(held), target = closestCardSlot(centers, p.x + dx, p.y + dy, current);
  if (target !== current){
    const order = [...slots];
    order.splice(current, 1);
    order.splice(target, 0, held);
    matArrangeShopFan(fan, order, held);
  }
  return true;
}
function matArrangeShopFan(fan, order, held){
  const {slots, positions, w, h} = fan;
  const changed = order.flatMap((slot, i) => slot === slots[i] ? [] : [{slot, ...positions[i]}]);
  if (!changed.length) return;

  const animated = !reduceMotion(), before = new Map(), rowBounds = new Map();
  const bounds = row => {
    if (!rowBounds.has(row)) rowBounds.set(row, row.getBoundingClientRect());
    return rowBounds.get(row);
  };
  if (animated) for (const {slot, row} of changed){
    if (slot === held) continue;
    const from = bounds(slot.parentElement), to = bounds(row);
    before.set(slot, new DOMMatrix().translate(from.left-to.left, from.top-to.top).multiply(matScreenMatrix(slot)));
  }
  for (const {slot, pose} of changed){
    slot.getAnimations().forEach(animation => animation.cancel());
    slot._pose = pose;
    slot.style.transform = matFanTf(pose, w, h);
  }
  // Only the held card and any cards crossing rows need to change DOM position to preserve stacking order.
  for (let i = order.length - 1; i >= 0; i--){
    const slot = order[i], {row} = positions[i];
    const next = positions[i+1]?.row === row ? order[i+1] : null;
    if (slot.parentElement !== row || (slot === held && slot.nextElementSibling !== next))
      row.insertBefore(slot, next);
  }
  slots.splice(0, slots.length, ...order);
  for (const [slot, from] of before)
    slot.animate([{transform:from.toString()}, {transform:slot.style.transform}],
      {duration:bazaarTiming.pileShift, easing:MAT_FAN_SHIFT_EASE});
}
function matRefreshShopFan(request = false){
  const fan = $('view-play').querySelector(':scope > .osdeckfan')?._cardLayout;
  if (!fan) return;
  if (request) fan.layoutPending = true;
  if (fan.layoutPending && !fan.overlay.inert && !MATDRAG.p && !MATLIFT.src){
    fan.layoutPending = false;
    matLayoutShopFan(fan);
  }
}

function matLayoutShopFan(fan){
  const {overlay, rows, slots, baseWidth} = fan;
  const w = Math.round(baseWidth * bazaarTiming.pileCardSize / 100), h = w * 1037 / 750;
  const shape = matPileFanShape();
  Object.assign(fan, {w, h, positions:[]});
  overlay.style.setProperty('--os-deck-fan-w', w + 'px');
  overlay.style.setProperty('--os-deck-fan-h', h + 'px');
  if (!slots.length) return;
  const cardsPerRow = matPileFanColumns(slots.length, w, h, innerWidth - 76, shape);
  const content = document.createDocumentFragment();
  for (let start = 0; start < slots.length; start += cardsPerRow){
    const rowSlots = slots.slice(start, start + cardsPerRow), poses = matFanPoses(rowSlots.length, w, h, shape);
    const row = document.createElement('div');
    row.className = 'osdeckfan-row';
    row.style.width = poses.w + 'px'; row.style.height = poses.h + 'px';
    rowSlots.forEach((slot, i) => {
      slot.getAnimations().forEach(animation => animation.cancel());
      slot._pose = poses.poses[i];
      slot.style.transform = matFanTf(slot._pose, w, h);
      row.append(slot);
      fan.positions.push({row, pose:slot._pose});
    });
    content.append(row);
  }
  rows.replaceChildren(content);
  rows.classList.toggle('osdeckfan-scroll', rows.scrollHeight > rows.clientHeight + 1);
}

// The player's Shop piles spread from their spots using the Mobilize bench's fan geometry.
function matOpenOwnPile(button){
  if (!button?.matches('.osdesk .osseat.me :is(.osdeck,.osbought)') || !matShopOn()) return false;
  const view = $('view-play'), i = seat(), p = G.players[i], {order, purchases} = matDeskInventory(i, p.hand);
  const bought = button.classList.contains('osbought'), cards = bought ? purchases : order;
  const origin = () => matPoseOf(button.querySelector('.ostop,.osslot'));
  const ov = document.createElement('div');
  ov.className = 'osdeckfan';
  ov.dataset.pile = bought ? 'bought' : 'deck';
  ov.innerHTML = '<section class="osdeckfan-panel" role="dialog" aria-modal="true" aria-labelledby="osdeckfan-title"><header><h2 id="osdeckfan-title"></h2><button type="button" class="osdeckfan-close" aria-label="Close deck">×</button></header><div class="osdeckfan-rows"></div></section>';
  ov.querySelector('h2').textContent = bought ? 'Bought this shop' : deckName(i);
  const rows = ov.querySelector('.osdeckfan-rows'), close = ov.querySelector('.osdeckfan-close');
  if (bought) close.setAttribute('aria-label', 'Close bought cards');
  const baseWidth = Math.floor(Math.min(168, Math.max(100, (origin()?.r.width || 120) * 1.13), innerWidth / 5.1));
  let inspectRequest = 0;
  const inspect = async card => {
    const request = ++inspectRequest;
    const row = card.closest('.osdeckfan-row');
    if (!row) return;
    const shifts = [...row.children].flatMap(slot => slot.getAnimations()).filter(animation => animation.playState === 'running');
    if (shifts.length) await Promise.allSettled(shifts.map(animation => animation.finished));
    if (request === inspectRequest && card.isConnected && !ov.inert && !peekEl && !MATDRAG.p) openPeek(card, true);
  };
  const slots = cards.map(name => {
    const slot = document.createElement('div'), card = document.createElement('div');
    const kind = DEFS[name] ? 'u' : 'b', count = kind === 'u' ? p.hand[name] : p.gear[name];
    slot.className = 'osfanslot';
    card.className = 'mcard osdeckfan-card ' + kind;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', 'Inspect ' + dispName(name));
    card.innerHTML = cardFace(name, kind, count, true) + (canSell(G, i, kind, name) ? shopSellBtnHTML(name, kind) : '');
    card.addEventListener('click', e => { if (!e.target.closest('button')) inspect(card); });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); inspect(card); }
    });
    slot.append(card);
    return slot;
  });
  if (!cards.length) rows.innerHTML = bought
    ? '<p class="osdeckfan-empty">No cards bought this shop yet.</p>'
    : '<p class="osdeckfan-empty">No cards in your deck yet.</p>';
  const layout = ov._cardLayout = {overlay:ov, rows, slots, baseWidth, player:i, pile:ov.dataset.pile};
  view.append(ov);
  matLayoutShopFan(layout);
  close.focus({preventScroll:true});
  sfx.soft();

  const backdrop = opening => {
    const shade = opening ? 'rgba(12,8,5,.68)' : getComputedStyle(ov).backgroundColor;
    const shades = ['rgba(12,8,5,0)', shade];
    ov.getAnimations().forEach(animation => animation.cancel());
    return ov.animate((opening ? shades : shades.reverse()).map(backgroundColor => ({backgroundColor})),
      {duration:opening ? 220 : 280, easing:'ease-out', fill:opening ? 'backwards' : 'forwards'});
  };
  const getFlight = (slot, home, opening) => {
    const {w, h} = layout;
    const row = slot.parentElement.getBoundingClientRect(), base = {left:row.left, top:row.top, width:w, height:h};
    const to = {r:{left:row.left + slot._pose.x, top:row.top + slot._pose.y, width:w, height:h}, tilt:0, rot:slot._pose.rot};
    return matArc(base, opening ? home : to, opening ? to : home, {arc:0, levelThroughout:true});
  };
  const home = origin();
  if (!reduceMotion() && home){
    backdrop(true);
    const {duration, gap} = matPileMotion(slots.length, true);
    slots.forEach((slot, i) => {
      const frames = getFlight(slot, home, true);
      if (frames) slot.animate(frames, {duration, delay:i * gap, easing:MAT_EASE, fill:'backwards'});
    });
  }
  function shut(){
    if (ov.inert || peekEl) return;
    ov.inert = true;
    const done = () => {
      ov.remove();
      if (layout.dirty && matShopOn()) renderPlay();
      if (button.isConnected) button.focus({preventScroll:true});
    };
    const home = origin();
    if (reduceMotion() || !home){ done(); return; }
    const animations = [backdrop(false).finished];
    const layers = [home, ...[...button.querySelectorAll(':scope > .ospile-stock > .osedge')].map(edge => matPoseOf(edge)).filter(Boolean)];
    const {duration, gap} = matPileMotion(slots.length, false);
    slots.forEach((slot, i) => {
      const depth = slots.length - 1 - i;
      const frames = getFlight(slot, layers[Math.min(depth, layers.length - 1)], false);
      if (!frames) return;
      const playing = slot.getAnimations(), current = getComputedStyle(slot).transform;
      playing.forEach(a => a.cancel());
      const steps = playing.length ? [{transform:current}, frames.at(-1)] : frames;
      animations.push(slot.animate(steps, {duration, delay:i * gap, easing:MAT_EASE, fill:'both'}).finished);
    });
    Promise.allSettled(animations).then(done);
  }
  close.addEventListener('click', shut);
  ov.addEventListener('click', e => { if (e.target === ov) shut(); });
  ov.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ e.stopPropagation(); shut(); }
    if (e.key !== 'Tab') return;
    const last = slots.at(-1)?.firstElementChild || close;
    if (e.shiftKey && e.target === close){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && e.target === last){ e.preventDefault(); close.focus(); }
  });
  return true;
}
// a bench card slides from where it was (r0, a screen box, e.g. where it was dropped) to its pose, turning as it goes
function matFanFlip(el, r0, land){
  const slot = el.closest('.osfanslot'), p = slot && slot._pose; if (!p || !r0 || reduceMotion()) return;
  const w = el.offsetWidth, h = el.offsetHeight, f = slot.parentElement.getBoundingClientRect();
  if (!w || !h) return;
  const dx = r0.left + r0.width / 2 - (f.left + p.x + w / 2), dy = r0.top + r0.height / 2 - (f.top + p.y + h / 2);
  const rot = r0.rot ?? p.rot;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && rot === p.rot && Math.abs(r0.width - w) < 1) return;
  const from = matFanTf({x:p.x + dx, y:p.y + dy, rot}, w, h) +
    ` translate(${w/2}px,${h/2}px) scale(${r0.width/w},${r0.height/h}) translate(${-w/2}px,${-h/2}px)`;
  slot.animate([{transform:from}, {transform:matFanTf(p, w, h)}],
    {duration:land ? bazaarTiming.dragSettle : bazaarTiming.pileShift, easing:MAT_FAN_SHIFT_EASE});
}
function matMobDeskHTML(S, me, d, rows, items, who){
  const order = new Map((ui.mzBenchOrder?.[S] || []).map((key, i) => [key, i]));
  const sorted = [...items].sort((a, b) => (order.get(a.key) ?? Infinity) - (order.get(b.key) ?? Infinity));
  const bench = sorted.map(it => `<div class="osfanslot">${mzBenchCard(it)}</div>`).join('');
  const ai = !PP() && !G.net ? 'AI planning its deck…' : `${esc(nm(1 - S))}'s deck`;
  return `<div class="osshop osdesk osmobmat${MATMOB.lift ? ' oslifting' : ''}" aria-hidden="true"><div class="osplane"><div class="osinner">
    ${matSeatHTML(1 - S, 'mob')}
    ${matTraysHTML(matSweptDeck, matMobRow, ['', frozenHTML(S)], '<div class="dbtns ospass" aria-hidden="true"></div>')}
    ${matSeatHTML(S, 'mob')}
  </div></div></div>
  <div class="osmob osdeskmob"><div class="osmobdim" aria-hidden="true"></div>
    <div class="forces mz osmz" style="--n:${Math.max(1, d.length)};--tt:${d.reduce((t, u) => t + (u.gear ? 1 : 0) + (u.arm || 0) + (u.tr || 0) + (u.sh || 0), 0)}">
      <section class="mz-deck" aria-label="${who}"><h2 class="osmzhd">${who}</h2>${mzLimitsHTML(me, d)}
        <div class="mzstack" id="mz-deck">${rows || '<div class="mzempty">Drag units here from the bench</div>'}</div>
        ${d.length ? '<div class="osmz-first">Bottom card fights first</div>' : ''}
        ${ui.err ? `<p class="err" role="alert">${esc(ui.err)}</p>` : ''}
      </section>
      <div class="mobright">
        <section class="mz-bench" aria-label="Bench"><h2 class="osmzhd">Bench</h2>
          <div class="osmob-bench-scroll"><div class="mzstack osfan" id="mz-bench">${bench || '<div class="mzempty">Everything is in your deck</div>'}</div></div>
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
  MATMOB.layoutPending = false;
  const fan = mob.querySelector('#mz-bench.osfan'), slots = fan ? [...fan.querySelectorAll('.osfanslot')] : [];
  if (fan) fan._cardLayout = null;
  if (slots.length){
    const width = fan.parentElement.clientWidth - 26;
    const w = Math.round(Math.min(width, parseFloat(getComputedStyle(mob).getPropertyValue('--mw')) * .8 * bazaarTiming.pileCardSize / 100));
    if (w > 0){
      const h = w * 1037 / 750, shape = matPileFanShape();
      const columns = matPileFanColumns(slots.length, w, h, width, shape);
      const scroll = fan.parentElement.scrollTop;
      fan.style.setProperty('--mzbenchw', w + 'px');
      const content = document.createDocumentFragment(), positions = [];
      for (let i = 0; i < slots.length; i += columns){
        const row = document.createElement('div'), children = slots.slice(i, i + columns);
        const fanRow = matFanPoses(children.length, w, h, shape);
        row.className = 'osmob-fan-row';
        row.style.width = fanRow.w + 'px';
        row.style.height = fanRow.h + 'px';
        children.forEach((slot, j) => {
          slot._pose = fanRow.poses[j];
          slot.style.transform = matFanTf(slot._pose, w, h);
          positions.push({row, pose:slot._pose});
          row.append(slot);
        });
        content.append(row);
      }
      fan.replaceChildren(content);
      fan._cardLayout = {overlay:fan, rows:fan, slots, positions, w, h};
      fan.parentElement.scrollTop = scroll;
    }
  }
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
  if (MATMOB.lift || !G || G.phase !== 'mobilize' || ui.battle || ui.start) return false;
  const shop = document.querySelector('#view-play .osshop:not(.osmobmat)');
  if (!shop || reduceMotion()) return false;   // nothing on screen to sweep: draw Mobilize as it is
  if (!matMobOn() && !shop.querySelector('.osbazaar')) return false;   // desktop also packs up before a handoff panel
  if (oppBusy()){
    if (!MATMOB.queued){ MATMOB.queued = true; oppOnIdle(() => { MATMOB.queued = false; renderPlay(); }); }
    return true;
  }
  MATMOB.busy = true; MATMOB.redraw = false;
  for (const deal of MATDEALS.values()){ deal.flight.cancel(); deal.finish(); }
  try{ if (peekEl) closePeek(); }catch(e){}
  dismissTurnFlash();
  matSweep(shop).then(() => {
    MATMOB.busy = false; MATMOB.lift = matMobOn();
    renderPlay();   // draws Mobilize; matMobAfterDraw lifts the deck
    const fl = MATMOB.flyers.splice(0);
    requestAnimationFrame(() => requestAnimationFrame(() => fl.forEach(g => g.remove())));   // the swept cards now lie on their decks
  });
  return true;
}
// 1. the sweep, on the shop as it is on screen. Resolves when the last card has landed.
function matSweep(shop){
  return new Promise(res => {
    const desk = shop.classList.contains('osdesk'), bazaar = desk && !!shop.querySelector('.osbazaar'), motion = [], piles = [];
    const live = new Set(['u', 'b'].flatMap(k => (G.disp[k] || []).map(c => 'c' + c.id)));
    const deck = k => shop.querySelector(`.ostray .sdeck[data-k="${k}"] .dealdeck`);
    const pile = shop.querySelector('#muster-pile .mpcards') || shop.querySelector('#muster-pile');
    const sections = [...shop.querySelectorAll('.osmkt .msec[data-k]')];
    const seats = desk ? [...shop.querySelectorAll('.osseat')].map(seat => ({
      seat, top:seat.querySelector('.osbought .ostop'), to:seat.querySelector('.osdeck .ostop, .osdeck .osslot')
    })) : [];
    const market = bazaar ? '.market > .mcard, .market > .mirwrap > .mcard' : '.market > .mcard';
    const rows = sections.map(sec => [...sec.querySelectorAll(market)]);
    const destinations = {u:deck('u'), b:deck('b'), p:pile};
    const projection = bazaar ? matTiltOf() : null;
    const flat = bazaar ? matFlatRects(shop.querySelector('.osplane'),
      rows.flat().concat(Object.values(destinations), seats.flatMap(({top, to}) => [top, to]))) : null;
    MATMOB.cells = {};
    const list = [];
    for (const [index, sec] of sections.entries()){
      const k = sec.dataset.k === 'b' ? 'b' : 'u';
      const all = rows[index];
      const cards = all.filter(e => e.dataset.ck && !e.classList.contains('ghost'));
      MATMOB.cells[k] = all.length;
      // the always-for-sale pile (Drifter, Moisture Harvester) slides off the left edge for Mobilize
      const sup = !bazaar && sec.querySelector('.alwaysw .astack > .mcard'), sfr = sup && matFlatRect(sup), sto = matSupplyOff(sfr);
      if (!bazaar && sfr && sfr.width && sto) list.push({el:sup, k, fr:sfr, to:'supply', dest:sto, hide:sup.closest('.alwaysw')});
      for (const el of cards){
        const pose = matPoseOf(el, flat);
        if (pose && getComputedStyle(el).visibility !== 'hidden' && el.style.opacity !== '0')
          list.push({el, k, fr:pose.r, rot:pose.rot, to:live.has(el.dataset.ck) ? 'deck' : 'pile'});
      }
    }
    list.reverse();   // the last card first, so each row's first card lands last, on top of its deck
    // what goes away with the shop: the bottom bar's buttons and purse, the turn glow
    document.querySelectorAll('#view-play .osseat.osact').forEach(b => b.classList.remove('osact'));
    for (const e of document.querySelectorAll('#dock .dbtns, #dock .ospurse, #dock .tslots, #view-play .osdesk .ospass'))
      motion.push(e.animate([{opacity:1}, {opacity:0}], {duration:250, fill:'forwards'}));
    const duration = bazaar ? bazaarTiming.sweepTravel : desk ? 500 : MAT_SWEEP;
    const gap = bazaar ? spreadGap(list.length, bazaarTiming.sweepSpread, bazaarTiming.sweepGap) : desk ? Math.min(58, 330 / Math.max(1, list.length - 1)) : MAT_SWEEP_GAP;
    const n = {u:0, b:0, p:0}, tot = {u:0, b:0, p:0}; let end = 0;
    for (const x of list) if (!x.dest) tot[x.to === 'deck' ? x.k : 'p']++;
    const targets = Object.fromEntries(Object.entries(destinations).map(([kind, el]) => [kind, matPoseOf(el, flat)]));
    list.forEach((x, j) => {
      const w = x.to === 'deck' ? x.k : 'p', target = x.dest ? null : targets[w];
      const tr = x.dest || target?.r;
      if (!tr || !tr.width) return;
      const h = x.dest ? 0 : n[w]++;
      const dest = x.dest || {left:tr.left, top:tr.top + Math.min(3, tot[w] - 1 - h) * 2, width:tr.width};   // each a little lower than the next: the last lands on the spot itself
      const {g, ctx} = flyer(x.el, x.k, {exact:true});
      g.classList.remove('canbuy', 'cant', 'peeked', 'oslifted');
      if (bazaar) bazaarFlightCard(g);
      flyEl(g, x.fr, x.fr.width, x.fr.height, LAYER.flight, ctx); g.style.overflow = '';
      let to = {r:{...dest, height:tr.height}, tilt:1, rot:bazaar ? 90 : target?.rot, discard:x.to === 'pile'};
      if (bazaar) to = bazaarCardPose(to, x.fr);
      const start = {r:x.fr, tilt:1, rot:x.rot};
      const kf = matArc(x.fr, start, to, {arc:bazaar && to.discard ? 36 : 22, bump:bazaar ? 0 : .06, projection});
      if (!kf){ g.remove(); return; }
      const delay = j * gap;
      motion.push(g.animate(kf, {duration, delay, easing:MAT_EASE, fill:'both'}));
      (x.hide || x.el).style.visibility = 'hidden';
      MATMOB.flyers.push(g);
      if (bazaar) piles.push({g, from:x.fr, to});
      try{ sfx.flick(delay / 1000 + .02); }catch(e){}
      end = Math.max(end, delay + duration);
    });
    // On desktop the bought piles merge into the players' decks as the last shop cards reach their own decks.
    const t1 = Math.max(0, end - 160);
    for (const {seat, top, to} of seats){
      const fr = flat ? flat.get(top) : top && matFlatRect(top);
      const tr = flat ? flat.get(to) : to && matFlatRect(to);
      if (!fr?.width || !tr?.width) continue;
      const {g, ctx} = flyer(top, top.classList.contains('u') ? 'u' : 'b', {exact:true});
      if (bazaar) bazaarFlightCard(g);
      flyEl(g, fr, fr.width, fr.height, LAYER.flight, ctx); g.style.overflow = '';
      const toPose = {r:tr, tilt:1};
      const kf = matArc(fr, {r:fr, tilt:1}, bazaar ? bazaarCardPose(toPose, fr) : toPose,
        {arc:14, bump:bazaar ? 0 : .04, projection}); if (!kf){ g.remove(); continue; }
      motion.push(g.animate(kf, {duration:MAT_MERGE, delay:t1, easing:MAT_EASE, fill:'both'}));
      setTimeout(() => { for (const e of seat.querySelectorAll('.osbought > :not(.ostag)')) e.style.visibility = 'hidden'; }, t1);
      MATMOB.flyers.push(g);
    }
    if (desk){
      const packed = Promise.allSettled(motion.map(a => a.finished));
      const closed = bazaar ? bazaarClose(shop, piles, packed) : packed;
      closed.then(res);
    } else setTimeout(res, end ? end + 120 : 0);
  });
}
// renderPlay's step: Mobilize was just drawn after the sweep, so the deck lifts off the mat
function matMobAfterDraw(){
  if (!MATMOB.lift) return;
  MATMOB.lift = false;
  if (!matMobOn() || !document.querySelector('#view-play .osmobmat')) return;
  MATMOB.busy = true; MATMOB.redraw = false;
  MATMOB.entrance = matMobLift().catch(err => console.error('Mobilize entrance', err)).finally(() => {
    const mob = document.querySelector('#view-play .osdeskmob'); if (mob) mob.inert = false;
    MATMOB.busy = false;
    MATMOB.entrance = null;
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
function matMobDimIn(mob){
  const dim = mob?.querySelector('.osmobdim');
  if (!dim || reduceMotion()) return;
  return dim.animate([{opacity:0}, {opacity:1}], {duration:bazaarTiming.inspectDim, easing:'ease-out', fill:'backwards'});
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
  const dimIn = matMobDimIn(mob);
  if (dimIn) motion.push(dimIn);
  const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];   // back to front: card 1 (at the bottom) is the last
  const {duration, gap} = matPileMotion(rows.length, true);
  rows.forEach((el, i) => {
    const delay = i * gap;
    if (ps){
      const b = el.getBoundingClientRect();
      flight(el, matArc(b, ps, {r:b, tilt:0}, {arc:0, levelThroughout:true}), {duration, delay});
      const unfold = Math.min(bazaarTiming.pileRoomOpen, duration);
      for (const tuck of el.querySelectorAll(':scope > .mztk'))
        play(tuck, [{translate:`${-tuck.offsetLeft}px ${-tuck.offsetTop}px`}, {translate:'0 0'}],
          {duration:unfold, delay:delay + duration - unfold});
      for (const x of el.querySelectorAll(':scope > .mzpow, :scope > .mztags'))
        play(x, [{opacity:0}, {opacity:1}], {duration:Math.min(140, duration), delay:delay + Math.max(0, duration - 140), easing:'ease-out'});
    }
    const number = el.querySelector(':scope > .mzno');
    if (number) play(number, [{opacity:0, transform:'scale(.72)'}, {opacity:1, transform:'scale(1.10)', offset:.72}, {opacity:1, transform:'none'}],
      {duration:Math.min(140, duration), delay:delay + Math.max(0, duration - 140), easing:'ease-out'});
  });
  const slots = [...mob.querySelectorAll('#mz-bench .osfanslot')], fan = matPileMotion(slots.length, true);
  slots.forEach((slot, i) => {
    const c = slot.firstElementChild, p = slot._pose, ss = matSpotRect(me && c && matBenchFrom(c, me));
    if (!ss || !p) return;
    const fb = slot.parentElement.getBoundingClientRect(), w = c.offsetWidth, h = c.offsetHeight;
    flight(slot, matArc({left:fb.left, top:fb.top, width:w, height:h}, ss,
      {r:{left:fb.left + p.x, top:fb.top + p.y, width:w}, tilt:0, rot:p.rot}, {arc:0, levelThroughout:true}),
      {duration:fan.duration, delay:i * fan.gap});
  });
  // the AI's deck: face down off its spot up towards the top edge
  const ai = mob.querySelector('.osaicard'), os = matSpotRect(opp && opp.querySelector('.osdeck .osslot, .osdeck .ostop'));
  if (ai && os){ const pr = ai.offsetParent.getBoundingClientRect(), b = {left:pr.left + ai.offsetLeft, top:pr.top + ai.offsetTop, width:ai.offsetWidth, height:ai.offsetHeight};
    flight(ai, matArc(b, os, {r:b, tilt:0, rot:MAT_AIDECK_ROT}, {arc:30}), {duration, delay:0}); }
  const chromeTime = Math.min(160, duration);
  for (const el of mob.querySelectorAll('.osmzhd, .osmz-first, .mzlim, .mzempty, .err, .osaitxt, .osmobacts'))
    play(el, [{opacity:0}, {opacity:1}], {duration:chromeTime, delay:duration - chromeTime});
  try{ sfx.rustle(); }catch(e){}
  await Promise.allSettled(motion.map(a => a.finished));
}
// The next round's deal on the mat: last shop's leftovers come back out of the top of their deck (where the sweep left
// them), face up, sliding across the mat to their spot; the real card shows when its copy lands. Returns when it lands.
function matReturnFly(el, deck, delay, dur, entryDistance, geometry){
  if (!matShopOn() || !el || !deck || !el.closest('#view-play .osplane')) return 0;
  const to = matPoseOf(el, geometry?.flat), from = deck.nodeType ? matPoseOf(deck) : deck.r ? deck : {r:deck, tilt:1};   // or a flat rect off the left edge
  const fr = to?.r;
  if (!fr?.width || !from?.r.width) return 0;
  const {g, ctx} = flyer(el, null, {exact:true});
  g.classList.remove('canbuy', 'cant', 'peeked');
  if (to.rot) g.querySelector('.hgtok')?.remove();
  const stacked = entryDistance != null, layer = stacked ? LAYER.flight + 1 : LAYER.flight;
  if (deck.r) bazaarFlightCard(g);
  flyEl(g, fr, fr.width, fr.height, layer, ctx); g.style.overflow = '';
  const start = deck.r ? bazaarCardPose(from, fr) : from;
  const kf = matArc(fr, start, to, {arc:22, bump:deck.r ? 0 : .06, projection:geometry?.projection}); if (!kf){ g.remove(); return 0; }
  let cover;
  if (stacked){
    cover = flyer(el, null).g;
    bazaarFlightCard(cover);
    cover.classList.add('osbazaar-carry');
    flyEl(cover, fr, fr.width, fr.height, layer, ctx);
    const off = {...start, r:{...start.r, left:start.r.left + entryDistance}};
    const entry = matArc(fr, off, start, {arc:0, projection:geometry?.projection});
    cover.animate(entry, {duration:bazaarTiming.deckEnter, delay:bazaarTiming.deckEnterDelay, easing:BAZAAR_SLIDE, fill:'both'});
    g.style.opacity = '0';
    kf[0].opacity = kf.at(-1).opacity = 1;
  }
  const a = g.animate(kf, {duration:dur, delay, easing:MAT_EASE, fill:cover ? 'forwards' : 'both'});
  if (cover){
    // Same timeline and delay as the flight, so one face replaces the other in the same frame.
    cover.animate([{opacity:0}, {opacity:0}], {duration:dur, delay, fill:'forwards'});
    a.finished.then(() => cover.remove(), () => cover.remove());
  }
  if (!matTrackDeal(el, g, a)){
    const wait = el.animate([{opacity:0}, {opacity:0}], {duration:delay + dur});
    geometry?.stage?.hold(wait);
    a.onfinish = a.oncancel = () => { g.remove(); wait.cancel(); };
  }
  const sound = () => { try{ sfx.flick(delay / 1000 + .02); }catch(e){} };
  if (geometry?.stage){
    geometry.stage.hold(a);
    for (const animation of cover?.getAnimations() || []) geometry.stage.hold(animation);
    geometry.stage.cues.push(sound);
  } else sound();
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
   battle starts with no swap. Redraws and autoplay wait while it plays. Pass and play, online, the rug switch
   off and reduced motion keep the hard cut.
   Desktop starts gathering on lock-in, while the rival can still be planning. The Caravan masks close in place and
   bench cards gather into the player's spare pile. The live Battle board takes over the cropped rows at the same
   anchors. The decks land, then the standard reveal animation spreads the cards tucked behind each top unit. */
const MATBAT = {busy:false, prep:null, land:null, redraw:false, entrance:null};
const MAT_GATHER = 320, MAT_GATHER_GAP = 30, MAT_CROP_T = 300, MAT_CLEAR = 420, MAT_DIM = 380, MAT_WORDS = 360, MAT_TIP = 460, MAT_SLAM = 520;
const MAT_FOLD = 300;
function matBatBusy(){ return MATBAT.busy; }
function matBattleBenchHTML(){
  const bench = (ui.battle?.matSeats || MATBAT.prep?.seats)?.bench;
  if (!bench?.count) return '';
  const edges = Array.from({length:Math.min(3, bench.count - 1)}, (_, i) => `<i class="oback" style="--k:${i + 1}"></i>`).join('');
  return `<div class="osbenchpile" role="img" aria-label="Unused bench cards">${edges}
    <div class="osbench-face">${bench.face}</div></div>`;
}
function matBattleSeatsHTML(opp, me){
  const seats = matSeatHTML(opp, 'battle') + matSeatHTML(me, 'battle');
  return matDesk()
    ? `<div class="osbars osdesk osbattle-table"><div class="osplane"><div class="osinner">${seats}</div></div></div>`
    : `<div class="osbars">${seats}</div>`;
}
function matBatScene(mat, mob){
  const L = {mat, mob};
  if (!mat?.classList.contains('osdesk')){
    const home = document.querySelector('#view-play .osbar.me .oshandrow, #view-play .osbar.me .ospile');
    L.home = home ? matRect(home) : null;
    return L;
  }
  const plane = mat.querySelector('.osplane'), projection = matTiltOf();
  const home = mat.querySelector('.osseat.me .osdeck > .osslot');
  const r = matFlatRects(plane, [home]).get(home);
  const fan = [...mob.querySelectorAll('#mz-bench .osfanslot')], scroll = mob.querySelector('.osmob-bench-scroll');
  const bounds = scroll.getBoundingClientRect();
  const visible = fan.filter(slot => {
    const rect = slot.getBoundingClientRect();
    return rect.bottom > bounds.top && rect.top < bounds.bottom;
  });
  const card = (visible.at(-1) || fan.at(-1))?.firstElementChild;
  const benchFace = card?.querySelector('.mzface');
  L.fan = fan;
  L.visibleBench = new Set(visible);
  L.seats = {projection, bench:benchFace && r ? {left:r.left, top:r.top, width:r.width,
      count:fan.length, face:benchFace.innerHTML} : null};
  return L;
}
function matDesktopBattleCamera(){
  return matDesktopLayout().camera;
}
function matBatPrepare(){
  if (!matDesk() || !labMatZones() || reduceMotion() || MATBAT.prep?.game === G) return false;
  const mat = document.querySelector('#view-play .osmobmat.osdesk'), mob = document.querySelector('#view-play .osdeskmob');
  if (!mat || !mob) return false;
  const L = MATBAT.prep = matBatScene(mat, mob);
  L.game = G;
  mob.inert = true;
  return L.folded = matBatFold(L);
}
function matBatWanted(){
  return !!G && !!ui.battle && ui.frame === 0 && !ui.battle.matIn && !PP() && !G.net && !reduceMotion()
    && typeof labMatZones === 'function' && labMatZones() && !!document.querySelector('#view-play .osmobmat .osplane');
}
// renderPlay's step (before drawing): a battle has just started over Mobilize on the mat. The mat and Mobilize are
// pinned where they are and taken out of the page, then this same redraw draws the battle underneath.
function matBatGate(){
  if (MATBAT.busy){ MATBAT.redraw = true; return true; }
  if (MATBAT.prep && (MATBAT.prep.game !== G || G.over)) MATBAT.prep = null;
  if (MATBAT.prep && !ui.battle) return true;
  if (!matBatWanted()) return false;
  ui.battle.matIn = true;
  try{ if (peekEl) closePeek(); }catch(e){}
  const mat = document.querySelector('#view-play .osmobmat'), mob = document.querySelector('#view-play .osmob');
  const prep = MATBAT.prep, L = MATBAT.land = prep || matBatScene(mat, mob);
  MATBAT.prep = null;
  if (L.seats) ui.battle.matSeats = L.seats;
  matPin(mat, !!prep);
  matPin(mob, !!prep);
  for (const n of [MATBAT.land.mat, MATBAT.land.mob]) if (n) n.remove();   // the view's redraw must not take these
  return false;
}
// the screen rect of an element's box, and a node pinned where it is now (fixed), so it can outlive a redraw
const matRect = el => { const r = el.getBoundingClientRect(); return {left:r.left, top:r.top, width:r.width, height:r.height}; };
function matPin(el, keepMotion = false){
  if (!el) return null;
  if (!keepMotion) el.getAnimations({subtree:true}).forEach(a => { try{ a.commitStyles(); }catch(e){} a.cancel(); });
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
  if (!L.seats) toGame();
  const cam = document.createElement('div'); cam.className = 'matbatcam'; cam.setAttribute('aria-hidden', 'true');
  for (const n of [L.mat, L.mob]) if (n) cam.appendChild(n);   // (a screen-sized frame that clips: nothing makes the page grow)
  view.appendChild(cam);
  line.classList.add('matbat', 'matbatpre');
  L.strips = matDesk() ? [...view.querySelectorAll('.osbars .osstrip')] : [];
  L.strips.forEach(st => st.classList.add('matbatpre'));
  const late = [...view.querySelectorAll('#gtop .pbhint, .battlectl, #dock .act, #dock .dbtns')];
  const controls = late.filter(e => !e.inert);
  controls.forEach(e => { e.inert = true; });
  late.forEach(e => { e.style.opacity = '0'; });
  MATBAT.busy = true; MATBAT.redraw = false;
  L.folded ||= matBatFold(L);
  const entrance = L.seats ? matBatLand(line, L) : L.folded.then(() => matBatLand(line, L));
  MATBAT.entrance = entrance.catch(err => console.error('Battle entrance', err)).finally(() => {
    controls.forEach(e => { e.inert = false; });
    late.forEach(e => { e.style.opacity = ''; if (e.isConnected) e.animate([{opacity:0}, {opacity:1}], {duration:260, easing:'ease-out'}); });
    line.classList.remove('matbat', 'matbatpre');
    (L.strips || []).forEach(st => { st.classList.remove('matbatpre'); st.getAnimations({subtree:true}).forEach(a => a.cancel()); });
    cam.remove();
    MATBAT.busy = false;
    MATBAT.entrance = null;
    if (MATBAT.redraw){ MATBAT.redraw = false; renderPlay(); }
    if (autoOn()) startAuto(400);
  });
}
// 1 + 2 (and the clearing under the dim). Resolves when the stack is cropped and the mat under the dim is clear.
function matBatFold(L){
  return new Promise(res => {
    const mob = L.mob, mat = L.mat;
    const desktop = !!L.seats;
    if (desktop) mob.classList.add('osbatgather');
    const rows = [...mob.querySelectorAll('#mz-deck > .mzc')];
    const fold = desktop ? matPileMotion(rows.length, false) : {duration:MAT_GATHER, gap:MAT_GATHER_GAP};
    const gather = fold.duration, clear = desktop ? 300 : MAT_CLEAR;
    const one = L.one = rows.findLast(row => !row.classList.contains('spell'));
    const rest = desktop ? [] : rows.filter(row => row !== one);
    if (one) one.style.zIndex = rows.length;
    const at = !desktop && one?.getBoundingClientRect();
    const motion = [];
    const go = (el, kf, o) => {
      if (el && kf) motion.push(el.animate(kf, {fill:'forwards', easing:MAT_EASE, ...o}));
    };
    // 1. the cascade gathers into one stack of full cards on card 1, the last card first
    if (desktop){
      rows.forEach((row, i) => {
        const delay = Math.min(i, Math.max(0, rows.length - 2)) * fold.gap;
        for (const tuck of row.querySelectorAll(':scope > .mztk')){
          go(tuck, [{transform:'none', visibility:'visible'},
            {transform:`translate(${-tuck.offsetLeft}px,${-tuck.offsetTop}px)`, visibility:'hidden'}],
          {duration:Math.min(gather, bazaarTiming.pileRoomClose), delay});
        }
      });
    }
    rest.forEach((el, i) => {
      const r = el.getBoundingClientRect(); if (!at) return;
      el.style.transformOrigin = '0 0';
      go(el, [{transform:'none'}, {transform:`translate(${at.left - r.left}px,${at.top - r.top}px) scale(${at.width / r.width})`}], {duration:gather, delay:i * fold.gap});
    });
    const gathered = gather + Math.max(0, rows.length - 2) * fold.gap;
    for (const e of mob.querySelectorAll('.mzno, .mzpow, .mztags, .osmzhd, .mzlim, .mzempty, .err, .mobmir, .osmobacts, .osmz-first')) go(e, [{opacity:1}, {opacity:0}], {duration:220});
    if (!desktop) for (const e of mob.querySelectorAll('.mztk')) go(e, [{opacity:1}, {opacity:0}], {duration:220});
    // bench items you didn't use go back to your hand spot (or your deck pile) in your bar, where it was, and fade there
    const hr = L.home;
    [...mob.querySelectorAll('#mz-bench > .mzc')].forEach((el, i) => {
      const b = el.getBoundingClientRect(), o = {duration:MAT_GATHER + 120, delay:i * 50};
      if (hr && hr.width && b.width){ el.style.transformOrigin = '0 0'; go(el, matArc(b, {r:b, tilt:0}, {r:{left:hr.left, top:hr.top, width:Math.min(hr.width, hr.height * b.width / b.height)}, tilt:0}, {arc:30}), o); }
      go(el, [{opacity:1}, {opacity:1, offset:.7}, {opacity:0}], {...o, easing:'linear'});
    });
    if (desktop) motion.push(...matBatBenchFold(L));
    // 2. once gathered, the stack turns into its cropped version, in place (the cards under card 1 go with it)
    rest.forEach(el => go(el, [{visibility:'hidden'}, {visibility:'hidden'}], {duration:1, delay:gathered}));
    const face = one && one.querySelector(':scope > .mzface');
    if (face && !desktop) motion.push(...matCrop(face, [[0, 'open'], [1, 'crop']], {duration:MAT_CROP_T, delay:gathered, easing:'ease-in-out', fill:'forwards'}).anims);
    // under the dim, the whole mat leaves (shop decks, discard, market words): the battle has its own table
    // (desktop: all of it but the two Caravan rows, which fold into the strips once the dim lifts)
    if (mat && desktop){
      const out = [...mat.querySelectorAll('.osinner > :not(.osseat), .osinner > .osseat > :not(.oscarrow,.ospurse), .osinner > .osseat > .oscarrow > .osslot')];
      out.forEach(e => go(e, [{opacity:1}, {opacity:0}], {duration:clear, delay:80, easing:'ease-in'}));
      for (const e of [mat, ...mat.querySelectorAll('.osplane, .osinner, .osinner > .osseat')])
        go(e, [{}, {backgroundColor:'transparent', backgroundImage:'none', boxShadow:'none', borderColor:'transparent'}], {duration:clear, delay:80, easing:'ease-in'});
      mat.querySelectorAll('.oscarrow .oscar').forEach(card => {
        const direction = card.closest('.osseat.opp') ? 'up' : 'down';
        motion.push(...matCrop(card, [[0, 'open'], [1, 'crop']], {duration:MAT_FOLD, easing:'ease-in-out', fill:'both'}, direction).anims);
      });
    } else if (mat) go(mat, [{opacity:1}, {opacity:0}], {duration:clear, delay:80, easing:'ease-in'});
    try{ sfx.rustle(); }catch(e){}
    Promise.allSettled(motion.map(animation => animation.finished)).then(res);
  });
}
function matBatBenchFold(L){
  const home = L.seats.bench;
  if (!home) return [];
  const motion = [];
  const {duration, gap} = matPileMotion(L.fan.length, false);
  const scroll = L.mob.querySelector('.osmob-bench-scroll');
  const offset = scroll.scrollTop;
  scroll.classList.add('osbench-flight');
  if (offset) scroll.firstElementChild.style.translate = `0 ${-offset}px`;
  L.fan.forEach((slot, i) => {
    const row = slot.parentElement.getBoundingClientRect(), pose = slot._pose;
    if (!pose) return;
    const card = slot.firstElementChild, w = parseFloat(getComputedStyle(card.querySelector('.mzface')).width);
    const r = {left:row.left + pose.x, top:row.top + pose.y, width:w, height:card.offsetHeight};
    if (!L.visibleBench.has(slot)) { slot.style.visibility = 'hidden'; return; }
    const layout = {left:row.left, top:row.top, width:w, height:r.height};
    const frames = matArc(layout, {r, tilt:0, rot:pose.rot}, {r:home, tilt:1},
      {arc:36, projection:L.seats.projection});
    const delay = i * gap;
    motion.push(slot.animate(frames, {duration, delay, fill:'both', easing:MAT_EASE}));
    motion.push(...matCrop(card.querySelector('.mzface'), [[0, 'open'], [1, 'crop']],
      {delay:delay + duration * .8, duration:MAT_FOLD, easing:'ease-in-out', fill:'both'}, 'down').anims);
  });
  return motion;
}
function matBatSwapRows(L){
  // Swap the cropped cards, bench and banks together at the recorded tabletop positions.
  L.mat.querySelectorAll('.oscarrow,.ospurse').forEach(el => { el.style.visibility = 'hidden'; });
  L.fan.forEach(slot => { slot.style.visibility = 'hidden'; });
  for (const strip of L.strips) strip.classList.remove('matbatpre');
}
// The dim lifts, the decks drop, and the first cards splay their attachments before controls are released.
async function matBatLand(line, L){
  const rowsReady = L.seats && L.folded.then(() => matBatSwapRows(L));
  const decksReady = new Promise(res => {
    const mob = L.mob;
    const desktop = !!L.seats, splaying = [];
    const dimMs = desktop ? 300 : MAT_DIM, tipMs = desktop ? 600 : MAT_TIP, slamMs = desktop ? 320 : MAT_SLAM;
    const mine = line.querySelector('.trow.s0 > .deckz > .tzc'), theirs = line.querySelector('.trow.s1 > .deckz > .tzc');
    const face = el => el && el.querySelector('.card:not(.mini)');
    const go = (el, kf, o) => el && kf ? el.animate(kf, {fill:'backwards', easing:'cubic-bezier(.2,.7,.25,1)', ...o}) : null;
    let t = 0;
    // 3. the dim lifts (the stack stays, held above the table)
    const dim = mob.querySelector('.osmobdim'); if (dim) dim.animate([{opacity:1}, {opacity:0}], {duration:dimMs, easing:'ease-out', fill:'forwards'});
    t += dimMs - (desktop ? 190 : 80);
    const oneF = L.one && L.one.querySelector(':scope > .mzface');
    const cropped = desktop && document.body.matches('.os-battle-tight,.lab-crop');
    // 4. the zone words fade in (the Caravans stay where they were, in the bars)
    for (const w of line.querySelectorAll('.zl, .labslot')) go(w, [{opacity:0}, {opacity:1}], {duration:desktop ? 280 : MAT_WORDS, delay:t, easing:'ease-out'});
    // (your deck starts tipping as the words come, and lands once they're in: MAT_TIP > MAT_WORDS)
    // 5. your deck takes over from the cropped stack where it is, flat, the same size, then tips into the board's tilt
    // while it moves to the spot it drops from, right above its place; then both decks slam down together (the rival's
    // from off the top edge, face up), a squash and the puff on each
    const squash = [{k:'translate(0,-10px)', o:.72}, {k:'scaleY(.88)', o:.84}, {k:'scaleY(1.02)', o:.93}, {k:'none', o:1}];
    const impact = t + tipMs + slamMs * .84, settled = t + tipMs + slamMs;
    const showDeck = (deck, sources) => {
      const delay = t + tipMs;
      for (const source of sources) source.animate([{visibility:'hidden'}, {visibility:'hidden'}], {duration:1, delay:delay + 1, fill:'forwards'});
      go(deck, [{visibility:'hidden'}, {visibility:'visible'}], {duration:1, delay, easing:'steps(1, end)'});
    };
    const reveal = el => {
      if (!el) return;
      splaying.push(new Promise(done => labSplayIn(face(el), settled, null, done)));
      for (const bar of el.querySelectorAll('.hprow')) go(bar, [{opacity:0}, {opacity:1}], {duration:160, delay:settled});
    };
    const dust = (el, at) => setTimeout(() => { const q = face(el) ? face(el).getBoundingClientRect() : el.getBoundingClientRect(); try{ labDust(q.left + q.width / 2, q.bottom - 4, q.width * 1.3); }catch(e){} }, at);
    const slam = el => {   // off the top edge when there is no source stack on the mat
      if (!el) return;
      const r = el.getBoundingClientRect(), f = face(el) ? face(el).getBoundingClientRect() : r, cos = Math.cos(14 * Math.PI / 180);
      el.style.transformOrigin = `${f.left - r.left + f.width / 2}px ${(f.bottom - r.top) / cos}px`;
      go(el, [{transform:`translate(0,${-(f.bottom + 40) / cos}px)`, offset:0}, ...squash.map(q => ({transform:q.k, offset:q.o}))], {duration:slamMs, delay:t + tipMs, easing:'linear'});
      dust(el, impact);
      reveal(el);
    };
    const sources = desktop ? [...mob.querySelectorAll('#mz-deck > .mzc')] : oneF ? [oneF] : [];
    const target = mine && matBatDeckGeometry(line, mine, face(mine));
    const flights = target ? sources.map(source => ({source, flight:matBatTip(target, matRect(source), squash, false, desktop)}))
      .filter(({flight}) => flight) : [];
    const fl = flights[0]?.flight;
    line.classList.remove('matbatpre');   // (every piece now has its beat's animation holding it back)
    if (mine && fl){
      // Each unit gathers directly at the destination. The Battle pile takes over for the short vertical drop.
      const gap = desktop ? spreadGap(flights.length, tipMs * .35, bazaarTiming.pileGap) : 0;
      flights.forEach(({source, flight}, i) => {
        const stagger = i * gap, delay = t + stagger, duration = tipMs - stagger;
        source.style.transformOrigin = '0 0';
        source.animate(flight.tip, {duration, delay, easing:'linear', fill:'forwards'});
        if (cropped) matCrop(source.querySelector(':scope > .mzface'), [[0,'open'], [1,'crop']],
          {duration, delay, easing:MAT_EASE, fill:'both'}, 'up');
      });
      mine.style.transformOrigin = '0 0';
      go(mine, fl.drop, {duration:slamMs, delay:t + tipMs, easing:'linear'});
      showDeck(mine, sources);
      dust(mine, impact);
      reveal(mine);
    } else if (mine){ showDeck(mine, sources); slam(mine); }
    // the rival's deck: on the desktop its card back waited near the top (.osaicard) and tips in the same way as yours;
    // otherwise (or if that card is gone) it slams from off the top edge
    const aiB = L.strips && L.strips.length ? mob.querySelector('.osaideck .osaicard') : null;
    const aiTarget = theirs && aiB && matBatDeckGeometry(line, theirs, face(theirs));
    const fa = aiTarget && matBatTip(aiTarget, matRect(aiB), squash, true, desktop);
    if (fa){
      aiB.style.transformOrigin = '0 0';
      aiB.animate(fa.tip, {duration:tipMs, delay:t, easing:'linear', fill:'forwards'});
      showDeck(theirs, [aiB]);
      const tx = mob.querySelector('.osaideck .osaitxt'); if (tx) go(tx, [{opacity:1}, {opacity:0}], {duration:200, delay:t, fill:'forwards'});
      theirs.style.transformOrigin = '0 0';
      go(theirs, fa.drop, {duration:slamMs, delay:t + tipMs, easing:'linear'});
      dust(theirs, impact);
      reveal(theirs);
    } else if (theirs){ showDeck(theirs, []); slam(theirs); }
    setTimeout(() => { try{ sfx.lock(); }catch(e){} }, impact);
    setTimeout(() => {
      for (const el of [mine, theirs]) if (el) el.style.transformOrigin = '';
      Promise.all(splaying).then(res);
    }, settled + 60);
  });
  await Promise.all([rowsReady, decksReady]);
}

/* Your deck's flight in two parts (transform origin top left on both).
   tip: the cropped stack (flat on the screen at rect R, sharp because it is drawn big) tips into the board's tilt while
   it moves to the spot your deck drops from (straight above its place, a little bigger). drop: your deck itself, from
   that same pose down onto its spot with the squash. The board (.line.table) tips back by the mat's camera,
   perspective(1000px) rotateX(14deg) from its bottom edge (css/11-rug.css). The stack's pose is the deck's pose in the
   board, seen through that camera at an angle that grows from 0 to 14°, so at the end the two match exactly. */
function matBatDeckGeometry(line, el, cardEl){
  if (!cardEl) return null;
  line.style.setProperty('transform', 'none', 'important');
  const Lr = line.getBoundingClientRect(), D = el.getBoundingClientRect(), F = cardEl.getBoundingClientRect();
  line.style.removeProperty('transform');
  const q = matDesk() ? matDesktopBattleCamera() : {d:1000, t:14, ox:Lr.left + Lr.width / 2, oy:Lr.bottom};
  return F.width ? {D, F, q} : null;
}
function matBatTip({D, F, q}, R, squash, turn = false, desktop = false){
  if (!R.width) return null;
  const deg = q.t, cam = a => matTiltMatrix(a / deg, q);
  const fx = F.left - D.left, fy = F.top - D.top, fw = F.width, fh = F.height;
  // the deck's own transform (in the board's flat plane): k0/t0 puts its card over R, k1/t1 is the drop pose
  const k0 = R.width / fw, t0x = R.left - D.left - k0 * fx, t0y = R.top - D.top - k0 * fy;
  const k1 = 1, cx = fx + fw / 2, cy = fy + fh, lift = fh * (desktop ? .26 : .42), t1x = cx - k1 * cx, t1y = cy - k1 * cy - lift;
  const sm = x => x * x * (3 - 2 * x), N = desktop ? 30 : 18, tip = [];
  const yaw = (matrix, a) => matrix.translate(cx, fy + fh / 2).rotate(0, a, 0).translate(-cx, -fy - fh / 2);
  for (let i = 0; i <= N; i++){
    const u = i / N, e = sm(u), th = deg * sm(Math.min(1, u * 1.15));
    const k = k0 + (k1 - k0) * e, tx = t0x + (t1x - t0x) * e, ty = t0y + (t1y - t0y) * e - Math.sin(Math.PI * (desktop ? e : u)) * fh * .12;
    // on screen: the board's camera at th, of the deck's spot moved by (tx, ty, k); the stack's own box maps onto the deck's card
    let S = cam(th).translate(D.left, D.top).translate(tx, ty).scale(k);
    if (turn) S = yaw(S, 89.9 * sm(Math.max(0, (u - .55) / .45)));
    S = S.translate(fx, fy).scale(fw / R.width);
    tip.push({transform:new DOMMatrix().translate(-R.left, -R.top).multiply(S).toString(), offset:u});
  }
  let start = new DOMMatrix().translate(t1x, t1y).scale(k1);
  if (turn) start = yaw(start, -89.9);
  const drop = [{transform:start.toString(), offset:0, easing:'ease-in'}];
  if (turn) drop.push({transform:`translate(0,${t1y * .85}px)`, offset:.3, easing:'ease-in'});
  for (const q of squash.slice(0, -1)) drop.push({transform:new DOMMatrix().translate(cx, cy).multiply(new DOMMatrix(q.k)).translate(-cx, -cy).toString(), offset:q.o, easing:'ease-out'});
  drop.push({transform:'none', offset:1});
  return {tip, drop};
}
