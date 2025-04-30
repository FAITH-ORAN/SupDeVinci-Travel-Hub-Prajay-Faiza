const express = require('express')
const router = express.Router()
const { getTopDestinations } = require('../controllers/stats.controller')

router.get('/stats/top-destinations', getTopDestinations)

module.exports = router
