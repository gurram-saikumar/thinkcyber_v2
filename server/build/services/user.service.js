"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.getUserById = void 0;
const user_model_1 = require("../models/user.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../utils/catchAsyncError");
// get user by id
exports.getUserById = (0, catchAsyncError_1.catchAsyncError)(async (id) => {
    const user = await user_model_1.User.findByPk(id);
    if (!user) {
        throw new ErrorHandler_1.default("User not found", 404);
    }
    return user;
});
// get all users
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async () => {
    const users = await user_model_1.User.findAll();
    return users;
});
// update user role
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)(async (id, role) => {
    const user = await user_model_1.User.findByPk(id);
    if (!user) {
        throw new ErrorHandler_1.default("User not found", 404);
    }
    user.role = role;
    await user.save();
    return user;
});
// delete user
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)(async (id) => {
    const user = await user_model_1.User.findByPk(id);
    if (!user) {
        throw new ErrorHandler_1.default("User not found", 404);
    }
    await user.destroy();
    return { message: "User deleted successfully" };
});
