// routes/likeRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { likeVideo, dislikeVideo } from "../controllers/likeController.js";

const router = express.Router();

// Like & Dislike
router.post("/:videoId/like", protect, likeVideo);
router.post("/:videoId/dislike", protect, dislikeVideo);

export default router;
