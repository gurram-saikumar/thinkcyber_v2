"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialAuth = exports.updateAccessToken = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateProfilePicture = exports.updateUserPassword = exports.updateUserInfo = exports.getUserInfo = exports.logoutUser = exports.loginUser = exports.activateUser = exports.registerUser = void 0;
require("dotenv").config();
const user_model_1 = require("../models/user.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../utils/catchAsyncError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const auth_1 = require("../utils/auth");
exports.registerUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;
        // Validate email format
        if (!(0, auth_1.validateEmail)(email)) {
            return next(new ErrorHandler_1.default('Please enter a valid email address', 400));
        }
        // Check if user already exists
        const existingUser = await user_model_1.User.findOne({ where: { email } });
        if (existingUser) {
            return next(new ErrorHandler_1.default('Email already exists', 400));
        }
        // Create user
        const user = await user_model_1.User.create({
            name,
            email,
            password,
            avatar: avatar || {
                public_id: 'default_avatar',
                url: 'https://res.cloudinary.com/demo/image/upload/v1/default_avatar'
            },
            role: ""
        });
        // Create activation token
        const activationToken = (0, auth_1.createActivationToken)(user);
        // Create activation URL
        const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken.token}`;
        // Send activation email
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: 'Activate your account',
                template: 'activation-mail.ejs',
                data: {
                    user: { name: user.name },
                    activationCode: activationToken.activationCode,
                    activationUrl
                }
            });
            res.status(201).json({
                success: true,
                message: `Please check your email (${user.email}) to activate your account!`,
                activationToken: activationToken.token
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.activateUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        const decoded = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (!decoded) {
            return next(new ErrorHandler_1.default('Invalid activation token', 400));
        }
        // Check if activation code matches
        if (decoded.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default('Invalid activation code', 400));
        }
        const { user } = decoded;
        // Find the user by email
        const existingUser = await user_model_1.User.findOne({ where: { email: user.email } });
        if (!existingUser) {
            return next(new ErrorHandler_1.default('User not found', 400));
        }
        // Update user verification status
        existingUser.isVerified = true;
        await existingUser.save();
        res.status(201).json({
            success: true,
            message: 'Account activated successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        if (!email || !password) {
            return next(new ErrorHandler_1.default('Please provide email and password', 400));
        }
        const user = await user_model_1.User.findOne({ where: { email } });
        console.log('User found:', user ? 'Yes' : 'No');
        if (!user) {
            return next(new ErrorHandler_1.default('Invalid email or password', 400));
        }
        // Check if user is verified
        if (!user.isVerified) {
            return next(new ErrorHandler_1.default('Please verify your email first', 400));
        }
        console.log('Comparing passwords...');
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default('Invalid email or password', 400));
        }
        const accessToken = (0, auth_1.generateAccessToken)(user);
        const refreshToken = (0, auth_1.generateRefreshToken)(user);
        // Set tokens in cookies
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000 // 5 minutes
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        // Remove password from user object
        const userWithoutPassword = {
            ...user.toJSON(),
            password: undefined
        };
        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// logout user
exports.logoutUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user info
exports.getUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const user = await user_model_1.User.findByPk(userId);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const user = await user_model_1.User.findByPk(userId);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        if (email && email !== user.email) {
            const existingUser = await user_model_1.User.findOne({ where: { email } });
            if (existingUser) {
                return next(new ErrorHandler_1.default('Email already exists', 400));
            }
        }
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateUserPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const user = await user_model_1.User.findByPk(userId);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const isPasswordValid = await user.comparePassword(oldPassword);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default('Invalid old password', 400));
        }
        user.password = await (0, auth_1.hashPassword)(newPassword);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateProfilePicture = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const user = await user_model_1.User.findByPk(userId);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        user.avatar = {
            public_id: `custom_avatar_${user.id}`,
            url: avatar
        };
        await user.save();
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// Get all users --- only for admin
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await user_model_1.User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update user role --- only for admin
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id, role } = req.body;
        const user = await user_model_1.User.findByPk(id);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        user.role = role;
        await user.save();
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// delete user --- only for admin
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.User.findByPk(id);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        await user.destroy();
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token
exports.updateAccessToken = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.default('Please login to access this resource', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret');
        if (!decoded) {
            return next(new ErrorHandler_1.default('Invalid refresh token', 401));
        }
        const user = await user_model_1.User.findByPk(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.default('User not found', 404));
        }
        const accessToken = (0, auth_1.generateAccessToken)(user);
        res.status(200).json({
            success: true,
            accessToken
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.socialAuth = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await user_model_1.User.findOne({ where: { email } });
        if (!user) {
            const newUser = await user_model_1.User.create({
                email,
                name,
                avatar: {
                    public_id: `social_avatar_${email}`,
                    url: avatar
                },
                isVerified: true,
                password: "",
                role: ""
            });
            const accessToken = (0, auth_1.generateAccessToken)(newUser);
            const refreshToken = (0, auth_1.generateRefreshToken)(newUser);
            res.status(201).json({
                success: true,
                accessToken,
                refreshToken,
                user: newUser
            });
        }
        else {
            const accessToken = (0, auth_1.generateAccessToken)(user);
            const refreshToken = (0, auth_1.generateRefreshToken)(user);
            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
