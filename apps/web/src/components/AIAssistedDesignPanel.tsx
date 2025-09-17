import React, { useState, useEffect } from "react";

type Suggestion = { type: string; description: string };

export default function AIAssistedDesignPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [output, setOutput] = useState("");

  useEffect(() => {
    // Fetch AI suggestions from backend
    fetch("/ai/suggest")
      .then(res => res.json())
      .then(data => setSuggestions(data.suggestions || []));
  }, []);

  const handleRun = (idx: number) => {
    const suggestion = suggestions[idx];
    fetch("/ai/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: suggestion.type })
    })
      .then(res => res.json())
      .then(data => {
        setOutput(data.output || `AI suggestion '${suggestion.type}' applied. Result: Success.`);
        setSelectedSuggestion(idx);
      });
  };

  return (
    <section className="panel-card ai-assisted-design-panel p-4 bg-white border rounded shadow">
      <h2 className="font-bold text-indigo-700 mb-2">AI-Assisted Design</h2>
      <ul className="mb-2">
        {suggestions.map((s, idx) => (
          <li key={s.type} className="mb-3 p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold text-indigo-600">{s.type}</div>
              <div className="text-sm text-gray-600">{s.description}</div>
            </div>
            <button className="btn" onClick={() => handleRun(idx)}>Apply</button>
          </li>
        ))}
      </ul>
      {selectedSuggestion !== null && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <div className="font-semibold text-indigo-600">Output</div>
          <div className="text-sm text-gray-700">{output}</div>
        </div>
      )}
      <div className="mt-4 text-xs text-gray-500">Generative AI, auto-layout, and error correction coming soon.</div>
    </section>
  );
}
