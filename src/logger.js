import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from './config.js';

const redact = {
  paths: [
    'req.headers.authorization',
    'req.headers.cookie',
    'res.headers[set-cookie]',
    'req.body.password',
    'error',
  ],
  censor: '[REDACTED]',
};

export const logger = pino({
  level: process.env.LOG_LEVEL || (config.nodeEnv === 'production' ? 'info' : 'debug'),
  transport: config.nodeEnv !== 'production' && config.nodeEnv !== 'test' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  redact,
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  redact,
});
