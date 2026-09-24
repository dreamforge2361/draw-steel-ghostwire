# Medic Reagent Spend Audit

**Audit date:** 2026-09-24 12:44 PM EDT  
**Scope:** current working tree, baseline commit `2655988` (`0.3.128`); source packs and `scripts/`.  
**Lock:** HOLD the next build until every Medic ability consumes at least 1 Reagent. This audit is research only; no game code or version was changed.

## Executive findings

- There are **26 core Medic abilities** in `src/packs/classes/medic/abilities/`; each has `system.prerequisites.dsid: ["medic"]`.
- The 22 heroic abilities already have fixed `system.resource` costs from 1 to 11. Draw Steel's `AbilityModel#use` debits those costs; Ghostwire's `scripts/module.mjs` also blocks an underfunded Medic in and out of combat.
- **Three signature abilities are free at base use:** First Aid, Administer Dose, and Diagnose. Each has an optional `spend` effect of 2 Reagents, but that is not a minimum cost.
- **Field Synthesis is explicitly free:** `resource: 0`, “for 0 Reagents,” once per encounter (twice for Street-Doc), and cannot be enhanced.
- **Administer Dose has no prompt** for Stimulant vs Toxin. Its localized text branches on ally/enemy, but there is no script hook or choice dialog.
- Medic subclass ability items add two manual-only Reagent claims that are not represented as structured costs: Cutter's Reflex says “Spend 1 Reagent,” and Nano-Adrenal Auto-Injector says “spend 30 Reagents ... or permanently lose 1 Body Integrity.”

## Core Medic ability table

“Currently spends” means the base use in the current data model. Optional enhancement spend is shown separately.

| Ability name | `_dsid` | Currently spends Reagent? | Notes |
|---|---|---:|---|
| Administer Dose | `administer-dose` | **N** (optional +2) | Signature base use is free; spend effect is 2 Reagents per enhancement increment. No Stimulant/Toxin prompt. |
| Anesthetize | `anesthetize` | **Y — 5** | Fixed heroic `system.resource: 5`. |
| Battlefield Surgery | `battlefield-surgery` | **Y — 9** | Fixed heroic `system.resource: 9`. |
| Blood Doping | `blood-doping` | **Y — 3** | Fixed heroic `system.resource: 3`. |
| Chemical Interrogation | `chemical-interrogation` | **Y — 7** | Fixed heroic `system.resource: 7`. |
| Chemical Warfare | `chemical-warfare` | **Y — 9** | Fixed heroic `system.resource: 9`. |
| Combat Stims | `combat-stims` | **Y — 3** | Fixed heroic `system.resource: 3`; enhanced crash text is present, with no separate spend effect. |
| Diagnose | `diagnose` | **N** (optional +2) | Signature base use is free; 2-Reagent spend effect buys multiple-target or encounter-duration enhancement. |
| Emergency Patch | `emergency-patch` | **Y — 1** | Fixed heroic `system.resource: 1`. |
| Emergency Transfusion | `emergency-transfusion` | **Y — 9** | Fixed heroic `system.resource: 9`. |
| Field Adrenal | `field-adrenal` | **Y — 7** | Fixed heroic `system.resource: 7`. |
| Field Synthesis | `field-synthesis` | **N — 0** | `resource: 0`; text explicitly says “for 0 Reagents” and “can’t be enhanced.” |
| First Aid | `first-aid` | **N** (optional +2) | Signature base use is free; 2-Reagent spend effect upgrades the Restorative, revives, or extends distance. |
| Focus Serum | `focus-serum` | **Y — 5** | Fixed heroic `system.resource: 5`. |
| Full Kit Purge | `full-kit-purge` | **Y — 11 minimum** | `system.resource: 11`; text says spend **all remaining** Reagents, with a +1-per-Reagent enhancement beyond 11. |
| Miracle Worker | `miracle-worker` | **Y — 7** | Fixed heroic `system.resource: 7`. |
| Nerve Agent | `nerve-agent` | **Y — 11** | Fixed heroic `system.resource: 11`. |
| Nerve Toxin | `nerve-toxin` | **Y — 7** | Fixed heroic `system.resource: 7`. |
| Perfect Diagnosis | `perfect-diagnosis` | **Y — 9** | Fixed heroic `system.resource: 9`. |
| Purge Toxins | `purge-toxins` | **Y — 5** | Fixed heroic `system.resource: 5`. |
| Rapid Field Diagnosis | `rapid-field-diagnosis` | **Y — 3** | Fixed heroic `system.resource: 3`. |
| Slap-Injector | `slap-injector` | **Y — 1** | Fixed heroic `system.resource: 1`. |
| The Doctor Is In | `the-doctor-is-in` | **Y — 11** | Fixed heroic `system.resource: 11`. |
| Toxic Cloud | `toxic-cloud` | **Y — 3** | Fixed heroic `system.resource: 3`. |
| Triage | `triage` | **Y — 5** | Fixed heroic `system.resource: 5`. |
| Wonder Drug | `wonder-drug` | **Y — 11** | Fixed heroic `system.resource: 11`. |

### Immediate lock candidates

1. `first-aid`: add a minimum Reagent cost; preserve or redefine the current optional +2 enhancement.
2. `administer-dose`: add a minimum Reagent cost and add a Stimulant vs Toxin prompt/selection path.
3. `diagnose`: also currently has no minimum cost; it was not named in the smoke note but is the same signature pattern.
4. `field-synthesis`: explicitly free by current class text. Decide whether the “all abilities” lock has an intentional exception, or change the ability and its class/feature prose together.

## Medic subclass ability items

These are additional `type: "ability"` items under `src/packs/classes/medic/origins/`, included because they are Medic-class content even though their prerequisites are subclass DSIDs.

| Ability name | `_dsid` | Currently spends Reagent? | Notes |
|---|---|---:|---|
| Clean Delivery | `clean-delivery` | **N** | Says Administer Dose gains one additional target “at no additional Reagent cost.” It is a rider, not an independent spend hook. |
| Cutter’s Reflex | `cutters-reflex` | **N (data hook missing)** | Description says “Spend 1 Reagent,” but `system.resource` is null, there is no spend effect, and no dedicated script hook. |
| Emergency Excision | `emergency-excision` | **N** | Once per session; disables chrome. No Reagent language. |
| Nano-Adrenal Auto-Injector | `nano-adrenal-auto-injector` | **N (data hook missing)** | Prose says spend 30 Reagents or permanently lose 1 Body Integrity; no structured cost or dedicated script hook. |
| Improvise! | `improvise` | **N — grants 2** | Once per encounter, regains 2 Reagents up to capacity. `scripts/reagents.mjs` gates it by low-bag threshold, encounter use, and capacity. |

## Class features affecting Reagents

| Feature | `_dsid` | Spend behavior / hook |
|---|---|---|
| Reagents | `reagents` | Defines the heroic pool, capacity, persistence, and signature-enhancement model; does not itself spend. Its prose currently says every heroic ability and signature enhancement spends, which conflicts with the three free signatures and Field Synthesis data above. |
| Craft Reagents | `craft-reagents` | Does not spend. `scripts/reagents.mjs` creates a linked downtime project; completion refills the kit to capacity and resets project points. |
| Advanced Chem-Prep | `advanced-chem-prep` | Does not spend; adds 2 kit capacity. |
| Emergency Priority | `emergency-priority` | Once per session, waives one ability's Reagent cost; this is an intentional cost exception that must be reconciled with an “every ability” lock. |
| Established Protocols | `established-protocols` | Grants Stabilize and Identify at no Reagent cost; these are prose procedures, not separate ability items. |
| Field Partner | `field-partner` | Healing the bonded ally grants 1 Reagent via `[[/gain 1 hr]]`; the global Reagent cap hook clamps the result. |
| Reputation | `medic-reputation` | Grants Victories-worth of Reagents at encounter start, capped by kit capacity. |
| Compound Mastery / Master Chemist | `compound-mastery` / `master-chemist` | Waive normal enhancement Reagent costs for selected/all compound families; these are spend waivers, not spend automation. |

## `scripts/` automation audit

- **`scripts/module.mjs`**
  - `registerConsumableUse()` is registered during module setup (around line 174).
  - `enforceHeroicResourceCost()` wraps `AbilityModel#use` and refuses a Medic use when current Reagents are below `system.resource`; because Medic Reagents persist, this check applies outside combat too.
  - `patchPersistentReagents()` skips the normal combat reset and start-turn gain for class DSID `medic`.
  - `registerReagents()` is registered after consumable-use so the `AbilityModel#use` wrappers chain.
- **`scripts/reagents.mjs`**
  - Enforces kit capacity through `preUpdateActor` for all grant paths.
  - Builds and syncs the generated `craft-reagents-project`; completion refills to capacity.
  - Patches Improvise! by `_dsid`, enforcing once-per-encounter/low-bag rules and granting up to capacity.
  - Does **not** add a minimum cost to First Aid, Administer Dose, Diagnose, or Field Synthesis, and does **not** prompt for Administer Dose compound family.
- **`scripts/consumable-use.mjs`**
  - `Field Surgery Kit` (`field-surgery-kit`) has `spend: true`, `target: selfOrAlly`, and `stabilize: true`: it consumes a kit item/quantity and stabilizes a dying target. It has no `reagentGrant`, so it does not spend a Reagent.
  - `Slap-Doc Kit` (`slap-doc-kit`) has `spend: true`, restores 2 Recoveries, clears a physical condition, and consumes the kit unit. It has no `reagentGrant`, so it does not spend a Reagent.
  - `Raw Reagent` and `Raw Reagent (3-Pack)` use `reagentGrant: 1`: only a Medic can use them, a full kit refuses without consuming the unit, and a successful use adds 1 Reagent through the shared capacity planner. This is a **grant**, not a spend.
  - Trauma Patch is also a gear-unit spend (`recoveries: 1`, once per combat), not a Reagent spend.
- **Underlying cost path:** the core Draw Steel `AbilityModel#use` handles `system.resource` and optional spend effects through the actor resource update. Ghostwire supplies the Medic persistence/underfunded-use guard; it does not currently inject a minimum Reagent cost into free signature abilities.

## Files inspected

- `src/packs/classes/medic/abilities/*.json` (26 core ability items)
- `src/packs/classes/medic/*.json` (class and Reagent economy features)
- `src/packs/classes/medic/origins/**/*.json` (subclass ability riders)
- `src/packs/gear/general/medical/*.json` (Field Surgery, Slap-Doc, Raw Reagent, Trauma Patch)
- `scripts/module.mjs`
- `scripts/reagents.mjs`
- `scripts/consumable-use.mjs`

**No game code, pack JSON, language data, version, or Git history was modified by this audit.**

