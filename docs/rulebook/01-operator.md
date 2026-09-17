# Ghostwire Core Rulebook — Chapter: The Operator

**Status:** Stage 2 draft — awaiting Michael review  
**Source of record:** `docs/masters/GHOSTWIRE_OPERATOR_DEVELOPMENT_MASTER.md` Part 1 (2026-07-28)  
**Draw Steel spine:** Heroes martial doctrines (Conscript / Mercenary / Vindicator–style Origins), reskinned  
**Notes for review:** Foundry item IDs and old-build dump references removed. Merc dual-kit stacking rule still **open**. 7/9/11-cost abilities remain Heroes-adapted (Creator License attribution). Provisional DS-alignment flags inline where Ghostwire flavor leans on “deep network / breach point” — keep for now; Wire chapter will cross-link later.

---

## PART 1 -- PLAYER-FACING: THE OPERATOR

### Who You Are

You are an **Operator** -- a street samurai, edgerunner, or professional shooter who fights with chrome, discipline, and a body wired to run hotter than anyone else on the field. You don't hack the Wired and you don't burn magic; you close distance, put rounds and blades where they count, and keep coming back for more when everyone else would already be down.

Where you distinguish yourself is discipline under pressure. Whether you're a **Corp-Milspec** asset running fire-team doctrine, a **Merc** carrying two kits into every job, or a **Street-vet** who survived the gutter long enough to become a professional, your identity is the same: chrome-forward, casts nothing, and dangerous specifically because you do not stop.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Physique, Reflex |
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

Every Operator knows both signature abilities at 1st level -- these are your baseline, no-Adrenaline-cost ranged options, both rolled with Reflex:

| Signature | Type | Target | Damage (low / middle / high) |
|---|---|---|---|
| **Controlled Pair** | Ranged strike | 1 creature | 3+chr / 6+chr / 9+chr |
| **Suppressing Fire** | Ranged area (cube 3, range 10) | Each enemy in the area | 1 / 2 / 3 (flat, control-focused) |

**Controlled Pair** is your bread-and-butter single-target ranged strike -- two aimed shots, scaling cleanly with Physique via the `@chr` damage bonus. **Suppressing Fire** trades raw damage for area coverage -- low, flat numbers by design, meant to threaten a zone and set up battlefield control rather than drop a single target fast.

### Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are the Operator's spell-equivalent -- chosen by cost band as you level, each one an Adrenaline-fueled burst of trained violence. All base-band abilities (costs 1-5) are GHOSTWIRE-original; **all 7-cost, 9-cost, and 11-cost band abilities are adapted from the published Draw Steel "Heroes" supplement (pages 136-141)**, not custom-authored for GHOSTWIRE -- flagged here plainly since this differs from the Hacker class's fully custom Program list (see Part 2, Known Bugs/Caveats, for why this matters to future content work).

#### Base Band (1-5 Adrenaline, chosen at 1st level, GHOSTWIRE-original)

| Ability | Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Breach & Clear** | 1 | Main Action | Ranged strike (dist 10) | Damage 3/6/9, plus a forced-Slide rider (dist 2/3/5); moving into a vacated square lets opportunity-attack damage transfer to the target |
| **Trigger Cadence** | 2 | Free Maneuver | Self | No roll. You surge 1, and the next ability roll you make this turn automatically obtains a high (17+) outcome |
| **Hold the Line** | 2 | Free Triggered | Ranged strike (dist 3) | Trigger: enemy enters adjacent or within 3 squares. Damage 2/5/7 |
| **Overwatch** | 3 | Free Triggered | Ranged strike (dist 10) | Trigger: first time each enemy enters/acts in a zone this encounter (once per enemy). Damage 3/6/9 |
| **Adrenaline Dump** | 5 | Main Action | Ranged strike, up to 3 creatures (dist 10) | Damage 3/6/10; can deal 1d6 damage to yourself to deal an extra 1d6 damage to the target |

**Trigger Cadence** is the standout of this band -- a guaranteed high (17+) on your very next roll this turn is an enormous tempo swing for 2 Adrenaline, and it costs only a Free Maneuver. **Adrenaline Dump** is the aggressive, multi-target closer of the band, with a genuine self-harm-for-more-damage rider that rewards a player willing to spend their own Stamina for burst.

#### 7-Cost Band (chosen at 3rd level, source: Heroes p.136, self-targeted maneuvers)

| Ability | Effect |
|---|---|
| **Chrome Unleashed** | No roll. Enemies adjacent to you at the start of their turn (potency strong or better) become frightened until the end of that turn, for the rest of the encounter or until you're dying |
| **Face the Hail** | No roll. Melee strikes vs. potency-average-or-better targets taunt them until the end of their next turn; abilities dealing rolled damage vs. taunted targets deal +2x Physique extra damage and +1 potency, for the rest of the encounter |
| **Armor Breaker** | No roll. Gain 20 temporary Stamina |
| **Already Flatlined** | Melee strike, no tiered damage table -- effects are entirely in the ability text: non-leader/solo targets are reduced to 0 Stamina at the end of their next turn; leader/solo targets instead grant you a surge 3 + a free melee strike |

#### 9-Cost Band (chosen at 5th level, source: Heroes p.137)

| Ability | Type | Damage (low / middle / high) | Notable Rider |
|---|---|---|---|
| **Crippling Burst** | Melee strike, Physique | 10+chr / 14+chr / 20+chr | Applies Slowed (save ends); while slowed this way, target takes 1 damage per square moved, including forced movement |
| **My Move!** | Free Triggered melee strike, Physique | 6+chr / 9+chr / 13+chr | Trigger: you're winded/dying, or damaged while winded/dying. You can spend a Recovery |
| **Rebounding Fire** | Melee strike hitting 2 creatures, Physique | 9+chr / 14+chr / 19+chr | Push rider (dist 3/5/7) with a "pinball" collision rule -- colliding with another creature/object mid-push deals the push damage again and continues the push |
| **Lock Down!** | Melee strike, Physique | 9+chr / 13+chr / 18+chr | Applies Slowed (save ends); while the target is slowed this way, any other effect that would slow them instead **Restrains** them; a target that fails its save while Restrained this way becomes **Locked Down** until given specialist medical attention or you choose to reverse the effect (no action required) |

#### 11-Cost Band (chosen at 8th level, source: Heroes p.140-141)

| Ability | Type | Effect |
|---|---|---|
| **Overclocked Adrenaline** | Self, no roll (maneuver) | Gain 10 temporary Stamina. Choose acid, cold, fire, sonic, corrosive, or kinetic feedback as your overclocked damage type. Until the end of the encounter or until you're dying, whenever an enemy damages you, they take 10 damage of the chosen type; if this reduces the enemy to 0 Stamina, you gain another 10 temporary Stamina |
| **Overkill** | Main Action, melee strike, Physique | Damage 6+chr/10+chr/14+chr. If the target is a minion or winded (and not a leader/solo), they're reduced to 0 Stamina before this ability's damage is dealt. If the target dies from this damage, any damage over what was required to kill them carries over to another creature within 5 squares |
| **Combat Trance** | Self, no roll (maneuver) | Choose a damage type as above. Until the end of the encounter or until you're dying, one target of any ability you use each activation takes an extra 15 damage of the chosen type. Additionally, whenever you gain Adrenaline from taking damage, the source of that damage takes 5 damage of the chosen type |
| **Relentless** | Main Action, self-targeted melee, Physique | You shift up to your speed; each enemy you move adjacent to during this shift takes 2x Physique damage, then one power roll targets each enemy moved adjacent to. Result-band instant-kill thresholds: low kills targets at 8 Stamina or less, middle at 11 or less, high at 17 or less. Gain 1 Adrenaline per target killed this way (max 11) |

**Note on the 11-cost band:** three of the four (Overkill, Combat Trance, Relentless) key their result-banded effects/damage off Physique; Overclocked Adrenaline has no roll characteristics at all (pure self-buff). Relentless in particular is the band's signature "clear a room" option -- a mobile execute that also refuels your Adrenaline pool directly.

### Origin Subclasses

At 1st level you choose your **Operator Origin** -- your professional background, which shapes your kit access, your unique skill, and a full ladder of doctrine-specific features and abilities through 9th level. All doctrine content below was pulled from a live recursive dump of each subclass item's own advancement pool (source: Heroes p.131-145, GHOSTWIRE reskin -- these three Origins are the game's own Conscript/Mercenary/Vindicator-style doctrines, not GHOSTWIRE-original content) and is now fully resolved -- no placeholders remain.

**@chr** below always means your Physique score (the Operator's core characteristic used for these power rolls); **potency** values scale with the ability's own cost band and the listed resisting characteristic.

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

- **Breaching Force** (1st, Heroes p.131) -- As your Adrenaline surges, your Physique score increases by 2 (this increase is already baked into this document's stat block). Additionally, whenever your Adrenaline is full, you gain an edge on power rolls made with abilities that have the melee weapon keyword.
- **Breach Charge** (2nd, Heroes p.134) -- You ignore difficult terrain while charging, and your charge can end in a space adjacent to any number of enemies rather than just one. You can move through enemy spaces during this movement (triggering opportunity attacks as normal). Immediately after resolving the ability, you can make a shove test against one adjacent enemy as a free maneuver instead of using the charge main action.
- **Jump Rig** (5th, Heroes p.137) -- Your jump distance and height double. When you fall, reduce the effective fall height by a number of squares equal to your jump distance for damage/prone purposes. You're not prone after falling onto another creature.
- **Anchored Stance** (6th, Heroes p.136) -- +2 bonus to Stability. Forced movement effects that would move you are reduced by 2 squares (minimum 0).
- **Overpowering Build** (8th, Heroes p.140) -- +1 bonus to Physique-based power rolls. Once per round, whenever you'd spend Adrenaline, you can spend 1 less than required (minimum 0).

**Doctrine Abilities:**

- **Kinetic Redirect** (1st signature, triggered, Heroes p.132) -- Magic, melee 1. Target self or a creature. Trigger: the target would be force moved.
- **Danger Close** (2nd-band, maneuver, 5 Adrenaline, Heroes p.134) -- Melee/weapon, 1 ally. Power roll: no direct damage listed on the trigger line itself -- resolves off your Physique.
- **Demolition Swing** (2nd-band, maneuver, 5 Adrenaline, Heroes p.135) -- Melee/weapon, self. Power roll (low / middle / high): 1/2/3 square push.
- **Orbital Drop** (6th-band, maneuver, 9 Adrenaline, Heroes p.138) -- Magic, self. Power roll (low / middle / high): 7/11/16 damage plus a 3/5/7 square push.
- **Concussive Throw** (6th-band, main, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, 1 creature. Power roll (low / middle / high): 7+@chr / 11+@chr / 16+@chr damage plus a 3/5/7 square push.
- **Fire For Effect** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Area/magic/melee/weapon, burst 3, enemies. Power roll (low / middle / high): 7/10/15 damage plus a 3/5/7 square push.
- **Gravity Well Charge** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Area/magic/melee/weapon, burst 3, enemies. Power roll (low / middle / high): 3/5/8 damage plus a 3/5/7 square pull (vertical).

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
- **Always Moving** (8th, Heroes p.140) -- +2 bonus to Reflex-based power rolls made to disengage or avoid attacks. Disengage as a free maneuver once per round.

**Doctrine Abilities:**

- **Wired Reflexes** (1st signature, triggered, Heroes p.132) -- Self. Trigger: you take damage.
- **Suppression Kill** (2nd-band, main, 5 Adrenaline, Heroes p.135) -- Melee/strike/weapon, 1 creature. Power roll (low / middle / high): 3+@chr / 5+@chr / 8+@chr damage; target is dazed and frightened (save ends) on a failed Persona save.
- **Formation Breaker** (2nd-band, main, 5 Adrenaline, Heroes p.135) -- Melee/weapon, self. Power roll (low / middle / high): 2/4/6 damage; target dazed (save ends) on a failed Reflex save.
- **Contract Fulfilled** (6th-band, free triggered, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, self. Trigger: you reduce a creature to 0 Stamina with a strike.
- **Breach the Line** (6th-band, main, 9 Adrenaline, Heroes p.138) -- Melee/strike/weapon, self. Power roll (low / middle / high): 4+@chr / 6+@chr / 10+@chr damage; target frightened (save ends) on a failed Persona save.
- **Target Marked** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Magic/melee/strike/weapon, 1 creature. Power roll (low / middle / high): 11+@chr / 16+@chr / 21+@chr damage (acid, cold, corruption, fire, lightning, poison, or sonic, ignoring the target's immunities).
- **Shock and Awe** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Melee/strike/weapon, 1 creature. Power roll (low / middle / high): 12+@chr / 18+@chr / 24+@chr damage.

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
- **Dirty Fighting** (2nd, Heroes p.134) -- At the end of each of your turns, each enemy adjacent to you takes damage equal to your Physique score.
- **Street Network** (3rd, Heroes p.136) -- You can talk your way to information from gangers, fixers, and street contacts, and automatically sense the presence of any within 10 squares of you (even hidden). When negotiating with a ganger/fixer/street contact, treat your Renown as 1 higher than usual.
- **Weathered** (5th, Heroes p.137) -- You and each ally within 5 squares ignore negative effects from urban/industrial hazards (banes, toxic fumes, structural collapse, crossfire). Once per respite, call in a favor from a street contact to gain the benefit of a 1st-level Kit trick of your choice for one scene.
- **Ghost of the Gutter** (8th, Heroes p.140) -- You can use any Kit. During a respite, you can swap your Kit and still take another respite activity. Street Network's sense range extends to 1 mile. Whenever you test to track another creature, roll three dice and choose which two to use.

**Doctrine Abilities:**

- **Overclock Nerves** (1st signature, triggered, Heroes p.132) -- Self. Trigger: you lose Stamina and are not dying.
- **Down the Alley** (2nd-band, main, 5 Adrenaline, Heroes p.145) -- Melee/strike/weapon, 1 creature. Power roll (low / middle / high): 4+@chr / 6+@chr / 10+@chr damage; target slowed (save ends) on a failed Instinct save.
- **Killer Rep** (2nd-band, main, 5 Adrenaline, Heroes p.145) -- Area/magic, burst 2, enemies. Power roll (low / middle / high): 2/5/7 damage (cold, corruption, fire, or lightning) plus a 1/2/3 square push; target dazed (save ends) on a failed Physique save.
- **Ambush Rush** (6th-band, main, 9 Adrenaline, Heroes p.139) -- Magic/melee/strike/weapon, 1 creature. Power roll (low / middle / high): 8/13/17 damage; target grabbed on a failed Physique save.
- **Crossfire** (6th-band, maneuver, 9 Adrenaline, Heroes p.139) -- Area/magic, aura 3, creatures.
- **Last Word** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Area/magic, burst 3, enemies. Power roll (low / middle / high): 4/6/10 psychic damage; low: any minion target drops to 0 Stamina; middle: same, plus one winded non-leader/non-solo target also drops to 0; high: every non-leader/non-solo target is winded, plus the same minion/winded-target drop-to-0 riders as middle.
- **Saturation Fire** (9th-band, main, 11 Adrenaline, Heroes p.141) -- Area/magic/ranged, 5x10 cube, enemies. Power roll (low / middle / high): 7/10/15 damage (cold, corruption, fire, or lightning, ignoring all immunities).

### Kits (Your Loadout)

Kit choices are drawn from the shared `ghostwire-kits` compendium (19 possible kits, referenced by UUID from each subclass's Kit advancement) -- the same shared pool other classes draw from, not an Operator-exclusive item type. This document does not re-derive kit stats; see the `ghostwire-kits` compendium directly, or the Hacker doc's Cyberdeck section for the analogous pattern of documenting a kit-slot item type in its own dedicated reference. **Note:** the Merc Origin is unique in equipping two kits simultaneously rather than one. The subclass-recursive dump confirmed the Merc's Kit advancement grants a `chooseN` of 2 distinct from the other Origins' single choice, but the doctrine items themselves are silent on whether a second kit doubles its passive bonuses outright or triggers a distinct interaction rule -- this remains an open question to check directly against the `ghostwire-kits` compendium items (see Known Bugs/Caveats).

### Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Skills (choose 2, exploration/intrigue) - Operator Origin (choose subclass) - Signature Ability (choose 1 of 2) - Heroic Ability (choose 1 of 5, base band) - Adrenaline (heroic resource) | -- | Subclass passive + triggered ability + unique skill + Kit choice(s) |
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
- **Breach Point** (4th, source: Heroes p.138) -- **Definition:** a breach point is a standing, reusable tear you personally open between the physical world and **the deep network** -- a hidden, secured layer of the Wired distinct from ordinary node traffic, reachable only through a breach point and anchored on your end to a **live relay node** (a node you or an ally has set up and is actively maintaining; see Ghost of the Sprawl, 9th level, for how to establish one yourself). As a Main Action, touch a live relay node to open a breach point into the deep network. You can then spend a Main Action to route yourself and any willing creatures within 10 squares of you through the breach and onto a secured **safehouse node** on the other side, or to route back again the same way. You can maintain a number of breach points simultaneously equal to your Physique score, and every breach point you hold leads to the *same* safehouse node -- it's one hideout with multiple doors, not a network of separate destinations. If a breach point in your network is destroyed, it drops out of your network (and no longer counts against your Physique-score limit); you can remove a breach point from your network voluntarily at any distance, including across different networks entirely, with no action required. *(Exploring the deep network itself from your safehouse node is possible, but the feature's own text is explicit that continued safety there is not guaranteed -- it's a refuge, not a sealed vault.)*
- **Combat Form** (4th) -- Passive. Visible chrome-flare cosmetic effect, plus immunity to acid, cold, fire, sonic, corrosive, and kinetic-feedback damage equal to your Physique score.
- **Growing Adrenaline I** (4th) -- Passive. Unlocks bonus effects on other abilities/features when you have 8 or more Adrenaline.
- **Damaging Adrenaline** (4th) -- Passive. The first damage you take each round grants 2 Adrenaline instead of 1 (later upgraded to 3 by Peak Adrenaline at 10th, replacing rather than stacking).
- **Combat Attunement** (4th) -- Passive. Passively detects elemental immunities/weaknesses and active damage sources within 10 squares.
- **Precision Strike** (4th) -- Passive/triggered. Spend 1 Adrenaline as part of any strike to surge 1; the damage type can be changed to elemental (your choice) for that strike.
- **Growing Adrenaline II** (7th) -- Passive. Unlocks a second band of bonus effects when you have 10 or more Adrenaline.
- **Harbinger of the Primordial Chaos / "Ghost of the Sprawl"** (9th) -- Respite activity. Establish a temporary secured relay node (lasts 24 hours after creation) that can be used with your Breach Point feature to open a breach point into the deep network; if used this way, the relay node persists as long as the breach point is maintained.
- **Warzone Incarnate** (10th) -- Passive, upgrades Combat Form (4th). Immunity to acid, cold, fire, sonic, corrosive, and kinetic-feedback damage rises to twice your Physique score. When a hostile combatant whose weapons deal one of those damage types first becomes aware of you in combat, if they have potency strong, they're frightened (save ends). Additionally, when you use Precision Strike, you can spend up to 3 Adrenaline, gaining 1 surge per Adrenaline spent, for that strike.
- **Growing Adrenaline III** (10th) -- Passive. Unlocks a third band of bonus effects when you have 12 or more Adrenaline.
- **Peak Adrenaline** (10th) -- Passive, replaces Damaging Adrenaline's 4th-level value. The first time you take damage each combat round, you gain 3 Adrenaline instead of 2.
- **Operator Mastery** (10th, epic capstone) -- Passive. You gain an epic resource called **Overclock**. Each time you finish a respite, you gain Overclock equal to the XP you gain. You can spend Overclock on your abilities as if it were Adrenaline. You can also spend any amount of Overclock as a Free Maneuver, ending one effect on you per Overclock spent, and you can spend 3 Overclock to open a breach point into the deep network without needing a live relay node. Overclock remains until you spend it (no reset).

### Chrome an Operator Runs

*(Not yet cross-referenced against `GHOSTWIRE-Chrome-Catalog-v1.md` for Operator-specific implant recommendations -- unlike the Hacker's Matrix & Signals lean, the Operator's chrome profile likely leans Combat/Reflex implant categories. Flagged as an open item for a future pass rather than guessed here, per Pre-Flight Doctrine.)*

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero (`09-chrome-body-integrity.md`).

---

---

## Stage 2 review checklist (Operator)

- [ ] Chassis numbers (Stamina 21 / +9 / Recoveries 10) stay
- [ ] Adrenaline income text matches intended play
- [ ] Signature + heroic ladders complete enough for v1 book
- [ ] Three Origins (Corp-Milspec / Merc / Street-vet) names and ladders OK
- [ ] Merc **two kits** — decide stacking rule before Foundry
- [ ] Breach Point / deep-network framing — keep as Operator chrome-tech, or move under Wire chapter?
- [ ] Any Heroes ability names/flavor still too fantasy — rename list?

**Next after approval:** Scout chapter (DS Shadow / mundane tech reskin).
