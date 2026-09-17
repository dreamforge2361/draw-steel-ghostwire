# Spike B42d — RAW Pass B (license + language scrub)

**Repo:** draw-steel-ghostwire  
**Depends on:** Pass A on main (`b629ab2`); Pass B locked in `docs/spikes/B42-RAW-REVIEW-FLAGS.md`.  
**Do NOT commit or push** until Michael reviews.  
Regenerate Journals via `tools/raw-to-journals.mjs` + `tools/build-packs.mjs` if packs change; bump module one patch only then.

## Goal
1. Insert **Creator License attribution** into front matter (exact string in Pass B table).  
2. Book-wide **tier / inverted-order / DC / to-hit** language scrub per A12–A14.  
3. **Do not** rewrite all ancestry trait prose (A1 deferred). **Do not** invent missing damage numbers (Pass C).

## Attribution (exact)
In `docs/raw/00-front-matter.md` replace the placeholder with:

> Draw Steel - Ghostwire Build is an independent product published under the DRAW STEEL Creator License and is not affiliated with MCDM Productions, LLC. DRAW STEEL © 2024 MCDM Productions, LLC.

Also note compatibility logo is allowed/encouraged but not required (no logo asset work this pass). Sync a one-line pointer in `docs/rulebook` STATUS or README if present.

## Language scrub rules
| Bad | Good |
|---|---|
| tier (ambiguous) | echelon / cost band / Power Roll result / Node Rating |
| Hybrid Tier / Cost Tiers | hybrid band / cost bands |
| high→low result tables | low / middle / high |
| DC 12–20 saves | potency / characteristic save (DS pattern) |
| +1 to hit / flat defense | edge / bane / DS defense language |
| 5-focus / Focus costs (Commander) | Influence cost bands (if any remain after Pass A) |

Priority files by hit density: `20-technomancer`, `18-street-priest`, `17-elementalist`, `16-wrench`, `14-commander`, `15-medic`, then lighter files.

## Out of scope
Pass C class number holes; full Veil chapter; A1 ancestry voice rewrite; PDF; B40/B41.

## Done when
- Front matter has exact attribution.  
- Grep for bare `\btier\b`, `DC \d+`, `+1 to hit` in `docs/raw/` is clean or only in allowed glossary “was called tier” notes.  
- Flags: Pass B marked done; A1 still deferred.  
- Journals regenerated if pack touched.  
- Checklist printed; **no commit**.

## Michael checklist
1. Front matter shows Creator License blurb exactly.  
2. Spot-check Technomancer + Commander — no DC / Focus / inverted tables.  
3. Spot-check Medic/Priest — “tier” → echelon/cost/result.  
4. Ancestries not wholesale rewritten.  
5. Flags updated.