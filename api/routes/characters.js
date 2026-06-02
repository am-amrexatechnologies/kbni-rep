const router = require('express').Router()
const db     = require('../db/turso')
const auth   = require('../middleware/auth')

// GET /api/characters  — alle Charaktere mit Bewertungen
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT
        c.id, c.name, c.universe, c.category, c.description,
        ROUND(AVG(cr.rating), 1) AS avg_rating,
        COUNT(cr.rating)         AS rating_count
      FROM characters c
      LEFT JOIN character_ratings cr ON cr.character_id = c.id
      GROUP BY c.id
      ORDER BY avg_rating DESC NULLS LAST, rating_count DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// GET /api/characters/my-ratings  — eigene Bewertungen (eingeloggt)
router.get('/my-ratings', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT character_id, rating FROM character_ratings WHERE user_id = ?',
      args: [req.user.id]
    })
    // Gibt Map zurück: { characterId: rating }
    const map = {}
    for (const row of result.rows) map[row.character_id] = row.rating
    res.json(map)
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// POST /api/characters/rate  — Charakter bewerten
router.post('/rate', auth, async (req, res) => {
  try {
    const { characterId, rating } = req.body
    if (!characterId || !rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Ungültige Bewertung.' })

    await db.execute({
      sql: `INSERT INTO character_ratings (user_id, character_id, rating, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, character_id) DO UPDATE SET rating = excluded.rating, updated_at = excluded.updated_at`,
      args: [req.user.id, characterId, rating]
    })
    res.json({ message: 'Bewertung gespeichert.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// GET /api/characters/top5  — eigene Top 5
router.get('/top5', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT character_id, position FROM user_top5 WHERE user_id = ? ORDER BY position',
      args: [req.user.id]
    })
    res.json(result.rows.map(r => ({ characterId: r.character_id, position: r.position })))
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// PUT /api/characters/top5  — Top 5 speichern (Array von character_ids, Index = Position)
router.put('/top5', auth, async (req, res) => {
  try {
    const { list } = req.body // Array mit max. 5 character_ids
    if (!Array.isArray(list) || list.length > 5)
      return res.status(400).json({ message: 'Liste muss ein Array mit max. 5 Einträgen sein.' })

    await db.execute({ sql: 'DELETE FROM user_top5 WHERE user_id = ?', args: [req.user.id] })

    for (let i = 0; i < list.length; i++) {
      await db.execute({
        sql: 'INSERT INTO user_top5 (user_id, character_id, position) VALUES (?, ?, ?)',
        args: [req.user.id, list[i], i + 1]
      })
    }
    res.json({ message: 'Top 5 gespeichert.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

module.exports = router
