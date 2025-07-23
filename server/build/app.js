"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const topic_route_1 = __importDefault(require("./routes/topic.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const subcategory_route_1 = __importDefault(require("./routes/subcategory.route"));
const language_route_1 = __importDefault(require("./routes/language.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const swagger_1 = require("./utils/swagger");
const checkEnv_1 = require("./utils/checkEnv");
// Load environment variables
require('dotenv').config();
// Check required environment variables
(0, checkEnv_1.checkRequiredEnvVars)();
// Create Express app
const app = (0, express_1.default)();
exports.app = app;
// Create HTTP server
const server = (0, http_1.createServer)(app);
exports.server = server;
// Create Socket.IO server
const io = new socket_io_1.Server(server, {
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
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: './tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath: true, // Create the temp directory if it doesn't exist
}));
app.use((0, cors_1.default)({
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
}));
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Routes
app.use('/api/v1', user_route_1.default);
app.use('/api/v1', course_route_1.default); // Keep for backward compatibility
app.use('/api/v1', topic_route_1.default);
app.use('/api/v1', category_route_1.default);
app.use('/api/v1', subcategory_route_1.default);
app.use('/api/v1', language_route_1.default);
app.use('/api/v1/order', order_route_1.default);
app.use('/api/v1', notification_route_1.default);
app.use('/api/v1', analytics_route_1.default);
app.use('/api/v1', layout_route_1.default);
// Mount Swagger UI
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs));
// Testing route
app.get("/test", (req, res) => {
    res.status(200).json({
        message: "ThinkCyber Admin Portal API is running",
    });
});
// Error handling
app.use(error_1.ErrorMiddleware);
const PORT = Number(process.env.PORT) || 5000;
server.listen(8000, '0.0.0.0', () => {
    console.log(`Server is running on port`);
});
