import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ThreeeDViewerProps {
  shapes: any[];
  className?: string;
}

export default function ThreeDViewer({ shapes, className = '' }: ThreeeDViewerProps) {
  const [rotation, setRotation] = useState({ x: -10, y: 20 });
  const [isRotating, setIsRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number;

    if (isRotating && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x,
          y: (prev.y + 0.5) % 360
        }));
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRotating, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsRotating(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const render3DShape = (shape: any, index: number) => {
    const transform = `
      translate3d(${shape.x}px, ${shape.y}px, 0px)
      ${shape.type === 'circle' ? `scale(${(shape.radius || 20) / 20})` : ''}
    `;

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className="absolute w-10 h-10 rounded-full border-2 border-yellow-400 bg-yellow-400/20"
            style={{
              transform,
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            }}
          />
        );
      case 'rectangle':
        return (
          <div
            key={shape.id}
            className="absolute border-2 border-yellow-400 bg-yellow-400/20"
            style={{
              transform,
              width: shape.width || 40,
              height: shape.height || 40,
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            }}
          />
        );
      case 'line':
        const length = Math.sqrt(
          Math.pow((shape.x2 || shape.x) - shape.x, 2) +
          Math.pow((shape.y2 || shape.y) - shape.y, 2)
        );
        const angle = Math.atan2(
          (shape.y2 || shape.y) - shape.y,
          (shape.x2 || shape.x) - shape.x
        ) * 180 / Math.PI;

        return (
          <div
            key={shape.id}
            className="absolute h-1 bg-yellow-400"
            style={{
              transform: `translate3d(${shape.x}px, ${shape.y}px, 0px) rotate(${angle}deg)`,
              width: length,
              transformOrigin: '0 50%',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
            }}
          />
        );
      case 'gemstone':
        return (
          <div
            key={shape.id}
            className="absolute w-6 h-6 transform rotate-45 border-2"
            style={{
              transform: transform + ' rotate(45deg)',
              borderColor: shape.color || '#E8F4FD',
              backgroundColor: (shape.color || '#E8F4FD') + '40',
              boxShadow: `0 0 15px ${shape.color || '#E8F4FD'}80`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative bg-gray-900/50 rounded-lg border border-yellow-700/30 overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex space-x-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            isRotating
              ? 'bg-yellow-500 text-gray-900'
              : 'bg-gray-800/80 text-yellow-300 hover:bg-yellow-500/20'
          }`}
        >
          {isRotating ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => setRotation({ x: -10, y: 20 })}
          className="p-2 bg-gray-800/80 text-yellow-300 hover:bg-yellow-500/20 rounded-lg text-xs font-medium transition-colors"
        >
          ↺
        </button>
      </div>

      {/* 3D Scene */}
      <div
        ref={viewerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1000px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative preserve-3d"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            width: '300px',
            height: '300px',
          }}
        >
          {/* Base Platform */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-yellow-700/20 rounded-lg"
            style={{
              transform: 'rotateX(90deg) translateZ(-150px)',
              background: `
                radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 70%),
                linear-gradient(45deg,
                  rgba(55, 65, 81, 0.8) 25%, transparent 25%, transparent 75%, rgba(55, 65, 81, 0.8) 75%),
                linear-gradient(-45deg,
                  rgba(55, 65, 81, 0.8) 25%, transparent 25%, transparent 75%, rgba(55, 65, 81, 0.8) 75%)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Render Shapes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ transform: 'translateZ(0px)' }}>
              {shapes.length > 0 ? (
                shapes.map((shape, index) => render3DShape(shape, index))
              ) : (
                <motion.div
                  animate={{
                    rotateY: isRotating ? 360 : 0,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 text-2xl">✦</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Ambient Lighting Effect */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)',
              transform: 'translateZ(1px)',
            }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="absolute bottom-3 left-3 text-xs text-gray-400">
        {shapes.length} object{shapes.length !== 1 ? 's' : ''} • 3D View
      </div>
    </div>
  );
}
