import express from "express";
import { createcourse, getAllCourses, getCourseLectures } from "../controllers/courseController.js";

const router = express.Router();
router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(createcourse)
router.route("/course/:id").get(getCourseLectures);
export default router;