# Ossian Reach district maps

Battle maps / play surfaces. **Native resolution preserved** (no downscale). Drop a WebP still or WebM loop onto a Foundry Scene as the background.

- `clean/` — unlabeled plates
- `labeled/` — labeled plates + cover
- Root — master Flats / Switchboard + Switchboard animated loop

Source stills: `C:\\Users\\mfran\\Dropbox\\Public\\RPG\\Ghostwire\\art\\Ossian Reach District Maps`

| File | Scene | Dims | Notes |
|---|---|---|---|
| `clean/01_switchboard.webp` | Switchboard (unlabeled still) | 1254×1254 | B72 play-surface still. |
| `switchboard-district-clean.webp` | same (locked still) | 1254×1254 | Michael-approved clean plate for the v1 loop. Native WebP q95; **no downscale.** |
| `switchboard-district-loop.webm` | same (animated) | 1254×1254, VP9, 24 fps, 10.0 s | **Preferred Foundry** loop v1 (Michael approved). Neon pulse, highway traffic, sparse drones/airship; no weather/grid/text/people. |
| `switchboard-district-loop.mp4` | same (animated) | 1254×1254, H.264, 24 fps, 10.0 s | Fallback / preview of the same loop. |

Foundry path: `modules/draw-steel-ghostwire/assets/maps/districts/<file>`

PNG originals stay local under `_png-backup/` (gitignored), same policy as `assets/maps/battlemaps/`.
