import React, { useRef, useEffect, useState } from "react";
// @ts-ignore
import * as THREE from "three";

function verifyManufacturing(mesh: any, stones: any[], setManufacturingReport: any) {
  // Call backend for manufacturability
  fetch("/cad/production-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model_id: mesh?.id || 1, options: { stones } })
  })
    .then(res => res.json())
    .then(data => setManufacturingReport(data));
}

function exportTechnicalDrawing(mesh: any, stones: any[], format: "pdf" | "dxf" = "pdf", setExportUrl: any) {
  // Call backend for technical drawing export
  fetch("/geometry/sweep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: [], profile: {}, params: { format } })
  })
    .then(res => res.json())
    .then(data => setExportUrl(data.stl_url || data.status));
}

export default function GeometryViewport3D({ geometry, onClose }: { geometry?: any; onClose?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mesh, setMesh] = useState<any>(null);
  const [scene, setScene] = useState<any>(null);
  const [camera, setCamera] = useState<any>(null);
  const [renderer, setRenderer] = useState<any>(null);
  const [stones, setStones] = useState<any[]>([]);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [manufacturingReport, setManufacturingReport] = useState<any>(null);
  const [exportUrl, setExportUrl] = useState<string>("");

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(600, 400);
    setRenderer(renderer);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    setScene(scene);
    const camera = new THREE.PerspectiveCamera(45, 600 / 400, 0.1, 1000);
    camera.position.set(0, 0, 100);
    setCamera(camera);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 100);
    scene.add(light);
    let mesh;
    if (geometry && geometry.type === "sphere") {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(geometry.radius || 30, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x8fd3f4, metalness: 0.7, roughness: 0.3 })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40),
        new THREE.MeshStandardMaterial({ color: 0xf59e42, metalness: 0.5, roughness: 0.5 })
      );
    }
    scene.add(mesh);
    setMesh(mesh);
    renderer.render(scene, camera);
    return () => {
      renderer.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    if (!renderer || !scene || !camera || !mesh) return;
    mesh.rotation.y = rotation;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    // Remove previous stones
    scene.children = scene.children.filter((obj: any) => !obj.isStone);
    // Add stones
    stones.forEach(stone => {
      const stoneMesh = new THREE.Mesh(
        new THREE.SphereGeometry(stone.size, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 })
      );
      stoneMesh.position.set(stone.x, stone.y, stone.z);
      stoneMesh.isStone = true;
      scene.add(stoneMesh);
    });
    renderer.render(scene, camera);
  }, [rotation, zoom, stones, renderer, scene, camera, mesh]);

  useEffect(() => {
    if (mesh) {
      verifyManufacturing(mesh, stones, setManufacturingReport);
    }
  }, [mesh, stones]);

  const handleRotate = (dir: number) => setRotation(r => r + dir * 0.2);
  const handleZoom = (factor: number) => setZoom(z => Math.max(0.2, Math.min(2, z * factor)));
  const handleAddStone = () => {
    setStones(prev => [...prev, { x: 0, y: 0, z: geometry?.radius || 30, size: 2 }]);
  };
  const handleExport = (format: "pdf" | "dxf") => {
    exportTechnicalDrawing(mesh, stones, format, setExportUrl);
  };

  return (
    <section className="panel-card geometry-viewport">
      <h2>3D Geometry Viewport</h2>
      <canvas ref={canvasRef} width={600} height={400} style={{ borderRadius: 8, border: "1px solid #444" }} />
      <div className="flex gap-2 mt-2">
        <button className="btn" onClick={() => handleRotate(-1)}>Rotate Left</button>
        <button className="btn" onClick={() => handleRotate(1)}>Rotate Right</button>
        <button className="btn" onClick={() => handleZoom(1.2)}>Zoom In</button>
        <button className="btn" onClick={() => handleZoom(0.8)}>Zoom Out</button>
        <button className="btn" onClick={handleAddStone}>Add Stone</button>
        {onClose && <button className="btn" type="button" onClick={onClose}>Close</button>}
      </div>
      <div className="mt-4 p-3 border rounded bg-gray-50">
        <h4 className="font-semibold text-indigo-600 mb-1">Manufacturing Checks</h4>
        {manufacturingReport && (
          <div>
            <div>Wall Thickness: {manufacturingReport.issues?.includes("Minimum wall thickness not met") ? <span className="text-red-600">Too thin</span> : <span className="text-green-700">OK</span>}</div>
            <div>Prong Strength: {manufacturingReport.issues?.includes("Stone seat overlap detected") ? <span className="text-red-600">Weak</span> : <span className="text-green-700">OK</span>}</div>
            <div>Manufacturable: {manufacturingReport.manufacturable ? <span className="text-green-700">Yes</span> : <span className="text-red-600">No</span>}</div>
            {manufacturingReport.issues?.length > 0 && (
              <div className="text-yellow-700">Issues: {manufacturingReport.issues.join(", ")}</div>
            )}
            {manufacturingReport.report_url && (
              <div className="mt-2"><a href={manufacturingReport.report_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Download PDF Report</a></div>
            )}
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="btn" onClick={() => handleExport("pdf")}>Export PDF</button>
        <button className="btn" onClick={() => handleExport("dxf")}>Export DXF</button>
        {exportUrl && (
          <a href={exportUrl} className="btn" target="_blank" rel="noopener noreferrer">Download Export</a>
        )}
      </div>
      <div className="viewport-note">Interactive 3D preview (Three.js powered)</div>
    </section>
  );
}
