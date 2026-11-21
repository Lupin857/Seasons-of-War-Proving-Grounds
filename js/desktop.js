
/* Desktop: a card panel on the right. Hover any card in the game to read it full size. */
(function(){
  if (!window.matchMedia) return;
  const mq = window.matchMedia('(min-width:1200px)');
  const box = document.createElement('aside'); box.className = 'oinsp'; box.setAttribute('aria-live', 'polite'); box.dataset.raw = '1';   // already in Oasis names: skip the renamer
  box.innerHTML = '<span class="ilbl">Card</span><div class="ibig">Hover a card to read it here.</div><h4></h4><div class="itx"></div><div class="imeta"></div>';
  document.body.appendChild(box);
  const sync = () => document.body.classList.toggle('oasis-desk', mq.matches && !!document.getElementById('view-play') && !document.getElementById('view-play').hidden);
  mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
  new MutationObserver(sync).observe(document.getElementById('view-play'), {attributes:true, attributeFilter:['hidden']});
  sync();
  function which(el){
    const tk = el.closest('[data-tuck-tok], [data-tuck-gear]');
    if (tk && !tk.closest('.oinsp')) return tk.dataset.tuckTok ? {tok:tk.dataset.tuckTok} : {n:tk.dataset.tuckGear, k:'b'};
    const c = el.closest('.mcard, .card, .tcard'); if (!c || c.closest('.oinsp')) return null;
    const f = c.querySelector('.cfm');
    if (f) return {n:f.dataset.n, k:f.dataset.k, own:f.dataset.o};
    if (c.dataset.tok) return {tok:c.dataset.tok};
    if (c.dataset.b) return {n:c.dataset.b, k:'b'};
    if (c.dataset.name){ const n = c.dataset.name.replace(/^Jester → .*/, 'Jester'); return {n, k:DEFS[n] ? 'u' : 'b', live:c}; }
    return null;
  }
  let last = '';
  function show(w){
    const key = JSON.stringify(w && {n:w.n, k:w.k, tok:w.tok}); if (key === last) return; last = key;
    const big = box.querySelector('.ibig'), h = box.querySelector('h4'), tx = box.querySelector('.itx'), meta = box.querySelector('.imeta');
    if (w.tok){ const u = tokArtURL(w.tok); big.innerHTML = u ? artImg(u, TOK_ART[w.tok]) : ''; solidArt(big); h.textContent = TOK_ART[w.tok] || ''; tx.textContent = (typeof TOKRULES !== 'undefined' && TOKRULES[w.tok]) ? TOKRULES[w.tok].replace(/<[^>]+>/g, '') : ''; meta.textContent = 'Token'; return; }
    const d = w.k === 'u' ? DEFS[w.n] : BDEFS[w.n]; if (!d) return;
    const url = artURL(w.n, w.k);
    big.innerHTML = url ? artImg(url, dispName(w.n)) : `<div class="mcard ${w.k}">${cardFace(w.n, w.k, +w.own || 0)}</div>`;
    solidArt(big);
    h.textContent = dispName(w.n);
    tx.textContent = oasisText(d.t || '');
    const type = w.k === 'u' ? (d.token ? 'Token' : 'Unit') : d.gear ? 'Gear' : 'Support';
    const curve = w.k === 'u' && d.p ? ` · Might ${d.p.join('/')}` : '';
    meta.textContent = `${type} · $${d.c}${curve}${url ? '' : OASIS_STALE.has(dispName(w.n)) ? ' · Drawn by the game: its rules changed after the printed card.' : artChanged(w.n, w.k) && OASIS_ART.has(dispName(w.n)) ? ' · Drawn by the game: its numbers differ from the printed card.' : ''}`;
  }
  document.addEventListener('mouseover', e => { if (!document.body.classList.contains('oasis-desk')) return; const w = which(e.target); if (w) show(w); }, true);
})();
