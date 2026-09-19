# Machine token art (B101)

Chassis portraits for **Ghostwire Vehicles & Drones**. Shipped **0.3.31**: **36** drone + **32** vehicle WebPs (1024²).

| Kind | Files | Foundry `img` |
|---|---|---|
| Crewed vehicles | `vehicles/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp` |
| Drones | `drones/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp` |

`<dsid>` is the pack Item’s `system._dsid` (kebab-case of the chapter slang name). The drone named Rustbucket is `rustbucket-drone.webp` so it does not collide with the crewed `rustbucket.webp`.

Replace a file in place, then:

```text
node tools/apply-machine-token-art.mjs
```

Spike + inventory: `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`.
