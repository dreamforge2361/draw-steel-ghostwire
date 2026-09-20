// Matrix Verbs (08-hacker.md): the nine universal Wired abilities.
// B117: all nine fire from the node-facing applet (and the Director Console strip).
// Nothing on the hero sheet, pregens, defaultItems, or NPC Wire Kit stamp — no dual homes.

export const MODULE_ID = "draw-steel-ghostwire";

const uuid = id => `Compendium.${MODULE_ID}.abilities.Item.${id}`;

/** Ability document ids in Ghostwire Abilities › Matrix Verbs. Display order = applet strip. */
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

/** @deprecated empty — B117 applet-only; kept so older imports do not throw. */
export const SHEET_VERB_IDS = [];

/** Applet strip ids (all nine). */
export const CONSOLE_SLICE_VERB_IDS = [...MATRIX_VERB_IDS];

export const LATER_CONSOLE_VERB_IDS = [];

export const MATRIX_VERBS = MATRIX_VERB_IDS.map(uuid);
export const SHEET_VERBS = [];
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

export const SHEET_VERB_DSIDS = [];

export const CONSOLE_SLICE_DSIDS = [...MATRIX_VERB_DSIDS];

/** Every Matrix Verb leaves the sheet. */
export const OFF_SHEET_DSIDS = [...MATRIX_VERB_DSIDS];

export const CONNECTION_VERB_DSIDS = [
  "matrix-connect",
  "matrix-jack-out",
  "matrix-toggle-connection-state",
];

export const verbUuid = id => uuid(id);

export const isSheetVerb = dsid => false;
export const isOffSheetVerb = dsid => OFF_SHEET_DSIDS.includes(dsid);
export const isConnectionVerb = dsid => CONNECTION_VERB_DSIDS.includes(dsid);

/** Ghostwire Matrix › Support: droppable feature that marks an NPC as Wire-capable. Does not stamp abilities. */
export const WIRE_KIT_ID = "GwWireKitMxVrb01";
export const WIRE_KIT_DSID = "wire-kit-matrix-verbs";
export const WIRE_KIT_UUID = `Compendium.${MODULE_ID}.matrix.Item.${WIRE_KIT_ID}`;
