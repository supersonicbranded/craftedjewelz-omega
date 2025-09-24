import React, { useState, useEffect } from "react";

type Plugin = { name: string; installed: boolean; description: string; category?: string };

export default function PluginMarketplacePanel() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [submission, setSubmission] = useState({ name: "", description: "", category: "General", url: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch plugin list from backend
    fetch("/plugins/list")
      .then(res => res.json())
      .then(data => setPlugins(data.plugins || []));
  }, []);

  const handleInstall = (idx: number) => {
    const plugin = plugins[idx];
    fetch("/plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: plugin.name })
    })
      .then(res => res.json())
      .then(data => setPlugins(data.plugins || plugins.map((p, i) => i === idx ? { ...p, installed: true } : p)));
  };
  const handleUninstall = (idx: number) => {
    const plugin = plugins[idx];
    fetch("/plugins/uninstall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: plugin.name })
    })
      .then(res => res.json())
      .then(data => setPlugins(data.plugins || plugins.map((p, i) => i === idx ? { ...p, installed: false } : p)));
  };

  const categories = ["All", "Modeling", "Rendering", "Manufacturing", "AI", "Marketplace", "General"];
  const filteredPlugins = plugins.filter(p =>
    (category === "All" || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/plugins/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    });
    setSubmitting(false);
    setSubmission({ name: "", description: "", category: "General", url: "" });
    // Optionally refresh plugin list
  };

  return (
    <section className="panel-card plugin-marketplace-panel p-4 bg-white border rounded shadow" aria-label="Plugin Marketplace" tabIndex={0}>
      <h2 className="font-bold text-indigo-700 mb-2">Plugin Marketplace</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-100 border border-indigo-300 rounded px-2 py-1"
          placeholder="Search plugins..."
          aria-label="Search plugins"
          title="Search plugins"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="bg-gray-100 border border-indigo-300 rounded px-2 py-1" aria-label="Filter by category" title="Filter by category">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <a href="https://github.com/craftedjewelz/craftedjewelz-plugin-docs" target="_blank" rel="noopener" className="text-indigo-600 underline text-sm" aria-label="Plugin development documentation" title="Plugin development documentation">Plugin Docs</a>
      </div>
      <ul className="mb-2">
        {filteredPlugins.map((plugin, idx) => (
          <li key={plugin.name} className="mb-3 p-3 border rounded flex justify-between items-center" aria-label={`Plugin: ${plugin.name}`} tabIndex={0} title={plugin.description}>
            <div>
              <div className="font-semibold text-indigo-600">{plugin.name}</div>
              <div className="text-sm text-gray-600">{plugin.description}</div>
              {plugin.category && <div className="text-xs text-indigo-400">Category: {plugin.category}</div>}
            </div>
            <div>
              {plugin.installed ? (
                <button className="btn" onClick={() => handleUninstall(idx)} title="Uninstall plugin" aria-label="Uninstall plugin">Uninstall</button>
              ) : (
                <button className="btn" onClick={() => handleInstall(idx)} title="Install plugin" aria-label="Install plugin">Install</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form className="plugin-submit-form bg-gray-50 border rounded p-4 mt-6" onSubmit={handleSubmission} aria-label="Submit a new plugin" tabIndex={0}>
        <h3 className="font-bold text-indigo-700 mb-2">Submit Your Plugin</h3>
        <div className="mb-2">
          <input type="text" value={submission.name} onChange={e => setSubmission(s => ({ ...s, name: e.target.value }))} className="bg-white border border-indigo-300 rounded px-2 py-1 w-full" placeholder="Plugin Name" aria-label="Plugin Name" required />
        </div>
        <div className="mb-2">
          <textarea value={submission.description} onChange={e => setSubmission(s => ({ ...s, description: e.target.value }))} className="bg-white border border-indigo-300 rounded px-2 py-1 w-full" placeholder="Description" aria-label="Plugin Description" required />
        </div>
        <div className="mb-2">
          <select value={submission.category} onChange={e => setSubmission(s => ({ ...s, category: e.target.value }))} className="bg-white border border-indigo-300 rounded px-2 py-1 w-full" aria-label="Plugin Category">
            {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <input type="url" value={submission.url} onChange={e => setSubmission(s => ({ ...s, url: e.target.value }))} className="bg-white border border-indigo-300 rounded px-2 py-1 w-full" placeholder="Repository or Download URL" aria-label="Plugin URL" required />
        </div>
        <button className="btn bg-indigo-600 text-white font-bold px-4 py-2 rounded shadow hover:bg-indigo-500 transition" type="submit" disabled={submitting} aria-label="Submit plugin" title="Submit plugin">{submitting ? "Submitting..." : "Submit Plugin"}</button>
      </form>
      <div className="mt-4 text-xs text-gray-500">Custom plugin workflows and updates coming soon.</div>
    </section>
  );
}
