import { logger } from '../logger.js';

export const notFoundHandler = (_req, _res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const response = {
    message: err.expose ? err.message : status >= 500 ? 'Internal Server Error' : err.message,
  };
  logger[status >= 500 ? 'error' : 'warn']({ name: err.name, message: err.message, status }, 'Request failed');
  res.status(status).json(response);
};
