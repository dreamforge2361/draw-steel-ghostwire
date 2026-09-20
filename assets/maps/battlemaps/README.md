# Location battlemaps

Interior / venue play surfaces (not district overviews). **Native resolution preserved** (no downscale). Drop the WebP still or WebM loop onto a Foundry Scene as the background — or use the Gold Line world inject.

| File | Scene | Dims | Notes |
|---|---|---|---|
| `mama-cassavir-club.webp` | Mama Cassavir's club (Switchboard) | 1280×720 | Michael-approved still **B3**. Foundry 5 ft–friendly furniture scale. |
| `mama-cassavir-club-loop.webm` | same (animated) | 1280×720, VP9, 24 fps, ~4.2 s | **Preferred Foundry** loop v1 (Michael thumbs-up). Neon brightness/saturation ping-pong; no layout drift. |
| `mama-cassavir-club-loop.mp4` | same (animated) | 1280×720, H.264, 24 fps, ~4.2 s | Fallback / preview of the same loop. |
| `gold-line/map-gold-line-interior.webp` | Gold Line (Deadhead) | 6472×958 | Dual Hammerhead interior still (CyberMaps stitch). Fallback if MP4 missing. |
| `gold-line/map-gold-line-interior-loop.mp4` | same (Level background) | 6472×958, H.264, 24 fps, 8 s | **Preferred** Level background. World inject: **Scenes → Deadhead → Gold Line**. |
| `gold-line/map-gold-line-interior-loop.webm` | same | 6472×958, VP9, 24 fps, 8 s | After mp4. Stream `duration=N/A`. |
| `gold-line/map-gold-line-roofs.webp` | same (Roofs tile) | 6472×958 | Roofs still fallback. |
| `gold-line/map-gold-line-roofs-loop.mp4` | same | 6472×958, H.264, 24 fps, 8 s | **Preferred** Roofs (motion) tile. |
| `gold-line/map-gold-line-roofs-loop.webm` | same | 6472×958, VP9, 24 fps, 8 s | After mp4. Stream `duration=N/A`. |

Foundry path: `modules/draw-steel-ghostwire/assets/maps/battlemaps/<file>`

Mama club: drop the file onto a Scene (not auto-created). Gold Line: first GM load injects the Scene from `data/scenes/gold-line.json` (grid 208 / 5 ft). Level background = interior MP4. One roof tile at **0, 0** elev 1 (prefer `*-loop.mp4`). Director hides roofs when the crew goes inside. `await game.ghostwire.ensureGoldLineScene({ force: true })` restamps. Spike: `docs/spikes/B106-GOLD-LINE-MAP-PACK.md`.

PNG originals stay local under `_png-backup/` (gitignored), same policy as `assets/maps/districts/`.
