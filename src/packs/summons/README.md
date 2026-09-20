# Ghostwire Summons & Machines (Actor pack)

Conjured and fielded **Actors** that get Scene tokens.

| Folder | Contents | Phase |
|---|---|---|
| sprites/ | Technomancer Data/Attack/Machine/Ward × minor/intermediate/advanced | 1 |
| agents/ | Hacker Probe/Spike/Daemon/Watchdog × minor/intermediate/advanced (B120; not sprite Actors) | 1b |
| elementals/ | Elementalist companions + elemental ranks (placed and scaled by the summon abilities: `scripts/veil-summons.mjs`, B53) | 2 |
| spirits/ | Street Priest pact spirits (3 + Light/Dark tint; placed and scaled by Invoke the Pact: `scripts/veil-summons.mjs`, B53) | 3 |
| machines/ | Drone & vehicle **scale-band Actor templates** plus named **Mule-Bot** / **Lane-Hopper** / **Star-Chopper** / **Bulldog** for Director-placed unowned machines (Items stay `treasure` in `vehicles`; Deploy / Recall in `scripts/machines.mjs` always uses the band; map in `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`) | 4 |
| nodes/ | Wired node token templates (Track 1 / Track 2) placed from the Wired Console's **Place on canvas** (`scripts/wired-node-tokens.mjs`); the 10 Director presets live in `scripts/wired-node-templates.mjs` | 5 / 5b |

Dual representation for drones/vehicles: **treasure Item** (ownership / ¥ / mods) + **Actor** (token). Deploy stamps the matching scale-band template. Named SKU Actors are optional Director placement, not a replacement for the Item.