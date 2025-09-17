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
        
    const [diamondPrices, setDiamondPrices] = useState<any>({});
    const wholesalers = [
    { name: "RapNet", url: "https://www.rapnet.com/diamonds", desc: "Global diamond marketplace, trusted by professionals.", region: "Global", certification: "GIA, IGI" },
    { name: "IDEX Online", url: "https://www.idexonline.com/diamonds", desc: "Transparent pricing, large inventory, competitive rates.", region: "Global", certification: "GIA, HRD" },
    { name: "Blue Nile", url: "https://www.bluenile.com/diamonds", desc: "Retail and wholesale, certified stones, affordable options.", region: "US, Global", certification: "GIA" },
    { name: "Brilliant Earth", url: "https://www.brilliantearth.com/loose-diamonds-search/", desc: "Ethically sourced, premium selection.", region: "US, Global", certification: "GIA" },
    { name: "Whiteflash", url: "https://www.whiteflash.com/loose-diamonds/search/", desc: "Super Ideal diamonds, direct purchase.", region: "US", certification: "AGS, GIA" }
    ];
        
    useEffect(() => {
      // Fetch live market prices for metals/stones
      fetch("/market/prices")
        .then(res => res.json())
        .then(data => setMarketPrices(data.prices || {}));
      // Fetch live diamond prices (stub: replace with real API integration)
      fetch("/market/diamond-prices")
        .then(res => res.json())
        .then(data => setDiamondPrices(data.prices || {}));
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
      {/* Diamond Price Panel */}
      <div className="border rounded p-3 bg-gray-50 mt-2" aria-label="Diamond Price Panel" tabIndex={0} title="Diamond Price Panel">
        <h4 className="font-bold text-indigo-700 mb-1">Diamond Prices (Live)</h4>
        <ul className="list-disc ml-4">
          {Object.entries(diamondPrices).length > 0 ? (
            Object.entries(diamondPrices).map(([shape, price]: [string, any]) => (
              <li key={shape} className="mb-1">{shape}: <span className="font-semibold">{price}</span> per carat</li>
            ))
          ) : (
            <li>Loading diamond prices...</li>
          )}
        </ul>
      </div>
      {/* Wholesaler Links Panel with Filters and Request Quote */}
      <div className="border rounded p-3 bg-white mt-2" aria-label="Diamond Wholesalers" tabIndex={0} title="Diamond Wholesalers">
        <h4 className="font-bold text-yellow-700 mb-1">Top Diamond Wholesalers</h4>
        <div className="flex gap-4 mb-2">
          <label>
            Region:
            <select className="ml-2" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="All">All</option>
              <option value="US">US</option>
              <option value="Global">Global</option>
            </select>
          </label>
          <label>
            Certification:
            <select className="ml-2" id="certification-filter">
              <option value="All">All</option>
              <option value="GIA">GIA</option>
              <option value="IGI">IGI</option>
              <option value="HRD">HRD</option>
              <option value="AGS">AGS</option>
            </select>
          </label>
        </div>
        <ul className="list-disc ml-4">
          {wholesalers
            .filter(w => region === "All" || w.region.includes(region))
            .map(w => (
              <li key={w.name} className="mb-2">
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">{w.name}</a>
                <span className="text-xs text-gray-500 ml-2">{w.desc}</span>
                <span className="text-xs text-gray-400 ml-2">({w.region}, Cert: {w.certification})</span>
                <button className="btn btn-xs ml-2" title="Request Quote" onClick={() => window.open(`mailto:sales@${w.url.replace('https://www.', '').replace('/diamonds', '')}?subject=Diamond%20Quote%20Request`)}>Request Quote</button>
              </li>
            ))}
        </ul>
        <div className="text-xs text-gray-600 mt-2">Compare prices, certifications, and reviews before purchasing. For bulk orders, contact wholesalers directly for best rates.</div>
      </div>
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
