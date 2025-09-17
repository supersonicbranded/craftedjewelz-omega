import React, { useState } from "react";
import StonePatternSelector from "./StonePatternSelector";

export default function StonePatternForm({ onClose }: { onClose: () => void }) {
  const [jewelryType, setJewelryType] = useState("");
  const [cadModelId, setCadModelId] = useState(1);
  const [pattern, setPattern] = useState("");
  const [params, setParams] = useState({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/cad/stone-patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jewelry_type: jewelryType,
          cad_model_id: cadModelId,
          pattern,
          params
        })
      });
      if (!res.ok) throw new Error("Failed to create stone pattern");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label>
        Jewelry Type:
        <input type="text" value={jewelryType} onChange={e => setJewelryType(e.target.value)} className="ml-2" placeholder="e.g. ring, earring" />
      </label>
      <label>
        CAD Model ID:
        <input type="number" value={cadModelId} min={1} onChange={e => setCadModelId(Number(e.target.value))} className="ml-2" />
      </label>
      <StonePatternSelector onSelect={setPattern} />
      <label>
        Pattern Params (JSON):
        <textarea value={JSON.stringify(params)} onChange={e => {
          try {
            setParams(JSON.parse(e.target.value));
          } catch {
            setParams({});
          }
        }} className="ml-2" rows={3} />
      </label>
      <button className="btn" type="submit" disabled={loading || !pattern || !jewelryType}>Create Pattern</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Pattern created: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}