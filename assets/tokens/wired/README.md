# Wired node token library

Foundry tokens for Wired Console nodes. Generic Track 1/2 templates (`summons/node-token-track-*.webp`) stay the default when `tokenStyle` is empty.

## Catalog (Michael YES art)

| Id | Label | PNG source (1254²) | Foundry WebP (1024²) | Auto-node |
|---|---|---|---|---|
| `light-control` | Light Control | `node-light-control.png` | `node-light-control.webp` | named lights |
| `maglock` | Maglock Door | `node-maglock.png` | `node-maglock.webp` | wall doors |
| `cam-controls` | Cam Controls | `node-cam-controls.png` | `node-cam-controls.webp` | cam lights / named cams |
| `black-ice` | Black ICE | `node-black-ice.png` | `node-black-ice.webp` | — |
| `normal-ice` | Normal ICE | `node-normal-ice.png` | `node-normal-ice.webp` | — |
| `mechanical` | Mechanical interface | `node-mechanical.png` | `node-mechanical.webp` | — |
| `turret-controls` | Turret Controls | `node-turret-controls.png` | `node-turret-controls.webp` | — |
| `data-vault` | Data Vault | `node-data-vault.png` | `node-data-vault.webp` | — |

Catalog: `library.json`. Runtime: `scripts/wired-node-art.mjs`. Console **Token art** select writes `tokenStyle`; Place on canvas stamps the WebP.

## Drop-in

1. Drop `node-<id>.png` + `node-<id>.webp` here.
2. Append a `styles[]` row to `library.json` and `NODE_TOKEN_LIBRARY`.
3. Reload the world — the picker lists it.

Do not rename the three auto filenames (`node-light-control`, `node-maglock`, `node-cam-controls`).
