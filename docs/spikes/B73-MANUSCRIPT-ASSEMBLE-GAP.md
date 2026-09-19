# Spike B73 — Manuscript assemble dry-run + gap fill

**Status:** Done 2026-09-19  
**Bump:** module **0.3.2**  
**Journals:** **not** regenerated (manuscript hold; deferred until pre-PDF)

## Goal

Run `node tools/assemble-manuscript.mjs`, inventory STUB / placeholder / thin print-TOC chapters, rank the worst gaps for a printable core book (Michael: manuscript SoR for PDF; journals deferred), and fill the top 1–3 with Ghostwire-original prose (no *Draw Steel: Heroes* paste).

## Assemble (dry-run)

```bash
node tools/assemble-manuscript.mjs
```

| Pass | Result |
|---|---|
| Before fills (main / 0.3.1) | Parts **7** · files included **32** · missing placeholders **0** |
| After fills (this spike) | Parts **7** · files included **32** · missing placeholders **0** |

Output path (gitignored): `docs/manuscript/build/Ghostwire-Manuscript.md`.

| | Before (main) | After (B73) |
|---|---:|---:|
| Assembled words | 147,144 | **151,605** |
| Source-file words (manifest bodies) | 146,340 | **150,813** |
| `MISSING:` / missing-file placeholders | 0 | 0 |
| Lifestyle stub path in MANIFEST | already `../raw/26-lifestyle-downtime.md` (B67) | unchanged (real file) |
| Ch 27 source filename | `27-running-ossian-reach.STUB.md` | `27-running-ossian-reach.md` |

## Inventory (before fills)

### Stub / placeholder / “not yet written”

| Marker | Where | Print impact |
|---|---|---|
| **Ch 27 STUB** (46 words) | `03-directors/27-running-ossian-reach.STUB.md` + MANIFEST / TOC / assemble-order | **Print-blocking** — locked Part V Ch 27 |
| Title/credits `CONTENT TBD` | `00-front/title-page.md` (28 words) | Art plate, not rules |
| TOC still said “CONTENT TBD” for L1–L3 | `docs/manuscript/TOC.md` | Stale — harvest already landed (B65) |
| `02-rules/README.md` still named `10-lifestyle-downtime.STUB.md` | pointer policy | **Stale** — B67 removed that file; body is `docs/raw/26-lifestyle-downtime.md` |
| HTP “forthcoming Lifestyle chapter” | `docs/raw/01-how-to-play.md` | Broken relative pointer vs real `26` |
| Front-matter chapter list omitted `26` | `docs/raw/00-front-matter.md` | Print Ch 0 TOC hole |

### Broken relative pointers

- Lifestyle **MANIFEST path was already correct** (B67). The leftover damage was README / HTP / TOC wording, not a missing file.
- Assemble resolved all 32 `path:` entries (0 missing).

### Thin Stage 3 RAW chapters in the print TOC (< ~1500 words)

| Print Ch | File | Before | TOC-PROPOSAL stamp |
|---|---|---:|---|
| 5 Advancement | `24-advancement.md` | **539** | Complete (thin) — doctrine locked |
| 7 Backgrounds | `06-backgrounds-professions.md` | **625** | Complete (tables only) |
| 12 Mods | `10-mods.md` | 882 | Complete — Invent a Mod locked |
| 8 Languages | `07-languages.md` | 364 | Complete (thin) — lore gazetteer **non-goal** |
| 0 Front matter | `00-front-matter.md` | 1,294 | Partial — license + glossary present |
| 27 Reach pointer | `.STUB.md` | **46** | NEW thin pointer |

Lifestyle (`26`) was already **1,921** (over the 1500 line). Not a fill target.

### Lore L2 / L3 vs L1

| File | Words | Note |
|---|---:|---|
| L1 Setting Primer | 33,003 | B65 harvest; Chair / Kestrel / Concord tail present |
| L2 Peoples & World | 3,781 | B65: PDF-depth OK; “no material gap” |
| L3 Reach color | 6,364 | Optional street color; Handbook gazetteer intentionally out |

L2/L3 are thinner than L1 because Book One corp/cosmology is huge, not because the harvest missed peoples/Reach fixtures. Filling them with invented prose would fight the **harvest as-is** lore policy. Left as backlog (optional depth), not this spike’s fill.

## Rank (printable core book)

1. **Ch 27 Running Ossian Reach** — stub in the locked TOC. Directors have no print procedure for “where do I open the hive?” Worst print blocker.
2. **Ch 5 Advancement** — 539 words next to 6–10k class chapters. Doctrine locked; table **timing** and “what does not grow” were missing.
3. **Ch 7 Backgrounds** — 625 words of tables. Play procedure (community edge, collisions, Profession ≠ class) missing.
4. **Ch 12 Mods** (882) — Complete lock; armor/gadget families unpublished. Expand later, do not invent families.
5. **Ch 8 Languages** (364) — intentionally thin; gazetteer is a TOC non-goal.
6. **Title page** — art/credits plate; blocked on master PDF direction.
7. **L2 depth vs L1** — harvest-complete; optional polish only.
8. **Ch 0 Front matter** — 1,316 after a list fix; still short of 1500, not a rules hole.

## What we filled (top 3)

Ghostwire-original procedure. No DS Heroes copy-paste. No new chrome ¥ ladders. No Rank 2+ summon strike numbers. In Foundry sidebars name **shipped** UI only.

### 1. Print Ch 27 — Running Ossian Reach

- New body: `docs/manuscript/03-directors/27-running-ossian-reach.md` (deleted `.STUB.md`).
- Pointer map: Handbook, Wired Flats, L3, Opposition, Lifestyle, Wire.
- Session loop, stratum→district procedure, vertical-as-scene, job-board faces (existing names only), downtime address, optional first-three-nights skeleton.
- **No** gazetteer / bestiary / Flats dump.

### 2. Print Ch 5 — Advancement (`docs/raw/24-advancement.md`)

- Kept locked cadence + T5–T1 conversion tables.
- Added: when to apply a level (respite default), apply-at-table steps, echelon-as-street-weather (guidance only), ¥ loop after a level, what never scales (BI, ¥, Node Rating, Lifestyle, deferred summon strikes).

### 3. Print Ch 7 — Backgrounds (`docs/raw/06-backgrounds-professions.md`)

- Kept the 8 + 15 tables (no new rows, no new skills).
- Added: fiction-first picks, community-edge when/not, collision walkthrough, Profession ≠ class, Lifestyle starting-address pointer, Reach-rung **dress** only.

### Wiring / stale pointers

- `MANIFEST.yml`, `assemble-order.txt`, manuscript TOC / READMEs, `TOC-PROPOSAL.md`, `00-INDEX.md`.
- HTP Lifestyle sentences → `26`.
- Front-matter chapter list + Director how-to now name `26` and print Ch 27.
- `02-rules/README.md` no longer points at the deleted Lifestyle stub.

## Word counts (filled chapters)

| Chapter | Before | After | Δ |
|---|---:|---:|---:|
| Ch 27 Running Ossian Reach | 46 | **2,260** | +2,214 |
| Ch 5 Advancement | 539 | **1,853** | +1,314 |
| Ch 7 Backgrounds | 625 | **1,557** | +932 |
| Ch 1 How to Play (pointer fix only) | 2,154 | 2,145 | −9 |
| Ch 0 Front matter (list + Director line) | 1,294 | 1,316 | +22 |
| Assembled manuscript | 147,144 | **151,605** | +4,461 |

## Remaining backlog (after B73)

| Rank | Gap | Why it still waits |
|---|---|---|
| 1 | **Ch 12 Mods** still 882 words | Complete lock; unpublished armor/gadget families — do not invent |
| 2 | **Ch 8 Languages** 364 | Gazetteer explicitly non-goal |
| 3 | **Title / credits plate** | Art direction from master PDF |
| 4 | **Ch 0 Front matter** ~1.3k | Glossary strong; optional how-to-this-book expand |
| 5 | **L2 vs L1 depth** | Harvest-complete; more prose only if Michael wants booklet weight |
| 6 | Followers & Contacts | v1 non-goal; still a stub paragraph in `26` |
| 7 | Buildings shared inventory / ramming one-pager | TOC-PROPOSAL follow-ons |
| 8 | Rank 2+ / Greater summon **strike** ladders | Deferred §C3 — do not invent |
| 9 | Chrome package / Salvage / Frame Module ¥ | B71 provisional — do not invent ladders |
| 10 | Journal regen + Pandoc/PDF | Held until pre-PDF / Michael HTP skim |

## Checklist

- [x] Assemble runs cleanly (32/0)
- [x] Worst print-blocking gap (Ch 27) filled
- [x] Two next thin print RAW chapters filled (≥ ~1500)
- [x] Lifestyle MANIFEST already pointed at `26`; stale stub wording cleared
- [x] No journal regen
- [x] No chrome ¥ / Rank 2+ strike invention
- [x] module.json **0.3.2** (UTF-8 no BOM)
- [x] This spike

## Out of scope

Journal regen; Pandoc/PDF CSS; lore PDF re-harvest; Mods family catalogs; language gazetteer; printable bestiary.
