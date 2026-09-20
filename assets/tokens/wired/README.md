# Wired node token library

Foundry tokens for Wired Console nodes. Generic Track 1/2 templates (`summons/node-token-track-*.webp`) stay the default when `tokenStyle` is empty.

## Device catalog (Michael YES art, 0.3.49)

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

Do not rename the three auto filenames (`node-light-control`, `node-maglock`, `node-cam-controls`). Auto-nodes stay **room-scale Device** tokens — never Relay / Host / Segment.

## Atlas styles (B116 topology, 0.3.51) — Michael art

Michael PNG + WebP landed. Catalog rows are `"placeholder": false`. Family / altitude unchanged. Do **not** regenerate.

| Id (`tokenStyle`) | Label | Altitude | Files |
|---|---|---|---|
| `node-relay` | Relay | Region / district graph | `node-relay.png` + `node-relay.webp` |
| `node-host` | Host | Region graph; site root on facility graphs | `node-host.png` + `node-host.webp` |
| `node-segment` | Segment | Site / facility graph | `node-segment.png` + `node-segment.webp` |

Foundry paths:

```text
modules/draw-steel-ghostwire/assets/tokens/wired/node-relay.webp
modules/draw-steel-ghostwire/assets/tokens/wired/node-host.webp
modules/draw-steel-ghostwire/assets/tokens/wired/node-segment.webp
```

## Megacorp Host styles (Ten Conglomerates, 0.3.54)

Generic **Host** (`node-host`) stays the default. Each conglomerate also ships a Host skin. Auto-nodes stay Light / Maglock / Cam — these are Director-picked atlas Hosts, not device defaults.

| Id (`tokenStyle`) | Label | Files |
|---|---|---|
| `node-host-hal` | Host — HALO Ascendant (HAL) | `node-host-hal.png` + `node-host-hal.webp` |
| `node-host-fer` | Host — Ferrum Dynastic (FER) | `node-host-fer.png` + `node-host-fer.webp` |
| `node-host-mer` | Host — Meridian Signal (MER) | `node-host-mer.png` + `node-host-mer.webp` |
| `node-host-cad` | Host — Caduceus Vitalis (CAD) | `node-host-cad.png` + `node-host-cad.webp` |
| `node-host-irn` | Host — Ironclad Martial (IRN) | `node-host-irn.png` + `node-host-irn.webp` |
| `node-host-arg` | Host — Argent Exchange (ARG) | `node-host-arg.png` + `node-host-arg.webp` |
| `node-host-ver` | Host — Verdant Provision (VER) | `node-host-ver.png` + `node-host-ver.webp` |
| `node-host-obs` | Host — Obsidian Holdings (OBS) | `node-host-obs.png` + `node-host-obs.webp` |
| `node-host-san` | Host — Sanctum Assurance (SAN) | `node-host-san.png` + `node-host-san.webp` |
| `node-host-nyx` | Host — Nyx Cartel (NYX) | `node-host-nyx.png` + `node-host-nyx.webp` |

Tickers locked: `docs/rulebook/MEGACORP-TICKERS.md`. Do **not** regenerate.

**Endpoint** (`node-endpoint`) is optional v1.1 — a dig-down leaf that opens a meatspace room. Until then, reuse Host with a depth pip. Do not add a fourth v1 atlas altitude.

Place on canvas stamps the matching WebP. Generic Track 1/2 templates stay when `tokenStyle` is empty.

Catalog: `library.json`. Runtime: `scripts/wired-node-art.mjs`. Console **Token art** select writes `tokenStyle`. Topology rules: `docs/spikes/B116-WIRE-ATLAS.md`. Device library spike: `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`.

## Drop-in

1. Drop `node-<id>.png` + `node-<id>.webp` here.
2. Append a `styles[]` row to `library.json` and `NODE_TOKEN_LIBRARY`. Atlas Relay / Host / Segment already ship (not stubs). Megacorp Hosts are extra rows (`node-host-{ticker}`); keep generic `node-host`.
3. Reload the world — the picker lists it.
