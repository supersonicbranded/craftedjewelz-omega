const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("craftedjewelz", {
  ping: () => "pong",
  getVersion: () => ipcRenderer.invoke("get-version"),
  saveFile: (data) => ipcRenderer.invoke("save-file", data),
  openFile: () => ipcRenderer.invoke("open-file"),
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates")
});
