# F11 — Critical Roll feedback (0.3.116)

**Michael lock, 2026-09-23.** A critical should be *felt*. Ghostwire now detects a Critical Roll in
the normal roll pipeline and answers with a sound, a flash, and a short card telling the roller what
they just won.

This is not an SFX overhaul. B40 (ability / weapon / gear sounds) is untouched and still fires; a
critical stacks one extra sting on top of it.

---

## What the table sees

A power roll comes up a **natural 19 or 20**:

1. **A sting** — `assets/sfx/sword-crit.ogg`, already in the repo since B40's keyword map. Plays on
   Foundry's interface channel at the same volume as ability SFX, so the existing mute and volume
   sliders apply for free.
2. **A flash** — a short vignette pulse around the canvas, and the roll's chat card picks up a hot
   glow. Pure CSS; nothing here depends on a VFX module being installed.
3. **A rule card** — a short card in chat saying what that critical does.

## What the card says

Ghostwire's own paraphrase, not book text. Two versions:

**On an ability** — read it at its **tier 3** line whatever the total came to; your turn is not over,
take another **main action** now; and everything the ability already does at tier 3 still happens.

**On a test** — read it at **tier 3**, and take something extra on top: a detail nobody offered, a
shortcut, somebody who now owes you. The Director says what.

Both end with the line that matters most at a table learning the system: **only the natural result
on the two dice counts.** Edges, banes, bonuses and a target's Cover/Conceal move the total, but
they never make or unmake a critical.

## How it detects

Draw Steel emits no "critical" hook, so the signal is read off the chat message — the same fire
point B40 uses, for the same reason.

- `PowerRoll#isCritical` is `dice[0].total >= options.criticalThreshold` (19 by default), and
  `PowerRoll#isNat20` is `>= 20`.
- An **ability** use pushes an unmodified base PowerRoll onto the message, then one `abilityResult`
  part per tier holding the per-target rolls. Every one of those shares its first dice term with the
  base roll, so the natural result is the same number wherever you read it.
- A **test** pushes its single PowerRoll onto the message *and* into a `test` part.

So Ghostwire walks the message's own rolls plus every part's rolls, keeps the power-roll-shaped ones,
and takes the best natural. One read covers both pipelines and patches nothing.

Two things it deliberately does **not** do:

- **It never reads a roll total.** A natural 11 that totals 31 through three edges and a kit bonus is
  not a critical, and the smoke asserts exactly that case.
- **It never counts a damage roll.** A message carries damage rolls next to the power roll, and 3d6
  can total 19. A damage roll has no `criticalThreshold`, so it is filtered out — also asserted.

**Project rolls are out of scope.** A project critical is downtime bookkeeping rather than a table
moment, and it gets no sting, no flash and no card.

If a Director raises `criticalThreshold` on a roll, the highest threshold present on the message is
honoured — a natural 19 against a threshold of 20 is not a critical.

## Settings

Under Ghostwire in Configure Settings:

| Setting | Scope | Default |
|---|---|---|
| Critical Roll sound | world | on |
| Critical Roll sound file | world | `assets/sfx/sword-crit.ogg` |
| Critical Roll flash | **client** | on |
| Critical Roll rule card | world | on |
| Whisper the Critical Roll rule card | world | off |

The flash is client-scoped on purpose: a player who does not want their screen pulsing can turn it
off for themselves without taking it away from the table. Volume is B40's existing **Ability SFX
volume** — there is deliberately no second volume slider.

Turn the rule card off once the table has the rule memorised; turn the whisper on if you want the
reminder to reach the roller and the Director without filling the log.

`CONFIG.debug.ghostwireCrit = true` in the console traces detection.

## What a Director should know

- **One client fires it.** The player whose roll created the message plays the sound and posts the
  card; the sound is pushed to the other clients the way B40 does it. The flash runs wherever the
  card is drawn, so everyone sees it — but only for a message that just arrived. Scrolling the log
  back does not re-flash the room.
- **B40 still works.** The ability-use sound and the per-item SFX override on ability sheets are
  unchanged. A critical is additive.
- **No new audio ships.** The crit sting was already in-tree. Point the setting at any audio file
  you prefer.

## Files

- `scripts/crit-feedback.mjs` — detection helpers (Foundry-free), settings, SFX, flash, rule card.
- `scripts/module.mjs` — one registration line.
- `lang/en.json` — `GHOSTWIRE.Crit`.
- `styles/ghostwire.css` — the flash keyframes, the crit glow, the card.

## Smoke

    node tools/crit-feedback-smoke.mjs

It executes detection for real against message shapes built to match what Draw Steel 1.1.2 creates,
including the `.contents` ModelCollection shape that silently broke B40's first cut, and it asserts
the rule card is short enough to be a reminder rather than a page of reproduced prose.

No pack rebuild — scripts, lang and CSS only.
