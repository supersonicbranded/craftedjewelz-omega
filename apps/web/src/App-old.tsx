import React, { useState } from "react";
import CADFeaturePanel from "./components/CADFeaturePanel";
import JewelryDesignCanvas from "./components/JewelryDesignCanvas";
import GeometryViewport3D from "./components/GeometryViewport3D";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px', textAlign: 'center' }}>
          � CraftedJewelz Professional
        </h1>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign: 'center' }}>
          Advanced Jewelry Design Suite
        </h2>

        <div style={{
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#ffd700' }}>🏆 PROFESSIONAL FEATURES:</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ Advanced 3D Jewelry Modeling & Rendering</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ Professional Watch Design Suite</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ Precision Eyewear Design Tools</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ AI-Powered Design Optimization</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ Manufacturing-Ready Export Tools</p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>✅ Industry-Leading CAD Features</p>
        </div>

        <button
          onClick={() => setShowWelcome(false)}
          style={{
            padding: '20px 40px',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            color: '#333',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(255,215,0,0.4)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
          }}
        >
          🚀 Launch Professional Suite
        </button>

        <p style={{
          marginTop: '20px',
          opacity: 0.8,
          textAlign: 'center',
          fontSize: '1rem'
        }}>
          The most advanced multi-category design platform for professionals
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">💎 CraftedJewelz Professional</h1>
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
              PROFESSIONAL EDITION
            </span>
          </div>
          <button
            onClick={() => setShowWelcome(true)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
          >
            ← Back to Welcome
          </button>
        </div>
      </div>

      {/* Main Application Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - CAD Features */}
        <div className="w-1/3 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
          <CADFeaturePanel />
        </div>

        {/* Center Panel - Design Canvas */}
        <div className="w-1/3 bg-gray-900 border-r border-gray-700">
          <JewelryDesignCanvas />
        </div>

        {/* Right Panel - 3D Viewport */}
        <div className="w-1/3 bg-gray-850">
          <GeometryViewport3D />
        </div>
      </div>
    </div>
  );
}

export default App;
