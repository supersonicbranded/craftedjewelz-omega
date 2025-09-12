// apps/web/electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Expose safe APIs to the frontend (React/Vite)
contextBridge.exposeInMainWorld("craftedjewelz", {
  // Basic ping test
  ping: () => "pong",

  // ⚡ File I/O helpers
  saveFile: async (data, defaultPath) => {
    return await ipcRenderer.invoke("file:save", { data, defaultPath });
  },
  openFile: async () => {
    return await ipcRenderer.invoke("file:open");
  },

  // 💎 Jewelry CAD-specific configs
  getDiamondSettings: async () => {
    return await ipcRenderer.invoke("cad:getDiamondSettings");
  },
  setDiamondSettings: async (settings) => {
    return await ipcRenderer.invoke("cad:setDiamondSettings", settings);
  },

  // 🔄 Auto-updater hooks
  checkForUpdates: () => ipcRenderer.send("update:check"),
  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update:available", (_event, info) => callback(info)),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update:downloaded", (_event, info) => callback(info)),

  // 🛠️ App info
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
});

