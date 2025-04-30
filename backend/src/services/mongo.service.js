const Offer = require('../models/offer.model')

exports.findOffers = async (from, to, limit, q) => {
  const query = { from, to }

  if (q) {
    query.$text = { $search: q } // recherche textuelle sur hotel.name
  }

  return Offer.find(query).sort({ price: 1 }).limit(limit).lean()
}

exports.findOfferById = async (id) => {
  return Offer.findById(id)
}

exports.findOffersByCitiesAndDates = async (cities, departDate, returnDate, excludeId) => {
  return Offer.find({
    from: { $in: cities },
    departDate,
    returnDate,
    _id: { $ne: excludeId }
  })
    .select('_id')
    .limit(3)
    .lean();
};
