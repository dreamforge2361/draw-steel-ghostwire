# Chargen Wizard — Foundry checklist (0.3.101 / B95, I2)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/chargen-wizard-smoke.mjs
node tools/kit-grants-smoke.mjs
node tools/kiosk-smoke.mjs
node tools/voidmark-smoke.mjs
node tools/voidmark-audience-smoke.mjs
node tools/taint-smoke.mjs
```

All must pass (`chargen-wizard-smoke.mjs` runs **213** checks). Then open the world and walk the list below.

Pack rebuilt this pass (Foundry closed): `node tools/build-packs.mjs macros` — one new script macro.
Spike: `docs/spikes/B95-CHARGEN-WIZARD.md` · Log: `docs/directors/_claude-chargen-wizard-log.txt`.

Print source for every step: `docs/manuscript/04-back/29-chargen-cheat-sheet.md` (Appendix B).

---

## What shipped

| Line | Before | After |
|---|---|---|
| Building a runner in Foundry | Appendix B by hand, sheet + book | **13-step wizard** on the sheet header |
| Door | — | **Chargen** button in the Hero sheet header (players **and** Directors) |
| Also on | — | `game.ghostwire.openChargenWizard(actor)`, `module.api.openChargenWizard`, keybinding, **Ghostwire: Chargen Wizard** macro |
| Concept / lore help | VOIDMARK, separately | **Ask VOIDMARK** on step 1, prompt pre-loaded from the concept + picks so far |
| Characteristic array | typed by hand | **2, 2, 1, 1, 0** enforced; **Lean on the class cores** auto-spread |
| Early spends | kiosk / by hand | **in-wizard catalog** over gear / matrix / foci / vehicles, debiting `system.hero.wealth` |
| Chrome at chargen | a rule you had to remember | **structurally unavailable** — chrome + mods packs excluded, chrome-flag refused twice |
| Macros pack | 4 | **5** |

---

## The locks to check first

These are the three that would actually hurt if they slipped.

- [ ] **No chrome can be bought at chargen.** Step 12 → widen the Availability band to **Prototype**, clear the pack
      filter, and search for chrome you know exists (a **Wired Reflexes**, a **Datajack**, any implant). It must not
      appear. Body Integrity on the sheet stays **20/20** throughout the whole wizard.
- [ ] **The wizard never grants twice.** Walk a runner all the way to **Finish chargen**, then press the header
      **Chargen** button again. It reopens **read-only**: every Take button dead, a lock banner at the top naming the
      reason. Same for a hero you have levelled past 1.
- [ ] **A player hears runner material.** As a **player** (not the GM), press **Ask VOIDMARK** on step 1. VOIDMARK
      opens with the question typed but **not sent**, and the thread is still in **runner** mode. It must not flip to
      Director mode.

---

## Walkthrough — build one runner end to end

Create **Actor → Hero**. Open the sheet.

- [ ] **0 · The button.** A **Chargen** pill sits in the sheet **header**, near the runner's name — not in the tab
      strip, not over the Stats fields. Press it.
- [ ] The header of the wizard shows the portrait, **¥5,000**, **Taint 0**, and `1 / 13`.

### 1 · Concept
- [ ] Type a couple of lines. Press **Save to the sheet** → the sheet's biography carries it.
- [ ] Press **Ask VOIDMARK** → the chat opens with a chargen question loaded, referencing what you typed.
- [ ] **Skip for now** also marks the step done. It is optional; the rail shows it dashed.

### 2 · Name
- [ ] Type the runner's name, press **Set the name** (or Enter). The Actor renames, and the wizard header follows.

### 3 · People
- [ ] The picker lists the **Ghostwire Ancestries** — Pure Human, Corran, Elvani, Goliar, Changer, Revenant, Mutant,
      Cyborg. Press **Take** on one.
- [ ] The **stock advancement prompt opens**. Spend the People-point budget and confirm. The wizard re-reads the sheet
      and the row shows as chosen.
- [ ] **Changer:** the step warns until a lineage (Raven / Rat / Wolf) is on the sheet.
- [ ] **Cyborg:** the step says machine-first, and names the three classes Arcane Severance closes.

### 4 · Background + Profession
- [ ] Two pickers on one step. Take one of each; each opens its own prompt (fixed skill + choose 1, fixed skill +
      choose 2).

### 5 · Class
- [ ] Take a class. The **level-1 advancement chain** runs — subclass / doctrine / pact prompts are the sheet's own.
- [ ] After it, the step names the subclass, and every class row goes dead ("delete it on the sheet first").
- [ ] **On a Cyborg:** Elementalist, Street Priest and Technomancer rows are visibly closed *before* you click.

### 6 · Kit
- [ ] Take a Kit. **G1 fires by itself**: the street-band weapon / armour package lands on the sheet and a chat line
      announces it. The wizard did not do that — G1's hook did.
- [ ] The step lists the Kit and the count of Street-band weapons and armour on the sheet.
- [ ] A pure caster or deck-bound Hacker: press **No Kit is right for this runner** to finish the step.
- [ ] **Merc Operator:** two Kits, two packages, both granted. No duplicate SKUs.

### 7 · Skills
- [ ] Everything People / Background / Profession / class handed over is listed, **grouped**.
- [ ] Add a skill from the picker. Adding one already on the sheet is refused with the same-group hint.
- [ ] The step says out loud that ¥, chrome and Lifestyle never add a skill.

### 8 · Characteristics
- [ ] Five selects. The **Still unspent** line shrinks as you place numbers, and an illegal spread is not offerable —
      after two 2s, no third 2 is in any dropdown.
- [ ] **Lean on the class cores** drops the two 2s on the class's cores and 1, 1, 0 on the rest. Pressing it twice
      gives the same answer.
- [ ] The sheet's Stats tab agrees with what the wizard shows, live.

### 9 · Languages
- [ ] What the People / Background grants gave is listed under **Ghostwire names** (Trade Cant, Reach Metro, …) — no
      stock language names anywhere.
- [ ] Add and remove one. **That is the list** finishes the step when the grants already covered it.

### 10 · Resource + numbers
- [ ] Reads back heroic resource, Stamina, Recoveries, Speed, Stability from class + Kit.
- [ ] The no-double-count line about Kit Stamina is there. Press **Confirmed**.
- [ ] If a prompt wrote late, **Re-check** picks it up without closing the wizard.

### 11 · Body Integrity
- [ ] **20 / 20**, **Taint 0**, **Chrome installed 0**. The step is green.
- [ ] **Cyborg:** Body Integrity reads **N/A** and the step is still green.
- [ ] Deliberately break it (drop a chrome Item on the sheet) → the step goes amber and names the problem. Undo it.

### 12 · Early spends
- [ ] Defaults to the **Street** band. Search, pack filter and band ceiling all work.
- [ ] Buy something cheap. ¥ drops by exactly the price, on the sheet and in the wizard header; the Item lands in
      inventory; a notification names it.
- [ ] Something you cannot afford has a dead **Buy**.
- [ ] Buy a **Personal or Light air scout** (Tape-Eye, Rotor, …) → **Street Eye** appears on the sheet, granted by
      B94's own hook.
- [ ] Nothing here installs a mod or chrome. Nothing pre-pays Lifestyle.

### 13 · Done
- [ ] The checklist mirrors the Appendix B **Done-when** box, row for row, with **Spends** and **Portrait** marked
      optional.
- [ ] The summary reads the whole runner back: People, Background / Profession, Class (+ subclass), Kit,
      characteristics, skills, languages, Integrity, Taint, chrome, ¥ left.
- [ ] **Finish chargen** posts a short "on the street" card to chat, closes the wizard, and opens the sheet.
- [ ] The header button now reads as done, and reopening gives the read-only record.

---

## Regression watch

- [ ] **Taint (B80)** header readout is still where it was; the Chargen pill sits after it, not on top of it.
- [ ] **Body Integrity** and **Wired** fieldsets on Stats are untouched.
- [ ] The **kiosk** still buys and debits the same `system.hero.wealth` (`node tools/kiosk-smoke.mjs`, then buy
      something at a kiosk).
- [ ] **VOIDMARK** still opens normally from the scene control with an empty prompt box — the seed only arrives when
      the wizard sends one.
- [ ] Dropping a People / Class / Kit **onto the sheet directly** still works exactly as before. The wizard added a
      door; it did not replace one.

---

## Sign-off

| Check | Result |
|---|---|
| `node tools/chargen-wizard-smoke.mjs` (213) | |
| Three locks above | |
| Full 13-step walkthrough | |
| Regression watch | |

Michael: ____________________  Date: ____________
