import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const signToken = (payload, options = {}) => {
  const opts = { expiresIn: config.jwtExpiresIn, ...options };
  return jwt.sign(payload, config.jwtSecret, opts);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    const e = new Error('Invalid token');
    e.status = 401;
    throw e;
  }
};
