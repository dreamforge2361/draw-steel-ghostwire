# Spike B20c — Gear / vehicle / matrix mod install tracker

**Repo:** `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\draw-steel-ghostwire`  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.

## Problem
Mods and hosts are independent `treasure` Items. Catalog flags exist but nothing links them or tallies slots.

- Host gear: `flags.draw-steel-ghostwire.gear.modSlots` + `modFamily`
- Host vehicle/drone: `flags.draw-steel-ghostwire.vehicle.modSlots` + `modFamily: ["vehicle"]`
- Host matrix (decks/RCCs): `flags.draw-steel-ghostwire.matrix` may also have `modSlots` — **these ARE hosts** (programs / autosofts occupy deck & RCC slots per `14-mods.md`)
- Mod: `flags.draw-steel-ghostwire.mod.slotCost`, `hosts` (array), and `host` (string OR array — normalize to array)
- Sheet `catalogLine` in `scripts/module.mjs` only prints Slot cost OR Mod slots — never used/max, never lists installs
- Chrome has a working install pattern (`grantedBy`, location caps) — mirror the linking idea, not Integrity

## Locked data model (v1) — confirm Claude's proposal

**Host Item** (top-level module flag, shared by gear / vehicle / matrix):

```
flags.draw-steel-ghostwire.installedMods = [ "<modItemId>", ... ]
```

Display/list only. Do not store slotCost copies here (avoids drift).

**Mod Item:**

```
flags.draw-steel-ghostwire.mod.installedOn = "<hostItemId>" | null
```

**Used slots:** computed on the fly = sum of `slotCost` for mods on the **same Actor** whose `mod.installedOn === host.id`.

**Capacity:** `modSlots` from whichever catalog object exists on the host: `gear` OR `vehicle` OR `matrix` (first with `modSlots > 0`, or max if somehow multiple — prefer the flag that matches the item: matrix items → matrix, vehicles → vehicle, else gear).

**Family check:** normalize mod `hosts` / `host` to an array. Host `modFamily` must **overlap** that array. Known families in catalog: armor, shield, wired, comms, survival, sensors, bne-mechanical, bne-electronic, weapon, vehicle (and any matrix family already on matrix hosts — use whatever `modFamily` the matrix items publish).

**Writes:** one `update` per Item (same lesson as the chrome editor error). Install = update host `installedMods` + update mod `installedOn` (two updates total, sequential). Uninstall = clear both the same way.

## UX
1. **Install:** Item context menu on an owned mod: "Install onto…" → dialog listing valid hosts on the same Actor (capacity, family, not already installed).
2. **Uninstall:** context menu on an installed mod: "Uninstall mod".
3. Optional: skip drag-drop onto host sheet for v1 if fragile.
4. **Host sheet:** catalog line becomes `Mod slots: {used} / {max}`; under it a line `Installed: Name, Name`.
5. **Mod sheet:** if `installedOn` set, show `Installed on: {host name}`.
6. Do **not** auto-install when dragging from compendium onto the actor.

## Enforcement (ui.notifications.warn)
- Wrong host family
- Insufficient free slots (`used + slotCost > modSlots`)
- Mod already installed (`installedOn` set)
- Target not on same Actor / not a host (`modSlots` missing or 0)
- Host list entry pointing at a missing mod: ignore in sum; optionally prune on render

## Implementation
- Add `scripts/mods.mjs`; import from `scripts/module.mjs`.
- Helpers: `normalizeHosts(mod)`, `getHostCatalog(item)` → { key, modSlots, modFamily }, `usedSlots(host)`, `freeSlots(host)`, `canInstall(mod, host)`, `installMod`, `uninstallMod`.
- Context menus: Foundry v14 Item context on actor sheet / sidebar — match any existing GW menu pattern; if none, use `getItemContextOptions` / ApplicationV2 equivalent after inspecting DS + Foundry hooks available in this stack.
- Update `catalogLine` + `renderDrawSteelItemSheet` for used/max, installed list, installed-on.
- Lang: `GHOSTWIRE.Mods.Install.*` (menu labels + warn strings).
- Docs: short note in `FOUNDRY-BUILD-PLAN.md` / `STATUS.md` — B20c mod install tracker v1, **pending Foundry verification**.
- Bump `module.json` one patch from whatever is current on disk.
- **Leave Phase 4 machine WIP alone** (`scripts/machines.mjs`, `src/packs/summons/machines/*`, `GHOSTWIRE_MACHINE_BANDS.md`) unless a tiny import conflict forces a one-line fix.

## Out of scope
- §Craft Project / downtime automation
- Invent a Mod
- Chrome implants
- Field on/off toggle of installed mod AEs
- Commit / push

## Done when
1. Install a legal weapon/armor/vehicle/matrix mod onto a host → host shows `used / max` + name list; mod shows host name.
2. Over-capacity install blocked.
3. Wrong family blocked.
4. Uninstall clears both flags and restores `0 / max`.
5. Matrix Items with `modSlots` work as hosts.
6. Version bumped; docs say pending verify; **no git commit**.

## Foundry test checklist (print this when finished)
1. Add Hardshell + Climate Seal Liner to a hero → Install onto Hardshell → host `1 / 2`, lists liner; liner shows "Installed on: Hardshell".
2. Install a second 1-cost armor mod → `2 / 2`.
3. Third armor mod → blocked (full).
4. Try install weapon mod onto Hardshell → blocked (family).
5. Uninstall → `0 / 2`, liner `installedOn` null.
6. Repeat once with a vehicle Item host and once with a matrix Item that has `modSlots` (if programs exist; otherwise any matrix host + a mod whose hosts overlap that matrix `modFamily`).
