# Director Reference — Wired Node Templates (10)

**Status:** B32 Phase 5 — Foundry-verified 2026-09-17  
**Rules:** `docs/rulebook/08-hacker.md` (Wired System, System Stat Card, Trace Alert)  
**Code:** `scripts/wired-node-templates.mjs` — `RATING` (System Stat Card) and `NODE_TEMPLATES`; the Wired Console imports the same `RATING`, so this table and the Console can’t drift.

## Using a template in Foundry

1. Open the **Wired Console** as Director (Token controls → network icon, or your keybinding) on the Scene where the run happens.
2. In the **Nodes** panel header, click **Add template…** (layers icon).
3. Pick a Track 1 or Track 2 template. It is added **hidden**, selected, with its Rating, Integrity (Track 2), Description, and Notes filled in.
4. Rename it, edit the Description (player-facing; shared to chat on reveal) and Notes (Director-only), then **Reveal to players** when they find it.

Changing a node’s Rating in the detail panel re-reads the System Stat Card, exactly like a hand-built node. Add Node, Random Node, and Generate Cluster are unchanged.

## Track rules (from 08-hacker.md)

- **Track 1** — objects and systems (doors, cameras, locks, a person’s smartlink): Node Rating, Description, Breach DC, and Alert only. One power roll breaches and acts on it; **no Integrity pool, no ICE, no biofeedback.** The Console shows no Integrity bar for Track 1.
- **Track 2** — defended nodes, ICE, hostile AI Personas, rival deckers: the full card. Integrity is whittled down by Programs; biofeedback is scaled by the runner’s connection state (×0.5 round down, min 1, Overlaid · ×1.5 round up Jacked In) and then reduced by the deck’s Biofeedback Resistance.

## System Stat Card (RATING)

| Rating | Breach DC | Integrity (T2) | Biofeedback (T2) | ICE (T2) |
|---|---|---|---|---|
| R1 | 10 | 12 | 3 | 1 passive layer |
| R2 | 12 | 18 | 5 | 2 passive layers |
| R3 | 15 | 26 | 8 | Passive + 1 active ICE |
| R4 | 17 | 36 | 13 | Passive + 2 active ICE; biofeedback on a failed breach |
| R5 | 19 | 50 | 22 | Full active ICE suite; automatic counter-trace on any high (17+) roll against it |

## The ten templates

| ID | Name | Track | Rating | Breach DC | Integrity | Biofeedback | ICE |
|---|---|---|---|---|---|---|---|
| `node-t1-r1` | Track 1 Node · Rating 1 | 1 | 1 | 10 | — | — | — |
| `node-t1-r2` | Track 1 Node · Rating 2 | 1 | 2 | 12 | — | — | — |
| `node-t1-r3` | Track 1 Node · Rating 3 | 1 | 3 | 15 | — | — | — |
| `node-t1-r4` | Track 1 Node · Rating 4 | 1 | 4 | 17 | — | — | — |
| `node-t1-r5` | Track 1 Node · Rating 5 | 1 | 5 | 19 | — | — | — |
| `node-t2-r1` | Track 2 Node · Rating 1 | 2 | 1 | 10 | 12 | 3 | 1 passive layer |
| `node-t2-r2` | Track 2 Node · Rating 2 | 2 | 2 | 12 | 18 | 5 | 2 passive layers |
| `node-t2-r3` | Track 2 Node · Rating 3 | 2 | 3 | 15 | 26 | 8 | Passive + 1 active ICE |
| `node-t2-r4` | Track 2 Node · Rating 4 | 2 | 4 | 17 | 36 | 13 | Passive + 2 active ICE; biofeedback on a failed breach |
| `node-t2-r5` | Track 2 Node · Rating 5 | 2 | 5 | 19 | 50 | 22 | Full active ICE suite; automatic counter-trace on any high (17+) roll against it |

### Template text

**Track 1 Node · Rating 1** (`node-t1-r1`)  
*Description:* A street-grade system: a cheap maglock, a lobby camera, a vending kiosk. Its security is a factory default nobody changed.  
*Notes:* Breach DC 10. One power roll breaches and acts on it in the same activation; a low (≤11) result raises Trace Alert as usual.

**Track 1 Node · Rating 2** (`node-t1-r2`)  
*Description:* A professional-grade system: a keycard door, a parking-garage camera loop, a building’s lighting grid. Patched, logged, and mostly ignored.  
*Notes:* Breach DC 12. Single power roll, no Integrity pool. Logged access means a low (≤11) result is noticed sooner.

**Track 1 Node · Rating 3** (`node-t1-r3`)  
*Description:* A restricted system: a secure-floor door, a corp elevator bank, a monitored camera net. Access attempts leave audit trails.  
*Notes:* Breach DC 15. Single power roll. A good anchor for a heist beat: the door is Track 1, but the host watching it may be a Track 2 node.

**Track 1 Node · Rating 4** (`node-t1-r4`)  
*Description:* A military-grade system: a vault door, perimeter turrets on safe mode, a blast-shutter network. Hardened and watched in real time.  
*Notes:* Breach DC 17. Single power roll, but treat every low (≤11) result as loud. Pair with a Rating 3–4 Track 2 host if it should fight back.

**Track 1 Node · Rating 5** (`node-t1-r5`)  
*Description:* An alpha-corp system: a core vault, an arcology lockdown grid, a sealed data-archive door. Nothing about it is off the shelf.  
*Notes:* Breach DC 19. Single power roll. There is no ICE on the object itself; if the table needs a fight, the Rating 5 Track 2 host behind it provides one.

**Track 2 Node · Rating 1** (`node-t2-r1`)  
*Description:* A street-grade host: a bodega’s back-office server or a gang’s repeater, wrapped in one thin, passive firewall.  
*Notes:* One passive ICE layer. Integrity 12; biofeedback 3 if something bites back. A soft target for a first Program.

**Track 2 Node · Rating 2** (`node-t2-r2`)  
*Description:* A professional host: a clinic records server or a small business network, sitting behind two passive layers.  
*Notes:* Two passive ICE layers. Integrity 18; biofeedback 5. Nothing actively hunts yet, but the logs are reviewed.

**Track 2 Node · Rating 3** (`node-t2-r3`)  
*Description:* A corp departmental host with one active ICE construct patrolling behind its passive barrier.  
*Notes:* Passive layer + 1 active ICE. Integrity 26; biofeedback 8 (12 Jacked In). The worked example host from 08-hacker.md.

**Track 2 Node · Rating 4** (`node-t2-r4`)  
*Description:* A secure corp host: layered passive barriers and two active ICE constructs that respond to intrusion within moments.  
*Notes:* Passive + 2 active ICE; biofeedback on a failed breach. Integrity 36; biofeedback 13. Failed breaches hurt the runner, not just the Alert track.

**Track 2 Node · Rating 5** (`node-t2-r5`)  
*Description:* An alpha-corp core: a full active ICE suite that answers any serious intrusion with a counter-trace.  
*Notes:* Full active ICE suite; automatic counter-trace on any high (17+) roll against it. Integrity 50; biofeedback 22 (33 Jacked In). Plan the exit before the entry.

## Not in this phase

- Placeable node Actor tokens (`src/packs/summons/nodes/` stays an empty folder; deferred).
- A Foundry Journal pack for Director references (the module has no journals pack yet; this markdown is the reference).
- B23c Wired vision tints (next).
