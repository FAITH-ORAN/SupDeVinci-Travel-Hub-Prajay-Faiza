const { createClient } = require('redis')
require('dotenv').config()

const redisClient = createClient({
  url: 'redis://default:XKUeCvGRzRogGW11TCDExzI27VKAfCm1@redis-13114.c239.us-east-1-2.ec2.redns.redis-cloud.com:13114',
})

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err))

module.exports = redisClient
