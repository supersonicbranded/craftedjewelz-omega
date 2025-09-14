import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("crafted", {
  ping: async () => ipcRenderer.invoke("app:ping")
});
