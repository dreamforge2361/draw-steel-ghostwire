# B39 — Director Run Generator (backlog)

**Status:** Backlog locked 2026-09-17 — design stub only; implement after Bestiary Wave 1 is usable (adversary pool to recommend).  
**UX model:** ApplicationV2 popup like **Wired Console** (`scripts/wired-console.mjs`) — Director-facing, not on the hero sheet.

## Goal
In a pinch, open **Run Generator**, dial parameters, hit Generate, get a themed Shadowrun-style run for The Reach with pay/rewards, challenges, recommended NPCs/adversaries/threats, and a **mission Journal** you can attach Scenes/Items/Actors to.

## Controls (adjustable)
| Control | Notes |
|---|---|
| Run name | Auto-suggest + editable |
| Hero level | 1–10 (DS) |
| Echelon | 1–4 (derived or override) |
| Run type | Extraction, Data Steal, Sabotage, Protection/Escort, Wetwork, Courier/Smuggle, Recon, Exorcism/Veil, Wilds Survey (later) |
| Stratum | Crown / Spires / Grid / Flats / Sinks / Deadfall / Cinderhold / Wastes–Outer Wall |
| Heat / Corp interest | Low–Extreme (scales Alert, response ladder, pay) |
| Wired intensity | None / Overlay scrape / Jacked-in node run |
| Seed | Optional lock for rerolls |

## Output (one card + Journal)
1. **Brief** — patron hook (Mama Cassavir / Nyx / corp cutout / Greenline / anonymous), objective, success/fail clocks.
2. **Pay** — ¥ band by level + echelon + heat (align `11-economy.md`); optional corp scrip / favor / gear Availability bump.
3. **Data value** — if Data Steal / Wire: node Rating band, ICE ladder hint (Watchdog → Scrambler → Black ICE).
4. **Challenges** — 3–6 beats (infiltrate, social, combat, chase, Wire, Veil).
5. **Recommended opposition** — from Ghostwire Bestiary flags by region + echelon (Colors Boss, Chrome Bruiser, Corp Enforcer, Canopy-Stalker, etc.).
6. **Recommended support NPCs** — Street Doc, Fixer, Gate Contractor, Ranger contact.
7. **Mission Journal** — create/update a Journal Entry in a Director folder with sections Brief / Pay / Beats / Opposition / Scenes to assign; optional links to Actor UUIDs once bestiary pack exists.
8. **Populate helpers** (phase 2) — button to open recommended Actors; optional stub Scene notes.

## Scaling rules (sketch)
- Stratum gates opposition families (Aureole in Crown; Metermen/Grid; Flats gangs; Sinks Hollow/Veil; Outer Wall wilds seeds only until Pandora pass).
- Echelon picks STA/ATK bands and whether Leaders/Solos appear.
- Heat advances Alert response (Lieutenant → Enforcer → Warden / drone flights).
- Remap any Handbook inverted-Tier language to level/echelon in UI copy.

## Implementation sketch
- `scripts/run-generator.mjs` — ApplicationV2 + Handlebars part(s).
- Menu entry next to Wired Console (Director tools).
- Tables JSON under `docs/directors/run-generator/` or `src/data/runs/` (types, strata, hooks, pay curves).
- Depends on: Economy ¥ bands; Bestiary pack flags `region` + echelon; Wired Console concepts for Wire runs.

## Out of scope (v1)
Full procedural Scene build; automating combat; deep Pandora wilds tables (stub “Wilds Survey” until lore pass); art.

## Done when (future spike)
Popup opens; Generate fills card; Journal created; recommendations resolve to bestiary Actors when pack exists; Foundry-verify; no commit until Michael says.