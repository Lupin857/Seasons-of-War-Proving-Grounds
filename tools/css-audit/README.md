# CSS audit scripts (Nov 2026, pass 1 of the CSS cleanup)

One-off analysis scripts used to find dead CSS and to test whether the stylesheets could be regrouped by component
without changing anything on screen. They are kept for pass 2; the paths inside point at a scratch folder
(`/home/claude/work/p1/...`), so adjust them before reuse. Setup: `npm i postcss specificity` in a scratch folder.

1. `parse.cjs <repo> rules.json`: every style rule, in load order, with its @media context and declarations.
2. `node tools/screens.mjs <build> <out> --matches rules.json` (desktop and `--phone`): which rules match which
   elements (and which selector part) at each moment, plus each element's classes.
3. `dead.cjs` / `prune.cjs`: a rule is dead when every selector part names a class that appears in no JS string or
   HTML and it never matched; `prune.cjs` deletes those rules (and dead parts of selector lists) in place.
4. `plan0.cjs` → `constraints.cjs`: ordering constraints. Rule a must stay before rule b when some element could match
   both (classes seen together on an element, in the recordings or in class strings in the code; tags respected), they
   set the same property family with the same importance, and their specificity is equal. `check-dyn.cjs` checks
   that every conflict actually seen in the recordings is a constraint.
5. `buckets.cjs` + `plan4.cjs`: assign rules to component files and build the order that groups them best while
   keeping every constraint.

Result (v66): 237 dead rules removed (89 long dead, 148 left behind by the Mobilize rework). Regrouping by component without visible change is not possible: about 40% of
the rules are later fixes that override several components at once, so a zero-change regrouping leaves the second
half of the stylesheet interleaved (343 runs). See docs/design-system.md.
