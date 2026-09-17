# Spike B42e1 — Apply Pass C Michael locks (clear 12 markers)

**Repo:** draw-steel-ghostwire  
**Depends on:** Pass C apply already on disk (0.1.58 uncommitted); locks table in `docs/spikes/B42-RAW-REVIEW-FLAGS.md` ("Pass C — Michael locks 2026-09-17").  
**Do NOT commit** until Michael verifies.

## Goal
Apply every row of the Michael locks table to `docs/raw/`, remove all `[PASS-C NEEDS MICHAEL: …]` markers, update the Pass C applied section to "locks resolved", regenerate journals + packs if needed, bump one patch only if packs change.

## Per-lock edits (exact)
1. **14-commander:** mode title `Command Presence` → `Command Persona`; delete the naming marker.
2. **14-commander:** keep Master of Voice 3-dice-keep-2; delete the exception marker (leave the "Deliberate exception" prose).
3. **18-street-priest Faith Is Our Armor:** keep 5/10/15 + result-band note; delete the spike-contradiction marker.
4. **15-medic restock:** rewrite restock paragraph to lifestyle/project abstraction; discounts apply to Director-quoted cost; delete marker. Do not invent ¥ numbers.
5. **15-medic Full Kit Purge:** print Doctor-Is-In baseline at 11; each Reagent past 11 = +1 Recovery value healing per target; delete marker.
6. **15-medic crash:** duration 1 round base / 2 enhanced; Pharmaceutical Grade −1 round; keep −1/−2 magnitude; delete marker. Align Pharmaceutical Grade feature text if it still says only "duration" without the new duration model.
7. **16-wrench:** state ×2 / ×½ per band gap explicitly; delete marker.
8. **17-elementalist:** Essence cap E4 = 20; remove "may reach 24"; delete marker.
9. **20-technomancer:** Resonance Slam + Weaver's Web → Weakened (save ends); fix Winded glossary bullet 2; delete marker.
10. **18-street-priest independent form:** point at summons/spirits Guardian/Warrior/Hunter templates by subclass; delete marker (may note Veil Entities refine later in one short sentence, not a PASS-C marker).
11. **18-street-priest Dark failed-bind:** strike = 4 + Persona; delete marker.
12. **18-street-priest Judgment:** bane + Conviction only; remove optional bonus-damage rider; delete marker.

## Also
- Grep `docs/raw` for `PASS-C NEEDS MICHAEL` — must be **zero** hits.
- Update flags: move Michael locks table under "Pass C — applied" as resolved; note B47 still owns pack/lang sync (Command Persona mode string in `lang/en.json`).
- Regenerate: `node tools/raw-to-journals.mjs` then `node tools/build-packs.mjs` (Foundry closed).
- Module patch bump only if packs change.

## Out of scope
Editing Foundry ability JSON (B47); inventing Medic ¥ tables; Veil Entities full bestiary; commit/push.

## Done when
Zero PASS-C markers; locks visible in prose; journals regenerated; checklist printed; **no commit**.

## Michael checklist
1. Grep clean for PASS-C NEEDS MICHAEL.
2. Spot Faith 5/10/15; Purge numbers; Jump-In/scale ×2; Essence 20; Weakened on Slam/Web; Judgment no bonus damage.
3. Commander mode says Command Persona; Master of Voice still 3d10-keep-2.