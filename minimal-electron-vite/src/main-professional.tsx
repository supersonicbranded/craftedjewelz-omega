import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// INDUSTRY-GRADE PROFESSIONAL JEWELRY CAD SOFTWARE
// Competing directly with MatrixGold, Rhino, Blender standards

const ProfessionalJewelryCAD: React.FC = () => {
  // Professional state management like industry CAD software
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeWorkspace, setActiveWorkspace] = useState('modeling');
  const [selectedTool, setSelectedTool] = useState('select');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState('Untitled Design');
  const [viewportMode, setViewportMode] = useState('perspective');
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  // Professional viewport states
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 10 });
  const [objects, setObjects] = useState<any[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [gridVisible, setGridVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Professional command system like Blender/MatrixGold
  const commands = {
    'ring': () => console.log('Creating ring...'),
    'extrude': () => console.log('Extruding selection...'),
    'scale': () => setSelectedTool('scale'),
    'rotate': () => setSelectedTool('rotate'),
    'move': () => setSelectedTool('move'),
    'duplicate': () => console.log('Duplicating objects...'),
    'delete': () => console.log('Deleting selected objects...'),
    'save': () => console.log('Saving project...'),
    'render': () => console.log('Starting render...'),
    'material': () => setActivePanel('materials'),
    'gem': () => console.log('Adding gemstone...'),
    'prong': () => console.log('Creating prongs...'),
    'band': () => console.log('Creating band...'),
    'watch': () => console.log('Creating watch...'),
    'glasses': () => console.log('Creating glasses...'),
  };

  // Command execution like professional CAD
  const executeCommand = useCallback((cmd: string) => {
    const command = commands[cmd.toLowerCase() as keyof typeof commands];
    if (command) {
      command();
      setRecentCommands(prev => [cmd, ...prev.slice(0, 9)]);
    }
    setCommandInput('');
    setIsCommandMode(false);
  }, []);

  // Keyboard shortcuts like professional software
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command mode toggle (Tab key like Blender)
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        setIsCommandMode(!isCommandMode);
        return;
      }

      // Professional shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's': e.preventDefault(); executeCommand('save'); break;
          case 'n': e.preventDefault(); console.log('New project'); break;
          case 'o': e.preventDefault(); console.log('Open project'); break;
          case 'z': e.preventDefault(); console.log('Undo'); break;
          case 'y': e.preventDefault(); console.log('Redo'); break;
          case 'd': e.preventDefault(); executeCommand('duplicate'); break;
        }
      }

      // Tool shortcuts
      switch (e.key) {
        case 'g': setSelectedTool('move'); break;
        case 'r': setSelectedTool('rotate'); break;
        case 's': if (!e.ctrlKey) setSelectedTool('scale'); break;
        case 'Delete': executeCommand('delete'); break;
        case 'Escape': setSelectedTool('select'); setIsCommandMode(false); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandMode, executeCommand]);

  // Professional tool definitions
  const professionalToolsets = {
    modeling: [
      { id: 'select', icon: '⬇', name: 'Select', shortcut: 'SPACE', category: 'selection' },
      { id: 'move', icon: '↗', name: 'Move', shortcut: 'G', category: 'transform' },
      { id: 'rotate', icon: '↻', name: 'Rotate', shortcut: 'R', category: 'transform' },
      { id: 'scale', icon: '⤢', name: 'Scale', shortcut: 'S', category: 'transform' },
      '---',
      { id: 'extrude', icon: '⬆', name: 'Extrude', shortcut: 'E', category: 'modeling' },
      { id: 'inset', icon: '⬜', name: 'Inset Faces', shortcut: 'I', category: 'modeling' },
      { id: 'bevel', icon: '◈', name: 'Bevel', shortcut: 'CTRL+B', category: 'modeling' },
      { id: 'loopcut', icon: '✂', name: 'Loop Cut', shortcut: 'CTRL+R', category: 'modeling' },
      '---',
      { id: 'ring_builder', icon: '💍', name: 'Ring Builder', shortcut: 'ALT+R', category: 'jewelry' },
      { id: 'gem_setter', icon: '💎', name: 'Gem Setter', shortcut: 'ALT+G', category: 'jewelry' },
      { id: 'prong_tool', icon: '⟡', name: 'Prong Tool', shortcut: 'ALT+P', category: 'jewelry' },
      { id: 'watch_builder', icon: '⌚', name: 'Watch Builder', shortcut: 'ALT+W', category: 'jewelry' },
      { id: 'glasses_builder', icon: '🕶', name: 'Glasses Builder', shortcut: 'ALT+E', category: 'jewelry' },
    ],
    sculpting: [
      { id: 'grab', icon: '✋', name: 'Grab', shortcut: 'G', category: 'sculpt' },
      { id: 'smooth', icon: '〰', name: 'Smooth', shortcut: 'S', category: 'sculpt' },
      { id: 'inflate', icon: '🔵', name: 'Inflate', shortcut: 'I', category: 'sculpt' },
      { id: 'clay', icon: '🏺', name: 'Clay Strips', shortcut: 'C', category: 'sculpt' },
    ],
    texturing: [
      { id: 'texture_paint', icon: '🎨', name: 'Texture Paint', shortcut: 'T', category: 'texture' },
      { id: 'pattern_fill', icon: '▦', name: 'Pattern Fill', shortcut: 'P', category: 'texture' },
      { id: 'engrave', icon: '⚒', name: 'Engraving', shortcut: 'N', category: 'texture' },
    ]
  };

  // Professional panels like MatrixGold
  const panels = [
    { id: 'outliner', title: 'Scene Outliner', icon: '📋' },
    { id: 'properties', title: 'Properties', icon: '⚙' },
    { id: 'materials', title: 'Materials', icon: '🎨' },
    { id: 'modifiers', title: 'Modifiers', icon: '🔧' },
    { id: 'constraints', title: 'Constraints', icon: '🔗' },
    { id: 'render', title: 'Render Settings', icon: '📷' },
    { id: 'animation', title: 'Animation', icon: '🎬' },
    { id: 'jewelry', title: 'Jewelry Tools', icon: '💍' },
  ];

  // Render professional 3D viewport (simulation)
  const renderViewport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Professional dark viewport
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Professional grid
    if (gridVisible) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      const gridSize = 20;

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
    }

    // Center axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // X axis (red)
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 50, centerY);
    ctx.stroke();

    // Y axis (green)
    ctx.strokeStyle = '#44ff44';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - 50);
    ctx.stroke();

    // Z axis (blue)
    ctx.strokeStyle = '#4444ff';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - 35, centerY + 35);
    ctx.stroke();

    // 3D cursor
    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 2, centerY - 2, 4, 4);

    // Sample objects
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX + 100, centerY - 50, 30, 0, Math.PI * 2);
    ctx.fill();

    // Selection outline
    if (selectedObjects.length > 0) {
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  useEffect(() => {
    renderViewport();
  }, [gridVisible, selectedObjects]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#2b2b2b',
      color: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* PROFESSIONAL TITLE BAR - Industry Standard */}
      <div style={{
        height: '32px',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        borderBottom: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000'
          }}>CJ</div>
          <span style={{ fontWeight: '600', color: '#FFD700' }}>CraftedJewelz Pro</span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ color: '#ccc' }}>{currentProject}</span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ color: '#888', fontSize: '11px' }}>Scene Collection</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '1px' }}>
          <button style={{ width: '28px', height: '20px', background: 'transparent', border: 'none', color: '#ccc', fontSize: '12px' }}>−</button>
          <button style={{ width: '28px', height: '20px', background: 'transparent', border: 'none', color: '#ccc', fontSize: '11px' }}>□</button>
          <button style={{ width: '28px', height: '20px', background: 'transparent', border: 'none', color: '#ff5f56', fontSize: '12px' }}>×</button>
        </div>
      </div>

      {/* PROFESSIONAL MENU BAR - MatrixGold/Blender Style */}
      <div style={{
        height: '28px',
        background: '#2f2f2f',
        borderBottom: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        fontSize: '13px'
      }}>
        {[
          { name: 'File', items: ['New', 'Open', 'Save', 'Save As', 'Import', 'Export', 'Print'] },
          { name: 'Edit', items: ['Undo', 'Redo', 'Copy', 'Paste', 'Duplicate', 'Delete'] },
          { name: 'Add', items: ['Mesh', 'Curve', 'Surface', 'Metaball', 'Text', 'Armature', 'Lattice'] },
          { name: 'Object', items: ['Transform', 'Mirror', 'Clear', 'Apply', 'Relations', 'Collection'] },
          { name: 'Jewelry', items: ['Ring Builder', 'Gem Setter', 'Chain Maker', 'Watch Creator', 'Glasses Designer'] },
          { name: 'Mesh', items: ['Vertices', 'Edges', 'Faces', 'Cleanup', 'Normals', 'Shading'] },
          { name: 'Modifier', items: ['Generate', 'Deform', 'Physics', 'Jewelry Specific'] },
          { name: 'Render', items: ['Render Image', 'Render Animation', 'View Render'] },
          { name: 'Window', items: ['Toggle Fullscreen', 'Areas', 'Workspaces'] },
          { name: 'Help', items: ['Manual', 'Tutorials', 'Community', 'About'] }
        ].map(menu => (
          <div key={menu.name} style={{ position: 'relative' }}>
            <button
              onMouseEnter={() => setActivePanel(menu.name)}
              style={{
                background: activePanel === menu.name ? '#404040' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {menu.name}
            </button>
          </div>
        ))}
      </div>

      {/* PROFESSIONAL WORKSPACE TABS - Industry Standard */}
      <div style={{
        height: '32px',
        background: '#363636',
        borderBottom: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px'
      }}>
        {[
          { id: 'modeling', name: 'Modeling', icon: '🔧' },
          { id: 'sculpting', name: 'Sculpting', icon: '🏺' },
          { id: 'shading', name: 'Shading', icon: '🎨' },
          { id: 'animation', name: 'Animation', icon: '🎬' },
          { id: 'rendering', name: 'Rendering', icon: '📷' },
          { id: 'jewelry', name: 'Jewelry CAD', icon: '💍' },
        ].map(workspace => (
          <button
            key={workspace.id}
            onClick={() => setActiveWorkspace(workspace.id)}
            style={{
              background: activeWorkspace === workspace.id ?
                'linear-gradient(135deg, #FFD700, #FFA500)' : '#404040',
              border: 'none',
              color: activeWorkspace === workspace.id ? '#000' : '#fff',
              padding: '6px 16px',
              marginRight: '2px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '3px'
            }}
          >
            <span>{workspace.icon}</span>
            <span>{workspace.name}</span>
          </button>
        ))}
      </div>

      {/* MAIN INTERFACE LAYOUT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT TOOLBAR - Professional Tool Palette */}
        <div style={{
          width: '60px',
          background: '#323232',
          borderRight: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column',
          padding: '8px 4px'
        }}>
          {professionalToolsets[activeWorkspace as keyof typeof professionalToolsets]?.map((tool, index) =>
            tool === '---' ? (
              <div key={`sep-${index}`} style={{
                height: '1px',
                background: '#404040',
                margin: '4px 8px'
              }} />
            ) : (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                title={`${tool.name} (${tool.shortcut})`}
                style={{
                  width: '48px',
                  height: '48px',
                  background: selectedTool === tool.id ?
                    'linear-gradient(135deg, #FFD700, #FFA500)' : '#404040',
                  border: selectedTool === tool.id ? '2px solid #FFB000' : '1px solid #555',
                  color: selectedTool === tool.id ? '#000' : '#fff',
                  cursor: 'pointer',
                  marginBottom: '2px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.1s'
                }}
                onMouseEnter={e => {
                  if (selectedTool !== tool.id) {
                    e.currentTarget.style.background = '#4a4a4a';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedTool !== tool.id) {
                    e.currentTarget.style.background = '#404040';
                  }
                }}
              >
                {tool.icon}
              </button>
            )
          )}
        </div>

        {/* CENTER - MAIN 3D VIEWPORT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Viewport Header */}
          <div style={{
            height: '28px',
            background: '#404040',
            borderBottom: '1px solid #555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={viewportMode}
                onChange={e => setViewportMode(e.target.value)}
                style={{
                  background: '#2a2a2a',
                  border: '1px solid #555',
                  color: '#fff',
                  padding: '2px 6px',
                  fontSize: '11px'
                }}
              >
                <option value="perspective">Perspective</option>
                <option value="orthographic">Orthographic</option>
                <option value="camera">Camera</option>
              </select>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setGridVisible(!gridVisible)}
                  style={{
                    background: gridVisible ? '#FFD700' : '#555',
                    border: 'none',
                    color: gridVisible ? '#000' : '#fff',
                    padding: '2px 8px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  GRID
                </button>
                <button
                  onClick={() => setSnapEnabled(!snapEnabled)}
                  style={{
                    background: snapEnabled ? '#FFD700' : '#555',
                    border: 'none',
                    color: snapEnabled ? '#000' : '#fff',
                    padding: '2px 8px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  SNAP
                </button>
              </div>
            </div>

            <div style={{ color: '#aaa', fontSize: '11px' }}>
              Objects: {objects.length} | Selected: {selectedObjects.length} | Tool: {selectedTool}
            </div>
          </div>

          {/* 3D VIEWPORT CANVAS */}
          <div style={{ flex: 1, position: 'relative', background: '#1a1a1a' }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              style={{
                width: '100%',
                height: '100%',
                cursor: selectedTool === 'select' ? 'default' : 'crosshair'
              }}
              onClick={() => {
                // Simulate object selection
                if (selectedTool === 'select') {
                  setSelectedObjects(['Object_001']);
                }
              }}
            />

            {/* PROFESSIONAL VIEWPORT OVERLAYS */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.8)',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#fff'
            }}>
              <div>View: {viewportMode}</div>
              <div>X: {cameraPosition.x.toFixed(2)}</div>
              <div>Y: {cameraPosition.y.toFixed(2)}</div>
              <div>Z: {cameraPosition.z.toFixed(2)}</div>
            </div>

            {/* PROFESSIONAL GIZMO */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              background: 'rgba(0,0,0,0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  width: '20px',
                  height: '2px',
                  background: '#ff4444',
                  top: '0',
                  left: '0'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '2px',
                  height: '20px',
                  background: '#44ff44',
                  top: '-10px',
                  left: '10px'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '14px',
                  height: '2px',
                  background: '#4444ff',
                  top: '10px',
                  left: '-7px',
                  transform: 'rotate(45deg)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANELS - Professional Property Panels */}
        <div style={{
          width: '300px',
          background: '#2a2a2a',
          borderLeft: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* Panel Tabs */}
          <div style={{
            display: 'flex',
            background: '#323232',
            borderBottom: '1px solid #404040',
            flexWrap: 'wrap'
          }}>
            {panels.slice(0, 4).map(panel => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id)}
                title={panel.title}
                style={{
                  width: '36px',
                  height: '32px',
                  background: activePanel === panel.id ? '#FFD700' : '#404040',
                  border: 'none',
                  color: activePanel === panel.id ? '#000' : '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {panel.icon}
              </button>
            ))}
          </div>

          {/* Active Panel Content */}
          <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
            {activePanel === 'properties' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Transform</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>X</label>
                    <input type="number" defaultValue="0.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Y</label>
                    <input type="number" defaultValue="0.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Z</label>
                    <input type="number" defaultValue="0.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                </div>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Rotation</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>X°</label>
                    <input type="number" defaultValue="0" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Y°</label>
                    <input type="number" defaultValue="0" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Z°</label>
                    <input type="number" defaultValue="0" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                </div>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Scale</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>X</label>
                    <input type="number" defaultValue="1.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Y</label>
                    <input type="number" defaultValue="1.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#ccc', display: 'block' }}>Z</label>
                    <input type="number" defaultValue="1.000" style={{
                      width: '100%', background: '#1a1a1a', border: '1px solid #555',
                      color: '#fff', padding: '4px', fontSize: '11px'
                    }} />
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'materials' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Material Properties</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: '14K Yellow Gold', color: '#FFD700' },
                    { name: '18K White Gold', color: '#E5E7EB' },
                    { name: 'Platinum', color: '#D1D5DB' },
                    { name: 'Sterling Silver', color: '#C0C0C0' },
                    { name: '14K Rose Gold', color: '#E8B4B8' },
                    { name: 'Titanium', color: '#686A6C' }
                  ].map(material => (
                    <button key={material.name} style={{
                      background: material.color,
                      color: material.name.includes('White') || material.name.includes('Silver') ? '#000' : '#000',
                      border: '1px solid #555',
                      padding: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {material.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'jewelry' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Jewelry Tools</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { name: 'Ring Size Calculator', icon: '📏' },
                    { name: 'Gemstone Library', icon: '💎' },
                    { name: 'Prong Generator', icon: '⟡' },
                    { name: 'Chain Builder', icon: '🔗' },
                    { name: 'Texture Library', icon: '🎨' },
                    { name: 'Watch Components', icon: '⌚' },
                    { name: 'Glasses Designer', icon: '🕶' },
                    { name: 'Weight Calculator', icon: '⚖' },
                    { name: 'Cost Estimator', icon: '💰' }
                  ].map(tool => (
                    <button key={tool.name} style={{
                      background: '#404040',
                      border: '1px solid #555',
                      color: '#fff',
                      padding: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left'
                    }}>
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activePanel === 'outliner' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFD700' }}>Scene Collection</h3>
                <div style={{ fontSize: '12px' }}>
                  <div style={{ marginBottom: '8px', paddingLeft: '12px' }}>
                    📂 Collection
                    <div style={{ marginLeft: '16px', marginTop: '4px' }}>
                      <div style={{ color: selectedObjects.includes('Ring_001') ? '#FFD700' : '#ccc', cursor: 'pointer' }}>
                        💍 Ring_001
                      </div>
                      <div style={{ color: '#888', cursor: 'pointer' }}>
                        💎 Gem_001
                      </div>
                      <div style={{ color: '#888', cursor: 'pointer' }}>
                        ⟡ Prongs
                      </div>
                      <div style={{ color: '#888', cursor: 'pointer' }}>
                        📷 Camera
                      </div>
                      <div style={{ color: '#888', cursor: 'pointer' }}>
                        💡 Light
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROFESSIONAL STATUS BAR */}
      <div style={{
        height: '24px',
        background: '#1e1e1e',
        borderTop: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '11px',
        color: '#aaa'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: snapEnabled ? '#FFD700' : '#666' }}>SNAP</span>
          <span style={{ color: gridVisible ? '#FFD700' : '#666' }}>GRID</span>
          <span>ORTHO</span>
          <span>LAYER: 1</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Verts: 1,234 | Edges: 2,345 | Faces: 876</span>
          <span>Memory: 1.2GB</span>
          <span style={{ color: '#FFD700' }}>CraftedJewelz Pro v3.0</span>
        </div>
      </div>

      {/* PROFESSIONAL COMMAND PALETTE - Like Blender */}
      {isCommandMode && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.95)',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '400px',
          zIndex: 10000
        }}>
          <div style={{ marginBottom: '12px', fontSize: '14px', color: '#FFD700', fontWeight: '600' }}>
            Search Menu
          </div>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && commandInput) {
                executeCommand(commandInput);
              }
            }}
            placeholder="Type command (ring, extrude, scale, etc.)"
            autoFocus
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid #555',
              color: '#fff',
              padding: '8px',
              fontSize: '14px',
              marginBottom: '12px'
            }}
          />
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            Recent: {recentCommands.slice(0, 5).join(', ') || 'None'}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
            Press TAB to close, ENTER to execute
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProfessionalJewelryCAD />
  </React.StrictMode>,
);
