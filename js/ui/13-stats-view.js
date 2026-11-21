/* ===================== STATS VIEW ===================== */
let statSort = {k:'imp', dir:-1};
let statFilter = {kind:'all', q:''};
// Card stats table columns, in groups. statHide[key] = true hides a column; statHide[group] = true collapses the
// whole group to a narrow stub you can click to open again. Remembered in this browser only.
const STAT_GROUPS = [
  {k:'g1', label:'Popularity', tip:"How often the card gets bought. Popular isn't the same as strong."},
  {k:'g2', label:'Results', tip:'Raw win rates for players who bought or passed on the card. Easy to read, but skewed by who tends to buy it.'},
  {k:'g3', label:'Real strength', tip:"Measures that try to separate the card's own effect from who buys it. Trust these most once there's enough data."},
];
const STAT_COLS = [
  {k:'n', g:'g1', label:'Bought'}, {k:'pick', g:'g1', label:'Armies'}, {k:'take', g:'g1', label:'Taken'}, {k:'sold', g:'g1', label:'Sold'}, {k:'cost', g:'g1', label:'Cost'},
  {k:'wr', g:'g2', label:'Win % bought'}, {k:'pwr', g:'g2', label:'Win % passed'},
  {k:'imp', g:'g3', label:'Impact'}, {k:'adj', g:'g3', label:'Adj. edge'}, {k:'press', g:'g3', label:'Pressure'},
];
let statHide = LS.get('sow-stat-hide') || {}, statPickOpen = false;
const statColsShown = g => statHide[g] ? [] : STAT_COLS.filter(c => c.g === g && !statHide[c.k]);
const wrCell = (x, few) => x == null ? '<span class="dim">—</span>' : `<span class="${x >= 0.53 ? 'up' : x <= 0.47 ? 'down' : ''}">${pct(x)}</span>${few ? ' <span class="dim">few</span>' : ''}`;
const pts = x => x == null ? '<span class="dim">—</span>' : `<span class="pts ${x >= 0.03 ? 'up' : x <= -0.03 ? 'down' : ''}"><span class="bar ${x < 0 ? 'lo' : ''}" style="width:${Math.min(48, Math.round(Math.abs(x) * 160))}px"></span>${x >= 0 ? '+' : '−'}${Math.abs(Math.round(x * 100))}</span>`;
let pairView = {mode:'deck', card:'', min:30, sort:'lift'};
function pairsHTML(){
  const U = stats.__units || {}, vs = pairView.mode === 'vs';
  const tbl = (pairView.mode === 'deck' ? stats.__pairs : pairView.mode === 'adj' ? stats.__adj : stats.__vs) || {};
  const sep = pairView.mode === 'deck' ? '|' : pairView.mode === 'adj' ? '>' : '~';
  const uwr = n => U[n] && U[n].n ? U[n].w / U[n].n : 0.5;
  let rows = Object.entries(tbl).map(([k, s]) => {
    const [a, b] = k.split(sep), wr = s.w / s.n;
    // compare with what you'd expect from A's own strength and B's own strength added together (each unit's edge over
    // 50% stacks), so two strong units in one deck, or a strong unit facing a weak one, doesn't read as a combo or counter
    const lift = wr - Math.max(0.02, Math.min(0.98, vs ? uwr(a) - uwr(b) + 0.5 : uwr(a) + uwr(b) - 0.5));
    return {a, b, n:s.n, wr, lift};
  }).filter(r => r.n >= pairView.min && (!pairView.card || r.a === pairView.card || (!vs && r.b === pairView.card)));
  rows.sort((x, y) => pairView.sort === 'n' ? y.n - x.n : pairView.sort === 'low' ? x.lift - y.lift : y[pairView.sort] - x[pairView.sort]);
  const total = rows.length; rows = rows.slice(0, 40);
  const unitNames = Object.keys(DEFS).filter(n => n !== 'Recruit' && !DEFS[n].token).sort();
  const bldNames = pairView.mode === 'adj' ? [] : Object.keys(BDEFS).filter(n => n !== 'Field').sort();
  const nm = n => `<span class="cname">${esc(n)}</span>${BDEFS[n] ? '<span class="ckind">building</span>' : ''}`;
  return `<div class="panel"><h2>Card pairs and counters</h2>
    <p class="note">Measured per battle from the decks the AIs actually fielded. ${vs
      ? '<b>Edge</b> is how much better the first unit\'s side does when the enemy deck contains the second unit, compared with what you would expect from both units\' overall win rates. Positive means the first unit counters the second; negative means it struggles against it.'
      : '<b>Lift</b> is the pair\'s win rate minus the average of the two units\' own win rates: positive means they do better together than apart.'} ${pairView.mode === 'adj' ? 'In this view the first unit sits directly in front of the second (it fights first).' : ''} Buildings count as part of a side when they are in that player's city during the battle (not in the front → behind view). Only data from games played after this feature was added is included; building pairs start counting from now.</p>
    <div class="row">
      <label for="pv-mode">Show</label><select id="pv-mode"><option value="deck" ${pairView.mode==='deck'?'selected':''}>In the same deck</option><option value="adj" ${pairView.mode==='adj'?'selected':''}>Next to each other (front → behind)</option><option value="vs" ${pairView.mode==='vs'?'selected':''}>Against each other (counters)</option></select>
      <label for="pv-card">Card</label><select id="pv-card"><option value="">All cards</option><optgroup label="Units">${unitNames.map(n => `<option ${pairView.card===n?'selected':''}>${esc(n)}</option>`).join('')}</optgroup>${bldNames.length ? `<optgroup label="Buildings">${bldNames.map(n => `<option ${pairView.card===n?'selected':''}>${esc(n)}</option>`).join('')}</optgroup>` : ''}</select>
      <label for="pv-sort">Sort by</label><select id="pv-sort"><option value="lift" ${pairView.sort==='lift'?'selected':''}>${vs ? 'Strongest counters' : 'Best synergy'}</option><option value="low" ${pairView.sort==='low'?'selected':''}>${vs ? 'Worst matchups' : 'Worst synergy'}</option><option value="wr" ${pairView.sort==='wr'?'selected':''}>Win rate</option><option value="n" ${pairView.sort==='n'?'selected':''}>Most common</option></select>
      <label for="pv-min">At least</label><select id="pv-min">${[10,30,100,300].map(m => `<option value="${m}" ${pairView.min===m?'selected':''}>${m} battles</option>`).join('')}</select>
    </div>
    ${rows.length ? `<div class="stickywrap"><table class="sticky"><thead><tr><th scope="col" class="first">${pairView.mode==='adj'?'Front':'Card'}</th><th scope="col">${pairView.mode==='adj'?'Behind it':vs?'Against':'With'}</th><th class="num" scope="col" data-tip="How many battles this pairing appeared in. Under about 100, treat it as a hint." tabindex="0">Battles<span class="tipmark" aria-hidden="true">?</span></th><th class="num" scope="col" data-tip="${vs ? 'How often the first unit\'s side won the battle when the enemy deck contained the second unit.' : 'How often a deck containing this pairing won the battle.'}" tabindex="0">Win rate<span class="tipmark" aria-hidden="true">?</span></th><th class="num" scope="col" data-tip="${vs ? 'Edge: how much better the first unit\'s side did against the second unit than expected from both units\' overall win rates, in percentage points. Positive = the first unit counters the second.' : 'Lift: the pairing\'s win rate minus the average of the two units\' own win rates, in percentage points. Positive = they do better together than apart.'}" tabindex="0">${vs ? 'Edge' : 'Lift'}<span class="tipmark" aria-hidden="true">?</span></th></tr></thead><tbody>${
      rows.map(r => `<tr><th scope="row" class="first">${nm(r.a)}</th><td>${esc(r.b)}${BDEFS[r.b] ? ' <span class="note">(building)</span>' : ''}</td><td class="num">${r.n.toLocaleString()}</td><td class="num">${pct(r.wr)}</td><td class="num"><span class="bar ${r.lift < 0 ? 'lo' : ''}" style="width:${Math.min(120, Math.round(Math.abs(r.lift) * 300))}px"></span> ${r.lift >= 0 ? '+' : '−'}${Math.abs(Math.round(r.lift * 100))} pts</td></tr>`).join('')
    }</tbody></table></div><p class="note">Showing ${rows.length} of ${total} pairs.</p>` : `<p class="note">No pairs with at least ${pairView.min} battles yet. Run stat games or train the AI, or lower the minimum.</p>`}
  </div>`;
}
const o_ok = r => (r.n || 0) >= 50;
// popular and strong → too much pressure; popular and losing → a trap
const pressFlag = r => r.press == null ? '' : (r.press >= 0.025 && r.adj >= 0.05) ? 'hot' : (r.take >= 0.4 && r.adj <= -0.04) ? 'trap' : '';
const pressCell = r => { if (r.press == null) return '<span class="dim">—</span>'; const f = pressFlag(r), v = r.press * 100;
  return `<span class="${f === 'hot' ? 'down' : f === 'trap' ? 'down' : ''}">${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}</span>${f ? ` <span class="flag ${f}">${f === 'hot' ? 'Too strong' : 'Trap'}</span>` : ''}`; };
// first-turn advantage: AI games (stats.__first) plus your own rated games (ME.history entries that note who shopped first)
function firstTurnHTML(){
  const F = stats.__first || {n:0, w:0, d:0, rounds:0};
  const tip = 'Whoever shops first in round 1 (a coin flip in AI games, the dice roll in yours). Later rounds are not counted here: after round 1 the loser of the last battle shops first. Draws count as half a win.';
  let ai;
  if (!F.n) ai = `<p class="note">No data yet. Run some stat games or training; games played before this was added aren't included.</p>`;
  else {
    const p = F.w / F.n, moe = 1.96 * Math.sqrt(Math.max(p * (1 - p), 0.0001) / F.n), lo = p - moe, hi = p + moe;
    const verdict = F.n < 200 ? 'Too few games to tell yet (aim for 1,000+).'
      : lo > 0.5 ? `Going first is an advantage: somewhere between ${pct(lo)} and ${pct(hi)}.`
      : hi < 0.5 ? `Going second is an advantage: the first shopper wins only ${pct(lo)}–${pct(hi)}.`
      : `No clear first-turn edge: the true rate is likely between ${pct(lo)} and ${pct(hi)}, which includes 50%.`;
    ai = `<div class="kpis">
        <div class="kpi"><div class="v">${(p * 100).toFixed(1)}%</div><div class="l">First shopper's win rate</div></div>
        <div class="kpi"><div class="v">±${(moe * 100).toFixed(1)}</div><div class="l">95% margin, in points</div></div>
        <div class="kpi"><div class="v">${F.n.toLocaleString()}</div><div class="l">Games counted${F.d ? ` · ${F.d.toLocaleString()} draws` : ''}</div></div>
        <div class="kpi"><div class="v">${(F.rounds / F.n).toFixed(1)}</div><div class="l">Average rounds per game</div></div>
      </div>
      <p><b>${verdict}</b></p>`;
  }
  let hist = []; try{ hist = ME.history || []; }catch(e){}
  const H = hist.filter(h => h.first === true || h.first === false);
  const split = side => { const a = H.filter(h => h.first === side); return a.length ? `${pct(a.reduce((s, h) => s + h.s, 0) / a.length)} of ${a.length}` : '—'; };
  const mine = H.length ? `<p class="note">Your rated games (last 50): when you shopped first you scored <b>${split(true)}</b>; when the AI did, <b>${split(false)}</b>. Small samples swing a lot, and your opponent's strength varies.</p>` : '';
  return `<div class="panel"><h2>First-turn win rate<span class="tipmark" data-tip="${esc(tip)}" tabindex="0" aria-hidden="false">?</span></h2>
    <p class="note">How often the player who shops first in round 1 wins the game, across every AI game recorded. 50% means going first doesn't matter.</p>
    ${ai}${mine}</div>`;
}
function statCell(k, r){
  switch (k){
    case 'n': return r.n ? r.n.toLocaleString() : '<span class="dim">0</span>';
    case 'pick': return pct(r.pick);
    case 'take': return r.take == null ? '<span class="dim">—</span>' : pct(r.take);
    case 'sold': return r.sold ? `${r.sold.toLocaleString()}${r.buys ? ` <span class="dim">(${pct(Math.min(1, r.sold / r.buys))})</span>` : ''}` : '<span class="dim">0</span>';
    case 'cost': return r.kind === 'Miracle' ? `<span class="dim">+$${r.cost}</span>` : `<span class="dim">${'$'.repeat(r.cost)}</span>`;
    case 'wr': return wrCell(r.wr, r.n < 50);
    case 'pwr': return wrCell(r.pwr);
    case 'imp': return pts(r.imp);
    case 'adj': return pts(r.adj);
    case 'press': return pressCell(r);
  }
  return '';
}
function statPickerHTML(){
  const hidden = STAT_COLS.filter(c => statHide[c.k] || statHide[c.g]).length;
  return `<details class="colpick"${statPickOpen ? ' open' : ''}><summary>Columns${hidden ? ` (${hidden} hidden)` : ''}</summary>
    <div class="cols">${STAT_GROUPS.map(G => `<fieldset><legend>${G.label}</legend>${STAT_COLS.filter(c => c.g === G.k).map(c =>
      `<label><input type="checkbox" data-col="${c.k}" ${statHide[c.k] || statHide[G.k] ? '' : 'checked'}>${c.label}</label>`).join('')}</fieldset>`).join('')}
      <button type="button" class="small" data-act="sc-all" ${hidden ? '' : 'disabled'}>Show all</button></div></details>`;
}
const saveStatHide = () => LS.set('sow-stat-hide', statHide);
function mirStatsHTML(){
  const M = stats.__mir || {}, games = M.__games || 0;
  if (!games) return `<div class="panel"><h2>Miracles</h2><p class="note">No games with miracles recorded yet at this length.</p></div>`;
  const rows = Object.keys(MIRS).map(n => { const q = M[n] || {sh:0, n:0, w:0};
    return `<tr><th scope="row">${esc(n)}</th><td class="num">${MIRS[n].s ? '+$' + MIRS[n].s : '+$0'}</td><td class="num">${(q.sh / games).toFixed(2)}</td><td class="num">${(q.n / games).toFixed(2)}</td><td class="num">${q.n ? Math.round(100 * q.w / q.n) + '%' : '—'}</td></tr>`; }).join('');
  return `<div class="panel"><h2>Miracles · ${games.toLocaleString()} games</h2>
    <p class="note">Shown and bought are per game. Win % when bought is biased the same way as the card table: treat small numbers as noise.</p>
    <div class="tablewrap"><table><thead><tr><th>Miracle</th><th class="num">Surcharge</th><th class="num">Shown / game</th><th class="num">Bought / game</th><th class="num">Win % when bought</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
// Redraws keep every scroll box where it was (keepScroll, js/ui/15-sync-roles-ratings.js).
function renderStats(){ return keepingScroll('view-stats', drawStats, this, arguments); }
function drawStats(){
  const games = stats.__games || 0;
  const rows = ALL_CARDS.filter(c => !(BDEFS[c] && BDEFS[c].n === 0 && !BDEFS[c].always)).concat(Object.keys(MIRS)).map(c => {
    const s = stats[c] || {n:0, w:0}, kind = MIRS[c] ? 'Miracle' : DEFS[c] ? 'Unit' : 'Building', cost = MIRS[c] ? MIRS[c].s : (DEFS[c] || BDEFS[c]).c;
    const o = (stats.__offer || {})[c], base = stats.__base || {}, lead = (stats.__lead || {})[c] || {};
    const pwr = o && o.pn ? o.pw / o.pn : null, bwr = o && o.bn ? o.bw / o.bn : null;
    // score-adjusted edge: compare each purchase with how players in the same position (behind / tied / ahead) usually finish
    let adjN = 0, adjS = 0;
    for (const z of ['b','t','a']){ const q = lead[z], bq = base[z]; if (!q || !bq || !bq.n) continue; adjN += q.n; adjS += q.w - q.n * (bq.w / bq.n); }
    return {c, kind, cost, n:s.n, pick:games ? s.n / (games * 2) : 0, wr:s.n ? s.w / s.n : null,
            pwr, imp:(pwr != null && bwr != null && o.bn >= 20 && o.pn >= 20) ? bwr - pwr : null,
            adj:adjN >= 20 ? adjS / adjN : null, take: o && (o.bn + o.pn) ? o.bn / (o.bn + o.pn) : null,
            sold:((stats.__sold || {})[c] || {}).n || 0, buys:o ? o.bn : 0};
  });
  // pressure: adjusted edge weighted by how often the card is taken — popular AND strong cards score high
  for (const r of rows) r.press = (r.adj != null && r.take != null && o_ok(r)) ? r.adj * r.take : null;
  const k = statSort.k, dir = statSort.dir;
  rows.sort((a, b) => {
    const va = a[k] ?? -1, vb = b[k] ?? -1;
    return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * dir;
  });
  const busy = !!job;
  const TIPS = {"c": "The card. Its type is shown under the name.", "n": "How many armies bought this card at least once. Each game has two armies.", "pick": "Share of all armies that bought this card at least once. Shows how popular it is, not how good.", "take": "Of the shop phases where a player could have bought this card on their turn, how often they did. Low means it is usually passed over.", "cost": "Shop price.", "wr": "How often a player who bought this card went on to win the game. 50% is neutral. Biased by who buys it: cards the leader buys (like Cathedral) look strong, comeback cards look weak.", "pwr": "How often players who could have bought this card, but took something else, went on to win. The comparison point for Impact.", "imp": "Win % bought minus Win % passed, in percentage points. The best single measure of what taking this card actually does. Positive = taking it helps. Needs 20+ purchases and 20+ passes.", "adj": "Adjusted edge: how buyers did compared with players who were in the same position (behind, tied or ahead) when they bought it, in percentage points. Removes the effect of leaders buying it. Positive = the card itself helps.", "sold": "Copies sold back for $1, and (in brackets) roughly what share of purchases that is. A card sold often is one players regret or only want for a short time. Bought and win-rate numbers still count sold copies: they measure the decision to buy it.", "press": "Pressure: Adj. edge × Taken. How much the card swings games across every game it shows up in. A situational card that is strong but rarely taken stays low; a popular card that is also strong scores high. Flagged 'Too strong' (for how popular it is) at 2.5+ with an edge of +5 or more, and 'Trap' when taken 40%+ of the time but its edge is −4 or worse. Needs 50+ purchases."};
  const th = (key, label, num) => `<th class="${num?'num':''}" data-sort="${key}" scope="col" data-tip="${esc(TIPS[key] || '')}" tabindex="0">${label}<span class="tipmark" aria-hidden="true">?</span>${statSort.k===key ? (statSort.dir>0?' ↑':' ↓') : ''}</th>`;
  $('view-stats').innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    ${statsSaveFailed && !isPlayer() ? `<div class="panel"><p class="err">This browser refused to save the card stats (its storage for this page is full). They are still backed up on the server after each run, and the page restores them from there when it opens.</p></div>` : ''}
    <div class="panel">${lenSegHTML()}<p class="note">Each game length keeps its own card stats; these are from first-to-${LEN} games.</p></div>
    <div class="panel"><h2>Card win rates · first to ${LEN}</h2>
      <p class="note">Every AI game adds to these numbers: training games (many different strategies) and stat games (the champion playing itself). 50% is neutral throughout. Treat cards with fewer than about 50 purchases as noise.</p>
      <ul class="note" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:3px">
        <li><b>Win rate when bought:</b> how often a player who bought the card at least once won. Biased by who buys it: closers like Cathedral look strong, comeback cards look weak.</li>
        <li><b>Taken:</b> of the shop phases where a player could have bought it on their turn, how often they did.</li>
        <li><b>Win rate when passed:</b> how often players who could have bought it but took something else went on to win.</li>
        <li><b>Impact:</b> win rate when bought minus win rate when passed. The closest measure here of what buying the card actually does. Needs 20+ purchases and 20+ passes.</li>
        <li><b>Score-adjusted edge:</b> buyers' results compared with players in the same position (behind, tied or ahead) when they bought it. Removes most of the "leaders buy it" effect.</li>
        <li><b>Pressure:</b> adjusted edge × how often it's taken. The balance rule: popular cards shouldn't also be the strongest. Rarely taken cards can have a big edge and stay low. Flags: <i>Too strong</i> means too strong for how often it's taken; <i>Trap</i> means popular but losing.</li>
      </ul>
      ${syncBarHTML()}
      <div class="row" ${isPlayer() ? 'hidden' : ''}><button type="button" class="primary" data-act="s200" ${busy?'disabled':''}>Run 200 stat games</button><button type="button" data-act="s1000" ${busy?'disabled':''}>Run 1,000</button><button type="button" data-act="stop" ${busy?'':'disabled'}>Stop</button><span class="note">${busy ? `Working… ${job.done} of ${job.total}` : `${games.toLocaleString()} games recorded`}</span><span class="grow"></span><button type="button" data-act="clear" ${busy?'disabled':''}>Clear stats</button></div>
    </div>
    ${firstTurnHTML()}
    <div class="panel">
      <div class="row"><span class="seg" role="group" aria-label="Show">${['all','Unit','Building','Miracle'].map(f => `<button type="button" data-act="sf" data-f="${f}" aria-pressed="${statFilter.kind===f}">${f === 'all' ? 'All cards' : f + 's'}</button>`).join('')}</span>
        <label for="sf-q">Find</label><input type="text" id="sf-q" value="${esc(statFilter.q)}" placeholder="Card name" style="width:12em;font-family:var(--f-body)">
        <span class="grow"></span><span class="note">Click a column to sort. Green is above neutral, red below.</span></div>
      ${statPickerHTML()}
      <div class="stickywrap"><table class="sticky">
      <thead>
        <tr class="grp"><th scope="colgroup" class="first"></th>${STAT_GROUPS.map(G => { const n = statColsShown(G.k).length;
          return `<th scope="colgroup" colspan="${n || 1}" class="${G.k}${n ? '' : ' gstub'}" data-tip="${esc(G.tip)}"><button type="button" class="grpbtn" data-act="sg" data-g="${G.k}" aria-expanded="${!!n}">${n ? '▾' : '▸'} ${G.label}</button><span class="tipmark" aria-hidden="true">?</span></th>`; }).join('')}</tr>
        <tr>${th('c','Card').replace('<th ', '<th class="first" ')}${STAT_GROUPS.map(G => { const cs = statColsShown(G.k);
          return cs.length ? cs.map((c, j) => { const x = th(c.k, c.label, 1); return j ? x : x.replace('class="num"', `class="num ${G.k}"`); }).join('') : `<th scope="col" class="gstub"><span class="sr">${G.label} hidden</span></th>`; }).join('')}</tr></thead>
      <tbody>${rows.filter(r => (statFilter.kind === 'all' || r.kind === statFilter.kind) && (!statFilter.q || r.c.toLowerCase().includes(statFilter.q.toLowerCase()))).map(r => `<tr>
        <th scope="row" class="first"><span class="cname">${esc(r.c)}</span><span class="ckind">${r.kind}</span></th>${STAT_GROUPS.map(G => { const cs = statColsShown(G.k);
          return cs.length ? cs.map((c, j) => `<td class="num${j ? '' : ' ' + G.k}"${c.k === 'press' ? ' style="white-space:nowrap"' : ''}>${statCell(c.k, r)}</td>`).join('') : '<td class="gstub"></td>'; }).join('')}</tr>`).join('')}</tbody>
    </table></div></div>${mirStatsHTML()}${pairsHTML()}</div>`;
}
$('view-stats').addEventListener('input', e => {
  if (e.target.id !== 'sf-q') return;
  statFilter.q = e.target.value; const pos = e.target.selectionStart; renderStats();
  const q = $('sf-q'); q.focus(); q.setSelectionRange(pos, pos);
});
$('view-stats').addEventListener('change', e => {
  const id = e.target.id;
  if (id === 'pv-mode') pairView.mode = e.target.value;
  else if (id === 'pv-card') pairView.card = e.target.value;
  else if (id === 'pv-sort') pairView.sort = e.target.value;
  else if (id === 'pv-min') pairView.min = +e.target.value;
  else if (e.target.dataset.col){
    const c = STAT_COLS.find(x => x.k === e.target.dataset.col); if (!c) return;
    if (e.target.checked){
      delete statHide[c.k];
      // ticking a column in a collapsed group opens the group, showing only the ticked columns
      if (statHide[c.g]){ delete statHide[c.g]; STAT_COLS.forEach(x => { if (x.g === c.g && x.k !== c.k && !statHide[x.k]) statHide[x.k] = true; }); }
    } else statHide[c.k] = true;
    saveStatHide();
  }
  else return;
  renderStats();
});
$('view-stats').addEventListener('toggle', e => { if (e.target.classList && e.target.classList.contains('colpick')) statPickOpen = e.target.open; }, true);
$('view-stats').addEventListener('click', e => {
  const s = e.target.closest('th[data-sort]');
  if (s){ const k = s.dataset.sort; statSort = {k, dir: statSort.k === k ? -statSort.dir : (k === 'c' || k === 'kind' ? 1 : -1)}; renderStats(); return; }
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const a = t.dataset.act;
  if (a === 'sf'){ statFilter.kind = t.dataset.f; renderStats(); return; }
  if (a === 'sg'){
    const g = t.dataset.g;
    // collapsing hides the group; opening it shows its columns again (all of them, if every one had been unticked)
    if (statColsShown(g).length) statHide[g] = true;
    else { delete statHide[g]; if (!statColsShown(g).length) STAT_COLS.forEach(c => { if (c.g === g) delete statHide[c.k]; }); }
    saveStatHide(); renderStats(); return;
  }
  if (a === 'sc-all'){ statHide = {}; saveStatHide(); renderStats(); return; }
  if (a === 'ctxforget'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to forget them'; return; }
    forgetPairings(null); renderStats(); return;
  }
  if (a === 's200') startSim(200);
  if (a === 's1000') startSim(1000);
  if (a === 'stop') stopJob();
  if (a === 'clear'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to clear'; return; }
    stats = {}; saveStats(); LS.set(lenKey('sow-stats-cleared', statsLen), Date.now()); renderStats();
  }
});


