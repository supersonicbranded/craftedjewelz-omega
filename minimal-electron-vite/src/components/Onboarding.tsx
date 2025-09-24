import React from "react";

const Onboarding: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  // Placeholder for onboarding steps, can be expanded with interactive tour, account setup, etc.
  return (
    <div className="onboarding-container p-8 max-w-xl mx-auto mt-16 bg-gray-900 rounded-xl shadow-lg text-gray-100 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-4 text-gold">Welcome to CraftedJewelz!</h2>
      <p className="mb-6">Let's get you started with a quick tour and setup. You can customize your workspace, explore features, and access tutorials anytime.</p>
      <ul className="list-disc pl-6 mb-6">
        <li>Explore the Menu Bar for all major tools and plugins</li>
        <li>Try the Jewelry Design Canvas for 2D/3D modeling</li>
        <li>Access tutorials and help from the Help menu</li>
        <li>Customize your theme and language in Settings</li>
      </ul>
      <button className="bg-gold text-gray-900 font-semibold px-6 py-2 rounded shadow hover:bg-yellow-400 transition" onClick={onFinish}>Start Designing</button>
    </div>
  );
};

export default Onboarding;
