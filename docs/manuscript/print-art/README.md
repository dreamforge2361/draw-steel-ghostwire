# Ghostwire print-art tree

Local artwork for the **print PDF pipeline** (B88). Most binaries stay on the machine that builds the PDF — they are gitignored. This folder ships **stubs + a placement map**, plus twelve **Michael-approved** tracked plates (0.3.21):

- `cover/cover.webp` (optional `cover/cover.png`)
- `filler/voidmark.webp` · `hands-off.webp` · `cosmology.webp` · `planes.webp` · `megacorps.webp` · `wired.webp`
- `filler/timeline.webp` (v3) · `city-nocturne.webp` · `peoples-opener.webp` · `veil-opener.webp` · `machines-opener.webp`

Still missing from the approved drop: `filler/wire-opener.webp`. Peoples / class rasters stay local.

Reusable stash: `C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art\ghostwire-art-plates.zip`

**Credit:** all Ghostwire artwork is **Ghostwire AI (AI-generated)** unless a caption names another license (B76). **Do not** invent plates to fill a gap. **Do not** name-check external cyberpunk / 40K / WoD IP on captions (B78/B83).

Style lock: `docs/rulebook/ART-STYLE.md` (dark grounds, cyan/gold hairlines, rain nocturne).

Other PNG/JPG/WebP stay gitignored — re-seed those with `tools/copy-print-art.ps1` when building PDF.

---

## Windows: copy art → assemble → inject → PDF

From the repo root (PowerShell):

```powershell
# 1) Copy SoR folders from Dropbox (edit -ArtRoot if your path differs)
powershell -ExecutionPolicy Bypass -File tools/copy-print-art.ps1 `
  -ArtRoot "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art"

# Optional: extract Core Sourcebook images (needs: pip install pymupdf)
powershell -File tools/copy-print-art.ps1 `
  -ArtRoot "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\art" `
  -ExtractCore `
  -CorePdf "C:\Users\mfran\Dropbox\Public\RPG\Ghostwire\GHOSTWIRE — Core Sourcebook.pdf"

# 2–4) Assemble manuscript, inject slots, print PDF
node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/build-pdf.mjs

# 5) Open
#    docs\manuscript\build\Ghostwire-Rulebook-DRAFT.pdf
#    docs\manuscript\build\ART-GAP-REPORT.md
```

One-shot PDF after copy:

```powershell
powershell -File tools/build-pdf.ps1
```

Env overrides: `GHOSTWIRE_ART_ROOT`, `GHOSTWIRE_CORE_PDF`, `CHROME_PATH` / `EDGE_PATH`.

---

## Michael’s Windows folder names → this tree

| Local SoR folder | Lands in | Used for |
|---|---|---|
| `GHOSTWIRE_Class_Art` | `classes/` | Class chapter openers (Operator, Scout, Medic, …) |
| `GHOSTWIRE_Species_Art` | `species/` | Peoples / Ancestries plates (one per People) |
| `GHOSTWIRE_Art_Bundle` | `filler/` | L1 lore fillers, Wire/Veil/Machines openers, L4/L5 plates |
| `GHOSTWIRE_Pregen_Art_Bundle` | `pregens/` | Pregen 2048 portraits — not in the v1 placement map (held) |
| Core PDF extracts | `from-core-pdf/` | Fallbacks when a named class/filler file is missing |
| Cover plate (any `*cover*`) | `cover/` | Title / cover hole |

`tools/copy-print-art.mjs` copies files as-is, then writes **slug aliases** when it can guess (`operator.webp`, `corran.webp`, …) so `ART-PLACEMENT.yml` can find them. If a name is exotic, either rename to the expected slug or drop the file in the folder — inject also fuzzy-matches `match:` tokens.

### Expected slugs (first existing file wins; `.png` / `.jpg` also OK)

**`classes/`** — names match `GHOSTWIRE_Class_Art` when present:

`operator` · `scout` · `commander` · `medic` · `wrench` · `elementalist` · `street-priest` · `hacker` · `technomancer`

**`species/`:**

`pure-human` · `corran` · `elvani` · `goliar` · `changer` · `revenant` · `mutant` · `cyborg`

**`cover/`:** `cover`

**`filler/`** (optional, only if the file exists):

`cosmology` · `planes` · `megacorps` · `wired` · `timeline` · `city-nocturne` · `peoples-opener` · `voidmark` · `hands-off` · `wire-opener` · `veil-opener` · `machines-opener`

---

## District maps (already in the module)

Reach sections **do not** pull battle maps from this tree. They use native-resolution files in `assets/maps/districts/` (B72). **Do not downscale** those sources. The placement map points at the labeled Flats overview and Cinderhold plate.

Handbook book plates in `assets/reach-handbook/` stay Handbook / journal art — not duplicated here.

---

## Placement map

`ART-PLACEMENT.yml` is the SoR for *where* a plate goes in the assembled Markdown (chapter id + heading). Inject never writes pixels; it only inserts `<figure>` or an `<!-- ART GAP: … -->` placeholder.

Re-run inject after copying new files. Journals are **not** regenerated on this track (Michael: journals last before final PDF).
