# Ritual Working applet — Foundry smoke checklist (0.3.91)

**Ship:** the five stages of a Ritual Working (Study → Components → Sanctum → Seal → Payoff) in one panel, openable by every player.
**Automated:** `node tools/ritual-working-smoke.mjs` (goals, components ladders, tradition mapping, stage gates, resource firewall, lang, template render) — passes before commit.
**This list:** the in-Foundry pass. Reload the world after updating to 0.3.91. **No pack rebuild** — scripts, template and styles only.

Bring a hero who carries a Formula. The pregens work: **Vessa Corran-Dov** (Street Priest, *Ward the Room* learned), **Kaïs Vahn-Estal** (Elementalist), **Sabbat Vane** (Technomancer). For the full Project chain, drop **Formula: Seal the Flat** (Ghostwire Gear → General & Lifestyle → Ritual Formulas) onto Vessa.

## 1. Opening it — every player, three ways

- [ ] Token scene controls carry a **Ritual Working** button (hexagon-nodes icon). It is there **for a player**, not just the Director.
- [ ] The keybinding **Open the Ritual Working panel** appears in Configure Controls under Ghostwire and can be bound by a player.
- [ ] Console: `game.ghostwire.openRitualWorking()` opens it.
- [ ] With no Formula on any hero you own, the panel says *No hero you own carries a Ritual Formula.*
- [ ] Right-click a Formula row in a hero's inventory → **Start Ritual Working** opens the panel with that Formula picked.
- [ ] Opening it twice does not stack windows — the second open brings the first to front.

## 2. The Ritual Leader is whoever owns the Formula

- [ ] The picker lists `<hero> — <Formula>` for every Formula on a hero you own. **Players see only their own; the Director sees all heroes.**
- [ ] Picking a Formula sets the **Ritual Leader** chip to that Formula's owner and shows that hero's **¥** next to it.
- [ ] A Formula that is not learned shows *(Not learned)* in the picker and a **Not learned** chip in the header.
- [ ] Put a **Street Priest only** card (e.g. *Confession Ward*) on Kaïs (Elementalist): the header warns *…is not of that tradition.* It is a warning — the panel still works.
- [ ] Log in as a second player who does **not** own that hero and open the panel: they do not see that hero's Formulas at all.

## 3. Study — a stock Draw Steel Project

Use **Seal the Flat** on Vessa (Magnitude 2 → study goal 4).

- [ ] Press **Start Working**. Chat card: *Vessa Corran-Dov begins a Ritual Working: Seal the Flat at Magnitude 2*, with the district-leak line under it.
- [ ] Stage 1 reads **Progress 0 / 4**. Press **Create Study Project**.
- [ ] Vessa's sheet → **Projects** now holds **Study: Seal the Flat**, type **Research**, **Goal 4**, roll characteristics **Logic or Instinct**. It is a normal Project — it takes a Lifestyle project slot like any other.
- [ ] Press **Roll Project**: the system's own Project roll dialog opens (skill picker, edges/banes). Roll it. Points go up by the tier (low 1 / middle 2 / high 3) and the panel's progress follows.
- [ ] Roll until points ≥ 4. A dialog offers **Study complete — mark it learned?**. Say yes: the 0.3.89 chat card fires (*Vessa Corran-Dov has learned Seal the Flat*) and stage 1 goes green.
- [ ] Say **no** to that dialog once first: nothing is stamped, and the panel's **Mark learned** button still works.
- [ ] Editing the Project's points by hand on the sheet moves the panel too — the panel reads the document, it does not keep its own count.
- [ ] **Open Project** opens the Project item sheet.

## 4. Components — the ¥ hit

- [ ] Seal the Flat offers two paths: **Path 1 — ¥180** (Veil) and **Path 2 — ¥150** (Wire-chalk skin). Pick ¥150.
- [ ] The stage reads *Components total ¥150 — comes off the Ritual Leader's ¥ in one hit* and the button says **Pay ¥150**.
- [ ] Note Vessa's Nuyen on her Biography tab. Press **Pay ¥150**: Nuyen drops by exactly 150, the stage goes green reading *Components bought — ¥150 paid*, and a chat card names the spend.
- [ ] Vessa's **Essence / Conviction / Resonance / Victories / Hero Tokens / Recoveries are all untouched.** The panel's footer states the firewall.
- [ ] Set Vessa's Nuyen below the total and reopen: the button is still there but a warning reads *Not enough ¥*, and pressing it warns *…cannot cover ¥150 — only ¥X on hand* and moves nothing.
- [ ] Once paid, the path dropdown locks. As Director, **Reset (Director)** on that stage clears the stamp (it does **not** refund — hand the ¥ back yourself if that was the intent).
- [ ] Open a Magnitude-range card instead (**Scrub the Stain**, ¥100 / ¥300 / ¥1,000 / ¥4,000 / ¥12,000): there is no path dropdown; changing the header **Magnitude** dial changes the total (Magnitude 3 → ¥1,000).

## 5. Sanctum

- [ ] Seal the Flat defaults to **Temporary — claim the space (rating 3 max)**. Press **Claim the space**: the stage goes green and a chat card names the rating.
- [ ] Switch the dropdown to **Built — a Project, goal Magnitude × 3**: the stage reopens at **Progress 0 / 6**. **Create Sanctum Project** puts **Sanctum: Seal the Flat** on Vessa (type **Crafting**, goal **6**, Logic / Instinct / Persona). Roll it to 6 and the stage closes.
- [ ] Start a Magnitude 4 Working (e.g. **Site-Bind**, or push a range card's Magnitude dial to 4): the sanctum stage opens on **Built**, **Temporary is greyed out**, and a warning reads *Magnitude 4 is past the temporary cap of 3*.

## 6. Sealing — one Power Roll on the leader

- [ ] With Study **not** done, **Seal Ritual** is disabled and the stage says sealing waits on learned + components + sanctum. Same with components unpaid, and with no sanctum.
- [ ] With all three green, **Seal Ritual** enables. The **Sealing characteristic** dropdown defaults to **Persona** for Vessa (Street Priest). Kaïs and Sabbat default to **Logic**. A card that is *Street Priest only* forces Persona regardless of who holds it.
- [ ] Press **Seal Ritual**: the system's Power Roll dialog opens, titled *Seal Seal the Flat*, with the skill picker live (pick **Religion**; a Technomancer picks **Matrix Theory**). Add an edge for an assistant.
- [ ] Cancel the dialog: nothing is stamped, the stage stays open.
- [ ] Roll it. The standard Draw Steel test card posts, then a Ghostwire card: *Vessa Corran-Dov seals Seal the Flat (Magnitude 2, Persona)* with **low / middle / high**, the spirit-attention tick (*about 2, fed to the Director as Malice*), and the leak line.
- [ ] A **low** (tier 1) result adds the hung-ritual warning to the stage.
- [ ] **No heroic resource was spent** by any of this — check Vessa's Conviction before and after.
- [ ] Director **Reset (Director)** on the seal stage clears the tier so it can be re-rolled.

## 7. Payoff

- [ ] Stage 5 shows the outcome line for the tier rolled and the upkeep reminder.
- [ ] **Payoff lands** posts the closing card and marks the Working complete. The panel then shows the completed Working; starting a new one on the same Formula is possible again (right-click → Start Ritual Working).
- [ ] **Open Formula** opens the Formula Item sheet with the full card text (duration, Price, Counter) — v1 does not automate the ward Active Effect; read the card.
- [ ] **Abandon Working** asks first, then drops the record. The Study / Sanctum Project Items stay on the sheet — delete them by hand if you want them gone.

## 8. Multi-user

- [ ] Two players open the panel at once, each on their own hero's Formula. Neither sees the other's Formulas; each pays from their own ¥.
- [ ] The Director opens the panel and can pick either hero's Formula and act as that leader.
- [ ] A player who owns the leader sees live updates when the Director rolls that hero's Project (and vice versa) without reopening the panel.

## 9. Known v1 non-goals

- Assistants are edges in the roll dialog, not a multi-user contribution UI.
- No ambient Ward Active Effect is applied on payoff — the chat card and the card's Counter line carry it.
- Hung-ritual clocks are the Director's to hold; nothing is automated.

## Regenerate

```
node tools/ritual-working-smoke.mjs
node tools/ritual-learn-smoke.mjs
node tools/ritual-formulas-smoke.mjs
```

No pack rebuild, no PDF.
