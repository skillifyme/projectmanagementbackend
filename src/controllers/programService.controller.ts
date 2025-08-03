import { Request, Response } from 'express';
import { ProgramServiceMap } from '../models/programServiceMap.model';

export const mapServiceToProgram = async (req: Request, res: Response) => {
  try {
    const map = await ProgramServiceMap.create(req.body);
    res.status(201).json(map);
  } catch (err) {
    res.status(400).json({ error: 'Mapping failed' });
  }
};

export const getServicesForProgram = async (req: Request, res: Response) => {
  try {
    const { programCode } = req.params;
    const services = await ProgramServiceMap.findAll({ 
      where: { programCode },
      include: ['program', 'facilityAmenity']
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};
