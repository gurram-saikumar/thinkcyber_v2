import Notification from "../models/notification.Model";
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import cron from "node-cron";
import { sequelize } from "../utils/database";
import { Op } from "sequelize";

// get all notifications --- only admin
export const getNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
    // Ensure database connection
    await sequelize.authenticate();

    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']]
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
});

// update notification status --- only admin
export const updateNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const notification = await Notification.findByPk(req.params.id);
      if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
      }

  notification.status = "read";
      await notification.save();

  const notifications = await Notification.findAll({
    order: [['createdAt', 'DESC']]
      });

      res.status(201).json({
        success: true,
        notifications,
      });
});

// delete notification --- only admin
cron.schedule("0 0 0 * * *", async() => {
  try {
    // Ensure database connection
    if (!sequelize.authenticate()) {
      console.error('Database connection failed');
      return;
    }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.destroy({
      where: {
        status: "read",
        createdAt: {
          [Op.lt]: thirtyDaysAgo
        }
      }
    });
  console.log('Deleted read notifications');
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
});