require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../utils/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import { redis } from '../utils/redis';
import { getAllUsersService, getUserByIdService, updateUserRoleService, deleteUserService } from '../services/user.service';
import { createActivationToken, validateEmail, hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth';
import { sequelize } from '../utils/database';

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body;

      // Validate email format
      if (!validateEmail(email)) {
        return next(new ErrorHandler('Please enter a valid email address', 400));
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(new ErrorHandler('Email already exists', 400));
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        avatar: avatar || {
          public_id: 'default_avatar',
          url: 'https://res.cloudinary.com/demo/image/upload/v1/default_avatar'
        }
      });

      // Create activation token
      const activationToken = createActivationToken(user);

      // Create activation URL
      const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken.token}`;

      // Send activation email
      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data: { 
            user: { name: user.name },
            activationCode: activationToken.activationCode,
            activationUrl
          }
        });

        res.status(201).json({
          success: true,
          message: `Please check your email (${user.email}) to activate your account!`,
          activationToken: activationToken.token
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body;

      const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as Secret) as any;

      if (!decoded) {
        return next(new ErrorHandler('Invalid activation token', 400));
      }

      // Check if activation code matches
      if (decoded.activationCode !== activation_code) {
        return next(new ErrorHandler('Invalid activation code', 400));
      }

      const { user } = decoded;

      // Find the user by email
      const existingUser = await User.findOne({ where: { email: user.email } });

      if (!existingUser) {
        return next(new ErrorHandler('User not found', 400));
      }

      // Update user verification status
      existingUser.isVerified = true;
      await existingUser.save();

      res.status(201).json({
        success: true,
        message: 'Account activated successfully'
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);

      if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
      }

      const user = await User.findOne({ where: { email } });
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      // Check if user is verified
      if (!user.isVerified) {
        return next(new ErrorHandler('Please verify your email first', 400));
      }

      console.log('Comparing passwords...');
      const isPasswordValid = await user.comparePassword(password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set tokens in cookies
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 60 * 1000 // 5 minutes
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Remove password from user object
      const userWithoutPassword = {
        ...user.toJSON(),
        password: undefined
      };

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: userWithoutPassword
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return next(new ErrorHandler('Email already exists', 400));
        }
      }

      user.name = name || user.name;
      user.email = email || user.email;

      await user.save();

      res.status(200).json({
        success: true,
        user
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      const isPasswordValid = await user.comparePassword(oldPassword);

      if (!isPasswordValid) {
        return next(new ErrorHandler('Invalid old password', 400));
      }

      user.password = await hashPassword(newPassword);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update profile picture
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler('User not found', 404));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      user.avatar = avatar;
      await user.save();

      res.status(200).json({
        success: true,
        user
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get all users --- only for admin
export const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      user.role = role;
      await user.save();

      res.status(200).json({
        success: true,
        user
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete user --- only for admin
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      await user.destroy();

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      
      if (!refresh_token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
      }

      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret') as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler('Invalid refresh token', 401));
      }

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      const accessToken = generateAccessToken(user);

      res.status(200).json({
        success: true,
        accessToken
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        const newUser = await User.create({
          email,
          name,
          avatar,
          isVerified: true
        });

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.status(201).json({
          success: true,
          accessToken,
          refreshToken,
          user: newUser
        });
      } else {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
          success: true,
          accessToken,
          refreshToken,
          user
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
