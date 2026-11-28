# Rules (as the engine plays them)

What the code does today, written with **display names** (internal name in brackets where the code differs; see
docs/terminology.md). Brian's Google Sheets are canon for card numbers; this doc is canon for *how rules work in the
code*. When a rule changes, update this doc, the in-game Rules tab (`<section id="view-rules">`) and the golden
test (`record`) together. "Open" items at the bottom are known gaps between the code and Brian's decisions.

For the opt-in Raid mode, see the [Raid prototype](raid.md).

## Game
- Two players. First to 3, 4 or 5 points **while leading** (each length has its own AI, card stats and ratings).
  Ties keep playing; the game stops after 20 rounds. A battle win = 1 point; a draw scores nothing.
- Round = Shop → Mobilize → Battle. Turn order: random in round 1, then the loser of the last battle shops first
  (draw: whoever shopped second).
- Default start: $3 base income + 1 Moisture Harvester ($4 in round 1). Default modules: miracles off, refills on.
  Any custom rule makes the game unrated and keeps it out of card stats. Online, the host sets rules and the guest
  reviews them and taps Ready. Catch-up bonus (if on) goes to the player trailing on points.

## Shop
- Income each shop: base + income cards. Money carries over.
- Display: 5 units and 5 supports. Unbought cards turn sideways and come back once; unbought again, they go face up to
  the discard pile. Refills (module): a bought card is replaced from its deck at once.
- By default, each player gets 3 buys per shop, shared by units, supports and gear. Mobile Workshop and Divine Favor
  can grant extra buys. Moisture Harvesters [Field] ($1, +$1 income) and Drifters [Recruit] ($1 token) are always for
  sale and each uses a buy. The default limit is 1 Moisture Harvester per shop.
- The Caravan [City] has 5 support slots. Duplicate supports share a slot, and each Moisture Harvester takes its own slot.
- Selling: on your shop turn, any number of cards for $1 each ($2 with The Bazaar), including cards bought this shop
  and gear in hand. Doesn't use a buy or end the turn. A sold unit/support drops one level. Sold cards go face up to
  the discard pile (Moisture Harvesters return to the supply). Altar of Sublimation [Altar of Blood] can't be sold.
- The discard pile is face up and public. Scrapyard [War College] lets you buy duplicates of cards you own from the
  discard pile for free. Each duplicate uses a buy.
- Supports with shop effects: Mobile Workshop [Carpenter's Guild] (+1/2/3 buys of any kind, supports $1 cheaper,
  minimum $1); The Fence [Black Market] ($2: once per shop look at the top 3/4/5 of one deck, buy one for $1/2/3 less
  with a normal buy, rest go to the bottom); Dowser's Blessing [Mason's Guild] (attaches to a support as an extra
  copy); Altar of Sublimation (+$4 income; at each shop start discard a copy of your most expensive unit, you choose
  among ties); Cathedral (+1 point while owned, but you can only win at the end of a battle phase you won).

## Mobilize
- Up to 5 unique units (+Pack Beasts [Reserve Encampment]); Drifters don't count. Order is secret.
- Tokens are placed here: Might [Armament] (Smithy), Shields (Dowser's Bathhouse [Armory]), Training (Study),
  Drifters (Drifter Camp [Barracks]). Gear from hand is equipped, one per unit (Drifters too). A unit with a
  Zweihander can't hold Might or Shields.
- Vanguard = first unit, Rearguard = last unit, fixed for the battle. Battle miracles in the deck never count as units.
- After the battle: Drifters are discarded; gear returns to hand (the page remembers who wore what).

## Battle
The deck sits face up: **the top card is the revealed unit**. Charging moves it to the charge zone and uncovers the
next card. Only 4 units track damage at once (charging + revealed, each side); damage clears when a unit is hidden.

**Battle start:** battle miracles placed ahead of the Vanguard resolve → both Vanguards are revealed → start-of-battle
supports (Dowser's Bathhouse Shields, Ration Line [Muster Hall] training, Training Yard, Ballistae Wagon [Trebuchet]
damage) → Reveal abilities → casualties.

**Each step** (up to 300, then a stalemate draw):
1. **Charge & Reveal:** each side with no charging unit charges its top card. Charge abilities resolve (together with
   any battle miracle that surfaces), then the newly revealed units' Reveal abilities.
2. **Casualties.** Then check: a side with no charging unit and an empty deck loses (both = draw).
3. **Fight:** the two charging units hit each other; "when your charging unit attacks" shots (Marksman) land in the
   same round. Then casualties again.

**Simultaneous rounds:** both players' abilities in one round resolve together, by kind, never by seat: tokens gained,
then tokens removed, then damage at the round's end. Two hits on one unit: the bigger first (so a Shield blocks it).

**Casualty step** (after all of a round's damage): Overrun excess carries to the unit behind → Lethal defeats what it
damaged → survival heals (Brawler removes all damage; Healing Balm removes up to 2 of each attack's damage; both only
after surviving an *attack*) → would-be defeats that retreat instead (Field Medic [Barber-Surgeon], Infirmary Tent,
Second Wind: go to the deck bottom undamaged) → defeated units go to the graveyard → "when a unit is defeated"
abilities trigger as they fall and resolve in their own step after (Corpse Looter, Night Watchman, Spineless Recruit
[Cowardly Squire], Heirloom Blade).

**Keywords and terms**
- Silenced: no ability text (gear still works). Interceptor [Pigeon Hunter] (Nov 25): "Reveal: Silence enemy
  Reveal and Charge abilities that happen at the same time." Only in the step it is revealed (engine `HUSH`,
  `hushStart`); not a lasting effect.
- Shieldbreak: the hit ignores Shields and discards them all (Fencer, Battle Axe).
- Lethal: any damage it deals defeats (unless a Shield blocks it or it's reduced to 0) (Executioner, Poison Oil).
- Overrun: excess damage carries to the unit behind if it's in play (Mounted Lancer [Lancer], Lance).
- "Rearmost enemy" / "enemy unit ahead": the enemy revealed unit, or their charging unit if none is revealed.
- Copy/re-trigger effects (War Horn, War Drums, Foolish Wanderer [Jester]) copy printed abilities only.
- Gear on a defeated unit stays with it in the graveyard (except Heirloom Blade). Graveyard units and gear have no
  active abilities unless a card says so.

## Optional modules
- **Miracles:** 14 in the unit deck, 8 in the support deck. A miracle is never shown alone: the next card from its deck
  is laid on top; that card costs its price plus each miracle's surcharge, and the buyer gets them all. Money miracles
  and Discard Writ resolve at once; others go to the public hand (Divine Favor, Vision, Patronage on your shop turn;
  Drifter/Might/Training miracles at Mobilize; Covenant, Freeze, Upheaval as described in the Rules tab). Miracles
  can't be sold; used ones go to the discard pile and can't be bought.
- **Battle miracles** (second checkbox): Ambush, Second Wind, Silence (unit deck), Divine Shield, Sabotage (support
  deck); Mill and Restock leave. Placed anywhere in your deck at Mobilize; one resolves the moment it becomes the top
  card, with that step's Charge abilities; back-to-back ones resolve in order. Discarded after the battle, used or not.

## Not in this version
0 copies on the sheet: Desperate Infantry, Veteran Knight, Mercenary, Arsonist [Musketeer], Chapel, Recruitment Office,
Outpost. The War Drums battle miracle is retired (War Drums is gear).

## Open: code differs from Brian's decisions (fix the code, then move the rule up)
1. **Bottoming:** Brian wants to remove putting cards on the bottom of a deck. Still in code: The Fence leftovers,
   miracles turned up by The Fence/Vision, Field Medic, Infirmary Tent, Second Wind, Sand Sailor. Replacements not
   decided yet; ask before changing.
2. **Heirloom Blade** (confirmed): during battle it moves from its defeated wearer to the next unit in the deck with no
   gear (engine is right); after the battle it returns to the unit it was first equipped to (the gear memory,
   `p.equip`, already restores that). Only the Rules tab text is wrong ("moves to your Rearguard").
3. **Lance:** code gives +1 power; Brian described +2. Check the Sheets.
4. **Names:** Novice Soldier vs. Observant Novice (Studious Squire's display name); White Knight still mapped though
   removed.
