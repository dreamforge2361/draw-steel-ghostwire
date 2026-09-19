# Token art

Portraits stamped onto Foundry Item `img` fields. `<dsid>` is the pack Item’s `system._dsid` (kebab-case filename stem).

| Kind | Files | Foundry `img` | Status |
|---|---|---|---|
| Crewed vehicles | `vehicles/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp` | B101 shipped **0.3.31** (32) |
| Drones | `drones/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp` | B101 shipped **0.3.31** (36) |
| Armor + shields | `armor/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/armor/<dsid>.webp` | B102 shipped **0.3.32** (22) |
| Weapons | `weapons/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/weapons/<dsid>.webp` | B102 shipped **0.3.32** (49) |

The drone named Rustbucket is `rustbucket-drone.webp` so it does not collide with the crewed `rustbucket.webp`. Firearm **Workhorse** is `weapons/workhorse.webp`; the van is `vehicles/workhorse.webp`.

## Machines (B101)

Replace a file in place, then:

```text
node tools/apply-machine-token-art.mjs
```

Spike + inventory: `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`.

## Armor + weapons (B102)

Replace a file in place, then:

```text
node tools/apply-gear-token-art.mjs
```

Stamps Gear pack Items **and** matching embedded treasure Items on pregens, then rebuilds `packs/gear` + `packs/pregens`. Spike + inventory: `docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md`.
