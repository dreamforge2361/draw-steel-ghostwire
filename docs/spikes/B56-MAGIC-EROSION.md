# B56 — Magic erosion automation (casting-resource cap)

**Status:** Built 2026-09-18 (0.1.82). **Awaiting Michael's Foundry verify. Not committed.**
**SoR:** `docs/raw/09-chrome-body-integrity.md` § Magic erosion · `22-the-veil.md` § Chrome erodes magic · `17-elementalist.md` Cap & Loss · `18-street-priest.md` Cap & loss + Chrome erosion rule · `20-technomancer.md` Chrome Erosion.
**Related:** B55b soft-cap (Weave Strain), `docs/spikes/B55b-CASTER-CHROME-SOFT-CAP.md`. Unchanged; erosion stacks with it.

## Cap floor (LOCKED 2026-09-18)

Effective casting-resource cap **floors at 0** — never negative. effectiveCap = max(0, classMinimum, baseCap − erosion).

## ⚠ Technomancer cap: PROVISIONAL, Michael please confirm
RAW 20 says chrome erodes the **Resonance cap**, but it never prints Cap & Loss numbers for Resonance. For this build the Technomancer uses the **same 8 / 12 / 16 / 20 spine** as the Elementalist and Street Priest. There's no separate Technomancer formula, and Light-chrome tolerance gives no free Integrity (RAW says the same formula applies). If you want a different Resonance cap, only `ECHELON_CAPS` / `baseCap()` in `scripts/magic-erosion.mjs` needs to change, plus a line in RAW 20.

## Formula (locked)
Per installed chrome Item (`flags.draw-steel-ghostwire.chrome`), sum `integrity` by `grade`:

| Grade | Bucket |
|---|---|
| `soft` | softBI |
| `standard`, missing, or anything else | standardBI |
| `salvage` | salvageBI |

`erosion = ⌊softBI / 3⌋ + ⌊standardBI / 2⌋ + salvageBI`. Each grade is floored separately, as the RAW table reads.

**Base cap:** by `actor.system.echelon` (DS thresholds: levels 1–3 / 4–6 / 7–9 / 10) → **8 / 12 / 16 / 20**. The Elementalist's 7th-level "Essence Cap +4" is the E3 step, so it isn't counted again.
**Street Priest bumps:** +2 if the actor has a `feature` Item with `system._dsid` `burgeoning-saint` **or** `rising-adept` (the same 6th-level feature renamed by pact; counted once even if both are present). +4 for `most-faithful`. Detection uses the pack `_dsid`s (stable across renames and translations; advancement copies them onto the actor). A hand-made feature without the `_dsid` won't count.
**Effective cap:** `max(class minimum, base − erosion)`. The class minimum is `ds.utils.evaluateFormula(class.system.minimum, class.getRollData())`, or 0 if it can't be evaluated. Note: the Draw Steel minimum is usually negative, so extreme erosion can take the cap below 0 (RAW 18: "erode… to nothing"). Say if you want a floor of 0 instead.

## As-built

**Code:** `scripts/magic-erosion.mjs`. `registerMagicErosion({ isCasterClass })` is called from `module.mjs` init, right after `registerCasterChrome`, which now returns its `isCasterClass`. The only change to `caster-chrome.mjs` is that return value plus a header comment; the soft-cap code is untouched.

| Piece | Implementation |
|---|---|
| Who | `isCasterClass` from B55b: hero, not Cyborg, class `_dsid` in elementalist / street-priest / technomancer. Everyone else gets `null`: no flag, no clamp, no sheet line. |
| `chromeErosion(actor)` | `{ soft, standard, salvage, erosion, baseCap, effectiveCap }` or `null`. Exposed as `game.modules.get("draw-steel-ghostwire").api.chromeErosion` (also `chromeIntegrityByGrade`, `erosionFor`). |
| Flag | `flags.draw-steel-ghostwire.magicErosion` = the object above. Written only when it changes; removed when the hero stops being a caster. For sheet and debug use only; the clamp always recomputes. |
| Clamp (gains) | `preUpdateActor`: if the update sets `system.hero.primary.value` above `effectiveCap`, it's rewritten to the cap. Every DS 1.1.2 gain path ends in an Actor update: `HeroModel#updateResource` → `modifyTokenAttribute` → `#modifyHeroicResource` (turn gain, power-roll `applyGain`), `startCombat`'s direct `update({ primary.value: victories })`, and sheet or token-bar edits. So one hook covers them all without wrapping private methods. Overflow is discarded, with one info toast per actor per session (`GHOSTWIRE.MagicErosion.Clamped`). |
| Clamp (cap drops) | Chrome create / delete, chrome flag update, class / ancestry / feature create / delete, class update (level-up) → per-actor queued sync: refresh the flag and, if `primary.value > effectiveCap`, set it to the cap in the same update (silent). GM `ready` sweep and `createActor` do the same. |
| Sheet | Stats › Body Integrity fieldset, casters only, under the B55b soft-cap line: "Essence cap 7 (base 8 − erosion 1)" (the resource name comes from the class's `primary`). Red with "chrome is eroding your magic" when erosion > 0. The tooltip breaks the erosion down by grade. |
| i18n | `GHOSTWIRE.MagicErosion.{Resource, SheetLine, SheetLineEroded, Breakdown, Clamped}` |
| CSS | `.ghostwire-integrity .ghostwire-magic-erosion(.eroded)` in `styles/ghostwire.css` |

**Not changed:** soft-cap 5 / Weave Strain, the Soft SKU catalog, and RAW. RAW 09 already has the grade table, so journals weren't regenerated. Spending isn't clamped (the class minimum still governs it).

**Checked offline (Node, stubbed Foundry):** Soft 3 → 1; Soft 2 → 0; Standard 2 → 1; Salvage 1 → 1; Soft 3 + Standard 2 → 2. An L1 caster with Salvage 1 has a gain to 8 clamped to 7. E3 with Soft 3 → cap 15. A non-caster is untouched. Street Priest E4 + Rising Adept + Most Faithful → 26. `node --check` is clean on all scripts.

## Foundry checklist (Michael)
1. [ ] L1 Elementalist, no chrome: sheet reads "Essence cap 8 (base 8 − erosion 0)" (not red). Set Essence to 10 on the sheet → it saves as 8, with one info toast.
2. [ ] Set Essence to 8, then install 1 Salvage (or 2 Standard) Integrity of chrome: Essence drops to 7 and the sheet reads "cap 7 (base 8 − erosion 1)" in red. Flag `magicErosion` shows erosion 1 / effectiveCap 7.
3. [ ] Soft chrome totaling 2 Integrity → erosion 0; totaling 3 → erosion 1. Soft 3 + Standard 2 → erosion 2 (tooltip breakdown matches).
4. [ ] In combat: start-of-turn Essence gain and a power-roll resource gain stop at the cap. `startCombat` with victories > cap sets the cap.
5. [ ] Delete the chrome: the cap goes back up (the value isn't raised; it just stops being clamped).
6. [ ] Street Priest L6 with Burgeoning Saint (or Rising Adept): cap 14. L10 with Most Faithful: 26. Technomancer: same spine as the Elementalist.
7. [ ] B55b is still fine: spend > 5 Integrity → Weave Strain effect + bane on Magic rolls, and the erosion line shows alongside it.
8. [ ] Operator / Hacker with chrome: no erosion line, resource not clamped. Cyborg: nothing.
9. [ ] **Confirm the Technomancer provisional cap (8/12/16/20)** and whether caps may go below 0 (see above).
