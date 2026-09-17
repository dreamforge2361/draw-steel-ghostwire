# The Wrench

**RAW status:** draft  
**Sources:** `docs/rulebook/05-wrench.md`

Machine stat cards (drone, vehicle, building) appear in this chapter as Wrench rules; the shared drone and vehicle inventories are in `23-machines.md`.

---

## Origin Doctrine — Street Class, No Corp Academy

The Wrench has no corporate academy of origin. All three Wrench subclasses are **street-taught** — self-taught, forum-taught, salvage-yard-trained, squat-fortified. A Wrench's corp history is entirely **player-choice backstory** and grants no mechanical academy bonus, no required corp Kit, and no corp-gated ability.

## Attribute Doctrine

The Wrench's primary characteristic is **Logic** — the attribute that drives Rigging, Gunnery-through-a-sensor-feed, and the cold read of a targeting solution. Its natural secondary is **Reflex** — hands-on piloting, direct fire, and the reflexive save when the meat body has to move on its own.

| GHOSTWIRE Display | DS Attribute | Abbrev | Governs (representative) |
|---|---|---|---|
| **Physique** | *(legacy: Might)* | PHY | Melee power, carrying capacity, physical resistance |
| **Reflex** | *(legacy: Agility)* | REF | Piloting, direct fire, initiative, evasion |
| **Logic** | *(legacy: Reason)* | LOG | Rigging, Gunnery-via-sensor, hacking-adjacent tech tests, tactical calculation |
| **Instinct** | (Intuition) | INS | Perception, read-the-room, danger sense |
| **Persona** | (Presence) | PER | Social tests, force of personality, command presence |

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic, Reflex |
| **Heroic Resource** | Uptime |
| **Epic Resource / Capstone** | Overclock (10th level, epic capstone) — see Core Class Features |
| **Starting Stamina** | 18 |
| **Stamina per Level** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light-to-moderate Kit (Fabricator's Bench / Rigger's Harness / Field Chassis) — a hands-on Wrench carries weight through the fleet, not the body |
| **Skills** | You gain **Rigging** and **Gunnery** free, then choose any **two** additional skills from the Mechanics/Engineering, Electronics, or Criminal Underworld groups. (Quick Build: Rigging, Gunnery, Mechanics, Electronics.) |

## Heroic Resource: Uptime

Uptime is machine-runtime — the fuel that keeps your fleet online, responsive, and lethal. It explicitly represents **fielded presence**: the more of your hardware is out, working, and under your command, the more runtime you generate to keep commanding it.

**Earned.**
- **Roll-out:** the first time you Deploy a machine or take a Rigging action each encounter, gain Uptime equal to your **Victories** (the same on-ramp every GHOSTWIRE class gets — you arrive already partway spun up).
- **Fielded fleet (core loop):** at the start of each of your turns, gain **1 Uptime per machine active and under your control**, up to a cap *(cap 10 Uptime at 1st level, rising per the Uptime Cap Progression below)*. Commit early and it snowballs; lose your fleet and the drip dries up.
- **Deploy momentum:** bringing a new machine online for the first time in an encounter banks **+2 Uptime**.
- **Maintenance tick:** a successful Field Repair or a successful save/skill check made to keep a machine functional under pressure (patch a jammed mount, clear a fault, hold a losing Integrity fight) banks **+1 Uptime**.
- **Salvage tick:** destroying an enemy machine, or stripping a wreck (yours or theirs) for parts as a maneuver, banks **+1 Uptime**.

**Drained.** Uptime is drained, not just capped, by four conditions:
- **Damage to the Wrench's own body** — taking damage while Jumped-In or otherwise engaged bleeds Uptime (see Jump-In plumbing, below) — represents the feedback spike breaking your focus on the fleet.
- **Damage to fielded assets** — every time a machine you control takes a hit, you lose **1 Uptime**, on top of whatever the machine's own Integrity track absorbs. Your attention is a finite resource and every hit on your hardware is a hit on your bandwidth.
- **Signal jamming** — any enemy Electronic Warfare effect that jams, spoofs, or otherwise interferes with your control link drains Uptime directly (typically **2–4 Uptime per jam pulse**) rather than (or in addition to) imposing the usual EW penalty.
- **Asset destruction** — a machine dropping to 0 Integrity costs you a lump **3 Uptime** — the shock of losing hardware outright, distinct from the smaller per-hit drain above.

**Spent.** Command actions, Deploy actions, Override actions, and burst-buff abilities all cost Uptime — see the Signature Abilities and Heroic Abilities sections, below, for exact costs. As a rule of thumb, costs sit on the same 1/3/5/7/9/11 cost-band ladder used by every other GHOSTWIRE Heroic Resource.

**End-of-encounter loss doctrine.** You lose any remaining Uptime at the end of the encounter — the engines spin down, the rig goes quiet, the fleet powers to standby. Uptime never carries between encounters and is never banked toward downtime; downtime fabrication (see THE MACHINES, below) is a wholly separate nuyen-and-time system, not an Uptime spend.

> **What is Uptime?**
>
> **Uptime** is the Wrench's Heroic Resource: a pool representing how much bandwidth, focus, and signal integrity you currently have to spend commanding your fielded machines. It rises when your fleet is out, working, and winning; it falls when your fleet — or you — gets hit, jammed, or wrecked. It is spent on Deploy, Command, Override, and burst-buff actions (see Signature Abilities and Heroic Abilities, below). It is entirely separate from **nuyen** (¥), which buys and modifies the machines themselves. **Firewall rule:** nuyen buys the hardware; Uptime runs it. Chrome (Body Integrity spend, e.g. a control rig) can *improve* how efficiently Uptime is spent, but chrome never generates Uptime directly, and nuyen never buys Uptime at any exchange rate.

**Uptime Outside of Combat.** You can't gain Uptime outside of combat, but you can still use Uptime-costing abilities without spending it — the same convention as every other GHOSTWIRE Heroic-Resource class. Whenever you use an Uptime-costing ability outside of combat, you can't use that same ability outside of combat again until you earn 1 or more Victories or finish a respite.

**Firewall note (Nuyen doctrine):** Uptime is a class resource on the BP/class side of the firewall. It never touches **nuyen** or **Body Integrity**, and chrome never generates it directly.

**Uptime Cap Progression.** The soft cap on your Uptime pool rises with level: **base 10 Uptime at 1st level**, rising to **12 at 5th level**, rising to **14 at 10th level**.

## Signature Abilities (No Uptime Cost)

Every Wrench chooses from the following baseline, no-Uptime-cost options at 1st level — your always-on toolkit, all rolled with **Logic** unless the ability explicitly calls for a Reflex-driven direct-pilot roll. *(Quick Build: **Deploy & Command**, **Rigged Fire**.)*

> **Deploy & Command** (Signature)
> *Deploy or Command · Main Action or Maneuver · Range 10*
> Target: 1 carried machine (Deploy) or all machines you control within Range (Command)
> **Power Roll** — none (Deploy is automatic); Command uses **2d10 + Logic** only if contested by enemy EW
>
> | Roll | Effect |
> |---|---|
> | ≤11 | Deploy: the machine comes online but is Sluggish this round (acts last, no maneuver). Command: your machines act, but a chosen machine's action is a free Reposition only. |
> | 12-16 | Deploy: the machine comes online and can act normally this round. Command: all commanded machines act on your turn as directed. |
> | 17+ | Deploy: the machine comes online with a free maneuver banked for later this round. Command: all commanded machines act, and you gain 1 Uptime. |
>
> *As a main action, bring a carried drone, turret, or vehicle online — it appears in an unoccupied space within Range and is now under your control. As a maneuver instead, issue orders to every machine you already control within Range; each acts on your turn per its programmed behavior or your direct call. Uptime cost 0.*

> **Rigged Fire** (Signature)
> *Command · Main Action · Range = the firing machine's weapon range*
> Target: 1 creature or object within a controlled machine's weapon range
> **Power Roll** — **2d10 + Logic** (or **+ Reflex** if you are directly piloting/Jumped-In to the firing machine) **+ Gunnery**
>
> | Roll | Effect |
> |---|---|
> | ≤11 | The shot goes wide — no damage, and the firing machine is exposed (enemies gain +1 to hit it until your next turn). |
> | 12-16 | 3 + Logic damage. |
> | 17+ | 5 + Logic damage, and choose one: target is prone, target is suppressed until end of their next turn, or the firing machine may immediately reposition up to its Speed for free. |
>
> *A machine you control makes a mounted or drone-mounted attack. Uptime cost 0.*

> **Field Repair** (Signature)
> *Command or Maneuver · Main Action (full repair) or Maneuver (quick patch) · Range 5*
> Target: 1 machine or vehicle you control, or 1 ally's chrome/weapon
> **Power Roll** — **2d10 + Logic**
>
> | Roll | Effect |
> |---|---|
> | ≤11 | Restore 2 + Logic Integrity, but the repair holds only until the target is next hit. |
> | 12-16 | Restore 4 + Logic Integrity, and clear one mechanical condition (Crippled, Systems Down, On Fire/Leaking). |
> | 17+ | Restore 6 + Logic Integrity, clear one mechanical condition, and bank 1 Uptime (a maintenance tick). |
>
> *As a main action, make full repairs to a machine's Integrity track and clear a condition. As a maneuver instead, make a quick patch — smaller Integrity restore, no condition clear, but fast. Can also patch an ally's chrome or weapon jam in a pinch (same roll, restores functionality rather than Integrity). Uptime cost 0.*

> **Override Ping** (Signature)
> *Command · Free Triggered · Range 10*
> Target: 1 machine you control
> **Power Roll** — none
>
> Trigger: a machine you control would be jammed, spoofed, or forced into a fault state by an enemy Electronic Warfare effect. Effect: you push a priority override packet through the link — the machine ignores the triggering effect this round. You lose 1 Uptime to do this (already-banked Uptime; this is a spend, not a drain-condition trigger). *If you have 0 Uptime, you can't use this ability.*

## Advantage Table Doctrine (Uptime Pool, Cap, Discount, Momentum)

- **Pool / starting value:** 0 at encounter start, then Roll-out grants Uptime = Victories on your first Deploy/Rigging action.
- **Cap:** see Uptime Cap Progression, above — 10 at 1st level, 12 at 5th level, 14 at 10th level.
- **Discount (spend less on an edge):** whenever you use an Uptime-costing ability that has an **edge** or **double edge** on it (from Rigged Fire's sensor-lock rider, an ally's spotting, or a machine's own targeting bonus), the ability costs **1 fewer Uptime**.
- **First-blood:** the first machine-dealt damage each encounter banks the controlling Wrench **+1 Uptime** on top of normal income.
- **Exploit-the-mark (fleet analog — "Exposed Target"):** whenever a machine you control damages a target that is already Marked, Suppressed, or otherwise debuffed by another crew member's ability, you gain **+1 Uptime**.
- **Reposition:** whenever a machine you control repositions and ends adjacent to (or in firing arc of) a target it then damages this round, gain **+1 Uptime**.

## Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are the Wrench's subclass-flavored spell-equivalent — chosen by cost band as you level, layered on top of the always-on Signature kit above. Every subclass (Drone Jockey, Vehicle Rig-Pilot, Facility Rigger) has its own full ability ladder across all four tiers; see the subclass sections below for the actual ability text. The tier structure itself is shared across all three subclasses:

### Base Band (1-5 Uptime, chosen at 1st level)

Low-cost, always-useful openers — the first abilities a Wrench of any subclass picks up. Drawn from each subclass's own Base Tier list (see Drone Jockey / Vehicle Rig-Pilot / Facility Rigger, below).

### 7-Cost Band (chosen at 3rd level)

Mid-power abilities that come online once a Wrench's fleet doctrine has had a chance to mature. Also the tier that unlocks **Focus Fire** (see below) as a purchasable pick.

### 9-Cost Band (chosen at 5th level)

High-power abilities — the point where a subclass's core fantasy (the swarm, the platform, the building) really opens up.

### 11-Cost Band (chosen at 8th level)

Apex abilities — the capstone-adjacent tier just below the 10th-level epic capstone, each one a full-encounter-defining play.

## Focus Fire — The Wrench's Burst Mechanic

Every Wrench has one burst mechanic that turns the whole fleet loose at once.

> **Focus Fire** (Heroic, 7-Cost Band, unlocked at 3rd level)
> *Command · Main Action · Range = each firing machine's weapon range · Uptime cost 7*
> Target: 1 creature or object, or split among up to 2 targets
> **Power Roll** — each participating machine rolls its own **Rigged Fire** independently against the chosen target(s)
>
> | Roll (per machine) | Effect |
> |---|---|
> | ≤11 | That machine's shot goes wide — no damage. |
> | 12-16 | 3 + Logic damage from that machine. |
> | 17+ | 5 + Logic damage from that machine, plus the chosen rider (prone / suppress / free reposition). |
>
> *Every machine you currently control makes a Rigged Fire attack against one target, or splits fire between two. Cost: a flat 7 Uptime, chosen as a 7-Cost Heroic Ability at 3rd level.*

## THE MACHINES — Sub-System Integration

### Drone Stat Card

Every drone is a **device** with a compact stat block. Drones sit at **Scale: Personal or Light** (see Vehicle Scale bands, below, for the full ladder) — small enough that a Wrench can carry several and deploy them as a swarm.

**Drone Stat Card fields:**

| Field | Description |
|---|---|
| **Name / Chassis type** | e.g. recon quadrotor, kamikaze microdrone, taser-bee, spotter-drone, autogun turret-drone |
| **Scale** | Personal or Light (drones are never Vehicle-scale or above; a Vehicle-scale combat drone is handled on the Vehicle stat card, below) |
| **Integrity** | Its Stamina-equivalent damage track. 0 Integrity = wrecked. |
| **Handling** | Reflex rating; edge/bane or die-step on the controlling Wrench's Rigging rolls for this drone. |
| **Speed** | Movement in squares or Speed bands. |
| **Armor** | Flat damage reduction, if any (most small drones have 0–1). |
| **Control Mode** | Autonomous (acts on programmed behavior on your turn, no roll needed) / Commanded (acts on your turn per your Command signature) / Jumped-In (you pilot it directly — see Jump-In plumbing, below; rare for drones, common for the Vehicle Rig-Pilot's platform). |
| **Weapon / Payload** | What it shoots or carries — light gun, taser charge, breaching charge, sensor package, cargo hook. |
| **Upgrade Slots** | See below. |
| **Uptime Upkeep** | 1 Uptime/turn while active, contributing to your fielded-fleet drip (see Heroic Resource: Uptime, above). |

**Drone Upgrade Slots — doctrine.** Every drone chassis has a fixed number of **Upgrade Slots**, gated by its size/cost band, not by level:

| Chassis tier | Upgrade Slots | Representative examples |
|---|---|---|
| **Micro** | 1 slot | Taser-bee, kamikaze microdrone |
| **Small** | 2 slots | Recon quadrotor, spotter-drone |
| **Standard** | 3 slots | Autogun turret-drone, cargo-hauler drone |

An Upgrade Slot holds one mod (sensor package, weapon swap, armor plate, EW suite, cargo rig, etc.). **Mods are bought and installed with nuyen during downtime or at a workshop** (see Building stat card, below, for workshop upgrade-slot support). A drone cannot exceed its chassis's slot count regardless of nuyen spent; buying more capacity means buying a bigger chassis.

**Fleet Size Doctrine.** How many drones can a Wrench field simultaneously is capped separately from Upgrade Slots and from the Uptime pool cap: **base fleet size is 3 machines at 1st level**, rising to **4 at 4th level**, **5 at 7th level**, and **6 at 10th level**. The Drone Jockey subclass raises this cap further (see below). Exceeding the cap is not possible — a Wrench who wants a seventh drone active must stand one down first.

### Vehicle Stat Card, Upgrade Slots, and Scale Rules

The Vehicle Rig-Pilot's platform — and any vehicle a Wrench of any subclass buys, steals, or modifies — uses the **full vehicle-combat sub-system**.

**Scale bands (cross-scale translation ladder):**

| Scale band | Examples |
|---|---|
| **Personal** | A person, a small anthro-drone, a cyberlimb |
| **Light** | Motorcycle, small rotor/quad-drone, jet-ski, riding animal |
| **Vehicle** | Car, van, light aircraft, patrol boat, combat walker, most combat drones |
| **Heavy** | APC, tank, gunship, fighter craft, submarine, large truck |
| **Capital** | Airship, warship, orbital shuttle, building-scale construct |

**Cross-scale rule (what a Wrench needs to know in a fight):** bigger-vs-smaller attacks get an edge and a damage multiplier scaled to the band gap; smaller-vs-bigger attacks take a bane and divide damage down to chip damage, unless the attacker uses a called shot at a vulnerable system or a scale-appropriate weapon/tag. Same band = normal combat, no translation. Treat one band gap as one edge-step + one damage-multiplier step.

**Vehicle Stat Card fields:**

| Field | Description |
|---|---|
| **Name / Frame type** | e.g. armored hauler, hover-gunship, spider-tank, mech-frame |
| **Scale** | Light / Vehicle / Heavy / Capital (see above) |
| **Integrity** | Damage track. 0 Integrity = wrecked (domain-appropriate catastrophe — crash, downing, flooding, depressurization). |
| **Handling** | Edge/bane or die-step on the pilot's Rigging/Reflex roll to drive or maneuver it. |
| **Speed** | Movement in Speed bands (positional mode) or tier on the abstract chase track (see Chase Modes, below). |
| **Armor** | Flat damage reduction; stacks with Scale defensively. |
| **Crew / Stations** | How many stations, of what type (see Crew Stations, below). |
| **Mounts / Hardpoints** | Weapon and mod slots — see Upgrade Slots, below. |
| **Domain** | Ground / Air / Space / Water. |
| **Upgrade Slots** | See below. |
| **Jump-In Capable** | Yes/No — whether this frame supports a Wrench Jumping directly into its control systems (see Jump-In Plumbing, below). |

**Vehicle Upgrade Slots — doctrine.** Vehicle hardpoints scale with Scale band, not with level:

| Scale band | Upgrade Slots (mounts + mods combined) |
|---|---|
| **Light** | 2 slots |
| **Vehicle** | 4 slots |
| **Heavy** | 6 slots |
| **Capital** | 8+ slots (Director's call, campaign-scale asset) |

A slot can hold a weapon mount, an armor plate, a sensor/EW suite, a cargo/utility mod, or a passenger conversion. As with drones, slots are bought and installed with nuyen (see Nuyen Economy Doctrine, below, for cost-band language shared across all three stat cards).

**Crew Stations.** A vehicle's Crew field lists how many of each station it has:
- **Pilot/Driver** — moves the vehicle (Rigging or Reflex + Handling); only the pilot moves the vehicle. Pilot-actions include evasive driving (defensive edge) and stunts.
- **Gunner** — fires mounted weapons with **Gunnery** on their own turn (vehicle mounts scale-translate as normal). A vehicle may have multiple gunner stations.
- **Systems/Sensors/EW** — runs sensors, electronic warfare, and comms; feeds the pilot or gunner an edge (a lock, a terrain read) or imposes a bane on an enemy (a jam).
- **Passenger** — anyone else aboard; can act normally (shoot a personal weapon out a window, hack, reload) but at a speed bane, using the vehicle's body as cover.
- **Solo/Jumped-In** — a single Wrench Jumped-In into the vehicle is pilot **and** gunner simultaneously through the control rig (see Jump-In Plumbing, below); this is the default mode for a Vehicle Rig-Pilot's signature platform.

**Jump-In Plumbing (pilot-check rules).** Jumping into a vehicle or drone is a **maneuver**: make a **Logic or Reflex test against a moderate difficulty**, modified by the target frame's Handling. On success, you are Jumped-In: your meat body becomes **inert and exposed** (per the Wired doctrine on Jumped-In bodies — biofeedback from machine damage can hit your own Stamina, and an inert body is easy to target if discovered), and you gain the machine's Speed, one weapon-lock edge, and (for Jump-In-capable frames) a **temporary Integrity buffer** *(+4 at 1st–5th level, +5 at 6th level, +6 at 7th level and above)* layered on top of the machine's own Integrity track. While Jumped-In, damage to the vehicle drains your Uptime per the standard "damage to fielded assets" rule (see Heroic Resource: Uptime, above) in addition to depleting Integrity. On a failed Jump-In check, you remain in your own body but may retry as a maneuver next turn; a critical failure (roll ≤ 5) triggers minor biofeedback (1 Stamina damage to you, no Uptime drain). Exiting Jump-In is a free action at the start of your turn or an automatic effect of the vehicle being wrecked.

**Chase Modes (reference).** Vehicle combat runs in one of two modes, Director's call:
- **Positional (default):** vehicles move on the same map/zone as foot combat, at vehicle Speed and Scale, sharing terrain and cover with anyone on foot.
- **Abstract range-state track (optional, cinematic pursuits):** `Broken off ← Extreme → Long → Medium → Close → Ramming/Boarding`, advanced by opposed Rigging/Piloting Power Rolls each round. Weapons work at their effective range-state band; Close/Ramming enables boarding and ramming; Broken off ends the chase.

Both modes use the Wrench's same Rigged Fire and Command actions — nothing about the class chassis changes between modes.

**Vehicle Damage & Conditions (reference).** Vehicle conditions reskin the standard vocabulary: **Crippled** (Handling/Speed penalty), **Systems Down** (a station offline), **On Fire/Leaking** (ongoing damage), **Stalled/Dead-stick** (immobilized). Called shots are how a Wrench or an enemy inflicts a specific condition rather than raw Integrity loss. At 0 Integrity the vehicle is wrecked and occupants take a crash hit (Personal scale) and must escape.

### Building Stat Card, Upgrade Slots, Node Reference, and Downtime Fabrication

The Facility Rigger's signature system — but any Wrench who sets up a safehouse, workshop, or killbox uses this card.

**Building Stat Card fields:**

| Field | Description |
|---|---|
| **Name / Site** | e.g. "the Warrens sub-level squat," "the chop-shop on Fourth Tier" |
| **Base-of-Operations Designation** | Headquarters / Safehouse / Workshop / Killbox — see below |
| **Structural Integrity** | The building's own damage track (separate from any single defender's Stamina); 0 = the structure is breached/collapsing. |
| **Physical Upgrade Slots** | See below — turrets, workshops, drone bays, med-bays, breaching-charge caches |
| **Node** | The building's presence on the Mesh — see Node Reference, below |
| **Wired Upgrade Slots** | Node-side upgrades — see below |
| **Nuyen Tier** | Buy / Lease / Squat / Build — see Nuyen Cost Bands, below |
| **Upkeep** | Recurring ¥ cost per downtime cycle — see below |
| **Lifestyle Hook** | See below |

**Base-of-Operations Designations.**
- **Headquarters** — the crew's primary base; highest slot counts, highest upkeep, usually the most defensible.
- **Safehouse** — a lower-profile fallback site; fewer slots, low upkeep, prioritizes not being found over being a fortress.
- **Workshop** — a Fabricator/crafting-forward site; extra Physical Upgrade Slots dedicated to bench/crafting infrastructure, at the cost of defensive slots.
- **Killbox** — the Facility Rigger's specialty; a site built to fight from, maximizing turret/sentry/breaching-charge Physical Upgrade Slots at the cost of comfort and Lifestyle quality.

**Physical Upgrade Slots — doctrine.** Physical slots hold turrets, workshops, drone bays, med-bays, reinforced doors, breaching-charge caches, and similar hardware. Slot count scales with designation and Nuyen Tier:

| Designation | Physical Upgrade Slots |
|---|---|
| Safehouse | 2 |
| Workshop | 3 (bench-weighted; Director may reflavor 1 slot as "bench capacity" rather than a defensive mod) |
| Headquarters | 4 |
| Killbox | 5 (defense-weighted; Facility Rigger subclass raises this further, see below) |

**Node Reference (Wired engagement).** Every building's Node is itself a slot-bearing asset — the building's Node is not a separate line item but **takes upgrades directly**, the way a drone or vehicle chassis takes Upgrade Slots. The Node is how hackers, Elementalists working Wired-adjacent effects, or any Wired-side actor reaches (or is kept out of) the building through the Mesh. A building's Node has its own **Wired Upgrade Slots**:

| Designation | Wired Upgrade Slots |
|---|---|
| Safehouse | 1 |
| Workshop | 2 |
| Headquarters | 3 |
| Killbox | 2 (defense-weighted toward Physical, per its role) |

Wired Upgrade Slots hold Node-side upgrades — firewall hardening, intrusion countermeasures, a dedicated Hacker's nest, mesh-web tripwires (a Facility Rigger favorite — see below), sensor-fusion feeds for the building's own turrets. A building with an unhardened Node (0 Wired Upgrade Slots filled) is trivially easy for a hostile Hacker to breach; this is the building-scale version of the same Wired-exposure risk a Jumped-In Wrench runs personally.

**Nuyen Cost Bands.** Nuyen (¥) is the currency. A building is acquired and upgraded on one of four cost tracks:

| Acquisition | Cost band | Notes |
|---|---|---|
| **Buy (clean title)** | ¥¥¥¥ (highest) | Rare for a street Wrench; usually a front-company purchase |
| **Buy (black-market/grey title)** | ¥¥¥ | No clean paperwork; risk of a corp reclaim plot hook |
| **Lease** | ¥ per downtime cycle, ongoing | Lowest entry cost, highest long-term spend, evictable |
| **Squat-and-fortify** | ¥ (low upfront, mostly labor/time) | The classic Facility Rigger origin — cheap to start, expensive to defend legally (none) |
| **Salvage-and-rebuild** | ¥¥ (upfront) + downtime time | Buy a wreck of a building cheap, Fabricate it up over multiple downtime cycles |

**Upkeep.** Every base-of-operations designation carries a recurring **Upkeep** cost per downtime cycle, scaling with Physical + Wired Upgrade Slot count filled (more hardware, more power/bandwidth/maintenance draw). *(Base Upkeep = 1¥-band per 2 filled slots, rounded up.)* Failing to pay Upkeep risks a slot going offline (Director's call) until payment resumes.

**Lifestyle Hook.** Building tier will feed into the Lifestyle system when authored. This is the plug point; final Lifestyle numbers pending.

**Downtime Fabrication.** The Facility Rigger's signature use of downtime: spend downtime cycles and ¥ to add Physical or Wired Upgrade Slots to a building, upgrade an existing slot's mod, or pre-place defenses (turrets armed and ready before a session starts, breaching charges wired into doorframes, a mesh-web strung across a corridor). **One Downtime Fabrication project per downtime cycle per Wrench**, costing ¥ per the Nuyen Cost Bands above, taking 1 cycle per slot added (2 cycles for a Wired slot, reflecting the harder Node-hardening work), with the Facility Rigger subclass reducing both cost and time (see below).

---

## Wrench Subclasses

Three subclasses, one per role: **Drone Jockey** (swarm of small deployables), **Vehicle Rig-Pilot** (one big platform), **Facility Rigger** (pre-placed building defense). All three are **street-taught** — no corp academy for any of them (see Origin Doctrine, above). Each grants a starting skill, a contact, 1st-level features, a signature reskin describing how Deploy & Command / Rigged Fire / Field Repair change in their hands, and its own ability ladder across Levels 1-10.

---

### Drone Jockey — *"the Swarm"* — Street-Taught (No Corp Academy)

Grants the **Electronics** skill and a **drone-parts/grey-market salvage contact**. Starter Kit: **Fabricator's Bench** (light Kit; mobile tool rig + sidearm; +1 to field repair rolls on your own drones).

**Signature reskin:** Deploy & Command becomes a **swarm launch** — a single Deploy action can bring up to 2 microdrones online at once (instead of 1) at the cost of each being individually fragile. Rigged Fire, when made by 3 or more active drones in the same Focus Fire action, auto-applies the Suppressed rider regardless of roll. Field Repair on a drone restores full Integrity in one action rather than a partial amount.

**Feature ladder:**

| Level | Feature | Effect |
|---|---|---|
| 1 | **Wide Band** (passive) | Fleet size cap raised by +2 over the class baseline; a single Deploy & Command maneuver can Command the entire swarm at once regardless of count |
| 1 | **Salvage Sense** (passive, triggered) | When a drone you control is wrecked, you may immediately strip it for parts as a free triggered action (grants the standard Salvage Tick Uptime, see Heroic Resource: Uptime, above) |
| 2 | **Suppressing Volume** (passive) | Focus Fire with 3+ drones auto-suppresses the target regardless of individual roll results |
| 3 | **Cheap and Many** (passive) | A wrecked Micro-tier drone can be redeployed from spare parts as a maneuver instead of a main action, once per encounter |
| 5 | **Swarm Sense** (passive) | While 3+ drones are active, you gain an edge on Instinct tests to notice ambushes or hidden threats (distributed sensor coverage) |
| 6 | **Overwhelm** (passive) | When 4 or more drones you control target the same creature in one Focus Fire, that target's Armor is treated as 1 lower for that action |
| 7 | **Endless Swarm** (passive) | Fleet size cap raised by a further +2 (total +4 over baseline); Deploy Momentum income doubles |
| 8 | **Wide Band, Redoubled** (passive) | The Wide Band Command-the-whole-swarm maneuver no longer requires all drones be within Range; it reaches any drone you currently control |
| 9 | **Total Coverage** (passive) | Your recon and sensor drones grant the whole crew (not just you) the Swarm Sense edge to notice ambushes while 3+ of your drones are active |

**Full ability ladder (Drone Jockey):**

*Base Tier (1-5 Uptime, chosen at 1st level; 6 abilities total in the tier):*

> **Taser Swarm**
> *Command · Main Action · Uptime cost 1*
> Target: 1 creature within any active drone's weapon range
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | No effect. |
> | 12-16 | 2 + Logic damage, target is Slowed (save ends). |
> | 17+ | 3 + Logic damage, target is Stunned until end of their next turn. |

> **Kamikaze Run**
> *Command · Main Action · Uptime cost 3*
> Target: 1 creature or object
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 3 damage; the drone is destroyed regardless of roll. |
> | 12-16 | 6 damage; drone destroyed. |
> | 17+ | 10 damage; drone destroyed, target knocked prone. |
>
> *One microdrone is expended entirely — it flies into the target and detonates. Always destroys the drone.*

> **Spotter Lock**
> *Command · Maneuver · Range 10 · Uptime cost 1*
> Target: 1 creature
> **Power Roll** — none
>
> *A spotter-drone marks the target: the next Rigged Fire or Focus Fire against that target this round gains an edge. No damage; pure setup.*

> **Recon Loop**
> *Command · Maneuver · Self · Uptime cost 1*
> No target; utility
>
> *A recon quadrotor sweeps a 10-square radius and reports back — you learn the position of every creature in the area, even through light cover, until the start of your next turn.*

> **Buzzsaw Pass**
> *Command · Main Action · Melee 1 (drone must be adjacent) · Uptime cost 2*
> Target: 1 creature
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 2 damage. |
> | 12-16 | 4 damage, drone may reposition up to its Speed after. |
> | 17+ | 6 damage, target is Bleeding (save ends). |

> **Decoy Chirp**
> *Command · Free Triggered · Range 10 · Uptime cost 1*
> No target; utility
>
> *Trigger: an enemy targets you or an ally with a ranged attack. Effect: a drone broadcasts a false heat/comm signature, and the attack must retarget the drone instead if it is a valid target in range.*

*7-Cost Band (chosen at 3rd level; 5-6 abilities):*

> **Bee Storm**
> *Command · Main Action · Uptime cost 5*
> Target: up to 3 creatures within a 3-burst
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 2 damage each. |
> | 12-16 | 4 damage each, Slowed (save ends). |
> | 17+ | 6 damage each, Slowed and Bleeding (save ends). |
>
> *Every taser-bee you control converges on an area.*

> **Autogun Lockdown**
> *Command · Main Action · Range = autogun's mount range · Uptime cost 5*
> Target: 1 zone (3-burst)
> **Power Roll** — none
>
> *An autogun turret-drone establishes an area of control: until the start of your next turn, any enemy that enters or acts in the zone triggers a free Rigged Fire from the autogun.*

> **Sensor Ghost**
> *Command · Maneuver · Range 10 · Uptime cost 3*
> Target: self or 1 ally
>
> *A recon drone projects a false sensor return, granting the target concealment against Wired-assisted targeting (smartlinks, drone gunners, sensor-fusion) until start of your next turn.*

> **Swarm Reposition**
> *Command · Maneuver · Self · Uptime cost 2*
>
> *Every drone you control may reposition up to its Speed. No attack.*

> **Focus Sting**
> *Command · Main Action · Uptime cost 4*
> Target: 1 creature
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage. |
> | 12-16 | 7 damage. |
> | 17+ | 10 damage, target is Weakened (save ends). |
>
> *Every taser-bee currently active converges its charge into a single overload strike on one target.*

> **Wide Eyes**
> *Command · Free Triggered · Range 10 · Uptime cost 2*
>
> *Trigger: an ally within 10 squares of any of your active drones is about to be flanked or ambushed. Effect: the ally gains a free Reposition of 2 squares before the triggering effect resolves (your recon net calls the warning a half-second early).*

*9-Cost Band (chosen at 5th level; 4-5 abilities):*

> **Saturation Fire**
> *Command · Main Action · Uptime cost 7*
> Target: up to 4 creatures within a 4-burst
> **Power Roll** — 2d10 + Logic (rolled once, applied to all targets)
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage each. |
> | 12-16 | 7 damage each, Slowed (save ends). |
> | 17+ | 10 damage each, Suppressed until end of their next turn. |
>
> *Every autogun and drone with a ranged weapon opens up at once.*

> **Ghost Swarm**
> *Command · Maneuver · Uptime cost 5*
> No target; utility
>
> *Every drone you control becomes hidden (even if observed) for one round, so long as it does not attack.*

> **Kamikaze Volley**
> *Command · Main Action · Uptime cost 9*
> Target: up to 3 creatures or objects
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage each; expended drones destroyed. |
> | 12-16 | 8 damage each; drones destroyed. |
> | 17+ | 12 damage each; drones destroyed, targets knocked prone. |
>
> *Up to three microdrones detonate simultaneously against up to three separate targets.*

> **Adaptive Net**
> *Command · Free Triggered · Range 10 · Uptime cost 4*
>
> *Trigger: a drone you control would be destroyed. Effect: it survives at 1 Integrity, and you may immediately reposition it up to its Speed away from danger.*

*11-Cost Band (chosen at 8th level; 2-3 apex abilities):*

> **Total Swarm Protocol** (apex)
> *Command · Main Action · Uptime cost 11*
> Target: all creatures within 5 of any active drone
> **Power Roll** — 2d10 + Logic (rolled once per drone participating)
>
> *Every drone you control — regardless of count — makes a Rigged Fire attack this action, splitting freely among all valid targets in range. This is Focus Fire without the target-count cap, once per encounter.*

> **Unbreakable Hive** (apex passive)
>
> *Whenever a drone you control would be destroyed, roll a d6; on a 4+, it instead drops to 1 Integrity and is Systems Down (inactive but not destroyed) until you spend a maneuver to reboot it. Once per drone per encounter.*

**Skill grants:** Electronics (1st). **Contact grant:** a drone-parts/grey-market salvage contact. **Kit grant:** Fabricator's Bench (light Kit; +1 to field repair rolls on your own drones). **Signature chrome:** none required.

---

### Vehicle Rig-Pilot — *"the Driver"* — Street-Taught (No Corp Academy)

Grants the **Piloting** skill and a **chop-shop/transport contact**. Starter Kit: **Rigger's Harness** (light Kit; direct-neural control interface mount; +1 to Jump-In checks).

**Signature reskin:** Deploy & Command, for a Rig-Pilot, is really "wake the platform up" — deploying their signature vehicle costs the same Uptime but the vehicle arrives Jumped-In-ready rather than needing a separate maneuver to jack in. Rigged Fire from a Jumped-In vehicle can strike two targets in a line if they're aligned with a mount's firing arc — the platform's weapons are bigger and often hit more than one thing. Field Repair on their own platform restores more Integrity than the class baseline.

**Feature ladder:**

| Level | Feature | Effect |
|---|---|---|
| 1 | **One With the Machine** (passive) | Jump-In into your registered signature platform costs 1 fewer Uptime and grants a larger temporary Integrity buffer (+2 over the class baseline) |
| 1 | **Pilot and Gunner** (passive) | While Jumped-In, you count as occupying both the Pilot and a Gunner station simultaneously, with an extra edge on Rigged Fire rolls made this way |
| 2 | **Line Breaker** (passive) | Rigged Fire made from a Jumped-In vehicle can target 2 creatures in a line within the weapon's arc, rolled once |
| 3 | **Hardened Rig** (passive) | While Jumped-In, damage to your meat body from biofeedback is reduced by 2 |
| 5 | **Redline Reflexes** (passive) | While Jumped-In, you gain the platform's full Speed as your own for the purpose of any ability that cares about your Speed |
| 6 | **Scrapheap Loyalty** (passive) | Your signature platform can be field-repaired to full Integrity once per respite even outside of downtime, so long as you have access to any workshop (Physical Upgrade Slot) |
| 7 | **Ghost in the Frame** (passive) | While Jumped-In, if your platform would be wrecked, you may spend all remaining Uptime to eject safely with no biofeedback damage, regardless of roll |
| 8 | **Redline Mastery** (passive) | Redline Reflexes' Speed benefit now also grants a +1 Handling bonus while Jumped-In |
| 9 | **One Frame, Perfect Timing** (passive) | Once per encounter, when you would fail a Jump-In check, treat it as a success instead |

**Full ability ladder (Vehicle Rig-Pilot):**

*Base Tier (1-5 Uptime, chosen at 1st level; 5-6 abilities):*

> **Jump-In (Signature Platform)**
> *Command · Maneuver · Uptime cost 1*
> Target: self, into your registered signature platform within Range 10
>
> *You jack directly into your platform's control systems. See Jump-In Plumbing (THE MACHINES, above) for the full mechanical resolution; this ability grants the One With the Machine discount automatically.*

> **Ram Speed**
> *Command · Main Action · Uptime cost 3*
> Target: 1 creature or object in the platform's path
> **Power Roll** — 2d10 + Reflex (piloting the ram)
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage to target, 2 damage to platform. |
> | 12-16 | 8 damage to target, 2 damage to platform, target pushed 3. |
> | 17+ | 12 damage to target, 1 damage to platform, target pushed 5 and prone. |
>
> *A pilot-action ramming attack, per the vehicle-combat ramming rules (THE MACHINES, above): Scale + Speed sets the damage basis; the heavier/faster party takes less.*

> **Twin Mount Volley**
> *Command · Main Action · Uptime cost 3*
> Target: 2 creatures in a line within a mount's arc
> **Power Roll** — 2d10 + Logic + Gunnery
>
> | Roll | Effect |
> |---|---|
> | ≤11 | No damage. |
> | 12-16 | 4 + Logic damage each. |
> | 17+ | 6 + Logic damage each, both Suppressed. |

> **Evasive Burn**
> *Command · Maneuver · Uptime cost 2*
> No target; self-buff
>
> *Your platform gains a defensive edge against the next attack made against it this round (a hard evasive maneuver).*

> **Systems Purge**
> *Command · Free Triggered · Uptime cost 2*
>
> *Trigger: your platform would gain a mechanical condition (Crippled, Systems Down, On Fire/Leaking). Effect: roll 2d10 + Logic; 12+ prevents the condition entirely.*

> **Boarding Repel**
> *Command · Main Action · Melee 1 · Uptime cost 3*
> Target: 1 creature attempting to board your platform
> **Power Roll** — 2d10 + Reflex
>
> | Roll | Effect |
> |---|---|
> | ≤11 | No effect. |
> | 12-16 | Target pushed off, falls prone. |
> | 17+ | Target pushed off, takes 4 damage, falls prone. |

*7-Cost Band (chosen at 3rd level; 5-6 abilities):*

> **Overdrive Charge**
> *Command · Main Action · Uptime cost 5*
> Target: 1 creature or object
> **Power Roll** — 2d10 + Reflex
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 6 damage, 3 damage to platform. |
> | 12-16 | 10 damage, 2 damage to platform, push 3. |
> | 17+ | 14 damage, 1 damage to platform, push 5, target prone. |

> **Sensor Fusion Lock**
> *Command · Maneuver · Uptime cost 3*
> Target: 1 creature within sensor range
>
> *Grants an edge to the next Rigged Fire or Twin Mount Volley against this target, and denies it any cover benefit for one round.*

> **Full Broadside**
> *Command · Main Action · Uptime cost 7*
> Target: up to 3 creatures within the platform's firing arc
> **Power Roll** — 2d10 + Logic + Gunnery, rolled once
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage each. |
> | 12-16 | 8 damage each. |
> | 17+ | 12 damage each, all Suppressed. |

> **Emergency Patch**
> *Command · Maneuver · Uptime cost 4*
> Target: your own platform
>
> *Restore 6 + Logic Integrity to your platform while Jumped-In, without leaving Jump-In state.*

> **Terrain Breaker**
> *Command · Main Action · Uptime cost 5*
> Target: 1 zone of difficult/obstacle terrain
>
> *Your platform smashes through an obstacle, clearing a path and potentially damaging anything sheltering behind it (Director's call on secondary targets).*

*9-Cost Band (chosen at 5th level; 4-5 abilities):*

> **Redline Barrage**
> *Command · Main Action · Uptime cost 7*
> Target: up to 3 creatures
> **Power Roll** — 2d10 + Logic + Gunnery
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 6 damage each. |
> | 12-16 | 10 damage each, Slowed. |
> | 17+ | 14 damage each, Slowed and Suppressed. |

> **Kill Ram**
> *Command · Main Action · Uptime cost 9*
> Target: 1 creature or object
> **Power Roll** — 2d10 + Reflex
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 8 damage, 3 to platform. |
> | 12-16 | 14 damage, 2 to platform, push 5. |
> | 17+ | 20 damage, 0 to platform, push 8 and prone. |

> **Full Stabilization**
> *Command · Maneuver · Uptime cost 5*
>
> *Clear all mechanical conditions from your platform and restore 10 + Logic Integrity, once per encounter.*

> **Ghost Signature**
> *Command · Free Triggered · Uptime cost 4*
>
> *Trigger: your platform would be targeted by an enemy lock/mark effect. Effect: the lock fails; your platform's sensor ghosting sells a false position.*

*11-Cost Band (chosen at 8th level; 2-3 apex abilities):*

> **One Machine, One Will** (apex)
> *Command · Main Action · Uptime cost 11*
> Target: up to 3 creatures within the platform's full firing arc
> **Power Roll** — 2d10 + Logic + Gunnery, rolled once, at double edge
>
> *The platform and pilot act as a single perfect system for one exchange: maximum damage output, no biofeedback risk this action regardless of outcome.*

> **Unkillable Frame** (apex passive)
>
> *Once per encounter, when your platform would drop to 0 Integrity, it instead drops to 1 and you may immediately spend a maneuver to Full Stabilization at no Uptime cost.*

**Skill grants:** Piloting (1st). **Contact grant:** a chop-shop/transport contact. **Kit grant:** Rigger's Harness (light Kit; direct-neural control interface mount; +1 to Jump-In checks). **Signature chrome:** the **control rig** — a deep-Jump vehicle-interface implant (Body Integrity spend) that is this subclass's defining piece of gear; it enables and deepens Jump-In and grants Rigging/Gunnery edges. See Kit & Chrome Interaction, below.

---

### Facility Rigger — *"the Warlord"* — Street-Taught (No Corp Academy)

Grants the **Security Systems** skill and a **parts-supplier/quartermaster contact**. Starter Kit: **Field Chassis** (light Kit; portable turret-control tablet + sidearm; +1 to Deploy checks for pre-placed assets).

**Signature reskin:** Deploy & Command, for a Facility Rigger, doesn't deploy from a carried machine — it **activates** a pre-placed asset already wired into their base of operations (see Building Stat Card, above), at reduced Uptime cost since the hard work (installation) happened during downtime, not in the fight. Rigged Fire from a pre-placed turret benefits from the terrain the Rigger chose for it — always treat pre-placed turret fire as having prepared cover unless the enemy specifically flanks it. Field Repair on a Physical Upgrade Slot asset (a turret, a mesh-web generator) is faster and cheaper than field-repairing a mobile drone, since the Rigger built it to be serviced in place.

**Feature ladder:**

| Level | Feature | Effect |
|---|---|---|
| 1 | **Home Ground** (passive) | While fighting inside or adjacent to your registered base of operations, all Deploy actions for pre-placed assets cost 1 fewer Uptime |
| 1 | **Pre-Wired** (passive) | You may pre-designate up to 2 Physical Upgrade Slot assets as "primed" during downtime; primed assets activate as a free triggered action the first time combat starts at that site |
| 2 | **Killbox Instinct** (passive) | Your base of operations gains +1 Physical Upgrade Slot if designated Killbox (stacks with the Killbox baseline, see THE MACHINES, above) |
| 3 | **Mesh-Web Doctrine** (passive) | Mesh-web tripwires you place impose a bane on any enemy's first attack roll after triggering one, in addition to their normal effect |
| 5 | **Fortified Node** (passive) | Your base's Node gains +1 Wired Upgrade Slot, and any hostile Hacker attempting to breach it takes a bane on the attempt while you are present |
| 6 | **Turn the Building** (passive) | Once per encounter, you may activate every Physical Upgrade Slot asset in your base simultaneously as a single main action (a building-scale Focus Fire) |
| 7 | **The Building Remembers** (passive) | Your base of operations never loses Downtime Fabrication progress even if abandoned and later reclaimed; additionally, Physical Upgrade Slot assets repair themselves 1 Integrity per downtime cycle automatically |
| 8 | **Fortress Doctrine** (passive) | Pre-Wired's "primed assets" cap rises from 2 to 4 |
| 9 | **The Warlord's Reach** (passive) | Home Ground's Uptime discount now also applies to any secondary site you've spent at least one Downtime Fabrication cycle upgrading, not just your primary base |

**Full ability ladder (Facility Rigger):**

*Base Tier (1-5 Uptime, chosen at 1st level; 5-6 abilities):*

> **Wake the Walls**
> *Command · Main Action · Uptime cost 1 (reduced by Home Ground)*
> Target: 1 pre-placed asset within your base
>
> *Activate a single pre-placed turret, sentry, or mesh-web generator. It comes online and acts immediately this round.*

> **Sentry Fire**
> *Command · Main Action · Uptime cost 2*
> Target: 1 creature within a sentry's mount range
> **Power Roll** — 2d10 + Logic + Gunnery
>
> | Roll | Effect |
> |---|---|
> | ≤11 | No damage. |
> | 12-16 | 4 + Logic damage. |
> | 17+ | 6 + Logic damage, target Suppressed. |

> **Trip the Web**
> *Command · Free Triggered · Range = mesh-web's placement · Uptime cost 1*
>
> *Trigger: an enemy enters a square containing your mesh-web. Effect: the enemy is Restrained (save ends) and takes a bane on their next attack roll (Mesh-Web Doctrine, once unlocked).*

> **Breach Charge**
> *Command · Main Action · Uptime cost 3*
> Target: 1 zone (2-burst) at a pre-wired breach point
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage to all in zone. |
> | 12-16 | 8 damage to all in zone, knocked prone. |
> | 17+ | 12 damage to all in zone, knocked prone and Deafened (save ends). |

> **Lockdown Protocol**
> *Command · Maneuver · Uptime cost 2*
> Target: 1 door/access point in your base
>
> *Seal a door or corridor — enemies must spend an action to force it, or find another way around.*

> **Ghost in the Walls**
> *Command · Maneuver · Uptime cost 1*
> No target; utility
>
> *You know the location and status of every pre-placed asset and every enemy detected by your base's sensors, without needing line of sight, as long as you are inside or adjacent to the base.*

*7-Cost Band (chosen at 3rd level; 5-6 abilities):*

> **Crossfire Grid**
> *Command · Main Action · Uptime cost 5*
> Target: up to 3 creatures within 2 or more sentries' combined arcs
> **Power Roll** — 2d10 + Logic + Gunnery, rolled once
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage each. |
> | 12-16 | 8 damage each, Slowed. |
> | 17+ | 12 damage each, Restrained (save ends). |

> **Web the Corridor**
> *Command · Main Action · Uptime cost 4*
> Target: 1 zone (line, length 5)
>
> *Deploy a fresh mesh-web tripwire mid-encounter (rather than pre-placed).*

> **Overpressure Vent**
> *Command · Main Action · Uptime cost 5*
> Target: 1 zone (3-burst) at a pre-wired vent point
> **Power Roll** — 2d10 + Logic
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 4 damage each. |
> | 12-16 | 8 damage each, pushed 3. |
> | 17+ | 12 damage each, pushed 5 and prone. |

> **Emergency Reinforcement**
> *Command · Maneuver · Uptime cost 3*
> Target: 1 Physical Upgrade Slot asset
>
> *Restore 6 + Logic Integrity to a turret, sentry, or mesh-web generator without leaving your position.*

> **Feedback Loop**
> *Command · Free Triggered · Uptime cost 3*
>
> *Trigger: a hostile Hacker attempts to breach your base's Node. Effect: roll 2d10 + Logic contested against their attempt; success deals Wired-side biofeedback to the attacker and denies the breach.*

*9-Cost Band (chosen at 5th level; 4-5 abilities):*

> **Total Lockdown**
> *Command · Main Action · Uptime cost 7*
> Target: your entire base of operations
>
> *Every door and access point seals simultaneously; every sentry and turret gains a free Rigged Fire against the first enemy to force entry at each point.*

> **Building-Scale Volley**
> *Command · Main Action · Uptime cost 9*
> Target: up to 4 creatures within any Physical Upgrade Slot asset's combined range
> **Power Roll** — 2d10 + Logic + Gunnery, rolled once per asset
>
> | Roll | Effect |
> |---|---|
> | ≤11 | 6 damage each. |
> | 12-16 | 10 damage each, Suppressed. |
> | 17+ | 14 damage each, Suppressed and Restrained (save ends). |

> **Fortify Node**
> *Command · Maneuver · Uptime cost 5*
>
> *Grant your base's Node a temporary +2 effective Wired Upgrade Slot worth of hardening until end of encounter (a rapid firewall reconfiguration).*

> **Collapse the Corridor**
> *Command · Free Triggered · Uptime cost 4*
>
> *Trigger: an enemy attempts to flee through a corridor inside your base. Effect: a pre-wired structural charge seals the route (Director's call on collateral); the enemy is Restrained until they force their way through.*

*11-Cost Band (chosen at 8th level; 2-3 apex abilities):*

> **Turn the Building** (apex)
> *Command · Main Action · Uptime cost 11*
> Target: all valid enemy targets within your base of operations
> **Power Roll** — 2d10 + Logic + Gunnery, rolled once per Physical Upgrade Slot asset active
>
> *Every turret, sentry, mesh-web, and breaching charge in your base activates simultaneously. This is the Facility Rigger's Focus Fire equivalent at building scale, once per encounter.*

> **The Building Remembers** (apex passive)
>
> *Your base of operations never fully falls. Even reduced to 0 Structural Integrity, one Physical Upgrade Slot asset survives (Director's choice) and can be the seed of rebuilding it in downtime.*

**Skill grants:** Security Systems (1st). **Contact grant:** a parts-supplier/quartermaster contact. **Kit grant:** Field Chassis (light Kit; portable turret-control tablet + sidearm; +1 to Deploy checks for pre-placed assets). **Signature chrome:** none required at baseline, but a control rig or sensor-suite implant amplifies the Node-hardening features. See Kit & Chrome Interaction, below.

---

## Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Uptime resource (heroic resource) - Deploy & Command / Rigged Fire / Field Repair / Override Ping (signatures) - Kit - Choose subclass - Choose a Base Tier (1-5 Uptime) ability | -- | Subclass passive + subclass triggered action |
| **2** | Fleet Size Doctrine online (base 3) | Perk (choice) | Subclass 2nd-level feature |
| **3** | Focus Fire (7-Cost band, unlocked) - Choose a 7-Cost ability | -- | Subclass 3rd-level feature |
| **4** | Fleet Cap +1 (fleet size 4) | Characteristic Increase - Perk (choice) - Skill | -- |
| **5** | Choose a 9-Cost ability - Uptime cap 10→12 | -- | Subclass 5th-level feature |
| **6** | Jump-In Buffer Increase (+4 → +5) | Perk (choice) | Subclass 6th-level feature |
| **7** | Fleet Cap +1 (fleet size 5) - Jump-In Buffer Increase (+5 → +6) | Characteristic Increase - Skill | Subclass 7th-level feature |
| **8** | Choose an 11-Cost ability | Perk (choice) | Subclass 8th-level feature |
| **9** | Uptime Economy Mastery (once-per-encounter +2 drip tick) | -- | Subclass 9th-level feature |
| **10** | Overclock (epic capstone) - Fleet Cap +1 (fleet size 6) - Uptime cap 12→14 | Characteristic Increase - Perk (choice) - Skill | -- |

## Core Class Features (Non-Subclass)

- **Fleet Size Doctrine** (2nd) — Passive. Tracks how many machines a Wrench may have active simultaneously; see Fleet Size Doctrine under THE MACHINES, above, for the full cap table (base 3 at 1st, stepping to 4/5/6 at 4th/7th/10th).
- **Fleet Cap +1** (4th, 7th, 10th) — Passive. Each of these levels raises your Fleet Size Doctrine cap by 1 (see THE MACHINES, above, for the full progression: 3 → 4 → 5 → 6).
- **Uptime Cap Increase** (5th, 10th) — Passive. Your Uptime pool's soft cap rises from 10 to 12 at 5th level, and from 12 to 14 at 10th level (see Heroic Resource: Uptime, above).
- **Jump-In Buffer Increase** (6th) — Passive. The temporary Integrity buffer granted on a successful Jump-In check rises from **+4 to +5** (see Jump-In Plumbing under THE MACHINES, above).
- **Jump-In Buffer Increase** (7th) — Passive. The Jump-In Integrity buffer rises again, from **+5 to +6**.
- **Uptime Economy Mastery** (9th) — Once per encounter, when the fielded-fleet drip resolves at the start of your turn, gain **+2 Uptime** instead of the usual per-machine total for that tick only (still subject to your Uptime pool cap).
- **Overclock** (10th, epic capstone) — Once per encounter, as a free triggered action when you Deploy or Command: until the end of your next turn, (a) Uptime costs on your abilities are **2 less** (minimum 1), and (b) every machine you control gains a **+2 Integrity** temporary buffer. When it ends, you cannot gain Uptime from the fielded-fleet drip until the start of your following turn.

## Kit & Chrome Interaction

**Chrome-positive.** Power runs *through* hardware for a Wrench, so Body Integrity spend directly supports the class — and the Wrench is uniquely tied to **nuyen gear** (the fleet) plus the mod/upgrade-slot subsystem defined in THE MACHINES, above, as the class most likely to be a premier gear-mod crafter.

- **Chrome is the interface** (Body Integrity spend): the **control rig** (the Vehicle Rig-Pilot's signature implant) enables and deepens Jump-In and grants Rigging/Gunnery edges; sensor-link chrome amplifies multi-drone command for a Drone Jockey; Node-hardening sensor suites amplify a Facility Rigger's building-side features. **No magic-erosion conflict** — the Wrench has no native Veil access, so it chromes up freely. Firewall intact: chrome makes Uptime-fueled abilities *better* (discounts, edges, buffers), but chrome **never generates Uptime** directly.
- **The fleet is nuyen gear.** Drones, vehicles, turrets, and mesh-web generators are bought with ¥ and improved via the Upgrade Slot subsystem (THE MACHINES, above). Building and modding hardware is the Wrench's signature **downtime project**, most fully expressed by the Facility Rigger's Downtime Fabrication.
- **Favored Kits.** Light-to-moderate — a hands-on Wrench likes a fabricator/rigging-adjacent Kit (Fabricator's Bench, Rigger's Harness, Field Chassis, per subclass) but carries their real weight through the fleet, not their own loadout.
- **Wired / Machines access, no Veil.** The Wrench lives across Combat, the Wired, and the Machines vehicle-combat sub-system, with fleet command as its emphasis. A **Cyborg can be a Wrench** — a machine commanding machines — and is a strong Full-Conversion build.
