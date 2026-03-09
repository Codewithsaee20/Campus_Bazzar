import { registerUser, loginUser, getUser } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
};


// Register User
const register = asyncHandler(async (req, res) => {

    console.log("REQ BODY:", req.body)

    const { name, email, password, college } = req.body;

    if (!name || !email || !password || !college) {
        throw new ApiError("All fields are required", 400);
    }

    const result = await registerUser({ name, email, password, college });

    return res
    .status(201)
    .cookie("accessToken", result.accessToken, cookieOptions)
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json(
        new ApiResponse(201, {
            user: result.user,
            accessToken: result.accessToken  // ← ADD THIS
        }, "User registered successfully")
    );
});


// Login User
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError("Email and password are required", 400);
    }

    const result = await loginUser({ email, password });

    return res
    .status(200)
    .cookie("accessToken", result.accessToken, cookieOptions)
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json(
        new ApiResponse(200, {
            user: result.user,
            accessToken: result.accessToken  // ← ADD THIS
        }, "User logged in successfully")
    );
});


// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await getUser(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User profile fetched successfully"
        )
    );
});

export {
    register,
    login,
    getUserProfile
};