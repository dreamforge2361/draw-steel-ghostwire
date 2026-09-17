# Spike B38b — Bestiary originals Wave 2 (Handbook)

**Repo:** draw-steel-ghostwire  
**Depends on:** B38 + B38c on main (`08e63bf` / v0.1.51) — Wave 1 pack + firearms pass.  
**Do NOT commit or push.** Leave ready for Michael Foundry-verify.  
**Bump** module.json one patch from current (read disk; expect 0.1.51 → 0.1.52).

## Goal
Add **Ossian Reach Handbook** Threat + Critters (and a thin set of lore level-bosses) into `src/packs/bestiary/` as reviewed Ghostwire Actors. Prefer **Adapt from a close DS spine** (clone stats/abilities, rewrite fiction + firearms) over inventing math. Update `docs/masters/GHOSTWIRE_BESTIARY.md` Originals table with Status as each lands.

## Sources (SoR)
- Master list: `docs/masters/GHOSTWIRE_BESTIARY.md` § Originals / Must-create  
- Handbook extract (threat text): `docs/masters/_lore_extract/Ossian_Reach_threats.txt` (pages 156–175)  
- Full PDF (em-dash filename): `GHOSTWIRE — The Ossian Reach Handbook.pdf` under Dropbox `ai-brain/projects/draw steel`  
- Lore named bosses: `GHOSTWIRE-Lore-Source-V2-edit.md` (same folder)

## Doctrine (LOCKED)
1. **Firearms / chrome** — follow `GHOSTWIRE_BESTIARY.md` § Firearms / chrome ability doctrine (B38c). Humanoids = guns/chrome/decks; melee rare. Beasts/critters/ICE/spirits keep natural or Wire attacks.
2. **Handbook inverted Tier → DS level/echelon** in biography/notes (Tier 5 ≈ low threat / early echelon; tier 2–1 ≈ high). Do **not** print GW “tier” as player progression.
3. Flags: `flags.draw-steel-ghostwire.bestiary = { dsSourceId?, dsSourceName?, decision: "Original"|"Adapt", region, handbookName?, echelon? }`  
4. 16-char alphanumeric `_id`s; rebuild via `tools/build-packs.mjs`.  
5. Lang keys `GHOSTWIRE.Bestiary.Actors.*` + folder labels. Placeholder art OK.  
6. **Wilds:** only Canopy-Stalker + Reach Behemoth — no Pandora ecology inventing.

## Wave 2a deliverable (this spike — ship ~18–28 Actors)

### A. Street / gang / corp (humanoid — firearms)
| Working name | Folder | Notes / DS spine hint |
|---|---|---|
| Colors Boss | reach-streets | Adapt Gang Boss / Human Bandit Chief lean |
| Chrome Bruiser | reach-streets | Cyborg heavy; Adapt Ogre/Brute or Street Brawler+chrome |
| Response Lieutenant | corp-security | Adapt Corp Enforcer lean + drone escalate fiction |
| Corp Netrunner | corp-security or wire-machine | Deck/ICE overwatch; Adapt Rival Hacker lean |
| Street Doc | reach-streets | Support; Adapt human support / Medic fiction |
| Wrench Rigger | reach-streets | Drone handler; Adapt support + machine flags OK |
| The Warlord | reach-streets | Solo district boss; Adapt high-STA leader spine |
| Razorline Prime | reach-streets | Cyborg duelist → **smartgun / monowire**, not blades |
| Corp Enforcer (Handbook mid) | corp-security | If distinct from Wave 1 Corp Enforcer — name **Contract Enforcer** or skip duplicate |
| Ironclad Warden | corp-security | Black-site chief; Adapt Ironclad Ground Commander lean |

Skip or light-touch if already covered by Wave 1 under another name — **do not duplicate** Corp Security Officer / Gang Boss math; only add Handbook roles that add new Director tools.

### B. Critters (natural / Wire OK)
Chrome-Rat, Tunnel-Bat, Scrap-Hound, Sink-Crawler, Gutter-Serpent → `wilds-jungles` or new subfolder `reach-critters` under wilds or reach-streets (pick one folder scheme; document in master).

### C. Wilds seeds only
**Canopy-Stalker**, **Reach Behemoth** → `wilds-jungles`.

### D. Wire (thin)
Watchdog ICE, Scrambler ICE, Black ICE — only if not already represented by Hacker node/ICE Director templates; if Console templates cover Director use, add **bestiary reference Actors** that match fiction OR skip and note “use Wired Console templates” in master. Prefer 1–3 ICE Actors for Scene drag if missing from bestiary.

### E. Named lore bosses (social Solos — light)
Mama Cassavir, Warden Krael, The Ferryman, The Choirmother, Cael Marrow — **biography + light combat or social Solo**; firearms if they fight. Can be fewer abilities. Optional if time: ship A–C first, E as Wave 2a.1.

## Wave 2b (OUT of this spike)
Nyx Fixer full social Solo polish; Null-Prophet / Ripper; Data-Sprite / Wisp / Ghost-in-the-Wire deep Wire ecology; more gang color variants; Pandora wilds; Run Generator (B39); art.

## Done when
- 18+ new bestiary Actors in pack (folders coherent).  
- Humanoids pass firearms check (no Zweihander/Halberd/etc.).  
- Master Originals table Status updated; STATUS / FOUNDRY-BUILD-PLAN note B38b pending verify.  
- Pack rebuilt; checklist printed; **no commit**.

## Foundry test checklist (print when finished)
1. Ghostwire Bestiary shows new Wave 2a Actors (Colors Boss, Chrome Bruiser, Canopy-Stalker, Reach Behemoth, Scrap-Hound at minimum).
2. Spot-check 3 humanoids: gun/chrome ability names; DS rolls work.
3. Spot-check 1 critter + Canopy-Stalker: natural attacks OK.
4. No duplicate confusing names vs Wave 1 without a note in biography.
5. Drag Warlord or Colors Boss + Ironclad Warden to Scene.