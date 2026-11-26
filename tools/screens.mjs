#!/usr/bin/env node
// Screenshot test for refactors: plays the same seeded game against the AI and opens the designer tabs, saving a
// screenshot at fixed moments. Run it on the old and new build, then compare with screens-diff.mjs. A pure
// refactor should give 0% everywhere (a pulsing glow caught mid-pulse can differ by a fraction of a percent).
//
//   node tools/screens.mjs <build dir> <out dir> [--phone] [--rounds 3] [--motion] [--styles] [--matches rules.json]
// --motion also plays two rounds with animations on and reports any errors (no screenshots for that part).
// --styles saves every element's computed style at each moment (NAME.styles.json.gz); screens-diff.mjs compares
//   them, which catches CSS changes a screenshot can miss (hover colors, hidden elements). Use it for CSS refactors.
// --matches saves which CSS rules match which elements at each moment (for CSS refactor planning tools).
// --phone emulates a touch phone (390x844, coarse pointer).
//
// The build is served over http from inside this process (the AI's workers load js/engine.js by URL, which
// file:// can't do). Math.random is seeded, animations use reduced motion. It also saves the game's match record
// (match-record.json); screens-diff.mjs compares those too.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const [ROOT, OUT] = args;
if (!ROOT || !OUT){ console.log('usage: node tools/screens.mjs <build dir> <out dir> [--phone] [--rounds 3] [--motion]'); process.exit(2); }
const phone = args.includes('--phone');
const ROUNDS = +(args[args.indexOf('--rounds') + 1] || 3) || 3;
const STYLES = args.includes('--styles');
const MATCHES = args.includes('--matches') ? JSON.parse(fs.readFileSync(args[args.indexOf('--matches') + 1], 'utf8')) : null;
const zlib = await import('node:zlib');
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
fs.mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, r) => {
  const f = path.join(path.resolve(ROOT), decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e){ r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${srv.address().port}/index.html`;
const SEED = s => `(() => { let a = ${s}; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();`;

const browser = await chromium.launch();
const errs = [];
async function open(seed){
  const ctx = await browser.newContext({ viewport: phone ? { width: 390, height: 844 } : { width: 1400, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', ...(phone ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.addInitScript(SEED(seed));
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 160)); });
  await p.goto(url); await p.waitForTimeout(1500);
  return p;
}
// Every element (and its ::before / ::after when drawn) gets a key from its position in the page.
const KEYS_JS = `(() => { const out = []; const walk = (el, k) => { out.push([el, k]); let i = 0; for (const c of el.children) walk(c, k + '/' + c.tagName.toLowerCase() + (i++)); }; walk(document.documentElement, 'html'); return out; })()`;
async function probe(p, n){
  if (STYLES){
    const d = await p.evaluate(K => { const els = eval(K), table = [], idx = new Map(), out = {};
      const anims = document.getAnimations().filter(a => a.playState === 'running').map(a => [a, a.currentTime]); anims.forEach(([a]) => { a.pause(); a.currentTime = 0; });   // read styles with every running animation at its start
      const str = cs => { const ks = []; for (let i = 0; i < cs.length; i++) ks.push(cs[i]); ks.sort(); return ks.map(k => k + '\u0002' + cs.getPropertyValue(k)).join('\u0001'); };   // sorted: custom properties come in no fixed order
      const put = (k, s) => { let j = idx.get(s); if (j == null){ j = table.length; table.push(s); idx.set(s, j); } out[k] = j; };
      for (const [el, k] of els){ put(k, str(getComputedStyle(el)));
        for (const pe of ['::before', '::after']){ const c = getComputedStyle(el, pe); if (c.content && c.content !== 'none' && c.content !== 'normal') put(k + pe, str(c)); } }
      anims.forEach(([a, t]) => { a.currentTime = t; a.play(); });
      const origin = location.origin;
      return { table: table.map(x => x.split(origin).join('')), els: out }; }, KEYS_JS);   // page-relative URLs, so two runs on different ports compare
    fs.writeFileSync(path.join(OUT, n + '.styles.json.gz'), zlib.gzipSync(JSON.stringify(d)));
  }
  if (MATCHES){
    const d = await p.evaluate(([K, rules]) => { const els = eval(K), keyOf = new Map(els.map(([e, k], i) => [e, i])), m = {}, bad = [];
      const DYN = /:(hover|active|focus|focus-visible|focus-within|visited|target|checked|disabled|enabled|placeholder-shown|empty)\b/;
      const strip = sel => { let s = sel.replace(/::?(before|after|placeholder|selection|marker|backdrop|-webkit-[\w-]+|-moz-[\w-]+)\b/g, '');
        for (let g = 0; g < 5; g++) s = s.replace(/:not\(([^()]*(\([^()]*\))*[^()]*)\)/g, (all, inner) => DYN.test(inner) ? '' : all);
        s = s.replace(/:(hover|active|focus-visible|focus-within|focus|visited|target)\b/g, ''); return s.trim() || '*'; };
      const ctxOk = ctx => ctx.every(c => { const sp = c.indexOf(' '), kind = c.slice(1, sp), cond = c.slice(sp + 1);
        if (kind === 'media') return matchMedia(cond).matches; if (kind === 'supports') { try { return CSS.supports(cond); } catch(e){ return true; } } return true; });
      for (const r of rules){ if (!ctxOk(r.ctx)) continue; const hit = new Set();
        r.selector.split(/,(?![^(]*\))/).forEach((part, pi) => { const pe = (part.match(/::?(before|after)\b/) || [])[1];
          let q; try { q = document.querySelectorAll(strip(part)); } catch(e){ bad.push(r.id + ' ' + part); return; }
          for (const e of q){ const i = keyOf.get(e); if (i != null) hit.add((pe ? i + ':' + pe : String(i)) + '@' + pi); } });   // element[:pseudo]@selector part
        if (hit.size) m[r.id] = [...hit]; }
      return { keys: els.map(x => x[1]), cls: els.map(x => typeof x[0].className === 'string' ? x[0].className : (x[0].getAttribute('class') || '')), m, bad }; }, [KEYS_JS, MATCHES]);
    fs.writeFileSync(path.join(OUT, n + '.matches.json.gz'), zlib.gzipSync(JSON.stringify(d)));
  }
}
const shot = async (p, n) => {
  // toasts fade on a timer: wait them out so two runs see the same screen
  for (let i = 0; i < 40 && await p.evaluate(() => [...document.querySelectorAll('.toast')].some(t => getComputedStyle(t).display !== 'none' && getComputedStyle(t).opacity !== '0')); i++) await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(OUT, n + '.png') }); await probe(p, n); };
const act = (p, a) => p.evaluate(a => { const e = document.querySelector(`[data-act="${a}"]`); if (e){ e.click(); return true; } return false; }, a);

// 1. a seeded game: buy up to 3 cards a shop, let "suggest" order the deck, step through every battle
const p = await open(12345);
const layoutDefault = await p.evaluate(() => {
  const fresh = matDeskOn();
  localStorage.setItem('oasisMatDesk', '0');
  const savedOff = matDeskOn();
  localStorage.removeItem('oasisMatDesk');
  return {fresh, savedOff, player:isPlayer()};
});
if (!layoutDefault.fresh || layoutDefault.savedOff || !layoutDefault.player) errs.push(`default player layout preference: ${JSON.stringify(layoutDefault)}`);
await shot(p, '0-start');
await act(p, 'st-mode'); await p.waitForTimeout(500); await shot(p, '0-setup'); await act(p, 'st-go'); await p.waitForTimeout(800);
await shot(p, '0-roll');
const roll = p.getByText('Roll the dice', { exact: true }); if (await roll.count()){ await roll.first().click(); await p.waitForTimeout(3000); }
await act(p, 'roll-go'); await p.waitForTimeout(1500);
const done = new Set(), buys = {};
for (let step = 0; step < 600; step++){
  const st = await p.evaluate(() => ({ phase: G && G.phase, over: G && G.over, cur: G && G.phase === 'shop' ? cur(G) : null, me: seat(), round: G && G.round, battle: !!ui.battle, frame: ui.battle ? ui.frame : null, frames: ui.battle ? ui.battle.frames.length : 0 }));
  if (st.over || st.round > ROUNDS) break;
  const once = async n => { if (!done.has(n)){ done.add(n); await shot(p, n); } };
  if (st.battle){
    if ((st.frame === 2 || st.frame === 5) && !done.has(`r${st.round}-battle-f${st.frame}`)){ await p.waitForTimeout(1200); await once(`r${st.round}-battle-f${st.frame}`); }
    if (st.frame < st.frames - 1){ await p.evaluate(() => stepForward()); await p.waitForTimeout(250); continue; }
    if (!done.has(`r${st.round}-battle-end`)) await p.waitForTimeout(1200);   // let timed effects (the 0.9 s ability glow) finish
    await once(`r${st.round}-battle-end`);
    if (!(await act(p, 'continue'))) await act(p, 'n');
    await p.waitForTimeout(1200); continue;
  }
  if (st.phase === 'shop'){
    if (!done.has('default-player-shop-layout')){
      const layout = await p.evaluate(() => ({player:isPlayer(), mat:matShopOn(), desktop:compact() || !!document.querySelector('#view-play .osshop.osdesk')}));
      if (!layout.player || !layout.mat || !layout.desktop) errs.push(`default player shop layout: ${JSON.stringify(layout)}`);
      done.add('default-player-shop-layout');
    }
    if (st.cur === st.me){
      if (!done.has(`r${st.round}-shop`)){
        await once(`r${st.round}-shop`);
        // the large card pop-up (cardPop / openPeek), on the first market card
        if (st.round === 1){ await p.evaluate(() => { const c = document.querySelector('#view-play .market .mcard'); if (c) openPeek(c, true); }); await p.waitForTimeout(1200); await once('r1-shop-peek'); await p.evaluate(() => { try{ closePeek(); }catch(e){} }); await p.waitForTimeout(800); }
        // round 2: your deck, the enemy deck, the discard pile, the miracle tray, Board settings
        if (st.round === 2){
          const view = async (sel, n) => { const ok = await p.evaluate(sel => { const e = document.querySelector(sel); if (e){ e.click(); return true; } return false; }, sel); if (!ok) return; await p.waitForTimeout(1000); await once(n); await p.keyboard.press('Escape'); await p.waitForTimeout(300); await p.evaluate(sel => { const e = document.querySelector(sel); if (e && /\bon\b|true/.test((e.className || '') + e.getAttribute('aria-expanded'))) e.click(); }, sel); await p.waitForTimeout(600); };
          await view('[data-act="deck-open"][data-p="0"]', 'r2-deck-you');
          await view('[data-act="deck-open"][data-p="1"]', 'r2-deck-enemy');
          await view('[data-act="muster"]', 'r2-discard');
          await view('[data-act="mir-tray"]', 'r2-miracles');
          await p.evaluate(() => { LAB.open = true; labSave(); labPanel(); }); await p.waitForTimeout(600); await once('r2-board-settings');
          await p.evaluate(() => { LAB.open = false; labSave(); labPanel(); }); await p.waitForTimeout(400);
        }
      }
      buys[st.round] = (buys[st.round] || 0) + 1;
      await p.evaluate(n => { const els = [...document.querySelectorAll('[data-act="buy"]')].filter(e => !e.disabled); const kind = e => { try { const c = sourceCard(G, seat(), e.dataset.src, +e.dataset.idx); return c && c.kind; } catch(x){ return null; } };
        const el = els.find(e => kind(e) === 'u') || els[0];   // units first, so Mobilize and battles have our cards in them
        if (el && G.players[seat()].money > 0 && n <= 3) playerMove(['b', el.dataset.src, +el.dataset.idx, null]); else playerMove(['p']); }, buys[st.round]);   // up to 3 buys a shop
    }
    await p.waitForTimeout(1500); continue;
  }
  if (st.phase === 'mobilize'){
    if (!done.has(`r${st.round}-mobilize`)){ await p.waitForTimeout(800); await once(`r${st.round}-mobilize`); }
    await act(p, 'suggest'); await p.waitForTimeout(900); await once(`r${st.round}-mobilize-filled`);
    if (!(await act(p, 'lock'))) await act(p, 'remind-go');
    await p.waitForTimeout(1500); await act(p, 'remind-go'); await p.waitForTimeout(1500); continue;
  }
  await p.waitForTimeout(800);
}
// the match record (shop actions with the board before each, battles), for comparing two builds
fs.writeFileSync(path.join(OUT, 'match-record.json'), JSON.stringify(await p.evaluate(() => { const all = LS.get(MATCH_KEY) || []; return all[0] || null; }), null, 1));
if (await p.evaluate(() => !!(G && G.over))){ await p.waitForTimeout(1500); await shot(p, 'game-over'); }
const fin = await p.evaluate(() => ({ round: G && G.round, score: G && G.players.map(x => x.score), aiWorker: !!(typeof aiW === 'object' && aiW) }));

// 2. designer tabs
const q = await open(777);
await q.evaluate(() => { canAdmin = true; playerPreview = false; applyRole(); });
for (const t of ['train', 'stats', 'cards', 'rules']){
  await q.evaluate(t => { const b = document.querySelector(`.tabs button[data-tab="${t}"]`); if (b) b.click(); }, t);
  await q.waitForTimeout(1200); await shot(q, `tab-${t}`);
}

// 3. animations on (no screenshots: timing varies), to catch errors in the motion code
if (args.includes('--motion')){
  const ctx = await browser.newContext({ viewport: phone ? { width: 390, height: 844 } : { width: 1400, height: 900 } });
  await ctx.addInitScript(SEED(4242));
  const m = await ctx.newPage(); m.on('pageerror', e => errs.push('motion: ' + e.message));
  await m.goto(url); await m.waitForTimeout(1500);
  await act(m, 'st-mode'); await m.waitForTimeout(500); await act(m, 'st-go'); await m.waitForTimeout(800);
  const r2 = m.getByText('Roll the dice', { exact: true }); if (await r2.count()){ await r2.first().click(); await m.waitForTimeout(3000); }
  await act(m, 'roll-go'); await m.waitForTimeout(1500);
  for (let step = 0; step < 300; step++){
    const st = await m.evaluate(() => ({ phase: G && G.phase, over: G && G.over, cur: G && G.phase === 'shop' ? cur(G) : null, me: seat(), round: G && G.round, battle: !!ui.battle, end: ui.battle ? ui.frame >= ui.battle.frames.length - 1 : false }));
    if (st.over || st.round > 2) break;
    if (st.battle){ if (!st.end){ await m.evaluate(() => { if (!ui.animT) stepForward(); }); await m.waitForTimeout(700); continue; } if (!(await act(m, 'continue'))) await act(m, 'n'); await m.waitForTimeout(1500); continue; }
    if (st.phase === 'shop'){ if (st.cur === st.me){ await m.evaluate(() => { const c = document.querySelector('#view-play .market .mcard'); if (c) openPeek(c, true); }); await m.waitForTimeout(600); await m.evaluate(() => { try{ closePeek(); }catch(e){} }); await m.evaluate(() => { const el = [...document.querySelectorAll('[data-act="buy"]')].find(e => !e.disabled); if (el && G.players[seat()].money > 0 && G.log.filter(l => l.side === seat()).length < 3) playerMove(['b', el.dataset.src, +el.dataset.idx, null]); else playerMove(['p']); }); } await m.waitForTimeout(1800); continue; }
    if (st.phase === 'mobilize'){ await act(m, 'suggest'); await m.waitForTimeout(900); if (!(await act(m, 'lock'))) await act(m, 'remind-go'); await m.waitForTimeout(1500); await act(m, 'remind-go'); await m.waitForTimeout(1500); continue; }
    await m.waitForTimeout(800);
  }
  const mf = await m.evaluate(() => ({ round: G && G.round, score: G && G.players.map(x => x.score) }));
  console.log(`motion run: ${JSON.stringify(mf)}`);
}

console.log(`game: ${JSON.stringify(fin)}  screenshots: ${fs.readdirSync(OUT).length} in ${OUT}  errors: ${errs.length ? '\n  ' + errs.slice(0, 8).join('\n  ') : 'none'}`);
await browser.close(); srv.close();
process.exit(errs.length ? 1 : 0);
