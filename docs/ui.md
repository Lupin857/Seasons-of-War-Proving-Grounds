# UI rules

## Phone vs. desktop
- They are separate layouts. Work on the one Brian names; don't change the other unless asked. If shared code
  changes, screenshot both and confirm the other looks the same. If unclear which one a request is for, ask.
- Desktop: the game bar (`#gtop`) is pinned at the top; anything else that sticks while scrolling (deck tiles, battle
  buttons) stops under it, using its height `--bh` (css/10-game-menu.css).
- Phone: things you tap at the bottom, information at the top (top bar pinned clear of the notch). Keep bars as small
  as possible so the phone shows as many market cards as it can; readability fixes must not make bars taller. Battle
  runs edge to edge (no borders). Cards are cropped to the type tab (shop, Mobilize, battle); tap for the full card.
- Phone one-screen (mat) fit: nothing may hang under the bars on any phone, down to 360x640. The shop's card width
  `--mw` (css/12-mat-shop.css) is the smaller of three across and what the gap between the bars allows (four card rows
  plus labels inside the tilted mat's inner page). The battle's cards shrink to fit (`matFitBattle`), and since the
  page stays at its top, the table moves (`--matdy`) only when the page flow would put it past a bar.
- The one-screen table is the default at every width. Phones use the compact layout; wider screens use the desktop
  table. The designer can turn the desktop table off in the game menu; `localStorage.oasisMatDesk = '0'` stores that
  choice. The phone layout remains on at widths up to 640px. `localStorage.oasisRug = '0'` still disables the mat.
- Desktop Shop captions sit below their cards. The local player's Deck shows its most recent card from a previous
  Shop. Clicking the stack fans the prior holdings out for inspection. Clicking the backdrop returns the cards.
  Current purchases stay in Bought This Shop, which opens and closes with the same fan.
  A click outside an enlarged pile card returns to its fan. Both piles show the card faces beneath the top
  card. Drag a card out of either fan onto the highlighted discard to sell it.
  The table pile is hidden while its cards are spread. The selected card leaves its spot while it is in the
  inspector, including in the discard view. Dragging the enlarged face continues from the point you grabbed.
  Dragging through either of your fans slides neighbors into the open slots. Dropping inside the fan saves that
  pile's display order for the match. Escape or dropping outside returns the old order.
  Returning offers stay sideways on the table and turn more slowly while picked up. Their “Last chance to buy”
  notice appears in the inspector. The desktop discard pile shows its top card and keeps the count in its accessible label.
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

- Desktop Shop opens on one woven rug over painted sand. The rug ripples as it unrolls, the two Shop decks and
  their Always cards enter together from the left, and discard arrives on the sand at the right. Fresh cards deal
  from under the carryover stacks and fill each row from left to right. Carryovers then slide face-up and sideways
  into the slots nearest discard.
- The desktop deal and cleanup use the same full printed face as the market. Flight artwork fills its card box.
- At desktop Shop close, eligible unsold cards turn sideways onto their decks. Expiring cards glide in an arc
  onto the face-up discard at their existing sideways angle. The decks and Always cards leave left, discard leaves
  right, and the rug rolls up.
  Mobilize and Battle share the same sand. Reduced motion shows the settled board directly.
- `bazaar-lab.html` previews the desktop opening and closing with a repeatable market. The timing controls
  replay the game animation, and **Copy settings** exports the values in milliseconds.
  The Shop cards and rug sit halfway between the far and near Caravan rows in the table's perspective.
  In Shop and Mobilize, pile captions sit above the near piles and below the rival's piles.
  On the desktop mat, the menu is in the upper left and the score sits over Discard. The two Caravan rows share
  slot columns on the table and have equal projected margins from the top and bottom of the screen.
  The coin heaps and water counts stay with the rows through phase changes.
  One card width is calculated for the desktop tabletop from the window and the game's slot counts. It is capped
  at 173 px so extra room on wider screens shows more sand. Shop, Mobilize and Battle use the same seat layout.
  The rug extends past the left edge far enough for the roll itself to disappear. **Wait from Shop close to rug
  roll-up** starts when cards begin packing, so the roll can overlap card flights or the deck and discard exits.
  In the desktop Shop, a held card grows slightly and swings around the exact point grabbed, with a soft shadow that
  follows its silhouette. **Try card drag** previews changes to pickup time, growth, lean, and settling.
  Released cards that return to their original slot settle without a bounce.
  **Card shadows** controls the strength, softness, and distance of resting and lifted shadows. The stationary shadow
  and the projected shadow crossfade on pickup and landing. A stack keeps its shadow when its top card lifts.
  **Try card enlarge** previews the larger reading view with adjustable glide, return, dimming, and details timing.
  The same preview has a populated Deck and Bought This Shop. **Inspecting a pile** controls the fan-out, fold-in,
  and time between cards.
  **Try Mobilize** opens a crowded draft with a full five-slot Caravan against a preset rival. **Lock in** plays the
  Battle entrance directly, with the same card gathering and deck landing as a desktop match.
- Match setup fetches and decodes game art before starting. The layout-specific Shop textures load with the
  card art. A missing image is reported and the game can continue.
- Desktop Shop income drops into the banks during the opening. Sale proceeds arc from the departing card
  into its bank. A purchase sends water to the bottom edge of the bought card, where it clinks before the
  card continues to its destination. The flying coins match the scale of the cards' printed water icons.
- Desktop mat Mobilize overlaps the market sweep with the bought piles merging. In the lift, the deck, bench fan,
  fight order numbers, labels and controls settle together. Cards and controls take input once those animations
  finish. The vertical deck cards are up to 25% wider than the market cards. A crowded stack tightens the
  exposed card bands first and shrinks its cards if the available space still requires it.
  Reduced motion skips the entrance. On desktop, Lock in starts gathering immediately. Gear and tokens tuck
  behind their units, and unused bench cards gather beside your Caravan. Your Caravan crops downward from its
  original bottom edge. The rival's crops upward from its original top edge. Battle draws after the crops settle,
  then hands off to the live Battle rows at their shared Shop and Mobilize slot positions.
  Both rows share the Battle board's perspective and use the same tabletop shadows through each phase and during
  the crop, with the shadows following the reveal mask.
  Battle cards use the Shop width. Where height is limited, the board crops the cards and can scroll without
  reducing their width. The two sides of the centered Battle board are separated by half to three-quarters of a card
  length. Your zone labels sit above the near row, and the rival's sit below the far row. The decks hit the sand
  before their top cards splay their attachments.
- Mobilize drag follows the mouse at its grab point. On desktop, the vertical deck opens room at the numbered
  insertion slot while the unit is still held. Bench cards slide aside using the Shop pile's slot selection, motion and
  landing. Attachment targeting keeps cards opaque and outlines the unit under the pointer, with its name or the reason
  for refusal. Spare copies stay on the bench while a token or gear card lifts, and the receiving unit
  covers the attachment as it slides behind the face. Suggest uses the AI worker when available and applies to the
  draft it was requested for.
- Flying cards travel **under** the bars, decks, discard pile and banners (use `LAYER` / `flyZ`).
- Dealt cards come out of their own deck; cards going to the discard pile end at the pile.
- On the earlier Shop layout, cleanup (unbought cards to the discard pile), upkeep (hourglass stamps) and the deal overlap in
  fixed windows (`ROUND_FX` in 09-play-screen), so more cards means a tighter stagger, not a longer wait: about 2.5 s
  for a full turnover. Brian tuned these numbers in the "Oasis shop animation lab" artifact (Nov 2026); change them
  there and copy them back. Cards that join the shop mid-round keep their own pace.
- On the desktop mat, flights use the fitted tray positions. New cards begin turning face up as they touch down,
  and slots take input once the opening settles. Returning cards have an hourglass when they land.
  Hover outlines the selected card without moving it. Clicking glides the larger face to center and fades in the
  keyword definitions and Buy or Sell button beside it. Sideways cards turn upright as they open, then turn back into the same slot when
  dismissed. Dragging still buys or sells at the drop target. Opponent buys keep their individual read pause.
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
- **Resign** in the game menu asks for confirmation. It ends the match and awards the opponent the win. Rated
  AI games record a rated loss. In pass-and-play the confirmation names both seats so either player can resign.
  In an online room the host confirms the result for both players. A guest's pending request is saved for rejoin.
- Battle codes: the game menu has "Copy battle code" during a battle and "Load battle code…" in any game that isn't
  online (blocked while the AI is setting its deck). A loaded code plays in the normal battle view with a REPLAY tag;
  the end button reads "Back to your game" (also in the menu) and returns to the real game exactly as it was.
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

## Raid

In Pass and Play setup, select Raid to use Caravan health and separate Attack and Defense rosters. The fixed Caravan bar opens either public pile. During your Shop turn, drag a unit card onto the opposite pile or use its Move button. The Caravan panel provides the support inventory and Siege Workshop. Each fight has its own private Mobilize handoffs. The second lineup can use leftover gear and tokens.
