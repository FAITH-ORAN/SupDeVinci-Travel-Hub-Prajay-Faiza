const {
  getCachedOffers,
  cacheOffers,
  publishNewOffer,
} = require('../services/redis.service')
const { findOffers, findOfferById } = require('../services/mongo.service')
const Offer = require('../models/offer.model')

exports.getOffers = async (req, res) => {
  const start = Date.now() // ⏱️ Start timer
  const { from, to, limit = 10 } = req.query
  const key = `offers:${from}:${to}`

  try {
    const cached = await getCachedOffers(key)
    const duration = Date.now() - start

    if (cached) {
      console.log(`📦 [CACHE HIT] - ${duration} ms`)
      return res.json(cached)
    }

    const offers = await findOffers(from, to, parseInt(limit))
    await cacheOffers(key, offers, 60) // TTL 60 sec

    console.log(`🛢️ [CACHE MISS] - ${Date.now() - start} ms`)
    res.json(offers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getOfferById = async (req, res) => {
  const start = Date.now() // ⏱️ Start timer
  const { id } = req.params
  const key = `offers:${id}`

  try {
    const cached = await getCachedOffers(key)
    if (cached) {
      const duration = Date.now() - start
      console.log(`📦 [CACHE HIT] - ${duration} ms`)
      return res.json(cached)
    }

    const offer = await findOfferById(id)
    if (!offer) return res.status(404).json({ error: 'Offer not found' })

    await cacheOffers(key, offer, 300) // TTL 300 sec
    const duration = Date.now() - start
    console.log(`🛢️ [CACHE MISS] - ${duration} ms`)

    res.json(offer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body)

    // Publier sur le canal Redis "offers:new"
    await publishNewOffer({
      offerId: offer._id,
      from: offer.from,
      to: offer.to,
    })

    res.status(201).json(offer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create offer' })
  }
}
