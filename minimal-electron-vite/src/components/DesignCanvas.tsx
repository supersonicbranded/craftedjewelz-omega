import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDViewer from './ThreeDViewer';

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

interface DesignCanvasProps {
  onNavigate: (screen: Screen) => void;
}

interface Shape {
  id: string;
  type: 'circle' | 'line' | 'rectangle' | 'bezier' | 'gemstone';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number;
  y2?: number;
  points?: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  selected: boolean;
  gemType?: string;
  size?: number;
}

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  shapes: Shape[];
  createdAt: Date;
  modifiedAt: Date;
}

export default function DesignCanvas({ onNavigate }: DesignCanvasProps) {
  const [selectedTool, setSelectedTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [gridSnap, setGridSnap] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showThreeD, setShowThreeD] = useState(false);
  const canvasRef = useRef<SVGSVGElement>(null);

  const tools = [
    { id: 'select', name: 'Select', icon: '↖', shortcut: 'V' },
    { id: 'line', name: 'Line', icon: '/', shortcut: 'L' },
    { id: 'circle', name: 'Circle', icon: '○', shortcut: 'C' },
    { id: 'rectangle', name: 'Rectangle', icon: '□', shortcut: 'R' },
    { id: 'bezier', name: 'Bezier', icon: '~', shortcut: 'B' },
    { id: 'gemstone', name: 'Gemstone', icon: '♦', shortcut: 'G' },
    { id: 'extrude', name: 'Extrude', icon: '⬆', shortcut: 'E' },
    { id: 'revolve', name: 'Revolve', icon: '⟲', shortcut: 'Shift+R' },
    { id: 'mirror', name: 'Mirror', icon: '⮀', shortcut: 'M' },
  ];

  const gemstones = [
    { name: 'Diamond', color: '#E8F4FD' },
    { name: 'Ruby', color: '#DC143C' },
    { name: 'Emerald', color: '#50C878' },
    { name: 'Sapphire', color: '#0F52BA' },
    { name: 'Amethyst', color: '#9966CC' },
    { name: 'Topaz', color: '#FFC87C' },
  ];

  // Utility functions
  const snapToGrid = (value: number, gridSize: number = 20) => {
    return gridSnap ? Math.round(value / gridSize) * gridSize : value;
  };

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snapToGrid((clientX - rect.left) * (100 / zoom));
    const y = snapToGrid((clientY - rect.top) * (100 / zoom));
    return { x, y };
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const saveProject = () => {
    const project: Project = {
      id: currentProject?.id || generateId(),
      name: projectName,
      thumbnail: generateThumbnail(),
      shapes: shapes,
      createdAt: currentProject?.createdAt || new Date(),
      modifiedAt: new Date()
    };

    const savedProjects = JSON.parse(localStorage.getItem('craftedJewelz_projects') || '[]');
    const existingIndex = savedProjects.findIndex((p: Project) => p.id === project.id);

    if (existingIndex >= 0) {
      savedProjects[existingIndex] = project;
    } else {
      savedProjects.push(project);
    }

    localStorage.setItem('craftedJewelz_projects', JSON.stringify(savedProjects));
    setCurrentProject(project);
    setShowSaveDialog(false);
  };

  const generateThumbnail = (): string => {
    // Simple thumbnail generation - in real app would render canvas to image
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#1f2937"/>
        <text x="50" y="50" text-anchor="middle" fill="#fbbf24" font-size="12">${shapes.length} shapes</text>
      </svg>`
    )}`;
  };

  const deleteSelectedShapes = () => {
    setShapes(shapes.filter(shape => !selectedShapes.includes(shape.id)));
    setSelectedShapes([]);
  };

  const duplicateSelectedShapes = () => {
    const newShapes = shapes.filter(shape => selectedShapes.includes(shape.id))
      .map(shape => ({
        ...shape,
        id: generateId(),
        x: shape.x + 20,
        y: shape.y + 20,
        selected: true
      }));
    setShapes([...shapes.map(s => ({ ...s, selected: false })), ...newShapes]);
    setSelectedShapes(newShapes.map(s => s.id));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            setShowSaveDialog(true);
            break;
          case 'z':
            e.preventDefault();
            // Implement undo
            break;
          case 'd':
            e.preventDefault();
            duplicateSelectedShapes();
            break;
        }
        return;
      }

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteSelectedShapes();
          break;
        case 'v':
          setSelectedTool('select');
          break;
        case 'l':
          setSelectedTool('line');
          break;
        case 'c':
          setSelectedTool('circle');
          break;
        case 'r':
          setSelectedTool('rectangle');
          break;
        case 'g':
          setSelectedTool('gemstone');
          break;
        case 'Escape':
          setSelectedShapes([]);
          setShowContextMenu(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes, shapes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-gray-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-yellow-700/30 backdrop-blur-sm bg-gray-900/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('welcome')}
              className="text-yellow-300 hover:text-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-500/10 transition-all duration-200"
            >
              ← Back to Home
            </button>
            <div className="h-6 w-px bg-yellow-700/30"></div>
            <h1 className="text-xl font-semibold text-white">Design Canvas</h1>
            <div className="text-sm text-yellow-300">Untitled Project</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Zoom:</span>
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
              >
                -
              </button>
              <span className="text-sm text-yellow-300 w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(400, zoom + 25))}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              Save Project
            </button>
            <button
              onClick={() => setShowThreeD(!showThreeD)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                showThreeD
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              3D View
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-73px)]">
        {/* Tool Palette */}
        <aside className="w-20 bg-gray-900/80 border-r border-yellow-700/20 backdrop-blur-sm">
          <div className="p-3 space-y-2">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-14 h-14 rounded-lg transition-all duration-200 flex items-center justify-center text-xl ${
                  selectedTool === tool.id
                    ? 'bg-yellow-500 text-gray-900 shadow-lg'
                    : 'bg-gray-800 hover:bg-gray-700 text-yellow-300 hover:text-yellow-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={tool.name}
              >
                {tool.icon}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-gray-800/30 to-gray-900/50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="bg-white/5 border-2 border-dashed border-yellow-500/30 rounded-lg relative"
              style={{
                width: `${400 * (zoom / 100)}px`,
                height: `${300 * (zoom / 100)}px`,
                minWidth: '200px',
                minHeight: '150px'
              }}
            >
              {/* Grid Pattern */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fbbf24" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Canvas Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-yellow-400 text-2xl">✦</span>
                  </div>
                  <p className="text-yellow-300 font-medium">Start creating your jewelry design</p>
                  <p className="text-gray-400 text-sm mt-2">Select a tool from the left panel</p>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Properties Panel */}
        <aside className="w-64 bg-gray-900/80 border-l border-yellow-700/20 backdrop-blur-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>

            {/* 3D Preview */}
            {showThreeD && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <h4 className="text-yellow-300 font-medium mb-2">3D Preview</h4>
                <ThreeDViewer
                  shapes={shapes}
                  className="h-48 w-full"
                />
              </motion.div>
            )}

            {selectedTool && (
              <motion.div
                key={selectedTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-yellow-300 font-medium mb-2">
                    {tools.find(t => t.id === selectedTool)?.name} Tool
                  </h4>
                  {selectedTool === 'circle' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Radius (mm)</label>
                        <input
                          type="number"
                          defaultValue="5.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Center X (mm)</label>
                        <input
                          type="number"
                          defaultValue="0.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {selectedTool === 'rectangle' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Width (mm)</label>
                        <input
                          type="number"
                          defaultValue="10.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Height (mm)</label>
                        <input
                          type="number"
                          defaultValue="8.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                  {selectedTool === 'extrude' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Distance (mm)</label>
                        <input
                          type="number"
                          defaultValue="2.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Taper Angle (°)</label>
                        <input
                          type="number"
                          defaultValue="0.0"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-yellow-300 font-medium mb-2">Material</h4>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                    <option>14K Gold</option>
                    <option>18K Gold</option>
                    <option>Sterling Silver</option>
                    <option>Platinum</option>
                    <option>Custom Alloy</option>
                  </select>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h4 className="text-yellow-300 font-medium mb-2">Layers</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                      <span className="text-sm text-white">Base Ring</span>
                      <div className="flex items-center space-x-1">
                        <button className="w-4 h-4 text-yellow-300 hover:text-yellow-200">👁</button>
                        <button className="w-4 h-4 text-red-400 hover:text-red-300">🗑</button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-1 border border-yellow-500/30 rounded text-sm text-yellow-300 hover:bg-yellow-500/10 transition-colors">
                    + Add Layer
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
