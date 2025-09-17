import React, { useState, useEffect } from "react";

export default function PricingForm({ onClose }: { onClose: () => void }) {
  const [materials, setMaterials] = useState("");
  const [labor, setLabor] = useState(0);
  const [stones, setStones] = useState("");
  const [region, setRegion] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [markup, setMarkup] = useState(2.0);
  const [tax, setTax] = useState(0.0);
  const [shipping, setShipping] = useState(0.0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [marketPrices, setMarketPrices] = useState<any>({});
  const [aiPrice, setAiPrice] = useState<string>("");

  useEffect(() => {
    // Fetch live market prices for metals/stones
    fetch("/market/prices")
      .then(res => res.json())
      .then(data => setMarketPrices(data.prices || {}));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/cad/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materials: materials.split(","),
          labor,
          stones: stones.split(","),
          region,
          currency,
          markup,
          tax,
          shipping
        })
      });
      if (!res.ok) throw new Error("Failed to calculate pricing");
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  };

  const handleAISuggest = async () => {
    setLoading(true);
    setAiPrice("");
    try {
      const res = await fetch("/ai/price-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materials: materials.split(","),
          stones: stones.split(","),
          region,
          currency
        })
      });
      if (!res.ok) throw new Error("Failed to get AI price suggestion");
      const data = await res.json();
      setAiPrice(data.suggested_price);
    } catch (err: any) {
      setAiPrice("Error: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label>
        Materials (comma separated):
        <input type="text" value={materials} onChange={e => setMaterials(e.target.value)} className="ml-2" placeholder="e.g. gold, platinum" />
        {materials && <span className="ml-2 text-xs text-gray-500">Live price: {marketPrices[materials.split(",")[0]?.trim()] || "-"}</span>}
      </label>
      <label>
        Labor (hours):
        <input type="number" value={labor} min={0} onChange={e => setLabor(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Stones (comma separated):
        <input type="text" value={stones} onChange={e => setStones(e.target.value)} className="ml-2" placeholder="e.g. diamond, ruby" />
        {stones && <span className="ml-2 text-xs text-gray-500">Live price: {marketPrices[stones.split(",")[0]?.trim()] || "-"}</span>}
      </label>
      <label>
        Region:
        <select value={region} onChange={e => setRegion(e.target.value)} className="ml-2">
          <option value="US">US</option>
          <option value="EU">EU</option>
          <option value="Asia">Asia</option>
        </select>
      </label>
      <label>
        Currency:
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="ml-2">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
        </select>
      </label>
      <label>
        Markup (x):
        <input type="number" value={markup} min={1} step={0.01} onChange={e => setMarkup(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Tax (%):
        <input type="number" value={tax} min={0} step={0.01} onChange={e => setTax(Number(e.target.value))} className="ml-2" />
      </label>
      <label>
        Shipping:
        <input type="number" value={shipping} min={0} step={0.01} onChange={e => setShipping(Number(e.target.value))} className="ml-2" />
      </label>
      <button className="btn" type="submit" disabled={loading}>Calculate Pricing</button>
      <button className="btn" type="button" onClick={handleAISuggest} disabled={loading}>AI Price Suggestion</button>
      {aiPrice && <div className="text-blue-700">AI Suggested Price: {aiPrice}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <div className="text-green-700">
          <strong>Pricing result:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          {/* Visual breakdown chart (simple bar) */}
          <div className="mt-2">
            <div className="font-bold">Breakdown:</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ background: '#FFD700', width: `${result.material_cost || 20}px`, height: 16 }} title="Material Cost" />
              <div style={{ background: '#38bdf8', width: `${result.labor_cost || 20}px`, height: 16 }} title="Labor Cost" />
              <div style={{ background: '#6366f1', width: `${result.stone_cost || 20}px`, height: 16 }} title="Stone Cost" />
              <div style={{ background: '#22c55e', width: `${result.tax || 10}px`, height: 16 }} title="Tax" />
              <div style={{ background: '#f59e42', width: `${result.shipping || 10}px`, height: 16 }} title="Shipping" />
              <div style={{ background: '#181818', width: `${result.margin || 30}px`, height: 16, color: '#FFD700' }} title="Margin" />
            </div>
          </div>
        </div>
      )}
      <button className="btn mt-2" type="button" onClick={onClose}>Close</button>
    </form>
  );
}
