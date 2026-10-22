#!/usr/bin/env node
// UI golden-master test: plays whole games through the real page in a headless browser by clicking its buttons,
// and saves what happened. A UI refactor must replay every game identically, with no page errors.
//
// Games: vs the full-strength AI (unrated), pass-and-play, and online play against a simulated friend (the room
// connection is replaced by a fake one; the friend buys simply and fields every unit it owns). Math.random is seeded, so a game replays exactly
// as long as the code makes the same choices in the same order. The scripted player buys the first card it can,
// sells once a game, uses Black Market and Mason's Guild when it has them, and accepts every reminder.
//
// Setup once (Mac or Linux):   npm install --no-save playwright && npx playwright install chromium
//   node tools/ui-golden.mjs record     # save the current behavior (before refactoring)
//   node tools/ui-golden.mjs check      # compare against it
//   options: --html path/to/index.html   --out path/to/ui-golden.json   --seeds 11,12   --show (visible browser)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), mode = args[0];
const opt = (n, d) => { const k = args.indexOf('--' + n); return k >= 0 ? args[k + 1] : d; };
const HTML = path.resolve(opt('html', path.join(here, '..', 'index.html')));
const OUT = path.resolve(opt('out', path.join(here, 'ui-golden.json')));
const SEEDS = opt('seeds', '11,12').split(',').map(Number);
if (mode !== 'record' && mode !== 'check'){ console.log('usage: node tools/ui-golden.mjs record|check [--html f] [--out f] [--seeds 11,12] [--show]'); process.exit(2); }

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { try { ({ chromium } = createRequire(import.meta.url)(path.join(process.env.NODE_PATH || '', 'playwright'))); }
  catch { console.error('Playwright not found. Run: npm install --no-save playwright && npx playwright install chromium'); process.exit(2); } }

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fp = t => { let h = 2166136261; for (let k = 0; k < t.length; k++){ h ^= t.charCodeAt(k); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };

async function playGame(browser, kind, seed){
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::|ERR_/.test(m.text())) errors.push('console: ' + m.text().slice(0, 200)); });
  // seeded randomness, sound off, a clean browser profile, no auto-advancing replays
  await page.addInitScript(s => {
    let a = s; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    try { localStorage.clear(); localStorage.setItem('sow-autoplay', 'false'); localStorage.setItem('sow-snd', 'false'); } catch (e) {}
  }, seed);
  await page.goto(pathToFileURL(HTML).href);
  await page.addStyleTag({content: ".turnflash{pointer-events:none!important}"});   // the turn banner would otherwise catch the scripted clicks
  await page.waitForFunction(() => typeof renderPlay === 'function');
  if (kind === 'net') await page.evaluate(async seed => {
    // a fake room: our presence goes nowhere, and the "friend" is whatever the test puts in __friend
    roomNS = async () => ({ join: async () => ({ onPeers(cb){ window.__peers = cb; }, presence(){ return Promise.resolve(); }, leave: async () => {} }) });
    await netOpen({ code: 'testrm', seat: 0, name: 'Host', seed, target: 3, acts: [] });
    window.__friend = [];
    window.__tellFriend = () => __peers({ peers: [{ sameTab: false, presence: { app: 'sow', v: NET_V, code: 'testrm', seat: 1, name: 'Friend', hash: NET.hash, acts: __friend } }] });
    __tellFriend();
  }, seed);
  // the simulated friend's next move, if it has one to make
  const friendMove = () => page.evaluate(() => {
    if (!G || G.over || NET.err) return null;
    const sent = __friend.length, p = G.players[1];
    if (G.phase === 'mobilize' && __friend.filter(a => a[0] === 'd').length < G.round){
      const units = Object.keys(p.hand).filter(n => n !== 'Recruit' && !exemptUnit(n)).slice(0, deckCap(p));
      __friend.push(['d', units.map(n => [netIx(n), 0, 0])]);
    } else if (G.phase === 'shop' && cur(G) === 1 && NET.applied[1] === __friend.length){
      const b = G.buys[1], opts = [...G.disp.u.map((c, k) => ['du', k, c.name]), ['recruit', 0, 'Recruit'], ['field', 0, 'Field'], ...G.disp.b.map((c, k) => ['db', k, c.name])];
      const o = b.u + b.b < 2 && opts.find(([src, k, n]) => n !== "Mason's Guild" && buyInfo(G, 1, n, src === 'du' || src === 'recruit' ? 'u' : 'b', src).ok);
      __friend.push(o ? ['b', o[0], o[1], null] : ['p']);
    }
    if (__friend.length === sent) return null;
    __tellFriend(); return __friend[__friend.length - 1][0];
  });

  const state = () => page.evaluate(() => ({
    start: !!(ui.start || !G), roll: !!ui.roll, rolled: !!(ui.roll && ui.roll.first != null), rolling: !!(ui.roll && ui.roll.rolling),
    phase: G && G.phase, over: !!(G && G.over), cur: G && G.phase === 'shop' ? cur(G) : null, seat: G ? seat() : 0,
    pp: !!(G && G.pp), battle: !!ui.battle, remind: !!ui.remind, mason: !!ui.mason, planning: !!ui.planning, handoff: ui.handoff ?? null,
    round: G ? G.round : 0, locked: !!(G && G.net && NET && NET.acts.length > NET.applied[NET.seat]),
  }));
  // what the board shows, fingerprinted just before each of our clicks (a stable moment)
  const views = [];
  const look = async () => views.push(fp(await page.evaluate(() => $('view-play').innerText)));
  const click = async sel => { const el = page.locator(sel).first(); if (await el.count() && await el.isEnabled()){ await look(); await el.click(); return true; } return false; };
  const steps = [];
  let sold = false;
  const suggested = new Set();
  const earlyPass = new Set();
  for (let guard = 0; guard < 2000; guard++){
    const s = await state();
    if (s.over && !s.battle) break;
    if (s.start){ steps.push('start'); await click(kind === 'pp' ? '[data-act="st-pp"]' : '[data-act="st-free"]'); continue; }
    if (s.roll){ if (s.rolling){ await sleep(50); continue; } await click(s.rolled ? '[data-act="roll-go"]' : '[data-act="roll"]'); continue; }
    if (s.remind){ steps.push('remind'); await click('[data-act="remind-go"]'); continue; }
    if (s.battle){ await click('[data-act="b-last"]'); if (s.over) break; steps.push('continue'); await click('[data-act="continue"]'); continue; }
    if (s.phase === 'shop'){
      if (kind === 'net' && s.cur === 1){ const f = await friendMove(); if (f) steps.push('friend-' + f); else await sleep(50); continue; }
      if (!s.pp && s.cur === 1){ await sleep(100); continue; }   // the AI's turn
      if (s.mason){ steps.push('mason'); await click('[data-act="mason-to"]'); continue; }
      if (!sold && s.round >= 2 && await click('[data-act="sell-u"], [data-act="sell-b"]')){ sold = true; steps.push('sell'); continue; }
      if (await click('[data-act="bm-u"]')){ steps.push('bm'); continue; }
      if (s.round === 2 && !earlyPass.has(s.seat)){ earlyPass.add(s.seat); steps.push('pass'); await click('[data-act="pass"]'); continue; }   // pass with money left, to see the reminder
      const buys = page.locator('[data-act="buy"]:not([disabled])');
      const nb = await buys.count();
      if (nb){ steps.push('buy'); await look(); await buys.nth((steps.length * 7) % nb).click(); continue; }   // varied but repeatable picks
      steps.push('pass'); await click('[data-act="pass"]'); continue;
    }
    if (s.phase === 'mobilize'){
      if (s.planning){ await sleep(100); continue; }
      if (s.handoff != null){ await click('[data-act="pp-ready"]'); continue; }
      if (kind === 'net'){ const f = await friendMove(); if (f) steps.push('friend-' + f); if (s.locked){ await sleep(50); continue; } }
      const sk = `${s.round}-${s.seat}`;
      if (s.round % 2 && !suggested.has(sk)){ suggested.add(sk); steps.push('suggest'); await click('[data-act="suggest"]'); continue; }
      steps.push('lock'); await click('[data-act="lock"]'); await sleep(50); continue;
    }
    await sleep(50);
  }
  const res = await page.evaluate(() => ({ winner: G && G.winner, rounds: G && G.round, log: G ? G.log.map(l => l.t) : [] }));
  await ctx.close();
  return { ...res, steps, views, errors };
}

const browser = await chromium.launch({ headless: !args.includes('--show') });
const results = {};
const t0 = Date.now();
for (const kind of ['ai', 'pp', 'net']) for (const seed of SEEDS){
  const r = await playGame(browser, kind, seed);
  results[`${kind}-${seed}`] = r;
  console.log(`${{ai:'vs AI        ', pp:'pass-and-play', net:'online (sim) '}[kind]} seed ${seed}: ${r.rounds} rounds, winner ${r.winner}, ${r.log.length} log lines, ${r.steps.filter(x => x === 'buy').length} buys, ${r.steps.includes('sell') ? 'sold' : 'no sale'}${r.steps.includes('bm') ? ', black market' : ''}${r.steps.includes('mason') ? ', mason' : ''}${r.errors.length ? `, ${r.errors.length} ERRORS` : ''}`);
}
await browser.close();
console.log(`(${((Date.now() - t0) / 1000).toFixed(0)} s)`);
const errs = Object.entries(results).flatMap(([k, r]) => r.errors.map(e => `${k}: ${e}`));

if (mode === 'record'){
  if (errs.length){ console.error('Not saving: the page reported errors\n' + errs.slice(0, 10).join('\n')); process.exit(1); }
  fs.writeFileSync(OUT, JSON.stringify({ made: new Date().toISOString(), seeds: SEEDS, results }, null, 1));
  console.log(`saved ${OUT}`); process.exit(0);
}
const gold = JSON.parse(fs.readFileSync(OUT, 'utf8'));
let bad = errs.length;
for (const e of errs.slice(0, 10)) console.log(e);
for (const k in gold.results){
  const a = gold.results[k], b = results[k];
  if (!b){ console.log(`${k}: not run (use --seeds ${gold.seeds.join(',')})`); bad++; continue; }
  if (JSON.stringify([a.winner, a.log, a.steps, a.views]) === JSON.stringify([b.winner, b.log, b.steps, b.views])) continue;
  bad++;
  const j = a.log.findIndex((t, n) => t !== b.log[n]);
  let why;
  if (j >= 0) why = `First differing log line ${j + 1}:\n    was: ${a.log[j]}\n    now: ${b.log[j]}`;
  else if (JSON.stringify(a.steps) !== JSON.stringify(b.steps)) why = `Same log; clicks differ: ${a.steps.join(' ')} vs ${b.steps.join(' ')}`;
  else why = `Same game, but the board looked different before click ${a.views.findIndex((v, n) => v !== b.views[n]) + 1} of ${a.views.length}`;
  console.log(`${k}: different game. ${why}`);
}
console.log(bad ? `FAIL` : `PASS: all ${Object.keys(gold.results).length} UI games replay identically with no page errors.`);
process.exit(bad ? 1 : 0);
