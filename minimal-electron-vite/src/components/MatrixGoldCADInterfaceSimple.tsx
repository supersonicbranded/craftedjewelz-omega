import React, { useState, useRef } from 'react';

// Simplified but professional MatrixGold-style interface
const MatrixGoldCADInterface: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // MatrixGold main menu structure
  const mainMenus = [
    {
      name: 'File',
      items: ['New Project', 'Open...', 'Save', 'Export...', 'Exit']
    },
    {
      name: 'Edit',
      items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Delete']
    },
    {
      name: 'View',
      items: ['Zoom Extents', 'Wireframe', 'Shaded', 'Grid', 'Properties']
    },
    {
      name: 'Tools',
      items: ['Distance', 'Area', 'Options...']
    },
    {
      name: 'Jewelry',
      items: ['Ring Builder', 'Setting Designer', 'Stone Library']
    },
    {
      name: 'Help',
      items: ['Contents', 'About MatrixGold...']
    }
  ];

  // Professional toolbar tools
  const toolbarTools = [
    { id: 'select', icon: '↖', tooltip: 'Select Objects' },
    { id: 'move', icon: '⤴', tooltip: 'Move' },
    { id: 'rotate', icon: '↻', tooltip: 'Rotate' },
    { id: 'line', icon: '╱', tooltip: 'Line' },
    { id: 'circle', icon: '○', tooltip: 'Circle' },
    { id: 'rectangle', icon: '▭', tooltip: 'Rectangle' }
  ];

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <div className="professional-interface w-full h-screen flex flex-col">
      {/* Title Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 text-sm border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="gold-accent font-bold text-lg">MatrixGold</span>
          <span className="text-gray-400">- Professional Jewelry CAD</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white">_</button>
          <button className="text-gray-400 hover:text-white">□</button>
          <button className="text-gray-400 hover:text-white">×</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-800 border-b border-gray-600 px-2">
        <div className="flex items-center">
          {mainMenus.map((menu) => (
            <div key={menu.name} className="relative">
              <button
                onClick={() => handleMenuClick(menu.name)}
                className={`px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors ${
                  activeMenu === menu.name ? 'bg-gray-700' : ''
                }`}
              >
                {menu.name}
              </button>
              {activeMenu === menu.name && (
                <div className="dropdown-menu top-full left-0">
                  {menu.items.map((item) => (
                    <div key={item} className="dropdown-item">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-600 px-4 py-2">
        <div className="flex items-center space-x-1">
          {toolbarTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`icon-button ${selectedTool === tool.id ? 'bg-blue-600 border-blue-500' : ''}`}
              title={tool.tooltip}
            >
              {tool.icon}
            </button>
          ))}
          <div className="w-px h-8 bg-gray-600 mx-2" />
          <button
            onClick={() => setShowTemplates(true)}
            className="toolbar-button"
          >
            📋 Templates
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-64 bg-gray-800 border-r border-gray-600 p-4">
          <div className="properties-panel">
            <h3>Layers</h3>
            <div className="space-y-2">
              <div className="property-row">
                <span className="text-sm">0 - Default</span>
                <button className="w-4 h-4 bg-green-500 rounded"></button>
              </div>
              <div className="property-row">
                <span className="text-sm">1 - Gems</span>
                <button className="w-4 h-4 bg-blue-500 rounded"></button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 viewport relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: 'radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 100%)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4">💍</div>
                <div className="text-xl font-semibold gold-accent">MatrixGold Professional CAD</div>
                <div className="text-sm mt-2">Professional Jewelry Design Interface</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-gray-800 border-l border-gray-600 p-4">
          <div className="properties-panel">
            <h3>Properties</h3>
            <div className="space-y-3">
              <div className="property-row">
                <span className="text-sm">X:</span>
                <input type="number" className="property-input" defaultValue="0.00" />
              </div>
              <div className="property-row">
                <span className="text-sm">Y:</span>
                <input type="number" className="property-input" defaultValue="0.00" />
              </div>
              <div className="property-row">
                <span className="text-sm">Z:</span>
                <input type="number" className="property-input" defaultValue="0.00" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>SNAP</span>
          <span>GRID</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Units: mm</span>
          <span className="gold-accent">MatrixGold Professional</span>
        </div>
      </div>

      {/* Simple Template Dialog */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold gold-accent">Jewelry Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="template-card">
                <div className="template-preview">💍</div>
                <h4 className="font-semibold text-sm mb-1">Ring Templates</h4>
                <p className="text-xs text-gray-400">Solitaire, Halo, Three Stone</p>
              </div>
              <div className="template-card">
                <div className="template-preview">📿</div>
                <h4 className="font-semibold text-sm mb-1">Necklace Templates</h4>
                <p className="text-xs text-gray-400">Chain, Cable, Box</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixGoldCADInterface;
