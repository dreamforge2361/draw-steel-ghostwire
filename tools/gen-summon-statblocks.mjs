#!/usr/bin/env node
/**
 * 0.3.134 (G7) — write docs/raw/29-summon-stat-blocks.md from the Summons & Machines pack sources.
 *
 * VOIDMARK could not answer "how do I make my electrical Zephyr attack?" because the summons pack was
 * never in its index: `tools/build-voidmark-index.mjs` ingests markdown, and every summon lived only
 * as pack JSON. Rather than teach the index to read Actor JSON — which would put schema-shaped noise
 * in front of a language model — this tool renders the pack into the one thing the index already
 * eats well: a rules chapter. Dropping the file into docs/raw/ is all the wiring it needs.
 *
 * Every summon Actor gets a line per fact the table asks for: rank, Stamina, speed, stability,
 * strikes with their damage tiers and types, other abilities, and the command rules that apply.
 *
 * Run: node tools/gen-summon-statblocks.mjs   then   node tools/build-voidmark-index.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MODULE_ID = "draw-steel-ghostwire";
const DIR = "src/packs/summons";
const OUT = "docs/raw/29-summon-stat-blocks.md";

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const localize = key => {
  const value = String(key ?? "").split(".").reduce((node, part) => (node && typeof node === "object") ? node[part] : undefined, lang);
  return (typeof value === "string") ? value : String(key ?? "");
};
/** Strip the HTML a lang entry carries so the chapter reads as prose. */
const plain = html => String(html ?? "")
  .replace(/<li>/gi, " · ")
  // Block tags are where a sentence ends. Stripping them without a separator ran whole stat blocks
  // together into one wall ("...bound for a moment.Signature SummonGranted by...").
  .replace(/<\/(p|div|h[1-6]|ul|ol|li|tr|table|blockquote)>/gi, " — ")
  .replace(/<br\s*\/?>/gi, " — ")
  .replace(/<[^>]+>/g, "")
  .replace(/(\s*—\s*)+/g, " — ")
  .replace(/\s+/g, " ")
  .replace(/^\s*—\s*|\s*—\s*$/g, "")
  .trim();

/** The folders that hold *summons* proper. Machines, kiosks, lockers and nodes are other chapters. */
const GROUPS = [
  { dir: "elementals", title: "Elementalist elementals and companions", who: "Elementalist" },
  { dir: "spirits", title: "Street Priest pact spirits", who: "Street Priest" },
  { dir: "sprites", title: "Technomancer sprites", who: "Technomancer" },
  { dir: "agents", title: "Hacker agents", who: "Hacker" },
];

function damageLine(effect) {
  const tiers = ["tier1", "tier2", "tier3"].map(tier => {
    const row = effect.damage?.[tier];
    if (!row) return null;
    const types = (row.types ?? []).length ? ` ${row.types.join("/")}` : "";
    return `${row.value}${types}`;
  }).filter(Boolean);
  return tiers.length ? tiers.join(" / ") : null;
}

function abilityLine(item) {
  const name = localize(`${item.name}`.replace(/\.Name$/, ".Name"));
  const kind = item.system?.type ?? "";
  const effects = item.system?.power?.effects ?? {};
  const damage = Object.values(effects).filter(e => e?.type === "damage").map(damageLine).filter(Boolean);
  const distance = item.system?.distance ?? {};
  const reach = distance.type ? `${distance.type}${distance.primary ? ` ${distance.primary}` : ""}` : "";
  const text = Object.values(item.system?.effects ?? {})
    .map(e => plain(localize(e?.description)))
    .filter(Boolean)
    .join(" ");
  const bits = [
    `**${name}**`,
    kind ? `*${kind}*` : "",
    reach ? `${reach}` : "",
    damage.length ? `damage ${damage.join("; ")}` : "",
    text,
  ].filter(Boolean);
  return `- ${bits.join(" · ")}`;
}

function block(doc) {
  const flags = doc.flags?.[MODULE_ID] ?? {};
  const name = localize(doc.name);
  const stamina = doc.system?.stamina?.max ?? "—";
  const speed = doc.system?.movement?.value ?? "—";
  const types = (doc.system?.movement?.types ?? []).join("/") || "walk";
  const stability = doc.system?.combat?.stability ?? 0;
  const size = doc.system?.combat?.size?.value ?? 1;
  const rank = flags.rank ?? null;
  const tier = flags.hybridTier ?? flags.band ?? null;
  const bio = plain(localize(doc.system?.biography?.value));
  const items = (doc.items ?? []).filter(i => i.type === "ability");
  const features = (doc.items ?? []).filter(i => i.type === "feature");

  const facts = [
    rank !== null && rank !== undefined ? `**Rank** ${rank}` : "",
    tier ? `**Form** ${tier}` : "",
    `**Stamina** ${stamina}`,
    `**Speed** ${speed} (${types})`,
    `**Stability** ${stability}`,
    `**Size** ${size}`,
  ].filter(Boolean).join(" · ");

  const lines = [`### ${name}`, "", facts, ""];
  if (bio) lines.push(bio, "");
  if (items.length) {
    lines.push("**Abilities**", "");
    lines.push(...items.map(abilityLine), "");
  }
  for (const feature of features) {
    const fname = localize(feature.name);
    const ftext = plain(localize(feature.system?.description?.value));
    lines.push(`- **${fname}** — ${ftext}`);
  }
  if (features.length) lines.push("");
  lines.push(`*Machine handle (dsid): \`${flags.dsid ?? doc.system?._dsid ?? "—"}\`.*`, "");
  return lines.join("\n");
}

const COMMAND_RULES = readFileSync("tools/data/summon-command-rules.md", "utf8").replace(/\r\n/g, "\n").trim();

const out = [
  "# Summon Stat Blocks",
  "",
  "**RAW status:** generated — `node tools/gen-summon-statblocks.mjs` renders this from `src/packs/summons/**`. Edit the pack rows, not this file.",
  "**Related:** Elementalist (`17`) · Street Priest (`18`) · The Veil (`22`) · Constructs, Pets & Drones FAQ (`28`)",
  "",
  "---",
  "",
  "Every companion, elemental, spirit, sprite and agent the module ships, with the numbers the table asks for mid-fight. The rules for **ordering** any of them are the same for all of them and are repeated here so this chapter answers on its own.",
  "",
  COMMAND_RULES,
  "",
  "---",
  "",
].join("\n");

const groups = [];
for (const group of GROUPS) {
  const dir = join(DIR, group.dir);
  const files = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_")).sort();
  if (!files.length) continue;
  const blocks = files.map(file => block(JSON.parse(readFileSync(join(dir, file), "utf8"))));
  groups.push([`## ${group.title}`, "", `Summoned by: **${group.who}**.`, "", ...blocks].join("\n"));
}

writeFileSync(OUT, `${out}${groups.join("\n---\n\n")}`);
console.log(`summon stat blocks: ${groups.length} group(s) → ${OUT}`);
