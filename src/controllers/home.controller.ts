import { Request, Response } from 'express';
import { Program } from '../models/program.model';

export const getHomepageSections = async (req: Request, res: Response) => {
  try {
    const recommended = await Program.findAll({ where: { status: 'approved' }, limit: 5 });
    const newest = await Program.findAll({ order: [['createdAt', 'DESC']], limit: 5 });
    res.json({ recommended, newest });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load homepage programs' });
  }
};
