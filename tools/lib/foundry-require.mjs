// Resolve Foundry-bundled npm packages (showdown, classic-level) for journal/pack tools.
// Michael’s Windows box uses FOUNDRY_APP. Cloud / CI can `npm install` the same names
// next to this file (tools/node_modules) and skip Foundry.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOOLS = join(HERE, "..");
const ROOT = join(TOOLS, "..");
const FOUNDRY_APP = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";

export function foundryRequire(name) {
  const errors = [];
  const candidates = [
    existsSync(join(FOUNDRY_APP, "package.json")) ? join(FOUNDRY_APP, "package.json") : null,
    join(HERE, "foundry-require.mjs"),
    join(TOOLS, "package.json"),
    join(ROOT, "package.json"),
  ].filter(Boolean);

  for (const from of candidates) {
    try {
      return createRequire(from)(name);
    } catch (err) {
      errors.push(`${from}: ${err.message}`);
    }
  }
  throw new Error(
    `Cannot load "${name}". Set FOUNDRY_APP to a Foundry install, or run \`npm install ${name}\` under tools/.\n${errors.join("\n")}`,
  );
}
