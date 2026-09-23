# Ghostwire Foundry Notes — The Wired (B23a sheet, B23b console, B117 node verbs)

**Status:** v1 (2026-09-16), **B117 all-nine node-facing verbs 2026-09-20 / 0.3.53**, **Linked connection state + Console pan-to-node 2026-09-20 / 0.3.56**, **Linked documented in RAW journals + VOIDMARK index 2026-09-20 / 0.3.57**, **Ping vs Read/Write doctrine 2026-09-20 / 0.3.62**, **node Actors always Connected on the Console roster 2026-09-20 / 0.3.63**, **Console revealed-first A–Z lists + sheet hide for temp Matrix Verbs 2026-09-20 / 0.3.64**, **ready leftover strip does not pass Array index as a flag scope 2026-09-20 / 0.3.66**, **hero/NPC Has Vision on (`sight.enabled`) 2026-09-20 / 0.3.67**, **Wire Kit is a Connect interface 2026-09-20 / 0.3.68**, **Constructs roster (sprites/Agents) 2026-09-20 / 0.3.78** (pending Michael’s Foundry test).
**Source of record for rules text:** `docs/raw/21-the-wire.md` — Connection States and Matrix Verbs. This page only describes how Foundry implements them; if the two disagree, RAW wins and this page (and the pack) gets fixed.
**Console:** B23b — see *Wired Console* below. **B117** — all nine Matrix Verbs fire from the **node facing the player** (Director Console still has the same strip).

## Matrix Verbs — node applet (B117)

The nine Matrix Verbs still exist (Ghostwire Abilities › **Matrix Verbs**). They all have the **Wired** keyword and cost no heroic resource: they’re universal, not Hacker Programs, so Bandwidth isn’t involved. They do **not** live on the hero sheet.

**Node fires (player path):** all nine — Connect, Jack Out, Toggle Connection State, Scan, Navigate, Ping, Broadcast, Search, Read/Write. The player opens the **Wired node facing them** (node token, Token HUD, minimap click, or node sheet). **Connect** is on that applet (works while Disconnected) and requires a **Wire interface**: tagged comms (Burner, street **Commlink**, Pocket Sec, Ghost Relay, Corp Blacklink), a deck / RCC / kit deck, chrome datajack / trodes / Hot-Sim, **Wrench drone control** (an RCC or **Rigger’s Harness** — Harness ≡ deck), **Wire Kit — Matrix Verbs** on an NPC, drone, or vehicle (Director stamp / pack drones and vehicles; no extra commlink), or **Technomancer** class (deckless Resonance). Without one, Connect warns in chat: “Need a comlink, deck, rigger interface, datajack, or trodes — or be a Technomancer.” Draw Steel’s ability power-roll path uses **that player’s actor**. **Hacking** and **Jacked In** edges, plus a running **Reader** program, still apply through the existing Wired `AbilityModel#use` patch — a Hacker with Padlock-6 + Reader still rolls better than a street punk with a Burner. Hacker Bandwidth Programs stay on the sheet. Connection status icons stay on the token.

**0.3.60 fire path:** `useConsoleVerb` temporarily embeds the verb on the actor (flag `temporaryConsoleVerb`, `render: false`) and calls `AbilityModel#use`. Draw Steel 1.1.2 will not complete a power roll / chat card for a parented-but-unembedded Item.

**0.3.61 chat card:** do **not** delete that embed in a `finally` as soon as `use()` returns. Draw Steel 1.1.2 AbilityUsePart / AbilityResultPart `fromUuidSync(abilityUuid)` for the ability embed and `powerRollText` (Search tier1/2/3 display strings). Immediate delete produced **Failed to Find Item for this ability roll** and no flavor. Keep the temp after a successful card; reuse it on the next fire of the same verb; drop it only if this call created it and the player cancelled. Do **not** grant the nine as permanent sheet abilities.

**0.3.64 sheet hide:** 0.3.61’s `hideTemporaryConsoleVerbs` looked for `data-item-id` / `data-entry-id`, but Draw Steel 1.1.2 ability rows use **`data-document-uuid`** and `_prepareAbilitiesContext` (which already honors `flags.draw-steel.hideInSheet`). After Ping (or any of the nine) fires, the temp embed stayed in the actor collection so chat could resolve — and it showed on the hero/NPC sheet. Hide now: (1) stamp `hideInSheet` on every temp, (2) wrap `_prepareAbilitiesContext` to drop all nine dsids, (3) CSS + render hooks on Draw Steel hero/NPC/retainer sheets and `renderActorSheet` / `renderActorSheetV2`, matching `data-document-uuid`. Ready still strips **orphan** temps that are not backing an open chat `abilityUuid`; keepers stay embedded (and hideInSheet) so tier text keeps working. The one-time `matrixVerbsApplet` strip is unchanged for old permanent grants.

**0.3.66 flag scope:** do **not** pass `isTemporaryConsoleVerb` / `isOffSheetMatrixVerb` bare to `Array.filter` / `map`. Those helpers take an optional module id; `filter` supplies the index, so index `0` became Foundry `getFlag(0, "temporaryConsoleVerb")` and world setup threw `Flag scope "0" is not valid or not currently active`. Wrap `item => isTemporaryConsoleVerb(item)`. If the second argument is not a non-empty string, ignore it and use `MODULE_ID`.

**0.3.68 Wire Kit interface:** `itemIsConnectInterface` treats **Wire Kit — Matrix Verbs** (`kind: "wire-kit"` / `_dsid` `wire-kit-matrix-verbs`) as a Connect interface. Pack JSON and HUD grant also stamp `wired.connectInterface`. Existing world copies that only have `kind` (no flag) still pass. NPCs, drones, and vehicles Connect → Linked without a separate commlink. Do **not** require matrix role `rcc` for the kit path. **Pack drones and vehicles** (all nine `machine-*` band templates) embed the kit so imports/deploys are Wire-ready; they stay Disconnected until Connect. World ready stamps missing kits onto `kind: "drone"` and `kind: "vehicle"` actors. **0.3.78:** AEQ Mandate Trooper / Sergeant and LAZ Extract Medic / Chief Medic also embed Wire Kit (first bestiary defaults; still Disconnected until Connect). **Wrench drone control (RCC or Rigger’s Harness) counts as a Connect interface** (Harness ≡ deck). Fabricator’s Bench and Field Chassis are not interfaces. Generic **Drone (Medium)** uses the Mule-Bot cargo plate as band art; **Mule-Bot** Deploy stamps that band from the Vehicles treasure SKU (0.3.75). A named Summons Mule-Bot Actor is optional Director placement with the same plate plus Wire Kit. RAW `21-the-wire.md`, Foundry journals, and the VOIDMARK index match this allow-list. Verbs stay off the sheet.

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

Rolling verbs show the low / middle / high result text from the shipped verb cards (incomplete / clean / maneuver refund). **Soft Trace:** a tier-1 Connect / Jack Out / Ping / Navigate / Search / Read-Write may +1 Trace Alert on the selected node. **Scan** does not auto-move Trace — observation doctrine. Toggle and Broadcast have no roll. Middle and high never raise Trace. **Ping vs Read/Write:** Ping is a Track 1 nudge/test (lights; “does it answer?”; one-frame glitch) — not maglock unlock or lasting cam-off. Those are Read/Write. **Ping vs ICE:** Track 1 only (no ICE). ICE is Track 2. Ping does not bypass or defeat ICE; an ICE-guarded / Track 2 host is Programs / payload Runs / real breach. Director may flavor a failed poke (ICE twitches, Soft Trace) but Ping never opens or controls the guarded system. Ping is not the B106 Console Wire ping/spoof log.

Existing worlds: the first GM load strips **all nine** Matrix Verbs off every actor (heroes, imported pregens, Wire Kit NPCs, Mama) so they don’t have two homes (`matrixVerbsApplet`). They are gone from hero `defaultItems`, the NPC Wire Kit stamp, pregen pack actors (none were embedded), and Mama Cassavir’s bestiary items. Revealed node tokens get **OBSERVER** default ownership so players can open the node they’re facing.

## Connection states

A hero is **Disconnected**, **Linked**, **Overlay**, or **Jacked In**. The state shows as a status icon on the hero’s token (Linked: aura `ghostwire-linked`, Overlay: eye `ghostwire-overlay`, Jacked In: lightning `ghostwire-jacked-in`), in the sheet’s status list, and in a **Wired** box on the Stats tab.

- **Connect** (only while Disconnected, and only with a Wire interface, Wire Kit, Rigger interface, or Technomancer Resonance) → **Linked**, on any result.
- **Toggle Connection State** (any on-net state) steps deeper, then wraps: **Linked → Overlay → Jacked In → Linked**. One button, one direction. Jack Out is the only path to Disconnected.
- **Jack Out** (any on-net state: Linked, Overlay, or Jacked In) → Disconnected.
- **Broadcast** works from Linked (and Overlay / Jacked In).
- Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs / **Compile Agent** refuse while Linked-only or Disconnected — they need Overlay or Jacked In.
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

**Compile Agent (B120).** Hacker L1 grant. **Use** from the Abilities tab opens the archetype picker and places a token (`scripts/agents.mjs`); the Compile Agent sheet button and row menu still compile. Overlay or Jacked In; Linked warns and refuses (no silent miss). **3 Bandwidth** in combat. Dialog picks **Probe / Spike / Daemon / Watchdog** from Summons › Agents (not sprite SKUs). Cap 2 → 3@5 → 4@8; Use at cap commands instead of compiling another. **Decompile Agent** Use (and the free maneuver / roster ✕) dismisses; no immersion gate. 0 Stamina / end of encounter also decompile. Watchdog Agent is the Hacker screen pet — not Watchdog ICE.

For the Wired Console, the state is also stored on the actor as `flags.draw-steel-ghostwire.wired = { connected, immersed, state }`, with `state` being `"disconnected"`, `"linked"`, `"overlay"`, or `"jackedIn"`. `connected` is true for any on-net state (Linked included). `immersed` is true only for Overlay or Jacked In.

## Wired Console (B23b)

A popout window that makes the net a shared place for the scene everyone is viewing.

**Open it:** the **network** button in the Token controls (left toolbar), or assign a key to *Open the Wired Console* under Configure Controls (no default key). The same button or key closes it. Macro: `game.modules.get("draw-steel-ghostwire").api.openWiredConsole()`.

### Panels

- **Connections** — every actor with a token on the viewed scene, with its connection state. Sort is **revealed Wire nodes first, then A–Z by display name** (runners have no `revealed` flag, so they sit in the A–Z group with hidden nodes). Hover a truncated name for the full string (`title` + `data-tooltip`). Click a **runner** row to select who will fire Console verbs (defaults to the active combatant, else the first on-net runner). **Wire node Actors** (`kind: "node"` — placed board nodes, Hotel Interface, Light Control, maglocks) always chip **Connected**; they are infrastructure on the Wire, never Disconnected. They are **not** the Matrix Verb actor: clicking a node row selects/pans that board node and leaves the last runner on the verb strip. **Sprites and Agents** (`kind: "sprite"` / `kind: "agent"`) are **not** listed here — they live on **Constructs**. Players only see actors they own.
- **Constructs (B121 / 0.3.78)** — compiled Technomancer sprites and Hacker Agents. Rows show name, archetype, Stamina (current/max), hybrid band, compiler, and an optional Wire **face** chip (nearest placed node or a stored `wiredFace` id) **without** adding edges to `wiredBoard.nodes[].links`. **Visibility:** Director; owner (construct or compiler); **and** Overlay / Jacked In compilers on the same scene see each other’s constructs **without Scan** (Linked does not). Click / pan pans to the scene token **only for owner / Director** (Lock A: the token is a meat-side roster anchor — peer visibility is Console-only and does not reveal the token). **Command** opens the compiler’s Compile Sprite / Compile Agent sheet — it does not spawn a second construct. **Decompile** calls the existing `decompileSprite` / `decompileAgent` APIs. Sort is **anchored (has a scene token) first, then sprites before Agents, then A–Z**. Meat bridging and construct auto-initiative are out of scope.
- **Matrix Verbs (B117)** — all nine. **Players fire these from the node they’re facing** (token / node panel), including Connect. The Console strip is the Director roster path. Connect works while Disconnected if the runner has a commlink / deck / datajack / trodes / **Wire Kit** / **RCC or Rigger’s Harness** (or is a Technomancer) and lands in **Linked**. Broadcast / Toggle / Jack Out work from Linked. Scan / Navigate / Ping / Search / Read-Write need Overlay or Jacked In. Rolls that actor’s Instinct or Logic where the card rolls; Hacking / Jacked In / Reader edges apply (Linked adds neither). Soft Trace on a tier-1 active rolled verb (not Scan). The nine never appear on the Draw Steel hero/NPC sheet (see 0.3.64 hide path above).
- **Nodes** — the scene’s nodes: Track, Rating, an Integrity bar (Track 2), and a mini Trace Alert track. Sort is **revealed first, then A–Z by name** (Director: revealed A–Z, then hidden A–Z; players only see revealed, so A–Z). Hover a truncated name for the full string. The eye icon (Director only) shows whether players can see the node.
- **Selected node** — the System Stat Card read off the Node Rating (08-hacker.md): Breach DC, ICE layers, Biofeedback Value with the Overlay (×0.5, min 1) and Jacked In (×1.5) figures, Integrity, and the 12-step Trace Alert with what the current band does. Track 1 nodes have no Integrity or ICE.
- **Wire (B106 ping/spoof)** — a log of the last ~20 Director pings, visible to anyone with the Console open. The Director types a short line and **Send**. Chat is **public** or a **whisper** to users whose controlled token is on-net (Linked, Overlay, or Jacked In). Stored on `flags.draw-steel-ghostwire.wiredPings` (also reads `wiredBoard.pings`). Does not move Trace. Players cannot send.
- **Constructs (Lock A — later UI).** A **separate section** from the node graph for compiled sprites, Agents, and independent spirits. Do not list pets as nodes. Until the pane ships, use the summon / Compile roster on the ability sheet. RAW: `21` Construct Wire visibility + Pet Stamina lock in `22`.

### Director vs. players

| | Director (GM) | Players |
|---|---|---|
| Matrix Verbs | Fire all nine for a **runner** in Connections (Wire node rows stay Connected infrastructure and never become the verb actor; Constructs are not verb actors) | Fire from the **node token / panel** they’re facing (owned actor). Connect works while Disconnected (lands Linked). Console strip also works for owned runners |
| Constructs | All compiled sprites/Agents whose token or compiler is on the viewed scene; pan, Command (opens Compile sheet), Decompile | Owned constructs: pan / Command / Decompile. Overlay / Jacked In on this scene also **see** other Overlay / Jacked In compilers’ constructs (no Scan; no pan / Command / Decompile; tokens stay meat-side) |
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

**Pan to node.** Selecting or clicking a node in the Director Console list (or a placed node on the minimap) **pans and centers** the canvas on that token (`canvas.animatePan`) and **controls** it when the user can (Director / owner). Unplaced nodes and tokens hidden from this user still select in the list with no error. **Pan to construct** does the same for a sprite/Agent token from the Constructs list. Shared helper: `scripts/wired-canvas-focus.mjs`.

**Auto-nodes from Scene (B112).** Director-only lightbulb on the Nodes header. On the **viewed** Scene it reads named lights and wall doors (`door != NONE`):

- **Lights.** Name pattern **`{Room Name} - {rest…}`** (space-hyphen-space required). Room = everything left of the first ` - `. Light Control node stays **`{Room} - Light Control`** (or matches the light name). Example: `Rear Car Substation - Light Control` → **Rear Car Substation - Light Control** (Track 1 Rating 1). Lights with no ` - ` are **skipped** and the GM gets a warning. Hidden token next to the first non-cam light in that room.
- **Doors.** Assigned to the nearest light’s room (or the wall’s own name). **Track 1 Rating 2** `{Room} - Maglock Door 1`, `{Room} - Maglock Door 2`, … per room (same ` - ` splitter; not `{Room} Maglock Door 1`); hidden token next to the door. Light Control ↔ maglocks in the same room are linked.
- **Cam lights.** If `rest` contains Cam / Camera, that light becomes **`{Room} - Cam Controls N`** (Track 1 Rating 1, `cam-controls` art) instead of joining the Light Control `lightIds`. Linked to the same-room Light Control when one exists.
- Re-run **skips** nodes already flagged `autoFrom` (or **Replace** to rebuild). The Wire does not flip lights, doors, or cameras in v1. Auto-node tokens use B113 library art (`assets/tokens/wired/node-light-control.webp`, `node-maglock.webp`, `node-cam-controls.webp`). Generic Track 1/2 templates stay when `tokenStyle` is empty. Director **Token art** select (B116) picks any catalog style (eight device arts plus atlas Relay / Host / Segment, plus Twelve Conglomerates Host skins including AEQ/LAZ). Does not rewrite Gold Line walls/lights/tiles.

**Wire Kit (B115 / B117 / 0.3.68).** NPCs do not receive Matrix Verbs by default. Drop **Wire Kit — Matrix Verbs** (Ghostwire Matrix › Support) onto an NPC, drone, or vehicle, or use the Console / token HUD **Add Wire Kit** on selected NPC tokens. The kit marks them Wire-capable **and is a Connect interface** — Console Connect enables and lands **Linked** without a separate commlink (or RCC role). It does **not** copy the nine verbs onto the sheet. All nine fire from the node a runner is facing (and from the Console). **Pack drones and vehicles** ship with the kit already embedded (Wire-ready imports; still Disconnected until Connect). Stamp ARG security; leave meat-only thugs clean. Heroes use the same applet. Node tokens do not get Add Wire Kit. **Wrench drone control (RCC or Rigger’s Harness) counts as a Connect interface:** a Wrench with Rigger’s Harness or an RCC (Remote Box, Fleet Deck, War Table, Command Rig, Hydra Console) can Connect like a deck owner. Fabricator’s Bench and Field Chassis do not.

**Sync.** The board is the source of truth. Console edits (name, Track, Rating, Integrity damage/restore, reveal/hide) update the placed token and Actor; damage applied to a Track 2 node token (Draw Steel's damage buttons, the sheet, or the bar) writes Integrity back to the board. Deleting a node or resetting the board removes its token and Actor; deleting a node token by hand removes the Actor, and the Console offers **Place on canvas** again. Actor flags: `{ kind: "node", boardSceneId, nodeId, track }` plus `autoFrom` / `autoKind` for B112. Trace Alert, Description, and Notes stay in the Console.

### Wire Atlas tokens (B116)

Topology rules live in RAW (`docs/raw/21-the-wire.md`, Wire Atlas / topology) and the spike (`docs/spikes/B116-WIRE-ATLAS.md`). Michael atlas art shipped **0.3.51**. The **Token art** picker already shipped in **0.3.49** (PR **#34**); atlas rows list in that select. Place / sync stamps `node-relay.webp` / `node-host.webp` / `node-segment.webp`. Megacorp Host skins (`node-host-hal` … `node-host-nyx`) shipped **0.3.54**; generic **Host** stays the default. Do **not** regenerate art.

| Altitude | Scene | Token styles | Auto-nodes |
|---|---|---|---|
| Region / district | Switchboard district map | `node-relay`, `node-host` | Never |
| Site / facility | Power Co Wire scene | `node-segment` (+ Host as site root) | Never |
| Room / device | Office, Gold Line car, maintenance room | Existing device library | **Yes** (B112, room-scale only) |

Catalog: `assets/tokens/wired/library.json`. Atlas files: `assets/tokens/wired/node-relay.webp`, `node-host.webp`, `node-segment.webp` (png source + webp; `"placeholder": false`). Eight device styles shipped **0.3.49**. Twelve Conglomerates Host skins: HAL…NYX shipped **0.3.54**; **AEQ** / **LAZ** plates shipped **0.3.79** (`node-host-aeq` / `node-host-laz`, `placeholder: false`). Brand marks: `assets/brands/megacorps/brand-{ticker}.{png,webp}`. **Endpoint** is optional v1.1.

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

### Token Has Vision (0.3.67)

Ghostwire turns **Has Vision** on (`prototypeToken.sight.enabled` / the placed token’s `sight.enabled`) for every **hero** and **npc** Actor it creates — world create, import from pack, drag from the compendium. Range, angle, and vision mode already on the prototype are left alone. A one-time GM ready pass does the same for existing world heroes/NPCs and their placed tokens.

**Not in scope:** Wire node Actors (`kind: node` / `node-template`), kiosks (`kind: kiosk`), and vehicle/drone machine stubs (`kind: vehicle` / `drone`). Those stay vision-off so they don’t punch fog as infrastructure tokens. Overlay / Jacked In tints still need the **Scene** Token Vision checkbox. Code: `scripts/token-vision.mjs`.
### Canvas sights (F20, 0.3.119)

`scripts/token-vision.mjs` owns **whether** a token sees. `scripts/sights.mjs` owns **what** it sees. A sight SKU declares its canvas effect on the Item:

```
flags.draw-steel-ghostwire.sightGrant = {
  modes: [{ id: "basicSight", range: 10, enabled: true }, { id: "seeAll", range: 5, enabled: true }],
  visionMode: "darkvision",
  priority: 1,
  claims: ["nightOptics", "thermal"],
  enableVision: false
}
```

Only **stock** Foundry ids are writable (`basicSight`, `lightPerception`, `seeInvisibility`, `senseInvisibility`, `feelTremor`, `seeAll`, `senseAll`; vision modes `basic`, `darkvision`, `monochromatic`, `blindness`, `tremorsense`, `lightAmplification`). Anything else in the flag is dropped rather than handed to Foundry. Ranges are in **squares** (the Draw Steel grid is `distance: 1`, `units: "sq"`), and `null` means unlimited.

**Three claims, three mappings.** A card may only claim what the canvas can do:

| Claim | Foundry | Printed as |
|---|---|---|
| `nightOptics` | `basicSight` (`DetectionModeDarkvision`) + the `darkvision` vision mode | "Darkvision N squares" |
| `thermal` | `seeAll` (`DetectionModeAll`, walls still block) | "Thermal N squares" |
| `veilGlimpse` | `seeInvisibility` | "See invisible N squares" |

Foundry ships **no thermal imager**, so Ghostwire defines thermal as `seeAll` at a printed range — one rule, on every card that claims heat. Through-wall and type-filtered detection (Penetration Optics, Detect the Supernatural, Cold Read) have **no** stock mode, so their cards say *Director call* instead of pretending.

Recompute runs on `createItem` / `updateItem` / `deleteItem` and on the Active Effect hooks (an installed mod ships its AE disabled), then writes `prototypeToken.detectionModes` plus every placed token of that Actor. A grant is live only while its source is: **F12 suppressed or destroyed chrome sees nothing**, and a mod grants nothing until it is installed and switched on. Everything written is recorded in `flags.draw-steel-ghostwire.sightApplied`, so removing the implant removes exactly those modes and restores the Director's own vision mode underneath. A one-time GM ready pass covers worlds from before 0.3.119.

`enableVision` is opt-in and shipped on exactly one SKU — the **Sensor Pod**, because a drone or vehicle with no Has Vision would read nothing through its own sensor. It never overrides token-vision's scope for heroes and NPCs. Code: `scripts/sights.mjs`, smoke `tools/f20-foundry-sights-smoke.mjs`.
