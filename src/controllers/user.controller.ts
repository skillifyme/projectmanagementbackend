import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userCode } = req.params;
    const [updated] = await User.update(req.body, { where: { code: userCode } });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    const user = await User.findOne({ where: { code: userCode } });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userCode } = req.params;
    const user = await User.findOne({ where: { code: userCode } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
