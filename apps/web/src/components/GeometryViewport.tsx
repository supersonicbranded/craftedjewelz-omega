import React, { useRef, useEffect } from "react";

export default function GeometryViewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Stub: Integrate Three.js or similar for 3D rendering
    // Example: window.THREE && new window.THREE.WebGLRenderer({ canvas: canvasRef.current })
  }, []);

  return (
    <section className="panel-card geometry-viewport">
      <h2>3D Geometry Viewport</h2>
      <canvas ref={canvasRef} width={600} height={400} style={{ width: "100%", borderRadius: 12, background: "#222" }} />
      <div className="viewport-note">Interactive 3D preview (Three.js integration recommended)</div>
    </section>
  );
}
