# Oasis (formerly Seasons of War / SOW): notes for Claude

This repo is the GitHub Pages copy of the **Oasis** artifact (slug `582be462-0f9f-408f-b686-c833c4db709b`,
https://claude.ai/artifact/BtVWtsTBp4wSnfKSQqKfyc). Friends play it at
https://lupin857.github.io/Seasons-of-War-Proving-Grounds/ (online play over PeerJS, no accounts).
Brian designs the game. Read this file first; open the linked docs only when the task needs them.

## Golden rules
1. **Artifact first, then repo.** Change and test the Oasis artifact first, then copy it here. The site must run
   the artifact's current version with the same balance (see "Refresh the snapshot").
2. **Explain before pushing or publishing.** Send Brian a plain-English summary (see "Before pushing") and wait for
   his go-ahead.
3. **Ask before big token spends.** Long simulations, big rewrites and large searches need a short plan he approves.
4. **Brian's Google Sheets are canon for card data.** The engine's `DEFS` / `BDEFS` / `MIRS` follow the Sheets;
   Dextrous art shows only while a card's numbers still match (`OASIS_ART`). If the Sheets, the code and the art
   disagree, flag it instead of picking a winner. Never take card numbers from memory. Read the Sheets with the
   Google Sheets connector.
5. **Oasis only.** The old *SOW Proving Grounds* artifact (`8f48cb3f-5b65-4753-a023-809236a6c4e2`) is legacy:
   don't edit it or copy from it.
6. **Don't redraw what you weren't asked to change.** Edit existing animations and screen elements in place. Never
   rebuild, restyle, re-time or move an animation or element outside the task. If a change touches shared code
   (`cardFace`, `cardHTML`, `renderPlay`, the CARD MOTION helpers), check that nothing else changed on screen and say
   so in the summary.
7. **Reuse before you write.** Before adding a function, animation, layer or style, look for one that already does
   the job (see the reuse list in docs/code-map.md) and use or extend it. Don't make a second card renderer, fly
   animation or pop-up. If you find two copies of the same thing, point it out and offer to merge them.
   No new wrappers on battle-screen functions (`goFrame`, `stepForward`, `renderPlay`): edit the function itself.
   When you replace a feature, delete the old code in the same change.
8. **Keep the docs current.** Every change updates the matching doc (code map, UI, rules, AI, terminology) in the
   same commit, and the summary says which docs changed.
9. **The engine says what happened; the screen never guesses.** Anything in a battle that moves a card, damages it
   or fires an ability must be recorded by the engine as a structured field on its Chronicle line (unit IDs, from/to
   zone, the card that caused it; see "Battle record" in docs/code-map.md). Screen code must not work out events by
   comparing two board pictures, and must never read a line's sentence text (`l.t`) for meaning: that text is only for
   people. If the screen needs something the engine doesn't record, add it to the engine first.

## Names: internal vs. display
The code keeps the **old SOW names internally** (`Recruit`, `Armament`, `Field`, `Pigeon Hunter`, `city`...).
`OASIS_NAMES` (in `<script id="oasis-names">`) renames everything players read, live, through a MutationObserver.
**Never rename internal names in code** (it breaks the snapshot, saved games, stats and the golden test). To change
what players see, edit `OASIS_NAMES`. Full list and wording style: docs/terminology.md.

## Start of a session
- Clone this repo and read this file before touching the artifact. Check that you can push (ask Brian to allow it
  if not) before the work is done, not after.
- Note the artifact's version (`get_artifact`). Check it again right before every publish. If it changed, another
  chat is working on the artifact: tell Brian before merging, and merge onto the newest version, never over it.
- Ask before building a new animation or look: describe the motion in one sentence and wait for an OK.
- When Brian reports a bug you can't reproduce, first ask which build he's on (Board settings shows it), artifact or
  GitHub site, phone or desktop, before running big test batches.

## Workflow for a change
1. Get the live page: Artifact `read` with `path: "index.html"` saves it to a file without printing it.
   Before publishing, a plain `read` (no path) is required as a version check. It prints about 16 KB of CSS, so do
   it once, right before publishing.
2. Bump `OASIS_BUILD` (next to `LAB_DEF`) to the publish number this publish will get (the current `seq` + 1;
   the publish result reports the real `seq`: if it differs, fix the label and republish). Then edit a copy in the scratchpad (a Python or Node script with exact-match replacements, asserting each matches once).
3. Run `node tools/check-page.mjs <page>` (a few seconds): every script block must parse, and no global name may be
   declared in two blocks (see Tests).
4. Run the tests (below), publish the artifact, then copy the file here byte for byte (`cp page.html index.html`;
   strip a trailing newline only if the saved copy has one: the artifact's file ends in `</html>` with none, and an
   unconditional `head -c -1` cut off that final `>` before Nov 2026). If card art changed in the artifact, copy the
   changed `art/*.webp` files too.
5. After Brian approves: commit and push to `main`. Commit messages end with "(artifact vNNN)".

## Tests (`tools/`)
- `node tools/check-page.mjs` (seconds): every `<script>` parses, and no function/const/let/class name is declared in
  two script blocks. All blocks share one global scope, so a second `function foo` silently replaces the first for
  every caller (Nov 2026: the screen's `doMove` replaced the engine's and broke the AI's main-thread search). Run it
  before every publish, UI changes included. When you add a top-level function, give it a name that says which layer
  it belongs to.
- `node tools/golden.mjs check` (~50 s): 1,000 seeded battles + 44 seeded AI-vs-AI games through the engine.
  Pure refactors must PASS. For an intended rule change, run `record` instead and say so in the commit.
  Run it only when the engine, rules or AI code changed; skip it for UI-only changes.
- There is no UI golden test anymore (dropped Oct 2026; don't bring it back). Check UI changes with headless
  screenshots, at the layout you changed (and the other one if shared code changed).
- Headless screenshots: Playwright is global (`createRequire(\`${npm root -g}/\`)('playwright')`), Chromium at
  `/opt/pw-browsers/chromium`. Under file:// the page drops to player view; for the designer view run
  `canAdmin = true; playerPreview = false; applyRole()` after load.

## Refresh the snapshot (keeps the site in sync)
The site can't reach the artifact's database, so it plays from the JSON in
`<script type="application/json" id="snapshot">` (balance, AI, ratings, card stats). Refresh it whenever the
balance, AI or stats changed:
1. ArtifactData `list` with `out_dir` (never print inline) for each collection: `balance`, `ai`, `aibrain`,
   `calibration`, `sync`, all into one folder.
2. `node tools/refresh-snapshot.mjs --db <folder> --html <page>`
3. Publish and push as usual.

## Before pushing
Tell Brian in plain English: what changed, why, any gameplay or balance effect, risks or open questions, whether the
golden test ran (and passed or was re-recorded), and which docs were updated. Then wait.

## Design invariants (don't break without asking)
- It must work as a **physical game**: no hidden bookkeeping a table couldn't do; avoid bottoming cards.
- The battle engine never favors either seat.
- Only 4 units track health/damage at once (charging + revealed on each side).
- Damaging abilities don't fizzle; copy/re-trigger effects copy **printed** abilities only.
- The AI judges every choice by **chance of winning the game**; difficulty = thinking budget, not random mistakes.

## Linked docs (read only when relevant)
- `docs/code-map.md`: map of index.html and cubes.js, the stacked-wrapper pattern, the reuse list
- `docs/ui.md`: phone/desktop layout rules, animation and card-motion rules, board settings
- `docs/terminology.md`: internal → display names, card-wording style
- `docs/rules.md`: current rules and battle step order
- `docs/ai.md`: AI evaluation, difficulty ladder, training

## Cheap habits
- Search with `grep -n ... | cut -c1-250`, then read only the lines you need. Never read the whole file.
- The `#snapshot` JSON is one long line (about 13 KB in Nov 2026; it grows with stats): **never grep it without `| cut -c1-200`**.
- Read database documents with `out_dir`, not inline.
- If a rule seems unclear, ask Brian rather than inferring it from the code.
