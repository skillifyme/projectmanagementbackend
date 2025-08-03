import { Request, Response } from 'express';
import { ProgramStyleAmenity } from '../models/programStyleAmenity.model';

export const addProgramStyleAmenity = async (req: Request, res: Response) => {
  try {
    const psa = await ProgramStyleAmenity.create(req.body);
    res.status(201).json(psa);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add program style amenity' });
  }
};

export const getProgramStyleAmenities = async (req: Request, res: Response) => {
  try {
    const { programStyleCode } = req.params;
    const results = await ProgramStyleAmenity.findAll({ 
      where: { programStyleCode },
      include: ['programStyle', 'amenity']
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch program style amenities' });
  }
};