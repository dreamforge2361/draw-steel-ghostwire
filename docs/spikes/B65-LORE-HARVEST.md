# B65 — Lore harvest into print manuscript

**Date:** 2026-09-18 (America/New_York)  
**Goal:** Fill `docs/manuscript/01-lore/` with Ghostwire lore prose from master PDFs / extracts.  
**Module:** **0.2.1** (initial harvest) → **0.2.2** (Lore Source gap patch) → **0.2.3** (live PDF-diff).

## Sources searched

| Location | Result |
|---|---|
| Windows Dropbox `C:\Users\mfran\Dropbox\ai-brain\projects\draw steel` | Unreachable to early passes (no LocalShell). **Live PDF text later landed on box** as `/workspace/gw-pdf-extract/`. |
| Google Drive (xai) | Exact-name + broad “Ghostwire” PDF search — no hits (0.2.1–0.2.2). |
| Box `/workspace/ghostwire-materials/GHOSTWIRE-Lore-Source-V2-edit.md` | Primary continuous prose for 0.2.1–0.2.2 (~42k words). |
| Box `/workspace/gw-pdf-extract/core-full.txt` | **Live** GHOSTWIRE Core Sourcebook extract — **429 pages** (0.2.3). |
| Box `/workspace/gw-pdf-extract/lore-full.txt` | **Live** Lore Book V2 FINAL extract — **132 pages** (0.2.3). |
| `docs/masters/_lore_extract/*_hits.txt` | Keyword hit indexes (0.2.1–0.2.2 stand-in). |
| `docs/setting/reach-handbook/01–02`, `docs/setting/ashenreach.md` | Reach / sister-hive color for L3. |

## Live PDF-diff (0.2.3)

### Method

1. Skimmed Core + Lore Book V2 extracts for Book One section titles (Parts I–V); **skipped** pure rules (classes, combat, kits, chargen math, advancement, class-resource reconciliation tables, CROSSLINK/RULES lines).
2. Mapped TOC against L1/L2/L3 H2/H3 after 0.2.2.
3. Patched **setting/fiction gaps only** into L1 from Core Sourcebook PDF pp. **56–61** (Lore Book V2 same chapters). Original PDF prose retained; rules/crosslink residue stripped.

### Pages used (live extracts)

| Source | Pages / chapters | Use |
|---|---|---|
| Core Sourcebook PDF | Book One ~pp. 8–123 (world); gap fill **pp. 56–61** | Canonical continuous prose for Ch. 8 tail |
| Lore Book V2 FINAL PDF | Book One Parts I–V (~pp. 7–123); class plates pp. 124–132 skipped | Cross-check; same lore family as Core Book One |
| Both | Peoples Part III pp. 68–84 | Depth check vs L2 — **no material gap** |
| Both | Reach fixtures / gangs Part II+IV | Depth check vs L3 — **no material gap** |

### Gaps found → filled (fiction only)

| Gap | Dest | Notes |
|---|---|---|
| What Lies Beneath the Ten | L1 (after Sanctum) | Sub-corps, seatless powers, remnant government |
| Who Holds the Chair (Sunlit Chair slipping / Vera Solenne) | L1 | Crown political engine — only seat blurbs existed before |
| Kestrel Dynamics + Adrienne Kestrel “the Falcon” | L1 | Rising eleventh; was mention-only |
| Resource Wars | L1 | Entirely missing in 0.2.2 |
| Reach for the Void (Congress political note) | L1 | Short bridge to Space Colonies ch. |
| Radiant Concord + Luminary Aurent Solwhit + Radiant See + Choir | L1 | **Critical:** Religion Ch. cross-referenced “Ch. 8 already built” but Concord profile was never harvested |

### Still missing / intentionally out

| Item | Status |
|---|---|
| Sanctum Assurance full ~4.5k dossier | Still **condensed** in L1 (~1.1k); live PDF ~1.3k before “beneath” — not a material delta vs condensation note |
| Language & Communication (Ch. 24) | Source stub (~1 line) — nothing to harvest |
| Class identity plates (Lore Book pp. 124–132) | Rules/class adjacent — **not** dumped into lore manuscript |
| Reach Handbook district gazetteer | Intentionally out of L3 |
| Core Book Two / rules chapters | Out of scope |
| Extracts on box | Stay in `/workspace/gw-pdf-extract` — **not committed**; `_pdf-extract/` added to module `.gitignore` for Windows landings |

### Coverage matrix (Book One)

| Lore topic | 0.2.2 | 0.2.3 |
|---|---|---|
| Cosmology, planes, Incursion | L1 | — |
| Magic / Corruption | L1 | — |
| Hive / megacorps / Ten seats + profiles | L1 | — |
| **Ch. 8 tail (beneath / Chair / Kestrel / Resource Wars / Concord)** | **Missing** | **Added to L1** (~3.3k words) |
| Wired / Space | L1 | — |
| Peoples | L2 (≈ PDF depth) | Confirmed no gap |
| Reach gangs / fixtures | L3 | Confirmed no gap |
| Religion / Shadow Economy / Everyday Tech | L1 | Concord profile now backs Religion crosslinks |
| Timeline / present / themes | L1 | — |

## What went where (word deltas)

| File | 0.2.2 (HEAD) | 0.2.3 | Δ |
|---|---:|---:|---:|
| `L1-setting-primer.md` | ~29,644 | ~33,027 | **+~3,383** |
| `L2-peoples-and-world.md` | ~3,781 | ~3,781 | 0 |
| `L3-ossian-reach-color.md` | ~6,364 | ~6,364 | 0 |

## Policy applied

- Lore prose carried; **no images** in Markdown.
- Stripped design notes, rules anchors, TOC chrome, CROSSLINK/RULES lines.
- Did **not** paste Draw Steel / class-kit / combat rules; did **not** touch `docs/raw/`.
- L3 remains optional street color.

## Verify

- `node tools/assemble-manuscript.mjs`
- Module bump → **0.2.3**
