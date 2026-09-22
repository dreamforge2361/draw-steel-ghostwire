# Foundry next push — Deadhead (authoritative checklist)

> **SHIPPED 0.3.87** (2026-09-21). §F decisions taken: **F3** — new **Deadhead — Session Chapters** Journal `gwDhSessionChap0` (SoR `gwDeadheadDirJrn` kept as the rules sidecar, regenerated to the 5+1 / second-to-last / Nightjar locks). **F5** — the proposed ids were 15 characters; Foundry needs 16, so each is right-padded with `0`: Iona `gwDhIonaVale0000` · Rhen `gwDhRhenCalder00` · Nim `gwDhNim000000000` · Vesper `gwDhVesperDrift0` (already 16) · Tam `gwDhTamKade00000` · Sera `gwDhSeraNix00000` · Vell `gwDhCousinVell00` · Juno `gwDhJunoHalve000`. **F6** — courier guard = second **ARG Security Officer** token (no new SKU). **F4** — Nightjar Market is a create-once world inject (plate only; walls / lights / seats are the Director dress pass; grid 63 px = 5 ft estimated from the plate — confirm in Scene config). Gold Line untouched. Smoke: `node tools/deadhead-session-smoke.mjs`. §E below is Michael's in-Foundry pass.

**Status:** **SIGNED OFF FOR PUSH** · Michael 2026-09-21 ET (Foundry closed)  
**Execute** pack build + Actor stamp + Nightjar Scene + Session Chapters Journal. Still **never** `{force:true}` on live Gold Line Scene.  
**Ritual / Street Magic:** out of scope for this push — deferred until after Deadhead Foundry push + smoke.

**Session package standard (Michael lock 2026-09-21):** [`DEADHEAD-SESSION-CHAPTERS.md`](./DEADHEAD-SESSION-CHAPTERS.md) is the **official Ghostwire session package template** (READ ALOUD Meatspace/Wired boxes; Director Notes isolation; Scene/Beat layout). Quiet Floor adopts the same standard after Saturday Deadhead playtest. Quiet Floor Session package pointer: [`../../campaigns/QUIET-FLOOR-RUN-SPEC.md`](../../campaigns/QUIET-FLOOR-RUN-SPEC.md).

**Source locks:** [`DEADHEAD-GOLD-LINE.md`](./DEADHEAD-GOLD-LINE.md) · [`GOLD-LINE-CAR-BY-CAR.md`](./GOLD-LINE-CAR-BY-CAR.md) · [`FOUNDRY-NEXT-TOKEN-IMPORT.md`](./FOUNDRY-NEXT-TOKEN-IMPORT.md)

**Pack conventions (verified):**
| Pack | Type | Path / label | Notes |
|---|---|---|---|
| `runs` | JournalEntry | **Ghostwire Runs** → folder **Deadhead** (`gwRunsDeadhead00`) | Journals / handouts only |
| `deadhead` | Actor | **Ghostwire Runs — Deadhead Actors** (`packs/deadhead`) | Sibling GM-only Actor pack; not mixed into `runs` |
| `gear` | Item | **Ghostwire Gear → Plot & Run Hooks** (`gwGearPlot000000`) | Job Stick, capsule, aerial recon Item |
| `bestiary` | Actor | **Ghostwire Bestiary** → Corp Security / Wire | ARG opposition; Watchdog ICE |
| `summons` | Actor | **Ghostwire Summons & Machines** | `machine-drone-medium` |
| `vehicles` | Item | **Ghostwire Vehicles → Air** | Nox freighter library SKU |

World Scene home: **Scenes → Deadhead → …** (Mama’s / Rack & Rest / Gold Line / Nightjar). Do **not** invent Items/Actors/Journals folders inside world Scenes as pack homes.

---

## A. Required Deadhead session package

### A1. Journals (Ghostwire Runs → Deadhead)

| Asset | Source | Target | Notes |
|---|---|---|---|
| **Session Chapters** (Directors Journal) | `docs/directors/runs/deadhead/DEADHEAD-SESSION-CHAPTERS.md` | **PROPOSED** Journal under `gwRunsDeadhead00` — stamp from Session Chapters (official template) | Preserve **READ ALOUD — Meatspace / Wired** boxes for players; keep Director Notes / If pressed / dials / opposition seats **Director-only**. Page structure follows Scene order below. |
| **Deadhead Director SoR** (existing) | `src/packs/runs/deadhead/deadhead-director.json` | `_id` **`gwDeadheadDirJrn`** | **GAP:** shipped pages still carry pre-Michael opposition (4 Officers + Lt nest / R1 courier) and Beat 5 “return” language. **Required before push:** regenerate / edit Opposition + Cast/Kit + Beats to match LOCK **5 security + 1 drone**, wafer = **second-to-last**, handoff = **Nightjar Market** (not a Gold Line Beat). |
| **Gold Line — Map Notes** | `src/packs/runs/deadhead/gold-line-map.json` | `_id` **`gwDeadheadGoldLn`** | Keep as Director sidecar / Map Notes. Cross-link car-by-car prose; do not dump full Trace ladder into player pages. |
| **Gold Line — Aerial Recon** | `src/packs/runs/deadhead/gold-line-aerial-recon.json` | `_id` **`gwDhAerialRecon0`** | Image + intel pages. Discovery handout only. |
| **Car-by-car Director sidecar** | `docs/directors/runs/deadhead/GOLD-LINE-CAR-BY-CAR.md` | Prefer Map Notes pages / Journal append under Deadhead **or** Director-only linked page on Session Chapters | Chamber cards, drone dealing, Path A/B — not READ ALOUD. |
| Plot / buyer / Trace pages | Session Chapters Nightjar DN + SoR Trace ladder | Session Chapters Journal + SoR Trace page | Buyer faces Iona / Rhen / Nim; Trace 0–12 on train host. No separate invented Journal UUIDs. |

### A2. Scenes / maps (world Scenes → Deadhead)

| Scene | Status | Plate / asset | Push action |
|---|---|---|---|
| **Mama’s Club** | **Existing** | `mama-cassavir-club` · `assets/maps/battlemaps/mama-cassavir-club.webp` (+ loop) | Reuse. Seat balcony booth. Do not restamp. |
| **Rack & Rest / Cube Hotel** | **Existing world Scene** (docs-locked) | CyberMaps Cube Hotel 4K (`Cube Hotel 4K [doors] - Gridless.mp4` in world) | Commons = planning board + Faces tokens. Stamp Deadhead Actors; do **not** force-rewrite dressed Scene until tokens ready. |
| **Gold Line** | **Existing** (live-scene lock `goldLineScene`) | Dual Hammerhead · `assets/maps/battlemaps/gold-line/` interior + **Roofs** tile `goldLineRoofs` | Show roofs for board/Recall; hide when inside. Place opposition + Nox freighter. **Never** `{ force: true }` on ready. |
| **Nightjar Market** | **Required new world Scene** | Plate `/workspace/gw-art-refs/deadhead-maps/nightjar-market.png` (1579×915) | Foundry order **after Gold Line**: Mama’s → Rack & Rest → Gold Line → **Nightjar Market**. Seat buyer at counter/service edge or existing table. Do not invent furniture. |
| **Flats Transit** | Narrate / travel strip | Reuse `QF-01-TRANSIT-STUB` / `gwFlatsTransit00` texture | **Do not create phantom Scene** unless a verified travel map already exists. |
| **Freighter Meet (Call Nox)** | Narrate / pad | Nox freighter Actor on Gold Line roofs for board | **Do not create phantom Scene** unless a verified pad map exists. |
| Canyon approach | **SKIPPED** | — | Narrate only. |

### A3. Items (verify — existing)

| Item | `_id` | Pack / folder | Notes |
|---|---|---|---|
| Mama’s Deadhead Job Stick (Gold Line) | **`gwMamaBriefWafer`** | Gear → Plot & Run Hooks | Briefing chip ≠ prize. |
| ARG Courier Capsule (Gold Line) | **`gwArgCourierCap0`** | Gear → Plot & Run Hooks | Live transaction wafer / ghost ledger mirror plothook. |
| Gold Line Aerial Recon (Plot Item) | **`gwGoldLineRecon0`** | Gear → Plot & Run Hooks | Optional sheet copy of Journal handout. |
| Nox’s Trash Freighter (Vehicle Item) | **`gwNoxTrashFrgt00`** | Vehicles → Air | Library SKU; Actor is board token. |

**No new Item UUIDs invented this prep.** Aerial recon Journal already exists (`gwDhAerialRecon0`).

### A4. Existing opposition / machines (verify — place; do not duplicate Actors)

**LOCK total = 5 security + 1 worker drone.**

| Place | Who | Verified Actor | Pack path |
|---|---|---|---|
| L1 aft freight | **2×** ARG Corporate Enforcer | `_id` **`h3LR6HHADCpyFMsN`** · lang ARG Corporate Enforcer · source `corp-enforcer.json` | `Compendium.draw-steel-ghostwire.bestiary.Actor.h3LR6HHADCpyFMsN` |
| Mid console booth | **1×** ARG Security Officer | `_id` **`DVEibxfpEWA5RoCn`** · `corp-security-officer.json` | `…bestiary.Actor.DVEibxfpEWA5RoCn` |
| Second-to-last courier | **1× ARG guard** | **Taxonomy map:** use **ARG Security Officer** (`DVEibxfpEWA5RoCn`) as the courier-chamber guard (same Actor type, second token). Session Chapters / SoR say “1 ARG guard” — not a separate bestiary SKU. Keeps type count = **2 Security Officer tokens** + 2 Enforcers + 1 Lt. | same Officer Actor |
| R3 front CAB | **1×** ARG Response Lieutenant | `_id` **`g7LC1G0K20UnYzkr`** · `response-lieutenant.json` | `…bestiary.Actor.g7LC1G0K20UnYzkr` |
| L2 passage | **1×** worker drone Integrity/Stamina **24** | `_id` **`zrESvaOxNgEPffhF`** · `dsid: machine-drone-medium` · `src/packs/summons/machines/machine-drone-medium.json` | `Compendium.draw-steel-ghostwire.summons.Actor.zrESvaOxNgEPffhF` |
| Track 2 capsule (Wire) | Watchdog ICE | `_id` **`dNEBSb47qSV9lRRH`** | Console / optional token — Wire, not meat seat |

**Count check:** Enforcer×2 + Officer×2 (mid + courier) + Lieutenant×1 = **5 security**; drone×1. Black-container aisle = 0 native meat.

### A5. Required staged tokens → Deadhead Actors (stamp this push)

| Face | Staged art | Module target (on push) | Proposed Actor id |
|---|---|---|---|
| **Nox** | `/workspace/gw-art-refs/deadhead-npcs/nox-portrait.png` | `assets/tokens/deadhead/nox-portrait.png` (+ freighter already `gwNoxTrashActor0`) | Portrait on freighter / contact sheet; freighter Actor **exists** `gwNoxTrashActor0` |
| **Vesper Drift** | `…/rack-rest/rack-rest-vesper-drift-token.png` | `assets/tokens/deadhead/rack-rest-vesper-drift-token.png` | **PROPOSED** `gwDhVesperDrift0` |
| **Tam Kade** | `…/rack-rest-tam-kade-token.png` | `assets/tokens/deadhead/rack-rest-tam-kade-token.png` | **PROPOSED** `gwDhTamKade0000` |
| **Sera Nix** | `…/rack-rest-sera-nix-token.png` | `assets/tokens/deadhead/rack-rest-sera-nix-token.png` | **PROPOSED** `gwDhSeraNix0000` |
| **Cousin Vell** | `…/rack-rest-cousin-vell-token.png` | `assets/tokens/deadhead/rack-rest-cousin-vell-token.png` | **PROPOSED** `gwDhCousinVell0` |
| **Juno Halve** | `…/rack-rest-juno-halve-token.png` | `assets/tokens/deadhead/rack-rest-juno-halve-token.png` | **PROPOSED** `gwDhJunoHalve00` |
| **Iona Vale** | `/workspace/gw-art-refs/deadhead-npcs/iona-vale-token.png` | `assets/tokens/deadhead/iona-vale-token.png` | **PROPOSED** `gwDhIonaVale000` |
| **Rhen Calder** | `/workspace/gw-art-refs/deadhead-npcs/rhen-calder-token.png` | `assets/tokens/deadhead/rhen-calder-token.png` | **PROPOSED** `gwDhRhenCalder0` |
| **Nim** | `/workspace/gw-art-refs/deadhead-npcs/nim-token.png` | `assets/tokens/deadhead/nim-token.png` | **PROPOSED** `gwDhNim00000000` |

All proposed Actor ids are **PROPOSED until implementation**. Ship in **`deadhead` Actor pack** (not bestiary main packs). L1 NPC contact band — see §B and Appendix actor specs.

### A6. Wire / Console (Gold Line)

| Element | Spec | Status |
|---|---|---|
| Trace host | Track 2 · R3 CAB · Rating ~3 · ladder 0–12 · +1/round cap | Narrate until board preset ships |
| Capsule + Watchdog | Track 2 · second-to-last · Rating ~3 · Integrity 26 | Watchdog Actor exists |
| Track 1 cams/doors/lights | Per car-by-car defaults | Auto-nodes / library OK; no force-rewrite walls |
| Wire ping/spoof | Call-home telegraph ~7–8 | **Shipped** 0.3.45 |
| Wired Console board preset | Full node graph on Gold Line Scene | **Still open** — narrate nodes if unset |

---

## B. New Nightjar package

| Asset | Action |
|---|---|
| World Scene **Nightjar Market** | Create from plate `gw-art-refs/deadhead-maps/nightjar-market.png`; folder Deadhead; nav after Gold Line |
| Actors **Iona Vale**, **Rhen Calder**, **Nim** | Stamp playable L1 NPC specs (Appendix); tokens staged (all three art **delivered**) |
| Buyer swap procedure | Mama → Iona; corp → Rhen (counter / Grey Cab / west bay); Signal → Nim (east neon listen). Only one active buyer seat unless heat table says otherwise |
| Watcher + optional 1d6 heat | Session Chapters DN — social-first; no native opposition |
| Pay / fallout | Mama ¥8k / corp ~¥14k / Signal ~¥2k+weird; half base only if wiped/lost |
| Session Chapters Journal pages | Nightjar Scene beats with READ ALOUD isolation |

**Do not** force Iona if corp/Signal path chosen. **Do not** reopen Gold Line Trace math at the counter.

---

## C. Reused existing module assets (do not duplicate)

- Mama’s Club Scene + Mama / club ambience Actors (Vexa, Pip, Soft Trace = color)
- ARG bestiary trio + art `assets/tokens/bestiary/arg/`
- `machine-drone-medium` + Mule-Bot cargo plate
- Watchdog ICE `dNEBSb47qSV9lRRH`
- Job Stick / Capsule / Aerial recon Item+Journal / Nox freighter Item+Actor
- Gold Line Scene inject kit (new worlds only) + map notes Journal
- Flats Transit journal / Grey Cab & Veinline fare fiction
- Wire Kit feature pattern on contacts (Connect interface)
- Matrix payloads **Whiteout** (`wHt0uT7mAgK3s1cQ`) / **Static** (`OepS68mz9km9j8EU`) as **kit references** for Nim — do not duplicate SKUs; note magazine fiction on Actor sheet

---

## D. Optional library tokens (queued — **not** required for this Deadhead run)

Keep separate from Deadhead required queue ([`FOUNDRY-NEXT-TOKEN-IMPORT.md`](./FOUNDRY-NEXT-TOKEN-IMPORT.md)):

| Token | Path |
|---|---|
| Burning blue sedan wreck | `assets/tokens/props/burning-blue-sedan-wreck.png` · ref `/workspace/gw-art-refs/tokens/props/burning-blue-sedan-wreck.png` |
| Corpse — male East Asian, shot | `assets/tokens/corpses/corpse-male-east-asian-shot.png` · ref `/workspace/gw-art-refs/tokens/corpses/corpse-male-east-asian-shot.png` |

Also optional / backlog (not blockers for playable Deadhead): splash art (freighter + 4 runners); full Wired Console Gold Line preset; Rack & Rest Actors beyond token stamp if Scene already playable with placeholders.

---

## E. Exact smoke-test list

1. **Folder tree:** Deadhead Journals live under **Ghostwire Runs → Deadhead** (`gwRunsDeadhead00`); Deadhead **Actors** live in **Ghostwire Runs — Deadhead Actors** pack; plot Items stay in **Gear → Plot & Run Hooks**; ARG opposition stays in **Bestiary** — **not** mixed into main bestiary as run-only duplicates.
2. **Scene order / nav:** Mama’s → Rack & Rest → (narrate Transit / Freighter) → Gold Line → **Nightjar Market**. No phantom Transit/Freighter Scenes. No Handoff Beat on Gold Line.
3. **Journal permissions:** Session Chapters READ ALOUD pages player-observable as intended; **Director Notes / Trace ladder / opposition seats / buyer secrets** GM-only — never exposed to players or Voidmark dumps.
4. **Item handoff:** Job Stick `gwMamaBriefWafer` portable to a hero sheet; capsule `gwArgCourierCap0` prize path works; aerial recon Journal show + optional Item `gwGoldLineRecon0`.
5. **Token art / Actor link:** Every required token path above resolves; Iona / Rhen / Nim / Rack & Rest Faces / Nox portrait linked on Actors; freighter `gwNoxTrashActor0` placeable.
6. **Opposition count / placement:** Exactly **2 Enforcers (L1) + 1 Officer (mid) + 1 Officer-as-guard (second-to-last) + 1 Lieutenant (R3) + 1 drone (L2, Sta 24)** — total 5+1. No fourth Officer nest. No R1 courier label.
7. **Roofs tile:** Show for board + freighter place; hide after L1 entry; **unhide** for Recall bail. Occlusion stays NONE. Freighter Recall deletes/moves Actor per existing Deploy/Recall fiction.
8. **Wire nodes / Watchdog / Trace host:** Capsule Track 2 + Watchdog; Trace host R3; call-home ping/spoof usable; +1 Trace / round cap respected in Director procedure.
9. **Nightjar buyer swap:** Toggle Iona / Rhen / Nim without forcing Mama; watcher foreshadow unnamed until discovered; optional 1d6 heat does not invalidate chosen buyer.
10. **Pay / fallout / Victory:** Apply pay table; half base only if wiped/lost; Nightjar Victory checklist completable; Nox bird fiction resolved.
11. **Secrets:** No Director spoilers in READ ALOUD; Voidmark at Rack & Rest only and does not dump chamber/Trace/wipe unless earned.
12. **Stale Handoff Beat:** Gold Line Scene / SoR / Session Chapters contain **no** “Handoff” as a Gold Line Beat — exchange is **Nightjar Market** only. Director journal regen must wipe old Beat 5 “return to Mama’s club” handoff if still present.

---

## F. Known blockers / decisions before push

1. **Michael review sign-off** on this manifest + Appendix actor specs (prep only — no push yet).
2. **Regenerate / patch `gwDeadheadDirJrn`** so Opposition / Cast / Beats match LOCK 5+drone, second-to-last wafer, Nightjar handoff (shipped journal is stale vs Session Chapters).
3. **Session Chapters → Foundry Journal** stamp path (new Journal vs overwrite SoR pages) — decision: prefer **new Session Chapters Journal** under Deadhead folder + keep SoR as rules sidecar, **or** replace SoR Beat pages; Michael picks.
4. **Nightjar Market world Scene** create from PNG; wall/light dress pass vs plate — do not invent objects.
5. **Proposed Actor ids** (`gwDhIonaVale000`, `gwDhRhenCalder0`, `gwDhNim00000000`, Rack & Rest five) — confirm 16-char / pack id convention then stamp into `src/packs/deadhead/`.
6. **Courier “ARG guard”** confirmed as second **Security Officer** token (no new SKU) — Michael confirm or name alternate existing Actor.
7. **Wired Console Gold Line preset** still backlog — playable via narration; not a hard blocker if Directors accept.
8. **Do not** `{ force: true }` Gold Line; do not restamp Mama’s / Rack & Rest walls/lights.
9. **Ritual / Street Magic** work explicitly deferred until after this push + smoke.
10. Optional library wreck/corpse tokens stay **out** of required Deadhead package.

---

## Appendix — Fully playable Nightjar buyer Actor specs

Convention: Draw Steel **NPC** (`type: npc`), early-run **level 1**, contact/platoon band (not Hero sheets). Characteristics use Foundry keys `might` / `agility` / `reason` / `intuition` / `presence` (= Physique / Reflex / Logic / Instinct / Persona). Skills are Director tags (+2 on tests / Hacking = Wired edge per `02`/`21`) — NPC sheets do not store a skills array today. Prefer existing band math (Mama-club contact / Street Doc platoon scale). **Contacts are not boss fights.**

---

### 1. Iona Vale — Mama intermediary

| Field | Value |
|---|---|
| **Proposed stable id** | **PROPOSED** `gwDhIonaVale000` · `_key` `!actors!gwDhIonaVale000` · pack `deadhead` |
| **Actor type** | `npc` |
| **Level / role / organization** | L1 · **support** · **platoon** (EV 6 suggested) |
| **Keywords** | humanoid, human |
| **People / ancestry** | **Pure Human** — signature Detect the Supernatural (color if needed). Purchased traits fiction: **Perseverance** + **Staying Power** (resilient courier; not a fighter). |
| **Visible chrome / traits** | One **street chrome optic** (record-grade Cyber-Eyes — not combat suite; not Cyborg People). Grocery basket cover. |
| **Size / speed** | Size 1M · Speed **5** walk · Disengage 1 · Stability **0** |
| **Stamina** | **30** / 30 (Street Doc / hustler platoon band) |
| **Characteristics** | Might 1 · Agility 1 · Reason 0 · Intuition **2** · Presence **2** |
| **Defenses / resistances** | Save threshold 6. Corruption/psychic immunity **0** (no invented immunities). Free strike **2**. |
| **Skills (Director tags)** | Streetwise, Perception, Stealth, Negotiation, Insight |
| **Wire** | **Wire Kit — Matrix Verbs** (Connect interface). Default **Linked** / soft presence; Overlay only if she must price risk. No deck, no payloads. Civic Scan only. |
| **Negotiation** | Interest **5** · Patience **4** · Impression 2 · **Drive:** clean delivery / Switchboard deniability (**Greed** soft — get paid and gone) · **Pitfall:** naming Mama / Switchboard / Gold Line chamber at the table; flashing the wafer at front glass |
| **Combat posture / retreat** | Disengage + aisle cover; never stands to trade fire. **Retreat trigger:** any serious meat threat, or front glass goes loud → stockroom / **west bay** exit with basket. |
| **Token** | `/workspace/gw-art-refs/deadhead-npcs/iona-vale-token.png` → `modules/draw-steel-ghostwire/assets/tokens/deadhead/iona-vale-token.png` |
| **Encounter use (Nightjar)** | Default Mama path face at counter/table; basket between prize and glass; pay **¥8,000**. |
| **If attacked** | Shift/Disengage toward west bay; drop meet; call later heat fiction — **do not** escalate to boss fight. Opportunists/heat table only if crew starts it. |

**Abilities / features (2–4, include social):**

1. **Grocery Cover** (feature) — Edge on tests to be dismissed as a late-shift shopper; basket is the cover story and she will die on it.
2. **Street Optic Tick** (feature / maneuver fiction) — Instinct Perception edge once per scene to notice a glass tell / west-bay watcher (feeds Nightjar watcher procedure; no auto combat).
3. **Finish or Walk** (maneuver · social) — Persona + Negotiation / Insight vs one creature; Middle+: they accept terms or leave the meet; High: they leave and the watcher sightline softens; Low: she cools / second low → walk risk (Session Chapters bands).
4. **Basket Edge** (main · signature · melee 1 · last resort) — Power Roll + Agility · damage **1 / 2 / 3** (handset/basket swing — Luma Glass band). Then Disengage 1 toward cover. **Not** a primary plan.

**Biography / voice / tells / goals / secrets:** Calm middle-aged Flats courier; Mama’s deniable hand. Voice: short, practical; never says Mama, Switchboard, or Gold Line at the table. Tells: chrome eye ticks once when pricing risk; basket always between wafer and street glass. Goal: take wafer, pay ¥8k, leave Switchboard unpainted. Secret: she will abandon the meet before she paints Mama’s booth.

---

### 2. Rhen Calder — Elvani corporate buyer

| Field | Value |
|---|---|
| **Proposed stable id** | **PROPOSED** `gwDhRhenCalder0` |
| **Actor type** | `npc` |
| **Level / role / organization** | L1 · **controller** · **platoon** (EV 6 suggested) |
| **Keywords** | humanoid, elvani |
| **People / ancestry** | **Elvani** — signature **Corp Glamor** (edge on Persona tests using Persuasion; never appears as someone else). Purchased fiction: **High Senses** + **Graceful Retreat** (+1 Disengage distance). |
| **Visible chrome / traits** | Restrained ARG-gold pin; ledger slate / payment wafer case; black gloves; no heavy weapon. |
| **Size / speed** | Size 1M · Speed **5** · Disengage **2** (Graceful Retreat) · Stability **0** |
| **Stamina** | **30** / 30 |
| **Characteristics** | Might 0 · Agility 1 · Reason 1 · Intuition **2** · Presence **3** |
| **Defenses / resistances** | Save threshold 6. Free strike **2**. No heavy armor fiction. |
| **Skills (Director tags)** | Corporate, Negotiation, Persuasion, Insight, Perception |
| **Wire** | Wire Kit present (corp hail / ledger). Stays **Linked** for meter/hail chrome; Overlay rare. No offensive Wire kit. |
| **Negotiation** | Interest **4** · Patience **5** · Impression 2 · **Drive:** reclaim / flip wafer at **~¥14,000**; contain ARG/SAN narrative · **Pitfall:** justice / exposing Switchboard dirty; crew flashing chamber intel as leverage |
| **Combat posture / retreat** | Defensive withdrawal; call security / log SINs — **no** autoshotgun. **Retreat trigger:** first solid hit on him, or crew draws firearms in public aisle → sealed Grey Cab / west bay extract + later ARG/SAN heat. |
| **Token** | `/workspace/gw-art-refs/deadhead-npcs/rhen-calder-token.png` → `modules/draw-steel-ghostwire/assets/tokens/deadhead/rhen-calder-token.png` |
| **Encounter use** | Corp sell path — counter, south-road Grey Cab, or west bay. |
| **If attacked** | Glamor of courtesy breaks; he Disengages, triggers **Call Security** fiction (civic scout / later heat — not train roster spawn), leaves. Not a duel. |

**Abilities / features:**

1. **Corp Glamor** (feature) — RAW Elvani: edge on Persona tests using Persuasion; appearance engages but remains himself.
2. **Ledger Terms** (maneuver · social) — Persona + Negotiation vs crew speaker; applies Session Chapters exchange bands (Low cool / Middle +¥1k or cleaner drop / High +¥2k). Cap: will not pay Signal-weird.
3. **Graceful Withdrawal** (move / triggered) — When targeted by a strike or the aisle goes loud: Disengage up to **2**, then move toward cab/bay; gains edge on next Stealth or Deception test to break line of sight this round.
4. **Call Security** (maneuver · once / scene · noncombat procedure) — Marks crew for ARG/SAN follow-up; optional heat-table feed. Does **not** spawn Gold Line Enforcers on Nightjar. No heavy weapon attack.

**Art lock (delivered on token):** man, early 40s, tall/narrow, warm bronze skin, sharply tapered ears, close dark hair with precise silver streak, pale gold glamor eyes; charcoal raincoat, ivory collarless suit, black gloves, restrained ARG-gold pin, ledger slate / payment wafer case; courteous, distant.

**Biography / voice:** Courteous, distant, ledger-polite. “Fourteen. Heat is yours. Curb or counter.” Goal: wafer + containment. Secret: rival-flip vs ARG reclaim is his call — crew may not learn which.

---

### 3. Nim — Revenant Signal / Hands Off buyer

| Field | Value |
|---|---|
| **Proposed stable id** | **PROPOSED** `gwDhNim00000000` |
| **Actor type** | `npc` |
| **Level / role / organization** | L1 · **controller** · **platoon** (EV 6 suggested) |
| **Keywords** | humanoid, undead, revenant |
| **People / ancestry** | **Revenant** · Former Life **Pure Human** (size 1M, speed **5**). Signature **Tough But Withered**: immunity to cold / corruption / lightning / poison equal to **level (1)**; **fire weakness 5**; at negative winded → **inert** (not dying); fire while inert = destroyed. Purchased fiction: **Bloodless** (can’t be made bleeding). |
| **Visible chrome / traits** | Faint cyan memory seams at temples/hand; old single-ear receiver + throat transceiver; insulated shopping bag. Uncanny/political — **not** monstrous. |
| **Size / speed** | Size 1M · Speed **5** · Stability **0** |
| **Stamina** | **30** / 30 (meat fight avoided; Integrity fiction N/A — meat Stamina pool) |
| **Characteristics** | Might 0 · Agility 1 · Reason **3** · Intuition **2** · Presence 1 |
| **Defenses / resistances** | Save 6. Damage immunities: cold 1, corruption 1, lightning 1, poison 1; **fire weakness 5**. Free strike **2**. |
| **Skills (Director tags)** | Hacking (Wired **edge**), Matrix Theory, Stealth, Deception, Insight, Streetwise |
| **Wire** | Wire Kit + **Street Deck** fiction (or Wired Native if Director prefers Technomancer-adjacent Soft). Default posture **Overlay** for the meet; **Jacked In** only if body is hidden (east neon listen). Kit refs (do not duplicate Items): **Whiteout** magazine (Trace scrub weird pay) · **Static** magazine (local jam escape). |
| **Negotiation** | Interest **6** · Patience **3** · Impression 1 · **Drive:** Hands Off / Signal — scrub Trace, Soft favor, or SIN forget for **~¥2k + weird** · **Pitfall:** corp ¥ matching; painting MER Blacklight; forcing a meat fight in the aisle |
| **Combat posture / retreat** | Avoids meat fight; spoof / scrub / static escape. **Retreat trigger:** any sustained meat pressure or fire damage → inert threat awareness → jack out / alley static and gone. |
| **Token** | `/workspace/gw-art-refs/deadhead-npcs/nim-token.png` → `modules/draw-steel-ghostwire/assets/tokens/deadhead/nim-token.png` |
| **Encounter use** | Signal path — frequency more than a chair; east **BREAKING NEWS** listen; may never take Iona’s seat. |
| **If attacked** | Overlay Static jam + Disengage; Trace-scrub tease as farewell weird; body goes soft/inert narrative if dropped — **fire** is the permanent threat (RAW). Not a boss. |

**Abilities / features:**

1. **Tough But Withered / Bloodless** (feature) — Ancestry RAW as above; Director applies inert rules if Stamina hits negative winded.
2. **Soft Frequency** (maneuver · social / Wire) — While Overlay or Jacked In: Broadcast/Linked hush to one runner; Persona or Logic + Deception to sell Signal terms (Session Chapters Signal bands). Middle+: weird package tease; High: fuller weird (two of Trace scrub / Soft favor / SIN forget) still ~¥2k band.
3. **Trace Scrub Offer** (procedure · uses Whiteout rules by reference) — If deal closes, Director may run one Whiteout-like scrub on a named host log / crew Trace fiction (Foundry: Director moves Trace / logs by hand). Not a mid-fight Bandwidth Program.
4. **Static Escape** (main or maneuver · Wire) — Connected Overlay/Jacked In: Run **Static** by reference (suppress one enemy device / cam / smartlink / watcher ping for a round; strong result may hit several). Then Disengage and leave via east intersection. Low Wire = soft civic scrape, not live-train Trace.

**Art lock (delivered on token):** androgynous, slim, ash-brown skin, faint cyan memory seams at temples/hand, short uneven black hair, dark eyes with blue-white static rings; oversized graphite hooded raincoat with cyan repair stitching; old single-ear receiver + throat transceiver; insulated shopping bag; uncanny/political.

**Biography / voice:** Soft, sideways. “Two thousand. And we make the train forget you a little.” Goal: move wafer into Hands Off custody / deniability. Secret: may already be listening on the east crawl before the crew arrives.

---

## Concise stat identity (quick ref)

| Buyer | Band | Hook |
|---|---|---|
| **Iona** | L1 Pure Human support · Sta 30 · Pres 2 / Int 2 · Wire Kit Linked · escape/cover | Mama ¥8k courier — not a fighter |
| **Rhen** | L1 Elvani controller · Sta 30 · Pres 3 / Int 2 · Corp Glamor · Graceful Retreat | Corp ~¥14k — withdraw + call security, no heavy weapon |
| **Nim** | L1 Revenant controller · Sta 30 · Reason 3 / Int 2 · Overlay tools · inert RAW · Whiteout/Static by ref | Signal ~¥2k+weird — spoof/scrub/static escape; avoids meat |

---

*End of push checklist. No Foundry/repo push in this prep turn.*
