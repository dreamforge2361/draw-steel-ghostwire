# Spike B45 — Ossian Reach Handbook → lore Journals + art

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/reach-handbook-journals.md`; B46 Flats journals (cross-link, don’t duplicate matrix gazetteer); bestiary (threat lore pointers only).  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch; rebuild packs with Foundry closed.

## Goal
Preserve *GHOSTWIRE — The Ossian Reach Handbook* as **Book One / world** material in Foundry: lore, sites, Director frames, **maps/art** — light scrub of old rules only. **Not** RAW. **Not** a second bestiary pass.

## Source (local SoR — do not commit the PDF)
```
C:\Users\mfran\Dropbox\ai-brain\projects\draw steel\GHOSTWIRE - The Ossian Reach Handbook.pdf
```
(~64 MB / ~175 pp). Resolve via `Get-ChildItem … -like '*Ossian*Handbook*'` if the dash character differs.

Gitignore the PDF (same pattern as dossiers). Extract working text + images into the repo:

| Path | Role |
|---|---|
| `docs/setting/reach-handbook/` | Markdown SoR chapters / page extracts |
| `docs/setting/reach-handbook/EXTRACT-NOTES.md` | TOC, page map, scrub log |
| `assets/reach-handbook/` | Maps + key art (webp/png; compress sensibly — don’t dump every page raster at full PDF size) |

Optional: `docs/masters/reach-handbook/` mirror if you prefer masters/ — **prefer `docs/setting/`** to sit beside `wired-flats-gazetteer.md`.

## Pack
- `name`: `reach-handbook`
- `label`: `GHOSTWIRE.COMPENDIUM.reachHandbook` → **Ghostwire — Ossian Reach Handbook**
- `type`: `JournalEntry`
- `path`: `packs/reach-handbook`
- Ownership: `PLAYER: OBSERVER`, `ASSISTANT: OWNER` (like Rulebook / Flats)

Register in `module.json`. Source `src/packs/reach-handbook/`. Generator preferred: `tools/reach-handbook-to-journals.mjs` reading `docs/setting/reach-handbook/**`.

## Journal structure (LOCKED intent — adapt to actual TOC)
Compendium **folders** + journals/pages:

1. **Front** — how to use; canon note; relationship to RAW / B46 Flats / B48 encounters  
2. **The Reach / vertical hive** — strata overview (Halo → Grid → Flats → Warrens → Sinks) as fiction  
3. **The Flats** — districts / Field Gazetteer sites (cross-link B46 for *matrix* nodes; this pack owns **physical** place lore)  
4. **Grid / boundary** — as present in Handbook  
5. **Cinderhold / wastes gate**  
6. **Threats & Critters** — lore only; point at bestiary Actors by name/`@UUID` where they exist; **strip or box old Tier stat blocks**  
7. **Maps** — image pages (or one Maps journal with image pages)

If the Handbook TOC differs, follow **the book’s own chapter order** and record the mapping in EXTRACT-NOTES.md.

## Content rules
1. Keep fiction, geography, factions, Director frames, art/maps.  
2. Light scrub: old **tier** ladders, obsolete chrome grades, pasted combat math → remove or replace with “see Bestiary / RAW”.  
3. Do **not** edit `docs/raw/`.  
4. Do **not** re-stat monsters here.  
5. Cross-link: Cassavir, Krael, Ferryman, Choirmother, Marrow, B48 tables, B46 Flats journal, Run Generator strata — plain text or `@UUID` when easy.  
6. Avoid shipping a second full copy of the Wired Flats *matrix* gazetteer — link B46 instead; Handbook Flats = street/physical.

## Extraction approach (practical)
- Text: `pypdf` / `pymupdf` page-by-page with error tolerance (large PDF; em-dash paths).  
- Images: extract map/art candidates; Michael can trim later. Prefer maps + chapter plates over every comic panel.  
- If full 175 pp in one pass is too heavy, ship **Wave 1**: Front + Flats districts + Cinderhold + Maps index, with Threats stub pointing at bestiary — but **prefer complete handbook** if extraction holds. Document any deferred pages in EXTRACT-NOTES.

## Out of scope
RAW changes; new bestiary Actors; Scene imports as playable maps (image journals enough); B40/B41; committing the 64 MB PDF; auto-spawn.

## Done when
- Compendium visible; folders match structure; lore readable.  
- At least one map image page works.  
- Old rules scrubbed from sampled combat/critter pages.  
- EXTRACT-NOTES + setting md SoR present; generator or documented rebuild path.  
- Module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Compendium **Ghostwire — Ossian Reach Handbook** appears; players Observer.  
2. Front + Flats district lore open cleanly.  
3. Cinderhold (or wastes gate) present.  
4. Threats page is lore + bestiary pointers, not Tier stat blocks.  
5. At least one map image displays.  
6. Cross-link note to B46 Flats matrix journal present.  
7. `docs/raw/` untouched; PDF not in git.