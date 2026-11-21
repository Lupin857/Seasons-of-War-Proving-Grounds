
/* Cards tab. Built fresh from the live card lists (so Balance Lab and sheet changes show), drawn with the same
   cardFace() as the shop, and opened with the same pop-up (openPeek) as every other card in the game. */
(function(){
  const view = $('view-cards'); if (!view) return;
  const st = {f:'all', q:'', sort:'cost'};
  const GROUPS = [['u','Units'], ['b','Supports'], ['g','Gear'], ['t','Tokens']];
  const inGame = d => d && (d.n > 0 || d.always);
  function list(){
    const out = {u:[], b:[], g:[], t:[]};
    for (const n of Object.keys(DEFS)){ const d = DEFS[n]; if (d.token) continue; if (inGame(d)) out.u.push({n, k:'u', c:d.c}); }
    for (const n of Object.keys(BDEFS)){ const d = BDEFS[n]; if (!inGame(d)) continue; (isGear(n) ? out.g : out.b).push({n, k:'b', c:d.c}); }
    if (DEFS.Recruit) out.t.push({n:'Recruit', k:'u', c:DEFS.Recruit.c});
    for (const k of ['arm', 'tr', 'sh']) out.t.push({tok:k, n:dispName(TOKN[k]), c:0});
    return out;
  }
  function tokTile(k){
    const url = typeof tokArtURL === 'function' ? tokArtURL(k) : null, nm = dispName(TOKN[k]);
    const txt = (KW_TOKENS[TOKN[k]] || TOKRULES[k] || '').replace(/\*\*/g, '');
    if (url) return `<div class="mcard tcard u" data-tok="${k}" role="button" tabindex="0" aria-label="${esc(nm)} token. Open full size."><div class="cface art">${artImg(url, nm)}<div class="cface-txt"><div class="top"><span class="nm">${esc(nm)}</span></div><span class="tx">${esc(txt)}</span></div></div></div>`;
    return `<div class="mcard tcard ${k}" data-tok="${k}" role="button" tabindex="0" aria-label="${esc(nm)} token. Open full size."><div class="top"><span class="nm">${esc(nm)}</span></div><div class="curve">${esc(TOKFX[k] || '')}</div><span class="tbig" aria-hidden="true">${tokIcon(k)}</span><span class="tx">${esc(txt)}</span></div>`;
  }
  const tile = c => c.tok ? tokTile(c.tok)
    : `<div class="mcard ${c.k}" data-cname="${esc(c.n)}" role="button" tabindex="0" aria-label="${esc(dispName(c.n))}. Open full size.">${cardFace(c.n, c.k, 0, true)}</div>`;
  window.renderCards = function(){
    const all = list(), q = st.q.trim().toLowerCase();
    const keep = c => !q || dispName(c.n).toLowerCase().includes(q) || c.n.toLowerCase().includes(q);
    const by = (a, b) => st.sort === 'cost' ? (a.c - b.c) || dispName(a.n).localeCompare(dispName(b.n)) : dispName(a.n).localeCompare(dispName(b.n));
    let total = 0;
    const groups = GROUPS.filter(([g]) => st.f === 'all' || st.f === g).map(([g, label]) => {
      const cs = all[g].filter(keep).sort(by); total += cs.length;
      if (!cs.length && st.f === 'all') return '';
      return `<div class="panel cgroup"><h2>${label}<small>${cs.length}</small></h2><div class="cgrid">${cs.length ? cs.map(tile).join('') : '<p class="cnone">No cards match.</p>'}</div></div>`;
    }).join('');
    view.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
      <div class="panel cbar">
        <span class="seg" role="group" aria-label="Show">${[['all', 'All cards'], ...GROUPS].map(([k, l]) => `<button type="button" data-cf="${k}" aria-pressed="${st.f === k}">${l}</button>`).join('')}</span>
        <span class="seg" role="group" aria-label="Sort">${[['cost', 'By cost'], ['name', 'A–Z']].map(([k, l]) => `<button type="button" data-cs="${k}" aria-pressed="${st.sort === k}">${l}</button>`).join('')}</span>
        <label for="cards-q">Find</label><input type="text" id="cards-q" value="${esc(st.q)}" placeholder="Card name" autocomplete="off">
        <span class="ccount">${total} card${total === 1 ? '' : 's'} · click a card to enlarge it</span>
      </div>
      ${groups || '<div class="panel"><p class="note">No cards match.</p></div>'}
    </div>`;
  };
  view.addEventListener('click', e => {
    const f = e.target.closest('[data-cf]'); if (f){ st.f = f.dataset.cf; renderCards(); return; }
    const s = e.target.closest('[data-cs]'); if (s){ st.sort = s.dataset.cs; renderCards(); return; }
    const c = e.target.closest('.cgrid > .mcard'); if (c) openPeek(c, true);
  });
  view.addEventListener('keydown', e => {
    const c = e.target.closest && e.target.closest('.cgrid > .mcard');
    if (c && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openPeek(c, true); }
  });
  view.addEventListener('input', e => {
    if (e.target.id !== 'cards-q') return;
    st.q = e.target.value; const pos = e.target.selectionStart; renderCards();
    const i = $('cards-q'); i.focus(); try{ i.setSelectionRange(pos, pos); }catch(err){}
  });
})();
