# Spike B101 — Vehicle + drone token-art plumbing

**Date:** 2026-09-19  
**Module:** **0.3.29** (no bump — art is forthcoming)  
**Status:** plumbing landed; **token WebPs not shipped**  
**Pairs with:** `docs/rulebook/15-drones.md`, `16-vehicles.md`, `docs/spikes/B36b-VEHICLES-PACK-FULL-SYNC.md`, `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`

## Goal

Accept chassis token art for every published drone and crewed vehicle, named by slang slug, and stamp it onto the matching Foundry pack documents. **This pass does not wait for art** — it documents the inventory, the pack source of truth, the `img` path convention, and a apply+rebuild tool so a follow-up with uploads is mechanical.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| JSON sources | `src/packs/vehicles/**/*.json` | **Edit here.** Item documents (`type: treasure`) with `system._dsid` and top-level `img`. Same pattern as gear / pregen `img` updates. |
| LevelDB | `packs/vehicles` | Compiled by `node tools/build-packs.mjs vehicles`. Do not hand-edit. Close Foundry first. |
| Deploy templates | `src/packs/summons/machines/machine-*.json` | Nine **generic** scale-band Actors. `scripts/machines.mjs` `deployMachine()` overwrites `img` and `prototypeToken.texture.src` from the **Item**. Band templates stay placeholder icons. |
| Gear / mods | `src/packs/gear`, `src/packs/mods` | **Not chassis.** Only related SKU is `sensor-sweep-drone-eye` (a sensor gadget). Do not retarget it. |
| Pregens | `src/packs/pregens` | No embedded drone/vehicle Items today. No pack rebuild needed for B101 art. |

Foundry `img` convention (module-relative, same family as `assets/pregens/`):

```text
modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp
modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp
```

On-disk staging:

```text
assets/tokens/vehicles/<dsid>.webp
assets/tokens/drones/<dsid>.webp
```

`<dsid>` = `system._dsid` = kebab-case of the chapter **slang** name (first name in `slang / corp / sci`). **Collision:** chapter drone “Rustbucket / Rusted Quad” is pack `rustbucket-drone` so it does not overwrite crewed `rustbucket`.

Until WebPs land, every chassis still uses Foundry core placeholders (`icons/commodities/tech/robotics-frame-steel-blue.webp` for drones; wagon / jet / fan icons by vehicle domain).

## Tool

```text
node tools/apply-machine-token-art.mjs --list
node tools/apply-machine-token-art.mjs
node tools/apply-machine-token-art.mjs --from _incoming-art
node tools/apply-machine-token-art.mjs --from _incoming-art --dry-run
```

`--from` copies into `assets/tokens/{drones,vehicles}/`, sets Item `img`, then runs `tools/build-packs.mjs vehicles` (skip with `--no-build`). Unmatched filenames fail unless `--ignore-unknown`. `_incoming-art/` is gitignored (B44c).

Does **not** bump `module.json`. Bump one patch in the art follow-up when WebPs actually ship.

## Follow-up when WebPs are attached

1. Name files by slang slug + `.webp` (tables below). Nested `drones/` + `vehicles/` folders are preferred; a flat dump works if every slug is unique (`rustbucket-drone.webp` required for the aerial clunker).
2. Stage under `_incoming-art/` (or drop straight into `assets/tokens/…`).
3. Close Foundry.
4. `node tools/apply-machine-token-art.mjs --from _incoming-art`
5. Confirm `--list` shows `art=yes` and pack JSON `img` paths match the convention.
6. Bump **one** module patch; Foundry-verify: open Fly + Getaway, Deploy each, token uses the new art; Recall still cleans up.
7. Delete `_incoming-art/` (do not commit the staging folder).

## Inventory — drones (36)

Chapter: `docs/rulebook/15-drones.md` §5.1. Pack folder: `src/packs/vehicles/drones/`. Module img: `modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp`.

| E | Slang | `_dsid` / filename | Domain | Scale |
|---|---|---|---|---|
| 1 | Tape-Eye | `tape-eye` | Air (drone) | Personal |
| 1 | Sink-Floater | `sink-floater` | Water (drone) | Personal |
| 1 | Junkbug | `junkbug` | Ground (drone) | Personal |
| 1 | Rustbucket | `rustbucket-drone` | Air (drone) | Light |
| 1 | Sputter-Sled | `sputter-sled` | Ground (drone) | Light |
| 1 | Rattlebox | `rattlebox` | Ground (drone) | Light |
| 1 | Fly | `fly` | Air (drone) | Personal |
| 1 | Skitter | `skitter` | Ground (drone) | Personal |
| 1 | Needle | `needle` | Air (drone) | Personal |
| 1 | Buzz | `buzz` | Air (drone) | Personal |
| 1 | Taser-Bee | `taser-bee` | Air (drone) | Personal |
| 1 | Crawler | `crawler` | Ground (drone) | Light |
| 1 | Rotor | `rotor` | Air (drone) | Light |
| 1 | Spotter | `spotter` | Air (drone) | Light |
| 1 | Mule-Bot | `mule-bot` | Ground (drone) | Vehicle |
| 2 | Netcaster | `netcaster` | Ground (drone) | Light |
| 2 | Wrenchbot | `wrenchbot` | Ground (drone) | Light |
| 2 | Guard-Dog | `guard-dog` | Ground (drone) | Light |
| 2 | Medbot | `medbot` | Ground (drone) | Light |
| 2 | Choir-Box | `choir-box` | Air (drone) | Light |
| 2 | Nest | `nest` | Ground (drone) | Light |
| 2 | Barracuda | `barracuda` | Water (drone) | Light |
| 2 | Ghost-Courier | `ghost-courier` | Air (drone) | Light |
| 3 | Ripper | `ripper` | Ground (drone) | Light |
| 3 | Pallbearer | `pallbearer` | Ground (drone) | Vehicle |
| 3 | Stinger | `stinger` | Air (drone) | Vehicle |
| 3 | Skulker | `skulker` | Ground (drone) | Personal |
| 3 | Hellkite | `hellkite` | Air (drone) | Vehicle |
| 3 | Deep-Viper | `deep-viper` | Water (drone) | Vehicle |
| 4 | Phantom | `phantom` | Air (drone) | Light |
| 4 | Whisper-Run | `whisper-run` | Air (drone) | Light |
| 4 | Lifeline | `lifeline` | Ground (drone) | Vehicle |
| 4 | Choir-King | `choir-king` | Air (drone) | Light |
| 4 | Warhound | `warhound` | Ground (drone) | Vehicle |
| 4 | Razorwing | `razorwing` | Air (drone) | Vehicle |
| 4 | Iron Mantis | `iron-mantis` | Ground (drone) | Vehicle |

## Inventory — crewed vehicles (32)

Chapter: `docs/rulebook/16-vehicles.md` §7.1. Pack folders: `src/packs/vehicles/{ground,air,water,space}/`. Module img: `modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp`.

| E | Slang | `_dsid` / filename | Pack folder | Domain | Scale |
|---|---|---|---|---|---|
| 1 | Clunker | `clunker` | ground | Ground | Vehicle |
| 1 | Scrap-Bike | `scrap-bike` | ground | Ground | Light |
| 1 | Rustbucket | `rustbucket` | ground | Ground | Vehicle |
| 1 | Sink-Skiff | `sink-skiff` | water | Water | Light |
| 1 | Junk Rotor | `junk-rotor` | air | Air | Light |
| 1 | Skiff | `skiff` | water | Water | Light |
| 1 | Crotch-Rocket | `crotch-rocket` | ground | Ground | Light |
| 1 | Getaway | `getaway` | ground | Ground | Vehicle |
| 1 | Workhorse | `workhorse` | ground | Ground | Vehicle |
| 1 | Buzzcopter | `buzzcopter` | air | Air | Light |
| 1 | Cigarette | `cigarette` | water | Water | Vehicle |
| 2 | Hardtop | `hardtop` | ground | Ground | Vehicle |
| 2 | Grey Cab | `grey-cab` | ground | Ground | Vehicle |
| 2 | Flatbed | `flatbed` | ground | Ground | Heavy |
| 2 | Tiltjet | `tiltjet` | air | Air | Vehicle |
| 2 | Hoverpad | `hoverpad` | air | Air | Vehicle |
| 2 | Harbor Cutter | `harbor-cutter` | water | Water | Vehicle |
| 2 | Wetsub | `wetsub` | water | Water | Vehicle |
| 2 | Pod | `pod` | space | Space | Vehicle |
| 3 | Warbike | `warbike` | ground | Ground | Light |
| 3 | Brick | `brick` | ground | Ground | Heavy |
| 3 | Cage | `cage` | ground | Ground | Vehicle |
| 3 | River-Fang | `river-fang` | water | Water | Vehicle |
| 3 | Skyhunter | `skyhunter` | air | Air | Heavy |
| 3 | Drop-Sled | `drop-sled` | air | Air | Light |
| 3 | Mule | `mule` | space | Space | Heavy |
| 4 | Iron Giant | `iron-giant` | ground | Ground | Heavy |
| 4 | Spider-Frame | `spider-frame` | ground | Ground | Heavy |
| 4 | Ghost-Wing | `ghost-wing` | air | Air | Heavy |
| 4 | Leviathan | `leviathan` | water | Water | Heavy |
| 4 | Void-Runner | `void-runner` | space | Space | Heavy |
| 4 | Reaver | `reaver` | space | Space | Capital |

**Counts match B36b / the chapters: 36 drones + 32 vehicles = 68 Items.** Live check: `node tools/apply-machine-token-art.mjs --list`.

## Filename aliases the tool accepts

Primary: kebab-case slang = `_dsid`. Also: no-hyphen forms (`irongiant` → `iron-giant`), and `rusted-quad` → `rustbucket-drone`. A file named `rustbucket.webp` in a **drones** folder maps to `rustbucket-drone`; anywhere else it is the crewed van.

## Out of scope (this PR)

- Shipping token binaries
- Module version bump
- Rewriting band-template Actor art
- Gear / chrome / bestiary tokens
- Changing Deploy / Recall mechanics

## Checklist

- [x] Spike inventory + path convention
- [x] `tools/apply-machine-token-art.mjs` (slug → Item `img` → `build-packs.mjs vehicles`)
- [x] `assets/tokens/vehicles/.gitkeep` + `assets/tokens/drones/.gitkeep`
- [x] Dummy-slug apply (Tape-Eye, ironmantis, drones/`rustbucket` → `rustbucket-drone`, Grey Cab, buzz, getaway) writes Item `img`; unknown `nope.webp` fails unless `--ignore-unknown`; JSON + dummy WebPs restored
- [ ] WebP uploads in a follow-up
- [ ] One module patch when art ships
- [ ] Foundry-verify Deploy tokens after art lands
