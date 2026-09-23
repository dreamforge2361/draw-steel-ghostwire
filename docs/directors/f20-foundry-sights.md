# F20 — Wired sights on the canvas (0.3.119)

**Michael lock, 2026-09-22 + 2026-09-23.** Sight SKUs stop being flavour. Equipping Cyber-Eyes or
Low-Light Goggles now changes what the **token actually sees on the canvas**, and every card that
claims a sight was rewritten so the printed rule and the Foundry behaviour are the same sentence.

Before this build `scripts/token-vision.mjs` forced `sight.enabled` and nothing else. A hero with
¥40,000 of Full Sensorium saw exactly what a hero with no eyes at all saw.

---

## The doctrine: three claims, three stock modes

Foundry's own `CONFIG.Canvas.detectionModes` is the whole toolbox. **No custom DetectionMode, no
WebGL thermal shader.** Ghostwire allows a card to claim one of three things and nothing else:

| Claim | Foundry mode | Printed on the card | What it means at the table |
|---|---|---|---|
| **Night optics** | `basicSight` (that class *is* `DetectionModeDarkvision`) + the `darkvision` vision mode | *Darkvision N squares* | Unlit squares inside N read as lit for that token. |
| **Thermal / IR** | `seeAll` (`DetectionModeAll`) | *Thermal N squares* | Inside N you detect a creature through smoke, darkness and invisibility whether or not it is hiding. **Walls still stop you.** |
| **Veil glimpse / see invisible** | `seeInvisibility` | *See invisible N squares* | An invisible or Veil-thin creature inside N and in your line of sight is on the canvas for you. |

**Why thermal is `seeAll`.** Foundry ships no thermal imager. The brief said pick one rule, print it,
and implement that — so thermal is `seeAll` at a short printed range, everywhere, on every card. It
is deliberately *not* through-wall: a `seeAll` mode with `walls: true` gives you "I can see the body
the smoke is hiding," not "I can see through concrete."

Ranges are in **squares** (the Draw Steel grid is `distance: 1`, `units: "sq"`).

## The shelf

| SKU | Where | Darkvision | Thermal | See invisible |
|---|---|---:|---:|---:|
| **Cyber-Eyes** | Chrome, Standard, E1 | 10 | 5 | — |
| **Cyber-Eyes (Soft)** | Chrome, Soft, E1 | 10 | 5 | — |
| **Low-Light Goggles** | Gear · Sensors, E1 | 10 | — | — |
| **Thermal Scanner** | Gear · Sensors, E2 | — | 10 | — |
| **Sensor Sweep Drone-Eye** | Gear · Sensors, E3 | 10 | 10 | — |
| **Full Sensorium** | Gear · Sensors, E4 | 20 | 10 | 10 |
| **Deep Optics** | Gadget mod, E3 | — | 5 | 5 |
| **Sensor Pod** | Vehicle / drone mod, E2 | 10 | 5 | — |
| **Taint Sight** | Mutant ancestry trait | 10 | — | — |
| **Predictive Sensors** | Cyborg ancestry trait | — | — | 20 |

Two pairs of optics **stack by taking the better band**, not by adding: Cyber-Eyes plus a Full
Sensorium is darkvision 20 / thermal 10 / see invisible 10, never darkvision 30. The vision mode with
the highest `priority` wins, so a Full Sensorium is never overruled by Cyber-Eyes.

### Deliberately granting nothing

- **Cheap Shades** — flare compensation and zoom. A table effect, one Perception check in bad light
  per scene. No canvas change, and the card says so.
- **Thermoptic Skin** — a Stealth overlay. It changes what others see *of you*, not what you see.
  Forcing a vision grant onto a camouflage mod would have been an invented rule.

### Deliberately deferred — the card says *Director call*

No stock Foundry mode does these, so Ghostwire does not fake one. Each card now prints why.

- **Penetration Optics** (Cyborg) — see through 1 square of solid matter *and go blind inside 1
  square*. That blind spot is not a range on any stock mode.
- **Detect the Supernatural** (Pure Human) — no mode filters by creature type, and the one that
  ignores walls (`senseAll`) would reveal every creature in the burst, not only the undead and the
  otherworldly.
- **Cold Read** (Scout, Hunter) — a detection mode belongs to the token that owns it, so one hero
  cannot hand the whole crew sight of a single Marked target for a round.

Run all three as written and move the token or reveal the square by hand.

## What a Director does

**Nothing, normally.** Drag Cyber-Eyes onto a hero and the canvas changes on the next redraw. Delete
the implant and it changes back.

**A mod has to be on.** Deep Optics grants nothing sitting in a pocket. It grants nothing installed
but switched off. Install it on a sensor or optic and toggle it on, and the host's carrier gets
thermal 5 / see invisible 5.

**F12 is respected.** Chrome that is **Suppressed** or **Destroyed** grants nothing — the modes come
straight off the token the moment the state is written, and come back when it is repaired. Damaged
chrome keeps its optics (F12's rule: Damaged keeps the benefit at a penalty).

**Sensor Pod is the one SKU that also switches Has Vision on**, for its vehicle or drone. A sensor
platform with no vision would read nothing through its own pod. Pull the pod and vision goes back off,
unless the actor is one token-vision wants sighted anyway. Every other grant leaves Has Vision alone.

**Scene Token Vision still has to be on.** Detection modes only matter on a Scene with the Token
Vision checkbox, exactly like the Wired tints (B23c).

**An existing world catches up once.** A one-time GM pass at `ready` wires every actor already
carrying a sight SKU, then never runs again.

## What it does not touch

The Wired Overlay / Jacked In tints (B23c) are still client-side vision-source overrides and still
never write `sight.visionMode` themselves; F20 writes the document field, and while a hero is Overlaid
or Jacked In the Wired tint still wins on that client. Perception edges are untouched — they were
already automated Active Effects and they stay that way. No Renown.

## Reading the data

- Flag: `flags.draw-steel-ghostwire.sightGrant` on the granting **Item**.
- Ledger: `flags.draw-steel-ghostwire.sightApplied` on the **token / prototypeToken** — the exact mode
  ids, vision mode and vision flip this module wrote, so it can take back exactly that and leave a
  Director's own configuration underneath intact.
- Code: `scripts/sights.mjs`. Doctrine: `docs/rulebook/18-wired-foundry.md` § *Canvas sights*.
- Smoke: `node tools/f20-foundry-sights-smoke.mjs`.
