/* Step animation: plays on the board as it is now, then shows the next step. */
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const compact = () => !!(window.matchMedia && matchMedia('(max-width:640px)').matches);   // phone layout: short cards, tap one to open it
const coarse = () => !!(window.matchMedia && matchMedia('(pointer:coarse)').matches);
function unitsOf(fr, zones){
  const m = new Map();
  fr.snap.forEach((sd, side) => { for (const z of zones){ const list = z === 'charge' ? [sd.charge] : sd[z]; for (const u of list) if (u) m.set(`${side}-${u.uid}`, u); } });
  return m;
}
// curved arrows from each attacker to what it hit: yours travel up the table, the AI's come down it.
// animate: draw them in (the step playing); otherwise they sit still for the step on screen.
// the previous step's arrows dissolve rather than vanish
function fadeArrows(svg, into){
  if (!svg) return;
  svg.classList.add('out'); svg.classList.remove('still');
  if (into && svg.parentNode !== into) into.appendChild(svg);
  if (reduceMotion() || !svg.animate){ svg.remove(); return; }
  const a = svg.animate([{opacity:1}, {opacity:0}], {duration:420, easing:'ease-out', fill:'forwards'});
  a.onfinish = a.oncancel = () => svg.remove();
}
// Aim one battle arrow at the cards it joins, from where they are drawn right now (moves, lunges and token nudges
// included). If a card has left the board, the arrow keeps its last shape.
function placeArrow(path, stage, sr){
  const A = path._arw; if (!A) return;
  const find = id => id && (stage.querySelector(`.card[data-uid="${id}"]`) || stage.querySelector(`.grave [data-uid="${id}"]`));
  const te = A.tok === 'ret' ? bDeckEl(+String(A.to).split('-')[0]) : find(A.to); if (!te) return;   // a save points into the deck the unit went back into
  // a blocked hit points at the Shield it breaks (the outermost one on that card), not the card
  const she = A.shield ? (x => x && (x.querySelector('.tkband') || x))(te.querySelector(':scope > .pk.shhit') || [...te.querySelectorAll(':scope > .pk[data-k="sh"]')].pop()) : null;
  const tr = (she || te).getBoundingClientRect();
  const lbl = A.lbl;
  if (A.self){
    // a unit buffing itself: a small curl over its own top corner
    const side = A.by === 0 ? 1 : -1, ex = side > 0 ? tr.right - sr.left - 8 : tr.left - sr.left + 8, ey = tr.top - sr.top + 10;
    path.setAttribute('d', `M${ex - side * 26},${ey - 6} C${ex - side * 20},${ey - 34} ${ex + side * 14},${ey - 30} ${ex},${ey}`);
    lbl.setAttribute('x', ex + side * 8); lbl.setAttribute('y', ey - 22); lbl.style.textAnchor = side > 0 ? 'start' : 'end';
    placeTokIcon(lbl);
    return;
  }
  const fe = A.from ? find(A.from) : A.chip ? stage.querySelector(A.chip) : null;
  if (A.from && !fe) return;
  let P;
  if (fe) P = sideLink(fe.getBoundingClientRect(), tr, sr, 4);
  else {   // a building with no card on screen: from that player's edge of the table
    const t = sideMids(tr, sr)[A.by === 0 ? 2 : 0], y1 = A.by === 0 ? sr.height - 4 : 4;
    P = {a:{x:t.x, y:y1, nx:0, ny:A.by === 0 ? -1 : 1}, b:{x:t.x + t.nx * 4, y:t.y + t.ny * 4, nx:t.nx, ny:t.ny}};
  }
  const lane = (A.n % 4) * 9 * (A.by === 0 ? 1 : -1);   // several arrows between the same cards fan apart
  // a buff to a neighbouring unit on the same side: both ends on the faces toward that unit's player (yours along the
  // bottom, the AI's along the top), joined by a loop out past them, so a short hop is still easy to read
  let C = null;
  if (fe && A.tok && A.from && A.from.split('-')[0] === String(A.to).split('-')[0] && Math.hypot(P.b.x - P.a.x, P.b.y - P.a.y) < 60){
    const f = VS(+A.from.split('-')[0]) === 0 ? 2 : 0, pa = sideMids(fe.getBoundingClientRect(), sr)[f], pb = sideMids(tr, sr)[f];
    P = {a:pa, b:{x:pb.x + pb.nx * 4, y:pb.y + pb.ny * 4, nx:pb.nx, ny:pb.ny}};
    C = linkCurve(P.a, P.b, 0, 30 + (A.n % 3) * 10);
  }
  if (!C && !A.tok && fe){   // damage: a round elbow, square to both cards (or straight across when they line up)
    const E = elbowLink(fe.getBoundingClientRect(), tr, sr, 4, A.n);
    P = E.P; C = E.C;
  }
  if (!C) C = linkCurve(P.a, P.b, lane);
  path.setAttribute('d', C.d);
  if (C.nx != null){   // an arc: the label sits just outside its bow
    lbl.setAttribute('x', C.mx + C.nx * 8); lbl.setAttribute('y', C.my + C.ny * 8 + 4);
    lbl.style.textAnchor = Math.abs(C.nx) < 0.3 ? 'middle' : C.nx > 0 ? 'start' : 'end';
  } else {
    const right = A.by === 0;
    lbl.setAttribute('x', C.mx + (right ? 6 : -6)); lbl.setAttribute('y', C.my + 4);
    lbl.style.textAnchor = right ? 'start' : 'end';   // yours label to the right of its curve, the AI's to the left
  }
  placeTokIcon(lbl);
}
// The midpoints of a box's four sides (relative to the stage), each with the way that side faces.
function sideMids(r, sr){
  const L = r.left - sr.left, T = r.top - sr.top, W = r.width, H = r.height;
  return [{x:L + W / 2, y:T, nx:0, ny:-1}, {x:L + W, y:T + H / 2, nx:1, ny:0}, {x:L + W / 2, y:T + H, nx:0, ny:1}, {x:L, y:T + H / 2, nx:-1, ny:0}];
}
// Join two boxes from the midpoint of the side of one nearest the other to the midpoint of the side of the other
// nearest the first. Sides that face each other win; gap pulls the end point off the target's edge (for an arrowhead).
function sideLink(ra, rb, sr, gap){
  const A = sideMids(ra, sr), B = sideMids(rb, sr);
  let best = null, bd = Infinity;
  for (const p of A) for (const q of B){
    const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
    const facing = (dx * p.nx + dy * p.ny) >= 0 && (-dx * q.nx - dy * q.ny) >= 0;
    const score = d + (facing ? 0 : 1e4);
    if (score < bd){ bd = score; best = [p, q]; }
  }
  const [p, q] = best, g = gap || 0;
  return {a:p, b:{x:q.x + q.nx * g, y:q.y + q.ny * g, nx:q.nx, ny:q.ny}};
}
// Damage arrows: leave the attacker's top or bottom face square to it, then bend round (a quarter ellipse) into the
// target's left or right side, square to that. When the cards are lined up one above the other (or side by side), it
// runs straight between the facing sides instead. n: extra arrows in the same step bend a little wider.
function elbowLink(ra, rb, sr, gap, n){
  const A = sideMids(ra, sr), B = sideMids(rb, sr), g = gap || 0;
  const ca = {x:A[0].x, y:A[1].y}, cb = {x:B[0].x, y:B[1].y}, dx = cb.x - ca.x, dy = cb.y - ca.y;
  const end = q => ({x:q.x + q.nx * g, y:q.y + q.ny * g, nx:q.nx, ny:q.ny});
  const a = A[dy < 0 ? 0 : 2], b = B[dx > 0 ? 3 : 1];
  const tall = (b.y - a.y) * a.ny, wide = (b.x - a.x) * -b.nx;   // the target's side must lie ahead of both turns
  if (tall > 12 && wide > 12){
    const e = end(b), w = 1 + (n % 3) * 0.12, k1 = Math.abs(e.y - a.y) * 0.55 * w, k2 = Math.abs(e.x - a.x) * 0.55 * w;
    const c1x = a.x, c1y = a.y + a.ny * k1, c2x = e.x + e.nx * k2, c2y = e.y;
    const mx = (a.x + 3 * c1x + 3 * c2x + e.x) / 8, my = (a.y + 3 * c1y + 3 * c2y + e.y) / 8;
    const ox = mx - a.x, oy = my - e.y, ol = Math.hypot(ox, oy) || 1;   // away from the elbow's inside corner
    return {P:{a, b:e}, C:{d:`M${a.x},${a.y} C${c1x},${c1y} ${c2x},${c2y} ${e.x},${e.y}`, mx, my, nx:ox / ol, ny:oy / ol}};
  }
  // lined up: facing sides, straight (above/below) or across (same row)
  const vert = Math.abs(dy) >= Math.abs(dx);
  const p = vert ? A[dy < 0 ? 0 : 2] : A[dx > 0 ? 1 : 3], q = vert ? B[dy < 0 ? 2 : 0] : B[dx > 0 ? 3 : 1];
  const P = {a:p, b:end(q)}, C = linkCurve(P.a, P.b, (n % 4) * 9);
  return {P, C:{...C, nx:vert ? 1 : 0, ny:vert ? 0 : -1}};
}
// Damage arrows: a circular arc between the two side midpoints, always bowing the same way (to the right of travel),
// a little rounder for each extra arrow in the same step so they don't sit on top of each other.
function arcCurve(a, b, n){
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  const R = Math.max(d / 2 + 0.5, d * (0.78 - (n % 3) * 0.1));
  const sag = R - Math.sqrt(Math.max(0, R * R - d * d / 4));
  const nx = -dy / d, ny = dx / d;   // right of travel on screen (y runs down), the side a sweep-0 arc bows toward
  return {d:`M${a.x},${a.y} A${R},${R} 0 0 0 ${b.x},${b.y}`, mx:(a.x + b.x) / 2 + nx * sag, my:(a.y + b.y) / 2 + ny * sag, nx, ny};
}
// A gentle curve that leaves one side square to it and arrives square to the other; lane nudges it sideways.
function linkCurve(a, b, lane, minK){
  const dist = Math.hypot(b.x - a.x, b.y - a.y), k = Math.max(minK || 14, Math.min(70, dist * 0.38));
  const ux = dist ? (b.x - a.x) / dist : 0, uy = dist ? (b.y - a.y) / dist : 0, px = -uy * (lane || 0), py = ux * (lane || 0);
  const c1x = a.x + a.nx * k + px, c1y = a.y + a.ny * k + py, c2x = b.x + b.nx * k + px, c2y = b.y + b.ny * k + py;
  return {d:`M${a.x},${a.y} C${c1x},${c1y} ${c2x},${c2y} ${b.x},${b.y}`, mx:(a.x + 3 * c1x + 3 * c2x + b.x) / 8, my:(a.y + 3 * c1y + 3 * c2y + b.y) / 8};
}
// While the battle shows arrows, re-aim them every frame so their ends stay fixed to the cards as the cards move.
let arrowRaf = 0;
function followArrows(){
  if (arrowRaf) return;
  const tick = () => {
    const stage = ui.battle && $('view-play').querySelector('.stage');
    const svgs = stage ? stage.querySelectorAll('.arrows') : [];
    if (!svgs.length){ arrowRaf = 0; return; }
    const sr = stage.getBoundingClientRect();
    for (const svg of svgs){
      if (+svg.getAttribute('width') !== Math.round(sr.width)) svg.setAttribute('width', Math.round(sr.width));
      if (+svg.getAttribute('height') !== Math.round(sr.height)) svg.setAttribute('height', Math.round(sr.height));
      for (const p of svg.querySelectorAll('path.arw')) placeArrow(p, stage, sr);
    }
    arrowRaf = requestAnimationFrame(tick);
  };
  arrowRaf = requestAnimationFrame(tick);
}

/* Ability notes: during a battle step, every ability that triggered gets a note beside the battlefield (yours on the
   left, the opponent's on the right; on phones, two columns above it), with the card's name, its rules text at the
   level it has, and who it hit in brackets. A thin line joins each note to its arrow (or to the card, when the ability
   draws no arrow). Notes belong to the step on screen and go when you move on; they are hidden while auto-play runs,
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
   the stage's size), so moving them anywhere else would shift them. Instead each column and the link lines are
   measured where they are, pinned to the screen at exactly that spot, and faded out together. */
function abSnap(stage){
  const win = stage && stage.querySelector('.abwin'); if (!win) return null;
  const cols = [...win.querySelectorAll('.abcol')].map(c => ({el:c, r:c.getBoundingClientRect()}));
  const svg = stage.querySelector('.ablines');
  return {win, key:win.dataset.key, cols, svg, svgR:svg && svg.getBoundingClientRect()};
}
function abFade(snap){
  if (!snap) return;
  const g = document.createElement('div'); g.className = 'abghost'; g.setAttribute('aria-hidden', 'true');
  for (const {el, r} of snap.cols){ if (!r.width) continue;
    el.style.cssText += `;position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;right:auto;bottom:auto;max-height:none;overflow:hidden;margin:0`;
    g.appendChild(el); }
  if (snap.svg && snap.svgR && snap.svgR.width){ snap.svg.style.cssText += `;position:fixed;left:${snap.svgR.left}px;top:${snap.svgR.top}px`; g.appendChild(snap.svg); }
  snap.win.remove();
  document.body.appendChild(g); void g.offsetWidth; g.classList.add('out');
  setTimeout(() => g.remove(), 320);
}
function mountAbWin(){
  const stage = $('view-play').querySelector('.stage'); if (!stage) return;
  const fNow = ui.battle && abOn() && !autoOn() ? ui.battle.frames[ui.abFrame != null ? ui.abFrame : ui.frame] : null;
  const showing = stage.querySelector('.abwin'), key = fNow ? abGroups(fNow).map(g => abNoteHTML(g, fNow, 0)).join('|') : '';
  if (showing && key && showing.dataset.key === key) return;   // same notes: nothing to do (no fade, no jump)
  cancelAnimationFrame(abRaf); abRaf = 0;   // stop the old lines following before they're pinned
  abFade(abSnap(stage)); stage.querySelectorAll('.abwin, .ablines').forEach(n => n.remove());
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
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'ablines'); svg.setAttribute('aria-hidden', 'true');
  stage.appendChild(svg);
  const tick = () => {
    if (!svg.isConnected){ abRaf = 0; return; }
    placeAbLines(stage, svg, gs); abRaf = requestAnimationFrame(tick);
  };
  tick();
}
function abSrcEl(stage, ab){
  // a Shield note always points at the Shield token itself (from the first moment, not only once the board redraws)
  if (ab.sh){ const c = stage.querySelector(`.card[data-uid="${ab.u}"]`); const s0 = c && (c.querySelector(':scope > .pk.shhit') || c.querySelector(':scope > .pk[data-k="sh"]')); return c ? (s0 ? (s0.querySelector('.tkband') || s0) : c) : null; }
  if (ab.g){ const c = stage.querySelector(`.card[data-uid="${ab.u}"]`); if (c){ const t = c.querySelector('.gtk'); return t ? (t.querySelector('.tkband') || t) : (c.querySelector('.cgear') || c); } }
  return ab.u ? (stage.querySelector(`.card[data-uid="${ab.u}"]`) || stage.querySelector(`.grave [data-uid="${ab.u}"]`) || stage.querySelector(`[data-uid="${ab.u}"]`))
              : stage.querySelector(`.city[data-side="${VS(ab.s)}"] .citycard[data-b="${CSS.escape(ab.n)}"]`);
}
function placeAbLines(stage, svg, gs){
  const sr = stage.getBoundingClientRect(), phone = compact();
  if (phone){ const bc = $('view-play').querySelector('.battlectl'); const t = bc ? Math.max(8, bc.getBoundingClientRect().bottom + 6) : 8;
    if (stage._abtop !== t){ stage._abtop = t; document.documentElement.style.setProperty('--abtop', t + 'px'); } }
  if (!phone){   // notes sit between the two cities, beside the battle rows, so they never cover a city card
    const cT = stage.querySelector('.city.s1'), cB = stage.querySelector('.city.s0');
    const t = cT ? Math.max(0, Math.round(cT.getBoundingClientRect().bottom - sr.top)) : 0, b = cB ? Math.max(0, Math.round(sr.bottom - cB.getBoundingClientRect().top)) : 0;
    if (stage._abtb !== t + ':' + b){ stage._abtb = t + ':' + b; stage.style.setProperty('--abT', t + 'px'); stage.style.setProperty('--abB', b + 'px'); }
  }
  svg.setAttribute('width', Math.round(sr.width)); svg.setAttribute('height', Math.round(sr.height));
  let out = '';
  gs.forEach((g, i) => {
    const box = stage.querySelector(`.abbox[data-abi="${i}"]`); if (!box) return;
    const ab = g.ab, br = box.getBoundingClientRect();
    // from the midpoint of the card's side nearest its note to the midpoint of the note's side nearest the card
    const el = (abIsSave(g) && bDeckEl(ab.s)) || abSrcEl(stage, ab); if (!el) return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const P = sideLink(r, br, sr, 0), C = linkCurve(P.a, P.b, 0);
    out += `<path class="abl s${VS(ab.s)}" d="${C.d}"/><circle class="abd s${VS(ab.s)}" cx="${P.a.x}" cy="${P.a.y}" r="3.5"/><circle class="abd s${VS(ab.s)}" cx="${P.b.x}" cy="${P.b.y}" r="2.5"/>`;
  });
  if (svg._last !== out){ svg.innerHTML = out; svg._last = out; }
}
function drawArrows(list, animate, rects){
  const stage = $('view-play').querySelector('.stage'); if (!stage) return;
  const old = stage.querySelector('.arrows:not(.out)'); if (old){ if (animate === true) fadeArrows(old); else old.remove(); }
  if (!list.length) return;
  const sr = stage.getBoundingClientRect();
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'arrows' + (animate === false ? ' still' : '')); svg.setAttribute('width', sr.width); svg.setAttribute('height', sr.height);
  svg.innerHTML = `<defs>${[0,1].map(s => `<marker id="ah${s}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah${s}"/></marker>`).join('')}${
    ['arm','tr','sh','rec','ret'].map(t => `<marker id="aht-${t}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="aht t-${t}"/></marker>`).join('')}</defs>`;
  const pairs = new Map();
  for (const l of list){ const k = `${l.from}>${l.to}>${l.tok || ''}`; const p = pairs.get(k); if (p) p.amt += l.amt; else pairs.set(k, {...l}); }
  const TOKLBL = {arm:'', tr:'', sh:'', rec:'', ret:''};   // the token is shown by its icon after the number
  let drawn = 0;
  const find = id => id && (stage.querySelector(`.card[data-uid="${id}"]`) || stage.querySelector(`.grave [data-uid="${id}"]`));
  const lane = [0, 0];
  for (const h of pairs.values()){
    const te = h.tok === 'ret' ? bDeckEl(+String(h.to).split('-')[0]) : find(h.to); if (!te || (h.from && !find(h.from) && h.tok)) continue;
    drawn++;
    let chipSel = null;
    if (!h.from){   // a building: point from its chip in that player's city row
      const bn = ['Training Yard', 'Trebuchet', 'Armory', 'Infirmary', 'Muster Hall'].find(b => (h.t || '').includes(b));
      chipSel = bn ? `.city[data-side="${VS(h.by)}"] .citycard[data-b="${bn}"]` : null;
    }
    const n = lane[h.by]++;
    const chip = chipSel && stage.querySelector(chipSel);
    if (chip && animate === true && chip.animate) chip.animate([{outline:'0px solid transparent'}, {outline:'4px solid color-mix(in srgb, var(--or) 55%, transparent)', offset:.3}, {outline:'0px solid transparent'}], {duration:700, delay:n * 90});
    const cls = h.tok ? `arw tok t-${h.tok}` : `arw s${VS(h.by)}`, mk = h.tok ? `aht-${h.tok}` : `ah${VS(h.by)}`;
    const text = h.tok === 'ret' ? 'returns' : h.tok ? `+${h.amt}${TOKLBL[h.tok]}` : (h.amt ? `${h.amt}` : 'blocked');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('class', cls); path.setAttribute('marker-end', `url(#${mk})`);
    if (animate === true) path.style.animationDelay = (n * 90) + 'ms';
    svg.appendChild(path);
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('class', h.tok ? `arl tok t-${h.tok}` : `arl s${VS(h.by)}`); lbl.textContent = text;
    if (animate === true) lbl.style.animationDelay = (n * 90 + 200) + 'ms';
    svg.appendChild(lbl);
    const ic = h.tok && h.tok !== 'ret' ? tokIconSvg(h.tok) : null;
    if (ic){ if (animate === true) ic.style.animationDelay = (n * 90 + 200) + 'ms'; svg.appendChild(ic); lbl._ic = ic; }
    // each arrow remembers what it joins, so it can be re-aimed at the cards wherever they are drawn on screen
    path._arw = {from:h.from, to:h.to, chip:chipSel, by:VS(h.by), n, tok:h.tok || null, shield:!h.tok && !h.amt, self:!!(h.tok && h.from === h.to && h.tok !== 'ret'), lbl};
    placeArrow(path, stage, sr);
  }
  svg.dataset.full = drawn >= pairs.size ? '1' : '0';   // an arrow to a unit that doesn't exist yet (a new Recruit) is missing
  stage.appendChild(svg);
  if (animate === 'quiet') svg.classList.add('quiet');
  if (animate === true) for (const p of svg.querySelectorAll('.arw:not(.tok)')){ const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    p.addEventListener('animationend', () => { p.style.animation = 'none'; p.style.strokeDasharray = ''; p.style.strokeDashoffset = '0'; }, {once:true}); }
  followArrows();
}
const stepArrows = () => ui.battle ? ui.battle.frames[ui.frame].lines.filter(l => l.to) : [];
let arrowRz = null;
window.addEventListener('resize', () => { clearTimeout(arrowRz); arrowRz = setTimeout(() => { if (ui.battle && !ui.animT && !$('view-play').hidden) drawArrows(stepArrows(), 'quiet'); }, 120); });
/* Auto-play: steps through the battle on its own, one step after another, until the end. The setting is remembered. */
let autoT = null;
const autoOn = () => LS.get('sow-autoplay') === true;
const autoLabel = () => autoOn() ? '❚❚ Auto' : '▶ Auto';
const autoFast = () => LS.get('sow-autofast') === true;
const speedLabel = () => autoFast() ? '2×' : '1×';
function syncAutoBtn(){ const b = $('view-play').querySelector('[data-act="b-auto"]'); if (b){ b.setAttribute('aria-pressed', autoOn() ? 'true' : 'false'); b.textContent = autoLabel(); } }
function stopAuto(turnOff){ clearTimeout(autoT); autoT = null; if (turnOff && autoOn()){ LS.set('sow-autoplay', false); syncAutoBtn(); } }
function startAuto(delay){ stopAuto(); if (autoOn() && ui.battle) autoT = setTimeout(autoTick, delay ?? 900); }
function autoTick(){
  autoT = null;
  if (!autoOn() || !ui.battle || !G) return;
  if ($('view-play').hidden){ autoT = setTimeout(autoTick, 500); return; }   // paused while another tab is open
  if (ui.animT || peekEl){ autoT = setTimeout(autoTick, 200); return; }   // let the current step finish first
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
  const w = Math.round(st.getBoundingClientRect().width), key = w + ':' + ui.battle.frames.length + ':' + (typeof LAB === 'object' ? LAB.splay : '');
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
    const gk = w + ':' + (typeof LAB === 'object' ? [LAB.splay, LAB.size, LAB.view, LAB.zoom, LAB.tilt].join(',') : '');
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
}
window.addEventListener('resize', () => { if (ui.battle) reserveRows(); });
function goFrame(k, glide){
  stopAnim();
  const from = new Map();
  if (glide && !reduceMotion()) for (const el of $('view-play').querySelectorAll('.line [data-uid]')){ const r = el.getBoundingClientRect(); r.wasB = el.tagName === 'B'; if (!r.wasB) r.clone = el.cloneNode(true); from.set(el.dataset.uid, r); }
  const prevSvg = $('view-play').querySelector('.stage .arrows:not(.out)');
  const oldSvg = glide && k === ui.arrowsFor && prevSvg && prevSvg.dataset.full !== '0' ? prevSvg : null;   // incomplete: let the fresh drawing (which can see new units) take over
  const prevF = glide && ui.battle ? ui.battle.frames[ui.frame] : null;
  const broken = ui.battle && k === ui.frame + 1 ? shieldsToBreak() : [];   // shields that blocked a hit this step
  const under = ui.battle && k === ui.frame + 1 ? frameMoves(ui.battle.frames[k]).filter(m => m.to === 'deck-bottom') : [];   // cards going back under their deck
  ui.frame = k; if (!ui.keepBanner) ui.bannerOff = false; renderPlay(); reserveRows();
  if (prevF && ui.battle) animateTokens(prevF, ui.battle.frames[k]); else clearTimeout(ui.tokT);
  if (broken.length) breakShields(broken);
  if (prevSvg && !oldSvg) fadeArrows(prevSvg, $('view-play').querySelector('.stage'));
  if (ui.battle && k === ui.battle.frames.length - 1 && !ui.battle.chimed){
    ui.battle.chimed = true;
    const w = G.over ? G.winner : ui.battle.result.w, big = !!G.over;
    setTimeout(() => { if (w === 0) sfx.win(big); else if (w === 1) sfx.lose(big); else sfx.draw(); }, 120);
  }
  if (oldSvg){
    const st = $('view-play').querySelector('.stage'), fresh = st && st.querySelector('.arrows:not(.out)');
    oldSvg.classList.add('quiet');
    for (const p of oldSvg.querySelectorAll('.arw')){ p.style.animation = 'none'; p.style.strokeDashoffset = '0'; }
    for (const l of oldSvg.querySelectorAll('.arl')){ l.style.animation = 'none'; l.style.opacity = '1'; }
    if (st){ if (fresh) fresh.remove(); st.appendChild(oldSvg); }
    // once units finish moving, quietly point the arrows at where things ended up
    clearTimeout(ui.arrowFix); ui.arrowFix = setTimeout(() => { if (ui.battle && ui.frame === k && !ui.animT) drawArrows(stepArrows(), 'quiet'); }, 760);
  }
  ui.arrowsFor = null;
  if (!from.size) return;
  for (const el of $('view-play').querySelectorAll('.line [data-uid]')){
    const r0 = from.get(el.dataset.uid); if (!r0 || !el.animate) continue;
    const r1 = el.getBoundingClientRect(), dx = r0.left - r1.left, dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    const toGrave = el.tagName === 'B' && !r0.wasB;   // just died (a name already in the list only slides)
    if (toGrave && r0.clone){ deathFly(r0, el); continue; }
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
  // a card that went back under its deck and is out of sight now slides in there (alone in its deck it's the revealed
  // card instead, and the FLIP above already moved it)
  for (const m of under){
    const r0 = from.get(m.u);
    if (r0 && r0.clone && !$('view-play').querySelector(`.line .card[data-uid="${m.u}"]:not(.mini)`)) deckFly(r0, +m.u.split('-')[0]);
  }
}
