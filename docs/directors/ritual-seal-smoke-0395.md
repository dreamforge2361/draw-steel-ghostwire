# Ritual Seal artifacts — Foundry checklist (0.3.95 / F8)

Node smoke first, in the module folder with Foundry **closed**:

```
node tools/ritual-seal-smoke.mjs
node tools/ritual-working-smoke.mjs
```

Both must print `passed`. Then open the world and walk the list below.

Design source: `docs/directors/_claude-f8-f6-prompt.md` (LOCKED 2026-09-22).
Code: `scripts/ritual-seal.mjs`, hooked from `scripts/ritual-working.mjs` → `#onSeal`.

---

## What a seal leaves behind

Every artifact carries the same block at `flags.draw-steel-ghostwire.ritualEffect`:

```
workingId, workingName, formulaUuid, family, familyKey, magnitude,
leaderUuid, leaderName, sealedAt (ISO), expires (text|null), scope,
sealTier, outcomeKey, artifact
```

| Family | Artifact | Where it lands |
|---|---|---|
| **Ward**, **Threshold** | scene marker | a neutral, turn-less NPC Actor in the **Ritual Effects** Actor folder, its Token beside the Ritual Leader on the active Scene |
| **Calling** | summons path | `veil-summons.mjs` when the card names `ritual.summonDsid`; **no shipped card does yet**, so today it lands as an Active Effect on the Leader and the chat card tells the Director to place what answered |
| **Artifice** | Item | a `treasure` Item on the Ritual Leader |
| **Reach** | Active Effect | a non-transferring Active Effect on the Ritual Leader, no Scene token |
| **Unmaking**, anything unrecognised | chat only | the Ritual Effect chat card and nothing else |

A **hung seal (tier 1 / low) makes nothing.** So does an unrolled seal.

---

## In Foundry

### 1. Ward the Room — the rite the design names first

- [ ] Open a Scene and drop a token for a hero who carries **Ward the Room** (Kaïs, Vessa and Sabbat ship with it learned).
- [ ] Open the **Ritual Working** panel (scene control ⬡, or right-click the Formula → Start Ritual Working).
- [ ] Under stage **4. Seal**, before you roll, the panel reads *"A clean or held seal stands a non-combat marker on the Scene beside the Ritual Leader."*
- [ ] Take the Working through Study → Components → Sanctum, then press **Seal Ritual** until you get a **middle or high** tier.
- [ ] A **`Ward: Ward the Room`** token appears one square to the Leader's right.
- [ ] The token is **neutral** disposition, has **no vision**, name shows on hover, and no HP bars.
- [ ] Open its Actor sheet → **Biography** shows Working / Family / Magnitude / Ritual Leader / Scope / Expires / Seal.
- [ ] The Actor sits in an Actor folder called **Ritual Effects**.
- [ ] Roll initiative / start a combat — the marker is **not** in the tracker and takes no turn (`system.combat.turns` is 0).
- [ ] Chat shows the **Ritual Effect** card: *"Sealed — Ward: Ward the Room stands on &lt;Scene&gt;. The Working is live."* plus the same field block.
- [ ] Back in the panel, stage 4 now offers **Open the Ritual Effect** — it opens the marker Actor.

### 2. A hung seal leaves nothing

- [ ] Start a second Working (any Ward card) and seal it to **tier 1 (low)**.
- [ ] No marker token appears, no Actor is created, and no Ritual Effect chat card is posted — only the applet's own hung-seal card.

### 3. The Director can take it back

- [ ] As GM, on a sealed Working press **Reset (Director)** on stage 4.
- [ ] The marker Token **and** its Actor are gone from every Scene, and the notification says how many Ritual Effects were cleared.
- [ ] The seal stamp is cleared and **Seal Ritual** is offered again.
- [ ] **Abandon Working** on a sealed Working also takes its artifact with it.

### 4. The other families

- [ ] **Artifice** (e.g. a Chassis Dressing / Anchor Rune card): sealing at middle or high puts a new Item on the Ritual Leader named `Artifice: <Working>`; its description carries the field block.
- [ ] **Reach**: sealing leaves an Active Effect on the Leader named `Reach: <Working>`; no token appears on the Scene.
- [ ] **Calling**: sealing leaves an Active Effect on the Leader and the chat card reads *"No summon template is wired to this Calling yet, so the Director places what answered."*
  **TODO (backlog):** wire `flags.draw-steel-ghostwire.ritual.summonDsid` onto the Calling Formulas so they route down `veil-summons.mjs` for real. The routing and the stamp are already in place — only the template ids are missing.
- [ ] **Unmaking**: sealing posts the chat confirmation and leaves no token, no Item and no effect.

### 5. Edge cases

- [ ] Seal with **no Scene active** (close the Scene first): the Working still seals, and chat reads *"…there is no active Scene to stand its marker on. Place it by hand."*
- [ ] Seal as a **player** in a world where players may not create Actors: the Working still seals, chat says the Director must stand the marker, and nothing is half-created.
- [ ] Nothing in any of the above moved **¥, Essence, Conviction or Resonance**. The only ¥ in the ritual stack is still stage 2, Pay Components.

---

## Known gaps (not bugs)

- No shipped Ritual Formula prints a duration, so every Ritual Effect reads **"until broken, dispelled or let go"**. When a card gains `ritual.duration`, the text is picked up with no code change.
- Calling has no summon templates yet (see §4).
- The marker reuses `assets/tokens/summons/sprite-ward.webp` (0.3.133 A: the ward sprite is one art for all three tiers, and the per-tier `sprite-ward-minor.webp` it used to point at is gone). Dedicated ward-glyph art is an art-track item, not a blocker.
