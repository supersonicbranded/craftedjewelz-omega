import React from "react";

const GlassesPanel = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Glasses Frames</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Default Styles</h3>
        <ul>
          <li>Cartier Style Frame</li>
          <li>Ray-Ban Style Frame</li>
          <li>Custom Frame</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Diamond Customization</h3>
        <p>Add diamonds to frames, nose bridges, and hinges.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Default Nose Bridges & Hinges</h3>
        <ul>
          <li>Cartier Nose Bridge</li>
          <li>Cartier Hinges</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Custom Glasses Design</h3>
        <p>Customize frames, nose bridges, hinges, and add diamonds as desired.</p>
      </div>
    </div>
  );
};

export default GlassesPanel;
