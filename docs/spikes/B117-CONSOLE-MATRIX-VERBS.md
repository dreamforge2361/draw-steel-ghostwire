# B117 — Matrix Verbs in Wired Console (LOCKED 2026-09-20)

## Lock
- **Sheet keeps:** Connect (and Jack Out as emergency; Toggle Connection State as free status flip). Connection status icons stay on token.
- **Console fires:** Scan, Navigate, Ping first (thin slice). Later: Broadcast, Search, Read/Write. Hacker Bandwidth Programs stay on sheet for now.
- **Who:** Selected Connected actor (Overlay or Jacked In) with deck/comlink / Wire Kit. Disconnected → verbs disabled; only Connect on sheet.
- **Flow:** Pick actor in Console roster (or active combatant) → pick node on board/map → verb button → power roll (actor Reason/Intuition, Hacking edge, Jacked In edge, Reader if on) → apply tier to that node / Trace writeback when doctrine says so.
- **Sheet cleanup:** After Console verbs work, remove Matrix Verbs (except Connect/Jack Out/Toggle) from hero `defaultItems` and NPC Wire Kit stamp — avoid dual homes.

## Thin first slice (this PR)
1. Console UI: verb strip Scan / Ping / Navigate when a Connected actor + node selected.
2. Roll through Foundry DS power-roll path using the selected actor.
3. Apply existing verb tier text (incomplete/clean/refund).
4. Soft Trace: tier1 “something goes wrong” may +1 Trace on the node/host per Director defaults; Scan doctrine still prefers no Trace on clean observation — match shipped verb cards.
5. Docs: spike + short note in 18-wired-foundry.md / Wire journal.
6. Version: after current main; if 0.3.52 open, target **0.3.53**. **Shipped as 0.3.52** (main was 0.3.51; no parallel 0.3.52 PR).

## Out of scope this PR
- Moving Hacker Programs into Console
- Full Trace auto-pipeline for every verb
- PDF redo
- Gold Line force overwrite

## As-built (0.3.52)

| Piece | Where |
|---|---|
| Verb ids / sheet vs Console split | `scripts/wired-verbs.mjs` (`SHEET_VERBS` vs `CONSOLE_SLICE` / `OFF_SHEET_DSIDS`) |
| Gate, actor pick, soft Trace math | `scripts/wired-console-verbs.mjs` (Foundry-free; Node smoke) |
| Console UI + `AbilityModel#use` | `scripts/wired-console.mjs`, `templates/wired-console.hbs`, `styles/ghostwire.css` |
| Hero defaultItems + world strip | `scripts/module.mjs` (`matrixVerbsConsole` flag) |
| NPC Wire Kit stamp | `scripts/wired-kit.mjs` stamps Connect / Jack Out / Toggle only |
| Foundry notes | `docs/rulebook/18-wired-foundry.md` |
| Wire chapter In Foundry aside | `docs/raw/21-the-wire.md` + rulebook journal page |

**Roll characteristics** come from the shipped verb cards: Scan / Navigate = `intuition` (Instinct), Ping = `reason` (Logic). Edges are not duplicated in the Console — they ride the existing Wired `AbilityModel#use` patch (Hacking skill, Jacked In, Reader `edgeAbilities`).

**Soft Trace:** Ping / Navigate tier 1 → +1 on the selected node’s Trace Alert (cap 12, lockout warning). Scan tier 1 does **not** auto-move Trace. The GM client applies the write from the ability chat card (`abilityResult` tier).

**Sheet cleanup:** GM ready-hook deletes off-sheet dsids from heroes and from `wireKitGranted` NPC copies. Named bestiary embeds without that flag (e.g. Mama) are not rewritten.

Smoke: `node tools/b117-console-verbs-smoke.mjs`. No live Foundry in this environment.
