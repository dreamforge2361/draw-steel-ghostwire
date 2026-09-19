# Machine token art (B101)

Chassis portraits for **Ghostwire Vehicles & Drones**. Art is forthcoming — these folders are empty on purpose.

| Kind | Files | Foundry `img` |
|---|---|---|
| Crewed vehicles | `vehicles/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp` |
| Drones | `drones/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp` |

`<dsid>` is the pack Item’s `system._dsid` (kebab-case of the chapter slang name). The drone named Rustbucket is `rustbucket-drone.webp` so it does not collide with the crewed `rustbucket.webp`.

Drop WebPs here (or into `_incoming-art/` with `drones/` + `vehicles/` subfolders), then:

```text
node tools/apply-machine-token-art.mjs --from _incoming-art
```

Spike + inventory: `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`.
