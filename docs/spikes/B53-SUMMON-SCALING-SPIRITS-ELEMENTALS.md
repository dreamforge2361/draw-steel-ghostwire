# Spike B53 — Summon scaling for spirits & elementals (design + later implement)

**Status:** backlog after B52. Design lock from Michael 2026-09-17: pets should get stronger as the caster levels — same *fantasy* as Technomancer sprites, but **follow each class RAW**, do not clone the sprite 4×3 Actor matrix blindly.

## Sprites (reference — already B52)
Hybrid ranks L1–3 / L4–7 / L8–10 + Stamina ase + (Logic × Level). Encounter-end decompile → next compile is correct band.

## Elementalist
- Rank by Echelon / bind cap; extension vs independent; Persistent Essence throttle.
- Companions (ember/zephyr/boulder) + Rank scaffolds; Greater at high cost bands.
- Veil §C3 Stamina tables still backlog — when locked, stamp on summon and refresh on re-summon / echelon change.

## Street Priest
- Ability-driven summons (Sentinel Spirit, Invoke the Pact, etc.).
- 3 archetypes + Light/Dark tint.
- Scale via ability text / pact features; add Foundry refresh only where RAW gains durable pet Actors.

## Shared Foundry pattern (when implementing)
Pick archetype → stamp Actor for current power band/rank → link caster ↔ pet → dismiss/recall → on level/echelon change, next summon (or explicit refresh) uses new math.
