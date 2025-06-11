import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import analyticsRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { swaggerUi, specs } from './utils/swagger';
import { checkRequiredEnvVars } from './utils/checkEnv';

// Load environment variables
require('dotenv').config();

// Check required environment variables
checkRequiredEnvVars();

// Create Express app
const app: Application = express();

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.ORIGIN || 'http://localhost:3000',
        credentials: true,
    },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  createParentPath: true, // Create the temp directory if it doesn't exist
}));
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With", 
      "Accept", 
      "Origin",
      "access-token",
      "refresh-token"
    ],
  })
);
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/v1', userRouter);
app.use('/api/v1', courseRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', notificationRouter);
app.use('/api/v1', analyticsRouter);
app.use('/api/v1', layoutRouter);

// Mount Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Testing route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    message: "ThinkCyber Admin Portal API is running",
  });
});

// Error handling
app.use(ErrorMiddleware);

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server };

