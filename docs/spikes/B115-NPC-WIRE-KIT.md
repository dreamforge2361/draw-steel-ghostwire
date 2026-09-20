# Spike B115 — NPC Wire Kit (Matrix Verbs)

**Date:** 2026-09-20  
**Module:** **0.3.49** (grant stamp); **B117 0.3.53** verbs off the sheet; **0.3.68** kit is a Connect interface  
**Status:** **SHIPPED** (pending Michael Foundry-verify)

## Goal

Heroes fire Matrix Verbs from the node applet (B117). NPCs do not get a commlink by default. Directors need a **one-click stamp** for ARG security, drones, and any other opposition that should act on the Wire — without forcing every bestiary Actor to carry verbs (meat-only thugs stay clean) and **without** putting the nine verbs on the sheet.

## Wire Kit

Droppable **feature** in Ghostwire Matrix › Support:

| | |
|---|---|
| Name | Wire Kit — Matrix Verbs |
| `_id` | `GwWireKitMxVrb01` |
| `_dsid` | `wire-kit-matrix-verbs` |
| Source | `src/packs/matrix/support/wire-kit-matrix-verbs.json` |
| UUID | `Compendium.draw-steel-ghostwire.matrix.Item.GwWireKitMxVrb01` |
| Flags | `kind: "wire-kit"`, `wired.connectInterface: true` |

On create (NPC sheet drop or GM button), `scripts/wired-kit.mjs` stamps the kit feature only. It does **not** copy Matrix Verb abilities (`grantMatrixVerbs` is a no-op). Idempotent: a second click does not duplicate the kit. Removing the kit removes leftover `wireKitGranted` copies if any remain from pre-B117 worlds.

**Connect interface (0.3.68).** `itemIsConnectInterface` treats Wire Kit as a Wire interface: `kind === "wire-kit"` and/or `_dsid === "wire-kit-matrix-verbs"`, plus the pack `connectInterface` stamp. Existing world copies that only have `kind: "wire-kit"` (Michael’s drone on scene) can Connect → Linked without a separate commlink, deck, datajack, or RCC `matrix.role`. RCC-linked drones may still use role `rcc` if present; do **not** require it for the Director stamp path. **Wrench drone control (RCC or Rigger’s Harness) counts as a Connect interface.** RAW `docs/raw/21-the-wire.md` (Wire interface section), Foundry journals (`21-the-wire`), and the VOIDMARK index name the same allow-list.

Heroes: the kit does **not** duplicate verbs (notify and skip). Bestiary pack Actors are **not** pre-stamped (except **pack drone and vehicle** templates).

## Pack drones and vehicles (0.3.68)

Ghostwire Summons › Machines band templates — all three drones (`machine-drone-micro|small|medium`) **and** all six vehicles (`machine-vehicle-bike|car|heavy|air|water|space`) — embed Wire Kit so a Deploy / import is Wire-ready. Other pack Actors with `kind: "vehicle"` (Nox’s trash freighter) get the same stamp. Vehicles connect as Wire nodes too (same net-access stamp). **Not** auto-Overlay and **not** auto-Linked — Connect is still required. `scripts/machines.mjs` `deployMachine` stamps the kit on drones **and** vehicles if a copy is missing it. World ready (`stampWireKitOnMachines`) stamps existing world Actors with `kind: "drone"` or `kind: "vehicle"` that lack the kit. **0.3.68 art:** generic **Drone (Medium)** (`machine-drone-medium`) and the **Mule-Bot** cargo SKU share Michael’s circular yellow forklift-tread plate (`assets/tokens/drones/mule-bot.{png,webp}`).

## GM convenience

- Wired Console Nodes header (user-secret icon): **Add Wire Kit** → selected NPC tokens
- Token HUD (GM, NPC): network icon, same action
- API: `game.modules.get("draw-steel-ghostwire").api.addWireKit(actor)` / `addWireKitToSelected()`

## Optional (skipped)

Auto-grant when placing from Compactors tagged `faction: arg` AND role netrunner — not in v1. Kit is enough.

## Verify

```text
node tools/b112-b115-smoke.mjs
node tools/b117-console-verbs-smoke.mjs
```

Foundry: drag a drone or ARG Response Lieutenant onto a **non–Gold Line** scratch Scene (this does not rewrite Gold Line). Pack drones already have the kit. Select an unstamped token → Console **Add Wire Kit** (or HUD) → Features shows the kit, **none** of the nine Matrix Verbs on the sheet. Wired Console: Connect enabled (not DISCONNECTED / NeedInterface). Connect lands **Linked**. Toggle to Overlay, then Scan etc. A second click does not duplicate. Freight Enforcer left unstamped has no kit and cannot Connect. A Wrench with **Rigger’s Harness** (no commlink) can Connect.
