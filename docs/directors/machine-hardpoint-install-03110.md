# Heavy Hardpoint on the Machine sheet — 0.3.110

**0.3.111:** The install chat card from this build was created and then hidden by Draw Steel. See `mod-install-chat-03111.md`.

**Lock:** Michael smoke on Allfather after 0.3.108–0.3.109. Install Heavy Hardpoint onto a Bulldog reported success, then the deployed Machine sheet did not show it.

## Cause

Install still records the mod on the **hero chassis Item** (`mod.installedOn`). That part worked. The Machine sheet Inventory (0.3.108) lists only embedded `Actor.items`. Weaponry kits never created one — they only wrote `installedKits.weaponry` and an Active Effect the Machine sheet does not render. Armor looked fine because Integrity changed. Deploy's later chassis stamp then wrote Hardpoints from the Item's factory `vehicle.hardpoints` (empty on Bulldog) and set Installed mods to a blank string.

Gun Rack, Twin Mount, and Turret Ring used the same path.

## What 0.3.110 does

- Sync (install, uninstall, field toggle, and Deploy) mirrors each mod installed on the chassis onto the machine Actor. Inventory shows **Heavy Hardpoint** next to Wire Kit. The hero Item remains the slot record.
- Build → **Hardpoints** keeps a factory mount string and appends the live weaponry kit (`Heavy Hardpoint · 1 hardpoint · heavy · integrated · Gunnery`).
- Build → **Installed mods** lists every installed mod. Switched-off kits stay in the list marked off and drop out of the Hardpoints line.
- A successful **Install onto…** posts a chat card: who, mod, host, slots, and the fielded machine when one is already out. Failures stay notifications. Payload magazine loads keep their own card.

## Drones are Jump-In capable

Jump-In checks `flags.draw-steel-ghostwire.machine.jumpInCapable` (or a Rigger Cocoon on the machine). Drone chassis Items never set that flag, and the drone Actor prototypes did not either, so Jump-In refused.

Kind `drone` now passes the gate even if the stored flag is missing or off. Deploy stamps it. `preCreateActor` stamps it when a drone Actor is created (compendium drag included). A GM ready pass writes it onto world drones that predate this. Prototypes: Drone (Micro / Small / Medium) and Mule-Bot.

Vehicles and base assets are unchanged. A Bulldog still needs the flag or a Rigger Cocoon. Door Lock stays off. Safehouse Beacon stays on. Ghost Rein still does not grant Jump-In.

## Automated

```bash
node tools/rigger-vertical-smoke.mjs
node tools/build-packs.mjs summons
```

Summons pack rebuilt so the drone prototypes carry the flag. Foundry closed.

## In Foundry

1. Update to **0.3.110** and F5.
2. On a hero, install **Heavy Hardpoint** onto a **Bulldog** (Install onto…). Chat shows the install. The notification can still appear.
3. **Already deployed:** open the Bulldog Machine sheet. Inventory lists Heavy Hardpoint. Build → Hardpoints names it. Installed mods lists it.
4. **Stowed, then Deploy:** same sheet after Deploy. Wire Kit is still there. The hardpoint is too.
5. Peer check, one of **Gun Rack / Twin Mount / Turret Ring** (one weaponry kit at a time — uninstall Heavy Hardpoint first).
6. Uninstall: the Inventory row leaves with the next sync. Scrap-Weld still raises Integrity and now also lists under Inventory.
7. **Drone Jump-In** — Deploy any drone (Rotor, Stinger, Mule-Bot). Do not install Rigger Cocoon and do not tick Jump-In Capable by hand. Machine sheet Control shows Jump-In Capable. Jump-In sets the pilot **Jacked In**, meat inert, and the usual biofeedback / Uptime-on-hit path.
8. **Not forced** — Deploy a Bulldog or Door Lock with no cocoon. Jump-In stays disabled. A beacon still allows it.
