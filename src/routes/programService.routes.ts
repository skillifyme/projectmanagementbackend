import * as express from 'express';
import { mapServiceToProgram, getServicesForProgram } from '../controllers/programService.controller';
const router = express.Router();

router.post('/', mapServiceToProgram);
router.get('/:programCode', getServicesForProgram);

export default router;
