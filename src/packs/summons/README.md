# Ghostwire Summons & Machines (Actor pack)

Conjured and fielded **Actors** that get Scene tokens.

| Folder | Contents | Phase |
|---|---|---|
| sprites/ | Technomancer Data/Attack/Machine/Ward × minor/intermediate/advanced | 1 |
| elementals/ | Elementalist companions + elemental ranks (placed and scaled by the summon abilities: `scripts/veil-summons.mjs`, B53) | 2 |
| spirits/ | Street Priest pact spirits (3 + Light/Dark tint; placed and scaled by Invoke the Pact: `scripts/veil-summons.mjs`, B53) | 3 |
| machines/ | Drone & vehicle **scale-band Actor templates** (Items stay in `vehicles` pack; Deploy / Recall in `scripts/machines.mjs`; map in `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`) | 4 |
| nodes/ | Wired node token templates (Track 1 / Track 2) placed from the Wired Console's **Place on canvas** (`scripts/wired-node-tokens.mjs`); the 10 Director presets live in `scripts/wired-node-templates.mjs` | 5 / 5b |

Dual representation for drones/vehicles: Item (ownership/¥/mods) + Actor (token). Deploy links them via flags.