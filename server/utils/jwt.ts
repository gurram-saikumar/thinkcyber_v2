import jwt from "jsonwebtoken";
import { Request } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "./ErrorHandler";
import { User } from "../models/user.model";

interface IJwtToken {
  id: string;
}

export const sendToken = (user: any, statusCode: number, res: any) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "5d",
  });

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: any, next: any) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtToken;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: any, next: any) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
