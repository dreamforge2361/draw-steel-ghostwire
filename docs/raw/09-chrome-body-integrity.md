# Chrome & Body Integrity

**Pass A locks** (living Body Integrity **20**, three grades, magic erosion, removal scar 75%/25%) stay intact below. **Cyborgs** use this chapter too: Body Integrity **25** start and living Chrome from the same pack. This pass publishes the **implant ¥ + Availability** catalog from the shipped Chrome pack and the Soft SKU spike — not from invented numbers.

---

## Core distinction — chrome vs Cyborg

| Path | What it is | System |
|---|---|---|
| **Cyber-augmented hero** | Living person (any non-Cyborg People); implants **overlay** flesh | **This chapter** — ¥ + Body Integrity **20** |
| **Full-Conversion Cyborg** (*Machina sapiens*) | Machine-first chassis; person **replaced** | **This chapter** — ¥ + Body Integrity **25** + living Chrome; **Arcane Severance**; Frame Modules = later retag stub |

Pushing Integrity to zero does **not** turn a hero into a Cyborg. Becoming a Cyborg is a chargen species choice, never a chrome outcome.

**Chrome does not raise Taint.** Installing or removing implants spends or refunds Body Integrity only. The shared hero stain track is **Taint 0–12** (**Corruption & Taint**). Cyborgs still use Taint (demons, pacts, zones) **and** Body Integrity.

## Body Integrity (living 20 / Cyborg 25)

- **Pool:** every living (non-Cyborg) People begins with **Body Integrity 20**. **Cyborgs** begin with **Body Integrity 25**. Species/Background may nudge later — open.
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

## Magic erosion

Every living caster — Elementalist, Street Priest, Technomancer — uses this one formula. Casting-resource **cap** reduced by:

| Grade installed | Cap loss |
|---|---|
| Standard | **−1 per 2** Integrity spent (round down) |
| Soft / Bioware | **−1 per 3** Integrity spent |
| Salvage | **−1 per 1** Integrity spent |

Soft grade is the mage's only realistic escape valve — and high-Availability / late-game by design.

### Caster chrome soft-cap (LOCKED)

**Elementalist, Street Priest, and Technomancer** may spend at most **5 Body Integrity** on chrome (Soft, Standard, and Salvage all count toward this total). Soft grade remains the intended path under that ceiling.

While Integrity spent on chrome is **greater than 5**, every **Magic / Veil / Resonance** power roll (signatures and heroic casting abilities) takes a **bane**. The bane lasts until surgical removal brings spent Integrity back to **5 or less**.

**Magic erosion** (the grade table above) still applies for spent Integrity **at or under** the soft-cap. The soft-cap is a hard cliff on top of erosion, not a replacement for it.

> **In Foundry**
> On the hero sheet **Stats** tab, the **Body Integrity** fieldset shows current/max (Cyborgs **25** max). Installing a chrome Item spends Integrity automatically when you can afford the cost and slot; removal refunds 75%. Chrome install does **not** raise **Taint** (the 0–12 fieldset under Integrity). Casters (Elementalist, Street Priest, Technomancer) also see a soft-cap line (**Chrome spent X / 5**); over the cap adds the **Weave Strain** Active Effect and a bane on Magic/Veil/Resonance power rolls. A second hint shows casting-resource **cap after magic erosion**; primary resource updates clamp to that cap. Cyborgs remain **Arcane Severance** (no caster classes) — the soft-cap line does not apply to them.



## Suppress / Damage / Destroy (summary)

Reuses conditions + Wired biofeedback (not a bespoke ladder):

- **Suppressed** — temporary offline (EMP, hostile decker, spell); biofeedback jolt possible; recovers when effect ends / reboot.
- **Damaged** — works at a penalty until downtime repair.
- **Destroyed** — benefit gone; Integrity **locked out** until repair-or-replace downtime; neural destroy can wound hard.

**The ladder is live in Foundry:** each chrome Item carries a condition at `flags.draw-steel-ghostwire.chromeState` (Online / Suppressed / Damaged / Destroyed), *adjacent* to the catalog `chrome` flag, which stays untouched.

- **Grade shifts the outcome.** **Soft / Bioware** takes one step milder (a pulse that suppresses standard chrome does nothing to bioware); **Salvage / Used** takes one step worse. **Standard** is the baseline. Nothing can Destroy Soft chrome outright.
- **Suppressed** switches the implant's Active Effects off until a reboot (a maneuver, or free at the start of the mark's next turn).
- **Damaged** leaves the benefit running at a **bane** until a downtime repair Project (goal 30 + 10 × Integrity cost; parts 25% of its ¥). Natural menders: **Wrench**, **Medic / street-doc**, **Technomancer**.
- **Destroyed** switches the benefit off and **locks its Body Integrity out**. The Item is **never deleted** — a bare delete is refused, because deletion would hand back the 75% removal refund. Repair-or-replace is a harder Project (goal 60 + 20 × Integrity cost; parts 60% of its ¥), or the Director uses **Replace destroyed chrome**, which refunds nothing.

**What writes it.** Hacker 1-shot magazine chips — **Pulse** (E1, Suppress), **System Rot** (E2, Damage), **Sunder Spike** (E3, Destroy) — against wireless chrome while Connected. Technomancer **Resonance Pulse** (Suppress) and **Chrome Sunder** (5 Resonance, Destroy), neither of which needs the implant to be wireless. **Resonance Mending** and **Machine God’s Rite** clear what RAW already said they clear.

**Table guardrail:** one implant Destroyed per target per encounter. Exact numbers for called shots and other anti-cyber effects are still unpublished; the Director adjudicates with **Set chrome condition…**.

## Install / remove / repair (downtime loop)

1. **Acquire** — buy with ¥; Availability gated (Economy).
2. **Install** — downtime surgery; spends Integrity; fills slots; botch can cost extra Integrity / lasting condition.
3. **Battle-damage replacement** — lost limb/eye → cyber fix restores function but spends Integrity.
4. **Remove** — downtime; frees slots; returns 75% Integrity (scar 25%).
5. **Repair** — Damaged/Destroyed mended in downtime. Natural installers: **Wrench**, **Medic/street-doc**, **Technomancer**-adjacent features.

## Packages overview

A **Chrome Package** is a pre-vetted suite: one product, one surgery, one ¥ payment, published total Integrity + slot footprint, legal-by-construction. Grade applies to the whole package. Convenience premium vs itemizing; **no more capability** than the equivalent itemized build. **One package per role**; no location overlap; no same-effect double-dip.

### Signature package lines (6)

| Package | Role | Bundled loadout (representative) |
|---|---|---|
| **"Roadrunner" Kinetic Suite** | Mobility | Running gear + reaction enhancer + balance augmentation |
| **"Argus" Perception Array** | Sensory & Comms | Cyber-eyes + cyber-ears + datajack/comm link |
| **"Bulwark" Hardframe** | Durability | Dermal plating + bone lacing + internal filtration |
| **"Lazarus" Trauma Package** | Health & Recovery | Secondary heart/trauma damper + toxin scrubber + wound-seal weave |
| **"Warhound" Combat Rig** | Combat | Wired reflexes + implant weapon + targeting link |
| **"Silvertongue" Social Suite** | Influence | Vocal modulator + empathy processor + tailored pheromone gland |

Bundle prices and package Integrity totals remain **PROVISIONAL** (not in the Chrome pack). Heroes never start with a free chrome package.

## Implant catalog (¥ + Availability)

Flesh has a price list. The tables below are the **living-hero chrome buy list**: name, grade, Body Integrity, ¥, Availability (Street → Prototype), and a one-line effect already published in RAW or on the Foundry Chrome Item. Buy with ¥, gate on Availability (**Kits, Gear & Wealth**, `08`), install in downtime, spend Integrity — the loop in **Install / remove / repair** above.

**Sources for these rows (do not invent off-table):** Standard SKUs from the Ghostwire Chrome pack; Soft SKUs from the Soft SKU spike (Soft = **4×** the matching Standard ¥ and **one Availability step up**, with Soft-only Silvertongue pieces priced beside Soft Vocal Modulator). Salvage grade still uses the Pass A Integrity multiplier (×**1.5** Standard) but has **no published ¥ / Availability SKUs** yet.

**How to read a row**

| Column | Meaning |
|---|---|
| **Grade** | Soft / Standard / Salvage — same Pass A trade (¥ vs Integrity vs erosion) |
| **BI** | Body Integrity spent on install |
| **¥** | Purchase price before surgery fees |
| **Avail** | Street · Professional · Restricted · Military · Prototype |
| **Effect** | Brief benefit already in RAW / pack text — not a new power grant |

### Standard / Clinic

Baseline street-clinic metal. Default grade for Operators, Scouts, and anyone who can afford the scar.

| Implant | Location | BI | ¥ | Avail | Effect |
|---|---|---:|---:|---|---|
| Datajack | Head / Neural | 1 | 500 | Street | Direct-neural Wired / device interface |
| Vocal Modulator | Head / Neural | 1 | 800 | Professional | Edge on Deception tests |
| Implant Weapon (Spur) | Arms / Hands | 1 | 1,000 | Restricted | Concealed, non-disarmable forearm spur (grants Spur Strike) |
| Internal Air / Filtration | Torso / Core | 2 | 1,500 | Professional | Poison immunity 2; edge vs inhaled gases / toxins (manual) |
| Cyber-Ears (audio suite) | Ears / Aural | 2 | 1,800 | Professional | Edge on Perception (does not stack with Cyber-Eyes) |
| Cyber-Eyes (optical suite) | Eyes / Optics | 2 | 2,000 | Professional | Edge on Perception; ignore darkness / smoke banes on strikes (manual) |
| Running Gear | Legs / Locomotion | 3 | 2,500 | Professional | +1 speed; edge on Athletics |
| Reaction Enhancer | Nervous system | 3 | 3,500 | Restricted | +1 square when you shift with Disengage |
| Dermal Plating | Torso / Core | 4 | 4,000 | Restricted | Damage immunity 2 (all); visible chrome social cost |
| Skillwires / Encephalon | Head / Neural | 4 | 5,000 | Restricted | Loaded skillsoft edge (default Repair; swap per soft) |
| Muscle / Bone Lacing | Torso / Core | 5 | 6,000 | Restricted | +1 stability; edge on Athletics |
| Cyberlimb (Arm) | Arms / Hands | 5 | 7,500 | Restricted | Limb replace / mount; +1 damage on melee weapon abilities |
| Wired Reflexes | Nervous system | 6 | 12,000 | Military | +1 speed; +2 squares on Disengage shifts; hardest slot |

**13 Standard SKUs** priced from the Chrome pack.

### Soft / Bioware

Vat-cultured chrome for Faces and casters who refuse to carve their casting pool to ribbons. Soft Integrity = **0.4 × Standard, round up** (Pass A). Every Soft SKU below costs **1 BI**, so a single implant costs a caster **⌊1/3⌋ = 0** casting-cap erosion — still subject to the **5 BI caster soft-cap**. Soft stays high-Availability by design; never a free starting build.

| Implant | Location | BI | ¥ | Avail | Effect |
|---|---|---:|---:|---|---|
| Datajack (Soft Neural Lace) | Head / Neural | 1 | 2,000 | Professional | Direct-neural Wired / device interface |
| Vocal Modulator (Soft) | Head / Neural | 1 | 3,200 | Restricted | Edge on Deception tests |
| Empathy Processor (Soft) | Head / Neural | 1 | 4,000 | Restricted | Edge on Insight tests (Silvertongue Soft-only) |
| Tailored Pheromone Gland (Soft) | Torso / Core | 1 | 5,000 | Restricted | Edge on Persuasion; no effect behind filtration / sealed air (manual) |
| Cyber-Ears (Soft) | Ears / Aural | 1 | 7,200 | Restricted | Edge on Perception (does not stack with Cyber-Eyes) |
| Cyber-Eyes (Soft) | Eyes / Optics | 1 | 8,000 | Restricted | Edge on Perception; ignore darkness / smoke banes on strikes (manual) |

**6 Soft SKUs** priced from the Soft spike. Soft ¥ for clones are a **provisional lock** (4× Standard + one Avail step) until a future Soft price appendix revisits them — the numbers above match the shipped pack.

### Salvage / Used

Black-clinic and ex-corpse grade: **cheaper ¥**, **×1.5** Standard BI (Pass A), worst magic erosion (−1 cap per 1 BI). There are **no Salvage SKU rows** in the Chrome pack yet — Directors who need a used Datajack or scavenged Wired Reflexes treat ¥ and Availability as **PROVISIONAL** (cheap / Street-leaning) and apply the Integrity multiplier strictly.

### Provisional gaps (still unpublished)

Mark these **PROVISIONAL** until a later chrome / economy pass cites a source:

| Gap | Notes |
|---|---|
| **All Salvage ¥ + Availability** | Grade rule locked; no pack SKUs |
| **Soft variants** of Wired Reflexes, Reaction Enhancer, Muscle/Bone Lacing, Dermal Plating, Cyberlimb, Implant Weapon, Running Gear, Skillwires, Internal Air | Only the six Soft rows above have shipped |
| **Chrome Package** bundle ¥ + total Integrity | Six signature lines named; totals open |
| **Cyborg Frame Module** ¥ + hardpoint caps | Deferred: may later **retag** chrome SKUs — do not invent a separate pack yet |
| Soft ¥ multiplier as final Appendix lock | Provisional 4× + one Avail step; revisit when Soft prices are appendix-locked |

## Class hooks (short)
## Class hooks (short)

- **Operator / Scout** — natural heavy chrome; class edges on Integrity efficiency / combat implants.
- **Wrench / Medic** — installers/menders (hardware vs flesh).
- **Hacker** — attack others' chrome across the Wired more than wear it.
- **Commander / Face** — light Soft social chrome; wary of visible metal vs Persona.
- **Casters (Elementalist / Street-Priest / …)** — magic erosion (the shared formula above) discourages; Soft grade only, late and expensive.
- **Cyborg** — **included**: Body Integrity **25**, living Chrome from this pack, Arcane Severance + Cortical Firewall unchanged.

## Cyborg Frame Modules (stub — deferred)

**Lock (2026-09-23):** Cyborgs **use Body Integrity (max/start 25)** and **MAY buy living Chrome** from the chrome pack. Install debits Integrity; removal refunds 75% as for living heroes.

**Frame Modules** are **not** a separate pack in this ship. A later pass may **retag** existing chrome SKUs as Frame Modules for Cyborg fiction — do not invent new Frame Module SKUs here.

| Rule (future retag) | Detail |
|---|---|
| Currency | Same chrome ¥ + Availability for now |
| Capacity | Chrome location slots today; hardpoints may rename later |
| Magic | Still **Arcane Severance** — chrome never restores Magic casting |
| Signature | **Cortical Firewall** (psychic immunity = level) unchanged |

Until that retag, Directors and players buy Chrome for Cyborgs exactly like living runners, against the 25 Integrity pool.
