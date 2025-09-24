import React from "react";

const StudioPanel = () => {
  return (
    <section className="panel-card studio-panel">
      <h2>Full Studio Tools</h2>
      <ul>
        <li>Pen/Path Tool</li>
        <li>Bezier Mode</li>
        <li>Layers (lock/hide)</li>
        <li>Rulers & Guides</li>
        <li>Offset ±</li>
        <li>Boolean Operations (Union, Intersect, Subtract)</li>
        <li>Align Basics</li>
      </ul>
      <div className="feature-note">* UI and geometry engine integration in progress. These tools will enable advanced CAD workflows for jewelry design.</div>
    </section>
  );
};

export default StudioPanel;
