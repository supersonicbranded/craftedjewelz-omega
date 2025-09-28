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
          marginBottom: '30px',
          maxWidth: '800px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#ffd700', fontSize: '1.5rem' }}>🏆 PROFESSIONAL FEATURES:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '1.1rem' }}>
            <p style={{ margin: '10px 0' }}>✅ Advanced 3D Jewelry Modeling</p>
            <p style={{ margin: '10px 0' }}>✅ Professional Watch Design Suite</p>
            <p style={{ margin: '10px 0' }}>✅ Precision Eyewear Design Tools</p>
            <p style={{ margin: '10px 0' }}>✅ AI-Powered Design Optimization</p>
            <p style={{ margin: '10px 0' }}>✅ Manufacturing-Ready Export</p>
            <p style={{ margin: '10px 0' }}>✅ Industry-Leading CAD Features</p>
          </div>
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
      color: '#f1f5f9',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Professional Header with Logo */}
      <div style={{
        background: 'linear-gradient(90deg, #1e3a8a 0%, #581c87 50%, #312e81 100%)',
        padding: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!imageError && (
              <img
                src="/assets/logo.png"
                alt="CraftedJewelz Logo"
                style={{ width: '40px', height: '40px' }}
                onError={() => setImageError(true)}
              />
            )}
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              CraftedJewelz Professional
            </h1>
            <span style={{
              background: 'linear-gradient(90deg, #facc15 0%, #ca8a04 100%)',
              color: 'black',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              PROFESSIONAL EDITION
            </span>
          </div>
          <button
            onClick={() => setShowWelcome(true)}
            style={{
              background: '#475569',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            ← Back to Welcome
          </button>
        </div>
      </div>

      {/* Main CAD Workspace */}
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Left Sidebar - Tools */}
        <div style={{
          width: '320px',
          background: '#1e293b',
          borderRight: '1px solid #334155',
          overflowY: 'auto'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
              Design Tools
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Select tools to start designing
            </p>
          </div>
          <div style={{ padding: '16px' }}>
            <CADFeaturePanel />
          </div>
        </div>

        {/* Main Viewport */}
        <div style={{ flex: 1, background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontWeight: '500', margin: 0 }}>3D Design Viewport</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '4px 12px',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}>
                  Wireframe
                </button>
                <button style={{
                  padding: '4px 12px',
                  background: '#16a34a',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}>
                  Render
                </button>
                <button style={{
                  padding: '4px 12px',
                  background: '#9333ea',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}>
                  Export
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '48px', height: '48px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  Professional 3D Workspace
                </h3>
                <p style={{ color: '#94a3b8' }}>Select a tool from the sidebar to begin designing</p>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div style={{
            background: '#1e293b',
            borderTop: '1px solid #334155',
            padding: '8px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', gap: '16px', color: '#94a3b8' }}>
                <span>Units: mm</span>
                <span>Precision: 0.01</span>
                <span>Grid: ON</span>
              </div>
              <div style={{ color: '#10b981' }}>
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
