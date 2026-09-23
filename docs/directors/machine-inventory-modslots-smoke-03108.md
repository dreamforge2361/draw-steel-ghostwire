# Machine Inventory + modSlots Scale-floor — 0.3.108

**Locks (Michael 2026-09-23):**
1. Machine sheet **Inventory** lists real embedded `Actor.items` (Wire Kit, mods, gear) — not only Cargo/Mounts/Sensors notes.
2. **Mod slots** = `clamp(scaleFloor + availBonus, 1, 6)` — Personal 1 / Light 2 / Vehicle 3 / Heavy 4 (+ Capital 4); Street +0 / Pro +1 / Restricted +2 / Military +3 / Prototype +3.

## Code

| Area | Change |
|------|--------|
| Inventory tab | `inventoryItems` from `actor.items`; open / delete / create; drop via ActorSheetV2; Cargo/Mounts/Sensors under notes `<details>` |
| modSlots | All `src/packs/vehicles/**` retuned; lang Descriptions; summons base-asset templates; chapter tables 15/16 |
| Deploy stamp | Unchanged path — still reads `flags.*.vehicle.modSlots` onto machine Actor |

## Sample slots (before → after)

| Chassis | Scale | Avail | Before | After |
|---------|-------|-------|--------|-------|
| Fly | Personal | Street | 1 | 1 |
| Junk Rotor | Light | Street | 1 | 2 |
| **Bulldog** | Vehicle | Street | **1** | **3** |
| Flatbed | Heavy | Restricted | 3 | 6 |
| Brick | Heavy | Military | 4 | 6 |
| Black Ledger | Heavy | Prototype | 5 | 6 |

## Automated

```bash
node tools/build-packs.mjs vehicles summons
```

(Foundry must be closed.)

## In Foundry

1. **Inventory list** — Deploy a drone. Open machine Actor sheet → Inventory. Wire Kit row visible (name/img/type). Click opens item sheet. Trash deletes (confirm).
2. **Drop** — Drop a mod/gear Item onto the machine sheet; it appears in Inventory without switching to NPC sheet.
3. **Notes** — Cargo/Mounts/Sensors still under Inventory notes disclosure; Save still writes them.
4. **Bulldog slots** — Deploy Bulldog (or open Item): Mod slots **3**. Machine Build tab Mod slots shows 3 after Deploy.
5. **Street floors** — Personal micro Street = 1; Light Street = 2; Vehicle Street = 3; Heavy Street = 4.

## Notes

- Soft max 6. Second Face (Personal Prototype) is 4 by formula (was 5).
- Base-asset Personal Street benches that had inflated slots (workshop 3) now 1 — formula applies to all vehicles pack entries.
