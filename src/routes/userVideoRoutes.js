// routes/userVideoRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWatchLater,
  removeFromWatchLater,
  getWatchLater,
  addToHistory,
  getHistory,
} from "../controllers/userVideoController.js";

const router = express.Router();


// History
router.post("/history/:id", protect, addToHistory);
router.get("/history", protect, getHistory);

export default router;
