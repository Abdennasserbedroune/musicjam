import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { withRedis } from '../redis.js';
import { config } from '../config.js';

const inMemory = {
  rooms: new Map(),
  codeToRoom: new Map(),
  publicRooms: new Set(),
};

const roomSchema = Joi.object({
  roomId: Joi.string().required(),
  code: Joi.string().required(),
  isPublic: Joi.boolean().default(false),
  createdAt: Joi.number().required(),
  lastActiveAt: Joi.number().required(),
});

const generateCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
};

const roomKey = (roomId) => `room:id:${roomId}`;
const codeKey = (code) => `room:code:${code}`;
const publicSetKey = 'rooms:public';

const ttlSeconds = () => config.roomInactivityTtlSeconds;

export const createRoom = async ({ isPublic = false } = {}) => {
  const roomId = uuidv4();
  let code = generateCode();
  // ensure uniqueness in in-memory fallback
  while (inMemory.codeToRoom.has(code)) code = generateCode();
  const now = Date.now();
  const room = { roomId, code, isPublic, createdAt: now, lastActiveAt: now };
  await withRedis(
    async (redis) => {
      const ttl = ttlSeconds();
      // Use a transaction to avoid races
      const exists = await redis.exists(codeKey(code));
      if (exists) {
        // rare collision, regenerate once
        code = generateCode();
      }
      const multi = redis.multi();
      multi.set(codeKey(code), roomId, { EX: ttl });
      multi.set(roomKey(roomId), JSON.stringify(room), { EX: ttl });
      if (isPublic) multi.sAdd(publicSetKey, roomId);
      await multi.exec();
    },
    async () => {
      inMemory.rooms.set(roomId, room);
      inMemory.codeToRoom.set(code, roomId);
      if (isPublic) inMemory.publicRooms.add(roomId);
      // No TTL in in-memory fallback to avoid dangling timers in tests.
    }
  );
  return { ...room, code };
};

export const touchRoom = async (roomId) => {
  const now = Date.now();
  await withRedis(
    async (redis) => {
      const key = roomKey(roomId);
      const data = await redis.get(key);
      if (!data) return false;
      const room = JSON.parse(data);
      room.lastActiveAt = now;
      const ttl = ttlSeconds();
      const multi = redis.multi();
      multi.set(key, JSON.stringify(room), { EX: ttl });
      multi.expire(codeKey(room.code), ttl);
      await multi.exec();
      return true;
    },
    async () => {
      const r = inMemory.rooms.get(roomId);
      if (!r) return false;
      r.lastActiveAt = now;
      return true;
    }
  );
  return true;
};

export const getRoomByCode = async (code) => {
  return withRedis(
    async (redis) => {
      const roomId = await redis.get(codeKey(code));
      if (!roomId) return null;
      const data = await redis.get(roomKey(roomId));
      if (!data) return null;
      return roomSchema.validate(JSON.parse(data), { stripUnknown: true }).value;
    },
    async () => {
      const roomId = inMemory.codeToRoom.get(code);
      if (!roomId) return null;
      const room = inMemory.rooms.get(roomId);
      return room || null;
    }
  );
};

export const getRoomById = async (roomId) => {
  return withRedis(
    async (redis) => {
      const data = await redis.get(roomKey(roomId));
      if (!data) return null;
      return roomSchema.validate(JSON.parse(data), { stripUnknown: true }).value;
    },
    async () => {
      return inMemory.rooms.get(roomId) || null;
    }
  );
};

export const listPublicRooms = async () => {
  return withRedis(
    async (redis) => {
      const ids = await redis.sMembers(publicSetKey);
      if (!ids || ids.length === 0) return [];
      const pipelines = redis.multi();
      for (const id of ids) pipelines.get(roomKey(id));
      const results = await pipelines.exec();
      const rooms = (results || [])
        .map(([, data]) => (data ? JSON.parse(data) : null))
        .filter(Boolean);
      return rooms
        .filter((r) => r.isPublic)
        .map((r) => ({ roomId: r.roomId, code: r.code, isPublic: r.isPublic, lastActiveAt: r.lastActiveAt, createdAt: r.createdAt }));
    },
    async () => {
      return Array.from(inMemory.publicRooms)
        .map((id) => inMemory.rooms.get(id))
        .filter(Boolean)
        .map((r) => ({ roomId: r.roomId, code: r.code, isPublic: r.isPublic, lastActiveAt: r.lastActiveAt, createdAt: r.createdAt }));
    }
  );
};

export const removeRoom = async (roomId) => {
  return withRedis(
    async (redis) => {
      const data = await redis.get(roomKey(roomId));
      if (!data) return false;
      const room = JSON.parse(data);
      const multi = redis.multi();
      multi.del(roomKey(roomId));
      multi.del(codeKey(room.code));
      multi.sRem(publicSetKey, roomId);
      await multi.exec();
      return true;
    },
    async () => {
      const room = inMemory.rooms.get(roomId);
      if (!room) return false;
      inMemory.rooms.delete(roomId);
      inMemory.codeToRoom.delete(room.code);
      inMemory.publicRooms.delete(roomId);
      return true;
    }
  );
};
