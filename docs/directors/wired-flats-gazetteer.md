# B46 — The Wired — The Flats Matrix Gazetteer Journals (backlog)

**Status:** **Built 2026-09-17 (B46), pending Michael Foundry-verify** — compendium **Ghostwire — The Wired: Flats** (`wired-flats`, JournalEntry; players Observer): one journal, 15 pages (How to Read · Grid & Barrier · District Master Nodes · Corporate Fortress-Nodes · POI Swarm intro + 9 category tables · Director notes), generated from `docs/setting/wired-flats-gazetteer.md` by `tools/wired-flats-to-journals.mjs`. Lore kept; light rules scrub only. Module 0.1.61. Spike: `docs/spikes/B46-WIRED-FLATS-JOURNALS.md`. SoR md: `docs/setting/wired-flats-gazetteer.md` — re-run the generator and `tools/build-packs.mjs` (Foundry closed) after any edit to it.  
**Source (local SoR — no re-upload):**  
`C:\Users\mfran\Dropbox\ai-brain\projects\draw steel\GHOSTWIRE - The Wired  The Flats (Matrix Gazetteer).docx`  
(Also attached in chat as Word; ~19k chars extracted text.)  
**Companion:** Canon map "The Wired — The Flats."  
**Depends on:** Wire chapter / Wired Console / B45 Handbook district roster (cross-link); current Echelon / Node Rating doctrine (not old "tier").

## Goal
Preserve this **hacker's field guide** as Foundry **Journal** content (and optionally a Director reference pack):
1. Keep the gazetteer structure: Grid & Barrier → District Master Nodes → Corporate Fortress-Nodes → POI Swarm → GM running notes.
2. Light scrub only: strip leftover **old rules** numbers if any; keep fiction, node names, owners, vibes, plot hooks, and E1–E4 security posture as **Node Rating / Echelon of ICE** (already mostly aligned).
3. Cross-link existing bestiary / named bosses (Cassavir, Krael, Ferryman, …), Run Generator strata, and Wired Console node templates where names match.
4. Do **not** dump this into `docs/raw/` — RAW stays rules-only; this is **Book One / Matrix setting**.

## Suggested Journal structure
- How to read (E1–E4 table + vertical rule)
- I. The Grid & the Barrier (Grid, Black ICE Barrier / uplink)
- II. District Master Nodes (Switchboard, Stacks, Neon Shambles, Glasshook, Slackwater, Interchange, Wireside, Cinder Market, … + Cinderhold / Undernet extensions)
- III. Corporate Fortress-Nodes
- IV. POI Swarm — street-level nodes
- V. Running the matrix-scape (GM notes)

## Notes
- Ten canon districts from the Ossian Reach Handbook; map adds Cinderhold + The Undernet as Flats-facing / matrix-only extensions.
- Echelon here = intrusion grade of the node's ICE, not hero progression — keep that distinction in Journal prose.
- When implementing, prefer one Journal with folders/pages per section (same pattern as B42b rulebook journals) or a dedicated `wired-flats` Journal pack.

## Out of scope until spike
Implementing node Actors from every POI; replacing B41 minimap; full map Scene import; rewriting Wire RAW chapter from this gazetteer alone.