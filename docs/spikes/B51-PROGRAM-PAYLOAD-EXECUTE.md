# Spike B51 — Program / payload execute

**Status:** **B51 built 0.1.76 + B51b (Craft magazines) built 0.1.77 + B51c (Connected gate) built 0.1.86 — pending Michael Foundry-verify.** Not committed. B51b supersedes the 0.1.76 inventory-fire behaviour below (see "As built — B51b" at the end).
Code: `scripts/payload-use.mjs` · templates: `scripts/data/payload-use-templates.json` · strings: `GHOSTWIRE.PayloadUse.*` in `lang/en.json`.
Director note: `docs/directors/payload-use-abilities.md` (twin of B49's `equipment-use-abilities.md`).

## Original design (B20c/B20d)
- Decks = hosts with modSlots; programs/payloads install as mods.
- **Suite programs** (Reader, Guardian, Sneak, Skeleton, …): Activate/Deactivate toggle; software AE + optional edgeAbilities on Matrix Verb _dsids. Not meant as separate "cast Program" actions.
- **Payloads** (Zap, Crash, …): consumable; "loaded until fired" — **no Run/Fire ability** (same gap B49 fixed for weapons).
- Matrix Verbs already exist as abilities under src/packs/abilities/matrix-verbs/.

---

## As built (0.1.76)

### Scope
- **Payloads only**: `type === "treasure"` **and** `flags.draw-steel-ghostwire.matrix.role === "payload"`.
  That is exactly the six in `src/packs/matrix/payloads/` (Zap, Crash, Ghostload, Static, Blackout, Wraith).
- **Suites / autosofts are out of scope** and untouched: they carry a `mod` flag, not role `payload`, and stay
  Activate/Deactivate in `scripts/mods.mjs`. Reader, Guardian, etc. get **no** Run ability.
- Payloads carry no `mod` flag, so they are plain inventory — they arm when they are on the sheet, not on
  "install". (The deck-slot load is a downtime Project in the rules text, not a sheet mechanic.)
- No pack source edited, so no pack rebuild.

### Ability shape
Matched to the Hacker's own Wired abilities (`src/packs/classes/hacker/abilities/*`), not invented:

| Field | Value | Why |
|---|---|---|
| name | `Run {Payload}` (`GHOSTWIRE.PayloadUse.AbilityName`) | |
| type | `main` | spec |
| keywords | `ranged`, `wired` | same as Kill Switch / Seize Control |
| category | `""` | not a signature/heroic; no resource |
| power roll | `@chr` over **reason** | The Wire: "Programs' Power Rolls (rolled with Logic)" — Logic is DS Reason, and Hacker abilities roll Reason |
| distance | `special` (deck Reach); Wraith is `self` | Hacker convention |
| target | Zap: 1 creature; Wraith: self; others special with custom text | |
| img | the payload's img | |
| `_dsid` | `payload-use-{payload _dsid}` | |

Because the keyword is `wired`, the existing `patchWiredAbilities` wrapper applies (Hacking skill edge,
Jacked-In edge, installed-program `softwareEdges`) and **B40's `wired` SFX rule** matches by keyword.

### Effects (template map, keyed by payload `_dsid`)
Stubs derived from the catalog Effect lines; tier text in `lang/en.json` under
`GHOSTWIRE.PayloadUse.Payloads.<Name>`:

| Payload | Effect type | Tiers (low / mid / high) |
|---|---|---|
| **Zap** | `damage`, untyped (biofeedback) | 2 / 5 / 7 **+ Reason** (DS echelon-1 signature ladder). Before-note: Wired targets only |
| **Crash** | `other` | edge to breach · ICE disabled to end of next turn (or double edge) · ICE disabled for the encounter |
| **Ghostload** | `other` | trap: Biofeedback Value damage · + Alert 1 · + Alert 2 and undetectable |
| **Static** | `other` | 1 device suppressed to start of next turn · to end of next turn · 2 devices to end of next turn |
| **Blackout** | `other` | 1 host hard-locked to end of next turn · small network crashed to end of next turn · for the encounter |
| **Wraith** | `other`, self | next host-seizure attempt: edge · double edge · double edge and no Alert rise |
| *unknown payload* | no roll (`generic`) | ability still posts `abilityUse`; card carries the payload's own description |

### Lifecycle (mirrors B49)
| Event | Behaviour |
|---|---|
| Payload added to a **hero** (`createItem`) | Spawns Run ability; payload gets `flags.draw-steel-ghostwire.useAbilityId`, ability gets `fromPayloadId` (+ `fromPayloadUuid`) |
| Payload deleted (`deleteItem`) | Linked Run ability deleted |
| Same payload added twice / sync re-run | Guarded by the link flag and a `fromPayloadId` scan — no double-spawn |
| Actor imported whole (`createActor`) | Synced (embedded items don't fire `createItem`) |
| World load (`ready`) | Syncs every hero: arms unarmed payloads, deletes orphan Run abilities. Runs on **one** client per actor (active GM, else lowest-id active owner) so two owners online can't both spawn |

Flag pair is deliberately separate from B49's `fromGearId`, so the weapon sync never sees Run abilities and
vice versa. (`useAbilityId` on the source item is shared naming — an item can't be both a weapon and a payload.)

### Consumption
`AbilityModel#use` is wrapped (outermost, after `patchWiredAbilities`) for abilities with `fromPayloadId`:
- quantity ≤ 0 → warning "{Payload} is spent", no dialog, no chat, no SFX.
- successful use (a chat message was created) → `system.quantity - 1` and an info toast.
- cancelled dialog / Wired-state refusal → nothing spent.

**Deliberate deviation from the brief:** at quantity 1 the payload goes to **0, it is not deleted**. Deleting
it would delete the Run ability the chat card's `abilityUuid` (and tier-result parts) still point at, which
risks broken result/damage buttons on the card. The spent chip stays in inventory; the player deletes it (Run
goes with it) or bumps quantity to reload. Auto-delete is a follow-on if Michael wants it (e.g. delete on the
next `ready`, once the card is history).

### Foundry test checklist (Michael)
1. **Add Zap** to a hero from the Matrix compendium → "Run Zap" appears under Main actions, img = chip, keywords Ranged/Wired, rolls Reason.
2. **Use Run Zap** with a target → roll dialog, chat card with 2+R / 5+R / 7+R damage; **B40 plays the wired sound** (`CONFIG.debug.ghostwireSfx = true` should log `Run Zap -> wired`).
3. After use, Zap quantity 1 → **0**; toast "… Zap — 0 left". Use again → warning "Zap is spent", nothing posted.
4. Set quantity back to 2 → Run works again, goes to 1.
5. Cancel the roll dialog → quantity unchanged.
6. **Delete Zap** → Run Zap disappears. No orphan left.
7. Drag Zap on twice → either it stacks (quantity 2, one Run) or you get two items with one Run each; never two Runs for one item. Delete one → only its ability goes.
8. Add Crash / Ghostload / Static / Blackout / Wraith → each gets Run with its tier text; Wraith is Self.
9. **Reload the world** with a payload already on a sheet whose Run ability was deleted by hand → Run comes back on `ready`; console `payload Run abilities: +1 / -0`.
10. Drag a pregen/actor holding a payload in from a compendium → Run present.
11. **Reader / Guardian** (suite programs) on a hero → **no** Run ability; Activate/Deactivate unchanged.
12. Weapons (B49) still arm; Fire Chatterbox still works.
13. Jacked In + Hacking skill → Run gets the Wired edges like other Wired abilities.

### Open questions for Michael
1. Tier stubs for Crash/Ghostload/Static/Blackout/Wraith are my reading of one-line catalog Effects — tune in `lang/en.json`.
2. Zap damage 2/5/7+R is the DS echelon-1 ladder; should it scale with deck **Integrity Damage Bonus** or be Track-2 (Integrity) damage instead of Stamina?
3. Consume-to-0 vs auto-delete (see above).
4. Should Run be gated on owning a deck / being Connected? Currently it isn't — any hero holding the chip can fire it.

## Out of scope
Deck "Run…" picker UI; suite program Run abilities; Technomancer sprite compile (separate spike).


## Design lock — Craft magazine load (2026-09-17, Michael)

**Option A + Craft-tier magazine** (working rules; Foundry automation later).

### Intent
Payloads stay **one loaded kind per deck slot**, but that load is a **magazine**. The downtime **Craft (Hacking) Project** that loads the payload into a free deck slot does not merely succeed/fail at "1 fire" — **the Project power-roll tier sets quantity (fires)** in that slot.

### Loop
1. Hero has payload chip(s) + a free deck modSlot (shared pool with suite programs).
2. Downtime: Craft (Hacking) Project to load that payload type into the slot.
3. On Project completion, slot holds one loaded payload instance; **quantity = fires from tier**.
4. Run spends 1 quantity per successful fire (B51). At 0, load is spent and the slot frees (or spent chip cleared — match B51 consume UX).
5. Better Craft → more fires in the **same** single slot. Inventory spares are raw chips until loaded.

### Provisional tier → quantity (Street / E1 feel; tunable)
| Project result | Fires (quantity) |
|---|---|
| Low | 1 |
| Mid | 3 |
| High | 5 |

Optional later caps: per-payload magazineMax, or min(tierQty, deck.modSlots + payload.echelon), so Fairlight + hot Craft does not go infinite.

### Still locked from option A
- Buff **mid-tier Run effects** so the catalog Effect is the middle promise (separate lang pass / B51b).
- Suites unchanged (Activate/Deactivate, no Run).
- Payloads do not get separate payloadSlots in this lock (still share deck modSlots).

### Not automated in 0.1.76
B51 ships inventory Run + quantity spend only. **Automated in 0.1.77 (B51b), see below.**

### Open (non-blocking)
- Fail/abandon Project: refund chips vs partial burn.
- Field top-off without a new Project: no, unless a later "short reload" rule.
- Zap Integrity vs Stamina; deck/Connected gate on Run.

## Wire software doctrine (locked 2026-09-17)

Suites = utility/defense (no Run). Payloads = offensive Craft magazines. Standing SoR: `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md`. Future builds must keep this split.

---

## As built — B51b (0.1.77): Craft magazines

### Rules / docs (SoR)
| File | Change |
|---|---|
| `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §4C | Intro rewritten as the magazine rule (shared slots with §4B, one kind per slot, Craft (Hacking) load, tier → fires 1/3/5, recompile, Run spends 1, tier 2 = catalog Effect). Table column now "Effect (tier-2 Run; magazine occupies 1 shared deck slot)". Static Effect gains "a strong run hits several". Category 4 ruling (2) mentions shared slots. |
| `docs/raw/21-the-wire.md` | New section **Deck software: suites vs payloads** (suites = utility/defense, no Run; payloads = offensive magazines; Craft roll = Logic/Reason + Hacking edge; low/mid/high → 1/3/5; recompile replaces; Run spends 1; 0 frees the slot). Sources line cites the doctrine + gear master. |
| `docs/raw/10-mods.md` | Deck/RCC host row + "Matrix payloads" bullet (consumable mods that *fill* a slot as a magazine; the "Consumables never have mod slots" rule still holds). |
| `docs/rulebook/14-mods.md` | Same bullet/host row (Stage-3 mirror) + Foundry line for 0.1.77 + Related link to the Wire RAW. |
| `lang/en.json` `GHOSTWIRE.Matrix.Items.*` | All six payload blurbs: "stays loaded until fired" → Craft magazine + tier fires language. |
| Rulebook journals | `node tools/raw-to-journals.mjs` → `src/packs/rulebook/` (21-the-wire, 10-mods), then `node tools/build-packs.mjs`. |

### Foundry
**Payloads are deck mods.** All six `src/packs/matrix/payloads/*.json` now carry
`flags.draw-steel-ghostwire.mod = { slotCost: 1, hosts: ["deck"], host: "deck", craftSkill: ["hacking"], magazine: true }`
(matrix `role: "payload"` and `consumable: true` kept). Kessic Draye's pregen Crash chip too (only that diff kept from a
`tools/pregens-to-actors.mjs` run; see Notes). World chips that predate this get the flag backfilled on first Load.

**Run is gated on a loaded magazine.** The Run ability exists only while the payload is installed on a deck
(`mod.installedOn` → a deck host). A loose chip has no Run. Sync runs on `createItem`, `deleteItem`, `createActor`,
`ready`, and `updateItem` when the `mod` flag changes (install / uninstall / deck deleted). The `use()` wrapper also
refuses a Run whose payload is unloaded ("isn't loaded") or at 0 ("spent").

**Quantity semantics.** Loose chip: quantity = chips. Loaded magazine: quantity = fires.

**Load magazine (Craft)…** (hero sheet, right-click an *unloaded* payload with quantity ≥ 1):
1. Pick the deck: decks on the same actor that pass `canInstall` (free slot, deck family). One → used directly; several → dialog with "used / max"; none → warning (no deck vs every deck full).
2. Power roll: `actor.system.rollCharacteristic("reason", { edges: Hacking ? 1 : 0 })`, the system's normal test dialog and card (skill picker off, since Hacking is applied as the Wired-convention edge, not a skill bonus). Cancel → nothing changes.
3. Tier → fires **1 / 3 / 5** (`MAGAZINE_FIRES`), then `installMod(payload, deck, { "system.quantity": fires })`, active true, in one update. If the install fails nothing about the chip changes.
4. **Stacks:** if the chip stack had quantity > 1, this item becomes the magazine and the rest are re-created as a loose stack (quantity − 1).
5. Toast + a chat line: "{actor} compiles {payload} into {deck} (Tier N): X fire(s) loaded."

**Recompile magazine (Craft)…** (right-click a *loaded* payload): same roll against its deck; the new tier **replaces** quantity. Downtime only, by rule.

**Generic Install onto… and Activate/Deactivate are hidden for magazines** (`mod.magazine`), so a payload can't dodge the Craft roll. **Uninstall mod** still shows; if fires remain it asks to confirm ("dumps its N remaining fire(s)").

**Consumption.** A successful Run spends 1 and toasts "{n} fire(s) left". At 0 the Run ability is flagged `spentMagazine` and the magazine is **uninstalled at once** (slot frees). The flagged ability is kept (the chat card's `abilityUuid` stays valid for this session), refuses to fire, and is removed on the next `ready` sync, or reused if the chip is loaded again first. The chip stays at quantity 0 until deleted.

**Unloading dumps fires.** Any unload of a magazine with fires left (Uninstall, or its deck deleted) sets its quantity to 0 ("… fires are dumped"). Otherwise a pulled High magazine (5) would read as 5 loose chips. A chip at 0 cannot be loaded ("no chip left").

**Run tiers (tier 2 = catalog Effect).** Crash / Ghostload / Blackout / Wraith tier 2 already matched their catalog Effect. **Static buffed:** T1 one device to start of your next turn · T2 one device to end of your next turn + a second to start of your next turn · T3 up to three devices to end of your next turn (target text "1 or more enemy devices"). Zap stays 2 / 5 / 7 + R untyped (Integrity rework out of scope).

**Weapons (B49) and suites untouched.** Suites keep Install/Activate/Deactivate and get no Run.

### Code
- `scripts/payload-use.mjs` — magazine gate, `loadMagazine`, deck picker, Craft roll, stack split, dump-on-unload, spent flag, context menu.
- `scripts/mods.mjs` — `isMagazine`; Install/Activate/Deactivate hidden for magazines; Uninstall confirm when fires remain; `installMod(mod, host, changes)` writes the quantity in the same update.
- `lang/en.json` — `GHOSTWIRE.PayloadUse.{Menu,Load,NotLoaded,Dumped,…}`, `GHOSTWIRE.Mods.Install.UnloadMagazine`, Static tiers, payload blurbs.
- `module.json` 0.1.77.

### Notes / deviations
- **Hacking = edge, not skill bonus**, matching every other Wired roll (Matrix Verbs, Wired abilities). If Craft should use DS's skill bonus instead, change `rollCraft` to pass `skills` through.
- **Not a DS Project document.** Load is a single power roll standing in for the Project's result; no project points / goal tracking. A DS crafting Project that yields a payload stacks its chips by `_dsid` onto the *first* matching item, which could be a loaded magazine (adding fires). Edge case; not handled.
- **Spent chip is not reloadable.** Loading consumes a chip; a quantity-0 chip is junk (delete it). Bump its quantity to represent buying a new chip.
- `tools/pregens-to-actors.mjs` is out of sync with hand edits: a full run drops Wren's `changer.hybridArt` and changes Vira. Those two regenerated files were reverted; only Kessic's payload flag was kept.

### Foundry test checklist — B51b (Michael)
1. Add **Zap** from the Matrix compendium to a hero who owns a **Street Deck** → **no** Run Zap. Right-click Zap → **Load magazine (Craft)…** shows; **Install onto…** / Activate do not.
2. Load → (one deck, so no picker) Reason roll dialog titled "Craft (Hacking): Zap magazine → Street Deck"; with Hacking the dialog shows 1 edge. Roll → chat test card + "compiles Zap into Street Deck (Tier N): X fire(s)". Zap quantity = 1 / 3 / 5 by tier; deck "Mod slots 1 / 2"; **Run Zap** appears.
3. Cancel the roll dialog → Zap unchanged, still loose, no Run.
4. Run Zap with a target → 2/5/7 + R card, wired SFX; quantity − 1, toast "N fire(s) left".
5. Run until 0 → toast "0 left"; Zap uninstalls (deck "Mod slots 0 / 2"); Run Zap stays on the sheet but using it warns "spent". The chat card's result/damage buttons still work. Reload the world → the spent Run is gone.
6. Zap at quantity 0 → Load → warning "no chip left". Set quantity 1 → Load works again.
7. Stack: set a loose Zap to quantity 3 → Load → one Zap item loaded (quantity = fires), a second Zap item loose with quantity 2.
8. Fill the deck (Sneak + a Crash magazine) → Load Static → "every deck this hero owns is full". No deck at all → "owns none".
9. Two decks → Load shows a deck picker with used / max.
10. Loaded magazine → **Recompile magazine (Craft)…** → re-roll, quantity replaced.
11. Loaded magazine with fires → **Uninstall mod** → confirm dialog; Cancel → nothing; OK → slot frees, quantity 0, toast "fires are dumped", Run gone.
12. Delete the deck under a loaded magazine → magazine unloads, fires dumped, Run gone.
13. Static Run card shows the buffed tier text. Crash / Ghostload / Blackout / Wraith cards unchanged.
14. **Reader / Sneak** still Install onto… / Activate / Deactivate, no Run. Weapons (B49) still get Fire.
15. Drag **Kessic Draye** in from Pregens → Crash is loose (no Run) until loaded.
16. A world chip from 0.1.76 (no mod flag) → its old inventory Run is removed on `ready`; Load backfills the flag and installs.
17. Rulebook → The Wire → **Deck software: suites vs payloads** page renders (tables OK); the Mods chapter shows the payload bullet.

## As built — B51c (0.1.86): Connected gate

**Lock (Michael 2026-09-18).** Run {Payload} needs the hero **Connected** (full): Overlay or Jacked In. **Linked does not count** (0.3.56): Linked is comms-only, same refusal as Disconnected. Zap stays as is (Stamina biofeedback 2/5/7 + Reason): no Integrity retarget, no deck Integrity Damage Bonus scaling, no auto-delete of spent chips.

### Code
- `scripts/payload-use.mjs` — `registerPayloadUse({ getWiredState })` keeps the function, like `registerWiredConsole` / `registerWiredMinimap`. The `AbilityModel#use` wrapper checks spent, then loaded, then Connected, before the system roll. Not Connected → warning `GHOSTWIRE.PayloadUse.NotConnected`, returns null. Nothing is spent and the magazine stays loaded.
- `scripts/module.mjs` — passes `getWiredState` into `registerPayloadUse`.
- `lang/en.json` — `GHOSTWIRE.PayloadUse.NotConnected`.
- `module.json` 0.1.86.

### Notes
- The Run ability is **not** removed on Disconnect. It stays on the sheet (the Director can still see it) and only the use is refused, so going Connected / Disconnected does not add and remove items.
- The gate sits only on payload Runs (abilities with the payload source flag). Other abilities are untouched.

### Foundry test checklist — B51c (Michael)
1. Hero with a loaded Zap, status **Disconnected** → Run Zap → warning "… isn't Connected …", no roll dialog, no chat card, quantity unchanged.
2. Set **Overlay** → Run Zap → works as in B51b (roll, 2/5/7 + R card, Wired SFX, 1 fire spent). Repeat with **Jacked In**.
3. Mid-fight, go **Disconnected** → next Run refuses; magazine still loaded (deck slot used, quantity unchanged). Connect again → Run works.
4. A spent Run (0 fires) still warns "spent" (spent check runs first); an unloaded chip still has no Run.
5. Weapons (B49 Fire) and other abilities run while Disconnected, as before.
