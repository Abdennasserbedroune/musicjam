'use strict';

const { Router } = require('express');

const prisma = require('../lib/db');
const auth = require('../middleware/auth');
const { badRequest, notFound } = require('../lib/http-errors');

const router = Router({ mergeParams: true });

router.use(auth);

const parseId = (value) => {
  const id = Number.parseInt(value, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const getOwnedProject = async (projectId, userId) => {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
};

router.post('/', async (req, res, next) => {
  const projectId = parseId(req.params.projectId);

  if (!projectId) {
    return next(badRequest('Invalid project id'));
  }

  const { name, filename } = req.body || {};

  if (typeof name !== 'string' || !name.trim()) {
    return next(badRequest('Name is required'));
  }

  if (filename !== undefined && (typeof filename !== 'string' || !filename.trim())) {
    return next(badRequest('Filename must be a non-empty string when provided'));
  }

  try {
    const project = await getOwnedProject(projectId, req.user.id);

    if (!project) {
      return next(notFound('Project not found'));
    }

    const track = await prisma.track.create({
      data: {
        name: name.trim(),
        filename: filename ? filename.trim() : null,
        projectId: project.id,
      },
    });

    res.status(201).json({ track });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  const projectId = parseId(req.params.projectId);

  if (!projectId) {
    return next(badRequest('Invalid project id'));
  }

  try {
    const project = await getOwnedProject(projectId, req.user.id);

    if (!project) {
      return next(notFound('Project not found'));
    }

    const tracks = await prisma.track.findMany({
      where: {
        projectId: project.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ tracks });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
