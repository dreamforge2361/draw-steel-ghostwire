# Spike B116 — Node token library (Director picker)

**Date:** 2026-09-20  
**Module:** **0.3.48**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** B112 auto-nodes, B113 Light/Maglock art.

## Goal

Director picks a node token style from the Wired Console. Auto Light / Maglock / Cam keep locked defaults. Michael ships more styles into `assets/tokens/wired/`.

## Catalog (8)

| Id | Label | File | Auto |
|---|---|---|---|
| `light-control` | Light Control | `node-light-control.webp` | named lights |
| `maglock` | Maglock Door | `node-maglock.webp` | wall doors |
| `cam-controls` | Cam Controls | `node-cam-controls.webp` | cam lights / named cams (`rest` contains Cam / Camera) |
| `black-ice` | Black ICE | `node-black-ice.webp` | — |
| `normal-ice` | Normal ICE | `node-normal-ice.webp` | — |
| `mechanical` | Mechanical interface | `node-mechanical.webp` | — |
| `turret-controls` | Turret Controls | `node-turret-controls.webp` | — |
| `data-vault` | Data Vault | `node-data-vault.webp` | — |

PNG sources sit beside each WebP (1254² originals, 1024² Foundry WebP).

## Console

GM selected-node **Token art** `<select>` (plus Generic Track 1/2). Writes `tokenStyle`. Place / re-place / board sync stamps Actor `img`, `prototypeToken.texture.src`, and token `texture.src`.

Auto-nodes set `tokenStyle` to the locked id and ignore the picker until the Director changes it.

## Drop-in

`node-<id>.{png,webp}` + `library.json` row + `NODE_TOKEN_LIBRARY` row.

## Verify

```text
node tools/b112-b115-smoke.mjs
```

Foundry: Auto-nodes stamps Light / Maglock / Cam defaults. Select a hand-placed node → **Token art** → Black ICE / Data Vault / etc. → Place or re-sync shows that WebP. Generic Track 1/2 when the select is empty.
