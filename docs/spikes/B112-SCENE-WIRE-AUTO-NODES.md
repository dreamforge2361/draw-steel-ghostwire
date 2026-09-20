# Spike B112 — Scene → Wire auto-nodes

**Date:** 2026-09-20  
**Module:** **0.3.48**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B114 node-map readability, B115 NPC Wire Kit. **B113** Light/Maglock token art is Michael-supplied later — hooks only.

## Goal

One GM click on the **Wired Console** builds a usable Gold Line board from the viewed Scene: named lights → Light Control nodes, wall doors → Maglock nodes, hidden 0.25-grid tokens on the current Level, idempotent re-runs. Does **not** turn lights or doors on from the Wire (addresses only). Cameras are out of scope (add by hand).

**Hard lock:** do not touch `scripts/gold-line-scene.mjs` live-scene `{ force: true }` behaviour. Do not inject/overwrite Gold Line walls, lights, or tiles.

## Room naming (lights)

Lights always start with the room name (Michael). Practical parser (`parseRoomName` in `scripts/wired-auto-nodes.mjs`):

1. If the name contains ` - `, **room = trimmed part before the first ` - `**.
2. Else take **leading words until a type keyword**: Light, Lights, Control, Cam, Camera, Cameras, Work, Maglock, Door, Host, Node, ICE.
3. Shortcut: if no keyword fires, **first two words**, unless the second word is itself a keyword — then first word only.

| Light name | Room |
|---|---|
| Rear Bay Work Light | Rear Bay |
| Cab Light | Cab |
| Aft Freight Work Light | Aft Freight |
| R2 - Wire Closet Light | R2 |
| Track Light | Track |

Unnamed lights are skipped. Documented in Console helpText (`GHOSTWIRE.WiredConsole.AutoNodesRule`).

## Nodes

| Source | Board node | Track / Rating | Token |
|---|---|---|---|
| Unique `RoomName` from lights | `{RoomName} Light Control` | T1 / R1 | One hidden token **next to the first light** in that room |
| Each wall with `door != NONE` | `{RoomName} Maglock Door 1`, `… Door 2`, … per room | T1 / R2 | Hidden token **next to the door** |

Door room: parse the wall’s name if set, else **nearest light’s RoomName**, else `Unassigned`.

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

Foundry (Gold Line): name lights with the room rule → Auto-nodes → hidden tokens beside lights/doors on Interior → Console shows `{Room} Light Control` + Maglocks → re-run Skip adds nothing → Node Map stays readable (B114).
