import * as express from 'express';
import { createProgram, getPrograms, approveProgram, getProgramByCode } from '../controllers/program.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
const router = express.Router();

// Public routes
router.get('/', getPrograms);
router.get('/:code', getProgramByCode);

// Protected routes
router.post('/', authenticateToken, authorizeRoles('facility', 'admin'), createProgram);
router.post('/:code/approve', authenticateToken, authorizeRoles('admin'), approveProgram);

export default router;
