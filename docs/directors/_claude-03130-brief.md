# Ghostwire 0.3.130 — Medic reagents / Field Triage / drone ammo / AE upgrade / stamina.type / AA onboard

**HARD RULE:** Claude Code only. No questions. Implement exactly. Open PR; paste URL; do **not** merge.
Path: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\draw-steel-ghostwire`
Branch: `feat/03130-medic-drone-fx-ae` off clean `main` @ **0.3.129** (`9af4e12` / full `9af4e12e6e1beaa96ceddea3f111f8e686c6800e`).
Version bump: **0.3.129 -> 0.3.130**.
Foundry is **CLOSED** — safe to rebuild packs. If `packs/*/MANIFEST-*` / `CURRENT` LevelDB noise blocks git: `git checkout -- packs/; git clean -fd packs/` then rebuild.
No Cursor Cloud Agents. Leave untracked `_claude-*` / `_street-priest-*` / `_elementalist-*` / `_ammo-*` / `_stamina-*` / `_medic-*` / `_03128-*` director scratch alone (do not commit research notes unless you must for the PR; prefer leave untracked).

Ship **ALL** locks A–F (including C2) in one PR. Prefer small coherent commits. After src pack JSON / lang / scripts / `docs/raw` / `docs/rulebook` changes: rebuild touched packs (`node tools/build-packs.mjs .`, and journals/voidmark if raw touched: `node tools/raw-to-journals.mjs`, `node tools/build-voidmark-index.mjs`).
Bump `module.json` (+ any mirrored version fields) to **0.3.130**. Update README Status entry if the project keeps one (no CHANGELOG file).
Write result to `docs/directors/_claude-03130-result.md`. Write/update `docs/directors/03130-smoke.md`.

Start by: confirm `git rev-parse HEAD` starts with `9af4e12`, clean packs if dirty, create/checkout branch from main.

**Cite these research notes (read them; do not invent):**
- `docs/directors/_medic-reagent-spend-audit.md` — free signatures, Field Synthesis exception, Cutter's Reflex / Nano-Adrenal manual spends, Administer Dose prompt gap
- `docs/directors/_03128-gun-ctd-ae-undefined-notes.md` — skill-edge AE `add->upgrade` (~22 packs; Perseverance / Corp Glamor etc.); stamina `change.mode`→`change.type`; idle CTD / PIXI teardown suspects
- Prior FX: `scripts/hit-fx.mjs`, `scripts/sfx.mjs`, `scripts/data/sfx-map.json`, `assets/sfx/*`
- Stamina tooltip / AE apply path: `scripts/stamina.mjs` (or wherever stamina tooltip / AE change apply lives)

---

## A. Medic Reagents ≥1

**Primary:** `src/packs/classes/medic/**`, lang under `GHOSTWIRE.*` / VOIDMARK / class prose, any Medic spend hooks in `scripts/`.

### Locks
1. **first-aid, administer-dose, diagnose:** minimum base Reagent cost **>=1** (``system.resource`` >= 1). Preserve optional enhancement spends where they already exist; do not leave base use free.
2. **administer-dose:** add a **Stimulant vs Toxin** prompt on use (Dialog / choice before apply). Ally/enemy branching prose alone is not enough.
3. **Field Synthesis** stays free (`resource: 0`) — **intentional exception**. Do not force a Reagent cost on it.
4. **Emergency Priority** waiver unchanged (whatever currently waives Reagent spend for that feature stays as-is).
5. **Wire Cutter's Reflex** to actually spend **1 Reagent** (structured cost / hook — not prose-only).
6. **Nano-Adrenal Auto-Injector:** wire **30 Reagents OR −1 Body Integrity** if feasible in current data model; else note clearly in `_claude-03130-result.md` what blocked it and leave an honest prose + TODOish note (do not fake a spend).
7. Update any class / feature / VOIDMARK / lang **prose that conflicts** with the Field Synthesis free exception (e.g. blanket “every ability costs Reagents” claims must carve Field Synthesis out).

---

## B. Replace Patch Up -> Field Triage (**2 Reagents**)

**HARD:** Field Triage **MUST cost 2 Reagents** (`system.resource: 2`). Do not ship at 0, 1, or 3.

### Lock
- Replace **Patch Up** (Draw Steel Heal rename, `_dsid: heal` / Patch Up localization) with **Field Triage**:
  - Type: **maneuver**
  - Cost: **2 Reagents**
  - Effect: mark up to **3 allies within 10 ft**; each marked ally may spend a **Recovery as a free trigger once** before end of caster's next turn.
- Update **pregens / defaults / docs / VOIDMARK / lang** so Medic gets **Field Triage** instead of Patch Up.
- Remove or stop granting Patch Up on Medic paths; no dual-grant.
- Rebuild packs after src JSON / lang / raw / voidmark changes.

---

## C. Rigged Fire — platform gate + platform ammo

**Primary:** `scripts/ammo.mjs` (and any Rigged Fire / drone Fire / vehicle turret / fromGearId path).

### Platform gate (NEW — before roll card)
Before activating the **Rigged Fire** roll card, require a valid fire platform:
- a **connected drone**, OR
- a **vehicle with turret**

If **neither** is present: **refuse** with a clear chat/UI message and **do NOT open the roll card**.

### Ammo (unchanged intent, now covers both platforms)
- Debit that **platform's magazine** (drone gun or vehicle turret gun) — **not** the hero belt / hero gun mag.
- Drones with guns **and** vehicles with turrets **ship with Standard Rounds** loaded as needed (pregen / spawn / kit / vehicle defaults).
- **Refuse** if the platform magazine is empty (toast/notify; block before power roll — and still no roll card if empty after platform resolves).
- **Hero-gun 0.3.128 path unchanged** — Controlled Pair / Suppressing Fire / etc. still debit the hero gun as shipped in 0.3.128/0.3.129.


## C2. Reload for everyone (guns / drones / turrets)

**Primary:** Reload ability/maneuver + `scripts/ammo.mjs` (or sibling reload path).

### Lock
Update **Reload** so the user can choose not only their worn/held gun but also:
- a **drone** (from inventory and/or deployed/connected — cover the path that matches how drones live today in Ghostwire), and reload that drone's magazine from **Standard Rounds** (or the ammo type that gun uses), topping to capacity like hero guns;
- if a **vehicle turret** is in scope with Rigged Fire, Reload must be able to **top that turret magazine the same way** when the hero has access.

### Refuse clearly when
- no eligible gun / drone / turret is available, OR
- the hero is out of inventory rounds for that ammo type.

Hero worn/held gun reload behavior stays as today except it now shares the same chooser UX that also lists eligible drones/turrets.

## D. AE add -> upgrade (~22 skill-edge packs)

**Cite:** `docs/directors/_03128-gun-ctd-ae-undefined-notes.md`.

### Lock
- Flip skill-edge Active Effects that use **`add`** on `system.skills.modifiers.*.edges` to **`upgrade`** (~22 pack rows: Perseverance, Corp Glamor, Changer forms, Cyborg auxiliary limbs, Skillwires, Mama Cassavir implant, Survivor's Nose, and the rest listed in that note).
- Do **not** flip stamina/armor/shield band AEs back to upgrade — those stay `add` (always-present schema numbers that must stack).
- Rebuild affected packs. Prefer a repo-wide scan so none of the ~22 `add` skill-edge rows remain.

---

## E. stamina.mjs: `change.mode` → `change.type` (v14 deprecation)

### Lock
- In `scripts/stamina.mjs` (and any sibling that still reads AE change mode for stamina tooling): prefer **`change.type`**; stop relying on deprecated **`change.mode`**.
- Drop dead `change.mode === "upgrade"` branches if the file still has them for skill/stam paths (per the 03128 notes).
- Sheet-open deprecation spam for stamina `#mode` must be gone after this ship.

---

## F. AA / JB2A onboard + PIXI teardown harden

**Primary:** `scripts/hit-fx.mjs`, `scripts/sfx.mjs`, `assets/`, module deps / README.

### Lock
1. **Vendor what we can into Ghostwire** (license-clean / redraw). Widen hit-fx kinds so more abilities get origin→target + impact without external mods.
2. **No hard dependency** on Automated Animations, JB2A, Sequencer, or `ds-aa-bridge`. Built-in PIXI + module SFX path **must look good alone**.
3. Optional Sequencer upgrade path OK **if present** (same pattern as 0.3.127/0.3.128).
4. **Harden canvas / ticker teardown** — idle CTD suspect from 03128 notes. Ensure hit-fx / PIXI / ticker listeners clean up on scene change, combat end, module disable, and token despawn. No leaked tickers.
5. In result + smoke docs: list what **Michael can disable after smoke** (settings / optional modules) if anything still misbehaves.

---

## Ship hygiene (required)

1. Bump `module.json` to **0.3.130** (+ mirrored version fields if any).
2. Update README Status for 0.3.130.
3. Rebuild packs after all src/lang/raw changes.
4. Write `docs/directors/_claude-03130-result.md` (what landed, Nano-Adrenal outcome, Field Triage cost confirmation = **2**, deviations, PR URL).
5. Write/update `docs/directors/03130-smoke.md` checklist covering A–F.
6. Open GitHub PR against `main`. Prefer squash-ready. **Do not merge** — paste the PR URL in the result file and at the end of your session output.
7. Leave director research scratch untracked.

**Done means:** PR open, result file written with PR URL, Field Triage `system.resource === 2`, version 0.3.130 on the branch.
