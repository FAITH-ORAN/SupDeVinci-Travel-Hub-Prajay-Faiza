const express = require('express')
const app = express()
const cors = require('cors')
const offersRoutes = require('./src/routes/offers.routes')

app.use(cors())
app.use(express.json())

app.use('/api', offersRoutes)

// ❌ Gestion des routes non trouvées (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  })
})

// 💥 Gestion des erreurs internes (500+)
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

module.exports = app
