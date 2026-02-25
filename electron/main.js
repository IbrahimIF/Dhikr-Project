const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getDB } = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#080b13',
      symbolColor: '#ffffff'
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      autoplayPolicy: 'no-user-gesture-required'
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const db = getDB();

// IPC handlers
ipcMain.handle('get-content-by-type', (event, type) => {
  return db.prepare('SELECT * FROM content WHERE type = ?').all(type);
});

ipcMain.handle('get-favorites', () => {
  return db.prepare(`
    SELECT content.*
    FROM content
    JOIN favorites ON content.id = favorites.content_id
  `).all();
});

ipcMain.handle('toggle-favorite', (event, contentId) => {
  const exists = db.prepare('SELECT 1 FROM favorites WHERE content_id = ?').get(contentId);
  if (exists) {
    db.prepare('DELETE FROM favorites WHERE content_id = ?').run(contentId);
  } else {
    db.prepare('INSERT INTO favorites (content_id) VALUES (?)').run(contentId);
  }
  return true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});