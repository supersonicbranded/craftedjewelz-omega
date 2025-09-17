import React, { useRef, useState } from "react";

export default function ImageTracePanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [svgResult, setSvgResult] = useState<string>("");
  const [geometry, setGeometry] = useState<any>(null);
  const [show3D, setShow3D] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSvgResult("");
    setGeometry(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/tools/image-trace", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.svg) setSvgResult(data.svg);
      if (data.geometry) setGeometry(data.geometry);
      setLoading(false);
    } catch (err) {
      setError("Failed to process image.");
      setLoading(false);
    }
  };

  return (
    <section className="panel-card image-trace-panel">
      <h2>Image Trace & Photo-to-3D</h2>
      <p>Upload a photo or 2D design. Instantly extract vector paths and convert to 3D geometry.</p>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ marginBottom: 12 }}
      />
      {loading && <div>Processing…</div>}
      {error && <div style={{ color: "#e53e3e" }}>{error}</div>}
      {preview && (
        <div style={{ margin: "16px 0" }}>
          <img src={preview} alt="Preview" style={{ maxWidth: 220, borderRadius: 8, boxShadow: "0 2px 12px #0002" }} />
        </div>
      )}
      {svgResult && (
        <div style={{ margin: "16px 0" }}>
          <h3>Extracted SVG:</h3>
          <div dangerouslySetInnerHTML={{ __html: svgResult }} />
        </div>
      )}
      {geometry && !show3D && (
        <div style={{ margin: "16px 0" }}>
          <h3>3D Geometry (Stub):</h3>
          <pre style={{ background: "#18181c", padding: 10, borderRadius: 6 }}>{JSON.stringify(geometry, null, 2)}</pre>
          <button className="btn mt-2" onClick={() => setShow3D(true)}>Preview in 3D Viewport</button>
        </div>
      )}
      {geometry && show3D && (
        <React.Suspense fallback={<div>Loading 3D preview…</div>}>
          {React.createElement(React.lazy(() => import("./GeometryViewport3D")), { geometry })}
        </React.Suspense>
      )}
    </section>
  );
}
