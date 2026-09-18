# B65 — Lore harvest into print manuscript

**Date:** 2026-09-18 (America/New_York)  
**Goal:** Fill `docs/manuscript/01-lore/` stubs with Ghostwire lore prose from master PDFs / extracts.

## Sources searched

| Location | Result |
|---|---|
| Windows Dropbox `C:\Users\mfran\Dropbox\ai-brain\projects\draw steel` | **No LocalShell / Windows machine MCP available** this pass (`machineId` a56fac98-… unused). |
| Google Drive (xai) | Exact-name search for `GHOSTWIRE-Lore-Book-V2-FINAL.pdf` / Core Sourcebook — **no hits**. |
| Box `/workspace/ghostwire-materials/GHOSTWIRE-Lore-Source-V2-edit.md` | **Primary source** — full Book One lore, rules stripped (extracted from *GHOSTWIRE — The Complete Sourcebook*, 2026-07-29). ~42k words. |
| `docs/masters/_lore_extract/GHOSTWIRE_Core_Sourcebook_hits.txt` | Keyword hit index (not continuous prose). |
| `docs/masters/_lore_extract/GHOSTWIRE-Lore-Book-V2-FINAL_hits.txt` | Keyword hit index for Lore Book V2 FINAL. |
| `docs/setting/reach-handbook/01–02` | Flats primer + vertical/black-water color (from *Ossian Reach Handbook* PDF extract already in repo). |
| `docs/setting/ashenreach.md` | Sister-hive canon lock (not a Core PDF dump). |
| `docs/rulebook/ART-STYLE.md` | Confirms PDF titles: `GHOSTWIRE — Core Sourcebook.pdf`, `GHOSTWIRE-Lore-Book-V2-FINAL.pdf`. |

## What went where

| Manuscript file | Approx words | Harvest content |
|---|---:|---|
| `L1-setting-primer.md` | ~12,300 | Cosmology; planes; demons/Incursion; hive structure (Veyra); megacorps; the Ten seats; Wired; timeline; campaign present (2050); themes |
| `L2-peoples-and-world.md` | ~3,800 | Founding (engineered castes) + eight peoples fiction |
| `L3-ossian-reach-color.md` | ~6,400 | Reach fixtures (Cassavir / Deadfall Nine / Cinderhold+Marrow); Flats & black-water color; street gangs/level-bosses; Ashenreach |
| `01-lore/README.md` | — | Source PDF names + harvest date |

## Policy applied

- Lore prose carried; **no images** in Markdown.
- Stripped design notes, rules anchors (`Rules anchor`, `→ RULES`, `→ CROSSLINK`), TOC chrome, “Table use” GM scaffolding where cleanly separable.
- Did **not** paste Draw Steel Heroes rules; did **not** touch `docs/raw/`.
- L3 is **optional street color** — not a reprint of Reach Handbook district journals (chs 04–17 left in `docs/setting/reach-handbook/`).

## Gaps (Michael must supply if fuller PDF fidelity needed)

1. **`GHOSTWIRE — Core Sourcebook.pdf`** — not on box / Drive / LocalShell this pass. Harvest used the rules-stripped Lore Source markdown (Complete Sourcebook Book One). Any V2 Core-only lore deltas are unverified against the PDF.
2. **`GHOSTWIRE-Lore-Book-V2-FINAL.pdf`** — same; only keyword hits + ART-STYLE citation. Peoples plates / Wired overlay art not harvested (text-only pass).
3. Dropbox path may still hold the originals — re-run with Windows LocalShell when available to diff PDF text vs this harvest.
4. Magic & Corruption chapters (Part I Ch. 4–5) and full Ten conglomerate *profiles* (post-seat list) were left out of L1 to keep the primer focused; can be a follow-up harvest slot if wanted.
5. Reach Handbook districts (Switchboard, Neon Shambles, …) intentionally not dumped into L3.

## Verify

- `node tools/assemble-manuscript.mjs` — run as part of B65.
- Module bump → **0.2.1**.
