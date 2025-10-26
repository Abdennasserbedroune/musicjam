'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Project API',
    version: '1.0.0',
    description:
      'API documentation for the Project backend. Use these endpoints to manage users, projects, tracks, and uploads.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health monitoring endpoints.' },
    { name: 'Auth', description: 'User authentication and identity.' },
    { name: 'Projects', description: 'Project CRUD operations.' },
    { name: 'Tracks', description: 'Track management within projects.' },
    { name: 'Uploads', description: 'File uploads for audio assets.' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Include a JWT using the `Authorization: Bearer <token>` header.',
      },
    },
    schemas: {
      HealthStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
      },
      AuthCredentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          password: {
            type: 'string',
            example: 'Password123!',
          },
        },
      },
      AuthToken: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          email: {
            type: 'string',
            example: 'user@example.com',
          },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'My first project',
          },
          ownerId: {
            type: 'integer',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T12:00:00.000Z',
          },
        },
      },
      ProjectResponse: {
        type: 'object',
        properties: {
          project: {
            $ref: '#/components/schemas/Project',
          },
        },
      },
      ProjectList: {
        type: 'object',
        properties: {
          projects: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Project',
            },
          },
        },
      },
      ProjectInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'My next release',
          },
        },
      },
      Track: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 5,
          },
          name: {
            type: 'string',
            example: 'Lead vocals',
          },
          filename: {
            type: 'string',
            nullable: true,
            example: 'lead-vocals.wav',
          },
          projectId: {
            type: 'integer',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T12:10:00.000Z',
          },
        },
      },
      TrackResponse: {
        type: 'object',
        properties: {
          track: {
            $ref: '#/components/schemas/Track',
          },
        },
      },
      TrackList: {
        type: 'object',
        properties: {
          tracks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Track',
            },
          },
        },
      },
      TrackInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'Bass guitar',
          },
          filename: {
            type: 'string',
            nullable: true,
            example: 'bass-guitar.wav',
          },
        },
      },
      UploadResponse: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            example: 'mixdown-1700000000000-123456789.wav',
          },
          size: {
            type: 'integer',
            example: 1048576,
          },
          mime: {
            type: 'string',
            example: 'audio/wav',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns the current health status of the API.',
        responses: {
          200: {
            description: 'API is healthy.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthStatus',
                },
              },
            },
          },
        },
      },
    },
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthCredentials',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Account created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthToken',
                },
              },
            },
          },
          400: {
            description: 'Invalid email or password.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description: 'Email already in use.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthCredentials',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authentication succeeded.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthToken',
                },
              },
            },
          },
          400: {
            description: 'Invalid payload.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Auth'],
        summary: 'Retrieve the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Returns the currently authenticated user.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List projects for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Projects retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProjectList',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Create a project',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Project created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProjectResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid payload.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Retrieve a project by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The project identifier.',
          },
        ],
        responses: {
          200: {
            description: 'Project found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProjectResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid project id.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete a project',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The project identifier.',
          },
        ],
        responses: {
          204: {
            description: 'Project deleted successfully.',
          },
          400: {
            description: 'Invalid project id.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/projects/{projectId}/tracks': {
      get: {
        tags: ['Tracks'],
        summary: 'List tracks within a project',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The project identifier.',
          },
        ],
        responses: {
          200: {
            description: 'Tracks retrieved successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TrackList',
                },
              },
            },
          },
          400: {
            description: 'Invalid project id.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tracks'],
        summary: 'Create a track inside a project',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The project identifier.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TrackInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Track created successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TrackResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid input.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/tracks/{id}': {
      get: {
        tags: ['Tracks'],
        summary: 'Retrieve a track by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The track identifier.',
          },
        ],
        responses: {
          200: {
            description: 'Track found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TrackResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid track id.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Track not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Tracks'],
        summary: 'Delete a track',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'The track identifier.',
          },
        ],
        responses: {
          204: {
            description: 'Track deleted successfully.',
          },
          400: {
            description: 'Invalid track id.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Track not found.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/uploads': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload a file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload as `file` form field.',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'File uploaded successfully.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UploadResponse',
                },
              },
            },
          },
          400: {
            description: 'File missing in the request.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Missing or invalid token.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

module.exports = swaggerJsdoc(options);
