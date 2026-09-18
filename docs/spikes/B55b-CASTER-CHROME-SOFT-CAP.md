# B55b — Caster Body Integrity soft-cap + magic bane (design lock)

**Status:** LOCKED 2026-09-18 by Michael. Soft-cap **5** Integrity spent; Soft counts; bane when over; keep erosion under the cap.  
**Related:** B55 Soft chrome SKUs; docs/raw/09-chrome-body-integrity.md Magic erosion.

## Intent
Magic users (Elementalist, Street Priest, Technomancer) do **not** get the full street-chrome BI playground. They have a low **caster chrome soft-cap**. Crossing it poisons all casting with a **bane**.

## Lock (Michael 2026-09-18)

| Rule | Proposal |
|---|---|
| Who | Living casters: **Elementalist, Street Priest, Technomancer** (not Cyborgs — Arcane Severance already). Commander/Face/etc. unchanged. |
| Soft-cap | **5 Body Integrity spent** on chrome (not "remaining 15"). Soft / Standard / Salvage all count. **LOCKED.** |
| Under the cap | Existing **magic erosion** still applies (Soft −1/3, Standard −1/2, Salvage −1/1 on cast-resource cap). Soft grade remains the intended path. |
| Over the cap | While Integrity spent on chrome **> 5**, every **Magic / Veil / Resonance** power roll (signatures + heroic abilities keyed to casting) takes a **bane**. Not a one-time save — ongoing until under the cap again. |
| How to clear | Surgical **removal** that brings spent Integrity back to ≤ 5 (scar rules unchanged). |
| Soft SKUs | Soft chrome still spends toward the 5 — Soft is cheaper BI per implant, so casters fit more Soft under the cliff, not unlimited Soft. |

## Why not only Soft-allowed
A Soft-only ban without a cliff still lets a Face-priest stack Soft social suites into double digits. The **5 spent** cliff is the hard story: metal in the meat starts choking the Weave/Wire/Pact.

## Foundry (when implementing)
- Track chromeIntegritySpent (or derive from installed chrome flags).
- If caster class + spent > 5: ActiveEffect or roll hook adding bane to Magic/Veil/Resonance abilities (mirror mods.mjs softwareEdges pattern).
- Sheet warning when approaching / over cap.

## Confirmations (closed)
1. Soft-cap **5** — yes.
2. Soft implants **count** toward 5 — yes.
3. Keep **erosion under the cap** — yes; bane is the cliff above 5.
