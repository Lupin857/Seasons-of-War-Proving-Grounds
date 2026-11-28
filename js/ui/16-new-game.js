/* ===================== NEW GAME: MODE + SETUP =====================
   The Play tab's start screen is two steps, like a strategy game's skirmish lobby: pick a mode (the AI, online or pass
   and play), then a setup screen with the opponent and the game's rules. The rules start at Default (rated games use
   Default); any change makes the game Custom, which is never rated. The last setup is kept in this browser. */
let startMode = null;   // null = the mode tiles; 'ai' | 'net' | 'pp' = that mode's setup screen
const SU_KEY = 'oasis-setup-v1';
const SU_LIM = {water:[0, 20], fields:[0, 10], drift:[0, 6], inc:[0, 10], buys:[1, 6], fps:[0, 6], deckCap:[1, 10], city:[1, 10], uDisp:[3, 7], bDisp:[3, 7], catchup:[0, 5], tgt:[2, 10]};
const SU_PL = ['water', 'fields', 'drift', 'inc', 'buys', 'fps'];
const SU_SH = ['deckCap', 'city', 'uDisp', 'bDisp', 'catchup'];
// the setup screen's state: suDefault()'s fields, plus tgt (a custom points-to-win, or null for 3/4/5) and split
function suFresh(){ return {...suDefault(), tgt:null, split:false}; }
let SU = (() => {
  const d = suFresh(), s = LS.get(SU_KEY);
  if (!s || typeof s !== 'object') return d;
  const out = {...d, tgt:Number.isFinite(s.tgt) ? s.tgt : null, split:!!s.split};
  for (const k of SU_SH) if (Number.isFinite(s[k])) out[k] = s[k];
  out.pl = d.pl.map((q, i) => { const sq = (s.pl && s.pl[i]) || {}, o = {...q}; for (const k of SU_PL) if (Number.isFinite(sq[k])) o[k] = sq[k]; return o; });
  return out;
})();
const suSave = () => LS.set(SU_KEY, SU);
// Default: RULES' setup (so a Balance Lab change to the starting rules moves Default with it), miracles off, refills on
function suIsDefault(){
  const d = suDefault();
  if (SU.tgt != null || MIRACLES_ON || !REFILL_ON) return false;
  for (const k of SU_SH) if (SU[k] !== d[k]) return false;
  return SU.pl.every((q, i) => SU_PL.every(k => q[k] === d.pl[i][k]));
}
const gameTarget = () => SU.tgt != null ? SU.tgt : LEN;
const setupForGame = () => clone({deckCap:SU.deckCap, city:SU.city, uDisp:SU.uDisp, bDisp:SU.bDisp, catchup:SU.catchup, pl:SU.split ? SU.pl : [SU.pl[0], SU.pl[0]]});
// One line per way a game's setup differs from Default (names: each side's label). Used by the in-game chip and
// the online lobby.
function suLines(su, target, cards, names){
  const d = suDefault(), L = [];
  if (target != null && !LENS.includes(target)) L.push(`First to ${target} points`);
  const PLN = {water:['Extra starting water', v => `+$${v}`], fields:['Starting Moisture Harvesters', v => v], drift:['Drifters for the first battle', v => v],
    inc:['Base income', v => `$${v}`], buys:['Buys per shop', v => v], fps:['Harvester buys per shop', v => v]};
  for (const k of SU_PL){
    const a = su.pl[0][k], b = su.pl[1][k], dv = d.pl[0][k], f = PLN[k][1];
    if (a === b){ if (a !== dv) L.push(`${PLN[k][0]}: ${f(a)} (Default ${f(dv)})`); }
    else L.push(`${PLN[k][0]}: ${esc(names[0])} ${f(a)}, ${esc(names[1])} ${f(b)} (Default ${f(dv)})`);
  }
  const SHN = {deckCap:'Units limit', city:'Caravan slots', uDisp:'Units in the shop', bDisp:'Caravan cards in the shop'};
  for (const k in SHN) if (su[k] !== d[k]) L.push(`${SHN[k]}: ${su[k]} (Default ${d[k]})`);
  if (su.catchup > 0) L.push(`Catch-up: the player behind on points gets +$${su.catchup} each shop`);
  if (cards){
    if (cards.mir) L.push(`Miracles in the shop decks${cards.bmir ? ', with battle miracles' : ''}`);
    if (!cards.rf) L.push('No automatic shop refills');
  }
  return L;
}
// packages: one player's starting cards and economy, as quick-fill chips (two built in, more saved from the setup)
const PKG_KEY = 'oasis-pkgs-v1';
const PKG_BUILTIN = () => { const d = suDefault().pl[0]; return [{...d, b:1}, {...d, fields:Math.max(0, d.fields - 1), drift:1, b:1}]; };
const pkgList = () => PKG_BUILTIN().concat((LS.get(PKG_KEY) || []).filter(q => q && typeof q === 'object'));
const pkgSame = (a, b) => SU_PL.every(k => a[k] === b[k]);
function pkgName(q){
  const d = suDefault().pl[0], r1 = q.inc + q.fields + q.water, bits = [`${pkgSame(q, d) ? 'Default: ' : ''}$${r1} in round 1`];
  if (q.fields) bits.push(`${q.fields} ${plural(q.fields, 'Harvester')}`);
  if (q.drift) bits.push(`${q.drift} ${plural(q.drift, 'Drifter')}`);
  if (q.inc !== d.inc) bits.push(`$${q.inc} income`);
  if (q.buys !== d.buys) bits.push(`${q.buys} buys`);
  if (q.fps !== d.fps) bits.push(`${q.fps} Harvester ${plural(q.fps, 'buy')}`);
  return bits.join(' · ');
}

function startHTML(){
  const inGame = G && !G.over;
  const resign = inGame && G.opp && G.opp.rated && !G.ratedDone;
  const back = inGame ? `<button type="button" data-act="st-back">Back to your game</button>` : '';
  if (!startMode) return modesHTML(back, resign);
  const title = {ai:'Play the AI', net:'Play online', pp:'Pass and play'}[startMode];
  return `<div class="panel startp setupp">
      <div class="row suhead"><button type="button" class="subk" data-act="st-modes" aria-label="Back to game modes">‹ Modes</button><h2>${title}</h2><span class="grow"></span>${back}</div>
      ${startMode === 'ai' ? aiSetupHTML(resign) : startMode === 'net' ? netSetupHTML() : ppSetupHTML(resign)}
    </div>`;
}
function modesHTML(back, resign){
  const placing = ME.rating == null;
  const tile = (m, h, p, extra) => `<button type="button" class="mode" data-act="st-mode" data-mode="${m}"><span class="mh">${h}</span><span class="note">${p}</span>${extra ? `<span class="mx">${extra}</span>` : ''}</button>`;
  return `<div class="panel startp modesp">
      <div class="row"><h2>New game</h2><span class="grow"></span>${back}</div>
      <div class="modes">
        ${tile('ai', 'Play the AI', 'Rated games move you up the ladder. Pick how strong the AI is.', placing ? 'Unrated · placement games' : `Your rating ${ME.rating}`)}
        ${tile('net', 'Play online', 'A friend on their own device. Send them a room code.', NET ? `In room ${esc(NET.code)}` : '')}
        ${tile('pp', 'Pass and play', 'Two people, one device, with a cover screen for secret deck orders.', '')}
      </div>
      <p class="note">Each mode lets you set up the game first: starting water, Moisture Harvesters, Drifters, income, limits and more.</p>
      ${resign ? `<p class="err">Starting a new game ends your current rated game as a loss.</p>` : ''}
    </div>`;
}
// the rules part of every setup screen. names: the two sides' labels (for the per-player columns)
function rulesHTML(names, opts){
  opts = opts || {};
  const d = suDefault(), dflt = suIsDefault(), split = SU.split;
  const step = (path, v, lim, lbl) => `<span class="sustep"><button type="button" data-su-step="${path}" data-d="-1" aria-label="Less ${lbl}" ${v <= lim[0] ? 'disabled' : ''}>−</button><input type="number" inputmode="numeric" data-su="${path}" value="${v}" min="${lim[0]}" max="${lim[1]}" aria-label="${lbl}"><button type="button" data-su-step="${path}" data-d="1" aria-label="More ${lbl}" ${v >= lim[1] ? 'disabled' : ''}>+</button></span>`;
  const chg = (v, dv) => v !== dv ? ' chg' : '';
  const plRow = (k, lbl, hint) => {
    const dv = d.pl[0][k];
    const cells = split ? [0, 1].map(i => `<div class="sucell${chg(SU.pl[i][k], dv)}">${step(`pl.${i}.${k}`, SU.pl[i][k], SU_LIM[k], `${lbl} for ${esc(names[i])}`)}</div>`).join('')
      : `<div class="sucell${chg(SU.pl[0][k], dv)}">${step(`pl.0.${k}`, SU.pl[0][k], SU_LIM[k], lbl)}</div>`;
    return `<div class="surow${split ? ' two' : ''}"><span class="sul">${lbl}${hint ? `<span class="note">${hint}</span>` : ''}</span>${cells}</div>`;
  };
  const shRow = (k, lbl, hint) => `<div class="surow"><span class="sul">${lbl}${hint ? `<span class="note">${hint}</span>` : ''}</span><div class="sucell${chg(SU[k], d[k])}">${step(k, SU[k], SU_LIM[k], lbl)}</div></div>`;
  const colHead = split ? `<div class="surow two such"><span></span>${names.map((n, i) => `<span class="eyebrow s${i}">${esc(n)}</span>`).join('')}</div>` : '';
  const pk = pkgList(), saved = LS.get(PKG_KEY) || [];
  const pkgRow = i => `<div class="pkgs">${pk.map((q, j) => `<span class="pkg${pkgSame(q, SU.pl[i]) ? ' on' : ''}"><button type="button" data-su-pkg="${j}" data-i="${i}">${esc(pkgName(q))}</button>${q.b ? '' : `<button type="button" class="pkx" data-su-pkdel="${j - PKG_BUILTIN().length}" aria-label="Remove this package">×</button>`}</span>`).join('')}${pk.some(q => pkgSame(q, SU.pl[i])) ? '' : `<button type="button" class="pkadd" data-su-pksave="${i}">+ Save as package</button>`}</div>`;
  const pts = SU.tgt != null ? 'c' : LEN;
  return `<div class="surules">
      <div class="row subar"><span class="eyebrow">Rules</span>${dflt ? `<span class="subadge ok">Default${opts.rated ? ' · rated' : ''}</span>` : `<span class="subadge cu">Custom${opts.rated ? ' · unrated' : ''}</span>`}
        ${dflt ? '' : `<button type="button" data-act="st-su-reset">Reset to Default</button>`}<span class="grow"></span>
        <label class="suswitch"><input type="checkbox" data-su-split ${split ? 'checked' : ''}> Set each player separately</label></div>
      <div class="sugrid">
        <fieldset class="sufs"><legend>Game</legend>
          <div class="surow"><span class="sul">Points to win</span><div class="seg" role="group" aria-label="Points to win">${LENS.map(L => `<button type="button" data-su-pts="${L}" aria-pressed="${pts === L}" ${job || calState.busy ? 'disabled' : ''}>${L}</button>`).join('')}<button type="button" data-su-pts="c" aria-pressed="${pts === 'c'}" ${job || calState.busy ? 'disabled' : ''}>Custom</button></div></div>
          ${SU.tgt != null ? `<div class="surow"><span class="sul">Custom points<span class="note">Never rated</span></span><div class="sucell chg">${step('tgt', SU.tgt, SU_LIM.tgt, 'Custom points to win')}</div></div>` : ''}
          ${shRow('catchup', 'Catch-up water', SU.catchup ? 'Behind on points: +$ each shop' : 'Off. The player behind on points gets this much extra each shop')}
        </fieldset>
        <fieldset class="sufs suwide"><legend>Starting cards &amp; economy</legend>
          ${colHead}
          ${split ? `<div class="surow two"><span class="sul">Packages<span class="note">Tap to fill in</span></span>${pkgRow(0)}${pkgRow(1)}</div>` : `<div class="surow pkr"><span class="sul">Packages</span>${pkgRow(0)}</div>`}
          ${plRow('water', 'Extra starting water', 'On top of round 1 income')}
          ${plRow('fields', 'Moisture Harvesters', 'Owned at the start, +$1 income each')}
          ${plRow('drift', 'Drifters', 'In hand for the first battle')}
          ${plRow('inc', 'Base income', 'Water every shop')}
          ${plRow('buys', 'Buys per shop', '')}
          ${plRow('fps', 'Harvester buys per shop', '')}
          <p class="note r1">Round 1 water: ${split ? names.map((n, i) => `${esc(n)} $${SU.pl[i].inc + SU.pl[i].fields + SU.pl[i].water}`).join(', ') : `$${SU.pl[0].inc + SU.pl[0].fields + SU.pl[0].water} each`}.</p>
        </fieldset>
        <fieldset class="sufs"><legend>Limits</legend>
          ${shRow('deckCap', 'Units limit', 'Different units in a deck')}
          ${shRow('city', 'Caravan slots', 'Harvesters use one each')}
          ${shRow('uDisp', 'Units in the shop', '')}
          ${shRow('bDisp', 'Caravan cards in the shop', '')}
        </fieldset>
        <fieldset class="sufs"><legend>Card sets</legend>${mirToggleHTML()}</fieldset>
      </div>
    </div>`;
}
const goLabel = R => { const br = bracketOf(R); return suIsDefault() ? `Start ${ME.rating == null ? 'placement' : 'rated'} game vs ${br.name} AI (${R})` : `Start unrated game vs ${br.name} AI (${R})`; };
function aiSetupHTML(resign){
  const L = ladder(), [lo, hi] = ratingRange();
  const placing = ME.rating == null, mine = placing ? null : ME.rating;
  if (oppPick == null){ const saved = LS.get(lenKey('sow-pick-v1', LEN)); oppPick = Number.isFinite(saved) ? saved : placing ? lo : mine; }   // new players start against Novice
  oppPick = Math.max(lo, Math.min(hi, oppPick));
  const R = oppPick, br = bracketOf(R), myBr = mine != null ? bracketOf(mine) : null, dflt = suIsDefault();
  const calBox = calState.busy
    ? `<div class="finalbox"><p><b>Calibrating the ladder…</b> Each AI level plays the next two up, and the ratings come from the results.</p><div id="calprog">${calProgHTML()}</div></div>`
    : !CAL ? `<div class="finalbox"><p><b>The rating ladder isn't calibrated yet.</b> Until it is, you can play today's full-strength AI, unrated.</p>${calBtn('Calibrate now')}</div>`
    : calStale() ? `<div class="finalbox"><p><b>Your card numbers changed since the ladder was calibrated</b> (${esc(fmtWhen(CAL.at))}), so the AI ratings may be a little off.</p>${calBtn('Recalibrate')}</div>` : '';
  const strip = L.length ? `<div class="brackets">${BRACKETS.map((name, k) => {
      const w = (hi - lo) / 5, a = Math.round(lo + k * w), b = Math.round(lo + (k + 1) * w), mid = (a + b) / 2;
      const below = k ? `${pct(expected(mid, mid - w))} vs ${BRACKETS[k - 1]}` : `${pct(expected(mid, 400))} vs random buyer`;
      return `<div class="bk${k === br.k ? ' on' : ''}"><b>${name}</b><span class="mono">${a}–${b}</span><span class="note">wins ${below}</span>${myBr && myBr.k === k ? '<span class="you">You</span>' : ''}</div>`;
    }).join('')}</div>` : '';
  const measured = CAL ? `<details><summary class="note">How the ladder was measured</summary>
        <p class="note">Each rung is a thinking budget: whether it looks past this battle, how many times it plays out the rest of the game, how many test battles it runs, and how far ahead it looks in the shop. Weaker rungs see less; the short-sighted ones also blur their estimates a little. A rating between rungs plays with a budget part-way between them. Rungs played each other ${calGames(CAL).toLocaleString()} games${CAL.at ? ` (${esc(fmtWhen(CAL.at))})` : ''}${CAL.quick ? ', a quick calibration, so the ratings are rough until a full run' : ''}; ratings come from those results, with the random buyer pinned at 400. Rated games use the AI brain from that run, so training it further won't move these numbers.</p>
        <div class="tablewrap"><table><thead><tr><th>Rung</th><th class="num">Rating</th></tr></thead><tbody>${(CAL.rungs || []).map(r => `<tr><td>${esc(r.label)}</td><td class="num">${Number.isFinite(r.elo) ? r.elo : '—'}</td></tr>`).join('')}</tbody></table></div>
        <div class="tablewrap"><table><thead><tr><th>Match-up</th><th class="num">Games</th><th class="num">Score</th></tr></thead><tbody>${(CAL.results || []).filter(x => CAL.rungs && CAL.rungs[x.a] && CAL.rungs[x.b]).map(x => `<tr><td>${esc(CAL.rungs[x.a].label)} vs ${esc(CAL.rungs[x.b].label)}</td><td class="num">${(x.wa || 0) + (x.wb || 0) + (x.d || 0)}</td><td class="num">${x.wa || 0}–${x.wb || 0}${x.d ? `–${x.d}` : ''}</td></tr>`).join('')}</tbody></table></div>
        ${!calState.busy ? `<div class="row"><span class="grow"></span>${calBtn('Recalibrate')}</div>` : ''}
      </details>` : '';
  const recent = !placing && ME.history.length ? `<details><summary class="note">Your recent games</summary><div class="list" style="margin-top:6px">${ME.history.slice(0, 12).map(h => `<div class="li"><span class="nm" style="font-weight:400">${h.s === 1 ? 'Win' : h.s === 0 ? (h.forfeit ? 'Resigned' : 'Loss') : 'Draw'} vs ${h.opp}</span><span class="mono">${h.placement ? 'placement' : `${h.before} → ${h.after}`}</span></div>`).join('')}</div></details>` : '';
  const flag = calBox && calState.busy ? calBox : '';
  return `
      <div class="suopp">
        <div class="me compact">${placing
          ? `<span class="eyebrow">Your rating · first to ${LEN}</span><span class="big">Unrated</span><span class="note">Placement game ${ME.placement.length + 1} of ${PLACEMENT_GAMES}: your first ${PLACEMENT_GAMES} rated games set your rating.</span>`
          : `<span class="eyebrow">Your rating · first to ${LEN}</span><span class="big">${mine}</span><span class="note">${myBr.name} · ${ME.games} rated game${ME.games === 1 ? '' : 's'}${ME.history[0] && !ME.history[0].placement ? ` · last game ${ME.history[0].after - ME.history[0].before >= 0 ? '+' : '−'}${Math.abs(ME.history[0].after - ME.history[0].before)}` : ''}</span>`}</div>
        ${L.length ? `
        <div class="pick">
          <label for="st-r" class="eyebrow">Opponent</label>
          <div class="row"><span class="pickr">${R}</span><span class="pickn">${br.name}</span>${!placing ? `<span class="note" id="st-exp">${pct(expected(mine, R))} expected win chance for you</span>` : ''}</div>
          <input type="range" id="st-r" min="${lo}" max="${lo + Math.ceil((hi - lo) / 10) * 10}" step="10" value="${R}" ${calState.busy ? 'disabled' : ''} aria-describedby="st-lvl">
          <span class="note" id="st-lvl">${esc(levelText(R))}</span>
        </div>` : ''}
        ${flag}
      </div>
      ${rulesHTML(['You', 'AI'], {rated:true})}
      ${resign ? `<p class="err">Starting a new game ends your current rated game as a loss.</p>` : ''}
      ${!dflt ? `<p class="note">Custom rules: the game isn't rated. The AI thinks through the new rules on its own; its rating was measured on Default.</p>` : ''}
      <div class="row sugo">
        ${L.length ? `<button type="button" class="primary" data-act="st-go" ${calState.busy ? 'disabled' : ''}>${resign && ui.resignArm === true ? 'Click again to resign and start' : goLabel(R)}</button>` : ''}
        <button type="button" data-act="st-free" ${calState.busy ? 'disabled' : ''}>${resign && ui.resignArm === 'free' ? 'Click again to resign and start' : `Unrated game vs full-strength AI (first to ${gameTarget()})`}</button>
      </div>
      <details class="ladder"><summary class="note">Ladder details</summary>
        ${calBox && !calState.busy ? calBox : ''}${strip}${measured}${matchesHTML()}${recent}
      </details>`;
}
function ppSetupHTML(resign){
  const nm = (LS.get('sow-pp-names') || []);
  const names = [nm[0] || 'Player 1', nm[1] || 'Player 2'];
  return `<p class="note">Two people, one device. You take turns in the shop, then pass the device behind a cover screen to set your secret deck orders. Not rated, and it doesn't change the AI or the card stats.</p>
      <div class="row ppnames">
        <label class="ppn s0"><span class="eyebrow">Player 1</span><input type="text" id="pp-n0" maxlength="16" value="${esc(names[0])}"></label>
        <label class="ppn s1"><span class="eyebrow">Player 2</span><input type="text" id="pp-n1" maxlength="16" value="${esc(names[1])}"></label>
      </div>
      ${rulesHTML(names)}
      <div class="row sugo"><button type="button" class="primary" data-act="st-pp">${resign && ui.resignArm === 'pp' ? 'Click again to resign and start' : `Start pass-and-play game (first to ${gameTarget()})`}</button></div>`;
}
function netSetupHTML(){
  const saved = LS.get('sow-net'), nameV = esc(LS.get('sow-net-name') || (LS.get('sow-pp-names') || [])[0] || '');
  if (NET) return `<div class="row"><span class="note">You're in room <b class="mono">${esc(NET.code)}</b>.</span><button type="button" data-act="st-net-back">Back to it</button><button type="button" data-act="st-net-leave">Leave room</button></div>`;
  return `<p class="note">Play a friend on their own device. Not rated, and it doesn't change the AI or the card stats.</p>
      ${ui.netErr ? `<p class="err">${esc(ui.netErr)}</p>` : ''}
      <div class="row ppnames"><label class="ppn s0"><span class="eyebrow">Your name</span><input type="text" id="net-name" ${URL_ROOM ? 'autofocus ' : ''}maxlength="16" value="${nameV}" placeholder="Name"></label></div>
      <div class="sujoin">
        <span class="eyebrow">Join a friend's room</span>
        <div class="row"><input type="text" id="net-code" maxlength="6" placeholder="Room code" value="${esc(URL_ROOM)}" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:9em"><button type="button" ${URL_ROOM ? 'class="primary" ' : ''}data-act="st-net-join">Join</button><span class="note">You'll see your friend's rules before you start.</span></div>
        ${saved && saved.code ? `<div class="row"><button type="button" data-act="st-net-rejoin">Rejoin room ${esc(saved.code)}</button><span class="note">Your moves there are saved on this device.</span></div>` : ''}
      </div>
      <span class="eyebrow">Or host a room</span>
      ${rulesHTML(['You', 'Friend'])}
      <div class="row sugo"><button type="button" class="primary" data-act="st-net-host">Create a room (first to ${gameTarget()})</button></div>
      <details><summary class="note">How does it connect?</summary><p class="note">No accounts needed. Your two browsers connect directly to each other; the free PeerJS service only introduces them. If your networks block a direct link, the game goes through a relay server instead. Keep the page open while you play.</p></details>`;
}
// setup screen controls
function suSet(path, v){
  const k = path.split('.').pop(), lim = SU_LIM[k];
  v = Math.round(+v); if (!Number.isFinite(v)) return;
  v = Math.max(lim[0], Math.min(lim[1], v));
  if (path === 'tgt'){ SU.tgt = v; const n = Math.max(LENS[0], Math.min(LENS[LENS.length - 1], v)); suSave(); if (n !== LEN) setLen(n); return; }
  if (path.startsWith('pl.')){ const i = +path.split('.')[1]; SU.pl[i][k] = v; if (!SU.split) SU.pl[1 - i][k] = v; }
  else SU[k] = v;
  suSave();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-su-step],[data-su-pts],[data-su-pkg],[data-su-pkdel],[data-su-pksave]'); if (!t || t.disabled) return;
  if (t.dataset.suStep){ const p = t.dataset.suStep, cur = p.split('.').reduce((o, k) => o[k], SU); suSet(p, cur + (+t.dataset.d)); }
  else if (t.dataset.suPts){
    if (t.dataset.suPts === 'c'){ if (SU.tgt == null) SU.tgt = LEN; }
    else { SU.tgt = null; suSave(); setLen(+t.dataset.suPts); }
    suSave();
  }
  else if (t.dataset.suPkg != null){
    const q = pkgList()[+t.dataset.suPkg], i = +t.dataset.i; if (!q) return;
    for (const k of SU_PL){ SU.pl[i][k] = q[k]; if (!SU.split) SU.pl[1 - i][k] = q[k]; }
    suSave();
  }
  else if (t.dataset.suPkdel != null){ const s = (LS.get(PKG_KEY) || []).slice(); s.splice(+t.dataset.suPkdel, 1); LS.set(PKG_KEY, s); }
  else if (t.dataset.suPksave != null){
    const q = {}; for (const k of SU_PL) q[k] = SU.pl[+t.dataset.suPksave][k];
    const s = (LS.get(PKG_KEY) || []).slice(); if (!s.some(x => pkgSame(x, q))) s.push(q); LS.set(PKG_KEY, s.slice(-8));
  }
  ui.resignArm = false; renderPlay();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.matches && t.matches('[data-su]')){ suSet(t.dataset.su, t.value); renderPlay(); return; }
  if (t.matches && t.matches('[data-su-split]')){
    SU.split = !!t.checked;
    if (!SU.split) SU.pl[1] = {...SU.pl[0]};
    suSave(); renderPlay();
  }
});
// a typed number counts as soon as Enter is pressed (the stepper buttons count right away)
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-su]')) e.target.blur(); });
// the custom-rules chip in a game: what differs from Default
function suChipHTML(){
  if (!G || !G.suLines || !G.suLines.length) return '';
  return `<span class="suchipw"><button type="button" class="suchip" data-act="su-chip" aria-expanded="${!!ui.suOpen}">Custom rules</button>${ui.suOpen ? `<span class="supop" role="dialog" aria-label="Custom rules"><b>This game's rules</b>${G.suLines.map(l => `<span>${l}</span>`).join('')}</span>` : ''}</span>`;
}
// games in a calibration (older or interrupted saves may not have the total)
const calGames = C => Number.isFinite(C && C.games) ? C.games : ((C && C.results) || []).reduce((s, x) => s + (x.wa || 0) + (x.wb || 0) + (x.d || 0), 0);
const calBtn = label => {
  if (isPlayer()) return '<span class="note">Ratings are set up by the game\'s designer.</span>';
  if (!(dbns || !syncState.ready)) return '<span class="note">Calibrating needs the page open in claude.ai while signed in.</span>';
  const off = calState.busy || job ? 'disabled' : '';
  return `${calState.err ? `<p class="err">Calibration stopped: ${esc(calState.err)}.</p>` : ''}<div class="row"><button type="button" data-act="st-cal" ${off}>${label} (takes several hours)</button><button type="button" data-act="st-calq" ${off}>Quick ${label.toLowerCase()} (about a fifth of the games: rougher ratings)</button></div>`;
};
// while sliding, update the readouts in place (re-rendering would drop the slider mid-drag)
$('view-play').addEventListener('input', e => {
  if (e.target.id !== 'st-r') return;
  oppPick = Math.min(ratingRange()[1], +e.target.value); ui.resignArm = false; LS.set(lenKey('sow-pick-v1', LEN), oppPick);
  const R = oppPick, br = bracketOf(R), root = $('view-play');
  const lv = $('st-lvl'); if (lv) lv.textContent = levelText(R);
  root.querySelector('.pickr').textContent = R;
  root.querySelector('.pickn').textContent = br.name;
  const ex = $('st-exp'); if (ex && ME.rating != null) ex.textContent = `${pct(expected(ME.rating, R))} expected win chance for you`;
  root.querySelectorAll('.bk').forEach((el, k) => el.classList.toggle('on', k === br.k));
  const go = root.querySelector('[data-act="st-go"]'); if (go) go.textContent = goLabel(R);
});
$('view-play').addEventListener('click', async e => {
  const t = e.target.closest('[data-act^="st-"]'); if (!t || t.disabled) return;
  e.stopImmediatePropagation();
  const a = t.dataset.act, resign = G && !G.over && G.opp && G.opp.rated && !G.ratedDone;
  if (a === 'st-back'){ ui.start = false; renderPlay(); return; }
  if (a === 'st-mode'){ startMode = t.dataset.mode; ui.resignArm = false; ui.netErr = ''; renderPlay(); window.scrollTo({top:0}); return; }
  if (a === 'st-modes'){ startMode = null; ui.resignArm = false; renderPlay(); return; }
  if (a === 'st-su-reset'){ const sp = SU.split; SU = {...suFresh(), split:sp}; suSave();
    if (MIRACLES_ON){ MIRACLES_ON = false; LS.set('sow-mir', false); } if (!REFILL_ON){ REFILL_ON = true; LS.set('sow-refill', true); }
    ui.resignArm = false; renderPlay(); return; }
  if (a === 'st-cal'){ runCalibration(); return; }
  if (a === 'st-calq'){ runCalibration(true); return; }
  if (a.startsWith('st-net')){ netStartClick(a, resign); return; }
  if (a === 'st-pp'){
    if (resign && ui.resignArm !== 'pp'){ ui.resignArm = 'pp'; renderPlay(); return; }
    const val = (id, d) => { const el = $(id); const v = el && el.value.trim().slice(0, 16); return v || d; };
    let names = [val('pp-n0', 'Player 1'), val('pp-n1', 'Player 2')];
    if (names[0] === names[1]) names = [names[0] + ' 1', names[1] + ' 2'];
    if (names.includes('You')) names = names.map((n, i) => n === 'You' ? `Player ${i + 1}` : n);   // "You" is the solo game's name
    const before = ui, mode = startMode;
    if (!(await waitForMatchArt(t)) || ui !== before || !ui.start || startMode !== mode) return;
    if (resign) recordResult(true);
    try{ LS.set('sow-pp-names', names); }catch(e){}
    netLeave(); ui.pick = null; newPassPlay(names); return;
  }
  if (a === 'st-go' || a === 'st-free'){
    const key = a === 'st-go' ? true : 'free';
    if (resign && ui.resignArm !== key){ ui.resignArm = key; renderPlay(); return; }
    const before = ui, mode = startMode;
    if (!(await waitForMatchArt(t)) || ui !== before || !ui.start || startMode !== mode) return;
    if (resign) recordResult(true);
    const placing = ME.rating == null;
    ui.pick = null; netLeave();
    newPlay(a === 'st-free' ? null : {rating: bracketPick(), rated:true, placement:placing});
  }
}, true);
let oppPick = null;   // the AI rating you chose on the slider (saved per game length)
// default opponent: your rating, or Novice (the bottom of the ladder) until you have one
function bracketPick(){ const [lo, hi] = ratingRange(); return Math.max(lo, Math.min(hi, oppPick ?? ME.rating ?? lo)); }
// the ladder: neighbours and next-but-one neighbours play each other
async function runCalibration(quick){
  if (calState.busy || job) return;
  ensurePool();
  const n = RUNGS.length, pairs = [];   // every level, including the deepest (it plays fewer calibration games: it's slow)
  for (let a = 0; a < n; a++) for (const st of [1, 2]) if (a + st < n) pairs.push([a, a + st]);
  const genome = clone(brain.champ), L = LEN;
  // games per request: the deepest level's games are slow, so they go out 2 at a time and every worker shares them
  // quick: about a fifth of the games, for a rough ladder now (a full run later tightens it)
  const games = (a, b) => quick ? (a === 0 ? 24 : b === n - 1 ? 12 : 40) : (a === 0 ? 120 : b === n - 1 ? 60 : 200);
  const plan = pairs.map(([a, b]) => { const per = b === n - 1 ? 2 : 10; return {a, b, per, batches:Math.ceil(games(a, b) / per)}; });
  poolErr = null;
  for (const x of plan){ x.w = RUNG_COST(RUNGS[x.a]) + RUNG_COST(RUNGS[x.b]); x.done = 0; }
  calState = {busy:true, done:0, total:plan.reduce((s, x) => s + x.batches, 0), err:null, plan, t0:performance.now()};
  refreshStart();
  try{
    const results = await Promise.all(plan.map(async x => {
      const rs = await Promise.all(Array.from({length:x.batches}, (_, k) => task({cmd:'ladder', a:x.a, b:x.b, n:x.per, seed:100000 * (x.a * 10 + x.b) + k * x.per, genome}, ovLen(effOV(), L)).then(r => { calState.done++; x.done++; paintProg(); return r || {wa:0, wb:0, d:0}; })));
      return rs.reduce((s, r) => ({a:x.a, b:x.b, wa:s.wa + r.wa, wb:s.wb + r.wb, d:s.d + r.d}), {a:x.a, b:x.b, wa:0, wb:0, d:0});
    }));
    await saveCalibration(results, genome, stableKey(effOV()), L, !!quick);
  }catch(e){ calState.err = (e && e.code) ? e.code.replace(/_/g, ' ') : 'something went wrong'; }
  calState.busy = false; refreshStart();
}
async function saveCalibration(results, genome, balanceKey, L = LEN, quick = false){
  // every level that played (the deepest included); a level missing from the results would break the ratings
  const n = Math.max(RUNGS.length - 1, ...results.map(x => Math.max(x.a, x.b))) + 1, elo = fitElo(results, n);
  const cal = {rungs:RUNGS.slice(0, n).map((r, k) => ({id:r.id, label:r.label, elo:elo[k]})), results, genome, balanceKey, at:Date.now(),
    games:results.reduce((s, x) => s + (x.wa || 0) + (x.wb || 0) + (x.d || 0), 0), quick};
  if (dbns && !isPlayer()) await dbns.doc(calPath(L)).set({json:JSON.stringify(cal), at:cal.at, length:L});
  applyCal(cal, L);
}
function applyCal(cal, L = LEN){ LS.set(lenKey('sow-cal-v1', L), cal); if (L !== LEN) return; CAL = cal; }
function refreshStart(){ if (ui.start || !G) renderPlay(); }
let calUnsub = null;
function watchCal(){
  if (!dbns || calUnsub) return;
  const L = LEN;
  calUnsub = dbns.doc(calPath(L)).onSnapshot(snap => {
    if (L !== LEN) return;
    if (!snap.exists) return;
    const d = snap.data(); let cal = null; try{ cal = jparse(d.json); }catch(e){}
    if (cal && (!CAL || cal.at !== CAL.at)){ applyCal(cal, L); refreshStart(); }
  }, () => { calUnsub = null; });
}


