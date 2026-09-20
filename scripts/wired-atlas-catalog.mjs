// Wire Atlas token catalog stubs (B116).
// Art is not generated this pass. Drop png+webp at the paths below, then flip
// library.json placeholder flags. Do not invent styles beyond Relay / Host / Segment.
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
    placeholder: true,
  },
  {
    id: "node-host",
    name: "Host",
    file: "node-host.webp",
    png: "node-host.png",
    family: "atlas",
    altitude: "region",
    placeholder: true,
  },
  {
    id: "node-segment",
    name: "Segment",
    file: "node-segment.webp",
    png: "node-segment.png",
    family: "atlas",
    altitude: "site",
    placeholder: true,
  },
];

export function atlasTokenSrc(id) {
  const style = ATLAS_TOKEN_LIBRARY.find(row => row.id === id);
  if (!style || style.placeholder) return null;
  return `${NODE_TOKEN_ART_BASE}/${style.file}`;
}
