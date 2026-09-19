# Tests and Power Rolls

**RAW status:** draft (Stage 3 fill 2026-09-18)  
**Sources:** `docs/rulebook/DS-ALIGNMENT.md`, `docs/rulebook/TOC-PROPOSAL.md` (LOCKED), `docs/rulebook/08-hacker.md`, `docs/rulebook/18-wired-foundry.md`, `docs/rulebook/17-perks.md`, `docs/raw/21-the-wire.md`  
**Engine:** Draw Steel Heroes — use the official rules for shared engine procedures (tests, edges/banes math, skills on tests, saving throws, hero-token economy, negotiation and projects). Ghostwire remaps and table procedures below are original wording.

---

## What a test is

A **test** is any moment when a runner tries something uncertain and the outcome matters. Lying to a corp handler, sprinting a blind corner, forcing a locked node, keeping a dying teammate upright — those are tests. Asking what the street smells like, or checking whether the door is unlocked when nobody is watching, is not.

The Director calls for a test when **both** are true:

1. Success is not guaranteed from the fiction and the runner’s tools.
2. Failure — or a middling success — would change something the crew cares about (time, heat, Stamina, Trace Alert, a contact’s trust, the score).

Do not roll for trivia. Do roll when the run is on the line.

Most tests resolve as a **Power Roll**. Some abilities skip the roll entirely (“no Power Roll”); those still count as actions, just not as dice.

---

## The Power Roll

When a runner acts under pressure, they make a **Power Roll**:

1. Name what you are trying to do and which **characteristic** drives it (**Physique**, **Reflex**, **Logic**, **Instinct**, or **Persona** — see `02`).
2. Roll **two ten-sided dice**.
3. Add the characteristic’s score (and any flat bonuses the ability or gear names).
4. Apply **edges** and **banes** (below) before you total.
5. Read the total against the three **results**. Ghostwire always prints them weakest first:

| Result | Total |
|---|---|
| **Low** | 11 or less |
| **Middle** | 12–16 |
| **High** | 17 or more |

Abilities, weapons, Matrix Verbs, and gear print what each result does. Where text says **“improve the outcome by one result,”** low becomes middle, or middle becomes high. High does not climb further unless an ability says so.

**Doctrine lock:** print order is always **low → middle → high** (≤11 / 12–16 / 17+). Never invert the ladder. Never invent a fourth band.

> **In Foundry**
> Use abilities from the hero sheet (or hotbar). Draw Steel posts an **abilityUse** chat card with the Power Roll; Ghostwire SFX (B40) may play when the card lands. The module adds edges/banes automatically where it can: **Hacking** and **Jacked In** on Wired rolls, **Overlay** bane on real-world rolls, suite software edges, and **Weave Strain** bane on Magic/Veil/Resonance rolls when over the caster soft-cap. Freeform Director tests with no ability still need a manual roll or a named ability.


### Which characteristic?

Use the characteristic the ability names. If the Director calls a freeform test:

| Characteristic | Typical tests |
|---|---|
| **Physique** | Force a door, hold a line, endure pain, lift, break |
| **Reflex** | Aim, vault, sneak past a camera, catch a fall, drive under fire |
| **Logic** | Hack, diagnose hardware, crack a puzzle, plan a breach route |
| **Instinct** | Spot the tell, sense the ambush, read the room, feel the Wire |
| **Persona** | Negotiate, intimidate, rally the crew, sell the cover story |

Wired work almost always keys **Logic** (analysis, intrusion) or **Instinct** (presence in the Wire). Class chapters override when they name a different characteristic.

---

## Skills on tests

Ghostwire’s skill list replaces Draw Steel’s list (`02`). Skills work on tests the same way Draw Steel’s skills do: if you have a relevant skill, you get that engine’s skill benefit on the Power Roll.

**Ghostwire exception — Hacking:** having the **Hacking** skill gives an **edge** on every rolling Matrix Verb and other **Wired** Power Roll. For those rolls it replaces the usual skill benefit. Details and Verb list live in `21`.

Other Technical skills (Electronics, Repair, Cybertech, Security Systems, …) still use the normal skill benefit on meatspace and downtime tests — including §Craft Projects (`08`, `10`).

---

## Edges and banes

An **edge** means the situation favors you. A **bane** means it fights you. Edges and banes come from kits, chrome, mods, connection state, cover, conditions, Director calls, and ability text.

### How they stack

- One edge and one bane **cancel**. Count what is left.
- Two edges (after canceling) is a **double edge**.
- Two banes (after canceling) is a **double bane**.
- More than two of the same side still resolve as a double edge or double bane — you do not keep stacking forever.

Exactly how extra dice are kept or dropped follows Draw Steel Heroes. Ghostwire only cares that you **net** edges against banes before you roll, then read **low / middle / high** from the final total.

### Common Ghostwire sources

| Source | Typical modifier |
|---|---|
| Relevant skill (non-Hacking Wired exception above) | Skill benefit per Draw Steel |
| **Hacking** on Wired Power Rolls | **Edge** (`21`) |
| Connection **Overlay** on real-world rolls | **Bane** (`21`) |
| Connection **Jacked In** on Wired rolls | **Edge** (`21`) |
| Medium / heavy armor encumbrance | Banes on named tests (`08`) |
| Mods, suite software, chrome | Situational edges (`09`, `10`, `19`) |
| **Damaged** implant | Penalty or bane as chrome text says (`09`) |
| Flanking, cover, conditions | As Draw Steel combat; GW keywords in `04` |
| Ally assist (below) | Usually an edge for the primary roller |

If two rules both want to give “an edge on this roll,” they stack until cancel math applies — they do not silently overwrite each other unless an ability says it replaces another benefit (as Hacking does for Wired rolls).

---

## Natural doubles and criticals

When both ten-sided dice show the **same face** before modifiers, that is a **natural double**.

A natural double is Ghostwire’s cue for a **critical** on that Power Roll. In practice:

- Treat the roll as the ability’s **high** result if the total would not already be high — or apply the critical rider Draw Steel Heroes defines for power-roll crits, whichever the table is using for shared-engine consistency.
- If the ability already lists a special line for criticals, use that line.
- On Wired rolls, a critical often means a **clean** intrusion: the Verb or Program lands at its best printed effect, and Trace Alert usually does **not** tick from that roll unless the ability’s high or critical clause says otherwise (`21`).

A natural double is about the **dice faces**, not the final total. Adding a characteristic cannot create a double; canceling edges and banes cannot remove one that already showed.

Director fiat can still narrate a stylish high without a double. The double is the mechanical guarantee.

---

## When you roll vs when you don’t

**Roll** when uncertainty and stakes both exist (see What a test is).

**Do not roll** when:

- The runner has all the time, tools, and access the fiction grants, and nothing opposes them.
- An ability says **“No Power Roll”** — the effect just happens (cost and targeting still apply).
- The runner is **Jacked In** and trying a real-world physical action — there is no roll because the body cannot act (`21`). Pick another runner, jack out, or Toggle to Overlay.
- Success is automatic from a prior high result, a spent resource, or a feature that skips the dice.

**Auto-fail or auto-succeed** only when the Director and the fiction agree the attempt is impossible or trivial. Do not hide a “you just fail” behind a fake roll.

---

## Contested rolls

Sometimes two sides pull against each other: a Scout shadows a corpsec lieutenant; a Hacker Breaches while ICE pushes back; a Commander’s Persona argument meets a fixer who will not blink.

**Contested Power Roll (Ghostwire table procedure):**

1. Each side makes a Power Roll with the characteristic the Director names (or the ability names).
2. Apply edges, banes, skills, and connection modifiers to each side separately.
3. Compare totals. The higher total wins. On a tie, the Director breaks it from the fiction (usually the defender holds, or the status quo remains) unless an ability says otherwise.
4. If the contest uses printed low/middle/high effects (common on Matrix Verbs and social Marks), read **each** roller’s result band for their own side effects (Trace Alert, Marks, conditions), then use the comparison to see who achieved their goal.

Opposed tests, group tests, and montage tests follow Draw Steel’s structures; Ghostwire only remaps characteristic names, skill lists, and Wired modifiers. Perk text that mentions group or montage tests (`11`) spends **hero tokens** as written there.

---

## Helping and assisting

Crews survive by covering each other.

**Assist (simple):** when fiction allows (same scene, able to contribute, not Jacked In and inert while the ally acts in meatspace), an ally can spend their relevant action or maneuver — as Draw Steel’s help/assist timing requires — to grant the primary runner an **edge** on one Power Roll. The helper narrates how: covering fire, a spoofed badge ping, a whispered tell, a brace under the vault door.

**Limits that keep assists honest:**

- You cannot assist a roll you could not meaningfully affect (wrong board, no tools, unconscious).
- A **Jacked In** runner can assist **Wired** rolls from the Wire board; they cannot assist hallway gunfights until they Toggle or jack out.
- One primary roll normally takes **one** assist edge unless an ability explicitly stacks more help.
- Assist does not replace a contested roll’s opposing side — it only sweetens your crew’s roll.

Some perks and class features change assist math (ignore a low-assist bane, share a skill into a montage, and so on). Those override this baseline when they apply (`11`, class chapters).

---

## Heroes’ Fortune (hero tokens)

Ghostwire keeps Draw Steel’s table-luck currency under the name **Heroes’ Fortune**. The spendable chips are **hero tokens**.

Use Draw Steel Heroes for how many tokens the table starts with, when the pool refreshes, and the default spends (rerolls, dramatic saves, and other shared-engine options). Ghostwire adds:

- **Perks** that spend hero tokens for specific street tricks (`11`) — project double-downs, montage skill sharing, lie detection, and similar.
- Flavor at the table: tokens are the crew’s shared grit and luck, not ¥ and not a class heroic resource. Adrenaline, Bandwidth, Conviction, and the rest never convert into hero tokens or the other way around.
- Director guidance: spend tokens to keep a run cinematic when the dice go cold; do not require a token to attempt something the rules already allow.

If a perk and a default Heroes’ Fortune spend both want the same moment, the player chooses one spend — you do not double-dip the same token.

---

## Potency, resistance, and saving throws

Some effects ask a target to resist with a characteristic — often written as **potency** keyed to Physique, Reflex, Logic, Instinct, or Persona. Use Ghostwire names everywhere; the numbers and resist procedure are Draw Steel’s.

**Saving throws** (end-of-turn shakes against lasting conditions, and similar) also use the shared engine as written. Ghostwire conditions and keywords (`04`) ride on top; they do not invent a second save ladder.

Biofeedback, Trace Alert, and Wire Integrity are **not** saving throws — they are Wired systems (`21`).

---

## Negotiation and projects (pointer)

**Negotiation** with fixers, patrons, and level-bosses uses Draw Steel’s negotiation engine. Ghostwire only reskins the faces and the stakes (¥, access, heat). Motivations and pitfalls still apply.

**Projects** (including Ghostwire **§Craft**) use project Power Rolls in downtime. Technical hosts typically roll **Logic** with Hacking, Electronics, Repair, or Cybertech (`08`, `10`). Hero-token perk spends on projects are listed in `11`.

---

## Ghostwire modifiers (summary)

### Connection states

Your connection to the Wired changes your rolls. Full rules: `21-the-wire.md`.

| State | Wired Power Rolls | Real-world Power Rolls |
|---|---|---|
| Disconnected | — | — |
| **Overlay** | — | **Bane** |
| **Jacked In** | **Edge** | Not allowed — your body is inert |

A **Wired** roll is any Power Roll for a Matrix Verb, Program, or other ability with the **Wired** keyword.

### The Hacking skill

Having **Hacking** gives an **edge** on every rolling Matrix Verb and other Wired Power Roll, replacing the usual skill benefit for those rolls (`21`).

### Gear, chrome, and armor

- **Encumbrance:** medium and heavy armor impose banes on some tests (`08`).
- **Mods** and installed Wired software can add edges to named rolls (`10`, `19`).
- **Chrome** grants situational edges; a **Damaged** implant works at a penalty (`09`).
- **¥ never buys a better Power Roll.** Money buys the tool you already trained to use (`08`).

### Result wording in Ghostwire text

Abilities, perks, and gear print effects by **low / middle / high**. Where a Wired ability says low “works, but something goes wrong,” that usually means **Trace Alert** rises (`21`). Meatspace lows usually mean complication, heat, or partial success — the Director names the cost from the fiction.

---

## Engine by reference

| Rule | Use from Draw Steel Heroes | Ghostwire |
|---|---|---|
| Making a test | As written | Characteristic names per `02` |
| Test difficulty / when to call a roll | As written | Stakes guidance in this chapter |
| Power Roll dice and result bands | As written | Always print **low / middle / high** (≤11 / 12–16 / 17+) |
| Edges and banes (including doubles) | As written | Connection states; Hacking edge; GW gear/chrome |
| Skills in tests | As written | Ghostwire skill list (`02`); Hacking exception (`21`) |
| Natural doubles / criticals | As written | GW voice + Wired clean-crit note above |
| Opposed, group, and montage tests | As written | Assist baseline above; perk spends (`11`) |
| Potency and resisting effects | As written | Ghostwire characteristic names |
| Saving throws | As written | — |
| Heroes’ Fortune / hero tokens | As written | Perk spends (`11`); not convertible to ¥ or class resources |
| Negotiation | As written | Patrons and fixers |
| Projects | As written | §Craft uses Hacking, Electronics, Repair, or Cybertech (`08`, `10`) |

---

## Quick examples

**Meatspace lie.** Runner greases a lobby guard with a cover story. Director calls **Persona** + Deception. Overlay is on → bane on the real-world roll. Net: skill benefit vs overlay bane, then read low/middle/high for how hard the guard buys it.

**Wire breach.** Hacker is **Jacked In**, has **Hacking**, runs Breach. Wired roll gets the Jacked In edge **and** the Hacking edge (net double edge unless something else bans). Low still risks Trace Alert per `21`.

**Contest.** Scout (Reflex + Stealth) vs patrol lead (Instinct + Perception). Compare totals; Scout’s low might mean “seen but not IDed” if the ability or Director frames partial outcomes.

**Assist.** Medic is not in the fight line but can shout a dosage cue — spends the assist timing to give the Operator an edge on the next Physique check to stay standing.

---

## Where to go next

| Topic | Chapter |
|---|---|
| Characteristics and skills | `02` |
| Combat loop, Stamina, heroic resources | `04` |
| Kits, armor encumbrance, ¥ | `08` |
| Chrome penalties and edges | `09` |
| Mods and §Craft | `10` |
| Perks that spend hero tokens | `11` |
| Connection states, Trace Alert, Matrix Verbs | `21` |

This chapter tells you **how uncertain actions resolve**. Combat timing lives in `04`. The Wire’s second battlefield lives in `21`. When this book and Draw Steel Heroes disagree for Ghostwire play, **this book wins**.
