import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json(new ApiResponse(false, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return res.status(401).json(new ApiResponse(false, "Not authorized, no token"));
  }
};

// Admin-only
export const requireAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json(new ApiResponse(false, "Admin access required"));
};

// Alias
export const requireAuth = protect;
