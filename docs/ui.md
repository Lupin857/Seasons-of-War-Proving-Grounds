# UI rules

## Phone vs. desktop
- They are separate layouts. Work on the one Brian names; don't change the other unless asked. If shared code
  changes, screenshot both and confirm the other looks the same. If unclear which one a request is for, ask.
- Phone: things you tap at the bottom, information at the top (top bar pinned clear of the notch). Keep bars as small
  as possible so the phone shows as many market cards as it can; readability fixes must not make bars taller. Battle
  runs edge to edge (no borders). Cards are cropped to the type tab (shop, Mobilize, battle); tap for the full card.
- Desktop: a card panel on the right (≥1200 px); hover any card to read it full size.

## Stability
- UI must not shift during play. Reserve room for things that appear (banners, notes, buttons).
- Don't rebuild or restyle elements outside the task (see CLAUDE.md rule 6).

## Motion
- Flying cards travel **under** the bars, decks, discard pile and banners (use `LAYER` / `flyZ`).
- Dealt cards come out of their own deck; cards going to the discard pile end at the pile.
- Flips are real 3D turns (pattern in docs/code-map.md). The slide into the charge zone starts slow.
- Damage cubes: real 3D wooden cubes dropped straight onto the top card with a random starting angle, contained on
  it; lifted upward to remove; a defeated unit's cubes lift as its card flips to the graveyard. Shadows fade in.
  Falling cubes aim at where the card will come to rest (a clashing card slides in under them) and lock onto the card
  over the last 3 units of the fall; landed cubes ride the card. Cubes in one drop start at their own heights (1.3
  apart, shuffled) and at least 0.66 from the card edges, so they never touch each other or the walls in mid-air.
  No shake on damage, no floating "−2"/"Defeated" text. Ability trigger = gold border glow.

## Battle board
- Teaches the physical setup: deck face up, top card = revealed unit, copies peeking above with names showing, gear
  and tokens tucked behind, health bar under the card with an "LV 2" tag at its left. Card font: Marcellus.
- The open Board settings panel shows the game version (`OASIS_BUILD`, the artifact publish number, e.g. `v55`).
- Board settings (js/board-settings.js, `LAB_DEF`): default table view tipped 15°, zoom 115%, AI's side further back and smaller,
  splay up-left (`'now'`; everyone was switched to it once via `localStorage.oasisBoardSplayUL`).
- **Nothing on the board moves.** Every charge and deck spot always keeps room for the biggest stack a card can have
  (`STACK_MAX` = 5 bands: copies, gear, Might, Training, Shield), on desktop and phone, in every splay
  (`labFixedRoom`). Duplicate copies share one band with a "×2" count, like tokens. Zone labels are one fixed height.
  Row heights only ever grow (`window.__rowKeep`), never shrink between battles. Check board changes with a
  headless test that a card and the empty outline sit at the same pixel spot in every step, on both sides.
- Empty outlines (deck "Deck empty", charge and graveyard "Empty", in the zone-label lettering) are part of the
  board: always drawn in their spot, covered by whatever sits there (`.labslot.under`), never added or removed.
  An in-flow outline keeps the card's 24 px health-bar strip under it, so the AI's bottom-anchored zones don't jump.
