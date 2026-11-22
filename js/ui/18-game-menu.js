/* GAME MENU
   While a game is on screen, the Oasis title, the sound button and the tabs are hidden so the screen starts with the
   game (css/10-game-menu.css). The ☰ button at the left end of the game's top bar (pbarHTML, the same bar on every
   screen) opens them instead: the same tabs (it clicks the real tab buttons, so switching views works as before) and
   the sound toggle (it clicks the real #snd-toggle). Opening another tab brings the title and tabs back, so Play is
   there to return to the game. The bar is redrawn often, so the button is found fresh each time; the menu itself
   lives outside the game view and survives redraws. */
(function(){
  const pop = document.createElement('div');
  pop.className = 'gmenu-pop'; pop.id = 'gmenu-pop'; pop.setAttribute('role', 'menu'); pop.hidden = true;
  document.body.append(pop);

  const btn = () => document.querySelector('#gtop [data-gmenu]');
  const snd = () => document.getElementById('snd-toggle');
  const soundOn = () => { const s = snd(); return !s || s.getAttribute('aria-pressed') !== 'false'; };

  function build(){
    const tabs = [...document.querySelectorAll('.tabs button[data-tab]')].filter(b => !b.hidden && getComputedStyle(b).display !== 'none');
    const items = tabs.map(b => {
      const on = b.getAttribute('aria-selected') === 'true';
      return `<button type="button" role="menuitem" class="gmenu-item${on ? ' on' : ''}" data-gtab="${b.dataset.tab}">${b.textContent.trim()}${on ? '<span class="gmenu-here">this game</span>' : ''}</button>`;
    }).join('');
    const s = snd() ? `<div class="gmenu-sep"></div><button type="button" role="menuitemcheckbox" aria-checked="${soundOn()}" class="gmenu-item gmenu-snd" data-gsnd="1">Sound effects<span class="gmenu-sw${soundOn() ? ' on' : ''}" aria-hidden="true"><i></i></span></button>` : '';
    pop.innerHTML = items + s;
  }
  function mark(){ const b = btn(); if (b) b.setAttribute('aria-expanded', String(!pop.hidden)); }
  function place(){
    const b = btn(); if (!b){ close(); return; }
    const r = b.getBoundingClientRect();
    pop.style.top = Math.round(r.bottom + 6) + 'px';
    pop.style.left = Math.round(Math.max(8, r.left)) + 'px';
  }
  function open(){ build(); pop.hidden = false; place(); mark(); }
  function close(){ if (pop.hidden) return; pop.hidden = true; mark(); }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-gmenu]');
    if (b){ e.stopPropagation(); try { sfx.soft(); } catch(_){} pop.hidden ? open() : close(); return; }
    if (!pop.hidden && !pop.contains(e.target)) close();
  }, true);
  pop.addEventListener('click', e => {
    const t = e.target.closest('[data-gtab]'), s = e.target.closest('[data-gsnd]');
    if (t){
      const real = document.querySelector(`.tabs button[data-tab="${t.dataset.gtab}"]`);
      close();
      if (real && real.getAttribute('aria-selected') !== 'true'){ real.click(); try { scrollTo({top:0}); } catch(_){} }
    } else if (s){
      const real = snd(); if (real) real.click();
      build();   // show the new state, keep the menu open
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden){ close(); const b = btn(); if (b) b.focus(); } });
  // the game scrolls and redraws by itself: keep the menu under its button, and close it if the bar goes away
  addEventListener('resize', () => { if (!pop.hidden) place(); });
  addEventListener('scroll', () => { if (!pop.hidden) place(); }, {passive:true});
  const vp = document.getElementById('view-play');
  if (vp) new MutationObserver(() => { if (!pop.hidden) requestAnimationFrame(() => { place(); mark(); }); }).observe(vp, {childList:true, subtree:true});
})();
