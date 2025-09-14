import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo-row">
        <div className="badge">
          <span className="c">C</span>
          <span className="j">J</span>
        </div>
        <span className="title">CraftedJewelz</span>
      </div>
      <nav className="nav">
        <button className="nav-item active">Welcome</button>
        <button className="nav-item">Projects</button>
        <button className="nav-item">Templates</button>
        <button className="nav-item">Marketplace</button>
        <button className="nav-item">Learn</button>
        <button className="nav-item">Settings</button>
      </nav>
      <div className="sidebar-footer">
        <div className="small">v3.1.0</div>
        <button className="btn small">Sign In</button>
      </div>
    </aside>
  );
}
