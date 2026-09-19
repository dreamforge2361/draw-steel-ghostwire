# `02-rules/` — pointer policy (no full copies)

**Do not** copy or symlink the entire `docs/raw/` tree into this folder.

Rules chapters for the print book are listed in `../MANIFEST.yml` with `path: ../raw/<file>.md` (or absolute-from-repo `docs/raw/...` as resolved by the assemble script). Stage 3 filled chapters stay edited **only** in `docs/raw/`.

### What may live here

| Allowed | Example |
|---|---|
| Pointer / policy notes | this README — Lifestyle body is `docs/raw/26-lifestyle-downtime.md` (B67); do not re-stub it here |

### What must not live here

- Full copies of `01-how-to-play.md`, class chapters, Wire/Veil, etc.
- Lore harvested from PDFs (that goes in `../01-lore/`)
- Dual-edit forks of RAW-locked chapters

Lifestyle is drafted in `docs/raw/26-lifestyle-downtime.md` and assembled as print Ch 10. Do not copy it into this folder.
