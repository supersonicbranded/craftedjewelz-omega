import React from "react";

export default function Welcome({ engineStatus }) {
  return (
    <div className="welcome-wrap">
      <aside className="sidebar">
        <div className="brand">
          <div className="gem" />
          <div>
            <div className="title">CraftedJewelz</div>
            <div className="subtitle">v4</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-btn active">Projects</button>
          <button className="nav-btn">Marketplace</button>
          <button className="nav-btn">Tutorials</button>
          <button className="nav-btn">Settings</button>
        </nav>

        <div className="status">
          <div className="dot" />
          Engine: {engineStatus || "initializing"}
        </div>
      </aside>

      <main className="content">
        <header className="hero">
          <div>
            <h1>Welcome back</h1>
            <p>Create, import, or explore templates from the marketplace.</p>
          </div>
          <div className="hero-actions">
            <button className="btn primary">New Project</button>
            <button className="btn">Open…</button>
          </div>
        </header>

        <section className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="card">
              <div className="thumb" />
              <div className="meta">
                <div className="name">Untitled {i + 1}</div>
                <div className="sub">Edited 2 days ago</div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
