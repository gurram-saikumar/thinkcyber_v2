"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.generateVideoUrl = exports.deleteCourse = exports.getAllCoursesAdmin = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const course_model_1 = require("../models/course.model");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadCourse = async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        // Ensure estimatedPrice is set
        if (data.estimatedPrice === undefined || data.estimatedPrice === null) {
            data.estimatedPrice = "";
        }
        data.userId = req.user?.id;
        console.log("Creating course with data:", {
            ...data,
            estimatedPrice: data.estimatedPrice,
            thumbnail: data.thumbnail ? 'thumbnail present' : 'no thumbnail'
        });
        const course = await course_model_1.Course.create(data);
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.uploadCourse = uploadCourse;
const editCourse = async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseIdParam = req.params.id;
        console.log("Edit course request received for ID:", courseIdParam);
        // Try to decode the ID in case it's URL encoded
        let courseId;
        try {
            courseId = decodeURIComponent(courseIdParam);
        }
        catch (e) {
            courseId = courseIdParam;
        }
        console.log("Looking for course to edit with ID:", courseId);
        // First try finding by primary key
        let course = await course_model_1.Course.findByPk(courseId);
        // If not found, try alternate ways to find the course
        if (!course) {
            console.log("Course not found by primary key, trying alternative lookups");
            // Try finding by name (for user-friendly URLs)
            course = await course_model_1.Course.findOne({
                where: { name: courseId }
            });
            // If still not found, try finding by demoUrl
            if (!course) {
                course = await course_model_1.Course.findOne({
                    where: { demoUrl: courseId }
                });
            }
        }
        if (!course) {
            console.log("Course not found after all lookup attempts");
            return next(new ErrorHandler_1.default(`Course not found with ID or name: ${courseId}`, 404));
        }
        console.log("Course found for editing:", course.id);
        if (thumbnail && thumbnail.public_id && thumbnail.url) {
            // Thumbnail is already a cloudinary object, no need to re-upload
            console.log("Using existing thumbnail");
        }
        else if (thumbnail && !thumbnail.startsWith("https")) {
            console.log("Uploading new thumbnail to cloudinary");
            await cloudinary_1.default.uploader.destroy(course.thumbnail.public_id);
            const myCloud = await cloudinary_1.default.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        console.log("Updating course with data", JSON.stringify({
            ...data,
            estimatedPrice: data.estimatedPrice || "",
            _id: data._id,
            id: data.id
        }, null, 2).substring(0, 300) + "...");
        // Ensure estimatedPrice is included and properly formatted
        if (data.estimatedPrice === undefined || data.estimatedPrice === null) {
            data.estimatedPrice = "";
        }
        const updatedCourse = await course.update(data);
        console.log("Course updated successfully");
        res.status(200).json({
            success: true,
            course: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error in editCourse:", error);
        // Provide more detailed error information
        let errorMessage = "Error updating course";
        if (error instanceof Error) {
            errorMessage = error.message;
            console.error("Error details:", {
                name: error.name,
                stack: error.stack
            });
        }
        else if (typeof error === 'object' && error !== null) {
            console.error("Error details:", error);
        }
        // Add details to the message for better client-side debugging
        next(new ErrorHandler_1.default(`${errorMessage} (See server logs for details)`, 500));
    }
};
exports.editCourse = editCourse;
const getSingleCourse = async (req, res, next) => {
    try {
        const courseIdParam = req.params.id;
        console.log("Received course ID param:", courseIdParam);
        // Try to decode the ID in case it's URL encoded
        let courseId;
        try {
            courseId = decodeURIComponent(courseIdParam);
        }
        catch (e) {
            courseId = courseIdParam;
        }
        console.log("Looking for course with ID:", courseId);
        // First try finding by primary key
        let course = await course_model_1.Course.findByPk(courseId, {
            attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
        });
        // If not found, try alternate ways to find the course
        if (!course) {
            console.log("Course not found by primary key, trying alternative lookups");
            // Try finding by name (for user-friendly URLs)
            course = await course_model_1.Course.findOne({
                where: { name: courseId },
                attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
            });
            // If still not found, try finding by demoUrl
            if (!course) {
                course = await course_model_1.Course.findOne({
                    where: { demoUrl: courseId },
                    attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
                });
            }
        }
        if (!course) {
            console.log("Course not found after all lookup attempts");
            return next(new ErrorHandler_1.default(`Course not found with ID or name: ${courseId}`, 404));
        }
        console.log("Course found:", course.id);
        console.log("Course estimatedPrice:", course.estimatedPrice);
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        console.error("Error in getSingleCourse:", error);
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.getSingleCourse = getSingleCourse;
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await course_model_1.Course.findAll({
            attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
        });
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.getAllCourses = getAllCourses;
const getCourseByUser = async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course.id === courseId);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.Course.findByPk(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        res.status(200).json({
            success: true,
            content: course.courseData,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.getCourseByUser = getCourseByUser;
const addQuestion = async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_model_1.Course.findByPk(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const courseContent = course.courseData.find((item) => item.id === contentId);
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 404));
        }
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);
        await course.save();
        await notification_Model_1.default.create({
            userId: course.userId,
            title: "New Question",
            message: `You have a new question in ${course.name}`,
            status: "unread"
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.addQuestion = addQuestion;
const addAnswer = async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await course_model_1.Course.findByPk(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const courseContent = course.courseData.find((item) => item.id === contentId);
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Invalid content id", 404));
        }
        const question = courseContent.questions.find((item) => item.id === questionId);
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id", 404));
        }
        const newAnswer = {
            user: req.user,
            answer,
        };
        question.questionReplies.push(newAnswer);
        await course.save();
        await notification_Model_1.default.create({
            userId: question.user.id,
            title: "New Answer",
            message: `You have a new answer in ${course.name}`,
            status: "unread"
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.addAnswer = addAnswer;
const addReview = async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.some((course) => course.id === courseId);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.Course.findByPk(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            rating,
            comment: review,
        };
        course.reviews.push(reviewData);
        let avg = 0;
        course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length;
        }
        await course.save();
        await notification_Model_1.default.create({
            userId: course.userId,
            title: "New Review",
            message: `You have a new review in ${course.name}`,
            status: "unread"
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.addReview = addReview;
const addReplyToReview = async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await course_model_1.Course.findByPk(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const review = course.reviews.find((rev) => rev.id === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 404));
        }
        const replyData = {
            user: req.user,
            comment,
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies.push(replyData);
        await course.save();
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.addReplyToReview = addReplyToReview;
const getAllCoursesAdmin = async (req, res, next) => {
    try {
        const courses = await course_model_1.Course.findAll();
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.getAllCoursesAdmin = getAllCoursesAdmin;
const deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.Course.findByPk(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        await course.destroy();
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
};
exports.deleteCourse = deleteCourse;
const generateVideoUrl = async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 400));
    }
};
exports.generateVideoUrl = generateVideoUrl;
const uploadVideo = async (req, res, next) => {
    try {
        if (!req.files || !req.files.video) {
            return next(new ErrorHandler_1.default("Please provide a video", 400));
        }
        const videoFile = req.files.video;
        if (Array.isArray(videoFile)) {
            return next(new ErrorHandler_1.default("Please upload only one video", 400));
        }
        // Check file size (50MB limit)
        if (videoFile.size > 50 * 1024 * 1024) {
            return next(new ErrorHandler_1.default("Video size should be less than 50MB", 400));
        }
        // Check file type
        if (!videoFile.mimetype.startsWith('video/')) {
            return next(new ErrorHandler_1.default("Please upload a valid video file", 400));
        }
        // Ensure temp directory exists
        const tempDir = path_1.default.join(process.cwd(), 'tmp');
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        // Save file to temp directory
        const tempFilePath = path_1.default.join(tempDir, `${Date.now()}-${videoFile.name}`);
        await videoFile.mv(tempFilePath);
        try {
            // Upload to Cloudinary
            const result = await cloudinary_1.default.uploader.upload(tempFilePath, {
                resource_type: "video",
                folder: "course-videos",
                chunk_size: 6000000,
                timeout: 120000, // 2 minutes timeout
            });
            // Clean up temp file
            fs_1.default.unlinkSync(tempFilePath);
            res.status(200).json({
                success: true,
                videoUrl: result.secure_url,
            });
        }
        catch (uploadError) {
            // Clean up temp file in case of upload error
            if (fs_1.default.existsSync(tempFilePath)) {
                fs_1.default.unlinkSync(tempFilePath);
            }
            console.error('Cloudinary upload error:', uploadError);
            next(new ErrorHandler_1.default(uploadError.message || "Error uploading to Cloudinary", 500));
        }
    }
    catch (error) {
        console.error('Video upload error:', error);
        next(new ErrorHandler_1.default(error.message || "Error processing video upload", 500));
    }
};
exports.uploadVideo = uploadVideo;
const courseController = {
    uploadCourse: exports.uploadCourse,
    editCourse: exports.editCourse,
    getSingleCourse: exports.getSingleCourse,
    getAllCourses: exports.getAllCourses,
    getCourseByUser: exports.getCourseByUser,
    addQuestion: exports.addQuestion,
    addAnswer: exports.addAnswer,
    addReview: exports.addReview,
    addReplyToReview: exports.addReplyToReview,
    getAllCoursesAdmin: exports.getAllCoursesAdmin,
    deleteCourse: exports.deleteCourse,
    generateVideoUrl: exports.generateVideoUrl,
    uploadVideo: exports.uploadVideo
};
exports.default = courseController;
