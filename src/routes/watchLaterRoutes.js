// routes/watchLaterRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWatchLater,
  removeFromWatchLater,
  getWatchLater,
} from "../controllers/watchLaterController.js";

const router = express.Router();

router.post("/:videoId", protect, addToWatchLater);   // Add video
router.delete("/:videoId", protect, removeFromWatchLater); // Remove video
router.get("/", protect, getWatchLater);              // Get all

export default router;
