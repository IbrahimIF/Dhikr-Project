const { app, BrowserWindow, ipcMain, shell} = require('electron');
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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  const db = getDB();

  // Get content by type
  ipcMain.handle('get-content-by-type', (event, type) => {
    return db.prepare(`
      SELECT *
      FROM content
      WHERE type = ?
      ORDER BY id ASC
    `).all(type);
  });

  // Get favorites
  ipcMain.handle('get-favorites', () => {
    return db.prepare(`
      SELECT content.*
      FROM content
      JOIN favorites ON content.id = favorites.content_id
    `).all();
  });

  // Toggle favorite
  ipcMain.handle('toggle-favorite', (event, contentId) => {
    const exists = db.prepare(
      'SELECT 1 FROM favorites WHERE content_id = ?'
    ).get(contentId);

    if (exists) {
      db.prepare(
        'DELETE FROM favorites WHERE content_id = ?'
      ).run(contentId);
    } else {
      db.prepare(
        'INSERT INTO favorites (content_id) VALUES (?)'
      ).run(contentId);
    }

    return true;
  });

  // Add new dhikr / dua
  ipcMain.handle('add-content', (event, content) => {
    const insert = db.prepare(`
      INSERT INTO content
      (
        type,
        title,
        arabic,
        transliteration,
        translation,
        context,
        benefit,
        reference,
        explanation,
        youtube
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      content.type,
      content.title,
      content.arabic,
      content.transliteration || '',
      content.meaning || '',
      content.context || '',
      content.benefit || '',
      content.reference || '',
      content.explanation || '',
      content.youtube || ''
    );

    return result.lastInsertRowid;
  });

  // After add-content handler
  ipcMain.handle('update-content', async (event, content) => {
    try {
      const update = db.prepare(`
        UPDATE content SET
          type = ?,
          title = ?,
          arabic = ?,
          transliteration = ?,
          translation = ?,
          context = ?,
          benefit = ?,
          reference = ?,
          explanation = ?,
          youtube = ?
        WHERE id = ?
      `);

      update.run(
        content.type,
        content.title,
        content.arabic,
        content.transliteration || '',
        content.translation || '',
        content.context || '',
        content.benefit || '',
        content.reference || '',
        content.explanation || '',
        content.youtube || '',
        content.id
      );

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('delete-content', (event, id) => {
    // Remove from favorites first
    db.prepare(`
      DELETE FROM favorites
      WHERE content_id = ?
    `).run(id);

    // Remove from content
    db.prepare(`
      DELETE FROM content
      WHERE id = ?
    `).run(id);

    return true;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});