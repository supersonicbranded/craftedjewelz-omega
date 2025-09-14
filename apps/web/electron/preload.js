import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("crafted", {
  getVersion: async () => ipcRenderer.invoke("app:getVersion")
});
