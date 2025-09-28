import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MatrixGoldStyle.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface CADObject {
  id: string;
  type: 'curve' | 'surface' | 'solid';
  subtype: string;
  points: Point3D[];
  visible: boolean;
  selected: boolean;
  color: string;
  properties: Record<string, any>;
}

const MatrixGoldStyleCAD: React.FC = () => {
  const [activeWorkspace, setActiveWorkspace] = useState('modeling');
  const [activeTool, setActiveTool] = useState('select');
  const [objects, setObjects] = useState<CADObject[]>([]);
  const [viewMode, setViewMode] = useState('shaded');
  const [gridVisible, setGridVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point3D[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Ring Project');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // MatrixGold-style Menu Structure
  const matrixGoldMenus = {
    File: ['New', 'Open...', 'Save', 'Save As...', 'Import...', 'Export...', 'Recent Files', 'Exit'],
    Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Delete', 'Select All', 'Deselect All'],
    View: ['Zoom Extents', 'Zoom Window', 'Pan', 'Rotate', 'Top', 'Front', 'Right', 'Isometric', 'Perspective'],
    Curve: ['Point', 'Line', 'Polyline', 'Arc', 'Circle', 'Ellipse', 'Spline', 'Helix', 'Text Curve'],
    Surface: ['Plane', 'Sweep1', 'Sweep2', 'Loft', 'Revolve', 'Extrude', 'Network Surface', 'Patch'],
    Solid: ['Box', 'Sphere', 'Cylinder', 'Cone', 'Torus', 'Extrude Solid', 'Revolve Solid', 'Sweep Solid'],
    Transform: ['Move', 'Copy', 'Rotate', 'Scale', 'Mirror', 'Array', 'Orient', 'Flow Along Curve'],
    Analyze: ['Distance', 'Angle', 'Area', 'Volume', 'Curvature', 'Draft Angle', 'Thickness'],
    Render: ['Materials', 'Lights', 'Environment', 'Render Settings', 'Render View'],
    Jewelry: ['Ring Wizard', 'Stone Setting', 'Prong Tool', 'Gallery Rail', 'Shank Builder', 'Pattern Tool']
  };

  // Professional 3D Modeling Tools (like MatrixGold)
  const modelingTools = [
    { id: 'select', name: 'Select', icon: 'cursor-pointer', category: 'selection' },
    { id: 'point', name: 'Point', icon: '•', category: 'curve' },
    { id: 'line', name: 'Line', icon: '/', category: 'curve' },
    { id: 'arc', name: 'Arc', icon: '⌒', category: 'curve' },
    { id: 'circle', name: 'Circle', icon: '○', category: 'curve' },
    { id: 'spline', name: 'Spline', icon: '~', category: 'curve' },
    { id: 'rectangle', name: 'Rectangle', icon: '▭', category: 'curve' },
    { id: 'polygon', name: 'Polygon', icon: '⬟', category: 'curve' },
    { id: 'plane', name: 'Plane', icon: '▱', category: 'surface' },
    { id: 'extrude', name: 'Extrude', icon: '↑', category: 'surface' },
    { id: 'revolve', name: 'Revolve', icon: '↻', category: 'surface' },
    { id: 'loft', name: 'Loft', icon: '≋', category: 'surface' },
    { id: 'sweep1', name: 'Sweep1', icon: '→', category: 'surface' },
    { id: 'sweep2', name: 'Sweep2', icon: '⟶', category: 'surface' },
    { id: 'box', name: 'Box', icon: '▢', category: 'solid' },
    { id: 'sphere', name: 'Sphere', icon: '●', category: 'solid' },
    { id: 'cylinder', name: 'Cylinder', icon: '⬭', category: 'solid' },
    { id: 'cone', name: 'Cone', icon: '▲', category: 'solid' },
    { id: 'boolean-union', name: 'Boolean Union', icon: '∪', category: 'boolean' },
    { id: 'boolean-difference', name: 'Boolean Difference', icon: '−', category: 'boolean' },
    { id: 'boolean-intersection', name: 'Boolean Intersection', icon: '∩', category: 'boolean' },
    { id: 'fillet', name: 'Fillet', icon: '⌒', category: 'modify' },
    { id: 'chamfer', name: 'Chamfer', icon: '⌐', category: 'modify' },
    { id: 'shell', name: 'Shell', icon: '◊', category: 'modify' },
    { id: 'move', name: 'Move', icon: '↔', category: 'transform' },
    { id: 'rotate', name: 'Rotate', icon: '↻', category: 'transform' },
    { id: 'scale', name: 'Scale', icon: '⇕', category: 'transform' },
    { id: 'mirror', name: 'Mirror', icon: '⇄', category: 'transform' }
  ];

  // Jewelry-specific professional tools
  const jewelryTools = [
    { id: 'ring-wizard', name: 'Ring Wizard', icon: '💍', category: 'jewelry' },
    { id: 'stone-setting', name: 'Stone Setting', icon: '💎', category: 'jewelry' },
    { id: 'prong-tool', name: 'Prong Tool', icon: '⫸', category: 'jewelry' },
    { id: 'gallery-rail', name: 'Gallery Rail', icon: '▬', category: 'jewelry' },
    { id: 'shank-builder', name: 'Shank Builder', icon: '⌒', category: 'jewelry' },
    { id: 'pattern-tool', name: 'Pattern Tool', icon: '◈', category: 'jewelry' },
    { id: 'stone-library', name: 'Stone Library', icon: '⬟', category: 'jewelry' },
    { id: 'metal-calculator', name: 'Metal Calculator', icon: '⚖', category: 'jewelry' }
  ];

  // Generate unique ID for new objects
  const generateId = () => `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Snap point to grid if snap is enabled
  const snapToGrid = (x: number, y: number) => {
    if (!snapEnabled) return { x, y };
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  // Create new CAD object
  const createObject = (type: 'curve' | 'surface' | 'solid', subtype: string, points: Point3D[], properties: Record<string, any> = {}) => {
    const newObject: CADObject = {
      id: generateId(),
      type,
      subtype,
      points,
      visible: true,
      selected: true,
      color: '#00ff00',
      properties
    };

    setObjects(prev => [...prev, newObject]);
    setSelectedObjects([newObject.id]);
    console.log(`Created ${subtype} object with ${points.length} points`);
    return newObject;
  };

  // File operations
  const handleNewProject = () => {
    setObjects([]);
    setSelectedObjects([]);
    setProjectName('Untitled Ring Project');
    setActiveTool('select');
    console.log('New project created');
  };

  const handleSaveProject = () => {
    const projectData = {
      name: projectName,
      objects,
      timestamp: new Date().toISOString()
    };

    // In a real app, this would save to file or cloud
    const dataStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.cjz`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Project saved successfully');
  };

  const handleOpenProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cjz,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target?.result as string);
          setObjects(projectData.objects || []);
          setProjectName(projectData.name || 'Loaded Project');
          setSelectedObjects([]);
          console.log('Project loaded successfully');
        } catch (error) {
          console.error('Error loading project:', error);
          alert('Error loading project file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Handle canvas mouse events
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const snapped = snapToGrid(rawX, rawY);
    const point: Point3D = { x: snapped.x, y: snapped.y, z: 0 };

    switch (activeTool) {
      case 'point':
        createObject('curve', 'point', [point]);
        break;

      case 'line':
        if (!isDrawing) {
          setIsDrawing(true);
          setCurrentPoints([point]);
          console.log('Line started - click second point');
        } else {
          setCurrentPoints(prev => {
            const newPoints = [...prev, point];
            createObject('curve', 'line', newPoints);
            return [];
          });
          setIsDrawing(false);
        }
        break;

      case 'circle':
        if (!isDrawing) {
          setIsDrawing(true);
          setCurrentPoints([point]);
          console.log('Circle center set - click to define radius');
        } else {
          setCurrentPoints(prev => {
            const center = prev[0];
            const radius = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
            const circlePoints = [];

            // Generate circle points
            for (let i = 0; i <= 36; i++) {
              const angle = (i * Math.PI * 2) / 36;
              circlePoints.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
                z: 0
              });
            }

            createObject('curve', 'circle', circlePoints, { center, radius });
            return [];
          });
          setIsDrawing(false);
        }
        break;

      case 'rectangle':
        if (!isDrawing) {
          setIsDrawing(true);
          setCurrentPoints([point]);
          console.log('Rectangle corner set - click opposite corner');
        } else {
          setCurrentPoints(prev => {
            const corner1 = prev[0];
            const corner2 = point;
            const rectPoints = [
              corner1,
              { x: corner2.x, y: corner1.y, z: 0 },
              corner2,
              { x: corner1.x, y: corner2.y, z: 0 },
              corner1 // Close the rectangle
            ];
            createObject('curve', 'rectangle', rectPoints);
            return [];
          });
          setIsDrawing(false);
        }
        break;

      case 'box':
        if (!isDrawing) {
          setIsDrawing(true);
          setCurrentPoints([point]);
          console.log('Box base corner set - click opposite corner');
        } else if (currentPoints.length === 1) {
          setCurrentPoints(prev => [...prev, point]);
          console.log('Box base defined - click to set height');
        } else {
          setCurrentPoints(prev => {
            const corner1 = prev[0];
            const corner2 = prev[1];
            const height = Math.abs(point.y - corner1.y);

            // Create 3D box points (simplified representation)
            const boxPoints = [
              corner1,
              { x: corner2.x, y: corner1.y, z: 0 },
              corner2,
              { x: corner1.x, y: corner2.y, z: 0 },
              corner1, // Close base
              { x: corner1.x, y: corner1.y, z: height },
              { x: corner2.x, y: corner1.y, z: height },
              { x: corner2.x, y: corner2.y, z: height },
              { x: corner1.x, y: corner2.y, z: height }
            ];

            createObject('solid', 'box', boxPoints, { width: Math.abs(corner2.x - corner1.x), height: Math.abs(corner2.y - corner1.y), depth: height });
            return [];
          });
          setIsDrawing(false);
        }
        break;

      case 'select':
        // Selection logic
        const clickedObject = objects.find(obj => {
          if (!obj.visible) return false;
          // Simple point-in-object test
          return obj.points.some(p =>
            Math.abs(p.x - point.x) < 10 && Math.abs(p.y - point.y) < 10
          );
        });

        if (clickedObject) {
          if (e.ctrlKey || e.metaKey) {
            // Add to selection
            setSelectedObjects(prev =>
              prev.includes(clickedObject.id)
                ? prev.filter(id => id !== clickedObject.id)
                : [...prev, clickedObject.id]
            );
          } else {
            // Replace selection
            setSelectedObjects([clickedObject.id]);
          }

          // Update object selection state
          setObjects(prev => prev.map(obj => ({
            ...obj,
            selected: selectedObjects.includes(obj.id)
          })));
        } else if (!e.ctrlKey && !e.metaKey) {
          // Clear selection
          setSelectedObjects([]);
          setObjects(prev => prev.map(obj => ({ ...obj, selected: false })));
        }
        break;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw professional grid
    if (gridVisible) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i <= canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // Draw coordinate axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw objects
    objects.forEach(obj => {
      if (!obj.visible) return;
      ctx.strokeStyle = obj.selected ? '#FFD700' : obj.color;
      ctx.lineWidth = obj.selected ? 3 : 2;

      // Draw based on object type
      if (obj.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(obj.points[0].x, obj.points[0].y);
        obj.points.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
  }, [objects, gridVisible, selectedObjects]);

  // Handle tool activation with REAL functionality
  const handleToolClick = (toolId: string) => {
    // Cancel any current drawing operation
    setIsDrawing(false);
    setCurrentPoints([]);

    setActiveTool(toolId);
    console.log(`Activated tool: ${toolId}`);

    // Real tool logic
    switch (toolId) {
      case 'ring-wizard':
        setShowDialog('ring-wizard');
        break;
      case 'stone-setting':
        setShowDialog('stone-setting');
        break;
      case 'line':
        console.log('Line tool: Click to set start point, then click end point');
        break;
      case 'circle':
        console.log('Circle tool: Click center, then click to set radius');
        break;
      case 'rectangle':
        console.log('Rectangle tool: Click first corner, then opposite corner');
        break;
      case 'box':
        console.log('Box tool: Click first corner, opposite corner, then set height');
        break;
      case 'point':
        console.log('Point tool: Click anywhere to place points');
        break;
      case 'select':
        console.log('Select tool: Click objects to select, Ctrl+click for multiple');
        break;
      case 'move':
        if (selectedObjects.length === 0) {
          alert('Please select objects first');
          setActiveTool('select');
        } else {
          console.log('Move tool: Click and drag to move selected objects');
        }
        break;
      case 'boolean-union':
        if (selectedObjects.length < 2) {
          alert('Select at least 2 objects for boolean union');
        } else {
          performBooleanUnion();
        }
        break;
      case 'fillet':
        if (selectedObjects.length === 0) {
          alert('Select objects with edges to fillet');
        } else {
          console.log('Fillet tool activated');
        }
        break;
    }
  };

  // Boolean operations
  const performBooleanUnion = () => {
    if (selectedObjects.length < 2) return;

    const selectedObjs = objects.filter(obj => selectedObjects.includes(obj.id));
    const remainingObjs = objects.filter(obj => !selectedObjects.includes(obj.id));

    // Simplified union - combine all points
    const allPoints = selectedObjs.flatMap(obj => obj.points);
    const unionObject = createObject('solid', 'boolean-union', allPoints, {
      operation: 'union',
      sourceObjects: selectedObjects
    });

    // Remove original objects and add union result
    setObjects([...remainingObjs, unionObject]);
    setSelectedObjects([unionObject.id]);

    console.log(`Boolean union created from ${selectedObjects.length} objects`);
  };

  // Create ring from wizard
  const createRing = (type: string) => {
    const centerX = 400;
    const centerY = 300;
    let ringPoints: Point3D[] = [];

    switch (type) {
      case 'solitaire':
        // Create solitaire ring profile
        const outerRadius = 40;

        // Outer circle
        for (let i = 0; i <= 36; i++) {
          const angle = (i * Math.PI * 2) / 36;
          ringPoints.push({
            x: centerX + Math.cos(angle) * outerRadius,
            y: centerY + Math.sin(angle) * outerRadius,
            z: 0
          });
        }

        // Add prong for stone
        ringPoints.push(
          { x: centerX, y: centerY - 50, z: 10 },
          { x: centerX, y: centerY, z: 15 },
          { x: centerX, y: centerY + 50, z: 10 }
        );
        break;

      case 'band':
        // Simple band
        for (let i = 0; i <= 36; i++) {
          const angle = (i * Math.PI * 2) / 36;
          ringPoints.push({
            x: centerX + Math.cos(angle) * 38,
            y: centerY + Math.sin(angle) * 38,
            z: 0
          });
        }
        break;

      default:
        // Default ring shape
        for (let i = 0; i <= 36; i++) {
          const angle = (i * Math.PI * 2) / 36;
          ringPoints.push({
            x: centerX + Math.cos(angle) * 40,
            y: centerY + Math.sin(angle) * 40,
            z: 0
          });
        }
    }

    createObject('solid', `ring-${type}`, ringPoints, { ringType: type, size: 7, metal: '14k-gold' });
    setShowDialog(null);
    console.log(`Created ${type} ring`);
  };

  const toolCategories = {
    selection: modelingTools.filter(t => t.category === 'selection'),
    curve: modelingTools.filter(t => t.category === 'curve'),
    surface: modelingTools.filter(t => t.category === 'surface'),
    solid: modelingTools.filter(t => t.category === 'solid'),
    boolean: modelingTools.filter(t => t.category === 'boolean'),
    modify: modelingTools.filter(t => t.category === 'modify'),
    transform: modelingTools.filter(t => t.category === 'transform'),
    jewelry: jewelryTools
  };

  return (
    <div className="matrix-gold-interface">
      {/* Professional Menu Bar */}
      <div className="menu-bar">
        <div className="menu-logo">CraftedJewelz CAD</div>
        {Object.entries(matrixGoldMenus).map(([menuName, items]) => (
          <div key={menuName} className="menu-item">
            {menuName}
          </div>
        ))}
      </div>

      {/* Main Toolbar */}
      <div className="main-toolbar">
        <div className="toolbar-section">
          <button className="toolbar-btn primary" onClick={handleNewProject}>New</button>
          <button className="toolbar-btn" onClick={handleOpenProject}>Open</button>
          <button className="toolbar-btn" onClick={handleSaveProject}>Save</button>
        </div>
        <div className="toolbar-separator"></div>
        <div className="toolbar-section">
          <button className="toolbar-btn">Undo</button>
          <button className="toolbar-btn">Redo</button>
        </div>
        <div className="toolbar-separator"></div>
        <div className="toolbar-section">
          <button
            className={`toolbar-btn ${viewMode === 'wireframe' ? 'active' : ''}`}
            onClick={() => setViewMode('wireframe')}
          >
            Wireframe
          </button>
          <button
            className={`toolbar-btn ${viewMode === 'shaded' ? 'active' : ''}`}
            onClick={() => setViewMode('shaded')}
          >
            Shaded
          </button>
          <button
            className={`toolbar-btn ${viewMode === 'rendered' ? 'active' : ''}`}
            onClick={() => setViewMode('rendered')}
          >
            Rendered
          </button>
        </div>
      </div>

      <div className="workspace-container">
        {/* Left Tool Panel */}
        <div className="tool-panel">
          {Object.entries(toolCategories).map(([categoryName, tools]) => (
            <div key={categoryName} className="tool-category">
              <div className="tool-category-header">{categoryName.toUpperCase()}</div>
              <div className="tool-grid">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
                    onClick={() => handleToolClick(tool.id)}
                    title={tool.name}
                  >
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-name">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main 3D Viewport */}
        <div className="viewport-container">
          <div className="viewport-header">
            <div className="viewport-controls">
              <button className="view-btn">Top</button>
              <button className="view-btn">Front</button>
              <button className="view-btn">Right</button>
              <button className="view-btn">Iso</button>
            </div>
            <div className="viewport-options">
              <label>
                <input
                  type="checkbox"
                  checked={gridVisible}
                  onChange={(e) => setGridVisible(e.target.checked)}
                />
                Grid
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={snapEnabled}
                  onChange={(e) => setSnapEnabled(e.target.checked)}
                />
                Snap
              </label>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="main-viewport"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />
        </div>

        {/* Right Properties Panel */}
        <div className="properties-panel">
          <div className="properties-header">Properties</div>
          <div className="properties-content">
            <div className="property-group">
              <div className="property-label">Active Tool:</div>
              <div className="property-value">{activeTool}</div>
            </div>

            <div className="property-group">
              <div className="property-label">View Mode:</div>
              <div className="property-value">{viewMode}</div>
            </div>

            <div className="property-group">
              <div className="property-label">Objects:</div>
              <div className="property-value">{objects.length}</div>
            </div>

            <div className="property-group">
              <div className="property-label">Selected:</div>
              <div className="property-value">{selectedObjects.length}</div>
            </div>
          </div>

          {/* Object Browser */}
          <div className="object-browser">
            <div className="browser-header">Object Browser</div>
            <div className="object-list">
              {objects.map(obj => (
                <div key={obj.id} className={`object-item ${obj.selected ? 'selected' : ''}`}>
                  <span className="object-type">{obj.type}</span>
                  <span className="object-id">{obj.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">Ready</div>
        <div className="status-item">Tool: {activeTool}</div>
        <div className="status-item">Objects: {objects.length}</div>
        <div className="status-item">View: {viewMode}</div>
      </div>

      {/* Dialog Components */}
      {showDialog === 'ring-wizard' && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3>Ring Wizard</h3>
              <button onClick={() => setShowDialog(null)}>×</button>
            </div>
            <div className="dialog-content">
              <div className="wizard-step">
                <h4>Step 1: Ring Type</h4>
                <div className="ring-types">
                  <button className="ring-type-btn" onClick={() => createRing('solitaire')}>
                    Solitaire Engagement Ring
                  </button>
                  <button className="ring-type-btn" onClick={() => createRing('band')}>
                    Wedding Band
                  </button>
                  <button className="ring-type-btn" onClick={() => createRing('three-stone')}>
                    Three Stone Ring
                  </button>
                  <button className="ring-type-btn" onClick={() => createRing('halo')}>
                    Halo Ring
                  </button>
                </div>
              </div>
              <div className="wizard-step">
                <h4>Step 2: Ring Size</h4>
                <select defaultValue="7">
                  <option value="5">Size 5</option>
                  <option value="6">Size 6</option>
                  <option value="7">Size 7</option>
                  <option value="8">Size 8</option>
                  <option value="9">Size 9</option>
                </select>
              </div>
              <div className="wizard-step">
                <h4>Step 3: Metal Type</h4>
                <select defaultValue="14k-gold">
                  <option value="14k-gold">14K Gold</option>
                  <option value="18k-gold">18K Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="silver">Sterling Silver</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDialog === 'stone-setting' && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3>Stone Setting Tools</h3>
              <button onClick={() => setShowDialog(null)}>×</button>
            </div>
            <div className="dialog-content">
              <div className="setting-options">
                <button className="setting-btn">Prong Setting</button>
                <button className="setting-btn">Bezel Setting</button>
                <button className="setting-btn">Channel Setting</button>
                <button className="setting-btn">Pave Setting</button>
              </div>
              <div className="stone-library">
                <h4>Stone Library</h4>
                <div className="stone-grid">
                  <button className="stone-btn">Round Brilliant (1ct)</button>
                  <button className="stone-btn">Princess Cut (0.5ct)</button>
                  <button className="stone-btn">Emerald Cut (1.5ct)</button>
                  <button className="stone-btn">Oval Cut (1ct)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixGoldStyleCAD;
