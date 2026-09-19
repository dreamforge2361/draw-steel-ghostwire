# How to Play

**RAW status:** draft (Stage 3 fill 2026-09-18)  
**Sources:** `docs/rulebook/00-STAGE1-skeleton.md` (Chapter 1 scope), `docs/rulebook/DS-ALIGNMENT.md`, `docs/rulebook/TOC-PROPOSAL.md` (LOCKED)  
**Engine:** Draw Steel Heroes — use the official rules for shared engine procedures; Ghostwire remaps and table procedures below are original wording.

---

## What you need

To run Ghostwire you need:

- **Draw Steel Heroes** (shared engine: characteristics, Power Rolls, combat loop, conditions, negotiation, advancement math).
- **This book** (Ghostwire remaps, nine classes, ¥ economy, chrome, the Wire, the Veil, machines).
- **Players** — one **Director**, everyone else a **runner**.
- **Dice** — two ten-sided dice per player for Power Rolls (`03`), plus whatever Draw Steel Heroes calls for.
- **Something to track** Stamina, Recoveries, heroic resources, ¥, Body Integrity, and (when relevant) Wire connection state. Foundry or paper both work.

You do **not** need lore PDFs, art packs, or a bestiary reprint to start. Opposition numbers live in Foundry / Draw Steel by reference (`25`). Setting color lives in Reach materials — not required for rules play.

> **In Foundry**
> Load a world on the **Draw Steel** system, then enable the **Draw Steel - Ghostwire Build** module (`draw-steel-ghostwire`). Open a hero sheet → **Stats**: Ghostwire adds **Body Integrity** (current/max), a read-only **Wired** connection state, and (for Changers) form buttons. New heroes start at Integrity 20/20 and ¥5,000 on the sheet’s Nuyen/wealth field. Matrix Verbs land on every hero; chrome, kits, and Wire tools live in this module’s packs — not a second system.


---

## The table

One player is the **Director**. The Director describes the street, the corp floors, the Wire, and the people who live there; plays every face, fixer, corpsec squad, and ICE construct the crew meets; and decides when a roll is needed and what it risks.

Everyone else plays a **runner** (also called an **edgerunner** or **hero**). Rules text still says “hero” where Draw Steel does; at the table, say **runner**. Together the runners are a **crew** — professionals who take dangerous jobs for pay.

The Director is not an adversary. The Director makes the world push back so the crew’s choices matter. Players own their runners’ decisions: where they go, who they trust, when they jack in, when they walk away.

---

## Session shape

A typical Ghostwire session moves through the same arc as a job:

1. **Cold open or hook** — a fixer calls, a contact tips a score, a problem walks into the crew’s safehouse.
2. **Legwork** — gather intel, buy gear, negotiate pay, scout the site, prep the Wire overlay.
3. **The run** — execute: infiltrate, fight, chase, jack in, extract.
4. **Aftermath / downtime** — get paid, spend ¥, heal, install chrome, craft mods, burn lifestyle, set up the next job.

Sessions can start mid-legwork or mid-run. Some nights are pure downtime. The three **modes** below tell you which Ghostwire systems are in play; they are not a rigid clock.

**One job can span several sessions.** Victories and experience follow Draw Steel Heroes (`24`). ¥ payouts and lifestyle burn are Ghostwire (`08`, `26`).

---

## Three modes of play

Ghostwire play moves between **legwork**, **the run**, and **downtime**. Each uses Draw Steel’s shared engine. Ghostwire adds the systems in the right-hand column.

| Mode | What happens | Ghostwire additions |
|---|---|---|
| **Legwork** | Getting the job, talking, investigating, sneaking, preparing | Negotiation with patrons and fixers; the Wired for information (`21`); Availability when buying gear (`08`) |
| **The run** | The operation: infiltration, combat, chases, Wired intrusion | Connection states and Trace Alert (`21`); machines and chases (`23`); chrome failures (`09`) |
| **Downtime** | Recovering, spending ¥, installing chrome and mods, training | ¥ spending and lifestyle (`08`); §Craft Projects (`10`); chrome surgery (`09`); Ritual Workings (`22`) |

### Legwork

Legwork is everything before the doors open. The crew finds the job, argues price, maps the site, buys what they lack, and decides who walks in meatspace versus who watches from Overlay.

**Typical legwork moves:**

- Meet a **fixer**, **patron**, or **level-boss** and negotiate terms (use Draw Steel negotiation; Ghostwire just reskins the faces).
- Ask around: street contacts, Background/Profession ties, Wired searches (`21`).
- Scout physical approaches, cameras, patrols, and escape routes.
- Shop: gear needs **Availability** and ¥ (`08`). Kits are free doctrine — they still need **owned** qualifying gear.
- Prep the Wire: board layout, decoys, who holds Overlay vs who stays dark.

Legwork ends when the crew commits — they breach, they jack in for real, they take the shot. The Director can cut to the run whenever preparation stops changing the plan.

### The run

The run is the operation itself. Time compresses. Mistakes cost Stamina, Trace Alert, chrome, and sometimes the whole score.

**Typical run beats:**

- Infiltration and social cover while the site is still quiet.
- Combat when cover fails or the plan calls for violence (`04`).
- Chases on foot, in vehicles, or both (`23`).
- Wired intrusion: Overlay support or full Jacked In (`21`). Trace Alert rises when the system notices.
- Chrome strain: Body Integrity is already spent at install; System Crisis and implant failures show up under pressure (`09`, `05`).
- Extraction: get the package, the data, and the crew out before the net closes.

The Director keeps the table in **one mode at a time** when possible. If half the crew is Jacked In and half is kicking doors, cut between the Wire board and the hallway in short beats so nobody sits dark for long.

### Downtime

Downtime is the breath between jobs. The crew spends ¥, recovers, upgrades, and lives with the cost of staying sharp.

**Typical downtime moves:**

- Get paid (¥). Pay **lifestyle** burn when that table lands (`08`, `26`).
- Rest and recover Stamina / Recoveries per Draw Steel Heroes.
- Install or remove **chrome** (`09`); install **mods** or run a **§Craft Project** (`10`).
- Train, take a Perk when advancement allows (`11`, `24`).
- Veil casters may attempt **Ritual Workings** (`22`).
- Medic restock and similar class downtime hooks use the Lifestyle quotes in `26`.

Downtime is not “nothing happens.” Corps retaliate, contacts call in favors, Trace Alert leftovers become heat. Keep it short unless the table wants a shopping episode.

---

## Dice

Ghostwire uses Draw Steel’s dice. Most uncertain actions resolve as a **Power Roll**: two ten-sided dice plus a characteristic, read as **low / middle / high** (≤11 / 12–16 / 17+). Full procedure, edges, banes, skills, and Heroes’ Fortune live in `03`.

When a chapter says “Power Roll (Logic)” or “Power Roll vs Node Rating,” use that chapter’s modifiers on top of the shared engine — do not invent a third resolution system.

---

## What happens at the table

### Conversation first

Most of the night is talk. The Director frames a situation; runners say what they do; the Director says what follows. Roll when the outcome is uncertain **and** failure (or a middling success) would change something the crew cares about.

Do not roll for trivia. Do roll when the runner is lying to a corp handler, sprinting a blind corner, forcing a locked node, or keeping a dying teammate upright.

### Characteristics in play

Ghostwire’s five characteristics are **Physique, Reflex, Logic, Instinct, Persona** (`02`). They map to Draw Steel’s five traits; Ghostwire names are primary in this book.

### Resources you will see every session

| Resource | Who tracks it | Notes |
|---|---|---|
| **Stamina / Recoveries** | Every runner | Shared engine (`04`) |
| **Heroic resource** | Every class | Adrenaline, Advantage, Influence, Reagents, Uptime, Essence, Conviction, Bandwidth, Resonance (`04`, class chapters) |
| **¥** | Every runner / crew | Buys gear and services — never characteristic scores or class power (`08`) |
| **Body Integrity** | Living chrome users | Starts at 20; spent on implants (`09`). Cyborgs use Frame Modules instead |
| **Connection state** | Anyone on the Wire | Overlay vs Jacked In; Trace Alert is the system’s heat (`21`) |

### When systems collide

A single beat can touch several chapters: a Wrench’s drone covers a hallway (`23`) while a Hacker fights ICE (`21`) and an Operator bleeds Stamina (`04`). Resolve one action at a time. The Director picks the active board (meatspace or Wire), resolves that runner’s move, then cuts.

Chrome does not cancel magic by itself — **Cyborg Arcane Severance** and Veil erosion rules do (`05`, `09`, `22`). Money never buys a better Power Roll; it buys the tool you already trained to use.

---

## Table tone and safety

Ghostwire is street-level cyberpunk: violence, corp predation, body modification, and digital violation are on the table. That does not mean every table wants every beat.

Before the first session, the Director and players agree on **hard lines** (topics that stay out) and **soft lines** (fade to black / skip detail). Use any tool the group already likes — lines and veils, an X-card, a pause phrase. Ghostwire does not require a specific safety mechanic; it requires that the table has one and that the Director honors it without debate in the moment.

In play, keep the tone **professional and consequential**. Glamorize competence, not cruelty. When a scene would cross a hard line, cut or reframe. When chrome surgery, interrogation, or Wire biofeedback would get graphic past the group’s soft line, summarize the outcome and move on.

The Director may pause any scene. Players may pause any scene. Pausing is not a rules failure.

---

## Engine by reference (short)

Use Draw Steel Heroes for the left column. Ghostwire changes only what the right column says.

| Topic | Draw Steel Heroes | Ghostwire |
|---|---|---|
| Director’s role | As written | Same term: **Director** |
| Heroes / party | As written | **Runners** / **crew** at the table; rules may still say “hero” |
| Tests, Power Rolls, edges/banes | As written | Results always **low / middle / high** (`03`) |
| Combat loop | As written | GW keywords + Wire connection states (`04`, `21`) |
| Stamina, Recoveries, dying | As written | + Cyborg System Crisis; Revenant inert (`04`, `05`) |
| Ancestries | Replaced | **Peoples** (`05`) |
| Culture / career | Replaced | **Background** / **Profession** (`06`) |
| Kits | Pattern kept | GW Kit list; needs owned gear (`08`) |
| Wealth | Replaced | Tracked **¥** + Availability (`08`) |
| Treasure / magic items | Replaced | Gear, chrome, mods, foci (`08`–`10`) |
| Perks / classes | Pattern / replaced | GW perks (`11`); nine classes (`12`–`20`) |
| Projects / respite / downtime | As written | + §Craft, chrome surgery, lifestyle (`08`–`10`) |
| Negotiation | As written | Fixers, patrons, level-bosses |
| Advancement | As written | Levels + **Echelon** only — no tier ladder (`24`) |
| Malice / monsters | As written | GW Bestiary + Trace Alert (`25`, `21`) |

---

## Ghostwire’s additions at a glance

- **Money is real.** Runners track ¥ and buy the gear their Kits need (`08`).
- **Chrome costs flesh.** Living runners spend Body Integrity on implants (`09`). Cyborgs take Frame Modules and cannot cast Veil magic.
- **The Wired is a second battlefield.** Every runner can connect; Hackers and Technomancers live there (`21`).
- **Magic is rare and costly.** Veil casters fight chrome erosion; Cyborgs are severed from the Veil (`22`).
- **Machines are allies.** Anyone can run one drone; Wrenches run fleets and vehicles (`23`).
- **Lifestyle matters.** Burn, Medic restock quotes, and downtime projects live in print Ch 10 (`26`).

---

## Remap cheat sheet

Keep these renames straight; they appear everywhere.

| Draw Steel term | Ghostwire term |
|---|---|
| Ancestry | **People** |
| Culture | **Background** |
| Career | **Profession** |
| Wealth abstraction | **¥** (nuyen) + Availability |
| (no DS equivalent) | **Wire** (Matrix): Overlay / Jacked In / Trace Alert |
| (no DS equivalent) | **Veil** (magic layer; Rituals + summons) |
| (no DS equivalent) | **Chrome** / **Body Integrity** |

---

## Where to go next

| If you are… | Read next |
|---|---|
| Making a runner | `02` → People `05` → Background/Profession `06` → class `12`–`20` → Kit/gear `08` |
| Learning the dice | `03` Tests and Power Rolls |
| About to fight | `04` Combat |
| Jacking in | `21` The Wire |
| Casting or summoning | `22` The Veil |
| Running drones/vehicles | `23` Machines |
| Directing opposition | `25` Opposition |

This chapter tells you **how the night is shaped**. Later chapters tell you **how each system resolves**. When this book and Draw Steel Heroes disagree for Ghostwire play, **this book wins**.
