/* ===== Shop streamlining: out of money, only Recruits/Fields left, out of buys =====
   All of it reads the same buy rules as the Buy buttons (buyQuote), so it can't disagree with them. */
var flashedNow = false, autoPassT = null, noteSeenKeys = null, autoNews = '';
// no buy left this shop: nothing could be bought even with unlimited money, and no Divine Favor in hand to add one
// (afterPass: judge a player who already passed, for the "out of buys" notice about the opponent)
function noBuysLeft(g, i, afterPass){
  if (!g || g.raid || g.phase !== 'shop' || (!afterPass && g.passed[i])) return false;
  const p = g.players[i];
  if ((p.mir || []).includes('Divine Favor')) return false;
  const rich = {...p, money:1e9};
  for (const o of aiShopOptions(g, i)) if (buyQuote(rich, g.buys[i], o.name, o.kind, o.src, mirSur(mirOf(g, o)), pairOf(g, o), mirOf(g, o).length).ok) return false;
  return true;
}
// 'broke': buys left but nothing affordable; 'low': the only things affordable are Recruits and Fields
function shopMoneyState(g, i){
  if (noBuysLeft(g, i)) return null;
  const names = new Set();
  for (const o of aiShopOptions(g, i)) if (buyInfo(g, i, o.name, o.kind, o.src, o.idx).ok) names.add(o.name);
  if (!names.size) return {st:'broke'};
  if ([...names].every(n => n === 'Recruit' || n === 'Field')) return {st:'low', names};
  return null;
}
function shopNotes(){
  if (pendingFlash) return;   // the turn banner is waiting for the opponent's cards; the notes come with it
  document.querySelectorAll('[data-act="pass"].passglow').forEach(b => b.classList.remove('passglow'));
  if (!G || G.raid || ui.start || ui.roll) return;
  const ap = ui.autoPass;
  // the auto-pass ended the shop (the other player had already passed): still say why
  if (ap && ap.round === G.round && !ap.shown && G.phase !== 'shop'){
    ap.shown = true;
    const pp = PP() && !G.net;
    turnFlash('Out of buys', pp ? `${nm(ap.who)} has no buys left this round and passes.` : 'You have no buys left this round and pass your turn.', 'mine', ap.who, pp ? '' : autoNews, true); autoNews = '';
    return;
  }
  if (ui.battle || G.over || G.phase !== 'shop') return;
  const S = seat(); if (cur(G) !== S || G.passed[S]) return;
  if (G.net && !NET) return;
  // out of buys: pass for them, after a moment so the card they just bought can land
  if (noBuysLeft(G, S)){
    if (autoPassT) return;
    autoPassT = setTimeout(() => {
      autoPassT = null;
      const s2 = seat();
      if (!G || G.phase !== 'shop' || ui.battle || cur(G) !== s2 || G.passed[s2] || !noBuysLeft(G, s2)) return;
      ui.autoPass = {round:G.round, who:s2, shown:false};
      playerMove(['p']);
    }, 800);
    return;
  }
  const m = shopMoneyState(G, S); if (!m) return;
  if (m.st === 'broke') document.querySelectorAll('[data-act="pass"]').forEach(b => b.classList.add('passglow'));
  if (!noteSeenKeys) noteSeenKeys = new Set();
  const key = `${G.round}|${S}|${m.st}`; if (noteSeenKeys.has(key)) return;   // once per shop for each
  noteSeenKeys.add(key);
  const money = G.players[S].money, who = PP() && !G.net ? `${nm(S)}, you have` : 'You have';
  const cheap = m.names ? (m.names.has('Recruit') && m.names.has('Field') ? 'a Recruit or a Field' : m.names.has('Field') ? 'a Field' : 'a Recruit') : '';
  const big = m.st === 'broke' ? 'Not enough money' : 'Running low';
  const small = m.st === 'broke'
    ? `${who} $${money}, not enough to buy anything. Pass, or open your deck to sell cards for $1 each.`
    : `${who} $${money}: enough for ${cheap}, but nothing else. You can also open your deck to sell cards for $1 each.`;
  // the turn banner just opened (it's your turn now): add this to it rather than covering it
  const box = flashedNow && document.querySelector('.turnflash:not(.out) .tfbox');
  if (box) box.querySelector(':scope > em').insertAdjacentHTML('beforebegin', `<div class="tfnote"><b>${esc(big)}.</b> ${esc(small)}</div>`);
  else turnFlash(big, small, 'mine', S, '');
}
function dismissTurnFlash(){ document.querySelectorAll('.turnflash:not(.out):not(.sticky)').forEach(n => n._close ? n._close() : n.remove()); }
function turnFlash(big, small, kind, side, news, sticky){
  document.querySelectorAll('.turnflash').forEach(n => n.remove());
  const el = document.createElement('div');
  el.className = `turnflash ${kind} s${VS(side)}${sticky ? ' sticky' : ''}`; el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-live', 'assertive'); el.tabIndex = -1;
  el.innerHTML = `<div class="tfbox"><b>${esc(big)}</b>${small ? `<span>${esc(small)}</span>` : ''}${news || ''}<em>${kind === 'theirs' ? 'Tap to hide' : 'Tap anywhere to continue'}</em></div>`;
  // stays up until tapped or clicked (anywhere); that tap only dismisses it, so it can't buy a card by accident
  const close = e => { if (e){ e.preventDefault(); e.stopPropagation(); } if (el._closing) return; el._closing = true; popOut([el.querySelector('.tfbox')], el, () => el.remove()); document.removeEventListener('keydown', key, true); };
  el._close = close;
  const key = e => { if (['Escape', 'Enter', ' '].includes(e.key) && el.isConnected){ close(e); } };
  (kind === 'theirs' ? el.querySelector('.tfbox') : el).addEventListener('click', close);
  document.addEventListener('keydown', key, true);
  document.body.appendChild(el);
  popIn([el.querySelector('.tfbox')], el);
}
/* In a game, the page sits scrolled past the title banner so the scoreboard and board fill the screen (scroll up for the title and tabs).
   It re-centers there at the opening roll and on every phase change (shop, mobilize, battle). */
var inGameView = false, phaseKey = null;
function toGame(){
  const v = $('view-play'); if (!v || v.hidden || !G || ui.start || (NET && !NET.started)) return;
  if (ui.battle && centerBattle()) return;
  if (v.querySelector('.osshop.osdesk')) { if (window.scrollY) window.scrollTo(0, 0); return; }
  window.scrollTo({top: Math.max(0, v.getBoundingClientRect().top + window.scrollY - 8)});
}
/* Battle: center the battle line (both sides' units, charges meeting in the middle) in the space left between the
   pinned top bar and the bottom dock, so the fight is on screen without scrolling. If the line is taller than that
   space, the clash between the two charging units sits in the middle of it instead. */
// the screen space between the pinned top bars (once stuck) and the bottom dock, in window coordinates
function battleRoom(){
  const v = $('view-play');
  const fixedH = el => { if (!el || !el.offsetHeight) return 0; const ps = getComputedStyle(el).position; return ps === 'sticky' || ps === 'fixed' ? el.getBoundingClientRect().height : 0; };
  const safeTop = parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0;
  const desk = typeof matDesk === 'function' && matDesk();   // desktop mat: between the Caravan strips (the step line and buttons are in the right column)
  const top = safeTop + fixedH($('gtop')) + fixedH(v && v.querySelector('.battlectl')) + fixedH(v && v.querySelector('.osbars .osseat.opp')) + (desk ? 0 : fixedH(v && v.querySelector('.osbars') && document.querySelector('#gtop .pbhint')));   // where the pinned bars end once stuck (on the mat: and the rival's Caravan bar, with the step line under it)
  const dk = $('dock'), bot = window.innerHeight - (!desk && dk && fixedH(dk) ? dk.getBoundingClientRect().height : 0) - fixedH(v && v.querySelector('.osbars .osseat.me'));
  return {top, bot};
}
function centerBattle(){
  const v = $('view-play'), ln = v && v.querySelector('.stage .line'); if (!ln) return false;
  if (typeof matDesk === 'function' && matDesk() && ln.classList.contains('matz')){
    if (window.scrollY) window.scrollTo(0, 0);
    return true;
  }
  const {top, bot} = battleRoom();
  const r = ln.getBoundingClientRect(), room = bot - top, x = v.querySelector('.stage .clash');
  let y;   // how far down the page to scroll
  if (r.height <= room || !x) y = r.top - top - Math.max(8, (room - r.height) / 2);
  else { const c = x.getBoundingClientRect(); y = (c.top + c.bottom) / 2 - (top + bot) / 2; }   // too tall: the charging units meet mid-screen
  window.scrollTo({top: Math.max(0, y + window.scrollY)});
  return true;
}
function markGame(on){
  inGameView = on; document.body.classList.toggle('ingame', on);
  const k = !on ? null : ui.roll ? 'roll' : (G.round || 0) + ':' + (ui.battle ? 'battle' : G.over ? 'over' : G.phase);
  // phase change: scroll there now (before the market deal measures where its cards land), and again next frame
  if (on && k !== phaseKey){ toGame(); requestAnimationFrame(toGame); }
  phaseKey = k;
}
// The Play tab's own drawing. Call renderPlay(), never this: renderPlay adds the steps around it.
function drawPlay(options){
  try{ if (G && G.over && G.opp && G.opp.rated && !G.ratedDone && !G.pp && !G.net) recordResult(); }catch(e){}   // safety net: never lose a finished rated game
  try{ if (peekEl) closePeek(); }catch(e){}   // a re-render (e.g. the AI buys) makes an open peek stale; it sinks away
  if (NET && !NET.started && !ui.start){ markGame(false); $('view-play').innerHTML = netLobbyHTML(); return; }
  if (!G || ui.start){ markGame(false); $('view-play').innerHTML = startHTML(); if (turnKey === null) turnKey = ''; return; }
  if (ui.roll){
    DOCKINFO = null;
    markGame(true);
    $('view-play').innerHTML = pbarHTML() + rollHTML() + peekWinHTML();
    if (turnKey === null) turnKey = '';
    saveGame();
    return;
  }
  if (G.net && NET?.resignRequested && !G.over && !NET.err){
    markGame(true);
    DOCKINFO = null;
    document.body.classList.remove('dsopen');
    $('view-play').innerHTML = pbarHTML() + `<section class="panel finalbox" role="status"><h2>Resigning…</h2>
      <p>Your resignation is saved. Waiting for the host to confirm it.</p></section>`;
    return;
  }
  if (ui.battle && ui.frame >= ui.battle.frames.length - 1) ui.revealed = true;   // the result shows once the battle has played out (or been skipped)
  const dealNow = !ui.battle && G.phase === 'shop' && ui.dealt !== G.round;
  if (options?.purchase && !dealNow && matRefreshPurchase()){
    saveGame();
    markMore();
    flashedNow = false;
    turnWatch();
    shopNotes();
    return 'purchase';
  }
  const changes = describeOverrides(OV);
  let h = netNoticeHTML() + (changes.length && !(G && G.net) ? `<p class="note">Custom balance active (${changes.length} unpushed ${plural(changes.length, 'change')}, set in Balance & stats). New games use it.</p>` : '') + boardHTML();
  if (G.resignedBy != null) h += resignResultHTML();
  else if (ui.battle) h += battleHTML();
  else if (G.phase === 'shop') h += shopHTML();
  else if (G.phase === 'mobilize') h += mobilizeHTML();
  h += `<div class="row">${suChipHTML()}${G.net && NET ? `<span class="note">Online room <b class="mono">${esc(NET.code)}</b></span><button type="button" data-act="st-net-leave">Leave room</button>` : ''}<span class="grow"></span><button type="button" data-act="newgame">${G.over && !hideResult() && !PP() ? 'Choose next opponent' : 'New game…'}</button></div>`;
  const lw = $('view-play').querySelector('.linewrap'), sx = lw ? lw.scrollLeft : 0;
  const wasMine = !!$('view-play').querySelector('.dock.mine');
  const dockH = dockHTML();
  if (ui.visArm && !(G && G.phase === 'shop' && !ui.battle && cur(G) === seat() && !G.passed[seat()] && (G.players[seat()].mir || []).includes('Vision') && !peekOf(G, seat(), 'vis'))) ui.visArm = false;
  const POPS = [['.mirmodal', '.mirmbox'], ['.remind', '.remindbox'], ['.mirtray', '.mirtray'], ['.pkwin', '.pksheet']];
  const vp0 = $('view-play'), oldPops = POPS.map(([b]) => { const e = vp0.querySelector(b); return e ? {e, r:e.getBoundingClientRect()} : null; });
  const playHTML = `${pbarHTML()}<div style="display:flex;flex-direction:column;gap:14px">${h}</div>${dockH}${G && !ui.start ? peekWinHTML() : ''}${remindHTML()}`;
  if (typeof morphOn === 'function' && morphOn()) morphInto($('view-play'), playHTML); else $('view-play').innerHTML = playHTML;
  syncCardSize();
  document.body.classList.toggle('dsopen', !!$('view-play').querySelector('.pkwin'));
  { const pw = vp0.querySelector('.pkwin'); if (pw && !pw.__swiped && (pw.__swiped = 1)) wireSwipe(pw.querySelector('.pksheet'), pw, pw.querySelector('.sheethead'), null,
      {open:() => pw.isConnected && !pw.dataset.gone, now:closePkWin, leave:() => { pw.dataset.gone = '1'; }, done:closePkWin}); }
  POPS.forEach(([b, x], k) => {
    const now = vp0.querySelector(b), old = oldPops[k];
    if (now && !old) popIn([now.matches(x) ? now : now.querySelector(x)], now.matches(x) ? null : now);
    else if (old && !now){
      // it closed: put the old one back on screen just long enough to sink away
      const e = old.e;
      if (b === x){ Object.assign(e.style, {position:'fixed', left:old.r.left + 'px', top:old.r.top + 'px', width:old.r.width + 'px', height:old.r.height + 'px', margin:'0', zIndex:'60'}); }
      document.body.appendChild(e);
      popOut([b === x ? e : e.querySelector(x)], b === x ? null : e, () => e.remove());
    }
  });
  const dk = $('dock');
  if (dk){
    document.documentElement.style.setProperty('--dockh', dk.offsetHeight + 'px');
    if (dk.classList.contains('mine') && !wasMine && !reduceMotion()) dk.animate([{transform:'translateY(6px)', filter:'brightness(1.12)'}, {transform:'none', filter:'none'}], {duration:320, easing:'cubic-bezier(.2,.9,.3,1.2)'});
  }
  saveGame();
  if (ui.remind){ const go = $('view-play').querySelector('[data-act="remind-go"]'); if (go) go.focus(); }
  const lw2 = $('view-play').querySelector('.linewrap'); if (lw2 && sx) lw2.scrollLeft = sx;
  if (ui.battle && lw2){
    mountAbWin();
  }
  if (ui.battle && ui.chronOpen){ const on = document.querySelector('.fr.on'); if (on) on.scrollIntoView({block:'nearest'}); }
  const pb = $('gtop'), bd = pb && pb.offsetHeight ? pb : $('view-play').querySelector('.board'); if (bd) document.documentElement.style.setProperty('--bh', bd.offsetHeight + 'px');
  markMore();
  flashedNow = false;
  if (typeof bazaarReturnsToShop !== 'function' || !bazaarReturnsToShop()) turnWatch();
  shopNotes();
  markGame(true);   // first, so the page has already scrolled when the deal measures each card's spot
  return dealNow;
}
/* Save and resume: a game in progress (against the AI or pass and play) is kept in this browser after every change,
   so a phone that reloads the tab (switching apps, locking the screen) comes back to the same spot. Online games
   reconnect through their room instead. A finished game is cleared once its result has been shown. */
var SAVE_KEY = 'sow-save-v2', saveT = null;
var SAVE_UI = ['battle','frame','draft','lastDraft','lastDrafts','drafts','mobSeat','handoff','mktTab','dealt','ghosts','bazaarSlots','roll','revealed','pre','lastTurn','musterOpen','bannerOff','raidOrders'];
/* Sets and Maps (such as the cards each player has seen this shop) don't survive plain JSON: they come back as empty
   objects and the next Buy or Pass throws. Save them tagged and rebuild them on load, so a reload or a page update
   picks the game up where it was. */
const saveRep = (k, v) => v instanceof Set ? {$set:[...v]} : v instanceof Map ? {$map:[...v]} : v;
const saveRev = (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? ('$set' in v ? new Set(v.$set) : '$map' in v ? new Map(v.$map) : v) : v;
// a save from an older version of the page: rebuild sets that were flattened to {} and fill in any fields added since
function upgradeSave(g){
  if (!g.peek){ g.peek = [[], []]; for (const by of PEEK_BY) for (const i of [0,1]){ const o = g[by] && g[by][i]; if (o && o.cards) g.peek[i].push({by, k:o.k, cards:o.cards}); } }
  delete g.bm; delete g.vis;
  for (const k of ['seen', 'mirSeen']) if (Array.isArray(g[k])) g[k] = g[k].map(x => x instanceof Set ? x : new Set(Array.isArray(x) ? x : []));
  if (!('battleMir' in g)) g.battleMir = false;   // a game saved before battle miracles existed
  if (!('refill' in g)) g.refill = false;   // a game saved before automatic shop refills existed
  const d = newGame({rnd:Math.random, miracles:g.miracles, battleMir:g.battleMir, refill:g.refill, target:g.target, labels:g.labels});
  for (const k in d) if (!(k in g)) g[k] = d[k];
  g.players.forEach((p, i) => { for (const k in d.players[i]) if (!(k in p)) p[k] = d.players[i][k]; });
  // a game saved before display cards had ids: give them one
  for (const c of [...(g.disp.u || []), ...(g.disp.b || []), ...(g.frozen || []).flat()]) if (c && typeof c === 'object' && c.id == null) c.id = g.cid = (g.cid || 0) + 1;
  return g;
}
function saveGame(){
  if (typeof bazaarLabRequested === 'function' && bazaarLabRequested()) return;
  clearTimeout(saveT);
  saveT = setTimeout(saveNow, 300);
}
function saveNow(){
  clearTimeout(saveT); saveT = null;
  try{
    if (!G || G.net || G.replay) return;   // a battle-code replay is never saved over the real game
    if (G.over && !hideResult()){ localStorage.removeItem(SAVE_KEY); return; }
    const u = {}; for (const k of SAVE_UI) if (ui[k] !== undefined) u[k] = ui[k];
    const {rnd, ...g} = G;
    const put = (gg, uu) => localStorage.setItem(SAVE_KEY, JSON.stringify({v:1, at:Date.now(), len:LEN, g:gg, u:uu}, saveRep));
    try{ put(g, u); }
    catch(e){   // storage full: drop the match record, then the battle replay, rather than lose the game
      const {rec, ...g2} = g;
      try{ put(g2, u); }catch(e2){ const {battle, frame, ...u2} = u; put(g2, u2); }
    }
  }catch(e){}
}
function loadSave(){
  try{
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null', (k, v) => saveRev(k, renameRevive(k, v)));   // renamed cards, then sets
    if (!s || s.v !== 1 || !s.g || !s.g.players || s.len !== LEN || (s.g.over && !(s.u && s.u.battle && !s.u.revealed))) return false;
    stopTimers();
    G = upgradeSave({...s.g, rnd:Math.random});
    ui = freshUI({...(s.u || {}), start:false});
    if (ui.roll){ ui.roll.rolling = false; if (ui.roll.first == null){ ui.roll.you = null; ui.roll.ai = null; ui.roll.tie = false; } }
    if (!ui.battle && G.phase === 'battle' && !G.over){
      if (raidNextFight(G)){ ui.mobSeat = 0; ui.handoff = PP() ? 0 : null; }
      else startShop(G);
    }   // the replay didn't fit in storage: go on to the next shop
    if (G.phase === 'mobilize' && !ui.draft && PP() && ui.handoff == null) ui.draft = defaultDraft();
    return true;
  }catch(e){ return false; }
}
window.addEventListener('pagehide', () => { if (saveT) saveNow(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveT) saveNow(); });

/* Cards that left the display at the end of the last shop (unbought returning cards) fly from the slot they sat in to
   the discard pile, the reverse of a deal. Returns when the last one lands (ms), so the deal can start after it.
   The whole start of a round (cleanup, upkeep and the deal) fits in about 2.5 seconds however many cards there are:
   each part has a fixed window in ROUND_FX and they overlap, so more cards means a tighter stagger, not a longer wait.
     cleanup  unbought cards fly to the discard pile    from   75 ms, staggered over 863, 813 each  → done by ~1750
     upkeep   hourglass tokens stamp on                  from  313 ms, staggered over 875, 563 each  → done by ~1750
     deal     new cards fly out of the deck and flip     from  500 ms, staggered over 900, 1319 each → done by ~2720
   (Tuned by Brian in the Oasis shop animation lab, Nov 2026.)
   With nothing to clean up or stamp, the deal starts at once. A dealt card can head for a spot an unbought card is
   leaving: it lands only after that card has lifted away.
   How unbought cards leave (leaveStyle): 'pile' flies each to the discard pile, shrinking to the pile's size on the way,
   rising leaveArc px extra at the top of its arc; 'sink' drops each straight down off its spot, fading out as it goes,
   so it never crosses the deal. */
const ROUND_FX = {leaveAt:75, leaveSpread:863, leaveGap:188, leaveDur:813, tokAt:313, tokSpread:875, tokGap:175, tokDur:563,
  dealAt:500, deal:{spread:900, gap:200, dur:1319, backDur:750, backLead:313}, leaveStyle:'pile', leaveArc:0};
const spreadGap = (n, spread, max) => n > 1 ? Math.min(max, spread / (n - 1)) : 0;
function leaveToPile(rows){
  if (matShopOn()) return 0;   // one-screen mat: these went to the discard pile in the sweep at the end of the last shop
  const L = G.leaving, pile = $('muster-pile'), mktp = $('view-play').querySelector('.mktp');
  if (!L || !pile || !mktp || !(L.u.length + L.b.length)) return 0;
  const pr = pile.querySelector('.mpcards').getBoundingClientRect(), pcx = pr.left + pr.width / 2, pcy = pr.top + pr.height / 2;
  const cnt = pile.querySelector('.mpcount'), total = (G.muster || []).length, arriving = L.u.length + L.b.length;
  let landed = 0; if (cnt) cnt.textContent = Math.max(0, total - arriving);
  let k = 0, end = 0;
  const gap = spreadGap(arriving, ROUND_FX.leaveSpread, ROUND_FX.leaveGap);
  [['u', rows[0]], ['b', rows[1]]].forEach(([kind, row]) => {
    if (!row) return;
    const slots = [...row.children].filter(c => !c.classList.contains('alwaysw') && !c.classList.contains('mdiv'));
    for (const {name, j, at} of L[kind]){
      const slot = (at != null && slots.find(el => el.dataset.at === String(at))) || slots[j] || slots[slots.length - 1]; if (!slot) continue;
      const card = slot.classList.contains('mcard') ? slot : slot.querySelector('.mcard') || slot;
      const mat = matFlightFrame(card, pile.querySelector('.mpcards'));   // on the one-screen mat: it flies in the mat's tilt
      const r = mat ? mat.r : card.getBoundingClientRect(); if (!r.width) continue;
      const d = kind === 'u' ? DEFS[name] : BDEFS[name]; if (!d) continue;
      const {g:gh} = flyer(name, kind); gh.classList.add('leaving', 'lghost'); gh.setAttribute('aria-hidden', 'true');   // the card's own face
      flyEl(gh, r, r.width, r.height, flyZ(pile), card.parentElement);   // flies into the discard pile, under the bottom bar when the pile is in it
      const delay = ROUND_FX.leaveAt + k++ * gap, dur = ROUND_FX.leaveDur;
      const onLand = () => { gh.remove(); landed++; if (cnt) cnt.textContent = Math.max(0, total - arriving + landed); bumpEl(pile.querySelector(".mpcards")); };
      gh.style.transformOrigin = '0 0';
      if (ROUND_FX.leaveStyle === 'sink'){
        // straight down off its spot, fading as it goes; the pile counts it when it's gone
        try{ sfx.flick(delay / 1000); }catch(e){}
        const an = gh.animate([{transform:'none', opacity:1}, {transform:`translateY(${r.height * .12}px)`, opacity:1, offset:.3},
          {transform:`translateY(${r.height * .8}px)`, opacity:0}], {duration:dur, delay, easing:'cubic-bezier(.5,0,.75,.4)', fill:'both'});
        an.onfinish = an.oncancel = onLand;
      } else {
        try{ sfx.flick(delay / 1000); sfx.drop(dealLandAt(delay + dur), .5); }catch(e){}   // off it goes; it lands on the pile
        cardFlight(gh, r, mat ? mat.d : pr, {dur, delay, arc:ROUND_FX.leaveArc, onLand, pre:mat ? mat.pre(gh) : ''});
      }
      end = Math.max(end, delay + dur);
    }
  });
  return end;
}
/* A card dealt face down out of a deck. A copy flies over everything (above the top bar, the bottom bar and any pop-up)
   from the deck to the card's spot, flips face up and lands; the real card stays invisible until then, so nothing is
   hidden behind the bars and nothing lands in the wrong place. A spot that can't be seen (scrolled off, or under a bar)
   just appears. Returns when it lands (ms), or 0. o.plain: a miracle card behind a market card (no flip). */
function dealView(el){
  const pw = el.closest('.pkbody');
  if (pw){ const r = pw.getBoundingClientRect(); return {top:r.top, bottom:r.bottom}; }
  const tb = $('gtop'), dk = $('dock');
  const shown = e => !!(e && e.getClientRects().length);   // (offsetParent is always null for fixed bars)
  const top = shown(tb) && getComputedStyle(tb).position === 'fixed' ? tb.getBoundingClientRect().bottom : 0;
  const bottom = shown(dk) ? dk.getBoundingClientRect().top : window.innerHeight;
  return {top, bottom};
}
/* STACKING ORDER (z-index), back to front. Every layer on the play screen belongs to one of these; keep new UI in its band.
     0–15   the page: market cards, miracle backs (4), battle columns (15)
     18     FLYING CARDS: deals out of a deck, buys into a deck button, sells and unbought cards into the discard pile.
            Over the market, UNDER both bars: a card dealt from a deck in the bottom bar slides out from under it, a
            card bound for the discard pile slides in under it, and a market card behind the bar stays behind it.
     19–20  the bars: top info bar (19), bottom bar with the decks, Discard and buttons (20)
     30     hover boxes on market cards (miracles behind a card)
     50     tooltips
     60     floating controls and messages: the Miracles tab and tray, toasts
     65–67  pop-ups: deck sheet (65), peek window (66), a card flying into one of those pop-ups (66 / 67)
     70–72  the card pop-up (a card's full view, phone sheet), its miracles box
     75     a dying battle card flying to the graveyard
     80     dialogs: miracle pop-up, reminders
     90     turn banners ("Your turn", "Pass the device"): always in front, nothing flies over them */
const LAYER = {bars:20, flight:18, popup:65, peekWin:66, popupFlight:67, cardPop:70, banner:90};
function flyZ(dest){
  if (dest && dest.closest){
    if (dest.closest('.pkwin')) return LAYER.popupFlight;           // a peek card dealt into the peek window
    if (dest.closest('.decksheet, .dsheet')) return LAYER.peekWin;   // a buy landing in an open deck sheet
  }
  return LAYER.flight;
}
/* THE DEAL FLIGHT'S SHAPE (dealFly), tunable in the "Oasis shop animation lab". Timings are shares of the flight (0–1):
     lift     how big the card grows as it leaves the deck (at most; it starts the deck's size)
     rise     px it rises as it leaves     tilt   degrees it tilts as it leaves     leaveAt  when it has left the deck
     land     when it touches down in its spot, face down; the landing sound plays then (a miracle back: plainLand)
     flipAt / flipMid / flipEnd   the turn starts, is edge on, and is face up (then settles to its true size)
     flipRise px it lifts toward you while turning     flipGrow  how big it gets mid-turn
     sndEarly ms the landing and flip sounds play early (on top of the device's own audio delay, which is always allowed for)
   Sounds: a swish (sfx.flick) as it leaves the deck, a soft set-down (sfx.drop) as it lands, a louder swish edge on (flipMid). */
// Brian's values from the lab (Nov 22): no hop, a slower turn with a bigger pop toward you, sounds 200 ms later
const DEAL_FX = {lift:.52, rise:0, tilt:10, leaveAt:.138, land:.447, plainLand:.7, flipAt:.622, flipMid:.804, flipEnd:.94,
  flipRise:32, flipGrow:1.38, sndEarly:-200};
// The full-size desktop cards make a shorter arc and start the turn as they touch down.
const DESK_DEAL_FX = {...DEAL_FX, land:.43, flipAt:.455, flipMid:.66, flipEnd:.91,
  tilt:6, flipRise:17, flipGrow:1.12, sndEarly:0};
const DESK_DEAL_WAVE = {spread:420, gap:96, dur:790, backDur:440, backLead:140};
const DESK_DEAL_REFILL = {spread:155, gap:80, dur:630, backDur:400, backLead:120};
// a landing sound's time, in seconds from now: the landing time (ms) less the early nudge
const dealLandAt = (ms, fx = DEAL_FX) => Math.max(0, ms - fx.sndEarly) / 1000;
// Height is measured along the mat's normal. Leave a little clearance between sampled poses.
function bazaarDealTurn(width, transform, start, middle, end){
  const frames = [];
  for (const side of [0, 1]){
    const from = side ? middle + .001 : start, to = side ? end : middle;
    for (let i = 0; i <= 8; i++){
      const t = i / 8, angle = side ? -90 * (1 - t) ** 1.25 : 90 * t ** 1.25;
      const z = width * .51 * Math.abs(Math.sin(angle * Math.PI / 180));
      frames.push({offset:from + (to - from) * t, angle, z,
        transform:transform(0, 0, 0, angle, 1, 1, z)});
    }
  }
  // Keep the first edge-on pose until the face takes over at the matching pose.
  const keys = frames.map(({offset, transform}) => ({offset, transform}));
  keys[8].easing = 'steps(1,end)';
  return {frames, keys};
}
function bazaarDealGroundShadow(origin, rect, pre, turn, near, land, delay, duration){
  const shadow = document.createElement('div');
  shadow.className = 'osbazaar-deal-shadow';
  shadow.setAttribute('aria-hidden', 'true');
  Object.assign(shadow.style, {left:rect.left+'px', top:rect.top+'px', width:rect.width+'px',
    height:rect.height+'px', zIndex:LAYER.flight - 1, transformOrigin:origin});
  document.body.append(shadow);
  const {opacity, blur, offset} = bazaarShadow(0);
  const frame = (at, angle = 0, z = 0, alpha = opacity * .38) => ({
    offset:at, opacity:alpha,
    transform:`${pre}translate(${z * .15}px, ${offset + z * .18}px) scaleX(${Math.max(.045, Math.abs(Math.cos(angle * Math.PI / 180)))})`,
    filter:`blur(${blur / 2 + z * .028}px)`
  });
  const animation = shadow.animate([frame(0, 0, 0, 0), frame(near, 0, 0, 0), frame(land),
    ...turn.map(({offset, angle, z}) => frame(offset, angle, z)),
    frame(1, 0, 0, 0)], {duration, delay, fill:'both'});
  return animation;
}
function dealFly(el, deck, delay, dur, o = {}){
  if (!el || !deck || !el.isConnected) return 0;
  const geometry = o.geometry;
  let r = geometry?.screen || el.getBoundingClientRect(), dr = geometry?.source || deck.getBoundingClientRect();
  if (!r.width || !dr.width) return 0;
  const v = geometry?.view || dealView(el), cy = r.top + r.height / 2;
  if (cy < v.top || cy > v.bottom) return 0;
  const mat = geometry?.mat || matFlightFrame(el, deck);
  if (mat){ r = mat.r; dr = mat.d; }
  const bazaar = !!mat && !!el.closest('.osdesk .osmkt:has(>.osbazaar)');
  const {g} = flyer(el, null, {exact:true});
  g.classList.add('flying'); g.classList.remove('cant', 'peeked'); g.setAttribute('aria-hidden', 'true');
  if (bazaar) bazaarFlightCard(g);
  Object.assign(g.style, {zIndex:flyZ(el), pointerEvents:'none'});
  pinFly(g, r.left, r.top, r.width, r.height);
  flyHost(el.parentElement).appendChild(g);   // styled exactly as the card in its spot
  const origin = geometry?.origin;
  if (origin) g.style.transformOrigin = origin.css;
  const pre = mat ? mat.pre(g, origin?.point) + ' ' : '';
  // until its turn the copy is hidden (the deck and its count show through); then it appears exactly on the deck, the
  // size of its top card, lifts off, tilts, travels to its spot and flips over
  const dx = dr.left + dr.width / 2 - (r.left + r.width / 2), dy = dr.top + dr.height / 2 - (r.top + r.height / 2);
  const F = o.fx || DEAL_FX, sx = dr.width / r.width, sy = dr.height / r.height, lift = Math.min(F.lift, Math.max(sx, sy) * 1.6);
  const dealScale = (x, y = x) => `scale(${bazaar ? 1 : x},${bazaar ? 1 : y})`;
  let kf, an, floor, SWAP = 1;
  if (o.plain){
    const start = `translate(${dx}px,${dy}px) ${dealScale(sx, sy)}`;
    kf = [
      {transform:start, opacity:0, offset:0},
      {transform:start, opacity:1, offset:.01},
      {transform:`translate(${dx * .85}px,${dy * .85 - 24}px) rotate(-10deg) ${dealScale(lift)}`, offset:.18},
      {transform:`translate(0,0) rotate(3deg) ${dealScale(1.04)}`, offset:.7},
      {transform:'none', offset:1}
    ];
    // on the mat: the tilt in front of every step, each step written as the same list so each part moves on its own
    if (pre) kf = kf.map(f => ({...f, transform:pre + (f.transform === 'none' ? 'translate(0,0)' : f.transform).replace(/^(translate\([^)]*\)) scale/, '$1 rotate(0deg) scale') + (f.transform === 'none' ? ' rotate(0deg) scale(1)' : '')}));
    an = g.animate(kf, {duration:dur, delay, easing:'cubic-bezier(.3,.7,.3,1)', fill:'both'});
  } else {
    /* A real 3D flip. The card flies out face down and LANDS in its spot face down; a beat later it turns over about its
       vertical axis in perspective (the near edge grows, the far edge shrinks, and the face's text foreshortens with it),
       lifting toward you as it turns, then settles face up. Every keyframe uses the same transform list so the browser
       interpolates each part on its own. The turn is split at the edge: 0→90° shows the back, then the face comes in from
       −90°→0°, so the face is never mirrored. Perspective scales with the card so phone and desktop flips look alike. */
    const P = Math.max(360, r.width * 3.4);
    const T = (x, y, rot, ry, s1, s2 = s1, z = 0) =>
      `${pre}${bazaar ? '' : `perspective(${P}px) `}translate3d(${x}px,${y}px,${z}px) rotate(${rot}deg) rotateY(${ry}deg) ${dealScale(s1, s2)}`;
    // the moments in order (each a little after the one before, whatever the table says)
    const up = (x, after, room) => Math.min(Math.max(x, after + .01), 1 - room);
    const oLeave = up(F.leaveAt, .01, .08), oLand = up(F.land, oLeave + .05, .06), oNear = Math.max(oLeave + .01, oLand - .06);
    const oFlip = up(F.flipAt, oLand, .04), oMid = up(F.flipMid, oFlip, .03), oEnd = up(F.flipEnd, oMid + .001, .01);
    SWAP = oMid;
    const turn = bazaar ? bazaarDealTurn(r.width, T, oFlip, oMid, oEnd) : null;
    kf = [
      {transform:T(dx, dy, 0, 0, sx, sy), opacity:0, filter:'brightness(1)', offset:0},
      {transform:T(dx, dy, 0, 0, sx, sy), opacity:1, offset:.01},
      {transform:T(dx * .85, dy * .85 - F.rise, bazaar ? 0 : -F.tilt, 0, lift), offset:oLeave, easing:'cubic-bezier(.3,.6,.35,1)'},
      {transform:bazaar ? T(dx * .12, dy * .12, 0, 0, 1) : T(0, -4, 2, 0, 1.02), offset:oNear, easing:'ease-out'},
      {transform:T(0, 0, 0, 0, 1), offset:oLand},                                       // landed, face down
      ...(turn ? turn.keys : [
        {transform:T(0, 0, 0, 0, 1), filter:'brightness(1)', offset:oFlip, easing:'cubic-bezier(.45,0,.75,.6)'},
        {transform:T(0, -F.flipRise, 0, 90, F.flipGrow), filter:'brightness(.78)', offset:SWAP, easing:'steps(1,end)'},
        {transform:T(0, -F.flipRise, 0, -90, F.flipGrow), filter:'brightness(.78)', offset:SWAP + .001, easing:'cubic-bezier(.25,.5,.4,1)'},
        {transform:T(0, -2, 0, 0, 1.05), filter:'brightness(1)', offset:oEnd, easing:'ease-in-out'}
      ]),
      {transform:T(0, 0, 0, 0, 1), filter:'brightness(1)', opacity:1, offset:1}         // settles to its true size
    ];
    if (turn){
      kf.forEach(frame => { delete frame.filter; });
      g.classList.add('osbazaar-flipping');
      floor = bazaarDealGroundShadow(origin?.css || getComputedStyle(g).transformOrigin, r, pre, turn.frames, oNear, oLand, delay, dur);
      const face = el.querySelector('.cface.art');
      if (face) g.querySelector('.cface.art').animate([
        {boxShadow:'none'}, {boxShadow:'none', offset:oEnd}, {boxShadow:geometry?.shadow ?? getComputedStyle(face).boxShadow}
      ], {duration:dur, delay, fill:'both'});
    }
    an = g.animate(kf, {duration:dur, delay, easing:'linear', fill:'both'});
    if (floor){
      const removeShadow = () => floor.effect.target.remove();
      an.finished.then(removeShadow, removeShadow);
    }
  }
  if (!o.plain){
    const back = document.createElement('span'); back.className = 'dealback ' + (el.classList.contains('b') ? 'b' : 'u'); g.appendChild(back);
    if (mat){ back.classList.add('oback'); back.style.setProperty('--bcw', r.width + 'px'); back.style.setProperty('--bch', r.height + 'px'); }   // on the mat: the Oasis card back, like the shop decks
    back.animate([{opacity:1}, {opacity:1, offset:SWAP}, {opacity:0, offset:SWAP + .001}, {opacity:0}], {duration:dur, delay, fill:'both'});
    // face down, nothing of the face shows (not even text or a stamp past the card's edge); it all turns up with the flip
    for (const c of g.children) if (c !== back) c.animate([{visibility:'hidden'}, {visibility:'hidden', offset:SWAP}, {visibility:'visible', offset:SWAP + .001}, {visibility:'visible'}], {duration:dur, delay, fill:'both'});
  }
  if (!matTrackDeal(el, g, an)){
    const wait = el.animate([{opacity:0}, {opacity:0}], {duration:delay + dur});
    o.stage?.hold(wait);
    an.onfinish = an.oncancel = () => { g.remove(); wait.cancel(); };
  }
  if (o.stage){
    for (const animation of g.getAnimations({subtree:true})) o.stage.hold(animation);
    if (floor) o.stage.hold(floor);
  }
  return delay + dur;
}
// a deck's number counts down as its cards are dealt: it starts that many higher and drops as each one lifts off
function deckCountdown(deck, starts){
  const b = deck && deck.querySelector('.pcount'); if (!b || !starts.length) return;
  b.textContent = (parseInt(b.textContent, 10) || 0) + starts.length;
  for (const t of starts) setTimeout(() => { if (b.isConnected) b.textContent = Math.max(0, (parseInt(b.textContent, 10) || 0) - 1); }, t);
}
/* Deal the market at the start of each shop: new cards fly face down out of the deck and flip over.
   Like real cards left on the table, unbought cards from last shop never move: they are already in the same spot
   when the shop opens and only get their hourglass token stamped on. Recruit and Field stay put too. */
function dealMarket(){
  if (reduceMotion()) return;
  const bazaar = $('view-play').querySelector('.osdesk:not(.osmobmat):has(.osbazaar)');
  if (bazaar){ bazaarOpenAfterBattle(bazaar); return; }
  const vp = $('view-play'), rows = ['u','b'].map(k => vp.querySelector(`.mktp .msec[data-k="${k}"] .market`));
  if (!(deckEl('u') || deckEl('b')) || !rows.some(Boolean)) return;
  // first, the cards that left the shop fly from their old slots into the discard pile (cleanup)...
  const leaveEnd = leaveToPile(rows);
  const cards = rows.filter(Boolean).flatMap(row => [...row.querySelectorAll('.mcard')]).filter(el => !el.classList.contains('ghost') && el.offsetParent);
  // 1) cards left over from last shop never moved: they sit in their spots from the start (no animation)
  const returning = cards.filter(el => el.classList.contains('leaving') && !el.classList.contains('always'));
  const desk = matDesk();
  // 2) ...while each one's hourglass token drops onto its corner like a stamp (upkeep), once the cleanup is under way
  const tokBase = leaveEnd ? ROUND_FX.tokAt : ROUND_FX.leaveAt, tokGap = spreadGap(returning.length, ROUND_FX.tokSpread, ROUND_FX.tokGap), tokDur = desk ? 285 : ROUND_FX.tokDur;
  const returnGap = desk ? spreadGap(returning.length, 280, 78) : ROUND_FX.leaveGap;
  let tokEnd = 0, ti = 0, ri = 0;
  returning.forEach(el => {
    // one-screen mat: it comes back out of the top of its deck first (matReturnFly), and is stamped as it lands
    const k = (el.closest('.msec') || {}).dataset?.k === 'b' ? 'b' : 'u';
    const back = matReturnFly(el, deckEl(k), ROUND_FX.leaveAt + ri * returnGap, desk ? 525 : 620); if (back) ri++;
    const tok = el.querySelector('.hgtok'); if (!tok){ tokEnd = Math.max(tokEnd, back); return; }
    const delay = back ? back - (desk ? 0 : 80) : tokBase + ti++ * tokGap;
    setTimeout(() => { try{ sfx.tick(); }catch(e){} }, delay + tokDur * 0.64);
    tok.animate([
      {transform:'translate(14px,-46px) scale(2.1) rotate(-25deg)', opacity:0, offset:0},
      {transform:'translate(4px,-14px) scale(1.5) rotate(-8deg)', opacity:1, offset:.45},
      {transform:'translate(0,0) scale(.82) rotate(0deg)', opacity:1, offset:.78},
      {transform:'none', opacity:1, offset:1}
    ], {duration:tokDur, delay, easing:'cubic-bezier(.4,.1,.3,1)', fill:'backwards'});
    tokEnd = Math.max(tokEnd, delay + tokDur);
  });
  // one-screen mat: the always-for-sale piles slide back in from off the left edge, where they went for Mobilize
  if (matShopOn()) vp.querySelectorAll('.osmkt .msec[data-k] .alwaysw .astack > .mcard').forEach(el => {
    const t = matReturnFly(el, matSupplyOff(matFlatRect(el)), ROUND_FX.leaveAt, desk ? 490 : 620);
    if (t) el.closest('.alwaysw').animate([{opacity:0}, {opacity:0}], {duration:t});   // its ALWAYS tag waits for it too
    tokEnd = Math.max(tokEnd, t); });
  // 3) ...and the new cards are dealt alongside (Recruit and Field never leave the table)
  const fresh = cards.filter(el => !el.classList.contains('always') && !el.classList.contains('leaving'));
  const end = dealIn(fresh, desk ? 145 : leaveEnd || tokEnd ? ROUND_FX.dealAt : ROUND_FX.leaveAt, ROUND_FX.deal);
  ui.dealUntil = performance.now() + Math.max(leaveEnd, tokEnd, end);
}
/* Deal cards into their spots: each flies face down out of its own row's deck and flips over (miracles under a card
   are drawn and laid down first, farthest back first, then the card lands on top). The deck's count drops as each
   lifts off. Used for the deal at the start of the shop and for every card that joins the display during it.
   Returns how long it takes (ms). o: the start-of-round timing (ROUND_FX.deal), whose flights share a fixed window
   (spread); without it, the usual pace for a card or two joining mid-shop. */
function dealIn(els, base, o){
  const live = els.filter(el => el && el.isConnected);
  const desk = live.some(el => el.closest('#view-play .osdesk .osmkt'));
  const F = o?.fx || (desk ? DESK_DEAL_FX : DEAL_FX);
  if (desk && !o?.desktop) o = o ? DESK_DEAL_WAVE : DESK_DEAL_REFILL;
  const flights = live.reduce((a, el) => a + 1 + backsOf(el).length, 0);
  const gap = o?.launchGap ?? (o ? spreadGap(flights, o.spread, o.gap) : 160), dur = o ? o.dur : 1100, backDur = o ? o.backDur : 800, lead = o ? o.backLead : 400;
  const starts = {u:[], b:[]}, stage = o?.stage;
  const cue = callback => { if (stage) stage.cues.push(callback); else callback(); };
  let n = 0, end = 0;
  for (const el of els){
    if (!el || !el.isConnected) continue;
    const k = (el.closest('.msec') || {}).dataset?.k === 'b' ? 'b' : 'u', deck = deckEl(k) || deckEl('u') || deckEl('b'); if (!deck) continue;
    const backs = backsOf(el).reverse();
    for (const b of backs){
      b.style.opacity = '';
      const bd = base + n++ * gap;
      if (dealFly(b, deck, bd, backDur, {plain:true, fx:F, geometry:o?.geometry?.get(b), stage})){
        starts[k].push(bd + 60);
        cue(() => { try{ sfx.flick(bd / 1000 + 0.05); sfx.drop(dealLandAt(bd + backDur * F.plainLand, F), .4); }catch(e){} });
      }
      end = Math.max(end, bd + backDur * .65);
    }
    el.style.opacity = '';
    const delay = base + n++ * gap + (backs.length ? lead : 0);
    if (dealFly(el, deck, delay, dur, {fx:F, geometry:o?.geometry?.get(el), stage})){
      starts[k].push(delay + (desk ? dur * F.leaveAt : 60));
      cue(() => { try{ sfx.flick(delay / 1000 + 0.05); sfx.drop(dealLandAt(delay + dur * F.land, F), .55); sfx.flick(dealLandAt(delay + dur * F.flipMid, F), 1.3); }catch(e){} });
      end = Math.max(end, delay + dur);
      el.dataset.dealt = '1';
      if (el.dataset.ck && !el.classList.contains('osarriving')) cue(() => MOT.busy.set(el.dataset.ck, performance.now() + delay + dur));
    } else if (desk) {
      el.inert = false;
      el.classList.remove('osarriving');
    }
  }
  cue(() => {
    ui.dealUntil = Math.max(ui.dealUntil || 0, performance.now() + end);
    for (const k of ['u','b']) deckCountdown(deckEl(k), starts[k]);
  });
  return end;
}
// the cards in play that the screen follows, from the rules' own state: key -> where it is (a display row or a frozen row)
function cardsInPlay(){
  const m = new Map();
  for (const k of ['u','b']) for (const c of (G.disp[k] || [])) if (c && c.id != null) m.set('c' + c.id, k);
  (G.frozen || []).forEach((L, w) => (L || []).forEach(c => { if (c && c.id != null) m.set('c' + c.id, 'fz' + w); }));
  return m;
}
const MOT = {g:null, state:null, wait:new Set(), busy:new Map(), bought:new Set(), fly:[], afterOpp:false};
// after every redraw (see the CARD MOTION notes): this screen's buys fly, then whatever else changed in the display plays
function syncShop(dealNow){
  if (!G){ MOT.g = null; return; }
  if (MOT.g !== G){ MOT.g = G; MOT.state = null; MOT.wait.clear(); MOT.busy.clear(); MOT.bought.clear(); MOT.fly = []; }
  const now = cardsInPlay(), prev = MOT.state; MOT.state = now;
  const motion = !ui.battle && !reduceMotion(), fly = MOT.fly.splice(0);
  if (motion) fly.forEach((f, j) => buyFlight(f.i, f.ev, f.src, j));
  if (dealNow){ ui.dealt = G.round; dealMarket(); }
  else if (prev && motion && G.phase === 'shop'){
    const fresh = [], moved = [], gone = [];
    for (const [ck, w] of now){ const p = prev.get(ck); if (p == null) fresh.push(ck); else if (p !== w) moved.push(ck); }
    for (const ck of prev.keys()) if (!now.has(ck) && !MOT.bought.has(ck)) gone.push(ck);
    if (fresh.length || moved.length || gone.length){
      const from = new Map([...moved, ...gone].map(ck => [ck, SPOTS.get(ck)]));
      if (MOT.afterOpp && oppBusy()){
        // an opponent's move is playing out: what it brought stays out of sight until its turn in the queue
        for (const ck of [...fresh, ...moved]) MOT.wait.add(ck);
        OPQ.steps.push(() => { for (const ck of [...fresh, ...moved]) MOT.wait.delete(ck); return shopChanges(fresh, moved, gone, from, 60); });
      } else shopChanges(fresh, moved, gone, from, fly.length ? 260 : 120);   // after your buy lifts away
    }
  }
  MOT.bought.clear(); MOT.afterOpp = false;
  rehide();
  snapNow();
}
// play a set of display changes; resolves when the last card has landed
function shopChanges(fresh, moved, gone, from, base){
  let end = 0;
  const pile = pileEl();
  gone.forEach((ck, j) => { const f = from.get(ck); if (f && pile) end = Math.max(end, flyTo(f, pile, {delay:j * 200, dur:1000, intoBtn:true})); });
  moved.forEach((ck, j) => { const f = from.get(ck), el = ckEl(ck); if (el?.classList.contains('osarriving')){ el.inert = false; el.classList.remove('osarriving'); }
    if (f && el){ for (const e of [el, ...backsOf(el)]) e.style.opacity = ''; end = Math.max(end, flyTo(f, el, {delay:j * 200, dur:900})); } });
  end = Math.max(end, dealIn(fresh.map(ckEl).filter(Boolean), base + (gone.length ? 200 : 0)));
  return new Promise(res => setTimeout(res, end));
}
// a redraw makes new elements: ones still waiting for their deal stay hidden, and ones mid-deal stay hidden until it lands
function rehide(){
  const t = performance.now();
  for (const ck of MOT.wait){
    const el = ckEl(ck); if (!el) continue;
    if (el.closest('#view-play .osdesk .osmkt')) matMarkDeal(el);
    else el.style.opacity = '0';
    for (const e of backsOf(el)) e.style.opacity = '0';
  }
  for (const [ck, until] of MOT.busy){
    const left = until - t; if (left <= 0){ MOT.busy.delete(ck); continue; }
    const el = ckEl(ck); if (!el || el.dataset.dealt || (el.getAnimations && el.getAnimations().some(a => a.playState === 'running'))) continue;
    for (const e of [el, ...backsOf(el)]) e.animate([{opacity:0}, {opacity:0}], {duration:left});
  }
}
/* Black Market and Vision: the peeked cards come off the top of the deck they were taken from */
const peekSeen = new Set();
function dealPeeks(skip){
  for (const row of $('view-play').querySelectorAll('.peekrow[data-key]')){
    const key = row.dataset.key; if (peekSeen.has(key)) continue; peekSeen.add(key);
    if (skip || reduceMotion()) continue;
    const deck = $('view-play').querySelector(`.sdeck[data-k="${row.dataset.from}"] .dealdeck`); if (!deck) continue;
    const cards = [...row.querySelectorAll('.mcard')];
    const go = () => {
      if (!row.isConnected) return;
      let n = 0; const st = [];
      for (const el of cards){ const delay = 60 + n * 180; if (dealFly(el, deck, delay, 1100)){ n++; st.push(delay + 60); try{ sfx.flick(delay / 1000 + 0.05); sfx.drop(dealLandAt(delay + 1100 * DEAL_FX.land), .55); sfx.flick(dealLandAt(delay + 1100 * DEAL_FX.flipMid), 1.3); }catch(e){} } }
      deckCountdown(deck, st);
    };
    // in the peek window: wait until it has finished rising, so each card lands where it really sits
    const sh = row.closest('.pksheet'), rising = sh ? sh.getAnimations() : [];
    if (rising.length){ cards.forEach(el => el.style.opacity = '0'); Promise.all(rising.map(x => x.finished.catch(() => {}))).then(() => { cards.forEach(el => el.style.opacity = ''); go(); }); }
    else go();
  }
}
// Lock in the deck being built at this screen (after a reminder about unused tokens, if any). Online it goes to the
// room; pass-and-play hands the device to the second player, then fights; against the AI, the AI plans and fights.
function lockDeck(){
  if (ui.planning) return;
  const d = draftFromDeck(ui.draft);
  const err = validateDeck(G, seat(), d);
  if (err){ ui.err = err; sfx.err(); renderPlay(); return; }
  if (!G.raid && !ui.remindOk && !(G.noRemind && G.noRemind.lock)){
    const left = mobilizeLeftovers();
    if (left){ ui.remind = {kind:'lock', items:left}; sfx.soft(); renderPlay(); return; }
  }
  ui.remindOk = false;
  // the miracles you played are the ones spent (online both screens work it out the same way, so it's left to the rules there)
  if (!G.net){ const me = G.players[seat()]; me.mirPlay = mobReady(me).map(j => me.mir[j]); }
  if (G.net){ sfx.lock(); ui.err = ''; ui.lastDraft = d; ui.lastDrafts[seat()] = d; netDo(['d', d.map(u => u.gear ? [netIx(u.name), u.arm || 0, u.tr || 0, u.sh || 0, netIx(u.gear)] : [netIx(u.name), u.arm || 0, u.tr || 0, u.sh || 0])]); return; }
  if (G.raid){
    const S = seat(), orders = ui.raidOrders || (ui.raidOrders = [{}, {}]);
    orders[S][raidRole(G, S)] = d.map(u => u.name);
    if (!PP()){
      sfx.lock(); ui.err = '';
      showBattle(playBattle(d, raidAiMobilize(G, 1)));
      ui.bannerOff = false;
      renderPlay(); toGame(); startAuto(); return;
    }
  }
  if (PP()){
    const S = seat(); ui.drafts[S] = d; ui.lastDrafts[S] = d; sfx.lock(); ui.err = '';
    if (S === 0){ ui.mobSeat = 1; ui.draft = null; ui.handoff = 1; renderPlay(); toGame(); return; }
    showBattle(playBattle(ui.drafts[0], ui.drafts[1])); if (G.raid) ui.bannerOff = false; ui.drafts = [null, null]; ui.mobSeat = 0; ui.handoff = null;
    renderPlay(); toGame(); startAuto(); return;
  }
  sfx.lock();
  ui.err = ''; ui.lastDraft = d; ui.planning = true;
  const gathering = matBatPrepare();
  if (!gathering && !(AIMOB && AIMOB.g === G && AIMOB.round === G.round && AIMOB.r !== undefined)) renderPlay();
  const g0 = G;
  setTimeout(async () => {
    if (G !== g0 || G.over) return;
    // the AI plans from public information only; your locked deck is not visible to it
    let aiDeck = null;
    // Draw the destination while the bench gathers so the units can fly straight to the Battle slot.
    const r = await aiMobResult();
    if (G !== g0 || G.over) return;
    if (r && !r.error && r.deck){ aiDeck = r.deck; if (r.omPending) G.omPending = r.omPending; if (r.mobWhy){ G._mobWhy = r.mobWhy; G._mobLevel = r.mobLevel; } }
    else aiDeck = aiMobilize(G, 1, 60, AI_DEPTH()) || [];
    showBattle(playBattle(d, aiDeck)); ui.planning = false;
    recBattle(G);
    noteOm();
    if (G.over) recordResult();
    renderPlay(); startAuto();
  }, 30);
}
// both armies are set: fight the battle (returns the replay), and show a replay from its first step
function playBattle(d0, d1){ ui.pre = boardSnap(); setDeck(G, 0, d0); setDeck(G, 1, d1); finishMobilize(G); return doBattle(G, true); }
// steps where nothing happens (no ability, no damage, nobody moves or changes) are folded into the next step, so the
// battle never pauses on an empty step; their log lines still show, with the step they lead into
function quietFrame(prev, f){
  if ((f.hits || []).length || f.lines.some(l => l.ab)) return false;
  const u = x => x && [x.uid, x.dmg, x.pow, x.arm, x.sh, x.tr, x.gear || '', x.cp, (x.sp || []).length, x.sw || 0].join(':');
  const lite = fr => JSON.stringify(fr.snap.map(sd => [u(sd.charge), sd.deck.map(u), sd.grave.map(x => x.uid), (sd.tail || []).length]));
  return lite(prev) === lite(f);
}
function compactFrames(frames){
  const out = []; let carry = [];
  frames.forEach((f, i) => {
    if (i > 0 && i < frames.length - 1 && quietFrame(frames[i - 1], f)){ carry = carry.concat(f.lines); return; }
    out.push(carry.length ? {...f, lines:carry.concat(f.lines)} : f); carry = [];
  });
  return out;
}
function showBattle(res){ if (res && res.frames && !res.compact){ res.frames = compactFrames(res.frames); res.compact = true; } ui.battle = res; if (typeof labBattleRoom === 'function') labBattleRoom(); ui.frame = 0; ui.draft = null; ui.revealed = false; }
// is this unit (or a Recruit) still waiting on the bench?
// battle miracles in hand that aren't in the deck yet (one entry per copy)
function batBench(me, d){
  const left = {};
  for (const n of me.mir || []) if (isBat(n)) left[n] = (left[n] || 0) + 1;
  for (const u of d || []) if (isBat(u.name) && left[u.name]) left[u.name]--;
  return Object.entries(left).flatMap(([n, c]) => Array(c).fill(n));
}
// a battle miracle drawn as a card: its name, then what it does when it surfaces
function spellFace(n){ return `<div class="top"><span class="nm">${esc(n)}</span><span class="cost">✶</span></div><span class="curve spcurve">Battle miracle</span><span class="tx">${esc(batFx(n))}</span><span class="stx">${esc(MIRS[n].sh.replace(/^battle: /, '').replace(/^./, c => c.toUpperCase()))}</span>`; }
document.addEventListener('dragstart', e => {
  if (e.target instanceof HTMLImageElement && e.target.closest('body.ingame :is(#view-play,.peekwrap,.turnflash,.labsheet)')) e.preventDefault();
});
$('view-play').addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const act = t.dataset.act, i = +t.dataset.i, d = ui.draft;
  switch (act){
    case 'deck-open': { if (matOpenShopPile(t)) return; const k = +t.dataset.p; ui.pkWin = null; ui.pkPending = false; ui.mason = null; ui.deckView = ui.deckView === k && !t.closest('.dstabs') ? null : k; sfx.soft(); renderPlay(); const sh = $('view-play').querySelector('.dsheet [aria-selected="true"]'); if (sh) sh.focus({preventScroll:true}); return; }
    case 'deck-close': popShut(); sfx.soft(); renderPlay(); return;
    case 'resign-confirm': resignMatch(+t.dataset.p); return;
    case 'roll': doRoll(); return;
    case 'roll-go': if (!ui.roll || ui.roll.first == null) return; sfx.soft(); ui.roll = null; ui.mktTab = 'u'; shopCoinStart(G); renderPlay(); scheduleAI(); return;
    case 'raid-pile': if (G?.raid) matOpenShopPile(t); return;
    case 'raid-transfer': raidTransferUI(t.dataset.name, t.dataset.role); return;
    case 'raid-siege': playerMove(['raid-siege']); return;
    case 'raid-buy': {
      const pick = ui.raidBuy;
      if (!pick || pick.seat !== seat() || sourceCard(G, seat(), pick.a[1], pick.a[2])?.name !== pick.name) return;
      popShut();
      const [action, src, idx, attach, writ] = pick.a;
      playerMove([action, src, idx, attach, writ, t.dataset.role]);
      return;
    }
    case 'mkt-tab': ui.mktTab = t.dataset.k === 'b' ? 'b' : 'u'; sfx.soft(); renderPlay(); markMore(); return;
    case 'mason-cancel': sfx.soft(); popShut(); renderPlay(); return;
    case 'mason-tog': { const mm = masonMode(); if (!mm) return; const n = t.dataset.name;
      if (ui.pkWin === 'mason'){ popShut(); sfx.pick(); playerMove(['b', mm.src, mm.idx, n]); return; }   // the pop-up: one tap buys and attaches
      if (!masonTargets(G.players[seat()]).includes(n)) return;
      ui.mason.sel = mm.sel === n ? null : n; sfx.soft(); renderPlay(); return; }
    case 'mason-go': { const mm = masonMode(); if (!mm || !mm.sel) return; ui.mason = null; playerMove(['b', mm.src, mm.idx, mm.sel]); return; }
    case 'writ-cancel': sfx.soft(); ui.writ = null; renderPlay(); return;
    case 'altar-pick': sfx.soft(); playerMove(['a', t.dataset.name]); return;
    case 'frz-cancel': sfx.soft(); ui.freeze = null; renderPlay(); return;
    case 'frz-pick': { if (!freezeMode()) return; ui.freeze = null; playerMove(['i', t.dataset.src, +t.dataset.idx]); return; }
    case 'writ-tog': { const wm = writMode(); if (!wm) return; const j = t.dataset.j, k = ui.writ.sel.indexOf(j);
      if (k >= 0) ui.writ.sel.splice(k, 1); else if (ui.writ.sel.length < wm.n) ui.writ.sel.push(j); else return;
      sfx.soft(); renderPlay(); return; }
    case 'writ-go': { if (!ui.writ) return; const w = ui.writ; ui.writ = null; const names = w.sel.map(j => { const c = G.disp[j[0] === 'b' ? 'b' : 'u'][+j.slice(1)]; return c && c.name; }).filter(Boolean);
      playerMove(['b', w.src, w.idx, null, names]); return; }
    case 'mason-to':
    case 'buy': {
      const src = t.dataset.src, idx = t.dataset.idx === '' ? 0 : +t.dataset.idx;
      const nm0 = (sourceCard(G, seat(), src, idx) || {}).name;
      if (act === 'buy' && nm0 === "Mason's Guild"){   // pick what it levels up first; Buy on the marked card confirms once one is picked
        const mm = masonMode(); if (mm && mm.src === src && mm.idx === idx){ if (mm.sel){ ui.mason = null; playerMove(['b', src, idx, mm.sel]); } return; }
        sfx.pick(); ui.writ = null; ui.freeze = null; ui.deckView = null; ui.mason = {src, idx, sel:null}; ui.pkWin = 'mason'; renderPlay(); return; }
      if (act === 'buy') ui.freeze = null;
      if (act === 'buy' && ui.writ && ui.writ.src === src && ui.writ.idx === idx){ const w = ui.writ; ui.writ = null; const names = w.sel.map(j => { const c = G.disp[j[0] === 'b' ? 'b' : 'u'][+j.slice(1)]; return c && c.name; }).filter(Boolean); playerMove(['b', w.src, w.idx, null, names]); return; }
      if (act === 'buy' && mirOf(G, {src, idx}).some(m => MIRS[m].writ)){ sfx.pick(); ui.writ = {src, idx, sel:[]}; renderPlay(); return; }   // pick what Discard Writ moves
      ui.mason = null;
      playerMove(['b', src, idx, act === 'mason-to' ? t.dataset.name : null]); return;
    }
    case 'pass': {
      const left = G.noRemind && G.noRemind.pass ? null : netClone(shopLeftovers);
      if (left){ ui.remind = {kind:'pass', items:left}; sfx.soft(); renderPlay(); return; }
      playerMove(['p']); return;
    }
    case 'remind-back': case 'remind-go': {
      const r = ui.remind; ui.remind = null; if (!r) return;
      const off = $('remind-off'); if (off && off.checked){ G.noRemind = G.noRemind || {}; G.noRemind[r.kind] = true; }
      if (act === 'remind-back'){ sfx.soft(); renderPlay(); return; }
      if (r.kind === 'pass'){ playerMove(['p']); return; }
      ui.remindOk = true; lockDeck(); return;
    }
    case 'muster': matOpenShopPile(t); return;
    case 'bm-u': case 'bm-b': { const k = act === 'bm-b' ? 'b' : 'u'; ui.pkWin = 'peek'; ui.pkFocus = k; ui.pkPending = true; playerMove(['m', k]); return; }
    case 'mir-vis-u': case 'mir-vis-b': playerMove(['v', act === 'mir-vis-u' ? 'u' : 'b']); return;
    case 'mir-fav': playerMove(['f']); return;
    case 'mir-tray': ui.mirTray = !ui.mirTray; ui.mirModal = null; if (ui.mirTray){ ui.pkWin = null; ui.pkPending = false; } sfx.soft(); renderPlay(); return;
    case 'mirm-open': ui.mirModal = {j:+t.dataset.j, w:t.dataset.w}; ui.mirErr = ''; sfx.soft(); renderPlay(); return;
    case 'mirm-close': if (t.classList.contains('mirmodal') && e.target.closest('.mirmbox')) return; ui.mirModal = null; ui.mirErr = ''; renderPlay(); return;
    case 'mirm-vis': ui.mirModal = null; ui.mirTray = false; ui.visArm = true; ui.pkWin = null; sfx.soft(); renderPlay(); return;
    case 'vis-cancel': ui.visArm = false; sfx.soft(); renderPlay(); return;
    case 'vis-u': case 'vis-b': { const k = act === 'vis-b' ? 'b' : 'u'; ui.visArm = false; ui.pkWin = 'peek'; ui.pkFocus = k; ui.pkPending = true; playerMove(['v', k]); return; }
    case 'pk-open': ui.deckView = null; ui.mason = null; ui.pkWin = 'peek'; ui.pkFocus = t.dataset.k; ui.pkPending = false; sfx.pick(); renderPlay(); return;
    case 'bc-load': sfx.soft(); bcodeLoad(ui.codeText); return;
    case 'pk-close': {
      if (t.classList.contains('pkwin') && e.target.closest('.pksheet')) return;
      const resign = ui.resignWin;
      popShut(); sfx.soft(); renderPlay();
      if (resign) $('gtop')?.querySelector('[data-gmenu]')?.focus({preventScroll:true});
      return;
    }
    case 'mirm-use': { mirUse(); return; }
    case 'mir-peek': { const k = t.dataset.k; mirTurn(t.closest('.mcard'), k, () => { ui.mirOpen = ui.mirOpen === k ? null : k; }); return; }
    case 'sell-u': case 'sell-b': {
      const kind = act === 'sell-u' ? 'u' : 'b', name = t.dataset.name, src = t.closest('.fcard, .mcard'), S = seat();
      const inPop = !!(src && src.closest('.pkwin')) && !reduceMotion();
      if (!inPop){ const n0 = G.log.length; playerMove(['s', kind, name]); if (G.net || G.log.length > n0) flySell(S, name, kind, src); return; }
      // sold from the pop-up: the card lifts out of its spot, the pop-up closes under it, then it flies into the discard pile
      const r = src.getBoundingClientRect(), g = src.cloneNode(true);
      g.querySelectorAll('button, .stamps, .dealback, .ctag, .hgtok').forEach(x => x.remove());
      flyEl(g, r, r.width, r.height, LAYER.popupFlight, src.parentElement);
      g.style.overflow = 'visible'; src.style.visibility = 'hidden';
      const up = {left:r.left, top:r.top - 16, width:r.width * 1.05, height:r.height * 1.05, w0:r.width, h0:r.height};   // where it hangs once lifted (scaled from its top left)
      g.animate([{transform:'none', filter:'drop-shadow(0 0 0 rgba(0,0,0,0))'}, {transform:'translateY(-16px) scale(1.05)', filter:'drop-shadow(0 16px 18px rgba(0,0,0,.32))'}],
        {duration:220, easing:'cubic-bezier(.2,.8,.3,1)', fill:'forwards'});
      sfx.pick();
      setTimeout(() => {
        ui.deckView = null; renderPlay();                        // the pop-up sinks away; the lifted card stays up
        setTimeout(() => { const n0 = G.log.length; playerMove(['s', kind, name]);
          if (G.net || G.log.length > n0) flySell(S, name, kind, null, {g, r:up}); else g.remove(); }, UNPOP_MS + 20);
      }, 240);
      return;
    }
    case 'pp-ready': ui.handoff = null; ui.draft = ui.drafts[ui.mobSeat] || defaultDraft(); sfx.soft(); renderPlay(); toGame(); return;
    case 'd-up': [d[i-1], d[i]] = [d[i], d[i-1]]; sfx.tick(); break;
    case 'd-down': [d[i+1], d[i]] = [d[i], d[i+1]]; sfx.tick(); break;
    case 'b-speed': { sfx.soft(); LS.set('sow-autofast', !autoFast()); const b = t; b.textContent = speedLabel(); b.setAttribute('aria-pressed', autoFast() ? 'true' : 'false'); if (autoOn() && autoT){ startAuto(200); } return; }
    case 'suggest': mzSuggestDeck(); return;
    case 'lock': if (mzActive()) lockDeck(); return;
    case 'b-auto': { sfx.soft(); const on = !autoOn(); LS.set('sow-autoplay', on); if (on) startAuto(300); else stopAuto(); syncAutoBtn(); mountAbWin(); return; }
    case 'b-abwin': { sfx.soft(); LS.set('sow-abwin', !abOn()); t.setAttribute('aria-pressed', abOn() ? 'true' : 'false'); mountAbWin(); return; }
    case 'b-first': sfx.soft(); stopAuto(true); goFrame(0); return;
    case 'b-replay': sfx.soft(); stopAuto(true); goFrame(0); return;
    case 'b-prev': sfx.soft(); stopAuto(true); goFrame(Math.max(0, ui.frame - 1)); return;
    case 'b-next': if (performance.now() - nextDownAt < 1000) return; stepForward(); return;   // a press already stepped (see pointerdown below); this is for the keyboard
    case 'b-last': sfx.soft(); goFrame(ui.battle.frames.length - 1); return;
    case 'fr': sfx.soft(); goFrame(+t.dataset.k); return;
    case 'banner-off': sfx.soft(); ui.bannerOff = true; renderPlay(); return;
    case 'continue': if (G.replay){ sfx.soft(); replayEnd(); return; }
      if (G.raid && !G.net){ raidContinue(); return; }
      if (typeof bazaarCaptureBattle === 'function') bazaarCaptureBattle();
      if (G.net){ sfx.soft(); stopAuto(); stopAnim(); ui.battle = null; ui.mktTab = 'u'; netPump(); netAfter(); toGame(); return; }
      sfx.soft(); stopAuto(); stopAnim(); ui.battle = null; ui.mktTab = 'u'; shopCoinStart(G); renderPlay();
      if (!bazaarBattleReturn?.shop) scheduleAI();
      return;
    case 'rec-copy': { sfx.soft(); const id = t.dataset.id; copyMatch(id ? (LS.get(MATCH_KEY) || []).find(r => String(r.id) === id) : G && G.rec); return; }
    case 'newgame': sfx.soft(); startMode = G && G.over ? (G.net ? 'net' : PP() ? 'pp' : 'ai') : null; ui.start = true; ui.resignArm = false; renderPlay(); window.scrollTo({top:0}); return;
    case 'su-chip': ui.suOpen = !ui.suOpen; renderPlay(); return;
    default: return;
  }
  ui.err = ''; renderPlay();
});

/* Every redraw of the Play tab, step by step. (Until v58 these steps were wrappers stacked on renderPlay from four
   files; the order is unchanged.) Steps from js/mobile-crop.js and js/board-settings.js are skipped until their file
   has loaded, as the wrappers were: a redraw can happen while the page is still starting. Add a step here, in
   order, instead of wrapping renderPlay. */
function renderPlay(){
  if (ui.raidClearing) return;
  const draftReady = typeof mzPrepareDraft !== 'function' || mzPrepareDraft();
  if (typeof bazaarShopGate === 'function' && bazaarShopGate()) return;
  if (typeof matMobGate === 'function' && matMobGate()) return;      // one-screen dev: the sweep into Mobilize plays first
  if (!draftReady) return;                                          // lift the actual deck once its opening search finishes
  if (typeof matBatGate === 'function' && matBatGate()) return;      // one-screen dev: Mobilize gathers into the battle first
  const notes = typeof playNotesBefore === 'function' ? playNotesBefore() : null;   // ability notes, measured before the stage is replaced
  const art = typeof playArtBefore === 'function' ? playArtBefore() : null;         // the card pictures already on screen
  let r;
  try{ r = drawPlay.apply(this, arguments); }
  catch(err){ console.error('renderPlay', err); const v = document.getElementById('view-play'); if (v) v.innerHTML = errBoxHTML('the Play tab', err); }   // show the error, with a way to copy it to Claude
  // the page's classes first (body.lab-inbattle, os-mat...): the battle's rows are measured with them in place
  if (typeof labAfterDraw === 'function') labAfterDraw();            // Board settings: body.lab-inbattle
  if (typeof rugAfterDraw === 'function') rugAfterDraw();            // one-screen dev: the lit rug under the battle
  if (r !== 'purchase' && typeof matBarsAfterDraw === 'function') matBarsAfterDraw();    // full draws fit the tabletop
  if (typeof r === 'boolean' || r === 'purchase'){ syncShop(r === true); dealPeeks(r === true); }
  if (ui.battle) reserveRows();                     // every redraw of the battle keeps the reserved row heights
  if (art) playArtAfter(art);                       // put the decoded pictures back (no blink)
  if (typeof playNotesAfter === 'function') playNotesAfter(notes);   // damage cubes follow the board; old notes fade out
  if (typeof matLandAfterDraw === 'function') matLandAfterDraw();    // one-screen dev: spots cards are landing on stay hidden
  if (typeof matMobAfterDraw === 'function') matMobAfterDraw();      // one-screen dev: the deck lifts off the mat into Mobilize
  if (typeof matBatAfterDraw === 'function') matBatAfterDraw();      // one-screen dev: the battle board lands (zoom, deck slam)
  if (typeof aiMobStart === 'function') aiMobStart();                // against the AI: it sets its Mobilize deck while you set yours
  if (typeof shopCoinRequestWarm === 'function') shopCoinRequestWarm();
  return r;
}
