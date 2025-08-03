import { Request, Response } from 'express';
import { Program } from '../models/program.model';
import { Booking } from '../models/booking.model';

export const getAllPrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const deleted = await Program.destroy({ where: { code } });
    if (!deleted) return res.status(404).json({ error: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete program' });
  }
};
