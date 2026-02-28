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

  const db = getDB();

  // IPC: Get content by type
  ipcMain.handle('get-content-by-type', (event, type) => {
    return db.prepare('SELECT * FROM content WHERE type = ? ORDER BY id ASC').all(type);
  });

  // IPC: Get all favorites
  ipcMain.handle('get-favorites', () => {
    return db.prepare(`
      SELECT content.*
      FROM content
      JOIN favorites ON content.id = favorites.content_id
    `).all();
  });

  // IPC: Toggle favorite
  ipcMain.handle('toggle-favorite', (event, contentId) => {
    const exists = db.prepare('SELECT 1 FROM favorites WHERE content_id = ?').get(contentId);
    if (exists) {
      db.prepare('DELETE FROM favorites WHERE content_id = ?').run(contentId);
    } else {
      db.prepare('INSERT INTO favorites (content_id) VALUES (?)').run(contentId);
    }
    return true;
  });

  // IPC: Add new dhikr/dua
  ipcMain.handle('add-content', (event, content) => {
    const insert = db.prepare(`
      INSERT INTO content
      (type, title, when_to_recite, benefit, arabic, translation, reference, story, youtube_link, audio_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(
      content.type,
      content.title,
      content.when_to_recite || '',
      content.benefit || '',
      content.arabic,
      content.translation || '',
      content.reference || '',
      content.story || '',
      content.youtube_link || '',
      content.audio_path || ''
    );
    return result.lastInsertRowid;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
