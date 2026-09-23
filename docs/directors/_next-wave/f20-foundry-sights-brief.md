# F20 — Wire sights into Foundry detectionModes (LOCKED)

**Michael 2026-09-22 + 2026-09-23:** Real canvas vision impact. Rewrite cyber/cyborg optics rule cards if Foundry’s built-in `detectionModes` / vision need different wording — **not flavor-only**.

## Goal
Equipping / granting a sight source must change what the **token sees on the canvas** via Foundry `detectionModes` (and `sight` only where needed). Today `scripts/token-vision.mjs` only forces `sight.enabled`.

## Built-in Foundry modes to prefer (do not invent fake thermal engine)
Use stock CONFIG.Canvas.detectionModes / visionModes. Typical ids: `basicSight`, `lightPerception`, `seeInvisibility`, `senseInvisibility`, `feelTremor`, `seeAll`, `senseAll`. Vision modes include darkvision / monochromatic / etc. as the install provides.

**Mapping doctrine (Michael: rewrite cards to match Foundry):**
| Ghostwire claim | Foundry effect |
|---|---|
| Low-light / dim / night optics | Enable darkvision-style sight (or `basicSight` + appropriate visionMode) with a **printed range in squares** |
| See invisible / spirit-thin / Veil glimpse | `seeInvisibility` or `senseInvisibility` at printed range |
| Thermal / IR | Foundry has **no true thermal**. Rewrite card to what canvas *can* do: e.g. treat as **darkvision + ignore Concealment from darkness** OR `seeAll` at short range — pick one consistent rule, print it on the card, implement that. Do **not** leave “thermal” as text-only. |
| Through-wall / supernatural detect | Leave Director/custom if no mode; say so on the card |

## Must-include SKUs (audit these first; expand if more claim sights)
Chrome: `cyber-eyes`, `cyber-eyes-soft` (+ any Cyborg optic suite / Deep Optics chrome path)
Gear sensors: `low-light-goggles`, `thermal-scanner`, `full-sensorium`, `sensor-sweep-drone-eye`
Mods: `deep-optics`, `sensor-pod`, `thermoptic-skin` (only if it claims vision; camo may be Stealth-only — don’t force vision)
Also check RAW/lang claims: Taint Sight, Penetration Optics, Predictive Sensors, Detect the Supernatural, Cold Read — wire if they are shipped Items; else note deferred.

## Implementation shape
1. Flag schema on Items, e.g. `flags.draw-steel-ghostwire.sightGrant = { modes: [{ id, range, enabled }], visionMode?, priority }`
2. Runtime: when Item is created/updated/deleted / AE toggled on a hero (and relevant NPC), recompute actor `prototypeToken.detectionModes` + placed tokens owned by that actor. Respect F12 chrome destroyed/suppressed (no sight from offline chrome).
3. Extend or sibling to `token-vision.mjs` — keep Has Vision behavior; **add** detectionModes wiring.
4. Rewrite lang Descriptions for changed SKUs so printed rules match canvas.
5. Smoke: Foundry-free asserts on flags + recompute helper; at least one equipped path.
6. Director note `docs/directors/f20-foundry-sights.md`. Rebuild packs that change (chrome/gear/mods as needed). Foundry closed for pack rebuilds.

## Out of scope
Custom WebGL thermal shader. F21. Renown.
