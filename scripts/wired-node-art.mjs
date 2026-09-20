// Node token library (B113 + B116). Drop png+webp and a library.json / NODE_TOKEN_LIBRARY row.
// Auto-nodes: Light → light-control, Maglock → maglock, Cam lights → cam-controls.
// Atlas ids (node-relay / node-host / node-segment) ship Michael art (placeholder: false).
// tokenSrcForStyle returns the WebP path. Do not regenerate AI art.
// Director picker writes board tokenStyle; Place on canvas stamps the matching WebP.

const MODULE_ID = "draw-steel-ghostwire";

export const NODE_TOKEN_ART_BASE = `modules/${MODULE_ID}/assets/tokens/wired`;

const STYLE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,62}$/;

/** Full Director catalog. `autoKind` marks Scene auto-node defaults. */
export const NODE_TOKEN_LIBRARY = [
  { id: "light-control", name: "Light Control", file: "node-light-control.webp", png: "node-light-control.png", autoKind: "light-control" },
  { id: "maglock", name: "Maglock Door", file: "node-maglock.webp", png: "node-maglock.png", autoKind: "maglock" },
  { id: "black-ice", name: "Black ICE", file: "node-black-ice.webp", png: "node-black-ice.png" },
  { id: "normal-ice", name: "Normal ICE", file: "node-normal-ice.webp", png: "node-normal-ice.png" },
  { id: "mechanical", name: "Mechanical interface", file: "node-mechanical.webp", png: "node-mechanical.png" },
  { id: "turret-controls", name: "Turret Controls", file: "node-turret-controls.webp", png: "node-turret-controls.png" },
  { id: "cam-controls", name: "Cam Controls", file: "node-cam-controls.webp", png: "node-cam-controls.png", autoKind: "cam-controls" },
  { id: "data-vault", name: "Data Vault", file: "node-data-vault.webp", png: "node-data-vault.png" },
  { id: "node-relay", name: "Relay", file: "node-relay.webp", png: "node-relay.png", family: "atlas", altitude: "region", placeholder: false },
  { id: "node-host", name: "Host", file: "node-host.webp", png: "node-host.png", family: "atlas", altitude: "region", placeholder: false },
  { id: "node-segment", name: "Segment", file: "node-segment.webp", png: "node-segment.png", family: "atlas", altitude: "site", placeholder: false },
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
  if (known?.placeholder) return null;
  if (known) return nodeTokenSrc(known.file);
  if (STYLE_ID.test(raw)) return nodeTokenSrc(`${raw}.webp`);
  return null;
}
