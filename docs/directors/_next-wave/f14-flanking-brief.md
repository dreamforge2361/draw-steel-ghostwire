# F14 — Flanking (Foundry)

**Status:** READY for next Claude wave after 0.3.116. Sibling to F13 Cover/Conceal.
**Michael ask (2026-09-23):** edge on melee vs opposite-side enemies.
**RAW already printed:** `docs/raw/04-combat.md` — "if two allies stand on opposite sides of a target (adjacent, facing through the target), melee strikes against that target gain an **edge**."

## Lock (proposed — implement unless Michael overrides)

1. **Auto-detect, not a toggle.** Unlike F13 Cover/Conceal (manual status), Flanking is positional. No HUD pill the player toggles on/off for "I am flanked."
2. **Melee only.** One **edge** on melee strike power rolls against a flanked target. Ranged never gets it. `meleeRanged` abilities: same honesty rule as F13 — do **not** auto-edge when mode is ambiguous; Director can add the edge in the dialog.
3. **Opposite sides (square grid, Foundry default):** Target T is flanked when there exist two **enemy** tokens A and B such that:
   - A and B are both **adjacent** to T (Chebyshev distance 1, including diagonals), and
   - A and B sit on **opposite sides** of T: the vectors `A→T` and `T→B` are parallel and same direction within one square step (i.e. B is on the ray opposite A through T). Cardinal pairs (N–S, E–W) and diagonal pairs (NW–SE, NE–SW) both count. Three-token wedges do not create flank unless at least one opposite pair exists.
4. **Who counts as a flanking ally:** disposition Hostile-to-target / Friendly-to-attacker per Foundry disposition (same crew = ally). Unconscious / defeated / inert / meat-inert tokens do **not** flank. Size: Large+ still flank from any occupied square they span that is adjacent — use token center-of-occupied-squares nearest T for the vector test (keep it simple: use token document x/y centers).
5. **Can't be flanked:** honor Mutant **Prehensile Mutation** (and any future flag `flags.draw-steel-ghostwire.cannotBeFlanked`). Scout familiar rule stays fiction/RAW — if a familiar token exists and is adjacent, it may count as a flanking ally **only for its owner** (optional stretch; if messy, document "Director adjudicates familiars" and skip code).
6. **Hook:** same seam as F13 — patch `AbilityModel#getTargetModifiers` (or the Ghostwire wrap already used by `cover-conceal.mjs`) to inject **edges: 1** when `isMeleeAttack` && `isFlanked(target)`. Reuse F13's pattern; do not invent a second dialog path.
7. **Visual (optional light):** while flanked, show a small status/overlay on the **target** token for UX (`ghostwire-flanked`) that is **computed** on token move / combat update and cleared when geometry breaks — not a player toggle. If that fights ActiveEffect ownership, skip the status and rely on the roll dialog edge line only; prefer dialog-only if status is flaky.
8. **Out of scope:** Cover tiers, opportunity attack changes, facing rules beyond opposite-sides, 3D levels.

## Ship

- `scripts/flanking.mjs` + register from `module.mjs`
- Director note `docs/directors/f14-flanking.md`
- Smoke `tools/f14-flanking-smoke.mjs` (pure geometry unit tests: opposite cardinal, opposite diagonal, adjacent-but-not-opposite, cannotBeFlanked, melee vs ranged)
- Touch RAW only if the auto-detect sentence needs one clarifying Foundry paragraph — keep player fiction identical
- Version bump with the wave

## Acceptance

- Two allies on opposite adjacent sides → melee strike dialog shows +1 edge for that target
- Ranged at same target → no flank edge
- Move one ally off the line → edge disappears on next roll
- Prehensile / cannotBeFlanked → never flanked
