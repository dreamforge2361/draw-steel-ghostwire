# Jump-In: firing the machine's own guns (0.3.114)

**Smoke:** `node tools/jumpin-mounted-fire-smoke.mjs`

## What changed

A pilot who is **Jumped In** can now Fire a weapon that is **mounted** on their machine's §5F Weaponry
kit — the Streetlash on a Gun Rack, the Godsfinger on a Heavy Hardpoint, any of the §3H mounted SKUs.
Before 0.3.114 the Jacked In gate refused it with *"your meat body is locked"*, because the gate only
recognised a fixed list of seat abilities and a spawned `Fire` ability is not on that list.

Nothing else about Jacked In loosened. A gun **in the pilot's hands** — a scrap-bow, a hand cannon,
an unmounted Streetlash still in the pack — is still refused while Jumped In. The rule the code now
follows is *where the gun is bolted*, not *what the gun is*: mount it and it becomes part of the
machine; unmount it and it is meat again.

## The edges

| Roll | Jumped In | With **Pilot and Gunner** |
|---|---|---|
| Rigged Fire | +1 edge (weapon lock) | **+2 edges** (weapon lock + the feature's extra edge) |
| Fire, mounted weapon | +1 edge (weapon lock) | +1 edge |
| Fire, carried weapon | refused | refused |

**Weapon lock** is the Jump-In benefit in the Wrench master (Jump-In Plumbing: "one weapon-lock
edge") — the machine's own targeting holds the shot for you. It applies to every gun you fire *from
the seat*, so both Rigged Fire and a mounted Fire get it.

**Pilot and Gunner** (Vehicle Rig-Pilot) is the *extra* edge on top, and it is Rigged Fire only:
"you gain an edge on Rigged Fire made this way." A Rig-Pilot rolling Rigged Fire while Jumped In
therefore rolls two edges. Foundry caps a roll at two edges (double edge), so that is the ceiling in
play; Ghostwire hands the modifiers to the roll dialog and lets the system do the capping, and the
player can see and clear them there if you rule otherwise.

Both edges arrive in the roll dialog as modifiers, alongside the Gunnery **+2** skill bonus a mounted
gun already earned in 0.3.112 / B49. A Gunnery-skilled Rig-Pilot firing Rigged Fire from the seat is
looking at two edges and +2.

## Director notes

- The edges key off the **`jumpedInto`** flag, which only Jump-In sets and Jump-Out clears. A pilot
  who is merely Jacked In to the Matrix (no machine) gets neither edge, and is still refused on the
  mounted gun — they are not in a seat.
- The Fire ability stays on the **pilot's** sheet. Deploy still mirrors the gun onto the machine
  Actor for display; nothing was armed onto the machine Actor, so the machine does not gain its own
  attack buttons.
- Unmount the gun (Machine sheet → the hardpoint's **Unmount**) and the same Fire is refused again
  while Jumped In. That is the intended tell: if the gun is not on a hardpoint, it is in your hands,
  and your hands are asleep.
