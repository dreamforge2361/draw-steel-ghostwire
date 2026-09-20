# Spike B116 — Wire Atlas topology (brief + rules)

**Date:** 2026-09-20  
**Locked:** 2026-09-20 (Michael)  
**Module:** **0.3.51** (art drop; topology brief **0.3.50**)  
**Status:** **SHIPPED** (docs + journal text **0.3.50**; Michael Relay / Host / Segment art **0.3.51**)  
**Pairs with:** B116 node-token library drop-in, **shipped 0.3.49** (PR **#34** merged). Device catalog + Token art picker are on main; topology + catalog stubs shipped **0.3.50**; this patch drops Michael atlas art at **0.3.51**. Mama is **0.3.48**.  
**Out of scope:** PDF rulebook redo (Michael: later). Gold Line `{ force: true }`. Regenerating art. New token types beyond Relay / Host / Segment (+ optional Endpoint note).

## Ask

Device tokens (Light, Maglock, Cam, ICE, …) answer **what is this socket**.  
Atlas tokens answer **where am I on the Wire map**.

Ship the locked topology brief into RAW, Hacker/Wired Foundry notes, Director cross-links, a Foundry journal page, and asset-path stubs so Relay / Host / Segment art can drop in without inventing a second catalog.

## Three altitudes

| Altitude | Scene example | Token family | What lives here |
|---|---|---|---|
| **Region / district graph** | Switchboard district map | **Relay**, **Host** | Highways and destinations. No devices. |
| **Site / facility graph** | Power Company Wire scene | **Segment** (+ **Host** as site root) | Nested places inside one Host. No room devices. |
| **Room / device graph** | Office, Gold Line car, maintenance room | Existing **Device** library | Maglock, Light Control, Cam, ICE, … |

Scan **Reach** = node-hops on the **graph of the current scene**, not the whole district and not Ossian Reach the campaign region.

## Atlas token IDs (art)

v1 ships three atlas styles. **Endpoint** is optional v1.1.

| id | Label | Role |
|---|---|---|
| `node-relay` | **Relay** | Major Wired highway / backbone traffic (a **path**, not a place) |
| `node-host` | **Host** | Destination place (corp, civic, street) — faction via name/color |
| `node-segment` | **Segment** | Child of a Host (substation, wing, server hall) |
| `node-endpoint` | **Endpoint** *(optional v1.1)* | Dig-down leaf that opens a meatspace room scene |

If art budget is tight, Endpoint can reuse Host with a depth pip later. Do **not** generate AI art this pass.

Foundry drop-in paths (png source + 1024² webp, B111/B113 convention):

```text
modules/draw-steel-ghostwire/assets/tokens/wired/node-relay.webp
modules/draw-steel-ghostwire/assets/tokens/wired/node-host.webp
modules/draw-steel-ghostwire/assets/tokens/wired/node-segment.webp
```

Catalog: `assets/tokens/wired/library.json` (Michael art, `placeholder: false` as of **0.3.51**). Device styles `light-control` / `maglock` live on PR #34 — merge by appending rows, do not rename B113 files. **0.3.54** appends megacorp Host skins (`node-host-{ticker}`); generic `node-host` stays the default Host — not a fourth atlas altitude.

## Dig-down procedure (table)

1. **District scene:** place **Relays** + **Hosts** only.  
2. **Enter Host** (Navigate / Seize / story) → load the **facility** scene; place **Segments** (Host may sit as the site root).  
3. **Enter Segment** (or Endpoint, when that style exists) → **room** scene; place **Device** tokens (B112 auto-nodes OK here).  
4. B112 auto-nodes remain **room-scale only**. Atlas tokens are **Director-placed** (Console picker is a follow-up on the library spike).

Device tokens never appear on region graphs. Atlas tokens are not auto-generated from lights/doors.

## Rules hooks (manuscript / Wire chapter)

- **Relay:** Navigate along it. Trace can travel fast on a Relay. Usually **not** Seize-for-loot. Node Rating optional (traffic density). Track 1 unless something is actively hunting the backbone.
- **Host:** Destination. May have Node Rating, ICE, Watchdog. Entering a Host **may change scene** (district → facility).
- **Segment:** Same mechanical class as Host, but nested. Name **must** include the parent (`Power Co — North Substation`).
- **Endpoint** (v1.1): a Segment/Host leaf whose payoff is opening the meatspace room, not a fourth mechanical class.
- **Device:** room sockets only (Light, Maglock, Cam, ICE, …). Never on a district graph.

Ghostwire words: **Relay**, **Host**, **Segment**, **Endpoint**, **Device**. Avoid “server farm” spam in player text.

## Director worked example — Switchboard → Power Co

Use this as the table’s first atlas run. Tokens below are the **v1 three**; devices only appear on the last scene.

### Scene A — Switchboard district graph (region)

Place Relays and Hosts only. Example board:

| Token | Style | Notes |
|---|---|---|
| **Flats Backbone** | Relay | Traffic highway through Cassavir’s hall. Navigate along; don’t loot it. Optional Rating 2 for density. |
| **Melt Market Trunk** | Relay | Side highway under the pink arterial. |
| **Power Co** | Host | Destination. Civic/utility; color it HAL-pale if you want faction at a glance. Rating 3 Track 2 if the crew is here to enter, not just pass. |
| **Cassavir’s Booth** | Host | Street Host. Deal-threads, not a corp core. |
| **Ghost Node** | Host | Wireside curiosity — still a Host, still no devices on this map. |

Scan Reach on this scene is hops **among these tokens** (Relay ↔ Host). A runner on Flats Backbone with Reach 1 sees adjacent Hosts, not Power Co’s substations and not the maintenance-room maglock.

### Scene B — Power Company facility graph (site)

The crew **Navigates / Seizes / stories** into **Power Co**. Load a new Scene. The Host may sit as site root. Place Segments:

| Token | Style | Notes |
|---|---|---|
| **Power Co** | Host (site root) | Same destination, now the facility you are inside. |
| **Power Co — North Substation** | Segment | Nested. Name includes parent. |
| **Power Co — South Bay** | Segment | Another wing. |
| **Power Co — Billing Hall** | Segment | Civic paperwork; still not a device. |

Reach resets to **this** graph. District Relays are off the board. Do not drop Light Control / Maglock tokens here.

### Scene C — North Substation maintenance room (room / device)

Enter **Power Co — North Substation** (or an Endpoint pip on that Segment). Load the meatspace room (or a tight Wire overlay of that room). **Now** place devices:

| Token | Style | Notes |
|---|---|---|
| **North Substation - Light Control** | Device (B113) | Auto-node OK. Room-scale only. |
| **North Substation - Maglock Door 1** | Device (B113) | Auto-node OK. |
| Cam / ICE / console | Device | Hand-placed; still room-only. |

B112 auto-nodes from named lights/doors belong **here**, never on Scene A or B.

## Foundry this pass (0.3.51 art; topology 0.3.50)

| Ship | Skip |
|---|---|
| Spike (this file) | PDF assemble / print redo |
| RAW `docs/raw/21-the-wire.md` **Wire Atlas / topology** | Gold Line `{ force: true }` |
| Short sections in `08-hacker.md`, `18-wired-foundry.md` | Regenerating device or atlas art |
| Cross-links on doctrine + Director wired-node docs | Endpoint as a fourth v1 style |
| Rulebook journal page from RAW (`21-the-wire.json`) | |
| `assets/tokens/wired/library.json` + Michael `node-relay` / `node-host` / `node-segment` png+webp | |

**Version:** module **0.3.51**. Topology brief **0.3.50**. Mama **0.3.48** (#35). Wired Gold Line **0.3.49** (PR **#34** merged).

## Files

- `docs/spikes/B116-WIRE-ATLAS.md`
- `docs/raw/21-the-wire.md` (+ glossary rows in `00-front-matter.md`)
- `docs/rulebook/08-hacker.md`, `docs/rulebook/18-wired-foundry.md`
- `docs/directors/wired-node-templates.md`, `docs/directors/wired-node-minimap.md`
- `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md`
- `docs/manuscript/04-back/28-glossary-slang.md`
- `src/packs/rulebook/ghostwire-systems/21-the-wire.json` → `packs/rulebook` (rebuild)
- `assets/tokens/wired/{README.md,library.json,.gitkeep}`
- `scripts/wired-atlas-catalog.mjs` (constants stub; not imported by `module.mjs`)
- `tools/b116-wire-atlas-smoke.mjs`

## Verify

```text
node tools/b116-wire-atlas-smoke.mjs
node tools/raw-to-journals.mjs          # then
node tools/build-packs.mjs rulebook     # Foundry closed
```

Foundry (after update to **0.3.51**, world reload): Ghostwire Rulebook → **The Wire** → page **Wire Atlas / topology**. Confirm the three altitudes, Reach = current-scene hops, dig-down, and the Switchboard → Power Co example. Token art picker: Relay / Host / Segment stamp `assets/tokens/wired/node-*.webp`. Do **not** run Gold Line `{ force: true }`.

## Naming lock

Ghostwire words: **Relay**, **Host**, **Segment**, **Endpoint**, **Device**.  
Atlas vs device: **where** vs **what**.
