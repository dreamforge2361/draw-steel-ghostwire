# The Elementalist

**RAW status:** draft  
**Sources:** `docs/rulebook/06-elementalist.md`

Veil workings referenced here are summarized in `22-the-veil.md`.

---

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic, Persona |
| **Heroic Resource** | Essence |
| **Epic Resource / Capstone** | Primordial Reservoir (10th level) |
| **Starting Stamina** | 18 |
| **Stamina per Level** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Optional light Kit (Hexshot / Spellblade / Sanctified) -- magic-damage rider reskins as elemental essence; foci not chrome |

## Essence -- Your Heroic Resource

**Essence in Combat.** At the start of a combat encounter, you gain Essence equal to your Victories (the caster arrives already partly attuned -- the same on-ramp every class gets). You are always **attuned to one element** (fire, air, water, earth, or void). Choosing or switching your attuned element is **free** -- no action, no maneuver -- and may be done on your turn. Attunement sets which element your drip and your Channel produce.

**The Drip (free, per turn).** At the start of each of your turns during combat, you gain **1 Essence** of your attuned element -- automatic, no maneuver required. This is your reliable trickle. The drip alone is not enough to fire a powerful working every turn; that is the point.

**Channel (the optional spike -- costs a maneuver).** As a **maneuver**, you may **Channel** -- focusing hard on the attuned element to bank *extra* Essence on top of the drip. Channeling the **same** element on consecutive turns builds a ramp: **+2 Essence turn 1, +3 turn 2, +4 turn 3 or later (capped at +4)**. Switching your attuned element **resets the Channel ramp** to +2 on your next Channel (the drip is unaffected). A committed caster at full ramp banks **+1 (drip) +4 (Channel) = +5/turn**; a caster who skips the maneuver banks only the +1 drip.

**Elemental Resonance.** The first time each combat round that typed **elemental** damage lands on the field from your own workings, bank **+1 Essence** -- the blaster's pulse layered under the drip and ramp. A *landing* full-ramp caster nets **+6/turn**.

**Essence Outside of Combat.** You can't gain Essence outside of combat, but you can still use your heroic abilities and effects that cost Essence without spending it. Whenever you use an ability or effect outside of combat that costs Essence, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite. You may sustain a persistent working for a number of rounds equal to your Victories.

**Cap & Loss.** Essence is **capped at 8 at 1st level, +4 per Echelon** (Echelon 1=8; Echelon 2=12; Echelon 3=16; Echelon 4=20). The **Essence Cap +4** feature at 7th level *is* this ladder's Echelon 3 step (12 → 16); it is not an extra +4 stacked on top of the ladder. **Echelon 4's cap of 20 is the ceiling** — no feature raises it further. All unspent Essence is **lost at encounter end** -- attunement fades when the fight does.

**Sustain (the throttle).** **Sustaining a persistent working** (a wall, a zone, a bound elemental) **reduces the Essence banked at the start of each turn by that working's persistent value** (Persistent 1 = -2/turn; Persistent 2 = -4/turn). **Sustain drain = −2 × the working's Persistent rating per turn** (Persistent 3 = −6, Persistent 4 = −8, Persistent 5 = −10, Persistent 6 = −12). Taking a heavy hit in one turn can **break concentration** and end sustained workings (a Persona save vs. potency).

**Firewall note:** Essence is a class resource on the character-power side of the firewall. It never touches **nuyen** or **Body Integrity**, and chrome never generates it. See "Kits and Chrome," below.

## Signature Abilities

Every Elementalist knows all three signature abilities at 1st level -- these are your baseline, no-Essence-cost options, all rolled with Logic:

| Signature | Essence Cost | Type | Target | Damage (low / middle / high) |
|---|---|---|---|---|
| **Hurl Element** | 0 (spend 1+ Essence to boost -- see below) | Ranged strike (dist 10) | 1 creature | 3+chr / 6+chr / 9+chr (elemental, typed to attunement) |
| **Elemental Shaping** | 0 (spend 1+ Essence to enlarge) | Maneuver, self / short range (dist 5) | 1 creature or self | 2/4/6 damage OR forced-Slide 1/2/3 OR self-Shift 1/2/3 (choose one on cast) |
| **Read the Weave** | 0 | Maneuver, self | -- | Power Roll 2d10 + Logic: ≤11 sense Veil thinness / know magic is present; 12–16 read rank/nature OR identify a working; 17+ as middle + a bound creature's true name |

**Hurl Element** is your bread-and-butter blaster tool -- the every-turn strike that scales cleanly with Logic via the `@chr` damage bonus, and whose damage type flexes to your current attunement (acid/cold/corruption/fire/lightning/poison/sonic). **Spend Essence** on cast: **+1 damage OR push 1 square per Essence spent**, or spend **2+ Essence** to splash **half damage** onto a second target within 2 squares -- the everyday blaster tool that scales with your bank.

**Elemental Shaping** is your every-turn controller signature -- the utility hinge, chosen fresh each cast: a burst of typed elemental damage to a nearby foe, a small forced-movement slide (a gust of wind, a stone bridge, a wave), or a short repositioning shift for yourself (a step through void, a blink of storm). **Spend Essence** to enlarge whichever effect you chose: **+1 to the chosen effect (damage, slide, or shift) per Essence spent**. This is the tool that makes you a controller even before your heroic abilities come online.

**Read the Weave** is your **Sense the Veil** signature (see Veil rules). **Power Roll 2d10 + Logic**:
- **low (≤11):** sense the thinness of the Veil, or know that magic is present.
- **middle (12–16):** read an entity's rank or nature, OR identify a working and what it does.
- **high (17+):** as middle, plus learn a bound creature's true name (your later Persona-based binds against it gain an edge).

Free intel that sets up binds and banishments.

*@chr below always means your Logic score.*

## Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are the Elementalist's workings -- chosen by cost band as you level, each an Essence-fueled release of the ramp you've been building.

*Power Roll results use this book’s print order: **low** (≤11) / **middle** (12–16) / **high** (17+).*

### Base Band (1-5 Essence, chosen at 1st level)

| Ability | Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Bolt Barrage** | 3 | Main Action | Ranged strike (dist 10), 2 creatures OR 1 creature harder | Damage 4+chr / 7+chr / 10+chr per target (light-band); at 1 target only, add +Logic again to the damage result |
| **Difficult Ground** | 3 | Main Action | Ranged area (cube 3, dist 10) | Damage 6/9/12 (medium-band) to each enemy; ground in the cube becomes **difficult terrain** until your next turn. **Persistent 1** (-2 Essence banked per turn) to sustain |
| **Elemental Wall** | 5 | Maneuver | A wall within range (dist 10), 3 squares long, flavored by your attuned element (flame/stone/ice/force) | Blocks line of sight and movement per the element; enemies entering or starting adjacent take 9+chr / 12+chr / 15+chr elemental damage (heavy-band). **Persistent 1** (-2/turn) to sustain and extend |
| **Conflagration / Tempest** | 5 | Main Action | Ranged area (cube 4, dist 10) | Heavy elemental damage 9+chr / 12+chr / 15+chr (heavy-band) to each enemy in cube, flavored by your channeled element (firestorm, ball lightning, acid rain, choking dust, roiling void). **Persistent 2** (-4/turn) to re-detonate each turn without re-paying |
| **Summon Elemental** | 5 | Main Action | Veil working (Summon + Bind), 1 elemental up to your bind cap | Tear an elemental loose from the Veil and bind it to serve. See "Summon Elemental (the pet path)" below for full mechanics. **Persistent 2+** (-4/turn) -- the real cost is the upkeep, not the cast |

**Bolt Barrage** is the blaster opener -- two targets banged for real (light-band) damage on a 3-Essence spend, or one target hit twice as hard when you need to focus fire. **Difficult Ground** is the controller opener -- a live zone that both damages on entry AND punishes enemy movement across it; sustaining it costs -2/turn out of your intake, which is a real tension when you're also trying to build for a Heavy.

**Elemental Wall** and **Conflagration/Tempest** are the two Heavy workings -- the 5-Essence releases you build your ramp toward. Wall is the controller's play: block a line, force a chokepoint, punish the room. Tempest is the blaster's play: everything in the cube takes heavy damage, and if you're willing to burn Persistent 2 you can keep detonating for -4/turn.

**Summon Elemental (the pet path)** is the class's defining working:

- **As an extension (lower investment, levels 1–5 / early echelons):** the elemental acts on **your turn**, using your action economy -- a lash of living flame, a stone fist, a striking wind. Low bookkeeping. Damage per its own Rank (light-band = 4+chr low / 7+chr middle / 10+chr high). Persistent 2 (-4 to your Essence intake per turn while sustained).
- **As an independent figure (higher investment, levels 7–10 / later echelons, or a properly-bound mid-level+ Elementalist):** a properly bound elemental becomes its **own figure** on the map with its own Stamina and activation on the shared round -- the true summoner fantasy. Stamina per Veil §C3 (locked); strike damage for Rank 1 / companions uses the light-band printed above — Rank 2+ strike ladders are deferred (see Veil §C3). Bind unlocks: a 1st-level Elementalist starts with a Rank 1 extension only; a 5th-level Elementalist unlocks Rank 2 independent. Persistent 4 (-8 to your Essence intake per turn while sustained).
- **The bind is the throttle:** a **Bind Power Roll (2d10 + Logic)** on cast, with an **edge if your Persona is equal to or higher than your Logic** (Bind Discipline's +1 still applies) -- high (17+) binds it clean and grants an edge on Command rolls; middle (12–16) binds but the elemental resists a Command once per encounter; low (≤11) **fails/breaks the bind** and the elemental becomes **hostile and free** for one round before the Veil pulls it back -- the Veil chapter's slipped-leash risk. A **heavy hit while sustaining** can also break the bind (Persona save vs. potency).
- **The Price applies:** a willing elemental exacts a **task aligned to its nature** paid before or after (a Pyromancer honoring flame, a Geomancer restoring a fouled spring); coercing an unwilling one pays in **+1 Taint + 1 spirit-attention tick per Rank** at cast (`27-corruption-taint.md`) -- lightest weight among casters, but never zero. Non-pact Taint still respects the +1-per-scene cap.
- **Sustaining a bound elemental** reduces Essence banked each turn (Persistent 2 for extensions, Persistent 4 for independents). You cannot rain Tempests at full tilt *and* hold a greater elemental without deliberate investment.
- **Stamina (Veil §C3 locked 2026-09-18):** a summoned elemental has **rank base + (Logic × level)** Stamina — base **15** (Rank 1 and the signature companions) / **25** (Rank 2) / **35** (Rank 3) / **50** (Rank 4) / **65** (Rank 5). Summon Elemental binds up to **Rank 1 from 1st level, Rank 2 from 5th, Rank 3 from 7th**. At most **2** bound non-companion elementals at once; a new bind releases the oldest. Rank 2+ / Greater / R5 strike ladders and defense stamps remain deferred (see `22-the-veil.md` §C3).
### 7-Cost Band (chosen at 3rd level; provisional)

| Ability | Essence Cost | Type | Target | Effect Summary |
|---|---|---|---|---|
| **Elemental Convergence** | 7 | Main Action | Ranged area, cube 5 (dist 10), enemies | Heavy elemental damage 11+chr / 15+chr / 20+chr, plus a rider chosen by attuned element: **fire** = burn (2 damage save-ends); **cold** = slowed (save ends); **lightning** = dazed (save ends); **acid/corruption** = weakened (save ends); **void** = pull 3 squares toward cube center. **Persistent 2** to re-detonate |
| **Veilbreaker Bind** | 7 | Main Action | Veil working; 1 elemental target within range | Force a hostile summoned/native elemental into a bind roll (contested Persona). On success, wrest control of it for the encounter -- it becomes an ally elemental at its own Rank. On failure, take 2d6 backlash and grant it an edge on its next attack. The anti-caster tool -- specifically shaped to counter enemy Veil summoners |
| **Second Ramp** | 7 | Free Maneuver | Self | No roll. **Immediately gain +3 Essence** and treat your Channel ramp as if you had already been building for 2 turns (grants +4 Channel on your next Channel maneuver regardless of prior state). The tempo-swing tool -- the mage's "Trigger Cadence" equivalent |
| **Sanctum Stone** | 7 | Maneuver | A warded zone within range (aura 3, dist 5) | Raise a warded circle of consecrated element -- enemies within take a bane on all attacks; allies within gain edge on Persona saves; forced movement into the aura is halved. **Persistent 2** to sustain. The Geomancer's dream, but any subclass can take it |

**Elemental Convergence** is the cost band's damage centerpiece -- a bigger Tempest, and the element-flavored rider is the real payoff (a Pyromancer's convergence lights the room on fire; a Stormcaller's dazes half the enemies for a round). **Veilbreaker Bind** is the counter-caster tool, deliberately narrow -- it does nothing against unhelmed martials, but against a rival hexer or a wild elemental it flips the encounter. **Second Ramp** is the tempo-swing option: burning a Free Maneuver AND 7 Essence to instantly refill and max your ramp is a big investment, but the payoff is a guaranteed next-turn Heavy. **Sanctum Stone** is the defensive apex -- a sustained zone (**Persistent 2**, -4 Essence banked per turn) that holds for as long as you keep paying for it, shifting the fight in your favor and, if you're Geomancer, layers on top of your terrain features.

### 9-Cost Band (chosen at 5th level; provisional)

| Ability | Essence Cost | Type | Damage / Effect (low / middle / high) | Notable Rider |
|---|---|---|---|---|
| **Cataclysm** (Pyromancer apex) | 9 | Main Action, area cube 6 (dist 10), enemies | 14+chr / 19+chr / 26+chr elemental damage (typed to attunement) | **Strips 1 Malice from the Director** on high (17+); on middle the ground remains difficult terrain until end of encounter; low catches only the primary target and Alert/spirit-attention ticks by 1 |
| **Void Vortex** (Geomancer apex, void-flavored) | 9 | Main Action, area aura 4 (self-centered) | 10+chr / 14+chr / 19+chr void/corruption damage each round to enemies pulled in; enemies at 0-Stamina or **winded** at the start of their turn within the vortex are **destroyed** (removed from play, Rank 1 elementals or lower / minions absolute; Rank 2+ take max damage) | **Pulls each enemy 2 squares toward you** at the start of their turn while sustained. **Persistent 4** (-8/turn). |
| **World-Fissure** (Geomancer apex, earth/void-flavored) | 9 | Main Action, line 8 (dist 0) | On cast: 10+chr / 14+chr / 19+chr damage to every creature in the line, prone on middle or high; the ground along the line becomes an **impassable fissure** for the rest of the encounter | Difficult terrain in 3 squares to either side of the fissure. |
| **Twin Elemental Summon** (Stormcaller / Pyromancer / any subclass) | 9 | Main Action, Veil working (bind two elementals) | Bind **two** elementals simultaneously (one action, one bind roll). Both may be extensions OR one may be an independent (Echelon 3 or higher only for the independent). **Persistent 3** (-6/turn) for two extensions; **Persistent 5** (-10/turn) for one independent + one extension | The pet-path apex -- doubles your action economy for the encounter but takes a huge Essence bite each turn. Broken bind on either flips both to hostile |

### 11-Cost Band (chosen at 8th level; provisional)

| Ability | Essence Cost | Type | Effect |
|---|---|---|---|
| **Greater Elemental Summon** | 11 | Main Action, Veil working | Bind a **Rank 4 elemental** (Rank 5 at Echelon 4 / late career) as an independent figure. It becomes an active combatant on the shared round with its own Stamina, its own maneuvers, its own signature (an Ancient Flame, a Roaring Storm, a Living Mountain, a Devouring Void). **Persistent 6** (-12/turn). Willingly-bound: extracts a **greater task** (a season's service to a temple, a fouled land restored, a corrupted vein cleansed); coerced: pays **+3 Taint + 3 spirit-attention** on cast (`27-corruption-taint.md`). The full summoner fantasy realized |
| **World-Sundering** | 11 | Main Action, area cube 8 (dist 10) | **No Power Roll** -- the damage is automatic and keyed to your Logic. Every enemy in the cube of potency **strong** or weaker takes **20+chr elemental damage** and is **prone**; every enemy of potency **weak** is **reduced to 0 Stamina**; minions in the cube are outright destroyed. The ground in the cube becomes an **elemental scar** for the rest of the session -- difficult terrain, ambient elemental damage 3/turn to any non-elemental creature crossing it |
| **Attunement Ascendant** | 11 | Maneuver, self | No roll. Until the end of the encounter, your Channel ramp is **already at +4 on cast and does not reset when you switch attunement**. Additionally, you may attune to **two elements at once**; you gain the drip and resonance bonus of both, and your Signature abilities may combine damage types (fire + lightning = plasma; earth + water = mud; etc., Director rules on combined effects). The self-buff apex -- turns you into a walking hurricane of typed damage for the rest of the fight |
| **Break the Veil** | 11 | Main Action, self-centered aura 5 | The Veil thins around you. Every ally within the aura may **sustain any persistent working at reduced cost** (Persistent 2 becomes Persistent 1, draining -2/turn; Persistent 4 becomes Persistent 2, draining -4/turn). **You** may sustain **one** persistent working with **no Essence cost** for the rest of the encounter. Additionally, all your Signature and Heroic ability rolls gain edge for the duration. **Persistent 4** (-8/turn) on cast. The team-wide caster apex |

## Element Subclasses

At 1st level you choose your **Elementalist Specialization** -- your element cluster, which sets your favored damage types, tints your signatures and heroic abilities, and grants a subclass identity feature and a signature summon. All three subclasses share the Logic/Persona chassis and the Essence engine; each grants a distinct **1st-level feature**, a **signature-ability tweak**, a **bonus key/secondary skill**, and a **contact hook** (ties into the Followers & Contacts framework).

**Specialization Abilities are not cost-band picks.** Your subclass grants them at the level shown in its own ladder, on top of whatever Heroic Ability you choose from a cost band at that point in your career. The number in the **Essence Cost** column is what the working costs to fire, not the band it was drawn from -- which is why the five 9th-level Specialization Abilities (Living Sun, Ashen Wake, Cataclysm's Voice, The Deluge, Void-Grasp) each cost **11 Essence** even though the shared **11-cost band** opened at 8th level. By 9th level your Essence cap is 16, so an 11-Essence working is affordable on a built ramp.

*@chr below always means your Logic score.*

### Pyromancer -- *"Combustion-Thaumic Specialist"*

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

- **Burn On** (1st) -- Your fire and elemental damage carries a *lingering* rider. Whenever you deal fire, lightning, or acid damage to a creature via a Signature or Heroic ability, that creature also takes **1 additional fire damage at the start of its next turn (2 at Echelon 2, 3 at Echelon 3, 4 at Echelon 4)**. The Pyromancer's signature "keep them burning" identity.
- **Firestorm Attunement** (2nd) -- Your **Channel** builds one step faster when your attuned element is fire, lightning, or acid: turn 1 = +3, turn 2 = +4 (cap). You reach maximum ramp one turn sooner in the fire lineage.
- **Fire Immunity** (5th) -- Immunity to fire damage equal to your Logic score. You may walk through fire, sustain a Fire Wall from inside it, and no longer take ambient fire damage from a Cataclysm you sustain.
- **Fury Rising** (6th) -- Whenever you spend 5 or more Essence in a single turn, gain **1 surge** (available until end of your next turn) and your next Signature ability this encounter deals +Logic extra damage. Surges: `04`.
- **The Furnace Within** (8th) -- +1 bonus to Logic-based power rolls. Whenever you would spend Essence on a fire/lightning/acid working, you spend **1 less** (minimum 0), once per round.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Ember Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 fire elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 4+chr / 7+chr / 10+chr (light-band, fire). *This is the Pyromancer's "free pet lite" -- doesn't replace Summon Elemental, but a signature-fueled taste of the summoner fantasy from level 1.* |
| **Wildfire** | 5 | 2nd level | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 9+chr / 12+chr / 15+chr fire; on middle or high, the cube becomes a burning zone (difficult terrain + ambient 3 fire damage/turn to enemies inside) until end of encounter. |
| **Cleansing Flame** | 5 | 2nd level | Maneuver | Self or one ally, aura 2. All ongoing save-ends fire, acid, poison, or corruption effects on target end. Target gains temporary Stamina equal to your Logic × 2. *A rare healing-adjacent tool for the Pyromancer.* |
| **Solar Lance** | 9 | 6th level | Main Action | Ranged strike, dist 20, line 1. Damage 12+chr / 17+chr / 24+chr fire; all creatures in the line hit; ignore cover; on high (17+) the target is blinded (save ends). |
| **Combustion Chain** | 9 | 6th level | Main Action | Ranged strike, 1 creature (dist 10). Damage 10+chr / 14+chr / 19+chr fire; if the target is at half Stamina or below, chain to a second target within 3 squares for 5+chr / 8+chr / 11+chr damage; if the second target dies from this, chain to a third for 3+chr / 5+chr / 8+chr. |
| **Living Sun** | 11 | 9th level | Main Action | Self-centered aura 5. Bright light fills the aura; enemies within take 6+chr / 9+chr / 13+chr fire damage at the start of each of their turns; allies in the aura may spend a Recovery as a free maneuver once per turn. **Persistent 4** (-8/turn) to sustain. The "walking sun" identity. |
| **Ashen Wake** | 11 | 9th level | Main Action | Ranged area, cube 5 (dist 10), enemies. Damage 8+chr / 12+chr / 16+chr; the cube becomes ashen ground (difficult terrain, obscures line of sight through it, ambient 3 fire damage/turn to any non-fire-immune creature) until end of session. The "burn the earth" identity. |

### Stormcaller -- *"Kinetic-Atmospheric Specialist"*

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

- **Kinetic Enlargement** (1st) -- Whenever your Signature or Heroic abilities include **forced movement** (push, slide, pull, teleport, self-shift), that movement is **increased by 1 square** at Echelon 1-2, 2 squares at Echelon 3, and 3 squares at Echelon 4. The Stormcaller's signature "everyone moves more" identity.
- **Riding the Storm** (2nd) -- +2 to your Speed while attuned to air or water. When you use Elemental Shaping's shift option, you may treat the shift as a **teleport** (ignoring intervening terrain and enemies), once per encounter.
- **Storm's Blessing** (5th) -- Immunity to lightning damage equal to your Logic score. Additionally, you and each ally within 3 squares gain edge on Reflex saves against elemental effects.
- **Rolling Thunder** (6th) -- Whenever you deal lightning or cold damage to a creature via a Signature or Heroic ability, arc **1 damage of the same type to a second creature within 3 squares** (2 damage at Echelon 3, 3 damage at Echelon 4). The battlefield-arc identity.
- **Eye of the Storm** (8th) -- +1 bonus to Logic-based power rolls. Once per round, when a creature within 5 squares makes an attack against you or an ally, force it to reroll (a "gust deflects the shot" narrative rider); the second roll stands.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Zephyr Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 air or water elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 3+chr / 5+chr / 8+chr (light-band, cold/lightning/sonic -- your choice on cast). Its melee strike also **slides the target 1 square** on middle or high. |
| **Chain Lightning** | 5 | 2nd level | Main Action | Ranged strike, dist 10, primary target then arcs. Damage 8+chr / 11+chr / 14+chr lightning; arcs to a second target within 3 squares for half; arcs to a third within 3 squares of the second for quarter. |
| **Riptide Grab** | 5 | 2nd level | Maneuver | Ranged area, cube 3 (dist 5), enemies. **Pull each enemy 3 squares toward the cube center** (5 at Echelon 3, 7 at Echelon 4). **Power Roll 2d10 + Logic:** an enemy pulled into a solid obstacle takes **2** (≤11) / **4** (12–16) / **6** (17+) damage. |
| **Cyclone Trap** | 9 | 6th level | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 8+chr / 11+chr / 15+chr sonic; enemies inside are **restrained** (save ends) on middle or high. **Persistent 2** to sustain. |
| **Skyfall** | 9 | 6th level | Main Action | Ranged area, cube 4 (dist 15), enemies. Damage 10+chr / 14+chr / 19+chr lightning; enemies of potency average or lower become **prone**; enemies of potency strong or weaker become **dazed** (save ends). |
| **Cataclysm's Voice** | 11 | 9th level | Main Action | Ranged area, cube 6 (dist 10), enemies. Damage 12+chr / 17+chr / 24+chr sonic; targets are **deafened** (save ends) on middle or high; deafened targets cannot be commanded by an ally (an anti-Commander control rider). *Cataclysm's Stormcaller apex.* |
| **The Deluge** | 11 | 9th level | Main Action | Ranged area, cube 8 (dist 10), enemies. Damage 8+chr / 12+chr / 17+chr cold/sonic; **the entire cube fills with water** (difficult terrain, half speed, chance to drown per environmental rules); creatures inside take an additional **2 lightning damage / turn** from a stormfront overhead. **Persistent 4** (-8/turn) to sustain. The "flood the room" apex. |

### Geomancer -- *"Geo-Structural / Spatial Specialist"*

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

- **Stone Shield** (1st) -- Whenever you raise a terrain feature (Elemental Wall, Pillar of Stone, Sanctum Stone, or a Difficult Ground zone), you or one ally within 3 squares gains **temporary Stamina equal to your Logic score** (double at Echelon 3, triple at Echelon 4). The Geomancer's signature "raising terrain protects you too" identity.
- **Warding Terrain** (2nd) -- Enemies moving through **your** Difficult Ground zones or terrain features take an additional **2 damage per square** (typed to your attunement). Your terrain isn't just difficult -- it's hostile.
- **Root Deep** (5th) -- You cannot be forced-moved against your will while adjacent to a terrain feature you raised. Additionally, +2 to your Stability (as the Operator's Anchored Stance, but always-on).
- **Fortress Stance** (6th) -- Once per encounter as a Free Maneuver, transform any one square you occupy into a raised pillar of stone (each adjacent creature makes a **Physique test** or falls prone; you gain **cover** and +2 Stamina from armor until you leave the square).
- **Immutable** (8th) -- +1 bonus to Logic-based power rolls. You are immune to being knocked prone, restrained, or forced-moved by any non-Rank-4+ source; you may still choose to fall prone voluntarily.

**Specialization Abilities:**

| Ability | Essence Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Boulder Companion** | 0 (1/encounter refresh) | 1st (signature summon) | Summon, extension form | Summon a **Rank 1 earth or void elemental** as an extension (acts on your turn) for a short duration (3 rounds, sustain-free). Damage 4+chr / 7+chr / 10+chr (light-band, acid/corruption -- your choice on cast). Its melee strike is a **shove test rider** (may shove 1 square as a free rider on hit, at middle or high). |
| **Pillar of Stone** | 5 | 2nd level | Maneuver | Ranged, 1 square within range (dist 10). Raise a pillar of stone up to 4 squares tall in that square; creatures in the pillar's target square are shoved to an adjacent empty square. The pillar blocks line of sight, provides cover, and is **impassable difficult terrain**; it lasts until end of session or until destroyed (5+Echelon Stamina). **Persistent 1** to sustain and maintain multiple pillars. |
| **Corrosive Rain** | 5 | 2nd level | Main Action | Ranged area, cube 4 (dist 10), enemies. Damage 6+chr / 9+chr / 12+chr acid/corruption; on middle or high, all creatures in the cube also take a Weakened condition (save ends). |
| **Voidstep** | 9 | 6th level | Maneuver | Self. **Teleport up to 10 squares** to a visible location; you may bring one adjacent ally with you. On arrival, all enemies adjacent to your destination take 5/7/10 corruption damage from the closing tear in the Veil. |
| **Anchoring Field** | 9 | 6th level | Main Action | Ranged area, aura 4 (self-centered), enemies. Damage 6+chr / 9+chr / 12+chr acid; enemies within cannot teleport, cannot be teleported, and take -2 to their Speed (save ends). **Persistent 3** (-6/turn) to sustain. The anti-Voidstep/anti-teleport tool. |
| **World-Fissure** | 9 | 9th level | Main Action | *One ability, defined once -- see Heroic Abilities → 9-Cost Band, above.* It sits in the shared 9-cost pool; Geomancers may also take it as this 9th-level Specialization pick. Either way it costs **9** Essence, not 11. |
| **Void-Grasp** | 11 | 9th level | Main Action | Ranged, 1 creature (dist 15). **The target is grasped by the Veil itself.** Damage 12+chr / 17+chr / 24+chr void; on high (17+), the target is **removed from play until end of your next turn** (returns in the same square, exhausted -- takes an automatic 2d6 damage on return); on middle, the target is **prone and immobilized** (save ends). |

## Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Skills (choose 2, exploration/intrigue) - Elementalist Specialization (choose subclass) - Signature Abilities (all 3 known) - Heroic Ability (choose 1 of 5, base band) - Essence (heroic resource) | -- | Subclass passive + signature summon + unique skill + signature focus item |
| **2** | Perk (any) | Perk (choice) | Subclass 2nd-level passive + 2nd-Level Specialization Ability (choice of 2) |
| **3** | Choose a 7-Cost Heroic Ability (pool of 4) - Features grant (Weave Sensitivity, Attunement Discipline) | -- | -- |
| **4** | Perk (Arcane/Streetcraft/Shadow) - Features grant (Practiced Ramp, Elemental Attunement II, Signature Bond, Bind Discipline) | Characteristic Increase (Logic/Persona to 3) - Skill | -- |
| **5** | Choose a 9-Cost Heroic Ability (pool of 4) | -- | Subclass 5th-level passive |
| **6** | Perk (any) | Perk (choice) | Subclass 6th-level passive + 6th-Level Specialization Ability (choice of 2) |
| **7** | Features grant (Essence Cap +4, Elemental Attunement III) | Characteristic Increase (all +1, max 4) - Skill | -- |
| **8** | Perk (Arcane/Streetcraft/Shadow) - Choose an 11-Cost Heroic Ability (pool of 4) | -- | Subclass 8th-level passive |
| **9** | Features grant (Weave Mastery -- "The Deep Weave") | -- | Subclass 9th-level Specialization Abilities (choice of 2) |
| **10** | Perk (any) - Features grant (Primordial Reservoir -- epic capstone, Elemental Attunement IV, Ascendant Weave) | Characteristic Increase (Logic/Persona to 5) - Skill | -- |

## Core Class Features (Non-Subclass)

- **Weave Sensitivity** (3rd) -- Passive. Passively detects Veil-adjacent phenomena within 5 squares -- spirits, sustained workings, magical effects, corrupted zones. You know when the Veil is thin near you (corrupted zones apply Persona-based corruption pressure per Hostile-Env rules).
- **Attunement Discipline** (3rd) -- Passive. You may switch your attuned element as a **free action** even during someone else's turn (not just your own). Additionally, when you switch elements, gain **1 free Essence** (the "warmth of the transition" -- a small tempo swing that partially offsets the ramp reset).
- **Practiced Ramp** (4th) -- Passive. Your Channel ramp starts at **+3** (not +2) on turn 1 while attuned to your subclass's primary element (fire for Pyromancer, air/water for Stormcaller, earth/void for Geomancer). One turn saved per encounter, per commitment.
- **Elemental Attunement II** (4th) -- Passive. Immunity to your subclass's primary element damage type equal to your Logic score. Stacks with subclass-specific immunities (Pyromancer's Fire Immunity, etc.) at level 5.
- **Signature Bond** (4th) -- Passive. Once per Echelon, you may permanently bond a **signature focus** (a warded staff, a summon-focus, an elemental wand -- one item from Gear Catalog 6A). Bonded foci gain a deeper persistent benefit (an edge on one Channel line, sustain one extra working, an edge on a bind/summon roll -- per the focus's own text) beyond their nuyen cost. You cannot bond more than one focus at once; unbinding requires a respite.
- **Bind Discipline** (4th) -- Passive. Add +1 to all Persona-based Bind rolls (Summon Elemental, Veilbreaker Bind, and any subclass equivalents). The controller identity refined.
- **Essence Cap +4** (7th) -- Passive. Your Essence cap rises by 4, **from 12 to 16**. This is the Echelon 3 step of the cap ladder printed under "Cap & Loss," above (E1 8 / E2 12 / E3 16 / E4 20) -- the feature is how that step is granted, not a second +4 on top of it.
- **Elemental Attunement III** (7th) -- Passive. Immunity to your subclass's primary element damage type rises to twice your Logic score; you may add a **second attunement type** to your subclass's primary as a permanent secondary (a Pyromancer picks up lightning OR acid; a Stormcaller picks up cold OR sonic; a Geomancer picks up void OR corruption). Now attunement can flex without full switch.
- **Weave Mastery -- "The Deep Weave"** (9th) -- Respite activity. You may establish a **standing bind** on a signature elemental (any Rank up to your own Echelon -1). The elemental persists on the material plane for the duration of the current session-arc (roughly one long-term run or ~20-30 rounds of combat spread across scenes). It acts independently on the shared round; you sustain it for -1 Essence per turn (reduced from Persistent 2/4) but only while awake and conscious.
- **Elemental Attunement IV** (10th) -- Passive. Immunity to your subclass's primary damage type rises to **three times** your Logic score. Additionally, you may attune to **two elements at once** (as the 11-cost Attunement Ascendant working) permanently; this replaces the earlier secondary attunement from Attunement III.
- **Ascendant Weave** (10th) -- Passive. Your bind rolls to Summon and Command gain a permanent edge; your standing bind (from Weave Mastery) may hold a Rank up to your Echelon (not -1). You may sustain **one** persistent working with **no Essence cost** per encounter, in addition to any you sustain normally.
- **Primordial Reservoir** (10th, epic capstone) -- Passive. You gain an epic resource called **Reservoir**. Each time you finish a respite, you gain Reservoir equal to the XP you gain (as the Operator's Overclock). You can spend Reservoir on your abilities as if it were Essence. You can also spend any amount of Reservoir as a Free Maneuver, ending one save-ends effect on yourself per Reservoir spent. You can spend 3 Reservoir to sustain any persistent working for one turn at **zero Essence cost**. Reservoir remains until you spend it (no reset). The Elementalist's endgame arcane battery.

## Kits (Your Loadout)

The Elementalist is a **light-Kit or no-Kit** class.

The natural attachment points are the **magic/tech-flavored Kits** -- **Hexshot**, **Spellblade**, **Sanctified** -- whose "magic" damage rider is **reskinned as elemental essence** (a channeled focus-weapon, an elemental-charged blade, a warded holy symbol repurposed as an arcane relic). A **battle-mage build** takes a light Kit (Hexshot for ranged casters, Spellblade for melee-adjacent) to stay armed at melee; a **pure artillery build** takes no Kit and lives at range, letting the Signature focus do the mechanical work of a weapon slot.

**Ownership rule still holds** (per the Kits chapter): a Kit is inert without its qualifying nuyen-bought focus/weapon. A Sanctified Kit without a consecrated censer or a bonded staff is dormant technique.

**Foci over chrome (Veil gear, Economy side):** the Elementalist's real gear footprint is **foci** -- bound or crafted implements that focus elemental channeling. Category 6A of the gear catalog is your list: summon-foci, elemental wands, warded staves, ash-bones, focus-orbs. All bought with **nuyen** and improved through the Economy's **modification** subsystem, *not* chrome. This is the caster's equivalent of the Operator's weapons.

## Chrome an Elementalist Runs

**Warning to the player:** **A Cyborg species character can NEVER be an Elementalist -- Arcane Severance bars all magic access absolutely.** This is a species restriction, not a class restriction, and is enforced at character creation (Step 2 of the character-creation checklist). If you built a Cyborg thinking to play a hexer, rebuild your species or your class before the first session.

For **all non-Cyborg** Elementalists, chrome is **strongly discouraged but not forbidden**. Cyberware collapses a mage's channeling: chrome reduces your **Essence cap** by the shared magic-erosion formula — −1 per **2** Integrity spent on Standard chrome (round down), per **3** on Soft, per **1** on Salvage (`09-chrome-body-integrity.md`). Soft is the only grade a serious Elementalist should install.

Chrome never generates Essence and never converts into class power.

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero — see `09-chrome-body-integrity.md` for install rules and grades.

---
