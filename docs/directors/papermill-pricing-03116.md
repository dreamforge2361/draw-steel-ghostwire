# Papermill — identity pricing pass (0.3.116, F23)

**Michael lock, 2026-09-23.** Illegal, Restricted and Military paper has to *feel* expensive.
The 0.3.113 ladder was priced like tools; it is now priced like crime.

Nothing else about F17 changed. Quality bands, scan outcomes, burn risk, the burn / un-burn
Director menu, the legacy **Fake SIN (basic)** mapping — all untouched. This pass moves nine
numbers and the nine strings that print them.

---

## The new ladder

| SKU | Q | E | old ¥ | **new ¥** | × | Availability |
|---|---:|---:|---:|---:|---:|---|
| **Burn SIN** | 1 | 1 | 400 | **500** | 1.3 | Street |
| **Lanyard Forgery** | 2 | 1 | 1,200 | **2,500** | 2.1 | Street |
| **Paper Ghost SIN** | 2 | 1 | 1,500 | **3,500** | 2.3 | Street |
| **Clinic Credential (Forged)** | 3 | 2 | 3,500 | **8,000** | 2.3 | Restricted |
| **Carry Permit (Forged)** | 3 | 2 | 4,000 | **12,000** | 3.0 | Restricted |
| **Broker SIN** | 3 | 2 | 6,000 | **15,000** | 2.5 | Restricted |
| **Wire Operator's Ticket (Forged)** | 4 | 3 | 15,000 | **28,000** | 1.9 | Restricted |
| **Deep Cover SIN** | 4 | 3 | 25,000 | **45,000** | 1.8 | Restricted |
| **Cradle-Seeded SIN** | 5 | 4 | 90,000 | **110,000** | 1.2 | Military |

Prices live where they always did: `flags.draw-steel-ghostwire.gear.price` on each row in
`src/packs/gear/identity/**`. `catalogPrice()` reads that flag and nothing else, so the kiosk,
the black market, chargen early spends and the Locker all moved together with one edit each.

## Why these numbers

- **Burn stays the floor of existence.** ¥500 — up a notch, still inside a single night's
  take. A runner with no paper at all cannot check into a clinic, rent a room, or ride a corp
  elevator, and that door must never be priced out of reach. It is the floor, not a bargain.
- **Street forgeries are no longer pocket change.** Lanyard and Paper Ghost roughly doubled.
  At ¥1,200 a Lanyard was cheaper than a pair of boots; at ¥2,500 buying one is a decision.
  Both stay Street: they are *available*, they are just not free.
- **The Restricted middle is where the pass bites hardest.** Clinic ×2.3, Carry Permit ×3.0,
  Broker ×2.5. This is the band that was breaking the fiction — forged medical licences and
  firearms paper are the documents a corp state actually prosecutes, and they were priced under
  a mid-grade pistol. Carry Permit takes the biggest multiplier on purpose: it is the single
  most-wanted piece of paper at the table.
- **The premium end bumps, it does not explode.** Wire Ticket, Deep Cover and Cradle-Seeded were
  already priced as campaign objects. They move up enough to keep the step-ups clean above the
  new middle (28k / 45k / 110k) without turning Echelon 3 into a wall.
- **Every step is a clear step.** 500 → 2,500 → 3,500 → 8,000 → 12,000 → 15,000 → 28,000 →
  45,000 → 110,000. No two rungs sit close enough to argue about, and the SIN-only sub-ladder
  (500 / 3,500 / 15,000 / 45,000 / 110,000) still climbs strictly with quality — which
  `tools/f17-identity-smoke.mjs` has asserted since 0.3.113 and still does.

## The vendor did not change

There is still exactly **one** identity vendor: the kiosk preset `identity`, lang key
`GHOSTWIRE.Kiosk.Presets.Identity`, vendor name **Papermill**. No second vendor was added and
no display rename was needed. It stocks on the Identity folder (`gwGearIdentity00`) *and* the
`Identity` gear tag, so a tenth forgery dropped into that folder auto-stocks at whatever price
its own flag carries.

The pre-0.3.113 **Fake SIN (basic)** (¥1,000, Professional) is deliberately still unstamped and
still on the Lifestyle shelf — it is embedded on three pregens and stamping it would make the
next pregen regen a content change. It is not part of this ladder and its price did not move.

## What a Director should do with this

- **Re-quote, don't retro-bill.** A crew that already bought a Broker SIN at ¥6,000 keeps it.
  The new number is what the next one costs.
- **The gap between Street and Restricted is the story.** ¥3,500 buys a working shallow history.
  ¥8,000 buys the right to touch someone's body. That jump should be felt at the table.
- **Cradle-seeded paper is still a plot item, now at ¥110,000.** The people who can sell it can
  take it back.
- **Papermill pricing is negotiable fiction.** These are list prices. A fixer who owes the crew,
  or a papermill that wants a favour instead of cash, is exactly the right kind of scene.

## Files touched

- `src/packs/gear/identity/*.json` — nine `gear.price` values.
- `lang/en.json` — the nine `Cost:` lines in the SKU descriptions, so the Item card matches
  the kiosk shelf.
- `docs/directors/f17-sin-identity.md` — ladder table re-cut, with a pointer here.

## Smoke

    node tools/papermill-pricing-smoke.mjs
    node tools/f17-identity-smoke.mjs

The new smoke asserts the exact ladder, the Burn floor (¥400–600), strictly-increasing rungs,
that the printed `Cost:` string in `lang/en.json` matches the `gear.price` flag for every row,
and that the Papermill preset still stocks every Identity-tagged SKU.

## Pack rebuild

`node tools/build-packs.mjs gear` rebuilds the gear LevelDB. Foundry holds the pack locks while
it is open — if the rebuild refuses, the `src/packs` JSON is still the source of truth and the
next rebuild with Foundry closed picks it up.
