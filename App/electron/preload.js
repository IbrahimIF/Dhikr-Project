const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getContentByType: (type) => ipcRenderer.invoke('get-content-by-type', type),
  getFavorites: () => ipcRenderer.invoke('get-favorites'),
  toggleFavorite: (id) => ipcRenderer.invoke('toggle-favorite', id),
  addContent: (content) => ipcRenderer.invoke('add-content', content),
  updateContent: (content) => ipcRenderer.invoke('update-content', content),
  deleteContent: (id) => ipcRenderer.invoke('delete-content', id)
});
