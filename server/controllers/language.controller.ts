import { Request, Response, NextFunction } from 'express';
import { Language } from '../models/sequelize/language.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';

// Create language
export const createLanguage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, code, isDefault } = req.body;

            // Check if required fields are provided
            if (!name || !code) {
                return next(new ErrorHandler('Name and code are required', 400));
            }

            // Check if language name already exists
            const existingLanguageByName = await Language.findOne({
                where: { name: name.toLowerCase() }
            });

            if (existingLanguageByName) {
                return next(new ErrorHandler('Language with this name already exists', 400));
            }

            // Check if language code already exists
            const existingLanguageByCode = await Language.findOne({
                where: { code: code.toLowerCase() }
            });

            if (existingLanguageByCode) {
                return next(new ErrorHandler('Language with this code already exists', 400));
            }

            // Create new language
            const language = await Language.create({
                name: name.toLowerCase(),
                code: code.toLowerCase(),
                isDefault: isDefault || false,
                status: 'active'
            });

            res.status(201).json({
                success: true,
                language
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get all languages
export const getAllLanguages = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const languages = await Language.findAll({
                order: [
                    ['isDefault', 'DESC'],
                    ['name', 'ASC']
                ]
            });

            res.status(200).json({
                success: true,
                languages
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Get single language
export const getLanguage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            const language = await Language.findByPk(id);

            if (!language) {
                return next(new ErrorHandler('Language not found', 404));
            }

            res.status(200).json({
                success: true,
                language
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Update language
export const updateLanguage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name, code, isDefault, status } = req.body;

            const language = await Language.findByPk(id);

            if (!language) {
                return next(new ErrorHandler('Language not found', 404));
            }

            // Check if name is being changed and if it already exists
            if (name && name !== language.name) {
                const existingLanguage = await Language.findOne({
                    where: { name: name.toLowerCase() }
                });

                if (existingLanguage) {
                    return next(new ErrorHandler('Language with this name already exists', 400));
                }
            }

            // Check if code is being changed and if it already exists
            if (code && code !== language.code) {
                const existingLanguage = await Language.findOne({
                    where: { code: code.toLowerCase() }
                });

                if (existingLanguage) {
                    return next(new ErrorHandler('Language with this code already exists', 400));
                }
            }

            // Update language
            if (name) language.name = name.toLowerCase();
            if (code) language.code = code.toLowerCase();
            if (isDefault !== undefined) language.isDefault = isDefault;
            if (status) language.status = status;

            await language.save();

            res.status(200).json({
                success: true,
                language
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete language
export const deleteLanguage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            const language = await Language.findByPk(id);

            if (!language) {
                return next(new ErrorHandler('Language not found', 404));
            }

            // Check if this is the default language
            if (language.isDefault) {
                return next(new ErrorHandler('Cannot delete the default language', 400));
            }

            await language.destroy();

            res.status(200).json({
                success: true,
                message: 'Language deleted successfully'
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Set default language
export const setDefaultLanguage = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            
            const language = await Language.findByPk(id);

            if (!language) {
                return next(new ErrorHandler('Language not found', 404));
            }

            // Reset all default flags
            await Language.update(
                { isDefault: false },
                { where: {} }
            );

            // Set this language as default
            language.isDefault = true;
            await language.save();

            res.status(200).json({
                success: true,
                message: `${language.name} is now the default language`,
                language
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
