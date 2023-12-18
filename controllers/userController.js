import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return next(new ErrorHandler("Please enter all fiels", 400));

    let user = await User.findOne({email});

    if(user) return next(new ErrorHandler("User Already Exists",409));

    user = await User.create({
        name,
        email,
        password,
    });
    sendToken(res, user, "Registered Successfully", 201)
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if ( !email || !password)
        return next(new ErrorHandler("Please enter all fiels", 400));

    let user = await User.findOne({email}).select("+password");

    if(!user) return next(new ErrorHandler("Incorrect email or password",401));

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return next(new ErrorHandler("Incorrect email or password",401));

    sendToken(res, user, `Welcome back ${user.name}`, 200)
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        // secure: true,
        sameSite: "none",
    }).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

export const changepassword = catchAsyncError(async (req, res, next) => {
    
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter all fields",400));
    }
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch) return next(new ErrorHandler("Incorrect old password", 400));

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    
    const {name, email} = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated successfully",
    });
});    

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    
    const {email} = req.body;
    
    const user = await User.findOne({ email });

    if(!user) return next(new ErrorHandler("User not found", 400));

    const resetToken = await user.getResetToken();

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password . ${url}. If you have not requested then please ignore this email.`
    await sendEmail(user.email, "Learnr Reset Password", message)

    res.status(200).json({
        success: true,
        message: `Reset Password Link has been shared to ${user.email} `,
    });
}); 

export const resetPassword = catchAsyncError(async (req, res, next) => {
    
   const {token} = req.params;

   const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
        $gt: Date.now(),
    },
   });

   if(!user) return next(new ErrorHandler("Token is invalid", 400));

   user.password = req.body.password;
   user.resetPasswordToken= undefined;
   user.resetPasswordExpire= undefined;

   await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed successfully",
        token,
    });
}); 

export const addtoplaylist = catchAsyncError(async (req,res,next) =>{
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if(!course) return next(new ErrorHandler("Invalid Course Id",404));

    const itemExist = user.playlist.find((item) => {
        if(item.course.toString() === course._id.toString()) return true;
    });

    if(itemExist) return next(new ErrorHandler("Item Already Exist",409));

    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Added to Playlist",
    });
});

export const removefromplaylist = catchAsyncError(async (req,res,next) =>{
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.query.id);

    if(!course) return next(new ErrorHandler("Invalid Course Id", 409));

    const newPlaylist = user.playlist.filter((item) =>{
        if(item.course.toString() !== course._id.toString()) return item;
    });

    user.playlist = newPlaylist;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Removed From Playlist",
    });
});