# Spike B88 — Ghostwire print PDF pipeline (first art-placement build)

**Status:** Built 2026-09-19 · **three Michael-approved plates in-tree 2026-09-19**  
**Bump:** module **0.3.19** (main was 0.3.18; first pipeline ship was 0.3.15)  
**Journals:** **not** regenerated (Michael: journals last before final PDF)

## Approved plates (0.3.19) — cover / VOIDMARK / Hands Off

Michael-approved art (do **not** regenerate). Slots already pointed here; files are now in-tree:

| Slot | File (first hit in `ART-PLACEMENT.yml`) |
|---|---|
| `cover` | `docs/manuscript/print-art/cover/cover.webp` (optional `cover.png`) |
| `l4-voidmark` | `docs/manuscript/print-art/filler/voidmark.webp` |
| `l5-hands-off` | `docs/manuscript/print-art/filler/hands-off.webp` |

These three gaps are **filled pending rebuild**. Remaining Dropbox SoR plates stay ART GAP. Peoples binaries were never tracked; these three are narrow gitignore exceptions so inject can resolve them without a local seed.

### Windows rebuild (after pull)

```powershell
# If the three files are already in the clone (this PR), skip copy.
# If a checkout is missing them, drop the approved files at the exact paths:
Copy-Item -Path ".\cover.webp"      -Destination "docs\manuscript\print-art\cover\cover.webp"
Copy-Item -Path ".\cover.png"       -Destination "docs\manuscript\print-art\cover\cover.png"   # optional
Copy-Item -Path ".\voidmark.webp"   -Destination "docs\manuscript\print-art\filler\voidmark.webp"
Copy-Item -Path ".\hands-off.webp"  -Destination "docs\manuscript\print-art\filler\hands-off.webp"

# Then assemble → inject → PDF (no Pandoc; Chrome/Edge)
node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/build-pdf.mjs
# Open docs\manuscript\build\Ghostwire-Rulebook-DRAFT.pdf
#      docs\manuscript\build\ART-GAP-REPORT.md
```

`ART-GAP-REPORT.md` is gitignored (regenerated every inject). After this drop, the report must list `cover`, `l4-voidmark`, and `l5-hands-off` under **Placed**.

## Goal

A **repeatable PDF pipeline** from `docs/manuscript/` assemble output, with **artwork slots** filled from a local print-art tree (Michael’s SoR folders + Core Sourcebook extracts). Produce a draft PDF and an art gap report. Do not invent artwork. Credit: Ghostwire AI (B76). No external IP name-checks (B78/B83).

## How to run (Windows)

Most art binaries are **not** in git (Peoples / class / L1 fillers stay local). Cover / VOIDMARK / Hands Off are tracked exceptions. Copy the rest from Dropbox, then build.

```powershell
# 1) Copy Dropbox SoR folders into docs/manuscript/print-art/
powershell -ExecutionPolicy Bypass -File tools/copy-print-art.ps1 `
  -ArtRoot "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art"

# Optional Core Sourcebook extract (pip install pymupdf)
powershell -File tools/copy-print-art.ps1 `
  -ArtRoot "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art" `
  -ExtractCore `
  -CorePdf "C:\path\to\GHOSTWIRE — Core Sourcebook.pdf"

# 2) Assemble Markdown SoR
node tools/assemble-manuscript.mjs

# 3) Inject figures / ART GAP placeholders from ART-PLACEMENT.yml
node tools/inject-print-art.mjs

# 4) HTML + Chrome/Edge print
node tools/build-pdf.mjs

# 5) Open
#    docs\manuscript\build\Ghostwire-Rulebook-DRAFT.pdf
#    docs\manuscript\build\ART-GAP-REPORT.md
```

One-shot after copy: `powershell -File tools/build-pdf.ps1`

Linux / this VM: same Node commands. District maps place from `assets/maps/districts/`. Cover / VOIDMARK / Hands Off now place from the tracked print-art files above.

## Architecture

| Step | Tool | Output |
|---|---|---|
| 1 | `node tools/assemble-manuscript.mjs` | `docs/manuscript/build/Ghostwire-Manuscript.md` (gitignored) |
| 2 | `node tools/inject-print-art.mjs` | `Ghostwire-Manuscript.with-art.md` + `ART-GAP-REPORT.md` |
| 3 | `node tools/build-pdf.mjs` | `Ghostwire-Rulebook-DRAFT.html` + `.pdf` (gitignored) |

`build-pdf.mjs` runs steps 1–3 unless `--skip-assemble` / `--skip-inject`. `--sample` prints a short front + L1 + Ch 27 slice. `--html-only` stops before Chrome.

### Why Chrome, not Pandoc

This cloud VM has **no Pandoc package** and no WeasyPrint/typst. Headless **Chrome** is present and matches a typical Windows box (Chrome or Edge). Print CSS is `docs/manuscript/print/ghostwire-print.css` — ART-STYLE lock: near-black grounds, cyan/gold hairlines, white condensed titles. If `pandoc` appears later it can still emit HTML; PDF stays on the Chrome path so the CSS does not fork.

Windows: set `CHROME_PATH` or `EDGE_PATH` if the browser is not on PATH.

## Art placement policy

| Kind | Source | Notes |
|---|---|---|
| Peoples | `docs/manuscript/print-art/species/` | One plate per People after Ch 6 headings |
| Classes | `print-art/classes/` | After `# The Operator` / Scout / Medic / … (`GHOSTWIRE_Class_Art` names) |
| Filler | `print-art/filler/` + `from-core-pdf/` | L1 primers, Wire/Veil/Machines openers |
| Cover | `print-art/cover/` | Replaces the reserved title-page hole |
| District maps | **`assets/maps/districts/`** (in-module) | Native resolution; **do not downscale** source files. Display-fit only in CSS. |

Missing file → `<!-- ART GAP: id — expected path -->` plus a visible placeholder figure. Inject never paints a fake plate.

Michael’s Windows folder names (copy-script map): `GHOSTWIRE_Class_Art`, `GHOSTWIRE_Species_Art`, `GHOSTWIRE_Art_Bundle`, `GHOSTWIRE_Pregen_Art_Bundle`, Core extracts → `from-core-pdf/`. Details: `docs/manuscript/print-art/README.md`.

## Placement map (starter)

`docs/manuscript/print-art/ART-PLACEMENT.yml` — **33 slots**:

| Group | Count | Slots |
|---|---:|---|
| Cover | 1 | `cover` |
| L1 fillers | 6 | cosmology, planes, megacorps, wired, timeline, city-nocturne |
| L2 opener | 1 | peoples-opener |
| L3 map | 1 | Flats labeled overview (in-module) |
| L4 / L5 | 2 | VOIDMARK, Hands Off Accords (main 0.3.13–0.3.14) |
| Peoples (Ch 6) | 8 | Pure Human → Cyborg |
| Classes | 9 | Operator → Technomancer |
| Systems openers | 3 | Wire, Veil, Machines |
| Ch 27 maps | 2 | Flats overview + Cinderhold (in-module) |

## First-run gap list (cloud VM — no SoR binaries)

District maps **place** because they already ship in the module. Everything that lives only in Dropbox / Core PDF is a gap until Michael runs the copy script.

**Placed (in-module maps + Michael-approved 0.3.19 plates):**

- `cover` → `docs/manuscript/print-art/cover/cover.webp`
- `l4-voidmark` → `docs/manuscript/print-art/filler/voidmark.webp`
- `l5-hands-off` → `docs/manuscript/print-art/filler/hands-off.webp`
- `l3-flats-overview` → `assets/maps/districts/labeled/00_flats_overview_L.webp`
- `ch27-flats-overview` → same overview
- `ch27-cinderhold` → `assets/maps/districts/labeled/11_cinderhold_L.webp`

**ART GAP (copy from SoR, then re-inject):**

- L1: `l1-cosmology` `l1-planes` `l1-megacorps` `l1-wired` `l1-timeline` `l1-themes`
- L2: `l2-peoples-opener`
- Peoples: `people-pure-human` `people-corran` `people-elvani` `people-goliar` `people-changer` `people-revenant` `people-mutant` `people-cyborg`
- Classes: `class-operator` `class-scout` `class-commander` `class-medic` `class-wrench` `class-elementalist` `class-street-priest` `class-hacker` `class-technomancer`
- Openers: `wire-opener` `veil-opener` `machines-opener`

Live machine report: `docs/manuscript/build/ART-GAP-REPORT.md` (regenerated every inject).

### First-run draft PDF (this VM)

| | |
|---|---|
| Pages | **221** |
| Size | ~16 MB (gitignored) |
| Engine | Chrome headless HTML→PDF |
| Placed art | 3 in-module district maps + cover / VOIDMARK / Hands Off (0.3.19) |
| Visible gaps | remaining SoR class / People / L1 filler plates |

`--sample` writes an 8–16 page slice (title + L1 open + Ch 27 maps) to `Ghostwire-Rulebook-SAMPLE.pdf` (also gitignored). Chrome on this VM writes the PDF then hangs; `build-pdf.mjs` treats a valid `%%EOF` as success and times out the process.

Print CSS vendors Liberation Sans/Serif (SIL OFL) so Chrome embeds a real text font. Do not add `letter-spacing` on body copy — Chrome print-to-pdf has eaten spaces in the past.

## Git / size

- Generated **full draft PDF** is gitignored (can be tens of MB once art is in).
- Generated HTML + assembled Markdown + with-art Markdown are gitignored.
- Local `print-art/**` rasters are gitignored except the three Michael-approved plates (`cover.webp` / optional `cover.png`, `voidmark.webp`, `hands-off.webp`). READMEs + `ART-PLACEMENT.yml` ship.
- Output path to keep: `docs/manuscript/build/Ghostwire-Rulebook-DRAFT.pdf` (local). Optional `--sample` writes `Ghostwire-Rulebook-SAMPLE.pdf` (also gitignored).

## Not this spike

- Journal regen (held).
- Invented class/species plates.
- Downscaled battle-map copies.
- Light “toner-saver” theme (ART-STYLE is dark grounds; this draft is a screen proof).
- Pregen bundle placement (copy destination only).

## Checklist

- [x] `inject-print-art.mjs` + `ART-PLACEMENT.yml` + empty print-art tree
- [x] `copy-print-art` (Node + Windows ps1) + optional Core PDF extract
- [x] `build-pdf.mjs` + ART-STYLE print CSS
- [x] Gap report path + this spike
- [x] `module.json` **0.3.15** (pipeline) · **0.3.19** (approved cover / VOIDMARK / Hands Off)
- [x] Journals not regenerated
- [x] Approved plates in `print-art/cover/` and `print-art/filler/` — rebuild to close those three gaps
