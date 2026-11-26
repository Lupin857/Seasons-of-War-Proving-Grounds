
/* ===== Board settings: the battle board's look (table view, card size, splay, impact, depth, zoom), saved per browser ===== */
// Which version of the game this is: the artifact's publish number, bumped on every publish (shown in Board settings,
// so a bug report can say which version it came from; the repo's commit message ends with the same number)
const OASIS_BUILD = 'v92-engine-refactor';
const LAB_DEF = {view:'table', tilt:15, size:'auto', splay:'now', stock:true, light:true, freeze:true, dust:true, squash:true, jolt:false, stopMs:85, power:1, thump:true, thumpPx:4, thumpMin:4, recoil:true, recoilPx:8, abWind:true, abStamp:true, abStop:true, tokPop:true, kwOverrun:true, kwLethal:true, shBlock:true, shStyle:'glint', shRim:true, inkMin:10, inkMax:25, zoom:115, morph:true, open:false};
let LAB = {...LAB_DEF};
try{ Object.assign(LAB, JSON.parse(localStorage.getItem('oasisBoard') || '{}')); }catch(e){}
LAB.open = false;   // the panel opens only from the game menu (☰ → Board settings), never by itself on load
// one time only: everyone moves to the new default splay (up-left); after that, a player's own choice sticks
try{ if (!localStorage.getItem('oasisBoardSplayUL')){ LAB.splay = 'now'; localStorage.setItem('oasisBoard', JSON.stringify(LAB)); localStorage.setItem('oasisBoardSplayUL', '1'); } }catch(e){}
const labSave = () => { try{ localStorage.setItem('oasisBoard', JSON.stringify(LAB)); }catch(e){} };
const labCrop = () => LAB.size === 'crop' || (LAB.size === 'auto' && compact());
let LABPILE = 0;
// the most bands a stack behind a battle card can have: copies (one band), gear, Might, Training, Shield. Every card
// spot keeps this much room at all times, so nothing on the board moves as stacks grow and shrink.
const STACK_MAX = 5;
// One-screen phone battle on the mat (Brian, Nov 24): the room is the biggest stack any card has in this battle
// instead (LABROOM, worked out by reserveRows before the battle is drawn; fixed for the whole battle), so the board
// fits on a phone. LABSEEN counts the biggest stack pokeArt has drawn while reserveRows lays out every frame.
let LABROOM = null, LABSEEN = 0;
// the phone battle on the mat has no controls row at the top (Brian, Nov 24): Auto and Ability notes sit in the dock
// beside Back / Next step (same buttons and actions as the row's), Skip to end is gone, and the speed is in the ☰ menu
function matBattleDockBtns(){
  return `<button type="button" class="act autobtn" data-act="b-auto" aria-pressed="${autoOn() ? 'true' : 'false'}" title="Play the battle step by step on its own">${autoLabel()}</button>`
    + `<button type="button" class="act abtog" data-act="b-abwin" aria-pressed="${abOn() ? 'true' : 'false'}" title="Show a note for each ability that triggers in this step">Notes</button>`;
}
// showBattle step: work LABROOM out from every frame of the new battle before its first frame is drawn
function labBattleRoom(){
  LABROOM = null;
  if (!ui.battle || !labMatZones()) return;
  LABSEEN = 0; for (const fr of ui.battle.frames) lineHTML(fr, ['Your', 'AI']);
  LABROOM = LABSEEN;
}
const labRoomN = () => (LABROOM != null && typeof ui === 'object' && ui && ui.battle) ? LABROOM : STACK_MAX;
// that room as CSS, for the current splay: [above the card, left of it]
const labFixedRoom = () => { const sp = LAB.splay, fan = sp === 'fanL' || sp === 'fanR', n = labRoomN();
  return [fan ? `calc(var(--tky) * ${(n * .55).toFixed(2)} + ${n ? 10 : 0}px)` : `calc(var(--tky) * ${n})`,
          sp === 'now' ? `calc(var(--tkl) * ${n})` : sp === 'fanL' ? `calc(var(--bcw) * .32)` : '0px']; };
// solid edge layers under a card face: 2 for any card, more for the cards hidden under a deck's top card
const labEdges = n => { const k = 2 + Math.min(n || 0, 8) * 1, c = ['#3b2d23', '#5a4636']; let h = ''; for (let i = k; i >= 1; i--) h += `<b style="--o:${(i * 1.5).toFixed(1)}px;background:${c[i % 2]}"></b>`; return h; };

// every art card gets a card-stock layer under its face and a light layer over it
// (called by cardHTML in js/ui/01-battle-view.js)
function labCardLayers(h){
  return h.replace('<span class="cartbg" aria-hidden="true"></span>',
    `<span class="labsh" aria-hidden="true">${labEdges(LABPILE)}<i></i></span><span class="cartbg" aria-hidden="true"></span><span class="lablt" aria-hidden="true"></span>`);
}
// Arena-style stacking: copies, then gear, then each kind of token once with a count, raised a name band each;
// the room kept around the card follows the splay. Battle cards (cardHTML0) call it for every art card.
function pokeArt(t, side, hit, art){
  const nc = t.filter(k => k === 'cp').length, g = art.gear ? 1 : 0, cnt = {}, kinds = [];
  for (const k of t) if (k !== 'cp'){ if (!(k in cnt)){ cnt[k] = 0; kinds.push(k); } cnt[k]++; }
  LABSEEN = Math.max(LABSEEN, (nc ? 1 : 0) + g + kinds.length);
  const n = labRoomN(), sp = LAB.splay, fan = sp === 'fanL' || sp === 'fanR';   // room is fixed, whatever the stack holds
  const up = fan ? `calc(var(--tky) * ${(n * .55).toFixed(2)} + ${n ? 10 : 0}px)` : `calc(var(--tky) * ${n})`;
  const wide = `calc(var(--bcw) * ${Math.min(.32, .1 * n).toFixed(2)})`;
  const lf = sp === 'now' ? `calc(var(--tkl) * ${n})` : sp === 'fanL' ? wide : '0px';
  const rt = sp === 'diag' ? `calc(var(--tky) * ${((compact() ? .3 : .45) * n).toFixed(2)})` : sp === 'fanR' ? wide : '0px';
  const room = {marginTop:up, marginLeft:lf, marginRight:rt, '--rt':up, '--rl':lf};
  const tuck = j => `style="--j:${j};z-index:${-1 - j}"`;
  let html = '';
  const c1 = nc ? 1 : 0;   // every extra copy shares one band, with a count when there are two
  if (nc) html += `<span class="tk ctk" ${tuck(0)} aria-hidden="true">${art.unitArt ? `<img src="${art.unitArt}" alt="" draggable="false">` : ''}<i class="tkband"></i>${nc > 1 ? `<b class="tkn">×${nc}</b>` : ''}</span>`;
  if (g) html += `<span class="tk gtk${art.gearArt ? '' : ' plain'}" ${tuck(c1)} data-tuck-gear="${esc(art.gear)}"${art.gearArt ? ` data-art="1"` : ''} aria-hidden="true">${art.gearArt ? `<img src="${art.gearArt}" alt="" draggable="false">` : tuckPlainGear(art.gear)}<i class="tkband"></i></span>`;
  html += kinds.map((k, j) => `<span class="pk tk${hit && k === 'sh' ? ' shhit' : ''}" data-k="${k}" data-tuck-tok="${k}" ${tuck(c1 + g + j)} aria-hidden="true"><i class="tkband"></i>${cnt[k] > 1 ? `<b class="tkn">×${cnt[k]}</b>` : ''}</span>`).join('');
  return {shadow:(c1 + g + kinds.length) ? `inset 0 3px 0 var(${side === 1 ? '--gules' : '--azure'})` : '', room, html};
};
const labArt = u => { const nm = u.name.replace(/^Jester → .*/, 'Jester'); return typeof artURL === 'function' ? (DEFS[nm] && DEFS[nm].token ? artURL('Recruit', 'u') : artURL(nm, 'u')) : null; };
// One-screen dev, phone battle on the mat (sand or rug; Brian, Nov 24): the zones lose their boxes and the ⚔︎, and
// each spot is named by one word ("Deck", "Charge", "Defeated") with no owner in front (blue/red and the spot's place
// say whose it is). Empty spots are a plain dashed card outline with no words. lineHTML0 marks the table .matz;
// the look is in css/11-rug.css. Desktop and the rug switch off ('0') keep the boxes and full labels.
function labMatZones(){ return typeof matOn === 'function' && matOn() && document.body.classList.contains('lab-v-table'); }
// the deck: the revealed unit is the top card; the cards under it stay hidden, their edges drawn under its face
function labDeck(sd, side, names){
  const mz = labMatZones();
  const rev = sd.deck[0], rest = sd.deck.length - 1;
  const nsp = sd.deck.reduce((a, u) => a + (u.sp || []).length, 0) + (sd.tail || []).length;
  let top;
  if (rev){
    const k = Math.min(rest, 8), cols = ['#5a4636', '#3b2d23'];
    LABPILE = k;
    try{ top = cardHTML(rev, side, 'revealed'); } finally { LABPILE = 0; }
  } else top = '';
  // the empty-deck outline is part of the board: always drawn in the deck's spot, covered by the top card while there is one
  top = `<div class="slot labempty labslot${rev ? ' under' : ''}" aria-hidden="${rev ? 'true' : 'false'}"${mz ? ' aria-label="Deck empty"' : ''}>${mz ? '' : 'Deck empty'}</div>` + top;
  // the count lives in the zone's label (click it for the deck view), not on the cards
  const cnt = `<button type="button" class="labcnt" data-labdeck="${side}" title="See the whole deck">${sd.deck.length} in deck${nsp ? `<i>✶ ${nsp}</i>` : ''}</button>`;
  // on the mat: "Deck", and under it the count line in the same type (tap either for the deck view)
  if (mz){
    const sub = [sd.deck.length ? `<button type="button" class="labcnt" data-labdeck="${side}" title="See the whole deck">${sd.deck.length} in deck${nsp ? ` · ✶ ${nsp}` : ''}</button>` : '', sd.sil ? 'next reveal silenced' : ''].filter(Boolean).join(' · ');
    return `<div class="tz deckz"><span class="zl labzl" data-labdeck="${side}"><span class="labw">Deck</span>${sub ? `<span class="labsub">${sub}</span>` : ''}</span><div class="tzc">${top}</div></div>`;
  }
  return `<div class="tz deckz"><span class="zl labzl" data-labdeck="${side}">${names[side]} deck ${sd.deck.length ? cnt : ''}${sd.sil ? ' · next reveal silenced' : ''}</span><div class="tzc">${top}</div></div>`;
}
// the graveyard: a face-down pile, as at the table (defeated units flip face down onto it), lit like the rest, with a
// count; tap it for the list. The cards below stay in the pile (a little crooked), so a unit dying onto it lands on the
// one before instead of replacing it. The back is the shared placeholder card back (.oback, css/02-board-settings.css).
function labGcard(u, side, top, k){
  const rot = top ? 0 : (((u.uid * 37) % 9) - 4) * .8, dx = top ? 0 : (((u.uid * 53) % 7) - 3);
  const tag = top ? 'b' : 'span';
  return `<${tag} class="gcard${top ? '' : ' gunder'}"${top ? ` data-uid="${side}-${u.uid}"` : ` data-guid="${side}-${u.uid}"`}${top ? '' : ` style="position:absolute;left:${dx}px;top:${k * 1.5}px;transform:rotate(${rot}deg);z-index:${-1 - k}"`}><span class="labsh" aria-hidden="true">${labEdges(0)}<i></i></span><span class="oback" aria-hidden="true"></span><span class="lablt" aria-hidden="true"></span></${tag}>`;
}
function labGrave(sd, side, names){
  const g = sd.grave, last = g[g.length - 1], mz = labMatZones();
  let inner = mz ? '<div class="labempty labslot" aria-label="Defeated: empty"></div>' : '<div class="labempty labslot">Empty</div>';
  if (last){
    const under = g.slice(-4, -1).reverse().map((u, k) => labGcard(u, side, false, k)).join('');
    inner = `<div class="labempty labslot under" aria-hidden="true">${mz ? '' : 'Empty'}</div><div class="grave labgpile" data-labgrave="${side}" role="button" tabindex="0" title="See the graveyard" style="position:relative;isolation:isolate">${under}${labGcard(last, side, true, 0).replace(/<\/b>$/, (g.length > 1 ? `<span class="gn">${g.length}</span>` : '') + '</b>')}</div>`;
  }
  // on the mat the word is "Defeated" and the count is only the pile's own .gn
  return `<div class="tz grz"><span class="zl labzl" data-labgrave="${side}">${mz ? '<span class="labw">Defeated</span>' : `${names[side]} graveyard${g.length ? ' · ' + g.length : ''}`}</span><div class="tzc">${inner}</div></div>`;
}
// the deck view (and graveyard list): compact rows, top to bottom; tap a row for the full card
function labSheet(side, kind){
  const f = ui.battle && ui.battle.frames[ui.frame]; if (!f) return;
  const sd = f.snap[side], names = PP() ? [poss(0), poss(1)] : ['Your', 'AI'], rows = [];
  if (kind === 'deck'){
    sd.deck.forEach((u, i) => { for (const n of u.sp || []) rows.push({mir:n}); rows.push({u, tag:i === 0 ? 'Revealed' : u.rear ? 'Rearguard' : ''}); });
    for (const n of sd.tail || []) rows.push({mir:n});
  } else sd.grave.slice().reverse().forEach(u => rows.push({u, tag:''}));
  const chips = u => [u.gear, u.arm ? `Might ${u.arm}` : '', u.tr ? `Training ${u.tr}` : '', u.sh ? `Shield ${u.sh}` : ''].filter(Boolean).map(c => `<span>${esc(c)}</span>`).join('');
  const row = (r, i) => r.mir
    ? `<button type="button" class="lsrow mir" data-i="${i}"><span class="n">${i + 1}</span><span class="nm">✶ ${esc(r.mir)}</span></button>`
    : `<button type="button" class="lsrow" data-i="${i}"><span class="n">${i + 1}</span><span style="display:flex;flex-direction:column;gap:3px;min-width:0"><span style="display:flex;align-items:center;gap:8px"><span class="nm">${esc(r.u.name)}</span>${r.tag ? `<span class="tg">${r.tag}</span>` : ''}</span>${chips(r.u) ? `<span class="chips">${chips(r.u)}</span>` : ''}</span><span class="lv">LV ${r.u.lvl}</span></button>`;
  const el = document.createElement('div'); el.className = 'labsheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = `<div class="lsbox"><div class="lslist"><div class="lshd"><h2>${esc(names[side])} ${kind === 'deck' ? 'deck' : 'graveyard'}</h2><span>${kind === 'deck' ? 'top to bottom · tap a card to read it' : 'most recent first'}</span></div>${rows.length ? rows.map(row).join('') : '<p class="note">Empty.</p>'}</div><div class="lsart"><button type="button" class="lsclose" data-x="back">Back to the list</button><div class="lsimg"></div></div></div>`;
  const close = () => { el.remove(); removeEventListener('keydown', esc1, true); };
  const esc1 = e => { if (e.key === 'Escape'){ e.stopPropagation(); close(); } };
  addEventListener('keydown', esc1, true);
  el.addEventListener('click', e => {
    if (e.target === el) return close();
    if (e.target.closest('[data-x="back"]')){ el.querySelector('.lsbox').classList.remove('showart'); return; }
    const b = e.target.closest('.lsrow'); if (!b) return;
    el.querySelectorAll('.lsrow').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    const r = rows[+b.dataset.i], url = r.u ? labArt(r.u) : (typeof artURL === 'function' ? artURL(r.mir, 'b') : null);
    el.querySelector('.lsimg').innerHTML = url ? `<img src="${url}" alt="${esc(r.u ? r.u.name : r.mir)}">` : `<p class="note">${esc(r.u ? r.u.name : r.mir)}: no card art yet.</p>`;
    el.querySelector('.lsbox').classList.add('showart');
  });
  document.body.appendChild(el);
  const first = el.querySelector('.lsrow'); if (first && !compact()) first.click(); else if (first) first.focus();
}
addEventListener('click', e => {
  const d = e.target.closest('[data-labdeck]'), g = e.target.closest('[data-labgrave]');
  if (!d && !g) return;
  e.preventDefault(); e.stopPropagation();
  labSheet(+(d || g).dataset[d ? 'labdeck' : 'labgrave'], d ? 'deck' : 'grave');
}, true);

// the cube layer draws inside the tipped table, so cubes lie on the slanted cards
window.__cubeFrame = () => LAB.view === 'table' ? document.querySelector('#view-play .stage .line.table') : null;
// the table's camera, matching its CSS (perspective, tilt, transform origin), so the cube scene tips the same way
window.__cubeTilt = () => labMatZones() ? {P:matDesk() ? 2100 : 1000, a:14 * Math.PI / 180, fx:.5, fy:1} : ({P:compact() ? 900 : 1500, a:(compact() ? LAB.tilt * .92 : LAB.tilt) * Math.PI / 180, fx:.5, fy:compact() ? .55 : .6});   // (the phone battle on the mat: the mat's own camera, css/11-rug.css)

// switches
const LAB_OPTS = [
  ['view', 'Table', [['flat', 'Flat'], ['lean', 'Cards lean'], ['table', 'Table tipped']]],
  ['size', 'Card size', [['crop', 'Cropped'], ['full', 'Full'], ['auto', 'Cropped on phone']]],
  ['splay', 'Splay', [['up', 'Up'], ['now', 'Up-left (now)'], ['diag', 'Stepped right'], ['fanL', 'Fan left'], ['fanR', 'Fan right']]],
];
// (a step of renderPlay)
function labAfterDraw(){ const inb = !!(ui && ui.battle); document.body.classList.toggle('lab-inbattle', inb); if (!inb && LAB.open) labShow(false); juiceSilence(); juiceShieldRim(); }
// open or close the Board settings panel (the game menu's "Board settings" item opens it; its Done button closes it)
function labShow(open){ LAB.open = !!open; labPanel(); if (open){ const b = document.querySelector('.labbar .labtog'); if (b) b.focus(); } }
function labApply(redraw = true){
  const b = document.body, cl = b.classList;
  for (const c of [...cl]) if (c.startsWith('lab-') && c !== 'lab-inbattle') cl.remove(c);
  cl.add('lab-v-' + LAB.view, 'lab-sp-' + LAB.splay, labCrop() ? 'lab-crop' : 'lab-full');
  if (LAB.stock) cl.add('lab-stock');
  if (LAB.light) cl.add('lab-light');
  b.style.setProperty('--tilt', LAB.tilt + 'deg');
  b.style.setProperty('--bcw', Math.round((compact() ? 98 : 150) * LAB.zoom / 100) + 'px');   // zoom: card width (height, tucks and gaps follow)
  b.style.setProperty('--ldepth', Math.round(LAB.tilt * (compact() ? 7 : 11)) + 'px');   // how far back the far row sits
  if (redraw && ui.battle){ ui.battle.rowKey = null; renderPlay(); }
  labPanel();
}
function labPanel(){
  let p = document.querySelector('.labbar');
  if (!p){
    p = document.createElement('div'); p.className = 'labbar'; document.body.appendChild(p);
    p.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.o){ LAB[b.dataset.o] = b.dataset.v; labSave(); labApply(); }
      else if (b.dataset.t === 'tog'){ labShow(false); }
      else if (b.dataset.t === 'reset'){ LAB = {...LAB_DEF, open:true}; labSave(); labApply(); }
    });
    p.addEventListener('change', e => { const i = e.target; if (i.dataset.z){ labSave(); labApply(); return; } if (i.dataset.c){ LAB[i.dataset.c] = i.checked; labSave(); labApply(); } });
    p.addEventListener('input', e => { const i = e.target; if (i.dataset.z){ LAB.zoom = +i.value; p.querySelector('.zoomv').textContent = LAB.zoom + '%'; document.body.style.setProperty('--bcw', Math.round((compact() ? 98 : 150) * LAB.zoom / 100) + 'px'); return; } if (i.dataset.r){ LAB.tilt = +i.value; labSave(); document.body.style.setProperty('--tilt', LAB.tilt + 'deg'); document.body.style.setProperty('--ldepth', Math.round(LAB.tilt * (compact() ? 7 : 11)) + 'px'); p.querySelector('.tiltv').textContent = LAB.tilt + '°'; try{ window.OasisCubes && OasisCubes.afterRender(); }catch(e){} } });
  }
  p.classList.toggle('shut', !LAB.open);
  const seg = ([k, lab, vals]) => `<fieldset><legend>${lab}</legend><div class="seg">${vals.map(([v, t]) => `<button type="button" data-o="${k}" data-v="${v}" aria-pressed="${LAB[k] === v}">${t}</button>`).join('')}</div></fieldset>`;
  p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Board settings');
  p.innerHTML = `<div class="labhd"><b>Board settings</b><small class="labbuild" title="Game version (artifact publish number)">${OASIS_BUILD}</small><button type="button" class="labtog" data-t="tog">Done</button></div>
  <div class="labin">${seg(LAB_OPTS[0])}
  <fieldset><legend>Zoom <span class="zoomv">${LAB.zoom}%</span></legend><input type="range" min="60" max="150" step="5" value="${LAB.zoom}" data-z="zoom" aria-label="Zoom"></fieldset>
  <fieldset${LAB.view === 'flat' ? ' disabled style="opacity:.45"' : ''}><legend>Tilt <span class="tiltv">${LAB.tilt}°</span></legend><input type="range" min="8" max="40" step="1" value="${LAB.tilt}" data-r="tilt" aria-label="Tilt angle"></fieldset>
  ${seg(LAB_OPTS[1])}${seg(LAB_OPTS[2])}
  <fieldset><legend>Impact</legend><label class="chk"><input type="checkbox" data-c="freeze" ${LAB.freeze ? 'checked' : ''}> Brief freeze</label><label class="chk"><input type="checkbox" data-c="dust" ${LAB.dust ? 'checked' : ''}> Dust puff</label><label class="chk"><input type="checkbox" data-c="squash" ${LAB.squash ? 'checked' : ''}> Squash</label><label class="chk"><input type="checkbox" data-c="jolt" ${LAB.jolt ? 'checked' : ''}> Knock-back jolt</label></fieldset>
  <fieldset><legend>Redraws</legend><label class="chk"><input type="checkbox" data-c="morph" ${LAB.morph !== false ? 'checked' : ''}> Update in place</label></fieldset>
  <fieldset><legend>Depth</legend><label class="chk"><input type="checkbox" data-c="stock" ${LAB.stock ? 'checked' : ''}> Card stock</label><label class="chk"><input type="checkbox" data-c="light" ${LAB.light ? 'checked' : ''}> Light</label></fieldset>
  <div class="rowb"><button type="button" class="labbtn" data-t="reset">Reset switches</button></div></div>`;
}
addEventListener('keydown', e => { if (e.key === 'Escape' && LAB.open){ labShow(false); const m = document.querySelector('#gtop [data-gmenu]'); if (m) m.focus(); } });
let labWasCompact = compact();
addEventListener('resize', () => { if (compact() !== labWasCompact){ labWasCompact = compact(); if (LAB.size === 'auto') labApply(); } });


// a newly revealed unit: the cards attached to it (copies, gear, tokens) slide out from behind it into their splay
const labRevealed = f => f ? f.snap.map(sd => sd.deck[0] ? sd.deck[0].uid : null) : [null, null];
// only: just these of its peeking cards (a token just gained); done: called once the last has landed
// where a peeking card sits when it is tucked all the way behind its card (as {translate, rotate} keyframe values)
function labTuckedAt(el, t, i){
  const tky = parseFloat(getComputedStyle(el).getPropertyValue('--tky')) || 26, fan = LAB.splay === 'fanL' ? 1 : LAB.splay === 'fanR' ? -1 : 0;
  const j = parseInt(t.style.getPropertyValue('--j')) || i;
  return {translate:`${-t.offsetLeft}px ${-t.offsetTop + (fan ? tky * .55 * (j + 1) : 0)}px`, rotate:`${fan * 7 * (j + 1)}deg`};
}
function labSplayIn(el, delay, only, done){
  if (!el || reduceMotion()){ if (done) done(); return; }
  const tks = only || [...el.querySelectorAll(':scope > .tk')]; if (!tks.length){ if (done) done(); return; }
  tks.forEach((t, i) => {
    const a = t.animate([labTuckedAt(el, t, i), {translate:'0px 0px', rotate:'0deg'}],
      {duration:480, delay:delay + 80 * i, easing:'cubic-bezier(.2,.8,.3,1)', fill:'backwards'});
    if (done && i === tks.length - 1){ a.onfinish = a.oncancel = done; }
  });
}
// the reverse, for a unit about to leave its spot (defeated, saved back into its deck, buried under a new top card):
// its copies, gear and tokens slide back in behind it, the last one first, and stay there. Returns when they're all in
// (delay itself when there's nothing to tuck), so the unit's own move can start then.
const LAB_TUCK = 300;
function labSplayOut(el, delay){
  if (!el || reduceMotion()) return delay;
  const tks = [...el.querySelectorAll(':scope > .tk')]; if (!tks.length) return delay;
  const n = tks.length;
  tks.forEach((t, i) => t.animate([{translate:'0px 0px', rotate:'0deg'}, labTuckedAt(el, t, i)],
    {duration:LAB_TUCK, delay:delay + 60 * (n - 1 - i), easing:'cubic-bezier(.5,0,.6,1)', fill:'forwards'}));
  return delay + LAB_TUCK + 60 * (n - 1);
}
function labSplayRevealed(prev, delay){
  if (!ui.battle) return;
  const now = labRevealed(ui.battle.frames[ui.frame]);
  now.forEach((uid, side) => {
    if (uid == null || uid === prev[side]) return;
    const el = document.querySelector(`#view-play .deckz .card[data-uid="${side}-${uid}"]`);
    labSplayIn(el, delay);
    // its health bar fades in once the card that was on top has charged off it
    const hp = el && el.querySelector(':scope > .hprow');
    if (hp && !reduceMotion()) hp.animate([{opacity:0}, {opacity:1}], {duration:320, delay:delay + 460, easing:'ease-out', fill:'backwards'});
  });
}
// (steps of goFrame)
function labBeforeStep(){ return ui.battle ? labRevealed(ui.battle.frames[ui.frame]) : [null, null]; }
function labAfterStep(before, glide){
  if (glide) labSplayRevealed(before, 220);   // starts as the card on top lifts off it
  labPrep();
}


/* ===== Update in place: a redraw changes only what differs instead of rebuilding the whole Play view =====
   The new markup is compared with what's on screen. Elements are matched by their key (id, data-uid, data-ck) or, when
   they have none, by position and tag; a matched element is kept and gets the new attributes and children, so a card
   that didn't change stays exactly as it is (its picture, hover, running animation, layer on the tilted table).
   Anything that isn't in the new markup is removed, as before; the cube layer is left alone. */
function morphOn(){ return !(typeof LAB !== 'undefined' && LAB.morph === false); }   // a plain function: a redraw before this script has run just sees it missing
const mKey = n => n.nodeType === 1 ? (n.id || n.getAttribute('data-uid') || n.getAttribute('data-ck') || '') : '';
const mKeep = n => n.nodeType === 1 && (n.classList.contains('cubegl') || n.hasAttribute('data-keep'));
function mAttrs(a, b){
  for (const at of [...a.attributes]) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
  for (const at of b.attributes) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
  const tag = a.nodeName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'){
    if (document.activeElement !== a){ if ('value' in b && a.value !== b.value) a.value = b.value; }
    if ('checked' in b && a.checked !== b.checked) a.checked = b.checked;
  }
  if (tag === 'DETAILS' && a.open !== b.open) a.open = b.open;
}
function mNode(a, b){
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName){ a.replaceWith(b); return b; }
  if (a.nodeType !== 1){ if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return a; }
  mAttrs(a, b); mKids(a, b); return a;
}
function mKids(a, b){
  const olds = [...a.childNodes], keyed = new Map(), used = new Set();
  for (const o of olds){ const k = mKey(o); if (k) keyed.set(o.nodeName + '#' + k, o); }
  const out = []; let p = 0;
  for (const n of [...b.childNodes]){
    let m = null; const k = mKey(n);
    if (k){ m = keyed.get(n.nodeName + '#' + k) || null; if (m && used.has(m)) m = null; }
    else {
      while (p < olds.length && (used.has(olds[p]) || mKey(olds[p]) || mKeep(olds[p]))) p++;
      if (p < olds.length && olds[p].nodeName === n.nodeName) m = olds[p++];
    }
    if (m){ used.add(m); out.push(mNode(m, n)); } else out.push(n);
  }
  for (const o of olds) if (!used.has(o) && !mKeep(o) && o.parentNode === a) a.removeChild(o);
  let ref = a.firstChild;
  for (const node of out){
    while (ref && mKeep(ref) && ref !== node) ref = ref.nextSibling;
    if (node === ref){ ref = ref.nextSibling; continue; }
    a.insertBefore(node, ref);
  }
}
function morphInto(el, html){ const t = document.createElement('template'); t.innerHTML = html; mKids(el, t.content); }
/* ---- the clash: both charging units rush at each other, collide at the middle, and spring back (like Hearthstone).
   Impact options (lab switches): a brief freeze, a dust puff, a squash, a knock-back jolt. Returns when the hit lands. */
function labClash(root){
  const a = root.querySelector('.charge .card[data-side="1"]'), b = root.querySelector('.charge .card[data-side="0"]');
  if (!a || !b || !a.animate){ for (const [el, s] of [[a, 1], [b, 0]]) if (el) el.classList.add('lunge' + s); return 190; }
  const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
  // they meet where they really touch: the top of whatever is tucked behind the near card (its copies and tokens peek
  // up toward the far one), not its face
  const edge = (el, r, up) => [...el.querySelectorAll(':scope > .tk')].reduce((m, t) => { const q = t.getBoundingClientRect(); return up ? Math.min(m, q.top) : Math.max(m, q.bottom); }, up ? r.top : r.bottom);
  const gap = Math.max(0, edge(b, rb, true) - edge(a, ra, false)), meet = gap / 2 + 2;   // each travels half the gap, overlapping a touch
  const pw = LAB.power ?? 1, wind = 130, rush = 110, hold = LAB.freeze ? (LAB.stopMs ?? 85) : 0, back = 300, T = wind + rush + hold + back, hitT = wind + rush;
  const o = x => +(x / T).toFixed(4);
  for (const [el, r, dir] of [[a, ra, 1], [b, rb, -1]]){
    const k = el.offsetHeight / Math.max(1, r.height);   // screen px to the card's own (tilted) px
    const d = meet * k * dir, pull = -7 * pw * k * dir, jolt = LAB.jolt ? -10 * pw * k * dir : 0;
    const sq = LAB.squash ? ` scale(${1 + .05 * pw},${1 - .1 * pw})` : ' scale(1.03)';
    el.style.transformOrigin = dir > 0 ? '50% 100%' : '50% 0%';
    const prevZ = el.style.zIndex; el.style.zIndex = 6;
    const tz = el.closest('.tz'); if (tz){ tz.style.position = 'relative'; tz.style.zIndex = 15; }
    const an = el.animate([
      {transform:'none', offset:0},
      {transform:`translateY(${pull}px) scale(1.04)`, offset:o(wind), easing:'cubic-bezier(.6,0,.9,.4)'},
      {transform:`translateY(${d}px)${sq}`, offset:o(hitT)},
      {transform:`translateY(${d}px)${sq}`, offset:o(hitT + hold), easing:'cubic-bezier(.2,.7,.3,1)'},
      ...(jolt ? [{transform:`translateY(${jolt}px) scale(1)`, offset:o(hitT + hold + back * .45), easing:'cubic-bezier(.3,.6,.4,1)'}] : []),
      {transform:'none', offset:1}
    ], {duration:T});
    an.onfinish = an.oncancel = () => { el.style.transformOrigin = ''; el.style.zIndex = prevZ; if (tz){ tz.style.zIndex = ''; tz.style.position = ''; } };
  }
  try{ window.OasisCubes && OasisCubes.afterRender(); }catch(e){}   // the cube layer keeps drawing while the cards move
  if (LAB.dust) setTimeout(() => labDust((ra.left + ra.right + rb.left + rb.right) / 4, (edge(a, ra, false) + edge(b, rb, true)) / 2, (ra.width + rb.width) / 2), hitT);
  return hitT;
}
// a puff of sand where the cards meet: grains thrown out mostly sideways along the table, and a soft cloud
function labDust(x, y, w){
  if (reduceMotion()) return;
  const g = document.createElement('div'); g.setAttribute('aria-hidden', 'true');
  g.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;z-index:11;pointer-events:none`;
  const cloud = document.createElement('span');
  cloud.style.cssText = `position:absolute;left:${-w * .35}px;top:-14px;width:${w * .7}px;height:28px;border-radius:50%;background:radial-gradient(closest-side,rgba(214,192,148,.75),rgba(214,192,148,0))`;
  g.appendChild(cloud);
  cloud.animate([{transform:'scale(.3)', opacity:.9}, {transform:'scale(1.25,1)', opacity:0}], {duration:620, easing:'cubic-bezier(.2,.7,.3,1)', fill:'forwards'});
  for (let i = 0; i < 16; i++){
    const p = document.createElement('span'), side = i % 2 ? 1 : -1, ang = (Math.random() * .9 - .45), dist = w * (.25 + Math.random() * .45), sz = 3 + Math.random() * 5;
    const tx = Math.cos(ang) * dist * side, ty = Math.sin(ang) * dist * .45 - 6;
    p.style.cssText = `position:absolute;left:${-sz / 2}px;top:${-sz / 2}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${['#cdb68a', '#b99d6c', '#e2d2ac'][i % 3]}`;
    g.appendChild(p);
    p.animate([{transform:'translate(0,0) scale(1)', opacity:.95}, {transform:`translate(${tx}px,${ty}px) scale(.6)`, opacity:0}], {duration:420 + Math.random() * 260, easing:'cubic-bezier(.15,.7,.3,1)', fill:'forwards'});
  }
  document.body.appendChild(g);
  setTimeout(() => g.remove(), 800);
}

/* ---- impact juice (from the juice lab, Nov 25; on by default, Brian's pick: everything but the knock-back jolt). They move cards and the table with the CSS
   translate / scale properties, which add on top of the clash's transform instead of replacing it. */
// the cube layer redraws to follow cards and the table while they move
function juiceFollow(ms){
  if (!window.OasisCubes) return;
  const t0 = performance.now(), f = now => { try{ OasisCubes.afterRender(); }catch(e){} if (now - t0 < ms) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
// an ability firing outside a fight: the card lifts (wind-up), presses down like a stamp with a gold ripple and a
// puff of sand, holds for a beat (hit-stop), and only then do its hits land. Returns when the hits land (ms).
function juiceAbilityWind(root, f, hits){
  if (!(LAB.abWind || LAB.abStamp) || reduceMotion()) return 0;
  const ids = [...new Set(f.lines.filter(l => l.ab && l.ab.u && !l.ab.g).map(l => `${l.ab.u}`))];
  const els = ids.map(juiceCard).filter(Boolean); if (!els.length) return 0;
  const pw = LAB.power ?? 1, wind = LAB.abWind ? 190 : 0, press = LAB.abStamp ? 85 : 0;
  const stop = LAB.abStop ? Math.round((LAB.stopMs ?? 85) * .8) : 0, settle = 260, T = wind + press + stop + settle;
  const o = x => +(x / T).toFixed(4);
  const lift = LAB.abWind ? {translate:`0 ${-7 * pw}px`, scale:`${1 + .07 * pw}`} : {translate:'0 0', scale:'1'};
  for (const el of els){
    el.style.zIndex = 6;
    const kf = [{translate:'0 0', scale:'1', offset:0}];
    if (wind) kf.push({...lift, offset:o(wind), easing:'cubic-bezier(.7,0,1,.6)'});
    if (press){ kf.push({translate:'0 1px', scale:`${1 - .035 * pw}`, offset:o(wind + press)}); if (stop) kf.push({translate:'0 1px', scale:`${1 - .035 * pw}`, offset:o(wind + press + stop), easing:'cubic-bezier(.2,.8,.3,1)'}); kf.push({translate:'0 0', scale:`${1 + .012 * pw}`, offset:o(wind + press + stop + settle * .45)}); }
    else if (stop) kf.push({...lift, offset:o(wind + stop), easing:'cubic-bezier(.2,.8,.3,1)'});
    kf.push({translate:'0 0', scale:'1', offset:1});
    const a = el.animate(kf, {duration:T, easing:'ease-out'}); a.onfinish = a.oncancel = () => { el.style.zIndex = ''; };
    if (press) setTimeout(() => { const r = el.getBoundingClientRect(); juiceRipple(r); if (LAB.dust) labDust((r.left + r.right) / 2, r.bottom - 4, r.width * .9); }, wind + press - 10);
  }
  juiceFollow(T + 50);
  return hits.length ? wind + press + stop : wind + press;
}
// a gold ring spreading out over the table from a card that just stamped down
function juiceRipple(r){
  const g = document.createElement('span'); g.setAttribute('aria-hidden', 'true');
  const w = r.width * .7;
  g.style.cssText = `position:fixed;left:${(r.left + r.right) / 2 - w / 2}px;top:${(r.top + r.bottom) / 2 - w * .35}px;width:${w}px;height:${w * .7}px;border-radius:50%;border:3px solid rgba(232,184,80,.95);box-shadow:0 0 12px rgba(232,184,80,.6);z-index:11;pointer-events:none`;
  document.body.appendChild(g);
  g.animate([{transform:'scale(.5)', opacity:.95}, {transform:`scale(${2.6 * (LAB.power ?? 1)})`, opacity:0}], {duration:560, easing:'cubic-bezier(.1,.6,.3,1)', fill:'forwards'}).onfinish = () => g.remove();
}
// the moment hits land: the table thumps on a big hit, hit cards are knocked back toward their own side
function juiceImpact(root, hits, fought){
  if (reduceMotion() || !hits.length) return;
  const pw = LAB.power ?? 1, real = hits.filter(h => !h.save && h.d > 0), maxD = Math.max(0, ...real.map(h => h.d));
  const big = maxD >= (LAB.thumpMin ?? 4);
  if (LAB.thump && big){
    const t = root.querySelector('.line.table'), px = (LAB.thumpPx ?? 4) * pw;
    if (t) t.animate([{translate:'0 0'}, {translate:`0 ${px}px`, offset:.22}, {translate:`0 ${-px * .28}px`, offset:.6}, {translate:'0 0'}], {duration:230, easing:'ease-out'});
  }
  for (const h of real){
    const el = juiceCard(h.id); if (!el) continue;
    if (LAB.recoil){
      const dir = h.id.startsWith('0-') ? 1 : -1, px = (LAB.recoilPx ?? 8) * pw * (h.d >= (LAB.thumpMin ?? 4) ? 1.3 : .8) * dir;
      el.animate([{translate:'0 0'}, {translate:`0 ${px}px`, offset:.18}, {translate:`0 ${-px * .18}px`, offset:.55}, {translate:'0 0'}], {duration:330, easing:'ease-out', composite:'add'});
    }
  }
  juiceFollow(420);
}

/* ---- keyword juice (from the juice lab, Nov 25, on by default; Brian's decisions are in the "Oasis design notes" doc). One signature
   per keyword, the same for both sides (in each side's ink), at double speed with Fast battles. */
const juiceInk = side => side === 0 ? '#0e2236' : '#3a100a';   // a side's color pushed almost to black
// a token sliding in from behind a card: Might makes the card flex (it puffs up and settles); a Shield gets a
// protective touch (Board setting shStyle: a steel glint round the edge, a brace, or a ward ring); others a small press
function juiceTokenLand(el, k, n = 1, at = 380){   // at: ms after the token starts sliding
  if (!LAB.tokPop || reduceMotion() || !el) return;
  const pw = (LAB.power ?? 1) * Math.min(1.6, 1 + .12 * (n - 1));   // several tokens of a kind at once: a bigger touch
  setTimeout(() => {
    if (!el.isConnected) return;
    if (k === 'arm') el.animate([{scale:'1'}, {scale:`${1 + .05 * pw} ${1 + .07 * pw}`, offset:.35}, {scale:`${1 - .012 * pw}`, offset:.7}, {scale:'1'}], {duration:juiceSp(360), easing:'cubic-bezier(.3,.7,.4,1)', composite:'add'});
    else if (k === 'sh') juiceShield(el, LAB.shStyle);
    else el.animate([{scale:'1'}, {scale:`${1 + .03 * pw} ${1 - .05 * pw}`, offset:.25}, {scale:`${1 - .01 * pw} ${1 + .02 * pw}`, offset:.6}, {scale:'1'}], {duration:juiceSp(260), easing:'ease-out', composite:'add'});
    juiceFollow(400);
  }, juiceSp(at));
}
// the Shield's protective touch (also used when a Shield blocks a hit). Drawn inside the card, so it sits exactly on
// it and tilts with the table (Brian, Nov 25: drawn on the page, they landed beside the tilted cards)
function juiceShield(el, style){
  const pw = LAB.power ?? 1;
  if (style === 'brace'){
    el.animate([{scale:'1', filter:'none'}, {scale:`${1 + .01 * pw} ${1 - .04 * pw}`, filter:'drop-shadow(0 6px 4px rgba(20,10,0,.55))', offset:.3}, {scale:'1', filter:'none'}], {duration:juiceSp(320), easing:'cubic-bezier(.2,.8,.3,1)', composite:'add'});
    if (LAB.dust){ const r = el.getBoundingClientRect(); labDust((r.left + r.right) / 2, r.bottom - 4, r.width); }
    return;
  }
  const g = document.createElement('span'); g.setAttribute('aria-hidden', 'true'); g.setAttribute('data-keep', '');
  if (style === 'ring'){
    g.style.cssText = 'position:absolute;inset:-7px;border-radius:12px;border:3px solid rgba(150,190,220,.95);box-shadow:0 0 10px rgba(150,190,220,.6);z-index:10;pointer-events:none';
    el.appendChild(g);
    g.animate([{transform:'scale(1.3)', opacity:0}, {transform:'scale(1)', opacity:1, offset:.45}, {transform:'scale(1)', opacity:0}], {duration:juiceSp(620), easing:'cubic-bezier(.2,.8,.3,1)', fill:'forwards'}).onfinish = () => g.remove();
    return;
  }
  // glint: a bright arc of light runs once round the card's rim, like sun on a metal edge
  g.style.cssText = 'position:absolute;inset:-2px;border-radius:9px;padding:3px;z-index:10;pointer-events:none;'
    + 'background:conic-gradient(from var(--ga,0deg),transparent 0deg,rgba(255,255,255,0) 300deg,rgba(235,242,250,.95) 340deg,rgba(255,255,255,0) 360deg);'
    + '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)';
  el.appendChild(g);
  const t0 = performance.now(), T = juiceSp(520);
  const f = now => { const k = Math.min(1, (now - t0) / T); g.style.setProperty('--ga', (k * 360) + 'deg'); g.style.opacity = k < .85 ? 1 : (1 - k) / .15; if (k < 1 && g.isConnected) requestAnimationFrame(f); else g.remove(); };
  requestAnimationFrame(f);
}
// a unit holding Shields keeps a steel rim round its card for as long as it has them (Brian, Nov 25: the Shield needs a
// lasting look); it comes on with a glint and fades off when the last Shield is gone. Checked after every redraw.
function juiceShieldRim(){
  const f = LAB.shRim && typeof ui === 'object' && ui && ui.battle && ui.battle.frames[ui.frame];
  const want = new Set();
  if (f) f.snap.forEach((sd, s) => { for (const u of [sd.charge, ...sd.deck.slice(0, 1)]) if (u && u.sh > 0) want.add(`${s}-${u.uid}`); });
  for (const w of document.querySelectorAll('#view-play .juicerim')){
    const card = w.parentElement;
    if (card && want.has(card.dataset.uid) && !w.dataset.out){ want.delete(card.dataset.uid); continue; }
    if (!w.dataset.out){ w.dataset.out = '1'; w.animate([{opacity:1}, {opacity:0}], {duration:reduceMotion() ? 0 : juiceSp(400), fill:'forwards'}).onfinish = () => w.remove(); }
  }
  for (const id of want){
    const card = juiceCard(id); if (!card) continue;
    const w = document.createElement('span'); w.className = 'juicerim'; w.setAttribute('aria-hidden', 'true'); w.setAttribute('data-keep', '');
    // brushed steel: a light-to-dark metal gradient in a 3 px band round the card, with a faint cool glow outside
    w.style.cssText = 'position:absolute;inset:-3px;border-radius:10px;padding:3px;z-index:9;pointer-events:none;'
      + 'background:linear-gradient(135deg,#f4f7fa 0%,#9aa6b2 22%,#e6ebf0 45%,#7d8995 70%,#dfe5eb 100%);'
      + 'box-shadow:0 0 6px rgba(170,200,225,.55);'
      + '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)';
    card.appendChild(w);
    if (!reduceMotion()) w.animate([{opacity:0}, {opacity:1}], {duration:juiceSp(300), delay:juiceSp(380), fill:'backwards'});
  }
}

// Lethal: no number. A seal in the attacker's ink is stamped on each card it kills, the sound drops out for a silent
// beat (about half a second), then one low thud as the ink soaks through; the card then flips as usual.
const juiceLethalT = () => juiceSp(780);
function juiceLethal(hits){
  const pw = LAB.power ?? 1;
  for (const h of hits.filter(x => !x.save && (x.ko || x.d > 0))){   // (the Lethal step fills the card with damage; it dies in the next step)
    const el = juiceCard(h.id); if (!el) continue;
    const side = h.id.startsWith('0-') ? 1 : 0, ink = juiceInk(side);   // the killer is on the other side
    for (const b of el.querySelectorAll('.float, .hpn')) b.style.visibility = 'hidden';   // no number
    const s = document.createElement('span'); s.className = 'juiceseal'; s.setAttribute('aria-hidden', 'true'); s.setAttribute('data-keep', '');
    const w = Math.min(el.offsetWidth, el.offsetHeight) * .62;
    s.style.cssText = `position:absolute;left:50%;top:46%;width:${w}px;height:${w}px;margin:${-w / 2}px 0 0 ${-w / 2}px;z-index:9;pointer-events:none;mix-blend-mode:multiply`;
    s.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><filter id="jsr${h.id}"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter></defs><g filter="url(#jsr${h.id})" fill="none" stroke="${ink}"><circle cx="50" cy="50" r="40" stroke-width="7"/><circle cx="50" cy="50" r="31" stroke-width="2.5"/><path d="M33 33 L67 67 M67 33 L33 67" stroke-width="9" stroke-linecap="round"/></g></svg>`;
    el.appendChild(s);
    s.animate([{transform:`scale(${1.6 * pw}) rotate(-12deg)`, opacity:0}, {transform:'scale(.94) rotate(-4deg)', opacity:1, offset:.6}, {transform:'scale(1) rotate(-4deg)', opacity:.95}], {duration:juiceSp(200), easing:'cubic-bezier(.7,0,1,.6)', fill:'forwards'});
    el.animate([{scale:'1'}, {scale:`${1 - .04 * pw}`, offset:.5}, {scale:'1'}], {duration:juiceSp(180), delay:juiceSp(110), composite:'add'});
    // the ink soaks through: the card darkens
    el.animate([{filter:'brightness(1)'}, {filter:'brightness(1)', offset:.45}, {filter:'brightness(.55) saturate(.7)'}], {duration:juiceSp(760), fill:'forwards'});
  }
  setTimeout(() => { try{ sfx.ko(); }catch(e){} }, juiceSp(620));   // the one low thud after the silence
}
// Overrun: the card the hit punched through is nudged aside and springs back into its spot; the card it carries on
// into thumps. A blocking Shield: the card stays still, the Shield token jolts and glints (a clang, no cubes).
function juiceKeywords(root, next, prev, hits){
  if (reduceMotion()) return;
  const pw = LAB.power ?? 1;
  if (LAB.kwOverrun && next.lines.some(l => /\(overrun\)/.test(l.t))){
    for (const h of hits){
      const side = +h.id.split('-')[0];
      // the card in front of the one hit by the spill: the defender's charging unit (alive or just defeated)
      const front = root.querySelector(`.charge .card[data-side="${side}"]`) || document.querySelector(`.deathfly[data-fly^="${side}-"]`);
      if (front && front.dataset.uid !== h.id) front.animate([{translate:'0 0'}, {translate:`${(side === 0 ? -1 : 1) * 9 * pw}px 0`, offset:.25}, {translate:`${(side === 0 ? 1 : -1) * 2 * pw}px 0`, offset:.65}, {translate:'0 0'}], {duration:juiceSp(300), easing:'cubic-bezier(.2,.8,.3,1)', composite:'add'});
      const t = root.querySelector('.line.table'), px = (LAB.thumpPx ?? 4) * pw;
      if (t && !(LAB.thump && h.d >= (LAB.thumpMin ?? 4))) t.animate([{translate:'0 0'}, {translate:`0 ${px}px`, offset:.22}, {translate:`0 ${-px * .28}px`, offset:.6}, {translate:'0 0'}], {duration:juiceSp(230), easing:'ease-out'});
    }
    juiceFollow(400);
  }
  if (LAB.shBlock) for (const l of next.lines){
    if (!(l.to && l.from && !l.tok && !l.sil && !l.cut && l.amt === 0)) continue;   // a Shield stops this hit
    const card = juiceCard(`${l.to}`) || root.querySelector(`.card[data-uid$="-${l.to}"]:not(.mini)`); if (!card) continue;
    const tok = card.querySelector(':scope > .pk[data-k="sh"]');
    if (tok) tok.animate([{translate:'0 0'}, {translate:`0 ${-5 * pw}px`, offset:.2}, {translate:`0 ${1.5 * pw}px`, offset:.55}, {translate:'0 0'}], {duration:juiceSp(260), easing:'ease-out', composite:'add'});
    juiceShield(card, 'glint');
    try{ sfx.tick(); }catch(e){}
  }
}
/* ---- Interceptor's Silence (reworked Nov 25: "Reveal: Silence enemy Reveal and Charge abilities that happen at the
   same time"; built in the juice lab). The engine logs one line per enemy unit the Silence reaches (sil) and one per
   ability it stopped (cut); the battle ink draws both. Here: a liquid black ink wash floods each card the Silence's
   stroke reaches, whether or not it has a Reveal or Charge ability, and rinses out as the next step starts. */
const juiceSp = ms => ms / (typeof autoFast === 'function' && autoFast() ? 2 : 1);
const juiceCard = id => document.querySelector(`#view-play .card[data-uid="${id}"]:not(.mini)`);
let juiceWashAt = -1;   // the step whose wash is on the board
// a step with nothing to animate but the Silence still plays out (an Interceptor revealed with nothing to hit)
const juiceWants = f => !!(!reduceMotion() && f.lines.some(l => /silences .*Reveal and Charge abilities/.test(l.t)));
function juiceSilenceStep(root, next, prev){
  if (reduceMotion()) return;
  const reach = next.lines.filter(l => l.sil && l.to);
  if (!reach.length) return;
  reach.forEach(l => {
    const dst = juiceCard(`${l.to}`), src = juiceCard(`${l.from}`); if (!dst) return;
    const from = src && src.getBoundingClientRect().top < dst.getBoundingClientRect().top ? 'top' : 'bottom';
    setTimeout(() => { if (dst.isConnected) juiceWashCard(dst, from); }, juiceSp(430));   // as the ink's stroke arrives
  });
  juiceWashAt = ui.frame + 1;
}
// the wash on a card: wet black ink floods in from one edge with a ragged, darker wet edge, then settles
function juiceWashCard(card, from){
  for (const w of card.querySelectorAll(':scope > .juicewash')) w.remove();
  const id = 'jc' + Math.random().toString(36).slice(2, 7), cy = from === 'top' ? -10 : 150;
  const w = document.createElement('span'); w.className = 'juicewash'; w.setAttribute('aria-hidden', 'true'); w.setAttribute('data-keep', '');
  w.style.cssText = 'position:absolute;inset:-2px;z-index:8;pointer-events:none;mix-blend-mode:multiply;border-radius:8px;overflow:hidden';
  w.innerHTML = `<svg viewBox="0 0 100 140" preserveAspectRatio="none" width="100%" height="100%"><defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="${Math.floor(Math.random() * 90)}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="18"/></filter></defs>`
    + `<g filter="url(#${id})"><circle class="we" cx="50" cy="${cy}" r="0" fill="rgba(14,16,22,.72)"/><circle class="wi" cx="50" cy="${cy}" r="0" fill="rgba(34,38,46,.5)"/></g></svg>`;
  card.appendChild(w);
  const we = w.querySelector('.we'), wi = w.querySelector('.wi'), T = juiceSp(620), t0 = performance.now();
  const f = now => { const k = Math.max(0, Math.min(1, (now - t0) / T)), e = 1 - Math.pow(1 - k, 2.4);   // (a frame's time can come just before t0)
    we.setAttribute('r', (e * 175).toFixed(1)); wi.setAttribute('r', Math.max(0, e * 175 - 7).toFixed(1));
    if (k < 1 && w.isConnected) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
// the next step starts: the ink rinses out (it thins, runs down a little, breaks up and fades); Back or a jump clears it
function juiceRinse(instant){
  for (const w of document.querySelectorAll('#view-play .juicewash:not([data-out])')){
    w.dataset.out = '1';
    if (instant || reduceMotion()){ w.remove(); continue; }
    const disp = w.querySelector('feDisplacementMap'), T = juiceSp(650), t0 = performance.now();
    w.animate([{opacity:1, transform:'translateY(0)'}, {opacity:.7, transform:'translateY(2%)', offset:.4}, {opacity:0, transform:'translateY(7%)'}], {duration:T, easing:'ease-in', fill:'forwards'}).onfinish = () => w.remove();
    const f = now => { const k = Math.min(1, (now - t0) / T); if (disp) disp.setAttribute('scale', (18 + k * 40).toFixed(1)); if (k < 1 && w.isConnected) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  juiceWashAt = -1;
}
function juiceSilence(){   // after a redraw: a wash left over from a step that is no longer on the board goes at once
  if (juiceWashAt >= 0 && (!ui || !ui.battle || ui.frame !== juiceWashAt)) juiceRinse(true);
}

// work out the next step's cube drops while this step is on screen (when the browser is idle), so the hit doesn't stall
let labPrepH = 0;
function labPrep(){
  if (labPrepH && window.cancelIdleCallback) cancelIdleCallback(labPrepH);
  const f = ui.battle && ui.battle.frames[ui.frame + 1]; if (!f || !window.OasisCubes || !OasisCubes.prepare) return;
  const by = new Map();
  for (const x of (f.hits || [])){
    const el = document.querySelector(`#view-play .card[data-uid$="-${x.uid}"]:not(.mini)`); if (!el) continue;
    if (x.from != null && document.querySelector(`#view-play .card[data-uid$="-${x.from}"]:not(.mini)`)) continue;   // Overrun cubes move, they don't drop
    const e = by.get(el.dataset.uid) || {id:el.dataset.uid, drops:[]}; e.drops.push(x.a); by.set(e.id, e);
  }
  if (!by.size) return;
  const run = () => { labPrepH = 0; try{ OasisCubes.prepare([...by.values()]); }catch(e){} };
  labPrepH = window.requestIdleCallback ? requestIdleCallback(run, {timeout:1200}) : setTimeout(run, 300);
}
addEventListener('load', () => setTimeout(() => labApply(false), 50));
// get the cube graphics and physics ready while the page settles, so the first drop doesn't stall
addEventListener('load', () => setTimeout(() => { try{ window.OasisCubes && OasisCubes.warm && OasisCubes.warm(); }catch(e){} }, 1200));
