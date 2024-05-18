import express from "express";
import {
  register,
  getMyProfile,
  login,
  logout,
} from "../controllers/authController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

export default router;
