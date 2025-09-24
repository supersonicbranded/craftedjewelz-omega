import React from "react";

const tools = [
  { key: "select", label: "Select" },
  { key: "pen", label: "Pen" },
  { key: "rect", label: "Rectangle" },
  { key: "ellipse", label: "Ellipse" },
  { key: "line", label: "Line" },
  { key: "text", label: "Text" },
  { key: "layer", label: "Layer" },
  { key: "import", label: "Import SVG" },
];

export default function JewelryCanvasToolbar({ activeTool, onToolChange }: { activeTool: string; onToolChange: (tool: string) => void }) {
  return (
    <div className="canvas-toolbar flex gap-2 px-2 py-1 bg-white/90 border-b rounded-t shadow-sm absolute top-0 left-0 z-10">
      {tools.map(tool => (
        <button
          key={tool.key}
          className={`toolbar-btn${activeTool === tool.key ? " active" : ""}`}
          onClick={() => onToolChange(tool.key)}
          aria-label={tool.label}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
