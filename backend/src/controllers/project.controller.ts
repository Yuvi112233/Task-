import { Response } from 'express';
import Project from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export async function listProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await Project.find().populate('ownerId', 'username');
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      ownerId: req.user!.id
    });
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getProject(req: AuthRequest, res: Response) {
  try {
    const project = await Project.findById(req.params.id).populate('ownerId', 'username');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
