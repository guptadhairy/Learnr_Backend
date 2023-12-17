import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";

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