// Lokaler Dev-Server – nicht für Produktion
require('dotenv').config()
const app = require('./api/index')

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`KBNI API läuft auf http://localhost:${PORT}`)
})
