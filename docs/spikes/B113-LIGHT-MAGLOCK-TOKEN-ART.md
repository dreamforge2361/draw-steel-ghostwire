# Spike B113 — Light Control / Maglock token art

**Date:** 2026-09-20  
**Module:** **0.3.49**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B112 Scene → Wire auto-nodes. Generic Track 1/2 node templates are unchanged.

## Goal

Light Control and Maglock auto-nodes use distinct token art, not the generic Track 1 vault-wheel. Icons must read at **0.25 grid** (B110).

Michael lock (2026-09-20): Light Control = cyan lightbulb + power symbol. Maglock = sliding doors + padlock. **YES art** attached 2026-09-20: 1254² PNG originals + 1024² WebP (same convention as B111).

## Assets

PNG source (Michael, **1254²**) + Foundry WebP (**1024²**), both under `assets/tokens/wired/`:

| Kind | Files | Foundry path |
|---|---|---|
| Light Control | `node-light-control.{png,webp}` | `modules/draw-steel-ghostwire/assets/tokens/wired/node-light-control.webp` |
| Maglock | `node-maglock.{png,webp}` | `modules/draw-steel-ghostwire/assets/tokens/wired/node-maglock.webp` |
| Cam Controls | `node-cam-controls.{png,webp}` | `modules/draw-steel-ghostwire/assets/tokens/wired/node-cam-controls.webp` |

## Placement

`AUTO_NODE_TOKEN_ART` / `tokenArtFor` / `tokenArtForNode` in `scripts/wired-auto-nodes.mjs`.

When B112 creates or re-places a Light Control / Maglock / Cam Controls node, `placeNode` stamps:

- Actor `img`
- `prototypeToken.texture.src`
- placed token `texture.src`

from the matching WebP. Console **Place on canvas** uses `tokenArtForNode` (`tokenStyle`, then auto kind). Other nodes keep the Track 1/2 summons templates until the Director picks a style.

Does **not** rewrite Gold Line walls/lights/tiles. Does **not** change generic node-template art. Full 8-style catalog + Director picker: `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Foundry: Auto-nodes from Scene → hidden 0.25 tokens beside lights show the cyan bulb, beside doors show sliding doors + padlock, beside cam lights show the security cam. A hand-placed Track 1/2 node still uses the generic template until Token art is set.
