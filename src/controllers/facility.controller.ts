import { Request, Response, NextFunction } from 'express';
import { Facility } from '../models/facility.model';

export const createFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['name', 'description', 'ctype', 'subtype', 'address', 'city', 'country', 'latitude', 'longitude', 'status', 'pincode', 'contactNumber', 'code', 'slug', 'userCode'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) {
    next(err);
  }
};

export const getAllFacilities = async (_req: Request, res: Response) => {
  try {
      const page = parseInt(_req.query.page as string) || 1;
      const pageSize = parseInt(_req.query.pageSize as string) || 10;
      const offset = (page - 1) * pageSize;
      const { count, rows } = await Facility.findAndCountAll({
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
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
};

export const getFacilityByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const facility = await Facility.findOne({ where: { code } });
    if (!facility) return res.status(404).json({ error: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facility' });
  }
};

export const updateFacility = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    await Facility.update(req.body, { where: { code } });
    const updated = await Facility.findOne({ where: { code } });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update facility' });
  }
};
