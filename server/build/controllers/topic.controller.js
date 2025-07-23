"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopicContent = exports.updateTopicContent = exports.addTopicContent = exports.getAdminTopics = exports.deleteTopic = exports.updateTopic = exports.getTopicsByLanguage = exports.getTopicsBySubCategory = exports.getTopicsByCategory = exports.getSingleTopic = exports.getAllTopics = exports.createTopic = void 0;
const topic_model_1 = require("../models/topic.model");
const topic_content_model_1 = require("../models/topic-content.model");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../utils/redis");
const database_1 = require("../utils/database");
// Create a new topic
exports.createTopic = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, description, price, estimatedPrice, tags, level, demoUrl, benefits, prerequisites, categoryId, subCategoryId, languageId, instructions } = req.body;
        const thumbnail = req.file;
        // Validate required fields
        if (!name || !description || !price || !level) {
            return next(new ErrorHandler_1.default("Please provide all required fields", 400));
        }
        if (!thumbnail) {
            return next(new ErrorHandler_1.default("Please upload a thumbnail", 400));
        }
        const userId = req.user.id;
        // Upload thumbnail to cloudinary
        const uploadedThumbnail = await cloudinary_1.default.v2.uploader.upload(thumbnail.path, {
            folder: 'topics',
        });
        const topic = await topic_model_1.Topic.create({
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all topics
exports.getAllTopics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const isAdmin = req.user?.role === "admin";
        // If cache exists, return from cache
        const cacheKey = `allTopics-${isAdmin ? 'admin' : 'user'}`;
        const cachedData = await redis_1.redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        // Define where clause based on user role
        const whereClause = isAdmin ? {} : { isActive: true };
        const topics = await topic_model_1.Topic.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
        // Cache the result for 5 minutes
        await redis_1.redis.set(cacheKey, JSON.stringify({
            success: true,
            topics,
        }), 'EX', 300);
        res.status(200).json({
            success: true,
            topics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get a single topic with all its content
exports.getSingleTopic = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        // If cache exists, return from cache
        const cacheKey = `topic-${id}`;
        const cachedData = await redis_1.redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const topic = await topic_model_1.Topic.findOne({
            where: { id, isActive: true },
            include: [
                {
                    model: topic_content_model_1.TopicContent,
                    as: 'contents',
                    where: { isActive: true },
                    order: [['position', 'ASC']],
                    required: false,
                },
            ],
        });
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Cache the result for 5 minutes
        await redis_1.redis.set(cacheKey, JSON.stringify({
            success: true,
            topic,
        }), 'EX', 300);
        res.status(200).json({
            success: true,
            topic,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get topics by category
exports.getTopicsByCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const topics = await topic_model_1.Topic.findAll({
            where: {
                categoryId,
                isActive: true,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            topics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get topics by subcategory
exports.getTopicsBySubCategory = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { subCategoryId } = req.params;
        const topics = await topic_model_1.Topic.findAll({
            where: {
                subCategoryId,
                isActive: true,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            topics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get topics by language
exports.getTopicsByLanguage = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { languageId } = req.params;
        const topics = await topic_model_1.Topic.findAll({
            where: {
                languageId,
                isActive: true,
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            topics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update a topic
exports.updateTopic = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, estimatedPrice, tags, level, demoUrl, benefits, prerequisites, categoryId, subCategoryId, languageId, instructions, isActive } = req.body;
        const thumbnail = req.file;
        const topic = await topic_model_1.Topic.findByPk(id);
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Check if user is allowed to update this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to update this topic", 403));
        }
        // Update fields if provided
        if (name)
            topic.name = name;
        if (description)
            topic.description = description;
        if (price)
            topic.price = price;
        if (estimatedPrice)
            topic.estimatedPrice = estimatedPrice;
        if (tags)
            topic.tags = tags;
        if (level)
            topic.level = level;
        if (demoUrl)
            topic.demoUrl = demoUrl;
        if (benefits)
            topic.benefits = benefits;
        if (prerequisites)
            topic.prerequisites = prerequisites;
        if (categoryId)
            topic.categoryId = categoryId;
        if (subCategoryId)
            topic.subCategoryId = subCategoryId;
        if (languageId)
            topic.languageId = languageId;
        if (instructions)
            topic.instructions = instructions;
        if (isActive !== undefined)
            topic.isActive = isActive;
        // Update thumbnail if provided
        if (thumbnail) {
            // Delete old thumbnail
            if (topic.thumbnail && topic.thumbnail.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(topic.thumbnail.public_id);
            }
            // Upload new thumbnail
            const uploadedThumbnail = await cloudinary_1.default.v2.uploader.upload(thumbnail.path, {
                folder: 'topics',
            });
            topic.thumbnail = {
                public_id: uploadedThumbnail.public_id,
                url: uploadedThumbnail.secure_url,
            };
        }
        await topic.save();
        // Clear cache
        await redis_1.redis.del(`topic-${id}`);
        await redis_1.redis.del('allTopics-admin');
        await redis_1.redis.del('allTopics-user');
        res.status(200).json({
            success: true,
            topic,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete a topic
exports.deleteTopic = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const topic = await topic_model_1.Topic.findByPk(id);
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Check if user is allowed to delete this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to delete this topic", 403));
        }
        // Start a transaction for consistent deletion
        const transaction = await database_1.sequelize.transaction();
        try {
            // Soft delete by setting isActive to false
            topic.isActive = false;
            await topic.save({ transaction });
            // Also mark all content as inactive
            await topic_content_model_1.TopicContent.update({ isActive: false }, {
                where: { topicId: id },
                transaction
            });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
        // Delete thumbnail from cloudinary
        if (topic.thumbnail && topic.thumbnail.public_id) {
            await cloudinary_1.default.v2.uploader.destroy(topic.thumbnail.public_id);
        }
        // Clear cache
        await redis_1.redis.del(`topic-${id}`);
        await redis_1.redis.del('allTopics-admin');
        await redis_1.redis.del('allTopics-user');
        res.status(200).json({
            success: true,
            message: "Topic deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get all topics for admin dashboard
exports.getAdminTopics = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        // If cache exists, return from cache
        const cacheKey = 'adminTopics';
        const cachedData = await redis_1.redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const topics = await topic_model_1.Topic.findAll({
            order: [['createdAt', 'DESC']],
        });
        // Cache the result for 5 minutes
        await redis_1.redis.set(cacheKey, JSON.stringify({
            success: true,
            topics,
        }), 'EX', 300);
        res.status(200).json({
            success: true,
            topics,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Add content to topic
exports.addTopicContent = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const { title, description, videoUrl, videoThumbnail, videoSection, videoLength, videoPlayer, links, suggestion, position } = req.body;
        // Validate required fields
        if (!title || !description || !videoUrl) {
            return next(new ErrorHandler_1.default("Please provide all required fields", 400));
        }
        // Find the topic
        const topic = await topic_model_1.Topic.findByPk(topicId);
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Check if user is allowed to add content to this topic
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to add content to this topic", 403));
        }
        // Get max position if not provided
        let contentPosition = position;
        if (!contentPosition) {
            const maxPositionContent = await topic_content_model_1.TopicContent.findOne({
                where: { topicId },
                order: [['position', 'DESC']],
            });
            contentPosition = maxPositionContent ? maxPositionContent.position + 1 : 1;
        }
        // Create the content
        const content = await topic_content_model_1.TopicContent.create({
            topicId,
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
        await redis_1.redis.del(`topic-${topicId}`);
        res.status(201).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Update topic content
exports.updateTopicContent = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const { title, description, videoUrl, videoThumbnail, videoSection, videoLength, videoPlayer, links, suggestion, position, isActive } = req.body;
        // Find the content
        const content = await topic_content_model_1.TopicContent.findByPk(contentId);
        if (!content) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        // Find the topic to check authorization
        const topic = await topic_model_1.Topic.findByPk(content.topicId);
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Check if user is allowed to update this content
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to update this content", 403));
        }
        // Update fields if provided
        if (title)
            content.title = title;
        if (description)
            content.description = description;
        if (videoUrl)
            content.videoUrl = videoUrl;
        if (videoThumbnail)
            content.videoThumbnail = videoThumbnail;
        if (videoSection)
            content.videoSection = videoSection;
        if (videoLength)
            content.videoLength = videoLength;
        if (videoPlayer)
            content.videoPlayer = videoPlayer;
        if (links)
            content.links = links;
        if (suggestion)
            content.suggestion = suggestion;
        if (position)
            content.position = position;
        if (isActive !== undefined)
            content.isActive = isActive;
        await content.save();
        // Clear cache
        await redis_1.redis.del(`topic-${content.topicId}`);
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete topic content
exports.deleteTopicContent = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { contentId } = req.params;
        // Find the content
        const content = await topic_content_model_1.TopicContent.findByPk(contentId);
        if (!content) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        // Find the topic to check authorization
        const topic = await topic_model_1.Topic.findByPk(content.topicId);
        if (!topic) {
            return next(new ErrorHandler_1.default("Topic not found", 404));
        }
        // Check if user is allowed to delete this content
        if (req.user.id !== topic.userId && req.user.role !== "admin") {
            return next(new ErrorHandler_1.default("You are not authorized to delete this content", 403));
        }
        // Soft delete by setting isActive to false
        content.isActive = false;
        await content.save();
        // Clear cache
        await redis_1.redis.del(`topic-${content.topicId}`);
        res.status(200).json({
            success: true,
            message: "Content deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
