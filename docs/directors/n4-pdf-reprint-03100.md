# N4 — Rulebook PDF reprint (0.4.0 @ module 0.3.100)

**Built:** 2026-09-22 21:12 EDT (assemble → inject-print-art → linkify → Chrome HTML→PDF)
**Command:** `node tools/build-pdf.mjs` (exit 0)
**Print version:** **0.4.0** — unchanged. This is a **reprint** of the official edition, not a new edition number.
**Module at print time:** **0.3.100** on `main` (G2 merged, PR #84).

## Output

| Artifact | Path |
|---|---|
| PDF | `docs/manuscript/build/Ghostwire-Rulebook-0.4.0.pdf` |
| HTML | `docs/manuscript/build/Ghostwire-Rulebook-0.4.0.html` |
| Assembled MD | `docs/manuscript/build/Ghostwire-Manuscript.md` |
| + art | `docs/manuscript/build/Ghostwire-Manuscript.with-art.md` |
| + links | `docs/manuscript/build/Ghostwire-Manuscript.with-links.md` |
| Art gaps | `docs/manuscript/build/ART-GAP-REPORT.md` (tracked) |

Binaries are gitignored. **95.4 MB / 316 pages**, valid `%%EOF`.
Prior Sep-18 build for comparison: 75.6 MB / 249 pages — **+67 pages** of pointer-assembled content.

## What landed

Rules chapters assemble **by pointer** at `docs/raw/*.md`, so the reprint picked up every RAW
gain since the first print without touching the manuscript tree:

| Content | Print home | Verified |
|---|---|---|
| Ritual Workings — Formula / Working / Seal, Magnitude, 5 stages, card index | Ch 24 (`22-the-veil.md`) | `Ritual Working` ×23, `Ward the Room` ×6, `Magnitude` ×231 |
| Machines — drones / vehicles / mods (S8, 0.3.98) | Ch 25 (`23-machines.md`) | `Lane-Hopper` ×14, `Star-Chopper` ×13 |
| Kit street-band chargen grants (G1, 0.3.99) | Ch 9 (`08-kits-gear-wealth.md` §139–147) | free-Kit street-band grant procedure + the 0.3.99 **In Foundry** sidebar |
| Wearable armor / shield + gadget mod families **Published** (G2, 0.3.100) | Ch 12 (`10-mods.md`) | `§2F` ×10, `§1H` ×9; `Thermoptic Skin` / `Deep Optics` ×4 each |
| Constructs & Pets action-economy FAQ | Ch 30 (`28-constructs-pets-faq.md`) | present |
| Lore harvest L6–L8 — Measure Collegium / Wickkeepers / Ash Survey | Lore part | ×8 / ×13 / ×8, **with faction plates placed** |
| Voidmark, Hands Off Accords, Black Market street color | L4 / L5 / L1 / L3 | present |

Front matter touched (tracked, honest status only — no marketing rewrite):
`docs/manuscript/00-front/title-page.md`, `docs/manuscript/README.md`.

## Two deliberate non-changes

1. **`docs/raw/27-corruption-taint.md` stays out of the MANIFEST.** It looks like a missing
   chapter, but the locked TOC (`docs/rulebook/TOC-PROPOSAL.md:147`) says the B80 Taint ladder is
   a **pointer inside print Ch 24** — *"not a new print-Ch number."* The omission is correct;
   do not "fix" it in a later pass without reopening the TOC lock.
2. **`Scrap-Bow` does not appear in the print book, and that is by design.** RAW Ch 9 lists
   **Kits** and gear **categories** ("bows and exotic"), never individual SKUs — those live in
   `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §3F and the Foundry `gear` pack, which are not print
   MANIFEST entries. G1's print-tier contribution is the street-band **grant procedure**, which
   is in. A smoke that greps the manuscript for a SKU name will always fail; grep the procedure.

## Known open

- **Art gap ×1 — `wire-opener`** (Ch 23 filler): `docs/manuscript/print-art/filler/wire-opener.webp`
  missing. 54/55 slots placed. Unchanged from the last run; **not** a reprint blocker.
  Fill from Michael's Dropbox art tree, then re-run inject + build.
- **Placeholder mod icons** on the new G2 armor / gadget SKUs — pack-side, does not affect print.
- ART-GAP-REPORT content is identical to the committed copy; only the generated timestamp moved.
- Foundry journals **not** regenerated (print-only pass). Packs untouched — no LevelDB rebuild.

## Next

**Chargen Wizard (I2 / 0.3.101)** → **G4 B49 skill-on-weapon rolls** → **G3** lang + style tokens → **S1** → **L1**. Module stays **0.3.100** until Chargen ships.
