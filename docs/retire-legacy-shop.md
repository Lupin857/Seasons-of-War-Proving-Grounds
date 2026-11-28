# Retire the legacy Shop

Use the current Oasis tabletop as the single Shop across screen sizes and game modes. Keep the desktop and phone arrangements of the same market, Caravan, and card interactions. Raid uses the same Shop and adds its Attack and Defense piles and Siege Workshop.

## Cutover

1. Inventory what still routes to the old Shop. Check Board settings, saved layout preferences, viewport breakpoints, and any mode-specific routing. Verify where the legacy Shop still supplies controls or feedback that the tabletop needs.
2. Fill those gaps on the tabletop. Cover buying and selling by both touch and mouse, tap and keyboard alternatives, Black Market, discard and reorder flows, setup variants, online turn status, and Raid's purchase assignment and transfer. Keep a low-motion presentation on the same tabletop.
3. Make the tabletop unconditional for Shop. Retire the layout switches that select the old Shop and ignore their saved values. Keep appearance and reduced-motion settings independent of layout.
4. Remove the legacy Shop renderer, layout-only markup and event paths, and CSS that has no remaining caller. Keep shared market cards, purchase rules, inspection, and animation helpers used elsewhere. Keep the animation lab for repeatable tabletop testing.

## Acceptance

- Standard AI, Pass and Play, and online games, plus Raid AI and Pass and Play, land on the tabletop for each Shop.
- Both markets, both Caravans, the pass control, and discard remain usable at common phone and desktop sizes. Test short phones, landscape, touch, keyboard, and reduced motion.
- Existing saves with older layout preferences resume on the tabletop. Purchases, turn order, ratings, and online room behavior still follow their existing rules.
- Coverage includes a full Shop → Mobilize → Battle → Shop cycle and Raid's full counterattack cycle. Check restocking, buy and sell animations, discard access, and deck assignment after refresh.
- The retired Shop renderer and its layout selectors have no remaining references. The rollout changes only the Shop. Review other legacy screens separately.
