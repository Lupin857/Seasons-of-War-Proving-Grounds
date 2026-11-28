/* ===================== CARD MOTION (shop) =====================
   Every card that moves on the shop screen is built from the same few pieces, so a change to one fixes it everywhere:
   - cardKey / data-ck: which physical card a market element shows. Display and frozen cards are followed by their id
     ('c12'), never by name (names repeat, and the screen shows the Oasis name while the rules use the sheet name);
     cards without an id (Drifter, Moisture Harvester, Black Market, Vision) by source and index ('bm:0').
   - snapNow / SPOTS: where each keyed card sat on screen just before a move (taken by every path that makes one).
   - flyer: the flying copy of a card, made one way: a clone of its element or a fresh face, stripped, real size.
   - motions: cardFlight (from one place to another), dealFly (out of a deck, flipping face up), and for an opponent's
     move oppBuyStep / oppSellStep (the card held in the middle with a tag; on the phone mat, matOppBuy / matOppSell).
   - the opponent queue (OPQ, oppBuyStep, oppSellStep) and sells (flySell) are at the end of this file.
   - motionFrom: after any shop move, turns its log events into flights (an opponent's go on the queue, one at a time).
   - syncShop: after every redraw, compares the cards in play with the last redraw (from the rules' state, not the
     page): a new display card is dealt from its deck, a card that moved (Freeze) slides, and a card that left without
     being bought (Discard Writ) goes to the discard pile. While an opponent's moves play out, these wait in the same
     queue, so a refill deals into its spot only after the bought card has left it. */
function cardKey(src, idx, who){
  const c = src === 'du' || src === 'db' || src === 'fz' ? slotOf(G, {src, idx:idx ?? 0, who:who ?? seat()}) : null;
  return c && c.id != null ? 'c' + c.id : `${src}:${idx ?? 0}`;
}
const tagCk = (html, ck) => html.replace('<div class="mcard', `<div data-ck="${ck}" class="mcard`);
const evKey = ev => ev.id != null ? 'c' + ev.id : `${ev.src}:${ev.idx ?? 0}`;
const deckEl = k => $('view-play').querySelector(`.sdeck[data-k="${k}"] .dealdeck`);
const deckBtnOf = i => [...$('view-play').querySelectorAll(`.deckbtn[data-p="${i}"], #dock .dk[data-p="${i}"]`)].find(x => x.getClientRects().length);
const pileEl = () => { const p = $('muster-pile'); return p && p.getClientRects().length ? (p.querySelector('.mpcards') || p) : null; };
const ckEl = ck => { for (const el of $('view-play').querySelectorAll(`.mcard[data-ck="${ck}"]`)) if (el.getClientRects().length) return el; return null; };
// the Moisture Harvester (rules name Field) card in the shop, found by its key: its visible name is the Oasis name
const fieldCardEl = () => ckEl(cardKey('field', 0));
const backsOf = el => { const w = el && el.parentElement; return w && w.classList.contains('mirwrap') ? [...w.querySelectorAll('.mirback')] : []; };
let SPOTS = new Map();
function snapNow(){
  const m = new Map(), vp = $('view-play');
  if (vp) for (const el of vp.querySelectorAll('.mcard[data-ck]')){ const ck = el.dataset.ck; if (!m.has(ck) && el.getClientRects().length) m.set(ck, {el, r:el.getBoundingClientRect()}); }
  matSnapFlat(m);   // on the mat: where each card sits with the tilt switched off, and the seats' cards
  return (SPOTS = m);
}
// where a bought card comes from: its spot (as it was before the move); else the discard pile or its deck, as a small start
function evSource(ev){
  const s = SPOTS.get(evKey(ev)); if (s) return s;
  const d = ev.src === 'mu' ? pileEl() : deckEl(ev.k);
  return d && d.getClientRects().length ? {el:null, r:d.getBoundingClientRect()} : null;
}
// the size of a card on this screen (a shop card's, as a stand-in when there is no element to measure)
function cardSize(el){
  const r = el && el.getBoundingClientRect && el.getBoundingClientRect(); if (r && r.width) return {w:r.width, h:r.height};
  const ref = $('view-play').querySelector('.mktp .market .mcard:not(.ghost)'), rr = ref && ref.getBoundingClientRect();
  return rr && rr.width ? {w:rr.width, h:rr.height} : {w:110, h:152};
}
/* The flying copy of a card. src: the card's element (cloned, so it looks just like it) or a card name (a fresh face).
   exact: keep everything the card shows in its spot (a deal lands on the real card, so it must match it exactly);
   otherwise buttons, stamps, tags and state marks come off, as for a card that has left its spot. */
const FLY_STRIP = 'button, .stamps, .dealback, .ctag, .mirpop, .hgtok, .writmark, .writown';
const FLY_STATE = ['cant', 'peeked', 'always', 'canbuy', 'leaving', 'ghost', 'lvup', 'writtgt', 'writsrc', 'writoff', 'on', 'full', 'oplinger'];
function flyer(src, kind, o = {}){
  let g, ctx = null;
  if (src && src.nodeType === 1){ g = src.cloneNode(true); ctx = src.parentElement; }
  else { g = document.createElement('div'); g.className = `mcard ${kind}`; try{ g.innerHTML = cardFace(src, kind, o.own || 0, true); }catch(e){ g.innerHTML = `<div class="top"><span class="nm">${esc(src)}</span></div>`; } }
  g.querySelectorAll(o.exact ? '.dealback, .mirpop' : FLY_STRIP).forEach(x => x.remove());
  if (!o.exact) g.classList.remove(...FLY_STATE);
  for (const a of o.exact ? ['id', 'data-ck'] : ['id', 'data-ck', 'data-act', 'data-at', 'role', 'tabindex']) g.removeAttribute(a);
  return {g, ctx};
}
/* One card from a place to another: from = {r, el} (el: the card to copy, or none for a fresh face named o.name);
   to: the element it lands on. A landing spot (a deck sheet card, a moved card's new spot) is hidden until it arrives;
   intoBtn: it shrinks into a button or pile and fades, which bumps. */
function flyTo(from, to, o = {}){
  if (!from || !from.r || !from.r.width || !to || !to.isConnected) return 0;
  const b = to.getBoundingClientRect(); if (!b.width) return 0;
  const sz = from.el ? {w:from.r.width, h:from.r.height} : cardSize();
  const {g, ctx} = flyer(from.el || o.name, o.kind, o);
  flyEl(g, from.r, sz.w, sz.h, flyZ(to), ctx);
  if (!o.intoBtn) to.style.visibility = 'hidden';
  cardFlight(g, from.r, b, {w0:sz.w, h0:sz.h, keep:!o.intoBtn, delay:o.delay, dur:o.dur, arc:o.arc, onLand:() => {
    g.remove(); if (to.isConnected){ to.style.visibility = ''; bumpEl(to); } if (o.onLand) o.onLand(); }});
  return (o.delay || 0) + (o.dur || 1100);
}
// your own buy: from its spot to the card it joins in the open deck sheet, else into your deck button. Covenant cards
// come along from the same spot; Mason's Guild flies to the building it levels.
function buyFlight(i, ev, src, j){
  if (matBuyFlight(i, ev, src, j)) return;   // on the mat: lands on your side, in the tilt
  const vp = $('view-play'), side = i === seat() ? ':not(.ai)' : '.ai';
  const list = [{look:ev.n, dest:ev.on || ev.n, el:src && src.el}, ...(ev.pair || []).map(n => ({look:n, dest:n, el:null}))];
  list.forEach((x, m) => {
    const tos = vp.querySelectorAll(`.dsheet.s${VS(i)} .fcard${side}[data-card="${CSS.escape(x.dest)}"]`), to = tos[tos.length - 1], btn = deckBtnOf(i);
    const from = src ? {r:src.r, el:x.el} : null;
    if (!from) return;
    flyTo(from, to || btn, {name:x.look, kind:ev.k, intoBtn:!to, delay:(j + m) * 220});
  });
}
// after any shop move by side i since log index n0: what it bought or sold flies (an opponent's, one at a time, on the
// queue; this screen's own buys with the redraw that follows). Returns true when it queued something.
function motionFrom(i, n0){
  if (!G) return false;
  const evs = G.log.slice(n0).filter(l => l.ev && l.side === i && (l.ev.a === 'buy' || l.ev.a === 'sell')).map(l => l.ev);
  for (const ev of evs) if (ev.a === 'buy' && ev.id != null) MOT.bought.add('c' + ev.id);   // left the display by being bought
  if (!evs.length || reduceMotion()) return false;
  if (i !== seat() && !(PP() && !G.net)){
    matOppQueued(i, evs);   // on the mat: their purse and new spots wait for their moves to play
    for (const ev of evs){ const src = ev.a === 'buy' ? evSource(ev) : matSellSrc(i, ev); OPQ.steps.push(() => ev.a === 'buy' ? oppBuyStep(i, ev, src) : oppSellStep(i, ev, src)); }
    setTimeout(oppRun, 0);   // after this move's redraw, so cards and buttons are measured where they now sit
    MOT.afterOpp = true;     // and what else the move changed in the display waits its turn behind them
    return true;
  }
  for (const ev of evs){
    if (ev.a === 'buy') MOT.fly.push({i, ev, src:evSource(ev)});
    else shopCoinSale(i, ev, MATLIFT.held?.g, matSellSrc(i, ev));
  }
  return false;
}
/* Flying copies of cards look exactly like the card they copy: each one is put inside a stand-in of the card's own
   ancestors (same classes and attributes, no ids, no boxes: display:contents), so every rule that styles a card in its
   spot ("the shop's compact face", buy button under it, its stamps) styles the copy the same way. With no spot to copy
   (a card drawn for a sale), the copy takes a shop card's place, so every card in flight looks like a shop card. */
const FLYHOSTS = new Map();
// a flying copy's box, set firmly: the copied context's own placement rules (some !important) must not move or stretch it
function pinFly(g, x, y, w, h){
  if (!g.dataset.solid){
    g.dataset.solid = '1';
    solidArt(g, g.classList.contains('osbazaar-flight') ? undefined : w);
  }
  for (const [k, v] of [['position','fixed'], ['left', x + 'px'], ['top', y + 'px'], ['right','auto'], ['bottom','auto'], ['width', w + 'px'], ['height', h + 'px'], ['margin','0'], ['min-height','0'], ['max-width','none']]) g.style.setProperty(k, v, 'important');
}
function flyHost(ctx){
  if (!ctx || !ctx.isConnected) ctx = (($('view-play') || document).querySelector('.mktp .market .mcard:not(.ghost)') || {}).parentElement;
  const chain = [];
  for (let e = ctx; e && e !== document.body && e !== document.documentElement; e = e.parentElement) chain.unshift(e);
  const key = chain.map(e => e.tagName + '.' + e.className + [...e.attributes].filter(a => a.name !== 'id' && a.name !== 'class').map(a => a.name + '=' + a.value).join(',')).join('>');
  let h = FLYHOSTS.get(key);
  if (h && h.root.isConnected) return h.leaf;
  let root = null, leaf = document.body;
  for (const e of chain){
    const d = document.createElement('div');
    for (const a of e.attributes) if (a.name !== 'id' && !a.name.startsWith('aria-') && a.name !== 'role' && a.name !== 'tabindex') d.setAttribute(a.name, a.value);
    d.classList.remove('osbattle-return');  // only the actual board owns the Battle → Shop gate
    d.style.setProperty('display', 'contents', 'important'); d.setAttribute('aria-hidden', 'true'); d.classList.add('flyhost');
    leaf.appendChild(d); leaf = d; if (!root) root = d;
  }
  if (FLYHOSTS.size > 24) FLYHOSTS.clear();
  FLYHOSTS.set(key, {root: root || document.body, leaf});
  return leaf;
}
// a card copy that flies over the page: fixed, at the start rect, card-sized and solid (ctx: where the card sat)
function flyEl(g, at, w0, h0, z, ctx){
  g.removeAttribute('style'); g.classList.add('flying'); g.setAttribute('aria-hidden', 'true');
  Object.assign(g.style, {zIndex:z || LAYER.flight, pointerEvents:'none', transformOrigin:'0 0', overflow:'hidden'});
  pinFly(g, at.left, at.top, w0, h0);
  flyHost(ctx).appendChild(g);
  return g;
}
const bumpEl = el => { if (el && el.isConnected) el.animate([{transform:'scale(1)'}, {transform:'scale(1.12)'}, {transform:'none'}], {duration:320, easing:'ease-out'}); };
// Use the layout's fixed centers, so cards moving between slots do not move the drag boundaries.
function closestCardSlot(centers, x, y, current){
  const distance = point => Math.hypot(point.x - x, point.y - y);
  let target = current, nearest = distance(centers[current]) - 6;
  centers.forEach((point, index) => {
    const d = distance(point);
    if (d < nearest){ target = index; nearest = d; }
  });
  return target;
}
/* The one card flight used whenever a card moves between places: buying (market to deck), selling (deck to the
   Discard pile) and unbought cards leaving at the start of a round (market to the discard pile).
   g sits at the start rect `from` (transform origin top left) and is w0×h0 at scale 1. It lifts off, travels at a
   readable size, then shrinks into `to` and fades (keep: lands at full opacity, stretched to fit, e.g. a deck slot).
   Starting from something small, like a deck button, it fades in as it grows.
   o.pre: a transform put in front of every step (the one-screen mat's tilt, matFlightFrame, for flights on the mat). */
function cardFlight(g, from, to, o = {}){
  const w0 = o.w0 || from.width, h0 = o.h0 || from.height;
  const ca = [from.left + from.width / 2, from.top + from.height / 2], cb = [to.left + to.width / 2, to.top + to.height / 2];
  const sA = Math.min(from.width / w0, from.height / h0), sB = Math.min(to.width / w0, to.height / h0) * .92, grow = sA < .6;
  const sM = grow ? .62 : Math.max(.55, sA * .75);
  const at = (t, s, lift, rot, sy) => `${o.pre ? o.pre + ' ' : ''}translate(${ca[0] + (cb[0] - ca[0]) * t - w0 * s / 2 - from.left}px,${ca[1] + (cb[1] - ca[1]) * t - h0 * (sy || s) / 2 - lift - from.top}px) scale(${s},${sy || s}) rotate(${rot}deg)`;
  const end = o.keep ? at(1, to.width / w0, 0, 0, to.height / h0) : at(1, sB, 0, 0);
  const an = g.animate([
    {transform:at(0, sA, 0, 0), opacity:grow ? 0 : 1, filter:'drop-shadow(0 0 0 rgba(0,0,0,0))'},
    {transform:at(.08, grow ? sM : sA * 1.06, (grow ? 30 : 14) + (o.arc || 0) * .6, -3), opacity:1, filter:'drop-shadow(0 18px 20px rgba(0,0,0,.32))', offset:.2},
    {transform:at(.78, o.keep ? (sA + to.width / w0) / 2 : sM, 20 + (o.arc || 0), 3), opacity:1, filter:'drop-shadow(0 14px 16px rgba(0,0,0,.28))', offset:.75},
    {transform:end, opacity:o.keep ? 1 : 0, filter:'drop-shadow(0 2px 3px rgba(0,0,0,.12))'}],
    {duration:o.dur || 1100, delay:o.delay || 0, easing:'cubic-bezier(.45,.05,.35,1)', fill:'both'});
  const done = () => { if (o.onLand) o.onLand(); else g.remove(); };
  an.onfinish = done; an.oncancel = done;
  return an;
}

/* OPPONENT ACTIONS, ONE AT A TIME. What the AI (or an online friend) buys and sells plays back in order, each as its
   own beat you can read: the card holds in front of you for a second with a tag saying what happened ("AI bought · $2",
   "AI sold · +$1"), then flies where it went. Actions done in quick succession wait their turn. A tap ends the current
   card's hold early. Turn banners wait until the queue is done (turnWatch), so you see what happened before "Your turn".
   Pass and play doesn't use it: there the other player just did it themselves on the same device. */
const OPQ = {steps:[], running:false, idle:[], skip:null};
const OPP_HOLD = 1000, OPP_GAP = 220, OPP_SETTLE = 450;
function oppBusy(){ return OPQ.running || OPQ.steps.length > 0; }
function oppOnIdle(f){ if (!oppBusy()) f(); else OPQ.idle.push(f); }
async function oppRun(){
  if (OPQ.running) return;
  OPQ.running = true;
  while (OPQ.steps.length){
    const step = OPQ.steps.shift();
    const fl = [...document.querySelectorAll('.turnflash.theirs:not(.out)')].filter(n => !n._closing);
    fl.forEach(n => n._close ? n._close() : n.remove());   // their turn is over: its banner makes room for their cards
    if (fl.length) await new Promise(r => setTimeout(r, 320));   // and is gone before the first card moves
    try{ await step(); }catch(e){}
    if (OPQ.steps.length) await new Promise(r => setTimeout(r, OPP_GAP));
  }
  await new Promise(r => setTimeout(r, OPP_SETTLE));   // a breath after the last card lands
  OPQ.running = false;
  if (oppBusy()){ oppRun(); return; }
  OPQ.idle.splice(0).forEach(f => { try{ f(); }catch(e){} });
}
const oppWho = i => PP() || G.net ? nm(i) : 'AI';
// the space between the bars where a card can be read: the middle of it, card-sized and a little larger
function oppStage(w0, h0, sc){
  const v = dealView($('view-play').querySelector('.mktp') || document.body), top = Math.max(v.top, 0) + 12, bot = Math.min(v.bottom, window.innerHeight) - 12;
  const w = w0 * sc, h = h0 * sc;
  return {left:(window.innerWidth - w) / 2, top:Math.max(top, (top + bot - h) / 2), width:w, height:h};
}
// a card copy held at rect `at` (scale at.width / w0), tagged, pulsing; resolves after the hold or a tap
function oppHold(g, at, w0, h0, tag, side, ms = OPP_HOLD){
  // the tag sits just under the card, outside it (its own element, so the card still clips its own text)
  const t = document.createElement('span'); t.className = `optag s${VS(side)}${/ sold /.test(tag) ? ' sell' : ''}`; t.textContent = tag; t.setAttribute('aria-hidden', 'true');
  Object.assign(t.style, {left:(at.left + at.width / 2) + 'px', top:(at.top + at.height + 6) + 'px', zIndex:g.style.zIndex || LAYER.flight});
  document.body.appendChild(t);
  if (!reduceMotion()) t.animate([{opacity:0, translate:'0 -4px'}, {opacity:1, translate:'0 0'}], {duration:200, easing:'ease-out'});
  g.classList.add('oplinger');
  const sc = at.width / w0;
  const pulse = g.animate([{transform:`scale(${sc})`, filter:'drop-shadow(0 0 0 rgba(0,0,0,0))'}, {transform:`scale(${sc * 1.04})`, filter:'drop-shadow(0 14px 17px rgba(0,0,0,.3))', offset:.3}, {transform:`scale(${sc})`, filter:'drop-shadow(0 10px 13px rgba(0,0,0,.25))'}], {duration:600, fill:'forwards', easing:'ease-out'});
  return new Promise(res => {
    let done = false; const end = () => { if (done) return; done = true; OPQ.skip = null; clearTimeout(tm); document.removeEventListener('pointerdown', end, true); pulse.cancel(); g.style.transform = `scale(${sc})`; t.remove(); res(); };
    const tm = setTimeout(end, ms);
    OPQ.skip = end; document.addEventListener('pointerdown', end, true);   // a tap anywhere ends the hold (and does what it would anyway)
  });
}
// move g (base w0×h0, origin top left) so it sits at rect r
function oppPlace(g, r, w0){ g.getAnimations().forEach(a => a.cancel()); g.style.setProperty('left', r.left + 'px', 'important'); g.style.setProperty('top', r.top + 'px', 'important'); g.style.transform = `scale(${r.width / w0})`; }
// a buy: the card lifts where it sat in the market (or rises from its deck when it never showed, or appears in the
// middle when its spot is off screen), holds, then flies into the buyer's deck button
function oppBuyStep(i, ev, src){
  const onMat = matOppBuy(i, ev, src); if (onMat) return onMat;   // on the mat: lifts off its spot, lands on their side
  const sz = src && src.el ? {w:src.r.width, h:src.r.height} : cardSize(), w0 = sz.w, h0 = sz.h;
  const {g, ctx} = flyer(src && src.el ? src.el : ev.n, ev.k);
  const at = oppStage(w0, h0, 1.25);
  const v = dealView($('view-play').querySelector('.mktp') || document.body), r = src ? src.r : null;
  const from = r && r.width && r.top + r.height / 2 >= v.top && r.top + r.height / 2 <= v.bottom ? r : null;
  flyEl(g, from || at, w0, h0, 0, ctx); g.style.transformOrigin = '0 0';
  const tag = `${oppWho(i)} bought · $${ev.price}${ev.on ? ` · leveled ${dispName(ev.on)}` : ''}`;
  try{ sfx.pick(); }catch(e){}
  let moved;
  if (from && src.el){
    const s1 = at.width / w0;
    const mv = g.animate([
      {transform:'translate(0,0) scale(1)', filter:'drop-shadow(0 0 0 rgba(0,0,0,0))'},
      {transform:`translate(${(at.left - from.left) * .5}px,${(at.top - from.top) * .5 - 18}px) scale(${(1 + s1) / 2 * 1.04})`, filter:'drop-shadow(0 18px 20px rgba(0,0,0,.3))', offset:.5},
      {transform:`translate(${at.left - from.left}px,${at.top - from.top}px) scale(${s1})`, filter:'drop-shadow(0 10px 13px rgba(0,0,0,.25))'}],
      {duration:520, easing:'cubic-bezier(.3,.7,.3,1)', fill:'forwards'});
    moved = mv.finished.catch(() => {});
  } else if (from){
    moved = cardFlight(g, from, at, {w0, h0, keep:true, dur:650, onLand:() => {}}).finished.catch(() => {});
  } else { g.animate([{opacity:0, transform:`scale(${at.width / w0 * .9})`}, {opacity:1, transform:`scale(${at.width / w0})`}], {duration:260, easing:'ease-out'}); moved = Promise.resolve(); }
  return moved.then(() => { oppPlace(g, at, w0); return oppHold(g, at, w0, h0, tag, i); }).then(() => new Promise(res => {
    const to = deckBtnOf(i);
    if (!to){ g.animate([{opacity:1}, {opacity:0}], {duration:250}).onfinish = () => { g.remove(); res(); }; return; }
    g.style.zIndex = flyZ(to); g.style.transform = '';
    cardFlight(g, at, to.getBoundingClientRect(), {w0, h0, dur:950, onLand:() => { g.remove(); bumpEl(to); try{ sfx.coin(0.35); }catch(e){} res(); }});
  }));
}
// a sale: the card rises out of the seller's deck button to the middle, holds, then drops into the discard pile
function oppSellStep(i, ev, src){
  const onMat = matOppSell(i, ev, src); if (onMat) return onMat;   // on the mat: lifts off their side, lands on the pile
  const from = deckBtnOf(i);
  const {w:w0, h:h0} = cardSize(), {g} = flyer(ev.n, ev.k, {own:1});
  const at = oppStage(w0, h0, 1.25);
  return new Promise(res => {
    const a = from ? from.getBoundingClientRect() : null;
    flyEl(g, a || at, w0, h0);
    const rise = a ? cardFlight(g, a, at, {w0, h0, keep:true, dur:650, onLand:() => {}}) : null;
    const go = () => {
      oppPlace(g, at, w0);
      oppHold(g, at, w0, h0, `${oppWho(i)} sold · +$1`, i).then(() => {
        const pile = ev.n === 'Field' ? fieldCardEl() : $('muster-pile');
        const target = pile && (pile.querySelector('.mpcards') || pile);
        if (!target || !target.getClientRects().length){ g.animate([{opacity:1}, {opacity:0}], {duration:250}).onfinish = () => { g.remove(); res(); }; return; }
        g.style.zIndex = flyZ(target); g.style.transform = '';
        cardFlight(g, at, target.getBoundingClientRect(), {w0, h0, dur:900, onLand:() => { g.remove(); bumpEl(target); res(); }});
      });
    };
    if (rise) rise.finished.then(go, go); else go();
  });
}
/* A sold card flies out of its owner's deck button into the discard pile (a sold Field back to the Field in the shop),
   growing to card size on the way and shrinking into the pile, which bumps as it lands. */
function flySell(i, name, kind, srcCard, lifted){
  if (!lifted && matSellFlight(i, name)) return;   // sold from a card lifted off the mat: it flies on from there
  if (reduceMotion() || !G){ if (lifted) lifted.g.remove(); return; }
  const from = deckBtnOf(i);
  const pile = name === 'Field' ? fieldCardEl() : $('muster-pile');
  if (lifted){
    // a card you sold from the pop-up: it already rose out of its spot; now it travels on into the discard pile
    const target = pile && pile.offsetParent ? (pile.querySelector('.mpcards') || pile) : null;
    if (!target){ lifted.g.remove(); return; }
    lifted.g.getAnimations().forEach(a => a.cancel());
    const L = lifted.r;
    pinFly(lifted.g, L.left, L.top, L.w0, L.h0);
    const tb = target.getBoundingClientRect(), dk = $('dock'), inBar = !!(dk && dk.getClientRects().length && dk.contains(target));
    cardFlight(lifted.g, L, tb, {w0:L.w0, h0:L.h0, dur:inBar ? 1000 : 900, arc:inBar ? 40 : 0, onLand:() => { lifted.g.remove(); bumpEl(target); }});
    return;
  }
  if (!from || !pile || !pile.offsetParent) return;
  const {w:w0, h:h0} = cardSize(), {g} = flyer(srcCard || name, kind, {own:1});
  if (srcCard) g.className = `mcard ${kind}`;
  const a = from.getBoundingClientRect(), target = pile.querySelector('.mpcards') || pile;
  flyEl(g, a, w0, h0, flyZ(target));
  const tb = target.getBoundingClientRect(), dk = $('dock'), inBar = !!(dk && dk.getClientRects().length && dk.contains(target));
  cardFlight(g, a, tb, {w0, h0, dur:inBar ? 1300 : 1150, arc:inBar ? Math.max(120, h0 + 40) : 0, onLand:() => { g.remove(); bumpEl(target); }});
}
