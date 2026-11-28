/* Raid uses the standard Shop and battle engine with persistent, public deck assignments. */
const RAID = Object.freeze({health:8, roster:7, deck:5, siegePrice:2});
const RAID_ROLES = ['attack', 'defense'];
const raidRoleName = role => role === 'attack' ? 'Attack' : 'Defense';

function raidInit(g){
  g.raid = {bout:0, damage:[0, 0]};
  g.bDeck = g.bDeck.filter(n => n !== 'Cathedral' && n !== 'Reserve Encampment');
  for (const p of g.players){
    p.raidRoster = {};
    p.health = RAID.health;
    p.raidSiege = 0;
  }
}

function raidResetRound(g){
  g.raid.bout = 0;
  g.raid.damage = [0, 0];
  for (const p of g.players){
    p.raidTransfer = false;
    p.raidSpent = {gear:{}, arm:0, sh:0, tr:0, rec:0};
  }
}

const raidAttacker = g => (g.first1 ?? g.order[0]) ^ ((g.round - 1 + g.raid.bout) % 2);
const raidRole = (g, i) => i === raidAttacker(g) ? 'attack' : 'defense';
const raidNames = (p, role) => Object.keys(p.hand).filter(n => p.hand[n] > 0 && p.raidRoster[n] === role);
const raidDeckSize = (p, role) => raidNames(p, role).filter(n => !exemptUnit(n)).length;
function raidChoices(p, name){
  if (p.raidRoster[name] && p.hand[name]) return [p.raidRoster[name]];
  if (uniqueUnits(p) >= RAID.roster) return [];
  return RAID_ROLES.filter(role => raidDeckSize(p, role) < RAID.deck);
}

function raidTransferReason(g, i, n, role){
  const p = g.players[i];
  if (!g.raid || g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return 'Transfer during your Shop turn.';
  if (!p.hand[n] || !p.raidRoster[n] || !RAID_ROLES.includes(role) || p.raidRoster[n] === role) return 'Choose a unit in the other deck.';
  if (p.raidTransfer) return 'You already transferred a unit this Shop.';
  if (!exemptUnit(n) && raidDeckSize(p, role) >= RAID.deck) return `The ${raidRoleName(role)} deck is full.`;
  return '';
}

function raidTransfer(g, i, n, role){
  if (raidTransferReason(g, i, n, role)) return false;
  const p = g.players[i];
  p.raidRoster[n] = role;
  p.raidTransfer = true;
  g.log.push({t:`${g.labels[i]} transfers ${n} to ${raidRoleName(role)}.`, side:i});
  return true;
}

function raidSiegeReason(g, i){
  const p = g.players[i];
  if (!g.raid || g.phase !== 'shop' || cur(g) !== i || g.passed[i] || altarWaiting(g, i)) return 'Available during your Shop turn.';
  if (p.raidSiege === 2) return 'Siege Workshop is ready.';
  if (p.raidSiegeRound === g.round) return 'Finish the Workshop in a later Shop.';
  if (p.money < RAID.siegePrice) return `Need ${RAID.siegePrice} Water.`;
  if (baseLeft(g.buys[i]) <= 0 && g.buys[i].carp >= bVal(p, "Carpenter's Guild")) return 'No buys left.';
  return '';
}

function raidBuySiege(g, i){
  if (raidSiegeReason(g, i)) return false;
  const p = g.players[i], b = g.buys[i], ready = p.raidSiege === 1;
  noteSeen(g, i);
  p.money -= RAID.siegePrice;
  useSlot(b, 'b', baseLeft(b) > 0 ? 'base' : 'carp', '');
  p.raidSiege++;
  p.raidSiegeRound = g.round;
  g.log.push({t:`${g.labels[i]} ${ready ? 'finishes' : 'builds'} the Siege Workshop.`, side:i});
  nextTurn(g);
  return true;
}

function raidBattlePlayer(g, i, role = raidRole(g, i)){
  const p = g.players[i];
  const hand = Object.fromEntries(raidNames(p, role).map(n => [n, p.hand[n]]));
  if (p.hand.Recruit) hand.Recruit = p.hand.Recruit;
  const gear = {...p.gear};
  for (const [n, count] of Object.entries(p.raidSpent.gear)) gear[n] = Math.max(0, (gear[n] || 0) - count);
  return {...p, hand, gear};
}

function raidValidate(g, i, spec){
  const names = raidNames(g.players[i], raidRole(g, i));
  if (spec.some(u => u.name !== 'Recruit' && !names.includes(u.name))) return 'Only units assigned to this deck can fight.';
  if (names.some(n => !spec.some(u => u.name === n))) return 'Include every assigned unit in this lineup.';
  return null;
}

function raidSpend(p, deck){
  for (const u of deck){
    if (u.name === 'Recruit') p.raidSpent.rec++;
    for (const k of ['arm', 'sh', 'tr']) p.raidSpent[k] += u[k] || 0;
    if (u.gear) p.raidSpent.gear[u.gear] = (p.raidSpent.gear[u.gear] || 0) + 1;
  }
}

function raidBattleCfg(g, i, role = raidRole(g, i)){
  const cfg = battleCfg(g, i);
  if (role === 'attack'){
    cfg.yard = 0;
    cfg.drill = 0;
    cfg.infirmary = false;
    cfg.raidSiege = g.players[i].raidSiege === 2;
  } else cfg.treb = 0;
  return cfg;
}

function raidDoBattle(g, record){
  const attacker = raidAttacker(g), defender = 1 - attacker;
  const cfgs = [0, 1].map(i => raidBattleCfg(g, i));
  const res = runBattle(cfgs, record, {raidAttacker:attacker});
  const damage = res.result.w === attacker ? res.left[attacker] : 0;
  res.raid = {attacker, damage, bout:g.raid.bout};
  g.lastBattle = {w:res.result.w};
  g.raid.damage[defender] = damage;
  for (const [i, p] of g.players.entries()) raidSpend(p, g.decks[i]);
  g.log.push({t:damage ? `${g.labels[attacker]} breaches for ${damage} Caravan damage.` : `${g.labels[attacker]}'s raid deals no Caravan damage.`, side:attacker});

  if (g.raid.bout === 0) return res;
  for (const [i, p] of g.players.entries()){
    p.health = Math.max(0, p.health - g.raid.damage[i]);
    delete p.hand.Recruit;
    delete p.hand.Mercenary;
  }
  const defeated = g.players.map(p => p.health === 0);
  if (defeated.some(Boolean) || g.round >= RULES.maxRounds){
    g.over = true;
    g.winner = defeated[0] === defeated[1] ? -1 : defeated[0] ? 1 : 0;
  }
  g.phase = g.over ? 'over' : 'battle';
  return res;
}

function raidNextFight(g){
  if (!g.raid || g.phase !== 'battle' || g.raid.bout !== 0) return false;
  g.raid.bout = 1;
  g.phase = 'mobilize';
  g.decks = [null, null];
  return true;
}

/* Reuse standard card valuation and army assembly. Raid judges the fronts by Caravan damage. */
function raidAiPosition(g, i, roster = g.players[i].raidRoster){
  const [me, foe] = [g.players[i], g.players[1 - i]];
  const strength = (p, assignments, role) => Object.keys(assignments).reduce((sum, n) =>
    sum + (assignments[n] === role && p.hand[n] ? strengthU(n, uLvl(n, p.hand[n])) : 0), 0);
  const attack = strength(me, roster, 'attack'), defense = strength(me, roster, 'defense');
  const theirAttack = strength(foe, foe.raidRoster, 'attack'), theirDefense = strength(foe, foe.raidRoster, 'defense');
  const contest = (a, b) => Math.tanh((a - b) / (4 + b * .3));
  return (2 + 3 / Math.max(1, foe.health)) * contest(attack, theirDefense)
    + (2 + 4 / Math.max(1, me.health)) * contest(defense, theirAttack)
    + (attack > 0 ? .7 : 0);
}

function raidAiShop(g, i){
  const me = g.players[i], foe = g.players[1 - i];
  if (altarWaiting(g, i)) altarPick(g, i, aiAltarPick(me, g.altarPend[i]));
  const position = raidAiPosition(g, i);
  let transfer = null, gain = .35;
  for (const [name, role] of Object.entries(me.raidRoster)){
    const to = role === 'attack' ? 'defense' : 'attack';
    if (raidTransferReason(g, i, name, to)) continue;
    const delta = raidAiPosition(g, i, {...me.raidRoster, [name]:to}) - position;
    if (delta > gain){ transfer = {name, to}; gain = delta; }
  }
  if (transfer) raidTransfer(g, i, transfer.name, transfer.to);
  if (bVal(me, 'Black Market') && !g.bmUsed[i]) useBM(g, i, aiBMKind(g, i));

  const weights = me.genome || baseGenome(), before = raidAiPosition(g, i);
  let best = null, bestScore = 0;
  for (const o of aiShopOptions(g, i)){
    const quote = buyInfo(g, i, o.name, o.kind, o.src, o.idx);
    if (!quote.ok) continue;
    const assigned = o.kind === 'u' && o.name !== 'Recruit';
    for (const role of assigned ? raidChoices(me, o.name) : [null]){
      const originalHand = me.hand;
      const originalRoster = me.raidRoster;
      let value;
      if (assigned){
        // Card synergies are local to the deck. Keep the full hand for the separate position estimate.
        me.hand = raidBattlePlayer(g, i, role).hand;
        try { value = aiValue(g, i, o.name, o.kind); }
        finally { me.hand = originalHand; }
        me.hand = {...originalHand, [o.name]:(originalHand[o.name] || 0) + 1};
        try { value += 2.5 * (raidAiPosition(g, i, {...originalRoster, [o.name]:role}) - before); }
        finally { me.hand = originalHand; }
      } else value = aiValue(g, i, o.name, o.kind);
      const score = value - quote.price * weights.m * .65;
      if (score > bestScore){ bestScore = score; best = {...o, role}; }
    }
  }
  const siegeValue = (me.raidSiege === 1 ? 5 : 3.2) + raidDeckSize(foe, 'defense') * .7
    + bVal(foe, 'Armory') * .5 - RAID.siegePrice * weights.m * .65;
  if (raidDeckSize(me, 'attack') >= 2 && siegeValue > bestScore && raidBuySiege(g, i)) return true;
  if (best && buy(g, i, best.src, best.idx, null, null, best.role)) return true;
  return pass(g, i);
}

function raidAiMobilize(g, i){
  const attacker = raidAttacker(g), me = raidBattlePlayer(g, i);
  const myArmy = buildArmy(me), rival = raidBattlePlayer(g, 1 - i), theirArmy = buildArmy(rival);
  const full = a => assemble(a.core, a.recs, a.arm, false, false, a.sh, a.gear);
  // These guesses use the public roster and remaining supply only.
  const guesses = [full(theirArmy)];
  if (theirArmy.core.length > 1) guesses.push(assemble(theirArmy.core.slice().reverse(),
    theirArmy.recs, theirArmy.arm, false, true, theirArmy.sh, theirArmy.gear));
  const cfgs = [0, 1].map(j => raidBattleCfg(g, j));
  const first = g.raid.bout === 0;
  const scarce = myArmy.gear.length + myArmy.arm + myArmy.sh + myArmy.recs + myArmy.core.reduce((n, u) => n + u.tr, 0);
  const budgets = first && scarce > 0 ? [0, .5, 1] : [1];
  const health = g.players.map((p, j) => p.health - g.raid.damage[j]);
  let best = [], bestScore = -Infinity;
  for (const budget of budgets){
    const take = n => Math.ceil(n * budget);
    const core = myArmy.core.map(u => ({...u, tr:take(u.tr)}));
    let train = take(myArmy.core.reduce((n, u) => n + u.tr, 0));
    // Respect the aggregate budget when Training is spread across several units.
    for (const u of core){ u.tr = Math.min(u.tr, train); train -= u.tr; }
    for (const order of permutations(core)){
      const deck = assemble(order, take(myArmy.recs), take(myArmy.arm), false, budget === .5,
        take(myArmy.sh), myArmy.gear.slice(0, take(myArmy.gear.length)));
      const spent = deck.reduce((n, u) => n + (u.name === 'Recruit') + !!u.gear + u.arm + u.sh + u.tr, 0);
      let score = 0;
      for (const guess of guesses){
        const res = runBattle(cfgs.map((cfg, j) => ({...cfg, units:j === i ? deck : guess})), false);
        const damage = res.result.w === attacker ? res.left[attacker] : 0;
        const lethal = damage > 0 && damage >= health[1 - attacker];
        score += (i === attacker ? 1 : -1) * (damage + (lethal ? 12 : 0));
      }
      score = score / guesses.length - spent * (first ? .18 : .001);
      if (score > bestScore){ bestScore = score; best = deck; }
    }
  }
  return best;
}
