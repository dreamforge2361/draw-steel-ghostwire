# Spike B32 Phase 5b — Node tokens on the canvas + linked Wired map

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (Phase 5 was 0.1.45 → use 0.1.46).

## Why
When the party goes fully Jacked In, the Director moves them to a matrix / Wired battle map and wants the Wired Console nodes on that canvas as real tokens: targetable by Programs, showing Integrity, hidden until revealed. Today nodes exist only as Console board data on the meatspace Scene.

## Context (already on main, `44b95cf`)
- Board: `Scene.flags.draw-steel-ghostwire.wiredBoard = { nodes, stratum, updated }`, read via `getBoard(scene)`; GM writes via `#updateBoard`.
- Node shape: `{ id, name, track, rating, integrityMax, integrity, alert, revealed, description, notes }`.
- `RATING` + `NODE_TEMPLATES` in `scripts/wired-node-templates.mjs`.
- Deploy pattern (Phase 4, `scripts/machines.mjs`): template Actor from `summons` → linked world Actor + token; flags link; Recall cleans up; no forced re-renders.
- `src/packs/summons/nodes/` folder exists (`gwSummonsNodes00`), empty.

## Locked design (v1)

### A) Linked Wired map
- Scene flag on the **matrix map**: `flags.draw-steel-ghostwire.wiredMapFor = "<boardSceneId>"`.
- The Console's **board Scene** = the viewed Scene's `wiredMapFor` target if it exists, else the viewed Scene. All board reads/writes go to the board Scene; the **roster** still lists tokens on the **viewed** Scene (the runners on the map).
- Console header (GM): **Wired map for:** select — "This Scene" or any other Scene. Header shows which board is live.
- One board, no copies.

### B) Node Actors (summons/nodes)
- Two npc templates: **Wired Node (Track 1)** and **Wired Node (Track 2)**, `flags = { kind: "node-template", track }`, size 1M, friendly-neutral token, `construct` keyword, EV 0.

### C) Place / Remove on canvas (Console detail panel, GM)
- **Place on canvas:** import the track template into a world Actor (folder **Wired Nodes**), named after the node, linked token on the **viewed** Scene at the view centre (offset so repeated placements don't stack). Actor `flags = { kind: "node", boardSceneId, nodeId, track }`.
  - Track 2: Stamina = Integrity (value/max), token bar1 = stamina.
  - Track 1: no bar.
  - Token **hidden** unless the node is revealed. Level = Rating.
- **Remove from canvas:** delete the node Actor's tokens (all Scenes) and the Actor. The board node stays.
- One placed Actor per node (button toggles Place / Remove).

### D) Sync (board is the source of truth)
- Board → token: on board change, each placed node Actor gets name, Rating (level), Integrity (Track 2 stamina), track (bar on/off), and revealed (token hidden) — only fields that differ, one update each.
- Token → board: GM changing a Track 2 node token's Stamina (damage button, sheet, bar) writes the node's Integrity back.
- Node deleted / board reset → its Actor and tokens are removed. Node Actor or its last token deleted by hand → nothing breaks; the Console shows Place again.
- No loops: sync skips unchanged values; token-origin updates carry an option flag.

## Out of scope
- B23c Wired vision tints (next)
- Auto-layout of networks, connection lines between nodes
- Player-side placement, Trace Alert on tokens (Console keeps it)
- Commit / push

## Done when
1. A matrix map linked to a meatspace Scene shows and edits that Scene's board in the Console.
2. Place on canvas puts a node token on the viewed map; hidden until revealed; Track 2 shows an Integrity bar.
3. Damaging a Track 2 node token updates Console Integrity; Console damage updates the token bar.
4. Reveal in the Console unhides the token (chat card still posts).
5. Remove from canvas / delete node / reset board clean up tokens and Actors.
6. Existing Console tools (Add Node, Random Node, Cluster, Add template) unchanged.
7. Version bumped; docs pending verify; no git commit.

## Foundry test checklist (print when finished)
1. On the meatspace Scene, add a Track 2 R3 and a Track 1 R2 template node in the Console.
2. Create/open a matrix map Scene, view it, Console header → **Wired map for:** the meatspace Scene. The same two nodes appear.
3. Select the Track 2 node → **Place on canvas** → hidden token with Integrity bar 26/26.
4. Console **Damage** 5 → token bar 21/26. Apply 4 damage to the token → Console Integrity 17.
5. **Reveal to players** → token unhides; chat card posts.
6. Place the Track 1 node → token with no bar.
7. **Remove from canvas** on one; **Delete node** on the other → both tokens and their Actors are gone (Wired Nodes folder empties).
8. Unlink the map (This Scene) → Console shows the matrix map's own (empty) board.
