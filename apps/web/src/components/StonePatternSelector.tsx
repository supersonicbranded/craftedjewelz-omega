import React, { useState } from "react";

const patterns = [
  { key: "pave", label: "Pavé" },
  { key: "channel", label: "Channel" },
  { key: "prong", label: "Prong" },
  { key: "bead", label: "Bead" },
  { key: "invisible", label: "Invisible" },
  { key: "bar", label: "Bar" },
  { key: "custom", label: "Custom" }
];

export default function StonePatternSelector({ onSelect }: { onSelect?: (pattern: string) => void }) {
  const [selected, setSelected] = useState<string>("");

  return (
    <section className="panel-card stone-pattern-selector">
      <h2>Stone Placement Pattern</h2>
      <div className="pattern-list">
        {patterns.map(p => (
          <button
            key={p.key}
            className={`pattern-btn${selected === p.key ? " active" : ""}`}
            onClick={() => {
              setSelected(p.key);
              onSelect?.(p.key);
            }}
            aria-label={p.label}
          >
            {p.label}
          </button>
        ))}
      </div>
      {selected && <div className="pattern-preview">Selected: <b>{patterns.find(p => p.key === selected)?.label}</b></div>}
    </section>
  );
}
