# Spike B101 — Vehicle + drone token art

**Date:** 2026-09-19  
**Module:** **0.3.31**  
**Status:** **SHIPPED** — 36 drone + 32 vehicle WebPs; vehicles-pack `img` + LevelDB rebuilt. **0.3.68:** Mule-Bot cargo plate (PNG + 1024² WebP) also on generic **Drone (Medium)**. **0.3.73:** Mule-Bot Deploy path verified (`drone-medium` band; treasure SKU intentional). *Pending Michael Foundry-verify (Deploy from the Item).*  
**Pairs with:** `docs/rulebook/15-drones.md`, `16-vehicles.md`, `docs/spikes/B36b-VEHICLES-PACK-FULL-SYNC.md`, `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`

## Goal

Chassis token art for every published drone and crewed vehicle, named by slang slug, stamped onto Ghostwire Vehicles & Drones Item `img` fields. Plumbing (apply script + empty dirs) landed first; this bump ships the `gw-tokens` art pack.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| JSON sources | `src/packs/vehicles/**/*.json` | **Edit here.** Item documents (`type: treasure`) with `system._dsid` and top-level `img`. Same pattern as gear / pregen `img` updates. |
| LevelDB | `packs/vehicles` | Compiled by `node tools/build-packs.mjs vehicles`. Do not hand-edit. Close Foundry first. |
| Deploy templates | `src/packs/summons/machines/machine-*.json` | Nine **generic** scale-band Actors. `scripts/machines.mjs` `deployMachine()` overwrites `img` and `prototypeToken.texture.src` from the **Item**. Other bands stay placeholder icons. **0.3.68:** `machine-drone-medium` (generic **Drone (Medium)**) uses the Mule-Bot cargo plate (`assets/tokens/drones/mule-bot.{png,webp}`). **0.3.73:** named `mule-bot` Actor is optional Director placement; Deploy still stamps `machine-drone-medium`. |
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

**Shipped (0.3.31):** 36 files in `assets/tokens/drones/` + 32 files in `assets/tokens/vehicles/` (Foundry top-down 1024² WebP). Every vehicles-pack Item `img` is the matching module path (no leftover `icons/` placeholders).

## Tool

```text
node tools/apply-machine-token-art.mjs --list
node tools/apply-machine-token-art.mjs
node tools/apply-machine-token-art.mjs --from _incoming-art
node tools/apply-machine-token-art.mjs --from _incoming-art --dry-run
```

`--from` copies into `assets/tokens/{drones,vehicles}/`, sets Item `img`, then runs `tools/build-packs.mjs vehicles` (skip with `--no-build`). Unmatched filenames fail unless `--ignore-unknown`. `_incoming-art/` is gitignored (B44c).

Replace a WebP in place, then `node tools/apply-machine-token-art.mjs` (Foundry closed) to restamp `img` and rebuild `packs/vehicles`.

## Zip filename aliases (gw-tokens pack)

Canonical on-disk names are pack `_dsid`s. The incoming zip used a few slang/corp variants; the apply tool maps them:

| Incoming | Kind | Dest `_dsid` |
|---|---|---|
| `drones/rustbucket.webp` | drone | `rustbucket-drone` |
| `drones/fly-micro-drone.webp` | drone | `fly` |
| `vehicles/rustbucket-runabout.webp` | vehicle | `rustbucket` |
| `vehicles/getaway-sedan.webp` | vehicle | `getaway` |

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
| 1 | Lane-Hopper | `lane-hopper` | ground | Ground | Vehicle |
| 1 | Star-Chopper | `star-chopper` | ground | Ground | Light |
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

Primary: kebab-case slang = `_dsid`. Also: no-hyphen forms (`irongiant` → `iron-giant`), `rusted-quad` → `rustbucket-drone`, `fly-micro-drone` → `fly`, `getaway-sedan` → `getaway`, `rustbucket-runabout` → `rustbucket`. A file named `rustbucket.webp` in a **drones** folder maps to `rustbucket-drone`; anywhere else it is the crewed van.

## Out of scope

- Rewriting band-template Actor art **except** `machine-drone-medium` (0.3.68 Mule-Bot cargo plate)
- Gear / chrome / bestiary tokens
- Changing Deploy / Recall mechanics
- Mama / Switchboard map walls

**0.3.68 Mule-Bot / Drone (Medium):** Michael’s circular industrial yellow forklift-tread cargo plate replaces `assets/tokens/drones/mule-bot.webp` (PNG original 1254² beside it). Item `mule-bot` already pointed at that WebP. Generic Actor `machine-drone-medium` `img` + `prototypeToken.texture.src` use the same path so a dragged **Drone (Medium)** is not the steel-blue robotics placeholder. Deploy from a named SKU still stamps that Item’s art. No Gold Line `{ force: true }`. No PDF.

**0.3.73 Mule-Bot:** Treasure SKU stays the inventory / Deploy path. Named Actor `src/packs/summons/machines/mule-bot.json` is optional Director placement (`dsid: mule-bot`, Wire Kit, industrial hauler plate). **Deploy still uses `machine-drone-medium`** (same as Stinger / Warhound). Generic **Drone (Medium)** remains the band template. No Gold Line `{ force: true }`. No PDF.

## Checklist

- [x] Spike inventory + path convention
- [x] `tools/apply-machine-token-art.mjs` (slug → Item `img` → `build-packs.mjs vehicles`)
- [x] `assets/tokens/vehicles/` **32** WebP + `assets/tokens/drones/` **36** WebP
- [x] Every chassis Item `img` is `modules/draw-steel-ghostwire/assets/tokens/{drones,vehicles}/<dsid>.webp`
- [x] `packs/vehicles` rebuilt
- [x] Module **0.3.31**
- [ ] Foundry-verify Deploy tokens (Fly + Getaway)
