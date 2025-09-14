// routes/commentRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addComment,
  getComments,
  getReplies,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Dummy comments for testing
const dummyComments = [
  {
    _id: "c1",
    text: "Great video!",
    userId: { _id: "u1", username: "user1" },
    channelName: "user1",
    video: "1"
  },
  {
    _id: "c2",
    text: "Nice content!",
    userId: { _id: "u2", username: "user2" },
    channelName: "user2",
    video: "1"
  },
  {
    _id: "c3",
    text: "Awesome!",
    userId: { _id: "u1", username: "user1" },
    channelName: "user1",
    video: "2"
  },
  {
    _id: "c4",
    text: "Keep it up!",
    userId: { _id: "u3", username: "user3" },
    channelName: "user3",
    video: "3"
  },
];

// Comments on a video
router.post("/:videoId", protect, addComment);
router.get("/:videoId", (req, res) => {
  const comments = dummyComments.filter(c => c.video === req.params.videoId);
  res.json(comments);
});

// Replies
router.get("/replies/:commentId", getReplies);

// Edit comment
router.put("/:commentId", protect, editComment);

// Delete comment
router.delete("/:commentId", protect, deleteComment);

export default router;
