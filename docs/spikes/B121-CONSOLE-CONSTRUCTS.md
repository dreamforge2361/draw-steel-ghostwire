# Spike B121 — Wired Console Constructs (Sprites / Agents)

**Date:** 2026-09-20  
**Module:** **0.3.78**  
**Status:** **SHIPPED / DESIGN LOCKED** (pending Michael Foundry-verify)  
**Lock:** Michael 2026-09-20 — Lock A + separate Console Constructs section (do not put sprites/Agents on the Connections/Nodes graph)

**Pairs with:** B52 Compile Sprite (`scripts/sprites.mjs`), B120 Hacker Agents (`scripts/agents.mjs`), Wired Console (`scripts/wired-console.mjs`)

## Goal

Give Directors and owners a **Constructs** roster on the Wired Console for compiled Technomancer sprites and Hacker Agents. Keep Connections/Nodes topology clean.

## Design locks

1. **Lock A.** Scene token = roster anchor only. Wire play = Wired Console. Meat actions against that token stay off unless an ability bridges.
2. **Separate section.** Do not list sprites/Agents on Connections. Do not add construct↔node edges to `wiredBoard.nodes[].links`. An optional **face** chip may name the node they’re associated with.

## v1 behavior

- List compiled `kind: "sprite"` / `kind: "agent"` actors whose token **or** compiler token is on the viewed scene.
- Viewer: owner (construct or compiler) + Director.
- Show: name, archetype, Stamina current/max, hybrid band, compiler, optional face chip.
- Actions: pan-to-anchor-token; **Command** opens the existing Compile Sprite / Compile Agent sheet (does **not** compile a new construct); **Decompile** calls `decompileSprite` / `decompileAgent`.
- Sort: anchored first (has a scene token), then sprites before Agents, then A–Z. Hover full name.

## Non-goals

- Full Wire combat automation / auto-initiative for constructs
- Meat bridging UI
- Redesigning the whole Console beyond one extra column

## Foundry path

- Helpers: `scripts/wired-constructs.mjs` (Foundry-free collect/sort/face)
- Console: `scripts/wired-console.mjs` + `templates/wired-console.hbs` + `styles/ghostwire.css`
- Pan: `focusActorTokenOnCanvas` in `scripts/wired-canvas-focus.mjs`
- Command hooks: `commandSprite` / `commandAgent` (open Compile sheet only)

## Success / Michael checklist

1. Console shows **Constructs** beside Connections/Nodes.
2. Compile Sprite / Compile Agent tokens appear in Constructs, not Connections.
3. Pan-to-anchor works; node graph links unchanged.
4. Command opens the Compile sheet; Decompile still removes token+Actor; sheet Compile still compiles.
5. Module **0.3.78**. Smoke: `node tools/b121-console-constructs-smoke.mjs`. No Gold Line `{ force: true }`. No PDF.
