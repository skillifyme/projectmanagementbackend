import { Request, Response } from 'express';
import { Review } from '../models/review.model';

export const addReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit review' });
  }
};

export const getProgramReviews = async (req: Request, res: Response) => {
  try {
    const { programCode } = req.params;
    const reviews = await Review.findAll({ 
      where: { programCode },
      include: ['user', 'program']
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
