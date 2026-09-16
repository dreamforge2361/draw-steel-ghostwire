# GHOSTWIRE_COMMANDER_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Commander/Face class as of 2026-07-29 (v1 full design). All future Commander/Face-class design, rules, and Foundry-implementation work — across every session — must reference and update THIS file, and only this file. Do not create new Commander/Face-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and the Scout / Elementalist / Operator / Hacker / Wrench / Street Priest / Medic masters are treated for those classes.*

*Last updated: 2026-07-29 (v1). Ground truth for Part 1 is (a) the DS Tactician class SRD mechanical spine (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Tactician/`, retrieved 2026-07-29) reskinned into GHOSTWIRE, layered against (b) the full Commander/Face canon chapter extracted from `master_rules_baseline_2XP-1BP_2026-07-29.md` (the "Class: The Commander / Face" chapter, added 2026-07-15), and (c) `/home/user/workspace/commander_tactician_reference.md`, the full Tactician-to-Face reskin mapping with all of Michael's Q1-Q5 rulings pre-applied. Attribute names follow the locked GHOSTWIRE convention: display label first, real DS attribute in parentheses — e.g. **Persona (Presence)**, **Instinct (Intuition)**.*

> **Attribute canon note:** GHOSTWIRE uses five characteristics. Display labels match Foundry with the Draw Steel attribute in parentheses: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. This document uses **Persona (Presence)** as the Commander/Face's primary attribute and **Instinct (Intuition)** as secondary, per Michael's 2026-07-15 ruling. Reflex is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear in current GHOSTWIRE canon.

**Older Commander/Face source docs** (the master baseline's full class chapter and the Edgerunner setting-term chapter that follows it) supplied canonical structure for identity, the resource shape (Influence), the subclass triad, and the four signature abilities (Direct Ally, Mark, Read the Room, The Right Word). All of that content is preserved and reskinned below onto the DS Tactician's mechanical chassis, per Michael's Q1-Q5 rulings of 2026-07-29 (see below). **One doctrine change is made here that supersedes the canon chapter outright — see Design Ruling #6 and Part 2, Known Bugs #1.**

## Design Rulings (LOCKED — Michael's approvals, 2026-07-15 through 2026-07-29)

1. **Class chassis: DS Tactician.** The Commander/Face's mechanical spine is the DS Tactician — a command-and-coordinate engine built around a per-turn resource drip, a Mark mechanic, and a Tactical Doctrine (subclass) ladder. This is Michael's own baseline chapter's declared benchmark, carried through wholesale.
2. **Primary attribute: Persona (Presence)** — command, charm, awe, performance. Every command effect, every Right Word, every Turn the Tide scales off Persona.
3. **Secondary attribute: Instinct (Intuition)** — reading people, tells, the room. Read the Room and every Influence-generation trigger tied to *understanding* people scales off Instinct.
4. **Heroic Resource: Influence** — per-encounter, resets at end of encounter (**Q1 = A ruling** — matches canon Tactician Focus loop exactly, not a banked cross-run reserve).
5. **Three subclasses: Street-Fixer / Corp-Exec / Bard** — reskinned respectively from the Tactician's Insurgent / Mastermind / Vanguard Tactical Doctrines.
6. **BARD IS FULLY MUNDANE (Q3 ruling — techno-performer).** The Bard is a techno-musician, media-face, crowd-mover: no Veil access at all, no half-caster lane, no magic-erosion penalty. Chrome-positive with **zero** penalty, identical to Street-Fixer and Corp-Exec. **This SUPERSEDES the canon baseline chapter's "the Bard subclass touches the Veil lightly" line (and its accompanying magic-erosion clause) outright — flagged as a required baseline update in Part 2, Known Bugs #1.**
7. **Q2 = Both — dual-mode Mark mechanic.** The Commander/Face carries BOTH a combat Mark (canon Tactician grammar — mark a creature, allies get edge attacking it, allies gain Influence on hits against it) AND a social Mark via the Read the Room signature (mark an NPC, learn a Motivation/Pitfall/Attitude/tell, crew gets argument edges against them). Two distinct signatures, both active simultaneously if the scene has both a combat layer and a social layer.
8. **Q4 = A — full design at the 9-cost and 11-cost tiers.** Four abilities invented for each tier; every one flagged for sign-off in Part 2. This mirrors the Medic's own Q4=A ruling on its 9- and 11-cost tiers.
9. **Q5 = B — dual-stat scaling.** Persona scales command effects (granting actions, edges, rallies, potency of command-flavored Power Rolls). Instinct scales read-based Influence generation (Read the Room bonuses, spotting tells). Both stats are live in the class engine simultaneously — this is not a single-primary class.
10. **Currency: nuyen (¥)** throughout — never "Wealth," never abstract credits.
11. **Attribute display convention:** GHOSTWIRE label first, DS attribute in parens — e.g. "Persona (Presence)," "Instinct (Intuition)." Five characteristics only: **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, **Persona (Presence)**. "Reflex" is always singular. "Cognition," "Resolve," "Will," and "Reflexes" (plural) never appear.
12. **DS levels 1-10 are the primary progression axis.** Echelon (E1-E4, four bands) is referenced only as a cross-class tier concept (gear tiers, Availability bands) — it never gates a Commander/Face feature ladder directly.
13. **Cost ladder: 1 / 3 / 5 / 7 / 9 / 11**, matching every other GHOSTWIRE class master. The 1/3/5-cost tier is chosen at 1st level; the 7-cost tier (headlined by Turn the Tide) unlocks at 3rd level; the 9-cost tier at 5th level; the 11-cost tier at 8th level.
14. **Cyborgs ARE allowed as Commander/Face.** The canon baseline states explicitly that "Cyborgs make superb Operators, Scouts, Hackers, Wrenches, Medics, and Commanders." The Commander/Face is a fully mundane class — magic-erosion is irrelevant to it, and per Design Ruling #6 that is now true of **every** subclass including the Bard, closing the one gap that used to exist in the canon chapter.

---

## PART 1 — PLAYER-FACING: THE COMMANDER / FACE

### Who You Are

You are the **Commander/Face** — on the street just **Face**, **boss**, or **the one who does the talking**. Corp paperwork, when it bothers to name you at all, files you as a *"liaison,"* *"talent,"* or *"handler."* None of that captures what you actually are: the **crew's voice and its will**, the one who wins the room and directs the fight without ever firing a shot.

Where the **Operator** wins the firefight and the **Hacker** owns the net, you win the **room** — and when the room turns loud, you're the one at the crew's shoulder calling the shots that let everyone else fight above their weight. Your power is not magic, machines, or chemistry. It is **command presence** — the trained, magnetic authority of someone people *listen to*, whether you're a boardroom exec who can silence a table with a raised hand, a street fixer with the whole undercity on speed-dial, or a performer who can move a crowd to tears or to riot.

You are the one who negotiates the payout, talks the crew past the checkpoint, and reads the mark across the table before they even know they're being read. You are also the **battlefield warlord** — the commands you bark turn four scattered runners into a coordinated strike team, moving and striking as one. You **control both fights and negotiations**, and you do it through other people: your own damage output is low, but your impact, measured in what your allies accomplish because of you, is the highest in the game.

You are a quintessential **Edgerunner** — the setting's term for the deniable-contractor archetype who runs the edge between the lit corporate world and the dark undercity. You are the **signature class of the Economy, Negotiation, and Followers/Strongholds/Contacts chapters** — better payouts, better terms, richer contact webs, and stronger followers all route through you.

**You are fully mundane.** No Veil, no Wired specialty — though, like anyone, you can operate a deck or handle basic tech at a competent civilian level. There is no magic-erosion penalty anywhere in this class, for any subclass, including the Bard. You are **chrome-positive**, and per canon, **Cyborgs make superb Commanders** — a chromed-out negotiator or a fully synthetic battlefield warlord is exactly on-genre for this world.

**Two battlefields, one skill set.** Every other class in GHOSTWIRE has one primary theater of operation. The Operator has the firefight. The Hacker has the net. The Elementalist and Street-Priest have the Veil. You are the only class built to be equally at home in a boardroom negotiation and a rooftop firefight, because to you those are the same problem wearing different clothes: a room full of actors with motivations, leverage points, and a moment where the whole thing tips one way or the other. A Corp-Exec closing a contract renegotiation and a Street-Fixer calling the shot that turns a losing firefight around are running the exact same mental process — reading the room, finding the lever, applying pressure at the moment it matters most. This is why your class chassis (the Mark mechanic, the Influence engine, the signature kit) is deliberately dual-mode from the ground up rather than a combat kit with a social reskin bolted on.

**What you are not.** You are not a striker — your personal damage output is genuinely low, by design, because your entire kit is built to make *other people's* damage output high. You are not a tank — you don't stand in the front line and absorb hits the way an Operator does. And you are not a caster — nothing you do reaches across the Veil or draws on Resonance; every trick in your kit is trained skill, force of personality, and (for the Bard) technology, nothing more exotic than that. If a Director ever silences magic in a scene or knocks out the local net, you are entirely unaffected, because you never needed either one.

---

### Class Chassis

*DS Tactician reskin explanation: the Commander/Face's mechanical spine is the DS Tactician class — a dual-characteristic command-and-coordinate engine built around a per-turn resource drip (Focus), a Mark mechanic, and a Tactical Doctrine (subclass) ladder. GHOSTWIRE keeps the Tactician's entire mechanical shape and reskins its resource as Influence, its Mark as a dual-mode combat-and-social mechanic (Q2=Both), and its Tactical Doctrines as the Street-Fixer / Corp-Exec / Bard triad.*

| Stat | Value |
|---|---|
| **Core Characteristics** | Persona (Presence) — primary; Instinct (Intuition) — secondary |
| **Heroic Resource** | Influence |
| **Epic Resource / Capstone** | Command (10th level) |
| **Potency: Weak / Average / Strong** | Persona − 2 / Persona − 1 / Persona (command effects); Instinct scales read-based Influence generation per Q5=B |
| **Starting Stamina (1st level)** | 21 |
| **Stamina per Level (2+)** | +9 |
| **Recoveries** | 10 |
| **Kit Slot** | Light — most Commander/Face builds work through allies, not a personal weapon; a bodyguard-Commander (Corp-Exec enforcer) or street-enforcer (Street-Fixer with heavy backup) may take a light weapon Kit |
| **Skills** | **Leadership/Command** and **Persuasion/Negotiation** are the class's two anchor skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. **Instinct**-keyed reading (motivations, pitfalls, tells) rounds out the baseline. A fourth free pick follows your subclass: **Corporate/Bureaucracy** or **Etiquette** (Corp-Exec), **Streetwise** (Street-Fixer), or **Performance** (Bard). |

*Design note (chassis rationale, per DS Tactician's baseline stats + GHOSTWIRE's command-and-negotiate identity): the Commander/Face mirrors the Tactician's Stamina/Recoveries curve exactly (21 starting, +9/level, 10 Recoveries) — a mid-weight frame appropriate for a class that stands near the front of a fight directing it, without being built to absorb the front line's punishment the way the Operator is. Species mods stack on top of the class chassis in the standard way. Potency is dual-tracked per Q5=B: command-flavored Power Rolls (Command Persona, Fearful Awe, Battle Cry, Turn the Tide's combat mode) key their tiers to **Persona**, while Instinct governs how efficiently the class generates Influence off successful reads rather than gating a separate potency track of its own.*

**No Wired, no Veil.** The Commander/Face is fully mundane — reliable, always-available leadership and negotiation with no supernatural or digital infrastructure required. Per Design Ruling #6, this is now true of **every** subclass, including the Bard.

**Characteristic Increases:**
- **4th level:** Persona (Presence) and Instinct (Intuition) each rise to 3.
- **7th level:** all five characteristics rise by +1 (max 4).
- **10th level:** Persona (Presence) and Instinct (Intuition) each rise to 5.

**Advancement table shape:** DS levels 1-10, matching the Hacker/Elementalist/Operator/Wrench/Street Priest/Medic masters — see the **Level 1-10 Progression Table**, below, for the full level-by-level breakdown of features, abilities, and doctrine grants.

---

### Influence — Your Heroic Resource

**Influence** is your command authority made mechanical: social-and-tactical fuel, earned by leading and reading well, spent to grant allies extra actions, movement, edges, and to bend scenes, negotiations, and NPCs to the crew's advantage. Per **Q1 = A ruling**, this keeps the Tactician's Focus loop wholesale, with Face-appropriate flavor layered on top — Influence is **per-encounter and resets**, not a banked reserve that carries between runs (a deliberate contrast with, e.g., the Medic's persistent Reagents).

**How Influence is generated:**

| Trigger | Gain |
|---|---|
| **Start of encounter** | Influence equal to your **Victories** (canon Face "Take the lead") |
| **Start of each of your turns during combat** | **2 Influence** (base; **3** at 7th level; **4** at 10th level) |
| **First time each combat round any ally within 10 sq of you damages a target Marked by you** | **+1 Influence** (canon Tactician) |
| **First time each combat round any ally within 10 sq of you uses a heroic ability** | **+1 Influence** (canon Tactician — the leader's tactical direction rewards ally initiative) |
| **First time each round you succeed on a Read the Room that reveals new information (Q5=B dual-stat generation)** | **+1 Influence** (canon Face "Reading the room" trigger, preserved and Instinct-scaled — rewards *understanding* people, not just commanding them) |
| **End of encounter** | Lose all remaining Influence |

**Outside combat use.** You may use an Influence ability without spending, in a social scene (negotiation, infiltration, a performance) — but only **once each per rest or Victory** (canon Focus outside-combat rule, preserved). This represents the negotiation itself being the Face's battlefield: the room is a fight you're already winning, one exchange at a time.

**Firewall note.** Influence is class power on the BP side of the firewall. It is never bought, raised, or fed by nuyen or Body Integrity. The Economy's **Renown**, **Lifestyle**, and **nuyen** are the class's **strategic levers** — what it grows and spends *out of scene* — and they can grant **edges** to social rolls, but they do not manufacture Influence, and Influence never converts to nuyen or Renown. This resolves the canon chapter's original **Access-vs-Influence** fork: strategic leverage (doors, favors, credentials) lives permanently in the Renown/Contacts systems; Influence is the **in-scene, live-table fuel** that never leaves the fight or the negotiation it was earned in.

> **What is Influence?** *(Inline definition, so the term is never more than a paragraph away from first use.)* Influence is the Commander/Face's Heroic Resource: momentum of authority, earned by leading, rallying, and reading people well, spent on heroic abilities and signature enhancements. It resets to a fresh pool at the start of every encounter or social scene and is fully lost at the end — you cannot bank a room's goodwill into the next fight. This mirrors the DS Tactician's Focus loop precisely, per Q1=A.

---

### The Mark Mechanic (Combat + Social — Dual-Mode)

Per **Q2 = Both**, the Commander/Face's signature "designate the important actor" grammar runs on **two tracks** — the fight, and the negotiation — because a Face who can only mark a target in one of those arenas isn't doing the whole job. You may have **one combat Mark and one social Mark active simultaneously** if a scene has both layers; each track has its own targeting, its own duration, and its own benefit menu.

#### Combat Mark (canon Tactician)

> *Maneuver · Distance: Ranged 10 · Target: one creature*
> Mark the target. It remains Marked **until the end of the encounter, until you're dying, or until you Mark a new target** (only one combat-Marked creature at a time). You may willingly end the Mark on your target with no action required.
>
> **When the Marked target is reduced to 0 Stamina:** you may use a free triggered action to Mark a new target within distance.
>
> **Passive benefit.** While the Marked target is within your line of effect, you and your allies within your line of effect gain an **edge on Power Rolls** made against it.
>
> **Active benefit menu (spend 1 Influence, free triggered).** When an ally deals rolled damage to the Marked target, choose **one**:
> - Extra damage equal to **2 × your Persona score**
> - The damaging creature spends a Recovery
> - The damaging creature shifts up to **Persona-score** squares
> - If the damage was melee: the Marked creature is **taunted by you** until the end of its next turn
>
> *(Only one benefit per triggering hit.)*

#### Social Mark — Read the Room (canon Face signature)

> *Maneuver · Distance: sight or hearing, in a social scene · Target: one NPC*
> Mark the target. It remains Marked **until the end of the scene, until the scene resets, or until you use Read the Room again** (only one social-Marked NPC at a time).
>
> **On Marking.** Learn **one** of the following about the target, Director's discretion as to which is easiest to read in the moment: a **Motivation**, a **Pitfall**, their current **Attitude** toward you or the crew, or a **tell** (e.g., "she's lying about the payout").
>
> **Passive benefit.** You and your allies gain an **edge on Persona-based argument rolls** against the Marked NPC for the rest of the scene.
>
> **Enhance (spend 1 Influence, free triggered).** When an ally makes an argument against the Marked NPC and wins it (Outcome Tier 1 or Tier 2), choose **one**:
> - Learn a second piece of information about the NPC
> - Grant that ally an edge on their **next** argument roll in this scene
> - Bump the NPC's **Interest track** up one step immediately

**Design note.** The "designate the important actor at the table" grammar is the class's single most recognizable signature move, and Q2=Both means it's not confined to combat — whichever battlefield the run is currently on, fists or words, you can point at the thing that matters and make the whole crew better at dealing with it.

**Worked example — a scene with both layers active.** The crew is midway through a negotiation with a corp fixer in a nightclub VIP room when the fixer's security detail decides the meeting is over. The Commander/Face had already used Read the Room on the fixer two exchanges ago (learning their Pitfall: they're skimming from their own employer and terrified of being found out) — that social Mark is still live, so the crew's arguments against the fixer keep their edge even as the room goes loud. The instant the first guard draws a weapon, the Commander/Face uses their maneuver to combat-Mark that guard instead of re-Marking the fixer — now the crew has an active edge on Power Rolls against the immediate physical threat, *and* a still-live social edge against the fixer, who hasn't stopped being a target just because bullets are involved. When an ally drops the guard, the Commander/Face spends 1 Influence for the combat Mark's active benefit (shifting the felled guard's neighbor two squares into a bad position); two exchanges later, when the fight ends and the fixer — badly rattled — tries to talk their way out of the situation, the social Mark's enhance option is still sitting there, ready to bump their Interest track before the scene resets. Both tracks ran the entire time, independently, exactly as designed.

---

### Signature Abilities (No Influence Cost)

You have **four** signatures — all free, at-will, from 1st level, all enhanced by spending Influence for a stronger effect, none of them ever costing Influence at their base effect.

> **Direct Ally** *(Class Feature Signature — the warlord core)*
> *Keywords: Command, Instinct · Type: Maneuver · Distance: Ranged 10 (ally must see or hear you) · Target: one ally*
> Choose **one**: grant the ally an **edge on their next Power Roll**, a short **burst of free movement** (up to their speed), or a **minor damage/defense bump** (+1 damage on their next strike, or +1 damage reduction until the start of their next turn).
>
> **Enhance (spend 2 Influence):** target up to **3 allies**, OR upgrade the benefit (free movement becomes a **free strike**; a single edge becomes a **double edge**; the damage bump increases to **+3**).
> *Your baseline, every-turn presence — the class's answer to "the crew simply fights better with you calling it."*

> **Mark** *(Class Feature Signature — combat targeting; see the Mark Mechanic section, above, for full text)*
> *Maneuver · Ranged 10 · Target: one creature*
> Full mechanics above. This is the canon Tactician's combat-targeting grammar, carried wholesale per Q2=Both.

> **Read the Room** *(Class Feature Signature — social targeting; see the Mark Mechanic section, above, for full text)*
> *Maneuver · Sight or hearing, social scene · Target: one NPC*
> Full mechanics above. This is the canon Face's social-targeting grammar, carried wholesale per Q2=Both.

> **The Right Word** *(Class Feature Signature — the flex hinge, see its own Deep Dive section below)*
> *Keywords: Persona, Command · Type: Main action or maneuver · Distance: Ranged 5 (target must see or hear you) · Target: one creature, ally OR enemy*
> Choose one mode:
> - **Rally an ally:** clear a minor morale/fear condition, grant a saving throw, or steel them (**+2** to their next Persona save vs. fear/corruption/dread).
> - **Rattle a foe:** **Power Roll** 2d10 + Persona. On **≤11**: no effect. On **12-16**: the target takes a **bane** on their next Power Roll. On **17+**: the target is **taunted by you until the end of their next turn** OR **frightened of you until the end of your next turn** (your choice).
>
> **Enhance (spend 2 Influence):** hit up to **3 targets** in an area, OR upgrade the condition (a rally clears **all** morale conditions instead of one; a rattle becomes a **save-ends** condition instead of ending at end-of-next-turn).
> *The Face's "always useful this turn" tool — cheap, versatile, always relevant, and the exact same line of dialogue that can heal a friend's nerve or break an enemy's.*

---

### Heroic Abilities — Cost Tiers 1 Through 11

Heroic Abilities are the Commander/Face's Influence-fueled command plays, chosen by cost tier as you level, layered on top of the always-on Signature kit above. On our reversed Outcome Tiers (Tier 1 = 17+ = best, Tier 2 = 12-16, Tier 3 = ≤11 = worst). Costs mirror the Draw Steel caster ladder shared by every GHOSTWIRE class: **1 / 3 / 5 / 7 / 9 / 11.**

#### 1-Cost Tier (chosen at 1st level)

*The DS Tactician SRD has no 1-cost band (its ladder runs 3/5/7/9/11), but canon's own Face chapter names **Seize the Initiative** directly at cost 1. **A Word** is a GHOSTWIRE-original invention filling out the tier to match the Hacker/Elementalist/Operator/Wrench/Street Priest/Medic templates' ladder shape, all of which open at cost 1. Flagged for Michael's sign-off — see Part 2, Known Bugs #2.*

> **Seize the Initiative** *(canon, 1 Influence, maneuver)*
> Grant an ally within Ranged 10 an **immediate free move** (up to their speed), OR **one triggered strike** against a target within their weapon range, OR let an ally who hasn't acted yet **swap into initiative order** to act immediately after you.
> *The everyday warlord command — cheap, flexible, always useful, the class's floor-level tempo play.*

> **A Word** *(1 Influence, GHOSTWIRE-original — flagged)*
> Grant an ally within Ranged 10 either **+1 to their next Power Roll this round**, OR **clear one minor morale/social condition** on them (fear, taunted, frightened).
> *A quiet aside at exactly the right moment — the cheapest possible spend when every other point of Influence is earmarked for something bigger.*

#### 3-Cost Tier (chosen at 1st level)

*Coordinated Assault and Command Persona/Fearful Awe are canon, named directly in the Face's class chapter. Battle Cry and Concussive Command are reskinned wholesale from the DS Tactician's own 3-cost tier (Battle Cry, Concussive Strike), preserved verbatim in grammar and mechanically retextured for the Face. Flagged for Michael's sign-off — see Part 2, Known Bugs #3.*

> **Coordinated Assault** *(canon, 3 Influence, main action)*
> *Ranged 10 · Target: up to 3 allies in area/within range*
> Each target gains an **edge** and **+Persona damage** on their next attack this round; OR you grant **one** ally an **extra action** this turn.
> *The moment the crew moves as one strike team — the class's core "make everyone better at once" payoff.*

> **Command Persona / Fearful Awe** *(canon, 3 Influence, main action)*
> Choose one mode:
> - **Command Presence:** 3-cube in Ranged 10; **you make one Power Roll + Persona**. The tier of success determines how many enemies in the area are affected and the effect applied to each. On **≤11 (Tier 3)**: only the enemy nearest to the cube's center is affected, and takes a **bane** on its next Power Roll. On **12-16 (Tier 2)**: up to **2** enemies of your choice in the area are **taunted by you** until the end of their next turn. On **17+ (Tier 1)**: up to **3** enemies of your choice in the area are **taunted by you** until the end of their next turn AND take a **bane** on their next Power Roll. *(Grammar note per Michael's 2026-07-29 ruling: the hero rolls, and the tier of success cascades to determine how many enemies are impacted — this replaces the earlier per-target save-style resolution.)*
> - **Fearful Awe:** one target within Ranged 10; Power Roll + Persona. Tier 1: the target is **frightened of you, save ends**. Tier 2: **taunted** by you until end of its next turn. Tier 3: the target is **Weakened** for 1 round.
> *The anti-morale teeth — the Face's version of area denial, aimed at will rather than bodies.*

> **Battle Cry** *(3 Influence, reskinned from DS Tactician)*
> *Ranged 10 · Target: three allies*
> Power Roll + Persona. Tier 1: each target gains **3 surges** (temporary Stamina equal to surges × Persona). Tier 2: **2 surges** each. Tier 3: **1 surge** each.
> *The rallying shout — a leader's voice cutting through the noise of a fight to put fresh wind in everyone's sails.*

> **Concussive Command** *(3 Influence, reskinned from DS Tactician's Concussive Strike)*
> *Ranged 10 · Target: one enemy*
> Designate the target: one ally within Ranged 10 makes a free signature strike against it. Power Roll + Persona. Tier 1: the strike gains an **edge**, and the target is **dazed, save ends**. Tier 2: the strike gains an edge, and the target is **dazed until end of its next turn**. Tier 3: the strike gains no edge, and the target has a **bane** on its next Power Roll.
> *"Strike him down!" — a sharp, single-word command that turns an ally's next hit into exactly the opening the crew needed.*

#### 5-Cost Tier (chosen at 1st level)

*Rally the Crew is canon, named directly in the Face's class chapter. Coordinated Strike, Now!, and This Is What We Planned For are reskinned wholesale from the DS Tactician's own 5-cost tier (Hammer and Anvil, Now!, This Is What We Planned For). Flagged for Michael's sign-off — see Part 2, Known Bugs #4.*

> **Rally the Crew** *(canon, 5 Influence, main action)*
> *Range: 5-burst, self and allies*
> Each ally in the area: clears one condition, gains a Recovery, gains temporary Stamina equal to your Persona score, and gains an edge on their next Power Roll.
> **Social variant:** in a social scene, flip the room's Attitude one full step, OR grant the crew an edge on all social rolls for the rest of the scene.
> *The mass pick-me-up — the battlefield counterpart to the Medic's Triage, but healing morale and momentum rather than wounds.*

> **Coordinated Strike** *(5 Influence, reskinned from DS Tactician's Hammer and Anvil)*
> *Ranged 10*
> Command directs one ally within Ranged 10 to make a free strike against your designated target. Power Roll + Persona. Tier 1: **2 allies** each make a free strike that gains an edge. Tier 2: **1 ally** makes a free strike that gains an edge. Tier 3: **1 ally** makes a free strike (no edge).
> *The hammer-and-anvil moment — you call the shot, and someone else lands it.*

> **Now!** *(canon Tactician, 5 Influence, maneuver)*
> *Ranged 10 · Target: three allies*
> Each ally makes an **immediate free strike** (any signature-strike ability).
> *The single sharpest word in your vocabulary — a battlefield-wide trigger pulled at once.*

> **This Is What We Planned For** *(canon Tactician, 5 Influence, maneuver)*
> *Ranged 10 · Target: two allies*
> Each ally who hasn't acted yet this round takes their turn, in any order, **immediately after yours**.
> *The setup-payoff moment — the plan you called three turns ago clicking into place exactly on schedule.*

#### 7-Cost Tier (chosen at 3rd level) — includes Turn the Tide

*This tier is headlined by **Turn the Tide**, canon's own apex ability, named directly in the Face's class chapter. Full mechanics are broken out in their own section below — see "Turn the Tide — Deep Dive." The remaining 7-cost options (Hit 'Em Hard!, Rout, Break Formation) are reskinned wholesale from the DS Tactician's own 7-cost tier. Flagged for Michael's sign-off — see Part 2, Known Bugs #5.*

> **Turn the Tide** — *see the full Deep Dive section below.*

> **Hit 'Em Hard!** *(canon Tactician, 7 Influence, maneuver)*
> *Self, until end of encounter or you're dying*
> Whenever you or any ally deals damage to a target Marked by you, that creature gains **2 surges** (temporary Stamina), usable immediately.
> *The "keep pressing" battlefield state — every hit against your mark turns into fuel for whoever landed it.*

> **Rout** *(canon Tactician, 7 Influence, maneuver)*
> *Self, until end of encounter or you're dying*
> Whenever you or any ally deals damage to a target Marked by you who has Persona **lower than average**, the target is **frightened of the creature who dealt the damage, save ends**.
> *The fear-cascade state — once the line starts to break, it keeps breaking.*

> **Break Formation** *(7 Influence, reskinned from DS Tactician's Frontal Assault)*
> *Self, until end of encounter or you're dying*
> The first time on a turn that you or any ally deals damage to a target Marked by you, the damaging creature can push the target up to **2 squares**, then shift up to **2 squares**. Any ally using Charge against a Marked target may use a signature-strike or heroic-strike instead of a free strike.
> *The tactical repositioning state — the crew doesn't just hit the mark, it reshapes the whole fight around it.*

#### 9-Cost Tier (chosen at 5th level) — Q4=A, all four invented

*Canon's Face chapter leaves the 9-cost tier entirely unspecified, per Michael's **Q4=A ruling** that both the 9-cost and 11-cost tiers should be filled with four abilities each. All four below are GHOSTWIRE-original, sourced from DS Tactician's own 9-cost tier grammar where a direct reskin fit, and invented outright where the Face's dual combat/social identity needed something the Tactician has no analog for. Flagged for Michael's sign-off — see Part 2, Known Bugs #6.*

> **Coordinated Strike Team** *(9 Influence, main action, reskinned from Tactician's Squad! Remember Your Training!)*
> *Ranged 10 · Target: self and up to 2 allies*
> Each target gains **1 surge** (temporary Stamina equal to your Persona score) and may use a signature ability as a **free triggered action** that has **double edge** on its Power Roll.
> *The masterclass moment — everyone executes the play exactly as drilled.*

> **Empire of Words** *(9 Influence, main action, GHOSTWIRE-original)*
> *Social scene*
> Set the frame of the negotiation for the rest of the scene. Choose **one**: force the negotiation's topic to your chosen subject; declare one Motivation you've learned is now on-record and unchangeable; declare one Pitfall neutralized for the rest of the scene; or gain automatic success on your next argument this scene.
> *The Face's own social apex — the point in the conversation where you stop reacting to the room and start writing its script.*

> **Set the Pieces** *(9 Influence, main action, reskinned from Tactician's Win This Day!)*
> *3-burst, self and each ally in the area*
> Each ally: gains **2 surges**, may spend a Recovery, removes any conditions or effects on them, and stands up if prone.
> *The crew-wide tactical reset — "everyone, get up, we do this again, together."*

> **Break Their Nerve** *(9 Influence, main action, GHOSTWIRE-original)*
> *3-burst in Ranged 10*
> Each enemy in the area makes a Power Roll + Persona. Tier 1: **frightened of you, save ends,** AND **Weakened, save ends**. Tier 2: **frightened of you, save ends**. Tier 3: **frightened until end of its next turn**.
> *The crowd-cascade fear moment — the instant a whole line of enemies decides, all at once, that this fight isn't worth it.*

#### 11-Cost Tier (chosen at 8th level) — Q4=A, all four invented

*Canon's Face chapter leaves the 11-cost tier entirely unspecified, per the same **Q4=A ruling**. All four below are GHOSTWIRE-original, again sourced from DS Tactician's 11-cost grammar where it reskinned cleanly, and invented outright for the Face-unique social/network plays. Flagged for Michael's sign-off — see Part 2, Known Bugs #7.*

> **Total Command** *(11 Influence, main action, reskinned from Tactician's Floodgates Open)*
> *3-burst, self and each ally in the area*
> Each target gains **1 surge** and may use a signature ability as a free triggered action. That ability gains an **edge** on its Power Roll and increases the potency of any potency effects by **1**.
> *The "everyone acts NOW" moment — the fight, or the negotiation, is decided in this instant.*

> **Coup de Grâce** *(11 Influence, free triggered, reskinned from Tactician's Finish Them!)*
> *One creature/target*
> **Combat trigger:** the target is not a leader or solo, and becomes **winded** → the target is **killed**; the creature who caused the winding spends a Recovery.
> **Social trigger:** an argument reaches its final phase → force an immediate resolution in your favor (the NPC **concedes fully**, OR walks away with your **key demand met**).
> *Turn the Tide's older, more final sibling — the moment that ends the fight or the negotiation, permanently.*

> **Marshal the Network** *(11 Influence, main action, GHOSTWIRE-original)*
> *In-scene or between-scene*
> Call in a network favor: a Contact from your web arrives to help this scene. Effect depends on the Contact's tier (Director-adjudicated per the Contacts chapter). **Once per session per Contact.**
> *Pulling the strategic-lever emergency card — the moment the web of people you've cultivated pays off exactly when you need it most.*

> **Speak With One Voice** *(11 Influence, main action, GHOSTWIRE-original)*
> *In a social scene, with a crowd/faction/room*
> Impose your framing on an entire crowd, faction, or room. Every present NPC who can see or hear you makes a Power Roll + Persona vs. their Instinct-scaled resistance. Tier 1: **all** present NPCs shift Attitude one step toward Cooperative. Tier 2: **half** shift. Tier 3: only the **leader** shifts.
> *The apex crowd-mover — riots, rallies, panic-quells, mass loyalty pledges, all turning on the sound of your voice.*

---

### Turn the Tide — Deep Dive

*The class's defining high-Influence play, and the headline entry of the 7-cost tier, unlocked at 3rd level. Full mechanics below; this section exists separately from the tier list above because Turn the Tide carries the Commander/Face's core apex fantasy and deserves the same standalone treatment the Medic gives Miracle Worker and the Street Priest gives Invoke the Pact.*

> **Turn the Tide** *(canon, 7 Influence, main action)*
> Choose **one** mode:
> - **Combat:** All allies in Ranged 10 (up to 4) each gain: a **bonus main action or free strike** this round, a burst of **free movement** (up to their speed), an **edge on all Power Rolls** until the end of their next turn, and **+Persona damage** on all attacks until the end of the round.
> - **Social:** the decisive stroke — **win a negotiation outright** (skip remaining argument phases, secure the deal), OR bend a powerful NPC to a **major concession** (Director-adjudicated, must lie within the NPC's actual authority).

**Choose one mode, don't layer.** This is deliberately structured like the Medic's Miracle Worker — you commit to exactly one of the two effects when you activate it. There is no version of Turn the Tide that both wins a fight and closes a deal in the same use.

**Combat mode in practice.** This is a table-changer: up to four allies each get a full extra beat of action, movement, accuracy, and damage all at once. It's the single biggest tactical spike the class can produce, and it should be used rarely and deliberately — the moment the crew needs to end a fight *this round*, not merely improve their odds in it.

**Social mode in practice.** This is the negotiation's equivalent of an alpha strike: it skips the back-and-forth entirely and simply wins, or extracts a concession an NPC would never have volunteered without the full weight of your presence behind the ask. Director's call on what's actually within a given NPC's authority to grant — Turn the Tide can't make a mid-level fixer sign away a megacorp's entire security contract, but it absolutely can make that fixer give up everything *they personally* control.

**Interaction with Malice, Victories, and argument resolution.** Turn the Tide's combat mode does not manufacture new Malice for the Director, and its social mode does not skip past Victories already banked in a running negotiation — it resolves the *current* exchange decisively, it doesn't retroactively erase ground already lost. In an ongoing multi-phase negotiation, Turn the Tide's social mode is best read as "win this phase outright, hard," rather than "win the entire multi-session negotiation arc in one action" — the Director should apply it at the scale of the current scene.

**Once per encounter, effectively.** At low levels, 7 Influence is close to a full spend of the entire pool — even with the Take the Lead and per-turn drip triggers, most Commanders won't have the Influence to fire Turn the Tide twice in the same fight until well into the class's higher levels. This is by design: it should feel like the moment, not a repeatable button.

**Comparison to the roster's other apex plays.** Every GHOSTWIRE class has a defining high-cost signature move, and Turn the Tide's design sits deliberately between two poles already established elsewhere in the game. The Medic's **Miracle Worker** and the Commander/Face's Turn the Tide share the same "no roll to fail" reliability — both are pure resource-for-effect trades with no Power Roll standing between you and the outcome. The Street-Priest's **Invoke the Pact**, by contrast, is a genuine gamble: a Bind Check that can fail, because it's reaching for outside help across the Veil. Turn the Tide's combat mode is the closest thing the Commander/Face has to the Medic's reliability model, but its *scope* is unique in the game: rather than fixing one critical problem (a dying ally, a systemic toxin), it multiplies the effectiveness of an entire crew simultaneously for a single, decisive round. Its social mode has no real analog anywhere else in the class roster — no other class's apex ability can end a negotiation outright, because no other class is built around negotiations as a core combat-equivalent activity in the first place.

**Table guidance for Directors.** Because Turn the Tide's social mode is worded broadly ("win a negotiation outright"), Directors should treat it the way they'd treat a called shot or a finishing blow in combat — dramatically satisfying, narratively final for *this specific exchange*, but not a magic key that unlocks every future scene with that NPC or faction. A crime boss who concedes the terms of tonight's deal under the full weight of a Turn the Tide is still the same crime boss next session, with the same grudges, resources, and agenda — they just lost this particular exchange decisively.

---

### The Right Word — Deep Dive (Flex Hinge)

*The class's cheapest, most universally useful tool, and the dedicated deep-dive treatment every GHOSTWIRE class gives its flex-hinge signature.*

**Free, at-will, no Influence cost at base.** The Right Word is available every single turn from 1st level onward, with no resource gate standing between you and using it. Only the **enhancement** (hitting an area, or upgrading the condition) costs Influence — the base effect is always on the table.

**The buff-or-debuff hinge.** The exact same signature does **opposite things** depending on who you point it at: aimed at an ally, it's a rally — clearing fear, granting a save, steeling nerve. Aimed at an enemy, it's a rattle — a bane, a taunt, a fright. This is the defining structural trick of a GHOSTWIRE flex-hinge signature: one action, one line of dialogue in the fiction, two completely different mechanical outcomes depending on the target.

**The "always useful this turn" tool.** Because it's free and always relevant, The Right Word is the ability a Commander/Face falls back on in literally any situation — no Influence banked, no bigger play available, still always something worth saying. This is the deliberate design answer to "what does the Face do on a turn where nothing else lines up."

**Comparison across the roster.** Every mundane GHOSTWIRE class gets exactly one signature built on this same buff-or-debuff hinge, and they're all worth reading side by side:

| Class | Flex-Hinge Signature | Mechanism |
|---|---|---|
| **Medic** | Administer Dose | Chemistry — the same injector heals a friend or poisons a foe |
| **Street-Priest** | Judgment | Divine — the same invocation blesses an ally or strikes a foe |
| **Wrench** | Rig-a-Fix | Engineering — the same toolkit builds up an ally's gear or breaks down an enemy's |
| **Commander/Face** | The Right Word | Rhetoric — the same charged line rallies an ally or rattles a foe |

Where the Medic's version is chemical and the Wrench's is mechanical, The Right Word is purely social: it costs nothing but the right words at the right moment, and it works exactly as well on a corp exec across a boardroom table as it does on a ganger across a firefight.

---

### Command Doctrines (Subclasses)

At 1st level, every Commander/Face chooses one of three **Command Doctrines** — Street-Fixer, Corp-Exec, or Bard — reskinned respectively from the DS Tactician's Insurgent, Mastermind, and Vanguard Tactical Doctrines. All three share the identical Persona/Instinct chassis and Influence engine; each grants a feature ladder across levels 1, 2, 3, 5, 6, 8, and 9.

*Corp records list each doctrine differently; the street calls all three simply "the Face."*

**Choosing between the three.** All three doctrines run the identical core engine — Influence, the dual-mode Mark, the four signatures, the 1/3/5/7/9/11 heroic-ability ladder — so the choice between them is a choice of *fictional lane and secondary toolkit*, not a choice of raw power level. A quick gut-check for players: if your instinct at the table is to know a guy who knows a guy, you're a **Street-Fixer**. If your instinct is to flash a badge, cite a regulation, or invoke a chain of command, you're a **Corp-Exec**. If your instinct is to make the whole room feel something — to perform the moment rather than negotiate it — you're a **Bard**. All three fight exactly as well; the difference shows up in downtime, in which NPCs already like you before the scene starts, and in which of the class's three attached chapters (Economy, Negotiation, Followers/Contacts) you'll lean on hardest.

---

#### Street-Fixer — *"Deniable-Ops Undercity Operator"*

The whole undercity on speed-dial: deals, favors, and the fixer's web. Reskinned from the Tactician's **Insurgent** doctrine — the "irregular warfare, hidden operations, keep allies alive at all costs" framing translates directly onto a fixer who runs deniable ops. Corp cover: *"independent contractor"* or *"unlicensed logistics."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **The Fixer's Web** *(canon)* | The strongest Contacts engine in the game (per the Followers/Contacts chapter): extra starting contacts, faster cultivation, mid-run favor calls. Edges to **Streetwise** legwork and negotiations framed around **Freedom/Greed/Vengeance**. Grants use of the Insurgent's **Covert Operations** mechanic reskinned to social — edges on intrigue-skill-group tests, using Lead to assist Streetwise/intrigue tests, and doing research/reconnaissance **during** negotiations. |
| **1** | **Advanced Tactics** *(canon Insurgent, triggered)* | When an ally deals damage to your Marked target, the target gains **2 surges** (temporary Stamina) that the damaging ally can use on the triggering damage; spend **1 Influence** to increase potency by 1 if applicable. |
| **1** | **Undercity Whisper** *(triggered, GHOSTWIRE-original — flagged)* | Free triggered, once per encounter: when a Marked enemy or NPC is affected by one of your abilities, spend **1 Influence** to declare a contact from your Fixer's Web has intel on them — grants an automatic Tier 1 read on that target's Motivation. |
| — | Subclass bonus skill | **Streetwise** (or a free pick from the intrigue skill group) |
| — | Starting contact | A **fixer** or **gang lieutenant** |
| **2** | **Infiltration Tactics** *(canon)* | Whenever you or any ally within 10 sq becomes hidden, that creature gains **1 surge**. |
| **2** | Doctrine ability (choose 1) | See Street-Fixer Ability Table, below (2nd-tier options). |
| **3** | **Grey Market Access** *(GHOSTWIRE-original — flagged)* | Once per session, call in one gear item from your Fixer's Web at **half price**. |
| **5** | **Distracted** + **Leave No Trace** *(canon)* | *Distracted:* creatures Marked by you don't count as observers for hiding purposes; allies can use each other as cover. *Leave No Trace:* you and allies within 10 sq can sneak at full speed; enemies within 10 sq take a **bane** on Search rolls. |
| **6** | Doctrine ability (choose 1) | See Street-Fixer Ability Table, below (6th-tier options). |
| **7** | **Undercity Advantage** *(canon, reskinned from Asymmetric Warfare)* | During a montage or negotiation, automatic success on one intrigue-skill-group test; can conceal large groups of people (escapees, civilians). |
| **8** | **Set Up the Play** *(canon, reskinned from Bait and Ambush)* | When you or any ally makes a strike against a Marked target, spend **2 Influence**: the striker shifts up to **Persona** squares AND uses Hide as a free maneuver during the shift. The shift may occur before or after the strike. |
| **9** | Doctrine ability (choose 1) | See Street-Fixer Ability Table, below (9th-tier, apex options). |

**Street-Fixer Ability Table** *(Doctrine-ability-style picks, per DS Tactician's Insurgent ability cadence — flagged items are GHOSTWIRE-original; the rest are canon Insurgent abilities reskinned)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **Fog of War** *(canon, 5-focus)* | Reskinned: create a zone of confusion (smoke, jammed feeds, crowd noise) that grants you and allies concealment and imposes a bane on enemy Perception-based tests within it. |
| 2 | **Try Me Instead** *(canon, 5-focus)* | Reskinned: as a free triggered action, redirect an attack targeting an ally within 10 sq to yourself instead. |
| 6 | **Coordinated Execution** *(canon, 9-focus)* | Reskinned: you and up to 2 allies within 10 sq of a Marked target may each make a free strike against it, once per encounter. |
| 6 | **Panic in Their Lines** *(canon, 9-focus)* | Reskinned: enemies within 10 sq of your Marked target that witness it take heavy damage become frightened, save ends. |
| 9 | **Squad! Hit and Run!** *(canon, 11-focus)* | Reskinned: you and all allies within 10 sq may immediately shift up to their speed after resolving a strike against a Marked target, no action required. |
| 9 | **Their Lack of Focus Is Their Undoing** *(canon, 11-focus)* | Reskinned: enemies that fail to damage you or an ally within 10 sq on their turn grant you and that ally an edge on your next Power Rolls against them. |

*Corp cover: "independent contractor" / "unlicensed logistics." Bonus skill: Streetwise, plus a fixer, ganger-clinic, or black-market contact. Chrome flavor: moderate, practical — the Street-Fixer chromes up for utility, not showmanship.*

---

#### Corp-Exec — *"Boardroom Strategist"*

Credentials, protocol, and the weight of institutional power: the one who walks into the arcology like they own a floor of it. Reskinned from the Tactician's **Mastermind** doctrine — "encyclopedic knowledge, victory by planning ahead, calculating framing" translates directly onto the boardroom strategist. Corp cover: *"executive liaison"* or *"corporate handler."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **Credentials & Protocol** *(canon)* | Plausible authority for access, clearance, and hierarchy: edges to commanding NPCs who respect hierarchy, and edges on negotiations framed around **Higher Authority/Greed**. Grants use of the Mastermind's **Studied Commander** mechanic reskinned — one category cheaper for war/battle Discover Lore projects; respite research on encounters. |
| **1** | **Overwatch** *(canon Mastermind, triggered)* | When the target of your Mark moves, at any time during its movement, one ally may make a free strike against it. Spend **1 Influence** to also Slow the target if its Reflex is below average. |
| **1** | **The Board Reads** *(triggered, GHOSTWIRE-original — flagged)* | Free triggered when you succeed on a Read the Room against an NPC with corp authority: automatically learn their corp faction and current Renown level toward your crew; grants **+1 Influence**. |
| — | Subclass bonus skill | **Corporate/Bureaucracy** or **Etiquette** (choose one) |
| — | Starting contact | A **corp insider** or **handler** |
| **2** | **Goaded** *(canon)* | Whenever a creature Marked by you uses a strike targeting you or an ally in your line of effect, use a free triggered action to change one target of that strike to you or another ally in line of effect within distance. |
| **2** | Doctrine ability (choose 1) | See Corp-Exec Ability Table, below (2nd-tier options). |
| **3** | **Access Protocol** *(GHOSTWIRE-original — flagged)* | Start each session with one Renown-tier bump toward a corp faction you name, representing pre-run legwork. |
| **5** | **Anticipation** + **I Predicted That** *(canon)* | *Anticipation:* your Mark ability may target **two** creatures at once. *I Predicted That:* you and any ally within 10 sq gain an edge on **Logic (Reason)** tests. |
| **6** | Doctrine ability (choose 1) | See Corp-Exec Ability Table, below (6th-tier options). |
| **7** | **The Big Picture** *(canon, reskinned from Grand Strategy)* | During a montage or negotiation, automatic success on one lore-group skill test; may make a project roll for a research project in addition to another respite activity. |
| **8** | **Executive Play** *(canon, reskinned from Pincer Movement)* | When you or any ally strikes a Marked target, spend **2 Influence**: the striker shifts up to **Persona** squares before the strike. If you didn't make the strike, you can shift too. If you did make the strike, one ally within 10 sq shifts too. |
| **9** | Doctrine ability (choose 1) | See Corp-Exec Ability Table, below (9th-tier, apex options). |

**Corp-Exec Ability Table** *(Doctrine-ability-style picks, per DS Tactician's Mastermind ability cadence — flagged items are GHOSTWIRE-original; the rest are canon Mastermind abilities reskinned)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **I've Got Your Back** *(canon, 5-focus)* | Reskinned: as a free triggered action when an ally within 10 sq is hit, grant them resistance to the triggering damage equal to your Persona score. |
| 2 | **Targets of Opportunity** *(canon, 5-focus)* | Reskinned: when an enemy becomes Marked, one ally within 10 sq who hasn't acted this round may immediately make a free strike against it. |
| 6 | **Battle Plan** *(canon, 9-focus)* | Reskinned: at the start of an encounter, designate a plan; the first time each ally acts on that plan's designated action, they gain a bonus edge. |
| 6 | **Hustle!** *(canon, 9-focus)* | Reskinned: grant up to 3 allies within 10 sq a free shift up to their speed, no action required. |
| 9 | **Blot Out the Sun!** *(canon, 11-focus)* | Reskinned: all enemies within a 5-burst of your Marked target take a bane on Power Rolls against you and your allies until the end of the encounter. |
| 9 | **Counterstrategy** *(canon, 11-focus)* | Reskinned: once per encounter, when an enemy's ability would affect 3 or more allies, you may negate its effect on all but one target. |

*Corp cover: "executive liaison" / "corporate handler." Bonus skill: Corporate/Bureaucracy or Etiquette, plus a corp insider, handler, or middle-management contact. Chrome flavor: clean, soft social chrome — vocal modulators and diagnostic implants, nothing that reads as obviously augmented in a boardroom.*

---

#### Bard (Techno-Performer) — *"Fully Mundane, per Q3"*

**CRITICAL DOCTRINE NOTE:** the Bard is **fully mundane** — a techno-musician, media-face, streaming presence, holo-performer, augmented vocal artist, and deepfake-charisma specialist. There is **no Veil pool, no half-caster lane, and no magic-erosion penalty** anywhere in this subclass. The Bard is **chrome-positive**, exactly like the Corp-Exec and Street-Fixer. This supersedes the canon baseline chapter's "the Bard touches the Veil lightly" line outright — see Design Ruling #6 and Part 2, Known Bugs #1. Reskinned from the Tactician's **Vanguard** doctrine — "lead from the front, sheer force of will and personality" translates cleanly onto a performer whose spectacle carries the crew. Corp cover: *"media talent"* or *"content producer."*

| Level | Feature | Effect |
|---|---|---|
| **1** | **Resonant Performance** *(canon, reskinned)* | Your performances — music, oratory, streaming, holo-work, augmented vocal work, deepfake charisma — inspire allies and sway crowds. Grants edges on Performance tests and mass/crowd-influence tests. During negotiations, each hero with you treats Renown as **2 higher**. During combat, gain **double edge** on tests to stop combat and start a negotiation. |
| **1** | **Deflect the Beat** *(canon Vanguard, reskinned from Parry, triggered)* | When a creature deals damage to you or an ally, shift **1 square**. If you're the target, or you end adjacent to the target, they take **half damage**; potency decreases by 1 if applicable. Spend **1 Influence:** extend distance to **Melee 1 + Persona** and shift up to **Persona** squares. |
| **1** | **Riff on the Room** *(triggered, GHOSTWIRE-original — flagged)* | Free triggered, once per encounter: when the room's mood swings your way (any Attitude shift toward Cooperative, or an ally rolls Tier 1 on a Performance/social test), gain **2 Influence**. |
| — | Subclass bonus skill | **Performance** |
| — | Starting contact | A **promoter**, **journalist**, **streamer**, or **scene-fixer** |
| **2** | **Command the Stage** *(canon, reskinned from Melee Superiority)* | When you make an opportunity attack, the target's speed is reduced to 0 until the end of its next turn. Mark Benefit: when a Marked creature attempts to move or shift within your melee free-strike distance, use a free triggered action and spend **2 Influence** to make a melee free strike. |
| **2** | Doctrine ability (choose 1) | See Bard Ability Table, below (2nd-tier options). |
| **3** | **The Signature Beat** *(GHOSTWIRE-original — flagged)* | You have a signature performance — a song, a slogan, a catchphrase, a media hook. When you perform it, all allies within 10 sq gain **+1 to Instinct-based reads** for the rest of the scene. |
| **5** | **Shake It Off** + **Set the Beat** *(canon)* | *Shake It Off:* spend 1d6 Stamina as a free maneuver to ignore the consequence of a test, or end one effect on you that ends by save or end of turn; adjacent allies can do the same. *Set the Beat* (reskinned from Tactical Offensive): when you Charge a Marked target, use a signature or heroic strike instead of a free strike. |
| **6** | Doctrine ability (choose 1) | See Bard Ability Table, below (6th-tier options). |
| **7** | **The Show** *(canon, reskinned from Shock and Awe)* | During a montage or negotiation, automatic success on one interpersonal-group test; convince a group to help with crafting or social projects during respite. |
| **8** | **Bring the House Down** *(canon, reskinned from See Your Enemies Driven Before You)* | When you or an ally makes a melee strike against a Marked target, spend **2 Influence**: the striker pushes the target up to **Persona** squares, then shifts up to **Persona** squares, ending adjacent to the target. |
| **9** | Doctrine ability (choose 1) | See Bard Ability Table, below (9th-tier, apex options). |

**Bard Ability Table** *(Doctrine-ability-style picks, per DS Tactician's Vanguard ability cadence — flagged items are GHOSTWIRE-original; the rest are canon Vanguard abilities reskinned)*

| Tier | Ability | Effect |
|---|---|---|
| 2 | **No Dying on My Watch** *(canon, 5-focus)* | Reskinned: as a free triggered action when an ally within 10 sq would drop to 0 Stamina, grant them temporary Stamina equal to your Persona score before the damage resolves. |
| 2 | **Squad! On Me!** *(canon, 5-focus)* | Reskinned: pull up to 3 allies within 10 sq to a square adjacent to you, no action required. |
| 6 | **Instant Retaliation** *(canon, 9-focus)* | Reskinned: when a Marked creature damages you, make a free melee strike against it as a free triggered action. |
| 6 | **To Me Squad!** *(canon, 9-focus)* | Reskinned: as a maneuver, teleport up to 3 allies within 10 sq to squares adjacent to you. |
| 9 | **No Escape** *(canon, 11-focus)* | Reskinned: Marked creatures cannot willingly move away from you or your allies without provoking a free strike from the nearest ally. |
| 9 | **That One Is Mine!** *(canon, 11-focus)* | Reskinned: once per encounter, declare a Marked target as yours alone — you gain double edge against it, and it gains a bane on all Power Rolls against anyone but you. |

*Corp cover: "media talent" / "content producer." Bonus skill: Performance, plus a promoter, journalist, streamer, or scene-fixer contact. Chrome flavor: chrome-positive, no restriction — augmented vocal cords, subdermal light-rigs, streaming implants are all on-brand for the techno-performer, and none of it costs the Bard anything mechanically.*

---

### Level 1-10 Progression Table

*From the DS Tactician structure, reskinned per the renamings below. Field Arsenal → **Field Presence**; Out of Position → **Read the Angles**; Focus on Their Weaknesses → **Watch Their Weaknesses**; Improved Field Arsenal → **Improved Field Presence**; Master of Arms → **Master of Words**; Heightened Focus → **Heightened Influence**; Grandmaster of Arms → **Grandmaster of Words**; Command → **Command** (epic resource — the name survives unchanged, a powerful pun in this context); True Focus → **True Influence**; Warmaster → **Master of Voice**.*

| Level | Class Features | Abilities | Doctrine |
|---|---|---|---|
| **1** | Command Doctrine (subclass) choice, Influence (heroic resource), **Field Presence** (light Kit access), Signatures (Mark, Direct Ally, Read the Room, The Right Word) | Signature ×4, 1-cost, 3-cost, 5-cost | L1 doctrine features + triggered action |
| **2** | Perk, Doctrine Feature | (same) | +L2 doctrine ability |
| **3** | **Read the Angles** (free triggered Mark at start of encounter, slide Marked target 3 sq), 7-cost tier unlocked (Turn the Tide) | +7-cost | +L3 doctrine feature |
| **4** | Characteristic Increase (Persona & Instinct to 3), **Watch Their Weaknesses** (first ally damage on Marked/Read target = +2 Influence instead of +1), **Improved Field Presence** (edge on Kit signature abilities), Perk, Skill | (same) | (same) |
| **5** | Doctrine Feature (choice), 9-cost tier unlocked | +9-cost | +L5 doctrine feature choice |
| **6** | **Master of Words** (negate a bane on Kit signature Power Rolls), Perk | (same) | +L6 doctrine ability |
| **7** | Characteristic Increase (+1 all, max 4), **Heightened Influence** (gain 3 Influence/turn instead of 2), **Seize the Initiative** (as feature — your side goes first if not surprised), Skill, Doctrine Feature | (same) | (same) |
| **8** | Perk, Doctrine Feature, 11-cost tier unlocked | +11-cost | +L8 doctrine feature |
| **9** | **Grandmaster of Words** (auto-Tier-1 on Kit signatures), Doctrine ability | (same) | +L9 doctrine ability |
| **10** | Characteristic Increase (Persona & Instinct to 5), **Command** (epic resource), **True Influence** (gain 4 Influence/turn), **Master of Voice** (allies rolling against Marked/Read targets roll 3 dice keep 2; heroic abilities targeting Marked targets cost 2 less Influence, minimum 1), Perk, Skill | (same) | (same) |

---

### Core Class Features (Non-Doctrine)

- **Field Presence** (1st) — Your light Kit access. You are not a Kit-forward class — most of your impact comes through allies, not personal weapon technique — but you may take a light weapon Kit if your build (bodyguard-Commander, street-enforcer Face) calls for personal self-sufficiency in a fight. *(See Kit & Chrome interaction, below, for full framing of why this class deliberately runs light on Kit.)*
- **Read the Angles** (3rd) — At the start of each encounter, use a free triggered action to Mark a target (combat mode) and immediately slide it up to 3 squares. The leader who's already read the battlefield before the first shot is fired.
- **Watch Their Weaknesses** (4th) — The first time each round an ally damages your Marked target, or you succeed on a Read the Room, you gain **+2 Influence** instead of the usual +1.
- **Improved Field Presence** (4th) — If you took a Kit, you gain an edge on Power Rolls made with your Kit's signature abilities.
- **Master of Words** (6th) — Once per round, negate a bane on a Power Roll made with your Kit's signature abilities (if any).
- **Heightened Influence** (7th) — Your per-turn Influence drip increases to **3** (from 2).
- **Seize the Initiative** (7th, as feature) — If your side is not surprised, your side always acts first in the initiative order.
- **Grandmaster of Words** (9th) — Once per encounter, a Power Roll made with your Kit's signature abilities automatically counts as Tier 1.
- **Command** (10th, epic resource) — Your Influence generation carries a small overflow: the first Influence you would lose at the end of an encounter (up to 2) instead carries into the next scene as **Command**, usable exactly like Influence but only on your very next activation. This is the class's epic-tier answer to "the authority a great leader radiates doesn't vanish the instant the fight ends."
- **True Influence** (10th) — Your per-turn Influence drip increases to **4** (from 3).
- **Master of Voice** (10th) — Allies rolling against your Marked or Read-the-Room target roll **3 dice, keep the best 2** (a house "double edge, best-two-of-three" treatment). Heroic abilities that target a Marked creature cost **2 less Influence** (minimum 1).

---

### Kit & Chrome interaction (Social Chrome, Chrome-positive rule)

**Kit access: light.** The Commander/Face is not a Kit-forward class — most of your combat impact runs through the allies you direct, not a personal weapon technique. A bodyguard-Commander (a Corp-Exec running executive protection) or an enforcer-Face (a Street-Fixer who backs their word with a gun) may take a light weapon Kit for personal self-sufficiency, but the class's core identity holds either way. This mirrors the canon chapter's framing directly: "the class's damage comes through allies, not personal Kit techniques."

**Social Chrome (canon).** The Commander/Face carries the **lightest chrome footprint of any class** in the game. Its natural implants are **soft social chrome** — vocal modulators, empathy processors, tailored pheromone glands — collectively the *"Silvertongue" Social Suite*, an Influence-tagged package of augmentations that read as subtle rather than obviously mechanical.

**Chrome-positive per Q3 ruling.** All three Command Doctrines are now fully mundane. The Bard is **no longer Veil-touched**, so magic-erosion is irrelevant across **every** Commander/Face subclass — Street-Fixer, Corp-Exec, and Bard alike can chrome up to their Body Integrity limit with zero mechanical penalty to Influence generation, Mark benefits, doctrine features, or any other class feature. The old asymmetry, where a Bard alone had to guard Body Integrity like a caster while the other two doctrines augmented freely, no longer exists.

**The social-economy attachment point.** The Commander/Face is the **signature class** of three chapters at once — the **Economy** (turns Renown into people and places, negotiates better nuyen payouts and terms), **Negotiation** (the specialist: more arguments, better Attitude reads, Patience buffers), and **Followers, Strongholds & Contacts** (turns Renown into recruited followers and cultivated contact webs). **Influence** is the live table fuel; **nuyen (¥)**, **Renown**, and **Lifestyle** are the strategic levers — the two systems interlock across the firewall without ever crossing it.

**The one social class.** Every class can *argue* in a negotiation — any hero can make an argument per the Negotiation chapter — but the Commander/Face is the **only class built to lead and to leverage people as its core engine**. It is to *social and command* what the Operator is to *gunfire* and the Hacker is to *the net*: the specialist the whole crew defers to when the run is a conversation, a crowd, or a coordinated strike.

**Cyborg Commander/Face is fully supported.** The canon baseline explicitly lists "Commanders" among the classes Cyborgs excel at. Because the Commander/Face is a fully mundane class with no magic to erode — and, per Design Ruling #6, this now applies without exception to all three subclasses — a Cyborg's Arcane Severance restricts nothing here. A fully synthetic warlord or a chromed-out negotiator is exactly on-genre for this class.

---

## PART 2 — AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This half of the document is what the next Foundry-implementation agent — human or AI — needs to ship the Commander/Face to the `ghostwire` module. Structure follows the Scout, Operator, Hacker, Elementalist, Wrench, Street Priest, and Medic masters. Because no Commander/Face Foundry build exists yet, all schemas below are PLANNED and modeled on the live Operator/Hacker class items and the planned Elementalist/Wrench/Street Priest/Medic schemas — flagged in Known Bugs and to be revised the moment the Commander/Face ships.*

### Module Scope (Standing Rule)

The Commander/Face ships to the same **`ghostwire`** Foundry module that houses the Operator, Hacker, Scout, Elementalist, Wrench, Street Priest, and Medic. Module identifier for this class: **`ghostwire.class.commander`**. New/shared Compendium packs used:

- **`ghostwire-classes`** — The Commander/Face class item, class-wide doctrine features, and the 3 subclass grant items (Street-Fixer, Corp-Exec, Bard).
- **`ghostwire-abilities`** — All Commander/Face signature abilities, the heroic-ability tier ladder (1/3/5/7/9/11), and all doctrine ability-table entries.
- **`ghostwire-kits`** — Any light weapon Kit selected by a bodyguard-Commander or enforcer-Face build (shared with the general Kit catalog — the Commander/Face introduces no new Kit type).

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`.

### Data Provenance — How This Document Was Built

- **DS Tactician SRD (mechanical spine):** Fetched from Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Tactician/`), reskin mapping extracted to `/home/user/workspace/commander_tactician_reference.md`. Used for chassis stats (Stamina 21/+9, Recoveries 10, Potency Persona−2/−1/−0), the Mark mechanic's combat grammar, the Tactical Doctrine (subclass) cadence, and the level 1-10 progression skeleton. All of Michael's Q1-Q5 rulings are pre-applied in that reference file.
- **Commander/Face lore canon:** Extracted from `master_rules_baseline_2XP-1BP_2026-07-29.md` — the full "Class: The Commander / Face" chapter (identity, resource, signatures, heroic abilities, subclasses, chrome interaction) plus the immediately-following "Edgerunner" setting-term chapter. This is the primary source for identity, the dual-mode Mark framing, the subclass triad's setting flavor, and the four signature abilities.
- **Michael's 2026-07-15 through 2026-07-29 rulings (Q1-Q5, verbatim, applied):** Q1=A (Influence is per-encounter, resets, matches canon Tactician Focus), Q2=Both (dual-mode Mark — combat AND social), Q3 (Bard is fully mundane, no Veil, no magic-erosion — supersedes canon baseline), Q4=A (fill both 9-cost and 11-cost tiers with 4 abilities each, flag all for sign-off), Q5=B (dual-stat scaling — Persona for command effects, Instinct for read-based Influence generation).
- **GHOSTWIRE templates (structural):** `Ghostwire_Medic_Development_Master.md` (freshest, primary template match target, post-Echelon-rework corrected version), `Ghostwire_StreetPriest_Development_Master.md` (secondary template), `Ghostwire_Wrench_Development_Master.md` (level-based rework template), `Ghostwire_Elementalist_Development_Master.md` (caster template).
- **Standing GHOSTWIRE doctrine applied:** attribute display convention (Persona (Presence), Instinct (Intuition)); DS levels 1-10 as the advancement axis; nuyen (¥) is currency; one canonical file per class; Foundry-first, rulebook-second.

### Item Inventory (Planned, To Be Built)

*IDs allocated per the standing GHOSTWIRE ID convention (`GWCommander00001` for the class item; `GWCommanderSig00001`+ for signatures; `GWCommanderHer00001`+ for tier-cost heroics; `GWCommanderSub00001`+ for subclass abilities and features). All IDs are placeholder-planned.*

**Class item** (`ghostwire-classes`):
- `GWCommander00001` — The Commander/Face (class-type item; chassis stats, Influence resource definition, level-based advancement, feature grants).

**Core doctrine features** (`ghostwire-classes`, type `feature`), ~11 total:
- Field Presence, Read the Angles, Watch Their Weaknesses, Improved Field Presence, Master of Words, Heightened Influence, Seize the Initiative (feature), Grandmaster of Words, Command (epic resource), True Influence, Master of Voice.

**Subclass grant items** (`ghostwire-classes`, type `feature`, 3 total):
- `GWCommanderSub00001` — Street-Fixer (1st-level grant: The Fixer's Web, Advanced Tactics, Undercity Whisper, Streetwise skill)
- `GWCommanderSub00002` — Corp-Exec (1st-level grant: Credentials & Protocol, Overwatch, The Board Reads, Corporate/Bureaucracy or Etiquette skill)
- `GWCommanderSub00003` — Bard (1st-level grant: Resonant Performance, Deflect the Beat, Riff on the Room, Performance skill)

**Signature abilities** (`ghostwire-abilities`, type `ability`): 4 free class-wide signatures (Direct Ally, Mark, Read the Room, The Right Word) = **4 total.**

**Heroic ability tier ladder** (`ghostwire-abilities`, type `ability`):
- 1-cost: 2 (Seize the Initiative — canon; A Word — GHOSTWIRE-original)
- 3-cost: 4 (Coordinated Assault, Command Persona/Fearful Awe — canon; Battle Cry, Concussive Command — reskinned from Tactician)
- 5-cost: 4 (Rally the Crew — canon; Coordinated Strike, Now!, This Is What We Planned For — reskinned from Tactician)
- 7-cost: 4 (Turn the Tide — canon; Hit 'Em Hard!, Rout, Break Formation — reskinned from Tactician)
- 9-cost: 4 (Coordinated Strike Team, Empire of Words, Set the Pieces, Break Their Nerve — all GHOSTWIRE-original per Q4=A)
- 11-cost: 4 (Total Command, Coup de Grâce, Marshal the Network, Speak With One Voice — all GHOSTWIRE-original per Q4=A)
- **Subtotal: 22 heroic abilities.**

**Doctrine feature entries** (`ghostwire-classes` or `-abilities`, type `feature`, per-doctrine ladder at L1 (×3)/L2/L3/L5(×2)/L7 or L8 beyond the L2/L6/L9 ability picks):
- Street-Fixer: The Fixer's Web, Advanced Tactics, Undercity Whisper, Infiltration Tactics, Grey Market Access, Distracted, Leave No Trace, Undercity Advantage, Set Up the Play = **9 features.**
- Corp-Exec: Credentials & Protocol, Overwatch, The Board Reads, Goaded, Access Protocol, Anticipation, I Predicted That, The Big Picture, Executive Play = **9 features.**
- Bard: Resonant Performance, Deflect the Beat, Riff on the Room, Command the Stage, The Signature Beat, Shake It Off, Set the Beat, The Show, Bring the House Down = **9 features.**
- **Subtotal: 27 doctrine features.**

**Doctrine ability-table entries** (`ghostwire-abilities`, type `ability`, 6 per doctrine × 3 = **18 total**):
- Street-Fixer: Fog of War, Try Me Instead, Coordinated Execution, Panic in Their Lines, Squad! Hit and Run!, Their Lack of Focus Is Their Undoing (6)
- Corp-Exec: I've Got Your Back, Targets of Opportunity, Battle Plan, Hustle!, Blot Out the Sun!, Counterstrategy (6)
- Bard: No Dying on My Watch, Squad! On Me!, Instant Retaliation, To Me Squad!, No Escape, That One Is Mine! (6)

**Total planned item count: 1 class + 11 doctrine features + 3 subclass grants + 4 signatures + 22 heroic abilities + 27 doctrine features + 18 doctrine abilities = 86 items.**

### Class Item Schema (Planned)

```
_dsid: "commander"
level: 0
primary: "Influence"                    // Heroic Resource display name
epic: "Command"                          // Level-10 epic resource / capstone display name
turnGain: "2"                            // per-turn drip: 2 base, 3 at L7 (Heightened Influence), 4 at L10 (True Influence)
minimum: "0"
resetsPerEncounter: true                 // Influence resets at end of encounter/scene — NOT persistent (contrast with Medic's Reagents)
characteristics.core: ["presence", "intuition"]   // real DS keys; display as Persona (Presence) / Instinct (Intuition)
stamina: { starting: 21, level: 9 }
recoveries: 10
markMechanic: {
  combatMark: { type: "maneuver", range: 10, exclusivity: "one-at-a-time" },
  socialMark: { type: "maneuver", range: "sight-or-hearing", exclusivity: "one-at-a-time", sceneScoped: true }
}                                         // NEW FIELD — dual-mode Mark tracking, see Known Bugs #18
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], description, additional: {type, perkType, cost} } }
```

**`resetsPerEncounter: true` note.** This is the inverse of the Medic's `persistAcrossEncounters` field — Influence behaves exactly like the DS Tactician's native Focus resource, so this should be the more common/default case in the DS v1.1.1 system rather than a novel field. Confirm this against the live Operator/Hacker class items, which likely already use an equivalent reset-per-encounter resource pattern.

**`markMechanic` field note.** This is a genuinely new schema shape — no prior GHOSTWIRE class has needed to track two independently-exclusive Mark states (one combat-scoped, one scene-scoped) simultaneously. See Known Bugs #18 for the open schema question this raises.

### Ability Item Schema (Planned)

```
type: "ability"
system: {
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "direct-ally", "mark", "read-the-room", "turn-the-tide"
  story: <flavor line>,
  keywords: [...],                     // e.g. ["command", "instinct"] for Direct Ally; ["persona", "command"] for The Right Word
  type: "main" | "maneuver" | "triggered" | "free",
  category: "signature" | "heroic",
  resource: <number>,                  // Influence cost: 0 (signatures) or 1/3/5/7/9/11 (heroics)
  markBranch: "combat" | "social" | null,   // NEW FIELD — distinguishes Mark's combat-mode grammar from Read the Room's social-mode grammar
  trigger: <string>,                   // populated on triggered-type (e.g. Advanced Tactics, Overwatch, Riff on the Room)
  distance: { type: "melee"|"ranged"|"self"|"touch"|"sight"|"sceneScoped", primary, secondary, tertiary },
  target: { type: "creature"|"self"|"ally"|"ally-or-enemy"|"npc"|"area", custom, value },
  power: {
    roll: { formula: "@chr", characteristics: ["presence"], reactive: false },   // Persona (Presence) primary for command-flavored rolls
    effects: { <effectId>: { type: "damage"|"applied"|"other", ... } }
  },
  socialMark: { onMark: "learn-one-of-motivation-pitfall-attitude-tell", enhance: {...} },  // NEW FIELD — see Known Bugs #18
  prerequisites: { dsid: ["commander"], value: "", level: null },
  effects: { <effectId>: { type: "base", description: <html>, before: true|false, name, sort } }
}
```

**`markBranch` field note.** Because Mark and Read the Room are structurally near-identical (both are exclusive-target-designation maneuvers with a passive ally-edge benefit and an Influence-spend enhancement menu) but operate on entirely different scopes (combat encounter vs. social scene), tagging each ability item with which branch it belongs to lets shared UI/automation logic (e.g., "does this creature currently have an active Mark on it") disambiguate cleanly. Confirm whether the DS v1.1.1 system's existing Mark implementation (already used by the live Tactician, if one exists in the base system) has a similar branch/scope field before inventing this wholesale.

**`socialMark` field note.** This is a genuinely new pattern with **no precedent** in any shipped GHOSTWIRE class — no prior ability has needed to model "learn one of several possible pieces of information, Director's discretion on which," as a structured data field rather than free-text rules prose. Recommend modeling this as an enum-like field (`motivation` | `pitfall` | `attitude` | `tell`) with a Director-facing note field rather than hardcoding a single fixed reveal. **Flagged in Known Bugs #18.**

**Worked example — one signature, one heroic ability:**

```yaml
# Example: GWCommanderSig00003 -- Read the Room
name: "Read the Room"
type: "ability"
system:
  description.value: |
    Mark one NPC you can see or hear. Learn a Motivation, Pitfall, Attitude, or tell (Director's choice).
    You and allies gain edge on Persona-based argument rolls against the Marked NPC for the scene.
  keywords: ["persona", "instinct", "social"]
  type: "maneuver"
  category: "signature"
  resource: { value: 0 }
  markBranch: "social"
  distance: { type: "sight-or-hearing", sceneScoped: true }
  target: "one-npc"
  socialMark:
    onMark: ["motivation", "pitfall", "attitude", "tell"]
    exclusivity: "one-active-social-mark"
    passiveBenefit: "edge-on-persona-arguments-vs-target"
    enhance:
      cost: 1
      trigger: "ally-wins-argument-tier1-or-tier2"
      options: ["learn-second-info", "grant-edge-next-argument", "bump-interest-track"]
```

```yaml
# Example: GWCommanderHer00015 -- Empire of Words (9-Cost Tier)
name: "Empire of Words"
type: "ability"
system:
  description.value: |
    Set the frame of the negotiation for the rest of the scene. Choose one:
    force the topic to your subject; lock in a learned Motivation as on-record;
    neutralize a learned Pitfall for the scene; or gain automatic success on your next argument.
  keywords: ["persona", "command", "social"]
  type: "main-action"
  category: "heroic"
  resource: { value: 9 }
  markBranch: "social"
  distance: { type: "sceneScoped" }
  target: "negotiation-scene"
  powerRoll: null   # no roll -- effect is chosen, not rolled, matching canon's "no Power Roll" Face heroics
  prerequisites: { dsid: ["commander"], level: 5 }
```

### Feature Item Schema (Planned)

```
type: "feature"
system: {
  description: { value: <html rules text>, director: <html, optional GM-only guidance> },
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "the-fixers-web", "credentials-and-protocol", "resonant-performance"
  advancements: {},                    // empty on standalone-passive features
  prerequisites: { value: "", dsid: [] | ["commander"] | ["commander-street-fixer"] | ["commander-corp-exec"] | ["commander-bard"], level: null }
}
```

**Doctrine-locked prerequisite note.** Every 1st-level doctrine feature (The Fixer's Web, Credentials & Protocol, Resonant Performance, and their respective triggered actions) must carry a subclass-specific prerequisite (`dsid: ["commander-street-fixer"]`, etc.), not just `["commander"]` — exactly like the Medic's Ripperdoc-only Nano-Adrenal Auto-Injector and the Street Priest's Templar-only Judgment. Confirm the DS v1.1.1 prerequisite schema supports subclass-level (not just class-level) gating before this ships; if it only supports class-level `dsid` matching, this will need to be enforced at the table/GM level instead.

### Folder Structure (Planned)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Commander/Face class item (shared folder with Operator, Hacker, Elementalist, Street Priest, Medic class items) |
| `ghostwire-classes` | `GWCommanderSubclassr1` | 3 subclass items (Street-Fixer, Corp-Exec, Bard) |
| `ghostwire-classes` | `GWCommanderFeatures01` | ~11 core doctrine features + 27 subclass features |
| `ghostwire-abilities` | `GWCommanderSignatures1` | 4 free class-wide signatures (Direct Ally, Mark, Read the Room, The Right Word) |
| `ghostwire-abilities` | `GWCommanderHeroics0001` | 22 heroic abilities across the 1/3/5/7/9/11 tier ladder |
| `ghostwire-abilities` | `GWCommanderSubAbil0001` | 18 doctrine ability-table entries (6 per subclass) |
| `ghostwire-kits` | (existing) | No new Kit type — bodyguard-Commander / enforcer-Face builds draw from the shared Kit catalog |

### Deploy Scripts (Planned Chronological Order)

1. **`Backup-Ghostwire-World-PreCommander.ps1`** — read-only, full compendium snapshot to disk before any writes. Standard pre-ship safety measure per Pre-Flight Doctrine.
2. **`Deploy-Ghostwire-Commander-Rebuild-v1.ps1`** — primary ship script. Creates all 86 planned items across `ghostwire-classes`, `ghostwire-abilities`, and `ghostwire-kits` in the folder structure above. Idempotent (checks for existing items by `_dsid` prefix `GWCommander` and either updates in place or aborts with warning).
3. **`Diagnose-Ghostwire-Commander-Advancements.js`** — read-only diagnostic to verify the class item's `system.advancements` object built cleanly, modeled on the equivalent Hacker/Operator/Street Priest/Medic diagnostic scripts. Should also specifically verify the `markMechanic` dual-branch object and the `resetsPerEncounter` flag survive a save/reload cycle.
4. **`Backup-Ghostwire-Commander-FullDump-v1.js`** — read-only dump script using the proven-working Clipboard API + chunked console fallback pattern (per Operator master §Data Provenance — do not use `copy()` or Blob-download methods, both failed on Michael's Windows setup). This dump becomes the ground truth for Part 2's live-schema update once it exists.
5. **`Deploy-Ghostwire-Commander-Patch-*.ps1`** (as needed) — targeted patches per bug discovery, following the Hacker patch pattern.

### Known Bugs / Sign-Off Needed

*Every invented content item in this document is listed here for Michael's explicit review, following the same numbered pattern the Wrench, Street Priest, and Medic masters use. Nothing below should be treated as final canon until reviewed.*

1. **DOCTRINE CHANGE — CANONICAL BASELINE UPDATE NEEDED.** The Bard is now **fully mundane**: no Veil access, no half-caster lane, no magic-erosion penalty, chrome-positive with zero restriction. This **supersedes** the canon baseline chapter's lines describing "the Bard subclass touches the Veil lightly" and its accompanying magic-erosion clause (the lines reading, in substance, "certain performances carry a faint arcane charge... the magic-erosion rule applies to a Bard... while the Corp-Exec and Street-Fixer remain fully mundane," and the Kit & Chrome section's "The Bard is the exception... subject to the magic-erosion rule"). **The master rules baseline document itself needs a follow-up edit to reflect this doctrine change** — until that edit lands, this master document is the authoritative override for the Bard subclass specifically. Flagged prominently; this is the single most structurally significant ruling in this document.

2. **INVENTED CONTENT FLAG — one of the two 1-Cost Tier abilities.** **A Word** is GHOSTWIRE-original, written to give the class a cost-1 floor matching the Hacker/Elementalist/Operator/Wrench/Street Priest/Medic templates' ladder shape (canon's own **Seize the Initiative** already fills the other slot). Flagged for Michael's sign-off.

3. **INVENTED CONTENT FLAG — two of the four 3-Cost Tier abilities are Tactician-sourced reskins, not canon Face content.** **Battle Cry** and **Concussive Command** are reskinned wholesale from the DS Tactician's own 3-cost tier (Battle Cry, Concussive Strike) — canon's Face chapter only names Coordinated Assault and Command Persona/Fearful Awe at this cost. Flagged for Michael's sign-off; verify the Face flavor lands on both.

4. **INVENTED CONTENT FLAG — three of the four 5-Cost Tier abilities are Tactician-sourced reskins.** **Coordinated Strike**, **Now!**, and **This Is What We Planned For** are reskinned wholesale from the DS Tactician's own 5-cost tier (Hammer and Anvil, Now!, This Is What We Planned For) — canon's Face chapter only names Rally the Crew at this cost. Flagged for Michael's sign-off; verify the Face flavor lands on all three.

5. **INVENTED CONTENT FLAG — three of the four 7-Cost Tier abilities are Tactician-sourced reskins.** **Hit 'Em Hard!**, **Rout**, and **Break Formation** are reskinned wholesale from the DS Tactician's own 7-cost tier (Hit 'Em Hard!, Rout, Frontal Assault) — canon's Face chapter only names Turn the Tide at this cost. Flagged for Michael's sign-off; verify the Face flavor lands on all three, particularly Rout's fear-cascade framing against a social/command-focused class.

6. **INVENTED CONTENT FLAG — all FOUR 9-Cost Tier abilities.** **Coordinated Strike Team**, **Empire of Words**, **Set the Pieces**, and **Break Their Nerve** are all GHOSTWIRE-original — canon left this entire tier blank, per Michael's Q4=A ruling to fill it with four abilities. Two are Tactician-sourced reskins (Coordinated Strike Team from Squad! Remember Your Training!, Set the Pieces from Win This Day!); two are Face-original inventions with no Tactician analog (Empire of Words, Break Their Nerve). Flagged for Michael's sign-off; recommend a playtest pass given the tier's entirely-invented status.

7. **INVENTED CONTENT FLAG — all FOUR 11-Cost Tier abilities.** **Total Command**, **Coup de Grâce**, **Marshal the Network**, and **Speak With One Voice** are all GHOSTWIRE-original — canon left this entire tier blank, per the same Q4=A ruling. Two are Tactician-sourced reskins (Total Command from Floodgates Open, Coup de Grâce from Finish Them!); two are Face-original inventions with no Tactician analog (Marshal the Network, Speak With One Voice). Flagged for Michael's sign-off; recommend a playtest pass given the tier's entirely-invented status, particularly Marshal the Network's Contact-tier-dependent scaling, which has no numeric precedent elsewhere in the class.

8. **VERIFICATION FLAG — Dual-Mode Mark mechanic (Q2=Both).** Combat Mark and Social Mark (Read the Room) are structurally parallel but scoped independently (encounter vs. scene) and can be active simultaneously. This is a genuinely new mechanical shape for the game — verify at the table that both modes work cleanly when a scene has both a combat layer and a social layer active at once (e.g., a negotiation that turns into a firefight mid-scene), and confirm how the social Mark should behave if a scene transitions into combat without a clean "scene reset."

9. **INVENTED CONTENT FLAG — Street-Fixer's L1 triggered "Undercity Whisper."** No canon precedent; invented to give Street-Fixer a 1st-level triggered action matching the Corp-Exec/Bard triggered-action pattern established by the Tactician's doctrine cadence. Flagged for sign-off.

10. **INVENTED CONTENT FLAG — Street-Fixer's L3 "Grey Market Access."** GHOSTWIRE-original filler feature, invented to fill the L3 doctrine-feature slot the Tactician cadence expects but canon's Face chapter doesn't specify at that level. Flagged for sign-off.

11. **INVENTED CONTENT FLAG — Corp-Exec's L1 triggered "The Board Reads."** No canon precedent; invented for the same structural reason as #9. Flagged for sign-off.

12. **INVENTED CONTENT FLAG — Corp-Exec's L3 "Access Protocol."** GHOSTWIRE-original filler feature, invented for the same structural reason as #10. Flagged for sign-off.

13. **INVENTED CONTENT FLAG — Bard's L1 triggered "Riff on the Room."** No canon precedent; invented for the same structural reason as #9. Flagged for sign-off.

14. **INVENTED CONTENT FLAG — Bard's L3 "The Signature Beat."** GHOSTWIRE-original filler feature, invented for the same structural reason as #10. Flagged for sign-off.

15. **INVENTED CONTENT FLAG — all 18 doctrine ability-table entries (Fog of War through That One Is Mine!) are Tactician-sourced reskins with Face flavor applied.** The source Face chapter describes doctrine identity at the paragraph level but does not enumerate a discrete per-level ability list the way DS Tactician's doctrine ability tables do. All 18 entries across the three Ability Tables (6 per subclass, at levels 2/6/9) are reskins of canon Tactician Insurgent/Mastermind/Vanguard abilities, retextured for the Face's social-and-command identity. Flagged for Michael's sign-off — recommend a playtest pass to confirm the tier-2/6/9 power curve lands correctly relative to the Medic's, Wrench's, and Street Priest's equivalent doctrine-ability ladders, and specifically to confirm the Face flavor reads cleanly on combat-only reskins like Instant Retaliation and No Escape.

16. **VERIFICATION FLAG — Q5=B dual-stat scaling.** Persona scales command effects (granting actions, edges, rallies, and the potency of command-flavored Power Rolls); Instinct scales read-based Influence generation (Read the Room bonuses, spotting tells). Verify in play that both stats feel meaningfully "on" simultaneously rather than one dominating character optimization — a Commander/Face who dumps Instinct entirely should still function as a battlefield warlord, and one who dumps Persona should still function as an information-gathering social specialist, but the class's stated identity is that both matter together. Recommend a playtest pass specifically watching for degenerate single-stat builds.

17. **DESIGN NOTE — Field Presence (L1 feature), Kit access framing may need refinement.** Because this is deliberately the lightest-Kit class in the game, "Field Presence" as a feature name/slot may read as underwhelming compared to other classes' L1 Kit-access features. Consider whether this needs a more substantive baseline benefit beyond "you're allowed to take a light Kit if you want one," or whether the class's overall power budget already accounts for this being a near-non-feature by design (its impact living entirely in the signature/heroic/doctrine layers instead). Flagged for design review, not strictly an error.

18. **OPEN SCHEMA QUESTION — Class Item Schema and Ability Item Schema both need new fields with no precedent.** The Class Item Schema's `markMechanic` dual-branch tracking object and the Ability Item Schema's `socialMark` field (modeling "learn one of several possible reveals, Director's discretion on which") are both genuinely new patterns. Confirm whether the DS v1.1.1 system's existing Tactician Mark implementation (if the base system ships one) has any structure worth adapting before inventing these wholesale, and confirm whether Foundry's data model can cleanly support two independently-scoped exclusive-target states (combat-encounter-scoped Mark, scene-scoped social Mark) on the same actor simultaneously.

19. **OPEN SCHEMA QUESTION — Influence's "once per rest/Victory" outside-of-combat rule has no clean enforcement precedent.** The canon Focus outside-combat rule ("a Commander/Face may use an Influence ability without spending, in a social scene, but then can't use it again out of combat until they win a key exchange or finish a respite") requires tracking a boolean or counter state that resets on two different triggers (a Victory-equivalent win condition, or a respite) rather than a single clean encounter boundary. Confirm whether Foundry's DS v1.1.1 system has any existing mechanism for tracking a "used this free action, needs a non-encounter-boundary trigger to reset" state before building a custom flag/Active-Effect workaround for it.

### Source File Index

| Purpose | Path |
|---|---|
| Commander/Face lore canon (full class chapter + Edgerunner setting-term chapter) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/423201d8-c20a-4748-8009-225f3b392fcd/master_rules_baseline_2XP-1BP_2026-07-29.md` |
| DS Tactician chassis reference (full SRD reskin mapping + Q1-Q5 rulings applied) | `/home/user/workspace/commander_tactician_reference.md` |
| Master rules baseline (original source of the lore reference extract) | Project file: `master_rules_baseline_2XP-1BP_2026-07-29.md` |
| Medic master (freshest, primary structural template match, post-Echelon-rework corrected version) | `/home/user/workspace/Ghostwire_Medic_Development_Master.md` |
| Street Priest master (secondary template) | `/home/user/workspace/Ghostwire_StreetPriest_Development_Master.md` |
| Wrench master (level-based rework template) | `/home/user/workspace/Ghostwire_Wrench_Development_Master.md` |
| Elementalist master (closest-match caster template) | `/home/user/workspace/Ghostwire_Elementalist_Development_Master.md` |
| GHOSTWIRE canonical build log | Project file: `GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Pre-Flight Doctrine (governing process rules) | Project file: `GHOSTWIRE_Preflight_Doctrine_v1.md` |
| DS Tactician SRD (original source, for re-verification) | `https://steelcompendium.io/compendium/main/Rules/Classes/Tactician/` |

---
