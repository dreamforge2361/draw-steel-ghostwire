# Ghostwire Foundry Notes — The Wired (B23a sheet, B23b console, B117 node verbs)

**Status:** v1 (2026-09-16), **B117 all-nine node-facing verbs 2026-09-20 / 0.3.53**, **Linked connection state 2026-09-20 / 0.3.56** (pending Michael’s Foundry test).
**Source of record for rules text:** `docs/raw/21-the-wire.md` — Connection States and Matrix Verbs. This page only describes how Foundry implements them; if the two disagree, RAW wins and this page (and the pack) gets fixed.
**Console:** B23b — see *Wired Console* below. **B117** — all nine Matrix Verbs fire from the **node facing the player** (Director Console still has the same strip).

## Matrix Verbs — node applet (B117)

The nine Matrix Verbs still exist (Ghostwire Abilities › **Matrix Verbs**). They all have the **Wired** keyword and cost no heroic resource: they’re universal, not Hacker Programs, so Bandwidth isn’t involved. They do **not** live on the hero sheet.

**Node fires (player path):** all nine — Connect, Jack Out, Toggle Connection State, Scan, Navigate, Ping, Broadcast, Search, Read/Write. The player opens the **Wired node facing them** (node token, Token HUD, minimap click, or node sheet). **Connect** is on that applet (works while Disconnected) and requires a **Wire interface**: tagged comms (Burner, street **Commlink**, Pocket Sec, Ghost Relay, Corp Blacklink), a deck / RCC / kit deck, chrome datajack / trodes / Hot-Sim, or **Technomancer** class (deckless Resonance). Without one, Connect warns in chat: “Need a comlink, deck, datajack, or trodes — or be a Technomancer.” Draw Steel’s ability power-roll path uses **that player’s actor**. **Hacking** and **Jacked In** edges, plus a running **Reader** program, still apply through the existing Wired `AbilityModel#use` patch — a Hacker with Padlock-6 + Reader still rolls better than a street punk with a Burner. Hacker Bandwidth Programs stay on the sheet. Connection status icons stay on the token.

**Director Console** still shows the board and connection roster, and can fire the same nine verbs. Console and node panel share `useConsoleVerb`. Players do **not** depend on the GM owning or clicking the Console.

| Verb | Home | Action | Roll |
|---|---|---|---|
| Connect | Node panel (and Console) | Maneuver | Instinct |
| Jack Out | Node panel (and Console) | Maneuver (free triggered action in an emergency, per its text) | Instinct |
| Toggle Connection State | Node panel (and Console) | Free maneuver | None — automatic |
| Scan | Node panel (and Console) | Maneuver | Instinct |
| Navigate | Node panel (and Console) | Maneuver | Instinct |
| Ping | Node panel (and Console) | Maneuver | Logic |
| Broadcast | Node panel (and Console) | Maneuver | None — automatic |
| Search | Node panel (and Console) | Maneuver | Logic |
| Read/Write | Node panel (and Console) | Maneuver | Logic |

Rolling verbs show the low / middle / high result text from the shipped verb cards (incomplete / clean / maneuver refund). **Soft Trace:** a tier-1 Connect / Jack Out / Ping / Navigate / Search / Read-Write may +1 Trace Alert on the selected node. **Scan** does not auto-move Trace — observation doctrine. Toggle and Broadcast have no roll. Middle and high never raise Trace.

Existing worlds: the first GM load strips **all nine** Matrix Verbs off every actor (heroes, imported pregens, Wire Kit NPCs, Mama) so they don’t have two homes (`matrixVerbsApplet`). They are gone from hero `defaultItems`, the NPC Wire Kit stamp, pregen pack actors (none were embedded), and Mama Cassavir’s bestiary items. Revealed node tokens get **OBSERVER** default ownership so players can open the node they’re facing.

## Connection states

A hero is **Disconnected**, **Linked**, **Overlay**, or **Jacked In**. The state shows as a status icon on the hero’s token (Linked: aura `ghostwire-linked`, Overlay: eye `ghostwire-overlay`, Jacked In: lightning `ghostwire-jacked-in`), in the sheet’s status list, and in a **Wired** box on the Stats tab.

- **Connect** (only while Disconnected, and only with a Wire interface or Technomancer Resonance) → **Linked**, on any result.
- **Toggle Connection State** (any on-net state) steps deeper, then wraps: **Linked → Overlay → Jacked In → Linked**. One button, one direction. Jack Out is the only path to Disconnected.
- **Jack Out** (any on-net state: Linked, Overlay, or Jacked In) → Disconnected.
- **Broadcast** works from Linked (and Overlay / Jacked In).
- Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs refuse while Linked-only or Disconnected — they need Overlay or Jacked In.
- The GM can also set or clear the three statuses from the token HUD; Linked, Overlay, and Jacked In replace each other.

Automated modifiers on **ability** power rolls:

| State | Wired abilities (Wired keyword) | Real-world abilities |
|---|---|---|
| Disconnected | — | — |
| Linked | Broadcast / Toggle / Jack Out only. No Overlay bane, no Jacked In edge | — (normal) |
| Overlay | — | Bane |
| Jacked In | Edge | Can’t be used (body inert) |

Also automated: a hero with the **Hacking** skill gets an edge on the rolling Matrix Verbs (and any other Wired ability). A running **Reader** program still edges Scan / Search / Deep Scan. Linked is **Wire-discoverable** (soft presence) for Scan / Search / Watchdog.

Not automated: the Overlay bane on tests (make it in the test dialog), biofeedback scaling. Node / Console verbs apply **soft Trace** on a tier-1 active rolled verb (not Scan), as above.

For the Wired Console, the state is also stored on the actor as `flags.draw-steel-ghostwire.wired = { connected, immersed, state }`, with `state` being `"disconnected"`, `"linked"`, `"overlay"`, or `"jackedIn"`. `connected` is true for any on-net state (Linked included). `immersed` is true only for Overlay or Jacked In.

## Wired Console (B23b)

A popout window that makes the net a shared place for the scene everyone is viewing.

**Open it:** the **network** button in the Token controls (left toolbar), or assign a key to *Open the Wired Console* under Configure Controls (no default key). The same button or key closes it. Macro: `game.modules.get("draw-steel-ghostwire").api.openWiredConsole()`.

### Panels

- **Connections** — every actor with a token on the viewed scene, with its connection state (Jacked In first, then Overlay, then Linked, then Disconnected). Click a row to select the runner who will fire Console verbs (defaults to the active combatant, else the first on-net actor). It reads the same token statuses the Matrix Verbs set, so it always matches the token icons and updates live. Players only see actors they own.
- **Matrix Verbs (B117)** — all nine. **Players fire these from the node they’re facing** (token / node panel), including Connect. The Console strip is the Director roster path. Connect works while Disconnected if the runner has a commlink / deck / datajack / trodes (or is a Technomancer) and lands in **Linked**. Broadcast / Toggle / Jack Out work from Linked. Scan / Navigate / Ping / Search / Read-Write need Overlay or Jacked In. Rolls that actor’s Instinct or Logic where the card rolls; Hacking / Jacked In / Reader edges apply (Linked adds neither). Soft Trace on a tier-1 active rolled verb (not Scan).
- **Nodes** — the scene’s nodes: Track, Rating, an Integrity bar (Track 2), and a mini Trace Alert track. The eye icon (Director only) shows whether players can see the node.
- **Selected node** — the System Stat Card read off the Node Rating (08-hacker.md): Breach DC, ICE layers, Biofeedback Value with the Overlay (×0.5, min 1) and Jacked In (×1.5) figures, Integrity, and the 12-step Trace Alert with what the current band does. Track 1 nodes have no Integrity or ICE.
- **Wire (B106 ping/spoof)** — a log of the last ~20 Director pings, visible to anyone with the Console open. The Director types a short line and **Send**. Chat is **public** or a **whisper** to users whose controlled token is on-net (Linked, Overlay, or Jacked In). Stored on `flags.draw-steel-ghostwire.wiredPings` (also reads `wiredBoard.pings`). Does not move Trace. Players cannot send.

### Director vs. players

| | Director (GM) | Players |
|---|---|---|
| Matrix Verbs | Fire all nine for any roster actor they select | Fire from the **node token / panel** they’re facing (owned actor). Connect works while Disconnected (lands Linked). Console strip also works for owned actors |
| Nodes | All; add, **random node**, **generate cluster**, edit (name, Track, Rating), delete, reset the board | Only nodes the Director revealed; read-only |
| Integrity | Damage / Restore by an amount | See the bar and numbers |
| Trace Alert | −, +, **Counter-trace (12)**, and **Resolved — reset to 6** at 12 | See the track and band text |
| Description | Edit | Read (once revealed) |
| Notes | Edit; Director-only | Hidden |
| Reveal | **Reveal to players** / **Hide from players** | — |

**Random nodes.** In the Nodes panel title, the **dice** button rolls one themed node and the **cluster** button opens a dialog to roll 1–12 at once. Each rolled node gets a name, Track, a Rating within the stratum’s band (nudged by its owner), a player-facing **Description** (the icon, the owner’s skin, and what Matrix Verbs can do with it), and Director **Notes** (the owner and what’s buried inside). Rolled nodes start hidden. The strata follow Ossian Reach: **Spires** R3–5, **Grid** R2–4, **Flats** R1–3, **Warrens** R1–3, **Sinks** R1–2, or a **Random mix**. The stratum picked in the cluster dialog is saved on the scene and used by the dice button. The tables live in `scripts/wired-node-table.mjs`, and `api.rollNode(stratum)` returns a node without adding it.

Reveal is manual in v1: when a runner Scans, the Director reveals what they found. Revealing a node posts a public **Node revealed** card to chat with its name, Track, Rating, and Description (Notes are never posted). Hiding it again posts nothing. Changing a node’s Rating resets its Integrity maximum from the stat card (a full pool stays full). Reaching Trace Alert 12 posts a persistent warning to the Director: full lockout and counter-trace, then reset the track to 6.

### Wired maps and node tokens (B32 Phase 5b)

**Wired map.** When the party goes fully Jacked In and you move them to a matrix battle map, view that map and use **Wired map for** in the Console header (Director) to pick the meatspace Scene whose board it should use. The Console then shows and edits that board while you view the map; the **Connections** panel still lists the tokens on the map you're viewing. Choose **This Scene** to unlink. Stored as `flags.draw-steel-ghostwire.wiredMapFor = <board Scene id>` on the map Scene.

**Place on canvas.** Select a node and press **Place on canvas** (Director): it creates a linked Actor named after the node in the **Wired Nodes** Actor folder, from the *Wired Node (Track 1/2)* template in Ghostwire Summons & Machines, and drops its token at the centre of the view (stepping right for each node already placed). The token is **hidden until the node is revealed**; revealed node Actors get **OBSERVER** default ownership so players can open them. Track 2 tokens show an **Integrity bar** (their Stamina), Track 1 tokens show none. Double-click / Token HUD / minimap opens the **Wired node panel** (Matrix Verbs), not the monster sheet. A pin icon in the node list marks placed nodes. **Remove from canvas** deletes the token and Actor; the node stays on the board.

**Auto-nodes from Scene (B112).** Director-only lightbulb on the Nodes header. On the **viewed** Scene it reads named lights and wall doors (`door != NONE`):

- **Lights.** Name pattern **`{Room Name} - {rest…}`** (space-hyphen-space required). Room = everything left of the first ` - `. Light Control node stays **`{Room} - Light Control`** (or matches the light name). Example: `Rear Car Substation - Light Control` → **Rear Car Substation - Light Control** (Track 1 Rating 1). Lights with no ` - ` are **skipped** and the GM gets a warning. Hidden token next to the first non-cam light in that room.
- **Doors.** Assigned to the nearest light’s room (or the wall’s own name). **Track 1 Rating 2** `{Room} - Maglock Door 1`, `{Room} - Maglock Door 2`, … per room (same ` - ` splitter; not `{Room} Maglock Door 1`); hidden token next to the door. Light Control ↔ maglocks in the same room are linked.
- **Cam lights.** If `rest` contains Cam / Camera, that light becomes **`{Room} - Cam Controls N`** (Track 1 Rating 1, `cam-controls` art) instead of joining the Light Control `lightIds`. Linked to the same-room Light Control when one exists.
- Re-run **skips** nodes already flagged `autoFrom` (or **Replace** to rebuild). The Wire does not flip lights, doors, or cameras in v1. Auto-node tokens use B113 library art (`assets/tokens/wired/node-light-control.webp`, `node-maglock.webp`, `node-cam-controls.webp`). Generic Track 1/2 templates stay when `tokenStyle` is empty. Director **Token art** select (B116) picks any catalog style (eight device arts plus atlas Relay / Host / Segment, plus Ten Conglomerates Host skins). Does not rewrite Gold Line walls/lights/tiles.

**Wire Kit (B115 / B117).** NPCs do not receive Matrix Verbs by default. Drop **Wire Kit — Matrix Verbs** (Ghostwire Matrix › Support) onto an NPC, or use the Console / token HUD **Add Wire Kit** on selected NPC tokens. The kit marks them Wire-capable; it does **not** copy the nine verbs onto the sheet. All nine fire from the node a runner is facing (and from the Console). Stamp ARG security that should act on the Wire; leave meat-only thugs clean. Heroes use the same applet. Node tokens do not get Add Wire Kit.

**Sync.** The board is the source of truth. Console edits (name, Track, Rating, Integrity damage/restore, reveal/hide) update the placed token and Actor; damage applied to a Track 2 node token (Draw Steel's damage buttons, the sheet, or the bar) writes Integrity back to the board. Deleting a node or resetting the board removes its token and Actor; deleting a node token by hand removes the Actor, and the Console offers **Place on canvas** again. Actor flags: `{ kind: "node", boardSceneId, nodeId, track }` plus `autoFrom` / `autoKind` for B112. Trace Alert, Description, and Notes stay in the Console.

### Wire Atlas tokens (B116)

Topology rules live in RAW (`docs/raw/21-the-wire.md`, Wire Atlas / topology) and the spike (`docs/spikes/B116-WIRE-ATLAS.md`). Michael atlas art shipped **0.3.51**. The **Token art** picker already shipped in **0.3.49** (PR **#34**); atlas rows list in that select. Place / sync stamps `node-relay.webp` / `node-host.webp` / `node-segment.webp`. Megacorp Host skins (`node-host-hal` … `node-host-nyx`) shipped **0.3.54**; generic **Host** stays the default. Do **not** regenerate art.

| Altitude | Scene | Token styles | Auto-nodes |
|---|---|---|---|
| Region / district | Switchboard district map | `node-relay`, `node-host` | Never |
| Site / facility | Power Co Wire scene | `node-segment` (+ Host as site root) | Never |
| Room / device | Office, Gold Line car, maintenance room | Existing device library | **Yes** (B112, room-scale only) |

Catalog: `assets/tokens/wired/library.json`. Atlas files: `assets/tokens/wired/node-relay.webp`, `node-host.webp`, `node-segment.webp` (png source + webp; `"placeholder": false`). Eight device styles shipped **0.3.49**. Ten megacorp Host skins **0.3.54**. **Endpoint** is optional v1.1.

Directors place atlas tokens by hand on the matching Scene. Scan **Reach** is hops on **that** Scene’s board, not the whole district. Do not force-overwrite Gold Line to stamp atlas tokens.

### Data

The board is stored on the Scene, so it persists across reloads and belongs to that scene:

```
flags.draw-steel-ghostwire.wiredBoard = {
  nodes: [{ id, name, track: 1|2, rating: 1–5, integrity, integrityMax, alert: 0–12, revealed, description, notes, links, autoFrom?, tokenStyle? }],
  stratum: "random" | "spires" | "grid" | "flats" | "warrens" | "sinks",
  updated: <timestamp>
}

flags.draw-steel-ghostwire.wiredPings = {
  entries: [{ id, text, whisper, at, user }],  // last ~20; Console log
  updated: <timestamp>
}
```

Only a GM can change it. Connection state is read from actor statuses (and mirrored to `flags.draw-steel-ghostwire.wired`), not stored on the board. Wire pings persist separately from **Reset Board**.

**Not in this slice:** no ICE automation; no Bandwidth display. All nine Matrix Verbs are on the node applet. (Cross-scene Wired maps and node tokens shipped in B32 Phase 5b, above. Wire ping/spoof shipped in 0.3.45. Node-facing Matrix Verbs + soft Trace shipped in B117.)

## Wired vision (B23c)

While a hero is **Overlaid**, their token's view gets a readable cyan/pink HUD wash; while **Jacked In**, meatspace drops into deep, desaturated shadow and only coloured light (neon, node glow) stays bright. **Disconnected** and **Linked** are normal vision (Linked is comms-only; no AR wash). The tint follows the status, so Connect, Toggle Connection State, Jack Out, and the token HUD all switch it, and the three on-net statuses replace each other rather than stacking.

It uses Foundry vision modes (*Wired Overlay*, *Jacked In*), so it follows Foundry's vision rules: it shows on the client looking through that token (the players who own it, or a GM who controls it), only on Scenes with **Token Vision** enabled and for tokens with vision. Other players, and a GM with no token selected, see normally. The token's own vision settings aren't changed. Code: `scripts/wired-vision.mjs`.
