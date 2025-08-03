import * as express from 'express';
import { createOrder, getAllOrders, getOrderById, getUserOrders } from '../controllers/order.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Protected routes - require authentication
router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, authorizeRoles('admin'), getAllOrders); // Admin only
router.get('/user/:userCode', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);

export default router;