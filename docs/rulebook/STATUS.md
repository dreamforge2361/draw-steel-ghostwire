# Rulebook draft status

| Chapter | File | Status |
|---|---|---|
| Stage 1 skeleton | `docs/rulebook/00-STAGE1-skeleton.md` | Accepted |
| Operator–Hacker (01–08) | `docs/rulebook/01`–`08` | **Approved** + **DS terminology pass** (2026-09-16) |
| Species | `docs/rulebook/09-species.md` | **All eight Peoples as DS ancestry packages** |
| Kits | `docs/rulebook/10-kits.md` | Interim DS pass + chargen street-band / Mods pointer |
| **Economy** | `docs/rulebook/11-economy.md` | **Stage 3 draft** — §Craft + Kits chargen gear notes (2026-09-16/17) |
| **Chrome** | `docs/rulebook/12-chrome.md` | **Stage 3 draft** (2026-09-16) — distilled from master |
| **Backgrounds & Professions** | `docs/rulebook/13-backgrounds-professions.md` | **v1 draft** (2026-09-16) — Foundry packs shipped |
| **Mods** | `docs/rulebook/14-mods.md` | **Stage 3 draft locked** 2026-09-16/17 — Invent a Mod; echelon gear remap |
| **Drones** | `docs/rulebook/15-drones.md` | **Stage 3 draft** 2026-09-16 — inventory (25) + anyone-vs-Wrench; lore extract in masters |
| **Vehicles** | `docs/rulebook/16-vehicles.md` | **Stage 3 draft** 2026-09-16 — per-echelon Reach inventory (32) + anyone-vs-Wrench; chase lean |
| **ART-STYLE** | `docs/rulebook/ART-STYLE.md` | **Locked** 2026-09-16 |
| Chrome master | `docs/masters/GHOSTWIRE_CHROME_MASTER.md` | **Ingested** 2026-09-16 |
| **Gear master** | `docs/masters/GHOSTWIRE_GEAR_MASTER.md` | **Ingested** + DS ALIGNMENT OVERRIDE (2026-09-16) |
| **Medic (Foundry)** | `src/packs/classes/medic/` | **B26 Foundry-verified** (2026-09-16) — Reagents persist across encounters. **B26b gap locks** (toxin numbers, 2× L9 picks, Anesthetize power roll, Reagents spend outside combat) Foundry-verified. **B26c** Nerve Toxin/Agent 6 + Instinct + master sync Foundry-verified |
| **Wrench (Foundry)** | `src/packs/classes/wrench/` | **B27 Foundry-verified** (2026-09-16) — Uptime v1; machines inventory backlog. **B27b polish** (Overclock / L6 / L9 rules, three rigger Kits: Fabricator's Bench, Rigger's Harness, Field Chassis) Foundry-verified |
| **Elementalist (Foundry)** | `src/packs/classes/elementalist/` | **B28 Foundry-verified** (2026-09-16) — Essence drip; Cyborg exclusion enforced (Arcane Severance gate); Veil chapter still backlog |
| **Street Priest (Foundry)** | `src/packs/classes/street-priest/` | **B29 Foundry-verified** (2026-09-17) — Light/Dark pact overlay; Cyborg-blocked; Veil chapter still backlog |
| **Hacker (Foundry)** | `src/packs/classes/hacker/` | **B30 Foundry-verified** (2026-09-17) — three street cyberdeck Kits; Matrix Verbs stay universal |
| **Technomancer** | `docs/rulebook/20-technomancer.md` (from `docs/masters/GHOSTWIRE_TECHNOMANCER_DEVELOPMENT_MASTER.md` Part 1) | **Stage 2 draft** (2026-09-17) — Power Roll results in DS print order; pending Michael review |
| **Technomancer (Foundry)** | `src/packs/classes/technomancer/` | **B31 Foundry-verified** (2026-09-17) — nine classes in Ghostwire Classes; Cyborg-blocked |
| **Summons — Drones & vehicles (Foundry)** | `src/packs/summons/machines/` + `scripts/machines.mjs` | **B32 Phase 4 Foundry-verified** (2026-09-17) — 9 scale-band templates; Item sheet Deploy / Recall spawns a linked token and cleans it up; band map `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`; provisional numbers; Item catalog sync still open |
| **Summons — Street Priest pact spirits (Foundry)** | `src/packs/summons/spirits/` | **B32 Phase 3 Foundry-verified** (2026-09-17) — Guardian / Warrior / Hunter; one Actor per ministry with Pact: Light / Pact: Dark tint effects (holy vs corruption strikes, token tint, flags.pact); provisional Stamina 20 |
| **Summons — Elementalist companions + elementals (Foundry)** | `src/packs/summons/elementals/` | **B32 Phase 2 Foundry-verified** (2026-09-17) — Ember / Zephyr / Boulder Companions with strikes; Rank 1–3 + Greater elemental scaffolds; provisional Stamina 15 × Rank until Veil §C3 |
| **Summons — Technomancer sprites (Foundry)** | `src/packs/summons/sprites/` | **B32 Phase 1 Foundry-verified** (2026-09-17) — 12 sprite npc Actors (4 archetypes × 3 hybrid tiers), Known Bugs #13 HP placeholders; Compile Sprite token stamping is backlog |
| Skills master | `docs/masters/GHOSTWIRE_SKILLS_MASTER.md` | Ingested 2026-09-16 (Insight skill; five attrs) |
| **Languages** | `docs/rulebook/19-languages.md` + `docs/masters/GHOSTWIRE_LANGUAGES.md` | **Names locked** 2026-09-16 (B25) — stub chapter; lore backlog |
| Species↔DS map | `docs/rulebook/SPECIES-DS-MAP.md` | Chassis locked |
| DS alignment brief | `docs/rulebook/DS-ALIGNMENT.md` | Locked doctrine (+ gear echelon note) |
| **Foundry build plan** | `docs/rulebook/FOUNDRY-BUILD-PLAN.md` | **Living done/todo log** |

**Foundry note:** eight Peoples ancestry packages (rulebook). Chrome pack + Body Integrity costs shipped. Gear pack (Kit-qualifying) shipped. **B19** full gear import / **B20** mods expansion = Claude owns Foundry `src/packs` JSON — docs-only agents do not touch packs.

## Next (rulebook)

1. Michael review: **15-drones** + **16-vehicles** (anyone-vs-Wrench + per-echelon inventories).
2. Journal / PDF delivery pass (chapters → Foundry Journal + printable PDF) — later.
3. Stage 3 shared core / Stage 4 Wire–Veil–Machines (parallel track; Buildings stub after vehicles sign-off).
4. Armor + gadget mod family writeups as B20 lands.

## Next (Foundry) — see FOUNDRY-BUILD-PLAN.md

1. **B19** — full gear import (in progress / pending verify) — Claude.
2. **B20** — mods expansion + Invent a Mod data aligned to `14-mods.md` — Claude.
3. Class packs / remaining Peoples / C0 test world as capacity allows.
4. Delivery: PDF + Journal from `docs/rulebook/` (echelon + Availability; no GW item-tier ladder in player text).

## Backlog (locked 2026-09-16)

| Item | Notes |
|---|---|
| **Stage 4 — The Wire (Matrix)** standalone chapter | Extract Wired System from `08-hacker.md` into its own chapter (e.g. `17-wired.md`): Nodes, Overlay/Jacked In, Track 1/2, Node Rating card, Trace Alert, Matrix Verbs for everyone. Keep Hacker Programs/Bandwidth in class chapter. Align deck ladder with Gear Cat 4; clarify anyone-vs-Hacker gap (verbs only vs Programs + Bandwidth). Reconcile Body Integrity pointer to Chrome max 20. |
| Wire Foundry pack (thin) | After Wire chapter draft: Matrix Verbs + node templates as Journal/Items — defer until rule text approved |
| Vehicles Foundry sync | `16-vehicles.md` → expand `vehicles` pack to full per-echelon inventory |
| Drones Foundry sync | `15-drones.md` (36 chassis) → expand drones in vehicles or dedicated pack |
| B20 Mods expansion | Armor/gadget mods + §Craft skill text (Hacking/Electronics/Repair) in Foundry |
| Kit chargen street-band auto-grants | After gear SKUs stable |
| Journal rulebook pack + PDF pipeline | Dual delivery already locked |
| **Language lore & journals** | Write a lore-based definition (history + purpose) for each Ghostwire language (`docs/masters/GHOSTWIRE_LANGUAGES.md`) into the rulebook chapter `19-languages.md` (Tongue gazetteer) + Foundry Journal entries. Then add Background/Profession/Peoples language grants (knowledge-only picks locked in the master). |

| **Support entities program (Phase 0 done 2026-09-17)** | Master: `docs/masters/GHOSTWIRE_SUPPORT_ENTITIES.md`. Phase 1 Technomancer sprites (12) → 2 Elementalist → 3 Street Priest spirits → 4 drones/vehicles → 5 Hacker ICE/nodes. |


| **Wired vision tints (Overlay / Jacked In)** | B23c | **Backlog** (after Support Entities Phase 5) - Overlay = color wash, world readable; Jacked In = dark/shadowed meatspace; status-driven from B23a AEs |
