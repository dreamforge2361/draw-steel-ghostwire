# Spike B75 — Thin print-chapter fill (Mods + Languages)

**Status:** Done 2026-09-19  
**Bump:** module **0.3.4** (from 0.3.3 / B74, SHA `91e00a3`)  
**Journals:** **not** regenerated (manuscript hold; deferred until pre-PDF)

## Goal

Thicken remaining **thin** print-TOC chapters that are safe to expand without inventing locked-out content, before Michael’s cover-to-cover read.

Priority: **Mods** (Complete lock — procedure only) and **Languages** (chargen/play, no gazetteer). Scan for any other print-TOC chapter still under ~1,200 words that is not deliberately deferred.

## Assemble

```bash
node tools/assemble-manuscript.mjs
```

| Pass | Result |
|---|---|
| Before fills (main / 0.3.3) | Parts **7** · files included **34** · missing placeholders **0** |
| After fills (this spike) | Parts **7** · files included **34** · missing placeholders **0** |

Output path (gitignored): `docs/manuscript/build/Ghostwire-Manuscript.md`.

Word counts use the same whitespace split as B73/B74 (`text.split()`).

| | Before (0.3.3 / B74) | After (B75) |
|---|---:|---:|
| Assembled words | 153,448 | **158,409** |
| `MISSING:` / missing-file placeholders | 0 | 0 |
| `CONTENT TBD` | 0 | 0 |

## Inventory (before fills)

Print-TOC bodies under ~1,200 words (0.3.3 assemble):

| Print | File | Words | Action |
|---|---|---:|---|
| Ch 12 Mods | `docs/raw/10-mods.md` | **882** | **Fill** — procedure inside Complete lock |
| Ch 8 Languages | `docs/raw/07-languages.md` | **364** | **Fill** — chargen/play; no lore gazetteer |
| Title plate | `00-front/title-page.md` | 279 | **Leave** — B74 plate; artist TBD |
| Credits | `00-front/credits.md` | 521 | **Leave** — B74; no invented artists |
| How to Use This Book | `00-front/how-to-use-this-book.md` | 743 | **Leave** — B74 print-only how-to |

Next-lowest **rules** chapters were already over the line (Ch 0 front matter 1,640; Ch 7 Backgrounds 1,557; Ch 5 Advancement 1,853). No other print-TOC rules chapter was still under ~1,200.

## What we filled

Ghostwire-original procedure. No *Draw Steel: Heroes* paste. No unpublished armor/gadget SKU ladders. No per-language lore. No chrome package / Salvage / Frame Module ¥. No Rank 2+ summon strikes. No journal regen.

### 1. Print Ch 12 — Mods (`docs/raw/10-mods.md`)

Kept every Complete lock: ¥ cost, Kit stack on different numbers, §Craft = Project not a skill, field toggle vs downtime install, slot integrity, firewall, Invent a Mod (v1), chargen never auto-grants.

Added:

- Layer table (Kit / host / mod / chrome).
- **When to mod** / when not to.
- **Table procedure:** acquire → host checks → §Craft outcome bands for routine published installs → field toggle → after-bench.
- **Kits vs chrome vs Wire** conflict (Smartlink handshake; Implant Weapon is chrome; suites/payloads pointer to `21`).
- Harvested **§3G** weapon-mod table and **§5F** vehicle/drone-mod table from the Gear master (published rows only).
- Armor / gadget families still **unpublished**; slot integrity → 0 slots in play.
- **In Foundry** sidebar: Install onto… / Uninstall / Activate / Load magazine (Craft) — shipped B20c/B20d/B51 only.

### 2. Print Ch 8 — Languages (`docs/raw/07-languages.md`)

Kept Trade Cant, machine-translation lock, knowledge-only list, seven-category name table, 42-key remap-by-reference.

Added:

- How language **checks** work (not a skill; when not to roll; characteristic + skill table; translator / knowledge-only outcomes).
- **Chargen step 6** procedure. Honest lock: Backgrounds / Peoples do **not** auto-grant yet (languages-master follow-up).
- Category **function** table (access doors, not history).
- Knowledge-only lock table harvested from the master.
- Director guidance + existing class/perk pointers (Keep It Down, Voice, Beast Form, Polyglot, Wire Whisper).
- **In Foundry** sidebar: language picker shows Ghostwire names; no translator UI.
- Explicit non-goal: lore gazetteer = **backlog #67** with Michael.

### 3. Optional — Followers & Contacts pointer (`docs/raw/26-lifestyle-downtime.md`)

Sources existed (gear **1G** Fixer Retainer; `06` “who still has your number?”; class contact features; §F3 hireling +1 slot). Expanded the stub into a v1 **pointer**: contact vs hireling vs follower, harvested ¥6,000 service, no invented standing ladder. **Full chapter still a v1 non-goal.**

## Word counts (filled chapters)

| Chapter | Before | After | Δ |
|---|---:|---:|---:|
| Ch 12 Mods | 882 | **3,477** | +2,595 |
| Ch 8 Languages | 364 | **2,408** | +2,044 |
| Ch 10 Lifestyle (Contacts pointer) | 1,921 | **2,243** | +322 |
| Title plate (version stamp only) | 279 | 279 | 0 |
| Assembled manuscript | 153,448 | **158,409** | +4,961 |

## Left alone (and why)

| Item | Words / state | Why it stays thin / untouched |
|---|---|---|
| Title / credits / how-to-use plates | 279 / 521 / 743 | B74 print plates; cover **artist names** still Michael TBD. Not rules holes. |
| Language **lore gazetteer** | — | Explicit RAW/PDF v1 non-goal; backlog **#67** with Michael. |
| Armor / gadget **mod families** | unpublished | Complete lock: do not invent SKU ladders. Slot integrity → 0. |
| L2 Peoples vs L1 depth | 3,781 vs 33,027 | Harvest-complete (B65); inventing prose fights as-is lore policy. |
| Followers & Contacts **full chapter** | pointer only | TOC-PROPOSAL v1 non-goal. Pointer polished; no new chapter file. |
| Rank 2+ / Greater summon **strike** ladders | deferred §C3 | Do not invent. |
| Chrome package / Salvage / Frame Module **¥** | B71 provisional | Do not invent ladders. |
| Buildings shared inventory / ramming one-pager | TOC follow-on | Wrench stub OK for v1. |
| Journal regen + Pandoc/PDF CSS | held | Until pre-PDF / Michael HTP skim. |

## Checklist

- [x] Assemble before and after (34/0 both times)
- [x] Mods expanded inside Complete lock; no new armor/gadget families
- [x] Languages usable at chargen/play; no per-tongue lore
- [x] Other sub-1,200 print-TOC rules chapters: **none**
- [x] Contacts stub polished from existing sources only
- [x] 0 missing placeholders
- [x] No journal regen
- [x] module.json **0.3.4** (UTF-8 no BOM)
- [x] This spike

## Out of scope

Journal regen; Pandoc/PDF CSS; lore PDF re-harvest; Mods family catalogs; language gazetteer; printable bestiary; chrome package ¥; Rank 2+ strikes.
