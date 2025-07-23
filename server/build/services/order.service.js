"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_Model_1 = require("../models/order.Model");
const database_1 = require("../utils/database");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const user_model_1 = require("../models/user.model");
const course_model_1 = require("../models/course.model");
// create new order
exports.newOrder = (0, catchAsyncError_1.catchAsyncError)(async (data, res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const order = await order_Model_1.Order.create(data);
        res.status(201).json({
            success: true,
            order,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get All Orders
exports.getAllOrdersService = (0, catchAsyncError_1.catchAsyncError)(async (res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const orders = await order_Model_1.Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: user_model_1.User,
                    attributes: ['name', 'email']
                },
                {
                    model: course_model_1.Course,
                    attributes: ['name', 'price']
                }
            ]
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
