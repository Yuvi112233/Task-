import { Router } from 'express';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/projects/:projectId/tasks', authenticateToken, listTasks);
router.post('/projects/:projectId/tasks', authenticateToken, createTask);
router.put('/tasks/:id', authenticateToken, updateTask);
router.delete('/tasks/:id', authenticateToken, deleteTask);

export default router;
