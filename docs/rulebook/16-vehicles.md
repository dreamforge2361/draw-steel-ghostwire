# Ghostwire Core Rulebook — Chapter: Vehicles

**Status:** Stage 3 draft for Michael review — 2026-09-16 (ET)  
**Pairs with:** `05-wrench.md` (Uptime / Jump-In / Vehicle Rig-Pilot / Machines), `15-drones.md`, `14-mods.md`, `11-economy.md`, Gear master Cat **5A–5D / 5F**  
**Foundry:** inventory + rules text only this pass; packs deferred to Claude/B19+  
**Lore notes:** Reach mobility ecology (this chapter); drone lore extract stays in `docs/masters/_drone_lore_extract.md`

**Design locks (do not reopen in this draft):**
- Stock Draw Steel + Ghostwire module; hero Levels **1–10**, Echelon **1–4**
- **No Item Tier T5–T1 in player text** — use **Echelon + Availability** (Street → Prototype)
- **¥** buys objects; firewall: no attributes / skills / class power from ¥
- Kit doctrine never costs ¥
- **§Craft** = downtime Project procedure; **Repair / Electronics / Hacking / Rigging / Piloting** as skills
- Art: Reach-native cyberpunk-fantasy (rain, neon, vertical hive, wet docks, stacked lanes)
- **Anyone can drive/pilot one vehicle**; **Wrench** owns Jump-In + Rigging/Piloting excellence (see §4)
- Cat **5A–5D** is the starting spine — expanded below
- **Echelon coverage (LOCKED — same as drones):** each Echelon 1–4 needs **≥5 crewed vehicles**, **≥3 roles**. **E1 includes Clunker/Junk** beaters

---

## 1. Lore frame — mobility in The Reach

**Lock (Michael 2026-09-20) — street picture.** Full player prose: Setting Primer **Vehicles & Transit** (`docs/manuscript/01-lore/L1-setting-primer.md`). Do not reopen here.

- Most vehicles in this world are **electric**.
- **Street / POV** (personally owned vehicles): mostly **light electric hovercraft** with **altitude limiters ~25–50 feet** off the ground — **not** free-flight sky cars.
- **Ground vehicles** (tires / treads) still exist but are **almost always heavy lifters, haulers, and big equipment** — not everyday street cars.
- **VTOL / flying craft** are **more expensive** but also in **common use** (corp, transit, well-funded runners).

Ossian Reach does not move cleanly. The **street-layer hover lane** stacks under the next level's belly — a cushioned river of limiter-capped POVs in the rain. **Tires and treads** grind where mass has to move: freight, wrecks, squads, cages. Above the limiter band, **VTOL lanes** never sleep — corp birds, licensed transit, runner tiltjets. Wet docks and flood canals lace the Sinks; grey shafts and freight spurs cut the Flats; corp skyways hang like private weather over the Grid. Crews live or die by what they can steal, borrow, or rebuild.

A rusted commuter **hover** with a bent skirt is still a getaway. A junk rotor that rattles every bolt is still altitude when the alley goes hot. Higher up the Availability ladder, the same routes get cleaner, faster, and meaner — armored haulers, tiltjets with door-guns, silent wetsubs, sealed hoppers that punch for orbit. The Machines layer of play (drones → **vehicles** → buildings) is how Ghostwire turns that texture into table tools.

> **Tone:** Reach-native chrome in the rain — scarred hover skirts, LED strips, wet deck glare, dock fog, limiter-lane lights stacking into VTOL — not clean white-box miltech. Not a parking lot of tire sedans.

**Street-class tags (inventory):** **Hover** = street-layer limiter POV (**Lane-Hopper** is the 4-seat table-token archetype; hover bikes / choppers share the family; including many Ground-domain sedan/cab/bike SKUs). **Ground-hauler** = tires / treads / walker mass. **VTOL** = free-climb flying. Domain still gates chase/wreck language; a Ground hover hugs the street deck. Open/closed cabins exist; Rideable passenger slots are a future pass (top-down seats make them obvious — do not implement now).

**This chapter covers crewed platforms** (and optionally Jump-In Capable shells a Wrench can inhabit). Heavy combat **drones** stay on `15-drones.md` — see Scale clarification in §2.

---

## 2. Scale bands (crewed vehicles)

| Scale | Plain meaning | Examples |
|---|---|---|
| **Light** | Hover-bike, small rotor, open skiff — one or two bodies, exposed or cramped | Sport cycle, junk rotor, harbor skiff |
| **Vehicle** | Street hover / hauler van / light aircraft / patrol boat mass — crew seats and real cover | Lane-Hopper, Getaway hover, panel hauler, tiltjet, wetsub, orbital pod |
| **Heavy** | APC / gunship / attack sub / heavy shuttle — squad carriage or serious armor | Brick APC, Skyhunter, Leviathan, orbital mule |
| **Capital** | Warship / mobile base — campaign asset, multi-station crew | Reaver corvette |

**Vs drone Scale (`15-drones.md`):** drones use **Personal / Light / Vehicle (drone)**. A Vehicle-scale **drone** (Stinger, Warhound, etc.) remains on the **drone** inventory so swarm/fleet play stays one list. This chapter is **crewed** platforms — seats, stations, passengers — even when a Wrench Jump-In runs the shell solo.

**Domain:** Ground / Air / Water / Space. Domain gates terrain, chase language, and wreck consequences; it does not replace Scale.

**Chassis → mod slots (doctrine):** slots climb with Availability / Echelon (same shape as Gear master Cat 5A–5D). Street ≈ 1; Professional ≈ 2; Restricted ≈ 3; Military ≈ 4; Prototype ≈ 5. A chassis cannot exceed its published slot count — buy a bigger frame (or Invent a Mod + Director gate) for more capacity.

> **Note:** `05-wrench.md` also sketches Scale-band slot counts (Light 2 / Vehicle 4 / Heavy 6 / Capital 8+). This chapter follows **Gear-master Availability slots** for inventory consistency with drones. Reconcile Scale-vs-Availability slot doctrine in the Machines numeric pass — flagged under Open Questions.

---

## 3. Stat card fields

Align to the Vehicle Stat Card in `05-wrench.md`. Profiles here are **qualitative**; concrete Integrity / Speed / Armor numbers deferred to the shared Machines numeric pass.

| Field | Description |
|---|---|
| **Name / Frame** | Ghostwire slang / corp / sci triple (original names only) |
| **Scale** | Light / Vehicle / Heavy / Capital |
| **Domain** | Ground / Air / Water / Space |
| **Handling** | Edge / bane / die-step feel on Piloting or Rigging to drive or stunt |
| **Integrity** | Damage track (numeric deferred). 0 = wrecked — domain catastrophe (crash, downing, flood, decompress) |
| **Armor** | Flat damage reduction feel; stacks defensively with Scale |
| **Crew stations** | Pilot/Driver, Gunner, Systems/EW, Passenger counts (see §6) |
| **Speed band** | Slow / Standard / Fast / Extreme — maps to positional move or chase-track advance |
| **Jump-In Capable?** | Yes / No — whether a Wrench may Jump-In cleanly (Rigger Cocoon can upgrade a No → Yes) |
| **Mod slots** | Per Availability/Echelon (published count) |
| **Availability** | Street → Prototype |
| **Echelon** | 1–4 |
| **Cost ¥** | Object price; never buys class power |

**Mounted weapons** come from Category 3; installs are §Craft Projects (`14-mods.md`). Hardpoints usually need a **Gun Rack** mod (§5F) unless the profile already includes a factory mount.

---

## 4. Anyone vs Wrench / Rig-Pilot excellence

### 4A — Non-Wrench (any other class)

| Rule | Locked proposal |
|---|---|
| **Vehicles in play** | May **drive/pilot one** vehicle at a time using **Piloting** (or a Director-approved Drive fantasy equivalent) |
| **Jump-In** | **Forbidden** — no sensor merge, no inert-body Jump-In, no temporary Jump-In Integrity buffer |
| **RCC / fleet-vehicle features** | **Cannot** use advanced RCC fleet-vehicle features (Fleet Deck+ vehicle orchestration, multi-platform Command, War Table / Hydra-style vehicle swarm tools) even if the hardware is owned — inert or Remote-Box-equivalent at Director discretion |
| **Risky chase / combat Piloting** | **Bane** on risky chase stunts, combat Piloting, and evasive driving Power Rolls **if not trained** in Piloting (untrained driver can still putter in traffic) |
| **Gunnery from mounts** | Passengers/gunners may fire personal weapons and Street/Professional soft mounts; **Restricted+ combat hardpoints** prefer a trained Gunner or a Wrench — Director may allow with bane |
| **Uptime** | No Uptime pool; no Deploy & Command / Rigged Fire vehicle spend |
| **Heroic resource** | Cannot spend Uptime; cannot use Vehicle Rig-Pilot signature Jump-In discounts |

**Intent:** an Operator can steal a street hover and run a chase; a Scout can fly a buzzcopter on a quiet insertion. Neither becomes a discount Vehicle Rig-Pilot.

### 4B — Wrench

| Rule | Align to `05-wrench.md` (do not invent parallel names) |
|---|---|
| **Jump-In** | Full Jump-In Plumbing into **Jump-In Capable** vehicles (maneuver; Logic or Reflex; inert body; biofeedback; temporary Integrity buffer per Wrench chapter) |
| **Rigging / Piloting** | Full excellence — Rigging and/or Piloting as class/subclass grants; no untrained bane on combat stunts |
| **Solo / Jumped-In** | While Jumped-In, act as **pilot and gunner** simultaneously through the control rig (Vehicle Rig-Pilot default mode) |
| **Uptime** | Asset hits / wrecks drain Uptime per Wrench chapter; Field Repair / Deploy interactions unchanged |
| **RCC** | Full use of owned RCC ladder for vehicle-linked command where the Wrench chapter already allows it |
| **Subclass** | **Vehicle Rig-Pilot** — signature platform, One With the Machine discounts, Ram Speed / Redline ladders — as printed in `05-wrench.md` |

**Firewall reminder:** ¥ buys frames and mods. Uptime runs the fight. Chrome (control rig) improves Jump-In / efficiency; chrome never generates Uptime; ¥ never buys Uptime.

**Rigger Cocoon (§5F):** upgrades a frame to accept Jump-In cleanly. It does **not** grant Jump-In to non-Wrenches.

---

## 5. Customize & modding

- Published **vehicle/drone mods** live in Gear master **§5F** (Gun Rack, Plate-Up, Tune Kit, Sensor Pod, Ghost Coat, Runflats, Rigger Cocoon, Ammo Bin, …).
- Install / swap / remove = downtime **§Craft Project**; skill = **Repair** (physical / armor / suspension) or **Electronics** (sensor / EW / cocoon suites). Autosofts / RCC programs use **Hacking** (`14-mods.md`).
- **Invent a Mod (v1)** applies — pitch, firewall check, Echelon gate, materials ¥, Project Power Roll.
- Slot integrity: do not publish orphan slot counts without a mod family. Mounted Category-3 weapons need a hardpoint (factory or Gun Rack).

---

## 6. Vehicle combat / chase (lean DS-friendly v1)

**Chosen lean system for this chapter:** **abstract range bands** (cinematic pursuits and most vehicle fights). When vehicles share a tactical map with foot combat, Directors may instead use **positional** mode as already sketched in `05-wrench.md` — same skills, same wreck language.

### 6.1 Abstract range track

```
Broken off ← Extreme → Long → Medium → Close → Ramming / Boarding
```

- Each round, the **pilot** makes an opposed **Piloting** or **Rigging** Power Roll (Handling modifies) against the lead pursuer / quarry.
- **Middle / High:** advance one band toward your goal (close the gap or open it).
- **Low:** stall or lose a band (Director: traffic, wake, lane crosswind, dock clutter).
- **Weapons** work at their effective range band (personal small arms struggle past Medium; vehicle mounts and Gunnery shine at Long/Medium).
- **Close / Ramming:** enables boarding attempts, ramming (§6.2), and passenger melee through doors/hatches.
- **Broken off:** chase ends (escape or lost contact).

**Positional (optional):** vehicles move on the same map/zones as foot combat at vehicle Speed and Scale, sharing terrain and cover. Cross-scale edge/bane per `05-wrench.md`.

### 6.2 Crash, wreck, ram

| Event | Effect |
|---|---|
| **Hit while underway** | Integrity damage; Wrench loses **1 Uptime** per hit if the vehicle is their fielded asset. Non-Wrench: no Uptime; Director may impose a bane on the next risky Piloting action |
| **0 Integrity** | **Wrecked** — domain catastrophe (ground crash, air downing, hull flood, decompress). Occupants take a Personal-scale crash hit and must escape. Wrench: lump **3 Uptime** drain |
| **Ram** | Opposed Piloting/Rigging. Damage basis = **Scale + Speed band** (heavier/faster party takes less). On success, force a band shift and/or apply **Crippled** / Integrity loss. Full numeric multipliers deferred |
| **Recovery** | Field Repair (Wrench) in the fight per class text. Between scenes: §Craft **Repair** Project + ¥ parts (Director: ≈ 10–25% of chassis cost for a heavy rebuild) |
| **Total loss** | Seized, burned, sunk, or dropped into the Sinks — the ¥ is gone |

**Conditions (reskin):** **Crippled** (Handling/Speed penalty), **Systems Down** (a station offline), **On Fire/Leaking** (ongoing), **Stalled/Dead-stick** (immobilized). Called shots inflict conditions instead of raw Integrity.

### 6.3 Crew roles

| Station | Does |
|---|---|
| **Pilot / Driver** | Moves the vehicle; only the pilot advances the chase track or positional Speed. Evasive driving = defensive edge. Stunts = risky Piloting/Rigging |
| **Gunner** | Fires mounted weapons with **Gunnery** on their turn |
| **Systems / Sensors / EW** | Locks, terrain reads, jams — feed an edge to pilot/gunner or a bane to a foe |
| **Passenger** | Acts normally at a speed bane (shoot out a window, hack, reload); uses the hull as cover |
| **Solo / Jumped-In (Wrench)** | Pilot **and** gunner simultaneously via control rig |

---

## 7. Full inventory by Echelon

**Reading the table:** slang / corp / sci names are **Ghostwire-original**. Prices climb with Availability + Echelon. Concrete Integrity / Speed / Armor numbers deferred to the Machines numeric pass — profiles stay qualitative. **Clunker** = inefficient, unreliable, but usable (E1 junk / beaters).

**Spine:** Gear master Cat **5A–5D** (20 frames) + expansions to hit coverage locks.

### 7.1 Inventory (33 crewed platforms)

| Name (slang / corp / sci) | Domain | Scale | Echelon | Availability | Cost ¥ | Mod slots | Crew (feel) | Speed | Jump-In? | Profile | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Clunker / Junk Hauler / scrapyard beater van | Ground | Vehicle | 1 | Street | 150 | 1 | 1 driver + 3–4 cramped | Slow | No | Smokes, stalls, still moves a crew and a crate. | Clunker, Cargo, Beater, Ground-hauler |
| Scrap-Bike / Yard Cycle / salvage courier bike | Ground | Light | 1 | Street | 180 | 1 | 1 (+pillion) | Fast | No | Bald tires, loud chain — weaves when it doesn't die. | Clunker, Courier, Beater, Hover |
| Rustbucket / City Runabout / urban commuter EV | Ground | Vehicle | 1 | Street | 250 | 1 | 1+3 | Standard | No | Disposable get-around. Low Handling, no mounts. | Clunker, Beater, Hover |
| Lane-Hopper / Open Stripe / four-seat street hovercar | Ground | Vehicle | 1 | Street | 500 | 1 | 1+3 | Standard | No | Everyday POV archetype — electric hover, limiter ~25–50 ft, four seats. Open cabin is the table token; closed cabins exist. | Transit, Crew-car, Hover, POV |
| Sink-Skiff / Harbor Junk / open flood launch | Water | Light | 1 | Street | 220 | 1 | 1+2 | Slow | No | Patched hull, wet bilge — river work when nothing else floats. | Clunker, Beater, Aquatic |
| Junk Rotor / Yard Copter / scrap autogyro | Air | Light | 1 | Street | 400 | 1 | 1+1 | Standard | No | Cheap junk rotor — rattles, leaks oil, still buys altitude. | Clunker, Beater, Fragile, VTOL |
| Skiff / Runabout Boat / outboard launch | Water | Light | 1 | Street | 300 | 1 | 1+3 | Standard | No | Small open boat — harbor crossings, quiet approach. | Aquatic, Transit |
| Crotch-Rocket / Sport Bike / high-torque courier cycle | Ground | Light | 1 | Professional | 1,000 | 2 | 1 (+pillion) | Fast | No | Nimble traffic knife; exposed rider. | Courier, Pursuit, Hover |
| Getaway / Sedan / mid-line autonomous saloon | Ground | Vehicle | 1 | Professional | 1,200 | 2 | 1+4 | Standard | No | Classic crew car — seats a team, decent Handling, self-drive option. | Crew-car, Transit, Hover |
| Workhorse / Utility Van / panel cargo hauler | Ground | Vehicle | 1 | Professional | 900 | 2 | 1+5 | Slow | No | Cargo + cover + rolling workshop / rig-nest. | Cargo, Workshop, Ground-hauler |
| Buzzcopter / Light Rotor / civil autogyro | Air | Light | 1 | Professional | 1,200 | 2 | 1+1 | Fast | No | Two-seat civil rotor — recon, insertion, overhead eye. Fragile, unarmed. | Recon, Insertion, VTOL |
| Cigarette / Speedboat / hydroplane pursuit craft | Water | Vehicle | 1 | Professional | 1,500 | 2 | 1+3 | Fast | No | Fast surface pursuit; forward mount option. | Pursuit, Aquatic |
| Hardtop / Armored SUV / executive-protection wagon | Ground | Vehicle | 2 | Restricted | 4,500 | 3 | 1+4 | Standard | No | Up-armored, run-flats, tinted — extraction and bodyguard work. | Armor, Extraction, Ground-hauler |
| Grey Cab / Ghost Fare / discreet armored taxi | Ground | Vehicle | 2 | Restricted | 3,800 | 3 | 1+3 | Standard | No | Looks street; hides plate and a panic cell. Fixer favorite. | Covert, Transit, Hover |
| Flatbed / Rig Hauler / articulated cargo tractor | Ground | Heavy | 2 | Restricted | 5,500 | 3 | 1+1 (cab) + deck | Slow | No | Moves drones, wrecks, and stolen safes. Loud, honest mass. | Cargo, Heavy, Ground-hauler |
| Tiltjet / VTOL Transport / vectored-thrust rotorcraft | Air | Vehicle | 2 | Restricted | 5,000 | 3 | 2+6 | Fast | Yes | Insertion/exfil bird — hovers, carries a team, door-gun ready. | Insertion, Mount, VTOL |
| Hoverpad / Air-Car / ducted-fan personal aircar | Air | Vehicle | 2 | Restricted | 4,000 | 3 | 1+3 | Fast | No | Urban low-altitude flyer — ignores street gridlock. | Transit, Pursuit, Hover |
| Harbor Cutter / Dock Patrol / armed surface cutter | Water | Vehicle | 2 | Restricted | 4,200 | 3 | 2+4 | Standard | No | Dock authority hull — light mount, search lights, boarding deck. | Patrol, Aquatic, Mount |
| Wetsub / Mini-Sub / two-man submersible | Water | Vehicle | 2 | Restricted | 6,000 | 3 | 2 | Slow | Yes | Silent infiltration below the sensor line; limited depth. | Stealth, Aquatic, Infiltrate |
| Pod / Orbital Hopper / suborbital transfer capsule | Space | Vehicle | 2 | Restricted | 7,000 | 3 | 1+3 | Extreme | No | Cramped short-hop capsule — station-to-station, surface-to-orbit. | Sealed, Transit |
| Warbike / Assault Cycle / weaponized recon cycle | Ground | Light | 3 | Military | 12,000 | 4 | 1 | Fast | Yes | Forward mount + light armor — milspec scout/skirmisher. | Combat, Mount, Pursuit, Hover |
| Brick / APC / armored personnel carrier | Ground | Heavy | 3 | Military | 18,000 | 4 | 2+8 | Standard | Yes | Squad mover + turret platform. | Armor, Troop, Mount, Ground-hauler |
| Cage / Black Wagon / secure prisoner transport | Ground | Vehicle | 3 | Military | 14,000 | 4 | 1+2 crew / locked bay | Standard | No | Hard cells, jammer roof — take them alive. | Secure, Armor, Ground-hauler |
| River-Fang / Attack Boat / armed hydrofoil | Water | Vehicle | 3 | Military | 15,000 | 4 | 2+4 | Fast | Yes | Foil chase hull with twin light mounts. | Combat, Aquatic, Mount |
| Skyhunter / Gunship / attack rotorcraft | Air | Heavy | 3 | Military | 20,000 | 4 | 2+2 | Fast | Yes | Strafe-and-fire-support — multiple hardpoints, armor, sensors. | Combat, Mount, Heavy, VTOL |
| Drop-Sled / Assault Glider / low-alt insertion sled | Air | Light | 3 | Military | 11,000 | 4 | 1+4 | Extreme | No | One-way hot drop from a skyway or tiltjet bay. | Insertion, Expendable-lean, VTOL |
| Mule / Orbital Shuttle / heavy transit & boarding craft | Space | Heavy | 3 | Military | 22,000 | 4 | 2+8 | Extreme | Yes | Heavy transit/boarding craft with docking collar. | Sealed, Boarding, Heavy |
| Iron Giant / Combat Walker / bipedal weapons platform | Ground | Heavy | 4 | Prototype | 55,000 | 5 | 1 (Jump-In) or 2 | Standard | Yes | Legged mech — all-terrain, multiple hardpoints, apex ground unit. | Combat, Heavy, Walker, Ground-hauler |
| Spider-Frame / Octo-Tank / multi-limb siege crawler | Ground | Heavy | 4 | Prototype | 52,000 | 5 | 1 (Jump-In) or 2 | Slow | Yes | Limb-climber siege shell — corridor and vertical nightmare. | Combat, Climb, Heavy, Ground-hauler |
| Ghost-Wing / Stealth VTOL / low-observable insertion craft | Air | Heavy | 4 | Prototype | 60,000 | 5 | 2+6 | Fast | Yes | Radar-and-Alert-quiet heavy insertion — black-ops apex. | Stealth, Insertion, Heavy, VTOL |
| Leviathan / Attack Sub / hunter-killer submersible | Water | Heavy | 4 | Prototype | 58,000 | 5 | 4+4 | Standard | Yes | Deep silent hunter — sonar suite, torpedo mounts. | Combat, Aquatic, Heavy |
| Void-Runner / Long-Hopper / deep-orbit runner | Space | Heavy | 4 | Prototype | 70,000 | 5 | 2+4 | Extreme | Yes | Longer legs than a Pod; hard burns between Reach orbit and far nodes. | Sealed, Transit, Heavy |
| Reaver / Corvette / fleet-scale warship | Space | Capital | 4 | Prototype | 80,000+ | 5 | Multi-station crew | Extreme | Yes | Capital warship — mobile base, heavy mounts, campaign asset. | Sealed, Capital, Combat |

**Count:** **33** published crewed platforms (20 Cat 5A–5D spine + 13 expansions).

### 7.2 Echelon coverage check (LOCKED)

| Echelon | Count | Roles (≥3) | Notes |
|---|---|---|---|
| **1** | **12** | Beater/Clunker, Courier/bike, Crew-car, Cargo/workshop, Air recon, Water transit/pursuit | Includes **Lane-Hopper** POV hovercar + **Clunker** tags on Junk Hauler, Scrap-Bike, Rustbucket, Sink-Skiff, Junk Rotor |
| **2** | **8** | Armor/extraction, Covert transit, Heavy cargo, VTOL insertion, Air-car, Patrol boat, Wet infiltrate, Orbital hop | Cleaner Restricted band |
| **3** | **7** | Assault bike, APC troop, Secure wagon, Attack boat, Gunship, Assault glider, Orbital mule | Harder mounts, Jump-In common |
| **4** | **6** | Walker, Siege crawler, Stealth VTOL, Attack sub, Deep-orbit runner, Corvette | Apex / Prototype |

### 7.3 Role quick-index

| Role | Chassis |
|---|---|
| Clunker / beater | Clunker, Scrap-Bike, Rustbucket, Sink-Skiff, Junk Rotor |
| Courier / bike | Scrap-Bike, Crotch-Rocket, Warbike |
| Crew-car / transit | Lane-Hopper, Getaway, Grey Cab, Hoverpad, Pod, Void-Runner |
| Cargo / workshop | Clunker, Workhorse, Flatbed |
| Armor / extraction / troop | Hardtop, Brick, Cage |
| Air recon / insertion | Buzzcopter, Junk Rotor, Tiltjet, Drop-Sled, Ghost-Wing |
| Gunship / combat air | Skyhunter |
| Water transit / patrol | Skiff, Sink-Skiff, Harbor Cutter |
| Water pursuit / attack | Cigarette, River-Fang, Leviathan |
| Wet infiltrate | Wetsub |
| Walker / siege ground | Iron Giant, Spider-Frame |
| Space / sealed | Pod, Mule, Void-Runner, Reaver |

### 7.4 Availability ↔ Echelon remap (player-facing)

| Availability | Typical Echelon | Legacy Gear-master Item Tier (internal only) |
|---|---|---|
| Street | 1 | T5 |
| Professional | 1 | T4 |
| Restricted | 2 | T3 |
| Military | 3 | T2 |
| Prototype | 4 | T1 |

---

## 8. Open questions for Michael

1. **Slot doctrine:** keep **Availability/Echelon slots** (this chapter + drones + Gear master) or adopt **Scale-band slots** from `05-wrench.md` (Light 2 / Vehicle 4 / Heavy 6 / Capital 8+)?
2. **Chase default:** lock **abstract range bands** as player-facing default (proposed) or prefer positional whenever a map is out?
3. **Non-Wrench hardpoints:** soft/Street mounts only vs any mount with bane + trained-Gunner preference (proposed lean: Restricted+ prefers trained/Wrench)?
4. **Jump-In Capable list:** factory Yes only on Restricted+ combat/insertion frames (proposed) vs any frame with Rigger Cocoon only?
5. **Capital play:** is Reaver a campaign prize / downtime asset (upkeep, crew NPCs) rather than a standard ¥ buy?
6. **Numeric pass:** Integrity / Speed / Armor / Handling shared with drones, or vehicle-only interim cards first?
7. **Drop-Sled “expendable-lean”:** one-shot insertion hull (recoverable?) or reusable light glider?
8. **Core Sourcebook PDF remount:** fold any still-canon vehicle prose when Dropbox harvest is on-box.

---

## Related chapters

- Drones — `docs/rulebook/15-drones.md` (crewless fleet; anyone-vs-Wrench drone rules)
- Wrench — `docs/rulebook/05-wrench.md` (Jump-In Plumbing, Vehicle Rig-Pilot, Uptime, chase modes reference)
- Mods — `docs/rulebook/14-mods.md` (§5F pointer; Invent a Mod; §Craft skills)
- Economy — `docs/rulebook/11-economy.md` (¥ firewall; §Craft Projects)
- Gear master — `docs/masters/GHOSTWIRE_GEAR_MASTER.md` (Cat 5A–5D spine, §5F mods)
- Setting Primer — `docs/manuscript/01-lore/L1-setting-primer.md` (**Vehicles & Transit** street picture lock 2026-09-20)

**Next (Machines track):** Buildings / Facility Rigger card expansion (not a full Building chapter in this pass).
