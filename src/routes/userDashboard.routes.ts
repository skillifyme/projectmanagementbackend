import * as express from 'express';
import { getUserDashboard } from '../controllers/userDashboard.controller';
const router = express.Router();

router.get('/', getUserDashboard);

export default router;
