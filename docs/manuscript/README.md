# Ghostwire Print Manuscript (Markdown SoR)

**Status:** Print PDF pipeline (B88, 2026-09-19) — module **0.3.21**; Michael-approved cover + L1/L2/L4/L5/Veil/Machines plates in-tree; journals still held  
**Path:** `docs/manuscript/`  
**Spikes:** `docs/spikes/B64-MANUSCRIPT-SOR.md` · B73–B75 · **B88** PDF pipeline  
**Print TOC lock:** `docs/rulebook/TOC-PROPOSAL.md` (LOCKED 2026-09-18, recommended 5-part package)

This folder is the **single Markdown source of record** for the eventual print PDF: lore harvested from the original Ghostwire master PDFs, plus rules pointed at `docs/raw/` (no dual-edit copies).

---

## Purpose

| Role | What lives here |
|---|---|
| **Print SoR** | Ordered Markdown that Pandoc (later) turns into the core book PDF |
| **Lore stubs** | Placeholders under `01-lore/` until artwork/lore is carried as-is from master PDFs |
| **Rules pointers** | Manifest entries → `docs/raw/*.md` (Stage 3 filled chapters stay in raw; manuscript does not fork them) |
| **NEW print-only** | Title / credits / how-to-use → `00-front/` (B74); Lifestyle → `../raw/26-lifestyle-downtime.md` (B67); Running Ossian Reach → `03-directors/27-running-ossian-reach.md` (B73) |

**Not** a second rules edit surface. **Not** the Foundry Journal pipeline.

---

## vs `docs/raw/`

| | `docs/raw/` | `docs/manuscript/` |
|---|---|---|
| Concern | **Rules-only** player/Director procedures | Full **print book** (lore + rules assemble) |
| Journals | SoR — `tools/raw-to-journals.mjs` regenerates from raw | Journals **held** until end of rules pass |
| Edit policy | Edit rules here; mark `RAW status` | Lore stubs + NEW stubs + **pointers** to raw |
| Dual-edit | N/A | **Forbidden** — do not copy entire raw tree into manuscript |

Keep `docs/raw/` rules-only so Journal regen stays clean. Manuscript concatenates raw by path at assemble time.

---

## vs Journals

- Journals = Foundry pack from `docs/raw/` (B42b).
- **Do not regenerate journals** for this scaffold / 0.2.0 bump.
- Hold Journals until the rules pass finishes; then art + PDF.
- Manuscript is for PDF assembly, not for Foundry sync.

---

## vs PDF

| Stage | Owner |
|---|---|
| 1. Finish RAW spine + Wire + Lifestyle (rules) | Wire **RAW-locked** B66; Lifestyle **draft** B67 (`26-lifestyle-downtime.md`); spine polish remains |
| 2. Harvest lore/art from master PDFs into `01-lore/` | manuscript lore stubs |
| 3. `node tools/assemble-manuscript.mjs` → `docs/manuscript/build/Ghostwire-Manuscript.md` | assemble script |
| 4. Inject plates + Chrome HTML→PDF | **B88** — `tools/inject-print-art.mjs` + `tools/build-pdf.mjs` |

Word-as-master is **rejected**. Markdown assemble → art inject → print CSS. Spike: `docs/spikes/B88-PDF-PIPELINE.md`.

---

## How to assemble

```bash
# from repo root
node tools/assemble-manuscript.mjs
```

Reads `docs/manuscript/MANIFEST.yml` (ordered file list), concatenates into:

`docs/manuscript/build/Ghostwire-Manuscript.md`

- **Rules entries** resolve to `docs/raw/*.md` (or other `path:` targets).
- **Missing lore stubs** are skipped with a visible HTML/MD comment placeholder in the build output.
- Part separators are inserted from manifest `part:` markers.

See `TOC.md` for print titles ↔ sources. See `02-rules/README.md` for the pointer policy.

### Print PDF (B88)

```bash
# after copying local art (see docs/manuscript/print-art/README.md)
node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/build-pdf.mjs
```

Or `node tools/build-pdf.mjs` alone (runs all three). Output: `docs/manuscript/build/Ghostwire-Rulebook-DRAFT.pdf` (gitignored) and `ART-GAP-REPORT.md`. Journals stay held.

---

## Lore import policy

1. **Artwork / lore prose** — carry **as-is** from the master Ghostwire PDFs (Core Sourcebook, Lore Book V2, related plates). Do not rewrite voice for “DS alignment” in lore chapters.
2. **Rules** — **Ghostwire-original** wording from `docs/raw/` only. No substantial MCDM / *Draw Steel: Heroes* paste. Engine procedures stand alone in RAW (B92). Draw Steel / Creator License naming is **front matter only**.
3. **Do not** paste lore into `docs/raw/`. Lore harvest lands under `01-lore/` (or front matter stubs), then joins the book via the manifest.
4. Lore harvest landed in B65 (L1–L3). Title plate + credits + print how-to drafted in B74; **cover artist names still TBD (Michael)**. Ch 27 is a pointer fill (B73), not a harvest.

---

## Folder layout

```
docs/manuscript/
  README.md              # this file
  TOC.md                 # print TOC ↔ sources
  MANIFEST.yml           # assemble order
  00-front/              # title plate, credits, print how-to-use (B74)
  01-lore/               # Core Sourcebook / Lore Book harvest stubs
  02-rules/              # pointer notes only (no full raw copies)
  03-directors/          # NEW Reach pointer; Opposition → raw
  04-back/               # Appendix A slang + Appendix B chargen cheat sheet
  print/                 # print CSS (ART-STYLE lock)
  print-art/             # ART-PLACEMENT.yml + empty tree (binaries local)
  build/                 # generated manuscript / with-art / draft PDF
```

---

---

## In Foundry sidebars (B68)

Rules chapters in `docs/raw/` may include a locked markdown callout:

```markdown
> **In Foundry**
> …2–6 short sentences naming **shipped** module UI only (where it lives, what to click). No screenshots.
```

Pattern + inventory: `docs/spikes/B68-FOUNDRY-SIDEBARS.md`. Sidebars are instructional, not lore. They assemble into the print manuscript with the raw chapters; they are **not** a substitute for Director Foundry notes. Do not invent menus. Journals still held — no regen for sidebar-only bumps.

---

## Authority stack (print)

1. Locked print TOC — `docs/rulebook/TOC-PROPOSAL.md`
2. Rules bodies — `docs/raw/` (once RAW-locked)
3. Lore bodies — harvested manuscript stubs from master PDFs
4. Assemble order — `docs/manuscript/MANIFEST.yml`
