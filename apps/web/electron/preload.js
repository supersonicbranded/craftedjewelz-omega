const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("craftedjewelz", {
  version: "1.0.0",
  ping: () => "pong"
});
