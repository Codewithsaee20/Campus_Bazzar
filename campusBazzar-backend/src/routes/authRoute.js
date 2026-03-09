import express from "express";
import { login, register, getUserProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Get User Profile
router.get("/profile", verifyToken, getUserProfile);

export default router;