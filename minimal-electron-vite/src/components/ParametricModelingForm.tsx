import React, { useState } from "react";

export default function ParametricModelingForm({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState("circle");
  const [length, setLength] = useState(100);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/geometry/sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, length })
      });
      if (!res.ok) throw new Error("Failed to generate geometry");
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
        Profile Shape:
        <select value={profile} onChange={e => setProfile(e.target.value)} className="ml-2">
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      <label>
        Length (mm):
        <input type="number" value={length} min={1} max={500} onChange={e => setLength(Number(e.target.value))} className="ml-2" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Generate Geometry</button>
      {loading && <div>Generating…</div>}
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
