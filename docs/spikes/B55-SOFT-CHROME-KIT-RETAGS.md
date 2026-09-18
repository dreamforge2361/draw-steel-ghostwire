# Spike B55 — Soft chrome SKUs + kit weapon retags

**Status:** implemented 2026-09-18, module **0.1.80**, **awaiting Michael's Foundry verify (not committed).**
**Closes:** the parked B44b gaps in `docs/masters/pregens/BUILD-NOTES.md` (no Soft chrome; three ranged kits tagged `bow`).

## Part A — Soft / Bioware chrome (6 SKUs)

RAW (`docs/raw/09-chrome-body-integrity.md`): Soft Integrity = **0.4 × Standard, round up**; magic erosion **−1 cap per 3** Integrity on Soft (Standard is per 2). Every Soft SKU here costs **1 Body Integrity**, so a single one costs a caster **no casting cap** (⌊1/3⌋ = 0). Erosion is still text-only (apply manually), same as Standard.

| `_dsid` | Name | Clone of | Location | BI (Std) | ¥ | Availability | Automated effect |
|---|---|---|---|---|---|---|---|
| `cyber-eyes-soft` | Cyber-Eyes (Soft) | `cyber-eyes` | Eyes | 1 (2) | 8,000 | Restricted | Perception edge |
| `cyber-ears-soft` | Cyber-Ears (Soft) | `cyber-ears` | Ears | 1 (2) | 7,200 | Restricted | Perception edge |
| `vocal-modulator-soft` | Vocal Modulator (Soft) | `vocal-modulator` | Head | 1 (1) | 3,200 | Restricted | Deception edge |
| `datajack-soft` | Datajack (Soft Neural Lace) | `datajack` | Head | 1 (1) | 2,000 | Professional | none (Wired interface text) |
| `empathy-processor-soft` | Empathy Processor (Soft) | — (Silvertongue, Soft-only) | Head | 1 | 4,000 | Restricted | Insight edge |
| `pheromone-gland-soft` | Tailored Pheromone Gland (Soft) | — (Silvertongue, Soft-only) | Torso | 1 | 5,000 | Restricted | Persuasion edge |

- **Pricing is a provisional lock:** RAW says Soft is "Expensive / often ruinously so" but publishes no multiplier. Clones use **4× the Standard ¥** and **one Availability step up** (Professional → Restricted, Street → Professional). The two Soft-only originals come from the Master's *"Silvertongue" Social Suite (Horizon Persona — soft only)* and the Chrome chapter's "Vocal Modulator / Empathy Processor — Soft preferred" row; priced to sit beside the Soft Vocal Modulator. Revisit when Appendix §F prices Soft.
- Items are cloned from the Standard JSON (same structure, `flags.draw-steel-ghostwire.chrome.grade: "soft"`), with distinct stable `_id`s (sha256 of `gw-chrome-soft:<dsid>`) and new lang keys `GHOSTWIRE.Chrome.<Key>Soft.*`. Descriptions carry a Soft/erosion paragraph.
- No code change: the install hooks in `scripts/module.mjs` already read `chrome.integrity` / `chrome.location` generically, and the sheet line localises `GHOSTWIRE.Chrome.Grades.soft` ("Soft"), which already existed.
- **B55b caster soft-cap (locked 2026-09-18, `docs/spikes/B55b-CASTER-CHROME-SOFT-CAP.md`):** casters may spend 5 BI on chrome, Soft included; above 5, a bane on Magic / Veil / Resonance power rolls. The Soft SKU descriptions state this. **Not automated here** (B55b owns the bane hook). Sabbat at 1 BI is well under it.
- RAW also tier-gates Soft ("late and expensive … never a starting build"). The pack SKUs are Echelon 1 like the rest of the chrome pack; the Restricted Availability is the gate.

### Pregens
- **Sabbat Vane** (Technomancer) now carries **Cyber-Ears (Soft)**, 1 BI (biSpent 1 / remaining 19). The dossier says he "runs almost no chrome"; the fiction hook is a grown cochlear lattice for hearing the dead frequency. `loadouts.json` + `LOADOUTS.md` updated.
- **Vessa and Kaïs stay unchromed.** Their dossiers lock it as an identity line ("Chrome: NONE … full flesh" / "Chrome: none … foci-not-chrome is his whole toolkit"). `LOADOUTS.md` names a fiction-fit Soft option for each that a Director may add (Vessa: Empathy Processor; Kaïs: Cyber-Ears (Soft)).
- **Patched by hand, not regenerated.** A dry run of `tools/pregens-to-actors.mjs` would have wiped B50 art: Vira's `humanArt`/`hybridArt`/`beastArt` flags and `-human.png` portrait, and Wren's `hybridArt`. So the generator run was reverted. Sabbat's item was embedded the way the generator's `embed()` does it, and the embedded kit copies were retagged in place. **Follow-on:** teach the generator the B50 art (or have it preserve existing `flags.*.changer`) before its next run.

## Part B — Kit weapon retags

The system relabels Draw Steel's `bow` as **"Firearm / Bow"** (`lang/en.json` → `DRAW_STEEL.Item.treasure.Weapons.Bow`). Every Ghostwire ranged treasure carries `[band, "bow"]` keywords. Kits now use the size band only, like Ghost / Gunslinger / Bulldozer. Bands follow each kit's RAW gear category (`08-kits-gear-wealth.md`) against the gear pack's `weaponBand`:

| Kit | Was | Now | Why |
|---|---|---|---|
| Hexshot | `bow` | `light`, `medium` | Bow / crossbow / dartgun spans Light (Street-Bow, Hand Crossbow, Dart Gun, Kaïs's Zapper) and Medium (Hunting Bow, Heavy Crossbow) |
| Longshot | `bow` | `medium` | Precision rifle; every longarm is Medium |
| Saturation | `bow` | `light`, `medium` | SMG (Light: Buzz-Gun, Chatter) or carbine (Medium: Streetline Carbine) |
| Streetsweeper | `bow`, `medium` | `medium` | Shotgun or carbine plus a medium weapon, all Medium |

(The brief suggested Hexshot `light` and Saturation `medium`; the bands above match RAW's gear list, since SMGs are Light and Hexshot's bows include Medium ones.)

**Kit bonuses are unaffected.** Draw Steel applies kit melee/ranged damage and distance through `_abilityBonuses` filtered on ability **keywords** `{ranged, weapon}` / `{melee, weapon}`, not on `equipment.weapon`. The field is descriptive only. B49's spawned firearm abilities carry `ranged, strike, weapon`, so Hexshot/Longshot/Saturation/Streetsweeper bonuses still apply to them. Pregen Actors' embedded kit copies (Kaïs → Hexshot, Barak → Saturation, Wren → Longshot) were retagged to match.

## Parked (not built)
- **Street/Professional heavy firearm.** The gear master's §3C Heavy Weapons has no Street or Professional SKU. The cheapest is Chatterbox (T3, ¥4,800, Restricted), so Barak's Restricted pick stands. It needs a new gear-master row first.
- Pregen compendium Actors store `biSpent` / `biRemaining`, but not the `flags.*.integrity` the install hooks read (it defaults to 20 on import). This is pre-existing and not changed here.

## Files
- New: `src/packs/chrome/{cyber-eyes,cyber-ears,vocal-modulator,datajack,empathy-processor,pheromone-gland}-soft.json`
- Edited: `src/packs/kits/ranged/{hexshot,longshot,saturation}.json`, `src/packs/kits/finesse/streetsweeper.json`, `src/packs/pregens/{sabbat-vane,kaes-vahn-estal,barak-voss-hallor,wren-sable-corvin}.json`, `lang/en.json` (6 new `GHOSTWIRE.Chrome.*Soft` blocks), `docs/masters/pregens/{loadouts.json,LOADOUTS.md,BUILD-NOTES.md}`, `docs/rulebook/STATUS.md`, `module.json` 0.1.80
- Rebuilt: `packs/chrome`, `packs/kits`, `packs/pregens` (the full `node tools/build-packs.mjs` run; only those three `.ldb`s changed)

## Foundry verify checklist (Michael)
1. Module **0.1.80** loads with no console errors.
2. **Ghostwire Chrome** compendium: 6 new Soft items. Open Cyber-Eyes (Soft): sheet line reads *Soft · Eyes / Optics · Body Integrity 1 · ¥8,000 · Restricted*, and the description has the Soft/erosion paragraph.
3. Drag **Empathy Processor (Soft)** onto a fresh living hero: "Installed" toast for 1 Integrity (20 → 19). The Insight edge shows on the roll. Delete it: refund 0 (75% of 1, round down), Integrity stays 19.
4. On a hero that already has Standard Cyber-Eyes, drag Cyber-Eyes (Soft): blocked with the Eyes slot full (cap 1). Drag it onto a Cyborg: blocked.
5. Pheromone Gland (Soft) → Persuasion edge; Vocal Modulator (Soft) → Deception edge; Datajack (Soft Neural Lace) installs with no roll change.
6. **Ghostwire Kits**: Hexshot shows weapons *Light, Medium*; Longshot *Medium*; Saturation *Light, Medium*; Streetsweeper *Medium*. None show "Firearm / Bow".
7. Hero with Longshot kit (preferred) + a Longshot rifle: **Fire Longshot** (B49) still shows the kit's +4 high-result damage and +10 distance. Spot-check Hexshot +2 damage / +10 distance with a Zapper.
8. **Ghostwire Pregens**: import **Sabbat** → Cyber-Ears (Soft) on the sheet. Import **Kaïs / Barak / Wren** → embedded kits show the new bands.
9. Regression: import **Wren** and **Vira** → Changer Forms box still swaps human / hybrid / beast art (B50 flags intact).
