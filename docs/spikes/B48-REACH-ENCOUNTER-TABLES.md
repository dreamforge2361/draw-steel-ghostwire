# Spike B48 — Reach Random Encounter / Event RollTables

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/random-encounter-tables.md`; bestiary pack; B46 Flats gazetteer (tone/POIs); B39 strata names (optional cross-link).  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch; rebuild with Foundry closed.

## Goal
Ship a **robust** Foundry **RollTable** pack so a Director can draw zone-flavored Reach events: mostly atmosphere and RP hooks, sometimes complications, rarely chase or combat — Hive/Flats, City/Grid-adjacent, and a thin Wilds seed table.

## Pack
- `name`: `encounters` (or `reach-events`)
- `label`: `GHOSTWIRE.COMPENDIUM.encounters` → **Ghostwire Reach Events**
- `type`: `RollTable`
- `path`: `packs/encounters`
- `system`: `draw-steel`
- Ownership: `PLAYER: OBSERVER` is fine (results are text; combat links still Director-facing in practice) **or** `PLAYER: NONE` / LIMITED if you want GM-only draws — **prefer PLAYER: NONE, ASSISTANT: OWNER** so players don’t browse the tables. Directors draw from Compendium.

Register in `module.json`. Source under `src/packs/encounters/`. Rebuild `node tools/build-packs.mjs`.

## Table architecture (LOCKED for v1)

### Top-level drawers (3)
1. **Reach Events — Flats / Hive** (`reach-flats`)
2. **Reach Events — City / Grid-adjacent** (`reach-city`)
3. **Reach Events — Wilds / Outer Wall** (`reach-wilds`) — **seed**: fewer rows OK (~20–30), lore-thin is fine

### Nested design (preferred)
Each zone table is a **parent** whose results are mostly **RollTable draws** into typed child tables, **or** one fat zone table with typed rows and weight bands. Prefer **one fat table per zone** if nested table UUIDs are painful in pack JSON — either is OK if drawing works in Foundry.

If nested:
- `{zone}-flavor`
- `{zone}-rp`
- `{zone}-complication`
- `{zone}-action`
- `{zone}-combat`

Parent weights (quiet-night default):

| Result kind | Weight share (approx) |
|---|---|
| Flavor / atmosphere | 40% |
| RP / social hook | 30% |
| Complication / travel | 15% |
| Action / chase | 10% |
| Combat encounter | 5% |

Optional second parent per zone: **`{zone}-hot`** with combat/action raised (e.g. 20% / 15%) and flavor cut — nice-to-have, not required for v1.

### Row counts (minimum)
| Zone | Min total results (across types) |
|---|---|
| Flats / Hive | **60+** |
| City / Grid | **50+** |
| Wilds | **20+** (seed) |

Not a dozen rows total — this needs to feel like a living book.

## Result text format
Each text result:
1. **Title** (short, bold-worthy)
2. **1–3 sentences** of Ghostwire voice (neon, rain, Signal, corps, gangs, Wire bleed — no generic fantasy dungeon)
3. Optional **Director:** nudge (`If they dig…` / `If they ignore…` / `Heat +1 if…`)

Combat rows:
- Name opposition + count/echelon hint
- Link bestiary Actor via `@UUID[Compendium.draw-steel-ghostwire.bestiary.Actor.…]` when IDs known; else plain name matching pack (Director drags manually)
- Prefer street/corp/critter/ICE already in bestiary (Colors Boss, Chrome Bruiser, Corp Enforcer, Chrome-Rat, Watchdog ICE, etc.). **Do not** auto-spawn tokens.

## Authoring SoR
Write **`docs/masters/GHOSTWIRE_ENCOUNTER_TABLES.md`** (or `docs/masters/encounters/*.md` + build script) listing every row: zone, kind, weight, title, body, combat link. Pack JSON generated from that file if practical (`tools/encounters-to-tables.mjs`) so Michael can edit prose without hand-editing LevelDB.

Update stub status + STATUS + FOUNDRY-BUILD-PLAN.

## Content mines
- `docs/setting/wired-flats-gazetteer.md` / B46 journals (POIs, districts)
- Bestiary names under `src/packs/bestiary/`
- Run Generator strata labels (Flats, Extraction, etc.) as optional tags in Director notes
- Reach Handbook tone if already extracted elsewhere — do **not** require full B45

## Out of scope (v1)
Director ApplicationV2 “Roll Reach Event” button (v2); canvas auto-spawn; weather engine; Warrens/Sinks/Cinderhold dedicated tables; replacing B39; inventing new bestiary Actors; full wilds lore bible.

## Done when
- Compendium **Ghostwire Reach Events** registered; three zone tables draw cleanly in Foundry.
- Row-count floors met; mix matches weight intent.
- Master markdown SoR present; combat rows name real bestiary entries.
- Module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Open compendium Ghostwire Reach Events (GM can draw).
2. Draw 5× from Flats — see flavor and at least one RP/complication over the set.
3. Draw from City and Wilds — voice fits; Wilds is thin but usable.
4. Spot one combat row — names a known bestiary Actor (UUID or clear name).
5. `GHOSTWIRE_ENCOUNTER_TABLES.md` (or equivalent) lists the rows.
6. No new RAW; no auto-spawn code required.