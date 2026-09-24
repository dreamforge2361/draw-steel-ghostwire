# 0.3.122 — Next-build wave (twelve locks)

**Shipped:** 0.3.122, branch `feat/03122-next-build-wave`.
**Locked by Michael 2026-09-23.** Brief: `docs/directors/_claude-03122-next-build-brief.md`.
**Foundry stayed closed** for every LevelDB rebuild (`origins`, `classes`, `macros`, `pregens`).

Twelve small locks, one ship. Most are one-sentence rules with a fiddly implementation behind them;
the notes below say what changed, and — where it matters — what deliberately did **not**.

---

## 1 · Changer art pickers moved to Biography

The Changer box on the Hero sheet's **Stats** tab keeps its three **form buttons** (Human / Hybrid /
Beast) exactly where they were, under Wired. Swapping form is a maneuver a player takes mid-fight, and
the first page is where they are looking.

What moved is the **art**. R2 (0.3.121) doubled the pickers — a square portrait *and* a round canvas
token for each of three forms — and six thumbnails pushed Stamina and the characteristics below the
fold. Picking art is a once-per-character job, so it now lives at the bottom of the **Biography** tab.

- Same flags: `humanArt` / `hybridArt` / `beastArt` and `humanToken` / `hybridToken` / `beastToken`.
- Same behaviour: picking art for the **currently active** form swaps the sheet portrait and the
  canvas token immediately, through the same `syncChangerFormArt` R2 shipped.
- The Stats box now carries one dim line pointing at Biography, so nobody hunts for the pickers.

## 2 · Director macro: +1 heroic resource

New importable macro, **Director: +1 Heroic Resource** (Ghostwire Macros pack). Target a hero token —
or select one, or several — and the macro adds **+1 to their class's primary heroic resource**: the
Commander's Influence, the Rigger's Adrenaline, whatever that class names it.

- **Not Surges. Not Victories. Not Hero Tokens.**
- The write goes through Draw Steel's own `system.updateResource(+1)`, which is where the class
  **minimum** is enforced and where the system's `modifyTokenAttribute` hook fires. Writing
  `system.hero.primary.value` directly would skip both.
- Targeting follows the house Director pattern: **targeted tokens beat selected ones**, and the
  selection only counts when nothing is targeted — the same helper `Director: Taint +1` uses.
- A non-hero, or a hero with no class yet, is skipped with a warning. Its siblings still get their
  point.
- GM-only. Also available as `game.ghostwire.directorHeroicPlusOne()` and on the module API.

## 3 · Beast-Hide (and Layered Hide) right-click repick

**Beast-Hide** grants one damage immunity out of six, and the card says you may change it when you
finish a respite. The data already said so — the advancement carries `repick: { respite: "finish" }`
and Draw Steel caches it — but **Take Respite does not open the chooser in practice**, so a player was
stuck with whatever they picked at chargen.

Right-click the trait on the sheet → **Re-pick this choice**. That opens Draw Steel's **own**
`effectGrant` chooser over the **stock six-immunity pool** (acid, cold, corruption, fire, lightning,
poison), deletes the old granted effect and creates the new one. No immunity math was invented here,
and no pool is hard-coded in the module — a pack row that adds a seventh immunity tomorrow needs no
code change.

**Layered Hide** carries the identical advancement shape, so it came along free. The rule is "any
owned Item with a re-pickable `effectGrant`", not two hard-coded DSIDs.

The entry sits **inside the sheet's existing row menu**, beside Edit and Delete, rather than opening a
second menu that fights the first for the same right-click.

## 4 · Wire State gained a Disconnect rung

Through 0.3.121 the S9 Wire-state picker offered three rungs — Linked, Overlay, Jumped In — and
argued hard that Disconnected must never be a fourth: Connect was the only on-ramp, Jack Out the only
off-ramp. **Michael retired that doctrine for 0.3.122.** The picker now offers four:

> **Disconnected · Linked · Overlay · Jumped In**

What survived is the thing the old doctrine was actually protecting:

- **Going on-net still needs a Wired interface.** Disconnected → Linked / Overlay / Jumped In runs the
  *same* `actorHasConnectInterface` check the Connect verb runs. Without a deck, a jack or a rig it
  refuses. The toggle is a shorter road to Connect, never a way around it.
- **Coming off-net needs nothing.** You can always pull the plug.
- **Leaving Jumped In still runs `jumpOut()` first**, so a pilot never lands off-net still holding
  `jumpedInto` — the same seat-safety every other landing has.
- **Jump-In is still gated** on exactly one Jump-In-capable machine, refused in Jump-In's own words.

## 5 · Macro: Cycle Wire State

New importable macro, **Cycle Wire State**. Each use steps every selected token one rung:

> Disconnected → Linked → Overlay → Jumped In → Disconnected

- A deck jockey reading plain **Jacked In** (Matrix Toggle's deepest rung, no seat) is one step past
  Overlay, so their next rung is the seat — which then refuses in the ordinary way if they have no
  machine, rather than being silently rerouted somewhere else.
- **Multi-select is forgiving.** Each selected token cycles independently and in order; a Rigger with
  a drone takes the seat while the decker beside them refuses for want of one, and that refusal does
  not stop the rest of the selection from moving.
- The macro performs nothing of its own. It picks the next rung and hands it to `applyWireState`, so
  the interface check, the machine check and the `jumpOut()` cleanup are the picker's code.

## 6 · Stamina tooltip on the locked sheet

Hover the **Stamina** pool on a hero sheet and the tooltip lists **every contributor to max Stamina**:

```
Max Stamina 30
  Class: Rigger            +21
  Kit: Longshot             +3
  Worn armor: Armored Jacket +4
  Trait: Tough But Withered  +2
```

- Class is `starting + (level − 1) × per-level`, exactly as Draw Steel adds it.
- Kit is the **best** kit's bonus × echelon — Draw Steel takes the max across kits, not the sum, and
  so does the tooltip.
- Every Active Effect touching `system.stamina.*` is listed and labelled by the Item it rides in on
  (class, kit, **worn armor**, trait, other effect). `upgrade`-mode changes do not sum, so only the
  winning one is counted.
- Anything the tooltip cannot account for is shown as its own honest **Other effects** row rather
  than being quietly dropped. The printed total is always the sheet's real `system.stamina.max`.

## 7 · Changer Darksight 30

Every Changer now has **Darksight 30** as a People trait, granted automatically by the Changer
ancestry (a pool of one, no choice, level 1). On the canvas it is wired through the **F20**
`sightGrant` path — stock Foundry `basicSight` at range **30** plus the `darkvision` vision mode, the
same `nightOptics` mapping Low-Light Goggles and Cyber-Eyes use. **No custom DetectionMode was
invented**, and it does **not** flip Has Vision: `scripts/token-vision.mjs` still owns that for heroes.

Walls still stop you. This is better eyes, not x-ray.

Vira and Wren were regenerated through `tools/pregens-to-actors.mjs`, so both carry it; the regen is
still a byte-for-byte no-op.

## 8 · Trade Cant is free

Every hero speaks **Trade Cant** (Draw Steel's `caelian` key, relabelled by
`scripts/languages.mjs` — the remap is untouched).

- Stamped on the **create-Actor** path beside Body Integrity and starting ¥, additively: a duplicated
  or imported hero keeps every language it already had.
- Existing worlds get a **one-time, flagged** grant at startup. A player who deliberately drops it is
  not handed it back every load — the lock is "free at creation", not "impossible to remove".
- In the **Chargen Wizard** it is listed but **never counted against the language budget**, its remove
  button is dead, and Start Over restores it rather than clearing it. Without that, every runner would
  arrive at the languages step with their one free pick already spent.

## 9 · Machine conditions from Integrity

A deployed machine's Integrity is its Stamina, and three bands of damage now carry a condition:

| Integrity | Condition |
| --- | --- |
| ≤ **50 %** | **On Fire / Leaking** |
| ≤ **25 %** | **Crippled** |
| **0 %** | **Systems Down** |

- **One band at a time, worst wins.** 0 % beats 25 % beats 50 % beats healthy.
- They are real **statuses**, so a Director sees them on the token as well as on the sheet, and the
  Machine sheet's **first page** prints `Condition: On Fire / Leaking (38% Integrity)`.
- **On Fire / Leaking is one band with two names** on the card, because it is one mechanical state —
  what leaks out depends on whether the frame runs on fuel or fluid, and that is a table call.
- A frame with **no max Integrity** (never deployed, an unrated Base Asset) reads **Unrated**, not
  Systems Down. 0/0 is not a wreck.
- **Stalled and Dead-stick are out of scope** for this ship and are not modelled anywhere.

## 10 · Rat Beast form is a 0.5 token

Rat-lineage Changers in **Beast** form drop to canvas token size **0.5**. Human and Hybrid restore
whatever footprint the token had before the first Beast swap — snapshotted once, so a Director's own
2×2 frame comes back 2×2, not silently normalised to 1×1.

- Lineage is read from the **existing** `flags.draw-steel-ghostwire.changerLineage` on the lineage
  trait Item. No parallel lineage flag was invented.
- Wolf and Raven print no size override in the rules, so they are deliberately absent from the table
  and their tokens are never touched.
- Applies to the prototype token **and** every placed token, linked or not.
- This is the canvas half of a fact the rules already state: `rat-lineage-trait.json` overrides
  `system.combat.size.letter` to **1S**.

## 11 · Advanced Tactics costs 1 Influence

The Commander Street Fixer ability `advanced-tactics` was `resource: null` (free). It is now
**`resource: 1`** — 1 Influence, matching the other Commander spend abilities. The classes pack was
rebuilt and **Barak** was regenerated through `tools/pregens-to-actors.mjs`, so his embedded copy
agrees with the pack and `pregen-regen-smoke` is still a no-op.

## 12 · Worn armor finally adds Stamina

Every armor SKU has always shipped four Active Effects — `No Kit — Echelon 1 (+4 Stamina)` through
Echelon 4 — each an `upgrade` on `system.stamina.bonuses.treasure`, and **every one of them shipped
disabled with nothing anywhere that ever enabled one.** Armor was pure flavour: buy a Hardshell, gain
nothing. 0.3.122 is the missing switch.

- **Worn is a flag, not a guess.** Draw Steel's `treasure` model has no equipped state, so Ghostwire
  keeps its own: `flags.draw-steel-ghostwire.worn`. Right-click an armor row on the sheet →
  **Wear this armor** / **Take off this armor**.
- **New armor that lands on a hero wearing none is worn automatically**, so the common case — buy a
  jacket, gain Stamina — needs no extra click.
- **Only one armor, and the newest wins.** Putting on a second armor takes the first one off. That is
  the documented tie-break: the armor you just put on is the armor you are wearing. Two armor Stamina
  bonuses are never summed.
- **Shields count as armor for this rule.** They live in `gear/armor/shields/` and carry the identical
  band effects, so a Ballistic Board and a Plated Jacket compete for the one slot. If that should
  change, it is one line in `ARMOR_GROUPS` in `scripts/stamina.mjs`.
- **Kit Stamina is untouched.** A kit's Stamina is `kit bonus × echelon` inside Draw Steel's own data
  prep and has nothing to do with these effects. **No kit effect is ever disabled.** The bands are
  *named* "No Kit" because that is what the packs shipped; if a SKU one day ships a
  `With Kit — Echelon N` sibling, the picker honours it and prefers the band matching the hero's real
  kit state. Until one does, the echelon band applies either way.
- **Echelon clamps rather than fails**: a hero past the printed bands wears the highest band the SKU
  has, and the band is re-picked automatically when they level.
- **Catalog copies stay dead.** Every effect in the `gear` pack still ships `disabled: true`; only the
  copy on a hero's sheet is ever switched on.
- Worlds built before 0.3.122 get a one-time pass at startup that wears the one armor a hero already
  owns, so the fix is retroactive.

---

## Files

| Lock | Where |
| --- | --- |
| 1, 8, 10 | `scripts/module.mjs`, `scripts/changer-forms.mjs`, `scripts/languages.mjs`, `scripts/chargen-wizard.mjs` |
| 2 | `scripts/director-resource.mjs`, `src/packs/macros/director-heroic-plus-one.json` |
| 3 | `scripts/trait-repick.mjs` |
| 4, 5 | `scripts/wire-state-toggle.mjs`, `src/packs/macros/cycle-wire-state.json` |
| 6, 12 | `scripts/stamina.mjs` |
| 7 | `src/packs/origins/changer/darksight-trait.json`, `src/packs/origins/changer/changer.json` |
| 9 | `scripts/machine-conditions.mjs`, `templates/machine-sheet.hbs`, `scripts/machine-sheet.mjs` |
| 11 | `src/packs/classes/commander/origins/street-fixer/advanced-tactics.json` |

## Smokes

```
node tools/next-build-wave-03122-smoke.mjs     # ten locks
node tools/wire-state-toggle-smoke.mjs         # locks 4 + 5 (four-rung ladder, cycle)
node tools/f20-foundry-sights-smoke.mjs        # lock 7 audited into the F20 sight table
node tools/pregen-regen-smoke.mjs              # locks 7 + 11 stayed a regen no-op
```

Foundry checklist: `docs/directors/next-build-wave-smoke-03122.md`.
