# B117 — all 9 Matrix Verbs on the node-facing applet (LOCKED 2026-09-20)

## Lock (PLAYER UX)
1. **Player Connects** (from the node applet — not the sheet).
2. **Player opens the Wired node facing them** — the node token / node sheet they’re interacting with, not “ask the GM to click the Console.”
3. **That node UI shows all nine Matrix Verbs:** Connect, Jack Out, Toggle Connection State, Scan, Navigate, Ping, Broadcast, Search, Read/Write.
4. **Choosing a verb fires the correct power roll from their actor** (Intuition/Reason, Hacking edge, Jacked In edge, Reader if on) — the same Draw Steel `AbilityModel#use` path as sheet abilities.

**Director Wired Console** can still show the board + roster (and the same nine-verb strip). The primary play loop is **node-facing verbs**. Console and node panel share `useConsoleVerb` / `verbStripView` / `consoleVerbGate`. Do not make players depend on GM Console ownership.

Hacker Bandwidth Programs stay on the sheet. Decks, Bandwidth, Programs, Improved Cyberdeck, origins, Technomancer Resonance / sprites / deckless payloads are **unchanged**.

**Who can fire:** the user’s owned actor (or the GM, from the Console roster). **Connect** works while Disconnected **and** requires a Wire interface (or Technomancer); it lands in **Linked**. **Broadcast / Toggle / Jack Out** work from Linked. Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs need Overlay or Jacked In. Hidden nodes stay GM-only.

## Sheet cleanup — no dual homes
Remove Matrix Verbs from:
- **Pregens** (any pregen actor that still embeds them)
- Hero **`defaultItems`** / module grants that auto-add Matrix Verbs
- NPC **Wire Kit** stamp (kit still marks Wire-capable NPCs; it does **not** copy the nine onto the sheet)
- **Mama Cassavir** embedded Matrix Verb items

World catch-up: GM ready-hook deletes all nine dsids from every actor (`matrixVerbsApplet` flag).

## Anyone vs Hacker vs Technomancer
The nine applet verbs are the **anyone baseline** (commlink / deck / chrome interface + Connected). They do **not** grant Programs.

| | Anyone (commlink / deck + Connected) | Hacker | Technomancer |
|---|---|---|---|
| **Universal verbs** | Observe / nudge / navigate: Connect, Jack Out, Toggle, Scan, Navigate, Ping, Broadcast, Search, Read/Write | Same nine | Same nine (deckless — Resonance counts as interface) |
| **Class kit** | — | Bandwidth, Programs, Alert tools, deck Intrusion / Integrity bonuses, Improved Cyberdeck | Resonance, sprites, deckless payloads (Wired Native) |
| **Roll quality** | Street punk with a Burner rolls the verb | Padlock-6 + Hacking + Jacked In + Reader still rolls **better** — Hacking edge, Jacked In edge, Reader `edgeAbilities`, deck Reach / mods apply on the existing `AbilityModel#use` path | Same edges when they have Hacking / Jacked In / Reader; no gear required to Connect |

No new “everyone gets Programs” feature. Console / node verb UI still applies Hacking skill edge, Jacked In edge, Reader suite, and deck Reach / mods when the actor has them.

## Connect interface allow-list
Connect fails unless the actor has at least one of:

1. **Comms** tagged `flags.draw-steel-ghostwire.wired.connectInterface`: Burner, **Commlink** (new street SKU), Pocket Sec, Ghost Relay, Corp Blacklink
2. **Cyberdeck / RCC / kit deck:** Scrapdeck, Street Deck, Blackdeck, Ghostbox, Fairlight Ghost; Fleet Deck / Hydra Console / Command Rig / Remote Box / War Table; Nyx Switchblade, Ferrum Padlock-6, Meridian Lookout
3. **Chrome / interface:** Datajack, Datajack Soft, Datajack Dongle, Trode Net, Hot-Sim Module, Signal Ghost
4. **Exception: Technomancer** (class `_dsid`) — deckless Resonance counts as interface; no gear required

Spoof Kit is **not** an interface. Tag is `flags.draw-steel-ghostwire.wired.connectInterface: true` (matrix `role` deck / rcc / interface is a fallback). Fail message: “Need a comlink, deck, datajack, or trodes — or be a Technomancer.”

Street **Commlink** (`src/packs/gear/general/comms/commlink.json`, ¥150) is the everyday phone. It does not replace Pocket Sec or Burner. Do not invent a second deck ladder.

## As-built (0.3.53)

| Piece | Where |
|---|---|
| Verb ids | `scripts/wired-verbs.mjs` (`MATRIX_VERBS` / `OFF_SHEET_DSIDS` = all nine; `SHEET_VERBS` empty) |
| Gate, actor pick, soft Trace, Connect interface | `scripts/wired-console-verbs.mjs` — per-verb gate (Connect while disconnected + interface; action verbs need a node) |
| Shared fire + strip view | `scripts/wired-console.mjs` `useConsoleVerb` / `verbStripView` |
| Player node panel | `scripts/wired-node-verbs.mjs`, `templates/wired-node-panel.hbs` |
| Revealed node OBSERVER | `scripts/wired-node-tokens.mjs` `setNodePlayerAccess` |
| Director Console strip + roster | `scripts/wired-console.mjs`, `templates/wired-console.hbs` |
| Strip defaultItems + world actors | `scripts/module.mjs` (`matrixVerbsApplet`) |
| NPC Wire Kit | `scripts/wired-kit.mjs` stamps the kit feature only |
| Mama | `src/packs/bestiary/reach-streets/mama-cassavir.json` — nine verbs removed |
| Street Commlink | `src/packs/gear/general/comms/commlink.json` |
| Foundry notes | `docs/rulebook/18-wired-foundry.md` |
| Wire chapter In Foundry aside | `docs/raw/21-the-wire.md` + rulebook journal page |

**Player loop:** open the revealed node token (or minimap node) → Connect if you have an interface → Scan / Navigate / Ping / Broadcast / Search / Read-Write / Jack Out / Toggle. The panel picks that user’s actor (controlled token, else assigned character, else first Connected owned, else a disconnected owned actor so Connect can run).

**Director loop:** Console board + roster still works. Same nine verbs. Do not require players to wait for the GM to own/click the Console.

**Roll characteristics** from the shipped verb cards: Connect / Jack Out / Scan / Navigate = `intuition` (Instinct); Ping / Search / Read-Write = `reason` (Logic); Toggle and Broadcast have **no roll**. Edges ride the existing Wired `AbilityModel#use` patch (Hacking, Jacked In, Reader `edgeAbilities` on Scan / Search).

**Soft Trace:** tier 1 on Connect / Jack Out / Ping / Navigate / Search / Read-Write may +1 Trace Alert on the selected node (cap 12). **Scan** does not auto-move Trace. Toggle / Broadcast have no roll, so no auto Trace. The GM client applies the write from the ability chat card (`abilityResult` tier).

## Out of scope
- Moving Hacker Programs into the applet
- Full Trace auto-pipeline beyond soft Trace
- PDF redo
- Gold Line force overwrite
- A second deck ladder

Smoke: `node tools/b117-console-verbs-smoke.mjs`. No live Foundry in this environment.
