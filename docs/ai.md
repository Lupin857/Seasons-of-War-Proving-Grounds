# AI

All AI code is in `<script id="engine">` (banners from `AI` through `Situational opinions`), so it also runs in Web
Workers and in `tools/golden.mjs`. Any AI change needs the golden test (`check` for refactors, `record` + a note in the
commit for intended behavior changes).

## Principles (Brian's, don't break without asking)
- **Every real decision is judged by one number: the chance of winning the whole game afterward.** Buying a Moisture
  Harvester, saving money or buying a unit that helps now are all compared on that scale. No flat scores or crude
  constants for final choices (e.g. a Might token's worth depends on power breakpoints).
- **Difficulty = thinking budget** (search depth, playouts, test battles), like limiting a chess engine. Weaker AIs make
  misjudged close calls and short-sighted choices, never deliberately thrown ones.
- **Fair information:** the AI sees only what is public (purchases, Caravans, money, the order you used last battle),
  never your current deck order.
- Training AIs should be thinking AIs, not quick ones.

## Thinking budgets (`DEPTH`)
Each level sets search evals/time, depth, playouts (`po`), order guesses and shop lookahead.
- `play` (against you) and `master` (deepest); `train` (lighter, for self-play) and `t2` (between them); `fast`.
- Ladder-only weak levels: `s1`, `s2` (short-sighted: this battle only, no playouts, estimates slightly blurred),
  `g1` (one playout).

## Rated ladder (`RUNGS`)
Random buyer (anchors ratings at 400, not offered as an opponent) → Short-sighted, hasty → Short-sighted → Glimpses
ahead → Quick → Thinks → Thinks harder → Thinks deeply → Thinks deepest. A rating between two rungs plays with a
blended budget (`blendDepth`). Ratings live in `calibration/ladder`; your own rating stays in your browser. The Elo
slider in setup picks the strength.

## How a decision is made
1. **Shortlist:** `aiValue(g, i, name, kind)` scores candidates from the genome weights, card opinions (`bias`), the
   combo table and `ABIL` (per-card ability values). It only narrows the options and drives imagined players in
   playouts; it isn't the final judge.
2. **Guess the opponent's order:** a few likely orders found by test battles, sharpened by the **opponent model**,
   which learns how this opponent orders their army.
3. **Search** (`SEARCH`): each option → chance of winning the game. This battle's edge is converted to log-odds and
   combined with later battles (faded edge + money gap), ignoring strength that won't last (Mercenaries, bought
   Drifters). `rob` weighs the average case against the worst case over their orders.
4. **Playouts:** play the rest of the game out many times and count wins.
5. **Mobilize:** test the candidate orders against the guessed enemy orders (`perms`, mixed mobilize).
6. Gear placement: War Drums right behind a unit with a Charge ability; War Horn right in front of one with Reveal.

**Open question (undecided):** `ABIL`, `GEAR_VAL` and `GEAR_RANK` are hand-set constants. They don't make final
choices, but they decide which options reach the search, so a badly set value can hide a good card from even the
strongest AI. Don't add more constants like these; ask Brian before removing or replacing the existing ones.

## Combo table
`syn['A>B']`: how much better a deck does with A directly in front of B than A and B separately (measured against a
Strong Villager [Pipewalker] reference on the same random battles for every pair).

## Training (Train the AI tab, designer only)
- **Evolution strategies:** the genome (`baseGenome()`, ranges in `GKEYS`) is tuned as one vector. Each direction is
  tested + vs − on the same seeds, played twice with seats swapped so luck cancels. Momentum, capped steps.
- Only `rob`, `read` and `omk` take part in real decisions now; the rest shape imagined players in playouts.
- **SPRT safety check** (as Stockfish's Fishtest): keep or revert a step. **Hall of fame:** flags a clear loss to past
  champions (~43%).
- **Card opinions:** from card stats, each often-bought card's buyers are compared with players in the same position
  (behind/tied/ahead), measured against the average purchase; capped nudges; opinions fade toward 0 so dropped
  cards get retried. Plus **learned pairings** and **situational opinions**.
- Self-play runs in a worker pool (`aiWorkerMain`, `workerMain`).

## Where the AI is stored
- Artifact database: `ai/brain` (meta) + `aibrain/c0..` chunks (per-level variants `ai/brain-t<L>`, `aibrain/t<L>c<k>`),
  pushed by `pushBrain` ("One AI everywhere").
- The website plays from the `#snapshot` JSON. After training or AI changes, refresh it (CLAUDE.md, "Refresh the
  snapshot").
