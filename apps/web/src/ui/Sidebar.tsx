import React from 'react';

const Sidebar: React.FC = () => (
  <aside className="sidebar bg-white border-r w-56 min-h-screen flex flex-col shadow">
    <div className="sidebar-header px-4 py-3 font-bold text-lg text-indigo-700">CraftedJewelz</div>
    <nav className="sidebar-nav flex-1 px-2">
      <ul className="space-y-2">
        <li><a href="#" className="block px-2 py-1 rounded hover:bg-indigo-50">Workspace</a></li>
        <li><a href="#" className="block px-2 py-1 rounded hover:bg-indigo-50">Projects</a></li>
        <li><a href="#" className="block px-2 py-1 rounded hover:bg-indigo-50">Marketplace</a></li>
        <li><a href="#" className="block px-2 py-1 rounded hover:bg-indigo-50">Plugins</a></li>
        <li><a href="#" className="block px-2 py-1 rounded hover:bg-indigo-50">Settings</a></li>
      </ul>
    </nav>
    <div className="sidebar-footer px-4 py-2 text-xs text-gray-500">© 2025 CraftedJewelz</div>
  </aside>
);

export default Sidebar;
