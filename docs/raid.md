# Raid prototype

Raid is an opt-in, unrated mode in Pass and Play and Play the AI. It tests whether Oasis can support early economic investment, a credible counterattack, and a full five-on-five battle using the same rules at the table.

## Round sequence

1. Shop together using the usual alternating turns. Buy each new unit into Attack or Defense. Duplicate purchases upgrade the unit in place. Each player can move one existing unit between decks per Shop, for free, during their turn. The public rosters hold up to seven unique units in total and five per deck.
2. Pass the device to set the first fight's lineups in secret. One player's Attack faces the other player's Defense. Only the two active lineups use the table.
3. Resolve that fight and note the damage owed. Reverse roles. Secretly order the other two lineups and resolve the counterattack. Alternate who attacks first each round.
4. Apply both hits together. Caravans start at eight health. A successful attack deals one damage for each surviving attacker, including units still in the deck. A hold or tie deals zero. Mutual destruction is a draw.

Gear and the Drifter, Might, Shield, and Training supply are shared. Each piece or token used in the first fight is unavailable in the second. Unused gear and tokens stay available. Purchased gear returns for the next round. Direct Caravan combat effects apply on one front: Ballistae Wagon on Attack, and Training Yard, Ration Line and Infirmary Tent on Defense.

## What to test

- Does a cheap defense blunt the first hit enough to justify buying a Harvester and counterattacking?
- Can a late attack break a full garrison without routinely sending most of its army through?
- Can two sequential fights fit at the table? Test a 5v5 followed by a 2v2 over consecutive rounds.

The late-offense test uses a public Siege Workshop. Spend two Water to build it, then two Water in a later Shop to finish it. Each step uses a buy and ends the shop turn. The finished Workshop gives the attacking Vanguard +1 damage and Shieldbreak on its first normal attack. The round-20 playtest cutoff is a draw if both Caravans are still standing. Cathedral, Pack Beasts, and miracles sit out this prototype.


## AI playtest opponent

Raid uses the standard AI’s card valuation, token placement and gear heuristics. It values buys against the public Attack and Defense rosters and estimates the economy horizon from remaining Caravan health. It tests lineups against guesses drawn from public information, scores expected breach damage, and may save supplies for the counterattack. This opponent is unrated.
