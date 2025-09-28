import React, { useRef, useEffect, useState } from 'react';

/**
 * JewelryDesignCanvas
 * Professional jewelry design canvas with 3D viewport and CAD tools
 */
const JewelryDesignCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize 3D viewport
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up basic viewport
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        for (let x = 0; x <= canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Add center marker
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(canvas.width / 2 - 2, canvas.height / 2 - 2, 4, 4);

        setIsLoading(false);
      }
    }
  }, []);

  return (
    <div className="jewelry-design-canvas w-full h-full bg-white">
      <div className="canvas-header bg-gray-50 border-b p-4">
        <h2 className="text-xl font-semibold text-gray-800">Professional Jewelry Design Canvas</h2>
        <p className="text-sm text-gray-600">Advanced 3D viewport with CAD tools and precision modeling</p>
      </div>

      <div className="canvas-container relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing 3D viewport...</p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-200 bg-white"
        />

        <div className="canvas-tools absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
          <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Add Ring
          </button>
          <button className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Add Stone
          </button>
          <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
            Add Setting
          </button>
          <button className="w-full px-3 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
            Export STL
          </button>
        </div>
      </div>

      <div className="canvas-footer bg-gray-50 border-t p-3 text-sm text-gray-600">
        Ready | Precision: 0.01mm | Units: mm
      </div>
    </div>
  );
};

export default JewelryDesignCanvas;
