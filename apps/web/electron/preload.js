import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("crafted", {
  ping: async () => ipcRenderer.invoke("app:ping"),
  ipcRenderer: {
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    send: (channel, ...args) => ipcRenderer.send(channel, ...args)
  }
});
