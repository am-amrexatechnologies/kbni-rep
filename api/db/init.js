/**
 * Einmalig ausführen um Tabellen zu erstellen und Seed-Daten einzufügen.
 * Lokal: node api/db/init.js
 */
require('dotenv').config()
const db = require('./turso')

async function init() {
  console.log('Erstelle Tabellen...')

  // Einzelne Statements — executeMultiple kann mit Turso/libsql je nach Version
  // Probleme bei mehreren DDL-Statements haben; sicherer: einzeln ausführen.
  const ddl = [
    `CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email    TEXT UNIQUE NOT NULL,
      pwhash   TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS anime (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      animename TEXT UNIQUE NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS anime_characters (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      lastname TEXT NOT NULL,
      age     INTEGER,
      animeid INTEGER NOT NULL,
      FOREIGN KEY (animeid) REFERENCES anime(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS chat (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT NOT NULL,
      text       TEXT NOT NULL,
      type       TEXT NOT NULL DEFAULT 'message',
      timeposted TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS character_ratings (
      user_id      INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      rating       INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
      updated_at   TEXT    NOT NULL,
      PRIMARY KEY (user_id, character_id),
      FOREIGN KEY (user_id)      REFERENCES users(id)            ON DELETE CASCADE,
      FOREIGN KEY (character_id) REFERENCES anime_characters(id) ON DELETE CASCADE
    )`,
  ]

  for (const sql of ddl) {
    await db.execute(sql)
  }

  console.log('Tabellen erstellt. Füge Seed-Daten ein...')

  // Anime
  const animeList = [
    'Sword Art Online',
    'Attack on Titan',
    'Naruto',
    'Death Note',
    'One Piece',
    'Dragon Ball Z',
    'Fullmetal Alchemist: Brotherhood',
    'Demon Slayer',
    'My Hero Academia',
    'Tokyo Ghoul',
  ]
  for (const animename of animeList) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO anime (animename) VALUES (?)',
      args: [animename],
    })
  }

  // Charaktere: [name, lastname, age, animename]
  const characters = [
    ['Kirito',   'Kirigaya',   17, 'Sword Art Online'],
    ['Asuna',    'Yuuki',      17, 'Sword Art Online'],
    ['Eren',     'Yeager',     19, 'Attack on Titan'],
    ['Mikasa',   'Ackerman',   19, 'Attack on Titan'],
    ['Naruto',   'Uzumaki',    17, 'Naruto'],
    ['Sasuke',   'Uchiha',     17, 'Naruto'],
    ['Light',    'Yagami',     17, 'Death Note'],
    ['L',        'Lawliet',    24, 'Death Note'],
    ['Monkey D.','Luffy',      17, 'One Piece'],
    ['Roronoa',  'Zoro',       19, 'One Piece'],
    ['Goku',     'Son',        23, 'Dragon Ball Z'],
    ['Vegeta',   'Ouji',       30, 'Dragon Ball Z'],
    ['Edward',   'Elric',      15, 'Fullmetal Alchemist: Brotherhood'],
    ['Roy',      'Mustang',    29, 'Fullmetal Alchemist: Brotherhood'],
    ['Tanjiro',  'Kamado',     15, 'Demon Slayer'],
    ['Nezuko',   'Kamado',     14, 'Demon Slayer'],
    ['Izuku',    'Midoriya',   16, 'My Hero Academia'],
    ['Katsuki',  'Bakugou',    16, 'My Hero Academia'],
    ['Ken',      'Kaneki',     18, 'Tokyo Ghoul'],
    ['Touka',    'Kirishima',  18, 'Tokyo Ghoul'],
  ]

  for (const [name, lastname, age, animename] of characters) {
    const animeRow = await db.execute({
      sql: 'SELECT id FROM anime WHERE animename = ?',
      args: [animename],
    })
    if (!animeRow.rows[0]) continue
    const animeid = animeRow.rows[0].id

    await db.execute({
      sql: 'INSERT OR IGNORE INTO anime_characters (name, lastname, age, animeid) VALUES (?, ?, ?, ?)',
      args: [name, lastname, age, animeid],
    })
  }

  console.log('Fertig! Datenbank ist bereit.')
  process.exit(0)
}

init().catch(err => { console.error(err); process.exit(1) })
