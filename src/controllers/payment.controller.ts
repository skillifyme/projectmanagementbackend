import { Request, Response, NextFunction } from 'express';
import { Payment } from '../models/payment.model';
import { Order } from '../models/order.model';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['transactionId', 'amount', 'status', 'orderId'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

export const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    
    const { count, rows } = await Payment.findAndCountAll({
      limit: pageSize,
      offset,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'userCode', 'status', 'totalAmount']
        }
      ]
    });
    
    res.json({
      page,
      pageSize,
      total: count,
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'userCode', 'status', 'totalAmount']
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

export const getOrderPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const payments = await Payment.findAll({
      where: { orderId },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'userCode', 'status', 'totalAmount']
        }
      ]
    });
    
    res.json(payments);
  } catch (err) {
    next(err);
  }
};