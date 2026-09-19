# B94 — Street Eye / Companion Link (inventory-gated scout leash)

**Status:** LOCKED 2026-09-18 by Michael. **Foundry automation built 2026-09-19 (0.3.20, rebased onto main 0.3.19).**  
**Related:** `docs/raw/23-machines.md` (Companion link already existed — polish, do not invent a second system); `docs/raw/16-wrench.md` (Deploy & Command / Uptime / Jump-In / Fleet Deck+ unchanged).

## Intent

Any class can fly **one** scout drone on a soft leash. That is **not** a Wrench replacement. Foundry shows the ability only while a **qualifying scout drone** is in inventory.

## Naming lock

| Surface | Label |
|---|---|
| **Primary (sheet / ability Item)** | **Street Eye** |
| **Alias (rules / control mode)** | **Companion Link** |

Print/RAW after front matter stays Ghostwire-only (no Draw Steel procedure citations). Journals are **not** regenerated on this bump.

## Who

- **Any class.** Inventory-gated, not a class feature.
- Does **not** replace Wrench. Wrenches keep Deploy & Command, Uptime, Jump-In, fleet size, Rigged Fire, and Fleet Deck+ features.
- Street Eye is the non-Wrench (and optional redundant) soft leash. A Wrench who owns a qualifying scout also sees Street Eye; that copy does not nerf or hide Deploy & Command.
- Non-Wrench still **cannot** use Fleet Deck+ features even if they own the hardware.

## Trigger (Foundry)

When a **hero** has at least one **qualifying scout drone** in inventory → grant/show **Street Eye**.  
When no qualifying drone remains → remove/hide it.  
Max **one** Street Eye copy on the sheet.

## Qualifying drones (v1)

**Gate (data-driven):** Ghostwire vehicle treasure with `flags.draw-steel-ghostwire.vehicle` such that:

- `drone: true`
- Domain is **Air** (`domain` starts with `Air`)
- Scale is **Personal** or **Light** (not Vehicle-scale)
- Tags include **Recon**, or scout-equivalent **Mark** / **Decoy**

Ground / Water recon is **v1.1** (not auto-qualified here). Pure gun / sentry / combat frames do **not** auto-qualify unless they carry Recon (or Mark / Decoy).

### v1 published list (from `docs/raw/23-machines.md` + Vehicles & Drones pack)

| Chassis | `_dsid` | Domain / Scale | Why |
|---|---|---|---|
| Tape-Eye | `tape-eye` | Air / Personal | Recon |
| Fly | `fly` | Air / Personal | Recon |
| Needle | `needle` | Air / Personal | Recon (kamikaze micro still a scout body) |
| Buzz | `buzz` | Air / Personal | Decoy (scout-equivalent) |
| Rustbucket | `rustbucket-drone` | Air / Light | Recon |
| Rotor | `rotor` | Air / Light | Recon — Michael verify SKU |
| Spotter | `spotter` | Air / Light | Recon + Mark |
| Phantom | `phantom` | Air / Light | Recon + Mark |

**Explicitly out (v1 examples):** Skitter / Junkbug / Crawler (ground recon), Sink-Floater (water), Taser-Bee (air but Nonlethal/Swarm, no Recon), Choir-Box / Choir-King (EW only), Ghost-Courier / Whisper-Run (cargo/stealth), Rattlebox / Guard-Dog / Nest (sentry), Stinger / Hellkite / Razorwing (Vehicle-scale combat), Medbot / Mule-Bot (support/cargo).

## Capability (same Companion link — not a second system)

Soft deploy + orders: **follow / watch / hold / scout / surveillance / minor support** (spot/mark, watch a corner, light carry).  
**Not** a non-Wrench gun platform. **No Jump-In.** Max **1** active. **Bane** on Rigging / Gunnery-through-drone. **One** soft Pilot/Sensor program. Link lasts **~one scene**, then standby (≈ 10 minutes / between scenes). Soft Integrity buffer **+2** while the link is live (already in Machines RAW).

## Wrench firewall

Wrench continues using Deploy & Command / Uptime fleet / Jump-In / Fleet Deck+. Street Eye must not remove, hide, or rewrite those items. Non-Wrench cannot spend Uptime or use Wrench signatures via this leash.

## Foundry hook (smallest correct)

Mirror B49 `scripts/equipment-use.mjs` (inventory create/delete → grant/revoke) and chrome `grantChromeItems` (compendium copy + `grantedBy`-style flag). Do **not** spawn a per-drone use-ability.

| Piece | Design |
|---|---|
| Ability | One compendium Item in Ghostwire Abilities: `_dsid: street-eye`, maneuver, Range 10, no default power roll |
| Qualify | `isQualifyingScoutDrone(item)` on vehicle flags (above) |
| Grant | Copy from `Compendium.draw-steel-ghostwire.abilities.Item.GwStreetEyeB9401`, flag `streetEyeGranted` |
| Revoke | Delete items with that flag / `_dsid` when the hero has no qualifier |
| Hooks | `createItem` / `deleteItem` / `updateItem` (vehicle flags) / `createActor` / `ready` sweep |
| Who syncs | Owning user (same as equipment-use) |
| Deploy token | Unchanged `scripts/machines.mjs` right-click Deploy / Recall — Street Eye is the leash card, not a second Deploy pipeline |
| Not automated | Rigging/Gunnery bane, scene-end standby, +2 buffer, autosoft slot, Wrench Uptime |

## Confirmations (closed)

1. Primary label **Street Eye**; Companion Link is the rules alias — yes.
2. Any class; does not replace Wrench — yes.
3. v1 = flying Personal/Light Recon (or Mark/Decoy) — yes.
4. Journals **not** regenerated — yes.
5. module **0.3.20** (next free 0.3.x after main 0.3.19).

## As-built (0.3.20, 2026-09-19)

**Code:** `scripts/street-eye.mjs`, registered from `scripts/module.mjs` init as `registerStreetEye()` (after `registerMachines`).

| Piece | Implementation |
|---|---|
| Qualify | `isQualifyingScoutDrone` reads `flags.draw-steel-ghostwire.vehicle` (or `getFlag`). Air + Personal/Light + Recon/Mark/Decoy + `drone: true`. |
| Grant/revoke | `syncStreetEye(actor)` — one copy; extras deleted; missing copy granted from the abilities pack. |
| Marker | Granted items carry `flags.draw-steel-ghostwire.streetEyeGranted`. |
| Notify | Live inventory add/remove: info toast. Ready / createActor sweeps are silent. |
| i18n | `GHOSTWIRE.Abilities.StreetEye.*`, `GHOSTWIRE.StreetEye.Granted/Revoked` |
| API | `game.modules.get("draw-steel-ghostwire").api.isQualifyingScoutDrone / syncStreetEye / STREET_EYE_DSID` |
| Pack | `src/packs/abilities/street-eye.json` → `packs/abilities` via `tools/build-packs.mjs` |
| RAW | Polished Companion link → Street Eye write-up + In Foundry sidebar in `23-machines.md`; cross-links in `16-wrench.md`, `01-how-to-play.md`, `02-heroes-characteristics.md` |
| Smoke | `node tools/street-eye-smoke.mjs` walks every drone JSON against the v1 list |

**Not built / unchanged:** Wrench class items, machine Deploy/Recall, journals, Ground/Water auto-qualify, combat-frame qualify, bane/buffer automation.

## Foundry checklist (Michael)

1. [ ] Non-Wrench hero (Operator / Scout / etc.): add **Rotor** from Ghostwire Vehicles & Drones → **Street Eye** appears in Abilities. Remove Rotor → Street Eye is gone.
2. [ ] Same with Tape-Eye (or Fly / Spotter / Buzz): appears / disappears with the last qualifier. Two scouts at once → still **one** Street Eye.
3. [ ] Add **Stinger** or **Guard-Dog** only → Street Eye does **not** appear. Add Rotor as well → it appears; remove Rotor (keep Stinger) → gone.
4. [ ] **Wrench** hero: confirm **Deploy & Command** is still on the sheet before and after adding Rotor. Street Eye may also appear; Deploy & Command must remain.
5. [ ] Right-click Rotor → **Deploy** still places the band token. Street Eye does not replace that control.
6. [ ] Reload world with a hero who already holds Rotor (pre-0.3.20 sheet) → ready sweep grants Street Eye silently.
7. [ ] Rulebook journals are **stale** on purpose this bump — read `docs/raw/23-machines.md` for the polished text.
