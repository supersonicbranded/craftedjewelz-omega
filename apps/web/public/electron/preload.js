const { contextBridge } = require("electron");

// Expose safe APIs to frontend
contextBridge.exposeInMainWorld("api", {
  appName: "CraftedJewelz",
  version: "3.0.2"
});
