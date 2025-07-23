"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategory_controller_1 = require("../controllers/subcategory.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/subcategories", subcategory_controller_1.getAllSubCategories);
router.get("/subcategories/:id", subcategory_controller_1.getSubCategory);
router.get("/categories/:categoryId/subcategories", subcategory_controller_1.getSubCategoriesByCategory);
// Admin-only routes
router.post("/admin/subcategories", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), subcategory_controller_1.createSubCategory);
router.put("/admin/subcategories/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), subcategory_controller_1.updateSubCategory);
router.delete("/admin/subcategories/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), subcategory_controller_1.deleteSubCategory);
exports.default = router;
