'use strict';

const errorDefinitions = {
  badRequest: {
    status: 400,
    defaultMessage: 'Bad Request',
  },
  unauthorized: {
    status: 401,
    defaultMessage: 'Unauthorized',
  },
  notFound: {
    status: 404,
    defaultMessage: 'Not Found',
  },
};

const createHttpError = (type, message) => {
  const definition = errorDefinitions[type];

  if (!definition) {
    const error = new Error(message || 'Internal Server Error');
    error.status = 500;
    return error;
  }

  const error = new Error(message || definition.defaultMessage);
  error.status = definition.status;
  return error;
};

module.exports = {
  createHttpError,
  badRequest: (message) => createHttpError('badRequest', message),
  unauthorized: (message) => createHttpError('unauthorized', message),
  notFound: (message) => createHttpError('notFound', message),
};
