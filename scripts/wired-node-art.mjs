// Node token library (B113 + B116). Drop png+webp and a library.json / NODE_TOKEN_LIBRARY row.
// Auto-nodes: Light → light-control, Maglock → maglock, Cam lights → cam-controls.
// Atlas ids (node-relay / node-host / node-segment) ship Michael art (placeholder: false).
// Megacorp Host skins are node-host-{ticker}; generic node-host stays the default Host.
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
  { id: "node-host-hal", name: "Host — HALO Ascendant (HAL)", file: "node-host-hal.webp", png: "node-host-hal.png", family: "atlas", altitude: "region", hostTicker: "HAL", placeholder: false },
  { id: "node-host-fer", name: "Host — Ferrum Dynastic (FER)", file: "node-host-fer.webp", png: "node-host-fer.png", family: "atlas", altitude: "region", hostTicker: "FER", placeholder: false },
  { id: "node-host-mer", name: "Host — Meridian Signal (MER)", file: "node-host-mer.webp", png: "node-host-mer.png", family: "atlas", altitude: "region", hostTicker: "MER", placeholder: false },
  { id: "node-host-cad", name: "Host — Caduceus Vitalis (CAD)", file: "node-host-cad.webp", png: "node-host-cad.png", family: "atlas", altitude: "region", hostTicker: "CAD", placeholder: false },
  { id: "node-host-irn", name: "Host — Ironclad Martial (IRN)", file: "node-host-irn.webp", png: "node-host-irn.png", family: "atlas", altitude: "region", hostTicker: "IRN", placeholder: false },
  { id: "node-host-arg", name: "Host — Argent Exchange (ARG)", file: "node-host-arg.webp", png: "node-host-arg.png", family: "atlas", altitude: "region", hostTicker: "ARG", placeholder: false },
  { id: "node-host-ver", name: "Host — Verdant Provision (VER)", file: "node-host-ver.webp", png: "node-host-ver.png", family: "atlas", altitude: "region", hostTicker: "VER", placeholder: false },
  { id: "node-host-obs", name: "Host — Obsidian Holdings (OBS)", file: "node-host-obs.webp", png: "node-host-obs.png", family: "atlas", altitude: "region", hostTicker: "OBS", placeholder: false },
  { id: "node-host-san", name: "Host — Sanctum Assurance (SAN)", file: "node-host-san.webp", png: "node-host-san.png", family: "atlas", altitude: "region", hostTicker: "SAN", placeholder: false },
  { id: "node-host-nyx", name: "Host — Nyx Cartel (NYX)", file: "node-host-nyx.webp", png: "node-host-nyx.png", family: "atlas", altitude: "region", hostTicker: "NYX", placeholder: false },
  { id: "node-host-aeq", name: "Host — Aequitas Mandate (AEQ)", file: "node-host-aeq.webp", png: "node-host-aeq.png", family: "atlas", altitude: "region", hostTicker: "AEQ", placeholder: true },
  { id: "node-host-laz", name: "Host — Lazarus Extract (LAZ)", file: "node-host-laz.webp", png: "node-host-laz.png", family: "atlas", altitude: "region", hostTicker: "LAZ", placeholder: true },
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
