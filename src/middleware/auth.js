import createError from 'http-errors';
import { verifyToken } from '../auth/jwt.js';

export const authMiddleware = (required = true) => (req, _res, next) => {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    if (!required) return next();
    return next(createError(401, 'Missing token'));
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (_err) {
    return next(createError(401, 'Invalid token'));
  }
};
