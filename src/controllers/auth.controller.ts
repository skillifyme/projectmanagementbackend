import { Request, Response } from 'express';
import { generateOTP, sendMockOTP, verifyOTP } from '../utils/otp.util';
import { generateToken, verifyToken } from '../utils/jwt.util';
import { comparePassword } from '../utils/password.util';
import { User } from '../models/user.model';
import axios from 'axios';

export const sendOtp = (req: Request, res: Response) => {
  const { phone } = req.body;
  const otp = generateOTP();
  sendMockOTP(phone, otp);
  res.json({ message: 'OTP sent' });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const valid = verifyOTP(email, otp); // assuming OTP is sent to email
  if (!valid) return res.status(400).json({ error: 'Invalid OTP' });

  // Find user by email, or create if needed
  let user = await User.findOne({ where: { email } });
  if (!user) {
    const userCode = 'usr' + Math.random().toString(16).substring(2, 8);
    user = await User.create({ email, role: 'user', code: userCode } as any);
  }

  const token = generateToken({ 
    id: user.id, 
    code: user.code, 
    role: user.role, 
    email: user.email 
  });
  res.json({ 
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      code: user.code
    }
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;
    const googleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`;
    const { data } = await axios.get(googleUrl);
    const { email, sub: googleId } = data;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Invalid Google token payload' });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const userCode = 'usr' + Math.random().toString(16).substring(2, 8);
      user = await User.create({ email, googleId, role: 'user', code: userCode } as any);
    }

    const token = generateToken({ 
      id: user.id, 
      code: user.code, 
      role: user.role, 
      email: user.email 
    });
    res.json({ 
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        code: user.code
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'Google token verification failed' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate user code
    const userCode = 'usr' + Math.random().toString(16).substring(2, 8);

    // Create user (password will be hashed automatically)
    const user = await User.create({
      email,
      password,
      role,
      code: userCode
    } as any);

    const token = generateToken({ 
      id: user.id, 
      code: user.code, 
      role: user.role, 
      email: user.email 
    });

    res.status(201).json({ 
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        code: user.code
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ 
      id: user.id, 
      code: user.code, 
      role: user.role, 
      email: user.email 
    });

    res.json({ 
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        code: user.code
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken({ 
      id: user.id, 
      code: user.code, 
      role: user.role, 
      email: user.email 
    });

    res.json({ accessToken: newToken });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (_req: Request, res: Response) => {
  // Since JWT is stateless, logout is handled client-side
  // Could implement token blacklisting here if needed
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        code: user.code,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get profile', details: error.message });
  }
};
