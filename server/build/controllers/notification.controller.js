"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("../utils/database");
const sequelize_1 = require("sequelize");
// get all notifications --- only admin
exports.getNotifications = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        // Ensure database connection
        await database_1.sequelize.authenticate();
        const notifications = await notification_Model_1.default.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
// update notification status --- only admin
exports.updateNotification = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    // Ensure database connection
    if (!database_1.sequelize.authenticate()) {
        throw new ErrorHandler_1.ErrorHandler("Database connection failed", 500);
    }
    const notification = await notification_Model_1.default.findByPk(req.params.id);
    if (!notification) {
        return next(new ErrorHandler_1.ErrorHandler("Notification not found", 404));
    }
    notification.status = "read";
    await notification.save();
    const notifications = await notification_Model_1.default.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.status(201).json({
        success: true,
        notifications,
    });
});
// delete notification --- only admin
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    try {
        // Ensure database connection
        if (!database_1.sequelize.authenticate()) {
            console.error('Database connection failed');
            return;
        }
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await notification_Model_1.default.destroy({
            where: {
                status: "read",
                createdAt: {
                    [sequelize_1.Op.lt]: thirtyDaysAgo
                }
            }
        });
        console.log('Deleted read notifications');
    }
    catch (error) {
        console.error('Error deleting notifications:', error);
    }
});
