"use strict";
require("dotenv").config();

const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const { ErrorMiddleware } = require("./middleware/error");

const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));

const { rateLimit } = require("express-rate-limit");

exports.app = (0, express_1.default)();

// Middleware
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use(cookie_parser_1.default());
exports.app.use(cors_1.default({
  origin: [
    "https://e-learning-client-nine.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
exports.app.use(limiter);

// Route mounting
console.log("All routes loaded");
exports.app.use("/api/v1/user", user_route_1.default);
exports.app.use("/api/v1/course", course_route_1.default);
exports.app.use("/api/v1/order", order_route_1.default);
exports.app.use("/api/v1/notification", notification_route_1.default);
exports.app.use("/api/v1/analytics", analytics_route_1.default);
exports.app.use("/api/v1/layout", layout_route_1.default);

// Test route
exports.app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// 404 Handler
exports.app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Error middleware
exports.app.use(ErrorMiddleware);
