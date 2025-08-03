/// <reference path="../types/express/index.d.ts" />
import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: user not found in request' });
    }
    const userCode = req.user.code;
    const bookings = await Booking.findAll({ 
      where: { userCode },
      include: ['program', 'user']
    });
    const reviews = await Review.findAll({ 
      where: { userCode },
      include: ['program', 'user']
    });
    res.json({ bookings, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};
