# Spike B115 — NPC Wire Kit (Matrix Verbs)

**Date:** 2026-09-20  
**Module:** **0.3.49**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)

## Goal

Heroes get Matrix Verbs via `ds.CONFIG.hero.defaultItems`. NPCs do not. Directors need a **one-click stamp** for ARG security (and any other opposition that should act on the Wire) without forcing every bestiary Actor to carry verbs (meat-only thugs stay clean).

## Wire Kit

Droppable **feature** in Ghostwire Matrix › Support:

| | |
|---|---|
| Name | Wire Kit — Matrix Verbs |
| `_id` | `GwWireKitMxVrb01` |
| `_dsid` | `wire-kit-matrix-verbs` |
| Source | `src/packs/matrix/support/wire-kit-matrix-verbs.json` |
| UUID | `Compendium.draw-steel-ghostwire.matrix.Item.GwWireKitMxVrb01` |

On create (NPC sheet drop or GM button), `scripts/wired-kit.mjs` copies the same nine ability UUIDs heroes get (`scripts/wired-verbs.mjs` `MATRIX_VERBS`), flagged `wireKitGranted`. Idempotent: already-owned `_dsid`s are skipped. Removing the kit removes only those flagged copies.

Heroes: the kit does **not** duplicate verbs (notify and skip). Bestiary pack Actors are **not** pre-stamped.

## GM convenience

- Wired Console Nodes header (user-secret icon): **Add Wire Kit** → selected NPC tokens
- Token HUD (GM, NPC): network icon, same action
- API: `game.modules.get("draw-steel-ghostwire").api.addWireKit(actor)` / `addWireKitToSelected()`

## Optional (skipped)

Auto-grant when placing from Compactors tagged `faction: arg` AND role netrunner — not in v1. Kit is enough.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Foundry: drag ARG Response Lieutenant onto a **non–Gold Line** scratch Scene (or any Scene — this does not rewrite Gold Line). Select the token → Console **Add Wire Kit** (or HUD) → sheet shows the kit + nine Matrix Verbs. A second click does not duplicate. Freight Enforcer left unstamped has no verbs.
