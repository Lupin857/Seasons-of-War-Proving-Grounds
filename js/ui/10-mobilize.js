/* ===================== MOBILIZE =====================
   Setting your deck in secret before each battle. Everything for the Mobilize screen lives in this file: the deck
   data helpers, drawing the deck and the bench, and one input controller. (It replaces the old tap-to-move,
   tap-to-swap and drag code, which ran side by side and could step on each other.)

   DATA. ui.draft is the deck, front (fights first) to back. Each entry is {id, name, arm, tr, sh, tko, gear}.
   `id` is for this screen only: draftFromDeck() drops it before the deck goes to the rules or online play. Every
   move, drop and animation goes by id, so duplicates and Drifters can never be mixed up with each other.

   INPUT. Drag moves things, a tap reads a card.
     Mouse: press and move to drag; a click opens the card.
     Touch or pen: hold a card still for a moment to lift it (a quick swipe still scrolls the page), then drag;
       a tap opens the card.
     Units drag between the bench and the deck. Tokens and gear drag onto a unit to attach, and off a unit back to
     the bench. A drop anywhere else puts the card back where it came from.
   The opened card has buttons too (Add to deck, Move to bench, Take off tokens and gear), for the keyboard. */

const SLIDE = 'cubic-bezier(.22,.9,.3,1)';
const MZ_HOLD = 200, MZ_SLOP = 8, MZ_MOUSE = 5, MZ_MS = 240, MZ_STRIP = .36;
let MZ_N = 0;
const mzIds = d => { for (const u of d || []) if (u && !u.id) u.id = 'm' + (++MZ_N); return d; };
const mzMe = () => G.players[seat()];
const mzActive = () => !!(G && G.phase === 'mobilize' && !ui.battle && ui.draft && !ui.planning && !(PP() && ui.handoff != null)
  && !(G.net && NET && NET.acts.length > NET.applied[NET.seat]) && !matMobBusy());
const mzIdx = id => (ui.draft || []).findIndex(u => u.id === id);
const mzUnit = id => (ui.draft || [])[mzIdx(id)] || null;

/* ---------- tokens and gear ---------- */
// rules text for the token cards (the Cards tab and the desktop card panel read these too)
const TOKRULES = {
  arm:'Attach to a unit for this battle. Stacks.',
  tr:'Attach to a unit for this battle. Not on units at max level.',
  sh:'Attach to a unit for this battle. Stacks.'
};
const TOKN = {arm:'Armament', tr:'Training', sh:'Shield'}, TOKFX = {arm:'+1 power', tr:'+1 level', sh:'blocks a hit'};
const TOKA = {arm:'an Armament', tr:'a Training token', sh:'a Shield'};
// the order a unit's tokens were attached, oldest first (kept in u.tko as a/t/s), always matching its counts
function tokOrder(u){
  const o = [...(u.tko || '')].map(c => c === 'a' ? 'arm' : c === 's' ? 'sh' : 'tr');
  for (const k of ['arm', 'tr', 'sh']){
    let have = o.filter(x => x === k).length;
    const want = u[k] || 0;
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
  const k = o.splice(j, 1)[0]; u[k] = Math.max(0, (u[k] || 0) - 1); setTokOrder(u, o); return k;
}
// copies a deck unit has (a Drifter is always one card)
const mzCopies = name => name === 'Recruit' ? 1 : (mzMe().hand[name] || 1);
// a deck unit's level: copies plus Training (Drifters are also trained by Ration Line), capped at the card's top level
function mzLevel(u){
  const tr = u.name === 'Recruit' ? Math.max(u.tr || 0, bVal(mzMe(), 'Muster Hall')) : (u.tr || 0);
  return Math.min(mzCopies(u.name) + tr, uMax(u.name));
}
function gearPow(n){ const d = BDEFS[n]; if (!d || !d.gear) return null; return ['Zweihander', 'Battle Axe', 'Heirloom Blade', 'Lance'].includes(n) ? d.lv[0] : 0; }
// the power a deck unit goes into battle with: its level, its Might tokens and a weapon's Might
function mzPower(u){
  if (u.name === 'Jester') return '?';
  return DEFS[u.name].p[mzLevel(u) - 1] + (u.arm || 0) + (u.gear ? gearPow(u.gear) || 0 : 0);
}
const mzBasePower = u => DEFS[u.name].p[Math.min(mzCopies(u.name), uMax(u.name)) - 1];
// can this token go on this deck card? an error message, or ''
function tokBlock(kind, u){
  if (!u || isBat(u.name)) return 'Tokens go on units, not on battle miracles.';
  if (kind !== 'tr' && u.gear === 'Zweihander') return `${u.name} wields a Zweihander: no Armaments or Shields.`;
  if (kind === 'tr' && mzLevel(u) >= uMax(u.name)) return `${u.name} is already at max level.`;
  return '';
}
// can this gear go on this deck card? an error message, or ''
function gearBlock(n, u){
  if (!u || isBat(u.name)) return 'Gear goes on units, not on battle miracles.';
  if (u.gear) return `${dispName(u.name)} already has ${dispName(u.gear)}. Drag it off first.`;
  if (n === 'Zweihander' && (u.arm || u.sh)) return `${u.name} has Armaments or Shields: a Zweihander can't go on it.`;
  return '';
}
// a gear card with no matching art (its numbers were changed in the Balance Lab): a plain card with the same banner
function tuckPlainGear(n){
  const v = gearPow(n);
  return `<span class="tkplain"><span class="tkpm">${v != null ? '+' + v : ''}</span><span class="tkpn">${esc(dispName(n))}</span></span>`;
}

/* ---------- what's placed, what's left ---------- */
function mzLimits(me, d){
  const used = k => d.reduce((s, u) => s + (u[k] || 0), 0);
  return {
    uniq:[d.filter(u => !exemptUnit(u.name) && !isBat(u.name)).length, deckCap(me)],
    rec:[d.filter(u => u.name === 'Recruit').length, recUI(me)],
    arm:[used('arm'), armUI(me)], sh:[used('sh'), shAllow(me)], tr:[used('tr'), trUI(me)]
  };
}
// is this unit, Drifter or battle miracle still on the bench?
function benchHas(n){
  const me = mzMe(), d = ui.draft || [];
  if (isBat(n)) return batBench(me, d).includes(n);
  if (n === 'Recruit') return recUI(me) - d.filter(u => u.name === 'Recruit').length > 0;
  return !!me.hand[n] && !d.some(u => u.name === n);
}
// everything on the bench, back of the pile first: tokens, gear, battle miracles, then units
function mzBenchItems(me, d){
  const L = mzLimits(me, d), out = [];
  for (const k of ['arm', 'sh', 'tr']){ const n = L[k][1] - L[k][0]; if (n > 0) out.push({type:'btok', key:'t:' + k, tok:k, n}); }
  const gl = gearLeft(me, d);
  for (const n of Object.keys(gl).filter(n => gl[n] > 0 && isGear(n)).sort()) out.push({type:'bgear', key:'g:' + n, name:n, n:gl[n]});
  const sp = {}; for (const n of batBench(me, d)) sp[n] = (sp[n] || 0) + 1;
  for (const n of Object.keys(sp)) out.push({type:'bunit', key:'s:' + n, name:n, n:sp[n], spell:true});
  const rec = L.rec[1] - L.rec[0];
  if (rec > 0) out.push({type:'bunit', key:'u:Recruit', name:'Recruit', n:rec});
  for (const n of Object.keys(me.hand).filter(n => n !== 'Recruit' && me.hand[n] > 0 && !d.some(u => u.name === n))) out.push({type:'bunit', key:'u:' + n, name:n, n:1});
  return out;
}

/* ---------- moves: each changes ui.draft, or sets ui.err and returns false ---------- */
function mzFail(msg){ ui.err = msg; sfx.err(); return false; }
function mzAddBlock(name){
  const [used, limit] = mzLimits(mzMe(), ui.draft).uniq;
  return !isBat(name) && !exemptUnit(name) && used >= limit ? `Your deck holds ${limit} unique units. Bench one first.` : '';
}
const mzOps = {
  // a bench card into the deck at position `at` (0 = front); returns the new card's id
  add(name, at){
    const d = ui.draft;
    if (!benchHas(name)) return false;
    const why = mzAddBlock(name); if (why) return mzFail(why);
    const u = mzIds([{name, arm:0, tr:0, sh:0}])[0];
    d.splice(Math.max(0, Math.min(at, d.length)), 0, u); ui.err = ''; return u.id;
  },
  move(id, at){
    const d = ui.draft, i = mzIdx(id); if (i < 0) return false;
    const [u] = d.splice(i, 1); d.splice(Math.max(0, Math.min(at, d.length)), 0, u); ui.err = ''; return true;
  },
  // a deck card back to the bench (its tokens and gear go back with it)
  bench(id){ const i = mzIdx(id); if (i < 0) return false; ui.draft.splice(i, 1); ui.err = ''; return true; },
  // a token onto a unit, from the bench or from another unit
  tok(kind, toId, fromId){
    const to = mzUnit(toId), from = fromId ? mzUnit(fromId) : null;
    if (!to || fromId === toId) return false;
    const why = tokBlock(kind, to); if (why) return mzFail(why);
    if (from){ if (!popTok(from, kind)) return false; }
    else { const L = mzLimits(mzMe(), ui.draft)[kind]; if (L[0] >= L[1]) return mzFail(`No ${TOKN[kind]} tokens left.`); }
    const o = tokOrder(to); o.push(kind); to[kind] = (to[kind] || 0) + 1; setTokOrder(to, o); ui.err = ''; return true;
  },
  untok(kind, fromId){ const u = mzUnit(fromId); if (!u || !popTok(u, kind)) return false; ui.err = ''; return true; },
  // gear onto a unit, from the bench or from another unit (one piece per unit: a second one is refused)
  equip(n, toId, fromId){
    const to = mzUnit(toId), from = fromId ? mzUnit(fromId) : null;
    if (!to || fromId === toId) return false;
    const why = gearBlock(n, to); if (why) return mzFail(why);
    if (!from && !(gearLeft(mzMe(), ui.draft)[n] > 0)) return mzFail(`No ${n} left in hand.`);
    if (from) delete from.gear;
    to.gear = n; ui.err = ''; return true;
  },
  unequip(id){ const u = mzUnit(id); if (!u || !u.gear) return false; delete u.gear; ui.err = ''; return true; },
  strip(id){ const u = mzUnit(id); if (!u) return false; u.arm = 0; u.tr = 0; u.sh = 0; delete u.tko; delete u.gear; ui.err = ''; return true; }
};

/* ---------- drawing ---------- */
const MOB_INFO = 'Mobilize: set your deck in secret. Your deck is held face up, like the physical game: the front card (the full card at the bottom) fights first, and the cards behind it fight next in order, back to the card at the top. Drag cards to reorder them or to move them between your deck and the bench. Drag tokens and gear onto a unit, or off it back to the bench. Tap any card to read it.';
const tuckImg = (url, alt) => `<div class="cface art"><img class="cart" src="${url}" alt="${esc(alt || '')}" draggable="false"></div>`;
function handoffHTML(){
  const S = ui.handoff, O = 1 - S;
  return `<div class="panel handoff s${VS(S)}">
    <span class="eyebrow">Round ${G.round} · Mobilize</span>
    <h2>Pass the device to ${esc(nm(S))}</h2>
    <p class="note">${S === 0 ? `${esc(nm(O))}, look away: ${esc(nm(S))} sets a secret deck order first.` : `${esc(nm(0))} has locked in. ${esc(nm(O))}, look away while ${esc(nm(S))} sets theirs.`}</p>
    <button type="button" class="primary big" data-act="pp-ready">I'm ${esc(nm(S))}, show my army</button>
  </div>`;
}
function mobHintText(){ return ''; }
// pips: one per slot, filled for each one used
function mzPips(label, used, cap, cls){
  if (!cap && !used) return '';
  const n = Math.max(cap, used);
  return `<span class="mzlg${used > cap ? ' over' : ''}${cls ? ' ' + cls : ''}" title="${esc(label)}: ${used} of ${cap} placed"><span class="mzll">${label}</span><span class="mzpips" aria-hidden="true">${
    Array.from({length:n}, (_, k) => `<i class="${k < used ? 'on' : ''}${k >= cap ? ' x' : ''}"></i>`).join('')}</span><span class="mzlc">${used}/${cap}</span></span>`;
}
function mzLimitsHTML(me, d){
  const L = mzLimits(me, d);
  return `<div class="mzlim">${mzPips('Units', L.uniq[0], L.uniq[1])}${L.rec[1] || L.rec[0] ? mzPips('Drifters', L.rec[0], L.rec[1]) : ''}${
    L.arm[1] || L.arm[0] ? mzPips('Might', L.arm[0], L.arm[1], 't-arm') : ''}${L.sh[1] || L.sh[0] ? mzPips('Shields', L.sh[0], L.sh[1], 't-sh') : ''}${
    L.tr[1] || L.tr[0] ? mzPips('Training', L.tr[0], L.tr[1], 't-tr') : ''}</div>`;
}
// the hidden buttons on a card show up in its opened view
function mzDeckCard(u, no){
  const id = esc(u.id), nmU = esc(dispName(u.name));
  const btns = `<button type="button" data-act="mz-bench" data-id="${id}">Move to bench</button>${(u.arm || u.tr || u.sh || u.gear) ? `<button type="button" data-act="mz-strip" data-id="${id}">Take off tokens and gear</button>` : ''}`;
  if (isBat(u.name)) return `<div class="mzc spell" data-mz="deck" data-id="${id}" data-name="${esc(u.name)}" data-key="d:${id}" data-no="${no}" role="button" tabindex="0" aria-label="${no}: battle miracle ${nmU}. Tap to read, drag to move.">
      <div class="mzface mcard fcard u spellc">${spellFace(u.name)}</div><span class="mzno" aria-hidden="true">✶</span>${btns}</div>`;
  // tucked cards come after the unit's own face in the markup (they still sit behind it), so opening the unit opens
  // the unit and not its gear
  const tucks = (u.gear ? [{g:u.gear}] : []).concat(tokOrder(u).map(k => ({k})));
  const occurrences = {};
  const tk = tucks.map((t, j) => {
    const occurrence = t.k ? (occurrences[t.k] = (occurrences[t.k] || 0) + 1) : 0;
    const key = t.g ? `k:${id}:gear` : `k:${id}:${t.k}:${occurrence}`;
    if (t.g){ const url = artURL(t.g, 'b');
      return `<span class="mztk gear" data-mz="gear" data-from="${id}" data-name="${esc(t.g)}" data-tuck-gear="${esc(t.g)}" data-key="${key}" style="--j:${j}" title="${esc(dispName(t.g))}: ${esc(BDEFS[t.g].t)}">${url ? cardFace(t.g, 'b', 1) : `<div class="mcard fcard b mzplain">${cardFace(t.g, 'b', 1)}</div>`}</span>`; }
    return `<span class="mztk tok t-${t.k}" data-mz="tok" data-from="${id}" data-tok="${t.k}" data-tuck-tok="${t.k}" data-key="${key}" style="--j:${j}" title="${esc(TOKN[t.k])}: ${esc(TOKRULES[t.k])}">${tuckImg(tokArtURL(t.k), TOK_ART[t.k])}</span>`;
  }).join('');
  const c = mzCopies(u.name), lv = mzLevel(u), pw = mzPower(u), base = mzBasePower(u);
  const art = !!artURL(u.name, 'u'), cls = pw === '?' ? '' : pw > base ? 'up' : pw < base ? 'down' : '';
  const pow = art ? `<span class="mzpow" aria-hidden="true"><img src="art/banner.png" alt="" draggable="false"><b class="${cls}">${pw}</b></span>` : `<span class="mzpow plain" aria-hidden="true"><b class="${cls}">${pw}</b></span>`;
  const tags = `${c > 1 ? `<span class="mzcp">×${c}</span>` : ''}${lv > 1 ? `<span class="mzlv">LV ${lv}</span>` : ''}`;
  const extra = [c > 1 ? `${c} copies` : '', u.arm ? `${u.arm} Might` : '', u.tr ? `${u.tr} Training` : '', u.sh ? `${u.sh} Shield${u.sh > 1 ? 's' : ''}` : '', u.gear ? dispName(u.gear) : ''].filter(Boolean).join(', ');
  return `<div class="mzc unit" data-mz="deck" data-id="${id}" data-name="${esc(u.name)}" data-key="d:${id}" data-no="${no}"${tucks.length ? ` style="--tk:${tucks.length}"` : ''} role="button" tabindex="0" aria-label="${no}: ${nmU}, power ${pw}${extra ? ', ' + esc(extra) : ''}. Tap to read, drag to move.">
    <div class="mzface mcard fcard u">${cardFace(u.name, 'u', lv)}</div>${tk}${pow}<span class="mztags">${tags}</span><span class="mzno" aria-hidden="true">${no}</span>${btns}</div>`;
}
function mzBenchCard(it){
  const cnt = it.n > 1 ? `<span class="mzn" aria-hidden="true">×${it.n}</span>` : '';
  const key = esc(it.key);
  if (it.type === 'btok') return `<div class="mzc tokc" data-mz="btok" data-tok="${it.tok}" data-key="${key}" role="button" tabindex="0" aria-label="${it.n} ${esc(TOKN[it.tok])}${it.n > 1 ? 's' : ''} left: ${esc(TOKRULES[it.tok])} Drag onto a unit.">
      <div class="mzface mcard tcard ${it.tok}" data-tok="${it.tok}">${tuckImg(tokArtURL(it.tok), TOK_ART[it.tok])}</div>${cnt}</div>`;
  if (it.type === 'bgear') return `<div class="mzc gearc" data-mz="bgear" data-name="${esc(it.name)}" data-key="${key}" role="button" tabindex="0" aria-label="${esc(dispName(it.name))}${it.n > 1 ? ` (${it.n})` : ''}: ${esc(BDEFS[it.name].t)} Drag onto a unit to equip it.">
      <div class="mzface mcard fcard b">${cardFace(it.name, 'b', 1)}</div>${cnt}</div>`;
  const face = it.spell ? `<div class="mzface mcard fcard u spellc">${spellFace(it.name)}</div>` : `<div class="mzface mcard fcard u">${cardFace(it.name, 'u', mzCopies(it.name))}</div>`;
  const c = it.spell || it.name === 'Recruit' ? 1 : mzCopies(it.name);
  return `<div class="mzc${it.spell ? ' spell' : ''}" data-mz="bunit" data-name="${esc(it.name)}" data-key="${key}" role="button" tabindex="0" aria-label="${esc(dispName(it.name))}${it.n > 1 ? ` (${it.n})` : ''}. Tap to read, drag into your deck.">
    ${face}${cnt}${c > 1 ? `<span class="mztags"><span class="mzcp">×${c}</span></span>` : ''}<button type="button" data-act="mz-add" data-name="${esc(it.name)}">Add to deck</button></div>`;
}
function mobilizeHTML(){
  if (G.net && NET && NET.acts.length > NET.applied[NET.seat]) return `<div class="panel handoff s${VS(NET.seat)}"><span class="eyebrow">Round ${G.round} · Mobilize</span><h2>Deck locked in</h2><p class="note">Waiting for ${esc(nm(1 - NET.seat))} to set their deck order. The battle starts as soon as they lock in.</p></div>`;
  if (G.net && !ui.draft) ui.draft = netClone(defaultDraft);
  if (PP() && ui.handoff != null) return handoffHTML();
  if (matMobOn()) return matMobHTML();   // one-screen dev (phones): Mobilize over the dimmed mat
  const S = seat(), me = G.players[S], d = mzIds(ui.draft || []);
  const L = mzLimits(me, d);
  // which miracles this deck uses up (more Drifters or tokens than your own)
  const spend = mirSpend(me, 'rec', L.rec[0] - recBase(me)).concat(mirSpend(me, 'arm', L.arm[0] - bVal(me, 'Smithy')), mirSpend(me, 'tr', L.tr[0] - bVal(me, 'Study'))).map(j => me.mir[j]);
  if (!G.net){
    const rdy = mobReady(me), cov = k => rdy.filter(j => MIRS[me.mir[j]][k]); spend.length = 0;
    for (const [k, over] of [['rec', L.rec[0] - recBase(me)], ['arm', L.arm[0] - bVal(me, 'Smithy')], ['tr', L.tr[0] - bVal(me, 'Study')]])
      if (over > 0){ const ix = cov(k); spend.push(...mirSpend({mir:ix.map(j => me.mir[j])}, k, over).map(x => me.mir[ix[x]])); }
  }
  // numbered in fight order, counting units only (battle miracles show ✶)
  let k = 0; const nos = d.map(u => isBat(u.name) ? 0 : ++k);
  const rows = d.map((u, i) => mzDeckCard(u, nos[i])).reverse().join('');   // drawn back (top) to front (bottom)
  const bench = mzBenchItems(me, d).map(mzBenchCard).join('');
  const lockLbl = ui.planning ? 'The AI is planning its deck…' : PP() && !G.net && S === 0 ? `Lock in and pass to ${esc(nm(1))}` : G.net ? 'Lock in' : 'Lock in and battle';
  return `<div class="forces mz">
    <section class="panel mz-deck"><h2>${PP() && !G.net ? `${esc(nm(S))}'s deck` : 'Your deck'} <button type="button" class="infob" data-tip="${esc(MOB_INFO)}" aria-label="How Mobilize works">i</button></h2>
      ${mzLimitsHTML(me, d)}
      ${spend.length ? `<p class="note">✶ This deck uses ${spend.map(esc).join(' and ')}.</p>` : ''}
      ${d.length > 1 ? '<div class="mzend back">Back · fights last</div>' : ''}
      <div class="mzstack" id="mz-deck">${rows || '<div class="mzempty">Drag units here from the bench</div>'}</div>
      ${d.length ? `<div class="mzend front">Front · fights first</div>` : ''}
      ${ui.err ? `<p class="err" role="alert">${esc(ui.err)}</p>` : ''}
      <div class="row mzacts">${mzSuggestHTML('Suggest a deck')}<span class="grow"></span><button type="button" class="primary" data-act="lock" ${ui.planning ? 'disabled' : ''}>${lockLbl}</button></div>
    </section>
    <div class="mobright">
      <section class="panel mz-bench"><h2>Bench</h2>
        <div class="mzstack" id="mz-bench">${bench || '<div class="mzempty">Everything is in your deck</div>'}</div>
      </section>
      ${mobMirHTML(me)}
    </div>
  </div>${mirModalHTML()}`;
}

/* ---------- animation: every card slides from where it was to where it is now, matched by data-key ---------- */
function mzSnap(){
  const m = new Map();
  for (const el of document.querySelectorAll('#view-play .mz [data-key]')){
    if (el.closest('.mz-gone,.mz-src')) continue;
    if (el.classList.contains('mztk')) m.set(el.dataset.key, {local:true, left:el.offsetLeft, top:el.offsetTop});
    else m.set(el.dataset.key, el.closest('.osfanslot') ? mzBoxOf(el) : el.getBoundingClientRect());
  }
  return m;
}
function mzSlideTiming(el, land, fallback){
  if (!el.closest('.osdeskmob')) return {duration:fallback, easing:SLIDE};
  return {duration:land ? bazaarTiming.dragSettle : bazaarTiming.pileShift, easing:MAT_FAN_SHIFT_EASE};
}
function mzFlip(before, landKey, landFrom, held = false){
  if (reduceMotion()) return;
  const els = [...document.querySelectorAll('.mz [data-key]')], delta = new Map();
  for (const el of els){
    const k = el.dataset.key;
    if (held && (k === landKey || el.closest('.mzc')?.dataset.key === landKey)) continue;
    const r0 = k === landKey && landFrom ? landFrom : before.get(k);
    if (!r0) continue;
    if (r0.local){
      delta.set(k, [r0.left - el.offsetLeft, r0.top - el.offsetTop]);
      continue;
    }
    if (el.closest('.osfan') && typeof matFanFlip === 'function'){ matFanFlip(el, r0, k === landKey); continue; }   // the desktop bench fan: it slides and turns into its pose
    const r1 = el.getBoundingClientRect();
    delta.set(k, [r0.left - r1.left, r0.top - r1.top]);
  }
  for (const el of els){
    const k = el.dataset.key, dl = delta.get(k); if (!dl) continue;
    let [dx, dy] = dl;
    // a tucked token or gear rides inside its unit: move it only by the difference
    if (el.classList.contains('mztk') && k === landKey && landFrom){
      const pd = delta.get('d:' + el.dataset.from);
      if (pd){ dx -= pd[0]; dy -= pd[1]; }
    }
    const land = k === landKey;
    const pose = land && landFrom?.rot != null ? landFrom : null;
    if (pose){
      const sx = pose.width / el.offsetWidth, sy = pose.height / el.offsetHeight;
      if (el.offsetWidth && el.offsetHeight) el.animate([
        {transformOrigin:'0 0', transform:`translate(${dx}px,${dy}px) rotate(${pose.rot}deg) scale(${sx},${sy})`},
        {transformOrigin:'0 0', transform:'none'}
      ], mzSlideTiming(el, true, 190));
    } else if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1)
      el.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], mzSlideTiming(el, land, land ? 180 : MZ_MS));
  }
}
// make a change, redraw, and slide everything into place (landKey lands from landFrom, e.g. where it was dropped)
function mzApply(fn, landKey, landFrom, snap, held = false){
  const before = snap || mzSnap();
  const ok = fn();
  if (ok) ui.mzEdit = (ui.mzEdit || 0) + 1;
  renderPlay();
  if (ok) mzFlip(before, typeof landKey === 'function' ? landKey(ok) : landKey, landFrom, held);
  return ok;
}
// a whole new deck (Suggest a deck): cards already in the deck keep their ids, so they slide to their new places
function mzReplace(nd){
  const old = (ui.draft || []).slice();
  for (const u of nd){ const j = old.findIndex(o => o.name === u.name); if (j >= 0){ u.id = old[j].id; old.splice(j, 1); } }
  mzApply(() => { ui.draft = mzIds(nd); ui.err = ''; return true; });
}
function mzSuggestHTML(label, cls = ''){
  const pending = !!ui.mzSuggest;
  return `<button type="button" class="${cls}" data-act="suggest" data-label="${label}"${pending ? ' disabled aria-busy="true"' : ''}>${pending ? 'Suggesting…' : label}</button>`;
}
function mzPaintSuggest(){
  const pending = !!ui.mzSuggest;
  for (const button of $('view-play').querySelectorAll('[data-act="suggest"]')){
    button.disabled = pending;
    button.setAttribute('aria-busy', String(pending));
    button.textContent = pending ? 'Suggesting…' : button.dataset.label;
  }
}
async function mzSuggestDeck(){
  if (!mzActive() || ui.mzSuggest || mzP) return;
  const game = G, view = ui, round = G.round, player = seat(), draft = ui.draft, edit = ui.mzEdit;
  const current = () => G === game && ui === view && G.round === round && seat() === player && mzActive()
    && !mzP && ui.draft === draft && ui.mzEdit === edit;
  view.mzSuggest = true;
  mzPaintSuggest();
  sfx.rustle();
  let deck;
  try{
    const result = await aiThink('mob', {i:player, K:60, depth:DEPTH_HINT});
    if (!current()) return;
    if (result?.deck) deck = result.deck;
    else {
      // Give the button time to paint before using the compatibility path without a worker.
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
      if (current()) deck = netClone(() => aiMobilize(game, player, 60, DEPTH_HINT));
    }
  } catch (err){
    if (current()) showToast('Could not suggest a deck. Try again.');
  } finally {
    view.mzSuggest = false;
    if (ui === view) mzPaintSuggest();
  }
  if (deck && current()) mzReplace(draftFromDeck(deck));
}
const mzEl = key => document.querySelector(`.mz [data-key="${CSS.escape(key)}"]`);
const tuckKeyOfNewest = (id, kind) => `k:${id}:${kind}:${mzUnit(id)?.[kind] || 0}`;

/* ---------- reading a card ---------- */
function mzOpen(el){
  if (!el || !el.isConnected) return;
  // a token or gear: the card itself (the tucked one holds its card face); a unit: the whole Mobilize card, buttons and all
  const card = el.dataset.mz === 'btok' ? el.querySelector('.mzface') : el;
  openPeek(card, true);
}

/* ---------- input: one controller for mouse, touch and pen ---------- */
let mzP = null;   // the press or drag in progress
function mzDown(e){
  const el = e.target.closest('.mz [data-mz]');
  if (!el || e.target.closest('button,a,input,select')) return;
  mzArm(e, el);
}
function mzArm(e, el, inspector, face){
  if (e.button > 0 || !mzActive()) return;
  if (mzP){ if (mzP.drag) return; mzClear(); }
  const grip = face && matInspectGrip(face, e.clientX, e.clientY);
  if (inspector && !grip) return;
  const touch = e.pointerType !== 'mouse';
  mzP = {pid:e.pointerId, el, type:el.dataset.mz, key:el.dataset.key, id:el.dataset.id || null, from:el.dataset.from || null,
         name:el.dataset.name || null, tok:el.dataset.tok || null, x0:e.clientX, y0:e.clientY, cx:e.clientX, cy:e.clientY,
         touch, lifted:!touch, drag:false, t:null, inspector, grip};
  el.classList.add('mz-press');
  if (touch) mzP.t = setTimeout(() => {
    if (!mzP || mzP.el !== el || mzP.drag) return;
    mzP.lifted = true; el.classList.add('mz-lift'); sfx.pick();
    if (navigator.vibrate) try{ navigator.vibrate(12); }catch(err){}
  }, MZ_HOLD);
}
function mzClear(){
  if (!mzP) return;
  clearTimeout(mzP.t); if (mzP.frame) cancelAnimationFrame(mzP.frame);
  mzP.el.classList.remove('mz-press', 'mz-lift');
  mzP = null;
}
function mzMove(e){
  const p = mzP; if (!p || e.pointerId !== p.pid) return;
  p.cx = e.clientX; p.cy = e.clientY;
  if (!p.drag){
    const dist = Math.hypot(p.cx - p.x0, p.cy - p.y0);
    if (p.touch && !p.lifted){ if (dist > MZ_SLOP) mzClear(); return; }   // moved before the hold: the page scrolls
    if (dist < (p.touch ? 3 : MZ_MOUSE)) return;
    if (!mzActive() || !p.el.isConnected){ mzClear(); return; }
    mzStart();
  }
  e.preventDefault();
  if (!p.frame) p.frame = requestAnimationFrame(() => mzDragFrame(p));
}
// a card's own box on the screen: a card turned in the desktop bench fan counts as its untilted box round the same centre
function mzBoxOf(el){
  const r = el.getBoundingClientRect(), slot = el.closest('.osfanslot');
  if (!slot) return {left:r.left, top:r.top, width:r.width, height:r.height, rot:0};
  const w = el.offsetWidth, h = el.offsetHeight, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const tf = getComputedStyle(slot).transform, m = new DOMMatrix(tf === 'none' ? undefined : tf);
  return {left:cx - w / 2, top:cy - h / 2, width:w, height:h, rot:Math.atan2(m.b, m.a) * 180 / Math.PI};
}
function mzStart(){
  const p = mzP, el = p.el;
  if (p.inspector) closePeek(true);
  p.drag = true; el.classList.remove('mz-press', 'mz-lift');
  const r = p.grip?.r || mzBoxOf(el);
  const point = p.grip?.point || matGrabPoint({r, rot:r.rot}, p.x0, p.y0);
  p.dx = point.x; p.dy = point.y;
  p.left = p.x0 - p.dx; p.top = p.y0 - p.dy; p.width = r.width;
  p.strip = mzStripR();
  p.desktop = !!el.closest('.osdeskmob');
  p.blocked = p.type === 'bunit' ? mzAddBlock(p.name) : '';
  // the card in your hand: a copy of the same card, art drawn from what's already loaded so it's never blank
  const g = solidArt(el.cloneNode(true), r.width);
  const fan = el.closest('#mz-bench')?._cardLayout;
  if (fan){
    const box = el.getBoundingClientRect();
    p.reorder = {fan, original:[...fan.slots], held:el.parentElement,
      dx:p.inspector ? 0 : box.left + box.width / 2 - p.x0,
      dy:p.inspector ? 0 : box.top + box.height / 2 - p.y0};
  }
  g.removeAttribute('data-key'); g.removeAttribute('tabindex'); g.classList.add('mzghost');
  g.querySelectorAll('[data-key]').forEach(n => n.removeAttribute('data-key'));
  const wrap = document.createElement('div'); wrap.className = 'mz mzghostwrap'; wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = `left:${p.left}px;top:${p.top}px;width:${r.width}px;height:${r.height}px;--mzw:${r.width}px`;
  g.style.transformOrigin = `${p.dx}px ${p.dy}px`;
  wrap.appendChild(g); document.body.appendChild(wrap); p.wrap = wrap;
  if (p.desktop){
    const cue = document.createElement('div');
    cue.className = 'mz-drag-cue';
    cue.setAttribute('role', 'status');
    cue.hidden = true;
    document.body.append(cue);
    p.cue = cue;
    if (reduceMotion()) g.style.transform = 'none';
    else {
      const initial = p.grip?.matrix || matDragPlanePose({r, tilt:0}, p.left, p.top);
      const turn = r.rot || 0, began = performance.now();
      p.g = g;
      p.size = {width:r.width, height:r.height};
      p.physical = {initial, point, ...p.size, turn, began, turnTime:turn ? Math.max(MAT_DRAG_TURN, bazaarTiming.dragPickup * 1.5) : bazaarTiming.dragPickup,
        x:p.x0, y:p.y0, pitch:0, yaw:0, roll:0};
      g.style.transformOrigin = '0 0';
      g.style.filter = 'none';
      matGripShadow(p, 79).animate([{opacity:0}, {opacity:bazaarShadow(1).opacity}], {duration:bazaarTiming.dragPickup, fill:'backwards'});
      matDragPhysicalPaint(p, began);
    }
    try { $('view-play').setPointerCapture(p.pid); } catch(e) {}
  } else if (!reduceMotion()){
    g.animate([{transform:`rotate(${r.rot}deg) scale(1)`}, {transform:'rotate(-2deg) scale(1.045)'}], {duration:110, easing:SLIDE});
  }
  document.body.classList.add('mz-dragging');
  if (p.type === 'deck' || p.type === 'bunit'){
    // units: a dashed slot in the deck shows exactly where the card will land. A deck card's slot starts in its own
    // place (with room for its tokens), so nothing moves until you move it.
    const slot = document.createElement('div'); slot.className = 'mzc mzslot' + (el.classList.contains('spell') ? ' spell' : ''); slot.setAttribute('aria-hidden', 'true');
    if (p.desktop){
      const number = document.createElement('span');
      number.className = 'mzno';
      slot.append(number);
      slot.style.setProperty('--mz-room-time', bazaarTiming.pileRoomOpen+'ms');
      $('mz-deck').style.setProperty('--mz-room-time', bazaarTiming.pileRoomOpen+'ms');
    }
    if (p.type === 'deck'){ if (el.style.getPropertyValue('--tk')) slot.style.setProperty('--tk', el.style.getPropertyValue('--tk')); el.parentNode.insertBefore(slot, el); el.classList.add('mz-gone'); }
    else el.classList.add('mz-src');
    p.slot = slot;
    if (p.desktop){
      // Measure the resting strips and their tucked cards once. Opening and moving the slot must not move
      // the hit thresholds, or tall rows can push the pointer back across the boundary that just moved them.
      p.deckTargets = mzRows().filter(row => row !== slot).map(row => {
        const tuck = parseFloat(getComputedStyle(row).marginTop) || 0;
        return {row, mid:row.offsetTop + (row.offsetWidth * p.strip - tuck) / 2};
      });
      if (slot.isConnected) mzRenumber();
    }
  } else {
    el.classList.add('mz-src');
    if (p.desktop) mzBenchRemainder(p);
    const limit = p.type === 'btok' ? mzLimits(mzMe(), ui.draft)[p.tok] : null;
    p.attachmentBlocks = new Map();
    for (const row of document.querySelectorAll('#mz-deck > .mzc')){
      const u = mzUnit(row.dataset.id), self = row.dataset.id === p.from;
      const blocked = limit && limit[0] >= limit[1];
      const why = self ? 'Already attached to this unit.' :
        blocked ? `No ${TOKN[p.tok]} tokens left.` :
        p.tok ? tokBlock(p.tok, u) : gearBlock(p.name, u);
      p.attachmentBlocks.set(row.dataset.id, why);
      row.classList.toggle('mz-ok', !why);
    }
  }
  if (!p.lifted || !p.touch) sfx.pick();
}
function mzDragFrame(p, scroll = true){
  p.frame = 0;
  if (mzP !== p) return;
  let scrolled = false;
  if (scroll && !p.el.closest('.osmob')){
    const edge = 70, y = p.cy, h = window.innerHeight, before = window.scrollY;
    const v = y < edge ? -(edge - y) / 3 : y > h - edge ? (y - (h - edge)) / 3 : 0;
    if (v) window.scrollBy(0, Math.max(-24, Math.min(24, v)));
    scrolled = before !== window.scrollY;
  }
  if (scroll && p.desktop){
    const bench = document.querySelector('.osmob-bench-scroll'), r = bench?.getBoundingClientRect();
    if (r && p.cx > r.left && p.cx < r.right && p.cy > r.top && p.cy < r.bottom){
      const before = bench.scrollTop;
      if (p.cy < r.top + 28) bench.scrollTop -= 12;
      if (p.cy > r.bottom - 28) bench.scrollTop += 12;
      scrolled = bench.scrollTop !== before;
    }
  }
  if (p.x !== p.cx || p.y !== p.cy || scrolled){
    p.x = p.cx; p.y = p.cy;
    mzHover();
    p.wrap.style.transform = `translate3d(${p.x - p.x0}px,${p.y - p.y0}px,0)`;
  }
  const swing = p.physical && matDragPhysicalPaint(p, performance.now());
  if (scroll && (scrolled || swing)) p.frame = requestAnimationFrame(() => mzDragFrame(p));
}
// the deck's cards in layout order (back to front), the slot included
// each card's name strip as a share of its width: the layout's --mzsr on #mz-deck if it sets one (the desktop cascade)
const mzStripR = () => { const d = $('mz-deck'), v = d ? parseFloat(getComputedStyle(d).getPropertyValue('--mzsr')) : NaN; return v > 0 ? v : MZ_STRIP; };
const mzRows = () => { const d = $('mz-deck'); return d ? [...d.children].filter(x => x.classList.contains('mzc') && !x.classList.contains('mz-gone')) : []; };
// which card's band a height on screen falls in: each card owns its strip (and the room for its tokens above it);
// above the top card counts as the top card, and everything below the front card's strip counts as the front card.
// Measured from the layout (not the animated positions), so the answer never flickers while cards slide.
function mzBand(rows, y){
  const deck = $('mz-deck'); if (!deck || !rows.length) return -1;
  const top0 = deck.getBoundingClientRect().top; let k = 0;
  for (let j = 1; j < rows.length; j++){
    const r = rows[j], top = top0 + r.offsetTop - (parseFloat(getComputedStyle(r).marginTop) || 0);
    if (y >= top) k = j; else break;
  }
  return k;
}
// which side of Mobilize a point is on: the deck's half or the bench's half, from the top of the screen to the bottom
function mzSide(x){
  const d = document.querySelector('.forces.mz .mz-deck'), b = document.querySelector('.forces.mz .mobright');
  if (!d || !b) return null;
  return x < (d.getBoundingClientRect().right + b.getBoundingClientRect().left) / 2 ? 'deck' : 'bench';
}
// fight-order numbers follow the slot while you drag (the slot counts as the card you're holding)
function mzRenumber(){
  const rows = mzRows(); let n = 0;
  for (let j = rows.length - 1; j >= 0; j--){
    const r = rows[j], number = r.querySelector(':scope > .mzno');
    if (r.classList.contains('spell')){ if (r.classList.contains('mzslot') && number) number.textContent = '✶'; continue; }
    r.dataset.no = ++n;
    if (number) number.textContent = n;
  }
}
// move the slot (FLIP: the other cards slide to their new places)
function mzPlaceSlot(y){
  const p = mzP, deck = $('mz-deck'), slot = p.slot; if (!deck || !slot) return;
  const rows = mzRows(), others = rows.filter(x => x !== slot);
  let ref;
  if (p.deckTargets){
    const localY = y - deck.getBoundingClientRect().top;
    ref = p.deckTargets.find(target => localY < target.mid)?.row || null;
    if (slot.isConnected && ref === (others[rows.indexOf(slot)] || null)) return;
  } else if (!slot.isConnected){
    const b = mzBand(others, y);
    if (b < 0) ref = null;
    else { const t = others[b], r = t.getBoundingClientRect(), last = b === others.length - 1;
      const mid = last ? r.top + Math.min(r.height, t.offsetWidth * p.strip * 2) / 2 : r.top + t.offsetWidth * p.strip / 2;
      ref = y < mid ? t : others[b + 1] || null; }
  } else {
    // after a move the slot needs half a strip of travel before it moves again, so it can't bounce between two
    // cards of different heights
    if (p.slotY != null && Math.abs(y - p.slotY) < slot.offsetWidth * p.strip / 2) return;
    const b = mzBand(rows, y), t = rows[b], si = rows.indexOf(slot);
    if (!t || t === slot) return;
    ref = b > si ? rows[b + 1] || null : t;
  }
  if (slot.nextElementSibling === ref && slot.isConnected) return;
  const before = new Map(others.map(x => [x, x.getBoundingClientRect()]));
  if (ref) deck.insertBefore(slot, ref); else deck.appendChild(slot);
  if (deck.closest('.osdeskmob')) slot.classList.add('mz-spread');
  p.slotY = y; mzRenumber();
  mzSlideSlot(others, before);
}
function mzDropSlot(){
  const p = mzP, slot = p.slot; if (!slot || !slot.isConnected) return;
  p.slotY = null;
  const others = mzRows().filter(x => x !== slot), before = new Map(others.map(x => [x, x.getBoundingClientRect()]));
  slot.remove(); mzRenumber();
  mzSlideSlot(others, before);
}
const mzSlotMotion = new WeakMap();
function mzSlideSlot(rows, before){
  for (const row of rows) mzSlotMotion.get(row)?.cancel();
  if (reduceMotion()) return;
  const shifts = rows.map(row => {
    const from = before.get(row), to = row.getBoundingClientRect();
    return [row, from.left - to.left, from.top - to.top];
  });
  for (const [row, dx, dy] of shifts) if (Math.abs(dx) > .5 || Math.abs(dy) > .5)
    mzSlotMotion.set(row, row.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], mzSlideTiming(row, false, 160)));
}
function mzBenchRemainder(p){
  const slot = p.reorder?.held, badge = p.el.querySelector('.mzn');
  const remaining = Number(badge?.textContent.slice(1)) - 1;
  if (!slot || !(remaining > 0)) return;
  const rest = document.createElement('div'), card = p.el.cloneNode(true);
  rest.className = 'mz-bench-remainder';
  rest.setAttribute('aria-hidden', 'true');
  rest.style.transform = slot.style.transform;
  card.removeAttribute('data-key');
  card.removeAttribute('tabindex');
  card.classList.remove('mz-src');
  const count = card.querySelector('.mzn');
  count.textContent = '×' + remaining;
  rest.append(card);
  slot.parentElement.append(rest);
  p.remainder = rest;
}
function mzDragCue(p, text, blocked = false){
  if (!p.cue) return;
  p.cue.hidden = !text;
  if (!text) return;
  if (!p.cueSize || p.cue.textContent !== text){
    p.cue.textContent = text;
    p.cueSize = {width:p.cue.offsetWidth, height:p.cue.offsetHeight};
  }
  p.cue.classList.toggle('is-blocked', blocked);
  p.cue.style.left = Math.max(8, Math.min(innerWidth - p.cueSize.width - 10, p.cx + 16)) + 'px';
  p.cue.style.top = Math.max(8, Math.min(innerHeight - p.cueSize.height - 10, p.cy + 18)) + 'px';
}
function mzAttachmentTarget(p){
  const hit = document.elementFromPoint(p.cx, p.cy);
  const face = hit?.closest('#mz-deck .mzface');
  const row = face?.closest('#mz-deck > [data-mz="deck"]');
  for (const mark of document.querySelectorAll('#mz-deck .mz-attachment-target'))
    if (mark !== row) mark.classList.remove('mz-attachment-target', 'mz-attachment-blocked');
  const unit = row && mzUnit(row.dataset.id), why = row && p.attachmentBlocks.get(row.dataset.id);
  if (!unit || why == null){ mzDragCue(p, ''); return null; }
  row.classList.add('mz-attachment-target');
  row.classList.toggle('mz-attachment-blocked', !!why);
  const item = p.tok ? dispName(TOKN[p.tok]) : dispName(p.name);
  mzDragCue(p, why || `Attach ${item} to ${dispName(unit.name)}`, !!why);
  return why ? null : row.dataset.id;
}
function mzBenchInsertion(p){
  if (!matPlaceShopFanCard(p)) return false;
  const {fan, held, original} = p.reorder;
  if (p.remainder) p.remainder.hidden = fan.slots.indexOf(held) !== original.indexOf(held);
  return true;
}
function mzPreviewDeckRoom(p){
  if (!p.desktop) return;
  const rows = mzRows(), i = rows.indexOf(p.slot);
  const front = i >= 0 && p.slot.classList.contains('mz-spread') ? rows.slice(i+1) : [];
  const deck = $('mz-deck');
  const part = p.slot?.offsetWidth || 0;
  const slotRight = deck.getBoundingClientRect().left + (p.slot?.offsetLeft || 0) + part;
  const benchLeft = document.querySelector('.mobright').getBoundingClientRect().left;
  const shift = Math.max(0, Math.min(part * .66, benchLeft - slotRight - 12));
  deck.style.setProperty('--mz-preview-room', shift+'px');
  for (const row of rows) row.classList.toggle('mz-room', front.includes(row) && shift > 0);
}
function mzCarryDeckRoom(before){
  const room = new Map();
  for (const row of mzRows()){
    const key = row.dataset.key, r = before.get(key), dx = parseFloat(getComputedStyle(row).translate);
    if (!r || !dx) continue;
    room.set(key, dx);
    before.set(key, {...r.toJSON(), left:r.left-dx});
  }
  return room;
}
function mzCloseDeckRoom(room){
  if (!room) return;
  const hold = bazaarTiming.dragSettle, close = bazaarTiming.pileRoomClose, duration = hold + close;
  if (!duration) return;
  for (const [key, dx] of room){
    const at = dx+'px 0';
    mzEl(key)?.animate([{translate:at}, {translate:at, offset:hold/duration, easing:MAT_FAN_SHIFT_EASE}, {translate:'0px 0'}],
      {duration});
  }
}
function mzHover(){
  const p = mzP; if (!p || !p.drag) return;
  const bench = document.querySelector('.forces.mz .mz-bench');
  const benchRect = bench?.querySelector('.osmob-bench-scroll')?.getBoundingClientRect();
  const deckRect = p.desktop ? $('mz-deck').getBoundingClientRect() : null;
  const over = r => r && p.cx >= r.left && p.cx <= r.right && p.cy >= r.top && p.cy <= r.bottom;
  const side = p.desktop ? over(benchRect) ? 'bench' : over(deckRect) ? 'deck' : null : mzSide(p.cx);
  if (p.reorder){
    const {fan, original, held} = p.reorder;
    if (mzBenchInsertion(p)){
      mzDropSlot();
      mzPreviewDeckRoom(p);
      mzDragCue(p, '');
      p.target = {reorder:true};
      document.querySelectorAll('#mz-deck .mz-over').forEach(row => row.classList.remove('mz-over'));
      return;
    }
    if (fan.slots.some((slot, i) => slot !== original[i])) matArrangeShopFan(fan, original, held);
    if (p.remainder) p.remainder.hidden = false;
  }
  // the top of the card in your hand marks the spot
  const y = p.cy - p.dy + p.width * p.strip / 2;
  if (p.type === 'deck' || p.type === 'bunit'){
    p.refused = side === 'deck' && !!p.blocked;
    p.wrap.classList.toggle('mz-refused', p.refused);
    if (side === 'deck'){
      if (!p.refused) mzPlaceSlot(y);
      const rows = mzRows(), si = rows.indexOf(p.slot);
      p.target = si < 0 ? null : {at:rows.length - 1 - si};   // deck position counts from the front (bottom)
    } else {
      mzDropSlot();
      p.target = side === 'bench' && p.type === 'deck' ? {bench:true} : null;
    }
    mzPreviewDeckRoom(p);
    if (p.desktop) mzDragCue(p, p.refused ? p.blocked :
      p.target?.bench ? 'Move to bench' : p.target?.at != null ? p.slot.classList.contains('spell') ? 'Place miracle here' : `Fight order ${p.slot.dataset.no || p.target.at+1}` : '',
      p.refused);
    if (bench) bench.classList.toggle('mz-over', !!p.target?.bench);
    return;
  }
  // Attachment targets are the exposed faces. The desktop rail and surrounding sand never target a unit.
  let ok = null;
  if (p.desktop){
    const returns = !!(p.from && side === 'bench');
    ok = mzAttachmentTarget(p);
    if (returns) mzDragCue(p, 'Return to bench');
    p.target = ok ? {unit:ok} : returns ? {bench:true} : null;
    if (bench) bench.classList.toggle('mz-over', returns);
    return;
  }
  if (side === 'deck'){
    const rows = mzRows(), pointerY = p.el.closest('.osdeskmob') ? p.cy : y;
    const row = rows[mzBand(rows, pointerY)];
    if (row?.classList.contains('mz-ok')) ok = row.dataset.id;
  }
  document.querySelectorAll('#mz-deck > .mzc').forEach(r => r.classList.toggle('mz-over', r.dataset.id === ok));
  p.target = ok ? {unit:ok} : side === 'bench' && p.from ? {bench:true} : null;
  if (bench) bench.classList.toggle('mz-over', !!p.target?.bench);
}
// put the page back the way it was before the drag started
function mzUnstage(){
  document.body.classList.remove('mz-dragging');
  document.querySelectorAll('#mz-deck .mz-room').forEach(row => row.classList.remove('mz-room'));
  document.querySelectorAll('.mz .mzslot').forEach(n => n.remove());
  document.querySelectorAll('.mz .mz-gone').forEach(n => n.classList.remove('mz-gone'));
  mzRenumber();
  document.querySelectorAll('.mz .mz-src, .mz .mz-ok, .mz .mz-over').forEach(n => n.classList.remove('mz-src', 'mz-ok', 'mz-over'));
  document.querySelectorAll('#mz-deck > .mzc').forEach(r => mzSlotMotion.get(r)?.cancel());
}
// The lifted face's pose, including the rotation round the player's grab point.
function mzGrabPose(p){
  const card = p.wrap.firstElementChild, tf = getComputedStyle(card).transform;
  const m = new DOMMatrix(tf === 'none' ? undefined : tf);
  const at = new DOMPoint(-p.dx, -p.dy).matrixTransform(m), scale = Math.hypot(m.a, m.b);
  return {left:p.cx + at.x, top:p.cy + at.y, width:card.offsetWidth * scale, height:card.offsetHeight * scale, rot:Math.atan2(m.b, m.a) * 180 / Math.PI};
}
// The original card takes over once the lifted copy reaches its resting pose.
function mzFlyBack(wrap, key, p){
  const el = key && mzEl(key);
  if (p?.physical) return mzLandHeld(p, el);
  if (!el || reduceMotion()){ wrap.remove(); return; }
  el.style.visibility = 'hidden';
  // a card in the desktop bench fan goes back to its pose, turning as it lands
  const pose = el.closest('.osfan') && typeof matPoseOf === 'function' ? matPoseOf(el) : null, rot = pose ? pose.rot : 0;
  const r = pose ? pose.r : el.getBoundingClientRect(), card = wrap.firstElementChild;
  const sx = r.width / wrap.offsetWidth, sy = r.height / wrap.offsetHeight;
  const corner = new DOMPoint(-r.width / 2, -r.height / 2).matrixTransform(new DOMMatrix().rotate(rot));
  const x = r.left + r.width / 2 + corner.x - wrap.offsetLeft, y = r.top + r.height / 2 + corner.y - wrap.offsetTop;
  const o = {...mzSlideTiming(el, true, 200), fill:'forwards'};
  card.animate([{transform:getComputedStyle(card).transform}, {transform:'none'}], o);
  wrap.style.transformOrigin = '0 0';
  const a = wrap.animate([{transform:wrap.style.transform || 'none'}, {transform:`translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${sx},${sy})`}], o);
  const done = () => { wrap.remove(); el.style.visibility = ''; };
  a.onfinish = done; a.oncancel = done;
}
// The handoff takes place behind the receiving face. Grow the occlusion from the lower edge
// during the slide so the held card stays visible until it starts feeding into the stack.
function mzTuckOcclusion(p, attachment, row, flight){
  const covers = [...row.children].filter(el => el.matches('.mzface') ||
    (el.matches('.mztk') && (el.compareDocumentPosition(attachment) & Node.DOCUMENT_POSITION_FOLLOWING)));
  for (let front = row.nextElementSibling; front; front = front.nextElementSibling)
    covers.push(...front.querySelectorAll(':scope > :is(.mzface,.mztk)'));
  if (!covers.length) return null;

  const mask = document.createElement('div');
  mask.className = 'mz-tuck-flight';
  mask.setAttribute('aria-hidden', 'true');
  document.body.append(mask);
  mask.append(p.shadowEl, p.wrap);
  let frame;
  function paint(){
    const progress = flight.effect.getComputedTiming().progress ?? 0;
    const reveal = Math.max(0, Math.min(1, (progress - .08) / .92));
    const bounds = covers.map(el => {
      const {left, right, bottom, height} = el.getBoundingClientRect();
      return {left, right, bottom, top:bottom-height*reveal};
    }).filter(r => r.bottom > r.top && r.right > r.left);
    const edges = [...new Set(bounds.flatMap(r => [r.top, r.bottom]))].sort((a,b) => a-b);
    const holes = [];
    // Union overlapping cards by horizontal bands so an overlap never opens a hole in the cover.
    for (let i = 1; i < edges.length; i++){
      const top = edges[i-1], bottom = edges[i];
      const merged = [];
      const strips = bounds.filter(r => r.top < bottom && r.bottom > top).sort((a,b) => a.left-b.left);
      for (const {left, right} of strips){
        const prior = merged.at(-1);
        if (prior && left <= prior.right) prior.right = Math.max(prior.right, right);
        else merged.push({left, right});
      }
      for (const {left, right} of merged) holes.push(`M ${left} ${top} H ${right} V ${bottom} H ${left} Z`);
    }
    if (holes.length) mask.style.clipPath = `path(evenodd, "M 0 0 H ${innerWidth} V ${innerHeight} H 0 Z ${holes.join(' ')}")`;
    if (mask.isConnected) frame = requestAnimationFrame(paint);
  }
  paint();
  return () => { cancelAnimationFrame(frame); mask.remove(); };
}
// A desktop card stays in the same lifted copy from release until its face and shadow reach the slot.
function mzLandHeld(p, el){
  const {wrap, g, shadowEl, size} = p;
  const done = () => {
    wrap.remove();
    shadowEl.remove();
    if (el) el.style.visibility = '';
  };
  if (!el || !el.isConnected){ done(); return; }
  const left = p.left + p.cx - p.x0, top = p.top + p.cy - p.y0;
  if (el.closest('#mz-bench .osfanslot')){
    const matrix = p.physical.matrix;
    // The wrapper keeps the Mobilize card styles while the pile code settles the same lifted pose.
    Object.assign(wrap.style, {left:left+'px', top:top+'px', transformOrigin:'0 0', transform:matrix.toString()});
    g.style.transform = 'none';
    wrap._osDragPose = {matrix, box:{left, top, ...size}};
    wrap._osGripShadow = shadowEl;
    matSettleDragged(wrap, el, done);
    return;
  }
  const row = el.closest('#mz-deck > .mzc'), deck = row?.parentElement;
  const pose = el.closest('#mz-bench') ? matPoseOf(el) : null;
  let dest = pose?.r || el.getBoundingClientRect();
  if (row && row !== el){
    const box = deck.getBoundingClientRect();
    dest = {left:box.left+row.offsetLeft+el.offsetLeft, top:box.top+row.offsetTop+el.offsetTop,
      width:el.offsetWidth, height:el.offsetHeight};
  }
  if (!dest.width || !dest.height){ done(); return; }
  el.style.visibility = 'hidden';
  const finish = new DOMMatrix().translate(dest.left-left + dest.width/2, dest.top-top + dest.height/2)
    .rotate(pose?.rot || 0).scale(dest.width/size.width, dest.height/size.height)
    .translate(-size.width/2, -size.height/2);
  const timing = {duration:bazaarTiming.dragSettle, easing:MAT_FAN_SHIFT_EASE, fill:'forwards'};
  const frames = Array.from({length:13}, (_, i) => matDragMix(p.physical.matrix, finish, i / 12));
  const lights = frames.map((m, i) => matCastLight(m, size, 1 - i / 12));
  shadowEl.style.left = left+'px';
  shadowEl.style.top = top+'px';
  shadowEl.animate(lights.map(({x,y,blur}) => ({translate:`${x}px ${y}px`, filter:`blur(${blur}px)`})), timing);
  shadowEl.firstElementChild.animate(lights.map(({transform}) => ({transform})), timing);
  shadowEl.animate([{opacity:bazaarShadow(1).opacity}, {opacity:0}], timing);
  const flight = g.animate(frames.map(m => ({transform:m.toString()})), timing);
  const unmask = row && row !== el ? mzTuckOcclusion(p, el, row, flight) : null;
  const land = () => { unmask?.(); done(); };
  flight.onfinish = flight.oncancel = land;
}
function mzDrop(cancel){
  const p = mzP; mzP = null;
  clearTimeout(p.t); if (p.frame) cancelAnimationFrame(p.frame);
  const view = $('view-play');
  if (view.hasPointerCapture(p.pid)) view.releasePointerCapture(p.pid);
  const t = cancel || !mzActive() ? null : p.target, wrap = p.wrap;
  const physical = !!p.physical;
  const ghostRect = physical || reduceMotion() ? null : mzGrabPose(p), before = mzSnap();
  const deckRoom = physical && t?.at != null ? mzCarryDeckRoom(before) : null;
  p.cue?.remove();
  p.remainder?.remove();
  for (const row of document.querySelectorAll('#mz-deck .mz-attachment-target'))
    row.classList.remove('mz-attachment-target', 'mz-attachment-blocked');
  mzUnstage();
  if (p.reorder){
    const {fan, held, original} = p.reorder;
    if (t?.reorder){
      (ui.mzBenchOrder ??= {})[seat()] = fan.slots.map(slot => slot.firstElementChild.dataset.key);
      mzFlyBack(wrap, p.key, p);
      return;
    }
    if (fan.slots.some((slot, i) => slot !== original[i])) matArrangeShopFan(fan, original, held);
  }
  if (!t){
    if (!cancel && p.refused && mzActive()){ mzFail(p.blocked); renderPlay(); }
    else sfx.soft();
    if (physical && p.type === 'deck') mzFlip(before, p.key, null, true);
    mzFlyBack(wrap, p.key, p); return;
  }
  let fn = null, land = null;
  switch (p.type){
    case 'deck':
      if (t.bench){ fn = () => mzOps.bench(p.id); const nmK = isBat(p.name) ? 's:' + p.name : 'u:' + p.name; land = nmK; }
      else { const at = t.at, i = mzIdx(p.id); fn = () => i === at || mzOps.move(p.id, at); land = 'd:' + p.id; }
      break;
    case 'bunit': fn = () => mzOps.add(p.name, t.at); land = id => 'd:' + id; break;
    case 'btok': if (t.unit){ fn = () => mzOps.tok(p.tok, t.unit); land = () => tuckKeyOfNewest(t.unit, p.tok); } break;
    case 'tok':
      if (t.unit){ fn = () => mzOps.tok(p.tok, t.unit, p.from); land = () => tuckKeyOfNewest(t.unit, p.tok); }
      else if (t.bench){ fn = () => mzOps.untok(p.tok, p.from); land = 't:' + p.tok; }
      break;
    case 'bgear': if (t.unit){ fn = () => mzOps.equip(p.name, t.unit); land = `k:${t.unit}:gear`; } break;
    case 'gear':
      if (t.unit){ fn = () => mzOps.equip(p.name, t.unit, p.from); land = `k:${t.unit}:gear`; }
      else if (t.bench){ fn = () => mzOps.unequip(p.from); land = 'g:' + p.name; }
      break;
  }
  if (!fn){ sfx.soft(); mzFlyBack(wrap, p.key, p); return; }
  const ok = mzApply(fn, land, ghostRect, before, physical);
  if (ok){
    sfx.drop();
    if (physical){
      mzCloseDeckRoom(deckRoom);
      if (p.type === 'deck' && t.bench) p.g.querySelectorAll('.mztk').forEach(el => el.remove());
      mzFlyBack(wrap, typeof land === 'function' ? land(ok) : land, p);
    } else wrap.remove();
  } else mzFlyBack(wrap, p.key, p);   // refused (the reason shows under the deck): back where it came from
}
function mzUp(e){
  const p = mzP; if (!p || e.pointerId !== p.pid) return;
  if (p.drag){
    if (p.frame || p.cx !== e.clientX || p.cy !== e.clientY){
      if (p.frame) cancelAnimationFrame(p.frame);
      p.cx = e.clientX; p.cy = e.clientY; mzDragFrame(p, false);
    }
    mzDrop(false); return;
  }
  const el = p.el; mzClear();
  if (!p.inspector && el.isConnected && mzActive()) mzOpen(el);
}
function mzCancel(){
  if (!mzP) return;
  if (mzP.drag) mzDrop(true); else mzClear();
}
$('view-play').addEventListener('pointerdown', mzDown);
window.addEventListener('pointermove', mzMove, {passive:false});
window.addEventListener('pointerup', mzUp);
window.addEventListener('pointercancel', e => { if (mzP && e.pointerId === mzP.pid) mzCancel(); });
window.addEventListener('blur', mzCancel);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mzP?.drag){ e.stopPropagation(); e.preventDefault(); mzCancel(); }
}, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) mzCancel(); });
// once a card is lifted, a moving finger drags it instead of scrolling the page
document.addEventListener('touchmove', e => { if (mzP && (mzP.lifted && mzP.touch || mzP.drag)) e.preventDefault(); }, {passive:false});
// no long-press menu or picture drag on the cards
$('view-play').addEventListener('contextmenu', e => { if (e.target.closest('.mz [data-mz]')) e.preventDefault(); });
$('view-play').addEventListener('dragstart', e => { if (e.target.closest && e.target.closest('.mz')) e.preventDefault(); });
// keyboard: Enter or Space opens a card; its buttons do the moving
$('view-play').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest && e.target.closest('.mz [data-mz]'); if (!el || e.target !== el || !mzActive()) return;
  e.preventDefault(); mzOpen(el);
});
// the buttons on an opened card (pressed for you from the pop-up)
$('view-play').addEventListener('click', e => {
  const b = e.target.closest('button[data-act^="mz-"]'); if (!b) return;
  e.stopPropagation(); if (!mzActive()) return;
  const act = b.dataset.act, id = b.dataset.id, name = b.dataset.name;
  if (act === 'mz-add'){ const from = (mzEl(isBat(name) ? 's:' + name : 'u:' + name) || b).getBoundingClientRect();
    if (mzApply(() => mzOps.add(name, ui.draft.length), nid => 'd:' + nid, from)) sfx.drop(); return; }
  if (act === 'mz-bench'){ const u = mzUnit(id); if (!u) return; const k = 'd:' + id, from = mzEl(k) ? mzEl(k).getBoundingClientRect() : null;
    if (mzApply(() => mzOps.bench(id), isBat(u.name) ? 's:' + u.name : 'u:' + u.name, from)) sfx.soft(); return; }
  if (act === 'mz-strip'){ if (mzApply(() => mzOps.strip(id))) sfx.soft(); return; }
}, true);
