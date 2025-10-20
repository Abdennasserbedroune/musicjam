import { startServer } from './server.js';
import { getRedis } from './redis.js';
import { startCleanupWorker } from './cleanup/cleanupWorker.js';

(async () => {
  await getRedis().catch(() => {});
  startCleanupWorker();
  startServer();
})();
