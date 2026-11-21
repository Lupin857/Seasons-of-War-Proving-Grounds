/* ===================== BALANCE LAB ===================== */
let labResults = LS.get('sow-lab-v1') || [];
let lab = {list:'units', mode:'forced', once:true, card:'Study', bld:'Study', blvl:1, bgames:500, bdeep:false, ua:'Assassin', ub:'Strong Villager', ulvl:1, ubattles:8000, compare:true};
const arr = a => Array.isArray(a) ? a.join('/') : (a ?? '');
function parseArr(s){ const p = String(s).split('/').map(x => x.trim()).filter(x => x !== ''); if (!p.length || p.length > 3 || p.some(x => !/^-?\d+$/.test(x))) return null; return p.map(Number); }
function setOv(grp, name, key, val){
  const src = grp === 'units' ? ORIG.DEFS : grp === 'bldgs' ? ORIG.BDEFS : grp === 'mirs' ? ORIG.MIRS : ORIG.RULES;
  const isSame = grp === 'rules' ? src[key] === val : JSON.stringify(src[name][key]) === JSON.stringify(val);
  if (grp === 'rules'){ OV.rules = OV.rules || {}; if (isSame) delete OV.rules[key]; else OV.rules[key] = val; if (!Object.keys(OV.rules).length) delete OV.rules; }
  else { OV[grp] = OV[grp] || {}; const o = OV[grp][name] = OV[grp][name] || {}; if (isSame) delete o[key]; else o[key] = val; if (!Object.keys(o).length) delete OV[grp][name]; if (!Object.keys(OV[grp]).length) delete OV[grp]; }
  LS.set('sow-ov-v1', OV); applyOverrides(OV); loadSyn();
  if (grp !== 'rules'){ forgetOpinions([name]); forgetPairings([name]); }
}
function changed(grp, name, key){ const o = (OV[grp] || {})[name]; return o && key in o; }
let labSort = {k:'name', dir:1};
// sort card names for the lab tables: name, cost, copies, values (level 1 first, then the rest), or changed cards first
function labSorted(names, src, grp){
  const k = labSort.k, dir = labSort.dir;
  const arrKey = a => Array.isArray(a) ? a.reduce((s, x, i) => s + x * Math.pow(100, 2 - i), 0) : -1;
  const val = n => k === 'name' ? n : k === 'fx' ? (src[n][MIR_FX[n]] ?? -1) : k === 'chg' ? ((OV[grp] || {})[n] ? 0 : 1) : (k === 'p' || k === 'v' || k === 'm' || k === 'lv') ? arrKey(src[n][k]) : (src[n][k] ?? -1);
  return names.slice().sort((a, b) => { const x = val(a), y = val(b); const c = typeof x === 'string' ? x.localeCompare(y) : x - y; return (c * dir) || a.localeCompare(b); });
}
const lth = (key, label) => `<th scope="col" data-lsort="${key}" tabindex="0" style="cursor:pointer" aria-sort="${labSort.k===key ? (labSort.dir>0?'ascending':'descending') : 'none'}">${label}${labSort.k===key ? (labSort.dir>0?' ↑':' ↓') : ''}</th>`;
function unitRows(){
  return labSorted(Object.keys(ORIG.DEFS).filter(n => !ORIG.DEFS[n].token), DEFS, 'units').map(n => { const d = DEFS[n];
    const lab2 = {c:'cost', n:'copies', p:'power', v:'ability value', x:'second ability value', m:'money'};
    const inp = (key, val, w) => `<input type="text" inputmode="text" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done" aria-label="${esc(n)} ${lab2[key] || key}" title="${lab2[key] || key}" data-grp="units" data-name="${esc(n)}" data-key="${key}" value="${esc(val)}" style="width:${w}em" class="${changed('units', n, key) ? 'chg' : ''}">`;
    const cell = (key, val, w) => `<td>${inp(key, val, w)}</td>`;
    return `<tr><th scope="row" class="first"><span class="cname">${esc(n)}</span></th>${cell('c', d.c, 3)}${cell('n', d.n, 3)}${cell('p', arr(d.p), 6)}${d.v ? (d.x ? `<td><div class="row" style="gap:.3em;flex-wrap:nowrap">${inp('v', arr(d.v), 6)}${inp('x', arr(d.x), 4)}</div></td>` : cell('v', arr(d.v), 6)) : '<td class="note">—</td>'}${d.m ? cell('m', arr(d.m), 6) : '<td class="note">—</td>'}<td class="note" style="min-width:16em">${esc(d.t)}</td>
      <td>${(OV.units || {})[n] ? `<button type="button" class="small" data-act="reset" data-grp="units" data-name="${esc(n)}">Reset</button>` : ''}</td></tr>`; }).join('');
}
function bldgRows(){
  return labSorted(Object.keys(ORIG.BDEFS), BDEFS, 'bldgs').map(n => { const d = BDEFS[n];
    const cell = (key, val, w) => `<td><input type="text" inputmode="text" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done" aria-label="${esc(n)} ${key}" data-grp="bldgs" data-name="${esc(n)}" data-key="${key}" value="${esc(val)}" style="width:${w}em" class="${changed('bldgs', n, key) ? 'chg' : ''}"></td>`;
    return `<tr><th scope="row" class="first"><span class="cname">${esc(n)}</span></th>${cell('c', d.c, 3)}${d.always ? '<td class="note">always</td>' : cell('n', d.n, 3)}${cell('lv', arr(d.lv), 6)}<td class="note">${esc(d.t)}</td>
      <td>${(OV.bldgs || {})[n] ? `<button type="button" class="small" data-act="reset" data-grp="bldgs" data-name="${esc(n)}">Reset</button>` : ''}</td></tr>`; }).join('');
}
function mirRows(){
  const what = {bn:'effect value', cash:'$ back', disc:'$ off next card', rec:'Recruits', arm:'Armaments', tr:'Training tokens', writ:'units moved', vis:'cards looked at', fav:'extra buys', frz:'cards set aside', cov:'cards on top', mill:'units milled', rst:'cards dealt', rdl:'displays redealt'};
  return labSorted(Object.keys(ORIG.MIRS), MIRS, 'mirs').map(n => { const m = MIRS[n], fx = MIR_FX[n];
    const cell = (key, val, lbl) => `<td><input type="text" inputmode="text" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" enterkeyhint="done" aria-label="${esc(n)} ${lbl}" title="${lbl}" data-grp="mirs" data-name="${esc(n)}" data-key="${key}" value="${esc(val)}" style="width:3em" class="${changed('mirs', n, key) ? 'chg' : ''}"></td>`;
    return `<tr><th scope="row" class="first"><span class="cname">${esc(n)}</span></th>${cell('s', m.s, 'surcharge')}${cell('u', m.u | 0, 'copies in the unit deck')}${cell('b', m.b | 0, 'copies in the building deck')}${fx ? `<td><div class="row" style="gap:.3em;flex-wrap:nowrap">${cell(fx, m[fx], what[fx]).replace(/^<td>|<\/td>$/g, '')}<span class="note">${what[fx]}</span></div></td>` : '<td class="note">—</td>'}<td class="note" style="white-space:normal;min-width:16em">${esc(m.t)}</td>
      <td>${(OV.mirs || {})[n] ? `<button type="button" class="small" data-act="reset" data-grp="mirs" data-name="${esc(n)}">Reset</button>` : ''}</td></tr>`; }).join('');
}
function renderLab(){
  const changes = describeOverrides(OV), busy = !!job;
  const ruleLbl = {baseIncome:'Base income ($)', buysPerShop:'Buys per shop', fieldsPerShop:'Fields per shop', deckCap:'Deck size (unique units)', citySlots:'City slots', unitDisplay:'Units on display', bldgDisplay:'Buildings on display', startFields:'Starting Harvesters'};
  const bOpts = Object.keys(BDEFS).filter(n => n !== "Mason's Guild").sort().map(n => `<option ${lab.bld===n?'selected':''}>${esc(n)}</option>`).join('');
  const uNames = Object.keys(DEFS).filter(n => !DEFS[n].token && n !== 'Jester').sort();
  const uOpts = sel => uNames.map(n => `<option ${sel===n?'selected':''}>${esc(n)}</option>`).join('');
  const cardNames = Object.keys(DEFS).filter(n => !DEFS[n].token && DEFS[n].n > 0).sort().concat(Object.keys(BDEFS).filter(n => (BDEFS[n].n > 0 || BDEFS[n].always) && n !== 'Field').sort());
  if (lab.mode === 'forced' && !cardNames.includes(lab.bld) && !MIRS[lab.bld]) lab.bld = 'Study';
  if (lab.mode === 'free' && !BDEFS[lab.bld]) lab.bld = 'Study';
  const mirNames = Object.keys(MIRS).filter(n => (MIRS[n].u | 0) + (MIRS[n].b | 0) > 0).sort();
  if (lab.mode === 'forced' && MIRS[lab.bld] && !mirNames.includes(lab.bld)) lab.bld = 'Study';
  const cardOpts = `<optgroup label="Units">${cardNames.filter(n => DEFS[n]).map(n => `<option ${lab.bld===n?'selected':''}>${esc(n)}</option>`).join('')}</optgroup><optgroup label="Buildings">${cardNames.filter(n => BDEFS[n]).map(n => `<option ${lab.bld===n?'selected':''}>${esc(n)}</option>`).join('')}</optgroup>${mirNames.length ? `<optgroup label="Miracles (buy the card covering it; games have miracles on)">${mirNames.map(n => `<option ${lab.bld===n?'selected':''}>${esc(n)}</option>`).join('')}</optgroup>` : ''}`;
  const maxL = Math.max(1, (BDEFS[lab.bld] || {lv:[1]}).lv.length);
  if (lab.blvl > maxL) lab.blvl = maxL;
  $('view-lab').innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    <div class="panel"><h2>Balance lab</h2>
      <p class="note">Change any card's numbers or the core rules, then test them. New changes stay in this browser until you push them. Pushing saves them on the server as a timestamped patch and makes them the base numbers everywhere: card text, Reset buttons, the AI, stats and the website. Everything applies to new games, training and stat games, and card text updates to show the new numbers. Every push is listed in the patch history below, and you can roll back to any of them.</p>
      ${finalBoxHTML()}
      ${syncBarHTML()}
      <div class="row"><span class="note">After big changes, the trained AI and the card stats describe the old numbers.</span><span class="grow"></span><button type="button" data-act="fresh" ${busy?'disabled':''}>Start fresh: reset the AI and clear stats</button></div>
      <div class="list"><span class="eyebrow">Unpushed changes · this browser only</span>
      ${changes.length ? `${changes.map(c => `<div class="li draft"><span class="nm">${esc(c)}</span></div>`).join('')}</div>
        <div class="row">${finalState.err ? `<span class="err">Couldn't push: ${esc(finalState.err)}.</span>` : ''}<span class="grow"></span><button type="button" data-act="resetall" ${busy || finalState.busy ?'disabled':''}>Discard unpushed changes</button>${dbns ? `<button type="button" class="primary" data-act="finalize" ${busy || finalState.busy ?'disabled':''}>${finalState.busy ? 'Saving…' : `Push ${changes.length} ${plural(changes.length, 'change')} as a patch`}</button>` : ''}</div>` : `<p class="note">None. You are testing the current balance as is.</p></div>`}
    </div>
    <div class="forces">
      <div class="panel"><h3>Card test</h3>
        <div class="row"><label for="lb-m">Test</label><select id="lb-m">
          <option value="forced" ${lab.mode==='forced'?'selected':''}>Buy it when offered (realistic)</option>
          <option value="free" ${lab.mode==='free'?'selected':''}>Start with it for free (raw strength, buildings only)</option></select></div>
        <p class="note">${lab.mode === 'forced'
          ? 'One AI must buy the card when it is in the shop and affordable (just the first copy, or every copy), paying full price and using its buys; the other AI shops normally. This includes cost, the purchase it gives up, and timing. Above 50% means taking the card beats normal choices.'
          : 'One AI starts with the building already in its city; the other is identical without it. Ignores cost, timing and the purchase given up, so it measures raw strength only. Best for comparing buildings with each other or checking whether a change made one weaker.'}</p>
        <div class="row"><label for="lb-b">Card</label><select id="lb-b">${lab.mode === 'forced' ? cardOpts : bOpts}</select>
          ${lab.mode === 'free' ? `<label for="lb-l">Level</label><select id="lb-l">${Array.from({length:maxL}, (_, i) => `<option value="${i+1}" ${lab.blvl===i+1?'selected':''}>${i+1}</option>`).join('')}</select>` : ''}
          <label for="lb-n">Games</label><select id="lb-n">${[200,500,1000].map(n => `<option ${lab.bgames===n?'selected':''}>${n}</option>`).join('')}</select></div>
        ${lab.mode === 'forced' ? `<div class="row"><label for="lb-o">Copies</label><select id="lb-o"><option value="1" ${lab.once?'selected':''}>First copy only</option><option value="0" ${lab.once?'':'selected'}>Every copy offered</option></select></div>` : ''}
        <div class="row"><input type="checkbox" id="lb-d" ${lab.bdeep?'checked':''}><label for="lb-d" style="color:var(--ink)">AIs think ahead (about 10× slower)</label></div>
        <button type="button" class="primary" data-act="runb" ${busy?'disabled':''}>Run card test</button>
      </div>
      <div class="panel"><h3>Unit slot test</h3>
        <p class="note">Thousands of battles with random decks: the same deck with unit A or unit B in one random slot, against the same enemy. Isolates how strong a unit is in battle.</p>
        <div class="row"><label for="lu-a">Unit A</label><select id="lu-a">${uOpts(lab.ua)}</select><label for="lu-b">Unit B</label><select id="lu-b">${uOpts(lab.ub)}</select></div>
        <div class="row"><label for="lu-l">Copies</label><select id="lu-l">${[1,2,3].map(n => `<option ${lab.ulvl===n?'selected':''}>${n}</option>`).join('')}</select>
          <label for="lu-n">Battles</label><select id="lu-n">${[2000,8000,20000].map(n => `<option ${lab.ubattles===n?'selected':''}>${n}</option>`).join('')}</select></div>
        <button type="button" class="primary" data-act="runu" ${busy?'disabled':''}>Run unit test</button>
      </div>
    </div>
    <div class="panel"><h3>Combo table</h3>
      <p class="note">The AI uses this when shopping: a unit is worth more if it pairs well with something it already owns. Each entry is how much better a deck does with the first unit directly in front of the second than you'd expect from the two separately, measured over 600 identical random battles per pair.</p>
      ${synStale() ? `<p class="err">Your card changes aren't reflected in the combo table yet.</p>` : ''}
      <div class="row"><button type="button" ${synStale() ? 'class="primary"' : ''} data-act="syn" ${busy?'disabled':''}>Recompute combo table${Object.keys(effOV()).length ? ' for your numbers' : ''}</button><span class="note">Takes about 10–30 seconds.</span></div>
      <div class="weights">${Object.entries(SYN).sort((x, y) => y[1] - x[1]).slice(0, 16).map(([k, v]) => `<div><span>${esc(k.replace('>', ' → '))}</span><b style="color:var(--ok)">+${Math.round(v * 100)} pts</b></div>`).join('')}</div>
    </div>
    <div class="panel">
      <div class="row"><h3>Results</h3><span class="grow"></span>
        <input type="checkbox" id="lab-cmp" ${lab.compare?'checked':''}><label for="lab-cmp" style="color:var(--ink)">When you have changes, also run the same test on the current balance</label></div>
      ${busy && job.kind === 'lab' ? `<p class="turn">${esc(job.label)}… ${job.done} of ${job.total} batches</p>` : ''}
      ${labResults.length ? `<div class="list">${labResults.map((r, i) => `<div class="li" style="align-items:flex-start"><span class="nm" style="font-weight:400"><b>${esc(r.title)}</b><br>${r.lines.map(l => esc(l)).join('<br>')}${r.changes.length ? `<br><span class="note">Changes: ${esc(r.changes.join('; '))}</span>` : `<br><span class="note">${esc(r.base || 'Sheet numbers')}</span>`}</span><button type="button" class="small" data-act="delres" data-i="${i}" aria-label="Delete result">✕</button></div>`).join('')}</div>
        <div class="row"><span class="grow"></span><button type="button" class="small" data-act="clearres">Clear results</button></div>` : '<p class="note">Results appear here, newest first.</p>'}
    </div>
    <div class="panel"><h3>Rules</h3>
      <div class="weights">${Object.keys(ruleLbl).map(k => `<div><label for="rl-${k}" style="color:var(--ink)">${ruleLbl[k]}</label><input id="rl-${k}" type="number" min="0" max="20" value="${RULES[k]}" data-grp="rules" data-key="${k}" style="width:4em" class="${(OV.rules || {})[k] !== undefined ? 'chg' : ''}"></div>`).join('')}</div>
    </div>
    <div class="panel">
      <div class="row"><h3>Card numbers</h3><span class="grow"></span>
        <button type="button" data-act="list-units" class="${lab.list==='units'?'primary':''}">Units</button><button type="button" data-act="list-bldgs" class="${lab.list==='bldgs'?'primary':''}">Buildings</button><button type="button" data-act="list-mirs" class="${lab.list==='mirs'?'primary':''}">Miracles</button></div>
      ${lab.list === 'mirs' ? `<p class="note">Miracles are shuffled into the shop decks when a game has them on. Surcharge is added to the price of the card covering the miracle. Unit deck and Building deck are how many copies go into each (0 removes it from that deck). Effect is the one number the miracle uses; its text updates to match. Editing a miracle also clears the AI's learned opinion of it.</p>` : ''}
      <p class="note" ${lab.list === 'mirs' ? 'hidden' : ''}>Write level values with slashes, like 2/4/7. A single number (like 1) means the same value at every level; type 1/1/2 to make it level up. Card text updates as you type. Copies is how many are in the shop deck (0 removes the card). Changed cells are highlighted. Editing a card also clears the AI's learned opinion of it, so it relearns the new version.</p>
      <div class="row"><span class="note">Click a column to sort.</span><span class="grow"></span><button type="button" class="small" data-act="lsort-chg">Changed cards first</button><button type="button" class="small" data-act="lsort-az">A–Z</button></div>
      <div class="stickywrap"><table class="sticky">
        ${lab.list === 'mirs'
          ? `<thead><tr>${lth('name','Miracle').replace('<th ', '<th class="first" ')}${lth('s','Surcharge')}${lth('u','Unit deck')}${lth('b','Building deck')}${lth('fx','Effect')}<th scope="col">Text</th><th></th></tr></thead><tbody>${mirRows()}</tbody>`
          : lab.list === 'units'
          ? `<thead><tr>${lth('name','Unit').replace('<th ', '<th class="first" ')}${lth('c','Cost')}${lth('n','Copies')}${lth('p','Power')}${lth('v','Ability values')}${lth('m','Money')}<th scope="col">Effect</th><th></th></tr></thead><tbody>${unitRows()}</tbody>`
          : `<thead><tr>${lth('name','Building').replace('<th ', '<th class="first" ')}${lth('c','Cost')}${lth('n','Copies')}${lth('lv','Level values')}<th scope="col">Effect</th><th></th></tr></thead><tbody>${bldgRows()}</tbody>`}
      </table></div>
    </div></div>`;
}
$('view-lab').addEventListener('keydown', e => {
  const s = e.target.closest('th[data-lsort]');
  if (s && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); s.click(); }
});
$('view-lab').addEventListener('change', e => {
  const t = e.target, id = t.id;
  if (id === 'lb-m'){ lab.mode = t.value; renderLab(); return; }
  if (id === 'lb-o'){ lab.once = t.value === '1'; return; }
  if (id === 'lb-b'){ lab.bld = t.value; lab.blvl = 1; renderLab(); return; }
  if (id === 'lb-l'){ lab.blvl = +t.value; return; }
  if (id === 'lb-n'){ lab.bgames = +t.value; return; }
  if (id === 'lb-d'){ lab.bdeep = t.checked; return; }
  if (id === 'lu-a'){ lab.ua = t.value; return; }
  if (id === 'lu-b'){ lab.ub = t.value; return; }
  if (id === 'lu-l'){ lab.ulvl = +t.value; return; }
  if (id === 'lu-n'){ lab.ubattles = +t.value; return; }
  if (id === 'lab-cmp'){ lab.compare = t.checked; return; }
  const grp = t.dataset.grp; if (!grp) return;
  if (job){ renderLab(); return; }
  const key = t.dataset.key;
  let val;
  if (grp === 'rules'){ val = Math.max(0, Math.round(+t.value)); if (!isFinite(val)) return renderLab(); }
  else if (grp === 'mirs'){ val = Math.round(+t.value); const lo = ['s','u','b'].includes(key) ? 0 : 1; if (t.value.trim() === '' || !isFinite(val) || val < lo || val > 9){ t.style.borderColor = 'var(--gules)'; return; } }
  else if (key === 'c' || key === 'n'){ val = Math.round(+t.value); if (!isFinite(val) || val < 0 || val > 9){ t.style.borderColor = 'var(--gules)'; return; } }
  else { val = parseArr(t.value); if (!val){ t.style.borderColor = 'var(--gules)'; return; } }
  setOv(grp, t.dataset.name, key, val);
  renderLab();
});
async function recomputeSyn(){
  if (job) return;
  ensurePool();
  const names = synPool(), groups = [];
  for (let k = 0; k < names.length; k += 2) groups.push(names.slice(k, k + 2));
  job = {kind:'lab', label:'Measuring every unit pair', total:groups.length, done:0, stop:false, depth:null};
  renderLab();
  const parts = await Promise.all(groups.map(as => task({cmd:'syn', as, n:600, seed:12345}).then(r => { if (job){ job.done++; if (!$('view-lab').hidden) renderLab(); } return r; })));
  const tab = Object.assign({}, ...parts);
  LS.set('sow-syn-v2', {key:JSON.stringify(effOV()), tab}); SYN = tab;
  job = null; renderLab();
}
async function runLab(kind){
  if (job) return;
  ensurePool();
  const changes = describeOverrides(OV), both = lab.compare && changes.length > 0;
  const baseName = 'Current balance';
  const variants = both ? [['With your changes', effOV()], [baseName, FINAL.ov || {}]] : [[changes.length ? 'With your changes' : baseName, effOV()]];
  let title, chunks, mk, fmt;
  if (kind === 'b' && lab.mode === 'forced'){
    const card = lab.bld, n = lab.bgames, depth = lab.bdeep ? DEPTH.train : null, per = lab.bdeep ? 5 : 25;
    const once = lab.once;
    title = `Buy ${card} when offered (${once ? 'first copy only' : 'every copy'}) · ${n} games${lab.bdeep ? ' · thinking AIs' : ''}`;
    chunks = Math.ceil(n / per);
    mk = () => ({cmd:'forced', card, n:per, depth, once});
    fmt = (name, rs) => { const t = rs.reduce((s, x) => ({w:s.w+x.w, got:s.got+x.got, gw:s.gw+x.gw, rsum:s.rsum+x.rsum}), {w:0, got:0, gw:0, rsum:0}), N = per * rs.length;
      return `${name}: ${pct(t.w / N)} win rate · got it in ${pct(t.got / N)} of games${t.got ? ` (first in round ${(t.rsum / t.got).toFixed(1)} on average; ${pct(t.gw / t.got)} win rate in those games)` : ''}`; };
  } else if (kind === 'b'){
    const b = lab.bld, l = lab.blvl, n = lab.bgames, depth = lab.bdeep ? DEPTH.train : null, per = lab.bdeep ? 5 : 25;
    title = `${b} level ${l} owned from the start · ${n} games${lab.bdeep ? ' · thinking AIs' : ''}`;
    chunks = Math.ceil(n / per);
    mk = () => ({cmd:'free', b, l, n:per, depth});
    fmt = (name, rs) => `${name}: ${pct(rs.reduce((s, x) => s + x, 0) / rs.length)} win rate`;
  } else {
    const a = lab.ua, b = lab.ub, l = lab.ulvl, n = lab.ubattles, per = 500;
    title = `${a} vs ${b} in the same slot · ${l} cop${l>1?'ies':'y'} · ${n.toLocaleString()} battles`;
    chunks = Math.ceil(n / per);
    mk = () => ({cmd:'slot', a, b, l, n:per});
    fmt = (name, rs) => { const A = rs.reduce((s, x) => s + x[0], 0) / rs.length, B = rs.reduce((s, x) => s + x[1], 0) / rs.length;
      return `${name}: ${a} ${(A*100).toFixed(1)}% · ${b} ${(B*100).toFixed(1)}% (${A >= B ? '+' : '−'}${Math.abs((A - B) * 100).toFixed(1)} pts for ${a})`; };
  }
  job = {kind:'lab', label:title, total:chunks * variants.length, done:0, stop:false, depth:null};
  renderLab();
  const lines = [];
  for (const [name, ov] of variants){
    const rs = await Promise.all(Array.from({length:chunks}, () => task(mk(), ov).then(r => { if (job){ job.done++; if (!$('view-lab').hidden) renderLab(); } return r; })));
    lines.push(fmt(name, rs));
  }
  labResults.unshift({title, lines, changes, base:baseName});
  labResults = labResults.slice(0, 40); LS.set('sow-lab-v1', labResults);
  job = null; renderLab(); shareWithClaude();
}
$('view-lab').addEventListener('toggle', e => { const d = e.target; if (d.classList && d.classList.contains('patch')){ const at = +d.dataset.at; if (d.open) patchOpen.add(at); else patchOpen.delete(at); } }, true);
$('view-lab').addEventListener('click', e => {
  const s = e.target.closest('th[data-lsort]');
  if (s){ const k = s.dataset.lsort; labSort = {k, dir: labSort.k === k ? -labSort.dir : (k === 'name' ? 1 : -1)}; renderLab(); return; }
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  if (t.dataset.act === 'lsort-chg'){ labSort = {k:'chg', dir:1}; renderLab(); return; }
  if (t.dataset.act === 'lsort-az'){ labSort = {k:'name', dir:1}; renderLab(); return; }
  const a = t.dataset.act;
  if (a === 'list-units' || a === 'list-bldgs' || a === 'list-mirs'){ lab.list = a === 'list-units' ? 'units' : a === 'list-mirs' ? 'mirs' : 'bldgs'; renderLab(); }
  if (a === 'reset'){ const g = t.dataset.grp; forgetOpinions([t.dataset.name]); forgetPairings([t.dataset.name]); if (OV[g]){ delete OV[g][t.dataset.name]; if (!Object.keys(OV[g]).length) delete OV[g]; } LS.set('sow-ov-v1', OV); applyOverrides(OV); loadSyn(); renderLab(); }
  if (a === 'resetall'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to reset everything'; return; }
    forgetOpinions(Object.keys(OV.units || {}).concat(Object.keys(OV.bldgs || {}), Object.keys(OV.mirs || {}))); forgetPairings(Object.keys(OV.units || {}).concat(Object.keys(OV.bldgs || {})));
    OV = {}; LS.set('sow-ov-v1', OV); applyOverrides(OV); loadSyn(); renderLab();
  }
  if (a === 'fresh'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = 'Click again to reset the AI and clear all stats'; return; }
    brain = {champ:baseGenome(), gens:0, games:0, history:[], deep:brain.deep, algo:'es1', legacy:brain.legacy}; saveBrain();
    stats = {}; saveStats(); LS.set(lenKey('sow-stats-cleared', statsLen), Date.now());
    t.dataset.confirm = ''; renderLab();
    const m = document.createElement('p'); m.className = 'note'; m.textContent = 'Done. The AI is untrained and all card, pair and counter stats are cleared. Train it again on the Train tab.';
    t.closest('.panel').appendChild(m);
  }
  if (a === 'finalize' || a === 'restore'){
    if (t.dataset.confirm !== '1'){ t.dataset.confirm = '1'; t.textContent = a === 'finalize' ? 'Click again to push the patch' : 'Click again to roll back'; return; }
    if (a === 'finalize') finalizeBalance(effOV());
    else { const h = (FINAL.patches || [])[+t.dataset.i]; if (h && h.json) finalizeBalance(safeJSON(h.json), h.at); }
    return;
  }
  if (a === 'syn') recomputeSyn();
  if (a === 'runb') runLab('b');
  if (a === 'runu') runLab('u');
  if (a === 'delres'){ labResults.splice(+t.dataset.i, 1); LS.set('sow-lab-v1', labResults); renderLab(); }
  if (a === 'clearres'){ labResults = []; LS.set('sow-lab-v1', labResults); renderLab(); }
});



