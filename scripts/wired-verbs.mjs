// Matrix Verbs (08-hacker.md): the nine universal Wired abilities.
// B117: Connect / Jack Out / Toggle stay on the sheet (hero defaultItems + NPC Wire Kit).
// Scan / Ping / Navigate fire from the Wired Console. Broadcast / Search / Read-Write follow later.
// NPCs do not receive sheet verbs until the Director stamps Wire Kit (B115, scripts/wired-kit.mjs).

export const MODULE_ID = "draw-steel-ghostwire";

const uuid = id => `Compendium.${MODULE_ID}.abilities.Item.${id}`;

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

export const SHEET_VERB_IDS = [
  "GY0GEe2obsavHD4a", // Connect
  "wRvsbMqkVkwKMwj0", // Jack Out
  "ZGGlbzIQqzGIBdG6", // Toggle Connection State
];

export const CONSOLE_SLICE_VERB_IDS = [
  "srf3OJxnEYVPlcbM", // Scan
  "H1xUDnDNhWmAw0Ko", // Ping
  "6sOxYCw5Ff6Es8LF", // Navigate
];

export const LATER_CONSOLE_VERB_IDS = [
  "4gr00JaQt5OrEpDE", // Broadcast
  "n1fEJIA3QoDXxUZS", // Search
  "RM694XnuAyo25XNV", // Read/Write
];

export const MATRIX_VERBS = MATRIX_VERB_IDS.map(uuid);
export const SHEET_VERBS = SHEET_VERB_IDS.map(uuid);
export const CONSOLE_SLICE_VERBS = CONSOLE_SLICE_VERB_IDS.map(uuid);

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

export const SHEET_VERB_DSIDS = [
  "matrix-connect",
  "matrix-jack-out",
  "matrix-toggle-connection-state",
];

export const CONSOLE_SLICE_DSIDS = [
  "matrix-scan",
  "matrix-ping",
  "matrix-navigate",
];

/** Verbs that leave the sheet once the Console path works (thin slice + later). */
export const OFF_SHEET_DSIDS = [
  "matrix-scan",
  "matrix-navigate",
  "matrix-ping",
  "matrix-broadcast",
  "matrix-search",
  "matrix-read-write",
];

export const verbUuid = id => uuid(id);

export const isSheetVerb = dsid => SHEET_VERB_DSIDS.includes(dsid);
export const isOffSheetVerb = dsid => OFF_SHEET_DSIDS.includes(dsid);

/** Ghostwire Matrix › Support: droppable feature that grants the sheet verbs. */
export const WIRE_KIT_ID = "GwWireKitMxVrb01";
export const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
export const WIRE_KIT_UUID = `Compendium.${MODULE_ID}.matrix.Item.${WIRE_KIT_ID}`;
