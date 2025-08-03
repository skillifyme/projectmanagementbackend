import * as express from 'express';
import { createPayment, getAllPayments, getPaymentById, getOrderPayments } from '../controllers/payment.controller';

const router = express.Router();

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/order/:orderId', getOrderPayments);
router.get('/:id', getPaymentById);

export default router;