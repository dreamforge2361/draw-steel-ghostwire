# Ghostwire Core Rulebook — Stage 1 Skeleton

**Status:** Awaiting Michael review  
**Date:** 2026-09-16  
**Purpose:** Lock the rebuild plan before drafting class chapters or exporting PDF.

---

## Authority stack (conflict order)

1. **Class Development Master Part 1** — live system of record for class rules (Operator, Hacker, Scout, Elementalist, Medic, Commander/Face).
2. **Draw Steel core** (Heroes / official DS rules + stock `draw-steel` Foundry behavior) — default for anything not overridden by (1).
3. **Ghostwire-new systems** — only where DS has no equivalent and Ghostwire requires it (The Wire, chrome/Body Integrity, Veil bindings as needed by casters, setting economy flavor).
4. **Ghostwire PDFs** — lore and artwork harvest only. **PDF rules text is obsolete** and must not override (1)–(3).
5. **Old Foundry Ghostwire build / Part 2 implement guides** — discarded for implementation; may be mined for wording only if it matches (1).

---

## Rebuild doctrine

- Reskin Draw Steel wherever possible (names, fiction, chrome/tech flavor).
- Invent new rules only when a Development Master or the setting forces a gap (especially **The Wire**).
- Staged reviews: no stage advances without Michael sign-off.
- Deliverable format: editable markdown source → PDF export for review. Do not edit the old designed PDFs in place.

---

## Proposed volume structure

### Book One — The World (light pass later)
Deferred as first-draft lore. Harvest from lore markdown / Lore Book / Ossian Reach when Stage 5 runs. Not blocking Stage 2–4.

Suggested later chapters (not drafting now):
- Cosmology & Great Conflict
- Ossian Reach & the Ten
- Peoples
- Factions & life
- Theme & tone
- The Wired (setting fiction; mechanics live in Book Two)

### Book Two — The Rules (primary rebuild)

| Ch | Working title | Kind | Notes |
|----|---------------|------|--------|
| 0 | How to use this book / what’s Draw Steel here | Meta | Map DS terms ↔ Ghostwire labels |
| 1 | Heroes & characteristics | DS-reskin | Physique (Might), Reflex (Agility), Logic (Reason), Instinct (Intuition), Persona (Presence) |
| 2 | Power Rolls, edges, surges, conditions | DS-reskin | Shared glossary; surge defined once |
| 3 | Combat & downtime loop | DS-reskin | Victories, respites, heroic resources pattern |
| 4 | Kits, gear, nuyen | DS-reskin + GW | Kits as loadouts; ¥ not Wealth |
| 5 | Chrome & Body Integrity | Ghostwire-new | Catalog later; class chrome notes |
| 6 | The Wire | Ghostwire-new | Nodes, Overlay / Jacked In, Trace Alert, Track 1/2 — required by Hacker; keep lean until Hacker chapter |
| 7 | The Veil (minimal) | Ghostwire-new / light | Only what Elementalist (and later priest) need |
| 8 | Classes overview | Meta | Roster, cost ladder 1/3/5/7/9/11, levels 1–10 |
| 9 | Operator | Class master | First full class chapter |
| 10 | Scout | Class master | DS Shadow spine |
| 11 | Commander / Face | Class master | DS Tactician spine |
| 12 | Medic | Class master | DS Troubadour spine; Reagents exception |
| 13 | Elementalist | Class master | Essence / Channel; Veil touch |
| 14 | Hacker | Class master | Bandwidth + Wire; largest new-system dependency |
| 15 | Wrench / Street Priest | TBD | Pending Development Masters |
| 16 | Director tools | DS-reskin + GW | Malice / pressure hooks only as classes require |

---

## Class chapter order (Stage 2)

1. **Operator** — cleanest DS-shaped martial; Adrenaline loop is DS-familiar  
2. **Scout** — Shadow reskin; tech-only (no magic)  
3. **Commander / Face** — Tactician; dual Mark  
4. **Medic** — Troubadour; Reagents persist across encounters (flag as intentional DS divergence)  
5. **Elementalist** — caster; needs minimal Veil chapter first or inline  
6. **Hacker** — last of the six; depends on Wire chapter  

After each class chapter: **Michael review gate** (especially invented 9/11-cost and subclass tables already flagged in masters).

---

## Later stage gates

| Stage | Deliverable | Michael gate |
|-------|-------------|--------------|
| **1** (this doc) | Skeleton + authority + order | Approve / mark up |
| **2** | Class chapters one-by-one from masters | Sign-off per class |
| **3** | Shared core chapters (1–5, 8) DS-reskin | Approve core |
| **4** | Wire + minimal Veil | Approve new systems |
| **5** | Lore/art harvest into Book One | Light pass OK as draft |
| **6** | Full DS-alignment audit | List intentional divergences |

**Parallel track (Foundry):** module `draw-steel-ghostwire` — lang/style tokens and comps follow approved rules text; do not implement Foundry classes ahead of signed chapters.

---

## Non-goals for Stage 1

- No full class prose yet  
- No PDF export yet  
- No Foundry compendium content yet  
- No rewriting Book One lore yet  

---

## Open questions for Michael

1. Confirm class order above (or reorder).  
2. Are **Wrench** and **Street Priest** in the v1 rulebook roster? If yes, please attach their Development Masters before those chapters.  
3. Is **Technomancer** a class or only a setting role?  
4. For Medic/Commander invented 9/11-cost lists: sign-off **before** drafting those chapters, or draft as provisional and review in Stage 2 gates?  
5. Preferred export for review PDFs: simple typographic PDF from markdown, or match Ghostwire Core Sourcebook visual style later?

---

## Approval

- [ ] Stage 1 skeleton approved as-is  
- [ ] Stage 1 approved with markups (Michael notes below)

**Michael notes:**

_…
_
