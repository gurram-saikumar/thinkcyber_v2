import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../utils/catchAsyncError";
import { generateLast12MothsData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import { Order } from "../models/order.Model";
import { sequelize } from "../utils/database";

// get users analytics --- only for admin
export const getUsersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    const users = await generateLast12MothsData(User);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get courses analytics --- only for admin
export const getCoursesAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    const courses = await generateLast12MothsData(Course);

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get order analytics --- only for admin
export const getOrderAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    const orders = await generateLast12MothsData(Order);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});
  