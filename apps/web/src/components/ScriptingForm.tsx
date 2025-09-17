import React, { useState } from "react";

export default function ScriptingForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("python");
  const [params, setParams] = useState({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptId, setScriptId] = useState<number|null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/scripting/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, type, params })
      });
      if (!res.ok) throw new Error("Failed to save script");
      const data = await res.json();
      setScriptId(data.id);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  const handleRun = async () => {
    if (!scriptId) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/scripting/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script_id: scriptId, params })
      });
      if (!res.ok) throw new Error("Failed to run script");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSave}>
      <label>
        Script Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="ml-2" />
      </label>
      <label>
        Script Type:
        <select value={type} onChange={e => setType(e.target.value)} className="ml-2">
          <option value="python">Python</option>
          <option value="cadquery">CadQuery</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      <label>
        Script Code:
        <textarea value={code} onChange={e => setCode(e.target.value)} className="ml-2" rows={8} style={{ fontFamily: "monospace" }} />
      </label>
      <label>
        Params (JSON):
        <textarea value={JSON.stringify(params)} onChange={e => {
          try {
            setParams(JSON.parse(e.target.value));
          } catch {
            setParams({});
          }
        }} className="ml-2" rows={3} />
      </label>
      <button className="btn" type="submit" disabled={loading || !name || !code}>Save Script</button>
      {scriptId && <button className="btn" type="button" onClick={handleRun} disabled={loading}>Run Script</button>}
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Result: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}