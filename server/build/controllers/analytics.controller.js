"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderAnalytics = exports.getCoursesAnalytics = exports.getUsersAnalytics = void 0;
const ErrorHandler_1 = require("../utils/ErrorHandler");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const analytics_generator_1 = require("../utils/analytics.generator");
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_Model_1 = require("../models/order.Model");
const database_1 = require("../utils/database");
// get users analytics --- only for admin
exports.getUsersAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const users = await (0, analytics_generator_1.generateLast12MothsData)(user_model_1.default);
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
// get courses analytics --- only for admin
exports.getCoursesAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const courses = await (0, analytics_generator_1.generateLast12MothsData)(course_model_1.default);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
// get order analytics --- only for admin
exports.getOrderAnalytics = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const orders = await (0, analytics_generator_1.generateLast12MothsData)(order_Model_1.Order);
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
