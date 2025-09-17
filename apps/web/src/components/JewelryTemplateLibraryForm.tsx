import React, { useState } from "react";

export default function JewelryTemplateLibraryForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/templates?type=${encodeURIComponent(type)}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Failed to fetch templates");
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
        Template Type:
        <input type="text" value={type} onChange={e => setType(e.target.value)} className="ml-2" placeholder="e.g. ring, bracelet, earring" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Search Templates</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Templates: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
