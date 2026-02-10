import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
  body: any;
  params: any;
  headers: any;
}

export function generateToken(user: any): string {
  return jwt.sign(
    { id: user._id, username: user.username },
    env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): { id: string; username: string } | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { id: string; username: string };
  } catch (e) {
    return null;
  }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = user;
  next();
}
