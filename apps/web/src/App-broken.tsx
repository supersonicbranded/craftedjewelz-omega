import React, { useState } from "react";
import CADFeaturePanel from "./components/CADFeaturePanel";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (showWelcome) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          {!imageError && (
            <img
              src="/assets/logo.png"
              alt="CraftedJewelz Logo"
              style={{ width: '80px', height: '80px', marginRight: '20px' }}
              onError={() => setImageError(true)}
            />
          )}
          <h1 style={{ fontSize: '4rem', textAlign: 'center', margin: 0 }}>
            💎 CraftedJewelz Professional
          </h1>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      {/* Professional Header with Logo */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-4 shadow-2xl border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/assets/logo.png"
              alt="CraftedJewelz Logo"
              className="w-10 h-10"
              onError={(e) => {
                // Hide broken image if logo fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <h1 className="text-2xl font-bold text-white">CraftedJewelz Professional</h1>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              PROFESSIONAL EDITION
            </span>
          </div>
          <button
            onClick={() => setShowWelcome(true)}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white transition-colors shadow-lg"
          >
            ← Back to Welcome
            </button>
        </div>
      </div>

      {/* Main CAD Workspace */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-2">Design Tools</h2>
            <p className="text-slate-400 text-sm">Select tools to start designing</p>
          </div>
          <CADFeaturePanel />
        </div>

        {/* Main Viewport */}
        <div className="flex-1 bg-slate-900 flex flex-col">
          <div className="bg-slate-800 border-b border-slate-700 p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">3D Design Viewport</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                  Wireframe
                </button>
                <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                  Render
                </button>
                <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Professional 3D Workspace</h3>
                <p className="text-slate-400">Select a tool from the sidebar to begin designing</p>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="bg-slate-800 border-t border-slate-700 p-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4 text-slate-400">
                <span>Units: mm</span>
                <span>Precision: 0.01</span>
                <span>Grid: ON</span>
              </div>
              <div className="text-green-400">
                ● Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
