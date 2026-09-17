# GHOSTWIRE_STREET_PRIEST_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Street Priest class as of 2026-07-29 (v1 full design). All future Street Priest-class design, rules, and Foundry-implementation work — across every session — must reference and update THIS file, and only this file. Do not create new Street Priest-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and the Scout / Elementalist / Operator / Hacker / Wrench masters are treated for those classes.*

*Last updated: 2026-07-29 (v1). Ground truth for Part 1 is (a) the DS Conduit class SRD mechanical spine (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/`, retrieved 2026-07-29) reskinned into GHOSTWIRE, layered against (b) the full Street-Priest canon chapter and 6B foci table in `master_rules_baseline_2XP-1BP_2026-07-22.md` (extracted to `/home/user/workspace/street_priest_lore_reference.md`), and (c) the E4 Conviction numeric baseline in the same file. Attribute names follow the locked GHOSTWIRE convention: display label first, real DS attribute in parentheses — e.g. **Persona (Presence)**, **Instinct (Intuition)**.*

> **Attribute canon note:** GHOSTWIRE uses five characteristics. Display labels match Foundry with the Draw Steel attribute in parentheses: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. The old canon references to "Resolve" and "Presence" in Street-Priest lore remap as follows: invocation → **Persona (Presence)**; control & bind → **Instinct (Intuition)**, per Michael's 2026-07-29 ruling. There is no attribute called "Cognition," "Resolve," "Will," or "Reflexes" (plural) anywhere in current GHOSTWIRE canon. Any older document — including the master baseline's Street-Priest chapter, which uses "Presence (invocation) / Resolve (control & bind)" — is using a defunct label for the secondary attribute; wherever this document quotes that older text verbatim, the remap is noted inline.

**Older Street-Priest source docs** (the master baseline's full class chapter, the Pacts section, and the 6B foci table) supplied canonical structure for identity, resource shape (Conviction), subclass triad, and the Invoke the Pact concept. All of that content is preserved and reskinned below; where the source text used "Resolve" it has been corrected to **Instinct (Intuition)** per Michael's 2026-07-29 ruling on this class's secondary attribute.

## Design Rulings (LOCKED — Michael's approvals, 2026-07-15 through 2026-07-29)

1. **Primary attribute: Persona (Presence)** — invocation stat. Every Smite/Rebuke, Lay On Hands, and heroic-ability Power Roll rolls `2d10 + Persona`.
2. **Secondary attribute: Instinct (Intuition)** — used specifically for bind/control: the **Invoke the Pact** bind roll and the **Banish** verb (Exorcist specialty) key off Instinct, not the old "Resolve" label.
3. **Heroic Resource: Conviction** — a faith drip (steady per-turn income) plus an optional prayer gamble (opt-in spike), per the E4 numeric baseline.
4. **Three subclasses, by battlefield role:** **Shepherd** (healer/warder), **Templar** (smiter, Judgment-mark holder), **Exorcist** (anti-spirit/anti-corruption specialist).
5. **Pact Overlay:** at 1st level every priest chooses **Light** or **Dark**. This is a mechanical overlay layered on top of the subclass choice — **not a fourth subclass**. It changes damage-type flavor (Light = holy, Dark = corruption), corruption weight (Light = light, Dark = heavy), and which act triggers the creed-echo Conviction bonus.
6. **Cost ladder: 1 / 3 / 5 / 7 / 9 / 11.** Base tier (costs 1, 3, and 5) chosen at 1st level; the 7-cost tier (headlined by Invoke the Pact) unlocks at 3rd level; the 9-cost tier at 5th level; the 11-cost tier at 8th level. The DS Conduit SRD has no 1-cost abilities — this document invents **two** 1-cost utility abilities (Minor Rebuke, Whisper of Comfort) specifically to keep the ladder floor consistent with the Hacker/Elementalist/Operator/Wrench templates. **Flagged for Michael's sign-off in Part 2.**
7. **Invoke the Pact failed-bind consequence is asymmetric by pact:**
   - **Light pact:** the summoned entity vanishes without effect; the priest takes a **bane on their next power rolls (save ends)**.
   - **Dark pact:** the summoned entity **strikes the priest once, at the entity's tier's damage,** before departing.
8. **Cyborgs are barred from the Street Priest class (Arcane Severance).** No exceptions — this is called out explicitly in the identity block below.
9. **Chrome ceiling:** chrome erodes the pact by the shared magic-erosion formula (Conviction cap loss — see Kits & Chrome, below); Soft grade erodes least.
10. **Currency is nuyen (¥)** throughout — never "Wealth," never abstract credits.
11. **Attribute display convention:** GHOSTWIRE label first, DS attribute in parens — e.g. "Persona (Presence)," "Instinct (Intuition)." Five characteristics only: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. "Reflex" is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear.
12. **DS levels 1-10 are the primary progression axis.** Echelon (E1-E4) is referenced only as a cross-class tier concept (e.g. ritual tiers, or citing the E4 Conviction numeric baseline chapter by name) — it never gates a Street Priest feature ladder directly.

---

## PART 1 — PLAYER-FACING: THE STREET PRIEST

### Who You Are

You are a **Street Priest** — on the street just **padre**, **collar**, **saint**, or simply **the priest**. Corp paperwork, when it bothers to notice you at all, lists you as a *"pastoral-services contractor"* or a *"spiritual-welfare asset."* None of those labels come close to what you actually are: a **vessel for a power on the other side of the Veil**.

You are not a scholar of impersonal forces like the Elementalist, nor a cyber-augmented soldier like the Operator. You are a **believer with a pact** — an angel or a demon aligned to a cause has agreed to lend you its power, and you channel that aid into the prime world through sheer conviction. On the street you run the gamut: a genuine faith-healer working a barrio clinic, a warrior-priest of a militant order, an ex-corp chaplain who walked out on the payroll, a back-alley exorcist who charges in favors instead of nuyen, or a desperate soul who signed an infernal bargain for power they couldn't get any other way. What unites all of you is the **pact** and the **Price** it exacts — your patron always wants something back, and what it wants tells everyone at the table exactly who you are.

Mechanically, you are the crew's **divine switch-hitter**: genuinely competent at **both** keeping your crew alive (Recovery-fueled healing, wards, status removal) **and** punishing the enemy (holy or corruption smiting, forced movement, fear, banishment). Your **subclass** — Shepherd, Templar, or Exorcist — tilts that balance toward support, offense, or the counter-spirit specialty, but every Street Priest can do all three jobs in a pinch. This deliberately fills the support slot the Elementalist's blaster identity leaves open: a crew running both casters gets artillery *and* a lifeline.

**Cyborgs cannot be Street Priests.** This is not a soft discouragement — it is **Arcane Severance**, the same hard species-locked rule that bars a Cyborg from every Veil-casting class in GHOSTWIRE. A body that has been substantially replaced with machine parts cannot hold a pact; the connection across the Veil requires a soul with room left in it, and a Full-Conversion chassis has none. Any of the other Eight Peoples may be a Street Priest of any subclass and either pact.

**The chrome ceiling.** Even a Pure Human, Elvani, or Corran Street Priest who leans hard into Conviction pays for any chrome — every implant erodes the pact directly by the shared magic-erosion formula, and Soft grade erodes least: your patron's attention is a finite thing, and a soul cluttered with machine parts is a poor vessel for it (see Kits & Chrome Interaction, below, for the exact erosion rule).

---

### Class Chassis

*DS Conduit reskin explanation: the Street Priest's mechanical spine is the DS Conduit class — a Presence-primary divine-invoker built around a steady per-turn resource drip, a signature-ability baseline, and a domain (subclass) ladder. GHOSTWIRE strips the Conduit's single-deity flavor and replaces it wholesale with the **pact** — a living bargain with an angel or demon, chosen as Light or Dark at 1st level and never a fixed pantheon. Where DS Conduit prays to "the gods" in the abstract, the Street Priest prays to **a specific someone across the Veil** who is listening, keeping score, and due a payment.*

| Stat | Value |
|---|---|
| **Core Characteristics** | Persona (Presence) — primary; Instinct (Intuition) — secondary |
| **Heroic Resource** | Conviction |
| **Epic Resource / Capstone** | Manifest Will (10th level) |
| **Potency: Weak / Average / Strong** | Prime − 2 / Prime − 1 / Prime |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light-Kit — the **Sanctified Kit** (magic-damage rider reskins as holy or corruption power, per pact) |
| **Skills** | A religion/liturgy skill, a spirit/ritual skill, and an interpersonal skill are the class's three key skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. A fourth free pick follows your subclass: a medicine/first-aid skill (Shepherd), a weapon/combat skill (Templar), or an arcana/occult-lore skill (Exorcist). |

*Design note (chassis rationale, per DS Conduit's baseline stats + GHOSTWIRE's divine-switch-hitter identity): the Street Priest mirrors the Conduit's Stamina/Recoveries curve exactly (18 starting, +6/level, 8 Recoveries) — a "middle frame" that sits below the Operator's front-line durability but comfortably above the Elementalist's or Hacker's fragile-specialist bands, appropriate for a class expected to stand near the wounded and occasionally take a hit meant for someone else. Species mods (Corran heavy-frame bonus Stamina, etc.) stack on top of the class chassis in the standard way.*

**Advancement table shape:** DS levels 1–10, matching the Hacker/Elementalist/Operator/Wrench masters — see the **Level 1-10 Progression Table**, below, for the full level-by-level breakdown of features, abilities, and subclass grants.

---

### Conviction — Your Heroic Resource

**Conviction** is the measure of your faith made manifest — your standing with your patron, spent to call aid across the Veil. It runs a **steady per-turn drip**, like the Wrench's fielded-fleet income or the Elementalist's attunement trickle, with an optional **prayer gamble** layered on top for the faithful who reach for more. All values below are the **E4 numeric baseline** (locked, not a placeholder) — this is the one Street-Priest resource table that has already been calibrated against the other Veil casters and carries no "v1 estimate" flag.

**Earning Conviction:**

| Property | Value | Rationale |
|---|---|---|
| **Opening faith** (start of encounter) | +Victories | The believer arrives already in their patron's favor — the same on-ramp every GHOSTWIRE class gets. |
| **The drip** (start of each of your turns) | **+2** | Matches the Operator's cadence weight — Conviction is Draw Steel's steady-drip benchmark per chapter text. |
| **Creed echo** (first qualifying act per round, in your pact's creed) | **+1** | Small and steady, matches the Elementalist's resonance bonus. See Pact Alignment, below, for what qualifies per pact. |
| **Sustain cost** (per Persistent 1 / Persistent 2 you're maintaining) | **−2 / −4** | Matches the Elementalist's throttle for consistency across Veil casters — the same "cannot hold three wards and a summon at once" tension. |

**The Prayer Gamble (opt-in, replaces the drip for the turn).** Before rolling for the turn's Conviction, you may **pray** instead of taking the flat drip — opening yourself fully to your patron. Roll **1d6**:

| d6 Result | Effect |
|---|---|
| **1–2** | Flat drip only (**+2**, exactly as if you hadn't gambled). No gain, no loss — you reached for more and the patron simply held its answer. |
| **3–4** | **+4 Conviction.** |
| **5–6** | **+4 Conviction, AND** you immediately trigger a **free Smite/Rebuke or Lay On Hands at no Conviction cost.** |

**Ruling (per Michael, 2026-07-15, applied 2026-07-22):** the prayer gamble is **resource-only** — its worst result simply yields the ordinary flat drip and nothing more. It never inflicts backlash, Stamina damage, or corruption. The gamble risks only opportunity, never your body or soul: you reached for more, the patron stayed its hand, and you took what you would have taken anyway. This is the deliberate divine mirror of the Elementalist's Channel ramp — both classes have a "reach for more" lever, but the priest's is a **gamble** and the mage's is a **commitment**.

**Cap & loss.** Conviction is capped at **8 at 1st level, rising +4 per tier** (mirrors the Veil-caster spine exactly: E4=8, E3=12, E2=16, E1=20, continuing the same +4 step at the top of the DS-level range). **All unspent Conviction is lost at the end of the encounter** — the patron's active favor fades when the crisis passes.

**Outside combat.** You cannot *gain* Conviction outside combat, but you may spend Conviction-costed effects **as if you had Victories worth of Conviction** — this is how ministry, healing, warding, and pact-renewal happen during downtime scenes without breaking the encounter-scoped resource model.

**Firewall note:** Conviction is a class resource on the BP/class side. It never touches **nuyen (¥)** or **Body Integrity**, and chrome never generates it — see Kits & Chrome Interaction, below.

> **What is Conviction?** *(Inline definition, so the term is never more than a paragraph away from first use.)* Conviction is the Street Priest's Heroic Resource: a pool representing your patron's active favor and how much of it you can spend calling aid across the Veil right now. It rises on a steady drip every turn (or via the prayer gamble's spike), and on acting squarely within your pact's creed. It falls when you sustain persistent workings, and resets to zero at the end of every encounter. It is spent on heroic abilities (grouped by cost, below) and on Spend-X enhancement riders. Signature abilities never cost Conviction.

---

### Pact Alignment (Light or Dark)

At 1st level, every Street Priest chooses a **pact alignment: Light or Dark.** This choice cannot be changed later — it is a permanent build decision with a moral spine, not a stance you can swap turn to turn. **The Pact Alignment is a mechanical overlay layered on top of your subclass choice — it is not a fourth subclass.** A Shepherd, a Templar, and an Exorcist can each be Light or Dark; the overlay changes flavor and a handful of numbers, not your battlefield role.

Both pacts use **the same mechanical numbers** across every ability in this document. What differs:

| Property | Light Pact | Dark Pact |
|---|---|---|
| **Default damage type** | Holy | Corruption |
| **Corruption weight** | Light | Heavy |
| **Conduct requirement** | Strict — the patron demands mercy and protection tasks (The Price) | Looser in the moment, but the debt comes due — the patron demands darker service or offerings |
| **Creed echo trigger** (first qualifying act each round) | First act of **mercy, protection, or aid** | First act of **dominion, punishment, or harvest** |
| **Invoke the Pact — failed bind** | Entity vanishes without effect; you take a **bane on your next power rolls (save ends)** | Entity **strikes you once, at the entity's tier's damage,** before departing |

**Both pacts always exact the Price.** A pact is the game's clearest case of "nothing for nothing" (per canon): your patron requires a **minor quest, service, or observance aligned to its moral code**, handled before or after the aid is granted — mercy and protection for a Light patron, a darker service or offering for an infernal one. Refusing or shirking the task is a real story beat, Director-adjudicated: the patron withdraws aid, calls the debt, or turns hostile. A priest who tries to **coerce** aid rather than earn it pays the dark-path corruption cost regardless of alignment.

**Choosing Light** means you play a strict conduct code in exchange for the lighter corruption load — every Smite, every ward, every summon defaults to holy damage and holy flavor, and your patron is watching how you treat the vulnerable. **Choosing Dark** means your patron grants more, faster, cheaper in the moment — but every working loads corruption and debt that come due later, and the patron's tasks trend toward harder service. The choice *is* the build.

---

### Signature Abilities (No Conviction Cost)

Every Street Priest chooses **two** of the following at 1st level, per the DS Conduit's signature-slot convention — these are your baseline, always-available toolkit, enhanceable by spending Conviction but never costing any to use at their base effect. All roll **2d10 + Persona (Presence)** unless noted. Damage type below defaults per your pact (holy for Light, corruption for Dark) unless the signature is explicitly flavor-locked.

| Signature | Type | Target | Base Effect | Pact Flavor |
|---|---|---|---|---|
| **Blessed Light** | Ranged strike (dist 10) | 1 creature | Holy damage, and on Tier 1 you or an ally within range gains a **surge** | Light-flavored (always holy) |
| **Drain** | Melee strike (dist 1) | 1 creature | Corruption damage, and you or an ally **spends a Recovery** on Tier 1/2 | Dark-flavored (always corruption) |
| **Rebuke** *(was Holy Lash)* | Ranged strike (dist 10) | 1 creature | Holy or corruption damage + a **vertical pull** rider | Follows pact |
| **Lightfall** | Area burst 2 (dist 10) | Enemies in burst | Holy damage to enemies, and up to 2 allies in the burst may **teleport** to any open space within the burst | Light-flavored (always holy) |
| **Sacrificial Offer** | Ranged strike (dist 10) | 1 creature | Corruption damage + a **bane on the next attack made against an ally of your choice** | Dark-flavored (always corruption) |
| **Word of Rebuke** *(was Staggering Curse)* | Melee strike (dist 1) | 1 creature | Holy or corruption damage + a forced **slide** | Follows pact |
| **Warrior's Prayer** | Ranged strike (dist 10) | 1 creature | Holy damage + you or an ally gains **temporary Stamina** | Light-leaning (holy by default, may reskin Dark on request) |
| **Wither** | Ranged strike (dist 10) | 1 creature | Corruption damage, and on a potency-successful hit the target takes a **bane** on its next roll | Dark-flavored (always corruption) |

*Reskin note: the eight signatures above are the DS Conduit's full signature list, ported one-to-one — Blessed Light, Drain, Lightfall, Sacrificial Offer, Warrior's Prayer, and Wither are kept as-is (with pact-flavor notes); Holy Lash is renamed **Rebuke**; Staggering Curse is renamed **Word of Rebuke**. Per Conduit's own rule, a Street Priest chooses 2 of these 8 at 1st level as their personal signature loadout — the other 6 remain available as a future retraining/subclass-swap option, Director's call.*

Beyond the 2 chosen signatures above, **every Street Priest also has these two class-wide signatures for free, with no choice involved** — every priest, regardless of subclass or pact, has these from 1st level:

> **Lay On Hands / Word of Comfort** *(Class Feature Signature)*
> *Maneuver · Range 10 · Target: self or one ally*
> No Power Roll. The target may **spend a Recovery.**
> **Spend X Conviction:** target an additional ally, end one save-ends/end-of-turn effect on the target, let a prone target stand, or grant a small amount of temporary Stamina.
> *The class's basic support signature — the divine equivalent of the Elementalist's every-turn shaping, pointed squarely at keeping the crew alive. This is the switch-hitter's every-turn lifeline, and it scales with faith the moment you spend Conviction on top of it.*

> **Smite / Rebuke** *(Class Feature Signature — not to be confused with the chosen signature "Rebuke," above; Director's table should rename one at the table if both are taken to avoid confusion)*
> *Main Action · Range 10 · Target: 1 creature*
> **Power Roll:** 2d10 + Persona (Presence). Holy or corruption damage (by pact), scaling on Outcome Tier (Tier 1 = 17+ = best, per house convention).
> **Spend X Conviction:** increase damage and/or add a small rider (push, or a bane on the target's next roll).
> *The class's basic offensive signature — a bolt of the patron's power, proof the switch-hitter can trade blows even before spending a point of Conviction.*

> **Sense the Veil / Discern Spirits** *(Class Feature Signature)*
> *Maneuver · Self*
> No Power Roll (or a simple Instinct check at the Director's discretion for a contested read). Read an entity's rank/nature, sense the thinness of the Veil, detect corruption or possession, or identify a spirit's true name.
> *The Street Priest's version leans toward reading spirits, souls, and corruption specifically — free intel that sets up wards, banishments, and (for the Exorcist) Judgment.*

---

### Heroic Abilities — Cost Tiers 1 Through 11

Heroic Abilities are the Street Priest's Conviction-fueled workings — chosen by cost tier as you level, layered on top of the always-on Signature kit above. On our reversed Outcome Tiers (Tier 1 = 17+ = best, Tier 2 = 12-16, Tier 3 = ≤11 = worst). Costs mirror the Veil/Draw Steel caster ladder: **1 / 3 / 5 / 7 / 9 / 11.**

#### 1-Cost Tier (chosen at 1st level)

*The DS Conduit SRD has no 1-cost band — these two abilities are GHOSTWIRE-original inventions, written specifically to keep the ladder floor consistent with the Hacker/Elementalist/Operator/Wrench templates, all of which open at cost 1. **Flagged for Michael's sign-off — see Part 2, Known Bugs #1.***

> **Minor Rebuke** *(1 Conviction, GHOSTWIRE-original)*
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona (Presence).
>
> | Tier | Effect |
> |---|---|
> | Tier 3 (≤11) | No damage. |
> | Tier 2 (12-16) | 2 + Persona holy or corruption damage (by pact). |
> | Tier 1 (17+) | 4 + Persona holy or corruption damage (by pact). |
>
> *A small strike with no rider — the cheapest possible spend when every other Conviction point is earmarked for a heal or a ward, but you still want to put a dent in something. The class's floor-level offensive option.*

> **Whisper of Comfort** *(1 Conviction, GHOSTWIRE-original)*
> *Maneuver · Range 10 · Target: self or one ally*
> No Power Roll. Choose one: the target gains **temporary Stamina equal to 2 + Persona**, OR ends one **minor** ongoing effect on the target (Director's call on what counts as "minor" — a single stack of a stacking condition, a short-duration debuff, not a save-ends major condition).
> *The class's floor-level support option — a whispered word or a quick touch, cheap enough to use every single turn if the encounter calls for it.*

#### 3-Cost Tier (chosen at 1st level)

*Reskinned from the DS Conduit's 3-piety abilities.*

> **Call the Thunder Down**
> *Main Action · Ranged area, cube 3 (dist 10) · Target: enemies in the cube*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage (sonic-flavored per pact) to each enemy in the cube, and each is **pushed**; allies you choose within the cube are pushed the same distance in a direction of your choice (a controlled shockwave, not a punishment).

> **Sentinel Spirit** *(was Font of Wrath)*
> *Main Action · Summon, dist 10 · Target: 1 open space*
> Summon a **size-2 guardian spirit** for 1 turn — a flare of your patron's presence given brief shape. While it exists, enemies within 2 squares of it take **Instinct (Intuition)**-scaled holy or corruption damage at the start of their turn (by pact). *This is a taste of the summoner fantasy from level 1 — a preview of Invoke the Pact's full mechanic at the 7-cost tier, without the bind roll or the failed-bind risk.*

> **Judgment's Hammer**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage + the target is knocked **prone** on Tier 1 or Tier 2. *Templar-flavored — the smiter's opening blow, though any subclass may take it.*

> **Violence Will Not Aid Thee**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Lightning-flavored (or holy/corruption, Director's call per pact) damage, and the next time the target deals damage this encounter, it takes **retributive damage equal to the original hit's tier value** — the patron turns the enemy's own violence back on them.

#### 5-Cost Tier (chosen at 1st level)

*Reskinned from the DS Conduit's 5-piety abilities, plus the canon **My Life For Yours** and **Sanctuary Ward** (both drawn directly from the Street-Priest chapter, not invented for this pass).*

> **My Life For Yours** *(canon — the Censor/Conduit lifeline)*
> *Triggered Action · Range 10 · Target: self or one ally*
> **Trigger:** the target starts their turn, or takes damage.
> **Effect:** you **spend a Recovery**, and the target regains Stamina equal to **your Recovery value.**
> **Spend more Conviction:** also end a save-ends effect on the target, or let the target stand.
> *The class's signature reactive heal, ported directly from canon. The clearest "crew's lifeline" tool in the class — always available as a reaction, always costs you a piece of yourself to use.*

> **Sanctuary Ward** *(canon — the Veil chapter's Ward verb as a heroic working)*
> *Maneuver · Target: a warded zone (aura 3, dist 5) or a single ally*
> Raise a consecrated ward. Enemies making attacks against targets or squares inside the ward take a **bane**; the ward also pushes back against corruption/possession effects attempting to take hold inside it.
> **Persistent 1** — sustain to keep the ward up (−2 Conviction/turn while sustained).

> **Corruption's Curse**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Corruption damage + the target takes a **damage weakness** (save ends). Dark-flavored by default; Light priests may reskin as "Sin-Weight."

> **Curse of Terror**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy damage + the target is **frightened** (save ends).

> **Faith Is Our Armor**
> *Main Action · Ranged, dist 10 · Target: up to 4 allies*
> No Power Roll. Each target gains **temporary Stamina** (5/10/15 scaling by your tier — light/medium/heavy band).

> **Sermon of Grace**
> *Main Action · Area burst 4 · Target: allies in burst*
> No Power Roll. Each ally in the burst may **spend a Recovery** and ends one save-ends effect.

#### 7-Cost Tier (chosen at 3rd level) — includes Invoke the Pact

*This tier is headlined by **Invoke the Pact**, the class's defining high-Conviction working. Full mechanics are broken out in their own section immediately below this tier list — see "Invoke the Pact — Deep Dive." The remaining 7-cost options are reskinned from the DS Conduit's 7-piety abilities.*

> **Invoke the Pact** — *see the full Deep Dive section below.*

> **Fear of the Gods**
> *Main Action · Ranged area, cube 5 (dist 10) · Target: enemies in cube*
> **Power Roll:** 2d10 + Persona. Psychic-flavored (holy or corruption per pact) damage + **frightened** (save ends) to each enemy in the cube.

> **Saint's Raiment**
> *Main Action · Ranged, dist 10 · Target: 1 ally*
> No Power Roll. Target gains **20 temporary Stamina** and **3 surges.** *A single-target apex buff — the "make one ally nearly unkillable this fight" play.*

> **Soul Siphon** *(the Dark-flavored heal)*
> *Main Action · Ranged strike (dist 10) · Target: 1 creature (deal damage) + 1 ally (grant benefit)*
> **Power Roll:** 2d10 + Persona. Corruption damage to the target, and one ally of your choice may **spend Recoveries with no limit** this turn. *The class's clearest "your suffering, their salvation" beat — a Dark-pact tool a Light priest can still take, but which reads very differently depending on who's asking.*

> **Words of Wrath and Grace**
> *Main Action · Area burst 5 · Target: allies in burst*
> No Power Roll. Each ally in the burst may **spend a Recovery.**

#### 9-Cost Tier (chosen at 5th level)

*Reskinned from the DS Conduit's 9-piety abilities.*

> **Beacon of Grace**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage. While the target carries this effect, any ally who deals damage to it **grants a Recovery** to themselves or another ally — a rolling, damage-triggered heal engine for as long as the mark holds.

> **Penance**
> *Main Action · Ranged area, cube 4 (dist 10) · Target: enemies in cube*
> **Power Roll:** 2d10 + Persona. Corruption damage + the target is **prone and locked in place** (save ends).

> **Sanctuary**
> *Main Action · Range 10 · Target: 1 ally*
> No Power Roll. Remove the target from the map entirely — placed somewhere safe across the Veil — where they may **spend Recoveries with no limit.** They reappear in an open space of your choice at the start of your next turn.

> **Vessel of Retribution**
> *Maneuver · Range 10 · Target: 1 ally (mark them with the effect)*
> No Power Roll on cast. The next time the marked target becomes **winded**, all enemies within 5 squares of them take **15 holy or corruption damage** (by pact) — the patron's fury unleashed at the moment your ally falls.

#### 11-Cost Tier (chosen at 8th level)

*Reskinned from the DS Conduit's 11-piety abilities.*

> **Arise!**
> *Main Action · Range 10 · Target: 1 ally, even one at 0 Stamina*
> No Power Roll. Target **spends Recoveries with no limit**, ends all ongoing effects, and stands. For the rest of the encounter, they gain **3 surges** at the start of each of their turns. *The class's closest thing to a battlefield resurrection.*

> **Blessing of Steel**
> *Main Action · Self-centered aura 5 · Target: allies in aura*
> No Power Roll. Allies in the aura gain a **bane on incoming attacks** and **damage immunity 5** for the rest of the encounter.

> **Blessing of the Blade**
> *Main Action · Self-centered aura 5 · Target: allies in aura*
> No Power Roll. Allies in the aura gain **3 surges** at the start of each of their turns for the rest of the encounter.

> **Drag the Unworthy**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage + a **long forced slide.** Any ally adjacent to the target's final position gains a **Recovery.**

---

### Invoke the Pact — Deep Dive

*The class's defining high-Conviction play, and the headline entry of the 7-cost tier, unlocked at 3rd level. Full mechanics below; this section exists separately from the tier list above because Invoke the Pact carries the class's core summoner fantasy and deserves the same standalone treatment the Elementalist gives Summon Elemental and the Wrench gives Focus Fire.*

> **Invoke the Pact**
> *Main Action · Veil working (Pact + Summon/Bind) · Cost: 7 Conviction (Persistent 2 if the independent form results)*
> **Bind Check:** 2d10 + **Instinct (Intuition)** — *not* Persona. This is the one core Street-Priest roll that keys off your secondary attribute rather than your primary; per Michael's 2026-07-29 ruling, control-and-bind always runs on Instinct (Intuition) for this class, matching the class chassis's stated secondary.

**What happens on the Bind Check** — the Outcome Tier of your Instinct roll determines which of two forms your invoked aid takes:

| Bind Roll Outcome | Result |
|---|---|
| **Tier 3 (≤11)** | **Failed bind.** See "Failed-Bind Consequence," below — the consequence is asymmetric by pact. |
| **Tier 2 (12-16)** | **Extension form succeeds.** The summoned entity acts on **your turn**, functioning as an extension of your own action economy — a smiting hand of light, a warding aegis, a spectral guardian. Low bookkeeping: it has no independent Stamina track and no turn of its own. Its light-band attack or support effect scales with your banked Conviction (a richer bank produces a stronger extension, Director's table reference: light-band = 4+Persona T1 damage-equivalent, rising with tier per Veil §C3). |
| **Tier 1 (17+)** | **Independent form succeeds.** The summoned entity becomes its own figure on the map — it has its own Stamina/Integrity pool and its own activation on the shared initiative order, scaling as a **Tier 1-2 entity per Veil §C3.** This is the true divine-summoner fantasy: an angelic warrior or bound devil fighting beside you as a genuine second combatant for the rest of the encounter (or until it drops, or the bind breaks). |

**Failed-Bind Consequence (asymmetric per pact — locked ruling, Michael 2026-07-29):**

- **Light pact:** the summoned entity **vanishes without effect** — your patron simply declines to answer, or the summons slips back across the Veil before it can manifest. You take a **bane on your next power rolls (save ends)** — the disquiet of a prayer that went unanswered.
- **Dark pact:** the summoned entity **manifests just long enough to strike you once, at the entity's tier's damage,** before departing back across the Veil. Your patron's aid always costs something, even — especially — when it goes wrong. This is meaningfully harsher than the Light failure state, by design: it is the mechanical expression of "infernal patrons grant more, faster, cheaper in the moment, and load the debt when it goes sideways."

**Sustaining the independent form** costs **Persistent 2** (−4 Conviction/turn while sustained) — the same throttle every Veil-caster's summon uses, per the shared Veil spine. The extension form has no ongoing sustain cost beyond the initial 7-Conviction spend; it simply expires at the end of the encounter or when you choose to release it.

**Summon flavor by subclass:**

- **Templar:** the entity manifests as an **angelic or infernal warrior** — a combat aid, built to trade blows.
- **Shepherd:** the entity manifests as a **guardian or warding spirit** — a defensive/support aid that shields allies and anchors wards.
- **Exorcist:** the entity manifests as a **hunting or binding spirit** — an anti-spirit specialist built to track and hold spirit-type foes.

**The Price always applies here, hardest of anywhere in the class.** A willingly-bound Light entity exacts a task aligned to mercy or protection before or after the working; a Dark entity's cooperation loads corruption and spirit-attention on top of whatever the Bind Check already cost. Breaking the pact's terms after invoking is a serious, Director-adjudicated story beat — the patron withdraws, calls the debt, or turns the entity hostile.

---

### Judgment (Templar-Exclusive Mark Mechanic)

**Only Templars have Judgment.** Per Michael's 2026-07-15 ruling (restated 2026-07-29): the mark-an-enemy mechanic is subclass-only, not a class-wide tool. A Shepherd or Exorcist cannot take Judgment through any means short of a future multiclass/feat exception, should one ever be authored.

**Judgment** works as follows: as your 1st-level Templar subclass feature (see Templar, below), you may mark one enemy within range as **under Judgment**. While the mark holds:

- The marked target takes a **bane** when it acts within your line of effect, or takes a small amount of bonus holy/corruption damage when you or an ally damages it (Director's table reference — exact magnitude in the numeric pass, structure locked now).
- The **first time each round** you damage the marked target, or the marked target damages you, you **bank bonus Conviction** — tying the mark directly into the resource engine, the same way the pact's creed echo does.
- Only one target may be under Judgment at a time; marking a new target ends the mark on the previous one.

Judgment scales at Templar 4th level (**Righteous Momentum** — the mark banks +1 more Conviction on damage) and again at Templar 7th level (**Blade of the Chosen** — see the Templar subclass table, below, for the full ladder).

---

### Street Priest Subclasses

At 1st level, every Street Priest chooses one of three **ministries**, defined by battlefield role (Michael's ruling) — Shepherd, Templar, or Exorcist. Your ministry tilts the switch-hitter's lean, tints your signatures and heroic abilities, and grants a subclass identity feature plus a signature pact-summon flavor. All three subclasses share the Persona/Instinct chassis and the Conviction engine; each grants a distinct feature ladder across levels 1, 2, 4, 5, 7, and 8, plus subclass ability picks at levels 1, 2, 6, and 9 (mirroring the DS Conduit's domain-ability cadence).

*Corp records list each ministry differently; the street calls all three "the priest."*

---

#### Shepherd — *"Pastoral-Care Specialist"*

The crew's lifeline. Bonus to **healing and warding** — stronger Recovery-granting, more temporary Stamina, better status removal and surges. The most support-tilted ministry, and the party's missing medic when nobody else can fill that slot. Summon flavor: a **guardian/warding spirit** that sticks close to allies.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Warden's Grace** | Whenever you use Lay On Hands / Word of Comfort, the target's Recovery restores **bonus Stamina** on top of the normal value (Director's table reference — magnitude in the numeric pass). |
| **1** | Subclass ability (choose 1) | See Shepherd Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Shepherd ability. |
| **4** | **Ward Anchor** *(GHOSTWIRE-original — flagged, see Part 2 Known Bugs #2)* | Sanctuary Ward, and every persistent ally-buffing zone you sustain, costs **1 less Conviction/turn to sustain** (minimum 1). |
| **5** | Subclass power bump | Your healing and warding heroic abilities (My Life For Yours, Sanctuary Ward, Faith Is Our Armor, Sermon of Grace) increase in magnitude by one band (Director's table, numeric pass). |
| **6** | Subclass ability slot | Choose a 6th-tier Shepherd ability. |
| **7** | **Guardian's Voice** | Sermon of Grace (or any Sermon-of-Grace-style buff) either costs **1 less Conviction** or gains **+2 range/area**, your choice each time you cast it. |
| **8** | Subclass power bump *(GHOSTWIRE-original — flagged, see Part 2 Known Bugs #2)* | Warden's Grace's bonus Stamina increases again; Ward Anchor's discount extends to Invoke the Pact's Persistent-2 sustain cost as well. |
| **9** | Subclass ability slot | Choose a 9th-tier Shepherd ability (apex). |

**Shepherd Ability Table** *(domain-style picks, per DS Conduit's ability cadence — reskinned/original as noted)*

| Tier | Ability | Effect |
|---|---|---|
| 1 | **Steady Hand** | Lay On Hands can target 2 allies instead of 1 for +1 Conviction. |
| 1 | **Ward-Sense** | Sense the Veil / Discern Spirits also detects the nearest hostile ward or trap within Reach. |
| 2 | **Circle of Mercy** | Sanctuary Ward's bane also applies to enemies attacking from outside the ward into it, not just inside. |
| 2 | **Recovering Grace** | My Life For Yours no longer requires the target to have taken damage this round — usable proactively at the start of their turn. |
| 6 | **Unbroken Watch** | Faith Is Our Armor's temporary Stamina lasts until the end of the encounter instead of until next hit. |
| 6 | **Aegis Bound** | Your guardian/warding spirit (Invoke the Pact, extension form) grants a bane on attacks against adjacent allies while it exists. |
| 9 | **The Shepherd's Hour** | Once per encounter, as a free action when an ally would drop to 0 Stamina, grant them a full Recovery instead — no action cost, no Conviction cost. |

---

#### Templar — *"Militant-Order Asset"*

The holy warrior. Bonus to **smiting damage and frontline durability** — higher effective Stamina than the other two ministries, better melee and forced-movement play, and **the only ministry with the Judgment mark** (see Judgment, above). The party's second front-liner. Summon flavor: an **angelic/infernal warrior**, a true combatant.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Judgment** | Mark one enemy as under Judgment (see the Judgment section, above, for the full mechanic). |
| **1** | Subclass ability (choose 1) | See Templar Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Templar ability. |
| **4** | **Righteous Momentum** | Judgment's damage-triggered Conviction bank increases by **+1** (stacking with the base Judgment bonus). |
| **5** | Subclass power bump | Your smiting heroic abilities (Judgment's Hammer, Curse of Terror, Corruption's Curse, Vessel of Retribution) increase in magnitude by one band (Director's table, numeric pass). |
| **6** | Subclass ability slot | Choose a 6th-tier Templar ability. |
| **7** | **Blade of the Chosen** | The Consecrated/Damned Weapon class feature (normally granted at 9th level, see Core Class Features) triggers **two levels early**, at 7th instead of 9th. |
| **8** | Subclass power bump *(GHOSTWIRE-original — flagged, see Part 2 Known Bugs #2)* | Judgment can be applied to a second target simultaneously (splitting its Conviction-bank benefit between the two marks). |
| **9** | Subclass ability slot | Choose a 9th-tier Templar ability (apex). |

**Templar Ability Table** *(domain-style picks, per DS Conduit's ability cadence — reskinned/original as noted)*

| Tier | Ability | Effect |
|---|---|---|
| 1 | **Zealous Strike** | Smite/Rebuke deals +1 damage per Outcome Tier when the target is under Judgment. |
| 1 | **Iron Faith** | +1 to Stamina per level while you have at least 1 Conviction banked. |
| 2 | **Wrathful Momentum** | Judgment's Hammer knocks the target prone on any Outcome Tier (not just Tier 1/2). |
| 2 | **Anathema's Weight** | The marked-by-Judgment target takes a bane on saves against your ongoing effects. |
| 6 | **Vengeance Unbound** | When the Judgment-marked target damages you, your next Smite/Rebuke against it gains an edge. |
| 6 | **Consecrated Ground** *(GHOSTWIRE-original)* | Sanctuary Ward, when cast by a Templar, also grants allies inside a +1 bonus to melee damage. |
| 9 | **Wrath of the Chosen** | Once per encounter, when you drop the Judgment-marked target to 0 Stamina, immediately gain full Conviction (as if from a fresh encounter start) and mark a new target as under Judgment for free. |

---

#### Exorcist — *"Containment / Counter-Thaumic Specialist"*

The Veil specialist. Bonus to **banishment, warding against incursion, and sensing/dispelling corruption and possession**, with edges fighting **spirits, the corrupted, and dark entities** specifically. The counter-caster and the crew's answer to hostile incursions across the Veil. Summon flavor: a **hunting/binding spirit** that tracks and holds spirit-type foes.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Discerning Eye** | Sense the Veil / Discern Spirits is enhanced: on Tier 1, you also learn a hostile spirit's **true name** (setting up an edge on a later Banish), and your reads always distinguish willingly-bound from coerced/hostile entities. |
| **1** | Subclass ability (choose 1) | See Exorcist Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Exorcist ability. |
| **4** | **Bound to Silence** | Your Banish verb (and any heroic ability that banishes or dispels) may add a **save-ends** rider to a hostile spirit-type or corrupted target — silenced, restrained, or unable to manifest, Director's choice matching fiction. |
| **5** | Subclass power bump | Your anti-spirit heroic abilities gain an **edge** when targeting spirit-type, undead, or corrupted creatures specifically (Director's table, numeric pass). |
| **6** | Subclass ability slot | Choose a 6th-tier Exorcist ability. |
| **7** | **Chain of Names** | Invoke the Pact's Bind Check costs **2 less Conviction (minimum 5)** when the target of the working is a hostile spirit you are attempting to bind/banish rather than summon as an ally. |
| **8** | Subclass power bump *(GHOSTWIRE-original — flagged, see Part 2 Known Bugs #2)* | Bound to Silence's save-ends rider can now also suppress a hostile working (a curse, a possession, an active summon) for its duration, not just silence the entity itself. |
| **9** | Subclass ability slot | Choose a 9th-tier Exorcist ability (apex). |

**Exorcist Ability Table** *(domain-style picks, per DS Conduit's ability cadence — reskinned/original as noted)*

| Tier | Ability | Effect |
|---|---|---|
| 1 | **Ward Against Incursion** | Sanctuary Ward gains a bonus effect: hostile spirits attempting to manifest or cross into the ward take corruption damage equal to your Persona. |
| 1 | **Marked for Banishment** | Once per round, when you hit a spirit-type or corrupted creature with Smite/Rebuke, mark it — your next hit against the mark gains an edge. |
| 2 | **Purging Rite** | Corruption's Curse, when cast on a corrupted or possessed creature, also removes 1 stack of corruption/possession from them (an anti-corruption cleanse rather than a curse, Director's fiction call). |
| 2 | **Hunter's Bind** | Your hunting/binding spirit (Invoke the Pact, extension form) gains an edge on any roll made specifically to track or restrain a spirit-type target. |
| 6 | **Severing Word** | Fear of the Gods, cast against a spirit-type or corrupted target, also ends one of that target's ongoing summon/bind effects. |
| 6 | **Unbroken Circle** | Sanctuary Ward's Persistent-1 sustain cost drops to 0 for the first round each encounter that you sustain it against an active spirit incursion. |
| 9 | **The Last Rite** | Once per encounter, spend any amount of Conviction (minimum 5) to attempt an immediate Banish against any spirit-type or corrupted creature within range, regardless of its tier, as a free action. |

---

### Level 1-10 Progression Table

| Level | Class Features | Abilities Known | Subclass |
|---|---|---|---|
| **1** | Pact Alignment (Light/Dark) · Subclass choice · Conviction (heroic resource) · Lay On Hands / Word of Comfort · Smite / Rebuke · Sense the Veil / Discern Spirits · Prayer Gamble · Priest's Ward · Choose 2 Signatures | 2 signatures, 1-cost tier, 3-cost tier, 5-cost tier | L1 subclass feature + L1 subclass ability |
| **2** | The Roster of the Saved / The Ledger of the Damned (rename by pact) · Perk | (same) | L2 subclass feature + subclass ability slot |
| **3** | Minor Miracle · Choose a 7-Cost ability (Invoke the Pact unlocked) | +7-cost tier | (same) |
| **4** | Deepened Subclass · Characteristic Increase · Perk · Skill | (same) | L4 subclass feature |
| **5** | Choose a 9-Cost ability | +9-cost tier | L5 subclass power bump |
| **6** | Burgeoning Saint / Rising Adept (rename by pact) · Perk | (same) | L6 subclass feature + subclass ability slot |
| **7** | Characteristic Increase · Pact's Favor · Skill | (same) | L7 subclass feature |
| **8** | Perk · Choose an 11-Cost ability | +11-cost tier | L8 subclass power bump |
| **9** | Consecrated Weapon / Damned Weapon · Ordained / Sworn | (same) | L9 subclass feature + subclass ability slot |
| **10** | Avatar of the Pact (epic capstone) · Characteristic Increase · Manifest Will · Most Faithful · Perk · Skill | (same) | (same) |

*Design note: this table mirrors the Hacker/Elementalist/Operator/Wrench progression table's density and shape exactly, per the 2026-07-29 level-based rework doctrine. DS Conduit's own chassis features (two signature choices at 1st, 3-cost at 1st, 5-cost at 1st, 7-cost at 3rd, 9-cost at 5th, 11-cost at 8th, domain ability at 2nd/6th/9th, characteristic increase at 4th/7th/10th, skill increase at 4th/7th/10th, perk at 2nd/4th/6th/8th/10th) are preserved one-to-one in the level placements above.*

---

### Core Class Features (Non-Subclass)

- **Pact Alignment** (1st) — Choose Light or Dark at character creation. Permanent; cannot be changed later. See Pact Alignment, above, for the full mechanical split.
- **Conviction** (1st) — Your Heroic Resource. See Conviction, above, for the full earn/spend/cap rules (E4 numeric baseline).
- **Lay On Hands / Word of Comfort** (1st) — Free class-feature signature. Maneuver; self or one ally spends a Recovery; Spend-X Conviction riders extend the effect. See Signature Abilities, above.
- **Smite / Rebuke** (1st) — Free class-feature signature. Main action Persona Power Roll; holy or corruption damage by pact. See Signature Abilities, above.
- **Sense the Veil / Discern Spirits** (1st) — Free class-feature signature. Maneuver; reads spirit rank/nature and detects corruption. See Signature Abilities, above.
- **Prayer Gamble** (1st) — The d6 mechanic layered on top of the Conviction drip. See Conviction, above.
- **Priest's Ward** (1st) — Passive. A small, always-on persistent temporary-Stamina hedge on yourself: at the start of each of your turns, if you have no other persistent working active, you gain a trivial amount of temporary Stamina (Director's table, numeric pass — a "you always have a little cushion" feature, not a big number). This is your baseline safety net, distinct from Sanctuary Ward, which is a spendable heroic ability.
- **The Roster of the Saved / The Ledger of the Damned** (2nd, renamed by pact — Light priests use "Roster," Dark priests use "Ledger") — Passive situational-awareness power. Once per encounter, as a free action, you may ask the Director one factual question about a creature's alignment relative to your pact's morality (is this person innocent? complicit? marked by the patron already?) — a narrative intel tool that also sets up Judgment (Templar) and Discerning Eye (Exorcist) picks.
- **Minor Miracle** (3rd) — Once per encounter, spend a Recovery to bend a single outcome: reroll one Power Roll (yours or an ally's within range), or downgrade one Outcome Tier result by one step (Tier 3 becomes Tier 2, Tier 2 becomes Tier 1) on a roll that just happened.
- **Deepened Subclass** (4th) — Passive mechanical bump to your subclass's existing features — the exact numeric increase is defined per-subclass in each ministry's own table, above (Ward Anchor, Righteous Momentum, Bound to Silence all key off this level).
- **Burgeoning Saint / Rising Adept** (6th, renamed by pact) — Passive. Your Conviction cap increases by an additional +2 on top of the normal tier progression, and the Prayer Gamble's "5-6" result additionally grants you 1 surge.
- **Pact's Favor** (7th) — Once per session (not per encounter), your patron intervenes directly for a small favor outside of combat — a piece of information, a door that's unlocked when you arrive, a witness who suddenly remembers something useful. Director-adjudicated, narrative in scope, never a combat-turn effect.
- **Consecrated Weapon / Damned Weapon** (9th, renamed by pact) — Passive. Your weapon attacks (via Kit or otherwise) carry a permanent bonus-damage rider of holy (Light) or corruption (Dark) damage, equal to your Persona bonus. *Templars gain this two levels early (7th) via Blade of the Chosen — see the Templar subclass table.*
- **Ordained / Sworn** (9th, renamed by pact) — A permanent title with narrative weight (Ordained for Light, Sworn for Dark) and one mechanical perk of your choice from the standard Perk list, gained specifically for reaching this milestone in your patron's eyes.
- **Avatar of the Pact** (10th, epic capstone) — Once per encounter, briefly manifest your patron's presence directly through you: for one round, all your holy/corruption damage rolls gain an edge, and your Persona-based Power Rolls cannot roll below Outcome Tier 2 regardless of the actual roll.
- **Manifest Will** (10th) — Spend 5 Conviction to automatically succeed on one Power Roll (treat as a guaranteed Tier 1), once per encounter.
- **Most Faithful** (10th) — Capstone perk. Your Conviction cap increases by a final +4 on top of all prior increases, and when you roll a **1 or 2** on the Prayer Gamble you **automatically reroll it once**, at no cost. (The floor result is not removed — you get one free second roll, and the second roll stands. Resolved in Pass C against the shipped pack, `lang/en.json` → `GHOSTWIRE.Classes.StreetPriest.Items.MostFaithful.Description`.)

---

### Kits & Chrome Interaction

**Sanctified Kit.** The Street Priest is a **light-Kit class**, and its natural attachment is the **Sanctified Kit** — the Kits chapter's magic-flavored light-Kit option. Its "magic" damage rider is reskinned wholesale as **your patron's holy or corruption power** (a blessed weapon, a consecrated focus, a censer swung like a mace). A Templar build often takes the Sanctified Kit (or a martial Kit) to hold the line at melee; a Shepherd or Exorcist may take a light Kit or none at all and work entirely through invocation at range. **Ownership rule still holds:** a Kit is inert without its qualifying nuyen-bought weapon/focus (a blessed blade, a censer, a reliquary-focus).

**Foci over chrome.** Like the Elementalist, the Street Priest's gear footprint is **foci** — reliquaries, blessed symbols, consecrated censers, warding seals — bought with **nuyen (¥)** and improved through the Economy's modification subsystem, *not* chrome. The canonical **6B — Street-Priest foci** table (Conviction/Persona), drawn directly from the master baseline:

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| **Prayer-bead / Rosarium / devotional focus string** | T5 | 5 | ¥200 | An edge on the prayer gamble (the pre-roll faith die); the acolyte's first focus, worn openly. | 1 · Veil, Faith |
| **Creed-brand / Fidei Sigil / conviction-anchor seal** | T5 | 5 | ¥300 | Steadies the Conviction drip against a bad prayer result. (The gamble never causes backlash in the first place — this focus softens the *opportunity* cost of a 1–2, not a penalty.) | 1 · Veil, Faith |
| **Censer / Thuribulum / sanctified aerosol focus** | T4 | 4 | ¥750 | An edge on warding/blessing workings and helps sustain a warded zone (the Shepherd's ground). | 2 · Veil, Ward |
| **Judgment-mark / Iudex Brand / anathema focus-iron** | T4 | 4 | ¥1,000 | An edge on the Templar's Judgment mark and its Conviction feedback; **Templar-flavored.** | 2 · Veil, Judgment |
| **Reliquary / Sanctum Vessel / consecrated relic-housing** | T3 | 3 | ¥3,000 | An edge on healing/support invocations (the Shepherd) *or* anti-spirit rites (the Exorcist); houses a splinter of the pact's power. | 3 · Veil, Faith |
| **Pact-seal / Foedus Sigil / covenant-manifestation seal** | T2 | 2 | ¥10,000 | An edge on Invoke the Pact and helps sustain the manifested aid at lower ongoing Conviction. | 4 · Veil, Summon |
| **Exorcist's chain / Malleus Vinculum / abjuration binding-focus** | T2 | 2 | ¥11,000 | An edge on banishing and anti-corruption rites; the **Exorcist's signature tool** against hostile spirits. | 4 · Veil, Ward |
| **Saint's relic / Numen Cor / apex covenant reliquary** | T1 | 1 | ¥22,000 | The Street Priest's masterwork: a broad edge across invocation, warding, and the pact, and the readiest signature-focus bond candidate (BP/SP deepens it). The Price still applies. | 5 · Veil, Signature-capable |

**Chrome erosion rule (locked 2026-09-17).** Chrome reduces your **Conviction cap** by the shared magic-erosion formula — −1 per **2** Integrity spent on Standard chrome (round down), per **3** on Soft, per **1** on Salvage (`docs/rulebook/12-chrome.md`). It represents the pact itself growing thinner as your body fills with machine parts. A Street Priest who chromes up heavily can erode their Conviction cap to nothing, at which point the class stops functioning as a caster (Director's call on whether the pact is broken). Cyborgs cannot invoke pacts.

**Cyborgs cannot invoke pacts — restated.** This is the hard species lock from the identity block, restated here for completeness: a Cyborg cannot take the Street Priest class at all, under any circumstances, per Arcane Severance. This is not the same rule as the chrome-erosion sliding scale above (which applies to non-Cyborg species who install cyberware) — it is an absolute bar at character creation.

---

## PART 2 — AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This half of the document is what the next Foundry-implementation agent — human or AI — needs to ship the Street Priest to the `ghostwire` module. Structure follows the Scout, Operator, Hacker, Elementalist, and Wrench masters. Because no Street Priest Foundry build exists yet, all schemas below are PLANNED and modeled on the live Operator/Hacker class items and the planned Elementalist/Wrench schemas — flagged in Known Bugs and to be revised the moment the Street Priest ships.*

### Module Scope (Standing Rule)

The Street Priest ships to the same **`ghostwire`** Foundry module that houses the Operator, Hacker, Scout, Elementalist, and Wrench. Module identifier for this class: **`ghostwire.class.street-priest`**. New/shared Compendium packs used:

- **`ghostwire-classes`** — The Street Priest class item, class-wide doctrine features, and the 3 subclass grant items (Shepherd, Templar, Exorcist).
- **`ghostwire-abilities`** — All Street Priest signature abilities, heroic-ability tier ladder (1/3/5/7/9/11), Invoke the Pact, and all subclass ability-table entries.
- **`ghostwire-kits`** — The Sanctified Kit item (shared with any other light-Kit magic class, e.g. the Elementalist's Hexshot/Spellblade family).
- **`ghostwire-items`** — The 8 Street-Priest foci items (Category 6B gear), if not already covered by a shared gear-catalog pack.

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`.

### Data Provenance — How This Document Was Built

- **DS Conduit SRD (mechanical spine):** Fetched from Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/`) on 2026-07-29, extracted to `/home/user/workspace/street_priest_conduit_reference.md`. Used for chassis stats (Stamina 18/+6, Recoveries 8, Potency Prime−2/−1/−0), the piety→Conviction resource shape, all signature and heroic-ability content across every cost tier, and the level 1-10 progression skeleton.
- **Street-Priest lore canon:** Extracted from `master_rules_baseline_2XP-1BP_2026-07-22.md` to `/home/user/workspace/street_priest_lore_reference.md` — the Pacts chapter (line 1458), the 6B foci table (line 2362), the full Street-Priest class chapter (line 3617), and the E4 Conviction numeric baseline (line 5023). This is the primary source for identity, the switch-hitter framing, the subclass triad, the Conviction drip/gamble numbers (locked, not v1 estimates), and the 8-item foci table.
- **Michael's 2026-07-29 rulings (verbatim, applied):** primary/secondary attribute split (Persona/Instinct), the Pact Overlay-not-subclass structure, the 1/3/5/7/9/11 cost ladder with two invented 1-cost abilities, the asymmetric Invoke the Pact failed-bind consequence, the Cyborg bar, and the chrome ceiling.
- **GHOSTWIRE templates (structural):** `Ghostwire_Wrench_Development_Master.md` (most recent, level-based rework template), `Ghostwire_Elementalist_Development_Master.md` (closest-match caster template), `Ghostwire_Operator_Development_Master.md`, `Ghostwire_Hacker_Development_Master.md` (schema-pattern template).
- **Standing GHOSTWIRE doctrine applied:** corrected attribute display convention (Persona (Presence), Instinct (Intuition) — NOT the source chapter's defunct "Presence/Resolve" label); DS levels 1-10 as the advancement axis; nuyen (¥) is currency; one canonical file per class; Foundry-first, rulebook-second.

### Item Inventory (Planned, To Be Built)

*IDs allocated per the standing GHOSTWIRE ID convention (`GWPriest00001` for the class item; `GWPriestSig00001`+ for signatures; `GWPriestHer00001`+ for tier-cost heroics; `GWPriestSub00001`+ for subclass abilities and features). All IDs are placeholder-planned.*

**Class item** (`ghostwire-classes`):
- `GWPriest00001` — The Street Priest (class-type item; chassis stats, Conviction resource definition, level-based advancement, feature grants).

**Core doctrine features** (`ghostwire-classes`, type `feature`), ~17 total:
- Pact Alignment, Conviction resource bundle, Prayer Gamble, Priest's Ward, The Roster/Ledger, Minor Miracle, Deepened Subclass, Burgeoning Saint/Rising Adept, Pact's Favor, Consecrated/Damned Weapon, Ordained/Sworn, Avatar of the Pact, Manifest Will, Most Faithful, plus 3 free class-wide signatures (Lay On Hands, Smite/Rebuke, Sense the Veil) modeled as paired feature+ability per the Hacker pattern.

**Subclass grant items** (`ghostwire-classes`, type `feature`, 3 total):
- `GWPriestSub00001` — Shepherd (1st-level grant: Warden's Grace, medicine/first-aid skill)
- `GWPriestSub00002` — Templar (1st-level grant: Judgment, weapon/combat skill)
- `GWPriestSub00003` — Exorcist (1st-level grant: Discerning Eye, arcana/occult-lore skill)

**Signature abilities** (`ghostwire-abilities`, type `ability`): 8 choosable signatures (Blessed Light, Drain, Rebuke, Lightfall, Sacrificial Offer, Word of Rebuke, Warrior's Prayer, Wither — choose 2) + 3 free class-wide signatures (Lay On Hands, Smite/Rebuke, Sense the Veil) = **11 total.**

**Heroic ability tier ladder** (`ghostwire-abilities`, type `ability`):
- 1-cost: 2 (Minor Rebuke, Whisper of Comfort — GHOSTWIRE-original)
- 3-cost: 4 (Call the Thunder Down, Sentinel Spirit, Judgment's Hammer, Violence Will Not Aid Thee)
- 5-cost: 6 (My Life For Yours, Sanctuary Ward, Corruption's Curse, Curse of Terror, Faith Is Our Armor, Sermon of Grace)
- 7-cost: 5 (Invoke the Pact, Fear of the Gods, Saint's Raiment, Soul Siphon, Words of Wrath and Grace)
- 9-cost: 4 (Beacon of Grace, Penance, Sanctuary, Vessel of Retribution)
- 11-cost: 4 (Arise!, Blessing of Steel, Blessing of the Blade, Drag the Unworthy)
- **Subtotal: 25 heroic abilities.**

**Subclass ability-table entries** (`ghostwire-abilities`, type `ability`, 7 per subclass × 3 = **21 total**):
- Shepherd: Steady Hand, Ward-Sense, Circle of Mercy, Recovering Grace, Unbroken Watch, Aegis Bound, The Shepherd's Hour (7)
- Templar: Zealous Strike, Iron Faith, Wrathful Momentum, Anathema's Weight, Vengeance Unbound, Consecrated Ground, Wrath of the Chosen (7)
- Exorcist: Ward Against Incursion, Marked for Banishment, Purging Rite, Hunter's Bind, Severing Word, Unbroken Circle, The Last Rite (7)

**Subclass feature entries** (`ghostwire-classes` or `-abilities`, type `feature`, per-subclass ladder at L1/L4/L7/L8 beyond the L1/L2/L6/L9 ability picks): Shepherd 4 (Warden's Grace, Ward Anchor, Guardian's Voice, +L8 bump), Templar 4 (Judgment, Righteous Momentum, Blade of the Chosen, +L8 bump), Exorcist 4 (Discerning Eye, Bound to Silence, Chain of Names, +L8 bump) = **12 total.**

**Foci items** (`ghostwire-items` or shared gear catalog, type `gear`/`kit`, Category 6B): **8 total** (Prayer-bead through Saint's relic).

**Total planned item count: 1 class + 17 doctrine features + 3 subclass grants + 11 signatures + 25 heroic abilities + 21 subclass abilities + 12 subclass features + 8 foci = 98 items.**

### Class Item Schema (Planned)

```
_dsid: "street-priest"
level: 0
primary: "Conviction"                  // Heroic Resource display name
epic: "Manifest Will"                  // Level-10 epic resource / capstone display name
turnGain: "2"                          // Flat +2/turn drip per E4 baseline; NOT variable like Operator's "1d3"
minimum: "0"
characteristics.core: ["presence", "intuition"]   // real DS keys; display as Persona (Presence) / Instinct (Intuition)
stamina: { starting: 18, level: 6 }
recoveries: 8
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], description, additional: {type, perkType, cost} } }
```

`characteristics.core: ["presence", "intuition"]` is the pattern-mirror of the Elementalist's `["reason", "presence"]` and the Hacker's `["reason", "intuition"]` — both native DS keys, always translated to Persona (Presence) / Instinct (Intuition) in player-facing output. **Note the schema-level distinction from the Elementalist:** the Street Priest's *secondary* characteristic (Instinct/Intuition) is the one used for the class's signature Bind roll (Invoke the Pact), whereas the Elementalist's Bind roll uses its *primary* (Logic/Reason) plus its secondary (Persona/Presence) added together. Verify which pattern (`power.roll.characteristics: ["intuition"]` alone vs. a combined array) Foundry's DS v1.1.1 system expects before writing the Invoke the Pact ability item — this is the same open schema question the Elementalist master flags in its own Known Bugs #8, and it recurs here because Invoke the Pact is structurally the closest sibling to Summon Elemental/Veilbreaker Bind.

### Ability Item Schema (Planned)

```
type: "ability"
system: {
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "minor-rebuke", "invoke-the-pact", "sanctuary-ward"
  story: <flavor line>,
  keywords: [...],                     // e.g. ["magic", "ranged"] for Smite/Rebuke; ["magic", "veil", "summon"] for Invoke the Pact
  type: "main" | "maneuver" | "triggered" | "free",
  category: "signature" | "heroic",
  resource: <number>,                  // Conviction cost: 0 (signatures) or 1/3/5/7/9/11 (heroics)
  trigger: <string>,                   // populated on triggered-type (e.g. My Life For Yours)
  distance: { type: "melee"|"ranged"|"self", primary, secondary, tertiary },
  target: { type: "creature"|"self"|"ally"|"ally-or-self"|"creatureObject"|"area", custom, value },
  power: {
    roll: { formula: "@chr", characteristics: ["presence"], reactive: false },   // Persona (Presence) primary; Invoke the Pact's Bind Check cites ["intuition"] instead
    effects: { <effectId>: { type: "damage"|"applied"|"other", ... } }
  },
  prerequisites: { dsid: ["street-priest"], value: "", level: null },
  effects: { <effectId>: { type: "base", description: <html>, before: true|false, name, sort } }
}
```

**Pact-flavor field note:** because every damage-dealing ability's type flexes between holy (Light) and corruption (Dark) at the table rather than being fixed on the item, the ability item's `power.effects.<id>.damage.type` field should be authored as a **variable/lookup** (`"@pactAlignment"` or equivalent, pending confirmation of whether Foundry's DS v1.1.1 damage-type field supports a character-flag-driven variable) rather than a hardcoded string. This is a new schema pattern not needed by any prior GHOSTWIRE class (the Elementalist's damage type flexes by *attunement*, a similar but not identical mechanism — cross-reference that implementation before building this one). **Flagged in Known Bugs #3, below.**

### Feature Item Schema (Planned)

```
type: "feature"
system: {
  description: { value: <html rules text>, director: <html, optional GM-only guidance> },
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "wardens-grace", "judgment", "chrome-erosion-doctrine"
  advancements: {},                    // empty on standalone-passive features
  prerequisites: { value: "", dsid: [] | ["street-priest"], level: null }
}
```

**Adopt the `description.director` pattern** on rename-by-pact features: **The Roster of the Saved / The Ledger of the Damned** (2nd) needs a director note clarifying that this is a single feature with two display names swapped by the character's stored Pact Alignment flag, not two separate feature items. Same pattern applies to **Burgeoning Saint / Rising Adept** (6th), **Consecrated Weapon / Damned Weapon** (9th), and **Ordained / Sworn** (9th).

### Folder Structure (Planned)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Street Priest class item (shared folder with Operator, Hacker, Elementalist class items) |
| `ghostwire-classes` | `GWPriestSubclassr1` | 3 subclass items (Shepherd, Templar, Exorcist) |
| `ghostwire-classes` | `GWPriestFeatures01` | ~17 core doctrine features + 12 subclass features |
| `ghostwire-abilities` | `GWPriestSignatures1` | 11 signature abilities (8 choosable + 3 free class-wide) |
| `ghostwire-abilities` | `GWPriestHeroics0001` | 25 heroic abilities across the 1/3/5/7/9/11 tier ladder |
| `ghostwire-abilities` | `GWPriestSubAbil0001` | 21 subclass ability-table entries (7 per subclass) |
| `ghostwire-kits` | (existing) | Sanctified Kit item, shared with other light-Kit magic classes |
| `ghostwire-items` | `GWPriestFoci000001` | 8 Category-6B foci items |

### Deploy Scripts (Planned Chronological Order)

1. **`Backup-Ghostwire-World-PreStreetPriest.ps1`** — read-only, full compendium snapshot to disk before any writes. Standard pre-ship safety measure per Pre-Flight Doctrine.
2. **`Deploy-Ghostwire-StreetPriest-Rebuild-v1.ps1`** — primary ship script. Creates all 98 planned items across `ghostwire-classes`, `ghostwire-abilities`, `ghostwire-kits`, and `ghostwire-items` in the folder structure above. Idempotent (checks for existing items by `_dsid` prefix `GWPriest` and either updates in place or aborts with warning).
3. **`Diagnose-Ghostwire-StreetPriest-Advancements.js`** — read-only diagnostic to verify the class item's `system.advancements` object built cleanly, modeled on the equivalent Hacker/Operator diagnostic scripts.
4. **`Backup-Ghostwire-StreetPriest-FullDump-v1.js`** — read-only dump script using the proven-working Clipboard API + chunked console fallback pattern (per Operator master §Data Provenance — do not use `copy()` or Blob-download methods, both failed on Michael's Windows setup). This dump becomes the ground truth for Part 2's live-schema update once it exists.
5. **`Deploy-Ghostwire-StreetPriest-Patch-*.ps1`** (as needed) — targeted patches per bug discovery, following the Hacker patch pattern.

### Known Bugs / Sign-Off Needed

*Every invented content item in this document is listed here for Michael's explicit review, following the same numbered pattern the Wrench master uses in its own Known Bugs #13. Nothing below should be treated as final canon until reviewed.*

1. **INVENTED CONTENT FLAG — the entire 1-Cost Tier is GHOSTWIRE-original.** The DS Conduit SRD has no 1-piety band; **Minor Rebuke** and **Whisper of Comfort** were written specifically to give the Street Priest a cost-1 floor matching the Hacker/Elementalist/Operator/Wrench templates' ladder shape. Neither ability is adapted from any published source. Flagged for Michael's sign-off before treating either as final.

2. **INVENTED CONTENT FLAG — Level 4/8 subclass filler features across all three subclasses.** Per the same authorization pattern the Wrench master uses for its own Level 4/6/7/9 filler features (Wrench Known Bugs #13), the following were newly named to populate levels the template's feature cadence expects but that DS Conduit's domain-piety structure did not specify at this granularity:
   - **Shepherd** — "Ward Anchor" (4th) and its 8th-level power-bump ("Warden's Grace's bonus Stamina increases again; Ward Anchor's discount extends to Invoke the Pact's Persistent-2 sustain cost as well").
   - **Templar** — the 8th-level power-bump ("Judgment can be applied to a second target simultaneously").
   - **Exorcist** — "Bound to Silence" (4th) and its 8th-level power-bump ("Bound to Silence's save-ends rider can now also suppress a hostile working").
   All six are mechanically minor extensions of an already-established same-subclass feature rather than new class-identity content, but none existed in the source Street-Priest chapter at this granularity — flagged to Michael for sign-off before being treated as final, exactly as the Wrench's equivalent filler features were flagged.

3. **INVENTED CONTENT FLAG — all 21 subclass ability-table entries (Steady Hand through The Last Rite) are GHOSTWIRE-original.** The source Street-Priest chapter describes subclass identity at the paragraph level ("your heals also grant a small rider," "Judgment," "your Banish/anti-spirit rolls are enhanced") but does not enumerate a discrete per-level ability list the way DS Conduit's domain-piety table does. All 21 entries across the three Ability Tables (7 per subclass) were authored fresh for this document to fill that structural gap. Flagged for Michael's sign-off — recommend a playtest pass to confirm the tier-1/2/6/9 power curve lands correctly relative to the Elementalist's and Wrench's equivalent subclass-ability ladders.

4. **INVENTED CONTENT FLAG — Judgment's exact damage/bane magnitude is structure-only, not numeric.** The Judgment mechanic (both the class-wide description and the Templar 1st-level feature) states the *shape* of the mark (bane on acting in line of effect, bonus Conviction on first damage exchange each round) per canon, but this document does not invent specific numbers for the damage rider — those are explicitly deferred to the numeric/damage-status pass, consistent with how the source chapter itself deferred them. Not a sign-off item in the same sense as #1-3 (no new mechanic invented, only structure preserved) but flagged here so a future numeric pass knows exactly which fields are still open.

5. **OPEN DESIGN QUESTION — pact-flavor damage-type variability is a new schema pattern.** As noted in the Ability Item Schema section above, every damage-dealing ability in this class needs its damage type to flex between holy and corruption based on the character's stored Pact Alignment, rather than being fixed per-item. This has no exact precedent in the shipped Hacker/Operator schemas and only a partial precedent in the Elementalist's attunement-driven damage-type field. Needs a schema design pass before ship — do not hardcode damage type on any Street Priest ability item.

6. **OPEN SCHEMA QUESTION — Invoke the Pact's Bind Check characteristic array.** Per the Class Item Schema section above, confirm whether Foundry's DS v1.1.1 `power.roll.characteristics` field supports a single-secondary-only roll (`["intuition"]` alone, distinct from the class's primary) cleanly, or whether it needs a per-effect override. This is structurally the same open question the Elementalist master flags for its own Bind-roll abilities (Elementalist Known Bugs #8) and should likely be resolved once, jointly, for both classes.

7. **OPEN CONTENT ITEM — companion actor stat blocks for Invoke the Pact's independent form are not modeled here.** Exactly like the Elementalist's Summon Elemental (Elementalist Known Bugs #6), the independent form of Invoke the Pact requires a companion actor stat block (Tier 1-2 entity per Veil §C3) for the angelic/infernal warrior (Templar), guardian/warding spirit (Shepherd), or hunting/binding spirit (Exorcist). None of these actors are drafted in this document; they need a shared "GHOSTWIRE Veil Entities" bestiary pass, likely shared with the Elementalist's elemental actors and any future Necromancer summons.

8. **OPEN CONTENT ITEM — foci items (Category 6B) may not exist yet in Foundry.** Per the same open item flagged in the Elementalist master (Known Bugs #7) for its own Category 6A foci, verify whether any of the 8 Street-Priest foci items exist in `ghostwire-items` or a shared gear-catalog pack before ship. If missing, build them as a companion pass.

9. **CYBORG-EXCLUSION IS TABLE-ENFORCED, NOT SCHEMA-ENFORCED, per the same pattern as the Elementalist (Elementalist Known Bugs #4).** The Arcane Severance doctrine is documented in Part 1's "Who You Are" section as a player-facing hard rule but no mechanical species-check gate is added to the Street Priest class item's `prerequisites` field in this initial ship. Flagged as a possible future dev item if Michael wants harder enforcement.

10. **PROVENANCE FLAG — Conviction's numeric baseline (drip +2, gamble table, creed echo +1, sustain −2/−4, cap 8+4/tier) is LOCKED CANON, not a v1 estimate**, unlike most other classes' resource numbers at this stage of the project. This is a genuine and useful distinction from the Elementalist/Wrench masters, both of which flag nearly all their numeric values as placeholders — the Street Priest's resource engine has already been through the E4 numeric-baseline pass. Do not re-flag these specific numbers as open in a future numeric-calibration pass; they are done. Everything else in this document (subclass power-bump magnitudes, Judgment's exact bane/damage numbers, foci mod-slot benefit magnitudes) remains open per items #3-4 above.

11. **OPEN QUESTION — Sanctified Kit's exact stat block is not authored in this document.** Part 1 references the Sanctified Kit by name (shared with the Elementalist's magic-flavored light-Kit family) but does not restate its full stat block here — confirm it already exists in `ghostwire-kits` from the Elementalist ship, or build it fresh if the Elementalist's Kit work is itself still pending.

### Source File Index

| Purpose | Path |
|---|---|
| Street-Priest lore canon (Pacts, 6B foci, full class chapter, E4 Conviction baseline) | `/home/user/workspace/street_priest_lore_reference.md` |
| DS Conduit chassis reference (full SRD reskin source) | `/home/user/workspace/street_priest_conduit_reference.md` |
| Master rules baseline (original source of the lore reference extract) | Project file: `master_rules_baseline_2XP-1BP_2026-07-22.md` |
| Wrench master (primary structural template, level-based rework) | `/home/user/workspace/Ghostwire_Wrench_Development_Master.md` |
| Elementalist master (closest-match caster template) | `/home/user/workspace/Ghostwire_Elementalist_Development_Master.md` |
| Operator master (feature/ability pairing template) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/0645e406-dde8-4307-bc7f-f33d6e2f29b9/Ghostwire_Operator_Development_Master.md` |
| Hacker master (schema-pattern template) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/fa751242-d3ce-477c-a04a-f29d851562cc/Ghostwire_Hacker_Development_Master.md` |
| GHOSTWIRE canonical build log | Project file: `GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Pre-Flight Doctrine (governing process rules) | Project file: `GHOSTWIRE_Preflight_Doctrine_v1.md` |
| DS Conduit SRD (original source, for re-verification) | `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/` |

---

*End of `Ghostwire_StreetPriest_Development_Master.md` (v1, 2026-07-29). Next agent: surface the Known Bugs / Sign-Off Needed list to Michael before treating any invented ability, filler feature, or subclass-table entry as final canon; build the Foundry deploy script chain once Part 1 is ratified; resolve the pact-flavor damage-type schema question and the Invoke the Pact Bind-Check characteristics-array question jointly with the Elementalist's equivalent open items; author the companion actor stat blocks for Invoke the Pact's independent form alongside the Elementalist's elemental actors in a shared Veil-entities bestiary pass.*
