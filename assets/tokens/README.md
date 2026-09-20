# Token art

Portraits stamped onto Foundry `img` fields (Items for machines/gear; Actor `img` + `prototypeToken.texture.src` for bestiary). `<dsid>` / `<slug>` is the pack filename stem (`system._dsid` on Items; JSON stem on Actors).

| Kind | Files | Foundry `img` | Status |
|---|---|---|---|
| Crewed vehicles | `vehicles/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp` | B101 shipped **0.3.31** (32) |
| Drones | `drones/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp` | B101 shipped **0.3.31** (36) |
| Armor + shields | `armor/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/armor/<dsid>.webp` | B102 shipped **0.3.32** (22) |
| Weapons | `weapons/<dsid>.webp` | `modules/draw-steel-ghostwire/assets/tokens/weapons/<dsid>.webp` | B102 shipped **0.3.32** (49) |
| Bestiary humanoids + ICE | `bestiary/<slug>.webp` | `modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp` | B103 shipped **0.3.35** (40) |
| ARG corp security (3) | `bestiary/arg/arg-*.webp` (+ PNG originals) | `modules/draw-steel-ghostwire/assets/tokens/bestiary/arg/arg-<role>.webp` | B111 shipped **0.3.47** (Enforcer, Lieutenant, Officer) |
| Mama Cassavir (L5 named boss) | `bestiary/mama-cassavir.webp` (+ PNG original) | `modules/draw-steel-ghostwire/assets/tokens/bestiary/mama-cassavir.webp` | **0.3.48** — Michael split-face (elderly organic / chrome cyborg, cyan eye, hand on deck) |
| Summons L≤4 | `summons/<slug>.webp` | `modules/draw-steel-ghostwire/assets/tokens/summons/<slug>.webp` | B103 shipped **0.3.35** (17) |

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

## Bestiary + summons (B103)

Drop WebPs into `bestiary/` (humanoids + ICE) and `summons/` (L≤4 companions / spirits / sprites / nodes), or into `_incoming-art/` (flat or those subfolders), then:

```text
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
```

Stamps Actor `img` **and** `prototypeToken.texture.src` (40 bestiary + 17 summons = 57), then rebuilds the pack(s) that changed. Spike + inventory: `docs/spikes/B103-BESTIARY-HUMANOID-PORTRAITS.md`.

## ARG corp security (B111)

Michael ARG portraits live under `bestiary/arg/` as `arg-corporate-enforcer`, `arg-response-lieutenant`, and `arg-security-officer` (PNG originals + 1024² WebP). The apply tool maps those onto pack slugs `corp-enforcer` / `response-lieutenant` / `corp-security-officer`. Replace a WebP in `arg/`, then:

```text
node tools/apply-bestiary-portrait-art.mjs
```

Spike: `docs/spikes/B111-ARG-TOKEN-ART.md`.

## Mama Cassavir (0.3.48)

Michael’s split-face portrait lives under `bestiary/` as `mama-cassavir` (PNG original + WebP). Foundry `img` and `prototypeToken.texture.src` use the WebP, matching the B103 slug convention (not the ARG `bestiary/arg/` override). Do not regenerate. Replace the files in place, then:

```text
node tools/apply-bestiary-portrait-art.mjs
```

## Wired node tokens (B110 / B113)

Generic Track 1/2 node tokens live under `summons/node-token-track-*.webp` and still apply to hand-placed / templated nodes.

**B113** Light Control / Maglock auto-node art — Michael’s **YES** tokens (1254² PNG source + 1024² WebP):

| Kind | Files | Foundry `img` / token |
|---|---|---|
| Light Control | `wired/node-light-control.{png,webp}` | `modules/draw-steel-ghostwire/assets/tokens/wired/node-light-control.webp` |
| Maglock | `wired/node-maglock.{png,webp}` | `modules/draw-steel-ghostwire/assets/tokens/wired/node-maglock.webp` |

`AUTO_NODE_TOKEN_ART` in `scripts/wired-auto-nodes.mjs` stamps those paths onto B112 auto-nodes. Replace a WebP in place to restamp future placements (already-placed tokens keep the old texture until removed and re-placed). Spike: `docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md`.
