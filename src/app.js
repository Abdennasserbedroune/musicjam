'use strict';

const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const meRouter = require('./routes/me');
const projectTracksRouter = require('./routes/project-tracks');
const projectsRouter = require('./routes/projects');
const tracksRouter = require('./routes/tracks');
const uploadsRouter = require('./routes/uploads');
const errorHandler = require('./middleware/error');
const { ensureUploadDir, uploadDir } = require('./lib/uploads');

const app = express();

ensureUploadDir();

app.use(cors());
app.use(express.json());
app.use(pinoHttp());
app.use('/files', express.static(uploadDir));

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/me', meRouter);
app.use('/projects/:projectId/tracks', projectTracksRouter);
app.use('/projects', projectsRouter);
app.use('/tracks', tracksRouter);
app.use('/uploads', uploadsRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
