# B41 — Wired node topology minimap

**Status:** Built 2026-09-17 (module 0.1.79) — **pending Michael Foundry-verify**. UX intent below is still the lock; as-built notes and the checklist are at the end.  
**Tied to:** Wired Console (`scripts/wired-console.mjs`), node Actors / Scene nodes, Overlay vs Jacked In vision (B23c).

## Goal
Players who are **on the Wired** (Overlay or Jacked In) get a **hovering topology view** of the Matrix nodes they can currently see on the Scene — so they can read node layout while still (in Overlay) seeing the meatspace canvas underneath.

## UX (LOCKED intent)
| Mode | Canvas / Scene | Node map |
|---|---|---|
| **Overlay** | Normal (or light Wired tint) stays visible | Floating / pop-out **topological node minimap** over (or beside) the canvas — both visible |
| **Jacked In** | Scene goes **very dark** / meatspace suppressed (align B23c Jacked In vision) | **Node map is primary** — players see the topology, not the street |

- Minimap shows only nodes the viewer **can see** (revealed / not hidden / Console visibility rules — match existing Wired Console + node token reveal).
- Topology = nodes + links (edges) if we store connections; otherwise node dots with Rating / Track badges until link data exists.
- The minimap is the **current Scene’s graph**. Scan Reach is hops on that graph, not the whole district. Atlas tokens (**Relay** / **Host** / **Segment**) belong on district and facility Scenes; **Device** tokens belong on room Scenes. See `docs/spikes/B116-WIRE-ATLAS.md`.
- Director keeps full Console; this is the **player-facing** companion view.
- Pop-out ApplicationV2 (or pinned HUD) so it can sit over the canvas without owning the whole screen.

## Implementation sketch
- `scripts/wired-minimap.mjs` — ApplicationV2; subscribe to Scene node flags / node Actors used by Console.
- Open automatically when actor gains Overlay or Jacked In; close or idle when neither.
- Jacked In: strengthen B23c darkness **or** canvas CSS/filter for that client only while minimap focused.
- Data: reuse Console node table + `wired-node-tokens` placement; optional graph layout (force / layered) from node positions or explicit link list later.
- Settings: enable player minimap; scale; “show Rating labels.”

## Depends on / open questions
- Confirm Overlay vs Jacked In status IDs already used by `wired-vision.mjs`.
- Whether node–node **links** exist in data yet (if not, v1 = nodes only; v1.1 = edges).
- Performance with many nodes on large Scenes.

## Out of scope (v1)
Full 3D Matrix; replacing the meatspace Scene with a second Scene; GM-only topology (Console already covers that).

## Done when (future spike)
Overlay: canvas + floating node map. Jacked In: dark scene + node map primary. Visibility respects reveal rules. Foundry-verify; no commit until Michael says.

---

## As-built (0.1.79)
**Files:** `scripts/wired-minimap.mjs` (ApplicationV2 + Handlebars, registered from `module.mjs` next to the Console), `templates/wired-minimap.hbs`, CSS block *Wired node minimap (B41)* in `styles/ghostwire.css` (reuses the Console's `--wc-*` net-deck variables — same cyan / violet / hot-pink palette), i18n `GHOSTWIRE.WiredMinimap.*`.

**Data — no parallel model.** Board = `getBoard(boardScene(game.scenes.viewed))`, exactly the Console's resolution (a matrix map Scene with `wiredMapFor` shows its board Scene's nodes). Players see `node.revealed` nodes only (the Console's player rule; placed tokens mirror it as `hidden: !revealed`). A GM opening it by hand sees every node; unrevealed ones are dashed and tagged *Hidden from runners* in the tooltip.

**Who is "on the Wired".** Status ids from `module.mjs` `WIRED_STATUSES` (`ghostwire-overlay`, `ghostwire-jacked-in`) via the same `getWiredState` the Console and B23c use. The viewer's state is the strongest over: controlled tokens' actors (owned), the user's assigned character, and owned tokens on the viewed Scene. Jacked In beats Overlay.

**Open / close.**
- Players: auto-opens when that state becomes Overlay or Jacked In; resizes when it flips; auto-closes on Disconnected. Closing it by hand while connected keeps it closed until the state changes again (or the player reopens it).
- Manual: Token controls button *Wired Node Map* (`fa-diagram-project`), an unbound keybinding (*Toggle the Wired Node Map*), and `game.modules.get("draw-steel-ghostwire").api.openWiredMinimap()`.
- GMs never auto-open (the Console is theirs).

**Modes.**
| | Window | Canvas |
|---|---|---|
| Overlay | Compact (320×300 × scale), bottom-right above the hotbar, cyan frame | Untouched — B23c Overlay wash only |
| Jacked In | Large (640×560 × scale), centred, hot-pink frame, bigger nodes / names | B23c Jacked In vision **plus** client-only `body.ghostwire-minimap-jacked-in #board { filter: brightness(.3) saturate(.25) }` while the map is open (setting can turn the extra dim off) |

**Layout.** Placed tokens keep relative canvas positions (aspect preserved), then labels are pushed apart so pills do not stack. Unplaced nodes use a **room-prefix cluster** (Light Control above maglocks in the same room) when names share `{Room} - Light Control` / `{Room} - Maglock Door N`, otherwise a force-directed layout with link attraction. Dense boards (12+) shrink dots and truncate names (`LC` / `D2`); the tooltip still has the full name. Scroll to zoom, drag empty space to pan, double-click or the header button to reset. Node glyph: ring = Integrity % for Track 2 (conic gradient), solid rounded square for Track 1; glow colour = Trace Alert band (quiet cyan → stir violet → malice amber → hunting pink → lockout red pulse); downed nodes dim. Label = `R#` (setting) + short name.

**Hover / click.** Tooltip (`data-tooltip-html`): name, Track · Rating, Integrity, Trace Alert + band. Click a placed node → pan to its token (GM also controls it); unplaced nodes do nothing.

**Live refresh.** `updateScene` with module flags on the viewed / board Scene (Console add, reveal, edit, delete, reset, re-link), `create/update/deleteToken` on the viewed Scene (place, move, reveal, remove), node Actor create / update / delete, `canvasReady`. Connection: `create/update/deleteActiveEffect` on owned actors, `updateActor` with `flags.<module>.wired`, `controlToken`, `updateUser` (character), `canvasReady`, `ready`.

**Settings.**
| Key | Scope | Default | |
|---|---|---|---|
| `wiredMinimapEnabled` | world | on | Player auto-open + button for players |
| `wiredMinimapScale` | client | 1 (0.6–1.6) | Window size in both modes |
| `wiredMinimapRatings` | client | on | `R#` labels on node glyphs |
| `wiredMinimapDim` | client | on | Extra canvas dim while Jacked In |

**Edges — built in B41b (0.1.83).** Board nodes carry undirected `links: [nodeId, …]`, normalized and mirrored in `getBoard`. The Director edits them with the **Links** checkboxes in the Console detail panel (`setLink` keeps both ends in sync; deleting a node strips its back-links). The minimap draws SVG wires behind the nodes between visible endpoints only. Players see a wire only when both ends are revealed. The GM Director view also draws wires to hidden nodes, dashed grey. Wires are cyan in Overlay and hot pink when Jacked In. Spike + checklist: `docs/spikes/B41b-WIRED-MINIMAP-EDGES.md`.

**Performance.** One DOM button per visible node; no canvas drawing. Re-render only on board / token / node-actor changes on the viewed Scene; `controlToken` re-evaluates state but only re-renders on a mode change.

## Foundry-verify checklist
1. **Overlay:** Director reveals 2–3 nodes in the Console. Player's hero uses *Connect* → map opens bottom-right; canvas still readable with the Overlay wash; only revealed nodes show.
2. **Reveal live:** Director reveals another node → it appears on the player's map without reopening. Hiding it again removes it.
3. **Place live:** Director *Place on canvas* → node moves from the ring / bottom row to a position matching its token; dragging the token re-lays the map. Click it → player's view pans to the token.
4. **Tooltip:** hover shows name, Track · R#, Integrity (or *No ICE* for Track 1), Trace Alert + band. Director raising Alert changes the glow colour; 12 pulses red.
5. **Jacked In:** *Toggle Connection State* → map grows and centres, frame goes pink, meatspace goes very dark (Token Vision on). Toggle back → compact again, dim lifts.
6. **Jack Out** → map closes. Close it by hand while connected → it stays closed until the state changes; the Token-controls button reopens it.
7. **Linked matrix map:** on a Scene with *Wired map for* set, the player map shows the board Scene's nodes.
8. **Settings:** turn *Wired Node Map for players* off → map closes and doesn't reopen; size slider resizes; *Show node Ratings* off hides `R#`; *Dim the canvas* off → Jacked In keeps only the B23c vision.
9. **GM:** no auto-open for the Director; the button opens a Director view with hidden nodes dashed.
