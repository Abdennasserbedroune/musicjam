import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { httpLogger, logger } from './logger.js';
import healthRouter from './routes/health.js';
import roomsRouter from './routes/rooms.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';
import { initSocket } from './socket.js';

export const buildApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.use(rateLimit({ windowMs: config.rateLimitWindowMs, max: config.rateLimitMax }));
  app.use(express.json({ limit: '1mb' }));
  app.use(httpLogger);

  app.use(healthRouter);
  app.use(roomsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startServer = () => {
  const app = buildApp();
  const server = http.createServer(app);
  const io = initSocket(server);

  server.listen(config.port, config.host, () => {
    logger.info({ port: config.port, host: config.host }, 'Server started');
  });

  return { app, server, io };
};
