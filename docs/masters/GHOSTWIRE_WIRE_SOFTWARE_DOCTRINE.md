# Wire software doctrine (locked 2026-09-17)

**Status:** Locked by Michael. Apply on every future Wire / deck / matrix gear build.

## Split

| Layer | What it is | Role |
|---|---|---|
| **Hacker class Programs** | Bandwidth signature abilities | Always-on spell list (class progression) |
| **Suite programs** (Gear §4B) | Persistent deck mods (1 slot each) | **Utility / support** (+ Skeleton soft Breach edge, **Guardian defense**) |
| **Intrusion payloads** (Gear §4C) | Consumable magazines Craft-loaded into a deck slot | **Offensive toolkit** — one-shot force multipliers |

## Suites (do not turn into attack buttons)

- **Utility:** Reader, Sneak, Mirror, Scrubber, Overlord
- **Soft offense:** Skeleton (standing edge on Breach/Intrude — not a fire ability)
- **Defense:** Guardian (resist ICE / hostile deckers; Alert warn)

Suites: Craft-install, Activate/Deactivate, edge Matrix Verbs / standing benefits. **No Run {Suite} abilities.**

## Payloads (offensive magazines)

Zap, Crash, Whiteout, Static, Ghostload, Blackout, Wraith.

- Share deck `modSlots` with suites (Street Deck typically 2).
- Craft (Hacking) downtime Project loads **one kind into one slot** as a **magazine**.
- Project power-roll tier sets fires: **Low 1 / Mid 3 / High 5** (provisional).
- Run spends quantity; mid-tier Run effect = catalog Effect promise.
- Future payloads should stay **offensive / disruptive one-shots**, not permanent utilities.

## Anti-patterns (reject in review)

- Giving Reader/Sneak a damage Run ability
- Making Zap a permanent installed suite
- Separate payload-only slot bay unless Michael reopens that lever
- Blurring class Bandwidth Programs with deck suite/payload SKUs in UI copy

## Wire Atlas (topology, not software)

This doctrine is **suites vs payloads vs class Programs**. It does not invent atlas tokens.

The Wire still has a **map**. Device tokens (Light, Maglock, Cam, ICE) answer **what is this socket**. Atlas tokens answer **where am I**: **Relay** (highway), **Host** (destination), **Segment** (nested child of a Host). Scan Reach is hops on the **current scene graph**. Dig-down is district (Relays + Hosts) → facility (Segments) → room (Devices). Room-scale auto-nodes stay off region graphs.

Lock + Director example (Switchboard → Power Co Host → North Substation Segment → maintenance room): `docs/spikes/B116-WIRE-ATLAS.md`. Player/Director rules: `docs/raw/21-the-wire.md` (Wire Atlas / topology). Foundry catalog stubs: `assets/tokens/wired/`.

## Related

- Catalog: `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §4B / §4C
- RAW: `docs/raw/21-the-wire.md` (Deck software section; Wire Atlas / topology)
- Foundry: B51 / B51b (`docs/spikes/B51-PROGRAM-PAYLOAD-EXECUTE.md`); atlas stubs B116 (`docs/spikes/B116-WIRE-ATLAS.md`)
- Director node templates / minimap: `docs/directors/wired-node-templates.md`, `docs/directors/wired-node-minimap.md`
