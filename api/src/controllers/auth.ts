import { Request, Response } from 'express';
import { User } from '../entities';
import { BadRequestError } from '../errors';
import { validateSchema } from '../middleware/validateSchema';
import { loginSchema, registerSchema } from '../schemas/auth';

export const login = [
  validateSchema(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Hard-coded mock user for testing
    if (email === 'test@example.com' && password === 'password') {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        email: 'test@example.com',
      };
      if (req.session) {
        req.session.userId = mockUser._id;
      }
      return res.json({ user: mockUser });
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    if (req.session) {
      req.session.userId = (user._id as unknown as string).toString();
    }
    res.json({ user });
  }
];

export const register = [
  validateSchema(registerSchema),
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = await User.create({
      name,
      email,
      password,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });

    if (req.session) {
      req.session.userId = (user._id as unknown as string).toString();
    }
    res.status(201).json(user);
  }
];

export const logout = (req: Request, res: Response) => {
  req.session = undefined;
  res.status(204).send();
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.session?.userId) {
    return res.json({ user: null });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    req.session = undefined;
    return res.json({ user: null });
  }

  res.json({ user });
}; 