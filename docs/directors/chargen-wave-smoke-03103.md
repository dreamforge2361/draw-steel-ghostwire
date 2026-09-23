# Chargen wave smoke — 0.3.103 (G5–G10)

**Module:** `draw-steel-ghostwire` **0.3.103**  
**For:** Michael morning retest (Allfather / Foundry)

## Ship contents
- **G5** Magical Professions: **Ward Apprentice**, **Survey Hand** (+ lore note `docs/directors/g5-magical-professions-03103.md`)
- **G6** Per-step **Start over** in the Chargen Wizard footer
- **G7** Skills / Languages grant budget (Add disabled at cap; GM override)
- **G8** Early-spend **category** filters (Armor / Weapon / Foci / Wired / Food / Medical / Chrome / Vehicles)
- **G9** Header Chargen pill **hidden** after Finish (and past 1st level); open API refuses completed heroes
- **G10** Early spends sell **Programs + Chrome**; Integrity confirm before chrome install; mods still blocked

## Automated
```bash
node tools/chargen-wizard-smoke.mjs
```
Expect: `B95 Chargen Wizard smoke: all checks passed.`

## Foundry checklist (Director)
1. Close Foundry → `node tools/build-packs.mjs professions` if packs look stale → reopen world on **0.3.103**.
2. New Hero → header **Chargen** pill present → walk wizard.
3. **Background** step: Profession list includes **Ward Apprentice** and **Survey Hand**.
4. Each step: **Start over** clears that step only (confirm dialog).
5. Skills / Languages: Add greys out when budget spent; counts show.
6. Early spends: category chips work; buy a cheap **Program**; buy cheap **Chrome** → Integrity confirm → Integrity drops.
7. **Finish** → header Chargen pill **gone**; macro / open refuses with already-complete warning.
8. Residual: Class crash if still present — note separately; not part of this wave.

## Pack rebuild
Only when Foundry is closed (no LevelDB LOCK under `packs/`). Do **not** commit CURRENT/MANIFEST churn from a live Foundry session.
