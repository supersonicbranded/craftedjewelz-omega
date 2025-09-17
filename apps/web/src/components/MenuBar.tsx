import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const menuItems = (t: any) => [
  {
    label: t('menu_file'),
    submenu: [
      { label: "New Project" },
      { label: "Open..." },
      { label: "Save" },
      { label: "Save As..." },
      { label: "Export" },
      { label: "Import" },
      { label: "Close" }
    ]
  },
  {
    label: t('menu_edit'),
    submenu: [
      { label: "Undo" },
      { label: "Redo" },
      { label: "Cut" },
      { label: "Copy" },
      { label: "Paste" },
      { label: "Delete" }
    ]
  },
  {
    label: t('menu_view'),
    submenu: [
      { label: "Zoom In" },
      { label: "Zoom Out" },
      { label: "Reset View" },
      { label: "Theme" }
    ]
  },
  {
    label: t('menu_plugins'),
    submenu: [
      { label: "Marketplace" },
      { label: "Manage Plugins" }
    ]
  },
  {
    label: t('menu_tools'),
    submenu: [
      { label: "Performance" },
      { label: "Scripting" },
      { label: "AI Design" },
      { label: "Manufacturing Checks" }
    ]
  },
  {
    label: t('menu_help'),
    submenu: [
      { label: "Tutorials" },
      { label: "Documentation" },
      { label: "Community Forum" },
      { label: "About" }
    ]
  },
  {
    label: t('menu_account'),
    submenu: [
      { label: "Profile" },
      { label: "Settings" },
      { label: "Sign Out" }
    ]
  }
];

export default function MenuBar() {
  const { t } = useTranslation();
  const items = menuItems(t);
  const [search, setSearch] = React.useState("");
  const [notifications, setNotifications] = React.useState(2); // Example: 2 unread
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (window.crafted && window.crafted.ipcRenderer) {
      window.crafted.ipcRenderer.on("update_available", () => setUpdateAvailable(true));
      window.crafted.ipcRenderer.on("update_downloaded", () => setUpdateDownloaded(true));
      window.crafted.ipcRenderer.on("update_error", (_event, err) => setUpdateError(err));
    }
    return () => {
      if (window.crafted && window.crafted.ipcRenderer) {
        window.crafted.ipcRenderer.removeAllListeners("update_available");
        window.crafted.ipcRenderer.removeAllListeners("update_downloaded");
        window.crafted.ipcRenderer.removeAllListeners("update_error");
      }
    };
  }, []);

  const handleRestart = () => {
    if (window.crafted && window.crafted.ipcRenderer) {
      window.crafted.ipcRenderer.send("restart_app");
    }
  };

  return (
    <nav
      className="menu-bar bg-gray-900 border-b border-yellow-600 shadow flex items-center px-4 h-12 z-50"
      role="menubar"
      aria-label="Main menu bar"
      tabIndex={0}
    >
      {/* Update notification banner */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 w-full bg-blue-900 text-yellow-200 text-center py-2 z-50">
          {updateDownloaded
            ? <span>Update downloaded! <button className="bg-yellow-400 text-gray-900 px-2 py-1 rounded font-bold ml-2" onClick={handleRestart}>Restart to update</button></span>
            : <span>New update available. Downloading...</span>
          }
        </div>
      )}
      {updateError && (
        <div className="fixed top-0 left-0 w-full bg-red-900 text-yellow-200 text-center py-2 z-50">
          Update error: {updateError}
        </div>
      )}
      {/* Global search bar */}
      <div className="relative mr-6 flex items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-800 text-yellow-200 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 w-48"
          placeholder={t('search_placeholder')}
          aria-label={t('search_global')}
        />
        <span className="absolute right-2 text-yellow-400 text-lg" role="img" aria-label="Search">🔍</span>
      </div>
      {/* Notification indicator */}
      <div className="relative mr-6">
        <button
          className="bg-gray-800 text-yellow-400 px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label={t('notifications')}
          title={t('notifications')}
        >
          <span role="img" aria-label="Notifications">🔔</span>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{notifications}</span>
          )}
        </button>
      </div>
      {/* Menu items */}
      {items.map((item) => (
        <div key={item.label} className="relative group mr-6" role="none">
          <button
            className="font-semibold text-yellow-400 hover:text-yellow-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-150"
            role="menuitem"
            aria-haspopup="true"
            aria-expanded="false"
            tabIndex={0}
            aria-label={item.label}
            title={`Open ${item.label} menu`}
          >
            {item.label}
          </button>
          <div
            className="absolute left-0 top-full min-w-[160px] bg-gray-800 border border-yellow-600 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150"
            role="menu"
            aria-label={`${item.label} submenu`}
          >
            {item.submenu.map((sub, idx) => (
              <div
                key={sub.label}
                className="px-4 py-2 text-sm text-yellow-200 hover:bg-yellow-900 hover:text-yellow-100 cursor-pointer transition-colors duration-100"
                role="menuitem"
                tabIndex={0}
                aria-label={sub.label}
              >
                {sub.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
// End of MenuBar
