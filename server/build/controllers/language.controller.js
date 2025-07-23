"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultLanguage = exports.deleteLanguage = exports.updateLanguage = exports.getLanguage = exports.getAllLanguages = exports.createLanguage = void 0;
const language_model_1 = require("../models/sequelize/language.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Create language
exports.createLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, code, isDefault } = req.body;
        // Check if required fields are provided
        if (!name || !code) {
            return next(new ErrorHandler_1.default('Name and code are required', 400));
        }
        // Check if language name already exists
        const existingLanguageByName = await language_model_1.Language.findOne({
            where: { name: name.toLowerCase() }
        });
        if (existingLanguageByName) {
            return next(new ErrorHandler_1.default('Language with this name already exists', 400));
        }
        // Check if language code already exists
        const existingLanguageByCode = await language_model_1.Language.findOne({
            where: { code: code.toLowerCase() }
        });
        if (existingLanguageByCode) {
            return next(new ErrorHandler_1.default('Language with this code already exists', 400));
        }
        // Create new language
        const language = await language_model_1.Language.create({
            name: name.toLowerCase(),
            code: code.toLowerCase(),
            isDefault: isDefault || false,
            status: 'active'
        });
        res.status(201).json({
            success: true,
            language
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all languages
exports.getAllLanguages = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const languages = await language_model_1.Language.findAll({
            order: [
                ['isDefault', 'DESC'],
                ['name', 'ASC']
            ]
        });
        res.status(200).json({
            success: true,
            languages
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get single language
exports.getLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const language = await language_model_1.Language.findByPk(id);
        if (!language) {
            return next(new ErrorHandler_1.default('Language not found', 404));
        }
        res.status(200).json({
            success: true,
            language
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update language
exports.updateLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, code, isDefault, status } = req.body;
        const language = await language_model_1.Language.findByPk(id);
        if (!language) {
            return next(new ErrorHandler_1.default('Language not found', 404));
        }
        // Check if name is being changed and if it already exists
        if (name && name !== language.name) {
            const existingLanguage = await language_model_1.Language.findOne({
                where: { name: name.toLowerCase() }
            });
            if (existingLanguage) {
                return next(new ErrorHandler_1.default('Language with this name already exists', 400));
            }
        }
        // Check if code is being changed and if it already exists
        if (code && code !== language.code) {
            const existingLanguage = await language_model_1.Language.findOne({
                where: { code: code.toLowerCase() }
            });
            if (existingLanguage) {
                return next(new ErrorHandler_1.default('Language with this code already exists', 400));
            }
        }
        // Update language
        if (name)
            language.name = name.toLowerCase();
        if (code)
            language.code = code.toLowerCase();
        if (isDefault !== undefined)
            language.isDefault = isDefault;
        if (status)
            language.status = status;
        await language.save();
        res.status(200).json({
            success: true,
            language
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete language
exports.deleteLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const language = await language_model_1.Language.findByPk(id);
        if (!language) {
            return next(new ErrorHandler_1.default('Language not found', 404));
        }
        // Check if this is the default language
        if (language.isDefault) {
            return next(new ErrorHandler_1.default('Cannot delete the default language', 400));
        }
        await language.destroy();
        res.status(200).json({
            success: true,
            message: 'Language deleted successfully'
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Set default language
exports.setDefaultLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const language = await language_model_1.Language.findByPk(id);
        if (!language) {
            return next(new ErrorHandler_1.default('Language not found', 404));
        }
        // Reset all default flags
        await language_model_1.Language.update({ isDefault: false }, { where: {} });
        // Set this language as default
        language.isDefault = true;
        await language.save();
        res.status(200).json({
            success: true,
            message: `${language.name} is now the default language`,
            language
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
