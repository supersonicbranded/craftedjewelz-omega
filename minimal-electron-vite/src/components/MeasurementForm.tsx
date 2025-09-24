import React, { useState } from "react";

export default function MeasurementForm({ onClose }: { onClose: () => void }) {
  const [fingerSize, setFingerSize] = useState(6.0);
  const [chainLength, setChainLength] = useState(18);
  const [stoneSpacing, setStoneSpacing] = useState(1.5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/cad/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finger_size: fingerSize, chain_length: chainLength, stone_spacing: stoneSpacing })
      });
      if (!res.ok) throw new Error("Failed to calculate measurements");
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
        Finger Size:
        <input type="number" step="0.1" value={fingerSize} min={1} max={15} onChange={e => setFingerSize(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Chain Length (inches):
        <input type="number" value={chainLength} min={10} max={30} onChange={e => setChainLength(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Stone Spacing (mm):
        <input type="number" step="0.1" value={stoneSpacing} min={0.5} max={10} onChange={e => setStoneSpacing(Number(e.target.value))} className="ml-2" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Calculate</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Result: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
