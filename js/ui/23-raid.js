/* Raid keeps both public rosters in the same fixed Caravan bar. Only the active lineup is private. */
function raidSetupHTML(){
  return `<label class="raid-setup"><input type="checkbox" data-raid-setup ${SU.raid ? 'checked' : ''}>
    <span><b>Raid</b><small>Two sequential fights per round · 8 Caravan health</small></span></label>`;
}

function raidRoundTitle(){
  const attacker = raidAttacker(G);
  return `${G.raid.bout === 0 ? 'Opening attack' : 'Counterattack'} · ${!PP() && attacker === 0 ? 'You attack' : `${esc(nm(attacker))} attacks`}`;
}

function raidDraft(){
  const S = seat(), p = G.players[S], role = raidRole(G, S);
  const names = raidNames(p, role);
  const last = ui.raidOrders?.[S]?.[role] || [];
  return [...new Set([...last.filter(n => names.includes(n)), ...names])].map(name => ({name, arm:0, sh:0, tr:0}));
}

function raidBuyPrompt(a){
  if (!G.raid || a[0] !== 'b' || a[5] || G.phase !== 'shop' || ui.battle) return false;
  const S = seat(), card = sourceCard(G, S, a[1], a[2]), p = G.players[S];
  if (!card || card.kind !== 'u' || card.name === 'Recruit' || p.raidRoster[card.name]) return false;
  const quote = buyInfo(G, S, card.name, card.kind, a[1], a[2]);
  if (!quote.ok || cur(G) !== S || altarWaiting(G, S)) return false;
  ui.raidBuy = {a, name:card.name, seat:S, price:quote.price};
  closePeek();
  renderPlay();
  $('view-play').querySelector('[data-act="raid-buy"]:not(:disabled)')?.focus({preventScroll:true});
  return true;
}

function raidBuyHTML(){
  const pick = ui.raidBuy, p = G.players[pick.seat];
  const choices = raidChoices(p, pick.name);
  const actions = RAID_ROLES.map(role => `<button type="button" class="primary" data-act="raid-buy" data-role="${role}" ${choices.includes(role) ? '' : 'disabled'}>
    Buy for ${raidRoleName(role)} · ${raidDeckSize(p, role)}/${RAID.deck}</button>`).join('');
  const body = `<p>${esc(dispName(pick.name))} · ${pick.price} Water</p><div class="raid-buy-actions">${actions}</div>`;
  return popWinHTML('Choose a deck', 'raid-buy', '', body, 'This assignment carries over between rounds.');
}

function raidSharedHand(p){
  const hand = Object.fromEntries(Object.entries(p.gear || {}).filter(([, copies]) => copies > 0));
  if (p.hand.Recruit > 0) hand.Recruit = p.hand.Recruit;
  return hand;
}

const raidPileLabel = role => ({attack:'Offense', defense:'Defense', deck:'Deck'})[role];

function raidPileTop(row, role){
  return row?.querySelector(`.raid-pile[data-role="${role}"] :is(.ostop,.osslot)`);
}

function raidPileSlotsHTML(i, mode){
  const p = G.players[i], mine = i === seat();
  const activeRole = ui.battle?.raid ? (ui.battle.raid.attacker === i ? 'attack' : 'defense') : raidRole(G, i);
  return [...RAID_ROLES, 'deck'].map(role => {
    const shared = role === 'deck', label = raidPileLabel(role);
    const deployed = role === activeRole && (mode === 'battle' || (mode === 'mob' && !MATMOB.lift));
    // The public card on top follows purchase history, independently of the secret battle order.
    const hand = shared ? raidSharedHand(p) : Object.fromEntries(raidNames(p, role).map(n => [n, p.hand[n]]));
    const top = matPileTop(p, hand);
    const count = shared ? Object.values(hand).reduce((n, copies) => n + copies, 0) : raidDeckSize(p, role);
    const tally = shared ? String(count) : `${count}/${RAID.deck}`;
    const description = shared ? `${count} gear and Drifter cards` : `${count} of ${RAID.deck} units`;
    const edges = Array.from({length:Math.min(2, Math.max(0, count - 1))}, (_, k) =>
      `<i class="osedge" style="--k:${k + 1}" aria-hidden="true"></i>`).join('');
    const waiting = matWaitN(i, `raid-${role}`) ? ' style="visibility:hidden"' : '';
    const kind = top ? cardKind(top) : 'u';
    const stock = top ? `<span class="mcard ${kind} ostop" aria-hidden="true"${waiting}>${cardFace(top, kind, top === 'Recruit' ? 1 : hand[top], true)}</span>` : '';
    const slot = '<span class="osslot" aria-hidden="true"></span>';
    const contents = (deployed || !stock ? slot : '') + (stock ? edges + stock : '');
    return `<button type="button" class="ospile raid-pile raid-${role} s${VS(i)}${deployed ? ' raid-deployed' : ''}" data-act="raid-pile" data-role="${role}"
      data-p="${i}" ${mine && !shared && mode === 'shop' ? `data-raid-drop="${role}"` : ''} ${deployed || mode === 'mob' ? 'disabled' : ''} aria-expanded="false" aria-haspopup="dialog"
      aria-label="${esc(mine && !PP() ? 'Your' : nm(i) + '’s')} ${label} pile, ${deployed ? 'deployed' : description}">
      ${matDesk() ? `<span class="ospile-stock">${contents}</span>` : contents}
      <span class="ostag">${label}${matDesk() ? ` <b>${tally}</b>` : ''}</span></button>`;
  }).join('');
}

function raidMobilizeNoteHTML(){
  const pending = G.raid.bout === 1 ? ` · ${G.raid.damage[raidAttacker(G)]} damage pending` : '';
  const O = 1 - seat(), p = G.players[O], role = raidRole(G, O);
  const units = raidNames(p, role).map(n => esc(dispName(n))).join(', ');
  return `<div class="raid-mob-note"><b>${raidRoundTitle()}${pending}</b><span>Facing ${units || 'an empty ' + raidRoleName(role) + ' deck'}</span></div>`;
}

function raidShopStatusHTML(i){
  const p = G.players[i], b = G.buys[i], left = Math.max(0, baseLeft(b)), cap = buysOf(b);
  const bonus = Math.max(0, bVal(p, "Carpenter's Guild") - b.carp) + (b.fav || 0);
  return `<small class="raid-shop-status">Bought this shop<br>${left}/${cap} buys left${bonus ? ` · +${bonus} bonus` : ''}</small>`;
}

function raidSiegeButtonHTML(){
  const S = seat(), stage = G.players[S].raidSiege;
  const why = raidSiegeReason(G, S);
  const label = stage === 2 ? 'Siege ready' : `${stage === 1 ? 'Finish' : 'Build'} siege · ${RAID.siegePrice}`;
  return `<button type="button" class="raid-siege-btn" data-act="raid-siege" ${why ? 'disabled' : ''} title="${esc(why || label + ' Water')}">${label}</button>`;
}

async function raidClearBattle(view, battle){
  if (reduceMotion()) return;
  const line = view.querySelector('.stage .line.table');
  if (!line || !view.querySelector('.osbar-battle .raid-pile')) return;
  const opening = battle.frames[0].snap, ending = battle.frames.at(-1).snap;
  const controls = [...view.querySelectorAll('.battlectl, #dock, .tailwait, [data-act="continue"]')].filter(el => !el.inert);
  const flyers = [], flights = [];
  controls.forEach(el => { el.inert = true; });
  view.classList.add('raid-clearing');
  try{
    for (const i of [0, 1]){
      const row = view.querySelector(`.osbar-battle.s${VS(i)}`);
      const roster = row.querySelector('.raid-deployed');
      const shared = row.querySelector('.raid-deck');
      const home = matPoseOf(roster.querySelector('.osslot'));
      const sharedHome = matPoseOf(shared.querySelector('.ostop,.osslot'));
      const field = line.querySelector(`.trow.s${VS(i)}`);
      const deployed = new Map(opening[i].deck.map(unit => [unit.uid, unit]));
      const sources = [
        [ending[i].deck, field.querySelector('.deckz .revealed'), false],
        [[ending[i].charge], field.querySelector('.chz .charging'), false],
        [ending[i].grave, field.querySelector('.grz .gcard:not(.gunder)'), true]
      ];
      let delay = 0;
      const fly = (from, dest, name, kind, faceDown) => {
        if (!from?.width || !dest) return;
        const card = document.createElement('div');
        card.className = 'mcard raid-return-card ' + kind;
        card.innerHTML = faceDown ? '<span class="oback"></span>' : cardFace(name, kind, 1, true);
        const frames = matArc(from, {r:from, tilt:0}, dest, {arc:22, levelThroughout:true});
        if (!frames) return;
        flyEl(card, from, from.width, from.height, LAYER.flight);
        flyers.push(card);
        flights.push(card.animate(frames, {duration:420, delay, easing:MAT_EASE, fill:'both'}).finished);
        delay += 28;
      };
      for (const [units, source, faceDown] of sources){
        const from = source?.getBoundingClientRect();
        for (const unit of units){
          const original = unit && deployed.get(unit.uid);
          if (!original) continue;
          fly(from, original.name === 'Recruit' ? sharedHome : home, original.name, 'u', faceDown);
          if (original.gear) fly(from, sharedHome, original.gear, 'b', false);
        }
      }
    }
    await Promise.allSettled(flights);
    if (flights.length){
      view.classList.add('raid-restacked');
      flyers.splice(0).forEach(card => card.remove());
      await new Promise(resolve => setTimeout(resolve, 110));
    }
  } finally {
    flyers.forEach(card => card.remove());
    controls.forEach(el => { el.inert = false; });
    view.classList.remove('raid-clearing', 'raid-restacked');
  }
}

function raidContinue(){
  if (ui.raidClearing || ui.frame !== ui.battle.frames.length - 1) return;
  const game = G, state = ui, battle = ui.battle;
  sfx.soft(); stopAuto(); stopAnim(); closePeek(true);
  state.raidClearing = true;
  raidClearBattle($('view-play'), battle).catch(err => console.error('Raid cleanup', err)).finally(() => {
    state.raidClearing = false;
    if (G !== game || ui !== state || ui.battle !== battle) return;
    ui.battle = null; ui.revealed = false; ui.pre = null; ui.mktTab = 'u';
    if (raidNextFight(G)){
      ui.mobSeat = 0; ui.handoff = PP() ? 0 : null;
      MATMOB.lift = matMobOn() && !reduceMotion();
      renderPlay(); toGame();
    } else {
      shopCoinStart(G); renderPlay(); scheduleAI();
    }
  });
}

function raidShopDropTargets(card){
  const buy = card.querySelector(':scope > [data-act="buy"]'), S = seat();
  const offer = buy && sourceCard(G, S, buy.dataset.src, +buy.dataset.idx);
  const row = document.querySelector('#view-play .osseat.me.osbar-shop');
  if (!offer || !row) return [];
  if (offer.name === 'Recruit' || isGear(offer.name)) return [...row.querySelectorAll('.raid-pile[data-role="deck"]')];
  if (offer.kind === 'b') return [...row.querySelectorAll('.oscarrow')];
  const roles = raidChoices(G.players[S], offer.name);
  return roles.flatMap(role => [...row.querySelectorAll(`.raid-pile[data-role="${role}"]`)]);
}

function raidTransferUI(name, role){
  const why = raidTransferReason(G, seat(), name, role);
  if (why){ showToast(why); sfx.err(); return; }
  closePeek(true);
  const view = $('view-play');
  view.querySelector('.osdeckfan[data-raid-pile]')?.remove();
  view.querySelector('.raid-pile[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
  playerMove(['raid-transfer', name, role]);
}

const raidDrag = {p:null, eat:false};
window.addEventListener('click', e => {
  if (!raidDrag.eat) return;
  e.preventDefault();
  e.stopImmediatePropagation();
}, true);
function raidDropAt(e, d){
  const to = d.role === 'attack' ? 'defense' : 'attack';
  const target = document.querySelector(`#view-play .osseat.me [data-raid-drop="${to}"]`);
  const b = target?.getBoundingClientRect();
  return b && e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom ? target : null;
}
$('view-play').addEventListener('pointerdown', e => {
  const card = e.target.closest('[data-raid-drag]');
  if (!card || e.target.closest('button') || !G?.raid || !e.isPrimary || e.button !== 0) return;
  raidDrag.p = {card, id:e.pointerId, x:e.clientX, y:e.clientY, name:card.dataset.raidDrag, role:card.dataset.role};
  card.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e => {
  const d = raidDrag.p;
  if (!d || d.id !== e.pointerId) return;
  if (!d.ghost && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
  if (!d.ghost){
    raidDrag.eat = true;
    d.card.closest('.osdeckfan')?.classList.add('raid-transferring');
    const box = d.card.getBoundingClientRect(), {g} = flyer(d.card, 'u');
    d.ghost = g;
    flyEl(g, box, box.width, box.height, LAYER.cardPop);
    g.classList.add('raid-drag-card');
  }
  d.ghost.style.translate = `${e.clientX - d.x}px ${e.clientY - d.y}px`;
  d.target?.classList.remove('raid-drop-ready');
  d.target = raidDropAt(e, d);
  d.target?.classList.add('raid-drop-ready');
});
function raidEndDrag(e){
  const d = raidDrag.p;
  if (!d || d.id !== e.pointerId) return;
  raidDrag.p = null;
  d.ghost?.remove();
  d.card.closest('.osdeckfan')?.classList.remove('raid-transferring');
  d.target?.classList.remove('raid-drop-ready');
  if (e.type === 'pointerup' && d.ghost && d.card.isConnected && G?.raid){
    const target = raidDropAt(e, d);
    if (target) raidTransferUI(d.name, target.dataset.raidDrop);
  }
  setTimeout(() => { raidDrag.eat = false; }, 0);
}
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) window.addEventListener(type, raidEndDrag);
