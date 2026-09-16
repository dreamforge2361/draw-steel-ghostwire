# GHOSTWIRE_OPERATOR_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Operator class as of 2026-07-28. All future Operator-class design, rules, and Foundry-implementation work -- across every session -- must reference and update THIS file, and only this file. Do not create new Operator-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and `Ghostwire_Hacker_Development_Master.md` is treated for Hacker-class state. The earlier `operator.md` concept draft (2026-07-15, self-flagged as having "stubbed" 7/9/11-cost abilities and per-tier features) is SUPERSEDED and should not be used as ground truth going forward.*

*Last updated: 2026-07-28. Ground truth for this document is a live read-only Foundry item dump pulled directly from the `ghostwire.ghostwire-classes` compendium (via `Backup-Ghostwire-Operator-FullDump-v3.js`), not the earlier concept draft. Attribute names follow the locked GHOSTWIRE convention: display label first, real Draw Steel attribute in parentheses -- e.g. Physique (Might).*

---

## PART 1 -- PLAYER-FACING: THE OPERATOR

### Who You Are

You are an **Operator** -- a street samurai, edgerunner, or professional shooter who fights with chrome, discipline, and a body wired to run hotter than anyone else on the field. You don't hack the Wired and you don't burn magic; you close distance, put rounds and blades where they count, and keep coming back for more when everyone else would already be down.

Where you distinguish yourself is discipline under pressure. Whether you're a **Corp-Milspec** asset running fire-team doctrine, a **Merc** carrying two kits into every job, or a **Street-vet** who survived the gutter long enough to become a professional, your identity is the same: chrome-forward, casts nothing, and dangerous specifically because you do not stop.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Physique (Might), Reflex (Agility) |
| **Heroic Resource** | Adrenaline |
| **Epic Resource / Capstone** | Combat Legend (10th level) |
| **Starting Stamina** | 21 |
| **Stamina per Level** | +9 |
| **Recoveries** | 10 |
| **Kit Slot** | Kit (weapon/gear loadout choice -- Merc carries two) |

### Adrenaline -- Your Heroic Resource

Adrenaline is the Operator's fuel, and unlike most Heroic Resources in GHOSTWIRE it is explicitly framed as a fight-or-flight biological response that chrome-augmented nervous systems bank as combat fuel. Its full rules text, pulled live from the class's own "Adrenaline" feature grant (see Part 2 for the item ID), reads as follows:

**Adrenaline in Combat.** At the start of a combat encounter (or any other tense situation the Director tracks in combat rounds), you gain Adrenaline equal to your Victories. At the start of each of your turns during combat, you gain 1d3 Adrenaline. Additionally, the first time each combat round that you take damage, you gain 1 Adrenaline. The first time you become winded or are dying in an encounter, you gain 1d3 Adrenaline. You lose any remaining Adrenaline at the end of the encounter.

**Adrenaline Outside of Combat.** You can't gain Adrenaline outside of combat, but you can still use your heroic abilities and effects that cost Adrenaline without spending it. Whenever you use an ability or effect outside of combat that costs Adrenaline, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite. When you use an ability outside of combat that lets you spend unlimited Adrenaline on its effect, you can use it as if you had spent an amount of Adrenaline equal to your Victories.

**Growing Adrenaline.** You gain certain benefits in combat based on the amount of Adrenaline you currently have (see **Growing Adrenaline I/II/III**, granted at 4th/7th/10th level below). These benefits last until the end of your turn, even if a benefit would become unavailable because you spent Adrenaline during that turn.

**Turn income scaling:** the base 1d3/turn income is upgraded to **1d3+1** by **Greater Adrenaline** (a level-4 feature, see below), and the first-damage-of-the-round trigger is upgraded from 1 to **2 Adrenaline** by **Damaging Adrenaline** (also level 4), and again to **3 Adrenaline** by **Peak Adrenaline** (level 10, replacing the level-4 value rather than stacking).

### Signature Abilities

Every Operator knows both signature abilities at 1st level -- these are your baseline, no-Adrenaline-cost ranged options, both rolled with Reflex (Agility):

| Signature | Type | Target | Damage (T1/T2/T3) |
|---|---|---|---|
| **Controlled Pair** | Ranged strike | 1 creature | 3+chr / 6+chr / 9+chr |
| **Suppressing Fire** | Ranged area (cube 3, range 10) | Each enemy in the area | 1 / 2 / 3 (flat, control-focused) |

**Controlled Pair** is your bread-and-butter single-target ranged strike -- two aimed shots, scaling cleanly with Physique (Might) via the `@chr` damage bonus. **Suppressing Fire** trades raw damage for area coverage -- low, flat numbers by design, meant to threaten a zone and set up battlefield control rather than drop a single target fast.

### Heroic Abilities -- Cost Tiers 1 Through 11

Heroic Abilities are the Operator's spell-equivalent -- chosen by cost tier as you level, each one an Adrenaline-fueled burst of trained violence. All base-tier abilities (costs 1-5) are GHOSTWIRE-original; **all 7-cost, 9-cost, and 11-cost tier abilities are adapted from the published Draw Steel "Heroes" supplement (pages 136-141)**, not custom-authored for GHOSTWIRE -- flagged here plainly since this differs from the Hacker class's fully custom Program list (see Part 2, Known Bugs/Caveats, for why this matters to future content work).

#### Base Tier (1-5 Adrenaline, chosen at 1st level, GHOSTWIRE-original)

| Ability | Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Breach & Clear** | 1 | Main Action | Ranged strike (dist 10) | Damage 3/6/9, plus a forced-Slide rider (dist 2/3/5); moving into a vacated square lets opportunity-attack damage transfer to the target |
| **Trigger Cadence** | 2 | Free Maneuver | Self | No roll. You surge 1, and the next ability roll you make this turn automatically obtains a Tier 3 outcome |
| **Hold the Line** | 2 | Free Triggered | Ranged strike (dist 3) | Trigger: enemy enters adjacent or within 3 squares. Damage 2/5/7 |
| **Overwatch** | 3 | Free Triggered | Ranged strike (dist 10) | Trigger: first time each enemy enters/acts in a zone this encounter (once per enemy). Damage 3/6/9 |
| **Adrenaline Dump** | 5 | Main Action | Ranged strike, up to 3 creatures (dist 10) | Damage 3/6/10; can deal 1d6 damage to yourself to deal an extra 1d6 damage to the target |

**Trigger Cadence** is the standout of this tier -- a guaranteed Tier 3 on your very next roll this turn is an enormous tempo swing for 2 Adrenaline, and it costs only a Free Maneuver. **Adrenaline Dump** is the aggressive, multi-target closer of the tier, with a genuine self-harm-for-more-damage rider that rewards a player willing to spend their own Stamina for burst.

#### 7-Cost Tier (chosen at 3rd level, source: Heroes p.136, self-targeted maneuvers)

| Ability | Effect |
|---|---|
| **Chrome Unleashed** | No roll. Enemies adjacent to you at the start of their turn (potency strong or better) become frightened until the end of that turn, for the rest of the encounter or until you're dying |
| **Face the Hail** | No roll. Melee strikes vs. potency-average-or-better targets taunt them until the end of their next turn; abilities dealing rolled damage vs. taunted targets deal +2x Physique (Might) extra damage and +1 potency tier, for the rest of the encounter |
| **Armor Breaker** | No roll. Gain 20 temporary Stamina |
| **Already Flatlined** | Melee strike, no tiered damage table -- effects are entirely in the ability text: non-leader/solo targets are reduced to 0 Stamina at the end of their next turn; leader/solo targets instead grant you a surge 3 + a free melee strike |

#### 9-Cost Tier (chosen at 5th level, source: Heroes p.137)

| Ability | Type | Damage (T1/T2/T3) | Notable Rider |
|---|---|---|---|
| **Crippling Burst** | Melee strike, Physique (Might) | 10+chr / 14+chr / 20+chr | Applies Slowed (save ends); while slowed this way, target takes 1 damage per square moved, including forced movement |
| **My Move!** | Free Triggered melee strike, Physique (Might) | 6+chr / 9+chr / 13+chr | Trigger: you're winded/dying, or damaged while winded/dying. You can spend a Recovery |
| **Rebounding Fire** | Melee strike hitting 2 creatures, Physique (Might) | 9+chr / 14+chr / 19+chr | Push rider (dist 3/5/7) with a "pinball" collision rule -- colliding with another creature/object mid-push deals the push damage again and continues the push |
| **Lock Down!** | Melee strike, Physique (Might) | 9+chr / 13+chr / 18+chr | Applies Slowed (save ends); while the target is slowed this way, any other effect that would slow them instead **Restrains** them; a target that fails its save while Restrained this way becomes **Locked Down** until given specialist medical attention or you choose to reverse the effect (no action required) |

#### 11-Cost Tier (chosen at 8th level, source: Heroes p.140-141)

| Ability | Type | Effect |
|---|---|---|
| **Overclocked Adrenaline** | Self, no roll (maneuver) | Gain 10 temporary Stamina. Choose acid, cold, fire, sonic, corrosive, or kinetic feedback as your overclocked damage type. Until the end of the encounter or until you're dying, whenever an enemy damages you, they take 10 damage of the chosen type; if this reduces the enemy to 0 Stamina, you gain another 10 temporary Stamina |
| **Overkill** | Main Action, melee strike, Physique (Might) | Damage 6+chr/10+chr/14+chr. If the target is a minion or winded (and not a leader/solo), they're reduced to 0 Stamina before this ability's damage is dealt. If the target dies from this damage, any damage over what was required to kill them carries over to another creature within 5 squares |
| **Combat Trance** | Self, no roll (maneuver) | Choose a damage type as above. Until the end of the encounter or until you're dying, one target of any ability you use each activation takes an extra 15 damage of the chosen type. Additionally, whenever you gain Adrenaline from taking damage, the source of that damage takes 5 damage of the chosen type |
| **Relentless** | Main Action, self-targeted melee, Physique (Might) | You shift up to your speed; each enemy you move adjacent to during this shift takes 2x Physique (Might) damage, then one power roll targets each enemy moved adjacent to. Tier-based instant-kill thresholds: T1 kills targets at 8 Stamina or less, T2 at 11 or less, T3 at 17 or less. Gain 1 Adrenaline per target killed this way (max 11) |

**Note on the 11-cost tier:** three of the four (Overkill, Combat Trance, Relentless) key their tiered effects/damage off Physique (Might); Overclocked Adrenaline has no roll characteristics at all (pure self-buff). Relentless in particular is the tier's signature "clear a room" option -- a mobile execute that also refuels your Adrenaline pool directly.

### Origin Subclasses

At 1st level you choose your **Operator Origin** -- your professional background, which shapes your kit access, your unique skill, and a full ladder of doctrine-specific features and abilities through 9th level. All doctrine content below was pulled from a live recursive dump of each subclass item's own advancement pool (source: Heroes p.131-145, GHOSTWIRE reskin -- these three Origins are the game's own Conscript/Mercenary/Vindicator-style doctrines, not GHOSTWIRE-original content) and is now fully resolved -- no placeholders remain.

**@chr** below always means your Physique (Might) score (the Operator's core characteristic used for these power rolls); **potency** values scale with the ability's own tier and the listed resisting characteristic.

#### Corp-Milspec -- *"Company Asset"*

Grants the **Strategy** skill and a single Kit choice at 1st level (from 19 possible kits in the shared `ghostwire-kits` compendium).

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Breaching Force | Passive feature |
| 1 | Kinetic Redirect | Triggered ability |
| 1 | Strategy (skill) | Skill |
| 1 | Kit (choice of 1) | Item grant |
| 2 | Breach Charge | Passive feature |
| 2 | 2nd-Level Doctrine Ability (choice of 2: Danger Close / Demolition Swing) | Ability |
| 5 | Jump Rig | Passive feature |
| 6 | Anchored Stance | Passive feature |
| 6 | 6th-Level Doctrine Ability (choice of 2: Orbital Drop / Concussive Throw) | Ability |
| 8 | Overpowering Build | Passive feature |
| 9 | 9th-Level Doctrine Abilities (choice of 2: Fire For Effect / Gravity Well Charge) | Ability |

**Passive Features:**

- **Breaching Force** (1st, Heroes p.131) -- As your Adrenaline surges, your Physique (Might) score increases by 2 (this increase is already baked into this document's stat block). Additionally, whenever your Adrenaline is full, you gain an edge on power rolls made with abilities that have the melee weapon keyword.
- **Breach Charge** (2nd, Heroes p.134) -- You ignore difficult terrain while charging, and your charge can end in a space adjacent to any number of enemies rather than just one. You can move through enemy spaces during this movement (triggering opportunity attacks as normal). Immediately after resolving the ability, you can make a shove test against one adjacent enemy as a free maneuver instead of using the charge main action.
- **Jump Rig** (5th, Heroes p.137) -- Your jump distance and height double. When you fall, reduce the effective fall height by a number of squares equal to your jump distance for damage/prone purposes. You're not prone after falling onto another creature.
- **Anchored Stance** (6th, Heroes p.136) -- +2 bonus to Stability. Forced movement effects that would move you are reduced by 2 squares (minimum 0).
- **Overpowering Build** (8th, Heroes p.140) -- +1 bonus to Physique (Might)-based power rolls. Once per round, whenever you'd spend Adrenaline, you can spend 1 less than required (minimum 0).

**Doctrine Abilities:**

- **Kinetic Redirect** (1st signature, triggered, Heroes p.132) -- Magic, melee 1. Target self or a creature. Trigger: the target would be force moved.
- **Danger Close** (2nd tier, maneuver, 5 Adrenaline, Heroes p.134) -- Melee/weapon, 1 ally. Power roll: no direct damage listed on the trigger line itself -- resolves off your Physique (Might).
- **Demolition Swing** (2nd tier, maneuver, 5 Adrenaline, Heroes p.135) -- Melee/weapon, self. Power roll (T1/T2/T3): 1/2/3 square push.
- **Orbital Drop** (6th tier, maneuver, 9 Adrenaline, Heroes p.138) -- Magic, self. Power roll (T1/T2/T3): 7/11/16 damage plus a 3/5/7 square push.
- **Concussive Throw** (6th tier, main, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 7+@chr / 11+@chr / 16+@chr damage plus a 3/5/7 square push.
- **Fire For Effect** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Area/magic/melee/weapon, burst 3, enemies. Power roll (T1/T2/T3): 7/10/15 damage plus a 3/5/7 square push.
- **Gravity Well Charge** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Area/magic/melee/weapon, burst 3, enemies. Power roll (T1/T2/T3): 3/5/8 damage plus a 3/5/7 square pull (vertical).

#### Merc -- *"Free Company Veteran"*

Field Arsenal training -- the only Origin that maintains **two** kits simultaneously. Grants the **Sabotage** skill and two Kit choices at 1st level.

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Combat Instinct | Passive feature |
| 1 | Wired Reflexes | Triggered ability |
| 1 | Sabotage (skill) | Skill |
| 1 | Kit (choice of 2) | Item grant |
| 2 | Run and Gun | Passive feature |
| 2 | 2nd-Level Doctrine Ability (choice of 2: Suppression Kill / Formation Breaker) | Ability |
| 3 | Read the Mark | Passive feature |
| 5 | Slip the Cuffs | Passive feature |
| 6 | 6th-Level Doctrine Ability (choice of 2: Contract Fulfilled / Breach the Line) | Ability |
| 8 | Always Moving | Passive feature |
| 9 | 9th-Level Doctrine Abilities (choice of 2: Target Marked / Shock and Awe) | Ability |

**Passive Features:**

- **Combat Instinct** (1st, Heroes p.131) -- You can't be surprised, and you always act on your own initiative in combat regardless of who acts first.
- **Run and Gun** (2nd, Heroes p.184) -- +2 bonus to speed. Moving through enemy-occupied spaces no longer triggers opportunity attacks against you.
- **Read the Mark** (3rd, Heroes p.136) -- Double edge on tests to search for hidden creatures, discern hidden motives, or detect lies. Also a double edge on tests made to gamble.
- **Slip the Cuffs** (5th, Heroes p.137) -- At the start of your turn, end any restrained condition on you. Double edge on tests to escape confinement or imprisonment.
- **Always Moving** (8th, Heroes p.140) -- +2 bonus to Reflex (Agility)-based power rolls made to disengage or avoid attacks. Disengage as a free maneuver once per round.

**Doctrine Abilities:**

- **Wired Reflexes** (1st signature, triggered, Heroes p.132) -- Self. Trigger: you take damage.
- **Suppression Kill** (2nd tier, main, 5 Adrenaline, Heroes p.135) -- Melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 3+@chr / 5+@chr / 8+@chr damage; target is dazed and frightened (save ends) on a failed Persona (Presence) save.
- **Formation Breaker** (2nd tier, main, 5 Adrenaline, Heroes p.135) -- Melee/weapon, self. Power roll (T1/T2/T3): 2/4/6 damage; target dazed (save ends) on a failed Reflex (Agility) save.
- **Contract Fulfilled** (6th tier, free triggered, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, self. Trigger: you reduce a creature to 0 Stamina with a strike.
- **Breach the Line** (6th tier, main, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, self. Power roll (T1/T2/T3): 4+@chr / 6+@chr / 10+@chr damage; target frightened (save ends) on a failed Persona (Presence) save.
- **Target Marked** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Magic/melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 11+@chr / 16+@chr / 21+@chr damage (acid, cold, corruption, fire, lightning, poison, or sonic, ignoring the target's immunities).
- **Shock and Awe** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 12+@chr / 18+@chr / 24+@chr damage.

**Open question for Foundry validation:** the Merc's dual-Kit mechanic (equipping two kits simultaneously rather than one) is confirmed structurally live -- its Kit advancement grants a `chooseN` of kits distinct from the other two Origins -- but whether this doubles a kit's passive bonuses outright or requires a specific "second kit" interaction rule is not stated anywhere in the resolved text above and should be confirmed against the shared `ghostwire-kits` compendium directly.

#### Street-vet -- *"Self-Made Killer"*

Gutter Instinct training -- converts a hit to a glancing blow once per encounter (and grants Adrenaline for doing so), and you can't be surprised. Grants the **Intimidate** skill and a single Kit choice at 1st level.

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Gutter Instinct | Passive feature |
| 1 | Overclock Nerves | Triggered ability |
| 1 | Survivor's Nose | Passive feature |
| 1 | Intimidate (skill) | Skill |
| 1 | Kit (choice of 1) | Item grant |
| 2 | Dirty Fighting | Passive feature |
| 2 | 2nd-Level Doctrine Ability (choice of 2: Down the Alley / Killer Rep) | Ability |
| 3 | Street Network | Passive feature |
| 5 | Weathered | Passive feature |
| 6 | 6th-Level Doctrine Ability (choice of 2: Ambush Rush / Crossfire) | Ability |
| 8 | Ghost of the Gutter | Passive feature |
| 9 | 9th-Level Doctrine Abilities (choice of 2: Last Word / Saturation Fire) | Ability |

**Passive Features:**

- **Gutter Instinct** (1st, Heroes p.131) -- You are never surprised. Once per encounter when hit by a strike, you can turn that hit into a glancing blow and gain Adrenaline.
- **Survivor's Nose** (1st, Heroes p.131) -- Edge on tests made using the Track skill.
- **Dirty Fighting** (2nd, Heroes p.134) -- At the end of each of your turns, each enemy adjacent to you takes damage equal to your Physique (Might) score.
- **Street Network** (3rd, Heroes p.136) -- You can talk your way to information from gangers, fixers, and street contacts, and automatically sense the presence of any within 10 squares of you (even hidden). When negotiating with a ganger/fixer/street contact, treat your Renown as 1 higher than usual.
- **Weathered** (5th, Heroes p.137) -- You and each ally within 5 squares ignore negative effects from urban/industrial hazards (banes, toxic fumes, structural collapse, crossfire). Once per respite, call in a favor from a street contact to gain the benefit of a 1st-level Kit trick of your choice for one scene.
- **Ghost of the Gutter** (8th, Heroes p.140) -- You can use any Kit. During a respite, you can swap your Kit and still take another respite activity. Street Network's sense range extends to 1 mile. Whenever you test to track another creature, roll three dice and choose which two to use.

**Doctrine Abilities:**

- **Overclock Nerves** (1st signature, triggered, Heroes p.132) -- Self. Trigger: you lose Stamina and are not dying.
- **Down the Alley** (2nd tier, main, 5 Adrenaline, Heroes p.145) -- Melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 4+@chr / 6+@chr / 10+@chr damage; target slowed (save ends) on a failed Instinct (Intuition) save.
- **Killer Rep** (2nd tier, main, 5 Adrenaline, Heroes p.145) -- Area/magic, burst 2, enemies. Power roll (T1/T2/T3): 2/5/7 damage (cold, corruption, fire, or lightning) plus a 1/2/3 square push; target dazed (save ends) on a failed Physique (Might) save.
- **Ambush Rush** (6th tier, main, 9 Adrenaline, Heroes p.139) -- Magic/melee/strike/weapon, 1 creature. Power roll (T1/T2/T3): 8/13/17 damage; target grabbed on a failed Physique (Might) save.
- **Crossfire** (6th tier, maneuver, 9 Adrenaline, Heroes p.139) -- Area/magic, aura 3, creatures.
- **Last Word** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Area/magic, burst 3, enemies. Power roll (T1/T2/T3): 4/6/10 psychic damage; T1 any minion target drops to 0 Stamina; T2 same, plus one winded non-leader/non-solo target also drops to 0; T3 every non-leader/non-solo target is winded, plus the same minion/winded-target drop-to-0 riders as T2.
- **Saturation Fire** (9th tier, main, 11 Adrenaline, Heroes p.141) -- Area/magic/ranged, 5x10 cube, enemies. Power roll (T1/T2/T3): 7/10/15 damage (cold, corruption, fire, or lightning, ignoring all immunities).

### Kits (Your Loadout)

Kit choices are drawn from the shared `ghostwire-kits` compendium (19 possible kits, referenced by UUID from each subclass's Kit advancement) -- the same shared pool other classes draw from, not an Operator-exclusive item type. This document does not re-derive kit stats; see the `ghostwire-kits` compendium directly, or the Hacker doc's Cyberdeck section for the analogous pattern of documenting a kit-slot item type in its own dedicated reference. **Note:** the Merc Origin is unique in equipping two kits simultaneously rather than one. The subclass-recursive dump confirmed the Merc's Kit advancement grants a `chooseN` of 2 distinct from the other Origins' single choice, but the doctrine items themselves are silent on whether a second kit doubles its passive bonuses outright or triggers a distinct interaction rule -- this remains an open question to check directly against the `ghostwire-kits` compendium items (see Known Bugs/Caveats).

### Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Skills (choose 2, exploration/intrigue) - Operator Origin (choose subclass) - Signature Ability (choose 1 of 2) - Heroic Ability (choose 1 of 5, base tier) - Adrenaline (heroic resource) | -- | Subclass passive + triggered ability + unique skill + Kit choice(s) |
| **2** | Perk (any) | Perk (choice) | Subclass 2nd-level feature + 2nd-Level Doctrine Ability (choice of 2) |
| **3** | Choose a 7-Cost Heroic Ability (pool of 4) | -- | Subclass 3rd-level feature |
| **4** | Perk (Fabrication/Streetcraft/Shadow) - Features grant (Veteran of the Sprawl, Breach Point, Combat Form, Growing Adrenaline I, Damaging Adrenaline, Combat Attunement, Precision Strike) | Characteristic Increase (Physique/Reflex to 3) - Skill | -- |
| **5** | Choose a 9-Cost Heroic Ability (pool of 4) | -- | Subclass 5th-level feature |
| **6** | Perk (any) - Features grant | Perk (choice) | Subclass 6th-level feature + 6th-Level Doctrine Ability (choice of 2) |
| **7** | Features grant (Growing Adrenaline II) | Characteristic Increase (all +1, max 4) - Skill | Subclass 7th-level feature |
| **8** | Perk (Fabrication/Streetcraft/Shadow) - Choose an 11-Cost Heroic Ability (pool of 4) | -- | Subclass 8th-level feature |
| **9** | Features grant (Harbinger of the Primordial Chaos -- "Ghost of the Sprawl") | -- | Subclass 9th-level Doctrine Abilities (choice of 2) |
| **10** | Perk (any) - Features grant (Warzone Incarnate, Growing Adrenaline III, Peak Adrenaline, Operator Mastery -- epic capstone) | Characteristic Increase (Physique/Reflex to 5) - Skill | -- |

*(Level column and grant structure reconstructed directly from the live class item's `system.advancements` object, sorted by `requirements.level` -- see Part 2 for the raw schema.)*

### Core Class Features (Non-Subclass)

- **Veteran of the Sprawl** (4th) -- Passive. Passively detects security, drones, and Corp-Milspec presence within 1 mile; fluent in reading corp/gang signal traffic; +1 effective Renown with corp/gang contacts; frightens Corp-Milspec operatives on first awareness of you if they fail a potency-average save.
- **Breach Point** (4th, source: Heroes p.138) -- **Definition:** a breach point is a standing, reusable tear you personally open between the physical world and **the deep network** -- a hidden, secured layer of the Wired distinct from ordinary node traffic, reachable only through a breach point and anchored on your end to a **live relay node** (a node you or an ally has set up and is actively maintaining; see Ghost of the Sprawl, 9th level, for how to establish one yourself). As a Main Action, touch a live relay node to open a breach point into the deep network. You can then spend a Main Action to route yourself and any willing creatures within 10 squares of you through the breach and onto a secured **safehouse node** on the other side, or to route back again the same way. You can maintain a number of breach points simultaneously equal to your Physique (Might) score, and every breach point you hold leads to the *same* safehouse node -- it's one hideout with multiple doors, not a network of separate destinations. If a breach point in your network is destroyed, it drops out of your network (and no longer counts against your Might-score limit); you can remove a breach point from your network voluntarily at any distance, including across different networks entirely, with no action required. *(Exploring the deep network itself from your safehouse node is possible, but the feature's own text is explicit that continued safety there is not guaranteed -- it's a refuge, not a sealed vault.)*
- **Combat Form** (4th) -- Passive. Visible chrome-flare cosmetic effect, plus immunity to acid, cold, fire, sonic, corrosive, and kinetic-feedback damage equal to your Physique (Might) score.
- **Growing Adrenaline I** (4th) -- Passive. Unlocks bonus effects on other abilities/features when you have 8 or more Adrenaline.
- **Damaging Adrenaline** (4th) -- Passive. The first damage you take each round grants 2 Adrenaline instead of 1 (later upgraded to 3 by Peak Adrenaline at 10th, replacing rather than stacking).
- **Combat Attunement** (4th) -- Passive. Passively detects elemental immunities/weaknesses and active damage sources within 10 squares.
- **Precision Strike** (4th) -- Passive/triggered. Spend 1 Adrenaline as part of any strike to surge 1; the damage type can be changed to elemental (your choice) for that strike.
- **Growing Adrenaline II** (7th) -- Passive. Unlocks a second tier of bonus effects when you have 10 or more Adrenaline.
- **Harbinger of the Primordial Chaos / "Ghost of the Sprawl"** (9th) -- Respite activity. Establish a temporary secured relay node (lasts 24 hours after creation) that can be used with your Breach Point feature to open a breach point into the deep network; if used this way, the relay node persists as long as the breach point is maintained.
- **Warzone Incarnate** (10th) -- Passive, upgrades Combat Form (4th). Immunity to acid, cold, fire, sonic, corrosive, and kinetic-feedback damage rises to twice your Physique (Might) score. When a hostile combatant whose weapons deal one of those damage types first becomes aware of you in combat, if they have potency strong, they're frightened (save ends). Additionally, when you use Precision Strike, you can spend up to 3 Adrenaline, gaining 1 surge per Adrenaline spent, for that strike.
- **Growing Adrenaline III** (10th) -- Passive. Unlocks a third tier of bonus effects when you have 12 or more Adrenaline.
- **Peak Adrenaline** (10th) -- Passive, replaces Damaging Adrenaline's 4th-level value. The first time you take damage each combat round, you gain 3 Adrenaline instead of 2.
- **Operator Mastery** (10th, epic capstone) -- Passive. You gain an epic resource called **Overclock**. Each time you finish a respite, you gain Overclock equal to the XP you gain. You can spend Overclock on your abilities as if it were Adrenaline. You can also spend any amount of Overclock as a Free Maneuver, ending one effect on you per Overclock spent, and you can spend 3 Overclock to open a breach point into the deep network without needing a live relay node. Overclock remains until you spend it (no reset).

### Chrome an Operator Runs

*(Not yet cross-referenced against `GHOSTWIRE-Chrome-Catalog-v1.md` for Operator-specific implant recommendations -- unlike the Hacker's Matrix & Signals lean, the Operator's chrome profile likely leans Combat/Reflex implant categories. Flagged as an open item for a future pass rather than guessed here, per Pre-Flight Doctrine.)*

Body Integrity (chrome capacity) uses the same formula as every other class: `6 + Physique (Might) + Echelon` (or the leaner `4 + Physique (Might) + Echelon`, still under review per the Chrome Rules v1 draft) -- see `GHOSTWIRE-Chrome-Rules-v1.md` and `GHOSTWIRE-Chrome-Catalog-v1.md` for full install rules, Echelon/grade doctrine, and pricing.

---

## PART 2 -- AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This section is a technical reference for future agents/sessions rebuilding, patching, or extending the Operator class in Foundry. It documents real schemas, real IDs, real folder structure, and known caveats -- nothing here is guessed. Per Pre-Flight Doctrine, verify any field path live before writing code that touches it.*

### Module Scope (Standing Rule)

All GHOSTWIRE Foundry work is scoped to the `ghostwire` module folder and its compendiums:

- `ghostwire.ghostwire-classes` -- Operator class item, 3 subclass items, all base/tier heroic abilities and features documented below
- `ghostwire.ghostwire-kits` -- shared Kit items (19 possible kits, referenced but not resolved by this dump)
- `ghostwire.ghostwire-abilities` -- not directly touched by this dump; Operator's abilities live in `ghostwire-classes` per the folder structure below, unlike the Hacker's Matrix Verbs which live in `ghostwire-abilities`

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`.

### Data Provenance -- How This Document Was Built (Important)

Unlike the Hacker doc (built from a rebuild script's `ITEMS` array), this document's ground truth comes from a **read-only diagnostic dump**, not a deploy script. Three iterations were needed to extract it from Michael's environment:

1. **`Backup-Ghostwire-Operator-FullDump-v1.js`** -- dynamic UUID-discovery pattern (no hardcoded IDs), walks the Operator class item's own `system.advancements` pool, resolves every linked item via `fromUuid()`, and best-effort name-matches the 3 subclass items. Relied on console `copy()` for output -- failed silently on the ~137KB payload in Michael's browser.
2. **`Backup-Ghostwire-Operator-FullDump-v2.js`** -- same discovery logic, replaced `copy()` with a `Blob`+`<a download>` browser file-download trigger. **Failed for this user's Windows setup** -- no registered `.json` file handler, produced a Microsoft Store "get an app" prompt instead of a clean download. **Do not suggest browser file-download again for this user.**
3. **`Backup-Ghostwire-Operator-FullDump-v3.js`** -- same discovery logic, switched to `navigator.clipboard.writeText()` with an automatic chunked `console.log` fallback (4000-char chunks, clearly delimited `=== CHUNK N/36 START/END ===` markers) if clipboard access is denied. **This is the version that worked.** Clipboard itself failed with `NotAllowedError: Document is not focused` (a browser focus quirk, not a script bug), but the fallback triggered automatically and printed all 36 chunks cleanly. Michael captured the full console output into `paste.txt` and uploaded it.

**This chunked-fallback pattern (Clipboard API + automatic chunked console-print fallback) is the proven, working method for extracting large live-Foundry JSON dumps from this user's environment. Reuse this exact pattern for the Elementalist dump and any future large-payload extraction from Michael's Foundry instance.**

Source dump file: `/home/user/workspace/uploaded_attachments/c0bdfebaaef74077bae91ded1852d97f/paste.txt` (4,768 lines, reconstructed from 36 console chunks -- contains interleaved `VM498:NNN` console-frame markers mixed into the JSON text, so it is not valid standalone JSON as pasted; read as sequential text, not `json.loads()`, unless first stripped of the marker lines).

### Item Inventory (Live, Ground Truth -- This Dump)

33 top-level items resolved cleanly (confirmed via the dump's own summary: `"subclassItems": []`, `"missing": []` -- meaning zero resolution failures, but also zero subclass-nested items resolved):

| Category | Count | IDs |
|---|---|---|
| `class` | 1 | Operator (`GWOperator000001`) |
| `subclass` | 3 | Corp-Milspec (`GWSubCorpMil0001`), Merc (`GWSubMerc0000001`), Street-vet (`GWSubStreetVet01`) |
| `ability` (signature) | 2 | Controlled Pair (`GWSigCtrlPair001`), Suppressing Fire (`GWSigSupprFire01`) |
| `ability` (base heroic, 1-5 cost) | 5 | Breach & Clear (`GWHeroBreach0001`), Trigger Cadence (`GWHeroCadence001`), Hold the Line (`GWHeroHoldLine01`), Overwatch (`GWHeroOverwatch1`), Adrenaline Dump (`GWHeroAdrenDump1`) |
| `ability` (7-cost tier) | 4 | Chrome Unleashed (`GWOpT3AbChrome01`), Face the Hail (`GWOpT3AbHail0010`), Armor Breaker (`GWOpT3AbArmBrk10`), Already Flatlined (`GWOpT3AbFlatln10`) |
| `ability` (9-cost tier) | 4 | Crippling Burst (`GWOpT5AbCrippl10`), My Move! (`GWOpT5AbMyMove10`), Rebounding Fire (`GWOpT5AbReboun10`), Lock Down! (`GWOpT5AbLockDn10`) |
| `ability` (11-cost tier) | 4 | Overclocked Adrenaline (`GWOpT8AbOvrClk10`), Overkill (`GWOpT8AbOvrKil10`), Combat Trance (`GWOpT8AbTrance10`), Relentless (`GWOpT8AbRelent10`) |
| `feature` | 10 | Veteran of the Sprawl (`GWOpFtVetSprwl10`), Breach Point (`GWOpFtBrchPnt010`), Combat Form (`GWOpFtCbtForm010`), Greater Adrenaline (`GWOpFtGrtAdren10`), Growing Adrenaline I (`GWOpFtGrowAdr010`), Growing Adrenaline II (`GWOpFtGrowAdr020`), Damaging Adrenaline (`GWOpFtDmgAdren10`), Combat Attunement (`GWOpFtCbtAttun10`), Precision Strike (`GWOpFtPrecStrk10`), Ghost of the Sprawl (`GWOpFtGhstSprw10`) |
| `feature` (level 10 capstone group) | 4 | Warzone Incarnate (`GWOpFtWarzone010`), Growing Adrenaline III (`GWOpFtGrowAdr030`), Peak Adrenaline (`GWOpFtPeakAdrn10`), Operator Mastery (`GWOpFtOpMastry10`) |
| `feature` (resource explainer) | 1 | Adrenaline (`GWOpFtAdrenlin10`) |

**NOT resolved by this dump (closed by the subclass-recursive follow-up dump documented above, except where noted):**

- All subclass-specific feature/ability items -- Corp-Milspec's `GWCMF001` through `GWCMF010GhostWir` (features) and `GWCMA002/004/005/007/008/011/012GhostWir` (abilities); Merc's `GWMCF001-010GhostWir` / `GWMCA002/004/005/007/008/011/012GhostWir`; Street-vet's `GWSVF001-011GhostWir` / `GWSVA002/005/006/008/009/012/013GhostWir`. **RESOLVED as of 2026-07-28** by the subclass-recursive dump (37 of 37 items, see above and Part 1's subclass sections).
- Kit items (`GWKit01000000000` through `GWKit19000000000`, in `ghostwire-kits`) -- referenced by UUID from each subclass's Kit advancement (confirmed present at multiple lines in the raw dump, e.g. lines 912-939; 57 such UUIDs correctly skipped by the recursive dump script as out-of-scope). **Still NOT resolved to full item bodies** -- these are the shared kit pool other classes also draw from; likely don't need re-deriving here at all (see Hacker doc's Cyberdeck-vs-shared-Kit distinction), but worth a direct `ghostwire-kits` pack pull if the Operator doc ever needs kit-by-kit synergy notes, or to settle the Merc's open two-kit-stacking question (see Known Bugs/Caveats).

### The Feature/Ability Pairing Pattern (Partial Match to Hacker)

Unlike the Hacker class -- where nearly every ability has a same-named `feature` counterpart carrying the prose while the `ability` item carries only mechanical roll data -- **the Operator's base/tier heroic abilities are largely self-contained.** Every ability item resolved in this dump (signatures, base tier, 7/9/11-cost tiers) carries its own `system.story` flavor line AND its own `system.effects.before0000000000.description` or `power.effects.<id>.damage` block with real tiered mechanics inline -- there is no parallel "feature" item duplicating that text for most of them.

The **feature**-type items in this dump (Veteran of the Sprawl, Breach Point, Combat Form, Adrenaline, the Growing Adrenaline chain, Ghost of the Sprawl, Warzone Incarnate, Peak Adrenaline, Operator Mastery) are genuinely standalone passives with their own `system.description.value` -- they are not the "text half" of a paired ability item the way Hacker features are. **Do not assume the Hacker's pairing pattern applies here without verifying per-item** -- this is a real structural difference between the two classes worth flagging, not an inconsistency to "fix."

### Class Item Schema (`GWOperator000001`, type `class`)

Key fields under `system`, confirmed live:

```
_dsid: "operator" (inferred from prerequisites.dsid on child items; not directly captured on the class item's own dump line, verify before citing)
primary: "Adrenaline"
epic: "Combat Legend"
turnGain: "1d3"
minimum: "0"
characteristics.core: ["might", "agility"]   // real DS keys; display as Physique/Reflex
stamina: { starting: 21, level: 9 }
recoveries: 10
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], additional: {...} } }
```

24 advancement entries total on the class item, spanning levels 1-10 (full breakdown in Part 1's progression table, reconstructed by `requirements.level`). Notable structural differences from the Hacker class item:

- `primary`, `epic`, `turnGain`, and `minimum` fields exist on both classes' schemas, but the VALUES differ meaningfully (`"1d3"` turn income vs. Hacker's flat `"1"`) -- this is a genuine mechanical difference (variable vs. flat resource income), not a data error.
- `characteristics.core` uses `["might", "agility"]` for Operator vs. `["reason", "intuition"]` for Hacker -- always translate to Physique (Might)/Reflex (Agility) in player-facing output, never the raw DS key.

### Ability Item Schema (Signatures / Base Heroics / Tier Abilities)

```
type: "ability"
system: {
  source: { book: "Heroes"|"GHOSTWIRE"|null, page, license },  // Operator's tier abilities cite real "Heroes" book/page -- flag any GHOSTWIRE-original ability (base tier 1-5) as having source.book: null or a GHOSTWIRE-specific tag if present; verify per item
  _dsid: <string>,
  story: <flavor line>,
  keywords: [...],   // e.g. ["magic"], ["magic","melee","strike","weapon"] -- note "magic" keyword appears even on purely mundane/kinetic Operator abilities; this is a real Draw Steel engine quirk (all Power Roll-based abilities carry the "magic" keyword in this ruleset's schema), not a GHOSTWIRE authoring error
  type: "main" | "maneuver" | "triggered" | "free",
  category: "heroic",
  resource: <number>,           // Adrenaline cost -- always a plain integer (1,2,3,5,7,9,11), never null on Operator abilities (unlike some Hacker Programs)
  trigger: <string>,             // populated on triggered-type abilities (e.g. Hold the Line, Overwatch, My Move!)
  distance: { type: "melee"|"ranged"|"self", primary, secondary, tertiary },
  target: { type: "creature"|"self"|"creatureObject", custom, value },
  power: {
    roll: { formula: "@chr", characteristics: ["might"]|["agility"]|[], reactive: false },
    effects: { <effectId>: { type: "damage"|"applied"|"other", ... } }   // Operator abilities generally DO carry populated power.effects inline, unlike most Hacker Programs which leave this empty and put tier text on a paired feature
  },
  prerequisites: { dsid: ["operator"], value: "", level: null },
  effects: { <effectId>: { type: "base", description: <html>, before: true|false, name, sort } }  // "before" effects hold pre-roll setup text (e.g. Overclocked Adrenaline's temp-Stamina grant); "after" effects hold post-roll resolution text (e.g. Overkill's minion-execute clause)
}
```

`power.roll.characteristics` is a real Draw Steel key (`might` or `agility`, or an empty array for pure self-buffs with no rolled component like Trigger Cadence, Overclocked Adrenaline, and Combat Trance) -- **always translate to Physique (Might) / Reflex (Agility) in any player-facing output.**

**Effect type variety confirmed live on Operator abilities (a broader set than seen on Hacker items):** `"damage"` (standard tiered damage), `"applied"` (status conditions like Slowed/Restrained with their own tier1/2/3 potency and condition-end rules, e.g. Lock Down!'s `VwSyswiB3fTwYpDp` effect), and `"other"` (freeform tiered text with no damage/condition structure, e.g. Relentless's instant-kill threshold effect `LTsU7FOxoOrpMWwR`). Any future parsing script must branch on `effects.<id>.type` rather than assuming all effects are damage-shaped.

### Feature Item Schema

```
type: "feature"
system: {
  description: { value: <html rules text>, director: <html, optional GM-only guidance> },
  source: { book, page, license },
  _dsid: <string>,
  advancements: {},   // empty on every Operator feature item resolved in this dump
  prerequisites: { value: "", dsid: [] | ["operator"], level: null }
}
```

Matches the Hacker feature schema closely, with one addition worth flagging: several Operator features carry a populated **`description.director`** field (GM-only guidance text) -- e.g. Warzone Incarnate's director note explicitly states it's an upgrade of Combat Form and instructs the GM/player to raise the existing effect's values rather than stack a second copy. **This director-note pattern was not observed on any Hacker feature item** -- worth adopting for future Operator (and Elementalist) feature-writing where a level-10 capstone explicitly supersedes an earlier passive, since it gives in-line implementation guidance the Hacker doc currently has to state out-of-band in Part 2 instead.

### Folder Structure (Live)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Operator class item (shared folder with Hacker class item, per the Hacker doc's own folder table) |
| `ghostwire-classes` | `GWOpSubclass0001` | 3 Origin subclass items |
| `ghostwire-classes` | `GWOpSignatures01` | 2 signature abilities |
| `ghostwire-classes` | `GWOpHeroics00001` | 5 base-tier (1-5 cost) heroic abilities |
| `ghostwire-classes` | `GWOpTiersFldr001` | All 12 tier abilities (7/9/11-cost, 4 each) |
| `ghostwire-classes` | `GWOpFeatures0001` | All 15 feature items (core passives + capstone group + Adrenaline resource explainer) |

**Structural note -- CORRECTED 2026-07-28:** the class-level dump's items (class, subclasses, signatures, base heroics, tier abilities, features) do all live inside `ghostwire.ghostwire-classes`, as originally stated. **However, the subclass-recursive dump proved this does NOT hold for doctrine-specific content:** every doctrine **feature** (Breaching Force, Combat Instinct, Gutter Instinct, etc.) resolves from `ghostwire.ghostwire-classes`, but every doctrine **ability** (Kinetic Redirect, Wired Reflexes, Overclock Nerves, and all 2nd/6th/9th-tier doctrine abilities) resolves from `ghostwire.ghostwire-abilities` instead. **The Operator's doctrine layer splits across both compendiums exactly like the Hacker class does** -- the original claim that "the entire Operator build lives inside `ghostwire-classes`" was wrong and is retracted. Any future script targeting Operator doctrine items must query both compendiums, not just `ghostwire-classes`.

### Deploy/Fix Script Reference (Chronological, Authoritative Order)

The Operator class was NOT built via a documented deploy script visible in this session's source files -- unlike the Hacker's `Deploy-Ghostwire-Hacker-Rebuild-v1.js`, no equivalent `Deploy-Ghostwire-Operator-*.js` creation script has been located or reviewed as of this writing. The class exists live in Foundry, confirmed first by `Diagnose-Ghostwire-Hacker-vs-Operator-Advancements.js` (read-only diagnostic, prior session) and now fully catalogued by the three dump scripts below (all read-only, zero writes):

1. **`Backup-Ghostwire-Operator-FullDump-v1.js`** -- read-only, dynamic UUID-discovery, `copy()`-based output. Superseded by v3 for output delivery; discovery logic itself is sound and reused unchanged in v2/v3.
2. **`Backup-Ghostwire-Operator-FullDump-v2.js`** -- read-only, same discovery logic, Blob+download output. **Failed for this user's Windows setup -- do not reuse this output method.**
3. **`Backup-Ghostwire-Operator-FullDump-v3.js`** -- read-only, same discovery logic, Clipboard API + chunked console fallback. **This is the version that worked and produced the ground truth for this document.**

**Open item:** the actual original creation script for the Operator class (equivalent to `Deploy-Ghostwire-Hacker-Rebuild-v1.js`) has not been located in this session. If it exists, it would be the more authoritative source for anything not captured by this read-only dump (e.g., original `img` paths beyond what's inline here, original folder-creation order, any original `_stats.createdTime` cross-check). If Michael confirms no such script exists (i.e., the Operator was hand-built directly in the Foundry UI), that should be noted here explicitly rather than assumed.

### Known Bugs / Caveats for Future Agents

1. **RESOLVED 2026-07-28 -- Subclass-nested feature/ability items.** Previously the biggest open gap in this document. All 37 doctrine-specific feature and ability items named in Part 1's subclass tables (Corp-Milspec x12, Merc x12, Street-vet x13) were resolved via the subclass-recursive dump documented above and now carry full mechanical text in Part 1. The 3 advancements that appeared "unresolved" in the dump's own output (Strategy, Sabotage, Intimidate) were investigated and confirmed to be `type: "skill"` advancements using a `skills.choices` field instead of `pool` -- **not bugs**, and already correctly named in the subclass tables. **The compendium-split finding from this dump also corrected item 1's former root-cause assumption** -- see the "Structural note -- CORRECTED" callout above: doctrine features live in `ghostwire-classes`, doctrine abilities live in `ghostwire-abilities`.
2. **Michael's explicit heads-up: "there are likely a few bugs" in the Operator build.** Nothing overtly broken surfaced while parsing either dump -- all resolved items (33 class-level + 37 subclass-level) have well-formed `system` blocks, consistent `prerequisites.dsid: ["operator"]` tagging, and no null/malformed damage tiers were found. Two cosmetic oddities from the class-level dump remain unconfirmed as the actual flagged bug(s): (a) several advancement/effect sub-objects have `"img": null` -- likely harmless default state, matching a pattern also seen on Hacker items; (b) the class item's own `"level": 0` field mirrors the same field/value seen on the Hacker class item, likely a template default. With the subclass layer now fully resolved and no anomalies found there either, **the actual bug(s) Michael flagged remain unidentified** -- recommend a live in-Foundry playtest pass (character build + a few rounds of combat) rather than further static dump analysis, since nothing in either dump's data shape points to a specific defect.
3. **OPEN -- Kit items are not resolved, and the Merc's "two kits" interaction is unconfirmed.** The Merc Origin's "Field Arsenal training (maintains TWO kits)" framing is confirmed structurally live -- its Kit advancement grants a `chooseN` of 2 distinct from the other Origins' single choice -- but none of the 12 newly-resolved Merc doctrine items address kit-stacking mechanics directly, and no rule was captured explaining HOW a second kit's bonuses combine with the first (stack both fully, apply only the better of the two per-stat, or something else). **This is the one open question the subclass-recursive dump did NOT close.** Recommend either a direct pull of the `ghostwire-kits` compendium items themselves, or asking Michael directly, before assuming an interaction rule.
4. **No creation/deploy script located for this class.** Unlike the Hacker, whose full 74-item creation payload was extractable from `Deploy-Ghostwire-Hacker-Rebuild-v1.js`, this document's ground truth comes entirely from a live read-only dump. If Michael has (or can locate) an original Operator deploy script, it should be cross-checked against this document for any field this dump's discovery logic might have missed (e.g., original `img` icon paths beyond the handful inline here, or items that exist in the compendium but aren't linked from the class item's advancement pool at all and so were invisible to UUID-walking discovery).
5. **7/9/11-cost tier abilities are adapted "Heroes" supplement content, not GHOSTWIRE-original.** All 12 tier-ability items carry `system.source.book: "Heroes"` with real page citations (136-141) and `license: "Draw Steel Creator License"` -- distinct from the Adrenaline feature's `source.book: "GHOSTWIRE"` / `license: "GHOSTWIRE reskin (Draw Steel Creator License)"`. **This is a real, confirmed content-provenance split within the same class** -- flag clearly in any future licensing/attribution pass, and do not assume the same reskin-authorship model applies uniformly across the whole Operator kit the way it does for the Hacker's fully custom Program list.
6. **RESOLVED 2026-07-28 -- recursive subclass dump.** See item 1 and the Data Provenance section above; Part 1's subclass tables are now both structurally and mechanically complete for all 37 doctrine items.
7. **OPEN DEV WORK ITEM: Operator-specific Chrome/cyberware recommendations not yet drafted.** Unlike the Hacker doc's "Chrome a Hacker Runs" section (which names specific Matrix & Signals implants), this document's equivalent section is a placeholder -- no Combat/Reflex-category implant cross-reference has been done yet against `GHOSTWIRE-Chrome-Catalog-v1.md`. Treat as a follow-up pass, not yet started.

### Source File Index

| Purpose | Path |
|---|---|
| Canonical build log (single source of truth for build state) | `/home/user/workspace/GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Companion class doc (Hacker, same format) | `/home/user/workspace/Ghostwire_Hacker_Development_Master.md` |
| Live read-only Operator dump, raw console capture (36 chunks, ground truth for this document) | `/home/user/workspace/uploaded_attachments/c0bdfebaaef74077bae91ded1852d97f/paste.txt` |
| Superseded early concept draft (do not use as ground truth) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/c1db85f2-41fb-4c6f-aaaf-9cb71e724cbc/operator.md` |
| Dump script v1 (copy()-based, discovery logic reused by v2/v3) | `/home/user/workspace/Backup-Ghostwire-Operator-FullDump-v1.js` |
| Dump script v2 (Blob-download, failed for this user's Windows setup) | `/home/user/workspace/Backup-Ghostwire-Operator-FullDump-v2.js` |
| Dump script v3 (Clipboard API + chunked fallback -- the one that worked) | `/home/user/workspace/Backup-Ghostwire-Operator-FullDump-v3.js` |
| Original diagnostic proving Operator exists live (prior session) | `/home/user/workspace/ghostwire/foundry_build/Diagnose-Ghostwire-Hacker-vs-Operator-Advancements.js` |
| Subclass-recursive dump v1 (buggy, ModelCollection issue, 0 resolved) | `/home/user/workspace/Backup-Ghostwire-Operator-Subclass-Recursive-v1.js` |
| Subclass advancement-shape diagnostic (confirmed `toObject()` fix needed) | `/home/user/workspace/Diagnose-Ghostwire-Operator-Subclass-AdvancementShape-v1.js` |
| Subclass-recursive dump v2 (working, 37 items resolved -- ground truth for Part 1's subclass sections) | `/home/user/workspace/Backup-Ghostwire-Operator-Subclass-Recursive-v2.js` |
| Validated subclass dump JSON (118,575 chars) | `/home/user/workspace/operator_subclass_dump.json` |
| Human-readable subclass item breakdown | `/home/user/workspace/operator_subclass_items_readable.txt` |
| Pre-Flight Doctrine (governing process rules) | `/home/user/workspace/GHOSTWIRE_Preflight_Doctrine_v1.md` |
| Chrome/cyberware rules (Body Integrity, Echelon doctrine) | Uploaded `GHOSTWIRE-Chrome-Rules-v1.md` |
| Chrome/cyberware catalog (implant stats) | Uploaded `GHOSTWIRE-Chrome-Catalog-v1.md` |

---

*End of GHOSTWIRE Operator Class Compendium. As of 2026-07-28, this document is both structurally and mechanically complete -- the subclass-recursive dump closed the last major content gap, and all 37 doctrine-specific features and abilities across Corp-Milspec, Merc, and Street-vet now carry full rules text in Part 1. The only remaining open item is the Merc's two-kit stacking interaction (see Known Bugs/Caveats, item 3). Elementalist work may begin once Michael reviews this update and decides whether to resolve the Merc kit question first.*
