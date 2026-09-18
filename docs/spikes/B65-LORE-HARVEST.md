# B65 — Lore harvest into print manuscript

**Date:** 2026-09-18 (America/New_York)  
**Goal:** Fill `docs/manuscript/01-lore/` with Ghostwire lore prose from master PDFs / extracts.  
**Module:** **0.2.1** (initial harvest) → **0.2.2** (PDF-diff / gap patch).

## Sources searched

| Location | Result |
|---|---|
| Windows Dropbox `C:\Users\mfran\Dropbox\ai-brain\projects\draw steel` (`machineId` a56fac98-…) | **Still unreachable** this pass — executor tool surface has no `ListMachines` / `Shell(machineId)` / `CopyToBox`. Permission is `always` in settings, but tools are not exposed to this agent. |
| Google Drive (xai) | Exact-name + broad “Ghostwire” PDF search — **no hits**. |
| Box `/workspace/ghostwire-materials/GHOSTWIRE-Lore-Source-V2-edit.md` | **Primary continuous prose** — Book One lore, rules stripped (~42k words). |
| `docs/masters/_lore_extract/GHOSTWIRE_Core_Sourcebook_hits.txt` | Keyword hit index from prior PDF extract (not continuous prose). |
| `docs/masters/_lore_extract/GHOSTWIRE-Lore-Book-V2-FINAL_hits.txt` | Keyword hit index for Lore Book V2 FINAL. |
| `docs/setting/reach-handbook/01–02` | Flats primer + vertical/black-water color (Ossian Reach Handbook extract already in repo). |
| `docs/setting/ashenreach.md` | Sister-hive canon lock. |
| `docs/rulebook/ART-STYLE.md` | Confirms PDF titles. |

## PDF-diff method (0.2.2)

1. Mapped Lore Source TOC (Ch. 1–25) against L1/L2/L3 H2/H3 headings.
2. Cross-checked Core + Lore Book V2 **hit indexes** for heading-like / unique lore phrases not present in manuscript.
3. Treated Lore Source as the Complete/Core Book One text stand-in (same prose family as hit indexes).
4. **Did not** paste Draw Steel Heroes / class-kit / combat rules; stripped rules anchors from harvested chapters.

### Coverage after 0.2.1 vs gaps found

| Lore topic (Book One) | 0.2.1 | 0.2.2 action |
|---|---|---|
| Cosmology, planes, Incursion | In L1 | — |
| **Magic & Its Sources (Ch. 4)** | **Missing** as section | **Added to L1** (~1.3k words) |
| **Corruption & Taint (Ch. 5)** | **Missing** as section | **Added to L1** (~0.9k words) — chrome-as-un-speaking, Mutants-as-heritable-taint |
| Hive / megacorps / Ten **seat list** | In L1 | — |
| **Ten conglomerate profiles (Ch. 8)** | Seat blurbs only | **Added to L1** (~9k words; Sanctum Assurance condensed from ~4.5k) |
| Wired | In L1 | — |
| **Space Colonies & New Space (Ch. 10)** | Mention only | **Added to L1** (~1.0k words) |
| Peoples (Ch. 12–19) | In L2 (at/above source depth) | No material gap |
| Reach gangs / fixtures | In L3 | No material gap (handbook districts still intentionally out) |
| **Religion & the Faithful (Ch. 21)** | Missing | **Added to L1** (~1.6k words) |
| **Shadow Economy (Ch. 22)** | Missing | **Added to L1** (~1.4k words) |
| **Technology & Everyday Life (Ch. 23)** | Missing | **Added to L1** (~1.5k words) |
| Timeline / present / themes | In L1 | — |

### What PDFs would still add (if Windows extract lands)

- Page-faithful wording deltas between Lore Source markdown (2026-07-29) and **Core Sourcebook.pdf** / **Lore-Book-V2-FINAL.pdf**.
- Any V2-only sidebars / peoples plates captions (art not in scope).
- Hit-index unique stubs already mirrored in Lore Source (Chrome as un-speaking, Mutants heritable, Revenants) — now in L1/L2.

## What went where (0.2.2)

| Manuscript file | Words (approx) | Δ vs 0.2.1 | Content |
|---|---:|---:|---|
| `L1-setting-primer.md` | ~29,600 | **+~17,300** | Prior primer + Magic, Corruption, Ten profiles, Space, Religion, Shadow Economy, Everyday Tech |
| `L2-peoples-and-world.md` | ~3,800 | 0 | Founding + eight peoples (already ≥ Part III source) |
| `L3-ossian-reach-color.md` | ~6,400 | 0 | Reach fixtures / Flats color / gangs / Ashenreach |
| `01-lore/README.md` | — | updated | Source list + 0.2.2 note |

## Policy applied

- Lore prose carried; **no images** in Markdown.
- Stripped design notes, rules anchors, TOC chrome, class-resource reconciliation tables where separable.
- Did **not** paste Draw Steel Heroes rules; did **not** touch `docs/raw/`.
- L3 remains optional street color — Reach Handbook districts (chs 04–17) not dumped.

## Remaining gaps

1. **Live PDF text extract** still blocked without Windows LocalShell / CopyToBox on this agent.
2. Sanctum Assurance profile **condensed** in L1 (full ~4.5k-word dossier in Lore Source Ch. 8).
3. Reach Handbook full district gazetteer intentionally not in L3.
4. Language chapter (Ch. 24) is a stub in source (~50 words) — nothing material to harvest.

## Verify

- `node tools/assemble-manuscript.mjs` (if present) as part of 0.2.2.
- Module bump → **0.2.2**.
