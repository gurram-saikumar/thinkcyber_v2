"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addQuestionReply = exports.addQuestion = exports.getTopicContent = exports.getTopicContents = void 0;
const topic_content_model_1 = require("../models/topic-content.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
// Get all content for a topic
exports.getTopicContents = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const contents = await topic_content_model_1.TopicContent.findAll({
            where: {
                topicId,
                isActive: true
            },
            order: [['position', 'ASC']],
        });
        res.status(200).json({
            success: true,
            contents,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get a single content item
exports.getTopicContent = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const content = await topic_content_model_1.TopicContent.findOne({
            where: {
                id: contentId,
                isActive: true
            }
        });
        if (!content) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Add a question to content
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const { question } = req.body;
        const userId = req.user.id;
        if (!question) {
            return next(new ErrorHandler_1.default("Question is required", 400));
        }
        const content = await topic_content_model_1.TopicContent.findOne({
            where: {
                id: contentId,
                isActive: true
            }
        });
        if (!content) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        // Get existing questions
        const questions = content.questions || [];
        // Add new question
        questions.push({
            user: userId,
            question,
            questionReplies: [],
        });
        content.questions = questions;
        await content.save();
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Add a reply to a question
exports.addQuestionReply = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { contentId, questionId } = req.params;
        const { reply } = req.body;
        const userId = req.user.id;
        if (!reply) {
            return next(new ErrorHandler_1.default("Reply is required", 400));
        }
        const content = await topic_content_model_1.TopicContent.findOne({
            where: {
                id: contentId,
                isActive: true
            }
        });
        if (!content) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        // Get existing questions
        const questions = content.questions || [];
        // Find the question
        const questionIndex = questions.findIndex(q => q.user.toString() === questionId);
        if (questionIndex === -1) {
            return next(new ErrorHandler_1.default("Question not found", 404));
        }
        // Add reply to question
        questions[questionIndex].questionReplies.push({
            user: userId,
            reply,
        });
        content.questions = questions;
        await content.save();
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
