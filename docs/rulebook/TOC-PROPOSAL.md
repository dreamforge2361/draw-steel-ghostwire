# Ghostwire Rulebook — TOC Proposal (v1 PDF lock candidate)

**Status:** LOCKED 2026-09-18 (recommended package; Michael skipped picker — working lock)  
**Date:** 2026-09-18  
**Spike:** `docs/spikes/B61-RULEBOOK-TOC.md`  
**Authority today:** `docs/raw/` is SoR for rules text; Journals regenerate from it; PDF is later  
**Doctrine in force:** Levels **1–10** + **Echelon 1–4** (no old tier ladder); Power Roll **low / middle / high**; Culture→**Background** / Career→**Profession**; Veil **§C3** + **B43 Rituals** locked in `22-the-veil.md`

**Process Michael asked for:** inventory gaps → **lock TOC** → draft → PDF.  
**This doc does not draft chapter bodies.**

---

## 1. Inventory — `docs/raw/` files

Completeness key:

| Rating | Meaning |
|---|---|
| **Complete** | Playable end-to-end for v1; only polish / provisional benchmarks remain |
| **Partial** | Substantive draft; known holes, stubs, or Stage-3 thinness block print-ready |
| **Stub** | Intentionally thin; pointers or doctrine only |
| **Missing** | Needed for a printable core book; no chapter file yet |

| Filename | Title | Completeness | Notes |
|---|---|---|---|
| `00-INDEX.md` | RAW master index / volume map | Complete (meta) | Not a printed chapter; delivery order locked: RAW → Journals → PDF |
| `00-front-matter.md` | Front matter, how to use, glossary | Partial | Creator License present; glossary strong; all chapters still **draft** status |
| `01-how-to-play.md` | How to Play / The Director | Partial → Stage 3 fill | Expanded Stage 3 spine 2026-09-18; pending Michael review before RAW-lock / journals regen |
| `02-heroes-characteristics.md` | Heroes & Characteristics | Partial | Chargen steps, characteristic remap, skill list, class glance. Needs Lifestyle / Contacts pointers when those exist |
| `03-tests-power-rolls.md` | Tests, Power Rolls, Heroes’ Fortune | Partial | Correct DS print order; short. Wired / connection modifiers present |
| `04-combat.md` | Combat basics | Stage 3 draft (0.1.99) | Standalone GW combat procedures; B49/B44c free-strike note; Crisis/inert pointers |
| `05-ancestries.md` | Ancestries (Peoples) | Complete | Eight Peoples as DS ancestry packages. A1 copyright rewrite **deferred**. Cyborg System Crisis still thin |
| `06-backgrounds-professions.md` | Backgrounds & Professions | Complete | 8 Backgrounds + 15 Professions; Culture→Background / Career→Profession locked |
| `07-languages.md` | Languages (rules only) | Complete (thin) | Names + knowledge-only rules locked. Lore gazetteer = **non-goal** for RAW/PDF v1 |
| `08-kits-gear-wealth.md` | Kits, Gear & Wealth (¥) | Partial | Ownership/firewall solid. Kit bonus lines **provisional**. Lifestyle burn = placeholder. Run payouts provisional. Merc dual-Kit undefined |
| `09-chrome-body-integrity.md` | Chrome & Body Integrity | Partial | BI 20, grades, erosion locked (Pass A). Implant ¥ / package totals / Frame Module prices **not published** |
| `10-mods.md` | Mods | Complete | Invent a Mod **locked**; echelon + Availability |
| `11-perks.md` | Perks | Complete | Full perk list assembled from pack |
| `12-operator.md` | Operator | Partial | Full class draft; Pass A–C applied. Residual ability/flag debt in B42 flags |
| `13-scout.md` | Scout | Partial | Full class draft; title reskins (0.1.93). Some B42 flags remain |
| `14-commander.md` | Commander | Partial | Full class draft; Command Persona lock applied. Residual flags |
| `15-medic.md` | Medic | Partial | Full class draft; restock = lifestyle abstraction until Lifestyle lands |
| `16-wrench.md` | Wrench | Partial | Longest class; many numbers originated as estimates. Buildings live here; shared inventory stub in `23` |
| `17-elementalist.md` | Elementalist | Partial | 7/9/11 bands still marked provisional in places. Summon Stamina now follows locked §C3 |
| `18-street-priest.md` | Street Priest | Partial | Damage values filled (Pass C). §C3 / spirit stamps aligned. Rank 2+ strikes **deferred** |
| `19-hacker.md` | Hacker | Partial | Class-only after Wire extract; shorter than peers. Some flag leftovers (`@chr`, tier phrasing scrub debt) |
| `20-technomancer.md` | Technomancer | Partial | Stage 2 extract; sprites/biofeedback largely filled post–Pass C |
| `21-the-wire.md` | The Wire (Matrix) | Partial → near-Complete | Nodes, Overlay/Jacked In, System Stat Card, Trace Alert, Matrix Verbs, suites/payloads present. Orphan **×1 wired-direct** biofeedback multiplier still listed. Track A Stage 4 still marked Todo in build plan despite draft existing |
| `22-the-veil.md` | The Veil | Partial (strong) | **B43 Ritual Workings locked**; **§C3 Summon Entities locked** (0.1.95). Open: thin-place gazetteer, full corruption ladder, Rank 2+ strike ladders, defense stamps |
| `23-machines.md` | Drones, Vehicles & Buildings | Partial | Inventories present; Integrity/Speed often qualitative. Buildings = stub pointer to Wrench. Ramming cites §6.2 without full print procedure |
| `24-advancement.md` | Advancement & Echelons | Complete (thin) | Levels 1–10, Echelon 1–4, cadence table, legacy tier conversion. Doctrine locked |
| `25-opposition.md` | Opposition (Director) | Stub | Reskin + Malice + Trace Alert doctrine only. No printable bestiary |

**Existing TOC elsewhere?** No locked TOC. `00-INDEX.md` volume map + `00-front-matter` chapter list are the only outlines. `docs/rulebook/` has chapter drafts (parallel source), not a book TOC. Track A in `FOUNDRY-BUILD-PLAN.md` still lists Stage 3 shared core and Stage 4 Wire/Veil/Machines as open (out of date vs `docs/raw/` drafts).

---

## 2. Gaps that block a printable “core book”

These are **print blockers**, not Foundry polish:

### A. Shared rules spine (Track A Stage 3)

`01` / `03` / `04` are correct but **too thin to stand alone** next to class chapters. PDF readers who don’t open DS Heroes mid-session need Ghostwire procedures in original words (remap tables stay; no MCDM paste).

### B. Wire chapter lock

`21` is the shared Matrix spine Hackers / Technomancers / any Overlay hero depend on. Must scrub orphan **wired-direct ×1**, confirm Trace Alert middle-result defaults, and mark chapter **RAW-locked** before PDF. Build-plan Stage 4 status should flip when TOC + Wire polish land.

### C. Economy / downtime holes class text already assumes

| Missing piece | Who points at it | Blocker severity |
|---|---|---|
| **Lifestyle** table (burn / upkeep / Medic restock quotes) | `08`, Medic restock lock, Wrench lifestyle hook | **High** — needs a short NEW section or chapter |
| **Followers & Contacts** | Elementalist / class pointers | Medium — can ship v1 with “Director / DS by reference” stub |
| **Downtime Projects** beyond §Craft / Rituals | Chargen & downtime loop | Medium — fold into Lifestyle or Kits chapter |
| Chrome **implant ¥ + Availability** catalog | `09` | High for chrome-forward tables |
| Vehicle **ramming / chase** print procedure | `23`, Wrench Ram | Medium |
| **Buildings** shared inventory | `23` stub | Low for v1 (Wrench-only OK) |

### D. Class residual debt (does not block TOC; blocks “locked” stamps)

Pass A–C + §C3 removed the structural contradictions. Remaining: provisional Kit lines, Elementalist 7/9/11 provisional tags, Wrench estimate heritage, B42 chapter flags, Rank 2+ summon **strikes** deferred. TOC can lock while these stay Partial.

### E. Director thinness

`25-opposition` is doctrine-only. Core book needs either (1) keep thin + point to Foundry bestiary / DS monsters, or (2) add a short “building a street fight” procedure. Full bestiary prose = **non-goal**.

### F. Explicitly not blocking TOC

- Veil rituals + §C3 Stamina/bind — **already locked**
- Languages lore gazetteer
- Wilds / Incursion deep lore
- ART-STYLE / art plates
- Foundry UI manuals

---

## 3. Recommended book TOC (lockable)

Print structure. File map = existing `docs/raw/` unless marked **NEW**.

### Part I — Core Rules

| Ch | Title | Source |
|---|---|---|
| 0 | Front Matter, License, Glossary | `00-front-matter.md` |
| 1 | How to Play | `01-how-to-play.md` |
| 2 | Heroes & Characteristics | `02-heroes-characteristics.md` |
| 3 | Tests & Power Rolls | `03-tests-power-rolls.md` |
| 4 | Combat | `04-combat.md` |
| 5 | Advancement & Echelons | `24-advancement.md` *(move earlier in print order; keep filename or rename later)* |

### Part II — Peoples & Making a Hero

| Ch | Title | Source |
|---|---|---|
| 6 | Ancestries (The Peoples) | `05-ancestries.md` |
| 7 | Backgrounds & Professions | `06-backgrounds-professions.md` |
| 8 | Languages | `07-languages.md` |
| 9 | Kits, Gear & Wealth (¥) | `08-kits-gear-wealth.md` *(absorb minimal Lifestyle § here OR Ch 10)* |
| 10 | Lifestyle & Downtime | **NEW** (short) — burn, Medic restock quotes, §Craft pointer, Ritual pointer |
| 11 | Chrome & Body Integrity | `09-chrome-body-integrity.md` |
| 12 | Mods | `10-mods.md` |
| 13 | Perks | `11-perks.md` |

### Part III — Classes

| Ch | Title | Source |
|---|---|---|
| 14 | Operator | `12-operator.md` |
| 15 | Scout | `13-scout.md` |
| 16 | Commander | `14-commander.md` |
| 17 | Medic | `15-medic.md` |
| 18 | Wrench | `16-wrench.md` |
| 19 | Elementalist | `17-elementalist.md` |
| 20 | Street Priest | `18-street-priest.md` |
| 21 | Hacker | `19-hacker.md` |
| 22 | Technomancer | `20-technomancer.md` |

### Part IV — Systems

| Ch | Title | Source |
|---|---|---|
| 23 | The Wire | `21-the-wire.md` |
| 24 | The Veil | `22-the-veil.md` |
| 25 | Machines (Drones & Vehicles) | `23-machines.md` — Buildings remain Wrench stub for v1 |

### Part V — Directors

| Ch | Title | Source |
|---|---|---|
| 26 | Opposition | `25-opposition.md` (expand procedure, not lore bestiary) |
| 27 | Running Ossian Reach (pointer) | **NEW** thin — points to Reach Handbook / Wired Flats Journals; **no lore reprint** |

**Optional fold (if Michael wants fewer NEW files):** skip print Ch 10 and Ch 27; put a **Lifestyle** subsection into `08` and a one-page Reach pointer into `00-front-matter` or `25`. TOC still locks the same content.

**Numbering note:** Keep `docs/raw/` filenames stable for Journals (`raw-to-journals.mjs`). Print TOC order may differ from file numbers (Advancement before ancestries is intentional).

---

## 4. Suggested draft order after TOC lock (first 5)

Write/fill these next — **TOC locked; bodies in this order**:

| # | Target | Why first |
|---|---|---|
| 1 | `01-how-to-play.md` | Stage 3 spine; sets table modes (legwork / run / downtime) |
| 2 | `03-tests-power-rolls.md` | Power Roll terminology must be print-iron for every later chapter |
| 3 | `04-combat.md` | Shared combat + GW keywords/resources before class polish |
| 4 | `21-the-wire.md` polish → RAW-lock | Shared Matrix spine; unblock Hacker/Technomancer PDF confidence |
| 5 | **NEW Lifestyle & Downtime** (or `08` Lifestyle §) | Unblocks Medic restock, economy burn, downtime loop |

**Immediate follow-ons (6–10):** `09` implant price pass → `08` Kit provisional lock pass → `25` opposition procedure expand → `23` ramming one-pager → class flag sweeps (Operator → Wrench).

**Do not start:** Wilds lore, Rank 2+ strike ladders, language gazetteer, full buildings catalog.

---

## 5. Explicit non-goals for v1 PDF

| Non-goal | Rationale |
|---|---|
| Wilds / Outer Wall deep lore; Pandora-like Incursion expansion | Setting backlog; Reach Handbook + encounter tables cover street play |
| Rank **2+ / Greater / R5 summon strike** ladders; Veil **defense stamps** | Explicitly deferred from §C3 (B60) |
| Full language **lore** gazetteer | Rules names only in RAW (`07`) |
| Full printable **bestiary** / threat fiction | Foundry bestiary + DS by reference; `25` stays procedure |
| **Buildings** shared inventory | Stub OK; Wrench owns Building Stat Card |
| Followers & Contacts full chapter | Stub/pointer acceptable for v1 |
| ART-STYLE plates / art direction in the PDF body | Separate brief; no art in RAW |
| Foundry UI manuals (Wired Console, minimap, etc.) | Directors/Foundry docs, not core book |
| Ashenreach gazetteer depth | Geography lock exists; not core rules |
| Reprinting *Draw Steel: Heroes* prose | Creator License + by-reference engine chapters only |
| Old **tier ladder** anywhere in player text | Levels + Echelon + Availability + Node Rating only |

---

## 6. Lock checklist (Michael)

**TOC LOCKED 2026-09-18** — recommended package (5 parts; NEW Lifestyle chapter; NEW Reach pointer). Michael skipped the picker; this is the working lock.

Remaining after lock:

1. Flip Track A rows in `FOUNDRY-BUILD-PLAN.md` / `STATUS.md` as Stage 3 fills land.
2. Draft order #1–5; mark chapters `RAW status: locked` only after fill + Michael skim.
3. **Regenerate journals after Michael reviews HTP** (do not auto-regen on this bump).
4. PDF pipeline only after spine + Wire + Lifestyle exist.

**Out of scope for this proposal doc:** PDF CSS, art, Foundry pack edits.
