// routes/historyRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToHistory, getHistory, clearHistory } from "../controllers/historyController.js";

const router = express.Router();

router.post("/:videoId", protect, addToHistory); // Add to history
router.get("/", protect, getHistory);            // Get history
router.delete("/", protect, clearHistory);       // Clear history

export default router;
