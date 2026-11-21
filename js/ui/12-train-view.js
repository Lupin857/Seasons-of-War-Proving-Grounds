/* ===================== TRAIN VIEW ===================== */
function sparkSVG(hist){
  const W = 600, H = 120, pad = 22;
  if (!hist.length) return `<p class="note">The chart fills in as the AI trains. It checks the AI against the untrained starting AI every ${ES.progEvery} steps.</p>`;
  const maxG = Math.max(...hist.map(h => h.g), 5);
  const x = g => pad + (g / maxG) * (W - pad * 2), y = v => H - pad - v * (H - pad * 2);
  const pts = hist.map(h => `${x(h.g).toFixed(1)},${y(h.v).toFixed(1)}`).join(' ');
  const last = hist[hist.length - 1];
  // trend: each point averages the checks covering the last ~600 games, weighted by how many games each check played
  const trend = hist.map((h, i) => {
    let w = 0, sv = 0;
    for (let j = i; j >= 0 && w < 300; j--){ const n = hist[j].n || 24; w += n; sv += hist[j].v * n; }
    return {g:h.g, v:sv / w};
  });
  const tpts = trend.map(h => `${x(h.g).toFixed(1)},${y(h.v).toFixed(1)}`).join(' ');
  const tl = trend[trend.length - 1];
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="AI score against the starting AI over training steps">
    <line x1="${pad}" x2="${W-pad}" y1="${y(0.5)}" y2="${y(0.5)}" stroke="var(--line)" stroke-dasharray="4 4"/>
    <text x="${pad}" y="${y(0.5)-4}" font-size="11" fill="var(--muted)">50% (even with the starting AI)</text>
    <text x="${pad}" y="${y(1)+10}" font-size="11" fill="var(--muted)">100%</text>
    <text x="${pad}" y="${y(0)+14}" font-size="11" fill="var(--muted)">0%</text>
    <polyline points="${pts}" fill="none" stroke="var(--azure)" stroke-width="1" opacity=".35"/>
    <polyline points="${tpts}" fill="none" stroke="var(--azure)" stroke-width="2.5"/>
    <circle cx="${x(tl.g)}" cy="${y(tl.v)}" r="4" fill="var(--azure)"/>
    <text x="${Math.min(x(tl.g)+6, W-60)}" y="${y(tl.v)-6}" font-size="12" fill="var(--ink)" font-family="var(--f-mono)">${pct(tl.v)}</text>
  </svg>
  <p class="note">Faint line: each check. Bold line: the trend, averaging recent checks.${hist.some(h => !h.n) ? ` Checks ${hist.some(h => h.n) ? `before step ${hist.find(h => h.n).g}` : 'so far'} used only 48 games, so that part is noisier.` : ''}</p>`;
}
const WEIGHT_LABELS = {
  rob:'Caution: how much the worst case counts against the average over the opponent\'s possible orders (0–0.6)',
  read:'Trust in its read of the opponent\'s Mobilize order (0–1)',
  omk:'Learning the opponent: how much more it trusts a read that keeps coming true',
};
function renderTrain(){
  const c = brain.champ, last = brain.history[brain.history.length - 1];
  const biases = Object.entries(c.bias || {}).filter(([k,v]) => Math.abs(v) > 0.05).sort((a,b) => b[1] - a[1]);
  const likes = biases.slice(0, 6), dislikes = biases.slice(-6).reverse().filter(b => b[1] < 0);
  const busy = !!job;
  $('view-train').innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    <div class="panel"><h2>How the AI decides</h2>
      <p class="note">Every decision comes down to one question: does this raise or lower my chance of winning the whole game? For each option (every buy, every sale, passing, and every Mobilize order) it test-battles the armies that would meet in this round's battle, then plays the rest of the game out many times from after a win, a tie and a loss and counts how often it goes on to win. Cards nobody has seen are reshuffled for those playouts, and every option is played out on the same imagined futures, so the comparison is fair. A Mercenary or a Recruit only counts for the battle it fights in, money and income count through what they buy later, and a point at match point is worth far more than one at 0-0. While shopping it also looks ahead at the opponent's likely replies. None of this needs training: an untrained AI already plays this way. Your games always use the current AI, saved on the server, so every device and browser plays the same one.</p>
    </div>
    <div class="panel"><h2>What training changes</h2>
      <ul class="note" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:3px">
        <li><b>Three judgment weights</b> (evolution strategies), the only learned numbers in its own decisions: its caution against the opponent's best order, how far it trusts its read of their order, and how fast that trust grows when its reads come true. Each step tries ${ES.dirs} random nudges; for each one, the AI nudged one way plays the AI nudged the opposite way on ${ES.pairs} pairs of games with the same shuffled decks and seats swapped, so card luck cancels out, and the weights move toward whichever sides won. Self-play can't teach the last one much (its opponent has no habits to learn); against you it learns your habits game to game.</li>
        <li><b>Card opinions</b> shape the imagined players in its playouts: how they shop, and so how the AI pictures the rest of the game. They don't decide its own buys. Every ${ES.every} steps, each card bought often enough is compared with players in the same position who didn't buy it, and its opinion moves toward that result.</li>
        <li><b>Safety check</b> (SPRT, the test Stockfish uses): every ${ES.every} steps the AI plays its last checkpoint and stops as soon as the result is clear, from ${SPRT.minPairs} to ${SPRT.maxPairs} game pairs. If it is clearly scoring around ${Math.round(SPRT.mu0 * 100)}% rather than ${Math.round(SPRT.mu1 * 100)}%, it rolls back. Wrong calls either way happen about ${Math.round(SPRT.alpha * 100)}% of the time.</li>
        <li><b>Hall of fame</b>: every ${HOF.every} steps a passing AI is saved (the last ${HOF.keep} are kept), and each safety check also plays one of them. Clearly losing to an older champion rolls back too. If the same older champion wins ${HOF.strikes} checks in a row, it comes back as the champion.</li>
        <li><b>Card stats</b>: every training game is recorded for the Card stats tab.</li>
      </ul>
    </div>
    <div class="panel">${lenSegHTML()}<p class="note">Each game length has its own AI, trained on games of that length. ${brain.seededFrom && !brain.gens ? `This one starts as a copy of the first-to-${brain.seededFrom} AI; training adapts it to longer games.` : `You're training the first-to-${LEN} AI.`}</p></div>
    <div class="kpis">
      <div class="kpi"><div class="v">${brain.gens}</div><div class="l">Training steps</div></div>
      <div class="kpi"><div class="v">${brain.games.toLocaleString()}</div><div class="l">Self-play games</div></div>
      <div class="kpi"><div class="v">${last ? pct(last.v) : '—'}</div><div class="l" data-tip="The AI's score against the untrained starting AI over ${ES.progPairs} seat-swapped game pairs (${ES.progPairs * 2} games), checked every ${ES.progEvery} steps. Above 50% means training has made it better. Luck alone moves one check by up to about ±${swingPts(ES.progPairs)} points, so read the trend line in the chart." tabindex="0">AI vs starting AI<span class="tipmark" aria-hidden="true">?</span></div></div>
      <div class="kpi"><div class="v">${brain.lastGate ? pct(brain.lastGate.v) + (brain.lastGate.reverted ? ' ↩' : '') : '—'}</div><div class="l" data-tip="Latest safety check: the AI's score against its previous checkpoint. Played until the SPRT test was sure${brain.lastGate && brain.lastGate.n ? ` (${brain.lastGate.n} game pairs last time)` : ''}. ↩ means it was rolled back${brain.lastGate && brain.lastGate.why === 'hof' ? ', after losing to a past champion' : ''}. ${brain.reverts || 0} rollback${brain.reverts === 1 ? '' : 's'} so far." tabindex="0">Vs last checkpoint<span class="tipmark" aria-hidden="true">?</span></div></div>
      <div class="kpi"><div class="v">${brain.lastGate && brain.lastGate.hof ? pct(brain.lastGate.hof.v) + (brain.lastGate.hof.pass ? '' : ' ✗') : '—'}</div><div class="l" data-tip="Latest hall-of-fame check: the AI's score against a saved past champion${brain.lastGate && brain.lastGate.hof ? ` (from step ${brain.lastGate.hof.g}, ${brain.lastGate.hof.n} game pairs)` : ''}. ✗ means it clearly lost and was rolled back. ${(brain.hof || []).length} past champion${(brain.hof || []).length === 1 ? '' : 's'} saved${(brain.hof || []).length ? ' (steps ' + brain.hof.map(h => h.g).join(', ') + ')' : '; the first is saved at the next passing check'}.${brain.lastGate && brain.lastGate.restored != null ? ` The step-${brain.lastGate.restored} champion kept winning, so it was brought back.` : ''}" tabindex="0">Vs past champion<span class="tipmark" aria-hidden="true">?</span></div></div>
    </div>
    <div class="panel">
      <div class="row"><button type="button" class="primary" data-act="t10" ${busy?'disabled':''}>Train 10 steps</button><button type="button" data-act="t50" ${busy?'disabled':''}>Train 50</button><button type="button" data-act="t200" ${busy?'disabled':''}>Train 200</button><button type="button" data-act="stop" ${busy?'':'disabled'}>Stop</button>
        ${''}<span class="note">${busy ? (job.kind === 'train' ? (job.stop ? 'Stopping…' : `Training… step ${job.done} of ${job.total}`) : `Running stat games… ${job.done} of ${job.total}`) : `Using ${POOL_SIZE} background ${plural(POOL_SIZE, 'worker')}. Each step plays ${ES.dirs * ES.pairs * 2} games (roughly 1–3 minutes), and every ${ES.every}th step adds safety checks that stop as soon as they're sure (and every ${ES.progEvery}th, ${ES.progPairs * 2} games against the starting AI for the chart) (several minutes). You can keep playing while it trains.`}</span></div>
      <div id="trainprog">${trainProgHTML()}</div>
      ${sparkSVG(brain.history)}
      ${aiSyncHTML()}
      ${syncBarHTML()}
    </div>
    <div class="forces">
      <div class="panel"><h2>Judgment weights</h2>
        <div class="weights">${Object.keys(WEIGHT_LABELS).map(k => `<div><span>${WEIGHT_LABELS[k]}</span><b>${(c[k] ?? 0).toFixed(2)}</b></div>`).join('')}</div>
      </div>
      <div class="panel"><h2>Card opinions (imagined players)</h2>
        <p class="note">Learned from the card stats of its own training games, and used by the imagined players in its playouts. Positive means they buy the card more than its numbers alone suggest; negative means they avoid it. <b>Forget</b> sets a card back to 0 so the AI judges it from its numbers again and relearns it; everything else the AI has learned stays. Editing a card in the Balance lab forgets its opinion automatically.</p>
        <div class="opinions">${biases.map(([k,v]) => `<div><span>${esc(k)}</span><b style="color:${v > 0 ? 'var(--ok)' : 'var(--gules)'}">${v > 0 ? '+' : ''}${v.toFixed(2)}</b><button type="button" class="small" data-act="forget" data-name="${esc(k)}" ${busy?'disabled':''} aria-label="Forget the AI's opinion of ${esc(k)}">Forget</button></div>`).join('') || '<p class="note">No opinions yet.</p>'}</div>
        <div class="row"><span class="grow"></span><button type="button" data-act="forgetall" ${busy || !biases.length ? 'disabled' : ''}>Forget all card opinions</button></div>
      </div>
    </div>
    <div class="panel"><h2>Save or share the AI</h2>
      <p class="note">Copy the champion's settings (its judgment weights, card opinions and the imagined players' shopping settings) to keep them somewhere else, or paste settings to load them.</p>
      <textarea id="brainio" aria-label="AI weights as JSON">${esc(JSON.stringify(brain.champ))}</textarea>
      <div class="row"><button type="button" data-act="copy">Copy weights</button><button type="button" data-act="load">Load pasted weights</button><span class="grow"></span><button type="button" data-act="reset" ${busy?'disabled':''}>Reset AI to untrained</button></div>
      ${brain.legacy ? `<p class="note">The AI from the old trainer (${brain.legacy.gens} generations) is kept as a backup. <button type="button" class="small" data-act="legacy" ${busy?'disabled':''}>Restore it</button></p>` : ''}
      <p class="note" id="brainmsg"></p>
    </div></div>`;
}
$('view-train').addEventListener('change', e => {
});
$('view-train').addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const a = t.dataset.act;
  if (a === 't10') startTrain(10);
  if (a === 't50') startTrain(50);
  if (a === 't200') startTrain(200);
  if (a === 'stop') stopJob();
  if (a === 'forget'){ forgetOpinions([t.dataset.name]); renderTrain(); }
  if (a === 'forgetall'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to forget all'; return; }
    forgetOpinions(Object.keys(brain.champ.bias || {})); renderTrain();
  }
  if (a === 'copy'){
    const ta = $('brainio');
    navigator.clipboard.writeText(ta.value).then(() => { $('brainmsg').textContent = 'Copied.'; }, () => { ta.select(); $('brainmsg').textContent = 'Press Ctrl+C or Cmd+C to copy the selected text.'; });
  }
  if (a === 'load'){
    try{
      const g = jparse($('brainio').value);
      if (typeof g.s !== 'number' || typeof g.bias !== 'object') throw new Error();
      brain.champ = g; brain.ckpt = null; brain.mom = null; saveBrain(); renderTrain(); $('brainmsg').textContent = 'Loaded. New games will use these weights.';
    }catch(err){ $('brainmsg').textContent = "That text isn't valid AI weights. Paste the full JSON copied from this page."; }
  }
  if (a === 'reset'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to reset'; return; }
    brain = {champ:baseGenome(), gens:0, games:0, history:[], algo:'es1', deep:brain.deep, legacy:brain.legacy}; saveBrain(); renderTrain();
  }
  if (a === 'legacy' && brain.legacy){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to restore'; return; }
    brain.champ = clone(brain.legacy.champ); brain.ckpt = null; brain.mom = null; saveBrain(); renderTrain();
    $('brainmsg').textContent = 'Restored the old champion, card opinions included. Training continues from it with the new trainer.';
  }
});

