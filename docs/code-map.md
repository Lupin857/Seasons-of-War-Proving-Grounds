# Code map

Search by name or banner; line numbers drift. Sections inside a file are marked with banners like
`/* ===================== BATTLE ENGINE ===================== */`, so `grep -n '=====' js/engine.js | cut -c1-120`
gives a table of contents. `grep -rn NAME js css` finds anything across files.

## Files (split out of one 1.1 MB index.html in Nov 2026, v57)
The artifact and this repo have the same file tree. Every script is a plain classic script: they all share one
global scope and run in the order index.html loads them, exactly like the old inline blocks.
- `index.html` (~24 KB): the page markup, the 372-byte reset style, the `#snapshot` JSON (balance, AI, ratings,
  card stats, one long line, about 13 KB in Nov 2026), and the `<link>` / `<script src>` tags below, in order.
- `css/` (loaded in this order; later files restyle earlier ones, so search every file for a selector):
  `01-battle-card.css` (battle card look, Marcellus import) → `02-board-settings.css` (Board settings / table view)
  → `03-main.css` (the big base layout) → `04-desktop-art.css` (art cards, desktop panel) → `05-fixes.css` (later
  fixes) → `06-mobile-crop.css` (phone type-tab crop) → `07-no-anchor.css` → `08-cards-tab.css`.
  Image paths in CSS are relative to the CSS file: `url(../art/...)`.
- `js/vendor/peerjs.min.js`: PeerJS (online play). Don't edit.
- `js/engine.js`: rules + AI. Also runs in Web Workers (loaded by URL, see `engineWorkerURL`) and in the tests, so
  **no DOM code here**.
- `js/names.js`: `OASIS_NAMES`, `dispName`, `oasisText`, and the live renamer. `js/art.js`: `OASIS_ART`, `TOK_ART`,
  `artURL`.
- `js/ui/NN-*.js`: the main UI, one file per area, in load order:
  `00-core` (error safety net, `engineWorkerURL`, shared UI helpers, sound, who is viewing, game lengths) ·
  `01-battle-view` · `02-match-recorder-ai-worker` (match recorder, AI thinking in a worker) · `03-card-motion` ·
  `04-online` · `05-shop-moves` · `06-market-popups-tokens` (market decks, peek window, the pop-up, token slides) ·
  `07-battle-steps` (step animation, ability notes, auto-play, `goFrame`, `stepForward`) ·
  `08-flips-reminders-banners` (market card flip, pass reminders, turn banners) · `09-play-screen` (`renderPlay`,
  battle centering, save/resume, deals, stacking order `LAYER`; ends with the renderPlay error-box and reserved-rows
  layers) · `10-mobilize-input` (tap and drag in Mobilize) · `11-self-play` (worker pool) · `12-train-view` ·
  `13-stats-view` · `14-balance-lab` · `15-sync-roles-ratings` (keep scroll, share with Claude, one AI everywhere,
  player mode, finalized balance, ratings) · `16-new-game` · `17-card-peek-tooltips` (ends with the STARTUP SYNC,
  which must start after every UI file has loaded).
- `js/desktop.js` (desktop card panel ≥1200 px) · `js/mobile-crop.js` (phone crop, image reuse, cube sync, ability
  glow) · `js/board-settings.js` (`LAB_DEF`, `OASIS_BUILD`, table view, depth, splay, clash, cube hooks) ·
  `js/cards-tab.js` (Cards tab).
- `cubes.js` (~640 KB): a minified three.js bundle that draws the 3D wooden damage cubes. It exposes
  `window.OasisCubes` (`warm`, `prepare`, `afterRender`, `settle`, `koNow`). Don't edit it by hand; it's loaded
  `defer` at the end of index.html.
- `art/<Oasis name>.webp`: Brian's Dextrous card fronts (750×1037), mirrored from the artifact's `art/` folder.
  `art/tabmask.svg` is the phone crop shape.
- `tools/`: `check-page.mjs` (syntax, repeated global names, load order), `golden.mjs` + `golden.json` (engine golden
  test), `screens.mjs` + `screens-diff.mjs` (seeded-game screenshots, before/after), `refresh-snapshot.mjs`,
  `page-files.mjs` (shared: finds the page's scripts).

## Rules for the split files
- **Load order matters at load time only.** Code at the top level of a file (not inside a function) runs as the file
  loads and can only use names from this file or earlier ones. Wrapping a function (`const f = x; x = ...`) is
  top-level code: it goes after the file that declares `x`. `check-page.mjs` catches mistakes.
- Calls inside functions, event handlers and timers can use anything, since they run after the page has loaded.
- New code goes in the file for its area. A new area gets a new numbered file and a `<script src>` line in
  index.html at the right place; list it here.

## Engine (`js/engine.js`)
Banners: CARD DATA → BATTLE ENGINE (incl. battle miracles) → FULL GAME → MIRACLES → BALANCE OVERRIDES → AI (rated
strength ladder, gear for the AI, opponent model) → SEARCH → playouts → mixed mobilize → COMBO TABLE → LEARNING →
TRAINING (evolution strategies, SPRT safety check, hall of fame, learned pairings, situational opinions).
- Card data: `const DEFS` (units), `const BDEFS` (buildings/supports), `const MIRS` (miracles). These are the
  "sheet" numbers and must match Brian's Google Sheets.
- `const RULES`: buysPerShop, fieldsPerShop, citySlots, deckCap, baseIncome, display sizes, target score.
- `SHEET` (never changes) / `ORIG` (sheet + pushed balance = the base) / `applyOverrides(ov)` puts overrides on top.
  Overrides look like `{units:{Name:{c,n,p,v,...}}, bldgs:{...}, mirs:{...}, rules:{...}}`.
- `describeOverrides`, `patchDiff(a, b)` (old → new lines), `seedPatches(doc)`.
- Shop: `buyQuote` (price + slot: base / carp / fav / extra), `useSlot`, `baseLeft`, `income`, `newGame`.
- Battle: `runBattle`. Full AI round: `autoRound`. AI card values: `aiValue`.
- Stats: `recordStats(stats, g)` covers card win rates plus `__pairs` (same side), `__adj` (front → behind) and
  `__vs` (counters), all per battle. Buildings in a city count as part of that side (`g.battles[].c`).

## Main UI (`js/ui/`)
Banners: SHARED UI HELPERS → SOUND → WHO IS VIEWING → GAME LENGTHS → BATTLE VIEW → PLAY → MATCH RECORDER → AI THINKING
→ CARD MOTION (shop) → ONLINE PLAY → SHOP MOVES → MIRACLES IN HAND → SELF-PLAY → TRAIN VIEW → STATS VIEW → BALANCE LAB
→ SHARE WITH CLAUDE (db) → ONE AI EVERYWHERE → PLAYER MODE → FINALIZED BALANCE → RATINGS → NEW GAME: MODE + SETUP →
CARD PEEK (keywords) → TOOLTIPS.
- Tabs: Play, Cards, Train the AI, Balance & stats (`view-lab` on top, designers only; `view-stats` below), Rules.
- Roles: `applyRole`, `isPlayer()`. The owner is the designer; shared viewers are players (no lab or training).
- Balance: `FINAL = {ov, at, patches}`, server doc `balance/final`. `setBaseline`, `finalizeBalance(ov, back)` pushes
  a patch (rollback = a new patch with `back`), `finalBoxHTML` shows the patch history. `renderLab`.
- Stats/pairs: `renderStats`, `pairsHTML`. Training: `renderTrain`. Shop bar: `slotsHTML`. Play: `renderPlay`.
- Player shop moves: `playerMove(a)` (`a` = `['b', src, idx, ...]`, `['p']`, `['s', kind, name]`...). It was called
  `doMove` until v56, which clashed with the engine's `doMove(g, j, m)` (the AI's trial moves). Don't reuse engine names.
- Server sync (artifact only): `pushBrain` (AI in chunks `aibrain/c0..`, meta `ai/brain`), `loadPlayerStats`
  (`sync/*`), ratings `calibration/ladder`.
- Workers: `aiWorkerMain`, `workerMain`. `engineWorkerURL(main)` (00-core) builds the worker: `importScripts` of
  js/engine.js plus that function, so there is only one copy of the engine.

## No wrappers: functions call named steps
Until v58, later script blocks wrapped earlier functions (`const rp = renderPlay; renderPlay = function(){ ... }`),
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
- `cardHTML` → `cardHTML0` + `labCardLayers` (card stock and light layers). `pokeArt` → `labPokeArt` (copies in one
  band with a count; room always `STACK_MAX` bands, see `labFixedRoom`); the older layout under it only shows while
  the page is loading.
- `cardPop` → `cardPop0` + `popArtEager`; `openPeek` → `peekWhenDecoded` (phones wait for the art) or `openPeek0`.
  Use the `0` versions only where you need the plain card (like `peekWhenDecoded` does).
- `renderTrain` / `renderStats` / `renderLab` → `keepingScroll(view, drawTrain|drawStats|drawLab)` (scroll boxes stay
  put across redraws).
- Still intercepted, on purpose for now: the match recorder (js/ui/02, `window[nm] = ...`) wraps the engine's shop
  actions (`buy`, `sell`, `pass`, `useBM`...) to record each one with the board before it, and the AI worker does
  the same inside its own worker to send back the actions it took. Replacing these means the engine reporting its
  own actions (like the battle Chronicle does); ask Brian before changing it.

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
- `from` / `to` / `by` / `amt` / `tok`: arrows (damage, tokens; `tok:'ret'` = a save, drawn into the deck)
- `mv`: card moves, `[{u:'side-uid', from, to, k}]`, written by `mvs` in `runBattle`. Zones: `new`, `deck`,
  `deck-top`, `deck-bottom`, `charge`, `grave`. Kinds: `charge`, `defeat`, `save` (Infirmary Tent, Field Medic,
  Second Wind), `back` (Sand Sailor), `arrive` (Drifters from Recruiter / Spineless Recruit). Every zone change has
  one (checked over 3,000 random battles). The screen reads them with `frameMoves(frame)`.
Unit IDs are unique per battle across both sides; the screen tags cards `data-uid="side-uid"`.
Still to move onto fields: arrows find their source unit by matching the sentence start (`srcUnit`), and building
arrows find their chip by searching `t` for a building name. Fix these when touching arrows.
