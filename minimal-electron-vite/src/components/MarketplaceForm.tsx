import React, { useState } from "react";

export default function MarketplaceForm({ onClose }: { onClose: () => void }) {
  const [assetType, setAssetType] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/marketplace/assets?type=${assetType}&search=${encodeURIComponent(search)}`, {
        method: "GET"
      });
      if (!res.ok) throw new Error("Failed to fetch assets");
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
        Asset Type:
        <input type="text" value={assetType} onChange={e => setAssetType(e.target.value)} className="ml-2" placeholder="e.g. plugin, font, model" />
      </label>
      <label>
        Search:
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="ml-2" placeholder="Search assets..." />
      </label>
      <button className="btn" type="submit" disabled={loading}>Search Marketplace</button>
      {error && <div className="text-red-600">{error}</div>}
      {result && <div className="text-green-700">Results: <pre>{JSON.stringify(result, null, 2)}</pre></div>}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
