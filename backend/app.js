const express = require('express')
const app = express()
const offersRoutes = require('./src/routes/offers.routes')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api', offersRoutes)

module.exports = app
