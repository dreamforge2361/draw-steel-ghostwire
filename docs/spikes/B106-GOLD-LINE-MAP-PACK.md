# Spike B106 — Deadhead Gold Line dual-Hammerhead map pack

**Date:** 2026-09-20  
**Module:** **0.3.36** (plates + inject) · **0.3.37** (loop/roof hotfix) · **0.3.39** (duration + roof-lock hotfix; 0.3.38 is B80)  
**Status:** **SHIPPED** — stills + VP9 webm + H.264 mp4 loops + world Scene inject + Deadhead journal notes. **0.3.37:** do not HEAD-probe webm; Level background gets video loop/autoplay; `force` restamps the roof tile. **0.3.39:** **stills default** until video is proven; skip seek when duration is non-finite; bake Michael roof lock **x=3232, y=475, 6472×958, elev 1, locked, occlusion NONE**. No FADE / Surface.  
**Pairs with:** `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`, B104, B99 Mama club battlemap.  
**Lock:** Michael 2026-09-19 — “ship it!” CyberMaps Hammerhead stitch. **Do not regenerate** a train plate. Roof place locked 2026-09-20.

## Goal

Ship the dual-Hammerhead Gold Line play surface into the module: interior + roofs stills, animated loops, a world-injected Scene (stills default, roofs solid overhead — no occlusion), and Director beat remap onto L1–R3.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Director SoR | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` | Pay, wipe/stop, Trace, consist, **beat remap** |
| Scene template | `data/scenes/gold-line.json` | Canvas 6472×958, grid 208 / 5 ft, roof lock 3232, 475, elev 1, occlusion NONE |
| Inject | `scripts/gold-line-scene.mjs` | Ready-hook creates **Scenes → Deadhead → Gold Line** once (flag `goldLineScene`) |
| Journal | `src/packs/runs/deadhead/gold-line-map.json` | **Ghostwire Runs → Deadhead → Gold Line — Map Notes** |
| Plates | `assets/maps/battlemaps/gold-line/` | Native-res stills + loops (no downscale) |

## Shipped (0.3.36)

| Path | Dims / codec | Notes |
|---|---|---|
| `map-gold-line-interior.webp` | 6472×958 | **Default** Interior Level background (0.3.39). Valid playable layout. |
| `map-gold-line-interior-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | Opt-in loop (after stills) |
| `map-gold-line-interior-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — last video choice |
| `map-gold-line-roofs.webp` | 6472×958 | **Default** roof tile (0.3.39). Valid playable layout. |
| `map-gold-line-roofs-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | Opt-in loop (after stills) |
| `map-gold-line-roofs-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — last video choice |

MP4 twins are the **same CyberMaps frames** remuxed to H.264 so Foundry gets a real duration. Do not invent a new train render. Parent may also drop duration-fixed `*-loop-fixed.webm` on the box — listed after stills / mp4. **Stills stay default until video is proven.**

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`

## Scene inject (world, not a Scene pack)

B72 / B99 / B100 drop files only. B104 said not to invent a Scene pack. Gold Line follows the B39 **world inject** pattern (`flags.draw-steel-ghostwire.*`):

1. First GM `ready`: create Scene folder **Deadhead** (`deadheadScenes`) and Scene **Gold Line** (`goldLineScene`).
2. Level **Interior** background = first existing path in **still.webp → loop.mp4 → loop.webm**. Probe with **FilePicker.browse** or a **ranged GET** (never HEAD — Foundry’s file server often 405s webm HEAD and the 0.3.36 inject fell back to the still). If the src is webm/mp4, set `background.video = { loop: true, autoplay: true, volume: 0 }`. Skip `currentTime` / VideoHelper offset when duration is non-finite (0.3.39: shipped webms are `duration=N/A` and Foundry threw).
3. Locked overhead tile **Roofs (overhead)** = same prefer list (stills first). Michael lock: **x=3232, y=475, width=6472, height=958, elevation=1, locked=true, occlusion.mode 0 / alpha 1**. Roofs stay **solid**. Do **not** enable FADE or Surface. `force: true` restamps that place every time (a failed webm seek left a one-car scrap; elev 10 hid the tile under Levels).
4. Grid **208** px = 5 ft; canvas **6472 × 958** (~31.1 × 4.6 squares). No baked grid in the art.
5. Already-present flagged Scene is left alone unless `goldLineVersion` is stale or you pass `force`. Template version **4** auto-refreshes 0.3.36–0.3.37 worlds onto stills + the locked roof on next GM load.

**Why roof x/y are not 0,0:** the Level background is pinned to the scene origin and fills 6472×958. A Foundry Tile’s x/y is its **registration point** (center), so a full-plate roof sits near (width/2, height/2) ≈ (3236, 479). Michael nudged that to **3232, 475**. Resetting to 0,0 shifts the roof by half a plate.

### Console force snippet (0.3.37+)

Paste as GM after enabling the updated module (or to restamp loops without waiting for the version migrate):

```js
await game.ghostwire.ensureGoldLineScene({ force: true });
```

Then **re-activate** Gold Line (close / open, or view another Scene and come back). Confirm:

1. Scene Config → Level **Interior** background is `map-gold-line-interior.webp` (stills default).
2. Tiles layer → **Roofs (overhead)** → `map-gold-line-roofs.webp`, place **3232, 475**, size **6472×958**, elevation **1**, locked, occlusion **NONE** (alpha 1).

Loops stay in the folder for a later opt-in. **Stills are the valid playable layout** until video is proven.

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
- [x] Scene template + world inject (solid roofs, no occlusion)
- [x] SoR + Runs journal beat remap
- [x] B104 pointed at shipped assets
- [x] `module.json` **0.3.36** (UTF-8 no BOM)
- [x] **0.3.37** loop hotfix: no HEAD probe; Level video flags; force restamps roof tile; console snippet above
- [x] **0.3.39** duration + roof-lock hotfix: ship `*-loop.mp4` (same frames, finite duration); stills default; skip non-finite seek; bake roof **3232, 475, 6472×958, elev 1, locked, occlusion NONE**; document Tile registration vs Level origin
- [x] No generated train; no unrelated journal regen
