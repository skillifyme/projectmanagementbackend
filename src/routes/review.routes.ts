import express = require('express');
import multer = require('multer');
import { uploadToS3 } from '../utils/s3.util';
import { addReview, getProgramReviews } from '../controllers/review.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Accept images as multipart/form-data, upload to S3, and pass S3 URLs to controller
// Require authentication to add reviews
router.post('/', authenticateToken, upload.array('images'), async (req, res, next) => {
  try {
    let imageUrls: string[] = [];
    const files = req.files ?? [];
    if (Array.isArray(files)) {
      for (const file of files) {
        const url = await uploadToS3(file.buffer, file.originalname, 'reviews');
        imageUrls.push(url);
      }
    }
    req.body.images = imageUrls;
    return addReview(req, res);
  } catch (err) {
    next(err);
  }
});

// Public route to get reviews
router.get('/:programCode', getProgramReviews);

export default router;
