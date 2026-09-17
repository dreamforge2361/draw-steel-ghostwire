# Spike B39 — Director Run Generator (v1)

**Repo:** draw-steel-ghostwire  
**Depends on:** Bestiary Wave 1 + 2a + B38b.1 on main (v0.1.53) — opposition + named patrons exist.  
**Design stub:** `docs/directors/run-generator.md` (expand/keep in sync).  
**Do NOT commit or push.** Leave ready for Michael Foundry-verify.  
**Bump** module.json one patch from current (read disk; expect 0.1.53 → 0.1.54).

## Goal
Director-facing **ApplicationV2 popup** (same UX family as Wired Console) that generates a Reach-themed Shadowrun-style run: dials → Generate → result card + **mission Journal Entry** with pay, beats, and recommended bestiary Actors.

## UX
- Scene control / menu entry next to Wired Console (GM/Director only).
- Form controls: Run name (editable), Hero level 1–10, Echelon 1–4 (auto from level, overridable), Run type, Stratum, Heat, Wired intensity, optional Seed.
- Buttons: **Generate**, **Reroll** (same seed or new), **Create Journal** (or auto-create on Generate).
- Result panel: Brief, Pay (¥), Data value (if Wire), Challenges, Opposition (names + pack links), Support NPCs, Scenes-to-assign notes.

## Run types (v1)
Extraction, Data Steal, Sabotage, Protection/Escort, Wetwork, Courier/Smuggle, Recon, Exorcism/Veil.  
Stub only (disabled or thin tables): Wilds Survey.

## Strata (v1)
Crown, Spires, Grid, Flats, Sinks, Deadfall, Cinderhold, Wastes–Outer Wall.

## Data tables
Put under `src/data/runs/` (or `scripts/data/runs/`) as JSON the generator imports:
- `run-types.json` — beats templates, default Wired intensity, heat bias
- `strata.json` — opposition region tags, patron pool weights, forbidden/allowed types
- `patrons.json` — Mama Cassavir, Nyx cutout, corp anonymous, Greenline, Cael Marrow, Krael, Ferryman, Choirmother (weights by stratum)
- `pay.json` — ¥ bands from `docs/rulebook/11-economy.md` Run payouts, scaled by level/echelon/heat
- `opposition-map.json` — map stratum + heat + type → bestiary folder/region flags + named Actor keys

Opposition must resolve against **live** `bestiary` pack Actors (UUID or pack name+id) where possible: Colors Boss, Chrome Bruiser, Corp Enforcer, Response Lieutenant, Ironclad Warden, Warlord, ICE, critters, Canopy-Stalker (Outer Wall only), named bosses as patrons not always as enemies.

## Pay (provisional — from Economy)
| Job scale | ¥ crew share |
|---|---|
| Street / gang | 500–2,000 |
| Mid / district | 2,000–8,000 |
| Corp / extraction | 5,000–20,000 |
Scale with heat and echelon; print range + suggested midpoint on the card.

## Implementation
1. `scripts/run-generator.mjs` — ApplicationV2 + Handlebars `templates/run-generator.hbs` + CSS in `styles/ghostwire.css`.
2. Register from `scripts/module.mjs` like Wired Console (scene control button + API `game.ghostwire?.openRunGenerator`).
3. Journal: folder “Ghostwire Runs” (create if missing); pages or sections Brief / Pay / Beats / Opposition / Support / Scenes; store generator params in `flags.draw-steel-ghostwire.run`.
4. Lang keys under `GHOSTWIRE.RunGenerator.*`.
5. Seeded PRNG so same seed + params reproduce.

## Mirror Wired Console patterns
Read `scripts/wired-console.mjs` for ApplicationV2 PARTS, GM gate, refresh habits. Do not break Console.

## Out of scope (v1)
Auto Scene build; drag-spawn all opposition; B40 SFX; B41 minimap; deep Pandora wilds tables; player-facing UI.

## Docs
Update `docs/directors/run-generator.md` Status → implementing / pending verify. STATUS + FOUNDRY-BUILD-PLAN: B39 pending Foundry-verify.

## Done when
Popup opens for GM; Generate fills card; Journal created with sensible Reach fiction; opposition names match bestiary; checklist printed; **no commit**.

## Foundry test checklist (print when finished)
1. GM opens Run Generator from scene controls (or menu); players do not.
2. Dial Flats + Extraction + mid heat + level 3 → Generate shows Brief, ¥ band, beats, opposition (e.g. Colors Boss / Chrome Bruiser).
3. Create Journal appears under Ghostwire Runs with params stored in flags.
4. Data Steal + Jacked-in intensity mentions Watchdog → Scrambler → Black ICE ladder.
5. Reroll with same seed reproduces; new seed differs.
6. Wired Console still opens and works.