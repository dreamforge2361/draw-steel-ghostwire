# Rigger vertical smoke — 0.3.105

**Lock:** Michael 2026-09-23 night (full vertical). Addendum: Machine sheet always includes Description, Notes, portrait + token art.

## Automated

```bash
node tools/rigger-vertical-smoke.mjs
node tools/s8-machines-smoke.mjs
```

Both must print `passed`.

## In Foundry (morning)

1. **Machine sheet** — Deploy any drone. Open the Actor. Confirm Ghostwire Machine sheet (not full hero sheet). Tabs: Combat / Control / Build / Inventory / Links / Story. Story has **Description** + **Notes**. Header portrait + Token art button work.
2. **Deploy & Command** — On a Wrench, Use **Deploy & Command**. Picker lists owned machine Items. Deploy places token; Command opens a fielded Actor; Jump-In deploys if needed then Jacks In.
3. **Fleet refuse** — Field Fleet Size machines (3 at L1). Next Deploy warns and refuses.
4. **Jump-In** — On a Jump-In Capable frame (or with Rigger Cocoon), Jump-In: pilot Wire state **Jacked In**, meat-inert AE on pilot, link flags both ways. Hit the machine: Uptime drain notify (+ biofeedback Stamina ping unless Ghost Rein).
5. **Base assets** — From Vehicles › Base Assets, give hero Door Lock, Safehouse Beacon, Camera/Sensor Mast. Deploy each. Beacon has Home Ground / Beacon flags. Facility Rigger jacked into Beacon gains Home Ground Edge AE.
6. **Chassis stamp** — Item with `flags.draw-steel-ghostwire.vehicle.integrity` / `speed` / `jumpInCapable` stamps those onto the Actor (band is fallback).
7. **Wreck** — Drop machine Stamina to 0 → wreck warn; Recall still table call.

## Deferred (labeled, not blockers)

- Full drone AI / autonomous turns (Rigged Fire stays ability rolls).
- Parallel Uptime pool UI (class heroic resource only).
- Allfather `git pull` + LevelDB pack rebuild if Foundry was open overnight — Michael closes Foundry and rebuilds `vehicles` + `summons` in the morning if Dropbox checkout lags.
- Perfect ¥/Integrity numeric pass for every chassis beyond E1 base-asset best-shot.

## Packs

`node tools/build-packs.mjs vehicles summons` (Foundry **closed**).
