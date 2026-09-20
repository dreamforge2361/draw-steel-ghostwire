# Spike B106 — Deadhead Gold Line dual-Hammerhead map pack

**Date:** 2026-09-20  
**Module:** **0.3.36** (plates + inject) · **0.3.37** (loop/roof hotfix) · **0.3.40** (cargo remap) · **0.3.41** (never rewrite live `goldLineScene`)  
**Status:** **SHIPPED.** **0.3.41 LOCK:** new worlds get Level interior MP4 + one roof tile at 0,0 elev 1. Existing `goldLineScene` worlds are **never rewritten**. `{ force: true }` is GM-opt-in only. Director hides roofs when the crew goes inside.  
**Cargo lock (2026-09-20):** consist is cargo chambers L1–R3, **not** a passenger train. See `docs/directors/runs/deadhead/GOLD-LINE-CARGO-REMAP.md` (LOCKED / folded). Do **not** touch Scene walls/lights.
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

1. First GM `ready` on a **new** world: create Scene folder **Deadhead** (`deadheadScenes`) and Scene **Gold Line** (`goldLineScene`).
2. **Level background** = interior motion MP4 (`*-interior-loop.mp4`), video loop + autoplay.
3. **ONE Tile** **Roofs** (`goldLineRoofs`): start **x=0, y=0, 6472×958, elev 1, sort 1, locked**, texture `*-roofs-loop.mp4`, video loop + autoplay, occlusion **NONE**. Michael may nudge x/y.
4. No interior motion tile. Inject **deletes** leftover `goldLineInterior` tiles (**new worlds / force only**).
5. Prefer **loop.mp4 → loop.webm → still.webp**. Probe with **FilePicker.browse** or a **ranged GET** (never HEAD). Skip `currentTime` when duration is non-finite.
6. Grid **208** px = 5 ft; canvas **6472 × 958**.
7. **Live worlds are sacred.** If a scene already has flag `goldLineScene`, `ensureGoldLineScene` **returns immediately**. Ready never passes `{ force: true }`. Force is GM-opt-in only and overwrites walls, lights, tiles, and background.

**Director — hide roofs:** when the crew goes inside, hide **Roofs** (Tiles layer → eye). Unhide for roof Recall bail. Occlusion stays off.

### Console force snippet (GM-opt-in only)

**Do not run this on a live Gold Line scene** (walls, lights, stills, roof tile already dressed). It overwrites background, tiles, levels, and dimensions.

Ready never passes force. New worlds inject once; existing `goldLineScene` worlds are left alone.

```js
await game.ghostwire.ensureGoldLineScene({ force: true });
```

On a **new** empty world (or after a deliberate force restamp), re-activate Gold Line and confirm:

1. Scene Config → Level background is `map-gold-line-interior-loop.mp4` (loop + autoplay).
2. Tiles → **one** tile, **Roofs**, `map-gold-line-roofs-loop.mp4` at **0, 0**, 6472×958, elev 1, occlusion NONE.
3. No `goldLineInterior` tile.
4. Hide **Roofs** when the crew goes inside.

Do **not** use `foundry.utils.srcExists` to test these paths — it HEADs and will lie about webm.

Thumb uses the interior still so the sidebar does not depend on video decode.

## Beat remap

**Cargo lock (0.3.40):** design truth is the **cargo maglev** (L1–R3), not 5 passenger cars. See `GOLD-LINE-CARGO-REMAP.md`.

Plate is **2 × 3 Hammerhead chambers**:

L1 aft freight (board + Enforcers) → L2 freight → L3 security (4 Security + Lt) → coupler → R1 courier → R2 Wire transfer → R3 cab (Trace host).

Wire on this plate: Track 1 cams/doors **R2**; Track 2 capsule lock **R1** + Watchdog ICE; Trace host **R3**.

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
- [x] **0.3.41** lock: Level background = interior MP4; one roof tile at 0,0 elev 1 on **new** worlds only; existing `goldLineScene` never rewritten; `{ force: true }` is GM-opt-in only; cargo remap from 0.3.40 kept
- [x] No generated train; no unrelated journal regen
