/* Step animation: plays on the board as it is now, then shows the next step. */
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const compact = () => !!(window.matchMedia && matchMedia('(max-width:640px)').matches);   // phone layout: short cards, tap one to open it
const coarse = () => !!(window.matchMedia && matchMedia('(pointer:coarse)').matches);
function unitsOf(fr, zones){
  const m = new Map();
  fr.snap.forEach((sd, side) => { for (const z of zones){ const list = z === 'charge' ? [sd.charge] : sd[z]; for (const u of list) if (u) m.set(`${side}-${u.uid}`, u); } });
  return m;
}
/* Ability notes: during a battle step, every ability that triggered gets a note beside the battlefield (yours on the
   left, the opponent's on the right; on phones, two columns above it), with the card's name, its rules text at the
   level it has, and who it hit in brackets. The battle ink (js/ui/19-battle-ink.js) dots a line of brush dabs from the
   card to its note. Notes belong to the step on screen and go when you move on; they are hidden while auto-play runs,
   and the Ability notes button turns them off. */
const abOn = () => LS.get('sow-abwin') !== false;
let abRaf = 0;
function abGroups(f){
  const groups = new Map();
  for (const l of f.lines){ if (!l.ab) continue; const k = l.ab.g ? `g:${l.ab.n}:${l.ab.u}` : l.ab.u || `b:${l.ab.s}:${l.ab.n}`; if (!groups.has(k)) groups.set(k, {ab:l.ab, lines:[]}); groups.get(k).lines.push(l); }
  // a Shield that blocks a hit gets its own note, joined to the shield on that card
  for (const l of f.lines) if (l.to && !l.tok && l.amt === 0){
    const k = 'sh:' + l.to; if (groups.has(k)) continue;
    groups.set(k, {ab:{n:'Shield', u:l.to, s:+String(l.to).split('-')[0], sh:true}, lines:[]});
  }
  return [...groups.values()];
}
function abNoteHTML(g, f, i){
  const ab = g.ab, units = unitsOf(f, ['charge', 'deck', 'grave']);
  if (ab.sh){
    const u = units.get(ab.u), body = esc(KW_TOKENS.Shield.replace(/\*\*/g, ''));
    return `<div class="abbox shnote s${VS(ab.s)}" data-abi="${i}"><b class="abn">Shield</b><span class="abt"><span class="kwt">${body}</span>${u ? ` <span class="abtg">(${esc(u.name.replace(/^Jester → /, 'Jester as '))})</span>` : ''}</span></div>`;
  }
  const src = ab.u ? units.get(ab.u) : null, lvl = src ? src.lvl || 1 : 1;
  let title, body;
  if (ab.g){ const w = src && src.name !== ab.n ? src.name.replace(/^Jester → /, 'Jester as ') : ''; title = w ? `${ab.n} (on ${w})` : ab.n; body = BDEFS[ab.n] ? cardTx(ab.n, 'b', 1, true) : ''; }
  else if (ab.m){ title = `✶ ${ab.n}`; body = esc(batFx(ab.n)); }
  else if (ab.b){ const pl = G && G.players && G.players[ab.s]; title = ab.n; body = BDEFS[ab.n] ? cardTx(ab.n, 'b', pl ? bLvl(pl, ab.n) : 1, true) : ''; }
  else { const nm0 = ab.as || ab.n; title = ab.as ? `${ab.n} (as ${ab.as})` : ab.n; body = DEFS[nm0] ? cardTx(nm0, 'u', lvl, true) : ''; }
  const tg = [...new Set([...(ab.tg || []), ...g.lines.map(l => l.to).filter(x => x && x !== ab.u).map(x => { const u = units.get(x); return u ? u.name.replace(/^Jester → /, 'Jester as ') : null; })].filter(Boolean))];
  return `<div class="abbox${ab.g ? ' gnote' : ''} s${VS(ab.s)}" data-abi="${i}"><b class="abn">${esc(title)}</b><span class="abt"><span class="kwt">${body}</span>${tg.length ? ` <span class="abtg">(${tg.map(esc).join(', ')})</span>` : ''}</span></div>`;
}
/* Ability notes going away. Their layout depends on the stage they sit in (CSS variables for where the cities end,
   the stage's size), so moving them anywhere else would shift them. Instead each column is measured where it is,
   pinned to the screen at exactly that spot, and faded out together. */
function abSnap(stage){
  const win = stage && stage.querySelector('.abwin'); if (!win) return null;
  const cols = [...win.querySelectorAll('.abcol')].map(c => ({el:c, r:c.getBoundingClientRect()}));
  return {win, key:win.dataset.key, cols};
}
function abFade(snap){
  if (!snap) return;
  const g = document.createElement('div'); g.className = 'abghost'; g.setAttribute('aria-hidden', 'true');
  for (const {el, r} of snap.cols){ if (!r.width) continue;
    el.style.cssText += `;position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;right:auto;bottom:auto;max-height:none;overflow:hidden;margin:0`;
    g.appendChild(el); }
  snap.win.remove();
  document.body.appendChild(g); void g.offsetWidth; g.classList.add('out');
  setTimeout(() => g.remove(), 320);
}
function mountAbWin(){
  const stage = $('view-play').querySelector('.stage'); if (!stage) return;
  const fNow = ui.battle && abOn() && !autoOn() ? ui.battle.frames[ui.abFrame != null ? ui.abFrame : ui.frame] : null;
  const showing = stage.querySelector('.abwin'), key = fNow ? abGroups(fNow).map(g => abNoteHTML(g, fNow, 0)).join('|') : '';
  if (showing && key && showing.dataset.key === key) return;   // same notes: nothing to do (no fade, no jump)
  cancelAnimationFrame(abRaf); abRaf = 0;
  abFade(abSnap(stage)); stage.querySelectorAll('.abwin').forEach(n => n.remove());
  if (!fNow) return;
  const f = fNow, gs = abGroups(f); if (!gs.length) return;
  // each note goes to the corner nearest its card: your side along the bottom, the enemy's along the top,
  // and left or right by which half of the battlefield the card (or building chip) is in
  const sr = stage.getBoundingClientRect(), mid = sr.left + sr.width / 2;
  // a unit's corner follows its zone: your deck is on the left and your charge and graveyard on the right; the enemy's
  // row is the mirror image. Buildings go by which half of the city row their chip is in.
  const zoneOf = ab => { if (!ab.u) return null; const [o, id] = ab.u.split('-').map(Number), sd = f.snap[o];
    if (sd.charge && sd.charge.uid === id) return 'charge'; if (sd.deck.some(u => u.uid === id)) return 'deck'; if (sd.grave.some(u => u.uid === id)) return 'grave'; return null; };
  const half = g => {
    const z = abIsSave(g) ? 'deck' : zoneOf(g.ab), s0 = VS(g.ab.s) === 0;
    if (z) return z === 'deck' ? (s0 ? 'L' : 'R') : (s0 ? 'R' : 'L');
    const el = abSrcEl(stage, g.ab); if (!el) return s0 ? 'L' : 'R'; const r = el.getBoundingClientRect(); return r.left + r.width / 2 < mid ? 'L' : 'R'; };
  const where = gs.map(half);
  const col = (s, h) => gs.map((g, i) => [g, i]).filter(([g, i]) => g.ab.s === s && where[i] === h).map(([g, i]) => abNoteHTML(g, f, i)).join('');
  const win = document.createElement('div'); win.className = 'abwin'; win.dataset.key = key;
  win.innerHTML = [0, 1].flatMap(s => ['L', 'R'].map(h => { const c = col(s, h); return c ? `<div class="abcol s${VS(s)} ${h}">${c}</div>` : ''; })).join('');
  try{ kwDecorate(win, null, true); }catch(e){}   // no keyword list here, so each keyword explains itself on hover
  win.addEventListener('click', e => { const bx = e.target.closest('.abbox'); if (bx){ e.stopPropagation(); bx.classList.toggle('min'); } });
  stage.appendChild(win);
  // the gear that triggered lights up on the unit wearing it
  for (const g of gs) if (g.ab.g){ const el = abSrcEl(stage, g.ab); const ch = el && (el.closest('.gtk') || (el.classList.contains('cgear') ? el : null)); if (ch) ch.classList.add('gfire'); }
  // the notes keep their place as the board around them moves (see abPlace)
  const tick = () => {
    const st = win.isConnected && win.closest('.stage'); if (!st){ abRaf = 0; return; }
    abPlace(st); abRaf = requestAnimationFrame(tick);
  };
  tick();
}
function abSrcEl(stage, ab){
  // a Shield note always points at the Shield token itself (from the first moment, not only once the board redraws)
  if (ab.sh){ const c = stage.querySelector(`.card[data-uid="${ab.u}"]`); const s0 = c && (c.querySelector(':scope > .pk.shhit') || c.querySelector(':scope > .pk[data-k="sh"]')); return c ? (s0 ? (s0.querySelector('.tkband') || s0) : c) : null; }
  if (ab.g){ const c = stage.querySelector(`.card[data-uid="${ab.u}"]`); if (c){ const t = c.querySelector('.gtk'); return t ? (t.querySelector('.tkband') || t) : (c.querySelector('.cgear') || c); } }
  return ab.u ? (stage.querySelector(`.card[data-uid="${ab.u}"]`) || stage.querySelector(`.grave [data-uid="${ab.u}"]`) || stage.querySelector(`[data-uid="${ab.u}"]`))
              : (stage.querySelector(`.city[data-side="${VS(ab.s)}"] .citycard[data-b="${CSS.escape(ab.n)}"]`) || stage.querySelector(`.osbar.s${VS(ab.s)} .oscar[data-b="${CSS.escape(ab.n)}"]`));   // (on the mat: the Caravan bar)
}
// Where the notes sit: on phones under the battle buttons (--abtop); on wider screens between the two cities, beside the
// battle rows (--abT/--abB on the stage), so they never cover a city card. Compared with the stage's own values, not a
// cache: a redraw that rewrites the stage's style drops them, and the notes would jump to the edges.
function abPlace(stage){
  const sr = stage.getBoundingClientRect();
  if (compact()){ const bc = $('view-play').querySelector('.battlectl'), top = bc && bc.offsetHeight ? bc : $('gtop');
    const low = [top, stage.querySelector('.osbar.opp'), stage.querySelector('.osbars') && document.querySelector('#gtop .pbhint')].filter(e => e && e.offsetHeight).map(e => e.getBoundingClientRect().bottom);
    const t = low.length ? Math.max(8, ...low.map(b => b + 6)) : 8;   // (no controls row on the mat: under the top bar, the rival's Caravan bar and the step line)
    if (document.documentElement.style.getPropertyValue('--abtop') !== t + 'px') document.documentElement.style.setProperty('--abtop', t + 'px'); return; }
  const cT = stage.querySelector('.city.s1'), cB = stage.querySelector('.city.s0');
  const t = cT ? Math.max(0, Math.round(cT.getBoundingClientRect().bottom - sr.top)) : 0, b = cB ? Math.max(0, Math.round(sr.bottom - cB.getBoundingClientRect().top)) : 0;
  if (stage.style.getPropertyValue('--abT') !== t + 'px') stage.style.setProperty('--abT', t + 'px');
  if (stage.style.getPropertyValue('--abB') !== b + 'px') stage.style.setProperty('--abB', b + 'px');
}
/* Auto-play: steps through the battle on its own, one step after another, until the end. The setting is remembered. */
let autoT = null;
const autoOn = () => LS.get('sow-autoplay') === true;
const autoLabel = () => autoOn() ? '❚❚ Auto' : '▶ Auto';
const autoFast = () => LS.get('sow-autofast') === true;
const speedLabel = () => autoFast() ? '2×' : '1×';
function syncAutoBtn(){ $('view-play').querySelectorAll('[data-act="b-auto"]').forEach(b => { b.setAttribute('aria-pressed', autoOn() ? 'true' : 'false'); b.textContent = autoLabel(); }); }   // (the controls row's, and the mat dock's)
function stopAuto(turnOff){ clearTimeout(autoT); autoT = null; if (turnOff && autoOn()){ LS.set('sow-autoplay', false); syncAutoBtn(); } }
function startAuto(delay){ stopAuto(); if (autoOn() && ui.battle) autoT = setTimeout(autoTick, delay ?? 900); }
function autoTick(){
  autoT = null;
  if (!autoOn() || !ui.battle || !G) return;
  if ($('view-play').hidden){ autoT = setTimeout(autoTick, 500); return; }   // paused while another tab is open
  if (ui.animT || peekEl || (typeof matBatBusy === 'function' && matBatBusy())){ autoT = setTimeout(autoTick, 200); return; }   // let the current step (or the mat's flow into the battle) finish first
  if (ui.frame >= ui.battle.frames.length - 1) return;
  stepForward(); syncAutoBtn();
  autoT = setTimeout(autoTick, (reduceMotion() ? 700 : 1150) / (autoFast() ? 2 : 1));
}
function stopAnim(){ if (ui.animT){ clearTimeout(ui.animT); ui.animT = null; } }
// Reserve each side's row at the tallest it gets during this battle (decks shrink, graveyards grow): every frame is
// laid out once in a hidden copy of the table and measured. Redone when the battle or the table's width changes.
function applyRsv(root, rsv){
  for (const r of root.querySelectorAll('.trow')) for (const z of r.querySelectorAll(':scope > .chz, :scope > .deckz')){
    const m = rsv[(r.classList.contains('s1') ? 's1' : 's0') + (z.classList.contains('chz') ? 'c' : 'd')]; if (!m) continue;
    z.classList.add('rsv'); z.style.setProperty('--rsvT', typeof m[0] === 'number' ? m[0] + 'px' : m[0]); z.style.setProperty('--rsvL', typeof m[1] === 'number' ? m[1] + 'px' : m[1]);
  }
}
function reserveRows(){
  const st = $('view-play').querySelector('.stage'), line = st && st.querySelector('.line.table');
  if (!st || !line || !ui.battle) return;
  const mz = typeof labMatZones === 'function' && labMatZones();
  // phone battle on the mat: the cards start at the board's own size each battle; matFitBattle shrinks them to fit
  if (mz && ui.battle.fitW == null){ ui.battle.fitW = Math.round(98 * LAB.zoom / 100); document.documentElement.style.setProperty('--matbcw', ui.battle.fitW + 'px'); }
  const w = Math.round(st.getBoundingClientRect().width), key = w + ':' + ui.battle.frames.length + ':' + (typeof LAB === 'object' ? LAB.splay : '') + ':' + (mz ? ui.battle.fitW : '');
  if (ui.battle.rowKey !== key){
    const probe = document.createElement('div');
    probe.className = 'stage'; probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = `position:absolute;left:-10000px;top:0;width:${w}px;visibility:hidden;pointer-events:none`;
    st.parentNode.appendChild(probe);
    const names = PP() ? [poss(0), poss(1)] : ['Your', 'AI'], mx = [0, 0], rsv = {};
    const zones = root => [...root.querySelectorAll('.trow')].flatMap(r => [...r.querySelectorAll(':scope > .chz, :scope > .deckz')].map(z => ({z, k:(r.classList.contains('s1') ? 's1' : 's0') + (z.classList.contains('chz') ? 'c' : 'd')})));
    const face = z => z.querySelector('.charge > .card.hasart:not(.mini), .tzc > .card.hasart:not(.mini)');
    // pass 1: every card spot keeps room for the biggest stack a card can have (STACK_MAX bands), in every battle,
    // so the room never depends on what this battle happens to hold
    if (typeof labFixedRoom === 'function'){ const fx = labFixedRoom(); for (const k of ['s0c', 's0d', 's1c', 's1d']) rsv[k] = fx.slice(); }
    else for (const fr of ui.battle.frames){
      probe.innerHTML = lineHTML(fr, names);
      for (const {z, k} of zones(probe)){ const c = face(z); if (!c) continue; const cs = getComputedStyle(c), m = rsv[k] || (rsv[k] = [0, 0]);
        m[0] = Math.max(m[0], parseFloat(cs.marginTop) || 0); m[1] = Math.max(m[1], parseFloat(cs.marginLeft) || 0); }
    }
    // pass 2: row heights with that room held
    for (const fr of ui.battle.frames){
      probe.innerHTML = lineHTML(fr, names); applyRsv(probe, rsv);
      probe.querySelectorAll('.trow').forEach(r => { const i = r.classList.contains('s1') ? 1 : 0; mx[i] = Math.max(mx[i], r.getBoundingClientRect().height); });
    }
    probe.remove();
    // the rows keep the tallest height any battle has needed at this width and board look, so they never shrink
    // from one battle to the next
    const gk = w + ':' + (typeof LAB === 'object' ? [LAB.splay, LAB.size, LAB.view, LAB.zoom, LAB.tilt].join(',') : '') + (mz ? ':' + LABROOM + ':' + ui.battle.fitW : '');
    const keep = (window.__rowKeep || (window.__rowKeep = {}))[gk] || [0, 0];
    mx[0] = Math.max(mx[0], keep[0]); mx[1] = Math.max(mx[1], keep[1]); window.__rowKeep[gk] = mx.slice();
    ui.battle.rowH = mx; ui.battle.rsv = rsv; ui.battle.rowKey = key; ui.battle.rowGk = gk;
  }
  applyRsv(line, ui.battle.rsv || {});
  const [h0, h1] = ui.battle.rowH;
  const r0 = line.querySelector('.trow.s0'), r1 = line.querySelector('.trow.s1');
  if (r0) r0.style.minHeight = Math.ceil(h0) + 'px';
  if (r1) r1.style.minHeight = Math.ceil(h1) + 'px';
  // a row drawn taller than its reserve (the hidden copy can measure a little short) raises the reserve for good
  const keep = window.__rowKeep && ui.battle.rowGk ? window.__rowKeep[ui.battle.rowGk] : null;
  [r0, r1].forEach((r, i) => { if (!r) return; const h = r.offsetHeight; if (h > ui.battle.rowH[i]){ ui.battle.rowH[i] = h; if (keep) keep[i] = Math.max(keep[i], h); r.style.minHeight = h + 'px'; } });
  // each graveyard sits level with its row's charging card (or that card's empty spot), like the deck does: the pile
  // when there is one, else its empty outline, so the outline is drawn exactly where the first defeated card lands
  for (const r of [r0, r1]){
    const g = r && (r.querySelector('.grz .grave') || r.querySelector('.grz .tzc > .labslot')), box = g && g.closest('.tzc'), c = r && r.querySelector('.chz .charge > .card:not(.mini), .chz .charge > .slot.labempty, .chz .slot.labempty');
    if (!g || !box || !c) continue;
    box.style.marginTop = ''; const a = tableXY(c, line), b = tableXY(g, line); if (!a || !b) continue;   // (the pile's box moves, its empty spot with it)
    if (Math.abs(a.top - b.top) > .5) box.style.marginTop = (parseFloat(getComputedStyle(box).marginTop) || 0) + a.top - b.top + 'px';
  }
  if (mz) matFitBattle(line);
}
/* One-screen phone battle on the mat (Brian, Nov 24): the whole table, both Caravans included, fits between the top
   bars and the dock, with the cards as big as that allows (never bigger than the board's own size). The cards'
   width is --matbcw, which css/11-rug.css gives the board as --bcw (tucks, gaps and room follow); labels and bars
   don't scale, so the height is a straight line in the width: a few secant steps find the width, re-measuring the
   rows each time (no redraw). Rows are reserved for the tallest frame, so the size holds for the whole battle. */
function matFitBattle(line){
  const b = ui.battle; if (!b || !line || b.fitting) return;
  const base = Math.round(98 * LAB.zoom / 100), {top, bot} = battleRoom(), room = bot - top - 6;
  if (room < 120) return;
  const H = () => line.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--matgap', '0px');   // measured without the extra gap (added back below)
  let w = b.fitW, h = H(), pw = null, ph = null;
  b.fitting = true;
  try{
    for (let i = 0; i < 5; i++){
      if (h <= room && (w >= base || room - h < 10)) break;   // fits, and no room to grow
      let next = pw == null || Math.abs(h - ph) < 1 ? w * room / h : w + (room - h) * (w - pw) / (h - ph);
      next = Math.max(56, Math.min(base, Math.floor(next)));
      if (next === w) break;
      pw = w; ph = h; w = next;
      b.fitW = w; document.documentElement.style.setProperty('--matbcw', w + 'px');
      reserveRows(); h = H();
    }
    if (h > room && w > 56){ b.fitW = w = Math.max(56, w - 2); document.documentElement.style.setProperty('--matbcw', w + 'px'); reserveRows(); }
    // and across: on a narrow phone the three spots of a row (the near row is drawn wider, in the tilt) must stay on
    // screen, so the cards shrink a little more if a spot hangs past either edge
    const vw = document.documentElement.clientWidth;
    const over = () => Math.max(0, ...[...line.querySelectorAll('.trow > .tz > .tzc')].map(z => { const r = z.getBoundingClientRect(); return Math.max(-r.left, r.right - vw); }));
    for (let i = 0; i < 6 && w > 56; i++){
      const o = over(); if (o <= 1) break;
      const rw = line.querySelector('.trow.s0').getBoundingClientRect().width || vw;
      b.fitW = w = Math.max(56, Math.min(w - 1, Math.floor(w * (rw - 2 * o - 4) / rw)));
      document.documentElement.style.setProperty('--matbcw', w + 'px'); reserveRows();
    }
    // room left over once the cards are full size goes between the two battle rows (Brian, Nov 24: more space there),
    // up to 90 px more than the 28 px they always keep (--matgap, css/11-rug.css)
    const gap = Math.max(0, Math.min(90, Math.floor(room - H())));
    b.fitGap = gap; document.documentElement.style.setProperty('--matgap', gap + 'px');
  } finally { b.fitting = false; }
}
window.addEventListener('resize', () => { if (ui.battle) reserveRows(); });
/* Show battle step k (glide: animate from the step on screen). Steps around the redraw come from the cubes
   (js/mobile-crop.js) and Board settings (js/board-settings.js); until v58 they were wrappers. Add steps here. */
const DEATH_FLY_MS = 520;    // a defeated card's flight to the graveyard (deathFly)
const GRAVE_STAGGER = 260;   // ms between two units of one side flying to the graveyard in the same step
function goFrame(k, glide){
  const lab = labBeforeStep();             // Board settings: which units are revealed before the step
  cubesBeforeStep(glide);                  // damage cubes: lift off a defeated card's cubes, or settle them on a jump
  const r = showFrame.apply(this, arguments);
  healRefillAfterStep(glide);              // a healed unit's bar refills as its cubes are swept off
  labAfterStep(lab, glide);                // Board settings: a newly revealed unit glides into its splay
  return r;
}
// The step itself; call goFrame, not this.
function showFrame(k, glide){
  stopAnim();
  const from = new Map();
  if (glide && !reduceMotion()) for (const el of $('view-play').querySelectorAll('.line [data-uid]')){ const r = el.getBoundingClientRect(); r.wasB = el.tagName === 'B'; r.loc = tableXY(el, el.closest('.line')); if (!r.wasB) r.clone = el.cloneNode(true); from.set(el.dataset.uid, r); }
  const prevF = glide && ui.battle ? ui.battle.frames[ui.frame] : null;
  const broken = ui.battle && k === ui.frame + 1 ? shieldsToBreak() : [];   // shields that blocked a hit this step
  // tokens this step discards (a Fencer's Might, as the engine records it in drop) break the same way as it lands
  if (ui.battle && k === ui.frame + 1) for (const l of ui.battle.frames[k].lines) if (l.drop && l.to)
    for (const pk of $('view-play').querySelectorAll(`.stage .card[data-uid="${l.to}"] > .pk[data-k="${l.drop.tok}"]:not(.mbn)`)){ const b = tokenBreakInfo(pk); if (b) broken.push(b); }
  const under = ui.battle && k === ui.frame + 1 ? frameMoves(ui.battle.frames[k]).filter(m => m.to === 'deck-bottom') : [];   // cards going back under their deck
  const died = ui.battle && k === ui.frame + 1 ? frameMoves(ui.battle.frames[k]).filter(m => m.to === 'grave') : [];   // cards defeated this step
  // revealed units buried this step under cards put on top of their deck (the engine's deck-top moves)
  const buried = ui.battle && k === ui.frame + 1 ? [...new Set(frameMoves(ui.battle.frames[k]).filter(m => m.to === 'deck-top').map(m => +m.u.split('-')[0]))]
    .map(side => { const u = ui.battle.frames[ui.frame].snap[side].deck[0]; return u ? `${side}-${u.uid}` : null; }).filter(Boolean) : [];
  ui.frame = k; if (!ui.keepBanner) ui.bannerOff = false; renderPlay(); reserveRows();
  if (prevF && ui.battle) animateTokens(prevF, ui.battle.frames[k]); else clearTimeout(ui.tokT);
  if (broken.length) breakTokens(broken);
  if (ui.battle && k === ui.battle.frames.length - 1 && !ui.battle.chimed){
    ui.battle.chimed = true;
    const w = G.over ? G.winner : ui.battle.result.w, big = !!G.over;
    setTimeout(() => { if (w === 0) sfx.win(big); else if (w === 1) sfx.lose(big); else sfx.draw(); }, 120);
  }
  if (!from.size) return;
  const flies = [];   // [uid, r0, landing spot] of each card flying to the graveyard; started together below
  for (const el of $('view-play').querySelectorAll('.line [data-uid]')){
    const r0 = from.get(el.dataset.uid); if (!r0 || !el.animate) continue;
    const r1 = el.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    const toGrave = el.tagName === 'B' && !r0.wasB;   // just died (a name already in the list only slides)
    if (toGrave && r0.clone){ flies.push([el.dataset.uid, r0, el]); continue; }
    el.style.position = 'relative'; el.style.zIndex = 5;
    const tzUp = el.closest('.tz'); if (tzUp){ tzUp.style.position = 'relative'; tzUp.style.zIndex = 20; }
    // a card that grew or shrank (a stack strip becoming the revealed card, say) also eases between sizes
    const sx = r1.width ? r0.width / r1.width : 1, sy = r1.height ? r0.height / r1.height : 1;
    const grow = Math.abs(sx - 1) > 0.05 || Math.abs(sy - 1) > 0.05;
    if (grow) el.style.transformOrigin = 'top left';
    const a = el.animate(toGrave
      ? [{transform:`perspective(300px) translate(${dx}px,${dy}px) scale(2.2) rotateY(0deg)`, opacity:1, offset:0},
         {transform:`perspective(300px) translate(${dx * 0.45}px,${dy * 0.45}px) scale(1.6) rotateY(90deg)`, opacity:.9, offset:.45},
         {transform:'perspective(300px) translate(0,0) scale(1) rotateY(0deg)', opacity:1, offset:1}]
      : grow ? [{transform:`translate(${dx}px,${dy}px) scale(${sx})`, opacity:.35}, {opacity:1, offset:.55}, {transform:'none', opacity:1}]
             : [{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}],
      {duration: toGrave ? 500 : 680, easing: toGrave ? 'cubic-bezier(.22,.9,.3,1.04)' : 'cubic-bezier(.5,0,.2,1)'});
    if (grow) a.addEventListener('finish', () => { el.style.transformOrigin = ''; });
    a.onfinish = a.oncancel = () => { el.style.zIndex = ''; el.style.position = ''; if (tzUp){ tzUp.style.zIndex = ''; tzUp.style.position = ''; } };
  }
  // several units of one side defeated in one step: only the top of the graveyard pile carries data-uid, so the ones
  // that landed underneath fly to their own card in the pile (or to the pile, if it's buried too deep to be drawn)
  for (const m of died){
    const r0 = from.get(m.u); if (!r0 || !r0.clone || $('view-play').querySelector(`.line b[data-uid="${m.u}"]`)) continue;
    const side = m.u.split('-')[0], st = $('view-play').querySelector('.stage');
    const tgt = st && (st.querySelector(`.gcard[data-guid="${m.u}"]`) || st.querySelector(`.labgpile[data-labgrave="${side}"] > b`));
    if (tgt) flies.push([m.u, r0, tgt]);
  }
  // one side losing several units in a step: they go one after another in the order they land on the pile (the
  // charging unit first, underneath, then the revealed unit on top); the two sides still go at the same time
  const order = died.map(m => m.u), seen = [0, 0];
  flies.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  // a unit whose place a new card takes (Cowardly Squire) leaves its tokens and gear behind for it
  const placed = new Set(ui.battle && k === ui.frame ? frameMoves(ui.battle.frames[k]).filter(m => m.place).map(m => m.place) : []);
  for (const [uid, r0, tgt] of flies){ const s = +uid.split('-')[0]; deathFly(r0, tgt, GRAVE_STAGGER * seen[s]++, placed.has(uid)); }
  // a card that went back under its deck and is out of sight now slides in there (alone in its deck it's the revealed
  // card instead, and the FLIP above already moved it)
  for (const m of under){
    const r0 = from.get(m.u);
    if (r0 && r0.clone && !$('view-play').querySelector(`.line .card[data-uid="${m.u}"]:not(.mini)`)) deckFly(r0, +m.u.split('-')[0], m.k === 'back');
  }
  for (const id of buried){
    const r0 = from.get(id);
    if (r0 && r0.clone && !$('view-play').querySelector(`.line .card[data-uid="${id}"]:not(.mini)`)) buryTuck(r0, +id.split('-')[0]);
  }
}

/* Battle controls (moved here from the old Mobilize input file) */
document.addEventListener('keydown', e => {
  if (!ui.battle || $('view-play').hidden || e.target.closest('input,select,textarea')) return;
  if (e.key === 'ArrowRight'){ stepForward(); e.preventDefault(); }
  if (e.key === 'ArrowLeft'){ goFrame(Math.max(0, ui.frame - 1)); e.preventDefault(); }
});
// Next step goes on the press, not the click: the button is redrawn when a step's animation ends, and a click whose
// press and release land on different copies of it is lost, so fast clicking used to drop steps
let nextDownAt = -1e9;
$('view-play').addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  const b = e.target.closest('[data-act="b-next"]'); if (!b || b.disabled) return;
  nextDownAt = performance.now(); stepForward();
});
$('view-play').addEventListener('toggle', e => { if (e.target.id === 'chron-panel') ui.chronOpen = e.target.open; }, true);
