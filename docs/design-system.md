# Oasis UI design system

The rulebook for how the Oasis UI looks. Started in Nov 2026 with the CSS cleanup; it describes the target and the
current state. Update it in the same commit as any style change.

## Decisions (Brian, Nov 2026)
- **One look, dark.** No light mode and no theme switch: the UI is designed for one intended look. The direction
  (warm desert night, cool night or charcoal) is picked from mockups of the shop and battle screens.
- **Cards stay printed.** Cards keep their physical look (Dextrous art, frames) in any UI color; the wood table stays
  wood. Only UI chrome goes dark: bars, panels, menus, pop-up frames, page background.
- **Side colors:** blue = you, red = the opponent, tuned to read well on dark.
- **Two layouts only:** phone upright (≤ 640 px) and desktop (≥ 1200 px adds the card panel). Widths in between just
  have to work; no special rules for them, and the old 370/380/420/480/560/720/860 px breakpoints fold into these two.
- **Smallest text on a phone: 11 px.** Bars must not get taller than they are (earlier rule: the phone shows as many
  market cards as it can).
- **Fonts:** a separate step after the dark look. The card font is Marcellus; the UI font should complement it.
- **No Chinese-character (xiangqi) marks**, and no Chinese web font: removed in pass 2.

## Where values live
- Fonts: `--f-display` (IM Fell English SC), `--f-body` (Alegreya Sans), `--f-mono` (JetBrains Mono), `--f-zh` (to be
  removed), in css/03-main.css `:root`. Marcellus is imported in css/01-battle-card.css.
- Colors: 37 custom properties (`--bg`, `--surface`, `--sunk`, `--ink`, `--muted`, `--line`, `--azure` (you), `--gules`
  (opponent), `--or` / `--or-soft` (gold), `--ok`, `--card`, `--card-line`, `--card-sh`, `--chalk`...), but most colors
  are still written out in place.
- Layers: the JS `LAYER` table (js/ui/09-play-screen.js) for flying cards and overlays; CSS uses its own z-index
  numbers.

## Current state (v66, before pass 2)
- 9 stylesheets, ~1,816 live rules after removing 237 dead ones (pass 1: 89 long dead, 148 left behind by the Mobilize
  rework).
- 73 font sizes, 124 colors, 27 corner radii, 32 z-index values, 123 shadows, ~400 `!important`.
- **The stylesheets are layered.** Later files restyle earlier ones ("ONE CARD SIZE", phone fixes, art cards, Board
  settings), and about 40% of the rules are later fixes that override several components at once. So the rules for one
  component are spread over several files, and the order of the files matters. Before changing a selector, search every
  file for it (`grep -rn 'SELECTOR' css`).
- Pass 1 tried to regroup the rules by component with no visible change; the cascade doesn't allow it (see
  tools/css-audit/README.md). Regrouping happens in pass 2, where each component's rules are rewritten to their final
  values in one place, with the new tokens, and checked by screenshot review.

## Pass 2 (planned)
1. Mockups of the shop and battle screens, phone and desktop, in 2–3 dark directions; Brian picks one.
2. Tokens in `css/00-tokens.css`: palette by role (surfaces, text, lines, you, opponent, gold, success, danger), type
   scale (11 px minimum), spacing, radii, shadows, layers (one list shared with JS `LAYER`).
3. Rewrite the CSS component by component into one file each, using only tokens; delete the old layered rules; fold
   breakpoints into phone and desktop; remove the dark-mode media blocks and the xiangqi marks.
4. Check every screen with `tools/screens.mjs` on desktop and `--phone` (the screenshots change on purpose, so Brian
  reviews them).

## Checking a style change
- Refactors (nothing should look different): `node tools/screens.mjs <old build> <dir A> --styles`, the same on the new
  build into `<dir B>`, then `node tools/screens-diff.mjs <dir A> <dir B>`. Every element's computed style must match
  in all 26 moments (start, setup, roll, every shop, Mobilize, battle steps, deck views, discard pile, Board settings,
  game over, the designer tabs). Run it with and without `--phone`.
- Visual changes: the same runs give before/after screenshots to review.
