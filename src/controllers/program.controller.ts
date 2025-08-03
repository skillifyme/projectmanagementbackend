import { Request, Response, NextFunction } from 'express';
import { Program } from '../models/program.model';
import { Facility } from '../models/facility.model';
import { FacilityAmenity } from '../models/facilityAmenity.model';
import { Amenity } from '../models/amenity.model';

export const createProgram = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['name', 'programStyleCode', 'images', 'programConfig', 'creatorCode', 'primaryFacilityCode'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const { name, slug, ...rest } = req.body;
    // Generate slug if not provided
    const generatedSlug = slug || name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    // Generate code: first 2 chars of model, first 2 chars of name, 2 random chars, last 2 digits of epoch
    const modelPrefix = 'pr'; // for Program
    const namePrefix = name.substring(0, 2).toLowerCase();
    const randomChars = Math.random().toString(36).substring(2, 4);
    const epochSuffix = String(Date.now()).slice(-2);
    const code = `${modelPrefix}${namePrefix}${randomChars}${epochSuffix}`;

    const program = await Program.create({
      name,
      slug: generatedSlug,
      code,
      ...rest
    });
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
};

export const approveProgram = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const program = await Program.findOne({ where: { code } });
    if (!program) return res.status(404).json({ error: 'Program not found' });
    program.status = 'approved';
    await program.save();
    res.json({ message: 'Program approved', program });
  } catch (err) {
    res.status(400).json({ error: 'Approval failed' });
  }
};

export const getProgramByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const program = await Program.findOne({ 
      where: { code },
      include: [
        { model: Facility, as: 'facility' },
        'creator'
      ]
    });
    if (!program) return res.status(404).json({ error: 'Program not found' });

    // Fetch amenities for the program's facility
    let amenities: any[] = [];
    if (program.primaryFacilityCode) {
      const facilityAmenities = await FacilityAmenity.findAll({
        where: { facilityCode: program.primaryFacilityCode },
        include: [{ model: Amenity, as: 'amenity' }]
      });
      amenities = facilityAmenities.map(fa => ({
        ...fa.amenity?.toJSON(),
        images: fa.images || [],
        unit: fa.unit,
        capacity: fa.capacity,
        status: fa.status
      }));
    }

    // Calculate duration
    const start = program.startDate ? new Date(program.startDate) : null;
    const end = program.endDate ? new Date(program.endDate) : null;
    const duration = start && end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : null;

    // Location from facility
    const location = program.facility ? program.facility.address : null;
    const price = program.price || null;
    const images = program.images || [];

    res.json({
      ...program.toJSON(),
      duration,
      location,
      price,
      images,
      amenities
    });
  } catch (err) {
    next(err);
  }
};

export const getPrograms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
        const page = parseInt(_req.query.page as string) || 1;
        const pageSize = parseInt(_req.query.pageSize as string) || 10;
        const offset = (page - 1) * pageSize;
        const { count, rows } = await Program.findAndCountAll({
          include: ['creator', 'facility'],
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
    next(err);
  }
};
