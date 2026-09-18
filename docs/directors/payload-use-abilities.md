# B51 / B51b — Matrix payloads → Craft magazines + "Run" ability

**Status:** **B51 built 0.1.76; B51b (Craft magazines) built 0.1.77, pending Michael Foundry-verify.** Twin of B49 (`equipment-use-abilities.md`).
Code `scripts/payload-use.mjs` (+ `scripts/mods.mjs`) · templates `scripts/data/payload-use-templates.json` · spike `docs/spikes/B51-PROGRAM-PAYLOAD-EXECUTE.md` · rule `docs/raw/21-the-wire.md` (Deck software: suites vs payloads) · doctrine `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md`.

## The rule in one breath
A payload chip (Zap, Crash, Ghostload, Static, Blackout, Wraith) does nothing loose. A downtime **Craft (Hacking)** Project compiles it into **one free deck slot** (shared with suites) as a **magazine**; the power roll sets its fires: **tier 1 → 1, tier 2 → 3, tier 3 → 5**. Each Run spends 1; at 0 the slot frees.

## What a Director sees
- **Loose chip:** no Run ability. Right-click it on the hero sheet → **Load magazine (Craft)…**. Its quantity is the number of chips.
- **Load:** pick a deck with a free slot (skipped if only one fits) → Reason power roll in the system dialog (Hacking skill = 1 edge) → the chip installs on the deck with quantity = fires, and **Run {Payload}** appears (Ranged + Wired, Reason, deck Reach; plays the Wired sound). A stack of chips loads one; the rest stay loose. Cancel the roll and nothing changes.
- **Recompile magazine (Craft)…** on a loaded one: re-roll; the new tier replaces its fires.
- **Run:** spends 1 fire. At 0 the magazine unloads at once (slot frees). The Run stays on the sheet until the next world load, so the chat card still works, but it refuses to fire. The chip sits at 0; delete it.
- **Uninstall mod** on a magazine with fires left asks first: unloading **dumps** the remaining fires (chip goes to 0). Deleting the deck does the same without asking.
- Payloads skip **Install onto…** and **Activate/Deactivate**; the Craft load is the only way in.
- **Suite programs (Reader, Guardian, Sneak, …) and RCC autosofts do not get Run.** They stay Install / Activate / Deactivate and give edges to Matrix Verbs.

## Director overrides
- Gave a hero a loaded magazine for free? Load it, then set its quantity by hand.
- Chip "bought" again after being spent: raise its quantity from 0 and Load.

## Notes for payload authors
A new payload opts in with `type: "treasure"`, `flags.draw-steel-ghostwire.matrix.role: "payload"`, and the deck mod flag
`flags.draw-steel-ghostwire.mod = { slotCost: 1, hosts: ["deck"], host: "deck", craftSkill: ["hacking"], magazine: true }`
(backfilled on Load if missing). Keep it an **offensive / disruptive** one-shot (doctrine). Without a template entry it gets
a no-roll Run whose card shows the payload's description. To give it tiers, add an entry under `payloads` in
`scripts/data/payload-use-templates.json` keyed by the payload's `_dsid`, and its tier text under
`GHOSTWIRE.PayloadUse.Payloads.<Name>` in `lang/en.json`. **Tier 2 must deliver the catalog Effect**; tier 1 partial, tier 3 strong.
