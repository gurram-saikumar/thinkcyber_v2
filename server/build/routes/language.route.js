"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const language_controller_1 = require("../controllers/language.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/languages", language_controller_1.getAllLanguages);
router.get("/languages/:id", language_controller_1.getLanguage);
// Admin-only routes
router.post("/admin/languages", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), language_controller_1.createLanguage);
router.put("/admin/languages/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), language_controller_1.updateLanguage);
router.delete("/admin/languages/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), language_controller_1.deleteLanguage);
exports.default = router;
