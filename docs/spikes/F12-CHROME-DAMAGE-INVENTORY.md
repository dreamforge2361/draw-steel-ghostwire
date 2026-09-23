# F12 — Chrome Damage inventory (Hacker / Technomancer)

**Date:** 2026-09-22 (ET)  
**Module:** **0.3.101** @ `9f11b27` (F11 Critical Roll on main; Chargen merge `f010874`)  
**Status:** **READ-ONLY inventory** — seeds the F12 design brief. **No Foundry chrome-damage code in this pass.**  
**Backlog:** `docs/directors/MASTER-BACKLOG-2026-09-22.md` → **F12**  
**RAW spine:** `docs/raw/09-chrome-body-integrity.md` § Suppress / Damage / Destroy (draft); master Track 5 in `docs/masters/GHOSTWIRE_CHROME_MASTER.md`

---

## Executive count

| Bucket | Count | Notes |
|---|---:|---|
| **Touches chrome Items today (Foundry + RAW text)** | **4 offensive-adjacent = 0; repair/clear = 4–5** | No ability/program stamps Suppress / Damaged / Destroyed on chrome Items. Repair/clear path exists on Technomancer (and Wrench RAW). |
| **Fiction / device / Track-2 / biofeedback adjacent** | **~12** | Static, Zap, Blackout, ICE/node Integrity kits, Wired Silence, etc. — Director-flavored or other systems; **do not write chrome Item state**. |
| **Hard gaps for F12 attack path** | **5+** | No EMP→Suppress program; no chrome-strike / System Rot / Chrome Sunder; no Soft EMP hardness; no Damaged Craft Project wiring; Destroyed must **not** Item-delete. |

**Headline:** the table can *talk* about EMP and chrome failure (RAW + combat keywords), and Technomancers can *mend* chrome fictionally — but **nothing in packs writes a chrome Item condition**. Hacker “damage” today is almost entirely **Track 2 node Integrity**, not implants.

---

## RAW already drafted (not Foundry)

From `09-chrome-body-integrity.md` (and combat pointer in `04-combat.md`):

| State | Intent |
|---|---|
| **Suppressed** | Temporary offline (EMP, hostile decker, spell); optional biofeedback jolt; ends / reboot. |
| **Damaged** | Works at a penalty until downtime repair. |
| **Destroyed** | Benefit gone; Body Integrity **locked out** until repair-or-replace. Neural destroy can wound hard. |

Install / remove already live in Foundry (`module.mjs` Integrity spend / 75% refund on remove). **Exact anti-cyber numbers still unpublished** — Director adjudicates until F12 lands.

**Hard lock (Michael 2026-09-22):** Destroyed **must not** delete the Item. Deleting refunds Integrity via the remove hook — wrong.

---

## Hits — Hacker (decker)

### Class abilities / origin features (Track 2 / biofeedback — **not chrome Items**)

| Name | Type | What it does today | Touches chrome Items? |
|---|---|---|---|
| Kill Switch | ability | Reach Track 2: Integrity dmg + lose maneuver/main | **No** — node/ICE Integrity |
| Network Purge | ability | Up to 2 Track 2 targets, Integrity dmg / bane | **No** |
| Cascade Strike | ability (Disruptor) | +2 Integrity when a Track 2 takes Integrity dmg | **No** |
| Cascade Failure | ability (Disruptor) | On 0 Integrity Track 2 → splash low-band Integrity to another | **No** |
| Overclocked Damage / Strikes / Total Breach | feature | Bigger Track 2 Integrity bonuses | **No** |
| Dampen | ability (Support) | Ally Jacked In takes −2 from Track 2 hit | **No** — biofeedback shield |
| Failsafe Cascade / Emergency Patch / Anchor Point / Guardian Angel… | abilities | Biofeedback resistance / Stamina restore while Jacked In | **No** — self/ally meat vs Wire |
| Seize / Compile Agent / Ghost* suite | abilities | Node control, Agents, stealth | **No** |

**Hacker chrome posture (master):** “less about having chrome, more about attacking others' chrome across the Wired” — **aspiration only**; no suppress/damage hooks on implant Items yet.

### Matrix payloads (deck magazines; Technomancer can compile onto Wired Native per B109)

| Name | Type | What it does today | Touches chrome Items? |
|---|---|---|---|
| **Static** | payload (E2) | Suppresses one enemy **device** (smartgun link, camera, comm, hostile drone control) for a round; strong run hits several | **Fiction-only vs chrome** — closest existing “suppress,” but targets **devices**, not chrome Item flags |
| **Zap** | payload (E1) | Biofeedback spike at jacked-in/wired foes | **No** — Stamina/biofeedback |
| **Crash** | payload (E1) | Disables ICE / breach edge | **No** — ICE |
| **Whiteout** | payload (E1) | Trace Alert scrub | **No** — Trace |
| **Ghostload** | payload (E2) | Node trap → biofeedback + Alert | **No** |
| **Blackout** | payload (E3) | Crash small network / hard-lock host | **No** — hosts/nodes |
| **Wraith** | payload (E4) | One-shot host-seizure edge | **No** |

### Matrix suites (persistent programs)

Reader / Sneak / Mirror / Skeleton / Scrubber / Guardian / Overlord — **utility / breach / defense**. None name implant Suppress/Damage/Destroy.

### Matrix verbs

Connect / Scan / Ping / Navigate / Broadcast / Search / Read-Write / Toggle / Jack Out — Track 1 systems & data. Ping can “soft jolt” a maglock; **not** chrome strike.

---

## Hits — Technomancer

### Repair / clear (closest to F12 downtime half)

| Name | Type | What it does today | Touches chrome Items? |
|---|---|---|---|
| **Resonance Mending** | ability | Base: Stamina/Integrity restore; enhance: clear jam/glitch/**suppression**/chrome malfunction; **2 Resonance** restore failed chrome to minimal function | **Yes (mend)** — target line includes “piece of chrome”; **does not stamp** Damaged→OK in Foundry yet |
| **Machine God’s Rite** | ability | ≥5 min ritual; restore 1 Cyborg/machine/drone **or up to 3 pieces of chrome** to full | **Yes (mend)** — full restore fiction |
| **Machine Empathy** | feature (Machine-Whisperer) | Mending enhancements −1 Resonance (failed chrome restore costs 1) | **Buffs mend** |
| **Bonded Repair** | feature (Machine-Whisperer) | 1/encounter: enhanced mending as if 3 Resonance, free, no biofeedback | **Buffs mend** |
| **Cyborg Mending** | feature | Cyborg Recovery branch from 1st | **Cyborgs**, not living chrome Items |

### Offensive / area (fiction-adjacent — **not chrome Item writers**)

| Name | Type | What it does today | Touches chrome Items? |
|---|---|---|---|
| Resonance Strike | ability | Hostile code + biofeedback; high → glitched / blinded sensors | **Fiction-only** — sensors/conditions, no implant state |
| Cascade Failure (Techno) | ability | Cube short; stun; high → next Wired ability fizzles | **Soft area deny**, not implant Destroy |
| Wired Silence | ability | 1 round: no Wired-based attacks in area; hostile sprites decompile | **Area Wire mute**, not per-Item Suppress |
| Resonance Slam / Swarm / Overclock / … | abilities | Damage / sprite tempo | **No** |
| Light Chrome Tolerance (lang: Chrome Erosion) | feature | Self Resonance cap erosion from chrome | **Self cost only** |
| Feedback Weapon | feature | Reflect own biofeedback as psychic dmg | **No** |

---

## Adjacent gear / defense (not Hacker/Techno kits, but EMP fiction)

| Name | Type | Note |
|---|---|---|
| Faraday Suit | armor | Resists shock/taser/**EMP-adjacent** |
| Buzzer / Signal Jammer | gadget | Area bane on wireless Matrix/comm |
| Combat keywords (`04`) | RAW | EMP vs Chrome keyword called out; no SKU EMP grenade that stamps chrome |

Wrench **Field Repair** (RAW `16`) can patch ally chrome/weapon jam — natural downtime mender alongside Medic / Technomancer.

---

## Gaps (attack + rules + Foundry)

1. **No Suppress / Damaged / Destroyed flag** on chrome Items (`flags.draw-steel-ghostwire.chrome` today: grade / location / integrity / price / availability only).
2. **No EMP / chrome-target 1-shot programs** (Static is device jam, not implant Suppress).
3. **No Hacker signature / Program** that picks a chrome Item on a hero and applies a state.
4. **No Technomancer offensive rite** that Damages/Destroys chrome (only mend/clear).
5. **No Soft-harder-to-EMP** rule published or coded.
6. **Damaged → Craft Project** repair not wired (install/remove Projects exist; battle-damage ladder does not).
7. **Destroyed ≠ Item.delete** — must disable benefits + lock Integrity without triggering the 75% refund remove path.

---

## Balanced design sketch (seed for F12 implement pass)

Keep chrome *targetable* without making every decker an anti-tank gun:

| Lever | Sketch |
|---|---|
| **Soft harder to EMP** | Soft grade: edge on resist / one step milder outcome (Suppress instead of Damage on middle; Damage instead of Destroy on high). Salvage: opposite (more fragile). |
| **Suppressed = short** | EoNT or 1 round default; reboot Maneuver or free at start of next turn. Optional minor biofeedback jolt once. |
| **Damaged = Craft Project** | Benefit at a bane / half effect until downtime **§Craft** (Repair / Electronics / Medicine). Natural menders: **Wrench**, **Medic/street-doc**, **Technomancer** (Resonance Mending already clears “chrome malfunction” — align AE/flag with that language). |
| **Destroyed = rare / high cost** | High roll + spent payload / 5+ Resonance / called shot stack. Benefit offline; Integrity **locked** (still counts toward spent Integrity / casting soft-cap); **Item stays**. Repair-or-replace Project (harder / pricier than Damaged). |
| **1-shot programs (Hacker)** | e.g. **Pulse** (E1 Suppress one wireless chrome), **Chrome Rot / System Rot** (E2 Damage), **Sunder Spike** (E3 rare Destroy or force Damaged+). Magazines like Static; Connected gate. |
| **Technomancer equivalents** | Rites/abilities: **Static** parity as Resonance pulse; **Chrome Sunder** as costly biofeedback-risk main; keep **Resonance Mending** as the clear/repair answer so offense isn’t free. |
| **OP guardrails** | One chrome target per Run; Soft resist; Destroyed once per encounter per target max; Faraday / Soft / nervous-location resist; never delete Item. |

Inventory findings above are the brief input for that pass — implement only when Michael queues F12 past the locked G4 → G3 → S1 → L1 pick list (or redirects).

---

## Sources scanned

- `src/packs/classes/hacker/**`, `src/packs/classes/technomancer/**`
- `src/packs/matrix/payloads/**`, `programs/**`, `src/packs/abilities/matrix-verbs/**`
- `src/packs/chrome/**` (flag shape only)
- `docs/raw/09-chrome-body-integrity.md`, `19-hacker.md`, `20-technomancer.md`, `21-the-wire.md`, `04-combat.md`, `16-wrench.md`
- `docs/masters/GHOSTWIRE_CHROME_MASTER.md`, Wire software doctrine / gear EMP-adjacent rows
- `lang/en.json` ability/payload strings
- `scripts/module.mjs` Integrity install/remove (no condition ladder)

