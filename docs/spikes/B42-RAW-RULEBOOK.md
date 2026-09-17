# Spike B42 — Assemble Ghostwire RAW rulebook (`docs/raw/`)

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push** until Michael reviews a first full draft pass (or says commit). Prefer: assemble → Michael skim TOC + 2 sample chapters → then commit.  
**Bump** module.json only if Foundry changes land in the same PR (prefer **docs-only** for B42 — no module bump required).

## Goal
Populate `docs/raw/` as the **master no-lore, no-artwork RAW rulebook**: Draw Steel–shaped chapter order, Ghostwire-skinned, assembled from locked rulebook/masters. Index already at `docs/raw/00-INDEX.md` (or README — use the index file present).

## Copyright / DS engine (LOCKED)
- **Do not** copy or lightly paraphrase long passages from *Draw Steel: Heroes* or other MCDM books.
- Shared engine chapters (`01`–`04`, `24`): write **short original Ghostwire procedures** + explicit **“Engine: Draw Steel Heroes — use official rules for X; Ghostwire remaps below”** tables (characteristics names, ¥ instead of wealth flavor, Director, etc.).
- Class / Wire / Chrome / Machines / Ancestries: our text — scrub lore and art; keep numbers and procedures.

## Work order
1. Read `docs/raw/` index + `docs/rulebook/DS-ALIGNMENT.md` + `docs/rulebook/00-STAGE1-skeleton.md`.
2. Create every mapped file listed in the index (stub OK only if source missing — prefer full assemble).
3. Assemble from sources in the index table; strip:
   - Lore / setting essays
   - Art-style and layout notes
   - Foundry-only implementation (move pointers to a short “Foundry note” appendix or omit)
   - Old tier ladders (remap per DS-ALIGNMENT)
4. Class chapters: start from `docs/rulebook/01-operator.md` … `08-hacker.md`, `20-technomancer.md` — keep ability ladders, costs, resources; cut fiction openers.
5. `21-the-wire.md`: extract Matrix rules from Hacker chapter + `18-wired-foundry.md` **rules** only (Console UI → one short “tools” note, not a full Foundry manual).
6. `22-the-veil.md`: minimal — only Elementalist/Street Priest dependencies; if thin, say so and point to class chapters.
7. Front matter: glossary of Ghostwire terms; how this book relates to DS Heroes.
8. Update `docs/rulebook/STATUS.md` + FOUNDRY-BUILD-PLAN: RAW assemble pending Michael review; Journal pack = B42b after RAW lock.

## Out of scope
Foundry Journal pack (B42b); PDF; lore book; ART-STYLE; bestiary fiction; B40/B41.

## Done when
- All index files exist under `docs/raw/` with real content (not empty stubs) for every chapter that has a source.
- Engine chapters are reference+remap, not MCDM copies.
- No lore/art chapters.
- Print a chapter checklist for Michael.
- **No commit** unless Michael already approved in-thread; default no commit.

## Michael review checklist (print when finished)
1. Open `docs/raw/` index — chapter list matches intent.
2. Spot-read `01-how-to-play` + `03-tests-power-rolls` — short, remap tables, no pasted DS prose.
3. Spot-read `12-operator` (or one class) — abilities/costs intact, lore trimmed.
4. Spot-read `21-the-wire` — Matrix rules present; Foundry UI not the main body.
5. Confirm no ART-STYLE / lore-book chapters in the tree.