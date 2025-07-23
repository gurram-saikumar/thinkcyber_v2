import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/sequelize/category.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';

// Create category
export const createCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description } = req.body;

            // Check if title is provided
            if (!title) {
                return next(new ErrorHandler('Category title is required', 400));
            }

            // Check if category already exists
            const existingCategory = await Category.findOne({
                where: { title: title.toLowerCase() }
            });

            if (existingCategory) {
                return next(new ErrorHandler('Category already exists', 400));
            }

            // Create new category
            const category = await Category.create({
                title: title.toLowerCase(),
                description: description || ''
            });

            res.status(201).json({
                success: true,
                category
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all categories
export const getAllCategories = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Category.findAll({
                order: [['title', 'ASC']]
            });

            res.status(200).json({
                success: true,
                categories
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get single category
export const getCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            // Convert id to number if it's a string
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            
            console.log("Getting category details:", {
                id: idNum,
                originalType: typeof id
            });
            
            const category = await Category.findByPk(idNum, {
                include: ['subcategories', 'topics']
            });

            if (!category) {
                return next(new ErrorHandler(`Category not found with ID ${idNum}`, 404));
            }

            res.status(200).json({
                success: true,
                category
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Update category
export const updateCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { title, description, status } = req.body;

            // Convert id to number if it's a string
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            
            console.log("Updating category:", {
                id: idNum,
                title,
                originalType: typeof id
            });
            
            const category = await Category.findByPk(idNum);

            if (!category) {
                return next(new ErrorHandler(`Category not found with ID ${idNum}`, 404));
            }

            // Check if title already exists (if title is being changed)
            if (title && title !== category.title) {
                const existingCategory = await Category.findOne({
                    where: { title: title.toLowerCase() }
                });

                if (existingCategory) {
                    return next(new ErrorHandler('Category with this title already exists', 400));
                }
            }

            // Update category
            if (title) category.title = title.toLowerCase();
            if (description !== undefined) category.description = description;
            if (status) category.status = status;

            await category.save();

            res.status(200).json({
                success: true,
                category
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete category
export const deleteCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            // Convert id to number if it's a string
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            
            console.log("Deleting category:", {
                id: idNum,
                originalType: typeof id
            });
            
            const category = await Category.findByPk(idNum);

            if (!category) {
                return next(new ErrorHandler(`Category not found with ID ${idNum}`, 404));
            }

            await category.destroy();

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
