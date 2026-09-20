// Node token library (B113 defaults + B116 drop-in catalog).
// Auto Light/Maglock keep locked filenames. Extra styles: drop png+webp and a library.json row.
// Console picker UI is B116 follow-up — this module only resolves paths.

const MODULE_ID = "draw-steel-ghostwire";

export const NODE_TOKEN_ART_BASE = `modules/${MODULE_ID}/assets/tokens/wired`;

const STYLE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$/;

/** Locked auto-node styles (B113). Ids match AUTO_KIND / library.json. */
export const NODE_TOKEN_LIBRARY = [
  { id: "light-control", name: "Light Control", file: "node-light-control.webp", autoKind: "light-control", locked: true },
  { id: "maglock", name: "Maglock Door", file: "node-maglock.webp", autoKind: "maglock", locked: true },
];

export function nodeTokenSrc(file) {
  const name = String(file ?? "").split("/").pop();
  if (!name) return null;
  const stem = name.replace(/\.webp$/i, "");
  if (!STYLE_ID.test(stem)) return null;
  return `${NODE_TOKEN_ART_BASE}/${stem}.webp`;
}

export function nodeTokenStyle(id) {
  return NODE_TOKEN_LIBRARY.find(style => style.id === id) ?? null;
}

export function tokenSrcForStyle(id) {
  const raw = String(id ?? "").trim();
  if (!raw) return null;
  const known = nodeTokenStyle(raw);
  if (known) return nodeTokenSrc(known.file);
  if (STYLE_ID.test(raw)) return nodeTokenSrc(`${raw}.webp`);
  return null;
}
