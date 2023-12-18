import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {Course} from "../models/Course.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAllCourses = catchAsyncError(async(req, res, next)=>{
    const courses = await Course.find().select("-lectures");
    res.status(200).json({
        success: true,
        courses,
    });
});

export const createcourse = catchAsyncError(async(req, res, next)=>{
    const {title, description, category, createdBy} = req.body;

    if(!title || !description || !category || !createdBy) return next(new ErrorHandler("Please add all fields", 400));

    // const file = req.file;

    await Course.create({
        title,
        description,
        category,
        createdBy,
        poster: {
            public_id: "tempo",
            url: "tempo",
        },
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully . You can add lectures now."
    });
});

export const getCourseLectures = catchAsyncError(async (req,res, next) =>{
    const course = await Course.findById(req.params.id);

    if(!course) return next(new ErrorHandler("Course Not Found", 404));

    course.views +=1;
    await course.save();

    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});

