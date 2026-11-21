# Code map

Search by name or banner; line numbers drift. Sections are marked with banners like
`/* ===================== BATTLE ENGINE ===================== */`, so `grep -n '=====' index.html | cut -c1-120`
gives a table of contents.

## Files
- `index.html` (~1.1 MB, ~12,900 lines): the whole game. CSS first, then the script blocks below.
- `cubes.js` (~640 KB): a minified three.js bundle that draws the 3D wooden damage cubes. It exposes
  `window.OasisCubes` (`warm`, `prepare`, `afterRender`, `settle`, `koNow`). Don't edit it by hand; it's loaded
  `defer` at the end of index.html.
- `art/<Oasis name>.webp`: Brian's Dextrous card fronts (750×1037), mirrored from the artifact's `art/` folder.
  `art/tabmask.svg` is the phone crop shape.
- `tools/golden.mjs` + `golden.json`: engine golden test. `tools/refresh-snapshot.mjs`: snapshot refresh.

## Script blocks in index.html (in order)
1. PeerJS (minified, online play)
2. `<script type="application/json" id="snapshot">`: balance, AI, ratings, card stats (one ~1 MB line)
3. `<script id="engine">`: rules + AI. Also runs in Web Workers and in the tests, so **no DOM code here**.
4. `<script id="oasis-names">`: `OASIS_NAMES`, `dispName`, `oasisText`, and the live renamer
5. `<script id="oasis-art">`: `OASIS_ART` (cards with Dextrous art), `TOK_ART`, `artURL`
6. Main UI script (the biggest block)
7. Small fix-up script: `resumeOrStart`
8. `<script id="oasis-desktop-js">`: desktop card panel on the right (≥1200 px), hover to read full size
9. `<script id="oasis-mobile-crop-js">`: phone crop to the type tab (inline `#tabclip` clip path); reuses card images
   between redraws
10. `<script id="lab-js">`: Board settings (`LAB_DEF`, saved in `localStorage.oasisBoard`), table view, depth, splay,
    the clash animation, cube hooks
11. `<script id="oasis-cards-js">`: Cards tab, built with `cardFace()` and `openPeek`

## Engine (`#engine`)
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

## Main UI script
Banners: SHARED UI HELPERS → SOUND → WHO IS VIEWING → GAME LENGTHS → BATTLE VIEW → PLAY → MATCH RECORDER → AI THINKING
→ CARD MOTION (shop) → ONLINE PLAY → SHOP MOVES → MIRACLES IN HAND → SELF-PLAY → TRAIN VIEW → STATS VIEW → BALANCE LAB
→ SHARE WITH CLAUDE (db) → ONE AI EVERYWHERE → PLAYER MODE → FINALIZED BALANCE → RATINGS → NEW GAME: MODE + SETUP →
CARD PEEK (keywords) → TOOLTIPS.
- Tabs: Play, Cards, Train the AI, Balance & stats (`view-lab` on top, designers only; `view-stats` below), Rules.
- Roles: `applyRole`, `isPlayer()`. The owner is the designer; shared viewers are players (no lab or training).
- Balance: `FINAL = {ov, at, patches}`, server doc `balance/final`. `setBaseline`, `finalizeBalance(ov, back)` pushes
  a patch (rollback = a new patch with `back`), `finalBoxHTML` shows the patch history. `renderLab`.
- Stats/pairs: `renderStats`, `pairsHTML`. Training: `renderTrain`. Shop bar: `slotsHTML`. Play: `renderPlay`.
- Server sync (artifact only): `pushBrain` (AI in chunks `aibrain/c0..`, meta `ai/brain`), `loadPlayerStats`
  (`sync/*`), ratings `calibration/ladder`.
- Workers: `aiWorkerMain`, `workerMain` (source = engine text + function).

## Stacked wrappers: check every layer
Later script blocks wrap earlier functions instead of editing them (`const rp = renderPlay; renderPlay = function(){
... rp.apply(this, arguments) ... }`). Currently wrapped:
- `renderPlay` (5 layers): error box (oasis-art); reserved battle row heights (next to `goFrame`); image reuse
  between redraws, then cube sync + ability-note fade (mobile-crop-js); `lab-inbattle` body class (lab-js)
- `cardHTML`: card stock and light layers (lab-js)
- `cardPop`, `openPeek`: eager art / canvas (mobile-crop-js)
- `goFrame` (2 layers): cube lift-off / settle and heal refill (mobile-crop-js); splay glide of a new revealed unit
  (lab-js). The save slide-under (`deckFly`) is in the base function.
- `pokeArt`: reassigned in lab-js (copies in one band with a count; room always `STACK_MAX` bands, see `labFixedRoom`)
- `reserveRows`: fixed room per spot from `labFixedRoom`, row heights kept across battles in `window.__rowKeep`
These layers are a known tangle; merging them into their base functions is planned cleanup (rule 7: add no more).

When changing one of these, `grep -n 'NAME = function'` first and read every wrapper, because a fix in the base can be
undone or doubled by a wrapper. Prefer editing the base function over adding another wrapper; add a wrapper only for
an optional layer (like Board settings) and list it here.

The CSS is layered the same way: later blocks restyle earlier ones (e.g. "ONE CARD SIZE", "battle table: every card
is a square", then the art-card and Board-settings rules). Search for every rule on a selector before adding a new one.

## Reuse list: use these before writing new code
- **One card face:** `cardFace(name, kind, own, noNext)` (inner `cardFace0`) for every card that should look the
  same; places add their own wrappers. Battle cards: `cardHTML(u, side, mode)`. Market: `marketCard` (tags the card
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
- **Large card view:** `openPeek` / `cardPop`. **Damage cubes:** `OasisCubes` via the hooks in lab-js.
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
