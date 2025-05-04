const Redis = require('ioredis');

let redis;

try {
  redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
      });
  console.log('Connected to Redis successfully.');
} catch (error) {
  console.error('Could not connect to Redis:', error);
  redis = null;
}

module.exports = redis;