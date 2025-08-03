import { Request, Response, NextFunction } from 'express';
import { ProgramStyle } from '../models/programStyle.model';

export const createProgramStyle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requiredFields = ['name', 'status', 'code', 'slug'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const style = await ProgramStyle.create(req.body);
    res.status(201).json(style);
  } catch (err) {
    next(err);
  }
};

export const getAllProgramStyles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const styles = await ProgramStyle.findAll();
    res.json(styles);
  } catch (err) {
    next(err);
  }
};

export const getProgramStyleByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const style = await ProgramStyle.findOne({ where: { code } });
    
    if (!style) {
      return res.status(404).json({ error: 'Program style not found' });
    }
    
    res.json(style);
  } catch (err) {
    next(err);
  }
};
