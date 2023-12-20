import express from "express";
import { addLecture, createcourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, authorizeSubscribers, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
//get all courses without lectures
router.route("/courses").get(getAllCourses);
//create new corses - only admin
router.route("/createcourse").post(isAuthenticated, authorizeAdmin ,singleUpload ,createcourse)
//get lectures, add lectures and deleteLectures
router.route("/course/:id").get(isAuthenticated, authorizeSubscribers, getCourseLectures).post(isAuthenticated , authorizeAdmin , singleUpload ,addLecture).delete(isAuthenticated, authorizeAdmin, deleteCourse);
//delete lecture
router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);
export default router;