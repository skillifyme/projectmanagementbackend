import { Request, Response, NextFunction } from 'express';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';
import { Program } from '../models/program.model';
import { Facility } from '../models/facility.model';

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await Country.findAll({ include: [City] });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

export const getCitiesByCountry = async (req: Request, res: Response) => {
  try {
    const { countryCode } = req.params;
    const cities = await City.findAll({ 
      where: { countryCode },
      include: ['country']
    });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

export const getCitiesGroupedByCountry = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = await Country.findAll({ include: [City] });
    res.json(countries);
  } catch (err) {
    next(err);
  }
};

export const getProgramsByCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city } = req.params;
    const programs = await Program.findAll({
      include: [{
        model: Facility,
        where: { city }
      }]
    });
    res.json(programs);
  } catch (err) {
    next(err);
  }
};

export const getProgramsByStyle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { style } = req.params;
    // Assuming 'style' param is the name of the ProgramStyle
    const programs = await Program.findAll({
      include: [{
        association: 'programStyle',
        where: { name: style }
      }]
    });
    res.json(programs);
  } catch (err) {
    next(err);
  }
};
