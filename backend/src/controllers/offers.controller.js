const { getCachedOffers, cacheOffers } = require('../services/redis.service')
const { findOffers } = require('../services/mongo.service')
const { findOfferById } = require('../services/mongo.service')

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

exports.getOfferById = async (req, res) => {
    const { id } = req.params;
    const key = `offers:${id}`;
  
    try {
      const cached = await getCachedOffers(key);
      if (cached) {
        console.log('📦 [CACHE HIT]');
        return res.json(cached);
      }
  
      const offer = await findOfferById(id);
      if (!offer) return res.status(404).json({ error: 'Offer not found' });
  
      // TODO: Ajouter relatedOffers (Neo4j) plus tard
  
      await cacheOffers(key, offer, 300); // TTL = 300s
      res.json(offer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
