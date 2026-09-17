# Spike B42c — Apply RAW Pass A locks

**Repo:** draw-steel-ghostwire  
**Depends on:** Pass A locked in `docs/spikes/B42-RAW-REVIEW-FLAGS.md` (2026-09-17).  
**Do NOT commit or push.** Leave ready for Michael review.  
**Docs-first:** edit `docs/raw/` and the `docs/rulebook/` / `docs/masters/` sources that feed them. If Journals exist, re-run `tools/raw-to-journals.mjs` + `tools/build-packs.mjs` so the Rulebook pack matches (Foundry closed for build). **Bump** module one patch only if packs change.

## Goal
Apply **Pass A** locks book-wide. No new design — scrub contradictions to match the decision table.

## Locks (copy from flags — do not reinterpret)
1. Body Integrity **20** (non-Cyborg living); scrub `6 + Physique + Echelon`.
2. Chrome grades **Salvage / Standard / Soft** only; Milspec = Availability, not grade.
3. Shared magic erosion (2 / 3 / 1 Integrity per −1 cap by grade); remove separate Technomancer/Priest chrome-erosion models.
4. Wired **avatar** (not persona); characteristic **Persona** unchanged.
5. No BP/SP — reword.
6. Surges = DS by reference; remove inverted/custom surge boxes.
7. Damage map: electrical→lightning, toxin→poison, fire→fire, kinetic/AP→untyped (+ AP note).
8. Weapon results low/middle/high; middle = printed base unless full band given.
9. Armor-as-Stamina E1 default = **Street**.

## Scope
- Grep and fix: `docs/raw/**`, especially `09`, `08`, `12`–`21`, `00-front-matter` glossary.
- Sync sources: `docs/rulebook/12-chrome.md` (already correct — use as SoR), class chapters `01`–`08`/`20`, `15-drones`/`16-vehicles` if needed, Hacker/Technomancer Wire persona wording.
- Update `B42-RAW-REVIEW-FLAGS.md`: mark A3–A11 **done** with file list; leave A1–A2 and chapter B flags.
- STATUS note: Pass A applied pending verify.

## Out of scope
Creator License legal text (A1–A2); full Veil chapter; Wrench number pass; Street Priest missing damage values; Pass B chapter flags.

## Done when
- Grep clean for: `6 + Physique`, `Body Integrity` formulas other than 20, “Milspec” as chrome **grade**, BP/SP as currency, inverted surge boxes, “persona” meaning Wired presence without “avatar”.
- Journals regenerated if pack present.
- Checklist printed; **no commit**.

## Michael checklist (print when finished)
1. Chrome RAW: BI 20, three grades, shared erosion.
2. Wire RAW: “avatar” for jacked presence; Persona = characteristic.
3. Spot-check Scout/Elementalist/Commander — no custom surge conflict.
4. Gear damage tags mapped; E1 armor = Street default.
5. Flags file shows Pass A done.