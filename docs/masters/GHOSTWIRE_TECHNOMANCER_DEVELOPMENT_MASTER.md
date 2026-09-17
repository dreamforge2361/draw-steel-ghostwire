# GHOSTWIRE_TECHNOMANCER_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Technomancer class as of 2026-07-29 (v1 full design). All future Technomancer-class design, rules, and Foundry-implementation work — across every session — must reference and update THIS file, and only this file. Do not create new Technomancer-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and the Scout / Elementalist / Operator / Hacker / Wrench / Street Priest / Medic / Commander masters are treated for those classes.*

*Last updated: 2026-07-29 (v1). Ground truth for Part 1 is (a) the DS Talent class SRD mechanical spine (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Talent/`, retrieved 2026-07-29) reskinned into GHOSTWIRE, layered against (b) the DS Elementalist's conjured-presence resource trigger and high-Essence summoning ladder (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Elementalist/`, retrieved 2026-07-29), (c) one DS Conduit healing signature (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/`, retrieved 2026-07-29), and (d) the full Technomancer canon chapter extracted from `master_rules_baseline_2XP-1BP_2026-07-29.md` (the "Class: The Technomancer" chapter, added 2026-07-15, lines 4024-4183). Attribute names follow the locked GHOSTWIRE convention: display label first, real DS attribute in parentheses — e.g. **Logic (Reason)**, **Persona (Presence)**.*

> **Attribute canon note:** GHOSTWIRE uses five characteristics. Display labels match Foundry with the Draw Steel attribute in parentheses: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. This document uses **Logic (Reason)** as the Technomancer's primary attribute and **Persona (Presence)** as secondary, per Michael's 2026-07-15 ruling. Reflex is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear in current GHOSTWIRE canon.

**Older Technomancer source docs** (the master baseline's full class chapter) supplied canonical structure for identity, the Resonance resource shape (Attunement / Congregation / Compile momentum / Harmonic echo), the sprite congregation (Data/Attack/Machine/Ward archetypes, hybrid-by-tier grammar), the three signature abilities (Compile Sprite, Resonance Strike, Resonance Mending), the subclass triad (Sprite-Weaver / Machine-Whisperer / Resonance-Warrior), and the chrome-fence ruling. All of that content is preserved and reskinned below onto the DS Talent's mechanical chassis, with the Elementalist's conjured-presence trigger and summoning ladder and one Conduit healing signature grafted on top, per Michael's rulings of 2026-07-15 through 2026-07-29 (see below).

## Design Rulings (LOCKED — Michael's approvals, 2026-07-15 through 2026-07-29)

1. **Class chassis: DS Talent** — primary chassis. Clarity is renamed Resonance; Strain is reskinned as Biofeedback, with softened severity per Ruling #9.
2. **Chassis donor #1: DS Elementalist** — the conjured-presence resource trigger (Elementalist's Essence-gain-when-elemental-magic-conjured-nearby, reskinned as Harmonic Echo) and the high-Essence summoning ladder (7+ cost summon-elemental structure, reskinned as the Technomancer's top-tier sprite abilities).
3. **Chassis donor #2: DS Conduit** — one healing signature. Conduit's Healing Grace/Lay On Hands grammar (ranged maneuver, target self-or-ally, spend-resource-for-more-targets-or-conditions) is reskinned wholesale into **Resonance Mending**.
4. **Primary attribute: Logic (Reason)** — every Wired roll the Technomancer makes is Logic-based; the class is a Wired native.
5. **Secondary attribute: Persona (Presence)** — control, bind, and resist biofeedback; the same control-and-bind axis the Veil casters use, applied to the net's spirit world instead.
6. **Heroic Resource: Resonance** — per-encounter, resets at end of encounter (matches every other GHOSTWIRE resource except the Medic's persistent Reagents). The sprite economy is the engine that fills it.
7. **Three subclasses: Sprite-Weaver / Machine-Whisperer / Resonance-Warrior** — reskinned respectively from DS Talent's Telekinetic (wide/kinetic), Telepath (interface/mind), and Chronokinetic (offensive/tempo) traditions. Role slots preserved: wide congregation, interface/healer, offensive mystic.
8. **Sprite cap L1: 2 sprites** — a half-caster's amplitude. Sprite-Weaver's Wide Compile scales the cap to 3+ starting at 1st level.
9. **Strain severity: Gentler biofeedback.** Only Resonance abilities costing **5 or more** can trigger a biofeedback save. If biofeedback would drop the Technomancer to 0 Stamina, the consequence is downgraded to **Winded**, never Dying — you cannot be killed by your own overreach, only by an enemy.
10. **Cyborg-heal niche: OPEN to all Technomancers.** Resonance Mending's Cyborg-target branch is a **base signature at 1st level**, available to every Technomancer regardless of subclass. Machine-Whisperer simply does it better — more mending, greater range, cheaper cost — never exclusively.
11. **Sprite grammar: Hybrid-by-tier, canon-verbatim.** Minor sprites (levels 1-3) are extensions of the Technomancer, acting on the Technomancer's own turn. Intermediate sprites (levels 4-7) act on their own turn but only within standing command orders. Powerful/bound sprites at the top of the ladder (levels 8-10) become genuinely independent, rolling their own initiative like a proper DS summon.
12. **Cyborgs are BARRED from this class.** Arcane Severance blocks all magic, including Resonance. This is canon-inviolable, with no exceptions and no opt-outs. The Technomancer heals Cyborgs; a Cyborg cannot become one.
13. **Half-caster with light chrome tolerance.** Magic-erosion still applies (Resonance is genuine magic) but more gently than for the Veil casters — the middle lane between the chrome-positive Hacker/Wrench and the chrome-averse Elementalist/Street-Priest.
14. **9-cost and 11-cost tiers: full Q4=A fill.** Four abilities invented at each tier, all flagged for Michael's sign-off — the same doctrine already applied to the Medic and the Commander/Face.
15. **Minor canon-baseline tightening ALLOWED**, matching the Bard-in-Face doctrine-change pattern — but any such refinement is flagged in Part 2 for sign-off, and **none are applied to canon** unless and until Michael approves them post-draft.
16. **Attribute display convention:** GHOSTWIRE label first, DS attribute in parentheses. Five characteristics only: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. "Reflex" is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear.
17. **DS levels 1-10 are the primary progression axis.** Echelon (E1-E4, four bands) is a cross-class tier concept only — used here strictly for gear-tier cross-references, never to gate a Technomancer feature ladder directly.
18. **Cost ladder: 1 / 3 / 5 / 7 / 9 / 11**, matching every other GHOSTWIRE class master (canon's own Technomancer chapter only sketches 3/5/7 and stubs 9/11 for the numeric pass — this document completes the ladder).
19. **Currency: nuyen (¥)** throughout — never "Wealth," never abstract credits.
20. **Field of grafts must be honestly named.** Per Michael's V2 sourcebook doctrine, the Draw Steel bridge callout at the top of Part 1 must read exactly: *"Closest to a Talent with an Elementalist's conjured-presence trigger and one Conduit signature; Cyborgs cannot take this class."*

---

## PART 1 — PLAYER-FACING: THE TECHNOMANCER

### Draw Steel Bridge Callout

> **Closest to a Talent with an Elementalist's conjured-presence trigger and one Conduit signature; Cyborgs cannot take this class.**

No single Draw Steel class maps cleanly onto the Technomancer, because the fiction asks for three things DS keeps in three separate boxes. The **DS Talent** supplies the chassis every other piece hangs on: a Reason-primary psionic engine with a per-turn resource drip, a risk-for-power Strain mechanic, and a three-tradition subclass ladder — the closest existing shape to "a gearless mind that touches a hidden layer of reality directly." But the Talent's traditions (Telekinesis, Telepathy, Chronopathy) never summon anything; they *are* the caster's own power, full stop. For the Technomancer's true identity — a shaman who conjures a **congregation of independent-ish helper-spirits** and grows stronger the more of them are compiled and working — GHOSTWIRE reaches into the **DS Elementalist**, whose Essence resource famously deepens through a "conjured-presence" trigger (gain Essence when elemental magic manifests nearby) and whose high-Essence tier is built entirely around summon-grade payoff abilities. That's the sprite-economy engine layered on top of the Talent chassis. And because the setting's own canon names the Technomancer as **the only class that can heal machines, drones, chrome, and Cyborgs**, GHOSTWIRE needed a genuine healing-signature grammar to graft in — which is where the **DS Conduit**'s Healing Grace (ranged maneuver, spend-resource-for-more-targets-or-conditions) comes from, reskinned wholesale into Resonance Mending. The Technomancer, in other words, sits in a corner of Draw Steel's design space MCDM never quite built: a summoner who is also a half-caster who is also the game's one tech-healer. Three donors, one class, zero apologies.

---

### Who You Are

You are a **Technomancer** — on the street just **shaman**, **ghost-talker**, **the one who speaks to the net**, or (less kindly) **witch-doctor**. Corp paperwork, when it can even categorize you, files you as an *"unlicensed digital-anomalous asset"* or a *"non-standard signal specialist."* None of that comes close to what you actually are: the crew's **ghost-shaman of the machine world**, a shaman who speaks the net's language without a single tool between you and it.

Where the **Hacker** breaches a system with a deck and the **Wrench** commands a fleet through a rig, **you need neither**. You reach into the Wired with your mind alone, and the net answers — and what answers most readily are **sprites**: fragments of living code, half-tamed and half-aware, that swarm to your will the way a Veil summoner's spirits answer a call. You are the **Wired-side mirror of the Veil summoners** — the tech spine's pet class, the one whose board presence is *external and conjured* rather than personal and armed. A **Data-sprite** scouts and screens for you. An **Attack-sprite** bites through firewalls and jacked-in flesh alike. A **Machine-sprite** mends what should be unmendable. A **Ward-sprite** stands between you and the current when it turns hostile.

This is the clean line that separates you from the **Wrench**: the Wrench's drones are **nuyen gear** — bought, built, modded, physical, and permanent between runs. Your sprites are **conjured Resonance** — free, temporary, immaterial, and gone the moment the current fades. The Wrench is an engineer with a garage. You are a shaman with a congregation of ghosts.

And you fill a niche **no other class can touch**: because your magic *is* technological, your Resonance can **heal machines, drones, chrome, and even Cyborgs** — the one power in the entire game that mends the unmendable. Where the Street-Priest lays hands on flesh and soul, you lay hands on steel and code.

**Battlefield job:** techno-shaman and sprite summoner. Conjure and command a congregation of code-spirits as your board presence and damage. Do the Hacker's control work gearlessly when the moment calls for it. Serve as **the** tech-side healer for machines, drones, chrome, and Cyborgs alike. A conjuring force-multiplier with a unique mending niche nobody else in the game can offer.

**The Cyborg bar, stated plainly.** Arcane Severance blocks *all* magic in a Cyborg's chassis, including your Resonance — this is canon-inviolable, with no exceptions anywhere in this document. You are one of the only classes in GHOSTWIRE that a Cyborg character can never take up. But note the asymmetry carefully: **you can heal a Cyborg. A Cyborg simply cannot become you.** Your Resonance Mending signature works on Cyborg Stamina exactly as it works on a drone's Integrity — the door swings one way, and it swings wide.

**What you are not.** You are not the Hacker's precision breach specialist, and you don't carry a deck. You are not the Wrench's fleet commander, and you don't own hardware. You are not a Veil caster, and the spirit world you speak to is the net, not the other side. You are the flavor bridge between the tech spine and the spirit spine — proof, in mechanical form, that the net has ghosts of its own.

---

### Class Chassis

*DS Talent reskin explanation: the Technomancer's mechanical spine is the DS Talent class — a Reason-primary psionic engine built around a per-turn resource drip (Clarity, renamed Resonance), a risk-for-power Strain mechanic (renamed Biofeedback, softened per Ruling #9), and a three-tradition subclass ladder (Telekinesis/Telepathy/Chronopathy, reskinned to Sprite-Weaver/Machine-Whisperer/Resonance-Warrior). Layered on top: the DS Elementalist's conjured-presence Essence trigger (reskinned as Harmonic Echo) and its high-Essence summon-grade ability ladder (reskinned as the Technomancer's top-tier sprite payoffs), plus one DS Conduit healing signature (Healing Grace, reskinned as Resonance Mending).*

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic (Reason) — primary; Persona (Presence) — secondary |
| **Heroic Resource** | Resonance |
| **Epic Resource / Capstone** | Master of the Current (10th level) |
| **Potency: Weak / Average / Strong** | Logic − 2 / Logic − 1 / Logic |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +8 |
| **Recoveries** | 8 |
| **Kit Slot** | Light — the Technomancer is a caster at heart; sprites carry the board presence, not personal weapons |
| **Skills** | **Resonance** (the class's signature skill — technomantic harmonics, machine-spirit contact, digital-supernatural interface) and a **spirit/ritual-adjacent skill** (compiling, binding, communing with sprites) are the class's two anchor skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. **Electronics/Matrix Theory** rounds out the baseline (understanding the systems sprites move through). A fourth free pick follows your discipline: a second spirit/compiling skill (Sprite-Weaver), Mechanics/medtech (Machine-Whisperer), or EW/security-systems (Resonance-Warrior). |

*Design note (chassis rationale, per DS Talent's baseline stats + GHOSTWIRE's summoner/half-caster identity): the Technomancer mirrors the Talent's Stamina/Recoveries curve exactly (18 starting, +8/level per GHOSTWIRE's Talent-tier scaling, 8 Recoveries) — a fragile-to-middling frame appropriate for a class whose real durability lives in its congregation, not its own body. Species mods stack on top of the class chassis in the standard way. Potency is keyed to Logic (highest characteristic −2/−1/−0), matching the Talent's own Reason-keyed potency rule exactly.*

**No native Veil access.** The Technomancer's "spirit world" is the net, not the Veil — it is a full native of the **Wired chapter** alongside the Hacker and Wrench, using the same nodes/Trace-Alert/biofeedback systems, but it has no supernatural reach into the Veil proper. It is the game's **only techno-magic caster** — a living bridge in flavor between the game's two spines, without belonging fully to either.

**Characteristic Increases:**
- **4th level:** Logic (Reason) and Persona (Presence) each rise to 3.
- **7th level:** all five characteristics rise by +1 (max 4).
- **10th level:** Logic (Reason) and Persona (Presence) each rise to 5.

**Advancement table shape:** DS levels 1-10, matching the Hacker/Elementalist/Operator/Wrench/Street Priest/Medic/Commander masters — see the **Level 1-10 Progression Table**, below, for the full level-by-level breakdown of features, abilities, and discipline grants.

---

### Resonance — Your Heroic Resource

**Resonance** is your bond with the Wired made mechanical — the living current of a shaman's rapport with a spirit world built from code instead of ectoplasm. It is not throughput banked by breaking in (that's the Hacker's Bandwidth) nor runtime banked by fielding hardware (that's the Wrench's Uptime); it is your **congregation's own health and growth**, deepening as your compiled sprites work the field around you. Per Ruling #6, Resonance is **per-encounter and resets** at the end of every fight — you don't bank a night's rapport into tomorrow's run.

**How Resonance is earned (the full canon loop):**

| Trigger | Gain |
|---|---|
| **Attunement (first communion)** — the first time each encounter you commune with the Wired (compile a sprite or take a Resonance action) | Resonance equal to your **Victories** |
| **The congregation (core loop)** — start of each of your turns | Resonance equal to the number of sprites **currently compiled and under your command**, up to your sprite cap |
| **Compile momentum** — when you compile a **new** sprite | **+1 Resonance** banked immediately (Sprite-Weaver doubles this to +2, per its Wide Compile feature) |
| **Harmonic echo (the Elementalist-donor trigger, preserved verbatim)** — first time each combat round one of your sprites **lands an effect** (an attack connects, a heal lands, a Wired verb succeeds) | **+1 Resonance** |
| **End of encounter** | Lose all remaining Resonance |

*(The three Wired resources now read as a clean family: the **Hacker** deepens by being unseen and in [intrusion momentum], the **Wrench** by being deployed and everywhere [fleet-in-the-field], the **Technomancer** by being in communion with a living congregation [the sprite economy]. All three are "hold your presence on the board and it compounds" engines wearing three different fictions.)*

**Outside combat.** You may use a Resonance ability without spending, once per rest or Victory, in a social or exploration scene — the standard house rule shared by every GHOSTWIRE resource-tracked class. You can't use that same ability again outside combat until you earn a Victory or finish a respite.

**End of encounter.** Unused Resonance is lost — the current fades, and you don't bank rapport between fights. **Sprites still compiled at encounter's end decompile** unless a feature explicitly says otherwise; they are temporary conjurations, not gear.

**Firewall note.** Resonance is class power on the BP side of the firewall. It is never bought, raised, or fed by nuyen or Body Integrity. Chrome (light, for this class) or a resonance-tuned focus may make abilities **better** or **wider**, but does not manufacture Resonance — sprites are conjured by the mind, not purchased.

> **What is Resonance?** *(Inline definition, so the term is never more than a paragraph away from first use.)* Resonance is the Technomancer's Heroic Resource: the strength of your live bond with the Wired's spirit world, earned by attuning at the start of a fight and deepened as your congregation of sprites grows and lands effects, spent on heroic abilities and signature enhancements. It resets to zero at the start of every encounter and is fully lost at the end — you cannot bank a night's communion into tomorrow's run.

---

### The Sprite Congregation

Sprites are your summoned companions — the Wired-side equivalent of the Veil's hybrid-by-tier summoned entities, and the direct cousin of the Wrench's drones (but conjured, not built). A sprite is **compiled from Resonance on the spot**, acts under your command, and **decompiles** when dismissed, destroyed, or at encounter's end. No nuyen, no mod slots, no persistence between fights — pure Resonance made manifest.

**Sprite cap.** At 1st level you may have up to **2 sprites** compiled and under your command at once (Ruling #8). Sprite-Weaver's Wide Compile raises this to **3** starting at 1st level, and further scales upward through that discipline's higher-level features (see the Sprite-Weaver table, below). The general baseline cap rises to **3** at 5th level and **4** at 8th level for every Technomancer, regardless of discipline.

**Compile cost.** Compiling a new sprite costs **3 Resonance** (base). Sprite-Weaver reduces this to **2 Resonance** per its Wide Compile feature.

#### The Four Sprite Archetypes

**Data-sprite** — the scout and screen
A quick, thin thread of code that slips ahead of the congregation to read the field before anyone else does.
- Grants an **edge** on Search, Scan, Breach, or Command rolls made by the Technomancer or any ally directing it.
- Can act as a spotter: allies gain an **edge on Power Rolls** against a target the Data-sprite has scanned this round.
- Lowest Sprite HP tier of the four archetypes — built for information, not endurance.

**Attack-sprite** — the congregation's damage
The bite in the swarm. Jacked into a device or striking directly across the Wired, it hits both digital and (through a device or a jacked target) physical foes.
- Standard weapon-equivalent damage die: **Power Roll + Logic** vs. the target's Wired defense (a wired target) or Reflex defense (a target reached through a device or jack).
- Baseline damage: **2d10 + Logic**, following the shared GHOSTWIRE strike-damage convention.
- Highest Sprite HP tier among the four when directed by a Resonance-Warrior.

**Machine-sprite** — the mender
The congregation's healer, and the direct mechanical expression of Ruling #10.
- Repairs machines, drones, vehicles, and chrome in the field.
- Channels the Cyborg-healing niche when directed by **Resonance Mending** — every Technomancer, regardless of discipline, can direct a Machine-sprite to mend a Cyborg's Stamina. This is base-signature behavior, not a discipline-locked ability.
- Machine-Whisperer's discipline features amplify this archetype specifically (see its table, below).

**Ward-sprite** — the shield
A standing harmonic wrapped around the Technomancer's own exposed body.
- Grants the Technomancer (and, at higher tiers, nearby allies) a **defense bonus against Wired and EW attacks** while adjacent or in Wired range.
- Resists ICE and electronic-warfare effects on the Technomancer's behalf.
- The screen that keeps a fragile, communion-focused caster alive — the Technomancer's answer to the Wrench's fielded-fleet cover.

#### Sprite Stat Block Reference (by Hybrid Tier)

Each archetype scales along the same hybrid-by-tier ladder described below, but its numbers move independently by archetype. The table gives the benchmark Sprite HP, attack/effect bonus, and defense for each archetype at each tier band. These are design-pass placeholders pending Michael's numeric sign-off (see Part 2, Known Bugs #13) but are included here in full so playtesting can begin immediately rather than waiting on a second pass.

| Archetype | Minor (L1-3) Sprite HP | Minor Bonus | Intermediate (L4-7) Sprite HP | Intermediate Bonus | Advanced (L8-10) Sprite HP | Advanced Bonus |
|---|---|---|---|---|---|---|
| **Data-sprite** | 8 + (Logic × Level) | Edge on 1 roll type/round | 14 + (Logic × Level) | Edge on 2 roll types/round | 20 + (Logic × Level) | Edge on all Wired rolls it can see |
| **Attack-sprite** | 12 + (Logic × Level) | 2d10 + Logic | 18 + (Logic × Level) | 2d10 + Logic + 1d6 | 26 + (Logic × Level) | 3d10 + Logic |
| **Machine-sprite** | 10 + (Logic × Level) | Mends 1 Recovery-worth | 16 + (Logic × Level) | Mends 1 Recovery-worth, +1 target | 22 + (Logic × Level) | Mends as full Resonance Mending action |
| **Ward-sprite** | 10 + (Logic × Level) | +1 defense to self only | 16 + (Logic × Level) | +1 defense, self + 1 adjacent ally | 22 + (Logic × Level) | +2 defense, self + all adjacent allies |

*Reading the table:* a 4th-level Technomancer's Attack-sprite (now intermediate) has 18 + (Logic × 4) Sprite HP and deals 2d10 + Logic + 1d6 on a hit — a meaningful jump from the 1st-3rd level minor version, reflecting that intermediate sprites have crossed into acting on their own initiative and are correspondingly more durable and more dangerous. This benchmark is explicitly a first-pass placeholder; Michael has flagged the exact HP curve for a full numeric-balance sign-off before Foundry implementation locks it in (see Known Bugs #13).

**Sprite defenses (all archetypes, all tiers):** unless an archetype's bonus column says otherwise, every sprite uses the Technomancer's own Persona (Presence) score as its baseline Wired defense, and a flat 10 as its baseline Reflex/Physique defense (sprites are code, not flesh — physical attacks that can even target them at all do so at a standing disadvantage). A Ward-sprite's own defense bonus stacks on top of this baseline for whoever it's shielding, not for itself.

#### Hybrid-by-Tier Grammar (Ruling #11, canon-verbatim)

The Technomancer's sprites follow the same "extension vs. independent" ladder the Veil chapter uses for summons, applied here for structural parity across the game's two summoning traditions:

| Tier | Levels | Behavior |
|---|---|---|
| **Minor (extension)** | 1-3 | Sprites act **as extensions of the Technomancer** — on the Technomancer's own turn, sharing the Technomancer's intent. No separate initiative. This is the Compile Sprite signature's default mode. |
| **Intermediate (commanded)** | 4-7 | Sprites act **on their own turn**, but only within standing command orders — a Compile Sprite maneuver-command must be issued each round to keep an intermediate sprite acting autonomously that round. |
| **Advanced (independent)** | 8-10 | Sprites are **genuinely independent** — they roll their own initiative and act like a proper DS summon, the top of the hybrid ladder. This is the payoff tier: by the time a Technomancer reaches 8th level, their congregation is no longer just an extension of them, but a small crew of ghosts fighting alongside them. |

**Sprites acting on the Technomancer's own turn never trigger biofeedback for the Technomancer** — they are the buffer between the caster and the wire, precisely because they haven't yet become independent enough to feed anything back.

#### Decompile Rules

A sprite decompiles when:
- **The encounter ends** (canon) — the congregation doesn't persist between fights.
- **It is destroyed** — reduced to 0 Sprite HP. Benchmark Sprite HP for a minor sprite: **10 + (Logic × Level)**; intermediate and advanced sprites scale upward from that baseline (final numbers land in the numeric pass — see Part 2, Known Bugs #13).
- **You dismiss it voluntarily** — a free maneuver, no Resonance cost.

---

### Biofeedback — The Cost of Overreach

*The Technomancer's Talent-Strain reskin, softened in amplitude per Ruling #9 to fit the half-caster's lighter power ceiling.*

Overreach into the Wired's spirit world bites back — but not as hard as it bites a full Veil caster, and (per Michael's explicit ruling) it can never actually kill you on its own.

- **Only Resonance abilities of cost 5 or higher trigger a biofeedback risk.** Anything cheaper — signatures, the 1-cost and 3-cost tiers — is safe.
- When you spend 5+ Resonance on a single ability, make a **Physique (Might) save**. The DC scales with the ability's cost:

| Ability Cost | Biofeedback Save DC |
|---|---|
| 5-cost | DC 12 |
| 7-cost | DC 15 |
| 9-cost | DC 18 |
| 11-cost | DC 20 |

- **On a successful save:** no effect. The ability resolves normally either way.
- **On a failed save:** you take **Persona-score damage** (this damage bypasses shields and temporary Stamina — it's your own current biting back, not an external attack), and the ability still resolves fully.
- **0-Stamina consequence (softened per Ruling #9):** if biofeedback damage drops you to 0 Stamina, you become **Winded** instead of Dying. While Winded this way, you regain 1 Stamina per turn until stabilized, and you are not at risk of death from your own overreach — only external damage can kill a Technomancer outright.
- **Discipline modifiers:** Sprite-Weaver saves at **DC−2** across the whole ladder (the purest caster of the three, and the gentlest on their own body). Resonance-Warrior saves at **DC+2** across the ladder, but their damage output is built to justify the extra risk.
- **Sprites acting on the Technomancer's own turn (the minor/extension tier) never trigger biofeedback for the Technomancer** — the buffer holds until a sprite goes independent.

**Design note.** This preserves the Talent chassis's core identity — every manifestation of real power risks harming the caster — while softening the amplitude to match the Technomancer's status as a half-caster rather than a full Veil-equivalent psion. Michael has reserved the option to introduce full Talent-canon Strain severity (unmodified DC ladder, no cost-5 floor, Dying instead of Winded at 0 Stamina) as an optional **Advanced/Hard-Mode variant** any given campaign can opt into — see Part 2, Known Bugs #2.

---

### Signature Abilities (No Resonance Cost)

You have **three** signatures — all free, at-will, from 1st level, all enhanced by spending Resonance for a stronger effect, none of them ever costing Resonance at their base effect.

> **Compile Sprite** *(Class Feature Signature — the summoner core)*
> *Keywords: Wired, Resonance, Summon · Type: Main action to compile; maneuver to command already-compiled sprites · Distance: Wired range · Target: the net (to compile) / your sprites (to command)*
> **Effect:** **Compile** a sprite of your choice (Data, Attack, Machine, or Ward — it manifests under your control), or **Command** your compiled sprites to move and act (they act on your turn, per the extension model). On **Outcome Tier 1 (17+)**, you compile *and* issue a free command in the same action. On **Outcome Tier 3 (≤11)**, the sprite manifests unstable (it acts next turn instead of immediately) or a command garbles (Director's call on the misfire).
>
> **Enhance (spend Resonance):** compile a **second sprite** in the same action, OR command the **whole congregation** at once (the swarm of ghosts moves as one).
> *Your baseline, every-turn presence — the class's answer to "what does the Technomancer do when nothing bigger is queued up."*

> **Resonance Strike** *(Class Feature Signature — the damage)*
> *Keywords: Wired, Resonance · Type: Main action · Distance: Wired range (or a sprite's reach) · Target: one enemy (a wired target directly; a flesh target through a device it carries or a sprite jacked into it)*
> **Power Roll:** 2d10 + Logic + Resonance skill.
> **Effect:** You (or a commanded Attack-sprite) lash a target with hostile code and biofeedback. **Outcome Tier 1 (17+):** full damage plus a rider — a Wired condition (glitched, blinded-sensor) or a free sprite reposition. **Tier 2 (12-16):** full damage. **Tier 3 (≤11):** the strike fails to connect, and the current recoils — a minor biofeedback risk to you (see Biofeedback, above, if this triggers a cost-5+ enhance).
>
> **Enhance (spend Resonance):** a **second sprite** strikes too, OR add an edge via deep communion.
> *Like the Hacker's Feedback Spike, direct personal damage leans on wired/deviced targets — but the sprite congregation is your true offense, exactly as drones are the Wrench's.*

> **Resonance Mending** *(Class Feature Signature — the unique niche; see its own Deep Dive section below)*
> *Keywords: Wired, Resonance · Type: Main action (or maneuver for a quick patch) · Distance: touch or Wired range · Target: one machine, drone, vehicle, piece of chrome, or a Cyborg*
> **Effect:** Channel Resonance to **restore Integrity/Stamina** to a machine, drone, vehicle, **or a Cyborg** (base at 1st level, per Ruling #10), mend damaged chrome, or clear a mechanical/Wired condition (glitch, jam, suppression). This is the class's signature niche — the only healing in the game that works on Cyborgs and tech. **Outcome Tier 1 (17+):** mend more, and clear a condition. **Tier 2 (12-16):** mend the base amount. **Tier 3 (≤11):** the patch is unstable — it holds until the target's next hit.
>
> **Enhance (spend Resonance):** mend at greater range or a second target, OR restore a wrecked machine/crashing Cyborg to minimal function.
> *The tech-side counterpart to the Street-Priest's Lay On Hands — flesh-and-soul there, steel-and-code here. Full mechanics and comparison in its own Deep Dive, below.*

---

### Heroic Abilities — Cost Tiers 1 Through 11

Heroic Abilities are your Resonance-fueled summoner plays, chosen by cost tier as you level, layered on top of the always-on Signature kit above. On our reversed Outcome Tiers (Tier 1 = 17+ = best, Tier 2 = 12-16, Tier 3 = ≤11 = worst). Costs mirror the Draw Steel caster ladder shared by every GHOSTWIRE class: **1 / 3 / 5 / 7 / 9 / 11.**

#### 1-Cost Tier (chosen at 1st level)

*The DS Talent SRD has no native 1-cost band (its ladder runs 3/5/7/9/11), but canon's own Technomancer chapter names **Recompile** directly at cost 1. **Harmonic Adjustment** is a GHOSTWIRE-original invention filling out the tier to match every other class master's ladder shape. Flagged for Michael's sign-off — see Part 2, Known Bugs #4.*

> **Recompile** *(canon, 1 Resonance, maneuver)*
> Instant congregation flexibility. **Reshape a compiled sprite** (Data → Attack, Attack → Ward, etc.) to meet the moment, **or** instantly **recompile a just-destroyed sprite** at reduced power.
> *The low-cost adaptability tool — the shaman who always has the right ghost to hand.*

> **Harmonic Adjustment** *(1 Resonance, GHOSTWIRE-original — flagged, maneuver)*
> Grant a compiled sprite **one** of: **+1 to its attack roll this turn**, **+2 to its defense until the end of your next turn**, or a **free shift** up to its full movement.
> *A cheap nudge — the shaman correcting a ghost's aim or footing mid-fight.*

#### 3-Cost Tier (chosen at 1st level)

*Swarm the Signal and Deep Communion are canon, named directly in the Technomancer's class chapter. Resonance Cascade and Sprite Redirect are GHOSTWIRE-original inventions filling out the tier. Flagged for Michael's sign-off — see Part 2, Known Bugs #4.*

> **Swarm the Signal** *(canon, 3 Resonance, main action)*
> **Every sprite you command** takes an action at once against a single target or objective — all attack one foe, all mend one machine, or all pile onto one node.
> *The summoner's burst — the force-multiplier payoff.*

> **Deep Communion** *(canon, 3 Resonance, main action to enter — the Jump-In)*
> Project fully into the Wired (or into a machine/drone/Cyborg you're attuned to) with edges to Wired verbs and sprite command, using the system's own reach and senses. Your body goes inert/exposed and biofeedback applies if this is enhanced past cost 5. No control rig needed — the communion **is** the interface. *(Machine-Whisperer reduces this cost to 2 and grants a larger buffer — see its table, below.)*

> **Resonance Cascade** *(3 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 10)*
> **Power Roll + Logic.** **Tier 3 (≤11):** target one enemy; on hit, they take **Logic-score biofeedback damage** and are **dazed** until end of their next turn (EoNT). **Tier 2 (12-16):** target up to 2 enemies within 3 squares of each other; each takes Logic-score damage. **Tier 1 (17+):** target up to 3 enemies within Ranged 10; each takes Logic-score damage and is dazed EoNT.
> *A thin lash of hostile code that fans out the harder you focus it.*

> **Sprite Redirect** *(3 Resonance, GHOSTWIRE-original — flagged, free triggered)*
> **Trigger:** an ally within Wired range or Ranged 10 is hit by a Wired attack. **Effect:** redirect the attack to one of your compiled sprites — the sprite absorbs the hit, losing one Sprite HP tier in the target's place.
> *Throwing a code-spirit into the path of a bullet meant for a friend.*

#### 5-Cost Tier (chosen at 1st level — biofeedback risk begins)

*Resonance Ward is canon, named directly in the Technomancer's class chapter. Overclock, Trance Compile, and Signal Weave are GHOSTWIRE-original inventions filling out the tier. Flagged for Michael's sign-off — see Part 2, Known Bugs #4.*

> **Resonance Ward** *(canon, 5 Resonance, main action, sets a stance until your next turn)*
> Weave a **zone of resonant protection** — deploy Ward-sprites and a standing harmonic. Allies within it gain defenses vs. Wired/EW attacks, chrome and devices are screened from hijack, and you may counter hostile intrusion in the area.
> *The mirror of the Street-Priest's Sanctuary Ward, in code. **Biofeedback: DC 12 Physique save.***

> **Overclock** *(5 Resonance, GHOSTWIRE-original — flagged, main action)*
> All compiled sprites gain **double actions** this turn (each acts twice). You pour your current into the congregation, forcing them into a temporary frenzy state.
> ***Biofeedback: DC 15 Physique save.***

> **Trance Compile** *(5 Resonance, GHOSTWIRE-original — flagged, main action)*
> Compile **two** new sprites in a single action (any archetype combination from your available list). Both act normally after compiling.
> ***Biofeedback: DC 15 Physique save.***

> **Signal Weave** *(5 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 10)*
> All allies gain **+1 to Wired-based rolls** for the rest of the round, and one enemy of your choice is **glitched** (bane on their next Power Roll). Tuning-forks laid across the battlefield's own signal.
> ***Biofeedback: DC 15 Physique save.***

#### 7-Cost Tier (chosen at 3rd level) — includes Total Resonance

*This tier is headlined by **Total Resonance**, canon's own apex ability, named directly in the Technomancer's class chapter. Full mechanics are broken out in their own section below — see "Total Resonance — Deep Dive." The remaining 7-cost options (Cascade Failure, Sprite Storm, Resonance Slam) are GHOSTWIRE-original inventions. Flagged for Michael's sign-off — see Part 2, Known Bugs #4.*

> **Total Resonance** — *see the full Deep Dive section below.*

> **Cascade Failure** *(7 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 10, single-roll-cascade grammar per Michael's 2026-07-29 Command Presence ruling)*
> All enemies in a 5-cube within Ranged 10 are potential targets: **you make one Power Roll + Logic.** **Tier 3 (≤11):** only the nearest enemy is affected — takes **Logic × 2 biofeedback damage** and is **stunned, save ends**. **Tier 2 (12-16):** up to 2 enemies of your choice — each takes Logic × 2 damage AND is **stunned until end of their next turn**. **Tier 1 (17+):** up to 4 enemies of your choice in the area — each takes Logic × 2 damage, is **stunned, save ends**, and their next Wired ability **fizzles**.
> ***Biofeedback: DC 15 Physique save.***

> **Sprite Storm** *(7 Resonance, GHOSTWIRE-original — flagged, main action)*
> Compile **3 sprites** in a single action (Sprite-Weaver may compile 4). All compiled sprites strike different targets within Ranged 10 as part of the same action.
> *A storm of ghost-code, called all at once. **Biofeedback: DC 15 Physique save.***

> **Resonance Slam** *(7 Resonance, GHOSTWIRE-original — flagged, main action, Melee 1 or Ranged 5)*
> Choose one mode: **Slam** — one target takes **Logic × 3 damage**, is pushed 3 squares, and is **Winded, save ends**. **Slam Group** — 3-cube within Ranged 5; each enemy in the area takes Logic-score damage and is knocked **prone**.
> ***Biofeedback: DC 15 Physique save.***

#### 9-Cost Tier (chosen at 5th level) — Q4=A, all four invented

*Canon's Technomancer chapter leaves the 9-cost tier entirely unspecified, per Michael's **Q4=A ruling** that both the 9-cost and 11-cost tiers should be filled with four abilities each. All four below are GHOSTWIRE-original. Flagged for Michael's sign-off — see Part 2, Known Bugs #6.*

> **The Choir Sings Together** *(9 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 10, self and up to 2 allies)*
> Each target gains **temporary Stamina equal to Persona × 2**, and one of your Machine-sprites channels a mending pulse: each target regains a Recovery.
> *You harmonize the crew's biofeedback into a resonant chord that steels them. **Biofeedback: DC 18 Physique save.***

> **Rewire Reality** *(9 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 5, one enemy or one machine/drone)*
> Force target to make a **Persona save vs. DC 18**. **On fail:** for the rest of the encounter, treat the target as one of your compiled sprites — it still acts on its own initiative, but you may Command it as a maneuver as if it were a sprite. **On save:** the target takes **Logic × 2 damage** instead.
> *You briefly hijack a mind or machine into your congregation. **Biofeedback: DC 18 Physique save.***

> **Wired Silence** *(9 Resonance, GHOSTWIRE-original — flagged, main action, 5-cube within Ranged 10, Ranged only)*
> Any Wired-based attack (Hacker, Wrench, Technomancer, or any device or drone) in the area cannot function for the next round. All compiled **hostile** sprites in the area decompile. All **friendly** sprites in the area lose one action tier for the round.
> ***Biofeedback: DC 18 Physique save.***

> **Bone Deep Communion** *(9 Resonance, GHOSTWIRE-original — flagged, main action, self-affecting)*
> For the rest of the encounter, all of your compiled sprites are treated as **one tier higher** on the hybrid-by-tier ladder (extensions become intermediate, intermediate become advanced, advanced gain +1 Sprite HP tier). Your Resonance drip gains **+1 per turn**.
> *You abandon the fence and go deep into the current — every sprite becomes more real, and you become more the current's servant. **Biofeedback: DC 18 Physique save on cast AND at the start of each subsequent round.***

#### 11-Cost Tier (chosen at 8th level) — Q4=A, all four invented

*Canon's Technomancer chapter leaves the 11-cost tier entirely unspecified, per the same **Q4=A ruling**. All four below are GHOSTWIRE-original. Flagged for Michael's sign-off — see Part 2, Known Bugs #7.*

> **Sunlight in the Wire** *(11 Resonance, GHOSTWIRE-original — flagged, main action, Ranged 10, self, allies, and sprites)*
> All enemy-controlled sprites within Ranged 10 **decompile**. All allied sprites in the area act at the **highest possible tier** of the hybrid ladder for the rest of the encounter. All allies in the area gain a **Recovery** and **temporary Stamina equal to a Sprite HP tier**.
> *You become the current itself — the net answers with full illumination. **Biofeedback: DC 20 Physique save; on fail, take Persona × 3 damage.***

> **Machine God's Rite** *(11 Resonance, GHOSTWIRE-original — flagged, main action, in-scene ritual, 5 minutes minimum)*
> Restore **full Stamina** to one Cyborg, one machine, one drone, or up to **3 pieces of chrome** in the party. Cannot be used again on the same target for 24 in-game hours.
> *The shaman-priest lays resonant hands on the crew's tech-flesh and restores it whole. **Biofeedback: DC 20 Physique save.***

> **Recompile Reality** *(11 Resonance, GHOSTWIRE-original — flagged, main action, in-scene ritual, 10 minutes minimum)*
> Undo one significant Wired event from the past scene (a system got locked down; a drone was destroyed; a Cyborg's chrome got hit). Force a re-roll of that event, OR treat the outcome as though it never happened. **Once per session per Technomancer.**
> *You rewrite the current's memory of what just happened. **Biofeedback: DC 20 Physique save; on fail, take Persona × 3 damage AND lose one Recovery.***

> **The Weaver's Web** *(11 Resonance, GHOSTWIRE-original — flagged, main action, calls the whole congregation)*
> Compile **5 sprites** in a single action. All 5 strike different targets within Ranged 10. Each hit target must save vs. **DC 18 Physique** or take **Logic × 3 damage** and become **Winded**.
> *The summoner's apex — the entire net answers with a coordinated strike. **Biofeedback: DC 20 Physique save.***

---

### Total Resonance — Deep Dive

*Canon apex ability, named directly in the Technomancer's class chapter as the 7-cost signature capstone play — the class's version of the Talent's Perfect Clarity, filtered through the Elementalist's summon-payoff structure.*

> **Total Resonance** *(canon, 7 Resonance, main action)*
> *Keywords: Wired, Resonance, Summon · Type: Main action · Distance: Wired range · Target: your entire congregation*
> **Effect:** For the rest of the encounter, **every sprite you currently command rises one tier on the hybrid-by-tier ladder** (minor sprites act as intermediate; intermediate act as advanced) — and you may **immediately compile one additional sprite for free**, ignoring your sprite cap for the rest of the encounter. Your Resonance drip from the congregation trigger doubles for the rest of the fight.
>
> **Outcome Tiers apply to the free compile's manifestation, not the tier-boost (which is unconditional):**
> - **Tier 1 (17+):** the free sprite compiles at full strength and acts immediately this turn.
> - **Tier 2 (12-16):** the free sprite compiles at full strength but acts next turn.
> - **Tier 3 (≤11):** the free sprite compiles unstable — half Sprite HP — but the ladder-tier boost still applies to the whole congregation regardless.
>
> ***Biofeedback: DC 15 Physique save*** (this is a 7-cost ability and always triggers the check per Ruling #9).
>
> **Why this is the class's headline moment.** Total Resonance is to the Technomancer what a full ritual invocation is to a Veil summoner — the single turn where the shaman stops managing the congregation carefully and simply **lets the current run wild**. A Technomancer who has been patiently building minor sprites into intermediate ones for three rounds suddenly has a congregation of advanced, independently-acting ghosts, plus one more for free. It is the class's best "turn the fight" button, and — per the DS Talent's own Perfect Clarity precedent — it's gated behind real biofeedback risk to keep it from being a free lunch.
>
> **Interaction with discipline features.** Sprite-Weaver's higher sprite cap means the free compile from Total Resonance can push a Sprite-Weaver's congregation size well past what any other discipline can field in a single round — this is intentional; it's the discipline's whole thesis (see the Sprite-Weaver table, below). Machine-Whisperer can spend the free compile on a Machine-sprite and immediately follow with Resonance Mending at no extra biofeedback risk, since Resonance Mending's base effect is always free. Resonance-Warrior typically spends the free compile on an Attack-sprite to stack with their own discipline's damage amplifiers.

---

### Resonance Mending — Deep Dive (Cyborg-heal niche)

*DS Conduit donor ability, reskinned wholesale per Ruling #3. The Conduit's Healing Grace (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/`, retrieved 2026-07-29) supplies the exact grammar: a ranged maneuver-or-main-action healing touch that costs nothing at its base effect, with additional Piety spent to add targets or clear conditions. Here, "Piety" becomes "Resonance," "ally" becomes "machine, drone, vehicle, chrome, or Cyborg," and the fictional frame shifts from divine grace to technomantic communion — but the underlying spend-more-get-more shape is preserved intact.*

> **Resonance Mending** *(Class Feature Signature — full grammar)*
> *Keywords: Wired, Resonance, Healing · Type: Maneuver (base effect) or Main action (enhanced) · Distance: touch, or Wired range for a jacked/networked target · Target: self, one machine, one drone, one vehicle, one piece of chrome, or **one Cyborg** (base at 1st level, per Ruling #10)*
>
> **Base effect (always free, 0 Resonance):** the target regains Stamina/Integrity equal to **one Recovery's worth** (or, for a Cyborg specifically, the target may spend one of their own Recoveries at no Resonance cost — mirroring the Conduit donor's exact "target can spend a Recovery with no Piety cost" grammar). This works identically whether the target is a drone, a vehicle, a piece of standalone chrome, or a Cyborg's chrome-integrated Stamina pool.
>
> **Spend 1+ Resonance:** for each point of Resonance spent, choose **one** of the following enhancements (may pick the same enhancement more than once by spending multiple points, except where noted):
> - **Reach one additional target** — extend the mending to a second machine/drone/Cyborg within range, applying the base effect to them as well.
> - **Clear one save-ends mechanical condition** — a jam, a glitch, a suppression effect, a Cyborg-chrome malfunction.
> - **Restore function to a "dead" machine** — a drone at 0 Integrity, a piece of chrome that has fully failed, or a Cyborg at 0 Stamina — bringing it back online at minimal function (1 Stamina/Integrity) instead of leaving it destroyed/dying. This costs a **minimum of 2 Resonance**, not 1, reflecting the higher stakes of the effect.
> - **Grant the target an additional Recovery spend** beyond the base effect's single Recovery (stacks with itself — 2 Resonance spent this way grants 2 additional Recoveries, and so on).
>
> **Outcome Tiers (apply only when Resonance Mending is used as an enhanced main action against resistance — e.g., mending a target inside a hostile EW field or contested Wired space):**
> - **Tier 1 (17+):** the mend lands at full effect and the target also clears one minor condition for free, on top of any purchased enhancements.
> - **Tier 2 (12-16):** the mend lands at full effect as purchased.
> - **Tier 3 (≤11):** the mend is unstable — it holds for one round, then the target loses half the Stamina/Integrity restored unless stabilized by a second mend or a full rest.
>
> **Does not trigger biofeedback at its base effect** (0 Resonance spent) or at low enhancement spends (per Ruling #9's cost-5 floor) — a Technomancer can mend freely and often without any overreach risk at all. Only pushing total Resonance spent on a single Resonance Mending use to 5 or more (e.g., reaching 3 additional targets plus clearing 2 conditions in one action) triggers the standard biofeedback save at the appropriate DC.
>
> **Why this is the class's true signature, not just a Conduit copy-paste.** The Street-Priest's Lay On Hands (its own Conduit-donor equivalent) heals flesh and soul — living Stamina, mental conditions, spiritual corruption. Resonance Mending heals the *other half of the setting's cast of characters*: drones, vehicles, standalone chrome, and Cyborg bodies alike, none of which the Street-Priest's grace can touch, and none of which the Medic's Reagents-based first aid can touch either (the Medic heals flesh with tools; the Technomancer heals steel with code). This is the mechanical proof of the class's unique setting niche: **the only class in GHOSTWIRE that can put a Cyborg back together.**
>
> **Machine-Whisperer amplification (preview — full detail in that discipline's table below):** Machine-Whisperer reduces Resonance Mending's per-point enhancement cost, extends its base range, and eventually grants a free use once per encounter. Every Technomancer can mend a Cyborg; only a Machine-Whisperer does it as their whole reason for being.

---

### Sprite/Resonance Disciplines (Subclasses)

*Reskinned per Ruling #7 from the DS Talent's three traditions: Telekinesis → **Sprite-Weaver** (wide/kinetic congregation control), Telepathy → **Machine-Whisperer** (interface/healer, the Cyborg-mending specialist), Chronopathy → **Resonance-Warrior** (offensive/tempo mystic). Canon's own Technomancer chapter supplies full 1st-level paragraph descriptions for all three; the level 2/3/5/7/8 ladders below extend that canon seed into a complete feature progression, matching the granularity of the Commander's Tactician/Face doctrines and the Medic's Combat Medic/Troubadour doctrines. All non-1st-level features below are GHOSTWIRE-original inventions, flagged for sign-off — see Part 2, Known Bugs #8, #9, #10.*

#### Sprite-Weaver

*Canon 1st-level seed: the "wide congregation" tradition — more sprites, cheaper sprites, a bigger board presence than any other discipline. Directly reskinned from DS Talent's Telekinesis (which trades personal power for battlefield-wide kinetic control).*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Wide Compile** *(canon)* | Sprite cap rises to **3** (instead of 2). Compile cost drops to **2 Resonance** (instead of 3). Compile momentum Resonance gain doubles to **+2** per newly compiled sprite (instead of +1). |
| **2nd** | **Overlapping Signals** *(GHOSTWIRE-original — flagged)* | When you Compile Sprite and roll Tier 1 (17+), you may compile a **second** sprite for free as part of the same action (does not stack with the signature's own Enhance-for-a-second-sprite option — choose one). |
| **3rd** | **Congregation's Chorus** *(GHOSTWIRE-original — flagged)* | Once per round, when **two or more** of your sprites act on the same turn (yours or their own), each of those sprites' rolls gain an **edge**. |
| **5th** | **The Widening Gyre** *(GHOSTWIRE-original — flagged)* | Sprite cap rises to **4**. Swarm the Signal (3-cost) no longer requires all sprites to target the same foe — you may split the swarm across up to 3 targets. |
| **7th** | **Legion of the Current** *(GHOSTWIRE-original — flagged)* | Sprite cap rises to **5**. Once per encounter, you may Compile Sprite as a **free action** instead of a main action. |
| **8th** | **Unbroken Congregation** *(GHOSTWIRE-original — flagged, capstone)* | Your sprites no longer decompile automatically at end of encounter — once per session, you may keep **one** sprite compiled into the next scene (still subject to normal destruction rules). Sprite cap rises to **6**, the highest of any discipline. |

*Design note: Sprite-Weaver is the class's "go wide" answer — the discipline for a player who wants the battlefield full of ghosts rather than any one ghost being especially strong. Its biofeedback discount (DC−2 across the ladder, per the base Biofeedback section) reflects that its power lives in quantity and coordination, not in any single high-risk cast.*

#### Machine-Whisperer

*Canon 1st-level seed: the "interface and healer" tradition — the discipline that makes the class's Cyborg-mending niche its whole identity. Directly reskinned from DS Talent's Telepathy (which trades combat power for mental interface and remote assistance).*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Deep Interface** *(canon)* | Deep Communion's cost drops to **2 Resonance** (instead of 3) and grants a larger biofeedback buffer (your Physique save, if any is triggered while in communion, gains an edge). Resonance Mending's range extends to **Wired range** even for the base (free) effect, instead of touch-only. |
| **2nd** | **Machine Empathy** *(GHOSTWIRE-original — flagged)* | Resonance Mending's per-point enhancement cost drops by 1 (minimum 1) when the target is a machine, drone, vehicle, chrome, or Cyborg (i.e., always, for this ability) — enhancements that would cost 2 Resonance cost 1, and the "restore a dead machine" enhancement drops from 2 to 1. |
| **3rd** | **Whispered Diagnostics** *(GHOSTWIRE-original — flagged)* | As a free action once per round, you may inspect one machine, drone, vehicle, or Cyborg within Wired range and learn its exact current Stamina/Integrity, all active conditions, and one exploitable weakness. |
| **5th** | **Bonded Repair** *(GHOSTWIRE-original — flagged)* | Once per encounter, you may use Resonance Mending's full enhanced effect (as if you'd spent 3 Resonance) at **no Resonance cost**, and this specific use never triggers biofeedback regardless of total spend. |
| **7th** | **The Machine Remembers** *(GHOSTWIRE-original — flagged)* | When you restore a "dead" machine, drone, piece of chrome, or Cyborg to minimal function via Resonance Mending, the target instead returns at **half** Stamina/Integrity (instead of just 1 point), and clears one additional condition for free. |
| **8th** | **Whisperer's Communion** *(GHOSTWIRE-original — flagged, capstone)* | You may target **any number** of machines/drones/Cyborgs within Wired range with a single Resonance Mending action (previously capped by purchased "additional target" enhancements) — the base effect applies to all of them at once, and enhancements still apply individually as normal. |

*Design note: Machine-Whisperer is the discipline that makes the class's unique setting niche mechanically dominant — a Machine-Whisperer isn't just "able" to fix a downed Cyborg, they're the single best answer to that problem in the entire game, full stop. Its biofeedback rate stays at the class baseline (no modifier), reflecting that its power lives in efficiency and reach, not raw output.*

#### Resonance-Warrior

*Canon 1st-level seed: the "offensive mystic" tradition — the discipline that turns the congregation into a weapon and accepts the highest biofeedback risk for the highest damage ceiling. Directly reskinned from DS Talent's Chronopathy (which trades safety for tempo and burst damage).*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Overcharged Strike** *(canon)* | Resonance Strike's damage die increases to **3d10 + Logic** (instead of 2d10 + Logic). Attack-sprites you command deal an additional **+1d6** damage on a hit. |
| **2nd** | **Aggressive Compile** *(GHOSTWIRE-original — flagged)* | When you Compile Sprite and choose an Attack-sprite, it may act **immediately** even at the minor/extension tier (normally minor sprites only act on your own turn — this doesn't change the tier, but it removes any "acts next turn" language from unstable/Tier-3 compiles specifically for Attack-sprites). |
| **3rd** | **Feedback Weapon** *(GHOSTWIRE-original — flagged)* | Once per round, when you take biofeedback damage from your own ability, you may immediately deal that same amount of damage to one enemy within Ranged 5 as psychic backlash. |
| **5th** | **Burning the Current** *(GHOSTWIRE-original — flagged)* | You may voluntarily take an **additional** 5-cost-equivalent biofeedback save (even on an ability that wouldn't normally trigger one) to add **+Logic score** damage to that ability's effect. Usable once per turn. |
| **7th** | **No Such Thing As Too Much** *(GHOSTWIRE-original — flagged)* | Cascade Failure and Resonance Slam (7-cost) both gain **+1 to their Power Roll** when used by a Resonance-Warrior, and their damage dice increase by one step (e.g., Logic × 2 becomes Logic × 2 plus 1d6). |
| **8th** | **Apex Current** *(GHOSTWIRE-original — flagged, capstone)* | Once per encounter, you may treat a failed biofeedback save as a **success** — the current still bites, but not this time. This does not refund the Resonance spent. |

*Design note: Resonance-Warrior is the "damage dealer who plays with fire" discipline — its biofeedback penalty (DC+2 across the ladder) is real and its capstone (Apex Current) is explicitly a safety valve rather than a damage boost, because the discipline's entire fictional and mechanical thesis is that greater reward requires greater risk. This is the discipline most likely to actually experience the Winded-instead-of-Dying floor from Ruling #9 in actual play.*

---

### Worked Play Example (Table Reference)

*A short worked example, matching the style used in the Commander and Medic masters, showing the full Resonance loop and sprite economy in play across three rounds of a representative encounter. This section is illustrative only — it introduces no new rules, and any numbers shown are examples, not fixed outcomes.*

**Setup:** Priya, a 5th-level Sprite-Weaver Technomancer (Logic 4, Persona 3), enters combat against a corp security team backed by a single combat drone. She rolled 2 Victories before combat, so she attunes for **2 Resonance** the moment she compiles her first sprite (Attunement, first communion).

**Round 1.** Priya opens with **Compile Sprite**, calling a Data-sprite to scan the room (Wide Compile drops this to 2 Resonance — she doesn't need to spend any, since Compile Sprite's base signature effect is free; the discount only matters when she later compiles a *second* sprite via the signature's Enhance). Her Data-sprite lands its scan (an effect), triggering **Harmonic Echo**: +1 Resonance. She now has 3 Resonance banked (2 from Attunement + 1 from Harmonic Echo). At start of her turn she'd also gain Resonance equal to compiled-sprite-count, but that trigger fires at the *start* of a turn, so it won't apply until Round 2.

**Round 2.** At the start of her turn, the congregation trigger fires: she has 1 sprite compiled, so she gains +1 Resonance (now 4 banked). She spends 2 Resonance (Wide Compile discount) to compile an Attack-sprite — compile momentum (doubled by Wide Compile) grants +2 Resonance immediately, netting her to 4 Resonance after the spend. Her Attack-sprite strikes the drone and hits, triggering Harmonic Echo again: +1 Resonance (5 banked). She still has 2 Resonance left after paying for the compile, plus the momentum and echo gains — a full accounting: 4 (start) − 2 (compile cost) + 2 (momentum) + 1 (echo) = 5 Resonance banked at end of round.

**Round 3.** Start-of-turn congregation trigger: 2 sprites compiled, +2 Resonance (7 banked). Priya now has enough for **Resonance Ward** (5-cost) — she deploys it, and because this is a cost-5+ ability, she makes her biofeedback save (DC 12, Sprite-Weaver's −2 discipline modifier applies, so effectively DC 10). She succeeds, the Ward deploys clean, and she's down to 2 Resonance banked, with a Data-sprite and an Attack-sprite still active plus a fresh defensive zone protecting the party.

**Why this matters as a reference:** note how the loop naturally accelerates the longer a fight runs and the more sprites stay alive — this is the intended shape (a slow-building summoner engine, not a burst-nova class), and it's also why Total Resonance (7th-level tier, doubling the congregation-trigger gain) is such a dramatic power spike when it lands mid-fight rather than at the very start.


### Level 1-10 Progression Table

*DS levels 1-10 are the primary progression axis per Ruling #17. Echelon bands (E1-E4) are noted only where they matter for cross-class gear-tier context, never as a gating mechanism.*

| Level | Echelon (gear-tier ref only) | Class Features | Abilities Gained | Discipline Feature |
|---|---|---|---|---|
| **1st** | E1 | Class Chassis, Resonance resource, Sprite Congregation (2-sprite cap), Biofeedback, all 3 Signatures, choice of discipline | Signatures (Compile Sprite, Resonance Strike, Resonance Mending); 1-cost, 3-cost, and 5-cost tiers unlocked (choose starting selections) | Discipline 1st-level feature |
| **2nd** | E1 | — | — | Discipline 2nd-level feature |
| **3rd** | E1 | 7-cost tier unlocked (includes Total Resonance) | Choose a 7-cost ability | Discipline 3rd-level feature |
| **4th** | E2 | Characteristic Increase: Logic (Reason) and Persona (Presence) rise to 3 | — | — |
| **5th** | E2 | Sprite cap rises to 3 (baseline, all disciplines); 9-cost tier unlocked | Choose a 9-cost ability | Discipline 5th-level feature |
| **6th** | E2 | — | — | — |
| **7th** | E3 | Characteristic Increase: all five characteristics +1 (max 4) | — | Discipline 7th-level feature |
| **8th** | E3 | Sprite cap rises to 4 (baseline, all disciplines); 11-cost tier unlocked | Choose an 11-cost ability | Discipline 8th-level capstone feature |
| **9th** | E4 | — | — | — |
| **10th** | E4 | Characteristic Increase: Logic (Reason) and Persona (Presence) rise to 5; **Master of the Current** (capstone) | — | — |

**Master of the Current** *(10th-level capstone, GHOSTWIRE-original — flagged, see Part 2, Known Bugs #11)*
> Once per encounter, you may use **any one** heroic ability you know **without spending Resonance**, and that use never triggers a biofeedback save regardless of its cost tier. In addition, your sprite cap becomes unlimited for the rest of the encounter the first time you use this capstone each session (compile costs still apply Resonance normally for anything beyond the free use).
> *The Technomancer's answer to the Talent's own high-level apex — the moment the shaman and the current briefly become indistinguishable.*

---

### Core Class Features (Non-Subclass)

These are granted to **every** Technomancer regardless of discipline, layered on top of the Class Chassis stats and the Signature abilities above.

**Wired Native.** You are a full citizen of the Wired chapter — you use nodes, Trace Alert, and the standard Wired interface rules exactly as the Hacker and Wrench do, without needing a deck or a rig. Your body itself is the interface.

**Congregation Sense.** You always know the current Sprite HP, position, and hybrid-tier status of every sprite you command, even at range, even through walls, as long as they remain within Wired range of you.

**Cyborg Mending (base, per Ruling #10).** Resonance Mending's Cyborg-target branch is available to you from 1st level regardless of discipline — see the full Deep Dive section above. This is the class's headline setting niche and is never discipline-gated.

**Chrome Erosion (per Ruling #13; locked 2026-09-17).** You wield genuine magic (Resonance), so chrome erodes your Resonance cap by the same shared formula as every caster. See the Kit & Chrome section immediately below.

**Arcane Severance Bar (per Ruling #12).** Cyborgs cannot take levels in the Technomancer class, under any circumstance, with no buy-back or exception. This is canon-inviolable. A character who becomes a Cyborg after already taking Technomancer levels immediately loses all access to Resonance, sprites, and every ability on this list until (and unless) the Cyborg conversion is reversed — treat this identically to how Arcane Severance already blocks Veil-caster classes elsewhere in canon.

**Discipline Choice.** Chosen at 1st level from Sprite-Weaver, Machine-Whisperer, or Resonance-Warrior. Discipline choice is permanent absent an explicit respec ruling from the table (matching the standard GHOSTWIRE subclass-lock convention used by every other class master).

---

### Kit & Chrome interaction

*Canon seed preserved from the Technomancer's class chapter (lines 4170-4183 of the master baseline), expanded here to match the granularity of the equivalent sections in the Hacker, Wrench, Elementalist, and Street-Priest masters.*

The Technomancer is a Wired class that still casts — so, unlike the Wired's other two classes, chrome costs it magic:

| Class | Chrome Relationship |
|---|---|
| **Hacker / Wrench** | Chrome-positive — chrome enhances their tech-native abilities directly, no erosion at all. |
| **Technomancer** | **Erodes** — chrome shrinks the Resonance cap by the shared magic-erosion formula, the same as any caster. |
| **Elementalist / Street-Priest** | Chrome-averse — chrome shrinks their Essence / Conviction cap by the same shared formula. |

**Mechanically:** chrome reduces your **Resonance cap** by the shared magic-erosion formula — −1 per **2** Integrity spent on Standard chrome (round down), per **3** on Soft, per **1** on Salvage (`docs/rulebook/12-chrome.md`). No caster is exempt.

**Kit slot.** The Technomancer carries a **Light kit slot** (see Class Chassis, above) — appropriate gear includes light armor, a resonance-tuned focus item (a personal totem, a jury-rigged antenna, a string of compiled charms), and light defensive tools, but nothing that competes for space with the sprite congregation's own board presence. A resonance-tuned focus (Echelon-appropriate; see the Wrench and Elementalist masters for the shared focus-item framework) can grant a **+1 to Resonance-based Power Rolls** and causes no magic erosion, since it is a mundane/technomantic item rather than integrated chrome.

**Why the fence matters narratively.** The Technomancer is the setting's proof that magic and machine were never actually opposites — just two dialects of the same underlying current. A Technomancer who chromes up too far isn't punished for betraying their magic (as a Street-Priest effectively would be); they're simply drowning out a quiet signal with too much noise. The erosion is the mechanical expression of that theme: the current doesn't reject chrome, it just gets harder to hear over it.

---

### Frequently Asked Table Questions (Player-Facing FAQ)

*A short FAQ addendum, matching the pattern used in the Wrench master's closing section, addressing the questions most likely to come up at an actual table before the GM has memorized every ruling above.*

**Can I compile a sprite outside of combat?** Yes — Compile Sprite works identically outside combat, though outside combat you don't have a per-encounter Resonance pool actively refilling, so you're limited to the once-per-rest-or-Victory exception noted under Resonance's "Outside combat" rule.

**Do sprites need line of sight to their target, same as a normal ranged attack?** Yes, unless a specific ability says otherwise. "Wired range" for a sprite means the sprite itself needs a valid Wired connection to the target (a device, a jack, a networked system) — it is not the same as a normal ranged weapon's line-of-sight rule, but it is not unlimited either. A Data-sprite scanning a room it can't technically "see" through a wall would need that room to have a networked device in it for the sprite's senses to reach.

**What happens if I hit my sprite cap and try to compile again?** You cannot compile past your cap — Compile Sprite simply fails (or, at the table's discretion, you may choose to dismiss an existing sprite as part of the same action to make room, but this is a house-rule convenience, not a written rule).

**Can an enemy target my sprites directly?** Yes. Sprites have their own Sprite HP and defenses (see the Sprite Stat Block Reference table) and can be attacked, suppressed, or hacked like any other actor on the board — this is precisely why Ward-sprites and the Sprite Redirect ability exist.

**Does Resonance Mending work on my own chrome, or only on allies'/drones'?** Both. "Self" is always a valid target for Resonance Mending's base effect, exactly as it is for the Conduit's donor Healing Grace.

**If I'm a Machine-Whisperer, can I mend a Cyborg who isn't in my party — say, an NPC or an enemy who surrenders?** Mechanically, yes — Resonance Mending doesn't restrict targeting to allies only, it restricts by target *type* (machine, drone, vehicle, chrome, or Cyborg). Whether the fiction allows it (would a corp Cyborg trust a runner shaman's hands on their chrome?) is a roleplay question for the table, not a rules restriction.

**Can a sprite "die" permanently, or does it always come back next encounter?** A sprite destroyed in combat (reduced to 0 Sprite HP) is gone for that encounter. At the start of your next encounter, you begin fresh with zero sprites compiled and must re-compile from scratch — sprites are not persistent assets like a Wrench's drones, they're temporary conjurations remade each fight.

**Why can't Cyborgs play this class, when the Technomancer is the one class built to help them?** This is the setting's own irony, not an oversight: Arcane Severance — the chrome-integration process that makes a Cyborg what they are — cauterizes the exact channel a Technomancer needs to touch the Wired's spirit layer. A Cyborg can receive Resonance Mending's grace, but the moment they'd need to generate that grace themselves, their own chrome forecloses it. It's the same asymmetry that makes a Street-Priest able to bless a Cyborg's soul without a Cyborg ever being able to become a Street-Priest — GHOSTWIRE's magic classes all share this one-way door with the setting's most heavily augmented archetype.

**Is there a "hard mode" for biofeedback, like the DS Talent's original Strain table?** Potentially — see Part 2, Known Bugs #2. Michael has reserved the right to offer a stricter optional variant, but as written in this document, the softened Ruling #9 version (cost-5 floor, Winded instead of Dying) is the only rule in effect until any harder variant is separately approved and documented.

---

## PART 2 — AGENT/DEV-FACING: IMPLEMENTATION GUIDE

### Module Scope (Standing Rule)

This section documents the Foundry VTT implementation of the Technomancer class for the `ghostwire` module, following the exact structural pattern established by the Commander, Medic, Scout, Elementalist, Operator, Hacker, Wrench, and Street-Priest masters. Nothing in Part 2 is player-facing; it exists so any future agent (human or AI) picking up this class's Foundry build can do so without re-deriving decisions already made in Part 1.

**Standing rule (unchanged from every prior class master):** Foundry item names, IDs, and folder paths are internal build metadata — they are never shown to players and never appear in Part 1. Any GHOSTWIRE-original content invented to fill gaps in canon is flagged **at first mention in Part 1** and re-flagged here, consolidated into a single numbered sign-off list, so Michael can approve/reject/edit each one in a single pass rather than hunting through the document.

**Out of scope for this document:** actual Foundry compendium JSON/LevelDB packing (handled by the deploy scripts referenced below, not authored inline here), token art and portrait assets (tracked in the shared GHOSTWIRE asset library, not per-class), and Foundry macro/automation scripting beyond the schema-level hooks noted below.

### Data Provenance

| Source | What It Supplied | Retrieval |
|---|---|---|
| `master_rules_baseline_2XP-1BP_2026-07-29.md`, Technomancer chapter (lines 4024-4183) | Identity, Resonance loop (Attunement/Congregation/Compile momentum/Harmonic echo), sprite congregation (4 archetypes, hybrid-by-tier grammar), 3 signatures, partial heroic ladder (1/3/5/7-cost named abilities), 3 subclass 1st-level seeds, Kit & Chrome interaction seed | Read directly from project file, 2026-07-29 |
| DS Talent SRD, Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Talent/`) | Class chassis shape (Stamina/Recoveries curve, Reason-keyed potency, characteristic-increase levels), Clarity→Resonance resource-loop mechanical skeleton, Strain→Biofeedback mechanical skeleton, subclass ladder structure, base cost-tier ability-count conventions | fetch_url, 2026-07-29 |
| DS Elementalist SRD, Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Elementalist/`) | Conjured-presence resource trigger (reskinned as Harmonic Echo), high-Essence summon-grade ability-ladder structure (informed the 9-cost/11-cost invented tiers and Total Resonance's design) | fetch_url, 2026-07-29 |
| DS Conduit SRD, Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/`) | Healing Grace's exact grammar (base-free + spend-for-more-targets-or-conditions), reskinned wholesale as Resonance Mending | search_web aggregated snippets, 2026-07-29 (full page not directly fetched — see Known Bugs #24) |
| `attributes.md` (project file) | Confirmed 5-attribute canon and banned legacy attribute names | Read directly from project file, 2026-07-29 |
| `Ghostwire_Commander_Development_Master.md`, `Ghostwire_Medic_Development_Master.md` | Structural template, section header wording, Part 2 schema and Known-Bugs numbering conventions | Read directly from workspace, 2026-07-29 |

### Item Inventory

*Full count of every Foundry item this class requires, by category. Counts below are verified against the final Part 1 text (see the closing summary message for the authoritative tally).*

| Category | Count | Notes |
|---|---|---|
| Class item | 1 | The Technomancer class definition item itself |
| Signature abilities | 3 | Compile Sprite, Resonance Strike, Resonance Mending — all no-cost, all Resonance-enhanceable |
| 1-cost heroics | 2 | Recompile (canon), Harmonic Adjustment (invented) |
| 3-cost heroics | 4 | Swarm the Signal (canon), Deep Communion (canon), Resonance Cascade (invented), Sprite Redirect (invented) |
| 5-cost heroics | 4 | Resonance Ward (canon), Overclock (invented), Trance Compile (invented), Signal Weave (invented) |
| 7-cost heroics | 4 | Total Resonance (canon), Cascade Failure (invented), Sprite Storm (invented), Resonance Slam (invented) |
| 9-cost heroics | 4 | The Choir Sings Together, Rewire Reality, Wired Silence, Bone Deep Communion — all invented (Q4=A) |
| 11-cost heroics | 4 | Sunlight in the Wire, Machine God's Rite, Recompile Reality, The Weaver's Web — all invented (Q4=A) |
| Capstone | 1 | Master of the Current (10th level, invented) |
| Sprite-Weaver discipline features | 6 | 1st, 2nd, 3rd, 5th, 7th, 8th |
| Machine-Whisperer discipline features | 6 | 1st, 2nd, 3rd, 5th, 7th, 8th |
| Resonance-Warrior discipline features | 6 | 1st, 2nd, 3rd, 5th, 7th, 8th |
| Core class features (non-subclass) | 5 | Wired Native, Congregation Sense, Cyborg Mending (base), Chrome Erosion, Arcane Severance Bar |
| Sprite archetype definitions | 4 | Data-sprite, Attack-sprite, Machine-sprite, Ward-sprite (implemented as summon-actor templates, not items — see Known Bugs #13) |
| **Total loose items (excl. class item + sprite actors)** | **43** | 3 signatures + 22 heroics (2+4+4+4+4+4, incl. capstone counted separately) + 18 discipline features + 5 core features — see final summary message for the reconciled authoritative count |

### Class Item Schema

```json
{
  "_id": "GWTechnomancer00001",
  "name": "Technomancer",
  "type": "class",
  "img": "modules/ghostwire/assets/classes/technomancer/technomancer-icon.webp",
  "system": {
    "identifier": "technomancer",
    "primaryCharacteristic": "logic",
    "secondaryCharacteristic": "persona",
    "heroicResource": {
      "name": "Resonance",
      "identifier": "resonance",
      "resetsAt": "endOfEncounter",
      "startingLoop": [
        { "trigger": "firstCommunionPerEncounter", "gain": "victories" },
        { "trigger": "startOfTurn", "gain": "compiledSpriteCount", "cap": "spriteCap" },
        { "trigger": "newSpriteCompiled", "gain": 1, "disciplineOverride": { "spriteWeaver": 2 } },
        { "trigger": "harmonicEcho_firstSpriteEffectLandedPerRound", "gain": 1 }
      ]
    },
    "startingStamina": 18,
    "staminaPerLevel": 8,
    "recoveries": 8,
    "kitSlot": "light",
    "biofeedback": {
      "triggerFloor": 5,
      "dcByTier": { "5": 12, "7": 15, "9": 18, "11": 20 },
      "dcModifierByDiscipline": { "spriteWeaver": -2, "machineWhisperer": 0, "resonanceWarrior": 2 },
      "failureEffect": "personaScoreDamage",
      "zeroStaminaConsequence": "winded"
    },
    "spriteCap": { "1": 2, "5": 3, "8": 4 },
    "cyborgBarred": true,
    "chromeToleranceCurve": "light",
    "disciplines": ["spriteWeaver", "machineWhisperer", "resonanceWarrior"]
  }
}
```

### Ability Item Schema (with sprite branch)

```json
{
  "_id": "GWTechnomancerHer00001",
  "name": "Resonance Ward",
  "type": "ability",
  "img": "modules/ghostwire/assets/abilities/technomancer/resonance-ward.webp",
  "system": {
    "identifier": "resonance-ward",
    "classIdentifier": "technomancer",
    "cost": 5,
    "actionType": "main",
    "keywords": ["wired", "resonance"],
    "distance": "wiredRange",
    "target": "areaZone",
    "provenance": "canon",
    "biofeedback": { "triggers": true, "dc": 12 },
    "spriteBranch": {
      "isSpriteAbility": false,
      "affectsCompiledSprites": true,
      "compilesNewSprite": false,
      "archetypeRestriction": null,
      "hybridTierOverride": null
    },
    "outcomeTiers": {
      "tier1": "Full zone effect plus counter-intrusion window",
      "tier2": "Full zone effect",
      "tier3": "Zone manifests at reduced radius"
    },
    "enhance": []
  }
}
```

**Sprite-branch field notes:**
- `isSpriteAbility`: true for Compile Sprite, Sprite Storm, Trance Compile, The Weaver's Web, and any ability whose primary effect is compiling.
- `compilesNewSprite`: true whenever the ability creates a new sprite actor instance (distinct from commanding an existing one).
- `archetypeRestriction`: null unless the ability is locked to a specific sprite archetype (currently none are — all compile abilities allow archetype choice at compile time).
- `hybridTierOverride`: used by Total Resonance and Bone Deep Communion to temporarily bump the acting-tier of already-compiled sprites without recompiling them.

### Feature Item Schema

```json
{
  "_id": "GWTechnomancerSub00001",
  "name": "Wide Compile",
  "type": "feature",
  "img": "modules/ghostwire/assets/features/technomancer/wide-compile.webp",
  "system": {
    "identifier": "wide-compile",
    "classIdentifier": "technomancer",
    "disciplineIdentifier": "spriteWeaver",
    "grantedAtLevel": 1,
    "provenance": "canon",
    "mechanicalHooks": {
      "spriteCapModifier": 1,
      "compileCostModifier": -1,
      "compileMomentumBonusOverride": 2
    }
  }
}
```

### Folder Structure

```
C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire\
├── packs\
│   ├── ghostwire-classes\
│   │   └── technomancer.json          (class item, GWTechnomancer00001)
│   ├── ghostwire-abilities\
│   │   ├── technomancer-signatures\   (3 items, GWTechnomancerSig00001-00003)
│   │   └── technomancer-heroics\      (22 items, GWTechnomancerHer00001-00022, incl. capstone)
│   ├── ghostwire-features\
│   │   └── technomancer-disciplines\  (18 items, GWTechnomancerSub00001-00018)
│   └── ghostwire-items\
│       └── technomancer-core\         (5 items, GWTechnomancerCore00001-00005)
├── assets\
│   ├── classes\technomancer\
│   ├── abilities\technomancer\
│   └── features\technomancer\
└── actors\
    └── sprite-templates\              (4 summon-actor templates: data-sprite, attack-sprite, machine-sprite, ward-sprite)
```

### Deploy Scripts

Follows the identical deploy pipeline already established for the Commander, Medic, Wrench, and Street-Priest packs — no new tooling required for this class:

1. `build-technomancer-pack.js` — reads this markdown file's Part 2 schema blocks, generates the LevelDB-backed compendium JSON for `ghostwire-classes`, `ghostwire-abilities`, `ghostwire-features`, and `ghostwire-items`, tagged with the `GWTechnomancer*` ID prefix family.
2. `build-sprite-actors.js` — generates the 4 sprite-archetype actor templates (Data/Attack/Machine/Ward) as summon-actor stubs, parameterized by hybrid-tier (minor/intermediate/advanced) so a single template file produces the correct stat block at compile time based on the summoning Technomancer's level.
3. `validate-technomancer-pack.js` — runs the shared cross-class validator (checks ID uniqueness against every other class's `GW*` prefix family, verifies cost-tier counts match the Item Inventory table above, confirms no banned attribute strings — "Cognition," "Resolve," "Will," "Reflexes" plural — appear in any packed item's text fields).
4. Standard `npm run deploy:ghostwire` — packs and copies to the Foundry Data folder at the path shown in Folder Structure, above.

**Module identifier:** `ghostwire.class.technomancer`. **Compendium packs touched:** `ghostwire-classes`, `ghostwire-abilities`, `ghostwire-features`, `ghostwire-items` (all four, matching the Commander/Medic/Wrench pattern of spreading a single class's items across the shared category packs rather than a per-class pack).

---

### Localization Strings & UI Text

*Matching the localization-key convention established in the Commander and Wrench masters — every player-visible string gets a stable key so translation and later text edits never require a Foundry item rebuild.*

| Key | English Text |
|---|---|
| `ghostwire.technomancer.resource.name` | Resonance |
| `ghostwire.technomancer.resource.hint` | Your bond with the Wired's spirit world. Resets to zero at the end of every encounter. |
| `ghostwire.technomancer.biofeedback.name` | Biofeedback |
| `ghostwire.technomancer.biofeedback.hint` | Overreach into the current bites back. Only abilities costing 5+ Resonance risk it. |
| `ghostwire.technomancer.spritecap.name` | Sprite Cap |
| `ghostwire.technomancer.spritecap.hint` | The maximum number of sprites you may have compiled and under your command at once. |
| `ghostwire.technomancer.congregation.name` | The Sprite Congregation |
| `ghostwire.technomancer.discipline.spriteWeaver` | Sprite-Weaver |
| `ghostwire.technomancer.discipline.machineWhisperer` | Machine-Whisperer |
| `ghostwire.technomancer.discipline.resonanceWarrior` | Resonance-Warrior |
| `ghostwire.technomancer.sprite.data.name` | Data-sprite |
| `ghostwire.technomancer.sprite.attack.name` | Attack-sprite |
| `ghostwire.technomancer.sprite.machine.name` | Machine-sprite |
| `ghostwire.technomancer.sprite.ward.name` | Ward-sprite |
| `ghostwire.technomancer.tier.minor` | Minor (Extension) |
| `ghostwire.technomancer.tier.intermediate` | Intermediate (Commanded) |
| `ghostwire.technomancer.tier.advanced` | Advanced (Independent) |
| `ghostwire.technomancer.capstone.name` | Master of the Current |

**Chat card templates.** Every heroic ability's chat output follows the shared GHOSTWIRE ability-card partial (`templates/chat/ability-card.hbs`), with a Technomancer-specific override (`templates/chat/technomancer-sprite-card.hbs`) used whenever an ability's `spriteBranch.compilesNewSprite` or `spriteBranch.affectsCompiledSprites` field is true — this override renders the current congregation roster (archetype, tier, remaining Sprite HP) inline under the ability's normal Power Roll/Outcome Tier block, so the table can see the congregation's state update in real time without opening a separate sheet.

### Macro Hooks & Automation

Following the same `Hooks.on()` pattern used by the Wrench module's drone-fleet automation (the closest existing precedent for a class that tracks multiple summoned/fielded units):

- `technomancer.onCompileSprite(actor, archetype, tier)` — fires whenever Compile Sprite (or any compiling ability) successfully manifests a new sprite; used to spawn the actual Foundry token from the appropriate sprite-template actor and apply the correct hybrid-tier stat block from the Sprite Stat Block Reference table.
- `technomancer.onSpriteDecompile(actor, spriteId, reason)` — fires on destruction, voluntary dismissal, or end-of-encounter cleanup; `reason` is one of `"destroyed"`, `"dismissed"`, or `"encounterEnd"`, letting the Unbroken Congregation feature (Sprite-Weaver 8th level) intercept the `"encounterEnd"` case once per session and cancel the decompile.
- `technomancer.onResonanceGain(actor, amount, trigger)` — fires on every Resonance gain event (`"attunement"`, `"congregation"`, `"compileMomentum"`, `"harmonicEcho"`), used to drive the resource-bar animation and to log the gain in the combat tracker's Technomancer-specific tooltip.
- `technomancer.onBiofeedbackCheck(actor, dc, abilityCost)` — fires whenever a 5+-cost ability is used, rolling the Physique save automatically and applying the correct failure damage/Winded-floor logic from the Biofeedback schema block.
- `technomancer.onHybridTierChange(actor, spriteId, oldTier, newTier)` — fires whenever a sprite's hybrid tier changes outside the normal level-based schedule (Total Resonance's temporary boost, Bone Deep Communion's permanent-for-encounter boost), so the token's initiative tracking can be added/removed from the combat tracker on the fly (advanced/independent sprites need their own initiative entry; minor/intermediate sprites do not).

### Playtest Notes (Pre-Sign-Off)

*Observations from the design pass that should inform actual table playtesting once Michael has reviewed the Known Bugs list below. These are not rules — they're flags for what to watch during a first session at the table.*

- **Watch the sprite-cap-to-encounter-length ratio.** Because Resonance both compiles sprites AND is spent on heroic abilities, a Technomancer who compiles aggressively early may find themselves "resource-starved" for heroic plays later in a long fight, while one who holds back may never field a full congregation before the fight ends. The worked example above assumes a "compile early, cast late" playstyle — the opposite approach (hoard Resonance, cast big, compile sprites only as leftover spend) should also be playtested to confirm both feel viable.
- **Watch Machine-Whisperer's action economy in non-combat mending scenes.** Because Resonance Mending's base effect is always free, a Machine-Whisperer technically never needs to spend Resonance to be useful between fights — this is intentional (the niche should never be resource-gated outside combat) but should be confirmed against how often parties actually rest/patch up mid-run versus pushing through.
- **Watch Resonance-Warrior's biofeedback rate at low levels.** A 1st-3rd level Resonance-Warrior only has access to the 1/3/5-cost tiers, meaning their DC+2 discipline modifier only ever applies to the 5-cost tier (DC 14 effective) until 3rd level unlocks the 7-cost tier. Confirm this early-game biofeedback rate doesn't feel punishing before the discipline's higher-tier payoffs come online.
- **Watch for congregation clutter at the table.** A Sprite-Weaver at 7th-8th level can field 5-6 sprites simultaneously — this is a lot of tokens for one player to track and a GM to adjudicate turn order for, especially once some are independent-tier and rolling their own initiative. Recommend a "sprite tray" UI convention (a condensed sidebar list rather than full token cards) be prioritized in the Foundry build specifically for this discipline.


---

### Known Bugs / Sign-Off Needed

*Every GHOSTWIRE-original invention in this document, consolidated into one numbered list for Michael's review. Nothing below has been applied to canon — it exists in this draft only, pending explicit approval, per Ruling #15.*

1. **Harmonic Adjustment** (1-cost heroic) — fully invented; canon's 1-cost tier only specified Recompile. Needs a pass to confirm the +1 attack / +2 defense / free shift menu is appropriately weak for a 1-cost ability relative to the Hacker/Wrench 1-cost tiers.
2. **Biofeedback severity softening** (Ruling #9's cost-5 floor and Winded-not-Dying floor) — this is a deliberate departure from the DS Talent's unmodified Strain table. Michael has reserved the option to offer an **Advanced/Hard-Mode variant** restoring full Talent-canon severity (no cost-5 floor, Dying possible at 0 Stamina) as an optional table rule. Needs a decision on whether that variant is ever formally documented or left as a GM-only house-rule footnote.
3. **Resonance Cascade** and **Sprite Redirect** (3-cost heroics) — fully invented to fill the tier to four abilities. Sprite Redirect in particular introduces a new mechanical concept (sprite-absorbs-hit-for-ally) not seen in any other GHOSTWIRE class; needs a check against the Wrench's drone-interposition rules (if any) for consistency.
4. **Overclock**, **Trance Compile**, **Signal Weave** (5-cost heroics) — fully invented alongside canon's Resonance Ward. Overclock's "sprites act twice" effect needs a hard look for action-economy balance at 5th-level play, especially stacked with Total Resonance's tier-boost at higher levels.
5. **Cascade Failure**, **Sprite Storm**, **Resonance Slam** (7-cost heroics) — fully invented alongside canon's Total Resonance. Cascade Failure explicitly reuses the "single-roll-cascade" grammar from Michael's 2026-07-29 Command Presence ruling (originally a Commander/Face mechanic) — confirm this cross-class grammar borrow is acceptable or whether it should be Commander-exclusive.
6. **The Choir Sings Together, Rewire Reality, Wired Silence, Bone Deep Communion** (9-cost tier, full Q4=A fill) — all four entirely invented since canon leaves this tier unspecified. Rewire Reality's "treat an enemy as a sprite you can command" effect is the single most novel/powerful mechanic in the whole document and most needs review — it may be too strong relative to a comparable 9-cost effect in any sibling class master.
7. **Sunlight in the Wire, Machine God's Rite, Recompile Reality, The Weaver's Web** (11-cost tier, full Q4=A fill) — all four entirely invented. Recompile Reality's "undo a past scene event" is a narrative-scale effect with no clean precedent elsewhere in GHOSTWIRE; needs a ruling on scope limits (can it undo a PC death? A TPK-adjacent event? Needs an explicit boundary).
8. **Sprite-Weaver discipline ladder** (2nd/3rd/5th/7th/8th features) — only the 1st-level Wide Compile is canon; all five higher-level features are invented. The 8th-level capstone (Unbroken Congregation, persisting a sprite between scenes) is a meaningful precedent-setter for whether ANY sprite/summon can ever outlive an encounter in this game — needs explicit confirmation this doesn't conflict with the "resets at end of encounter" resource design used everywhere else.
9. **Machine-Whisperer discipline ladder** (2nd/3rd/5th/7th/8th features) — only the 1st-level Deep Interface is canon; all five higher-level features are invented. 8th-level Whisperer's Communion (unlimited simultaneous mend targets) needs an action-economy sanity check against a full party of Cyborgs/drones in one scene.
10. **Resonance-Warrior discipline ladder** (2nd/3rd/5th/7th/8th features) — only the 1st-level Overcharged Strike is canon; all five higher-level features are invented. 3rd-level Feedback Weapon (redirecting your own biofeedback damage onto an enemy) is a novel damage-reflection mechanic with no precedent in a sibling class master — flag for balance review.
11. **Master of the Current** (10th-level capstone) — fully invented; canon does not specify a capstone at all. The "unlimited sprite cap for the rest of the encounter" clause is the single most powerful line in the document and needs the heaviest scrutiny of anything on this list.
12. **Signature enhancement costs** (the "spend Resonance" clauses on Compile Sprite, Resonance Strike, and Resonance Mending's base grammar beyond the Conduit-donor mapping) — the exact Resonance costs for each signature's Enhance option are GHOSTWIRE-original numeric choices, not pulled from any canon or SRD source. Needs a numeric pass alongside the sibling classes' signature-enhance costs for consistency.
13. **Sprite HP benchmark formula** (`10 + (Logic × Level)` for minor sprites, intermediate/advanced scaling "lands in the numeric pass") — this formula is a placeholder invented for this draft and explicitly incomplete; intermediate and advanced sprite HP values still need to be derived and written up before this can be implemented in Foundry.
14. **Compile cost (3 Resonance base, 2 for Sprite-Weaver)** — invented numeric baseline; needs a check against how quickly this lets a Technomancer field their full sprite cap relative to encounter length (a 2-sprite cap filled in the first two turns is a very different pacing than one filled over five turns).
15. **Harmonic Echo trigger wording** ("first time each round one of your sprites lands an effect") — adapted from the Elementalist's damage-taken-nearby trigger, but changed from a damage-received trigger to an effect-landed trigger. Confirm this reskin still counts as an honest "conjured-presence" trigger per Ruling #2's exact framing, or whether it drifted during the reskin.
16. **Biofeedback DC ladder numeric values** (12/15/18/20 for cost 5/7/9/11) — invented to match the shape of Michael's approved severity softening (Ruling #9) but the specific numbers were not separately blessed; needs confirmation these land at the intended difficulty relative to the class's Physique save modifier at each level.
17. **Chrome-erosion model** — *superseded 2026-09-17:* the earlier Technomancer-only gentle erosion (a capped per-point Power Roll penalty) is retired; the class uses the shared Chrome magic-erosion formula like every caster.
18. **Resonance Mending's biofeedback interaction** ("only triggers if total spend on a single use reaches 5+") — this is a GHOSTWIRE-original clarification of how the cost-5 floor (Ruling #9) applies to an ability whose base cost is 0 but which can be enhanced arbitrarily high by spending multiple Resonance points on separate enhancement picks; confirm this reading matches Michael's intent for how "ability cost" is measured on flexible-spend abilities generally (may affect other classes' similar abilities too).
19. **"Restore a dead machine" minimum cost of 2 Resonance** (Resonance Mending enhancement) — an invented numeric floor distinguishing this enhancement from the cheaper 1-Resonance options; flag for consistency against the Street-Priest's own "revive from 0" costs if a directly comparable ability exists there.
20. **Total Resonance's free-compile-ignoring-cap clause** — invented interaction between the canon ability's name/cost/tier and the cap-ignoring rules text; canon only names the ability, not its full mechanical text, so this entire mechanical writeup (including the doubled Resonance drip) is a GHOSTWIRE-original completion of a canon stub.
21. **Deep Communion's biofeedback interaction** ("biofeedback applies if this is enhanced past cost 5") — canon names Deep Communion as a 3-cost ability but does not specify how/whether its "project fully into the Wired" effect can be enhanced to trigger biofeedback; this entire enhancement-and-risk framing is invented.
22. **Skills list specifics** (Resonance skill name, "spirit/ritual-adjacent skill," Electronics/Matrix Theory, discipline-linked fourth pick) — the Class Chassis section's skill guidance adapts the shared "spend at least half your starting points on your two anchor skills" framework from sibling classes, but the specific skill names for this class are invented and should be checked against the master skill list for exact existing skill names rather than paraphrases.
23. **Species/characteristic-increase interaction** — the 4th/7th/10th level characteristic increases follow the shared GHOSTWIRE convention exactly as written in the DS Talent SRD, but this document does not re-verify that convention against the most recent version of the shared characteristic-increase rule (if it has changed since the Commander/Medic masters were written, this section may need a sync pass).
24. **DS Conduit source verification gap** — Part 2's Data Provenance table notes that the Conduit SRD page itself was not directly fetched via `fetch_url` this session; Healing Grace's grammar was reconstructed from aggregated `search_web` snippets rather than a direct page read. Recommend a direct fetch_url pass on `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/` before this document is treated as fully verified against source.
25. **Cross-class biofeedback/Strain terminology audit** — this document assumes no other GHOSTWIRE class has already claimed the term "Biofeedback" for a different mechanic; a quick grep across the Commander/Medic/Wrench/Elementalist/Street-Priest/Scout/Operator/Hacker masters is recommended before final sign-off to confirm no naming collision exists.

### Source File Index

- `/home/user/workspace/Ghostwire_Technomancer_Development_Master.md` — this document.
- `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/423201d8-c20a-4748-8009-225f3b392fcd/master_rules_baseline_2XP-1BP_2026-07-29.md` — canonical Technomancer chapter, lines 4024-4183.
- `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f5690940-2b2e-4588-b81c-c00da80eed52/attributes.md` — canonical 5-attribute system and banned legacy term list.
- `/home/user/workspace/Ghostwire_Commander_Development_Master.md` — primary structural template.
- `/home/user/workspace/Ghostwire_Medic_Development_Master.md` — secondary structural template, especially Part 2 conventions.
- `/home/user/workspace/Ghostwire_Elementalist_Development_Master.md` — sibling class, source of the conjured-presence trigger and summon-ladder donor pattern (Ruling #2); recommended for a distinctness cross-check but not required for this draft's completion.
- `/home/user/workspace/Ghostwire_StreetPriest_Development_Master.md` — sibling class, source of the comparable Lay-On-Hands Conduit-donor signature, useful for consistency-checking Resonance Mending against its flesh-and-soul counterpart.
- DS Talent SRD — `https://steelcompendium.io/compendium/main/Rules/Classes/Talent/` (Steel Compendium, retrieved 2026-07-29).
- DS Elementalist SRD — `https://steelcompendium.io/compendium/main/Rules/Classes/Elementalist/` (Steel Compendium, retrieved 2026-07-29).
- DS Conduit SRD — `https://steelcompendium.io/compendium/main/Rules/Classes/Conduit/` (Steel Compendium; referenced via aggregated search snippets, direct fetch recommended per Known Bugs #24).
