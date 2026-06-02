const express = require('express')
const cors    = require('cors')

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use('/api/auth',       require('./routes/auth'))
app.use('/api/characters', require('./routes/characters'))
app.use('/api/chat',       require('./routes/chat'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'KBNI' }))

// 404 für unbekannte API-Routen
app.use('/api/*', (_req, res) => res.status(404).json({ message: 'Route nicht gefunden.' }))

module.exports = app
