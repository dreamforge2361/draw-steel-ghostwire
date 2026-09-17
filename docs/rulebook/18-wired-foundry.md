# Ghostwire Foundry Notes — The Wired on the Hero Sheet (B23a)

**Status:** v1 (2026-09-16), pending Michael’s Foundry test.
**Source of record for rules text:** `docs/rulebook/08-hacker.md` — *The Wired System* (Connection States) and *Matrix Verbs (Universal)*. This page only describes how Foundry implements them; if the two disagree, 08-hacker.md wins and this page (and the pack) gets fixed.
**Next:** B23b — the Wired Console (nodes, Trace Alert tracker). Not built yet.

## Matrix Verbs on every hero

Every hero gets the nine Matrix Verbs as abilities (Ghostwire Abilities › **Matrix Verbs**). They all have the **Wired** keyword and cost no heroic resource: they’re universal, not Hacker Programs, so Bandwidth isn’t involved.

| Verb | Action | Roll |
|---|---|---|
| Connect | Maneuver | Instinct |
| Jack Out | Maneuver (free triggered action in an emergency, per its text) | Instinct |
| Toggle Connection State | Free maneuver | None — automatic |
| Scan | Maneuver | Instinct |
| Navigate | Maneuver | Instinct |
| Ping | Maneuver | Logic |
| Broadcast | Maneuver | None — automatic |
| Search | Maneuver | Logic |
| Read/Write | Maneuver | Logic |

Rolling verbs show the low / middle / high result text from 08-hacker.md (low: works, but something goes wrong, usually Trace Alert; high: the maneuver refund, or zero forensic trace for Read/Write). Trace Alert itself is tracked by hand until B23b.

New heroes get the verbs automatically. Heroes that existed before this version get any missing verbs once, the first time the GM loads the world.

## Connection states

A hero is **Disconnected**, in **Overlay**, or **Jacked In**. The state shows as a status icon on the hero’s token (Overlay: eye, Jacked In: lightning), in the sheet’s status list, and in a **Wired** box on the Stats tab.

- **Connect** (only while Disconnected) → Overlay, on any result.
- **Toggle Connection State** (only while connected) → Overlay ↔ Jacked In.
- **Jack Out** (only while connected) → Disconnected.
- The other verbs refuse to run while Disconnected.
- The GM can also set or clear the two statuses from the token HUD; Overlay and Jacked In replace each other.

Automated modifiers on **ability** power rolls:

| State | Wired abilities (Wired keyword) | Real-world abilities |
|---|---|---|
| Disconnected | — | — |
| Overlay | — | Bane |
| Jacked In | Edge | Can’t be used (body inert) |

Also automated: a hero with the **Hacking** skill gets an edge on the rolling Matrix Verbs (and any other Wired ability).

Not automated: the Overlay bane on tests (make it in the test dialog), biofeedback scaling, and Trace Alert.

For the Wired Console, the state is also stored on the actor as `flags.draw-steel-ghostwire.wired = { connected, state }`, with `state` being `"disconnected"`, `"overlay"`, or `"jackedIn"`.
