const express = require('express')
const router = express.Router()
const { getOffers } = require('../controllers/offers.controller')

router.get('/offers', getOffers)

module.exports = router
