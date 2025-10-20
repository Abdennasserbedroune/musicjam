import request from 'supertest';
import { buildApp } from '../src/server.js';

const app = buildApp();

describe('Health endpoint', () => {
  it('GET /health returns 200', async () => {
    await request(app).get('/health').expect(200);
  });
});

describe('Rooms API', () => {
  it('creates a room and returns code, roomId, adminToken, joinUrl', async () => {
    const res = await request(app).post('/api/rooms').send({ isPublic: true }).expect(201);
    expect(res.body.code).toBeDefined();
    expect(res.body.roomId).toBeDefined();
    expect(res.body.adminToken).toBeDefined();
    expect(res.body.joinUrl).toMatch(/\/join\//);
  });

  it('join a room by code returns participant token', async () => {
    const create = await request(app).post('/api/rooms').send({ isPublic: false }).expect(201);
    const code = create.body.code;
    const join = await request(app).post(`/api/rooms/${code}/join`).send({}).expect(200);
    expect(join.body.token).toBeDefined();
    expect(join.body.roomId).toBe(create.body.roomId);
  });

  it('GET /api/rooms?public=true lists public rooms', async () => {
    const c1 = await request(app).post('/api/rooms').send({ isPublic: true }).expect(201);
    const c2 = await request(app).post('/api/rooms').send({ isPublic: false }).expect(201);
    const list = await request(app).get('/api/rooms?public=true').expect(200);
    const ids = list.body.map((r) => r.roomId);
    expect(ids).toContain(c1.body.roomId);
    expect(ids).not.toContain(c2.body.roomId);
  });

  it('invalid code is rejected', async () => {
    await request(app).post('/api/rooms/INVALID/join').send({}).expect(404);
  });
});
