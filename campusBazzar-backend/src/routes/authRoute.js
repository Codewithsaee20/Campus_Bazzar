import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get User Profile
router.get("/profile", verifyToken, getUserProfile);

export default router;