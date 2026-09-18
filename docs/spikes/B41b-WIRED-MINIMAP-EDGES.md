# B41b — Wired node↔node wires (board links + minimap edges)

**Status:** Built 2026-09-18 (0.1.83). **Awaiting Michael's Foundry verify. Not committed.**
**Parent:** B41 minimap (`docs/directors/wired-node-minimap.md`, v1.1 edges sketch). **Out of scope:** force-directed layout, 3D Matrix, auto-inferring links from token distance.

## Data (board schema)
- Each board node (`flags.draw-steel-ghostwire.wiredBoard.nodes[]`) carries `links: [nodeId, …]`. The graph is **undirected**.
- `getBoard` (`scripts/wired-console.mjs`) normalizes on read: non-array → `[]`, non-string ids dropped, duplicates dropped, self-links dropped, ids not on this board dropped, and one-sided links are mirrored (A lists B ⇒ B lists A). Older boards with no `links` read as `[]`, so nothing migrates. The cleaned lists are written back the next time the Console saves the board.
- `#makeNode` includes `links: []` (Add Node, Random Node, template, cluster).
- `setLink(nodes, a, b, linked)` (exported, also on `module.api.setLink`) sets or clears both ends at once. The Console's Links checkboxes are the only writer.
- **Delete Node** strips the deleted id from every other node's `links` before removing it. **Reset Board** empties the board, so no links survive.

## Console UI
Director-only **Links** block in the selected-node detail panel, between Description and Director notes. It lists every other node on the board as a checkbox with its name and `R#`. Unrevealed nodes are italic/muted with an eye-slash icon. The block title shows the current link count. Checking or unchecking saves right away through `#updateBoard` (one `setFlag`), and live refresh re-renders the Console and the minimap. Players' Console is unchanged (no Links block). Integrity, Alert, Reveal, Place and Delete are untouched.

i18n: `GHOSTWIRE.WiredConsole.Links`, `LinksHint`, `LinksNone`.

## Minimap
- `edges(nodes, positions)` in `scripts/wired-minimap.mjs` builds one wire per linked pair **within the nodes this viewer sees**, using the same `layout()` positions.
  - **Player:** visible = revealed nodes, so a wire shows only when **both ends are revealed**. A link to a hidden node draws nothing, and the hidden node stays hidden.
  - **GM (Director view):** visible = every node. Wires that touch an unrevealed node draw **dashed grey**, matching the dashed hidden-node outline.
- Drawn as `<svg class="wm-wires" viewBox="0 0 100 100" preserveAspectRatio="none">` absolutely filling `.wm-field`, **before** the node buttons (so behind them). `<line>` endpoints use the same % coords as the nodes' `left/top`, and `vector-effect: non-scaling-stroke` keeps stroke widths even when the window isn't square. `pointer-events: none`, so node clicks and tooltips work as before.
- Style: Overlay = thin cyan, 0.55 opacity, soft glow. Jacked In = hot pink, a bit thicker and brighter. Hidden = grey dashed `4 4`, no glow.
- Live refresh: link edits are a board flag write → the existing `updateScene` hook re-renders. Moving a placed node's token moves its wires.

## Foundry-verify checklist
1. **Link:** Console, add two nodes A and B. Select A, then check B under **Links** → count shows 1. Select B → A is checked (both ends list each other).
2. **Unlink:** uncheck A on B → A's Links no longer has B.
3. **Minimap, both revealed:** reveal A and B, link them. Player goes Overlay → cyan wire between them. Toggle to Jacked In → the wire turns pink.
4. **Hidden endpoint:** hide B. Player map: B and the wire both disappear. GM opens the map by hand: B dashed, wire dashed grey.
5. **Live:** with the player map open, link or unlink in the Console → the wire appears or disappears without reopening. Place A on the canvas and drag it → the wire follows.
6. **Delete:** link A–B and A–C, then delete A. B and C show no links. Re-save anything and confirm no errors in the console (F12).
7. **Old board:** a Scene built before 0.1.83 opens fine with empty Links and no wires.
8. Existing Console controls (Integrity damage/restore, Alert ±/max/reset, Reveal, Place/Remove, Delete) behave as before.
