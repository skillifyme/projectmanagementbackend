import * as express from 'express';
import { createAmenity, getAllAmenities, getAmenityByCode } from '../controllers/amenity.controller';
const router = express.Router();

router.post('/', createAmenity);
router.get('/', getAllAmenities);
router.get('/:code', getAmenityByCode);

export default router;
