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

router.post('/', async (req, res, next) => {
  const { name } = req.body || {};

  if (typeof name !== 'string' || !name.trim()) {
    return next(badRequest('Name is required'));
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        ownerId: req.user.id,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const projectId = parseId(req.params.id);

  if (!projectId) {
    return next(badRequest('Invalid project id'));
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return next(notFound('Project not found'));
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const projectId = parseId(req.params.id);

  if (!projectId) {
    return next(badRequest('Invalid project id'));
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: req.user.id,
      },
    });

    if (!project) {
      return next(notFound('Project not found'));
    }

    await prisma.$transaction([
      prisma.track.deleteMany({
        where: {
          projectId,
        },
      }),
      prisma.project.delete({
        where: {
          id: projectId,
        },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
