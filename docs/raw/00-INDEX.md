# Ghostwire RAW Rulebook (master)

**Status:** First full assemble 2026-09-17 — chapters mostly **draft**, pending Michael review. **`21-the-wire.md` RAW-locked** (B66, 2026-09-18; **Wire Atlas B116** 2026-09-20). **`26-lifestyle-downtime.md` Stage 3 draft** (B67, 2026-09-18; Contacts pointer polish B75; B92 stand-alone downtime). **`25-opposition.md` Stage 3 draft** (B70, 2026-09-18). **`09-chrome-body-integrity.md` implant ¥ catalog** (B71, 2026-09-18). **`24-advancement.md` + `06-backgrounds-professions.md` Stage 3 fill** (B73, 2026-09-19). Print Ch 27 Reach pointer filled in manuscript (B73). Print title/credits/how-to + Ch 0 abbreviations **B74** (2026-09-19). **`10-mods.md` + `07-languages.md` Stage 3 procedure fill** (B75, 2026-09-19). **B92** (2026-09-19): print SoR stands alone — no player-facing “need Heroes to play”; Draw Steel naming front-matter-only. **`27-corruption-taint.md` B80 lock** (2026-09-19): shared Taint 0–12. No lore in RAW, no artwork. Review flags: `docs/spikes/B42-RAW-REVIEW-FLAGS.md`. **Print TOC:** LOCKED 2026-09-18 (recommended package; see `docs/rulebook/TOC-PROPOSAL.md`). PDF redo later (Michael).  
**Path:** `docs/raw/` — this folder is the **master RAW** player/Director rules text for the repo.  
**Delivery order (LOCKED):** (1) finish RAW markdown here → (2) Foundry Journal pack from these files → (3) PDF pipeline later.

## What this is
A **rules-only** Ghostwire book in this chapter order: how to play, heroes, rolls, combat, ancestries, kits/gear, chrome, classes, Wire, Veil (thin), Taint, machines, advancement. **No setting lore chapters. No art direction. No fiction vignettes.**

## What this is not
- Not the Lore Book / Ossian Reach gazetteer / ART-STYLE.
- Not a reprint of a third-party core rulebook. **Copyright:** do not paste or reconstruct substantial third-party rules prose. Shared engine = **Ghostwire-original procedures in this tree**. Players play from this RAW / the print manuscript.
- Not Foundry UI docs (those stay in `docs/rulebook/18-wired-foundry.md` / directors stubs).

## Authority stack
| Priority | Source |
|---|---|
| 1 | This `docs/raw/` tree (once a chapter is marked **RAW-locked**) |
| 2 | Development Masters Part 1 + locked `docs/rulebook/*.md` / `docs/masters/*` used to assemble RAW |
| 3 | Ghostwire engine procedures **as written in this RAW tree** (standalone; no second rulebook required to play) |
| 4 | Ghostwire lore PDFs — **out of scope for RAW** |

When assembling, scrub: lore digressions, art briefs, “table fiction,” old tier ladders (see `docs/rulebook/DS-ALIGNMENT.md`).

## Volume map (Ghostwire-skinned)

| File | Title | Type | Source to assemble from |
|---|---|---|---|
| `00-front-matter.md` | Front matter, how to use this book, glossary seeds | GW | New + alignment notes |
| `01-how-to-play.md` | How to Play / The Director | GW procedure + terms | Stage 3 fill 2026-09-18; B92 standalone |
| `02-heroes-characteristics.md` | Heroes & Characteristics | Stage 3 draft | Stage 3 fill 2026-09-18 (B69); Physique/Reflex/Logic/Instinct/Persona; skills; chargen order |
| `03-tests-power-rolls.md` | Tests, Power Rolls, Heroes’ Fortune | GW procedure | Outcome order ≤11 / 12–16 / 17+; B92 standalone |
| `04-combat.md` | Combat basics | Stage 3 draft | Stamina, Recoveries, B49 weapon use, GW keywords, Crisis/inert |
| `05-ancestries.md` | Ancestries (Peoples) | GW | `09-species.md` + SPECIES-DS-MAP |
| `06-backgrounds-professions.md` | Backgrounds & Professions | Stage 3 draft (B73) | 8 Backgrounds + 15 Professions; community-edge + collision procedure |
| `07-languages.md` | Languages (rules only) | Stage 3 draft (B75) | Chargen + check procedure; names + knowledge-only lock; lore gazetteer still non-goal (#67) |
| `08-kits-gear-wealth.md` | Kits, Gear & Wealth (¥) | GW kits pattern | `10-kits.md`, `11-economy.md`, gear master distill |
| `09-chrome-body-integrity.md` | Chrome & Body Integrity | GW draft (B71 catalog) | Pass A locks + implant ¥/Avail from Chrome pack + B55 Soft; packages/Frame Modules provisional |
| `10-mods.md` | Mods | Stage 3 draft (B75; vehicle/drone Armor=Stamina lock 2026-09-20) | Complete lock kept; table procedure + harvested §3G/§5F; wearable armor/gadget SKUs unpublished; vehicle/drone Armor + Weaponry 4-echelon ladders |
| `11-perks.md` | Perks | GW | `17-perks.md` |
| `12-operator.md` … `20-technomancer.md` | Class chapters | GW | `01`–`08`, `20` rulebook (rules only; strip lore) |
| `21-the-wire.md` | The Wire (Matrix) | GW | **RAW-locked** B66 (2026-09-18); Wire Atlas B116 (2026-09-20); Linked 2026-09-20; Disconnected/Linked/Overlay/Jacked In, Rating 1–5, Trace Alert defaults, suites/payloads, Relay/Host/Segment; **0.3.68** Wire Kit / Rigger’s Harness / pack drones and vehicles = Connect; **0.3.78** Constructs roster + Lock A |
| `22-the-veil.md` | The Veil (minimal) | GW | Only what Elementalist / Street Priest need |
| `23-machines.md` | Drones, Vehicles (Buildings stub OK); **Vehicles & Transit street picture** 2026-09-20; **Lane-Hopper** POV + **Star-Chopper** hover-bike SKUs; **0.3.80** AEQ/LAZ service chassis (Seal Cruiser, Writ VTOL, White Door, Crash Angel) | GW | `15-drones.md`, `16-vehicles.md`, L1 Vehicles & Transit |
| `24-advancement.md` | Advancement & echelons | Stage 3 draft (B73) | Levels 1–10, echelon bands, table timing; doctrine locked |
| `25-opposition.md` | Opposition (Director) | Stage 3 draft | Stage 3 fill 2026-09-18 (B70); street-fight procedure; Malice + Trace Alert; no lore bestiary; **0.3.78** AEQ patrol + LAZ extract pack pointers |
| `26-lifestyle-downtime.md` | Lifestyle & Downtime | GW Stage 3 draft (B67; Contacts pointer B75; B92 standalone) | Print Ch 10; upkeep ¥; Medic restock quotes; §Craft / chrome / Ritual; Contacts/hireling pointer |
| `27-corruption-taint.md` | Corruption & Taint | GW draft (B80 lock 2026-09-19) | Shared hero Taint 0–12; Clean/Marked/Stained/Claimed/Hollowed; +1/scene except pact; rest never cleanses; chrome does not raise Taint; Mutant Load stays retired |

Class file numbers: 12 Operator, 13 Scout, 14 Commander, 15 Medic, 16 Wrench, 17 Elementalist, 18 Street Priest, 19 Hacker, 20 Technomancer.

## Assembly rules
1. **One concern per chapter** — procedures, numbers, lists, examples that teach the rule. Cut “in the Reach…” fiction unless it is a mechanical example.
2. **Term sheet** in front matter: Director, Edgerunner/runner, ¥, Linked, Overlay, Jacked In, Node Rating, Body Integrity, Availability, Echelon.
3. **Power Roll** always this book’s print order: low / middle / high (never inverted).
4. **No ART-STYLE** links in RAW body.
5. Mark each file header: `**RAW status:** draft | locked` and `**Sources:** …`.

## Next deliveries
1. **B61** — print TOC **LOCKED 2026-09-18** (recommended package).  
2. Draft order: shared core (`01` Stage 3 fill → `03`/`04`) → Wire **RAW-locked** (B66) → Lifestyle **draft** (B67) → then PDF.  
3. **B42b** — Foundry Journal pack regenerates from `docs/raw/` after locks (`tools/raw-to-journals.mjs`). **Do not regen journals on 0.2.5.**  
4. **PDF** — after spine polish + Michael Lifestyle skim.