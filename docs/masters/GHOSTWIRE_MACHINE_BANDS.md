# GHOSTWIRE — Machine Bands (drones & vehicles, dual Item + Actor)

**Status:** Phase 4 v1 — 2026-09-17 · provisional numbers · B36b full catalog sync (68 Items, Foundry-verified)  
**Locks:** `GHOSTWIRE_SUPPORT_ENTITIES.md` §Dual representation — the **Item** (`vehicles` pack) is ownership, ¥, Availability, mods, and echelon; the **Actor** (`summons` pack › Drones & Vehicles) is the Scene token, size, Integrity, and speed.  
**Rules:** `docs/rulebook/15-drones.md`, `16-vehicles.md`, `05-wrench.md`. **Code:** `scripts/machines.mjs` (band resolver, Deploy / Recall); templates generated as `src/packs/summons/machines/machine-*.json`.

---

## 1. How Deploy works (v1)

1. On a hero's sheet, **right-click the drone or vehicle row** (or click its ⋮ control) and choose **Deploy** — or open the Item and use the **Deploy** button in its header (with Stowed / Deployed status). The Item must be owned by an Actor.
2. Deploy:
   - resolves the Item's band from its `flags.draw-steel-ghostwire.vehicle` (`drone`, `domain`, `scale`) — no Item data changes;
   - imports that band's template from Ghostwire Summons & Machines into a world Actor in the **Deployed Machines** folder, named and imaged after the Item, owned by the hero's owners;
   - stamps Stamina (Integrity), speed, movement type, and level (= echelon);
   - places a **linked** token next to the owner's token on the viewed Scene (or the centre of the view);
   - links both sides: Actor `flags.draw-steel-ghostwire = { kind: "drone"|"vehicle", band, ownerUuid, gearItemUuid, dsid: "machine-<band>", gearDsid, echelon, speedBand }`; Item `flags.draw-steel-ghostwire.deployed = { actorUuid }`.
3. **Recall** (same row menu or header button) deletes the machine's tokens on every Scene and its Actor; the Item stays.
4. **Guardrails:** one deployed Actor per Item (Deploy refuses a second); deleting the deployed Actor by hand also removes its tokens and clears the Item link; deleting the Item recalls its machine; a machine dropping to 0 Stamina posts a **wrecked** warning (Recall stays a table decision).
5. **Permissions:** Deploy creates an Actor and a Token, so it needs the Create Actors and Create Tokens permissions — the Director by default. Recall works for the Actor's owners.
6. Macro API: `game.modules.get("draw-steel-ghostwire").api` → `machineBand(item)`, `deployMachine(item)`, `recallMachine(item)`, `deployedMachine(item)`.

Control modes (Remote / Jump-In / crew stations), Fleet Size, Uptime drain, and the non-Wrench single-drone link remain chapter text in v1.

## 2. Band templates (provisional)

The Machines numeric pass hasn't published Integrity / Speed / Armor. Until it does:

- **Deploy Stamina** = template Stamina × echelon multiplier (E1 ×1, E2 ×1.5, E3 ×2, E4 ×2.5), rounded.
- **Deploy speed** = template speed; crewed vehicles add their chapter Speed band (Slow −2, Standard +0, Fast +2, Extreme +4). Drones have no Speed band in `15-drones.md`, so they keep the template speed.
- **Movement type** from domain: Ground → walk, Air / Space → fly, Water → swim.

| Template `_dsid` | Kind | Resolves from | Size | Stamina | Speed |
|---|---|---|---|---|---|
| `machine-drone-micro` | drone | drone, Scale Personal | 1T | 5 | 6 |
| `machine-drone-small` | drone | drone, Scale Light | 1S | 12 | 6 |
| `machine-drone-medium` | drone | drone, Scale Vehicle | 1L | 24 | 7 |
| `machine-vehicle-bike` | vehicle | Ground, Scale Light | 1L | 20 | 10 |
| `machine-vehicle-car` | vehicle | Ground, Scale Vehicle | 2 | 40 | 10 |
| `machine-vehicle-heavy` | vehicle | Ground, Scale Heavy / Vehicle–Heavy | 3 | 80 | 8 |
| `machine-vehicle-air` | vehicle | Air (any scale) | 2 | 40 | 12 |
| `machine-vehicle-water` | vehicle | Water (any scale) | 2 | 40 | 8 |
| `machine-vehicle-space` | vehicle | Space (any scale, incl. Capital) | 3 | 80 | 12 |

No drone needs a large band yet (the heaviest drones are Vehicle scale). One air / water / space band each covers every scale in v1; split them when the numeric pass lands.

## 3. Item → band map (all 68 vehicles-pack Items — 36 drones, 32 crewed platforms)

*Generated from the resolver in `scripts/machines.mjs`, so it matches what Deploy does. B36b (2026-09-17) synced the pack to `15-drones.md` §5.1 and `16-vehicles.md` §7.1; crewed vehicles carry `flags.vehicle.speedBand` from the chapter's Speed column.*

| Kind | Item `_dsid` | Name | Domain | Scale | Echelon | Band template | Speed band | Deploy Stamina | Deploy speed / movement |
|---|---|---|---|---|---|---|---|---|---|
| Drone | `deep-viper` | Deep-Viper | Water (drone) | Vehicle | 3 | `machine-drone-medium` | — | 48 | 7 swim |
| Drone | `hellkite` | Hellkite | Air (drone) | Vehicle | 3 | `machine-drone-medium` | — | 48 | 7 fly |
| Drone | `iron-mantis` | Iron Mantis | Ground (drone) | Vehicle | 4 | `machine-drone-medium` | — | 60 | 7 walk |
| Drone | `lifeline` | Lifeline | Ground (drone) | Vehicle | 4 | `machine-drone-medium` | — | 60 | 7 walk |
| Drone | `mule-bot` | Mule-Bot | Ground (drone) | Vehicle | 1 | `machine-drone-medium` | — | 24 | 7 walk |
| Drone | `pallbearer` | Pallbearer | Ground (drone) | Vehicle | 3 | `machine-drone-medium` | — | 48 | 7 walk |
| Drone | `razorwing` | Razorwing | Air (drone) | Vehicle | 4 | `machine-drone-medium` | — | 60 | 7 fly |
| Drone | `stinger` | Stinger | Air (drone) | Vehicle | 3 | `machine-drone-medium` | — | 48 | 7 fly |
| Drone | `warhound` | Warhound | Ground (drone) | Vehicle | 4 | `machine-drone-medium` | — | 60 | 7 walk |
| Drone | `buzz` | Buzz | Air (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 fly |
| Drone | `fly` | Fly | Air (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 fly |
| Drone | `junkbug` | Junkbug | Ground (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 walk |
| Drone | `needle` | Needle | Air (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 fly |
| Drone | `sink-floater` | Sink-Floater | Water (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 swim |
| Drone | `skitter` | Skitter | Ground (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 walk |
| Drone | `skulker` | Skulker | Ground (drone) | Personal | 3 | `machine-drone-micro` | — | 10 | 6 walk |
| Drone | `tape-eye` | Tape-Eye | Air (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 fly |
| Drone | `taser-bee` | Taser-Bee | Air (drone) | Personal | 1 | `machine-drone-micro` | — | 5 | 6 fly |
| Drone | `barracuda` | Barracuda | Water (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 swim |
| Drone | `choir-box` | Choir-Box | Air (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 fly |
| Drone | `choir-king` | Choir-King | Air (drone) | Light | 4 | `machine-drone-small` | — | 30 | 6 fly |
| Drone | `crawler` | Crawler | Ground (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 walk |
| Drone | `ghost-courier` | Ghost-Courier | Air (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 fly |
| Drone | `guard-dog` | Guard-Dog | Ground (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 walk |
| Drone | `medbot` | Medbot | Ground (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 walk |
| Drone | `nest` | Nest | Ground (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 walk |
| Drone | `netcaster` | Netcaster | Ground (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 walk |
| Drone | `phantom` | Phantom | Air (drone) | Light | 4 | `machine-drone-small` | — | 30 | 6 fly |
| Drone | `rattlebox` | Rattlebox | Ground (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 walk |
| Drone | `ripper` | Ripper | Ground (drone) | Light | 3 | `machine-drone-small` | — | 24 | 6 walk |
| Drone | `rotor` | Rotor | Air (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 fly |
| Drone | `rustbucket-drone` | Rustbucket (Drone) | Air (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 fly |
| Drone | `spotter` | Spotter | Air (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 fly |
| Drone | `sputter-sled` | Sputter-Sled | Ground (drone) | Light | 1 | `machine-drone-small` | — | 12 | 6 walk |
| Drone | `whisper-run` | Whisper-Run | Air (drone) | Light | 4 | `machine-drone-small` | — | 30 | 6 fly |
| Drone | `wrenchbot` | Wrenchbot | Ground (drone) | Light | 2 | `machine-drone-small` | — | 18 | 6 walk |
| Vehicle | `buzzcopter` | Buzzcopter | Air | Light | 1 | `machine-vehicle-air` | fast | 40 | 14 fly |
| Vehicle | `drop-sled` | Drop-Sled | Air | Light | 3 | `machine-vehicle-air` | extreme | 80 | 16 fly |
| Vehicle | `ghost-wing` | Ghost-Wing | Air | Heavy | 4 | `machine-vehicle-air` | fast | 100 | 14 fly |
| Vehicle | `hoverpad` | Hoverpad | Air | Vehicle | 2 | `machine-vehicle-air` | fast | 60 | 14 fly |
| Vehicle | `junk-rotor` | Junk Rotor | Air | Light | 1 | `machine-vehicle-air` | standard | 40 | 12 fly |
| Vehicle | `skyhunter` | Skyhunter | Air | Heavy | 3 | `machine-vehicle-air` | fast | 80 | 14 fly |
| Vehicle | `tiltjet` | Tiltjet | Air | Vehicle | 2 | `machine-vehicle-air` | fast | 60 | 14 fly |
| Vehicle | `crotch-rocket` | Crotch-Rocket | Ground | Light | 1 | `machine-vehicle-bike` | fast | 20 | 12 walk |
| Vehicle | `scrap-bike` | Scrap-Bike | Ground | Light | 1 | `machine-vehicle-bike` | fast | 20 | 12 walk |
| Vehicle | `warbike` | Warbike | Ground | Light | 3 | `machine-vehicle-bike` | fast | 40 | 12 walk |
| Vehicle | `cage` | Cage | Ground | Vehicle | 3 | `machine-vehicle-car` | standard | 80 | 10 walk |
| Vehicle | `clunker` | Clunker | Ground | Vehicle | 1 | `machine-vehicle-car` | slow | 40 | 8 walk |
| Vehicle | `getaway` | Getaway | Ground | Vehicle | 1 | `machine-vehicle-car` | standard | 40 | 10 walk |
| Vehicle | `grey-cab` | Grey Cab | Ground | Vehicle | 2 | `machine-vehicle-car` | standard | 60 | 10 walk |
| Vehicle | `hardtop` | Hardtop | Ground | Vehicle | 2 | `machine-vehicle-car` | standard | 60 | 10 walk |
| Vehicle | `rustbucket` | Rustbucket | Ground | Vehicle | 1 | `machine-vehicle-car` | standard | 40 | 10 walk |
| Vehicle | `workhorse` | Workhorse | Ground | Vehicle | 1 | `machine-vehicle-car` | slow | 40 | 8 walk |
| Vehicle | `brick` | Brick | Ground | Heavy | 3 | `machine-vehicle-heavy` | standard | 160 | 8 walk |
| Vehicle | `flatbed` | Flatbed | Ground | Heavy | 2 | `machine-vehicle-heavy` | slow | 120 | 6 walk |
| Vehicle | `iron-giant` | Iron Giant | Ground | Heavy | 4 | `machine-vehicle-heavy` | standard | 200 | 8 walk |
| Vehicle | `spider-frame` | Spider-Frame | Ground | Heavy | 4 | `machine-vehicle-heavy` | slow | 200 | 6 walk |
| Vehicle | `mule` | Mule | Space | Heavy | 3 | `machine-vehicle-space` | extreme | 160 | 16 fly |
| Vehicle | `pod` | Pod | Space | Vehicle | 2 | `machine-vehicle-space` | extreme | 120 | 16 fly |
| Vehicle | `reaver` | Reaver | Space | Capital | 4 | `machine-vehicle-space` | extreme | 200 | 16 fly |
| Vehicle | `void-runner` | Void-Runner | Space | Heavy | 4 | `machine-vehicle-space` | extreme | 200 | 16 fly |
| Vehicle | `cigarette` | Cigarette | Water | Vehicle | 1 | `machine-vehicle-water` | fast | 40 | 10 swim |
| Vehicle | `harbor-cutter` | Harbor Cutter | Water | Vehicle | 2 | `machine-vehicle-water` | standard | 60 | 8 swim |
| Vehicle | `leviathan` | Leviathan | Water | Heavy | 4 | `machine-vehicle-water` | standard | 100 | 8 swim |
| Vehicle | `river-fang` | River-Fang | Water | Vehicle | 3 | `machine-vehicle-water` | fast | 80 | 10 swim |
| Vehicle | `sink-skiff` | Sink-Skiff | Water | Light | 1 | `machine-vehicle-water` | slow | 40 | 6 swim |
| Vehicle | `skiff` | Skiff | Water | Light | 1 | `machine-vehicle-water` | standard | 40 | 8 swim |
| Vehicle | `wetsub` | Wetsub | Water | Vehicle | 2 | `machine-vehicle-water` | slow | 60 | 6 swim |

## 4. Later

- Numeric pass: real Integrity / Speed / Armor / Handling per chassis; then 1:1 Actors for signature SKUs if wanted.
- Player-side Deploy without Director permissions (socket to the GM), Wrench Deploy & Command hook, Fleet Size enforcement, Jump-In buffer automation.
