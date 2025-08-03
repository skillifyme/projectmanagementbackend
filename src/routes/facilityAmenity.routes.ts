import * as express from 'express';
import { addFacilityAmenity, getFacilityAmenities } from '../controllers/facilityAmenity.controller';
const router = express.Router();

router.post('/', addFacilityAmenity);
router.get('/:facilityCode', getFacilityAmenities);

export default router;
