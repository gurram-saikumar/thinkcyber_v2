import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";

const router = express.Router();

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
router.post(
  "/create-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);

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
router.put(
  "/edit-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);

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
router.get("/get-layout/:type", getLayoutByType);

export default router;