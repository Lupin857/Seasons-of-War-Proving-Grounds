/* ===================== SHOP MOVES =====================
   Every way of playing makes the same shop moves: ['b', src, idx, masonTarget, writUnits] buy, ['s', kind, name] sell,
   ['p'] pass, ['m', kind] Black Market. Online play sends them with card names as numbers (netEncode/netDecode). */
const netEncode = a => a[0] === 'b' ? ['b', a[1], a[2], a[3] == null ? null : netIx(a[3])].concat(Array.isArray(a[4]) ? [a[4].map(netIx)] : []) : a[0] === 's' ? ['s', a[1], netIx(a[2])] : a;
const netDecode = a => a[0] === 'b' ? ['b', a[1], a[2], a[3] == null ? null : netName(a[3])].concat(Array.isArray(a[4]) ? [a[4].map(netName)] : []) : a[0] === 's' ? ['s', a[1], netName(a[2])] : a;
function applyMove(i, a){
  switch (a[0]){
    case 'b': return buy(G, i, a[1], a[2], a[3] == null ? undefined : a[3], Array.isArray(a[4]) ? a[4] : undefined, a[5]);
    case 's': return sell(G, i, a[1], a[2]);
    case 'p': return pass(G, i);
    case 'm': return useBM(G, i, a[1]);
    case 'v': return useVision(G, i, a[1]);
    case 'f': return useFavor(G, i);
    case 'z': return useDisc(G, i, !!a[1]);
    case 'i': return useFreeze(G, i, a[1], a[2]);
    case 'r': return useRedeal(G, i);
    case 'a': return altarPick(G, i, a[1]);
    case 'raid-transfer': return raidTransfer(G, i, a[1], a[2]);
    case 'raid-siege': return raidBuySiege(G, i);
  }
  return false;
}
// Upheaval: the old display flies to the discard pile and a new one is dealt (the round's ghosts belonged to the old one)
function redealSeen(){ ui.ghosts = {round:G.round, u:[], b:[]}; ui.dealt = -1; }
// The ghosts a player's shop moves leave, read from the log (each buy and Freeze names the spot its card sat in).
// A spot a refill (or Restock) filled again shows the new card instead: marketRow only draws ghosts in empty spots.
function ghostsFrom(i, n0){
  for (const l of G.log.slice(n0)){
    const ev = l.ev; if (!ev || l.side !== i || ev.at == null) continue;
    if (ev.a === 'buy' && (ev.src === 'du' || ev.src === 'db')) addGhost(ev.k, ev.at, ev.n, ev.price, i);
    else if (ev.a === 'freeze') addGhost(ev.k, ev.at, ev.n, 0, i, true);
  }
}
// the faded "bought" card a market buy leaves behind for the rest of the round
function addGhost(k, idx, name, price, who, frz){
  if (!ui.ghosts || ui.ghosts.round !== G.round) ui.ghosts = {round:G.round, u:[], b:[]};
  ui.ghosts[k].push(frz ? {idx, name, price, who, frz:true} : {idx, name, price, who});
}
const MOVE_SOUND = {i:() => sfx.rustle(), b:v => sfx.coin(v), s:() => sfx.sell(), m:() => sfx.rustle(), v:() => sfx.rustle(), f:() => sfx.rustle(), z:() => sfx.rustle(), r:() => sfx.rustle(), a:() => sfx.sell(), p:() => sfx.wood(), 'raid-transfer':() => sfx.pick(), 'raid-siege':v => sfx.coin(v)};
// Make a shop move for player i, plus what the screen does around it: the ghost card and a sound.
// vol: how loud a successful move sounds (null: silent); own: a failed move is this screen's player's, so it buzzes.
function shopMove(i, a, vol, own){
  const n0 = G.log.length;
  const ok = applyMove(i, a);
  if (ok && a[0] === 'r') redealSeen();
  if (ok) ghostsFrom(i, n0);
  if (vol != null){
    if (ok && !((a[0] === 'b' || a[0] === 's') && shopCoinEnabled())) MOVE_SOUND[a[0]](vol);
    else if (!ok && own) sfx.err();
  }
  return ok;
}
// The player at this screen makes a shop move: online it goes to the room (and comes back through netPump);
// otherwise it happens here, and a bought card flies to its new owner.
// Named playerMove (not doMove): the engine's doMove(g, j, m) shares the page's global scope, and a second
// function with the same name silently replaced it, so the AI's main-thread search sent its trial moves here.
function playerMove(a){
  if (raidBuyPrompt(a)) return;
  if (G.net){ netDo(netEncode(a)); return; }
  const S = seat(), n0 = G.log.length;
  snapNow();
  const ok = shopMove(S, a, 1, true);
  if (ok) motionFrom(S, n0);   // its flights start with the redraw below
  if (G.raid && cur(G) !== S) ui.raidPile = null;
  if (a[0] === 'raid-transfer' && ok){ ui.raidPile = a[2]; ui.raidTransferError = ''; }
  if (a[0] === 'b' || a[0] === 'p' || a[0] === 'i' || a[0] === 'raid-siege') afterAction({purchase:ok && a[0] === 'b'}); else renderPlay();
}
// apply every move both players have made that this page hasn't applied yet
function netPump(){
  if (!NET || !NET.started || !G) return;
  const motion = [], toasts = [];
  let snapped = false;
  let changed = false;
  for (let guard = 0; guard < 2000; guard++){
    if (G.over || NET.err) break;
    if (NET.needShop){
      const pending = [0, 1].some(i => actsOf(i).length > NET.applied[i]);
      if (NET.live && ui.battle && !pending) break;   // wait until you've seen the battle (or your friend moves on)
      shopCoinStart(G); NET.needShop = false; changed = true; continue;
    }
    if (G.phase === 'shop'){
      const i = cur(G), a = actsOf(i)[NET.applied[i]]; if (!a) break;
      if (a[0] === 'd'){ NET.err = 'The two games fell out of step. Leave the room and start a new one.'; break; }
      const live = NET.live && !ui.battle;
      if (live && !snapped){ snapNow(); snapped = true; }   // the screen doesn't change until the redraw below
      const n0 = G.log.length;
      const ok = shopMove(i, netDecode(a), NET.live ? (i === NET.seat ? 1 : 0.45) : null, i === NET.seat); NET.applied[i]++; changed = true;
      if (NET.live){
        if (ok && live) motion.push({i, n0});
        if (i !== NET.seat) toasts.push(...G.log.slice(n0).filter(l => l.side === i && !(l.ev && (l.ev.a === 'buy' || l.ev.a === 'sell'))).map(l => l.t));
      }
    } else if (G.phase === 'mobilize'){
      const a0 = actsOf(0)[NET.applied[0]], a1 = actsOf(1)[NET.applied[1]];
      if (!a0 || !a1) break;
      if (a0[0] !== 'd' || a1[0] !== 'd'){ NET.err = 'The two games fell out of step. Leave the room and start a new one.'; break; }
      const specs = [a0, a1].map((a, i) => {
        const spec = (Array.isArray(a[1]) ? a[1] : []).map(u => ({name:netName(u[0]), arm:+u[1] || 0, tr:+u[2] || 0, sh:+u[3] || 0, gear:u[4] != null ? netName(u[4]) : null}));
        return spec.some(u => !DEFS[u.name] && !isBat(u.name)) || validateDeck(G, i, spec) ? [] : spec;
      });
      const res = playBattle(specs[0], specs[1]); NET.applied[0]++; NET.applied[1]++; changed = true;
      if (NET.live){ stopAuto(); stopAnim(); showBattle(res); ui.bannerOff = false; ui.remind = null; NET.battleNew = true; }
      else ui.lastNetBattle = res;
      if (!G.over) NET.needShop = true;
    } else break;
  }
  if (!changed && !NET.err) return;
  if (!NET.live) return;
  // queued before the redraw, so its turn banner waits for them (your own buys don't fly once a battle has started)
  for (const m of motion) if (m.i !== NET.seat || !NET.battleNew) motionFrom(m.i, m.n0);
  renderPlay();
  if (NET.battleNew){ NET.battleNew = false; toGame(); startAuto(); }
  if (toasts.length) showToast(toasts.join(' '));
}
// after any change: make sure a deck draft exists when it's time to mobilize, then draw
function netAfter(){
  // Only the host decides the outcome, after applying any available moves. A guest can resign out of turn.
  if (G?.net && NET?.started && !NET.err){
    if (!G.over && NET.seat === 0 && NET.resignedSeat == null && (NET.resignRequested || NET.peerResignRequested)){
      NET.resignedSeat = NET.resignRequested ? 0 : 1;
      netSave();
    }
    if (NET.resignedSeat != null && G.resignedBy == null){
      finishResignedMatch(NET.resignedSeat);
      if (NET.seat === 0) netPresence();
    }
  }
  if (G && G.net && NET && G.phase === 'mobilize' && !ui.battle && !ui.draft && NET.acts.length === NET.applied[NET.seat]) ui.draft = netClone(defaultDraft);
  renderPlay();
}
function netDo(a){
  if (!NET || !G || !G.net || G.over || NET.err || NET.resignRequested) return;
  const S = NET.seat, caught = NET.acts.length === NET.applied[S];
  if (!caught) return;
  if (a[0] === 'd' ? G.phase !== 'mobilize' : (G.phase !== 'shop' || cur(G) !== S || ui.battle)) return;
  NET.acts.push(a); netSave(); netPresence(); netPump(); netAfter();
}
function netNoticeHTML(){
  if (!G || !G.net || !NET) return '';
  if (NET.err) return `<div class="finalbox"><p class="err">${esc(NET.err)}</p><div class="row"><button type="button" data-act="st-net-leave">Leave room</button></div></div>`;
  if (!NET.here && !G.over) return `<p class="turn ai">${esc(nm(1 - NET.seat))} isn't in the room right now. Your moves are saved; the game carries on when they come back (they rejoin from Play online on the start screen).</p>`;
  return '';
}
const SITE = 'https://lupin857.github.io/Seasons-of-War-Proving-Grounds/';
function netInvite(){ return `Play Seasons of War with me! ${SITE}?room=${NET.code} (room ${NET.code})`; }
const URL_ROOM = (() => { try{ const c = new URLSearchParams(location.search).get('room'); return c && /^[a-z0-9]{6}$/.test(c) ? c : ''; }catch(e){ return ''; } })();
// the host's rules for an online game, as lines that differ from Default
function netRulesLines(names){
  const n = NET; if (!n) return [];
  const su = n.su || suDefault();
  return suLines({...suDefault(), ...su, pl:su.pl || suDefault().pl}, n.target, {mir:n.mir !== false, bmir:n.mir !== false && n.bmir === true, rf:n.rf === true}, names);
}
function netRulesHTML(names){
  const L = netRulesLines(names);
  return `<div class="sulobby"><span class="eyebrow">Rules · first to ${NET.target || 3}</span>${L.length ? `<ul>${L.map(l => `<li>${l}</li>`).join('')}</ul>` : `<p class="note">Default rules.</p>`}</div>`;
}
function netLobbyHTML(){
  const n = NET, waitLong = Date.now() - n.since > 6500;
  let body;
  if (n.err) body = `<p class="err">${esc(n.err)}</p>`;
  else if (n.seat === 0 && n.here && n.peer) body = `
      <span class="eyebrow">Room code</span><span class="roomcode">${esc(n.code)}</span>
      <p class="turn ai">${esc(n.peer.name)} joined and is looking over the rules. The game starts when they tap Ready.</p>
      ${netRulesHTML([n.name, n.peer.name])}`;
  else if (n.seat === 1 && n.peer && !n.ready) body = `
      <span class="eyebrow">Room code</span><span class="roomcode">${esc(n.code)}</span>
      <p class="note">${esc(n.peer.name)} set up this game. Tap Ready when you've read the rules.</p>
      ${netRulesHTML([n.peer.name, n.name])}
      <div class="row"><button type="button" class="primary" data-act="st-net-ready">Ready</button></div>`;
  else if (n.seat === 0) body = `
      <span class="eyebrow">Room code</span><span class="roomcode">${esc(n.code)}</span>
      <p class="note">Send your friend the invite (it has a link that fills in the code). They open it, type their name and tap <b>Join</b>. They'll see your rules, and the game starts when they tap Ready.</p>
      <div class="row"><button type="button" class="primary" data-act="st-net-copy">Copy invite</button><span class="note" id="net-copied" role="status"></span></div>
      ${netRulesHTML([n.name, 'Friend'])}
      ${n.room && n.room.connected() ? `<p class="turn ai">Room open. Waiting for your friend to join…</p>`
        : `<p class="turn ai">${waitLong ? "Reopening your room… Keep this page open and in front while your friend joins (phones close the room when you switch away, and reopen it when you come back)." : 'Opening your room…'}</p>`}`;
  else {
    const lk = n.room && n.room.link ? n.room.link() : '';
    body = `<span class="eyebrow">Room code</span><span class="roomcode">${esc(n.code)}</span>
      <p class="turn ai">${lk === 'nolink' ? "Found the room, but your devices couldn't connect yet. Still trying… If it keeps failing, both of you reload the page, or one of you switch between Wi-Fi and cell data."
        : waitLong || lk === 'nohost' ? "No room is open with that code right now. Check the code, or ask your friend to go back to the game page (their room closes while they're in another app). This page keeps trying." : 'Joining…'}</p>`;
  }
  return `<div class="panel startp netlobby"><h2>Play online</h2>${body}<div class="row"><button type="button" data-act="st-net-leave">Leave</button></div></div>`;
}
function netStartHTML(){
  const saved = LS.get('sow-net'), nameV = esc(LS.get('sow-net-name') || (LS.get('sow-pp-names') || [])[0] || '');
  return `<div class="panel startp netstart">
      <h2>Play online</h2>
      <p class="note">Play a friend on their own device. Create a room and send them the code. Not rated, and it doesn't change the AI or the card stats.</p>
      ${ui.netErr ? `<p class="err">${esc(ui.netErr)}</p>` : ''}
      ${NET ? `<div class="row"><span class="note">You're in room <b class="mono">${esc(NET.code)}</b>.</span><button type="button" data-act="st-net-back">Back to it</button><button type="button" data-act="st-net-leave">Leave room</button></div>` : `
      <div class="row ppnames"><label class="ppn s0"><span class="eyebrow">Your name</span><input type="text" id="net-name" ${URL_ROOM ? 'autofocus ' : ''}maxlength="16" value="${nameV}" placeholder="Name"></label></div>
      <div class="row"><button type="button" class="primary" data-act="st-net-host">Create a room (first to ${LEN})</button></div>
      <div class="row"><input type="text" id="net-code" maxlength="6" placeholder="Room code" value="${esc(URL_ROOM)}" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:9em"><button type="button" data-act="st-net-join">Join a room</button></div>
      ${saved && saved.code ? `<div class="row"><button type="button" data-act="st-net-rejoin">Rejoin room ${esc(saved.code)}</button><span class="note">Your moves there are saved on this device.</span></div>` : ''}`}
      <details><summary class="note">How does it connect?</summary><p class="note">No accounts needed. Your two browsers connect directly to each other; the free PeerJS service only introduces them. If your networks block a direct link, the game goes through a relay server instead. Keep the page open while you play (the host's page holds the room). Both of you should have the same version of the page open, so reload if it was updated.</p></details>
    </div>`;
}
async function netStartClick(a, resign){
  const val = id => { const el = $(id); return el ? el.value.trim() : ''; };
  if (a === 'st-net-back'){ ui.start = false; renderPlay(); return; }
  if (a === 'st-net-ready'){ if (!NET) return; NET.ready = true; netSave(); netPresence(); if (NET.peer && !NET.started) netStart(); else renderPlay(); return; }
  if (a === 'st-net-leave'){ netLeave(); ui.start = !G; renderPlay(); return; }
  if (a === 'st-net-copy'){ try{ await navigator.clipboard.writeText(netInvite()); const c = $('net-copied'); if (c) c.textContent = 'Copied.'; }catch(e){ const c = $('net-copied'); if (c) c.textContent = netInvite(); } return; }
  const rejoin = a === 'st-net-rejoin', saved = LS.get('sow-net');
  const joinCode = a === 'st-net-join' ? val('net-code').toLowerCase().replace(/[^a-z0-9]/g, '') : null;
  if (rejoin && !saved) return;
  if (joinCode !== null && joinCode.length !== 6){ ui.netErr = 'Room codes are 6 letters and numbers.'; renderPlay(); return; }
  if (saved && (rejoin || joinCode === saved.code) && !(saved.v >= NET_MIN_SAVE_V && saved.v <= NET_V) && saved.acts?.length){
    ui.netErr = 'This saved room uses the previous shop rules. Create a new room to play with the current rules.';
    renderPlay();
    return;
  }
  if (resign && ui.resignArm !== 'net'){ ui.resignArm = 'net'; renderPlay(); return; }
  if (resign) recordResult(true);
  const name = (val('net-name') || 'Player').slice(0, 16); LS.set('sow-net-name', name);
  if (rejoin){ netLeave(); await netOpen({...saved, name:saved.name || name}); return; }
  if (a === 'st-net-host'){ netLeave(); await netOpen({code:netCode(), seat:0, name, seed:(Math.random() * 2147483647) | 0, target:gameTarget(), mir:MIRACLES_ON, bmir:MIRACLES_ON && BATTLE_MIR_ON, rf:REFILL_ON, su:setupForGame(), acts:[]}); return; }
  if (joinCode){ netLeave(); await netOpen({code:joinCode, seat:null, name, acts:[]}); }
}
function afterAction(options){
  if (G && G.net){ netAfter(); return; }
  if (PP()){
    if (G.phase === 'mobilize' && ui.handoff == null && !ui.draft && !ui.drafts[0] && !ui.drafts[1]){ ui.mobSeat = 0; ui.handoff = 0; const tt = $('toast'); if (tt) tt.hidden = true; }
    ui.lastTurn = G.phase === 'shop' ? cur(G) : null;
    renderPlay(); return;
  }
  renderPlay(options); scheduleAI();
}
function draftFromDeck(deck){ return deck.map(u => u.gear ? {name:u.name, arm:u.arm||0, tr:u.tr||0, sh:u.sh||0, gear:u.gear} : {name:u.name, arm:u.arm||0, tr:u.tr||0, sh:u.sh||0}); }
// gear still in hand for this draft (one entry per piece left)
function gearLeft(me, d){
  const left = {...(me.gear || {})};
  for (const u of d || []) if (u.gear && left[u.gear] > 0) left[u.gear]--;
  return left;
}
// put back the gear each unit wore last battle (only what's still in hand), so equipping carries over
function reEquip(me, d){
  const left = {...(me.gear || {})};
  for (const u of d) if (u.gear && left[u.gear] > 0) left[u.gear]--; else delete u.gear;
  for (const u of d){ const n = me.equip && me.equip[u.name]; if (!u.gear && n && left[n] > 0 && !(n === 'Zweihander' && (u.arm || u.sh))){ u.gear = n; left[n]--; } }
  return d;
}
function defaultDraft(deck){
  if (G.raid) return raidDraft();
  const S = seat(), me = G.players[S], last = PP() ? ui.lastDrafts[S] : ui.lastDraft;
  if (last){
    const keep = last.filter(u => u.name !== 'Recruit' && me.hand[u.name]).map(u => ({name:u.name, arm:0, tr:0}));
    for (const n of Object.keys(me.hand)){
      if (n === 'Recruit' || keep.some(k => k.name === n)) continue;
      const uniq = keep.filter(k => !exemptUnit(k.name)).length;
      if (exemptUnit(n) || uniq < deckCap(me)) keep.push({name:n, arm:0, tr:0});
    }
    return reEquip(me, keep);
  }
  return draftFromDeck((deck || aiMobilize(G, S, 24, DEPTH_HINT) || []).filter(u => !isBat(u.name)));   // your battle miracles stay on the bench
}
// While a battle is still playing out, the scoreboard shows the board as it was before the battle, so the score
// doesn't give the result away. It catches up once the last step is shown (or the battle is skipped to its end).
const hideResult = () => !!(ui.battle && !ui.revealed && ui.pre);
const boardSnap = () => ({tot:G.players.map(p => G.raid ? p.health : total(p)), money:G.players.map(p => p.money), inc:G.players.map(p => income(p)), cath:G.players.map(p => !!p.city.Cathedral)});
// the button that ends a battle (the dock and the battle panel)
function battleDoneLabel(){
  if (G.replay) return 'Back to your game';
  if (G.raid && G.raid.bout === 0) return 'Mobilize counterattack';
  return G.net ? (NET && NET.needShop ? `Go to round ${G.round + 1} shop` : `Go to round ${G.round} shop`) : `Go to round ${G.round + 1} shop`;
}
function phaseLabel(){
  if (G.replay) return 'Replay';   // a battle loaded from a battle code (js/ui/18-game-menu.js)
  if (ui.battle) return G.over && !hideResult() ? 'Game over' : G.raid ? (ui.battle.raid?.bout === 0 ? 'Opening attack' : 'Counterattack') : 'Battle';
  return {shop:'Shop', mobilize:'Mobilize', battle:'Battle', over:'Game over'}[G.phase];
}
// plain-text name for labels and attributes; deckLabel below is the visible (HTML) version
function deckName(i){ if (PP() && !G.net) return `${nm(i)}'s deck`; return i === seat() ? 'Your deck' : "Opponent's deck"; }
function deckLabel(i){
  if (PP() && !G.net) return `${esc(nm(i))}'s deck`;
  return i === seat() ? 'Your deck' : `<span class="lfull">Opponent's deck</span><span class="lshort">Enemy's deck</span>`;
}
// Unique units against the deck cap, and city slots against the city cap, under each player's deck (shop and mobilize only).
// Gold once a cap is reached: another unit type won't fit in the deck, or a new building needs a free slot.
function capsHTML(i, chip){
  chip = chip || '';
  if (ui.battle || G.over || (G.phase !== 'shop' && G.phase !== 'mobilize')) return chip;
  const p = G.players[i], u = uniqueUnits(i === seat() ? p : {...p, hand:pubHand(p)}), uc = deckCap(p), b = slotsUsed(p), bc = citySlots(p);
  const one = (n, c, w, t) => `<span class="meta caps" title="${t}"><b class="${n >= c ? 'full' : ''}">${n}/${c}</b> ${w}</span>`;
  // the turn chip rides on the City line (to its right; mirrored to the left on the enemy's box) to save a line
  return one(u, uc, 'Units', `Unique units owned; the deck holds ${uc}`) + `<span class="caprow">${one(b, bc, 'City', `City slots used; the city holds ${bc} (each Field takes a slot)`)}${chip}</span>`;
}
function boardHTML(where){
  if (G.raid) return '';
  const B = hideResult() ? ui.pre : boardSnap();
  const shopping = G.phase === 'shop' && !ui.battle && !G.over;
  const turnChip = i => !shopping ? '' : G.passed[i] ? '<span class="tchip passed">Passed</span>' : cur(G) === i ? `<span class="tchip now">${PP() && !G.net ? 'Shopping' : `<span class="tw">${i === seat() ? 'Your' : 'Their'} </span>turn`}</span>` : '';
  const deckBtn = i => `<button type="button" class="side ${VS(i) ? 'ai' : 'you'} deckbtn${ui.deckView === i ? ' on' : ''}${shopping && cur(G) === i && !G.passed[i] ? ' active' : ''}${shopping && G.passed[i] ? ' isout' : ''}" data-act="deck-open" data-p="${i}" aria-haspopup="dialog" aria-label="${esc(deckName(i))}: view cards">
      <span class="who"><span class="dkic" aria-hidden="true"><i></i><i></i></span>${deckLabel(i)}<span class="dkgo" aria-hidden="true">›</span></span>
      <span class="meta money">$${B.money[i]} · income $${B.inc[i]}</span>
      <span class="meta m3">${B.cath[i] ? 'Cathedral +1 point' : VS(i) === 0 ? 'Tap to view cards' : G.net ? `Online · room ${esc(NET ? NET.code : '')}` : PP() ? 'Pass and play' : G.opp?.difficulty != null ? `${BRACKETS[G.opp.difficulty]} · unrated` : G.opp ? `${esc(bracketOf(G.opp.rating).name)} · ${G.opp.rating}${G.opp.placement ? ' · placement' : G.opp.rated ? ' · rated' : ' · unrated'}` : 'Full strength · unrated'}</span>${capsHTML(i, turnChip(i))}</button>`;
  const L = VS(0), Rt = VS(1);   // you on the left
  return `<div class="board${where === 'dock' ? ' inDock' : ' topboard'}">
    ${deckBtn(L)}
    <div class="mid"><div class="sc">${B.tot[L]} – ${B.tot[Rt]}</div><div class="rd">Round ${G.round} · ${phaseLabel()} · first to ${G.target}</div></div>
    ${deckBtn(Rt)}
  </div>`;
}
// the cards each player owns (formerly "forces"), opened from the deck buttons on the scoreboard
function deckSheetHTML(){
  const i = ui.deckView; if (i !== 0 && i !== 1) return '';
  const S = seat(), mine = i === S, p = G.players[i];
  const canSell = mine && G.phase === 'shop' && !ui.battle && cur(G) === S && !G.passed[S];
  const body = mine ? forcesHTML(p, canSell, new Set((G.shopBought && G.shopBought[S]) || []))
                    : forcesHTML({...p, hand:pubHand(p)}, false, aiFresh(), true);
  const note = canSell ? '<p class="note">On your turn you can sell any card for $1, even one you just bought. Selling is free: it doesn\'t use a buy or end your turn.</p>'
    : !mine && G.phase === 'mobilize' && !ui.battle ? '<p class="note">Their deck order is secret.</p>' : '';
  const tabs = [VS(0), VS(1)].map(k => `<button type="button" role="tab" aria-selected="${k === i}" class="s${VS(k)}" data-act="deck-open" data-p="${k}">${deckLabel(k)}</button>`).join('');
  return {label:deckName(i), cls:`dsheet s${VS(i)}`, top:`<div class="dshead"><div class="dstabs" role="tablist">${tabs}</div></div>`,
    head:`<div class="dsbody forces">${note}${body}</div>`, foot:canSell ? 'Selling is free: it doesn\'t use a buy.' : 'Tap a card to read it in full.'};
}
function curveText(name, kind, own, noNext){
  if (kind === 'u'){
    if (name === 'Jester') return 'power ?/?/?';
    const p = DEFS[name].p, L = own ? uLvl(name, own) : 0, nx = !noNext && L < p.length ? L + 1 : 0;
    return 'power ' + p.map((v, k) => `<span class="lv${k === L-1 ? ' now' : k === nx-1 ? ' next' : ''}">${v}</span>`).join('/');
  }
  if (isGear(name)) return 'gear';
  return '';
}
// card text with the owned level lit inside every value that changes by level (like 1/2/3 or $1/$1/$2)
function cardTx(name, kind, own, noNext){
  const d = kind === 'u' ? DEFS[name] : BDEFS[name], t = esc(d.t);
  const n = kind === 'u' ? (d.p || []).length : (d.lv || []).length;
  const L = !own ? 0 : kind === 'u' ? uLvl(name, own) : Math.min(own, n), nx = !noNext && L < n ? L + 1 : 0;
  if (n < 2) return t;
  return t.replace(/\$?\d+(?:\/\$?\d+)+/g, m => m.split('/').map((v, k) => `<span class="lv${k === L-1 ? ' now' : k === nx-1 ? ' next' : ''}">${v}</span>`).join('/'));
}
// extra copies you own, drawn as plain cards tucked behind the card (up and to the right), like tokens in battle
function copyStyle(extra, kind){
  const n = Math.max(0, Math.min(3, extra)); if (!n) return '';
  const sh = [`inset 0 3px 0 var(${kind === 'b' ? '--or' : '--muted'})`];
  for (let j = 1; j <= n; j++) sh.push(`${6*j}px ${-5*j}px 0 -1px var(--bg)`, `${6*j}px ${-5*j}px 0 0 color-mix(in srgb, var(--muted) 75%, transparent)`);
  return ` style="box-shadow:${sh.join(',')};margin-right:${6*n}px;margin-top:${5*n}px" title="${extra} extra cop${extra > 1 ? 'ies' : 'y'} behind it"`;
}
// only cards with levels stack; cards without levels (Fields, Recruits, single-level cards) are each their own card
const hasLevels = (n, kind) => kind === 'u' ? uMax(n) > 1 : n !== 'Field' && ((BDEFS[n] || {}).lv || []).length > 1;
const extraCopies = (n, kind, c) => hasLevels(n, kind) ? Math.max(0, c - 1) : 0;
const asCards = (entries, kind) => entries.flatMap(([n, c]) => hasLevels(n, kind) ? [[n, c]] : Array.from({length:c}, () => [n, 1]));
// what one more copy gets you, shown only when you already own the card
function jumpText(name, kind, own){
  if (!own) return '';
  if (kind === 'u'){
    if (exemptUnit(name)) return '';
    const L = uLvl(name, own); if (L >= uMax(name)) return '';
    return name === 'Jester' ? `Buy → Lv ${L+1}` : `Buy → Lv ${L+1}, ${DEFS[name].p[L]} pwr`;
  }
  if (name === 'Field' || name === "Mason's Guild") return '';
  const n = BDEFS[name].lv.length; return own < n ? `Buy → Lv ${own+1}` : '';
}
// Popup text for a miracle: it's understood that you get it by buying the card on top and that a hand miracle is
// discarded when played, so the popup says only when it works (a Now or Hand chip) and what it does
const MIR_BRIEF = {
  cash:v => `Get $${v} back.`,
  rec: v => `Mobilize: Discard this to gain ${v} Recruit${v === 1 ? '' : 's'}.`,
  arm: v => `Mobilize: Discard this to gain ${v} Armament${v === 1 ? '' : 's'}.`,
  tr:  v => `Mobilize: Discard this to gain ${v} Training token${v === 1 ? '' : 's'}.`,
  writ:v => `Send ${v === 1 ? 'up to 1 other display card' : `up to ${v} other display cards`} to the discard pile (new cards replace them). Then shop again.`,
  vis: v => `Shop: Discard this to look at the top ${v} cards of either deck and buy one at normal price.`,
  disc:v => `Shop: Discard this so your next card costs $${v} less.`,
  fav: v => `Shop: Discard this for ${v === 1 ? '1 extra buy' : v + ' extra buys'} at normal price.`,
  frz: v => 'Shop: Discard this as your turn to set aside a display card and any miracles under it. Its spot stays empty. You may buy it at normal price on any later shop turn, even in a later round.',
  cov: v => `Deal ${v === 1 ? 'one more card' : v + ' more cards'} from the same deck on top of this. ${v === 1 ? 'Both cards are' : 'All the cards are'} bought together for their combined price.`,
  mill:v => `Send the top ${v} units of the unit deck to the discard pile.`,
  rst: v => `Deal ${v === 1 ? 'a card' : v + ' cards'} from the same deck into the shop display.`,
  rdl: v => 'Shop: Discard this to send every display card to the discard pile (miracles under them are discarded), then deal new cards until the display is full.',
};
const mirNow = n => ['cash', 'writ', 'cov', 'mill', 'rst'].includes(MIR_FX[n]);
function mirBrief(n){ if (isBat(n)) return 'Battle: ' + batFx(n); const k = MIR_FX[n]; return k && MIR_BRIEF[k] ? MIR_BRIEF[k](MIRS[n][k]) : MIRS[n].t; }
function mirSealHTML(n, tight){
  const m = MIRS[n];
  return `<span class="mirseal" title="${esc(n)}: ${esc(m.t)}"><span class="mtop"><b>✶ ${esc(n)}</b>${m.s ? `<span class="sur">+${'$'.repeat(m.s)}</span>` : ''}</span>${tight ? '' : `<span class="mtx">${mirNow(n) ? '<span class="mwhen now">Now</span> ' : ''}${esc(mirBrief(n)).replace(/^(Mobilize|Shop|Battle):/, '<b class="mphase">$1:</b>')}</span>`}</span>`;
}
// Short rules text for phone card previews, generated from each card's full text.
// Numbers are kept from the full text, so balance changes carry over. Unknown wording falls back to the first 40 characters.
const SHORT_N = '(\\$?\\d+(?:/\\$?\\d+)*)';
const SHORT_FIX = {
  'Pigeon Hunter':'Enemy units’ abilities Silenced',
  'Assassin':'I attack enemy revealed instead of their charger',
  'Pikeman':'Vs a stronger charger: +3/4/5 dmg',
  'Studious Squire':'Revealed: ally ahead attacks → +1/2/2 ⟨arm⟩',
  'Grave-Robber':'Revealed: a unit is defeated → I take its ⟨arm⟩',
  'Aging Master':'Attack: revealed +1/2/2 ⟨arm⟩',
  'Cowardly Squire':'Defeat: a ⟨rec⟩ takes my place, keeps tokens & gear',
  'Royal Watchman':'Charge: vs a stronger charger +1/2/3 ⟨sh⟩',
  'Sleepy Guard':'Revealed: ally ahead defeated → +2/3/3 ⟨arm⟩',
  'Monk':'Charge: weaker revealed + ⟨arm⟩ = power difference',
  'Infirmary':'First unit defeated → deck bottom, no damage',
  'Knight':'Charge: +3 ⟨arm⟩', 'Fencer':'Before I attack: discard enemy charger’s ⟨arm⟩',
  'Halberd Knight':'Reveal: 3/4/5 Shieldbreak dmg → enemy ahead; me to deck back',
  'Dowser Oracle':'Reveal: your charger +1/2/3 ⟨sh⟩', 'Study':'Mob: +1/2 ⟨tr⟩ in deck',
  'Marksman':'Revealed: I also hit enemy revealed (else charger)',
  'Slinger':'Reveal: 1/2/3 dmg → enemy revealed (else charger)',
  'Executioner':'My damage is Lethal',
  'Lancer':'My attacks have Overrun',
  'War College':'Shop: buy discard-pile duplicates free (uses a buy)',
  'Black Market':'Shop: peek 3/4/5 of one deck; one $1/$2/$3 off; discard rest',
  'The Bazaar':'Shop: +$1 per sale',
  'Altar of Blood':'+$4 income; lose your priciest unit each shop',
  'War Banner':'Unit ahead +2 power', 'Healing Balm':'Survives an attack → −2 of its dmg', 'War Horn':'Charge: trigger revealed unit’s Reveal',
  'Zweihander':'+2 power; no ⟨arm⟩ or ⟨sh⟩', 'Battle Axe':'+1 power; Shield-break', 'Poison Oil':'Lethal damage',
  'Lance':'+1 power; attacks Overrun', 'Heirloom Blade':'+2 power; defeated → next unit without gear', 'War Drums':'Reveal: trigger charger’s Charge',
  'Jester':'Reveal: become a copy of the unit ahead of me',
  'Barber-Surgeon':'Revealed: once, charger would be defeated → deck back',
  'Strong Villager':'', 'Bazaar':''
};
const SHORT_RULES = [
  // whole-sentence rewrites first
  [new RegExp(`^Shop: if you own a Field, your income is ${SHORT_N} higher\\.$`), 'Shop: own a Field? +$1 income.'],
  [/^Shop: your income is \$1 lower\.$/, 'Shop: −$1 income.'],
  [/^Doesn't count toward your unit limit\. Discarded after the battle phase\.$/, 'Free unit slot. Discard after battle.'],
  [/^Token\. 1 power\. Discarded after the battle phase\.$/, 'Token. Discard after battle.'],
  [new RegExp(`^I take ${SHORT_N} less damage from all sources\\.$`), 'Take −$1 dmg'],
  [/^\+\$1 income\. Each Field takes its own city slot\.$/, '+$1 income.'],
  [/^\+1 point while you own it\. You must win a battle to reach the winning score\.$/, '+1 point. Your last point must be a battle win.'],
  [/^When you buy this, attach it to another building to level that building up\.$/, 'On buy: another building +1 level.'],
  [/^Once per battle, when your Vanguard would die, put it on the bottom of your deck with no damage instead\.$/, 'Once: Vanguard would die? To deck bottom, healed.'],
  [new RegExp(`^Shop: once per shop, look at the top ${SHORT_N} cards of the unit deck or the building deck \\(not both\\)\\. You may buy one of them for ${SHORT_N} less\\.$`), 'Shop: peek $1 units or bldgs; one $2 off.'],
  [new RegExp(`^Shop: you may make ${SHORT_N} extra buys of any kind each shop\\. Buildings cost \\$1 less \\(minimum \\$1\\)\\.$`), 'Shop: +$1 buys. Buildings $$1 off.'],
  [new RegExp(`^Shop: cards with miracles under them cost ${SHORT_N} less \\(minimum \\$0\\)\\.$`), 'Shop: cards with ✶ $1 off.'],
  [new RegExp(`^Shop: duplicates you buy from the discard pile cost ${SHORT_N} less \\(minimum \\$0\\)\\.$`), 'Shop: Discard copies $1 off.'],
  [/^Overrun: excess damage hits the enemy revealed unit\.$/, 'Overrun: extra dmg hits enemy revealed.'],
  [/^While Revealed: when your charging unit attacks, I also attack the enemy revealed unit\. It doesn't hit back\.$/, 'Revealed: I also hit their revealed unit.'],
  [new RegExp(`take ${SHORT_N} Armaments from the enemy graveyard, then yours, newest first`), '+$1 ⟨arm⟩ from the graveyards'],
  // trigger words
  [/^On My Death:/, 'Death:'], [/^While Charging:/, 'Charging:'], [/^While Revealed:/, 'Revealed:'], [/^Mobilize:/, 'Mob:'],
  [/^Battle start:/, 'Start:'], [/^Reveal and Charge:/, 'Reveal & Charge:'], [/^Reveal \(before Charges\):/, 'Reveal first:'],
  // conditions up front
  [/^([^:]+): if I am the (Rearguard|Vanguard), /, '$1 · $2: '],
  [/^([^:]+): if I am in your deck, /, '$1 · in deck: '],
  [/if the enemy charging unit has more power, /, 'vs a stronger charger, '],
  [/when I kill the enemy charging unit, /, 'on a kill, '],
  [/once per battle, /, 'once, '],
  [/when the ally ahead attacks, gain /, 'ally ahead attacks → gain '],
  // targets
  [/the enemy charging and revealed units/g, 'enemy charger & revealed'],
  [/the enemy charging unit/g, 'enemy charger'], [/the enemy revealed unit/g, 'enemy revealed'],
  [/the enemy unit ahead of me/g, 'enemy ahead'], [/the allied unit ahead of me/g, 'ally ahead'], [/the ally ahead/g, 'ally ahead'],
  [/the unit ahead of me/g, 'unit ahead'], [/the unit behind me/g, 'unit behind'],
  [/your other charging or revealed unit/g, 'your other charger or revealed'], [/your charging unit/g, 'your charger'],
  [/the enemy Vanguard/g, 'enemy Vanguard'], [/to your units/g, 'to your units'],
  // effects
  [new RegExp(`my attacks deal \\+${SHORT_N}`), '+$1 dmg'],
  [new RegExp(`deal ${SHORT_N}(?: damage)? with overrun and Shield-break to`, 'g'), '$1 dmg (overrun, Shield-break) →'],
  [new RegExp(`deal ${SHORT_N}(?: damage)? with Shield-break to`, 'g'), '$1 dmg (Shield-break) →'],
  [new RegExp(`deal ${SHORT_N}(?: damage)? with overrun to`, 'g'), '$1 dmg (overrun) →'],
  [new RegExp(`deal ${SHORT_N}(?: damage)? to`, 'g'), '$1 dmg →'],
  [/before I attack, take 1 Armament from/, 'steal 1 ⟨arm⟩ from'],
  [new RegExp(`gains? ${SHORT_N} Armaments?`, 'g'), '+$1 ⟨arm⟩'],
  [new RegExp(`(attach|add) ${SHORT_N} Armaments? to`, 'g'), '+$2 ⟨arm⟩ to'],
  [new RegExp(`attach ${SHORT_N} Shields? to`, 'g'), '+$1 ⟨sh⟩ to'],
  [new RegExp(`gains? (?:a|${SHORT_N}) Shields?`, 'g'), (m, n) => `+${n || 1} ⟨sh⟩`],
  [new RegExp(`place ${SHORT_N} Recruits on top of your deck`), '+$1 ⟨rec⟩ on top of deck'],
  [new RegExp(`add ${SHORT_N} Recruits to your deck`), '+$1 ⟨rec⟩ in deck'],
  [/replace me with a Recruit/, 'I become a ⟨rec⟩'],
  [new RegExp(`add ${SHORT_N} Training tokens to your army`), '+$1 ⟨tr⟩ for your army'],
  [new RegExp(`train your Vanguard ${SHORT_N} times, then it gains an Armament`), 'Vanguard +$1 ⟨tr⟩ +1 ⟨arm⟩'],
  [new RegExp(`train your Vanguard ${SHORT_N} times`), 'Vanguard +$1 ⟨tr⟩'],
  [/\btrain /g, '⟨tr⟩ '],
  [new RegExp(`your deck holds ${SHORT_N} more unique units`), '+$1 unique units in deck'],
  [new RegExp(`gain ${SHORT_N} per Field in the enemy city`), 'gain $1 per enemy Field'],
  [/Armaments?/g, '⟨arm⟩'], [/Shields?/g, '⟨sh⟩'], [/Recruits?/g, '⟨rec⟩'],
  [/\.$/, '']
];
function shortRaw(name, t){
  if (name in SHORT_FIX) return SHORT_FIX[name];
  let s = String(t || '');
  for (const [re, to] of SHORT_RULES) s = s.replace(re, to);
  if (s.replace(/⟨\w+⟩/g, 'X').length > 60) s = String(t).slice(0, 40).trimEnd() + '…';   // wording the rules don't know
  return s;
}
// Token icons drawn as small pictures (they render the same on every phone): crossed hammers for an Armament,
// an open book for Training, a shield for a Shield, a little soldier for a Recruit.
const GI = {
  arm:'<svg class="gi gi-arm" viewBox="0 0 16 16" aria-label="Armament" role="img"><g transform="rotate(-40 8 8)"><rect x="7.15" y="5" width="1.7" height="10.2" rx=".7"/><rect x="4.2" y="1.4" width="7.6" height="4" rx=".9"/></g><g transform="rotate(40 8 8)"><rect x="7.15" y="5" width="1.7" height="10.2" rx=".7"/><rect x="4.2" y="1.4" width="7.6" height="4" rx=".9"/></g></svg>',
  tr:'<svg class="gi gi-tr" viewBox="0 0 16 16" aria-label="Training" role="img"><path d="M8 4.2C6.2 2.8 3.8 2.5 1.2 3.1v9.8c2.6-.6 5-.3 6.8 1.1 1.8-1.4 4.2-1.7 6.8-1.1V3.1C12.2 2.5 9.8 2.8 8 4.2z"/><path d="M8 4.6v8.9" stroke="var(--bg)" stroke-width="1.1" fill="none"/></svg>',
  sh:'<svg class="gi gi-sh" viewBox="0 0 16 16" aria-label="Shield" role="img"><path d="M8 1.2l5.8 2.1v4.3c0 3.5-2.4 6.1-5.8 7.3-3.4-1.2-5.8-3.8-5.8-7.3V3.3z"/><path d="M8 3.2v9.6" stroke="var(--bg)" stroke-width="1" fill="none" opacity=".55"/></svg>',
  rec:'<svg class="gi gi-rec" viewBox="0 0 16 16" aria-label="Recruit" role="img"><circle cx="8" cy="4.6" r="2.7"/><path d="M5.2 3.6c.4-1.9 1.5-2.6 2.8-2.6s2.4.7 2.8 2.6z" opacity=".6"/><path d="M2.8 15c0-4 2.2-6 5.2-6s5.2 2 5.2 6z"/></svg>'
};
// a token's custom icon wherever a token is drawn (never an emoji)
const tokIcon = k => GI[k] || '';
// the preview line for a card, with the owned level lit inside each 1/2/3 the same way the full text does it
function shortHTML(name, kind, own, noNext){
  const d = kind === 'u' ? DEFS[name] : BDEFS[name]; if (!d) return '';
  const raw = shortRaw(name, d.t); if (!raw) return '';
  const n = kind === 'u' ? (d.p || []).length : (d.lv || []).length;
  const L = !own ? 0 : kind === 'u' ? uLvl(name, own) : Math.min(own, n), nx = !noNext && L < n ? L + 1 : 0;
  let h = esc(raw);
  if (n > 1) h = h.replace(/\$?\d+(?:\/\$?\d+)+/g, m => m.split('/').map((v, k) => `<span class="lv${k === L-1 ? ' now' : k === nx-1 ? ' next' : ''}">${v}</span>`).join('/'));
  return `<span class="stx">${h.replace(/⟨(\w+)⟩/g, (m, k) => GI[k] || m)}</span>`;
}
const HG_SVG = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.5 1.5h9v1.2h-1v1.6c0 1.5-1 2.6-2.3 3.7 1.3 1.1 2.3 2.2 2.3 3.7v1.6h1v1.2h-9v-1.2h1v-1.6c0-1.5 1-2.6 2.3-3.7C5.5 6.9 4.5 5.8 4.5 4.3V2.7h-1zm2.2 1.2v1.6c0 1 .7 1.8 2.3 3.1 1.6-1.3 2.3-2.1 2.3-3.1V2.7zM8 9.2c-1.6 1.3-2.3 2.1-2.3 3.1v1h4.6v-1c0-1-.7-1.8-2.3-3.1z"/></svg>';
// a returning card wears an hourglass token on its corner: unbought again this shop, it goes to the discard pile
const hgToken = () => `<span class="hgtok" role="img" title="Returning card: if nobody buys it this shop, it goes to the discard pile" aria-label="Returning card: if nobody buys it this shop, it goes to the discard pile">${HG_SVG}</span>`;
// Discard Writ targeting in progress: {n, sel, src, idx, name, price}, or null when there's nothing to pick
function writMode(){
  if (!ui.writ || !G || G.phase !== 'shop' || cur(G) !== seat()) return null;
  const w = ui.writ, n = mirOf(G, w).reduce((s, m) => s + (MIRS[m].writ || 0), 0); if (!n) return null;
  const c = sourceCard(G, seat(), w.src, w.idx); if (!c) return null;
  const info = buyInfo(G, seat(), c.name, c.kind, w.src, w.idx); if (!info.ok) return null;
  return {n, sel:w.sel, src:w.src, idx:w.idx, name:c.name, price:info.price};
}
// Freeze targeting in progress: true while you pick the display card to set aside
function freezeMode(){
  if (!ui.freeze || !G || !canFreeze(G, seat())) { if (ui.freeze) ui.freeze = null; return false; }
  return true;
}
// Mason's Guild targeting in progress: {src, idx, sel, price}, or null when not picking
function masonMode(){
  if (!ui.mason || !G || G.phase !== 'shop' || cur(G) !== seat()) return null;
  const m = ui.mason, c = sourceCard(G, seat(), m.src, m.idx); if (!c || c.name !== "Mason's Guild") return null;
  const info = buyInfo(G, seat(), c.name, c.kind, m.src, m.idx); if (!info.ok) return null;
  const sel = m.sel && masonTargets(G.players[seat()]).includes(m.sel) ? m.sel : null;
  return {src:m.src, idx:m.idx, sel, price:info.price};
}
// the confirm and cancel buttons while picking, pinned to the bottom corner so they never scroll away
function pickDockHTML(btns){
  return `<div class="pickdock" role="group" aria-label="Confirm or cancel">${btns}</div>`;
}
// the bar over the market while picking: what to do and what's picked (Buy / Cancel sit in the pinned corner dock)
function writBarHTML(){
  // Altar of Blood: units tied for most expensive; you pick which one loses a copy before shopping
  if (G && G.phase === 'shop' && cur(G) === seat() && altarWaiting(G, seat())){
    const me = G.players[seat()];
    const cards = G.altarPend[seat()].map(n => `<div class="mcard u writtgt" data-act="altar-pick" data-name="${esc(n)}" role="button" tabindex="0" aria-label="Discard one copy of ${esc(n)}">
        ${cardFace(n, 'u', me.hand[n])}<span class="writown" aria-hidden="true">×${me.hand[n]} → ×${me.hand[n] - 1}</span></div>`).join('');
    return `<div class="writbar" role="status"><span class="wbt"><b>Altar of Blood</b><br>Tap the unit that loses a copy.</span>
      <span class="note">These are tied for your most expensive unit. The copy goes to the discard pile.</span></div>
      <div class="masonrow"><span class="eyebrow">Your units</span><div class="market plain">${cards}</div></div>`;
  }
  if (freezeMode()) return `<div class="writbar" role="status">
    <span class="wbt"><b>✶ Freeze</b><br>Tap a card in the market to set it aside for you.</span>
    <span class="note">Its miracles go with it and its spot stays empty. This uses your turn.</span>
  </div>${pickDockHTML(`<button type="button" data-act="frz-cancel">Cancel</button>`)}`;
  const mm = ui.pkWin === 'mason' ? null : masonMode();
  if (mm){
    const me = G.players[seat()], own = Object.keys(me.city).filter(n => n !== 'Field' && me.city[n] > 0);
    const lvOf = n => Math.min(me.city[n], BDEFS[n].lv.length);
    const cards = own.map(n => { const L = lvOf(n), max = BDEFS[n].lv.length;
      if (L >= max) return `<div class="mcard b writoff" aria-disabled="true">${cardFace(n, 'b', me.city[n])}<span class="writown" aria-hidden="true">${max > 1 ? 'Max level' : 'No levels'}</span></div>`;
      const on = mm.sel === n, what = on ? 'Picked. Tap again to unpick it.' : `Tap to attach Mason's Guild here: Lv ${L} → ${L+1}.`;
      return `<div class="mcard b writtgt${on ? ' on' : ''}" data-act="mason-tog" data-name="${esc(n)}" role="button" tabindex="0" aria-pressed="${on}" title="${esc(what)}" aria-label="${esc(n)}. ${esc(what)}">
        ${cardFace(n, 'b', me.city[n])}
        <span class="writmark" aria-hidden="true">${on ? '✓ Attach here' : ''}</span><span class="writown" aria-hidden="true">Lv ${L} → ${L+1}</span>
      </div>`; }).join('');
    return `<div class="writbar" role="status">
      <span class="wbt"><b>✶ Mason's Guild</b> <span class="mono">${mm.sel ? 1 : 0}/1</span><br>Tap one of your buildings to attach it to.</span>
      <span class="note">${mm.sel ? `Attaching to ${esc(mm.sel)}: Lv ${lvOf(mm.sel)} → ${lvOf(mm.sel) + 1}.` : 'It counts as one more copy, raising that building a level.'}</span>
    </div>
    <div class="masonrow"><span class="eyebrow">Your buildings</span><div class="market plain">${cards}</div></div>
    ${pickDockHTML(`<button type="button" data-act="mason-cancel">Cancel</button><button type="button" class="primary" data-act="mason-go" ${mm.sel ? '' : 'disabled'}>${mm.sel ? `Buy $${mm.price}` : 'Pick a building'}</button>`)}`;
  }
  const wm = writMode(); if (!wm) return '';
  const picked = wm.sel.map(j => (G.disp[j[0] === 'b' ? 'b' : 'u'][+j.slice(1)] || {}).name).filter(Boolean);
  const upTo = wm.n === 1 ? 'up to 1 other card' : `up to ${wm.n} other cards`;
  return `<div class="writbar" role="status">
    <span class="wbt"><b>✶ Discard Writ</b> <span class="mono">${picked.length}/${wm.n}</span><br>Tap ${upTo} to send to the discard pile.</span>
    <span class="note">${picked.length ? `Moving ${picked.map(esc).join(' and ')}.` : 'Or pick none.'} Then you shop again.</span>
  </div>${pickDockHTML(`<button type="button" data-act="writ-cancel">Cancel</button><button type="button" class="primary" data-act="writ-go" data-src="${wm.src}" data-idx="${wm.idx}">Buy $${wm.price}</button>`)}`;
}
// every market card carries its key (data-ck), so animations follow the card itself (see CARD MOTION)
function marketCard(name, kind, src, idx, side, always, mir){ return tagCk(marketCard0(name, kind, src, idx, side, always, mir), cardKey(src, idx)); }
function marketCard0(name, kind, src, idx, side, always, mir){
  const S = seat(), me = G.players[S], myTurn = G.phase === 'shop' && cur(G) === S;
  const d = kind === 'u' ? DEFS[name] : BDEFS[name];
  const info = buyInfo(G, S, name, kind, src, idx);
  const own = kind === 'u' ? (me.hand[name] || 0) : (me.city[name] || 0);
  const hourglass = side && !(matDesk() && matShopOn()) ? hgToken() : '';
  let extra = '';
  // Discard Writ targeting: the card being bought is marked, every other display card is tapped to pick it, and
  // anything that can't be picked (Recruit, Field, the discard pile, Black Market, Vision) steps back
  const fm = freezeMode(), mm = fm ? null : masonMode(), wm = fm || mm ? null : writMode(), disp = src === 'du' || src === 'db';
  const wrole = fm ? (disp ? 'tgt' : 'off') : mm ? (mm.src === src && mm.idx === (idx ?? 0) ? 'src' : 'off') : !wm ? '' : disp && wm.src === src && wm.idx === (idx ?? 0) ? 'src' : disp ? 'tgt' : 'off';
  if (wrole === 'tgt' && fm){
    const what = 'Tap to set it aside for you.';
    const fcard = `<div class="mcard ${kind} writtgt${side ? ' leaving' : ''}" data-act="frz-pick" data-src="${src}" data-idx="${idx ?? 0}" role="button" tabindex="0" title="${esc(what)}" aria-label="${esc(name)}. ${esc(what)}">
    ${cardFace(name, kind, own)}
    ${hourglass}
  </div>`;
    return mirWrapHTML(name, kind, mir, fcard, pairOf(G, {src, idx:idx ?? 0}));
  }
  if (wrole === 'tgt'){
    const j = (src === 'db' ? 'b' : 'u') + (idx ?? 0), on = wm.sel.includes(j), full = !on && wm.sel.length >= wm.n;
    const oo = ownsCard(G.players[1 - S], name) ? (PP() || G.net ? `${esc(nm(1 - S))} owns one` : 'They own one') : ownsCard(me, name) ? 'You own one' : '';
    const what = on ? 'Picked for the discard pile. Tap again to keep it.' : full ? `You've picked ${wm.n}. Tap a picked card to swap.` : 'Tap to send it to the discard pile.';
    const tcard = `<div class="mcard ${kind} writtgt${on ? ' on' : ''}${full ? ' full' : ''}${side ? ' leaving' : ''}" data-act="writ-tog" data-j="${j}" role="button" tabindex="0" aria-pressed="${on}" title="${esc(what)}" aria-label="${esc(name)}. ${esc(what)}">
    ${cardFace(name, kind, own)}
    <span class="writmark" aria-hidden="true">${on ? '✓ To discard' : ''}</span>${oo ? `<span class="writown" aria-hidden="true">${oo}</span>` : ''}
    ${hourglass}
  </div>`;
    return mirWrapHTML(name, kind, mir, tcard, pairOf(G, {src, idx:idx ?? 0}));
  }
  const short = !info.ok && info.price != null && me.money < info.price;
  const jump = info.ok || short ? jumpText(name, kind, own) : '';
  const label = info.ok ? `Buy $${info.price}${info.slot === 'carp' ? ' (Carpenter)' : info.slot === 'fav' ? ' (Divine Favor)' : ''}${src === 'bm' ? ` ($${bmOff(me)} off)` : ''}${info.disc ? ` (${esc(info.disc)})` : ''}` : esc(whyNot(info, me));
  const pair = pairOf(G, {src, idx:idx ?? 0, who:S});
  const sur = mirSur(mir), hasMir = !!(mir && mir.length), mkey = `${src}:${idx}:${name}`;
  const card = `<div class="mcard ${kind}${wrole === 'src' ? ' writsrc' : wrole === 'off' ? ' writoff' : ''}${short ? ' cant' : ''}${info.ok && myTurn && !wrole ? ' canbuy' : ''}${jump ? ' lvup' : ''}${always ? ' always' : ''}${hasMir ? ' hasmir' : ''}${side ? ' leaving' : ''}${short || own ? ' hasst' : ''}"${hasMir ? ` data-act="mir-peek" data-k="${esc(mkey)}" title="${mir.length > 1 ? `${mir.length} miracles` : 'A miracle'} behind this card. Click to see." aria-label="${esc(name)}: ${mir.length > 1 ? `${mir.length} miracles` : 'a miracle'} behind it. Click to see." role="button" tabindex="0"` : ''}>
    ${cardFace(name, kind, own)}
    ${stampsHTML([short ? ['st-need', `Need $${info.price - me.money} more`] : null, always ? null : ownStamp(name, kind, own)])}
    ${extra}${wrole === 'src' ? `<span class="ctag">✶ Buying</span>` : info.ok && myTurn && !wrole ? `<span class="ctag">Buy $${info.price}</span>` : ''}
    <button type="button" class="${info.ok && myTurn && wrole !== 'off' ? 'primary' : ''}" data-act="buy" data-src="${src}" data-idx="${idx ?? ''}" ${info.ok && myTurn && wrole !== 'off' ? '' : 'disabled'}>${label}</button>
    ${hourglass}
    ${hasMir && ui.mirOpen === mkey ? mirListHTML(name, mir, 'mirpop').replace('<div class="mirpop">', `<div class="mirpop" data-act="mir-peek" data-k="${esc(mkey)}">`).replace('.</span></div>', '. Click to close.</span></div>') : ''}
  </div>`;
  return mirWrapHTML(name, kind, mir, card, pair);
}
// Covenant: the card(s) bought together with this one, named on the card
function pairTagHTML(pair, kind){
  if (!pair || !pair.length) return '';
  return `<span class="pairtag" title="Bought together with ${esc(pair.join(' and '))} (Covenant)">＋ ${pair.map(n => `${esc(n)} <span class="pc">$${((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c}</span>`).join(' ＋ ')}</span>`;
}
// a display card with miracles behind it: the gold backs peeking out, and the hover box (miracles plus any Covenant card)
function mirWrapHTML(name, kind, mir, card, pair){
  if (!(mir && mir.length)) return card;
  // stacked behind the card, nearest first: any Covenant card (name and price, it's bought too), then the miracles
  const stack = (pair || []).map(n => ({n, c:((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c})).concat(mir.slice(0, 3).map(m => ({m}))).slice(0, 4);
  const n = stack.length;
  const backs = stack.map((x, k) => x.m
    ? `<span class="mirback" style="--j:${k + 1}" aria-hidden="true"><span class="mt"><span class="mn">✶ ${esc(x.m)}</span>${MIRS[x.m].s ? `<span class="ms">+${'$'.repeat(MIRS[x.m].s)}</span>` : ''}</span></span>`
    : `<span class="mirback pairback ${kind}" style="--j:${k + 1}" aria-hidden="true"><span class="mt"><span class="mn">＋ ${esc(x.n)}</span><span class="ms">${'$'.repeat(x.c)}</span></span></span>`).join('');
  return `<div class="mirwrap" style="--n:${n}">${backs}${card}${mirListHTML(name, mir, 'mirhover', pair, kind).replace('<div class="mirhover">', '<div class="mirhover" aria-hidden="true">')}</div>`;
}
// what's behind a covered card: shown when you click it (over the card) and in the press-and-hold full-size view
function mirListHTML(name, mir, cls, pair, kind){
  const pairs = (pair || []).map(n => { const d = (kind === 'u' ? DEFS : BDEFS)[n]; if (!d) return '';
    return `<span class="mirseal pairseal"><span class="mtop"><b>＋ ${esc(n)}</b><span class="sur">$${d.c}</span></span><span class="mtx">${shortHTML(n, kind, 0, true) || esc(d.t || '')}</span></span>`; }).join('');
  return `<div class="${cls}">${mir.map(n => mirSealHTML(n)).join('')}${pairs}</div>`;
}
function unitLine(n, c, canSell, isNew){
  const L = uLvl(n, c), pw = n === 'Jester' ? '?' : DEFS[n].p[L-1];
  return `<div class="li${isNew ? ' isnew' : ''}"><span class="nm">${esc(n)}${isNew ? ' <span class="newb">NEW</span>' : ''}</span><span class="mono">×${c} · Lv ${L} · ${pw} pwr</span>${canSell && n !== 'Recruit' ? `<button type="button" class="small" data-act="sell-u" data-name="${esc(n)}" title="Sell one copy for $1">Sell $1</button>` : ''}</div>`;
}
function bldgLine(n, c, canSell, isNew){
  const lv = n === 'Field' ? `×${c}` : `Lv ${Math.min(c, BDEFS[n].lv.length)}`;
  return `<div class="li${isNew ? ' isnew' : ''}"><span class="nm">${esc(n)}${isNew ? ' <span class="newb">NEW</span>' : ''}</span><span class="mono">${lv}</span>${canSell ? `<button type="button" class="small" data-act="sell-b" data-name="${esc(n)}" title="Sell one level for $1">Sell $1</button>` : ''}</div>`;
}
// the Sell button on one of your cards (the deck sheet's cards and the Caravan and hand cards on the mat); none for
// cards that can't be sold
function shopSellBtnHTML(n, kind){
  if ((kind === 'u' && n === 'Recruit') || n === 'Altar of Blood') return '';
  const sp = SELL_PRICE + (G ? bVal(G.players[seat()], 'The Bazaar') : 0);
  return `<button type="button" data-act="sell-${kind}" data-name="${esc(n)}" title="${kind === 'u' ? 'Sell one copy' : isGear(n) ? 'Sell this gear' : 'Sell one level'} for $${sp}">Sell $${sp}</button>`;
}
// Owned cards are drawn like market cards (name, power curve with the current level lit, full text) so you can read them.
function forceCard(n, c, kind, canSell, isNew, ai){
  const d = kind === 'u' ? DEFS[n] : BDEFS[n]; if (!d) return '';
  let have;
  if (kind === 'u'){ const L = uLvl(n, c); have = exemptUnit(n) ? `×${c}` : `×${c} · Lv ${L}`; }
  else have = n === 'Field' ? `×${c}` : BDEFS[n].lv.length > 1 ? `level ${Math.min(c, BDEFS[n].lv.length)}` : '';
  const mine = G && G.net ? !ai : !PP() && !ai;
  const owner = mine ? 'You' : PP() ? esc(nm(ai ? 1 - seat() : seat())) : 'AI';
  const verb = mine ? 'own' : 'owns';
  const own = isGear(n) ? `${owner} ${verb} ×${c}` : !hasLevels(n, kind) ? `${owner} ${verb} it` : `${owner} ${verb} ${have}`;
  const sell = canSell ? shopSellBtnHTML(n, kind) : '';
  const oside = ai ? 1 - seat() : seat();   // whose card this is: blue for seat 0, red for seat 1
  return `<div class="mcard fcard ${kind}${ai ? ' ai' : ''} so${VS(oside)}${isNew ? ' isnew hasst' : ''}" data-card="${esc(n)}"${copyStyle(extraCopies(n, kind, c), kind)}>
    ${cardFace(n, kind, c)}
    ${stampsHTML([isNew ? ['st-new', 'NEW'] : null])}
    ${sell}
  </div>`;
}
function forcesHTML(p, canSell, fresh, ai){
  fresh = fresh || new Set();
  const units = asCards(Object.entries(p.hand), 'u').map(([n,c]) => forceCard(n, c, 'u', canSell, fresh.has(n), ai)).join('');
  const city = asCards(Object.entries(p.city), 'b').map(([n,c]) => forceCard(n, c, 'b', canSell, fresh.has(n), ai)).join('');
  const gearN = Object.values(p.gear || {}).reduce((a, b) => a + b, 0);
  const gear = Object.entries(p.gear || {}).filter(([n, c]) => c > 0).sort().map(([n, c]) => forceCard(n, c, 'b', canSell, fresh.has(n), ai)).join('');
  return `${mirHandHTML(p, canSell, ai)}<div class="list"><span class="eyebrow">Units · ${uniqueUnits(p)}/${deckCap(p)} unique</span>${units ? `<div class="fcards">${units}</div>` : '<p class="note">No units.</p>'}</div>
          ${gear ? `<div class="list"><span class="eyebrow">Gear in hand · ${gearN}</span><div class="fcards">${gear}</div></div>` : ''}
          <div class="list"><span class="eyebrow">City · ${slotsUsed(p)}/5 slots</span>${city ? `<div class="fcards">${city}</div>` : '<p class="note">No buildings.</p>'}</div>`;
}
// Miracles in hand, shown with each player's forces (both players can see them). They're played from the
// Miracles tab in the shop and the Miracles panel at Mobilize.
function mirHandHTML(p, myTurn, ai){
  const mir = p.mir || [];
  if (!mir.length) return '';
  const cards = mir.map(n => `<span class="mircard plain" title="${esc(mirBody(n))}"><span class="mtop"><b>${esc(n)}</b>${MIRS[n].disc && p.discArm && n === mirDisc(p) ? '<span class="mirlive">played</span>' : ''}</span><span class="mseal" aria-hidden="true"><span>✶</span></span><span class="mtx">${esc(MIRS[n].sh.replace(/^hand: /, ''))}</span></span>`).join('');
  return `<div class="list"><span class="eyebrow">Miracles in hand · ${mir.length}</span><div class="mirgrid">${cards}</div></div>`;
}
const mirBody = n => mirBrief(n);   // the same short text as the popups
