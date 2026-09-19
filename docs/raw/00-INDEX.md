# Ghostwire RAW Rulebook (master)

**Status:** First full assemble 2026-09-17 — chapters mostly **draft**, pending Michael review. **`21-the-wire.md` RAW-locked** (B66, 2026-09-18). **`26-lifestyle-downtime.md` Stage 3 draft** (B67, 2026-09-18). **`25-opposition.md` Stage 3 draft** (B70, 2026-09-18). **`09-chrome-body-integrity.md` implant ¥ catalog** (B71, 2026-09-18). **`24-advancement.md` + `06-backgrounds-professions.md` Stage 3 fill** (B73, 2026-09-19). Print Ch 27 Reach pointer filled in manuscript (B73). No lore in RAW, no artwork. Review flags: `docs/spikes/B42-RAW-REVIEW-FLAGS.md`. **Print TOC:** LOCKED 2026-09-18 (recommended package; see `docs/rulebook/TOC-PROPOSAL.md`).  
**Path:** `docs/raw/` — this folder is the **master RAW** player/Director rules text for the repo.  
**Delivery order (LOCKED):** (1) finish RAW markdown here → (2) Foundry Journal pack from these files → (3) PDF pipeline later.

## What this is
A **rules-only** Ghostwire book in a Draw Steel–shaped chapter order: how to play, heroes, rolls, combat, ancestries, kits/gear, chrome, classes, Wire, Veil (thin), machines, advancement. **No setting lore chapters. No art direction. No fiction vignettes.**

## What this is not
- Not the Lore Book / Ossian Reach gazetteer / ART-STYLE.
- Not a verbatim reprint of *Draw Steel: Heroes*. **Copyright:** do not paste or reconstruct substantial MCDM prose. Shared engine = **official DS Heroes by reference** + Ghostwire remap tables + **original** Ghostwire wording for procedures we must print at the table.
- Not Foundry UI docs (those stay in `docs/rulebook/18-wired-foundry.md` / directors stubs).

## Authority stack
| Priority | Source |
|---|---|
| 1 | This `docs/raw/` tree (once a chapter is marked **RAW-locked**) |
| 2 | Development Masters Part 1 + locked `docs/rulebook/*.md` / `docs/masters/*` used to assemble RAW |
| 3 | Official Draw Steel Heroes (engine by reference) |
| 4 | Ghostwire lore PDFs — **out of scope for RAW** |

When assembling, scrub: lore digressions, art briefs, “table fiction,” old tier ladders (see `docs/rulebook/DS-ALIGNMENT.md`).

## Volume map (DS-shaped, Ghostwire-skinned)

| File | Title | Type | Source to assemble from |
|---|---|---|---|
| `00-front-matter.md` | Front matter, how to use this book, glossary seeds | GW | New + DS-ALIGNMENT |
| `01-how-to-play.md` | How to Play / The Director | DS-by-ref + GW terms | Stage 3 fill 2026-09-18; term remap |
| `02-heroes-characteristics.md` | Heroes & Characteristics | Stage 3 draft | Stage 3 fill 2026-09-18 (B69); Physique/Reflex/Logic/Instinct/Persona; skills; chargen order |
| `03-tests-power-rolls.md` | Tests, Power Rolls, Heroes’ Fortune | DS-by-ref | Outcome order ≤11 / 12–16 / 17+ |
| `04-combat.md` | Combat basics | Stage 3 draft | Stamina, Recoveries, B49 weapon use, GW keywords, Crisis/inert |
| `05-ancestries.md` | Ancestries (Peoples) | GW | `09-species.md` + SPECIES-DS-MAP |
| `06-backgrounds-professions.md` | Backgrounds & Professions | Stage 3 draft (B73) | 8 Backgrounds + 15 Professions; community-edge + collision procedure |
| `07-languages.md` | Languages (rules only) | GW thin | `19-languages.md` — names + mechanical grants; no lore gazetteer |
| `08-kits-gear-wealth.md` | Kits, Gear & Wealth (¥) | GW + DS kits pattern | `10-kits.md`, `11-economy.md`, gear master distill |
| `09-chrome-body-integrity.md` | Chrome & Body Integrity | GW draft (B71 catalog) | Pass A locks + implant ¥/Avail from Chrome pack + B55 Soft; packages/Frame Modules provisional |
| `10-mods.md` | Mods | GW | `14-mods.md` |
| `11-perks.md` | Perks | GW | `17-perks.md` |
| `12-operator.md` … `20-technomancer.md` | Class chapters | GW | `01`–`08`, `20` rulebook (rules only; strip lore) |
| `21-the-wire.md` | The Wire (Matrix) | GW | **RAW-locked** B66 (2026-09-18); Overlay/Jacked In, Rating 1–5, Trace Alert defaults, suites/payloads |
| `22-the-veil.md` | The Veil (minimal) | GW | Only what Elementalist / Street Priest need |
| `23-machines.md` | Drones, Vehicles (Buildings stub OK) | GW | `15-drones.md`, `16-vehicles.md` |
| `24-advancement.md` | Advancement & echelons | Stage 3 draft (B73) | Levels 1–10, echelon bands, table timing; doctrine locked |
| `25-opposition.md` | Opposition (Director) | Stage 3 draft | Stage 3 fill 2026-09-18 (B70); street-fight procedure; Malice + Trace Alert; no lore bestiary |
| `26-lifestyle-downtime.md` | Lifestyle & Downtime | GW Stage 3 draft (B67) | Print Ch 10; §F3 upkeep ¥; Medic restock quotes; §Craft / chrome / Ritual pointers |

Class file numbers: 12 Operator, 13 Scout, 14 Commander, 15 Medic, 16 Wrench, 17 Elementalist, 18 Street Priest, 19 Hacker, 20 Technomancer.

## Assembly rules
1. **One concern per chapter** — procedures, numbers, lists, examples that teach the rule. Cut “in the Reach…” fiction unless it is a mechanical example.
2. **Term sheet** in front matter: Director, Edgerunner/runner, ¥, Overlay, Jacked In, Node Rating, Body Integrity, Availability, Echelon.
3. **Power Roll** always DS print order (never inverted).
4. **No ART-STYLE** links in RAW body.
5. Mark each file header: `**RAW status:** draft | locked` and `**Sources:** …`.

## Next deliveries
1. **B61** — print TOC **LOCKED 2026-09-18** (recommended package).  
2. Draft order: shared core (`01` Stage 3 fill → `03`/`04`) → Wire **RAW-locked** (B66) → Lifestyle **draft** (B67) → then PDF.  
3. **B42b** — Foundry Journal pack regenerates from `docs/raw/` after locks (`tools/raw-to-journals.mjs`). **Do not regen journals on 0.2.5.**  
4. **PDF** — after spine polish + Michael Lifestyle skim.