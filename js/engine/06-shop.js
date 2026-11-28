/* ===================== SHOP ACTIONS: ONE DOOR =====================
   Every shop action (yours, the AI's, an online opponent's) goes through shopAct. Code that needs to know about
   actions sets SHOP_WATCH instead of wrapping engine functions: the match recorder on the page records each one with
   the board as it was before, and the AI worker reports the moves it took. Nothing is watched in the tests.
   A new shop action: write its NAMERule and add one line below, so it is recorded and reported too. */
const cardKind = n => DEFS[n] ? 'u' : 'b';
const ownsCard = (st, n) => (cardKind(n) === 'u' ? st.hand[n] : isGear(n) ? (st.gear || {})[n] : st.city[n]) || 0;
// Could this player hold one more of the card? Ignores money and buys. st is anything with {hand, city}:
// a real player or a hypothetical one. Returns why not, or null if it can.
function cantAcquire(st, name, kind){
  if (kind === 'u') return !exemptUnit(name) && (st.hand[name] || 0) >= uMax(name) ? 'Already at highest level' : null;
  if (isGear(name)) return null;   // gear goes to your hand: no limit
  if (name === "Mason's Guild") return masonTargets(st).length ? null : 'No building to level up';
  if (name !== 'Field' && (st.city[name] || 0) >= BDEFS[name].lv.length) return 'Already at highest level';
  if ((name === 'Field' || !st.city[name]) && slotsUsed(st) >= citySlots(st)) return 'City is full';
  return null;
}
// The buy button's wording when a card can't be bought: how much more money, or which buys are used up this shop.
function whyNot(info, p){
  if (info.price != null && p.money < info.price) return `Need $${info.price - p.money} more`;
  if (info.why === 'Buys used up') return 'No buys left this round';
  if (info.why === 'One Field per shop') return 'Only one Field per shop';
  return info.why;
}
function buyInfo(g, i, name, kind, src, idx){ const o = {src, idx, who:i}; return buyQuote(g.players[i], g.buys[i], name, kind, src, mirSur(mirOf(g, o)), pairOf(g, o), mirOf(g, o).length); }
// The price and buy slot for one card, or why it can't be bought. p is anything with {hand, city, money}
// and b the buys used this shop, so the AI can price hypothetical purchases the same way.
// nm: how many miracles are under the card (Chapel)
function buyQuote(p, b, name, kind, src, sur, pair, nm){
  const Dd = kind === 'u' ? DEFS[name] : BDEFS[name];
  let price = (name === 'Recruit' && kind === 'u' && p.city && p.city['Muster Hall'] ? 0 : Dd.c) + (sur || 0);   // Muster Hall: Recruits cost $0. miracle surcharge: discounts below apply to the total
  const no = cantAcquire(p, name, kind); if (no) return {ok:false, why:no};
  // War College buys duplicates of owned cards from the discard pile for free, using a buy.
  if (src === 'mu' && !(p.city && p.city['War College'])) return {ok:false, why:'Needs War College'};
  if (src === 'mu' && !(ownsCard(p, name) > 0)) return {ok:false, why:'Only duplicates of your cards'};
  pair = pair || [];
  const nFld = (name === 'Field' ? 1 : 0) + pair.filter(n => n === 'Field').length;
  const fcap = fieldCap(p);
  if (nFld && (b.fld || 0) + nFld > fcap) return {ok:false, why:fcap === 1 ? 'One Field per shop' : `${fcap} Fields per shop`};
  if (pair.length){
    // Covenant: every card on top must fit too, counted one after another (two buildings need two City slots)
    const st = {hand:{...p.hand}, city:{...p.city}, gear:{...(p.gear || {})}}, add = n => { if (kind === 'u') st.hand[n] = (st.hand[n] || 0) + 1; else if (isGear(n)) st.gear[n] = (st.gear[n] || 0) + 1; else if (n !== "Mason's Guild") st.city[n] = (st.city[n] || 0) + 1; else { const t = masonTargets(st)[0]; if (t) st.city[t]++; } };
    add(name);
    for (const n of pair){ const why = cantAcquire(st, n, kind); if (why) return {ok:false, why:`${n}: ${why}`}; add(n); }
    price += pairCost(pair, kind);
  }
  let slot;
  const baseOk = baseLeft(b) > 0;   // buys of any kind, units or buildings
  if (baseOk) slot = 'base';
  else if (b.carp < bVal(p, "Carpenter's Guild")) slot = 'carp';   // Carpenter's Guild: extra buys of any kind
  else if (b.fav > 0) slot = 'fav';   // Divine Favor: an extra buy at normal price
  else return {ok:false, why:'Buys used up'};
  if (kind === 'b' && !isGear(name) && bVal(p, "Carpenter's Guild")){ const nb = 1 + pair.filter(n => !isGear(n)).length; price = Math.max(nb, price - nb); }   // Carpenter's Guild discount, each building (not gear)
  let chap = 0, wc = 0;
  if (nm && (src === 'du' || src === 'db' || src === 'fz') && bVal(p, 'Chapel')){ chap = Math.min(price, bVal(p, 'Chapel')); price -= chap; }   // Chapel: cards with miracles under them
  if (src === 'mu'){ wc = price; price = 0; }   // War College: duplicates from the discard pile are free
  if (src === 'bm') price = Math.max(0, price - bmOff(p));   // Black Market discount: $1/$2/$3 by level
  const disc = p.discArm ? mirDisc(p) : null; if (disc) price = Math.max(0, price - MIRS[disc].disc);   // Patronage (once played): next card costs less
  if (p.money < price) return {ok:false, price, slot, disc, why:`Needs $${price}`};
  return {ok:true, price, slot, disc, chap, wc};
}
// the discount miracle in hand the next buy would use (the biggest), or null
function mirDisc(p){ let best = null; for (const n of (p && p.mir) || []) if (MIRS[n] && MIRS[n].disc && (!best || MIRS[n].disc > MIRS[best].disc)) best = n; return best; }
const bmOff = p => Math.max(1, bLvl(p, 'Black Market'));
// shared buys left this shop (units and buildings draw from the same pool)
// Fields you may buy this shop
function fieldCap(p){ return ruleOf(p, 'fps', RULES.fieldsPerShop); }
function baseLeft(b){ return buysOf(b) - (b.u + b.b); }
function useSlot(b, kind, slot, name){
  if (name === 'Field') b.fld = (b.fld || 0) + 1;
  if (slot === 'base'){
    if (kind === 'u') b.u++; else b.b++;
  } else if (slot === 'carp') b.carp++;
  else if (slot === 'fav') b.fav--;
}
function sourceCard(g, i, src, idx){
  if (src === 'du') return g.disp.u[idx] && {name:g.disp.u[idx].name, kind:'u'};
  if (src === 'db') return g.disp.b[idx] && {name:g.disp.b[idx].name, kind:'b'};
  if (src === 'field') return {name:'Field', kind:'b'};
  if (src === 'recruit') return {name:'Recruit', kind:'u'};
  if (src === 'bm' || src === 'vis'){ const pk = peekOf(g, i, src); return pk && pk.cards[idx] && {name:pk.cards[idx], kind:pk.k}; }
  if (src === 'mu') return g.muster && g.muster[idx] && {name:g.muster[idx], kind:cardKind(g.muster[idx])};
  if (src === 'fz') return g.frozen && g.frozen[i] && g.frozen[i][idx] && {name:g.frozen[i][idx].name, kind:g.frozen[i][idx].kind};
  return null;
}

function shopAct(name, rule, g, i, args){
  if (!SHOP_WATCH) return rule(g, i, ...args);
  const t = SHOP_WATCH.before(g, i, name, args);
  const r = rule(g, i, ...args);
  SHOP_WATCH.after(t, r);
  return r;
}
function buy(g, i, ...a){ return shopAct('buy', buyRule, g, i, a); }
function sell(g, i, ...a){ return shopAct('sell', sellRule, g, i, a); }
function pass(g, i, ...a){ return shopAct('pass', passRule, g, i, a); }
function useBM(g, i, ...a){ return shopAct('useBM', useBMRule, g, i, a); }
function useFavor(g, i, ...a){ return shopAct('useFavor', useFavorRule, g, i, a); }
function useVision(g, i, ...a){ return shopAct('useVision', useVisionRule, g, i, a); }
function useDisc(g, i, ...a){ return shopAct('useDisc', useDiscRule, g, i, a); }
function useWrit(g, i, ...a){ return shopAct('useWrit', useWritRule, g, i, a); }
function useFreeze(g, i, ...a){ return shopAct('useFreeze', useFreezeRule, g, i, a); }
function useRedeal(g, i, ...a){ return shopAct('useRedeal', useRedealRule, g, i, a); }
function buyRule(g, i, src, idx, attach, writ){
  if (g.phase !== 'shop' || cur(g) !== i || altarWaiting(g, i)) return false;
  noteSeen(g, i);
  const sc = sourceCard(g, i, src, idx); if (!sc) return false;
  const info = buyInfo(g, i, sc.name, sc.kind, src, idx); if (!info.ok) return false;
  const p = g.players[i], b = g.buys[i], mir = mirOf(g, {src, idx, who:i}).slice(), pair = pairOf(g, {src, idx, who:i}).slice();
  const scObj = slotOf(g, {src, idx, who:i}), cid = scObj && scObj.id != null ? scObj.id : null;
  const spot = src === 'du' || src === 'db' ? {k:src === 'du' ? 'u' : 'b', at:(scObj || {}).at} : src === 'fz' ? {k:sc.kind, at:null} : null;
  // the situation at the moment of buying (before paying), for situational card opinions
  if (sc.name === "Mason's Guild"){ const ts = masonTargets(p); if (!ts.includes(attach)) attach = ts[0]; }
  p.money -= info.price;
  if (info.disc){ const j = p.mir.indexOf(info.disc); if (j >= 0){ p.mir.splice(j, 1); toSal(g, [info.disc]); } p.discArm = false; }   // the discount miracle is used up
  useSlot(b, sc.kind, info.slot, sc.name);
  if (src === 'du') g.disp.u.splice(idx, 1);
  if (src === 'db') g.disp.b.splice(idx, 1);
  if (src === 'mu') g.muster.splice(idx, 1);
  if (src === 'fz') g.frozen[i].splice(idx, 1);
  if (src === 'bm' || src === 'vis'){
    // a peek (Black Market or Vision): one card only; the others go back under the deck
    peekOf(g, i, src).cards.splice(idx, 1);
    endPeek(g, i, src);
  }
  if (sc.kind === 'u') p.hand[sc.name] = (p.hand[sc.name] || 0) + 1;
  else if (isGear(sc.name)){ p.gear = p.gear || {}; p.gear[sc.name] = (p.gear[sc.name] || 0) + 1; }
  else if (sc.name === "Mason's Guild"){ p.city[attach] = (p.city[attach] || 0) + 1; p.mason = p.mason || {}; p.mason[attach] = (p.mason[attach] || 0) + 1; }
  else p.city[sc.name] = (p.city[sc.name] || 0) + 1;
  p.bought.push(sc.name);
  if (g.shopBought) g.shopBought[i].push(sc.name);
  // Covenant: the cards on top come along (a Mason's Guild among them goes on the building it would level best)
  const pairGot = [];
  for (const n of pair){
    if (sc.kind === 'u') p.hand[n] = (p.hand[n] || 0) + 1;
    else if (isGear(n)){ p.gear = p.gear || {}; p.gear[n] = (p.gear[n] || 0) + 1; }
    else if (n === "Mason's Guild"){ const t = aiMasonTarget(g, i); if (!t) continue; p.city[t] = (p.city[t] || 0) + 1; p.mason = p.mason || {}; p.mason[t] = (p.mason[t] || 0) + 1; }
    else p.city[n] = (p.city[n] || 0) + 1;
    p.bought.push(n); if (g.shopBought) g.shopBought[i].push(n); pairGot.push(n);
  }
  const extra = (info.slot === 'carp' ? " (Carpenter's Guild)" : '') + (src === 'bm' ? ` (Black Market, $${bmOff(p)} off)` : '') + (src === 'mu' ? ' from the discard pile (War College)' : '');
  const extraFull = extra + (info.slot === 'fav' ? ' (Divine Favor)' : '') + (src === 'vis' ? ' (Vision)' : '') + (info.disc ? ` (${info.disc}, $${MIRS[info.disc].disc} off)` : '') + (info.chap ? ` (Chapel, $${info.chap} off)` : '') + '';
  g.log.push({t:`${g.labels[i]} ${src === 'mu' ? (g.labels[i]==='You'?'take':'takes') : g.labels[i]==='You'?'buy':'buys'} ${sc.name}${sc.name === "Mason's Guild" ? ` for ${attach}` : ''}${pairGot.length ? ` and ${pairGot.join(' and ')} (Covenant)` : ''} for $${info.price}${extraFull}${src === 'fz' ? ' (frozen)' : ''}.`, side:i, ev:{a:'buy', n:sc.name, k:sc.kind, price:info.price, on:sc.name === "Mason's Guild" ? attach : null, pair:pairGot.length ? pairGot : undefined, src, idx, id:cid, at:spot ? spot.at : null}});
  const again = mir.length ? gainMiracles(g, i, mir, writ, spot) : false;
  if (spot && (src === 'du' || src === 'db')) refillRow(g, spot.k, spot.at);
  if (again) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'take':'takes'} another shop turn (Discard Writ).`, side:i});
  else nextTurn(g);
  return true;
}
// Discard Writ: right away, up to 2 other display units go face-up to the discard pile (miracles under them are discarded)
// and new cards are dealt from the unit deck to replace them.
// names: the units the buyer chose (a person always passes a list, maybe empty); without one, the AI picks.
function useWritRule(g, i, n, names){
  const pick = Array.isArray(names) ? names.slice(0, n) : asSeenBy(g, i, () => writPick(g, i, n).map(x => x.name));
  const moved = [];
  for (const nm of pick){
    const kd = g.disp.u.some(c => c.name === nm) ? 'u' : 'b', row = g.disp[kd];
    const k = row.findIndex(c => c.name === nm); if (k < 0) continue;
    const was = row.splice(k, 1)[0]; (g.muster || (g.muster = [])).push(nm, ...(was.pair || [])); moved.push(nm); toSal(g, was.mir);
    const c = dealCard(g, kd); if (c){ c.at = was.at; row.splice(k, 0, c); }   // a new card from its own deck takes its place
  }
  g.log.push({t:moved.length ? `${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Discard Writ: ${moved.join(' and ')} ${moved.length > 1 ? 'go' : 'goes'} to the discard pile.`
                             : `${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Discard Writ and ${g.labels[i]==='You'?'move':'moves'} nothing.`, side:i});
}
// AI choice for Discard Writ. Denying a unit the opponent doesn't own is worth half its value to them (they may not want
// it). A unit the AI owns is also saved for its own later level-up, so it adds what buying it is worth to the AI. A unit
// neither owns is lost to the AI too, so its own interest in it is subtracted. Units the opponent owns are left alone:
// in the discard pile they could still buy them. n null: rank them all.
function writPick(g, i, n){
  const me = g.players[i], op = g.players[1 - i], oh = pubHand(op), out = [];
  for (const c of g.disp.u.map(x => ({...x, kd:'u'})).concat(g.disp.b.map(x => ({...x, kd:'b'})))){
    if (out.some(x => x.name === c.name)) continue;
    const mine = ownsCard(me, c.name) > 0, theirs = (c.kd === 'u' ? oh[c.name] : op.city[c.name]) > 0;
    if (theirs) continue;
    const myV = aiValue(g, i, c.name, c.kd), deny = 0.5 * Math.max(0, aiValue(g, 1 - i, c.name, c.kd));
    // owned: saved for my level-up AND kept from them; not owned: kept from them, but I can't buy it either
    const v = mine ? myV + deny : deny - Math.max(0, myV);
    if (v > 0) out.push({name:c.name, v});
  }
  out.sort((a, b) => b.v - a.v);
  return n == null ? out.slice(0, MIRS['Discard Writ'].writ) : out.slice(0, n);
}
// The miracles under a bought card: money ones pay out now, the rest go to the buyer's hand
function gainMiracles(g, i, mir, writ, spot){
  const p = g.players[i], you = g.labels[i] === 'You', parts = [], writs = [];
  let mill = 0, rst = 0;
  for (const n of mir){
    const m = MIRS[n];
    if (m.cash){ p.money += m.cash; parts.push(`${n} (+$${m.cash})`); toSal(g, [n]); }
    else if (m.writ){ writs.push(m.writ); parts.push(`${n} (used now)`); toSal(g, [n]); }
    else if (m.cov){ toSal(g, [n]); }   // Covenant did its work when it was dealt (the log line for the buy names its cards)
    else if (m.mill){ mill += m.mill; parts.push(`${n} (used now)`); toSal(g, [n]); }
    else if (m.rst){ rst += m.rst; parts.push(`${n} (used now)`); toSal(g, [n]); }
    else { (p.mir || (p.mir = [])).push(n); parts.push(`${n} (to hand)`); }
    if (g.mirGot) g.mirGot[i].push(n);
    if (g.mirShop) g.mirShop[i].push(n);
  }
  if (parts.length) g.log.push({t:`${g.labels[i]} ${you ? 'receive' : 'receives'} ${parts.join(' and ')}.`, side:i});
  // Mill: the top units of the unit deck go face-up to the discard pile (a miracle turned up goes to the bottom)
  if (mill){
    const out = peekCards(g.uDeck, mill); (g.muster || (g.muster = [])).push(...out);
    g.log.push({t:out.length ? `Mill: ${out.join(', ')} ${out.length > 1 ? 'go' : 'goes'} to the discard pile.` : 'Mill: the unit deck is empty.', side:i});
  }
  // Restock: new cards from the bought card's deck go into the display (the first into its empty spot)
  if (rst && spot){
    const row = g.disp[spot.k], got = [];
    for (let r = 0; r < rst; r++){
      const c = dealCard(g, spot.k); if (!c) break;
      const used = new Set(row.filter(x => x.at != null).map(x => x.at));
      let at = r === 0 && spot.at != null && !used.has(spot.at) ? spot.at : 0; while (used.has(at)) at++;
      c.at = at; row.push(c); got.push(c.name);
    }
    g.log.push({t:got.length ? `Restock: ${got.join(' and ')} ${got.length > 1 ? 'are' : 'is'} dealt into the display.` : 'Restock: that deck is empty.', side:i});
  }
  // two Writs under one card move up to 4; a person's list covers them all
  if (writs.length){ const tot = writs.reduce((a, b) => a + b, 0); useWrit(g, i, tot, writ); }
  return writs.length > 0;   // Discard Writ: the buyer shops again before the opponent
}
// Divine Favor: from hand on your shop turn, adds one extra buy at normal price this shop
function useFavorRule(g, i){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  const j = (p.mir || []).indexOf('Divine Favor'); if (j < 0) return false;
  const k = Math.max(1, MIRS['Divine Favor'].fav | 0);
  p.mir.splice(j, 1); toSal(g, ['Divine Favor']); g.buys[i].fav += k; g.buys[i].favN += k;
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Divine Favor: one extra buy this shop.`, side:i});
  return true;
}
// Patronage: played from hand on your shop turn; the next card you buy costs less, then it's discarded.
// on false takes it back into hand unplayed (before buying anything with it).
function useDiscRule(g, i, on){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  const n = mirDisc(p); if (!n) return false;
  on = on !== false && on !== 0;
  if (!!p.discArm === on) return false;
  p.discArm = on;
  g.log.push({t:on ? `${g.labels[i]} ${g.labels[i]==='You'?'play':'plays'} ${n}: the next card costs $${MIRS[n].disc} less.` : `${g.labels[i]} ${g.labels[i]==='You'?'take':'takes'} ${n} back into hand.`, side:i});
  return true;
}
// Freeze: from hand, as your shop turn, set aside a display card with its miracles (and Covenant cards); its spot stays
// empty this shop. Only you may buy it, at its normal price, on any later shop turn.
function canFreeze(g, i){ const p = g.players[i]; return g.phase === 'shop' && cur(g) === i && !g.passed[i] && (p.mir || []).some(n => MIRS[n] && MIRS[n].frz); }
function useFreezeRule(g, i, src, idx){
  if (!canFreeze(g, i) || (src !== 'du' && src !== 'db')) return false;
  const row = g.disp[src === 'du' ? 'u' : 'b'], c = row[idx]; if (!c) return false;
  noteSeen(g, i);
  const p = g.players[i], j = p.mir.findIndex(n => MIRS[n] && MIRS[n].frz), fn = p.mir[j];
  p.mir.splice(j, 1); toSal(g, [fn]); row.splice(idx, 1);
  g.frozen = g.frozen || [[], []];
  g.frozen[i].push({name:c.name, kind:src === 'du' ? 'u' : 'b', mir:c.mir || [], pair:c.pair, id:c.id});
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} ${fn}: ${c.name}${c.pair && c.pair.length ? ` (with ${c.pair.join(' and ')})` : ''} is set aside for ${g.labels[i]==='You'?'you':g.labels[i]}.`, side:i, ev:{a:'freeze', n:c.name, k:src === 'du' ? 'u' : 'b', id:c.id, at:c.at}});
  nextTurn(g);
  return true;
}
// Upheaval: from hand on your shop turn (it doesn't use your turn), every display card goes face up to the discard pile
// (its miracles are discarded; Covenant cards on top go with it), then each row is dealt full again from its own deck.
// Frozen cards are not in the display, so they stay set aside.
function canRedeal(g, i){ const p = g.players[i]; return g.phase === 'shop' && cur(g) === i && !g.passed[i] && (p.mir || []).some(n => MIRS[n] && MIRS[n].rdl); }
function useRedealRule(g, i){
  if (!canRedeal(g, i)) return false;
  noteSeen(g, i);
  const p = g.players[i], j = p.mir.findIndex(n => MIRS[n] && MIRS[n].rdl), fn = p.mir[j];
  p.mir.splice(j, 1); toSal(g, [fn]);
  g.muster = g.muster || []; g.leaving = {u:[], b:[]};
  const out = [];
  for (const k of ['u','b']){
    g.disp[k].forEach((c, jj) => { g.leaving[k].push({name:c.name, j:jj, at:c.at}); g.muster.push(c.name, ...(c.pair || [])); toSal(g, c.mir); out.push(c.name); });
    g.disp[k] = [];
    const size = dispSize(g, k);
    for (let a = 0; g.disp[k].length < size; a++){ const c = dealCard(g, k); if (!c) break; c.at = a; g.disp[k].push(c); }
  }
  const you = g.labels[i] === 'You';
  g.log.push({t:`${g.labels[i]} ${you ? 'use' : 'uses'} ${fn}: ${out.length ? `${out.join(', ')} ${out.length > 1 ? 'go' : 'goes'} to the discard pile and` : ''} a new display is dealt.`, side:i, ev:{a:'redeal'}});
  return true;
}
// AI: what a fresh display is worth to me over this one: the best few buys I could make from it, less this display's,
// averaged over a few deals drawn at random from what's left in the decks (it doesn't know their order)
function aiRedealGain(g, i, G, mE){
  const p = g.players[i], b = g.buys[i], left = Math.max(1, baseLeft(b)), memo = new Map();
  const val = (n, k) => { const key = k + '|' + n; if (!memo.has(key)) memo.set(key, aiValue(g, i, n, k)); return memo.get(key); };
  const best = cards => {
    const vs = [];
    for (const c of cards){
      const q = buyQuote(p, b, c.name, c.kind, c.kind === 'u' ? 'du' : 'db', mirSur(c.mir), c.pair, (c.mir || []).length); if (!q.ok) continue;
      const v = val(c.name, c.kind) - q.price * G.m * mE; if (v > 0) vs.push(v);
    }
    vs.sort((x, y) => y - x); return vs.slice(0, left).reduce((s, v) => s + v, 0);
  };
  const now = best(g.disp.u.map(c => ({...c, kind:'u'})).concat(g.disp.b.map(c => ({...c, kind:'b'}))));
  const pools = {u:g.uDeck.filter(n => !isMir(n)), b:g.bDeck.filter(n => !isMir(n))};
  const rnd = g.rnd || Math.random, N = 8;
  let tot = 0;
  for (let t = 0; t < N; t++){
    const cards = [];
    for (const k of ['u','b']){
      const pool = pools[k].slice(), size = dispSize(g, k);
      for (let a = 0; a < size && pool.length; a++){ const r = Math.floor(rnd() * pool.length); cards.push({name:pool[r], kind:k, mir:[]}); pool.splice(r, 1); }
    }
    tot += best(cards);
  }
  return tot / N - now;
}
// Vision: from hand on your shop turn, look at the top 3 of either deck and buy one (with a normal buy, normal price)
function useVisionRule(g, i, k){
  k = k === 'b' ? 'b' : 'u';
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i] || peekOf(g, i, 'vis')) return false;
  const j = (p.mir || []).indexOf('Vision'); if (j < 0) return false;
  p.mir.splice(j, 1); toSal(g, ['Vision']);
  const cards = startPeek(g, i, 'vis', k, MIRS.Vision.vis);
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'use':'uses'} Vision: top ${cards.length} ${k === 'b' ? 'buildings' : 'units'}.`, side:i});
  return true;
}
// Selling: on your shop turn, as a free action (no buy used, turn doesn't end), sell one copy of a unit or building
// for a flat $1. It drops a level (or leaves if it was the last copy). The card goes to the bottom of its deck;
// Fields and Recruits go back to the supply, and a level that came from Mason's Guild sends the Guild back instead.
// Cards bought this shop can be sold back the same shop too.
const SELL_PRICE = 1;
function canSell(g, i, kind, name){
  const p = g.players[i];
  if (g.phase !== 'shop' || cur(g) !== i || g.passed[i]) return false;
  if (name === 'Recruit' || name === 'Altar of Blood' || altarWaiting(g, i) || !(kind === 'u' ? p.hand[name] : isGear(name) ? (p.gear || {})[name] : p.city[name])) return false;
  return true;
}
// The AI never sells a card it bought earlier in this same shop: that only undoes the purchase, at a loss, and
// wastes a buy (the look-ahead can talk itself into it when a shallower look at the first decision disagrees).
function aiCanSell(g, i, kind, name){
  if (!canSell(g, i, kind, name)) return false;
  const got = (g.shopBought && g.shopBought[i]) || [], p = g.players[i];
  if (got.includes(name)) return false;
  // selling a building that has a Mason's Guild level on it sells that level: no, if the Guild was bought this shop
  if (kind === 'b' && p.mason && p.mason[name] > 0 && got.includes("Mason's Guild")) return false;
  return true;
}
function sellRule(g, i, kind, name){
  if (!canSell(g, i, kind, name)) return false;
  const p = g.players[i];
  let back = name;
  if (kind === 'u'){ if (!--p.hand[name]) delete p.hand[name]; }
  else if (isGear(name)){ if (!--p.gear[name]) delete p.gear[name]; }
  else {
    if (p.mason && p.mason[name] > 0){ p.mason[name]--; back = "Mason's Guild"; }
    if (!--p.city[name]) delete p.city[name];
  }
  // a sold card goes face-up to the discard pile (a sold Field returns to the supply)
  if (back !== 'Field'){ g.muster = g.muster || []; g.muster.push(back); }
  const bz = bVal(p, 'The Bazaar');   // The Bazaar: more for each card sold
  p.money += SELL_PRICE + bz;
  g.sold = g.sold || [[], []]; g.sold[i].push(name);
  const you = g.labels[i] === 'You';
  g.log.push({t:`${g.labels[i]} ${you ? 'sell' : 'sells'} ${name} for $${SELL_PRICE + bz}${bz ? ' (The Bazaar)' : ''}${back !== 'Field' ? ` (${back !== name ? back + ' ' : ''}to the discard pile)` : ''}.`, side:i, ev:{a:'sell', n:name, k:kind, gain:SELL_PRICE + bz}});
  return true;
}
// The hand an opponent believes a player has: real units plus the ones sold in secret (capped at max level)
function pubHand(p){
  if (!p.hidSold) return p.hand;
  const h = {...p.hand};
  for (const n in p.hidSold) h[n] = exemptUnit(n) ? (h[n] || 0) + p.hidSold[n] : Math.min(uMax(n), (h[n] || 0) + p.hidSold[n]);
  return h;
}
// unit names in a hand that count for learned pairings (Recruits and Mercenaries are left out)
function ctxUnits(h){ return Object.keys(h || {}).filter(n => h[n] > 0 && DEFS[n] && !DEFS[n].token && !exemptUnit(n)); }
// Run an AI decision for player i while its opponent's hand shows only what i can know
function asSeenBy(g, i, fn){
  const o = g.players[1 - i];
  if (!o.hidSold || o._realHand) return fn();
  o._realHand = o.hand; o.hand = pubHand(o);
  try{ return fn(); } finally { o.hand = o._realHand; delete o._realHand; }
}
// AI: peek at whichever deck it expects to find more in (ties and empty decks fall back to units)
function aiBMKind(g, i){
  if (g._po) return g.uDeck.length ? 'u' : 'b';
  const n = bVal(g.players[i], 'Black Market');
  if (!g.bDeck.length) return 'u';
  if (!g.uDeck.length) return 'b';
  const gu = bmPeekGain(g, i, n, 'u'), gb = bmPeekGain(g, i, n, 'b');
  return gb > gu ? 'b' : 'u';
}
function useBMRule(g, i, k){
  k = k === 'b' ? 'b' : 'u';   // Black Market looks at one deck per shop: units or buildings, not both
  const p = g.players[i];
  if (g.phase !== 'shop' || g.bmUsed[i] || !bVal(p, 'Black Market')) return false;
  const cards = startPeek(g, i, 'bm', k, bVal(p, 'Black Market')); g.bmUsed[i] = true;
  g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'look':'looks'} at the Black Market: top ${cards.length} ${k === 'b' ? 'buildings' : 'units'}.`, side:i});
  return true;
}
function passRule(g, i){
  if (g.phase !== 'shop' || cur(g) !== i) return false;
  if (altarWaiting(g, i)) altarDiscard(g, i, g.altarPend[i][0]);
  noteSeen(g, i);
  g.passed[i] = true; g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'pass':'passes'}.`, side:i});
  nextTurn(g); return true;
}
function nextTurn(g){
  if (g.passed[0] && g.passed[1]){ endShop(g); return; }
  g.turnIdx = 1 - g.turnIdx;
  if (g.passed[g.order[g.turnIdx]]) g.turnIdx = 1 - g.turnIdx;
}
function endShop(g){
  if (g.seen){
    const offers = g.offers || (g.offers = []), states = g.states || (g.states = []);
    for (const i of [0,1]){
      const lead = g.shopLead ? g.shopLead[i] : total(g.players[i]) - total(g.players[1-i]);
      states.push({i, lead});
      const always = n => n === 'Recruit' || (BDEFS[n] && BDEFS[n].always);
      const got = new Set(g.shopBought[i].filter(n => !always(n)));
      // context for learned pairings: the units this player owns, and the enemy units it can know about
      const mine = ctxUnits(g.players[i].hand), theirs = ctxUnits(pubHand(g.players[1-i]));
      for (const n of got) offers.push({i, name:n, bought:true, lead, mine, theirs, tags:(g.buyTags && g.buyTags[i][n]) || []});
      for (const n of g.seen[i]) if (!got.has(n)) offers.push({i, name:n, bought:false, lead});
      // miracles: taken (bought the card on top) or passed over; no pairing context, so they only shape miracle opinions
      if (g.mirShop && g.mirSeen){
        const mg = new Set(g.mirShop[i]);
        for (const n of mg) offers.push({i, name:n, bought:true, lead});
        for (const n of g.mirSeen[i]) if (!mg.has(n)) offers.push({i, name:n, bought:false, lead});
      }
    }
    g.seen = null; g.mirSeen = null; g.mirShop = null;
  }
  for (const by of PEEK_BY) for (const i of [0,1]) endPeek(g, i, by);   // unbought peeked cards go back under their decks
  // Discard pile: a returning card that goes unbought again is laid face-up there (its miracles are discarded)
  g.muster = g.muster || [];
  for (const c of g.disp.u.concat(g.disp.b)) if (c.side){ g.muster.push(c.name, ...(c.pair || [])); toSal(g, c.mir); }
  g.leaving = {u:[], b:[]};
  for (const k of ['u','b']) g.disp[k].forEach((c, j) => { if (c.side) g.leaving[k].push({name:c.name, j, at:c.at}); });
  // unbought cards go sideways with their miracles; ones already sideways leave with theirs
  for (const k of ['u','b']) g.disp[k] = g.disp[k].filter(c => !c.side).map(c => ({name:c.name, side:true, mir:c.mir || [], at:c.at, id:c.id, ...(c.pair ? {pair:c.pair} : {})}));
  g.phase = 'mobilize'; g.decks = [null,null];
}
function validateDeck(g, i, spec){
  const p = g.players[i];
  // battle miracles: each placed one must be in hand (they never count as units)
  const sp = spec.filter(u => isBat(u.name));
  if (sp.length){
    if (!g.battleMir) return 'Battle miracles are not in this game.';
    const have = {}; for (const n of p.mir || []) have[n] = (have[n] || 0) + 1;
    for (const u of sp) if (!((have[u.name] = (have[u.name] || 0) - 1) >= 0)) return `You don't have another ${u.name} in hand.`;
    spec = spec.filter(u => !isBat(u.name));
  }
  const names = spec.filter(u => u.name !== 'Recruit').map(u => u.name);
  if (new Set(names).size !== names.length) return 'Each unit can only appear once (duplicates stack).';
  for (const n of names) if (!p.hand[n]) return `You don't own ${n}.`;
  const uniq = names.filter(n => !exemptUnit(n)).length;
  if (uniq > deckCap(p)) return `Your deck holds ${deckCap(p)} unique units.`;
  const rec = spec.filter(u => u.name === 'Recruit').length;
  if (rec > recAllow(p)) return 'Too many Recruits.';
  // gear: each piece must be in hand; one per unit; a Zweihander's wearer holds no Armaments or Shields
  const gh = {}; for (const u of spec) if (u.gear){
    if (!isGear(u.gear)) return `${u.gear} is not gear.`;
    if ((gh[u.gear] = (gh[u.gear] || 0) + 1) > ((p.gear || {})[u.gear] || 0)) return `You don't have another ${u.gear} in hand.`;
    if (u.gear === 'Zweihander' && (u.arm || u.sh)) return `${u.name} wields a Zweihander and can't hold Armaments or Shields.`;
  }
  const arm = spec.reduce((s,u) => s + (u.arm||0), 0), tr = spec.reduce((s,u) => s + (u.tr||0), 0);
  if (arm > armAllow(p)) return bVal(p, 'Smithy') ? 'Too many Armaments for your Smithy and miracles.' : 'Too many Armaments.';
  if (tr > trAllow(p)) return bVal(p, 'Study') ? 'Too many Training tokens for your Study and miracles.' : 'Too many Training tokens.';
  if (spec.reduce((s,u) => s + (u.sh||0), 0) > shAllow(p)) return 'Too many Shields for your Armory.';
  return null;
}
function setDeck(g, i, spec){
  const p = g.players[i], spells = [];
  // battle miracles keep their spot as the number of units ahead of them
  let k = 0; for (const u of spec){ if (isBat(u.name)) spells.push({name:u.name, at:k}); else k++; }
  (g.spells || (g.spells = [[], []]))[i] = spells;
  spec = spec.filter(u => !isBat(u.name));
  const gw = gearOk(p, spec);   // gear in hand only (anything beyond it is dropped)
  const deck = spec.map((u, k) => {
    const o = u.name === 'Recruit' ? {name:'Recruit', copies:1, arm:u.arm||0, sh:u.sh||0, tr:u.tr||0}
                                   : {name:u.name, copies:p.hand[u.name], arm:u.arm||0, sh:u.sh||0, tr:u.tr||0};
    if (gw[k]){ o.gear = gw[k]; if (gw[k] === 'Zweihander'){ o.arm = 0; o.sh = 0; } }
    return o;
  });
  g.decks[i] = deck;
  // remember who wore what, so next Mobilize starts from it (gear really goes back to the hand after the battle)
  p.equip = {}; for (const u of deck) if (u.gear && u.name !== 'Recruit') p.equip[u.name] = u.gear;
}
// the gear each deck entry actually gets: at most one each, and only as many of a kind as the hand holds
function gearOk(p, spec){
  const left = {...(p.gear || {})};
  return spec.map(u => { const n = u.gear; if (!n || !isGear(n) || !(left[n] > 0)) return null; left[n]--; return n; });
}
function finishMobilize(g){
  // battle miracles placed in a deck leave the hand now (after the battle they go to the discard pile)
  for (const i of [0,1]){
    const p = g.players[i], sp = (g.spells && g.spells[i]) || [];
    for (const x of sp){ const j = (p.mir || []).indexOf(x.name); if (j >= 0) p.mir.splice(j, 1); }
    if (sp.length) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'place':'places'} ${sp.length === 1 ? 'a battle miracle' : sp.length + ' battle miracles'} in ${g.labels[i]==='You'?'your':'their'} deck.`, side:i});
  }
  // Recruits, Armaments and Training placed beyond a player's own use up miracles from their hand
  for (const i of [0,1]){
    const p = g.players[i], d = g.decks[i] || [];
    if (!p.mir || !p.mir.length) continue;
    // a person's played miracles are spent first when they cover what was placed
    const pref = p.mirPlay; delete p.mirPlay;
    const spendP = (key, over) => {
      if (over <= 0) return [];
      if (pref && pref.length){
        const left = pref.slice(), idx = [];
        p.mir.forEach((n, j) => { const k = left.indexOf(n); if (k >= 0 && MIRS[n][key]){ left.splice(k, 1); idx.push(j); } });
        if (idx.reduce((s, j) => s + MIRS[p.mir[j]][key], 0) >= over){
          const sub = {mir:idx.map(j => p.mir[j])};
          return mirSpend(sub, key, over).map(k => idx[k]);
        }
      }
      return mirSpend(p, key, over);
    };
    const rec = spendP('rec', d.filter(u => u.name === 'Recruit').length - recBase(p));
    const arm = spendP('arm', d.reduce((s, u) => s + (u.arm || 0), 0) - bVal(p, 'Smithy'));
    const trn = spendP('tr', d.reduce((s, u) => s + (u.tr || 0), 0) - bVal(p, 'Study'));
    const used = rec.concat(arm, trn).sort((a, b) => b - a), names = used.map(j => p.mir[j]);
    for (const j of used) p.mir.splice(j, 1);
    toSal(g, names);
    if (names.length) g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'call':'calls'} on ${names.join(' and ')}.`, side:i});
  }
  for (const i of [0,1]){
    const p = g.players[i], opp = g.players[1-i];
    for (const u of g.decks[i]){
      const d = DEFS[u.name]; if (!d.m) continue;
      const l = armyLvl(u);
      let gain = d.m[l-1];
      if (u.name === 'Arsonist') gain *= (opp.city.Field || 0);
      if (gain){ p.money += gain; g.log.push({t:`${g.labels[i]} ${g.labels[i]==='You'?'gain':'gains'} $${gain} from ${u.name}.`, side:i}); }
    }
  }
  g.phase = 'battle';
}
function battleCfg(g, i){
  const p = g.players[i];
  return {units:g.decks[i], spells:(g.spells && g.spells[i]) || [], treb:bLvl(p,'Trebuchet'), yard:bVal(p,'Training Yard'), drill:bVal(p,'Muster Hall'), infirmary:!!p.city.Infirmary, label:g.labels[i]};
}
function doBattle(g, record){
  const res = runBattle([battleCfg(g,0), battleCfg(g,1)], record);
  const w = res.result.w;
  g.lastBattle = {w, res};
  (g.battles || (g.battles = [])).push({w, d:[0,1].map(i => g.decks[i].filter(u => u.name !== 'Recruit').map(u => u.name)),
    c:[0,1].map(i => Object.keys(g.players[i].city || {}).filter(n => n !== 'Field' && g.players[i].city[n] > 0))});   // buildings in each city, for building pairs and counters
  g.players.forEach((p, i) => { p.wonLast = w === i; });
  if (w >= 0) g.players[w].score++;
  omObserve(g);
  for (const i of [0,1]){ g.players[i].prevDeck = g.decks[i].map(u => ({...u})); }
  for (const i of [0,1]){ toSal(g, ((g.spells && g.spells[i]) || []).map(x => x.name)); }   // used or not, placed battle miracles are discarded
  g.log.push({t: w < 0 ? `Round ${g.round} battle is a draw.` : `${g.labels[w]} ${g.labels[w]==='You'?'win':'wins'} the round ${g.round} battle.`, side: w < 0 ? undefined : w});
  for (const p of g.players){ delete p.hand.Recruit; delete p.hand.Mercenary; }
  // win check
  const t = g.players.map(total), mx = Math.max(t[0], t[1]);
  if (mx >= g.target && t[0] !== t[1]){
    const L = t[0] > t[1] ? 0 : 1;
    if (!g.players[L].city.Cathedral || g.players[L].wonLast){ g.winner = L; g.over = true; }
  }
  if (!g.over && g.round >= RULES.maxRounds){ g.over = true; g.winner = t[0] === t[1] ? -1 : (t[0] > t[1] ? 0 : 1); }
  g.phase = g.over ? 'over' : 'shop';
  return res;
}
