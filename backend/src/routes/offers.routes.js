const express = require('express')
const router = express.Router()
const { getOffers, getOfferById } = require('../controllers/offers.controller')

router.get('/offers', getOffers)
router.get('/offers/:id', getOfferById)

module.exports = router
