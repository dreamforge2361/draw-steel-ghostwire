#!/usr/bin/env node
/**
 * F21 — Psychic attacks on Incursion / undead smoke (0.3.119).
 * Foundry-free: pack source JSON + lang cards + the keyword registration.
 *
 * The point of the feature is that a Cyborg's Cortical Firewall
 * (system.damage.immunities.psychic = @level) has something to absorb, so this asserts the *damage
 * type*, not only the marker keyword.
 *
 * Run: node tools/f21-psychic-incursion-undead-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));

const moduleJson = JSON.parse(readFileSync("module.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const directorNote = readFileSync("docs/directors/f21-psychic-incursion-undead.md", "utf8");
const readme = readFileSync("README.md", "utf8");
const langAt = path => path.split(".").reduce((o, k) => o?.[k], lang);

const read = path => JSON.parse(readFileSync(path, "utf8"));
const abilityOf = (doc, dsid) => doc.items?.find(i => i.system?._dsid === dsid) ?? null;
const keywordsOf = item => item?.system?.keywords ?? [];
const damageTypesOf = item => {
  const types = new Set();
  for (const effect of Object.values(item?.system?.power?.effects ?? {})) {
    if (effect.type !== "damage") continue;
    for (const tier of ["tier1", "tier2", "tier3"]) for (const t of effect.damage[tier].types) types.add(t);
  }
  return [...types];
};
const damageBand = item => {
  for (const effect of Object.values(item?.system?.power?.effects ?? {})) {
    if (effect.type !== "damage") continue;
    return ["tier1", "tier2", "tier3"].map(tier => effect.damage[tier].value);
  }
  return [];
};

console.log("F21 — Psychic attacks on Incursion / undead smoke (0.3.119)\n");

/* ------------------------------------------------------------------ 1) ship surface */

console.log("1) Ship surface");
note(atLeast(moduleJson.version, "0.3.119"), `module.json is ≥ 0.3.119 (got ${moduleJson.version})`);
note(boot.includes("ds.CONFIG.abilities.keywords.psychic"), "module.mjs registers the psychic ability keyword");
note(boot.includes("GHOSTWIRE.Abilities.Keywords.Psychic"), "the keyword points at a Ghostwire lang label");
note(langAt("GHOSTWIRE.Abilities.Keywords.Psychic") === "Psychic", "the label resolves to Psychic");
// Draw Steel's own `psionic` is the Talent class keyword; Ghostwire adds psychic beside it, never instead.
note(boot.includes("ds.CONFIG.abilities.keywords.tech"), "the existing Ghostwire keywords are still registered");
note(!/keywords\.psionic\s*=/.test(boot), "Ghostwire does not redefine Draw Steel's psionic keyword");
note(/0\.3\.119/.test(readme) && /psychic/i.test(readme), "README changelog names 0.3.119 psychic");
note(/soulless/.test(directorNote), "director note states the soulless carve-out");

/* ------------------------------------------------------------------ 2) Cortical Firewall */

console.log("2) Cortical Firewall is what this feeds");
const firewall = read("src/packs/origins/cyborg/cortical-firewall-trait.json");
const change = firewall.effects?.[0]?.system?.changes?.[0];
note(change?.key === "system.damage.immunities.psychic", "Cortical Firewall still writes psychic immunity");
note(change?.value === "@level", "…equal to the Cyborg's level");
note(/psychic immunity/i.test(langAt("GHOSTWIRE.Peoples.Cyborg.CorticalFirewall.Description")), "its card still says so");

/* ------------------------------------------------------------------ 3) the ghost */

console.log("3) Ghost — Veil undead leader");
const ghost = read("src/packs/bestiary/veil-undead/ghost.json");
const heat = abilityOf(ghost, "heat-death");
note(!!heat, "Heat Death is on the sheet");
note(heat.system.category === "signature", "Heat Death is still the signature");
note(keywordsOf(heat).includes("psychic"), "Heat Death carries the psychic keyword");
note(keywordsOf(heat).includes("magic"), "…and keeps magic (never stripped when both apply)");
note(keywordsOf(heat).includes("strike") && keywordsOf(heat).includes("ranged"), "…and stays a ranged strike");
note(damageTypesOf(heat).join(",") === "psychic", "Heat Death deals psychic damage, so the firewall bites");
note(damageBand(heat).join("/") === "7/10/13", "Heat Death keeps its 7 / 10 / 13 band");
note(/psychic/i.test(heat.system.effects?.before0000000000?.description ?? ""), "Heat Death prints why it is psychic");

const wail = abilityOf(ghost, "awful-wail");
note(keywordsOf(wail).includes("psychic"), "Awful Wail carries the psychic keyword");
note(damageTypesOf(wail).join(",") === "psychic", "Awful Wail deals psychic damage");
note(damageBand(wail).join("/") === "3/5/8", "Awful Wail keeps its 3 / 5 / 8 band");

// Deliberately left sonic: a ghost should not be psychic end to end.
const shriek = abilityOf(ghost, "shriek");
note(!keywordsOf(shriek).includes("psychic"), "Shriek is deliberately not psychic");
note(/damage 2 sonic/.test(shriek.system.effects?.before0000000000?.description ?? ""), "Shriek keeps its 2 sonic");
note(/Shriek stays sonic/.test(directorNote), "director note explains the Shriek carve-out");
note(/Shriek stays sonic/.test(langAt("GHOSTWIRE.Bestiary.Actors.Ghost.Description")), "the ghost's card records the F21 pass");

/* ------------------------------------------------------------------ 4) ghoul + cultist */

console.log("4) Ghoul and Veil Cultist get one psychic attack each");
const ghoul = read("src/packs/bestiary/veil-undead/ghoul.json");
const bleed = abilityOf(ghoul, "hunger-bleed");
note(!!bleed, "Ghoul: Hunger Bleed exists");
note(keywordsOf(bleed).includes("psychic") && keywordsOf(bleed).includes("area"), "Hunger Bleed is a psychic area ability");
note(damageTypesOf(bleed).join(",") === "psychic", "Hunger Bleed deals psychic damage");
// Banded off the zombie's Zombie Dust so nothing here is an invented number.
const dust = abilityOf(read("src/packs/bestiary/veil-undead/zombie.json"), "zombie-dust");
note(damageBand(bleed).join("/") === damageBand(dust).join("/"), `Hunger Bleed reuses Zombie Dust's band (${damageBand(dust).join("/")})`);
note(bleed.system.resource === dust.system.resource, `…and its Malice cost (${dust.system.resource})`);
note(bleed.system.category === "heroic" && bleed.system.type === "maneuver", "Hunger Bleed is a heroic maneuver");
// Brute physical undead stay physical.
const claws = abilityOf(ghoul, "razor-claws");
note(!keywordsOf(claws).includes("psychic") && keywordsOf(claws).includes("weapon"), "Razor Claws stay a weapon strike");

const cultist = read("src/packs/bestiary/veil-undead/veil-cultist.json");
const debt = abilityOf(cultist, "show-them-the-debt");
note(!!debt, "Veil Cultist: Show Them the Debt exists");
note(keywordsOf(debt).includes("psychic") && keywordsOf(debt).includes("ranged"), "Show Them the Debt is a psychic ranged ability");
note(damageTypesOf(debt).join(",") === "psychic", "Show Them the Debt deals psychic damage");
const grenade = abilityOf(cultist, "alchemical-device");
note(damageBand(debt).join("/") === damageBand(grenade).join("/"), `…banded off the cultist's own Blight Grenade (${damageBand(grenade).join("/")})`);
const revolver = abilityOf(cultist, "death-scythe");
note(!keywordsOf(revolver).includes("psychic"), "the Hexed Revolver is a bullet and is not psychic");
note(damageTypesOf(revolver).join(",") === "corruption", "…and keeps corruption damage");

/* ------------------------------------------------------------------ 5) spirits */

console.log("5) Spirits");
const hunter = read("src/packs/summons/spirits/spirit-hunter.json");
const chain = abilityOf(hunter, "spirit-hunter-binding-chain");
note(keywordsOf(chain).includes("psychic"), "Hunter Spirit: Binding Chain carries the psychic keyword");
note(damageTypesOf(chain).join(",") === "psychic", "Binding Chain deals psychic damage under either pact");
const chainCard = langAt("GHOSTWIRE.Summons.Spirits.SpiritHunter.Strike.Effect");
note(/psychic/i.test(chainCard), "its card prints the psychic rule");
note(/Pact Blade still tints/.test(chainCard), "…and says the Warrior's Pact Blade is unchanged");
// The Warrior's pact tint is the shipped choice; retyping it would delete a feature.
const warrior = read("src/packs/summons/spirits/spirit-warrior.json");
const blade = abilityOf(warrior, warrior.items.find(i => i.type === "ability").system._dsid);
note(!keywordsOf(blade).includes("psychic"), "Warrior Spirit: Pact Blade is deliberately not psychic");
note(damageTypesOf(blade).length === 0, "…and keeps its pact-driven (untyped) damage");

/* ------------------------------------------------------------------ 6) Incursion horrors */

console.log("6) Incursion horrors (voiceless talkers)");
const invader = read("src/packs/bestiary/wire-machine/signal-talker-invader.json");
note(invader.system.monster.keywords.includes("voicelessTalker"), "Signal Talker (Invader) is a voiceless talker");
for (const dsid of ["psionic-boom", "memory-thief"]) {
  const item = abilityOf(invader, dsid);
  note(keywordsOf(item).includes("psychic"), `${dsid}: carries the psychic marker keyword`);
  note(keywordsOf(item).includes("psionic"), `${dsid}: keeps Draw Steel's psionic keyword`);
  note(damageTypesOf(item).join(",") === "psychic", `${dsid}: already dealt psychic damage`);
}
const tentacle = abilityOf(invader, "tentacle");
note(!keywordsOf(tentacle).includes("psychic"), "Tentacle is a tentacle and stays physical");
const whelp = read("src/packs/bestiary/wire-machine/signal-mindkiller-whelp.json");
note(whelp.items.every(i => !keywordsOf(i).includes("psychic")), "the Whelp is untouched (no damaging mind attack to tag)");

/* ------------------------------------------------------------------ 7) soulless stay physical */

console.log("7) Soulless undead stay physical, on purpose");
for (const slug of ["skeleton", "zombie"]) {
  const doc = read(`src/packs/bestiary/veil-undead/${slug}.json`);
  note(doc.system.monster.keywords.includes("soulless"), `${slug}: is tagged soulless`);
  note(doc.items.every(i => !keywordsOf(i).includes("psychic")), `${slug}: no psychic keyword anywhere`);
  note(doc.items.every(i => !damageTypesOf(i).includes("psychic")), `${slug}: no psychic damage anywhere`);
  const key = `GHOSTWIRE.Bestiary.Actors.${slug[0].toUpperCase()}${slug.slice(1)}.Description`;
  note(/soulless/.test(langAt(key)), `${slug}: its card says why`);
}

/* ------------------------------------------------------------------ 8) coverage + no strays */

console.log("8) Coverage and no strays");
// Brief rule 4: at least one psychic-tagged attack per ghost / ghoul / veil-cultist / relevant spirit.
const REQUIRED = {
  "src/packs/bestiary/veil-undead/ghost.json": "ghost",
  "src/packs/bestiary/veil-undead/ghoul.json": "ghoul",
  "src/packs/bestiary/veil-undead/veil-cultist.json": "veil-cultist",
  "src/packs/summons/spirits/spirit-hunter.json": "spirit-hunter",
};
for (const [path, label] of Object.entries(REQUIRED)) {
  const doc = read(path);
  const tagged = doc.items.filter(i => keywordsOf(i).includes("psychic"));
  note(tagged.length >= 1, `${label}: ${tagged.length} psychic-tagged attack(s)`);
  note(tagged.some(i => damageTypesOf(i).includes("psychic")), `${label}: at least one of them deals psychic damage`);
}

// Every psychic-tagged ability in the whole tree either deals psychic damage or deals none at all —
// a psychic tag on a corruption or sonic roll would be a card the firewall cannot honour.
function walk(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith(".json") && ent.name !== "_folder.json") out.push(p);
  }
  return out;
}
let tagged = 0;
for (const root of ["src/packs/bestiary", "src/packs/summons", "src/packs/deadhead", "src/packs/abilities", "src/packs/origins", "src/packs/classes"]) {
  for (const file of walk(root)) {
    const doc = read(file);
    for (const item of [doc, ...(doc.items ?? [])]) {
      if (!keywordsOf(item).includes("psychic")) continue;
      tagged += 1;
      const types = damageTypesOf(item);
      note(types.length === 0 || types.join(",") === "psychic",
        `${file} :: ${item.name ?? item._id}: psychic keyword rolls psychic damage (got ${types.join(",") || "none"})`);
    }
  }
}
note(tagged >= 7, `counted ${tagged} psychic-tagged abilities across the packs`);

if (fail.length) {
  console.log(ok.join("\n"));
  console.error(`\n${fail.length} failed:\n${fail.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${ok.length} passed`);
