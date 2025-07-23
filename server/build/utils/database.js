"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.testConnection = exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
console.log('Database Configuration:');
console.log('Host:', process.env.MYSQL_HOST || 'localhost');
console.log('Database:', process.env.MYSQL_DATABASE || 'lms_db');
console.log('User:', process.env.MYSQL_USER || 'root');
// Database configuration
const sequelize = new sequelize_1.Sequelize(process.env.MYSQL_DATABASE || 'lms_db', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD || '', {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    // Enable logging in development
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    // Connection pool configuration
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000 // Maximum time in ms that a connection can be idle
    },
    // Additional MySQL options
    dialectOptions: {
        // Enable SSL in production
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false,
        // Add support for larger JSON fields
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        // Increase max allowed packet size
        maxAllowedPacket: 16777216 // 16MB
    }
});
exports.sequelize = sequelize;
// Test database connection
const connectDB = async () => {
    try {
        console.log('\nAttempting to connect to database...');
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // Sync all models
        console.log('\nSynchronizing database models...');
        if (process.env.NODE_ENV === 'development') {
            // Use alter in development to preserve data
            await sequelize.sync({ alter: true });
            console.log('Database tables have been synchronized (preserving data).');
        }
        else {
            // Safe sync in production
            await sequelize.sync();
            console.log('Database tables have been synchronized.');
        }
        console.log('All models were synchronized successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error.message);
        console.log('\nPlease check:');
        console.log('1. MySQL server is running');
        console.log('2. Database credentials are correct');
        console.log('3. Database exists');
        console.log('4. User has proper permissions');
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    }
    catch (error) {
        console.error('Unable to connect to the database:', error.message);
        return false;
    }
};
exports.testConnection = testConnection;
