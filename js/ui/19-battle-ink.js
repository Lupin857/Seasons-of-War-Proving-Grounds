/* Battle ink: the battle's effects drawn as calligraphy-style ink strokes, and each ability note joined to its card by a
   line of brush dabs (designed in the "Oasis battle lab: ink helpers" artifact; numbers in INK below).
   - A stroke runs from the effect's source to its target on the table, under the cards, and grows as the step plays.
     Its weight follows the damage, a blot with the number spreads as the stroke passes its middle, and one pressed
     wedge at the tip shows the direction. Attacks bow out (yours to the left, the opponent's to the right, mirrored);
     effects to a unit on the same side loop past the row; strokes between the same two cards take nested lanes.
   - An Overrun spill (the engine's via) carries on from the tip of the stroke into the unit it spilled through.
   - A save in the next step (Field Medic and the like) is pointed at in the step before, after that step's effects.
   - Abilities play one after another (INK.pace); one that the engine logs after the step's first defeat waits until
     the defeated cards have landed in the graveyard, and so do the cards it brings in.
   - When you move on, the last step's ink soaks away. Back, Skip and jumps show a step's ink at once; 2× halves it all.
   Everything is redrawn from the live board while it moves; settled ink is left alone (redrawing costs).
   Reads the step the game is starting from ui.inkStart (set by stepForward). */
(function(){
  const INK = {
    draw: 450, ease: 'easeOut', pace: .6, noteDelay: .6, dabTime: 380, slideTime: 280, fade: 450, soakBlur: 3,
    baseW: 2.4, perDmg: 1.55, tokW: 3.2, bow: 120, swell: .78, ink: .42, rough: 1.4, wedge: 1, blot: 1, num: 1, dabGap: 9, dabSize: 1,
  };
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- helpers
  const bez = (Q, t) => { const [a, b, c, d] = Q, u = 1 - t; return {x: u*u*u*a.x + 3*u*u*t*b.x + 3*u*t*t*c.x + t*t*t*d.x, y: u*u*u*a.y + 3*u*u*t*b.y + 3*u*t*t*c.y + t*t*t*d.y}; };
  const G = (x, c, w) => Math.exp(-Math.pow((x - c) / w, 2));
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const EASE = {linear: x => x, easeOut: x => 1 - Math.pow(1 - x, 3), easeInOut: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2};
  const toHex = c => { c = String(c).trim(); if (c[0] === '#') return c.length === 4 ? '#' + [...c.slice(1)].map(h => h + h).join('') : c; const m = c.match(/\d+(\.\d+)?/g) || [0, 0, 0]; return '#' + m.slice(0, 3).map(v => (+v | 0).toString(16).padStart(2, '0')).join(''); };
  const shade = (c, k) => { const n = parseInt(toHex(c).slice(1), 16), m = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return `rgb(${m(n >> 16)},${m(n >> 8 & 255)},${m(n & 255)})`; };
  const rng = seed => { let s = (seed % 2147483647) || 7; return () => (s = s * 16807 % 2147483647) / 2147483647; };
  const hash = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 2147483647; return h; };
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const TOKART = {arm: 'art/Might.webp', tr: 'art/Training.webp', sh: 'art/Shield.webp', rec: 'art/Drifter.webp'};
  const speed = () => autoFast() ? 2 : 1;
  const durOf = () => INK.draw;

  // ---------- what a step does: its effects (with their ability group and start time) and its notes
  function stepPlan(k){
    const f = ui.battle.frames[k], gs = abGroups(f);
    const pairs = new Map();
    for (const l of f.lines){
      if (!l.to || l.tok === 'ret' || l.from === l.to || l.drop) continue;   // (discarded tokens break on the card instead)
      const key = `${l.from || 'b:' + (l.ab ? l.ab.n : '')}>${l.to}>${l.tok || ''}`, p = pairs.get(key);
      if (p){ p.amt += l.tok ? (l.n || 1) : (l.amt || 0); continue; }
      const by = l.from ? +String(l.from).split('-')[0] : +(l.by != null ? l.by : (l.ab ? l.ab.s : 0));
      pairs.set(key, {from: l.from, to: l.to, tok: l.tok || null, amt: l.tok ? (l.n || 1) : (l.amt || 0), by,
        attack: !!l.atk && !!l.from && String(l.from)[0] !== String(l.to)[0],   // the engine marks attack hits (atk)
        g: gs.findIndex(g => g.lines.includes(l)), ab: l.ab || null, via: l.via || null});
    }
    const fx = [...pairs.values()], lanes = {};
    // Overrun: the stroke into the unit it spilled through stays (as it was drawn last step), and the spill carries on
    // from that stroke's tip into the next unit
    if (k > 0) for (const e of fx.filter(e => e.via)){
      const was = stepPlan(k - 1).fx.find(x => x.from === e.from && x.to === e.via);
      if (was && !fx.some(x => x.keep && x.to === e.via && x.from === e.from)) fx.push({...was, g: e.g, keep: true, lane: 0, via: null});
      e.tipOf = was ? {attack: was.attack, by: was.by} : null;
    }
    // strokes between the same two cards take nested lanes (the two sides' attacks already bow to opposite sides)
    for (const e of fx){ if (e.keep) continue; const key = [e.via || e.from || 'b', e.to].sort().join('|') + (e.attack ? '|atk' + e.by : ''); e.lane = lanes[key] = (lanes[key] == null ? 0 : lanes[key] + 1); }
    // the groups play in order: plain attacks first (together), then each ability, spaced by the pacing
    const order = [-1, ...gs.map((g, i) => i)], start = {};
    let t = 0;
    for (const g of order){
      start[g] = t;
      const mine = fx.filter(e => e.g === g); if (!mine.length && g !== -1 && !gs[g]) continue;
      const d = mine.length ? INK.draw : 0;
      const note = g >= 0 ? INK.draw * INK.noteDelay + INK.dabTime * .6 + INK.slideTime : 0;
      if (mine.length || g >= 0) t += (d + note) * INK.pace;
    }
    fx.forEach(e => e.t0 = start[e.g] || 0);
    // a save coming in the next step (Field Medic and the like): its source points at the unit it will save, after this
    // step's own effects; the unit moves in the next step, with the defeats (the engine records the save there)
    const nf = ui.battle.frames[k + 1];
    if (nf) for (const l of nf.lines) for (const m of (l.mv || [])) if (m.k === 'save' && (l.from || l.ab) && !fx.some(e => e.save && e.to === m.u)){
      const by = l.from ? +String(l.from).split('-')[0] : +(l.by != null ? l.by : (l.ab ? l.ab.s : 0));
      fx.push({from: l.from || null, to: m.u, tok: null, amt: 0, by, attack: false, g: -3, ab: l.ab || null, save: true, lane: 0, t0: t});
    }
    const notes = gs.map((g, i) => ({g, i, t0: (start[i] || 0) + (fx.some(e => e.g === i) ? INK.draw * INK.noteDelay : 0)}));
    // defeats first: an ability the engine logs after this step's first defeat (On My Death, a gear moving on, a unit
    // reacting to a defeat) waits until the defeated units have landed in the graveyard, and so do the cards it brings in
    const defeats = new Set(), firstDefeat = f.lines.findIndex(l => (l.mv || []).some(m => m.k === 'defeat'));
    for (const l of f.lines) for (const m of (l.mv || [])) if (m.k === 'defeat') defeats.add(m.u);
    const waits = new Set(), arrivals = new Set();
    if (firstDefeat >= 0) gs.forEach((g, i) => { const at = Math.min(...g.lines.map(l => f.lines.indexOf(l)).filter(x => x >= 0)); if (at > firstDefeat){ waits.add(i); for (const l of g.lines) for (const m of (l.mv || [])) if (m.from === 'new') arrivals.add(m.u); } });
    if (waits.size){
      const base = Math.min(...[...waits].map(i => start[i] || 0));
      fx.forEach(e => { if (waits.has(e.g)) e.rel = e.t0 - base; });
      notes.forEach(n => { if (waits.has(n.i)) n.rel = n.t0 - base; });
    }
    return {k, fx, notes, defeats, waits, arrivals, release: null};
  }

  // ---------- geometry
  // where an element sits in the table's own coordinates (its offsets up to the table, so a lunge or a shake, which are
  // transforms, doesn't bend the ink, and the ink tilts with the table)
  function localIn(el, line){
    let x = 0, y = 0, n = el;
    while (n && n !== line){ x += n.offsetLeft || 0; y += n.offsetTop || 0; n = n.offsetParent; }
    if (n !== line) return {l: 0, t: 0, w: 0, h: 0, cx: 0, cy: 0};
    const w = el.offsetWidth, h = el.offsetHeight; return {l: x, t: y, w, h, cx: x + w / 2, cy: y + h / 2};
  }
  function layoutSig(el, line){ const r = localIn(el, line); return `${r.l},${r.t},${r.w},${r.h}`; }
  function rectIn(el, sr){ const r = el.getBoundingClientRect(); return {l: r.left - sr.left, t: r.top - sr.top, w: r.width, h: r.height, cx: r.left - sr.left + r.width / 2, cy: r.top - sr.top + r.height / 2}; }
  function findCard(stage, id){ return id && (stage.querySelector(`.card[data-uid="${id}"]`) || stage.querySelector(`.grave [data-uid="${id}"]`) || stage.querySelector(`[data-uid="${id}"]`)); }
  function srcEl(stage, e){ return e.from ? findCard(stage, e.from) : (e.ab ? abSrcEl(stage, e.ab) : null); }

  // one effect's path: a hidden run from inside its source, out of the source's edge, then the visible curve, ending in
  // a short straight run square to the target that the wedge sits on
  function pathOf(e, stage, line){
    const R = el => localIn(el, line);
    const se = e.via && e.tipOf ? findCard(stage, e.via) : srcEl(stage, e), te = findCard(stage, e.to); if (!se || !te) return null;
    const fr = R(se), tr = R(te); if (!fr.w || !tr.w) return null;
    let s0, E, Q, tipEnd;
    const RUN = 18;
    if (e.via && e.tipOf){
      // from the tip of the stroke into the unit it spilled through, along that edge, into the next unit's same edge
      const vr = fr, up = VS(e.tipOf.by) === 0, xs = e.tipOf.attack ? (up ? .22 : .78) : .5;
      const edge = r => up ? r.t + r.h + (e.tipOf.attack ? 4 : 3) : r.t - (e.tipOf.attack ? 4 : 3), out = up ? 1 : -1;
      E = {x: vr.l + vr.w * xs, y: edge(vr)}; s0 = {x: E.x, y: E.y - out * 14};   // (the hidden start runs back under the old tip)
      tipEnd = {x: tr.l + tr.w * xs, y: edge(tr)};
      const lift = out * (30 + (e.lane || 0) * 22), ty1 = tipEnd.y + out * RUN;
      Q = [E, {x: E.x, y: E.y + lift}, {x: tipEnd.x, y: ty1 + lift * .6}, {x: tipEnd.x, y: ty1}];
    } else if (e.attack){
      // from under the attacker's Might chevron, out of its edge facing the enemy, bowing out (mirrored for each side)
      const up = VS(e.by) === 0, mb = se.querySelector && se.querySelector('.mbn'), ch = mb ? R(mb) : fr, xs = up ? .22 : .78, bx = up ? -1 : 1;
      s0 = {x: ch.l + ch.w * .45, y: ch.t + ch.h * .5};
      E = {x: fr.l + fr.w * xs, y: up ? fr.t : fr.t + fr.h};
      tipEnd = {x: tr.l + tr.w * xs, y: up ? tr.t + tr.h + 4 : tr.t - 4};
      const end = {x: tipEnd.x, y: tipEnd.y - Math.sign(tipEnd.y - E.y) * RUN}, gy = end.y - E.y;
      const M = {x: (E.x + end.x) / 2 + bx * (INK.bow * .3 + (e.lane || 0) * 22), y: (E.y + end.y) / 2}, h = gy * .3;
      Q = {two: [[E, {x: E.x, y: E.y + h}, {x: M.x, y: M.y - h}, M], [M, {x: M.x, y: M.y + h}, {x: end.x, y: end.y - h}, end]]};
    } else if (e.from && String(e.from)[0] === String(e.to)[0]){
      // to a unit on the same side: a loop over the tops (the enemy's row) or under the bottoms (yours)
      const up = VS(e.by) === 1, fy = up ? fr.t : fr.t + fr.h, ty = up ? tr.t - 3 : tr.t + tr.h + 3, ln = e.lane || 0, lift = (up ? -1 : 1) * (46 + ln * 26);
      const away = tr.cx > fr.cx ? -1 : 1, fx0 = fr.cx + away * ln * 12, tx0 = tr.cx - away * ln * 12;   // outer lanes start and land further apart
      s0 = {x: fx0, y: fr.cy}; E = {x: fx0, y: fy};
      tipEnd = {x: tx0, y: ty}; const ty1 = ty + Math.sign(lift) * RUN;
      Q = [E, {x: fx0, y: fy + lift}, {x: tx0, y: ty1 + lift * .6}, {x: tx0, y: ty1}];
    } else {
      // across the table: out of the edge facing the target, square to it, then into the target's near edge
      const down = tr.cy > fr.cy, ln = e.lane || 0, side = tr.cx > fr.cx ? 1 : -1;
      s0 = {x: fr.cx, y: fr.cy}; E = {x: fr.cx + fr.w * .12 * side - ln * 10 * side, y: down ? fr.t + fr.h : fr.t};
      tipEnd = {x: tr.cx - ln * 10 * side, y: down ? tr.t - 3 : tr.t + tr.h + 3};
      const end = {x: tipEnd.x, y: tipEnd.y - (down ? 1 : -1) * RUN}, gy = end.y - E.y, bowL = -side * ln * 26;   // outer lanes bow further out
      Q = ln ? {two: (() => { const M = {x: (E.x + end.x) / 2 + bowL, y: (E.y + end.y) / 2}, h = gy * .25; return [[E, {x: E.x, y: E.y + h}, {x: M.x, y: M.y - h}, M], [M, {x: M.x, y: M.y + h}, {x: end.x, y: end.y - h}, end]]; })()}
             : [E, {x: E.x, y: E.y + gy * .45}, {x: end.x, y: end.y - gy * .45}, end];
    }
    const bend = Q.two ? (u => u < .5 ? bez(Q.two[0], u * 2) : bez(Q.two[1], u * 2 - 1)) : (u => bez(Q, u));
    let bl = 0, bp = bend(0); for (let n = 1; n <= 40; n++){ const q = bend(n / 40); bl += Math.hypot(q.x - bp.x, q.y - bp.y); bp = q; }
    const ce = bend(1), fa = RUN / (bl + RUN);   // the straight run's share of the stroke, by length
    const curve = u => u < 1 - fa ? bend(u / (1 - fa)) : {x: ce.x + (tipEnd.x - ce.x) * (u - 1 + fa) / fa, y: ce.y + (tipEnd.y - ce.y) * (u - 1 + fa) / fa};
    const HID = .18, pt = t => t < HID ? {x: s0.x + (E.x - s0.x) * t / HID, y: s0.y + (E.y - s0.y) * t / HID} : curve((t - HID) / (1 - HID));
    const nrm = t => { const a = pt(Math.max(0, t - .004)), b = pt(Math.min(1, t + .004)), dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return {x: -dy / l, y: dx / l, tx: dx / l, ty: dy / l}; };
    let len = 0, prev = pt(HID); for (let n = 1; n <= 40; n++){ const q = pt(HID + (1 - HID) * n / 40); len += Math.hypot(q.x - prev.x, q.y - prev.y); prev = q; }
    return {pt, nrm, HID, len};
  }

  // a note's dabs: out of its card's top (enemy) or bottom (yours), clear of the row, then across to where the note
  // rests; measured live, so they follow the unit and the note as they move
  function dabsOf(nt, stage, sr){
    const box = stage.querySelector(`.abbox[data-abi="${nt.i}"]`); if (!box) return null;
    const g = nt.g, el = (abIsSave(g) && bDeckEl(g.ab.s)) || abSrcEl(stage, g.ab); if (!el) return {box};
    const cr = rectIn(el, sr), br = rectIn(box, sr); if (!cr.w || !br.w) return {box};
    const dx = box._inkDX || 0; br.l -= dx; br.cx -= dx;   // the note's resting place, not where its slide has got to
    const top = br.cy < cr.cy, left = br.cx < cr.cx;
    const E = {x: cr.cx + (left ? -.2 : .2) * cr.w, y: top ? cr.t : cr.t + cr.h}, end = {x: left ? br.l + br.w + 2 : br.l - 2, y: br.cy};
    const rise = Math.abs(end.y - E.y) * .6 * (top ? -1 : 1), run = Math.max(40, Math.abs(end.x - E.x) * .55), Q = [E, {x: E.x, y: E.y + rise}, {x: end.x + (left ? run : -run), y: end.y}, end];
    const pts = [{...Q[0], d: 0}]; let prev = Q[0], acc = 0;
    for (let i = 1; i <= 200; i++){ const q = bez(Q, i / 200); acc += Math.hypot(q.x - prev.x, q.y - prev.y); pts.push({...q, d: acc}); prev = q; }
    const at = d => { let i = pts.findIndex(p => p.d >= d); if (i < 1) i = 1; const a = pts[i - 1], b = pts[i], k = (d - a.d) / ((b.d - a.d) || 1); return {x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, a: Math.atan2(b.y - a.y, b.x - a.x)}; };
    const r = rng(nt.i * 31 + 5), dabs = [];
    for (let d = 4; d < acc - 4; d += INK.dabGap) dabs.push({...at(d), f: d / acc, j: (r() - .5) * .5});
    dabs.forEach((q, i) => q.at = (i + .5) / dabs.length);   // an even rhythm
    return {box, dabs, end, left, side: g.ab.s, src: cr};
  }

  // ---------- state
  let layer = null, under = null, plan = null, t0 = 0, curK = -1, curBattle = null, lastFrame = -1, ghostN = 0;
  let lastInk = null, lastHtml = '', lastInkU = null, lastHtmlU = '', lastSig = '', lastDabSig = '', strokeCache = null;
  const ghosts = [], touched = new Set();
  function restoreNotes(){ touched.forEach(b => { b.style.opacity = ''; b.style.transform = ''; b.style.animation = ''; b._inkDX = 0; }); touched.clear(); }
  // moving on: the last step's ink soaks away (the game may already have redrawn the board, and the layers with it)
  function soakAway(stage){
    const line = stage.querySelector('.line.table');
    if (lastInkU && line) ghostOf(lastInkU, line, true); lastInkU = null; if (under) under.innerHTML = ''; lastHtmlU = '';
    if (lastInk) ghostOf(lastInk, stage, false); lastInk = null; if (layer) layer.innerHTML = ''; lastHtml = '';
  }
  function ghostOf(ink, host, first){
    const ghost = document.createElementNS(NS, 'svg'); ghost.setAttribute('class', 'inkghost'); ghost.setAttribute('data-keep', ''); ghost.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('width', ink.w); ghost.setAttribute('height', ink.h);
    // the copy needs ids of its own: shared ids resolve to the live layer's (emptied) masks and the copy would vanish
    const tag = 'gh' + (++ghostN) + '-'; ghost.innerHTML = ink.html.replace(/id="/g, 'id="' + tag).replace(/url\(#/g, 'url(#' + tag);
    if (first) host.insertBefore(ghost, host.firstChild); else host.appendChild(ghost);
    // faded by its own clock (not a CSS transition or Web Animation, which a redraw could cut short)
    ghosts.push({el: ghost, t0: performance.now(), d: reduceMotion() ? 0 : INK.fade / speed()});
  }
  function layerIn(host, cls, first){
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', cls); s.setAttribute('data-keep', ''); s.setAttribute('aria-hidden', 'true');   // (a redraw leaves it alone)
    if (first) host.insertBefore(s, host.firstChild); else host.appendChild(s);
    return s;
  }

  function tick(now){
    requestAnimationFrame(tick);
    for (let i = ghosts.length - 1; i >= 0; i--){ const g = ghosts[i], u = g.d ? Math.min(1, (now - g.t0) / g.d) : 1;
      g.el.style.opacity = 1 - u; g.el.style.filter = `blur(${(INK.soakBlur * u).toFixed(2)}px)`;
      if (u >= 1){ g.el.remove(); ghosts.splice(i, 1); } }
    const stage = ui.battle && !$('view-play').hidden ? $('view-play').querySelector('.stage') : null;
    const line = stage && stage.querySelector('.line.table');
    // no battle on screen: the layers go (they survive redraws on purpose, so the shop's redraw could otherwise take one in)
    if (!stage || !line){ for (const x of [layer, under]) if (x) x.remove(); layer = under = null; lastHtml = lastHtmlU = ''; lastInk = lastInkU = null; if (!ui.battle){ curK = -1; ui.inkStart = null; } return; }
    // the strokes lie on the table under the cards: their own layer inside the (tilted) table, before its rows; the
    // dabs go over everything, on the stage (the notes are outside the table)
    if (!under || under.parentNode !== line){ under = layerIn(line, 'inkunder', true); lastHtmlU = ''; lastSig = ''; }
    if (!layer || layer.parentNode !== stage){ layer = layerIn(stage, 'inklayer', false); lastHtml = ''; lastSig = ''; }
    under.setAttribute('width', line.offsetWidth); under.setAttribute('height', line.offsetHeight);
    if (ui.frame < lastFrame || (ui.inkStart != null && ui.frame >= ui.inkStart)) ui.inkStart = null;   // Back, or the step has landed
    lastFrame = ui.frame;
    const k = ui.inkStart != null ? ui.inkStart : ui.frame;
    if (k !== curK || ui.battle !== curBattle){
      const forward = ui.battle === curBattle && k === curK + 1 && !reduceMotion();
      soakAway(stage); restoreNotes();
      curK = k; curBattle = ui.battle; plan = stepPlan(k); lastSig = ''; strokeCache = null;
      t0 = forward ? now : -1e9;   // a step forward plays; Back, Skip and jumps show it at once
    }
    const sr = stage.getBoundingClientRect();
    layer.setAttribute('width', Math.round(sr.width)); layer.setAttribute('height', Math.round(sr.height));
    const T = (now - t0) * speed();
    if (plan.waits.size && plan.release == null){
      const flying = [...document.querySelectorAll('.card.deathfly')].filter(g => plan.defeats.has(g.dataset.fly)).some(g => { const a = g.getAnimations()[0]; if (!a || !a.effect) return false; const ct = a.effect.getComputedTiming(); return ct.progress == null ? ct.activeDuration > 0 && (a.currentTime || 0) < (a.effect.getTiming().delay || 0) + ct.activeDuration * .85 : ct.progress < .85; });
      if (t0 < 0 || (ui.frame >= plan.k && !flying)) plan.release = t0 < 0 ? -1e9 : T;
    }
    const startOf = o => o.rel != null ? (plan.release == null ? Infinity : plan.release + o.rel) : o.t0;
    // cards brought in by a waiting ability stay hidden until it plays, then fade in
    for (const u of plan.arrivals){ const el = stage.querySelector(`.card[data-uid="${u}"]`); if (!el) continue; touched.add(el);
      el.style.opacity = plan.release == null ? 0 : Math.min(1, Math.max(0, (T - plan.release) / 200)); }
    // nothing moving and nothing changed: skip the redraw; when only the dabs' ends moved, redraw just the dabs
    const settleAt = Math.max(0, ...plan.fx.map(e => Math.max(startOf(e), e.seen != null && t0 > 0 ? e.seen : 0) + durOf(e)), ...plan.notes.map(n => startOf(n) + INK.dabTime + INK.slideTime)) + 300;
    const sig = (plan.watch || (plan.watch = [...new Set([...plan.fx.flatMap(e => [e.from, e.to, e.via]), ...plan.notes.map(n => n.g.ab.u)].filter(Boolean))])).map(u => { const el = findCard(stage, u); return el ? layoutSig(el, line) : '-'; }).join(';') + '|' + line.offsetWidth + 'x' + line.offsetHeight;
    const dabSig = plan.notes.map(nt => { const b = stage.querySelector(`.abbox[data-abi="${nt.i}"]`), el = b && ((abIsSave(nt.g) && bDeckEl(nt.g.ab.s)) || abSrcEl(stage, nt.g.ab));
      if (!b || !el) return '-'; const r = el.getBoundingClientRect(), q = b.getBoundingClientRect(); return [r.left - sr.left, r.top - sr.top, r.width, q.left - sr.left, q.top - sr.top].map(v => Math.round(v)).join(','); }).join(';');
    const settled = t0 < 0 || T > settleAt;
    if (settled && sig === lastSig && dabSig === lastDabSig) return;
    const reuse = settled && sig === lastSig && strokeCache;
    lastSig = sig; lastDabSig = dabSig;
    const C = {you: cssVar('--azure'), ai: cssVar('--gules'), arm: cssVar('--or'), tr: cssVar('--azure'), sh: cssVar('--muted'), rec: cssVar('--ok')};
    let defs = `<filter id="ink-edge" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="${INK.rough}"/></filter>`;
    let out = '', outU = '';
    if (reuse) outU = strokeCache;
    else plan.fx.forEach((e, i) => {
      const e0 = e.keep ? -1e9 : startOf(e); if (T < e0) return;
      const pa = pathOf(e, stage, line); if (!pa) return;
      if (e.seen == null) e.seen = T;   // a card that wasn't there yet when the step began: its stroke starts as it appears
      const raw = e.keep ? 1 : (T - Math.max(e0, t0 > 0 ? e.seen : -1e9)) / durOf(e); if (raw <= 0) return;
      const p = EASE[INK.ease](Math.min(1, raw)), tEnd = pa.HID + (1 - pa.HID) * p, front = .035;
      const col = e.tok ? (C[e.tok] || C.you) : (VS(e.by) === 0 ? C.you : C.ai);
      const ink = shade(col, -INK.ink), dark = shade(col, -.68);
      const base = e.tok ? INK.tokW : INK.baseW + INK.perDmg * Math.max(1, e.amt);
      const W = t => { const u = Math.max(0, (t - pa.HID) / (1 - pa.HID)), tail = u < .66 ? 1 : Math.pow(1 - (u - .66) / .34, 1.3); return base * (.38 + INK.swell * G(u, .46, .27)) * tail + (u < .98 ? .3 : 0); };
      const ph1 = (hash(e.from + e.to) % 997) / 50, rough = (t, side) => 1 + INK.rough * .022 * (Math.sin(t * 311 + ph1 + side * 2.1) + .7 * Math.sin(t * 757 + ph1 * 1.7 + side));
      const ribbon = () => { const A = [], B = [], N = 80; for (let n = 0; n <= N; n++){ const t = pa.HID + (tEnd - pa.HID) * n / N, q = pa.pt(t), m = pa.nrm(t), cap = p < 1 ? Math.sqrt(Math.max(0, Math.min(1, (tEnd - t) / front))) : 1, w = W(t) * cap; const wa = w * rough(t, 0), wb = w * rough(t, 1); A.push(`${(q.x + m.x * wa).toFixed(1)},${(q.y + m.y * wa).toFixed(1)}`); B.unshift(`${(q.x - m.x * wb).toFixed(1)},${(q.y - m.y * wb).toFixed(1)}`); } return A.concat(B).join(' '); };
      const id = 'ik' + i, r = rng(hash(`${plan.k}:${e.from}:${e.to}:${e.tok}`));
      let solid = `<polygon points="${ribbon()}" fill="${ink}"/>`, text = '';
      const tm = pa.HID + (1 - pa.HID) * .5, mq = pa.pt(tm), mn = pa.nrm(tm);
      if (!e.tok && !e.save){
        // the blot spreads as the stroke passes over the ground it covers; the number fades in once it has spread
        const r0 = (7 + 2 * Math.max(.6, e.amt)) * INK.blot, du = r0 * 1.25 / Math.max(1, pa.len), u = (tEnd - pa.HID) / (1 - pa.HID), b = smooth(.5 - du, .5 + du, u);
        if (b > 0){
          const ang = Math.atan2(mn.ty, mn.tx), bp = [], rr = r0 * (.35 + .65 * b), ph = r() * 6, ps = r() * 6;
          for (let n = 0; n < 36; n++){ const a = n / 36 * Math.PI * 2, rad = rr * (1 + .16 * Math.sin(3 * a + ph) + .09 * Math.sin(5 * a + ps)), qx = Math.cos(a) * rad * 1.22, qy = Math.sin(a) * rad; bp.push(`${(mq.x + qx * Math.cos(ang) - qy * Math.sin(ang)).toFixed(1)},${(mq.y + qx * Math.sin(ang) + qy * Math.cos(ang)).toFixed(1)}`); }
          solid += `<polygon points="${bp.join(' ')}" fill="${ink}" opacity="${Math.min(1, b * 1.4)}"/>`;
          const nb = smooth(.55, 1, b);
          if (nb > 0) text += `<text x="${mq.x}" y="${mq.y + 7}" text-anchor="middle" font-family="Marcellus, serif" font-size="${(18 + e.amt) * INK.num}" fill="#fff" stroke="${dark}" stroke-width="3" paint-order="stroke" stroke-linejoin="round" opacity="${nb}">${e.amt}</text>`;
        }
      }
      // one pressed wedge at the tip, square to the stroke, as it arrives
      const wk = smooth(.94, 1, p);
      if (wk > 0){
        const tip = pa.pt(1), tb = pa.pt(.996), ta = Math.atan2(tip.y - tb.y, tip.x - tb.x), bw = Math.max(2.2, base * .8) * INK.wedge * wk, L2 = 9 * INK.wedge * wk + bw * 1.4, wv = 3.8 * INK.wedge * wk + bw * .7;
        const bx = tip.x - Math.cos(ta) * L2, by = tip.y - Math.sin(ta) * L2, px = -Math.sin(ta), py = Math.cos(ta), fx = tip.x + Math.cos(ta) * 2, fy = tip.y + Math.sin(ta) * 2;
        solid += `<path d="M${fx},${fy} Q${bx + px * wv * .4},${by + py * wv * .4} ${bx + px * wv},${by + py * wv} Q${bx + Math.cos(ta) * 4},${by + Math.sin(ta) * 4} ${bx - px * wv},${by - py * wv} Q${bx - px * wv * .4},${by - py * wv * .4} ${fx},${fy}Z" fill="${ink}"/>`;
      }
      if (e.tok && p >= 1){   // a token: its picture and the count beside the stroke's middle
        const lx = mq.x + mn.x * 16, ly = mq.y + mn.y * 16;
        text += (TOKART[e.tok] ? `<clipPath id="c${id}"><circle cx="${lx}" cy="${ly}" r="10"/></clipPath><circle cx="${lx}" cy="${ly}" r="11.5" fill="${shade(col, -.4)}"/><image href="${TOKART[e.tok]}" x="${lx - 10}" y="${ly - 10}" width="20" height="20" preserveAspectRatio="xMidYMid slice" clip-path="url(#c${id})"/>` : '') +
                `<text x="${lx + 14}" y="${ly + 5}" font-family="Marcellus, serif" font-size="15" fill="#fff" stroke="${dark}" stroke-width="3" paint-order="stroke">+${e.amt}</text>`;
      }
      outU += `<g opacity=".93">${solid}</g>${text}`;
    });
    strokeCache = outU;
    // notes: dabs pressed one by one out to the note; the note slides in from its corner as they arrive
    for (const nt of plan.notes){
      const d = dabsOf(nt, stage, sr); if (!d) continue;
      const n0 = startOf(nt), box = d.box, raw = (T - n0) / INK.dabTime;
      if (t0 > 0){ touched.add(box); box.style.animation = 'none';
        const sl = Math.min(1, Math.max(0, (T - n0 - INK.dabTime * .6) / INK.slideTime)), ee = EASE.easeOut(sl), dir = d.dabs ? (d.left ? -1 : 1) : -1;
        box._inkDX = dir * 40 * (1 - ee); box.style.opacity = ee; box.style.transform = `translateX(${box._inkDX}px)`; }
      if (!d.dabs || raw <= 0) continue;
      const ink = shade(VS(d.side) === 0 ? C.you : C.ai, -.5); let g = '';
      // pressed on one at a time, like dotting by hand: each dab pops in quickly, a touch larger, then settles
      const pop = 70 / Math.max(60, INK.dabTime);
      for (const q of d.dabs){ const u = (raw - q.at) / pop; if (u <= 0) continue; const kk = u >= 1 ? 1 : (u < .6 ? 1.18 * u / .6 : 1.18 - .18 * (u - .6) / .4); const rr = (2.4 - 1.1 * q.f + q.j) * INK.dabSize * kk;
        g += `<ellipse cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" rx="${(rr * 1.35).toFixed(2)}" ry="${rr.toFixed(2)}" transform="rotate(${(q.a * 57.3).toFixed(0)} ${q.x.toFixed(1)} ${q.y.toFixed(1)})" fill="${ink}" filter="url(#ink-edge)"/>`; }
      if (raw >= 1) g += `<circle cx="${d.end.x}" cy="${d.end.y}" r="${3.4 * INK.dabSize}" fill="${ink}" filter="url(#ink-edge)"/>`;
      const s = d.src;   // (none over the card itself)
      defs += `<mask id="nm${nt.i}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="${sr.width + 100}" height="${sr.height + 100}"><rect x="-50" y="-50" width="${sr.width + 100}" height="${sr.height + 100}" fill="#fff"/><rect x="${s.l + 1}" y="${s.t + 1}" width="${Math.max(0, s.w - 2)}" height="${Math.max(0, s.h - 2)}" rx="8" fill="#000"/></mask>`;
      out += `<g mask="url(#nm${nt.i})" style="mix-blend-mode:multiply">${g}</g>`;
    }
    const html = `<defs>${defs}</defs>${out}`;
    if (html !== lastHtml){ layer.innerHTML = html; lastHtml = html; }
    lastInk = out ? {html, w: layer.getAttribute('width'), h: layer.getAttribute('height')} : null;
    if (outU !== lastHtmlU){ under.innerHTML = outU; lastHtmlU = outU; }
    lastInkU = outU ? {html: outU, w: under.getAttribute('width'), h: under.getAttribute('height')} : null;
  }
  requestAnimationFrame(tick);
})();
