const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db     = require('../db/turso')
const auth   = require('../middleware/auth')

// GET /api/chat/messages
router.get('/messages', async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT id, username, text, created_at FROM chat_messages ORDER BY created_at ASC LIMIT 100'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// POST /api/chat/messages
router.post('/messages', auth, async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Nachrichtentext fehlt.' })
    if (text.length > 500)
      return res.status(400).json({ message: 'Nachricht zu lang (max. 500 Zeichen).' })

    const id = uuidv4()
    await db.execute({
      sql: 'INSERT INTO chat_messages (id, user_id, username, text) VALUES (?, ?, ?, ?)',
      args: [id, req.user.id, req.user.username, text.trim()]
    })

    res.status(201).json({
      id,
      username: req.user.username,
      text: text.trim(),
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

module.exports = router
