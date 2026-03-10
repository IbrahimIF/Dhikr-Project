const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db;

function initDatabase() {
  let dbPath;

  if (app.isPackaged) {
    // In production, use a writable copy in userData
    const userDataPath = app.getPath('userData');
    const userDbPath = path.join(userDataPath, 'islamic-content.db');
    const versionFile = path.join(userDataPath, 'db_version.txt');
    const currentVersion = app.getVersion();
    const storedVersion = fs.existsSync(versionFile)
      ? fs.readFileSync(versionFile, 'utf8').trim()
      : null;

    // Copy fresh seed DB on first run or when app version changes
    if (!fs.existsSync(userDbPath) || storedVersion !== currentVersion) {
      const sourceDb = path.join(process.resourcesPath, 'islamic-content.db');
      fs.copyFileSync(sourceDb, userDbPath);
      fs.writeFileSync(versionFile, currentVersion);
    }

    dbPath = userDbPath;
  } else {
    dbPath = path.join(__dirname, 'islamic-content.db');
  }

  db = new Database(dbPath);

  // Ensure tables exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      arabic TEXT NOT NULL,
      transliteration TEXT,
      translation TEXT,
      context TEXT,
      benefit TEXT,
      reference TEXT,
      explanation TEXT,
      youtube TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      UNIQUE(content_id),
      FOREIGN KEY(content_id) REFERENCES content(id)
    );
  `);

  const row = db.prepare('SELECT COUNT(*) AS count FROM content').get();
  if (row.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {

  const insert = db.prepare(`
    INSERT INTO content
    (type, title, arabic, transliteration, translation, context, benefit, reference, explanation, youtube)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });

  insertMany(seedData);
  console.log("Database seeded successfully.");
}

function getDB() {
  return db;
}

module.exports = { initDatabase, getDB };