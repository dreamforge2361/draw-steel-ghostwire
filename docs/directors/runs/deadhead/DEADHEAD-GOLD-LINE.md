# Deadhead on the Gold Line

**Ghostwire playtest run · ~4 hours · Director journal SoR**  
**Status:** Design-locked 2026-09-19 · Gold Line plates shipped **0.3.36** (CyberMaps Hammerhead stitch; no generated train)  
**Foundry home:** Compendium **Ghostwire Runs** → folder **Deadhead**; world Scene inject **Scenes → Deadhead → Gold Line**

Keep all Deadhead pages, items, and scenes referenced from this pack folder when shipped.

---

## Logline

Mama Cassavir pays the crew to lift a **live ARG transaction wafer** (ghost ledger mirror) from a sealed courier capsule on the **Gold Line** maglev (Spire depot → Switchboard terminus). Board mid-canyon on a borrowed **garbage-truck-sized** trash freighter, crack the capsule on the Wire, bail by the same drone **before** ARG response hits the forced stop — then choose who gets the prize.

---

## Pay (crew pool)

| End choice | Pay | Fallout |
|---|---|---|
| Deliver to **Mama** | **¥8,000** | Clean contract; low heat if Trace stayed quiet |
| **Corp sell** (ARG reclaim or rival flip) | **¥14,000** | Mama pissed; ARG/SAN heat |
| **Signal / Hands Off** contact | **¥2,000 + weird** (Trace scrub, Soft favor, or SIN forget) | Political heat; MER/Signal notice; Mama cool |

Half base only if the prize was wiped/lost — not for picking Signal.

**Discovery = intel only** (no cash bonuses). Better plan → better odds.

---

## Hard rules (prize / stop)

1. If the train **stops while the live wafer is still inside its carry capsule**, the wafer is **wiped and fragged** (prize destroyed).
2. **After** the wafer is removed from the capsule, the train **will** stop (Trace → forced stop). That post-extract stop is **expected**.
3. Once the wafer is in hand, the crew must be **off the train and clear** before ARG rapid response hits the consist.
4. No intentional early emergency stop while the prize is still nested.

---

## Trace Alert (Deadhead host) — 1 through 12

**Track:** one Trace Alert on the Gold Line train host (Wired Console), steps **0–12**.

**Cap (Deadhead lock):** Trace never rises more than **+1 per round**, no matter how many triggers fire that round. Stack triggers → still only +1; narrate the rest as fiction.

**Bands (Console):** quiet (0) · stir (1–4) · malice (5–8) · hunting (9–11) · lockout (12).

### What can raise Trace (+1 max that round)

- Low (≤11) result on a Wired Power Roll against the train host / its nodes
- Ability text that says Trace increases (e.g. Crash always +1 — still subject to the per-round cap)
- Watchdog ICE / failed capsule breach fallout
- Wafer **outside** its case: every **2 rounds** → +1 Trace (this tick counts as the round’s +1 if nothing else already raised it)
- Loud meat actions the Director ties to the host (optional; prefer Wire triggers)
- Failed ICE **call-home block** does **not** auto +1 Trace (it causes off-train scream / early ARG attention instead)

### What does **not** raise Trace

- Passive Scan / Deep Scan / observation alone
- High (17+) clean Wired results (unless an ability says otherwise)
- Ghost Signal “unlisted” scrub (doesn’t lower the number; cleans listing/logs)

### Step-by-step ladder

| Step | Band | What happens / Director notes |
|---:|---|---|
| **0** | Quiet | Fresh host. Cams idle. |
| **1** | Stir | Flavor: a cam hesitates; HUD tick. No mechanical bite yet. |
| **2** | Stir | Flavor: maglock LED flickers. |
| **3** | Stir | Flavor: passenger PA glitches half a syllable. |
| **4** | Stir | Flavor: Watchdog stirs in the capsule stack — still sleeping. |
| **5** | Malice | Heat feeds the table: + Malice (or free ARG “pressure” beat). Meat Alert may wake. |
| **6** | Malice | Telegraph: ICE spooling tools. Good moment to say monitors should stay on the host. |
| **7** | Malice | **ICE call-home window opens** (see below). |
| **8** | Malice | Call-home fires if not already resolved at 7. Malice pressure continues. |
| **9** | Hunting | Auto-stop risk rises. Bane on the Wire runner’s next Wired roll (per general Trace rules). |
| **10** | Hunting | Host hunting hard; Director may advance Lt / lock doors. |
| **11** | Hunting | One step from lockout; wafer-out clock is screaming if case is open. |
| **12** | Lockout | **Forced emergency stop** + hard counter-trace fiction. If wafer still **in capsule** → **wipe/frag**. If wafer already **out** → stop is expected; ARG response inbound — crew must already be gone. Console: resolve, then reset track to **6** (host remembers). |

```
Trace  0 ──1──2──3──4──│──5──6──7──8──│──9──10──11──│──12
       quiet / stir    │   malice     │   hunting   │ lockout
                       │         ★ call-home ~7–8
                       │              │         forced stop
```

### ICE call-home (~7–8)

Onboard ICE tries to send an **off-train** “something’s amiss” packet.

- If a **Hacker or Technomancer** is monitoring: **Detect**, then **Block**.
- **Block success:** packet dies; **Trace −1**.
- **Fail / nobody monitoring:** message leaves → early ARG attention on the post-stop clock (optional meat Alert +1).
- Until Wired Console **Wire ping/spoof** ships: narrate or chat the telegraph at Trace 6–7.

---

## Cast & kit

- **Patron:** Mama Cassavir (Mama’s Club brief / return)
- **Owning corp / uniforms:** **ARG Argent Exchange** (reusable ARG Security + Lieutenant look)
- **Drone contact:** **Nox** (Flats wrangler) — crew **borrows** garbage-truck-sized trash freighter; scratch it = buy it; lose it = explain to Mama
- **Opposition:** Passenger — cams + 2 Corp Enforcers; Security — 4 Corp Security + 1 Response Lieutenant; Courier sealed until Alert
- **Wire:** Track 1 cams/doors **R2** (Wire transfer); Track 2 capsule lock **R1** + Watchdog ICE
- **Twist:** none for v1 (clean heist)

### Consist (Director truth)

5 cars, **20 ft** wide, **5 ft** furniture: **cab · courier (capsule) · security · passenger · tail**. Capsule is behind cab — crew usually boards aft and works **upstream**. **Players learn the exact car only on a great success in discovery**; otherwise they **search**.

**Foundry plate (0.3.36):** dual CyberMaps Hammerhead stitch, nose-to-tail (nose right). Design truth stays 5 cars; the play surface is **2 × 3 chambers**. See beat remap below.

### Beat remap — dual Hammerhead plate

Left → right = aft → forward (nose right). Crew boards **aft** and works **upstream** (rightward).

| Plate zone (L→R) | Hammerhead part | Deadhead beat |
|---|---|---|
| **L1** | Left aft cargo | **TAIL** — board here (drone sling) |
| **L2** | Left connector | **PASSENGER** — civilian clutter / Enforcers |
| **L3** | Left forward + cab | **SECURITY** — treat mid cab as sealed ARG booth / Lt nest; play the cargo bay |
| *(coupler)* | Synthetic join | Non-walkable or Maglock gangway (Director call) |
| **R1** | Right aft cargo | **COURIER** — sealed capsule stacks |
| **R2** | Right connector | Transfer / Wire closet (cams/doors node) |
| **R3** | Right forward + cab | **CAB** — drive end; Trace host fiction |

If you need a clean sixth room, split R2 as its own Wire chase between courier and cab. Mid-consist double-cab (L3) is the Hammerhead artifact — narrate sealed engineering rather than a second drive cab.

**Shipped assets** (`assets/maps/battlemaps/gold-line/`):

| Role | Tile (working setup) | Prefer | Fallback |
|---|---|---|---|
| Interior (motion) | flag `goldLineInterior`, x=0 y=0, elev 0, sort 0 | `map-gold-line-interior-loop.mp4` | webm, then still |
| Roofs (motion) | flag `goldLineRoofs`, x=3232 y=475, elev 1, sort 100 | `map-gold-line-roofs-loop.mp4` | webm, then still |

`resolveSrc` order is **loop.mp4 → loop.webm → still.webp**. H.264 MP4s carry a real duration (shipped VP9 webms report `duration=N/A` and Foundry throws `Failed to set currentTime ... non-finite`). Stills are a **valid playable layout** if a loop is missing. Do not swap in a generated train.

**Do not use Level background video** — it is broken on this stack. The Level background src stays **empty**. Both plates are **Tiles**.

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`. Scene: **6472 × 958**, grid **208** (5 ft), ~31 × 5 squares.

**Interior tile** (**Tiles** layer, name **Interior (motion)**): **x=0, y=0, width=6472, height=958, elevation=0, sort=0**, MP4 loop + autoplay.

**Roofs tile** (**Tiles** layer, name **Roofs (motion)**), Michael 2026-09-20 (await `GOLD_LINE_LOCKED` if numbers change): **x=3232, y=475, width=6472, height=958, elevation=1, sort=100, locked**. Occlusion is **NONE** (mode 0, alpha 1) — roofs stay **solid**.

Roof x/y are **not 0,0**: a Foundry Tile’s x/y is its **registration point** (center), so a full-plate roof sits near (width/2, height/2) ≈ (3236, 479). Michael nudged that to **3232, 475**. The interior tile stays at the scene origin (0, 0).

**Director — hide roofs:** when the crew boards / goes **inside**, hide **Roofs (motion)** (Tiles layer → eye / right-click Hide). Unhide for the roof Recall bail. Do not rely on FADE or Surface — occlusion stays off.

World inject: `scripts/gold-line-scene.mjs` → **Scenes → Deadhead → Gold Line**. If tiles drift, as GM run `await game.ghostwire.ensureGoldLineScene({ force: true })` then re-activate.

---

## Mama’s Deadhead Brief (mission wafer) — Item

**Name:** Mama’s Deadhead Brief (Gold Line)  
**Type:** Data wafer / gear (portable)  
**¥:** Negligible as loot (~¥50); worthless to fence (Mama-marked)

**On the wafer (baseline):** job, pay, wipe-if-stop-while-nested, ARG, Nox borrow, 5-car Gold Line without naming the capsule car, vague meat/Wire/clock, bail = same bird, return for choice.

**Not on the wafer:** exact car; R1 Watchdog / R2 cams numbers; +1 Trace / 2 rounds wafer-out; full faction doors (corp/Signal) until discovery D.

---

## Discovery (Beat 0)

Start from Mama’s wafer at the **crew hangout**, then chase:

| Code | Intel |
|---|---|
| A | Roster & Alert triggers (Enforcers / Security / Lt) |
| B | Capsule Faraday + Track 2 **R1** Watchdog; Track 1 cams/doors **R2** |
| C | Full Trace ladder + wafer-out tick + wipe/stop rules |
| D | Faction doors (Mama / corp sell / Signal) as real choices |
| ★ | **Great success:** exact **car** with the capsule |

Methods: Mama back-room, Wire recon (Overlay on a schedule mirror — not the live train yet), canyon watch, bribe/badge. Fail = go in blind, not blocked.

---

## 4h Director clock

| Block | Time | Beat |
|---|---|---|
| 0 | 45–60m | Hangout + Mama wafer + discovery + call Nox |
| 1 | 30–40m | Canyon drone sling board (garbage-truck freighter) |
| 2 | 40–50m | Passenger → security crawl / search |
| 3 | 30–40m | Wire + capsule crack; call-home if Trace ~7–8 |
| 4 | 25–35m | Wafer-out clock + roof Recall bail |
| 5 | 20–30m | Return + moral choice |

### Beat rule callouts (short)

**1 Board:** Deploy/Recall; Agility/Might board rolls; mixed = Alert +1; Jacked In can’t make physical board rolls.  
**2 Crawl:** Stealth vs violence; cams; ARG firearms; don’t emergency-stop while nested. Search if no ★ car intel.  
**3 Wire:** Overlay/Jacked In; Console nodes; Watchdog; open case starts post-extract clock; wipe if stop while nested.  
**4 Bail:** +1 Trace / 2 rounds out of case (respect +1/round cap); Recall freighter; be gone before stop + response.  
**5 Choice:** Mama / corp / Signal; Nox drone condition as fiction string.

---

## Foundry build list (pack together under Ghostwire Runs / Deadhead)

- [ ] Journal: this run (pages: Overview, Trace ladder, Beats 0–5, Items, Opposition)
- [x] Journal: Gold Line — Map Notes (plate paths + beat remap) in **Ghostwire Runs → Deadhead**
- [ ] Item: Mama’s Deadhead Brief wafer
- [ ] Item: ARG courier capsule / live wafer (plothook notes for three buyers)
- [ ] Scene: crew hangout (rundown flat, wrecked bad neighborhood)
- [ ] Scene: Mama’s Club (reuse)
- [ ] Scene: canyon approach / drone sling strip
- [x] Scene: Gold Line dual-Hammerhead (world inject; interior loop + roofs overhead)
- [ ] Splash art: garbage-truck freighter + 4 runners over moving train
- [ ] Tokens: ARG Corp Security, Response Lieutenant (+ Enforcers); freight drone token
- [ ] Wired Console board preset on train Scene (nodes + Trace)
- [ ] Backlog: Console **Wire ping/spoof** for call-home telegraph

Art locks: flat top-down maps; no people on maps; no baked grid; ARG uniform stylization reusable.

---

## L1 Trace tools note (playtest)

**Kessic brings Whiteout×2** (compiled magazine, 2 fires on Switchblade / Street Deck) — that is the L1 Trace −1 payload. Technomancer does not get Whiteout by default (no deck). Deadhead’s ICE call-home block is the scenario Trace −1 if nobody runs Whiteout. Ghost Step (cancel an increase) is later-level.
