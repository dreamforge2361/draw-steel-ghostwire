# Machine Scorch Marks — 0.3.109

Monk's Bloodsplats damage indicator for **machines** is **Scorch Marks** (`flags.monks-bloodsplats.bloodsplat-type` = `"scorch"`). Living heroes and NPCs are unchanged. The flag is harmless if Monk's Bloodsplats is disabled; it is not a module dependency.

## What gets the flag

| Path | Where |
|------|--------|
| Deploy | New Actor `prototypeToken` and the placed token. Chassis Items have no prototype token; Deploy always forces Scorch so a fresh Deploy cannot inherit blood. |
| Create / drag | `preCreateActor` / `preCreateToken` when Ghostwire kind is `drone`, `vehicle`, or `baseAsset` (includes Door Lock, Safehouse Beacon, cameras, and the other base assets). |
| Packs | Every machine Actor in `src/packs/summons/machines/` plus Nox's trash freighter (`kind: vehicle`). |
| Existing world | One GM ready pass (`machineScorchMigrated`) stamps world machine prototypes and placed tokens that are still on blood. A later manual change is left alone. |

Other `monks-bloodsplats` keys (`bloodsplat-colour`, `bloodsplat-size`, `bloodsplat-index`) are merged, not replaced.

## Automated

```bash
node tools/rigger-vertical-smoke.mjs
node tools/build-packs.mjs summons deadhead
```

## In Foundry

1. Update to **0.3.109** and F5.
2. Deploy a Bulldog (or any drone / vehicle / base asset).
3. Open the token's Token Config → Monk's Bloodsplats. Damage type should be **Scorch**.
4. Reduce the machine to 0 Stamina (or defeat the token the way the table usually does) and confirm the splat art is scorch marks, not blood.
5. Open a living hero or street NPC token and confirm its bloodsplat type did not change.
