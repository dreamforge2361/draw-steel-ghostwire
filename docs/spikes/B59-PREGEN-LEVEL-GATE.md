# B59 — Pregen level-gate (no future class grants on L1 fills)

**Date:** 2026-09-18 (ET)  
**Module:** 0.1.94  
**Depends on:** B44b robust-fill; P0/P1 strips in 0.1.91–0.1.92 (Kessic Dual Boot / Backdoor Override; Wren Careful Observation).

## Problem

Robust-fill (`tools/pregens-to-actors.mjs`) embedded future-level class grants onto L1 pregens:

| Hero | Overgrant | RAW level | Stripped in |
|---|---|---|---|
| Kessic | Dual Boot | L6 | 0.1.91 |
| Kessic | Backdoor Override (11 Bandwidth Program) | L8 | 0.1.91 |
| Wren | Careful Observation → Glass the Block | L3 | 0.1.92 |

**Root cause (two paths):**

1. **Roster seeds** — `ROSTER[].abilities` listed future dsids (`dual-boot`, `backdoor-override`, `careful-observation`) and seeded them directly into the actor **before** advancement walking, bypassing the old `atLevel1` filter.
2. **Advancement recursion** — `atLevel1` only treated `requirements.level === 1` (or null) as eligible. That was enough for class JSON (numeric levels), but it was not shared, not shape-aware, and did not gate the roster seed path.

Actor JSON was cleaned in 0.1.91–0.1.93; this pass **does not regenerate** the seven pregens. The shippable fix is the generator gate + smoke test + docs.

## As-built

### Central helper — `tools/lib/pregen-level-gate.mjs`

| Export | Role |
|---|---|
| `advancementRequiredLevel(adv)` | Reads `requirements.level`, `requirements.levels[]` (min), `unlock` / `unlock.level`, root `level`. Returns `null` if missing. |
| `advancementMeetsLevel(adv, targetLevel, ctx?)` | `need <= targetLevel`. Missing metadata → **always-on** + warning (see policy). |
| `buildGrantLevelByDsid(index, idFromUuid)` | dsid → minimum pool grant level across all indexed advancements. |
| `abilityAllowedAtLevel(dsid, targetLevel, map)` | Blocks roster seeds whose min grant level is > target. Manual seeds (not in any pool) stay allowed. |

### Generator — `tools/pregens-to-actors.mjs`

- Target level = class item `system.level` if set, else `hero.level`, else **1**.
- `resolveGrants(..., targetLevel)` uses `advancementMeetsLevel` on **every** advancement (class, subclass, kit, ancestry, background, profession, and recursive grants).
- Roster `abilities` are filtered with `abilityAllowedAtLevel` before seeding.
- Wren / Kessic roster lists no longer name the future abilities (comments point at B59).

### Missing level metadata — policy

Ghostwire career / kit / ancestry / culture advancements intentionally use `requirements.level: null` (always-on grants). **Skip-on-null would break robust-fill** (kit signatures, profession skills, ancestry traits).

**Policy:** null/missing → treat as level 0 (include) and append a warning to `log.levelWarnings`. Class / subclass advancements in this module always carry numeric levels; a null on a class advancement would show up in the generator summary for a data fix.

### Smoke test — `tools/pregen-level-gate-smoke.mjs`

Asserts for Hacker L1 and Scout L1:

- Dual Boot / Backdoor Override / Careful Observation are **not** in the simulated fill output.
- Deep Scan / Quarry still are.
- Shape helpers (`levels[]`, `unlock`) work.

```bash
node tools/pregen-level-gate-smoke.mjs
```

## How to verify

1. `node tools/pregen-level-gate-smoke.mjs` — all checks green.
2. Code review: every grant path in `resolveGrants` and the roster ability seed map calls the shared helpers.
3. Optional dry regen (Foundry closed; **not** required for 0.1.94):  
   `node tools/pregens-to-actors.mjs` then confirm Kessic/Wren output item lists lack the overgrants; only rebuild packs if you intend to refresh actors.
4. In Foundry (after any future regen): L1 Kessic has no Dual Boot / Backdoor Override; L1 Wren has no Careful Observation / Glass the Block.

## Out of scope

- Regenerating all seven pregen actors (already cleaned).
- Changing class advancement data or kit/career null levels.
- Higher-than-L1 pregen builds (helpers accept `targetLevel`; no roster entries use it yet).

## Done when

- [x] Shared level gate on every pregen grant path  
- [x] Smoke test passes (Hacker L1 + Scout L1 overgrant cases)  
- [x] Spike note + module **0.1.94**  
- [x] Commit + push to main  
