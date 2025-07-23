import { Request, Response, NextFunction } from 'express';
import { TopicContent } from '../models/topic-content.model';
import { Topic } from '../models/topic.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';

// Get all content for a topic
export const getTopicContents = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { topicId } = req.params;
        
        const contents = await TopicContent.findAll({
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get a single content item
export const getTopicContent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId } = req.params;
        
        const content = await TopicContent.findOne({
            where: { 
                id: contentId,
                isActive: true 
            }
        });

        if (!content) {
            return next(new ErrorHandler("Content not found", 404));
        }

        res.status(200).json({
            success: true,
            content,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add a question to content
export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId } = req.params;
        const { question } = req.body;
        const userId = req.user.id;

        if (!question) {
            return next(new ErrorHandler("Question is required", 400));
        }

        const content = await TopicContent.findOne({
            where: { 
                id: contentId,
                isActive: true 
            }
        });

        if (!content) {
            return next(new ErrorHandler("Content not found", 404));
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add a reply to a question
export const addQuestionReply = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId, questionId } = req.params;
        const { reply } = req.body;
        const userId = req.user.id;

        if (!reply) {
            return next(new ErrorHandler("Reply is required", 400));
        }

        const content = await TopicContent.findOne({
            where: { 
                id: contentId,
                isActive: true 
            }
        });

        if (!content) {
            return next(new ErrorHandler("Content not found", 404));
        }

        // Get existing questions
        const questions = content.questions || [];

        // Find the question
        const questionIndex = questions.findIndex(q => q.user.toString() === questionId);

        if (questionIndex === -1) {
            return next(new ErrorHandler("Question not found", 404));
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
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
