// Compiles src/packs/<pack>/*.json into LevelDB packs under packs/<pack>.
// String values that are GHOSTWIRE.* lang keys are replaced with lang/en.json text,
// so lang/en.json stays the source of truth for names and descriptions.
// Run with Foundry closed:  node tools/build-packs.mjs
import { createRequire } from "node:module";
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const FOUNDRY_APP = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";
const { ClassicLevel } = createRequire(join(FOUNDRY_APP, "package.json"))("classic-level");

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const localize = key => key.split(".").reduce((o, k) => o?.[k], lang);

function resolve(value) {
  if (typeof value === "string" && value.startsWith("GHOSTWIRE.")) {
    const text = localize(value);
    if (typeof text !== "string") throw new Error(`Missing lang key: ${value}`);
    return text;
  }
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v)]));
  return value;
}

for (const pack of readdirSync("src/packs")) {
  const out = join("packs", pack);
  rmSync(out, { recursive: true, force: true });
  const db = new ClassicLevel(out, { valueEncoding: "json" });
  for (const file of readdirSync(join("src/packs", pack)).filter(f => f.endsWith(".json"))) {
    const { _key, ...doc } = resolve(JSON.parse(readFileSync(join("src/packs", pack, file), "utf8")));
    const stats = { coreVersion: "14.367", systemId: "draw-steel", systemVersion: "1.1.2" };
    // Embedded effects are stored under their own keys; the parent keeps only their ids.
    for (const { _key: effectKey, ...effect } of doc.effects) {
      await db.put(effectKey, { ...effect, _stats: stats });
    }
    doc.effects = doc.effects.map(e => e._id);
    doc._stats = stats;
    await db.put(_key, doc);
    console.log(`${pack}: ${doc.type} "${doc.name}"`);
  }
  await db.compactRange("\x00", "\uffff");
  await db.close();
}
