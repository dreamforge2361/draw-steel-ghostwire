# Heroes and Characteristics

**RAW status:** draft (Stage 3 fill 2026-09-18)  
**Sources:** `docs/rulebook/DS-ALIGNMENT.md`, `docs/rulebook/SPECIES-DS-MAP.md`, `docs/masters/GHOSTWIRE_SKILLS_MASTER.md`, class chapters (chassis tables), `docs/rulebook/11-economy.md`, `docs/rulebook/12-chrome.md`, `docs/raw/08-kits-gear-wealth.md`, `docs/raw/09-chrome-body-integrity.md`, `docs/raw/21-the-wire.md`, `docs/raw/26-lifestyle-downtime.md`  
**Engine:** Ghostwire chargen and characteristic procedures in this chapter. Playable without a separate rulebook.

---

## Making a runner

A **runner** is Ghostwire’s hero: a professional who takes dangerous jobs for pay. Rules text may still say “hero”; at the table, say **runner**. Together you are a **crew**.

Making a runner means assembling four layers that never replace each other:

| Layer | What it answers | Where it lives |
|---|---|---|
| **People** | What body and birthright you start with | `05-ancestries.md` |
| **Background + Profession** | Where you grew up and what you did before the job | `06-backgrounds-professions.md` |
| **Class** | How you fight, jack in, heal, lead, or call the Veil | `12`–`20` |
| **Kit + gear + ¥** | Martial doctrine and starting kit on the street | `08-kits-gear-wealth.md` |

Characteristics and skills sit under all of that. Characteristics are the five scores you add to Power Rolls (`03`). Skills are the named specialties that grant edges or allow tests the Director would otherwise refuse. Class features, heroic resources, Stamina, and Recoveries come from your class chassis — not from ¥, chrome, or Lifestyle.

**Firewall (chargen and forever):** characteristics, skills, class features, and heroic resources come only from People, Background, Profession, class, perks, and advancement. **¥ never buys character power.** Chrome and gear never grant characteristics, skills, or class features (`08`, `09`, `10`). Lifestyle buys living standard between runs, not sheet power (`26`).

A new runner starts with **no chrome** and **no mods**. Body Integrity begins at **20** for every People except Cyborg (`09`). Starting liquid funds are **¥5,000** (`08`). Between runs, burn ¥ on Lifestyle upkeep (`26`); leftover nuyen funds gear, chrome, bribes, and the next score.

---

## Chargen step order

Assign scores with the array in **Characteristics** below. Ghostwire’s **step order** at the table is:

1. **People** (ancestry) — pick a People package, take free signature traits, spend the ancestry-point budget (`05-ancestries.md`). Ghostwire calls ancestries **Peoples**.
2. **Background** (culture) and **Profession** (career) — one of each; each grants fixed and chosen skills from the Ghostwire list below (`06-backgrounds-professions.md`).
3. **Class** — pick one of the nine classes (`12`–`20`). Record subclass (if any), signature abilities, first heroic abilities, heroic resource, starting Stamina, Recoveries, and the class’s core characteristics.
4. **Kit** — take **one free Kit**, including Street-grade qualifying gear for it (`08-kits-gear-wealth.md`). Pure casters and deck-bound Hackers may take a light Kit or none if the class chapter allows fighting through the Veil or the Wire instead.
5. **Skills** — collect grants from People, Background, Profession, and class. No wasted duplicates; if a pick collides, choose another skill from the same group (then any group) per `06`. Full list below.
6. **Languages** — `07-languages.md`.
7. **Starting ¥** — **¥5,000** liquid on the sheet (`08`). Do not pre-spend Lifestyle; Lifestyle is paid at the first respite between runs (`26`).
8. **Body Integrity** — **20** for every People except Cyborg (`09`). Chrome is opt-in after (or during) play — never an auto-grant at chargen.
9. **Optional early spends** — Street-band gear (a Personal/Light air scout like Tape-Eye or Rotor grants **Street Eye** — `23`), a cyberdeck or focus if needed, or save cash. Mods and chrome cost ¥ (chrome also spends Body Integrity) — `08`, `09`, `10`, Wire tools in `21`.

When you finish, you should know: who you are (People), where you came from (Background/Profession), how you work a job (class + Kit), what you are good at (characteristics + skills), and what you still owe the street (¥, Integrity, next Lifestyle band).

> **In Foundry**
> Enable **Draw Steel - Ghostwire Build** on a compatible Foundry world. On the hero sheet **Stats** tab, Ghostwire shows the five characteristics under their Ghostwire names (**Physique**, **Reflex**, **Logic**, **Instinct**, **Persona**). The same tab carries **Body Integrity** (current/max), a read-only **Wired** connection state, and the sheet’s Nuyen/wealth field (new heroes start at Integrity 20/20 and ¥5,000). Assign the **2, 2, 1, 1, 0** array from this chapter onto those five fields. Punch-list: **Appendix B** (print Ch 29 / `docs/manuscript/04-back/29-chargen-cheat-sheet.md`).

---

## Characteristics

Ghostwire’s five characteristics are the numbers you add to Power Rolls (`03`). If an older ability line still lists Might, Agility, Reason, Intuition, or Presence, use the Ghostwire name in the table below. **Potency** uses these names too: a potency keyed to Physique uses the target’s Physique score (`03`).

**Starting scores.** Assign this array, in any order: **2, 2, 1, 1, 0**. Put the two **2**s in your class’s **core characteristics** unless a People trait or class feature prints a different raise. Starting scores do not go above **2** without a printed raise. After chargen, scores climb by the characteristic increases in `24` (cap **5** from those increases). A score can be **−1** if a trait prints a penalty.

**What a score does.** Add it to every Power Roll that names that characteristic. It is also the number potency and some riders read. Chrome, ¥, and Lifestyle never change it (`08`, `09`, `26`).

| Ghostwire | Foundry Hero sheet field | Short cover |
|---|---|---|
| **Physique** | Might | Strength, toughness, raw force |
| **Reflex** | Agility | Speed, coordination, aim, stealth |
| **Logic** | Reason | Analysis, technical skill, study, most Wired work |
| **Instinct** | Intuition | Awareness, reading people and situations, connecting to the Wired |
| **Persona** | Presence | Force of personality, leadership, faith |

Ghostwire names are **primary** in this book. Foundry Hero sheet fields are software labels on the same five scores — not a second attribute set.

### Physique

**Physique** is meat and metal under pressure: shoving doors, grapples, hauling a downed runner, forcing a jammed hatch. It drives Athletics- and Brawl-heavy tests and any Power Roll for raw force or toughness. Operators lean on it; so do heavy Peoples and anyone who expects the job to go hands-on first. Chrome that reinforces bone or muscle does **not** raise Physique — scores still come from chargen and advancement (`09`, `24`).

### Reflex

**Reflex** is timing, aim, balance, and not being where the round goes. It covers Firearms, Stealth, Acrobatics under fire, and most “move clean / shoot clean” moments. Scouts and Kit-forward builds live here. Driving under pressure often pulls Reflex when the question is control, not route planning. Smartlinks and chrome never rewrite the Reflex score.

### Logic

**Logic** is analysis, procedure, and systems thinking. Engineering, Electronics, Medicine, Security Systems, Matrix Theory, and most **Hacking** rolls key off Logic when the question is “do I understand and defeat this system?” Wrench, Hacker, Medic, Elementalist, and Technomancer treat it as core. On the Wire, Logic is the usual partner for intrusion unless an ability says otherwise (`21`).

### Instinct

**Instinct** is awareness and gut read: Perception in a dark alley, Insight across a table, Survival when the map lies, sensing a node is wrong before ICE spikes. It often covers **feeling** the Wire or Veil without a full analytical pass — Trace heat, taint, a lie mid-handshake. Medic and Street Priest lean on it; Hackers pair it with Logic. **Insight** is a skill; **Instinct** is the characteristic — do not conflate them.

### Persona

**Persona** is presence that moves people: Negotiation, Persuasion, Intimidation, Command, Performance, and faith when the Street Priest calls Conviction. Commanders / Faces and Street Priests treat it as core; Elementalists and Technomancers often pair it with Logic. Persona does not buy Lifestyle doors — upkeep bands (`26`) open housing and access; Persona is how you work the people once you are in the room.

---

## Skills overview

Ghostwire’s skill list and skill groups are the ones in this chapter. Skills work on tests as `03` prints them: the Director names a characteristic; a relevant skill applies a **+2** skill benefit when you have it (Hacking on Wired rolls grants an **edge** instead); edges/banes stack per Power Roll rules. There are **44 skills in six groups**.

Gain skills from **People**, **Background**, **Profession**, and **class** (later from advancement). Background and Profession use fixed + chosen picks with a no-duplicate rule (`06`). Perk skill groups: Crafting → **Technical**, Exploration → **Action**, Interpersonal → **Social**, Lore → **Knowledge** (`11-perks.md`). Skills never come from ¥, chrome, or Lifestyle.

### Action skills

| Skill | Covers |
|---|---|
| Athletics | Running, climbing, jumping, lifting, swimming, and feats of exertion |
| Brawl | Unarmed combat, grapples, clinches, and improvised close violence |
| Melee | Blades, clubs, polearms, and other hand-held weapons |
| Firearms | Pistols, rifles, SMGs, shotguns, and conventional ranged weapons |
| Heavy Weapons | Launchers, support weapons, mounted guns, and demolition-facing battlefield pieces |
| Stealth | Sneaking, shadowing, concealment, infiltration, and moving unseen |
| Acrobatics | Balance, tumbles, dives, vaults, and difficult physical repositioning |
| Perception | Spotting danger, scanning scenes, catching details, and sensory sharpness |
| Survival | Tracking, foraging, navigation, fieldcraft, and staying alive in hostile zones |

### Technical skills

| Skill | Covers |
|---|---|
| Hacking | Wired intrusion, device compromise, cybercombat, scanning, and bypassing digital security |
| Electronics | Circuits, sensors, comms, diagnostics, hardware setup, and signal work |
| Engineering | Structural, industrial, and mechanical design or problem-solving |
| Repair | Field fixes, maintenance, patch jobs, and combat repairs on gear or systems |
| Cybertech | Cyberware installation, diagnosis, tuning, and augmentation knowledge |
| Medicine | First aid, trauma care, surgery support, and biological stabilization |
| Demolitions | Breaching charges, bombs, traps, and controlled destruction |
| Security Systems | Locks, alarms, bypass tools, surveillance nets, and physical security architecture |

**Hacking** and Wire procedures live in `21-the-wire.md`. **Cybertech** is how you talk about chrome on the table; installing still costs ¥ + Body Integrity per `09`.

### Knowledge skills

| Skill | Covers |
|---|---|
| Streetwise | Gangs, neighborhoods, fixers, black markets, criminal habits, and rumor networks |
| Corporate | Megacorps, departments, contracts, office politics, and institutional procedure |
| History | Past events, wars, collapses, timelines, and social memory |
| Occult | Demons, wards, taint, ritual signs, magical theory, and forbidden traditions |
| Religion | Faiths, saints, cults, dogma, and sacred practice |
| Matrix Theory | Deep understanding of networks, architecture, AI behavior, and code ecologies |
| Medicine Lore | Pathogens, drugs, toxins, physiology, and medical systems |
| Xenology | Colonies, altered peoples, extradimensional cultures, and nonhuman societies |

### Social skills

| Skill | Covers |
|---|---|
| Negotiation | Deals, bargaining, settlements, leverage, and practical compromise |
| Persuasion | Convincing, appealing, motivating, and steering decisions without overt coercion |
| Deception | Lies, cover identities, misdirection, and forged social positioning |
| Intimidation | Threats, dominance, pressure, and coercive presence |
| Command | Giving orders, coordinating teams, rallying allies, and battlefield authority |
| Insight | Reading intent, lies, fear, leverage points, and emotional tells |
| Performance | Public speaking, stagecraft, music, distraction, and social spectacle |
| Contacts | Calling in favors, finding specialists, and navigating social networks |

### Vehicle and drone skills

| Skill | Covers |
|---|---|
| Driving | Ground vehicles in normal or high-pressure conditions |
| Piloting | Aircraft, rotorcraft, gravcraft, or spacecraft |
| Rigging | Direct neural or remote control of drones and vehicles |
| Gunnery | Vehicle-mounted weapons, drone weapon systems, and turret control |
| Navigation | Route planning, pursuit lines, safe corridors, and hazard reading |

Machines rules: `23-machines.md`. A qualifying air scout in inventory grants **Street Eye** (Companion Link); Wrenches still use Deploy & Command (`16`).

### Magic and supernatural skills

| Skill | Covers |
|---|---|
| Spellcraft | Understanding, identifying, shaping, and countering spell effects |
| Rituals | Long-form magical procedures, circles, offerings, and prepared workings |
| Warding | Protective seals, anti-entity measures, barriers, and sanctified defenses |
| Resonance | Technomantic harmonics, machine-spirit contact, and digital-supernatural interface work |
| Corruption | Recognizing taint, surviving exposure, and handling warped forces or zones |
| Summoning | Calling, binding, bargaining with, or directing supernatural entities |

Veil-facing detail is thin by design (`22`). Ritual downtime points at Lifestyle project slots when you need a roof and a quiet room (`26`).

---

## Heroic resources at a glance

Each class fuels abilities with its own **heroic resource**. Timing follows the class chapter (gain at combat start / start of turn, spend on printed costs, leftover usually dumps when the fight ends) unless that chapter says otherwise. This table is a **pointer** — full chassis live in `12`–`20`.

| Class | Core characteristics | Heroic resource | Starting Stamina | Stamina / level | Recoveries | Epic resource / capstone (10th) |
|---|---|---|---|---|---|---|
| Operator | Physique, Reflex | Adrenaline | 21 | +9 | 10 | Combat Legend (Overclock) |
| Scout | Reflex, Logic | Advantage | 18 | +6 | 8 | Subterfuge |
| Commander / Face | Persona, Instinct | Influence | 21 | +9 | 10 | Command |
| Medic | Instinct, Logic | Reagents | 18 | +6 | 8 | Master Chemist |
| Wrench | Logic, Reflex | Uptime | 18 | +6 | 8 | Overclock |
| Elementalist | Logic, Persona | Essence | 18 | +6 | 8 | Primordial Reservoir |
| Street Priest | Persona, Instinct | Conviction | 18 | +6 | 8 | Manifest Will |
| Hacker | Logic, Instinct | Bandwidth | 19 | +7 | 9 | Ghost in the Machine |
| Technomancer | Logic, Persona | Resonance | 18 | +8 | 8 | Master of the Current |

**Combat note:** Medic **Reagents do not reset** when a fight starts or ends (`04`, `15`). Hacker **Bandwidth** interacts with Overlay / Jacked In (`21`). Caster chrome soft-caps / Weave Strain live in `09`.

---

## Victories, level, and what comes later

Runners advance **Level 1–10** by the Victory and leveling procedure in `24`. Ghostwire invents no second hidden XP track. Levels group into four **echelons** (1–3, 4–6, 7–9, 10). Characteristic increases, skills, perks, and higher-cost abilities follow the shared cadence — full table in `24-advancement.md`.

What leveling does **not** grant: Body Integrity, liquid ¥, or Wire Node Rating. Between jobs, pay Lifestyle or take street pressure (`26`); shop, craft, and chrome surgery are downtime choices (`08`, `09`, `10`).

---

## Build firewall (restated)

- **Characteristics and skills** — People, Background, Profession, class, perks, advancement only.
- **Heroic resources and class features** — class chapters only.
- **¥** — objects and services: gear, chrome hardware, installs, bribes, Wire access, Lifestyle upkeep (`08`, `26`).
- **Chrome** — ¥ + Body Integrity; never a characteristic or skill grant (`09`).
- **Wire** — decks, programs, connection state, Node Rating (`21`); Hacking skill + Logic/Instinct still sit on this chapter’s sheet.

If a shop, chrome catalog, or downtime offer would raise a characteristic, add a skill, or unlock a class feature for cash, refuse it. That purchase is off-doctrine.
