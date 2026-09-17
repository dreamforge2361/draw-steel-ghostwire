# Ghostwire Core Rulebook — Chapter: Mods

**Status:** v1 draft (2026-09-16) — for Michael review
**Pairs with:** `docs/rulebook/11-economy.md`, `docs/rulebook/10-kits.md`, `docs/rulebook/12-chrome.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md`
**Foundry:** **Ghostwire Mods** (weapon, vehicle & drone, armor & shield, gadget mods) and **Ghostwire Matrix** (programs, payloads, RCC autosofts). Mods are inventory items; slot tracking isn’t automated yet.

---

## Mod doctrine

- **Slots.** Every host item lists its **mod slots** (set by its grade in the Gear master). Each mod lists a **slot cost** (1 unless noted). A host can’t hold more slot cost than it has slots.
- **¥, never power.** Mods are bought with ¥ like any gear. A mod adds tags, edges/banes, and conveniences — never Stamina, damage bands, characteristics, skills, or class features (the BP firewall).
- **Mods stack with Kits.** A Kit supplies doctrine numbers (damage by Power Roll result, distance, Stamina, speed, stability); mods touch different things (tags, situational edges, conveniences), so they never overwrite each other.
- **No same-effect double-dip.** Two sources of the same edge on the same test don’t stack — take one.
- **Grade.** Mods use the same **echelon + Availability band** as all gear (Street / Professional / Restricted / Military / Prototype).
- **Consumables** carry no mod slots.

### §Craft is a procedure, not a skill

**§Craft** is the downtime **Project** procedure for building, installing, swapping, or removing mods. Every §Craft Project is keyed to a real Ghostwire skill:

| Work | Skill |
|---|---|
| Weapon, armor, shield, and vehicle/drone **physical** mods (mounts, plates, liners, suspension, grips, magazines) | **Repair** |
| Deck and hardware **gadget** work (electronics, sensors, comms firmware, smart systems, active shields) | **Electronics** |
| **Programs** and deck software; payloads | **Hacking** |
| **RCC autosofts** | **Hacking** or **Rigging** |
| **Chrome-adjacent** work (anything touching implants or the body) | **Cybertech** |

- **Install, swap, or remove** a mod: always a downtime Project (§Craft) keyed to the skill above.
- **Toggle** an already-installed mod on or off (a smartlink, a suppressor, a loaded program): a field action.
- **Programs:** install or swap as a downtime Project (§Craft) keyed to Hacking. Toggle already-loaded programs in the field; loading into a free deck slot is downtime.

## Host families

Every item with mod slots belongs to at least one family that has purchasable mods:

| Host family | Hosts | Mods (Foundry) |
|---|---|---|
| **Weapons** | Firearms, longarms, heavy weapons, melee, bows & exotic (not thrown consumables) | Ghostwire Mods › Weapon Mods |
| **Vehicles & drones** | Every vehicle and drone | Ghostwire Mods › Vehicle & Drone Mods |
| **Armor & shields** | Light, medium, heavy, sealed & hardened armor; shields | Ghostwire Mods › Armor & Shield Mods |
| **Gadgets** | Comms; sensors & optics; mechanical and electronic break-in tools; survival kits; Wired interfaces and matrix-support gear | Ghostwire Mods › Gadget Mods |
| **Cyberdecks** | Decks | Ghostwire Matrix › Programs & Utilities, Intrusion & Attack Payloads |
| **RCCs** | Rigger command consoles | Ghostwire Matrix › RCC Autosofts |

Items with no mod family yet — foci, the Field Surgery Kit, Designer Threads, and the Faraday Bag — have **0 mod slots** until one exists.

## Invent a Mod (v1)

A hero can design a mod that isn’t in the catalog. Follow these steps in order:

1. **Pitch.** Describe the mod: its host family, its one effect, and its slot cost (normally 1).
2. **Firewall.** The Director checks the effect against the firewall: tags, situational edges or banes, and once-per-scene conveniences only — no Stamina, damage bands, characteristics, skills, or class features, and no stacking an edge the hero already has.
3. **Echelon gate.** The Director sets the mod’s echelon and Availability band by comparing it to catalog mods. A hero can’t invent a mod above their own echelon.
4. **Materials ¥.** Pay about **half** the price of the most comparable catalog mod.
5. **Project roll.** Make the downtime Project (§Craft) keyed to the host’s skill (see the table above).
6. **Result.**
   - **Low result:** the design fails — no mod.
   - **Middle result:** a **personal** mod — it works, but only the inventor can build and maintain it.
   - **High result:** a **crew-catalog** mod — the design joins the crew’s catalog; any crew member can buy materials and build it again.
7. **Install.** Installing the finished mod into a host is a **separate** downtime Project (§Craft).

## Open

- Slot tracking and mod attachment in Foundry (mods are inventory items for now).
- Whether materials are spent on a low result (Director’s call until locked).
- Weapon mods (Gear master 3G) list no grade; they show no echelon until the gear pass sets one.
- Mod families for foci, medical kits, and lifestyle goods.
