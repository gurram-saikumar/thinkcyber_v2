"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/categories", category_controller_1.getAllCategories);
router.get("/categories/:id", category_controller_1.getCategory);
// Admin-only routes
router.post("/admin/categories", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), category_controller_1.createCategory);
router.put("/admin/categories/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), category_controller_1.updateCategory);
router.delete("/admin/categories/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), category_controller_1.deleteCategory);
exports.default = router;
