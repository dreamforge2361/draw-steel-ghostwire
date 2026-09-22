# Constructs & Pets FAQ — smoke checklist (0.3.90)

**Ship:** S7 — player-facing action-economy FAQ for Agents / sprites / spirits / elementals, plus Voidmark seed.
**Nature of the ship:** **docs + journals only.** The FAQ restates locks already printed in `19`, `20`, `22` §C3, `17`, `18`, and `21`. **No new numbers, no rules change, no script change, no Actor change.**
**Generators run:** `node tools/raw-to-journals.mjs` · `node tools/build-voidmark-index.mjs` · `node tools/assemble-manuscript.mjs`.
**This list:** the in-Foundry pass. Rebuild packs with Foundry **closed** (`node tools/build-packs.mjs rulebook`), then reload the world.

## 1. Rulebook journal

- [ ] **Ghostwire Rulebook** → **Ghostwire Systems** → **Constructs & Pets — Action Economy FAQ** exists (7th entry in that folder, after *Lifestyle & Downtime*).
- [ ] It has **4 pages**: *Overview*, *What this chapter covers*, *FAQ — Sprites, Agents, and Spirits (action economy)*, *Director note*.
- [ ] The FAQ page shows **14 `###` question headings**, each with its answer under it.
- [ ] The band table (Minor / Intermediate / Advanced) renders as a **table**, not as run-together text.
- [ ] Journal name is the real title, not the raw lang key `GHOSTWIRE.Rulebook.Journals.ConstructsPetsFaq`.

## 2. Front matter index

- [ ] **Front Matter → Rulebook Index** lists **Constructs & Pets — Action Economy FAQ** in the *Ghostwire Systems* row.
- [ ] All **7** Ghostwire Systems links in that row are **clickable** and land on the right journal.
  *Note:* `raw-to-journals.mjs` now prints `maximum nesting of 10 spans reached!!!` when it builds this row — showdown's span counter trips on a 7-link table cell. Output was verified complete (all 7 `@UUID` links intact); the warning is cosmetic. If an 8th Systems chapter lands, re-verify this row before trusting it.

## 3. Cross-links from the class chapters

Each should render as an italic pointer with a working link to the FAQ journal:

- [ ] **Technomancer** → *The Sprite Congregation* page, under "Hybrid Band Grammar" — *"when does my sprite get a turn?" — see FAQ …*
- [ ] **Hacker** → Agents section, on the **Bands** line — *"when does my Agent get a turn?" — see FAQ …*
- [ ] **Street Priest** → *Invoke the Pact — Deep Dive* — *Extension form vs. independent form … see FAQ …*
- [ ] **Elementalist** → *Summon Elemental (the pet path)* — *Extension vs. independent turn order … see FAQ …*
- [ ] **The Veil** → *§C3 Summon Entities* — *Player-facing action-economy questions … see FAQ …*
- [ ] No cross-link renders as literal `@UUID[...]` text.

## 4. Voidmark retrieval

Ask Voidmark each of these; the FAQ chapter should be the cited source:

- [ ] "When does my sprite get a turn?" → minor acts on your turn / intermediate needs a maneuver / advanced every round.
- [ ] "Do I have to spend a maneuver to command my Agent?" → yes at levels 4–7; not at 8+.
- [ ] "How many sprites can I have out?" → 2 / 3 at 5th / 4 at 8th; Sprite-Weaver 3 from 1st.
- [ ] "What are my Agent's hit points?" → Stamina, archetype base + (Logic × Level).
- [ ] "Does my Street Priest spirit get its own turn?" → only on **high (17+)**, the independent form.
- [ ] "Can I compile an Agent while Linked?" → no; Overlay or Jacked In required.
- [ ] "Can I shoot an enemy sprite?" → not in meat-space; Lock A, Wired/EW only.
- [ ] Answers cite the FAQ, and do **not** contradict `19` / `20` / `22` §C3.

## 5. Print manuscript

- [ ] `docs/manuscript/build/Ghostwire-Manuscript.md` contains the FAQ as **Part VI — Appendix, ch30**.
- [ ] Assemble reports **missing placeholders: 0**.
- [ ] Locked print TOC chapters **1–29 are unchanged** — the FAQ was appended as 30 specifically so nothing renumbered.

## 6. Regression — nothing else moved

- [ ] Module version reads **0.3.90**.
- [ ] `node tools/ritual-learn-smoke.mjs` still passes (0.3.89 Mark Learned untouched).
- [ ] `node tools/voidmark-smoke.mjs` passes.
- [ ] Rulebook pack count went **29 → 30 journals**, **314 → 318 pages**, folders still **5**.
- [ ] No Actor, Item, or script changed in this ship.
