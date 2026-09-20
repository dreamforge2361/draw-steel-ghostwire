# Spike B107 — Deadhead Beat 0 hangout (Shady Workshop)

**Date:** 2026-09-19  
**Module:** **0.3.43**  
**Status:** **SHIPPED.** Still plate + world-injected Scene. Existing `deadheadHangoutScene` worlds are **never rewritten**. `{ force: true }` is GM-opt-in only.  
**Art lock:** existing CyberMaps plate only — **no AI art generation**. Source `Shady Workshop HD - Gridless.jpg`, converted to WebP like `mama-cassavir-club.webp`.  
**Canyon:** **SKIPPED** — Michael tossed the AI plates. Beat 1's mid-canyon approach is **narrated**; no canyon Scene ships and none is planned.  
**Pairs with:** B104 (Deadhead run pack), B106 (Gold Line map pack), B99 (Mama club battlemap).  
**Hard lock:** `scripts/gold-line-scene.mjs` force / live-scene lock is **untouched** by this spike.

## Goal

Give Beat 0 a real play surface. The Director journal has said "crew hangout — set up" since 0.3.33; this ships it as a still-background Scene the module injects on new worlds, so Beat 0 opens on a map instead of a blank canvas.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Plate | `assets/maps/battlemaps/map-deadhead-hangout.webp` | 1920×1080 still, WebP lossy q90 (~384 KB) |
| Scene template | `data/scenes/deadhead-hangout.json` | Canvas 1920×1080, grid 80 = 5 ft, still background |
| Inject | `scripts/deadhead-hangout-scene.mjs` | Ready-hook creates **Scenes → Deadhead → Deadhead Hangout — Shady Workshop** once (flag `deadheadHangoutScene`) |
| Strings | `lang/en.json` → `GHOSTWIRE.Scenes.DeadheadHangout` | Name / Folder / Injected / Refreshed |
| Director journal | `tools/deadhead-to-journals.mjs` → `src/packs/runs/deadhead/deadhead-director.json` | Beat 0 setup, Beat 1 canyon narration, Foundry checklist |
| Smoke | `tools/deadhead-hangout-smoke.mjs` | Plate dims, template lock, inject contract, journal wording |

## Art

Existing plate only. Copied from `Dropbox/Public/RPG/Ghostwire/art/deadhead-hangout/map-deadhead-hangout-shady-workshop.jpg`
(byte-identical to `Dropbox/Public/RPG/CyberMaps/Shady Workshop HD - Gridless.jpg`) and converted to WebP at native
resolution — same treatment as `mama-cassavir-club.webp`. No downscale, no baked grid, no people added, **nothing generated**.

Fiction fit: wrecked block at night — street stall under a patio umbrella, stacked shipping containers, a parked box truck,
and the crew's open-roof workshop bay (bench, terminal, sofa) on the right. That workshop bay is the flat; the street is
where Nox's freighter gets loaded.

## Scale

Grid **80 px = 5 ft** (square). Canvas is **24 × 13.5** squares = **120 ft × 67.5 ft** of block. Checked against furniture
in the plate: chairs land ~2.8 ft, the sofa ~7.5 ft, the workshop bay ~24 × 36 ft. Foundry 5 ft, same as Gold Line and Mama's.

## Inject contract (mirrors Gold Line, minus the motion)

- GM only. On `ready`, if any Scene already carries flag `deadheadHangoutScene`, **return immediately** — never rewrite
  background, dimensions, grid, walls, lights, or tokens.
- Reuses the Gold Line Scene folder via folder flag `deadheadScenes`, so both Deadhead maps land in one **Deadhead** folder.
- **Still background only.** No Levels, no Tiles, no video playback, no seek guard — there is nothing to loop.
- `ensureDeadheadHangoutScene({ force: true })` is **GM-opt-in only** (`game.ghostwire.ensureDeadheadHangoutScene`) and
  overwrites background / dimensions / grid. The ready hook never passes force.
- Walls, lights, and tokens are **Michael manual**, same policy as Gold Line.

## Director journal changes

- **Beat 0** now opens on `Scenes → Deadhead → Deadhead Hangout — Shady Workshop` instead of a generic "crew hangout".
- **Beat 1** header is `Scene: Gold Line — roofs → drop into L1`; the canyon approach is explicitly **narrated, no map**.
- **Beat 5** return names the hangout Scene.
- **Foundry checklist**: hangout row = **Shipped 0.3.43** with plate path, dims, grid, and the never-rewrite note;
  canyon row = **SKIPPED**.

## Done when

- [x] Plate ships at `assets/maps/battlemaps/map-deadhead-hangout.webp`, 1920×1080, VP8 lossy, BOM-free tree
- [x] `data/scenes/deadhead-hangout.json` is BOM-free, grid 80 / 5 ft, no loop assets
- [x] `registerDeadheadHangoutScene()` runs from `scripts/module.mjs` init alongside `registerGoldLineScene()`
- [x] Second GM load does **not** restamp the Scene (flag short-circuits before `ensure`)
- [x] Director journal + Foundry checklist updated; runs pack rebuilt with Foundry closed
- [x] `node tools/deadhead-hangout-smoke.mjs`, `node tools/deadhead-director-smoke.mjs`, `node tools/gold-line-scene-smoke.mjs` all green
- [x] `scripts/gold-line-scene.mjs` unchanged

## Still open

- Walls / lights / tokens on the hangout Scene (Michael manual, by design).
- Mama's Brief + ARG capsule as Gear pack Items (B104).
- Nox freight-drone token.
