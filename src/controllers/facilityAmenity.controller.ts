import { Request, Response } from 'express';
import { FacilityAmenity } from '../models/facilityAmenity.model';

export const addFacilityAmenity = async (req: Request, res: Response) => {
  try {
    const fa = await FacilityAmenity.create(req.body);
    res.status(201).json(fa);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add facility amenity' });
  }
};

export const getFacilityAmenities = async (req: Request, res: Response) => {
  try {
    const { facilityCode } = req.params;
    const results = await FacilityAmenity.findAll({ 
      where: { facilityCode },
      include: ['facility', 'amenity', 'program']
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facility amenities' });
  }
};
