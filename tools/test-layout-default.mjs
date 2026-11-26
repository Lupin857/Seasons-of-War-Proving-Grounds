// Small regression check for the one-screen layout's persisted desktop preference.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/rug.js', import.meta.url), 'utf8');
const match = source.match(/function matDeskOn\(\)\s*\{[^\n]*\}/);
assert.ok(match, 'matDeskOn exists in js/rug.js');
const readPreference = storage => vm.runInNewContext(`${match[0]}; matDeskOn()`, {localStorage:storage});
const values = new Map();
const storage = {getItem:key => values.get(key) ?? null};

assert.equal(readPreference(storage), true, 'new players get the desktop one-screen layout');
values.set('oasisMatDesk', '0');
assert.equal(readPreference(storage), false, 'an explicit saved opt-out is respected');
values.set('oasisMatDesk', '1');
assert.equal(readPreference(storage), true, 'an explicit saved opt-in is respected');
assert.equal(readPreference({getItem(){throw new Error('storage unavailable');}}), true, 'storage errors use the default');

console.log('PASS one-screen layout preference defaults on and respects saved choices');
