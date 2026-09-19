# B99 — Mama Cassavir club battlemap (still + animated loop)

**Date:** 2026-09-19  
**Module:** **0.3.26** (loop v1; still shipped in **0.3.25**)  
**Status:** **STILL LOCKED** (Michael-approved **B3**) **+ animated loop v1 approved** (Michael thumbs-up). Neon brightness/saturation ping-pong flicker; **no layout drift** so tokens stay stable.  
**Journals / packs:** **not** touched.

## Lock

- Flat top-down club interior, Foundry **5 ft–friendly** furniture scale.
- Approved still: **B3** (`mama-cassavir-club-B3`).
- Approved loop v1: same locked plate; neon / signage / booth glow ping-pongs brightness and saturation. Camera, furniture, walls, and dance-floor ring **do not move**.
- Credit: Ghostwire AI (AI-generated). No external-IP name-checks (B78/B83).

## Shipped (0.3.25) — still

| Path | Dims | Notes |
|---|---|---|
| `assets/maps/battlemaps/mama-cassavir-club.webp` | 1280×720 native | High-quality WebP (q95). **No downscale.** |

Foundry Scene still background: `modules/draw-steel-ghostwire/assets/maps/battlemaps/mama-cassavir-club.webp`

## Shipped (0.3.26) — animated loop v1

| Path | Dims / codec | Notes |
|---|---|---|
| `assets/maps/battlemaps/mama-cassavir-club-loop.webm` | 1280×720, VP9, 24 fps, ~4.2 s, ~3.5 Mbps | **Preferred Foundry** video background. Native res; **no downscale.** |
| `assets/maps/battlemaps/mama-cassavir-club-loop.mp4` | 1280×720, H.264, 24 fps, ~4.2 s | Fallback / preview copy of the same loop. |

Foundry Scene video background: `modules/draw-steel-ghostwire/assets/maps/battlemaps/mama-cassavir-club-loop.webm`

Loop behavior (v1, approved):

- Neon ring, bar-back strips, booth glows, and side-room signage ping-pong **brightness / saturation**.
- Layout is locked to the B3 still — no pan, zoom, or furniture drift (tokens stay on the same squares).

Location battlemaps follow the B72 play-surface convention (`assets/maps/` native-res). They are **not** print-art plates — Reach / rulebook PDF still uses `assets/maps/districts/` for district overviews and does not pull venue maps from `docs/manuscript/print-art/` (B88). PNG originals stay local under `assets/maps/battlemaps/_png-backup/` (gitignored).

Scenes are **not** auto-created. Drop the WebP still or the WebM loop onto a Scene when you need the play surface.

## Forthcoming (not this PR)

- Scene JSON / walls / lighting.
- Journal or handbook page wiring.

## Checklist

- [x] B3 still converted to WebP at native resolution
- [x] `assets/maps/battlemaps/mama-cassavir-club.webp`
- [x] `module.json` **0.3.25** (still)
- [x] Journals / packs not regenerated
- [x] Animated loop v1 (WebM + MP4, native 1280×720)
- [x] `module.json` **0.3.26** (loop)
