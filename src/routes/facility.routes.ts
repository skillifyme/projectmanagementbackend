import * as express from 'express';
import {
  createFacility,
  getAllFacilities,
  getFacilityByCode,
  updateFacility,
} from '../controllers/facility.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAllFacilities);
router.get('/:code', getFacilityByCode);

// Protected routes - require authentication and facility/admin role
router.post('/', authenticateToken, authorizeRoles('facility', 'admin'), createFacility);
router.put('/:code', authenticateToken, authorizeRoles('facility', 'admin'), updateFacility);

export default router;
