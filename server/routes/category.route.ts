import express from "express";
import { 
    createCategory, 
    getAllCategories, 
    getCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/category.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategory);

// Admin-only routes
router.post(
    "/admin/categories", 
    isAuthenticated,
    authorizeRoles("admin"),
    createCategory
);

router.put(
    "/admin/categories/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    updateCategory
);

router.delete(
    "/admin/categories/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCategory
);

export default router;
