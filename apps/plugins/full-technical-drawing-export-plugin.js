// Full Plugin: Technical Drawing Export
module.exports = {
  name: "TechnicalDrawingExport",
  description: "Exports technical drawings with dimensions, annotations, and manufacturing notes.",
  category: "Manufacturing",
  run(ctx, params) {
    // params: { includeDimensions, includeAnnotations }
    const drawing = ctx.generateTechnicalDrawing(params);
    ctx.download(drawing, "technical-drawing.pdf");
    ctx.notify("Technical drawing exported.");
    return drawing;
  }
};
