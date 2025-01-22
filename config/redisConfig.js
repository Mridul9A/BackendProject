const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;
