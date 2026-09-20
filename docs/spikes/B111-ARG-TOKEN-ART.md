# Spike B111 — ARG Argent Exchange bestiary token art

**Date:** 2026-09-20  
**Module:** **0.3.47**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Pairs with:** `docs/spikes/B103-BESTIARY-HUMANOID-PORTRAITS.md`

## Goal

Ship Michael’s ARG portraits onto the three Deadhead meat Actors **permanently**. Pack slugs stay (`corp-enforcer`, `response-lieutenant`, `corp-security-officer`). Display names, flavor, and Run Generator opposition names become ARG-prefixed. **Do not** force-rewrite the Gold Line live Scene. **Do not** generate new AI art.

## Assets

Michael PNGs (1254²) plus compressed 1024² WebP (Foundry `img` / token — same convention as B103):

| Actor slug | Display name | On disk |
|---|---|---|
| `corp-enforcer` | ARG Corporate Enforcer | `assets/tokens/bestiary/arg/arg-corporate-enforcer.{png,webp}` |
| `response-lieutenant` | ARG Response Lieutenant | `assets/tokens/bestiary/arg/arg-response-lieutenant.{png,webp}` |
| `corp-security-officer` | ARG Security Officer | `assets/tokens/bestiary/arg/arg-security-officer.{png,webp}` |

Foundry paths:

```text
modules/draw-steel-ghostwire/assets/tokens/bestiary/arg/arg-corporate-enforcer.webp
modules/draw-steel-ghostwire/assets/tokens/bestiary/arg/arg-response-lieutenant.webp
modules/draw-steel-ghostwire/assets/tokens/bestiary/arg/arg-security-officer.webp
```

B103 slug WebPs (`assets/tokens/bestiary/corp-enforcer.webp` etc.) stay on disk as unused fallbacks. The apply tool’s `ART_OVERRIDES` map these three slugs into `bestiary/arg/` so a later `node tools/apply-bestiary-portrait-art.mjs` does not restamp the old files.

## Actor / lang / flags

- `lang/en.json` `GHOSTWIRE.Bestiary.Actors.{CorpEnforcer,ResponseLieutenant,CorpSecurityOfficer}.Name` → ARG-prefixed strings. Descriptions note **ARG Argent Exchange** alignment. Lieutenant biography + Director notes: **Goliar** (portrait); no DS `species` field on these Actors.
- Folder stays **Corp & Security**.
- Affiliation: `flags.draw-steel-ghostwire.faction = "arg"` and `flags.draw-steel-ghostwire.bestiary.faction = "arg"` / `corp: "Argent Exchange"` (alongside existing `bestiary.region: "corp"`). DS `system.monster.organization` is unchanged (leader / minion).

## Deadhead + Run Generator

Bare “Corp Enforcer” / “Corp Security” / “Response Lieutenant” opposition lines in the Deadhead SoR, cargo remap sidecar, Director journal generator, and Gold Line map notes now use ARG names. `@UUID` labels match. `scripts/data/runs/opposition-map.json` names must match localized pack names (build-packs inlines `lang/en.json`).

## Out of scope

Gold Line `ensureGoldLineScene({ force: true })`; dropping tokens onto Michael’s live Scene; new AI art; renaming pack JSON filenames / Actor `_id`s.

## Verify

```text
node tools/apply-bestiary-portrait-art.mjs --list   # three ARG slugs art=yes, img-set=yes, token-set=yes
node tools/deadhead-director-smoke.mjs
node tools/build-packs.mjs bestiary runs            # Foundry closed
```

Foundry: Bestiary → Corp & Security → open the three Actors (sheet portrait = token art). Drag each onto any **non–Gold Line** Scene (or a scratch Scene). Reload world after module update so the pack LevelDB is picked up. Do not restamp Gold Line walls / lights / tiles.
