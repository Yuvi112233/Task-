import { Router } from 'express';
import { listProjects, createProject, getProject } from '../controllers/project.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, listProjects);
router.post('/', authenticateToken, createProject);
router.get('/:id', authenticateToken, getProject);

export default router;
