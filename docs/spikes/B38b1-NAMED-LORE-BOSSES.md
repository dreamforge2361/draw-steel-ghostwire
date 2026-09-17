# Spike B38b.1 — Named lore bosses (Reach level-bosses)

**Repo:** draw-steel-ghostwire  
**Depends on:** B38b Wave 2a on main (`02121c4` / v0.1.52).  
**Do NOT commit or push.** Leave ready for Michael Foundry-verify.  
**Bump** module.json one patch from current (read disk; expect 0.1.52 → 0.1.53).

## Goal
Add **five named lore NPCs** to `src/packs/bestiary/` as Director-facing Solo / social-lean Actors with rich biography and light-but-real combat options. These are campaign fixtures, not disposable street trash.

## Deliverable (exactly these five)

| Working name | Folder | Role | Region | Combat lean |
|---|---|---|---|---|
| Mama Cassavir, "the Switchboard" | reach-streets | Fixer patron / neutral power | Upper Flats | Social Solo first; holdout + bodyguard fiction; rarely fights herself |
| Warden Krael, "the Landlord" | corp-security | Corrupt Grid warden | Grid | Corp badge + sidearm/carbine; Metermen as off-board leverage |
| The Ferryman | reach-streets | Tollkeeper of the descent | Flats/Sinks boundary | Chokepoint boss; shotgun/SMG; grey-transit control |
| The Choirmother | veil-undead or reach-streets | Cult-mother (tragic Light→hollow) | Flats | Conviction / Veil flavor; **Director dial** Early / Mid / Fallen noted in biography (ship **one** default Mid Actor; document dial in bio) |
| Ranger-Captain Cael Marrow, "the Gate" | wilds-jungles or corp-security | Cinderhold protector | Cinderhold / Outer Wall | Greenline deserter ally-or-wall; rifle/carbine; frontier veteran |

Prefer **folder** that matches primary table use; biography must state stratum clearly.

## Lore SoR (do not invent against this)
- Lore MD: Dropbox `ai-brain/projects/draw steel/GHOSTWIRE-Lore-Source-V2-edit.md`
- Master: `docs/masters/GHOSTWIRE_BESTIARY.md` § D Named lore NPCs
- Choirmother: Director-facing truth = daughter of the Light being hollowed by Concord from above; Early/Mid/Fallen clocks — default Mid in the Actor; bio explains the dial.

## Doctrine
1. **Firearms / chrome** — B38c standing rule. Cassavir: holdout / chrome light. Krael: licensed sidearm. Ferryman: street guns. Choirmother: ritual focus / hexed sidearm if she fights (keep `magic` if Veil). Marrow: ranger longarm.
2. Prefer **Adapt** from a close DS Solo/Leader spine (clone stats, rewrite fiction) over greenfield math. Nyx Fixer / Warlord / Corp Enforcer / Rival supports are fair donors.
3. Flags: `flags.draw-steel-ghostwire.bestiary = { decision: "Original", region, loreName, role: "named-boss" }`
4. Lang keys `GHOSTWIRE.Bestiary.Actors.*`; 16-char ids; rebuild `tools/build-packs.mjs`.
5. Biography must include: hook, holds, who they answer to / lean on, table use (patron / obstacle / both).

## Out of scope
Gang color variants; more named corp execs; Pandora wilds; Run Generator (B39); art; full Choirmother three-Actor set (one dial note is enough).

## Docs
Update `GHOSTWIRE_BESTIARY.md` § D Status = shipped Wave 2b / B38b.1. STATUS + FOUNDRY-BUILD-PLAN: B38b.1 pending Foundry-verify.

## Done when
All five Actors in pack; firearms/chrome check; bios have hooks; pack rebuilt; checklist printed; **no commit**.

## Foundry test checklist (print when finished)
1. Compendium shows Mama Cassavir, Warden Krael, The Ferryman, The Choirmother, Cael Marrow.
2. Spot-check Cassavir (social/bio) + Ferryman or Marrow (combat abilities are guns/chrome).
3. Choirmother bio mentions Early/Mid/Fallen dial; default Mid.
4. Drag two to a Scene; sheets open; abilities usable.
5. Master § D marked shipped.