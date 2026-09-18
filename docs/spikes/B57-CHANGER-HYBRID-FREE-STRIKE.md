# B57 — Changer Hybrid melee free-strike +1

**Status:** Built 2026-09-18 (0.1.84). **Awaiting Michael's Foundry verify. Not committed.**
**SoR:** `docs/raw/05-ancestries.md` / `docs/rulebook/09-species.md` — Hybrid (War) Form: edge on Intimidation; **melee free strikes deal +1 damage**.
**Related:** B50 (form art + sheet buttons; parked this as follow-on), B44c (generic free strikes stripped), B49 (weapon use-abilities), cyberlimb arm (same modifier pattern).

## Approach
Ghostwire heroes have no generic Melee Free Strike. Melee attacks are B49 weapon use-abilities (`category: "freeStrike"`, keywords melee + strike + weapon). DS 1.1.2 `abilityModifier` effects only filter by keyword (`filters.keywords.isSubsetOf(ability.keywords)`), so the +1 uses the same shape as `src/packs/chrome/cyberlimb-arm.json`.

**Known over-reach (accepted):** any ability with both Melee and Weapon gets the +1, including class signature/heroic melee weapon abilities, not only free strikes. The system can't filter by category. The effect description says so.

## As-built
| Piece | Change |
|---|---|
| `src/packs/origins/changer/changer-forms-trait.json` | New effect `XplTOEdk4jwjqAOU` "Form: Hybrid (melee damage)": `type: abilityModifier`, `filters.keywords: ["melee","weapon"]`, `damage.bonuses.value` add 1 (initial), `flags.draw-steel-ghostwire.changerForm: "hybrid"`, `disabled: true`, `transfer: true`. The Hybrid base effect (Intimidation edge) is unchanged, and so are Human and Beast. |
| `scripts/module.mjs` — `updateActiveEffect` hook | Enabling any `changerForm` effect calls `setChangerForm(actor.allApplicableEffects(), form, actor)`. Before this, it disabled **every** other form effect, which would have turned off the Hybrid damage effect the moment Hybrid Intimidation turned on. |
| `scripts/module.mjs` — `setChangerForm` (new) | Enables every effect with `changerForm === form` and disables every other `changerForm` effect. It sends one `updateEmbeddedDocuments` per parent with option `ghostwireChangerForm: true` (the hook skips those, so there's no recursion), then runs `syncChangerFormArt` once. Enabling either Hybrid effect from the Effects tab brings the whole form along. |
| `scripts/module.mjs` — sheet buttons | Form effects are grouped by form (`Object.groupBy`). A form is active if any of its effects is enabled. Clicking calls `setChangerForm` (it used to update only the first effect found per form). |
| `lang/en.json` | `Forms.Hybrid.DamageBonus.{Name,Description}`; Hybrid description now says the +1 is automated. |
| `module.json` | 0.1.83 → 0.1.84 |
| Packs | `node tools/build-packs.mjs` run (all packs, Foundry closed); origins + pregens carry the new effect. |

**Existing actors:** heroes that already have the Changer Forms trait keep the old embedded copy, which has no damage effect. Re-drop the trait from the compendium, or copy the new effect onto the actor's trait. Pregen **source** (`src/packs/pregens/wren-sable-corvin.json`, `vira-kellis-nade.json`) now has the effect, inserted by script on the embedded Forms trait with its `disabled` state matching the Hybrid base effect. I did **not** rerun `tools/pregens-to-actors.mjs`, because it drops the hand-set `flags.changer.*Art` and form portraits (B50). Pregen actors already imported into a world need a re-import.

## Foundry checklist
1. Refresh the Changer Forms trait on a Changer (Wren/Vira or a fresh one): the trait's Effects list shows 4 effects (Human, Hybrid, Hybrid (melee damage), Beast).
2. Stats tab → click **Hybrid**: both Hybrid effects are enabled, Human and Beast are disabled, and the Hybrid button is highlighted.
3. Intimidation test rolls with an edge.
4. Roll a melee weapon Strike (B49 weapon use-ability): the damage shows +1 on the roll card.
5. Roll a ranged weapon Strike: no +1.
6. Click **Human**, then **Beast**: both Hybrid effects turn off, and only that form's effect is on. A melee Strike loses the +1. Art swap still works.
7. Effects tab: enable only the "Hybrid (melee damage)" effect → Hybrid Intimidation also turns on, and Human/Beast turn off. Enable Human → both Hybrid effects turn off.
8. You can't get Human + Hybrid both on through either path.
