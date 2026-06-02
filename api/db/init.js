/**
 * Einmalig ausführen um Tabellen zu erstellen und Charaktere einzufügen.
 * Lokal: node api/db/init.js
 */
require('dotenv').config()
const db = require('./turso')

async function init() {
  console.log('Erstelle Tabellen...')

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      username   TEXT UNIQUE NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS characters (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      universe    TEXT NOT NULL,
      category    TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS character_ratings (
      user_id      TEXT    NOT NULL,
      character_id INTEGER NOT NULL,
      rating       INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      updated_at   TEXT    DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, character_id),
      FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE CASCADE,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_top5 (
      user_id      TEXT    NOT NULL,
      character_id INTEGER NOT NULL,
      position     INTEGER NOT NULL CHECK(position >= 1 AND position <= 5),
      PRIMARY KEY (user_id, position),
      FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE CASCADE,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id         TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      username   TEXT NOT NULL,
      text       TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  console.log('Tabellen erstellt. Füge Charaktere ein...')

  const characters = [
    ['Gandalf',             'Der Herr der Ringe',       'Fantasy',       'Weiser Zauberer und Hüter Mittelerdes'],
    ['Walter White',        'Breaking Bad',             'Serie',         'Vom Chemielehrer zum Drogenbaron'],
    ['Tyrion Lannister',    'Game of Thrones',          'Serie',         'Der klügste Lannister'],
    ['Sherlock Holmes',     'Arthur Conan Doyle',       'Literatur',     'Der genialste Detektiv der Welt'],
    ['Hermione Granger',    'Harry Potter',             'Fantasy',       'Die klügste Schülerin Hogwarts'],
    ['Tony Stark',          'Marvel',                   'Comic / Film',  'Genie, Milliardär, Iron Man'],
    ['Daenerys Targaryen',  'Game of Thrones',          'Serie',         'Mutter der Drachen'],
    ['Aragorn',             'Der Herr der Ringe',       'Fantasy',       'König von Gondor und Streicher'],
    ['Katniss Everdeen',    'Die Tribute von Panem',    'Film / Buch',   'Das Mädchen in Flammen'],
    ['Darth Vader',         'Star Wars',                'Film',          'Der Dunkle Lord der Sith'],
    ['Yoda',                'Star Wars',                'Film',          'Weiser Jedi-Meister'],
    ['Batman',              'DC',                       'Comic / Film',  'Der dunkle Ritter von Gotham'],
    ['Spider-Man',          'Marvel',                   'Comic / Film',  'Dein freundlicher Nachbarschafts-Superheld'],
    ['Frodo Baggins',       'Der Herr der Ringe',       'Fantasy',       'Der Ringträger aus dem Auenland'],
    ['The Joker',           'DC',                       'Comic / Film',  'Warum so ernst?'],
    ['Elizabeth Bennet',    'Stolz und Vorurteil',      'Literatur',     'Klug, witzig und unabhängig'],
    ['Atticus Finch',       'Wer die Nachtigall stört', 'Literatur',     'Anwalt mit moralischem Rückgrat'],
    ['Han Solo',            'Star Wars',                'Film',          'Schmuggler mit goldenem Herz'],
    ['Legolas',             'Der Herr der Ringe',       'Fantasy',       'Elfenprinz und treffsicherer Bogenschütze'],
    ['Dumbledore',          'Harry Potter',             'Fantasy',       'Direktor von Hogwarts und mächtigster Zauberer'],
  ]

  for (const [name, universe, category, description] of characters) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO characters (name, universe, category, description) VALUES (?, ?, ?, ?)`,
      args: [name, universe, category, description]
    })
  }

  console.log('Fertig! Datenbank ist bereit.')
  process.exit(0)
}

init().catch(err => { console.error(err); process.exit(1) })
