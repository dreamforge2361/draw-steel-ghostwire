# Director Pay / Spend Hero — Foundry checklist (0.3.95 / F6)

Node smoke first, in the module folder with Foundry **closed**:

```
node tools/director-wealth-smoke.mjs
```

Must print `passed`. Then open the world and walk the list below.

Code: `scripts/director-wealth.mjs`, registered from `scripts/module.mjs`.
Macros: **Director: Pay Hero** (`gwDirPayHero0001`) and **Director: Spend Hero** (`gwDirSpendHero01`) in **Ghostwire Macros**.

---

## The rules this tool holds to

- One purse: `system.hero.wealth`, the same path the Gear kiosk debits. There is no second wealth track.
- Amounts are **integers ≥ 0**. A blank, negative or unreadable amount is 0, and 0 changes nothing.
- **Pay always credits.** **Spend refuses** when the hero cannot cover it — the Director is told and *nothing is written*, so ¥ never goes negative.
- **Director only.** Players get a notification and no write, whichever door they come through.

---

## In Foundry

### 1. The doors

- [ ] As GM, the **Token** scene-control palette shows two new buttons: **Director: Pay Hero** (hand-holding-coin) and **Director: Spend Hero** (bill-transfer).
- [ ] Select a hero token → its **Token HUD** right column has a **¥** button.
- [ ] **Ghostwire Macros** compendium holds **Director: Pay Hero** and **Director: Spend Hero**; drag both to the hotbar and they run.
- [ ] Log in as a **player** — neither scene-control button, nor the HUD ¥, is visible.
- [ ] As a player, run `game.ghostwire.directorPayHero({ actor: game.user.character, amount: 100 })` in the console: a warning, and the hero's ¥ is unchanged.

### 2. Pay

- [ ] Select (or target) one hero token. Press **Director: Pay Hero**.
- [ ] The dialog lists the hero and their current ¥, and offers **Direction** (pre-set to *Pay — credit the hero*), **Amount (¥)** and **Reason**.
- [ ] Enter `1500`, reason `Gold Line job pay`, press **Apply**.
- [ ] The hero sheet's ¥ goes up by exactly 1,500.
- [ ] Chat posts a **Paid** card from *Director*: `<hero> paid ¥1,500 — ¥250 → ¥1,750`, with `Reason: Gold Line job pay` beneath.
- [ ] Leave the reason blank on the next pay — the card reads `Reason: no reason given` rather than blank or `null`.

### 3. Spend

- [ ] Press **Director: Spend Hero** on the same hero, amount `400`, reason `fixer's cut`.
- [ ] ¥ drops by exactly 400; the chat card is a **Spent** card with before → after.
- [ ] Now ask for an amount **larger than the hero has**: a warning names the ask and what they actually hold, **no chat card is posted**, and the sheet is unchanged.
- [ ] Spend **exactly** what they hold: it lands, and the hero sits at ¥0.
- [ ] Enter `0` (or leave the amount blank): "Enter an amount above zero", no write, no card.
- [ ] Enter a negative number: it is read as 0 and refused the same way — never flipped into a pay.

### 4. Targets

- [ ] **Target** two hero tokens (T key) and press Pay: the dialog lists both, and one Apply pays both, with one chat card each.
- [ ] With tokens both targeted *and* selected, the **targeted** ones win.
- [ ] Two tokens of the **same** hero: paid once, not twice.
- [ ] Select an **NPC** token and press Pay: "…is not a hero and carries no ¥", and nothing is written.
- [ ] Select nothing and press Pay: "Target or select a hero token first."

### 5. It plays with the kiosk

- [ ] Pay a hero ¥1,000, then walk them to a **Gear kiosk** and buy something: the purchase debits from the new total, and the kiosk's own affordability check sees the paid ¥.
- [ ] Open the **Ritual Working** panel on the same hero: the ¥ line at the top matches the sheet, and **Pay Components** still works off the same purse.
- [ ] Nothing in any of the above touched Essence, Conviction, Resonance or Taint.

---

## API (console / macro)

```js
const api = game.modules.get("draw-steel-ghostwire").api;

api.directorPayHero({ actor, amount: 1500, reason: "Gold Line job pay" });
api.directorSpendHero({ actor, amount: 400, reason: "fixer's cut" });
api.directorAdjustWealth({ actor, amount: 250, reason: "bribe", mode: "spend" });
api.directorWealthPrompt({ mode: "pay" });            // the dialog, on targeted/selected heroes
api.previewWealthChange({ wealth: 399, amount: 400, mode: "spend" });  // { ok: false, reason: "insufficient" }
```

The same four entry points are on `game.ghostwire`.
