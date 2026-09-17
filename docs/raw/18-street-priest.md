# The Street Priest

**RAW status:** draft  
**Sources:** `docs/rulebook/07-street-priest.md`

Veil workings referenced here are summarized in `22-the-veil.md`.

---

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Persona — primary; Instinct — secondary |
| **Heroic Resource** | Conviction |
| **Epic Resource / Capstone** | Manifest Will (10th level) |
| **Potency: Weak / Average / Strong** | Prime − 2 / Prime − 1 / Prime |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light-Kit — the **Sanctified Kit** (magic-damage rider reskins as holy or corruption power, per pact) |
| **Skills** | A religion/liturgy skill, a spirit/ritual skill, and an interpersonal skill are the class's three key skills — spend **at least half your starting Skill Points** on them, per the Class-framework rule. A fourth free pick follows your subclass: a medicine/first-aid skill (Shepherd), a weapon/combat skill (Templar), or an arcana/occult-lore skill (Exorcist). |

---

## Conviction — Your Heroic Resource

**Conviction** is the measure of your faith made manifest — your standing with your patron, spent to call aid across the Veil. It runs a **steady per-turn drip**, like the Wrench's fielded-fleet income or the Elementalist's attunement trickle, with an optional **prayer gamble** layered on top for the faithful who reach for more.

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

The prayer gamble is **resource-only** — its worst result simply yields the ordinary flat drip and nothing more. It never inflicts backlash, Stamina damage, or corruption.

**Cap & loss.** Conviction is capped at **8 at 1st level, rising +4 per tier** (mirrors the Veil-caster spine exactly: E4=8, E3=12, E2=16, E1=20, continuing the same +4 step at the top of the DS-level range). **All unspent Conviction is lost at the end of the encounter** — the patron's active favor fades when the crisis passes.

**Outside combat.** You cannot *gain* Conviction outside combat, but you may spend Conviction-costed effects **as if you had Victories worth of Conviction** — this is how ministry, healing, warding, and pact-renewal happen during downtime scenes without breaking the encounter-scoped resource model.

**Firewall note:** Conviction is a class resource on the BP/class side. It never touches **nuyen (¥)** or **Body Integrity**, and chrome never generates it — see Kits & Chrome Interaction, below.

> **What is Conviction?** Conviction is the Street Priest's Heroic Resource: a pool representing your patron's active favor and how much of it you can spend calling aid across the Veil right now. It rises on a steady drip every turn (or via the prayer gamble's spike), and on acting squarely within your pact's creed. It falls when you sustain persistent workings, and resets to zero at the end of every encounter. It is spent on heroic abilities (grouped by cost, below) and on Spend-X enhancement riders. Signature abilities never cost Conviction.

---

## Pact Alignment (Light or Dark)

At 1st level, every Street Priest chooses a **pact alignment: Light or Dark.** This choice cannot be changed later — it is a permanent build decision with a moral spine, not a stance you can swap turn to turn. **The Pact Alignment is a mechanical overlay layered on top of your subclass choice — it is not a fourth subclass.** A Shepherd, a Templar, and an Exorcist can each be Light or Dark; the overlay changes flavor and a handful of numbers, not your battlefield role.

Both pacts use **the same mechanical numbers** across every ability in this chapter. What differs:

| Property | Light Pact | Dark Pact |
|---|---|---|
| **Default damage type** | Holy | Corruption |
| **Corruption weight** | Light | Heavy |
| **Conduct requirement** | Strict — the patron demands mercy and protection tasks (The Price) | Looser in the moment, but the debt comes due — the patron demands darker service or offerings |
| **Creed echo trigger** (first qualifying act each round) | First act of **mercy, protection, or aid** | First act of **dominion, punishment, or harvest** |
| **Invoke the Pact — failed bind** | Entity vanishes without effect; you take a **bane on your next power rolls (save ends)** | Entity **strikes you once, at the entity's tier's damage,** before departing |

**Both pacts always exact the Price.** A pact is the game's clearest case of "nothing for nothing": your patron requires a **minor quest, service, or observance aligned to its moral code**, handled before or after the aid is granted — mercy and protection for a Light patron, a darker service or offering for an infernal one. Refusing or shirking the task is a real story beat, Director-adjudicated: the patron withdraws aid, calls the debt, or turns hostile. A priest who tries to **coerce** aid rather than earn it pays the dark-path corruption cost regardless of alignment.

**Choosing Light** means you play a strict conduct code in exchange for the lighter corruption load — every Smite, every ward, every summon defaults to holy damage and holy flavor, and your patron is watching how you treat the vulnerable. **Choosing Dark** means your patron grants more, faster, cheaper in the moment — but every working loads corruption and debt that come due later, and the patron's tasks trend toward harder service. The choice *is* the build.

---

## Signature Abilities (No Conviction Cost)

Every Street Priest chooses **two** of the following at 1st level — these are your baseline, always-available toolkit, enhanceable by spending Conviction but never costing any to use at their base effect. All roll **2d10 + Persona** unless noted. Damage type below defaults per your pact (holy for Light, corruption for Dark) unless the signature is explicitly flavor-locked.

| Signature | Type | Target | Base Effect | Pact Flavor |
|---|---|---|---|---|
| **Blessed Light** | Ranged strike (dist 10) | 1 creature | Holy damage, and on high (17+) you or an ally within range gains a **surge** | Light-flavored (always holy) |
| **Drain** | Melee strike (dist 1) | 1 creature | Corruption damage, and you or an ally **spends a Recovery** on middle or high | Dark-flavored (always corruption) |
| **Rebuke** | Ranged strike (dist 10) | 1 creature | Holy or corruption damage + a **vertical pull** rider | Follows pact |
| **Lightfall** | Area burst 2 (dist 10) | Enemies in burst | Holy damage to enemies, and up to 2 allies in the burst may **teleport** to any open space within the burst | Light-flavored (always holy) |
| **Sacrificial Offer** | Ranged strike (dist 10) | 1 creature | Corruption damage + a **bane on the next attack made against an ally of your choice** | Dark-flavored (always corruption) |
| **Word of Rebuke** | Melee strike (dist 1) | 1 creature | Holy or corruption damage + a forced **slide** | Follows pact |
| **Warrior's Prayer** | Ranged strike (dist 10) | 1 creature | Holy damage + you or an ally gains **temporary Stamina** | Light-leaning (holy by default, may reskin Dark on request) |
| **Wither** | Ranged strike (dist 10) | 1 creature | Corruption damage, and on a potency-successful hit the target takes a **bane** on its next roll | Dark-flavored (always corruption) |

Beyond the 2 chosen signatures above, **every Street Priest also has these two class-wide signatures for free, with no choice involved** — every priest, regardless of subclass or pact, has these from 1st level:

> **Lay On Hands / Word of Comfort** *(Class Feature Signature)*
> *Maneuver · Range 10 · Target: self or one ally*
> No Power Roll. The target may **spend a Recovery.**
> **Spend X Conviction:** target an additional ally, end one save-ends/end-of-turn effect on the target, let a prone target stand, or grant a small amount of temporary Stamina.
> *The class's basic support signature — the divine equivalent of the Elementalist's every-turn shaping, pointed squarely at keeping the crew alive. This is the switch-hitter's every-turn lifeline, and it scales with faith the moment you spend Conviction on top of it.*

> **Smite / Rebuke** *(Class Feature Signature — not to be confused with the chosen signature "Rebuke," above; Director's table should rename one at the table if both are taken to avoid confusion)*
> *Main Action · Range 10 · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage (by pact), scaling on Power Roll result (**low** ≤11 / **middle** 12–16 / **high** 17+).
> **Spend X Conviction:** increase damage and/or add a small rider (push, or a bane on the target's next roll).
> *The class's basic offensive signature — a bolt of the patron's power, proof the switch-hitter can trade blows even before spending a point of Conviction.*

> **Sense the Veil / Discern Spirits** *(Class Feature Signature)*
> *Maneuver · Self*
> No Power Roll (or a simple Instinct check at the Director's discretion for a contested read). Read an entity's rank/nature, sense the thinness of the Veil, detect corruption or possession, or identify a spirit's true name.
> *The Street Priest's version leans toward reading spirits, souls, and corruption specifically — free intel that sets up wards, banishments, and (for the Exorcist) Judgment.*

---

## Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are the Street Priest's Conviction-fueled workings — chosen by cost band as you level, layered on top of the always-on Signature kit above. Power Roll results use Draw Steel print order: **low** (≤11) / **middle** (12–16) / **high** (17+).

### 1-Cost Band (chosen at 1st level)

> **Minor Rebuke** *(1 Conviction)*
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona.
>
> | Tier | Effect |
> |---|---|
> | low (≤11) | No damage. |
> | middle (12–16) | 2 + Persona holy or corruption damage (by pact). |
> | high (17+) | 4 + Persona holy or corruption damage (by pact). |
>
> *A small strike with no rider — the cheapest possible spend when every other Conviction point is earmarked for a heal or a ward, but you still want to put a dent in something. The class's floor-level offensive option.*

> **Whisper of Comfort** *(1 Conviction)*
> *Maneuver · Range 10 · Target: self or one ally*
> No Power Roll. Choose one: the target gains **temporary Stamina equal to 2 + Persona**, OR ends one **minor** ongoing effect on the target (Director's call on what counts as "minor" — a single stack of a stacking condition, a short-duration debuff, not a save-ends major condition).
> *The class's floor-level support option — a whispered word or a quick touch, cheap enough to use every single turn if the encounter calls for it.*

### 3-Cost Band (chosen at 1st level)

> **Call the Thunder Down**
> *Main Action · Ranged area, cube 3 (dist 10) · Target: enemies in the cube*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage (sonic-flavored per pact) to each enemy in the cube, and each is **pushed**; allies you choose within the cube are pushed the same distance in a direction of your choice (a controlled shockwave, not a punishment).

> **Sentinel Spirit**
> *Main Action · Summon, dist 10 · Target: 1 open space*
> Summon a **size-2 guardian spirit** for 1 turn — a flare of your patron's presence given brief shape. While it exists, enemies within 2 squares of it take **Instinct**-scaled holy or corruption damage at the start of their turn (by pact).

> **Judgment's Hammer**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Holy or corruption damage + the target is knocked **prone** on middle or high. *Templar-flavored — the smiter's opening blow, though any subclass may take it.*

> **Violence Will Not Aid Thee**
> *Main Action · Ranged strike (dist 10) · Target: 1 creature*
> **Power Roll:** 2d10 + Persona. Lightning-flavored (or holy/corruption, Director's call per pact) damage, and the next time the target deals damage this encounter, it takes **retributive damage equal to the original hit's tier value** — the patron turns the enemy's own violence back on them.

### 5-Cost Band (chosen at 1st level)

> **My Life For Yours**
> *Triggered Action · Range 10 · Target: self or one ally*
> **Trigger:** the target starts their turn, or takes damage.
> **Effect:** you **spend a Recovery**, and the target regains Stamina equal to **your Recovery value.**
> **Spend more Conviction:** also end a save-ends effect on the target, or let the target stand.

> **Sanctuary Ward**
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

### 7-Cost Band (chosen at 3rd level) — includes Invoke the Pact

*This band is headlined by **Invoke the Pact**, the class's defining high-Conviction working. Full mechanics are broken out in their own section immediately below this tier list — see "Invoke the Pact — Deep Dive."*

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

### 9-Cost Band (chosen at 5th level)

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

### 11-Cost Band (chosen at 8th level)

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

## Invoke the Pact — Deep Dive

*The class's defining high-Conviction play, and the headline entry of the 7-cost band, unlocked at 3rd level.*

> **Invoke the Pact**
> *Main Action · Veil working (Pact + Summon/Bind) · Cost: 7 Conviction (Persistent 2 if the independent form results)*
> **Bind Check:** 2d10 + **Instinct** — *not* Persona. This is the one core Street-Priest roll that keys off your secondary attribute rather than your primary; control-and-bind always runs on Instinct for this class.

**What happens on the Bind Check** — the Power Roll result of your Instinct roll determines which of two forms your invoked aid takes:

| Bind Roll Outcome | Result |
|---|---|
| **low (≤11)** | **Failed bind.** See "Failed-Bind Consequence," below — the consequence is asymmetric by pact. |
| **middle (12–16)** | **Extension form succeeds.** The summoned entity acts on **your turn**, functioning as an extension of your own action economy — a smiting hand of light, a warding aegis, a spectral guardian. Low bookkeeping: it has no independent Stamina track and no turn of its own. Its light-band attack or support effect scales with your banked Conviction (a richer bank produces a stronger extension, Director's table reference: light-band = 4+Persona on the low result-band equivalent, rising across middle/high per Veil §C3). |
| **high (17+)** | **Independent form succeeds.** The summoned entity becomes its own figure on the map — it has its own Stamina/Integrity pool and its own activation on the shared initiative order, scaling as a **high-grade entity per Veil §C3**. This is the true divine-summoner fantasy: an angelic warrior or bound devil fighting beside you as a genuine second combatant for the rest of the encounter (or until it drops, or the bind breaks). |

**Failed-Bind Consequence (asymmetric per pact):**

- **Light pact:** the summoned entity **vanishes without effect** — your patron simply declines to answer, or the summons slips back across the Veil before it can manifest. You take a **bane on your next power rolls (save ends)** — the disquiet of a prayer that went unanswered.
- **Dark pact:** the summoned entity **manifests just long enough to strike you once, at the entity's tier's damage,** before departing back across the Veil. Your patron's aid always costs something, even — especially — when it goes wrong.

**Sustaining the independent form** costs **Persistent 2** (−4 Conviction/turn while sustained). The extension form has no ongoing sustain cost beyond the initial 7-Conviction spend; it simply expires at the end of the encounter or when you choose to release it.

**Summon flavor by subclass:**

- **Templar:** the entity manifests as an **angelic or infernal warrior** — a combat aid, built to trade blows.
- **Shepherd:** the entity manifests as a **guardian or warding spirit** — a defensive/support aid that shields allies and anchors wards.
- **Exorcist:** the entity manifests as a **hunting or binding spirit** — an anti-spirit specialist built to track and hold spirit-type foes.

**The Price always applies here, hardest of anywhere in the class.** A willingly-bound Light entity exacts a task aligned to mercy or protection before or after the working; a Dark entity's cooperation loads corruption and spirit-attention on top of whatever the Bind Check already cost. Breaking the pact's terms after invoking is a serious, Director-adjudicated story beat — the patron withdraws, calls the debt, or turns the entity hostile.

---

## Judgment (Templar-Exclusive Mark Mechanic)

**Only Templars have Judgment.** The mark-an-enemy mechanic is subclass-only, not a class-wide tool. A Shepherd or Exorcist cannot take Judgment through any means short of a future multiclass/feat exception.

**Judgment** works as follows: as your 1st-level Templar subclass feature (see Templar, below), you may mark one enemy within range as **under Judgment**. While the mark holds:

- The marked target takes a **bane** when it acts within your line of effect, or takes a small amount of bonus holy/corruption damage when you or an ally damages it (Director's table reference).
- The **first time each round** you damage the marked target, or the marked target damages you, you **bank bonus Conviction**.
- Only one target may be under Judgment at a time; marking a new target ends the mark on the previous one.

Judgment scales at Templar 4th level (**Righteous Momentum** — the mark banks +1 more Conviction on damage) and again at Templar 7th level (**Blade of the Chosen** — see the Templar subclass table, below, for the full ladder).

---

## Street Priest Subclasses

At 1st level, every Street Priest chooses one of three **ministries**, defined by battlefield role — Shepherd, Templar, or Exorcist. Your ministry tilts the switch-hitter's lean, tints your signatures and heroic abilities, and grants a subclass identity feature plus a signature pact-summon flavor. All three subclasses share the Persona/Instinct chassis and the Conviction engine; each grants a distinct feature ladder across levels 1, 2, 4, 5, 7, and 8, plus subclass ability picks at levels 1, 2, 6, and 9.

---

### Shepherd — *"Pastoral-Care Specialist"*

The crew's lifeline. Bonus to **healing and warding** — stronger Recovery-granting, more temporary Stamina, better status removal and surges. The most support-tilted ministry, and the party's missing medic when nobody else can fill that slot. Summon flavor: a **guardian/warding spirit** that sticks close to allies.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Warden's Grace** | Whenever you use Lay On Hands / Word of Comfort, the target's Recovery restores **bonus Stamina** on top of the normal value (Director's table reference). |
| **1** | Subclass ability (choose 1) | See Shepherd Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Shepherd ability. |
| **4** | **Ward Anchor** | Sanctuary Ward, and every persistent ally-buffing zone you sustain, costs **1 less Conviction/turn to sustain** (minimum 1). |
| **5** | Subclass power bump | Your healing and warding heroic abilities (My Life For Yours, Sanctuary Ward, Faith Is Our Armor, Sermon of Grace) increase in magnitude by one band (Director's table). |
| **6** | Subclass ability slot | Choose a 6th-tier Shepherd ability. |
| **7** | **Guardian's Voice** | Sermon of Grace (or any Sermon-of-Grace-style buff) either costs **1 less Conviction** or gains **+2 range/area**, your choice each time you cast it. |
| **8** | Subclass power bump | Warden's Grace's bonus Stamina increases again; Ward Anchor's discount extends to Invoke the Pact's Persistent-2 sustain cost as well. |
| **9** | Subclass ability slot | Choose a 9th-tier Shepherd ability (apex). |

**Shepherd Ability Table**
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

### Templar — *"Militant-Order Asset"*

The holy warrior. Bonus to **smiting damage and frontline durability** — higher effective Stamina than the other two ministries, better melee and forced-movement play, and **the only ministry with the Judgment mark** (see Judgment, above). The party's second front-liner. Summon flavor: an **angelic/infernal warrior**, a true combatant.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Judgment** | Mark one enemy as under Judgment (see the Judgment section, above, for the full mechanic). |
| **1** | Subclass ability (choose 1) | See Templar Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Templar ability. |
| **4** | **Righteous Momentum** | Judgment's damage-triggered Conviction bank increases by **+1** (stacking with the base Judgment bonus). |
| **5** | Subclass power bump | Your smiting heroic abilities (Judgment's Hammer, Curse of Terror, Corruption's Curse, Vessel of Retribution) increase in magnitude by one band (Director's table). |
| **6** | Subclass ability slot | Choose a 6th-tier Templar ability. |
| **7** | **Blade of the Chosen** | The Consecrated/Damned Weapon class feature (normally granted at 9th level, see Core Class Features) triggers **two levels early**, at 7th instead of 9th. |
| **8** | Subclass power bump | Judgment can be applied to a second target simultaneously (splitting its Conviction-bank benefit between the two marks). |
| **9** | Subclass ability slot | Choose a 9th-tier Templar ability (apex). |

**Templar Ability Table**
| Tier | Ability | Effect |
|---|---|---|
| 1 | **Zealous Strike** | Smite/Rebuke deals +1 damage per Power Roll result band when the target is under Judgment. |
| 1 | **Iron Faith** | +1 to Stamina per level while you have at least 1 Conviction banked. |
| 2 | **Wrathful Momentum** | Judgment's Hammer knocks the target prone on any Power Roll result (not just middle or high). |
| 2 | **Anathema's Weight** | The marked-by-Judgment target takes a bane on saves against your ongoing effects. |
| 6 | **Vengeance Unbound** | When the Judgment-marked target damages you, your next Smite/Rebuke against it gains an edge. |
| 6 | **Consecrated Ground** | Sanctuary Ward, when cast by a Templar, also grants allies inside a +1 bonus to melee damage. |
| 9 | **Wrath of the Chosen** | Once per encounter, when you drop the Judgment-marked target to 0 Stamina, immediately gain full Conviction (as if from a fresh encounter start) and mark a new target as under Judgment for free. |

---

### Exorcist — *"Containment / Counter-Thaumic Specialist"*

The Veil specialist. Bonus to **banishment, warding against incursion, and sensing/dispelling corruption and possession**, with edges fighting **spirits, the corrupted, and dark entities** specifically. The counter-caster and the crew's answer to hostile incursions across the Veil. Summon flavor: a **hunting/binding spirit** that tracks and holds spirit-type foes.

| Level | Feature | Effect |
|---|---|---|
| **1** | **Discerning Eye** | Sense the Veil / Discern Spirits is enhanced: on high (17+), you also learn a hostile spirit's **true name** (setting up an edge on a later Banish), and your reads always distinguish willingly-bound from coerced/hostile entities. |
| **1** | Subclass ability (choose 1) | See Exorcist Ability Table, below (1st-tier options). |
| **2** | Subclass ability slot | Choose a 2nd-tier Exorcist ability. |
| **4** | **Bound to Silence** | Your Banish verb (and any heroic ability that banishes or dispels) may add a **save-ends** rider to a hostile spirit-type or corrupted target — silenced, restrained, or unable to manifest, Director's choice matching fiction. |
| **5** | Subclass power bump | Your anti-spirit heroic abilities gain an **edge** when targeting spirit-type, undead, or corrupted creatures specifically (Director's table). |
| **6** | Subclass ability slot | Choose a 6th-tier Exorcist ability. |
| **7** | **Chain of Names** | Invoke the Pact's Bind Check costs **2 less Conviction (minimum 5)** when the target of the working is a hostile spirit you are attempting to bind/banish rather than summon as an ally. |
| **8** | Subclass power bump | Bound to Silence's save-ends rider can now also suppress a hostile working (a curse, a possession, an active summon) for its duration, not just silence the entity itself. |
| **9** | Subclass ability slot | Choose a 9th-tier Exorcist ability (apex). |

**Exorcist Ability Table**
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

## Level 1-10 Progression Table

| Level | Class Features | Abilities Known | Subclass |
|---|---|---|---|
| **1** | Pact Alignment (Light/Dark) · Subclass choice · Conviction (heroic resource) · Lay On Hands / Word of Comfort · Smite / Rebuke · Sense the Veil / Discern Spirits · Prayer Gamble · Priest's Ward · Choose 2 Signatures | 2 signatures, 1-cost band, 3-cost band, 5-cost band | L1 subclass feature + L1 subclass ability |
| **2** | The Roster of the Saved / The Ledger of the Damned (rename by pact) · Perk | (same) | L2 subclass feature + subclass ability slot |
| **3** | Minor Miracle · Choose a 7-Cost ability (Invoke the Pact unlocked) | +7-cost band | (same) |
| **4** | Deepened Subclass · Characteristic Increase · Perk · Skill | (same) | L4 subclass feature |
| **5** | Choose a 9-Cost ability | +9-cost band | L5 subclass power bump |
| **6** | Burgeoning Saint / Rising Adept (rename by pact) · Perk | (same) | L6 subclass feature + subclass ability slot |
| **7** | Characteristic Increase · Pact's Favor · Skill | (same) | L7 subclass feature |
| **8** | Perk · Choose an 11-Cost ability | +11-cost band | L8 subclass power bump |
| **9** | Consecrated Weapon / Damned Weapon · Ordained / Sworn | (same) | L9 subclass feature + subclass ability slot |
| **10** | Avatar of the Pact (epic capstone) · Characteristic Increase · Manifest Will · Most Faithful · Perk · Skill | (same) | (same) |

---

## Core Class Features (Non-Subclass)

- **Pact Alignment** (1st) — Choose Light or Dark at character creation. Permanent; cannot be changed later. See Pact Alignment, above, for the full mechanical split.
- **Conviction** (1st) — Your Heroic Resource. See Conviction, above, for the full earn/spend/cap rules.
- **Lay On Hands / Word of Comfort** (1st) — Free class-feature signature. Maneuver; self or one ally spends a Recovery; Spend-X Conviction riders extend the effect. See Signature Abilities, above.
- **Smite / Rebuke** (1st) — Free class-feature signature. Main action Persona Power Roll; holy or corruption damage by pact. See Signature Abilities, above.
- **Sense the Veil / Discern Spirits** (1st) — Free class-feature signature. Maneuver; reads spirit rank/nature and detects corruption. See Signature Abilities, above.
- **Prayer Gamble** (1st) — The d6 mechanic layered on top of the Conviction drip. See Conviction, above.
- **Priest's Ward** (1st) — Passive. A small, always-on persistent temporary-Stamina hedge on yourself: at the start of each of your turns, if you have no other persistent working active, you gain a trivial amount of temporary Stamina (Director's table — a "you always have a little cushion" feature, not a big number). This is your baseline safety net, distinct from Sanctuary Ward, which is a spendable heroic ability.
- **The Roster of the Saved / The Ledger of the Damned** (2nd, renamed by pact — Light priests use "Roster," Dark priests use "Ledger") — Passive situational-awareness power. Once per encounter, as a free action, you may ask the Director one factual question about a creature's alignment relative to your pact's morality (is this person innocent? complicit? marked by the patron already?) — a narrative intel tool that also sets up Judgment (Templar) and Discerning Eye (Exorcist) picks.
- **Minor Miracle** (3rd) — Once per encounter, spend a Recovery to bend a single outcome: reroll one Power Roll (yours or an ally's within range), or downgrade one Power Roll result by one step (low becomes middle, middle becomes high) on a roll that just happened.
- **Deepened Subclass** (4th) — Passive mechanical bump to your subclass's existing features — the exact numeric increase is defined per-subclass in each ministry's own table, above (Ward Anchor, Righteous Momentum, Bound to Silence all key off this level).
- **Burgeoning Saint / Rising Adept** (6th, renamed by pact) — Passive. Your Conviction cap increases by an additional +2 on top of the normal tier progression, and the Prayer Gamble's "5-6" result additionally grants you 1 surge.
- **Pact's Favor** (7th) — Once per session (not per encounter), your patron intervenes directly for a small favor outside of combat — a piece of information, a door that's unlocked when you arrive, a witness who suddenly remembers something useful. Director-adjudicated, narrative in scope, never a combat-turn effect.
- **Consecrated Weapon / Damned Weapon** (9th, renamed by pact) — Passive. Your weapon attacks (via Kit or otherwise) carry a permanent bonus-damage rider of holy (Light) or corruption (Dark) damage, equal to your Persona bonus. *Templars gain this two levels early (7th) via Blade of the Chosen — see the Templar subclass table.*
- **Ordained / Sworn** (9th, renamed by pact) — A permanent title with narrative weight (Ordained for Light, Sworn for Dark) and one mechanical perk of your choice from the standard Perk list, gained specifically for reaching this milestone in your patron's eyes.
- **Avatar of the Pact** (10th, epic capstone) — Once per encounter, briefly manifest your patron's presence directly through you: for one round, all your holy/corruption damage rolls gain an edge, and your Persona-based Power Rolls cannot roll below a middle (12–16) result regardless of the actual roll.
- **Manifest Will** (10th) — Spend 5 Conviction to automatically succeed on one Power Roll (treat as a guaranteed high (17+)), once per encounter.
- **Most Faithful** (10th) — Capstone perk. Your Conviction cap increases by a final +4 on top of all prior increases, and the Prayer Gamble's "1-2" floor result is removed entirely — rerolling any 1 or 2 once, automatically, at no cost.

---

## Kits & Chrome Interaction

**Sanctified Kit.** The Street Priest is a **light-Kit class**, and its natural attachment is the **Sanctified Kit** — the Kits chapter's magic-flavored light-Kit option. Its "magic" damage rider is reskinned wholesale as **your patron's holy or corruption power** (a blessed weapon, a consecrated focus, a censer swung like a mace). A Templar build often takes the Sanctified Kit (or a martial Kit) to hold the line at melee; a Shepherd or Exorcist may take a light Kit or none at all and work entirely through invocation at range. **Ownership rule still holds:** a Kit is inert without its qualifying nuyen-bought weapon/focus (a blessed blade, a censer, a reliquary-focus).

**Foci over chrome.** Like the Elementalist, the Street Priest's gear footprint is **foci** — reliquaries, blessed symbols, consecrated censers, warding seals — bought with **nuyen (¥)** and improved through the Economy's modification subsystem, *not* chrome. The **6B — Street-Priest foci** table (Conviction/Persona):

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| **Prayer-bead / Rosarium / devotional focus string** | Avail. street | 5 | ¥200 | An edge on the prayer gamble (the pre-roll faith die); the acolyte's first focus, worn openly. | 1 · Veil, Faith |
| **Creed-brand / Fidei Sigil / conviction-anchor seal** | Avail. street | 5 | ¥300 | Steadies the Conviction drip against a bad prayer result (softens backlash on the gamble's worst outcome). | 1 · Veil, Faith |
| **Censer / Thuribulum / sanctified aerosol focus** | Avail. professional | 4 | ¥750 | An edge on warding/blessing workings and helps sustain a warded zone (the Shepherd's ground). | 2 · Veil, Ward |
| **Judgment-mark / Iudex Brand / anathema focus-iron** | Avail. professional | 4 | ¥1,000 | An edge on the Templar's Judgment mark and its Conviction feedback; **Templar-flavored.** | 2 · Veil, Judgment |
| **Reliquary / Sanctum Vessel / consecrated relic-housing** | Avail. specialist | 3 | ¥3,000 | An edge on healing/support invocations (the Shepherd) *or* anti-spirit rites (the Exorcist); houses a splinter of the pact's power. | 3 · Veil, Faith |
| **Pact-seal / Foedus Sigil / covenant-manifestation seal** | Avail. milspec | 2 | ¥10,000 | An edge on Invoke the Pact and helps sustain the manifested aid at lower ongoing Conviction. | 4 · Veil, Summon |
| **Exorcist's chain / Malleus Vinculum / abjuration binding-focus** | Avail. milspec | 2 | ¥11,000 | An edge on banishing and anti-corruption rites; the **Exorcist's signature tool** against hostile spirits. | 4 · Veil, Ward |
| **Saint's relic / Numen Cor / apex covenant reliquary** | Avail. prototype | 1 | ¥22,000 | The Street Priest's masterwork: a broad edge across invocation, warding, and the pact, and the readiest signature-focus bond candidate (BP/SP deepens it). The Price still applies. | 5 · Veil, Signature-capable |

**Chrome erosion rule.** *"For every point of chrome-load essence above a sliver, permanently lose 1 max Conviction. Cyborgs cannot invoke pacts."* A high-tier Street Priest may tolerate, at most, **a sliver of soft/bioware** — a single low-grade implant — without penalty. Beyond that sliver, every additional point of chrome-load essence installed **permanently reduces your maximum Conviction cap by 1**, stacking with every subsequent point. This is not a temporary penalty and does not heal — it represents the pact itself growing thinner as your body fills with machine parts. There is no upper bound stated on this erosion; a Street Priest who chromes up heavily can, in principle, erode their Conviction cap to nothing, at which point the class stops functioning as a caster entirely (Director's call on whether the pact is considered broken at that point).

**Cyborgs cannot invoke pacts — restated.** A Cyborg cannot take the Street Priest class at all, under any circumstances, per Arcane Severance. This is not the same rule as the chrome-erosion sliding scale above (which applies to non-Cyborg species who install cyberware) — it is an absolute bar at character creation.

---
