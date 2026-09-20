// Matrix Verbs (08-hacker.md): the nine universal Wired abilities.
// Heroes receive them via ds.CONFIG.hero.defaultItems (scripts/module.mjs).
// NPCs do not — stamp Wire Kit — Matrix Verbs (B115, scripts/wired-kit.mjs).

export const MODULE_ID = "draw-steel-ghostwire";

/** Ability document ids in Ghostwire Abilities › Matrix Verbs. */
export const MATRIX_VERB_IDS = [
  "GY0GEe2obsavHD4a", // Connect
  "wRvsbMqkVkwKMwj0", // Jack Out
  "ZGGlbzIQqzGIBdG6", // Toggle Connection State
  "srf3OJxnEYVPlcbM", // Scan
  "6sOxYCw5Ff6Es8LF", // Navigate
  "H1xUDnDNhWmAw0Ko", // Ping
  "4gr00JaQt5OrEpDE", // Broadcast
  "n1fEJIA3QoDXxUZS", // Search
  "RM694XnuAyo25XNV", // Read/Write
];

export const MATRIX_VERBS = MATRIX_VERB_IDS.map(id => `Compendium.${MODULE_ID}.abilities.Item.${id}`);

export const MATRIX_VERB_DSIDS = [
  "matrix-connect",
  "matrix-jack-out",
  "matrix-toggle-connection-state",
  "matrix-scan",
  "matrix-navigate",
  "matrix-ping",
  "matrix-broadcast",
  "matrix-search",
  "matrix-read-write",
];

/** Ghostwire Matrix › Support: droppable feature that grants the verbs. */
export const WIRE_KIT_ID = "GwWireKitMxVrb01";
export const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
export const WIRE_KIT_UUID = `Compendium.${MODULE_ID}.matrix.Item.${WIRE_KIT_ID}`;
