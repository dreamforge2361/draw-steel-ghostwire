# B58 — Scout ability title reskins (0.1.93)

**Date:** 2026-09-18 (ET)  
**Scope:** Display-title renames only for six Scout abilities. Mechanics, `_id`s, and file slugs unchanged.

## Locked titles

| Old | New |
|---|---|
| Gasping in Pain | Breathless Hit |
| Disorienting Strike | Vertigo Burst |
| Coup de Grâce | Kill Confirm |
| Hesitation Is Weakness | Beat the Draw |
| Careful Observation | Glass the Block |
| Quarry | Hard Tag |

## Touched

- `lang/en.json` — `GHOSTWIRE.Classes.Scout.Items.*.Name` for the six + Careful Observation Improvement I/II Names/Descriptions (prose title only)
- `src/packs/classes/scout/abilities/careful-observation.json` — effect display name
- `src/packs/classes/scout/origins/hunter/quarry.json` — Marked effect display name/description
- `src/packs/pregens/wren-sable-corvin.json` — advancement titles (Glass the Block, Hard Tag), Quick Build Kill Confirm, Marked (Hard Tag) effect
- `scripts/data/sfx-map.json` — match regexes accept old **and** new titles
- `docs/raw/13-scout.md`, `docs/masters/GHOSTWIRE_SCOUT_DEVELOPMENT_MASTER.md` — SoR display names for the six
- `module.json` → **0.1.93**; packs rebuilt

## Explicitly not this round

- Eviscerate / Two Throats / One Hundred Throats renames
- Full Shadow College journal rewrite
- Ability `_id` / filename slug changes
