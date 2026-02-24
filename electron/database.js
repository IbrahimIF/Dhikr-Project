const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'dhikr.db');
const db = new Database(dbPath);

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS dhikr (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    arabic TEXT NOT NULL,
    translation TEXT,
    reference TEXT
  );

  CREATE TABLE IF NOT EXISTS dua (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    arabic TEXT NOT NULL,
    translation TEXT,
    reference TEXT
  );
`);

module.exports = db;