import { createServer } from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initializeSocket } from './sockets/project.socket.js';
import { seedDatabase } from './services/seed.service.js';

async function startServer() {
  // Connect to database
  await connectDB();

  // Create Express app
  const app = createApp();

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize Socket.IO
  initializeSocket(httpServer);

  // Seed database
  await seedDatabase();

  // Start server
  httpServer.listen(env.PORT, '0.0.0.0', () => {
    console.log(`[BACKEND] Express server running on http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[BACKEND] Failed to start server:', error);
  process.exit(1);
});
