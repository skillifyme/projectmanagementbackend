import * as express from 'express';
import { getAllPrograms, getAllBookings, deleteProgram } from '../controllers/admin.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
const router = express.Router();

// Admin-only routes - require authentication and admin role
router.get('/programs', authenticateToken, authorizeRoles('admin'), getAllPrograms);
router.get('/bookings', authenticateToken, authorizeRoles('admin'), getAllBookings);
router.delete('/programs/:code', authenticateToken, authorizeRoles('admin'), deleteProgram);

export default router;
