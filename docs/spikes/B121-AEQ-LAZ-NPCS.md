# Spike B121 — AEQ Mandate + LAZ Extract conglomerate NPCs

**Date:** 2026-09-20  
**Module:** **0.3.78**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)

## Goal

Ship four named Conglomerate opposition Actors with Michael’s plates, LE / combat-medic kits, and **Wire Kit** on every sheet. Faction flags `aeq` / `laz` for Director filters. Cross-link seated Ten (Ghostwire Lore → Ten Conglomerates). Do not invent Congress seats. Do not regenerate art. No PDF. No Gold Line `{ force: true }`.

## Actors (locked names)

| Slug | Name | Folder | Faction | Spine |
|---|---|---|---|---|
| `aeq-trooper` | Mandate Trooper | Aequitas Mandate | `aeq` | Corp Security Officer (minion) |
| `aeq-sergeant` | Mandate Sergeant | Aequitas Mandate | `aeq` | Ironclad Subcommander (horde support) |
| `laz-medic` | Extract Medic | Lazarus Extract | `laz` | Street Doc (platoon support) |
| `laz-chief-medic` | Extract Chief Medic | Lazarus Extract | `laz` | Rival Commander envelope + Street Doc med kit |

Folders nest under **Corp & Security**.

## Art

| Plate | On disk | Stamped on |
|---|---|---|
| Aequitas Mandate officer | `assets/tokens/bestiary/aeq/aequitas-mandate-officer.{png,webp}` | both AEQ ranks |
| Lazarus combat medic | `assets/tokens/bestiary/laz/lazarus-combat-medic.{png,webp}` | both LAZ ranks |

PNG 1254² source + 1024² WebP (ARG convention). Apply-tool `ART_OVERRIDES` maps slugs to those stems.

## Kit / Wire

- AEQ: sidearm + baton, zip-cuffs, HUD/radio chrome, Wire Kit.
- LAZ: trauma bag, Stabilize / Trauma Patch / Stimulant Dart, light stun sidearm, Medical HUD, Wire Kit.
- Sergeant / Chief: better Stamina + command aura vs the trooper band.
- All four start Disconnected. Token `sight.enabled: true`.

## Verify

```text
node tools/aeq-laz-npc-smoke.mjs
node tools/apply-bestiary-portrait-art.mjs --list
node tools/build-packs.mjs bestiary rulebook   # Foundry closed
```

Foundry checklist: `docs/directors/conglomerate-npcs.md`.
