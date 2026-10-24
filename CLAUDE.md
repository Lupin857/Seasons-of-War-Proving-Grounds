# Seasons of War (SOW) · Proving Grounds: notes for Claude

This repo is the GitHub Pages copy of the **SOW Proving Grounds** artifact
(https://claude.ai/code/artifact/8f48cb3f-5b65-4753-a023-809236a6c4e2). Everything is in `index.html`
(about 1.8 MB, 9,000+ lines). Brian designs the game; he usually wants changes tested in the artifact first,
then pushed here.

## Workflow for a change
1. Get the live page: Artifact `read` with `path: "index.html"` saves it to a file without printing it.
   Before publishing, a plain `read` (no path) is required as a version check. It prints about 16 KB of CSS, so do it once, right before publishing.
2. Edit a copy in the scratchpad (a Python or Node script with exact-match replacements, asserting each matches once).
3. Syntax-check every non-JSON `<script>` with `new Function(...)` in Node.
4. Run the tests (below), publish the artifact, then copy the file here **without the trailing newline**
   (`head -c -1 page.html > index.html`), commit and push to `main`. Commit messages end with "(artifact vNNN)".

## Tests (`tools/`)
- `node tools/golden.mjs check` (~50 s): 1,000 seeded battles + 44 seeded AI-vs-AI games through the engine.
  Pure refactors must PASS. For an intended rule change, run `record` instead and say so in the commit.
  Run it only when the engine, rules or AI code changed; skip it for UI-only changes.
- There is no UI golden test anymore (Brian dropped it, Oct 2026). Check UI changes with headless screenshots.
- Headless screenshots: Playwright is global (`createRequire(\`${npm root -g}/\`)('playwright')`), Chromium at
  `/opt/pw-browsers/chromium`. Under file:// the page drops to player view; for the designer view run
  `canAdmin = true; playerPreview = false; applyRole()` after load.

## Keeping the site in sync: refresh the snapshot
The site can't reach the artifact's server database, so it plays from the JSON in
`<script type="application/json" id="snapshot">` (balance, AI, ratings, card stats). Refresh it whenever
the balance, AI or stats changed:
1. ArtifactData `list` with `out_dir` (never print inline) for each collection: `balance`, `ai`, `aibrain`,
   `calibration`, `sync`, all into one folder.
2. `node tools/refresh-snapshot.mjs --db <folder> --html <page>`
3. Publish and push as usual.

## Map of index.html (search by name; line numbers drift)
Script blocks: PeerJS (minified, online play) → `#snapshot` JSON (one ~1 MB line: **never grep without
`| cut -c1-200`**) → `<script id="engine">` (rules + AI, also run in Web Workers and by the tests) → main
UI script.

**Engine (`#engine`)**
- Card data: `const DEFS` (units), `const BDEFS` (buildings), `const MIRS` (miracles). These are "sheet" numbers.
- `const RULES`: buysPerShop, fieldsPerShop, citySlots, deckCap, baseIncome, display sizes, target score.
- `SHEET` (never changes) / `ORIG` (sheet + pushed balance = the base) / `applyOverrides(ov)` puts overrides
  on top. Overrides look like `{units:{Name:{c,n,p,v,...}}, bldgs:{...}, mirs:{...}, rules:{...}}`.
- `describeOverrides`, `patchDiff(a, b)` (old → new lines), `seedPatches(doc)`.
- Shop: `buyQuote` (price + slot: base / carp / fav / extra), `useSlot`, `baseLeft`, `income`, `newGame`.
- Battle: `runBattle`. Full AI round: `autoRound`. AI card values: `aiValue`.
- Stats: `recordStats(stats, g)` covers card win rates plus `__pairs` (same side), `__adj` (front → behind)
  and `__vs` (counters), all per battle. Buildings in a city count as part of that side (`g.battles[].c`).

**UI script**
- Tabs: Play, Train the AI, Balance & stats (`view-lab` on top, designers only; `view-stats` below), Rules.
- Roles: `applyRole`, `isPlayer()`. The owner is the designer; shared viewers are players (no lab or training).
- Balance: `FINAL = {ov, at, patches}`, server doc `balance/final`. `setBaseline`, `finalizeBalance(ov, back)`
  pushes a patch (rollback = a new patch with `back`), `finalBoxHTML` shows the patch history. `renderLab`.
- Stats/pairs: `renderStats`, `pairsHTML`. Training: `renderTrain`. Shop bar: `slotsHTML`. Play: `renderPlay`.
- Server sync (artifact only): `pushBrain` (AI in chunks `aibrain/c0..`, meta `ai/brain`),
  `loadPlayerStats` (`sync/*`), ratings `calibration/ladder`.
- Workers: `aiWorkerMain`, `workerMain` (source = engine text + function).

## Cheap habits
- Search with Grep/`grep -n ... | cut -c1-250`, then read only the lines you need. Never read the whole file.
- Read database documents with `out_dir`, not inline.
- Game rules and design history live in Brian's memory notes. Ask him if a rule seems unclear rather than inferring it from the code.
