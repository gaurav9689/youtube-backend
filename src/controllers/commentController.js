// src/controllers/commentController.js
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js"; // Import Notification model
import Video from "../models/Video.js"; // Import Video model

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text, parentComment } = req.body;

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: videoId,
      parentComment: parentComment || null,
    });

    // Create a notification for the video owner
    const video = await Video.findById(videoId);
    if (video && !video.user.equals(req.user._id)) { // don't notify if user comments on own video
      await Notification.create({
        user: video.user,      // receiver
        sender: req.user._id,  // commenter
        type: "comment",
        video: videoId,
        message: `${req.user.username} commented on your video.`,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a video
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId, parentComment: null })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get replies for a comment
export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({ parentComment: commentId })
      .populate("user", "username email")
      .sort({ createdAt: 1 });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
