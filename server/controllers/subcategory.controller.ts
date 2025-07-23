import { Request, Response, NextFunction } from 'express';
import { SubCategory } from '../models/sequelize/subcategory.model';
import { Category } from '../models/sequelize/category.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';

// Create subcategory
export const createSubCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, categoryId, description } = req.body;

            // Debug log to see what's being sent to the server
            console.log("Creating subcategory with:", { 
                title, 
                categoryId, 
                description,
                categoryIdType: typeof categoryId 
            });

            // Check if required fields are provided
            if (!title || !categoryId) {
                return next(new ErrorHandler('Title and category ID are required', 400));
            }

            // Convert categoryId to number if it's a string
            const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;

            // Check if category exists
            const category = await Category.findByPk(categoryIdNum);
            if (!category) {
                // Additional debug info if category not found
                console.log(`Category not found with ID ${categoryIdNum} (original: ${categoryId})`);
                
                // List all categories to debug
                const allCategories = await Category.findAll({
                    attributes: ['id', 'title']
                });
                console.log("Available categories:", allCategories.map(c => ({ id: c.id, title: c.title })));
                
                return next(new ErrorHandler(`Category not found with ID ${categoryIdNum}`, 404));
            }

            // Check if subcategory already exists in this category
            const existingSubcategory = await SubCategory.findOne({
                where: {
                    title: title.toLowerCase(),
                    categoryId: categoryIdNum
                }
            });

            if (existingSubcategory) {
                return next(new ErrorHandler('Subcategory already exists in this category', 400));
            }

            // Create new subcategory
            const subcategory = await SubCategory.create({
                title: title.toLowerCase(),
                categoryId: categoryIdNum,
                description: description || '',
                status: 'active'
            });

            console.log("Subcategory created successfully:", {
                id: subcategory.id,
                title: subcategory.title,
                categoryId: subcategory.categoryId
            });

            res.status(201).json({
                success: true,
                subcategory
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all subcategories
export const getAllSubCategories = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Fetching all subcategories with associated categories...");
            const subcategories = await SubCategory.findAll({
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'title']
                    }
                ],
                order: [['title', 'ASC']]
            });

            console.log("Fetched subcategories:", subcategories);

            res.status(200).json({
                success: true,
                subcategories
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get subcategories by category
export const getSubCategoriesByCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { categoryId } = req.params;
            
            // Convert categoryId to number if it's a string
            const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
            
            console.log("Getting subcategories for category:", {
                categoryId: categoryIdNum,
                originalType: typeof categoryId
            });
            
            // Check if category exists
            const category = await Category.findByPk(categoryIdNum);
            if (!category) {
                console.log("Available categories:", await Category.findAll({ attributes: ['id', 'title'] }));
                return next(new ErrorHandler(`Category not found with ID ${categoryIdNum}`, 404));
            }
            
            const subcategories = await SubCategory.findAll({
                where: { categoryId: categoryIdNum },
                order: [['title', 'ASC']]
            });

            res.status(200).json({
                success: true,
                subcategories
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get single subcategory
export const getSubCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            // Convert id to number if it's a string
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            
            console.log("Getting subcategory details:", {
                id: idNum,
                originalType: typeof id
            });
            
            const subcategory = await SubCategory.findByPk(idNum, {
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'title']
                    },
                    'topics'
                ]
            });

            if (!subcategory) {
                return next(new ErrorHandler(`Subcategory not found with ID ${idNum}`, 404));
            }

            res.status(200).json({
                success: true,
                subcategory
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Update subcategory
export const updateSubCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { title, categoryId, description, status } = req.body;

            // Convert id and categoryId to numbers if they're strings
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;

            console.log("Updating subcategory:", {
                id: idNum,
                title,
                categoryId: categoryIdNum,
                originalTypeId: typeof id,
                originalTypeCategoryId: typeof categoryId
            });

            const subcategory = await SubCategory.findByPk(idNum);

            if (!subcategory) {
                return next(new ErrorHandler(`Subcategory not found with ID ${idNum}`, 404));
            }

            // If category is being changed, check if it exists
            if (categoryIdNum && categoryIdNum !== subcategory.categoryId) {
                const category = await Category.findByPk(categoryIdNum);
                if (!category) {
                    console.log("Available categories:", await Category.findAll({ attributes: ['id', 'title'] }));
                    return next(new ErrorHandler(`New category with ID ${categoryIdNum} not found`, 404));
                }
                
                // Check if subcategory title already exists in the new category
                if (title || subcategory.title) {
                    const existingSubcategory = await SubCategory.findOne({
                        where: {
                            title: (title || subcategory.title).toLowerCase(),
                            categoryId: categoryIdNum
                        }
                    });

                    if (existingSubcategory) {
                        return next(new ErrorHandler('Subcategory already exists in the target category', 400));
                    }
                }
            }

            // Check for duplicate title in the same category (if title is being changed)
            if (title && title !== subcategory.title) {
                const existingSubcategory = await SubCategory.findOne({
                    where: {
                        title: title.toLowerCase(),
                        categoryId: categoryIdNum || subcategory.categoryId
                    }
                });

                if (existingSubcategory) {
                    return next(new ErrorHandler('Subcategory with this title already exists in this category', 400));
                }
            }

            // Update subcategory
            if (title) subcategory.title = title.toLowerCase();
            if (categoryIdNum) subcategory.categoryId = categoryIdNum;
            if (description !== undefined) subcategory.description = description;
            if (status) subcategory.status = status;

            await subcategory.save();

            res.status(200).json({
                success: true,
                subcategory
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete subcategory
export const deleteSubCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            // Convert id to number if it's a string
            const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
            
            console.log("Deleting subcategory:", {
                id: idNum,
                originalTypeId: typeof id
            });
            
            const subcategory = await SubCategory.findByPk(idNum);

            if (!subcategory) {
                return next(new ErrorHandler(`Subcategory not found with ID ${idNum}`, 404));
            }

            await subcategory.destroy();

            res.status(200).json({
                success: true,
                message: 'Subcategory deleted successfully'
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
