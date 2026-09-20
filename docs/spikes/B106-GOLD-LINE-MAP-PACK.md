# Spike B106 — Deadhead Gold Line dual-Hammerhead map pack

**Date:** 2026-09-20  
**Module:** **0.3.36** (plates + inject) · **0.3.37** (loop/roof hotfix) · **0.3.39** (MP4 duration hotfix; 0.3.38 is B80)  
**Status:** **SHIPPED** — stills + VP9 webm + H.264 mp4 loops + world Scene inject + Deadhead journal notes. **0.3.37:** do not HEAD-probe webm; Level background gets video loop/autoplay; `force` restamps the roof tile. **0.3.39:** prefer `loop.mp4` (finite duration) → `loop.webm` → still; skip seek when duration is non-finite; `force` always restamps 6472×958. **If video fails, stills are a valid playable layout.**  
**Pairs with:** `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`, B104, B99 Mama club battlemap.  
**Lock:** Michael 2026-09-19 — “ship it!” CyberMaps Hammerhead stitch. **Do not regenerate** a train plate.

## Goal

Ship the dual-Hammerhead Gold Line play surface into the module: interior + roofs stills, animated loops, a world-injected Scene (interior loop background, roofs overhead with Surface occlusion), and Director beat remap onto L1–R3.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Director SoR | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` | Pay, wipe/stop, Trace, consist, **beat remap** |
| Scene template | `data/scenes/gold-line.json` | Canvas 6472×958, grid 208 / 5 ft, roof tile Surface |
| Inject | `scripts/gold-line-scene.mjs` | Ready-hook creates **Scenes → Deadhead → Gold Line** once (flag `goldLineScene`) |
| Journal | `src/packs/runs/deadhead/gold-line-map.json` | **Ghostwire Runs → Deadhead → Gold Line — Map Notes** |
| Plates | `assets/maps/battlemaps/gold-line/` | Native-res stills + loops (no downscale) |

## Shipped (0.3.36)

| Path | Dims / codec | Notes |
|---|---|---|
| `map-gold-line-interior.webp` | 6472×958 | Interior still (fallback). **Valid playable layout** if video fails. |
| `map-gold-line-interior-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** Scene Level background (0.3.39) |
| `map-gold-line-interior-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — keep as second choice |
| `map-gold-line-roofs.webp` | 6472×958 | Roofs still (fallback). **Valid playable layout** if video fails. |
| `map-gold-line-roofs-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** overhead tile (0.3.39) |
| `map-gold-line-roofs-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — keep as second choice |

MP4 twins are the **same CyberMaps frames** remuxed to H.264 so Foundry gets a real duration. Do not invent a new train render. Parent may also drop duration-fixed `*-loop-fixed.webm` on the box — prefer those over the shipped N/A webms if present, still after mp4.

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`

## Scene inject (world, not a Scene pack)

B72 / B99 / B100 drop files only. B104 said not to invent a Scene pack. Gold Line follows the B39 **world inject** pattern (`flags.draw-steel-ghostwire.*`):

1. First GM `ready`: create Scene folder **Deadhead** (`deadheadScenes`) and Scene **Gold Line** (`goldLineScene`).
2. Level **Interior** background = first existing path in **loop.mp4 → loop.webm → still.webp**. Probe with **FilePicker.browse** or a **ranged GET** (never HEAD — Foundry’s file server often 405s webm HEAD and the 0.3.36 inject fell back to the still). If the src is webm/mp4, set `background.video = { loop: true, autoplay: true, volume: 0 }`. Skip `currentTime` / VideoHelper offset when duration is non-finite (0.3.39: shipped webms are `duration=N/A` and Foundry threw).
3. Locked overhead tile **Roofs (overhead)** = same prefer list for roofs, elevation 10, `occlusion.mode` **2 (SURFACE)** — roofs on until a token is underneath. Find it on the **Tiles** layer (full-plate, elevation 10). `force: true` restamps `texture.src` + video flags **and always width/height 6472×958** (a failed webm seek left a one-car scrap over the dual interior).
4. Grid **208** px = 5 ft; canvas **6472 × 958** (~31.1 × 4.6 squares). No baked grid in the art.
5. Already-present flagged Scene is left alone unless `goldLineVersion` is stale or you pass `force`. Template version **3** auto-refreshes 0.3.36–0.3.37 worlds onto the mp4 prefer list on next GM load.

### Console force snippet (0.3.37+)

Paste as GM after enabling the updated module (or to restamp loops without waiting for the version migrate):

```js
await game.ghostwire.ensureGoldLineScene({ force: true });
```

Then **re-activate** Gold Line (close / open, or view another Scene and come back) so the canvas reloads the loop. Confirm:

1. Scene Config → Level **Interior** background is `map-gold-line-interior-loop.mp4` (not the `.webp`; webm only if mp4 is missing).
2. Tiles layer → **Roofs (overhead)** → texture is `map-gold-line-roofs-loop.mp4`, size **6472×958**, elevation 10, Surface, video loop + autoplay.

If the mp4/webm will not play, drop the matching `.webp` still on the Level / tile. **Stills are a valid playable layout** — same plate, same grid.

Do **not** use `foundry.utils.srcExists` to test these paths — it HEADs and will lie about webm.

Thumb uses the interior still so the sidebar does not depend on video decode.

## Beat remap

Design truth stays **5 cars**. Plate is **2 × 3 Hammerhead chambers**:

L1 tail (board) → L2 passenger → L3 security → coupler → R1 courier → R2 Wire transfer → R3 cab.

Wire on this plate: Track 1 cams/doors **R2**; Track 2 capsule lock **R1** + Watchdog ICE.

## Out of scope

- AI / generated train art.
- Hangout, canyon, Mama-reuse Scene JSON, walls, lights, Wired Console preset.
- Full Deadhead journal content pass (Overview / Trace 1–12 / Beats 0–5 / wafers).
- Regenerating rulebook / lore / handbook / flats / pregen-fiction.

## Smoke

```text
node tools/gold-line-scene-smoke.mjs
```

Rebuild Deadhead journal pack (Foundry closed):

```text
node tools/build-packs.mjs runs
```

## Checklist

- [x] Stills + loops copied native-res under `assets/maps/battlemaps/gold-line/`
- [x] Scene template + world inject (Surface roofs)
- [x] SoR + Runs journal beat remap
- [x] B104 pointed at shipped assets
- [x] `module.json` **0.3.36** (UTF-8 no BOM)
- [x] **0.3.37** loop hotfix: no HEAD probe; Level video flags; force restamps roof tile; console snippet above
- [x] **0.3.39** duration hotfix: ship `*-loop.mp4` (same frames, finite duration); `resolveSrc` order mp4 → webm → still; skip non-finite seek; force restamps 6472×958; stills documented as valid playable layout
- [x] No generated train; no unrelated journal regen
