# F15 — Cyborg System Crisis table (design / publish + Foundry RollTable)

**Status:** READY after 0.3.116 (still HOLD until Michael locks F14/F15/F18 as a set).
**Michael ask (2026-09-23):** design/publish first; separate from F12.
**Michael tweak (2026-09-23 ~1:55 PM ET):** ship as an importable **Foundry RollTable** in the module's **tables** compendium (the existing `encounters` RollTable pack — City / Flats / Wilds live there). Director imports/opens the table in Foundry and rolls it when Crisis triggers.
**Hard cross-link:** F12 living-chrome Suppress/Damaged/Destroyed flags must **never** be reused as the Cyborg's Crisis state. Cascade may *touch* living Chrome via F12 as a side effect of that one severity row only.

## Current RAW holes

- `docs/raw/04-combat.md` § Cyborgs - System Crisis: stub
- `docs/raw/05-ancestries.md` Cyborg hard constraints: stub
- Cyborg BI 25 + living Chrome purchase LOCKED — Crisis does **not** invent a second Integrity track
- Frame Modules deferred — table may mention a future module-cascade hook but must not require Frame Modules

## Lock

**Trigger:** When a **Cyborg** People hero (or Director-flagged full Cyborg NPC) would enter the normal dying / 0 Stamina death spiral, they enter **System Crisis** instead. No organic dying saves.

**While in Crisis:** down / collapsed chassis, not dead. Magic healing does nothing. Tech repair is the recovery path.

### Crisis severity (2d6)

Director opens the **Cyborg System Crisis** RollTable and rolls **2d6** (optional modifiers: −1 Soft/scrapheap fiction; +1 Military/overclocked).

| 2d6 | Severity | Immediate result | Tech recovery |
|---:|---|---|---|
| 2–3 | **Brick** | Chassis locks (unconscious equivalent) until a Repair Project (goal 60, parts ~50% Mid Lifestyle week) or Machine God's Rite / equivalent. Can be carried. | No field reboot |
| 4–5 | **Cascade** | One random installed living Chrome Item escalates one F12 step (max Destroyed), then treat as Limp-Home. No chrome → Limp-Home + bane on reboot. | Limp-Home + address chrome |
| 6–8 | **Limp-Home** | Down until reboot. After: Stamina from Recoveries spent (min 1), speed halved until Respite, bane on tests until Respite or Field Repair. | Reboot now |
| 9–10 | **Soft Reboot** | Down until reboot. After: Stamina from Recoveries; no lasting bane; 1 Recovery spent on reboot. | Ally Maneuver reboot / printed self path |
| 11–12 | **Failover** | Spend 1 Recovery, stand with that Stamina, no aftermath. Once per respite — second Crisis this respite = Limp-Home. | Recovery only |

### Reboot procedure

- Ally (Repair / Medicine / Cybertech or Wrench / Medic): adjacent **Maneuver** + Power Roll → chassis online
- Self-reboot: Soft Reboot / Failover only, if ≥1 Recovery
- Brick: never field-reboots without the Project (or a named ability)

### What Crisis is NOT

- Not organic dying saves
- Not F12 on the Cyborg-as-a-whole
- Not Body Integrity debit
- Not Item deletion (Cascade uses F12 escalate only)

## Ship (this wave)

1. **Foundry RollTable (required):** `src/packs/encounters/cyborg-system-crisis.json` in the existing **encounters** RollTable pack (`module.json` pack label = tables/encounters compendium). Mirror City/Flats/Wilds JSON shape:
   - `formula`: `"2d6"`
   - five `results` with `type: "text"`, `range` matching 2–3 / 4–5 / 6–8 / 9–10 / 11–12, weight 1 each
   - name + description HTML: severity title, immediate result, recovery, Director prompt
   - stable `_id` / `_key` like sibling tables
   - lang key or plain name **Cyborg System Crisis** (player/Director visible)
2. RAW: replace stubs in `04-combat.md` + `05-ancestries.md`; pointer to the Foundry table
3. Director note `docs/directors/f15-cyborg-system-crisis.md` (how to open/roll the table, modifiers, NPC Cyborgs, not-F12)
4. Smoke: assert table exists in encounters pack, formula 2d6, five ranges cover 2–12 with no gaps/overlaps
5. **No** auto-trigger script (`scripts/cyborg-crisis.mjs`) unless Michael opens Foundry automation later — rolling the table is the Foundry support for this wave

## Acceptance

- Director can import/open **Cyborg System Crisis** from the Ghostwire tables/encounters compendium and roll 2d6 in Foundry
- RAW stubs gone; table matches RAW
- Explicit not-F12 language in director note
