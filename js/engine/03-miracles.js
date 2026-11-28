/* ===================== MIRACLES =====================
   Miracles are shuffled into the shop decks. One never sits in the display alone: when it's drawn, the next card of
   that deck is laid on top of it (another miracle drawn this way stacks too). The top card costs its price plus every
   miracle's surcharge (discounts apply to the total); its buyer gets every miracle under it. Money miracles pay out at
   once; the rest go to the buyer's hand, which both players can see. Unbought, the stack goes sideways and is
   discarded together. Black Market and Vision put any miracle they turn up on the bottom and look at one more card. */
const MIRS = {
  'Tithe':         {u:1, b:0, s:0, cash:1, sh:'$1 back now', t:'Get $1 back right away.'},
  'Windfall':      {u:1, b:1, s:1, cash:2, sh:'$2 back now', t:'Get $2 back right away.'},
  'Militia Vow':   {u:2, b:0, s:0, rec:1, sh:'hand: +1 Recruit at a Mobilize', t:'Goes to your hand. At a Mobilize, add 1 Recruit to your deck. Single use.'},
  'Call to Arms':  {u:1, b:0, s:1, rec:2, sh:'hand: +2 Recruits at a Mobilize', t:'Goes to your hand. At a Mobilize, add 2 Recruits to your deck. Single use.'},
  'Blessed Steel': {u:1, b:0, s:1, arm:2, sh:'hand: +2 Armaments at a Mobilize', t:"Goes to your hand. At a Mobilize, place 2 Armaments (on top of your Smithy's). Single use."},
  'Divine Favor':  {u:0, b:1, s:1, fav:1, sh:'hand: 1 extra buy on a shop turn', t:'Goes to your hand. On any shop turn, use it for one extra buy at normal price. Single use.'},
  'Vision':        {u:0, b:1, s:0, vis:3, sh:'hand: look at 3, buy 1', t:'Goes to your hand. On any shop turn, look at the top 3 cards of either deck and buy one at normal price (uses a normal buy). Single use.'},
  'Discard Writ':   {u:1, b:0, s:1, writ:1, sh:'now: up to 2 display cards to the discard pile', t:'Use it right away: move up to 2 other cards from the display to the discard pile (any miracles under them are discarded).'},
  'Patronage':     {u:1, b:1, s:1, disc:2, sh:'', t:''},
  'Sacred Lesson': {u:1, b:0, s:1, tr:1, sh:'hand: +1 Training token at a Mobilize', t:"Goes to your hand. At a Mobilize, place 1 Training token (on top of your Study's). Single use."},
  'Freeze':        {u:1, b:1, s:0, frz:1, sh:'', t:''},
  'Covenant':      {u:1, b:1, s:0, cov:1, sh:'', t:''},
  'Mill':          {u:1, b:0, s:0, mill:3, sh:'', t:''},
  'Restock':       {u:1, b:1, s:0, rst:1, sh:'', t:''},
  'Upheaval':      {u:1, b:1, s:0, rdl:1, sh:'', t:''},
  // battle miracles (a separate set, switched on at game start): placed in your deck at Mobilize, they resolve when they
  // become the top card. bat: what it does; bn: its number (damage, Shields, reveals silenced, extra Reveals);
  // bv: a rough worth for the AI's shopping, in Armaments
  'Ambush':        {u:1, b:0, s:1, bat:'ambush', bn:2, bv:1.6, sh:'', t:''},
  'Divine Shield': {u:0, b:1, s:1, bat:'shield', bn:1, bv:1.2, sh:'', t:''},
  'Second Wind':   {u:1, b:0, s:1, bat:'wind', bn:1, bv:1.4, sh:'', t:''},
  'Silence':       {u:1, b:0, s:0, bat:'silence', bn:1, bv:0.6, sh:'', t:''},
  'Sabotage':      {u:0, b:1, s:0, bat:'sabotage', bn:1, bv:0.8, sh:'', t:''},
};
// what each miracle does is one number (its effect key); its text is written from that number
const MIR_FX = {};
for (const n in MIRS) MIR_FX[n] = ['cash','disc','rec','arm','tr','writ','vis','fav','frz','cov','mill','rst','rdl','bn'].find(k => MIRS[n][k]);
// battle miracles: what each does when it surfaces ("unit ahead": the charging unit, or the Vanguard at battle start)
const isBat = n => !!(MIRS[n] && MIRS[n].bat);
function batFx(n){
  const m = MIRS[n], v = m.bn || 1;
  switch (m.bat){
    case 'ambush': return `Deal ${v} damage to the enemy unit ahead.`;
    case 'shield': return `Your unit ahead gains ${v === 1 ? 'a Shield' : v + ' Shields'}.`;
    case 'sabotage': return 'Remove all Armaments and Shields from the enemy unit ahead.';
    case 'wind': return 'Attach this to your unit ahead. The next time it would die, put it on the bottom of your deck with no damage instead.';
    case 'silence': return `Your opponent's next ${v === 1 ? 'reveal doesn\'t' : v + ' reveals don\'t'} trigger, battle miracles included.`;
    case 'drums': return `Your next revealed unit triggers its Reveal ${v === 1 ? 'twice' : v + 1 + ' times'}.`;
  }
  return '';
}
const BAT_SHORT = {ambush:v => `${v} damage to the enemy unit ahead`, shield:v => `your unit ahead gains ${v === 1 ? 'a Shield' : v + ' Shields'}`,
  sabotage:() => 'strip the enemy unit ahead of Armaments and Shields', wind:() => 'your unit ahead returns once instead of dying',
  silence:v => `the enemy's next ${v === 1 ? 'reveal is' : v + ' reveals are'} blanked`, drums:v => `your next Reveal triggers ${v === 1 ? 'twice' : v + 1 + ' times'}`};
const MIR_TEXT = {
  cash:v => [`$${v} back now`, `When you buy the card on top of this, get $${v} back.`],
  rec: v => [`hand: +${v} Recruit${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to add ${v} Recruit${v === 1 ? '' : 's'} to your deck.`],
  arm: v => [`hand: +${v} Armament${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to place ${v} Armament${v === 1 ? '' : 's'} (on top of your Smithy's).`],
  tr:  v => [`hand: +${v} Training token${v === 1 ? '' : 's'} at a Mobilize`, `When you buy the card on top of this, put this card in your hand. You may discard this card at a Mobilize to place ${v} Training token${v === 1 ? '' : 's'} (on top of your Study's).`],
  writ:v => [`now: ${v === 1 ? 'a display card' : `up to ${v} display cards`} to the discard pile, then shop again`, `When you buy the card on top of this, move ${v === 1 ? 'up to 1 other card' : `up to ${v} other cards`} from the display to the discard pile (any miracles under ${v === 1 ? 'it are' : 'them are'} discarded) and deal ${v === 1 ? 'a new card' : 'new cards'} from the same deck to replace ${v === 1 ? 'it' : 'them'}. Then take another shop turn before your opponent.`],
  vis: v => [`hand: look at ${v}, buy 1`, `When you buy the card on top of this, put this card in your hand. You may discard this card on any shop turn to look at the top ${v} cards of either deck and buy one at normal price (uses a normal buy).`],
  disc:v => [`hand: play it so your next buy costs $${v} less`, `When you buy the card on top of this, put this card in your hand. On your shop turn you may play it: the next card you buy, of any kind, costs $${v} less (minimum $0). Then discard this card.`],
  fav: v => [`hand: ${v === 1 ? '1 extra buy' : v + ' extra buys'} on a shop turn`, `When you buy the card on top of this, put this card in your hand. You may discard this card on any shop turn for ${v === 1 ? 'one Extra buy' : v + ' Extra buys'} at normal price.`],
  frz: v => ['hand: set aside a display card for later', 'When you buy the card on top of this, put this card in your hand. On your shop turn you may discard this card as your turn to set aside a display card and any miracles under it; its spot stays empty. You may buy it at normal price on any later shop turn, even in a later round.'],
  cov: v => [`dealt with ${v === 1 ? 'one more card' : v + ' more cards'} on top`, `When this is dealt, ${v === 1 ? 'one more card' : v + ' more cards'} from the same deck ${v === 1 ? 'is' : 'are'} dealt on top of it. The cards on top are bought together for their combined price.`],
  mill:v => [`now: the top ${v} units go to the discard pile`, `When you buy the card on top of this, send the top ${v} units of the unit deck to the discard pile.`],
  rst: v => [`now: ${v === 1 ? 'a new card' : v + ' new cards'} in the display`, `When you buy the card on top of this, deal ${v === 1 ? 'a card' : v + ' cards'} from the same deck into the shop display.`],
  rdl: v => ['hand: clear the display and deal a new one', 'When you buy the card on top of this, put this card in your hand. On your shop turn you may discard this card to send every card in the shop display to the discard pile (any miracles under them are discarded), then deal new cards until the display is full. It does not use your turn.'],
};
function mirRetext(n){
  const m = MIRS[n];
  if (m.bat){ m.sh = `battle: ${BAT_SHORT[m.bat](m.bn || 1)}`; m.t = `When you buy the card on top of this, put this card in your hand. At a Mobilize you may place it anywhere in your deck (it doesn't count as a unit). It resolves when it becomes the top card of your deck: ${batFx(n)} ("Unit ahead": the charging unit, or the Vanguard at battle start.) After the battle it goes to the discard pile.`; return; }
  const k = MIR_FX[n]; if (!k) return; const [sh, t] = MIR_TEXT[k](m[k]); m.sh = sh; m.t = t; }
for (const n in MIRS) mirRetext(n);
const isMir = n => !!MIRS[n];
// bat: with the battle miracles in, Mill and Restock make room for them; without, the battle miracles stay out
const BAT_OUT = new Set(['Mill', 'Restock']);
const mirPool = (k, bat) => Object.entries(MIRS).filter(([n, m]) => bat ? !BAT_OUT.has(n) : !m.bat).flatMap(([n, m]) => Array(m[k] | 0).fill(n));
// every miracle that's used up or discarded lands face up in the discard pile (just to see: miracles there can't be bought)
function toSal(g, names){ if (names && names.length) (g.salvMir || (g.salvMir = [])).push(...names); }
const mirSur = list => (list || []).reduce((s, n) => s + MIRS[n].s, 0);
const mirHeld = (p, key) => (p.mir || []).reduce((s, n) => s + (MIRS[n][key] || 0), 0);
// Recruits, Armaments and Training a player can place at Mobilize: their own (bought Recruits, Barracks, Smithy, Study) plus any
// miracles in hand. Placing more than their own uses up miracles (see mirSpend).
function recBase(p){ return ((p.hand && p.hand.Recruit) || 0) + bVal(p, 'Barracks') - (p.raidSpent?.rec || 0); }
function recAllow(p){ return recBase(p) + (p._noMir ? 0 : mirHeld(p, 'rec')); }
function armAllow(p){ return bVal(p, 'Smithy') - (p.raidSpent?.arm || 0) + (p._noMir ? 0 : mirHeld(p, 'arm')); }
function trAllow(p){ return bVal(p, 'Study') - (p.raidSpent?.tr || 0) + (p._noMir ? 0 : mirHeld(p, 'tr')); }
function shAllow(p){ return bVal(p, 'Armory') - (p.raidSpent?.sh || 0); }
// which miracles in hand (indexes) cover `over` extra tokens of one kind: the smallest total that covers it, then the fewest cards
function mirSpend(p, key, over){
  if (over <= 0) return [];
  const idx = []; (p.mir || []).forEach((n, j) => { if (MIRS[n][key]) idx.push(j); });
  const m = Math.min(idx.length, 12); let best = null;
  for (let mask = 1; mask < (1 << m); mask++){
    let s = 0, c = 0; for (let b = 0; b < m; b++) if (mask >> b & 1){ s += MIRS[p.mir[idx[b]]][key]; c++; }
    if (s >= over && (!best || s < best.s || (s === best.s && c < best.c))) best = {s, c, mask};
  }
  return best ? idx.slice(0, m).filter((_, b) => best.mask >> b & 1) : [];
}
// the display card (or frozen card) an option points at, or null
function slotOf(g, o){
  if (o.src === 'du') return g.disp.u[o.idx] || null;
  if (o.src === 'db') return g.disp.b[o.idx] || null;
  if (o.src === 'fz') return (g.frozen && g.frozen[o.who ?? cur(g)] || [])[o.idx] || null;
  return null;
}
// the miracles under a display card (or none)
function mirOf(g, o){ const c = slotOf(g, o); return (c && c.mir) || []; }
// Covenant: the extra cards bought together with a display card (or none)
function pairOf(g, o){ const c = slotOf(g, o); return (c && c.pair) || []; }
const pairCost = (pair, kind) => (pair || []).reduce((s, n) => s + ((kind === 'u' ? DEFS : BDEFS)[n] || {c:0}).c, 0);
// draw the next display card: miracles drawn on the way stack under it
function dealCard(g, k){
  const deck = k === 'u' ? g.uDeck : g.bDeck, mir = [];
  while (deck.length){ const n = deck.pop(); if (isMir(n)) mir.push(n); else {
    if (mir.length && g.mirShown) for (const m of mir) g.mirShown[m] = (g.mirShown[m] || 0) + 1;
    const c = {name:n, side:false, mir, id:g.cid = (g.cid || 0) + 1};   // id: which physical card this is, so the screen can follow it
    // Covenant: one more card from the same deck is dealt on top; the two are bought together
    const nCov = mir.reduce((s, m) => s + (MIRS[m].cov || 0), 0);
    if (nCov){ const extra = peekCards(deck, nCov); if (extra.length) c.pair = extra; }
    return c; } }
  for (const m of mir) deck.unshift(m);   // nothing left to cover them: they wait at the bottom
  return null;
}
// Automatic shop refills (optional, set at the start of a game): a bought display card is replaced right away from its
// own deck, into the spot it was bought from (only that spot: a gap left by Freeze stays empty)
function refillRow(g, k, at){
  if (!g.refill || at == null) return;
  const size = dispSize(g, k), row = g.disp[k];
  if (row.length >= size || row.some(c => c.at === at)) return;   // full, or Restock already filled the spot
  const c = dealCard(g, k); if (!c) return;
  c.at = at;
  const j = row.findIndex(x => x.at != null && x.at > at); if (j < 0) row.push(c); else row.splice(j, 0, c);
}
// take n cards off the top of a deck to look at; a miracle goes to the bottom and one more card is looked at
function peekCards(deck, n){
  const cards = [], skip = [];
  while (cards.length < n && deck.length){ const c = deck.pop(); if (isMir(c)) skip.push(c); else cards.push(c); }
  for (const c of skip) deck.unshift(c);
  return cards;
}
/* Black Market and Vision are one thing in the rules: a peek. The top cards of one deck are set aside for one player,
   tagged by what took them ('bm' or 'vis'); a player can have one of each at a time (even on the same deck: the second
   sees the cards under the first). Buying one of them puts the rest under the deck it came from; so does the end of the
   shop. They differ only in price (Black Market takes $1/$2/$3 off) and in what they use up. */
const PEEK_BY = ['bm', 'vis'];
function peekOf(g, i, by){ const L = g.peek && g.peek[i]; return (L && L.find(p => p.by === by)) || null; }
function startPeek(g, i, by, k, n){
  const cards = peekCards(k === 'u' ? g.uDeck : g.bDeck, n);
  (g.peek || (g.peek = [[], []]))[i].push({by, k, cards});
  return cards;
}
function endPeek(g, i, by){
  const L = g.peek && g.peek[i], j = L ? L.findIndex(p => p.by === by) : -1; if (j < 0) return;
  const pk = L[j], deck = pk.k === 'u' ? g.uDeck : g.bDeck;
  // The Fence: the cards you didn't buy are discarded (face up in the discard pile). Vision still puts them under the deck.
  if (by === 'bm'){ g.muster = g.muster || []; g.muster.push(...pk.cards); }
  else for (const c of pk.cards) deck.unshift(c);
  L.splice(j, 1);
}
