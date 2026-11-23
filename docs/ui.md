# UI rules

## Phone vs. desktop
- They are separate layouts. Work on the one Brian names; don't change the other unless asked. If shared code
  changes, screenshot both and confirm the other looks the same. If unclear which one a request is for, ask.
- Desktop: the game bar (`#gtop`) is pinned at the top; anything else that sticks while scrolling (deck tiles, battle
  buttons) stops under it, using its height `--bh` (css/10-game-menu.css).
- Phone: things you tap at the bottom, information at the top (top bar pinned clear of the notch). Keep bars as small
  as possible so the phone shows as many market cards as it can; readability fixes must not make bars taller. Battle
  runs edge to edge (no borders). Cards are cropped to the type tab (shop, Mobilize, battle); tap for the full card.
- Game top bar (`pbarHTML`): the same on every game screen, phone and desktop: ☰ menu · Round · score · First to.
  On phones, Mobilize and battle add their phase/step row under it. Each side's money and limits are not in the bar:
  they live in the shop's bottom bar (phone) and the deck tiles (desktop). During a game the Oasis title, sound button
  and tabs are hidden; the ☰ opens the tabs and a Sound effects switch. Desktop pins the bar across the top and
  drops the score that used to sit between the deck tiles.
- Mobilize keeps two columns (deck, bench) on every screen. Its cards are as wide as their column allows, up to
  240px (each panel is a size container; `--mzw` is set on `.mzstack` in css/09-mobilize.css). On phones the two
  columns run nearly edge to edge (4px sides and a 4px gap).
- Desktop: a card panel on the right (≥1200 px); hover any card to read it full size. `solidArt` swaps its picture
  for a canvas, so its CSS sizes `:is(img,canvas)`.

## Stability
- UI must not shift during play. Reserve room for things that appear (banners, notes, buttons).
- Don't rebuild or restyle elements outside the task (see CLAUDE.md rule 6).

## Motion
- Flying cards travel **under** the bars, decks, discard pile and banners (use `LAYER` / `flyZ`).
- Dealt cards come out of their own deck; cards going to the discard pile end at the pile.
- Start of a round: cleanup (unbought cards to the discard pile), upkeep (hourglass stamps) and the deal overlap in
  fixed windows (`ROUND_FX` in 09-play-screen), so more cards means a tighter stagger, not a longer wait: about 2.5 s
  for a full turnover. Brian tuned these numbers in the "Oasis shop animation lab" artifact (Nov 2026); change them
  there and copy them back. Cards that join the shop mid-round keep their own pace.
- Every unit defeated in a step flies to the graveyard (`deathFly`), found from the step's `mv` moves to `grave`. In the
  face-up pile only the top card has `data-uid`; the cards under it carry `data-guid`, so a second unit of the same side
  defeated in that step lands on its own card underneath (or on the pile, when it's buried too deep to be drawn).
  Several units of one side defeated in one step go one after another (`GRAVE_STAGGER`, 260 ms), in the order they
  land on the pile: the charging unit first, underneath, then the revealed unit on top. The two sides go at the same time.
- Battle ink (js/ui/19-battle-ink.js; numbers tuned in the "Oasis battle lab: ink helpers" artifact): every effect is a
  calligraphy-style stroke on the table, under the cards, growing as the step plays. Weight follows damage; a blot with
  the number spreads at its middle; one pressed wedge at the tip, square to the stroke, on a short straight run square
  to the card. Attacks bow out mirrored (yours left, the opponent's right); same-side effects loop past the row;
  strokes between the same two cards take nested lanes. Overrun carries on from the tip of the stroke into the unit it
  spilled through. Ability notes are joined to their card by brush dabs pressed one at a time, which follow the unit
  and the note live; the note slides in as they arrive. Abilities play one after another; one logged after the step's
  first defeat waits until the defeated cards have landed. Moving on, the old ink soaks away; Back shows a step at once;
  2× halves it all. The old straight arrows and dotted note lines are gone.
- Tokens: a new token splays out from behind the card (`labSplayIn`); one more of a kind already there splays out on top
  of it and the count goes up as it lands (the token underneath never disappears). A Shield that stops a hit glows gold
  like an ability; when you move on it cracks and its halves (copies of the token, cut to what showed) tumble up and away
  from behind the card. Might a Fencer discards breaks the same way.
- A defeated card flies to the graveyard inside the tilted table (same perspective as the cards), re-aiming every frame
  at its card in the pile. Sand Sailor slides a full card width out of its deck (left for yours, right for the
  opponent's), over the new top card, then back in under it. Each graveyard's pile sits level with its row's charging card.
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
- The health text and LV tag sit on the light table, so they use fixed card colors (ink `#2b211a`, hurt `#a3322a`,
  tag `#f3ead8`), never theme variables like `--ink` (which turn light in dark mode).
- With card stock on, cards tucked behind a unit (copies, gear, tokens) get a light 8% shade so they read as behind it.
- Board settings has no button on the board: during a battle it opens from the game menu (☰ → Board settings, `labShow`),
  and closes with Done, Esc or when the battle ends. It never opens by itself on load. The panel shows the game version
  (`OASIS_BUILD`, the artifact publish number, e.g. `v55`).
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
