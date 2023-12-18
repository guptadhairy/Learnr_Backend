import express from "express";
import { addtoplaylist, changepassword, forgetPassword, getMyProfile, login, logout, register, removefromplaylist, resetPassword, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated ,getMyProfile);
router.route("/changepassword").put(isAuthenticated, changepassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").put(resetPassword);
router.route("/addtoplaylist").post(isAuthenticated, addtoplaylist);
router.route("/removefromplaylist").delete(isAuthenticated, removefromplaylist);
export default router;
