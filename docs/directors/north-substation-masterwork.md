# North Substation — Director cue sheet and Foundry alignment

**Locked 2026-09-25 (0.3.142).** The player-facing prose lives in the rules: **The Wired System** →
*North Substation — a worked Wired run* (`docs/raw/21-the-wire.md`, and the Rulebook journal page of
the same name). This page is the Director's half: what to press, what the Console shows, what to say
when a player asks, and the three places tables get the Wired half of a fight wrong.

Nothing here is a new rule. If this page and the rules chapter ever disagree, the chapter wins.

---

## 1. The host, on one line

*Power Co — North Substation.* Node Rating **3**, **Track 2**. Breach **medium**.
ICE **passive + 1 active**. Integrity **26**. Biofeedback Value **8**. Trace Alert **0**.

Room-scale Track 1 objects hanging off it: **Maglock Door 1**, **Light Control**, **Turret feed**.

**The crew.** Vira — Hacker, Logic 3, **street deck** (Biofeedback Resistance **2**), Bandwidth 6.
Kade — Operator, all meat, no interface.

Every downstream number is already fixed by the Rating. You do not invent any of them:

| From Rating 3 | Value |
|---|---|
| Breach difficulty | medium |
| ICE layers | passive + 1 active |
| Integrity | 26 |
| Biofeedback Value | 8 |
| Alert contribution | the standard Trace Alert table — nothing Rating-specific |

## 2. Cue sheet, act by act

| Act | What the player does | What you answer | What moves |
|---|---|---|---|
| **0** | Connect → **Linked**; Broadcast to Kade; Toggle → **Overlay** | Put the System Stat Card on the table | Nothing. Linked is comms only |
| **1** | Scan; **Deep Scan**; Ping Light Control; Search | Deep Scan names Maglock Door 1, Light Control, Turret feed, Watchdog | No Alert — Scan and Deep Scan only look |
| **2** | Read/Write the maglock (middle, zero trace); **Seize Control** rolls **low** | "+1 Alert, and the active ICE bites once" | Alert **0 → 1**; **2 Stamina** to Vira |
| **3** | **Compile Agent → Special Agent** | Roll first, tier buys the budget, *then* ask the purpose | 3 Bandwidth; `Actions (2): spoof the turret lock…` |
| **4** | Program at Integrity; Toggle → **Jacked In** | Alert crosses 5: bank **+1 Malice**. Spend it on an ICE surge | Integrity **26 → 21**; **10 Stamina** to Vira |
| **5** | Stays immersed at Alert **9** | One hunt bite at the **end of each of her turns** | Stamina runs out → **Winded floor**, held at **1** |
| **6** | Decompile; **Jack Out** | "The Alert stays at 11. It will be at 11 next week." | Agent gone; Vira Disconnected; Alert persists |

### The two bites, spelled out

Both are the same four steps. Only step 2 changed.

```
Act 2 — Overlaid, reactive ICE on a low roll
  base 8 (Rating 3)  →  Overlay ×0.5 = 4  →  − resistance 2  →  2 Stamina damage

Act 4 — Jacked In, Director Malice ICE surge
  base 8 (Rating 3)  →  Jacked In ×1.5 = 12  →  − resistance 2  →  10 Stamina damage
```

Say the arithmetic out loud at the table the first time. The gap between 2 and 10 is the entire
argument for staying Overlaid, and a player who has heard it once makes the Toggle decision
themselves for the rest of the campaign.

## 3. The three things tables get wrong

**1. ICE does not attack every round.** It bites on four triggers and nothing else:

1. a **low (≤11)** Wired Power Roll against a host with **active ICE** (Rating 3+);
2. a **failed breach** at Rating **4+**;
3. **Trace Alert 9–11** — the hunt bite, at the **end of each of the runner's turns**, while they are
   still Overlay or Jacked In on that host;
4. a **Director Malice ICE surge**.

Passive ICE at Rating 1–2 is flavour and deals nothing. **Linked deals nothing**, on any trigger.
Host ICE bites **the compiler** — not the crew, not the construct. If you want ICE with its own
initiative slot, stat it as a **creature** (the Bestiary's **Black ICE**, a level 6 elite hexer) and
put it on the board where the table can see it coming. That is a different thing from a host's ICE
layer, and the chapter now says so.

**2. Biofeedback cannot kill.** Biofeedback that would take a hero to 0 Stamina leaves them at **1**,
**Winded and not Dying**, regaining 1 per turn until stabilized. The floor never heals — at 1 they
stay at 1 — and it covers Biofeedback **only**. The moment corp security puts a round into Vira's
inert body, that damage is not floored and she goes down for real. The floor is a promise about the
wire, not about the room. Same floor for **Technomancer overreach** (`docs/raw/20-technomancer.md`):
one rule, two sources, identical wording in both chapters.

**3. Agents and sprites are Wire-only.** A Special Agent spoofs a turret lock, holds a feed, walks a
door's logic. It does **not** pull a downed runner out of a corridor, carry the case, or block a
doorway with its body. Its scene token is a **roster anchor** (Lock A), not a second fighter. A
Director who allows one meat action has handed the Hacker a free extra body in every fight for the
rest of the campaign. When a player asks for one, the answer is *"name a node and I'll allow it."*

## 4. Foundry alignment

Everything in the cue sheet has a control. Nothing in it needs a house rule.

| Beat | Where it lives in the module |
|---|---|
| The host card | Wired Console → node templates, Rating 1–5. Exposes **Integrity**, **Biofeedback Value**, **ICE layers** and **Trace Alert** on the node |
| Connect / Toggle / Jack Out | Node applet, or the **Cycle Wire State** macro. Connect lands in **Linked**; Toggle steps Linked → Overlay → Jacked In → Linked |
| Verb refusals | **Broadcast** works at Linked. **Scan / Ping / Navigate / Search / Read-Write / Programs / payload Runs / Compile Agent** refuse until Overlay or Jacked In, with a notification naming the state |
| Deep Scan, Seize Control | The Hacker's own ability cards (Programs) |
| Compile Agent → Special Agent | Last entry in the Compile Agent picker. Rolls, tier buys 1 / 2 / 3 Actions, then prompts for the purpose and stamps `Actions (N): …` onto the summoned Actor |
| Decompile | **Decompile Agent**, the Constructs roster ✕, 0 Stamina, or end of encounter |
| Constructs visibility | Console **Constructs** pane. Overlay / Jacked In compilers on the same scene see each other's constructs with no Scan. Meat tokens are not Wire eyes |
| The two bites | **Director: Apply Biofeedback** (Ghostwire Macros). Pick Rating 3, leave state and resistance on **Auto**, and it prints `base 8 → Overlay 4 → −2 → 2` and writes the Stamina |
| The Winded floor | The same macro. It holds the hero at 1 Stamina and says so on the card |
| Trace Alert | Console, per node, 0–12. Steps 5–8 are your Malice; 9–11 is the hunt bite; 12 is lockout and counter-trace, then reset to **6** |

**Running the macro.** Target the runner's token (or select it), press **Director: Apply Biofeedback**,
and answer:

- **Host Node Rating** — 1–5, which fills the base from the printed table (3 → 8).
- **Custom base** — leave blank unless the fiction wants a number off the table. Filling it overrides
  the Rating.
- **Connection state** — leave on **Auto**. It reads the runner's own `ghostwire-linked` /
  `ghostwire-overlay` / `ghostwire-jacked-in` status, the same state the Console roster shows.
  Override only when you are resolving a bite from a moment that has already passed.
- **Biofeedback Resistance** — leave on **Auto**. It reads the best **deck** the runner is carrying
  (`biofeedbackResistance`, a per-Echelon number) and multiplies by their Echelon. A Technomancer or
  a runner on a bare commlink auto-detects **0**, which is correct. Override for **Hardened Rig**,
  **Anchor Point**, **Guardian Angel in the Net** and any other printed reduction — those are cards
  you are reading, not fields the macro can see.
- **ICE trigger** — chat flavour only, but naming it on the card is how the table learns the four.

Off-the-rack deck resistance, per Echelon: **Scrapdeck 1** · **Street Deck 2** · **Ghostbox 2** ·
**Blackdeck 3** · **Fairlight Ghost 3**.

## 5. Technomancer variant

Same hour, three differences:

- **Compiles from Linked.** Sprites are Resonance, not software — a Technomancer at Linked pays no
  meat bane and takes **no Biofeedback at all**, and can still put a sprite on the board. A Hacker
  cannot; Compile Agent refuses below Overlay. This is the single biggest posture difference between
  the two classes and it is worth pointing out at the table.
- **Special Sprite is the same order** as Special Agent — roll, tier buys 1 / 2 / 3 Actions, then the
  purpose — and the same **Wire-only** guardrail.
- **Overreach is their own Biofeedback.** 5+ Resonance on one ability → **Physique test** by cost
  band → fail means Persona-score damage, resolved on the sheet and in chat rather than by this
  macro. Same **Winded floor**.

---

## VOIDMARK probes

These should each land on the right chunk (`node tools/voidmark-smoke.mjs`, and the wave smoke
asserts them):

- *"how does biofeedback work"* → the Biofeedback procedure, The Wired System
- *"does ICE attack every round"* / *"ICE bite"* → the ICE attack triggers
- *"north substation"* → this worked run
- *"can my agent pull a downed runner out"* → Wire-only, and the answer is no

Smoke: `node tools/wave-03142-smoke.mjs`. Foundry checklist: `docs/directors/03142-smoke.md`.
