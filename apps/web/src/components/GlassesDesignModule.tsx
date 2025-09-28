import React, { useState, useRef, useEffect } from 'react';
import './GlassesDesignModule.css';

interface GlassesComponent {
  id: string;
  type: 'frame' | 'lens' | 'temple' | 'bridge' | 'nosePads' | 'hinges';
  style: string;
  material: string;
  color: string;
  size: { width: number; height: number; thickness: number };
  position?: { x: number; y: number; z: number };
}

interface GlassesDesign {
  id: string;
  name: string;
  brand: 'ray-ban' | 'oakley' | 'gucci' | 'prada' | 'persol' | 'custom';
  category: 'sunglasses' | 'prescription' | 'safety' | 'reading' | 'fashion';
  frameStyle: 'aviator' | 'wayfarer' | 'round' | 'cat-eye' | 'rectangular' | 'sport';
  components: GlassesComponent[];
  specifications: {
    lensWidth: number;
    bridgeWidth: number;
    templeLength: number;
    frameHeight: number;
    totalWidth: number;
    lensType: string;
    uvProtection: number;
    polarized: boolean;
  };
}

interface GlassesDesignModuleProps {
  onClose?: () => void;
}

const GlassesDesignModule: React.FC<GlassesDesignModuleProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDesign, setCurrentDesign] = useState<GlassesDesign>({
    id: 'glasses_' + Date.now(),
    name: 'Custom Glasses',
    brand: 'custom',
    category: 'sunglasses',
    frameStyle: 'wayfarer',
    components: [],
    specifications: {
      lensWidth: 52,
      bridgeWidth: 18,
      templeLength: 145,
      frameHeight: 40,
      totalWidth: 140,
      lensType: 'CR-39 Plastic',
      uvProtection: 100,
      polarized: false
    }
  });

  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [viewMode, setViewMode] = useState<'front' | 'side' | '3d'>('front');
  const [showSpecs, setShowSpecs] = useState(false);

  // Professional Glasses Templates - Iconic designs MatrixGold can't touch
  const glassesTemplates: Record<string, Partial<GlassesDesign>> = {
    'rayban-aviator': {
      name: 'Classic Aviator',
      brand: 'ray-ban',
      frameStyle: 'aviator',
      category: 'sunglasses',
      specifications: {
        lensWidth: 58,
        bridgeWidth: 14,
        templeLength: 135,
        frameHeight: 50,
        totalWidth: 140,
        lensType: 'Crystal Glass',
        uvProtection: 100,
        polarized: true
      }
    },
    'rayban-wayfarer': {
      name: 'Wayfarer Classic',
      brand: 'ray-ban',
      frameStyle: 'wayfarer',
      category: 'sunglasses',
      specifications: {
        lensWidth: 50,
        bridgeWidth: 22,
        templeLength: 150,
        frameHeight: 43,
        totalWidth: 144,
        lensType: 'Crystal Glass',
        uvProtection: 100,
        polarized: false
      }
    },
    'oakley-sport': {
      name: 'Sport Performance',
      brand: 'oakley',
      frameStyle: 'sport',
      category: 'safety',
      specifications: {
        lensWidth: 61,
        bridgeWidth: 16,
        templeLength: 128,
        frameHeight: 42,
        totalWidth: 138,
        lensType: 'Plutonite',
        uvProtection: 100,
        polarized: true
      }
    },
    'gucci-luxury': {
      name: 'Luxury Cat-Eye',
      brand: 'gucci',
      frameStyle: 'cat-eye',
      category: 'fashion',
      specifications: {
        lensWidth: 54,
        bridgeWidth: 17,
        templeLength: 140,
        frameHeight: 45,
        totalWidth: 142,
        lensType: 'Mineral Glass',
        uvProtection: 100,
        polarized: false
      }
    },
    'prada-round': {
      name: 'Round Intellectual',
      brand: 'prada',
      frameStyle: 'round',
      category: 'prescription',
      specifications: {
        lensWidth: 48,
        bridgeWidth: 20,
        templeLength: 145,
        frameHeight: 48,
        totalWidth: 136,
        lensType: 'High-Index',
        uvProtection: 95,
        polarized: false
      }
    },
    'persol-vintage': {
      name: 'Vintage Square',
      brand: 'persol',
      frameStyle: 'rectangular',
      category: 'prescription',
      specifications: {
        lensWidth: 52,
        bridgeWidth: 18,
        templeLength: 145,
        frameHeight: 40,
        totalWidth: 140,
        lensType: 'Trivex',
        uvProtection: 100,
        polarized: false
      }
    }
  };

  // Comprehensive Component Library
  const componentLibrary = {
    frames: [
      { id: 'titanium-ultra-light', name: 'Titanium Ultra-Light', material: 'Titanium', color: '#C0C0C0', price: 320 },
      { id: 'carbon-fiber-sport', name: 'Carbon Fiber Sport', material: 'Carbon Fiber', color: '#2C2C2C', price: 450 },
      { id: 'acetate-luxury', name: 'Italian Acetate', material: 'Acetate', color: '#8B4513', price: 280 },
      { id: 'stainless-steel', name: 'Stainless Steel', material: 'Steel', color: '#A8A8A8', price: 220 },
      { id: 'buffalo-horn', name: 'Buffalo Horn', material: 'Horn', color: '#654321', price: 650 },
      { id: 'gold-plated', name: 'Gold Plated', material: 'Gold', color: '#FFD700', price: 580 }
    ],
    lenses: [
      { id: 'crystal-glass', name: 'Crystal Glass', material: 'Glass', color: '#87CEEB', price: 150 },
      { id: 'polarized-gray', name: 'Polarized Gray', material: 'Polycarbonate', color: '#696969', price: 200 },
      { id: 'blue-light-block', name: 'Blue Light Blocking', material: 'CR-39', color: '#E6F3FF', price: 120 },
      { id: 'photochromic', name: 'Photochromic', material: 'Transitions', color: '#F0F8FF', price: 250 },
      { id: 'mirror-gold', name: 'Gold Mirror', material: 'Polycarbonate', color: '#FFD700', price: 180 },
      { id: 'gradient-brown', name: 'Gradient Brown', material: 'CR-39', color: '#D2B48C', price: 160 }
    ],
    temples: [
      { id: 'spring-hinge', name: 'Spring Hinge', material: 'Titanium', color: '#C0C0C0', price: 85 },
      { id: 'comfort-grip', name: 'Comfort Grip', material: 'Rubber', color: '#333333', price: 65 },
      { id: 'adjustable-sport', name: 'Adjustable Sport', material: 'TR90', color: '#FF4500', price: 95 },
      { id: 'luxury-acetate', name: 'Luxury Acetate', material: 'Acetate', color: '#8B4513', price: 120 },
      { id: 'memory-metal', name: 'Memory Metal', material: 'Nitinol', color: '#B0C4DE', price: 180 }
    ],
    nosePads: [
      { id: 'silicone-comfort', name: 'Silicone Comfort', material: 'Silicone', color: '#F5F5F5', price: 25 },
      { id: 'crystal-clear', name: 'Crystal Clear', material: 'TPE', color: 'transparent', price: 30 },
      { id: 'anti-slip-sport', name: 'Anti-Slip Sport', material: 'Rubber', color: '#333333', price: 35 },
      { id: 'hypoallergenic', name: 'Hypoallergenic', material: 'Medical Grade', color: '#FFFFFF', price: 45 }
    ]
  };

  // Advanced Glasses Rendering
  const renderGlasses = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 3;

    if (viewMode === 'front') {
      renderFrontView(ctx, centerX, centerY, scale);
    } else if (viewMode === 'side') {
      renderSideView(ctx, centerX, centerY, scale);
    } else {
      render3DView(ctx, centerX, centerY, scale);
    }
  };

  const renderFrontView = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    const specs = currentDesign.specifications;
    const lensRadius = (specs.lensWidth * scale) / 2;
    const bridgeWidth = specs.bridgeWidth * scale;
    const frameHeight = specs.frameHeight * scale;

    // Draw left lens
    if (currentDesign.frameStyle === 'round') {
      ctx.beginPath();
      ctx.arc(centerX - lensRadius - bridgeWidth/2, centerY, lensRadius, 0, 2 * Math.PI);
    } else if (currentDesign.frameStyle === 'aviator') {
      drawAviatorLens(ctx, centerX - lensRadius - bridgeWidth/2, centerY, lensRadius);
    } else if (currentDesign.frameStyle === 'cat-eye') {
      drawCatEyeLens(ctx, centerX - lensRadius - bridgeWidth/2, centerY, lensRadius, frameHeight);
    } else {
      // Rectangular/Wayfarer
      ctx.beginPath();
      ctx.roundRect(centerX - lensRadius*1.5 - bridgeWidth/2, centerY - frameHeight/2, lensRadius*2, frameHeight, 8);
    }

    ctx.fillStyle = getLensColor();
    ctx.fill();
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw right lens (mirror of left)
    if (currentDesign.frameStyle === 'round') {
      ctx.beginPath();
      ctx.arc(centerX + lensRadius + bridgeWidth/2, centerY, lensRadius, 0, 2 * Math.PI);
    } else if (currentDesign.frameStyle === 'aviator') {
      drawAviatorLens(ctx, centerX + lensRadius + bridgeWidth/2, centerY, lensRadius);
    } else if (currentDesign.frameStyle === 'cat-eye') {
      drawCatEyeLens(ctx, centerX + lensRadius + bridgeWidth/2, centerY, lensRadius, frameHeight);
    } else {
      ctx.beginPath();
      ctx.roundRect(centerX + bridgeWidth/2 - lensRadius/2, centerY - frameHeight/2, lensRadius*2, frameHeight, 8);
    }

    ctx.fillStyle = getLensColor();
    ctx.fill();
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw bridge
    ctx.beginPath();
    ctx.moveTo(centerX - bridgeWidth/2, centerY);
    ctx.lineTo(centerX + bridgeWidth/2, centerY);
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw temples
    const templeY = centerY - 10;
    ctx.beginPath();
    ctx.moveTo(centerX - lensRadius*1.5 - bridgeWidth/2, templeY);
    ctx.lineTo(centerX - lensRadius*3 - bridgeWidth/2, templeY);
    ctx.moveTo(centerX + lensRadius*1.5 + bridgeWidth/2, templeY);
    ctx.lineTo(centerX + lensRadius*3 + bridgeWidth/2, templeY);
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw nose pads
    drawNosePads(ctx, centerX, centerY + lensRadius/2);

    // Draw brand logo
    drawBrandLogo(ctx, centerX, centerY + 40, currentDesign.brand);
  };

  const renderSideView = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    const specs = currentDesign.specifications;
    const templeLength = (specs.templeLength * scale) / 4;
    const frameHeight = specs.frameHeight * scale;

    // Draw lens profile
    ctx.beginPath();
    ctx.ellipse(centerX - 30, centerY, 8, frameHeight/2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = getLensColor();
    ctx.fill();
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw temple
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY - 15);
    ctx.lineTo(centerX + templeLength, centerY - 15);
    ctx.lineTo(centerX + templeLength, centerY + 10);
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw hinge
    ctx.beginPath();
    ctx.arc(centerX - 20, centerY - 15, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#888';
    ctx.fill();
  };

  const render3DView = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    // Simplified 3D perspective view
    const specs = currentDesign.specifications;
    const lensRadius = (specs.lensWidth * scale) / 2;
    const bridgeWidth = specs.bridgeWidth * scale;

    // 3D transformation
    const perspective = 0.7;
    const angle = Math.PI / 6; // 30 degrees

    // Left lens with 3D effect
    ctx.save();
    ctx.transform(perspective, 0, Math.sin(angle) * 0.5, 1, 0, 0);
    ctx.beginPath();
    ctx.arc(centerX - lensRadius - bridgeWidth/2, centerY, lensRadius, 0, 2 * Math.PI);
    ctx.fillStyle = getLensColor();
    ctx.fill();
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Right lens with 3D effect
    ctx.save();
    ctx.transform(perspective, 0, -Math.sin(angle) * 0.5, 1, 0, 0);
    ctx.beginPath();
    ctx.arc(centerX + lensRadius + bridgeWidth/2, centerY, lensRadius, 0, 2 * Math.PI);
    ctx.fillStyle = getLensColor();
    ctx.fill();
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(centerX - bridgeWidth/3, centerY);
    ctx.lineTo(centerX + bridgeWidth/3, centerY);
    ctx.strokeStyle = getFrameColor();
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const drawAviatorLens = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.quadraticCurveTo(x + radius, y - radius/2, x + radius, y + radius/3);
    ctx.quadraticCurveTo(x, y + radius, x - radius, y + radius/3);
    ctx.quadraticCurveTo(x - radius, y - radius/2, x, y - radius);
    ctx.closePath();
  };

  const drawCatEyeLens = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.quadraticCurveTo(x - radius/2, y - height/2, x, y - height/3);
    ctx.quadraticCurveTo(x + radius/2, y - height/2, x + radius, y - height/4);
    ctx.quadraticCurveTo(x + radius, y + height/4, x, y + height/3);
    ctx.quadraticCurveTo(x - radius, y + height/3, x - radius, y);
    ctx.closePath();
  };

  const drawNosePads = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Left nose pad
    ctx.beginPath();
    ctx.ellipse(centerX - 12, centerY, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right nose pad
    ctx.beginPath();
    ctx.ellipse(centerX + 12, centerY, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawBrandLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, brand: string) => {
    ctx.font = '14px serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    const brandNames: Record<string, string> = {
      'ray-ban': 'Ray-Ban',
      'oakley': 'OAKLEY',
      'gucci': 'GUCCI',
      'prada': 'PRADA',
      'persol': 'PERSOL',
      'custom': 'CRAFTEDJEWELZ'
    };

    ctx.fillText(brandNames[brand] || 'CUSTOM', x, y);
  };

  const getLensColor = (): string => {
    const lensComponent = currentDesign.components.find(c => c.type === 'lens');
    return lensComponent?.color || '#87CEEB';
  };

  const getFrameColor = (): string => {
    const frameComponent = currentDesign.components.find(c => c.type === 'frame');
    return frameComponent?.color || '#8B4513';
  };

  useEffect(() => {
    renderGlasses();
  }, [currentDesign, viewMode]);

  const loadTemplate = (templateKey: string) => {
    const template = glassesTemplates[templateKey];
    if (template) {
      setCurrentDesign(prev => ({
        ...prev,
        ...template,
        id: 'glasses_' + Date.now()
      }));
    }
  };

  const addComponent = (componentType: keyof typeof componentLibrary, componentId: string) => {
    const component = componentLibrary[componentType]?.find(c => c.id === componentId);
    if (component) {
      const newComponent: GlassesComponent = {
        id: componentId,
        type: componentType.slice(0, -1) as any, // Remove 's' from plural
        style: component.name,
        material: component.material,
        color: component.color,
        size: { width: 50, height: 20, thickness: 2 }
      };

      setCurrentDesign(prev => ({
        ...prev,
        components: [...prev.components.filter(c => c.type !== newComponent.type), newComponent]
      }));
    }
  };

  const exportGlasses = (format: 'json' | 'stl' | 'technical' | 'prescription') => {
    switch (format) {
      case 'json':
        const dataStr = JSON.stringify(currentDesign, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentDesign.name.replace(/\s+/g, '_')}_glasses.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        break;

      case 'prescription':
        alert('Prescription compatibility check - Feature coming soon!');
        break;

      case 'stl':
        alert('STL export for 3D printing - Feature coming soon!');
        break;

      case 'technical':
        alert('Technical drawings export - Feature coming soon!');
        break;
    }
  };

  return (
    <div className="glasses-design-module">
      {onClose && (
        <button
          className="close-button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          ×
        </button>
      )}
      <div className="glasses-header">
        <h2>Professional Glasses Designer</h2>
        <p>Design eyewear beyond MatrixGold's vision</p>
      </div>

      <div className="glasses-workspace">
        {/* Template Gallery */}
        <div className="templates-panel">
          <h3>Iconic Templates</h3>
          <div className="template-grid">
            {Object.entries(glassesTemplates).map(([key, template]) => (
              <button
                key={key}
                className="template-card"
                onClick={() => loadTemplate(key)}
              >
                <div className="template-icon">
                  {template.frameStyle === 'aviator' ? '🕶️' :
                   template.frameStyle === 'round' ? '👓' :
                   template.frameStyle === 'cat-eye' ? '😎' : '🤓'}
                </div>
                <div className="template-name">{template.name}</div>
                <div className="template-brand">{template.brand?.toUpperCase()}</div>
                <div className="template-style">{template.frameStyle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="canvas-container">
          <div className="view-controls">
            <button
              className={viewMode === 'front' ? 'active' : ''}
              onClick={() => setViewMode('front')}
            >
              Front View
            </button>
            <button
              className={viewMode === 'side' ? 'active' : ''}
              onClick={() => setViewMode('side')}
            >
              Side View
            </button>
            <button
              className={viewMode === '3d' ? 'active' : ''}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="glasses-canvas"
          />

          <div className="canvas-controls">
            <button onClick={() => renderGlasses()}>Refresh</button>
            <button onClick={() => setShowSpecs(!showSpecs)}>Specifications</button>
          </div>
        </div>

        {/* Component Library */}
        <div className="components-panel">
          <h3>Eyewear Components</h3>

          {Object.entries(componentLibrary).map(([category, components]) => (
            <div key={category} className="component-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="component-list">
                {components.map(component => (
                  <button
                    key={component.id}
                    className="component-item"
                    onClick={() => addComponent(category as keyof typeof componentLibrary, component.id)}
                  >
                    <div className="component-name">{component.name}</div>
                    <div className="component-material">{component.material}</div>
                    <div className="component-price">${component.price}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications Panel */}
      {showSpecs && (
        <div className="specs-overlay">
          <div className="specs-panel">
            <h3>Glasses Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <label>Lens Width (mm)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.lensWidth}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, lensWidth: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>Bridge Width (mm)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.bridgeWidth}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, bridgeWidth: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>Temple Length (mm)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.templeLength}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, templeLength: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>UV Protection (%)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.uvProtection}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, uvProtection: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>Lens Type</label>
                <select
                  value={currentDesign.specifications.lensType}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, lensType: e.target.value }
                  }))}
                >
                  <option value="CR-39 Plastic">CR-39 Plastic</option>
                  <option value="Polycarbonate">Polycarbonate</option>
                  <option value="High-Index">High-Index</option>
                  <option value="Trivex">Trivex</option>
                  <option value="Crystal Glass">Crystal Glass</option>
                  <option value="Mineral Glass">Mineral Glass</option>
                </select>
              </div>
              <div className="spec-item">
                <label>
                  <input
                    type="checkbox"
                    checked={currentDesign.specifications.polarized}
                    onChange={(e) => setCurrentDesign(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, polarized: e.target.checked }
                    }))}
                  />
                  Polarized Lenses
                </label>
              </div>
            </div>
            <div className="specs-actions">
              <button onClick={() => setShowSpecs(false)}>Close</button>
              <button onClick={() => exportGlasses('technical')}>Export Technical</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Controls */}
      <div className="export-panel">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button onClick={() => exportGlasses('json')} className="export-btn">
            Export Design (JSON)
          </button>
          <button onClick={() => exportGlasses('prescription')} className="export-btn">
            Prescription Compatibility
          </button>
          <button onClick={() => exportGlasses('stl')} className="export-btn">
            Export for 3D Printing (STL)
          </button>
          <button onClick={() => exportGlasses('technical')} className="export-btn">
            Technical Drawings (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlassesDesignModule;
