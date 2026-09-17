# Spike B51 — Program / payload execute (design)

**Status:** design-only (2026-09-17). Implement after Technomancer ability pass unless Michael reprioritizes.

## Current design (B20c/B20d)
- Decks = hosts with modSlots; programs/payloads install as mods.
- **Suite programs** (Reader, Guardian, Sneak, Skeleton, …): Activate/Deactivate toggle; software AE + optional edgeAbilities on Matrix Verb _dsids. Not meant as separate "cast Program" actions.
- **Payloads** (Zap, Crash, …): consumable; "loaded until fired" — **no Run/Fire ability today** (same gap B49 fixed for weapons).
- Matrix Verbs already exist as abilities under src/packs/abilities/matrix-verbs/.

## Recommended v1
1. Payloads: on install+active, spawn linked Run {Payload} ability (Wired effect template); remove on uninstall/deactivate/consume; route through abilityUse for B40 SFX.
2. Suites: keep Activate + edge-on-verbs; optionally ensure Matrix Verbs are granted when a hero owns a deck.
3. Do not spawn Run abilities for every suite unless rules text gains an active-use clause.

## Out of scope for v1
Deck "Run…" picker UI; Technomancer sprite compile (separate spike).
