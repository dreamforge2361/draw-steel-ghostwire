# GHOSTWIRE_MEDIC_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Medic class as of 2026-07-29 (v1 full design). All future Medic-class design, rules, and Foundry-implementation work — across every session — must reference and update THIS file, and only this file. Do not create new Medic-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and the Scout / Elementalist / Operator / Hacker / Wrench / Street Priest masters are treated for those classes.*

*Last updated: 2026-07-29 (v1). Ground truth for Part 1 is (a) the DS Troubadour class SRD mechanical spine (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Troubadour/`, retrieved 2026-07-29) reskinned into GHOSTWIRE, layered against (b) the full Medic canon chapter extracted to `/home/user/workspace/medic_canon_reference.md`, and (c) the E8 Reagents numeric baseline in that same extract. Attribute names follow the locked GHOSTWIRE convention: display label first, real DS attribute in parentheses — e.g. **Instinct (Intuition)**, **Logic (Reason)**.*

> **Attribute canon note:** GHOSTWIRE uses five characteristics. Display labels match Foundry with the Draw Steel attribute in parentheses: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. This document uses **Instinct (Intuition)** as the Medic's primary attribute and **Logic (Reason)** as secondary, per Michael's 2026-07-15 ruling. Reflex is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear in current GHOSTWIRE canon.

**Older Medic source docs** (the master baseline's full class chapter, the E8 Reagents numeric baseline, and the 1E Medical Consumables shelf) supplied canonical structure for identity, resource shape (Reagents), the subclass triad, and the three signature abilities (First Aid, Administer Dose, Diagnose). All of that content is preserved and reskinned below onto the DS Troubadour's mechanical chassis, per Michael's Q1-Q4 rulings of 2026-07-29 (see below).

## Design Rulings (LOCKED — Michael's approvals, 2026-07-15 through 2026-07-29)

1. **Primary attribute: Instinct (Intuition)** — diagnosis, steady hands, reading the room. Every First Aid, Diagnose, and heroic-ability Power Roll rolls `2d10 + Instinct`.
2. **Secondary attribute: Logic (Reason)** — chemistry, formulae, dosing math. Used for compound-crafting downtime checks and any Logic-keyed feature.
3. **Heroic Resource: Reagents** — a prep-and-expend alchemist's kit. Unlike every other GHOSTWIRE class's resource, Reagents **persist across encounters** — the bag empties across a whole run, not a single fight — and is refilled only in downtime.
4. **Three subclasses, by setting flavor:** **Street-Doc** (back-alley generalist), **Corp-Medtech** (clean professional), **Ripperdoc** (chrome surgeon).
5. **Cost ladder: 1 / 3 / 5 / 7 / 9 / 11**, matching every other GHOSTWIRE class master. Base tier (costs 1, 3, and 5) chosen at 1st level; the 7-cost tier (headlined by Miracle Worker) unlocks at 3rd level; the 9-cost tier at 5th level; the 11-cost tier at 8th level.
6. **Q1 = B ruling: Ripperdoc-only self-revive capstone.** The DS Troubadour's "self-revive at 30 Drama" mechanic is preserved **only** as a Ripperdoc 8th-level capstone feature, **Nano-Adrenal Auto-Injector** — cost is **30 Reagents burned OR 1 permanent Body Integrity loss.** Represents the surgeon-installed emergency stim. Only Ripperdocs have this; Street-Doc and Corp-Medtech Medics cannot self-revive.
7. **Q2 = B ruling: Field Synthesis is FREE.** 0 Reagents, maneuver, **once per encounter**, produces a half-strength compound. The bag still depletes on real compounds — the improv valve doesn't tax it.
8. **Q3 = A ruling: Combat drug crash is AUTOMATIC.** No save, no opt-out. You dose an ally with a combat drug, they get the buff, then they take **−1 to their next Power Roll** after the buff ends (**−2** if the buff was enhanced). Everyone at the table knows the deal going in.
9. **Q4 = A ruling: FILL both the 9-cost and 11-cost tiers with four abilities each.** Canon left both tiers blank; all eight abilities below are GHOSTWIRE-original inventions, flagged for Michael's sign-off in Part 2.
10. **Corp-Medtech feature revision (implication of Q3=A):** since crash is now universal and automatic, canon's "cleaner compounds with lighter crashes" line for Corp-Medtech is reworded. **Pharmaceutical Grade** becomes: compounds are **+50% base magnitude OR +1 buff round OR +1 additional target** (pick per compound when produced); crash duration is **1 round shorter** (still happens, just recovers faster). Still canon-faithful: better product means a bigger effect *and* a quicker recovery, not a vanished cost.
11. **Cyborgs are ALLOWED to be Medics** (unlike the Street Priest) — the Medic is fully mundane with no Veil access; magic-erosion is irrelevant. **Chrome-positive class.**
12. **Currency is nuyen (¥)** throughout — never "Wealth," never abstract credits.
13. **Attribute display convention:** GHOSTWIRE label first, DS attribute in parens — e.g. "Instinct (Intuition)," "Logic (Reason)." Five characteristics only: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. "Reflex" is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear.
14. **DS levels 1-10 are the primary progression axis.** Echelon (E1-E4) is referenced only as a cross-class tier concept (kit-capacity tiers, gear tiers, citing the E8 Reagents numeric baseline chapter by name) — it never gates a Medic feature ladder directly.

---

## PART 1 — PLAYER-FACING: THE MEDIC

### Who You Are

You are a **Medic** — on the street just **doc**, **sawbones**, **the fixer's fixer**, or simply **the one who keeps you breathing.** Corp paperwork, when it notices you at all, files you as a *"field medical contractor"* or a *"trauma-response asset."* None of that comes close to what you actually are: a **trained practitioner of medicine and chemistry** who carries a kit of syringes, trauma patches, gas grenades, combat stims, and brewed compounds into places where the nearest hospital is a rumor.

You are the **crew's street doc** — the one who keeps everyone breathing when the run goes bad. You are not a scholar of impersonal forces like the Elementalist, nor a believer with a bargain like the Street Priest. You are a **secular counterpart to the Street Priest** — same silhouette on the battlefield, a different well entirely. Where the priest heals through faith and a pact across the Veil, you heal through **skill**: years of trauma training, a mind for dosing math, and a bag that never stops being useful even when it's nearly empty. On the street you run the gamut: a back-alley general practitioner who never asks questions, a licensed corp-clinic professional moonlighting for extra nuyen, a chrome-slinging ripperdoc who treats the operating table like a second home, or a combat medic who followed the wrong contract into the wrong warzone and never quite left.

You are **the only flesh-and-blood healer of living heroes** in GHOSTWIRE — the sole class that reliably heals organic tissue, cures poison and disease, and neutralizes toxins **by chemistry alone**, with no supernatural or digital infrastructure required. You are also GHOSTWIRE's **environmental-survival class**, the one who treats the Exposure clock (radiation, hypothermia, toxins) laid out in the Hostile Environments chapter — when the crew is bleeding out from the *environment itself* rather than a bullet, you're the one with the antidote. And you are the **flesh-side surgeon** of the game's crafter/installer trio: the Wrench installs and repairs hardware, the Technomancer installs and repairs code, and you install and repair **chrome in living bodies** — the flesh-side half of every augmentation job in the setting.

Your chemistry cuts both ways. The same compounds that heal an ally can drop an enemy — you are a genuine **toxin/stim flex lane**, a battlefield controller as much as a healer, able to dose a friend with a combat stim in the same breath you gas a room full of hostiles. That flex hinge — help or harm from the exact same kit — is the Medic's signature fantasy.

**Cyborgs can absolutely be Medics.** Unlike the Street Priest, whose Veil-pact is barred to Cyborgs by Arcane Severance, the Medic has no magic to erode in the first place. You are **fully mundane, chrome-positive, and species-unrestricted** — any of the Eight Peoples, including a Full-Conversion Cyborg, can pick up the bag and the syringes. A Cyborg Medic is, if anything, the class's most on-the-nose fictional pairing: a surgeon who has personally undergone the exact procedures they perform on others.

---

### Class Chassis

*DS Troubadour reskin explanation: the Medic's mechanical spine is the DS Troubadour class — a Presence-primary support/control hybrid built around a steady per-turn resource drip (Drama), a signature-ability baseline, and a Class Act (subclass) ladder. GHOSTWIRE strips the Troubadour's performer/storyteller flavor and its entire Drama-generation loop wholesale, replacing both the fiction and the resource engine with the Medic's own canon: a **prep-and-expend alchemist's kit** called Reagents, filled before a run and spent down across it, with no "the crowd loves you" triggers anywhere in sight.*

| Stat | Value |
|---|---|
| **Core Characteristics** | Instinct (Intuition) — primary; Logic (Reason) — secondary |
| **Heroic Resource** | Reagents |
| **Epic Resource / Capstone** | Master Chemist (10th level) |
| **Potency: Weak / Average / Strong** | Prime − 2 / Prime − 1 / Prime |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light-to-moderate — most Medics work through the bag alone; a Combat-Medic build may take a weapon Kit for melee/ranged self-sufficiency |
| **Skills** | **Medicine** (signature skill — first aid, trauma care, surgery support, biological stabilization) and **Medicine Lore / chemistry-alchemy** (pathogens, drugs, toxins, physiology) are the class's two anchor skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. An interpersonal or perception skill (bedside manner, reading patients) rounds out the baseline. A fourth free pick follows your subclass: streetwise/contacts (Street-Doc), corporate/pharma-science (Corp-Medtech), or cybertech/mechanics (Ripperdoc). |

*Design note (chassis rationale, per DS Troubadour's baseline stats + GHOSTWIRE's flex-healer identity): the Medic mirrors the Troubadour's Stamina/Recoveries curve exactly (18 starting, +6/level, 8 Recoveries) — a "middle frame" that sits below the Operator's front-line durability but comfortably above the Elementalist's or Hacker's fragile-specialist bands, appropriate for a class expected to stand near the wounded and occasionally take a hit meant for someone else. Species mods (Corran heavy-frame bonus Stamina, etc.) stack on top of the class chassis in the standard way. Potency is keyed to Instinct, matching canon's "weak/average/strong keyed to Instinct (highest characteristic −2/−1/0)" line exactly.*

**No Wired, no Veil.** The Medic is fully mundane — reliable, always-available support with no supernatural or digital infrastructure required. This is a deliberate design pole opposite the Elementalist and Street Priest (Veil-casters) and the Hacker/Technomancer (Wired-dependent): a Medic's kit works the same in a dead zone, a Faraday-shielded bunker, or a desanctified ruin as it does anywhere else.

**Characteristic Increases:**
- **4th level:** Instinct (Intuition) and Logic (Reason) each rise to 3.
- **7th level:** all five characteristics rise by +1 (max 4).
- **10th level:** Instinct (Intuition) and Logic (Reason) each rise to 5.

**Advancement table shape:** DS levels 1-10, matching the Hacker/Elementalist/Operator/Wrench/Street Priest masters — see the **Level 1-10 Progression Table**, below, for the full level-by-level breakdown of features, abilities, and subclass grants.

---

### Reagents — Your Heroic Resource

**Reagents** are your kit — literally. Trauma patches, syringes, antitoxin vials, gas canisters, stim injectors, and the raw chemical stock to brew more of all of it. Unlike every other GHOSTWIRE class's Heroic Resource, Reagents do **not** reset at the end of an encounter. You **prep the kit before a run**, **spend it down across the run**, and **restock only in downtime.** The bag you bring is the bag you have, for as many fights as the run throws at you before you get a chance to resupply. All values below are the **E8 numeric baseline** (locked, not a placeholder) — this is the one Medic resource table that has already been calibrated against the game's other resource-tracked classes and carries no "v1 estimate" flag.

**Kit capacity by Echelon:**

| Echelon | Kit Capacity (Reagents) |
|---|---|
| **E1** (lowest) | 10 |
| **E2** | 14 |
| **E3** | 20 |
| **E4** (highest) | 38 |

*Rationale (per the E8 baseline): Reagents persist across encounters, so the cap runs 1.5-2× a typical Veil-caster's single-encounter resource ceiling — the strategic-reserve identity only means something if the number is big enough to matter across multiple fights, and small enough that a careless first firefight can still burn through it. Ladder rescaled from the raw E8 5-row draft into the four-Echelon canon (E1=10, E2=14, E3=20, E4=38 — middle row dropped; extremes and the mid-progression band preserved).*

**Per-dose cost.** Producing a basic compound or enhancing a signature ability costs **2 Reagents** — one "unit" of the kit. At E1 (10 capacity), that's five doses total before the bag runs dry — early play is meant to feel genuinely scarce.

**Prep on respite.** At a respite, you bank a reserve up to your kit's Echelon capacity. The bag you bring into the field is the bag you have — there is no mid-run resupply short of downtime access (a resupply run, a black-market contact, a corp requisition).

**Expend in the field.** Every heroic ability and every signature enhancement spends Reagents from this pool. When the pool hits zero, you fall back on raw Medicine skill — basic first aid (Established Protocols, see Core Class Features) still works — but every potent option is gone until you restock.

**Field Synthesis — the free improv valve (Q2=B).** Once per encounter, as a maneuver, you may produce a **half-strength compound for 0 Reagents.** This represents scrounging the battlefield for whatever will do the job — a stripped first-aid kit off a downed enemy, a jury-rigged antidote from spare parts. It never taxes the bag. Full mechanics in its own Deep Dive section, below.

**Restock in downtime.** Refilling to full kit capacity is a project/lifestyle activity handled at respite, tied to nuyen and the Economy's crafting subsystem — buying raw chemical stock, calling in a supplier, or spending downtime hours synthesizing from scratch.

**CRITICAL — Reagents persist across encounters.** This is the single biggest mechanical difference between the Medic and every other resource-tracked GHOSTWIRE class. A Wrench's fielded-fleet income, an Elementalist's attunement, a Street Priest's Conviction — all of those reset to zero (or refill) at the start of a fresh encounter. **Reagents do not.** The bag empties across a **run**, not a fight. A Medic who blows the whole kit trying to keep the crew alive in the first firefight of a three-fight run has a real, table-visible problem for fights two and three. This is the deliberate cost of the class's persistent-reserve identity: it rewards pacing and punishes panic-spending.

**Cap & carry-over.** Unspent Reagents persist indefinitely between encounters within the same run; the stock is capped at your tier's kit capacity (you cannot bank more than the cap even by refusing to spend for several fights in a row); only a downtime refill restores you to full.

**Reagents outside combat (locked 2026-09-16).** Reagents are a physical kit, so they **still spend outside combat**. Unlike the per-encounter Heroic Resources of other classes, a Medic does **not** get free out-of-combat uses of Reagent-costing abilities or signature enhancements: every dose used in a negotiation, an infiltration, or a quiet moment between fights comes out of the same bag.
- **Established Protocols stay free** at all times — stabilizing a dying ally and identifying a substance never cost Reagents.
- **Field Synthesis is encounter-only.** It's a scrounged, under-fire improvisation usable once per encounter (twice for a Street-Doc); it is not a free compound between encounters or in downtime.

**Firewall note.** Reagents is class power on the BP side of the firewall — kit capacity, compound access, and all heroic abilities are class features earned with BP/XP, never bought with money. **Nuyen (¥)** pays for *restocking* Reagents at respite and for *buying* better gear, foci, or tools — money buys **supply**, never **capability**. A Medic with more nuyen refills the bag faster and starts each run closer to full; they never unlock a new compound family by spending cash.

> **What are Reagents?** *(Inline definition, so the term is never more than a paragraph away from first use.)* Reagents are the Medic's Heroic Resource: a persistent kit-stock representing your actual physical medical and chemical supplies. You bank it to capacity at respite, spend it down across a run producing compounds and enhancing signatures, and it does **not** refill between encounters — only downtime restocking brings it back up. This is the class's defining resource-design quirk relative to every other GHOSTWIRE class.

---

### Compounds — What Reagents Become (the four families)

Every Reagent you spend becomes a **compound** — a physical dose of something you've prepared or brewed. There are four families, and each one's base magnitude is keyed to your **Recovery value** (per the E8 baseline), so a compound always scales with the same number that scales your own healing.

#### Restoratives (heal)

Trauma patches, coagulants, wound sealant, surgical stabilizers.

| Property | Value |
|---|---|
| **Base** | Heal Recovery value in Stamina |
| **Enhanced (+2 Reagents)** | +50% (round up) |
| **Effect** | Heal Stamina, stabilize a dying ally, revive a downed ally |

#### Antidotes & Cures

Anti-tox, anti-rad, antivirals, purgatives.

| Property | Value |
|---|---|
| **Base** | Removes 1 poison/disease/Exposure-clock step |
| **Enhanced (+2 Reagents)** | Removes 2 steps |
| **Effect** | Cure poison, cure disease, neutralize toxins, treat the Exposure clock (rads, hypothermia, tox) |

#### Stimulants & Combat Drugs

Stims, focus boosters, pain-blockers, adrenal spikes.

| Property | Value |
|---|---|
| **Base** | +1 edge, or ignore 1 condition, for 1 round |
| **Enhanced (+2 Reagents)** | +1 round duration, or +1 additional ally |
| **Crash Rider (automatic, Q3=A)** | **−1 to next Power Roll after the buff ends** (**−2** if the buff was enhanced). No save, no opt-out. Corp-Medtech reduces crash *duration* by 1 round (see Subclasses, below) — the crash still happens, it just recovers faster. |

#### Toxins & Gas

Poisons, neurotoxins, blister agents, knockout gas, acid.

| Property | Value |
|---|---|
| **Base** | **2 + Instinct** damage total over **2 rounds** (half each round, round up on the first tick) + **Weakened** until the end of the target's next turn after the last tick |
| **Enhanced (+2 Reagents)** | **4 + Instinct** damage over 2 rounds (same split) + **Weakened** and **Slowed** until the end of the target's next turn after the last tick |
| **Effect** | Damage-over-time, debuffs, area-denial gas clouds |

*Design note: these four families are the entire vocabulary of everything the Medic does. Every signature and every heroic ability below is built from one or more of these four buckets — a Restorative dressed up as a mass-heal, a Toxin dressed up as a gas cloud, a Stimulant dressed up as a whole-crew buff. Learning the four families is learning the class.*

---

### Signature Abilities (No Reagent Cost)

Every Medic has these **three signatures**, free, at-will, from 1st level — no choice involved, unlike a class that picks 2-of-N. All three key off **Instinct (Intuition)**, all three can be enhanced by spending Reagents for a stronger effect, and none of them ever costs Reagents at their base effect.

*Reskin note: DS Troubadour has four signatures (choose 1) — Artful Flourish, Cutting Sarcasm, Instigator, Witty Banter. The Medic replaces this entire menu with canon's own three named signatures (First Aid, Administer Dose, Diagnose), all three granted for free rather than chosen from a longer list. This mirrors how the Street Priest ported the DS Conduit's signature slots one-to-one but is a deliberate departure here: the Medic's canon chapter already specifies exactly three signatures and does not gesture at a larger pool to choose from.*

> **First Aid** *(Class Feature Signature)*
> *Main action (or maneuver, for a quick patch) · Distance: touch · Target: one living ally or self*
> **Power Roll:** 2d10 + Instinct (Intuition) + Medicine.
>
> | Tier | Effect |
> |---|---|
> | Tier 3 (≤11) | Small patch, or stabilize a dying target without healing. |
> | Tier 2 (12-16) | Heal Recovery value. |
> | Tier 1 (17+) | Heal Recovery value + clear a minor condition (Bleeding, Dazed). |
>
> **Enhance (spend 2+ Reagents):** apply a full Restorative compound for a much larger heal, revive a downed ally to their feet, or heal at range via thrown patch/injector.
> *Your baseline, every-turn lifeline — the class's answer to "someone's bleeding and there's no time to think."*

> **Administer Dose** *(Class Feature Signature — the flex hinge)*
> *Main action · Distance: touch or thrown short (Ranged 5) · Target: one creature, ally OR enemy*
> **Effect:** the same action heals a friend or harms a foe depending on what's loaded in the injector.
> - **Ally target:** no roll. Deliver a Stimulant compound — the target gains +1 edge OR ignores 1 condition for 1 round. (Crash rider applies per Q3=A.)
> - **Enemy target:** **Power Roll** 2d10 + Instinct (Intuition). Deliver a Toxin compound — the target takes **2 + Instinct** damage over 2 rounds (half each round, round up on the first tick) and is **Weakened** until the end of its next turn after the last tick. Enhanced (+2 Reagents): **4 + Instinct** over 2 rounds, **Weakened** and **Slowed**.
>
> **Enhance (spend 2+ Reagents):** a stronger or longer-duration compound, or dose an extra target.
> *This is the Medic's core identity beat — the exact same tool that saves your friend's life can end your enemy's. Nothing else in the class states the flex-lane fantasy more directly than this ability.*

> **Diagnose** *(Class Feature Signature)*
> *Maneuver · Distance: sight · Target: one creature*
> **Effect:** read the target's condition — remaining Stamina band, active conditions/poisons/diseases, weaknesses; on a foe, this identifies a vulnerability an ally can exploit (grant an edge against it).
>
> | Tier | Effect |
> |---|---|
> | Tier 3 (≤11) | Partial read — Stamina band only. |
> | Tier 2 (12-16) | Learn the target's condition and one weakness. |
> | Tier 1 (17+) | Full read + grant the whole crew an edge against the target for 1 round. |
>
> **Enhance (spend 2+ Reagents):** read multiple targets in one maneuver, or grant a crew-wide edge for the full encounter.
> *The class's intel tool — a Medic reads a body the way a Hacker reads a network, and every fight goes smoother once you know exactly what you're dealing with.*

---

### Heroic Abilities — Cost Tiers 1 Through 11

Heroic Abilities are the Medic's Reagent-fueled compounds — chosen by cost tier as you level, layered on top of the always-on Signature kit above. On our reversed Outcome Tiers (Tier 1 = 17+ = best, Tier 2 = 12-16, Tier 3 = ≤11 = worst). Costs mirror the Draw Steel caster ladder shared by every GHOSTWIRE class: **1 / 3 / 5 / 7 / 9 / 11.**

#### 1-Cost Tier (chosen at 1st level)

*The DS Troubadour SRD has no 1-cost band, and neither does the Medic's own canon chapter (canon's cheapest heroic ability, Field Synthesis, is moved to a free once-per-encounter maneuver per Q2=B — see below). These two abilities are GHOSTWIRE-original inventions, written specifically to keep the ladder floor consistent with the Hacker/Elementalist/Operator/Wrench/Street Priest templates, all of which open at cost 1. **Flagged for Michael's sign-off — see Part 2, Known Bugs #1.***

> **Emergency Patch** *(1 Reagent, GHOSTWIRE-original)*
> *Maneuver · Distance: touch · Target: self or one ally*
> No Power Roll. Target heals **half Recovery value** in Stamina, and Bleeding stops immediately if the target had it.
> *The cheapest possible spend when every other Reagent is earmarked for something bigger, but someone's losing blood right now.*

> **Slap-Injector** *(1 Reagent, GHOSTWIRE-original)*
> *Maneuver · Distance: touch · Target: self or one ally*
> No Power Roll. Choose one: the target gains a **save-end** against one active condition, OR the target gains **+1 to their next Power Roll.** (This is a mild stim — no crash rider; the dose is too small to trigger the comedown.)
> *The class's floor-level support option — quick, cheap, always useful, and gentle enough that it doesn't tax the recipient afterward.*

#### 3-Cost Tier (chosen at 1st level)

*Combat Stims and Toxic Cloud are canon, named directly in the Medic's class chapter. Rapid Field Diagnosis and Blood Doping are GHOSTWIRE-original inventions filling out the tier to match the Wrench/Street Priest/Elementalist four-per-tier shape. **Flagged for Michael's sign-off — see Part 2, Known Bugs #2.***

> **Combat Stims** *(canon, 3 Reagents)*
> *Main action · Distance: touch or short range · Target: up to 2 allies*
> No Power Roll. Each target gains an extra maneuver this turn, a significant edge on their next roll, and temporary Stamina equal to your Recovery value, all for 1 round.
> **Crash Rider (automatic, Q3=A):** each recipient takes −1 to their next Power Roll after the buff ends (−2 if enhanced).
> *The force-multiplier play — Shadowrun-style hard combat drugs that genuinely turn a fight around, at an honest cost the recipient signs up for knowingly.*

> **Toxic Cloud** *(canon, 3 Reagents)*
> *Main action · Ranged area, cube 3 (dist 10) · Target: enemies in the cube*
> No Power Roll (or Instinct-vs-defense per Director's table, numeric pass). Deploy a gas cloud. Each enemy in the area takes the base Toxin dose — **2 + Instinct** damage over 2 rounds (half each round, round up on the first tick) and **Weakened** until the end of its next turn after the last tick; the zone becomes hazardous terrain — enemies must leave it or keep suffering.
> *The Medic's area-denial signature — the same chemistry that saves lives, weaponized into a room nobody wants to stand in.*

> **Rapid Field Diagnosis** *(3 Reagents, GHOSTWIRE-original)*
> *Maneuver · Ranged area, burst 5 · Target: enemies in the burst*
> No Power Roll. Diagnose every enemy in the burst simultaneously. The whole crew gains an edge against any Diagnosed enemy for 1 round.
> *Combat-Diagnose, mass-produced — the intel signature scaled up to a whole engagement.*

> **Blood Doping** *(3 Reagents, GHOSTWIRE-original)*
> *Main action · Distance: touch · Target: one ally*
> No Power Roll. Target reduces incoming damage by 5 for 1 round, and immediately gains temporary Stamina equal to your Recovery value.
> *A pre-emptive hedge for the ally about to walk into the worst of it.*

#### 5-Cost Tier (chosen at 1st level)

*Triage is canon, named directly in the Medic's class chapter. Purge Toxins, Focus Serum, and Anesthetize are GHOSTWIRE-original inventions filling out the tier. **Flagged for Michael's sign-off — see Part 2, Known Bugs #3.***

> **Triage** *(canon, 5 Reagents)*
> *Main action · Ranged, dist 10 · Target: up to 4 allies*
> No Power Roll. Each target heals Recovery value in Stamina, stabilizes if dying, and clears one condition or poison.
> *The class's core mass-support play — a burst of field medicine across the whole crew at once.*

> **Purge Toxins** *(5 Reagents, GHOSTWIRE-original)*
> *Main action · Distance: self or Ranged 10 · Target: self or one ally*
> No Power Roll. Target removes **all** poisons, diseases, and Exposure-clock steps immediately.
> *The full-strength Antidote compound — the answer to a target who's accumulated more toxin than a single dose can clear.*

> **Focus Serum** *(5 Reagents, GHOSTWIRE-original)*
> *Main action · Distance: touch or short range · Target: up to 2 allies*
> No Power Roll. Each target gains **+2 on all Power Rolls** for 1 round.
> **Crash Rider (automatic, Q3=A):** each recipient takes −1 to their next Power Roll after the buff ends (this is a combat drug — the rider applies exactly as it does for any Stimulant compound).
> *A sharper, more precise cousin of Combat Stims — accuracy over raw output.*

> **Anesthetize** *(5 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 5 · Target: one enemy*
> **Power Roll:** 2d10 + Instinct (Intuition).
>
> | Tier | Effect |
> |---|---|
> | low (≤11) | **Dazed** until the end of its next turn. |
> | middle (12–16) | **Dazed** (save ends). |
> | high (17+) | **Unconscious** — removed from the fight until the end of its next turn, or until it takes damage (Director's call which). |
> *A surgeon's tool turned weapon — the same anesthetic that puts a patient under safely can put an enemy down hard.*

#### 7-Cost Tier (chosen at 3rd level) — includes Miracle Worker

*This tier is headlined by **Miracle Worker**, canon's own apex ability, named directly in the Medic's class chapter. Full mechanics are broken out in their own section immediately below this tier list — see "Miracle Worker — Deep Dive." The remaining 7-cost options (Nerve Toxin, Chemical Interrogation, Field Adrenal) are GHOSTWIRE-original inventions filling out the tier. **Flagged for Michael's sign-off — see Part 2, Known Bugs #4.***

> **Miracle Worker** — *see the full Deep Dive section below.*

> **Nerve Toxin** *(7 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 10 · Target: one creature*
> **Power Roll:** 2d10 + Instinct (Intuition). **6 + Instinct** damage total over **3 rounds** (equal ticks, round up on earlier ticks); target is Slowed and Weakened for the full duration.
> *The class's heaviest single-target Toxin — the compound you save for the thing that really needs to go down slowly and stay down.*

> **Chemical Interrogation** *(7 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 5 · Target: one creature*
> No Power Roll (or a contested Instinct-vs-Physique check for a resistant target, Director's call). For 3 rounds, the target answers questions truthfully. Out of combat, this is a social apex tool; in combat, it compels the target to reveal one piece of intel.
> *A chemical truth serum — the Medic's answer to interrogation that doesn't require a fist.*

> **Field Adrenal** *(7 Reagents, GHOSTWIRE-original)*
> *Main action · Self-centered, adjacent · Target: self + up to 2 adjacent allies*
> No Power Roll. Each target gains an extra full action this turn (main action + maneuver + move).
> **Crash Rider (automatic, enhanced-tier, Q3=A):** all recipients take **−2** to their next Power Roll after the buff ends.
> *The most dangerous compound in the base tier list — a full extra turn's worth of action, paid for with the harshest standard crash in the class.*

#### 9-Cost Tier (chosen at 5th level) — 4 inventions

*Canon's class chapter leaves the 9-cost tier entirely unspecified, per Michael's Q4=A ruling that both the 9-cost and 11-cost tiers should be filled with four abilities each. All four below are GHOSTWIRE-original. **Flagged for Michael's sign-off — see Part 2, Known Bugs #5.***

> **Chemical Warfare** *(9 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged area, cube 5 (dist 10) · Target: enemies in the cube*
> No Power Roll (or Instinct-vs-defense, Director's table). A massive gas cloud fills the area for 3 rounds. Every enemy in the area takes damage-over-time and is Weakened and Slowed; the zone remains hazardous terrain for its full duration.
> *Toxic Cloud's older, meaner sibling — the room-clearer.*

> **Emergency Transfusion** *(9 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 10 · Target: up to 4 allies*
> No Power Roll. Each target heals Recovery value in Stamina. Each dying ally stabilizes. Each dead ally (within the Director's "freshly-killed" line — see Miracle Worker Deep Dive, below) revives at 1 Stamina.
> *Triage's apex form — a mass-heal that can also pull the whole crew back from the brink at once.*

> **Perfect Diagnosis** *(9 Reagents, GHOSTWIRE-original)*
> *Maneuver · Ranged 10 · Target: all enemies in range*
> No Power Roll. All crew members gain an edge against all enemies in range for 3 rounds. You also learn additional tactical information about the single strongest enemy present.
> *Rapid Field Diagnosis's full-encounter form — the intel play that changes the whole fight's math.*

> **Battlefield Surgery** *(9 Reagents, GHOSTWIRE-original)*
> *Main action · Distance: touch · Target: one ally*
> No Power Roll. Target heals Recovery value × 5, and all conditions and toxins on them are purged. For the next 3 attacks made against the target, they gain resistance 5.
> *A single-target apex heal — the Medic performing genuine field surgery under fire.*

#### 11-Cost Tier (chosen at 8th level) — 4 inventions

*Canon's class chapter leaves the 11-cost tier entirely unspecified, per the same Q4=A ruling. All four below are GHOSTWIRE-original. **Flagged for Michael's sign-off — see Part 2, Known Bugs #6.***

> **Wonder Drug** *(11 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 10 · Target: entire crew*
> No Power Roll. For the rest of the encounter, all crew gain +1 to all Power Rolls, an extra maneuver each turn, and temporary Stamina equal to your Recovery value.
> **Crash Rider (automatic, enhanced-tier, Q3=A):** at the end of the encounter, all crew take **−2** to the first Power Roll of the next scene.
> *The single biggest whole-crew buff in the class — an encounter-spanning combat-drug cocktail with a cost that follows everyone into whatever comes next.*

> **Nerve Agent** *(11 Reagents, GHOSTWIRE-original)*
> *Main action · Battlefield-wide (Director's table, numeric pass on exact radius) · Target: all enemies present*
> Each enemy makes a save or is Weakened and Slowed; all affected enemies take **6 + Instinct** damage total over **3 rounds** (equal ticks, round up on earlier ticks) regardless of save result.
> *Nerve Toxin's whole-battlefield apex form — the compound that ends fights by itself.*

> **Full Kit Purge** *(minimum 11 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 10 · Target: Director's table, scales with spend*
> Spend **all** remaining Reagents in your kit at once (minimum 11). The effect scales directly with the amount spent: mass revive, mass heal, and mass condition-clear, scaled by Reagents burned. This empties your kit completely, table-changing, "everything, everywhere, all at once."
> *The class's ultimate all-in play — the Medic dumping the entire bag into one desperate, glorious effort, with nothing left for the rest of the run.*

> **The Doctor Is In** *(11 Reagents, GHOSTWIRE-original)*
> *Main action · Ranged 10 · Target: entire crew*
> No Power Roll. Every ally in range: heals Recovery value × 2, clears all conditions, and revives if dying or dead (within the Director's freshly-killed line). Each also gains temporary Stamina equal to your Recovery value.
> *The class's single biggest mass-support spend — the moment the whole crew gets to stand back up at once.*

---

### Miracle Worker — Deep Dive

*The class's defining high-Reagent play, and the headline entry of the 7-cost tier, unlocked at 3rd level. Full mechanics below; this section exists separately from the tier list above because Miracle Worker carries the Medic's core apex fantasy and deserves the same standalone treatment the Street Priest gives Invoke the Pact and the Elementalist gives Summon Elemental.*

> **Miracle Worker** *(canon)*
> *Main action · Distance: touch or Ranged 10 (per chosen effect, see below) · Cost: 7 Reagents*
> Choose **one** of three effects:
>
> | Effect | Result |
> |---|---|
> | **Full revive** | Fully revive a downed ally — even one freshly-killed, per the Director's line (see below) — in Ranged 10, at **1 Stamina.** |
> | **Total purge** | Purge **all** toxins, diseases, and conditions from one target. |
> | **Massive single-target heal** | Restore Recovery value × 3 to one critical ally. |

**Cost breakdown.** 7 Reagents, once selected, produces exactly one of the three effects above — you do not get to layer them. This is deliberately the most expensive single action in the 7-cost tier band, positioned as the class's apex trauma-medicine play rather than a routine tool.

**The three effect options, in practice:**
- **Full revive** is the "this fight just turned around" button — pulling a genuinely downed teammate back onto their feet, functional again if only barely, at the cost of a real chunk of your reserve.
- **Total purge** is the answer to a target who has accumulated so many toxins, diseases, or conditions that a normal Antidote compound (even enhanced) can't clear it all in one action — a total systemic reset.
- **Massive single-target heal** is the number that matters when someone's Stamina is critically low and there isn't time for Triage's spread-the-love approach — Recovery value × 3, focused entirely on the one ally who needs it most, right now.

**Interaction with the Director's "freshly-killed line."** Miracle Worker's full-revive option (and Emergency Transfusion's and The Doctor Is In's equivalent riders, at higher tiers) can bring back a target who has **just died**, not only one who is merely dying/downed at 0 Stamina. "Just died" means: **within 1 round of the moment of death**, per the Director's table-standard adjudication line shared across every GHOSTWIRE class with a revive-adjacent effect (the Street Priest's Arise! uses the identical standard). Beyond that 1-round window, the target is gone — not even Miracle Worker reaches that far. This line exists specifically so the Director has one consistent, table-wide answer to "can the Medic bring them back?" regardless of which specific ability is doing the asking.

**Purge scope.** Total purge (and every other purge-flavored effect in this document — Purge Toxins, Battlefield Surgery, The Doctor Is In) clears **all active toxins, diseases, and conditions.** It does **not** regrow a missing limb, undo a permanent injury, reverse Body Integrity loss, or cure anything that isn't a toxin/disease/condition in the game's mechanical sense. Miracle Worker is trauma medicine and pharmacology taken to their absolute ceiling — it is not resurrection magic, and it does not touch anything outside that scope.

**Mundane apex framing.** There is no magic anywhere in Miracle Worker. What looks miraculous is **impossible skill and the right compound at the right second** — years of trauma training compressed into one perfect intervention, backed by a chemistry that actually works. This is the load-bearing distinction between the Medic's apex and the Street Priest's: Invoke the Pact reaches across the Veil for outside help; Miracle Worker reaches into the Medic's own training and kit and finds exactly enough to make the impossible happen anyway.

**Comparison to Street-Priest's Invoke the Pact.** Both abilities sit at the identical 7-cost tier, unlocked at the identical 3rd level, and both represent their class's single biggest "turn the fight around" play. Where Invoke the Pact is a **gamble** — a Bind Check that can fail, with a real downside if it does, because you're relying on someone else answering across the Veil — Miracle Worker has **no roll to fail.** You spend the 7 Reagents, you choose your effect, it happens. That reliability is the entire point of a mundane apex ability: the Medic's power comes from things that are yours (skill, stock, dosing math), not from a bargain that can go sideways. The tradeoff is resource-side rather than roll-side — Miracle Worker's cost is real and persistent (it eats a huge chunk of a bag that doesn't refill until downtime), while Invoke the Pact's Conviction resets every encounter regardless of outcome.

---

### Field Synthesis — The Improv Valve

*Its own section, per Q2=B ruling — the free once-per-encounter fallback that keeps the Medic from ever being truly out of options, even with an empty kit.*

> **Field Synthesis** *(0 Reagents, maneuver, once per encounter)*
> Produce a **half-strength compound** of any of the four families (Restorative, Antidote, Stimulant, or Toxin), scrounged from whatever's on hand — a stripped first-aid kit off a downed enemy, spare chemical stock jury-rigged into something usable, a gas canister repurposed on the spot.

**What "half-strength" means per family:**

| Family | Half-Strength Effect |
|---|---|
| **Restorative** | Heal **half** Recovery value in Stamina. |
| **Antidote** | Removes **½ step** of a poison/disease/Exposure-clock effect (Director's table: round down, or treat as a partial/temporary suppression rather than a full step-clear — numeric pass). |
| **Stimulant** | Same **+1 edge**, but the duration is only **half a round** (effectively: the edge applies to the very next roll only, not the full round). |
| **Toxin** | **Half damage** of the base Toxin magnitude, over the same 2-round window. |

**Cannot be enhanced.** Field Synthesis produces an already-half-strength dose by definition — there is no "spend 2 more Reagents to enhance it" option, because the whole point is that it costs **zero** Reagents. Enhancing an already-free effect would break the resource logic that makes Reagents meaningful.

**Once per encounter, no exceptions.** This is the hard cap that keeps Field Synthesis a fallback rather than a replacement for the real kit. A Medic cannot chain multiple Field Syntheses in a single fight by any means short of a future feat/multiclass exception, should one ever be authored.

**The "always has something" line.** This is the design promise Field Synthesis exists to keep: **the Medic is never truly out of options, even with an empty bag.** A Medic who has burned every Reagent in the kit down to zero across a brutal run still has one more trick per fight — weaker, but real. This matters enormously given how punishing an empty kit can be mid-run; without Field Synthesis, a Medic who mismanages Reagents becomes dead weight for the rest of a multi-encounter run. With it, they're diminished, not useless.

**Design note.** Field Synthesis is calibrated specifically to **keep the strategic-reserve identity honest** while still giving the Medic a real fallback. If Field Synthesis produced full-strength compounds, there would be no meaningful cost to running the bag empty — the entire "persists across encounters, manage it carefully" identity of Reagents would collapse. Half-strength, once-per-encounter, zero-Reagent-cost is the exact needle threaded: the bag really does deplete and it really does matter, but the Medic is never a brick.

---

### Combat Drug Crash Rider — Deep Dive

*Its own section, per Q3=A ruling — the automatic, non-optional downside that makes every Stimulant compound an honest trade rather than a free lunch.*

**Automatic. No save. No opt-out.** Every time a Stimulant/combat-drug compound's buff ends — whether from Administer Dose, Combat Stims, Focus Serum, Field Adrenal, or Wonder Drug — the recipient takes the crash rider. There is no roll to avoid it, no resistance that reduces it, and no way to decline the dose and still get the buff. If you take the stim, you take the crash. Everyone at the table — players and Director alike — knows this going in, which is the entire point: it's an honest cost for real power, not a hidden gotcha.

| Crash Tier | Penalty |
|---|---|
| **Base** | **−1** to the recipient's next Power Roll after the buff ends. |
| **Enhanced** | **−2** to the recipient's next Power Roll after the buff ends. |

**Corp-Medtech's partial mitigation.** The Corp-Medtech subclass's Pharmaceutical Grade feature reduces crash **duration** by 1 round — the crash still happens, at the same −1/−2 magnitude, but the affected character recovers from it one round sooner than they otherwise would. This does **not** eliminate the crash, reduce its magnitude, or grant immunity; it only shortens how long the penalty window lasts. See Subclasses, below, for the full Pharmaceutical Grade writeup.

**Design intent.** This rider represents genuine Shadowrun-style hard combat drugs — substances that grant real, battlefield-swinging power at a real physiological cost. An ally who takes a combat stim from you *knows* they're signing up for the comedown; that knowledge is part of the fiction (nobody takes military-grade stims and expects zero consequences) and part of the tactical calculus (a smart player times their stim dose so the crash lands somewhere survivable, not mid-firefight against the boss). Making the crash automatic and universal — rather than save-avoidable or opt-in — keeps every Stimulant compound honest: the power is real, and so is the price.

---

### Medic Subclasses (with per-Level tables)

At 1st level, every Medic chooses one of three **specializations**, defined by setting flavor rather than battlefield role — Street-Doc, Corp-Medtech, or Ripperdoc. Your specialization tints your kit's flavor, grants a distinct feature ladder, and colors how the rest of the world sees you (corp cover, contacts, chrome load). All three share the identical Instinct/Logic chassis and Reagent engine; each grants a feature ladder across levels 1, 2, 3, 5, 6, 8, and 9 (mirroring the DS Troubadour's Class Act cadence).

*Corp records list each specialization differently; the street calls all three "the doc."*

---

#### Street-Doc — *"Back-Alley Generalist"*

The scrappy, improvisational medic who's kept half the neighborhood alive without ever seeing the inside of a licensed clinic. Best kit-economy of the three — you stretch Reagents further and recover faster from running dry, at the cost of the raw polish a Corp-Medtech brings to the table. Corp cover: *"unlicensed neighborhood doctor"* or *"street medical services."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **Make Do** *(canon)* | You improvise and restock Reagents faster and cheaper. Field Synthesis can be used **twice** per encounter instead of once, and produces a **two-thirds-strength** compound instead of half-strength. |
| **1** | **Back-Alley Wits** *(canon)* | First Aid gains an edge when targeting an ally below half Stamina. |
| **1** | **Improvise!** *(triggered, GHOSTWIRE-original)* | Free triggered action, once per encounter: when your kit has 3 or fewer Reagents remaining, gain 2 Reagents back — you found something in the trash. |
| **2** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (2nd-tier options). |
| **3** | Subclass feature (invented) | **Scrounger's Eye** — once per respite, when restocking, you may reduce the nuyen cost of a full kit refill by 25% by spending extra time (Director's table on exact time cost). |
| **5** | Subclass feature (choice, invented) | **Back-Alley Network** — choose one: gain a free Renown tier bump among street clinics, OR gain an edge on all Field Synthesis productions. |
| **6** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (6th-tier options). |
| **8** | Subclass feature (invented) | **Nothing Wasted** — Emergency Patch and Slap-Injector cost 0 Reagents once per encounter each. |
| **9** | Subclass ability (choose 1) | See Street-Doc Ability Table, below (9th-tier, apex options). |

**Street-Doc Ability Table** *(Class-Act-style picks, per DS Troubadour's ability cadence — all invented)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Trash-Bin Chemistry** | Field Synthesis may produce a Toxin-family compound in addition to the other three families (canon's baseline Field Synthesis doesn't specify family access; this opens all four to the Street-Doc specifically). |
| 2 | **Regular Customer** | Gain a standing black-market-pharma contact who sells Reagent restocks at a 15% discount. |
| 6 | **Back-Alley Miracle** | Once per encounter, Emergency Patch may target 2 allies instead of 1 for no additional Reagent cost. |
| 6 | **Fast Hands** | First Aid may be performed as a maneuver (instead of a main action) once per round, at base-tier effect only (no enhancement). |
| 9 | **The Doc Who Never Left** | Once per session, treat a failed restock roll (nuyen shortfall, supplier unavailable) as a success — you find a way, no questions asked. |
| 9 | **Last Syringe** | Once per session, when your kit is at 0 Reagents, produce one base (non-enhanced) compound for free. |

*Corp cover: "unlicensed neighborhood doctor" / "street medical services." Bonus skill: streetwise/contacts, plus a fixer, ganger-clinic, or black-market-pharma contact. Chrome flavor: moderate, practical — the Street-Doc chromes up for utility, not showmanship.*

---

#### Corp-Medtech — *"Clean Professional"*

The licensed, polished practitioner — better product, cleaner delivery, and a recovery curve on the crash rider that no other specialization can match. The tradeoff is a specialization built around doing the standard job *better*, rather than the Street-Doc's economy tricks or the Ripperdoc's chrome specialty. Corp cover: *"licensed medical practitioner"* or *"pharmaceutical specialist."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **Pharmaceutical Grade** *(canon, REVISED per Q3=A — see Design Rulings #10)* | Compounds you produce are **+50% base magnitude OR +1 buff round OR +1 additional target** (pick per compound, at the moment it's produced). Crash duration is **1 round shorter** on any Stimulant compound you produce (still happens, just recovers faster). |
| **1** | **Licensed Protocol** *(canon)* | Combat Stims and Administer Dose compounds last **1 additional round.** |
| **1** | **Clean Delivery** *(triggered, GHOSTWIRE-original)* | When you use Administer Dose and the target is within 3 squares, gain +1 target for free (no additional Reagent cost). |
| **2** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (2nd-tier options). |
| **3** | Subclass feature (invented) | **Standardized Dosing** — your Restorative and Antidote compounds' magnitudes no longer vary with improvisation penalties (Director's table: removes any narrative "you're working with substandard equipment" penalty the Director might otherwise apply). |
| **5** | Subclass feature (choice, invented) | **Corporate Requisition** — choose one: gain a free Renown tier bump among corp-med circles, OR reduce your next kit-refill nuyen cost by 25%. |
| **6** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (6th-tier options). |
| **8** | Subclass feature (invented) | **Premium Stock** — the Pharmaceutical Grade bonus can be applied twice to a single compound (stacking the chosen bonuses, or choosing two different ones) once per encounter. |
| **9** | Subclass ability (choose 1) | See Corp-Medtech Ability Table, below (9th-tier, apex options). |

**Corp-Medtech Ability Table** *(Class-Act-style picks, per DS Troubadour's ability cadence — all invented)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Datahaus Access** | Diagnose's enhanced effect (crew-wide edge) extends its duration by 1 round. |
| 2 | **Pharma Supplier** | Gain a standing corp-clinic contact who sells Reagent restocks at a 15% discount, no black-market risk. |
| 6 | **Reduced Comedown** | Your crash-rider penalty caps at −1 regardless of enhancement tier (the enhanced −2 never applies to compounds you produce). |
| 6 | **Batch Processing** | Triage may target up to 5 allies instead of 4, for no additional Reagent cost. |
| 9 | **Gold-Standard Protocol** | Once per session, produce any compound at maximum Pharmaceutical Grade bonus (both a magnitude/round/target bump AND the reduced crash) simultaneously, at no extra Reagent cost. |
| 9 | **Crash Protocol Override** | Once per session, waive the crash rider entirely on one Stimulant compound you produce. |

*Corp cover: "licensed medical practitioner" / "pharmaceutical specialist." Bonus skill: corporate/pharma-science, plus a corp-clinic, pharma-supplier, or medical-datahaus contact. Chrome flavor: clean, high-grade soft-bioware and diagnostic implants — nothing flashy, everything functional.*

---

#### Ripperdoc — *"Chrome Surgeon"*

The most chromed of the three specializations — a surgeon who has made the operating table their whole professional identity, installing and repairing implants as comfortably as setting a bone. The only specialization with a self-revive capstone, representing the surgeon who installed emergency hardware in themselves. Corp cover: *"cybertech specialist"* or *"surgical prosthetics engineer."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **Under the Knife** *(canon)* | Premier chrome installer/repairer. Gain an edge on install, repair, and removal downtime projects; reduced botch risk; access to rarer implants. Resonance-adjacent flesh work extends to Cyborgs' organic components (you can work on the meat parts of a chromed-out Cyborg the way other Medics can't). |
| **1** | **Metal & Meat** *(canon)* | First Aid and Diagnose work at an edge on chrome-heavy patients and partial-Cyborgs where other Medics struggle. |
| **1** | **Cutter's Reflex** *(triggered, GHOSTWIRE-original)* | When a chromed ally (2+ chrome pieces installed) takes damage, you may spend 1 Reagent to reduce that damage by 5. |
| **2** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (2nd-tier options). |
| **3** | Subclass feature (invented) | **Steady Hands** — your downtime install/repair/removal projects take 25% less time. |
| **5** | Subclass feature (choice, invented) | **Chop-Shop Connections** — choose one: gain a free Renown tier bump among ripperdoc networks, OR gain access to one rare/black-market implant per tier at reduced nuyen cost. |
| **6** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (6th-tier options). |
| **8** | **Nano-Adrenal Auto-Injector** *(CAPSTONE, Q1=B ruling — see full writeup below)* | Self-revive capstone. |
| **9** | Subclass ability (choose 1) | See Ripperdoc Ability Table, below (9th-tier, apex options). |

**Ripperdoc Ability Table** *(Class-Act-style picks, per DS Troubadour's ability cadence — all invented)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Chrome Whisperer** | Cutter's Reflex's damage reduction increases to 8. |
| 2 | **Black-Market Parts** | Gain a standing chop-shop or chrome-fence contact who sells rare implants at reduced availability restriction. |
| 6 | **Surgical Precision** | Once per encounter, First Aid on a chrome-heavy or partial-Cyborg target automatically counts as Tier 1, regardless of the roll. |
| 6 | **Overclock Protocol** | Once per encounter, grant a chromed ally (2+ pieces) a free Combat Stims-equivalent effect targeting only them, for 0 Reagents (crash rider still applies). |
| 9 | **The Whole Package** | Once per session, perform a full chrome tune-up on an ally during a respite: they gain a temporary edge on their next chrome-reliant roll for the following encounter. |
| 9 | **Emergency Excision** | Once per session, as a maneuver, disable one chrome implant on a touched enemy (or willing ally) until their next respite. No Body Integrity refund mid-fight. |

*Corp cover: "cybertech specialist" / "surgical prosthetics engineer." Bonus skill: cybertech/mechanics, plus a chop-shop, ripperdoc-network, or chrome-fence contact. Chrome flavor: the most chromed of the three specializations — a surgeon's own implants, but still fully mundane; magic-erosion is irrelevant.*

**Nano-Adrenal Auto-Injector — full writeup (Q1=B ruling):**

> **Nano-Adrenal Auto-Injector** *(Ripperdoc 8th-level capstone)*
> A nano-adrenal auto-injector wired directly into the Ripperdoc's own chrome. When reduced to 0 Stamina, you may trigger the injector: **burn 30 Reagents from your kit, OR permanently lose 1 Body Integrity,** to auto-revive at **1 Stamina** at the start of your next turn.
> - **Once per session.** Even if both payment options are available, the injector can only fire once between full rests/session boundaries (Director's table on exact reset cadence).
> - **Reagents payment requires availability.** If your kit has fewer than 30 Reagents banked at the moment of death, the Reagent-payment option simply isn't on the table — only the Body Integrity option remains.
> - **Body Integrity loss is permanent.** This is not a temporary penalty and does not heal on its own; it represents genuine physical cost to a body that's already been substantially chromed.
> - **Flavor:** the surgeon is their own patient. Only a Ripperdoc — the specialization most comfortable operating on themselves as readily as on anyone else — would have installed this in the first place.

This is the **only** self-revive mechanic anywhere in the Medic class. Street-Doc and Corp-Medtech Medics cannot self-revive by any means available in this document — if they hit 0 Stamina without outside help, they need Miracle Worker, Emergency Transfusion, or The Doctor Is In from an ally, exactly like every other class in the game.

---

### Level 1-10 Progression Table

| Level | Class Features | Abilities Known | Subclass |
|---|---|---|---|
| **1** | Specialization choice, Reagents (heroic resource), Kit, **Field Partner**, **Established Protocols**, Signatures (First Aid, Administer Dose, Diagnose) | Signature ×3, 1-cost, 3-cost, 5-cost | L1 subclass features + triggered action |
| **2** | **Field Synthesis** (feature — the free improv valve), **Advanced Chem-Prep** (+2 to Reagent kit capacity), Perk | (same) | +L2 subclass ability |
| **3** | 7-cost tier unlocked (Miracle Worker) | +7-cost | +L3 subclass feature |
| **4** | Characteristic Increase (Instinct & Logic to 3), **Compound Mastery**, Perk, Skill, **Field Reputation** | (same) | (same) |
| **5** | 9-cost tier unlocked | +9-cost | +L5 subclass feature (choice) |
| **6** | Perk, **Emergency Priority** | (same) | +L6 subclass ability |
| **7** | Characteristic Increase (+1 all, max 4), **Colleague & Mentor**, **Cross-Trained**, Skill | (same) | (same) |
| **8** | Perk, 11-cost tier unlocked | +11-cost | +L8 subclass feature (Ripperdoc = **Nano-Adrenal Auto-Injector** capstone) |
| **9** | **Battlefield Renown** | (same) | +L9 subclass ability |
| **10** | Characteristic Increase (Instinct & Logic to 5), **Reputation**, **Master Chemist**, **Legend of the Street**, Perk, Skill | (same) | (same) |

*Design note: this table mirrors the Hacker/Elementalist/Operator/Wrench/Street Priest progression table's density and shape exactly, per the 2026-07-29 level-based rework doctrine. DS Troubadour's own chassis features (signature grant at 1st, 3-cost at 1st, 5-cost at 1st, 7-cost at 3rd, 9-cost at 5th, 11-cost at 8th, Class Act ability at 2nd/6th/9th, characteristic increase at 4th/7th/10th, skill increase at 4th/7th/10th, perk at 2nd/4th/6th/8th/10th) are preserved one-to-one in the level placements above, with the entire Drama-loop feature set (Appeal to the Muses, Spotlight's crowd-approval trigger, etc.) replaced wholesale by the Reagents-appropriate equivalents named in the table.*

---

### Core Class Features (Non-Subclass)

- **Field Partner** (1st) — *(invented from Troubadour's "Scene Partner," flagged — see Part 2 Known Bugs #13)* Bond with one ally per encounter. That ally gains **+1 to saves** and **+1 to any healing you apply to them**; you gain **+1 Reagent** back whenever that ally is healed by one of your abilities.
- **Established Protocols** (1st) — *(invented from Troubadour's "Routines," flagged — see Part 2 Known Bugs #14)* Two rote procedures, usable at will, at no Reagent cost, with no roll: **stabilize a dying ally** who has hit 0 Stamina, and **identify a substance or toxin at a glance.** This is the floor the Medic never falls below, even at 0 Reagents.
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

### Kits & Chrome interaction (Medical Consumables shelf integration, chrome-positive rule)

**Kit access: light-to-moderate.** Most Medics work entirely through the bag — a Kit slot isn't strictly necessary to function. A Combat-Medic build, expecting to take and give hits at melee or short range, may take a weapon Kit for self-sufficiency; the rest of the class's identity holds either way.

**Medical Consumables shelf integration.** The 1E Medical Consumables shelf already exists in canon and should be treated as the store-bought baseline every Medic (and every non-Medic who wants basic field medicine) can access with nuyen alone:

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile |
|---|---|---|---|---|
| **Trauma Patch / MediPatch** | T5 | 5 | ¥100 | Heals 1 Recovery value OR stops Bleeding. |
| **Stim Patch / Combat Stimulant** | T4 | 4 | ¥350 | Clears Dazed/Slowed/Weakened OR gain a maneuver this turn; crash = Weakened next round. |
| **Field Surgery Kit / Trauma Kit** | T3 | 3 | ¥2,000 | Reusable — enables stabilizing a dying ally + edge on First Aid. |
| **Antidote Dose / Broad Antitox** | T3 | 3 | ¥1,500 | Cancels one poison/toxin. |
| **Slap-Doc Kit / Nanite Med-Foam** | T2 | 2 | ¥8,000 | Heals 2 Recovery values + clears one condition. |

**Note:** all store-bought consumables cap at (at most) 2× Recovery value, so store-bought supply never rivals a trained Medic's own compounds — the shelf exists so a non-Medic crew isn't entirely helpless, not to compete with the class.

**Chrome interaction — fully mundane, chrome-positive.** The Medic has **no magic to erode** — the entire chrome-erosion rule that constrains the Street Priest is simply irrelevant here. **Cyborgs are allowed** (unlike the Street Priest's Arcane-Severance bar), and any Medic of any species can augment freely, up to their Body Integrity limit, with zero mechanical penalty to Reagent capacity, compound access, or any class feature.

**The flesh-side installer.** The Medic is the **flesh-and-blood surgeon** who installs, repairs, and removes chrome as downtime projects — completing the game's crafter/installer trio alongside the Wrench (hardware) and the Technomancer (code). The Ripperdoc specialization leans hardest into this identity (see Under the Knife, above), but any Medic can attempt a chrome-installation downtime project; the Ripperdoc is simply the best at it.

**The three healers, distinguished.** GHOSTWIRE has three classes with genuine healing capability, and they do not overlap:

| Class | Heals | Method | Limitation |
|---|---|---|---|
| **Medic** | Living, organic flesh; cures poison/disease/toxins | Mundane chemistry and trauma medicine | No effect on machines, drones, or non-organic chrome components |
| **Street-Priest** | Flesh *and* soul | Divine power through the Veil, at the cost of the Price | Cannot heal without paying the pact's toll |
| **Technomancer** | Machines, drones, chrome, and Cyborgs specifically | Techno-magic | No effect on purely organic, non-augmented tissue |

This three-way split is intentional: a crew with a Medic, a Street Priest, *and* a Technomancer has genuinely complete coverage — flesh, soul, and machine — with no redundancy between any of the three.

---

## PART 2 — AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This half of the document is what the next Foundry-implementation agent — human or AI — needs to ship the Medic to the `ghostwire` module. Structure follows the Scout, Operator, Hacker, Elementalist, Wrench, and Street Priest masters. Because no Medic Foundry build exists yet, all schemas below are PLANNED and modeled on the live Operator/Hacker class items and the planned Elementalist/Wrench/Street Priest schemas — flagged in Known Bugs and to be revised the moment the Medic ships.*

### Module Scope (Standing Rule)

The Medic ships to the same **`ghostwire`** Foundry module that houses the Operator, Hacker, Scout, Elementalist, Wrench, and Street Priest. Module identifier for this class: **`ghostwire.class.medic`**. New/shared Compendium packs used:

- **`ghostwire-classes`** — The Medic class item, class-wide doctrine features, and the 3 subclass grant items (Street-Doc, Corp-Medtech, Ripperdoc).
- **`ghostwire-abilities`** — All Medic signature abilities, the heroic-ability tier ladder (1/3/5/7/9/11), Field Synthesis, Miracle Worker, and all subclass ability-table entries.
- **`ghostwire-kits`** — Any weapon Kit selected by a Combat-Medic build (shared with the general Kit catalog — the Medic introduces no new Kit type).
- **`ghostwire-items`** — The 5 Medical Consumables shelf items (1E canon), if not already covered by a shared gear-catalog pack.

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`.

### Data Provenance — How This Document Was Built

- **DS Troubadour SRD (mechanical spine):** Fetched from Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Troubadour/`) on 2026-07-29, extracted to `/home/user/workspace/medic_troubadour_reference.md`. Used for chassis stats (Stamina 18/+6, Recoveries 8, Potency Prime−2/−1/−0), the Class Act (subclass) cadence, and the level 1-10 progression skeleton. The Troubadour's entire Drama resource-generation loop (1d3/turn drip, Victories-at-start-of-encounter, dramatic-event triggers, and the self-revive-at-30-Drama mechanic) was explicitly **gutted and NOT ported** per Michael's ruling — replaced wholesale by the Reagents E8 baseline, with the self-revive mechanic surviving only as the Ripperdoc's L8 capstone (Q1=B).
- **Medic lore canon:** Extracted from `master_rules_baseline_2XP-1BP_2026-07-29.md` to `/home/user/workspace/medic_canon_reference.md` — the full Medic class chapter (identity, resource, compounds, signatures, heroic abilities, subclasses, chrome interaction), the E8 Reagents numeric baseline, and the 1E Medical Consumables shelf. This is the primary source for identity, the flex-lane framing, the subclass triad, the compound-family magnitudes (locked, not v1 estimates), and the shelf items.
- **Michael's 2026-07-29 rulings (Q1-Q4, verbatim, applied):** Q1=B (Ripperdoc-only self-revive capstone, 30 Reagents or 1 BI), Q2=B (Field Synthesis is free, once/encounter, half-strength), Q3=A (combat drug crash is automatic, no save), Q4=A (fill both 9-cost and 11-cost tiers with 4 abilities each, flag all for sign-off).
- **GHOSTWIRE templates (structural):** `Ghostwire_StreetPriest_Development_Master.md` (most recent, exact template match target), `Ghostwire_Wrench_Development_Master.md` (level-based rework template), `Ghostwire_Elementalist_Development_Master.md` (caster template), `Ghostwire_Operator_Development_Master.md` (feature/ability pairing template).
- **Standing GHOSTWIRE doctrine applied:** attribute display convention (Instinct (Intuition), Logic (Reason)); DS levels 1-10 as the advancement axis; nuyen (¥) is currency; one canonical file per class; Foundry-first, rulebook-second.

### Item Inventory (Planned, To Be Built)

*IDs allocated per the standing GHOSTWIRE ID convention (`GWMedic00001` for the class item; `GWMedicSig00001`+ for signatures; `GWMedicHer00001`+ for tier-cost heroics; `GWMedicSub00001`+ for subclass abilities and features). All IDs are placeholder-planned.*

**Class item** (`ghostwire-classes`):
- `GWMedic00001` — The Medic (class-type item; chassis stats, Reagents resource definition, level-based advancement, feature grants).

**Core doctrine features** (`ghostwire-classes`, type `feature`), ~13 total:
- Field Partner, Established Protocols, Field Synthesis (feature), Advanced Chem-Prep, Compound Mastery, Field Reputation, Emergency Priority, Colleague & Mentor, Cross-Trained, Battlefield Renown, Reputation, Master Chemist, Legend of the Street.

**Subclass grant items** (`ghostwire-classes`, type `feature`, 3 total):
- `GWMedicSub00001` — Street-Doc (1st-level grant: Make Do, Back-Alley Wits, Improvise!, streetwise/contacts skill)
- `GWMedicSub00002` — Corp-Medtech (1st-level grant: Pharmaceutical Grade, Licensed Protocol, Clean Delivery, corporate/pharma-science skill)
- `GWMedicSub00003` — Ripperdoc (1st-level grant: Under the Knife, Metal & Meat, Cutter's Reflex, cybertech/mechanics skill)

**Signature abilities** (`ghostwire-abilities`, type `ability`): 3 free class-wide signatures (First Aid, Administer Dose, Diagnose) = **3 total.**

**Heroic ability tier ladder** (`ghostwire-abilities`, type `ability`):
- 1-cost: 2 (Emergency Patch, Slap-Injector — GHOSTWIRE-original)
- 3-cost: 4 (Combat Stims, Toxic Cloud, Rapid Field Diagnosis, Blood Doping)
- 5-cost: 4 (Triage, Purge Toxins, Focus Serum, Anesthetize)
- 7-cost: 4 (Miracle Worker, Nerve Toxin, Chemical Interrogation, Field Adrenal)
- 9-cost: 4 (Chemical Warfare, Emergency Transfusion, Perfect Diagnosis, Battlefield Surgery — all GHOSTWIRE-original)
- 11-cost: 4 (Wonder Drug, Nerve Agent, Full Kit Purge, The Doctor Is In — all GHOSTWIRE-original)
- **Subtotal: 22 heroic abilities.**

**Field Synthesis** (`ghostwire-abilities`, type `ability`, 0-cost, standalone): **1 total** (tracked separately from the tier ladder above per Q2=B — it is a free feature-linked ability, not a purchased tier pick).

**Subclass ability-table entries** (`ghostwire-abilities`, type `ability`, 5 per subclass × 3 = **15 total**):
- Street-Doc: Trash-Bin Chemistry, Regular Customer, Back-Alley Miracle, Fast Hands, The Doc Who Never Left (5)
- Corp-Medtech: Datahaus Access, Pharma Supplier, Reduced Comedown, Batch Processing, Gold-Standard Protocol (5)
- Ripperdoc: Chrome Whisperer, Black-Market Parts, Surgical Precision, Overclock Protocol, The Whole Package (5)
- **Added 2026-09-16 (B26b lock):** a second 9th-level pick per specialization — Last Syringe (Street-Doc), Crash Protocol Override (Corp-Medtech), Emergency Excision (Ripperdoc) — for 18 total.

**Subclass feature entries** (`ghostwire-classes` or `-abilities`, type `feature`, per-subclass ladder at L1 (×3 features)/L3/L5/L8 beyond the L2/L6/L9 ability picks): Street-Doc 5 (Make Do, Back-Alley Wits, Improvise!, Scrounger's Eye, Back-Alley Network, Nothing Wasted — actually 6, see note below), Corp-Medtech 6 (Pharmaceutical Grade, Licensed Protocol, Clean Delivery, Standardized Dosing, Corporate Requisition, Premium Stock), Ripperdoc 6 (Under the Knife, Metal & Meat, Cutter's Reflex, Steady Hands, Chop-Shop Connections, Nano-Adrenal Auto-Injector) = **18 total.**

**Medical Consumables shelf items** (`ghostwire-items` or shared gear catalog, type `gear`/`consumable`, 1E canon): **5 total** (Trauma Patch through Slap-Doc Kit).

**Total planned item count: 1 class + 13 doctrine features + 3 subclass grants + 3 signatures + 22 heroic abilities + 1 Field Synthesis + 15 subclass abilities + 18 subclass features + 5 consumables = 81 items.**

### Class Item Schema (Planned)

```
_dsid: "medic"
level: 0
primary: "Reagents"                    // Heroic Resource display name
epic: "Master Chemist"                 // Level-10 epic resource / capstone display name
turnGain: "0"                          // NO per-turn drip — Reagents persist across encounters, not generated per-turn
minimum: "0"
persistAcrossEncounters: true          // NEW FIELD — flags this resource as non-resetting; unique to the Medic among current GHOSTWIRE classes
characteristics.core: ["intuition", "reason"]   // real DS keys; display as Instinct (Intuition) / Logic (Reason)
stamina: { starting: 18, level: 6 }
recoveries: 8
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], description, additional: {type, perkType, cost} } }
```

**`persistAcrossEncounters: true` is a new schema field, not used by any prior GHOSTWIRE class.** Every other class's Heroic Resource (Drama, Conviction, attunement, fielded-fleet income) resets or refills at encounter boundaries; the Medic's Reagents explicitly do not. Confirm whether Foundry's DS v1.1.1 system has any existing resource-persistence flag before inventing this field wholesale — if the base system assumes end-of-encounter resource reset universally, this may require either a custom Active Effect / flag-based workaround or a genuine system-level patch. **Flagged in Known Bugs, below.**

### Ability Item Schema (Planned)

```
type: "ability"
system: {
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "first-aid", "administer-dose", "miracle-worker"
  story: <flavor line>,
  keywords: [...],                     // e.g. ["medicine", "restorative"] for First Aid; ["medicine", "chemical"] for Administer Dose
  type: "main" | "maneuver" | "triggered" | "free",
  category: "signature" | "heroic" | "field-synthesis",   // NEW category value for Field Synthesis's unique free/once-per-encounter shape
  resource: <number>,                  // Reagent cost: 0 (signatures, Field Synthesis) or 1/3/5/7/9/11 (heroics)
  usesPerEncounter: <number|null>,     // NEW FIELD — Field Synthesis needs a once-per-encounter cap distinct from its Reagent cost being 0
  trigger: <string>,                   // populated on triggered-type (e.g. Cutter's Reflex, Improvise!, Clean Delivery)
  distance: { type: "melee"|"ranged"|"self"|"touch", primary, secondary, tertiary },
  target: { type: "creature"|"self"|"ally"|"ally-or-self"|"creatureObject"|"area", custom, value },
  power: {
    roll: { formula: "@chr", characteristics: ["intuition"], reactive: false },   // Instinct (Intuition) primary for nearly all rolled abilities
    effects: { <effectId>: { type: "damage"|"applied"|"other", ... } }
  },
  crashRider: { base: -1, enhanced: -2, autoApply: true },   // NEW FIELD — models the Q3=A automatic crash on Stimulant-family compounds
  prerequisites: { dsid: ["medic"], value: "", level: null },
  effects: { <effectId>: { type: "base", description: <html>, before: true|false, name, sort } }
}
```

**`usesPerEncounter` field note.** Field Synthesis is the first GHOSTWIRE ability that is simultaneously (a) zero-cost and (b) capped at once-per-encounter by a mechanism other than the resource pool itself. Confirm whether Foundry's DS v1.1.1 ability-item schema has an existing "limited uses" field (similar to spell-slot or per-encounter-charge patterns in other TTRPG systems) before inventing `usesPerEncounter` wholesale. **Flagged in Known Bugs, below.**

**`crashRider` field note.** Because the crash is automatic and universal across every Stimulant-family compound (Administer Dose's ally-target branch, Combat Stims, Focus Serum, Field Adrenal, Wonder Drug), it makes sense to model it as a **shared sub-schema object** attached to any ability tagged with the `stimulant` keyword, rather than hand-authoring the same delayed-debuff Active Effect on five-plus separate ability items. Recommend a shared "Combat Drug Crash" Active Effect template that every Stimulant-tagged ability applies automatically on buff-expiry, parameterized by `crashRider.base` / `crashRider.enhanced`.

### Feature Item Schema (Planned)

```
type: "feature"
system: {
  description: { value: <html rules text>, director: <html, optional GM-only guidance> },
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "field-partner", "established-protocols", "nano-adrenal-auto-injector"
  advancements: {},                    // empty on standalone-passive features
  prerequisites: { value: "", dsid: [] | ["medic"] | ["medic-ripperdoc"], level: null }
}
```

**Ripperdoc-only prerequisite note.** The Nano-Adrenal Auto-Injector feature must carry a subclass-specific prerequisite (`dsid: ["medic-ripperdoc"]` or equivalent), not just `["medic"]` — this is the one Medic feature that is genuinely subclass-locked rather than merely subclass-flavored, exactly like the Street Priest's Judgment (Templar-only). Confirm the DS v1.1.1 prerequisite schema supports subclass-level (not just class-level) gating before this ships; if it only supports class-level `dsid` matching, this will need to be enforced at the table/GM level instead, per the same pattern the Street Priest master used for Judgment.

### Folder Structure (Planned)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Medic class item (shared folder with Operator, Hacker, Elementalist, Street Priest class items) |
| `ghostwire-classes` | `GWMedicSubclassr1` | 3 subclass items (Street-Doc, Corp-Medtech, Ripperdoc) |
| `ghostwire-classes` | `GWMedicFeatures01` | ~13 core doctrine features + 18 subclass features |
| `ghostwire-abilities` | `GWMedicSignatures1` | 3 free class-wide signatures (First Aid, Administer Dose, Diagnose) |
| `ghostwire-abilities` | `GWMedicHeroics0001` | 22 heroic abilities across the 1/3/5/7/9/11 tier ladder |
| `ghostwire-abilities` | `GWMedicFieldSynth1` | 1 Field Synthesis ability (standalone, tracked separately per its unique free/once-per-encounter shape) |
| `ghostwire-abilities` | `GWMedicSubAbil0001` | 15 subclass ability-table entries (5 per subclass) |
| `ghostwire-kits` | (existing) | No new Kit type — Combat-Medic builds draw from the shared Kit catalog |
| `ghostwire-items` | `GWMedicConsum00001` | 5 Medical Consumables shelf items (1E canon) |

### Deploy Scripts (Planned Chronological Order)

1. **`Backup-Ghostwire-World-PreMedic.ps1`** — read-only, full compendium snapshot to disk before any writes. Standard pre-ship safety measure per Pre-Flight Doctrine.
2. **`Deploy-Ghostwire-Medic-Rebuild-v1.ps1`** — primary ship script. Creates all 81 planned items across `ghostwire-classes`, `ghostwire-abilities`, `ghostwire-kits`, and `ghostwire-items` in the folder structure above. Idempotent (checks for existing items by `_dsid` prefix `GWMedic` and either updates in place or aborts with warning).
3. **`Diagnose-Ghostwire-Medic-Advancements.js`** — read-only diagnostic to verify the class item's `system.advancements` object built cleanly, modeled on the equivalent Hacker/Operator/Street Priest diagnostic scripts. Should also specifically verify the `persistAcrossEncounters` flag (or its eventual real implementation) survives a save/reload cycle, since this is a genuinely new schema behavior.
4. **`Backup-Ghostwire-Medic-FullDump-v1.js`** — read-only dump script using the proven-working Clipboard API + chunked console fallback pattern (per Operator master §Data Provenance — do not use `copy()` or Blob-download methods, both failed on Michael's Windows setup). This dump becomes the ground truth for Part 2's live-schema update once it exists.
5. **`Deploy-Ghostwire-Medic-Patch-*.ps1`** (as needed) — targeted patches per bug discovery, following the Hacker patch pattern.

### Known Bugs / Sign-Off Needed

*Every invented content item in this document is listed here for Michael's explicit review, following the same numbered pattern the Wrench and Street Priest masters use. Nothing below should be treated as final canon until reviewed.*

1. **INVENTED CONTENT FLAG — the entire 1-Cost Tier is GHOSTWIRE-original.** Neither the DS Troubadour SRD nor the Medic's own canon chapter specifies a 1-cost band (canon's cheapest heroic ability, Field Synthesis, was originally listed at cost 1 but has been moved to a free once-per-encounter maneuver per Q2=B). **Emergency Patch** and **Slap-Injector** were written specifically to give the Medic a cost-1 floor matching the Hacker/Elementalist/Operator/Wrench/Street Priest templates' ladder shape. Flagged for Michael's sign-off before treating either as final.

2. **INVENTED CONTENT FLAG — two of the four 3-Cost Tier abilities.** **Rapid Field Diagnosis** and **Blood Doping** are GHOSTWIRE-original, invented to fill out the tier alongside canon's Combat Stims and Toxic Cloud. Flagged for Michael's sign-off.

3. **INVENTED CONTENT FLAG — three of the four 5-Cost Tier abilities.** **Purge Toxins**, **Focus Serum**, and **Anesthetize** are GHOSTWIRE-original, invented to fill out the tier alongside canon's Triage. Flagged for Michael's sign-off.

4. **INVENTED CONTENT FLAG — three of the four 7-Cost Tier abilities.** **Nerve Toxin**, **Chemical Interrogation**, and **Field Adrenal** are GHOSTWIRE-original, invented to fill out the tier alongside canon's Miracle Worker. Flagged for Michael's sign-off.

5. **INVENTED CONTENT FLAG — all FOUR 9-Cost Tier abilities.** **Chemical Warfare**, **Emergency Transfusion**, **Perfect Diagnosis**, and **Battlefield Surgery** are all GHOSTWIRE-original — canon left this entire tier blank, per Michael's Q4=A ruling to fill it with four abilities. Flagged for Michael's sign-off; recommend a playtest pass given the tier's entirely-invented status.

6. **INVENTED CONTENT FLAG — all FOUR 11-Cost Tier abilities.** **Wonder Drug**, **Nerve Agent**, **Full Kit Purge**, and **The Doctor Is In** are all GHOSTWIRE-original — canon left this entire tier blank, per the same Q4=A ruling. Flagged for Michael's sign-off; recommend a playtest pass given the tier's entirely-invented status, particularly Full Kit Purge's variable-scaling structure, which has no precedent elsewhere in the class.

7. **REVISION FLAG — Corp-Medtech's Pharmaceutical Grade feature reworded per Q3=A.** Canon's original line ("compounds more potent and cleaner — bigger heals, stronger stims with lighter crashes, more reliable toxins") implied crashes could be reduced in *magnitude*. Since Q3=A makes the crash universal and automatic with no magnitude exceptions, this document rewords Pharmaceutical Grade to: **+50% base magnitude OR +1 buff round OR +1 additional target** (picked per compound) with crash **duration** (not magnitude) reduced by 1 round. Confirm this reword matches Michael's intent — flagged explicitly per the task brief's Q3=A implication note.

8. **INVENTED CONTENT FLAG — Ripperdoc's L8 capstone, Nano-Adrenal Auto-Injector.** The DS Troubadour's self-revive-at-30-Drama mechanic is ported per Q1=B ruling as a Ripperdoc-only 8th-level capstone: 30 Reagents OR 1 permanent Body Integrity loss, once per session. This is the single most significant mechanical port in the document — flagged for explicit sign-off given its power level (a self-revive is a rare and potent effect in this game's design space) and its permanent-cost payment option (permanent BI loss has no precedent elsewhere in the Medic class).

9. **INVENTED CONTENT FLAG — Street-Doc's "Improvise!" triggered action.** No canon precedent; invented to give Street-Doc a 1st-level triggered action matching the Corp-Medtech/Ripperdoc triggered-action pattern established by the Troubadour Class Act cadence. Flagged for sign-off.

10. **INVENTED CONTENT FLAG — Corp-Medtech's "Clean Delivery" triggered action.** No canon precedent; invented for the same structural reason as #9. Flagged for sign-off.

11. **INVENTED CONTENT FLAG — Ripperdoc's "Cutter's Reflex" triggered action.** No canon precedent; invented for the same structural reason as #9. Flagged for sign-off.

12. **INVENTED CONTENT FLAG — all 15 subclass ability-table entries (Trash-Bin Chemistry through The Whole Package) are GHOSTWIRE-original.** The source Medic chapter describes subclass identity at the paragraph level ("best kit-economy," "more potent and cleaner," "premier chrome installer") but does not enumerate a discrete per-level ability list the way DS Troubadour's Class Act ability table does. All 15 entries across the three Ability Tables (5 per subclass, at levels 2/6/9) were authored fresh for this document to fill that structural gap. Flagged for Michael's sign-off — recommend a playtest pass to confirm the tier-2/6/9 power curve lands correctly relative to the Elementalist's, Wrench's, and Street Priest's equivalent subclass-ability ladders.

13. **INVENTED CONTENT FLAG — Field Partner (L1 feature), ported from Troubadour's "Scene Partner."** The bond-with-one-ally mechanic and its exact numeric benefits (+1 to saves, +1 to healing on that ally, +1 Reagent when they're healed) are GHOSTWIRE-original numeric choices layered onto the Troubadour's structural chassis. Flagged for sign-off.

14. **INVENTED CONTENT FLAG — Established Protocols (L1 feature), ported from Troubadour's "Routines."** The two named rote procedures (stabilize a dying ally at 0 Stamina; identify a substance/toxin at a glance) are GHOSTWIRE-original choices layered onto the Troubadour's structural "2 rote procedures" chassis slot. Flagged for sign-off.

15. **OPEN CONTENT ITEM — companion actor stat blocks for enemies affected by Toxin/Toxic Cloud/Nerve Toxin/Nerve Agent are not modeled here.** Exactly like the Elementalist's Summon Elemental (Elementalist Known Bugs #6) and the Street Priest's Invoke the Pact (Street Priest Known Bugs #7), the exact numeric magnitude of "light/medium/heavy-weapon-band damage" and the Weakened/Slowed condition stacking rules referenced throughout this document are deferred to the game's shared numeric pass. None of the damage numbers in this document should be treated as final until that pass runs. *(Update 2026-09-16: resolved for Medic toxins — see #20.)*

16. **VERIFICATION FLAG — Medical Consumables shelf items already exist in canon 1E; verify Foundry parity.** The 5-item shelf (Trauma Patch through Slap-Doc Kit) is drawn directly from `master_rules_baseline_2XP-1BP_2026-07-29.md`'s 1E chapter and should already be locked canon — but verify the Foundry items (if they exist in `ghostwire-items` already) match the ¥ cost and Availability values listed in this document exactly, since this document's table was transcribed from the lore extract rather than a live Foundry dump.

17. **DOCTRINE CONFIRMATION (not a bug) — Cyborgs ARE allowed to be Medics, unlike the Street Priest.** This is stated repeatedly throughout Part 1 as a deliberate design contrast with the Street Priest's Arcane Severance bar. No mechanical species-check gate is needed on the Medic class item (there is nothing to bar), but this doctrine point should be cross-referenced explicitly if/when a "which classes can Cyborgs take" summary table is ever built across the whole class roster.

18. **OPEN SCHEMA QUESTION — `persistAcrossEncounters` resource flag has no precedent in any shipped GHOSTWIRE class.** As noted in the Class Item Schema section above, every other class's Heroic Resource resets or refills at encounter boundaries; Reagents explicitly do not. Confirm whether Foundry's DS v1.1.1 system natively supports a non-resetting resource pool, or whether this requires a custom Active Effect / module-level workaround. This is a genuinely new implementation challenge, not just a new field name — flagged as the single highest-priority open technical question in this document.

19. **OPEN SCHEMA QUESTION — `usesPerEncounter` field for Field Synthesis has no precedent in any shipped GHOSTWIRE class.** Field Synthesis is the first ability that is simultaneously zero-cost and capped by a non-resource mechanism (once per encounter). Confirm whether an existing "limited uses" field pattern exists in the DS v1.1.1 ability schema before inventing this wholesale.

20. **RESOLVED 2026-09-16 — Medic toxin damage bands.** The light/medium/heavy weapon-band damage deferral is resolved for Medic Toxins: base 2 + Instinct and enhanced 4 + Instinct over 2 rounds, and Nerve Toxin / Nerve Agent 6 + Instinct over 3 rounds, are locked. Other classes may still defer weapon-band numbers.

21. **RESOLVED 2026-09-16 — Medic chapter locks synced.** Anesthetize is a 2d10 + Instinct Power Roll (no Physique save); Reagents still spend outside combat (Established Protocols free, Field Synthesis encounter-only); each specialization's 9th-level table offers two picks.

### Source File Index

| Purpose | Path |
|---|---|
| Medic lore canon (full class chapter, E8 Reagents baseline, 1E Medical Consumables shelf) | `/home/user/workspace/medic_canon_reference.md` |
| DS Troubadour chassis reference (full SRD reskin source + Q1-Q4 rulings applied) | `/home/user/workspace/medic_troubadour_reference.md` |
| Master rules baseline (original source of the lore reference extract) | Project file: `master_rules_baseline_2XP-1BP_2026-07-29.md` |
| Street Priest master (most recent, exact structural template match) | `/home/user/workspace/Ghostwire_StreetPriest_Development_Master.md` |
| Wrench master (level-based rework template) | `/home/user/workspace/Ghostwire_Wrench_Development_Master.md` |
| Elementalist master (closest-match caster template) | `/home/user/workspace/Ghostwire_Elementalist_Development_Master.md` |
| Operator master (feature/ability pairing template) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/0645e406-dde8-4307-bc7f-f33d6e2f29b9/Ghostwire_Operator_Development_Master.md` |
| GHOSTWIRE canonical build log | Project file: `GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Pre-Flight Doctrine (governing process rules) | Project file: `GHOSTWIRE_Preflight_Doctrine_v1.md` |
| DS Troubadour SRD (original source, for re-verification) | `https://steelcompendium.io/compendium/main/Rules/Classes/Troubadour/` |

---

*End of `Ghostwire_Medic_Development_Master.md` (v1, 2026-07-29). Next agent: surface the Known Bugs / Sign-Off Needed list to Michael before treating any invented ability, filler feature, or subclass-table entry as final canon; build the Foundry deploy script chain once Part 1 is ratified; resolve the `persistAcrossEncounters` and `usesPerEncounter` schema questions as the top implementation priority, since both are genuinely novel patterns not needed by any prior GHOSTWIRE class; author the companion actor/condition numeric pass for all Toxin-family abilities alongside the Elementalist's elemental actors and Street Priest's Veil entities in a shared numeric-calibration pass.*
