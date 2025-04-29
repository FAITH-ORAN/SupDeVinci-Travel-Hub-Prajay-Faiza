const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redis.config');

exports.login = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const sessionToken = uuidv4();
    const sessionKey = `session:${sessionToken}`;
    const ttl = 900;

    console.log('🔵 Redis SET:', sessionKey, '→', userId, `(expires in ${ttl}s)`);

    await redisClient.set(sessionKey, userId, { EX: ttl });

    return res.status(201).json({
      token: sessionToken,
      expires_in: ttl,
    });
  } catch (error) {
    console.error('🔴 Error in /login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};