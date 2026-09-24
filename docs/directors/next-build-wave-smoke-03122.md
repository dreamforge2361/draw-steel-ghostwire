# 0.3.122 — Foundry smoke checklist (next-build wave)

Run in a world with the module enabled, on Foundry 14 / Draw Steel 1.1.2+.
Director note: `docs/directors/next-build-wave-03122.md`.

Node smokes first — all four must be green before you open Foundry:

```
node tools/next-build-wave-03122-smoke.mjs
node tools/wire-state-toggle-smoke.mjs
node tools/f20-foundry-sights-smoke.mjs
node tools/pregen-regen-smoke.mjs
```

---

## 1 · Changer art pickers → Biography

Open **Wren Sable-Corvin** (or any Changer).

- [ ] **Stats** tab: the **Changer Forms** box still sits under Wired, with **Human / Hybrid / Beast**
      buttons and the active form highlighted.
- [ ] **Stats** tab: there are **no art thumbnails** in that box any more — just one dim line pointing
      at Biography.
- [ ] Stamina and the characteristics are visible **without scrolling** on a default-height sheet.
- [ ] **Biography** tab: a **Changer form art** fieldset at the bottom, with three columns
      (Human / Hybrid / Beast), each carrying a **Portrait** picker and a round **Token** picker.
- [ ] Click a form button on Stats → the sheet portrait and the canvas token swap (as before).
- [ ] With Beast active, change the Beast **Token** on Biography → the canvas token changes
      immediately; the sheet portrait does **not**.
- [ ] **Clear** on a Token leaves the Portrait alone, and vice versa.

## 2 · Director: +1 Heroic Resource

Import **Director: +1 Heroic Resource** from the Ghostwire Macros pack.

- [ ] Put **Barak** (Commander) on the canvas. **Target** his token, run the macro.
- [ ] His **Influence** goes up by exactly 1; a chat line and a toast say so by name.
- [ ] Surges and Victories are **unchanged**.
- [ ] Deselect / untarget everything and run it → "Target or select a hero token first."
- [ ] Select **two** heroes (no target) → both gain 1.
- [ ] Target a drone or an NPC → warning, no change, and any hero in the same selection still gains.
- [ ] As a **player** (not GM), run it → "Only the Director can hand out heroic resources."
- [ ] A level-0 hero with no class yet → graceful warning, no error in the console.

## 3 · Beast-Hide repick

On a Changer with **Beast-Hide**:

- [ ] **Features** tab → right-click the **Beast-Hide** row → a **Re-pick this choice** entry appears
      above Edit / Delete.
- [ ] Click it → Draw Steel's confirm, then its **own** immunity chooser with all six types
      (acid, cold, corruption, fire, lightning, poison).
- [ ] Pick a different one → the old immunity effect is gone from the Effects tab and the new one is
      there, at the right level value.
- [ ] Right-click **Layered Hide** (if the hero has it) → the same entry, the same chooser.
- [ ] Right-click a **Kit** or an **ability** → **no** Re-pick entry (nothing to re-pick).
- [ ] Open Beast-Hide from the **compendium** (not on an actor) → no Re-pick entry.

## 4 · Wire State — the Disconnect rung

On a hero with a deck / jack (a Connect interface):

- [ ] Token HUD → the Wire-state button → the picker now lists **four** rungs:
      **Disconnected**, Linked, Overlay, Jumped In.
- [ ] From **Linked**, pick **Disconnected** → all Wired statuses clear, the sheet chip reads
      Disconnected, and a chat card / toast announces it.
- [ ] From **Jumped In**, pick **Disconnected** → the pilot leaves the seat *first*
      (meat-inert gone, `jumpedInto` cleared) and lands off-net. The machine is not left holding a pilot.
- [ ] From **Disconnected**, pick **Linked** → works, because the hero has an interface.
- [ ] On a hero with **no** interface, from Disconnected pick Linked → refused, and the warning names
      the missing interface.
- [ ] From Disconnected with no drone, pick **Jumped In** → still refused in Jump-In's own words.
- [ ] Picking the rung you are already on → nothing happens (no re-stamped meat-inert).

## 5 · Cycle Wire State macro

Import **Cycle Wire State**.

- [ ] Select one hero **with** an interface and a fielded drone. Run the macro four times:
      Disconnected → Linked → Overlay → Jumped In → Disconnected.
- [ ] At Jumped In, the meat body is inert and the pilot is in the seat.
- [ ] The fourth run leaves the seat cleanly and ends off-net.
- [ ] Select **two** heroes, one with a drone and one without. Run once → the Rigger takes the seat,
      the other is refused with a toast, and the Rigger still moved.
- [ ] Select a non-hero token → a warning, no error.

## 6 · Stamina tooltip

On a **locked / play-mode** Hero sheet:

- [ ] Hover the **Stamina** pool → a tooltip headed `Max Stamina <n>`.
- [ ] It lists **Class**, **Kit**, and any traits contributing Stamina, each with a number.
- [ ] After wearing armor (below), **Worn armor: <name> +N** appears in the list.
- [ ] The numbers add up to the printed max; anything unexplained appears as **Other effects**.
- [ ] Take the armor off → the armor row disappears and the total drops to match the sheet.

## 7 · Changer Darksight 30

- [ ] Open a Changer and confirm the **Darksight** trait is on the Features tab.
- [ ] Its card prints **Darkvision 30 squares** in an "On the canvas" block.
- [ ] Drop the Changer on a **dark** scene with global illumination off → they see 30 squares of
      otherwise-unlit floor, and walls still block.
- [ ] Right-click the token → **Configure** → **Vision** → detection mode **Basic Sight** at range 30,
      vision mode **Darkvision**.
- [ ] A **non**-Changer hero on the same scene sees nothing extra.
- [ ] Build a **new** Changer through chargen → Darksight arrives with the ancestry, no picking.

## 8 · Trade Cant free

- [ ] Create a **brand-new** hero → Biography tab → **Trade Cant** is already in Languages.
- [ ] An existing world hero has it after one reload.
- [ ] Open the **Chargen Wizard** → Languages step → Trade Cant is listed, marked **(free)**, and its
      ✕ is greyed out.
- [ ] The budget line counts **only** the picked languages — Trade Cant is not one of them.
- [ ] Spend the budget, then try to add one more → refused, as before.
- [ ] **Start over** on the Languages step → the picks clear, Trade Cant stays.
- [ ] Duplicate a hero who already speaks five languages → all five survive, plus Trade Cant.

## 9 · Machine conditions

Deploy a drone and open its **Machine sheet**, **Combat** tab.

- [ ] At full Integrity: `Condition: Operational (100% Integrity)`.
- [ ] Set Integrity to exactly **half** → `On Fire / Leaking`, and the token picks up the status icon.
- [ ] Drop to exactly **a quarter** → `Crippled`, and the On Fire status is **gone** (one band only).
- [ ] Drop to **0** → `Systems Down`, and Crippled is gone.
- [ ] Heal back above half → every condition clears.
- [ ] An undeployed / unrated frame (max 0) reads **Unrated**, not Systems Down.
- [ ] No **Stalled** or **Dead-stick** status appears anywhere — out of scope for this ship.

## 10 · Rat Beast token 0.5

On a **Rat**-lineage Changer (Vira):

- [ ] Note the token's current size on the canvas.
- [ ] Click **Beast** on the Stats tab → the token shrinks to **0.5 × 0.5**.
- [ ] Click **Human** → it returns to the size it was, not a forced 1×1.
- [ ] Click **Hybrid** → also normal size.
- [ ] Do the same on a **Wolf** or **Raven** Changer → the token size **never** changes.
- [ ] Set a Rat Changer's prototype token to 2×2, then Beast → 0.5, then Human → back to **2×2**.

## 11 · Advanced Tactics costs 1 Influence

- [ ] Open **Barak** → **Advanced Tactics** shows a cost of **1** Influence on the card.
- [ ] In combat with **0** Influence, try to use it → refused with the not-enough-resource warning.
- [ ] With 1+ Influence → it fires and spends 1.
- [ ] The compendium copy in **Ghostwire Classes** agrees.

## 12 · Worn armor Stamina

On a hero with a kit, note their current **max Stamina**.

- [ ] Drag an **Armored Jacket** onto the sheet → max Stamina rises by the echelon-1 band (**+4**),
      and the item reads as worn.
- [ ] The **kit's** Stamina contribution is still there (check the tooltip from §6 — both rows show).
- [ ] Drag a **Hardshell** on as well → max Stamina reflects **only one** armor. Two armor bonuses are
      never summed.
- [ ] Right-click the Hardshell → **Wear this armor** → it becomes the worn one, the Jacket's band
      switches off, and the total moves to the Hardshell's band.
- [ ] Right-click it → **Take off this armor** → max Stamina drops back; the kit bonus survives.
- [ ] Level the hero into **echelon 2** → the band steps up automatically (+6 for the Jacket).
- [ ] Delete the worn armor entirely → max Stamina reverts, no orphan effect left on the Effects tab.
- [ ] Open the armor in the **compendium** → its effects are still all **disabled** there.
- [ ] A **shield** competes for the same slot as body armor (documented rule — flag it if Michael
      wants shields to stack).

---

## Regression sweep

- [ ] The Wired Console's Connect / Jack Out / Toggle verbs behave exactly as before.
- [ ] Jump-In and Jump-Out from the Machine sheet are unchanged.
- [ ] Taint +1, Pay Hero and Spend Hero macros still work.
- [ ] The Chargen Wizard opens and completes end to end.
- [ ] No console errors on world load.
