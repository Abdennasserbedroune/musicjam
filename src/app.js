'use strict';

const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const meRouter = require('./routes/me');
const projectTracksRouter = require('./routes/project-tracks');
const projectsRouter = require('./routes/projects');
const tracksRouter = require('./routes/tracks');
const uploadsRouter = require('./routes/uploads');
const errorHandler = require('./middleware/error');
const { ensureUploadDir, uploadDir } = require('./lib/uploads');
const swaggerDocument = require('./docs/swagger');

const app = express();

ensureUploadDir();

const allowedOrigins = [
  /^https?:\/\/localhost(?::\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^https?:\/\/\[::1\](?::\d+)?$/,
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.some((pattern) => pattern.test(origin))) {
      return callback(null, true);
    }

    return callback(null, false);
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(pinoHttp());
app.use('/files', express.static(uploadDir));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs.json', (req, res) => {
  res.status(200).json(swaggerDocument);
});

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
