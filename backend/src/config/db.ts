import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[BACKEND] MongoDB connected successfully');
  } catch (error) {
    console.error('[BACKEND] MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;
