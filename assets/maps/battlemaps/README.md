# Location battlemaps

Interior / venue play surfaces (not district overviews). **Native resolution preserved** (no downscale). Drop the WebP still or WebM loop onto a Foundry Scene as the background — or use the Gold Line world inject.

| File | Scene | Dims | Notes |
|---|---|---|---|
| `mama-cassavir-club.webp` | Mama Cassavir's club (Switchboard) | 1280×720 | Michael-approved still **B3**. Foundry 5 ft–friendly furniture scale. |
| `mama-cassavir-club-loop.webm` | same (animated) | 1280×720, VP9, 24 fps, ~4.2 s | **Preferred Foundry** loop v1 (Michael thumbs-up). Neon brightness/saturation ping-pong; no layout drift. |
| `mama-cassavir-club-loop.mp4` | same (animated) | 1280×720, H.264, 24 fps, ~4.2 s | Fallback / preview of the same loop. |
| `gold-line/map-gold-line-interior.webp` | Gold Line (Deadhead) | 6472×958 | Dual Hammerhead interior still (CyberMaps stitch). **Valid playable layout** if video fails. |
| `gold-line/map-gold-line-interior-loop.mp4` | same (animated BG) | 6472×958, H.264, 24 fps, 8 s | **Preferred Foundry** Level background (finite duration). World inject: **Scenes → Deadhead → Gold Line**. |
| `gold-line/map-gold-line-interior-loop.webm` | same (animated BG) | 6472×958, VP9, 24 fps, 8 s | Second choice. Stream `duration=N/A` — Foundry can throw on `currentTime`. |
| `gold-line/map-gold-line-roofs.webp` | same (overhead) | 6472×958 | Matching roofs still. **Valid playable layout** if video fails. |
| `gold-line/map-gold-line-roofs-loop.mp4` | same (overhead, animated) | 6472×958, H.264, 24 fps, 8 s | **Preferred** roof tile (finite duration). Surface occlusion — roofs on until a token is underneath. |
| `gold-line/map-gold-line-roofs-loop.webm` | same (overhead, animated) | 6472×958, VP9, 24 fps, 8 s | Second choice. Stream `duration=N/A`. |

Foundry path: `modules/draw-steel-ghostwire/assets/maps/battlemaps/<file>`

Mama club: drop the file onto a Scene (not auto-created). Gold Line: first GM load injects the Scene from `data/scenes/gold-line.json` (grid 208 / 5 ft). Prefer `*-loop.mp4` then `.webm` then the still. Roofs tile is on the **Tiles** layer (elevation 10, Surface). If a 0.3.36–0.3.37 world stuck on stills or a mis-scaled roof scrap, `await game.ghostwire.ensureGoldLineScene({ force: true })` then re-activate (restamps 6472×958). Stills are a valid playable layout if video fails. Spike: `docs/spikes/B106-GOLD-LINE-MAP-PACK.md`.

PNG originals stay local under `_png-backup/` (gitignored), same policy as `assets/maps/districts/`.
