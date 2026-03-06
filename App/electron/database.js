const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

let db;

function initDatabase() {
  const dbPath = path.join(__dirname, 'islamic-content.db');

  // Ensure directory exists (usually already exists if inside electron folder)
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
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

  const seedData = [
    [
      "dhikr",
      "Morning Protection",
      "اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ خَلَقْتَني وأنا عَبْـدُك",
      "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana abduka",
      "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant.",
      "Recite every morning",
      "Whoever recites it sincerely will enter Paradise if they die that day.",
      "Sahih al-Bukhari 6306",
      "This is Sayyidul Istighfar, the greatest supplication for seeking forgiveness.",
      "https://www.youtube.com/watch?v=7pQj9kF8H0g"
    ],

    [
      "dua",
      "Dua for Anxiety",
      "اللّهُـمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ",
      "Allahumma inni a'udhu bika min al-hammi wal-hazan",
      "O Allah, I seek refuge in You from anxiety and sorrow.",
      "When feeling stressed or overwhelmed",
      "Removes sadness and brings peace to the heart.",
      "Sahih al-Bukhari 2893",
      "The Prophet ﷺ frequently recited this when facing hardship.",
      "https://www.youtube.com/watch?v=Qj8nKZkGz0A"
    ]
  ];

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