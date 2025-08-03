import * as express from 'express';
import { getHomepageSections } from '../controllers/home.controller';
const router = express.Router();

router.get('/', getHomepageSections);

export default router;
