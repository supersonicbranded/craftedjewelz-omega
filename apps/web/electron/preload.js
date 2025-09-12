// apps/web/electron/preload.js
const { contextBridge } = require("electron");

// ✅ This is a safe bridge between frontend (React/Vite) and backend (Electron)
contextBridge.exposeInMainWorld("craftedjewelzAPI", {
  version: "1.0.0",
  ping: () => "pong"
});
