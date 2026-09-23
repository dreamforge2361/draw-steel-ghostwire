# S9 — the Wire-state toggle (0.3.116)

**Michael lock, 2026-09-23.** A Rigger picks between **Jumped In**, **Linked** and **Overlay** from
one door, and it writes **the same flags Jump-In, Deploy and the Wired Console already write**.

The states existed. The rungs existed. What did not exist was a player-facing way to move between
them that did not mean typing a Matrix Verb or asking the Director to toggle a status by hand. The
Comlink/Deck double-duty problem was a UI problem, and this is the UI.

---

## What a player sees

Two doors, the same picker behind both:

- **The token HUD.** Select your token, and there is a broadcast-tower icon in the left column.
  It is coloured by the rung you are on: green Linked, cyan Overlay, hot pink Jumped In.
- **The hero sheet.** A chip next to the hero's name saying the rung, in the same colours.
  Clicking it opens the same picker.

Either one opens **Wire state**: three radio rows, each with the rung and a one-line reminder of
what it costs you, plus a line at the bottom saying which frame a Jump-In would take the seat in —
or that there isn't one.

Pick, press **Switch**, and Ghostwire does the whole move: toast every time, and a short chat card
if the Director has left that setting on.

## The three rungs

| Rung | On-net? | Full Connected? | Meat body |
|---|---|---|---|
| **Linked** | yes, soft | no | normal |
| **Overlay** | yes | **yes** | bane on real-world power rolls |
| **Jumped In** | yes | **yes** | **inert** — no real-world power rolls |

**Jumped In is not Jacked In.** Jacked In is a Matrix state a deck reaches with no machine in it —
the Toggle Connection State verb still walks Linked → Overlay → Jacked In → Linked, and that ladder
has not changed. Jumped In is Jacked In *plus a seat*: the pilot carries `jumpedInto`, the machine
carries `jumpedInBy`, and the body is inert because the pilot **is** the machine.

Both carry the `ghostwire-jacked-in` status, so **both are full Connected** for the F12 chrome-strike
/ matrix Pulse path. **Overlay stays valid Wire Connected**, exactly as it was. Linked stays soft
on-net: comms, ID, packets, Broadcast — no Scan, no Runs.

## What it refuses, and why

- **Disconnected.** The toggle moves you *between* rungs; it is not an on-ramp. Get on-net with
  **Connect** — which needs a comlink, deck, rigger interface, datajack, trodes, or Technomancy —
  and get off with **Jack Out**. Routing around that gate from a HUD button would have made the
  interface requirement decorative.
- **The rung you are already on.** Re-picking Jumped In would re-stamp meat-inert; it is a no-op.
- **Jumped In with no frame.** You need exactly one Jump-In-capable machine targeted, controlled, or
  fielded. Several machines and none targeted is a refusal, not a guess — the same rule Jump-In
  (Signature Platform) has used since 0.3.111, reported in Jump-In's own words.

## Leaving the seat

Choosing **Linked** or **Overlay** while Jumped In runs the real **Jump-Out** first: `jumpedInto` and
`jumpedInBy` are cleared, the meat-inert effect is deleted, a Facility Rigger's Home Ground edge is
deleted, and `ghostwire-jacked-in` comes off. *Then* you land in the rung you picked.

A pilot is never left holding `jumpedInto` with no seat, and **meat-inert exists only while Jumped
In** — the smoke asserts both, and asserts it for every rung, not just the happy path.

Jump-In's own ability allowlists are untouched: the seat abilities (Deploy & Command, Rigged Fire,
Field Repair, the fleet and platform actions) and 0.3.114's mounted-weapon seat fire all still work
from the seat exactly as they did.

## What a Director should know

- **Nothing new was invented.** The toggle registers no status, writes no Actor flag directly, and
  creates no Active Effect. Linked and Overlay go through `setWiredState()` in
  `scripts/module.mjs`; Jumped In goes through `jumpIn()` / `jumpOut()` in
  `scripts/rigger-vertical.mjs`. `tools/wire-state-toggle-smoke.mjs` asserts the *absence* of a
  parallel flag namespace as hard as it asserts the presence of the door, so a later pass cannot
  quietly grow a second state system here.
- **Three settings**, all world-scope except where noted, under Ghostwire in Configure Settings:
  *Wire state toggle on the token HUD*, *Wire state chip on the hero sheet*, and *Announce Wire
  state changes in chat*. Turn either door off if your table only wants one. The toast always fires.
- **Owners and the Director only.** The button appears on hero tokens the user owns.
- **The Matrix Verbs still work.** Connect, Toggle Connection State and Jack Out are unchanged, and
  a hero who uses them sees the HUD and chip follow, because the statuses are still the truth and
  the toggle only ever reads them.

## Running it

- **Give the Rigger the HUD button and stop narrating state changes.** The whole point is that
  "I drop to Linked and keep talking" is one click, not a conversation.
- **Jumped In is the one with teeth.** The body is inert. If the crew leaves a jumped-in Rigger in
  a corridor, that is a corridor with a sleeping person in it.
- **Watch for the seat refusal.** "No machine to jump into" usually means the drone is not fielded
  yet, or that two frames are out and neither is targeted. Target one.

## Files

- `scripts/wire-state-toggle.mjs` — the plan helpers, the picker, the two doors.
- `scripts/module.mjs` — one registration line, handing over `getWiredState` / `setWiredState`.
- `lang/en.json` — `GHOSTWIRE.WireToggle`.
- `styles/ghostwire.css` — HUD button, sheet chip, picker rows, chat card.

## Smoke

    node tools/wire-state-toggle-smoke.mjs
    node tools/linked-wire-state-smoke.mjs
    node tools/rigger-vertical-smoke.mjs
    node tools/jumpin-mounted-fire-smoke.mjs

No pack rebuild — scripts, lang and CSS only.
