# B41 — Wired node topology minimap (backlog)

**Status:** Backlog locked 2026-09-17 — design stub only.  
**Tied to:** Wired Console (`scripts/wired-console.mjs`), node Actors / Scene nodes, Overlay vs Jacked In vision (B23c).  
**Do NOT implement until Michael prioritizes** (natural after Console + vision tints feel solid).

## Goal
Players who are **on the Wired** (Overlay or Jacked In) get a **hovering topology view** of the Matrix nodes they can currently see on the Scene — so they can read node layout while still (in Overlay) seeing the meatspace canvas underneath.

## UX (LOCKED intent)
| Mode | Canvas / Scene | Node map |
|---|---|---|
| **Overlay** | Normal (or light Wired tint) stays visible | Floating / pop-out **topological node minimap** over (or beside) the canvas — both visible |
| **Jacked In** | Scene goes **very dark** / meatspace suppressed (align B23c Jacked In vision) | **Node map is primary** — players see the topology, not the street |

- Minimap shows only nodes the viewer **can see** (revealed / not hidden / Console visibility rules — match existing Wired Console + node token reveal).
- Topology = nodes + links (edges) if we store connections; otherwise node dots with Rating / Track badges until link data exists.
- Director keeps full Console; this is the **player-facing** companion view.
- Pop-out ApplicationV2 (or pinned HUD) so it can sit over the canvas without owning the whole screen.

## Implementation sketch
- `scripts/wired-minimap.mjs` — ApplicationV2; subscribe to Scene node flags / node Actors used by Console.
- Open automatically when actor gains Overlay or Jacked In; close or idle when neither.
- Jacked In: strengthen B23c darkness **or** canvas CSS/filter for that client only while minimap focused.
- Data: reuse Console node table + `wired-node-tokens` placement; optional graph layout (force / layered) from node positions or explicit link list later.
- Settings: enable player minimap; scale; “show Rating labels.”

## Depends on / open questions
- Confirm Overlay vs Jacked In status IDs already used by `wired-vision.mjs`.
- Whether node–node **links** exist in data yet (if not, v1 = nodes only; v1.1 = edges).
- Performance with many nodes on large Scenes.

## Out of scope (v1)
Full 3D Matrix; replacing the meatspace Scene with a second Scene; GM-only topology (Console already covers that).

## Done when (future spike)
Overlay: canvas + floating node map. Jacked In: dark scene + node map primary. Visibility respects reveal rules. Foundry-verify; no commit until Michael says.