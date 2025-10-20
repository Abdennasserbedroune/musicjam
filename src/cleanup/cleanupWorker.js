import { config } from '../config.js';
import { withRedis } from '../redis.js';
import { logger } from '../logger.js';
import { removeRoom } from '../repositories/roomRepository.js';

export const startCleanupWorker = () => {
  const intervalMs = config.cleanupIntervalSeconds * 1000;
  const ttlMs = config.roomInactivityTtlSeconds * 1000;

  const timer = setInterval(async () => {
    try {
      const now = Date.now();
      await withRedis(
        async (redis) => {
          let cursor = '0';
          do {
            const [next, keys] = await redis.scan(cursor, { MATCH: 'room:id:*', COUNT: 100 });
            cursor = next;
            if (keys.length > 0) {
              const pipeline = redis.multi();
              keys.forEach((k) => pipeline.get(k));
              const results = await pipeline.exec();
              for (const [, data] of results) {
                if (!data) continue;
                try {
                  const room = JSON.parse(data);
                  if (now - room.lastActiveAt > ttlMs) {
                    await removeRoom(room.roomId);
                    logger.info({ roomId: room.roomId }, 'expired room cleaned');
                  }
                } catch (e) {
                  logger.warn({ err: e }, 'failed to parse room JSON');
                }
              }
            }
          } while (cursor !== '0');
        },
        async () => {
          // in-memory cleanup is handled at creation via timeouts; nothing to do here
        }
      );
    } catch (err) {
      logger.error({ err }, 'cleanup worker error');
    }
  }, intervalMs);

  timer.unref?.();
  logger.info({ intervalMs }, 'Cleanup worker started');
  return timer;
};
