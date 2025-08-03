import { Request, Response, NextFunction } from 'express';
import { Booking } from '../models/booking.model';

export const bookProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['orderId', 'programCode', 'userCode', 'startDate', 'endDate', 'code'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userCode } = req.params;
    const bookings = await Booking.findAll({ 
      where: { userCode },
      include: ['user', 'program']
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const booking = await Booking.findOne({ where: { code } });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (err) {
    next(err);
  }
};
