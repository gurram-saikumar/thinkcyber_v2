import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../utils/catchAsyncError';
import { ErrorHandler } from '../utils/ErrorHandler';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// ✅ Authenticated user middleware
export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

  console.log("access_token",access_token)

  if (!access_token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret'
    ) as any;

    if (!decoded) {
      return next(new ErrorHandler('Access token is not valid', 401));
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    req.user = user; // Make user available to next middleware
    next();
  } catch (error: any) {
    console.error('Token verification error:', error);
    return next(new ErrorHandler('Access token is not valid', 401));
  }
});

// ✅ Role-based access control middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
    }

    next();
  };
};
