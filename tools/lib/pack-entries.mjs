/**
 * 0.3.135 (3a) — every ability, ritual Working and summon in the packs, rendered as one plain-text
 * entry apiece for the VOIDMARK index.
 *
 * Why this file exists: VOIDMARK could answer a *chapter* question and not a *card* question. The RAW
 * chapters describe how abilities work; they do not list the 418 abilities, and the only ritual text in
 * the index was the Veil chapter's prose, so **"what does Ward the Room do?"** had no entry to land on
 * and came back "that packet is not on this channel" — for a Working that ships with four paragraphs of
 * its own text. The summons were half-covered: `docs/raw/29-summon-stat-blocks.md` renders 34 of the 68
 * Actors in the pack and none of the machines, kiosks or node tokens.
 *
 * So the pack JSON *is* the source, read straight off disk, with `lang/en.json` resolved the same way
 * `tools/build-packs.mjs` resolves it — which means an entry can never drift from the card a player is
 * holding, and no second copy of any rules text exists to go stale.
 *
 * Every entry carries `entity` (the card's printed name) and `entityDsid`, which is what lets
 * `scripts/voidmark-rag.mjs` do an exact-name boost, a selected-token boost, and a "did you mean X?"
 * clarifying question instead of guessing.
 *
 * Node-only (it reads the filesystem). `tools/build-voidmark-index.mjs` is the one caller;
 * `tools/wave-03135-smoke.mjs` and `tools/voidmark-smoke.mjs` assert the output.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";

/** Synthetic `file` names, so a pack entry is as filterable as a chapter chunk. */
export const PACK_FILES = Object.freeze({
  ability: "pack-abilities.md",
  ritual: "pack-rituals.md",
  summon: "pack-summons.md",
});

/**
 * Where each kind of entry comes from, and what the citation chip says.
 *
 * `group` turns a source directory into the label a Director reads on the citation — the class name
 * for a class ability, "Kits" for a kit's granted ability, and so on — because "Ghostwire Abilities"
 * on its own tells nobody which of nine classes the card belongs to.
 */
const ABILITY_DIRS = Object.freeze([
  { dir: "src/packs/classes", group: segment => title(segment) },
  { dir: "src/packs/abilities", group: () => "Universal" },
  { dir: "src/packs/kits", group: () => "Kits" },
  { dir: "src/packs/origins", group: () => "Ancestries" },
  { dir: "src/packs/perks", group: () => "Perks" },
  { dir: "src/packs/chrome", group: () => "Chrome" },
]);

const RITUAL_DIR = "src/packs/gear/general/ritual-formulas";
const SUMMON_DIR = "src/packs/summons";

const title = text => String(text ?? "")
  .split(/[-_]/)
  .filter(Boolean)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

/** Every `*.json` under `dir`, recursively, skipping `_folder.json` and friends. */
function jsonFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  const walk = current => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      out.push(path);
    }
  };
  walk(dir);
  return out;
}

/**
 * HTML card text as plain prose.
 *
 * Block tags become newlines and list items become dashes, so a four-bullet "what this card's words
 * mean here" block survives as four readable lines rather than one run-on paragraph. Foundry enricher
 * syntax (`[[/apply …]]`, `@UUID[…]{label}`) is reduced to its label: the machinery is noise to a
 * language model and the label is the only part that carries meaning.
 */
export function plainText(html) {
  return String(html ?? "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(?:script|style)[\s\S]*?<\/(?:script|style)>/gi, "")
    .replace(/@UUID\[[^\]]*\]\{([^}]*)\}/g, "$1")
    .replace(/@UUID\[[^\]]*\]/g, "")
    .replace(/\[\[[^\]]*\]\]\{([^}]*)\}/g, "$1")
    .replace(/\[\[\/?[a-z]+\s*([^\]]*)\]\]/gi, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/(?:p|li|ul|ol|div|h[1-6]|tr|table|blockquote)>/gi, "\n")
    .replace(/<t[hd][^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&times;/g, "×")
    .replace(/&[lr]squo;/g, "’")
    .replace(/&[lr]dquo;/g, "\"")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .split("\n")
    .map(line => line.replace(/[ \t]+/g, " ").trim())
    .filter((line, i, all) => line || (all[i - 1] ?? ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** A `GHOSTWIRE.*` key resolved against `lang/en.json`; anything else passed through. */
function makeLocalizer(lang) {
  return value => {
    if (typeof value !== "string" || !value) return "";
    if (!value.startsWith("GHOSTWIRE.")) return value;
    const resolved = value.split(".").reduce((node, part) => (node == null ? node : node[part]), lang);
    return (typeof resolved === "string") ? resolved : "";
  };
}

const list = value => (Array.isArray(value) ? value.filter(Boolean) : (value ? [value] : []));
const joinBits = bits => bits.filter(Boolean).join(" · ");

/** `{ type: "ranged", primary: "10" }` → `ranged 10`. */
function distanceLine(distance) {
  if (!distance) return "";
  const type = String(distance.type ?? "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  const numbers = [distance.primary, distance.secondary, distance.tertiary]
    .map(value => String(value ?? "").trim())
    .filter(value => value && (value !== "1" || type.includes("burst") || type.includes("cube")));
  return joinBits([type, numbers.join(" / ")]);
}

function targetLine(target) {
  if (!target) return "";
  const type = String(target.type ?? "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  const count = target.value == null ? "" : String(target.value);
  return joinBits([target.custom || "", count && type ? `${count} ${type}` : type]);
}

/** The three tiers of one power effect, as `≤11 / 12-16 / 17+` lines. */
const TIER_LABELS = Object.freeze({ tier1: "≤11", tier2: "12-16", tier3: "17+" });

function tierLines(effect, loc) {
  const kind = String(effect?.type ?? "");
  const body = effect?.[kind];
  if (!body) return [];
  const out = [];
  for (const [tier, label] of Object.entries(TIER_LABELS)) {
    const row = body[tier];
    if (!row) continue;
    let text = "";
    if (kind === "damage") {
      const types = list(row.types).join(" / ");
      text = joinBits([`${String(row.value ?? "").trim()} damage`, types]);
    } else if (kind === "resource") {
      text = row.amount == null ? "" : `${row.amount} ${row.type ?? "resource"}`;
    } else if (kind === "forced") {
      text = joinBits([list(row.movement).join(" / "), row.distance ? `${row.distance}` : ""]);
    } else {
      text = plainText(loc(row.display ?? ""));
    }
    if (kind === "applied") {
      const conditions = Object.keys(row.effects ?? {}).join(", ");
      text = joinBits([text, conditions]);
    }
    if (!text || text === "{{forced}}") text = plainText(loc(row.display ?? ""));
    if (text) out.push(`  ${label}: ${text}`);
  }
  return out;
}

/** One ability card, rendered. */
function abilityEntry({ doc, source, group, loc }) {
  const system = doc.system ?? {};
  const name = loc(doc.name) || String(doc.name ?? "");
  const lines = [];
  lines.push(joinBits([
    name,
    group,
    String(system.type ?? "").replace(/([a-z])([A-Z])/g, "$1 $2"),
    String(system.category ?? ""),
    list(system.keywords).join(" "),
  ]));
  const story = plainText(loc(system.story ?? ""));
  if (story) lines.push(story);
  const cost = system.resource ?? system.spend?.value;
  if (cost) lines.push(`Cost: ${cost}`);
  const spendText = plainText(loc(system.spend?.text ?? ""));
  if (spendText) lines.push(`Spend: ${spendText}`);
  const trigger = plainText(loc(system.trigger ?? ""));
  if (trigger) lines.push(`Trigger: ${trigger}`);
  const distance = distanceLine(system.distance);
  const target = targetLine(system.target);
  if (distance || target) lines.push(joinBits([distance && `Distance: ${distance}`, target && `Target: ${target}`]));
  const roll = system.power?.roll;
  if (roll?.formula) {
    lines.push(`Power roll: ${roll.formula.replace("@chr", list(roll.characteristics).join(" or ") || "characteristic")}`);
  }
  for (const effect of Object.values(system.power?.effects ?? {})) {
    const rows = tierLines(effect, loc);
    if (rows.length) lines.push(rows.join("\n"));
  }
  for (const effect of Object.values(system.effects ?? {})) {
    const text = plainText(loc(effect.description ?? ""));
    if (text) lines.push(`${String(effect.type ?? "effect") === "spend" ? "Spend effect" : "Effect"}: ${text}`);
  }
  return {
    kind: "ability",
    entity: name,
    entityDsid: String(system._dsid ?? ""),
    chapter: `Ghostwire Abilities — ${group}`,
    heading: name,
    file: PACK_FILES.ability,
    source,
    text: lines.filter(Boolean).join("\n"),
  };
}

/** One Ritual Working formula, rendered. */
function ritualEntry({ doc, source, loc }) {
  const system = doc.system ?? {};
  const ritual = doc.flags?.["draw-steel-ghostwire"]?.ritual ?? {};
  const name = loc(doc.name) || String(doc.name ?? "");
  // "Formula: Ward the Room" is the Item's name; the Working's own name is what a player asks about.
  const working = name.replace(/^Formula:\s*/i, "").trim();
  const lines = [joinBits([
    working,
    "Ritual Working",
    ritual.family ? `${ritual.family} family` : "",
    ritual.magnitudeText ? `Magnitude ${ritual.magnitudeText}` : "",
    ritual.leaders ? `${ritual.leaders} leaders` : "",
  ])];
  if (working !== name) lines.push(`Also on the sheet as: ${name}`);
  if (ritual.form) lines.push(`Formula form: ${ritual.form}`);
  if (list(ritual.componentsTotal).length) lines.push(`Components: ${list(ritual.componentsTotal).join(" / ")}`);
  const body = plainText(loc(system.description?.value ?? ""));
  if (body) lines.push(body);
  return {
    kind: "ritual",
    entity: working,
    entityDsid: String(system._dsid ?? ""),
    chapter: "Ghostwire Ritual Workings",
    heading: working,
    file: PACK_FILES.ritual,
    source,
    text: lines.filter(Boolean).join("\n"),
  };
}

/** One summon / machine / construct Actor, with its embedded cards, rendered. */
function summonEntry({ doc, source, loc, group }) {
  const system = doc.system ?? {};
  const flags = doc.flags?.["draw-steel-ghostwire"] ?? {};
  const name = loc(doc.name) || String(doc.name ?? "");
  const lines = [joinBits([
    name,
    group,
    system.monster?.role ? String(system.monster.role) : "",
    system.monster?.level == null ? "" : `level ${system.monster.level}`,
    system.monster?.organization ? String(system.monster.organization) : "",
  ])];
  const stats = joinBits([
    system.stamina?.max == null ? "" : `Stamina ${system.stamina.max}`,
    system.movement?.value == null ? "" : `Speed ${system.movement.value}`,
    list(system.movement?.types).length ? list(system.movement.types).join(" / ") : "",
    system.combat?.size?.value == null ? "" : `size ${system.combat.size.value}`,
    system.combat?.stability == null ? "" : `stability ${system.combat.stability}`,
  ]);
  if (stats) lines.push(stats);
  const bio = plainText(loc(system.biography?.value ?? ""));
  if (bio) lines.push(bio);
  for (const item of doc.items ?? []) {
    const itemName = loc(item.name) || String(item.name ?? "");
    if (item.type === "ability") {
      const rendered = abilityEntry({ doc: item, source, group: name, loc });
      lines.push(`Card — ${rendered.text}`);
    } else {
      const text = plainText(loc(item.system?.description?.value ?? ""));
      lines.push(joinBits([`Trait — ${itemName}`, text]));
    }
  }
  return {
    kind: "summon",
    entity: name,
    entityDsid: String(flags.dsid ?? system._dsid ?? ""),
    chapter: `Ghostwire Summons — ${group}`,
    heading: name,
    file: PACK_FILES.summon,
    source,
    text: lines.filter(Boolean).join("\n"),
  };
}

/**
 * Every pack entry, in a stable order.
 *
 * @param {string} root  Repo root.
 * @returns {Array<{kind: string, entity: string, entityDsid: string, chapter: string, heading: string,
 *                  file: string, source: string, text: string}>}
 */
export function packEntries(root) {
  const lang = JSON.parse(readFileSync(join(root, "lang/en.json"), "utf8"));
  const loc = makeLocalizer(lang);
  const rel = path => relative(root, path).replaceAll("\\", "/");
  const entries = [];

  for (const { dir, group } of ABILITY_DIRS) {
    for (const path of jsonFiles(join(root, dir)).sort()) {
      const doc = JSON.parse(readFileSync(path, "utf8"));
      if (doc.type !== "ability") continue;
      // `src/packs/classes/elementalist/abilities/hurl-element.json` → "Elementalist".
      const segment = rel(path).slice(`${dir}/`.length).split("/")[0];
      entries.push(abilityEntry({ doc, source: rel(path), group: group(segment), loc }));
    }
  }

  for (const path of jsonFiles(join(root, RITUAL_DIR)).sort()) {
    const doc = JSON.parse(readFileSync(path, "utf8"));
    if (!doc.flags?.["draw-steel-ghostwire"]?.ritual?.formula) continue;
    entries.push(ritualEntry({ doc, source: rel(path), loc }));
  }

  for (const path of jsonFiles(join(root, SUMMON_DIR)).sort()) {
    const doc = JSON.parse(readFileSync(path, "utf8"));
    if (doc.type !== "npc") continue;
    const folder = rel(path).slice(`${SUMMON_DIR}/`.length).split("/")[0];
    const group = folder.endsWith(".json") ? "Summons" : title(folder);
    entries.push(summonEntry({ doc, source: rel(path), loc, group }));
  }

  return entries.filter(entry => entry.entity && entry.text);
}

/** Entry counts by kind — what the build log and the smoke both print. */
export function packEntryCounts(entries) {
  const counts = { ability: 0, ritual: 0, summon: 0 };
  for (const entry of entries) counts[entry.kind] = (counts[entry.kind] ?? 0) + 1;
  return counts;
}

export { basename };
