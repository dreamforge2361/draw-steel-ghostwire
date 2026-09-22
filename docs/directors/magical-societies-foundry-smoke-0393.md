# Magical societies + ¥250 pregens — Foundry smoke checklist (0.3.93)

**Ship:** the three locked magical societies as lore journals with symbols and HQ art, **¥250** starting money on every pregen, and **F4** — a pregen regen that is safe to re-run.
**Automated:** `node tools/pregen-regen-smoke.mjs` (portraits, Changer form art, class level, Taint, Ward the Room, loadouts, installed mods, kit identity, byte-for-byte round trip) — passes before commit. Also green: `journal-regen-smoke` art assertions, `linkify-smoke`, `twelve-conglomerates-smoke`, `pregen-level-gate-smoke`.
**This list:** the in-Foundry pass. **Packs were rebuilt** (`lore`, `pregens`) with Foundry closed — reload the world after updating to 0.3.93.

Two smokes (`journal-regen-smoke.mjs`, `taint-smoke.mjs`) still fail on a stale pinned-version assertion (`module.json is 0.3.24` / `0.3.58`). That failure predates this release and is unrelated to it — every other assertion in both files passes.

---

## 1. The Magical Societies folder exists

Compendium sidebar → **Ghostwire Lore**.

- [ ] A folder **Magical Societies** sits between **VOIDMARK & Accords** and **Twelve Conglomerates**.
- [ ] It holds exactly three journals: **The Measure Collegium**, **The Wickkeepers**, **The Ash Survey**.
- [ ] Folder and journal names render as words, not as `GHOSTWIRE.Lore.Folders.MagicalSocieties` — if you see the raw key, the lang file did not load.
- [ ] Open **Lore Index** (Setting Primer folder). Its table has a **Magical Societies** row linking all three journals, and each link opens the right journal.

## 2. The Measure Collegium — symbol and HQ art

- [ ] Open **The Measure Collegium**. The **Overview** page opens on the **True Measure** symbol — a brass caliper arch over a silver plumb bob, thin cyan datum line. It renders; no broken-image icon.
- [ ] Caption under it reads *The True Measure — Measure Collegium — Ghostwire AI (AI-generated)*.
- [ ] Pages, in order: Overview, Who they are, Membership, Senior Examiner Edda Marr, The symbol: the True Measure, Headquarters: Datum House, Spaces that matter, Access and pressure, Standing and liability, Director boundaries.
- [ ] **Headquarters: Datum House** carries the wide HQ plate (rain-wet concourse, cyan-lit workshop, amber classroom windows) **and** a **Read aloud** blockquote beginning *Rain ticks against the measuring plates…*.
- [ ] **Senior Examiner Edda Marr** names her as a **Corran Elementalist** and says plainly she is *not* the sole leader of the Collegium.
- [ ] **Standing and liability** says Metermen need Collegium certification but stay an extortion racket — the certification does not launder them.

## 3. The Wickkeepers

- [ ] Overview opens on the **Sheltered Wick** — amber flame, chipped lamp bowl, two hood strokes. Amber/charcoal only; **no** white halo and no cyan rim.
- [ ] **Local headquarters: the Last Kettle** shows the laundromat/night-kitchen plate and the **Read aloud** beginning *Amber steam clouds the kitchen window…*.
- [ ] **Tavi Sorn** is a **Pure Human** kitchen organizer with **no casting ability**, coordinating locally — not commanding the network.
- [ ] **Aid without a new church** still states no central authority can declare a member holy or grant Conviction.
- [ ] **Standing and liability** keeps Choirmother separate (not the founder), and keeps Mama / Brother Ash as optional connections.

## 4. The Ash Survey

- [ ] Overview opens on the **Held Fault** — survey stake through fractured ground, amber point, single cyan instrument light. Not a radiation or biohazard sign.
- [ ] **Field headquarters: the Cinder Yard** shows the freight-garage plate and the **Read aloud** beginning *Amber lamps catch rain running through the yard's grates…*.
- [ ] **Field Coordinator Daska Venn** is a **full-conversion Cyborg who cannot cast** — Arcane Severance still applies; she is not an exception.
- [ ] The last page, **Using all three together**, carries the *Price of a Safe Night* opener and explicitly states the Closed Hand and the other four proposed factions are **not** established.

## 5. Nothing was promoted to settled history

- [ ] Every hook, escalation ladder and job seed sits under a **Director boundaries** page (or is labelled *optional* / *job seed* / *location secret*).
- [ ] No journal assigns a price, ward strength, skill bonus, automatic sanctuary or new magic rule. These are lore, not rules.
- [ ] No journal claims a fourth source of magic or a second cosmic power.

## 6. Right-click art check (optional)

- [ ] Right-click either image → the path is `modules/draw-steel-ghostwire/assets/factions/magical-societies/…`, **not** a `docs/` path and not a Dropbox-local file.

---

## 7. Every pregen walks in with ¥250

Compendium → **Ghostwire Pregens**. There are **seven** heroes, not eight.

- [ ] Open each of the seven and check the Biography tab — **Wealth / ¥ reads 250**:
  - [ ] Vessa Corran-Dov — the Preacher of Ninth
  - [ ] Kaïs Vahn-Estal — the Static Saint
  - [ ] Barak Voss-Hallor — the Foreman
  - [ ] Wren Sable-Corvin — the Kite
  - [ ] Sabbat Vane — the Dead Frequency
  - [ ] Vira Kellis-Nade — the Warren-Wire
  - [ ] Kessic Draye — Null
- [ ] Import one to the sidebar, open the **Gear kiosk**, and buy something cheap. The purchase succeeds and ¥ drops by exactly the price — wealth is a spendable balance here, not a Draw Steel wealth tier.
- [ ] Renown is still **1** on every hero (¥250 changed wealth only).

## 8. F4 — the regen is safe to re-run

This is the part that used to break sheets. With Foundry **closed**:

```
node tools/pregens-to-actors.mjs
node tools/pregen-regen-smoke.mjs
```

- [ ] `pregen-regen-smoke` ends with **all checks passed**, including *regen is a no-op* — the generator reproduces `src/packs/pregens/` byte for byte.
- [ ] `git status` after the regen shows **no** change under `src/packs/pregens/` and none in `lang/en.json`.

Then reload Foundry and confirm the regen kept what hand-patching used to hold:

- [ ] **Portraits:** all seven sheets show their art, not `mystery-man`. Prototype token art matches the portrait.
- [ ] **Changer form art:** Wren and Vira each carry human / hybrid / beast art (B50 `syncChangerFormArt` reads these flags).
- [ ] **Ward the Room is still learned** on the three casters — **Kaïs Vahn-Estal**, **Vessa Corran-Dov**, **Sabbat Vane**. Open the Formula: it is embedded *and* stamped learned, so the Ritual Working panel (0.3.91) lets them seal without re-studying.
- [ ] Heroes with no ritual in their loadout carry **no** Formula.
- [ ] **Taint 0** and an **empty Corruption History** on all seven (now from `post-patches.json`).
- [ ] **Vira's kit is Fabricator's Bench**, not Rigger's Harness.
- [ ] **Sabbat's Whiteout ×2** is still installed on his Wired Native slot.
- [ ] **Barak** has no *Command Persona / Fearful Awe*; **Wren** has no L3 *Careful Observation*.
- [ ] Every hero's class Item is **Level 1**.
- [ ] And ¥250 survived the regen on all seven.

---

## What this release does **not** touch

- No Rulebook 0.4.0 rewrite and no PDF rebuild — the societies are a canon supplement, not printed book text.
- No map placement: Datum House, the Last Kettle and the Cinder Yard have social layers (lower Grid / Flats / Flats–Sinks threshold) but **no exact atlas address** yet.
- No scene, token or actor for any society contact. Edda Marr, Tavi Sorn and Daska Venn are journal contacts only.
