import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { Course } from "../models/course.model";
import cloudinary from "../utils/cloudinary";
import Notification from "../models/notification.Model";
import axios from "axios";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";

interface CustomRequest extends Request {
  files?: {
    video?: UploadedFile | UploadedFile[];
  };
}

export const uploadCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;

    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
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

    const course = await Course.create(data);

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const editCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    const courseIdParam = req.params.id;
    
    console.log("Edit course request received for ID:", courseIdParam);
    
    // Try to decode the ID in case it's URL encoded
    let courseId;
    try {
      courseId = decodeURIComponent(courseIdParam);
    } catch (e) {
      courseId = courseIdParam;
    }
    
    console.log("Looking for course to edit with ID:", courseId);
    
    // First try finding by primary key
    let course = await Course.findByPk(courseId);
    
    // If not found, try alternate ways to find the course
    if (!course) {
      console.log("Course not found by primary key, trying alternative lookups");
      
      // Try finding by name (for user-friendly URLs)
      course = await Course.findOne({
        where: { name: courseId }
      });
      
      // If still not found, try finding by demoUrl
      if (!course) {
        course = await Course.findOne({
          where: { demoUrl: courseId }
        });
      }
    }

    if (!course) {
      console.log("Course not found after all lookup attempts");
      return next(new ErrorHandler(`Course not found with ID or name: ${courseId}`, 404));
    }

    console.log("Course found for editing:", course.id);

    if (thumbnail && thumbnail.public_id && thumbnail.url) {
      // Thumbnail is already a cloudinary object, no need to re-upload
      console.log("Using existing thumbnail");
    } else if (thumbnail && !thumbnail.startsWith("https")) {
      console.log("Uploading new thumbnail to cloudinary");
      await cloudinary.uploader.destroy(course.thumbnail.public_id);

      const myCloud = await cloudinary.uploader.upload(thumbnail, {
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
  } catch (error: any) {
    console.error("Error in editCourse:", error);
    // Provide more detailed error information
    let errorMessage = "Error updating course";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error details:", {
        name: error.name,
        stack: error.stack
      });
    } else if (typeof error === 'object' && error !== null) {
      console.error("Error details:", error);
    }
    
    // Add details to the message for better client-side debugging
    next(new ErrorHandler(`${errorMessage} (See server logs for details)`, 500));
  }
};

export const getSingleCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseIdParam = req.params.id;
    console.log("Received course ID param:", courseIdParam);
    
    // Try to decode the ID in case it's URL encoded
    let courseId;
    try {
      courseId = decodeURIComponent(courseIdParam);
    } catch (e) {
      courseId = courseIdParam;
    }
    
    console.log("Looking for course with ID:", courseId);
    
    // First try finding by primary key
    let course = await Course.findByPk(courseId, {
      attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
    });
    
    // If not found, try alternate ways to find the course
    if (!course) {
      console.log("Course not found by primary key, trying alternative lookups");
      
      // Try finding by name (for user-friendly URLs)
      course = await Course.findOne({
        where: { name: courseId },
        attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
      });
      
      // If still not found, try finding by demoUrl
      if (!course) {
        course = await Course.findOne({
          where: { demoUrl: courseId },
          attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
        });
      }
    }

    if (!course) {
      console.log("Course not found after all lookup attempts");
      return next(new ErrorHandler(`Course not found with ID or name: ${courseId}`, 404));
    }

    console.log("Course found:", course.id);
    console.log("Course estimatedPrice:", course.estimatedPrice);
    
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    console.error("Error in getSingleCourse:", error);
    next(new ErrorHandler(error.message, 500));
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.findAll({
      attributes: { exclude: ['courseData.videoUrl', 'courseData.suggestion', 'courseData.questions', 'courseData.links'] }
    });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const getCourseByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find(
      (course: any) => course.id === courseId
    );

    if (!courseExists) {
      return next(
        new ErrorHandler("You are not eligible to access this course", 404)
      );
    }

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      content: course.courseData,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, courseId, contentId } = req.body;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const courseContent = course.courseData.find(
      (item: any) => item.id === contentId
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 404));
    }

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    courseContent.questions.push(newQuestion);

    await course.save();

    await Notification.create({
      userId: course.userId,
      title: "New Question",
      message: `You have a new question in ${course.name}`,
      status: "unread"
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const addAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const courseContent = course.courseData.find(
      (item: any) => item.id === contentId
    );

    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 404));
    }

    const question = courseContent.questions.find(
      (item: any) => item.id === questionId
    );

    if (!question) {
      return next(new ErrorHandler("Invalid question id", 404));
    }

    const newAnswer: any = {
      user: req.user,
      answer,
    };

    question.questionReplies.push(newAnswer);

    await course.save();

    await Notification.create({
      userId: question.user.id,
      title: "New Answer",
      message: `You have a new answer in ${course.name}`,
      status: "unread"
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.some(
      (course: any) => course.id === courseId
    );

    if (!courseExists) {
      return next(
        new ErrorHandler("You are not eligible to access this course", 404)
      );
    }

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const { review, rating } = req.body;

    const reviewData: any = {
      user: req.user,
      rating,
      comment: review,
    };

    course.reviews.push(reviewData);

    let avg = 0;

    course.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });

    if (course) {
      course.ratings = avg / course.reviews.length;
    }

    await course.save();

    await Notification.create({
      userId: course.userId,
      title: "New Review",
      message: `You have a new review in ${course.name}`,
      status: "unread"
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const addReplyToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment, courseId, reviewId } = req.body;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    const review = course.reviews.find(
      (rev: any) => rev.id === reviewId
    );

    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }

    const replyData: any = {
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
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const getAllCoursesAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.findAll();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const generateVideoUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { videoId } = req.body;
    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      { ttl: 300 },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    next(new ErrorHandler(error.message, 400));
  }
};

export const uploadVideo = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !req.files.video) {
      return next(new ErrorHandler("Please provide a video", 400));
    }

    const videoFile = req.files.video;
    if (Array.isArray(videoFile)) {
      return next(new ErrorHandler("Please upload only one video", 400));
    }

    // Check file size (50MB limit)
    if (videoFile.size > 50 * 1024 * 1024) {
      return next(new ErrorHandler("Video size should be less than 50MB", 400));
    }

    // Check file type
    if (!videoFile.mimetype.startsWith('video/')) {
      return next(new ErrorHandler("Please upload a valid video file", 400));
    }

    // Ensure temp directory exists
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save file to temp directory
    const tempFilePath = path.join(tempDir, `${Date.now()}-${videoFile.name}`);
    await videoFile.mv(tempFilePath);

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "video",
        folder: "course-videos",
        chunk_size: 6000000, // 6MB chunks for better upload handling
        timeout: 120000, // 2 minutes timeout
      });

      // Clean up temp file
      fs.unlinkSync(tempFilePath);

      res.status(200).json({
        success: true,
        videoUrl: result.secure_url,
      });
    } catch (uploadError: any) {
      // Clean up temp file in case of upload error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      console.error('Cloudinary upload error:', uploadError);
      next(new ErrorHandler(uploadError.message || "Error uploading to Cloudinary", 500));
    }
  } catch (error: any) {
    console.error('Video upload error:', error);
    next(new ErrorHandler(error.message || "Error processing video upload", 500));
  }
};

const courseController = {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  addReplyToReview,
  getAllCoursesAdmin,
  deleteCourse,
  generateVideoUrl,
  uploadVideo
};

export default courseController;
