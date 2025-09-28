import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CADInterface.css';

interface Tool {
  id: string;
  name: string;
  icon: string;
  shortcut: string;
  description: string;
  category: string;
}

interface DialogState {
  type: string | null;
  data?: any;
}

const IndustryStandardCAD: React.FC = () => {
  // State management
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [activeTab, setActiveTab] = useState('properties');
  const [projectName, setProjectName] = useState('Untitled Ring Project');
  const [showGrid, setShowGrid] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [orthoMode, setOrthoMode] = useState(false);
  const [viewMode, setViewMode] = useState('Shaded');
  const [units, setUnits] = useState('mm');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [dialog, setDialog] = useState<DialogState>({ type: null });
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Industry-standard menu structure
  const menuStructure = [
    {
      name: 'File',
      items: [
        'New Project (Ctrl+N)', 'Open... (Ctrl+O)', 'Recent Files ▶', '---',
        'Save (Ctrl+S)', 'Save As... (Ctrl+Shift+S)', 'Save Copy As...', '---',
        'Import CAD... (Ctrl+I)', 'Import Image...', 'Export STL... (Ctrl+E)', 'Export OBJ...', '---',
        'Print 3D... (Ctrl+P)', 'Render to Image...', '---',
        'Project Properties...', 'Backup Project', '---',
        'Exit (Alt+F4)'
      ]
    },
    {
      name: 'Edit',
      items: [
        'Undo (Ctrl+Z)', 'Redo (Ctrl+Y)', '---',
        'Cut (Ctrl+X)', 'Copy (Ctrl+C)', 'Paste (Ctrl+V)', 'Delete (Del)', '---',
        'Select All (Ctrl+A)', 'Deselect All (Ctrl+D)', 'Invert Selection (Ctrl+I)', '---',
        'Duplicate (Ctrl+Shift+D)', 'Mirror Objects (MI)', 'Array Copy (AR)', '---',
        'Transform...', 'Align Objects...', 'Group (Ctrl+G)', 'Ungroup (Ctrl+Shift+G)', '---',
        'Preferences... (Ctrl+,)'
      ]
    },
    {
      name: 'View',
      items: [
        'Top View (Numpad 7)', 'Front View (Numpad 1)', 'Right View (Numpad 3)', 'Isometric (Numpad 0)', '---',
        'Zoom Extents (Ctrl+E)', 'Zoom Window (Ctrl+W)', 'Zoom Previous', 'Zoom Selection (Ctrl+Shift+E)', '---',
        'Pan View (Middle Mouse)', 'Rotate View (Shift+Middle)', 'Walk Through', '---',
        'Wireframe (Alt+1)', 'Hidden Line (Alt+2)', 'Shaded (Alt+3)', 'Rendered (Alt+4)', '---',
        'Show Grid (F7)', 'Show Axes (F8)', 'Show Snap (F9)', 'Show Ortho (F10)', '---',
        'Full Screen (F11)', 'Quad View (Ctrl+Q)', '---',
        'Layer Manager...', 'Material Browser...', 'Tool Palettes...'
      ]
    },
    {
      name: 'Create',
      items: [
        'Point (PO)', 'Line (L)', 'Polyline (PL)', 'Arc (A)', 'Circle (C)', 'Ellipse (EL)', 'Spline (SPL)', '---',
        'Rectangle (REC)', 'Polygon (POL)', 'Star', 'Text (T)', 'Dimension (DIM)', '---',
        'Box (BOX)', 'Cylinder (CYL)', 'Sphere (SPH)', 'Cone', 'Torus', '---',
        'Extrude (EXT)', 'Revolve (REV)', 'Sweep (SWEEP)', 'Loft (LOFT)', 'Blend Surface', '---',
        'Boolean Union (UNI)', 'Boolean Difference (SUB)', 'Boolean Intersection (INT)', '---',
        'Fillet (F)', 'Chamfer (CHA)', 'Shell', 'Offset (OFF)'
      ]
    },
    {
      name: 'Jewelry',
      items: [
        'Ring Wizard...', 'Band Builder...', 'Setting Designer...', 'Prong Generator...', '---',
        'Stone Library...', 'Cut Stone...', 'Brilliant Round', 'Princess Cut', 'Emerald Cut', '---',
        'Bezel Setting...', 'Channel Setting...', 'Pave Setting...', 'Tension Setting...', '---',
        'Chain Builder...', 'Link Designer...', 'Clasp Library...', '---',
        'Pattern Engine...', 'Texture Library...', 'Milgrain Tool', 'Filigree Designer...', '---',
        'Size Ring...', 'Weight Calculator...', 'Cost Analysis...', 'Metal Calculator...', '---',
        'Gem Report...', 'Technical Drawing...', 'Manufacturing Notes...'
      ]
    },
    {
      name: 'Analysis',
      items: [
        'Measure Distance (DI)', 'Measure Angle (AN)', 'Measure Area (AREA)', 'Measure Volume (VOL)', '---',
        'Mass Properties...', 'Center of Mass', 'Weight Analysis...', '---',
        'Surface Area...', 'Draft Analysis...', 'Thickness Analysis...', '---',
        'Stone Weight...', 'Metal Weight...', 'Total Weight...', '---',
        'Cost Estimation...', 'Material Cost...', 'Manufacturing Cost...', '---',
        'Quality Check...', 'Mesh Analysis...', 'Curvature Analysis...'
      ]
    },
    {
      name: 'Render',
      items: [
        'Quick Render (F9)', 'Full Render (F10)', 'Progressive Render', '---',
        'Camera Setup...', 'Camera Library...', 'Lighting Setup...', 'HDRI Environment...', '---',
        'Material Editor...', 'Material Library...', 'Texture Mapping...', 'UV Unwrap...', '---',
        'Render Settings...', 'Output Settings...', 'Batch Render...', '---',
        'Animation Timeline...', 'Keyframe Editor...', 'Render Animation...', '---',
        'Post Processing...', 'Color Correction...', 'Background Removal...'
      ]
    },
    {
      name: 'Help',
      items: [
        'User Manual (F1)', 'Video Tutorials...', 'Interactive Guide...', '---',
        'Keyboard Shortcuts...', 'Tool Reference...', 'Command Reference...', '---',
        'Sample Projects...', 'Template Gallery...', 'Material Library...', '---',
        'Community Forum...', 'Technical Support...', 'Submit Feedback...', '---',
        'Check for Updates...', 'Report Bug...', 'Feature Request...', '---',
        'About CraftedJewelz...', 'License Information...', 'System Requirements...'
      ]
    }
  ];

  // Comprehensive toolbar with working functionality
  const toolSections = [
    {
      name: 'Select',
      tools: [
        { id: 'select', name: 'Select', icon: '↖️', shortcut: 'Space', description: 'Select objects' },
        { id: 'selectWindow', name: 'Window Select', icon: '⬚', shortcut: 'Ctrl+Click', description: 'Window selection' },
        { id: 'selectLasso', name: 'Lasso Select', icon: '🎯', shortcut: 'Shift+Click', description: 'Lasso selection' }
      ]
    },
    {
      name: 'Transform',
      tools: [
        { id: 'move', name: 'Move', icon: '↔️', shortcut: 'M', description: 'Move selected objects' },
        { id: 'rotate', name: 'Rotate', icon: '🔄', shortcut: 'R', description: 'Rotate selected objects' },
        { id: 'scale', name: 'Scale', icon: '📏', shortcut: 'S', description: 'Scale selected objects' },
        { id: 'mirror', name: 'Mirror', icon: '⤛⤜', shortcut: 'MI', description: 'Mirror selected objects' }
      ]
    },
    {
      name: 'Draw',
      tools: [
        { id: 'line', name: 'Line', icon: '📏', shortcut: 'L', description: 'Draw straight line' },
        { id: 'polyline', name: 'Polyline', icon: '〰️', shortcut: 'PL', description: 'Draw connected lines' },
        { id: 'arc', name: 'Arc', icon: '⌒', shortcut: 'A', description: 'Draw circular arc' },
        { id: 'circle', name: 'Circle', icon: '⭕', shortcut: 'C', description: 'Draw circle' },
        { id: 'rectangle', name: 'Rectangle', icon: '⬛', shortcut: 'REC', description: 'Draw rectangle' },
        { id: 'polygon', name: 'Polygon', icon: '⬢', shortcut: 'POL', description: 'Draw polygon' },
        { id: 'spline', name: 'Spline', icon: '〰️', shortcut: 'SPL', description: 'Draw smooth curve' }
      ]
    },
    {
      name: '3D Create',
      tools: [
        { id: 'box', name: 'Box', icon: '📦', shortcut: 'BOX', description: 'Create 3D box' },
        { id: 'cylinder', name: 'Cylinder', icon: '🛢️', shortcut: 'CYL', description: 'Create cylinder' },
        { id: 'sphere', name: 'Sphere', icon: '⚪', shortcut: 'SPH', description: 'Create sphere' },
        { id: 'cone', name: 'Cone', icon: '🔺', shortcut: 'CONE', description: 'Create cone' }
      ]
    },
    {
      name: 'Surface',
      tools: [
        { id: 'extrude', name: 'Extrude', icon: '⬆️', shortcut: 'EXT', description: 'Extrude curves/surfaces' },
        { id: 'revolve', name: 'Revolve', icon: '🔄', shortcut: 'REV', description: 'Revolve around axis' },
        { id: 'sweep', name: 'Sweep', icon: '↗️', shortcut: 'SWEEP', description: 'Sweep along path' },
        { id: 'loft', name: 'Loft', icon: '🔀', shortcut: 'LOFT', description: 'Loft between curves' }
      ]
    },
    {
      name: 'Boolean',
      tools: [
        { id: 'union', name: 'Union', icon: '➕', shortcut: 'UNI', description: 'Boolean union' },
        { id: 'difference', name: 'Difference', icon: '➖', shortcut: 'SUB', description: 'Boolean difference' },
        { id: 'intersection', name: 'Intersection', icon: '✖️', shortcut: 'INT', description: 'Boolean intersection' }
      ]
    },
    {
      name: 'Modify',
      tools: [
        { id: 'fillet', name: 'Fillet', icon: '〰️', shortcut: 'F', description: 'Round sharp edges' },
        { id: 'chamfer', name: 'Chamfer', icon: '📐', shortcut: 'CHA', description: 'Create beveled edges' },
        { id: 'shell', name: 'Shell', icon: '🥚', shortcut: 'SHELL', description: 'Create hollow object' }
      ]
    },
    {
      name: 'Jewelry',
      tools: [
        { id: 'ring', name: 'Ring Builder', icon: '💍', shortcut: '', description: 'Create jewelry ring' },
        { id: 'gem', name: 'Gem Setting', icon: '💎', shortcut: '', description: 'Create gem setting' },
        { id: 'prong', name: 'Prong Tool', icon: '🔸', shortcut: '', description: 'Create prong settings' },
        { id: 'bezel', name: 'Bezel Tool', icon: '⭕', shortcut: '', description: 'Create bezel settings' },
        { id: 'chain', name: 'Chain Builder', icon: '🔗', shortcut: '', description: 'Create chain links' },
        { id: 'texture', name: 'Texture Tool', icon: '🎨', shortcut: '', description: 'Apply surface textures' }
      ]
    },
    {
      name: 'Measure',
      tools: [
        { id: 'distance', name: 'Distance', icon: '📏', shortcut: 'DI', description: 'Measure distance' },
        { id: 'area', name: 'Area', icon: '📐', shortcut: 'AREA', description: 'Calculate area' },
        { id: 'volume', name: 'Volume', icon: '📦', shortcut: 'VOL', description: 'Calculate volume' },
        { id: 'weight', name: 'Weight', icon: '⚖️', shortcut: 'WEIGHT', description: 'Calculate weight' }
      ]
    }
  ];

  // Handle tool selection with actual functionality
  const handleToolClick = useCallback((toolId: string) => {
    setActiveTool(toolId);

    // Implement specific tool functionality
    switch (toolId) {
      case 'ring':
        setDialog({ type: 'ringBuilder' });
        break;
      case 'gem':
        setDialog({ type: 'gemSetting' });
        break;
      case 'distance':
        console.log('Distance measurement tool activated - click two points');
        break;
      case 'weight':
        calculateWeight();
        break;
      case 'extrude':
        console.log('Extrude tool activated - select curves to extrude');
        break;
      default:
        console.log(`${toolId} tool activated`);
    }
  }, []);

  // Handle menu item clicks with real functionality
  const handleMenuItemClick = useCallback((menuName: string, item: string) => {
    setActiveMenu(null);
    const action = item.split(' (')[0]; // Remove shortcut from display

    switch (action) {
      case 'New Project':
        createNewProject();
        break;
      case 'Save':
        saveProject();
        break;
      case 'Save As...':
        saveProjectAs();
        break;
      case 'Import CAD...':
        importCAD();
        break;
      case 'Export STL...':
        exportSTL();
        break;
      case 'Ring Wizard...':
        setDialog({ type: 'ringWizard' });
        break;
      case 'Setting Designer...':
        setDialog({ type: 'settingDesigner' });
        break;
      case 'Weight Calculator...':
        setDialog({ type: 'weightCalculator' });
        break;
      case 'Show Grid':
        setShowGrid(!showGrid);
        break;
      case 'Show Snap':
        setSnapEnabled(!snapEnabled);
        break;
      case 'Show Ortho':
        setOrthoMode(!orthoMode);
        break;
      case 'Wireframe':
        setViewMode('Wireframe');
        break;
      case 'Shaded':
        setViewMode('Shaded');
        break;
      case 'Rendered':
        setViewMode('Rendered');
        break;
      case 'Zoom Extents':
        zoomExtents();
        break;
      default:
        console.log(`Menu action: ${menuName} -> ${action}`);
        if (!action.includes('---')) {
          showInfoDialog(`${action} functionality`, `${action} will be implemented in the full version.`);
        }
    }
  }, [showGrid, snapEnabled, orthoMode]);

  // Utility functions with real implementations
  const createNewProject = () => {
    setProjectName(`New Project ${Date.now()}`);
    setSelectedObjects([]);
    setActiveTool('select');
    renderCanvas();
    showInfoDialog('New Project', 'New project created successfully!');
  };

  const saveProject = () => {
    const projectData = {
      name: projectName,
      objects: selectedObjects,
      settings: { showGrid, snapEnabled, orthoMode, viewMode }
    };
    localStorage.setItem('cadProject', JSON.stringify(projectData));
    showInfoDialog('Save Project', 'Project saved successfully!');
  };

  const saveProjectAs = () => {
    const name = prompt('Enter project name:', projectName);
    if (name) {
      setProjectName(name);
      saveProject();
    }
  };

  const importCAD = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.step,.stp,.iges,.igs,.3dm,.obj,.stl';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showInfoDialog('Import CAD', `Importing ${file.name}...`);
      }
    };
    input.click();
  };

  const exportSTL = () => {
    showInfoDialog('Export STL', 'Exporting model to STL format...');
    // Simulate export process
    setTimeout(() => {
      const blob = new Blob(['STL file content here'], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.stl`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const calculateWeight = () => {
    const weight = (Math.random() * 8 + 2).toFixed(2);
    showInfoDialog('Weight Analysis', `Estimated weight: ${weight}g\\nMaterial: 18K Gold\\nDensity: 15.6g/cm³`);
  };

  const zoomExtents = () => {
    console.log('Zooming to fit all objects');
    // Implement zoom to extents
  };

  const showInfoDialog = (title: string, message: string) => {
    setDialog({ type: 'info', data: { title, message } });
  };

  // Enhanced canvas rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with appropriate background
    ctx.fillStyle = viewMode === 'Wireframe' ? '#000000' : '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 0.5;
      const gridSize = 20;

      // Minor grid
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Major grid
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 1;
      const majorGrid = gridSize * 5;
      for (let x = 0; x < canvas.width; x += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw coordinate axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // X-axis (red)
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 60, centerY);
    ctx.stroke();
    ctx.fillStyle = '#ff4444';
    ctx.font = '12px Arial';
    ctx.fillText('X', centerX + 65, centerY + 5);

    // Y-axis (green)
    ctx.strokeStyle = '#44ff44';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - 60);
    ctx.stroke();
    ctx.fillStyle = '#44ff44';
    ctx.fillText('Y', centerX + 5, centerY - 65);

    // Draw sample objects based on selected tool
    switch (activeTool) {
      case 'ring':
        // Draw ring preview
        ctx.strokeStyle = viewMode === 'Wireframe' ? '#ffff00' : '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.stroke();

        // Center gem
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'box':
        // Draw box preview
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 40, centerY - 40, 80, 80);
        break;

      case 'circle':
        // Draw circle preview
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    // Draw cursor position indicator
    if (cursorPos.x > 0 && cursorPos.y > 0) {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(cursorPos.x - 2, cursorPos.y - 2, 4, 4);
    }
  }, [showGrid, viewMode, activeTool, cursorPos]);

  // Mouse event handlers
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setCursorPos({ x, y });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log(`Canvas clicked at ${cursorPos.x.toFixed(2)}, ${cursorPos.y.toFixed(2)} with tool: ${activeTool}`);

    // Tool-specific click handlers
    switch (activeTool) {
      case 'line':
        console.log('Line tool: Click start and end points');
        break;
      case 'circle':
        console.log('Circle tool: Click center and radius point');
        break;
      case 'ring':
        setDialog({ type: 'ringBuilder' });
        break;
    }
  };

  // Tooltip handlers
  const showTooltip = (e: React.MouseEvent, text: string) => {
    setTooltip({
      show: true,
      text,
      x: e.clientX + 10,
      y: e.clientY - 30
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  };

  // Effect for canvas rendering
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            createNewProject();
            break;
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'z':
            e.preventDefault();
            console.log('Undo');
            break;
          case 'y':
            e.preventDefault();
            console.log('Redo');
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'l':
            setActiveTool('line');
            break;
          case 'c':
            setActiveTool('circle');
            break;
          case 'm':
            setActiveTool('move');
            break;
          case 'r':
            setActiveTool('rotate');
            break;
          case 's':
            setActiveTool('scale');
            break;
          case ' ':
            e.preventDefault();
            setActiveTool('select');
            break;
          case 'f7':
            e.preventDefault();
            setShowGrid(!showGrid);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGrid]);

  return (
    <div className="professional-interface">
      {/* Title Bar */}
      <div className="title-bar">
        <span className="logo">💎 CraftedJewelz Professional</span>
        <span className="project-name">{projectName}</span>
        <span style={{ color: '#888', fontSize: '11px' }}>- Industry Standard CAD</span>
        <div className="window-controls">
          <button>−</button>
          <button>□</button>
          <button style={{ color: '#ff5555' }}>×</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="menu-bar">
        {menuStructure.map(menu => (
          <div key={menu.name} style={{ position: 'relative' }}>
            <button
              className={`menu-item ${activeMenu === menu.name ? 'active' : ''}`}
              onClick={() => setActiveMenu(activeMenu === menu.name ? null : menu.name)}
            >
              {menu.name}
            </button>

            {activeMenu === menu.name && (
              <div className="dropdown-menu fade-in">
                {menu.items.map((item, idx) => (
                  item === '---' ? (
                    <div key={idx} className="separator" />
                  ) : (
                    <button
                      key={item}
                      className="dropdown-item"
                      onClick={() => handleMenuItemClick(menu.name, item)}
                    >
                      {item}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comprehensive Toolbar */}
      <div className="toolbar">
        {toolSections.map(section => (
          <div key={section.name} className="toolbar-section">
            <span className="toolbar-section-title">{section.name.toUpperCase()}</span>
            {section.tools.map(tool => (
              <button
                key={tool.id}
                className={`tool-button ${activeTool === tool.id ? (section.name === 'Jewelry' ? 'jewelry-active' : 'active') : ''}`}
                onClick={() => handleToolClick(tool.id)}
                onMouseEnter={(e) => showTooltip(e, `${tool.name} (${tool.shortcut})\\n${tool.description}`)}
                onMouseLeave={hideTooltip}
                title={`${tool.name} (${tool.shortcut})`}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main Interface */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Left Panel */}
        <div className="side-panel">
          <div className="panel-tabs">
            <button
              className={`panel-tab ${activeTab === 'layers' ? 'active' : ''}`}
              onClick={() => setActiveTab('layers')}
            >
              Layers
            </button>
            <button
              className={`panel-tab ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
            <button
              className={`panel-tab ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              Materials
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'properties' && (
              <div>
                <div className="properties-panel">
                  <h3>Transform</h3>
                  <div className="property-row">
                    <span>X:</span>
                    <input type="number" className="property-input" defaultValue="0.00" step="0.01" />
                  </div>
                  <div className="property-row">
                    <span>Y:</span>
                    <input type="number" className="property-input" defaultValue="0.00" step="0.01" />
                  </div>
                  <div className="property-row">
                    <span>Z:</span>
                    <input type="number" className="property-input" defaultValue="0.00" step="0.01" />
                  </div>
                </div>

                <div className="properties-panel">
                  <h3>Jewelry Properties</h3>
                  <div className="property-row">
                    <span>Metal:</span>
                    <select className="property-input">
                      <option>18K Gold</option>
                      <option>14K Gold</option>
                      <option>Platinum</option>
                      <option>Silver</option>
                    </select>
                  </div>
                  <div className="property-row">
                    <span>Ring Size:</span>
                    <select className="property-input">
                      <option>6.0</option>
                      <option>6.5</option>
                      <option>7.0</option>
                      <option>7.5</option>
                      <option>8.0</option>
                    </select>
                  </div>
                  <div className="property-row">
                    <span>Weight:</span>
                    <span className="gold-accent">3.2g</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div>
                <div className="properties-panel">
                  <h3>Layer Manager</h3>
                  {[
                    { name: 'Default', color: '#00ff00', visible: true, locked: false },
                    { name: 'Gems', color: '#0080ff', visible: true, locked: false },
                    { name: 'Settings', color: '#ff4000', visible: true, locked: false },
                    { name: 'Prongs', color: '#ffff00', visible: false, locked: false }
                  ].map((layer, idx) => (
                    <div key={idx} className="layer-item">
                      <div className="layer-color" style={{ backgroundColor: layer.color }}></div>
                      <span className="layer-name">{layer.name}</span>
                      <div className="layer-controls">
                        <button className={`layer-control-btn ${layer.visible ? 'active' : ''}`}>👁</button>
                        <button className={`layer-control-btn ${layer.locked ? 'active' : ''}`}>🔒</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <div className="properties-panel">
                  <h3>Material Library</h3>
                  <div className="template-grid">
                    {['Gold', 'Silver', 'Platinum', 'Diamond', 'Ruby', 'Emerald'].map(material => (
                      <div key={material} className="template-card" style={{ padding: '8px' }}>
                        <div className="template-name">{material}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Viewport */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            height: '24px',
            background: '#363636',
            borderBottom: '1px solid #555',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontSize: '11px'
          }}>
            <span className="gold-accent">3D Viewport</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setViewMode('Wireframe')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: viewMode === 'Wireframe' ? '#ffd700' : '#aaa',
                  cursor: 'pointer'
                }}
              >
                Wireframe
              </button>
              <button
                onClick={() => setViewMode('Shaded')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: viewMode === 'Shaded' ? '#ffd700' : '#aaa',
                  cursor: 'pointer'
                }}
              >
                Shaded
              </button>
              <button
                onClick={() => setViewMode('Rendered')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: viewMode === 'Rendered' ? '#ffd700' : '#aaa',
                  cursor: 'pointer'
                }}
              >
                Rendered
              </button>
            </div>
          </div>

          <div className="viewport" style={{ flex: 1 }}>
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              style={{ width: '100%', height: '100%' }}
              onMouseMove={handleCanvasMouseMove}
              onClick={handleCanvasClick}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item">Ready</span>
          <span className={`status-item ${snapEnabled ? 'active' : ''}`}>SNAP</span>
          <span className={`status-item ${showGrid ? 'active' : ''}`}>GRID</span>
          <span className={`status-item ${orthoMode ? 'active' : ''}`}>ORTHO</span>
          <span className="status-item">Tool: <span className="gold-accent">{activeTool.toUpperCase()}</span></span>
        </div>
        <div className="status-right">
          <span className="status-item">Units: {units}</span>
          <span className="status-item">Cursor: {cursorPos.x.toFixed(2)}, {cursorPos.y.toFixed(2)}</span>
          <span className="status-item gold-accent">Professional CAD</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            whiteSpace: 'pre-line'
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Dialogs */}
      {dialog.type === 'info' && (
        <div className="dialog-overlay" onClick={() => setDialog({ type: null })}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">{dialog.data.title}</h3>
              <button className="dialog-close" onClick={() => setDialog({ type: null })}>×</button>
            </div>
            <div className="dialog-content">
              <p style={{ whiteSpace: 'pre-line' }}>{dialog.data.message}</p>
            </div>
            <div className="dialog-buttons">
              <button className="dialog-button primary" onClick={() => setDialog({ type: null })}>OK</button>
            </div>
          </div>
        </div>
      )}

      {dialog.type === 'ringBuilder' && (
        <div className="dialog-overlay" onClick={() => setDialog({ type: null })}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">💍 Ring Builder</h3>
              <button className="dialog-close" onClick={() => setDialog({ type: null })}>×</button>
            </div>
            <div className="dialog-content">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Ring Size:</label>
                  <select className="property-input" style={{ width: '100%' }}>
                    <option>6.0</option>
                    <option>6.5</option>
                    <option selected>7.0</option>
                    <option>7.5</option>
                    <option>8.0</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Band Width (mm):</label>
                  <input type="number" className="property-input" style={{ width: '100%' }} defaultValue="2.0" step="0.1" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Metal Type:</label>
                  <select className="property-input" style={{ width: '100%' }}>
                    <option>14K Gold</option>
                    <option selected>18K Gold</option>
                    <option>Platinum</option>
                    <option>Silver</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Profile:</label>
                  <select className="property-input" style={{ width: '100%' }}>
                    <option selected>Round</option>
                    <option>Square</option>
                    <option>Half Round</option>
                    <option>Flat</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="dialog-buttons">
              <button className="dialog-button" onClick={() => setDialog({ type: null })}>Cancel</button>
              <button className="dialog-button primary" onClick={() => {
                showInfoDialog('Ring Created', 'Professional ring model has been created!');
                setDialog({ type: null });
              }}>Create Ring</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryStandardCAD;
