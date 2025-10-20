import { Server } from 'socket.io';
import { config } from './config.js';
import { verifyToken } from './auth/jwt.js';
import { touchRoom } from './repositories/roomRepository.js';
import { logger } from './logger.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigins.includes('*') ? '*' : config.corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('auth required'));
    try {
      const payload = verifyToken(token);
      socket.data.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on('connection', async (socket) => {
    const { roomId, role, participantId } = socket.data.user || {};
    if (roomId) await touchRoom(roomId);
    logger.info({ roomId, role, participantId, id: socket.id }, 'socket connected');

    socket.on('disconnect', async (reason) => {
      if (roomId) await touchRoom(roomId);
      logger.info({ roomId, role, participantId, id: socket.id, reason }, 'socket disconnected');
    });
  });

  return io;
};
