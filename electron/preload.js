const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getContentByType: (type) => ipcRenderer.invoke('get-content-by-type', type),
  getFavorites: () => ipcRenderer.invoke('get-favorites'),
  toggleFavorite: (id) => ipcRenderer.invoke('toggle-favorite', id)
});