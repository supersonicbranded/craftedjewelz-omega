// Sample Plugin: Layer Manager
module.exports = {
  name: "LayerManager",
  description: "A sample plugin to add, remove, and rename layers in the design.",
  category: "Modeling",
  run(ctx) {
    ctx.addLayer("New Layer");
    ctx.renameLayer("New Layer", "Renamed Layer");
    ctx.removeLayer("Renamed Layer");
    ctx.notify("Layer operations completed.");
  }
};
