"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const topic_controller_1 = require("../controllers/topic.controller");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
// Public routes
router.get("/topics", topic_controller_1.getAllTopics);
router.get("/topics/:id", topic_controller_1.getSingleTopic);
router.get("/categories/:categoryId/topics", topic_controller_1.getTopicsByCategory);
router.get("/subcategories/:subCategoryId/topics", topic_controller_1.getTopicsBySubCategory);
router.get("/languages/:languageId/topics", topic_controller_1.getTopicsByLanguage);
// User routes
router.post("/topics", auth_1.isAuthenticated, multer_1.singleUpload, topic_controller_1.createTopic);
router.put("/topics/:id", auth_1.isAuthenticated, multer_1.singleUpload, topic_controller_1.updateTopic);
router.delete("/topics/:id", auth_1.isAuthenticated, topic_controller_1.deleteTopic);
// Content management routes
router.post("/topics/:topicId/contents", auth_1.isAuthenticated, topic_controller_1.addTopicContent);
router.put("/topics/contents/:contentId", auth_1.isAuthenticated, topic_controller_1.updateTopicContent);
router.delete("/topics/contents/:contentId", auth_1.isAuthenticated, topic_controller_1.deleteTopicContent);
// Admin routes
router.get("/admin/topics", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), topic_controller_1.getAdminTopics);
exports.default = router;
