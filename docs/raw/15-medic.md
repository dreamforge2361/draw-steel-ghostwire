# The Medic

**RAW status:** draft  
**Sources:** `docs/rulebook/04-medic.md`

---

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Instinct — primary; Logic — secondary |
| **Heroic Resource** | Reagents |
| **Epic Resource / Capstone** | Master Chemist (10th level) |
| **Potency: Weak / Average / Strong** | Prime − 2 / Prime − 1 / Prime |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light-to-moderate — most Medics work through the bag alone; a Combat-Medic build may take a weapon Kit for melee/ranged self-sufficiency |
| **Skills** | **Medicine** (signature skill — first aid, trauma care, surgery support, biological stabilization) and **Medicine Lore / chemistry-alchemy** (pathogens, drugs, toxins, physiology) are the class's two anchor skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. An interpersonal or perception skill (bedside manner, reading patients) rounds out the baseline. A fourth free pick follows your subclass: streetwise/contacts (Street-Doc), corporate/pharma-science (Corp-Medtech), or cybertech/mechanics (Ripperdoc). |

**No Wired, no Veil.** The Medic is fully mundane — reliable, always-available support with no supernatural or digital infrastructure required: a Medic's kit works the same in a dead zone, a Faraday-shielded bunker, or a desanctified ruin as it does anywhere else.

**Characteristic Increases:**
- **4th level:** Instinct and Logic each rise to 3.
- **7th level:** all five characteristics rise by +1 (max 4).
- **10th level:** Instinct and Logic each rise to 5.

---

## Reagents — Your Heroic Resource

**Reagents** are your kit — literally. Trauma patches, syringes, antitoxin vials, gas canisters, stim injectors, and the raw chemical stock to brew more of all of it. Unlike every other GHOSTWIRE class's Heroic Resource, Reagents do **not** reset at the end of an encounter. You **prep the kit before a run**, **spend it down across the run**, and **restock only in downtime.** The bag you bring is the bag you have, for as many fights as the run throws at you before you get a chance to resupply.

**Kit capacity by Echelon:**

| Echelon | Kit Capacity (Reagents) |
|---|---|
| **E1** (lowest) | 10 |
| **E2** | 14 |
| **E3** | 20 |
| **E4** (highest) | 38 |

**Per-dose cost.** Producing a basic compound or enhancing a signature ability costs **2 Reagents** — one "unit" of the kit. At E1 (10 capacity), that's five doses total before the bag runs dry.

**Prep on respite.** At a respite, you bank a reserve up to your kit's Echelon capacity. The bag you bring into the field is the bag you have — there is no mid-run resupply short of downtime access (a resupply run, a black-market contact, a corp requisition).

**Expend in the field.** Every heroic ability and every signature enhancement spends Reagents from this pool. When the pool hits zero, you fall back on raw Medicine skill — basic first aid (Established Protocols, see Core Class Features) still works — but every potent option is gone until you restock.

**Field Synthesis — the free improv valve.** Once per encounter, as a maneuver, you may produce a **half-strength compound for 0 Reagents.** This represents scrounging the battlefield for whatever will do the job — a stripped first-aid kit off a downed enemy, a jury-rigged antidote from spare parts. It never taxes the bag. Full mechanics in its own Deep Dive section, below.

**Restock in downtime.** Refilling to full kit capacity is a project/lifestyle activity handled at respite, tied to nuyen and the Economy's crafting subsystem — buying raw chemical stock, calling in a supplier, or spending downtime hours synthesizing from scratch.

**CRITICAL — Reagents persist across encounters.** This is the single biggest mechanical difference between the Medic and every other resource-tracked GHOSTWIRE class. A Wrench's fielded-fleet income, an Elementalist's attunement, a Street Priest's Conviction — all of those reset to zero (or refill) at the start of a fresh encounter. **Reagents do not.** The bag empties across a **run**, not a fight. A Medic who blows the whole kit trying to keep the crew alive in the first firefight of a three-fight run has a real, table-visible problem for fights two and three.

**Cap & carry-over.** Unspent Reagents persist indefinitely between encounters within the same run; the stock is capped at your tier's kit capacity (you cannot bank more than the cap even by refusing to spend for several fights in a row); only a downtime refill restores you to full.

**Reagents outside combat.** Reagents are a physical kit, so they **still spend outside combat**. Unlike the per-encounter Heroic Resources of other classes, a Medic does **not** get free out-of-combat uses of Reagent-costing abilities or signature enhancements: every dose used in a negotiation, an infiltration, or a quiet moment between fights comes out of the same bag.
- **Established Protocols stay free** at all times — stabilizing a dying ally and identifying a substance never cost Reagents.
- **Field Synthesis is encounter-only.** It's a scrounged, under-fire improvisation usable once per encounter (twice for a Street-Doc); it is not a free compound between encounters or in downtime.

**Firewall note.** Reagents is class power on the BP side of the firewall — kit capacity, compound access, and all heroic abilities are class features earned with BP/XP, never bought with money. **Nuyen (¥)** pays for *restocking* Reagents at respite and for *buying* better gear, foci, or tools — money buys **supply**, never **capability**. A Medic with more nuyen refills the bag faster and starts each run closer to full; they never unlock a new compound family by spending cash.

> **What are Reagents?** Reagents are the Medic's Heroic Resource: a persistent kit-stock representing your actual physical medical and chemical supplies. You bank it to capacity at respite, spend it down across a run producing compounds and enhancing signatures, and it does **not** refill between encounters — only downtime restocking brings it back up.

---

## Compounds — What Reagents Become (the four families)

Every Reagent you spend becomes a **compound** — a physical dose of something you've prepared or brewed. There are four families, and each one's base magnitude is keyed to your **Recovery value**, so a compound always scales with the same number that scales your own healing.

### Restoratives (heal)

Trauma patches, coagulants, wound sealant, surgical stabilizers.

| Property | Value |
|---|---|
| **Base** | Heal Recovery value in Stamina |
| **Enhanced (+2 Reagents)** | +50% (round up) |
| **Effect** | Heal Stamina, stabilize a dying ally, revive a downed ally |

### Antidotes & Cures

Anti-tox, anti-rad, antivirals, purgatives.

| Property | Value |
|---|---|
| **Base** | Removes 1 poison/disease/Exposure-clock step |
| **Enhanced (+2 Reagents)** | Removes 2 steps |
| **Effect** | Cure poison, cure disease, neutralize toxins, treat the Exposure clock (rads, hypothermia, tox) |

### Stimulants & Combat Drugs

Stims, focus boosters, pain-blockers, adrenal spikes.

| Property | Value |
|---|---|
| **Base** | +1 edge, or ignore 1 condition, for 1 round |
| **Enhanced (+2 Reagents)** | +1 round duration, or +1 additional ally |
| **Crash Rider (automatic)** | **−1 to next Power Roll after the buff ends** (**−2** if the buff was enhanced). No save, no opt-out. Corp-Medtech reduces crash *duration* by 1 round (see Subclasses, below) — the crash still happens, it just recovers faster. |

### Toxins & Gas

Poisons, neurotoxins, blister agents, knockout gas, acid.

| Property | Value |
|---|---|
| **Base** | **2 + Instinct** damage total over **2 rounds** (half each round, round up on the first tick) + **Weakened** until the end of the target's next turn after the last tick |
| **Enhanced (+2 Reagents)** | **4 + Instinct** damage over 2 rounds (same split) + **Weakened** and **Slowed** until the end of the target's next turn after the last tick |
| **Effect** | Damage-over-time, debuffs, area-denial gas clouds |

---

## Signature Abilities (No Reagent Cost)

Every Medic has these **three signatures**, free, at-will, from 1st level — no choice involved, unlike a class that picks 2-of-N. All three key off **Instinct**, all three can be enhanced by spending Reagents for a stronger effect, and none of them ever costs Reagents at their base effect.

> **First Aid** *(Class Feature Signature)*
> *Main action (or maneuver, for a quick patch) · Distance: touch · Target: one living ally or self*
> **Power Roll:** 2d10 + Instinct + Medicine.
>
> | Tier | Effect |
> |---|---|
> | low (≤11) | Small patch, or stabilize a dying target without healing. |
> | middle (12–16) | Heal Recovery value. |
> | high (17+) | Heal Recovery value + clear a minor condition (Bleeding, Dazed). |
>
> **Enhance (spend 2+ Reagents):** apply a full Restorative compound for a much larger heal, revive a downed ally to their feet, or heal at range via thrown patch/injector.

> **Administer Dose** *(Class Feature Signature)*
> *Main action · Distance: touch or thrown short (Ranged 5) · Target: one creature, ally OR enemy*
> **Effect:** the same action heals a friend or harms a foe depending on what's loaded in the injector.
> - **Ally target:** no roll. Deliver a Stimulant compound — the target gains +1 edge OR ignores 1 condition for 1 round. (Crash rider applies.)
> - **Enemy target:** **Power Roll** 2d10 + Instinct. Deliver a Toxin compound — the target takes **2 + Instinct** damage over 2 rounds (half each round, round up on the first tick) and is **Weakened** until the end of its next turn after the last tick. Enhanced (+2 Reagents): **4 + Instinct** over 2 rounds, **Weakened** and **Slowed**.
>
> **Enhance (spend 2+ Reagents):** a stronger or longer-duration compound, or dose an extra target.

> **Diagnose** *(Class Feature Signature)*
> *Maneuver · Distance: sight · Target: one creature*
> **Effect:** read the target's condition — remaining Stamina band, active conditions/poisons/diseases, weaknesses; on a foe, this identifies a vulnerability an ally can exploit (grant an edge against it).
>
> | Tier | Effect |
> |---|---|
> | low (≤11) | Partial read — Stamina band only. |
> | middle (12–16) | Learn the target's condition and one weakness. |
> | high (17+) | Full read + grant the whole crew an edge against the target for 1 round. |
>
> **Enhance (spend 2+ Reagents):** read multiple targets in one maneuver, or grant a crew-wide edge for the full encounter.

---

## Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are the Medic's Reagent-fueled compounds — chosen by cost band as you level, layered on top of the always-on Signature kit above. Power Roll results: **low** (≤11) / **middle** (12–16) / **high** (17+). Costs: **1 / 3 / 5 / 7 / 9 / 11.**

### 1-Cost Band (chosen at 1st level)

> **Emergency Patch** *(1 Reagent)*
> *Maneuver · Distance: touch · Target: self or one ally*
> No Power Roll. Target heals **half Recovery value** in Stamina, and Bleeding stops immediately if the target had it.

> **Slap-Injector** *(1 Reagent)*
> *Maneuver · Distance: touch · Target: self or one ally*
> No Power Roll. Choose one: the target gains a **save-end** against one active condition, OR the target gains **+1 to their next Power Roll.** (This is a mild stim — no crash rider.)

### 3-Cost Band (chosen at 1st level)

> **Combat Stims** *(3 Reagents)*
> *Main action · Distance: touch or short range · Target: up to 2 allies*
> No Power Roll. Each target gains an extra maneuver this turn, a significant edge on their next roll, and temporary Stamina equal to your Recovery value, all for 1 round.
> **Crash Rider (automatic):** each recipient takes −1 to their next Power Roll after the buff ends (−2 if enhanced).

> **Toxic Cloud** *(3 Reagents)*
> *Main action · Ranged area, cube 3 (dist 10) · Target: enemies in the cube*
> No Power Roll (or Instinct-vs-defense per Director's table). Deploy a gas cloud. Each enemy in the area takes the base Toxin dose — **2 + Instinct** damage over 2 rounds (half each round, round up on the first tick) and **Weakened** until the end of its next turn after the last tick; the zone becomes hazardous terrain — enemies must leave it or keep suffering.

> **Rapid Field Diagnosis** *(3 Reagents)*
> *Maneuver · Ranged area, burst 5 · Target: enemies in the burst*
> No Power Roll. Diagnose every enemy in the burst simultaneously. The whole crew gains an edge against any Diagnosed enemy for 1 round.

> **Blood Doping** *(3 Reagents)*
> *Main action · Distance: touch · Target: one ally*
> No Power Roll. Target reduces incoming damage by 5 for 1 round, and immediately gains temporary Stamina equal to your Recovery value.

### 5-Cost Band (chosen at 1st level)

> **Triage** *(5 Reagents)*
> *Main action · Ranged, dist 10 · Target: up to 4 allies*
> No Power Roll. Each target heals Recovery value in Stamina, stabilizes if dying, and clears one condition or poison.

> **Purge Toxins** *(5 Reagents)*
> *Main action · Distance: self or Ranged 10 · Target: self or one ally*
> No Power Roll. Target removes **all** poisons, diseases, and Exposure-clock steps immediately.

> **Focus Serum** *(5 Reagents)*
> *Main action · Distance: touch or short range · Target: up to 2 allies*
> No Power Roll. Each target gains **+2 on all Power Rolls** for 1 round.
> **Crash Rider (automatic):** each recipient takes −1 to their next Power Roll after the buff ends (this is a combat drug — the rider applies exactly as it does for any Stimulant compound).

> **Anesthetize** *(5 Reagents)*
> *Main action · Ranged 5 · Target: one enemy*
> **Power Roll:** 2d10 + Instinct.
>
> | Tier | Effect |
> |---|---|
> | low (≤11) | **Dazed** until the end of its next turn. |
> | middle (12–16) | **Dazed** (save ends). |
> | high (17+) | **Unconscious** — removed from the fight until the end of its next turn, or until it takes damage (Director's call which). |

### 7-Cost Band (chosen at 3rd level) — includes Miracle Worker

> **Miracle Worker** — *see the full Deep Dive section below.*

> **Nerve Toxin** *(7 Reagents)*
> *Main action · Ranged 10 · Target: one creature*
> **Power Roll:** 2d10 + Instinct. **6 + Instinct** damage total over **3 rounds** (equal ticks, round up on earlier ticks); target is Slowed and Weakened for the full duration.

> **Chemical Interrogation** *(7 Reagents)*
> *Main action · Ranged 5 · Target: one creature*
> No Power Roll (or a contested Instinct-vs-Physique check for a resistant target, Director's call). For 3 rounds, the target answers questions truthfully. Out of combat, this is a social apex tool; in combat, it compels the target to reveal one piece of intel.

> **Field Adrenal** *(7 Reagents)*
> *Main action · Self-centered, adjacent · Target: self + up to 2 adjacent allies*
> No Power Roll. Each target gains an extra full action this turn (main action + maneuver + move).
> **Crash Rider (automatic, enhanced-tier):** all recipients take **−2** to their next Power Roll after the buff ends.

### 9-Cost Band (chosen at 5th level)

> **Chemical Warfare** *(9 Reagents)*
> *Main action · Ranged area, cube 5 (dist 10) · Target: enemies in the cube*
> No Power Roll (or Instinct-vs-defense, Director's table). A massive gas cloud fills the area for 3 rounds. Every enemy in the area takes damage-over-time and is Weakened and Slowed; the zone remains hazardous terrain for its full duration.

> **Emergency Transfusion** *(9 Reagents)*
> *Main action · Ranged 10 · Target: up to 4 allies*
> No Power Roll. Each target heals Recovery value in Stamina. Each dying ally stabilizes. Each dead ally (within the Director's "freshly-killed" line — see Miracle Worker Deep Dive, below) revives at 1 Stamina.

> **Perfect Diagnosis** *(9 Reagents)*
> *Maneuver · Ranged 10 · Target: all enemies in range*
> No Power Roll. All crew members gain an edge against all enemies in range for 3 rounds. You also learn additional tactical information about the single strongest enemy present.

> **Battlefield Surgery** *(9 Reagents)*
> *Main action · Distance: touch · Target: one ally*
> No Power Roll. Target heals Recovery value × 5, and all conditions and toxins on them are purged. For the next 3 attacks made against the target, they gain resistance 5.

### 11-Cost Band (chosen at 8th level)

> **Wonder Drug** *(11 Reagents)*
> *Main action · Ranged 10 · Target: entire crew*
> No Power Roll. For the rest of the encounter, all crew gain +1 to all Power Rolls, an extra maneuver each turn, and temporary Stamina equal to your Recovery value.
> **Crash Rider (automatic, enhanced-tier):** at the end of the encounter, all crew take **−2** to the first Power Roll of the next scene.

> **Nerve Agent** *(11 Reagents)*
> *Main action · Battlefield-wide (Director's table) · Target: all enemies present*
> Each enemy makes a save or is Weakened and Slowed; all affected enemies take **6 + Instinct** damage total over **3 rounds** (equal ticks, round up on earlier ticks) regardless of save result.

> **Full Kit Purge** *(minimum 11 Reagents)*
> *Main action · Ranged 10 · Target: Director's table, scales with spend*
> Spend **all** remaining Reagents in your kit at once (minimum 11). The effect scales directly with the amount spent: mass revive, mass heal, and mass condition-clear, scaled by Reagents burned. This empties your kit completely.

> **The Doctor Is In** *(11 Reagents)*
> *Main action · Ranged 10 · Target: entire crew*
> No Power Roll. Every ally in range: heals Recovery value × 2, clears all conditions, and revives if dying or dead (within the Director's freshly-killed line). Each also gains temporary Stamina equal to your Recovery value.

---

## Miracle Worker — Deep Dive

> **Miracle Worker**
> *Main action · Distance: touch or Ranged 10 (per chosen effect, see below) · Cost: 7 Reagents*
> Choose **one** of three effects:
>
> | Effect | Result |
> |---|---|
> | **Full revive** | Fully revive a downed ally — even one freshly-killed, per the Director's line (see below) — in Ranged 10, at **1 Stamina.** |
> | **Total purge** | Purge **all** toxins, diseases, and conditions from one target. |
> | **Massive single-target heal** | Restore Recovery value × 3 to one critical ally. |

**Cost breakdown.** 7 Reagents, once selected, produces exactly one of the three effects above — you do not get to layer them.

**Interaction with the Director's "freshly-killed line."** Miracle Worker's full-revive option (and Emergency Transfusion's and The Doctor Is In's equivalent riders, at higher tiers) can bring back a target who has **just died**, not only one who is merely dying/downed at 0 Stamina. "Just died" means: **within 1 round of the moment of death**. Beyond that 1-round window, the target is gone — not even Miracle Worker reaches that far.

**Purge scope.** Total purge (and every other purge-flavored effect in this chapter — Purge Toxins, Battlefield Surgery, The Doctor Is In) clears **all active toxins, diseases, and conditions.** It does **not** regrow a missing limb, undo a permanent injury, reverse Body Integrity loss, or cure anything that isn't a toxin/disease/condition in the game's mechanical sense.

---

## Field Synthesis — The Improv Valve

> **Field Synthesis** *(0 Reagents, maneuver, once per encounter)*
> Produce a **half-strength compound** of any of the four families (Restorative, Antidote, Stimulant, or Toxin), scrounged from whatever's on hand — a stripped first-aid kit off a downed enemy, spare chemical stock jury-rigged into something usable, a gas canister repurposed on the spot.

**What "half-strength" means per family:**

| Family | Half-Strength Effect |
|---|---|
| **Restorative** | Heal **half** Recovery value in Stamina. |
| **Antidote** | Removes **½ step** of a poison/disease/Exposure-clock effect (Director's table: round down, or treat as a partial/temporary suppression rather than a full step-clear). |
| **Stimulant** | Same **+1 edge**, but the duration is only **half a round** (effectively: the edge applies to the very next roll only, not the full round). |
| **Toxin** | **Half damage** of the base Toxin magnitude, over the same 2-round window. |

**Cannot be enhanced.** Field Synthesis produces an already-half-strength dose by definition — there is no "spend 2 more Reagents to enhance it" option.

**Once per encounter, no exceptions.** A Medic cannot chain multiple Field Syntheses in a single fight.

---

## Combat Drug Crash Rider — Deep Dive

**Automatic. No save. No opt-out.** Every time a Stimulant/combat-drug compound's buff ends — whether from Administer Dose, Combat Stims, Focus Serum, Field Adrenal, or Wonder Drug — the recipient takes the crash rider. There is no roll to avoid it, no resistance that reduces it, and no way to decline the dose and still get the buff. If you take the stim, you take the crash.

| Crash Tier | Penalty |
|---|---|
| **Base** | **−1** to the recipient's next Power Roll after the buff ends. |
| **Enhanced** | **−2** to the recipient's next Power Roll after the buff ends. |

**Corp-Medtech's partial mitigation.** The Corp-Medtech subclass's Pharmaceutical Grade feature reduces crash **duration** by 1 round — the crash still happens, at the same −1/−2 magnitude, but the affected character recovers from it one round sooner than they otherwise would. This does **not** eliminate the crash, reduce its magnitude, or grant immunity; it only shortens how long the penalty window lasts. See Subclasses, below, for the full Pharmaceutical Grade writeup.

---

## Medic Subclasses (with per-Level tables)

At 1st level, every Medic chooses one of three **specializations**, defined by setting flavor rather than battlefield role — Street-Doc, Corp-Medtech, or Ripperdoc. Your specialization tints your kit's flavor, grants a distinct feature ladder, and colors how the rest of the world sees you (corp cover, contacts, chrome load). All three share the identical Instinct/Logic chassis and Reagent engine; each grants a feature ladder across levels 1, 2, 3, 5, 6, 8, and 9.

---

### Street-Doc — *"Back-Alley Generalist"*

Best kit-economy of the three — you stretch Reagents further and recover faster from running dry.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Make Do** | You improvise and restock Reagents faster and cheaper. Field Synthesis can be used **twice** per encounter instead of once, and produces a **two-thirds-strength** compound instead of half-strength. |
| **1** | **Back-Alley Wits** | First Aid gains an edge when targeting an ally below half Stamina. |
| **1** | **Improvise!** *(triggered)* | Free triggered action, once per encounter: when your kit has 3 or fewer Reagents remaining, gain 2 Reagents back — you found something in the trash. |
| **2** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (2nd-band options). |
| **3** | Subclass feature | **Scrounger's Eye** — once per respite, when restocking, you may reduce the nuyen cost of a full kit refill by 25% by spending extra time (Director's table on exact time cost). |
| **5** | Subclass feature (choice) | **Back-Alley Network** — choose one: gain a free Renown tier bump among street clinics, OR gain an edge on all Field Synthesis productions. |
| **6** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (6th-band options). |
| **8** | Subclass feature | **Nothing Wasted** — Emergency Patch and Slap-Injector cost 0 Reagents once per encounter each. |
| **9** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (9-band, apex options). |

**Street-Doc Ability Table**

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Trash-Bin Chemistry** | Field Synthesis may produce a Toxin-family compound in addition to the other three families. |
| 2 | **Regular Customer** | Gain a standing black-market-pharma contact who sells Reagent restocks at a 15% discount. |
| 6 | **Back-Alley Miracle** | Once per encounter, Emergency Patch may target 2 allies instead of 1 for no additional Reagent cost. |
| 6 | **Fast Hands** | First Aid may be performed as a maneuver (instead of a main action) once per round, at base-tier effect only (no enhancement). |
| 9 | **The Doc Who Never Left** | Once per session, treat a failed restock roll (nuyen shortfall, supplier unavailable) as a success — you find a way, no questions asked. |
| 9 | **Last Syringe** | Once per session, when your kit is at 0 Reagents, produce one base (non-enhanced) compound for free. |

*Corp cover: "unlicensed neighborhood doctor" / "street medical services." Bonus skill: streetwise/contacts, plus a fixer, ganger-clinic, or black-market-pharma contact.*

---

### Corp-Medtech — *"Clean Professional"*

Better product, cleaner delivery, and a recovery curve on the crash rider that no other specialization can match.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Pharmaceutical Grade** | Compounds you produce are **+50% base magnitude OR +1 buff round OR +1 additional target** (pick per compound, at the moment it's produced). Crash duration is **1 round shorter** on any Stimulant compound you produce (still happens, just recovers faster). |
| **1** | **Licensed Protocol** | Combat Stims and Administer Dose compounds last **1 additional round.** |
| **1** | **Clean Delivery** *(triggered)* | When you use Administer Dose and the target is within 3 squares, gain +1 target for free (no additional Reagent cost). |
| **2** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (2nd-band options). |
| **3** | Subclass feature | **Standardized Dosing** — your Restorative and Antidote compounds' magnitudes no longer vary with improvisation penalties (Director's table: removes any narrative "you're working with substandard equipment" penalty the Director might otherwise apply). |
| **5** | Subclass feature (choice) | **Corporate Requisition** — choose one: gain a free Renown tier bump among corp-med circles, OR reduce your next kit-refill nuyen cost by 25%. |
| **6** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (6th-band options). |
| **8** | Subclass feature | **Premium Stock** — the Pharmaceutical Grade bonus can be applied twice to a single compound (stacking the chosen bonuses, or choosing two different ones) once per encounter. |
| **9** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (9-band, apex options). |

**Corp-Medtech Ability Table**

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Datahaus Access** | Diagnose's enhanced effect (crew-wide edge) extends its duration by 1 round. |
| 2 | **Pharma Supplier** | Gain a standing corp-clinic contact who sells Reagent restocks at a 15% discount, no black-market risk. |
| 6 | **Reduced Comedown** | Your crash-rider penalty caps at −1 regardless of enhancement tier (the enhanced −2 never applies to compounds you produce). |
| 6 | **Batch Processing** | Triage may target up to 5 allies instead of 4, for no additional Reagent cost. |
| 9 | **Gold-Standard Protocol** | Once per session, produce any compound at maximum Pharmaceutical Grade bonus (both a magnitude/round/target bump AND the reduced crash) simultaneously, at no extra Reagent cost. |
| 9 | **Crash Protocol Override** | Once per session, waive the crash rider entirely on one Stimulant compound you produce. |

*Corp cover: "licensed medical practitioner" / "pharmaceutical specialist." Bonus skill: corporate/pharma-science, plus a corp-clinic, pharma-supplier, or medical-datahaus contact.*

---

### Ripperdoc — *"Chrome Surgeon"*

The only specialization with a self-revive capstone.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Under the Knife** | Premier chrome installer/repairer. Gain an edge on install, repair, and removal downtime projects; reduced botch risk; access to rarer implants. Resonance-adjacent flesh work extends to Cyborgs' organic components (you can work on the meat parts of a chromed-out Cyborg the way other Medics can't). |
| **1** | **Metal & Meat** | First Aid and Diagnose work at an edge on chrome-heavy patients and partial-Cyborgs where other Medics struggle. |
| **1** | **Cutter's Reflex** *(triggered)* | When a chromed ally (2+ chrome pieces installed) takes damage, you may spend 1 Reagent to reduce that damage by 5. |
| **2** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (2nd-band options). |
| **3** | Subclass feature | **Steady Hands** — your downtime install/repair/removal projects take 25% less time. |
| **5** | Subclass feature (choice) | **Chop-Shop Connections** — choose one: gain a free Renown tier bump among ripperdoc networks, OR gain access to one rare/black-market implant per tier at reduced nuyen cost. |
| **6** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (6th-band options). |
| **8** | **Nano-Adrenal Auto-Injector** *(capstone — see full writeup below)* | Self-revive capstone. |
| **9** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (9-band, apex options). |

**Ripperdoc Ability Table**

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Chrome Whisperer** | Cutter's Reflex's damage reduction increases to 8. |
| 2 | **Black-Market Parts** | Gain a standing chop-shop or chrome-fence contact who sells rare implants at reduced availability restriction. |
| 6 | **Surgical Precision** | Once per encounter, First Aid on a chrome-heavy or partial-Cyborg target automatically counts as high (17+), regardless of the roll. |
| 6 | **Overclock Protocol** | Once per encounter, grant a chromed ally (2+ pieces) a free Combat Stims-equivalent effect targeting only them, for 0 Reagents (crash rider still applies). |
| 9 | **The Whole Package** | Once per session, perform a full chrome tune-up on an ally during a respite: they gain a temporary edge on their next chrome-reliant roll for the following encounter. |
| 9 | **Emergency Excision** | Once per session, as a maneuver, disable one chrome implant on a touched enemy (or willing ally) until their next respite. No Body Integrity refund mid-fight. |

*Corp cover: "cybertech specialist" / "surgical prosthetics engineer." Bonus skill: cybertech/mechanics, plus a chop-shop, ripperdoc-network, or chrome-fence contact.*

**Nano-Adrenal Auto-Injector — full writeup:**

> **Nano-Adrenal Auto-Injector** *(Ripperdoc 8th-level capstone)*
> A nano-adrenal auto-injector wired directly into the Ripperdoc's own chrome. When reduced to 0 Stamina, you may trigger the injector: **burn 30 Reagents from your kit, OR permanently lose 1 Body Integrity,** to auto-revive at **1 Stamina** at the start of your next turn.
> - **Once per session.** Even if both payment options are available, the injector can only fire once between full rests/session boundaries (Director's table on exact reset cadence).
> - **Reagents payment requires availability.** If your kit has fewer than 30 Reagents banked at the moment of death, the Reagent-payment option simply isn't on the table — only the Body Integrity option remains.
> - **Body Integrity loss is permanent.** This is not a temporary penalty and does not heal on its own; it represents genuine physical cost to a body that's already been substantially chromed.

This is the **only** self-revive mechanic anywhere in the Medic class. Street-Doc and Corp-Medtech Medics cannot self-revive by any means available in this chapter — if they hit 0 Stamina without outside help, they need Miracle Worker, Emergency Transfusion, or The Doctor Is In from an ally, exactly like every other class in the game.

---

## Level 1-10 Progression Table

| Level | Class Features | Abilities Known | Subclass |
|---|---|---|---|
| **1** | Specialization choice, Reagents (heroic resource), Kit, **Field Partner**, **Established Protocols**, Signatures (First Aid, Administer Dose, Diagnose) | Signature ×3, 1-cost, 3-cost, 5-cost | L1 subclass features + triggered action |
| **2** | **Field Synthesis** (feature — the free improv valve), **Advanced Chem-Prep** (+2 to Reagent kit capacity), Perk | (same) | +L2 subclass ability |
| **3** | 7-cost band unlocked (Miracle Worker) | +7-cost | +L3 subclass feature |
| **4** | Characteristic Increase (Instinct & Logic to 3), **Compound Mastery**, Perk, Skill, **Field Reputation** | (same) | (same) |
| **5** | 9-cost band unlocked | +9-cost | +L5 subclass feature (choice) |
| **6** | Perk, **Emergency Priority** | (same) | +L6 subclass ability |
| **7** | Characteristic Increase (+1 all, max 4), **Colleague & Mentor**, **Cross-Trained**, Skill | (same) | (same) |
| **8** | Perk, 11-cost band unlocked | +11-cost | +L8 subclass feature (Ripperdoc = **Nano-Adrenal Auto-Injector** capstone) |
| **9** | **Battlefield Renown** | (same) | +L9 subclass ability |
| **10** | Characteristic Increase (Instinct & Logic to 5), **Reputation**, **Master Chemist**, **Legend of the Street**, Perk, Skill | (same) | (same) |

---

## Core Class Features (Non-Subclass)

- **Field Partner** (1st) — Bond with one ally per encounter. That ally gains **+1 to saves** and **+1 to any healing you apply to them**; you gain **+1 Reagent** back whenever that ally is healed by one of your abilities.
- **Established Protocols** (1st) — Two rote procedures, usable at will, at no Reagent cost, with no roll: **stabilize a dying ally** who has hit 0 Stamina, and **identify a substance or toxin at a glance.** This is the floor the Medic never falls below, even at 0 Reagents.
- **Field Synthesis** (2nd, feature) — The free improv valve. See its own Deep Dive section, above, for full mechanics.
- **Advanced Chem-Prep** (2nd) — Your kit capacity increases by **+2** on top of your tier's baseline.
- **Compound Mastery** (4th) — Pick one compound family (Restorative, Antidote, Stimulant, or Toxin). Compounds from that family are automatically enhanced at **no extra Reagent cost.**
- **Field Reputation** (4th) — A Renown boost among street clinics or corp-med circles (per your specialization's usual social lane), plus a narrative foothold with local medical infrastructure.
- **Emergency Priority** (6th) — Once per session, on the first turn of an encounter, one ability's Reagent cost is **waived entirely.**
- **Colleague & Mentor** (7th) — A bonus contact, plus an edge when teaching a skill to an ally during downtime.
- **Cross-Trained** (7th) — At respite, you may swap one of your key skills for a related one, reflecting how a working Medic's practical education keeps shifting with the jobs they take.
- **Battlefield Renown** (9th) — All allies gain an edge on their next roll whenever you use Miracle Worker or Triage — the crew rallies visibly the moment the doc goes to work.
- **Reputation** (10th) — At the start of an encounter, gain bonus Reagents equal to your Victories, up to your kit capacity.
- **Master Chemist** (10th, epic capstone) — All compounds you produce are automatically enhanced by default, without spending the extra Reagents an enhancement normally costs.
- **Legend of the Street** (10th) — Once per session, perform one impossible feat of medicine — Director-adjudicated, narrative in scope, the Medic's answer to "surely that shouldn't be possible."

---

## Kits & Chrome interaction (Medical Consumables shelf integration, chrome-positive rule)

**Kit access: light-to-moderate.** Most Medics work entirely through the bag — a Kit slot isn't strictly necessary to function. A Combat-Medic build, expecting to take and give hits at melee or short range, may take a weapon Kit for self-sufficiency; the rest of the class's identity holds either way.

**Medical Consumables shelf integration.** The Medical Consumables shelf is the store-bought baseline every Medic (and every non-Medic who wants basic field medicine) can access with nuyen alone:

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile |
|---|---|---|---|---|
| **Trauma Patch / MediPatch** | Avail. street | 5 | ¥100 | Heals 1 Recovery value OR stops Bleeding. |
| **Stim Patch / Combat Stimulant** | Avail. professional | 4 | ¥350 | Clears Dazed/Slowed/Weakened OR gain a maneuver this turn; crash = Weakened next round. |
| **Field Surgery Kit / Trauma Kit** | Avail. specialist | 3 | ¥2,000 | Reusable — enables stabilizing a dying ally + edge on First Aid. |
| **Antidote Dose / Broad Antitox** | Avail. specialist | 3 | ¥1,500 | Cancels one poison/toxin. |
| **Slap-Doc Kit / Nanite Med-Foam** | Avail. milspec | 2 | ¥8,000 | Heals 2 Recovery values + clears one condition. |

**Note:** all store-bought consumables cap at (at most) 2× Recovery value, so store-bought supply never rivals a trained Medic's own compounds.

**Chrome interaction — fully mundane, chrome-positive.** The Medic has **no magic to erode**. **Cyborgs are allowed**, and any Medic of any species can augment freely, up to their Body Integrity limit, with zero mechanical penalty to Reagent capacity, compound access, or any class feature.

**The flesh-side installer.** The Medic is the **flesh-and-blood surgeon** who installs, repairs, and removes chrome as downtime projects. The Ripperdoc specialization leans hardest into this identity (see Under the Knife, above), but any Medic can attempt a chrome-installation downtime project; the Ripperdoc is simply the best at it.

**The three healers, distinguished.** GHOSTWIRE has three classes with genuine healing capability, and they do not overlap:

| Class | Heals | Method | Limitation |
|---|---|---|---|
| **Medic** | Living, organic flesh; cures poison/disease/toxins | Mundane chemistry and trauma medicine | No effect on machines, drones, or non-organic chrome components |
| **Street-Priest** | Flesh *and* soul | Divine power through the Veil, at the cost of the Price | Cannot heal without paying the pact's toll |
| **Technomancer** | Machines, drones, chrome, and Cyborgs specifically | Techno-magic | No effect on purely organic, non-augmented tissue |

---
