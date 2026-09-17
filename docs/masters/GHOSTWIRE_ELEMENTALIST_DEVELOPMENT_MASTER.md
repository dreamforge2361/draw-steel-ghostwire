# GHOSTWIRE_ELEMENTALIST_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Elementalist class as of 2026-07-28. All future Elementalist-class design, rules, and Foundry-implementation work -- across every session -- must reference and update THIS file, and only this file. Do not create new Elementalist-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and `Ghostwire_Hacker_Development_Master.md` / `Ghostwire_Operator_Development_Master.md` are treated for those classes. The earlier `elementalist.md` concept draft (2026-07-15, superseded 2026-07-16 income retune and 2026-07-17 summon-cost retune) has been fully rolled into this document; that draft is preserved for archaeology but is no longer ground truth.*

> **Attribute canon correction (2026-07-29):** the five GHOSTWIRE characteristics are **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, and **Persona (Presence)** per the Foundry Build Log V2 doctrine correction. This document was originally written against a defunct six-attribute variant (Cognition/Insight/Resolve); all attribute references have been rewritten to the current canonical five. Mechanical formulas (e.g. Bind Power Roll) also updated: what was `2d10 + Cognition + Resolve` is now `2d10 + Logic + Persona`.

*Last updated: 2026-07-28. This document is the FIRST pass on the Elementalist -- unlike the Operator and Hacker masters, which were built from live Foundry dumps, no Foundry build of the Elementalist exists yet. Ground truth for Part 1 is (a) the canonical Elementalist chapter in `master_rules_baseline_2XP-1BP_2026-07-22.md` (§Class: The Elementalist, lines 3560-3654) and (b) the E3 numeric baseline in the same file (§Numbers Appendix E3, lines 4838-4863). Ground truth for Part 2 is the PLANNED schema modeled on the live Operator and Hacker class items -- flagged clearly in Part 2's Known Bugs / Caveats section, and to be revised the moment the Elementalist ships to Foundry and can be dumped against for real IDs. Attribute names follow the locked GHOSTWIRE convention: display label first, real Draw Steel attribute in parentheses -- e.g. Logic (Reason).*

---

## PART 1 -- PLAYER-FACING: THE ELEMENTALIST

### Who You Are

You are an **Elementalist** -- a *hexer*, a *stormhead*, or on a clean corp badge an *arcano-thaumic contractor*. You are the crew's first spellcaster and its artillery. Where the Operator wins the firefight with drilled discipline and the chrome-forward body, and the Hacker wins it by owning the Wired, **you win it by rewriting the battlefield**: hurling fire and lightning across a room, freezing a chokepoint solid, raising a wall of stone across an approach, and -- at full power -- reaching across the Veil and tearing an elemental loose to fight at your side.

Your power is neither cyber nor pure force of personality but **arcane study** -- the disciplined understanding of how the primal elements answer a trained mind reaching across the Veil. You are always **attuned** to one element (fire, air, water, earth, or void) and can switch it freely on your turn. That attunement drips a small, reliable trickle of **Essence** every turn even when you do nothing; when you want more, you commit a **maneuver** to **Channel**, banking a growing ramp *on top of* the drip that swells the longer you hold one element and releases it in a crescendo -- a bolt, a blast, a zone, a wall, or a summoning.

Because you reach across the Veil, everything in the Veil rules applies to you: the shared summon/bind/command/banish verbs, the dual risk loop (personal backlash + the table-level spirit-attention track that feeds Malice), and the **Price** (nothing for nothing). Of the three Veil casters you carry the **lightest corruption weight** -- elementals are forces, not tormented souls -- but the Price still binds: a willing elemental exacts a **task aligned to its nature** (cleanse a fouled spring, honor a flame, still a storm), and coercing one unwilling pays in corruption and spirit-attention like any dark working.

You are a natural **Edgerunner** in the arcane specialist's role. The corp records list you as an *"arcano-thaumic contractor"* while the street calls you a **hexer**, a **stormhead**, or simply *the mage*.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic (Reason), Persona (Presence) |
| **Heroic Resource** | Essence |
| **Epic Resource / Capstone** | Primordial Reservoir (10th level) |
| **Starting Stamina** | 18 |
| **Stamina per Level** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Optional light Kit (Hexshot / Spellblade / Sanctified) -- magic-damage rider reskins as elemental essence; foci not chrome |

*Design note (chassis rationale, per canon §Elementalist "Lighter frame, ranged specialist"): the Elementalist is a caster, not a front-liner. Starting Stamina sits **below** the Operator's 21 and above the Hacker's fragile-specialist band; recoveries are modest. The Elementalist survives by reach, terrain, and the crew's martials, not by soaking hits.*

### Essence -- Your Heroic Resource

Essence is the Elementalist's fuel, and unlike the Operator's biological Adrenaline it is explicitly framed as **the shaped substance of creation, banked by attunement and spent on workings**. Per Michael's 2026-07-16 free-drip + optional-Channel ruling (income retuned down 2026-07-17), Essence runs a *lean* engine that rewards deliberate save-and-spike over every-turn artillery. Its full rules text reads as follows:

**Essence in Combat.** At the start of a combat encounter, you gain Essence equal to your Victories (the caster arrives already partly attuned -- the same on-ramp every class gets). You are always **attuned to one element** (fire, air, water, earth, or void). Choosing or switching your attuned element is **free** -- no action, no maneuver -- and may be done on your turn. Attunement sets which element your drip and your Channel produce.

**The Drip (free, per turn).** At the start of each of your turns during combat, you gain **1 Essence** of your attuned element -- automatic, no maneuver required. This is your reliable trickle. The drip alone is not enough to fire a powerful working every turn; that is the point.

**Channel (the optional spike -- costs a maneuver).** As a **maneuver**, you may **Channel** -- focusing hard on the attuned element to bank *extra* Essence on top of the drip. Channeling the **same** element on consecutive turns builds a ramp: **+2 Essence turn 1, +3 turn 2, +4 turn 3 or later (capped at +4)**. Switching your attuned element **resets the Channel ramp** to +2 on your next Channel (the drip is unaffected). A committed caster at full ramp banks **+1 (drip) +4 (Channel) = +5/turn**; a caster who skips the maneuver banks only the +1 drip.

**Elemental Resonance.** The first time each combat round that typed **elemental** damage lands on the field from your own workings, bank **+1 Essence** -- the blaster's pulse layered under the drip and ramp. A *landing* full-ramp caster nets **+6/turn**.

**Essence Outside of Combat.** You can't gain Essence outside of combat, but you can still use your heroic abilities and effects that cost Essence without spending it. Whenever you use an ability or effect outside of combat that costs Essence, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite. You may sustain a persistent working for a number of rounds equal to your Victories.

**Cap & Loss.** Essence is **capped at 8 at 1st level, +4 per Echelon** (T5=8; T4=12; T3=16; T2=20; T1=24). All unspent Essence is **lost at encounter end** -- attunement fades when the fight does.

**Sustain (the throttle).** **Sustaining a persistent working** (a wall, a zone, a bound elemental) **reduces the Essence banked at the start of each turn by that working's persistent value** (Persistent 1 = -2/turn; Persistent 2 = -4/turn). Taking a heavy hit in one turn can **break concentration** and end sustained workings (a Persona save vs. potency, exact threshold in the numeric pass). This is the throttle that keeps a blaster from holding three zones and a summon at once.

**Firewall note:** Essence is a class resource on the BP/class side of the firewall. It never touches **nuyen** or **Body Integrity**, and chrome never generates it. See "Kits and Chrome," below.

**Cadence check (2026-07-17 retune, per §E3):** Channeling from empty, a *landing* caster banks +4 (turn 1: 1+2+1) → +5 (turn 2: 1+3+1) → +6 (turn 3+: 1+4+1). That funds a **cost-5 Heavy (Tempest / Elemental Wall / Summon Elemental) about every 2nd round** at best commitment, sliding to **every 3rd round** when resonance misses or an element switch resets the ramp. A caster who declines to Channel trickles +1/turn -- a cost-3 Light/Medium working roughly every 3 turns. The engine rewards deliberate spend-small-vs-hold-for-the-spike decisions rather than firing artillery every turn.

### Signature Abilities

Every Elementalist knows all three signature abilities at 1st level -- these are your baseline, no-Essence-cost options, all rolled with Logic (Reason):

| Signature | Essence Cost | Type | Target | Damage (T1/T2/T3) |
|---|---|---|---|---|
| **Hurl Element** | 0 (spend 1+ Essence to boost -- see below) | Ranged strike (dist 10) | 1 creature | 3+chr / 6+chr / 9+chr (elemental, typed to attunement) |
| **Elemental Shaping** | 0 (spend 1+ Essence to enlarge) | Maneuver, self / short range (dist 5) | 1 creature or self | 2/4/6 damage OR forced-Slide 1/2/3 OR self-Shift 1/2/3 (choose one on cast) |
| **Read the Weave** | 0 | Maneuver, self | -- | No roll. Sense the Veil / read an entity's rank, nature, or a working's identity |

**Hurl Element** is your bread-and-butter blaster tool -- the every-turn strike that scales cleanly with Logic (Reason) via the `@chr` damage bonus, and whose damage type flexes to your current attunement (acid/cold/corruption/fire/lightning/poison/sonic). **Spend 1+ Essence** on cast to increase damage, push the target, or splash a second target within 2 squares -- the everyday blaster tool that scales with your bank.

**Elemental Shaping** is your every-turn controller signature -- the utility hinge, chosen fresh each cast: a burst of typed elemental damage to a nearby foe, a small forced-movement slide (a gust of wind, a stone bridge, a wave), or a short repositioning shift for yourself (a step through void, a blink of storm). **Spend 1+ Essence** to enlarge whichever effect you chose. This is the tool that makes you a controller even before your heroic abilities come online.

**Read the Weave** is your **Sense the Veil** signature (see Veil rules): read an entity's rank/nature, sense the thinness of the Veil, identify a magical effect and what it does, or on Outcome Tier 1 learn a bound creature's true name (a Presence-based bind gets an edge later). Free intel that sets up binds and banishments.

*@chr below always means your Logic (Reason) score.*

### Heroic Abilities -- Cost Tiers 1 Through 11

Heroic Abilities are the Elementalist's workings -- chosen by cost tier as you level, each an Essence-fueled release of the ramp you've been building. All base-tier abilities (costs 1-5) are GHOSTWIRE-original per the canonical Elementalist chapter; **all 7-cost, 9-cost, and 11-cost apex workings are first-draft GHOSTWIRE-original content pending Michael's playtest tuning** (per Part 2's Known Bugs / Caveats -- flagged distinct from the Operator's Heroes-supplement-adapted tier ladder because the Elementalist canon reserves the 9/11 band for the numeric pass and does not name published DS content as source).

*On our reversed Outcome Tiers (Tier 1 = 17+ = best). Costs mirror the Veil/Draw Steel caster ladder (1 / 3 / 5 / 7 / 9 / 11). **Ruling of 2026-07-17: Summon Elemental was moved from the 7 band down to the 5 band** -- its balance now lives in its Persistent-2 upkeep rather than a steep cast cost, so the class's signature pet path is reachable at Tier 5 under the lean Essence economy. The 7 band is now the middle-apex slot (a battlefield-defining single-round working); 9/11 remain the reserved endgame (twin/greater summon, cataclysm).*

#### Base Tier (1-5 Essence, chosen at 1st level, GHOSTWIRE-original)

| Ability | Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Bolt Barrage** | 3 | Main Action | Ranged strike (dist 10), 2 creatures OR 1 creature harder | Damage 4+chr / 7+chr / 10+chr per target (light-band, per §A2); at 1 target only, add +Logic (Reason) again to the damage tier |
| **Difficult Ground** | 3 | Main Action | Ranged area (cube 3, dist 10) | Damage 6/9/12 (medium-band) to each enemy; ground in the cube becomes **difficult terrain** until your next turn. **Persistent 1** (-2 Essence banked per turn) to sustain |
| **Elemental Wall** | 5 | Maneuver | A wall within range (dist 10), 3 squares long, flavored by your attuned element (flame/stone/ice/force) | Blocks line of sight and movement per the element; enemies entering or starting adjacent take 9+chr / 12+chr / 15+chr elemental damage (heavy-band). **Persistent 1** (-2/turn) to sustain and extend |
| **Conflagration / Tempest** | 5 | Main Action | Ranged area (cube 4, dist 10) | Heavy elemental damage 9+chr / 12+chr / 15+chr (heavy-band) to each enemy in cube, flavored by your channeled element (firestorm, ball lightning, acid rain, choking dust, roiling void). **Persistent 2** (-4/turn) to re-detonate each turn without re-paying |
| **Summon Elemental** | 5 | Main Action | Veil working (Summon + Bind), 1 elemental up to your bind cap | Tear an elemental loose from the Veil and bind it to serve. See "Summon Elemental (the pet path)" below for full mechanics. **Persistent 2+** (-4/turn) -- the real cost is the upkeep, not the cast |

**Bolt Barrage** is the blaster opener -- two targets banged for real (light-band) damage on a 3-Essence spend, or one target hit twice as hard when you need to focus fire. **Difficult Ground** is the controller opener -- a live zone that both damages on entry AND punishes enemy movement across it; sustaining it costs -2/turn out of your intake, which is a real tension when you're also trying to build for a Heavy.

**Elemental Wall** and **Conflagration/Tempest** are the two Heavy workings -- the 5-Essence releases you build your ramp toward. Wall is the controller's play: block a line, force a chokepoint, punish the room. Tempest is the blaster's play: everything in the cube takes heavy damage, and if you're willing to burn Persistent 2 you can keep detonating for -4/turn.

**Summon Elemental (the pet path)** is the class's defining working, and per §E3 its balance sits in the Persistent-2 upkeep rather than the cast cost:

- **As an extension (lower investment, T5-T3):** the elemental acts on **your turn**, using your action economy -- a lash of living flame, a stone fist, a striking wind. Low bookkeeping. Damage per its own Rank (light-band = 4+chr T1 / 7+chr T2 / 10+chr T3). Persistent 2 (-2 to your Essence intake per turn while sustained). *(This is Option A of the two summon forms Michael requested per the 2026-07-28 design conversation; both options are shipped for playtest review.)*
- **As an independent figure (higher investment, T2-T1 or a properly-bound T3+ Elementalist):** a properly bound elemental becomes its **own figure** on the map with its own Stamina and activation on the shared round -- the true summoner fantasy. Stamina and damage per the entity table (see Veil rules §C3 -- elemental Rank per your Echelon; a T5 Elementalist starts with a Rank 1 extension only; a T3 Elementalist unlocks Rank 2 independent). Persistent 4 (-4 to your Essence intake per turn while sustained). *(This is Option B; per Michael's 2026-07-28 instruction, both forms are on the table for review before we lock a single ship-form.)*
- **The bind is the throttle** (Persona-based): a **Bind Power Roll (2d10 + Logic + Persona)** on cast -- Tier 1 (17+) binds it clean and grants an edge on Command rolls; Tier 2 (12-16) binds but the elemental resists a Command once per encounter; Tier 3 (≤11) **fails/breaks the bind** and the elemental becomes **hostile and free** for one round before the Veil pulls it back -- the Veil chapter's slipped-leash risk. A **heavy hit while sustaining** can also break the bind (Persona save vs. potency).
- **The Price applies:** a willing elemental exacts a **task aligned to its nature** paid before or after (a Pyromancer honoring flame, a Geomancer restoring a fouled spring); coercing an unwilling one pays in **1 corruption + 1 spirit-attention tick per Rank** at cast -- lightest weight among casters, but never zero.
- **Sustaining a bound elemental** reduces Essence banked each turn (Persistent 2 for extensions, Persistent 4 for independents). You cannot rain Tempests at full tilt *and* hold a greater elemental without deliberate investment. This is the class chapter's "cannot blast at full tilt *and* hold a greater elemental" promise, numerically enforced.

#### 7-Cost Tier (chosen at 3rd level, GHOSTWIRE-original -- FIRST-DRAFT, playtest tuning pending)

| Ability | Essence Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Elemental Convergence** | 7 | Main Action | Ranged area, cube 5 (dist 10), enemies | Heavy elemental damage 11+chr / 15+chr / 20+chr, plus a rider chosen by attuned element: **fire** = burn (2 damage save-ends); **cold** = slowed (save ends); **lightning** = dazed (save ends); **acid/corruption** = weakened (save ends); **void** = pull 3 squares toward cube center. **Persistent 2** to re-detonate |
| **Veilbreaker Bind** | 7 | Main Action | Veil working; 1 elemental target within range | Force a hostile summoned/native elemental into a bind roll (contested Persona). On success, wrest control of it for the encounter -- it becomes an ally elemental at its own Rank. On failure, take 2d6 backlash and grant it an edge on its next attack. The anti-caster tool -- specifically shaped to counter enemy Veil summoners |
| **Second Ramp** | 7 | Free Maneuver | Self | No roll. **Immediately gain +3 Essence** and treat your Channel ramp as if you had already been building for 2 turns (grants +4 Channel on your next Channel maneuver regardless of prior state). The tempo-swing tool -- the mage's "Trigger Cadence" equivalent |
| **Sanctum Stone** | 7 | Maneuver | A warded zone within range (aura 3, dist 5) | Raise a warded circle of consecrated element -- enemies within take a bane on all attacks; allies within gain edge on Persona saves; forced movement into the aura is halved. **Persistent 2** to sustain. The Geomancer's dream, but any subclass can take it |

**Elemental Convergence** is the tier's damage centerpiece -- a bigger Tempest, and the element-flavored rider is the real payoff (a Pyromancer's convergence lights the room on fire; a Stormcaller's dazes half the enemies for a round). **Veilbreaker Bind** is the counter-caster tool, deliberately narrow -- it does nothing against unhelmed martials, but against a rival hexer or a wild elemental it flips the encounter. **Second Ramp** is the tempo-swing option: burning a Free Maneuver AND 7 Essence to instantly refill and max your ramp is a big investment, but the payoff is a guaranteed next-turn Heavy. **Sanctum Stone** is the defensive apex -- a 2-round-lasting zone that shifts the fight in your favor and, if you're Geomancer, layers on top of your terrain features.

#### 9-Cost Tier (chosen at 5th level, GHOSTWIRE-original -- FIRST-DRAFT, playtest tuning pending)

| Ability | Essence Cost | Type | Damage / Effect (T1/T2/T3) | Notable Rider |
|---|---|---|---|---|
| **Cataclysm** (Pyromancer apex) | 9 | Main Action, area cube 6 (dist 10), enemies | 14+chr / 19+chr / 26+chr elemental damage (typed to attunement) | **Strips 1 Malice from the Director** on Tier 1 (the "firestorm strips Malice" beat from canon); on Tier 2 the ground remains difficult terrain until end of encounter; T3 catches only the primary target and Alert/spirit-attention ticks by 1 |
| **Void Vortex** (Geomancer apex, void-flavored) | 9 | Main Action, area aura 4 (self-centered) | 10+chr / 14+chr / 19+chr void/corruption damage each round to enemies pulled in; enemies at 0-Stamina or **winded** at the start of their turn within the vortex are **destroyed** (removed from play, Rank 1 elementals or lower / minions absolute; Rank 2+ take max damage) | **Pulls each enemy 2 squares toward you** at the start of their turn while sustained. **Persistent 4** (-4/turn). The "void vortex destroys the winded" apex from canon |
| **World-Fissure** (Geomancer apex, earth/void-flavored) | 9 | Main Action, line 8 (dist 0) | On cast: 10+chr / 14+chr / 19+chr damage to every creature in the line, prone on Tier 1 or Tier 2; the ground along the line becomes an **impassable fissure** for the rest of the encounter | Difficult terrain in 3 squares to either side of the fissure. The "quake opens a fissure" apex from canon |
| **Twin Elemental Summon** (Stormcaller / Pyromancer / any subclass) | 9 | Main Action, Veil working (bind two elementals) | Bind **two** elementals simultaneously (one action, one bind roll). Both may be extensions OR one may be an independent (T2 Echelon or higher only for the independent). **Persistent 3** for two extensions; **Persistent 5** for one independent + one extension | The pet-path apex -- doubles your action economy for the encounter but takes a huge Essence bite each turn. Broken bind on either flips both to hostile |

**Ruling deferred to playtest (Michael 2026-07-28):** the 9-band is currently deliberately overstocked -- **four options are drafted so the table has choices to eliminate.** Cataclysm is the pure blaster's dream; Void Vortex and World-Fissure are terrain-controller apices with wildly different silhouettes; Twin Elemental Summon is the pet-path apex. **Recommended playtest question:** do we ship all four (the pattern the Operator uses with its Heroes-supplement 9-band) or narrow to two? Flagged as an open design decision in Part 2's Known Bugs.

#### 11-Cost Tier (chosen at 8th level, GHOSTWIRE-original -- FIRST-DRAFT, playtest tuning pending)

| Ability | Essence Cost | Type | Effect |
|---|---|---|---|
| **Greater Elemental Summon** | 11 | Main Action, Veil working | Bind a **Rank 4 elemental** (Rank 5 at T1 Echelon) as an independent figure. It becomes an active combatant on the shared round with its own Stamina, its own maneuvers, its own signature (an Ancient Flame, a Roaring Storm, a Living Mountain, a Devouring Void). **Persistent 6** (-6/turn). Willingly-bound: extracts a **greater task** (a season's service to a temple, a fouled land restored, a corrupted vein cleansed); coerced: pays **3 corruption + 3 spirit-attention** on cast. The full summoner fantasy realized |
| **World-Sundering** | 11 | Main Action, area cube 8 (dist 10) | No damage roll. Every enemy in the cube of potency **strong** or weaker takes **20+chr elemental damage** and is **prone**; every enemy of potency **weak** is **reduced to 0 Stamina**; minions in the cube are outright destroyed. The ground in the cube becomes an **elemental scar** for the rest of the session -- difficult terrain, ambient elemental damage 3/turn to any non-elemental creature crossing it |
| **Attunement Ascendant** | 11 | Maneuver, self | No roll. Until the end of the encounter, your Channel ramp is **already at +4 on cast and does not reset when you switch attunement**. Additionally, you may attune to **two elements at once**; you gain the drip and resonance bonus of both, and your Signature abilities may combine damage types (fire + lightning = plasma; earth + water = mud; etc., Director rules on combined effects). The self-buff apex -- turns you into a walking hurricane of typed damage for the rest of the fight |
| **Break the Veil** | 11 | Main Action, self-centered aura 5 | The Veil thins around you. Every ally within the aura may **sustain any persistent working at reduced cost** (Persistent 2 becomes Persistent 1; Persistent 4 becomes Persistent 2). **You** may sustain **one** persistent working with **no Essence cost** for the rest of the encounter. Additionally, all your Signature and Heroic ability rolls gain edge for the duration. **Persistent 4** on cast. The team-wide caster apex |

**Ruling deferred to playtest (Michael 2026-07-28):** the 11-band mirrors the Operator's structure -- one big damage/kill option (World-Sundering ≈ Overkill), one big self-buff (Attunement Ascendant ≈ Combat Trance), one big pet-path option (Greater Elemental Summon ≈ Overclocked Adrenaline), and one big team/utility option (Break the Veil ≈ Relentless). All four are FIRST-DRAFT; playtest will surface which are too spiky, too flat, or duplicating another 11-band option's silhouette.

**Note on the 11-cost tier:** three of the four (Greater Elemental Summon, World-Sundering, Break the Veil) key their tiered effects/damage off Logic (Reason); Attunement Ascendant has no roll characteristics at all (pure self-buff). Greater Elemental Summon in particular is the tier's signature "the fight is different now" option -- a Rank 4 elemental on the map for the rest of the encounter is a step-change in the crew's action economy and combat presence.

### Element Subclasses

At 1st level you choose your **Elementalist Specialization** -- your element cluster, which sets your favored damage types, tints your signatures and heroic abilities, and grants a subclass identity feature and a signature summon. All three subclasses share the Logic/Persona chassis and the Essence engine; each grants a distinct **1st-tier feature**, a **signature-ability tweak**, a **bonus key/secondary skill**, and a **contact hook** (ties into the Followers & Contacts framework). Full per-tier tables land in the numeric pass; the structure below is canon.

*(The seven primal elements -- air, earth, fire, green, rot, void, water -- are grouped into three playable clusters per canon; more subclasses can be featured later, echoing Draw Steel's expandable specialization list.)*

*@chr below always means your Logic (Reason) score.*

#### Pyromancer -- *"Combustion-Thaumic Specialist"*

Fire, plasma, and destruction -- the archetypal blaster subclass. Grants the **Arcana** skill and no starting weapon Kit (a pure caster; you get an elemental focus instead, drawn from Category 6A of the gear catalog).

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Burn On | Passive feature |
| 1 | Ember Companion | Signature summon (fire elemental, extension form) |
| 1 | Arcana (skill) | Skill |
| 1 | Signature focus (Elementalist foci, 6A) | Item grant |
| 2 | Firestorm Attunement | Passive feature |
| 2 | 2nd-Level Specialization Ability (choice of 2: Wildfire / Cleansing Flame) | Ability |
| 5 | Fire Immunity | Passive feature |
| 6 | Fury Rising | Passive feature |
| 6 | 6th-Level Specialization Ability (choice of 2: Solar Lance / Combustion Chain) | Ability |
| 8 | The Furnace Within | Passive feature |
| 9 | 9th-Level Specialization Abilities (choice of 2: Living Sun / Ashen Wake) | Ability |

**Passive Features:**

- **Burn On** (1st) -- Your fire and elemental damage carries a *lingering* rider. Whenever you deal fire, lightning, or acid damage to a creature via a Signature or Heroic ability, that creature also takes **1 additional fire damage at the start of its next turn (2 at Echelon 3, 3 at Echelon 2, 4 at Echelon 1)**. The Pyromancer's signature "keep them burning" identity.
- **Firestorm Attunement** (2nd) -- Your **Channel** builds one step faster when your attuned element is fire, lightning, or acid: turn 1 = +3, turn 2 = +4 (cap). You reach maximum ramp one turn sooner in the fire lineage.
- **Fire Immunity** (5th) -- Immunity to fire damage equal to your Logic (Reason) score. You may walk through fire, sustain a Fire Wall from inside it, and no longer take ambient fire damage from a Cataclysm you sustain.
- **Fury Rising** (6th) -- Whenever you spend 5 or more Essence in a single turn, gain **1 free surge** (available until end of your next turn) and your next Signature ability this encounter deals +Logic (Reason) extra damage.

  > **Surges** work as in Draw Steel Heroes; Ghostwire adds no surge variant. Fury Rising's "1 free surge" is an ordinary Draw Steel surge you can use until the end of your next turn.
- **The Furnace Within** (8th) -- +1 bonus to Logic (Reason)-based power rolls. Whenever you would spend Essence on a fire/lightning/acid working, you spend **1 less** (minimum 0), once per round.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Ember Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 fire elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 4+chr / 7+chr / 10+chr (light-band, fire). *This is the Pyromancer's "free pet lite" -- doesn't replace Summon Elemental, but a signature-fueled taste of the summoner fantasy from level 1.* |
| **Wildfire** | 5 | 2nd tier | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 9+chr / 12+chr / 15+chr fire; on Tier 1 or Tier 2, the cube becomes a burning zone (difficult terrain + ambient 3 fire damage/turn to enemies inside) until end of encounter. |
| **Cleansing Flame** | 5 | 2nd tier | Maneuver | Self or one ally, aura 2. All ongoing save-ends fire, acid, poison, or corruption effects on target end. Target gains temporary Stamina equal to your Logic (Reason) × 2. *A rare healing-adjacent tool for the Pyromancer.* |
| **Solar Lance** | 9 | 6th tier | Main Action | Ranged strike, dist 20, line 1. Damage 12+chr / 17+chr / 24+chr fire; all creatures in the line hit; ignore cover; on Tier 1 the target is blinded (save ends). |
| **Combustion Chain** | 9 | 6th tier | Main Action | Ranged strike, 1 creature (dist 10). Damage 10+chr / 14+chr / 19+chr fire; if the target is at half Stamina or below, chain to a second target within 3 squares for 5+chr / 8+chr / 11+chr damage; if the second target dies from this, chain to a third for 3+chr / 5+chr / 8+chr. |
| **Living Sun** | 11 | 9th tier | Main Action | Self-centered aura 5. Bright light fills the aura; enemies within take 6+chr / 9+chr / 13+chr fire damage at the start of each of their turns; allies in the aura may spend a Recovery as a free maneuver once per turn. **Persistent 4** (-4/turn) to sustain. The "walking sun" identity. |
| **Ashen Wake** | 11 | 9th tier | Main Action | Ranged area, cube 5 (dist 10), enemies. Damage 8+chr / 12+chr / 16+chr; the cube becomes ashen ground (difficult terrain, obscures line of sight through it, ambient 3 fire damage/turn to any non-fire-immune creature) until end of session. The "burn the earth" identity. |

*Corp records: **combustion-thaumic specialist**. Street: **firehead**, **candle**, or simply **the pyro**.*

#### Stormcaller -- *"Kinetic-Atmospheric Specialist"*

Air, water, and mobility -- the battlefield-mover subclass. Grants the **Perception** skill and no starting weapon Kit (a pure caster with an elemental focus, drawn from Category 6A).

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Kinetic Enlargement | Passive feature |
| 1 | Zephyr Companion | Signature summon (air elemental, extension form) |
| 1 | Perception (skill) | Skill |
| 1 | Signature focus (Elementalist foci, 6A) | Item grant |
| 2 | Riding the Storm | Passive feature |
| 2 | 2nd-Level Specialization Ability (choice of 2: Chain Lightning / Riptide Grab) | Ability |
| 5 | Storm's Blessing | Passive feature |
| 6 | Rolling Thunder | Passive feature |
| 6 | 6th-Level Specialization Ability (choice of 2: Cyclone Trap / Skyfall) | Ability |
| 8 | Eye of the Storm | Passive feature |
| 9 | 9th-Level Specialization Abilities (choice of 2: Cataclysm's Voice / The Deluge) | Ability |

**Passive Features:**

- **Kinetic Enlargement** (1st) -- Whenever your Signature or Heroic abilities include **forced movement** (push, slide, pull, teleport, self-shift), that movement is **increased by 1 square** at Echelon 4-5, 2 squares at Echelon 3, and 3 squares at Echelon 1-2. The Stormcaller's signature "everyone moves more" identity.
- **Riding the Storm** (2nd) -- +2 to your Speed while attuned to air or water. When you use Elemental Shaping's shift option, you may treat the shift as a **teleport** (ignoring intervening terrain and enemies), once per encounter.
- **Storm's Blessing** (5th) -- Immunity to lightning damage equal to your Logic (Reason) score. Additionally, you and each ally within 3 squares gain edge on Reflex (Agility) saves against elemental effects.
- **Rolling Thunder** (6th) -- Whenever you deal lightning or cold damage to a creature via a Signature or Heroic ability, arc **1 damage of the same type to a second creature within 3 squares** (2 damage at Echelon 2, 3 damage at Echelon 1). The battlefield-arc identity.
- **Eye of the Storm** (8th) -- +1 bonus to Logic (Reason)-based power rolls. Once per round, when a creature within 5 squares makes an attack against you or an ally, force it to reroll (a "gust deflects the shot" narrative rider); the second roll stands.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Zephyr Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 air or water elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 3+chr / 5+chr / 8+chr (light-band, cold/lightning/sonic -- your choice on cast). Its melee strike also **slides the target 1 square** on Tier 1 or Tier 2. |
| **Chain Lightning** | 5 | 2nd tier | Main Action | Ranged strike, dist 10, primary target then arcs. Damage 8+chr / 11+chr / 14+chr lightning; arcs to a second target within 3 squares for half; arcs to a third within 3 squares of the second for quarter. |
| **Riptide Grab** | 5 | 2nd tier | Maneuver | Ranged area, cube 3 (dist 5), enemies. **Pull each enemy 3 squares toward the cube center** (5 at Echelon 2, 7 at Echelon 1); enemies pulled into a solid obstacle take 2/4/6 damage. |
| **Cyclone Trap** | 9 | 6th tier | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 8+chr / 11+chr / 15+chr sonic; enemies inside are **restrained** (save ends) on Tier 1 or Tier 2. **Persistent 2** to sustain. |
| **Skyfall** | 9 | 6th tier | Main Action | Ranged area, cube 4 (dist 15), enemies. Damage 10+chr / 14+chr / 19+chr lightning; enemies of potency average or lower become **prone**; enemies of potency strong or weaker become **dazed** (save ends). |
| **Cataclysm's Voice** | 11 | 9th tier | Main Action | Ranged area, cube 6 (dist 10), enemies. Damage 12+chr / 17+chr / 24+chr sonic; targets are **deafened** (save ends) on Tier 1 or Tier 2; deafened targets cannot be commanded by an ally (an anti-Commander control rider). *Cataclysm's Stormcaller apex.* |
| **The Deluge** | 11 | 9th tier | Main Action | Ranged area, cube 8 (dist 10), enemies. Damage 8+chr / 12+chr / 17+chr cold/sonic; **the entire cube fills with water** (difficult terrain, half speed, chance to drown per environmental rules); creatures inside take an additional **2 lightning damage / turn** from a stormfront overhead. **Persistent 4** to sustain. The "flood the room" apex. |

*Corp records: **kinetic-atmospheric specialist**. Street: **stormhead**, **windbag** (derogatory), or **the tempest**.*

#### Geomancer -- *"Geo-Structural / Spatial Specialist"*

Earth, void, and terrain -- the fortress subclass. Grants the **Endurance** skill and no starting weapon Kit (a pure caster with an elemental focus, drawn from Category 6A).

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Stone Shield | Passive feature |
| 1 | Boulder Companion | Signature summon (earth elemental, extension form) |
| 1 | Endurance (skill) | Skill |
| 1 | Signature focus (Elementalist foci, 6A) | Item grant |
| 2 | Warding Terrain | Passive feature |
| 2 | 2nd-Level Specialization Ability (choice of 2: Pillar of Stone / Corrosive Rain) | Ability |
| 5 | Root Deep | Passive feature |
| 6 | Fortress Stance | Passive feature |
| 6 | 6th-Level Specialization Ability (choice of 2: Voidstep / Anchoring Field) | Ability |
| 8 | Immutable | Passive feature |
| 9 | 9th-Level Specialization Abilities (choice of 2: World-Fissure / Void-Grasp) | Ability |

**Passive Features:**

- **Stone Shield** (1st) -- Whenever you raise a terrain feature (Elemental Wall, Pillar of Stone, Sanctum Stone, or a Difficult Ground zone), you or one ally within 3 squares gains **temporary Stamina equal to your Logic (Reason) score** (double at Echelon 2, triple at Echelon 1). The Geomancer's signature "raising terrain protects you too" identity.
- **Warding Terrain** (2nd) -- Enemies moving through **your** Difficult Ground zones or terrain features take an additional **2 damage per square** (typed to your attunement). Your terrain isn't just difficult -- it's hostile.
- **Root Deep** (5th) -- You cannot be forced-moved against your will while adjacent to a terrain feature you raised. Additionally, +2 to your Stability (as the Operator's Anchored Stance, but always-on).
- **Fortress Stance** (6th) -- Once per encounter as a Free Maneuver, transform any one square you occupy into a raised pillar of stone (adjacent creatures must save Physique or fall prone; you gain **cover** and +2 to armor Stamina until you leave the square).
- **Immutable** (8th) -- +1 bonus to Logic (Reason)-based power rolls. You are immune to being knocked prone, restrained, or forced-moved by any non-Rank-4+ source; you may still choose to fall prone voluntarily.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Boulder Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 earth or void elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 4+chr / 7+chr / 10+chr (light-band, acid/corruption -- your choice on cast). Its melee strike is a **shove test rider** (may shove 1 square as a free rider on hit, at Tier 1 or Tier 2). |
| **Pillar of Stone** | 5 | 2nd tier | Maneuver | Ranged, 1 square within range (dist 10). Raise a pillar of stone up to 4 squares tall in that square; creatures in the pillar's target square are shoved to an adjacent empty square. The pillar blocks line of sight, provides cover, and is **impassable difficult terrain**; it lasts until end of session or until destroyed (5+Echelon Stamina). **Persistent 1** to sustain and maintain multiple pillars. |
| **Corrosive Rain** | 5 | 2nd tier | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 6+chr / 9+chr / 12+chr acid/corruption; on Tier 1 or Tier 2, all creatures in the cube also take a Weakened condition (save ends). |
| **Voidstep** | 9 | 6th tier | Maneuver | Self. **Teleport up to 10 squares** to a visible location; you may bring one adjacent ally with you. On arrival, all enemies adjacent to your destination take 5/7/10 corruption damage from the closing tear in the Veil. *(The teleport tool for a class that otherwise doesn't have one.)* |
| **Anchoring Field** | 9 | 6th tier | Main Action | Ranged area, aura 4 (self-centered), enemies. Damage 6+chr / 9+chr / 12+chr acid; enemies within cannot teleport, cannot be teleported, and take -2 to their Speed (save ends). **Persistent 3** to sustain. The anti-Voidstep/anti-teleport tool. |
| **World-Fissure** | 11 | 9th tier | Main Action | *See Heroic Abilities → 9-Cost Tier above.* This is the Geomancer's canonical apex; it is included in the tier-9 shared pool but Geomancers may take it before other subclasses (a class feature quirk). |
| **Void-Grasp** | 11 | 9th tier | Main Action | Ranged, 1 creature (dist 15). **The target is grasped by the Veil itself.** Damage 12+chr / 17+chr / 24+chr void; on Tier 1, the target is **removed from play until end of your next turn** (returns in the same square, exhausted -- takes an automatic 2d6 damage on return); on Tier 2, the target is **prone and immobilized** (save ends). |

*Corp records: **geo-structural / spatial specialist**. Street: **stone-eater**, **the walls**, or **grim** (for those who lean void-heavy).*

### Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Skills (choose 2, exploration/intrigue) - Elementalist Specialization (choose subclass) - Signature Abilities (all 3 known) - Heroic Ability (choose 1 of 5, base tier) - Essence (heroic resource) | -- | Subclass passive + signature summon + unique skill + signature focus item |
| **2** | Perk (any) | Perk (choice) | Subclass 2nd-level passive + 2nd-Level Specialization Ability (choice of 2) |
| **3** | Choose a 7-Cost Heroic Ability (pool of 4) - Features grant (Weave Sensitivity, Attunement Discipline) | -- | -- |
| **4** | Perk (Arcane/Streetcraft/Shadow) - Features grant (Practiced Ramp, Elemental Attunement II, Signature Bond, Bind Discipline) | Characteristic Increase (Logic/Persona to 3) - Skill | -- |
| **5** | Choose a 9-Cost Heroic Ability (pool of 4) | -- | Subclass 5th-level passive |
| **6** | Perk (any) - Features grant | Perk (choice) | Subclass 6th-level passive + 6th-Level Specialization Ability (choice of 2) |
| **7** | Features grant (Essence Cap +4, Elemental Attunement III) | Characteristic Increase (all +1, max 4) - Skill | -- |
| **8** | Perk (Arcane/Streetcraft/Shadow) - Choose an 11-Cost Heroic Ability (pool of 4) | -- | Subclass 8th-level passive |
| **9** | Features grant (Weave Mastery -- "The Deep Weave") | -- | Subclass 9th-level Specialization Abilities (choice of 2) |
| **10** | Perk (any) - Features grant (Primordial Reservoir -- epic capstone, Elemental Attunement IV, Ascendant Weave) | Characteristic Increase (Logic/Persona to 5) - Skill | -- |

*(Level column and grant structure mirrors the Operator/Hacker progression skeleton. Actual `system.advancements` object for the class item will be built to this table in the Foundry ship pass.)*

### Core Class Features (Non-Subclass)

- **Weave Sensitivity** (3rd) -- Passive. Passively detects Veil-adjacent phenomena within 5 squares -- spirits, sustained workings, magical effects, corrupted zones. You know when the Veil is thin near you (a real, active setting hook -- corrupted zones apply Persona-based corruption pressure per Hostile-Env rules).
- **Attunement Discipline** (3rd) -- Passive. You may switch your attuned element as a **free action** even during someone else's turn (not just your own). Additionally, when you switch elements, gain **1 free Essence** (the "warmth of the transition" -- a small tempo swing that partially offsets the ramp reset).
- **Practiced Ramp** (4th) -- Passive. Your Channel ramp starts at **+3** (not +2) on turn 1 while attuned to your subclass's primary element (fire for Pyromancer, air/water for Stormcaller, earth/void for Geomancer). One turn saved per encounter, per commitment.
- **Elemental Attunement II** (4th) -- Passive. Immunity to your subclass's primary element damage type equal to your Logic (Reason) score. Stacks with subclass-specific immunities (Pyromancer's Fire Immunity, etc.) at level 5.
- **Signature Bond** (4th) -- Passive. Once per Echelon, you may permanently bond a **signature focus** (a warded staff, a summon-focus, an elemental wand -- one item from Gear Catalog 6A). Bonded foci gain a deeper persistent benefit (an edge on one Channel line, sustain one extra working, an edge on a bind/summon roll -- per the focus's own text) beyond their nuyen cost. **Costs 1 BP/SP -- the ONE sanctioned crossing of the BP firewall in the entire gear pass, per Ruling 2026-07-15.** You cannot bond more than one focus at once; unbinding requires a respite.
- **Bind Discipline** (4th) -- Passive. Add +1 to all Persona-based Bind rolls (Summon Elemental, Veilbreaker Bind, and any subclass equivalents). The controller identity refined.
- **Essence Cap +4** (7th) -- Passive. Your Essence cap rises by 4 (from 8 at T5 → 12 at T4 → 16 at T3, per the standard Echelon curve).
- **Elemental Attunement III** (7th) -- Passive. Immunity to your subclass's primary element damage type rises to twice your Logic (Reason) score; you may add a **second attunement type** to your subclass's primary as a permanent secondary (a Pyromancer picks up lightning OR acid; a Stormcaller picks up cold OR sonic; a Geomancer picks up void OR corruption). Now attunement can flex without full switch.
- **Weave Mastery -- "The Deep Weave"** (9th) -- Respite activity. You may establish a **standing bind** on a signature elemental (any Rank up to your own Echelon -1). The elemental persists on the material plane for the duration of the current session-arc (Michael's discretion, but roughly one long-term run or ~20-30 rounds of combat spread across scenes). It acts independently on the shared round; you sustain it for -1 Essence per turn (reduced from Persistent 2/4) but only while awake and conscious. The setting's version of the "long-term bound familiar" -- a signature companion, not a per-encounter reset.
- **Elemental Attunement IV** (10th) -- Passive. Immunity to your subclass's primary damage type rises to **three times** your Logic (Reason) score. Additionally, you may attune to **two elements at once** (as the 11-cost Attunement Ascendant working) permanently; this replaces the earlier secondary attunement from Attunement III.
- **Ascendant Weave** (10th) -- Passive. Your bind rolls to Summon and Command gain a permanent edge; your standing bind (from Weave Mastery) may hold a Rank up to your Echelon (not -1). You may sustain **one** persistent working with **no Essence cost** per encounter, in addition to any you sustain normally.
- **Primordial Reservoir** (10th, epic capstone) -- Passive. You gain an epic resource called **Reservoir**. Each time you finish a respite, you gain Reservoir equal to the XP you gain (as the Operator's Overclock). You can spend Reservoir on your abilities as if it were Essence. You can also spend any amount of Reservoir as a Free Maneuver, ending one save-ends effect on yourself per Reservoir spent. You can spend 3 Reservoir to sustain any persistent working for one turn at **zero Essence cost**. Reservoir remains until you spend it (no reset). The Elementalist's endgame arcane battery.

### Kits (Your Loadout)

The Elementalist is a **light-Kit or no-Kit** class by design (the Kits chapter's own note: pure casters fight through the Veil, not a weapon doctrine). Kit choices are drawn from the shared `ghostwire-kits` compendium -- the same 19-kit shared pool other classes draw from, not an Elementalist-exclusive item type.

The natural attachment points are the **magic/tech-flavored Kits** -- **Hexshot**, **Spellblade**, **Sanctified** -- whose "magic" damage rider is **reskinned as elemental essence** (a channeled focus-weapon, an elemental-charged blade, a warded holy symbol repurposed as an arcane relic). A **battle-mage build** takes a light Kit (Hexshot for ranged casters, Spellblade for melee-adjacent) to stay armed at melee; a **pure artillery build** takes no Kit and lives at range, letting the Signature focus (from your subclass's 1st-level advancement) do the mechanical work of a weapon slot.

**Ownership rule still holds** (per the Kits chapter): a Kit is inert without its qualifying nuyen-bought focus/weapon. A Sanctified Kit without a consecrated censer or a bonded staff is dormant technique.

**Foci over chrome (Veil gear, Economy side):** the Elementalist's real gear footprint is **foci** -- bound or crafted implements that focus elemental channeling. Category 6A of the gear catalog is your list: summon-foci, elemental wands, warded staves, ash-bones, focus-orbs. All bought with **nuyen** and improved through the Economy's **modification** subsystem, *not* chrome. This is the caster's equivalent of the Operator's weapons.

### Chrome an Elementalist Runs

**Warning to the player (table-enforced, per Ruling of 2026-07-28 -- Michael):** **A Cyborg species character can NEVER be an Elementalist -- Arcane Severance bars all magic access absolutely.** This is a species restriction, not a class restriction, and is enforced at character creation (Step 2 of the character-creation checklist), not by any mechanical gate on this class item. If you built a Cyborg thinking to play a hexer, rebuild your species or your class before the first session.

For **all non-Cyborg** Elementalists, chrome is **strongly discouraged but not forbidden**. Cyberware collapses a mage's channeling: chrome reduces your **Essence cap** by the shared magic-erosion formula — −1 per **2** Integrity spent on Standard chrome (round down), per **3** on Soft, per **1** on Salvage (`docs/rulebook/12-chrome.md`). Soft is the only grade a serious Elementalist should install.

This is the deliberate **street-sam-vs-mage** line: the Operator spends **Body Integrity** to grow stronger; the Elementalist **guards** their integrity to keep the Veil open. Chrome never generates Essence and never converts into class power (firewall intact).

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero -- see `GHOSTWIRE-Chrome-Rules-v1.md` and `GHOSTWIRE-Chrome-Catalog-v1.md` for full install rules, Echelon/grade doctrine, and pricing.

*(No cross-reference against `GHOSTWIRE-Chrome-Catalog-v1.md` for Elementalist-specific implant recommendations has been done yet -- likely leans Sensory/Recovery categories (a datajack for corp records access, subtle body-integrity implants for spirit-attention resistance). Flagged as an open item for a future pass, per Pre-Flight Doctrine.)*

---

## PART 2 -- AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This section is a technical reference for future agents/sessions building, patching, or extending the Elementalist class in Foundry. **Unlike the Operator and Hacker masters, this document's Part 2 describes PLANNED schema, not live Foundry state -- no Elementalist has been shipped to `ghostwire.ghostwire-classes` yet.** All field paths, `_dsid` values, item IDs, and folder assignments below are proposals modeled on the live Operator and Hacker class items; verify against the base `draw-steel` v1.1.1 system source (`MetaMorphic-Digital/draw-steel` repo, `src/module/data/item/ability.mjs` and `class.mjs`) before writing code that touches them.*

### Module Scope (Standing Rule)

All GHOSTWIRE Foundry work is scoped to the `ghostwire` module folder and its compendiums:

- `ghostwire.ghostwire-classes` -- **planned home** for Elementalist class item, 3 subclass items, all base/tier heroic abilities, most passive features
- `ghostwire.ghostwire-abilities` -- **planned home** for subclass Specialization Abilities (per the pattern proven live on Operator's doctrine layer: features stay in `-classes`, ability items live in `-abilities`, verified via Operator subclass-recursive dump 2026-07-28)
- `ghostwire.ghostwire-kits` -- referenced (not modified) for Kit item grants; the same shared 19-kit pool other classes draw from

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`. Current live world: `ghostwire-v2` (aka "Ghostwire - The Reach"). PowerShell 5.1 only for deploy wrappers -- no `??` / `?.` / ternary operators (verified constraint per canonical build log §Environment).

### Data Provenance -- How This Document Was Built

**Unlike the Operator and Hacker masters, which were built from live Foundry dumps, this document was built from written canon sources only:**

1. **Elementalist class chapter** in `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f6eb5eb4-8890-4f03-b840-dd842894db1a/master_rules_baseline-1.md` -- lines 3560-3654 (§Class: The Elementalist, ~95 lines of design canon).
2. **Numeric baseline §E3** in the same file -- lines 4838-4863 (Essence pool/cap, Channel ramp values, resonance bonus, sustain costs, Heroic ability magnitudes, Summon-upkeep note).
3. **Attribute mapping** verified in the same file at lines 155 (six-attribute set), 947-982 (naming reconciliation Reason→Logic, Presence→Persona, etc.).
4. **Elementalist concept design doc** at `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f695061a-33dd-4bc8-8bc2-743731558b6a/elementalist.md` (89 lines, already superseded by the master baseline but consistent with it).
5. **Draw Steel native Elementalist structural pattern** inferred from the equivalent published class (Elementalist is a published DS class; its `_dsid: "elementalist"`, its `primary: "Essence"`, its `characteristics.core: ["reason", "presence"]`, its stamina/recoveries structure are known from the DS SRD and mirror our reskin exactly).
6. **Template patterns** from the two live-Foundry sibling masters: `/home/user/workspace/memory/space_files/Ghostwire_Operator_Development_Master.md` (435 lines) and `/home/user/workspace/memory/space_files/Ghostwire_Hacker_Development_Master.md` (480 lines). Both were dumped from live Foundry after full builds; this document's Part 2 shape mirrors theirs but explicitly flags all IDs and field paths as PLANNED, not LIVE.

**No live Foundry dump exists for the Elementalist as of this writing.** The moment the class ships to `ghostwire.ghostwire-classes` and can be walked with an equivalent of `Backup-Ghostwire-Operator-FullDump-v3.js` (Clipboard API + chunked console fallback -- the proven-working method on Michael's Windows setup), Part 2 must be updated in place with the real dump's ground truth. **Do not treat this document's Part 2 as authoritative until that dump lands and this note is retracted.**

### Item Inventory (Planned, To Be Built)

**Planned counts** (modeled on Operator's 33-item class-level + 37-item subclass-level structure, adjusted for the Elementalist's 3-signature / 5-base / 4-per-tier / 3-subclass shape):

| Category | Planned Count | Planned IDs (proposal) |
|---|---|---|
| `class` | 1 | Elementalist (`GWElemental00001`) |
| `subclass` | 3 | Pyromancer (`GWSubPyroman0001`), Stormcaller (`GWSubStormcl0001`), Geomancer (`GWSubGeoman00001`) |
| `ability` (signature, no cost) | 3 | Hurl Element (`GWSigHurlElem001`), Elemental Shaping (`GWSigElShape0001`), Read the Weave (`GWSigReadWvw0001`) |
| `ability` (base heroic, 3-5 cost) | 5 | Bolt Barrage (`GWHeroBolt00001`), Difficult Ground (`GWHeroDifGrnd001`), Elemental Wall (`GWHeroElemWall01`), Conflagration/Tempest (`GWHeroConfTmp001`), Summon Elemental (`GWHeroSummonEl01`) |
| `ability` (7-cost tier) | 4 | Elemental Convergence (`GWElT3AbConv0001`), Veilbreaker Bind (`GWElT3AbVBBind01`), Second Ramp (`GWElT3AbScdRmp01`), Sanctum Stone (`GWElT3AbSancSt01`) |
| `ability` (9-cost tier) | 4 | Cataclysm (`GWElT5AbCatacl01`), Void Vortex (`GWElT5AbVdVort01`), World-Fissure (`GWElT5AbWFiss001`), Twin Elemental Summon (`GWElT5AbTwinSum1`) |
| `ability` (11-cost tier) | 4 | Greater Elemental Summon (`GWElT8AbGrtSum01`), World-Sundering (`GWElT8AbWSund001`), Attunement Ascendant (`GWElT8AbAttAsc01`), Break the Veil (`GWElT8AbBrkVl001`) |
| `feature` (core passive) | 12 | Weave Sensitivity (`GWElFtWveSns0001`), Attunement Discipline (`GWElFtAttDsc0001`), Practiced Ramp (`GWElFtPractRmp01`), Elemental Attunement II (`GWElFtElAttII01`), Signature Bond (`GWElFtSigBnd0001`), Bind Discipline (`GWElFtBndDis0001`), Essence Cap +4 (`GWElFtEssCap0001`), Elemental Attunement III (`GWElFtElAttIII1`), Weave Mastery (`GWElFtWveMst0001`), Elemental Attunement IV (`GWElFtElAttIV01`), Ascendant Weave (`GWElFtAscWve0001`), Primordial Reservoir (`GWElFtPrmRes0001`) |
| `feature` (resource explainer) | 1 | Essence (`GWElFtEssence001`) |
| `feature` (subclass passive -- Pyromancer x5) | 5 | Burn On (`GWPyFtBurnOn001`), Firestorm Attunement (`GWPyFtFireSt001`), Fire Immunity (`GWPyFtFireImm01`), Fury Rising (`GWPyFtFuryRis01`), The Furnace Within (`GWPyFtFurWith01`) |
| `feature` (subclass passive -- Stormcaller x5) | 5 | Kinetic Enlargement, Riding the Storm, Storm's Blessing, Rolling Thunder, Eye of the Storm |
| `feature` (subclass passive -- Geomancer x5) | 5 | Stone Shield, Warding Terrain, Root Deep, Fortress Stance, Immutable |
| `ability` (subclass Specialization -- Pyromancer x7) | 7 | Ember Companion, Wildfire, Cleansing Flame, Solar Lance, Combustion Chain, Living Sun, Ashen Wake |
| `ability` (subclass Specialization -- Stormcaller x7) | 7 | Zephyr Companion, Chain Lightning, Riptide Grab, Cyclone Trap, Skyfall, Cataclysm's Voice, The Deluge |
| `ability` (subclass Specialization -- Geomancer x7) | 7 | Boulder Companion, Pillar of Stone, Corrosive Rain, Voidstep, Anchoring Field, World-Fissure (shared with 9-tier pool), Void-Grasp |

**Total planned item count:** 1 class + 3 subclass + 3 signature + 5 base heroic + 12 tier heroic (4/tier × 3 tiers) + 13 core feature (12 passive + 1 resource) + 15 subclass features (5/subclass × 3) + 21 subclass Specialization Abilities (7/subclass × 3) = **73 items** (with one shared: Geomancer's World-Fissure = 9-tier pool World-Fissure, so effectively 72 unique + 1 shared).

*Planned ID naming convention mirrors Operator's (`GWOperator000001`, `GWSubCorpMil0001`, `GWSigCtrlPair001`, `GWHeroBreach0001`, `GWOpT3AbChrome01`, `GWOpFtVetSprwl10`) -- 16-char alphanumeric, prefix indicates class + item type + short slug. Adjust to Foundry's actual key constraints if any real-ID collision arises during ship.*

### The Feature/Ability Pairing Pattern (Modeled After Operator, With Caster Adaptation)

Per the Operator master's finding (§Feature/Ability Pairing Pattern, lines 308-312): unlike the Hacker's fully-paired pattern (nearly every ability has a same-named `feature` counterpart carrying the prose while the `ability` item carries only mechanical roll data), **the Operator's base/tier heroic abilities are largely self-contained** -- every ability item carries its own `system.story` flavor line AND its own `system.effects.before0000000000.description` block with real tiered mechanics inline.

**The Elementalist is planned as a hybrid of both:**
- **Signature abilities and base heroics (3+5)**: **Self-contained** (Operator-style). Each ability item carries its own story, keywords, and `power.effects` inline. No paired feature.
- **7/9/11-cost tier abilities (12)**: **Self-contained** (Operator-style). Each carries source info (`system.source.book: "GHOSTWIRE"`, `license: "GHOSTWIRE reskin (Draw Steel Creator License)"` -- distinct from Operator's `book: "Heroes"` which cited real DS SRD pages; see Known Bugs #5 for provenance flag).
- **Core class features (13)**: **Standalone passives** (matches Operator's Adrenaline, Growing Adrenaline, Combat Form pattern). Each has its own `system.description.value`. Consider adding a **`description.director`** (GM-only) note for Weave Mastery, Elemental Attunement IV, and Primordial Reservoir where a capstone explicitly supersedes an earlier passive -- worth adopting per Operator's finding.
- **Subclass Specialization Abilities (21)**: **Paired** (Hacker-style, following the Operator subclass discovery). A subclass's Specialization Abilities live in `ghostwire.ghostwire-abilities` (like Operator's doctrine abilities did in the 2026-07-28 recursive dump revelation), while the subclass's passive Features stay in `ghostwire.ghostwire-classes`. Signature summons (Ember Companion, Zephyr Companion, Boulder Companion) are abilities that need a paired **companion/summon actor** (see Known Bugs #6 for the elemental-actor open item).
- **Subclass Features (15)**: **Standalone passives** in `ghostwire.ghostwire-classes` (matches Operator doctrine features pattern).

**Do not assume a uniform pairing pattern applies across the whole Elementalist kit** -- this is a real structural difference that mirrors the two prior class implementations and should be preserved.

### Class Item Schema (`GWElemental00001`, type `class`) -- PLANNED

Key fields under `system`, planned per the DS Elementalist source + Operator/Hacker mirroring:

```
_dsid: "elementalist"                  // matches native DS elementalist class item
primary: "Essence"                     // Heroic Resource name
epic: "Primordial Reservoir"           // Level-10 epic resource
turnGain: "1"                          // Flat +1/turn drip -- verify DS native turnGain schema; expect "1" not "1d3"
minimum: "0"
characteristics.core: ["reason", "presence"]   // real DS keys; display as Logic (Reason) / Persona (Presence)
stamina: { starting: 18, level: 6 }    // Below Operator (21/9), above Hacker's fragile band
recoveries: 8                          // Modest, per canon "lighter frame"
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], additional: {...} } }
```

**~26 planned advancement entries** on the class item, spanning levels 1-10 (see Part 1 Progression Table for the shape). Notable structural expectations vs. Operator/Hacker:

- `turnGain` will be **`"1"`** (matching Hacker's flat cadence) rather than Operator's `"1d3"` (variable). The Elementalist deliberately runs a **flat drip + optional Channel maneuver** rather than variable-per-turn income, per §E3.
- `characteristics.core: ["reason", "presence"]` -- both **native DS keys**. The pattern-mirror of Hacker's `["reason", "intuition"]` and Operator's `["might", "agility"]`. Always translate to Logic (Reason) / Persona (Presence) in player-facing output.
- `epic` is a **new named resource** (Primordial Reservoir) -- verify DS's epic-resource schema supports a class-specific label distinct from the shared "epic" pool. If not, fold Reservoir into the level-10 Operator Mastery / Primordial Reservoir capstone feature and drop the `epic:` field.

### Ability Item Schema (Signatures / Base Heroics / Tier Abilities) -- PLANNED

Modeled directly on Operator's schema (§Ability Item Schema, lines 335-361):

```
type: "ability"
system: {
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "hurl-element", "bolt-barrage", "conflagration"
  story: <flavor line>,
  keywords: [...],                     // e.g. ["magic", "ranged"] for Hurl Element; ["magic", "area"] for Difficult Ground; note "magic" keyword appears on every Power Roll-based ability (real DS engine quirk, not authoring error -- verified on Operator)
  type: "main" | "maneuver" | "triggered" | "free",
  category: "heroic" | "signature",
  resource: <number>,                  // Essence cost: 0 (signatures) or 3/5/7/9/11 (heroics)
  trigger: <string>,                   // populated on triggered-type (e.g. "when a creature enters a Difficult Ground zone")
  distance: { type: "melee"|"ranged"|"self", primary, secondary, tertiary },
  target: { type: "creature"|"self"|"creatureObject"|"area", custom, value },
  power: {
    roll: { formula: "@chr", characteristics: ["reason"], reactive: false },   // Logic (Reason) primary; some effects may cite ["presence"] for Bind rolls specifically
    effects: { <effectId>: { type: "damage"|"applied"|"other", ... } }
  },
  prerequisites: { dsid: ["elementalist"], value: "", level: null },
  effects: { <effectId>: { type: "base", description: <html>, before: true|false, name, sort } }
}
```

**Effect type variety expected**: `"damage"` (standard tiered damage on Hurl Element, Bolt Barrage, Conflagration, etc.), `"applied"` (status conditions -- Slowed/Dazed/Restrained on Chain Lightning's arc target, Cyclone Trap's restrain, etc.), and `"other"` (freeform tiered text with no damage/condition structure -- Signature Bond's persistent-focus rider, Attunement Ascendant's dual-attunement text, Void-Grasp's remove-from-play rider). Any future parsing script must branch on `effects.<id>.type` as with Operator.

**`power.roll.characteristics` on Elementalist abilities should default to `["reason"]`** (Logic = Reason), with a specific set of Bind-related abilities citing **`["presence"]`** (Persona = Presence) instead: Veilbreaker Bind, Summon Elemental's Bind Power Roll clause, Twin Elemental Summon's Bind. Verify which schema field controls the "secondary characteristic for a specific effect" pattern before ship -- may require a **`power.roll.secondary`** or a per-effect `effect.<id>.roll.characteristics` override. This is the class's most complex schema question.

### Feature Item Schema -- PLANNED

Modeled on Operator's schema (§Feature Item Schema, lines 363-376):

```
type: "feature"
system: {
  description: { value: <html rules text>, director: <html, optional GM-only guidance> },
  source: { book: "GHOSTWIRE", page: null, license: "GHOSTWIRE reskin (Draw Steel Creator License)" },
  _dsid: <string>,                     // e.g. "weave-sensitivity", "attunement-discipline"
  advancements: {},                    // empty on standalone-passive features (matches Operator pattern)
  prerequisites: { value: "", dsid: [] | ["elementalist"], level: null }
}
```

**Adopt the `description.director` pattern** on capstone-supersede features:
- **Elemental Attunement IV** (10th) supersedes Elemental Attunement II (4th) and III (7th) -- director note: "This feature replaces Elemental Attunement II and III's immunity values with triple Logic (Reason). Do not stack; increase the existing immunity effect's value rather than add a new copy."
- **Ascendant Weave** (10th) upgrades Bind Discipline (4th) -- director note: "This adds an edge on top of Bind Discipline's +1; do not increase the +1, layer the edge separately."
- **Primordial Reservoir** (10th, epic capstone) -- director note: "Reservoir is a persistent-across-respites resource; unlike Essence, it does not reset at encounter end. Track separately from Essence on the character sheet."

### Signature-Focus (Kit-Slot Item) Schema -- PLANNED

The Elementalist's signature-focus items (staff, wand, orb, ashbone) live in Gear Catalog 6A, not in `ghostwire-classes`, but the class's 1st-level subclass advancement grants one via `itemGrant`. Reference the Hacker's Cyberdeck schema (§Cyberdeck (Kit) Item Schema, lines 387-415) for the pattern:

```
type: "kit" | "gear"                   // TBD -- foci may be modeled as "kit" if they carry a Kit-style bonus rider, or "gear" if pure equipment with a modification-slot count
system: {
  description: { value: <html rules text> },
  source: { book: "GHOSTWIRE-Gear-Cat6A", ... },
  _dsid: <string>,                     // e.g. "warded-staff", "ember-focus", "voidshard-orb"
  price: { nuyen: <int>, availability: <string> },
  modSlots: <int>,                     // per Gear Catalog §F6 Item Tier
  benefits: { ... }                    // qualitative benefit tagged to Essence/Logic (edge on a Channel line, sustain one extra working, an edge on a bind/summon)
}
```

**Open schema question:** whether "focus" is a distinct item type in the Foundry `draw-steel` v1.1.1 system, or whether foci are `gear` items with kit-adjacent modification-slot handling. Verify against the DS v1.1.1 SDK source before writing the focus deploy script.

### Folder Structure (Planned)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Elementalist class item (shared folder with Operator and Hacker class items) |
| `ghostwire-classes` | `GWElSubclassr001` | 3 Specialization subclass items (Pyromancer, Stormcaller, Geomancer) |
| `ghostwire-classes` | `GWElSignatures01` | 3 signature abilities (Hurl Element, Elemental Shaping, Read the Weave) |
| `ghostwire-classes` | `GWElHeroics00001` | 5 base-tier (3-5 cost) heroic abilities |
| `ghostwire-classes` | `GWElTiersFldr001` | All 12 tier abilities (7/9/11-cost, 4 each) |
| `ghostwire-classes` | `GWElFeatures0001` | All 13 core feature items (12 passive + 1 Essence resource explainer) |
| `ghostwire-classes` | `GWElSubFeatures1` | All 15 subclass feature items (5/subclass × 3) |
| `ghostwire-abilities` | `GWElSubAbil00001` | All 21 subclass Specialization Ability items (7/subclass × 3) |
| `ghostwire-kits` | (existing) | Signature-focus items referenced by UUID (Category 6A gear entries -- do not duplicate) |

**Structural note:** the compendium-split (features in `-classes`, specialization abilities in `-abilities`) matches the Operator subclass-recursive dump finding (per Operator master §Folder Structure "CORRECTED 2026-07-28" callout). The Elementalist ship script must build both compendiums, not just `-classes`.

### Deploy/Fix Script Reference (Planned Chronological Order)

**No deploy scripts have been built for the Elementalist yet.** The planned ship script structure below models the Operator's known-good pattern. All scripts will use the standard GHOSTWIRE deploy wrapper (PowerShell 5.1, no `??`/`?.`/ternary, per canonical build log §Environment) and the standard content-generation pipeline (`content.py` with the `damageDisplay` fix applied 2026-07-27 per canonical build log HANDOFF NOTE #6).

Planned order:

1. **`Backup-Ghostwire-World-PreElementalist.ps1`** -- read-only, full compendium snapshot to disk before any writes. Standard pre-ship safety measure per Pre-Flight Doctrine.
2. **`Deploy-Ghostwire-Elementalist-Rebuild-v1.ps1`** -- primary ship script. Creates all 73 items across `ghostwire-classes` and `ghostwire-abilities` in the planned folder structure. Idempotent (checks for existing items by `_dsid` prefix `GWEl` and either updates in place or aborts with warning). Includes `node --check` verification on the Foundry helper JS files invoked before dispatch.
3. **`Diagnose-Ghostwire-Elementalist-Advancements.js`** -- read-only diagnostic to verify the class item's `system.advancements` object built cleanly. Modeled on `Diagnose-Ghostwire-Hacker-vs-Operator-Advancements.js` (referenced in Operator master).
4. **`Backup-Ghostwire-Elementalist-FullDump-v1.js`** -- read-only dump script using the **proven-working Clipboard API + chunked console fallback pattern** (per Operator master §Data Provenance -- do not use `copy()` or Blob-download methods, both failed on Michael's Windows setup). This dump becomes the ground truth for Part 2's live-schema update.
5. **`Deploy-Ghostwire-Elementalist-Patch-*.ps1`** (as needed) -- targeted patches per bug discovery, following the Hacker patch pattern (see canonical build log Hacker Full Rebuild §71/74 items).

### Known Bugs / Caveats for Future Agents

1. **THE ENTIRE PART 2 SCHEMA IS PLANNED, NOT LIVE.** Nothing in Part 2's item IDs, field paths, folder assignments, or planned counts has been verified against a live Foundry dump because no Elementalist has been shipped yet. **Do not treat Part 2 as authoritative until the first `Backup-Ghostwire-Elementalist-FullDump-v1.js` executes cleanly and its output is folded back into this document.** All planned IDs are provisional and may need renaming to satisfy real Foundry key constraints.

2. **OPEN DESIGN QUESTION -- Summon Elemental's two forms are shipped as-drafted (per Michael's 2026-07-28 instruction).** Both Option A (extension acts on caster's turn) and Option B (independent figure with own activation, at higher Persistent cost) are described in Part 1's Summon Elemental section. **Playtest question:** ship both as player-choice at cast time (the current draft), OR consolidate to one form and move the other to a higher-tier upgrade path? Flagged for Michael's review.

3. **OPEN DESIGN QUESTION -- Apex 9/11-Essence workings are FIRST-DRAFT (per Michael's 2026-07-28 instruction).** The 4 options at 9-cost (Cataclysm, Void Vortex, World-Fissure, Twin Elemental Summon) and the 4 options at 11-cost (Greater Elemental Summon, World-Sundering, Attunement Ascendant, Break the Veil) are all GHOSTWIRE-original first drafts, not adapted from the DS SRD. **Playtest question:** are all 8 to ship, or narrow to 2-3 per tier? Provisional recommendation: ship all 8 to give the playtest table room to eliminate rather than starving them of options.

4. **CYBORG-EXCLUSION IS TABLE-ENFORCED, NOT SCHEMA-ENFORCED (per Michael's 2026-07-28 ruling).** The "A Cyborg can never be an Elementalist -- Arcane Severance" doctrine is documented in Part 1's "Chrome an Elementalist Runs" section as a player-facing warning and is enforced at character creation (Step 2). **No mechanical species-check gate is added to the Elementalist class item's `prerequisites` field** for this ship. Flagged as a possible future dev item: if Michael wants a harder enforcement, add a validation script that fails at character-sheet load if a Cyborg species item and an Elementalist class item coexist -- but per Michael's ruling, that is NOT required for the initial ship.

5. **PROVENANCE FLAG -- All Elementalist tier abilities (7/9/11) are GHOSTWIRE-original first drafts, distinct from Operator's Heroes-supplement-adapted content.** Unlike Operator's 7/9/11-cost tier which carries `system.source.book: "Heroes"` with real page citations (136-141) per the DS Creator License, Elementalist tier abilities carry `system.source.book: "GHOSTWIRE"` with `license: "GHOSTWIRE reskin (Draw Steel Creator License)"`. **This is a real, confirmed content-provenance split within the class writeup pattern** -- flag clearly in any future licensing/attribution pass.

6. **OPEN DEV WORK ITEM -- Elemental summon actors are not modeled here.** Signature summons (Ember Companion, Zephyr Companion, Boulder Companion) and the Heroic-ability summoning (Summon Elemental, Twin Elemental Summon, Greater Elemental Summon) all require a **companion actor** stat block in Foundry (Rank 1-5 elementals per §C3 of the Veil rules). These actors are NOT drafted in this document; they need a separate elemental-actor pass in the future (likely a shared "Ghostwire Elementals" bestiary in a new `ghostwire.ghostwire-actors` or `ghostwire.ghostwire-bestiary` compendium, TBD). Cross-reference the master baseline §C3 for elemental Rank/Stamina tables.

7. **OPEN DEV WORK ITEM -- Signature focus items (Category 6A gear) need to be built.** The 1st-level subclass advancement grants a signature focus, referenced by UUID from Gear Catalog 6A. **These focus items may not exist yet in `ghostwire-kits` or wherever Category 6A gear lives** -- verify before ship. If missing, either build them as a companion pass or drop the 1st-level focus advancement to a "starting-nuyen budget with 6A focus recommendation" note.

8. **OPEN SCHEMA QUESTION -- Bind Power Roll characteristics field.** Multiple abilities in this class (Summon Elemental, Veilbreaker Bind, Twin Elemental Summon) call for a Power Roll where the primary characteristic is Logic (Reason) but the **Bind clause specifically** uses Persona (Presence). Foundry's DS v1.1.1 `power.roll.characteristics` field is an array (matches on any) -- does this mean citing both `["reason", "presence"]` picks the higher of the two automatically (an implicit edge), or does it require a per-effect override via `effect.<id>.roll.characteristics`? **Verify against the base DS system source (`src/module/data/item/ability.mjs`) before writing the ship script.** This is the class's most complex schema question.

9. **OPEN NUMERIC QUESTION -- Persistent-4 vs. Persistent-3 for the independent-form Summon.** §E3 of the master baseline states Persistent 2/4 for the extension-form/independent-form summon; Part 1's Summon Elemental section adopts that (-4/turn for the independent). However, the 9-cost Twin Elemental Summon adopts Persistent 3 for two extensions and Persistent 5 for one independent + one extension -- **is Persistent-5 the correct value or should it be Persistent-6 (2+4)?** Provisional: keep Persistent-5 to make the 9-cost Twin Summon worth taking; playtest tuning may raise it to 6. Flagged for review.

10. **OPEN GLOSSARY ITEM -- "Surge" is defined inline near Fury Rising (Pyromancer 6th) but not yet in a shared glossary.** The term is inherited from Draw Steel unchanged (a stored +2 damage bonus at E4-5 scaling up to +5 at E1) and used across Operator canon (Trigger Cadence, Precision Strike, Warzone Incarnate) and Elementalist Fury Rising. **Provisional per-Echelon values are placeholder** pending the master baseline's numeric damage/status pass. When that pass lands, migrate the definition to a shared glossary in the master baseline and cross-reference it from every class doc that uses the term (Operator master, Elementalist master, and any future class that references surges).

11. **OPEN CONTENT-COMPLETENESS ITEM -- No Elementalist-specific Chrome/cyberware recommendations drafted.** Part 1's "Chrome an Elementalist Runs" section notes the magic-erosion doctrine (proportional Soft/Standard/Salvage penalties) but does NOT name specific implants from `GHOSTWIRE-Chrome-Catalog-v1.md` that a mage-friendly (Sensory/Recovery Soft) build might tolerate. This is the same open item as Operator's item #7 in that class's Known Bugs, and should be addressed in a shared "class-specific chrome recommendations" pass across all shipped classes.

### Source File Index

| Purpose | Path |
|---|---|
| Canonical build log (single source of truth for build state across all classes) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/181cb751-b1b8-4488-8fae-db7179aae211/GHOSTWIRE_BUILD_LOG_CANONICAL.md` (largest of 4 copies, 129,634 bytes -- the authoritative one) |
| Master rules baseline (Elementalist chapter at lines 3560-3654; §E3 numeric baseline at lines 4838-4863) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f6eb5eb4-8890-4f03-b840-dd842894db1a/master_rules_baseline-1.md` (710 KB) |
| Elementalist concept design doc (superseded by master baseline but consistent) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f695061a-33dd-4bc8-8bc2-743731558b6a/elementalist.md` (89 lines) |
| Companion class doc: Operator (structural template + Foundry-shipped reference) | `/home/user/workspace/memory/space_files/Ghostwire_Operator_Development_Master.md` (435 lines) |
| Companion class doc: Hacker (structural template + Foundry-shipped reference) | `/home/user/workspace/memory/space_files/Ghostwire_Hacker_Development_Master.md` (480 lines) |
| Pre-Flight Doctrine (governing process rules) | Uploaded `GHOSTWIRE_Preflight_Doctrine_v1.md` |
| Chrome/cyberware rules (Body Integrity, Echelon doctrine, magic-erosion) | Uploaded `GHOSTWIRE-Chrome-Rules-v1.md` |
| Chrome/cyberware catalog (implant stats -- not yet cross-referenced for Elementalist Soft-tolerant recommendations) | Uploaded `GHOSTWIRE-Chrome-Catalog-v1.md` |
| Veil rules chapter (summon/bind/command/banish verbs, §C3 elemental entity stat table, Price principle) | In master baseline (search for "unified Veil chapter" and §C4 baseline reference) |
| Gear Catalog Category 6A (Elementalist foci) | In master baseline (lines 2384+, "6A -- Elementalist foci") |

---

*End of GHOSTWIRE Elementalist Class Compendium (First Pass). As of 2026-07-28, this document is **structurally complete on the design/canon side (Part 1)** and **planned-only on the implementation side (Part 2)** -- no Foundry ship has been executed yet. Recommended next steps in order: (1) Michael reviews Part 1 for design ratification, particularly the 8 apex working drafts (7/9/11-cost tier) and the two Summon Elemental forms; (2) Michael reviews Part 2's Known Bugs list and resolves the 10 open items; (3) build `Deploy-Ghostwire-Elementalist-Rebuild-v1.ps1` and ship to `ghostwire-v2` scratch world; (4) run `Backup-Ghostwire-Elementalist-FullDump-v1.js` (Clipboard+chunked-console pattern per Operator's proven approach) and fold real IDs, real field paths, and any deviations from planned schema back into Part 2 in place; (5) update the canonical build log with the Elementalist ship state. The Elementalist ship is the fourth class to reach Foundry after Operator, Hacker (patch pending), and completes the arcane-caster and Veil-summoner spine before the Street-Priest (fifth caster and next Veil class in the roadmap).*
