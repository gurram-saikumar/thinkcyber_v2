"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/order/create-order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - payment_info
 *             properties:
 *               courseId:
 *                 type: integer
 *               payment_info:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/create-order", auth_1.isAuthenticated, order_controller_1.createOrder);
/**
 * @swagger
 * /api/v1/order/create-mobile-order:
 *   post:
 *     summary: Create a new order for mobile payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - payment_info
 *             properties:
 *               courseId:
 *                 type: integer
 *               payment_info:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/create-mobile-order", auth_1.isAuthenticated, order_controller_1.createMobileOrder);
/**
 * @swagger
 * /api/v1/order/get-orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get("/get-orders", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllOrders);
/**
 * @swagger
 * /api/v1/order/payment/stripepublishablekey:
 *   get:
 *     summary: Get Stripe publishable key
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Stripe publishable key retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 publishableKey:
 *                   type: string
 */
router.get("/payment/stripepublishablekey", order_controller_1.sendStripePublishableKey);
/**
 * @swagger
 * /api/v1/order/payment:
 *   post:
 *     summary: Process payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/payment", auth_1.isAuthenticated, order_controller_1.newPayment);
exports.default = router;
