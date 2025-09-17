// Sample Plugin: Export SVG
module.exports = {
  name: "ExportSVG",
  description: "A sample plugin that exports the current design as SVG.",
  category: "Modeling",
  run(ctx) {
    const svg = ctx.getCurrentSVG();
    ctx.download(svg, "design.svg");
    ctx.notify("SVG exported successfully.");
  }
};
