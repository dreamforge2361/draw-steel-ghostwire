# Spike — Rigger vertical slice (0.3.105)

**Lock:** Michael 2026-09-23 night (full vertical, not phased-only).  
**Addendum:** Machine sheet always ships Description + Notes + Image/portrait (header + token) for drone / vehicle / baseAsset.  
**Executor:** box clone fallback (Allfather Claude unreachable this wave).

## Goal

Playable morning path:

1. Open a machine Actor → **Ghostwire Machine** sheet (pared UI; portrait / description / notes included).
2. Use **Deploy & Command** → inventory picker of owned machine Items → Deploy (shared `deployMachine`) or Command fielded.
3. Deploy refuses at Fleet Size cap (3@1 / 4@4 / 5@7 / 6@10; Drone Jockey Wide Band +2, Wide Band Redoubled +4).
4. **Jump-In** → Wire **Jacked In** + meat-body inert AE; hits on machine while jumped drain Uptime (+ biofeedback notify).
5. E1 base assets dual Item+Actor: Door Lock, Safehouse Beacon, Camera/Sensor Mast (+ thin Sentry Turret / Mesh-Web / Barricade / Workshop Bench stub).
6. Anyone may place base assets; Facility Rigger jacked into Beacon/Home Ground gains edge helper AE on rolls while in that base.
7. Chassis stamp prefers Item `flags.draw-steel-ghostwire.vehicle` Integrity/Speed/Jump-In/Handling; bands remain fallback.

## Non-goals / deferred (label in smoke)

- Full drone AI / autonomous turn scripts.
- Parallel Uptime pool UI (use class heroic resource).
- Pack LevelDB rebuild on Allfather while Foundry is open (Michael closes Foundry / rebuild morning if Dropbox checkout lags).
- Perfect ¥/Integrity numeric pass for every chassis (best-shot E1 base assets; existing vehicles keep band math unless flag overrides present).

## Touch list

- `scripts/machines.mjs` — fleet, richer stamp, Deploy&Command picker, Jump-In, base assets, sheet register hook
- `scripts/machine-sheet.mjs` + `templates/machine-sheet.hbs` + CSS
- `src/packs/vehicles/base-assets/*` + `src/packs/summons/machines/machine-base-*.json`
- `docs/masters/GHOSTWIRE_MACHINE_BANDS.md`, `docs/raw/16-wrench.md`, `docs/raw/23-machines.md` (brief sync)
- `docs/directors/rigger-vertical-smoke-03105.md`
- version **0.3.105** + README changelog
