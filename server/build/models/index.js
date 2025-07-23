"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = exports.Notification = exports.Order = exports.Course = exports.User = exports.sequelize = void 0;
const database_1 = require("../utils/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_model_1.User; } });
const course_model_1 = require("./course.model");
Object.defineProperty(exports, "Course", { enumerable: true, get: function () { return course_model_1.Course; } });
const order_model_1 = require("./order.model");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_model_1.Order; } });
const notification_model_1 = require("./notification.model");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_model_1.Notification; } });
const layout_model_1 = require("./layout.model");
Object.defineProperty(exports, "Layout", { enumerable: true, get: function () { return layout_model_1.Layout; } });
// Initialize models
const models = {
    User: user_model_1.User,
    Course: course_model_1.Course,
    Order: order_model_1.Order,
    Notification: notification_model_1.Notification,
    Layout: layout_model_1.Layout
};
// Define associations
user_model_1.User.hasMany(course_model_1.Course, { foreignKey: 'userId', as: 'createdCourses' });
course_model_1.Course.belongsTo(user_model_1.User, { foreignKey: 'userId', as: 'user' });
user_model_1.User.hasMany(order_model_1.Order, { foreignKey: 'userId', as: 'orders' });
order_model_1.Order.belongsTo(user_model_1.User, { foreignKey: 'userId', as: 'user' });
course_model_1.Course.hasMany(order_model_1.Order, { foreignKey: 'courseId', as: 'orders' });
order_model_1.Order.belongsTo(course_model_1.Course, { foreignKey: 'courseId', as: 'course' });
