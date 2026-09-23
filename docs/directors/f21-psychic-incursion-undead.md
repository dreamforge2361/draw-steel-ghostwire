# F21 — Psychic attacks on Incursion / undead (0.3.119)

**Michael lock, 2026-09-22 + queue 2026-09-23.** A Cyborg's **Cortical Firewall** gives psychic
immunity equal to their level. Before this build almost nothing in the Veil or the Incursion actually
dealt psychic damage, so the trait was a line of text that never fired. Now it has something to stop.

---

## The doctrine

**Psychic marks an attack whose only medium is the mind.** Where the attack's medium *is* the mind, the
damage type is `psychic` as well, so the firewall bites. Where the attack has a physical medium — a
bullet, a claw, a thrown canister — the keyword is **not** added and the medium keeps its own damage
type.

That is the whole rule, and it is why a zombie's Clobber and Clutch is untouched while a ghost's wail
is not.

**The keyword.** Draw Steel ships `psionic`, but that is the **Talent class** keyword. A Veil ghost's
wail and a voiceless talker's reach are not Talent powers, and Cortical Firewall keys off psychic
**damage**, not off `psionic`. So Ghostwire registers a `psychic` ability keyword alongside its existing
`tech` / `chrome` / `optics` / `wired` / `command` (see `scripts/module.mjs`). The keyword is the marker
you can read and filter on; **the damage type is what the firewall absorbs.** `magic` is never stripped
when both apply.

## What changed

### Ghost — Veil undead, leader

| Ability | Before | After |
|---|---|---|
| **Heat Death** (signature, main) | `magic` `ranged` `strike`, 7 / 10 / 13 **cold** | `+ psychic`, 7 / 10 / 13 **psychic** |
| **Awful Wail** (villain action) | `area` `magic`, 3 / 5 / 8 **sonic** | `+ psychic`, 3 / 5 / 8 **psychic** |
| **Shriek** (triggered) | `magic` `melee`, 2 sonic | **unchanged** |

A Veil ghost kills through the mind. Heat Death replays the last minute of its own death inside your
skull — the cold is remembered, not real. Awful Wail never moves air; every enemy in the burst hears it
from the inside, so a sonic-sealed helmet does nothing and a Cyborg's firewall does.

**Shriek stays sonic on purpose.** It is a defensive scream at melee range, and a ghost should not be
psychic end to end — leaving one sonic rung keeps the stat block readable and gives a psychic-immune
hero something still to fear.

### Ghoul — Veil undead, horde

Razor Claws stay **weapon / melee** (brute physical undead do not become psychic — brief rule 3). The
ghoul gains one new ability instead:

> **Hunger Bleed** · Malice 3 · maneuver · `area` `magic` `psychic` · 2 burst · each enemy in the area
> · 2 / 3 / 4 psychic · tier 2 weakened (save ends), tier 3 frightened (save ends)

The ghoul stops chewing and lets everyone nearby feel exactly how hungry it is. Banded and priced off
the zombie's **Zombie Dust** (Malice 3, burst 2, 2 / 3 / 4) so nothing here is an invented number.

### Veil Cultist — living human, dark-pact cell leader

The **Hexed Revolver** is a bullet and stays `magic` `weapon` corruption. The cultist gains:

> **Show Them the Debt** · Malice 2 · maneuver · `magic` `psychic` `ranged` · ranged 10 · one enemy ·
> 4 / 6 / 9 psychic · tier 2 and tier 3 frightened of the cultist (save ends)

They read a name off the ledger and let the mark watch what they signed away. Banded off the cultist's
own **Blight Grenade** (4 / 6 / 9).

### Hunter Spirit — `summons/spirits`

**Binding Chain** gains `psychic` and now deals **psychic** damage under either pact.

The chain is a name, not metal. This is the one place where a spirit's strike *stops* following the
pact tint: the **Warrior Spirit's Pact Blade still tints holy or corruption**, and only the Hunter binds
by name. That is printed on the card. The restrain rider and Hunter's Bind are unchanged.

### Voiceless talkers — Incursion horrors, `bestiary/wire-machine`

**Signal Talker (Invader)**'s *Psionic Boom* and *Memory Thief* already rolled psychic damage; they now
carry the `psychic` marker keyword too, so one grep finds the whole psychic surface. Their *Tentacle*,
*Tentacle Toss* and *Brain Drain* are tentacles and stay as they are.

**Signal Mindkiller (Whelp)** is untouched: *Eager Claws* is a claw and *Feast* deals no damage, so
there is nothing for a firewall to absorb and nothing worth a cosmetic tag.

### Left physical on purpose

| Actor | Why |
|---|---|
| **Skeleton** (`undead`, **`soulless`**) | Bone Shards and Bone Spur are bone. A soulless undead has no mind to push with. |
| **Zombie** (`undead`, **`soulless`**) | Clobber and Clutch is a fist; Zombie Dust is dust, and corruption is the right type for it. Same soulless reason. |
| **Guardian Spirit / Warrior Spirit** | The Guardian has no strike. The Warrior's Pact Blade is the pact system's showcase — holy under Light, corruption under Dark. Retyping it would have deleted a shipped choice. |
| **Club Patron (Revenant)**, **Madame Quill**, **Nim** | Street undead who hit people with their hands, or do not attack at all. |

The `soulless` keyword is now the line: it is the in-repo tag for an undead with nothing behind its
eyes, and it is exactly the set that gets no psychic option.

## What a Director does

**Point it at a Cyborg.** A Cyborg hero with Cortical Firewall reduces every one of the attacks above
by their level, automatically — the trait already writes `system.damage.immunities.psychic` = `@level`,
and the roll now carries a psychic damage type for it to meet.

**Point it at anyone else.** Nothing new to learn. Psychic damage has always been in the Draw Steel
damage table; these attacks simply use it.

**Watch the Ghost fight change shape.** A Cyborg tank now soaks Heat Death and shrugs a large slice of
Awful Wail, while the same ghost's Shriek still lands in full. That asymmetry is the point.

## Scope

No new monster families. No Cyborg People rewrite. No Renown. Packs rebuilt: `bestiary`, `summons`.
Smoke: `node tools/f21-psychic-incursion-undead-smoke.mjs`.
