# Ghostwire Core Rulebook — Chapter: Chrome & Body Integrity

**Status:** Stage 3 draft — distilled for play from the Chrome master (2026-09-16)  
**Source of record:** `docs/masters/GHOSTWIRE_CHROME_MASTER.md`  
**Pairs with:** `docs/rulebook/11-economy.md`  
**Foundry:** Integrity resource + sample implants **next** (after Michael review); class packs after. Exact ¥ prices deferred to gear pass.

**Design locks:**
- Chrome costs **¥ + Body Integrity**, never BP/XP/class power
- **Cyborgs do NOT use this chapter** (machine-first; Arcane Severance; frame modules + BP)
- Living chrome ≠ Cyborg species; Integrity 0 does not become Cyborg — it kills/flatlines
- Body Integrity starts at **20** for non-Cyborgs
- Grades: Salvage / Standard / Soft-Bioware
- Removal returns 75% Integrity (round down), 25% scar loss
- Magic erosion provisional: −1 cast-resource cap per 2 Integrity (Standard); per 3 Soft; per 1 Salvage

---

## Core distinction — chrome vs Cyborg

| Path | What it is | System |
|---|---|---|
| **Cyber-augmented hero** | Living person (any non-Cyborg People); implants **overlay** flesh | **This chapter** — ¥ + Body Integrity |
| **Full-Conversion Cyborg** (*Machina sapiens*) | Machine-first chassis; person **replaced** | Species rules — frame **modules** + BP; **Arcane Severance**; **no Body Integrity** |

Pushing Integrity to zero does **not** turn a hero into a Cyborg. Becoming a Cyborg is a chargen species choice, never a chrome outcome.

## Design pillars (5)

1. **Chrome is wealth + flesh — never character-power budget.** No BP/XP/SP cost. Economy BP firewall holds.
2. **Real situational benefits; stacking throttled.** Integrity cap + location slots + no-double-dip.
3. **Flesh is finite; the trade is permanent.** Integrity does not regen by rest; removal returns most, not all.
4. **Chrome and magic are at war.** Integrity spent erodes casting capacity (provisional formula below).
5. **Chrome can fail you.** Suppressed / Damaged / Destroyed via conditions + Wired biofeedback.

## Body Integrity (start 20)

- **Pool:** every non-Cyborg begins with **Body Integrity 20** (enough for roughly 3–5 mid-grade implants). Species/Background may nudge later — open.
- **Spend:** installing an implant permanently reduces remaining Integrity by its cost. Insufficient Integrity = cannot install.
- **Recover:** only by surgical **removal** (downtime). Returns **75%** of that implant's spent Integrity (**round down**); **25%** permanent scar loss.
- **Integrity 0:** cannot install past flesh; flirting with zero via battle-damage replacement is horror pressure, not a species change.

## Grades

| Grade | ¥ | Body Integrity | Flavor |
|---|---|---|---|
| **Salvage / Used** | Cheap | ×**1.5** of Standard | Black-clinic, ex-corpse; brutal on flesh |
| **Standard / Clinic** | Baseline | Baseline | Factory-grade default |
| **Soft / Bioware** | Expensive | ×**0.4** of Standard (**round up**) | Vat-cultured; mage-tolerable at high cost/Availability |

**Representative Standard Integrity costs:** Datajack 1 · Cyber-Eyes 2 · Cyber-Ears 2 · Wired Reflexes 6 · Muscle/Bone Lacing 5 · Dermal Plating 4 · Cyberlimb 5/limb · Implant Weapon 1 · Running Gear 3 · Skillwires/Encephalon 4 · Reaction Enhancer 3 · Internal Air/Filtration 2 · Vocal Modulator 1.

## Location slots

| Location | Typical | Slot cap |
|---|---|---|
| Head / Neural | Datajacks, skillwires, encephalon, memory | 3 |
| Eyes / Optics | Cyber-eyes, optical suites, targeting | 1 |
| Ears / Aural | Cyber-ears, audio suites | 1 |
| Torso / Core | Lacing, dermal, filtration, secondary hearts | 3 |
| Arms / Hands | Cyberlimbs, implant weapons, tool-hands | 2 per arm |
| Legs / Locomotion | Cyberlegs, jacks, running gear | 2 per leg |
| Nervous system | Wired reflexes, reaction enhancers, governors | **1** |

Slots are a hard ceiling independent of Integrity. Large implants may consume a whole location.

## Magic erosion (provisional)

Casting-resource **cap** reduced by:

| Grade installed | Cap loss |
|---|---|
| Standard | **−1 per 2** Integrity spent (round down) |
| Soft / Bioware | **−1 per 3** Integrity spent |
| Salvage | **−1 per 1** Integrity spent |

Soft grade is the mage's only realistic escape valve — and high-Availability / late-game by design.

## Suppress / Damage / Destroy (summary)

Reuses conditions + Wired biofeedback (not a bespoke ladder):

- **Suppressed** — temporary offline (EMP, hostile decker, spell); biofeedback jolt possible; recovers when effect ends / reboot.
- **Damaged** — works at a penalty until downtime repair.
- **Destroyed** — benefit gone; Integrity **locked out** until repair-or-replace downtime; neural destroy can wound hard.

Called shots and anti-cyber effects name exact numbers in Combat / Wire passes.

## Install / remove / repair (downtime loop)

1. **Acquire** — buy with ¥; Availability gated (Economy).
2. **Install** — downtime surgery; spends Integrity; fills slots; botch can cost extra Integrity / lasting condition.
3. **Battle-damage replacement** — lost limb/eye → cyber fix restores function but spends Integrity.
4. **Remove** — downtime; frees slots; returns 75% Integrity (scar 25%).
5. **Repair** — Damaged/Destroyed mended in downtime. Natural installers: **Wrench**, **Medic/street-doc**, **Technomancer**-adjacent features.

## Packages overview

A **Chrome Package** is a pre-vetted suite: one product, one surgery, one ¥ payment, published total Integrity + slot footprint, legal-by-construction. Grade applies to the whole package. Convenience premium vs itemizing; **no more capability** than the equivalent itemized build. **One package per role**; no location overlap; no same-effect double-dip.

### Signature package lines (6)

| Package (brand) | Role | Bundled loadout (representative) |
|---|---|---|
| **"Roadrunner" Kinetic Suite** *(Shiawase Mobility)* | Mobility | Running gear + reaction enhancer + balance augmentation |
| **"Argus" Perception Array** *(Renraku Sensory)* | Sensory & Comms | Cyber-eyes + cyber-ears + datajack/comm link |
| **"Bulwark" Hardframe** *(Ares Defensive)* | Durability | Dermal plating + bone lacing + internal filtration |
| **"Lazarus" Trauma Package** *(DocWagon Bioware)* | Health & Recovery | Secondary heart/trauma damper + toxin scrubber + wound-seal weave |
| **"Warhound" Combat Rig** *(Ares Military — restricted)* | Combat | Wired reflexes + implant weapon + targeting link |
| **"Silvertongue" Social Suite** *(Horizon Persona — soft only)* | Influence | Vocal modulator + empathy processor + tailored pheromone gland |

Exact bundle prices/Integrity: gear pass. No free starting chrome package (Economy starting lock).

## Early implant list (representative)

| Implant | Location | Benefit (situational) |
|---|---|---|
| Datajack | Head/Neural | Direct-neural Wired/device interface |
| Cyber-Eyes (optical suite) | Eyes/Optics | Low-light/thermal/mag/record; perception edge; destroyable |
| Cyber-Ears (audio suite) | Ears/Aural | Amp, spatial, dampers, translation |
| Wired Reflexes | Nervous system | Premium reaction / first-strike; hardest slot; heavy Integrity |
| Muscle / Bone Lacing | Torso/Core | Physique/durability edge; heavy Integrity |
| Dermal Plating | Torso/Core | Sub-dermal DR; visible chrome social cost |
| Cyberlimb (arm) | Arms/Hands | Limb replace; tool/weapon mount; called-shot target |
| Implant Weapon | Arms/Hands | Concealed, non-disarmable |
| Running Gear | Legs/Locomotion | Speed / jump edge |
| Skillwires / Encephalon | Head/Neural | Skill-soft or cognition edge; high magic erosion |
| Reaction Enhancer | Nervous system | Budget Wired cousin |
| Internal Air / Filtration | Torso/Core | Sealed breath; toxin/gas edge |
| Vocal Modulator / Empathy Processor | Head/Neural | Face chrome; Soft preferred |

Exact ¥ and Availability: gear pass.

## Class hooks (short)

- **Operator / Scout** — natural heavy chrome; class edges on Integrity efficiency / combat implants.
- **Wrench / Medic** — installers/menders (hardware vs flesh).
- **Hacker** — attack others' chrome across the Wired more than wear it.
- **Commander / Face** — light Soft social chrome; wary of visible metal vs Persona.
- **Casters (Elementalist / Street-Priest / …)** — Track 4 discourages; Soft sliver only late and expensive.
- **Cyborg** — **excluded** from this chapter entirely.


## Cyborg Frame Modules (stub — separate track)

Cyborgs do **not** spend Body Integrity or buy living Chrome implants. “More machine” uses **Frame Modules**:

| Rule | v1 stub |
|---|---|
| Currency | **¥** (+ Availability); downtime install (Wrench / machine-doc) |
| Capacity | **Hardpoints** by location (Head / Torso / Arms / Legs / Core OS) — rhyme with chrome slots, **not** Integrity |
| Effect | Modules upgrade the frame (plating, actuators, weapon mounts, battery, Firewall, drone-link, redundant cortex) |
| Magic | Still **Arcane Severance** — modules never restore Magic casting |
| Fail state | Module damage / **System Crisis** (not implant Suppress/Destroy from this chapter) |

**Sample modules (catalog later):** Reinforced Plating · Actuator Overdrive · Integrated Weapon Mount · Expanded Battery · Cortical Firewall+ · Drone Hard-Link.

Full module list, hardpoint caps, and ¥ schedule = later pass. Living heroes never buy Frame Modules; Cyborgs never buy Chrome implants.

## Point to full master

Itemized balance notes, package non-stacking detail, and deferred number lists live in `docs/masters/GHOSTWIRE_CHROME_MASTER.md`. On conflict, the master (baseline-aligned) wins until this chapter is approved.

## Open (next)

- Exact ¥ prices → gear pass
- Foundry: Body Integrity resource + sample implants (FOUNDRY-BUILD-PLAN **B8**)
- Class packs after Integrity spike
- Species/Background Integrity nudges — keep or flat 20?
- Confirm magic-erosion provisional formula in playtest
