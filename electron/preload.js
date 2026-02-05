// electron-preload.js (in your project root)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  // Add other functions you want to expose to your React app here
  // Example: expose a function to open a native dialog
  // openDialog: () => ipcRenderer.invoke('open-dialog')
});