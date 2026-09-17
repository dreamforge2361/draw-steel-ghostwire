# Ghostwire Summons & Machines (Actor pack)

Conjured and fielded **Actors** that get Scene tokens.

| Folder | Contents | Phase |
|---|---|---|
| sprites/ | Technomancer Data/Attack/Machine/Ward × minor/intermediate/advanced | 1 |
| elementals/ | Elementalist companions + elemental ranks | 2 |
| spirits/ | Street Priest pact spirits (3 + Light/Dark tint) | 3 |
| machines/ | Drone & vehicle **scale-band Actor templates** (Items stay in `vehicles` pack; Deploy / Recall in `scripts/machines.mjs`; map in `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`) | 4 |
| nodes/ | Hacker Track1/Track2 node Actors — **deferred**; Phase 5 shipped the 10 templates in the Wired Console (`scripts/wired-node-templates.mjs`) | 5 |

Dual representation for drones/vehicles: Item (ownership/¥/mods) + Actor (token). Deploy links them via flags.