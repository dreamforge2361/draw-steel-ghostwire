# SIN and forged identity

**Module 0.3.113 · backlog F17 · `scripts/identity.mjs`, `src/packs/gear/identity/`**
**Smoke:** `node tools/f17-identity-smoke.mjs`

A **SIN** — System Identification Number — is the Reach's civic barcode. No SIN, no bank account, no clinic intake, no corp lobby, no lease. Runners buy one. What they buy is a forgery, and forgeries have quality.

Before 0.3.113 there was exactly one identity SKU (Fake SIN (basic), ¥1,000) and nothing mechanical behind it. This pass ships the ladder.

## The quality ladder

Quality is the whole system. Everything else — echelon, ¥, what a scan does, how likely it is to burn — hangs off it.

| Q | Band | E | Scan gives the bearer | Burn risk |
|---:|---|---:|---|---:|
| 1 | Burn | 1 | **double bane** | 3 |
| 2 | Paper | 1 | **bane** | 2 |
| 3 | Broker | 2 | no modifier | 1 |
| 4 | Deep cover | 3 | **edge** | 1 |
| 5 | Cradle-seeded | 4 | **double edge** | 0 |

A **hot check** — Military-grade security, a corp-side records pull, a Wired-side verification against the live registry — shifts the outcome **one step worse** and raises burn risk by 1. So even cradle-seeded paper only reads as an edge when somebody really looks, and nothing ever reads worse than a double bane.

## The SKUs

Five SIN rungs and four forged credentials, all in Ghostwire Gear › **Identity**.

| Item | Q | E | ¥ | Availability |
|---|---:|---:|---:|---|
| **Burn SIN** | 1 | 1 | 400 | Street |
| **Paper Ghost SIN** | 2 | 1 | 1,500 | Street |
| **Broker SIN** | 3 | 2 | 6,000 | Restricted |
| **Deep Cover SIN** | 4 | 3 | 25,000 | Restricted |
| **Cradle-Seeded SIN** | 5 | 4 | 90,000 | Military |
| **Lanyard Forgery** (corp badge) | 2 | 1 | 1,200 | Street |
| **Clinic Credential (Forged)** | 3 | 2 | 3,500 | Restricted |
| **Carry Permit (Forged)** (firearms) | 3 | 2 | 4,000 | Restricted |
| **Wire Operator's Ticket (Forged)** | 4 | 3 | 15,000 | Restricted |

Plus the pre-0.3.113 **Fake SIN (basic)** (¥1,000, Professional), which stays where it is in Gear › General › Lifestyle.

All names and flavour are Ghostwire originals — no licensed product names anywhere in the pack or the strings.

**Fake SIN (basic)** is the pre-0.3.113 SKU and it still works: `scripts/identity.mjs` maps it by `_dsid` to quality 2, the same rung as a Paper Ghost SIN, so the copies already sitting on Barak's, Kaes', and Sabbat's sheets scan without a re-buy.

Its **pack row is deliberately left unstamped** — it is embedded on those three pregen Actors, and `tools/pregen-regen-smoke.mjs` requires `tools/pregens-to-actors.mjs` to stay a no-op round-trip. Stamping the SKU would silently make the next pregen regen a content change. The trade is that the legacy SIN does not carry the `Identity` tag and therefore does not stock the papermill; Paper Ghost SIN is the quality-2 rung you buy.

## Buying one

Nothing special. Identity Items carry a plain `flags.draw-steel-ghostwire.gear.price`, which is the only thing the ¥ paths read, so they work everywhere gear works:

- **Kiosk** — new preset, **Identity** (vendor name *Papermill*). Token controls › cash register › Identity. It stocks every SKU carrying the **Identity** tag, so a forgery you add later auto-stocks with no listing edit.
- **Chargen** — they land in the ¥5,000 starting-spend catalog alongside the rest of the gear pack. No special casing was added, and none is needed.
- **Black market** and hand-placed loot work the same way.

## Validating / scanning at the table

Right-click the Item on a hero sheet → **Validate / scan identity**.

The dialog asks who is checking and whether it is a hot check. Ghostwire posts a chat card naming the band, the **edge or bane**, and the burn risk — then the Director applies that modifier in the power-roll dialog for whatever test is actually being made (the bearer's Lie / Interpersonal test, a Wired-side records pull, an opposed check, whatever your table uses).

It is announced rather than auto-applied on purpose: Draw Steel resolves edges and banes in the roll dialog, and the entity doing the checking is almost always an NPC whose roll Ghostwire has no business touching.

**Burning.** On a failed check the Director may burn the record — right-click → **Burn this identity**. A burned identity is flagged in the registry and always scans at the bottom rung (double bane), whatever it cost. Use burn risk as the prompt: the higher the number, the more readily a failure should burn the paper rather than just fail the moment. **Clear burned flag** undoes it (Director only) if the crew buys their way back off a list.

## Running it

- **Give the crew a floor.** A runner with no SIN at all cannot check into a clinic, rent a room, or ride a corp elevator. Burn SIN at ¥400 is the price of existing.
- **Make quality bite before you make it fail.** A bane is a story, not a wall. A burned SIN is a wall — hold it for when the failure should matter.
- **Credentials stack with SINs, they do not replace them.** A Carry Permit answers "why is there a longarm in the trunk", not "who are you".
- **Cradle-seeded paper is a plot item at ¥90,000.** The people who can sell it can take it back. That is the hook.
- **A hot check is your dial.** Same SIN, same runner, different room: the lobby turnstile is routine, the executive floor is hot.
