import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';

export function createApp(): Express {
  const app = express();

  // CORS configuration - Allow multiple origins
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
  app.use(requestLogger);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api', taskRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
