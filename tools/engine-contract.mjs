#!/usr/bin/env node
// Contract checks for the engine's page/worker module boundary and stable public API.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { pageScripts } from './page-files.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const moduleIds = [...html.matchAll(/<script\b([^>]*)>/g)]
  .map(([, attrs]) => ({
    id: (attrs.match(/\bid="([^"]+)"/) || [])[1],
    module: (attrs.match(/\bdata-engine-module="([^"]+)"/) || [])[1],
  }))
  .filter(x => x.module)
  .map(x => x.module);

assert.deepEqual(moduleIds, [
  'runtime-state', 'card-data', 'battle', 'miracles', 'game', 'balance', 'shop', 'ai', 'search', 'learning', 'raid', 'public-api',
], 'engine modules must load once in their documented dependency order');
const sw = fs.readFileSync(path.join(here, '..', 'sw.js'), 'utf8');
for (const [, file] of html.matchAll(/<script\b([^>]*)>/g)) {
  const src = (file.match(/\bsrc="([^"]+)"/) || [])[1];
  if (!src || !/\bdata-engine-module="/.test(file)) continue;
  assert.ok(sw.includes(`"${src.split('?')[0]}"`), `service worker CORE must cache ${src.split('?')[0]}`);
}

const ctx = vm.createContext({ console });
for (const script of pageScripts(htmlPath).filter(x => x.engineModule)) {
  vm.runInContext(script.src, ctx, { filename: script.file || script.id });
}
const api = ctx.OasisEngine;
const moduleSource = new Map(pageScripts(htmlPath).filter(x => x.engineModule).map(x => [x.engineModule, x.src]));
assert.match(moduleSource.get('miracles'), /const MIRS =/, 'miracle card data must live in its own module');
assert.match(moduleSource.get('game'), /function newGame\(/, 'game creation must live in the game module');
assert.match(moduleSource.get('game'), /function autoRound\(/, 'round orchestration must live in the game module');
assert.match(moduleSource.get('shop'), /function buyQuote\(/, 'shop pricing must live in the shop module');
assert.doesNotMatch(moduleSource.get('balance'), /function newGame\(|function buyQuote\(/, 'balance module must not own game setup or shop pricing');
assert.ok(api && Object.isFrozen(api), 'OasisEngine must expose a stable, frozen API object');
for (const [area, methods] of Object.entries({
  battle: ['run'],
  game: ['create', 'autoRound'],
  shop: ['act'],
  ai: ['value'],
  random: ['mulberry32'],
  balance: ['applyOverrides'],
  stats: ['record'],
  settings: ['get', 'set'],
})) {
  assert.ok(api[area], `OasisEngine.${area} must exist`);
  for (const method of methods) assert.equal(typeof api[area][method], 'function', `OasisEngine.${area}.${method} must be callable`);
}
assert.equal(typeof api.ai.baseGenome, 'function', 'OasisEngine.ai.baseGenome must be callable');
assert.ok(api.ai.depth && api.ai.depth.train, 'OasisEngine.ai.depth must expose the built-in training budget');
assert.throws(() => api.shop.act('constructor', null, 0), err => err && err.name === 'RangeError', 'shop action dispatch must reject inherited property names');
const originalSettings = api.settings.get();
api.settings.set({miracles: !originalSettings.miracles});
assert.equal(ctx.MIRACLES_ON, !originalSettings.miracles, 'settings API must keep the legacy UI switch in sync');
api.settings.set(originalSettings);

const startShop = vm.runInContext('startShop', ctx);
const buyInShop = (game, src, idx) => api.shop.act('buy', game, 0, src, idx);
function openShop(setup){
  const game = api.game.create({rnd:api.random.mulberry32(712), su:setup});
  game.firstOverride = 0;
  startShop(game);
  game.players[0].money = 30;
  return game;
}
const regular = openShop();
assert.equal(regular.buys[0].cap, 3, 'the default shop starts with three regular buys');
assert.equal(buyInShop(regular, 'recruit'), true, 'a Drifter uses a regular buy');
assert.equal(api.shop.act('pass', regular, 1), true);
assert.equal(buyInShop(regular, 'field'), true, 'a Moisture Harvester uses the same buy pool');
assert.equal(buyInShop(regular, 'field'), false, 'the default Harvester limit is one per shop');
assert.equal(buyInShop(regular, 'recruit'), true, 'the third regular buy succeeds');
assert.equal(buyInShop(regular, 'recruit'), false, 'a fourth regular buy is unavailable even with spare water');

regular.buys[0].extra = true;
assert.equal(buyInShop(regular, 'recruit'), false, 'a legacy saved paid buy does not affect the regular limit');
regular.players[0].city["Carpenter's Guild"] = 1;
assert.equal(buyInShop(regular, 'recruit'), true, 'Mobile Workshop still grants its card buy');
regular.players[0].mir.push('Divine Favor');
assert.equal(api.shop.act('useFavor', regular, 0), true);
assert.equal(buyInShop(regular, 'recruit'), true, 'Divine Favor still grants its card buy');
assert.equal(buyInShop(regular, 'recruit'), false, 'card buys run out after use');

const custom = openShop({pl:[{buys:2}, {buys:4}]});
custom.players[0].city['War College'] = 1;
custom.players[0].gear.Lance = 1;
custom.muster.push('Lance');
assert.equal(custom.buys[1].cap, 4, 'custom allowances may differ by player');
assert.equal(buyInShop(custom, 'mu', 0), true, 'Scrapyard lets players buy an owned gear duplicate');
assert.equal(custom.players[0].money, 30, 'Scrapyard duplicates are free');
assert.equal(api.shop.act('pass', custom, 1), true);
assert.equal(buyInShop(custom, 'recruit'), true);
assert.equal(buyInShop(custom, 'recruit'), false, 'Scrapyard spends one of the player’s custom regular buys');

console.log(`PASS: ${moduleIds.length} ordered engine modules and stable OasisEngine API`);
