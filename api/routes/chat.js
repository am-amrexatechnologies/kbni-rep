const router = require('express').Router()
const db     = require('../db/turso')
const auth   = require('../middleware/auth')

// GET /api/chat/messages — letzte 100 Nachrichten
router.get('/messages', async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT id, username, text, type, timeposted FROM chat ORDER BY timeposted ASC LIMIT 100'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// POST /api/chat/messages — Nachricht senden (eingeloggt)
router.post('/messages', auth, async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Nachrichtentext fehlt.' })
    if (text.length > 500)
      return res.status(400).json({ message: 'Nachricht zu lang (max. 500 Zeichen).' })

    const timeposted = new Date().toISOString()

    await db.execute({
      sql: 'INSERT INTO chat (username, text, type, timeposted) VALUES (?, ?, ?, ?)',
      args: [req.user.username, text.trim(), 'message', timeposted],
    })

    // Letzten eingefügten Eintrag zurückgeben
    const inserted = await db.execute({
      sql: 'SELECT id, username, text, type, timeposted FROM chat WHERE username = ? AND timeposted = ?',
      args: [req.user.username, timeposted],
    })

    res.status(201).json(inserted.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

module.exports = router
