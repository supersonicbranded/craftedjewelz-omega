import React, { useState } from "react";

export default function DrawingExportForm({ onClose }: { onClose: () => void }) {
  const [format, setFormat] = useState("pdf");
  const [modelId, setModelId] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/drawing/blueprint/${modelId}?format=${format}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Failed to export drawing");
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
          <option value="pdf">PDF</option>
          <option value="svg">SVG</option>
          <option value="dxf">DXF</option>
        </select>
      </label>
      <button className="btn" type="submit" disabled={loading}>Export Drawing</button>
      {loading && <div>Exporting…</div>}
      {error && <div className="text-red-500">{error}</div>}
      {result && (
        <div className="mt-2">
          <h4 className="font-bold">Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
