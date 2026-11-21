/* ===================== MIRACLES IN HAND: the shop tab and the Mobilize panel =====================
   Shop: a tab in the bottom corner opens your hand; miracles you can play right now glow. Mobilize: a panel below
   the bench. Tapping a miracle opens it large with a button to play it. */
// can miracle j of my hand be played now? {ok, label, why, on} (on: it's already in play and the button takes it back)
function mirPlayable(j, where){
  const S = seat(), me = G.players[S], n = (me.mir || [])[j], m = n && MIRS[n]; if (!m) return {ok:false, why:''};
  const myTurn = G.phase === 'shop' && cur(G) === S && !G.passed[S];
  if (m.bat) return {ok:false, why:!G.battleMir ? 'Battle miracles are not in this game.' : where === 'mob'
    ? 'It waits on your bench: put it anywhere in your deck. It leaves your hand only if you lock in with it placed.'
    : 'Place it in your deck at a Mobilize. It resolves when it reaches the top of your deck.'};
  if (m.rec || m.arm || m.tr){
    if (where !== 'mob') return {ok:false, why:'Play it at Mobilize: its tokens go on your bench.'};
    const on = mobReady(me).includes(j);
    const what = m.rec ? `${m.rec} Recruit${m.rec > 1 ? 's' : ''}` : m.arm ? `${m.arm} Armament${m.arm > 1 ? 's' : ''}` : `${m.tr} Training token${m.tr > 1 ? 's' : ''}`;
    return on ? {ok:true, on:true, label:'Take it back', why:`In play: ${what} on your bench. It's discarded once you lock in with them placed.`}
              : {ok:true, label:`Play: ${what} to your bench`};
  }
  if (where === 'mob') return {ok:false, why:'Play it on a shop turn.'};
  if (!myTurn) return {ok:false, why:G.passed[S] ? 'You passed this shop.' : 'Wait for your turn.'};
  if (m.fav) return {ok:true, label:`Play: ${m.fav > 1 ? m.fav + ' extra buys' : 'an extra buy'}`};
  if (m.rdl) return {ok:true, label:'Play: clear the display and deal a new one', why:'It does not use your turn.'};
  if (m.frz){
    if (!G.disp.u.length && !G.disp.b.length) return {ok:false, why:'There is no display card to set aside.'};
    return {ok:true, label:'Play: pick a card to set aside', why:'This uses your turn.'};
  }
  if (m.vis){
    if (peekOf(G, S, 'vis')) return {ok:false, why:'You are already looking with a Vision.'};
    return {ok:true, vis:true, label:'Look at'};
  }
  if (m.disc){
    if (me.discArm) return n === mirDisc(me) && me.mir.indexOf(n) === j ? {ok:true, on:true, label:'Take it back', why:`In play: your next buy costs $${m.disc} less.`} : {ok:false, why:'Another Patronage is already in play.'};
    return {ok:true, label:`Play: next buy $${m.disc} less`};
  }
  return {ok:false, why:'This one is used the moment you get it.'};
}
// miracles that play themselves on the spot (money, Discard Writ) never reach the hand; everything else here waits to be played
function mirCardHTML(n, j, where, big){
  const pl = mirPlayable(j, where), m = MIRS[n];
  return `<button type="button" class="mircard${pl.ok && !pl.on ? ' glow' : ''}${pl.on ? ' live' : ''}${big ? ' big' : ''}" ${big ? '' : `data-act="mirm-open" data-j="${j}" data-w="${where}"`} aria-label="${esc(n)}${pl.on ? ' (in play)' : pl.ok ? ' (can be played now)' : ''}">
    <span class="mtop"><b>${esc(n)}</b>${pl.on ? '<span class="mirlive">in play</span>' : ''}</span>
    ${big ? '' : '<span class="mseal" aria-hidden="true"><span>✶</span></span>'}
    <span class="mtx">${esc(big ? mirBody(n) : m.sh.replace(/^hand: /, ''))}</span></button>`;
}
function mirTrayHTML(){
  if (!G.miracles) return '';
  const me = G.players[seat()], mir = me.mir || [];
  const live = mir.some((_, j) => { const p = mirPlayable(j, 'shop'); return p.ok && !p.on; });
  const open = !!ui.mirTray;
  return `<div class="mirdock${open ? ' open' : ''}">
    ${open ? `<div class="mirtray panel" role="dialog" aria-label="Miracles in hand"><div class="row"><h3>✶ Miracles in hand</h3><span class="grow"></span><button type="button" class="small" data-act="mir-tray">Close</button></div>
      ${mir.length ? `<div class="mirgrid">${mir.map((n, j) => mirCardHTML(n, j, 'shop')).join('')}</div><p class="note">Glowing miracles can be played now. Tap one to read it and play it.</p>` : '<p class="note">No miracles in hand. Buy a card with miracles under it to get them.</p>'}</div>` : ''}
    <button type="button" class="mirtab${live ? ' glow' : ''}" data-act="mir-tray" aria-expanded="${open}"><span class="ms" aria-hidden="true">✶</span> Miracles${mir.length ? ` <span class="mc">${mir.length}</span>` : ''}</button>
  </div>`;
}
function mirModalHTML(){
  const mm = ui.mirModal; if (!mm) return '';
  const me = G.players[seat()], n = (me.mir || [])[mm.j];
  if (!n){ ui.mirModal = null; return ''; }
  const pl = mirPlayable(mm.j, mm.w);
  let btn;
  if (pl.vis) btn = `<button type="button" class="primary" data-act="mirm-vis">Play: then tap a deck</button>`;
  else if (pl.ok) btn = `<button type="button" class="${pl.on ? '' : 'primary'}" data-act="mirm-use">${esc(pl.label)}</button>`;
  else btn = '';
  return `<div class="mirmodal" data-act="mirm-close"><div class="mirmbox" role="dialog" aria-modal="true" aria-label="${esc(n)}">
    ${mirCardHTML(n, mm.j, mm.w, true)}
    ${pl.why ? `<p class="note">${esc(pl.why)}</p>` : ''}
    ${ui.mirErr ? `<p class="err">${esc(ui.mirErr)}</p>` : ''}
    <div class="row">${btn}<span class="grow"></span><button type="button" data-act="mirm-close">Close</button></div>
  </div></div>`;
}
// Mobilize: the hand miracles you've played this Mobilize (indexes into your hand). A deck that needs more Recruits or
// tokens than your own (a suggested deck, say) plays the miracles that cover them.
function mobReady(me){
  const key = `${G.round}-${seat()}-${(me.mir || []).join('|')}`;
  if (!ui.mirRdy || ui.mirRdy.key !== key) ui.mirRdy = {key, idx:[]};
  const d = ui.draft || [], need = mirSpend(me, 'rec', d.filter(u => u.name === 'Recruit').length - recBase(me))
    .concat(mirSpend(me, 'arm', d.reduce((s, u) => s + (u.arm || 0), 0) - bVal(me, 'Smithy')), mirSpend(me, 'tr', d.reduce((s, u) => s + (u.tr || 0), 0) - bVal(me, 'Study')));
  const rdy = ui.mirRdy.idx, have = k => rdy.reduce((s, j) => s + (MIRS[me.mir[j]][k] || 0), 0);
  for (const j of need){
    const k = ['rec','arm','tr'].find(x => MIRS[me.mir[j]][x]);
    const used = k === 'rec' ? d.filter(u => u.name === 'Recruit').length - recBase(me) : d.reduce((s, u) => s + (u[k] || 0), 0) - bVal(me, k === 'arm' ? 'Smithy' : 'Study');
    if (have(k) < used && !rdy.includes(j)) rdy.push(j);
  }
  return rdy;
}
const mobHeld = (me, k) => mobReady(me).reduce((s, j) => s + (MIRS[me.mir[j]][k] || 0), 0);
const recUI = me => recBase(me) + mobHeld(me, 'rec');
const armUI = me => bVal(me, 'Smithy') + mobHeld(me, 'arm');
const trUI = me => bVal(me, 'Study') + mobHeld(me, 'tr');
// the big miracle popup's play button
function mirUse(){
  const mm = ui.mirModal; if (!mm) return;
  const S = seat(), me = G.players[S], n = (me.mir || [])[mm.j], pl = mirPlayable(mm.j, mm.w);
  if (!n || !pl.ok){ sfx.err(); return; }
  const m = MIRS[n];
  if (m.rec || m.arm || m.tr){
    const rdy = mobReady(me), d = ui.draft || [];
    if (pl.on){
      const k = m.rec ? 'rec' : m.arm ? 'arm' : 'tr';
      const used = k === 'rec' ? d.filter(u => u.name === 'Recruit').length : d.reduce((s, u) => s + (u[k] || 0), 0);
      const cap = (k === 'rec' ? recUI(me) : k === 'arm' ? armUI(me) : trUI(me)) - m[k];
      if (used > cap){ ui.mirErr = `Take ${k === 'rec' ? 'its Recruits' : k === 'arm' ? 'its Armaments' : 'its Training tokens'} out of your deck first.`; sfx.err(); renderPlay(); return; }
      rdy.splice(rdy.indexOf(mm.j), 1);
    } else rdy.push(mm.j);
    ui.mirModal = null; ui.mirErr = ''; sfx.rustle(); renderPlay(); return;
  }
  ui.mirModal = null;
  if (m.fav){ ui.mirTray = false; playerMove(['f']); return; }
  if (m.rdl){ ui.mirTray = false; playerMove(['r']); return; }
  if (m.frz){ ui.mirTray = false; ui.writ = null; ui.freeze = true; sfx.pick(); renderPlay(); return; }
  if (m.disc){ playerMove(['z', pl.on ? 0 : 1]); return; }
  renderPlay();
}
function mobMirHTML(me){
  if (!G.miracles) return '';
  const mir = me.mir || [];
  const list = mir.map((n, j) => [n, j]).filter(([n]) => MIRS[n].rec || MIRS[n].arm || MIRS[n].tr);
  const nbat = mir.filter(isBat).length, other = mir.length - list.length - nbat;
  return `<div class="panel mobmirp"><h2><span class="ms" aria-hidden="true">✶</span> Miracles</h2>
    ${list.length ? `<div class="mirgrid">${list.map(([n, j]) => mirCardHTML(n, j, 'mob')).join('')}</div><p class="note">Play a glowing miracle to put its Recruits or tokens on your bench. It's discarded only if you lock in with them placed.</p>`
                  : `<p class="note">No miracles to play at Mobilize.${other ? ` ${other === 1 ? 'Your other miracle is' : `Your other ${other} miracles are`} played in the shop.` : ''}</p>`}
    ${nbat ? `<p class="note">✶ Your battle ${nbat === 1 ? 'miracle waits' : 'miracles wait'} on the bench: put ${nbat === 1 ? 'it' : 'them'} anywhere in your deck.</p>` : ''}
  </div>`;
}
const aiFresh = () => new Set((G.shopBought && G.shopBought[1 - seat()]) || []);
function logHTML(){
  return `<div class="log">${G.log.slice(-16).reverse().map(l => `<span class="${VS(l.side)===0?'a':VS(l.side)===1?'b':''}">${esc(l.t)}</span>`).join('')}</div>`;
}
function budgetHTML(){
  const me = G.players[seat()];
  return `<div class="budget">
    <div class="purse"><span class="amt">$${me.money}</span><span class="nx">to spend now<br><b>+$${Math.max(0, income(me))}</b> next shop</span></div>
    ${slotsHTML(false)}</div>`;
}
function slotsHTML(short){
  const me = G.players[seat()], b = G.buys[seat()], carp = bVal(me, "Carpenter's Guild");
  const group = (label, n, used, cls) => `<span class="slotg">${label}<span class="pips" aria-hidden="true">${
    Array.from({length:n}, (_, k) => `<i class="pip${cls ? ' ' + cls : ''}${k < used ? ' used' : ''}"></i>`).join('')}</span><span class="sr">${n - used} of ${n} left</span></span>`;
  return `<div class="slots">
      ${group(short ? 'Buys' : 'Buys', buysOf(b), b.u + b.b)}
      ${carp ? group(short ? 'Guild' : "Carpenter's buys", carp, b.carp) : ''}
      ${group(short ? 'Field' : 'Field', fieldCap(me), Math.min(fieldCap(me), b.fld || 0))}
      ${group(short ? '<span class="gold">+$1</span>' : 'Extra buy +$1', 1, b.extra ? 1 : 0, 'x')}
      ${b.favN ? group(short ? 'Favor' : 'Divine Favor', b.favN, b.favN - b.fav, 'x') : ''}
    </div>`;
}
// a deck tile's buys left, on one line: buy squares and the gold extra-buy coin together, then Field (and the rare
// Carpenter's and Divine Favor pips). Side i's color.
function tileSlotsHTML(i){
  const me = G.players[i], b = G.buys[i], carp = bVal(me, "Carpenter's Guild");
  const pips = (n, used, cls) => Array.from({length:n}, (_, k) => `<i class="pip${cls ? ' ' + cls : ''}${k < used ? ' used' : ''}"></i>`).join('');
  const g = (label, inner) => `<span class="slotg">${label}<span class="pips">${inner}</span></span>`;
  const fc = fieldCap(me);
  return `<span class="tslots">${g('Buys', pips(buysOf(b), b.u + b.b) + `<span class="xsep"></span>` + pips(1, b.extra ? 1 : 0, 'x'))}${g('Field', pips(fc, Math.min(fc, b.fld || 0)))}${carp ? g('Guild', pips(carp, b.carp)) : ''}${b.favN ? g('Favor', pips(b.favN, b.favN - b.fav, 'x')) : ''}</span>`;
}
// The phone bar along the bottom of the screen, in every phase: which phase it is, what to do right now, and the
// button that moves the game on (Pass, Lock in, Next step, Continue). It stands out when it's waiting on you.
const VIS_ARM_TXT = '✶ Vision: tap the Units or Buildings deck to look at its top 3.';
function shopTurnText(){
  const S = seat(), O = 1 - S, myTurn = cur(G) === S;
  if (G.net) return G.passed[S] ? `You passed. ${esc(nm(O))} is finishing their shopping.` : myTurn ? 'Your turn: tap a card to see it and buy it, or pass.' : `${esc(nm(O))} is shopping…`;
  if (PP()) return `${esc(nm(S))}'s turn: tap a card to see it and buy it, or pass.${G.passed[O] ? ` ${esc(nm(O))} has passed.` : ''}`;
  return G.passed[0] ? 'You passed. The AI is finishing its shopping.' : myTurn ? 'Your turn: tap a card to see it and buy it, or pass.' : 'The AI is shopping…';
}
function mobHintText(){
  const s = ui.sel, d = ui.draft || [];
  if (ui.pick) return `Tap a unit in your deck to give it ${TOKA[ui.pick]}.`;
  if (s && s.zone === 'deck' && d[s.i]) return `Tap another deck card to swap it with <b>${esc(d[s.i].name)}</b>, or tap the bench to bench it.`;
  if (s && s.zone === 'bench') return `Tap a deck card to put <b>${esc(s.name)}</b> in its place, or tap the deck's empty space to add it at the end.`;
  return '';
}
// Phone layout: what you read (score, money, counts, what to do now) rides in a bar pinned at the top;
// what you tap (deck buttons, Miracles, the button that moves the game on) sits in the bar along the bottom.
// dockHTML fills DOCKINFO with the phase and hint, and pbarHTML draws the top bar from it.
let DOCKINFO = null;
function dockHTML(){
  DOCKINFO = null;
  if (!G || ui.start || ui.roll || ui.remind) return '';
  const S = seat();
  let phase = phaseLabel(), hint = '', body = '', acts = '', mine = false, infob = '', piles = '';
  if (ui.battle){
    const last = ui.battle.frames.length - 1, atEnd = ui.frame >= last;
    hint = atEnd ? esc(ui.battle.result.why) : `Step ${ui.frame + 1} of ${last + 1} · ${esc(ui.battle.frames[ui.frame].label)}`;
    mine = atEnd;
    acts = atEnd
      ? (G.over ? `<button type="button" class="primary act" data-act="newgame">${PP() ? 'New game…' : 'Choose next opponent'}</button>`
                : `<button type="button" class="primary act" data-act="continue">${G.net ? (NET && NET.needShop ? `Go to round ${G.round + 1} shop` : `Go to round ${G.round} shop`) : `Go to round ${G.round + 1} shop`}</button>`)
      : `<button type="button" class="act" data-act="b-prev" ${ui.frame === 0 ? 'disabled' : ''}>Back</button><button type="button" class="primary act" data-act="b-next">Next step</button>`;
  } else if (G.phase === 'shop'){
    const me = G.players[S], myTurn = cur(G) === S;
    const lbl = G.passed[S] ? 'Passed' : myTurn ? 'Pass' : G.net || PP() ? `${esc(nm(1 - S))}'s turn` : 'AI turn';
    hint = ui.visArm ? VIS_ARM_TXT : shopTurnText(); mine = myTurn && !G.passed[S];
    if (compact()) piles = dockPilesHTML();
    body = `<div class="purse"><span class="amt">$${me.money}</span><span class="nx">+$${Math.max(0, income(me))}<br>next shop</span></div>
      ${slotsHTML(true)}`;
    acts = `${ui.visArm ? '<button type="button" class="act" data-act="vis-cancel">Cancel</button>' : ''}<button type="button" class="primary act" data-act="pass" ${myTurn ? '' : 'disabled'}>${lbl}</button>`;
  } else if (G.phase === 'mobilize'){
    if (G.net && NET && NET.acts.length > NET.applied[NET.seat]) return '';
    if (PP() && ui.handoff != null) return '';
    hint = mobHintText(); mine = !ui.planning;
    const lbl = ui.planning ? 'AI is planning…' : PP() && !G.net && S === 0 ? `Lock in, pass to ${esc(nm(1))}` : G.net ? 'Lock in' : 'Lock in and battle';
    if (!hint) hint = ui.planning ? 'The AI is setting its deck…' : 'Set your deck order, then lock in.';
    infob = `<button type="button" class="infob" data-tip="${esc(MOB_INFO)}" aria-label="How Mobilize works">i</button>`;
    acts = `${ui.sel ? '<button type="button" class="act" data-act="sel-clear">Cancel</button>' : ''}<button type="button" class="primary act" data-act="lock" ${ui.planning ? 'disabled' : ''}>${lbl}</button>`;
  } else return '';
  DOCKINFO = {phase, hint, mine, infob};
  const shopping = G.phase === 'shop' && !ui.battle;
  const deckBtn = i => { const lab = PP() || G.net ? (i === S ? 'Your deck' : esc(nm(i))) : i === S ? 'Your deck' : 'Enemy';
    return `<button type="button" class="dk s${VS(i)}${ui.deckView === i ? ' on' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(deckName(i))}: view cards"><span class="dkic" aria-hidden="true"><i></i><i></i></span><span class="dl">${lab}</span></button>`; };
  let mirBtn = '';
  if (shopping && G.miracles){
    const mir = G.players[S].mir || [];
    const live = mir.some((_, j) => { const p = mirPlayable(j, 'shop'); return p.ok && !p.on; });
    mirBtn = `<button type="button" class="mirb${live ? ' glow' : ''}${ui.mirTray ? ' on' : ''}" data-act="mir-tray" aria-expanded="${!!ui.mirTray}" aria-label="Miracles${mir.length ? ` (${mir.length})` : ''}"><span class="ms" aria-hidden="true">✶</span><span class="dl">Miracles</span>${mir.length ? `<span class="mc">${mir.length}</span>` : ''}</button>`;
  }
  // shop on phones: each side's tile is its deck button and carries its gold, income, unit and City counts and its buys
  // left; Miracles (above) and Pass (below) stand in a narrow column between the two tiles, so the bar is symmetric and
  // the top bar only needs the score
  if (shopping){
    const B = boardSnap();
    const tile = i => {
      const p = G.players[i], lab = PP() || G.net ? esc(nm(i)) : i === S ? 'You' : 'Enemy';
      const u = uniqueUnits(i === S ? p : {...p, hand:pubHand(p)}), uc = deckCap(p), b = slotsUsed(p), bc = citySlots(p), inc = Math.max(0, B.inc[i]);
      const aria = `${deckName(i)}: view cards. $${B.money[i]}, +$${inc} next shop. Units ${u} of ${uc}. City ${b} of ${bc}. ${Math.max(0, baseLeft(G.buys[i]))} of ${buysOf(G.buys[i])} buys left.${G.passed[i] ? ' Passed.' : ''}`;
      return `<button type="button" class="dk tile s${VS(i)}${ui.deckView === i ? ' on' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(aria)}"><span class="tt" aria-hidden="true"><span class="dkic"><i></i><i></i></span><span class="tn">${lab}</span>${G.passed[i] ? '<span class="pbx">passed</span>' : ''}<span class="tm">$${B.money[i]}<i>+${inc}</i></span></span><span class="ts" aria-hidden="true"><span>Units<b class="${u >= uc ? 'full' : ''}">${u}<small>/${uc}</small></b></span><span>City<b class="${b >= bc ? 'full' : ''}">${b}<small>/${bc}</small></b></span></span><span class="tb" aria-hidden="true">${tileSlotsHTML(i)}</span></button>`;
    };
    return `<div class="dock${mine ? ' mine' : ''} ph-shop dshop" id="dock">${piles}<div class="dtiles mid">${tile(VS(0))}<div class="dbtns dact">${ui.visArm ? '' : mirBtn}${acts}</div>${tile(VS(1))}</div></div><div class="dockspace" aria-hidden="true"></div>`;
  }
  return `<div class="dock${mine ? ' mine' : ''} ph-${ui.battle ? 'battle' : G.phase}" id="dock">${piles}${body ? `<div class="dbar">${body}</div>` : ''}
    <div class="dbtns${shopping ? '' : ' tight'}">${deckBtn(VS(0))}${deckBtn(VS(1))}${mirBtn}${acts}</div></div><div class="dockspace" aria-hidden="true"></div>`;
}
// the phone's pinned top bar: both sides' money and counts around the score, then the phase and what to do now
function pbarHTML(){
  const D = DOCKINFO; if (!D) return '';
  const B = hideResult() ? ui.pre : boardSnap(), S = seat();
  const counts = !ui.battle && !G.over && (G.phase === 'shop' || G.phase === 'mobilize');
  const shopping = G.phase === 'shop' && !ui.battle && !G.over;
  const side = i => {
    const p = G.players[i];
    const who = PP() || G.net ? esc(nm(i)) : i === S ? 'You' : 'Enemy';
    let cap = '';
    if (counts){
      const u = uniqueUnits(i === S ? p : {...p, hand:pubHand(p)}), uc = deckCap(p), b = slotsUsed(p), bc = citySlots(p);
      cap = `<span class="pbc"><b class="${u >= uc ? 'full' : ''}" title="Unique units owned; the deck holds ${uc}">${u}/${uc}</b> Units · <b class="${b >= bc ? 'full' : ''}" title="City slots used; the city holds ${bc}">${b}/${bc}</b> City</span>`;
    }
    return `<div class="pbs s${VS(i)}"><span class="pbn">${who}${shopping && G.passed[i] ? ' <span class="pbx">passed</span>' : ''}</span><span class="pbmo">$${B.money[i]} · +$${B.inc[i]}</span>${cap}</div>`;
  };
  const L = VS(0), Rt = VS(1);
  if (shopping) return `<div class="gtop gs" id="gtop"><div class="pbsc"><span class="rl">Round ${G.round}</span><span class="sc" aria-label="Score ${B.tot[L]} to ${B.tot[Rt]}"><b class="a">${B.tot[L]}</b><span class="dash">–</span><b class="b">${B.tot[Rt]}</b></span><span class="rr">First to ${G.target}</span></div>${ui.visArm ? `<div class="pbhint mine"><span class="dtxt">${D.hint}</span></div>` : ''}</div>`;
  return `<div class="gtop" id="gtop"><div class="pbg">${side(L)}<div class="pbm"><div class="sc">${B.tot[L]} – ${B.tot[Rt]}</div><div class="rd">Round ${G.round} · first to ${G.target}</div></div>${side(Rt)}</div>
    <div class="pbhint${D.mine ? ' mine' : ''}"><span class="dphase">${esc(D.phase)}</span><span class="dtxt">${D.hint}</span>${D.infob}</div></div>`;
}
// "Taken by AI" placeholders keep their spot in the market for the rest of the shop
function ghostList(kind){ return ui.ghosts && ui.ghosts.round === G.round ? ui.ghosts[kind] : []; }
function mergedPos(kind, j){
  let m = j; for (const g of ghostList(kind).slice().sort((a, b) => a.idx - b.idx)) if (g.idx <= m) m++;
  return m;
}
// Discard pile: face-up units that went unbought or were sold. You can buy a copy of a unit you own from it (a normal unit buy).
// The pile glows when it holds a copy of one of your units that could still level up.
function musterMatch(n){ const me = G.players[seat()]; return ownsCard(me, n) > 0 && !(cardKind(n) === 'u' && exemptUnit(n)) && !cantAcquire(me, n, cardKind(n)); }
function musterPileHTML(){
  const pile = G.muster || [], sm = (G.salvMir || []).length, open = ui.pkWin === 'salvage' && (pile.length > 0 || sm > 0), hits = pile.filter(musterMatch).length, n = Math.min(3, pile.length);
  const tip = pile.length ? `Discard pile: ${pile.length} card${pile.length > 1 ? 's' : ''} face-up${hits ? `, ${hits} cop${hits > 1 ? 'ies' : 'y'} of your cards` : ''}. Tap to ${open ? 'close' : 'look through it'}.` : 'Discard pile: empty. Unbought and sold cards land here face-up.';
  return `<button type="button" class="mpile${hits ? ' glow' : ''}${pile.length ? '' : ' empty'}" id="muster-pile" data-act="muster" aria-expanded="${open}" ${pile.length || sm ? '' : 'disabled'} title="${esc(tip)}" aria-label="${esc(tip)}">
    <span class="mplbl" aria-hidden="true">Discard</span><span class="mpcards" aria-hidden="true">${Array.from({length:Math.max(1, n)}, (_, k) => `<span class="mpc${pile.length ? '' : ' mpe'}" style="--k:${Math.max(1, n) - 1 - k}"></span>`).join('')}<span class="mpface">${pile.length ? zhChip(pile[pile.length - 1]) : ''}<b class="mpcount pcount">${pile.length}</b></span></span>${hits ? `<span class="mphit" aria-hidden="true">${hits}</span>` : ''}</button>`;
}
function marketRow(kind, src){
  // each card stays in its own slot from shop to shop (a returning card keeps its place); a bought card's ghost holds its slot
  const slotted = G.disp[kind].some(c => c.at != null);
  let cards;
  if (slotted){
    const items = G.disp[kind].map((c, i) => ({at:c.at != null ? c.at : i, html:marketCard(c.name, kind, src, i, c.side, false, c.mir)}));
    const occ = new Set(G.disp[kind].map(c => c.at));
    for (const g of ghostList(kind)) if (!occ.has(g.idx)) items.push({at:g.idx, html:ghostCard(g, kind), ghost:true});
    items.sort((a, b) => a.at - b.at || (a.ghost ? 1 : 0) - (b.ghost ? 1 : 0));
    cards = items.map(it => it.html.replace('<div ', `<div data-at="${it.at}" `));
  } else {
    cards = G.disp[kind].map((c, i) => marketCard(c.name, kind, src, i, c.side, false, c.mir));
    for (const g of ghostList(kind).slice().sort((a, b) => a.idx - b.idx))
      cards.splice(Math.min(g.idx, cards.length), 0, ghostCard(g, kind));
  }
  // the always-available card (Recruit or Field) leads its row
  const always = kind === 'u' ? marketCard('Recruit', 'u', 'recruit', 0, false, true) : marketCard('Field', 'b', 'field', 0, false, true);
  const alwaysWrap = `<div class="alwaysw"><span class="alab">Always available</span><div class="astack">${always}</div></div>`;
  return alwaysWrap + '<div class="mdiv" aria-hidden="true"></div>' + cards.join('');
}
// Freeze: cards set aside, under the market. Yours can be bought like display cards; your opponent's are shown so you know.
function frozenHTML(S){
  const fz = G.frozen || [[], []], mine = fz[S] || [], theirs = fz[1 - S] || [];
  if (!mine.length && !theirs.length) return '';
  const who = PP() || G.net ? esc(nm(1 - S)) : 'AI';
  const row = mine.map((c, i) => marketCard(c.name, c.kind, 'fz', i, false, false, c.mir)).join('');
  const their = theirs.map(c => `<div${c.id != null ? ` data-ck="c${c.id}"` : ''} class="mcard ${c.kind} ghost theirs hasst">${cardFace(c.name, c.kind, 0, true)}${pairTagHTML(c.pair, c.kind)}${stampsHTML([['st-theirs', `✶ Set aside by ${who}`]])}</div>`).join('');
  return `<span class="eyebrow">✶ Set aside with Freeze</span><div class="market plain peekrow frozenrow">${row}${their}</div>`;
}
// a card that was bought this shop: still readable, marked with who took it
function ghostCard(g, kind){
  const d = kind === 'u' ? DEFS[g.name] : BDEFS[g.name]; if (!d) return '';
  const S = seat(), mine = g.who === S, tp = G.players[g.who] || {hand:{}, city:{}}, own = (kind === 'u' ? tp.hand[g.name] : tp.city[g.name]) || 0;
  return `<div class="mcard ghost hasst ${kind} ${mine ? 'mine' : 'theirs'}">
    ${cardFace(g.name, kind, own, true)}
    ${stampsHTML([[mine ? 'st-mine' : 'st-theirs', g.frz ? `✶ Frozen by ${mine ? (PP() && !G.net ? esc(nm(S)) : 'you') : PP() ? esc(nm(g.who)) : 'AI'}` : `${mine ? (PP() && !G.net ? `${esc(nm(S))} bought this` : 'You bought this') : `Taken by ${PP() ? esc(nm(g.who)) : 'AI'}`} · $${g.price}`]])}
  </div>`;
}
function noteAIMoves(before, money0, logN, queued){
  if (!ui.ghosts || ui.ghosts.round !== G.round) ui.ghosts = {round:G.round, u:[], b:[]};
  if (G.log.slice(logN).some(l => l.side === 1 && l.ev && l.ev.a === 'redeal')) redealSeen();
  ghostsFrom(1, logN);
  const buys = G.log.slice(logN).filter(l => l.side === 1 && (/ buys /.test(l.t) || (l.ev && (l.ev.a === 'freeze' || l.ev.a === 'redeal'))));
  const shown = queued ? buys.filter(l => l.ev && (l.ev.a === 'freeze' || l.ev.a === 'redeal')) : buys;   // queued buys hold on screen with their own tag
  if (shown.length){ showToast(shown.map(l => l.t).join(' ')); sfx.coin(0.45); }
  else if (G.log.slice(logN).some(l => l.side === 1 && / passes\./.test(l.t))) sfx.wood();
}
let toastT = null;
function showToast(text){
  let el = $('toast');
  if (!el){ el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  const fresh = el.hidden || !el.textContent;
  el.getAnimations().forEach(a => a.cancel()); el.style.pointerEvents = '';
  el.textContent = text; el.hidden = false;
  if (fresh) popIn([el]);
  clearTimeout(toastT); toastT = setTimeout(() => { popOut([el], null, () => { el.hidden = true; el.getAnimations().forEach(a => a.cancel()); }); }, 3000);
}
/* Each market row has its own face-down deck: units (blue backs) and buildings (gold backs). New market cards,
   Black Market peeks and Vision peeks are dealt out of the deck they really come from. With Black Market ready,
   both decks glow and say so; tapping one looks at its top cards (one deck per shop). */
// What tapping a deck does right now, or null. A Vision just played wins; then cards already set aside from this deck
// (tap to look at them again); then an unused Black Market.
function deckAct(k){
  const S = seat(), me = G.players[S], myTurn = G.phase === 'shop' && cur(G) === S && !G.passed[S];
  const n = (k === 'b' ? G.bDeck : G.uDeck).length, w = k === 'b' ? 'building' : 'unit';
  if (ui.visArm && myTurn && n){ const v = MIRS.Vision.vis; return {act:'vis-' + k, label:'Vision', tip:`Vision: look at the top ${v} ${w}${v > 1 ? 's' : ''} and buy one at normal price.`}; }
  const wait = myPeeks().filter(pk => pk.k === k).reduce((t, pk) => t + pk.cards.length, 0);
  if (wait) return {act:'pk-open', label:`Peek ${wait}`, tip:`${wait} ${w}${wait > 1 ? 's' : ''} set aside for you. Tap to look at ${wait > 1 ? 'them' : 'it'} again.`};
  const bmN = bVal(me, 'Black Market');
  if (myTurn && bmN && !G.bmUsed[S] && n){ const top = Math.min(bmN, n); return {act:'bm-' + k, label:`Peek ${top}`, tip:`Black Market: look at the top ${top} ${w}${top > 1 ? 's' : ''} (one deck per shop).`}; }
  return null;
}
// A deck as a square face-down stack with its count on it. named: the deck's name beside it (the phone bottom bar);
// otherwise only what a tap does (the desktop row header already names the deck).
function deckPileHTML(k, named){
  const n = (k === 'b' ? G.bDeck : G.uDeck).length, lbl = k === 'b' ? 'Buildings' : 'Units', a = deckAct(k);
  const tip = a ? a.tip : `${lbl} deck: ${n} card${n === 1 ? '' : 's'} left, face down.`;
  const stack = `<span class="dealdeck ${k}${n ? '' : ' empty'}" aria-hidden="true"><span class="cb"></span><span class="cb"></span><span class="cb"></span><b class="pcount">${n}</b></span>`;
  const inner = named ? `${stack}<span class="pl" aria-hidden="true">${lbl}${a ? `<i>${a.label}</i>` : ''}</span>` : `${stack}${a ? `<span class="bmtag" aria-hidden="true">${a.label}</span>` : ''}`;
  return a ? `<button type="button" class="sdeck ${k} bmready" data-k="${k}" data-act="${a.act}" title="${esc(tip)}" aria-label="${esc(tip)}">${inner}</button>`
           : `<span class="sdeck ${k}" data-k="${k}" role="img" title="${esc(tip)}" aria-label="${esc(tip)}">${inner}</span>`;
}
function sdeckHTML(k){
  return `<div class="mshead"><span class="eyebrow">${k === 'b' ? 'Buildings' : 'Units'}</span><span class="grow"></span>${deckPileHTML(k, false)}</div>`;
}
// your Black Market and Vision peeks, Black Market first
function myPeeks(){ const S = seat(); return PEEK_BY.map(by => peekOf(G, S, by)).filter(Boolean); }
/* The peek window. Black Market and Vision peeks (ui.pkWin 'peek') and the discard pile (ui.pkWin 'salvage') open in one
   pop-up over the shop: the same sheet as a card's on phones, a centered window on wider screens. It scrolls when it's
   long. Each card buys from its own button, or tap it to read it in full (the card pop-up opens on top). Swipe it down
   by its top strip, tap ✕, Close or outside it to close. Closing a peek keeps the cards set aside: the deck glows
   "Peek 3" until you buy one or the shop ends. */
function peekWinHTML(){
  if (ui.deckView === 0 || ui.deckView === 1){
    if (!G || ui.start || ui.roll || ui.remind){ ui.deckView = null; return ''; }
    const d = deckSheetHTML(); if (!d) return '';
    return popWinHTML(d.label, d.cls, d.top, d.head, d.foot);
  }
  const w = ui.pkWin;
  if (!w || !G || G.phase !== 'shop' || ui.battle || ui.start || ui.roll || ui.remind){ if (!ui.pkPending) ui.pkWin = null; return ''; }
  const S = seat(), me = G.players[S];
  let head = '', body = '', foot = '', label = '';
  if (w === 'mason'){
    const mm = masonMode(); if (!mm){ ui.pkWin = null; ui.mason = null; return ''; }
    const own = Object.keys(me.city).filter(n => n !== 'Field' && me.city[n] > 0), lvOf = n => Math.min(me.city[n], BDEFS[n].lv.length);
    const cards = own.map(n => { const L = lvOf(n), max = BDEFS[n].lv.length;
      if (L >= max) return `<div class="mcard b writoff" aria-disabled="true">${cardFace(n, 'b', me.city[n])}<span class="writown" aria-hidden="true">${max > 1 ? 'Max level' : 'No levels'}</span></div>`;
      const what = `Buy Mason's Guild for $${mm.price} and attach it here: Lv ${L} → ${L+1}.`;
      return `<div class="mcard b writtgt" data-act="mason-tog" data-name="${esc(n)}" role="button" tabindex="0" title="${esc(what)}" aria-label="${esc(n)}. ${esc(what)}">${cardFace(n, 'b', me.city[n])}<span class="writown" aria-hidden="true">Lv ${L} → ${L+1}</span></div>`; }).join('');
    label = "Mason's Guild";
    head = `<section class="pksec"><span class="pkchip">✶ Mason's Guild · $${mm.price}</span><h2 class="pkttl">Attach it to a building</h2>
      <p class="pksub">It counts as one more copy of that building and levels it up. Tap a building to buy it.</p>
      <div class="fcards">${cards}</div></section>`;
    foot = 'Close to cancel. Nothing is bought until you tap a building.';
  } else if (w === 'salvage'){
    const pile = G.muster || [], sm = G.salvMir || []; if (!pile.length && !sm.length){ ui.pkWin = null; return ''; }
    const hits = pile.filter(musterMatch).length, smc = {};
    for (const n of sm) smc[n] = (smc[n] || 0) + 1;
    const cards = pile.map((n, i) => [n, i]).sort((a, b) => musterMatch(b[0]) - musterMatch(a[0]))
      .map(([n, i]) => `<div class="mwrap${musterMatch(n) ? ' hit' : ''}">${marketCard(n, cardKind(n), 'mu', i)}</div>`).join('');
    label = 'Discard pile';
    head = `<section class="pksec"><span class="pkchip sal">Discard pile</span><h2 class="pkttl">${pile.length} card${pile.length > 1 ? 's' : ''}, face up</h2>
      <p class="pksub">Unbought and sold cards land here. ${bVal(me, 'War College') ? `War College lets you buy a duplicate of any card you own for free. It uses a buy.` : 'Only War College can take cards from here.'}${hits ? ' Yours are first.' : ''}</p>
      <div class="market plain pkgrid">${cards}</div></section>`;
    if (!pile.length) head = '';
    if (sm.length) head += `<section class="pksec"><span class="pkchip sal">Miracles</span><h2 class="pkttl">${sm.length} used or discarded</h2>
      <p class="pksub">Every miracle that's used up or discarded lands here face up, so both players can count them. They can't be bought.</p>
      <div class="mirgrid">${Object.entries(smc).map(([n, c]) => `<span class="mircard plain" title="${esc(mirBrief(n))}"><span class="mtop"><b>${esc(n)}</b>${c > 1 ? `<span class="mirlive">×${c}</span>` : ''}</span><span class="mseal" aria-hidden="true"><span>✶</span></span><span class="mtx">${esc(MIRS[n].sh.replace(/^hand: /, ''))}</span></span>`).join('')}</div></section>`;
    foot = 'Tap a card to read it in full.';
  } else if (w === 'peek'){
    const L = myPeeks();
    if (!L.length){ if (!ui.pkPending) ui.pkWin = null; return ''; }
    ui.pkPending = false;
    const f = ui.pkFocus, order = L.slice().sort((a, b) => (b.k === f) - (a.k === f));
    label = L.length > 1 ? 'Black Market and Vision' : L[0].by === 'bm' ? 'Black Market' : 'Vision';
    head = order.map(pk => {
      const n = pk.cards.length, w2 = pk.k === 'b' ? 'building' : 'unit';
      const sub = pk.by === 'bm' ? `Buy one with $${bmOff(me)} off. The others go back under the deck.` : 'Buy one at normal price (it uses a buy). The others go back under the deck.';
      return `<section class="pksec"><span class="pkchip ${pk.by}">${pk.by === 'bm' ? 'Black Market' : '✶ Vision'}</span><h2 class="pkttl">Top ${n} ${w2}${n === 1 ? '' : 's'}</h2><p class="pksub">${sub}</p>
        <div class="market plain peekrow pkgrid" data-from="${pk.k}" data-key="${G.round}-${S}-${pk.by}-${pk.k}">${pk.cards.map((c, i) => marketCard(c, pk.k, pk.by, i)).join('') || '<p class="note">Nothing left.</p>'}</div></section>`;
    }).join('');
    foot = 'Closing keeps these set aside: tap the glowing deck to look again, until you buy one or the shop ends.';
  } else { ui.pkWin = null; return ''; }
  return popWinHTML(label, '', '', head + body, foot);
}
/* THE POP-UP. Every window over the game uses this one container, the same as a card's pop-up: a sheet from the bottom
   on phones (over the bottom bar), a centered window on bigger screens. Drag it down by its top strip, tap ✕, Close or
   outside it, or press Escape to close it. Your deck / the enemy's, Discard, Black Market and Vision peeks and Mason's
   Guild all open here, and every card in it is the market's card at the market's size (--uw × --uh). */
function popWinHTML(label, cls, top, body, foot){
  return `<div class="pkwin" data-act="pk-close"><div class="sheet pksheet ${cls}" role="dialog" aria-modal="true" aria-label="${esc(label)}">
    <div class="sheethead"><span class="grab" aria-hidden="true"></span><button type="button" class="sheetx" data-act="pk-close" aria-label="Close">✕</button></div>
    ${top}<div class="pkbody mktp">${body}</div>
    <div class="pkfoot"><p class="note">${foot}</p><button type="button" data-act="pk-close">Close</button></div></div></div>`;
}
const popShut = () => { ui.pkWin = null; ui.pkPending = false; ui.deckView = null; ui.mason = null; };
function closePkWin(){ const w = $('view-play').querySelector('.pkwin'); if (w) w.remove(); popShut(); renderPlay(); }
// every card in a pop-up or the turn summary is exactly the size of a market card: measure one and share it
function syncCardSize(){
  const c = $('view-play') && $('view-play').querySelector('.mktp:not(.pkbody) .market > .mcard:not(.ghost)'); if (!c) return;
  const w = c.offsetWidth, h = c.offsetHeight; if (w < 40 || h < 40) return;
  const st = document.documentElement.style;
  if (st.getPropertyValue('--uw') !== w + 'px') st.setProperty('--uw', w + 'px');
  if (st.getPropertyValue('--uh') !== h + 'px') st.setProperty('--uh', h + 'px');
}
window.addEventListener('resize', () => requestAnimationFrame(syncCardSize));
// Phones: the Units deck, the discard pile and the Buildings deck ride along the top of the bottom bar, square stacks
// with their counts printed on them, so they're always in reach for Black Market and the discard pile and the market has no headers.
function dockPilesHTML(){
  return `<div class="dpiles">${deckPileHTML('u', true)}${musterPileHTML()}${deckPileHTML('b', true)}</div>`;
}
function shopHTML(){
  const S = seat(), O = 1 - S, me = G.players[S], b = G.buys[S], myTurn = cur(G) === S;
  const carp = bVal(me, "Carpenter's Guild");
  const bmOk = myTurn && bVal(me, 'Black Market') && !G.bmUsed[S];
  const turnTxt = G.net ? (G.passed[S] ? `You passed. ${esc(nm(O))} is finishing their shopping.` : myTurn ? 'Your turn: buy one card or pass.' : `${esc(nm(O))} is shopping…`)
    : PP() ? `${esc(nm(S))}'s turn: buy one card or pass.${G.passed[O] ? ` ${esc(nm(O))} has passed.` : ''}`
    : G.passed[0] ? 'You passed. The AI is finishing its shopping.' : myTurn ? 'Your turn: buy one card or pass.' : 'The AI is thinking: it test-battles its options against your army…';
  const turnMsg = myTurn && altarWaiting(G, S) ? 'Altar of Blood: pick a unit to discard first.' : turnTxt;
  const bmN = bVal(me, 'Black Market');
  const ph = compact();   // phones: the decks and the discard pile sit in the bottom bar (dockPilesHTML), not in the market
  return `${budgetHTML()}
  <div class="row turnrow"><span class="turn ${myTurn ? '' : 'ai'}${PP() ? ` pp s${VS(S)}` : ''}">${ui.visArm ? VIS_ARM_TXT : turnMsg}</span>
    <span class="grow"></span>${ui.visArm ? '<button type="button" data-act="vis-cancel">Cancel</button>' : ''}
    <button type="button" class="primary passbtn" data-act="pass" ${myTurn ? '' : 'disabled'}>Pass</button></div>
  <div class="panel mktp show-${ui.mktTab === 'b' ? 'b' : 'u'}"><div class="mkthead"><h2>Market</h2><span class="grow"></span>${ph ? '' : musterPileHTML()}
    <span class="mswitch seg" role="group" aria-label="Show market">${[['u','Units'],['b','Buildings']].map(([k, l]) => `<button type="button" data-act="mkt-tab" data-k="${k}" aria-pressed="${(ui.mktTab === 'b' ? 'b' : 'u') === k}">${l}</button>`).join('')}</span>
</div>
    <p class="peekhint">Tap a card to read it${myTurn && !G.passed[S] ? ' and buy it' : ''}.</p>
    ${writBarHTML()}
    <div class="msec" data-k="u">${ph ? '' : sdeckHTML('u')}
    <div class="market">${marketRow('u', 'du')}</div></div>
    <div class="msec" data-k="b">${ph ? '' : sdeckHTML('b')}
    <div class="market">${marketRow('b', 'db')}</div></div>
    ${frozenHTML(S)}
  </div>
  <div class="panel logp"><span class="eyebrow">Recent moves</span>${logHTML()}</div>
  ${mirTrayHTML()}${mirModalHTML()}`;
}
function draftPower(u){
  if (u.name === 'Recruit') return 1 + bVal(G.players[seat()], 'Muster Hall') + (u.arm||0);
  const c = G.players[seat()].hand[u.name] || 1, L = Math.min(c + (u.tr||0), uMax(u.name));
  return u.name === 'Jester' ? '?' : DEFS[u.name].p[L-1] + (u.arm||0);
}
const DPX = 8, DPY = 6;
// Behind a deck card: extra copies peek out as thin edges, and each attached token is a whole card tucked behind it,
// stepped up so a tab with the token's icon and name shows above the unit (newest farthest back). The card gets a
// top margin of the same height, so in the overlapping deck no tab ever covers the card above.
const TKT = 14, TKX = 4, CPX = 3;
// Gear and tokens are their own cards, tucked behind the unit: gear nearest, then each token in the order it was
// attached (newest farthest back). Each one sits a step up and a little to the left, so its top banner (Might and
// name) peeks out above the card in front. The step is a fraction of the card width (TKY), so it scales with the card.
const TKY = .175, TKL = 5;
const tuckImg = (url, alt) => `<img src="${url}" alt="" draggable="false" loading="lazy" aria-hidden="true">${alt ? `<span class="cface-txt">${esc(alt)}</span>` : ''}`;
// a gear card with no matching art (its numbers were changed in the Balance Lab): a plain card with the same banner
function tuckPlainGear(n){
  const v = gearPow(n);
  return `<span class="tkplain"><span class="tkpm">${v != null ? '+' + v : ''}</span><span class="tkpn">${esc(dispName(n))}</span></span>`;
}
function gearPow(n){ const d = BDEFS[n]; if (!d || !d.gear) return null; return ['Zweihander', 'Battle Axe', 'Heirloom Blade', 'Lance'].includes(n) ? d.lv[0] : 0; }
function deckPoke(u, c, i){
  const cps = Math.min(3, extraCopies(u.name, 'u', c)), toks = tokOrder(u), g = u.gear ? 1 : 0;
  if (!cps && !toks.length && !g) return {style:'', html:''};
  const sh = ['inset 0 3px 0 var(--muted)'];
  for (let j = 0; j < cps; j++){ const d = CPX * (j + 1); sh.push(`${d}px ${-d}px 0 -1px var(--card, var(--bg))`, `${d}px ${-d}px 0 0 var(--muted)`); }
  const base = CPX * cps, n = toks.length + g;
  const pos = j => `--j:${j};--tkb:${base}px;z-index:${-1 - j}`;
  // gear: nearest the unit, with its own banner (tap it to unequip)
  let ghtml = '';
  if (g){
    const url = typeof artURL === 'function' ? artURL(u.gear, 'b') : null;
    ghtml = `<span class="pkhit tuck gtk" style="${pos(0)}" role="button" tabindex="0" data-act="g-off" data-i="${i}" data-tuck-gear="${esc(u.gear)}" title="${esc(u.gear)}: ${esc(BDEFS[u.gear].t)} Tap to unequip." aria-label="${esc(u.gear)} equipped. Tap to unequip.">${url ? tuckImg(url, dispName(u.gear)) : tuckPlainGear(u.gear)}<i class="tkx" aria-hidden="true">✕</i></span>`;
  }
  // tokens: oldest nearest, newest farthest back (tap any to send the newest back to the bench)
  const html = toks.map((k, j) => `<span class="pkhit tuck tkt t-${k}" style="${pos(j + g)}" role="button" tabindex="0" data-act="t-off" data-tok="${k}" data-i="${i}" data-tuck-tok="${k}" title="${TOKS[k].n}: tap to send the newest token back to the bench" aria-label="${TOKS[k].n} attached. Tap to send the newest token back to the bench">${tuckImg(tokArtURL(k), TOK_ART[k])}</span>`).join('');
  const title = [cps ? `${cps} extra cop${cps > 1 ? 'ies' : 'y'}` : '', u.arm ? `${u.arm} Might` : '', u.tr ? `${u.tr} Training` : '', u.sh ? `${u.sh} Shield${u.sh > 1 ? 's' : ''}` : '', u.gear || ''].filter(Boolean).join(', ');
  return {style:` style="box-shadow:${sh.join(',')};margin-top:calc(${base}px + var(--sc) * ${TKY} * ${n})" data-room="${n}" data-tkbase="${base}" data-tkgear="${g}" title="${title} behind it"`, html:ghtml + html};
}
// rules text printed on the bench token cards
const TOKRULES = {
  arm:'Attach to a unit for this battle. Stacks.',
  tr:'Attach to a unit for this battle. Not on Recruits or max level.',
  sh:'Attach to a unit for this battle. Stacks.'
};
const TOKN = {arm:'Armament', tr:'Training', sh:'Shield'}, TOKFX = {arm:'+1 power', tr:'+1 level', sh:'blocks a hit'};
const TOKA = {arm:'an Armament', tr:'a Training token', sh:'a Shield'};
function tokChip(kind, where, i){
  const lbl = TOKN[kind], fx = TOKFX[kind];
  const pick = where === 'bench' && ui.pick === kind ? ' picked' : '';
  const act = where === 'bench' ? `data-act="t-pick"` : `data-act="t-off" data-i="${i}"`;
  const tip = where === 'bench' ? `Drag onto a unit (or tap, then tap a unit)` : `Tap to send back to the bench, or drag to another unit`;
  const rules = TOKRULES[kind];
  if (where === 'bench') return `<span class="tokchip tokcard ${kind}${pick}" role="button" tabindex="0" data-drag="tok" data-tok="${kind}" ${act} title="${tip}" aria-label="${lbl}: ${rules} ${tip}"><span class="ttop"><span class="ico" aria-hidden="true">${tokIcon(kind)}</span><span class="tl">${lbl}</span></span><span class="fx">${fx}</span><span class="rt">${rules}</span></span>`;
  return `<span class="tokchip ${kind}${pick}" role="button" tabindex="0" data-drag="${where === 'bench' ? 'tok' : 'ton'}" data-tok="${kind}" ${act} ${where==='row'?`data-i="${i}"`:''} title="${tip}" aria-label="${lbl} (${fx}). ${tip}"><span class="ico" aria-hidden="true">${tokIcon(kind)}</span>${where === 'bench' ? `${lbl} <span class="fx">${fx}</span>` : ({arm:'+1 Arm', tr:'+1 Lv', sh:'+1 Shield'}[kind])}</span>`;
}
// can this token go on this draft unit? returns an error message or ''
function tokBlock(kind, u){
  if (isBat(u.name)) return 'Tokens go on units, not on battle miracles.';
  if (kind !== 'tr' && u.gear === 'Zweihander') return `${u.name} wields a Zweihander: no Armaments or Shields.`;
  if (kind !== 'tr') return '';
  if (u.name === 'Recruit') return 'Training can\'t go on a Recruit.';
  const c = G.players[seat()].hand[u.name] || 1;
  if (c + (u.tr||0) >= uMax(u.name)) return `${u.name} is already at max level.`;
  return '';
}
// the order a unit's tokens were attached, oldest first (kept in u.tko as 'a'/'t'), always matching its counts
function tokOrder(u){
  const o = [...(u.tko || '')].map(c => c === 'a' ? 'arm' : c === 's' ? 'sh' : 'tr');
  for (const k of ['arm', 'tr', 'sh']){
    let have = o.filter(x => x === k).length, want = u[k] || 0;
    while (have > want){ o.splice(o.lastIndexOf(k), 1); have--; }
    while (have < want){ o.push(k); have++; }
  }
  return o;
}
function setTokOrder(u, o){ u.tko = o.map(k => k === 'arm' ? 'a' : k === 'sh' ? 's' : 't').join(''); }
// take a token off a unit: the newest one, or the newest of a kind; returns the kind taken
function popTok(u, kind){
  if (!u) return null;
  const o = tokOrder(u), j = kind ? o.lastIndexOf(kind) : o.length - 1;
  if (j < 0) return null;
  const k = o.splice(j, 1)[0]; u[k] = Math.max(0, (u[k]||0) - 1); setTokOrder(u, o); return k;
}
// ---- tokens slide like cards: a token card flies between the bench and its place behind a unit, with the same
// easing and timing as the other Mobilize cards, while the cards around it slide to make room ----
const deckRowEl = i => document.querySelector(`#deck-list .drow[data-i="${i}"]`);
// where token card j (0 = closest) sits behind a deck row
function tokRectOf(row, j){
  const r = row.getBoundingClientRect(), base = +row.dataset.tkbase || 0, k = j + (+row.dataset.tkgear || 0) + 1;
  return {left:r.left - TKL * k, top:r.top - base - r.width * TKY * k, width:r.width, height:r.width * 1037 / 750};
}
const mobKeyOf = el => el.dataset.key || (el.dataset.tok ? 't' + el.dataset.tok : 'b' + (el.dataset.name || ''));
function snapMob(){
  const m = new Map();
  for (const el of document.querySelectorAll('#deck-list .drow, #bench-list .mcard')){ const k = mobKeyOf(el); if (!m.has(k)) m.set(k, el.getBoundingClientRect()); }
  return m;
}
function slideMob(m){
  if (reduceMotion()) return;
  for (const el of document.querySelectorAll('#deck-list .drow, #bench-list .mcard')){
    const r0 = m.get(mobKeyOf(el)); if (!r0) continue;
    const r1 = el.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:240, easing:SLIDE});
  }
}
// a token card in flight, drawn like the bench token card
function flyTok(kind, from, to, done){
  if (reduceMotion() || !from || !to){ if (done) done(); return; }
  const el = document.createElement('div');
  el.className = `mcard tcard ${kind} tokfly`; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="top"><span class="nm">${TOKN[kind]}</span></div><span class="tbig">${tokIcon(kind)}</span>`;
  if (tokArtURL(kind)){ el.classList.add('artfly'); el.innerHTML = `<img src="${tokArtURL(kind)}" alt="" draggable="false">`; }
  Object.assign(el.style, {position:'fixed', left:from.left + 'px', top:from.top + 'px', width:from.width + 'px', height:from.height + 'px', margin:'0', zIndex:'69', pointerEvents:'none'});
  document.body.appendChild(el);
  const a = el.animate([{transform:'none'}, {transform:`translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width},${to.height / from.height})`}], {duration:260, easing:SLIDE, fill:'forwards'});
  a.onfinish = () => { el.remove(); if (done) done(); };
}
// attach a token of `kind` to deck card i, flying in from `from` (a rect: the bench token card, or the dragged token)
function attachTokAnim(kind, i, from){
  const before = snapMob(), old = deckRowEl(i), oldSh = old ? old.style.boxShadow : '';
  placeTok(kind, i); if (ui.err){ renderPlay(); return; }
  ui.pick = null; renderPlay();
  const row = deckRowEl(i); if (!row){ return; }
  const tabs = row.querySelectorAll('.tkt'), tab = tabs[tabs.length - 1], to = tokRectOf(row, tabs.length - 1), newSh = row.style.boxShadow;
  slideMob(before);
  if (reduceMotion() || !from) return;
  row.style.boxShadow = oldSh; if (tab) tab.style.visibility = 'hidden';   // the new token appears when it lands
  flyTok(kind, from, to, () => { if (row.isConnected){ row.style.boxShadow = newSh; if (tab) tab.style.visibility = ''; } });
}
// send deck card i's newest token back to the bench, flying out from behind the card
function popTokAnim(i){
  const u = ui.draft && ui.draft[i], row0 = deckRowEl(i); if (!u) return false;
  const o = tokOrder(u); if (!o.length) return false;
  const kind = o[o.length - 1], from = row0 ? tokRectOf(row0, o.length - 1) : null;
  const had = !!document.querySelector(`#bench-list .tcard.${kind}`), before = snapMob();
  popTok(u); ui.err = ''; renderPlay();
  const dest = document.querySelector(`#bench-list .tcard.${kind}`), to = dest ? dest.getBoundingClientRect() : null;
  slideMob(before);
  if (!dest || !from || reduceMotion()) return true;
  if (!had) dest.style.visibility = 'hidden';
  flyTok(kind, from, to, () => { if (dest.isConnected){ dest.style.visibility = ''; if (had) dest.animate([{transform:'scale(1.05)'}, {transform:'none'}], {duration:200, easing:SLIDE}); } });
  return true;
}
function placeTok(kind, to, from){
  const d = ui.draft, u = d[to]; if (!u) return;
  const k = TOKN[kind] ? kind : 'tr';
  if (from === to) return;
  const why = tokBlock(kind, from != null ? {...u} : u);
  if (why){ ui.err = why; return; }
  if (from != null && d[from]) popTok(d[from], k);
  const o = tokOrder(u); o.push(k); u[k] = (u[k]||0) + 1; setTokOrder(u, o); ui.err = '';
}
function ordinal(n){ return n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'); }
function handoffHTML(){
  const S = ui.handoff, O = 1 - S;
  return `<div class="panel handoff s${VS(S)}">
    <span class="eyebrow">Round ${G.round} · Mobilize</span>
    <h2>Pass the device to ${esc(nm(S))}</h2>
    <p class="note">${S === 0 ? `${esc(nm(O))}, look away: ${esc(nm(S))} sets a secret deck order first.` : `${esc(nm(0))} has locked in. ${esc(nm(O))}, look away while ${esc(nm(S))} sets theirs.`}</p>
    <button type="button" class="primary big" data-act="pp-ready">I'm ${esc(nm(S))}, show my army</button>
  </div>`;
}
function mobilizeHTML(){
  if (G.net && NET && NET.acts.length > NET.applied[NET.seat]) return `<div class="panel handoff s${VS(NET.seat)}"><span class="eyebrow">Round ${G.round} · Mobilize</span><h2>Deck locked in</h2><p class="note">Waiting for ${esc(nm(1 - NET.seat))} to set their deck order. The battle starts as soon as they lock in.</p></div>`;
  if (G.net && !ui.draft) ui.draft = netClone(defaultDraft);
  if (PP() && ui.handoff != null) return handoffHTML();
  const S = seat(), O = 1 - S, me = G.players[S], d = ui.draft || [];
  const smith = armUI(me), study = trUI(me), armory = shAllow(me);
  const armUsed = d.reduce((s,u) => s + (u.arm||0), 0), trUsed = d.reduce((s,u) => s + (u.tr||0), 0), shUsed = d.reduce((s,u) => s + (u.sh||0), 0);
  if (ui.pick === 'arm' && armUsed >= smith || ui.pick === 'tr' && trUsed >= study || ui.pick === 'sh' && shUsed >= armory) ui.pick = null;
  const recAvail = recUI(me), recUsed = d.filter(u => u.name === 'Recruit').length;
  // which miracles this deck would use up (placing more Recruits or Armaments than your own)
  const spend = mirSpend(me, 'rec', recUsed - recBase(me)).concat(mirSpend(me, 'arm', armUsed - bVal(me, 'Smithy')), mirSpend(me, 'tr', trUsed - bVal(me, 'Study'))).map(j => me.mir[j]);
  if (!G.net){ const rdy = mobReady(me), cov = k => rdy.filter(j => MIRS[me.mir[j]][k]); spend.length = 0;
    for (const [k, over] of [['rec', recUsed - recBase(me)], ['arm', armUsed - bVal(me, 'Smithy')], ['tr', trUsed - bVal(me, 'Study')]]) if (over > 0){ const ix = cov(k); spend.push(...mirSpend({mir:ix.map(j => me.mir[j])}, k, over).map(x => me.mir[ix[x]])); } }
  const mobMir = (me.mir || []).filter(n => MIRS[n].rec || MIRS[n].arm || MIRS[n].tr);
  const uniq = d.filter(u => !exemptUnit(u.name) && !isBat(u.name)).length, occ = {}, nsp = d.filter(u => isBat(u.name)).length;
  if (ui.gpick && !(gearLeft(me, d)[ui.gpick] > 0)) ui.gpick = null;
  const uIdx = d.map((u, i) => i).filter(i => !isBat(d[i].name)), vanI = uIdx[0], rearI = uIdx[uIdx.length - 1], uNo = {};
  uIdx.forEach((i, k) => { uNo[i] = k + 1; });
  const rows = d.map((u, i) => {
    const key = `${u.name}#${(occ[u.name] = (occ[u.name] || 0) + 1)}`;
    const sel = ui.sel && ui.sel.zone === 'deck' && ui.sel.i === i ? ' sel' : ui.sel ? ' cansel' : '';
    if (isBat(u.name)) return `<div class="mcard fcard u drow spellc${sel}${ui.pick ? ' notarget' : ''}" data-drag="deck" data-i="${i}" data-key="${esc(key)}" data-uname="${esc(u.name)}" aria-label="Battle miracle: ${esc(u.name)}"><span class="dord spl" aria-hidden="true"><b>✶</b></span>${spellFace(u.name)}</div>`;
    const c = u.name === 'Recruit' ? 1 : me.hand[u.name];
    const pk = deckPoke(u, c, i);
    const can = ui.pick && !tokBlock(ui.pick, u), gcan = ui.gpick && gearBlock(ui.gpick, u) === '';
    const lv = Math.min(c + (u.tr||0), DEFS[u.name].p.length);   // Drifters level with Training too
    const isV = i === vanI, isR = i === rearI && i !== vanI;
    const ord = `<span class="dord${isV ? ' van' : ''}${isR ? ' rear' : ''}" aria-hidden="true"><b>${uNo[i]}</b>${isV ? '<i>Van</i>' : isR ? '<i>Rear</i>' : ''}</span>`;
    const gchip = '';
    return `<div class="mcard fcard u drow${isV ? ' isvan' : ''}${sel}${ui.pick ? (can ? ' target' : ' notarget') : ui.gpick ? (gcan ? ' target' : ' notarget') : ''}" data-drag="deck" data-i="${i}" data-key="${esc(key)}" data-uname="${esc(u.name)}" aria-label="${isV ? 'Vanguard, fights first' : isR ? 'Rearguard, fights last' : `Fights ${ordinal(uNo[i])}`}: ${esc(u.name)}${u.gear ? `, equipped with ${esc(u.gear)}` : ''}"${pk.style}>${pk.html}${ord}
      ${cardFace(u.name, 'u', lv)}${gchip}
    </div>`;
  });
  const avail = Object.keys(me.hand).filter(n => n !== 'Recruit' && !d.some(u => u.name === n));
  // one card per kind of token, with how many are left on it
  const tokCards = (smith - armUsed > 0 ? tokCard('arm', smith - armUsed) : '') + (armory - shUsed > 0 ? tokCard('sh', armory - shUsed) : '') + (study - trUsed > 0 ? tokCard('tr', study - trUsed) : '');
  const benchUnits = avail.map(n => { const c = me.hand[n];
        return `<div class="mcard fcard u bcard${ui.sel && ui.sel.zone === 'bench' && ui.sel.name === n ? ' sel' : ''}" data-drag="bench" data-name="${esc(n)}"${copyStyle(extraCopies(n, 'u', c), 'u')}>
        ${cardFace(n, 'u', c)}
        <button type="button" data-act="d-add" data-name="${esc(n)}">Add to deck</button></div>`; }).join('')
    + Array.from({length:Math.max(0, recAvail - recUsed)}, (_, k) => `<div class="mcard fcard u bcard${!k && ui.sel && ui.sel.zone === 'bench' && ui.sel.name === 'Recruit' ? ' sel' : ''}" data-drag="bench" data-name="Recruit">
        ${cardFace('Recruit', 'u', 1)}
        <button type="button" data-act="d-rec">Add to deck</button></div>`).join('');
  const spellBench = batBench(me, d).map((n, k, all) => `<div class="mcard fcard u bcard spellc${all.indexOf(n) === k && ui.sel && ui.sel.zone === 'bench' && ui.sel.name === n ? ' sel' : ''}" data-drag="bench" data-name="${esc(n)}">${spellFace(n)}
        <button type="button" data-act="d-add" data-name="${esc(n)}">Add to deck</button></div>`).join('');
  const gl = gearLeft(me, d);
  const gearBench = Object.keys(gl).filter(n => gl[n] > 0 && isGear(n)).sort().map(n => `<div class="mcard fcard b bcard gearc${ui.gpick === n ? ' picked' : ''}" data-act="g-pick" data-gear="${esc(n)}" role="button" tabindex="0" aria-label="${esc(n)}: ${esc(BDEFS[n].t)} Tap, then tap a unit to equip it."${copyStyle(gl[n] - 1, 'b')}>
        ${cardFace(n, 'b', 1)}
        <button type="button" data-act="g-pick" data-gear="${esc(n)}" aria-pressed="${ui.gpick === n}">${ui.gpick === n ? 'Tap a unit…' : gl[n] > 1 ? `Equip (×${gl[n]})` : 'Equip'}</button></div>`).join('');
  const one = d.length === 1;
  // the deck is held face up like the physical game: the front card (bottom of the column, shown in full) is the
  // Vanguard and fights first; each card behind it peeks out above, back to the Rearguard at the top
  return `<div class="forces mob2">
    <div class="panel deckp"><h2>${PP() && !G.net ? `${esc(nm(S))}'s deck` : 'Your deck'} <button type="button" class="infob" data-tip="${esc(MOB_INFO)}" aria-label="How Mobilize works">i</button></h2>
      <p class="note">${uniq}/${deckCap(me)} unique${smith ? ` · ${tokIcon('arm')} ${armUsed}/${smith}` : ''}${armory ? ` · ${tokIcon('sh')} ${shUsed}/${armory}` : ''}${study ? ` · ${tokIcon('tr')} ${trUsed}/${study}` : ''}${recAvail ? ` · Recruits ${recUsed}/${recAvail}` : ''}${nsp ? ` · ✶ ${nsp} battle ${nsp === 1 ? 'miracle' : 'miracles'}` : ''}</p>
      ${spend.length ? `<p class="note">✶ This deck uses ${spend.map(esc).join(' and ')}.</p>` : ''}
      ${ui.pick ? `<p class="pickhint">Tap a unit to give it ${TOKA[ui.pick]}. <button type="button" class="small" data-act="t-cancel">Cancel</button></p>` : ''}
      ${ui.gpick ? `<p class="pickhint">Tap a unit to equip ${esc(ui.gpick)}. <button type="button" class="small" data-act="g-cancel">Cancel</button></p>` : ''}
      ${d.length > 1 ? `<div class="dend back"><span>Back</span> Rearguard · fights last</div>` : ''}
      <div class="list dropzone dgrid stack" id="deck-list" data-zone="deck">${rows.reverse().join('') || '<div class="dempty">Drag or tap units from the bench</div>'}</div>
      ${d.length ? `<div class="dend front"><span>Front</span> ${one ? 'Vanguard and Rearguard' : 'Vanguard · fights first'}</div>` : ''}
      ${ui.err ? `<p class="err">${esc(ui.err)}</p>` : ''}
      <div class="row"><button type="button" data-act="suggest">Suggest a deck</button><span class="grow"></span><button type="button" class="primary" data-act="lock" ${ui.planning ? 'disabled' : ''}>${ui.planning ? 'The AI is planning its deck…' : PP() && !G.net && S === 0 ? `Lock in and pass to ${esc(nm(1))}` : G.net ? 'Lock in' : 'Lock in and battle'}</button></div>
    </div>
    <div class="mobright">
    <div class="panel benchp dropzone" data-zone="bench"><h2>Bench</h2>
      <div class="list dropzone dgrid stack" id="bench-list" data-zone="bench">${tokCards + gearBench + benchUnits + spellBench || '<div class="dempty">Every unit is in your deck</div>'}</div>
    </div>
    ${mobMirHTML(me)}
    </div>
  </div>${mirModalHTML()}`;
}
// the help behind the ⓘ during Mobilize
// can this gear go on this draft unit? returns an error message or ''
function gearBlock(n, u){
  if (!u || isBat(u.name)) return 'Gear goes on units, not on battle miracles.';
  if (u.gear) return `${u.name} already has ${u.gear}. Unequip it first.`;
  if (n === 'Zweihander' && (u.arm || u.sh)) return `${u.name} has Armaments or Shields: a Zweihander can't go on it.`;
  return '';
}
const MOB_INFO = 'Mobilize: set your deck in secret. Your deck is held face up, like the physical game: the front card (the full card at the bottom) is your Vanguard and fights first, the cards behind it fight next in order, and the back card (at the top) is your Rearguard. Drag cards to reorder them, or tap a bench card to add it to the back. Drag a token onto a unit, or tap the token and then a unit. Tap a deck card to send its newest token back, or to bench it once it has none. Double-tap any card to read it. Battle miracles from your hand wait on the bench too: put one anywhere in your deck (it isn\'t a unit) and it resolves when it reaches the top of your deck. Gear from your hand waits on the bench too: tap Equip, then a unit (one gear per unit; tap the gear on a unit to take it off). Gear only counts as equipped in battle and comes back to your hand after.';
// a bench token, the same size and shape as a unit card, with how many of that kind are left
function tokCard(kind, n){
  const lbl = TOKN[kind], fx = TOKFX[kind];
  return `<div class="mcard tcard ${kind}${ui.pick === kind ? ' picked' : ''}" role="button" tabindex="0" data-drag="tok" data-tok="${kind}" data-act="t-pick" title="Drag onto a unit (or tap, then tap a unit)" aria-label="${n} ${lbl}${n > 1 ? 's' : ''} left: ${TOKRULES[kind]} Drag onto a unit, or tap it and then a unit.">
    <div class="top"><span class="nm">${lbl}</span><span class="cost tn">×${n}</span></div>
    <div class="curve">${fx}</div>
    <span class="tbig" aria-hidden="true">${tokIcon(kind)}</span>
    <div class="stx">${TOKRULES[kind]}</div>
  </div>`;
}
function battleHTML(){
  const res = ui.battle, f = res.frames[ui.frame], w = res.result.w, last = res.frames.length - 1, atEnd = ui.frame === last;
  const wc = VS(w)===0 ? 'a' : VS(w)===1 ? 'b' : 'd';
  let tail;
  if (false) tail = '';
  else if (G.over){
    const msg = G.winner < 0 ? 'The game ends in a draw.' : PP() ? `${esc(nm(G.winner))} wins the game.` : G.winner === 0 ? 'You win the game.' : 'The AI wins the game.';
    tail = `<div class="row"><span class="verdict ${VS(G.winner)===0?'a':VS(G.winner)===1?'b':'d'}">${msg}</span><span class="note">${esc(res.result.why)}</span>${ratingNoteHTML()}<span class="grow"></span>${G.rec ? '<button type="button" data-act="rec-copy">Copy match for Claude</button>' : ''}<button type="button" class="primary" data-act="newgame">${PP() ? 'New game…' : 'Choose next opponent'}</button></div>`;
  } else tail = `<div class="row"><span class="note">${esc(res.result.why)}</span><span class="grow"></span><button type="button" class="primary" data-act="continue">${G.net ? (NET && NET.needShop ? `Go to round ${G.round + 1} shop` : `Go to round ${G.round} shop`) : `Go to round ${G.round + 1} shop`}</button></div>`;
  const banner = atEnd && !ui.bannerOff ? `<button type="button" class="banner ${wc}" data-act="banner-off" aria-label="Hide result and show the final board"><span class="bx"><b>${PP() ? (w < 0 ? 'Draw' : esc(nm(w))) : w===0?'Victory':w===1?'Defeat':'Draw'}</b><span class="note">${PP() ? (w < 0 ? 'Neither side wins' : 'wins the battle') + ' · click to see the board' : w===0?'You win the battle':w===1?'The AI wins the battle':'Neither side wins'} · click to see the board</span></span></button>` : '';
  if (!atEnd) tail = tail.replace('<div class="row">', '<div class="row tailwait" aria-hidden="true" inert>');
  return `<div class="panel">
    <div class="row battlectl"><button type="button" data-act="b-first" ${ui.frame===0?'disabled':''}>Start</button><button type="button" data-act="b-prev" ${ui.frame===0?'disabled':''}>Back</button><button type="button" class="primary" data-act="b-next" ${atEnd?'disabled':''}>Next step</button>${atEnd ? '<button type="button" data-act="b-replay">Replay fight</button>' : '<button type="button" data-act="b-last">Skip to end</button>'}<button type="button" class="autobtn" data-act="b-auto" aria-pressed="${autoOn() ? 'true' : 'false'}" title="Play the battle step by step on its own">${autoLabel()}</button><button type="button" class="abtog" data-act="b-abwin" aria-pressed="${abOn() ? 'true' : 'false'}" title="Show a note for each ability that triggers in this step">Ability notes</button><button type="button" class="speedbtn" data-act="b-speed" aria-pressed="${autoFast() ? 'true' : 'false'}" title="Auto-play speed" aria-label="Auto-play speed">${speedLabel()}</button><span class="note">${ui.frame+1} / ${res.frames.length} · ${esc(f.label)}</span></div>
    <div class="stage">${lineHTML(f, PP() ? [poss(0), poss(1)] : ['Your','AI'])}${banner}</div>
    ${tail}
  </div>
  <details class="panel" id="chron-panel" ${ui.chronOpen ? 'open' : ''}><summary><h2>Chronicle</h2><span class="note">Every step written out</span></summary>${chronHTML(res.frames, ui.frame)}</details>`;
}
