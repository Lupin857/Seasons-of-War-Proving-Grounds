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
  'runtime-state', 'card-data', 'battle', 'miracles', 'game', 'balance', 'shop', 'ai', 'search', 'learning', 'public-api',
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
console.log(`PASS: ${moduleIds.length} ordered engine modules and stable OasisEngine API`);
