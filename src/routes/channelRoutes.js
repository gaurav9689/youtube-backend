// routes/channelRoutes.js
import express from "express";
import { createChannel, subscribeChannel } from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.post("/:id/subscribe", protect, subscribeChannel);

export default router;
