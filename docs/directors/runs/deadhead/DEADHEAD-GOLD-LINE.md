# Deadhead on the Gold Line

> **Session chapters (playtest table pack):** [`DEADHEAD-SESSION-CHAPTERS.md`](./DEADHEAD-SESSION-CHAPTERS.md) — official Ghostwire session package (Michael lock 2026-09-21). Foundry Scene order: **Mama’s Club → (Flats Transit, narrate) → Rack & Rest (Cube Hotel) → (Freighter Meet / Call Nox, narrate) → Gold Line → Nightjar Market**. Stamped as the **Deadhead — Session Chapters** Journal (`gwDhSessionChap0`) in **Ghostwire Runs → Deadhead** (**0.3.87**). Deadhead is the TRUE first adventure; QF-01 paused on backlog.
> **Transit cross-link:** Scene 1.15 reuses [`../../campaigns/QF-01-TRANSIT-STUB.md`](../../campaigns/QF-01-TRANSIT-STUB.md) and Runs journal `gwFlatsTransit00` for the licensed Mama’s alley → Rack & Rest hop.


**Ghostwire playtest run · ~4 hours · Director journal SoR**  
**Status:** Design-locked 2026-09-19 · **cargo remap LOCKED 2026-09-20** (Michael: RUN WITH) · folded **0.3.40** · **opposition + wafer + handoff re-locked 2026-09-21** to Session Chapters (5 security + 1 worker drone; wafer = second-to-last; handoff = Nightjar Market) · folded **0.3.87**  
**Consist:** ARG **cargo maglev** — **not** a passenger train. Sidecar: [`GOLD-LINE-CARGO-REMAP.md`](./GOLD-LINE-CARGO-REMAP.md)  
**Foundry home:** Compendium **Ghostwire Runs** → folder **Deadhead**; world Scene inject **Scenes → Deadhead → Gold Line**  
**Plate lock:** Gold Line plates shipped **0.3.36** (CyberMaps Hammerhead stitch; no generated train). Walls/lights = Michael manual — do not touch.

Keep all Deadhead pages, items, and scenes referenced from this pack folder when shipped.

---

## Logline

Mama Cassavir pays the crew to lift a **live ARG transaction wafer** (ghost ledger mirror) from a sealed courier capsule on the **Gold Line cargo maglev** (Spire depot → Switchboard terminus). Board mid-canyon on a borrowed **garbage-truck-sized** trash freighter, crack the capsule on the Wire, bail by the same drone **before** ARG response hits the forced stop — then choose who gets the prize.

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
| **3** | Stir | Flavor: freight intercom glitches half a syllable. |
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
- Use Wired Console **Wire ping/spoof** (GM short text + Send) at Trace 6–7 for the call-home telegraph. Chat: public, or whisper to Overlay / Jacked In. Does **not** auto-move Trace.

---

## Cast & kit

- **Patron:** Mama Cassavir (Mama’s Club brief). The prize never goes back to her club — the Mama path hands off to **Iona Vale** at **Nightjar Market**.
- **Owning corp / uniforms:** **ARG Argent Exchange** (reusable ARG Security + Lieutenant look)
- **Drone contact:** **Nox** (Flats wrangler) — crew **borrows** garbage-truck-sized trash freighter; scratch it = buy it; lose it = explain to Mama
- **Opposition (LOCK — 5 security + 1 worker drone):** **2** ARG Corporate Enforcers (freight Enforcers) in **L1** aft freight; **1** worker drone (Medium, Integrity/Stamina **24**) in the **L2** passage; **1** ARG Security Officer at the **mid console booth**; **1** ARG guard (a second ARG Security Officer token) with the capsule in the **second-to-last** car; **1** ARG Response Lieutenant in the **R3** front cab. Black-container aisle = **0** native meat (spill only on Alert).
- **Wire:** Track 1 cams / doors / lights on every chamber (mid booth = local overrides, not the host); Track 2 capsule lock + Watchdog ICE in the **second-to-last** car; Trace host **R3** cab
- **Buyers (Nightjar Market):** **Iona Vale** (Mama, ¥8,000) · **Rhen Calder** (corp, ~¥14,000) · **Nim** (Signal / Hands Off, ~¥2,000 + weird)
- **Twist:** none for v1 (clean heist)

### Consist (Director truth)

**Cargo maglev** — not a passenger train. Hull **20 ft** wide, **5 ft** furniture. Play surface is the **dual Hammerhead plate**, read as six zones aft → nose: **L1 aft freight → L2 passage → mid console booth → black-container aisle → second-to-last (courier) → R3 front cab**. The capsule rides in the **second-to-last** car — crew usually boards **L1** and works **upstream**. **Players learn the exact chamber only on a great success in discovery**; otherwise they **search**.

**Foundry plate (0.3.36):** dual CyberMaps Hammerhead stitch, nose-to-tail (nose right). Cargo remap sidecar [`GOLD-LINE-CARGO-REMAP.md`](./GOLD-LINE-CARGO-REMAP.md) is LOCKED / folded here.

### Beat remap — dual Hammerhead plate (cargo)

Left → right = aft → forward (nose right). Crew boards **aft** and works **upstream** (rightward).

| Plate zone (L→R) | Hammerhead part | Deadhead zone | Meat |
|---|---|---|---|
| **L1** | Left aft cargo | **AFT FREIGHT** — board here (drone sling) | **2** freight Enforcers (ARG Corporate Enforcer) + cams |
| **L2** | Left connector | **FREIGHT PASSAGE** — ridged containers, clear lane | **1** worker drone (Medium, Integrity 24) |
| **L3** | Left forward + cab | **MID CONSOLE BOOTH** — sealed ARG booth (not a drive cab, not the host) | **1** ARG Security Officer |
| *(coupler)* | Synthetic join | Maglock gangway or non-walkable (Director call) | 0 |
| **R1** | Right aft cargo | **BLACK-CONTAINER AISLE** | **0** native (spill on Alert) |
| **R2** | Right connector | **SECOND-TO-LAST — COURIER** (green crates; sealed capsule + wafer; Track 2 + Watchdog ICE) | **1** ARG guard (second Security Officer token) |
| **R3** | Right forward + cab | **FRONT CAB** — drive end; Trace host | **1** ARG Response Lieutenant |

Six zones, no seventh car. Mid-consist double-cab (L3) is the Hammerhead artifact — narrate a sealed ARG booth rather than a second drive cab. Players call the capsule car “second-to-last”; the Hammerhead label is Director bookkeeping only.

**Shipped assets** (`assets/maps/battlemaps/gold-line/`):

| Role | Where | Prefer | Fallback |
|---|---|---|---|
| Interior (motion) | **Level background** only | `map-gold-line-interior-loop.mp4` | webm, then still |
| Roofs (motion) | **ONE Tile** `goldLineRoofs`, x=0 y=0, 6472×958, elev 1 | `map-gold-line-roofs-loop.mp4` | webm, then still |

`resolveSrc` order is **loop.mp4 → loop.webm → still.webp**. H.264 MP4s carry a real duration (shipped VP9 webms report `duration=N/A` and Foundry throws `Failed to set currentTime ... non-finite`). Stills are a **valid playable layout** if a loop is missing. Do not swap in a generated train.

**Locked architecture (new worlds only):** Level background = interior MP4 (loop + autoplay). One roof tile. No interior motion tile. No second background. Inject deletes leftover `goldLineInterior` tiles.

Foundry paths: `modules/draw-steel-ghostwire/assets/maps/battlemaps/gold-line/<file>`. Scene: **6472 × 958**, grid **208** (5 ft), ~31 × 5 squares.

**Roofs tile** (**Tiles** layer, name **Roofs**): start **x=0, y=0, width=6472, height=958, elevation=1, sort=1, locked**. Occlusion is **NONE** (mode 0, alpha 1).

**Director — hide roofs:** hide the roofs tile when playing inside (Tiles layer → eye / right-click Hide). Unhide for the roof Recall bail. Occlusion stays off. Walls and lights are **Michael manual**.

World inject: `scripts/gold-line-scene.mjs` → **Scenes → Deadhead → Gold Line** on **new** worlds only. If a scene already has flag `goldLineScene`, the module **returns immediately** and never rewrites background, tiles, levels, walls, lights, or dimensions. `{ force: true }` is **GM-opt-in only** and overwrites the live scene — do not run it on a dressed map. Ready never passes force.

---

## Mama’s Deadhead Job Stick (mission wafer) — Item

**Name:** Mama’s Deadhead Job Stick (Gold Line)  
**Type:** Briefing chip / gear (portable)  
**¥:** Negligible as loot (~¥50); worthless to fence (Mama-marked)

**On the stick (baseline):** job, pay, wipe-if-stop-while-nested, ARG, Nox borrow, Gold Line cargo maglev without naming the capsule chamber, vague meat/Wire/clock, bail = same bird, return for choice.

**Not on the stick:** exact chamber; Watchdog / cams numbers; +1 Trace / 2 rounds wafer-out; full faction doors (corp/Signal) until discovery D.

---

## Discovery (Beat 0)

Start from Mama’s job stick at **Rack & Rest / Cube Hotel commons** (full Foundry Scene — see Session Chapters 1.2), then chase:

| Code | Intel |
|---|---|
| A | Roster & Alert triggers (5 security + 1 worker drone; Lt advances on Hunting) |
| B | Capsule Faraday + Track 2 Watchdog; Track 1 cams/doors; Trace host **R3** |
| C | Full Trace ladder + wafer-out tick + wipe/stop rules |
| D | Faction doors (Mama / corp sell / Signal) as real choices — Mama path meets **Iona Vale** at **Nightjar Market**, not the club |
| ★ | **Great success:** exact **chamber** with the capsule (**second-to-last** car) |

Methods: Mama back-room, Wire recon (Overlay on a schedule mirror — not the live train yet), canyon watch, bribe/badge. Fail = go in blind, not blocked.

**Aerial recon photo:** success on canyon watch, Wire schedule recon, or a bribe can yield the **Gold Line aerial recon** handout before Beat 1 (Journal in **Ghostwire Runs → Deadhead**; optional Plot gear Item so it can sit on a sheet). Discovery intel only — no cash. Do **not** bake this photo into the Gold Line battlemap. Do not force-rewrite the live Scene.

---

## 4h Director clock

| Block | Time | Beat |
|---|---|---|
| 0 | 55–75m | Mama’s → Flats transit → **Rack & Rest (Cube Hotel) commons** discovery/prep + patron interrupt → call Nox |
| 1 | 30–40m | Canyon drone sling board (garbage-truck freighter) |
| 2 | 40–50m | Freight crawl → mid booth → search upstream |
| 3 | 30–40m | Wire + capsule crack; call-home if Trace ~7–8 |
| 4 | 25–35m | Wafer-out clock + roof Recall bail |
| 5 | 20–30m | **Nightjar Market** exchange + moral choice (separate Scene — not a Gold Line Beat) |

### Beat rule callouts (short)

**1 Board:** Deploy/Recall; Agility/Might board rolls; mixed = Alert +1; Jacked In can’t make physical board rolls.  
**2 Crawl:** Stealth vs violence through aft freight (L1–L2); cams; ARG firearms; don’t emergency-stop while nested. Search if no ★ chamber intel.  
**3 Wire:** Overlay/Jacked In; Console nodes; Watchdog; open case starts post-extract clock; wipe if stop while nested.  
**4 Bail:** +1 Trace / 2 rounds out of case (respect +1/round cap); Recall freighter; be gone before stop + response.  
**5 Nightjar:** Mama (Iona) / corp (Rhen) / Signal (Nim) at Nightjar Market; Nox drone condition as fiction string.

---

## Foundry build list (pack together under Ghostwire Runs / Deadhead)

- [x] Journal: this run (pages: Overview, Trace ladder, Beats 0–5, Items, Opposition, Foundry checklist) — **0.3.42**
- [ ] **Rack & Rest / Cube Hotel Scene** — **LOCKED 2026-09-21** for Deadhead Session chapters. Michael’s world Scene based on CyberMaps Cube Hotel 4K plate (`worlds/ghostwire-v2/scenes/Cube Hotel 4K [doors] - Gridless.mp4`). Commons = planning board; patron interrupt required mid-1.2. ~~Beat 0 hangout Scene REMOVED permanently 0.3.55~~ **struck for Deadhead** — do **not** revive a generic module-injected “crew hangout”; this is specifically **Rack & Rest / Cube Hotel**. Docs lock only; Actors/Items not created this run.
- [x] Canyon plate **SKIPPED** — narrate the mid-canyon approach (**still stands**; unchanged; separate from the Rack & Rest Scene lock)
- [x] Journal: Gold Line — Map Notes (plate paths + beat remap) in **Ghostwire Runs → Deadhead**
- [x] Item: Mama’s Deadhead Job Stick — **0.3.52** (`Ghostwire Gear → Plot & Run Hooks`)
- [x] Item: ARG courier capsule / live wafer (plothook notes for three buyers) — **0.3.52**
- [ ] Scene: **Rack & Rest / Cube Hotel** (Michael world Scene; commons planning + patron interrupt) — replaces struck “crew hangout REMOVED 0.3.55” row for Deadhead. Not a generic module hangout inject.
- [x] Scene: Mama’s Club (reuse — Michael world Scene; do not restamp)
- [x] Scene: **Nightjar Market** — **0.3.87** create-once world inject **Scenes → Deadhead → Nightjar Market** (plate `assets/maps/battlemaps/nightjar-market/nightjar-market.webp`, 1579×915). Never rewrites an existing Nightjar Scene. Walls/lights/tokens = Michael dress pass; do not invent furniture.
- [x] Journal: **Deadhead — Session Chapters** — **0.3.87** (`gwDhSessionChap0`, Ghostwire Runs → Deadhead). READ ALOUD visible; Director material in secret blocks.
- [x] Actors: Rack & Rest Faces (Vesper / Tam / Sera / Vell / Juno) + Nightjar buyers (Iona / Rhen / Nim) — **0.3.87** in **Ghostwire Runs — Deadhead Actors**; tokens `assets/tokens/deadhead/`. Nox portrait on the freighter Actor.
- [ ] Scene: canyon approach / drone sling strip (**SKIPPED** plate — narrate; still stands)
- [x] Scene: Gold Line dual-Hammerhead (world inject; interior loop + roofs overhead)
- [ ] Splash art: garbage-truck freighter + 4 runners over moving train
- [ ] Tokens on Gold Line Scene: ARG Security Officer, ARG Response Lieutenant (+ ARG Corporate Enforcers). **Bestiary Actor art shipped 0.3.47** (`assets/tokens/bestiary/arg/`). Do not force-rewrite the live Gold Line Scene.
- [x] Nox trash freighter **Item** — **0.3.54** (`Ghostwire Vehicles → Air`, `assets/tokens/vehicles/nox-trash-freighter.webp`). Library SKU. Do not force-rewrite the live Gold Line Scene.
- [x] Nox trash freighter **Actor** — **0.3.54** (`Ghostwire Runs — Deadhead Actors`, `src/packs/deadhead/nox-trash-freighter.json`). Placeable token: drag onto Gold Line roofs, resize, fly in for Beat 1 / Recall on Beat 4. Suggested size **4×6** squares (grid 208 px = 5 ft; **5×8** if it reads small). Friendly, no ring. Ghostwire Runs is JournalEntry-only, so the Actor ships in a sibling GM-only Actor pack listed next to Runs. Do not force-rewrite the live Gold Line Scene.
- [x] Handout: Gold Line aerial recon photo — **0.3.54** (Journal in **Ghostwire Runs → Deadhead**; image page + intel page; `assets/items/deadhead/gold-line-aerial-recon.webp`). Canyon watch / Wire schedule recon / bribe. Discovery intel only. Optional Plot gear Item in **Ghostwire Gear → Plot & Run Hooks**. Do not bake into the battlemap. Do not force-rewrite the live Gold Line Scene.
- [ ] Wired Console board preset on train Scene (nodes + Trace)
- [x] Console **Wire ping/spoof** for call-home telegraph (**0.3.45**)

Art locks: flat top-down maps; no people on maps; no baked grid; ARG uniform stylization reusable.

---

---

## Related — Flats infrastructure (WORKING)

Street-layer licensed rides used elsewhere in Ghostwire (not part of the Gold Line consist):

- **Grey Cab Services** (“Grey Cab”) — autocab hover pods (ARG meter / FER chassis / MER hail ping)
- **Veinline Civic** (“the Vein”) — Ferrum district tram (civic teal + gunmetal)

Director stub: `docs/directors/campaigns/QF-01-TRANSIT-STUB.md` · Source: `docs/directors/flats-transit-grey-cab-veinline.md` · Runs journal (after build): @UUID[Compendium.draw-steel-ghostwire.runs.JournalEntry.gwFlatsTransit00]{Flats Transit — Grey Cab & Veinline}


## L1 Trace tools note (playtest)

**Kessic brings Whiteout×2** (compiled magazine, 2 fires on Switchblade / Street Deck) — that is the L1 Trace −1 payload. **Sabbat Vane** also starts with Whiteout×2 compiled on **Wired Native** (no deck). Other Technomancers do not auto-gain Whiteout. Deadhead’s ICE call-home block is the scenario Trace −1 if nobody runs Whiteout. Ghost Step (cancel an increase) is later-level.
