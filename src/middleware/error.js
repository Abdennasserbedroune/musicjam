'use strict';

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (req.log && typeof req.log.error === 'function') {
    req.log.error({ err }, 'Unhandled error');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
};
