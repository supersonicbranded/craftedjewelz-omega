import React from "react";

export default function JewelryCanvasLayerPanel({ layers, activeLayer, onSelectLayer, onAddLayer, onDeleteLayer }: {
  layers: string[];
  activeLayer: string;
  onSelectLayer: (layer: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (layer: string) => void;
}) {
  return (
    <div className="layer-panel bg-white/90 border rounded shadow-sm px-3 py-2 absolute left-4 bottom-4 z-20" style={{ minWidth: 180 }}>
      <div className="font-bold mb-2">Layers</div>
      <ul className="space-y-1">
        {layers.map(layer => (
          <li key={layer}>
            <button
              className={`layer-btn w-full text-left px-2 py-1 rounded${activeLayer === layer ? " bg-indigo-100 font-semibold" : ""}`}
              onClick={() => onSelectLayer(layer)}
            >
              {layer}
            </button>
            {layer !== "Base" && (
              <button className="ml-2 text-xs text-red-500" onClick={() => onDeleteLayer(layer)} title="Delete Layer">✕</button>
            )}
          </li>
        ))}
      </ul>
      <button className="btn mt-2 w-full" onClick={onAddLayer}>+ Add Layer</button>
    </div>
  );
}
