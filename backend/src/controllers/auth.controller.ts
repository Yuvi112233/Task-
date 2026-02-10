import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { AuthRequest, generateToken } from '../middleware/auth.middleware.js';

export async function register(req: AuthRequest, res: Response) {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || 'member'
    });
    
    const token = generateToken(user);
    
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      role: user.role
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
