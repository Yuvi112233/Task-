import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '../middleware/auth.middleware.js';
import { env } from '../config/env.js';

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    path: '/socket.io',
    cors: {
      origin: (origin, callback) => {
        // Allow requests with no origin
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost')) return callback(null, true);
        
        // Allow Vercel domains for frontend
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        
        // Allow specific CLIENT_URL if set
        if (env.CLIENT_URL && origin === env.CLIENT_URL) return callback(null, true);
        
        // Reject all other origins
        callback(new Error('Not allowed by CORS'));
      },
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
