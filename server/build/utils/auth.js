"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.createActivationToken = exports.comparePassword = exports.hashPassword = exports.validateEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
// Hash password
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
// Compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(enteredPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
// Create activation token
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user,
        activationCode
    }, process.env.ACTIVATION_SECRET, { expiresIn: '5m' });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
// Generate access token
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
