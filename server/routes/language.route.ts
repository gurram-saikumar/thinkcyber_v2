import express from "express";
import { 
    createLanguage, 
    getAllLanguages, 
    getLanguage, 
    updateLanguage, 
    deleteLanguage 
} from "../controllers/language.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/languages", getAllLanguages);
router.get("/languages/:id", getLanguage);

// Admin-only routes
router.post(
    "/admin/languages", 
    isAuthenticated,
    authorizeRoles("admin"),
    createLanguage
);

router.put(
    "/admin/languages/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    updateLanguage
);

router.delete(
    "/admin/languages/:id", 
    isAuthenticated,
    authorizeRoles("admin"),
    deleteLanguage
);

export default router;
