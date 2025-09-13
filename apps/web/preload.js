const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('craftedAPI', {
  ping: () => 'pong'
});
