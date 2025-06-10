import {v2 as cloudinary} from "cloudinary";
import http from "http";
import { connectDB } from "./utils/database";
import { initSocketServer } from "./socketServer";
import { app, server } from "./app";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🚀 Starting server initialization...');

// Create HTTP server
const server = http.createServer(app);

// Cloudinary configuration for image upload
console.log('\nConfiguring Cloudinary...');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('✅ Cloudinary configured successfully');

// Initialize socket server
console.log('\nInitializing Socket Server...');
initSocketServer(server);
console.log('✅ Socket Server initialized successfully');

// Start server
const startServer = async () => {
    try {
        console.log('\n📦 Starting server setup...');
        
        // Connect to database first
        console.log('\n📦 Connecting to database...');
        await connectDB();
        
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
    } catch (error: any) {
        console.error('\n❌ Server startup failed:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
    console.error('\n❌ Uncaught Exception:', err.message);
    console.error(err.stack);
    console.error('\nShutting down the server due to uncaught exception');
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    console.error('\n❌ Unhandled Rejection:', err.message);
    console.error(err.stack);
    console.error('\nShutting down the server due to unhandled promise rejection');
    
    // Close server gracefully
    server.close(() => {
        process.exit(1);
    });
});