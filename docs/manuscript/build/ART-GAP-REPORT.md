# Ghostwire print-art gap report

**Generated:** 2026-09-22T23:40:27.629Z
**Tool:** `tools/inject-print-art.mjs`
**Placement map:** `docs/manuscript/print-art/ART-PLACEMENT.yml`
**Credit:** Ghostwire AI (AI-generated) (B76). No external IP name-checks (B78/B83).
**Journals:** not regenerated.

| | Count |
|---|---:|
| Slots in map | 55 |
| Placed | 54 |
| ART GAP (file missing) | 1 |
| Chapter anchor missing | 0 |

## Placed

| Slot | Kind | File |
|---|---|---|
| `cover` | cover | `docs/manuscript/print-art/cover/cover.webp` |
| `l1-cosmology` | filler | `docs/manuscript/print-art/filler/cosmology.webp` |
| `l1-planes` | filler | `docs/manuscript/print-art/filler/planes.webp` |
| `l1-megacorps` | filler | `docs/manuscript/print-art/filler/megacorps.webp` |
| `l1-wired` | filler | `docs/manuscript/print-art/filler/wired.webp` |
| `l1-timeline` | filler | `docs/manuscript/print-art/filler/timeline.webp` |
| `l1-themes` | filler | `docs/manuscript/print-art/filler/city-nocturne.webp` |
| `l2-peoples-opener` | filler | `docs/manuscript/print-art/filler/peoples-opener.webp` |
| `l3-flats-overview` | map | `assets/maps/districts/labeled/00_flats_overview_L.webp` |
| `gang-metermen` | gang | `docs/manuscript/print-art/gangs/metermen.webp` |
| `gang-skinjobs` | gang | `docs/manuscript/print-art/gangs/skinjobs.webp` |
| `gang-nightshift` | gang | `docs/manuscript/print-art/gangs/nightshift.webp` |
| `gang-ninth-ward-kings` | gang | `docs/manuscript/print-art/gangs/ninth-ward-kings.webp` |
| `gang-rust-saints` | gang | `docs/manuscript/print-art/gangs/rust-saints.webp` |
| `gang-glass-vipers` | gang | `docs/manuscript/print-art/gangs/glass-vipers.webp` |
| `gang-hollow-men` | gang | `docs/manuscript/print-art/gangs/hollow-men.webp` |
| `gang-undertow` | gang | `docs/manuscript/print-art/gangs/undertow.webp` |
| `l4-voidmark` | filler | `docs/manuscript/print-art/filler/voidmark.webp` |
| `l5-hands-off` | filler | `docs/manuscript/print-art/filler/hands-off.webp` |
| `l6-measure-collegium-symbol` | faction | `assets/factions/magical-societies/measure-collegium-symbol-512.webp` |
| `l6-datum-house` | faction | `assets/factions/magical-societies/measure-collegium-datum-house.webp` |
| `l7-wickkeepers-symbol` | faction | `assets/factions/magical-societies/wickkeepers-symbol-512.webp` |
| `l7-last-kettle` | faction | `assets/factions/magical-societies/wickkeepers-last-kettle.webp` |
| `l8-ash-survey-symbol` | faction | `assets/factions/magical-societies/ash-survey-symbol-512.webp` |
| `l8-cinder-yard` | faction | `assets/factions/magical-societies/ash-survey-cinder-yard.webp` |
| `people-pure-human` | species | `docs/manuscript/print-art/species/pure-human.png` |
| `people-corran` | species | `docs/manuscript/print-art/species/corran.png` |
| `people-elvani` | species | `docs/manuscript/print-art/species/elvani.png` |
| `people-goliar` | species | `docs/manuscript/print-art/species/goliar.png` |
| `people-changer` | species | `docs/manuscript/print-art/species/changer.png` |
| `people-revenant` | species | `docs/manuscript/print-art/species/revenant.png` |
| `people-mutant` | species | `docs/manuscript/print-art/species/mutant.png` |
| `people-cyborg` | species | `docs/manuscript/print-art/species/cyborg.png` |
| `people-pure-human-rules` | species | `docs/manuscript/print-art/species/pure-human.png` |
| `people-corran-rules` | species | `docs/manuscript/print-art/species/corran.png` |
| `people-elvani-rules` | species | `docs/manuscript/print-art/species/elvani.png` |
| `people-goliar-rules` | species | `docs/manuscript/print-art/species/goliar.png` |
| `people-changer-rules` | species | `docs/manuscript/print-art/species/changer.png` |
| `people-revenant-rules` | species | `docs/manuscript/print-art/species/revenant.png` |
| `people-mutant-rules` | species | `docs/manuscript/print-art/species/mutant.png` |
| `people-cyborg-rules` | species | `docs/manuscript/print-art/species/cyborg.png` |
| `class-operator` | class | `docs/manuscript/print-art/classes/operator.png` |
| `class-scout` | class | `docs/manuscript/print-art/classes/scout.png` |
| `class-commander` | class | `docs/manuscript/print-art/classes/commander.png` |
| `class-medic` | class | `docs/manuscript/print-art/classes/medic.png` |
| `class-wrench` | class | `docs/manuscript/print-art/classes/wrench.png` |
| `class-elementalist` | class | `docs/manuscript/print-art/classes/elementalist.png` |
| `class-street-priest` | class | `docs/manuscript/print-art/classes/street-priest.png` |
| `class-hacker` | class | `docs/manuscript/print-art/classes/hacker.png` |
| `class-technomancer` | class | `docs/manuscript/print-art/classes/technomancer.png` |
| `veil-opener` | filler | `docs/manuscript/print-art/filler/veil-opener.webp` |
| `machines-opener` | filler | `docs/manuscript/print-art/filler/machines-opener.webp` |
| `ch27-flats-overview` | map | `assets/maps/districts/labeled/00_flats_overview_L.webp` |
| `ch27-cinderhold` | map | `assets/maps/districts/labeled/11_cinderhold_L.webp` |

## Gaps

| Slot | Kind | Chapter | Expected / search |
|---|---|---|---|
| `wire-opener` | filler | `ch23` | `docs/manuscript/print-art/filler/wire-opener.webp` |

Fill gaps by copying Michael’s Dropbox art tree (see `docs/manuscript/print-art/README.md`), then re-run inject + build.

## Policy

- Do **not** invent artwork to close a gap.
- District / battle maps use in-module `assets/maps/districts/` at **native resolution** (no downscale of source files).
- Class plates prefer `print-art/classes/` names matching `GHOSTWIRE_Class_Art`.
- Species plates prefer `print-art/species/` names matching `GHOSTWIRE_Species_Art`.
- Gang signs prefer `print-art/gangs/` slugs (B91: metermen → undertow).
- Core Sourcebook extracts land in `print-art/from-core-pdf/` as fallbacks only.
