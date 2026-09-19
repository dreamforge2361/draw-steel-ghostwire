# Spike B88 — Ghostwire print PDF pipeline (first art-placement build)

**Status:** Built 2026-09-19 · **twelve Michael-approved plates in-tree 2026-09-19**  
**Bump:** module **0.3.21** (main is 0.3.20; first pipeline ship was 0.3.15)  
**Journals:** **not** regenerated (Michael: journals last before final PDF)

## Approved plates (0.3.21) — full remaining filler/cover set

Michael-approved art (do **not** regenerate). `ART-PLACEMENT.yml` already pointed here; files are in-tree:

| Slot | File |
|---|---|
| `cover` | `docs/manuscript/print-art/cover/cover.webp` (optional `cover.png`) |
| `l1-cosmology` | `docs/manuscript/print-art/filler/cosmology.webp` |
| `l1-planes` | `docs/manuscript/print-art/filler/planes.webp` |
| `l1-megacorps` | `docs/manuscript/print-art/filler/megacorps.webp` |
| `l1-wired` | `docs/manuscript/print-art/filler/wired.webp` |
| `l1-timeline` | `docs/manuscript/print-art/filler/timeline.webp` (**v3** — left titles + white summary blurbs) |
| `l1-themes` | `docs/manuscript/print-art/filler/city-nocturne.webp` |
| `l2-peoples-opener` | `docs/manuscript/print-art/filler/peoples-opener.webp` |
| `l4-voidmark` | `docs/manuscript/print-art/filler/voidmark.webp` |
| `l5-hands-off` | `docs/manuscript/print-art/filler/hands-off.webp` |
| `veil-opener` | `docs/manuscript/print-art/filler/veil-opener.webp` |
| `machines-opener` | `docs/manuscript/print-art/filler/machines-opener.webp` |

These twelve gaps are **filled pending rebuild**. Still ART GAP: `wire-opener`, Peoples plates (`species/`), class plates (`classes/`). Peoples binaries were never tracked; these twelve are gitignore exceptions.

Reusable stash (optional): `C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art\ghostwire-art-plates.zip`

### Windows rebuild (after pull)

```powershell
# If the twelve files are already in the clone (this PR), skip copy.
# Missing checkout — drop approved files at the exact paths:
$dst = "docs\manuscript\print-art"
Copy-Item .\cover.webp            "$dst\cover\cover.webp"
Copy-Item .\cover.png             "$dst\cover\cover.png"   # optional
foreach ($n in @(
  "voidmark","hands-off","cosmology","planes","megacorps","wired",
  "timeline","city-nocturne","veil-opener","machines-opener","peoples-opener"
)) { Copy-Item ".\$n.webp" "$dst\filler\$n.webp" }

node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/build-pdf.mjs
# docs\manuscript\build\Ghostwire-Rulebook-0.4.0.pdf
# docs\manuscript\build\ART-GAP-REPORT.md
```

Live report: `docs/manuscript/build/ART-GAP-REPORT.md` (regenerated every inject; committed). The twelve slots above must appear under **Placed**.

## Goal

A **repeatable PDF pipeline** from `docs/manuscript/` assemble output, with **artwork slots** filled from a local print-art tree (Michael’s SoR folders + Core Sourcebook extracts). Produce a draft PDF and an art gap report. Do not invent artwork. Credit: Ghostwire AI (B76). No external IP name-checks (B78/B83).

## How to run (Windows)

Most art binaries are **not** in git (Peoples / class plates stay local). The twelve approved cover/filler plates are tracked exceptions. Copy remaining SoR from Dropbox, then build.

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
#    docs\manuscript\build\Ghostwire-Rulebook-0.4.0.pdf
#    docs\manuscript\build\ART-GAP-REPORT.md
```

One-shot after copy: `powershell -File tools/build-pdf.ps1`

Linux / this VM: same Node commands. District maps place from `assets/maps/districts/`. The twelve approved cover/filler plates place from the tracked print-art files above.

## Architecture

| Step | Tool | Output |
|---|---|---|
| 1 | `node tools/assemble-manuscript.mjs` | `docs/manuscript/build/Ghostwire-Manuscript.md` (gitignored) |
| 2 | `node tools/inject-print-art.mjs` | `Ghostwire-Manuscript.with-art.md` + `ART-GAP-REPORT.md` |
| 3 | `node tools/linkify-manuscript.mjs` | `Ghostwire-Manuscript.with-links.md` (B97; gitignored) |
| 4 | `node tools/build-pdf.mjs` | `Ghostwire-Rulebook-0.4.0.html` + `.pdf` (gitignored; SAMPLE stays SAMPLE) |

`build-pdf.mjs` runs steps 1–4 unless `--skip-assemble` / `--skip-inject` / `--skip-linkify`. `--sample` prints a short front + L1 + Ch 27 slice. `--html-only` stops before Chrome. Hotlink details: `docs/spikes/B97-PDF-HOTLINKS.md`.

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

Michael’s Windows folder names (copy-script map): `GHOSTWIRE_Class_Art`, `GHOSTWIRE_Species_Art`, `GHOSTWIRE_Art_Bundle`, `GHOSTWIRE_Pregen_Art_Bundle`, `GHOSTWIRE_Gang_Art`, Core extracts → `from-core-pdf/`. Details: `docs/manuscript/print-art/README.md`.

## Placement map (starter)

`docs/manuscript/print-art/ART-PLACEMENT.yml` — **49 slots** (Peoples L2 + Ch 6 twins; eight B91 gang signs):

| Group | Count | Slots |
|---|---:|---|
| Cover | 1 | `cover` |
| L1 fillers | 6 | cosmology, planes, megacorps, wired, timeline, city-nocturne |
| L2 opener | 1 | peoples-opener |
| L3 map | 1 | Flats labeled overview (in-module) |
| L3 gang signs | 8 | Metermen → Undertow (B91, 0.3.23) |
| L4 / L5 | 2 | VOIDMARK, Hands Off Accords (main 0.3.13–0.3.14) |
| Peoples (L2 + Ch 6) | 16 | Pure Human → Cyborg (lore + rules twins) |
| Classes | 9 | Operator → Technomancer |
| Systems openers | 3 | Wire, Veil, Machines |
| Ch 27 maps | 2 | Flats overview + Cinderhold (in-module) |

## First-run gap list (cloud VM — no SoR binaries)

District maps **place** because they already ship in the module. Everything that lives only in Dropbox / Core PDF is a gap until Michael runs the copy script.

**Placed (in-module maps + Michael-approved 0.3.21 plates):**

- `cover` → `docs/manuscript/print-art/cover/cover.webp`
- `l1-cosmology` `l1-planes` `l1-megacorps` `l1-wired` `l1-timeline` `l1-themes` → `filler/{cosmology,planes,megacorps,wired,timeline,city-nocturne}.webp`
- `l2-peoples-opener` → `filler/peoples-opener.webp`
- `l4-voidmark` / `l5-hands-off` → `filler/voidmark.webp` / `filler/hands-off.webp`
- `veil-opener` / `machines-opener` → matching `filler/` slugs
- `l3-flats-overview` / `ch27-flats-overview` / `ch27-cinderhold` → in-module district maps
- L3 gang signs (B91, 0.3.23) → `print-art/gangs/{metermen,skinjobs,nightshift,ninth-ward-kings,rust-saints,glass-vipers,hollow-men,undertow}.webp`

**ART GAP (copy from SoR, then re-inject):**

- Openers: `wire-opener` (not in the approved drop)
- Peoples: `people-pure-human` `people-corran` `people-elvani` `people-goliar` `people-changer` `people-revenant` `people-mutant` `people-cyborg` (+ rules-chapter twins)
- Classes: `class-operator` `class-scout` `class-commander` `class-medic` `class-wrench` `class-elementalist` `class-street-priest` `class-hacker` `class-technomancer`

Live machine report: `docs/manuscript/build/ART-GAP-REPORT.md` (regenerated every inject).

### First-run draft PDF (this VM)

| | |
|---|---|
| Pages | **221** |
| Size | ~16 MB (gitignored) |
| Engine | Chrome headless HTML→PDF |
| Placed art | **15** — 3 in-module maps + 12 approved cover/filler plates (`wire-opener` does not steal `wired.webp`) |
| Visible gaps | **26** remaining (`wire-opener` + Peoples + classes; 41 slots) |

`--sample` writes an 8–16 page slice (title + L1 open + Ch 27 maps) to `Ghostwire-Rulebook-SAMPLE.pdf` (also gitignored). Chrome on this VM writes the PDF then hangs; `build-pdf.mjs` treats a valid `%%EOF` as success and times out the process.

Print CSS vendors Liberation Sans/Serif (SIL OFL) so Chrome embeds a real text font. Do not add `letter-spacing` on body copy — Chrome print-to-pdf has eaten spaces in the past.

## Git / size

- Generated **full draft PDF** is gitignored (can be tens of MB once art is in).
- Generated HTML + assembled Markdown + with-art Markdown are gitignored.
- Local `print-art/**` rasters are gitignored except the twelve Michael-approved cover/filler plates and the eight B91 gang signs. READMEs + `ART-PLACEMENT.yml` ship.
- Output path to keep: `docs/manuscript/build/Ghostwire-Rulebook-0.4.0.pdf` (local official cut). Optional `--sample` writes `Ghostwire-Rulebook-SAMPLE.pdf` (also gitignored).

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
- [x] `module.json` **0.3.15** (pipeline) · **0.3.21** (twelve approved cover/filler plates)
- [x] Journals not regenerated
- [x] Approved plates in `print-art/cover/` and `print-art/filler/` — rebuild to close those twelve gaps
