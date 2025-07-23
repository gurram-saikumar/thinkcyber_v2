"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = exports.sendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = __importDefault(require("./ErrorHandler"));
const user_model_1 = require("../models/user.model");
const sendToken = (user, statusCode, res) => {
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });
    res.status(statusCode).json({
        success: true,
        user,
        token,
    });
};
exports.sendToken = sendToken;
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const token = req.cookies['access_token'];
    if (!token) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 401));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await user_model_1.User.findByPk(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 404));
    }
    req.user = user;
    next();
});
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler_1.default(`Role (${req.user?.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
