import { Router } from 'express';
import { createProgramStyle, getAllProgramStyles, getProgramStyleByCode } from '../controllers/programStyle.controller';

const router = Router();

router.post('/', createProgramStyle);
router.get('/', getAllProgramStyles);
router.get('/:code', getProgramStyleByCode);

export default router;
