import React, { useState, useRef, useEffect } from 'react';
import './WatchDesignModule.css';

interface WatchComponent {
  id: string;
  type: 'case' | 'dial' | 'hands' | 'markers' | 'bezel' | 'crown' | 'band';
  style: string;
  material: string;
  size: number;
  position?: { x: number; y: number; rotation: number };
  color: string;
}

interface WatchDesign {
  id: string;
  name: string;
  brand: 'rolex' | 'apple' | 'gshock' | 'cartier' | 'custom';
  category: 'luxury' | 'sport' | 'smart' | 'dress' | 'diving';
  components: WatchComponent[];
  specifications: {
    caseSize: number;
    waterResistance: number;
    movement: string;
    crystalType: string;
    bandType: string;
  };
}

interface WatchDesignModuleProps {
  onClose?: () => void;
}

const WatchDesignModule: React.FC<WatchDesignModuleProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDesign, setCurrentDesign] = useState<WatchDesign>({
    id: 'watch_' + Date.now(),
    name: 'Custom Watch',
    brand: 'custom',
    category: 'luxury',
    components: [],
    specifications: {
      caseSize: 40,
      waterResistance: 100,
      movement: 'Automatic',
      crystalType: 'Sapphire',
      bandType: 'Steel Bracelet'
    }
  });

  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);

  // Professional Watch Templates - Better than anything MatrixGold could offer
  const watchTemplates: Record<string, Partial<WatchDesign>> = {
    'rolex-submariner': {
      name: 'Submariner Style',
      brand: 'rolex',
      category: 'diving',
      specifications: {
        caseSize: 41,
        waterResistance: 300,
        movement: 'Automatic',
        crystalType: 'Sapphire',
        bandType: 'Oyster Bracelet'
      }
    },
    'rolex-datejust': {
      name: 'Datejust Style',
      brand: 'rolex',
      category: 'luxury',
      specifications: {
        caseSize: 36,
        waterResistance: 100,
        movement: 'Automatic',
        crystalType: 'Sapphire',
        bandType: 'Jubilee Bracelet'
      }
    },
    'apple-sport': {
      name: 'Sport Watch',
      brand: 'apple',
      category: 'smart',
      specifications: {
        caseSize: 45,
        waterResistance: 50,
        movement: 'Digital',
        crystalType: 'Ion-X Glass',
        bandType: 'Sport Band'
      }
    },
    'gshock-tactical': {
      name: 'Tactical G-Style',
      brand: 'gshock',
      category: 'sport',
      specifications: {
        caseSize: 55,
        waterResistance: 200,
        movement: 'Quartz Digital',
        crystalType: 'Mineral Glass',
        bandType: 'Resin Band'
      }
    },
    'cartier-tank': {
      name: 'Tank Style',
      brand: 'cartier',
      category: 'dress',
      specifications: {
        caseSize: 31,
        waterResistance: 30,
        movement: 'Quartz',
        crystalType: 'Sapphire',
        bandType: 'Leather Strap'
      }
    }
  };

  // Watch Components Library - Comprehensive beyond MatrixGold
  const componentLibrary = {
    cases: [
      { id: 'round-classic', name: 'Round Classic', material: 'Steel', price: 150 },
      { id: 'round-sports', name: 'Round Sports', material: 'Titanium', price: 280 },
      { id: 'square-tank', name: 'Square Tank', material: 'Gold', price: 450 },
      { id: 'tonneau-luxury', name: 'Tonneau Luxury', material: 'Platinum', price: 650 },
      { id: 'cushion-vintage', name: 'Cushion Vintage', material: 'Rose Gold', price: 420 }
    ],
    dials: [
      { id: 'sunburst-blue', name: 'Sunburst Blue', color: '#1e40af', price: 80 },
      { id: 'mother-pearl', name: 'Mother of Pearl', color: '#f8fafc', price: 120 },
      { id: 'carbon-fiber', name: 'Carbon Fiber', color: '#1f2937', price: 95 },
      { id: 'guilloche-silver', name: 'Guilloche Silver', color: '#e5e7eb', price: 150 },
      { id: 'enamel-white', name: 'Enamel White', color: '#ffffff', price: 110 }
    ],
    hands: [
      { id: 'sword-style', name: 'Sword Style', material: 'Steel', price: 45 },
      { id: 'dauphine-gold', name: 'Dauphine', material: 'Gold', price: 85 },
      { id: 'skeleton-modern', name: 'Skeleton Modern', material: 'Titanium', price: 95 },
      { id: 'leaf-vintage', name: 'Leaf Vintage', material: 'Brass', price: 65 },
      { id: 'arrow-sport', name: 'Arrow Sport', material: 'Luminous', price: 55 }
    ],
    markers: [
      { id: 'roman-numerals', name: 'Roman Numerals', material: 'Engraved', price: 75 },
      { id: 'diamond-indices', name: 'Diamond Indices', material: 'Diamond', price: 450 },
      { id: 'bar-indices', name: 'Bar Indices', material: 'Applied', price: 35 },
      { id: 'arabic-numbers', name: 'Arabic Numbers', material: 'Printed', price: 25 },
      { id: 'dot-markers', name: 'Dot Markers', material: 'Luminous', price: 40 }
    ],
    bands: [
      { id: 'oyster-bracelet', name: 'Oyster Bracelet', material: 'Steel', price: 200 },
      { id: 'jubilee-bracelet', name: 'Jubilee Bracelet', material: 'Two-tone', price: 280 },
      { id: 'leather-strap', name: 'Leather Strap', material: 'Alligator', price: 150 },
      { id: 'sport-band', name: 'Sport Band', material: 'Silicone', price: 85 },
      { id: 'milanese-mesh', name: 'Milanese Mesh', material: 'Steel Mesh', price: 180 }
    ]
  };

  // Advanced Watch Rendering - Visual superiority over MatrixGold
  const renderWatch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Professional watch rendering with realistic proportions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const caseRadius = currentDesign.specifications.caseSize * 2;

    // Draw case
    ctx.beginPath();
    ctx.arc(centerX, centerY, caseRadius, 0, 2 * Math.PI);
    ctx.fillStyle = getMaterialColor(getComponentMaterial('case'));
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw bezel
    ctx.beginPath();
    ctx.arc(centerX, centerY, caseRadius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw dial
    ctx.beginPath();
    ctx.arc(centerX, centerY, caseRadius - 15, 0, 2 * Math.PI);
    ctx.fillStyle = getComponentColor('dial');
    ctx.fill();

    // Draw hour markers
    drawHourMarkers(ctx, centerX, centerY, caseRadius - 20);

    // Draw hands
    drawWatchHands(ctx, centerX, centerY, caseRadius - 20);

    // Draw crown
    drawCrown(ctx, centerX, centerY, caseRadius);

    // Draw brand logo
    drawBrandLogo(ctx, centerX, centerY - 20, currentDesign.brand);

    // Draw complications (if any)
    if (currentDesign.brand === 'rolex') {
      drawDateWindow(ctx, centerX + 25, centerY + 5);
    }
  };

  const getMaterialColor = (material: string) => {
    const colors: Record<string, string> = {
      'Steel': '#C0C0C0',
      'Gold': '#FFD700',
      'Rose Gold': '#E8B4B8',
      'Platinum': '#E5E4E2',
      'Titanium': '#8C8C8C',
      'Bronze': '#CD7F32'
    };
    return colors[material] || '#C0C0C0';
  };

  const getComponentColor = (type: string) => {
    const component = currentDesign.components.find(c => c.type === type);
    return component?.color || '#1e40af';
  };

  const getComponentMaterial = (type: string) => {
    const component = currentDesign.components.find(c => c.type === type);
    return component?.material || 'Steel';
  };

  const drawHourMarkers = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = centerX + Math.sin(angle) * (radius - 10);
      const y1 = centerY - Math.cos(angle) * (radius - 10);
      const x2 = centerX + Math.sin(angle) * radius;
      const y2 = centerY - Math.cos(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = i % 3 === 0 ? 3 : 1;
      ctx.stroke();
    }
  };

  const drawWatchHands = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Hour hand
    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / 360;
    drawHand(ctx, centerX, centerY, radius * 0.5, hourAngle, 4, '#333');

    // Minute hand
    const minuteAngle = (minutes * Math.PI) / 30 + (seconds * Math.PI) / 1800;
    drawHand(ctx, centerX, centerY, radius * 0.75, minuteAngle, 2, '#333');

    // Second hand
    const secondAngle = (seconds * Math.PI) / 30;
    drawHand(ctx, centerX, centerY, radius * 0.85, secondAngle, 1, '#ef4444');

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  };

  const drawHand = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, length: number, angle: number, width: number, color: string) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.sin(angle) * length, centerY - Math.cos(angle) * length);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const drawCrown = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, caseRadius: number) => {
    const crownX = centerX + caseRadius + 5;
    const crownY = centerY;

    ctx.beginPath();
    ctx.rect(crownX, crownY - 8, 8, 16);
    ctx.fillStyle = getMaterialColor(getComponentMaterial('case'));
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawBrandLogo = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, brand: string) => {
    ctx.font = '12px serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    const brandNames: Record<string, string> = {
      rolex: 'ROLEX',
      apple: 'Apple',
      gshock: 'G-SHOCK',
      cartier: 'Cartier',
      custom: 'CRAFTEDJEWELZ'
    };

    ctx.fillText(brandNames[brand] || 'CUSTOM', centerX, centerY);
  };

  const drawDateWindow = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const today = new Date().getDate();

    ctx.beginPath();
    ctx.rect(x - 10, y - 8, 20, 16);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '10px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(today.toString(), x, y + 3);
  };

  // Live preview updates
  useEffect(() => {
    renderWatch();
    const interval = setInterval(renderWatch, 1000); // Update every second for live time
    return () => clearInterval(interval);
  }, [currentDesign]);

  const loadTemplate = (templateKey: string) => {
    const template = watchTemplates[templateKey];
    if (template) {
      setCurrentDesign(prev => ({
        ...prev,
        ...template,
        id: 'watch_' + Date.now()
      }));
    }
  };

  const addComponent = (componentType: keyof typeof componentLibrary, componentId: string) => {
    const component = componentLibrary[componentType]?.find(c => c.id === componentId);
    if (component) {
      const newComponent: WatchComponent = {
        id: componentId,
        type: componentType.slice(0, -1) as any, // Remove 's' from plural
        style: component.name,
        material: component.material || 'Steel',
        size: 1,
        color: (component as any).color || '#333333'
      };

      setCurrentDesign(prev => ({
        ...prev,
        components: [...prev.components.filter(c => c.type !== newComponent.type), newComponent]
      }));
    }
  };

  const exportWatch = (format: 'json' | 'stl' | 'technical') => {
    switch (format) {
      case 'json':
        const dataStr = JSON.stringify(currentDesign, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentDesign.name.replace(/\s+/g, '_')}_watch.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
    <div className="watch-design-module">
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
      <div className="watch-header">
        <h2>Professional Watch Designer</h2>
        <p>Design luxury watches beyond MatrixGold's capabilities</p>
      </div>

      <div className="watch-workspace">
        {/* Template Gallery */}
        <div className="templates-panel">
          <h3>Professional Templates</h3>
          <div className="template-grid">
            {Object.entries(watchTemplates).map(([key, template]) => (
              <button
                key={key}
                className="template-card"
                onClick={() => loadTemplate(key)}
              >
                <div className="template-icon">{template.brand === 'rolex' ? '👑' : template.brand === 'apple' ? '📱' : '⌚'}</div>
                <div className="template-name">{template.name}</div>
                <div className="template-brand">{template.brand?.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="watch-canvas"
          />
          <div className="canvas-controls">
            <button onClick={() => renderWatch()}>Refresh</button>
            <button onClick={() => setShowSpecs(!showSpecs)}>Specifications</button>
          </div>
        </div>

        {/* Component Library */}
        <div className="components-panel">
          <h3>Watch Components</h3>

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
            <h3>Watch Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <label>Case Size (mm)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.caseSize}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, caseSize: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>Water Resistance (m)</label>
                <input
                  type="number"
                  value={currentDesign.specifications.waterResistance}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, waterResistance: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div className="spec-item">
                <label>Movement Type</label>
                <select
                  value={currentDesign.specifications.movement}
                  onChange={(e) => setCurrentDesign(prev => ({
                    ...prev,
                    specifications: { ...prev.specifications, movement: e.target.value }
                  }))}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Quartz">Quartz</option>
                  <option value="Manual">Manual Wind</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
            </div>
            <div className="specs-actions">
              <button onClick={() => setShowSpecs(false)}>Close</button>
              <button onClick={() => exportWatch('technical')}>Export Technical</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Controls */}
      <div className="export-panel">
        <h3>Export Options</h3>
        <div className="export-buttons">
          <button onClick={() => exportWatch('json')} className="export-btn">
            Export Design (JSON)
          </button>
          <button onClick={() => exportWatch('stl')} className="export-btn">
            Export for 3D Printing (STL)
          </button>
          <button onClick={() => exportWatch('technical')} className="export-btn">
            Technical Drawings (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchDesignModule;
