"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = __importDefault(require("../controllers/course.controller"));
const auth_1 = require("../middleware/auth");
const courseRouter = express_1.default.Router();
/**
 * @swagger
 * /api/v1/course/create-course:
 *   post:
 *     summary: Create a new course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categories
 *               - level
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categories:
 *                 type: string
 *               level:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               demoUrl:
 *                 type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
courseRouter.post("/create-course", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.default.uploadCourse);
/**
 * @swagger
 * /api/v1/course/edit-course/{id}:
 *   put:
 *     summary: Edit a course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categories:
 *                 type: string
 *               level:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               demoUrl:
 *                 type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
courseRouter.put("/edit-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.default.editCourse);
/**
 * @swagger
 * /api/v1/course/get-course/{id}:
 *   get:
 *     summary: Get a single course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
courseRouter.get("/get-course/:id", course_controller_1.default.getSingleCourse);
/**
 * @swagger
 * /api/v1/course/get-courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
courseRouter.get("/get-courses", course_controller_1.default.getAllCourses);
/**
 * @swagger
 * /api/v1/course/get-admin-courses:
 *   get:
 *     summary: Get all courses (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
courseRouter.get("/get-admin-courses", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.default.getAllCoursesAdmin);
/**
 * @swagger
 * /api/v1/course/get-course-content/{id}:
 *   get:
 *     summary: Get course content for enrolled user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course content retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Course not found
 */
courseRouter.get("/get-course-content/:id", auth_1.isAuthenticated, course_controller_1.default.getCourseByUser);
/**
 * @swagger
 * /api/v1/course/add-question:
 *   put:
 *     summary: Add a question to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - contentId
 *               - question
 *             properties:
 *               courseId:
 *                 type: integer
 *               contentId:
 *                 type: string
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question added successfully
 *       401:
 *         description: Not authenticated
 */
courseRouter.put("/add-question", auth_1.isAuthenticated, course_controller_1.default.addQuestion);
/**
 * @swagger
 * /api/v1/course/add-answer:
 *   put:
 *     summary: Add an answer to a question
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - contentId
 *               - questionId
 *               - answer
 *             properties:
 *               courseId:
 *                 type: integer
 *               contentId:
 *                 type: string
 *               questionId:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer added successfully
 *       401:
 *         description: Not authenticated
 */
courseRouter.put("/add-answer", auth_1.isAuthenticated, course_controller_1.default.addAnswer);
/**
 * @swagger
 * /api/v1/course/add-review/{id}:
 *   put:
 *     summary: Add a review to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review added successfully
 *       401:
 *         description: Not authenticated
 */
courseRouter.put("/add-review/:id", auth_1.isAuthenticated, course_controller_1.default.addReview);
/**
 * @swagger
 * /api/v1/course/add-reply:
 *   put:
 *     summary: Add a reply to a review (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - reviewId
 *               - reply
 *             properties:
 *               courseId:
 *                 type: integer
 *               reviewId:
 *                 type: string
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
courseRouter.put("/add-reply", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.default.addReplyToReview);
/**
 * @swagger
 * /api/v1/course/getVdoCipherOTP:
 *   post:
 *     summary: Generate video URL
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *             properties:
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video URL generated successfully
 */
courseRouter.post("/getVdoCipherOTP", course_controller_1.default.generateVideoUrl);
/**
 * @swagger
 * /api/v1/course/upload-video:
 *   post:
 *     summary: Upload a video
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 */
courseRouter.post("/upload-video", course_controller_1.default.uploadVideo);
/**
 * @swagger
 * /api/v1/course/delete-course/{id}:
 *   delete:
 *     summary: Delete a course (admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
courseRouter.delete("/delete-course/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), course_controller_1.default.deleteCourse);
exports.default = courseRouter;
