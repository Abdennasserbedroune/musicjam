'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const projectRoot = path.join(__dirname, '..');
const testDbPath = path.join(projectRoot, 'test.db');
process.env.DATABASE_URL = `file:${testDbPath}`;

const app = require('../src/app');
const prisma = require('../src/lib/db');

const uniqueEmail = (prefix) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;
const defaultPassword = 'Passw0rd!';

const removeIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
};

beforeAll(() => {
  removeIfExists(testDbPath);
  removeIfExists(`${testDbPath}-journal`);
  removeIfExists(`${testDbPath}-wal`);
  removeIfExists(`${testDbPath}-shm`);

  execSync('npx prisma migrate deploy', {
    cwd: projectRoot,
    env: { ...process.env },
    stdio: 'ignore',
  });
});

beforeEach(async () => {
  await prisma.track.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();

  removeIfExists(testDbPath);
  removeIfExists(`${testDbPath}-journal`);
  removeIfExists(`${testDbPath}-wal`);
  removeIfExists(`${testDbPath}-shm`);
});

describe('API smoke tests', () => {
  test('GET /health returns OK status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /auth/signup creates a user and returns a token', async () => {
    const email = uniqueEmail('signup');

    const response = await request(app)
      .post('/auth/signup')
      .send({ email, password: defaultPassword });

    expect(response.status).toBe(201);

    const { token } = response.body || {};
    expect(token).toEqual(expect.stringMatching(/.+/));

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
  });

  test('POST /auth/signup rejects invalid email formats', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'not-an-email', password: defaultPassword })
      .expect(400);
  });

  test('POST /auth/signup rejects passwords containing only whitespace', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: uniqueEmail('signup-whitespace-password'), password: '   ' })
      .expect(400);
  });

  test('POST /auth/login authenticates an existing user', async () => {
    const email = uniqueEmail('login');

    await request(app)
      .post('/auth/signup')
      .send({ email, password: defaultPassword })
      .expect(201);

    const response = await request(app)
      .post('/auth/login')
      .send({ email, password: defaultPassword });

    expect(response.status).toBe(200);

    const { token } = response.body || {};
    expect(token).toEqual(expect.stringMatching(/.+/));
  });

  test('POST /auth/login rejects invalid email formats', async () => {
    await request(app)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: defaultPassword })
      .expect(400);
  });

  test('POST /auth/login rejects passwords containing only whitespace', async () => {
    const email = uniqueEmail('login-whitespace-password');

    await request(app)
      .post('/auth/signup')
      .send({ email, password: defaultPassword })
      .expect(201);

    await request(app)
      .post('/auth/login')
      .send({ email, password: '   ' })
      .expect(400);
  });

  test('POST /projects creates a project for the authenticated user', async () => {
    const email = uniqueEmail('project');

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({ email, password: defaultPassword })
      .expect(201);

    const { token } = signupResponse.body || {};
    expect(token).toEqual(expect.stringMatching(/.+/));

    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Demo Project' });

    expect(response.status).toBe(201);

    const { project } = response.body || {};
    expect(project).toEqual(expect.objectContaining({ name: 'Demo Project' }));
    expect(typeof project?.id).toBe('number');
  });

  test('GET /projects lists projects for the authenticated user', async () => {
    const email = uniqueEmail('projects');

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({ email, password: defaultPassword })
      .expect(201);

    const { token } = signupResponse.body || {};
    expect(token).toEqual(expect.stringMatching(/.+/));

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project A' })
      .expect(201);

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project B' })
      .expect(201);

    const response = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const { projects } = response.body || {};
    expect(Array.isArray(projects)).toBe(true);
    expect(projects?.length).toBe(2);

    const names = (projects || []).map((project) => project.name).sort();
    expect(names).toEqual(['Project A', 'Project B']);
  });
});
