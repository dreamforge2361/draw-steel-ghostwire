# B117 — all 9 Matrix Verbs on the node-facing applet (LOCKED 2026-09-20)

## Lock (PLAYER UX)
1. **Player Connects** (from the node applet — not the sheet).
2. **Player opens the Wired node facing them** — the node token / node sheet they’re interacting with, not “ask the GM to click the Console.”
3. **That node UI shows all nine Matrix Verbs:** Connect, Jack Out, Toggle Connection State, Scan, Navigate, Ping, Broadcast, Search, Read/Write.
4. **Choosing a verb fires the correct power roll from their actor** (Intuition/Reason, Hacking edge, Jacked In edge, Reader if on) — the same Draw Steel `AbilityModel#use` path as sheet abilities.

**Director Wired Console** can still show the board + roster (and the same nine-verb strip). The primary play loop is **node-facing verbs**. Console and node panel share `useConsoleVerb` / `verbStripView` / `consoleVerbGate`. Do not make players depend on GM Console ownership.

Hacker Bandwidth Programs stay on the sheet.

**Who can fire:** the user’s owned actor (or the GM, from the Console roster). **Connect** works while Disconnected. Every other verb needs Overlay or Jacked In. Hidden nodes stay GM-only.

## Sheet cleanup — no dual homes
Remove Matrix Verbs from:
- **Pregens** (any pregen actor that still embeds them)
- Hero **`defaultItems`** / module grants that auto-add Matrix Verbs
- NPC **Wire Kit** stamp (kit still marks Wire-capable NPCs; it does **not** copy the nine onto the sheet)
- **Mama Cassavir** embedded Matrix Verb items

World catch-up: GM ready-hook deletes all nine dsids from every actor (`matrixVerbsApplet` flag).

## As-built (0.3.52)

| Piece | Where |
|---|---|
| Verb ids | `scripts/wired-verbs.mjs` (`MATRIX_VERBS` / `OFF_SHEET_DSIDS` = all nine; `SHEET_VERBS` empty) |
| Gate, actor pick, soft Trace math | `scripts/wired-console-verbs.mjs` — per-verb gate (Connect while disconnected; action verbs need a node) |
| Shared fire + strip view | `scripts/wired-console.mjs` `useConsoleVerb` / `verbStripView` |
| Player node panel | `scripts/wired-node-verbs.mjs`, `templates/wired-node-panel.hbs` |
| Revealed node OBSERVER | `scripts/wired-node-tokens.mjs` `setNodePlayerAccess` |
| Director Console strip + roster | `scripts/wired-console.mjs`, `templates/wired-console.hbs` |
| Strip defaultItems + world actors | `scripts/module.mjs` (`matrixVerbsApplet`) |
| NPC Wire Kit | `scripts/wired-kit.mjs` stamps the kit feature only |
| Mama | `src/packs/bestiary/reach-streets/mama-cassavir.json` — nine verbs removed |
| Foundry notes | `docs/rulebook/18-wired-foundry.md` |
| Wire chapter In Foundry aside | `docs/raw/21-the-wire.md` + rulebook journal page |

**Player loop:** open the revealed node token (or minimap node) → Connect if needed → Scan / Navigate / Ping / Broadcast / Search / Read-Write / Jack Out / Toggle. The panel picks that user’s actor (controlled token, else assigned character, else first Connected owned, else a disconnected owned actor so Connect can run).

**Director loop:** Console board + roster still works. Same nine verbs. Do not require players to wait for the GM to own/click the Console.

**Roll characteristics** from the shipped verb cards: Connect / Jack Out / Scan / Navigate = `intuition` (Instinct); Ping / Search / Read-Write = `reason` (Logic); Toggle and Broadcast have **no roll**. Edges ride the existing Wired `AbilityModel#use` patch (Hacking, Jacked In, Reader `edgeAbilities` on Scan / Search).

**Soft Trace:** tier 1 on Connect / Jack Out / Ping / Navigate / Search / Read-Write may +1 Trace Alert on the selected node (cap 12). **Scan** does not auto-move Trace. Toggle / Broadcast have no roll, so no auto Trace. The GM client applies the write from the ability chat card (`abilityResult` tier).

## Out of scope
- Moving Hacker Programs into the applet
- Full Trace auto-pipeline beyond soft Trace
- PDF redo
- Gold Line force overwrite

Smoke: `node tools/b117-console-verbs-smoke.mjs`. No live Foundry in this environment.
