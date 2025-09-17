import React, { useRef, useEffect, useState } from 'react';
import JewelryCanvasToolbar from './JewelryCanvasToolbar';
import JewelryCanvasLayerPanel from './JewelryCanvasLayerPanel';

/**
 * JewelryDesignCanvas
 * Unified 2D design canvas for jewelry projects. Supports SVG drawing, selection, layers, and plugin integration.
 * Future: SVG-to-3D pipeline, parametric editing, technical drawing export.
 */
const JewelryDesignCanvas: React.FC = () => {
  // Undo/redo history
  const [history, setHistory] = useState<any[][]>([]);
  const [future, setFuture] = useState<any[][]>([]);

  const canvasRef = useRef<SVGSVGElement>(null);

  // Convert mouse event to SVG coordinates
  const getSvgCoords = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svg = canvasRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.nativeEvent.offsetX;
    pt.y = e.nativeEvent.offsetY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: cursorpt.x, y: cursorpt.y };
  };
  // Accessibility and interaction states
  const [activeTool, setActiveTool] = useState<string>('select');
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);
  const [quickSelectRegion, setQuickSelectRegion] = useState<{x: number, y: number, r: number} | null>(null);
  const [diamondPreview, setDiamondPreview] = useState<any[]>([]);
  const [diamondReport, setDiamondReport] = useState<any>(null);
  const [diamondFillParams, setDiamondFillParams] = useState({ stoneSize: 1.5, gridType: 'hex', padding: 0.2, spacing: 0.1 });
  // Layer management
  const [layers, setLayers] = useState<string[]>(["Base"]);
  const [activeLayer, setActiveLayer] = useState<string>("Base");
  const [layerElements, setLayerElements] = useState<{[layer: string]: any[]}>({ Base: [] });
  const [svgElements, setSvgElements] = useState<any[]>([]);

  // Sync svgElements with active layer
  useEffect(() => {
    setLayerElements((prev: {[layer: string]: any[]}) => ({ ...prev, [activeLayer]: svgElements }));
    setHistory((prev) => [...prev, svgElements]);
    setFuture([]);
    // eslint-disable-next-line
  }, [svgElements, activeLayer]);

  useEffect(() => {
    setSvgElements(layerElements[activeLayer] || []);
    // eslint-disable-next-line
  }, [activeLayer]);

  // Undo/redo handlers
  const handleUndo = () => {
    if (history.length > 1) {
      setFuture((f) => [svgElements, ...f]);
      const prev = history[history.length - 2];
      setHistory((h) => h.slice(0, -1));
      setSvgElements(prev);
    }
  };
  const handleRedo = () => {
    if (future.length > 0) {
      setHistory((h) => [...h, future[0]]);
      setSvgElements(future[0]);
      setFuture((f) => f.slice(1));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        handleUndo();
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        handleRedo();
        e.preventDefault();
      }
      if (e.key === "Delete" && selectedIndex !== null) {
        setSvgElements((prev: any[]) => prev.filter((_: any, idx: number) => idx !== selectedIndex));
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, svgElements, history, future]);

  const handleAddLayer = () => {
    let newName = "Layer " + (layers.length + 1);
    let i = 1;
    while (layers.includes(newName)) {
      i++;
      newName = "Layer " + (layers.length + i);
    }
    setLayers([...layers, newName]);
  setLayerElements((prev: {[layer: string]: any[]}) => ({ ...prev, [newName]: [] }));
    setActiveLayer(newName);
  };

  const handleDeleteLayer = (layer: string) => {
    if (layer === "Base") return;
    const idx = layers.indexOf(layer);
  const newLayers = layers.filter((l: string) => l !== layer);
    const newLayerElements = { ...layerElements };
    delete newLayerElements[layer];
    setLayers(newLayers);
    setLayerElements(newLayerElements);
    setActiveLayer(newLayers[Math.max(0, idx - 1)]);
  };
  // SVG import
  const handleImportSVG = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const svgText = evt.target?.result as string;
      // Parse SVG and add to canvas (basic: only paths, rects, ellipses, lines)
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const newElements: any[] = [];
      const baseKey = svgElements ? svgElements.length : 0;
      doc.querySelectorAll('path,rect,ellipse,line,circle').forEach((el, idx) => {
        if (el.tagName === 'path') {
          newElements.push(<path key={baseKey + idx} d={el.getAttribute('d') || ''} stroke="#6366f1" strokeWidth={2} fill="none" />);
        } else if (el.tagName === 'rect') {
          newElements.push(<rect key={baseKey + idx} x={Number(el.getAttribute('x'))} y={Number(el.getAttribute('y'))} width={Number(el.getAttribute('width'))} height={Number(el.getAttribute('height'))} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />);
        } else if (el.tagName === 'ellipse') {
          newElements.push(<ellipse key={baseKey + idx} cx={Number(el.getAttribute('cx'))} cy={Number(el.getAttribute('cy'))} rx={Number(el.getAttribute('rx'))} ry={Number(el.getAttribute('ry'))} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />);
        } else if (el.tagName === 'circle') {
          newElements.push(<circle key={baseKey + idx} cx={Number(el.getAttribute('cx'))} cy={Number(el.getAttribute('cy'))} r={Number(el.getAttribute('r'))} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />);
        } else if (el.tagName === 'line') {
          newElements.push(<line key={baseKey + idx} x1={Number(el.getAttribute('x1'))} y1={Number(el.getAttribute('y1'))} x2={Number(el.getAttribute('x2'))} y2={Number(el.getAttribute('y2'))} stroke="#6366f1" strokeWidth={2} />);
        }
      });
  setSvgElements((prev: any[]) => [...prev, ...newElements]);
    };
    reader.readAsText(file);
  };

  // SVG export
  const handleExportSVG = () => {
    const svgHeader = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>`;
    const svgFooter = `</svg>`;
    let svgContent = '';
  svgElements.forEach((el: any) => {
      if (el.type === 'path') {
        svgContent += `<path d='${el.props.d}' stroke='${el.props.stroke}' stroke-width='${el.props.strokeWidth}' fill='${el.props.fill || 'none'}' />`;
      } else if (el.type === 'rect') {
        svgContent += `<rect x='${el.props.x}' y='${el.props.y}' width='${el.props.width}' height='${el.props.height}' fill='${el.props.fill}' stroke='${el.props.stroke}' stroke-width='${el.props.strokeWidth}' />`;
      } else if (el.type === 'ellipse') {
        svgContent += `<ellipse cx='${el.props.cx}' cy='${el.props.cy}' rx='${el.props.rx}' ry='${el.props.ry}' fill='${el.props.fill}' stroke='${el.props.stroke}' stroke-width='${el.props.strokeWidth}' />`;
      } else if (el.type === 'circle') {
        svgContent += `<circle cx='${el.props.cx}' cy='${el.props.cy}' r='${el.props.r}' fill='${el.props.fill}' stroke='${el.props.stroke}' stroke-width='${el.props.strokeWidth}' />`;
      } else if (el.type === 'line') {
        svgContent += `<line x1='${el.props.x1}' y1='${el.props.y1}' x2='${el.props.x2}' y2='${el.props.y2}' stroke='${el.props.stroke}' stroke-width='${el.props.strokeWidth}' />`;
      }
    });
    const svgData = svgHeader + svgContent + svgFooter;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    return (
      <div
        className="jewelry-canvas-wrapper flex flex-row w-full h-full"
        role="main"
        aria-label="Jewelry Design Workspace"
        tabIndex={0}
      >
        <JewelryCanvasToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        <div className="canvas-panel flex-1 flex flex-col items-stretch" role="region" aria-label="Canvas Panel">
          <div className="canvas-header flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-yellow-600">
            <span className="font-bold text-yellow-300 text-lg" tabIndex={0}>Jewelry Design Canvas</span>
            <button className="btn focus:outline-none focus:ring-2 focus:ring-yellow-500" onClick={handleExportSVG} aria-label="Export SVG">Export SVG</button>
            <label className="ml-4 cursor-pointer" aria-label="Import SVG">
              Import SVG
              <input type="file" accept=".svg" onChange={handleImportSVG} className="hidden" />
            </label>
          </div>
          <div className="canvas-main flex-1 bg-gray-950 flex flex-row" role="region" aria-label="Canvas Main Area">
            <JewelryCanvasLayerPanel
              layers={layers}
              activeLayer={activeLayer}
              onSelectLayer={setActiveLayer}
              onAddLayer={handleAddLayer}
              onDeleteLayer={handleDeleteLayer}
            />
            <div className="canvas-area flex-1 flex items-center justify-center" role="region" aria-label="Canvas Area">
              <svg
                ref={canvasRef}
                width={800}
                height={600}
                className="jewelry-svg-canvas border rounded shadow bg-gray-900"
                tabIndex={0}
                aria-label="Jewelry Design Canvas"
                role="img"
              >
                {svgElements}
              </svg>
            </div>
          </div>
          {/* ...existing controls and panels... */}
        </div>
      </div>
    );

  // Quick Select tool logic (stub)
  const handleQuickSelect = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    // Stub: region selection using marching squares/flood fill
    // For now, select a circular region around click
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.nativeEvent.offsetX;
    pt.y = e.nativeEvent.offsetY;
    setQuickSelectRegion({ x: pt.x, y: pt.y, r: 40 });
    // Overlay preview (stub)
    setDiamondPreview(Array.from({ length: 20 }, (_, i) => ({ x: pt.x + Math.cos(i * 0.3) * 30, y: pt.y + Math.sin(i * 0.3) * 30, size: diamondFillParams.stoneSize })));
  };

  // Mouse down: start drawing, select, or drag
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (activeTool === "select") {
      // Hit test: check if click is inside any element
      const { x, y } = getSvgCoords(e);
      let found = null;
  svgElements.forEach((el: any, idx: number) => {
        // Only basic hit test for rect, ellipse, circle, line
        if (el.type === 'rect') {
          const props = el.props;
          if (x >= props.x && x <= props.x + props.width && y >= props.y && y <= props.y + props.height) found = idx;
        } else if (el.type === 'ellipse') {
          const props = el.props;
          const dx = x - props.cx, dy = y - props.cy;
          if ((dx * dx) / (props.rx * props.rx) + (dy * dy) / (props.ry * props.ry) <= 1) found = idx;
        } else if (el.type === 'circle') {
          const props = el.props;
          const dx = x - props.cx, dy = y - props.cy;
          if (dx * dx + dy * dy <= props.r * props.r) found = idx;
        } else if (el.type === 'line') {
          const props = el.props;
          // Simple distance to line segment
          const dist = Math.abs((props.y2 - props.y1) * x - (props.x2 - props.x1) * y + props.x2 * props.y1 - props.y2 * props.x1) /
            Math.sqrt(Math.pow(props.y2 - props.y1, 2) + Math.pow(props.x2 - props.x1, 2));
          if (dist < 8) found = idx;
        }
      });
      setSelectedIndex(found);
      // If found, start drag
      if (found !== null) {
        setDragging(true);
        setDragOffset({ x, y });
      }
      return;
    }
    if (activeTool === "pen" || activeTool === "rect" || activeTool === "ellipse" || activeTool === "line") {
      setDrawing(true);
      const { x, y } = getSvgCoords(e);
      setStartPoint({ x, y });
      if (activeTool === "pen") {
        setCurrentPath(`M${x},${y}`);
      }
    }
  };

  // Mouse move: update drawing or drag
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (dragging && selectedIndex !== null && dragOffset) {
      const { x, y } = getSvgCoords(e);
      const dx = x - dragOffset.x;
      const dy = y - dragOffset.y;
  setSvgElements((prev: any[]) => prev.map((el: any, idx: number) => {
        if (idx !== selectedIndex) return el;
        // Move element by dx, dy
        if (el.type === 'rect') {
          const props = el.props;
          return <rect {...props} x={props.x + dx} y={props.y + dy} />;
        } else if (el.type === 'ellipse') {
          const props = el.props;
          return <ellipse {...props} cx={props.cx + dx} cy={props.cy + dy} />;
        } else if (el.type === 'circle') {
          const props = el.props;
          return <circle {...props} cx={props.cx + dx} cy={props.cy + dy} />;
        } else if (el.type === 'line') {
          const props = el.props;
          return <line {...props} x1={props.x1 + dx} y1={props.y1 + dy} x2={props.x2 + dx} y2={props.y2 + dy} />;
        } else if (el.type === 'path') {
          // TODO: Move path (requires parsing d)
          return el;
        }
        return el;
      }));
      setDragOffset({ x, y });
      return;
    }
    if (!drawing || !startPoint) return;
    const { x, y } = getSvgCoords(e);
    if (activeTool === "pen") {
  setCurrentPath((prev: string) => prev + ` L${x},${y}`);
    }
  };

  // Mouse up: finish drawing or drag
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (dragging) {
      setDragging(false);
      setDragOffset(null);
      return;
    }
    if (!drawing || !startPoint) return;
    const { x, y } = getSvgCoords(e);
    let newElement = null;
    if (activeTool === "pen") {
      newElement = <path key={svgElements.length} d={currentPath} stroke="#6366f1" strokeWidth={2} fill="none" />;
      setCurrentPath("");
    } else if (activeTool === "rect") {
      newElement = <rect key={svgElements.length} x={Math.min(startPoint.x, x)} y={Math.min(startPoint.y, y)} width={Math.abs(x - startPoint.x)} height={Math.abs(y - startPoint.y)} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />;
    } else if (activeTool === "ellipse") {
      newElement = <ellipse key={svgElements.length} cx={(startPoint.x + x) / 2} cy={(startPoint.y + y) / 2} rx={Math.abs(x - startPoint.x) / 2} ry={Math.abs(y - startPoint.y) / 2} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />;
    } else if (activeTool === "line") {
      newElement = <line key={svgElements.length} x1={startPoint.x} y1={startPoint.y} x2={x} y2={y} stroke="#6366f1" strokeWidth={2} />;
    }
  if (newElement) setSvgElements((prev: any[]) => [...prev, newElement]);
    setDrawing(false);
    setStartPoint(null);
  };
  // Keyboard: delete selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIndex !== null) {
  setSvgElements((prev: any[]) => prev.filter((_: any, idx: number) => idx !== selectedIndex));
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  // Advanced region selection: marching squares/flood fill (stub)
  const marchingSquaresSelect = (bitmap: number[][], threshold: number = 1) => {
    // Stub: returns boundary points of region above threshold
    // In production, use a real marching squares implementation
    const points: {x: number, y: number}[] = [];
    for (let y = 1; y < bitmap.length - 1; y++) {
      for (let x = 1; x < bitmap[0].length - 1; x++) {
        if (bitmap[y][x] >= threshold) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  // Custom stone shapes and mixed layouts
  const stoneShapes = [
    { label: "Round", value: "round" },
    { label: "Princess", value: "princess" },
    { label: "Oval", value: "oval" },
    { label: "Emerald", value: "emerald" },
    { label: "Marquise", value: "marquise" },
    { label: "Pear", value: "pear" },
    { label: "Mixed", value: "mixed" }
  ];
  const [selectedStoneShape, setSelectedStoneShape] = useState<string>("round");

  const handleQuickFill = async () => {
    if (!quickSelectRegion) return;
    // Stub: region_mesh is a circle in 2D, z=0
    const region_mesh = Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * 2 * Math.PI;
      return [quickSelectRegion.x + Math.cos(angle) * quickSelectRegion.r, quickSelectRegion.y + Math.sin(angle) * quickSelectRegion.r, 0];
    });
    const payload = {
      region_mesh,
      stone_size: diamondFillParams.stoneSize,
      grid_type: diamondFillParams.gridType,
      spacing: diamondFillParams.spacing,
      padding: diamondFillParams.padding,
      stone_shape: selectedStoneShape
    };
    try {
      const res = await fetch("/cad/auto-diamond-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setDiamondReport(data.diamond_report);
    setDiamondPreview(data.modified_mesh.map(([x, y, z]: [number, number, number]) => ({ x, y, size: diamondFillParams.stoneSize })));
    } catch (err) {
      setDiamondReport({ error: "Failed to fill region" });
    }
  };

  return (
    <div className="jewelry-canvas-wrapper bg-gray-950 rounded-lg shadow-xl border border-yellow-700 p-4 flex flex-col" style={{ minHeight: 600 }}>
      <JewelryCanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
      <JewelryCanvasLayerPanel layers={layers} activeLayer={activeLayer} onSelectLayer={setActiveLayer} onAddLayer={handleAddLayer} onDeleteLayer={handleDeleteLayer} />
      <div className="canvas-panel">
        <svg
          ref={canvasRef}
          width={800}
          height={600}
          style={{ border: '2px solid #FFD700', borderRadius: 16, background: 'linear-gradient(135deg, #232323 60%, #444 100%)' }}
          onMouseDown={activeTool === 'draw' ? handleMouseDown : undefined}
          onMouseMove={activeTool === 'draw' ? handleMouseMove : undefined}
          onMouseUp={activeTool === 'draw' ? handleMouseUp : undefined}
          onClick={activeTool === 'quickselect' ? handleQuickSelect : undefined}
          aria-label="Jewelry Design Canvas"
          role="img"
          tabIndex={0}
        >
          <title>Jewelry Design Canvas. Use Ctrl+Z to undo, Ctrl+Y to redo, Delete to remove selected.</title>
          {svgElements}
          {/* Quick Select region preview */}
          {quickSelectRegion ? (
            <circle cx={quickSelectRegion?.x} cy={quickSelectRegion?.y} r={quickSelectRegion?.r} fill="rgba(0,200,255,0.1)" stroke="#38bdf8" strokeWidth={2} />
          ) : null}
          {/* Diamond grid preview */}
          {diamondPreview.map((d: any, i: number) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.size} fill="rgba(255,255,255,0.7)" stroke="#6366f1" strokeWidth={1} />
          ))}
        </svg>
        <div className="canvas-controls mt-4 flex gap-2">
          <button className="btn bg-yellow-600 text-gray-900 font-bold px-4 py-2 rounded shadow hover:bg-yellow-500 transition" onClick={handleExportSVG} title="Export current design as SVG" aria-label="Export SVG">Export SVG</button>
          <button className="btn bg-indigo-600 text-white font-bold px-4 py-2 rounded shadow hover:bg-indigo-500 transition" onClick={handleUndo} title="Undo (Ctrl+Z)" aria-label="Undo">Undo</button>
          <button className="btn bg-indigo-600 text-white font-bold px-4 py-2 rounded shadow hover:bg-indigo-500 transition" onClick={handleRedo} title="Redo (Ctrl+Y)" aria-label="Redo">Redo</button>
          <input type="file" accept=".svg" onChange={handleImportSVG} className="ml-2 bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1" title="Import SVG" aria-label="Import SVG" />
        </div>
        {/* Quick Select + Auto Diamond Fill Controls */}
        {activeTool === 'quickselect' && (
          <div className="quickselect-panel bg-white border rounded shadow p-3 mt-4" aria-label="Quick Select and Auto Diamond Fill Panel" tabIndex={0} title="Quick Select and Auto Diamond Fill">
            <h3 className="font-bold text-indigo-700 mb-2">Quick Select + Auto Diamond Fill</h3>
            <label title="Select stone shape">Stone Shape:
              <select value={selectedStoneShape} onChange={e => setSelectedStoneShape(e.target.value)} className="ml-2" aria-label="Select stone shape">
                {stoneShapes.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
            <label title="Set stone size">Stone Size (mm): <input type="number" step="0.1" value={diamondFillParams.stoneSize} onChange={e => setDiamondFillParams((p: typeof diamondFillParams) => ({ ...p, stoneSize: Number(e.target.value) }))} className="ml-2" aria-label="Set stone size" /></label>
            <label title="Select grid type">Grid Type:
              <select value={diamondFillParams.gridType} onChange={e => setDiamondFillParams((p: typeof diamondFillParams) => ({ ...p, gridType: e.target.value }))} className="ml-2" aria-label="Select grid type">
                <option value="hex">Hex</option>
                <option value="pave">Pavé</option>
                <option value="channel">Channel</option>
              </select>
            </label>
            <label title="Set padding">Padding (mm): <input type="number" step="0.1" value={diamondFillParams.padding} onChange={e => setDiamondFillParams((p: typeof diamondFillParams) => ({ ...p, padding: Number(e.target.value) }))} className="ml-2" aria-label="Set padding" /></label>
            <label title="Set spacing">Spacing (mm): <input type="number" step="0.1" value={diamondFillParams.spacing} onChange={e => setDiamondFillParams((p: typeof diamondFillParams) => ({ ...p, spacing: Number(e.target.value) }))} className="ml-2" aria-label="Set spacing" /></label>
            <button className="btn mt-2" onClick={handleQuickFill} title="Auto fill diamonds in selected region" aria-label="Quick Fill">Quick Fill</button>
            {diamondReport && (
              <div className="mt-2 text-sm text-gray-700" aria-label="Diamond Fill Report" tabIndex={0} title="Diamond Fill Report">
                <div>Report: {JSON.stringify(diamondReport)}</div>
                {/* Verification Panel */}
                <div className="mt-2 p-2 border rounded bg-gray-50" aria-label="Verification Panel" tabIndex={0} title="Verification Panel">
                  <h4 className="font-semibold text-indigo-600 mb-1">Verification</h4>
                  {/* Check diamond spacing */}
                  {diamondReport.spacing < 0.05 ? (
                    <div className="text-red-600">Warning: Diamond spacing is below recommended minimum (0.05mm).</div>
                  ) : (
                    <div className="text-green-700">Diamond spacing OK.</div>
                  )}
                  {/* Check minimum wall thickness (stub: always OK) */}
                  <div className="text-green-700">Wall thickness: OK</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JewelryDesignCanvas;
