# The Wire

---

## The Wired System

The Wired is the network layer every hero can touch. This chapter defines what a node is, the four connection states (**Disconnected**, **Linked**, **Overlay**, and **Jacked In**), the System Stat Card (Node Rating **1–5**), Trace Alert, the **Wire Atlas** (how scenes nest), and the nine **Matrix Verbs** every hero has. Deck software (**suites** vs **payloads**) lives here too. **The Hacker** (`19`) adds Bandwidth, Programs, and **Agents** (Compile Agent — Probe / Spike / Daemon / Watchdog; software daemons, not sprites). **The Technomancer** (`20`) builds on the same Wire spine and compiles **sprites** from Resonance. Same net, different posture: the Hacker operates it; the Technomancer communes with it.

**Street comms.** After radio, **the Wire is the default street channel** — ID, packets, and crew talk ride Linked by default. **Radio remains a jammable backup.** You do not need Overlay to answer a ping.

### What a Node Is

A **node** is any addressable point in the Wired -- a maglock, a security camera, a corp host, a smartgun's wireless interface, a drone, a vehicle's control bus. Every Program, Matrix Verb, and Hacker ability ultimately targets a node (or a target *through* a node). Nodes come in two flavors for targeting purposes:

- **Track 1** -- objects, systems, and infrastructure: doors, lights, cameras, locks, power grids, vaults, and Wired-connected gear worn or carried by a person (a smartlink, a cyberware wireless interface). Track 1 targets resolve as a single Power Roll with no ongoing health pool -- you breach and act on it in the same activation.
- **Track 2** -- hostile, contested, or "alive" targets: ICE, hostile AIs, rival deckers, and any node actively defended by an intelligence fighting back. Track 2 targets have their own **Integrity** pool (see below) and can hit back.

### Connection States: Disconnected, Linked, Overlay, Jacked In

Four states. **Connect** (from Disconnected, with a Wire interface) lands you in **Linked**, not Overlay. **Toggle Connection State** (no roll) steps one rung deeper on the ladder, then wraps. **Jack Out** from any on-net state returns you to Disconnected.

| State | What It Means | Physical Awareness | Power Roll Tradeoff | Biofeedback Exposure |
|---|---|---|---|---|
| **Disconnected** | Off-net. Radio is a jammable backup. | Full | Normal meat rolls. Only **Connect** is a Wired verb. | **None — ×0.** Biofeedback cannot reach you off-net |
| **Linked** | On-net for comms / ID / packets — the post-radio Wire default. Soft presence. | Full | Meat Power Rolls **normal** (no Overlay bane). No Jacked In Wired edge. **Broadcast** (and receiving Wire messages) works. Does **not** count as full **Connected** for Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs / **Compile Agent**. | **None — ×0.** Linked is soft presence, not immersion: **a Linked runner takes no Biofeedback at all** |
| **Overlay** | Partial immersion -- your avatar rides alongside your physical senses. You see the Wired layered over the real world (an AR-style heads-up view of nearby nodes, marks, and traffic). | Full -- you can still see, move, speak, and react physically while Overlaid. | **Bane on real-world (physical) Power Rolls** -- the AR overlay is a genuine distraction competing for your attention with whatever's happening in front of you. No modifier either way on Wired Power Rolls. | Reduced — **×0.5, round down, minimum 1**. Biofeedback while Overlaid is half the node's listed Biofeedback Value. |
| **Jacked In** | Full immersion -- your avatar *is* your primary presence, and your body goes inert and exposed in the physical world (the reason your crew guards your body while you're under). | None. You cannot perceive, move, or act in the physical world while Jacked In, and you're an easy physical target. | **Edge on all Wired Power Rolls** -- full immersion sharpens every Matrix Verb, Program, and Wired-based signature ability. You cannot make real-world Power Rolls at all while Jacked In (no physical awareness means no physical action to roll for), and you cannot perceive or interact with the physical world in any way. | Full — **×1.5, round up**. The tradeoff for full-immersion speed and power. |

**On-net vs Connected.** **On-net** (the Connected-family) means Linked, Overlay, or Jacked In. **Connected** (full) means Overlay or Jacked In only. Features that say “Jacked In or Overlaid” still mean those two — Linked does not satisfy them. **Compile Agent** (`19`) is the same gate: Overlay or Jacked In; Linked refuses. A handful of higher-echelon features (Anchor Point, Emergency Patch's biofeedback-cancel clause) key specifically off **Jacked In** alone.

**Wire-discoverable.** Scan, Search, and Watchdog ICE can find any non-Disconnected presence. **Linked = soft presence** (comms / ID / packets, not a full avatar). Overlay and Jacked In are full presence. A Hacker’s **Watchdog Agent** (`19`) is a compiled screen, not Watchdog ICE.

**Construct Wire visibility (LOCKED).** Sprites (`20`) and Agents (`19`) that share **the same scene Wire** auto-see each other when **both compilers** are **Overlay or Jacked In**. No Scan tax. Stealth, Hidden, or a construct on another board / scene stays hidden. **Meat tokens are not Wire eyes** — a body on the floor does not reveal constructs, and a construct does not automatically see meatspace tokens. Linked-only compilers do not grant this auto-see.

**Toggle ladder (Foundry UX).** One verb, one direction: **Linked → Overlay → Jacked In → Linked**. Each Toggle steps deeper; after Jacked In it wraps back to Linked (comms-only), not Disconnected. **Jack Out** is the only off-ramp.

**Ruling:** Overlay and Jacked In remain a genuine mechanical tradeoff. **Linked** is the street-default on-ramp — you are on the Wire for talk and packets without paying Overlay’s meat bane or gaining Jacked In’s Wired edge. **Overlaid**, you keep both worlds live but pay a **bane on real-world Power Rolls** for the split attention. **Jacked In**, you gain an **edge on all Wired Power Rolls**, but you lose the real world entirely. This is why the crew treats a Jacked-In Hacker's body as cargo to protect.

You leave any on-net state with the **Jack Out** Matrix Verb -- a clean disconnect that also serves as your emergency eject if a Program or Trace Alert spike goes bad.

### Wire interface (Connect)

**Connect** requires a **Wire interface**. Any of these counts:

- **Comms / deck / chrome:** a commlink, cyberdeck, datajack, trodes, or other tagged comms / chrome interface
- **Wrench drone control:** an **RCC** (Remote Box, Fleet Deck, War Table, Command Rig, Hydra Console) or **Rigger’s Harness** (neural control-interface mount). Harness ≡ deck. Fabricator’s Bench (tool rig) and Field Chassis (turret tablet) are **not** interfaces
- **Wire Kit — Matrix Verbs** on an NPC, drone, or vehicle (Director stamp). **Pack drones and vehicles** (all nine `machine-drone-*` / `machine-vehicle-*` band templates, plus plot vehicles like Nox’s trash freighter) ship with the kit so imports/deploys are Wire-ready; they still start **Disconnected** until Connect
- **Technomancer** (class) — deckless Resonance; no gear required

Spoof Kit is **not** an interface. Rigger Cocoon is a vehicle Jump-In mod, not an interface. Without an interface, Connect refuses: “Need a commlink, deck, rigger interface, datajack, or trodes — or be a Technomancer.”

> **In Foundry**
> **Linked**, **Overlay**, and **Jacked In** are exclusive token/sheet status effects (`ghostwire-linked` / `ghostwire-overlay` / `ghostwire-jacked-in`). Use **Connect**, **Toggle Connection State**, and **Jack Out** from the node applet (Connect needs a commlink, deck, datajack, trodes, **Wire Kit**, **Rigger’s Harness** / RCC, or Technomancer Resonance) — they set the status. **Connect** lands in Linked. **Toggle** steps Linked → Overlay → Jacked In → Linked. **Jack Out** from any on-net state → Disconnected. The hero sheet **Stats** tab shows a read-only Wired state under Body Integrity. The Console roster lists all four states (Jacked In, Overlay, Linked, Disconnected). Linked applies neither Overlay’s meat bane nor Jacked In’s Wired edge. Broadcast and Wire-ping whispers work from Linked; Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs / **Compile Agent** refuse until Overlay or Jacked In. Minimap and Overlay vision stay Overlay / Jacked In only.


### Wired-System Stats: Integrity (Not Body Integrity)

Every Track 2 target -- and the "system" side of any Wired encounter -- tracks its own **Integrity**: a Stamina-equivalent health pool that Programs and abilities damage directly (via your cyberdeck's Integrity Damage Bonus) rather than dealing physical damage. Reducing a Track 2 target to 0 Integrity takes it down, exactly as reducing a creature to 0 Stamina does.

**Do not confuse this with Body Integrity** (**Chrome & Body Integrity**, `09`). They share a name but are different systems: Body Integrity is a permanent capacity for how much chrome a living hero can carry; Wired-system Integrity is an encounter-scoped health pool belonging to nodes, ICE, hostile Personas, and rival deckers.

| Node Rating | Integrity |
|---|---|
| Rating 1 (street-grade) | 12 |
| Rating 2 | 18 |
| Rating 3 | 26 |
| Rating 4 | 36 |
| Rating 5 (alpha/AAA-corp core) | 50 |

The same Integrity table scales ICE, hostile AIs, and rival-decker Track 2 targets by Node Rating.

> **In Foundry**
> Open the **Wired Console** from the Token scene-control tools (network icon) or a keybinding under Configure Controls. Directors edit Scene-tied boards: nodes, Rating 1–5 templates, Integrity, Trace Alert, reveal, and **node↔node wires**. **Constructs** lists compiled sprites and Agents (Lock A: scene token = meat-side roster anchor; Overlay / Jacked In compilers on this scene see each other without Scan; meat actions off unless an ability bridges). Players open the **Wired node** facing them (token / node panel) to fire all nine Matrix Verbs — **Connect**, **Jack Out**, **Toggle Connection State**, **Scan**, **Ping**, **Navigate**, **Broadcast**, **Search**, **Read/Write**. Connect needs a commlink, deck, datajack, trodes, **Wire Kit**, **Rigger’s Harness** / RCC, or Technomancer. The roll uses that runner (Instinct / Logic, Hacking, Jacked In, Reader). The Director Console still shows the board and roster (and can fire the same verbs). The **Wired minimap** auto-opens when you own an Overlay or Jacked In actor (compact Overlay / larger Jacked In); click a revealed node to open its verb panel.
>
> **Constructs Console (Lock A).** Compiled constructs — sprites, Agents, and independent spirits — are a **separate Console section** from the node graph. Do not list them as nodes. The Console **Constructs** pane is the roster; at the table you can also track it on the summon ability sheet (`19` / `20` / `22`). Pet hit points are **Stamina** (sprites, Agents, independent spirits). Extension spirits have **no separate pool**.


**Biofeedback bleed-through:** some hits carry an "Integrity-to-Stamina biofeedback bleed-through" clause (see Failsafe Cascade, Emergency Patch, Anchor Point) -- this is the mechanism by which damage done to a *node's* Integrity can bleed back into a *Hacker's own* Stamina, gated by your cyberdeck's Biofeedback Resistance stat and your connection state. Every bleed-through resolves on the same four steps as any other bite: see **Biofeedback -- the full procedure**, below.

### System Stat Card -- The Universal Template for Nodes, ICE, and Systems

Every node, system, ICE construct, hostile AI, or rival decker in the Wired is built from the same stats. The Director fills in this card for any Track 1 object or Track 2 target on the fly — every number is keyed off a single input, the target's **Node Rating** (**1** = street-grade / weakest → **5** = alpha-corp / strongest). Node Rating is a **system defense grade**, not a character level or echelon.

| Stat | Applies To | What It Represents | How It's Calculated |
|---|---|---|---|
| **Node Rating** | Both Tracks | The target's overall Wired defense grade (Rating **1–5**) -- the single input that sets every other stat on this card. | A Director-assigned Rating reflecting how well-defended/valuable the system is (street-grade lock = **Rating 1**; alpha-corp core = **Rating 5**). Not a character level or echelon. Everything below reads off this one number. |
| **Node Description** | Both Tracks | The node's aesthetic -- often artistic and stylized to brand the System, and represented in the Wired by a holographic icon or similar visual signature (a corp's sigil rendered as a floating glyph, a black-market host skinned like a snarling dog, a government node as a flat gray monolith). Pure flavor, no mechanical effect -- but it's how a Hacker (and the table) actually *sees* a node before touching it. | Director/Session-defined per node, not Rating-derived like the other rows -- describe it to match the node's owner, purpose, and reputation. No formula; this is narrative color layered on top of the mechanical stats above. |
| **Breach difficulty** *(optional shortcut)* | Both Tracks | How hard the node is to force entry into, for tables that want a quick difficulty call instead of reading the full Power Roll result. | Fixed by Node Rating: **R1 easy · R2 easy with a bane · R3 medium · R4 hard · R5 hard with a bane.** The primary resolution is still the Power Roll result (low / middle / high) — this shortcut is for trivial nodes only. |
| **ICE Layer(s)** | Track 2 (defines what's actively fighting back) | The node's active defenses -- how many layers of passive/active ICE stand between you and full access, and whether black ICE (the kind that bites back with biofeedback) is present. | Fixed by Node Rating: **R1** 1 passive layer · **R2** 2 passive layers · **R3** passive + 1 active ICE · **R4** passive + 2 active ICE, biofeedback on a failed breach · **R5** full active ICE suite + automatic counter-trace on any high (17+) roll against it. **Passive layers at R1-2 are flavor only and never deal Biofeedback**; active ICE (R3+) bites only on the four **ICE attack triggers**, below. |
| **Integrity** | Track 2 (Track 1 has none -- see note below) | The target's health pool -- the Stamina-equivalent number that Programs and abilities whittle down via your cyberdeck's Integrity Damage Bonus. Reaching 0 takes the target down. | Fixed by Node Rating: **R1** 12 · **R2** 18 · **R3** 26 · **R4** 36 · **R5** 50. |
| **Biofeedback Value** | Track 2 (the damage that can bleed back to *you*) | The raw Stamina damage a hostile hit (black ICE, catastrophic failure) deals back through your deck into your own body if it connects. | Fixed by Node Rating: **R1** 3 · **R2** 5 · **R3** 8 · **R4** 13 · **R5** 22. Then scaled by **your own connection state** (see Connection States table, above): **none** while Disconnected or Linked (not immersed) · **×0.5 round down, min 1** if Overlaid · **×1.5 round up** if Jacked In. There is no ×1 “wired-direct” multiplier. Finally reduced by your cyberdeck's **Biofeedback Resistance** stat before it hits your Stamina, and floored so that Biofeedback alone never kills you. Full four-step procedure and the Winded floor: **Biofeedback -- the full procedure**, below. A node's Biofeedback Value only ever *fires* on one of the four **ICE attack triggers**, also below -- ICE does not bite every round. |
| **Alert Contribution** | Both Tracks | How much heat interacting with this target generates -- not a separate number of its own, but a reminder that every Track 1/Track 2 interaction feeds the *same* 12-step Trace Alert track (see below), regardless of Rating. Higher-Rating targets don't push Alert up faster per hit, but their tougher Integrity/ICE means you're rolling against them -- and risking low (≤11) results -- more times per encounter. | Not Rating-scaled on its own. Governed entirely by the Trace Alert rules below (Power Roll result of your roll, not the target's Node Rating, decides whether Alert moves). |

**Track 1 note:** Track 1 objects and systems (doors, cameras, locks, a person's smartlink) use only **Node Rating**, **Node Description**, **Breach difficulty**, and **Alert Contribution** from this card -- they resolve as a single Power Roll with no ongoing Integrity pool and no ICE layers of their own (per the Wired System's "What a Node Is" section, above). A Track 1 target is breached and acted on in the same activation; there's nothing left to "reduce to 0."

**Track 2 note:** Track 2 targets (ICE, hostile AIs, rival deckers, and any actively-defended node) use the full card -- Node Rating, Node Description, Breach difficulty, ICE Layers, Integrity, Biofeedback Value, and Alert Contribution all apply. This is the template a Director uses to stat up any hostile Wired presence on the fly: pick a Node Rating (1–5), and all five downstream numbers are already fixed by the table.

**Worked example -- statting a Rating 3 corp host (Track 2) on the fly:** Node Rating 3 -> Breach difficulty medium (optional) -> ICE Layers: passive + 1 active ICE -> Integrity 26 -> Biofeedback Value 8 (x1.5 = 12, round up, if a Hacker gets hit while Jacked In, before that Hacker's own Biofeedback Resistance reduces it further) -> Alert Contribution: governed by the standard Trace Alert rules on every roll against it, same as any other target.

### Biofeedback -- the full procedure

Biofeedback is the Wired hitting back: damage that crosses out of a *system* and into a *body*. Two things in Ghostwire deal it, and they resolve the same way.

- **Wire Biofeedback** -- ICE, black ICE, an Integrity-to-Stamina bleed-through clause, or a catastrophic bite from the host you are standing in. That is the procedure below.
- **Technomancer overreach** -- a failed biofeedback test after spending 5 or more Resonance (**The Technomancer**, `20`). Different trigger, different base number, **the same floor**.

**Four steps, in this order.**

1. **Base Biofeedback Value, by the host's Node Rating.** **R1** 3 · **R2** 5 · **R3** 8 · **R4** 13 · **R5** 22. These are the numbers already printed on the System Stat Card, above; a Director may name a custom base instead when the fiction calls for one.
2. **Scale it by *your own* connection state.** **Disconnected** or **Linked** → **0 — no Biofeedback at all.** **Overlay** → **×0.5, round down, minimum 1.** **Jacked In** → **×1.5, round up.** There is no ×1 step.
3. **Subtract your deck's Biofeedback Resistance.** Your cyberdeck's Biofeedback Resistance stat (**The Hacker**, `19`) comes off the **scaled** number, not the base. It never takes the damage below 0.
4. **Apply the remainder as Stamina damage.** This is untyped damage to your own Stamina — not Integrity damage, and not a saving throw.

**Worked line.** A Rating 3 host bites an **Overlaid** runner carrying a street deck (Biofeedback Resistance 2): base **8** → Overlay **8 × 0.5 = 4** → minus **2** → **2 Stamina damage**. The same host biting the same runner while **Jacked In**: base **8** → **8 × 1.5 = 12** → minus **2** → **10 Stamina damage**. That difference is the whole argument for staying Overlaid.

#### The Winded floor (both sources)

**Biofeedback that would take your Stamina to 0 or below leaves you Winded, not Dying.** You stop at **1 Stamina**, you regain **1 Stamina per turn until stabilized**, and Biofeedback on its own can never kill you.

- **The floor never heals.** If you are already at 1 Stamina you stay at 1, and a hero already down at 0 from gunfire is not brought back up by a bite.
- **Only Biofeedback is floored.** Non-Biofeedback damage — a round, a blade, a fall, a hostile spell — still takes you to 0 and into Dying as normal, on the same turn if it lands. Being saved by the floor does not make you safe.
- **One floor, two sources.** Wire Biofeedback (above) and **Technomancer overreach** (`20`) use the same floor, worded the same way in both chapters. Neither is a separate rule.

> **In Foundry**
> The Director macro **Director: Apply Biofeedback** (Ghostwire Macros) runs exactly these four steps and this floor. Pick a Node Rating 1–5 — or type a custom base — and it reads the target's connection state and deck Biofeedback Resistance off the Actor, with an override on each. The chat card shows the whole line (base, scale, resistance, damage, Stamina before → after) and says so when the Winded floor caught the hit.

### ICE attack triggers -- when ICE actually bites

**ICE does not get a free attack every round.** It is a defence, not a second initiative slot. Active ICE deals Biofeedback on exactly four triggers:

1. **A low (≤11) Wired Power Roll** against a host that has **active ICE** (Node Rating **3** or higher) — **one** Biofeedback bite, on top of the usual +1 Trace Alert.
2. **A failed breach against a Rating 4+ host** — Biofeedback as already printed on the System Stat Card (R4 and R5 both carry biofeedback on a failed breach).
3. **Trace Alert 9–11 — the hunt bite.** At the **end of each of the runner's turns**, while they are still **Overlay or Jacked In** on that host, the hunting ICE bites **once**. Step back to Linked, or Jack Out, and the hunt bite stops.
4. **A Director Malice ICE surge** — the Director spends Malice to have the host's ICE strike now. The Malice the Alert track pays out at steps 5–8 is what funds it.

And the limits that go with them:

- **Passive ICE at Rating 1–2 is flavor only — it never deals Biofeedback.** A first-layer firewall stirring is atmosphere, not damage.
- **Linked deals no Biofeedback**, on any trigger: step 2 of the procedure scales it to 0 before anything else happens. Neither does Disconnected.
- **Default target: the compiler.** Host ICE bites the runner whose roll or whose presence set it off — the person holding the deck. It does not reach past them into the rest of the crew unless an ability says so, and a compiled Agent or sprite is not a lightning rod for its compiler.
- **One trigger, one bite.** Two different triggers on the same turn are two bites; the same trigger firing twice in one turn is still one.
- **A Black ICE *creature* is a different thing.** An ICE construct statted as an opposition Actor (the Bestiary's **Black ICE**, or a rival decker's screen run as a combatant) is a **Track 2 combatant**: it takes its own turns like any creature, and its damage is whatever its card prints. The four triggers above govern a **host's ICE layers** — the defence built into the node — not a creature the Director has put on the board. If a Director wants ICE that acts every round, they stat it as a creature so the table can see it coming. Either way, Biofeedback it deals still runs the four-step procedure and still lands on the Winded floor.

> **In Foundry: the node applet runs the four triggers, and asks first.** Open the Wired node in front of you and the applet watches for all four on its own. A Wired Power Roll of **11 or under** against a Track 2 host with active ICE (Rating 3+), and a **failed breach** against a Rating 4+ host — a Navigate, Search or Read/Write that came in under the printed **Breach DC** — each raise a Director card. So does the **hunt bite**: while a host sits at **Trace Alert 9–11**, the end of each of that runner's turns offers one bite for as long as they stay Overlay or Jacked In. The Director's own **Malice ICE surge** is a button on the node. **Nothing is ever applied silently.** Every card shows the whole line prefilled — Rating → base, scaled by the runner's connection state, minus the deck's Biofeedback Resistance, damage, Stamina before and after, and the Winded floor when it catches — and **Cancel leaves Stamina exactly where it is**. Apply runs the same pipeline as **Director: Apply Biofeedback**; there is no second Stamina path. A **Linked** or **Disconnected** runner never sees a card at all, because step 2 has already taken the bite to zero. The node's **Trace Alert strip** marks the three steps that matter — **5** (the Director banks Malice), **9** (the hunt wakes) and **12** (lockout and counter-trace) — and announces each one in chat as the track crosses it. Ghostwire does **not** spend your Malice for you: the surge says what it cost and leaves your count alone. A collapsible **Wire run checklist** on the same applet walks the North Substation spine — Connect → Linked → Broadcast, Toggle to Overlay, Scan / Deep Scan, Track 1 vs Track 2, watch lows against ICE, Integrity, the Alert bands, then Decompile and Jack Out — as guidance only: ticking a step blocks nothing and rolls nothing.

### Trace Alert: Definition and Escalation

**Trace Alert** (called "the Alert Track" on some abilities) is the Wired system's rising detection meter — the longer you stay in a hostile host, the worse it gets. Track it **per hostile node/host** on a **12-step track**:

| Alert Steps | Effect |
|---|---|
| **1–4** | No mechanical effect yet — flavor only. Passive ICE stirs, but nothing bites. |
| **5–8** | **+1 Malice to the Director per step crossed** (cumulative) — rising Alert feeds the Director's Malice pool, the same heat engine used in physical combat. |
| **9–11** | As above, plus the **ICE hunt bite** — active ICE is hunting you. At the **end of each of the runner's turns**, while they are still **Overlay or Jacked In** on this host, that ICE deals **one Biofeedback hit** (trigger 3 under **ICE attack triggers**, above; full math and the Winded floor under **Biofeedback -- the full procedure**). Stepping back to Linked or Jacking Out stops the bites. |
| **12 (max)** | **Full lockout** and a **hard counter-trace to your physical location** (security, corp response, or a rival decker's crew inbound on your real-world position) — then the track **resets to step 6**, not to 0. A maxed-out host never fully forgets you found it. |

#### Default Alert by Power Roll result (locked)

Unless an ability's printed text says otherwise, every Wired Power Roll (Matrix Verb, Program, payload Run, or Wired signature ability) uses these Alert defaults:

| Result | Trace Alert (default) |
|---|---|
| **Low (≤11)** | **+1** to that host's Trace Alert. The verb or Program still usually works, but something goes wrong — logs notice you, ICE twitches, the host marks the intrusion. |
| **Middle (12–16)** | **No Alert increase.** Clean success. Middle never raises Trace Alert by default. |
| **High (17+)** | **No Alert increase.** Always clean on Alert. Some abilities also erase Alert that would have risen, or leave zero forensic trace, as their high payoff. |

**Ability text can override the middle default** — only when it explicitly says the middle result raises Alert (or raises it by more than one). Most Hacker Programs do **not**; check each card. Low remains the default trigger unless stated otherwise.

**Other Alert movers (not a second tax):**

- **Direct triggers** named on an ability, independent of the Power Roll band (rare; follow the card).
- Triggered features that fire *when* Alert rises (e.g. Ghost Step) — they react to an increase; they do not cause one by themselves.
- There is **no separate “noisy Track 2” Alert tax** beyond the roll result. Hostile or contested rolls still use the table above; Track 2 just means you may roll more times against Integrity/ICE, so low results (and Alert) come up more often in practice.

**What never raises Alert by itself:**

- **High (17+) results** — always clean on Alert.
- Ability clauses that zero Alert gain entirely (example: **Backdoor Override**'s Track 2 application leaves no trace).
- Pure observation verbs that only look (**Scan**; class Deep Scan) — they do not raise Alert on their own. Active intrusion, contested, or hostile verbs use the defaults above.

**Managing Trace Alert.** The Hacker has tools to lower or freeze the track rather than only avoid raising it (see **The Hacker**, `19`):

- **Ghost Step** (3rd level) — as a Free Triggered Action, when the Alert Track increases from your own action, cancel that specific increase (once per encounter).
- Higher-level Hacker Programs and capstone features extend this further, up to freezing the Alert Track for the whole crew.

**As the track climbs:** steps 1–4 are atmosphere (a light flicker, a camera pausing a beat too long). Steps 5–8 feed the encounter's Malice budget — the whole table feels the heat, not just the runner. Steps 9–11 are where the host starts hurting the runner: one Biofeedback hunt bite at the end of every one of their turns for as long as they stay Overlay or Jacked In. Step 12 breaks containment: the fight leaves the Wired and becomes a meatspace problem, which is why the rest of the crew watches the clock too.

## Matrix Verbs (Universal)

These 9 abilities aren't unique to the Hacker -- *any* hero with a **Wire interface** has them (commlink, cyberdeck, datajack / trodes, **Rigger’s Harness** / RCC, **Wire Kit** on an NPC, pack drone, or pack vehicle, or Technomancer Resonance). They're the baseline vocabulary of doing anything in the Wired. All 9 cost exactly 1 Maneuver. Two are automatic (no roll); the other seven are genuine Power Rolls, and **having the Hacking skill grants an edge on all seven** (instead of the usual skill bonus on tests).

| Verb | What It Lets You Do | Roll Characteristic | Roll? | High (17+) Bonus |
|---|---|---|---|---|
| **Connect** | Plug your avatar into the Wired at your current location -- lands you in **Linked** (on-net for comms / ID / packets). Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs still need Overlay or Jacked In (Toggle). Requires a Wire interface (commlink / deck / chrome, **Rigger’s Harness** / RCC, **Wire Kit**, or Technomancer). | Instinct | Yes | Refunds the Maneuver |
| **Jack Out** | Disconnect cleanly from any on-net state (**Linked**, Overlay, or Jacked In) and return your full attention to the physical world -- your emergency eject button when things go wrong on the Wired side (biofeedback spikes, hostile ICE lock-on). Also usable as a Free Triggered Action in a genuine emergency, on top of its normal Maneuver use. | Instinct | Yes (also usable as a Free Triggered Action in an emergency, layered on top of the Maneuver cost) | Refunds the Maneuver |
| **Toggle Connection State** | Step one rung deeper on the ladder, then wrap: **Linked → Overlay → Jacked In → Linked**. No contest -- it's your call, always. Jack Out is the only path to Disconnected. | -- | No -- automatic | -- |
| **Scan** | Get a read on what Nodes exist near you within Reach -- doors, cameras, locks, drones, any Wired-connected system in range. Requires Overlay or Jacked In (Linked-only refuses). Scan can find any on-net presence; Linked reads as a soft presence. | Instinct | Yes | Refunds the Maneuver |
| **Navigate** | Move through the Wired itself, up to your Reach in Nodes -- the Matrix-side equivalent of physical movement, letting you reposition to reach a node, ally, or target you couldn't otherwise touch. | Instinct | Yes | Refunds the Maneuver |
| **Ping** | The lightest “touch this system” verb -- a nudge, not a deep hack. One simple **Track 1** thing within Reach does one small thing, without a Program or a full Read/Write: flick lights (the classic Ping); tap a maglock to see if it’s live / soft jolt (**not** unlock for entry); test whether a camera or door bus answers / brief glitch (**not** lasting cam-off); trigger a trivial system response. Unlock and lasting cam-off are **Read/Write**. Track 1 only (no ICE) -- ICE is **Track 2**. Ping does not bypass or defeat ICE; an ICE-guarded / Track 2 host is the wrong tool (Programs / payload Runs / real breach). Director may flavor a failed poke (ICE twitches, Soft Trace) but Ping never opens or controls the guarded system. Overlay or Jacked In. Not Console Wire ping/spoof. | Logic | Yes | Refunds the Maneuver |
| **Broadcast** | Send a message to allies who are on-net (**Linked**, Overlay, or Jacked In), within Reach or Ghost Distance -- a private, Wired-only comms channel no one outside the link can intercept. Works from Linked. No contest; it just works. | -- | No -- automatic | -- |
| **Search** | Dig into a node you're already at to find something specific hiding inside it -- the follow-up to Scan (which tells you what's around) when you need to know what's buried in one particular place. | Logic | Yes | Refunds the Maneuver + extra intel |
| **Read/Write** | Change data, settings, or state -- read a file, alter a record, plant or delete evidence, forge a credential, **unlock a maglock for entry**, or **toggle a camera off / kill a feed**. This is the verb that actually changes information and device state in the Wired, not a Ping nudge. | Logic | Yes | Leaves **zero forensic trace** (does NOT refund the Maneuver -- this verb trades the refund for a clean exit instead) |

**Low (≤11)** on any rolling verb generally means “it works, but something goes wrong” — by default **+1 Trace Alert** (see Trace Alert defaults above). **Middle (12–16)** is a clean success with **no Alert increase**. **High (17+)** is a clean success plus the bonus listed above, and never raises Alert.

### Ping vs Read/Write

**Ping** is the lightest “touch this system” Matrix Verb — a nudge, not a deep hack. Use it when you want a simple Track 1 thing within Reach to do one small thing, without a Program or a full Read/Write:

- Flick the hallway lights off (or on) — lights are the classic Ping.
- Tap a maglock to see if it’s live / soft jolt (**not** unlock for entry — that’s **Read/Write**).
- Test whether a camera or door bus answers / brief glitch (**not** lasting cam-off — that’s **Read/Write**).
- Trigger a trivial system response (“does this socket wake up?”).
- **Not ICE.** Ping targets simple **Track 1** only (no ICE). ICE is **Track 2**. Ping does not bypass or defeat ICE.

Logic, Maneuver, Overlay or Jacked In. Tier 2 is clean; tier 1 often Soft Trace; tier 3 is clean and refunds the Maneuver.

**Doctrine:** Ping = touch/test nudge. Read/Write = change data, settings, or state (unlock a maglock, kill a cam feed). Scan = what’s near; Search = what’s inside; Broadcast = Wire talk (Linked OK). Programs / payload Runs / real breach = ICE and Track 2.

Ping is **not** the Director Console Wire ping/spoof.

### Ping vs ICE

Ping targets simple **Track 1** only (no ICE). ICE is **Track 2**. Ping does not bypass or defeat ICE.

Trying Ping on an ICE-guarded / Track 2 host is the wrong tool — use Programs / payload Runs / a real breach. The Director may flavor a failed poke (ICE twitches, Soft Trace), but Ping never opens or controls the guarded system.

## Wire Atlas / topology

Device tokens answer **what is this socket**. Atlas tokens answer **where am I on the Wire map**. Directors place atlas tokens by hand. Room-scale auto-nodes (lights, maglocks) never appear on a district or facility graph.

### Three altitudes

| Altitude | Scene example | Token family |
|---|---|---|
| **Region / district graph** | Switchboard district map | **Relay**, **Host** |
| **Site / facility graph** | Power Company Wire scene | **Segment** (+ **Host** as the site root) |
| **Room / device graph** | Office, Gold Line car, maintenance room | **Device** (existing library: Light, Maglock, Cam, ICE, …) |

Ghostwire words: **Relay**, **Host**, **Segment**, **Endpoint**, **Device**. Do not call a Host a “server farm” in player text.

### Reach is hops on the current scene

**Scan** and **Navigate** **Reach** is a number of **node-hops on the graph of the Scene you are on**, not the whole district and not Ossian Reach the campaign region. When the crew changes altitude (district → facility → room), Reach recounts from the new graph. A runner with Reach 2 on the Switchboard district map can hop two Relays/Hosts; they cannot see the Power Co substation or a maintenance-room maglock until that scene is loaded.

### Relay vs Host vs Segment

| Token | Role | Rules hook |
|---|---|---|
| **Relay** | Major Wired highway / backbone traffic — a **path**, not a place | Navigate along it. Trace can travel fast on a Relay. Usually **not** Seize-for-loot. Node Rating is optional (traffic density). Track 1 unless something is hunting the backbone. |
| **Host** | Destination place (corp, civic, street). Faction is name and color, not a new token type. | May have Node Rating, ICE, Watchdog. Entering a Host **may change scene** (load the facility graph). |
| **Segment** | Child of a Host (substation, wing, server hall) | Same mechanical class as Host, nested. **Name includes the parent** (`Power Co — North Substation`). |
| **Endpoint** *(optional v1.1)* | Dig-down leaf that opens a meatspace room | Not a fourth mechanical class. Until its own art exists, reuse Host with a depth pip. |
| **Device** | Room socket: Light, Maglock, Cam, ICE, … | **Room-only.** Never place device tokens on a region graph. |

### Dig-down procedure

1. **District scene:** place **Relays** and **Hosts** only.
2. **Enter Host** (Navigate, Seize, or story) → load the **facility** scene; place **Segments**. The Host may remain as the site root.
3. **Enter Segment** (or Endpoint) → load the **room** scene; place **Device** tokens. Auto-nodes from named lights and doors belong here.
4. Auto-nodes stay **room-scale only**. Atlas tokens are Director-placed (a Console picker is later).

### Worked example — Switchboard to the maintenance room

**District (Switchboard).** Relays: Flats Backbone, Melt Market Trunk. Hosts: Power Co, Cassavir’s Booth. No devices.

**Facility (Power Co).** Site-root Host: Power Co. Segments: **Power Co — North Substation**, Power Co — South Bay. Reach is hops among these, not back to the district Relays.

**Room (North Substation maintenance).** Devices: `North Substation - Light Control`, `North Substation - Maglock Door 1`. This is the only altitude where auto-nodes and the eight device styles belong.

> **In Foundry**
> Atlas styles are `node-relay` / `node-host` / `node-segment` under `assets/tokens/wired/` (catalog in `library.json`). Twelve Conglomerates Host skins are `node-host-{ticker}` (HAL…NYX plus **AEQ** / **LAZ** — `node-host-aeq` / `node-host-laz`, `placeholder: false`). Device styles (Light Control, Maglock) stay room-scale. Do not run Gold Line `{ force: true }` to place atlas tokens. Brand marks: `assets/brands/megacorps/brand-{ticker}.{png,webp}`.

## Connection-state modifiers (summary)

**On-net** means **Linked**, **Overlay**, or **Jacked In**. **Connected** (full) means **Overlay** or **Jacked In** only. **Disconnected** means off-net. Payload Runs, Programs, **Compile Agent**, and Scan / Navigate / Ping / Search / Read-Write require Connected. **Broadcast** is allowed from Linked.

| State | Wired abilities (Wired keyword) | Real-world abilities and tests |
|---|---|---|
| Disconnected | Only **Connect** can be used | Normal |
| Linked | **Broadcast** only (plus Toggle / Jack Out). No Programs, payload Runs, or **Compile Agent** | Normal |
| Overlay | Normal (full Connected) | **Bane** |
| Jacked In | **Edge** | Can’t be used (body inert) |

- **Connect** works only while Disconnected (plus a Wire interface) and puts you in **Linked** on any result.
- **Toggle Connection State** (on-net only) steps **Linked → Overlay → Jacked In → Linked**.
- **Jack Out** (any on-net state) returns you to Disconnected.
- **Broadcast** works from any on-net state, including Linked.
- Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs / **Compile Agent** require Overlay or Jacked In.
- Having the **Hacking** skill gives an edge on every rolling Matrix Verb and other Wired ability.

**Anyone vs Hacker.** Any hero with a **Wire interface** (commlink, cyberdeck, **Rigger’s Harness** / RCC, **Wire Kit**, or Technomancer Resonance) can use the nine Matrix Verbs. Only the Hacker (and Wired class features that say so) spends **Bandwidth** on **Programs** and **Compile Agent**. Deck **suites** and **payloads** are gear software any deck owner can install; they are not class Programs. Agents (Probe / Spike / Daemon / Watchdog) are Hacker-only deck daemons, not Technomancer sprites.

## Constructs (Sprites and Agents)

Compiled **sprites** (Technomancer, `20`) and **Agents** (Hacker, `19`) are Wire constructs, not extra nodes on the host graph.

**Lock A (2026-09-20).** A construct’s **scene token is a roster anchor only**. Wire play lives in the **Wired Console**. Meat-space attacks and other meat actions against that token stay **off** unless an ability explicitly bridges (Resonance Strike through a device, a Daemon holding a Track 1 object, and similar printed bridges). Do not treat the token as a second copy of the runner on the Connections list.

**Constructs section.** The Console lists compiled sprites and Agents in a **Constructs** roster, separate from **Connections** and **Nodes**. Owner and Director see the relevant rows (name, archetype, Stamina, hybrid band, compiler). A **Special Agent** or **Special Sprite** (`19`, `20`) is an ordinary roster row with no archetype: its purpose and its action budget are printed on its own description as `Actions (N): …`, and the Console shows it under the same cap as every other construct. **Overlay / Jacked In compilers on the same scene see each other’s compiled sprites and Agents in that roster without Scan.** Linked is soft presence and does not. An optional chip may name the Wire node the construct is **facing** — a label only. **Do not** add construct↔node edges to the board graph; node↔node wires stay infrastructure topology.

**Meat-side anchors.** Construct scene tokens stay roster anchors only (Lock A). Seeing a rival construct on the Console does **not** reveal, unhide, or grant meat-space targeting of that token. Pan / Command / Decompile stay with the owner (and Director).

**Construct vs construct.** Sprite/Agent fights resolve as **Wired / EW** attacks (a physical strike that can target them at all is made with a **bane**, per `20`). Action economy follows hybrid band: **minor** = extension on the compiler’s turn; **intermediate** = own turn under a Command maneuver that round; **advanced** = independent turn. The Console does not auto-run those turns or auto-initiative constructs.

## Deck software: suites vs payloads

A cyberdeck has **mod slots** (Street Deck 2, up to 5 on an apex deck). Two kinds of deck software fill them, and they share the same slots. Neither is the Hacker's class Programs: those are Bandwidth abilities from class progression and take no slots.

| | Suites | Payloads |
|---|---|---|
| **Role** | Utility and defense | Offense and disruption |
| **Examples** | Reader, Sneak, Mirror, Scrubber, Overlord (utility); Skeleton (standing Breach edge); Guardian (defense) | Zap, Crash, Whiteout, Static, Ghostload, Blackout, Wraith |
| **In a slot** | One suite per slot, persistent | One **magazine** of a single payload kind per slot |
| **Loading** | Craft (Hacking) Project installs it | Craft (Hacking) Project compiles it; the tier sets its fires |
| **In play** | Switch on or off in the field; grants standing edges and benefits. Suites are never fired. | **Run** it as an action; each Run spends 1 fire |
| **Ends** | Stays until you uninstall it | At 0 fires the magazine is spent and the slot frees |

### Suites

A suite is installed into a free slot as a downtime **Craft (Hacking)** Project and stays there until you swap it out. An installed suite can be switched on or off in the field (the field toggle); it keeps its slot either way. Suites give edges to Matrix Verbs and standing benefits. They have no attack of their own.

### Payloads (magazines)

A payload chip in your gear does nothing by itself. To use it, you compile it into a free **host slot** as a magazine:

- **Cyberdeck.** One free deck slot, shared with suites.
- **Technomancer (no deck).** Compile onto **Wired Native** — Resonance / body-as-interface. The class feature is a 2-slot `resonance` / `body` host. Do not auto-grant any payload; compiling is still a Craft Project (Sabbat Vane’s playtest Whiteout×2 is a pregen loadout, not a class grant).

- **Craft (Hacking) Project.** In downtime, make a Project power roll with **Logic** (Reason). Having the Hacking skill gives an edge on this roll, as with other Wired rolls. The chip is the Project's target.
- **Tier sets fires.** The result sets how many fires the magazine holds (table below). A better roll means more fires in the same slot.
- **One kind, one slot.** A magazine holds one payload kind. Loading a second kind takes a second free slot.
- **Recompile.** You can recompile a loaded magazine as a new downtime Project. The new result **replaces** its fires.

| Project result | Fires loaded |
|---|---|
| Low (≤11) | 1 |
| Middle (12–16) | 3 |
| High (17+) | 5 |

**Running a payload.** You must be **Connected** (Overlay or Jacked In) to **Run** a payload — Disconnected **and Linked** refuse the Run; the magazine stays loaded and no fire is spent. Each payload is a Wired, ranged ability with a Power Roll using Logic (Reason), targeting within your Reach. The middle result delivers the payload's listed Effect; the low result is partial and the high result is the strong version. Trace Alert follows the defaults above unless the payload's Effect says otherwise. A Run spends 1 fire whatever it rolls. When a magazine reaches 0 fires it is spent: the slot frees, and you need a new Craft Project to load that payload again.

> **In Foundry**
> Load a payload chip onto a deck **or** a Technomancer’s Wired Native (Craft magazine) to spawn a **Run {payload}** ability on the sheet. **Run** only works while **Connected** (Overlay or Jacked In) — Disconnected and Linked refuse the use and spend no fire. Suites stay Activate/Deactivate via mod install, not Run.


The payload catalog (Effects, prices, Availability) is in the Gear master, Matrix Gear §4C; suites are §4B. Installing any deck software follows the Craft procedure in **Mods** (`10`).

**Whiteout** (locked 2026-09-19) is the Echelon 1 Restricted Trace-scrub payload. Compiling it is a **steep / hard** Craft (Hacking) Project. Its Run spends 1 fire and **overrides** the default Trace table: low leaves Trace unchanged; middle is Trace −1 (min 0); high is Trace −1 and cancels the next Trace increase before the end of your next turn (once). Foundry v1: the Director moves Trace on the Wired Console by hand. Technomancers compile Whiteout onto Wired Native rather than a deck; it is **not** a class grant.

## Director tools

At the table, track each hostile host’s Trace Alert (0–12), each Track 2 target’s Integrity, and which nodes the crew has revealed. Node Rating **1–5** fills the System Stat Card. Place the Wire Atlas at the right altitude (district Relays/Hosts, facility Segments, room Devices) — you do not invent extra Matrix subsystems or extra token types beyond this chapter.

Tables running Ghostwire in Foundry VTT can mirror those numbers in the Wired Console (connection roster: Linked / Overlay / Jacked In / Disconnected, **Constructs** roster for sprites and Agents, node templates Rating 1–5, Integrity, Trace Alert, reveal, **Wire ping/spoof**). Constructs never add edges to the node graph. The rules are the ones in this chapter; Console operation lives in the module’s Foundry notes, not here.

## VOIDMARK (Wired presence)

Some hosts answer with a voice that is not MER support and not ICE. Street callsign **VOIDMARK** (the Mark): a leash-slipped intelligence that treats the Wired as territory. Full lore: the **VOIDMARK** chapter (L4).

> **In Foundry**
> Open **VOIDMARK** from Token controls (ghost) or a keybinding under Configure Controls. Module Configuration holds the API endpoint, secret key, model, temperature, player access, and **Edit VOIDMARK instructions**. Rules answers are retrieved from the shipped Ghostwire RAW index. Canvas token art when the Mark takes scene presence is a later hook (`assets/ai-persona/`).

## North Substation — a worked Wired run

This is one run, start to finish, against a Rating 3 host: what the players say, what they roll, what the Director answers, and what the numbers do. **Nothing here is a new rule.** Every beat points back at something already printed in this chapter, in **The Hacker** (`19`), or in **The Technomancer** (`20`). Read it once and the chapter's whole order of operations is in your hands.

**The crew.** **Vira**, a Hacker: Logic 3, a **street deck** (Biofeedback Resistance **2**), Bandwidth **6**. **Kade**, an Operator, all meat — no interface, no deck, and no business on the wire except as the body standing over Vira's.

**The host.** *Power Co — North Substation.* Node Rating **3**, **Track 2**. Breach difficulty **medium**. ICE: **passive + 1 active**. Integrity **26**. Biofeedback Value **8**. Trace Alert starts at **0**.

**The room (Track 1).** Three objects hang off the host: **Maglock Door 1**, **Light Control**, and a **Turret feed**. They are Track 1 — Rating, description, breach difficulty, Alert contribution, and no Integrity pool of their own.

### Act 0 — getting on the wire

Vira uses **Connect**. She has a deck, so it lands, and it lands in **Linked** — not Overlay. Linked is comms, ID and packets and nothing more. She **Broadcasts** to Kade from there, because Broadcast is the one verb that works at Linked: *"I'm on. Give me the corner."* She has not Scanned anything and cannot: Scan needs Overlay or Jacked In.

She uses **Toggle Connection State** — one rung deeper — and she is **Overlaid**. Her meat rolls now carry a bane. Her Wired rolls get nothing either way. Her Biofeedback exposure is **×0.5, round down, minimum 1**.

The Director puts the **System Stat Card** on the table: Rating 3, Track 2, breach medium, passive + 1 active ICE, Integrity 26, Biofeedback 8, Alert 0. Nothing is hidden about the *shape* of the host. What is inside it still has to be found.

### Act 1 — finding out what is there

**Scan** (Instinct). Middle. Vira learns there is a host here and that something on Track 2 is awake inside it. No Alert — Scan only looks.

**Deep Scan** (the Hacker's own Program, Logic). Middle. Now the room has names: **Maglock Door 1**, **Light Control**, **Turret feed**, and a **Watchdog** on Track 2. This is the step everything downstream needs. Seize Control wants a named asset; a purpose-built Agent wants a job worth naming.

**Ping** (Logic). She pings **Light Control**, a Track 1 object, and the lights stutter in the corridor Kade is watching. That is all a Ping ever does: touch and test. She does **not** try to Ping the host itself — Ping is Track 1 only and never defeats ICE.

**Search** (Logic). Middle. Inside the host she finds the maintenance schedule, and the fact that the turret feed answers to the substation rather than to corp security. Useful, and quiet.

### Act 2 — the first bite

**Read/Write** on **Maglock Door 1** (Logic). Middle: the door unlocks for entry and leaves **zero forensic trace**. Kade walks through.

Then Vira reaches for the turret. She rolls **Seize Control** against the host — and rolls **low (≤11)**.

Two things happen, in this order, and neither of them is a surprise:

1. **Trace Alert +1.** Low is the default Alert trigger. The host is now at **1**.
2. **One reactive Biofeedback bite** — trigger 1: a low Wired Power Roll against a host with **active ICE** (Rating 3+). The active ICE that Deep Scan named gets exactly one hit.

The math, out loud: base **8** (Rating 3) → Vira is **Overlaid**, so **8 × 0.5 = 4** → minus her street deck's Biofeedback Resistance **2** → **2 Stamina damage**. Vira takes 2 and keeps her turn.

Note what did *not* happen. The ICE did not then take a turn of its own, and it does not get one next round either. It bit once, on a trigger, and went back to being a defence.

### Act 3 — compiling a Special Agent

Vira wants the turret handled. She uses **Compile Agent** and takes the last entry in the list: **Special Agent** (3 Bandwidth in combat). The order matters, and it is not the order most tables expect:

1. **She rolls first.** 2d10 + Logic — middle tier.
2. **The tier buys the action budget.** Middle is **2 Actions**.
3. **Only then** does she say what it is for.

She says: *"spoof the turret lock so it reads the corridor as clear."* That is a **Wire** job, against an asset Deep Scan named, and it is the only kind of job a Special Agent can be given. The Agent manifests with `Actions (2): spoof the turret lock so it reads the corridor as clear` written at the top of its own description.

**What she cannot ask for.** *"Pull Kade out of the corridor."* *"Carry the case."* *"Stand in the doorway and block it."* Agents and sprites are **Wire-only**. They act on nodes, systems, ICE, feeds and data. They do not pick things up, they do not drag bodies, and their scene token is a roster anchor rather than a second fighter on the meat board (see **Constructs (Sprites and Agents)**, above). A Director who lets one lift a downed runner has quietly handed the Hacker a free extra body in every fight.

### Act 4 — Integrity, Malice, and going deeper

Vira runs a Program at the host's **Integrity** and lands it: Integrity **26 → 21**, her deck's Integrity Damage Bonus on top of the roll. Over the next few exchanges the Alert climbs on her low results and the host crosses **step 5** — the Director banks **+1 Malice**. That Malice is real money, and it buys something later.

Vira decides she needs the edge and **Toggles** again: **Jacked In**. Her Wired rolls now carry an **edge**, she cannot act in the physical world at all, and her body is on the floor with Kade standing over it. Her Biofeedback exposure just went from ×0.5 to **×1.5**.

The Director spends that Malice on an **ICE surge** — trigger 4. Same four steps, new connection state: base **8** → Jacked In **8 × 1.5 = 12** → minus **2** → **10 Stamina damage**. Ten, from the host that dealt her two a minute ago. That is what the edge costs.

### Act 5 — the hunt, and the floor

The Alert track reaches **9**, and trigger 3 goes live: **at the end of each of Vira's turns, while she is still Overlay or Jacked In on this host, the hunting ICE bites once.** Not on the Director's turn. Not twice. Not on Kade. On Vira, at the end of her turn, once per turn, for as long as she stays immersed.

She stays two more turns, because the job is nearly done. Two more bites. Her Stamina runs out on the second one — and this is the beat the whole procedure exists for: **Biofeedback that would take her to 0 leaves her Winded, not Dying.** She stops at **1 Stamina**, she regains 1 per turn until stabilized, and the wire cannot finish her.

What *can* finish her is the corridor. If corp security rounds the corner and puts a round into her inert body, that damage is not Biofeedback, it is not floored, and she goes down for real. The floor is a promise about the wire. It is not a promise about the room.

Had the Alert reached **12** instead, the host would have gone to **full lockout** with a **hard counter-trace to Vira's physical location**, then reset to step **6** rather than 0. That is the Director's other lever, and it ends the Wired half of the fight by moving it into the street.

### Act 6 — out

While the Special Agent was up, another compiler **Overlay or Jacked In on this same scene** would have seen it in their own **Constructs** roster with no Scan spent — that is Lock A. Kade, standing in the corridor in his own body, sees nothing: meat tokens are not Wire eyes.

Vira uses **Decompile Agent** on the Special Agent — a free maneuver, no Bandwidth back, token and world Actor gone. Then she **Jacks Out**: the one off-ramp to Disconnected, and usable as a Free Triggered Action in a genuine emergency. She is off-net, and nothing on the wire can reach her Stamina now.

**The Alert does not leave with her.** North Substation is still sitting at 11. It will still be sitting at 11 the next time anyone in the crew touches it, tonight or next week. A maxed host never fully forgets you found it, and a hunting one does not forget either.

### Technomancer appendix — the same run, the other side of the wire

Run the same hour with a Technomancer instead, and three things change.

- **They can compile from Linked.** Sprites are Resonance, not software, so a Technomancer sitting at **Linked** — no meat bane, and **no Biofeedback exposure at all** — can still put a sprite on the board. A Hacker cannot: Compile Agent refuses below Overlay.
- **Special Sprite runs the same order** as Special Agent: roll, the tier buys 1 / 2 / 3 Actions, then the purpose. And it carries the same guardrail — **Wire-only**. A Special Sprite spoofs a turret lock. It does not pull a downed runner out of a corridor.
- **Overreach is their own Biofeedback.** Spend **5 or more Resonance** on a single ability and make a **Physique test** by cost band (`20`). Fail it and the damage is theirs — nothing to do with the host's Rating, nothing to do with ICE. But it lands on the **same Winded floor**: it would take them to 0, so they stop at **1 Stamina** and regain 1 per turn. One floor, two sources, and a Technomancer who pushes too hard is standing exactly where Vira was.

> **In Foundry**
> Every beat above has a control. The Wired Console's node templates expose Rating 1–5 with **Integrity**, **Biofeedback Value**, **ICE layers** and **Trace Alert** on the card. The node applet's verbs refuse by state: **Connect** lands in Linked, **Broadcast** works there, and **Scan / Ping / Navigate / Search / Read-Write / Programs / payload Runs / Compile Agent** all refuse until Overlay or Jacked In. **Deep Scan**, **Seize Control**, **Compile Agent / Special Agent** and **Decompile Agent** run from the Hacker's own ability cards. The **Constructs** pane lists the Special Agent with its `Actions (2): …` budget. And the Director macro **Director: Apply Biofeedback** does the arithmetic this chapter prints — the 2 in Act 2 and the 10 in Act 4 are the numbers it produces, Winded floor in Act 5 included.
>
> Director cue sheet and the full Foundry alignment note: `docs/directors/north-substation-masterwork.md`.

