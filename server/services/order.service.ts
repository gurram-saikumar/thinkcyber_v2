import { NextFunction, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { Order } from "../models/order.Model";
import { sequelize } from "../utils/database";
import { catchAsyncError } from "../utils/catchAsyncError";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";

// create new order
export const newOrder = catchAsyncError(async (data: any, res: Response, next: NextFunction) => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    const order = await Order.create(data);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get All Orders
export const getAllOrdersService = catchAsyncError(async (res: Response, next: NextFunction) => {
  try {
    // Ensure database connection
    await sequelize.authenticate();

    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        },
        {
          model: Course,
          attributes: ['name', 'price']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});
  