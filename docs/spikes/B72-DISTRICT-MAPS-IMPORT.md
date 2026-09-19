# B72 — District maps import (full-res battle maps)

**Date:** 2026-09-18 (ET)  
**Module:** **0.3.0** art import (`cdc4c0e`); journal wiring follow-up on this commit.  
**Policy (LOCKED):** battle maps / play surfaces — **full native resolution only** (WebP; **no** downscale). Regional maps and handbook book plates untouched.

## Source
`C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art\Ossian Reach District Maps\` (Clean + Labeled + top-level master JPGs).

## Shipped paths
`assets/maps/districts/{clean,labeled}/` + root masters. Foundry serves `assets/` without `module.json` file list (same as reach-handbook / portraits).

### Inventory (27 WebP, 13.45 MB)

| Path | Dims | Bytes |
|---|---|---|
| `SWITCHBOARD_District_Map_2000x1250.webp` | 2000x1250 | 509,962 |
| `THE_FLATS_Master_District_Map_2000x1250.webp` | 2000x1250 | 501,638 |
| `clean/00_flats_overview.webp` | 1254x1254 | 534,296 |
| `clean/01_switchboard.webp` | 1254x1254 | 516,436 |
| `clean/02_neon_shambles.webp` | 1254x1254 | 573,506 |
| `clean/03_the_stacks.webp` | 1024x1536 | 545,942 |
| `clean/04_slackwater.webp` | 1254x1254 | 431,366 |
| `clean/05_the_interchange.webp` | 1254x1254 | 552,796 |
| `clean/06_cinder_market.webp` | 1254x1254 | 645,002 |
| `clean/07_the_spillway.webp` | 1254x1254 | 468,640 |
| `clean/08_glasshook.webp` | 1254x1254 | 448,716 |
| `clean/09_wireside.webp` | 1536x1024 | 608,696 |
| `clean/10_gallows_end.webp` | 1536x1024 | 358,440 |
| `clean/11_cinderhold.webp` | 1254x1254 | 539,848 |
| `labeled/00_flats_overview_L.webp` | 2000x1250 | 545,588 |
| `labeled/01_switchboard_L.webp` | 2000x1250 | 550,522 |
| `labeled/02_neon_shambles_L.webp` | 2000x1250 | 595,182 |
| `labeled/03_the_stacks_L.webp` | 2000x1250 | 517,064 |
| `labeled/04_slackwater_L.webp` | 2000x1250 | 479,870 |
| `labeled/05_the_interchange_L.webp` | 2000x1250 | 557,214 |
| `labeled/06_cinder_market_L.webp` | 2000x1250 | 643,698 |
| `labeled/07_the_spillway_L.webp` | 2000x1250 | 499,152 |
| `labeled/08_glasshook_L.webp` | 2000x1250 | 494,400 |
| `labeled/09_wireside_L.webp` | 2000x1250 | 610,434 |
| `labeled/10_gallows_end_L.webp` | 2000x1250 | 396,384 |
| `labeled/11_cinderhold_L.webp` | 2000x1250 | 548,772 |
| `labeled/_cover.webp` | 2000x1250 | 428,514 |

## Journal wiring
- Reach Handbook **district journals** (Switchboard → Cinderhold): new leading page **District Map** → `assets/maps/districts/labeled/<NN>_*_L.webp`
- Reach Handbook **Maps** journal: appended B72 index + battle-map image pages (masters, cover, overview, 11 districts)
- Handbook book-plate pages under `assets/reach-handbook/` **unchanged**
- Wired Flats (B46) gazetteer: not rewritten (matrix nodes); use labeled district maps from handbook / Maps journal
- Scenes: not created

## Gitignore
- `assets/maps/districts/_png-backup/`
- `assets/maps/districts/**/*.png`
- `_incoming-art/districts/`

## Do not
- Downscale; overwrite regional `ossian-reach-regional-map*`; commit from stale Windows 0.1.90 without pull; force-push.
