const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const db      = require('../db/turso')
const auth    = require('../middleware/auth')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Alle Felder sind Pflicht.' })
    if (username.length < 3)
      return res.status(400).json({ message: 'Benutzername muss mindestens 3 Zeichen haben.' })
    if (password.length < 6)
      return res.status(400).json({ message: 'Passwort muss mindestens 6 Zeichen haben.' })

    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE username = ? OR email = ?',
      args: [username, email]
    })
    if (existing.rows.length > 0)
      return res.status(409).json({ message: 'Benutzername oder E-Mail bereits vergeben.' })

    const password_hash = await bcrypt.hash(password, 10)
    const id = uuidv4()

    await db.execute({
      sql: 'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
      args: [id, username, email, password_hash]
    })

    res.status(201).json({ message: 'Registrierung erfolgreich.' })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ message: 'Benutzername und Passwort erforderlich.' })

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    })
    const user = result.rows[0]
    if (!user)
      return res.status(401).json({ message: 'Benutzername oder Passwort falsch.' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid)
      return res.status(401).json({ message: 'Benutzername oder Passwort falsch.' })

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, createdAt: user.created_at }
    })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT id, username, email, created_at FROM users WHERE id = ?',
      args: [req.user.id]
    })
    if (!result.rows[0]) return res.status(404).json({ message: 'Nutzer nicht gefunden.' })
    const u = result.rows[0]
    res.json({ id: u.id, username: u.username, email: u.email, createdAt: u.created_at })
  } catch (err) {
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body

    // Check duplicates
    if (username || email) {
      const check = await db.execute({
        sql: 'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        args: [username || '', email || '', req.user.id]
      })
      if (check.rows.length > 0)
        return res.status(409).json({ message: 'Benutzername oder E-Mail bereits vergeben.' })
    }

    // Password change?
    if (currentPassword && newPassword) {
      if (newPassword.length < 6)
        return res.status(400).json({ message: 'Neues Passwort muss mindestens 6 Zeichen haben.' })

      const result = await db.execute({
        sql: 'SELECT password_hash FROM users WHERE id = ?',
        args: [req.user.id]
      })
      const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
      if (!valid)
        return res.status(401).json({ message: 'Aktuelles Passwort falsch.' })

      const newHash = await bcrypt.hash(newPassword, 10)
      await db.execute({
        sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
        args: [newHash, req.user.id]
      })
    }

    // Update username/email
    if (username) await db.execute({ sql: 'UPDATE users SET username = ? WHERE id = ?', args: [username, req.user.id] })
    if (email)    await db.execute({ sql: 'UPDATE users SET email = ?    WHERE id = ?', args: [email,    req.user.id] })

    const updated = await db.execute({
      sql: 'SELECT id, username, email, created_at FROM users WHERE id = ?',
      args: [req.user.id]
    })
    const u = updated.rows[0]

    const token = jwt.sign(
      { id: u.id, username: u.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: u.id, username: u.username, email: u.email, createdAt: u.created_at }
    })
  } catch (err) {
    console.error('profile update error:', err)
    res.status(500).json({ message: 'Serverfehler.' })
  }
})

module.exports = router
