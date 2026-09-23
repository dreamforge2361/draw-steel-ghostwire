# Skill-on-weapon rolls — Foundry checklist (0.3.102 / G4)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/g4-skill-on-weapon-smoke.mjs
node tools/chargen-wizard-smoke.mjs
node tools/kit-grants-smoke.mjs
node tools/g2-armor-gadget-mods-smoke.mjs
```

All must pass. **No packs were rebuilt this pass** — G4 is code only, so nothing in `src/packs/` changed and no `build-packs` run is needed.

Spike note: `docs/spikes/G4-B49-SKILL-ON-WEAPON-ROLLS.md` · Prompt: `docs/directors/_claude-g4-g3-prompt.md`.

---

## What shipped

| Line | Before | After |
|---|---|---|
| B49 weapon ability roll | `@chr` only — Firearms and Heavy Weapons changed nothing | the owning skill adds RAW's **+2** |
| Where the +2 shows | — | prefilled in the roll dialog's **Bonus** field, editable |
| Weapon SKUs mapped to a skill | 0 | **57** (every weapon in `src/packs/gear/weapons/`) |
| Existing sheets | — | work on the next roll; **no migration**, nobody's items are rewritten |

The benefit is a **+2 bonus**, not an edge — the same thing Draw Steel's own skill dropdown grants on a test. The Hacking edge (Wired) is unchanged and still an edge; the two stack normally on a wired weapon roll.

---

## The lock to check first

**A heavy-band melee weapon is Melee, never Heavy Weapons.** Warhammer, Slab-Hammer and Powered Greatsword all carry the kit keyword `heavy`, and mapping those to Heavy Weapons would be the obvious wrong answer.

- [ ] Hero with **Melee** only, holding a **Warhammer**. Roll *Strike with Warhammer* → Bonus shows **+2**.
- [ ] Same hero, same weapon, swap the skill to **Heavy Weapons** only → Bonus shows **0**.

---

## Setup

Make two heroes (or one hero you re-skill between passes). Give each a **Workhorse** (light firearm) and a **Chatterbox** (heavy weapon) from *Ghostwire Gear › Weapons*; both spawn their B49 ability automatically.

- **Gunner** — **Firearms** and nothing else from the action group
- **Trooper** — **Heavy Weapons** and nothing else

If a hero already had the weapons before this update, the ability is a pre-0.3.102 one. That is the interesting case — leave it alone and roll it; it should still get the +2.

---

## The main grid

| Hero | Ability | Bonus field should read |
|---|---|---|
| Gunner (Firearms) | **Fire Workhorse** | **+2** |
| Gunner (Firearms) | **Fire Chatterbox** | **0** |
| Trooper (Heavy Weapons) | **Fire Workhorse** | **0** |
| Trooper (Heavy Weapons) | **Fire Chatterbox** | **+2** |

- [ ] Gunner · Fire Workhorse → **+2**
- [ ] Gunner · Fire Chatterbox → **0**
- [ ] Trooper · Fire Workhorse → **0**
- [ ] Trooper · Fire Chatterbox → **+2**
- [ ] A hero with **neither** skill gets **0** on both.
- [ ] The +2 actually lands in the rolled total in chat, not just in the dialog.

---

## The rest of the mapping

- [ ] **Longshot** / **Apex Rifle** (longarms) — Firearms hero **+2**, Heavy Weapons hero **0**.
- [ ] **Hunting Bow** or **Heavy Crossbow** — Firearms hero **+2**. (Bows are "conventional ranged weapons".)
- [ ] **Wallbreaker** or **Siege Missile** in a hero's inventory — Heavy Weapons hero **+2**, *not* Gunnery. The `Mounted` tag does not make it a vehicle gun.
- [ ] **Thermite Charge** or **Shaped Charge** — **Demolitions** hero **+2**.
- [ ] **Frag** / **Gasser** / **Throwing Knife** — **0** for everyone, including a Demolitions hero. *(Deliberate: the lock names Demolitions for the two placed charges only. If you want the grenades in, say so — it is a one-line table change.)*

---

## Interactions

- [ ] **Wired + skill stack.** Firearms hero, **Jacked In**, rolling *Fire Workhorse*: the Wired **edge** and the Firearms **+2** both appear. They are different fields — edge in Edges, +2 in Bonus.
- [ ] **Hacking edge unchanged.** A Matrix Verb ability with the Hacking skill still gets its edge and **no** +2 (it is not a B49 weapon ability).
- [ ] **Non-weapon abilities untouched.** Rush, Take Cover, a class ability: Bonus field starts at **0**.
- [ ] **Editable.** Clear the +2 by hand in the dialog and roll — the roll honours the cleared value.
- [ ] **Targets.** With a token targeted, the +2 shows in that target's combined bonus too.
- [ ] **Free strikes.** The system's own **Melee/Ranged Free Strike** (no weapon behind them) stay at **0**.

## Cleanup / regressions

- [ ] Drop a new weapon onto a sheet → its ability appears as before and rolls with the right bonus first time.
- [ ] Delete the weapon → its ability goes with it, as before.
- [ ] Reload the world → no flood of item updates in the console, and no duplicate abilities.

---

## Result

- [ ] **PASS** — Michael, date:
- [ ] Notes / anything to reopen:
