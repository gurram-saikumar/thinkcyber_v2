import express from "express";
import { 
    createSubCategory, 
    getAllSubCategories, 
    getSubCategoriesByCategory, 
    getSubCategory, 
    updateSubCategory, 
    deleteSubCategory 
} from "../controllers/subcategory.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/subcategories", getAllSubCategories);
router.get("/subcategories/:id", getSubCategory);
router.get("/categories/:categoryId/subcategories", getSubCategoriesByCategory);

// Admin-only routes
router.post(
    "/admin/subcategories", 
    isAuthenticated,
    authorizeRoles("admin"),
    createSubCategory
);

router.put(
    "/admin/subcategories/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    updateSubCategory
);

router.delete(
    "/admin/subcategories/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    deleteSubCategory
);

export default router;
