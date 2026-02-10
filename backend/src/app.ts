import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';

export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
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
