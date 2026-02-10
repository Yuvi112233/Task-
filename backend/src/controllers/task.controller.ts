import { Response } from 'express';
import Task from '../models/Task.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { getIO } from '../sockets/project.socket.js';

export async function listTasks(req: AuthRequest, res: Response) {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assigneeId', 'username');
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const { title, description, status, priority, assigneeId } = req.body;
    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      projectId: req.params.projectId,
      assigneeId
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('assigneeId', 'username');
    
    // Emit Socket.IO event
    const io = getIO();
    if (io) {
      io.to(`project:${req.params.projectId}`).emit('task_created', populatedTask);
    }
    
    res.status(201).json(populatedTask);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assigneeId', 'username');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit Socket.IO event
    const io = getIO();
    if (io) {
      io.to(`project:${task.projectId}`).emit('task_updated', task);
    }
    
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const projectId = task.projectId;
    await Task.findByIdAndDelete(req.params.id);
    
    // Emit Socket.IO event
    const io = getIO();
    if (io) {
      io.to(`project:${projectId}`).emit('task_deleted', { id: req.params.id });
    }
    
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
