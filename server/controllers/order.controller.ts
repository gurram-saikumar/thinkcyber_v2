import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { Order } from "../models/order.Model";
import User from "../models/user.model";
import { Course } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import Notification from "../models/notification.Model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { catchAsyncError } from "../utils/catchAsyncError";
import { sequelize } from "../utils/database";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// create order
export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { courseId, payment_info } = req.body as Order;

  if (payment_info) {
    if ("id" in payment_info) {
      const paymentIntentId = payment_info.id;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        return next(new ErrorHandler("Payment not authorized!", 400));
      }
    }
  }

  const user = await User.findByPk(req.user?.id);

  const courseExistInUser = (user && Array.isArray((user as any).courses))
    ? (user as any).courses.some((course: any) => course.id === courseId)
    : false;

  if (courseExistInUser) {
    return next(
      new ErrorHandler("You have already purchased this course", 400)
    );
  }

  const course = await Course.findByPk(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const data: any = {
    courseId: course.id,
    userId: user?.id as string,
    payment_info,
  };

  const mailData = {
    order: {
      _id: course.id.toString().slice(0, 6),
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };

  const html = await ejs.renderFile(
    path.join(__dirname, "../mails/order-confirmation.ejs"),
    { order: mailData }
  );

  try {
    if (user) {
      await sendMail({
        email: user.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: mailData,
      });
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }

  if (user && course) {
    // Ensure user.courses exists and is an array, or update according to your model
    if (!Array.isArray((user as any).courses)) {
      (user as any).courses = [];
    }
    (user as any).courses.push(course.id);
    await user.save();
  }

  await Notification.create({
    userId: user?.id as string,
    title: "New Order",
    message: `You have a new order from ${course?.name}`,
    status: "unread"
  });

  course.purchased = course.purchased + 1;
  await course.save();

  await newOrder(data, res, next);
});

// create order for mobile
export const createMobileOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { courseId, payment_info } = req.body as Order;
  const user = await User.findByPk(req.user?.id);

  let courseExistInUser = false;
  if (user) {
    const userCourses = await (user as any).getCourses?.() || [];
    courseExistInUser = userCourses.some(
      (course: any) => course.id === courseId
    );
  }

  if (courseExistInUser) {
    return next(
      new ErrorHandler("You have already purchased this course", 400)
    );
  }

  const course = await Course.findByPk(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  const data: any = {
    courseId: course.id,
    userId: user?.id as string,
    payment_info,
  };

  const mailData = {
    order: {
      _id: course.id.toString().slice(0, 6),
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };

  const html = await ejs.renderFile(
    path.join(__dirname, "../mails/order-confirmation.ejs"),
    { order: mailData }
  );

  try {
    if (user) {
      await sendMail({
        email: user.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: mailData,
      });
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }

  if (user && course) {
    (user as any).courses.push(course.id);
    await user.save();
  }

  await Notification.create({
    userId: user?.id as string,
    title: "New Order",
    message: `You have a new order from ${course?.name}`,
    status: "unread"
  });

  course.purchased = course.purchased + 1;
  await course.save();

  await newOrder(data, res, next);
});

// get All orders --- only for admin
export const getAllOrders = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  await getAllOrdersService(req, res, next);
});

// send stripe publishable key
export const sendStripePublishableKey = catchAsyncError(async (req: Request, res: Response) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// new payment
export const newPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "LMS",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(201).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});
