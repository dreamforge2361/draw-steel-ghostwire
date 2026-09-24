# 0.3.123 — Street Priest rework · Elementalist Cantrip · Foundry fix wave

Director note for the 2026-09-23 locks. Smoke: `node tools/sp-el-foundry-wave-03123-smoke.mjs`
Foundry checklist: `docs/directors/sp-el-foundry-wave-smoke-03123.md`

---

## A. Street Priest

### One free strike, and your pact picks it

The class shipped **two** free ranged strikes — *Smite / Rebuke* as an always-granted class signature, and
*Rebuke* again in the optional signature pool — and **Drain** was a pick anybody could take regardless of
pact. That is gone.

* **`smite-rebuke.json` is deleted.** The surviving card is **Rebuke**, and it keeps the Conviction spend
  rider that used to live on Smite / Rebuke (+1 damage per point; or push 1; or, for 2, a bane on the
  target's next roll).
* **Rebuke is low power on purpose: 2 / 4 / 6 + Persona**, holy, ranged 10, with the pull rider it already
  had (2 / 3 / 4, may be vertical).
* **Drain is Dark-pact only**: melee 1, corruption, 2 / 5 / 7 + Persona, Recovery rider on middle and high.
* A new class advancement, **Pact Strike** (sort 9500, choose 1 of 2), sits just after the free class
  signatures. Both rows carry `flags.draw-steel-ghostwire.pact`, so the pact filter that already gates
  Roster of the Saved / Ledger of the Damned leaves only the matching one selectable once Pact Alignment
  has been answered. **No new chargen dialog was written.**
* **Live heroes** are handled by `scripts/pact-strike.mjs`: swearing (or re-swearing) a pact swaps the
  strike, and worlds built before 0.3.123 get corrected on load — the retired Smite / Rebuke is stripped
  and the right strike is pulled from the classes compendium. A priest with **no** pact yet is left alone.

### Blessed Light is a lamp, not a weapon

Blessed Light was a 3 / 5 / 8 holy ranged strike. It is now a **free maneuver, no roll, no damage**: your
token sheds a **20-foot bright light** until you use it again to put it out. It moved out of the optional
signature pool and into **Class Signatures**, so every priest has it from 1st level alongside Lay On Hands
and Sense the Veil.

**Why 20 / 20.** Foundry's `light.bright` and `light.dim` are in *scene* units, and Michael's lock says
"20 foot light". `scripts/token-light.mjs` reads the scene's own `grid.units` / `grid.distance` and turns
20 feet into **20 on a foot-scaled map** or **4 squares on a Draw Steel square map** (1 square = 5 ft), so
the card means the same thing on every scene. `bright` and `dim` are set to the **same** radius: the card
prints one number, so the light has one edge — no dim skirt reaching past 20 feet. Whatever `light` the
token already had is snapshotted into `flags.draw-steel-ghostwire.tokenLightPrior` first, so a Director's
own torch configuration comes back when the priest puts it out.

### Minor Rebuke is Holy Smite

Same card, renamed, `_dsid` `minor-rebuke` → `holy-smite`. Still a **1 Conviction** ranged main action,
still holy or corruption by pact — but **3 / 5 / 8 + Persona** instead of none / 2 / 4. The old numbers made
a Conviction spend do *less* than the free strike it sat under at every tier; the new ones beat the free
Rebuke at every tier, which is the point of paying the point.

### Unchanged

**Lay On Hands / Word of Comfort** and **Sense the Veil / Discern Spirits** are untouched — same action
type, same tiers, same Conviction riders.

---

## B. Elementalist — Cantrip

A **fourth** signature, granted with the other three at 1st level. **0 Essence, never boostable, no damage,
ever.** The `Signature Abilities` itemGrant went from three UUIDs to four.

Using the card opens one dialog with two modes:

* **Light** — the same 20-foot glow as Blessed Light, through the same shared helper. Cast again to put it
  out.
* **Other utility** — a description box. Whatever you write is posted under the card as the working you
  just did (scour a coat, flick a switch across the room, still the dust in a doorway). **Nothing
  mechanical is applied** and there is no combat rider; the Director rules on what it accomplished. An
  empty box is not a cast — nothing is posted.

---

## C. Foundry fix wave

### C1 — Wearing armor fills the Stamina pool

Donning a suit now sets **current Stamina to the new maximum**. Taking one off **never heals**: it only
clamps, and only if the maximum actually dropped below what you were carrying. Both the right-click
*Wear* entry and the auto-wear path (armor landing on a hero who is wearing none) go through it. A
pre-0.3.123 world gets one retroactive don on load, which tops those heroes up once.

### C2 — Trauma Patch is usable

It was flavour-only treasure. It now spawns a **maneuver** like every other consumable and **restores 1
spent Recovery** — not Stamina directly; you still choose when to cash it in. **Once per combat**, tracked
by the Combat's own id on `flags.draw-steel-ghostwire.consumableCombatUse`, so a new fight is a new
allowance and `deleteCombat` clears the record. **Outside combat there is no gate** — a patch used in the
corridor does not eat the next fight's use. The patch is consumed either way, and the refusal lands
*before* the card posts, so a blocked second use never leaves a dead roll on the log.

This supersedes the older "heal Recovery value OR stop Bleeding" master text, per Michael. **Bleeding
clear was optional and is not implemented.**

### C3 — Your own hero pins to the top of Connections

The Wired Console's Connections list sorts your own hero first, then revealed nodes, then everyone else
A–Z as before. "Your own hero" is the Actor assigned to your User first; a user with no assignment but
exactly **one** owned hero gets that one, and genuine ambiguity pins nothing rather than guessing wrong.
The row is tagged **(you)**.

### C4 — Compile Sprite actually compiles

The archetype picker and the summon have existed since B52, but only on the sheet button and the row
menu — **using the card** just rolled. Now the card does it, through the same `createChatMessage` seam
`scripts/veil-summons.mjs` uses, with a world setting (**Compile sprites when the card is used**, default
on) to go back to roll-only.

### C5 — Recompile rebuilds

`recompile.json` had no power effects and no behaviour. Per RAW (20-technomancer, 1-cost band) it now does
both halves of what the card claims:

* **Reshape** a sprite that is still standing into a different archetype. Same square, **full power**.
* **Rebuild** a sprite that was *just* destroyed, in the square it fell in, **at reduced power — half
  Stamina, rounded up, never below 1**.

The destroyed sprite is remembered on the caster (`flags.draw-steel-ghostwire.lastDestroyedSprite`) when
it hits 0 Stamina, and forgotten when the fight ends. A rebuilt sprite stays rebuilt: a later level-up
re-stamps its *reduced* pool, not a full one.

---

## Not in this wave

* The **rulebook compendium journals** (`src/packs/rulebook/`) are generated from `docs/raw/`, not from
  `docs/rulebook/`. This wave took the light-touch chapter pass the brief asked for
  (`docs/rulebook/07-street-priest.md`, `docs/rulebook/06-elementalist.md`); the in-Foundry journal still
  carries the old Street Priest text and should be picked up with the 0.4.0 reprint.
* No PDF rebuild, no paid-band redesign for either class.
* Trauma Patch's Bleeding clear (explicitly optional in the brief).
