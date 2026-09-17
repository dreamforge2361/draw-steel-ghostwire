// Compiles src/packs/<pack>/**/*.json into LevelDB packs under packs/<pack>.
// String values that are GHOSTWIRE.* lang keys are replaced with lang/en.json text,
// so lang/en.json stays the source of truth for names and descriptions.
// A subfolder's _folder.json is a compendium Folder; every item in that subfolder
// must set "folder" to that Folder's _id (the build fails otherwise).
// Actor packs work the same way: embedded items carry their own "!actors.items!" _key.
// Run with Foundry closed:  node tools/build-packs.mjs
import { createRequire } from "node:module";
import { readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

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

const readJson = path => resolve(JSON.parse(readFileSync(path, "utf8")));

for (const pack of readdirSync("src/packs")) {
  const src = join("src/packs", pack);
  const out = join("packs", pack);
  rmSync(out, { recursive: true, force: true });
  const db = new ClassicLevel(out, { valueEncoding: "json" });
  const stats = { coreVersion: "14.367", systemId: "draw-steel", systemVersion: "1.1.2" };
  const files = readdirSync(src, { recursive: true }).filter(f => f.endsWith(".json")).sort();
  for (const file of files) {
    const { _key, ...doc } = readJson(join(src, file));
    // Foundry rejects the whole compendium (and the world renders black) on a malformed id.
    const badId = [doc, ...(doc.effects ?? []), ...(doc.items ?? [])].find(d => !/^[A-Za-z0-9]{16}$/.test(d._id ?? ""));
    if (badId) throw new Error(`${file}: _id "${badId._id}" must be 16 alphanumeric characters`);
    if (_key.startsWith("!folders!")) {
      await db.put(_key, { ...doc, _stats: stats });
      console.log(`${pack}: Folder "${doc.name}"`);
      continue;
    }
    const folderFile = join(src, dirname(file), "_folder.json");
    const expected = existsSync(folderFile) ? JSON.parse(readFileSync(folderFile, "utf8"))._id : null;
    if (doc.folder !== expected) throw new Error(`${file}: folder is ${doc.folder}, expected ${expected}`);
    // Embedded effects are stored under their own keys; the parent keeps only their ids.
    for (const { _key: effectKey, ...effect } of doc.effects) {
      await db.put(effectKey, { ...effect, _stats: stats });
    }
    doc.effects = doc.effects.map(e => e._id);
    // Actor packs: embedded Items ("!actors.items!<actor>.<item>") and their effects
    // ("!actors.items.effects!<actor>.<item>.<effect>") get their own keys the same way.
    if (Array.isArray(doc.items)) {
      for (const { _key: itemKey, ...item } of doc.items) {
        for (const { _key: effectKey, ...effect } of item.effects) {
          await db.put(effectKey, { ...effect, _stats: stats });
        }
        item.effects = item.effects.map(e => e._id);
        await db.put(itemKey, { ...item, _stats: stats });
      }
      doc.items = doc.items.map(i => i._id);
    }
    doc._stats = stats;
    await db.put(_key, doc);
    console.log(`${pack}: ${doc.type} "${doc.name}"`);
  }
  await db.compactRange("\x00", "\uffff");
  await db.close();
}
