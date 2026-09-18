# Spike B64 — Manuscript Markdown SoR (print track)

**Status:** Scaffold done 2026-09-18  
**Bump:** module **0.2.0** (manuscript track start — docs milestone)  
**Deliverables:** `docs/manuscript/*`, `tools/assemble-manuscript.mjs`

## Goal

Stand up a **single Markdown manuscript SoR** for the final PDF: lore from original GW master PDFs + rules from `docs/raw/`, without forking raw into a second edit surface. Prefer Markdown + assemble script (Pandoc later); not Word-as-master.

## Done

- `docs/manuscript/README.md` — purpose; vs raw / Journals / PDF; assemble how-to; lore import policy
- `docs/manuscript/TOC.md` — print TOC matching LOCKED recommended package (`docs/rulebook/TOC-PROPOSAL.md`, 5 parts) + lore harvest stubs
- Folder layout: `00-front/`, `01-lore/` (PDF harvest stubs), `02-rules/` (pointer policy + Lifestyle NEW stub), `03-directors/` (Reach pointer NEW stub), `build/`
- `MANIFEST.yml` + `assemble-order.txt` — ordered concatenate list; raw via `../../raw/*.md` pointers
- `tools/assemble-manuscript.mjs` — reads manifest → `docs/manuscript/build/Ghostwire-Manuscript.md`; missing stubs → visible placeholder comments
- module.json → **0.2.0** (UTF-8 no BOM)

## Explicit non-goals (this spike)

- Paste lore from PDFs (scaffold stubs only)
- Copy entire `docs/raw/` tree into manuscript
- Regenerate Journals
- Draft Lifestyle chapter body
- Pandoc / PDF CSS / art plates

## Policy locks carried forward

| Concern | Owner |
|---|---|
| Rules text | `docs/raw/` only (Journals regen later from raw) |
| Lore / artwork | Harvest as-is into `01-lore/` from master PDFs |
| Print order | LOCKED TOC; Advancement early; Lifestyle + Reach pointer = NEW stubs |
| Journals | **Held** until end of rules pass before art+PDF |

## Next

1. Continue rules draft order (Wire polish → Lifestyle when Michael schedules).
2. Harvest Core Sourcebook / Lore Book into `01-lore/` stubs (carry as-is).
3. Pandoc pipeline after spine + Wire + Lifestyle exist.
4. Regen Journals only after HTP / rules pass review — not on 0.2.0.
