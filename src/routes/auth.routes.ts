import * as express from 'express';
import { 
  sendOtp, 
  verifyOtp, 
  googleLogin, 
  register, 
  login, 
  refreshToken, 
  logout, 
  getProfile 
} from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Email/Password Authentication
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// OTP Authentication
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Google Authentication
router.post('/google-login', googleLogin);

// Protected Routes
router.get('/profile', authenticateToken, getProfile);

export default router;
