# Spike B106 — Wired Console Wire ping / spoof

**Date:** 2026-09-20  
**Module:** **0.3.45**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Filename lock:** this file is `B106-WIRED-CONSOLE-WIRE-PING.md`. It collides in number with `B106-GOLD-LINE-MAP-PACK.md` (Gold Line plates). **Keep this filename.** Do not rename either spike.

**Hard locks:** do not touch `scripts/gold-line-scene.mjs` live-scene lock. No art gen. BOM-free JSON.

## Lock (do not redesign)

GM telegraph on the Wired Console for Deadhead call-home / spoof flavor. Not Trace math. Not player pings. Not auto call-home.

| Field | Value |
|---|---|
| Who sends | GM only |
| UI | Short text + **Send** on Wired Console |
| Log | Event strip visible to **anyone with Console open** |
| Chat | **Public** OR **whisper** to users whose controlled token is Overlay / Jacked In (`getWiredState`) |
| Persist | Last ~20 pings on the Scene: `flags.draw-steel-ghostwire.wiredPings` (`{ entries, updated }`). Also **reads** `wiredBoard.pings` if nested. Console live-refreshes on flag update (existing `updateScene` hook). |
| Cap | 20 entries, 240 chars per ping |

## As built

| Layer | Change |
|---|---|
| Helpers | `scripts/wired-pings.mjs` — cap, normalize, append, read, whisper recipient ids |
| Console | `scripts/wired-console.mjs` + `templates/wired-console.hbs` — footer log + GM composer |
| CSS / lang | ping strip + chat card; `GHOSTWIRE.WiredConsole.Ping*` |
| Foundry notes | `docs/rulebook/18-wired-foundry.md` |
| Deadhead SoR | call-home now points at Console Wire ping (still no auto Trace) |
| Smoke | `node tools/b106-b109-smoke.mjs` |

## Out of scope

Auto call-home at Trace 6–8; player-sent pings; Trace Alert writes; ICE Block math.

## Foundry notes (Director)

1. Open **Wired Console** (Token controls › network).
2. Bottom **Wire** strip: type a short ping → choose **Public chat** or **Whisper Overlay / Jacked In** → **Send**.
3. Anyone else with the Console open sees the log after the Scene flag updates.
4. Whisper goes to GMs plus owners of Overlay / Jacked In tokens on the **viewed** Scene. Disconnected players still see the Console log if they have it open.
5. Last 20 pings persist on the Scene across reload. **Reset Board** does **not** clear pings.
