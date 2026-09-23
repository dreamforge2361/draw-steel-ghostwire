# Rigger vertical smoke — 0.3.106 (Machine sheet hot-fix)

**Lock:** Michael 2026-09-23 morning smoke on 0.3.105. Four defects: dead tabs, Save always failing, stock NPC sheet winning, Fleet refuse never firing. Deploy itself was fine and is unchanged.

No pack rebuild in this hot-fix — nothing under `src/packs/` changed. JS / template / CSS / lang only.

## What was actually wrong (Foundry v14 core, verified against `resources/app/client`)

| # | Symptom | Cause |
|---|---------|-------|
| 1 | Tabs dead, stuck on Combat | `ApplicationV2##onClickAction` has a `case "tab"` that routes to `_onClickTab` **before** it looks at `options.actions`. Our `tab` action could never be called. (`eq` is a core helper in v14, so the template was fine.) |
| 2 | Save → "cannot read properties of undefined (reading 'flags')" | `DocumentSheetV2#_processSubmitData(event, form, submitData)` gets an **already-expanded object**. The old code read `formData.object` off it. |
| 3 | Stock NPC sheet opens first | `DrawSteelNPCSheet extends DrawSteelActorSheet extends DSDocumentSheet extends DocumentSheetV2` — **no `ActorSheetV2` in the chain**, so `renderActorSheetV2` never fired and the redirect was dead code. |
| 4 | 4th Deploy allowed at L1 | Vira is a **Drone Jockey**, and Drone Jockey grants **Wide Band at 1st level** (`+2` fleet cap). Her real cap is **5**, so the 4th Deploy was correct — it just never said so. Separately, `wide-band-redoubled` was granting `+4`, which is not in the Wrench master (Redoubled only drops the distance requirement on the whole-swarm Command). |

## Automated

```bash
node tools/rigger-vertical-smoke.mjs
node tools/machine-armor-smoke.mjs
```

Both must print `passed` / `OK`. `rigger-vertical-smoke` now imports `scripts/machines.mjs` under stubs and runs
`fleetSizeCap` / `fieldedMachineCount` / `machineOwner` for real — cap ladder, Wide Band, counting by the
`deployed` flag rather than by a successful UUID resolve, and owner resolution from parent / argument / flag.

`node tools/s8-machines-smoke.mjs` still reports the two pre-existing 0.3.105 base-asset failures (chassis cards
missing Fabricate Project + mod-slot links). Not touched by this hot-fix; it is backlog, not a regression.

## In Foundry

Load the world as GM once after pulling — a one-time sweep stamps `flags.core.sheetClass` on every existing
machine Actor. Console prints `Machine sheet preference stamped on N machine Actor(s)`.

1. **Tabs** — Open a deployed machine. Click every tab: Combat / Control / Build / Inventory / Links / Story.
   Each swaps instantly (no re-render flash), the clicked tab highlights, the panel changes.
2. **Save** — On **Story**, type into Description. Switch to **Combat**, change Integrity. Hit **Save Changes**.
   No error. Re-open: *both* edits are there. (All panels now live in the form, so a Save from any tab writes
   the whole sheet — that was not true in 0.3.105.)
3. **Tags round-trip** — On the header, type `scout, quiet` into Tags, Save, re-open. Still reads `scout, quiet`
   (stored as an array). Change **Kind** and Save: `flags.draw-steel-ghostwire.kind` follows it.
4. **Default sheet** — Deploy a fresh drone. Its Actor opens on **Ghostwire Machine** with no Configure Sheet.
   Same for a vehicle and a base asset (Door Lock / Safehouse Beacon).
5. **Existing machines** — Open Fly / Iron Mantis / Nox's Trash Freighter / Drone (Medium). All open on the
   Ghostwire Machine sheet now, even the ones never configured by hand.
6. **Fleet refuse** — On **Vira (L1 Drone Jockey, Wide Band)** the cap is **5**, not 3. Each Deploy notice now
   ends with `Fleet n / 5`, so the count is visible. Deploy a 6th → refuse + `FleetFull` warning.
   For the base cap-3 path use a Wrench **without** Wide Band (any non-Drone-Jockey subclass): 4th Deploy refuses.
7. **Refuse survives Recall** — Recall one, Deploy again: the freed slot is reusable; the count steps back down.
8. **Header art** — Portrait and Token art are two captioned slots. Click either to open the file picker; the
   portrait writes `img`, the round one writes `prototypeToken.texture.src`.
9. **Director notes** — As a player who owns a machine, the Story tab shows Description only. Saving as that
   player must **not** wipe the Director's Notes. (Notes are `gmOnly`; a player's client never receives them.)
10. **Deploy & Command / Jump-In** — unchanged from 0.3.105. Picker lists owned machines, Command opens a
    fielded Actor, Jump-In deploys then jacks in. Re-run step 4 of the 0.3.105 sheet to confirm no regression.

## Open questions for Michael

- **Is Wide Band's `+2` right at 1st level?** `GHOSTWIRE_WRENCH_DEVELOPMENT_MASTER.md` says yes (line 408), and
  the Drone Jockey subclass grants it at level 1 — so every Drone Jockey starts at cap 5 and the "3 at L1"
  baseline is never observable for that subclass. If the intent was for Wide Band to arrive later, that is a
  content change (advancement level), not a code change.
- **Should base assets count against Fleet Size?** They do today (`machineBand` scaffolds them onto
  `drone-small`). A Facility Rigger's door locks and beacons therefore eat drone slots. Left as-is — changing it
  is a rules call, not a hot-fix.

## Deferred (unchanged from 0.3.105)

- Full drone AI / autonomous turns.
- Parallel Uptime pool UI.
- Token size from scale band.
- ¥ / Integrity numeric pass beyond the E1 base-asset best-shot.
