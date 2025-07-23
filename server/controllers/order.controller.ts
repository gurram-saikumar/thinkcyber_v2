import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { Order } from "../models/order.Model";
import User from "../models/user.model";
import Topic from "../models/topic.model";
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

  const { topicId, payment_info } = req.body as Order;

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

  const topicExistInUser = (user && Array.isArray((user as any).topics))
    ? (user as any).topics.some((topic: any) => topic.id === topicId)
    : false;

  if (topicExistInUser) {
    return next(
      new ErrorHandler("You have already purchased this topic", 400)
    );
  }

  const topic = await Topic.findByPk(topicId);

  if (!topic) {
    return next(new ErrorHandler("Topic not found", 404));
  }

  const data: any = {
    topicId: topic.id,
    userId: user?.id as string,
    payment_info,
  };

  const mailData = {
    order: {
      _id: topic.id.toString().slice(0, 6),
      name: topic.name,
      price: topic.price,
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

  if (user && topic) {
    // Ensure user.topics exists and is an array, or update according to your model
    if (!Array.isArray((user as any).topics)) {
      (user as any).topics = [];
    }
    (user as any).topics.push(topic.id);
    await user.save();
  }

  await Notification.create({
    userId: user?.id as string,
    title: "New Order",
    message: `You have a new order from ${topic?.name}`,
    status: "unread"
  });

  topic.purchased = topic.purchased + 1;
  await topic.save();

  await newOrder(data, res, next);
});

// create order for mobile
export const createMobileOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { topicId, payment_info } = req.body as Order;
  const user = await User.findByPk(req.user?.id);

  let topicExistInUser = false;
  if (user) {
    const userTopics = await (user as any).getTopics?.() || [];
    topicExistInUser = userTopics.some(
      (topic: any) => topic.id === topicId
    );
  }

  if (topicExistInUser) {
    return next(
      new ErrorHandler("You have already purchased this topic", 400)
    );
  }

  const topic = await Topic.findByPk(topicId);

  if (!topic) {
    return next(new ErrorHandler("Topic not found", 404));
  }

  const data: any = {
    topicId: topic.id,
    userId: user?.id as string,
    payment_info,
  };

  const mailData = {
    order: {
      _id: topic.id.toString().slice(0, 6),
      name: topic.name,
      price: topic.price,
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

  if (user && topic) {
    (user as any).topics.push(topic.id);
    await user.save();
  }

  await Notification.create({
    userId: user?.id as string,
    title: "New Order",
    message: `You have a new order from ${topic?.name}`,
    status: "unread"
  });

  topic.purchased = topic.purchased + 1;
  await topic.save();

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
