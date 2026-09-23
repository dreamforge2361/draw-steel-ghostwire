# F15 — Cyborg System Crisis (0.3.117)

**Michael lock, 2026-09-23.** A full Cyborg does not bleed out. When they would enter the dying
track, they enter **System Crisis** — machine failure — and the Director rolls **2d6** on a table for
how bad it is.

Design-and-publish, plus one importable Foundry **RollTable**. There is deliberately **no automation
script** this wave: rolling the table is the Foundry support.

---

## What a Director does

1. A Cyborg hits the dying track. Say *System Crisis*, not *dying*.
2. Open **Cyborg System Crisis** from the Ghostwire **encounters** compendium (the same
   tables pack that holds Reach Events — City / Flats / Wilds). Right-click → *Import* if you want a
   world copy; otherwise open it straight out of the compendium.
3. Roll **2d6**. Optional modifiers: **−1** for a soft or scrapheap chassis, **+1** for a military or
   overclocked one. Apply it in your head or in the roll — the table clamps at 2 and 12 either way.
4. Read the row out. The result is public: everyone at the table should know whether the body on the
   floor is coming back this scene.

## The ladder

| 2d6 | Severity | What it is at the table |
|---:|---|---|
| 2–3 | **Brick** | Scene over for them. Carryable object. Back only on a Repair Project (goal 60) or a Machine God's Rite. |
| 4–5 | **Cascade** | One living Chrome Item takes a step of damage, then play it as Limp-Home. No chrome → Limp-Home with a bane on the reboot. |
| 6–8 | **Limp-Home** | The common one. Back up on a reboot, then slow and baned until a respite or a Field Repair. |
| 9–10 | **Soft Reboot** | Back up on a reboot, 1 Recovery, no lasting penalty. |
| 11–12 | **Failover** | Barely happened. 1 Recovery, stand up, keep going — **once per respite**. |

The curve is the design: **Limp-Home is the default outcome** (6–8 is a third of all rolls), Brick
and Failover are the tails.

## Reboot

An adjacent ally with **Repair, Medicine, or Cybertech** — or any Wrench or Medic — spends a
**maneuver** and makes a Power Roll to bring the chassis online.

A Cyborg can self-reboot only on **Soft Reboot** or **Failover**, and only with at least 1 Recovery
left. A **Brick** never field-reboots without the Project or a named ability that says it does.

## What Crisis is **not**

This is the part worth reading twice, because three different systems sit next to it.

- **Not organic dying.** No dying saves, no dying strikes, no death at 3 failures. Magic healing does
  nothing at all — not reduced, nothing. Tech repair is the whole recovery path.
- **Not F12 chrome damage.** Suppressed / Damaged / Destroyed is the **living Chrome Item** track
  (`09`, `docs/directors/f12-chrome-damage.md`). It is **never** the Cyborg's own Crisis state. The
  only row that touches chrome at all is **Cascade**, and it does so through the ordinary chrome
  track, one step, stopping at Destroyed.
- **Not a Body Integrity debit.** BI 25 and the living Chrome the player bought are unchanged. Crisis
  does not open a second Integrity track and never will.
- **Not Item deletion.** Nothing on this table removes an Item from a sheet.

## NPC Cyborgs

Crisis is for **full Cyborgs**: the People, and any NPC the Director flags as one. A chromed-up human
with a lot of installs is not a Cyborg and uses the ordinary dying rules. If you want a corp enforcer
to brick instead of bleed, decide that before the fight and tell the players — it changes how they
fight it.

For a mook, skip the table and rule **Brick**; it is the answer that keeps the scene moving. Save the
roll for named NPCs and heroes.

## Scope

- No auto-trigger script. Nothing watches Stamina and pops the table for you.
- Frame Modules stay deferred. The table mentions no module cascade and requires none.
- Cyborg BI 25 and living-Chrome purchasing rules are untouched by this wave.

## Files

- `src/packs/encounters/cyborg-system-crisis.json` → the **encounters** compendium
- `docs/raw/04-combat.md` § Cyborgs — System Crisis — the full RAW table
- `docs/raw/05-ancestries.md` § Cyborg hard constraints — the chargen-facing line
- `tools/f15-cyborg-crisis-smoke.mjs` — `node tools/f15-cyborg-crisis-smoke.mjs`

The table is **hand-authored**, not generated from `docs/masters/encounters` like the zone tables.
`tools/encounters-to-tables.mjs` keeps it on a regen; do not remove that guard.
