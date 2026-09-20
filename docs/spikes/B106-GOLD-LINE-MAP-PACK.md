# Spike B106 — Deadhead Gold Line dual-Hammerhead map pack

**Date:** 2026-09-20  
**Module:** **0.3.36** (plates + inject) · **0.3.37** (loop/roof hotfix) · **0.3.39** (two-tile working setup; 0.3.38 is B80)  
**Status:** **SHIPPED** — stills + VP9 webm + H.264 mp4 loops + world Scene inject + Deadhead journal notes. **0.3.39 WORKING SETUP (Michael 2026-09-20):** do **not** use Level background video. Two Tiles play duration-valid MP4s — Interior at 0,0 and Roofs at 3232, 475 (occlusion NONE). Director hides roofs when the crew goes inside. Await `GOLD_LINE_LOCKED` if 3232/475 changes.  
**Pairs with:** `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`, B104, B99 Mama club battlemap.  
**Lock:** Michael 2026-09-19 — “ship it!” CyberMaps Hammerhead stitch. **Do not regenerate** a train plate. Two-tile place confirmed 2026-09-20.

## Goal

Ship the dual-Hammerhead Gold Line play surface into the module: interior + roofs stills, animated loops, a world-injected Scene (two motion tiles, empty Level background), and Director beat remap onto L1–R3.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Director SoR | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` | Pay, wipe/stop, Trace, consist, **beat remap** |
| Scene template | `data/scenes/gold-line.json` | Canvas 6472×958, empty Level bg, interior tile 0,0 + roof tile 3232, 475 |
| Inject | `scripts/gold-line-scene.mjs` | Ready-hook creates **Scenes → Deadhead → Gold Line** once (flag `goldLineScene`) |
| Journal | `src/packs/runs/deadhead/gold-line-map.json` | **Ghostwire Runs → Deadhead → Gold Line — Map Notes** |
| Plates | `assets/maps/battlemaps/gold-line/` | Native-res stills + loops (no downscale) |

## Shipped (0.3.36)

| Path | Dims / codec | Notes |
|---|---|---|
| `map-gold-line-interior.webp` | 6472×958 | Interior still fallback. Valid playable layout. |
| `map-gold-line-interior-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** Interior (motion) tile |
| `map-gold-line-interior-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — after mp4 |
| `map-gold-line-roofs.webp` | 6472×958 | Roofs still fallback. Valid playable layout. |
| `map-gold-line-roofs-loop.mp4` | 6472×958, H.264, 24 fps, 8 s, finite duration | **Preferred** Roofs (motion) tile |
| `map-gold-line-roofs-loop.webm` | 6472×958, VP9, 24 fps, 8 s | Stream `duration=N/A` — after mp4 |

MP4 twins are the **same CyberMaps frames** remuxed to H.264 so Foundry gets a real duration. Prefer **mp4 over webm**. Do not invent a new train render.

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`

## Scene inject (world, not a Scene pack)

B72 / B99 / B100 drop files only. B104 said not to invent a Scene pack. Gold Line follows the B39 **world inject** pattern (`flags.draw-steel-ghostwire.*`):

1. First GM `ready`: create Scene folder **Deadhead** (`deadheadScenes`) and Scene **Gold Line** (`goldLineScene`).
2. **Do not use Level background video** (broken). Level `background.src` is cleared to empty.
3. Tile **Interior (motion)** (`goldLineInterior`): **x=0, y=0, 6472×958, elev 0, sort 0**, texture `*-interior-loop.mp4`, video loop + autoplay.
4. Tile **Roofs (motion)** (`goldLineRoofs`): **x=3232, y=475, 6472×958, elev 1, sort 100, locked**, texture `*-roofs-loop.mp4`, video loop + autoplay, occlusion **NONE** (solid). Await `GOLD_LINE_LOCKED` if 3232/475 changes.
5. Prefer **loop.mp4 → loop.webm → still.webp**. Probe with **FilePicker.browse** or a **ranged GET** (never HEAD). Skip `currentTime` when duration is non-finite.
6. Grid **208** px = 5 ft; canvas **6472 × 958**. Template version **6** auto-refreshes older worlds onto the two-tile setup.

**Director — hide roofs:** when the crew goes inside, hide **Roofs (motion)** (Tiles layer → eye). Unhide for roof Recall bail.

**Why roof x/y are not 0,0:** a Foundry Tile’s x/y is its **registration point** (center). The interior tile fills from the scene origin (0, 0). The roof sits near (width/2, height/2) ≈ (3236, 479); Michael nudged that to **3232, 475**.

### Console force snippet (0.3.37+)

Paste as GM after enabling the updated module (or to restamp loops without waiting for the version migrate):

```js
await game.ghostwire.ensureGoldLineScene({ force: true });
```

Then **re-activate** Gold Line (close / open, or view another Scene and come back). Confirm:

1. Scene Config → Level background src is **empty**.
2. Tiles → **Interior (motion)** is `map-gold-line-interior-loop.mp4` at **0, 0**, 6472×958, elev 0.
3. Tiles → **Roofs (motion)** is `map-gold-line-roofs-loop.mp4` at **3232, 475**, 6472×958, elev 1, sort 100, occlusion NONE.
4. Hide **Roofs (motion)** when the crew goes inside.

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
- [x] Scene template + world inject (two motion tiles, empty Level background)
- [x] SoR + Runs journal beat remap
- [x] B104 pointed at shipped assets
- [x] `module.json` **0.3.36** (UTF-8 no BOM)
- [x] **0.3.37** loop hotfix: no HEAD probe; Level video flags; force restamps roof tile; console snippet above
- [x] **0.3.39** two-tile working setup: empty Level background; Interior tile 0,0 + Roofs tile 3232, 475 (prefer mp4); occlusion NONE; Director hide-roof note; await `GOLD_LINE_LOCKED`
- [x] No generated train; no unrelated journal regen
