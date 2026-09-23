# Wrench — the free Echelon 1 drone at chargen (0.3.115)

**Michael lock, 2026-09-23.** A Wrench picks **one Echelon 1 drone chassis for free** during chargen.
It is a Rigging class perk, and it is separate from both of the other things that put objects on a new
sheet: the Kit's street-band grant (`scripts/kit-grants.mjs`) and the optional ¥5,000 early spends.

The rule was in the text and had never existed in Foundry. It does now.

---

## What a player sees

A new step in the Chargen Wizard, **Free drone**, sitting immediately after **Kit**.

- **Only a Wrench sees it.** For every other class the step is not greyed out, not skippable — it is
  *absent*. The rail shows 13 steps and the counter reads `6 / 13`; a Wrench's reads `7 / 14`. Next and
  Back walk past it without a stop, and Done never mentions it.
- The picker lists **every Echelon 1 drone chassis** in the Vehicles compendium — fifteen of them today:
  Buzz, Crawler, Fly, Junkbug, Mule-Bot, Needle, Rattlebox, Rotor, Rustbucket, Sink-Floater, Skitter,
  Spotter, Sputter-Sled, Tape-Eye, Taser-Bee. Nothing at Echelon 2 or above, and no vehicle that is not
  a drone. The list price is shown greyed out as colour; the button says **Free**.
- **Take it** puts the chassis on the sheet and posts a short card to chat. **¥ does not move.** A Wrench
  who starts on ¥5,000 still has ¥5,000 after the pick, and the Done page's "early spends" total is
  untouched.
- One pick. Once taken, every Take button on the step goes dead.
- A Wrench who does not want one presses **Skip the free chassis** — the same ack the Kit step uses for a
  no-Kit runner. Until they do one or the other, the step warns (advisory only; Finish still offers to
  proceed, as it always has).
- **Start over** on that step deletes the chassis and reopens the pick. There is nothing to refund.

## What a Director should know

- The pick is a **class grant**, not a purchase. It deliberately does **not** go through
  `buyChargenItem()`: no wealth read, no purchase plan, no `WEALTH_PATH` write, no `spent` ledger entry.
  The Item-creation half is character-for-character the same call (`game.items.fromCompendium` then
  `Item.create` with the hero as parent), so the chassis that lands is identical to a bought one.
- Every later chassis is bought the ordinary way — ¥ and Availability, in the kiosk or on the early-spend
  step. Vehicles are still spendable there, exactly as before; a Wrench can buy a second drone on day one
  out of their ¥5,000 if they want to.
- **Once only**, on two locks: `flags.draw-steel-ghostwire.chargenFreeDrone` on the Actor (the ledger,
  `{ dsid, grantedAt }`) and the same flag stamped on the granted Item. Same shape kit-grants uses. To
  give a Wrench their pick back by hand, unset the Actor flag and delete the stamped Item — or just press
  Start over on the step.
- The gate is the class `_dsid`, read off the class Item on the sheet: `system._dsid === "wrench"`
  (`src/packs/classes/wrench/wrench.json`). A homebrew Rigging class wants that dsid to inherit this.
- Nothing about Deploy/Recall, Jump-In, fleet size or Hardpoints changed. The chassis is an inventory
  Item like any other; the Machines applet picks it up from there.

## Director API

```js
const chargen = game.modules.get("draw-steel-ghostwire").api.chargen;

chargen.isWrenchChargen(chargen.heroFacts(actor));         // is this runner gated in?
await chargen.grantFreeChargenDrone(actor, uuid);          // hand over one E1 chassis, free
await chargen.clearFreeChargenDrone(actor);                // take it back, reopen the pick
chargen.visibleSteps(chargen.heroFacts(actor));            // this runner's own ladder
chargen.isFreeDroneRow({ pack: "vehicles", drone: true, echelon: 1 });  // the catalog filter
```

`grantFreeChargenDrone` refuses, with a notification, on: not a Wrench, already granted, a hero past 1st
level or already stamped complete (G9), and any row that is not an Echelon 1 drone chassis out of the
vehicles pack.

## Smoke

```
node tools/wrench-free-drone-smoke.mjs      # the feature: gates, ladder, catalog, ¥ firewall
node tools/chargen-wizard-smoke.mjs         # the wizard it sits inside, unbroken
node tools/kit-grants-smoke.mjs             # the Kit street-band package, unbroken
```

The four smoke points the brief asked for, by name:

| Ask | Where it is proved |
| --- | --- |
| Wrench sees the picker / gets the item | §2–3 (`stepVisible`, `visibleSteps`, `nextStep`) and §8 (the grant's gates) |
| Non-Wrench: no picker | §2 — the step is absent from their ladder, and §4 — Done never waits on it |
| ¥ unchanged on a free grant | §7 — the grant body is asserted to name neither `WEALTH_PATH`, `planChargenSpend`, `getWealth`, `catalogPrice` nor `spent`, while `buyChargenItem` is asserted to still name all of them |
| Only E1 drones listed | §5 (the filter) and §6 (the filter run over the shipped `src/packs/vehicles/**` JSON, matching the brief's fifteen exactly) |

## Foundry smoke a Director can run at the table

1. New Hero → Chargen. Pick any class **but** Wrench. The rail has no **Free drone** step and the counter
   reads `… / 13`. Walk Kit → Next: you land on Skills.
2. New Hero → Chargen → Class **Wrench**. The rail gains **Free drone** after Kit; counter `… / 14`.
3. On that step, note the ¥ chip in the header. Take a chassis — say Junkbug. The chip is unchanged, the
   chassis is on the sheet's inventory, and a card posts to chat saying free.
4. Every other Take is now dead, and the step reads "already yours".
5. Scroll the list: nothing above Echelon 1, and no ground cars, boats or airframes that are not drones.
6. Done → the checklist carries a **Free Echelon 1 chassis: Junkbug** bullet, and "Optional early spends"
   still reads ¥0.
