# Vehicle lore lock — street picture (2026-09-20)

**Date:** 2026-09-20  
**Module:** **0.3.69** (after Wire Kit / vision; 0.3.68 reserved)  
**Journals:** regenerated (lore + rulebook + Reach Handbook)  
**PDF:** none  
**Gold Line:** no force

## Doctrine (LOCKED — Michael; verbatim substance)

- Most vehicles in this world are **electric**.
- **Street / POV** (personally owned vehicles): mostly **light electric hovercraft** with **altitude limiters ~25–50 feet** off the ground (not free-flight sky cars).
- **Ground vehicles** (tires / treads) still exist but are **almost always heavy lifters, haulers, and big equipment** — not everyday street cars.
- **VTOL / flying craft** are **more expensive** but also in **common use** (corp, transit, well-funded runners).

## Where it lives

| Surface | File |
|---|---|
| Player lore (print + Lore journal) | `docs/manuscript/01-lore/L1-setting-primer.md` — **Vehicles & Transit** |
| RAW Machines (short lock + In Foundry) | `docs/raw/23-machines.md` |
| Vehicles chapter master | `docs/rulebook/16-vehicles.md` §1 |
| Reach travel | `docs/setting/reach-handbook/03-life-on-the-flats.md` |
| Director pointer | `docs/manuscript/03-directors/27-running-ossian-reach.md` |
| Glossary | `docs/manuscript/04-back/28-glossary-slang.md` |
| Gear master sync | `docs/masters/GHOSTWIRE_GEAR_MASTER.md` Cat 5 intro |
| Foundry | Lore / Rulebook / Reach Handbook journals; VOIDMARK index |

## Inventory + table token (Lane-Hopper, 2026-09-20 follow-on)

Michael delivered a 4-seat open street hovercar plate. **Lane-Hopper** (`lane-hopper`) is the published yes-example:

- Item: `src/packs/vehicles/ground/lane-hopper.json` (E1 Street ¥500, Domain Ground, Scale Vehicle, tags Transit / Crew-car / Hover / POV, 1+3 seats)
- Actor: `src/packs/summons/machines/lane-hopper.json` (placeable **2×3**, hover, linked token)
- Art: `assets/tokens/vehicles/lane-hopper.{png,webp}` (1024×1536 top-down)
- Open/closed cabins exist; this plate is the open table look
- **Rideable:** future only — top-down seats make passenger slots obvious; do not implement now
- Street POV family also includes hover bikes / choppers (SKU when plate lands)
- **Bulldog** (`bulldog`): street cargo van, Ground-hauler, tires, E1 Street ¥650. Placeholder token art. Item + Actor (`2×4`)

Domain still gates chase/wrecks. **Hover** tag = limiter-band POV (including many Ground-domain sedan/cab/bike SKUs). **Ground-hauler** = tires/treads/walker mass. **VTOL** = free-climb flying.

## Print naming

Ghostwire-only after front matter. No Draw Steel procedure citations in player-facing lock text. In Foundry sidebars may name **Draw Steel - Ghostwire Build** once.
