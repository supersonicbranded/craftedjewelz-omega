import React, { useState } from "react";

export default function TutorialsForm({ onClose }: { onClose: () => void }) {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/tutorials?topic=${encodeURIComponent(topic)}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Failed to fetch tutorial");
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
        Tutorial Topic:
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="ml-2" placeholder="e.g. parametric modeling" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Search Tutorials</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Tutorial: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
