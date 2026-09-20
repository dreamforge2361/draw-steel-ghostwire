# Spike B112 — Scene → Wire auto-nodes

**Date:** 2026-09-20  
**Module:** **0.3.48**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B114 node-map readability, B115 NPC Wire Kit. **B113** Light/Maglock token art is Michael-supplied later — hooks only.

## Goal

One GM click on the **Wired Console** builds a usable Gold Line board from the viewed Scene: named lights → Light Control nodes, wall doors → Maglock nodes, hidden 0.25-grid tokens on the current Level, idempotent re-runs. Does **not** turn lights or doors on from the Wire (addresses only). Cameras are out of scope (add by hand).

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
| Unique `RoomName` from lights | `{Room} - Light Control` | T1 / R1 | One hidden token **next to the first light** in that room |
| Each wall with `door != NONE` | `{Room} - Maglock Door 1`, `{Room} - Maglock Door 2`, … per room | T1 / R2 | Hidden token **next to the door** |

Door room: wall name only if it also uses `{Room} - {rest…}`; otherwise **nearest light’s RoomName**, else `Unassigned`.

Same-room **Light Control ↔ Maglocks** are linked (undirected). `getBoard` preserves `autoFrom`.

Flags (idempotent skip / replace):

```text
node.autoFrom = { kind: "light-control", room, lightIds: [...] }
             | { kind: "maglock", room, doorId }
Actor flags  = { kind: "node", boardSceneId, nodeId, track, autoKind, autoFrom, tokenArt }
```

Re-run **Skip** (default) leaves existing auto-nodes. **Replace** deletes auto-nodes + tokens, then rebuilds. Manual nodes are never removed.

Placement reuses `placeNode` (B108 elevation + `canvas.level`, B110 0.25 size). Optional `{ x, y, extraFlags, textureSrc }`.

## B113 art hook

`AUTO_NODE_TOKEN_ART = { "light-control": null, maglock: null }` in `scripts/wired-auto-nodes.mjs`. When Michael drops WebPs, set those paths; `placeNode` stamps `texture.src`. Until then, generic Track 1 node tokens. **No AI art.**

## UI

Wired Console Nodes header (GM): lightbulb **Auto-nodes from Scene**. Dialog explains the naming rule and Skip vs Replace.

## Out of scope

Cameras as an auto type; Wire → meatspace light/door toggles; rewriting Gold Line; B113 art files.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Foundry (Gold Line): name lights `{Room Name} - Light Control` (e.g. `Rear Car Substation - Light Control`) → Auto-nodes → hidden tokens beside lights/doors on Interior → Console shows `Rear Car Substation - Light Control` + `Rear Car Substation - Maglock Door 1`, `… Door 2` → lights with no ` - ` warn and skip → re-run Skip adds nothing → Node Map stays readable (B114).
