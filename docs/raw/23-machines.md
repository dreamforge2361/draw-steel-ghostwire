# Machines: Drones, Vehicles & Buildings

**RAW status:** draft  
**Sources:** `docs/rulebook/15-drones.md`, `docs/rulebook/16-vehicles.md`, `docs/rulebook/05-wrench.md`

Wrench-specific machine rules (Uptime, Jump-In, stat cards, fleet command) are in `16-wrench.md`. This chapter holds what every hero needs: control modes, the non-Wrench limits, **Street Eye** (the Companion Link), scale bands, inventories, vehicle combat, and the **street picture** of how the hive moves.

---

## Drones

### Control modes

Every drone runs in one of three modes. Mode is a property of the **link**, not only the chassis.

| Mode | Who | What it feels like | Mechanical spine |
|---|---|---|---|
| **Remote** | Anyone with a link; Wrenches via RCC | Handheld or deck-fed camera/stick control | Rigging (or Logic + Rigging) to Direct; Gunnery for mounts if allowed |
| **Jump-In** | **Wrench only** (see Anyone vs Wrench) | Full sensor merge; meat body inert | Maneuver Jump-In per `16-wrench.md`; Reflex or Logic; biofeedback risk; temporary Integrity buffer |
| **Street Eye** (Companion Link) | Any class with a qualifying scout drone | Soft follow / watch / hold / scout leash | One soft program; max 1 active; no fleet orchestration; no Jump-In |

**Autonomous vs Commanded (Wrench table language):** a fielded machine may act on a canned behavior loop (Autonomous) or take orders through Deploy & Command / Rigged Fire (Commanded). Jump-In overrides both for the frame you inhabit.

**Hardware gate (¥ side):**
- **Remote Box / Basic RCC** — one drone, remote only, no Jump-In (Street/Professional band). An RCC is a **Connect** interface (≡ deck; see `21-the-wire.md`).
- **Fleet Deck and above** — multi-drone command, Jump-In when paired with a control-rig (chrome), autosoft headroom — see Gear master Cat **4D**. Non-Wrench heroes **cannot** use Fleet Deck+ features even if they own the hardware (class firewall). **Rigger’s Harness** is also a Connect interface; Fabricator’s Bench and Field Chassis are not.

**Pack drones and vehicles.** Ghostwire Summons drone and vehicle band templates (all nine `machine-*` Actors) and other `kind: "vehicle"` pack Actors (Nox’s trash freighter) ship with **Wire Kit — Matrix Verbs** so they can Connect without a commlink. They still start **Disconnected** until Connect. Full interface list: `21-the-wire.md`.

---

### Anyone vs Wrench

#### Non-Wrench (any other class)

| Rule | Detail |
|---|---|
| **Active drones** | **Max 1** active at a time — **even a Street clunker counts as that one non-Wrench drone** |
| **Jump-In** | **Forbidden** |
| **RCC fleet features** | **Cannot** use Fleet Deck / War Table / Command Rig / Hydra swarm features (even if purchased — they sit inert or Director may allow Remote-Box behavior only) |
| **Rolls** | **Bane** on all **Rigging** and **Gunnery-through-drone** Power Rolls |
| **Uptime / bandwidth** | No Uptime pool. **Street Eye** (Companion Link) lasts **one scene** (or until Integrity 0 / jam / Director cut), then the drone drops to standby and needs a short reset (≈ 10 minutes / between scenes) |
| **Integrity buffer** | Soft buffer only: **+2 temporary Integrity** while the link is live (does not stack with Jump-In buffers; lost when the link drops) |
| **Actions** | **Soft actions only** by default: Move, Observe/Mark (sensor), Carry/Drop (if cargo-capable), Stabilize assist (Medic-grade chassis only), simple Interact. **Weapon mounts:** may fire **Street / Professional** soft/nonlethal or light personal mounts only; **Restricted+ combat hardpoints** require a Wrench or stay locked |
| **Autosofts** | May run **one** basic Pilot/Sensor autosoft if the chassis has a free slot — no swarm / Focus Fire / Override packages |
| **Heroic resource** | Cannot spend Uptime; cannot use Wrench Deploy & Command / Focus Fire / subclass swarm features |

**Intent:** a Scout's eye-in-the-sky or a Medic's trauma mule is supported; a second Operator does not become a discount Wrench. Buying a taped-together junk mote still burns the one-drone slot.

#### Wrench

| Rule | Align to `16-wrench.md` (do not invent parallel names) |
|---|---|
| **Fleet** | Field multiple machines up to **Fleet Size** cap (baseline 3 @ L1 → 6 @ L10; Drone Jockey raises further) |
| **Resource** | **Uptime** — banked from fielded presence / deploy / maintenance / salvage; drained by body damage, asset hits, jamming, destruction; spent on Deploy, Command, Override, burst-buffs |
| **Jump-In** | Full Jump-In Plumbing (maneuver; inert body; biofeedback; temporary Integrity buffer per Wrench chapter) |
| **Gunnery** | Full **Gunnery** / Rigged Fire through drones and mounts |
| **RCC / autosofts** | Full use of owned RCC ladder + autosoft slots |
| **Overheat** | **Not a separate resource.** Wrench pressure comes from **Uptime drain** (`16-wrench.md`). “Overheat pressure” on high-end RCCs is narrative only. |

**Firewall reminder:** ¥ buys frames, mods, RCCs. Uptime runs the fight. Chrome (e.g. control rig) can improve Jump-In / efficiency; chrome never generates Uptime; ¥ never buys Uptime.

### Street Eye (Companion Link)

**Street Eye** is the player-facing name of the Companion Link. Any class can use it. It does **not** replace Wrench **Deploy & Command**, Uptime, Jump-In, or Fleet Deck+ features — those stay in `16-wrench.md`. A Wrench who also owns a scout drone may see Street Eye on the sheet as a redundant soft leash; the Wrench toolkit is unchanged.

**Qualify (v1 — flying scouts):** you have Street Eye while you carry at least one **qualifying scout drone** — a Personal or Light **Air** frame tagged **Recon**, or scout-equivalent **Mark** / **Decoy**. Published v1 frames: **Tape-Eye**, **Fly**, **Needle**, **Buzz**, **Rustbucket**, **Rotor**, **Spotter**, **Phantom**. Ground and Water recon wait for a later pass. Combat, sentry, and gun frames do not qualify unless they carry a Recon (or Mark / Decoy) tag.

The Companion Link **limits** in the Non-Wrench table still apply if you field a drone that is not on that v1 list (Director-ruled). Foundry only auto-grants the Street Eye ability for qualifying air scouts.

> **Street Eye**
> *Companion Link · Maneuver · Range 10*
> Target: 1 qualifying scout drone you own (stowed or already fielded)
> **Power Roll** — none to deploy or issue a soft order; **2d10 + Logic** (Rigging applies; non-Wrench: **bane**) only if the Director calls for a contested read, mark, or jammed link
>
> Soft orders (pick one when you use this maneuver): **follow**, **watch**, **hold**, **scout**, **surveillance**, or **minor support** (spot/mark, watch a corner, light carry if the chassis can).
>
> *You wake a carried scout on a soft leash, or tell one already in the air what to do. This is not a gun platform and not Jump-In. Max one drone active. The link lasts about one scene, then the drone standbys (≈ 10 minutes / between scenes to reset). You may run one basic Pilot or Sensor program. Soft buffer: +2 temporary Integrity while the link is live (does not stack with Jump-In buffers).*

> **In Foundry**
> Drop a qualifying scout drone (Rotor, Tape-Eye, Fly, Spotter, …) from **Ghostwire Vehicles & Drones** onto a hero. **Street Eye** appears under Abilities. Remove the last qualifying drone and Street Eye leaves the sheet. A Wrench keeps **Deploy & Command**. Right-click the drone row → **Deploy** / **Recall** to put the token on the map — Street Eye is the leash and orders card, not a second Deploy system.

---

### Scale bands (drones)

| Scale | Plain meaning | Examples |
|---|---|---|
| **Personal** | Palm to torso; stows in a pack or on a harness; fits vents / crowds | Micro-spies, taser-bees, anthro infiltrators |
| **Light** | Dog to motorcycle; carried awkwardly or rolled; corridor-viable | Quads, crawlers, med/repair bots, sentry dogs |
| **Vehicle (drone)** | No crew seats, but chassis mass of a small vehicle; hardpoints + real armor possible | Gun-drones, cargo mules, heavy assault frames |

**Vehicle (drone)** entries stay in the drone inventory so fleet play stays on one list; **crewed** platforms are under Vehicles below.

**Domain:** Air (drone) / Ground (drone) / Water (drone). Domain gates terrain and chase language; it does not replace Scale.

**Chassis → mod slots (doctrine):** slots climb with Availability / Echelon (same shape as Gear master). Micro/Street ≈ 1; Professional ≈ 2; Restricted ≈ 3; Military ≈ 4; Prototype ≈ 5. A chassis cannot exceed its published slot count — buy a bigger frame for more capacity. **Clunkers** sit at Street ¥ / **1 slot** even when the scale looks Light — inefficient frames waste capacity.

---

### Full drone inventory

**Reading the tables:** prices climb with Availability + Echelon. Integrity / Speed / Armor numbers are not yet published — profiles are qualitative.

#### Echelon shopping guidance

Shop the **subsection for your band first**. E1 Street clunkers are intentionally bad deals that still work — perfect for new crews, disposable scouts, and non-Wrench “one eye in the sky” (those air scouts grant **Street Eye**). Professional E1 cleans up reliability without leaving the band. E2 Restricted is the support/sentry/EW sweet spot. E3 Military brings hard mounts, Jump-In-Capable combat frames, and breach tools. E4 Prototype is apex kit: elite recon, courier, medic, EW, and heavy combat — not only siege walkers. Directors: if a hero's Echelon is N, prefer offering at least one buyable frame from that subsection (and never empty a band).

**Clunker / Unreliable (Director cue):** once per scene when it matters, impose an extra **bane** on a Rigging/Gunnery roll **or** stall the frame for a beat (misses a Move, drops a package, camera blacks out). Do not punish every action — make the junk feel lived-in.

#### Inventory by Echelon

##### Echelon 1 — Street / Professional (clunkers + starter frames)

| Name (slang / corp / sci) | Domain | Scale | Availability | Cost ¥ | Mod slots | Profile | Tags |
|---|---|---|---|---|---|---|---|
| Tape-Eye / Junk-Mote / taped-together spy mote | Air (drone) | Personal | Street | 80 | 1 | Phone-cam on scavenged fans; dies if you sneeze wrong. | Recon, Clunker, Unreliable, Expendable, Wired |
| Sink-Floater / Wet-Junk / leaking wet scout | Water (drone) | Personal | Street | 180 | 1 | Sealed with epoxy and prayer; floats, sometimes submerges. | Aquatic, Recon, Clunker, Unreliable, Wired |
| Junkbug / Scrap-Crawler / taped crawler | Ground (drone) | Personal | Street | 120 | 1 | Mismatched legs, magnet scrap, cable-tray vermin. | Recon, Climb, Clunker, Unreliable, Wired |
| Rustbucket / Rusted Quad / scrap aerial | Air (drone) | Light | Street | 250 | 1 | Bent arms, patched batteries; loud and proud to stay aloft. | Recon, Clunker, Unreliable, Wired |
| Sputter-Sled / Cargo Clunker / sputtering cargo sled | Ground (drone) | Light | Street | 350 | 1 | Hauls a duffel until the motor coughs; corridor blocker on a good day. | Cargo, Clunker, Unreliable, Wired |
| Rattlebox / Scrap-Sentry / junk perimeter walker | Ground (drone) | Light | Street | 400 | 1 | Motion chirp + flashlight mount; panics at shadows. | Sentry, Clunker, Unreliable, Wired |
| Fly / Micro-Drone / insect-scale recon mote | Air (drone) | Personal | Street | 200 | 1 | Palm spy — vents, perches, live video relay. | Recon, Expendable, Wired |
| Skitter / Vent-Rat / crawl-mote chassis | Ground (drone) | Personal | Street | 280 | 1 | Magnetic belly + whisker cams; lives in cable trays. | Recon, Climb, Wired |
| Needle / Pin-Eye / kamikaze microframe | Air (drone) | Personal | Street | 350 | 1 | One-shot buzz or bang; cheap swarm filler. | Recon, Kamikaze, Expendable, Wired |
| Buzz / Ad-Moth / decoy holomote | Air (drone) | Personal | Street | 400 | 1 | Throws false AR / heat chirps; dies if shot. | EW, Decoy, Wired |
| Taser-Bee / Shock-Mote / contact stunner | Air (drone) | Personal | Professional | 750 | 2 | Close shock payload; soft takedown favorite. | Nonlethal, Swarm, Wired |
| Crawler / Recon Drone / quadruped sensor unit | Ground (drone) | Light | Professional | 800 | 2 | Climbs, maps, plants taps — forward sensor for Scout/Hacker. | Recon, Climb, Wired |
| Rotor / Quad-Drone / aerial recon quadcopter | Air (drone) | Light | Professional | 900 | 2 | Default eye-in-the-sky; overwatch, cheap swarm body. | Recon, Swarm, Wired |
| Spotter / Mark-Eye / designator quad | Air (drone) | Light | Professional | 1,100 | 2 | Paints targets for crew fire; poor brawler. | Recon, Mark, Wired |
| Mule-Bot / Cargo Drone / autonomous hauler | Ground (drone) | Vehicle (drone) | Professional | 1,100 | 2 | Hauls kits, extracts wounded, blocks a corridor. | Cargo, Cover, Wired |

**E1 count:** **15** chassis (6 Clunker / Junk + 9 cleaner Street/Professional). Roles: recon, EW/decoy, nonlethal, cargo, sentry, aquatic.

##### Echelon 2 — Restricted (support / denial / specialist)

| Name (slang / corp / sci) | Domain | Scale | Availability | Cost ¥ | Mod slots | Profile | Tags |
|---|---|---|---|---|---|---|---|
| Netcaster / Snare-Drone / capture frame | Ground (drone) | Light | Restricted | 2,800 | 3 | Foam / monofil net — take alive, not apart. | Nonlethal, Capture, Wired |
| Wrenchbot / Repair Drone / field maintenance unit | Ground (drone) | Light | Restricted | 3,000 | 3 | Mobile toolkit — feeds Field Repair / rearm loops. | Repair, Support, Wired |
| Guard-Dog / Patrol Drone / autonomous sentry | Ground (drone) | Light | Restricted | 3,200 | 3 | Perimeter walk: light mount, motion net, area denial. | Sentry, Mount, Wired |
| Medbot / Trauma Drone / field-medic unit | Ground (drone) | Light | Restricted | 3,500 | 3 | Runs a stabilize package to a downed ally under fire. | Medic, Support, Wired |
| Choir-Box / Spoof-Drone / local EW kite | Air (drone) | Light | Restricted | 3,600 | 3 | Jam / spoof bubble for a room or alley mouth. | EW, Wired |
| Nest / Hardpoint Sentry / deployable turret-drone | Ground (drone) | Light | Restricted | 3,800 | 3 | Drops, braces, becomes a temporary autogun nest. | Sentry, Mount, Wired |
| Barracuda / Aquadrone / submersible saboteur | Water (drone) | Light | Restricted | 4,000 | 3 | Silent wet recon; plants charges on hulls and intakes. | Aquatic, Sabotage, Wired |
| Ghost-Courier / Shade-Mule / low-obs cargo kite | Air (drone) | Light | Restricted | 4,500 | 3 | Quiet package runner between Flats shafts and Grid roofs. | Cargo, Stealth, Wired |

**E2 count:** **8** chassis. Roles: repair, medic, sentry, EW, cargo/stealth, aquatic sabotage, nonlethal capture.

##### Echelon 3 — Military (hard mounts / Jump-In combat)

| Name (slang / corp / sci) | Domain | Scale | Availability | Cost ¥ | Mod slots | Profile | Tags |
|---|---|---|---|---|---|---|---|
| Ripper / Breach-Drone / door-cracker | Ground (drone) | Light | Military | 11,000 | 4 | Charges, cutters, or shaped punch for hard portals. | Breach, Assault, Wired |
| Pallbearer / Extraction Hauler / armored mule | Ground (drone) | Vehicle (drone) | Military | 12,000 | 4 | Armored cargo bay for downed runners; light defensive mount. | Cargo, Armor, Medic, Wired |
| Stinger / Gun-Drone / aerial weapons platform | Air (drone) | Vehicle (drone) | Military | 13,000 | 4 | Real hardpoint gunner — fleet's flying damage dealer. | Combat, Mount, Jump-In-Capable, Wired |
| Skulker / Anthro-Drone / humanoid infiltrator | Ground (drone) | Personal | Military | 14,000 | 4 | Passes as a body at distance; tools or a sidearm mount. | Anthro, Infiltrate, Jump-In-Capable, Wired |
| Hellkite / Strafe-Wing / gunship microframe | Air (drone) | Vehicle (drone) | Military | 15,500 | 4 | Twin light mounts, dive strafe; loud and hated in the Grid. | Combat, Mount, Jump-In-Capable, Wired |
| Deep-Viper / Hunter Aquadron / wet hunter | Water (drone) | Vehicle (drone) | Military | 16,000 | 4 | Deeper hull, torpedo/spear mount, chase boats from below. | Aquatic, Combat, Jump-In-Capable, Wired |

**E3 count:** **6** chassis. Roles: breach, extract/medic, aerial combat, anthro infiltrate, aquatic combat.

##### Echelon 4 — Prototype (elite specialists + apex combat)

| Name (slang / corp / sci) | Domain | Scale | Availability | Cost ¥ | Mod slots | Profile | Tags |
|---|---|---|---|---|---|---|---|
| Phantom / Glass-Eye / elite recon kite | Air (drone) | Light | Prototype | 28,000 | 5 | Near-silent sensor apex; paints through smoke and spoof. | Recon, Stealth, Mark, Jump-In-Capable, Wired |
| Whisper-Run / Black-Courier / elite stealth courier | Air (drone) | Light | Prototype | 32,000 | 5 | Ghost-lane package runner; low-obs hull, sealed bay. | Cargo, Stealth, Jump-In-Capable, Wired |
| Lifeline / Apex-Medic / elite extract frame | Ground (drone) | Vehicle (drone) | Prototype | 35,000 | 5 | Armored trauma bay + stabilize suite; pulls bodies out loud zones. | Medic, Armor, Cargo, Jump-In-Capable, Wired |
| Choir-King / Fog-Crown / EW apex kite | Air (drone) | Light | Prototype | 38,000 | 5 | Block-scale jam / spoof crown; eats cheap sensors for lunch. | EW, Jump-In-Capable, Wired |
| Warhound / Combat Drone / heavy assault unit | Ground (drone) | Vehicle (drone) | Prototype | 40,000 | 5 | Apex walker/roller — heavy mounts, real armor, one-machine push. | Combat, Heavy, Jump-In-Capable, Wired |
| Razorwing / Blade-Falcon / elite strike wing | Air (drone) | Vehicle (drone) | Prototype | 42,000 | 5 | Precision hardpoint predator — quieter than Hellkite, meaner than Stinger. | Combat, Mount, Stealth, Jump-In-Capable, Wired |
| Iron Mantis / Siege-Frame / heavy assault walker-drone | Ground (drone) | Vehicle (drone) | Prototype | 45,000 | 5 | Limb-climber siege body; dual hardpoints; corridor nightmare. | Combat, Heavy, Climb, Jump-In-Capable, Wired |

**E4 count:** **7** chassis. Roles: elite recon, elite courier, elite medic/extract, EW apex, heavy combat ×2, elite aerial strike.

**Published total:** **36** chassis (15 + 8 + 6 + 7).

#### Role quick-index

| Role | Chassis |
|---|---|
| Clunker / Junk (E1) | Tape-Eye, Sink-Floater, Junkbug, Rustbucket, Sputter-Sled, Rattlebox |
| Recon / spy | Tape-Eye, Sink-Floater, Junkbug, Rustbucket, Fly, Skitter, Needle, Rotor, Crawler, Spotter, Phantom |
| EW / decoy | Buzz, Choir-Box, Choir-King |
| Nonlethal / capture | Taser-Bee, Netcaster |
| Cargo / extract | Sputter-Sled, Mule-Bot, Ghost-Courier, Pallbearer, Whisper-Run, Lifeline |
| Medic / repair | Medbot, Wrenchbot, Pallbearer, Lifeline |
| Sentry | Rattlebox, Guard-Dog, Nest |
| Aquatic | Sink-Floater, Barracuda, Deep-Viper |
| Breach / assault support | Ripper |
| Combat / gun | Stinger, Hellkite, Warhound, Razorwing, Iron Mantis |
| Anthro | Skulker |

#### Availability and Echelon

| Availability | Typical Echelon |
|---|---|
| Street | 1 |
| Professional | 1 |
| Restricted | 2 |
| Military | 3 |
| Prototype | 4 |

---

### Integrity, destruction, recovery

Drones use a short **Integrity** track (numbers not yet published). For now, Directors may treat Street/Professional frames as fragile (a few solid hits) and Military/Prototype as sturdy. **Clunkers** are especially fragile — treat as one solid hit from serious fire unless the Director is feeling generous.

| Event | Effect |
|---|---|
| **Hit while fielded** | Integrity damage; Wrench loses **1 Uptime** per hit (per `16-wrench.md`). Non-Wrench: no Uptime, but link jitter — Director may impose a bane next Remote action |
| **0 Integrity** | **Wrecked** — offline, not vaporized. Wrench lump **3 Uptime** drain. Salvage Sense / salvage maneuver still apply for Wrenches |
| **Recovery** | Field Repair (Wrench signature / Repair skill) restores Integrity in the fight per class text. Between scenes: §Craft **Repair** Project or short bench time + ¥ parts (Director: ≈ 10–25% of chassis cost for a heavy rebuild; clunkers are cheap to patch and cheap to write off) |
| **Total loss** | If the wreck is seized, burned, or dropped into the Sinks, the ¥ is gone — buy or craft another |
| **Non-Wrench scene end** | Street Eye / Companion Link drops; drone standbys. Wrecked drones still need Repair / ¥ |

**Expendable tags (Needle, Buzz, Tape-Eye, etc.):** some Street micros are meant to die — Kamikaze / Decoy / Clunker runs destroy the chassis by design (see Drone Jockey abilities).

---

### Modding

- Published **vehicle/drone mods** live in Gear master **§5F** (Gun Rack, Plate-Up, Tune Kit, Sensor Pod, Ghost Coat, Runflats, Rigger Cocoon, Ammo Bin, …).
- Install / swap / remove = downtime **§Craft Project**; skill = **Repair** (physical) or **Electronics** (sensor/EW suites). Autosofts / RCC programs use **Hacking** (`10-mods.md`).
- **Invent a Mod (v1)** applies — pitch, firewall check, Echelon gate, materials ¥, Project Power Roll.
- Slot integrity: do not publish orphan slot counts without a mod family. Rigger Cocoon upgrades Jump-In cleanliness on capable frames — it does **not** grant Jump-In to non-Wrenches.
- Clunkers with **1 slot** rarely take serious kits — Directors should lean into jury-rig narrative rather than full §5F menus.

---

## Vehicles

### Street picture (vehicles & transit)

**Lock (Michael 2026-09-20).** World texture, not a second chase engine. Full prose: Setting Primer **Vehicles & Transit** (L1). Procedures in this chapter stay as printed.

- Most vehicles in this world are **electric**.
- **Street / POV** (personally owned vehicles): mostly **light electric hovercraft** with **altitude limiters ~25–50 feet** off the ground — **not** free-flight sky cars.
- **Ground vehicles** (tires / treads) still exist but are **almost always heavy lifters, haulers, and big equipment** — not everyday street cars.
- **VTOL / flying craft** are **more expensive** but also in **common use** (corp, transit, well-funded runners).

**Street-class tags:** **Hover** = limiter-band POV (**Lane-Hopper** 4-seat table-token; **Star-Chopper** tandem hover-bike; Hoverpad; many Ground-domain sedan/cab/bike SKUs still hug the street deck for chase). **Ground-hauler** = tires / treads / walker mass. **VTOL** = free-climb flying. Water and space stay as printed.

**Lane-Hopper** is the published 4-seat street hovercar yes-example (E1 Street, Domain Ground, four seats, limiter **~25–50 ft**). Open/closed cabins exist; the shipped token is the open top-down plate. **Rideable** passenger slots are a future pass — do not implement now.

**Star-Chopper** is the published tandem hover-bike (E1 Street/custom, Domain Ground, Scale Light, 1+pillion, limiter **~25–50 ft**, stretch forks, no wheels). Not a sky bike and not the rifle named Chopper.

**Bulldog** is the street cargo van (E1 Street, Domain Ground, **Ground-hauler**, tires — not a hover POV). Token art is a placeholder until Michael’s plate.

> **In Foundry**
> Enable **Draw Steel - Ghostwire Build**. Lore page: **Ghostwire Lore** › Setting Primer › Vehicles & Transit. Chassis: **Ghostwire Vehicles & Drones** (Item **Lane-Hopper**, Item **Star-Chopper**, Item **Bulldog**). Placeable tokens: **Ghostwire Summons & Machines** › Lane-Hopper (**2×3**), Star-Chopper (**1×3**), and Bulldog (**2×4**, placeholder art). Reach texture: **Ghostwire — Ossian Reach Handbook** › Life on the Flats.

### Scale bands (crewed vehicles)

| Scale | Plain meaning | Examples |
|---|---|---|
| **Light** | Hover-bike, small rotor, open skiff — one or two bodies, exposed or cramped | Star-Chopper, junk rotor, harbor skiff |
| **Vehicle** | Street hover / hauler van / light aircraft / patrol boat mass — crew seats and real cover | Lane-Hopper, Getaway hover, panel hauler, tiltjet, wetsub, orbital pod |
| **Heavy** | APC / gunship / attack sub / heavy shuttle — squad carriage or serious armor | Brick APC, Skyhunter, Leviathan, orbital mule |
| **Capital** | Warship / mobile base — campaign asset, multi-station crew | Reaver corvette |

**Vs drone Scale (`15-drones.md`):** drones use **Personal / Light / Vehicle (drone)**. A Vehicle-scale **drone** (Stinger, Warhound, etc.) remains on the **drone** inventory so swarm/fleet play stays one list. This chapter is **crewed** platforms — seats, stations, passengers — even when a Wrench Jump-In runs the shell solo.

**Domain:** Ground / Air / Water / Space. Domain gates terrain, chase language, and wreck consequences; it does not replace Scale.

**Chassis → mod slots (doctrine):** slots climb with Availability / Echelon (same shape as Gear master Cat 5A–5D). Street ≈ 1; Professional ≈ 2; Restricted ≈ 3; Military ≈ 4; Prototype ≈ 5. A chassis cannot exceed its published slot count — buy a bigger frame (or Invent a Mod + Director gate) for more capacity.

---

### Stat card fields

Align to the Vehicle Stat Card in `16-wrench.md`. Profiles here are **qualitative**; Integrity / Speed / Armor numbers are not yet published.

| Field | Description |
|---|---|
| **Name / Frame** | Ghostwire slang / corp / sci triple (original names only) |
| **Scale** | Light / Vehicle / Heavy / Capital |
| **Domain** | Ground / Air / Water / Space |
| **Handling** | Edge / bane / die-step feel on Piloting or Rigging to drive or stunt |
| **Integrity** | Damage track (numbers not yet published). 0 = wrecked — domain catastrophe (crash, downing, flood, decompress) |
| **Armor** | Flat damage reduction feel; stacks defensively with Scale |
| **Crew stations** | Pilot/Driver, Gunner, Systems/EW, Passenger counts (see §6) |
| **Speed band** | Slow / Standard / Fast / Extreme — maps to positional move or chase-track advance |
| **Jump-In Capable?** | Yes / No — whether a Wrench may Jump-In cleanly (Rigger Cocoon can upgrade a No → Yes) |
| **Mod slots** | Per Availability/Echelon (published count) |
| **Availability** | Street → Prototype |
| **Echelon** | 1–4 |
| **Cost ¥** | Object price; never buys class power |

**Mounted weapons** come from Category 3; installs are §Craft Projects (`10-mods.md`). Hardpoints usually need a **Gun Rack** mod (§5F) unless the profile already includes a factory mount.

---

### Anyone vs Wrench / Rig-Pilot excellence

#### Non-Wrench (any other class)

| Rule | Detail |
|---|---|
| **Vehicles in play** | May **drive/pilot one** vehicle at a time using **Piloting** (or a Director-approved Drive fantasy equivalent) |
| **Jump-In** | **Forbidden** — no sensor merge, no inert-body Jump-In, no temporary Jump-In Integrity buffer |
| **RCC / fleet-vehicle features** | **Cannot** use advanced RCC fleet-vehicle features (Fleet Deck+ vehicle orchestration, multi-platform Command, War Table / Hydra-style vehicle swarm tools) even if the hardware is owned — inert or Remote-Box-equivalent at Director discretion |
| **Risky chase / combat Piloting** | **Bane** on risky chase stunts, combat Piloting, and evasive driving Power Rolls **if not trained** in Piloting (untrained driver can still putter in traffic) |
| **Gunnery from mounts** | Passengers/gunners may fire personal weapons and Street/Professional soft mounts; **Restricted+ combat hardpoints** prefer a trained Gunner or a Wrench — Director may allow with bane |
| **Uptime** | No Uptime pool; no Deploy & Command / Rigged Fire vehicle spend |
| **Heroic resource** | Cannot spend Uptime; cannot use Vehicle Rig-Pilot signature Jump-In discounts |

**Intent:** an Operator can steal a street hover and run a chase; a Scout can fly a buzzcopter on a quiet insertion. Neither becomes a discount Vehicle Rig-Pilot.

#### Wrench

| Rule | Align to `16-wrench.md` (do not invent parallel names) |
|---|---|
| **Jump-In** | Full Jump-In Plumbing into **Jump-In Capable** vehicles (maneuver; Logic or Reflex; inert body; biofeedback; temporary Integrity buffer per Wrench chapter) |
| **Rigging / Piloting** | Full excellence — Rigging and/or Piloting as class/subclass grants; no untrained bane on combat stunts |
| **Solo / Jumped-In** | While Jumped-In, act as **pilot and gunner** simultaneously through the control rig (Vehicle Rig-Pilot default mode) |
| **Uptime** | Asset hits / wrecks drain Uptime per Wrench chapter; Field Repair / Deploy interactions unchanged |
| **RCC** | Full use of owned RCC ladder for vehicle-linked command where the Wrench chapter already allows it |
| **Subclass** | **Vehicle Rig-Pilot** — signature platform, One With the Machine discounts, Ram Speed / Redline ladders — as printed in `16-wrench.md` |

**Firewall reminder:** ¥ buys frames and mods. Uptime runs the fight. Chrome (control rig) improves Jump-In / efficiency; chrome never generates Uptime; ¥ never buys Uptime.

**Rigger Cocoon (§5F):** upgrades a frame to accept Jump-In cleanly. It does **not** grant Jump-In to non-Wrenches.

---

### Customize & modding

- Published **vehicle/drone mods** live in Gear master **§5F** (Gun Rack, Plate-Up, Tune Kit, Sensor Pod, Ghost Coat, Runflats, Rigger Cocoon, Ammo Bin, …).
- Install / swap / remove = downtime **§Craft Project**; skill = **Repair** (physical / armor / suspension) or **Electronics** (sensor / EW / cocoon suites). Autosofts / RCC programs use **Hacking** (`10-mods.md`).
- **Invent a Mod (v1)** applies — pitch, firewall check, Echelon gate, materials ¥, Project Power Roll.
- Slot integrity: do not publish orphan slot counts without a mod family. Mounted Category-3 weapons need a hardpoint (factory or Gun Rack).

---

### Vehicle combat / chase

**Chosen lean system for this chapter:** **abstract range bands** (cinematic pursuits and most vehicle fights). When vehicles share a tactical map with foot combat, Directors may instead use **positional** mode as already sketched in `16-wrench.md` — same skills, same wreck language.

#### Abstract range track

```
Broken off ← Extreme → Long → Medium → Close → Ramming / Boarding
```

- Each round, the **pilot** makes an opposed **Piloting** or **Rigging** Power Roll (Handling modifies) against the lead pursuer / quarry.
- **Middle / High:** advance one band toward your goal (close the gap or open it).
- **Low:** stall or lose a band (Director: traffic, wake, lane crosswind, dock clutter).
- **Weapons** work at their effective range band (personal small arms struggle past Medium; vehicle mounts and Gunnery shine at Long/Medium).
- **Close / Ramming:** enables boarding attempts, ramming (§6.2), and passenger melee through doors/hatches.
- **Broken off:** chase ends (escape or lost contact).

**Positional (optional):** vehicles move on the same map/zones as foot combat at vehicle Speed and Scale, sharing terrain and cover. Cross-scale edge/bane per `16-wrench.md`.

#### Crash, wreck, ram

| Event | Effect |
|---|---|
| **Hit while underway** | Integrity damage; Wrench loses **1 Uptime** per hit if the vehicle is their fielded asset. Non-Wrench: no Uptime; Director may impose a bane on the next risky Piloting action |
| **0 Integrity** | **Wrecked** — domain catastrophe (ground crash, air downing, hull flood, decompress). Occupants take a Personal-scale crash hit and must escape. Wrench: lump **3 Uptime** drain |
| **Ram** | Opposed Piloting/Rigging. Damage basis = **Scale + Speed band** (heavier/faster party takes less). On success, force a band shift and/or apply **Crippled** / Integrity loss. Full numeric multipliers deferred |
| **Recovery** | Field Repair (Wrench) in the fight per class text. Between scenes: §Craft **Repair** Project + ¥ parts (Director: ≈ 10–25% of chassis cost for a heavy rebuild) |
| **Total loss** | Seized, burned, sunk, or dropped into the Sinks — the ¥ is gone |

**Conditions (reskin):** **Crippled** (Handling/Speed penalty), **Systems Down** (a station offline), **On Fire/Leaking** (ongoing), **Stalled/Dead-stick** (immobilized). Called shots inflict conditions instead of raw Integrity.

#### Crew roles

| Station | Does |
|---|---|
| **Pilot / Driver** | Moves the vehicle; only the pilot advances the chase track or positional Speed. Evasive driving = defensive edge. Stunts = risky Piloting/Rigging |
| **Gunner** | Fires mounted weapons with **Gunnery** on their turn |
| **Systems / Sensors / EW** | Locks, terrain reads, jams — feed an edge to pilot/gunner or a bane to a foe |
| **Passenger** | Acts normally at a speed bane (shoot out a window, hack, reload); uses the hull as cover |
| **Solo / Jumped-In (Wrench)** | Pilot **and** gunner simultaneously via control rig |

---

### Full inventory by Echelon

**Reading the table:** prices climb with Availability + Echelon. Integrity / Speed / Armor numbers are not yet published — profiles are qualitative. **Clunker** = inefficient, unreliable, but usable (E1 junk / beaters).

#### Inventory (35 crewed platforms)

| Name (slang / corp / sci) | Domain | Scale | Echelon | Availability | Cost ¥ | Mod slots | Crew (feel) | Speed | Jump-In? | Profile | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Clunker / Junk Hauler / scrapyard beater van | Ground | Vehicle | 1 | Street | 150 | 1 | 1 driver + 3–4 cramped | Slow | No | Smokes, stalls, still moves a crew and a crate. | Clunker, Cargo, Beater, Ground-hauler |
| Scrap-Bike / Yard Cycle / salvage courier bike | Ground | Light | 1 | Street | 180 | 1 | 1 (+pillion) | Fast | No | Bald tires, loud chain — weaves when it doesn't die. | Clunker, Courier, Beater, Hover |
| Rustbucket / City Runabout / urban commuter EV | Ground | Vehicle | 1 | Street | 250 | 1 | 1+3 | Standard | No | Disposable get-around. Low Handling, no mounts. | Clunker, Beater, Hover |
| Lane-Hopper / Open Stripe / four-seat street hovercar | Ground | Vehicle | 1 | Street | 500 | 1 | 1+3 | Standard | No | Everyday POV archetype — electric hover, limiter ~25–50 ft, four seats. Open cabin is the table token; closed cabins exist. | Transit, Crew-car, Hover, POV |
| Star-Chopper / Long-Fork / tandem limiter hover-bike | Ground | Light | 1 | Street | 700 | 1 | 1+pillion | Fast | No | Street POV hover-bike — electric stretch-fork chopper, two seats, no wheels, limiter ~25–50 ft. Not the rifle named Chopper. | Courier, Hover, POV |
| Bulldog / Heavy Hauler / street cargo van | Ground | Vehicle | 1 | Street | 650 | 1 | 1+2 (cab) + cargo | Slow | No | Tires-on-deck cargo van — mass, not a hover POV. | Cargo, Ground-hauler |
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

**Count:** **35** published crewed platforms.

#### Role quick-index

| Role | Chassis |
|---|---|
| Clunker / beater | Clunker, Scrap-Bike, Rustbucket, Sink-Skiff, Junk Rotor |
| Courier / bike | Scrap-Bike, Star-Chopper, Crotch-Rocket, Warbike |
| Crew-car / transit | Lane-Hopper, Getaway, Grey Cab, Hoverpad, Pod, Void-Runner |
| Cargo / workshop | Clunker, Bulldog, Workhorse, Flatbed |
| Armor / extraction / troop | Hardtop, Brick, Cage |
| Air recon / insertion | Buzzcopter, Junk Rotor, Tiltjet, Drop-Sled, Ghost-Wing |
| Gunship / combat air | Skyhunter |
| Water transit / patrol | Skiff, Sink-Skiff, Harbor Cutter |
| Water pursuit / attack | Cigarette, River-Fang, Leviathan |
| Wet infiltrate | Wetsub |
| Walker / siege ground | Iron Giant, Spider-Frame |
| Space / sealed | Pod, Mule, Void-Runner, Reaver |

#### Availability and Echelon

| Availability | Typical Echelon |
|---|---|
| Street | 1 |
| Professional | 1 |
| Restricted | 2 |
| Military | 3 |
| Prototype | 4 |

---

## Buildings

Buildings are a Wrench system: the **Building Stat Card**, upgrade slots, Node reference, and downtime fabrication are in `16-wrench.md` (The Machines). No shared building inventory is published yet.

## Hands Off Accords (setting law)

Fiction lock (L5): software AI is legal; **direct AI control of kinetic hardware** without a licensed mortal in the loop is restricted. Jump-In, RCC, and rigger bonds are the legal bridge. Directors may apply IRN/MER heat when a table breaches Hands Off. Escalation toward Nullward "super-bot" crises is optional campaign fuel — not default starting state.

> **In Foundry**
> No separate Hands Off automation yet. Use Machine/Wrench rules as printed; treat Accords as lifestyle/Trace/opposition pressure.

