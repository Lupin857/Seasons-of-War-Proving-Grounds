#!/usr/bin/env node
// Golden-master test for the SOW engine.
//
// Loads the <script id="engine"> block straight out of index.html, then runs:
//   - seeded random battles (runBattle with the replay log on), and
//   - seeded full AI-vs-AI games (shop, mobilize, battle every round).
// `record` saves every result to golden.json. `check` reruns them and reports any difference.
// A refactor that is truly behavior-neutral must pass `check` with zero differences.
//
//   node tools/golden.mjs record            # save the current behavior (do this BEFORE refactoring)
//   node tools/golden.mjs check             # compare the current code against the saved behavior
//   options: --html path/to/index.html   --out path/to/golden.json
//            --battles N (default 1000)   --games N (default 40)   --deep N (default 4, games at DEPTH.train)

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const mode = args[0];
const opt = (name, def) => { const k = args.indexOf('--' + name); return k >= 0 ? args[k + 1] : def; };
const HTML = path.resolve(opt('html', path.join(here, '..', 'index.html')));
const OUT = path.resolve(opt('out', path.join(here, 'golden.json')));
const N_BATTLES = +opt('battles', 1000), N_GAMES = +opt('games', 40), N_DEEP = +opt('deep', 4);

if (mode !== 'record' && mode !== 'check'){
  console.log('usage: node tools/golden.mjs record|check [--html index.html] [--out golden.json] [--battles N] [--games N] [--deep N]');
  process.exit(2);
}

/* ---------- load the engine ---------- */
const html = fs.readFileSync(HTML, 'utf8');
const m = /<script id="engine">([\s\S]*?)<\/script>/.exec(html);
if (!m){ console.error(`No <script id="engine"> block found in ${HTML}`); process.exit(2); }

// The same generator the engine uses, so this file needs nothing from it to drive Math.random.
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// The engine gets its own Math whose random() is reseeded before every case, so even code that
// falls back to Math.random stays repeatable.
let mathRnd = mulberry(1);
const SeededMath = Object.create(Math);
SeededMath.random = () => mathRnd();
const ctx = vm.createContext({ Math: SeededMath, console });
const EXPORTS = ['runBattle', 'newGame', 'autoRound', 'baseGenome', 'DEPTH', 'DEFS', 'BDEFS', 'mulberry32'];
vm.runInContext(m[1] + `\n;globalThis.__E = {${EXPORTS.join(',')}};`, ctx, { filename: 'engine' });
const E = ctx.__E;
const reseed = s => { mathRnd = mulberry(s ^ 0x5eed); };

/* ---------- helpers ---------- */
const hash = v => crypto.createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 12);
const plain = v => JSON.parse(JSON.stringify(v));   // strip vm-realm prototypes so results compare cleanly

/* ---------- battle cases ---------- */
// Every unit (Jester and Recruit included), random levels and tokens, and random battle buildings,
// so each ability and building gets exercised many times across the 1,000 cases.
const UNITS = Object.keys(E.DEFS);
function battleCase(seed){
  const r = mulberry(seed), pick = a => a[Math.floor(r() * a.length)], n = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  const side = () => {
    const used = new Set(), units = [];
    for (let k = n(0, 6); k > 0; k--){
      const name = pick(UNITS);
      if (used.has(name) && name !== 'Recruit') continue;
      used.add(name);
      units.push({ name, copies: n(1, 3), arm: r() < 0.25 ? n(1, 3) : 0, tr: r() < 0.15 ? n(1, 2) : 0, sh: r() < 0.1 ? 1 : 0 });
    }
    return { units, treb: r() < 0.2 ? n(1, 2) : 0, armory: r() < 0.2 ? n(1, 2) : 0, yard: r() < 0.2 ? n(1, 2) : 0, infirmary: r() < 0.15 };
  };
  return [side(), side()];
}
function runBattleCase(seed){
  reseed(seed);
  const cfgs = battleCase(seed);
  const res = E.runBattle(plain(cfgs), true);
  return {
    w: res.result.w,
    left: plain(res.left),
    frames: res.frames.length,
    // outcome is what matters most; the log/replay hash also catches changed wording, ordering or arrows
    log: hash(res.frames.map(f => [f.label, f.lines])),
    snap: hash(res.frames.map(f => f.snap)),
  };
}

/* ---------- full-game cases ---------- */
function runGameCase(seed, deep){
  reseed(seed);
  const g = E.newGame({ genomes: [E.baseGenome(), E.baseGenome()], rnd: E.mulberry32(seed) });
  const rounds = [];
  while (!g.over){
    const logStart = g.log.length;
    E.autoRound(g, 8, deep ? E.DEPTH.train : null);
    rounds.push({
      log: plain(g.log.slice(logStart).map(l => l.t)),
      decks: plain(g.decks.map(d => (d || []).map(u => [u.name, u.copies, u.arm || 0, u.tr || 0]))),
      money: g.players.map(p => p.money),
      score: g.players.map(p => p.score),
      w: g.lastBattle ? g.lastBattle.w : null,
    });
  }
  return { winner: g.winner, rounds: rounds.length, detail: hash(rounds), rlog: rounds };
}

/* ---------- run everything ---------- */
function runAll(){
  const t0 = Date.now(), out = { battles: {}, games: {} };
  for (let k = 0; k < N_BATTLES; k++){ const s = 1000 + k; out.battles[s] = runBattleCase(s); }
  const tB = Date.now();
  for (let k = 0; k < N_GAMES; k++){ const s = 5000 + k; out.games['fast-' + s] = runGameCase(s, false); }
  for (let k = 0; k < N_DEEP; k++){ const s = 9000 + k; out.games['deep-' + s] = runGameCase(s, true); }
  console.log(`ran ${N_BATTLES} battles in ${tB - t0} ms and ${N_GAMES + N_DEEP} games in ${Date.now() - tB} ms`);
  return out;
}

/* ---------- record / check ---------- */
if (mode === 'record'){
  const res = runAll();
  // determinism check: a second run of a sample must match exactly, or the golden file is worthless
  for (const s of [1000, 1001, 1002]) if (JSON.stringify(runBattleCase(s)) !== JSON.stringify(res.battles[s])){ console.error(`battle ${s} is not repeatable`); process.exit(1); }
  { const g = runGameCase(5000, false); if (g.detail !== res.games['fast-5000']?.detail){ console.error('game 5000 is not repeatable'); process.exit(1); } }
  const file = { made: new Date().toISOString(), html: path.basename(HTML), counts: { battles: N_BATTLES, games: N_GAMES, deep: N_DEEP }, ...res };
  fs.writeFileSync(OUT, JSON.stringify(file));
  const wins = Object.values(res.battles).reduce((a, b) => (a[b.w + 1]++, a), [0, 0, 0]);
  console.log(`saved ${OUT}  (battle results: ${wins[1]} side 0, ${wins[2]} side 1, ${wins[0]} draws)`);
  process.exit(0);
}

if (!fs.existsSync(OUT)){ console.error(`No ${OUT}. Run "record" on the code BEFORE you refactor.`); process.exit(2); }
const gold = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const c = gold.counts || {};
if (c.battles !== N_BATTLES || c.games !== N_GAMES || c.deep !== N_DEEP) console.log(`note: golden file was recorded with ${JSON.stringify(c)}; checking with the same counts`);
const nb = c.battles ?? N_BATTLES, ng = c.games ?? N_GAMES, nd = c.deep ?? N_DEEP;

let outcome = 0, cosmetic = 0;
const show = [];
for (let k = 0; k < nb; k++){
  const s = 1000 + k, a = gold.battles[s], b = runBattleCase(s);
  if (a.w !== b.w || JSON.stringify(a.left) !== JSON.stringify(b.left)){ outcome++; if (show.length < 8) show.push(`battle ${s}: winner ${a.w} -> ${b.w}, units left ${a.left} -> ${b.left}\n    decks: ${JSON.stringify(battleCase(s))}`); }
  else if (a.log !== b.log || a.snap !== b.snap || a.frames !== b.frames){ cosmetic++; if (show.length < 8) show.push(`battle ${s}: same result, but the replay changed (${a.log !== b.log ? 'log text' : ''}${a.snap !== b.snap ? ' board snapshots' : ''}${a.frames !== b.frames ? ` frames ${a.frames}->${b.frames}` : ''})`); }
}
const games = [...Array(ng)].map((_, k) => ['fast-' + (5000 + k), 5000 + k, false]).concat([...Array(nd)].map((_, k) => ['deep-' + (9000 + k), 9000 + k, true]));
for (const [key, s, deep] of games){
  const a = gold.games[key], b = runGameCase(s, deep);
  if (a.detail === b.detail) continue;
  if (a.winner !== b.winner) outcome++; else cosmetic++;
  if (show.length < 12){
    const r = a.rlog.findIndex((x, j) => JSON.stringify(x) !== JSON.stringify(b.rlog[j]));
    const x = a.rlog[r] || {}, y = b.rlog[r] || {};
    const line = (x.log || []).findIndex((t, j) => t !== (y.log || [])[j]);
    show.push(`game ${key}: winner ${a.winner} -> ${b.winner}; first difference in round ${r + 1}` +
      (line >= 0 ? `\n    was: ${x.log[line]}\n    now: ${(y.log || [])[line]}` : `\n    was: ${JSON.stringify({decks:x.decks, money:x.money})}\n    now: ${JSON.stringify({decks:y.decks, money:y.money})}`));
  }
}
for (const s of show) console.log(s);
if (!outcome && !cosmetic){ console.log(`PASS: all ${nb} battles and ${games.length} games match.`); process.exit(0); }
console.log(`FAIL: ${outcome} case(s) with a different result, ${cosmetic} with the same result but different details.`);
process.exit(1);
