import React from "react";
import Sidebar from "../ui/Sidebar";
import RecentItem from "../ui/RecentItem";

export default function Welcome() {
  return (
    <div className="welcome-root">
      <Sidebar />
      <main className="welcome-main">
        <header className="welcome-header">
          <div className="brand">
            <div className="brand-mark">
              <span className="c">C</span>
              <span className="j">J</span>
            </div>
            <div className="brand-text">
              <h1>CraftedJewelz</h1>
              <p>Design jewelry with pro-grade precision.</p>
            </div>
          </div>
          <div className="actions">
            <button className="btn primary">New Design</button>
            <button className="btn ghost">Open Project</button>
            <button className="btn ghost">Templates</button>
          </div>
        </header>

        <section className="panel grid">
          <div className="panel-card hero">
            <h2>Featured Templates</h2>
            <p>Kickstart with ready-to-polish ring, pendant, and eyewear bases.</p>
            <div className="template-strip">
              <div className="template-card">Classic Ring</div>
              <div className="template-card">Halo Pendant</div>
              <div className="template-card">Tennis Bracelet</div>
              <div className="template-card">Curb Chain</div>
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
