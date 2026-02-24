const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getDhikr: () => ipcRenderer.invoke('get-dhikr'),
  getDuas: () => ipcRenderer.invoke('get-duas'),
  addDhikr: (data) => ipcRenderer.invoke('add-dhikr', data)
});