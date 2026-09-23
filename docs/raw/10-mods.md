# Mods

**RAW status:** draft (Stage 3 procedure fill / B75, 2026-09-19; armor + gadget families published G2, 2026-09-22)  
**Sources:** `docs/rulebook/14-mods.md` (Complete lock), `docs/masters/GHOSTWIRE_GEAR_MASTER.md`, `docs/raw/08-kits-gear-wealth.md`, `docs/raw/09-chrome-body-integrity.md`, `docs/raw/21-the-wire.md`  
**Print:** Chapter 12 (TOC lock)  
**Design locks (do not reopen):** ¥ cost; stack with Kit doctrine on different numbers; §Craft = Project procedure, not a skill; field toggle for already-installed mods; install/swap/remove = downtime Project; slot integrity; firewall; Invent a Mod (v1); chargen never auto-grants mods. Vehicle/drone **Armor** and **Weaponry** each ship a 4-echelon ladder in §5F (Michael lock 2026-09-20). Wearable **armor / shields** (§2F) and **gadgets** (§1H) are **published** as of G2 / 0.3.100 — and a wearable armor mod still never adds Stamina.

---

## What this chapter is for

Mods are the **object-side** upgrade layer. Kits train technique. Economy buys hosts. Chrome lives in flesh and spends Body Integrity. Mods fill **mod slots** on hosts you already own.

A smartlinked Ghost-Kit pistol gets both the Kit’s doctrine *and* the mod’s effects — they never overwrite each other. This chapter tells the table **when** to spend a downtime slot on a mod, **how** to install or invent one, **which published families** exist, and how mods refuse to become chrome, Kits, or class power.

Every host family is now published: weapon mods from Gear master **§3G**, wearable armor and shield mods from **§2F**, gadget mods from **§1H**, and the vehicle/drone Armor and Weaponry ladders from **§5F** — all harvested below. Point of record for published rows is the Gear master. Point of record for deck software play is The Wire (`21`).

---

## Purpose

Mods are tags, edges, convenience, and small typed immunities bolted onto an object. They are never a second Kit and never a chrome implant.

| Layer | What it buys | Currency | Chapter |
|---|---|---|---|
| **Kit** | Doctrine: damage bands, distance, speed, stability, signature | Character power (free; never ¥) | `08` |
| **Host gear** | The object: weapon, deck, drone, vehicle | ¥ + Availability | `08`, `21`, `23` |
| **Mod** | Slot-filling upgrade on that object | ¥ + a §Craft Project | **This chapter** |
| **Chrome** | Implant in living flesh | ¥ + **Body Integrity** | `09` |

---

## Doctrine

| Rule | Detail |
|---|---|
| **¥ cost** | Every published mod has a nuyen price. Invented mods spend materials ¥ up front (see Invent a Mod). |
| **Stack with Kits** | Mods and Kit doctrine touch **different numbers**. Never rewrite Kit damage / Stamina / signature lines. |
| **§Craft = procedure** | Installing, swapping, removing, or inventing a mod is a **Project** (`03`) during downtime. §Craft is **not** a skill name. |
| **Field toggle** | An already-installed mod may be toggled on/off in the field (normal action / free as printed). Install, swap, or remove always requires a downtime Project. |
| **Firewall** | Mods may grant tags, edges, convenience, and small typed immunities. Mods **never** grant characteristics, skills, class features, heroic resources, or Kit doctrine. |

### Skills by job (Power Roll on §Craft Projects)

| Skill | Used for |
|---|---|
| **Hacking** | Programs / deck software / software installs (deck & RCC slots) |
| **Electronics** | Deck hardware, sensors, gadgets, Wired devices |
| **Repair** | Weapons, armor, vehicles/drones — physical mods |
| **Cybertech** | Chrome-adjacent only (implanted weapon/mount interfaces that are chrome-side; living chrome still spends Body Integrity per Chrome chapter) |

If you do not have the listed skill, you still make the Project Power Roll — you just do not get the skill benefit (`03`). The Director does not invent a fifth Craft skill.

### Slot integrity

If an item publishes **modSlots > 0**, a **published mod family** must exist for that host family. If no family exists yet, set slots to **0** until the family ships. Do not leave orphan slot counts.

**Consumables** never have mod slots.

**Armor class and slots** (`08`): Heavy armor published with slots uses **+1** vs the grade table; Light uses **−1**; Medium is unchanged. Those slots are live: the wearable armor and shield family is published in Gear master **§2F** (harvested below), so a grade row that shows a number means that number.

### Host families

| Host family | Status | Notes |
|---|---|---|
| **Weapons** | **Published** | Core set in Gear master **§3G** (harvested below) |
| **Armor / shields** | **Published** *(wearable)* | Gear master **§2F** (harvested below). Hosts: `armor` and `shield`. **No wearable mod adds Stamina** |
| **Gadgets** | **Published** | Gear master **§1H** (harvested below). Hosts: `comms`, `sensors`, `bne-mechanical`, `bne-electronic`, `survival`, `wired` |
| **Vehicles / drones** | **Published** | Gear master **§5F** (harvested below). Hosts: `vehicle` and `drone` |
| **Decks / RCCs** | **Published** (software) | Slots filled by **suites / autosofts** and **payload magazines** from the Matrix catalog (Gear master Category 4); install skill = **Hacking**. Play rules: `21` |

A gadget you bought from Category 1 is a **host** when a published family exists for its family tag — and as of G2 every Category-1 family has one. You still cannot slot a row this chapter does not print: §1H is the menu, and Invent a Mod is the only other door.

---

## Echelon + Availability (gear grade)

**No Item Tier / T5–T1 in player-facing text.** The Gear master’s Item Tier column is a **legacy label** for gear grade only. Map:

| Legacy Item Tier | Echelon | Availability feel | Typical mod slots (`08`) |
|---|---|---|---|
| T5 | Echelon 1 | Street | 1 |
| T4 | Echelon 1 | Professional | 2 |
| T3 | Echelon 2 | Restricted | 3 |
| T2 | Echelon 3 | Military | 4 |
| T1 | Echelon 4 | Prototype | 5 |

Higher-grade gear costs more and has more mod slots. Hero-side benefits (Kit Stamina per echelon; Armor-as-Stamina by wearer **Echelon**) scale with the hero’s echelon (`24`) — not with a leftover item-tier ladder.

**Do not confuse** Power Roll **outcome bands** (low / middle / high) with Item Tier / gear grade.

Price bands for the host sit in `08`. A Street pistol with one slot is not a Prototype just because you invented a clever mod for it.

---

## When to mod

Spend a project slot on a mod when **all** of these are true:

1. You **own** the host (weapon, deck, drone, vehicle). Kits do not ship free mods. Chargen ¥ may buy a Street-band published mod after you own the host — it is still not an auto-grant.
2. The host has a **free slot** in a **published** family.
3. You want a **tag, edge, or convenience** the Kit and the stock host do not already give (Quiet, Smart, a hardpoint, a magazine of Zap).
4. You can pay **¥** (or Invent materials) and take the **Availability** heat for that SKU.

**Do not** spend the slot when:

- You are trying to raise Kit damage, Kit Stamina, or a signature line — that is doctrine, not a mod.
- You want a characteristic, skill, or class feature — firewall.
- You want flesh changed — that is chrome (`09`), even if the implant is a weapon.
- You want something the published family does not print. Invent a Mod is the door, inside the firewall and the echelon gate — it is not a license to ship a second catalog alongside §2F / §1H.
- You want a wearable armor mod to add **Stamina**. It never does; that number is the armor Item's, by class and wearer Echelon (`08`).

**Typical first mods (Echelon 1):** Smartlink or Personalized Grip on the qualifying pistol; a Street-band suite on a Street Deck; a Soft Armor Insert or Climate Seal Liner on the vest; Quiet Picks on the lockpick set or a Burner Mode Chip on the comm.

---

## Table procedure — install, swap, remove

Use this loop every time. It is the same §Craft spine Lifestyle points at (`26`) and Kits summarize (`08`).

### 1. Acquire

- **Buy** a published mod (¥ + Availability). Street / Professional is the usual chargen and early-street band.
- **or Invent** (locked procedure below). Materials spend up front.
- **or Loot** a published row the Director already put in play. Looted mods are still not installed until step 3.

Chrome implants are **not** acquired here. A datajack, implant spur, or cyberlimb is `09`.

### 2. Check the host

Confirm **four** facts before anyone rolls:

| Check | Fail means |
|---|---|
| Host family matches the mod (weapon → weapon; vehicle/drone → §5F; deck/RCC → software) | Wrong family. Stop. |
| Free slots ≥ the mod’s **slot cost** (usually **1**) | Host is full. Uninstall something first (another Project) or pick another host. |
| You own both items | No remote install onto a borrowed gun in someone else’s locker. |
| Firewall | The pitch does not grant characteristics, skills, class features, heroic resources, or Kit doctrine. |

Payload magazines share deck slots with suites (`21`). A Street Deck’s **2** slots are any mix of suites and magazines.

### 3. §Craft Project (downtime)

Installing, swapping, or removing is a **Project** (`03`) during a respite. It consumes a Lifestyle **project slot** (`26`) unless the Director is running a montage that folds several small Street installs into one bench scene.

**Power Roll** with the skill by job (table above). Characteristic is usually **Logic** (bench work, firmware, deck software) or **Physique** if the fiction is brute mechanical labor on a vehicle frame — Director’s call, then stick to it for that host.

Read the Project as `03` prints it (progress 1 / 2 / 3 toward goal **3** for a routine published install). Ghostwire also uses this **install outcome** when you need a printed band for a routine published mod (not Invent):

| Result | Install / swap / remove |
|---|---|
| **Low** (≤11) | Time burned; host unchanged. Materials for a *bought* published mod are not destroyed (you still have the part). Invent materials follow Invent, not this row. |
| **Middle** (12–16) | Install, swap, or remove succeeds. The mod occupies its slot cost (or frees it). |
| **High** (17+) | Success, and the Director may waive a trivial follow-up (no extra session to “seat” a Smartlink; the rack is clean). No extra slot, no extra damage, no free second mod. |

**Swap** = remove + install as **one** Project if both mods are published, same family, and the new slot cost fits. Otherwise two Projects.

**Remove** frees the slot. The part is still an Item you own unless the fiction destroyed it.

### 4. Field toggle (not a Project)

An **already-installed** mod may be switched on or off in the field as a normal action, or as a free action if the printed row says so (Smartlink is togglable). The mod **keeps its slot** while off. Suites work the same way (`21`).

Payloads are **not** a field toggle. You **Run** a loaded magazine; each Run spends a fire (`21`).

### 5. After the bench

Record the install on the sheet (or in Foundry — sidebar below). Kit numbers do not change. Body Integrity does not change. Node Rating does not change.

---

## Kits, chrome, and mods — what conflicts

These three systems sit next to each other on purpose. They collide only when someone tries to spend the wrong currency.

### Mods vs Kits

- Kit doctrine (damage by Power Roll band, distance, speed, stability, signature) is **character power**. ¥ never buys it (`08`).
- Mods add **object** tags and edges (Quiet, Smart, a mount, a magazine).
- A Ghost-Kit runner with a Smartlink and a Suppressor has **both** the Ghost ranged doctrine **and** those tags. Neither line overwrites the other.
- Armor-as-Stamina and Kit Stamina still **do not double-count** (`08`). A wearable-armor mod cannot sneak a second Stamina bonus onto the vest.
- **Machine armor is different:** vehicle/drone armor kits grant Stamina (Integrity) on the machine Actor. Machines have no Kit Stamina and no armor rating. One armor kit at a time.

### Mods vs chrome

| | Mod | Chrome |
|---|---|---|
| Lives on | An object (host Item) | Living flesh (or a Cyborg Frame Module — different system) |
| Costs | ¥ + Project | ¥ + **Body Integrity** |
| Skill on the bench | Repair / Electronics / Hacking | Surgery loop in `09` (Medic / Wrench / ripperdoc) |
| Example | Smartlink on a pistol; Gun Rack on a bike | Datajack; Implant Weapon (Spur); Wired Reflexes |

**Smartlink** (weapon mod, Electronics) wants a **datajack / smartgun link** (chrome) *or* a **Smart-Scope** (weapon mod) to enable Smart for someone without a jack. That is a handshake, not a merge: the jack spends Integrity; the link spends a weapon slot.

**Implant Weapon** is chrome. It is not a §3G weapon mod. It does not occupy a pistol’s slots. It occupies an **arm location** and Integrity (`09`).

**Cybertech** on a §Craft Project is only for chrome-adjacent interfaces (an implanted mount that is still chrome-side). Living chrome still spends Body Integrity. Do not use Cybertech to install a Suppressor.

Cyborgs do not spend Body Integrity. Their **Frame Modules** are a species track (`09`, Peoples). They are not mods and this chapter does not price them.

### Mods vs the Wire

Deck **suites** and **payload magazines** occupy the same **mod slots** on a deck or RCC. They use this chapter’s install procedure with **Hacking**. What they *do* in play — Activate / Deactivate, Run, Connected gate, fires 1 / 3 / 5 — is `21`. Do not reprint Matrix Verbs here.

---

## Published mod families

Point of record: `docs/masters/GHOSTWIRE_GEAR_MASTER.md`. Rows below are **harvested**, not invented. Four families ship: weapons (§3G), wearable armor + shields (§2F), gadgets (§1H), and vehicles / drones (§5F).

### Weapon mods — Gear master §3G

Bench skill: **Repair** for physical weapon mods, **Electronics** for Wired / smart interfaces. Slot cost is how many of the weapon’s slots the mod consumes.

| Mod *(slang / corp / sci)* | Slot | ¥ | Effect | Skill | Tags |
|---|---|---|---|---|---|
| Smartlink / Ares SmartSystem / targeting interface | 1 | 500 | Edge on ranged strikes while wielder has a datajack/smartgun link or smart-scope. Togglable. | Electronics | Wired Smart |
| Suppressor / SternMeyer Hush / sound suppressor | 1 | 300 | Adds Quiet tag; slight range penalty at Extreme. Field-mountable if pre-threaded. | Repair | Quiet |
| Recoil Comp / Ares Steady / gas-vented compensator | 1 | 250 | Removes the auto-fire/burst bane on the second target or sustained fire. | Repair | — |
| Extended Mag / Ares Deepwell / high-capacity magazine | 1 | 150 | Doubles shots between reloads; halves reload frequency in play. | Repair | — |
| Smart-Scope / Zeiss Hawkeye / optical smart-sight | 1 | 600 | Improves optimal range band by one step; enables Smart on non-datajack users. | Electronics | Smart |
| Gas-Seal Kit / Shiawase Deepdive / hostile-environment seal | 1 | 400 | Weapon fires reliably underwater/vacuum/toxic atmosphere; no environmental jam. | Repair | Sealed |
| Underbarrel Mount / Ares Adapt / accessory rail | 1 | 200 | Adds a mount for a second small weapon/tool or a bayonet. | Repair | — |
| Personalized Grip / Fichetti Lockhand / biometric grip | 1 | 350 | Weapon fires only for its keyed owner (anti-theft/anti-disarm-use). | Electronics | Wired |

### Wearable armor + shield mods — Gear master §2F

Bench skill: **Repair** for liners, plates and struts, **Electronics** for the Wired / powered rows. Every row costs **1 slot** of the armor's or shield's mod slots. Hosts: **armor** and **shield**.

**The hard line:** worn armor already grants **Stamina** by class and wearer Echelon (`08`). **No armor or shield mod adds Stamina.** These rows buy tags, edges, convenience, and small **typed** immunities — never a second Stamina bonus on the vest.

| Mod *(slang / corp / sci)* | Echelon | Avail feel | ¥ | Host | Effect | Skill | Tags |
|---|---|---|---|---|---|---|---|
| Soft Armor Insert / Discreet Liner / slim aramid panel | 1 | Street | 300 | armor | Edge on tests to conceal that you are armored. | Repair | Concealable |
| Mag-Harness / Retention Rig / magnetic weapon tether | 1 | Street | 400 | armor, shield | Edge on tests to avoid being disarmed or dropping a held weapon when you are force moved. | Repair | — |
| Climate Seal Liner / Thermal Membrane / heat-exchange liner | 1 | Street | 600 | armor | Adds the Thermal tag; edge against hostile-environment cold or heat ticks. **One inner liner at a time.** | Repair | Thermal |
| Trauma Plates / Impact Insert / ceramic strike plates | 1 | Professional | 800 | armor, shield | Immunity 1 against kinetic weapon hits (untyped weapon damage counts as kinetic). Adds no Stamina. | Repair | — |
| Stealth Weave / Shadowline Overlay / adaptive low-profile fabric | 1 | Professional | 1,200 | armor | Edge on Stealth tests; while motionless, cancel one source of armor Stealth bane. **One outer camouflage layer at a time.** | Repair | Stealth |
| Reactive Flash Comp / Glare Shutter / photochromic reflex visor | 2 | Restricted | 1,500 | armor | Once per scene, when a flash or dazzle effect targets you, ignore the condition it would impose. | Electronics | Wired |
| Brace Struts / Bulwark Frame / braced load-path struts | 2 | Restricted | 1,800 | armor, shield | Edge on tests to resist forced movement and to avoid being knocked prone while braced. | Repair | — |
| Shield Capacitor / Denial Cell / active-denial power pack | 2 | Restricted | 2,000 | shield | Once per scene, negate one ranged hit against you entirely — a lighter Smart-Shield. **One active-denial cell at a time.** | Electronics | Wired |
| Insulator Liner / Dielectric Weave / dielectric armor liner | 2 | Restricted | 2,200 | armor | Lightning immunity 1 while worn. It insulates — it adds no Stamina. **One inner liner at a time.** | Repair | — |
| Seal Kit / Envelope Upgrade / hostile-environment sealing kit | 3 | Military | 6,000 | armor | Adds Sealed and Pressure to armor that was not sealed already: one scene of breathable air against vacuum, flood, ash, or a gassed room. No typed immunity of its own. | Repair | Sealed, Pressure |
| Scanner Null / Null Weave / detection-defeating signature weave | 3 | Military | 9,000 | armor | Edge to defeat a pat-down, a weapon-detection arch, or a standard armor scanner. | Electronics | Wired, Concealable |
| Thermoptic Skin / Chameleon Overlay / adaptive thermoptic overlay | 3 | Military | 11,000 | armor | Edge on Stealth tests; hold still and enemy sensor sweeps take a bane to find you. **One outer camouflage layer at a time.** | Electronics | Stealth, Wired |
| Reactive Plating / Adaptive Shell / prototype reactive composite | 4 | Prototype | 24,000 | armor, shield | Choose fire, cold, lightning, or poison at install: immunity 2 against that type while worn. Re-choosing is its own Project. Adds no Stamina. | Repair | — |
| Denial Field / Praetorian Halo / powered active-denial emitter | 4 | Prototype | 26,000 | shield | Once per scene, negate one ranged hit entirely against yourself or one adjacent ally. **One active-denial cell at a time.** | Electronics | Wired |

**Exclusive groups — one per host:** *inner liner* (Climate Seal Liner / Insulator Liner) · *outer camouflage layer* (Stealth Weave / Thermoptic Skin) · *active-denial cell* (Shield Capacitor / Denial Field). Everything else stacks to the host's free slots; Foundry refuses the clash by name.

### Gadget mods — Gear master §1H

Bench skill: **Electronics** for sensors, comms and Wired devices, **Repair** for the physical kit, **Hacking** for lock software. Every row costs **1 slot**. Hosts are the Category-1 gadgets by family: `comms`, `sensors`, `bne-mechanical`, `bne-electronic`, `survival`, and `wired` (anything carrying the Wired tag).

| Mod *(slang / corp / sci)* | Echelon | Avail feel | ¥ | Host family | Effect | Skill | Tags |
|---|---|---|---|---|---|---|---|
| Filter Upgrade / Fine-Particle Stage / layered toxin filter | 1 | Street | 150 | survival kit | One extra automatic success against an airborne-toxin tick. | Repair | Filtered |
| Burner Mode Chip / Identity Scrub / one-shot trail-wipe firmware | 1 | Street | 200 | comms | Once, after a run, scrub this device's identity trail for free. Spent until reset as a downtime Project. | Electronics | Wired, Consumable-ish |
| Quiet Picks / Hush Tension Set / sound-damped pick tools | 1 | Street | 250 | mechanical B&E | Edge on Stealth while you pick or work a mechanical lock; masks tool noise. | Repair | Quiet |
| Focus Magnifier / Zoom Stage / precision optical element | 1 | Street | 350 | sensors & optics | Edge on one Perception test per scene. | Repair | — |
| Encryption Dongle / Cipher Key / hardware crypto module | 1 | Professional | 500 | comms | Bane on enemy attempts to tap or trace this device's channel. | Electronics | Wired |
| Spectrum Filter / Multiband Lens / selectable optical filter | 1 | Professional | 700 | sensors & optics | Choose one at install: ignore smoke concealment, or edge on Perception in darkness. **One optical stage at a time.** | Electronics | — |
| Skeleton Key Soft / Lock Exploit Pack / maglock cracking firmware | 1 | Professional | 900 | electronic B&E | Edge against electronic locks of Professional grade or lower. **One lock-cracking package at a time.** | Hacking / Electronics | Wired |
| Beacon Squelch / Emission Mask / locator-suppression firmware | 2 | Restricted | 1,000 | any Wired gadget | Bane on enemy attempts to remotely locate this device. | Electronics | Wired |
| Jam Mask / Hardened Modem / jam-resistant transceiver stage | 2 | Restricted | 1,600 | comms, Wired | Holds its channel through local jamming and crowd-band noise; bane on enemy attempts to cut, drown, or drop the link. | Electronics | Wired |
| Breach Jack / Spreader Set / hydraulic door spreader | 2 | Restricted | 1,900 | mechanical B&E | Edge to force a mechanical door, gate, grate, or hatch, and it holds one open. Loud, unless the same kit also runs Quiet Picks. | Repair | — |
| Sniffer Head / Bus Tap / passive bus-tap probe | 2 | Restricted | 2,400 | electronic B&E, Wired | Tap a lock for a minute first: edge on the first Security-Systems test against it, and you learn whether it reports failures upstream. | Electronics | Wired |
| Rad Baffle / Isotope Curtain / layered isotope baffle | 2 | Restricted | 2,600 | survival kit | Adds Rad-Shielded and slows the radiation Exposure clock one step further than the kit alone. | Repair | Rad-Shielded |
| Habitat Stage / Envelope Module / inflatable habitat module | 3 | Military | 6,800 | survival kit | Deploys a sealed two-person shelter: the crew takes a respite through an ash storm, a rad front, or a vacuum night without ticking Exposure. | Repair | Sealed |
| Deep Optics / Penetrator Stage / multi-spectral penetrator stage | 3 | Military | 7,500 | sensors & optics | Pierces smoke, dark, and thin cover; edge on Perception to spot hidden, cloaked, or living targets. **One optical stage at a time.** | Electronics | Wired |
| Passkey Stack / Credential Cache / rolling-credential cache | 3 | Military | 8,500 | electronic B&E, Wired | Edge against electronic locks of Military grade or lower, and one free retry per scene when a lock rejects you. **One lock-cracking package at a time.** | Hacking / Electronics | Wired |
| Quantum Link / Executive Uplink Stage / entangled-pair link stage | 4 | Prototype | 21,000 | comms, Wired | This device's channel cannot be tapped or traced by anything short of prototype-grade kit. It is a link, not a SIN — it opens no doors on paper. | Electronics | Wired |
| Ghost Frame / Null Entry Frame / null-signature entry frame | 4 | Prototype | 23,000 | B&E, Wired | Entries the kit makes do not log, alarm, or scar, and the crew has an edge on Stealth while it works. It still does not open the lock for you. | Electronics | Quiet, Wired |

**Exclusive groups — one per host:** *optical stage* (Spectrum Filter / Deep Optics) · *lock-cracking package* (Skeleton Key Soft / Passkey Stack).

**Foundry apply vs Director table calls.** **Thermoptic Skin** and **Deep Optics** carry a real Active Effect (a Stealth and a Perception edge), shipped **off** so the player switches it on when the mod is installed and the condition holds — the same pattern **Stealth Weave** already used. Every other row in both tables is **flagged and printed on the card**, and Foundry does **not** auto-add its edges, banes, immunities, tags, or once-per-scene saves to Power Rolls: the Director applies the catalog line when the roll or the scene calls for it. No wearable mod writes Stamina anywhere.

Availability feel follows the Gear master's legacy tier on each row. Do not invent a second price.

### Vehicle / drone mods — Gear master §5F

Every row is a §Craft-gated mod occupying the machine’s slots. Skill = **Repair** or **Electronics** as the tags imply (Wired rows lean Electronics). Hosts: **vehicle** and **drone**.

**Doctrine (Michael 2026-09-20):** Ghostwire machines have **no armor rating / DR**. Armor kits work like hero armor: they grant **Stamina** (Integrity) on the machine. **One armor kit** and **one weaponry kit** installed at a time (echelon ladders). Ammo Bin stacks with a weaponry kit. Mounted Category-3 weapons need a weaponry kit (or a factory mount); fire them with **Gunnery**.

#### Armor kits (one at a time)

| Name *(slang / corp / sci)* | Avail feel | ¥ | Effect | Tags |
|---|---|---|---|---|
| Scrap-Weld / Street Plate / jury-rigged plating | Street | 400 | +6 Stamina (Integrity) on the machine. | Armor |
| Plate-Up / Armor Upgrade / composite up-armor kit | Restricted | 3,000 | +12 Stamina (Integrity) on the machine. Does not cost Handling. | Armor |
| Combat Plate / Milspec Hull / ballistic vehicle armor | Military | 8,000 | +18 Stamina (Integrity) on the machine. | Armor |
| Aegis Kit / Prototype Armor / reactive composite hull | Prototype | 22,000 | +27 Stamina (Integrity) on the machine. | Armor |

#### Weaponry kits (one at a time)

| Name *(slang / corp / sci)* | Avail feel | ¥ | Effect | Tags |
|---|---|---|---|---|
| Gun Rack / Weapon Mount / hardpoint assembly | Professional | 800 | Adds a hardpoint to fit one Category-3 weapon (scale-appropriate); fired with Gunnery. E1 of the ladder. | Mount, Weaponry |
| Twin Mount / Dual Hardpoint / paired weapon rails | Restricted | 2,500 | Two light hardpoints or one dual-feed mount (scale-appropriate Category-3); fired with Gunnery. | Mount, Weaponry |
| Turret Ring / Combat Turret / powered traverse mount | Military | 9,000 | Powered turret for a medium vehicle weapon (scale-appropriate); fired with Gunnery; wide firing arc. | Mount, Weaponry |
| Heavy Hardpoint / Integrated Battery / heavy weapons package | Prototype | 24,000 | Heavy integrated gun package (scale-appropriate); fired with Gunnery. | Mount, Weaponry |

#### Other (armor and weaponry are ladders; everything else is a menu)

Armor and weaponry are **one at a time**. The rows below are not — install as many as the frame has slots for.

| Name *(slang / corp / sci)* | Echelon | Avail feel | ¥ | Effect | Tags |
|---|---|---|---|---|---|
| Burner Plates / Swap Registry / throwaway registration set | 1 | Street | 500 | Swap plates and a bought registry entry. Sheds **one scene** of tail, tag, or lane-camera heat on this machine, then the entry is burned and the plates are trash. | Wired, Consumable-ish |
| Lane Skirt / Limiter Tune / street-deck skirt-and-vane package | 1 | Street | 700 | Edge on Piloting or Rigging in the stacked limiter lanes and tight street-deck traffic. Does **not** raise the altitude cap. | Hover |
| Spool Rig / Recovery Winch / powered cable-and-cradle hoist | 1 | Professional | 900 | Powered winch and cradle: lift a body, a crate, or a wrecked drone without landing or leaving cover. Edge on hauling and extraction. | Cargo |
| Drop Harness / Rapid-Egress Rack / fast-rope and cradle rack | 2 | Restricted | 1,800 | Passengers deploy while the machine is still moving; it never has to set down. | Insertion |
| Runflats / Self-Seal Kit / autonomous-repair weave | 2 | Restricted | 2,000 | Resists Crippled (blown tires, punctures); slowly self-repairs minor Integrity between scenes. | — |
| Signal Mule / Relay Mast / link-extension repeater mast | 2 | Restricted | 2,200 | Carries the crew’s Remote and Companion links further and holds them through local jam. | Wired |
| Ammo Bin / Rearm System / autonomous munitions feed | 2 | Restricted | 2,500 | Extends a mounted weapon's sustained fire; faster Wrench field-rearm. Feeds any E1–E4 Weaponry kit on the same machine. | Ammo |
| Tune Kit / Handling Package / suspension-&-control upgrade | 2 | Restricted | 2,500 | Improves Handling (edge on Piloting/Rigging & evasive driving). | — |
| Sensor Pod / Recon Suite / multi-spectral sensor array | 2 | Restricted | 3,000 | Edge on detection/target-lock; pierces smoke/dark. | Wired |
| Ghost Rein / Dampened Coupling / biofeedback-buffered control loom | 2 | Restricted | 3,400 | Softens Jump-In biofeedback on this machine. **Does not grant Jump-In** — that stays Wrench-only, and the frame still has to be Jump-In Capable or wear a Rigger Cocoon. | Wired |
| Deep Shell / Environment Envelope / pressure-and-vacuum sealing kit | 3 | Military | 5,500 | Seals the machine for flood, depth, ash storm, or vacuum. | Sealed |
| Spoof Cowl / Transponder Forge / licensed-traffic identity skin | 3 | Military | 6,500 | Forged licensed-traffic ID: edge to pass AEQ lane checks, corp skyway gates, and dock manifests **on paper**. Bane the moment anyone looks with their eyes. | Wired |
| Rigger Cocoon / Control Interface / Jump-In coupling | 3 | Military | 7,000 | Upgrades a vehicle to accept a Jumped-In pilot cleanly. | Wired |
| Ghost Coat / Stealth Skin / low-observable coating | 3 | Military | 9,000 | Bane on enemy attempts to detect, sensor-lock, or trace the machine. | Wired |
| Kick Drive / Overboost Coil / burst-discharge drive stage | 4 | Prototype | 17,000 | Once per scene, step the machine’s Speed band up for a round (Slow → Standard → Fast → Extreme). Runs hot. | — |
| Storm Lattice / Fleet Sensor Mesh / networked multi-spectral lattice | 4 | Prototype | 19,000 | Apex sensor mesh: pierces smoke, dark, and spoof, and shares its target lock with the crew and the fleet. | Wired |

**Foundry apply vs Director table calls.** Armor kits **do** raise the Deployed machine’s Stamina (Integrity) in Foundry. Weaponry kits **do** flag a live Gunnery hardpoint on that Actor (`installedKits.weaponry`); firing is still Gunnery / Rigged Fire / a gunner station at the table. Every row in the **Other** table is **flagged and shown as an Active Effect** on the machine, but Foundry does **not** auto-add those edges, banes, Jump-In cleanliness, heat-shedding, speed steps, or reload math to Power Rolls — the Director applies the catalog line when the roll or scene calls for it.

Availability feel follows the Gear master’s legacy tier on each row. Do not invent a second price.

#### Project Goal — fabricating a mod or a chassis

Building a published mod (or a whole chassis) from parts is the **stock Draw Steel crafting Project**, not a Ghostwire tracker. Every catalog card prints its own goal, prerequisites, and yield; the ladder is the system's trinket ladder by Echelon:

| Echelon | Project Goal | Roll | Prerequisites (on the card) |
|---|---|---|---|
| **1** — Street / Professional | **150** | Repair → Might or Reason · Electronics → Reason or Intuition | roughly half the ¥ in parts, plus a bay |
| **2** — Restricted | **300** | as above | as above |
| **3** — Military | **450** | as above | as above, plus a military-grade bay |
| **4** — Prototype | **600** | as above | as above, plus a Director-gated parts list |

Project points come from **Lifestyle project slots** (`26`) like any other Project. A finished fabricate Project yields the part; **installing** it is still the separate §Craft Project in the table procedure above. Buying the mod outright skips the fabricate Project entirely — it never skips the install.

### Programs and payloads (pointer)

- **Programs / suites / autosofts** occupy deck / RCC slots (Category 4B+); §Craft Project skill = **Hacking**.
- **Matrix payloads** — consumable mods (Gear master **§4C**). A payload occupies one **host slot** as a **magazine** (cyberdeck, shared with suites; or a Technomancer’s **Wired Native** body-interface). Loading it is a Craft (Hacking) Project whose result sets its fires (low 1, middle 3, high 5); each Run spends one, and at 0 the slot frees. **Whiteout** is the exception-grade compile: same Hacking Project, **steep / hard**. Full rule: `21-the-wire.md` (Deck software: suites vs payloads). This is the one exception to "Consumables never have mod slots": a payload *fills* a slot, it never has one.

---

## Invent a Mod (v1) — LOCKED

Between runs, a hero may invent a new mod as a **Project**:

1. **Pitch** — name, host family, slot cost (usually **1**), one-sentence effect, Availability feel (Street → Prototype).
2. **Firewall check (Director)** — reject anything that grants characteristics, skills, class features, heroic resources, or Kit doctrine lines.
3. **Echelon gate** — effect power ≤ inventor’s **Echelon** (Street/Professional at E1, Restricted at E2, Military at E3, Prototype at E4).
4. **Materials ¥** — ≈ half a comparable published mod (**floor ¥100**); spend up front.
5. **Project Power Roll** with the skill by host (table above):
   - **Low:** materials burned; no mod (or a flawed one-use prototype at Director whim).
   - **Middle:** personal unique mod (works for the inventor).
   - **High:** personal + the crew may treat it as a campaign catalog entry.
6. **Install** is a **separate** §Craft Project onto a host with free slots.

Invent a Mod does **not** bypass Availability heat, Director veto, or the firewall.

**Director notes (not new SKUs):** a High result that “enters the campaign catalog” is a *this crew* unlock. It is not permission to add a row to the Gear master. And check the published family first — a pitch for “a liner that seals Hardshell against the cold” is just the **Climate Seal Liner** in §2F: sell it, do not invent it. Invent is for what the four families genuinely do not print.

---

## Chargen note

Starting Kit grant includes **street-band qualifying gear** only (see Kits + Economy). **Mods never auto-grant** at chargen — buy, craft, or invent them later. Merc (dual Kit) receives street-band qualifying gear for **both** Kits; still no free mods.

Optional early spend (`02` step 9): leftover starting **¥5,000** may buy a Street-band published mod — a weapon mod, a Street suite, a §2F liner or insert, a §1H gadget stage — after you own the host. That is a purchase, not a Kit grant. Do not pre-install chrome to “turn on” a Smartlink unless the player also pays Integrity (`09`).

Advancement never auto-installs mods when a new echelon raises Kit Stamina (`24`).

---

> **In Foundry**
> On the hero sheet, right-click an owned **mod** Item (or its menu) → **Install onto…**. The dialog lists legal hosts on the same actor (family overlap, free slots, one armor kit / one weaponry kit at a time on a machine). Hosts show **Mod slots: used / max** and the installed names. Right-click an installed mod → **Uninstall mod** (sheet tracker only — still spend the downtime Project in fiction). Already-installed mods use **Activate / Deactivate** for the field toggle; the software keeps its slot.
>
> **Deploy the drone or vehicle first** (Item header **Deploy**, or right-click the host row). Then install. An installed, **active** armor kit writes Integrity on the **Deployed** machine Actor the same way hero armor does: stored chassis max + Active Effect `system.stamina.bonuses.treasure` (upgrade). Current Stamina rises by the bonus on install; toggle-off or uninstall drops the AE and clamps current Stamina to chassis. Weaponry kits stamp `flags.draw-steel-ghostwire.installedKits.weaponry` (hardpoints, Gunnery) plus a sheet AE. Tune Kit / Sensor Pod / Ghost Coat / Runflats / Rigger Cocoon / Ammo Bin stamp flags + a sheet AE; the **Director applies those edges/banes/convenience at the table** — Foundry does not auto-modify Piloting/Rigging/Gunnery Power Rolls for them. **Payload magazines** do **not** use generic Install: use **Load magazine (Craft)…** on the chip (Reason / Logic roll, Hacking edge; result sets fires 1 / 3 / 5). Hosts are a **cyberdeck** or a Technomancer’s **Wired Native**. Each **Run {Payload}** spends one fire and requires Connected (Overlay or Jacked In — Linked refuses). Do not invent extra menus.
>
> **Wearable armor, shields, and gadgets need no Deploy** — the host Item is already on the hero. Install onto… lists the vest, the shield, the comm, the lockpick set, the goggles, the survival roll, and refuses anything whose family does not overlap (a Shield Capacitor will not go on a jacket). Where two rows are the same trick, the mod carries an **exclusive group** and Foundry names the clash: *inner liner*, *outer camouflage layer*, *active-denial cell*, *optical stage*, *lock-cracking package*. **Thermoptic Skin** and **Deep Optics** ship an Active Effect that is **off** until the player switches it on, exactly like **Stealth Weave**. No other wearable or gadget mod touches a number: it sits on the sheet with its card, and the **Director applies the line**. **Nothing here writes Stamina** — armor Stamina stays on the armor Item, by class and wearer Echelon (`08`).

---

## What this chapter is not

- Not a place to convert a wearable armor mod into **Stamina** — that number belongs to the armor Item (`08`).
- Not a second chrome chapter (no Integrity, no implant ¥).
- Not a second Kit chapter (no doctrine lines).
- Not a reprint of Matrix Verbs or payload Effects (`21`).
- Not permission to convert ¥ into characteristics, skills, or class power.

---

## Cross-references

| Topic | Where |
|---|---|
| Kit doctrine vs object; chargen gear; grade / slot table | `08-kits-gear-wealth.md` |
| Chrome, Integrity, implant weapons | `09-chrome-body-integrity.md` |
| Lifestyle project slots | `26-lifestyle-downtime.md` |
| Suites vs payloads; Run; Connected | `21-the-wire.md` |
| Machines as hosts | `23-machines.md` |
| Published rows | Gear master **§3G** (weapons), **§2F** (armor / shields), **§1H** (gadgets), **§5F** (vehicles / drones), Category **4** (software) |
| Skills | `02` / skills master |
