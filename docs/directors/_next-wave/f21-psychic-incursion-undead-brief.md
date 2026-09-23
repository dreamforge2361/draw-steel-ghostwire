# F21 — Psychic attacks on Incursion / undead (LOCKED)

**Michael 2026-09-22 (with F19 park) + queue 2026-09-23:** Cyborg **Cortical Firewall** (psychic immunity = level) stays. Make it matter at the table.

## Goal
Audit and add **`psychic` keyword** (and psychic damage where appropriate) on attacks used by **Veil undead** and **Incursion / spirit** opposition so a Cyborg’s psychic immunity actually absorbs something.

## Scope packs
- `src/packs/bestiary/veil-undead/` — ghost, ghoul, skeleton, zombie, veil-cultist
- `src/packs/summons/spirits/` — spirit summons / Incursion-adjacent
- Any bestiary row clearly tagged Incursion / spirit / undead that currently deals magic/psychic flavor **without** the `psychic` keyword

## Rules
1. Prefer adding the **`psychic` keyword** to existing signature / strike abilities that are already magical mind/soul attacks (e.g. ghost ranged magic strike). Do not strip `magic` if both apply — follow Draw Steel keyword norms in-repo.
2. Where damage type is already psychic in text, ensure the roll uses psychic damage type so immunity applies.
3. Brute physical undead (zombie Clobber, skeleton sword) stay **weapon/melee** — do **not** make every undead attack psychic.
4. At least **one psychic-tagged attack per** ghost / ghoul / veil-cultist / relevant spirit; skeletons/zombies get a psychic option only if fiction supports (fear/dust/wail) — otherwise leave physical and document.
5. Smoke asserts keyword presence on the chosen abilities; director note `docs/directors/f21-psychic-incursion-undead.md`.
6. Rebuild bestiary (+ summons if spirits change). Foundry closed.

## Out of scope
New monster families. Cyborg People rewrite. F20.
