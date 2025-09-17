import React, { useState } from "react";

export default function AssemblyForm({ onClose }: { onClose: () => void }) {
  const [parts, setParts] = useState<string>("");
  const [hinges, setHinges] = useState<number>(0);
  const [clasps, setClasps] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/cad/assembly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts: parts.split(","), hinges, clasps })
      });
      if (!res.ok) throw new Error("Failed to process assembly");
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
        Parts (comma separated):
        <input type="text" value={parts} onChange={e => setParts(e.target.value)} className="ml-2" placeholder="e.g. shank, head, gallery" />
      </label>
      <label>
        Hinges:
        <input type="number" value={hinges} min={0} onChange={e => setHinges(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Clasps:
        <input type="number" value={clasps} min={0} onChange={e => setClasps(Number(e.target.value))} className="ml-2" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Process Assembly</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Result: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
