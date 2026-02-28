const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db;

function initDatabase() {
  const isDev = !app.isPackaged;

  // Paths
  const bundledDbPath = isDev
    ? path.join(__dirname, 'assets', 'db', 'islamic-content.db') // pre-seeded DB
    : path.join(process.resourcesPath, 'assets', 'db', 'islamic-content.db');

  const userDbPath = path.join(app.getPath('userData'), 'islamic-content.db'); // writable copy

  // Copy bundled DB to userData on first run
  if (!fs.existsSync(userDbPath)) {
    fs.copyFileSync(bundledDbPath, userDbPath);
    console.log('Copied bundled DB to userData:', userDbPath);
  }

  // Open writable DB
  db = new Database(userDbPath);

  // Ensure tables exist (for safety)
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      when_to_recite TEXT,
      benefit TEXT,
      arabic TEXT NOT NULL,
      translation TEXT,
      reference TEXT,
      story TEXT,
      youtube_link TEXT,
      audio_path TEXT,
      is_seeded INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL,
      UNIQUE(content_id),
      FOREIGN KEY(content_id) REFERENCES content(id)
    );
  `);

  // Seed data if no seeded content exists
  const seededCount = db.prepare('SELECT COUNT(*) AS count FROM content WHERE is_seeded=1').get().count;
  if (seededCount === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  const insert = db.prepare(`
    INSERT INTO content
    (type, title, when_to_recite, benefit, arabic, translation, reference, story, youtube_link, audio_path, is_seeded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  const seedData = [
    [
      'dhikr',
      'Morning Protection Dhikr',
      'Recite in the morning after Fajr',
      'Protection from harm throughout the day',
      'اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ...',
      'O Allah, You are my Lord, none has the right to be worshipped except You...',
      'Abu Dawud 5074',
      'The Prophet ﷺ taught this as a protection supplication for the morning and evening.',
      'https://www.youtube.com/watch?v=example',
      'audio/morning_protection.mp3'
    ],
    [
      'dua',
      'Dua for Anxiety',
      'When feeling worried or distressed',
      'Relieves anxiety and distress',
      'اللّهُـمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ...',
      'O Allah, I seek refuge in You from anxiety and sorrow...',
      'Bukhari 2893',
      'This dua was frequently recited by the Prophet ﷺ during hardship.',
      'https://www.youtube.com/watch?v=example2',
      'audio/anxiety_dua.mp3'
    ]
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });

  insertMany(seedData);
}

function getDB() {
  return db;
}

module.exports = {
  initDatabase,
  getDB
};
