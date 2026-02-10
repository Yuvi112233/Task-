import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/project-management',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
