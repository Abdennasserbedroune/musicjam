'use strict';

const { Router } = require('express');

const prisma = require('../lib/db');
const auth = require('../middleware/auth');
const { badRequest, notFound } = require('../lib/http-errors');

const router = Router();

router.use(auth);

const parseId = (value) => {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

router.get('/:id', async (req, res, next) => {
  const trackId = parseId(req.params.id);

  if (!trackId) {
    return next(badRequest('Invalid track id'));
  }

  try {
    const track = await prisma.track.findFirst({
      where: {
        id: trackId,
        project: {
          ownerId: req.user.id,
        },
      },
    });

    if (!track) {
      return next(notFound('Track not found'));
    }

    res.status(200).json({ track });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const trackId = parseId(req.params.id);

  if (!trackId) {
    return next(badRequest('Invalid track id'));
  }

  try {
    const track = await prisma.track.findFirst({
      where: {
        id: trackId,
        project: {
          ownerId: req.user.id,
        },
      },
    });

    if (!track) {
      return next(notFound('Track not found'));
    }

    await prisma.track.delete({
      where: {
        id: track.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
