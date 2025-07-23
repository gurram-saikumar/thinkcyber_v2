"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subcategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Please enter subcategory title"],
    },
    categoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Please select a parent category"],
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });
// Compound index to ensure unique subcategories within a category
subcategorySchema.index({ title: 1, categoryId: 1 }, { unique: true });
const SubCategory = mongoose_1.default.models.SubCategory || mongoose_1.default.model("SubCategory", subcategorySchema);
exports.default = SubCategory;
