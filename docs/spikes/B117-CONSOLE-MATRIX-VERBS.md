# B117 — Matrix Verbs on the node (player path) + Wired Console (LOCKED 2026-09-20)

## Lock (PLAYER UX — do this; don’t only ship a GM Console strip)
1. **Player uses Connect on their sheet** (stays). **Sheet keeps:** Connect, Jack Out, Toggle Connection State. Connection status icons stay on the token.
2. **Player opens the Wired node facing them** — the node token / node sheet they’re interacting with, not “ask the GM to click the Console.”
3. **That node UI shows the Matrix Verbs** (Scan / Ping / Navigate in this thin slice; room for Broadcast / Search / Read-Write later).
4. **Choosing a verb fires the correct power roll from their actor/sheet** (Intuition/Reason, Hacking edge, Jacked In edge, Reader if on) — the same Draw Steel `AbilityModel#use` path as sheet abilities.

**Director Wired Console** can still show the board + roster (and the same verb strip). The primary play loop is **node-facing verbs for the Connected player**. Console and node panel share the verb module (`useConsoleVerb` / `verbStripView` / `consoleVerbGate`). Do not make players depend on GM Console ownership.

Hacker Bandwidth Programs stay on the sheet for now.

**Who can fire:** a Connected actor (Overlay or Jacked In) the user owns (or the GM, from the Console roster). Disconnected → verbs disabled; only Connect on the sheet. Hidden nodes stay GM-only.

**Sheet cleanup:** After the fire path works, remove Matrix Verbs (except Connect/Jack Out/Toggle) from hero `defaultItems` and NPC Wire Kit stamp — avoid dual homes.

## Thin first slice (this PR)
1. Node UI: verb strip Scan / Ping / Navigate on the node the player opens (token double-click, Token HUD, minimap click, node actor sheet redirect).
2. Same strip on the Director Console (roster + selected node) — shared fire path.
3. Roll through Foundry DS power-roll path using the Connected actor facing that node.
4. Apply existing verb tier text (incomplete/clean/refund).
5. Soft Trace: tier1 “something goes wrong” may +1 Trace on the node/host per Director defaults; Scan doctrine still prefers no Trace on clean observation — match shipped verb cards.
6. Docs: spike + short note in 18-wired-foundry.md / Wire journal.
7. Version: **0.3.52** (main was 0.3.51; no parallel 0.3.52 PR).

## Out of scope this PR
- Moving Hacker Programs into Console / node panel
- Full Trace auto-pipeline for every verb
- PDF redo
- Gold Line force overwrite

## As-built (0.3.52)

| Piece | Where |
|---|---|
| Verb ids / sheet vs off-sheet split | `scripts/wired-verbs.mjs` (`SHEET_VERBS` vs `CONSOLE_SLICE` / `OFF_SHEET_DSIDS`) |
| Gate, actor pick, soft Trace math | `scripts/wired-console-verbs.mjs` (Foundry-free; Node smoke) — `pickPlayerVerbActor` + Hidden gate |
| Shared fire + strip view | `scripts/wired-console.mjs` `useConsoleVerb` / `verbStripView` |
| Player node panel | `scripts/wired-node-verbs.mjs`, `templates/wired-node-panel.hbs` |
| Revealed node OBSERVER | `scripts/wired-node-tokens.mjs` `setNodePlayerAccess` (players can open the node they’re facing) |
| Director Console strip + roster | `scripts/wired-console.mjs`, `templates/wired-console.hbs` |
| Hero defaultItems + world strip | `scripts/module.mjs` (`matrixVerbsConsole` flag) |
| NPC Wire Kit stamp | `scripts/wired-kit.mjs` stamps Connect / Jack Out / Toggle only (skips node actors on HUD) |
| Foundry notes | `docs/rulebook/18-wired-foundry.md` |
| Wire chapter In Foundry aside | `docs/raw/21-the-wire.md` + rulebook journal page |

**Player loop:** Connect on the sheet → open the revealed node token (or minimap node) → Scan / Ping / Navigate. The panel picks that user’s Connected actor (controlled token, else assigned character, else first Connected owned actor).

**Director loop:** Console board + roster still works. Selecting a Connected actor + node fires the same verbs. Do not require players to wait for the GM to own/click the Console.

**Roll characteristics** come from the shipped verb cards: Scan / Navigate = `intuition` (Instinct), Ping = `reason` (Logic). Edges are not duplicated in the UI — they ride the existing Wired `AbilityModel#use` patch (Hacking skill, Jacked In, Reader `edgeAbilities`).

**Soft Trace:** Ping / Navigate tier 1 → +1 on the selected node’s Trace Alert (cap 12, lockout warning). Scan tier 1 does **not** auto-move Trace. The GM client applies the write from the ability chat card (`abilityResult` tier).

**Sheet cleanup:** GM ready-hook deletes off-sheet dsids from heroes and from `wireKitGranted` NPC copies. Named bestiary embeds without that flag (e.g. Mama) are not rewritten.

Smoke: `node tools/b117-console-verbs-smoke.mjs`. No live Foundry in this environment.
