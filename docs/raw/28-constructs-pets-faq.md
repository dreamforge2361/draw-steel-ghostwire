# Constructs & Pets — Action Economy FAQ

---

## What this chapter covers

Four classes put a second body on the board: the **Hacker** compiles **Agents**, the **Technomancer** compiles **sprites**, the **Elementalist** binds **elementals**, and the **Street Priest** invokes **spirits**. They all answer the same three questions at the table — *when does it act, what are its hit points, and when does it go away* — and they answer them two different ways.

This is the short version, written to be read mid-fight. The full rules stay in the class chapters and in **The Veil** (`22`) §C3; nothing here overrides them.

**The one thing to remember.** An **extension** acts on *your* turn and costs you nothing extra to run. An **independent** construct takes *its own* turn in the round. Everything else is detail.

## FAQ — Sprites, Agents, and Spirits (action economy)

### When does my sprite or Agent get a turn?

Sprites (Technomancer) and Agents (Hacker) run the **same hybrid band ladder**, and your band is read off your own level every time you compile:

| Rank | Your level | When it acts |
|---|---|---|
| **Minor (extension)** | 1–3 | On **your** turn, as an extension of you. **No separate initiative.** |
| **Intermediate (commanded)** | 4–7 | On **its own turn** — but only in a round where you spend a **maneuver** to command it. No command that round, no turn that round. |
| **Advanced (independent)** | 8–10 | On **its own turn, every round**, like any other creature in the encounter (**Combat**, `04`). No command needed. |

You do not choose your band, and you cannot buy up into it early. A 3rd-level Technomancer's sprite is minor; a 4th-level Technomancer's sprite is intermediate the next time it compiles.

### I'm 4th–7th level. What exactly do I have to spend each round?

A **maneuver** — Compile Sprite's command mode (`20`) or Compile Agent's command mode (`19`). That maneuver is what keeps an **intermediate** construct acting on its own turn that round.

- Spend the maneuver → every commanded construct takes its own turn this round.
- Skip it → your intermediate constructs hold. They stay compiled and keep their Stamina; they just don't act.
- Roll **high (17+)** on the compile main action and you get a **free command** in the same action — compile *and* command in one go.
- Rolling **low (≤11)** means the construct manifests unstable (acts next turn instead of immediately) or the command garbles. Director's call on the misfire.

At **8th level and up** you stop paying this tax: advanced constructs act every round on their own, and the maneuver is free for other work.

### Do my constructs act before or after me?

**Minor (extension):** there is no "before or after" — they act *inside* your turn, on your intent.

**Intermediate and advanced:** they are their own figures on the shared round (**Combat**, `04`), so they take their own turn wherever the round puts them. The shipped sprite and Agent Actors each carry **one turn per round**.

### How many can I have out at once?

Hackers and Technomancers share the same cap ladder: **2** at 1st level, **3** from 5th, **4** from 8th. Caps do **not** stack — use the single highest number you qualify for.

The Technomancer's **Sprite-Weaver** discipline is the exception: Wide Compile starts that discipline at **3** from 1st level and keeps raising it through its higher-level features (up to **6** at 8th). Hackers have no equivalent bump.

Elementalists cap at **2 bound non-companion elementals**; a new bind releases the oldest. Signature companions (Ember / Zephyr / Boulder) don't count against that.

### What are my construct's hit points?

**Stamina.** There is no separate "pet HP" unit anywhere in Ghostwire. Sprites, Agents, elementals, and **independent** spirits each have an ordinary **Stamina** pool, take damage against it, and drop at **0**.

**Extension spirits have no Stamina track of their own** in RAW. If your table wants a number on the token, **The Veil** (`22`) §C3 gives one as a convenience (**20 + Persona × level**), and the Director may simply treat the extension as untargetable instead.

Actual formulas live in the class chapters: sprite and Agent Stamina is **archetype base + (Logic × Level)**, elementals are **rank base + (Logic × Level)**, independent spirits are **30 + (Persona × Level)**.

### What happens when my construct hits 0 Stamina?

It **decompiles** (sprites and Agents) or is released (elementals and spirits) — the token and the world Actor both go. Sprites and Agents also decompile when you dismiss them and when the **encounter ends**; they are temporary conjurations, not gear, and you do not carry them between fights. (The Technomancer's Sprite-Weaver capstone is the one printed exception.)

Dismissing is cheap on purpose: **Decompile** is a **free maneuver** for one construct or the whole roster. No resource refund.

### Does my Street Priest spirit get its own turn?

It depends entirely on the **Invoke the Pact** result (**The Street Priest**, `18`):

- **middle (12–16) — extension form.** The spirit acts **on your turn**, as an extension of your own action economy. No turn of its own, no Stamina track of its own, no sustain cost. Lasts until end of encounter or until you release it.
- **high (17+) — independent form.** The spirit becomes **its own figure with its own turn** on the shared round, with its own Stamina. Sustaining it costs **Persistent 2** (−4 Conviction per turn).
- **low (≤11) — failed bind.** No entity. On a dark pact it manifests just long enough to strike you once before departing.

Spirit strike is **4 / 7 / 10 + Persona** (holy or corruption, by pact) in **both** forms — the form changes the action economy, not the damage.

### Does my elemental get its own turn?

Same two forms, chosen by investment rather than by roll (**The Elementalist**, `17`):

- **Extension** (the early/low-investment shape, and every signature companion): acts **on your turn**. **Persistent 2** (−4 Essence per turn).
- **Independent** (properly bound, higher echelons): **its own figure and its own turn** on the shared round. **Persistent 4** (−8 Essence per turn).

Bind unlocks: **Rank 1 from 1st level, Rank 2 from 5th, Rank 3 from 7th**. The upkeep is the real cost — you cannot run a greater elemental at full tilt and spend freely on your own abilities in the same round.

### Are Agents and sprites the same thing?

**No, and they never share a stat block.** A Technomancer compiles **sprites** from the Wired's spirit world using **Resonance**; a Hacker compiles **Agents** as running deck processes using **Bandwidth**. Different Actors, different art, different language. Do not drag a sprite SKU onto a Hacker.

They happen to share the band ladder, the cap ladder, and the Stamina lock. That is the whole overlap.

A Hacker's **Watchdog Agent** is also not **Watchdog ICE** — the ICE is opposition sitting on a node (**The Wire** (`21`), **Opposition** (`25`)); the Agent is your own compiled screen.

### Can I compile while Linked?

Hackers: **no.** Compiling an Agent needs **Overlay or Jacked In** — Linked refuses, because a soft presence can't keep a daemon running. **Decompiling** works from any state, Linked or Disconnected; you can always kill your own process.

### Does my construct's attack backfire on me?

Constructs acting **on the Technomancer's own turn** — the minor/extension rank — **never trigger biofeedback** for the Technomancer. Being an extension is exactly what makes them a buffer between you and the wire. That buffer holds until a sprite goes independent.

### Can I command someone else's construct?

No. Command, panning, and Decompile stay with the **owner** (and the Director). Seeing a rival's construct listed on the Wired Console does not give you a handle on it, and does not reveal, unhide, or let you target its meat-side token.

### Can I shoot an enemy sprite in the face?

Not with a gun. A construct's **scene token is a roster anchor only** — Wire play happens in the Wired Console, and meat-space attacks against that token are **off** unless a printed ability explicitly bridges (a Resonance Strike routed through a device, a Daemon holding a breached Track 1 object, and similar). Fight constructs with **Wired and EW** attacks.

Extension spirits are a separate case: the Director may simply rule them untargetable, since RAW gives them no pool to attack.

### What about the pets the ritual chapter mentions?

Ritual Workings (**The Veil**, `22`) never spend Essence, Conviction, or Resonance, and most ritual entities are **not** encounter summons. When one does end up in a fight, the card says whether it fights as an **extension** or as an **independent** figure, and it then uses the §C3 Summon Entities numbers as its floor. Stay inside the bound-count caps unless the Director agrees.

## Director note

**Lock A (2026-09-20):** a construct's **scene token is a roster anchor only** — meat-space attacks and other meat actions against it stay **off** unless a printed ability explicitly bridges. Do not treat the token as a second copy of the runner.

**Where the roster lives.** Compiled constructs — sprites, Agents, and independent spirits — are a **separate Constructs section of the Wired Console**, not entries on the node graph. Overlay / Jacked In compilers on the same scene see each other's constructs there without a Scan. At the table you can also read the roster off the summon ability's own sheet (`19` / `20` / `22`).

**Two rulings worth making early.** First, whether extension spirits and extension elementals are targetable at all (RAW gives them no pool — untargetable is the clean default). Second, what a **low (≤11)** compile misfire looks like at your table, since that one is explicitly your call.

**Rank 2+ strike ladders and defense stamps are deferred** (**The Veil** (`22`) §C3). Use the printed Rank 1 / companion / spirit bands and your own judgment above them; don't invent a new ladder mid-session.

> **In Foundry**
> Open the **Wired Console** from the Token scene-control tools (network icon). The **Constructs** pane is the live roster, separate from Connections / Nodes. **Use Compile Sprite** (Technomancer) or **Compile Agent** (Hacker) from the Abilities tab to drop the matching Summons Actor beside you; at cap, Use commands the roster instead of compiling another. Elementalist and Street Priest summons spawn linked Actors from the **Summons & Machines** pack — open the summon ability's Item sheet for the roster, manual Summon / Dismiss, and per-pet dismiss. Decompile, 0 Stamina, or end of encounter removes the token and the world Actor.
