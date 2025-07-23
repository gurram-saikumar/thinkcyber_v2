"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const database_1 = require("./utils/database");
const socketServer_1 = require("./socketServer");
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
console.log('\n🚀 Starting server initialization...');
// Create HTTP server
const server = http_1.default.createServer(app_1.app);
// Cloudinary configuration for image upload
console.log('\nConfiguring Cloudinary...');
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('✅ Cloudinary configured successfully');
// Initialize socket server
console.log('\nInitializing Socket Server...');
(0, socketServer_1.initSocketServer)(server);
console.log('✅ Socket Server initialized successfully');
// Start server
const startServer = async () => {
    try {
        console.log('\n📦 Starting server setup...');
        // Connect to database first
        console.log('\n📦 Connecting to database...');
        await (0, database_1.connectDB)();
        // Then start the server
        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {
            console.log('\n✅ Server is running successfully!');
            console.log('Server details:');
            console.log(`- Port: ${PORT}`);
            console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`- API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`- Health Check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('\n❌ Server startup failed:', error.message);
        process.exit(1);
    }
};
// Start the server
startServer();
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error('\n❌ Uncaught Exception:', err.message);
    console.error(err.stack);
    console.error('\nShutting down the server due to uncaught exception');
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error('\n❌ Unhandled Rejection:', err.message);
    console.error(err.stack);
    console.error('\nShutting down the server due to unhandled promise rejection');
    // Close server gracefully
    server.close(() => {
        process.exit(1);
    });
});
