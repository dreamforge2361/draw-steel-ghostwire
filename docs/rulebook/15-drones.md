# Ghostwire Core Rulebook — Chapter: Drones

**Status:** Stage 3 draft for Michael review — 2026-09-16 (ET)  
**Pairs with:** `05-wrench.md` (Uptime / Jump-In / Machines), `14-mods.md`, `11-economy.md`, Gear master Cat **4D / 5E / 5F**  
**Foundry:** dual Item + Actor. **Treasure** SKUs in **Ghostwire Vehicles & Drones** are intentional (ownership / ¥ / mods / echelon). **Deploy** stamps a linked Actor from the matching Summons band template and places the token; **Recall** deletes the Actor, Item stays. **Mule-Bot** (`drone: true`, Ground, Scale Vehicle) → `machine-drone-medium`. A named Mule-Bot Actor is optional Director placement, not a replacement for the treasure SKU.  
**Lore notes:** `docs/masters/_drone_lore_extract.md`

**Design locks (do not reopen in this draft):**
- Stock Draw Steel + Ghostwire module; hero Levels **1–10**, Echelon **1–4**
- **No Item Tier T5–T1 in player text** — use **Echelon + Availability** (Street → Prototype)
- **¥** buys objects; firewall: no attributes / skills / class power from ¥
- Kit doctrine never costs ¥
- **§Craft** = downtime Project procedure; **Repair / Electronics / Hacking / Rigging** as skills
- Art: Reach-native cyberpunk-fantasy (rain, neon, vertical hive)
- **Wrench** is the master drone handler; **anyone can run ONE drone** but is **greatly penalized** vs Wrench
- Cat **5E** is the starting spine — expanded below
- **Echelon coverage rule:** Each of Echelons **1–4** must offer **at least 5 chassis**, spanning **at least 3 roles** (e.g. recon, support, combat-ish). **E1** must include explicit **Clunker / Junk** tags — cheap, unreliable, inefficient, but usable. Higher echelons get cleaner, louder, more capable frames. Players should always have something to buy at their band.

---

## 1. Lore frame — drones in The Reach

Ossian Reach never gives you empty sky. Between the choked streets and the stacked VTOL lanes sits a third weather: **drones** — delivery quads, Sanctum eyes, ad-motes, repair-skitters on wet girders, Kestrel couriers on clean routes, and Nyx runners going dark between the lanes. The Grid watches you with a blanket; the Flats watch you in packs; the Sinks go blind and that blindness kills differently.

On the **Wired**, every drone is a node. Hackers break into other people's systems. **Wrenches own and run** their own machines. A lost drone is a nuyen hole, not a funeral — which is exactly why crews field them. Street chop-shops fence frames; Glass Vipers steal them; Ironclad and private security answer violence with response birds. The Machines layer of play (drones → vehicles → buildings) is how Ghostwire turns that texture into table tools.

> **Tone:** Reach-native chrome in the rain — LED strips, scarred housings, neon reflected on wet rotor blades — not clean white-box miltech. E1 clunkers are the scarred end of that spectrum: taped housings, mismatched rotors, "it flies if you kick it."

---

## 2. Control modes

Every drone runs in one of three modes. Mode is a property of the **link**, not only the chassis.

| Mode | Who | What it feels like | Mechanical spine |
|---|---|---|---|
| **Remote** | Anyone with a link; Wrenches via RCC | Handheld or deck-fed camera/stick control | Rigging (or Logic + Rigging) to Direct; Gunnery for mounts if allowed |
| **Jump-In** | **Wrench only** (see §3) | Full sensor merge; meat body inert | Maneuver Jump-In per `05-wrench.md`; Reflex or Logic; biofeedback risk; temporary Integrity buffer |
| **Companion link** | Non-Wrench default | Soft “follow / watch / hold” leash | One soft program; no fleet orchestration; no Jump-In |

**Autonomous vs Commanded (Wrench table language):** a fielded machine may act on a canned behavior loop (Autonomous) or take orders through Deploy & Command / Rigged Fire (Commanded). Jump-In overrides both for the frame you inhabit.

**Hardware gate (¥ side):**
- **Remote Box / Basic RCC** — one drone, remote only, no Jump-In (Street/Professional band).
- **Fleet Deck and above** — multi-drone command, Jump-In when paired with a control-rig (chrome), autosoft headroom — see Gear master Cat **4D**. Non-Wrench heroes **cannot** use Fleet Deck+ features even if they own the hardware (class firewall).

---

## 3. Anyone vs Wrench (LOCKED design proposal)

### 3A — Non-Wrench (any other class)

| Rule | Locked proposal |
|---|---|
| **Active drones** | **Max 1** active at a time — **even a Street clunker counts as that one non-Wrench drone** |
| **Jump-In** | **Forbidden** |
| **RCC fleet features** | **Cannot** use Fleet Deck / War Table / Command Rig / Hydra swarm features (even if purchased — they sit inert or Director may allow Remote-Box behavior only) |
| **Rolls** | **Bane** on all **Rigging** and **Gunnery-through-drone** Power Rolls |
| **Uptime / bandwidth** | No Uptime pool. Companion link lasts **one scene** (or until Integrity 0 / jam / Director cut), then the drone drops to standby and needs a short reset (≈ 10 minutes / between scenes) |
| **Integrity buffer** | Soft buffer only: **+2 temporary Integrity** while the link is live (does not stack with Jump-In buffers; lost when the link drops) |
| **Actions** | **Soft actions only** by default: Move, Observe/Mark (sensor), Carry/Drop (if cargo-capable), Stabilize assist (Medic-grade chassis only), simple Interact. **Weapon mounts:** may fire **Street / Professional** soft/nonlethal or light personal mounts only; **Restricted+ combat hardpoints** require a Wrench or stay locked |
| **Autosofts** | May run **one** basic Pilot/Sensor autosoft if the chassis has a free slot — no swarm / Focus Fire / Override packages |
| **Heroic resource** | Cannot spend Uptime; cannot use Wrench Deploy & Command / Focus Fire / subclass swarm features |

**Intent:** a Scout's eye-in-the-sky or a Medic's trauma mule is supported; a second Operator does not become a discount Wrench. Buying a taped-together junk mote still burns the one-drone slot.

### 3B — Wrench

| Rule | Align to `05-wrench.md` (do not invent parallel names) |
|---|---|
| **Fleet** | Field multiple machines up to **Fleet Size** cap (baseline 3 @ L1 → 6 @ L10; Drone Jockey raises further) |
| **Resource** | **Uptime** — banked from fielded presence / deploy / maintenance / salvage; drained by body damage, asset hits, jamming, destruction; spent on Deploy, Command, Override, burst-buffs |
| **Jump-In** | Full Jump-In Plumbing (maneuver; inert body; biofeedback; temporary Integrity buffer per Wrench chapter) |
| **Gunnery** | Full **Gunnery** / Rigged Fire through drones and mounts |
| **RCC / autosofts** | Full use of owned RCC ladder + autosoft slots |
| **Overheat** | **Not a separate resource in this chapter.** Wrench v1 uses **Uptime drain** for pressure; whether to reintroduce explicit Overheat backlash remains an open question in `05-wrench.md` — do not fork it here. RCC flavor that mentions “Overheat pressure” is narrative for high-end decks until Michael locks the mechanic |

**Firewall reminder:** ¥ buys frames, mods, RCCs. Uptime runs the fight. Chrome (e.g. control rig) can improve Jump-In / efficiency; chrome never generates Uptime; ¥ never buys Uptime.

---

## 4. Scale bands (drones)

| Scale | Plain meaning | Examples |
|---|---|---|
| **Personal** | Palm to torso; stows in a pack or on a harness; fits vents / crowds | Micro-spies, taser-bees, anthro infiltrators |
| **Light** | Dog to motorcycle; carried awkwardly or rolled; corridor-viable | Quads, crawlers, med/repair bots, sentry dogs |
| **Vehicle (drone)** | No crew seats, but chassis mass of a small vehicle; hardpoints + real armor possible | Gun-drones, cargo mules, heavy assault frames |

**Note:** `05-wrench.md` once said combat drones at this mass live on the Vehicle card. **This chapter keeps Vehicle (drone) entries in the drone inventory** (matching Gear Cat 5E) so swarm/fleet play stays on one list. Vehicles chapter (`16-vehicles.md`) will cover **crewed** platforms. Flagged under Open Questions if Michael wants a hard split.

**Domain:** Air (drone) / Ground (drone) / Water (drone). Domain gates terrain and chase language; it does not replace Scale.

**Chassis → mod slots (doctrine):** slots climb with Availability / Echelon (same shape as Gear master). Micro/Street ≈ 1; Professional ≈ 2; Restricted ≈ 3; Military ≈ 4; Prototype ≈ 5. A chassis cannot exceed its published slot count — buy a bigger frame for more capacity. **Clunkers** sit at Street ¥ / **1 slot** even when the scale looks Light — inefficient frames waste capacity.

---

## 5. Full drone inventory

**Reading the tables:** slang / corp / sci names are **Ghostwire-original**. Prices climb with Availability + Echelon. Concrete Integrity / Speed numbers deferred to the shared Machines numeric pass — profiles stay qualitative here. Armor kits add Stamina (Integrity); machines have no armor rating / DR. Mounted weapons come from Category 3 or a Weaponry kit; installs are §Craft Projects (`14-mods.md`).

### Echelon shopping guidance

Shop the **subsection for your band first**. E1 Street clunkers are intentionally bad deals that still work — perfect for new crews, disposable scouts, and non-Wrench “one eye in the sky.” Professional E1 cleans up reliability without leaving the band. E2 Restricted is the support/sentry/EW sweet spot. E3 Military brings hard mounts, Jump-In-Capable combat frames, and breach tools. E4 Prototype is apex kit: elite recon, courier, medic, EW, and heavy combat — not only siege walkers. Directors: if a hero's Echelon is N, prefer offering at least one buyable frame from that subsection (and never empty a band).

**Clunker / Unreliable (Director cue):** once per scene when it matters, impose an extra **bane** on a Rigging/Gunnery roll **or** stall the frame for a beat (misses a Move, drops a package, camera blacks out). Do not punish every action — make the junk feel lived-in.

### 5.1 Inventory by Echelon

#### Echelon 1 — Street / Professional (clunkers + starter frames)

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

#### Echelon 2 — Restricted (support / denial / specialist)

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

#### Echelon 3 — Military (hard mounts / Jump-In combat)

| Name (slang / corp / sci) | Domain | Scale | Availability | Cost ¥ | Mod slots | Profile | Tags |
|---|---|---|---|---|---|---|---|
| Ripper / Breach-Drone / door-cracker | Ground (drone) | Light | Military | 11,000 | 4 | Charges, cutters, or shaped punch for hard portals. | Breach, Assault, Wired |
| Pallbearer / Extraction Hauler / armored mule | Ground (drone) | Vehicle (drone) | Military | 12,000 | 4 | Armored cargo bay for downed runners; light defensive mount. | Cargo, Armor, Medic, Wired |
| Stinger / Gun-Drone / aerial weapons platform | Air (drone) | Vehicle (drone) | Military | 13,000 | 4 | Real hardpoint gunner — fleet's flying damage dealer. | Combat, Mount, Jump-In-Capable, Wired |
| Skulker / Anthro-Drone / humanoid infiltrator | Ground (drone) | Personal | Military | 14,000 | 4 | Passes as a body at distance; tools or a sidearm mount. | Anthro, Infiltrate, Jump-In-Capable, Wired |
| Hellkite / Strafe-Wing / gunship microframe | Air (drone) | Vehicle (drone) | Military | 15,500 | 4 | Twin light mounts, dive strafe; loud and hated in the Grid. | Combat, Mount, Jump-In-Capable, Wired |
| Deep-Viper / Hunter Aquadron / wet hunter | Water (drone) | Vehicle (drone) | Military | 16,000 | 4 | Deeper hull, torpedo/spear mount, chase boats from below. | Aquatic, Combat, Jump-In-Capable, Wired |

**E3 count:** **6** chassis. Roles: breach, extract/medic, aerial combat, anthro infiltrate, aquatic combat.

#### Echelon 4 — Prototype (elite specialists + apex combat)

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

### 5.2 Role quick-index

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

### 5.3 Availability ↔ Echelon remap (player-facing)

| Availability | Typical Echelon | Legacy Gear-master Item Tier (internal only) |
|---|---|---|
| Street | 1 | T5 |
| Professional | 1 | T4 |
| Restricted | 2 | T3 |
| Military | 3 | T2 |
| Prototype | 4 | T1 |

---

## 6. Integrity, destruction, recovery (lean DS-friendly)

Drones use a short **Integrity** track (Machines numeric pass will publish numbers). Until then, Directors may treat Street/Professional frames as fragile (a few solid hits) and Military/Prototype as sturdy. **Clunkers** are especially fragile — treat as one solid hit from serious fire unless the Director is feeling generous.

| Event | Effect |
|---|---|
| **Hit while fielded** | Integrity damage; Wrench loses **1 Uptime** per hit (per `05-wrench.md`). Non-Wrench: no Uptime, but link jitter — Director may impose a bane next Remote action |
| **0 Integrity** | **Wrecked** — offline, not vaporized. Wrench lump **3 Uptime** drain. Salvage Sense / salvage maneuver still apply for Wrenches |
| **Recovery** | Field Repair (Wrench signature / Repair skill) restores Integrity in the fight per class text. Between scenes: §Craft **Repair** Project or short bench time + ¥ parts (Director: ≈ 10–25% of chassis cost for a heavy rebuild; clunkers are cheap to patch and cheap to write off) |
| **Total loss** | If the wreck is seized, burned, or dropped into the Sinks, the ¥ is gone — buy or craft another |
| **Non-Wrench scene end** | Companion link drops; drone standbys. Wrecked drones still need Repair / ¥ |

**Expendable tags (Needle, Buzz, Tape-Eye, etc.):** some Street micros are meant to die — Kamikaze / Decoy / Clunker runs destroy the chassis by design (see Drone Jockey abilities).

---

## 7. Modding

- Published **vehicle/drone mods** live in Gear master **§5F** (Armor ladder Scrap-Weld → Aegis Kit; Weaponry ladder Gun Rack → Heavy Hardpoint; Tune Kit, Sensor Pod, Ghost Coat, Runflats, Rigger Cocoon, Ammo Bin, …). Hosts: `vehicle` and `drone`. One armor kit and one weaponry kit at a time. Armor kits grant Stamina (Integrity); machines have no armor rating / DR.
- Install / swap / remove = downtime **§Craft Project**; skill = **Repair** (physical) or **Electronics** (sensor/EW suites). Autosofts / RCC programs use **Hacking** (`14-mods.md`).
- **Invent a Mod (v1)** applies — pitch, firewall check, Echelon gate, materials ¥, Project Power Roll.
- Slot integrity: do not publish orphan slot counts without a mod family. Rigger Cocoon upgrades Jump-In cleanliness on capable frames — it does **not** grant Jump-In to non-Wrenches.
- Clunkers with **1 slot** rarely take serious kits — Directors should lean into jury-rig narrative rather than full §5F menus.

---

## 8. Open questions for Michael

1. **Vehicle (drone) vs Vehicle card:** keep heavy combat drones on this list (current) or force Warhound-class onto `16-vehicles.md`?
2. **Non-Wrench weapon lock:** soft mounts only (proposed) vs “any mount but always with bane + 1-drone cap”?
3. **Companion link duration:** one scene (proposed) vs Integrity-buffer burn rate vs RCC Remote Box always-on while powered?
4. **Overheat:** leave deferred (Uptime drain only) or schedule a thin Overheat rule when Hydra / War Table is in play?
5. **Numeric pass:** Integrity / Speed / Handling per chassis — share with Vehicles chapter or ship a drone-only interim card? Armor is a Stamina kit, not a chassis rating.
6. **Core Sourcebook PDF remount:** re-run pymupdf harvest when Dropbox path is on-box; fold any still-canon prose into `_drone_lore_extract.md`.
7. **Clunker Unreliable pacing:** once-per-scene Director cue (current) vs a fixed bane always-on while Clunker-tagged?

---

## Next: Vehicles

**File:** `docs/rulebook/16-vehicles.md` — **Stage 3 draft** (2026-09-16). Crewed platforms, echelon coverage (≥5 / ≥3 roles; E1 Clunkers), anyone-vs-Wrench vehicle rules, lean abstract chase. Buildings / Facility Rigger expansion still deferred.
