"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequiredEnvVars = void 0;
const ErrorHandler_1 = require("./ErrorHandler");
const checkRequiredEnvVars = () => {
    const requiredVars = [
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'ACTIVATION_SECRET',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new ErrorHandler_1.ErrorHandler(`Missing required environment variables: ${missingVars.join(', ')}`, 500);
    }
    console.log('Environment variables check passed');
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'Set' : 'Not set');
    console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'Set' : 'Not set');
    console.log('ACTIVATION_SECRET:', process.env.ACTIVATION_SECRET ? 'Set' : 'Not set');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');
};
exports.checkRequiredEnvVars = checkRequiredEnvVars;
