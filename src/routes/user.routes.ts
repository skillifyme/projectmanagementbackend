import { Router } from 'express';
import { updateUser, getUserByCode } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route (can be accessed without auth)
router.get('/:userCode', getUserByCode);

// Protected routes - users can only update their own profile
router.put('/:userCode', authenticateToken, updateUser);

export default router;
