import React from "react";

const EarringPanel = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Earring Components</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Default Posts</h3>
        <ul>
          <li>Regular Post</li>
          <li>Screw-On Post</li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Default Backings</h3>
        <ul>
          <li>Regular Backing</li>
          <li>Screw-On Backing</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">Custom Earring Design</h3>
        <p>Design custom earrings using default posts and backings, or add your own.</p>
      </div>
    </div>
  );
};

export default EarringPanel;
