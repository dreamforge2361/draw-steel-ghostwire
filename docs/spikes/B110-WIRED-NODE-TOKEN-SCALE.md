# Spike B110 — Wired node token scale

**Date:** 2026-09-20  
**Module:** **0.3.46**  
**Status:** SHIPPED

## Ask
Michael: Place Node icons are full-grid; make them as small as the wall door control mark.

## Fix
Track 1/2 `node-template` prototypes + `placeNode` create data use **width/height 0.25** (Foundry grid fractions). Door controls are not tokens — 0.25 is the closest token-scale match.

## Note
Already-placed node tokens stay 1×1 until removed and re-placed (or manually resized).
