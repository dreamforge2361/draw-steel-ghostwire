# B91 — Reach gang signs (print placement)

**Status:** Michael-approved 2026-09-18 — all eight. **Placed in book 2026-09-19 (0.3.23).**  
**Bump:** module **0.3.23** (next free 0.3.x after main 0.3.22)  
**Journals:** **not** regenerated (held until after the 0.4.0 PDF)

Hands Off lore is a separate B91 lock (`B91-HANDS-OFF-ACCORDS.md`). This spike is **art placement only**.

## Approved signs — all eight

| Slot | Heading (`after_heading`) | File |
|---|---|---|
| `gang-metermen` | `### The Metermen` | `docs/manuscript/print-art/gangs/metermen.webp` |
| `gang-skinjobs` | `### The Skinjobs` | `docs/manuscript/print-art/gangs/skinjobs.webp` |
| `gang-nightshift` | `### The Nightshift` | `docs/manuscript/print-art/gangs/nightshift.webp` |
| `gang-ninth-ward-kings` | `### The Ninth Ward Kings` | `docs/manuscript/print-art/gangs/ninth-ward-kings.webp` |
| `gang-rust-saints` | `### The Rust Saints` | `docs/manuscript/print-art/gangs/rust-saints.webp` |
| `gang-glass-vipers` | `### The Glass Vipers` | `docs/manuscript/print-art/gangs/glass-vipers.webp` |
| `gang-hollow-men` | `### The Hollow Men` | `docs/manuscript/print-art/gangs/hollow-men.webp` |
| `gang-undertow` | `### The Undertow` | `docs/manuscript/print-art/gangs/undertow.webp` |

Placement matches Peoples: `ART-PLACEMENT.yml` `after_heading` → `insertAfterHeading` in `tools/inject-print-art.mjs`. Chapter `L3`. Kind `gang`. Credit: Ghostwire AI. Captions use Ghostwire names only.

`### The Undertow` was missing from L3. Added a one-line Flats-gang stub (flood-readers; already in the flood-cycle prose). Not a new chapter.

## Windows rebuild (after pull)

```powershell
# Eight signs are tracked — skip copy if the clone has print-art/gangs/*.webp
node tools/assemble-manuscript.mjs
node tools/inject-print-art.mjs
node tools/build-pdf.mjs
# docs\manuscript\build\Ghostwire-Rulebook-0.4.0.pdf
# docs\manuscript\build\ART-GAP-REPORT.md
```

The eight `gang-*` slots must appear under **Placed**. Journals stay held.

## Not this spike

- Foundry journal regen
- Invented gang chapters or extra lore
- External IP name-checks on captions (B78/B83)
- Peoples / class plates (still local / ART GAP)

## Checklist

- [x] Eight approved webps in `docs/manuscript/print-art/gangs/`
- [x] `ART-PLACEMENT.yml` L3 `after_heading` slots
- [x] `### The Undertow` one-liner under Flats gangs
- [x] `module.json` **0.3.23**
- [x] Journals not regenerated
