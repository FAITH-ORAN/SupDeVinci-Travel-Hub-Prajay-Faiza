const { getCachedOffers, cacheOffers } = require('../services/redis.service')
const { findOffers } = require('../services/mongo.service')

exports.getOffers = async (req, res) => {
  const { from, to, limit = 10 } = req.query
  const key = `offers:${from}:${to}`

  try {
    const cached = await getCachedOffers(key)
    if (cached) return res.json(cached)

    const offers = await findOffers(from, to, parseInt(limit))
    await cacheOffers(key, offers, 60) // TTL 60 sec

    res.json(offers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
