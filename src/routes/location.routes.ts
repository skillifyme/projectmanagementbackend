import * as express from 'express';
import { getCountries, getCitiesByCountry } from '../controllers/location.controller';
const router = express.Router();

router.get('/countries', getCountries);
router.get('/countries/:countryCode/cities', getCitiesByCountry);

export default router;
