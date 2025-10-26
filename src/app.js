'use strict';

const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.use('/health', healthRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
