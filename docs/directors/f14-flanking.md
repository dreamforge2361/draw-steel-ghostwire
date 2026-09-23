# F14 — Flanking (0.3.117)

**Michael lock, 2026-09-23.** Two allies on **opposite sides** of a target give **melee strikes**
against that target **one edge**. Ranged never gets it. It is **auto-detected from where the tokens
are standing** — there is no pill a player clicks to claim a flank.

Sibling to F13 Cover/Conceal, same seam, opposite sign: Cover banes the shooter, Flanking edges the
one with the knife.

---

## What a Director does

Nothing. That is the feature.

Move tokens. When two enemies of a target end up on opposite adjacent sides of it, the melee attacker
sees **+1 edge** for that target in the roll dialog, and the target picks up a small **Flanked**
marker. Move one of them off the line and both are gone on the next roll.

If a Director rules otherwise — a weapon that swings and shoots, a familiar, an odd bit of terrain —
clear or add the edge in the roll dialog. It is one click and it is visible before the dice move.

## What it does mechanically

**One edge. Melee strikes only. On the roll that targets the flanked enemy.**

Like F13, it rides Draw Steel's own per-target modifier seam, which buys the same three things: it
lands on the right roll in a multi-target attack, the player sees it in the dialog before the dice
move, and it stacks correctly with everything else the system already computed.

It never stacks with itself. Three allies boxing someone in is still one edge, however many opposite
pairs the geometry can find.

## What was already there, and what F14 actually adds

Draw Steel 1.1.2 **already ships flanking**: `Token#isFlanking`, and `getTargetModifiers` already
adds an edge for a `melee` + `strike` ability from a flanking token. Ghostwire does not re-implement
that and, above all, does not add a second edge on top of it — the guard is in
`scripts/flanking.mjs` and the smoke asserts it.

What F14 adds is the four things the system does not know about Ghostwire:

| | |
|---|---|
| **`cannotBeFlanked`** | `flags.draw-steel-ghostwire.cannotBeFlanked = true` on an **Actor** — never flanked, by anything. The generic version of Mutant **Prehensile Mutation**, for a construct, a Director ruling, or a future People. Patched onto `canBeFlanked`, so it reaches every call site at once. |
| **meat-inert bodies** | A Rigger Jumped In to a drone leaves a body standing in the room. The system sees a live, undefeated token and would let it hold a side. It is not holding anything. Same for unconscious and defeated. |
| **the unselected attacker** | The system reads `canvas.tokens.controlled[0]`, so rolling a melee strike from the character sheet with nothing selected silently drops the flank. Ghostwire resolves the attacker's own token and fills that gap. |
| **the Flanked marker** | So the table can see the geometry without opening a roll dialog. |

**Prehensile Mutation already works today** — the Mutant trait sets `system.statuses.flankable` to
false, which is exactly the switch the system reads. The new flag is for everything that is not that
trait.

## Opposite sides, decided how

Square grid, Foundry default. Target **T** is flanked when two enemies **A** and **B** are both
adjacent to T (Chebyshev 1, diagonals included) and the step from A to T points the same way as the
step from T to B.

| Where they stand | Flanked? |
|---|---|
| W + E, or N + S | **yes** — opposite cardinal |
| NW + SE, or NE + SW | **yes** — opposite diagonal |
| W + N (two adjacent corners) | no |
| NW + SW (same side of the target) | no |
| on the right line but two squares out | no — not adjacent |
| three allies, no opposite pair among them | no |
| target has `cannotBeFlanked` / Prehensile | **never** |

Large and bigger bodies use the centre of the squares they occupy, which for an even-sided token is
a half-square. A Large ally holds the far side when the line through the target really passes through
both centres. That is the simple test the brief asked for; where it reads a near-miss on an odd
oversized layout, add the edge in the dialog.

## The marker

`ghostwire-flanked`, on the **target**. It is **computed**, not toggled: it is deliberately kept out
of the token HUD status palette that F13's Cover/Conceal lives in, it is written only by the GM
client, and it recomputes on token movement, creation, deletion, combat updates, and on any status
change that takes a body out of the fight.

Turn it off in world settings (*Show the Flanked marker*) if it is visual noise. **The melee edge
applies either way** — the marker is a readout, not the rule.

## Scope

- **Melee strikes only.** A melee *area* or a melee utility ability is not a strike and gets nothing.
- **`meleeRanged` weapons read as no edge.** Same honesty rule as F13: nothing in the use pipeline
  says which mode the player picked, and quietly edging a shot is the worse error.
- **Familiars:** Director adjudicates. A familiar token that is adjacent and hostile to the target is
  treated like any other body by the geometry; if that is not the ruling you want at your table,
  clear the edge in the dialog.
- **Not in this pass:** cover tiers, opportunity-attack changes, facing rules beyond opposite sides,
  3D levels.

## Running it

- **Flanking is a reward for footwork, not a tax on the Director.** It fires on its own; let the
  players notice it and start moving for it.
- **Say the marker out loud the first time.** Once the table has seen one Flanked token appear and
  vanish as someone steps off the line, nobody asks again.
- **Cover and flank both apply.** A flanked target behind a dumpster still gives a ranged shooter a
  bane (F13) and a melee attacker an edge (F14). They are different rolls.

## Files

- `scripts/flanking.mjs` — geometry, the edge, the marker
- `docs/raw/04-combat.md` § Positioning and movement — the RAW paragraph
- `tools/f14-flanking-smoke.mjs` — `node tools/f14-flanking-smoke.mjs`
