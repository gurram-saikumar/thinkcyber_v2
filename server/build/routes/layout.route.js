"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const layout_controller_1 = require("../controllers/layout.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/layout/create-layout:
 *   post:
 *     summary: Create a new layout (admin only)
 *     tags: [Layout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - subTitle
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [banner, faq, categories]
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               faq:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *     responses:
 *       201:
 *         description: Layout created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post("/create-layout", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layout_controller_1.createLayout);
/**
 * @swagger
 * /api/v1/layout/edit-layout:
 *   put:
 *     summary: Edit a layout (admin only)
 *     tags: [Layout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [banner, faq, categories]
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               faq:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *     responses:
 *       200:
 *         description: Layout updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.put("/edit-layout", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), layout_controller_1.editLayout);
/**
 * @swagger
 * /api/v1/layout/get-layout/{type}:
 *   get:
 *     summary: Get layout by type
 *     tags: [Layout]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [banner, faq, categories]
 *     responses:
 *       200:
 *         description: Layout retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 layout:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     title:
 *                       type: string
 *                     subTitle:
 *                       type: string
 *                     faq:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *                           answer:
 *                             type: string
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *       404:
 *         description: Layout not found
 */
router.get("/get-layout/:type", layout_controller_1.getLayoutByType);
exports.default = router;
