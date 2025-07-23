"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
// ✅ Authenticated user middleware
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];
    console.log("access_token", access_token);
    if (!access_token) {
        return next(new ErrorHandler_1.ErrorHandler('Please login to access this resource', 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret');
        if (!decoded) {
            return next(new ErrorHandler_1.ErrorHandler('Access token is not valid', 401));
        }
        const user = await user_model_1.User.findByPk(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler('Please login to access this resource', 401));
        }
        req.user = user; // Make user available to next middleware
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        return next(new ErrorHandler_1.ErrorHandler('Access token is not valid', 401));
    }
});
// ✅ Role-based access control middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler_1.ErrorHandler('Please login to access this resource', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
