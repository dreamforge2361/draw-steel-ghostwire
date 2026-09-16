const MODULE_ID = "draw-steel-ghostwire";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Draw Steel - Ghostwire Build initialized`);
  document.body.classList.add("ghostwire", "ghostwire-theme");
});
