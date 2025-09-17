import React, { useState } from "react";

export default function CloudRenderForm({ onClose }: { onClose: () => void }) {
  const [modelId, setModelId] = useState(1);
  const [team, setTeam] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/cloud/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: modelId, team })
      });
      if (!res.ok) throw new Error("Failed to start cloud render");
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
        Team (optional):
        <input type="text" value={team} onChange={e => setTeam(e.target.value)} className="ml-2" placeholder="Team name or email" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Start Cloud Render</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Cloud render started: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
