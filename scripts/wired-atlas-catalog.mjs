// Wire Atlas token catalog (B116).
// Michael Relay / Host / Segment art ships under assets/tokens/wired/.
// Do not invent styles beyond Relay / Host / Segment. Do not regenerate art.
//
// Device library + NODE_TOKEN_LIBRARY live in scripts/wired-node-art.mjs (shipped 0.3.49 / PR #34).
// This module is atlas-only constants for smoke; not imported from module.mjs.

export const NODE_TOKEN_ART_BASE = "modules/draw-steel-ghostwire/assets/tokens/wired";

/** v1 atlas styles. Endpoint (node-endpoint) is optional v1.1 — omit until art exists. */
export const ATLAS_TOKEN_LIBRARY = [
  {
    id: "node-relay",
    name: "Relay",
    file: "node-relay.webp",
    png: "node-relay.png",
    family: "atlas",
    altitude: "region",
    placeholder: false,
  },
  {
    id: "node-host",
    name: "Host",
    file: "node-host.webp",
    png: "node-host.png",
    family: "atlas",
    altitude: "region",
    placeholder: false,
  },
  {
    id: "node-segment",
    name: "Segment",
    file: "node-segment.webp",
    png: "node-segment.png",
    family: "atlas",
    altitude: "site",
    placeholder: false,
  },
];

export function atlasTokenSrc(id) {
  const style = ATLAS_TOKEN_LIBRARY.find(row => row.id === id);
  if (!style || style.placeholder) return null;
  return `${NODE_TOKEN_ART_BASE}/${style.file}`;
}
