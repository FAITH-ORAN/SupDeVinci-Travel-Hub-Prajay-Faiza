const express = require('express')
const router = express.Router()
const {
  getOffers,
  getOfferById,
  createOffer,
} = require('../controllers/offers.controller')

router.get('/offers', getOffers)
router.get('/offers/:id', getOfferById)
router.post('/offers', createOffer)

module.exports = router
