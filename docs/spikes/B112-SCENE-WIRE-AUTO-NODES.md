# Spike B112 — Scene → Wire auto-nodes

**Date:** 2026-09-20  
**Module:** **0.3.49**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B114 node-map readability, B115 NPC Wire Kit, **B113** Light/Maglock token art (shipped this module).

## Goal

One GM click on the **Wired Console** builds a usable Gold Line board from the viewed Scene: named lights → Light Control nodes, wall doors → Maglock nodes, cam lights / named cams → Cam Controls nodes, hidden 0.25-grid tokens on the current Level, idempotent re-runs. Does **not** turn lights, doors, or cameras on from the Wire (addresses only).

**Hard lock:** do not touch `scripts/gold-line-scene.mjs` live-scene `{ force: true }` behaviour. Do not inject/overwrite Gold Line walls, lights, or tiles.

## Room + node naming — LOCKED 2026-09-20

`parseRoomName` in `scripts/wired-auto-nodes.mjs`. **Require** ` - ` (space-hyphen-space) as the splitter. **Do not** use first-word / keyword parsing.

Pattern: `{Room Name} - {rest…}`

Room name = everything **left of the first** ` - `.

| Light name | Room | Light Control node |
|---|---|---|
| `Rear Car Substation - Light Control` | Rear Car Substation | `Rear Car Substation - Light Control` |
| `Aft Freight - Work Light` | Aft Freight | `Aft Freight - Light Control` |
| `Cab - Light Control` | Cab | `Cab - Light Control` |
| `Cab Light` (no ` - `) | — | **skip + warn GM** |
| *(unnamed)* | — | skip |

Documented in Console helpText (`GHOSTWIRE.WiredConsole.AutoNodesRule`). Maglocks in that room **also** use ` - ` after the room: `{Room} - Maglock Door 1`, `{Room} - Maglock Door 2`, … (Track 1, R2). Correct: `Rear Car Substation - Maglock Door 1`. Wrong: `Rear Car Substation Maglock Door 1`. Light Control stays `{Room} - Light Control` (or matches the light name pattern).

## Nodes

| Source | Board node | Track / Rating | Token |
|---|---|---|---|
| Unique `RoomName` from non-cam lights | `{Room} - Light Control` | T1 / R1 | One hidden token **next to the first light** in that room |
| Each wall with `door != NONE` | `{Room} - Maglock Door 1`, `{Room} - Maglock Door 2`, … per room | T1 / R2 | Hidden token **next to the door** |
| Each cam light (`rest` contains Cam / Camera) | `{Room} - Cam Controls 1`, `{Room} - Cam Controls 2`, … per room | T1 / R1 | Hidden token **next to that cam light** |

Door room: wall name only if it also uses `{Room} - {rest…}`; otherwise **nearest light’s RoomName**, else `Unassigned`. Cam-only rooms still seed that nearest-room map (no Light Control unless a non-cam light exists).

Same-room **Light Control ↔ Maglocks and Cam Controls** are linked (undirected). `getBoard` preserves `autoFrom` and `tokenStyle`.

Flags (idempotent skip / replace):

```text
node.autoFrom = { kind: "light-control", room, lightIds: [...] }
             | { kind: "maglock", room, doorId }
             | { kind: "cam-controls", room, lightId }
Actor flags  = { kind: "node", boardSceneId, nodeId, track, autoKind, autoFrom, tokenArt }
```

Re-run **Skip** (default) leaves existing auto-nodes. **Replace** deletes auto-nodes + tokens, then rebuilds. Manual nodes are never removed.

Placement reuses `placeNode` (B108 elevation + `canvas.level`, B110 0.25 size). Optional `{ x, y, extraFlags, textureSrc }`.

## B113 token art

`AUTO_NODE_TOKEN_ART` in `scripts/wired-auto-nodes.mjs` points at:

- `modules/draw-steel-ghostwire/assets/tokens/wired/node-light-control.webp` (cyan lightbulb + power symbol)
- `modules/draw-steel-ghostwire/assets/tokens/wired/node-maglock.webp` (sliding doors + padlock)
- `modules/draw-steel-ghostwire/assets/tokens/wired/node-cam-controls.webp` (security cam)

`placeNode` stamps Actor `img`, `prototypeToken.texture.src`, and the placed token texture. Generic Track 1/2 templates stay when `tokenStyle` is empty. Director **Token art** select (B116) writes `tokenStyle` for manual nodes. Spike: `docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md`, `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`.

## UI

Wired Console Nodes header (GM): lightbulb **Auto-nodes from Scene**. Dialog explains the naming rule and Skip vs Replace.

## Out of scope

Wire → meatspace light/door/camera toggles; rewriting Gold Line.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Foundry (Gold Line): name lights `{Room Name} - Light Control` (e.g. `Rear Car Substation - Light Control`) → Auto-nodes → hidden tokens beside lights/doors on Interior with Light Control / Maglock art (not the generic Track 1 token) → Console shows `Rear Car Substation - Light Control` + `Rear Car Substation - Maglock Door 1`, `… Door 2` → a light named `Security Nest - Cam 1` becomes `Security Nest - Cam Controls 1` with cam-controls art (not on the Light Control `lightIds`) → lights with no ` - ` warn and skip → re-run Skip adds nothing → Node Map stays readable (B114). Director Token art select restyles a hand-placed node.
