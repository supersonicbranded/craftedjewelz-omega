import React, { useState } from "react";

export default function ProjectManagementForm({ onClose }: { onClose: () => void }) {
  const [projectName, setProjectName] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [version, setVersion] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/cad/projectmgmt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, client_notes: clientNotes, version })
      });
      if (!res.ok) throw new Error("Failed to save project info");
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
        Project Name:
        <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="ml-2" />
      </label>
      <label>
        Client Notes:
        <textarea value={clientNotes} onChange={e => setClientNotes(e.target.value)} className="ml-2" rows={3} />
      </label>
      <label>
        Version:
        <input type="number" value={version} min={1} onChange={e => setVersion(Number(e.target.value))} className="ml-2" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Save Project Info</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Project info saved: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
