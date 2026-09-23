# Papermill — identity price soft cut (0.3.117, F23b)

**Michael lock, 2026-09-23.** 0.3.116 priced illegal paper like crime, and it worked — a bit too
well. The Restricted middle turned into a wall: a crew that needed a forged Carry Permit at ¥12,000
was paying a campaign's savings for one document, and Street paper at ¥2,500–3,500 had stopped
feeling like the thing you buy on the way to the job.

This is a **soft cut**, not a rollback. Restricted and Military come down hardest, Street comes down
a notch, and **Burn SIN does not move at all**. Every rung is still above its 0.3.113 number, the
Street/Restricted gap is still the story, and the SIN sub-ladder still climbs strictly with quality.

Nothing else about F17 changed. Quality bands, scan outcomes, burn risk, the burn / un-burn Director
menu, the legacy **Fake SIN (basic)** mapping — untouched. This pass moves eight numbers and the
eight strings that print them.

---

## The new ladder

| SKU | Q | E | 0.3.113 ¥ | 0.3.116 ¥ | **0.3.117 ¥** | cut | Availability |
|---|---:|---:|---:|---:|---:|---:|---|
| **Burn SIN** | 1 | 1 | 400 | 500 | **500** | — | Street |
| **Lanyard Forgery** | 2 | 1 | 1,200 | 2,500 | **1,800** | −28% | Street |
| **Paper Ghost SIN** | 2 | 1 | 1,500 | 3,500 | **2,200** | −37% | Street |
| **Clinic Credential (Forged)** | 3 | 2 | 3,500 | 8,000 | **5,000** | −38% | Restricted |
| **Carry Permit (Forged)** | 3 | 2 | 4,000 | 12,000 | **7,000** | −42% | Restricted |
| **Broker SIN** | 3 | 2 | 6,000 | 15,000 | **9,000** | −40% | Restricted |
| **Wire Operator's Ticket (Forged)** | 4 | 3 | 15,000 | 28,000 | **18,000** | −36% | Restricted |
| **Deep Cover SIN** | 4 | 3 | 25,000 | 45,000 | **30,000** | −33% | Restricted |
| **Cradle-Seeded SIN** | 5 | 4 | 90,000 | 110,000 | **75,000** | −32% | Military |

Prices live where they always did: `flags.draw-steel-ghostwire.gear.price` on each row in
`src/packs/gear/identity/**`. `catalogPrice()` reads that flag and nothing else, so the kiosk, the
black market, chargen early spends and the Locker all moved together with one edit each.

## Why these numbers

- **Burn stays the floor of existence at ¥500.** It is the price of being a person the city can
  read. It does not move up and it does not move down. A runner with no paper at all cannot check
  into a clinic, rent a room, or ride a corp elevator, and that door must never be priced out of
  reach.
- **Street paper is back to a decision, not a savings plan.** ¥1,800 and ¥2,200. At 0.3.116's
  ¥2,500–3,500 a first-session crew could not afford two between five people, which is not what
  "Street" is supposed to mean. Both still cost more than they did at 0.3.113.
- **The Restricted middle takes the deepest cuts**, because it took the steepest climb.
  Clinic −38%, Carry Permit −42%, Broker −40%. Carry Permit takes the deepest cut on purpose, the
  mirror image of it taking the biggest raise in 0.3.116: it is the single most-wanted piece of
  paper at the table and it should be reachable in one good payday, not three.
- **The premium end comes back inside a campaign.** Wire Ticket ¥18,000, Deep Cover ¥30,000,
  Cradle-Seeded ¥75,000. Cradle-Seeded is still a plot object and still the most expensive thing on
  the shelf; it is now a plot object a successful crew can actually chase.
- **Every step is still a clear step.** 500 → 1,800 → 2,200 → 5,000 → 7,000 → 9,000 → 18,000 →
  30,000 → 75,000. No two rungs sit close enough to argue about, and the SIN-only sub-ladder
  (500 / 2,200 / 9,000 / 30,000 / 75,000) climbs strictly with quality.
- **The gap that matters is intact.** The cheapest Restricted row (¥5,000) still costs more than the
  dearest Street row (¥2,200). ¥2,200 buys a working shallow history; ¥5,000 buys the right to touch
  someone's body. That jump should still be felt at the table.

## The vendor did not change

There is still exactly **one** identity vendor: the kiosk preset `identity`, lang key
`GHOSTWIRE.Kiosk.Presets.Identity`, vendor name **Papermill**. It stocks on the Identity folder
(`gwGearIdentity00`) *and* the `Identity` gear tag, so a tenth forgery dropped into that folder
auto-stocks at whatever price its own flag carries.

The pre-0.3.113 **Fake SIN (basic)** (¥1,000, Professional) is deliberately still unstamped and
still on the Lifestyle shelf — it is embedded on three pregens and stamping it would make the next
pregen regen a content change. It is not part of this ladder and its price did not move.

## New this build: read the rules without buying

Every kiosk row now has a **Card** button, and the row's name is clickable. Both open the item's own
sheet from the compendium, so a player can read what a Deep Cover SIN actually does before deciding
whether ¥30,000 is worth it. No ¥ changes hands, no buyer needs to be selected, and it works out of
range — reading a price list is not a transaction.

The other half of that door is a lock: **only a Director can change a catalog price.** A
`preUpdateItem` guard strips any non-GM write to `flags.draw-steel-ghostwire.<family>.price` out of
the change set and says so in a toast. Everything else the player legitimately edited on that Item
still saves; the price snaps back on re-render. `canEditCatalogPrice(user)` is the one predicate,
exported from `scripts/kiosk.mjs` and asserted by the smoke: GM true, player false.

## What a Director should do with this

- **Re-quote, don't refund.** A crew that bought a Broker SIN at ¥15,000 last week does not get
  ¥6,000 back. The new number is what the next one costs. If it stings, that is a scene: the
  papermill dropped its rates because a competitor opened two blocks over.
- **Papermill pricing is still negotiable fiction.** These are list prices. A fixer who owes the
  crew, or a papermill that wants a favour instead of cash, is exactly the right kind of scene.
- **Cradle-seeded paper is still a plot item at ¥75,000.** The people who can sell it can take it
  back.

## Files touched

- `src/packs/gear/identity/*.json` — eight `gear.price` values (Burn SIN held).
- `lang/en.json` — the eight `Cost:` lines in the SKU descriptions, so the Item card matches
  the kiosk shelf; plus `Kiosk.View`, `Kiosk.ViewHint`, `Kiosk.PriceLocked`.
- `scripts/kiosk.mjs` — `canEditCatalogPrice`, `catalogPriceWrites`, the `viewListing` action, the
  `preUpdateItem` guard.
- `templates/kiosk.hbs`, `styles/ghostwire.css` — the Card button.
- `docs/directors/f17-sin-identity.md` — ladder table re-cut, with a pointer here.
- `docs/directors/papermill-pricing-03116.md` — superseded, with a pointer here.

## Smoke

    node tools/papermill-pricing-smoke.mjs
    node tools/f17-identity-smoke.mjs
    node tools/kiosk-smoke.mjs

The pricing smoke asserts the exact ladder, that every rung came **down** from 0.3.116 and is still
**at or above** its 0.3.113 number, the held Burn floor, strictly-increasing rungs, the size of the
Restricted/Military cuts, that the printed `Cost:` string in `lang/en.json` matches the `gear.price`
flag for every row, and that the Papermill preset still stocks every Identity-tagged SKU.

## Pack rebuild

`node tools/build-packs.mjs gear` rebuilds the gear LevelDB, Foundry closed. It was rebuilt for this
build and the rebuilt database read back to confirm all nine prices.
