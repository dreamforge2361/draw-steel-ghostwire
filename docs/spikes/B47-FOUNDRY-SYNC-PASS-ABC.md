# Spike B47 — Foundry-sync packs + lang to Pass A/B/C RAW

**Repo:** draw-steel-ghostwire  
**Depends on:** Pass C + locks on main (`59b255d`, module 0.1.59). Flags: `docs/spikes/B42-RAW-REVIEW-FLAGS.md` ("Foundry-sync backlog").  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch after pack rebuild.

## Goal
Bring **shipped Foundry class / ability / feature / summons text** and **`lang/en.json`** in line with post-Pass-A/B/C RAW wording. `docs/raw/` is SoR for prose; do **not** invent new math. Rebuild LevelDB packs after JSON edits (`node tools/build-packs.mjs`, Foundry closed).

## In scope
1. `src/packs/classes/**` (all eight classes’ abilities, features, kits hooks).
2. Related summons / sprite / spirit Actor description strings if they still say DC / tier / +N defense / Winded-as-condition.
3. `lang/en.json` strings that mirror those abilities (especially Commander **Command Presence → Command Persona** mode).
4. Chrome erosion feature rename: Technomancer `light-chrome-tolerance.json` → current shared erosion model / name from Pass A RAW + Chrome master (no old BI/erosion ladder).

## Explicit work list (from Pass C flags + scan)
| Area | Drift | Fix to |
|---|---|---|
| Commander `lang/en.json` + ability | Mode **Command Presence** | **Command Persona** (ability title unchanged) |
| Medic / Commander ability strings | “+1 / +2 to a roll” | **edge** / **double edge** (keep flat Stamina/damage/distance numbers) |
| Technomancer + sprites | DC saves, “tier”, “+N defense” | Pass B/C language: tests/potency, hybrid band / cost band, **bane / double bane** |
| Technomancer | `light-chrome-tolerance.json` old name + erosion | Match RAW Pass A shared chrome magic-erosion model |
| Street Priest | foci Availability / “BP/SP” (`saints-relic`); action types vs master | Pass A no BP/SP; Availability/echelon labels; action types from RAW/master |
| Street Priest / others | “Provisional magnitude” where RAW now prints numbers | Remove provisional note; keep printed numbers |
| Wrench | `UnbreakableHive` d6 / “attack roll” | Pass C Power Roll / saving-throw wording |
| Technomancer Slam / Web | Winded as inflicted condition | **weakened (save ends)** |
| Judgment / Faith / Purge / etc. | Any pack text still pre-lock | Match RAW after B42e1 |

## Out of scope
- Rewriting `docs/raw/` or regenerating Rulebook journals (already SoR).
- Bestiary Actor biographies that say “Handbook Tier → DS level” (Director mapping notes — leave unless clearly wrong).
- Full mechanical redesign; new abilities; B40/B41/B44–B46.
- Pasting Draw Steel Heroes prose.

## Method
1. Grep `src/packs/classes` + `lang/en.json` + `src/packs/summons` for: `\btier\b`, `DC \d`, `BP/SP`, `+1 to`, `+2 to`, `Command Presence`, `Provisional`, `light-chrome`, `Winded`, `defense`, `to hit`, `Skill Points`.
2. For each hit, open matching RAW section and rewrite the Foundry string to match (cite RAW path in the PR/checklist).
3. Do **not** change `_id`s, structure, costs, or damage dice unless RAW and pack disagree on a number already locked in Pass C — then RAW wins and update the pack number.
4. `node tools/build-packs.mjs` with Foundry closed; bump `module.json` one patch.
5. Update STATUS + FOUNDRY-BUILD-PLAN: B47 done / pending verify. Append a short “B47 applied” note under the Foundry-sync backlog in the flags file.

## Done when
- Grep clean (or only allowlisted hits documented — e.g. Draw Steel power-roll `Tier1`/`Tier2`/`Tier3` **keys** in lang that are schema, not prose).
- Command Persona mode string live in lang + any pack mirror.
- Michael checklist below; **no commit**.

## Michael checklist
1. Spot-open Commander ability in Foundry: mode says **Command Persona**.
2. Spot Medic stim / Commander Word: edge language, not “+1 to a roll.”
3. Spot Technomancer chrome feature name/erosion + one sprite string (no DC / +defense).
4. Spot Street Priest saints-relic / foci: no BP/SP.
5. Spot Wrench Unbreakable Hive: no d6 attack-roll leftover.
6. Module version bumped one patch; packs rebuild clean.