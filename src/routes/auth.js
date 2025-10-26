'use strict';

const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../lib/db');

const router = Router();

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw createError(500, 'JWT secret is not configured');
  }

  return secret;
};

const normalizeEmail = (value) => value.trim().toLowerCase();

const respondWithToken = (res, status, user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: '15m' }
  );

  res.status(status).json({ token });
};

router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || password.length === 0) {
    return next(createError(400, 'Email and password are required'));
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return next(createError(400, 'Email and password are required'));
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    respondWithToken(res, 201, user);
  } catch (error) {
    if (error.code === 'P2002') {
      return next(createError(409, 'Email already in use'));
    }

    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || password.length === 0) {
    return next(createError(400, 'Email and password are required'));
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return next(createError(400, 'Email and password are required'));
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    respondWithToken(res, 200, user);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
