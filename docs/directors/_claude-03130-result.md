# 0.3.130 — Result

**PR:** _(URL added below after creation)_
**Branch:** `cursor/feat-03130-medic-drone-fx-ae-687e`
**Base:** `main` @ `9af4e12` (0.3.129)
**Version:** `0.3.130` (`module.json`, README Status)

---

## What Landed

### A. Medic Reagents ≥1

- **First Aid, Administer Dose, Diagnose:** `system.resource` set to **1** (minimum base Reagent cost). Preserves existing optional enhancement spends (the +2 increments).
- **Field Synthesis** stays at `resource: 0` — intentional exception, explicitly carved out in the Reagents feature prose.
- **Cutter's Reflex:** `system.resource` set to **1** — structured cost, not prose-only.
- **Nano-Adrenal Auto-Injector:** scripted choice dialog: **30 Reagents** (deducted from `system.hero.primary.value`) **OR −1 Body Integrity** (deducted from `flags.draw-steel-ghostwire.integrity.value`). Both paths post a chat message naming what was spent. ✅ Fully wired.
- **Administer Dose:** **Stimulant vs Toxin** prompt dialog before the roll card opens. Player chooses compound type; choice is flagged on the chat message for downstream reference.
- **Emergency Priority** waiver unchanged (still waives one ability's Reagent cost per session).
- **Reagents feature prose** updated: "Every heroic ability, every signature ability, and every signature enhancement spends Reagents (Field Synthesis is the one exception — it costs 0)."
- **Renn pregen** updated with resource: 1 on First Aid, Administer Dose, Diagnose.

### B. Field Triage (2 Reagents)

- **Patch Up replaced** with **Field Triage** in-place (same `_id: pJY4ybZUtkH9HDxy`).
- `_dsid: "field-triage"`, `type: "maneuver"`, **`system.resource: 2`** ✅
- Distance: Ranged 2 (10 ft). Target: up to 3 allies.
- Effect: each marked ally may spend a Recovery as a free triggered action once before end of caster's next turn.
- All 9 pregens updated (Renn + 8 non-Medics).
- `DEFAULT_ITEM_SWAPS` comment updated (Heal → Field Triage).
- Lang keys: `GHOSTWIRE.Abilities.FieldTriage.*`

**Field Triage cost confirmation: `system.resource === 2`** ✅

### C. Rigged Fire — Platform Gate + Platform Ammo

- Before the roll card opens for Rigged Fire (`_dsid: "rigged-fire"`), the code checks for a **connected drone** (deployed machine Actor with `kind: "drone"` and `ownerUuid` matching the hero) or a **vehicle with turret** (deployed machine Actor with `kind: "vehicle"` and turret mod or guns).
- **No platform → clear refusal** ("has no connected drone or vehicle with turret"), roll card never opens.
- **Platform found:** picks the fullest gun on the platform; debits **platform's magazine**, not hero belt.
- **Empty platform magazine → refusal** before the roll card.
- **Deployed machines with guns auto-stamp** full Standard Rounds (`createActor` hook).

### C2. Reload for Everyone

- Reload chooser now lists the hero's worn/held guns **and** eligible drone and vehicle turret guns from deployed platforms.
- Selecting a platform gun tops its magazine from the **hero's inventory rounds** (same as hero gun reload).
- Refuses clearly when no eligible gun/drone/turret or out of rounds.

### D. AE add → upgrade (22 skill-edge packs)

- 22 `"type": "add"` on `system.skills.modifiers.*.edges` flipped to `"type": "upgrade"` across 15 source files (origins, chrome, mods, classes, bestiary, pregens).
- Armor/shield stamina band AEs stay `add` (always-present schema numbers that must stack).

### E. stamina.mjs: change.mode → change.type

- `staminaSources()` in `scripts/stamina.mjs` now reads only `change.type === "upgrade"`, dropping the deprecated `change.mode` fallback.
- Removes #mode deprecation spam on every Hero sheet open in Foundry 14.

### F. AA/JB2A onboard + PIXI teardown harden

- **PIXI teardown hardened:** live ticker callbacks tracked in a `Set`. Force-removed on `canvasTearDown`, `canvasReady`, and `deleteCombat`. Frame callbacks guard against destroyed `PIXI.Graphics` objects and missing `canvas.app.ticker`.
- **No hard dependency** on Automated Animations, JB2A, Sequencer, or ds-aa-bridge.
- Built-in PIXI + module SFX path unchanged; optional Sequencer upgrade path still present.

**Michael can disable after smoke:** Sequencer, JB2A, Automated Animations, and ds-aa-bridge are all optional. The idle CTD suspect (leaked tickers) is hardened; if CTD recurs, the next bisect is Sequencer on vs off.

---

## Deviations

None. All six locks (A–F including C2) landed.

---

## Nano-Adrenal Outcome

**Fully wired.** The choice dialog presents both options (30 Reagents / −1 Body Integrity) and deducts the chosen payment. The Reagent path refuses if the hero has fewer than 30. The BI path refuses if BI is 0. Both paths post a chat message.
