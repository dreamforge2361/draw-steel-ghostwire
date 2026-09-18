# `02-rules/` — pointer policy (no full copies)

**Do not** copy or symlink the entire `docs/raw/` tree into this folder.

Rules chapters for the print book are listed in `../MANIFEST.yml` with `path: ../raw/<file>.md` (or absolute-from-repo `docs/raw/...` as resolved by the assemble script). Stage 3 filled chapters stay edited **only** in `docs/raw/`.

### What may live here

| Allowed | Example |
|---|---|
| Pointer / policy notes | this README |
| **NEW** print stubs not yet in raw | `10-lifestyle-downtime.STUB.md` (body deferred — do not invent Lifestyle tables here yet) |

### What must not live here

- Full copies of `01-how-to-play.md`, class chapters, Wire/Veil, etc.
- Lore harvested from PDFs (that goes in `../01-lore/`)
- Dual-edit forks of RAW-locked chapters

When Lifestyle is ready to draft, prefer adding `docs/raw/` (if Journals should carry it) **or** replacing the stub path in the manifest once — still one SoR body, not two.
