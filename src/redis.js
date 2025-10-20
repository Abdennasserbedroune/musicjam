import { createClient } from 'redis';
import { logger } from './logger.js';
import { config } from './config.js';

let client;

export const getRedis = async () => {
  if (client) return client;
  if (!config.redisUrl) {
    logger.warn('REDIS_URL not set; Redis features will be disabled. Using in-memory adapter as fallback.');
    return null;
  }
  client = createClient({ url: config.redisUrl });
  client.on('error', (err) => logger.error({ err }, 'Redis Client Error'));
  await client.connect();
  logger.info('Connected to Redis');
  return client;
};

export const withRedis = async (fn, fallback) => {
  const redis = await getRedis();
  if (!redis) return fallback();
  return fn(redis);
};
