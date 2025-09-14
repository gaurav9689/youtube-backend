import express from "express";
import { subscribe, unsubscribe } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, subscribe);
router.delete("/:channelId", protect, unsubscribe);

export default router;
