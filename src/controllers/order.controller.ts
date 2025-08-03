import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['status', 'totalAmount'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    
    const { count, rows } = await Order.findAndCountAll({
      limit: pageSize,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role']
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

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role']
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userCode } = req.params;
    const orders = await Order.findAll({
      where: { userCode },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'code']
        }
      ]
    });
    
    res.json(orders);
  } catch (err) {
    next(err);
  }
};