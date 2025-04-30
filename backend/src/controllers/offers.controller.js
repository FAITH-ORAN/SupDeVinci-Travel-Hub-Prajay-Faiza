const {
  getCachedOffers,
  cacheOffers,
  publishNewOffer,
} = require('../services/redis.service')
const {
  findOffers,
  findOfferById,
  findOffersByCitiesAndDates,
} = require('../services/mongo.service')
const {
  httpRequestDurationMicroseconds,
  cacheHits,
  cacheMisses,
} = require('../services/metrics.service')

const { getNearbyCityCodes } = require('../services/neo4j.service')
const Offer = require('../models/offer.model')

exports.getOffers = async (req, res) => {
  const start = Date.now() // ⏱️ Start timer
  const { from, to, limit = 10, q } = req.query

  const isTextSearch = !!q
  const key = isTextSearch ? null : `offers:${from}:${to}`

  try {
    if (key) {
      const cached = await getCachedOffers(key)
      const duration = Date.now() - start
      if (cached) {
        console.log(`📦 [CACHE HIT] - ${duration} ms`)
        return res.json(cached)
      }
    }

    const offers = await findOffers(from, to, parseInt(limit), q)

    if (key) {
      await cacheOffers(key, offers, 60) // TTL 60 sec
      console.log(`🛢️ [CACHE MISS] - ${Date.now() - start} ms`)
    } else {
      console.log(`🔍 [TEXT SEARCH] - ${Date.now() - start} ms`)
    }

    res.json(offers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getOfferById = async (req, res) => {
  const start = Date.now()
  const { id } = req.params
  const key = `offers:${id}`

  try {
    const cached = await getCachedOffers(key)
    const duration = Date.now() - start

    if (cached) {
      console.log(`📦 [CACHE HIT] - ${duration} ms`)
      cacheHits.inc()
      httpRequestDurationMicroseconds
        .labels(req.method, '/api/offers/:id', 200)
        .observe(duration)
      return res.json(cached)
    }

    const offer = await findOfferById(id)
    if (!offer) {
      httpRequestDurationMicroseconds
        .labels(req.method, '/api/offers/:id', 404)
        .observe(Date.now() - start)
      return res.status(404).json({ error: 'Offer not found' })
    }

    const { from, departDate, returnDate } = offer

    // 🔍 Villes proches depuis Neo4j
    const nearbyCities = await getNearbyCityCodes(from, 3)

    // ✈️ Offres dans ces villes aux mêmes dates, sauf elle-même
    const related = await findOffersByCitiesAndDates(
      nearbyCities,
      departDate,
      returnDate,
      id
    )

    const relatedIds = related.map((o) => o._id.toString())

    const enriched = {
      ...offer.toObject(),
      relatedOffers: relatedIds,
    }

    await cacheOffers(key, enriched, 300) // TTL 5 minutes
    console.log(`🛢️ [CACHE MISS] - ${Date.now() - start} ms`)
    cacheMisses.inc()

    httpRequestDurationMicroseconds
      .labels(req.method, '/api/offers/:id', 200)
      .observe(Date.now() - start)

    res.json(enriched)
  } catch (err) {
    console.error(err)
    httpRequestDurationMicroseconds
      .labels(req.method, '/api/offers/:id', 500)
      .observe(Date.now() - start)
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
