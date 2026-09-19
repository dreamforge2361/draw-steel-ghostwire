# B100 — Switchboard district animated loop

**Date:** 2026-09-19  
**Module:** **0.3.30**  
**Status:** **LOOP LOCKED** — Michael approved v1. Neon pulse, highway traffic, sparse drones / airship. **No** weather, grid overlay, text, or people.  
**Journals / packs / VOIDMARK / Mama walls:** **not** touched.

## Lock

- Top-down Switchboard district play surface, same plate as B72 `clean/01_switchboard.webp` (1254×1254).
- Approved still: locked unlabeled Switchboard plate (source PNG `switchboard-clean.png`).
- Approved loop v1: same locked plate. Arterial neon **pulses** (pink / cyan / white brightness cycle). Headlight / taillight beads travel the overpass and surface streets. Sparse courier-drone specks and one slow airship pass. Camera, interchange clover, and block layout **do not move**.
- Credit: Ghostwire AI (AI-generated). No external-IP name-checks (B78/B83).

## Shipped (0.3.30)

| Path | Dims / codec | Notes |
|---|---|---|
| `assets/maps/districts/switchboard-district-loop.webm` | 1254×1254, VP9, 24 fps, 10.0 s, ~2984 kb/s | **Preferred Foundry** video background. Native res; **no downscale.** |
| `assets/maps/districts/switchboard-district-loop.mp4` | 1254×1254, H.264, 24 fps, 10.0 s, ~3840 kb/s | Fallback / preview of the same loop. |
| `assets/maps/districts/switchboard-district-clean.webp` | 1254×1254 native, WebP q95 | Locked still companion (PNG originals stay local; `**/*.png` under districts is gitignored). |
| `assets/maps/districts/clean/01_switchboard.webp` | 1254×1254 | Existing B72 unlabeled still — unchanged. |

Foundry Scene video background: `modules/draw-steel-ghostwire/assets/maps/districts/switchboard-district-loop.webm`

Foundry Scene still background: `modules/draw-steel-ghostwire/assets/maps/districts/switchboard-district-clean.webp`  
(or the B72 still: `modules/draw-steel-ghostwire/assets/maps/districts/clean/01_switchboard.webp`)

## How to use as a Foundry scene background

Scenes are **not** auto-created. Drop the file onto a Scene when you need the district play surface.

1. Create or open a Scene (Switchboard / Cassavir's district overview).
2. Scene Configuration → **Background** → browse to the WebM (preferred) or the WebP still.
3. Set scene dimensions to **1254 × 1254** so the plate is 1:1 (no stretch). Grid / walls are Director-side; this loop has **no** baked grid.
4. For video: enable **loop**. There is no audio track.
5. Tokens stay stable — the camera and street geometry do not drift. Traffic beads and drone specks are decoration, not collision.

If a client cannot play WebM/VP9, use the MP4 fallback or the still.

Loop behavior (v1, approved):

- Neon arterials ping-pong **brightness** (dim pink/cyan ↔ bright white pulse).
- Highway / street traffic is sparse moving light beads on the locked overpass and surface roads.
- A few drone specks and a slow airship pass; no crowds, no weather, no labels.
- Layout is locked to the clean still — no pan, zoom, or block drift.

District play surfaces follow the B72 convention (`assets/maps/` native-res). They are **not** print-art plates — Reach / rulebook PDF still uses `assets/maps/districts/clean|labeled/` for handbook stills and does not pull this loop from `docs/manuscript/print-art/` (B88). PNG originals stay local under `assets/maps/districts/_png-backup/` (gitignored).

## Forthcoming (not this PR)

- Scene JSON / walls / lighting / grid scale.
- Journal or handbook page wiring to the loop.

## Checklist

- [x] Loop v1 copied as-is (WebM + MP4, native 1254×1254)
- [x] Locked still converted to WebP at native 1254×1254 (q95, no downscale)
- [x] `assets/maps/districts/README.md` inventory
- [x] `module.json` **0.3.30**
- [x] Journals / packs / VOIDMARK / Mama walls not touched
