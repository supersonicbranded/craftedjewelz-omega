import React, { useState } from "react";

export default function Export3DForm({ onClose }: { onClose: () => void }) {
  const [modelId, setModelId] = useState(1);
  const [format, setFormat] = useState("stl");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/cad/export3d/${modelId}?format=${format}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Failed to export 3D model");
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
        Model ID:
        <input type="number" value={modelId} min={1} onChange={e => setModelId(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Format:
        <select value={format} onChange={e => setFormat(e.target.value)} className="ml-2">
          <option value="stl">STL</option>
          <option value="obj">OBJ</option>
          <option value="step">STEP</option>
        </select>
      </label>
      <button className="btn" type="submit" disabled={loading}>Export</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Export result: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
