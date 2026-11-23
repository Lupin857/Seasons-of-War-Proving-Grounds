
/* ===== Board settings: the battle board's look (table view, card size, splay, impact, depth, zoom), saved per browser ===== */
// Which version of the game this is: the artifact's publish number, bumped on every publish (shown in Board settings,
// so a bug report can say which version it came from; the repo's commit message ends with the same number)
const OASIS_BUILD = 'v79';
const LAB_DEF = {view:'table', tilt:15, size:'auto', splay:'now', stock:true, light:true, freeze:true, dust:true, squash:true, jolt:false, zoom:115, morph:true, open:false};
let LAB = {...LAB_DEF};
try{ Object.assign(LAB, JSON.parse(localStorage.getItem('oasisBoard') || '{}')); }catch(e){}
// one time only: everyone moves to the new default splay (up-left); after that, a player's own choice sticks
try{ if (!localStorage.getItem('oasisBoardSplayUL')){ LAB.splay = 'now'; localStorage.setItem('oasisBoard', JSON.stringify(LAB)); localStorage.setItem('oasisBoardSplayUL', '1'); } }catch(e){}
const labSave = () => { try{ localStorage.setItem('oasisBoard', JSON.stringify(LAB)); }catch(e){} };
const labCrop = () => LAB.size === 'crop' || (LAB.size === 'auto' && compact());
let LABPILE = 0;
// the most bands a stack behind a battle card can have: copies (one band), gear, Might, Training, Shield. Every card
// spot keeps this much room at all times, so nothing on the board moves as stacks grow and shrink.
const STACK_MAX = 5;
// that room as CSS, for the current splay: [above the card, left of it]
const labFixedRoom = () => { const sp = LAB.splay, fan = sp === 'fanL' || sp === 'fanR';
  return [fan ? `calc(var(--tky) * ${(STACK_MAX * .55).toFixed(2)} + 10px)` : `calc(var(--tky) * ${STACK_MAX})`,
          sp === 'now' ? `calc(var(--tkl) * ${STACK_MAX})` : sp === 'fanL' ? `calc(var(--bcw) * .32)` : '0px']; };
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
  const n = STACK_MAX, sp = LAB.splay, fan = sp === 'fanL' || sp === 'fanR';   // room is fixed, whatever the stack holds
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
// the deck: the revealed unit is the top card; the cards under it stay hidden, their edges drawn under its face
function labDeck(sd, side, names){
  const rev = sd.deck[0], rest = sd.deck.length - 1;
  const nsp = sd.deck.reduce((a, u) => a + (u.sp || []).length, 0) + (sd.tail || []).length;
  let top;
  if (rev){
    const k = Math.min(rest, 8), cols = ['#5a4636', '#3b2d23'];
    LABPILE = k;
    try{ top = cardHTML(rev, side, 'revealed'); } finally { LABPILE = 0; }
  } else top = '';
  // the empty-deck outline is part of the board: always drawn in the deck's spot, covered by the top card while there is one
  top = `<div class="slot labempty labslot${rev ? ' under' : ''}" aria-hidden="${rev ? 'true' : 'false'}">Deck empty</div>` + top;
  // the count lives in the zone's label (click it for the deck view), not on the cards
  const cnt = `<button type="button" class="labcnt" data-labdeck="${side}" title="See the whole deck">${sd.deck.length} in deck${nsp ? `<i>✶ ${nsp}</i>` : ''}</button>`;
  return `<div class="tz deckz"><span class="zl labzl" data-labdeck="${side}">${names[side]} deck ${sd.deck.length ? cnt : ''}${sd.sil ? ' · next reveal silenced' : ''}</span><div class="tzc">${top}</div></div>`;
}
// the graveyard: a face-up pile, the last unit defeated on top, lit like the rest, art muted, with a count. The cards
// below stay in the pile (a little crooked), so a unit dying onto it lands on the one before instead of replacing it.
function labGcard(u, side, top, k){
  const url = labArt(u), rot = top ? 0 : (((u.uid * 37) % 9) - 4) * .8, dx = top ? 0 : (((u.uid * 53) % 7) - 3);
  const tag = top ? 'b' : 'span';
  return `<${tag} class="gcard${top ? '' : ' gunder'}"${top ? ` data-uid="${side}-${u.uid}"` : ` data-guid="${side}-${u.uid}"`}${top ? '' : ` style="position:absolute;left:${dx}px;top:${k * 1.5}px;transform:rotate(${rot}deg);z-index:${-1 - k}"`}><span class="labsh" aria-hidden="true">${labEdges(0)}<i></i></span>${url ? `<span class="gart" style="background-image:url('${url}')"></span>` : `<span class="gplain">${esc(u.name)}</span>`}<span class="lablt" aria-hidden="true"></span></${tag}>`;
}
function labGrave(sd, side, names){
  const g = sd.grave, last = g[g.length - 1];
  let inner = '<div class="labempty labslot">Empty</div>';
  if (last){
    const under = g.slice(-4, -1).reverse().map((u, k) => labGcard(u, side, false, k)).join('');
    inner = `<div class="labempty labslot under" aria-hidden="true">Empty</div><div class="grave labgpile" data-labgrave="${side}" role="button" tabindex="0" title="See the graveyard" style="position:relative;isolation:isolate">${under}${labGcard(last, side, true, 0).replace(/<\/b>$/, (g.length > 1 ? `<span class="gn">${g.length}</span>` : '') + '</b>')}</div>`;
  }
  return `<div class="tz grz"><span class="zl labzl" data-labgrave="${side}">${names[side]} graveyard${g.length ? ' · ' + g.length : ''}</span><div class="tzc">${inner}</div></div>`;
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
window.__cubeTilt = () => ({P:compact() ? 900 : 1500, a:(compact() ? LAB.tilt * .92 : LAB.tilt) * Math.PI / 180, fx:.5, fy:compact() ? .55 : .6});

// switches
const LAB_OPTS = [
  ['view', 'Table', [['flat', 'Flat'], ['lean', 'Cards lean'], ['table', 'Table tipped']]],
  ['size', 'Card size', [['crop', 'Cropped'], ['full', 'Full'], ['auto', 'Cropped on phone']]],
  ['splay', 'Splay', [['up', 'Up'], ['now', 'Up-left (now)'], ['diag', 'Stepped right'], ['fanL', 'Fan left'], ['fanR', 'Fan right']]],
];
// (a step of renderPlay)
function labAfterDraw(){ document.body.classList.toggle('lab-inbattle', !!(ui && ui.battle)); }
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
      else if (b.dataset.t === 'tog'){ LAB.open = !LAB.open; labSave(); labPanel(); }
      else if (b.dataset.t === 'reset'){ LAB = {...LAB_DEF}; labSave(); labApply(); }
    });
    p.addEventListener('change', e => { const i = e.target; if (i.dataset.z){ labSave(); labApply(); return; } if (i.dataset.c){ LAB[i.dataset.c] = i.checked; labSave(); labApply(); } });
    p.addEventListener('input', e => { const i = e.target; if (i.dataset.z){ LAB.zoom = +i.value; p.querySelector('.zoomv').textContent = LAB.zoom + '%'; document.body.style.setProperty('--bcw', Math.round((compact() ? 98 : 150) * LAB.zoom / 100) + 'px'); return; } if (i.dataset.r){ LAB.tilt = +i.value; labSave(); document.body.style.setProperty('--tilt', LAB.tilt + 'deg'); document.body.style.setProperty('--ldepth', Math.round(LAB.tilt * (compact() ? 7 : 11)) + 'px'); p.querySelector('.tiltv').textContent = LAB.tilt + '°'; try{ window.OasisCubes && OasisCubes.afterRender(); }catch(e){} } });
  }
  p.classList.toggle('shut', !LAB.open);
  const seg = ([k, lab, vals]) => `<fieldset><legend>${lab}</legend><div class="seg">${vals.map(([v, t]) => `<button type="button" data-o="${k}" data-v="${v}" aria-pressed="${LAB[k] === v}">${t}</button>`).join('')}</div></fieldset>`;
  p.innerHTML = `<div class="labhd">${LAB.open ? `<b>Board settings</b><small class="labbuild" title="Game version (artifact publish number)">${OASIS_BUILD}</small>` : ''}<button type="button" class="labtog" data-t="tog" aria-expanded="${LAB.open}">${LAB.open ? 'Hide' : 'Board settings'}</button></div>
  <div class="labin">${seg(LAB_OPTS[0])}
  <fieldset><legend>Zoom <span class="zoomv">${LAB.zoom}%</span></legend><input type="range" min="60" max="150" step="5" value="${LAB.zoom}" data-z="zoom" aria-label="Zoom"></fieldset>
  <fieldset${LAB.view === 'flat' ? ' disabled style="opacity:.45"' : ''}><legend>Tilt <span class="tiltv">${LAB.tilt}°</span></legend><input type="range" min="8" max="40" step="1" value="${LAB.tilt}" data-r="tilt" aria-label="Tilt angle"></fieldset>
  ${seg(LAB_OPTS[1])}${seg(LAB_OPTS[2])}
  <fieldset><legend>Impact</legend><label class="chk"><input type="checkbox" data-c="freeze" ${LAB.freeze ? 'checked' : ''}> Brief freeze</label><label class="chk"><input type="checkbox" data-c="dust" ${LAB.dust ? 'checked' : ''}> Dust puff</label><label class="chk"><input type="checkbox" data-c="squash" ${LAB.squash ? 'checked' : ''}> Squash</label><label class="chk"><input type="checkbox" data-c="jolt" ${LAB.jolt ? 'checked' : ''}> Knock-back jolt</label></fieldset>
  <fieldset><legend>Redraws</legend><label class="chk"><input type="checkbox" data-c="morph" ${LAB.morph !== false ? 'checked' : ''}> Update in place</label></fieldset>
  <fieldset><legend>Depth</legend><label class="chk"><input type="checkbox" data-c="stock" ${LAB.stock ? 'checked' : ''}> Card stock</label><label class="chk"><input type="checkbox" data-c="light" ${LAB.light ? 'checked' : ''}> Light</label></fieldset>
  <div class="rowb"><button type="button" class="labbtn" data-t="reset">Reset switches</button></div></div>`;
}
let labWasCompact = compact();
addEventListener('resize', () => { if (compact() !== labWasCompact){ labWasCompact = compact(); if (LAB.size === 'auto') labApply(); } });


// a newly revealed unit: the cards attached to it (copies, gear, tokens) slide out from behind it into their splay
const labRevealed = f => f ? f.snap.map(sd => sd.deck[0] ? sd.deck[0].uid : null) : [null, null];
// only: just these of its peeking cards (a token just gained); done: called once the last has landed
function labSplayIn(el, delay, only, done){
  if (!el || reduceMotion()){ if (done) done(); return; }
  const tks = only || [...el.querySelectorAll(':scope > .tk')]; if (!tks.length){ if (done) done(); return; }
  const cs = getComputedStyle(el), tky = parseFloat(cs.getPropertyValue('--tky')) || 26, fan = LAB.splay === 'fanL' ? 1 : LAB.splay === 'fanR' ? -1 : 0;
  tks.forEach((t, i) => {
    const j = parseInt(t.style.getPropertyValue('--j')) || i;
    const x = -t.offsetLeft, y = -t.offsetTop + (fan ? tky * .55 * (j + 1) : 0);
    const a = t.animate([{translate:`${x}px ${y}px`, rotate:`${fan * 7 * (j + 1)}deg`}, {translate:'0px 0px', rotate:'0deg'}],
      {duration:480, delay:delay + 80 * i, easing:'cubic-bezier(.2,.8,.3,1)', fill:'backwards'});
    if (done && i === tks.length - 1){ a.onfinish = a.oncancel = done; }
  });
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
  const wind = 130, rush = 110, hold = LAB.freeze ? 85 : 0, back = 300, T = wind + rush + hold + back, hitT = wind + rush;
  const o = x => +(x / T).toFixed(4);
  for (const [el, r, dir] of [[a, ra, 1], [b, rb, -1]]){
    const k = el.offsetHeight / Math.max(1, r.height);   // screen px to the card's own (tilted) px
    const d = meet * k * dir, pull = -7 * k * dir, jolt = LAB.jolt ? -10 * k * dir : 0;
    const sq = LAB.squash ? ' scale(1.05,.9)' : ' scale(1.03)';
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
