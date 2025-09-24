import React, { useState, useEffect } from "react";

type User = { name: string; color: string };
type Annotation = { user: string; text: string; time?: string };

export default function CollaborationPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    // Fetch active users from backend
    fetch("/collab/users")
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
    // Fetch annotations from backend
    fetch("/collab/annotations")
      .then(res => res.json())
      .then(data => setAnnotations(data.annotations || []));
  }, []);

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return;
    fetch("/collab/annotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "You", text: newAnnotation })
    })
      .then(res => res.json())
      .then(data => setAnnotations(data.annotations || []));
    setNewAnnotation("");
  };

  const handleShareProject = () => {
    fetch("/collab/share", { method: "POST" })
      .then(res => res.json())
      .then(data => setShareStatus(data.status || "Shared!"));
  };

  return (
    <section className="panel-card collaboration-panel p-4 bg-white border rounded shadow">
      <h2 className="font-bold text-indigo-700 mb-2">Collaboration</h2>
      <div className="mb-2">Active Users:</div>
      <div className="flex gap-2 mb-4">
        {users.map(u => (
          <span key={u.name} style={{ background: u.color }} className="px-3 py-1 rounded text-white text-sm font-semibold">{u.name}</span>
        ))}
      </div>
      <div className="mb-2">Annotations:</div>
      <ul className="mb-2">
        {annotations.map((a, i) => (
          <li key={i} className="text-sm mb-1"><span className="font-semibold text-indigo-600">{a.user}:</span> {a.text} <span className="text-gray-400">({a.time})</span></li>
        ))}
      </ul>
      <div className="flex gap-2 mt-2">
        <input type="text" value={newAnnotation} onChange={e => setNewAnnotation(e.target.value)} placeholder="Add annotation..." className="border rounded px-2 py-1 flex-1" />
        <button className="btn" onClick={handleAddAnnotation}>Add</button>
      </div>
      <div className="mt-4">
        <button className="btn" onClick={handleShareProject}>Share Project</button>
        {shareStatus && <span className="ml-2 text-green-700">{shareStatus}</span>}
      </div>
      <div className="mt-4 text-xs text-gray-500">Project sharing and cloud sync coming soon.</div>
    </section>
  );
}
