# Spike B106 — Deadhead Gold Line dual-Hammerhead map pack

**Date:** 2026-09-20  
**Module:** **0.3.36** (plates + inject) · **0.3.37** (loop/roof hotfix) · **0.3.39** (Level-interior MP4 + one roof tile; 0.3.38 is B80)  
**Status:** **SHIPPED** — stills + VP9 webm + H.264 mp4 loops + world Scene inject + Deadhead journal notes. **0.3.39 LOCK (Michael 2026-09-20):** Level background = interior motion MP4. ONE roof Tile at 0,0 elev 1 (occlusion NONE). No interior motion tile. Director hides roofs when the crew goes inside.  
**Pairs with:** `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`, B104, B99 Mama club battlemap.  
**Lock:** Michael 2026-09-19 — “ship it!” CyberMaps Hammerhead stitch. **Do not regenerate** a train plate. Architecture locked 2026-09-20.

## Goal

Ship the dual-Hammerhead Gold Line play surface into the module: interior + roofs stills, animated loops, a world-injected Scene (Level interior MP4 + one roof tile), and Director beat remap onto L1–R3.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Director SoR | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` | Pay, wipe/stop, Trace, consist, **beat remap** |
| Scene template | `data/scenes/gold-line.json` | Canvas 6472×958, Level interior video, one roof tile at 0,0 |
| Inject | `scripts/gold-line-scene.mjs` | Ready-hook creates **Scenes → Deadhead → Gold Line** once (flag `goldLineScene`) |
| Journal | `src/packs/runs/deadhead/gold-line-map.json` | **Ghostwire Runs → Deadhead → Gold Line — Map Notes** |
| Plates | `assets/maps/battlemaps/gold-line/` | Native-res stills + loops (no downscale) |

## Shipped (0.3.36+)

| Path | Dims / codec | Notes |
|---|---|---|
| `map-gold-line-interior.webp` | 6472×958 | Interior still fallback. Valid playable layout. |
| `map-gold-line-interior-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** Level background |
| `map-gold-line-interior-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — after mp4 |
| `map-gold-line-roofs.webp` | 6472×958 | Roofs still fallback. Valid playable layout. |
| `map-gold-line-roofs-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** Roofs tile |
| `map-gold-line-roofs-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — after mp4 |

MP4 twins are the **same CyberMaps frames** remuxed to H.264 so Foundry gets a real duration. Prefer **mp4 over webm**. Do not invent a new train render.

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`

## Scene inject (world, not a Scene pack)

B72 / B99 / B100 drop files only. B104 said not to invent a Scene pack. Gold Line follows the B39 **world inject** pattern (`flags.draw-steel-ghostwire.*`):

1. First GM `ready`: create Scene folder **Deadhead** (`deadheadScenes`) and Scene **Gold Line** (`goldLineScene`).
2. **Level background** = interior motion MP4 (`*-interior-loop.mp4`), video loop + autoplay.
3. **ONE Tile** **Roofs** (`goldLineRoofs`): start **x=0, y=0, 6472×958, elev 1, sort 1, locked**, texture `*-roofs-loop.mp4`, video loop + autoplay, occlusion **NONE**. Michael may nudge x/y.
4. No interior motion tile. Inject **deletes** leftover `goldLineInterior` tiles.
5. Prefer **loop.mp4 → loop.webm → still.webp**. Probe with **FilePicker.browse** or a **ranged GET** (never HEAD). Skip `currentTime` when duration is non-finite.
6. Grid **208** px = 5 ft; canvas **6472 × 958**. Template version **7** auto-refreshes older worlds onto this lock.

**Director — hide roofs:** when the crew goes inside, hide **Roofs** (Tiles layer → eye). Unhide for roof Recall bail. Occlusion stays off.

### Console force snippet (0.3.37+)

Paste as GM after enabling the updated module (or to restamp without waiting for the version migrate):

```js
await game.ghostwire.ensureGoldLineScene({ force: true });
```

Then **re-activate** Gold Line (close / open, or view another Scene and come back). Confirm:

1. Scene Config → Level background is `map-gold-line-interior-loop.mp4` (loop + autoplay).
2. Tiles → **one** tile, **Roofs**, `map-gold-line-roofs-loop.mp4` at **0, 0**, 6472×958, elev 1, occlusion NONE.
3. No `goldLineInterior` tile.
4. Hide **Roofs** when the crew goes inside.

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
- [x] Scene template + world inject (Level interior MP4 + one roof tile)
- [x] SoR + Runs journal beat remap
- [x] B104 pointed at shipped assets
- [x] `module.json` **0.3.36** (UTF-8 no BOM)
- [x] **0.3.37** loop hotfix: no HEAD probe; Level video flags; force restamps roof tile; console snippet above
- [x] **0.3.39** lock: Level background = interior MP4; one roof tile at 0,0 elev 1; delete `goldLineInterior`; occlusion NONE; Director hide-roof; prefer mp4
- [x] No generated train; no unrelated journal regen
