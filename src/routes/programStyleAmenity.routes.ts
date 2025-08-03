import * as express from 'express';
import { addProgramStyleAmenity, getProgramStyleAmenities } from '../controllers/programStyleAmenity.controller';
const router = express.Router();

router.post('/', addProgramStyleAmenity);
router.get('/:programStyleCode', getProgramStyleAmenities);

export default router;