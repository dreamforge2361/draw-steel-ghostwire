# Rigger vertical smoke — 0.3.106 follow-up (Linked + Stations/Hardpoints)

Extends `rigger-vertical-smoke-03106.md` / morning 0.3.106 sheet+Fleet ship.

## Foundry checklist (additions)

1. **Deploy → Linked** — Disconnected Wrench Deploys a machine: token gets **Linked** (`ghostwire-linked`). Does **not** set Jacked In. Meat stays active.
2. **No downgrade** — Pilot already Overlay or Jacked In: Deploy leaves that state alone.
3. **Empty fleet returns to Linked (0.3.111)** — Recall, token delete, or Actor delete of the last fielded machine clears Jump-In and leaves the pilot Linked. It does not drop fleet command to Disconnected, and it does not leave them Jacked In. Overlay stays. See `docs/directors/mod-install-chat-03111.md`.
4. **Stations / Hardpoints** — Machine sheet Build tab shows Stations + Hardpoints. Deploy stamps from Item `flags.draw-steel-ghostwire.vehicle.stations` / `.hardpoints` when present.
5. **RAW** — `docs/rulebook/16-vehicles.md` §6.3 and `docs/raw/16-wrench.md` Crew Stations include Linked-while-driving vs Linked-remote vs Jump-In paragraph.

## Still required (from 0.3.106)

Tabs switch · Save works · Machine sheet default · Fleet refuse at cap · Deploy still works.
