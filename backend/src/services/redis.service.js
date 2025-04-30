const redisClient = require('../config/redis.config')
const zlib = require('zlib')

// Lire depuis Redis (et décompresser)
exports.getCachedOffers = async (key) => {
  const value = await redisClient.get(key)
  if (!value) return null

  const buffer = Buffer.from(value, 'base64')
  const decompressed = zlib.gunzipSync(buffer).toString()
  return JSON.parse(decompressed)
}

// Écrire dans Redis (avec compression gzip + TTL)
exports.cacheOffers = async (key, data, ttl = 60) => {
  const json = JSON.stringify(data)
  const compressed = zlib.gzipSync(json).toString('base64')
  await redisClient.setEx(key, ttl, compressed)
}

exports.publishNewOffer = async (messageObj) => {
  const channel = 'offers:new'
  const message = JSON.stringify(messageObj)

  await redisClient.publish(channel, message)
  console.log(`📢 Published to ${channel}: ${message}`)
}

exports.getCachedStats = async (key) => {
  try {
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (err) {
    console.error('Redis read error:', err)
    return null
  }
}

exports.cacheStats = async (key, data, ttl) => {
  try {
    await redisClient.set(key, JSON.stringify(data), { EX: ttl })
  } catch (err) {
    console.error('Redis write error:', err)
  }
}
