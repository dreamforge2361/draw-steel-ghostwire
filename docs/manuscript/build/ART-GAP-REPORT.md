# Ghostwire print-art gap report

**Generated:** 2026-09-19T03:23:49.293Z
**Tool:** `tools/inject-print-art.mjs`
**Placement map:** `docs/manuscript/print-art/ART-PLACEMENT.yml`
**Credit:** Ghostwire AI (AI-generated) (B76). No external IP name-checks (B78/B83).
**Journals:** not regenerated.

| | Count |
|---|---:|
| Slots in map | 49 |
| Placed | 23 |
| ART GAP (file missing) | 26 |
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
| `veil-opener` | filler | `docs/manuscript/print-art/filler/veil-opener.webp` |
| `machines-opener` | filler | `docs/manuscript/print-art/filler/machines-opener.webp` |
| `ch27-flats-overview` | map | `assets/maps/districts/labeled/00_flats_overview_L.webp` |
| `ch27-cinderhold` | map | `assets/maps/districts/labeled/11_cinderhold_L.webp` |

## Gaps

| Slot | Kind | Chapter | Expected / search |
|---|---|---|---|
| `people-pure-human` | species | `L2` | `docs/manuscript/print-art/species/pure-human.png` |
| `people-corran` | species | `L2` | `docs/manuscript/print-art/species/corran.png` |
| `people-elvani` | species | `L2` | `docs/manuscript/print-art/species/elvani.png` |
| `people-goliar` | species | `L2` | `docs/manuscript/print-art/species/goliar.png` |
| `people-changer` | species | `L2` | `docs/manuscript/print-art/species/changer.png` |
| `people-revenant` | species | `L2` | `docs/manuscript/print-art/species/revenant.png` |
| `people-mutant` | species | `L2` | `docs/manuscript/print-art/species/mutant.png` |
| `people-cyborg` | species | `L2` | `docs/manuscript/print-art/species/cyborg.png` |
| `people-pure-human-rules` | species | `ch6` | `docs/manuscript/print-art/species/pure-human.png` |
| `people-corran-rules` | species | `ch6` | `docs/manuscript/print-art/species/corran.png` |
| `people-elvani-rules` | species | `ch6` | `docs/manuscript/print-art/species/elvani.png` |
| `people-goliar-rules` | species | `ch6` | `docs/manuscript/print-art/species/goliar.png` |
| `people-changer-rules` | species | `ch6` | `docs/manuscript/print-art/species/changer.png` |
| `people-revenant-rules` | species | `ch6` | `docs/manuscript/print-art/species/revenant.png` |
| `people-mutant-rules` | species | `ch6` | `docs/manuscript/print-art/species/mutant.png` |
| `people-cyborg-rules` | species | `ch6` | `docs/manuscript/print-art/species/cyborg.png` |
| `class-operator` | class | `ch14` | `docs/manuscript/print-art/classes/operator.webp` |
| `class-scout` | class | `ch15` | `docs/manuscript/print-art/classes/scout.webp` |
| `class-commander` | class | `ch16` | `docs/manuscript/print-art/classes/commander.webp` |
| `class-medic` | class | `ch17` | `docs/manuscript/print-art/classes/medic.webp` |
| `class-wrench` | class | `ch18` | `docs/manuscript/print-art/classes/wrench.webp` |
| `class-elementalist` | class | `ch19` | `docs/manuscript/print-art/classes/elementalist.webp` |
| `class-street-priest` | class | `ch20` | `docs/manuscript/print-art/classes/street-priest.webp` |
| `class-hacker` | class | `ch21` | `docs/manuscript/print-art/classes/hacker.webp` |
| `class-technomancer` | class | `ch22` | `docs/manuscript/print-art/classes/technomancer.webp` |
| `wire-opener` | filler | `ch23` | `docs/manuscript/print-art/filler/wire-opener.webp` |

Fill gaps by copying Michael’s Dropbox art tree (see `docs/manuscript/print-art/README.md`), then re-run inject + build.

## Policy

- Do **not** invent artwork to close a gap.
- District / battle maps use in-module `assets/maps/districts/` at **native resolution** (no downscale of source files).
- Class plates prefer `print-art/classes/` names matching `GHOSTWIRE_Class_Art`.
- Species plates prefer `print-art/species/` names matching `GHOSTWIRE_Species_Art`.
- Gang signs prefer `print-art/gangs/` slugs (B91: metermen → undertow).
- Core Sourcebook extracts land in `print-art/from-core-pdf/` as fallbacks only.
