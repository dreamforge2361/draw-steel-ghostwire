# Spike B52 — Technomancer ability pass + Compile Sprite summon

**Repo:** draw-steel-ghostwire  
**Depends on:** B31 Technomancer pack; summons sprites (12 Actors); scripts/machines.mjs Deploy/Recall pattern; RAW docs/raw/ Technomancer + masters.  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch (0.1.71).  
**Close Foundry before uild-packs.mjs.** Prefer BOM-free JSON writes (Python/json.dump); never PowerShell Set-Content on module.json.

SFX (0.1.70) and B51 design spike are already on main — do not reopen those.

## A — Ability card pass (all Technomancer abilities)

Audit every ability under src/packs/classes/technomancer/abilities/ (+ lang keys).

### Attacks / damage signatures
- **Resonance Strike** is broken today: power.effects is 	ype: "other" with prose "Full damage" — Foundry chat has nothing to roll/apply. Fix to Draw Steel damage effect:
  - tier1 (low ≤11): no damage (value "0" or omit apply — prefer explicit 0 + display from lang)
  - tier2 (middle): 2d10 + @chr (characteristics already 
eason / Logic)
  - tier3 (high): 2d10 + @chr + rider text (glitch bane / sprite reposition)
  - Resonance-Warrior Overcharged Strike (3d10) stays a **subclass feature**, not baseline item math
- Fix lang Effect_before that still says "Add your Resonance skill" — power rolls do **not** add skills (edge only on tests).
- Scan other combat abilities (Resonance Slam, Cascade Failure, Swarm, Sprite Storm, etc.): if they deal damage on power-roll tiers, they must use 	ype: "damage" with numeric 	ier1/2/3.value, not prose-only other. Non-damage utilities can stay other / before-effects if the card still reads clearly.

### Non-attack cards
- Ensure before/after/spend effect text matches Pass C / RAW (biofeedback Weakened where locked, no Winded-as-condition, no DC leftovers).
- Spend/enhance buttons should match printed Resonance costs.
- Distance/target fields should not be blank where RAW specifies Wired range / sprite reach.

Update lang/en.json as needed; keep _ids stable. Rebuild classes pack after src edits.

## B — Compile Sprite → manifest sprite Actor (like drones)

Mirror scripts/machines.mjs Deploy/Recall, but for sprites:

1. Using **Compile Sprite** (or a clear sheet/action flow) lets the Technomancer **pick archetype** (Data / Attack / Machine / Ward) and spawn the matching **minor/intermediate/advanced** Actor from src/packs/summons/sprites/ based on hero level bands (RAW: minor L1–3, intermediate L4–7, advanced L8–10).
2. Place token **next to the caster** on the current scene (same placement idea as machine deploy).
3. Link flags both ways, e.g. lags.draw-steel-ghostwire.compiledSprite on a tracker (ability use / actor list) and lags.draw-steel-ghostwire.compiler on the sprite Actor (ctorUuid of the Technomancer).
4. Respect **sprite cap** (2 base / Weaver 3; level bumps per RAW). Block compile when at cap with a clear notification.
5. **Decompile / dismiss**: free maneuver or Recall-style control deletes token+Actor (or returns to pool); end-of-encounter cleanup can be a follow-on if hard — document.
6. Stamina: set from live formula when possible (Data/Attack/Machine/Ward tables in RAW); if formula hooks are heavy, stamp template Stamina and note in as-built.
7. New script e.g. scripts/sprites.mjs, register from module.mjs. Reuse folder pattern (deployedMachines → compiledSprites).

Investigate whether Compile Sprite’s abilityUse can open a dialog then spawn, or whether a sheet button on the ability/feature is cleaner — prefer the path that feels like Wrench Deploy.


## Level scaling lock (Michael 2026-09-17)

Sprites **must** get stronger as the Technomancer levels. RAW (docs/raw/20-technomancer.md):

1. **Hybrid rank by hero level** (pick the Actor band on compile, never leave a stale minor forever):
   - **Minor** L1–3 — extension (acts on Technomancer turn)
   - **Intermediate** L4–7 — commanded (own turn with standing orders)
   - **Advanced** L8–10 — independent (own turn)
2. **Stamina formula** stamped from live caster: archetype base + (**Logic × Level**). Use the Sprite Stat Block Reference table (Data 8/14/20, Attack 12/18/26, Machine 10/16/22, Ward 10/16/22 bases at minor/int/adv).
3. **Attack/effect bonuses** from the same table (Attack-sprite damage dice step up by rank; Ward screen escalates; etc.).
4. Sprites **decompile when the encounter ends**, so the next Compile naturally picks the current band. If a hero levels mid-session with sprites still out, dismiss+recompile (or auto-refresh) so Stamina/band match — do not leave L3 math on a L4 caster.

Cap: 2 base / Sprite-Weaver 3 (+ RAW level bumps). Document as-built.

### Spirits / elementals (same fantasy, different RAW — NOT in B52 implement scope)

Do **not** force the sprite L1–3 / L4–7 / L8–10 Actor matrix onto Street Priest or Elementalist. Follow each class chapter:

- **Elementalist:** Rank by **Echelon / bind cap**; early = extension on your turn (Persistent 2); later = independent figure (Persistent 4+); Greater Summon for Rank 4–5. Stamina tables still backlog in Veil §C3 — Foundry should still spawn the Rank matching current bind cap and refresh on re-summon / echelon change.
- **Street Priest:** Ability-shaped (e.g. Sentinel Spirit short ward; Invoke the Pact). Three spirit archetypes + Light/Dark tint — scale via ability rank / pact features, not a 12-SKU band pack unless RAW gains one.

**Follow-on (B53 or backlog):** shared summon-scaling doctrine note + Foundry refresh hooks for spirits/elementals so all three pet classes feel consistent at the table. Park only — do not implement in B52.

## Out of scope
- B51 payload Run abilities (design only on main)
- B50 Changer form art (spike exists; later)
- Soft chrome SKUs, portrait compression

## Success / Michael checklist
1. Resonance Strike chat card: middle/high show damage buttons that apply; low does not deal damage.
2. Spot-check 2–3 other Techno attacks for the same.
3. Compile Sprite → pick Attack-sprite → token appears beside caster; Actor linked; counts toward cap.
4. Dismiss/recall removes the sprite.
5. Cap blocks an extra compile.
6. Module 0.1.71; nothing committed.

---

## AS-BUILT (0.1.71 — 2026-09-17, not committed)

### A — Ability card pass

Converted from prose-only `other` tiers to real `type: "damage"` power-roll effects (`damage` at sort 0 +
the existing `other` at sort 100 for the rider text, the pattern already used by Street-Priest/Wrench cards):

| Ability | tier1 (low ≤11) | tier2 (middle) | tier3 (high) | new effect `_id` |
|---|---|---|---|---|
| **Resonance Strike** | `0` | `2d10 + @chr` | `2d10 + @chr` + rider | `gwTechResStrDmg0` |
| **Resonance Cascade** (3) | `@chr` | `@chr` | `@chr` | `gwTechResCasDmg0` |
| **Cascade Failure** (7) | `@chr * 2` | `@chr * 2` | `@chr * 2` | `gwTechCascFlDmg0` |
| **Code Strike** — Attack-sprite (minor) | `0` | `2d10 + @chr` | `2d10 + @chr` | `gwSprAtkMinDmg00` |
| **Code Strike** — Attack-sprite (intermediate) | `0` | `2d10 + @chr + 1d6` | same | `gwSprAtkIntDmg00` |
| **Code Strike** — Attack-sprite (advanced) | `0` | `3d10 + @chr` | same | `gwSprAtkAdvDmg00` |

- **Untyped damage on purpose.** RAW names no damage type for Wired/biofeedback damage anywhere in
  `20-technomancer.md` or `21-the-wire.md`, so `types: []` — typing it would invent immunity surface.
- **`0` is load-bearing.** Draw Steel's `DamagePowerRollEffect.toText()` / `toDamageRoll()` both short-circuit on
  `Number(value) === 0`, so a low result prints no damage line and offers no damage button, and the lang
  Tier1 prose ("the strike fails to connect") still shows from the companion `other` effect.
- Existing `_id`s were left alone; the new damage effects sort ahead of them.
- **Resonance-Warrior's 3d10 stays a subclass feature.** Overcharged Strike's own card carries it; baseline
  Resonance Strike item math is 2d10.

**Left prose-only, deliberately:** Resonance Slam, The Weaver's Web, Rewire Reality, Sprite Storm, Swarm the
Signal. RAW gives none of them power-roll tiers (they carry `power.roll.characteristics: []`, the repo's
"no power roll" convention), so their damage stays inline `[[/damage …]]` enrichers — still clickable and
applicable in chat. Resonance Slam's *Slam Group* mode had no enricher at all; it has one now.

**Lang cleanup (`lang/en.json`):**
- Resonance Strike's "Add your Resonance skill" is gone — replaced with the RAW statement that a power roll
  never adds a skill (Resonance grants an edge on Resonance *tests*). `Tier2: "Full damage."` deleted.
- Resonance Cascade had no base effect at all; it has one now.
- Cascade Failure / Resonance Cascade / the three Code Strikes: tier prose no longer repeats the numbers.
- **DC leftovers removed** (Draw Steel tests have no DC): Sprite-Weaver and Wide Compile said "save against
  biofeedback at DC −2" → "roll every biofeedback test with an edge"; Resonance-Warrior and Overcharged Strike
  said "DC +2" → "with a bane". Matches the RAW discipline modifiers.
- No Winded-as-a-condition and no blank Wired-range distances found: every Wired ability uses
  `distance.type: "special"` (renders "Special") with "**Distance:** Wired range" spelled out in the card body,
  which is the repo's existing convention. Spend/enhance costs already matched RAW (Compile Sprite 3,
  Resonance Strike 1+, Resonance Mending 1+).

`src/packs/pregens/sabbat-vane.json` was regenerated (`node tools/pregens-to-actors.mjs`) so the Technomancer
pregen's embedded Resonance Strike carries the same fix. No other pregen changed.

### B — `scripts/sprites.mjs` (registered from `module.mjs`)

Mirrors `machines.mjs` Deploy/Recall. **Entry points chosen: Compile Sprite Item-sheet header controls + hero
sheet row context menu** — i.e. exactly the Wrench Deploy feel.

> *On `abilityUse`:* hooking the chat card was investigated and rejected. Compile Sprite is one ability with two
> jobs — *compile* a sprite (main action) and *command* the congregation (maneuver) — so firing a spawn on every
> use would spawn a sprite every time the Technomancer merely issues orders, and would spawn one on a low result
> that RAW says manifests unstable. The sheet button keeps the roll and the spawn independent.

**Level scaling (the lock).**
- Band by hero level: `spriteBand()` → minor L1–3 / intermediate L4–7 / advanced L8–10. Chosen fresh at every
  compile, so a stale band can't persist.
- Stamina stamped live: `archetype base + (Logic × level)`, Logic = `system.characteristics.reason.value`.
  Bases (Data 8/14/20, Attack 12/18/26, Machine 10/16/22, Ward 10/16/22) are duplicated in the script and were
  verified against all twelve shipped templates — they match exactly.
- Attack/effect bonuses by band come from the template Actors themselves (now with real damage tiers, above).
- `system.monster.level` and `system.characteristics.reason.value` are also stamped from the caster.

**Cap** (`spriteCap()`), RAW "caps never stack — take the single highest":
baseline 2 → 3 at L5 → 4 at L8; Sprite-Weaver 3 (L1, Wide Compile) → 4 (L5) → 5 (L7) → 6 (L8).
Over cap, Compile is blocked with a notification and the sheet button disables.

**Flags, both ways:**
- Sprite Actor: `flags.draw-steel-ghostwire = { kind: "sprite", archetype, hybridTier, compiler: <casterUuid>, dsid, compiledAtLevel }`
- Technomancer: `flags.draw-steel-ghostwire.compiledSprite = { uuids: [...] }` — a roster mirror for macros.
  The **cap is decided by a world scan on `compiler`**, not the mirror, so a hand-deleted sprite can never wedge it.

**Placement:** a ring of 8 squares around the caster's token (drones place at one fixed offset; a congregation
of up to 6 would stack), falling back to the view centre with no token.

**Lifecycle:**
- Compile → archetype dialog (DialogV2) showing band + the Stamina each archetype will get → Actor in the
  "Compiled Sprites" folder, ownership inherited from the caster, linked token on the current Scene.
- Decompile: per-sprite ✕ on the roster, or Decompile All (the free maneuver). Deletes tokens on every Scene, then the Actor.
- 0 Stamina → destroyed → auto-decompiles, announced. Runs on `game.users.activeGM` only, since deleting an
  Actor is a GM right regardless of who applied the damage.
- `deleteCombat` → the whole congregation of every Technomancer decompiles (end of encounter, RAW).
- `deleteActor` by hand → tokens cleaned up and the roster re-synced, so the cap frees.
- **Level-up mid-session** → `updateItem` on the Technomancer class item re-stamps Stamina in place when the band
  is unchanged (keeping damage already taken), or decompiles + re-compiles the same archetype at the old token's
  position when the band moved. A swap is only attempted when it is certain to succeed (Scene in view, create
  permission, congregation within the new cap); otherwise it defers with a notification rather than eating a sprite.

**Module API** (`game.modules.get("draw-steel-ghostwire").api`): `compileSprite`, `decompileSprite`,
`decompileAll`, `refreshSprites`, `compiledSprites`, `spriteCompiler`, `spriteCap`, `spriteBand`,
`spriteStamina`, `compileAbility`.

**Lang:** new `GHOSTWIRE.Summons.Sprites.UI` block (23 keys).

### Not done (by design)
- B53 spirits/elementals: the design note above is unchanged and nothing was implemented.
- B51 payload Run abilities, B50 Changer form art, soft chrome SKUs, portrait compression.
