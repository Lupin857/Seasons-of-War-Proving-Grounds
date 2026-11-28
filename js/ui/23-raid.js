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

function raidPileSlotsHTML(i){
  const p = G.players[i], mine = i === seat();
  return RAID_ROLES.map(role => {
    // The public card on top follows purchase history, independently of the secret battle order.
    const hand = Object.fromEntries(raidNames(p, role).map(n => [n, p.hand[n]]));
    const top = matPileTop(p, hand), count = raidDeckSize(p, role);
    const expanded = ui.raidPile?.player === i && ui.raidPile?.role === role;
    const edges = Array.from({length:Math.min(2, Math.max(0, count - 1))}, (_, k) =>
      `<i class="osedge" style="--k:${k + 1}" aria-hidden="true"></i>`).join('');
    const stock = top ? `<span class="mcard u ostop" aria-hidden="true">${cardFace(top, 'u', hand[top], true)}</span>`
      : '<span class="osslot" aria-hidden="true"></span>';
    return `<button type="button" class="ospile raid-pile raid-${role} s${VS(i)}" data-act="raid-pile" data-role="${role}"
      data-p="${i}" ${mine ? `data-raid-drop="${role}"` : ''} aria-expanded="${expanded}"
      aria-label="${esc(mine && !PP() ? 'Your' : nm(i) + '’s')} ${raidRoleName(role)} pile, ${count} of ${RAID.deck} units">
      ${matDesk() ? `<span class="ospile-stock">${edges}${stock}</span>` : edges + stock}
      <span class="ostag">${raidRoleName(role)}${matDesk() ? ` <b>${count}/${RAID.deck}</b>` : ''}</span></button>`;
  }).join('');
}

function raidMobilizeNoteHTML(){
  const pending = G.raid.bout === 1 ? ` · ${G.raid.damage[raidAttacker(G)]} damage pending` : '';
  const O = 1 - seat(), p = G.players[O], role = raidRole(G, O);
  const units = raidNames(p, role).map(n => esc(dispName(n))).join(', ');
  return `<div class="raid-mob-note"><b>${raidRoundTitle()}${pending}</b><span>Facing ${units || 'an empty ' + raidRoleName(role) + ' deck'}</span></div>`;
}

function raidDrawerHTML(S, open){
  if (!open) return '';
  const {player, role} = open, p = G.players[player], mine = player === S;
  if (role === 'caravan'){
    const siegeWhy = raidSiegeReason(G, S);
    const siegeText = p.raidSiege === 2 ? 'Siege Workshop ready' : `${p.raidSiege === 1 ? 'Finish' : 'Build'} Siege Workshop · ${RAID.siegePrice} Water`;
    return `<div class="raid-drawer" id="raid-drawer">
      <button type="button" data-act="deck-open" data-p="${S}">View Caravan, gear &amp; sell cards</button>
      <button type="button" data-act="raid-siege" ${siegeWhy ? 'disabled' : ''} title="${esc(siegeWhy)}">${siegeText}</button>
      ${siegeWhy && p.raidSiege === 1 ? `<small>${esc(siegeWhy)}</small>` : ''}
      <small>${raidRoundTitle()}</small>
    </div>`;
  }
  const to = role === 'attack' ? 'defense' : 'attack';
  const units = raidNames(p, role).sort((a, b) => dispName(a).localeCompare(dispName(b))).map(n => {
    const why = mine ? raidTransferReason(G, S, n, to) : '', art = artURL(n, 'u');
    const level = uLvl(n, p.hand[n]);
    return `<div class="raid-unit">
      <span class="raid-card" ${mine && !why ? `data-raid-drag="${esc(n)}" data-role="${role}"` : ''}>
        ${art ? `<img src="${art}" alt="" draggable="false">` : ''}
        <span>${esc(dispName(n))}<small>Lv ${level}${p.hand[n] > 1 ? ` · ×${p.hand[n]}` : ''}</small></span></span>
      <details class="raid-unit-rules"><summary>Card details</summary><span>${cardTx(n, 'u', level, true)}</span></details>
      ${mine ? `<button type="button" data-act="raid-transfer" data-name="${esc(n)}" data-role="${to}"
        ${why ? 'disabled' : ''} title="${esc(why)}" aria-label="Move ${esc(dispName(n))} to ${raidRoleName(to)}">Move to ${raidRoleName(to)}</button>` : ''}
    </div>`;
  }).join('');
  const note = mine ? ui.raidTransferError ? esc(ui.raidTransferError) : p.raidTransfer ? 'Transfer used this Shop' : 'Drag a card onto the other pile, or use Move.' : '';
  const title = `${mine && !PP() ? 'Your' : esc(nm(player)) + '’s'} ${raidRoleName(role)} pile`;
  return `<section class="raid-drawer raid-roster-drawer" id="raid-drawer" data-raid-player="${player}" aria-label="${title}">
    <header><b>${title}</b><button type="button" data-act="raid-close-pile">Close</button></header>
    <div class="raid-unit-row">${units || '<span>This pile is empty.</span>'}</div>
    ${note ? `<small class="raid-transfer-note">${note}</small>` : ''}</section>`;
}

function raidPositionDrawer(){
  const drawer = document.querySelector('.raid-roster-drawer');
  if (!drawer) return;
  const mine = +drawer.dataset.raidPlayer === seat();
  const row = document.querySelector(`#view-play .osseat.${mine ? 'me' : 'opp'}.osbar-shop`);
  if (!row) return;
  const rect = row.getBoundingClientRect(), dock = $('dock').getBoundingClientRect();
  const caption = matDesk() ? 24 : 0;
  const anchor = mine ? Math.max(0, dock.top - rect.top) + caption : rect.bottom + caption;
  drawer.style.setProperty('--raid-drawer-anchor', anchor + 'px');
  drawer.classList.toggle('raid-rival-drawer', !mine);
}

function raidDockHTML(acts, mine){
  const S = seat(), p = G.players[S], open = ui.raidPile;
  return `<footer id="dock" class="dock raid-dock${mine ? ' mine' : ''}">
    ${raidDrawerHTML(S, open)}
    <div class="raid-dock-row">
      <button type="button" class="raid-caravan deckbtn s${VS(S)}" data-act="raid-pile" data-p="${S}" data-role="caravan" aria-expanded="${open?.role === 'caravan'}">
        <b>${PP() ? `${esc(nm(S))}’s Caravan` : 'Your Caravan'}</b><small>${p.money} Water · +${Math.max(0, income(p))} next Shop</small></button>
      <div class="raid-actions"><span class="raid-buy-count">${Math.max(0, baseLeft(G.buys[S]))} buys left</span>${acts}</div>
    </div>
  </footer><div class="dockspace" aria-hidden="true"></div>`;
}

function raidTransferUI(name, role){
  const S = seat(), why = raidTransferReason(G, S, name, role);
  if (why){
    ui.raidTransferError = why;
    sfx.err();
  } else {
    playerMove(['raid-transfer', name, role]);
    return;
  }
  renderPlay();
}

let raidDrag = null;
const raidDropAt = e => document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-raid-drop]');
$('view-play').addEventListener('pointerdown', e => {
  const card = e.target.closest('[data-raid-drag]');
  if (!card || !G?.raid || !e.isPrimary || e.button !== 0) return;
  raidDrag = {card, id:e.pointerId, x:e.clientX, y:e.clientY, name:card.dataset.raidDrag, role:card.dataset.role};
  card.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e => {
  const d = raidDrag;
  if (!d || d.id !== e.pointerId) return;
  if (!d.ghost && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
  if (!d.ghost){
    d.ghost = d.card.cloneNode(true);
    d.ghost.classList.add('raid-drag-card');
    d.ghost.setAttribute('aria-hidden', 'true');
    document.body.append(d.ghost);
  }
  d.ghost.style.transform = `translate(${e.clientX + 8}px, ${e.clientY - 22}px)`;
  d.target?.classList.remove('raid-drop-ready');
  const t = raidDropAt(e);
  d.target = t && t.dataset.raidDrop !== d.role ? t : null;
  d.target?.classList.add('raid-drop-ready');
});
function raidEndDrag(e){
  const d = raidDrag;
  if (!d || d.id !== e.pointerId) return;
  raidDrag = null;
  d.ghost?.remove();
  d.target?.classList.remove('raid-drop-ready');
  if (e.type === 'pointerup' && d.ghost && d.card.isConnected && G?.raid){
    const t = raidDropAt(e), role = t?.dataset.raidDrop;
    if (role && role !== d.role) raidTransferUI(d.name, role);
  }
}
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) window.addEventListener(type, raidEndDrag);
