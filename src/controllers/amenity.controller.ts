import { Request, Response, NextFunction } from 'express';
import { Amenity } from '../models/amenity.model';

// Example middleware for logging requests
export const amenityLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`[Amenity] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
};

export const createAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['name', 'category', 'status', 'code', 'slug'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    console.log('Creating amenity:', req.body);
    const amenity = await Amenity.create(req.body);
    res.status(201).json(amenity);
  } catch (err) {
    console.error('Error creating amenity:', err);
    next(err);
  }
};

export const getAllAmenities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching all amenities');
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;
    const { count, rows } = await Amenity.findAndCountAll({
      limit: pageSize,
      offset
    });
    res.status(200).json({
      page,
      pageSize,
      total: count,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching amenities:', err);
    next(err);
  }
};

export const getAmenityByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    console.log('Fetching amenity by code:', code);
    const amenity = await Amenity.findOne({ where: { code } });
    
    if (!amenity) {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    
    res.json(amenity);
  } catch (err) {
    console.error('Error fetching amenity:', err);
    next(err);
  }
};
