# Ghostwire Core Rulebook — Stage 1 Skeleton

**Status:** Awaiting Michael review  
**Date:** 2026-09-16  
**Goal:** Lock book structure and authority rules before drafting class chapters.

---

## Purpose of Stage 1

Agree on:

1. What this rulebook is (and is not)
2. Which sources win when they conflict
3. Chapter order for the rebuild
4. What counts as a Draw Steel reskin vs a Ghostwire-only rule

No full chapter prose in this stage. No PDF export yet. No Foundry compendium content yet.

---

## Authority stack (when sources conflict)

| Priority | Source | Use for |
|---|---|---|
| 1 | Development Master **Part 1** (class docs) | Class chassis, resources, subclasses, ability ladders |
| 2 | Draw Steel core (Heroes / official DS rules + `draw-steel` system intent) | Shared engine: characteristics, Power Rolls, combat loop, surges, conditions, kits pattern |
| 3 | Ghostwire Design Rulings locked inside the masters | Attribute labels, cost ladder 1/3/5/7/9/11, chrome-positive vs Veil rules, etc. |
| 4 | Ghostwire PDFs (Core / Lore / Ossian Reach) | **Lore + art only** — discard outdated rules text |
| 5 | Old Foundry dumps / deploy scripts | **Do not use** (greenfield restart) |

**Doctrine:** Reskin Draw Steel wherever possible. Invent new rules only where Ghostwire forces it (especially **The Wire**, chrome / Body Integrity depth, and Veil systems required by caster classes).

---

## Proposed volumes

### Book One — The World *(light pass later)*

Deferred until rules chapters stabilize. Harvest lore/art from existing Ghostwire PDFs in Stage 5. Treat current lore as first draft.

Suggested parts (from existing lore source, not final):

- Cosmology & the Great Conflict
- The World & Its Structure (Ossian Reach)
- Peoples of the World
- Powers, Factions & Life (Ten Conglomerates, street)
- Time, Theme & Tone

### Book Two — The Rules *(primary rebuild)*

This is the workhorse for Stages 2–4 and 6.

---

## Book Two — chapter outline

### A. Shared core (Draw Steel reskin)

| Ch | Title | Type | Notes |
|---|---|---|---|
| 1 | How to Play / The Director | DS reskin | Table roles; Ghostwire terms (Director, Edgerunner, ¥) |
| 2 | Heroes & Characteristics | DS reskin | Five traits: Physique (Might), Reflex (Agility), Logic (Reason), Instinct (Intuition), Persona (Presence) |
| 3 | Tests, Power Rolls & Heroes’ Fortune | DS reskin | Keep DS math; rename flavor only where needed |
| 4 | Combat basics | DS reskin | Turns, actions/maneuvers, stamina, recoveries, conditions, surges (define once, glossary) |
| 5 | Kits, gear & wealth | DS reskin + GW | Kits as DS; nuyen (¥); Availability bands |
| 6 | Chrome & Body Integrity | **GW-new / expand** | Required by Operator/Hacker/Medic chrome doctrine; keep as thin as possible |

### B. Class chapters (from Development Masters)

| Ch | Class | DS spine | Notes |
|---|---|---|---|
| 7 | Operator | Heroes martial / live master | Cleanest martial; good first draft chapter |
| 8 | Scout | Shadow | Mundane tech reskin; no magic |
| 9 | Commander / Face | Tactician | Dual combat/social Mark |
| 10 | Medic | Troubadour | Reagents persist across encounters — GW-specific resource rule |
| 11 | Elementalist | Elementalist | Essence + Veil hooks; Cyborg exclusion |
| 12 | Wrench | Talent | Uptime; Drone/Vehicle/Building machine sub-system (street class) |
| 13 | Street Priest | Conduit | Conviction + Light/Dark pact; Cyborg-barred; Veil-dependent |
| 14 | Hacker | Custom / Wired-heavy | Depends on Wire chapter; draft after Wire or with forward refs |

**Full v1 class roster (8):** Operator, Scout, Commander/Face, Medic, Elementalist, Wrench, Street Priest, Hacker.

**Recommended draft order for Stage 2:** Operator → Scout → Commander/Face → Medic → Wrench → Elementalist → Street Priest → Hacker (Hacker last; Wire chapter first or interleaved).

### C. Ghostwire-only systems

| Ch | Title | Type | Notes |
|---|---|---|---|
| 15 | The Wire (Matrix) | **GW-new** | Nodes, Overlay / Jacked In, Trace Alert, Track 1/2 — required by Hacker; keep numbers tied to Hacker master |
| 16 | The Veil | **GW-new (minimal)** | Only what Elementalist and Street Priest need; don’t build a second magic encyclopedia early |
| 17 | Machines (drones / vehicles / buildings) | **GW-new (lean)** | Stat cards + slots for Wrench; mod SKU catalog deferred |
| 18 | Advancement & echelons | DS reskin | Levels 1–10 primary; Echelon as gear/kit band only if masters require |

### D. Director tools *(later)*

| Ch | Title | Notes |
|---|---|---|
| 19 | Running Ghostwire | Tone, payouts, contacts — after classes playtest |
| 20 | Opposition / Malice | Align to DS Director tools where possible |

---

## Stage gates (review after each)

1. **Skeleton** ← you are here  
2. **Class chapters** — one class at a time from Master Part 1; pause for sign-off  
3. **Shared core chapters** — DS-aligned engine text  
4. **Wire + Veil (minimal)** — only forced systems  
5. **Lore/art harvest** — world prose + PDF art into layout source  
6. **Full DS alignment pass** — every intentional divergence flagged  

---

## Non-goals for Stage 1

- Full ability text paste from masters  
- Foundry `lang` / CSS / packs work (parallel track; does not block skeleton)  
- Final PDF layout  
- Playtest balancing of invented 9/11-cost Medic/Commander abilities (flag in Stage 2)

---

## Open questions for Michael

1. ~~Class roster~~ — **Resolved 2026-09-16:** Wrench (DS Talent) and Street Priest (DS Conduit) masters received; v1 roster is 8 classes.  
2. Confirm draft order: Operator first; Wrench before Elementalist/Priest; Hacker after Wire — OK?  
3. Attribute display convention locked as GW label + (DS name) everywhere in the book?  
4. For invented Medic/Commander/Priest high-tier abilities still marked “sign-off”: draft as **provisional** callouts, or hold those tiers empty until you approve?  
5. Wrench machine sub-system (Drone/Vehicle/Building cards) — own chapter after shared core, or appendix inside Wrench chapter for v1?

---

## PDF production note

Rebuild from editable markdown (or similar) chapter sources, then export PDF for review. Do not treat in-place editing of the old Core Sourcebook PDF as the workflow — its rules layer is obsolete.
