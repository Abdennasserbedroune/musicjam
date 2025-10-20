import { Router } from 'express';
import Joi from 'joi';
import createError from 'http-errors';
import { randomUUID } from 'crypto';
import { createRoom, getRoomByCode, listPublicRooms, touchRoom } from '../repositories/roomRepository.js';
import { signToken } from '../auth/jwt.js';
import { config } from '../config.js';

const router = Router();

const createRoomSchema = Joi.object({
  isPublic: Joi.boolean().default(false),
});

router.post('/api/rooms', async (req, res, next) => {
  try {
    const { value, error } = createRoomSchema.validate(req.body || {});
    if (error) return next(createError(400, error.message));
    const room = await createRoom({ isPublic: value.isPublic });
    const adminToken = signToken({ roomId: room.roomId, role: 'admin' });
    const base = config.publicBaseUrl || `${req.protocol}://${req.get('host')}`;
    const joinUrl = `${base}/join/${room.code}`;
    res.status(201).json({ code: room.code, roomId: room.roomId, adminToken, joinUrl });
  } catch (err) {
    next(err);
  }
});

const joinSchema = Joi.object({
  displayName: Joi.string().max(64).optional(),
});

router.post('/api/rooms/:code/join', async (req, res, next) => {
  try {
    const code = req.params.code;
    const { error } = joinSchema.validate(req.body || {});
    if (error) return next(createError(400, error.message));
    const room = await getRoomByCode(code);
    if (!room) return next(createError(404, 'Room not found or expired'));
    await touchRoom(room.roomId);
    const participantId = randomUUID();
    const token = signToken({ roomId: room.roomId, role: 'participant', participantId });
    res.status(200).json({ token, roomId: room.roomId, code: room.code });
  } catch (err) {
    next(err);
  }
});

router.get('/api/rooms/:code', async (req, res, next) => {
  try {
    const code = req.params.code;
    const room = await getRoomByCode(code);
    if (!room) return next(createError(404, 'Room not found or expired'));
    res.status(200).json({ roomId: room.roomId, code: room.code, isPublic: room.isPublic, lastActiveAt: room.lastActiveAt, createdAt: room.createdAt });
  } catch (err) {
    next(err);
  }
});

router.get('/api/rooms', async (req, res, next) => {
  try {
    const isPublic = req.query.public === 'true' || req.query.public === true;
    if (!isPublic) return res.status(200).json([]);
    const rooms = await listPublicRooms();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
});

export default router;
