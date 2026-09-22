# Ritual Workings — Foundry smoke checklist (0.3.88)

**Ship:** Ritual Workings full card catalog + Ritual Formulas compendium + pregen grants.
**Automated:** `node tools/ritual-formulas-smoke.mjs` (source JSON, lang, RAW, kiosk presets, pregens) — passes before commit.
**This list:** the in-Foundry pass. Reload the world after updating to 0.3.88 (packs rebuilt with Foundry closed).

## 1. Compendium — Ritual Formulas

- [ ] **Ghostwire Gear** compendium → **General & Lifestyle** → **Ritual Formulas** folder is visible.
- [ ] It holds **46** Items named `Formula: …` (scroll, tome, or datachip icons), no broken-image icons.
- [ ] Item sheet header line reads *Echelon N · Restricted · Not sold — found (Components ¥…)*.
- [ ] No Ritual Formula appears on any kiosk shelf (open a Street Kiosk, check every preset).

## 2. Card text — Ward the Room / Seal the Flat / Data Ward

- [ ] **Formula: Ward the Room** opens with the full card: Payoff, Duration, Scope (Veil only; points to Data Ward), Combat translation, Study time 1 day, study goal 2, component table with **¥25 / ¥50 / ¥40**, **Components total ¥75 (Veil) / ¥40 (Wire-chalk skin)**, thin-place ash **¥ —**, Counter.
- [ ] **Formula: Seal the Flat** shows **Magnitude 2 · General · Ward**, Project goals **Study 4 / Sanctum 6 / Sealing 4**, component table **¥180 (Veil) / ¥150 (Wire-chalk skin)**, renewal ¥60, and the **Vessa** story walkthrough (8 steps).
- [ ] **Formula: Data Ward** shows **Technomancer only**, Magnitude 1–2 columns, **Components total ¥90 / ¥250**.
- [ ] The footer link *The Veil — Ritual Workings* opens the Rulebook journal.
- [ ] Every card says rituals never spend **Essence / Conviction / Resonance**; no "Mag" shorthand, no "Glyph Cage".

## 3. Rulebook — The Veil

- [ ] **Ghostwire Rulebook** → Ghostwire Systems → **The Veil** has pages: *Ritual Workings*, *Ritual Workings — Card Index*, *— General*, *— Elementalist*, *— Street Priest*, *— Technomancer (Wire-rites)*, then *§C3 Summon Entities*.
- [ ] The old *Sample rites (v1 catalog)* page is gone.
- [ ] Tables render (Magnitude, Study time, component tables with Magnitude columns).
- [ ] Card paragraphs are separate lines (Payoff / Duration / Scope / Combat translation not run together).

## 4. Pregens

- [ ] **Kaïs Vahn-Estal** (Elementalist) — inventory has **Formula: Ward the Room**; flag `draw-steel-ghostwire.ritual.learned = true`.
- [ ] **Vessa Corran-Dov** (Street Priest) — same.
- [ ] **Sabbat Vane** (Technomancer) — same.
- [ ] Their existing gear (weapons, Pocket Sec / Burner, fake SIN, trauma patch, rounds, focus, deck items) is still there.
- [ ] Drag a pregen into the world — the Formula comes along and opens with full card text.

## 5. Manuscript (Thursday PDF source)

- [ ] `node tools/assemble-manuscript.mjs` → `docs/manuscript/build/Ghostwire-Manuscript.md` (gitignored build output) contains the Ritual Workings chapter inside The Veil (search "Seal the Flat").
- [ ] PDF build (when run): `node tools/build-pdf.mjs` — not run for this ship.

## Regenerate

```
node tools/raw-to-journals.mjs
node tools/ritual-formulas-to-items.mjs
node tools/build-voidmark-index.mjs
node tools/assemble-manuscript.mjs
node tools/build-packs.mjs          # Foundry closed
node tools/ritual-formulas-smoke.mjs
```
