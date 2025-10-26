'use strict';

const jwt = require('jsonwebtoken');

const unauthorizedError = () => {
  const error = new Error('Unauthorized');
  error.status = 401;
  return error;
};

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorizedError());
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return next(unauthorizedError());
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error('JWT secret is not configured');
    error.status = 500;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, secret);

    if (!payload || typeof payload !== 'object' || payload.id === undefined || !payload.email) {
      return next(unauthorizedError());
    }

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      return next(unauthorizedError());
    }

    return next(error);
  }
};
