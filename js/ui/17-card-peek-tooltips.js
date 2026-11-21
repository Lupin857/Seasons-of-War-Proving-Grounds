/* ===================== CARD PEEK ===================== */
// Market cards are short; press and hold one to see it full size, let go to put it back.
function markMore(){
  for (const el of $('view-play').querySelectorAll('.mktp .mcard, .fcards .mcard, .dgrid .mcard')){
    const tx = el.querySelector('.tx');
    el.classList.toggle('more', !!tx && tx.scrollHeight > tx.clientHeight + 2);
  }
}
let press = null, peekEl = null, eatClick = false, peekReady = false;

/* ===== Keywords on the large pop-up card =====
   KEYWORDS below is the one dictionary for every keyword tooltip. To add a keyword, add a line; to change one,
   edit its line. Everything else is built from it automatically: the matching (plurals like "charges" and
   "graveyards" are found on their own), the bold keywords in card text, the hover tooltips on them, and the
   Keywords list under a pop-up card. The pop-up lists only the keywords actually printed on that card.
   Each entry is  'Name': 'definition'  or  'Name': {d:'definition', also:[other spellings], notBefore:[next words that mean it isn't this keyword]}.
   A name written "A / B" matches either half. An empty definition just bolds the word. **Word** bolds inside a definition.
   The definitions mirror the Keywords tab of the SOW rules sheet. */
const KEYWORDS = {
  'While Revealed': 'Active as long as this unit is your **Revealed Unit**.',
  'While Charging': 'Active as long as this unit is your **Charging Unit**.',
  'On My Death': 'Triggers immediately when this unit **Dies**, before any units move.',
  'Battle Start': 'Triggers once as the battle begins.',
  'Revealed Unit': {d:'The top card of your deck during battle.', also:['revealed']},
  'Charging Unit': {d:'The unit in your charge zone. It fights the enemy **Charging Unit**.', also:['charging']},
  'Charge': {d:'Triggers when this unit moves into your charge zone.', notBefore:['zone', 'zones']},
  'Reveal': 'Triggers when this unit becomes the top card of your deck, including at the start of a battle.',
  'Mobilize': 'Triggers during the Mobilize phase.',
  'Shop': 'Active during the Shop phase.',
  'Vanguard': 'The first unit in your deck’s **Mobilize** order, tokens included. A unit stays the Vanguard for the whole battle, even after it moves or **Dies**.',
  'Rearguard': 'The last unit in your deck’s **Mobilize** order, tokens included. A unit stays the Rearguard for the whole battle, even after it moves or **Dies**.',
  'Ahead of Me / Behind Me': 'Units form one line: your deck, your charge zone, the enemy’s charge zone, the enemy’s deck. “Ahead of me” is the next unit toward the enemy; “behind me” is the next unit toward the bottom of my deck. Empty zones are skipped. Graveyards don’t count.',
  'Graveyard': 'Where your units go when they **Die**, keeping their tokens. They return to your deck after each battle.',
  'Overrun': 'If this damage kills its target, the leftover damage hits the next enemy unit behind the target.',
  'Shield-break': 'This damage isn’t blocked by **Shields**. The target’s **Shields** are all discarded, then it takes the damage.',
  'Stealth': 'In a fight, I **Attack** the enemy **Revealed Unit** (if there is one) instead of the enemy **Charging Unit**. The enemy **Charging Unit** still attacks me.',
  'Lethal': 'When this damage hits a unit (and isn’t blocked or reduced to 0), that unit **Dies**.',
  'Silenced': 'A Silenced unit is treated as if it has no ability text. Its gear still works.',
  'Gear': {d:'Bought from the building deck, it goes to your hand. During **Mobilize**, equip it to a unit in your deck: one gear per unit. It only counts as equipped in battle and comes back to your hand after. Gear and tokens don’t conflict, and if a unit already has gear, any other gear trying to equip it fails.', also:['equipped']},
  'Discard Pile': {d:'Sold, discarded and unbought returning cards go here face up. Only **War College** buys from it (free duplicates of cards you own, using a buy).', also:['discard pile']},
  'Level': 'Values written X/X/X have one number per level. A card’s level equals its number of copies: 1 copy uses the first number, 2 copies the second, and so on. Copies beyond the highest level have no extra effect.',
  'Train': '**Attach** a **Training** token to the unit.',
  'Token': 'A card or marker gained from an ability. Tokens don’t count toward the unique-unit limit and don’t combine.',
  'Attach': {d:'Place a token directly behind a unit. It stays with that unit, even in the **Graveyard**.', also:['attached']},
  'Income': 'Money you gain each shop, on top of $3.',
  'City': 'Where your buildings go: 5 slots.',
  'Power': '',
  'Attack': '',
  'Dies': {d:'', also:['die', 'died']}
};
// Tokens: shown as a mini card when a card names them. Add a token here and it is picked up the same way.
const KW_TOKENS = {
  Armament:'**Token**. **Attach**ed to a unit, it gives that unit +1 **Power**.',
  Shield:'**Token**. **Attach**ed to a unit. If that unit would take damage, discard one Shield instead.',
  Training:'**Token**. **Attach**ed to a unit, it counts as an extra copy of that unit for its **Level**. It can’t raise a unit past its highest level.'
};
// Market cards that other cards name: shown as a mini card (their text comes from the card list itself)
const KW_CARDS = ['Recruit', 'Field'];

// ---- built automatically from the lists above: no need to edit below this line ----
const KW = [];   // [id, shown as, pattern, definition]; minis use the id "c:Name"
(function buildKW(){
  const rx = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // one spelling -> a pattern: any spacing between words, and an optional plural ending on the last word
  const pat = (sp, notBefore) => rx(sp.toLowerCase().trim()).replace(/\s+/g, '\\s+') + '(?:e?s)?' + (notBefore && notBefore.length ? `(?!\\s+(?:${notBefore.map(rx).join('|')})\\b)` : '');
  const add = (id, shown, spellings, def, notBefore) => {
    const uniq = [...new Set(spellings.map(x => x.trim()).filter(Boolean))];
    KW.push([id, shown, uniq.map(sp => pat(sp, notBefore)).join('|'), def || '', Math.max(...uniq.map(x => x.length))]);
  };
  for (const [name, v] of Object.entries(KEYWORDS)){
    const e = typeof v === 'string' ? {d:v} : (v || {});
    add(name, name, [...name.split(' / '), ...(e.also || [])], e.d, e.notBefore);
  }
  for (const n of Object.keys(KW_TOKENS)) add('c:' + n, n, [n], '');
  for (const n of KW_CARDS) add('c:' + n, n, [n], '');
  // longer spellings first, so "revealed unit" wins over "revealed" and "reveal"
  KW.sort((a, b) => b[4] - a[4]);
})();
const KW_BY = Object.fromEntries(KW.map(k => [k[0], k]));
const KW_RE = new RegExp(`\\b(?:${KW.map(k => `(${k[2]})`).join('|')})\\b`, 'gi');
const kwTitle = t => t.replace(/\s+/g, ' ').replace(/\b[a-z]/g, c => c.toUpperCase()).replace(/ Of /g, ' of ');
const kwPlain = src => src.replace(/\*\*(.+?)\*\*/g, '$1');
// the hover tooltip for a keyword: its definition, or a named token's / card's own text
function kwTip(id){
  if (id.startsWith('c:')){ const n = id.slice(2), t = kwMiniText(n); return t ? `${n}: ${kwPlain(t)}` : ''; }
  const k = KW_BY[id]; return k && k[3] ? `${k[1]}: ${kwPlain(k[3])}` : '';
}
// find keyword ids in plain text, in order of first appearance
function kwScan(text, into){
  KW_RE.lastIndex = 0; let m;
  while ((m = KW_RE.exec(text))){ const i = m.slice(1).findIndex(Boolean); if (i >= 0) into.add(KW[i][0]); }
  return into;
}
// bold and capitalize every keyword inside an element's rules text; returns the ids found. With tips, each keyword
// also gets a hover tooltip (used where no keyword list is shown, like the battle's ability notes; never on pop-ups)
function kwDecorate(root, into, tips){
  into = into || new Set();
  root.querySelectorAll('.tx, .mtx, .kwt').forEach(el => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) if (!w.currentNode.parentElement.closest('b.kw')) nodes.push(w.currentNode);
    for (const n of nodes){
      const t = n.nodeValue; KW_RE.lastIndex = 0; if (!KW_RE.test(t)) continue;
      KW_RE.lastIndex = 0;
      const f = document.createDocumentFragment(); let last = 0, m;
      while ((m = KW_RE.exec(t))){
        const i = m.slice(1).findIndex(Boolean), id = KW[i][0]; into.add(id);
        f.append(t.slice(last, m.index));
        const b = document.createElement('b'); b.className = 'kw'; b.textContent = kwTitle(m[0]);
        const tip = tips && kwTip(id); if (tip) b.dataset.tip = tip;
        f.append(b);
        last = m.index + m[0].length;
      }
      f.append(t.slice(last)); n.replaceWith(f);
    }
  });
  return into;
}
// definition / mini-card text: **bold** marks, then every keyword bolded and capitalized like the card text
function kwText(src){
  const raw = esc(src).replace(/\*\*(.+?)\*\*/g, '$1');
  return raw.replace(KW_RE, m => `<b class="kw">${kwTitle(m)}</b>`);
}
function kwMiniText(name){
  if (KW_TOKENS[name]) return KW_TOKENS[name];
  const d = DEFS[name] || BDEFS[name]; return d ? d.t : '';
}
// the Keywords list under a pop-up card: only what is printed on that card, in the order it appears
function kwGlossHTML(ids, self){
  const all = [...ids].filter(id => KW_BY[id] && id !== 'c:' + self && !(id.startsWith('c:') && dispName(id.slice(2)) === self));
  const defs = all.filter(id => !id.startsWith('c:') && KW_BY[id][3]);
  const minis = all.filter(id => id.startsWith('c:') && kwMiniText(id.slice(2)));
  if (!defs.length && !minis.length) return '';
  const tok = n => !!KW_TOKENS[n];
  const mini = id => { const n = id.slice(2), b = !!BDEFS[n] && !DEFS[n];
    return `<div class="kwmini ${tok(n) ? 'tok t-' + n.toLowerCase() : b ? 'b' : 'u'}"><span class="kwmn">${esc(n)}${tok(n) ? '<i>Token</i>' : ''}</span><span class="kwmt">${kwText(kwMiniText(n))}</span></div>`; };
  return `<div class="kwgloss">${defs.length ? `<span class="eyebrow">Keywords</span><dl>${defs.map(id => `<div><dt>${esc(KW_BY[id][1])}</dt><dd>${kwText(KW_BY[id][3])}</dd></div>`).join('')}</dl>` : ''}${minis.length ? `<span class="eyebrow">Tokens and cards named</span><div class="kwminis">${minis.map(mini).join('')}</div>` : ''}</div>`;
}
/* THE large pop-up card. Every phase (shop, deck view, Mobilize, battle; phone sheet or press-and-hold) builds it here,
   fresh from the card's identity, so it always looks the same: the shared cardFace(), then the source card's status
   stamps and its buttons. Nothing from where the card sat (Vanguard ring, faded "can't afford", stack shadows,
   tapped or selected states) comes along. Styled only by .cardpop / .peek. */
const popBtns = card => [...card.querySelectorAll(':scope > button, :scope > .row button, :scope .dbtn button')];
function cardPop(card){
  const m = card.querySelector('.cfm');
  const side = card.classList.contains('ai') ? ' ai' : '';
  const pk = document.createElement('div');
  if (m){
    const k = m.dataset.k === 'b' ? 'b' : 'u', o = m.dataset.o === '' ? 0 : +m.dataset.o;
    pk.className = `mcard cardpop peek ${k}${side}`;
    pk.innerHTML = cardFace(m.dataset.n, k, o, !!m.dataset.x);
  } else {
    // a card drawn without cardFace (a token card, the Discard Writ picker): its own contents, none of its context
    pk.className = `mcard cardpop peek ${card.classList.contains('b') ? 'b' : 'u'}${side}`;
    pk.innerHTML = card.innerHTML;
    pk.querySelectorAll('.stamps, button, .dord, .pkhit, .dealback, .mirpop, .hgtok').forEach(n => n.remove());
  }
  const st = card.querySelector(':scope > .stamps'); if (st) pk.appendChild(st.cloneNode(true));
  for (const b of popBtns(card)){ const c = b.cloneNode(true); c.removeAttribute('style'); pk.appendChild(c); }
  return pk;
}
function openPeek(card, byTap){
  closePeek(true);
  const r = card.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 32);
  const wrap = document.createElement('div'); wrap.className = 'peekwrap';
  const pk = cardPop(card); pk.setAttribute('aria-hidden', 'true');
  try{
    const kwIds = kwDecorate(pk);   // only the keywords printed on this card
    const self = (pk.querySelector('.nm') || {}).textContent;
    const gl = kwGlossHTML(kwIds, self && self.trim());
    if (gl) pk.insertAdjacentHTML('beforeend', gl);   // under the card's own buttons, so Buy and Sell stay at the top
  }catch(e){}
  if (compact()) return openSheet(card, pk, wrap);
  pk.style.width = w + 'px'; pk.style.left = '0px'; pk.style.top = '0px';
  wrap.appendChild(pk); document.body.appendChild(wrap);
  const h = pk.offsetHeight, top0 = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bh')) || 0) + 12;
  const x = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), window.innerWidth - 16 - w);
  const y = Math.min(Math.max(top0, r.top + r.height / 2 - h / 2), window.innerHeight - 16 - h);
  pk.style.left = x + 'px'; pk.style.top = Math.max(16, y) + 'px';
  // miracles behind it: the hover box, shown as its own box above the full-size card
  const mw = card.parentElement && card.parentElement.classList.contains('mirwrap') ? card.parentElement.querySelector('.mirhover') : null;
  if (mw){
    const box = mw.cloneNode(true); try{ kwDecorate(box); }catch(e){} box.classList.add('peekmir'); box.style.top = '0px';
    const k = box.querySelectorAll('.mirseal').length || 1, room = Math.min(window.innerWidth - 32, 640), bw = Math.max(170, Math.min(200, (room - (k - 1) * 8) / k));
    const bt = Math.min(room, k * bw + (k - 1) * 8), bx = Math.min(Math.max(16, x + w / 2 - bt / 2), window.innerWidth - 16 - bt);
    box.style.setProperty('--mhw', bw + 'px'); box.style.setProperty('--mhx', '0px'); box.style.left = bx + 'px'; box.style.width = bt + 'px';
    box.style.setProperty('--mha', Math.max(12, Math.min(bt - 26, x + w / 2 - bx - 7)) + 'px');
    wrap.appendChild(box);
    const bh = box.offsetHeight, py = Math.max(16, y);
    let by = py - bh - 12;
    if (by < 16){ by = py + h + 12; box.classList.add('below'); }
    box.style.top = by + 'px';
  }
  popIn([pk, wrap.querySelector('.peekmir')], wrap);
  peekEl = wrap; card.classList.add('peeked'); peekReady = false;
  if (byTap) setTimeout(() => { if (peekEl === wrap) peekReady = true; }, 0);
  wirePeek(card, wrap);
  const strip = document.createElement('div'); strip.className = 'pkdrag'; strip.setAttribute('aria-hidden', 'true'); pk.prepend(strip);
  wireSwipe(pk, wrap, strip, [wrap.querySelector('.peekmir')]);
  sfx.pick(); if (navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}
// On a phone the card opens as a sheet from the bottom of the screen: full text at a readable size, any miracles
// behind it, and the card's own buttons (Buy, Sell, Add to deck...) big enough to tap. Tap outside or ✕ to close.
function openSheet(card, pk, wrap){
  wrap.classList.add('sheetwrap');
  const box = document.createElement('div'); box.className = 'sheet'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<div class="sheethead"><span class="grab" aria-hidden="true"></span><button type="button" class="sheetx" aria-label="Close">✕</button></div>';
  const mw = card.parentElement && card.parentElement.classList.contains('mirwrap') ? card.parentElement.querySelector('.mirhover') : null;
  if (mw){ const m = mw.cloneNode(true); try{ kwDecorate(m); }catch(e){} m.className = 'sheetmir'; m.removeAttribute('aria-hidden'); box.appendChild(m); }
  pk.removeAttribute('aria-hidden'); box.appendChild(pk);
  pk.querySelectorAll('button[aria-label]').forEach(b => { if (b.textContent.trim().length <= 2) b.textContent = b.getAttribute('aria-label'); });   // spell out the ← → ✕ buttons
  // a hint under the buttons when there's nothing to do with the card right now
  if (!pk.querySelector('button:not([disabled])')) box.insertAdjacentHTML('beforeend', '<p class="note sheetnote">Tap outside the card to close it.</p>');
  wrap.appendChild(box); document.body.appendChild(wrap);
  document.documentElement.classList.add('sheet-open');
  popIn([box], wrap);
  peekEl = wrap; card.classList.add('peeked'); peekReady = false;
  setTimeout(() => { if (peekEl === wrap) peekReady = true; }, 0);
  wirePeek(card, wrap);
  wireSwipe(box, wrap, box.querySelector('.sheethead'));
  sfx.pick(); if (navigator.vibrate) try{ navigator.vibrate(8); }catch(e){}
}
// Swipe a pop-up card down by its top strip to close it (the phone sheet's grab handle, or the top of the floating card
// on desktops and tablets): the card follows the finger, and letting go far enough down, or with a quick flick, sends it
// off the bottom; a short drag springs back. Any miracles box shown with it moves along. ✕, Escape and tapping outside still work.
function wireSwipe(box, wrap, head, extras, o){
  if (!head) return;
  // o: how this pop-up opens and closes. The default is the card pop-up (peekEl); the peek window passes its own.
  o = o || {open:() => peekEl === wrap, now:() => closePeek(true), leave:() => { peekEl = null; },
            done:() => { if (!peekEl){ peekEl = wrap; closePeek(true); } else wrap.remove(); }};
  const all = [box, ...(extras || []).filter(Boolean)];
  const bg0 = getComputedStyle(wrap).backgroundColor;
  const bgAt = f => bg0.replace(/rgba?\(([^)]+)\)/, (m, a) => { const v = a.split(',').map(x => x.trim()); const al = v.length > 3 ? +v[3] : 1; return `rgba(${v[0]},${v[1]},${v[2]},${(al * f).toFixed(3)})`; });
  let drag = null;
  const setY = y => { all.forEach(b => b.style.translate = `0 ${y}px`); wrap.style.backgroundColor = bgAt(Math.max(0, 1 - y / Math.max(1, box.offsetHeight))); };
  head.addEventListener('pointerdown', e => {
    if (e.button > 0 || e.target.closest('.sheetx') || !o.open()) return;
    all.forEach(b => b.getAnimations().forEach(a => a.cancel())); wrap.getAnimations().forEach(a => a.cancel());
    drag = {id:e.pointerId, y0:e.clientY, y:0, pts:[[e.timeStamp, 0]], moved:false};
    try{ head.setPointerCapture(e.pointerId); }catch(err){}
    head.classList.add('dragging');
  });
  head.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y0;
    drag.y = dy > 0 ? dy : dy / 4;              // pulling up only gives a little, then springs back
    if (Math.abs(dy) > 4) drag.moved = true;
    drag.pts.push([e.timeStamp, drag.y]); if (drag.pts.length > 6) drag.pts.shift();
    setY(drag.y);
  });
  const end = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null; head.classList.remove('dragging');
    const [t0, y0] = d.pts[0], dt = Math.max(1, e.timeStamp - t0), v = (d.y - y0) / dt;   // px per ms over the last few moves
    const far = d.y > Math.min(140, box.offsetHeight * .3), flick = v > .6 && d.y > 24;
    if (e.type !== 'pointercancel' && d.moved && (far || flick)){
      if (!o.open()) return;
      if (navigator.vibrate) try{ navigator.vibrate(6); }catch(err){}
      if (reduceMotion()){ o.now(); return; }
      o.leave();                                    // stop taps on the dying sheet; done() finishes the job
      wrap.style.pointerEvents = 'none';
      const to = window.innerHeight - Math.min(...all.map(b => b.getBoundingClientRect().top)) + d.y + 20;
      const ms = Math.max(140, Math.min(UNPOP_MS, (to - d.y) / Math.max(v, 1.2)));
      let a = null; all.forEach(b => { a = b.animate([{translate:`0 ${d.y}px`}, {translate:`0 ${to}px`}], {duration:ms, easing:'cubic-bezier(.3,.6,.6,1)', fill:'forwards'}); });
      wrap.animate([{backgroundColor:wrap.style.backgroundColor || bg0}, {backgroundColor:bgAt(0)}], {duration:ms, easing:'ease-out', fill:'forwards'});
      a.onfinish = () => o.done();
    } else {
      // not far enough: spring back up
      const from = d.y;
      all.forEach(b => b.style.translate = ''); wrap.style.backgroundColor = '';
      if (from && !reduceMotion()){
        all.forEach(b => b.animate([{translate:`0 ${from}px`}, {translate:'0 0'}], {duration:220, easing:'cubic-bezier(.2,.9,.3,1.1)'}));
        wrap.animate([{backgroundColor:bgAt(Math.max(0, 1 - from / Math.max(1, box.offsetHeight)))}, {backgroundColor:bg0}], {duration:220, easing:'ease-out'});
      }
    }
  };
  head.addEventListener('pointerup', end);
  head.addEventListener('pointercancel', end);
}
function wirePeek(card, wrap){
  // each button in the enlarged copy presses the same button on the real card: matched by position when it opened,
  // or (if the screen has redrawn since) by finding the live button whose data matches, compared directly
  const liveBtns = popBtns(card);
  const sameData = (a, b) => { const ka = Object.keys(a.dataset); return ka.length && ka.length === Object.keys(b.dataset).length && ka.every(k => a.dataset[k] === b.dataset[k]); };
  wrap.addEventListener('click', e => {
    if (!peekReady) return;                       // ignore the release of the press that opened it
    const b = e.target.closest('.peek button');
    if (b){
      const pkBtns = [...wrap.querySelectorAll('.peek button')], k = pkBtns.indexOf(b);
      let live = liveBtns[k];
      if (!live || !live.isConnected || !sameData(live, b)) live = [...document.querySelectorAll('#view-play button[data-act]')].find(x => sameData(x, b)) || null;
      // the card sinks away first, then its button is pressed, so a buy's flight to the deck isn't hidden behind it
      closePeek(false, () => {
        if (!live || !live.isConnected) live = [...document.querySelectorAll('#view-play button[data-act]')].find(x => sameData(x, b)) || null;
        if (live && !live.disabled) live.click();
      });
      return;
    }
    if (e.target.closest('.sheetx') || !e.target.closest('.peek, .sheet')) closePeek();   // tap outside the card: back to the market
  });
}
// Battle cards: click (or tap) one to read its full rules as a shop-style card, at its level in this battle.
let rulesSrc = null;
function openRules(el){
  const n = el.dataset.name, lv = +el.dataset.lvl || 1, k = el.dataset.kind === 'b' ? 'b' : 'u';
  if (!n || !(k === 'b' ? BDEFS[n] : DEFS[n])) return;
  if (rulesSrc) rulesSrc.remove();
  const r = el.getBoundingClientRect();
  const src = rulesSrc = document.createElement('div');
  src.className = `mcard fcard ${k}` + (el.dataset.side === '1' ? ' ai' : ''); src.setAttribute('aria-hidden', 'true');
  src.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;visibility:hidden;pointer-events:none`;
  src.innerHTML = cardFace(n, k, lv, true);
  document.body.appendChild(src);
  openPeek(src, true);
}
$('view-play').addEventListener('click', e => {
  const c = e.target.closest('.stage .card'); if (!c || e.target.closest('button')) return;
  openRules(c);
});
function closePeek(now, after){
  if (!peekEl){ if (after) after(); return; }
  const w = peekEl; peekEl = null;
  document.documentElement.classList.remove('sheet-open');
  document.querySelectorAll('.mcard.peeked').forEach(c => c.classList.remove('peeked'));
  if (now){ w.remove(); if (after) after(); return; }
  const sh = w.querySelector('.sheet');
  popOut(sh ? [sh] : [...w.querySelectorAll('.mcard.peek, .peekmir')], w, () => { w.remove(); if (after) after(); });
}
// Every pop-up (card views, deck sheets, miracles, reminders, turn banners, toasts) rises in from the bottom of the
// screen when it opens and sinks back down when it closes, the same on phones and desktops. The backdrop fades with it.
const POP_MS = 480, UNPOP_MS = 340;
function popDist(boxes){ return Math.max(60, window.innerHeight - Math.min(...boxes.map(b => b.getBoundingClientRect().top))); }
function popIn(boxes, back){
  boxes = (boxes || []).filter(Boolean);
  if (reduceMotion() || !boxes.length) return;
  const d = popDist(boxes);
  // phones: a shorter slide on the graphics layer (transform, not translate, so Safari composites it instead of
  // repainting the sheet and its shadow every frame)
  const ph = compact(), ms = ph ? 300 : POP_MS;
  boxes.forEach(b => {
    if (ph){ b.style.willChange = 'transform'; b.animate([{transform:`translate3d(0,${d}px,0)`}, {transform:'translate3d(0,0,0)'}], {duration:ms, easing:'cubic-bezier(.16,1,.3,1)'}).onfinish = () => { b.style.willChange = ''; }; }
    else b.animate([{translate:`0 ${d}px`}, {translate:'0 0'}], {duration:ms, easing:'cubic-bezier(.22,.7,.3,1)'});
  });
  if (back && !boxes.includes(back)) back.animate([{backgroundColor:'rgba(0,0,0,0)'}, {backgroundColor:getComputedStyle(back).backgroundColor}], {duration:ms * .7, easing:'ease-out'});
}
function popOut(boxes, back, done){
  boxes = (boxes || []).filter(b => b && b.isConnected);
  if (reduceMotion() || !boxes.length){ done(); return; }
  if (back) back.style.pointerEvents = 'none';
  boxes.forEach(b => b.style.pointerEvents = 'none');
  const d = popDist(boxes), ph = compact(), ms = ph ? 220 : UNPOP_MS;
  let a = null;
  boxes.forEach(b => { b.getAnimations().forEach(x => x.cancel());
    a = ph ? (b.style.willChange = 'transform', b.animate([{transform:'translate3d(0,0,0)'}, {transform:`translate3d(0,${d}px,0)`}], {duration:ms, easing:'cubic-bezier(.4,0,.9,.6)', fill:'forwards'}))
           : b.animate([{translate:'0 0'}, {translate:`0 ${d}px`}], {duration:ms, easing:'cubic-bezier(.5,0,.8,.45)', fill:'forwards'}); });
  if (back && !boxes.includes(back)) back.animate([{backgroundColor:getComputedStyle(back).backgroundColor}, {backgroundColor:'rgba(0,0,0,0)'}], {duration:ms, easing:'ease-in', fill:'forwards'});
  a.onfinish = done;
}
function endPress(){
  if (press){ clearTimeout(press.t); press = null; }
  if (peekEl && !peekReady){ eatClick = true; setTimeout(() => { eatClick = false; peekReady = !!peekEl; }, 60); }
}
$('view-play').addEventListener('pointerdown', e => {
  const card = e.target.closest('.mktp .mcard, .fcards .mcard, .dgrid .mcard'); if (!card || e.button > 0 || card.classList.contains('masonpick') || card.classList.contains('tcard') || card.classList.contains('writtgt') || card.classList.contains('writoff')) return;
  if (compact()) return;   // phones open a card with a tap instead
  if (e.pointerType !== 'mouse' && card.closest('.dgrid')) return;   // touch: holding a Mobilize card picks it up to drag; double-tap reads it
  endPress();
  press = {x:e.clientX, y:e.clientY, t:setTimeout(() => openPeek(card), 380)};
});
window.addEventListener('pointermove', e => { if (press && !peekEl && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) endPress(); });
window.addEventListener('pointerup', e => { if (peekEl && peekReady) return; endPress(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && peekEl) closePeek(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !peekEl && (ui.pkWin || ui.deckView != null)){ popShut(); renderPlay(); } }, true);   // capture: runs before a card pop-up's Escape, so one press closes one thing
// a card with miracles behind it opens its panel from the keyboard too
$('view-play').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.mcard.hasmir, .mcard.writtgt, .stage .card.citycard')){ e.preventDefault(); e.target.click(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && ui.remind){ ui.remind = null; renderPlay(); } });
$('view-play').addEventListener('click', e => { if (ui.remind && e.target.classList && e.target.classList.contains('remind')){ ui.remind = null; renderPlay(); } });
window.addEventListener('pointercancel', () => { if (peekEl && peekReady) return; endPress(); });
window.addEventListener('scroll', () => { if (press && !peekEl) endPress(); }, {passive:true});
// phones: tapping a card in the market or in anyone's forces opens it as a sheet (Mobilize cards have their own taps)
$('view-play').addEventListener('click', e => {
  if (!G || ui.start) return;
  if (e.target.closest('button')) return;
  if (!compact() && (e.target.closest('.hgtok') || e.target.closest('.mcard.hasmir'))) return;   // desktop: a covered card's click shows its miracles   // the card's own buttons (pressed for you from the sheet) act as usual
  const card = e.target.closest('.mktp .mcard, .fcards .mcard, .pkwin .mcard'); if (!card || card.classList.contains('masonpick') || card.classList.contains('writtgt') || card.classList.contains('writoff') || e.target.closest('.mirpop')) return;
  if (ui.pick && card.closest('#deck-list')) return;
  e.stopPropagation(); e.preventDefault(); openPeek(card, true);
}, true);
// the press that opened a peek must not also buy the card
$('view-play').addEventListener('click', e => { if (eatClick){ e.stopPropagation(); e.preventDefault(); eatClick = false; } }, true);
$('view-play').addEventListener('contextmenu', e => { if (e.target.closest('.mktp .mcard, .fcards .mcard, .dgrid .mcard')) e.preventDefault(); });
let moreRz = null, wasCompact = compact();
window.addEventListener('resize', () => { const c = compact(); if (c !== wasCompact){ wasCompact = c; if (G && !$('view-play').hidden && G.phase === 'shop' && !ui.battle) renderPlay(); } });
window.addEventListener('resize', () => { clearTimeout(moreRz); moreRz = setTimeout(() => { if (!$('view-play').hidden) markMore(); const pb = $('gtop'), bd = pb && pb.offsetHeight ? pb : $('view-play').querySelector('.board'); if (bd) document.documentElement.style.setProperty('--bh', bd.offsetHeight + 'px'); }, 120); });

// miracles behind a card open side by side above it on hover: each box about a card wide, and the row slides left
// when it would run off the right edge of the screen (the little arrow still points at the card)
document.addEventListener('mouseover', e => {
  const w = e.target.closest && e.target.closest('.mirwrap'); if (!w) return;
  const h = w.querySelector(':scope > .mirhover'); if (!h) return;
  const k = h.querySelectorAll('.mirseal').length || 1, r = w.getBoundingClientRect();
  const room = Math.min(window.innerWidth - 32, 640), bw = Math.max(170, Math.min(200, (room - (k - 1) * 8) / k));
  const tot = Math.min(room, k * bw + (k - 1) * 8);
  const x = Math.max(16 - r.left, Math.min(0, window.innerWidth - 16 - (r.left + tot)));
  h.style.setProperty('--mhw', bw + 'px'); h.style.setProperty('--mhx', x + 'px');
});
/* ===================== TOOLTIPS ===================== */
const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.hidden = true; document.body.appendChild(tip);
function showTip(el){
  const text = el.getAttribute('data-tip'); if (!text) return;
  tip.textContent = text; tip.hidden = false;
  const big = matchMedia('(pointer:coarse), (max-width:640px)').matches;
  const r = el.getBoundingClientRect(), w = Math.min(big ? 380 : 300, window.innerWidth - 24);
  tip.style.maxWidth = w + 'px';
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 12);
  let y = r.bottom + 8; if (y + th > window.innerHeight - 8) y = r.top - th - 8;
  tip.style.left = x + 'px'; tip.style.top = Math.max(8, y) + 'px';
}
const hideTip = () => { tip.hidden = true; };
document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); else hideTip(); });
document.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
document.addEventListener('focusout', hideTip);
document.addEventListener('scroll', hideTip, true);
// touch screens: a help popup opens when you tap its "?" (not when a scroll happens to start on it) and closes when you tap elsewhere or scroll
document.addEventListener('click', e => { if (!coarse()) return; const el = e.target.closest('[data-tip]'); if (el) showTip(el); else hideTip(); });

try{ if (!document.documentElement.lang) document.documentElement.lang = 'en'; }catch(e){}   // lets long card names hyphenate on small cards
// a save the current version can't draw (a card it names was removed, say) falls back to the start screen instead of a frozen page
// runs once every script on the page has loaded: the battle board's helpers (labDeck, labGrave, ...) live in a later
// <script>, so resuming a saved battle any earlier drew the Play tab as an error box
function resumeOrStart(){
  let resumed = false;
  try{ if (loadSave()){ renderPlay(); resumed = true; if (ui.battle) startAuto(600); else scheduleAI(); } }
  catch(e){   // kept aside rather than deleted, in case a later fix can read it
    console.error('Saved game could not be resumed', e);
    try{ localStorage.setItem('sow-save-unreadable', localStorage.getItem(SAVE_KEY)); localStorage.removeItem(SAVE_KEY); }catch(e2){}
    stopTimers(); G = null; ui = {};
  }
  if (!resumed){ ui.start = true; renderPlay(); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resumeOrStart, {once:true}); else resumeOrStart();

/* STARTUP SYNC (moved from js/ui/15-sync-roles-ratings.js; it must start after every UI file has loaded).
   Checks sign-in and role, loads stats, then starts watching the balance, ratings and AI. */
(async () => {
  await null;   // let the rest of the page's script finish defining things first
  try{ if (window.claude && typeof window.claude.use === 'function') dbns = await window.claude.use('db'); }catch(e){ dbns = null; }
  let admin = false;
  try{ const u = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('user') : null; admin = !!(u && u.canEdit()); }catch(e){ admin = false; }
  if (admin !== canAdmin){ LS.set('sow-admin', admin); if (!admin) LS.set('sow-preview', false); location.reload(); return; }
  if (isPlayer()) await loadPlayerStats(); else await restoreOwnerStats();
  syncState.ready = true; watchFinal(); watchCal(); refreshViews(); refreshStart(); startAiSync();
})();
