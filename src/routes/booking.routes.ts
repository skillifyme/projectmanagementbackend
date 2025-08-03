import * as express from 'express';
import { bookProgram, getUserBookings, getBookingByCode } from '../controllers/booking.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = express.Router();

// Protected routes - require authentication
router.post('/', authenticateToken, bookProgram);
router.get('/user/:userCode', authenticateToken, getUserBookings);
router.get('/:code', authenticateToken, getBookingByCode);

export default router;
