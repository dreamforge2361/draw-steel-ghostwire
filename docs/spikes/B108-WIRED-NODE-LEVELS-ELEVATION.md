# Spike B108 — Wired node Place uses current Level elevation

**Date:** 2026-09-19  
**Module:** **0.3.44**  
**Status:** SHIPPED

## Bug
GM on Gold Line Interior Level; Wired Console Place Node put the token on the Roof Level.

## Cause
`placeNode` in `scripts/wired-node-tokens.mjs` created tokens with only `{ x, y, actorLink, hidden }`. Foundry V14 Levels require `level` (and elevation); drag-drop sets `canvas.level`, scripted `createEmbeddedDocuments` does not.

## Fix
`placementElevationAndLevel()` prefers theripper `CONFIG.Levels.UI.rangeBottom`, else `canvas.level` id + elevation.bottom, else controlled token elevation, else 0. Passed into `getTokenDocument`.

## Verify
Interior Level selected → Place Node → token appears on Interior, not Roof.
