# B99 — Mama Cassavir club battlemap (still)

**Date:** 2026-09-19  
**Module:** **0.3.25** (next free patch after main **0.3.24** / B98 journal regen)  
**Status:** **STILL LOCKED** — Michael approved variant **B3** as the still image. **Animated loop forthcoming** (not this ship).  
**Journals / packs:** **not** touched.

## Lock

- Flat top-down club interior, Foundry **5 ft–friendly** furniture scale.
- Approved still: **B3** (`mama-cassavir-club-B3`).
- Credit: Ghostwire AI (AI-generated). No external-IP name-checks (B78/B83).

## Shipped (0.3.25)

| Path | Dims | Notes |
|---|---|---|
| `assets/maps/battlemaps/mama-cassavir-club.webp` | 1280×720 native | High-quality WebP (q95). **No downscale.** |

Foundry Scene background: `modules/draw-steel-ghostwire/assets/maps/battlemaps/mama-cassavir-club.webp`

Location battlemaps follow the B72 play-surface convention (`assets/maps/` native-res WebP). They are **not** print-art plates — Reach / rulebook PDF still uses `assets/maps/districts/` for district overviews and does not pull venue maps from `docs/manuscript/print-art/` (B88). PNG originals stay local under `assets/maps/battlemaps/_png-backup/` (gitignored).

Scenes are **not** auto-created. Drop the WebP onto a Scene when you need the play surface.

## Forthcoming (not this PR)

- Animated loop of the same club (lights / crowd / neon) — still remains the locked plate.
- Scene JSON / walls / lighting.
- Journal or handbook page wiring.

## Checklist

- [x] B3 still converted to WebP at native resolution
- [x] `assets/maps/battlemaps/mama-cassavir-club.webp`
- [x] `module.json` **0.3.25**
- [x] Journals / packs not regenerated
- [ ] Animated loop
