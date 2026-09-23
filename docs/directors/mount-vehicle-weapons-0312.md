# Director note — mounting guns on a machine (0.3.112)

Ghostwire **0.3.112** finishes the §5F Weaponry ladder. Until now a Gun Rack was a line on a sheet with
no gun in it. Now a concrete weapon Item is bolted into the hardpoint, the capacity is enforced, and
Deploy carries the gun onto the machine.

Two things landed:

1. **Mount on… / Unmount weapon** — a weapon Item attaches to an installed **Gun Rack**, **Twin Mount**,
   **Turret Ring**, or **Heavy Hardpoint**.
2. **§3H Vehicle & Mounted Weapons** — nine new gear SKUs built to be mounted, on the gear pack and on a
   new **Hardpoint Bay** kiosk shelf.

---

## 1 · How a player mounts a gun

The whole chain lives on the **hero's sheet**. Nothing is bought or built on the machine Actor.

1. Buy / own the **chassis** (a drone or vehicle Item from Ghostwire Vehicles & Drones).
2. Buy a **Weaponry kit** (§5F) and **Install onto…** the chassis. One weaponry kit at a time —
   `exclusiveKit: "weaponry"` still refuses a second, and swapping means uninstalling the first.
3. Buy the **gun** (§3H, or a Mounted-tagged heavy like Wallbreaker).
4. Right-click the gun's row on the hero sheet (or its ⋮) → **Mount on…**, pick the kit, confirm.
   The prompt lists every kit the hero owns; ones that cannot take this gun are listed disabled with
   the reason ("hardpoints full", "needs a medium mount", "kit not installed").
5. **Deploy** the chassis. The mounted gun is mirrored onto the machine Actor — it shows in the Machine
   sheet's **Inventory** tab, and the **Build → Hardpoints** line reads e.g.
   `pintle; Gun Rack · 1 hardpoint · category-3 · Gunnery · Roadspike (1 / 1)`.
6. **Unmount weapon** frees the hardpoint. The gun stays in the hero's inventory; the mirror on the
   machine disappears on the next restamp.

Mounting is a **downtime §Craft Project** at the table, exactly like installing a mod. Foundry records
the result; it does not gate the Project. A public chat card posts who mounted what onto which kit and
which fielded machine it reached, matching the 0.3.111 *Install onto…* card.

## 2 · Firing it — Gunnery, not Heavy Weapons

**B49 lock:** a gun on a hardpoint answers to **Gunnery**. Mounting a Wallbreaker swings its use-ability's
+2 from Heavy Weapons to Gunnery *without moving the Item*; unmounting swings it back. The §3H SKUs are
Gunnery always — they have no hand-held mode.

At the table that means the pilot's **Rigged Fire** (Wrench), or the machine's own action. Roll Logic, or
Reflex while Jumped-In, and add Gunnery. The gun's own **Fire <name>** ability on the hero sheet is the
convenient way to roll it; the +2 follows the skill the mount implies.

## 3 · What fits what

Scale ladder: **category-3 < medium < heavy**. A mount takes any gun at its own scale *or below*.

| Kit | Hardpoints | Scale | Extra |
|---|---|---|---|
| Gun Rack | 1 | category-3 | — |
| Twin Mount | 2 | category-3 | dual feed |
| Turret Ring | 1 | medium | powered turret, wide arc |
| Heavy Hardpoint | 1 | heavy | integrated battery |

Two requirements run the other way:

- A gun tagged **Turret** (Lanternhead, Crownfire) needs a powered ring — **Turret Ring only**.
- A gun tagged **Integrated** (Hailstorm, God's-Finger, Quiverframe) needs the battery mount —
  **Heavy Hardpoint only**.

Which hand-held weapons are mount hardware: **Heavy band → category-3** (Chatterbox, Wallbreaker,
Grease-Gun, Hand-of-God, Dragon's Breath), **Anti-veh band → heavy** (Siege Missile, Tank-Cracker).
Light and Medium sidearms are not; the prompt says so rather than silently allowing it. Homebrew can
override either way with `flags.draw-steel-ghostwire.gear.mountScale` or `gear.mountable: false`.

**Scale sanity stays yours.** Nothing stops a micro-drone with a Gun Rack from carrying a Wallbreaker —
the kit's cost and echelon are the gate the rules print, not a frame-size check. If it reads absurd at
your table, say no; that is a Director call, not a bug.

## 4 · The nine new SKUs (§3H)

| Gun | Ech | Avail | ¥ | Base | Range | Mount |
|---|---|---|---|---|---|---|
| Hornet Pod | 1 | Professional | 900 | 6 kinetic | Short | category-3 (drone-scale) |
| Roadspike | 1 | Professional | 1,200 | 9 kinetic | Medium | category-3 |
| Streetlash | 2 | Restricted | 3,400 | 9 kinetic | Long | category-3 (dual-feed) |
| Ashwalker | 2 | Restricted | 4,200 | 9 fire | Short | category-3 (Blast) |
| Lanternhead | 3 | Military | 9,500 | 10 fire | Medium | medium **turret** (Blast) |
| Crownfire | 3 | Military | 13,000 | 11 AP | Long | medium **turret** |
| Hailstorm | 4 | Prototype | 30,000 | 14 kinetic | Long | heavy **integrated** |
| God's-Finger | 4 | Prototype | 38,000 | 14 AP | Extreme | heavy **integrated** |
| Quiverframe | 4 | Prototype | 44,000 | 14 fire | Extreme | heavy **integrated** (Blast, Smart-ready) |

Full rows, with the tri-register names and tags, in `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §3H.
Availability, price band and mod slots follow §F5/§F6 from Item Tier; Weapon Base follows the
Damage-Bridge (Heavy ≈ 9, Anti-veh ≈ 14).

**Buying them:** Ghostwire Gear → *Vehicle & Mounted Weapons*, or drop a kiosk and pick the new
**Hardpoint Bay** type (`vehicleWeapons`). That shelf stocks §3H *and* the Mounted-tagged heavies,
because a mount vendor sells both. The Weapons Cage still carries everything, as before.

---

## 5 · Smoke checklist (Director, live Foundry)

`node tools/mount-weapons-smoke.mjs` covers the static side (170 checks). The table side:

1. **Reload the world** after the module update so the rebuilt `gear` pack is picked up.
2. Ghostwire Gear → **Vehicle & Mounted Weapons** → nine SKUs, each with art, ¥, and a card that says
   *fires with Gunnery*.
3. Drag **Roadspike** and a **Bulldog** (or any vehicle) and a **Gun Rack** onto a Wrench.
4. Gun Rack row → **Install onto…** → Bulldog. Confirm the Install chat card.
5. Roadspike row → **Mount on…** → the prompt offers `Gun Rack @ Bulldog (category-3; 0 / 1)`. Confirm.
   You get a *Weapon mounted* chat card and the Roadspike's Item sheet reads
   *Mounted on: Gun Rack — Bulldog*.
6. Try to mount a second Category-3 gun → refused, "hardpoints full". Try a **God's-Finger** → refused,
   "needs a heavy mount".
7. **Deploy** the Bulldog. The machine Actor's **Inventory** lists Gun Rack *and* Roadspike. **Build →
   Hardpoints** names the gun.
8. **Unmount weapon** on the Roadspike while deployed → the machine's Inventory drops the Roadspike; the
   Gun Rack stays; the hero keeps the gun.
9. Re-mount, then **Uninstall** the Gun Rack → the Roadspike unmounts itself (no mount pointing at a kit
   in the parts bin) and the machine's Inventory drops both.
10. Swap test: install a **Turret Ring** in place of the Gun Rack (uninstall first — one weaponry kit at
    a time), mount **Crownfire**, redeploy. The turret gun appears; a Gun Rack would have refused it.
11. Regression sweep on the same machine: an **armor kit** still moves Integrity, **Ammo Bin** still
    installs alongside the weaponry kit, a **Rigger Cocoon** still enables **Jump-In**, and Jump-In /
    Jump-Out still work with a gun mounted.
12. Kiosk: drop a kiosk, type **Vehicle weapons** → *Hardpoint Bay*, **Restock from preset** → the nine
    SKUs plus Wallbreaker and Siege Missile, priced from the catalog.

## 6 · Notes and limits

- A weaponry kit **switched off** in the field keeps its gun and its slot, but stops feeding: the gun is
  not mirrored onto the machine while the kit is off. Switch it back on and it returns.
- The machine-side copies are **mirrors**. Edit the gun on the hero's sheet, not on the machine; the next
  restamp (install, mount, toggle, Deploy) rewrites the machine's copy.
- Deleting a mounted gun, or the kit, cleans up both sides and restamps any fielded machine.
- Only the hero who owns both Items can mount one on the other. Cross-sheet mounting is refused.
- Nothing here changes Fleet Size, Scorch Marks, Linked, or the Wired Console.

## 7 · Sources in this repo

- `scripts/mounts.mjs` — the mount tracker, the prompt, the chat card, the cleanup hooks.
- `scripts/machines.mjs` — `mountedWeaponsOn`, `machineMountMirrorData`, and the Deploy mirror.
- `scripts/weapon-skills.mjs` — `isMountedWeapon` → Gunnery (B49 / G4).
- `src/packs/gear/weapons/mounted/` + `lang/en.json` (`GHOSTWIRE.Gear.Items.*`, `GHOSTWIRE.Mounts.*`).
- `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §3H and the §5F weaponry-kit note.
- `tools/mount-weapons-smoke.mjs`, and the updated `tools/g4-skill-on-weapon-smoke.mjs` /
  `tools/kiosk-smoke.mjs`.
