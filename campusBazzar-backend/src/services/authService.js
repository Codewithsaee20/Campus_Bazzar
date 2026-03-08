import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};


// Register User
const registerUser = async ({ name, email, password, college }) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError("User already exists", 400);
    }

    const user = await User.create({
        name,
        email,
        password,
        college
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
            profilePic: user.profilePic,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};


// Login User
const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            college: user.college,
            profilePic: user.profilePic,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};


// Get User
const getUser = async (userId) => {

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    return user;
};

export {
    registerUser,
    loginUser,
    getUser
};