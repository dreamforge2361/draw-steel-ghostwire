# B55b — Caster Body Integrity soft-cap + magic bane (design lock)

**Status:** LOCKED 2026-09-18 by Michael. **Foundry automation built 2026-09-18 (0.1.81) — awaiting Michael's Foundry verify.** Soft-cap **5** Integrity spent; Soft counts; bane when over; keep erosion under the cap.  
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

## As-built (0.1.81, 2026-09-18)

**Code:** `scripts/caster-chrome.mjs`, registered from `scripts/module.mjs` init as `registerCasterChrome({ isCyborg, casterClasses: VEIL_CASTER_CLASSES })`.

| Piece | Implementation |
|---|---|
| Spent | `chromeIntegritySpent(actor)` = sum of `flags.draw-steel-ghostwire.chrome.integrity` on the chrome Items on the actor now. Removal drops it by the implant's full cost (the 75% refund / 25% scar on remaining Integrity is unchanged and not used here). |
| Who | `isCasterClass(actor)`: hero, not Cyborg, with a `class` Item whose `system._dsid` is `elementalist`, `street-priest`, or `technomancer` (same `VEIL_CASTER_CLASSES` set as Arcane Severance). |
| Marker | While spent > 5: actor Active Effect **"Chrome Soft-Cap — Weave Strain"** (`flags.draw-steel-ghostwire.casterSoftCap`, `icons/svg/degen.svg`, no changes). Deleted when spent ≤ 5 (or the hero stops being a caster). A GM can **disable** it to waive the bane; sync never re-enables it. |
| Bane | `AbilityModel#use` wrapper (same pattern as the Wired edges/banes in `patchWiredAbilities`): if the ability has a power roll, a keyword in **magic / veil / resonance**, and the Weave Strain effect is active, `config.modifiers.banes += 1`. Shows in the roll dialog's bane count. |
| Sync | `createItem` / `deleteItem` of chrome, class, or ancestry Items; `updateItem` when `flags.chrome` changes; `createActor` (hero); `ready` sweep of all heroes (GM). Per-actor queue so a multi-implant drop can't double-create the effect. |
| Notify | Crossing over: permanent warning (`GHOSTWIRE.CasterChrome.Over`). Clearing: info (`GHOSTWIRE.CasterChrome.Cleared`). Ready/createActor syncs are silent. |
| Sheet | Stats tab › Body Integrity fieldset, casters only: "Chrome spent X / 5 soft-cap"; over the cap it turns red and names Weave Strain. |
| i18n | `GHOSTWIRE.CasterChrome.*` |
| API | `game.modules.get("draw-steel-ghostwire").api.chromeIntegritySpent / isCasterClass / casterSoftCap` |

**Keyword match (what we matched):** every Elementalist, Street Priest, and Technomancer ability in `src/packs/classes/*` carries the **magic** keyword (Elementalist 40, Street Priest 37, Technomancer 25 — Technomancer Resonance abilities are `magic` + `wired`). There is no `veil` or `resonance` keyword in the packs today; both are matched anyway so a future retag keeps working. Consequence: any Magic-keyword power roll a strained caster makes (e.g. a magic-tech kit strike) also takes the bane — matches the lock's "every Magic / Veil / Resonance power roll."

**Why not a Draw Steel ability-modifier Active Effect:** Draw Steel 1.1.2's ability bonuses (`_applyAbilityBonuses`) filter on **all** listed keywords (subset match), so "magic OR veil OR resonance" needs three effects and would stack banes on multi-keyword abilities; its `power.roll.banes` case also reads `this.power.roll.banes ?? 0 + value`, which doesn't add when the base is already 0. The roll hook avoids both.

**Not built / unchanged:** magic erosion (cast-resource cap) has no automation in the module today and is still not automated; Technomancer Light chrome tolerance (class text) is unautomated. Rulebook journals regenerated from RAW (09 § Caster chrome soft-cap now in the Rulebook pack).

## Foundry checklist (Michael)
1. [ ] Technomancer (or Elementalist / Street Priest) hero: install Soft Eyes (1) + Soft Ears (1) + Soft Datajack (1) + more to total **5** — no Weave Strain effect, sheet reads "Chrome spent 5 / 5 soft-cap", Magic ability roll dialog shows 0 banes.
2. [ ] Install one more implant (spent 6+) — permanent warning, Weave Strain effect on Effects tab, sheet line red; roll a Magic (Technomancer: Resonance/Wired+Magic) ability → dialog shows **1 bane**. Non-Magic ability (weapon/Matrix Verb) → no extra bane.
3. [ ] Delete implants back to ≤ 5 — info notification, effect gone, Magic rolls back to 0 banes.
4. [ ] Disable Weave Strain while over the cap — bane waived; it stays disabled on further chrome changes while over.
5. [ ] Operator/Hacker/etc. with > 5 chrome — no effect, no sheet line, no bane. Cyborg — no chrome install possible, no line.
6. [ ] Reload world with an over-cap caster that lacks the effect (e.g. one built before 0.1.81; no pregen is over — Sabbat, the Technomancer, is at 1) — GM ready sweep adds it silently.
7. [ ] Rulebook › Hero Building › Chrome & Body Integrity shows the Caster chrome soft-cap page text.
