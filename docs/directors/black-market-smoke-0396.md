# Black Market sell — Foundry checklist (0.3.96 / F9)

Node smoke first, in the module folder with Foundry **closed**:

```
node tools/black-market-smoke.mjs
```

Must print `passed`. Then open the world and walk the list below.

Code: `scripts/black-market.mjs`, registered from `scripts/module.mjs`.
Macro: **Black Market: Sell** (`gwBlackMktSell01`) in **Ghostwire Macros** (Director-only pack — players use the sheet, HUD, scene tool or keybinding).

---

## The rules this tool holds to

- **List price is the catalog ¥.** `catalogPrice()` from `kiosk.mjs` — the gear / chrome / matrix / mod / vehicle / focus `.price` flag, the same number the Gear kiosk charges. **No catalog ¥ → no sale**, with a named warning. Nothing here invents a price.
- **The street pays 50% of list**, floored to an integer ≥ 0.
- The optional **haggle** is one stock Draw Steel Power Roll and moves *only* the percentage: **low (tier 1) → 50%** (the roll bought nothing), **middle (tier 2) → 55%**, **high (tier 3) → 60%**.
- **One purse:** `system.hero.wealth`, the same path the kiosk debits and F6 moves. A sale only ever **credits**.
- **Who may sell:** the hero's **owner**, or the **Director**. An Item is sellable only when it sits on that hero and this user can delete it.
- A sale is **never half-done**: the Items go first, the ¥ second, and a failed purse write puts every Item back.

---

## In Foundry

### 1. The doors

- [ ] Open a hero sheet you own. **Right-click** a piece of gear with a catalog ¥ → the menu has **Black Market: Sell…**.
- [ ] Right-click something with **no** catalog ¥ (an ability, a class feature, a plot Item) → **no** Black Market entry appears.
- [ ] Select your hero token → its **Token HUD** right column has a **sack** button that opens the same dialog.
- [ ] The **Token** scene-control palette shows **Black Market: sell** — for players *and* the Director.
- [ ] **Ghostwire Macros** holds **Black Market: Sell**; as GM, drag it to the hotbar and it runs.
- [ ] As a player, `game.ghostwire.blackMarketPrompt()` in the console opens the dialog on your character.

### 2. A plain sale

- [ ] Give a hero a ¥1,000 SKU (buy one at a Gear kiosk, or drag it from **Ghostwire Gear**). Note their ¥.
- [ ] Right-click it → **Black Market: Sell…**. The dialog opens with that Item **already ticked**.
- [ ] The row reads `¥1,000 list → ¥500`, and the running total under the list reads `1 picked — ¥500 at 50%`.
- [ ] Press **Sell**. The Item **leaves the sheet**, ¥ goes **up by exactly 500**.
- [ ] Chat posts a **Fenced** card speaking as the hero: the headline names the hero, the count, ¥500, and **before → after**; one line per item reads `<name> ×1 — ¥1,000 list at 50% → ¥500`; the footer reads `No haggle — paid at 50%.`
- [ ] Tick several items at once: the total is the sum, one card lists every line, and ¥ moves once.

### 3. Haggling

- [ ] Open the dialog, tick an item, tick **Haggle (Power Roll)**. The total now reads `… ¥500 at 50%, up to ¥600 on a clean haggle`.
- [ ] Press **Sell** → the stock Draw Steel Power Roll dialog opens, titled *Black Market haggle — <hero>*, on **Presence** (or whichever characteristic you picked from the dropdown beside the checkbox).
- [ ] **Tier 1 (low):** the payout is still **¥500**, and the card's footer reads `Haggled on Presence: hung — no bump — paid at 50%.`
- [ ] **Tier 2 (middle):** **¥550**, footer `held — +5% … 55%`.
- [ ] **Tier 3 (high):** **¥600**, footer `clean — +10% … 60%`.
- [ ] **Dismiss** the Power Roll dialog instead of rolling: "Haggle dismissed — nothing was sold", the Item is **still on the sheet**, and ¥ is unchanged.

### 4. Prices the street won't pay

- [ ] Put an Item with **no** catalog ¥ on the hero (a quest object, a hand-made world Item). It appears in the dialog **greyed out**, reading *No catalog ¥ — cannot be fenced*, and its checkbox is **disabled**.
- [ ] A hero carrying **only** unpriced items: opening the tool warns "…carries nothing with a catalog ¥ to fence" and no dialog opens.
- [ ] Press **Sell** with nothing ticked: "Pick at least one item to sell", no write.
- [ ] A ¥1 SKU shows `¥1 list → ¥0` **before** you confirm — the sale is legal, but you can see it pays nothing.

### 5. Stacks

- [ ] Give a hero **5** of a ¥100 consumable (one Item at `system.quantity` 5). The row shows a quantity box pre-filled with **5**.
- [ ] Set it to **3** → the total updates to **¥150** as you type.
- [ ] Sell. ¥ goes up by 150, and the Item is **still on the sheet at quantity 2** — not deleted.
- [ ] Sell the remaining **2**: ¥ goes up by 100 and the Item is now **gone**.
- [ ] The chat line reads `<name> ×3 — ¥300 list at 50% → ¥150` — the quantity is on the card.

### 6. Permissions

- [ ] As a **player**, target another player's hero token and press the scene tool: "You don't own <hero>", no dialog.
- [ ] Select an **NPC** token and press the tool: "…is not a hero and carries no ¥."
- [ ] Select nothing, with no assigned character: "Target or select a hero token, or assign your character, before you sell."
- [ ] As **GM**, target any hero token and press the tool: the dialog opens on that hero and the sale lands on *their* ¥, not yours.
- [ ] As GM with **two** hero tokens targeted: the tool opens on the first of the targeted heroes (targeted wins over selected, the F6 collect).

### 7. It plays with the rest of the ¥ stack

- [ ] Sell into a hero, then walk them to a **Gear kiosk**: the kiosk's affordability check sees the new total immediately.
- [ ] Buy an item at the kiosk for ¥X, then immediately fence it: you get back **half** of X (or a little more with a haggle) — never the full price.
- [ ] Run **Director: Spend Hero** (F6) on the same hero: it debits from the post-sale total.
- [ ] Open the **Ritual Working** panel: the ¥ line matches the sheet, and **Pay Components** still works off the same purse.
- [ ] Nothing in any of the above touched Essence, Conviction, Resonance or Taint.

---

## API (console / macro)

```js
const api = game.modules.get("draw-steel-ghostwire").api;

api.blackMarketPrompt();                                   // the dialog, on the targeted/selected/assigned hero
api.blackMarketPrompt({ actor });                          // …on a named hero (Director, or the owner)
api.sellItem(item);                                        // the dialog, with one Item pre-picked
api.executeSale({ seller: actor, items: [item] });         // no dialog, no haggle: 50% of catalog ¥
api.executeSale({ seller: actor, items: [{ item, quantity: 3 }], tier: 3 });  // part of a stack at 60%

api.planSale({ listPrice: 1000, tier: 2 });                // { ok: true, percent: 55, payout: 550 }
api.planSale({ listPrice: 0 });                            // { ok: false, reason: "no-price", payout: 0 }
api.salePercentForTier(1);                                 // 50 — a low haggle buys nothing
api.sellableItems(actor);                                  // what this user could put on the street
```

`blackMarketPrompt`, `blackMarketSellPrompt`, `executeSale` and `sellItem` are also on `game.ghostwire`.
