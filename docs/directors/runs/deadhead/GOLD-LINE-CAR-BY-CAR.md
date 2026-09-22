# Gold Line — Car-by-Car (Director sidecar)

**Status:** Director-only sidecar · aligned to [`DEADHEAD-SESSION-CHAPTERS.md`](./DEADHEAD-SESSION-CHAPTERS.md) locks 2026-09-21 · ships as the **Gold Line — Car-by-Car** page (GM-only) on the **Deadhead — Session Chapters** Journal (**0.3.87**)  
**Locks to:** [`DEADHEAD-GOLD-LINE.md`](./DEADHEAD-GOLD-LINE.md) (Trace ladder, wipe, pay) · [`GOLD-LINE-CARGO-REMAP.md`](./GOLD-LINE-CARGO-REMAP.md) (cargo lock, zone map)  
**Plate:** dual CyberMaps Hammerhead stitch (`gold-line-freight-dual.png`). This single plate is the full train map (nose right; board aft L1).

## Chamber cards

Chamber cards for the Gold Line Foundry Scene. READ ALOUD boxes live in the Session Chapters Gold Line Beats; this page holds exploitables, Wire cards, drone dealing, and seats. Never read it to the table.

**Orientation (L→R = aft → nose):** **L1 aft freight** → **L2 passage** (drone) → **mid console booth** → **black-container aisle** → **second-to-last courier** (wafer) → **R3 front cab**. Six zones — do not invent a seventh car. Hammerhead bookkeeping: mid booth = L3, black-container aisle = R1, second-to-last = R2.

**Opposition LOCK — 5 security + 1 worker drone:** 2 ARG Corporate Enforcers (L1) · 1 worker drone, Integrity 24 (L2) · 1 ARG Security Officer (mid booth) · 1 ARG guard = second ARG Security Officer token (second-to-last) · 1 ARG Response Lieutenant (R3). Black-container aisle = 0 native meat.

**Wire defaults (every chamber):** Maglock Track 1 Rating 2–3 · Lights Track 1 Rating 1–2 · Cams Track 1 Rating 2–3 (most chambers). Chamber exceptions are listed on each card.

### Entry — roofs to L1

| Path | Breach | Rating | Feel |
|---|---|---|---|
| **A — Twin roof hatches** | Wire Read/Write on the Track 1 maglock, or Physique / Electronics on the ring | **~3** (Medium) | **Harder.** Force is loud — counts toward mixed board even after a clean land |
| **B — Rear access door (L1 aft)** | Same menu, deck height | **~2** (Easy with bane) | **Easier.** Cleaner node; high keeps the canyon believing nothing happened |

Low against the live host may raise Alert +1 / Trace (respect the +1/round cap). Mixed board still means Alert +1. Jacked In bodies cannot make physical board rolls.

### L1 — Aft freight

**Exploitables**
- **Cover:** dark green crate stacks along both walls; crawl gaps between stacks break line of sight.
- **Choke:** aft hatch rings / rear door (board and bail); forward door into L2 behind a white maglock.
- **Cams:** idle-to-curious eyes on the aft band — loop them before the Enforcers turn around.
- **Noise:** crate scrape, maglock thunk, canyon weather through hull seams.

**Wire:** defaults. Aft door maglock is the Path B node (~2); roof rings are Path A (~3).

**Seat:** **2 ARG Corporate Enforcers.** Stealth wants looped cams, killed lights, and soft feet. Violence wakes the band and telegraphs upstream.

### L2 — Freight passage

**Exploitables**
- **Cover:** ridged containers hug the walls; one clear center lane.
- **Choke:** the lane itself — the drone owns it.
- **Locks:** white maglock icons on both doors.

**Wire:** defaults, plus the drone's leash as a thin machine node (Scan it on Overlay).

**Seat:** **1 worker drone (Medium)** — Integrity/Stamina **24** (`machine-drone-medium`). Exploit and heat, not a free kill-switch for the wafer.

| Deal with the drone | How | Cost |
|---|---|---|
| **Notice** | Overlay Scan, or Instinct Perception | None — learn its patrol and leash |
| **Spoof** | Wired roll vs the leash node | Low = soft Trace / Alert |
| **Street Eye / Rigging** | Only if a Wrench is present | Borrow its eyes or park it |
| **Destroy** | Meat damage through Integrity 24 | Noise → Alert |
| **Leave it alone** | Slip past on patrol timing | It keeps telegraphing movement upstream |

Cross-point `docs/raw/23-machines.md` for machine rules.

### Mid console booth

**Exploitables**
- **Console:** bright blue terminal — local roster ghosts and door overrides (meat-side or Track 1). **Not** the Trace host.
- **Cover:** swivel chair and an unused lounge set — soft cover only.
- **Choke:** maglocked doors aft and forward.

**Wire:** defaults plus local Track 1 overrides for adjacent doors and cams.

**Seat:** **1 ARG Security Officer.** Narrate a sealed ARG booth — the mid-consist cab geometry is a Hammerhead artifact, not a second drive cab. Crossing loud here is how freights become memorials.

### Black-container aisle

**Exploitables**
- **Cover:** dark grey / black rectangular containers flank a center aisle — hard cover, almost no soft furniture.
- **Choke:** maglock doors aft and forward.

**Wire:** defaults (door maglocks, lights, cams). No native host taste.

**Seat:** **0** native meat. Spill only on Alert. Keep it a crawl beat.

### Second-to-last — Courier (wafer)

**Exploitables**
- **Sealed courier capsule:** Faraday carry, nested among green crates, immediately aft of the nose. The live wafer stays inside until the Wire crack.
- **Cover:** green-crate stacks on both walls; clear center lane; plant-and-jack pockets between stacks.
- **Noise:** cage maglocks, ICE spool telegraph, crate scrape if meat forces the cage.

**Wire:** defaults, plus the **capsule lock on Track 2** with **Watchdog ICE** — Rating **~3**, Integrity **26**.

**Seat:** **1 ARG guard** (a second ARG Security Officer token) with the capsule. Name this chamber only if discovery ★ landed; otherwise they searched into it the hard way.

Wafer leaves the nest → wipe clock and forced-stop path start (SoR). Job Stick ≠ wafer.

### R3 — Front cab

**Exploitables**
- **Trace host console:** the train brain — Trace Alert 0–12 lives here (Track 2).
- **Drive controls:** emergency-stop fiction. Hard rule: never stop while the wafer is nested.
- **Cover:** terminal chair and a thin lounge — little cover in a hard room.

**Wire:** Trace host (Track 2). Call-home fires from here around Trace 7–8; someone Overlay or Jacked In should be watching.

**Seat:** **1 ARG Response Lieutenant** — ready to respond; advances when Trace hits **Hunting** (9+).

### Cross-chamber index

| Zone | Wire | Meat |
|---|---|---|
| L1 aft freight | Track 1 defaults; entry nodes (A ~3 / B ~2) | 2 Enforcers + cams |
| L2 passage | Track 1 defaults; drone leash | 1 worker drone (24) |
| Mid console booth | Local Track 1 overrides (not the host) | 1 Security Officer |
| Black-container aisle | Track 1 defaults | 0 (spill on Alert) |
| Second-to-last courier | Track 2 capsule + Watchdog (~3, Integrity 26) | 1 guard (Officer token) |
| R3 front cab | Trace host (Track 2) | 1 Response Lieutenant |

Walls, lights, and tiles on the Gold Line Scene are Michael's live dress. This sidecar never restamps the Scene.
