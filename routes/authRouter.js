import express from "express";
import {
  register,
  getMyProfile,
  login,
  logout,
  updateProfile,
  follow,
} from "../controllers/authController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", singleUpload, register);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);
router.get("/update-profile", isAuthenticated, updateProfile);
router.get("/follow/:id", isAuthenticated, follow);

export default router;
