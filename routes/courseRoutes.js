import express from "express";
import { createcourse, getAllCourses } from "../controllers/courseController.js";

const router = express.Router();
router.route("/courses").get(getAllCourses);
router.route("/createcourse").post(createcourse)

export default router;