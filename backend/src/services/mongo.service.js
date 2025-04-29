const Offer = require('../models/offer.model')

exports.findOffers = async (from, to, limit) => {
  return Offer.find({ from, to }).sort({ price: 1 }).limit(limit).lean()
}
