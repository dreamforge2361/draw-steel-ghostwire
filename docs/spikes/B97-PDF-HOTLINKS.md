# Spike B97 — PDF internal hotlinks (Chrome HTML→PDF)

**Status:** Built 2026-09-19 · Michael confirmed draft PDF solid 2026-09-18  
**Bump:** module **0.3.22** (main is 0.3.21)  
**Journals:** **not** regenerated

## Goal

Make the Chrome-built rulebook PDF easy to navigate:

1. **Clickable TOC** — generated Contents (from `MANIFEST.yml`) plus front-matter / how-to-use / chapter-list entries jump to chapter heading `#id`s.
2. **Cross-refs** — unambiguous RAW/manuscript pointers become markdown links to those headings.
3. **Heading anchors** — `tools/lib/md-to-html.mjs` keeps slug-from-text IDs; collisions get `-2`, `-3` (shared allocator, including blockquotes).
4. **PDF outline** — Chrome is asked to emit bookmarks from `h1`–`h3` (`--generate-pdf-document-outline` + `--export-tagged-pdf`). If a given Chrome/Edge build writes no `/Outlines`, in-document links still work.

## Windows rebuild

```powershell
# Art already in-tree (0.3.21 plates) — skip copy unless you are filling remaining gaps.
node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/linkify-manuscript.mjs
node tools/build-pdf.mjs
# docs\manuscript\build\Ghostwire-Rulebook-DRAFT.pdf
# docs\manuscript\build\Ghostwire-Rulebook-DRAFT.html

# One-shot (assemble → inject → linkify → HTML/PDF):
#   powershell -ExecutionPolicy Bypass -File tools/build-pdf.ps1
# HTML only (no Chrome):
#   node tools/build-pdf.mjs --html-only
```

Smoke (no journals, no pack rebuild):

```powershell
node tools/linkify-smoke.mjs
node tools/linkify-smoke.mjs --html
```

## Architecture (assemble stays SoR)

| Step | Tool | Notes |
|---|---|---|
| 1 | `assemble-manuscript.mjs` | Unchanged concatenation from `MANIFEST.yml` |
| 2 | `inject-print-art.mjs` | Unchanged figures / ART GAP |
| 3 | `linkify-manuscript.mjs` | Registry + Contents + pointer rewrite → `Ghostwire-Manuscript.with-links.md` |
| 4 | `md-to-html.mjs` → Chrome | Same image rewrite; collision-safe heading `id`s |

Do **not** hand-edit every RAW chapter. Do **not** invent art. `wire-opener` gap can stay.

Shared libs:

- `tools/lib/heading-anchor.mjs` — slug + collision IDs
- `tools/lib/chapter-registry.mjs` — MANIFEST + `<!-- chapter: -->` banners + first `h1` per chapter
- `tools/lib/linkify-manuscript.mjs` — rewrite pass

## What gets linked (only if the target heading exists)

| Pattern | Maps via | Example |
|---|---|---|
| RAW file id `` `21` `` | Path basename `21-*.md` | Wire (print Ch **23**, not Hacker) |
| RAW filename `` `21-the-wire.md` `` / `` `docs/raw/21-the-wire.md` `` | Filename | same |
| `print Ch 29` | `print_ch` | Appendix B cheat sheet |
| `Ch. 9` / `chapter 26` | `print_ch` | Kits / Opposition |
| `Appendix A` / `Appendix B` | Explicit table (Ch 28 / 29) | Slang / chargen |
| `see Combat` | Unique chapter title | Combat `h1` |
| `How to Play → Table tone and safety` | Chapter title + unique heading | both sides if unambiguous |
| TOC / chapter-list table cells | Exact title or `NN-*.md` filename | Front-matter chapter list |

Ranges (`print Ch 1–5`, `Print Ch 6–13`) are **left alone** (multi-target). Unknown ids (`99`) stay plain. `docs/rulebook/` and `docs/masters/` paths are **not** treated as print chapters.

## What is not linked

- Ambiguous subsection titles (`Class Chassis`, `Purchased Traits`, …).
- Bare words (`Wire`, `Combat`) without `see` / `Ch.` / backtick / TOC-cell cue.
- Image `src`, `<figure>`, fences, HTML comments, existing `[text](url)`.
- Draw Steel procedure cites after front matter (no new ones added).

## PDF outline / bookmarks

Chrome 126+ can embed an outline from HTML headings when both flags are set:

```
--generate-pdf-document-outline
--export-tagged-pdf
```

`build-pdf.mjs` passes both. Some Chrome/Edge builds still emit **no** `/Outlines` from `--print-to-pdf` (outline is derived from the tagged structure tree; older or “new headless” gaps exist). **Limitation:** if the written PDF has no outline dictionary, use the in-document Contents + cyan `#` links. Do not require Pandoc for this pass.

Heading structure is already `h1` (parts + chapter titles) / `h2` / `h3`. Collision suffixes keep `id` unique so outline targets and in-page links match.

## Not this spike

- Journal regen (held).
- Invented plates / `wire-opener`.
- Hand-rewriting RAW to add markdown links.
- Dumping editorial `docs/manuscript/TOC.md` notes into the PDF (Contents is generated from MANIFEST instead).

## Checklist

- [x] Heading ID helper + collision suffixes
- [x] Chapter registry from MANIFEST + assembled banners
- [x] `linkify-manuscript.mjs` after inject
- [x] Generated Contents page
- [x] Chrome outline flags + limitation documented
- [x] `module.json` **0.3.22**
- [x] Journals not regenerated
