"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/sequelize/category.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Create category
exports.createCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { title, description } = req.body;
        // Check if title is provided
        if (!title) {
            return next(new ErrorHandler_1.default('Category title is required', 400));
        }
        // Check if category already exists
        const existingCategory = await category_model_1.Category.findOne({
            where: { title: title.toLowerCase() }
        });
        if (existingCategory) {
            return next(new ErrorHandler_1.default('Category already exists', 400));
        }
        // Create new category
        const category = await category_model_1.Category.create({
            title: title.toLowerCase(),
            description: description || ''
        });
        res.status(201).json({
            success: true,
            category
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all categories
exports.getAllCategories = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const categories = await category_model_1.Category.findAll({
            order: [['title', 'ASC']]
        });
        res.status(200).json({
            success: true,
            categories
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get single category
exports.getCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.Category.findByPk(id, {
            include: ['subcategories', 'topics']
        });
        if (!category) {
            return next(new ErrorHandler_1.default('Category not found', 404));
        }
        res.status(200).json({
            success: true,
            category
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update category
exports.updateCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const category = await category_model_1.Category.findByPk(id);
        if (!category) {
            return next(new ErrorHandler_1.default('Category not found', 404));
        }
        // Check if title already exists (if title is being changed)
        if (title && title !== category.title) {
            const existingCategory = await category_model_1.Category.findOne({
                where: { title: title.toLowerCase() }
            });
            if (existingCategory) {
                return next(new ErrorHandler_1.default('Category with this title already exists', 400));
            }
        }
        // Update category
        if (title)
            category.title = title.toLowerCase();
        if (description !== undefined)
            category.description = description;
        if (status)
            category.status = status;
        await category.save();
        res.status(200).json({
            success: true,
            category
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete category
exports.deleteCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.Category.findByPk(id);
        if (!category) {
            return next(new ErrorHandler_1.default('Category not found', 404));
        }
        await category.destroy();
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
