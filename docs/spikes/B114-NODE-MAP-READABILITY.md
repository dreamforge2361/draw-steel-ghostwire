# Spike B114 — Node-map readability (dense boards)

**Date:** 2026-09-20  
**Module:** **0.3.48**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Fail-case:** Wired Node Map labels overlapped on Gold Line (20+ lights/doors/cams).

## Goal

Dense boards stay readable. Gold Line with 20+ nodes must not stack pills on top of each other.

## Layout (`scripts/wired-layout.mjs`)

Used by `scripts/wired-minimap.mjs`. Pure functions (smoke-tested).

1. **Spatial** — if node tokens exist, keep relative canvas positions (meatspace shape).
2. **Cluster-by-room** — if names share room prefixes (`{Room} - Light Control` / `{Room} - Maglock Door N`), column tree: Light Control above maglocks.
3. **Force-directed** — unplaced, unclustered boards: repulsion + link attraction, then clamp to padding.
4. **Collision avoidance** — `separateLabels` pushes overlapping pill boxes apart (min centre distance ~8–11% of the field).

Dense mode kicks in at **12+** visible nodes: smaller dots, truncated pills (`shortNodeName`: “Light Control” → `LC`, “Maglock Door 2” → `D2`), full name in the existing tooltip.

## Zoom / pan

The map field is a transform viewport:

- **Scroll** zooms (0.6–3×) around the cursor
- **Drag** empty field to pan
- **Double-click** empty field, or the header expand button, resets the view

View is stored on the Application instance so live board refreshes do not snap back to 1×.

## Files

- `scripts/wired-layout.mjs`
- `scripts/wired-minimap.mjs`, `templates/wired-minimap.hbs`
- CSS: `.wm-viewport`, `.is-dense`, smaller `.wm-name` / `.wm-dot`

Does not change Console node-list order. Does not touch Gold Line live-scene force.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Smoke asserts 24 Gold Line-style nodes (8 rooms × light + 2 maglocks) have min centre separation ≥ 7 after layout, and truncated labels stay short.

Foundry: after B112 auto-nodes, open **Wired Node Map** — pills should not sit on top of each other; zoom/pan; hover shows the full name.
