# Spike B104 — Deadhead Foundry run pack

**Date:** 2026-09-19  
**Module:** **0.3.33** (SoR + empty pack scaffold) · **0.3.36** (Gold Line map pack — B106)  
**Status:** **SoR LOCKED** — Gold Line plates + Scene inject + map-notes journal shipped (B106). Remaining journals / items / other scenes still to build.  
**Journals (rulebook / lore / handbook / flats / pregen-fiction):** **not** regenerated.  
**Pairs with:** `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`, B39 Run Generator world folder, B99 Mama’s Club map, **B106 Gold Line map pack**.

## Goal

Ship the Deadhead playtest as Foundry content **later**, under one pack folder so every Deadhead journal, item, and scene can be referenced from the same place.

This bump only:

1. Checks in the Director SoR (verbatim from the locked markdown).
2. Scaffolds Compendium **Ghostwire Runs** with an empty intra-pack folder **Deadhead**.
3. Records the page / item / scene build list so the content pass does not invent rules.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Director SoR | `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` | **Edit here.** Pay, wipe/stop, Trace 0–12, beats 0–5, consist, items, opposition. |
| Pointer | `docs/directors/runs/deadhead/README.md` | One-paragraph path to the SoR + this pack. |
| Pack source | `src/packs/runs/deadhead/_folder.json` | Intra-pack Folder **Deadhead**. Add JournalEntry JSON here when shipping. |
| LevelDB | `packs/runs` | Compiled by `node tools/build-packs.mjs runs`. Close Foundry first. Do not hand-edit. |

Do **not** treat the B39 world folder **Ghostwire Runs** as this pack. That folder is created at runtime (`flags.draw-steel-ghostwire.runsFolder`) for pinch-run journals from the Run Generator. Deadhead lives in the **module compendium**.

## Pack wiring (this bump — matches existing journal-pack convention)

The module already ships JournalEntry packs (`rulebook`, `lore`, `wired-flats`, `reach-handbook`, `pregen-fiction`) and a single `packFolders` bucket **Ghostwire** (`#00E5FF`) that lists every pack id. Nested `packFolders` named **Ghostwire Runs** → **Deadhead** would **not** match that convention (`packFolders` groups packs, not intra-pack folders; **Deadhead** is not a pack).

Wired instead:

| Field | Value |
|---|---|
| `name` | `runs` |
| `label` | `GHOSTWIRE.COMPENDIUM.runs` → **Ghostwire Runs** |
| `type` | `JournalEntry` |
| `path` | `packs/runs` |
| `system` | `draw-steel` |
| Ownership | `PLAYER: NONE`, `ASSISTANT: OWNER` (Director spoilers: wipe rule, car, Trace ladder) |
| `packFolders` | Add `"runs"` to the existing **Ghostwire** `packs[]` list — no nested folder |
| Intra-pack folder | `src/packs/runs/deadhead/_folder.json` → name **Deadhead** (`GHOSTWIRE.Runs.Folders.Deadhead`) |

Rebuild: `node tools/build-packs.mjs runs` (Foundry closed). Lang keys resolve at build time.

Empty-folder-only is intentional. Do not add stub journal pages until the content pass.

## Journal pages (content pass — do not invent)

One Journal Entry in folder **Deadhead** (or one journal per group if a mega-page gets unwieldy). Pages, in order, from the SoR:

| Page | SoR section |
|---|---|
| Overview | Logline, pay table, hard rules, cast & kit, consist |
| Trace 1 | Stir — cam / HUD tick |
| Trace 2 | Stir — maglock LED |
| Trace 3 | Stir — passenger PA glitch |
| Trace 4 | Stir — Watchdog stirs |
| Trace 5 | Malice — heat / meat Alert may wake |
| Trace 6 | Malice — ICE spooling; telegraph monitors |
| Trace 7 | Malice — **ICE call-home window opens** |
| Trace 8 | Malice — call-home fires if unresolved |
| Trace 9 | Hunting — auto-stop risk; Wire bane |
| Trace 10 | Hunting — Lt / lock doors |
| Trace 11 | Hunting — one step from lockout |
| Trace 12 | Lockout — forced stop; wipe if nested; reset track to 6 |
| Beat 0 | Hangout + Mama wafer + discovery + call Nox |
| Beat 1 | Canyon drone sling board |
| Beat 2 | Passenger → security crawl / search |
| Beat 3 | Wire + capsule crack; call-home ~7–8 |
| Beat 4 | Wafer-out clock + roof Recall bail |
| Beat 5 | Return + moral choice |
| Items | Mama’s Brief + ARG capsule / live wafer |
| Opposition | Cams, Enforcers, Security, Lt, Watchdog ICE |
| Foundry checklist | Build list from the SoR (scenes, tokens, Console preset, Wire ping/spoof backlog) |

Also keep Overview (or a short Trace 0 page) stating the **+1 Trace max per round** cap, bands (quiet 0 / stir 1–4 / malice 5–8 / hunting 9–11 / lockout 12), and what does **not** raise Trace.

Prefer a generator (`tools/deadhead-to-journals.mjs`) that reads the SoR markdown the same way B42b / B46 do, so the md stays single source of truth. 16-char alphanumeric `_id`s. Lang keys for journal / page names.

## Items (content pass)

Ship as `type: "treasure"` in **Ghostwire Gear** (`src/packs/gear/…`), then `@UUID` them from the Deadhead Items page. Do **not** invent a second Item pack.

| Item | Notes from SoR |
|---|---|
| Mama’s Deadhead Brief (Gold Line) | Data wafer / portable gear. ~¥50; worthless to fence (Mama-marked). Baseline: job, pay, wipe-if-stop-while-nested, ARG, Nox borrow, 5-car Gold Line **without** naming the capsule car. **Not** on the wafer: exact car; R2–3 / R3 Watchdog; +1 Trace / 2 rounds wafer-out; full faction doors until discovery D. |
| ARG courier capsule / live wafer | Plothook notes for the three buyers (Mama / corp / Signal). Wipe if the train stops while the live wafer is still in the capsule. |

Placeholder `icons/` art is fine until an item-art pass. **Do not generate art in the content PR unless Michael drops files.**

## Scenes (content pass)

There is **no** Scene pack in this module (B72 / B99 / B100 drop files onto world Scenes; they are not auto-created). Do **not** invent a Scene compendium for Deadhead.

| Scene | Notes |
|---|---|
| Crew hangout | Rundown flat, wrecked bad neighborhood |
| Mama’s Club | **Reuse** B99 (`assets/maps/battlemaps/mama-cassavir-club.webp` / `-loop.webm`) |
| Canyon approach / drone sling strip | Board beat; garbage-truck-sized trash freighter |
| Gold Line (dual Hammerhead) | **SHIPPED 0.3.36 (B106).** World inject **Scenes → Deadhead → Gold Line**. Interior loop `assets/maps/battlemaps/gold-line/map-gold-line-interior-loop.webm` (fallback still). Roofs overhead `map-gold-line-roofs-loop.webm`, Surface occlusion. Grid 208 / 5 ft, 6472×958. Beat remap L1 tail → R3 cab in the SoR + **Gold Line — Map Notes** journal. CyberMaps stitch only — do not drop a generated train. |

Art locks when maps ship: flat top-down; no people on maps; no baked grid; ARG uniform stylization reusable.

## Tokens / Console (content pass)

- ARG Corp Security, Response Lieutenant (+ Enforcers); Nox freight-drone token.
- Wired Console board preset on the train Scene (Track 1 cams/doors R2–3; Track 2 capsule lock R3 + Watchdog ICE; Trace Alert 0–12).
- **Backlog:** Console **Wire ping/spoof** for the call-home telegraph (narrate or chat at Trace 6–7 until that ships).

## Design locks (must stay identical to the SoR)

- Pay: Mama **¥8,000** / corp **¥14,000** / Signal **¥2,000 + weird**. Discovery = **intel only** (no cash bonuses). Half base only if the prize was wiped/lost.
- Wipe if the train **stops while the live wafer is still inside its carry capsule**. After extract the train **will** stop. Bail before ARG response. No intentional early emergency stop while nested.
- Trace **+1 max per round**; full ladder **1–12** (track 0–12). ICE call-home ~**7–8**; **Block success → Trace −1**. Failed / unmonitored call-home does **not** auto +1 Trace.
- ARG uniforms; **Nox** garbage-truck freighter; **5 cars, 20 ft**; exact car only on **great success** in discovery.
- **No rival twist** (v1 clean heist). **4h** clock, beats **0–5**.
- L1 Hacker / Technomancer do **not** ship a class “Trace −1” button. Deadhead’s call-home **Block** is the scenario Trace −1. **Do not invent Trace −1 class abilities.**

## Out of scope (this PR and the content pass)

- Art generation (splash, tokens, maps). **B106 shipped the locked CyberMaps Hammerhead plates** — do not regenerate a train.
- Trace −1 (or any new) Hacker / Technomancer class abilities.
- Regenerating rulebook / lore / handbook / flats / pregen-fiction journals.
- Changing B39 Run Generator tables or the world **Ghostwire Runs** folder.
- Scene JSON / walls / lighting / Console preset (content pass).
- Wire ping/spoof implementation (separate Console backlog).

## Done when (content pass)

- Compendium **Ghostwire Runs** → **Deadhead** shows Overview, Trace 1–12, Beats 0–5, Items, Opposition, Foundry checklist.
- Both wafers exist as Gear items and are linked from the Items page.
- Four scenes listed above exist in the world (Mama reused; **Gold Line injected 0.3.36**); pack journal points at them.
- Design locks above match the SoR verbatim (¥ / wipe / Trace cap / ARG / Nox / 5×20 ft / no twist / 4h / ping-spoof mention).
- No new class abilities. No unrelated journal regen. One module patch.

## Michael checklist

1. SoR opens at `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md`.
2. Compendium **Ghostwire Runs** appears under the **Ghostwire** pack folder; players cannot see it; folder **Deadhead** is empty until the content pass.
3. Pay table is Mama ¥8k / corp ¥14k / Signal ¥2k+weird; discovery intel-only.
4. Wipe-if-stop-while-nested and post-extract stop are both written.
5. Trace +1/round cap + call-home ~7–8 (block → Trace −1) present; no L1 class Trace −1 invented.
6. Art not generated in the SoR/scaffold PR.
