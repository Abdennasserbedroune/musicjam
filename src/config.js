import dotenv from 'dotenv';

dotenv.config();

const numberFromEnv = (key, def) => {
  const v = process.env[key];
  if (v === undefined) return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

const booleanFromEnv = (key, def) => {
  const v = process.env[key];
  if (v === undefined) return def;
  return /^true|1|yes$/i.test(v);
};

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberFromEnv('PORT', 3000),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  corsOrigins: (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  rateLimitWindowMs: numberFromEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitMax: numberFromEnv('RATE_LIMIT_MAX', 200),
  redisUrl: process.env.REDIS_URL || '',
  roomInactivityTtlSeconds: numberFromEnv('ROOM_INACTIVITY_TTL_SECONDS', 60 * 60),
  cleanupIntervalSeconds: numberFromEnv('CLEANUP_INTERVAL_SECONDS', 60),
  publicBaseUrl: process.env.PUBLIC_BASE_URL || '',
};
