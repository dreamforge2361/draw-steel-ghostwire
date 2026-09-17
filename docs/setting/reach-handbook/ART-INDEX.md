# Reach Handbook — Art Index

Extracted from `GHOSTWIRE — The Ossian Reach Handbook.pdf` (175 pages, Volume One — The Flats).
Source PDF is external and read-only; it is never copied into this repo.

All shipped assets live in `assets/reach-handbook/` and are the **only** raster art in the book.
Every one is a full-bleed composed page image: artwork plus its baked-in title bar and legend
(the page's own text layer is empty for these pages — the labels are part of the image).

Encoding: WebP, `method=6`, no upscaling, no cropping. Native size is 2000x1250 for every
image, which already matches the ~2000 px longest-edge target, so nothing was resized.
Maps are encoded at quality 90 so the numbered legend stays sharp; the cover plate at 85.

**Folder total: 6.43 MB across 13 files.**

## Shipped assets

| # | Output path | Src page | Kind | Depicts | Belongs with | Original px | Final px | Final size |
|---|---|---|---|---|---|---|---|---|
| 01 | `assets/reach-handbook/01-cover-ossian-reach-handbook.webp` | 1 | plate (cover) | Book cover — aerial night view of the Reach interchange with title lockup "The Ossian Reach Handbook / Volume One — The Flats" | Front matter / journal cover image | 2000x1250 | 2000x1250 | 301 KB |
| 02 | `assets/reach-handbook/02-the-flats-master-district-map.webp` | 2 | map (region) | Master district map of The Flats — all eleven districts with a numbered 1–11 district key | The Flats — A Street-Level Primer for Directors (p. 3–11); top-level Maps journal entry | 2000x1250 | 2000x1250 | 533 KB |
| 03 | `assets/reach-handbook/03-switchboard-district-map.webp` | 12 | map (district) | Switchboard district map, 10 numbered key locations (The Switchboard, Melt Market, Grafthouse Walk, Green Room, Hollow Rail Stn., Lamp on Ninth, Fixer's Row, Dry Dock, Ash Tenements, Signal Spike) | Gazetteer — Switchboard, "Upper Underlevels" (chapter opens p. 13) | 2000x1250 | 2000x1250 | 538 KB |
| 04 | `assets/reach-handbook/04-neon-shambles-district-map.webp` | 24 | map (district) | The Neon Shambles district map, 10 numbered key locations | Gazetteer — The Neon Shambles, "Night-Market Core" (chapter opens p. 25) | 2000x1250 | 2000x1250 | 581 KB |
| 05 | `assets/reach-handbook/05-the-stacks-district-map.webp` | 36 | map (district) | The Stacks district map, 10 numbered key locations | Gazetteer — The Stacks, "Worker Housing Blocks" (chapter opens p. 37) | 2000x1250 | 2000x1250 | 505 KB |
| 06 | `assets/reach-handbook/06-slackwater-district-map.webp` | 48 | map (district) | Slackwater district map, 10 numbered key locations | Gazetteer — Slackwater, "The Flooded Docks" (chapter opens p. 49) | 2000x1250 | 2000x1250 | 469 KB |
| 07 | `assets/reach-handbook/07-the-interchange-district-map.webp` | 60 | map (district) | The Interchange district map, 10 numbered key locations (Cloverleaf, Pump Row, Toll Ghost, Underpass, Chop Circle, Roadside Shrine, Meridian Gantry, Weigh Station, Neon Mile, Dead Ramp) | Gazetteer — The Interchange, "The Highway Sprawl" (chapter opens p. 61) | 2000x1250 | 2000x1250 | 544 KB |
| 08 | `assets/reach-handbook/08-cinder-market-district-map.webp` | 72 | map (district) | Cinder Market district map, 10 numbered key locations | Gazetteer — Cinder Market, "The Grey-Tech Forge" (chapter opens p. 73) | 2000x1250 | 2000x1250 | 629 KB |
| 09 | `assets/reach-handbook/09-the-spillway-district-map.webp` | 84 | map (district) | The Spillway district map, 10 numbered key locations | Gazetteer — The Spillway, "The Drain Quarter" (chapter opens p. 85) | 2000x1250 | 2000x1250 | 487 KB |
| 10 | `assets/reach-handbook/10-glasshook-district-map.webp` | 96 | map (district) | Glasshook district map, 10 numbered key locations | Gazetteer — Glasshook, "The Fallen Arcade" (chapter opens p. 97) | 2000x1250 | 2000x1250 | 483 KB |
| 11 | `assets/reach-handbook/11-wireside-district-map.webp` | 108 | map (district) | Wireside district map, 10 numbered key locations | Gazetteer — Wireside, "The Data Slums" (chapter opens p. 109) | 2000x1250 | 2000x1250 | 596 KB |
| 12 | `assets/reach-handbook/12-gallows-end-district-map.webp` | 120 | map (district) | Gallows End district map, 10 numbered key locations | Gazetteer — Gallows End, "The Edge of the Warrens" (chapter opens p. 121) | 2000x1250 | 2000x1250 | 387 KB |
| 13 | `assets/reach-handbook/13-cinderhold-outer-gate-district-map.webp` | 132 | map (district) | Cinderhold & the Outer Gate map — wall, caravan yard and near-wilds jungle, 10 numbered key locations (Marrow Gate, Cindermarket, Marrow's Lantern, Greenline Post, Caravan Yard, Outer Wall, Burn-Yard, Chapel of Ash, Rustworks, Wasteland Overlook) | Gazetteer — Cinderhold & The Outer Gate, "The Edge of the World" (chapter opens p. 133) | 2000x1250 | 2000x1250 | 536 KB |

Ordering note: file numbers follow page order, so `03`–`13` are the eleven gazetteer
districts in the same order as the master map's 1–11 key and the book's chapter order.

## Rejected / not extracted

Nothing was dropped for quality or duplication — the book contains exactly **13 embedded
raster images in total**, and all 13 are shipped. Details of what was checked and excluded:

| Item | Why not shipped |
|---|---|
| Page furniture: rules, header bars, legend boxes, callout frames | Not raster at all. These are vector drawing ops (max 26 per page, typically 19–20) — nothing to extract. |
| Logos, borders, textures, repeated furniture images | None exist as embedded images. The only 13 image XObjects in the PDF are the cover and the 12 full-page composed plates/maps listed above. |
| Any image under ~400x400 px or ~40 KB | None found. Every embedded image is 2000x1250 PNG, 3.0–4.5 MB. |
| Section divider pages 144 (The Night Roster), 150 (NPCs of the Reach), 167 (Critters of the Reach) | Text-only dividers with no artwork and no embedded image. |
| Stat-block, NPC and critter pages (p. 145–175) | Text and vector layout only; no portraits or illustrations embedded. |

### Notes for the journal generator

- **No vector-only maps.** Every page was checked with `page.get_drawings()`; the highest
  count on any page is 26 shapes (layout rules and boxes), so no map exists as vector art.
  **No page was rasterised** — all 13 assets are lifted straight from embedded image XObjects.
- **No hive cross-sections, floorplans, or building interiors** exist in the book. Every map
  is a top-down district plan. Do not promise section views in journal text.
- Each district map carries its own legend inside the image, so a journal image page needs no
  separate key; the legend entries do, however, match the location headings in that district's
  gazetteer chapter and can be cross-linked by name.
- `01-cover-…` has the book title baked in; use it as a cover/banner, not as generic art.
- Source PNGs were 3.0–4.5 MB each (roughly 47 MB total); WebP re-encode brings the shipped
  folder to 6.43 MB with no resizing or cropping.
