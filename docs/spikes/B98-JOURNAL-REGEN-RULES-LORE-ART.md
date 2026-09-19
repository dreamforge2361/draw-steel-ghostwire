# B98 — Foundry journal regen (rules + lore + art)

**Date:** 2026-09-19  
**Module:** **0.3.24** (next free patch after main **0.3.23** / B91 gang signs)  
**Depends on:** Rulebook PDF 0.4.0 (B88/B97), B91 gang signs, B92 Ghostwire-only naming, B68 In Foundry sidebars, existing B42b / B45 / B46 journal tools  

## Goal

Regenerate Foundry journals after the 0.4.0 print book and L3 gang signs:

1. **Rules journals** from `docs/raw/` — text-only, **no artwork plates**. In Foundry sidebars stay in the RAW text.
2. **Lore journals** from `docs/manuscript/01-lore/` — **with** the Michael-approved plates that are in-tree.
3. Do **not** start the VOIDMARK AI applet. Do **not** casually rebuild unrelated packs.

## What was regenerated

| Pack | Source | Result |
|---|---|---|
| `rulebook` | `docs/raw/*.md` via `tools/raw-to-journals.mjs` | **28 journals / 294 pages / 5 folders**. Adds **Lifestyle & Downtime** (`26`). Index is Ghostwire-only (no “need Heroes”). Artwork stripped if present. |
| `lore` *(new)* | `docs/manuscript/01-lore/L1–L5` via `tools/lore-to-journals.mjs` | **6 journals / 44 pages / 4 folders** + Lore Index. Art injected from `ART-PLACEMENT.yml` after the matching heading. |
| `wired-flats` | already in packs | **Left as-is.** Matrix gazetteer has no print-art slots. |
| `reach-handbook` | already in packs | **Left as-is.** District maps already live in the Maps journal (`assets/reach-handbook/`). |
| Other packs | — | **Not rebuilt.** `tools/build-packs.mjs` now accepts a pack filter. |

`packFolders` still nest everything under **Ghostwire** (`#00E5FF`). The new `lore` pack is listed next to `rulebook`.

## Art mapping (lore pack)

Placed plates use `![…](modules/draw-steel-ghostwire/<repo-path>)`. Credit: Ghostwire AI (B76). Missing files are **skipped** (no ART GAP boxes in Foundry).

| Slot | Journal / heading | File | Status |
|---|---|---|---|
| `l1-cosmology` | L1 · Cosmology & the Great Conflict | `docs/manuscript/print-art/filler/cosmology.webp` | placed |
| `l1-planes` | L1 · The Planes & Dimensions | `docs/manuscript/print-art/filler/planes.webp` | placed |
| `l1-megacorps` | L1 · The Megacorps | `docs/manuscript/print-art/filler/megacorps.webp` | placed |
| `l1-wired` | L1 · The Wired — A Thin Place | `docs/manuscript/print-art/filler/wired.webp` | placed |
| `l1-timeline` | L1 · Timeline & History | `docs/manuscript/print-art/filler/timeline.webp` | placed |
| `l1-themes` | L1 · Themes & Tone | `docs/manuscript/print-art/filler/city-nocturne.webp` | placed |
| `l2-peoples-opener` | L2 · Peoples & World (chapter opener) | `docs/manuscript/print-art/filler/peoples-opener.webp` | placed |
| `people-pure-human` … `people-cyborg` | L2 · each People heading | `docs/manuscript/print-art/species/*.png` | **gap** — still local / gitignored |
| `l3-flats-overview` | L3 · What the Flats Are | `assets/maps/districts/labeled/00_flats_overview_L.webp` | placed |
| `gang-metermen` … `gang-undertow` | L3 · eight gang headings (B91) | `docs/manuscript/print-art/gangs/*.webp` | placed (all eight) |
| `l4-voidmark` | L4 · VOIDMARK | `docs/manuscript/print-art/filler/voidmark.webp` | placed |
| `l5-hands-off` | L5 · The Hands Off Accords | `docs/manuscript/print-art/filler/hands-off.webp` | placed |

**Rules pack:** class / Veil / Machines / Peoples-on-RAW-Ch-6 plates stay **out**. Those slots are print-only. Veil and Machines **In Foundry** sidebars remain in the RAW chapters.

**Handbook maps:** Switchboard … Cinderhold plates remain in **Ghostwire — Ossian Reach Handbook → Maps & Plates**. L3 only embeds the Flats overview (the slot the lore chapter already owns).

## Rebuild (Foundry closed)

```bash
node tools/raw-to-journals.mjs
node tools/lore-to-journals.mjs
node tools/build-packs.mjs rulebook lore
node tools/journal-regen-smoke.mjs
```

If `FOUNDRY_APP` is unset, the tools load `showdown` / `classic-level` from `tools/node_modules` (`npm install --prefix tools showdown classic-level`).

## Michael verify

1. Enable **Draw Steel - Ghostwire Build** (module **0.3.24**) on a compatible Foundry world. Reload so `packFolders` picks up **Ghostwire Lore**.
2. Compendium folder **Ghostwire** still wraps every pack, including the new **Ghostwire Lore** next to **Ghostwire Rulebook**.
3. Open **Ghostwire Lore → Setting Primer / VOIDMARK / Ossian Reach**. Confirm plates (cosmology, timeline, VOIDMARK, Hands Off, L3 gang signs, Flats overview map). Peoples *opener* is present; eight species plates are **not** invented — they appear when Dropbox species files land in `print-art/species/`.
4. Open **Ghostwire Rulebook → How to Play / Tests / The Wire / Lifestyle & Downtime**. Confirm **In Foundry** callouts. Confirm **no art spam** (no class/Peoples/filler plates).
5. Open **Rulebook Index**. Play line is Ghostwire-only. Front Matter may still name Draw Steel / Creator License (B92 front-matter exception). Chapters after Front Matter do not say “need *Draw Steel Heroes*”.
6. Do **not** expect VOIDMARK chat applet work in this bump.

## Not this spike

- VOIDMARK AI applet (B82/B89)
- Invented Peoples / class plates
- Regenerating bestiary, pregens, gear, or other non-journal packs
- Pasting *Draw Steel Heroes* dependency language
