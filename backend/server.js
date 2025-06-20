const app = require('./app')
const connectMongo = require('./src/config/mongo.config')
const redisClient = require('./src/config/redis.config')

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await connectMongo()
    await redisClient.connect()
    console.log('✅ Connected to Redis Cloud')

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Server failed to start:', err.message)
    process.exit(1)
  }
}

start()
