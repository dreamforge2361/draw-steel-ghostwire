#!/usr/bin/env node
/**
 * 0.3.134 wave smoke — locks A through K, one section per brief item.
 *
 * The theme of this wave is **text the table could not read and data that was never there**: rituals
 * that printed "Magnitude 2" and never said what that bought, thirty guns wearing somebody else's
 * trademark, a Hurl Element that rendered blue whatever you picked, three elemental ranks with no
 * abilities at all, and two support cards that listed four effects and applied none of them.
 *
 * So, as in 0.3.133, almost every assertion runs the **real exported function** over the **real
 * shipped data** rather than re-typing either: `resolveSfxIn` over the shipped SFX map,
 * `weaponRenameFor` over the shipped rename table, `elementalName` and `elementOfAbility` over the
 * shipped elements table, `worstCondition` and `rallyTempStamina` over the shipped Rally rules, and
 * `retrievalQuery` + `retrieve` over the shipped VOIDMARK index.
 *
 * Run: `node tools/wave-03134-smoke.mjs`
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import { resolveSfxIn } from "../scripts/sfx.mjs";
import {
  BANNED_BRANDS, MAKERS, WEAPON_MAKERS, WEAPON_RENAMES,
  isStockWeaponName, renameInAbilityLabel, weaponRenameFor,
} from "../scripts/weapon-rename.mjs";
import {
  ELEMENTS, ELEMENT_ADJECTIVE, ELEMENT_FX,
  elementAdjective, elementFx, elementOfAbility, elementalName,
} from "../scripts/elements.mjs";
import { hitFxProfile, spellFlavour } from "../scripts/hit-fx.mjs";
import { BOUND_SUMMON_DSIDS, COMPANION_ELEMENTS, SUMMON_ELEMENT_FLAG, summonPicksElement } from "../scripts/elementalist.mjs";
import { typeSummonStrikes } from "../scripts/veil-summons.mjs";
import { ritualPlainText, setRitualPlainText } from "../scripts/ritual-seal.mjs";
import { FIELD_TRIAGE_DSID, isMedic, strayFieldTriage } from "../scripts/field-triage.mjs";
import { RALLY_BURST, RALLY_CONDITIONS, RALLY_TEMP_STAMINA, inRally, rallyTempStamina, worstCondition } from "../scripts/rally.mjs";
import { askWho, recoveryState } from "../scripts/recovery-prompt.mjs";
import { retrievalQuery, retrieve, scoreChunk } from "../scripts/voidmark-rag.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const sfxMap = readJson("scripts/data/sfx-map.json");
const veilRaw = read("docs/raw/22-the-veil.md");

const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};
const langHas = dotted => localize(dotted) !== dotted;

function walkJson(root) {
  const out = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      out.push({ path, doc: readJson(path) });
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

const weaponRows = walkJson("src/packs/gear/weapons");

/* ================================================================ A — ritual plain text */

console.log("\nA) Every ritual says what it does, in words a new player can read");

{
  const table = readJson("tools/data/ritual-plain-text.json").cards;
  const runtime = readJson("scripts/data/ritual-plain-text.json").cards;
  const titles = [...veilRaw.matchAll(/^### (.+)$/gm)]
    .map(m => m[1].replace(/\s*\*\(optional\)\*\s*$/, "").trim())
    .filter(title => table[title]);

  note(titles.length >= 46, `${titles.length} Ritual Working cards carry a plain-language block`);
  note(Object.keys(table).length === Object.keys(runtime).length,
    `the runtime copy has the same ${Object.keys(runtime).length} cards as the source table`);

  let complete = 0;
  const thin = [];
  for (const [title, card] of Object.entries(table)) {
    const ok = ["story", "plain", "magnitude", "scope", "seal", "expires"]
      .every(field => String(card[field] ?? "").trim().length > 20);
    if (ok) complete += 1; else thin.push(title);
  }
  note(!thin.length, `all ${complete} cards have a story, a plain rules line, and Magnitude / Scope / Seal / Expires${thin.length ? ` — thin: ${thin.slice(0, 3)}` : ""}`);

  // The card Michael named as pure jargon.
  const ward = table["Ward the Room"];
  note(/bane/.test(ward.plain) && /penalty die/.test(ward.plain), "Ward the Room explains what a bane actually is");
  note(/one room/i.test(ward.scope), "…and says how big one room is in play");
  note(/dawn/i.test(ward.expires), "…and when it stops working");
  note(/Low:.*Middle:.*High:/s.test(ward.seal), "…and what each seal result means for this card");

  // Every Formula Item description must carry the block, and the raw chapter must be the source.
  const formulas = walkJson("src/packs/gear/general/ritual-formulas");
  note(formulas.length >= 46, `${formulas.length} Formula Items ship`);
  let carried = 0;
  for (const { doc } of formulas) {
    const description = localize(doc.system.description.value);
    if (/The story:/.test(description) && /In plain words:/.test(description)
      && /Magnitude/.test(description) && /Scope/.test(description)
      && /Seal/.test(description) && /Expires/.test(description)) carried += 1;
  }
  note(carried === formulas.length, `every Formula Item description carries the block (${carried}/${formulas.length})`);

  // And a *sealed* working card gets the same six lines, from the same table.
  note(setRitualPlainText(readJson("scripts/data/ritual-plain-text.json")) >= 46, "ritual-seal.mjs can load the runtime table");
  note(!!ritualPlainText("Ward the Room"), "…and finds a Working by its printed title");
  note(!!ritualPlainText("Formula: Ward the Room"), "…and by the Formula Item's name");
  note(ritualPlainText("Not A Working") === null, "…and returns null for something it has never heard of");
  note(/ritualPlainText\(payload\?\.workingName\)/.test(code(read("scripts/ritual-seal.mjs"))),
    "ritualEffectHtml reads the table, so the sealed card prints it too");
  note(langHas("GHOSTWIRE.RitualSeal.Plain.Story") && langHas("GHOSTWIRE.RitualSeal.Plain.Means"),
    "the sealed card's labels are localized");
}

/* ================================================================ B — firearm rename */

console.log("\nB) Firearms wear their maker's name, and nothing wears a real brand");

{
  note(Object.keys(WEAPON_RENAMES).length === 30, `${Object.keys(WEAPON_RENAMES).length} firearms renamed`);
  note(Object.keys(WEAPON_MAKERS).length === weaponRows.length,
    `every one of the ${weaponRows.length} weapon SKUs has a maker (${Object.keys(WEAPON_MAKERS).length} mapped)`);

  // Michael's list, verbatim. If any of these drifts the table is wrong, not the smoke.
  const LOCKED = {
    popper: "Ferrum Rivet", workhorse: "IW Journeyman", "hand-cannon": "Argent Sovereign .50",
    slugger: "Seal Warden Gavel", "sleeve-gun": "Velvet Cufflink", "ghost-pistol": "Velvet Nocturne",
    zapper: "Seraph Mercy", "buzz-gun": "Nyx Wasp-9", chatter: "Velvet Murmur",
    "streetsweeper-smg": "Seraph Halcyon", longshot: "Greenline Longwatch",
    "milspec-battle-rifle": "IW Bastion", chopper: "Nyx Rattletrap",
    "streetline-carbine": "White Door Lifeline", "apex-rifle": "Meridian Vector",
    "whisper-rifle": "Grey Ledger Redaction", "brush-gun": "Greenline Thornback",
    "pipe-rifle": "Nyx Gutterline", autoshotgun: "Seal Warden Verdict", boomstick: "Nyx Doorknocker",
    chatterbox: "IW Barrage-12", "hand-of-god": "IW Absolution", wallbreaker: "Ferrum Mason .60",
    "tank-cracker": "Ferrum Keystone", "siege-missile": "Kestrel Talon", "grease-gun": "Nyx Grinder",
    "dragons-breath": "Lancet Cauterizer", "dart-gun": "Lancet Hushdart",
    "gauss-needler": "Seraph Stilling", "net-gun": "Grey Ledger Lien",
  };
  const wrong = Object.entries(LOCKED).filter(([dsid, name]) => WEAPON_RENAMES[dsid]?.name !== name);
  note(!wrong.length, `all 30 locked renames match${wrong.length ? ` — wrong: ${wrong.slice(0, 3).map(w => w[0])}` : ""}`);

  // The printed name is a lang string; the pack row keeps its key, its _id and its _dsid.
  let printed = 0;
  let street = 0;
  for (const { doc } of weaponRows) {
    const dsid = doc.system._dsid;
    const row = WEAPON_MAKERS[dsid];
    const key = `GHOSTWIRE.Gear.Items.${row.key}`;
    if (doc.name !== `${key}.Name`) continue;
    const name = localize(`${key}.Name`);
    if (name === (row.name ?? name)) printed += 1;
    const description = localize(`${key}.Description`);
    if (row.name && description.includes(`<strong>${row.old}</strong>`)) street += 1;
  }
  note(printed === weaponRows.length, `every SKU prints the name the table says (${printed}/${weaponRows.length})`);
  note(street === 30, `every renamed gun keeps its street name in the description (${street}/30)`);

  // Every description names a Ghostwire house, and the IW rule is spelled out wherever IW appears.
  let housed = 0;
  let iwExplained = 0;
  let iwRows = 0;
  for (const { doc } of weaponRows) {
    const row = WEAPON_MAKERS[doc.system._dsid];
    const maker = MAKERS[row.maker];
    const description = localize(`GHOSTWIRE.Gear.Items.${row.key}.Description`);
    if (description.includes(maker.short) || description.includes(maker.full)) housed += 1;
    if (row.maker === "iw") {
      iwRows += 1;
      if (/IW = Iron Writ Arms, Ironclad Martial/.test(description)) iwExplained += 1;
    }
  }
  note(housed === weaponRows.length, `every weapon card names its house (${housed}/${weaponRows.length})`);
  note(iwExplained === iwRows, `every IW card explains the abbreviation (${iwExplained}/${iwRows})`);

  // No real-world or Shadowrun brand survives anywhere a player reads.
  const brandRe = new RegExp(`\\b(${BANNED_BRANDS.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`);
  const dirty = [];
  const scan = (label, text) => { const m = brandRe.exec(text); if (m) dirty.push(`${label}: ${m[1]}`); };
  for (const { doc } of weaponRows) {
    const row = WEAPON_MAKERS[doc.system._dsid];
    scan(row.key, localize(`GHOSTWIRE.Gear.Items.${row.key}.Description`));
  }
  scan("GEAR MASTER", read("docs/masters/GHOSTWIRE_GEAR_MASTER.md"));
  scan("raw 10-mods", read("docs/raw/10-mods.md"));
  note(!dirty.length, `no borrowed brand survives in weapon text or the gear master${dirty.length ? ` — ${dirty.slice(0, 3)}` : ""}`);

  // The world migration: dsid first, old name second, a Director's own name never.
  note(weaponRenameFor({ name: "Popper", system: { _dsid: "popper" } })?.to === "Ferrum Rivet", "migration renames a stock Popper");
  note(weaponRenameFor({ name: "Ferrum Rivet", system: { _dsid: "popper" } }) === null, "…and leaves an already-renamed one alone");
  note(weaponRenameFor({ name: "Lucky", system: { _dsid: "popper" } }) === null, "…and never clobbers a name the Director chose");
  note(weaponRenameFor({ name: "Popper" })?.to === "Ferrum Rivet", "…and still finds a dsid-less world copy by its old name");
  note(weaponRenameFor({ name: "GHOSTWIRE.Gear.Items.Popper.Name", system: { _dsid: "popper" } })?.to === "Ferrum Rivet",
    "…and a world copy that kept the lang key");
  note(isStockWeaponName("popper", "Popper") && !isStockWeaponName("popper", "Lucky"), "isStockWeaponName is the guard");
  note(renameInAbilityLabel("Fire Popper") === "Fire Ferrum Rivet", "the generated attack is renamed too");
  note(renameInAbilityLabel("Fire Chatterbox") === "Fire IW Barrage-12", "…and Chatterbox is not eaten by Chatter");
  note(renameInAbilityLabel("Fire Lucky") === null, "…and an attack off a custom-named gun is left alone");
  note(/registerWeaponRename\(\)/.test(code(read("scripts/module.mjs"))), "the migration is registered");

  // CRUCIAL: every renamed firearm keeps the sound it had on 0.3.133, because the rules are dsid-keyed.
  const BASELINE = {
    chatterbox: "gun-machinegun.ogg", "streetsweeper-smg": "gun-smg.ogg",
    "apex-rifle": "gun-sniper.ogg", longshot: "gun-sniper.ogg", "milspec-battle-rifle": "gun-sniper.ogg",
    "pipe-rifle": "gun-sniper.ogg", "streetline-carbine": "gun-sniper.ogg", "whisper-rifle": "gun-sniper.ogg",
    zapper: "laser-gun-4.ogg",
    popper: "pistol-single.ogg", workhorse: "pistol-single.ogg", "hand-cannon": "pistol-single.ogg",
    slugger: "pistol-single.ogg", "sleeve-gun": "pistol-single.ogg", "ghost-pistol": "pistol-single.ogg",
    "buzz-gun": "pistol-single.ogg", chatter: "pistol-single.ogg", chopper: "pistol-single.ogg",
    "brush-gun": "pistol-single.ogg", autoshotgun: "pistol-single.ogg", boomstick: "pistol-single.ogg",
    "hand-of-god": "pistol-single.ogg", wallbreaker: "pistol-single.ogg", "tank-cracker": "pistol-single.ogg",
    "siege-missile": "pistol-single.ogg", "grease-gun": "pistol-single.ogg", "dragons-breath": "pistol-single.ogg",
    "dart-gun": "pistol-single.ogg", "gauss-needler": "pistol-single.ogg", "net-gun": "pistol-single.ogg",
  };
  const drifted = [];
  for (const [dsid, expected] of Object.entries(BASELINE)) {
    const row = weaponRows.find(r => r.doc.system._dsid === dsid);
    const gear = row.doc.flags[MODULE_ID]?.gear ?? {};
    const melee = gear.range === "Adjacent";
    const ability = {
      name: `${melee ? "Strike with" : "Fire"} ${localize(row.doc.name)}`,
      system: { _dsid: `gear-use-${dsid}`, keywords: melee ? ["melee", "weapon"] : ["ranged", "weapon"] },
    };
    const { src } = resolveSfxIn(sfxMap, ability, { localize });
    if (!src.endsWith(expected)) drifted.push(`${dsid}: ${src.split("/").pop()} ≠ ${expected}`);
  }
  note(!drifted.length, `all 30 renamed firearms resolve under their NEW name to their 0.3.133 sound${drifted.length ? ` — ${drifted.slice(0, 3)}` : ""}`);
  note(sfxMap.rules.filter(r => String(r.id).startsWith("gear-weapon-")).length === 8, "eight dsid-keyed weapon rules sit at the top of the map");
  note(sfxMap.rules.slice(0, 8).every(r => String(r.id).startsWith("gear-weapon-")), "…and nothing name-based gets a vote before them");
  note(sfxMap.rules.filter(r => String(r.id).startsWith("gear-weapon-")).every(r => /\\bgear use /.test(r.match) && r.match.endsWith("$")),
    "…and every one of them is anchored on the dsid candidate alone");

  // Ammo and weapon skills were already dsid-keyed. Verify rather than assume.
  const ammo = code(read("scripts/ammo.mjs"));
  note(!/name\s*===\s*["'](Popper|Chatterbox|Longshot|Workhorse)/.test(ammo), "scripts/ammo.mjs has no weapon-name lookup");
  note(!/name\s*===\s*["']/.test(code(read("scripts/weapon-skills.mjs"))), "scripts/weapon-skills.mjs has no weapon-name lookup");
  note(/_dsid/.test(code(read("scripts/weapon-skills.mjs"))), "…and keys off _dsid");
}

/* ================================================================ C — arms maker lore */

console.log("\nC) Arms makers of the Reach");

{
  const l9 = read("docs/manuscript/01-lore/L9-arms-makers.md");
  note(/^# Arms Makers of the Reach/m.test(l9), "the L9 lore chapter exists");
  const HOUSES = ["Iron Writ Arms", "Seraph Armaments", "Argent Mint Arms", "Ferrum Forgeworks",
    "Deepworks Excavation", "Meridian Blacklight", "Lancet Biodefense", "Grafthouse",
    "Greenline Outfitters", "Velvet Arms", "Grey Ledger", "Seal Warden Armory",
    "White Door Tactical", "Nyx Undermarket", "Kestrel Aerodyne"];
  const missingHouse = HOUSES.filter(house => !l9.includes(house));
  note(!missingHouse.length, `all ${HOUSES.length} houses are written up${missingHouse.length ? ` — missing ${missingHouse}` : ""}`);
  note(/\| Street name \| On the receipt \|/.test(l9), "…with the old-name / new-name table");
  const streetRows = [...l9.matchAll(/^\| ([^|]+) \| ([^|]+) \|$/gm)]
    .filter(([, old]) => Object.values(WEAPON_RENAMES).some(row => row.old === old.trim()));
  note(streetRows.length === 30, `…and all 30 renames are in it (${streetRows.length})`);

  note(existsSync("src/packs/lore/arms-makers/L9-arms-makers.json"), "the lore pack has the Arms Makers journal");
  const journal = readJson("src/packs/lore/arms-makers/L9-arms-makers.json");
  note(/^[A-Za-z0-9]{16}$/.test(journal._id), `…with its own 16-char id (${journal._id})`);
  note(journal.folder === "gwLorePackArms00", "…in its own folder");

  // Each of the Twelve that builds weapons says so on its ticker card, and points at L9.
  const megacorps = walkJson("src/packs/lore/megacorps");
  const armed = megacorps.filter(({ doc }) => /Arms division:/.test(doc.pages[0].text.markdown));
  note(armed.length === 12, `all twelve megacorp journals carry an arms division (${armed.length})`);
  note(armed.every(({ doc }) => /Arms Makers of the Reach/.test(doc.pages[0].text.markdown)),
    "…and every one links to the Arms Makers journal");
  note(/Iron Writ Arms \(IW\)/.test(readJson("src/packs/lore/megacorps/irn-ironclad-martial.json").pages[0].text.markdown),
    "Ironclad Martial names Iron Writ Arms");
  note(megacorps.length === 12, "…and Kestrel did not get a thirteenth megacorp journal (it is the seatless thirteenth, L1)");

  // The setting primer, in both the source and the built pack.
  const primer = read("docs/manuscript/01-lore/L1-setting-primer.md");
  note(/^## Arms Makers of the Reach/m.test(primer), "the setting primer has an Arms Makers section");
  note(/Kestrel Aerodyne/.test(primer), "…and it is where Kestrel Aerodyne lives");
  const primerPack = readJson("src/packs/lore/setting/L1-setting-primer.json");
  note(primerPack.pages.some(page => /Arms Makers of the Reach/.test(page.name)), "…and the pack page is regenerated");

  // The VOIDMARK index carries it.
  const index = readJson("data/voidmark-rules-index.json");
  note(index.chunks.some(c => c.file === "L9-arms-makers.md"), "the VOIDMARK index ingests the Arms Makers chapter");
}

/* ================================================================ D — element in summon names */

console.log("\nD) The element is in the summon's name");

{
  note(ELEMENTS.length === 9, `${ELEMENTS.length} elements are mapped`);
  note(elementAdjective("lightning") === "Electrical",
    "lightning reads Electrical — the word Ghostwire already uses on every gear card");
  note(elementalName("Zephyr Companion", "lightning") === "Electrical Zephyr Companion", "Michael's case: Electrical Zephyr");
  note(elementalName("Zephyr Companion", "cold") === "Cold Zephyr Companion", "…Cold Zephyr");
  note(elementalName("Zephyr Companion", "fire") === "Fire Zephyr Companion", "…Fire Zephyr");
  note(elementalName("Electrical Zephyr Companion", "fire") === "Fire Zephyr Companion", "re-summoning swaps the prefix");
  note(elementalName("Electrical Zephyr Companion", "lightning") === "Electrical Zephyr Companion", "…and never doubles it");
  note(elementalName("Zephyr Companion", null) === "Zephyr Companion", "no element, no prefix");
  note(Object.values(ELEMENT_ADJECTIVE).every(Boolean), "every element has an adjective");
  for (const element of ELEMENTS) note(langHas(`GHOSTWIRE.Summons.Veil.UI.Elements.${element}`), `lang has the ${element} adjective`);

  note(summonPicksElement("zephyr-companion") && summonPicksElement("boulder-companion"), "both choice companions pick an element");
  note(summonPicksElement("ember-companion"), "…and Ember carries the one its card prints");
  note(BOUND_SUMMON_DSIDS.every(summonPicksElement), "…and all three bound summons do too");
  note(!summonPicksElement("hurl-element"), "…and an attack card does not");
  const elementalistCode = code(read("scripts/elementalist.mjs"));
  note(new RegExp(`recordSummonElement`).test(elementalistCode), "the pick is recorded on the ability");
  note(SUMMON_ELEMENT_FLAG === "summonElement", `…under flags.${MODULE_ID}.${SUMMON_ELEMENT_FLAG}`);
  const veilCode = code(read("scripts/veil-summons.mjs"));
  note(/elementalName\(printedName\(data\.name\), element/.test(veilCode), "summonVeil names the Actor from it");
  note(/prototypeToken\.name", named/.test(veilCode), "…and the token it stamps");
  note(/flags\.element = element/.test(veilCode) || /if \(element\) flags\.element = element/.test(veilCode), "…and records it on the summon");
  note(/element: flag\(pet, "element"\)/.test(veilCode), "…and a level-up rank swap carries it over");
  note(Object.keys(COMPANION_ELEMENTS).length === 3, "the three companions still have their printed element lists");
}

/* ================================================================ E — Hurl Element FX colour */

console.log("\nE) Hurl Element renders the element you picked");

{
  // The bug, stated: the name says nothing, so the name-based flavour picks arcane blue.
  note(spellFlavour("Hurl Element").key === "arcane", "\"Hurl Element\" tells the name-matcher nothing (the 0.3.133 bug)");
  const blue = hitFxProfile("spell", "Hurl Element");
  const fire = hitFxProfile("spell", "Hurl Element", { element: "fire" });
  note(fire.color !== blue.color, "…and the element override changes the colour");
  note(fire.color === ELEMENT_FX.fire.color, `…to the fire hue (0x${fire.color.toString(16)})`);
  note(fire.sound.endsWith("spell-fireball.ogg"), "…and the fire sound");
  note(hitFxProfile("spell", "Hurl Element", { element: "cold" }).color === ELEMENT_FX.cold.color, "cold is icy pale blue");
  note(hitFxProfile("spell", "Hurl Element", { element: "acid" }).color === ELEMENT_FX.acid.color, "acid is green");
  note(hitFxProfile("spell", "Hurl Element", { element: "corruption" }).color === ELEMENT_FX.corruption.color, "corruption is violet");
  note(hitFxProfile("melee", "Striking Wind", { element: "lightning" }).color === ELEMENT_FX.lightning.color,
    "and a summon's melee strike is tinted too, not just spells");
  const hues = new Set(ELEMENTS.map(e => ELEMENT_FX[e]?.color));
  note(hues.size === ELEMENTS.length, `every element has its own hue (${hues.size} distinct)`);
  note(ELEMENTS.every(e => elementFx(e)), "every element the game offers is covered");

  // The element reaches the FX call from the card's own damage type.
  note(elementOfAbility({ system: { power: { effects: { a: { type: "damage", damage: { tier2: { types: ["fire"] } } } } } } }) === "fire",
    "elementOfAbility reads the type off the card");
  note(elementOfAbility({ system: { power: { effects: {} } } }) === null, "…and returns null rather than guessing");
  const hitFxCode = code(read("scripts/hit-fx.mjs"));
  // 0.3.135 (2) widened this to `elementForFx(ability, attunementOf(...))` — the card first, the
  // caster's attunement as the fallback — so the assertion follows the seam rather than the old call.
  note(/const element = elementForFx\(ability, attunementOf\(/.test(hitFxCode), "the fire point reads the element");
  note(/playHitFx\(kind, \{ from, at, name: ability\?\.name \?\? "", element \}\)/.test(hitFxCode), "…and hands it to playHitFx");
  note(/element: payload\.element/.test(hitFxCode), "…and the relay carries it, so the whole table sees one colour");
  note(/element: type \|\| null/.test(code(read("scripts/elementalist.mjs"))), "Elemental Shaping passes its own element too");
}

/* ================================================================ F — Elemental Shaping SFX */

console.log("\nF) Elemental Shaping stops hissing");

{
  const shaping = sfxMap.rules.find(r => r.id === "elemental-shaping");
  note(!shaping.src.endsWith("elemental-shaping.ogg"), "Elemental Shaping no longer uses the hiss file");
  note(/spell-/.test(shaping.src), `…and uses a cast sound (${shaping.src.split("/").pop()})`);

  // Every Elementalist card resolves to something, and nothing falls to the default scan-electronic.
  const abilities = walkJson("src/packs/classes/elementalist/abilities").map(({ doc }) => doc).filter(d => d.type === "ability");
  const stranded = [];
  for (const ability of abilities) {
    const { src, rule } = resolveSfxIn(sfxMap, ability, { localize });
    if (rule === "default") stranded.push(`${ability.system._dsid} -> ${src.split("/").pop()}`);
  }
  note(!stranded.length, `all ${abilities.length} Elementalist cards resolve to a real sound${stranded.length ? ` — stranded: ${stranded.slice(0, 4)}` : ""}`);

  const resolved = dsid => {
    const doc = abilities.find(a => a.system._dsid === dsid);
    return resolveSfxIn(sfxMap, doc, { localize }).src.split("/").pop();
  };
  note(resolved("summon-elemental") === "spell-summon.ogg", "Summon Elemental sounds like a summoning");
  note(resolved("twin-elemental-summon") === "spell-summon.ogg", "…and so does Twin (it used to throw a lightning strike)");
  note(resolved("greater-elemental-summon") === "spell-summon.ogg", "…and Greater");
  note(resolved("conflagration-tempest") === "spell-fireball.ogg", "Conflagration / Tempest is fire");
  note(resolved("void-vortex") === "spell-dark-blast.ogg", "Void Vortex is dark");
  note(resolved("cataclysm") === "spell-lightning.ogg", "Cataclysm is elemental");
  note(resolved("hurl-element") === "spell-lightning.ogg", "…and Hurl Element is unchanged");
}

/* ================================================================ G — VOIDMARK summon fixes */

console.log("\nG) VOIDMARK can answer a question about your summon");

{
  note(existsSync("docs/raw/29-summon-stat-blocks.md"), "the summon stat blocks chapter is generated");
  const statblocks = read("docs/raw/29-summon-stat-blocks.md");
  for (const name of ["Zephyr Companion", "Greater Elemental", "Bound Elemental (Rank 2)", "Guardian Spirit"]) {
    note(statblocks.includes(`### ${name}`), `…and it covers ${name}`);
  }
  note(/\*\*Stamina\*\*.*\*\*Speed\*\*.*\*\*Stability\*\*/.test(statblocks), "…with stamina, speed and stability on every block");
  note(/damage 6 \+ @chr \/ 9 \+ @chr \/ 12 \+ @chr/.test(statblocks), "…and the Rank 2 damage ladder");

  const index = readJson("data/voidmark-rules-index.json");
  note(index.chunks.some(c => c.file === "29-summon-stat-blocks.md"), "the index ingests it");

  const search = (q, opts = {}) => retrieve(index, retrievalQuery({ query: q, ...opts }), { k: 5 });
  const zephyr = search("how do I make my electrical zephyr attack?");
  note(zephyr.some(h => h.file === "29-summon-stat-blocks.md"), "\"electrical zephyr attack\" retrieves the summon chapter");
  note(zephyr.some(h => /maneuver/i.test(h.text)), "…and the command rules come with it");

  // The `ice` bug.
  const wire = index.chunks.find(c => c.file === "21-the-wire.md");
  note(scoreChunk(wire, "what's the price of a device") < 4, "\"price of a device\" no longer fires the Wire file hint");
  note(search("what's the price of a device")[0]?.file !== "21-the-wire.md", "…and does not lead with The Wire");

  // The follow-up.
  const follow = search("and how much damage?", {
    history: [{ role: "user", content: "how do I make my electrical zephyr attack?" }],
    token: { name: "Electrical Zephyr", type: "npc", dsid: "companion-zephyr" },
  });
  note(follow.some(h => h.file === "29-summon-stat-blocks.md"), "a follow-up uses the previous turn and the selected token");
  note(/previous user turn/i.test(read("scripts/voidmark-rag.mjs")), "…and says so where it is implemented");
  note(/selectedTokenContext\(\)/.test(code(read("scripts/voidmark.mjs"))), "…and voidmark.mjs reads the selected token");

  // Every file hint is word-bounded now.
  const ragSource = read("scripts/voidmark-rag.mjs");
  const hintBlock = ragSource.slice(ragSource.indexOf("const FILE_HINTS = ["), ragSource.indexOf("const PLACE_PHRASES"));
  note(!/\bre: \/[^/]*(?<![\\\w])ice\|/.test(hintBlock), "no bare `ice` alternative survives");
  note(/\\bice\\b/.test(hintBlock), "…it is `\\bice\\b`");
  note(/\\bmods\?\\b/.test(hintBlock), "…and `mod` is bounded (it used to match model / module / modern)");
  note(/\\bpacts\?\\b/.test(hintBlock), "…and `pact` is bounded (it used to match impact)");
  note(/\\brounds\?\\b/.test(hintBlock), "…and `round` is bounded (it used to match background)");

  // Synonyms.
  const ragCode = code(ragSource);
  note(/electrical: \[/.test(ragCode) && /"lightning"/.test(ragCode), "electrical / electric / shock reach lightning");
  note(/attack: \[[^\]]*"strike"/.test(ragCode), "attack reaches strike");
  note(/summon: \[[^\]]*"companion"[^\]]*"pet"[^\]]*"elemental"[^\]]*"spirit"/.test(ragCode), "summon / companion / pet / elemental / spirit are related");

  // The strikes are typed from the element at summon time.
  const items = [{ type: "ability", system: { power: { effects: { a: { type: "damage", damage: { tier1: { types: [] }, tier2: { types: [] }, tier3: { types: [] } } } } } } }];
  note(typeSummonStrikes(items, "lightning") === 3, "typeSummonStrikes types every tier");
  note(items[0].system.power.effects.a.damage.tier2.types[0] === "lightning", "…with the chosen element");
  const typed = [{ type: "ability", system: { power: { effects: { a: { type: "damage", damage: { tier1: { types: ["fire"] } } } } } } }];
  note(typeSummonStrikes(typed, "cold") === 0, "…and never overwrites a type the card already chose");
}

/* ================================================================ H — the eight summon rules */

console.log("\nH) The eight summon rules, and the data they needed");

{
  const rules = read("tools/data/summon-command-rules.md");
  const CHECKS = [
    [/costs you a \*\*maneuver\*\*/, "1 — commanding a signature strike costs a maneuver"],
    [/moves for free/, "1 — it moves free on your turn"],
    [/included\*\* — no extra maneuver that turn/, "1 — the summoning turn's strike is included"],
    [/independent\*\*: it takes its own turn/, "2 — independents act on their own turn"],
    [/2d10 \+ Logic\*\* \(Elementalist\) or \*\*2d10 \+ Instinct\*\*/, "3 — the command roll"],
    [/Rank 2: 6 \/ 9 \/ 12 \+ Logic\. Rank 3: 9 \/ 12 \/ 15 \+ Logic\. Greater: 11 \/ 15 \/ 20 \+ Logic\./, "4 — the damage ladder"],
    [/Ancient Flame, Roaring Storm \(lightning damage \*\*and dazed\*\*\), Living Mountain, and Devouring Void/, "4 — the four Greater forms"],
    [/Dismissing is a free maneuver/, "5 — dismiss"],
    [/nothing can target it/, "6 — extensions cannot be targeted"],
    [/rank × 2/, "7 — resistance is rank × 2"],
    [/stability equals its rank/, "7 — stability equals rank"],
    [/2 \/ 4 \/ 6 \+ Persona/, "8 — the Guardian's light strike"],
    [/Warding Aegis/, "8 — and Warding Aegis"],
  ];
  for (const [re, label] of CHECKS) note(re.test(rules), label);

  for (const chapter of ["17-elementalist", "18-street-priest", "22-the-veil", "28-constructs-pets-faq", "29-summon-stat-blocks"]) {
    note(/^## How to command summons/m.test(read(`docs/raw/${chapter}.md`)), `the rules are printed in ${chapter}`);
  }
  note(/How to command summons/.test(read("src/packs/rulebook/ghostwire-systems/22-the-veil.json")), "…and in the regenerated rulebook journal");
  note(readJson("data/voidmark-rules-index.json").chunks.some(c => /How to command summons/.test(c.heading)),
    "…and in the VOIDMARK index");

  // The data gaps: three elemental ranks had no items at all.
  const LADDER = { "elemental-rank-2": ["6", "9", "12"], "elemental-rank-3": ["9", "12", "15"], "elemental-greater": ["11", "15", "20"] };
  for (const [dsid, [low, mid, high]] of Object.entries(LADDER)) {
    const file = dsid === "elemental-greater" ? "elemental-greater" : dsid;
    const doc = readJson(`src/packs/summons/elementals/${file}.json`);
    const strike = (doc.items ?? []).find(i => i.system?._dsid === `${dsid}-elemental-lash`);
    note(!!strike, `${dsid} has a signature strike (it had no items at all)`);
    const damage = Object.values(strike?.system?.power?.effects ?? {}).find(e => e.type === "damage");
    note(damage?.damage.tier1.value === `${low} + @chr`
      && damage?.damage.tier2.value === `${mid} + @chr`
      && damage?.damage.tier3.value === `${high} + @chr`, `…at ${low} / ${mid} / ${high} + Logic`);
    note((damage?.damage.tier2.types ?? []).length === 0, "…left untyped, so the summon's element types it");
  }
  {
    const greater = readJson("src/packs/summons/elementals/elemental-greater.json");
    for (const form of ["ancient-flame", "roaring-storm", "living-mountain", "devouring-void"]) {
      const maneuver = greater.items.some(i => i.system?._dsid === `elemental-greater-${form}-maneuver`);
      const area = greater.items.some(i => i.system?._dsid === `elemental-greater-${form}-area`);
      note(maneuver && area, `Greater ${form}: one maneuver and one area ability`);
    }
    note(/dazed/i.test(localize("GHOSTWIRE.Summons.Elementals.ElementalGreater.Forms.RoaringStorm.Area.Effect")),
      "…and Roaring Storm's area dazes, as the lock says");
  }
  for (const rank of [1, 2, 3]) {
    const doc = readJson(`src/packs/summons/elementals/elemental-rank-${rank}.json`);
    note(doc.system.combat.stability === rank, `rank ${rank} elemental has stability ${rank}`);
  }
  note(readJson("src/packs/summons/elementals/elemental-greater.json").system.combat.stability === 4, "the Greater has stability 4");
  note(/system\.damage\.immunities\.\$\{element\}/.test(read("scripts/veil-summons.mjs")), "the element resistance is applied at summon time");
  note(/\(Number\(rank\) \|\| 1\) \* 2/.test(read("scripts/veil-summons.mjs")), "…at rank × 2");

  {
    const guardian = readJson("src/packs/summons/spirits/spirit-guardian.json");
    const strike = guardian.items.find(i => i.system?._dsid === "spirit-guardian-warding-strike");
    note(!!strike, "the Guardian spirit finally has a strike");
    const damage = Object.values(strike?.system?.power?.effects ?? {}).find(e => e.type === "damage");
    note(damage?.damage.tier1.value === "2 + @chr" && damage?.damage.tier3.value === "6 + @chr", "…a light one: 2 / 4 / 6 + Persona");
    note(guardian.items.some(i => i.system?._dsid === "spirit-guardian-warding-aegis"), "…and Warding Aegis is still there");
  }
  // The Command card, on every elemental and every spirit.
  const commanders = [
    ...walkJson("src/packs/summons/elementals"),
    ...walkJson("src/packs/summons/spirits"),
  ].filter(({ doc }) => (doc.items ?? []).some(i => /-command$/.test(i.system?._dsid ?? "")));
  note(commanders.length === 7, `every elemental and spirit carries a Command card (${commanders.length}/7)`);
  note(/2d10 \+ Logic/.test(localize("GHOSTWIRE.Summons.Command.Effect")), "…and it prints the command roll");
  note(/edge/.test(localize("GHOSTWIRE.Summons.Command.Effect")), "…including the high-result edge");
}

/* ================================================================ I — Field Triage is Medic-only */

console.log("\nI) Field Triage is a Medic ability");

{
  const moduleCode = code(read("scripts/module.mjs"));
  note(/DEFAULT_ITEM_DELETES/.test(moduleCode), "the universal Heal is deleted from the hero defaults");
  note(!/2qWHDVB7SBS9anLB[^]*?pJY4ybZUtkH9HDxy/.test(moduleCode), "…and no longer swapped for Field Triage");
  note(/registerFieldTriage\(\)/.test(moduleCode), "the Medic-only migration is registered");

  const medic = readJson("src/packs/classes/medic/medic.json");
  const grant = Object.values(medic.system.advancements)
    .find(a => (a.pool ?? []).some(p => String(p.uuid).includes("pJY4ybZUtkH9HDxy")));
  note(!!grant, "the Medic class grants Field Triage");
  note(grant?.requirements?.level === 1, "…at level 1");

  const pregens = walkJson("src/packs/pregens");
  const holders = pregens.filter(({ doc }) => (doc.items ?? []).some(i => i.system?._dsid === FIELD_TRIAGE_DSID));
  note(holders.length === 1, `exactly one pregen has it (${holders.length})`);
  note(/renn-solace-ward/.test(holders[0]?.path ?? ""), "…and it is Renn, the Medic");
  note(!/patch-up\.json/.test(code(read("tools/pregens-to-actors.mjs"))), "the pregen generator no longer hands it to everyone");

  note(isMedic({ system: { class: { system: { _dsid: "medic" } } } }), "isMedic reads the class");
  note(isMedic({ items: [{ type: "subclass", system: { _dsid: "medic-street-doc" } }] }), "…or a Medic subclass");
  note(!isMedic({ system: { class: { system: { _dsid: "commander" } } } }), "…and a Commander is not a Medic");
  const commander = { system: { class: { system: { _dsid: "commander" } } }, items: [{ id: "abc", system: { _dsid: FIELD_TRIAGE_DSID } }] };
  note(strayFieldTriage(commander).length === 1, "the migration finds a stray copy on a non-Medic");
  note(!strayFieldTriage({ system: { class: { system: { _dsid: "medic" } } }, items: commander.items }).length, "…and leaves the Medic's alone");

  const card = localize("GHOSTWIRE.Abilities.FieldTriage.Description");
  note(/Medic only/.test(card), "the card says Medic only");
  note(/Trauma Patch/.test(card) && /medkit/.test(card), "…and points everybody else at Trauma Patches and medkits");
  note(/No universal first aid/.test(read("docs/raw/04-combat.md")), "the combat chapter says there is no universal first aid");
  note(/Field Triage is yours alone/.test(read("docs/raw/15-medic.md")), "…and the Medic chapter says it is theirs");
}

/* ================================================================ J — Rally to Me */

console.log("\nJ) Rally to Me does the four things its card lists");

{
  note(RALLY_BURST === 5, "the burst is 5");
  note(RALLY_TEMP_STAMINA === 2, "the temp Stamina is 2");
  note(RALLY_CONDITIONS.join(",") === "dazed,restrained,frightened,weakened,bleeding,slowed,taunted,grabbed,prone",
    "the severity order is the locked one");
  note(worstCondition(["prone", "dazed", "bleeding"]) === "dazed", "the worst condition present is the one removed");
  note(worstCondition(["grabbed", "prone"]) === "grabbed", "…worst-first, every time");
  note(worstCondition(["hidden", "cover"]) === null, "…and a positive effect is never touched");
  note(worstCondition([]) === null, "…and no conditions means nothing to clear");
  note(rallyTempStamina(0) === 2, "temp Stamina goes to 2 from nothing");
  note(rallyTempStamina(5) === 5, "…and a hero already on 5 keeps 5 — temp Stamina does not stack");

  note(inRally({ token: { x: 0, y: 0, disposition: 1 }, origin: { x: 500, y: 0 }, gridSize: 100 }), "5 squares away is in");
  note(!inRally({ token: { x: 0, y: 0, disposition: 1 }, origin: { x: 600, y: 0 }, gridSize: 100 }), "6 squares away is out");
  note(!inRally({ token: { x: 0, y: 0, disposition: -1 }, origin: { x: 100, y: 0 }, gridSize: 100 }), "a hostile token is out at any range");
  note(inRally({ token: { x: 9999, y: 9999, disposition: -1 }, origin: { x: 0, y: 0 }, gridSize: 100, isSelf: true }),
    "the Commander is always in their own rally");

  const rallyCode = code(read("scripts/rally.mjs"));
  note(/requestRecovery\(actor/.test(rallyCode), "…and every one of them is asked about a Recovery");
  note(/system\.stamina\.temporary/.test(rallyCode), "…gets temp Stamina");
  note(/system\.characteristics\.\$\{characteristic\}\.edges/.test(rallyCode), "…and a one-shot edge on any power roll");
  note(/deleteEmbeddedDocuments\("ActiveEffect", \[RALLY_EDGE_ID\]\)/.test(rallyCode), "…which clears when it is used");
  note(/ChatMessage\.create/.test(rallyCode), "one chat card summarises the lot");

  const card = localize("GHOSTWIRE.Classes.Commander.Items.RallyTheCrew.Effect_before0000000000");
  note(/automatically/.test(card), "the card says it happens automatically");
  note(/\+2 temporary Stamina/.test(card) && /does not stack/.test(card), "…and states the +2 and the no-stack rule");
  note(/Spend an immediate recovery/.test(card), "…and the recovery prompt");
  note(/5 squares/.test(card) && /including you/.test(card), "…and the area, including the Commander");

  // The SFX must not move: this card keeps command-rallytome.ogg.
  const rally = readJson("src/packs/classes/commander/abilities/rally-the-crew.json");
  const { src, rule } = resolveSfxIn(sfxMap, rally, { localize });
  note(rule === "command-rally" && src.endsWith("command-rallytome.ogg"), `Rally keeps its existing SFX (${rule})`);
}

/* ================================================================ K — Lay on Hands + shared helper */

console.log("\nK) Lay on Hands asks the target's player");

{
  note(existsSync("scripts/recovery-prompt.mjs"), "the shared recovery prompt ships as its own module");
  const rallyCode = code(read("scripts/rally.mjs"));
  note(/import \{ requestRecovery \} from "\.\/recovery-prompt\.mjs"/.test(read("scripts/rally.mjs")),
    "…and both cards import it rather than each rolling their own");
  note(/resolveLayOnHands/.test(rallyCode) && /resolveRally/.test(rallyCode), "…and both are in one place");

  note(recoveryState({ system: { recoveries: { value: 3, recoveryValue: 7 } } }).ok, "a hero with recoveries can be asked");
  note(!recoveryState({ system: { recoveries: { value: 0, recoveryValue: 7 } } }).ok, "…one with none cannot");
  note(!recoveryState({}).ok, "…and a construct has no track at all");

  const users = [{ id: "p1", active: true, isGM: false }, { id: "gm", active: true, isGM: true }];
  note(askWho({}, users, id => id === "p1").userId === "p1", "the owner is asked");
  note(askWho({}, users, () => false).userId === "gm", "…and the GM when no owner is online");
  note(askWho({}, users, () => false).viaGm === true, "…and the card says it went to the GM");
  note(askWho({}, [{ id: "p1", active: false, isGM: false }], id => id === "p1").userId === null, "…and nobody online means nobody is asked");

  const card = localize("GHOSTWIRE.Classes.StreetPriest.Items.LayOnHands.Effect_before0000000000");
  note(/spend a recovery/i.test(card), "the card describes the prompt");
  note(/Director is asked instead/.test(card), "…the GM fallback");
  note(/no Recoveries left/.test(card), "…and the no-recoveries message");
  note(/Conviction bonuses below still apply/.test(card), "…and the existing bonus healing stays");
  note(langHas("GHOSTWIRE.RecoveryPrompt.Question"), "the prompt itself is localized");
  note(langHas("GHOSTWIRE.Rally.Row.Recovery.none"), "…and so is every outcome on the summary card");
}

/* ================================================================ version, docs, wiring */

console.log("\nL) Version, docs and wiring");

note(atLeast(manifest.version, "0.3.134"), `module.json is ${manifest.version} (>= 0.3.134)`);
note(/`0\.3\.134`/.test(read("README.md")), "README has a 0.3.134 entry");
note(existsSync("docs/directors/03134-smoke.md"), "the Foundry checklist is written");
{
  const checklist = existsSync("docs/directors/03134-smoke.md") ? read("docs/directors/03134-smoke.md") : "";
  for (const item of ["Ward the Room", "Ferrum Rivet", "Arms Makers", "Electrical Zephyr", "Hurl Element",
    "Elemental Shaping", "VOIDMARK", "Command", "Field Triage", "Rally", "Lay on Hands"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
  for (let item = 1; item <= 11; item += 1) note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…and has a section for item ${item}`);
}
for (const script of ["scripts/weapon-rename.mjs", "scripts/elements.mjs", "scripts/field-triage.mjs",
  "scripts/recovery-prompt.mjs", "scripts/rally.mjs"]) {
  note(existsSync(script), `${script} ships`);
}
for (const tool of ["tools/weapons-rename-lang.mjs", "tools/rituals-plain-text.mjs", "tools/gen-summon-items.mjs",
  "tools/gen-summon-statblocks.mjs", "tools/summon-rules-to-raw.mjs"]) {
  note(existsSync(tool), `${tool} ships`);
}
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");

/* ================================================================ */

console.log(fail.length ? `\n0.3.134 smoke FAIL — ${fail.length}` : "\n0.3.134 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
