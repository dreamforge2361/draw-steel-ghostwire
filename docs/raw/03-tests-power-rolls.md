# Tests and Power Rolls

**RAW status:** draft (Stage 3 fill 2026-09-18)  
**Sources:** `docs/rulebook/DS-ALIGNMENT.md`, `docs/rulebook/TOC-PROPOSAL.md` (LOCKED), `docs/rulebook/08-hacker.md`, `docs/rulebook/18-wired-foundry.md`, `docs/rulebook/17-perks.md`, `docs/raw/21-the-wire.md`  
**Engine:** Ghostwire test and Power Roll procedures in this chapter. Playable without a separate rulebook.

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
> Enable **Draw Steel - Ghostwire Build** on a compatible Foundry world. Use abilities from the hero sheet (or hotbar). The system posts an **abilityUse** chat card with the Power Roll; Ghostwire SFX (B40) may play when the card lands. The module adds edges/banes automatically where it can: **Hacking** and **Jacked In** on Wired rolls, **Overlay** bane on real-world rolls, suite software edges, and **Weave Strain** bane on Magic/Veil/Resonance rolls when over the caster soft-cap. Freeform Director tests with no ability still need a manual roll or a named ability.


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

Ghostwire’s skill list lives in `02`. If you have a relevant skill, you gain that skill’s benefit on the Power Roll: add **+2** to the total.

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

**How the extra dice work (this book):**

1. Net edges against banes first. What remains is none, one edge, one bane, a double edge, or a double bane.
2. Roll **two** ten-sided dice as usual, plus **one extra** d10 per remaining edge or bane (two extra for a double).
3. **Edge / double edge:** drop the lowest die (or two lowest dice), then add the two you keep to the characteristic.
4. **Bane / double bane:** drop the highest die (or two highest dice), then add the two you keep to the characteristic.
5. Read **low / middle / high** from that final total.

A **natural double** is two matching faces on the first two dice you rolled, before drops. Extra edge/bane dice do not create or cancel that double.

### Common Ghostwire sources

| Source | Typical modifier |
|---|---|
| Relevant skill (non-Hacking Wired exception above) | **+2** to the Power Roll |
| **Hacking** on Wired Power Rolls | **Edge** (`21`) |
| Connection **Overlay** on real-world rolls | **Bane** (`21`) |
| Connection **Jacked In** on Wired rolls | **Edge** (`21`) |
| Medium / heavy armor encumbrance | Banes on named tests (`08`) |
| Mods, suite software, chrome | Situational edges (`09`, `10`, `19`) |
| **Damaged** implant | Penalty or bane as chrome text says (`09`) |
| Flanking, cover, conditions | Combat chapter (`04`) |
| Ally assist (below) | Usually an edge for the primary roller |

If two rules both want to give “an edge on this roll,” they stack until cancel math applies — they do not silently overwrite each other unless an ability says it replaces another benefit (as Hacking does for Wired rolls).

---

## Natural doubles and criticals

When both ten-sided dice show the **same face** before modifiers, that is a **natural double**.

A natural double is Ghostwire’s cue for a **critical** on that Power Roll. In practice:

- Treat the roll as the ability’s **high** result if the total would not already be high.
- If the ability already lists a special line for criticals, use that line instead (or in addition, if it says so).
- On a damaging roll with no other critical rider, add **extra damage equal to your highest characteristic** (minimum +1).
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

**Group test:** everyone who can contribute makes a Power Roll. Count **high as 2 successes**, **middle as 1**, **low as 0**. The Director sets how many successes the beat needs (usually about the crew’s size).

**Montage:** several group tests in a row (infiltrate, then vault, then extract). Failures add heat or burn time; they do not auto-fail the job unless the last beat is a disaster.

Perk text that mentions group or montage tests (`11`) spends **hero tokens** as written there.

---

## Helping and assisting

Crews survive by covering each other.

**Assist (simple):** when fiction allows (same scene, able to contribute, not Jacked In and inert while the ally acts in meatspace), an ally spends their **maneuver** (or their main action if the help needs both hands) to grant the primary runner an **edge** on one Power Roll. If the ally is already in position when the roll happens, the Director may let this fire as a triggered action instead. The helper narrates how: covering fire, a spoofed badge ping, a whispered tell, a brace under the vault door.

**Limits that keep assists honest:**

- You cannot assist a roll you could not meaningfully affect (wrong board, no tools, unconscious).
- A **Jacked In** runner can assist **Wired** rolls from the Wire board; they cannot assist hallway gunfights until they Toggle or jack out.
- One primary roll normally takes **one** assist edge unless an ability explicitly stacks more help.
- Assist does not replace a contested roll’s opposing side — it only sweetens your crew’s roll.

Some perks and class features change assist math (ignore a low-assist bane, share a skill into a montage, and so on). Those override this baseline when they apply (`11`, class chapters).

---

## Heroes’ Fortune (hero tokens)

Ghostwire’s table-luck currency is **Heroes’ Fortune**. The spendable chips are **hero tokens**.

**Pool (this book):** at the start of each session, the crew shares a **Heroes’ Fortune** pool of **one hero token per player** (not counting the Director). After a respite between runs (`26`), refill the pool up to that starting count if it is below. Do not exceed the starting count unless a perk says so.

**Default spends** (one token each, player’s choice):

- Reroll one Power Roll you just made; keep the new total.
- Turn a saving throw you just failed into a success.
- Gain an **edge** on a Power Roll before you roll.

Ghostwire also adds:

- **Perks** that spend hero tokens for specific street tricks (`11`) — project double-downs, montage skill sharing, lie detection, and similar.
- Flavor at the table: tokens are the crew’s shared grit and luck, not ¥ and not a class heroic resource. Adrenaline, Bandwidth, Conviction, and the rest never convert into hero tokens or the other way around.
- Director guidance: spend tokens to keep a run cinematic when the dice go cold; do not require a token to attempt something the rules already allow.

If a perk and a default Heroes’ Fortune spend both want the same moment, the player chooses one spend — you do not double-dip the same token.

---

## Potency, resistance, and saving throws

Some effects ask a target to resist with a characteristic — often written as **potency** keyed to Physique, Reflex, Logic, Instinct, or Persona. Use Ghostwire names everywhere.

**Potency (this book).** When an ability prints a rider like **Reflex < strong → prone** (or `R<STRONG`, `A<WEAK`, and similar), compare the target’s named characteristic to this table:

| Potency word | Rider applies if the target’s characteristic is… |
|---|---|
| **Weak** | **1** or less |
| **Average** | **2** or less |
| **Strong** | **3** or less |

If the ability prints a number instead of a word (Reflex < 2), use the number. A feature that **increases potency by 1** steps weak → average → strong, or adds +1 to a printed number (strong becomes 4 or less). The rider does **not** apply if the target’s score is higher than the threshold.

**Saving throws.** When an effect says **save ends**, or when you are dying (`04`), roll **1d10** at the end of your turn (or when the ability says). On a **6 or higher**, the effect ends (or the dying strike does not land). Some abilities raise or lower the number you need; write that next to the condition. Ghostwire conditions and keywords (`04`) ride on this ladder — they do not invent a second one.

Biofeedback, Trace Alert, and Wire Integrity are **not** saving throws — they are Wired systems (`21`).

---

## Test difficulties

When this book or an ability names **easy / medium / hard** (Wrench Jump-In, Technomancer biofeedback, and similar), read the Power Roll this way:

| Difficulty | Success | Partial | Fail |
|---|---|---|---|
| **Easy** | Middle or high (12+) | — | Low (≤11) |
| **Medium** | High (17+) | Middle (12–16): costly success or incomplete | Low |
| **Hard** | High (17+), and apply a **bane** unless the fiction already gave one | Middle: costly / incomplete | Low |

Freeform tests with no printed difficulty use the usual **low / middle / high** bands and the Director names what each band does.

## Negotiation and projects

**Negotiation** with fixers, patrons, and level-bosses (this book):

1. The Director names the NPC’s **drive** (Greed, Higher Authority, Freedom, Vengeance, Fear, or a one-line want) and one **pitfall** (the line that tanks the deal).
2. The talking runner makes an opening **Persona** Power Roll (Negotiation if they have it). Low / middle / high move the terms: pay band, access, heat (`08`).
3. Each additional argument is another test, a spent heroic resource, or a hero token. After **two** failures, or if someone hits the pitfall, the deal sours — walk or fight.
4. Class text that names a motivation (Freedom / Greed / Vengeance, and so on) grants an **edge** when the fiction matches that drive.

**Projects** (including Ghostwire **§Craft** and language / lore research) are downtime jobs. Each one consumes a Lifestyle **project slot** (`26`) unless the text says otherwise. Make a Power Roll with the named characteristic and skill. If the project has a **goal** (a number), add **progress**: low = **1**, middle = **2**, high = **3**. You finish when progress meets the goal.

**Default goals:** routine published install / swap (`10`) = **3** · **Discover Lore** (one useful fact about a foe, site, or faction) = **4** · **Learn New Language** = **6** (Polyglot halves that after immersion — `07`, `11`) · Invent a Mod as printed in `10`.

Technical hosts typically roll **Logic** with Hacking, Electronics, Repair, or Cybertech (`08`, `10`). Hero-token perk spends on projects are listed in `11`.

---

## Ghostwire modifiers (summary)

### Connection states

Your connection to the Wired changes your rolls. Four states: **Disconnected | Linked | Overlay | Jacked In**. Full rules: `21-the-wire.md`.

| State | Wired Power Rolls | Real-world Power Rolls |
|---|---|---|
| Disconnected | Only **Connect** | Normal |
| **Linked** | **Broadcast** only (plus Toggle / Jack Out). No Programs, payload Runs, or intrusion verbs. No Jacked In Wired edge. | Normal (no Overlay bane) |
| **Overlay** | Normal | **Bane** |
| **Jacked In** | **Edge** | Not allowed — your body is inert |

**Connect** (from Disconnected) lands in **Linked**. **Toggle Connection State** steps Linked → Overlay → Jacked In → Linked. Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs need Overlay or Jacked In. Any non-Disconnected presence is Wire-discoverable.

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

## Procedure map

| Rule | This book |
|---|---|
| Making a test | This chapter; characteristic names per `02` |
| Test difficulty / when to call a roll | Stakes guidance + easy / medium / hard table above |
| Power Roll dice and result bands | Always print **low / middle / high** (≤11 / 12–16 / 17+) |
| Edges and banes (including doubles) | Extra-dice procedure above; connection states; Hacking edge; GW gear/chrome |
| Skills in tests | **+2** skill benefit; Ghostwire skill list (`02`); Hacking exception (`21`) |
| Natural doubles / criticals | High result + optional characteristic damage; Wired clean-crit note above |
| Opposed, group, and montage tests | Contested / group / montage procedures above; perk spends (`11`) |
| Potency and resisting effects | Weak / average / strong table above |
| Saving throws | 1d10, succeed on 6+ |
| Heroes’ Fortune / hero tokens | Pool and default spends above; perk spends (`11`); not convertible to ¥ or class resources |
| Negotiation | Drive / pitfall procedure above |
| Projects | Goal + progress (1 / 2 / 3); §Craft uses Hacking, Electronics, Repair, or Cybertech (`08`, `10`) |

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

This chapter tells you **how uncertain actions resolve**. Combat timing lives in `04`. The Wire’s second battlefield lives in `21`. This book is the play rules.
