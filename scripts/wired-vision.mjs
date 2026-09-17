// Wired vision tints (B23c, docs/spikes/B23c-WIRED-VISION-TINTS.md): Overlay and Jacked In change how a hero's token sees.
// - Two Foundry vision modes: ghostwireOverlay (readable cyan/pink HUD wash) and ghostwireJackedIn (dark, desaturated meatspace
//   with neon lights punching through). Palette: docs/rulebook/ART-STYLE.md (hot pink / magenta, electric cyan).
// - Client-side only: the token's vision source uses the Wired mode while its actor has the status; the Token document's own
//   sight.visionMode is never written, so clearing the status restores the token's configured vision exactly.
// - Foundry applies a vision mode on the client looking through that token (its owners, or a GM controlling it) and only on
//   Scenes with Token Vision enabled and tokens with vision. Everyone else's view is unchanged.

const { VisionMode } = foundry.canvas.perception;
const { ColorAdjustmentsSamplerShader } = foundry.canvas.rendering.shaders;

const MODES = {
  overlay: "ghostwireOverlay",
  jackedIn: "ghostwireJackedIn",
};

function registerVisionModes() {
  CONFIG.Canvas.visionModes[MODES.overlay] = new VisionMode({
    id: MODES.overlay,
    label: "GHOSTWIRE.Wired.Vision.overlay",
    tokenConfig: false,
    // Whole canvas: a touch more contrast and colour, so the street stays readable under the HUD.
    canvas: {
      shader: ColorAdjustmentsSamplerShader,
      uniforms: { contrast: 0.1, saturation: 0.25, exposure: 0 },
    },
    // Lit areas take a cyan wash; light colour picks up magenta.
    lighting: {
      background: { postProcessingModes: ["SATURATION", "CONTRAST"], uniforms: { saturation: 0.2, contrast: 0.1, tint: [0.78, 0.96, 1] } },
      illumination: { postProcessingModes: ["SATURATION"], uniforms: { saturation: 0.2 } },
      coloration: { postProcessingModes: ["SATURATION"], uniforms: { saturation: 0.35, tint: [1, 0.72, 0.95] } },
    },
    // Not adaptive: the wash applies in daylight too, not only where the scene is dark.
    vision: {
      darkness: { adaptive: false },
      defaults: { attenuation: 0, contrast: 0.1, saturation: 0.2, brightness: 0 },
    },
  });

  CONFIG.Canvas.visionModes[MODES.jackedIn] = new VisionMode({
    id: MODES.jackedIn,
    label: "GHOSTWIRE.Wired.Vision.jackedIn",
    tokenConfig: false,
    // Whole canvas: meatspace drops into deep, desaturated shadow — a ghost of the physical world.
    canvas: {
      shader: ColorAdjustmentsSamplerShader,
      uniforms: { contrast: 0.35, saturation: -0.85, exposure: -0.55 },
    },
    // Lit areas go cold and dim; coloured light (neon signage, node glow) stays bright and pushes toward magenta.
    lighting: {
      background: { postProcessingModes: ["SATURATION", "EXPOSURE", "CONTRAST"], uniforms: { saturation: -0.9, exposure: -0.6, contrast: 0.3, tint: [0.55, 0.85, 1] } },
      illumination: { postProcessingModes: ["SATURATION", "EXPOSURE"], uniforms: { saturation: -0.8, exposure: -0.4 } },
      coloration: { postProcessingModes: ["SATURATION", "EXPOSURE"], uniforms: { saturation: 0.6, exposure: 0.4, tint: [1, 0.45, 0.9] } },
    },
    vision: {
      darkness: { adaptive: false },
      defaults: { attenuation: 0, contrast: 0.35, saturation: -0.85, brightness: -0.3 },
    },
  });
}

/**
 * Register the Wired vision modes and the vision source override. Call during init.
 * @param {{ statusIds: { overlay: string, jackedIn: string } }} options   The Wired connection status ids.
 */
export function registerWiredVision({ statusIds }) {
  registerVisionModes();

  const wiredMode = actor => {
    if (actor?.statuses?.has(statusIds.jackedIn)) return MODES.jackedIn;
    if (actor?.statuses?.has(statusIds.overlay)) return MODES.overlay;
    return null;
  };

  // Patch the Token class once the system has set it (Draw Steel may subclass Token during its own init).
  Hooks.once("setup", () => {
    const Token = CONFIG.Token.objectClass;
    const getVisionSourceData = Token.prototype._getVisionSourceData;
    if (typeof getVisionSourceData !== "function") {
      console.warn("draw-steel-ghostwire | Token#_getVisionSourceData not found; Wired vision tints are disabled");
      return;
    }
    Token.prototype._getVisionSourceData = function() {
      const data = getVisionSourceData.call(this);
      const mode = wiredMode(this.actor);
      if (mode) data.visionMode = mode;
      return data;
    };
  });

  // A Wired status appearing, clearing, or being toggled re-initializes that actor's token vision on every client.
  const isWiredEffect = effect => [statusIds.overlay, statusIds.jackedIn].some(id => effect.statuses?.has(id));
  const refresh = effect => {
    const actor = effect.parent;
    if (!canvas?.ready || !(actor instanceof Actor) || !isWiredEffect(effect)) return;
    const tokens = actor.getActiveTokens();
    if (!tokens.length) return;
    for (const token of tokens) token.initializeVisionSource();
    canvas.perception.update({ initializeVision: true, refreshLighting: true, refreshVision: true });
  };
  Hooks.on("createActiveEffect", refresh);
  Hooks.on("deleteActiveEffect", refresh);
  Hooks.on("updateActiveEffect", refresh);
}
