"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.updateSubCategory = exports.getSubCategory = exports.getSubCategoriesByCategory = exports.getAllSubCategories = exports.createSubCategory = void 0;
const subcategory_model_1 = require("../models/sequelize/subcategory.model");
const category_model_1 = require("../models/sequelize/category.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Create subcategory
exports.createSubCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { title, categoryId, description } = req.body;
        // Check if required fields are provided
        if (!title || !categoryId) {
            return next(new ErrorHandler_1.default('Title and category ID are required', 400));
        }
        // Check if category exists
        const category = await category_model_1.Category.findByPk(categoryId);
        if (!category) {
            return next(new ErrorHandler_1.default('Category not found', 404));
        }
        // Check if subcategory already exists in this category
        const existingSubcategory = await subcategory_model_1.SubCategory.findOne({
            where: {
                title: title.toLowerCase(),
                categoryId
            }
        });
        if (existingSubcategory) {
            return next(new ErrorHandler_1.default('Subcategory already exists in this category', 400));
        }
        // Create new subcategory
        const subcategory = await subcategory_model_1.SubCategory.create({
            title: title.toLowerCase(),
            categoryId,
            description: description || '',
            status: 'active'
        });
        res.status(201).json({
            success: true,
            subcategory
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all subcategories
exports.getAllSubCategories = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const subcategories = await subcategory_model_1.SubCategory.findAll({
            include: [
                {
                    model: category_model_1.Category,
                    as: 'category',
                    attributes: ['id', 'title']
                }
            ],
            order: [['title', 'ASC']]
        });
        res.status(200).json({
            success: true,
            subcategories
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get subcategories by category
exports.getSubCategoriesByCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        // Check if category exists
        const category = await category_model_1.Category.findByPk(categoryId);
        if (!category) {
            return next(new ErrorHandler_1.default('Category not found', 404));
        }
        const subcategories = await subcategory_model_1.SubCategory.findAll({
            where: { categoryId },
            order: [['title', 'ASC']]
        });
        res.status(200).json({
            success: true,
            subcategories
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get single subcategory
exports.getSubCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const subcategory = await subcategory_model_1.SubCategory.findByPk(id, {
            include: [
                {
                    model: category_model_1.Category,
                    as: 'category',
                    attributes: ['id', 'title']
                },
                'topics'
            ]
        });
        if (!subcategory) {
            return next(new ErrorHandler_1.default('Subcategory not found', 404));
        }
        res.status(200).json({
            success: true,
            subcategory
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update subcategory
exports.updateSubCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, categoryId, description, status } = req.body;
        const subcategory = await subcategory_model_1.SubCategory.findByPk(id);
        if (!subcategory) {
            return next(new ErrorHandler_1.default('Subcategory not found', 404));
        }
        // If category is being changed, check if it exists
        if (categoryId && categoryId !== subcategory.categoryId) {
            const category = await category_model_1.Category.findByPk(categoryId);
            if (!category) {
                return next(new ErrorHandler_1.default('New category not found', 404));
            }
            // Check if subcategory title already exists in the new category
            if (title || subcategory.title) {
                const existingSubcategory = await subcategory_model_1.SubCategory.findOne({
                    where: {
                        title: (title || subcategory.title).toLowerCase(),
                        categoryId
                    }
                });
                if (existingSubcategory) {
                    return next(new ErrorHandler_1.default('Subcategory already exists in the target category', 400));
                }
            }
        }
        // Check for duplicate title in the same category (if title is being changed)
        if (title && title !== subcategory.title) {
            const existingSubcategory = await subcategory_model_1.SubCategory.findOne({
                where: {
                    title: title.toLowerCase(),
                    categoryId: categoryId || subcategory.categoryId
                }
            });
            if (existingSubcategory) {
                return next(new ErrorHandler_1.default('Subcategory with this title already exists in this category', 400));
            }
        }
        // Update subcategory
        if (title)
            subcategory.title = title.toLowerCase();
        if (categoryId)
            subcategory.categoryId = categoryId;
        if (description !== undefined)
            subcategory.description = description;
        if (status)
            subcategory.status = status;
        await subcategory.save();
        res.status(200).json({
            success: true,
            subcategory
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete subcategory
exports.deleteSubCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const subcategory = await subcategory_model_1.SubCategory.findByPk(id);
        if (!subcategory) {
            return next(new ErrorHandler_1.default('Subcategory not found', 404));
        }
        await subcategory.destroy();
        res.status(200).json({
            success: true,
            message: 'Subcategory deleted successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
