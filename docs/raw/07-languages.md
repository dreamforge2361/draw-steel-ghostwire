# Languages

**RAW status:** draft (Stage 3 chargen/play fill / B75, 2026-09-19)  
**Sources:** `docs/rulebook/19-languages.md`, `docs/masters/GHOSTWIRE_LANGUAGES.md` (names + knowledge-only lock), `docs/raw/02-heroes-characteristics.md`, `docs/raw/03-tests-power-rolls.md`, `docs/raw/11-perks.md` (Polyglot)  
**Engine:** Ghostwire language procedures in this chapter. Playable without a separate rulebook. Ghostwire **renames** every language below; do not invent tongue histories here.  

**Print:** Chapter 8 (TOC lock)  
**Lore gazetteer:** **non-goal** for RAW / v1 PDF. Per-language history and purpose is backlog with Michael (issue #67). This chapter is procedure + the locked name lists.

---

## What this chapter is for

Ghostwire languages are **access keys**. They open archives, rites, black sites, enclaves, and deep Wire forensics. They do not block every street scene. Everyday talk runs in shared tongues. You roll when nuance, code, ritual, or a locked door of words is the actual obstacle.

This chapter tells the table:

- How language **works on a test** (and when not to roll).
- Which **lists** exist (seven categories; 42 remapped names).
- What every runner **starts with**, and which **printed grants** add more.
- How a Director should **gate** translation, knowledge-only tongues, and faction doors.

It does **not** invent a history for Trade Cant, Saint-Cant, or Corran Work-Cant. Names and the knowledge-only split are locked. Flavor sentences that teach a **rule** are allowed. Lore essays are not.

---

## Rules baseline

- **Trade Cant** is every runner’s starting language (the working speech of the Reach). Other languages come from your People, Background, class, education, and perks — **when those sources print a grant**.
- **Machine translation** carries simple communication, but it isn’t knowing the language: nuance, code phrases, ritual language, and deception slip through. The Director decides whether a negotiation, a read, or a deception works through a translator.
- **Knowledge-only languages** need real knowledge; translation gives a surface gloss at best. They are:
  - every **Arcane & sacred** language,
  - **Black-Site Code**,
  - every **Machine & matrix** language except **Wire Speak**,
  - **Void Cant**, **Infernal Speech**, **Old Liturgical**, **Dead Ops Tongue**, and **Extradimensional Technical**.

Languages create access and secrecy, not constant blockage: everyday scenes run in shared tongues, while archives, rites, black sites, and enclaves open to those who know the words.

Each Ghostwire language has a locked key → name map in `docs/masters/GHOSTWIRE_LANGUAGES.md` (42 of 42 keys). **Do not rename keys.** A printed grant that names a tongue grants the **Ghostwire name** for that key. Foundry still stores the system key and **shows** the Ghostwire name.

---

## How language checks work

A language is **not a skill**. You do not buy tongues with skill points (`02`, skills master). You either **know** a language or you do not.

### When not to roll

If two speakers share a language and the scene is ordinary — buying noodles, asking which stair, threatening someone in Trade Cant — **do not roll** “do I speak.” You speak.

If nobody present shares a language and the only need is “which way is the Interchange,” **machine translation** is enough. No roll. The meaning gets through; the poetry does not.

### When the Director calls a test

Call a **test** (`03`) when **both** are true:

1. The words themselves are the uncertainty (a lie in Corp Cant, a rite in Saint-Cant, a black-site passphrase, a Wire dump in Old Code).
2. Failure or a middle result would change heat, access, a contact’s trust, or the score.

The roll is an ordinary Power Roll. **Characteristic** follows the job:

| The question is… | Typical characteristic | Typical skill (if you have it) |
|---|---|---|
| Do they buy the cover / the threat? | **Persona** | Deception, Persuasion, Intimidation, Negotiation |
| Do I catch the tell / the coded aside? | **Instinct** | Insight, Perception, Streetwise |
| Do I parse the archive / the dump / the formula? | **Logic** | Corporate, Occult, Matrix Theory, Hacking, Electronics |
| Do I remember which enclave uses this cant? | **Logic** or **Instinct** | History, Religion, Streetwise, Xenology |

**Knowing the language is the door.** The skill is how well you *use* the door. If you do not know the language and translation does not apply, you do not make this test as “I speak it.” You make a different test (find a speaker, steal a file, jack a node) or you fail the access.

**Shared language + relevant skill:** use the normal skill benefit on the Power Roll (`03`).

**Shared language, no skill:** still roll if the Director called a test; you just lack the skill benefit.

**No shared language:**

| Situation | What happens |
|---|---|
| Everyday meaning, translator or implant on | Meaning lands. No nuance. Director may refuse deception, ritual, or code. |
| Negotiation, read, or deception through a translator | **Director’s call** — allow with a **bane**, allow as “surface only” (no hidden terms), or refuse. |
| Knowledge-only tongue | Translation is a **gloss**. Rites, black-site code, and deep code stay opaque. No usable knowledge from the app. |
| Wire Speak (spoken Machine exception) | Treat as a normal spoken language; translation *may* help, Director’s call on nuance. |

Do not invent a numeric “translator rating.” The lock is Director judgment, not a second ladder.

### Outcomes (guidance)

Use the printed ability or the freeform test. If you need a Ghostwire-shaped read for a language-gated door:

| Result | Access |
|---|---|
| **Low** (≤11) | You miss the code, botch the honorific, or the translator lies to you. The door stays shut or the room knows you are faking. |
| **Middle** (12–16) | You get the surface: enough to pass, buy, or file. Hidden clauses, true names, and trap phrases stay hidden. |
| **High** (17+) | You catch the second meaning — the saint’s real name, the ops dialect’s kill-switch word, the dump’s deleted stanza. |

This is **guidance** for freeform doors. It does not replace a printed negotiation or Matrix Verb.

---

## Chargen (step 6)

Chargen order in `02` puts **Languages** after skills and before starting ¥.

1. **Write Trade Cant.** Every runner has it. (A table that is *not* set in the Reach may swap the starting common urban tongue to Reach Metro, Flats Cant, or Sprawl Argot if everyone agrees — that is a campaign-region call from the languages master, not a new language.)
2. **Collect printed grants.** Take any language a People trait, class feature, education feature, or perk **prints**. A grant that names a tongue grants the **Ghostwire name** for that key.
3. **Polyglot** (`11`): if you take this perk later (or at a level that grants a perk), you learn **two** languages you have regularly heard or seen written. Immersion (7+ days in a place that speaks one you don’t know) lets you hold a basic conversation; finishing **Learn New Language** (`03` Projects — default goal **6**, Polyglot **3** after immersion) then makes it a full known tongue.
4. **Do not invent automatic Background or People grants.** The languages master *wants* Backgrounds and ancestral tongues to attach later; that follow-up is **not shipped**. A Corp Arcology Background does not automatically give Corp Cant. An Elvani does not automatically get Elvani High Cant. If a later pass adds those advancements, they land in `06` / `05` and this paragraph shrinks.
5. **Director optional color (not a grant rule):** if the table wants language to matter *this* campaign and no printed grant has fired, the Director may offer **one** additional tongue from a category that already matches the runner’s fiction (common urban, ancestral row for their People, or a corporate/national tongue they were raised in). That is a session-zero agreement, not a hidden second skill budget. Refuse knowledge-only tongues as freebies.

**Merc / dual Kit** does not grant languages. **¥ does not buy a language.** Lifestyle does not buy a language (`26`). Chrome vocal modulators do not teach Corp Cant.

Record known languages on the sheet. In Foundry, use the hero language picker — it already shows Ghostwire names.

---

## Language list

Point of record for names: `docs/masters/GHOSTWIRE_LANGUAGES.md`. The table below is the play list.

| Category | Languages |
|---|---|
| **Common urban** | Trade Cant · Reach Metro · Flats Cant · Sprawl Argot |
| **National / cultural** | Meridian Standard · Sanctum Formal · Colony Creole · Offworld Trade · Hive Technical · Old Reach |
| **Corporate** | Corp Cant · Legal Shorthand · Ops Dialects · Black-Site Code |
| **Arcane & sacred** | Signal Liturgy · True Signal · Saint-Cant · Rite Speech · Demon Names · Ward Formulae |
| **Machine & matrix** | Wire Speak · Old Code · Machine Markup · AI Symbolic · Resonance Notation |
| **Ancestral (Peoples)** | Corran Guild-Tongue · Corran Work-Cant · Elvani High Cant · Elvani Softspeech · Goliar Battle-Cant · Changer Pack-Tongue · Revenant Memory-Speech · Mutant Enclave Cant · Cyborg Frame-Cant · Pure-Line Homily |
| **Extradimensional / dead / deep lore** | Void Cant · Drift Creole · Infernal Speech · Old Liturgical · Dead Ops Tongue · Alien Colony Trade · Extradimensional Technical |

### What each category is *for* (function, not history)

Harvested from the languages master. These lines teach **when to ask for the tongue**, not where it was born.

| Category | Function at the table |
|---|---|
| **Common urban** | Trade and street speech. Default for markets, crews, and Flats chatter. |
| **National / cultural** | Region, colony, and legacy human speech. Use when the job leaves the Reach’s default mix. |
| **Corporate** | Internal corp speech, legal shorthand, ops floors. **Black-Site Code** is knowledge-only. |
| **Arcane & sacred** | Ritual speech, saint-cant, true names, ward formulae. **All knowledge-only.** Gates Veil research (`22`) when the working is written or spoken in that tongue. |
| **Machine & matrix** | Code dialects and symbolic exchange. **All knowledge-only except Wire Speak.** Matters for Wired forensics and deep intrusion (`21`). |
| **Ancestral (Peoples)** | Enclave and People speech. Map the row to the eight Peoples when a grant or a door names “their tongue.” |
| **Extradimensional / dead / deep lore** | Infernal, void, dead-ops, alien technical. Knowledge-only except **Drift Creole** and **Alien Colony Trade**. |

**Ancestral map (names only — no lore pass):** Corran → Guild-Tongue / Work-Cant; Elvani → High Cant / Softspeech; Goliar → Battle-Cant; Changer → Pack-Tongue; Revenant → Memory-Speech; Mutant → Enclave Cant; Cyborg → Frame-Cant; Pure Human → Pure-Line Homily. Knowing the name of the tongue is not the same as a chargen auto-grant.

### Knowledge-only lock

| Knowledge only — translation grants no usable knowledge | Spoken / learnable as normal — translation may help, Director’s call on nuance |
|---|---|
| **All Arcane & sacred:** Signal Liturgy, True Signal, Saint-Cant, Rite Speech, Demon Names, Ward Formulae | **Wire Speak** (the spoken exception in Machine & matrix) |
| **Black-Site Code** | **Drift Creole** |
| **Machine & matrix except Wire Speak:** Old Code, Machine Markup, AI Symbolic, Resonance Notation | **Alien Colony Trade** |
| **Deep lore:** Void Cant, Infernal Speech, Old Liturgical, Dead Ops Tongue, Extradimensional Technical | **Everything else** not listed as knowledge only |

---

## Director guidance

**Open doors, don’t padlock the street.** Shared Trade Cant (or another common urban tongue) is enough for a job briefing, a street fight taunt, and a noodle stall. Spend language pressure on:

- A **corp archive** or contract written in Legal Shorthand / Corp Cant.
- A **black site** whose passphrases are Black-Site Code (knowledge-only).
- A **rite or working** that names Demon Names, Ward Formulae, or Saint-Cant.
- A **Wire dump** in Old Code or Machine Markup (Hacking / Matrix Theory still roll — without the tongue you get structure without meaning).
- An **enclave** that will not brief outsiders in Trade Cant.

**One door per scene is enough.** Do not demand a unique tongue for every NPC.

**Translation implants and apps** are chrome or gear fiction (`08`, `09`). They do not become languages. They never satisfy knowledge-only.

**Learn New Language** is a research **Project** (`03`): Logic Power Roll, progress 1 / 2 / 3 per low / middle / high, goal **6** (Polyglot halves that after immersion — `11`). Lifestyle project slots (`26`) are how you find the time; ¥ still does not buy the tongue.

**Class hooks already in print (pointers, not new grants):**

- Scout **Keep It Down** — while you share a language, you choose who perceives the words (`13`).
- Mutant **Voice** — telepathy still requires a language you both know (`05`).
- Changer **Beast Form** — cannot speak a clear language (`05`).
- Perk **Wire Whisper** — the target must understand one or more languages (`11`).
- Casters / Veil — Arcane & sacred tongues gate ritual research and formulae when the working is written that way (`22`).
- Hacker / Wire — Machine & matrix tongues matter for forensics and deep intrusion (`21`). They are not a substitute for Hacking or Bandwidth.

**Renown, ¥, and Body Integrity never grant a language.**

---

> **In Foundry**
> Enable **Draw Steel - Ghostwire Build** on a compatible Foundry world. The hero sheet’s **language picker** already shows **Ghostwire names**. Ghostwire does not ship a second language app. There is **no** translator automation and **no** knowledge-only checkbox in the UI: track knowledge-only as a table rule when someone tries to app-translate Saint-Cant or Old Code. Polyglot and other grants are still recorded by hand (or by the perk Item) on the sheet.

---

## What this chapter is not

- Not a lore gazetteer. History and purpose per tongue = **backlog #67** (Michael). Do not draft those essays into RAW.
- Not a second skills chapter. Languages are not bought with skill points.
- Not Auto-grants for Backgrounds or Peoples (follow-up; not this fill).
- Not a Foundry UI manual beyond the picker note above.

---

## Cross-references

| Topic | Where |
|---|---|
| Chargen step order | `02-heroes-characteristics.md` |
| Tests, edges, skills on rolls | `03-tests-power-rolls.md` |
| Background / Profession (no language rows yet) | `06-backgrounds-professions.md` |
| Peoples (Voice, Beast Form) | `05-ancestries.md` |
| Polyglot; Wire Whisper | `11-perks.md` |
| Wire forensics | `21-the-wire.md` |
| Ritual / Veil research | `22-the-veil.md` |
| Locked names + key map | `docs/masters/GHOSTWIRE_LANGUAGES.md` |
