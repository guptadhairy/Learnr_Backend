import express from "express";
import { addtoplaylist, changepassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removefromplaylist, resetPassword, upadteUserRole, updateProfile } from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated ,getMyProfile);
router.route("/me").delete(isAuthenticated, deleteMyProfile);
router.route("/changepassword").put(isAuthenticated, changepassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").put(resetPassword);
router.route("/addtoplaylist").post(isAuthenticated, addtoplaylist);
router.route("/removefromplaylist").delete(isAuthenticated, removefromplaylist);

// Admin Routes

router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);
router.route("/admin/user/:id").put(isAuthenticated, authorizeAdmin, upadteUserRole).delete(isAuthenticated, authorizeAdmin, deleteUser);
export default router;
