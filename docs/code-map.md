# Code map

Search by name or banner; line numbers drift. Engine areas are separate numbered files under `js/engine/`.
Other sections inside a file may be marked with banners like `/* ===================== BATTLE ENGINE ===================== */`.
`grep -rn NAME js css` finds anything across files.

## Files (split out of one 1.1 MB index.html in Nov 2026, v57)
The artifact and this repo have the same file tree. Every script is a plain classic script: they all share one
global scope and run in the order index.html loads them, exactly like the old inline blocks.
- `index.html` (~24 KB): the page markup, the 372-byte reset style, the `#snapshot` JSON (balance, AI, ratings,
  card stats, one long line, about 13 KB in Nov 2026), and the `<link>` / `<script src>` tags below, in order.
- `css/` (loaded in this order; later files restyle earlier ones, so search every file for a selector):
  `01-battle-card.css` (battle card look, Marcellus import) → `02-board-settings.css` (Board settings / table view)
  → `03-main.css` (the big base layout) → `04-desktop-art.css` (art cards, desktop panel) → `05-fixes.css` (later
  fixes) → `06-mobile-crop.css` (phone type-tab crop) → `07-no-anchor.css` → `08-cards-tab.css` → `09-mobilize.css` (the Mobilize screen) → `10-game-menu.css` (the game top bar's ☰ menu; hides the title and tabs
  during a game; the desktop version of the top bar).
  Image paths in CSS are relative to the CSS file: `url(../art/...)`.
- `js/vendor/peerjs.min.js`: PeerJS (online play). Don't edit.
- `js/engine/00-runtime-state.js`: engine-owned mutable switches, hooks, and caches. Legacy accessors preserve the
  existing UI and worker bindings while engine code uses the grouped state object.
- `js/engine/01-card-data.js` through `js/engine/09-learning.js`: card data, battle, miracles, game, balance, shop,
  AI, search, and training in dependency order. They are classic scripts with no DOM code; legacy function bindings
  remain available while callers migrate to the public API.
- `js/engine.js`: the final script and stable `OasisEngine` public API. Page and worker load the same ordered list
  from `data-engine-module` script tags; `engineWorkerURL` includes every tagged file with its cache stamp. Add or
  reorder a module in `index.html` and `sw.js` together. Tests load those same scripts through `engineSource`.
- `js/names.js`: `OASIS_NAMES`, `dispName`, `oasisText`, and the live renamer. `js/art.js`: `OASIS_ART`, `TOK_ART`,
  `artURL`.
- `js/ui/NN-*.js`: the main UI, one file per area, in load order:
  `00-core` (error safety net, `engineWorkerURL`, shared UI helpers, sound, who is viewing, game lengths) ·
  `01-battle-view` · `02-match-recorder-ai-worker` (match recorder, AI thinking in a worker) · `03-card-motion` ·
  `04-online` · `05-shop-moves` · `06-market-popups-tokens` (market decks, peek window, the pop-up, token slides) ·
  `07-battle-steps` (step animation, ability notes, auto-play, `goFrame`, `stepForward`) ·
  `08-flips-reminders-banners` (market card flip, pass reminders, turn banners) · `09-play-screen` (`renderPlay`,
  battle centering, save/resume, deals, stacking order `LAYER`; ends with the renderPlay error-box and reserved-rows
  layers) · `10-mobilize` (all of Mobilize: deck data helpers, drawing the deck and bench, one input controller for drag and tap) · `11-self-play` (worker pool) · `12-train-view` ·
  `13-stats-view` · `14-balance-lab` · `15-sync-roles-ratings` (keep scroll, share with Claude, one AI everywhere,
  player mode, finalized balance, ratings) · `16-new-game` · `17-card-peek-tooltips` (ends with the STARTUP SYNC,
  which must start after every UI file has loaded) · `18-game-menu` (the ☰ menu in the game top bar: the tabs and the
  sound switch while a game is on screen, plus BATTLE CODES: copy / load / replay a battle; after `js/cards-tab.js`) · `19-battle-ink` (the battle's ink strokes and the
  ability notes' brush dabs, on its own animation loop; it reads the step being started from `ui.inkStart`, set by
  `stepForward`; designed in the "Oasis battle lab: ink helpers" artifact).
  `20-mat-shop` (v89, the one-screen UI: `matShopOn()` enables it when `localStorage.oasisRug` is not '0' and the
  device is a phone ≤640 px or the default-on desktop table preference. The shop, Mobilize and battle sit on one fixed
  screen. Fixed flat bars (`matSeatHTML(i, mode)`, `.osbar osbar-<mode>`):
  the rival's under the top bar, yours above the dock, each with the Caravan and, in shop/Mobilize, hand spot, deck
  pile and purse; `matBarsAfterDraw` (renderPlay step) places them. The tilted mat between them holds the trays
  (`matTraysHTML`: Units tray with its deck, discard pile, Support & gear tray). Tap to read lifts a card out of the
  tilt (MATLIFT, `matLiftOpen/Close`); buys, sells, deals and the rival's moves fly along one arc in the tilt
  (`matArc`, `matPose`/`matTiltMatrix`, `matCrop`, `matFlyBox` `.osfly`, `matLand`, `matSpotRect`, MATLANDS /
  `matLandAfterDraw`, `matFlightFrame`, MATOPP / `matOppBuy` / `matOppSell` / `matOppStand`). Built in the
  "Oasis one-screen (dev)" artifact, dev4–dev30; build notes in the Project docs "Oasis one-screen ..." ). On the
  desktop Mobilize mat, a hovered deck card lifts into its readable preview while cards above and below shift outward;
  the numbered source stays visible and deck order does not change.
  Fitting any phone (v90): on the mat `#gtop` is pinned under the notch (it was sticky, but the mat holds the page
  at scroll 0); `matBarsAfterDraw` measures `--gtb` (top bar's bottom) and `--dockh` (from the dock's real top edge)
  and re-runs on resize, visualViewport resize and a ResizeObserver (border box) on #gtop and #dock; `matFitMat`
  shrinks the shop's `--mw` (searching for the widest that fits) when the trays would reach under a bar. In the battle
  `#view-play` gets `padding-top: var(--bh)` for the room the pinned bar no longer takes.
  `js/rug.js` (`rugAfterDraw`: sets `body.os-mat` and, by default, `body.os-sand` (flat sand page); with
  `oasisRug = '1'` draws Brian's WebGL rug `#rugworld` from `art/rug/`). CSS: `css/11-rug.css`, `css/12-mat-shop.css`.
- `js/desktop.js` (desktop card panel ≥1200 px) · `js/mobile-crop.js` (phone crop, image reuse, cube sync, ability
  glow) · `js/board-settings.js` (`LAB_DEF`, `OASIS_BUILD`, table view, depth, splay, clash, cube hooks) ·
  `js/cards-tab.js` (Cards tab).
- `cubes.js` (~640 KB): a minified three.js bundle that draws the 3D wooden damage cubes. It exposes
  `window.OasisCubes` (`warm`, `prepare`, `afterRender`, `settle`, `koNow`). Don't edit it by hand; it's loaded
  `defer` at the end of index.html.
- `art/<Oasis name>.webp`: Brian's Dextrous card fronts (750×1037), mirrored from the artifact's `art/` folder.
  `art/tabmask.svg` is the phone crop shape.
- Installable app (Nov 2026, v87): `manifest.webmanifest` (name, icons, standalone launch), `icons/` (placeholder
  icons cropped from the Might medallion), and `sw.js`, a service worker registered by a small script at the end of
  index.html. `sw.js` precaches the code (`CORE` list) and, once the page has loaded, the card art (`ART` list).
  Code and pages are network first (online players always get the newest files; the cache is only the offline
  fallback); images and Google Fonts are cache first. **When you add, remove or rename a file the page loads, update
  `CORE`/`ART` in sw.js and bump its `VERSION`**, or offline play misses the file (a missing `CORE` file makes the
  whole install fail). Service workers don't run inside claude.ai, so test it on the GitHub site or a local http
  server. On iPhone the home-screen app keeps its own storage, separate from Safari's.
- `tools/`: `check-page.mjs` (syntax, repeated global names, load order), `engine-contract.mjs` (module order and
  public API), `golden.mjs` + `golden.json` (engine golden
  test), `screens.mjs` + `screens-diff.mjs` (seeded-game screenshots, before/after), `refresh-snapshot.mjs`,
  `page-files.mjs` (shared: finds the page's scripts).

## Rules for the split files
- **Load order matters at load time only.** Code at the top level of a file (not inside a function) runs as the file
  loads and can only use names from this file or earlier ones. Wrapping a function (`const f = x; x = ...`) is
  top-level code: it goes after the file that declares `x`. `check-page.mjs` catches mistakes.
- Calls inside functions, event handlers and timers can use anything, since they run after the page has loaded.
- New code goes in the file for its area. A new area gets a new numbered file and a `<script src>` line in
  index.html at the right place; list it here.

## Engine (`js/engine/*.js`, then `js/engine.js`)
Banners: CARD DATA → BATTLE ENGINE (incl. battle miracles) → FULL GAME → MIRACLES → BALANCE OVERRIDES → AI (rated
strength ladder, gear for the AI, opponent model) → SEARCH → playouts → mixed mobilize → COMBO TABLE → LEARNING →
TRAINING (evolution strategies, SPRT safety check, hall of fame, learned pairings, situational opinions).
- Card data: `const DEFS` (units) and `const BDEFS` (buildings/supports), in `01-card-data`; `const MIRS` (miracles)
  is in `03-miracles`. These are the
  "sheet" numbers and must match Brian's Google Sheets.
- `const RULES`: buysPerShop, fieldsPerShop, citySlots, deckCap, baseIncome, display sizes, target score.
- `SHEET` (never changes) / `ORIG` (sheet + pushed balance = the base) / `applyOverrides(ov)` in `05-balance` puts overrides on top.
  Overrides look like `{units:{Name:{c,n,p,v,...}}, bldgs:{...}, mirs:{...}, rules:{...}}`.
- `describeOverrides`, `patchDiff(a, b)` (old → new lines), `seedPatches(doc)`.
- Shop: `buyQuote` (price + slot: base / carp / fav / extra), `useSlot`, `baseLeft`, `income`, `newGame`.
- Battle: `runBattle` (`02-battle`). Game creation and full AI round: `newGame` / `autoRound` (`04-game`). AI card
  values: `aiValue` (`07-ai`). Shop pricing and actions are in `06-shop`.
- Public API: `OasisEngine` (`js/engine.js`) groups `cards`, `rules`, `battle`, `game`, `shop`, `ai`, `balance`,
  `stats`, `settings`, and deterministic `random` helpers. Keep this surface stable; add implementation-only helpers
  to the relevant module without widening it. Mutable settings and hooks are held in the runtime-state module;
  compatibility accessors let existing UI code keep using its current names.
- Stats: `recordStats(stats, g)` covers card win rates plus `__pairs` (same side), `__adj` (front → behind) and
  `__vs` (counters), all per battle. Buildings in a city count as part of that side (`g.battles[].c`).

## Main UI (`js/ui/`)
Banners: SHARED UI HELPERS → SOUND → WHO IS VIEWING → GAME LENGTHS → BATTLE VIEW → PLAY → MATCH RECORDER → AI THINKING
→ CARD MOTION (shop) → ONLINE PLAY → SHOP MOVES → MIRACLES IN HAND → SELF-PLAY → TRAIN VIEW → STATS VIEW → BALANCE LAB
→ SHARE WITH CLAUDE (db) → ONE AI EVERYWHERE → PLAYER MODE → FINALIZED BALANCE → RATINGS → NEW GAME: MODE + SETUP →
CARD PEEK (keywords) → TOOLTIPS.
- During a game the Oasis title, sound button and tabs are hidden; the ☰ at the left of the game top bar
  (`pbarHTML` in 06, the same bar on every game screen) opens them (`js/ui/18-game-menu.js`).
- Battle codes (`js/ui/18-game-menu.js`): `runBattle(cfgs, true)` keeps a copy of both armies as `res.cfgs`;
  `bcodeOf(res)` turns them (plus build, round, score, names, winner) into `OASIS-BATTLE:<base64 JSON>`, `bcodeParse`
  reads one back. `replayStart(d)` plays a code in a throwaway game: the real `{G, ui}` waits in `G.replay`, `saveNow`
  skips a replay, `phaseLabel` says Replay, `battleDoneLabel` says "Back to your game", `replayEnd()` restores it.
  The paste box is `bcodeWinHTML` in the one pop-up (`ui.codeWin`; `peekWinHTML` draws it). Copying goes through
  `copyText` (02, shared with "Copy match for Claude"). To look at a battle Brian sends: load the page headless,
  then `bcodeLoad(code)`.
- Tabs: Play, Cards, Train the AI, Balance & stats (`view-lab` on top, designers only; `view-stats` below), Rules.
- Roles: `applyRole`, `isPlayer()`. The owner is the designer; shared viewers are players (no lab or training).
- Balance: `FINAL = {ov, at, patches}`, server doc `balance/final`. `setBaseline`, `finalizeBalance(ov, back)` pushes
  a patch (rollback = a new patch with `back`), `finalBoxHTML` shows the patch history. `renderLab`.
- Stats/pairs: `renderStats`, `pairsHTML`. Training: `renderTrain`. Shop bar: `slotsHTML`. Play: `renderPlay`.
- Player shop moves: `playerMove(a)` (`a` = `['b', src, idx, ...]`, `['p']`, `['s', kind, name]`...). It was called
  `doMove` until v56, which clashed with the engine's `doMove(g, j, m)` (the AI's trial moves). Don't reuse engine names.
- Server sync (artifact only): `pushBrain` (AI in chunks `aibrain/c0..`, meta `ai/brain`), `loadPlayerStats`
  (`sync/*`), ratings `calibration/ladder`.
- Workers: `aiWorkerMain`, `workerMain`. `engineWorkerURL(main)` (00-core) builds the worker from every tagged engine
  script, in the same order and with the same cache stamps as the page.

## No wrappers: functions call named steps
Until v58 (v59 for the shop actions), later script blocks wrapped earlier functions (`const rp = renderPlay; renderPlay = function(){ ... }`),
five layers deep on `renderPlay`. Those are gone: each function now lists its steps in order, and steps that belong
to a feature live in that feature's file as plain named functions. **Never wrap or reassign a function**
(`check-page.mjs` flags it); add a step to the function instead.
- `renderPlay()` (js/ui/09-play-screen.js): `playNotesBefore` → `playArtBefore` → `drawPlay` (the Play tab itself,
  inside the error box) → `reserveRows` (battle) → `playArtAfter` → `playNotesAfter` (cube sync, note fade) →
  `labAfterDraw` (`body.lab-inbattle`). The play*/lab* steps are in js/mobile-crop.js and js/board-settings.js and
  are skipped (`typeof` check) until their file has loaded, because a redraw can happen while the page starts.
- `goFrame(k, glide)` (js/ui/07-battle-steps.js): `labBeforeStep` → `cubesBeforeStep` → `showFrame` (the step
  itself; the save slide-under `deckFly` is in it) → `healRefillAfterStep` → `labAfterStep` (splay glide, `labPrep`).
  Only runs after load, so no checks.
- `cardHTML` → `cardHTML0` + `labCardLayers` (card stock and light layers). `pokeArt` (js/board-settings.js) draws the
  stack behind an art card: copies in one band with a count, room always `STACK_MAX` bands (see `labFixedRoom`). The
  older one-step-per-token layout was deleted in v59.
- `cardPop` → `cardPop0` + `popArtEager`; `openPeek` → `peekWhenDecoded` (phones wait for the art) or `openPeek0`.
  Use the `0` versions only where you need the plain card (like `peekWhenDecoded` does).
- `renderTrain` / `renderStats` / `renderLab` → `keepingScroll(view, drawTrain|drawStats|drawLab)` (scroll boxes stay
  put across redraws).
- Shop actions: every one (`buy`, `sell`, `pass`, `useBM`, `useFavor`, `useVision`, `useDisc`, `useWrit`, `useFreeze`,
  `useRedeal`) goes through the engine's `shopAct` ("SHOP ACTIONS: ONE DOOR" in `06-shop.js`); the rules themselves are
  `buyRule`, `sellRule`... Whatever needs to hear about actions sets `SHOP_WATCH = {before, after}`: the match recorder
  (js/ui/02, `REC_ACT` names them in records) and the AI worker (`aiWorkerMain`, reports the moves it made). A new
  shop action gets a `NAMERule` plus one line there, so it is recorded and reported automatically.

The CSS is layered the same way: later blocks restyle earlier ones (e.g. "ONE CARD SIZE", "battle table: every card
is a square", then the art-card and Board-settings rules). Search for every rule on a selector before adding a new one.

## Reuse list: use these before writing new code
- **One card face:** `cardFace(name, kind, own, noNext)` (inner `cardFace0`) for every card that should look the
  same; places add their own outer markup. Battle cards: `cardHTML(u, side, mode)`. Market: `marketCard` (tags the card
  key so animations follow it). Others: `tokCard`, `mirCardHTML`, `spellFace`, `ghostCard`.
- **One card size:** `syncCardSize` → CSS `--uw/--uh`; `cardSize`.
- **Card motion (CARD MOTION section):** `flyer`, `flyTo(from, to, o)`, `flyEl`, `pinFly`, `flyHost`, `cardFlight`;
  z-order from `LAYER` and `flyZ` (flights go under bars and banners). FLIP moves: `slideFrom(rects, els, ms)`.
  Mobilize: `slideMob`, `mobSlide`. Tokens: `flyTok`, `attachTokAnim`, `popTokAnim`, `animateTokens`. Selling:
  `flySell`.
- **Table coordinates:** `tableXY(el, line)` (an element's place in the tilted battle table, before transforms):
  a copy put there inside the table sits on it and tilts with it (`deathFly` flies that way).
- **Breaking a token:** `tokenBreakInfo(pk)` then `breakTokens(list)` (Shield that blocked, Fencer's Might).
  **Token splay:** `labSplayIn(el, delay, only, done)`. **Into the deck:** `deckFly(r0, side, out)`.
- **3D flips:** `dealFly`, `mirTurn`, `deathFly`. Pattern: `perspective(~3.4× card width)` first in every keyframe's
  transform, the same function list in each keyframe, darken a little at edge-on, swap faces at 90° → −90° so no side
  is mirrored. Never fake a flip with `scaleX`.
- **One pop-up:** `popWinHTML` builds every window over the game (`.pkwin > .sheet.pksheet`): deck view
  (`ui.deckView`, `deckSheetHTML`), discard / Black Market / Vision (`ui.pkWin` 'salvage' / 'peek'), Mason's Guild
  ('mason'). Rendered by `peekWinHTML`; `wireSwipe` = drag to dismiss; `popShut()` / `closePkWin()` close it. Phone:
  bottom sheet; wider: centered. Selling from it: card lifts, pop-up closes, then `flySell(..., lifted)`.
- **Large card view:** `openPeek` / `cardPop`. **Damage cubes:** `OasisCubes` via the hooks in js/board-settings.js.
- **Helpers:** `$` (getElementById) and the rest of SHARED UI HELPERS; scroll kept on re-render (KEEP SCROLL).

## Battle record (what the screen reads)
`runBattle(cfgs, true)` returns `frames`; `compactFrames` merges quiet ones. Each frame: `label`, `snap` (both sides'
charge / deck / grave, units by `uid`), `hits` (damage cubes: `{uid, a, heal, from}`), and `lines`, the Chronicle.
A line is `{t, side, ...fields}`. `t` is the sentence for people only (rule 9). Fields:
- `ab`: the ability that wrote it (`{n, u, s, b|g|m}`), for ability notes and the trigger glow
- `from` / `to` / `by` / `amt` / `tok`: the ink strokes (damage, tokens; `tok:'ret'` lines draw none)
- `atk`: the hit comes from an attack (a fight hit, a Marksman shot or its overrun), even with an ability's tag on it
  (the ink gives it the attack curve)
- `via`: an Overrun spill names the unit it spilled through (the stroke carries on from the one into that unit)
- `drop`: tokens an ability discards, `{tok, n}` (Fencer's Might): the screen breaks them on the card
- A save shares its step with the defeats that follow it (the saved unit goes back to its deck as the others go to the
  graveyard); the ink points at the unit to be saved in the step before, from that next step's `mv` `save`.
- `mv`: card moves, `[{u:'side-uid', from, to, k}]`, written by `mvs` in `runBattle`. Zones: `new`, `deck`,
  `deck-top`, `deck-bottom`, `charge`, `grave`. Kinds: `charge`, `defeat`, `save` (Infirmary Tent, Field Medic,
  Second Wind), `back` (Sand Sailor), `arrive` (Drifters from Recruiter / Spineless Recruit). Every zone change has
  one (checked over 3,000 random battles). The screen reads them with `frameMoves(frame)`.
Unit IDs are unique per battle across both sides; the screen tags cards `data-uid="side-uid"`.
Still to move onto fields: `from` is found by matching the sentence start (`srcUnit`). Fix it when touching hitMeta.
