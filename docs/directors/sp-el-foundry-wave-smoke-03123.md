# 0.3.123 — Foundry smoke checklist (Street Priest · Elementalist · fix wave)

Run in a world with the module enabled, on Foundry 14 / Draw Steel 1.1.2+.
Director note: `docs/directors/sp-el-foundry-wave-03123.md`.

Node smokes first — all four must be green before you open Foundry:

```
node tools/sp-el-foundry-wave-03123-smoke.mjs
node tools/pregen-regen-smoke.mjs
node tools/next-build-wave-03122-smoke.mjs
node tools/b117-console-verbs-smoke.mjs
```

**Everything below needs a live canvas and was not testable while Foundry was closed for the pack
rebuild.** The code is shipped and the Node-testable half is asserted in the smoke above; these are the
table checks.

---

## 1 · Street Priest — one free strike, and the pact picks it

Roll a **new** Street Priest through chargen.

- [ ] Choose **Light Pact** at Pact Alignment. At **Pact Strike**, only **Rebuke** is selectable; Drain is
      greyed out.
- [ ] Start over and choose **Dark Pact** → only **Drain** is selectable.
- [ ] The finished sheet has **exactly one** free strike. There is no *Smite / Rebuke* anywhere.
- [ ] **Class Signatures** granted Lay On Hands, Sense the Veil and **Blessed Light** with no choice.
- [ ] **Signature Abilities** offers five picks, and Blessed Light / Drain / Rebuke are **not** among them.
- [ ] Open **Vessa Corran-Dov** from the Pregens pack: Rebuke, Blessed Light, Lay On Hands,
      Sense the Veil, Holy Smite, Lightfall, Sacrificial Offer. **No Drain, no Smite / Rebuke.**
- [ ] **Rebuke** rolls 2 / 4 / 6 + Persona holy with the pull rider, and its Conviction spend text is on
      the card.

### Live pact swap (pre-0.3.123 worlds)

- [ ] In a world saved on 0.3.122, load with 0.3.123 → a priest carrying *Smite / Rebuke* has it removed
      and the right pact strike added, with a toast naming it. Console logs
      `pact free strike synced on N Street Priest(s)`.
- [ ] Delete a priest's pact feature and add the other one → the strike swaps.

## 2 · Blessed Light is a 20-foot light

Put Vessa on a **dark** scene with a token.

- [ ] Use **Blessed Light** from the sheet. The card posts with **no roll and no damage**, and her token
      lights a **20-foot** circle.
- [ ] Use it again → the light goes out and the token's *previous* light configuration is back (set a
      custom light on her token first, then check it survived the round trip).
- [ ] On a scene gridded in **feet**, the radius reads 20. On a Draw Steel **square** scene it is 4
      squares — the same distance.
- [ ] With her token **not** on the current scene → "no token on this scene" warning, nothing written.

## 3 · Holy Smite

- [ ] The 1-Conviction card is named **Holy Smite** (not Minor Rebuke) on the sheet and in the classes
      compendium.
- [ ] It costs **1 Conviction**, is a ranged main action, and deals **3 / 5 / 8 + Persona**.
- [ ] Side by side with Rebuke: Holy Smite is bigger at every tier.

## 4 · Elementalist — Cantrip

Open **Kaïs Vahn-Estal**.

- [ ] **Cantrip** is on his sheet, alongside Hurl Element, Elemental Shaping and Read the Weave.
- [ ] Use it → a dialog offers **Light** and **Other utility** plus a description box.
- [ ] **Light** → the same 20-foot glow as Blessed Light. Cast again → it goes out.
- [ ] **Other utility** with text → the description is posted to chat under the ability card, with the
      "Director's call" hint. **Nothing mechanical is applied.**
- [ ] **Other utility** with an empty box → nothing is posted.
- [ ] Close the dialog → nothing happens at all.
- [ ] Roll a new Elementalist: the L1 **Signature Abilities** grant hands over **four** abilities.

## 5 · C1 — Wearing armor fills Stamina

- [ ] Take a hero to **half** Stamina. Right-click an armor row → **Wear**. Current Stamina jumps to the
      new **max**, and the Stamina tooltip lists the worn armor as a source.
- [ ] Wear a **second** suit → the first comes off, and current Stamina is the new max again.
- [ ] **Remove** the worn suit: if max drops below current, current clamps down to it. If it does not,
      current is **unchanged** — removing armor must never heal.
- [ ] Buy armor onto a hero wearing none → it is worn automatically and Stamina fills.

## 6 · C2 — Trauma Patch

Give a hero a **Trauma Patch** (×2) and spend some Recoveries.

- [ ] A **Use Trauma Patch** maneuver appears on the sheet.
- [ ] Start a combat. Use it → **Recoveries go up by 1**, quantity drops to 1, and the chat line says
      which Recovery came back.
- [ ] Use it again **in the same combat** → refused with "already been used this combat", **no card
      posted**, quantity unchanged.
- [ ] End the combat, start a new one → it works again.
- [ ] Out of combat → it works with no gate.
- [ ] At **full** Recoveries → the patch is still consumed and nothing is gained (that is the cost of
      using it early).

## 7 · C3 — Own hero first in Connections

- [ ] As a **player** with an assigned hero, open the Wired Console on a scene with the whole crew.
      Your own hero is the **first** row in Connections, tagged **(you)**.
- [ ] Revealed nodes come next, then everyone else A–Z, as before.
- [ ] As **GM with no assigned character** → nothing is pinned; the list is the old order.

## 8 · C4 / C5 — Sprites

Open a Technomancer (Kessic) on a scene.

- [ ] **Use the Compile Sprite card** from the sheet → the archetype picker opens and a sprite token
      lands beside the caster. Not just a roll.
- [ ] The congregation counter on the Compile Sprite item sheet went up.
- [ ] Turn off **Compile sprites when the card is used** in module settings → using the card only rolls.
      Turn it back on.
- [ ] **Recompile** with a sprite standing → the dialog offers **Reshape**; pick a different archetype →
      the sprite is replaced in the same square at **full** Stamina.
- [ ] Take a sprite to **0 Stamina** → it is destroyed and decompiles. Immediately use **Recompile** →
      **Rebuild** is offered; the sprite comes back **where it fell** at **half** Stamina.
- [ ] End the combat → Recompile no longer offers the rebuild.
- [ ] With nothing compiled and nothing destroyed → "nothing to reshape and nothing to rebuild".
