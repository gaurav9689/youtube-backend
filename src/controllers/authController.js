import { z } from "zod";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Zod validation schemas
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// JWT helper
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Register
export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const exists = await User.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  if (exists) throw new AppError(StatusCodes.CONFLICT, "User already exists");

  const user = await User.create(data);
  const token = signToken(user._id);

  res
    .status(StatusCodes.CREATED)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(true, "Registered successfully", {
        token,
        user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl },
      })
    );
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

  const valid = await user.comparePassword(password);
  if (!valid) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

  const token = signToken(user._id);

  res
    .status(StatusCodes.OK)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(true, "Logged in successfully", {
        token,
        user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl },
      })
    );
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token").status(StatusCodes.OK).json(new ApiResponse(true, "Logged out"));
});

// Profile
export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Not authenticated");
  res.status(StatusCodes.OK).json(new ApiResponse(true, "Profile retrieved", { user: req.user }));
});
