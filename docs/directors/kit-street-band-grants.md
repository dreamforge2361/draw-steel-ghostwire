# Kit → street-band grants (G1, 0.3.99)

**Module:** 0.3.99 · **Code:** `scripts/kit-grants.mjs` · **Smoke:** `node tools/kit-grants-smoke.mjs` · **Foundry checklist:** `docs/directors/kit-grants-smoke-0399.md`
**Pairs with:** RAW `08-kits-gear-wealth.md` (Kit doctrine + ownership rule), `docs/masters/GHOSTWIRE_KITS_MASTER.md`, Gear master **Cat 2 / Cat 3**

A Kit names a **category**, not an item, and the hero must **own** something in that category or the Kit's bonuses are inert. So the free starting Kit arrives with the **street-band object that makes it live on day one** — the Economy side of the doctrine. Nobody pays for it. Kit doctrine never costs ¥, and neither does this grant.

---

## Locks

- Street-band qualifying gear auto-grants **at chargen only**, with the free starting Kit.
- **Merc** (the Operator dual-Kit Origin) gets a package for **both** Kits. No special case in code — the Origin's Kits advancement is `chooseN: 2`, so two kit Items land and the hook fires twice.
- A Kit taken **later** (respite swap, learned later) grants nothing. The hero owns what they own and buys the new category through **¥ + Availability** like everything else.
- **Mods** and **chrome** never auto-grant. Neither does anything above **Street**.
- The ownership rule survives the grant: **sell, drop, or lose the object and the Kit goes inert** until a qualifying item is owned again. Better Availability gear upgrades the *object*; the Kit's bonus lines never change.

## The gate

A package is handed over only when **all** of these hold:

1. The Item is a `kit` landing on an Actor of type `hero`, created by this client.
2. The Kit's `_dsid` is in the table below. An unmapped Kit is left alone — a wrong object is worse than none.
3. `actor.system.level <= 1`. (A brand-new hero sits at level 0 until a class lands, so the gate reads "not past 1st".)
4. This Kit `_dsid` has **never** been street-granted on this actor — checked against the ledger flag *and* against stamped Items.

Granted Items carry `flags.draw-steel-ghostwire.kitStreetGrant = { kitDsid, grantedAt }`. The actor carries the ledger at `flags.draw-steel-ghostwire.kitStreetGrants = { [kitDsid]: grantedAt }`.

A SKU the hero **already owns** is skipped rather than duplicated — so a pregen who ships with their gear gets no second copy, and two Kits that want the same object (Juggernaut + Bulldozer both want the Slab-Hammer) get one.

There is deliberately **no ready-hook sweep**. Granting is one-way Item creation; back-filling every existing hero in a live world would dump gear onto sheets nobody asked about. Street Eye can sweep because Street Eye is revocable — this is not.

---

## The table

One armor SKU when the Kit wants armor, **Riot Shield** when it wants a shield, and one weapon SKU per entry in the Kit's `system.equipment.weapon`. The ¥ column is what the package would have cost at a vendor — **the hero pays none of it**; it is there so a Director can see the doctrine is priced like a starting kit, not a windfall.

### Finesse

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **Gunslinger** | `gunslinger` | light armor + medium | **Secure Threads** (¥250) · **Seal Warden Gavel** (¥300) | ¥550 | |
| **Raider** | `raider` | light armor + shield + light | **Secure Threads** (¥250) · **Riot Shield** (¥200) · **Street-Blade** (¥120) | ¥570 | |
| **Streetsweeper** | `streetsweeper` | medium armor + medium | **Armor Vest** (¥300) · **Nyx Doorknocker** (¥300) | ¥600 | |

### Heavy

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **Breacher** | `breacher` | medium armor + shield + medium | **Armor Vest** (¥300) · **Riot Shield** (¥200) · **Scrap Cleaver** (¥280) | ¥780 | One-handed medium melee, because a Two-handed piece banes shield use. |
| **Bulldozer** | `bulldozer` | no armor + heavy | **Slab-Hammer** (¥300) | ¥300 | |
| **Juggernaut** | `juggernaut` | heavy armor + heavy | **Hardshell** (¥300) · **Slab-Hammer** (¥300) | ¥600 | |
| **Warframe** | `warframe` | heavy armor + shield + medium | **Hardshell** (¥300) · **Riot Shield** (¥200) · **Scrap Cleaver** (¥280) | ¥780 | As Breacher — shield wants a one-handed medium. |

### Magic / tech

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **No Kit (Pure Caster)** | `no-kit` | no armor | — | — | The caster no-Kit placeholder. Nothing to make live. |
| **Sanctified** | `sanctified` | heavy armor + light | **Hardshell** (¥300) · **Ferrum Rivet** (¥250) | ¥550 | |
| **Spellblade** | `spellblade` | light armor + shield + medium | **Secure Threads** (¥250) · **Riot Shield** (¥200) · **Scrap Cleaver** (¥280) | ¥730 | |

### Melee

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **Brawler** | `brawler` | no armor + unarmed | — | — | Unarmed Kit — fists are the qualifying weapon and are always owned (RAW improvised-weapon rule). No object to hand over. |
| **Chromeblade** | `chromeblade` | medium armor + light + medium | **Armor Vest** (¥300) · **Street-Blade** (¥120) · **Scrap Cleaver** (¥280) | ¥700 | The twin-blade doctrine, both blades street-grade. |
| **Duelist** | `duelist` | light armor + medium | **Secure Threads** (¥250) · **Scrap Cleaver** (¥280) | ¥530 | |
| **Mantis** | `mantis` | no armor + unarmed | — | — | Unarmed Kit — as Brawler. |
| **Monowhip** | `monowhip` | no armor + whip | **Chain Lash** (¥200) | ¥200 | The street entry to the monofilament lane; the ¥20,000 Monowhip is the top of it. |
| **Reach** | `reach` | medium armor + polearm | **Armor Vest** (¥300) · **Scaffold Pike** (¥250) | ¥550 | |
| **Snarehunter** | `snarehunter` | light armor + ensnaring + polearm | **Secure Threads** (¥250) · **Weighted Net** (¥120) · **Scaffold Pike** (¥250) | ¥620 | Net + pike, both slots filled. |
| **Staff Adept** | `staff-adept` | light armor + polearm | **Secure Threads** (¥250) · **Scaffold Pike** (¥250) | ¥500 | The Pike's tri-register is *rebar pike-staff* — it reads as a staff for this Kit. |

### Ranged

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **Ghost** | `ghost` | light armor + light | **Secure Threads** (¥250) · **Velvet Cufflink** (¥150) | ¥400 | The holdout is the quiet one — Ghost is an infiltration doctrine. |
| **Hexshot** | `hexshot` | no armor + light + medium | **Street-Bow** (¥200) · **Scrap-Bow** (¥300) | ¥500 | Both slots live since **G2 / 0.3.100** — the Scrap-Bow is the Street-band medium bow the catalog was missing. |
| **Longshot** | `longshot` | no armor + medium | **Nyx Gutterline** (¥300) | ¥300 | A precision rifle, not the Nyx Doorknocker — Longshot's whole doctrine is holding still at range. |
| **Saturation** | `saturation` | light armor + light + medium | **Secure Threads** (¥250) · **Ferrum Rivet** (¥250) · **Nyx Doorknocker** (¥300) | ¥800 | |

### Tech

| Kit | `_dsid` | Category asked | Street package | List ¥ | Note |
|---|---|---|---|---|---|
| **Fabricator's Bench** | `fabricators-bench` | light armor + light | **Secure Threads** (¥250) · **Ferrum Rivet** (¥250) | ¥500 | |
| **Ferrum "Padlock-6"** | `ferrum-padlock-6` | no armor | — | — | The Kit **is** the cyberdeck (`19-hacker.md`). No separate host, and never chrome. |
| **Field Chassis** | `field-chassis` | light armor + light | **Secure Threads** (¥250) · **Ferrum Rivet** (¥250) | ¥500 | |
| **Meridian "Lookout"** | `meridian-lookout` | no armor | — | — | Deck-Kit, as Padlock-6. |
| **Nyx Cartel "Switchblade"** | `nyx-switchblade` | no armor | — | — | Deck-Kit, as Padlock-6. |
| **Rigger's Harness** | `riggers-harness` | light armor + light | **Secure Threads** (¥250) · **Ferrum Rivet** (¥250) | ¥500 | The Harness **is** the Wire interface (≡ deck, `21-the-wire.md`) — no RCC is granted on top of it. |

**No tech Kit is handed a host.** That was the open question going in; reading `19-hacker.md` and `21-the-wire.md` settles it — the three Hacker deck-Kits *are* cyberdecks, and the Rigger's Harness *is* a control interface. Granting a Scrapdeck or Remote Box beside them would be a second host the Kit never asked for.

---

## The Street floor this pass had to pour

The grant needs a **street-band object per category**, and the published Street column did not have one for six of them. Six Kits (Bulldozer, Juggernaut, Reach, Staff Adept, Snarehunter, Monowhip) had **no purchasable object at any Availability** — `polearm` did not exist in the whole catalog, and `whip` existed only as the ¥20,000 prototype Monowhip.

So 0.3.99 adds seven **Echelon 1 / Street / 1 mod slot** weapons to Gear master §3A / §3B / §3D / §3F. Damage sits at the band floor per the Damage-Bridge, and the firewall holds — a T5 street piece can share a band with a pricier item, because what ¥ buys is mod slots, quiet, and not being **Loud**. (Nyx Doorknocker already worked exactly this way: T5 ¥300 at the Medium band, ahead of the T4 ¥900 Argent Sovereign .50.)

| New SKU | `_dsid` | Fills | Band / damage | ¥ | Serves |
|---|---|---|---|---|---|
| **Seal Warden Gavel** *(Seal Warden Armory / heavy revolver)* | `slugger` | medium **sidearm** | Medium · 6 kinetic · Short | 300 | Gunslinger |
| **Nyx Gutterline** *(Nyx Undermarket / single-shot marksman rifle)* | `pipe-rifle` | medium **precision rifle** | Medium · 6 kinetic · Long | 300 | Longshot |
| **Scrap Cleaver** *(Nyx Warblade / forged broad blade)* | `scrap-cleaver` | medium **melee** | Medium · 5 kinetic · Adjacent | 280 | Duelist, Chromeblade, Spellblade, Breacher, Warframe |
| **Slab-Hammer** *(Deepworks Roughneck / demolition maul)* | `slab-hammer` | **heavy** | Heavy · 8 kinetic · Adjacent | 300 | Juggernaut, Bulldozer |
| **Scaffold Pike** *(Nyx Longstaff / rebar pike-staff)* | `scaffold-pike` | **polearm** | Medium · 6 kinetic · Adjacent | 250 | Reach, Staff Adept, Snarehunter |
| **Chain Lash** *(Nyx Coilwork / weighted chain whip)* | `chain-lash` | **whip** | Medium · 5 kinetic · Adjacent | 200 | Monowhip |
| **Weighted Net** *(Grey Ledger Snarecast / hand-thrown capture net)* | `weighted-net` | **ensnaring** | Light · no damage · Short | 120 | Snarehunter |

**Art gap (open).** All seven ship with core Foundry icons. Drop `‹dsid›.webp` plates into `_incoming-art/` and run `node tools/apply-gear-token-art.mjs --from _incoming-art` to swap them in.

**Closed by G2 / 0.3.100:** the Street band gained the **Scrap-Bow** (¥300, medium band, 1 slot), so Hexshot's second weapon slot is filled and the grant table has **no documented gaps left**.

---

## Edge cases a Director will hit

- **A level-1 hero who swaps Kits before play.** The ledger is keyed per Kit `_dsid`, so swapping A → B at level 1 grants B's package too. That is the stated chargen rule (and Merc depends on it), but a Director who wants it tighter can clear `flags.draw-steel-ghostwire.kitStreetGrants` or simply delete the extra Items.
- **A hero who sells the package.** Intended. The Kit goes inert per the ownership rule until they own a qualifying item again. No re-grant fires.
- **An unmapped Kit** (homebrew, or a Kit added after this table). Nothing is granted and a console line says so. Add the `_dsid` to `KIT_STREET_GRANTS` in `scripts/kit-grants.mjs`; `tools/kit-grants-smoke.mjs` fails loudly until every packed Kit is mapped.
- **The API.** `game.modules.get("draw-steel-ghostwire").api` exposes `KIT_STREET_GRANTS`, `packageDsids`, `grantKitStreetPackage`, `hasStreetGrant`.
