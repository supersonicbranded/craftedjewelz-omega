import React from "react";
import Sidebar from "../ui/Sidebar";
import RecentItem from "../ui/RecentItem";

export default function Welcome() {
  // Toast notification state
  const [toast, setToast] = React.useState("");
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ...existing code...
  // Dynamically import CADFeaturePanel, StonePatternSelector, ScriptingPanel
  const CADFeaturePanel = React.lazy(() => import("../components/CADFeaturePanel"));
  const StonePatternSelector = React.lazy(() => import("../components/StonePatternSelector"));
  const ScriptingPanel = React.lazy(() => import("../components/ScriptingPanel"));
  const GeometryViewport = React.lazy(() => import("../components/GeometryViewport3D"));
  const EarringPanel = React.lazy(() => import("../components/EarringPanel"));
  const GlassesPanel = React.lazy(() => import("../components/GlassesPanel"));
  const StudioPanel = React.lazy(() => import("../components/StudioPanel"));
    const ImageTracePanel = React.lazy(() => import("../components/ImageTracePanel"));

  return (
    <div className="welcome-root">
      <Sidebar />
      <main className="welcome-main">
        <header className="welcome-header">
          <div className="brand">
            <div className="brand-mark" aria-label="CraftedJewelz logo">
              <span className="c" aria-hidden="true">C</span>
              <span className="j" aria-hidden="true">J</span>
            </div>
            <div className="brand-text">
              <h1>CraftedJewelz</h1>
              <p>Design jewelry with pro-grade precision.</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn primary" aria-label="New Design" onClick={() => showToast("New design started!")}>New Design</button>
            <button className="btn ghost" aria-label="Open Project" onClick={() => showToast("Open project dialog")}>Open Project</button>
            <button className="btn ghost" aria-label="Templates" onClick={() => showToast("Templates coming soon")}>Templates</button>
          </div>
        </header>

        {toast && (
          <div role="status" aria-live="polite" className="toast">
            {toast}
          </div>
        )}

        <section className="panel grid">
          <div className="panel-card" style={{ gridColumn: '1 / -1', marginBottom: 24 }}>
            <React.Suspense fallback={<div>Loading 2D design canvas…</div>}>
              {React.createElement(React.lazy(() => import("../components/JewelryDesignCanvas")))}
            </React.Suspense>
          </div>
          <div className="panel-card hero">
            <h2>Featured Templates</h2>
            <p>Kickstart with ready-to-polish ring, pendant, and eyewear bases.</p>
            <div className="template-strip">
              <div className="template-card" tabIndex={0} aria-label="Classic Ring">Classic Ring</div>
              <div className="template-card" tabIndex={0} aria-label="Halo Pendant">Halo Pendant</div>
              <div className="template-card" tabIndex={0} aria-label="Tennis Bracelet">Tennis Bracelet</div>
              <div className="template-card" tabIndex={0} aria-label="Curb Chain">Curb Chain</div>
            </div>
          </div>
          <div className="panel-card">
            <h2>Tutorials</h2>
            <ul className="list">
              <li>Gem settings and prongs like a pro</li>
              <li>Parametric sizing and fit rules</li>
              <li>Export for print and casting</li>
            </ul>
          </div>
          <div className="panel-card">
            <h2>Marketplace</h2>
            <p>Discover premium packs, fonts, bevels, stones, and materials.</p>
            <button className="btn">Browse Packs</button>
          </div>
        </section>


        <React.Suspense fallback={<div>Loading advanced features…</div>}>
          <CADFeaturePanel />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading studio panel…</div>}>
          <StudioPanel />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading stone pattern selector…</div>}>
          <StonePatternSelector />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading scripting panel…</div>}>
          <ScriptingPanel />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading 3D viewport…</div>}>
          <GeometryViewport />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading earring panel…</div>}>
          <EarringPanel />
        </React.Suspense>
        <React.Suspense fallback={<div>Loading glasses panel…</div>}>
          <GlassesPanel />
        </React.Suspense>

          <React.Suspense fallback={<div>Loading image trace panel…</div>}>
            <ImageTracePanel />
          </React.Suspense>

        <section className="panel">
          <h2>Recent Projects</h2>
          <div className="recent-grid">
            <RecentItem name="Emerald Halo Pendant" updated="Today" />
            <RecentItem name="Custom Grillz Set" updated="Yesterday" />
            <RecentItem name="Signet Ring V2" updated="3 days ago" />
            <RecentItem name="CZ Cuban 10mm" updated="1 week ago" />
          </div>
        </section>
      </main>
    </div>
  );
}
