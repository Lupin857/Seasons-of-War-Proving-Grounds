/* ===================== BATTLE VIEW ===================== */
// Armaments, Training and Shields look like extra cards tucked behind the unit, each poking out a little further.
// Yours fan up and to the right; the AI's (across the table) fan down and to the left.
const TOKS = {cp:{c:'--muted', i:'', n:'extra copy', fill:'var(--bg)'}, arm:{c:'--or', i:'', n:'Armament'}, tr:{c:'--azure', i:'', n:'Training'}, sh:{c:'--muted', i:'', n:'Shield'}};
const POKE = {x:9, y:7, mx:6};
function tokenList(u){ return [...Array(Math.min(3, u.cp || 0)).fill('cp'), ...Array(u.arm || 0).fill('arm'), ...Array(u.tr || 0).fill('tr'), ...Array(u.sh || 0).fill('sh')]; }
const pokeCap = () => (window.matchMedia && matchMedia('(max-width:640px)').matches) ? 3 : POKE.mx;
function pokeParts(t, side, hit, art){
  if (art) return pokeArt(t, side, hit, art);
  const shAt = t.map((k, j) => k === 'sh' ? j : -1).filter(j => j >= 0), hitSet = new Set(hit ? shAt.slice(-hit) : []);
  const sgn = side === 1 ? -1 : 1, sh = [`inset 0 3px 0 var(${side === 1 ? '--gules' : '--azure'})`];
  t.forEach((k, j) => { const dx = `calc(var(--px) * ${sgn * (j + 1)})`, dy = `calc(var(--py) * ${-sgn * (j + 1)})`, c = `var(${TOKS[k].c})`;
    sh.push(`${dx} ${dy} 0 -1px ${TOKS[k].fill || `color-mix(in srgb, ${c} 22%, var(--surface))`}`, `${dx} ${dy} 0 0 ${c}`); });
  const n = t.length, mx = `calc(var(--px) * ${n})`, my = `calc(var(--py) * ${n})`;
  const room = side === 1 ? {marginLeft:mx, marginBottom:my} : {marginRight:mx, marginTop:my};
  const html = t.map((k, j) => `<span class="pk${hitSet.has(j) ? ' shhit' : ''}" data-k="${k}" style="--j:${j};color:var(${TOKS[k].c})" aria-hidden="true">${tokIcon(k)}</span>`).join('');
  return {shadow:sh.join(','), room, html};
}
// pokeArt (the stack of copies, gear and tokens behind an art card) is in js/board-settings.js.
const kebab = k => k.startsWith('--') ? k : k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
function applyRoom(el, r){ for (const k of ['margin-left', 'margin-right', 'margin-top', 'margin-bottom', '--rt', '--rl']) el.style.removeProperty(k); for (const [k, v] of Object.entries(r || {})) el.style.setProperty(kebab(k), v); }
const roomCSS = r => Object.entries(r).map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';');
function pokeStyle(u, side, hit, art){
  const t = art ? tokenList(u) : tokenList(u).slice(0, pokeCap());   // art cards group their stack into bands, so nothing is cut
  if (!t.length && !(art && art.gear) && !art) return {style:'', html:'', title:''};   // gear alone still tucks a card behind
  const pp = pokeParts(t, side, hit, art), n = t.length;
  const room = art ? roomCSS(pp.room) : side === 1 ? `margin-left:calc(var(--px) * ${n});margin-bottom:calc(var(--py) * ${n})` : `margin-right:calc(var(--px) * ${n});margin-top:calc(var(--py) * ${n})`;
  const html = pp.html, sh = [pp.shadow];
  const all = tokenList(u), cnt = k => all.filter(x => x === k).length;
  const title = [u.cp ? `${u.cp} extra cop${u.cp > 1 ? 'ies' : 'y'}` : '', ...['arm', 'tr', 'sh'].filter(cnt).map(k => `${cnt(k)} ${TOKS[k].n}${cnt(k) > 1 ? 's' : ''}`)].filter(Boolean).join(', ');
  return {style:`box-shadow:${sh.join(',')};${room}`, html, title};
}
const artInfo = u => ({gear:u.gear || null, gearArt:u.gear && typeof artURL === 'function' ? artURL(u.gear, 'b') : null});
// A battle card. Board settings adds its card-stock and light layers once js/board-settings.js has loaded.
function cardHTML(u, side, mode){
  const h = cardHTML0.apply(this, arguments);
  return h && typeof labCardLayers === 'function' ? labCardLayers(h) : h;
}
function cardHTML0(u, side, mode){
  if (!u) return '';
  const hp = Math.max(0, Math.min(100, (u.pow - u.dmg) / Math.max(1, u.pow) * 100));
  const hit = SHHIT ? SHHIT.get(`${side}-${u.uid}`) || 0 : 0;
  if (hit) u = {...u, sh:(u.sh || 0) + hit};
  const nmA = u.name.replace(/^Jester → .*/, 'Jester'), aurlA = typeof artURL === 'function' ? (DEFS[nmA] && DEFS[nmA].token ? artURL('Recruit', 'u') : artURL(nmA, 'u')) : null;
  const pk = pokeStyle(u, VS(side), hit, aurlA ? {...artInfo(u), unitArt:aurlA} : null);
  const vr = [u.van ? 'V' : '', u.rear ? 'R' : '', u.sw ? '✶' : ''].filter(Boolean).join(' ');
  const ttl = [pk.title, u.sw ? 'Second Wind attached' : ''].filter(Boolean).join(' · ');
  const nm0 = u.name.replace(/^Jester → .*/, 'Jester'), aurl = typeof artURL === 'function' ? (DEFS[nm0] && DEFS[nm0].token ? artURL('Recruit', 'u') : artURL(nm0, 'u')) : null;
  const base = DEFS[nm0] && DEFS[nm0].p ? DEFS[nm0].p[Math.min(u.lvl, DEFS[nm0].p.length) - 1] : u.pow;
  const live = aurl ? `<span class="mbn" title="Power now"><img src="art/banner.png" alt="" draggable="false"><b class="${u.pow > base ? 'up' : u.pow < base ? 'down' : ''}">${u.pow}</b></span>` : '';
  return `<div class="card ${mode}${pk.html ? ' poked' : ''}${aurl ? ' hasart' : ''}" data-side="${VS(side)}" data-uid="${side}-${u.uid}" data-name="${esc(u.name)}" data-lvl="${u.lvl}" style="${pk.style}${aurl ? `;background-image:url('${aurl}')` : ''}"${ttl ? ` title="${esc(ttl)}"` : ''}>${aurl ? '<span class="cartbg" aria-hidden="true"></span>' : ''}${pk.html}${live}
    <span class="ctop"><span class="cn">${esc(u.name)}</span><span class="cpw"><b title="Power">${u.pow}</b><i>Lv ${u.lvl}${vr ? ' · ' + vr : ''}</i></span></span>
    ${zhChip(u.name)}${u.gear && !aurl ? `<span class="cgear" title="${esc(u.gear)}: ${esc((BDEFS[u.gear] || {}).t || '')}">${esc(u.gear)}</span>` : ''}
    <span class="hprow">${aurl ? `<span class="lvt">LV ${u.lvl}</span>` : ''}<span class="hp"><i style="width:${hp}%"></i></span><span class="hpn${u.dmg ? ' hurt' : ''}"><b>${Math.max(0, u.pow - u.dmg)}</b>/${u.pow}<span class="hpu"> hp</span></span></span></div>`;
}
const graveHTML = (g, side) => `<div class="grave">${g.length ? g.map(u => `<b data-uid="${side}-${u.uid}"${u.gear ? ` title="${esc(u.gear)} stays attached"` : ''}>${esc(u.name)}${u.gear ? ` <i>(${esc(u.gear)})</i>` : ''}</b>`).join('') : 'Empty'}</div>`;
// the rest of a deck, as a slightly splayed stack of name strips (the next card up sits nearest the revealed one)
function miniHTML(u, rside, k){
  const side = VS(rside);
  const tk = (u.arm ? ` +${u.arm} Arm` : '') + (u.tr ? ` +${u.tr} Train` : '') + (u.sh ? ` ${u.sh} Shield` : '');
  // tokens show as thin card edges sticking out past the strip
  const t = tokenList(u).slice(0, 4), sgn = side === 1 ? -1 : 1;
  // in the stack, each token is a small card tucked behind the strip, peeking out to the side
  const edges = t.map((x, j) => { const dx = sgn * 6 * (j + 1), c = `var(${TOKS[x].c})`;
    return `${dx}px ${-sgn * 2 * (j + 1)}px 0 -1px ${TOKS[x].fill || `color-mix(in srgb, ${c} 25%, var(--surface))`},${dx}px ${-sgn * 2 * (j + 1)}px 0 0 ${c}`; }).join(',');
  const st = `--k:${k}` + (edges ? `;box-shadow:inset 0 3px 0 var(${side === 1 ? '--gules' : '--azure'}),${edges};margin-${side === 1 ? 'left' : 'right'}:${6 * t.length}px` : '');
  return `<div class="card mini" data-side="${side}" data-uid="${rside}-${u.uid}" data-name="${esc(u.name)}" data-lvl="${u.lvl}" style="${st}" title="${esc(u.name)} · ${u.pow} power · Lv ${u.lvl}${tk}${u.gear ? ' · ' + esc(u.gear) : ''}${u.sw ? ' · Second Wind' : ''}"><span class="cn">${esc(u.name)}${u.gear ? ` <span class="mgear">· ${esc(u.gear)}</span>` : ''}${u.sw ? ' ✶' : ''}</span><span class="mp">${u.pow}</span></div>`;
}
// The table: the AI sits across from you (its row is rotated: graveyard, charge, then its deck on the far side),
// you sit at the bottom (your deck, charge, graveyard). Charges meet in the middle.
// Shields used up in a step: the frame's snapshot no longer has them, but the step still draws them (the blocked arrow
// points at the shield), and they break when you move to the next step. Keyed by unit id, the count blocked.
let SHHIT = null;
function shieldHits(f){
  const m = new Map();
  for (const l of (f && f.lines) || []) if (l.to && !l.tok && l.amt === 0) m.set(l.to, (m.get(l.to) || 0) + 1);
  return m;
}
function lineHTML(f, names){
  SHHIT = shieldHits(f);
  try{ return lineHTML0(f, names); } finally { SHHIT = null; }
}
function lineHTML0(f, names){
  const [a, b] = f.snap;
  const deckZone = (sd, side) => {
    const rev = sd.deck[0], rest = sd.deck.slice(1), items = [];
    // battle miracles waiting in the deck sit in the stack where they were placed (ahead of a unit, or after the last)
    const sp = n => k => `<div class="card mini spell" data-side="${VS(side)}" style="--k:${k}" title="${esc(n)}: ${esc(batFx(n))}"><span class="cn">✶ ${esc(n)}</span></div>`;
    for (const n of (rev && rev.sp) || []) items.push(sp(n));
    for (const u of rest){ for (const n of u.sp || []) items.push(sp(n)); items.push(k => miniHTML(u, side, k)); }
    for (const n of sd.tail || []) items.push(sp(n));
    const nsp = items.length - rest.length;
    const stack = items.length ? `<div class="stack">${(VS(side) === 1 ? items.slice().reverse() : items).map((f, k) => f(VS(side) === 1 ? items.length - 1 - k : k)).join('')}</div>` : '';
    const top = rev ? cardHTML(rev, side, 'revealed') : '<div class="slot">Deck empty</div>';
    const wait = (nsp ? ` · ✶ ${nsp}` : '') + (sd.sil ? ' · next reveal silenced' : '');
    return `<div class="tz deckz"><span class="zl">${names[side]} revealed · ${sd.deck.length} in deck${wait}</span><div class="tzc">${VS(side) === 1 ? stack + top : top + stack}</div></div>`;
  };
  const mz = labMatZones();   // phone battle on the mat: one-word labels, no boxes, no ⚔︎ (board-settings.js)
  const chargeZone = (sd, side) => `<div class="tz chz"><span class="zl">${mz ? '<span class="labw">Charge</span>' : `${names[side]} charge`}</span><div class="tzc"><div class="charge"><div class="slot labempty labslot${sd.charge ? ' under' : ''}" aria-hidden="${sd.charge ? 'true' : 'false'}"${mz ? ' aria-label="Charge: empty"' : ''}>${mz ? '' : 'Empty'}</div>${cardHTML(sd.charge, side, 'charging') || ''}</div></div></div>`;
  const graveZone = (sd, side) => `<div class="tz grz"><span class="zl">${names[side]} graveyard</span><div class="tzc">${graveHTML(sd.grave, side)}</div></div>`;
  const cityRow = side => {
    const pl = G && G.players && G.players[side]; if (!pl || mz) return '';   // (on the mat the Caravans are in the fixed bars: below)
    const fire = new Set(['Trebuchet', 'Training Yard', 'Infirmary', 'Muster Hall']);
    const items = Object.keys(pl.city).filter(n => pl.city[n] > 0 && BDEFS[n]).sort((a, b) => (fire.has(b) - fire.has(a)) || (a === 'Field') - (b === 'Field'));
    // each building is drawn like the battle's unit cards (same square, name and level, then its chip), with extra
    // copies for its level tucked behind it the way a unit's copies are; each Field is its own card. Tap one to read it.
    const card = ([n, c]) => {
      const lvN = BDEFS[n].lv.length, lv = Math.min(c, lvN), extra = extraCopies(n, 'b', c);
      const t = Array(Math.min(3, extra)).fill('cp'), pp = t.length ? pokeParts(t, VS(side)) : null;
      const room = !pp ? '' : VS(side) === 1 ? `margin-left:calc(var(--px) * ${t.length});margin-bottom:calc(var(--py) * ${t.length})` : `margin-right:calc(var(--px) * ${t.length});margin-top:calc(var(--py) * ${t.length})`;
      const curl = typeof artURL === 'function' ? artURL(n, 'b') : null;
      const cst = [pp ? `box-shadow:${pp.shadow};${room}` : '', curl ? `background-image:url('${curl.replace(/'/g, '%27')}')` : ''].filter(Boolean).join(';');   // (Dowser's Bathhouse: a ' would end the url)
      return `<div class="card citycard${pp ? ' poked' : ''}${curl ? ' hasart' : ''}" data-side="${VS(side)}" data-kind="b" data-b="${esc(n)}" data-name="${esc(n)}" data-lvl="${lv}" role="button" tabindex="0" title="${esc(n)}${extra ? ` · ${extra} extra cop${extra > 1 ? 'ies' : 'y'}` : ''}"${cst ? ` style="${cst}"` : ''}>${pp ? pp.html : ''}
        <span class="ctop"><span class="cn">${esc(n)}</span><span class="cpw">${lvN > 1 ? `<i>Lv ${lv}</i>` : ''}</span></span>
        ${zhChip(n)}</div>`;
    };
    const cards = asCards(items.map(n => [n, pl.city[n]]), 'b').map(card).join('');
    return `<div class="city s${VS(side)}" data-side="${VS(side)}"><span class="zl">${names[side]} city</span><div class="citycards">${cards || '<span class="note">No buildings</span>'}</div></div>`;
  };
  const T = VS(1), M = VS(0), sn = [a, b];   // T: the side drawn across the top; M: the side drawn along the bottom
  return `<div class="linewrap"><div class="line table${mz ? ' matz' : ''}">
    ${cityRow(T)}
    <div class="trow s1">${labGrave(sn[T], T, names)}${chargeZone(sn[T], T)}${labDeck(sn[T], T, names)}</div>
    <div class="clash" aria-hidden="true">⚔︎</div>
    <div class="trow s0">${labDeck(sn[M], M, names)}${chargeZone(sn[M], M)}${labGrave(sn[M], M, names)}</div>
    ${cityRow(M)}
  </div></div>${mz && G && G.players && typeof matSeatHTML === 'function' ? `<div class="osbars">${matSeatHTML(T, 'battle')}${matSeatHTML(M, 'battle')}</div>` : ''}`;
}
function chronHTML(frames, at){
  return `<div class="chron">${frames.map((f, k) => [f, k]).filter(([, k]) => k <= at).reverse().map(([f, k]) => `<div class="fr ${k===at?'on':''} ${k>at?'future':''}" data-act="fr" data-k="${k}" tabindex="0"><h3>${esc(f.label)}</h3><ul>${
    f.lines.map(l => `<li class="${VS(l.side)===0?'a':VS(l.side)===1?'b':''}">${esc(l.t)}</li>`).join('') || '<li>Nothing happens.</li>'}</ul></div>`).join('')}</div>`;
}

/* ===================== PLAY ===================== */
let G = null, ui = {};
let aiTimer = null;
// opp: {rating, rated, placement} from the start screen, or null for today's full-strength AI, unrated
/* Pass and play: two people share one device. The Play screen shows the game from one player's seat:
   in the shop, whoever's turn it is; in Mobilize, each player in turn behind a hand-off screen so deck orders stay secret. */
const PP = () => !!(G && G.pp);
// Online, each player sees the game from their own seat: you are always drawn in blue along the bottom (the left of the
// scoreboard), even when you joined second. VS maps a real side (0 host, 1 guest) to the side it is drawn as.
const VS = s => (G && G.net && NET && NET.seat === 1 && (s === 0 || s === 1)) ? 1 - s : s;
function seat(){ if (G && G.net && NET) return NET.seat; if (!PP()) return 0; if (G.phase === 'shop') return cur(G); if (G.phase === 'mobilize') return ui.mobSeat || 0; return 0; }
const nm = i => G.labels[i];
const poss = i => PP() ? `${esc(nm(i))}'s` : i === 0 ? 'Your' : 'AI';
// Starting a game: stop the last game's timers and give the screen a clean state. Pass-and-play and online
// use the per-seat fields (each seat's draft, whose hand-off it is); they're simply unused against the AI.
function stopTimers(){ if (aiTimer){ clearTimeout(aiTimer); aiTimer = null; } if (ui.animT) clearTimeout(ui.animT); }
const freshUI = extra => ({battle:null, frame:0, draft:null, lastDraft:null, lastDrafts:[null, null], drafts:[null, null], mobSeat:0, handoff:null, err:'', start:false, ...extra});
const newRoll = () => ({you:null, ai:null, rolling:false, tie:false, first:null});
function newPassPlay(names){
  stopTimers();
  const su = setupForGame();
  G = newGame({genomes:[null, null], labels:names, target:gameTarget(), su});
  G.suLines = suIsDefault() ? null : suLines(su, gameTarget(), {mir:MIRACLES_ON, bmir:MIRACLES_ON && BATTLE_MIR_ON, rf:REFILL_ON}, names);
  G.pp = true; G.opp = null;
  ui = freshUI({roll:newRoll()});
  renderPlay();
}
