# F13 — Cover/Conceal (0.3.116)

**Michael lock, 2026-09-23.** One token-level toggle called **Cover/Conceal**. While it is on, a
**ranged** attack power roll targeting that token takes a **bane**. Melee is unaffected.

Cover and Conceal are deliberately the *same* toggle with the *same* effect. Behind a dumpster or
lost in the smoke, the shooter has the same problem: they cannot see enough of you.

---

## What a Director does

Select the token, open the token HUD's status palette, click the shield. That's it — it is a
standard Foundry status effect sitting in the same palette as the Wired statuses and meat-inert, so
it toggles, shows on the token, travels on the Actor, and clears the way every other status does.

Taking or dropping it posts a one-line card to chat with the rule under it, so nobody has to
remember which way the bane runs. (World setting: *Announce Cover/Conceal in chat*. The toast
always fires.)

## What it does mechanically

**One bane. Ranged only. On the roll that targets the covered token.**

It rides Draw Steel's own per-target modifier seam — the same place the system computes Frightened,
Grabbed, Restrained and Surprised. That buys three things at once:

- **It lands on the right roll.** In a multi-target attack, only the rolls against covered targets
  take the bane. Injecting into the ability's flat modifiers instead would have baned every target,
  which is not the rule.
- **The player sees it before the dice move.** It shows in the roll dialog's per-target modifier
  block, and it recomputes live when the player re-targets — so a Director who rules otherwise can
  clear it there.
- **It stacks correctly with everything else.** The system's own modifiers still run first; this
  adds to them.

It never stacks with itself: the status is a single flag, not a count. A target behind cover *and*
concealed is one bane.

## Ranged, decided how

| Ability | Ranged? |
|---|---|
| `distance.type: ranged` (every Ghostwire gun) | **yes** |
| `ranged` keyword, no `melee` keyword | **yes** |
| a cube / line / wall thrown or fired from a distance, `ranged` keyword | **yes** |
| `distance.type: melee`, or the `melee` keyword alone | no |
| `self`, `aura`, `burst` | no |
| **melee *and* ranged** — one weapon that does both | **no — Director's call** |

That last row is the one judgement call in the pass, and it is deliberate. Draw Steel lets the
player pick melee or ranged mode for a `meleeRanged` ability in the roll dialog, and nothing in the
use pipeline says which they chose. The lock is "melee unaffected", so silently baning a melee swing
is the worse error. If someone shoots from cover with a weapon that also swings, add the bane in the
dialog — it is one click, and it is visible.

Every weapon band Ghostwire ships classifies correctly and the smoke walks all five
(Adjacent → melee; Short / Medium / Long / Extreme → ranged).

## Scope

Combat UX only, as locked. **No Flanking (F14), no Cyborg Crisis (F15), no cover tiers.** The smoke
asserts the absence of all three in the source, so a later pass has to make that choice deliberately
rather than by drift.

## Running it

- **Cover is a thing a Director gives out, not a thing players claim.** One bane is small enough to
  hand out freely and large enough to change where people stand.
- **Say it out loud when it comes off.** The chat line is there so the shooter knows the window
  opened.
- **It does not block line of sight.** Cover/Conceal is a roll modifier, nothing more — Ghostwire's
  token vision and the Overlay / Jacked In vision paths are untouched.

## Files

- `scripts/cover-conceal.mjs` — the status, the ranged predicate, the bane, the announcements.
- `scripts/module.mjs` — one registration line.
- `lang/en.json` — `GHOSTWIRE.CoverConceal`.
- `styles/ghostwire.css` — the chat line.

Status id `ghostwire-cover-conceal`, effect `_id` `gwCoverConceal00`, icon `icons/svg/shield.svg`.

## Smoke

    node tools/cover-conceal-smoke.mjs

No pack rebuild — scripts, lang and CSS only.
