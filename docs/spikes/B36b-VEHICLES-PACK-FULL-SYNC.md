# Spike B36b — Sync vehicles pack to full chapter inventories

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (read disk; was 0.1.47 when spike written).

## Goal
Bring Foundry **Item** pack `vehicles` (Ghostwire Vehicles & Drones) up to the published chapter inventories:

| Source | Published | Pack today | Gap |
|---|---|---|---|
| `docs/rulebook/15-drones.md` | **36** chassis | **11** | ~25 missing |
| `docs/rulebook/16-vehicles.md` | **32** platforms | **20** | ~12 missing |

**Do not** invent new 1:1 Actor SKUs. Phase 4 band templates + Deploy (`scripts/machines.mjs`, `GHOSTWIRE_MACHINE_BANDS.md`) stay the Scene layer. New Items must resolve to an existing band via domain / scale / `drone` flag.

## Existing pack SKUs (keep; sync fields from chapter if drifted)

**Drones (11):** barracuda, crawler, fly, guard-dog, medbot, mule-bot, rotor, skulker, stinger, warhound, wrenchbot  

**Vehicles (20):**  
- ground: brick, crotch-rocket, getaway, hardtop, iron-giant, rustbucket, warbike, workhorse  
- air: buzzcopter, ghost-wing, hoverpad, skyhunter, tiltjet  
- water: cigarette, leviathan, skiff, wetsub  
- space: mule, pod, reaver  

## Missing (add these — derive `_dsid` from first slang name, kebab-case)

Parse chapter tables for every row whose primary slang name is not already in the pack. Examples of missing drones from 15-drones.md: Tape-Eye, Sink-Floater, Junkbug, Rustbucket (drone aerial — careful: vehicle also has Rustbucket), Sputter-Sled, Rattlebox, Skitter, Needle, Buzz, Taser-Bee, Spotter, Netcaster, Choir-Box, Nest, Ghost-Courier, Ripper, Pallbearer, Hellkite, Deep-Viper, Phantom, Whisper-Run, Lifeline, Choir-King, Razorwing, Iron Mantis, … (full list = chapter − pack).

Missing vehicles from 16-vehicles.md include e.g. Clunker, Scrap-Bike, Sink-Skiff, Junk Rotor, Grey Cab, Flatbed, Harbor Cutter, Cage, River-Fang, Drop-Sled, Spider-Frame, Void-Runner, … (full list = chapter − pack).

**Name collision:** chapter drone “Rustbucket / Rusted Quad” vs vehicle “Rustbucket / City Runabout” — use distinct `_dsid`s (e.g. `rustbucket-drone` vs existing `rustbucket` vehicle) and clear display names.

## Item schema (match existing)
Type `treasure` (same as current vehicles pack). Flags:

```
flags.draw-steel-ghostwire.vehicle = {
  echelon,           // 1-4 from chapter section
  availability,      // street | professional | restricted | military | prototype
  price,             // number, no commas
  modSlots,          // from table
  tags: [],          // chapter Tags column if useful
  modFamily: ["vehicle"],
  domain,            // e.g. "Air (drone)", "Ground", "Water", "Space"
  scale,             // Personal | Light | Vehicle | Heavy | Capital | Vehicle-Heavy as chapter
  drone: true|false, // true for 15-drones rows
  speedBand?         // vehicles only if chapter has Speed band (slow|standard|fast|extreme)
}
```

Lang keys: `GHOSTWIRE.Vehicles.Items.<PascalDsid>.Name` / `.Description` (or existing Vehicles naming pattern — match neighbors). Description = Profile + Tags from chapter.

Folders: keep `drones/`, `ground/`, `air/`, `water/`, `space/` — place by domain (drones folder for all drone:true regardless of air/ground/water domain, matching current layout).

## After adding Items
1. Rebuild `packs/vehicles` via `tools/build-packs.mjs` (Foundry closed).
2. Update `docs/masters/GHOSTWIRE_MACHINE_BANDS.md` §3 map for **every** Item (regenerate from `machines.mjs` resolver or extend the table).
3. Smoke: Deploy one new drone + one new vehicle → correct band token.
4. FOUNDRY-BUILD-PLAN + STATUS: B36b pending Foundry verification.
5. Confirm `machines.mjs` band resolver covers new scales/domains without code changes; if a row fails to resolve, extend resolver minimally.

## Out of scope
- New Actor templates beyond existing 9 bands (unless a chassis cannot map — then ask / add one band)
- Rewriting chapter rules
- Commit / push

## Done when
- Pack drone count = 36 and vehicle count = 32 (or chapter totals if you recount tables exactly)
- Every new Item has catalog line (echelon / avail / ¥ / mod slots)
- MACHINE_BANDS map complete; Deploy works on a sample new SKU
- Version bumped; docs pending verify; **no git commit**

## Foundry test checklist (print when finished)
1. Compendium Ghostwire Vehicles & Drones shows full drone + vehicle lists.
2. Open a newly added Street drone (e.g. Tape-Eye) — price/slots/echelon match chapter.
3. Deploy it — band token appears; Recall cleans up.
4. Deploy a newly added vehicle (e.g. Grey Cab or Scrap-Bike) — correct size band.
5. Existing Guard-Dog / Getaway still Deploy as before.
