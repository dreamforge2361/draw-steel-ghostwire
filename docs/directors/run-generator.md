# B39 — Director Run Generator

**Status:** Done — Foundry-verified (module v0.1.54+).
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
5. **Recommended opposition** — from the Ghostwire Bestiary by stratum + run type, filtered by Actor level against hero level and heat (Colors Boss, Chrome Bruiser, Corp Enforcer, Canopy-Stalker, etc.), plus the escalation ladder above the current heat.
6. **Recommended support NPCs** — per stratum: Street Doc, Mama Cassavir, Krael, the Ferryman, the Choirmother, Cael Marrow, and unnamed contacts (facilities tech, Metermen boss, Greenline scout, remnant Street Priest).
7. **Mission Journal** — a Journal Entry in **Ghostwire Runs** with pages Brief / Pay / Beats / Opposition / Support / Scenes, linked to bestiary Actors.
8. **Populate helpers** (phase 2) — button to open recommended Actors; optional stub Scene notes.

## Scaling rules (sketch)
- Stratum gates opposition families (Aureole in Crown; Metermen/Grid; Flats gangs; Sinks Hollow/Veil; Outer Wall wilds seeds only until Pandora pass).
- Echelon picks STA/ATK bands and whether Leaders/Solos appear.
- Heat advances Alert response (Lieutenant → Enforcer → Warden / drone flights).
- Remap any Handbook inverted-Tier language to level/echelon in UI copy.

## Implementation (v1, as built)
- **Open it:** Token controls › **Run Generator** (briefcase, Directors only — players never see the button), an unbound **Toggle Run Generator** keybinding (Configure Controls), or `game.ghostwire.openRunGenerator()` / `game.modules.get("draw-steel-ghostwire").api.openRunGenerator()`.
- **Files:** `scripts/run-generator.mjs` (ApplicationV2 + journal writer + registration), `scripts/run-tables.mjs` (pure seeded generator, no Foundry globals), `templates/run-generator.hbs`, CSS `.ghostwire-run-generator` in `styles/ghostwire.css`, lang `GHOSTWIRE.RunGenerator.*`.
- **Tables** (`scripts/data/runs/`, fetched at runtime — edit and reload, no pack rebuild):
  - `run-types.json` — per type: pay scale, default Wired intensity, heat bias, targets (full + short form), objectives, beat pools (approach / obstacle / climax / exit); shared twists, Wired and Veil beats, run-name parts. Wilds Survey is a stub limited to Cinderhold / Wastes.
  - `strata.json` — name, blurb, security (0–4), pay floor, response ladder family, node Rating band, allowed Wired intensities, places, complications (twists), Alert response text by heat, support contacts.
  - `patrons.json` — Mama Cassavir, a Nyx Churn broker, an anonymous corp cut-out, a Greenline officer, Cael Marrow, Warden Krael, The Ferryman, The Choirmother: meet location, how they pay, pitches, weight by stratum × run-type bias.
  - `pay.json` — Economy § Run payouts bands (street ¥500–2,000 · district ¥2,000–8,000 · corp ¥5,000–20,000) × echelon (1 / 1.75 / 2.75 / 4) × heat (0.85 / 1 / 1.25 / 1.6), rounded to ¥100; bonus extras; paydata ¥1,500 per node Rating.
  - `opposition-map.json` — bestiary Actor names per stratum and per run type (type pool weighted ×2), Wired ICE by intensity, heat escalation ladders (corp / street / deep / frontier), composition by heat, level reach by heat.
- **Seed:** mulberry32 over a hash of seed + type + stratum + heat + level + echelon + Wired. **Generate** keeps the seed field (blank → a new one); **Reroll** always picks a new seed. The same seed and dials reproduce the run exactly.
- **Opposition:** names resolve against the live `bestiary` pack index (links + real Draw Steel level and organization). Candidates must be at most hero level + heat reach (low 0 / medium +1 / high +2 / extreme +3). Tiers come from organization (minion → squad; horde / platoon / elite → core; leader; solo → boss) and fill by heat (low 1 squad + 1 core … extreme 2 squads + 3 core + leader + boss, with the toughest non-minion standing in when no solo is in reach). Named bosses are only ever patrons or support. A scale-up note appears when the crew outlevels the pick by 3+.
- **Wired:** Overlay adds Watchdog ICE; Jacked-in adds the Watchdog → Scrambler → Black ICE ladder (within level reach, all three at extreme heat), a node Rating band (stratum ∩ echelon), and paydata value for Data Steal.
- **Journal:** **Create Journal** writes a Journal Entry in **Ghostwire Runs** (folder created once, flagged `runsFolder`) with pages Brief / Pay / Beats / Opposition / Support / Scenes and `@UUID` links to bestiary Actors. Dials and seed are stored in `flags.draw-steel-ghostwire.run.params`.
- **Phase 2 (not built):** populate helpers (open / drop recommended Actors), stub Scene notes, run history.

## Out of scope (v1)
Full procedural Scene build; automating combat; deep Pandora wilds tables (stub “Wilds Survey” until lore pass); art.

## Done when (see spike B39)
Popup opens; Generate fills card; Journal created; recommendations resolve to bestiary Actors when pack exists; Foundry-verify; no commit until Michael says.