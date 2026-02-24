import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      nodeIntegration: false, // Strongly recommended for security
      contextIsolation: true, // Strongly recommended for security
      enableRemoteModule: false, // Deprecated, set to false for security
      autoplayPolicy: 'no-user-gesture-required'
    },
  });

  // Determine if the app is packaged (production) or running in development
  if (app.isPackaged) {
    // In a packaged app, 'dist' is at the root of the app's resources.
    // app.getAppPath() returns the path to the current application directory.
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  } else {
    // In development, load from the Vite dev server
    // Make sure this matches the port Vite uses (usually 5173)
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools(); // Open DevTools in dev mode
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


const { ipcMain } = require('electron');
const db = require('./database');

ipcMain.handle('get-dhikr', () => {
  return db.prepare('SELECT * FROM dhikr').all();
});

ipcMain.handle('get-duas', () => {
  return db.prepare('SELECT * FROM dua').all();
});

ipcMain.handle('add-dhikr', (event, dhikr) => {
  const stmt = db.prepare(`
    INSERT INTO dhikr (title, arabic, translation, reference)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(dhikr.title, dhikr.arabic, dhikr.translation, dhikr.reference);
});

app.on('window-all-closed', () => {
  // Quit the app when all windows are closed, except on macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
