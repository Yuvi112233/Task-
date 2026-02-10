import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '../middleware/auth.middleware.js';
import { env } from '../config/env.js';

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  const allowedOrigins = [
    env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    const user = verifyToken(token);
    if (!user) {
      return next(new Error('Authentication error'));
    }
    
    (socket as any).user = user;
    next();
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`[SERVER] User connected: ${user.username}`);

    // Join project room
    socket.on('join_project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`[SERVER] User ${user.username} joined project:${projectId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('[SERVER] User disconnected');
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
