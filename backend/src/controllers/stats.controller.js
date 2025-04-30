const { getCachedStats, cacheStats } = require('../services/redis.service')
const Offer = require('../models/offer.model')

exports.getTopDestinations = async (req, res) => {
  const key = 'stats:top-destinations'

  try {
    const cached = await getCachedStats(key)
    if (cached) {
      console.log('📦 [CACHE HIT]')
      return res.json(cached)
    }

    const result = await Offer.aggregate([
      { $group: { _id: '$to', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { destination: '$_id', count: 1, _id: 0 } },
    ])

    await cacheStats(key, result, 60) // TTL 60s
    console.log('🛢️ [CACHE MISS]')

    res.json(result)
  } catch (err) {
    console.error('❌ Stats Error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
