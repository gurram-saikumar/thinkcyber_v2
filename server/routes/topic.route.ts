import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { 
    createTopic, 
    getAllTopics, 
    getSingleTopic, 
    updateTopic, 
    deleteTopic,
    getAdminTopics,
    getTopicsByCategory,
    getTopicsBySubCategory,
    getTopicsByLanguage,
    addTopicContent,
    updateTopicContent,
    deleteTopicContent
} from "../controllers/topic.controller";
import { singleUpload } from "../middleware/multer";

const router = express.Router();

// Public routes
router.get("/topics", getAllTopics);
router.get("/topics/:id", getSingleTopic);
router.get("/categories/:categoryId/topics", getTopicsByCategory);
router.get("/subcategories/:subCategoryId/topics", getTopicsBySubCategory);
router.get("/languages/:languageId/topics", getTopicsByLanguage);

// User routes
router.post(
    "/topics", 
    isAuthenticated,
    singleUpload,
    createTopic
);

router.put(
    "/topics/:id", 
    isAuthenticated,
    singleUpload,
    updateTopic
);

router.delete(
    "/topics/:id", 
    isAuthenticated,
    deleteTopic
);

// Content management routes
router.post(
    "/topics/:topicId/contents",
    isAuthenticated,
    addTopicContent
);

router.put(
    "/topics/contents/:contentId",
    isAuthenticated,
    updateTopicContent
);

router.delete(
    "/topics/contents/:contentId",
    isAuthenticated,
    deleteTopicContent
);

// Admin routes
router.get(
    "/admin/topics",
    isAuthenticated,
    authorizeRoles("admin"),
    getAdminTopics
);

export default router;
