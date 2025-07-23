import { Request, Response, NextFunction } from 'express';
import { Topic } from '../models/topic.model';
import { TopicContent } from '../models/topic-content.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import cloudinary from 'cloudinary';
import { redis } from '../utils/redis';
import { sequelize } from '../utils/database';
import fs from 'fs';

// Extend Express Request type to include file
interface MulterRequest extends Request {
    file: Express.Multer.File;
}

// Create a new topic
export const createTopic = CatchAsyncError(async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const { 
            name, 
            description, 
            price, 
            estimatedPrice,
            tags, 
            level,
            demoUrl,
            benefits,
            prerequisites,
            categoryId,
            subCategoryId,
            languageId,
            instructions 
        } = req.body;
        
        const thumbnail = req.file;

        // Validate required fields
        if (!name || !description || !price || !level) {
            return next(new ErrorHandler("Please provide all required fields", 400));
        }

        if (!thumbnail) {
            return next(new ErrorHandler("Please upload a thumbnail", 400));
        }

        const userId = req.user.id;

        // Upload thumbnail to cloudinary
        const uploadedThumbnail = await cloudinary.v2.uploader.upload(thumbnail.path, {
            folder: 'topics',
        });

        const topic = await Topic.create({
            name,
            description,
            price,
            estimatedPrice: estimatedPrice || price,
            thumbnail: {
                public_id: uploadedThumbnail.public_id,
                url: uploadedThumbnail.secure_url,
            },
            tags: tags || [],
            level,
            demoUrl,
            benefits: benefits || [],
            prerequisites: prerequisites || [],
            categoryId,
            subCategoryId,
            languageId,
            userId,
            instructions: instructions || [],
        });

        res.status(201).json({
            success: true,
            topic,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all topics
export const getAllTopics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isAdmin = req.user?.role === "admin";

        // If cache exists, return from cache
        const cacheKey = `allTopics-${isAdmin ? 'admin' : 'user'}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Define where clause based on user role
        const whereClause = isAdmin ? {} : { isActive: true };

        const topics = await Topic.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });

        // Cache the result for 5 minutes
        await redis.set(cacheKey, JSON.stringify({
            success: true,
            topics,
        }), 'EX', 300);

        res.status(200).json({
            success: true,
            topics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get a single topic with all its content
export const getSingleTopic = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        // If cache exists, return from cache
        const cacheKey = `topic-${id}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const topic = await Topic.findOne({
            where: { id, status: 'published' },
            include: [
                {
                    model: TopicContent,
                    as: 'contents',
                    where: { isActive: true },
                    order: [['position', 'ASC']],
                    required: false,
                },
            ],
        });

        if (!topic) {
            return next(new ErrorHandler("Topic not found", 404));
        }

        // Cache the result for 5 minutes
        await redis.set(cacheKey, JSON.stringify({
            success: true,
            topic,
        }), 'EX', 300);

        res.status(200).json({
            success: true,
            topic,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get topics by category
export const getTopicsByCategory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        
        // Convert categoryId to number if it's a string
        const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
        
        console.log("Getting topics for category:", {
            categoryId: categoryIdNum,
            originalType: typeof categoryId
        });
        
        const topics = await Topic.findAll({
            where: { 
                categoryId: categoryIdNum,
                status: 'published',
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            topics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get topics by subcategory
export const getTopicsBySubCategory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subCategoryId } = req.params;
        
        // Convert subCategoryId to number if it's a string
        const subCategoryIdNum = typeof subCategoryId === 'string' ? parseInt(subCategoryId, 10) : subCategoryId;
        
        console.log("Getting topics for subcategory:", {
            subCategoryId: subCategoryIdNum,
            originalType: typeof subCategoryId
        });
        
        const topics = await Topic.findAll({
            where: { 
                subcategoryId: subCategoryIdNum,
                status: 'published',
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            topics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get topics by language
export const getTopicsByLanguage = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { languageId } = req.params;
        
        const topics = await Topic.findAll({
            where: { 
                languageId,
                status: 'published',
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            topics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update a topic
export const updateTopic = CatchAsyncError(async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            description, 
            price, 
            estimatedPrice,
            tags, 
            level,
            demoUrl,
            benefits,
            prerequisites,
            categoryId,
            subCategoryId,
            languageId,
            instructions,
            status 
        } = req.body;
        
        // Convert id to number if it's a string
        const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
        // Convert categoryId to number if provided and is a string
        const categoryIdNum = categoryId && typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
        // Convert subCategoryId to number if provided and is a string
        const subCategoryIdNum = subCategoryId && typeof subCategoryId === 'string' ? parseInt(subCategoryId, 10) : subCategoryId;
        
        console.log("Updating topic:", {
            id: idNum,
            categoryId: categoryIdNum,
            subCategoryId: subCategoryIdNum,
            originalTypes: {
                id: typeof id,
                categoryId: typeof categoryId,
                subCategoryId: typeof subCategoryId
            }
        });
        
        const thumbnail = req.file;

        const topic = await Topic.findByPk(idNum);

        if (!topic) {
            return next(new ErrorHandler(`Topic not found with ID ${idNum}`, 404));
        }

        // Check if user is allowed to update this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler("You are not authorized to update this topic", 403));
        }

        // Update fields if provided
        if (name) topic.name = name;
        if (description) topic.description = description;
        if (price) topic.price = price;
        if (estimatedPrice) topic.estimatedPrice = estimatedPrice;
        if (tags) topic.tags = tags;
        if (level) topic.level = level;
        if (demoUrl) topic.demoUrl = demoUrl;
        if (benefits) topic.benefits = benefits;
        if (prerequisites) topic.prerequisites = prerequisites;
        if (categoryIdNum) topic.categoryId = categoryIdNum;
        if (subCategoryIdNum) topic.subcategoryId = subCategoryIdNum;
        if (languageId) topic.languageId = languageId;
        if (status !== undefined) topic.status = status;

        // Update thumbnail if provided
        if (thumbnail) {
            // Delete old thumbnail
            if (topic.thumbnail && topic.thumbnail.public_id) {
                await cloudinary.v2.uploader.destroy(topic.thumbnail.public_id);
            }

            // Upload new thumbnail
            const uploadedThumbnail = await cloudinary.v2.uploader.upload(thumbnail.path, {
                folder: 'topics',
            });

            topic.thumbnail = {
                public_id: uploadedThumbnail.public_id,
                url: uploadedThumbnail.secure_url,
            };
        }

        await topic.save();

        // Clear cache
        await redis.del(`topic-${id}`);
        await redis.del('allTopics-admin');
        await redis.del('allTopics-user');

        res.status(200).json({
            success: true,
            topic,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete a topic
export const deleteTopic = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const topic = await Topic.findByPk(id);

        if (!topic) {
            return next(new ErrorHandler("Topic not found", 404));
        }

        // Check if user is allowed to delete this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler("You are not authorized to delete this topic", 403));
        }

        // Start a transaction for consistent deletion
        const transaction = await sequelize.transaction();

        try {
            // Soft delete by setting status to draft
            topic.status = 'draft';
            await topic.save({ transaction });

            // Also mark all content as inactive (assuming TopicContent has isActive)
            await TopicContent.update(
                { isActive: false },
                { 
                    where: { topicId: id },
                    transaction
                }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        // Delete thumbnail from cloudinary
        if (topic.thumbnail && topic.thumbnail.public_id) {
            await cloudinary.v2.uploader.destroy(topic.thumbnail.public_id);
        }

        // Clear cache
        await redis.del(`topic-${id}`);
        await redis.del('allTopics-admin');
        await redis.del('allTopics-user');

        res.status(200).json({
            success: true,
            message: "Topic deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all topics for admin dashboard
export const getAdminTopics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // If cache exists, return from cache
        const cacheKey = 'adminTopics';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const topics = await Topic.findAll({
            order: [['createdAt', 'DESC']],
        });

        // Cache the result for 5 minutes
        await redis.set(cacheKey, JSON.stringify({
            success: true,
            topics,
        }), 'EX', 300);

        res.status(200).json({
            success: true,
            topics,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Add content to topic
export const addTopicContent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { topicId } = req.params;
        const { 
            title, 
            description, 
            videoUrl, 
            videoThumbnail,
            videoSection,
            videoLength,
            videoPlayer,
            links,
            suggestion,
            position
        } = req.body;

        // Convert topicId to number if it's a string
        const topicIdNum = typeof topicId === 'string' ? parseInt(topicId, 10) : topicId;
        
        console.log("Adding content to topic:", {
            topicId: topicIdNum,
            originalType: typeof topicId
        });

        // Validate required fields
        if (!title || !description || !videoUrl) {
            return next(new ErrorHandler("Please provide all required fields", 400));
        }

        // Find the topic
        const topic = await Topic.findByPk(topicIdNum);

        if (!topic) {
            return next(new ErrorHandler(`Topic not found with ID ${topicIdNum}`, 404));
        }

        // Check if user is allowed to add content to this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler("You are not authorized to add content to this topic", 403));
        }

        // Get max position if not provided
        let contentPosition = position;
        if (!contentPosition) {
            const maxPositionContent = await TopicContent.findOne({
                where: { topicId: topicIdNum },
                order: [['position', 'DESC']],
            });
            contentPosition = maxPositionContent ? maxPositionContent.position + 1 : 1;
        }

        // Create the content
        const content = await TopicContent.create({
            topicId: topicIdNum,
            title,
            description,
            videoUrl,
            videoThumbnail,
            videoSection,
            videoLength,
            videoPlayer,
            links: links || [],
            suggestion,
            position: contentPosition,
        });

        // Clear cache
        await redis.del(`topic-${topicIdNum}`);

        res.status(201).json({
            success: true,
            content,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update topic content
export const updateTopicContent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId } = req.params;
        const { 
            title, 
            description, 
            videoUrl, 
            videoThumbnail,
            videoSection,
            videoLength,
            videoPlayer,
            links,
            suggestion,
            position,
            isActive
        } = req.body;

        // Find the content
        const content = await TopicContent.findByPk(contentId);

        if (!content) {
            return next(new ErrorHandler("Content not found", 404));
        }

        // Find the topic to check authorization
        const topic = await Topic.findByPk(content.topicId);

        if (!topic) {
            return next(new ErrorHandler("Topic not found", 404));
        }

        // Check if user is allowed to update this content
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler("You are not authorized to update this content", 403));
        }

        // Update fields if provided
        if (title) content.title = title;
        if (description) content.description = description;
        if (videoUrl) content.videoUrl = videoUrl;
        if (videoThumbnail) content.videoThumbnail = videoThumbnail;
        if (videoSection) content.videoSection = videoSection;
        if (videoLength) content.videoLength = videoLength;
        if (videoPlayer) content.videoPlayer = videoPlayer;
        if (links) content.links = links;
        if (suggestion) content.suggestion = suggestion;
        if (position) content.position = position;
        if (isActive !== undefined) content.isActive = isActive;

        await content.save();

        // Clear cache
        await redis.del(`topic-${content.topicId}`);

        res.status(200).json({
            success: true,
            content,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete topic content
export const deleteTopicContent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contentId } = req.params;

        // Find the content
        const content = await TopicContent.findByPk(contentId);

        if (!content) {
            return next(new ErrorHandler("Content not found", 404));
        }

        // Find the topic to check authorization
        const topic = await Topic.findByPk(content.topicId);

        if (!topic) {
            return next(new ErrorHandler("Topic not found", 404));
        }

        // Check if user is allowed to delete this content
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler("You are not authorized to delete this content", 403));
        }

        // Soft delete by setting isActive to false
        content.isActive = false;
        await content.save();

        // Clear cache
        await redis.del(`topic-${content.topicId}`);

        res.status(200).json({
            success: true,
            message: "Content deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
